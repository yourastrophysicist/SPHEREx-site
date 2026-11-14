"""Every preset target in all six SPHEREx detectors, as static JSON for the page.

    python export_all_bands.py                  # all targets
    python export_all_bands.py Barnard RDra     # some targets
    python export_all_bands.py --clean RDra     # delete each band's raw cutouts once its JSON is written

Writes ../data/bands/<target>_<D1..D6>.json and _mask.json (flagged pixels blanked), through the
same code path as the page and export_static.py (server.frames_json), so the files are in the
format app.js already reads. Files that already exist are skipped, so a stopped run can resume.
Used by .github/workflows/export-bands.yml, which runs it on GitHub so the cutouts never fill a laptop
and hands the files back as a zip to commit by hand.
"""

import glob
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from export_static import PRESETS  # noqa: E402
from server import frames_json  # noqa: E402
from spherex_frames import DATA_DIR  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "bands")
BANDS = [f"D{i}" for i in range(1, 7)]


def main(args):
    clean = "--clean" in args
    names = [a for a in args if not a.startswith("--")] or list(PRESETS)
    os.makedirs(OUT, exist_ok=True)
    failed = []
    for name in names:
        p = PRESETS[name]
        for band in BANDS:
            for mask in ("0", "1"):
                path = os.path.join(OUT, f"{name}_{band}{'_mask' if mask == '1' else ''}.json")
                if os.path.exists(path) and os.path.getsize(path) > 0:
                    continue
                q = {k: str(v) for k, v in p.items()} | {"band": band, "name": name, "mask": mask}
                t = time.time()
                try:
                    body = frames_json(q)
                except Exception as e:  # one band that fails should not stop the others
                    print(f"FAILED {name} {band} mask={mask}: {e}", flush=True)
                    failed.append(f"{name}_{band}_{mask}")
                    continue
                tmp = path + ".part"
                with open(tmp, "wb") as f:
                    f.write(body)
                os.replace(tmp, path)   # never leave a half-written file behind
                n = len(json.loads(body)["frames"])
                print(f"{name} {band} mask={mask}: {n} frames, {len(body) / 1e3:.0f} kB, "
                      f"{time.time() - t:.0f} s", flush=True)
            if clean:
                for f in glob.glob(os.path.join(DATA_DIR, f"{name}_{band}_*.fits")):
                    os.remove(f)
    print("failed:", ", ".join(failed) or "none", flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
