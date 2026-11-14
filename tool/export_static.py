"""Write the five preset views as static JSON, so the page works on plain static hosting.

    python export_static.py            # writes ../data/<preset>.json and ../data/<preset>_mask.json

Uses the same code path as the server (server.frames_json), so a static file and a live answer
are byte for byte the same. Cutouts come from the cache in ~/spherex_data, or IRSA if missing.
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from server import frames_json  # noqa: E402

# keep in step with PRESETS in app.js
PRESETS = {
    "Barnard":  dict(ra=269.44850252544, dec=4.73942005111, epoch=2016.0, pmra=-801.551, pmdec=10362.394, band="D1", size=108),
    "EpsIndB":  dict(ra=331.07645259656, dec=-56.79381206688, epoch=2016.0, pmra=3981.977, pmdec=-2466.832, band="D5", size=108),
    "WISE0855": dict(ra=133.7947597, dec=-7.2451456, epoch=2010.56, pmra=-8123.7, pmdec=673.2, band="D6", size=216),
    "RWAur":    dict(ra=76.95608119553, dec=30.40120458910, epoch=2016.0, pmra=2.641, pmdec=-27.398, band="D1", size=108),
    "RDra":     dict(ra=248.16737836729, dec=66.75500674547, epoch=2016.0, pmra=-20.643, pmdec=6.149, band="D3", size=108),
}

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[1:] or list(PRESETS)
    for name in only:
        p = PRESETS[name]
        for mask in ("0", "1"):
            q = {k: str(v) for k, v in p.items()} | {"name": name, "mask": mask}
            body = frames_json(q)
            path = os.path.join(OUT, f"{name}{'_mask' if mask == '1' else ''}.json")
            with open(path, "wb") as f:
                f.write(body)
            print(f"{path}: {len(json.loads(body)['frames'])} frames, {len(body) / 1e3:.0f} kB")
