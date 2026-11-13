"""Co-add all SPHEREx exposures of one detector per survey pass (split at the median time gap),
on a north-up grid centred on the target's mean position in each pass. Shows whether a faint
mover appears only after stacking.
usage: python -I coadd_spherex.py NAME BAND RA DEC EPOCH PMRA PMDEC WLMIN WLMAX DATA_DIR OUT_PNG"""
import csv, http.client, io, sys, time, urllib.error, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from astropy.io import fits
from astropy.time import Time
from astropy.wcs import WCS
from scipy.ndimage import map_coordinates
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import AsinhNorm

name, band = sys.argv[1], sys.argv[2]
ra0, de0, ep0, pmra, pmde, wlmin, wlmax = map(float, sys.argv[3:10])
ddir, out = sys.argv[10], sys.argv[11]
SIZE, PIX, NPIX = 0.06, 6.15 / 3600, 31


def pos(ty):
    dt = ty - ep0
    return ra0 + pmra / 1e3 * dt / 3600 / np.cos(np.radians(de0)), de0 + pmde / 1e3 * dt / 3600


def tap(q):
    d = urllib.parse.urlencode({"QUERY": q, "FORMAT": "csv"}).encode()
    with urllib.request.urlopen("https://irsa.ipac.caltech.edu/TAP/sync", d, timeout=180) as r:
        return list(csv.DictReader(io.StringIO(r.read().decode())))


mid = pos(2026.0)
rows = tap(f"""SELECT a.uri, p.time_bounds_lower FROM spherex.artifact a JOIN spherex.plane p
ON a.planeid = p.planeid WHERE 1 = CONTAINS(POINT('ICRS', {mid[0]}, {mid[1]}), p.poly)
AND p.energy_bandpassname = 'SPHEREx-{band}' ORDER BY p.time_bounds_lower""")
t = np.array([float(r["time_bounds_lower"]) for r in rows])
split = int(np.argmax(np.diff(t))) + 1  # largest gap separates the two passes


NEEDED = ("IMAGE", "FLAGS", "VARIANCE", "ZODI", "WCS-WAVE")


def complete(f):
    # a cutout cut short by the network opens fine but lacks the last extensions
    try:
        with fits.open(f, memmap=False) as h:
            return all(e in h for e in NEEDED)
    except Exception:
        return False


def get(r):
    ty = Time(float(r["time_bounds_lower"]), format="mjd").decimalyear
    ra, de = pos(ty)
    f = f"{ddir}/{name}_{band}_{r['uri'].split('/')[-1]}"
    url = f"https://irsa.ipac.caltech.edu/{r['uri']}?center={ra},{de}deg&size={SIZE}"
    for a in range(5):
        try:
            urllib.request.urlretrieve(url, f)
            if complete(f): break
            raise http.client.IncompleteRead(b"")
        except (urllib.error.URLError, http.client.HTTPException, TimeoutError, ConnectionError) as e:
            if a == 4 or (isinstance(e, urllib.error.HTTPError) and e.code < 500): raise
            time.sleep(5 * (a + 1))
    h = fits.open(f, memmap=False)
    sw = WCS(h["IMAGE"].header, fobj=h, key="W"); sw.sip = None
    return h, sw, ty


with ThreadPoolExecutor(8) as ex:
    data = list(ex.map(get, rows))


def stack(items):
    ty = np.mean([d[2] for d in items]); ra, de = pos(ty)
    g = WCS(naxis=2); g.wcs.ctype = ["RA---TAN", "DEC--TAN"]; g.wcs.crval = [ra, de]
    g.wcs.crpix = [NPIX // 2 + 1] * 2; g.wcs.cdelt = [-PIX, PIX]
    yy, xx = np.mgrid[0:NPIX, 0:NPIX]; sky = g.pixel_to_world(xx, yy)
    num = np.zeros((NPIX, NPIX)); den = np.zeros((NPIX, NPIX)); n = 0
    bad = sum(1 << b for b in (0, 1, 6, 9, 10, 11, 15, 17, 19))
    for h, sw, _ in items:
        w = WCS(h["IMAGE"].header); x, y = w.world_to_pixel(sky)
        wl = sw.pixel_to_world(*w.world_to_pixel_values(ra, de))[0].to_value("um")
        if not (wlmin <= wl <= wlmax):
            continue
        img = h["IMAGE"].data - h["ZODI"].data
        ivar = 1 / h["VARIANCE"].data
        ivar[(h["FLAGS"].data & bad) != 0] = 0
        v = map_coordinates(img, [y, x], order=1, cval=np.nan)
        iv = map_coordinates(ivar, [y, x], order=0, cval=0)
        ok = np.isfinite(v) & (iv > 0)
        num[ok] += v[ok] * iv[ok]; den[ok] += iv[ok]; n += 1
    return np.where(den > 0, num / den, np.nan), n, ty


A = stack(data[:split]); B = stack(data[split:])
fig, ax = plt.subplots(1, 3, figsize=(12, 4.4))
lo, hi = np.nanpercentile(A[0], [1, 99.8]); sc = max(np.nanpercentile(A[0], 84) - np.nanmedian(A[0]), 1e-4)
for k, S in enumerate([A, B]):
    ax[k].imshow(S[0], origin="lower", cmap="gray", norm=AsinhNorm(linear_width=sc, vmin=lo, vmax=hi))
    ax[k].set_title(f"pass {k + 1}, {S[2]:.2f}, {S[1]} exposures co-added")
d = B[0] - A[0]; m = np.nanpercentile(np.abs(d), 99.5)
ax[2].imshow(d, origin="lower", cmap="RdBu_r", vmin=-m, vmax=m); ax[2].set_title("pass 2 minus pass 1")
c = NPIX // 2
for k in range(3):
    ax[k].plot(c, c, "o", mfc="none", mec="orange", ms=16, mew=1.2)
    ax[k].set_xticks([]); ax[k].set_yticks([])
fig.suptitle(f"{name}, SPHEREx {band} at {wlmin}-{wlmax} um, north up, each pass centred on the Gaia/Kirkpatrick "
             "position of its mean date (circle). Data NASA/JPL-Caltech/IPAC via IRSA", fontsize=8.5)
fig.tight_layout(); fig.savefig(out, dpi=130)
print(name, band, "pass sizes", split, len(rows) - split, "used", A[1], B[1], "saved", out)
