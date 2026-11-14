"""Demo server for the SPHEREx blink tool (NASA Space Apps Milano 2026, step 10).

Serves the page in web/ and one JSON endpoint, /api/frames, that wraps get_frames().
Standard library only, besides what spherex_frames.py already needs.

    python server.py            # then open http://localhost:8000/?target=Barnard

Every setting lives in the page URL, so one link is one view. The API takes the same
parameters: ra, dec (deg), size (arcsec), band (D1..D6), epoch (decimal year), pmra, pmdec
(mas/yr), name (cache label) and mask (1 to blank flagged pixels).
"""

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
from spherex_frames import get_frames  # noqa: E402

WEB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")  # the repo root is the site
_cache, _locks, _guard = {}, {}, threading.Lock()
_jobs = {}  # job id from the page -> {"stage", "done", "total"}


def _num(v, nd=4):
    return None if v is None or not math.isfinite(v) else round(float(v), nd)


def frames_json(q):
    ra, dec = float(q["ra"]), float(q["dec"])
    size = float(q.get("size", 108))
    band = q.get("band", "D1").upper()
    if band not in {f"D{i}" for i in range(1, 7)}:
        raise ValueError("band must be D1 to D6")
    if not (0 <= ra < 360 and -90 <= dec <= 90 and 20 <= size <= 600):
        raise ValueError("ra 0-360, dec -90-90, size 20-600 arcsec")
    epoch = float(q.get("epoch", 2016.0))
    pmra, pmdec = float(q.get("pmra", 0)), float(q.get("pmdec", 0))
    name = "".join(c for c in q.get("name", "") if c.isalnum()) or f"t{ra:.4f}_{dec:+.4f}"
    mask = q.get("mask", "0") == "1"
    fov = round(size / 3600, 4)
    key = (ra, dec, fov, band, epoch, pmra, pmdec, name, mask)

    with _guard:
        lock = _locks.setdefault(key, threading.Lock())
    job = q.get("job", "")[:40]

    def progress(stage, done, total):
        if job:
            _jobs[job] = dict(stage=stage, done=done, total=total)

    with lock:  # the same view asked twice waits for the first download instead of repeating it
        if key not in _cache:
            frames, grid = get_frames(ra, dec, band, fov, epoch, pmra, pmdec, name=name, mask=mask,
                                      progress=progress)
            out = []
            for f in frames:
                img = np.round(f["image"].astype(float), 3)
                out.append(dict(
                    year=_num(f["year"], 5), mjd=_num(f["mjd"], 5),
                    wavelength_um=_num(f["wavelength_um"], 4), pass_index=f["pass_index"],
                    target_xy=[_num(v, 3) for v in f["target_xy"]],
                    image=[None if not math.isfinite(v) else v for v in img.ravel().tolist()],
                    file=f["uri"].split("/")[-1]))
            _cache[key] = json.dumps(dict(
                npix=int(grid.pixel_shape[0]) if grid is not None else 0,
                pixel_arcsec=6.15, band=band, frames=out)).encode()
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
