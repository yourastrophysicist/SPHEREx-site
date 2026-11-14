"""Data path for the SPHEREx blink tool (NASA Space Apps Milano 2026, step 9).

One call, get_frames(), takes a sky position (with an optional proper motion) and a detector,
asks IRSA which SPHEREx exposures cover it, downloads small cutouts in parallel, subtracts the
zodiacal light, masks bad pixels, and resamples every exposure onto one fixed north-up grid.
On that grid the field stars stand still and only things that move or change, move or change.

Built on our own prep scripts of 10 November 2026 (prep/scripts/render_spherex.py and
coadd_spherex.py in this repo): the TAP query, the proper-motion centring, the retrying cutout
download and the flag mask come from there.

Data: SPHEREx Level 2 spectral images, NASA/JPL-Caltech/IPAC, through NASA/IPAC IRSA.
Parts of this code were written with help from Claude (Anthropic).
"""
import csv
import http.client
import io
import json
import os
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from astropy.io import fits
from astropy.time import Time
from astropy.wcs import WCS
from scipy.ndimage import map_coordinates

TAP = "https://irsa.ipac.caltech.edu/TAP/sync"
PIX_DEG = 6.15 / 3600                      # SPHEREx pixel, 6.15 arcsec
NEEDED = ("IMAGE", "FLAGS", "VARIANCE", "ZODI", "WCS-WAVE")
# flag bits treated as bad, the same set as coadd_spherex.py
BAD_BITS = sum(1 << b for b in (0, 1, 6, 9, 10, 11, 15, 17, 19))
DATA_DIR = os.environ.get("SPHEREX_DATA", os.path.expanduser("~/spherex_data"))


def position(t_year, ra, dec, epoch, pmra, pmdec):
    """Linear proper motion (mas/yr) from epoch to t_year, in degrees."""
    dt = t_year - epoch
    return (ra + pmra / 1e3 * dt / 3600 / np.cos(np.radians(dec)),
            dec + pmdec / 1e3 * dt / 3600)


def tap(query):
    data = urllib.parse.urlencode({"QUERY": query, "FORMAT": "csv"}).encode()
    for attempt in range(5):
        try:
            with urllib.request.urlopen(TAP, data, timeout=180) as r:
                return list(csv.DictReader(io.StringIO(r.read().decode())))
        except (urllib.error.URLError, http.client.HTTPException, TimeoutError, ConnectionError) as e:
            if attempt == 4 or (isinstance(e, urllib.error.HTTPError) and e.code < 500):
                raise
            time.sleep(10 * (attempt + 1))


def find_exposures(ra, dec, band, data_dir=DATA_DIR, max_age_h=24):
    """Every SPHEREx Level 2 exposure of one detector whose footprint contains (ra, dec).

    The answer is kept for a day in data_dir, since the TAP query alone takes ~20 s and
    new SPHEREx data only arrive about once a week."""
    path = os.path.join(data_dir, f"exposures_{band}_{ra:.5f}_{dec:+.5f}.json")
    if os.path.exists(path) and time.time() - os.path.getmtime(path) < max_age_h * 3600:
        with open(path) as f:
            return json.load(f)
    rows = _query_exposures(ra, dec, band)
    os.makedirs(data_dir, exist_ok=True)
    with open(path, "w") as f:
        json.dump(rows, f)
    return rows


def _query_exposures(ra, dec, band):
    return tap(f"""SELECT a.uri, p.time_bounds_lower FROM spherex.artifact a JOIN spherex.plane p
    ON a.planeid = p.planeid WHERE 1 = CONTAINS(POINT('ICRS', {ra}, {dec}), p.poly)
    AND p.energy_bandpassname = 'SPHEREx-{band}' ORDER BY p.time_bounds_lower""")


def _complete(path):
    # a cutout cut short by the network opens fine but lacks the last extensions
    try:
        with fits.open(path, memmap=False) as h:
            return all(e in h for e in NEEDED)
    except Exception:
        return False


def _download(url, path):
    if _complete(path):
        return
    for attempt in range(8):  # IBE gives transient 503s and sometimes truncated files
        try:
            urllib.request.urlretrieve(url, path)
            if _complete(path):
                return
            raise http.client.IncompleteRead(b"")
        except (urllib.error.URLError, http.client.HTTPException, TimeoutError, ConnectionError) as e:
            if attempt == 7 or (isinstance(e, urllib.error.HTTPError) and e.code < 500):
                raise
            time.sleep(min(5 * 2 ** attempt, 60))


def make_grid(ra, dec, fov):
    """North-up TAN grid with SPHEREx pixels, fov degrees on a side, centred on (ra, dec)."""
    npix = int(round(fov / PIX_DEG)) | 1   # odd, so the target sits on the central pixel
    g = WCS(naxis=2)
    g.wcs.ctype = ["RA---TAN", "DEC--TAN"]
    g.wcs.crval = [ra, dec]
    g.wcs.crpix = [npix // 2 + 1] * 2
    g.wcs.cdelt = [-PIX_DEG, PIX_DEG]
    g.pixel_shape = (npix, npix)
    return g, npix


def get_frames(ra, dec, band="D1", fov=0.03, epoch=2016.0, pmra=0.0, pmdec=0.0,
               name="target", data_dir=DATA_DIR, workers=int(os.environ.get("SPHEREX_WORKERS", 4)), mask=True, progress=None,
               max_per_pass=None):
    """Aligned SPHEREx frames of one sky patch.

    ra, dec, epoch, pmra, pmdec: position in degrees at epoch (decimal year) and proper motion
    in mas/yr. With pmra = pmdec = 0 it is a plain fixed position.
    band: SPHEREx detector D1 to D6. fov: side of the field in degrees.
    mask: set flagged pixels to NaN (default). False keeps every value, which is what a viewer
    wants for bright stars, whose saturated core is flagged.
    progress: optional callback progress(stage, done, total), stage "query" or "download".
    max_per_pass: keep at most this many exposures per six-month pass, evenly spread in time.
    Fields near the ecliptic poles are seen on almost every orbit and have hundreds.

    Returns (frames, grid). grid is the common astropy WCS. frames is a list, oldest first, of
    dicts with keys image (zodi subtracted, bad pixels NaN, on grid), variance, mjd, year,
    wavelength_um (at the target), pass_index (0, 1, ... one per six-month sky pass),
    target_xy (predicted target pixel on grid at that date) and uri.
    """
    os.makedirs(data_dir, exist_ok=True)
    report = progress or (lambda *a: None)
    report("query", 0, 0)
    rows = find_exposures(*position(2026.0, ra, dec, epoch, pmra, pmdec), band, data_dir)
    if not rows:
        return [], None
    mjd = np.array([float(r["time_bounds_lower"]) for r in rows])
    if max_per_pass:
        pid = np.cumsum(np.r_[0, np.diff(mjd)] > 60)
        pick = []
        for p in np.unique(pid):
            idx = np.flatnonzero(pid == p)
            if len(idx) > max_per_pass:
                idx = idx[np.round(np.linspace(0, len(idx) - 1, max_per_pass)).astype(int)]
            pick.extend(idx.tolist())
        rows, mjd = [rows[i] for i in pick], mjd[pick]
    years = Time(mjd, format="mjd").decimalyear

    # the grid is fixed on the sky at the mean date, so the target walks across it
    grid, npix = make_grid(*position(float(np.mean(years)), ra, dec, epoch, pmra, pmdec), fov)
    yy, xx = np.mgrid[0:npix, 0:npix]
    sky = grid.pixel_to_world(xx, yy)
    # cutout a bit larger than the field, so a moving centre still covers the whole grid
    span = float(np.ptp(years)) * np.hypot(pmra, pmdec) / 3.6e6
    size = round(fov + span + 2 * PIX_DEG, 3)

    done, done_lock = [0], threading.Lock()
    report("download", 0, len(rows))

    def tick():
        with done_lock:
            done[0] += 1
            report("download", done[0], len(rows))

    def one(i):
        try:
            return _one(i)
        finally:
            tick()

    def _one(i):
        r = rows[i]
        tra, tdec = position(years[i], ra, dec, epoch, pmra, pmdec)
        url = f"https://irsa.ipac.caltech.edu/{r['uri']}?center={tra},{tdec}deg&size={size}"
        path = os.path.join(data_dir, f"{name}_{band}_{size}_{r['uri'].split('/')[-1]}")
        try:
            _download(url, path)
        except Exception as e:  # one stubborn exposure should not sink the whole view
            print(f"skipped {r['uri'].split('/')[-1]}: {e}")
            return None
        with fits.open(path, memmap=False) as h:
            w = WCS(h["IMAGE"].header)
            sw = WCS(h["IMAGE"].header, fobj=h, key="W")
            sw.sip = None
            img = h["IMAGE"].data - h["ZODI"].data
            var = h["VARIANCE"].data.astype(float)
            bad = ((h["FLAGS"].data & BAD_BITS) != 0) & mask
            img = np.where(bad, np.nan, img)
            wl = sw.pixel_to_world(*w.world_to_pixel_values(tra, tdec))[0].to_value("um")
            x, y = w.world_to_pixel(sky)
        return dict(
            image=map_coordinates(img, [y, x], order=1, cval=np.nan),
            variance=map_coordinates(np.where(bad, np.nan, var), [y, x], order=0, cval=np.nan),
            mjd=float(mjd[i]), year=float(years[i]), wavelength_um=float(wl),
            target_xy=tuple(float(v) for v in grid.world_to_pixel_values(tra, tdec)),
            uri=r["uri"])

    with ThreadPoolExecutor(workers) as ex:
        got = list(ex.map(one, range(len(rows))))
    keep = [i for i, f in enumerate(got) if f is not None]
    frames, mjd = [got[i] for i in keep], mjd[keep]

    # passes: a new one starts after any gap longer than 60 days
    gaps = np.r_[0, np.diff(mjd)] > 60
    for f, p in zip(frames, np.cumsum(gaps)):
        f["pass_index"] = int(p)
    return frames, grid


# catalogues for the overlay, both through the same IRSA TAP service
CATALOGS = {
    # Gaia DR3: positions at 2016.0, motions in mas/yr
    "gaia": dict(epoch=2016.0, pm_scale=1.0, query=(
        "SELECT TOP 2000 ra, dec, pmra, pmdec, phot_g_mean_mag AS mag FROM gaia_dr3_source "
        "WHERE 1 = CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', {ra}, {dec}, {r})) "
        "ORDER BY phot_g_mean_mag")),
    # CatWISE2020: positions ra_pm, dec_pm at MJD 57170 (2015.4), motions in arcsec/yr, W2 in Vega
    "catwise": dict(epoch=2015.4, pm_scale=1000.0, query=(
        "SELECT TOP 2000 ra_pm AS ra, dec_pm AS dec, pmra, pmdec, w2mpro AS mag FROM catwise_2020 "
        "WHERE 1 = CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', {ra}, {dec}, {r})) "
        "ORDER BY w2mpro")),
}


def catalog_overlay(grid, kind, data_dir=DATA_DIR):
    """Sources of one catalogue on the grid, as [x, y, vx, vy, mag] with x, y the pixel at the
    catalogue epoch and vx, vy the motion in pixels per year, so a viewer can put each source where
    it was on any date. Kept for a week in data_dir."""
    c = CATALOGS[kind]
    ra0, dec0 = (float(v) for v in grid.wcs.crval)
    npix = grid.pixel_shape[0]
    r = round(npix * PIX_DEG * 0.75, 4)          # a circle that covers the square field
    path = os.path.join(data_dir, f"cat_{kind}_{ra0:.5f}_{dec0:+.5f}_{r}.json")
    if os.path.exists(path) and time.time() - os.path.getmtime(path) < 7 * 86400:
        with open(path) as f:
            rows = json.load(f)
    else:
        rows = tap(c["query"].format(ra=ra0, dec=dec0, r=r))
        with open(path, "w") as f:
            json.dump(rows, f)
    out = []
    for row in rows:
        try:
            ra, dec, mag = float(row["ra"]), float(row["dec"]), float(row["mag"] or "nan")
        except (TypeError, ValueError):
            continue
        pmra = float(row["pmra"] or 0) * c["pm_scale"]
        pmdec = float(row["pmdec"] or 0) * c["pm_scale"]
        x0, y0 = grid.world_to_pixel_values(ra, dec)
        x1, y1 = grid.world_to_pixel_values(*position(c["epoch"] + 1, ra, dec, c["epoch"], pmra, pmdec))
        if -2 <= x0 <= npix + 1 and -2 <= y0 <= npix + 1:
            out.append([round(float(x0), 3), round(float(y0), 3), round(float(x1 - x0), 4),
                        round(float(y1 - y0), 4), None if not np.isfinite(mag) else round(mag, 2)])
    return dict(epoch=c["epoch"], sources=out)


if __name__ == "__main__":
    # Barnard's Star, Gaia DR3 at 2016.0
    fr, g = get_frames(269.44850252544, 4.73942005111, "D1", 0.03, 2016.0, -801.551, 10362.394,
                       name="Barnard")
    print(len(fr), "frames, grid", g.pixel_shape if g else None)
    for f in fr[:3] + fr[-3:]:
        print(f"{f['year']:.3f} pass {f['pass_index']} {f['wavelength_um']:.2f} um "
              f"target at {f['target_xy'][0]:.1f},{f['target_xy'][1]:.1f}")
