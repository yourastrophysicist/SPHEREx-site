# SPHEREx prep for NASA Space Apps Milano 2026

A first look at real SPHEREx images, made on 10 November 2026 to check that the data path works before the hackathon weekend (Politecnico di Milano, 14 and 15 November). This is study material, not the hackathon project. The project itself starts from scratch on Saturday.

## What is here

- `spherex_targets_test.ipynb` asks NASA's IRSA archive which SPHEREx exposures cover a target, downloads small cutouts centred where the star is on each date, subtracts the zodiacal light, and then shows three things.
  1. A blink of the first and last exposure, and their difference, for a moving star.
  2. The track of Barnard's Star measured exposure by exposure against the Gaia DR3 proper motion (median offset 0.29 px).
  3. A co-add of every exposure of one pass for WISE 0855, too faint to see in one frame, plus a Gaia check of who else sits in the pixel.
- `scripts/render_spherex.py` does the blink from the command line and writes a PNG.
- `scripts/coadd_spherex.py` does the co-add from the command line and writes a PNG.

The targets are Barnard's Star, Epsilon Indi B, WISE 0855-0714, RW Aurigae and R Draconis.

## Running it

```
pip install -r requirements.txt
jupyter lab spherex_targets_test.ipynb
```

It talks to IRSA with plain TAP and cutout URLs, so there is no astroquery and no login. Cutouts go to `~/spherex_data`, or to the folder in the `SPHEREX_DATA` environment variable. A full run downloads about 400 MB.

The scripts take their inputs on the command line, for example

```
python scripts/render_spherex.py Barnard D1 269.44850252544 4.73942005111 2016.0 -801.551 10362.394 0.06 ~/spherex_data barnard_blink.png
```

## Data and credits

- SPHEREx Level 2 spectral images (QR2 for 2025, QR3 for 2026), NASA/JPL-Caltech/IPAC, through the NASA/IPAC Infrared Science Archive (IRSA).
- Positions and proper motions from Gaia DR3 (ESA/DPAC), epoch 2016.0, queried at IRSA.
- WISE 0855-0714 position from AllWISE, proper motion from Kirkpatrick et al. 2021.

## Use of AI

Parts of this code were written with help from Claude (Anthropic).
