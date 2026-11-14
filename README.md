# SPHEREx-site

The `/SPHEREx` page of [yourastro.space](https://www.yourastro.space/SPHEREx/).

It is SPHEREx Blink, a small web tool built by Observationally Speaking at NASA Space Apps Milano,
14 and 15 November 2026. It plays the public SPHEREx images of a patch of sky like a flipbook, on
one fixed north-up grid, so anything that moved between visits jumps out.

The page (`index.html`, `style.css`, `app.js`) sits at the root of this repo. It is served through
GitHub Pages and shown at `yourastro.space/SPHEREx` by a rewrite in the main site's `vercel.json`.
The five example targets ship as static JSON in `data/`, so they work on plain static hosting. Any
other position needs the live data server in `tool/`, which you run on your own computer.

```bash
conda activate astrolab2          # numpy, scipy, astropy
python tool/server.py             # then open http://localhost:8000/?target=Barnard
python tool/export_static.py      # rebuilds data/ after a change to the data path
```

See `tool/README.md` for the URL parameters, the files and the credits.

## Aladin + SPHEREx Time Lens

[Open the Time Lens](https://spherex-time-lens.arisenhutch4.chatgpt.site/?target=Barnard)

Explore the sky with Aladin Lite and view the corresponding SPHEREx preset
in a rectangular Time Lens panel. This independently hosted integration
embeds the existing viewer and preserves its scientific features.

The public integration uses static presets. Arbitrary RA/Dec positions
require the live server described in tool/README.md.

Since 14 November the Time Lens idea also lives inside the main page, in the
sky map panel: Aladin Lite 3.8.2 around the SPHEREx field, with the exact
footprint from the grid in `data/*.json`, a ring that follows the target frame
by frame, a choice of 2MASS, AllWISE (both through IRSA) or DSS2 (through ESA)
as background, and a button to pick a custom position on the map.

## prep/

The `prep/` folder holds the test notebook and two scripts I made on 10 November 2026 to check
that the SPHEREx data path works before the hackathon. It is study material, not the hackathon
project. See `prep/README.md` to run it and `prep/GUIDE.md` for a step-by-step walk through the notebook.
