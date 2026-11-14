# SPHEREx Blink, the demo

A WiseView-style blink viewer for SPHEREx. Give it a sky position, and it shows the same patch of
sky in every SPHEREx pass, on one fixed north-up grid, so anything that moves or changes stands out.
Built for NASA Space Apps Milano 2026 by Observationally Speaking.

The page follows the design language of Brice Menard's full sky ultraviolet map: the sky fills the
first screen, the controls sit in one quiet row under it, and the explanation waits below the fold.
Dark by default with a light theme, five font sizes, one colour for everything clickable and one
colour per SPHEREx detector.

## Run it

```bash
conda activate astrolab2          # numpy, scipy, astropy
python tool/server.py             # from the repo root
# open http://localhost:8000/?target=Barnard
```

On yourastro.space there is no server. The five presets load from `data/*.json` instead, written by
`python tool/export_static.py`, and a custom position says it needs the server.

The first view of a new field asks IRSA for every exposure and downloads the cutouts, which takes a
few minutes (longer when IRSA is busy). After that the files sit in `~/spherex_data` (or
`$SPHEREX_DATA`) and the same view opens in seconds.

## Every setting is in the URL

One link is one view, as in WiseView. Presets fill in position, proper motion and detector:

    /?target=Barnard   /?target=EpsIndB   /?target=WISE0855   /?target=RWAur   /?target=RDra

Or set things by hand:

| parameter | meaning | default |
|---|---|---|
| `ra`, `dec` | position in degrees at `epoch` | |
| `pmra`, `pmdec` | proper motion in mas/yr | 0 |
| `epoch` | epoch of the position, decimal year | 2016.0 |
| `size` | field side in arcsec, up to 900 | 360 |
| `band` | SPHEREx detector, D1 to D6 | D1 |
| `view` | `blink` or `diff` (each image minus the median of all) | blink |
| `mode` | `frames` (every exposure) or `pass` (median of each six-month pass) | frames |
| `speed` | blink interval in ms | 500 |
| `stretch` | `asinh` or `linear` | asinh |
| `contrast` | upper percentile for the stretch | 99.5 |
| `invert`, `marker`, `mask` | 1 or 0 | 0, 1, 0 |
| `gaia`, `catwise` | catalogue overlay on (1) or off (0) | 1, 0 |
| `gmag`, `wmag` | faintest Gaia G and CatWISE W2 drawn | 16, 16 |

Keys: space plays or pauses, the arrows step, `d` switches to the difference view, `m` hides the marker, `g` hides Gaia, `f` full screen.

## Overlays

Two catalogues come from the same IRSA TAP service as the images. Gaia DR3 (positions at 2016.0,
motions in mas/yr) and CatWISE2020 (positions `ra_pm`, `dec_pm` at MJD 57170, motions in arcsec/yr),
which also has objects too cold for Gaia, such as WISE 0855. The server sends each source as its
pixel at the catalogue epoch plus its motion in pixels per year, and the page moves it to the date of
the image on screen, so a star that walks in the data walks under its own circle.

## The whole sky

At the top of the page one Aladin Lite map shows the whole sky, laid out after Brice Menard's
ultraviolet sky map and drawn in the site's own design.

- Three shapes: `map` (Mollweide, galactic, Milky Way across the middle), `outside` (a turning
  sphere, still for people who ask for reduced motion), `inside` (stereographic, the view from the centre).
- A sky / Earth switch. Earth shows NASA Blue Marble (day) and Black Marble (night) from NASA GIBS,
  reprojected to the same oval by `earth_mollweide.py` into `../img/`. Only `map` works for the Earth.
- Surveys: SPHEREx DR1 (the 102-frame all-sky cube at IRSA, with D1 to D6 buttons and a wavelength
  slider), 2MASS and AllWISE (IRSA mirror of CDS) and DSS2 (ESA).
- The five targets as markers (click one to load it below), the exact footprint of the field on screen,
  and a ring that follows the target frame by frame.
- A full-width crosshair with the ICRS centre and a copy button, a lens that turns on and off and can
  be dragged (or moved with the arrow keys) to hand its centre to "your own position", and a Home
  button whose place is fixed for good: the whole sky centred on the middle of the Milky Way.

Both the whole-sky map and the blink viewer have a full screen button (and the key `f` for the
viewer). It uses the Fullscreen API where the browser has it, and a fixed full-window overlay where
it does not (iPhone Safari). Esc or the button again leaves it.

URL parameters: `shape` (map, outside, inside), `world` (sky, earth), `layer` (spherex, 2mass,
allwise, dss2), `frame` (0 to 101), `earth` (day, night), `cross` (1 or 0).

The lens, the crosshair, the fixed Home and the D1 to D6 buttons come from our teammate's Time Lens
sketch and handoff notes of 14 November.

Aladin Lite 3.8.2 (CDS, Strasbourg) loads as an ES module from jsDelivr when the map comes near the
screen. The footprint uses the `grid` in each JSON (centre, size, reference pixel). Backgrounds come
from IRSA and ESA because the CDS main host was not answering on 14 November.

## Size on the wire

Each image travels as int16 in base64 (`value = lo + scale * (code + 32767)`, code -32768 for no
data), about a third of the size of plain JSON numbers. The rounding error is 1/65534 of the range of
the frame, far below the noise. Fields near the ecliptic poles, like R Draconis, are seen on almost
every orbit, so the server keeps at most 40 exposures per six-month pass (`maxpp`), evenly spread.

## Files

- `spherex_frames.py`: the data path. `get_frames()` takes coordinates and returns aligned frames
  (TAP query, proper motion moved to each date, cutouts in parallel, zodiacal light subtracted,
  bad pixels flagged, resampled onto one grid).
- `server.py`: serves `web/`, `/api/frames` (wraps `get_frames()`) and `/api/progress` (how many
  cutouts of a new field are down). Standard library only.
- `export_static.py`: writes the five presets to `../data/`, with and without flagged pixels
  blanked, through the same code as the server.
- The page itself is at the repo root (`index.html`, `style.css`, `app.js`), since the root is what
  GitHub Pages serves. Figtree comes from Google Fonts, the rest is local.

## Credits

Data: SPHEREx Level 2 spectral images, NASA/JPL-Caltech/IPAC, through NASA/IPAC IRSA. Positions
and motions from Gaia DR3 (ESA/DPAC), and for WISE 0855 from AllWISE with the motion of
Kirkpatrick et al. 2021. The interface is modelled on WiseView (Caselden et al.). The data path
grows out of our own prep scripts of 10 November 2026, in `../prep/`. Parts of the code were
written with help from Claude (Anthropic).
