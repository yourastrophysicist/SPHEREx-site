"""Earth maps for the sky / Earth switch, in the same Mollweide oval as the sky map.

    python earth_mollweide.py BlueMarble.jpg earth_day.webp
    python earth_mollweide.py BlackMarble.jpg earth_night.webp

Input is a plate carree (equirectangular) world image, longitude -180..180 left to right, as NASA
GIBS serves BlueMarble_NextGeneration and VIIRS_Black_Marble. Output is 2400 x 1200, transparent
outside the ellipse. Inverse Mollweide: for each output pixel, theta = asin(y), latitude from
2 theta + sin 2 theta = pi sin(lat), longitude = pi x / cos(theta), with x, y in [-1, 1].
"""

import sys

import numpy as np
from PIL import Image

W, H = 2400, 1200


def mollweide(src, dst):
    img = np.asarray(Image.open(src).convert("RGB"), dtype=np.uint8)
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:H, 0:W]
    x = (xx + 0.5) / W * 2 - 1                    # -1 .. 1, east to the right like a map of Earth
    y = 1 - (yy + 0.5) / H * 2                    # -1 .. 1, north up
    inside = x ** 2 + y ** 2 <= 1
    theta = np.arcsin(np.clip(y, -1, 1))
    lat = np.arcsin(np.clip((2 * theta + np.sin(2 * theta)) / np.pi, -1, 1))
    with np.errstate(divide="ignore", invalid="ignore"):
        lon = np.pi * x / np.cos(theta)
    inside &= np.abs(lon) <= np.pi
    u = np.clip(((lon / np.pi + 1) / 2 * w).astype(int), 0, w - 1)
    v = np.clip(((0.5 - lat / np.pi) * h).astype(int), 0, h - 1)
    out = np.zeros((H, W, 4), dtype=np.uint8)
    out[..., :3] = img[np.where(inside, v, 0), np.where(inside, u, 0)]
    out[..., 3] = np.where(inside, 255, 0)
    Image.fromarray(out, "RGBA").save(dst, "WEBP", quality=82, method=6)


if __name__ == "__main__":
    mollweide(sys.argv[1], sys.argv[2])
