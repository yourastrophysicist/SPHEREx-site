# Guide to the SPHEREx prep notebook

This guide walks through `spherex_targets_test.ipynb` one step at a time. It says what each part does, why it is done that way, and what went wrong on the first try. I wrote it so that anyone on the team can run the notebook on Saturday morning without asking me, and so that the weekend code can start from something that already works.

## 0. Before you start

You need Python 3 with numpy, scipy, matplotlib and astropy, plus Jupyter to open the notebook.

```
pip install -r requirements.txt
jupyter lab spherex_targets_test.ipynb
```

There is no login and no API key. The notebook talks to NASA's IRSA archive with plain web requests. Cutouts go to `~/spherex_data`, or to the folder in the `SPHEREX_DATA` environment variable. A full run downloads about 400 MB in a little over 100 files, so do it once on good wifi and the second run reads everything from disk.

## 1. What a SPHEREx file is

SPHEREx images the whole sky every six months in 102 colours between 0.75 and 5 micron. It has six detectors, D1 to D6, and each one sits behind a filter whose wavelength changes across the detector. So a star at the left edge of D1 is seen at a different wavelength than the same star at the right edge, and a spectrum is built from many pointings.

One Level 2 file is one exposure of one detector. The public data are QR2 (2025) and QR3 (2026). Each file has these extensions.

| Extension | What it holds |
|---|---|
| `IMAGE` | the sky in MJy/sr, with the zodiacal light still in it |
| `FLAGS` | one bit per problem, per pixel |
| `VARIANCE` | the noise, in (MJy/sr) squared |
| `ZODI` | a model of the zodiacal light, which I subtract myself |
| `PSF` or `EPSF` | the point spread function |
| `WCS-WAVE` | the wavelength of every pixel |

A pixel is about 6.15 arcsec. That number matters for everything below, because a star that moves 10 arcsec in a year moves less than two pixels.

## 2. The five test targets (notebook cells 2 and 3)

| Target | Why it is here | Detector |
|---|---|---|
| Barnard's Star | the fastest star on the sky, about 10 arcsec a year | D1 |
| Epsilon Indi B | a nearby brown dwarf pair that moves about one pixel in total | D5 |
| WISE 0855-0714 | the coldest known brown dwarf, too faint to see in one frame | D6 |
| RW Aurigae | a young star that changes brightness, it does not move | D1 |
| R Draconis | a Mira variable, period 246 days, V 6.7 to 13.2 | D3 |

Positions and proper motions come from Gaia DR3 at epoch 2016.0, queried at IRSA. WISE 0855 is too red for Gaia, so it uses the AllWISE position and the motion from Kirkpatrick et al. 2021.

The coordinates on the challenge page and on Wikipedia are for older epochs. Barnard's Star in 2026 sits about 44 pixels from its J2000 position, so a cutout at the catalogue position would miss it. The function `position(name, year)` moves the star forward with its proper motion to any date, and every cutout is centred on the position for its own exposure date.

## 3. Asking IRSA for the data (cells 4 and 5)

Three small functions do all the talking.

`tap(query)` sends an ADQL query to the IRSA TAP service and returns the rows as dictionaries. TAP sees new data the moment it is ingested, which the SIA service does not.

`exposures(name, band)` lists every exposure of one detector whose footprint contains the target, sorted by time. It joins the tables `spherex.artifact` and `spherex.plane` on `planeid` and filters on `energy_bandpassname`. For Barnard's Star in D1 it finds 60 exposures, from 27 August 2025 to 2 September 2026.

`cutout(name, band, row, size)` downloads a small square of one exposure, `size` degrees on a side. It adds `?center=RA,DEC&size=...` to the file URL, which is the IRSA cutout service. It then subtracts `ZODI` from `IMAGE` and returns the image, the sky WCS, the wavelength WCS and the date.

`many(name, band, rows, size)` runs `cutout` on eight threads at once, so a 60-file download does not wait on one file at a time.

Things that went wrong on the first run, and are handled now.

- The cutout service sometimes answers 503 for a few seconds. `cutout` retries five times with a growing pause, and gives up at once on a 4xx error, because that one will not fix itself.
- A download cut short by the network still opens as a FITS file but lacks the last extensions. `complete` checks that all five needed extensions are there and deletes any file that fails.
- On Windows, a memory-mapped FITS file stays locked and cannot be deleted. Every `fits.open` uses `memmap=False`.
- Cutouts keep the orientation of the parent image. They are not north up, so two exposures of the same star never line up pixel for pixel without resampling.

## 4. Blink and difference (cells 6 and 7)

`blink(name, band)` takes the first and the last exposure, resamples the later one onto the pixel grid of the earlier one using both WCS, and shows three panels. Earlier, later, and later minus earlier. Field stars land on the same pixels and cancel in the difference. A mover leaves a pair, dark where it was and bright where it is. Cyan and orange circles mark where Gaia says the star should be on each date.

The images use an asinh stretch, with the limits taken from percentiles of the data, because SPHEREx frames have a few very bright pixels that would wash out a linear scale.

For Barnard's Star in D1 the predicted shift between the first and last exposure is 1.72 pixels. That is visible in the difference panel but hard to see in a blink by eye, which is why the next step measures it.

## 5. The track of a star (cells 8 and 9)

`track(name, band)` downloads every exposure of one detector and, for each one, measures where the star is.

1. Find the pixel where Gaia says the star is on that date.
2. Take a 5 x 5 pixel box around it and subtract the median of the cutout.
3. Compute the flux-weighted centroid of the box.
4. Turn the centroid back into RA and Dec with the WCS.

It then plots the measured offset from the Gaia 2016 position against time, in RA and in Dec, with the Gaia proper motion drawn as a line.

Barnard's Star is bright enough to saturate the core in D1. The brightest pixel carries the OVERFLOW flag and a few pixels are NaN. Throwing those frames away would lose most of the data, so the centroid skips the bad pixels and keeps the frame as long as at least 15 of the 25 are good. That makes each point a little rougher, which is why many exposures matter more than one.

The result is a median distance of 1.79 arcsec, or 0.29 pixels, from the Gaia prediction. SPHEREx alone recovers the motion of Barnard's Star well below one pixel.

## 6. Co-adding a faint target (cells 10 and 11)

WISE 0855 cannot be seen in a single D6 exposure. `coadd(name, band, wlmin, wlmax)` stacks every exposure of one pass.

1. Split the exposures into passes at the largest gap in time.
2. For each pass, build a north-up grid of 31 x 31 pixels centred on where the target is at the mean date of that pass.
3. Resample each exposure onto that grid, but only if the wavelength at the target falls between `wlmin` and `wlmax`. This keeps the stack at one colour.
4. Weight each pixel by the inverse variance, and give zero weight to pixels with bad flags.

The bad flags are TRANSIENT (bit 0), OVERFLOW (1), NONFUNC (6), MISSING_DATA (9), HOT (10), COLD (11), NONLINEAR (15), PERSIST (17) and OUTLIER (19). Almost every pixel carries the SOURCE bit (21), so masking every nonzero flag would mask the whole sky. That bit is left out on purpose.

The plot shows pass 1, pass 2, and pass 2 minus pass 1, all at 4.4 to 5.0 micron.

## 7. Who else is in the pixel (cells 12 and 13)

A 6 arcsec pixel can hold more than one star. Before calling anything a detection, `neighbours(name, year)` asks Gaia DR3 at IRSA for every source within 20 arcsec of the target on that date.

Near WISE 0855 in 2026 there is a star of G 16.3 only 6.5 arcsec away, about one pixel. So the co-add above is a blend of the brown dwarf and that star, not a clean detection. This check belongs in any tool that claims to find movers.

## 8. Trying the other targets (cells 14 and 15)

Change the name and the detector in the last cell.

```
blink("EpsIndB", "D5", size=0.08)
blink("RDra", "D3")
neighbours("EpsIndB")
```

Epsilon Indi B moves about one pixel in total, so expect a faint dipole in the difference panel. RW Aurigae and R Draconis do not move, they change brightness. For them the useful plot is the flux at a fixed wavelength over time, which the notebook does not do yet.

## 9. The two scripts

`scripts/render_spherex.py` and `scripts/coadd_spherex.py` do the blink and the co-add from the command line, with no notebook, and write a PNG. They take the target as arguments, so they work for any star with a known position and proper motion.

```
python scripts/render_spherex.py NAME BAND RA DEC EPOCH PMRA PMDEC SIZE_DEG DATA_DIR OUT_PNG
python scripts/coadd_spherex.py NAME BAND RA DEC EPOCH PMRA PMDEC WLMIN WLMAX DATA_DIR OUT_PNG
```

For example, Barnard's Star in D1.

```
python scripts/render_spherex.py Barnard D1 269.44850252544 4.73942005111 2016.0 -801.551 10362.394 0.06 ~/spherex_data barnard_blink.png
```

## 10. What this means for a web tool

- Moving every target to its own exposure date is not optional. Without it the fast movers fall off the cutout.
- Frames have to be resampled onto one north-up grid before they can be played as a video, because cutouts keep the detector orientation.
- Each frame is at a slightly different wavelength. A fair blink compares frames at about the same wavelength, using `WCS-WAVE`.
- Sub-pixel motion is real and measurable, but only by centroiding many frames, not by eye.
- A detection needs a check against Gaia for neighbours in the same pixel.

## Data and credits

SPHEREx Level 2 spectral images, NASA/JPL-Caltech/IPAC, through the NASA/IPAC Infrared Science Archive (IRSA). Gaia DR3, ESA/DPAC. AllWISE, and the WISE 0855 motion from Kirkpatrick et al. 2021. Parts of the code and of this guide were written with help from Claude (Anthropic).
