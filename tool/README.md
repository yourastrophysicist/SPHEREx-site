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
| `size` | field side in arcsec | 108 |
| `band` | SPHEREx detector, D1 to D6 | D1 |
| `view` | `blink` or `diff` (each image minus the median of all) | blink |
| `mode` | `pass` (median of each six-month pass) or `frames` (every exposure) | pass |
| `speed` | blink interval in ms | 500 |
| `stretch` | `asinh` or `linear` | asinh |
| `contrast` | upper percentile for the stretch | 99.5 |
| `invert`, `marker`, `mask` | 1 or 0 | 0, 1, 0 |

Keys: space plays or pauses, the arrows step, `d` switches to the difference view, `m` hides the marker.

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
