"""Demo server for the SPHEREx blink tool (NASA Space Apps Milano 2026, step 10).

Serves the page in web/ and one JSON endpoint, /api/frames, that wraps get_frames().
Standard library only, besides what spherex_frames.py already needs.

    python server.py            # then open http://localhost:8000/?target=Barnard

Every setting lives in the page URL, so one link is one view. The API takes the same
parameters: ra, dec (deg), size (arcsec), band (D1..D6), epoch (decimal year), pmra, pmdec
(mas/yr), name (cache label) and mask (1 to blank flagged pixels).
"""

import base64
import json
import math
import os
import sys
import threading
import traceback
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from spherex_frames import catalog_overlay, get_frames  # noqa: E402

WEB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")  # the repo root is the site
_cache, _locks, _guard = {}, {}, threading.Lock()
_jobs = {}  # job id from the page -> {"stage", "done", "total"}


def _num(v, nd=4):
    return None if v is None or not math.isfinite(v) else round(float(v), nd)


MAX_PER_PASS = 40   # an even sample per six-month pass keeps polar fields like R Dra quick


def pack(img):
    """An image as little-endian int16 in base64, about a third of the size of JSON numbers.
    value = lo + scale * (code + 32767), and code -32768 means no data."""
    a = np.asarray(img, dtype=float)
    ok = np.isfinite(a)
    if not ok.any():
        return 0.0, 1.0, base64.b64encode(np.full(a.size, -32768, "<i2").tobytes()).decode()
    lo, hi = float(a[ok].min()), float(a[ok].max())
    lo = round(lo, 6)
    scale = float(f"{(hi - lo) / 65534 or 1.0:.6g}")
    code = np.full(a.shape, -32768, dtype="<i2")
    code[ok] = np.clip(np.round((a[ok] - lo) / scale - 32767), -32767, 32767).astype("<i2")
    return lo, scale, base64.b64encode(code.ravel().tobytes()).decode()


def frames_json(q):
    ra, dec = float(q["ra"]), float(q["dec"])
    size = float(q.get("size", 108))
    band = q.get("band", "D1").upper()
    if band not in {f"D{i}" for i in range(1, 7)}:
        raise ValueError("band must be D1 to D6")
    if not (0 <= ra < 360 and -90 <= dec <= 90 and 20 <= size <= 900):
        raise ValueError("ra 0-360, dec -90-90, size 20-900 arcsec")
    epoch = float(q.get("epoch", 2016.0))
    pmra, pmdec = float(q.get("pmra", 0)), float(q.get("pmdec", 0))
    name = "".join(c for c in q.get("name", "") if c.isalnum()) or f"t{ra:.4f}_{dec:+.4f}"
    mask = q.get("mask", "0") == "1"
    fov = round(size / 3600, 4)
    maxpp = int(q.get("maxpp", MAX_PER_PASS))
    key = (ra, dec, fov, band, epoch, pmra, pmdec, name, mask, maxpp)

    with _guard:
        lock = _locks.setdefault(key, threading.Lock())
    job = q.get("job", "")[:40]

    def progress(stage, done, total):
        if job:
            _jobs[job] = dict(stage=stage, done=done, total=total)

    with lock:  # the same view asked twice waits for the first download instead of repeating it
        if key not in _cache:
            frames, grid = get_frames(ra, dec, band, fov, epoch, pmra, pmdec, name=name, mask=mask,
                                      progress=progress, max_per_pass=maxpp)
            out = []
            for f in frames:
                lo, scale, b64 = pack(f["image"])
                out.append(dict(
                    year=_num(f["year"], 5), mjd=_num(f["mjd"], 5),
                    wavelength_um=_num(f["wavelength_um"], 4), pass_index=f["pass_index"],
                    target_xy=[_num(v, 3) for v in f["target_xy"]],
                    lo=lo, scale=scale, image=b64, file=f["uri"].split("/")[-1]))
            overlays = {}
            if grid is not None:
                for kind in ("gaia", "catwise"):
                    try:
                        overlays[kind] = catalog_overlay(grid, kind)
                    except Exception as e:  # a catalogue that does not answer only loses its overlay
                        print(f"{kind} overlay failed: {e}")
            _cache[key] = json.dumps(dict(
                npix=int(grid.pixel_shape[0]) if grid is not None else 0,
                pixel_arcsec=6.15, band=band, encoding="int16-b64", frames=out,
                # the common north-up TAN grid: centre (crval), size, and reference pixel (0-based)
                grid=None if grid is None else dict(
                    ra=round(float(grid.wcs.crval[0]), 8), dec=round(float(grid.wcs.crval[1]), 8),
                    npix=int(grid.pixel_shape[0]), crpix0=float(grid.wcs.crpix[0] - 1)),
                overlays=overlays), separators=(",", ":")).encode()
    return _cache[key]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=WEB, **k)

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        q = dict(urllib.parse.parse_qsl(u.query))
        if u.path == "/api/progress":
            return self._send(200, json.dumps(_jobs.get(q.get("job", ""), {})).encode())
        if u.path != "/api/frames":
            return super().do_GET()
        try:
            body, code = frames_json(q), 200
        except (KeyError, ValueError) as e:
            body, code = json.dumps(dict(error=f"bad input: {e}")).encode(), 400
        except Exception as e:  # IRSA down, timeouts and the like
            traceback.print_exc()
            body, code = json.dumps(dict(error=f"{type(e).__name__}: {e}")).encode(), 502
        finally:
            _jobs.pop(q.get("job", ""), None)
        self._send(code, body)

    def _send(self, code, body):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"http://localhost:{port}/?target=Barnard")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
