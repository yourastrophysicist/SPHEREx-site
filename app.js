// SPHEREx Blink on yourastro.space. Every setting lives in the URL, so one link is one view (as in WiseView).
"use strict";

// position at epoch (deg), proper motion (mas/yr), best detector; same table as the prep notebook
const PRESETS = {
  Barnard:  { label: "Barnard's Star", ra: 269.44850252544, dec: 4.73942005111, epoch: 2016.0, pmra: -801.551, pmdec: 10362.394, band: "D1", size: 108 },
  EpsIndB:  { label: "Epsilon Indi B", ra: 331.07645259656, dec: -56.79381206688, epoch: 2016.0, pmra: 3981.977, pmdec: -2466.832, band: "D5", size: 108 },
  WISE0855: { label: "WISE 0855-0714", ra: 133.7947597, dec: -7.2451456, epoch: 2010.56, pmra: -8123.7, pmdec: 673.2, band: "D6", size: 216 },
  RWAur:    { label: "RW Aurigae", ra: 76.95608119553, dec: 30.40120458910, epoch: 2016.0, pmra: 2.641, pmdec: -27.398, band: "D1", size: 108 },
  RDra:     { label: "R Draconis", ra: 248.16737836729, dec: 66.75500674547, epoch: 2016.0, pmra: -20.643, pmdec: 6.149, band: "D3", size: 108 },
};

// ---------- words, in the three languages of the site ----------
const WORDS = {
  en: {
    "why.Barnard": "the fastest star on the sky, about 10 arcsec a year",
    "why.EpsIndB": "a nearby brown dwarf pair that moves about one pixel in total",
    "why.WISE0855": "the coldest known brown dwarf, too faint to see in one frame",
    "why.RWAur": "a young star that changes brightness and does not move",
    "why.RDra": "a Mira variable, period 246 days, V 6.7 to 13.2",
    "tag.Barnard": "moves fast", "tag.EpsIndB": "moves", "tag.WISE0855": "faint", "tag.RWAur": "varies", "tag.RDra": "varies",
    query: "Asking IRSA which exposures cover this spot",
    dl: "Downloading cutout {a} of {b}",
    slow: "The first view of a new field downloads every cutout, which takes a few minutes. After that it opens at once.",
    noserver: "This field needs the live data server.",
    noserverd: "On this site the five targets open at once. To look anywhere else, run the server from the GitHub repo on your own computer.",
    none: "SPHEREx has not observed this spot on this detector yet.", noned: "Try another detector.",
    fail: "Could not load this field.",
    copied: "link copied", copyfail: "copy failed, the link is in the address bar",
    exp: "exp", median: "median", pass: "pass", of: "of",
  },
  id: {
    "why.Barnard": "bintang tercepat di langit, sekitar 10 detik busur per tahun",
    "why.EpsIndB": "pasangan katai cokelat dekat yang bergeser sekitar satu piksel",
    "why.WISE0855": "katai cokelat terdingin yang diketahui, terlalu redup untuk satu bingkai",
    "why.RWAur": "bintang muda yang berubah terang dan tidak bergerak",
    "why.RDra": "bintang variabel Mira, periode 246 hari, V 6,7 sampai 13,2",
    "tag.Barnard": "bergerak cepat", "tag.EpsIndB": "bergerak", "tag.WISE0855": "redup", "tag.RWAur": "berubah", "tag.RDra": "berubah",
    query: "Menanyakan ke IRSA pengamatan mana yang mencakup titik ini",
    dl: "Mengunduh potongan {a} dari {b}",
    slow: "Tampilan pertama dari medan baru mengunduh semua potongan, jadi butuh beberapa menit. Setelah itu langsung terbuka.",
    noserver: "Medan ini butuh server data langsung.",
    noserverd: "Di situs ini kelima target langsung terbuka. Untuk melihat tempat lain, jalankan server dari repo GitHub di komputermu sendiri.",
    none: "SPHEREx belum mengamati titik ini dengan detektor ini.", noned: "Coba detektor lain.",
    fail: "Medan ini gagal dimuat.",
    copied: "tautan disalin", copyfail: "gagal menyalin, tautannya ada di bilah alamat",
    exp: "eksp", median: "median", pass: "lintasan", of: "dari",
  },
  it: {
    "why.Barnard": "la stella più veloce del cielo, circa 10 secondi d’arco l’anno",
    "why.EpsIndB": "una coppia di nane brune vicine che si sposta di circa un pixel",
    "why.WISE0855": "la nana bruna più fredda che si conosca, troppo debole in un solo fotogramma",
    "why.RWAur": "una stella giovane che cambia luminosità e non si muove",
    "why.RDra": "una variabile Mira, periodo 246 giorni, V da 6,7 a 13,2",
    "tag.Barnard": "veloce", "tag.EpsIndB": "si muove", "tag.WISE0855": "debole", "tag.RWAur": "varia", "tag.RDra": "varia",
    query: "Chiedo a IRSA quali esposizioni coprono questo punto",
    dl: "Scarico il ritaglio {a} di {b}",
    slow: "La prima volta un campo nuovo scarica tutti i ritagli, e ci vuole qualche minuto. Dopo si apre subito.",
    noserver: "Questo campo richiede il server dei dati.",
    noserverd: "Su questo sito i cinque oggetti si aprono subito. Per guardare altrove, avvia il server del repo GitHub sul tuo computer.",
    none: "SPHEREx non ha ancora osservato questo punto con questo rivelatore.", noned: "Prova un altro rivelatore.",
    fail: "Impossibile caricare questo campo.",
    copied: "link copiato", copyfail: "copia non riuscita, il link è nella barra degli indirizzi",
    exp: "esp", median: "mediana", pass: "passaggio", of: "di",
  },
};

// static page text, keyed by data-i18n; English is read from the page itself
const PAGE = {
  id: {
    skip: "Langsung ke isi", "n.home": "beranda", "n.notes": "catatan",
    eye: "NASA Space Apps Milano 2026 · Observationally Speaking",
    lede: "Pilih sebuah bintang dan lihat ia berjalan. Alat ini memutar gambar SPHEREx publik dari satu petak kecil langit, lintasan demi lintasan, sehingga apa pun yang cukup dekat untuk bergerak langsung terlihat di depan bintang-bintang di belakangnya.",
    "c.target": "target", "c.show": "yang ditampilkan", "c.view": "tampilan", "c.blink": "kedip", "c.diff": "selisih",
    "c.per": "satu gambar per", "c.pass": "lintasan", "c.exp": "pengamatan",
    "c.keys": "spasi putar atau jeda · panah melangkah · d selisih · m penanda",
    "c.own": "posisimu sendiri", "c.epoch": "epoch (tahun)", "c.size": "medan (detik busur)", "c.det": "detektor",
    "c.go": "tampilkan medan ini",
    "c.hint": "Masukkan posisi pada epoch, lalu gerak diri memindahkannya ke tanggal tiap pengamatan. Di situs ini kelima target langsung terbuka. Posisi lain bertanya ke arsip langsung, yang butuh server dari repo GitHub berjalan di komputermu.",
    "c.look": "tampilan gambar", "c.speed": "kedip tiap (ms)", "c.contrast": "kontras (%)", "c.stretch": "skala",
    "c.marker": "tandai posisi target", "c.invert": "balik warna", "c.mask": "kosongkan piksel yang ditandai buruk oleh SPHEREx",
    "c.copy": "salin tautan tampilan ini",
    "how.label": "cara kerjanya", "how.h": "Alatnya",
    "p1.t": "teleskopnya", "p1.d": "SPHEREx adalah teleskop survei inframerah seluruh langit milik NASA, diluncurkan pada Maret 2025. Ia memetakan seluruh langit setiap enam bulan dalam 102 warna antara 0,75 dan 5 mikron, sehingga setiap petak langit terlihat berulang kali.",
    "p2.t": "gambarnya", "p2.d": "Untuk tiap petak, alat ini meminta semua pengamatan SPHEREx ke NASA/IPAC IRSA, memotong kotak kecil, menghapus cahaya debu di tata surya kita sendiri, lalu menaruh semua potongan pada satu kisi tetap dengan utara di atas. Bintang jauh diam di tempat. Bintang yang dekat dengan kita berjalan.",
    "p3.t": "pengujiannya", "p3.d": "Kami mengujinya pada objek yang sudah kami kenal. Di 60 pengamatannya, Bintang Barnard rata-rata jatuh kurang dari sepersepuluh piksel dari posisi yang diramalkan Gaia. Kalau alat ini menunjukkan apa yang kami tahu memang ada, kami bisa memercayai apa yang ditunjukkannya di tempat lain.",
    diffnote: "Tampilan selisih mengurangkan median semua gambar dari tiap gambar. Apa pun yang tidak pernah berubah menjadi abu-abu rata. Sesuatu yang bergerak meninggalkan titik terang di tempatnya sekarang dan titik gelap di tempatnya dulu.",
    "tg.label": "lima target", "tg.h": "Mulai di sini", "th.t": "target", "th.w": "kenapa ada di sini", "th.d": "detektor",
    planetx: "Tantangannya, Planet X and SPHEREx, juga bertanya apakah SPHEREx bisa menangkap Planet X yang jauh. Bagian dari proyek ini adalah menjawab dengan jujur, dengan angka, seberapa redup yang sudah terlalu redup.",
    "cr.label": "kredit", "cr.h": "Terima kasih",
    "cr.d": "Data dari gambar SPHEREx Level 2, NASA/JPL-Caltech/IPAC, melalui NASA/IPAC IRSA. Posisi dan gerak dari Gaia DR3 (ESA/DPAC), dan untuk WISE 0855 dari AllWISE dengan gerak dari Kirkpatrick dkk. 2021. Ide kedipnya mengikuti WiseView karya Caselden dan rekan. Dibuat oleh Observationally Speaking di NASA Space Apps Milano, 14 dan 15 November 2026, berangkat dari skrip persiapan kami sendiri tanggal 10 November. Sebagian kode ditulis dengan bantuan Claude (Anthropic).",
    "b.nasa": "SPHEREx di NASA", "b.irsa": "datanya di IRSA", "b.code": "kodenya di GitHub", "b.home": "kembali ke yourastro.space",
    foot: 'Padova, Italia · 45,4° LU, 11,9° BT · bagian dari <a href="/">yourastro.space</a>',
  },
  it: {
    skip: "Vai al contenuto", "n.home": "home", "n.notes": "appunti",
    eye: "NASA Space Apps Milano 2026 · Observationally Speaking",
    lede: "Scegli una stella e guardala camminare. Questo strumento mostra le immagini pubbliche di SPHEREx di una piccola zona di cielo, un passaggio dopo l’altro, così tutto ciò che è abbastanza vicino da muoversi salta all’occhio sulle stelle dietro.",
    "c.target": "oggetto", "c.show": "cosa mostrare", "c.view": "vista", "c.blink": "blink", "c.diff": "differenza",
    "c.per": "un’immagine per", "c.pass": "passaggio", "c.exp": "esposizione",
    "c.keys": "spazio avvia o ferma · frecce un passo · d differenza · m segno",
    "c.own": "la tua posizione", "c.epoch": "epoca (anno)", "c.size": "campo (arcsec)", "c.det": "rivelatore",
    "c.go": "mostra questo campo",
    "c.hint": "Inserisci la posizione all’epoca, e il moto proprio la sposta alla data di ogni esposizione. Su questo sito i cinque oggetti si aprono subito. Ogni altra posizione interroga l’archivio, e serve il server del repo GitHub acceso sul tuo computer.",
    "c.look": "aspetto", "c.speed": "blink ogni (ms)", "c.contrast": "contrasto (%)", "c.stretch": "scala",
    "c.marker": "segna dove dovrebbe essere l’oggetto", "c.invert": "inverti", "c.mask": "nascondi i pixel che SPHEREx segnala come difettosi",
    "c.copy": "copia il link di questa vista",
    "how.label": "come funziona", "how.h": "Lo strumento",
    "p1.t": "il telescopio", "p1.d": "SPHEREx è il telescopio della NASA che osserva tutto il cielo nell’infrarosso, lanciato a marzo 2025. Mappa l’intero cielo ogni sei mesi in 102 colori tra 0,75 e 5 micron, quindi ogni zona del cielo viene vista più e più volte.",
    "p2.t": "le immagini", "p2.d": "Per ogni zona lo strumento chiede a NASA/IPAC IRSA tutte le esposizioni SPHEREx, ritaglia un piccolo quadrato, toglie il bagliore della polvere del nostro sistema solare e mette ogni ritaglio su una griglia fissa con il nord in alto. Le stelle lontane restano ferme. Una stella vicina cammina.",
    "p3.t": "la verifica", "p3.d": "L’abbiamo provato su oggetti che conosciamo già. Nelle sue 60 esposizioni la Stella di Barnard cade in media entro un decimo di pixel da dove Gaia dice che dovrebbe essere. Se lo strumento mostra ciò che sappiamo esserci, possiamo credere a ciò che mostra altrove.",
    diffnote: "La vista differenza sottrae a ogni immagine la mediana di tutte. Ciò che non cambia mai diventa un grigio uniforme. Qualcosa che si è mosso lascia un punto chiaro dove si trova e uno scuro dove era.",
    "tg.label": "i cinque oggetti", "tg.h": "Inizia qui", "th.t": "oggetto", "th.w": "perché è qui", "th.d": "rivelatore",
    planetx: "La sfida, Planet X and SPHEREx, chiede anche se SPHEREx potrebbe vedere un Pianeta X lontano. Parte del progetto è dire con onestà, con i numeri, quanto debole è troppo debole.",
    "cr.label": "crediti", "cr.h": "Grazie",
    "cr.d": "Dati dalle immagini SPHEREx Level 2, NASA/JPL-Caltech/IPAC, tramite NASA/IPAC IRSA. Posizioni e moti da Gaia DR3 (ESA/DPAC), e per WISE 0855 da AllWISE con il moto di Kirkpatrick et al. 2021. L’idea del blink segue WiseView di Caselden e collaboratori. Fatto da Observationally Speaking a NASA Space Apps Milano, il 14 e 15 novembre 2026, partendo dai nostri script di preparazione del 10 novembre. Parte del codice è stata scritta con l’aiuto di Claude (Anthropic).",
    "b.nasa": "SPHEREx alla NASA", "b.irsa": "i dati su IRSA", "b.code": "il codice su GitHub", "b.home": "torna a yourastro.space",
    foot: 'Padova, Italia · 45,4° N, 11,9° E · una pagina di <a href="/">yourastro.space</a>',
  },
};

const DEFAULTS = {
  ra: "", dec: "", size: "108", band: "D1", pmra: "0", pmdec: "0", epoch: "2016.0",
  view: "blink", mode: "pass", speed: "500", stretch: "asinh", contrast: "99.5",
  invert: "0", marker: "1", mask: "0",
};
const DATA_KEYS = ["ra", "dec", "size", "band", "pmra", "pmdec", "epoch"];
const PIX_ARCSEC = 6.15;

const $ = (id) => document.getElementById(id);
const canvas = $("sky"), ctx = canvas.getContext("2d"), form = $("whereForm");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let S = {}, data = null, views = [], idx = 0, timer = null, playing = !reduceMotion, loadSeq = 0;
let lang = "en", lastStatus = null;

const T = (k, vars) => {
  let s = (WORDS[lang] && WORDS[lang][k]) || WORDS.en[k] || k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
};

// ---------- language, shared with the rest of yourastro.space ----------
const EN = {};
document.querySelectorAll("[data-i18n]").forEach((n) => { if (!(n.dataset.i18n in EN)) EN[n.dataset.i18n] = n.innerHTML; });
function applyLang(l) {
  lang = l === "id" || l === "it" ? l : "en";
  const d = lang === "en" ? EN : PAGE[lang];
  document.querySelectorAll("[data-i18n]").forEach((n) => { const v = d[n.dataset.i18n]; if (v != null) n.innerHTML = v; });
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  buildTargets(); nowLine();
  if (lastStatus) lastStatus();
  if (data) { buildViews(); draw(); }
}
document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => {
  applyLang(b.dataset.lang);
  try { localStorage.setItem("yas-lang", b.dataset.lang); } catch { /* private window */ }
}));

// ---------- URL <-> settings ----------
const presetFor = () => Object.keys(PRESETS).find((k) => DATA_KEYS.every((d) => String(PRESETS[k][d]) === S[d]));

function readURL() {
  const q = new URLSearchParams(location.search);
  S = { ...DEFAULTS };
  const p = PRESETS[q.get("target")] || (!q.has("ra") ? PRESETS.Barnard : null);  // a sky, never an empty box
  if (p) for (const k of DATA_KEYS) S[k] = String(p[k]);
  for (const k of Object.keys(DEFAULTS)) if (q.has(k)) S[k] = q.get(k);
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
  document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.view === S.view)));
  document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.mode === S.mode)));
  const t = presetFor();
  document.querySelectorAll("#targets button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.key === t)));
  const sign = +S.dec >= 0 ? "+" : "";
  $("where").textContent = `ra ${(+S.ra).toFixed(4)} · dec ${sign}${(+S.dec).toFixed(4)} · ${S.band}`;
  nowLine();
}

function nowLine() {
  const t = presetFor();
  $("now").textContent = t ? `${PRESETS[t].label}, ${T("why." + t)}.` : "";
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

  const slow = setTimeout(() => showLoading(() => [T("query")]), 400);
  const poll = setInterval(async () => {
    try {
      const p = await (await fetch("/api/progress?job=" + job)).json();
      if (seq !== loadSeq) return;
      if (p.stage === "download" && p.total) showLoading(() => [T("dl", { a: p.done, b: p.total })], p.done / p.total);
    } catch { /* no server, or the next tick will try again */ }
  }, 1000);

  try {
    let j = null;
    // the five targets ship as static files, so they open at once on plain static hosting
    if (t && S.size === String(PRESETS[t].size)) {
      try {
        const r = await fetch(`data/${t}${S.mask === "1" ? "_mask" : ""}.json`);
        if (r.ok) j = await r.json();
      } catch { /* fall through to the server */ }
    }
    if (!j) {
      let r;
      try { r = await fetch("/api/frames?" + q); } catch { r = null; }
      if (!r || !(r.headers.get("content-type") || "").includes("json")) {   // no server, e.g. yourastro.space
        if (seq !== loadSeq) return;
        data = null; views = []; draw();
        showError(() => [T("noserver"), T("noserverd")]);
        return;
      }
      j = await r.json();
      if (!r.ok) throw new Error(j.error || r.statusText);
    }
    if (seq !== loadSeq) return;
    if (!j.frames.length) { data = null; views = []; draw(); showError(() => [T("none"), T("noned")]); return; }
    data = j; hideLoading(); buildViews(); idx = 0; draw(); if (playing) start();
  } catch (e) {
    if (seq === loadSeq) showError(() => [T("fail"), e.message]);
  } finally {
    clearTimeout(slow); clearInterval(poll);
  }
}

// status messages are functions, so a language switch can redraw them
function showLoading(msg, frac) {
  lastStatus = () => showLoading(msg, frac);
  const L = $("loading"); L.hidden = false; L.classList.remove("err");
  $("loadMsg").textContent = msg()[0];
  const bar = $("loadBar"); bar.hidden = false;
  bar.classList.toggle("busy", frac === undefined);
  bar.firstElementChild.style.width = frac === undefined ? "" : `${Math.round(frac * 100)}%`;
  $("loadSub").textContent = T("slow");
}
function showError(msg) {
  lastStatus = () => showError(msg);
  const [a, b] = msg();
  const L = $("loading"); L.hidden = false; L.classList.add("err");
  $("loadMsg").textContent = a; $("loadBar").hidden = true; $("loadSub").textContent = b || "";
}
function hideLoading() { lastStatus = null; $("loading").hidden = true; }

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
        when: `${mean(yr).toFixed(2)} · ${fs.length} ${T("exp")}`,
        lambda: `${Math.min(...wl).toFixed(2)}–${Math.max(...wl).toFixed(2)} µm`,
      };
    });
  }
  // difference view: each image minus the median of all of them, so whatever never changes cancels
  const ref = stackMedian(views.map((v) => v.image), n);
  for (const v of views) v.diff = v.image.map((x, p) => (x === null || ref[p] === null ? null : x - ref[p]));
  $("scrub").max = Math.max(0, views.length - 1);
  if (idx >= views.length) idx = 0;
}

// ---------- drawing ----------
const pct = (s, p) => s.length ? s[Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))))] : 0;

function draw() {
  if (!data || !views.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $("pillWhen").textContent = ""; $("pillLambda").textContent = ""; $("count").textContent = "0 / 0";
    return;
  }
  const N = data.npix, v = views[idx], diff = S.view === "diff";
  const img = diff ? v.diff : v.image;
  const px = Math.max(1, Math.round((canvas.getBoundingClientRect().width || 760) * (devicePixelRatio || 1)));
  const scale = Math.max(1, Math.floor(px / N));
  canvas.width = canvas.height = N * scale;

  const finite = img.filter((x) => x !== null).sort((a, b) => a - b);
  const c = Math.min(100, Math.max(50, parseFloat(S.contrast) || 99.5));
  const med = pct(finite, 50);
  const noise = 1.4826 * pct(finite.map((x) => Math.abs(x - med)).sort((a, b) => a - b), 50) || 1e-3;
  const asinh = S.stretch === "asinh", inv = S.invert === "1";
  let map;
  if (diff) {          // symmetric about zero, so no change is mid grey
    const top = Math.max(pct(finite.map(Math.abs).sort((a, b) => a - b), c), noise), beta = 2 * noise;
    map = asinh ? (x) => 0.5 + 0.5 * Math.asinh(x / beta) / Math.asinh(top / beta) : (x) => 0.5 + 0.5 * x / top;
  } else {             // sky level from the median, softening from the noise
    const lo = asinh ? med - 2 * noise : pct(finite, 100 - c);
    const hi = Math.max(pct(finite, c), lo + noise), beta = 3 * noise, norm = Math.asinh((hi - lo) / beta);
    map = asinh ? (x) => Math.asinh((x - lo) / beta) / norm : (x) => (x - lo) / (hi - lo);
  }

  const id = ctx.createImageData(N, N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const val = img[y * N + x], o = ((N - 1 - y) * N + x) * 4;   // grid row 0 is south
      if (val === null) { id.data.set([38, 40, 58, 255], o); continue; }  // no data, a dark slate, not black
      let t = Math.min(1, Math.max(0, map(val)));
      if (inv) t = 1 - t;
      const g = Math.round(255 * t);              // plain greyscale, as astronomers read images
      id.data[o] = g; id.data[o + 1] = g; id.data[o + 2] = g; id.data[o + 3] = 255;
    }
  }
  const off = document.createElement("canvas"); off.width = off.height = N;
  off.getContext("2d").putImageData(id, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, 0, 0, N * scale, N * scale);

  const W = N * scale, u = W / 380, ink = inv ? "#111" : "#f2f2f2";
  ctx.lineWidth = Math.max(1, 1.6 * u); ctx.lineCap = "square";
  if (S.marker === "1" && v.target) {        // four ticks with a gap, never covering the object
    const cx = (v.target[0] + 0.5) * scale, cy = (N - 1 - v.target[1] + 0.5) * scale;
    const a = Math.max(3 * scale, 10 * u), b = a + Math.max(2 * scale, 8 * u);
    ctx.strokeStyle = inv ? "#141ef0" : "#7a82ff";    // the site blue, light enough to read on black
    ctx.beginPath();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.moveTo(cx + dx * a, cy + dy * a); ctx.lineTo(cx + dx * b, cy + dy * b); }
    ctx.stroke();
  }
  ctx.strokeStyle = ink; ctx.fillStyle = ink;
  ctx.font = `600 ${Math.round(11 * u)}px "JetBrains Mono", monospace`;
  // compass, bottom left: north up, east left
  const L = 24 * u, ox = 28 * u + L, oy = W - 16 * u;
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - L); ctx.moveTo(ox, oy); ctx.lineTo(ox - L, oy); ctx.stroke();
  ctx.textAlign = "center"; ctx.fillText("N", ox, oy - L - 6 * u);
  ctx.textAlign = "right"; ctx.fillText("E", ox - L - 5 * u, oy + 4 * u);
  // scale bar, bottom right: 30 arcsec
  const bar = (30 / PIX_ARCSEC) * scale, bx = W - 16 * u - bar, by = W - 16 * u;
  ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bar, by); ctx.stroke();
  ctx.textAlign = "center"; ctx.fillText('30"', bx + bar / 2, by - 7 * u);

  $("pillWhen").textContent = diff ? `${v.when} − ${T("median")}` : v.when;
  $("pillLambda").textContent = v.lambda;
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

// ---------- targets: the list beside the viewer and the table below ----------
function buildTargets() {
  const seg = $("targets"), tb = $("targetTable"), t = presetFor();
  seg.textContent = ""; tb.textContent = "";
  for (const [key, p] of Object.entries(PRESETS)) {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "radio"); b.dataset.key = key;
    b.setAttribute("aria-checked", String(key === t));
    b.innerHTML = `<span>${p.label}</span><small>${p.band} · ${T("tag." + key)}</small>`;
    b.addEventListener("click", () => choose(key));
    seg.appendChild(b);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><button type="button">${p.label}</button></td><td>${T("why." + key)}</td><td>${p.band}</td>`;
    tr.querySelector("button").addEventListener("click", () => { choose(key); $("tool").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
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

document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
$("play").addEventListener("click", () => setPlaying(!playing));
$("scrub").addEventListener("input", (e) => { setPlaying(false); idx = +e.target.value; draw(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  for (const k of DATA_KEYS) S[k] = form.elements[k].value.trim() || DEFAULTS[k];
  writeURL(); syncUI(); load();
});
$("speed").addEventListener("change", (e) => { S.speed = e.target.value; writeURL(); if (playing) start(); });
$("contrast").addEventListener("change", (e) => { S.contrast = e.target.value; writeURL(); draw(); });
$("stretch").addEventListener("change", (e) => { S.stretch = e.target.value; writeURL(); draw(); });
$("marker").addEventListener("change", (e) => { S.marker = e.target.checked ? "1" : "0"; writeURL(); draw(); });
$("invert").addEventListener("change", (e) => { S.invert = e.target.checked ? "1" : "0"; writeURL(); draw(); });
$("mask").addEventListener("change", (e) => { S.mask = e.target.checked ? "1" : "0"; writeURL(); load(); });
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(location.href); toast(T("copied")); }
  catch { toast(T("copyfail")); }
});

document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, select, textarea, summary")) return;
  if (e.target.closest("button") && (e.key === " " || e.key === "Enter")) return; // the button handles it
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === " ") { e.preventDefault(); setPlaying(!playing); }
  else if (e.key === "ArrowLeft") { setPlaying(false); step(-1); }
  else if (e.key === "ArrowRight") { setPlaying(false); step(1); }
  else if (e.key === "d") setView(S.view === "diff" ? "blink" : "diff");
  else if (e.key === "m") { S.marker = S.marker === "1" ? "0" : "1"; writeURL(); syncUI(); draw(); }
});
addEventListener("resize", () => { if (data) draw(); });

// ---------- start ----------
readURL();
let startLang = "en";
try {
  const saved = localStorage.getItem("yas-lang");
  const nav = (navigator.language || "").toLowerCase().slice(0, 2);
  startLang = ["en", "id", "it"].includes(saved) ? saved : (nav === "id" || nav === "it" ? nav : "en");
} catch { /* private window */ }
applyLang(startLang);
if (!presetFor()) $("ownPanel").open = true;     // a shared custom link opens with its position showing
writeURL(); syncUI(); setPlaying(playing); load();
