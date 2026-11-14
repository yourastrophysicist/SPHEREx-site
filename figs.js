// Interactive figures for the story, one per chapter. Plain SVG drawn in the site's own colours
// (CSS classes in style.css), so they follow the light and dark theme without redrawing.
// Each builder gets an empty <figure> and fills it. No libraries.
"use strict";

// words in the figures, in the three languages of the site; {x} marks a number filled in live
const FIGTXT = {
  en: {
    "blink.aria": "A small patch of sky made of SPHEREx pixels, with Barnard's Star moving north",
    "blink.pix": "show as SPHEREx pixels", "blink.btn": "blink two visits", stop: "stop", "blink.time": "time",
    "blink.read": "year {y} · moved {d}″ north, {p} SPHEREx pixels",
    "blink.cap": "Each square is one SPHEREx pixel, 6.15 arcseconds across. Drag the time, or blink two visits a year apart. The red ticks mark where Gaia says Barnard's Star should be. The star never fills one pixel, its light spreads over a few, which is why its motion can be measured more finely than a pixel.",
    "glow.aria": "The glow of a body against wavelength, with the range of our eyes and of SPHEREx",
    eyes: "eyes", wl: "wavelength (μm)", "glow.temp": "temperature",
    "glow.read": "{t} K · glow peaks at {l} μm · {f}% of its light falls where SPHEREx looks",
    "p.sun": "the Sun", "p.barnard": "Barnard's Star", "p.bd": "a brown dwarf like Epsilon Indi Ba", "p.wise": "WISE 0855", "p.earth": "the Earth",
    "glow.cap": "Every warm body glows, and the cooler it is, the further into the infrared its glow peaks. The curve is an ideal glowing body, a blackbody. Real brown dwarfs have dark bands where methane and water absorb, but the shift is the same. Temperatures are approximate.",
    "filter.aria": "One SPHEREx detector, whose filter colour changes from one edge to the other",
    "filter.pos": "position", "filter.next": "next exposure",
    "filter.read": "{b} · the star falls at {x}% across the detector, so this exposure sees it at {l} μm",
    "filter.cap": "Colours are false, all of this is infrared. Each detector sits behind a filter whose colour changes from one edge to the other. When the telescope steps across the sky, the same star lands somewhere else on the detector and is seen in a slightly different colour. After enough steps every spot has been seen in 102 colours.",
    "steps.aria": "how the blink is made",
    "s1.n": "ask", "s1.d": "Ask NASA's archive, IRSA, for every SPHEREx exposure whose footprint covers the spot, in one detector.",
    "s2.n": "cut", "s2.d": "Cut a small square around the spot out of each exposure. A star that moves is followed to the date of each picture.",
    "s3.n": "clean", "s3.d": "Subtract the zodiacal light, the glow of dust in our own Solar System, and mark the pixels the pipeline flags as bad.",
    "s4.n": "align", "s4.d": "Resample every square onto one fixed grid with north up, so distant stars land on exactly the same pixels.",
    "s5.n": "blink", "s5.d": "Play them in order. What stays still is far away. What walks is close. What changes brightness is variable.",
    "steps.cap": "Click a step. The same five steps run for the five targets ahead of time, and live for any other position on a local server.",
    watch: "watch it in SPHEREx ↑", pxyr: "px/yr",
    "targets.cap": "Pictures from NASA and ESA missions. The bars show motion on the sky in SPHEREx pixels per year, from Gaia DR3 and, for WISE 0855, Kirkpatrick et al. 2021. RW Aurigae and R Draconis have no NASA or ESA portrait, so their cards show a star of the same kind.",
    "tag.Barnard": "moves fast", "tag.EpsIndB": "tiny motion", "tag.WISE0855": "only in D6", "tag.RWAur": "changes brightness", "tag.RDra": "changes brightness",
    "alt.Barnard": "Barnard's Star moving across a field of stars in WISE infrared images",
    "cap.Barnard": "Barnard's Star crossing the sky in WISE infrared images from 2010 to 2022.",
    "alt.EpsIndB": "Webb image with the light of Epsilon Indi A blocked and the planet Epsilon Indi Ab as an orange dot",
    "cap.EpsIndB": "Its family. Webb's picture of Epsilon Indi Ab, a giant planet around Epsilon Indi A, the star the brown dwarf pair also orbits. The star is blocked, the orange dot is the planet.",
    "alt.WISE0855": "Animation of WISE 0855 jumping between infrared images taken months apart",
    "cap.WISE0855": "How it was found in 2014, by jumping between infrared images taken months apart, a blink like this page.",
    "alt.RWAur": "Hubble images of the young star HH 30 in 1994 and 1995, a disk seen edge-on with jets",
    "cap.RWAur": "Not RW Aurigae itself, but a star of its kind. Hubble's HH 30, a newborn star with its dusty disk edge-on and jets, a year apart.",
    "alt.RDra": "Hubble image of the red giant Mira, a lopsided disk",
    "cap.RDra": "Not R Draconis itself, but the star its class is named after. Hubble's 1997 picture of Mira, a pulsating red giant, lopsided as it swells and shrinks.",
    "px.aria": "Brightness of a distant planet against how faint SPHEREx can see",
    "px.one": "one exposure", "px.coadd": "all-sky co-add", "px.bright": "← brighter", "px.faint": "fainter →   V magnitude",
    "px.size": "size (Earths)", "px.refl": "reflectivity", "px.dist": "distance (AU)",
    "px.yes": "V ≈ {v} · bright enough for one SPHEREx exposure · it would swing by {p} pixels a year as the Earth goes round the Sun",
    "px.no": "V ≈ {v} · about {k} times too faint for one SPHEREx exposure · it would swing by {p} pixels a year, so motion is not the problem, faintness is",
    "px.cap": "A planet far beyond Neptune only reflects sunlight, so its brightness falls as the fourth power of its distance. Move the sliders. The SPHEREx depths are published forecasts, not our measurements. Recent estimates for Planet Nine are about 4 to 6 Earth masses, 2 to 4 Earth radii, at 300 to 400 AU.",
    plates: "blink the plates",
  },
  id: {
    "blink.aria": "Sepetak kecil langit dari piksel SPHEREx, dengan Bintang Barnard yang bergerak ke utara",
    "blink.pix": "tampilkan sebagai piksel SPHEREx", "blink.btn": "kedipkan dua kunjungan", stop: "berhenti", "blink.time": "waktu",
    "blink.read": "tahun {y} · bergeser {d}″ ke utara, {p} piksel SPHEREx",
    "blink.cap": "Tiap kotak adalah satu piksel SPHEREx, lebarnya 6,15 detik busur. Geser waktunya, atau kedipkan dua kunjungan yang berselang setahun. Garis merah menandai tempat Bintang Barnard menurut Gaia. Bintang ini tidak pernah mengisi satu piksel saja, cahayanya tersebar ke beberapa piksel, dan karena itu geraknya bisa diukur lebih halus dari satu piksel.",
    "glow.aria": "Pancaran sebuah benda menurut panjang gelombang, dengan rentang mata kita dan rentang SPHEREx",
    eyes: "mata", wl: "panjang gelombang (μm)", "glow.temp": "suhu",
    "glow.read": "{t} K · pancarannya memuncak di {l} μm · {f}% cahayanya jatuh di rentang yang dilihat SPHEREx",
    "p.sun": "Matahari", "p.barnard": "Bintang Barnard", "p.bd": "katai cokelat seperti Epsilon Indi Ba", "p.wise": "WISE 0855", "p.earth": "Bumi",
    "glow.cap": "Setiap benda hangat memancarkan cahaya, dan makin dingin benda itu, makin jauh ke inframerah puncak pancarannya. Kurva ini adalah benda pemancar ideal, benda hitam. Katai cokelat sungguhan punya pita gelap tempat metana dan air menyerap cahaya, tetapi pergeserannya sama. Suhunya perkiraan.",
    "filter.aria": "Satu detektor SPHEREx, yang warna filternya berubah dari satu tepi ke tepi lainnya",
    "filter.pos": "posisi", "filter.next": "pengamatan berikutnya",
    "filter.read": "{b} · bintang jatuh di {x}% lebar detektor, jadi pengamatan ini melihatnya di {l} μm",
    "filter.cap": "Warnanya palsu, semua ini inframerah. Tiap detektor ada di belakang filter yang warnanya berubah dari satu tepi ke tepi lain. Saat teleskop melangkah menyapu langit, bintang yang sama jatuh di tempat lain pada detektor dan terlihat dalam warna yang sedikit berbeda. Setelah cukup banyak langkah, setiap titik sudah terlihat dalam 102 warna.",
    "steps.aria": "bagaimana kedipan dibuat",
    "s1.n": "tanya", "s1.d": "Tanyakan ke arsip NASA, IRSA, setiap pengamatan SPHEREx yang mencakup titik itu, pada satu detektor.",
    "s2.n": "potong", "s2.d": "Potong kotak kecil di sekitar titik itu dari tiap pengamatan. Bintang yang bergerak diikuti ke tanggal tiap gambar.",
    "s3.n": "bersihkan", "s3.d": "Kurangi cahaya zodiak, pendaran debu di Tata Surya kita sendiri, dan tandai piksel yang ditandai buruk oleh pipeline.",
    "s4.n": "jajarkan", "s4.d": "Tempatkan ulang tiap kotak pada satu kisi tetap dengan utara di atas, sehingga bintang jauh jatuh tepat di piksel yang sama.",
    "s5.n": "kedipkan", "s5.d": "Putar berurutan. Yang diam itu jauh. Yang berjalan itu dekat. Yang berubah terang itu bintang variabel.",
    "steps.cap": "Klik sebuah langkah. Lima langkah yang sama dijalankan lebih dulu untuk kelima target, dan langsung untuk posisi lain lewat server lokal.",
    watch: "lihat di SPHEREx ↑", pxyr: "piksel/tahun",
    "targets.cap": "Gambar dari misi NASA dan ESA. Batangnya menunjukkan gerak di langit dalam piksel SPHEREx per tahun, dari Gaia DR3, dan untuk WISE 0855 dari Kirkpatrick dkk. 2021. RW Aurigae dan R Draconis tidak punya potret dari NASA atau ESA, jadi kartunya menampilkan bintang sejenis.",
    "tag.Barnard": "bergerak cepat", "tag.EpsIndB": "gerak kecil", "tag.WISE0855": "hanya di D6", "tag.RWAur": "berubah terang", "tag.RDra": "berubah terang",
    "alt.Barnard": "Bintang Barnard bergerak melintasi medan bintang dalam citra inframerah WISE",
    "cap.Barnard": "Bintang Barnard melintasi langit dalam citra inframerah WISE dari 2010 sampai 2022.",
    "alt.EpsIndB": "Citra Webb dengan cahaya Epsilon Indi A ditutup dan planet Epsilon Indi Ab sebagai titik jingga",
    "cap.EpsIndB": "Keluarganya. Gambar Webb tentang Epsilon Indi Ab, planet raksasa yang mengorbit Epsilon Indi A, bintang yang juga diorbit pasangan katai cokelat ini. Bintangnya ditutup, titik jingga itu planetnya.",
    "alt.WISE0855": "Animasi WISE 0855 yang melompat di antara citra inframerah berselang beberapa bulan",
    "cap.WISE0855": "Begini ia ditemukan pada 2014, dengan melompat di antara citra inframerah yang berselang beberapa bulan, sebuah kedipan seperti halaman ini.",
    "alt.RWAur": "Citra Hubble bintang muda HH 30 pada 1994 dan 1995, piringan dari samping dengan semburan",
    "cap.RWAur": "Bukan RW Aurigae sendiri, tetapi bintang sejenisnya. HH 30 dari Hubble, bintang yang baru lahir dengan piringan debu terlihat dari samping dan semburannya, berselang setahun.",
    "alt.RDra": "Citra Hubble raksasa merah Mira, piringan yang tidak simetris",
    "cap.RDra": "Bukan R Draconis sendiri, tetapi bintang yang menjadi nama kelasnya. Gambar Hubble tahun 1997 tentang Mira, raksasa merah yang berdenyut, tidak simetris saat mengembang dan menyusut.",
    "px.aria": "Kecerlangan planet jauh dibandingkan batas paling redup yang bisa dilihat SPHEREx",
    "px.one": "satu pengamatan", "px.coadd": "gabungan seluruh langit", "px.bright": "← lebih terang", "px.faint": "lebih redup →   magnitudo V",
    "px.size": "ukuran (Bumi)", "px.refl": "daya pantul", "px.dist": "jarak (SA)",
    "px.yes": "V ≈ {v} · cukup terang untuk satu pengamatan SPHEREx · ia akan berayun {p} piksel per tahun saat Bumi mengitari Matahari",
    "px.no": "V ≈ {v} · sekitar {k} kali terlalu redup untuk satu pengamatan SPHEREx · ia akan berayun {p} piksel per tahun, jadi masalahnya bukan gerak, tetapi redupnya",
    "px.cap": "Planet yang jauh di luar Neptunus hanya memantulkan cahaya Matahari, jadi kecerlangannya turun sebanding pangkat empat jaraknya. Geser penggesernya. Batas SPHEREx adalah prakiraan yang sudah diterbitkan, bukan pengukuran kami. Perkiraan terbaru untuk Planet Sembilan sekitar 4 sampai 6 massa Bumi, 2 sampai 4 jari-jari Bumi, pada 300 sampai 400 SA.",
    plates: "kedipkan pelatnya",
  },
  it: {
    "blink.aria": "Un piccolo pezzo di cielo fatto di pixel SPHEREx, con la Stella di Barnard che si muove verso nord",
    "blink.pix": "mostra come pixel SPHEREx", "blink.btn": "blink di due visite", stop: "ferma", "blink.time": "tempo",
    "blink.read": "anno {y} · spostata di {d}″ verso nord, {p} pixel SPHEREx",
    "blink.cap": "Ogni quadrato è un pixel SPHEREx, largo 6,15 secondi d’arco. Trascina il tempo, oppure fai il blink di due visite a un anno di distanza. I segni rossi indicano dove Gaia dice che dovrebbe essere la Stella di Barnard. La stella non riempie mai un solo pixel, la sua luce si distribuisce su alcuni, ed è per questo che il suo moto si misura con più finezza di un pixel.",
    "glow.aria": "Il bagliore di un corpo in funzione della lunghezza d’onda, con l’intervallo dei nostri occhi e quello di SPHEREx",
    eyes: "occhi", wl: "lunghezza d’onda (μm)", "glow.temp": "temperatura",
    "glow.read": "{t} K · il bagliore ha il picco a {l} μm · il {f}% della sua luce cade dove guarda SPHEREx",
    "p.sun": "il Sole", "p.barnard": "la Stella di Barnard", "p.bd": "una nana bruna come Epsilon Indi Ba", "p.wise": "WISE 0855", "p.earth": "la Terra",
    "glow.cap": "Ogni corpo caldo emette luce, e più è freddo, più il picco del suo bagliore si sposta nell’infrarosso. La curva è un corpo ideale, un corpo nero. Le nane brune vere hanno bande scure dove metano e acqua assorbono, ma lo spostamento è lo stesso. Le temperature sono approssimative.",
    "filter.aria": "Un rivelatore SPHEREx, il cui filtro cambia colore da un bordo all’altro",
    "filter.pos": "posizione", "filter.next": "esposizione successiva",
    "filter.read": "{b} · la stella cade al {x}% del rivelatore, quindi questa esposizione la vede a {l} μm",
    "filter.cap": "I colori sono finti, è tutto infrarosso. Ogni rivelatore sta dietro un filtro il cui colore cambia da un bordo all’altro. Quando il telescopio si sposta nel cielo, la stessa stella cade in un altro punto del rivelatore e viene vista in un colore leggermente diverso. Dopo abbastanza passi ogni punto è stato visto in 102 colori.",
    "steps.aria": "come si fa il blink",
    "s1.n": "chiedi", "s1.d": "Chiedi all’archivio della NASA, IRSA, ogni esposizione SPHEREx che copre quel punto, in un rivelatore.",
    "s2.n": "ritaglia", "s2.d": "Ritaglia un piccolo quadrato attorno al punto da ogni esposizione. Una stella che si muove viene seguita alla data di ogni immagine.",
    "s3.n": "pulisci", "s3.d": "Sottrai la luce zodiacale, il bagliore della polvere del nostro Sistema Solare, e segna i pixel che la pipeline indica come difettosi.",
    "s4.n": "allinea", "s4.d": "Ricampiona ogni quadrato su una griglia fissa con il nord in alto, così le stelle lontane cadono esattamente sugli stessi pixel.",
    "s5.n": "blink", "s5.d": "Mostrali in ordine. Ciò che resta fermo è lontano. Ciò che cammina è vicino. Ciò che cambia luminosità è variabile.",
    "steps.cap": "Clicca un passo. Gli stessi cinque passi girano in anticipo per i cinque oggetti, e dal vivo per ogni altra posizione su un server locale.",
    watch: "guardalo in SPHEREx ↑", pxyr: "px/anno",
    "targets.cap": "Immagini dalle missioni NASA ed ESA. Le barre mostrano il moto nel cielo in pixel SPHEREx all’anno, da Gaia DR3 e, per WISE 0855, da Kirkpatrick et al. 2021. RW Aurigae e R Draconis non hanno un ritratto NASA o ESA, quindi le loro schede mostrano una stella dello stesso tipo.",
    "tag.Barnard": "veloce", "tag.EpsIndB": "moto minimo", "tag.WISE0855": "solo in D6", "tag.RWAur": "cambia luminosità", "tag.RDra": "cambia luminosità",
    "alt.Barnard": "La Stella di Barnard che attraversa un campo di stelle in immagini infrarosse di WISE",
    "cap.Barnard": "La Stella di Barnard che attraversa il cielo nelle immagini infrarosse di WISE dal 2010 al 2022.",
    "alt.EpsIndB": "Immagine di Webb con la luce di Epsilon Indi A oscurata e il pianeta Epsilon Indi Ab come punto arancione",
    "cap.EpsIndB": "La sua famiglia. L’immagine di Webb di Epsilon Indi Ab, un pianeta gigante attorno a Epsilon Indi A, la stella attorno a cui orbita anche la coppia di nane brune. La stella è oscurata, il punto arancione è il pianeta.",
    "alt.WISE0855": "Animazione di WISE 0855 che salta tra immagini infrarosse prese a mesi di distanza",
    "cap.WISE0855": "Come è stata trovata nel 2014, saltando tra immagini infrarosse prese a mesi di distanza, un blink come questa pagina.",
    "alt.RWAur": "Immagini Hubble della giovane stella HH 30 nel 1994 e nel 1995, un disco visto di taglio con getti",
    "cap.RWAur": "Non RW Aurigae, ma una stella del suo tipo. HH 30 vista da Hubble, una stella appena nata con il disco di polvere di taglio e i getti, a un anno di distanza.",
    "alt.RDra": "Immagine Hubble della gigante rossa Mira, un disco asimmetrico",
    "cap.RDra": "Non R Draconis, ma la stella che dà il nome alla sua classe. L’immagine Hubble del 1997 di Mira, una gigante rossa pulsante, asimmetrica mentre si gonfia e si contrae.",
    "px.aria": "Luminosità di un pianeta lontano rispetto a quanto in profondità vede SPHEREx",
    "px.one": "una esposizione", "px.coadd": "somma di tutto il cielo", "px.bright": "← più luminoso", "px.faint": "più debole →   magnitudine V",
    "px.size": "dimensione (Terre)", "px.refl": "riflettività", "px.dist": "distanza (UA)",
    "px.yes": "V ≈ {v} · abbastanza luminoso per una esposizione SPHEREx · oscillerebbe di {p} pixel all’anno mentre la Terra gira attorno al Sole",
    "px.no": "V ≈ {v} · circa {k} volte troppo debole per una esposizione SPHEREx · oscillerebbe di {p} pixel all’anno, quindi il problema non è il moto, è la debolezza",
    "px.cap": "Un pianeta molto oltre Nettuno riflette solo la luce del Sole, quindi la sua luminosità cala con la quarta potenza della distanza. Muovi i cursori. Le profondità di SPHEREx sono previsioni pubblicate, non nostre misure. Le stime recenti per il Pianeta Nove sono di circa 4 a 6 masse terrestri, 2 a 4 raggi terrestri, a 300 a 400 UA.",
    plates: "fai il blink delle lastre",
  },
};
const FT = (k, vars) => {
  const L = (typeof lang === "string" && FIGTXT[lang]) || FIGTXT.en;
  let s = L[k] ?? FIGTXT.en[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
};

const SVGNS = "http://www.w3.org/2000/svg";
const reduceMotionFig = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FIG_STOPS = [];   // functions that stop running timers, called before the story redraws

function sv(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}
function hx(tag, attrs = {}, html = "", parent) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
const fmt = (x, d = 1) => Number(x).toLocaleString(typeof lang === "string" ? lang : "en", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false });

// a slider with its label and live value
function slider(parent, label, min, max, step, value, onInput) {
  const wrap = hx("label", { class: "fig-slider" }, `<span>${label}</span>`, parent);
  const input = hx("input", { type: "range", min, max, step, value }, "", wrap);
  const out = hx("output", {}, "", wrap);
  input.addEventListener("input", () => onInput(+input.value, out));
  onInput(+input.value, out);
  return input;
}


// one NASA or ESA picture per target, all from Wikimedia Commons with their licences
const TARGET_IMG = {
  Barnard: { name: "Barnard's Star", px: 1.69, video: "img/story/barnard_wise.webm", src: "img/story/barnard_wise.jpg",
    credit: "NASA WISE, public domain", page: "https://commons.wikimedia.org/wiki/File:Barnards_Pfeilstern-2010-2022.webm" },
  EpsIndB: { name: "Epsilon Indi B", px: 0.76, src: "img/story/eps_indi_ab_jwst.jpg",
    credit: "ESA/Webb, NASA, CSA, STScI, E. Matthews (MPIA), CC BY 4.0", page: "https://commons.wikimedia.org/wiki/File:Exoplanet_Epsilon_Indi_Ab_(MIRI_image)_(weic2421a).jpg" },
  WISE0855: { name: "WISE 0855-0714", px: 1.33, src: "img/story/wise0855_motion.gif",
    credit: "NASA/JPL-Caltech/Penn State University, public domain", page: "https://commons.wikimedia.org/wiki/File:WISE_J085510.83%E2%80%93071442.5_movement_(PIA18002).gif" },
  RWAur: { name: "RW Aurigae", px: 0.004, src: "img/story/hh30_hubble.jpg",
    credit: "C. Burrows (STScI and ESA), WFPC2 team, NASA, public domain", page: "https://commons.wikimedia.org/wiki/File:Motion_of_Jets_from_an_Embryonic_Star_(HH-30)_(1995-24-301).jpg" },
  RDra: { name: "R Draconis", px: 0.003, src: "img/story/mira_hubble.jpg",
    credit: "M. Karovska (CfA) and NASA, public domain", page: "https://commons.wikimedia.org/wiki/File:Mira_1997.jpg" },
};

// a looping video where there is one (no autoplay for people who ask for less motion), else the picture
function targetMedia(t, key) {
  const alt = key ? FT("alt." + key) : t.alt;
  if (t.video) {
    const v = hx("video", { muted: "", loop: "", playsinline: "", preload: "none", poster: t.src, "aria-label": alt, class: "tmedia" });
    if (!reduceMotionFig) v.setAttribute("autoplay", ""); else v.setAttribute("controls", "");
    v.muted = true;
    hx("source", { src: t.video, type: "video/webm" }, "", v);
    return v;
  }
  return hx("img", { src: t.src, alt, loading: "lazy", class: "tmedia" });
}

const FIGS = {
  // ---------- 01 a blink comparator on SPHEREx pixels ----------
  blink(fig) {
    const N = 9, C = 30, sigma = 0.42;            // pixels, drawing size, PSF width in pixels
    const svg = sv("svg", { viewBox: `0 0 ${N * C} ${N * C}`, class: "fig-svg fig-square", role: "img",
      "aria-label": FT("blink.aria") }, fig);
    const cells = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++)
      cells.push(sv("rect", { x: x * C, y: y * C, width: C - 1, height: C - 1, class: "f-pix" }, svg));
    const smooth = sv("g", { class: "f-smooth" }, svg);
    const field = [[1.4, 2.0, 0.55], [6.6, 1.3, 0.35], [2.1, 6.7, 0.8], [7.2, 6.2, 0.45], [4.7, 7.7, 0.3]];
    const ticks = sv("g", { class: "f-tick" }, svg);
    // Barnard's Star, Gaia DR3: 10.36"/yr north, 0.80"/yr west (right on a north-up, east-left image)
    const t0 = 2025.6, pyN = 10.362 / 6.15, pxW = 0.802 / 6.15, x0 = 3.6, y0 = 6.4;
    const where = (t) => [x0 + pxW * (t - t0), y0 - pyN * (t - t0)];
    const erf = (z) => { const s = Math.sign(z), a = Math.abs(z), k = 1 / (1 + 0.3275911 * a);
      return s * (1 - (((((1.061405429 * k - 1.453152027) * k) + 1.421413741) * k - 0.284496736) * k + 0.254829592) * k * Math.exp(-a * a)); };
    const frac = (c, u) => 0.5 * (erf((c + 1 - u) / (Math.SQRT2 * sigma)) - erf((c - u) / (Math.SQRT2 * sigma)));
    const controls = hx("div", { class: "fig-controls" }, "", fig);
    const pixBox = hx("label", { class: "check mini" }, `<input type="checkbox" checked> <span>${FT("blink.pix")}</span>`, controls);
    const blinkBtn = hx("button", { type: "button", class: "btn btn-grey fig-btn", "aria-pressed": "false" }, FT("blink.btn"), controls);
    const readout = hx("p", { class: "fig-readout", "aria-live": "polite" }, "", fig);
    let t = t0, timer = null;
    function draw() {
      const stars = field.concat([[...where(t), 1.6]]);
      const img = new Float64Array(N * N);
      for (const [sx, sy, f] of stars) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) img[y * N + x] += f * frac(x, sx) * frac(y, sy);
      const pix = pixBox.querySelector("input").checked;
      cells.forEach((r, i) => r.setAttribute("fill-opacity", pix ? Math.min(1, 0.06 + 1.6 * img[i]).toFixed(3) : 0.06));
      smooth.innerHTML = "";
      if (!pix) for (const [sx, sy, f] of stars) sv("circle", { cx: sx * C, cy: sy * C, r: 4 + 6 * f, class: "f-star" }, smooth);
      const [tx, ty] = where(t);
      ticks.innerHTML = "";
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
        sv("line", { x1: tx * C + dx * 18, y1: ty * C + dy * 18, x2: tx * C + dx * 27, y2: ty * C + dy * 27 }, ticks);
      const dy = (t - t0) * 10.362, px = (t - t0) * pyN;
      readout.textContent = FT("blink.read", { y: fmt(t, 2), d: fmt(dy, 1), p: fmt(px, 2) });
    }
    const s = slider(controls, FT("blink.time"), 2025.6, 2027.1, 0.01, t0, (v, out) => { t = v; out.textContent = fmt(v, 2); draw(); });
    controls.prepend(s.parentElement);
    pixBox.querySelector("input").addEventListener("change", draw);
    blinkBtn.addEventListener("click", () => {
      if (timer) { clearInterval(timer); timer = null; blinkBtn.setAttribute("aria-pressed", "false"); blinkBtn.textContent = FT("blink.btn"); return; }
      let a = false;
      blinkBtn.setAttribute("aria-pressed", "true"); blinkBtn.textContent = FT("stop");
      const flip = () => { a = !a; t = a ? 2025.65 : 2026.65; s.value = t; s.nextElementSibling.textContent = fmt(t, 2); draw(); };
      flip(); timer = setInterval(flip, reduceMotionFig ? 1500 : 650);
      FIG_STOPS.push(() => clearInterval(timer));
    });
    hx("figcaption", {}, FT("blink.cap"), fig);
  },

  // ---------- 02 where does the glow of a body peak ----------
  glow(fig) {
    const W = 520, H = 250, L = 46, R = 506, T = 16, B = 206;
    const lx0 = Math.log10(0.2), lx1 = Math.log10(60);
    const X = (lam) => L + (Math.log10(lam) - lx0) / (lx1 - lx0) * (R - L);
    const svg = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "fig-svg", role: "img",
      "aria-label": FT("glow.aria") }, fig);
    const defs = sv("defs", {}, svg);
    const g = sv("linearGradient", { id: "eyeGrad", x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    [["0", "#7a3cff"], ["0.35", "#2a6bff"], ["0.55", "#2bbf5a"], ["0.75", "#f2c230"], ["1", "#ff3b30"]].forEach(([o, c]) => sv("stop", { offset: o, "stop-color": c }, g));
    sv("rect", { x: X(0.38), y: T, width: X(0.75) - X(0.38), height: B - T, fill: "url(#eyeGrad)", opacity: 0.35 }, svg);
    sv("rect", { x: X(0.75), y: T, width: X(5) - X(0.75), height: B - T, class: "f-band" }, svg);
    sv("text", { x: (X(0.38) + X(0.75)) / 2, y: T + 14, class: "f-lab", "text-anchor": "middle" }, svg).textContent = FT("eyes");
    sv("text", { x: (X(0.75) + X(5)) / 2, y: T + 14, class: "f-lab", "text-anchor": "middle" }, svg).textContent = "SPHEREx";
    sv("line", { x1: L, y1: B, x2: R, y2: B, class: "f-axis" }, svg);
    for (const v of [0.3, 1, 3, 10, 30]) {
      sv("line", { x1: X(v), y1: B, x2: X(v), y2: B + 5, class: "f-axis" }, svg);
      sv("text", { x: X(v), y: B + 19, class: "f-lab", "text-anchor": "middle" }, svg).textContent = fmt(v, v < 1 ? 1 : 0);
    }
    sv("text", { x: (L + R) / 2, y: H - 6, class: "f-lab", "text-anchor": "middle" }, svg).textContent = FT("wl");
    const curve = sv("path", { class: "f-curve" }, svg);
    const peak = sv("line", { class: "f-peak" }, svg);
    const planck = (lam, T) => Math.pow(lam, -5) / (Math.exp(14388 / (lam * T)) - 1);
    const grid = []; for (let i = 0; i <= 400; i++) grid.push(Math.pow(10, lx0 + (lx1 - lx0) * i / 400));
    const wide = []; for (let i = 0; i <= 3000; i++) wide.push(Math.pow(10, -1.5 + 5 * i / 3000));   // 0.03 to 3000 μm
    const readout = hx("p", { class: "fig-readout", "aria-live": "polite" }, "", fig);
    const presets = [[FT("p.sun"), 5772], [FT("p.barnard"), 3200], [FT("p.bd"), 1300], [FT("p.wise"), 250], [FT("p.earth"), 288]];
    const row = hx("div", { class: "fig-chips" }, "", fig);
    let input;
    function draw(T) {
      const ys = grid.map((l) => planck(l, T)), m = Math.max(...ys);
      curve.setAttribute("d", grid.map((l, i) => `${i ? "L" : "M"}${X(l).toFixed(1)},${(B - (B - 36) * ys[i] / m).toFixed(1)}`).join(""));
      const lp = 2898 / T, inPlot = lp >= 0.2 && lp <= 60;
      peak.setAttribute("x1", X(lp)); peak.setAttribute("x2", X(lp)); peak.setAttribute("y1", 36); peak.setAttribute("y2", B);
      peak.style.display = inPlot ? "" : "none";
      let tot = 0, inS = 0;
      for (let i = 1; i < wide.length; i++) {
        const a = wide[i - 1], b = wide[i], f = 0.5 * (planck(a, T) + planck(b, T)) * (b - a);
        tot += f; if (a >= 0.75 && b <= 5) inS += f;
      }
      readout.textContent = FT("glow.read", { t: fmt(T, 0), l: fmt(lp, lp < 10 ? 2 : 1), f: fmt(100 * inS / tot, 100 * inS / tot < 10 ? 1 : 0) });
      row.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.t === T)));
    }
    presets.forEach(([n, T]) => {
      const b = hx("button", { type: "button", class: "chip", "data-t": T }, `${n}<small>${fmt(T, 0)} K</small>`, row);
      b.addEventListener("click", () => { input.value = Math.log10(T); draw(T); input.nextElementSibling.textContent = `${fmt(T, 0)} K`; });
    });
    input = slider(hx("div", { class: "fig-controls" }, "", fig), FT("glow.temp"), Math.log10(150), Math.log10(6500), 0.001, Math.log10(1300),
      (v, out) => { const T = Math.round(Math.pow(10, v)); out.textContent = `${fmt(T, 0)} K`; draw(T); });
    hx("figcaption", {}, FT("glow.cap"), fig);
  },

  // ---------- 03 the rainbow filter ----------
  filter(fig) {
    const BANDS = { D1: [0.75, 1.09], D2: [1.10, 1.62], D3: [1.63, 2.41], D4: [2.42, 3.82], D5: [3.83, 4.41], D6: [4.42, 5.00] };
    let band = "D6", x = 0.35;
    const row = hx("div", { class: "seg seg6 fig-seg", role: "radiogroup", "aria-label": "detector" }, "", fig);
    const svg = sv("svg", { viewBox: "0 0 520 120", class: "fig-svg", role: "img", "aria-label": FT("filter.aria") }, fig);
    const defs = sv("defs", {}, svg);
    const g = sv("linearGradient", { id: "lvfGrad", x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    [["0", "#3d2bff"], ["0.5", "#c03bd8"], ["1", "#ff3b30"]].forEach(([o, c]) => sv("stop", { offset: o, "stop-color": c }, g));
    sv("rect", { x: 20, y: 20, width: 480, height: 56, fill: "url(#lvfGrad)", opacity: 0.55 }, svg);
    for (let i = 1; i < 16; i++) sv("line", { x1: 20 + 30 * i, y1: 20, x2: 20 + 30 * i, y2: 76, class: "f-faint" }, svg);
    const lo = sv("text", { x: 20, y: 98, class: "f-lab" }, svg), hi = sv("text", { x: 500, y: 98, class: "f-lab", "text-anchor": "end" }, svg);
    const star = sv("circle", { cy: 48, r: 9, class: "f-starhot" }, svg);
    const tag = sv("text", { y: 116, class: "f-lab", "text-anchor": "middle" }, svg);
    const readout = hx("p", { class: "fig-readout", "aria-live": "polite" }, "", fig);
    const controls = hx("div", { class: "fig-controls" }, "", fig);
    let input;
    function draw() {
      const [a, b] = BANDS[band], lam = a + (b - a) * x;
      lo.textContent = `${fmt(a, 2)} μm`; hi.textContent = `${fmt(b, 2)} μm`;
      star.setAttribute("cx", 20 + 480 * x); tag.setAttribute("x", Math.min(470, Math.max(50, 20 + 480 * x)));
      tag.textContent = `${fmt(lam, 2)} μm`;
      readout.textContent = FT("filter.read", { b: band, x: fmt(100 * x, 0), l: fmt(lam, 3) });
      row.querySelectorAll("button").forEach((btn) => btn.setAttribute("aria-checked", String(btn.dataset.b === band)));
    }
    Object.keys(BANDS).forEach((k) => {
      const btn = hx("button", { type: "button", role: "radio", "data-b": k }, k, row);
      btn.addEventListener("click", () => { band = k; draw(); });
    });
    input = slider(controls, FT("filter.pos"), 0, 1, 0.001, x, (v, out) => { x = v; out.textContent = ""; draw(); });
    const next = hx("button", { type: "button", class: "btn btn-grey fig-btn" }, FT("filter.next"), controls);
    next.addEventListener("click", () => { x = Math.random(); input.value = x; draw(); });
    hx("figcaption", {}, FT("filter.cap"), fig);
  },

  // ---------- 04 the five steps ----------
  steps(fig) {
    const STEPS = [
      [FT("s1.n"), FT("s1.d"), "M10 30h40M10 20h30M10 40h34"],
      [FT("s2.n"), FT("s2.d"), "M14 14h32v32H14zM22 22h16v16H22z"],
      [FT("s3.n"), FT("s3.d"), "M12 40c8-14 28-14 36 0M30 14v10"],
      [FT("s4.n"), FT("s4.d"), "M14 14v32M30 14v32M46 14v32M14 14h32M14 30h32M14 46h32"],
      [FT("s5.n"), FT("s5.d"), "M18 14v32l26-16z"],
    ];
    const row = hx("div", { class: "fig-steps", role: "tablist", "aria-label": FT("steps.aria") }, "", fig);
    const panel = hx("div", { class: "fig-step-panel", role: "tabpanel", "aria-live": "polite" }, "", fig);
    let cur = 0;
    function draw() {
      row.querySelectorAll("button").forEach((b, i) => { b.setAttribute("aria-selected", String(i === cur)); b.tabIndex = i === cur ? 0 : -1; });
      const [n, d, path] = STEPS[cur];
      panel.innerHTML = "";
      const ic = sv("svg", { viewBox: "0 0 60 60", class: "fig-icon", "aria-hidden": "true" }, panel);
      sv("path", { d: path, class: "f-iconpath" }, ic);
      hx("p", {}, `<b>${String(cur + 1).padStart(2, "0")} ${n}.</b> ${d}`, panel);
    }
    STEPS.forEach(([n], i) => {
      const b = hx("button", { type: "button", role: "tab" }, `<span>${String(i + 1).padStart(2, "0")}</span>${n}`, row);
      b.addEventListener("click", () => { cur = i; draw(); });
      b.addEventListener("keydown", (e) => {
        const j = e.key === "ArrowRight" ? cur + 1 : e.key === "ArrowLeft" ? cur - 1 : null;
        if (j === null || j < 0 || j >= STEPS.length) return;
        e.preventDefault(); e.stopPropagation(); cur = j; draw(); row.children[j].focus();
      });
    });
    draw();
    hx("figcaption", {}, FT("steps.cap"), fig);
  },

  // ---------- 05 the five targets, as picture cards ----------
  targets(fig) {
    const grid = hx("div", { class: "tcards" }, "", fig);
    for (const [key, t] of Object.entries(TARGET_IMG)) {
      const c = hx("article", { class: "tcard" }, "", grid);
      c.appendChild(targetMedia(t, key));
      hx("h4", {}, t.name, c);
      const bar = hx("div", { class: "fig-bar-track", title: `${fmt(t.px, t.px < 0.1 ? 3 : 2)} px per year` }, "", c);
      hx("i", { style: `width:${Math.max(1, 100 * t.px / 1.8).toFixed(1)}%` }, "", bar);
      hx("p", { class: "tcard-val" }, `${fmt(t.px, t.px < 0.1 ? 3 : 2)} ${FT("pxyr")} · ${FT("tag." + key)}`, c);
      hx("p", { class: "tcard-cap" }, `${FT("cap." + key)} <span class="credit"><a href="${t.page}" rel="noopener">${t.credit}</a></span>`, c);
      const go = hx("button", { type: "button", class: "btn fig-btn" }, FT("watch"), c);
      go.addEventListener("click", () => {
        if (typeof choose === "function") choose(key);
        document.getElementById("tool").scrollIntoView({ behavior: reduceMotionFig ? "auto" : "smooth" });
      });
    }
    hx("figcaption", {}, FT("targets.cap"), fig);
  },

  // ---------- 06 how faint would Planet X be ----------
  planetx(fig) {
    const W = 520, H = 120, L = 20, R = 500;
    const m0 = 14, m1 = 26, X = (m) => L + (m - m0) / (m1 - m0) * (R - L);
    const svg = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "fig-svg", role: "img", "aria-label": FT("px.aria") }, fig);
    sv("rect", { x: L, y: 30, width: X(17) - L, height: 40, class: "f-band" }, svg);
    sv("rect", { x: X(19.5), y: 30, width: X(19.9) - X(19.5), height: 40, class: "f-band2" }, svg);
    sv("text", { x: (L + X(17)) / 2, y: 24, class: "f-lab", "text-anchor": "middle" }, svg).textContent = FT("px.one");
    sv("text", { x: X(19.7), y: 24, class: "f-lab", "text-anchor": "middle" }, svg).textContent = FT("px.coadd");
    sv("line", { x1: L, y1: 70, x2: R, y2: 70, class: "f-axis" }, svg);
    for (let m = m0; m <= m1; m += 2) {
      sv("line", { x1: X(m), y1: 70, x2: X(m), y2: 75, class: "f-axis" }, svg);
      sv("text", { x: X(m), y: 89, class: "f-lab", "text-anchor": "middle" }, svg).textContent = m;
    }
    sv("text", { x: L, y: 110, class: "f-lab" }, svg).textContent = FT("px.bright");
    sv("text", { x: R, y: 110, class: "f-lab", "text-anchor": "end" }, svg).textContent = FT("px.faint");
    const dot = sv("circle", { cy: 50, r: 8, class: "f-starhot" }, svg);
    const readout = hx("p", { class: "fig-readout", "aria-live": "polite" }, "", fig);
    const controls = hx("div", { class: "fig-controls fig-controls3" }, "", fig);
    const P = { R: 3, A: 0.3, r: 500 };
    const RE_AU = 6371 / 1.495978707e8;
    function draw() {
      const Rp = P.R * RE_AU, d = P.r - 1;
      const V = -26.74 - 2.5 * Math.log10(P.A * Rp * Rp / (P.r * P.r * d * d));
      dot.setAttribute("cx", X(Math.min(m1, Math.max(m0, V))));
      const k = Math.pow(10, 0.4 * (V - 17)), par = 206265 / P.r / 6.15;
      readout.textContent = V <= 17
        ? FT("px.yes", { v: fmt(V, 1), p: fmt(par, 0) })
        : FT("px.no", { v: fmt(V, 1), k: fmt(k, k < 10 ? 1 : 0), p: fmt(par, 0) });
    }
    slider(controls, FT("px.size"), 1, 6, 0.1, P.R, (v, out) => { P.R = v; out.textContent = fmt(v, 1); draw(); });
    slider(controls, FT("px.refl"), 0.1, 0.7, 0.01, P.A, (v, out) => { P.A = v; out.textContent = fmt(v, 2); draw(); });
    slider(controls, FT("px.dist"), 150, 1000, 5, P.r, (v, out) => { P.r = v; out.textContent = fmt(v, 0); draw(); });
    hx("figcaption", {}, FT("px.cap"), fig);
  },
};

// the panel beside the viewer was drawn before this file loaded
if (typeof targetInfo === "function") targetInfo();
