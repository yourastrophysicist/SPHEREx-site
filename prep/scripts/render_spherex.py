"""Render first/last SPHEREx epoch + difference for a moving target, from IRSA (TAP + IBE cutouts).
usage: python -I render_spherex.py NAME BAND RA2016 DEC2016 EPOCH PMRA PMDEC SIZE_DEG DATA_DIR OUT_PNG
Positions are propagated linearly with proper motion (mas/yr) to each exposure date."""
import csv, http.client, io, sys, time, urllib.error, urllib.parse, urllib.request
import numpy as np
from astropy.io import fits
from astropy.time import Time
from astropy.wcs import WCS
from scipy.ndimage import map_coordinates
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

name, band = sys.argv[1], sys.argv[2]
ra0, de0, ep0, pmra, pmde, size = map(float, sys.argv[3:9])
ddir, out = sys.argv[9], sys.argv[10]
TAP = "https://irsa.ipac.caltech.edu/TAP/sync"


def pos(t_year):
    dt = t_year - ep0
    return (ra0 + pmra / 1e3 * dt / 3600 / np.cos(np.radians(de0)), de0 + pmde / 1e3 * dt / 3600)


def tap(q):
    data = urllib.parse.urlencode({"QUERY": q, "FORMAT": "csv"}).encode()
    with urllib.request.urlopen(TAP, data, timeout=180) as r:
        return list(csv.DictReader(io.StringIO(r.read().decode())))


mid = pos(2026.0)
rows = tap(f"""SELECT a.uri, p.time_bounds_lower FROM spherex.artifact a JOIN spherex.plane p
ON a.planeid = p.planeid WHERE 1 = CONTAINS(POINT('ICRS', {mid[0]}, {mid[1]}), p.poly)
AND p.energy_bandpassname = 'SPHEREx-{band}' ORDER BY p.time_bounds_lower""")
assert rows, "no exposures"
print(name, band, len(rows), "exposures")


NEEDED = ("IMAGE", "ZODI", "WCS-WAVE")


def complete(f):
    # a cutout cut short by the network opens fine but lacks the last extensions
    try:
        with fits.open(f, memmap=False) as h:
            return all(e in h for e in NEEDED)
    except Exception:
        return False


def cutout(row):
    t = Time(float(row["time_bounds_lower"]), format="mjd")
    ra, de = pos(t.decimalyear)
    url = f"https://irsa.ipac.caltech.edu/{row['uri']}?center={ra},{de}deg&size={size}"
    f = f"{ddir}/{name}_{band}_{row['uri'].split('/')[-1]}"
    for attempt in range(5):  # IBE returns transient 503s and sometimes truncated files
        try:
            urllib.request.urlretrieve(url, f)
            if complete(f): break
            raise http.client.IncompleteRead(b"")
        except (urllib.error.URLError, http.client.HTTPException, TimeoutError, ConnectionError) as e:
            if attempt == 4 or (isinstance(e, urllib.error.HTTPError) and e.code < 500): raise
            time.sleep(5 * (attempt + 1))
    h = fits.open(f, memmap=False)
    img = h["IMAGE"].data - h["ZODI"].data
    w = WCS(h["IMAGE"].header)
    sw = WCS(h["IMAGE"].header, fobj=h, key="W"); sw.sip = None
    ny, nx = img.shape
    wl = sw.pixel_to_world(nx // 2, ny // 2)[0].to_value("um")
    return img, w, t, (ra, de), wl


A = cutout(rows[0]); B = cutout(rows[-1])
# resample B onto A's grid (bilinear), so stars line up and only movers change
ny, nx = A[0].shape
yy, xx = np.mgrid[0:ny, 0:nx]
sky = A[1].pixel_to_world(xx, yy)
bx, by = B[1].world_to_pixel(sky)
Bon = map_coordinates(B[0], [by, bx], order=1, cval=np.nan)

fig, ax = plt.subplots(1, 3, figsize=(12, 4.4))
from matplotlib.colors import AsinhNorm
lo, hi = np.nanpercentile(A[0], [1, 99.9])
sc = max(np.nanpercentile(A[0], 84) - np.nanmedian(A[0]), 1e-3)  # ~1 sigma of the background
for k, (im, ttl) in enumerate([(A[0], A[2]), (Bon, B[2])]):
    ax[k].imshow(im, origin="lower", cmap="gray", norm=AsinhNorm(linear_width=sc, vmin=lo, vmax=hi))
    ax[k].set_title(f"{ttl.iso[:10]}, {band}, {[A, B][k][4]:.2f} um")
d = Bon - A[0]
m = np.nanpercentile(np.abs(d), 99.5)
ax[2].imshow(d, origin="lower", cmap="RdBu_r", vmin=-m, vmax=m)
ax[2].set_title("later minus earlier")
for k in range(3):
    for (ra, de), c in [(A[3], "cyan"), (B[3], "orange")]:
        x, y = A[1].world_to_pixel_values(ra, de)
        ax[k].plot(x, y, "o", mfc="none", mec=c, ms=14, mew=1.2)
    ax[k].set_xticks([]); ax[k].set_yticks([])
fig.suptitle(f"{name}, SPHEREx {band}, {len(rows)} exposures from {A[2].iso[:10]} to {B[2].iso[:10]}. "
             "Circles: Gaia proper motion prediction (cyan first, orange last). Data NASA/JPL-Caltech/IPAC via IRSA",
             fontsize=8.5)
fig.tight_layout()
fig.savefig(out, dpi=130)
x0, y0 = A[1].world_to_pixel_values(*A[3]); x1, y1 = A[1].world_to_pixel_values(*B[3])
print("predicted shift px", round(float(np.hypot(x1 - x0, y1 - y0)), 2), "saved", out)
