// The moving sky in SPHEREx. Every setting lives in the URL, so one link is one view (as in WiseView).
"use strict";

// position at epoch (deg), proper motion (mas/yr), best detector; same table as the prep notebook
const PRESETS = {
  Barnard:  { label: "Barnard's Star", short: "Barnard", ra: 269.44850252544, dec: 4.73942005111, epoch: 2016.0, pmra: -801.551, pmdec: 10362.394, band: "D1", size: 108,
              why: "the fastest star on the sky, about 10 arcsec a year" },
  EpsIndB:  { label: "Epsilon Indi B", short: "ε Indi B", ra: 331.07645259656, dec: -56.79381206688, epoch: 2016.0, pmra: 3981.977, pmdec: -2466.832, band: "D5", size: 108,
              why: "a nearby brown dwarf pair that moves about one pixel in total" },
  WISE0855: { label: "WISE 0855-0714", short: "WISE 0855", ra: 133.7947597, dec: -7.2451456, epoch: 2010.56, pmra: -8123.7, pmdec: 673.2, band: "D6", size: 216,
              why: "the coldest known brown dwarf, too faint to see in one frame" },
  RWAur:    { label: "RW Aurigae", short: "RW Aur", ra: 76.95608119553, dec: 30.40120458910, epoch: 2016.0, pmra: 2.641, pmdec: -27.398, band: "D1", size: 108,
              why: "a young star that changes brightness, it does not move" },
  RDra:     { label: "R Draconis", short: "R Dra", ra: 248.16737836729, dec: 66.75500674547, epoch: 2016.0, pmra: -20.643, pmdec: 6.149, band: "D3", size: 108,
              why: "a Mira variable, period 246 days, V 6.7 to 13.2" },
};

const DEFAULTS = {
  ra: "", dec: "", size: "108", band: "D1", pmra: "0", pmdec: "0", epoch: "2016.0",
  view: "blink", mode: "pass", speed: "500", stretch: "asinh", contrast: "99.5",
  invert: "0", marker: "1", mask: "0",
};
const DATA_KEYS = ["ra", "dec", "size", "band", "pmra", "pmdec", "epoch"];
const PIX_ARCSEC = 6.15;

const $ = (id) => document.getElementById(id);
const canvas = $("sky"), ctx = canvas.getContext("2d"), form = $("where");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let S = {};             // current settings as strings, mirrors the URL
let data = null;        // last API answer
let views = [];         // what gets blinked
let idx = 0, timer = null, playing = !reduceMotion, loadSeq = 0;

// ---------- URL <-> settings ----------
function presetFor() {
  return Object.keys(PRESETS).find((k) => DATA_KEYS.every((d) => String(PRESETS[k][d]) === S[d]));
}

function readURL() {
  const q = new URLSearchParams(location.search);
  S = { ...DEFAULTS };
  const p = PRESETS[q.get("target")];
  if (p) for (const k of DATA_KEYS) S[k] = String(p[k]);
  for (const k of Object.keys(DEFAULTS)) if (q.has(k)) S[k] = q.get(k);
  if (!S.ra && !q.has("target")) for (const k of DATA_KEYS) S[k] = String(PRESETS.Barnard[k]); // a sky, not an empty box
}

function writeURL() {
  const q = new URLSearchParams(), t = presetFor();
  if (t) q.set("target", t);
  for (const k of Object.keys(DEFAULTS)) {
    if (t && DATA_KEYS.includes(k)) continue;
    if (S[k] !== DEFAULTS[k]) q.set(k, S[k]);
  }
  history.replaceState(null, "", (q.toString() ? "?" + q : location.pathname) + location.hash);
}

function syncUI() {
  for (const k of DATA_KEYS) form.elements[k].value = S[k];
  $("speed").value = S.speed; $("contrast").value = S.contrast; $("stretch").value = S.stretch;
  $("marker").checked = S.marker === "1"; $("invert").checked = S.invert === "1"; $("mask").checked = S.mask === "1";
  document.querySelectorAll(".tabs [data-view]").forEach((b) => b.setAttribute("aria-checked", b.dataset.view === S.view));
  $("knob").dataset.state = S.mode;
  document.querySelectorAll(".knob [data-mode]").forEach((b) => b.setAttribute("aria-checked", b.dataset.mode === S.mode));
  const t = presetFor();
  document.querySelectorAll("#targets button").forEach((b) => b.setAttribute("aria-checked", b.dataset.key === t));
  $("hero").dataset.band = S.band;
  nowLine();
}

function nowLine() {
  const t = presetFor(), el = $("now");
  if (t) el.innerHTML = `${PRESETS[t].label}, ${PRESETS[t].why} <span class="src">&middot; ${S.band}</span>`;
  else el.innerHTML = `RA ${(+S.ra).toFixed(4)}, Dec ${(+S.dec).toFixed(4)} <span class="src">&middot; ${S.band}</span>`;
}

// ---------- data ----------
async function load() {
  stop();
  const seq = ++loadSeq, job = Math.random().toString(36).slice(2, 10);
  const q = new URLSearchParams();
  for (const k of DATA_KEYS) q.set(k, S[k]);
  q.set("mask", S.mask); q.set("job", job);
  const t = presetFor();
  if (t) q.set("name", t);       // reuses the files already downloaded for presets

  const slow = setTimeout(() => showLoading("Asking IRSA which exposures cover this spot"), 400);
  const poll = setInterval(async () => {
    try {
      const p = await (await fetch("/api/progress?job=" + job)).json();
      if (seq !== loadSeq) return;
      if (p.stage === "download" && p.total) showLoading(`Downloading cutout ${p.done} of ${p.total}`, p.done / p.total);
      else if (p.stage === "query") showLoading("Asking IRSA which exposures cover this spot");
    } catch { /* the next tick will try again */ }
  }, 1000);

  try {
    let j = null;
    // the five targets ship as static files, so they open at once and work on plain static hosting
    if (t && S.size === String(PRESETS[t].size)) {
      try {
        const r = await fetch(`data/${t}${S.mask === "1" ? "_mask" : ""}.json`);
        if (r.ok) j = await r.json();
      } catch { /* fall through to the server */ }
    }
    if (!j) {
      let r;
      try { r = await fetch("/api/frames?" + q); } catch { r = null; }
      const isJSON = r && (r.headers.get("content-type") || "").includes("json");
      if (!isJSON) {                            // no server behind this page, e.g. yourastro.space
        if (seq !== loadSeq) return;
        showError("This field needs the live data server.",
          "On this site the five targets below open at once. To look anywhere else, run the server from the GitHub repo on your own computer.");
        data = null; views = []; draw();
        return;
      }
      j = await r.json();
      if (!r.ok) throw new Error(j.error || r.statusText);
    }
    if (seq !== loadSeq) return;
    if (!j.frames.length) { data = null; views = []; draw(); showError("SPHEREx has not observed this spot on this detector yet.", "Try another detector in Settings."); return; }
    data = j; hideLoading(); buildViews(); idx = 0; draw(); if (playing) start();
  } catch (e) {
    if (seq === loadSeq) showError("Could not load this field.", e.message);
  } finally {
    clearTimeout(slow); clearInterval(poll);
  }
}

function showLoading(msg, frac) {
  const L = $("loading"); L.hidden = false; L.classList.remove("err");
  $("loadMsg").textContent = msg;
  const bar = $("loadBar"); bar.hidden = false;
  bar.classList.toggle("busy", frac === undefined);
  bar.firstElementChild.style.width = frac === undefined ? "" : `${Math.round(frac * 100)}%`;
  $("loadSub").textContent = "The first view of a new field downloads every cutout, which takes a few minutes. After that it opens at once.";
}
function showError(msg, detail) {
  const L = $("loading"); L.hidden = false; L.classList.add("err");
  $("loadMsg").textContent = msg; $("loadBar").hidden = true; $("loadSub").textContent = detail || "";
}
function hideLoading() { $("loading").hidden = true; }

const median = (a) => {
  if (!a.length) return NaN;
  a.sort((x, y) => x - y);
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;

function stackMedian(images, n) {
  const out = new Array(n);
  for (let p = 0; p < n; p++) {
    const v = [];
    for (const im of images) if (im[p] !== null) v.push(im[p]);
    out[p] = v.length ? median(v) : null;
  }
  return out;
}

function buildViews() {
  const n = data.npix * data.npix;
  if (S.mode === "frames") {
    views = data.frames.map((f) => ({
      image: f.image, target: f.target_xy,
      when: f.year.toFixed(3), lambda: `${f.wavelength_um.toFixed(2)} µm`,
    }));
  } else {
    const groups = new Map();
    for (const f of data.frames) {
      if (!groups.has(f.pass_index)) groups.set(f.pass_index, []);
      groups.get(f.pass_index).push(f);
    }
    views = [...groups.values()].map((fs) => {
      const wl = fs.map((f) => f.wavelength_um), yr = fs.map((f) => f.year);
      return {
        image: stackMedian(fs.map((f) => f.image), n),
        target: [mean(fs.map((f) => f.target_xy[0])), mean(fs.map((f) => f.target_xy[1]))],
        when: `${mean(yr).toFixed(2)} · ${fs.length} exp`,
        lambda: `${Math.min(...wl).toFixed(2)}–${Math.max(...wl).toFixed(2)} µm`,
      };
    });
  }
  // difference view: each image minus the median of all of them, so whatever never changes cancels
  const ref = stackMedian(views.map((v) => v.image), n);
  for (const v of views) v.diff = v.image.map((x, p) => (x === null || ref[p] === null ? null : x - ref[p]));
  const sc = $("scrub"); sc.max = Math.max(0, views.length - 1);
}

// ---------- drawing ----------
const pct = (sorted, p) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.max(0, Math.round((p / 100) * (sorted.length - 1))))] : 0;

function draw() {
  const wrap = canvas.getBoundingClientRect();
  if (!data || !views.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $("pillWhen").textContent = ""; $("pillLambda").textContent = ""; $("count").textContent = "0 / 0";
    return;
  }
  const N = data.npix, v = views[idx], diff = S.view === "diff";
  const img = diff ? v.diff : v.image;
  const px = Math.max(1, Math.round((wrap.width || 760) * (devicePixelRatio || 1)));
  const scale = Math.max(1, Math.floor(px / N));
  canvas.width = canvas.height = N * scale;

  const finite = img.filter((x) => x !== null).sort((a, b) => a - b);
  const c = Math.min(100, Math.max(50, parseFloat(S.contrast) || 99.5));
  const med = pct(finite, 50);
  const noise = 1.4826 * pct(finite.map((x) => Math.abs(x - med)).sort((a, b) => a - b), 50) || 1e-3;
  const asinh = S.stretch === "asinh", inv = S.invert === "1";
  let map;
  if (diff) {                                  // symmetric about zero, grey means no change
    const absS = finite.map(Math.abs).sort((a, b) => a - b);
    const top = Math.max(pct(absS, c), noise), beta = 2 * noise;
    map = asinh ? (x) => 0.5 + 0.5 * Math.asinh(x / beta) / Math.asinh(top / beta) : (x) => 0.5 + 0.5 * x / top;
  } else {                                     // sky level from the median, softening from the noise
    const lo = asinh ? med - 2 * noise : pct(finite, 100 - c);
    const hi = Math.max(pct(finite, c), lo + noise), beta = 3 * noise, norm = Math.asinh((hi - lo) / beta);
    map = asinh ? (x) => Math.asinh((x - lo) / beta) / norm : (x) => (x - lo) / (hi - lo);
  }

  const id = ctx.createImageData(N, N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const val = img[y * N + x], o = ((N - 1 - y) * N + x) * 4;   // grid row 0 is south
      if (val === null) { id.data.set([24, 12, 30, 255], o); continue; }  // no data, a dim violet
      let t = Math.min(1, Math.max(0, map(val)));
      if (inv) t = 1 - t;
      const g = Math.round(255 * t);
      id.data.set([g, g, g, 255], o);
    }
  }
  const off = document.createElement("canvas"); off.width = off.height = N;
  off.getContext("2d").putImageData(id, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, 0, 0, N * scale, N * scale);

  const W = N * scale, ink = inv ? "rgba(0,0,0,.75)" : "rgba(255,255,255,.8)", u = W / 380;
  ctx.lineWidth = Math.max(1, 1.5 * u);
  if (S.marker === "1" && v.target) {          // four ticks with a gap, never covering the object
    const cx = (v.target[0] + 0.5) * scale, cy = (N - 1 - v.target[1] + 0.5) * scale;
    const a = Math.max(3 * scale, 10 * u), b = a + Math.max(2 * scale, 8 * u);
    ctx.strokeStyle = getComputedStyle(document.getElementById("hero")).getPropertyValue("--c").trim() || "#9d8cff";
    ctx.beginPath();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.moveTo(cx + dx * a, cy + dy * a); ctx.lineTo(cx + dx * b, cy + dy * b); }
    ctx.stroke();
  }
  // compass, bottom left: north up, east left
  ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.font = `${Math.round(12 * u)}px Figtree, sans-serif`;
  const L = 26 * u, ox = 26 * u + L, oy = W - 14 * u;
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - L); ctx.moveTo(ox, oy); ctx.lineTo(ox - L, oy); ctx.stroke();
  ctx.textAlign = "center"; ctx.fillText("N", ox, oy - L - 5 * u);
  ctx.textAlign = "right"; ctx.fillText("E", ox - L - 4 * u, oy + 4 * u);
  // scale bar, bottom right: 30 arcsec
  const bar = (30 / PIX_ARCSEC) * scale, bx = W - 14 * u - bar, by = W - 14 * u;
  ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bar, by); ctx.stroke();
  ctx.textAlign = "center"; ctx.fillText('30"', bx + bar / 2, by - 6 * u);

  $("pillWhen").textContent = diff ? `${v.when} − median` : v.when;
  $("pillLambda").textContent = `${data.band} · ${v.lambda}`;
  $("count").textContent = `${idx + 1} / ${views.length}`;
  $("scrub").value = idx;
}

// ---------- playback ----------
function start() { stop(); if (views.length > 1) timer = setInterval(() => step(1), Math.max(100, parseInt(S.speed, 10) || 500)); }
function stop() { if (timer) clearInterval(timer); timer = null; }
function step(d) { if (!views.length) return; idx = (idx + d + views.length) % views.length; draw(); }
function setPlaying(p) {
  playing = p; $("icoPause").hidden = !p; $("icoPlay").hidden = p;
  $("play").setAttribute("aria-label", p ? "Pause" : "Play");
  p ? start() : stop();
}

let toastTimer;
function toast(msg) { const t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2200); }

// ---------- settings drawer ----------
function openSettings(open) {
  $("settings").classList.toggle("open", open); $("scrim").hidden = !open;
  $("settingsBtn").setAttribute("aria-expanded", open);
  if (open) form.elements.ra.focus(); else $("settingsBtn").focus();
}

// ---------- wiring ----------
function build() {
  const seg = $("targets"), tb = $("targetTable");
  for (const [key, p] of Object.entries(PRESETS)) {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "radio"); b.dataset.key = key; b.dataset.band = p.band;
    b.textContent = p.short; b.title = `${p.label}, ${p.band}`;
    b.addEventListener("click", () => choose(key));
    seg.appendChild(b);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><button type="button">${p.label}</button></td><td>${p.why}</td><td><span class="dot" style="background:var(--${p.band.toLowerCase()})"></span>${p.band}</td>`;
    tr.querySelector("button").addEventListener("click", () => { choose(key); scrollTo({ top: 0 }); });
    tb.appendChild(tr);
  }
}

function choose(key) {
  const p = PRESETS[key];
  for (const k of DATA_KEYS) S[k] = String(p[k]);
  writeURL(); syncUI(); load();
}

function setView(v) { S.view = v; writeURL(); syncUI(); draw(); }
function setMode(m) { S.mode = m; writeURL(); syncUI(); if (data) { buildViews(); idx = 0; draw(); if (playing) start(); } }

document.querySelectorAll(".tabs [data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
document.querySelectorAll(".knob [data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
$("knobTrack").addEventListener("click", () => setMode(S.mode === "pass" ? "frames" : "pass"));
$("play").addEventListener("click", () => setPlaying(!playing));
$("scrub").addEventListener("input", (e) => { setPlaying(false); idx = +e.target.value; draw(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  for (const k of DATA_KEYS) S[k] = form.elements[k].value.trim() || DEFAULTS[k];
  writeURL(); syncUI(); openSettings(false); load();
});
$("speed").addEventListener("change", (e) => { S.speed = e.target.value; writeURL(); if (playing) start(); });
$("contrast").addEventListener("change", (e) => { S.contrast = e.target.value; writeURL(); draw(); });
$("stretch").addEventListener("change", (e) => { S.stretch = e.target.value; writeURL(); draw(); });
$("marker").addEventListener("change", (e) => { S.marker = e.target.checked ? "1" : "0"; writeURL(); draw(); });
$("invert").addEventListener("change", (e) => { S.invert = e.target.checked ? "1" : "0"; writeURL(); draw(); });
$("mask").addEventListener("change", (e) => { S.mask = e.target.checked ? "1" : "0"; writeURL(); load(); });
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(location.href); toast("Link copied"); }
  catch { toast("Copy failed, the link is in the address bar"); }
});
$("settingsBtn").addEventListener("click", () => openSettings(true));
$("closeSettings").addEventListener("click", () => openSettings(false));
$("scrim").addEventListener("click", () => openSettings(false));

function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  $("themeBtn").textContent = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  if (data) draw();
}
$("themeBtn").addEventListener("click", () => {
  const t = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  try { localStorage.setItem("sb-theme", t); } catch { /* private window */ }
  applyTheme(t);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("settings").classList.contains("open")) return openSettings(false);
  if (e.target.closest("input, select, textarea")) return;
  if (e.target.closest("button") && (e.key === " " || e.key === "Enter")) return; // the button handles it
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === " ") { e.preventDefault(); setPlaying(!playing); }
  else if (e.key === "ArrowLeft") { setPlaying(false); step(-1); }
  else if (e.key === "ArrowRight") { setPlaying(false); step(1); }
  else if (e.key === "d") setView(S.view === "diff" ? "blink" : "diff");
  else if (e.key === "m") { S.marker = S.marker === "1" ? "0" : "1"; writeURL(); syncUI(); draw(); }
});
addEventListener("resize", () => { if (data) draw(); });

build(); readURL(); applyTheme(document.documentElement.dataset.theme); writeURL(); syncUI(); setPlaying(playing); load();
