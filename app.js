// SPHEREx Blink on yourastro.space. Every setting lives in the URL, so one link is one view (as in WiseView).
"use strict";

// position at epoch (deg), proper motion (mas/yr), best detector; same table as the prep notebook
const PRESETS = {
  Barnard:  { label: "Barnard's Star", ra: 269.44850252544, dec: 4.73942005111, epoch: 2016.0, pmra: -801.551, pmdec: 10362.394, band: "D1", size: 360 },
  EpsIndB:  { label: "Epsilon Indi B", ra: 331.07645259656, dec: -56.79381206688, epoch: 2016.0, pmra: 3981.977, pmdec: -2466.832, band: "D5", size: 360 },
  WISE0855: { label: "WISE 0855-0714", ra: 133.7947597, dec: -7.2451456, epoch: 2010.56, pmra: -8123.7, pmdec: 673.2, band: "D6", size: 360 },
  RWAur:    { label: "RW Aurigae", ra: 76.95608119553, dec: 30.40120458910, epoch: 2016.0, pmra: 2.641, pmdec: -27.398, band: "D1", size: 360 },
  RDra:     { label: "R Draconis", ra: 248.16737836729, dec: 66.75500674547, epoch: 2016.0, pmra: -20.643, pmdec: 6.149, band: "D3", size: 360 },
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
    "long.Barnard": "Barnard's Star has the largest proper motion of any star in the sky. It is bright at every SPHEREx wavelength, so it is the cleanest first test. If the tool is right, the star walks north across a field of stars that stand still, and it lands where Gaia says it should be on each date.",
    "long.EpsIndB": "Epsilon Indi B is two brown dwarfs that orbit each other, and the pair orbits the bright star Epsilon Indi A. It is one of the nearest brown dwarf systems. It is faint in visible light and much brighter in the infrared, where SPHEREx looks. At SPHEREx resolution the two are one blob, and they move less than a pixel a year, so this target tests whether the tool can show a small motion of a faint source.",
    "long.WISE0855": "WISE 0855-0714 is the coldest brown dwarf known, close to the freezing point of water, and the fourth nearest system to the Sun. Methane and water absorb its light on both sides of 4.6 microns, so it is invisible in visible light and almost invisible at short infrared wavelengths, but it shines near 4.6 microns. Only the longest SPHEREx detector, D6, can see it. This is why the tool keeps each detector apart, since adding all six together would bury it.",
    "long.RWAur": "RW Aurigae is a very young star still surrounded by gas and dust, with a companion 1.45 arcsec away, and the prototype of its class. Dust in its disk passes in front of the star from time to time and it dims by several magnitudes. It barely moves on the sky, so it tests the other half of the tool, a star that stays in place and changes.",
    "long.RDra": "R Draconis is an old red giant that swells and shrinks with a period of about 246 days, and its visible brightness changes by more than six magnitudes over one cycle. The change is smaller in the infrared but still large. SPHEREx comes back about every six months, which is not a whole number of periods, so each pass catches it at a different phase. Gaia flags it as variable.",
    "look.Barnard": "A bright star that steps north by a little under one pixel every six-month pass, about 2.5 pixels over the whole data set. Its core is saturated, so with the bad pixels blanked it shows as a moving hole.",
    "look.EpsIndB": "A faint source in D5 that shifts by about one pixel over the data set. The difference view shows it as a dark and a bright spot side by side. Epsilon Indi A, 6.7 arcmin away, shares the same motion.",
    "look.WISE0855": "A faint source in D6 that is missing or very weak in D1 to D4, moving about 1.3 pixels a year to the west. It sits close to a field star, so the blink is how to tell them apart. Step through the detectors to watch it appear.",
    "look.RWAur": "A star that stays on the same pixel while its brightness changes between passes. The two stars of the binary are one blob at SPHEREx resolution.",
    "look.RDra": "A bright star that stays still and changes brightness from pass to pass. The wavelength at the star is different in each exposure, so compare sky passes rather than single exposures.",
    "best": "best",
    query: "Asking IRSA which exposures cover this spot",
    dl: "Downloading cutout {a} of {b}",
    slow: "The first view of a new field downloads every cutout, which takes a few minutes. After that it opens at once.",
    noserver: "This field needs the live data server.",
    noserverd: "On this site the five targets open at once. To look anywhere else, run the server from the GitHub repo on your own computer.",
    none: "SPHEREx has not observed this spot on this detector yet.", noned: "Try another detector.",
    fail: "Could not load this field.",
    copied: "link copied", copyfail: "copy failed, the link is in the address bar",
    exp: "exp", median: "median", pass: "pass", of: "of", moved: "moved to this date",
    picking: "now click the sky", picked: "position set in your own position, press show this field",
    blinkit: "blink", thisfield: "this field",
    "fs.enter": "full screen", "fs.exit": "exit full screen",
    "lens.on": "on", "lens.off": "off", "lens.off.sky": "outside the sky, move the lens",
    mapfail: "The sky map could not load. The viewer works without it.",
    "ex.title": "the whole sky", "ex.title.earth": "the Earth, in the same oval",
    "ex.shape.map": "map", "ex.shape.outside": "outside", "ex.shape.inside": "inside",
    "cap.spherex": "SPHEREx at {l}, one of its 102 colours of infrared|SPHEREx DR1, NASA/JPL-Caltech/IPAC via IRSA",
    "cap.2mass": "The near-infrared sky in J, H and K, photographed from 1997 to 2001|2MASS, IRSA mirror of CDS",
    "cap.allwise": "Warm dust and cool stars in the mid-infrared, W1, W2 and W4|AllWISE, IRSA mirror of CDS",
    "cap.dss2": "The visible sky on photographic plates, from the 1950s to the 1990s|DSS2 colour, ESA",
    "cap.earth.day": "The planet SPHEREx circles, by day|Blue Marble Next Generation, NASA via GIBS",
    "cap.earth.night": "The planet SPHEREx circles, at night, lit by its cities|Black Marble, NASA via GIBS",
  },
  id: {
    "why.Barnard": "bintang tercepat di langit, sekitar 10 detik busur per tahun",
    "why.EpsIndB": "pasangan katai cokelat dekat yang bergeser sekitar satu piksel",
    "why.WISE0855": "katai cokelat terdingin yang diketahui, terlalu redup untuk satu bingkai",
    "why.RWAur": "bintang muda yang berubah terang dan tidak bergerak",
    "why.RDra": "bintang variabel Mira, periode 246 hari, V 6,7 sampai 13,2",
    "tag.Barnard": "bergerak cepat", "tag.EpsIndB": "bergerak", "tag.WISE0855": "redup", "tag.RWAur": "berubah", "tag.RDra": "berubah",
    "long.Barnard": "Bintang Barnard punya gerak diri terbesar di antara semua bintang di langit. Ia terang di semua panjang gelombang SPHEREx, jadi ini uji pertama yang paling bersih. Kalau alatnya benar, bintang ini berjalan ke utara melewati bintang-bintang yang diam, dan tiba di tempat yang Gaia perkirakan pada tiap tanggal.",
    "long.EpsIndB": "Epsilon Indi B adalah dua katai cokelat yang saling mengorbit, dan pasangan ini mengorbit bintang terang Epsilon Indi A. Ini salah satu sistem katai cokelat terdekat. Ia redup dalam cahaya kasatmata dan jauh lebih terang dalam inframerah, tempat SPHEREx melihat. Dengan resolusi SPHEREx keduanya tampak sebagai satu gumpalan, dan geraknya kurang dari satu piksel per tahun, jadi target ini menguji apakah alatnya bisa menunjukkan gerak kecil dari sumber yang redup.",
    "long.WISE0855": "WISE 0855-0714 adalah katai cokelat terdingin yang diketahui, mendekati titik beku air, dan sistem terdekat keempat dari Matahari. Metana dan air menyerap cahayanya di kedua sisi 4,6 mikron, jadi ia tak terlihat dalam cahaya kasatmata dan hampir tak terlihat di inframerah pendek, tetapi bersinar dekat 4,6 mikron. Hanya detektor SPHEREx yang paling panjang, D6, yang bisa melihatnya. Karena itu alat ini memisahkan tiap detektor, sebab menjumlahkan keenamnya akan menenggelamkannya.",
    "long.RWAur": "RW Aurigae adalah bintang yang sangat muda dan masih diselimuti gas dan debu, dengan pasangan berjarak 1,45 detik busur, dan menjadi purwarupa kelasnya. Debu di piringannya sesekali lewat di depan bintang dan membuatnya meredup beberapa magnitudo. Ia nyaris tidak bergerak di langit, jadi ia menguji separuh lain dari alat ini, bintang yang diam di tempat dan berubah.",
    "long.RDra": "R Draconis adalah raksasa merah tua yang mengembang dan menyusut dengan periode sekitar 246 hari, dan kecerlangan kasatmatanya berubah lebih dari enam magnitudo dalam satu siklus. Perubahannya lebih kecil di inframerah tetapi tetap besar. SPHEREx kembali kira-kira tiap enam bulan, yang bukan kelipatan periodenya, jadi tiap lintasan menangkapnya di fase yang berbeda. Gaia menandainya sebagai bintang variabel.",
    "look.Barnard": "Bintang terang yang bergeser ke utara sedikit kurang dari satu piksel tiap lintasan enam bulan, sekitar 2,5 piksel di seluruh data. Intinya jenuh, jadi kalau piksel buruk dikosongkan ia tampak sebagai lubang yang bergerak.",
    "look.EpsIndB": "Sumber redup di D5 yang bergeser sekitar satu piksel di seluruh data. Tampilan selisih menunjukkannya sebagai titik gelap dan titik terang berdampingan. Epsilon Indi A, 6,7 menit busur jauhnya, bergerak dengan gerak yang sama.",
    "look.WISE0855": "Sumber redup di D6 yang tidak ada atau sangat lemah di D1 sampai D4, bergerak sekitar 1,3 piksel per tahun ke barat. Ia dekat dengan sebuah bintang latar, jadi kedipan adalah cara membedakan keduanya. Pindah dari detektor ke detektor untuk melihatnya muncul.",
    "look.RWAur": "Bintang yang tetap di piksel yang sama sementara kecerlangannya berubah antarlintasan. Dua bintang pasangan ini tampak sebagai satu gumpalan pada resolusi SPHEREx.",
    "look.RDra": "Bintang terang yang diam dan berubah kecerlangan dari lintasan ke lintasan. Panjang gelombang di bintang ini berbeda di tiap pengamatan, jadi bandingkan lintasan, bukan pengamatan tunggal.",
    "best": "terbaik",
    query: "Menanyakan ke IRSA pengamatan mana yang mencakup titik ini",
    dl: "Mengunduh potongan {a} dari {b}",
    slow: "Tampilan pertama dari medan baru mengunduh semua potongan, jadi butuh beberapa menit. Setelah itu langsung terbuka.",
    noserver: "Medan ini butuh server data langsung.",
    noserverd: "Di situs ini kelima target langsung terbuka. Untuk melihat tempat lain, jalankan server dari repo GitHub di komputermu sendiri.",
    none: "SPHEREx belum mengamati titik ini dengan detektor ini.", noned: "Coba detektor lain.",
    fail: "Medan ini gagal dimuat.",
    copied: "tautan disalin", copyfail: "gagal menyalin, tautannya ada di bilah alamat",
    exp: "eksp", median: "median", pass: "lintasan", of: "dari", moved: "digeser ke tanggal ini",
    picking: "sekarang klik langitnya", picked: "posisi dipilih, tekan tampilkan medan ini",
    blinkit: "kedipkan", thisfield: "medan ini",
    "fs.enter": "layar penuh", "fs.exit": "keluar dari layar penuh",
    "lens.on": "nyala", "lens.off": "mati", "lens.off.sky": "di luar langit, geser lensanya",
    mapfail: "Peta langit gagal dimuat. Penampilnya tetap jalan tanpa peta.",
    "ex.title": "seluruh langit", "ex.title.earth": "Bumi, dalam oval yang sama",
    "ex.shape.map": "peta", "ex.shape.outside": "dari luar", "ex.shape.inside": "dari dalam",
    "cap.spherex": "SPHEREx pada {l}, satu dari 102 warna inframerahnya|SPHEREx DR1, NASA/JPL-Caltech/IPAC melalui IRSA",
    "cap.2mass": "Langit inframerah dekat dalam J, H, dan K, dipotret 1997 sampai 2001|2MASS, cermin IRSA dari CDS",
    "cap.allwise": "Debu hangat dan bintang dingin dalam inframerah tengah, W1, W2, dan W4|AllWISE, cermin IRSA dari CDS",
    "cap.dss2": "Langit kasatmata di pelat fotografi, dari 1950-an sampai 1990-an|DSS2 berwarna, ESA",
    "cap.earth.day": "Planet yang dikelilingi SPHEREx, pada siang hari|Blue Marble Next Generation, NASA melalui GIBS",
    "cap.earth.night": "Planet yang dikelilingi SPHEREx, pada malam hari, diterangi kota-kotanya|Black Marble, NASA melalui GIBS",
  },
  it: {
    "why.Barnard": "la stella più veloce del cielo, circa 10 secondi d’arco l’anno",
    "why.EpsIndB": "una coppia di nane brune vicine che si sposta di circa un pixel",
    "why.WISE0855": "la nana bruna più fredda che si conosca, troppo debole in un solo fotogramma",
    "why.RWAur": "una stella giovane che cambia luminosità e non si muove",
    "why.RDra": "una variabile Mira, periodo 246 giorni, V da 6,7 a 13,2",
    "tag.Barnard": "veloce", "tag.EpsIndB": "si muove", "tag.WISE0855": "debole", "tag.RWAur": "varia", "tag.RDra": "varia",
    "long.Barnard": "La Stella di Barnard ha il moto proprio più grande di tutte le stelle del cielo. È luminosa a ogni lunghezza d’onda di SPHEREx, quindi è la prima prova più pulita. Se lo strumento funziona, la stella cammina verso nord tra stelle che restano ferme, e arriva dove Gaia dice che dovrebbe essere a ogni data.",
    "long.EpsIndB": "Epsilon Indi B sono due nane brune che orbitano l’una attorno all’altra, e la coppia orbita attorno alla stella luminosa Epsilon Indi A. È uno dei sistemi di nane brune più vicini. È debole nella luce visibile e molto più luminosa nell’infrarosso, dove guarda SPHEREx. Alla risoluzione di SPHEREx le due sono una sola macchia e si muovono di meno di un pixel l’anno, quindi questo oggetto mette alla prova lo strumento su un piccolo moto di una sorgente debole.",
    "long.WISE0855": "WISE 0855-0714 è la nana bruna più fredda che si conosca, vicina al punto di congelamento dell’acqua, ed è il quarto sistema più vicino al Sole. Metano e acqua assorbono la sua luce da entrambi i lati di 4,6 micron, quindi è invisibile nella luce visibile e quasi invisibile nell’infrarosso corto, ma brilla vicino a 4,6 micron. Solo il rivelatore SPHEREx più lungo, D6, riesce a vederla. Per questo lo strumento tiene separati i rivelatori, perché sommarli tutti e sei la nasconderebbe.",
    "long.RWAur": "RW Aurigae è una stella giovanissima ancora avvolta da gas e polvere, con una compagna a 1,45 secondi d’arco, ed è il prototipo della sua classe. La polvere del suo disco a volte passa davanti alla stella, che si affievolisce di parecchie magnitudini. Quasi non si muove nel cielo, quindi mette alla prova l’altra metà dello strumento, una stella che resta ferma e cambia.",
    "long.RDra": "R Draconis è una vecchia gigante rossa che si gonfia e si contrae con un periodo di circa 246 giorni, e la sua luminosità visibile cambia di più di sei magnitudini in un ciclo. Nell’infrarosso il cambiamento è minore ma resta grande. SPHEREx torna circa ogni sei mesi, che non è un multiplo del periodo, quindi ogni passaggio la coglie in una fase diversa. Gaia la segnala come variabile.",
    "look.Barnard": "Una stella luminosa che avanza verso nord di poco meno di un pixel a ogni passaggio di sei mesi, circa 2,5 pixel in tutto. Il suo centro è saturo, quindi con i pixel difettosi oscurati appare come un buco che si sposta.",
    "look.EpsIndB": "Una sorgente debole in D5 che si sposta di circa un pixel in tutti i dati. La vista differenza la mostra come un punto scuro e uno chiaro uno accanto all’altro. Epsilon Indi A, a 6,7 primi d’arco, condivide lo stesso moto.",
    "look.WISE0855": "Una sorgente debole in D6 che manca o è molto debole da D1 a D4, e si muove di circa 1,3 pixel l’anno verso ovest. È vicina a una stella di campo, quindi il blink è il modo per distinguerle. Passa da un rivelatore all’altro per vederla comparire.",
    "look.RWAur": "Una stella che resta sullo stesso pixel mentre la sua luminosità cambia da un passaggio all’altro. Le due stelle della binaria sono una sola macchia alla risoluzione di SPHEREx.",
    "look.RDra": "Una stella luminosa che resta ferma e cambia luminosità da un passaggio all’altro. La lunghezza d’onda sulla stella è diversa in ogni esposizione, quindi confronta i passaggi e non le singole esposizioni.",
    "best": "migliore",
    query: "Chiedo a IRSA quali esposizioni coprono questo punto",
    dl: "Scarico il ritaglio {a} di {b}",
    slow: "La prima volta un campo nuovo scarica tutti i ritagli, e ci vuole qualche minuto. Dopo si apre subito.",
    noserver: "Questo campo richiede il server dei dati.",
    noserverd: "Su questo sito i cinque oggetti si aprono subito. Per guardare altrove, avvia il server del repo GitHub sul tuo computer.",
    none: "SPHEREx non ha ancora osservato questo punto con questo rivelatore.", noned: "Prova un altro rivelatore.",
    fail: "Impossibile caricare questo campo.",
    copied: "link copiato", copyfail: "copia non riuscita, il link è nella barra degli indirizzi",
    exp: "esp", median: "mediana", pass: "passaggio", of: "di", moved: "spostate a questa data",
    picking: "ora clicca sul cielo", picked: "posizione scelta, premi mostra questo campo",
    blinkit: "fai il blink di", thisfield: "questo campo",
    "fs.enter": "schermo intero", "fs.exit": "esci dallo schermo intero",
    "lens.on": "acceso", "lens.off": "spento", "lens.off.sky": "fuori dal cielo, sposta la lente",
    mapfail: "La mappa del cielo non si è caricata. Il visore funziona anche senza.",
    "ex.title": "tutto il cielo", "ex.title.earth": "la Terra, nello stesso ovale",
    "ex.shape.map": "mappa", "ex.shape.outside": "da fuori", "ex.shape.inside": "da dentro",
    "cap.spherex": "SPHEREx a {l}, uno dei suoi 102 colori dell’infrarosso|SPHEREx DR1, NASA/JPL-Caltech/IPAC tramite IRSA",
    "cap.2mass": "Il cielo nel vicino infrarosso in J, H e K, fotografato dal 1997 al 2001|2MASS, copia IRSA di CDS",
    "cap.allwise": "Polvere tiepida e stelle fredde nel medio infrarosso, W1, W2 e W4|AllWISE, copia IRSA di CDS",
    "cap.dss2": "Il cielo visibile sulle lastre fotografiche, dagli anni ’50 agli anni ’90|DSS2 a colori, ESA",
    "cap.earth.day": "Il pianeta attorno a cui gira SPHEREx, di giorno|Blue Marble Next Generation, NASA tramite GIBS",
    "cap.earth.night": "Il pianeta attorno a cui gira SPHEREx, di notte, illuminato dalle sue città|Black Marble, NASA tramite GIBS",
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
    "c.keys": "spasi putar atau jeda · panah melangkah · 1 sampai 6 detektor · d selisih · m penanda · g Gaia · f layar penuh",
    "c.own": "posisimu sendiri", "c.epoch": "epoch (tahun)", "c.size": "medan (detik busur)", "c.det": "detektor", "c.tinfo": "target ini", "c.look4": "yang dicari",
    "c.go": "tampilkan medan ini",
    "c.hint": "Masukkan posisi pada epoch, lalu gerak diri memindahkannya ke tanggal tiap pengamatan. Di situs ini kelima target langsung terbuka. Posisi lain bertanya ke arsip langsung, yang butuh server dari repo GitHub berjalan di komputermu.",
    "c.look": "tampilan gambar", "c.speed": "kedip tiap (ms)", "c.contrast": "kontras (%)", "c.stretch": "skala",
    "c.marker": "tandai posisi target", "c.invert": "balik warna", "c.mask": "kosongkan piksel yang ditandai buruk oleh SPHEREx",
    "c.copy": "salin tautan tampilan ini", "c.pick": "pilih posisi",
    "lens.btn": "lensa", "lens.use": "pakai titik ini", "ex.centre": "pusat · ICRS", "ex.copy": "salin", "ex.cross": "garis silang",
    "ex.hint": "klik langitnya, lalu geser untuk bergerak · gulir atau + dan − untuk zoom", "ex.load": "memuat seluruh langit", "ex.map": "peta", "ex.outside": "dari luar", "ex.inside": "dari dalam", "ex.sky": "langit", "ex.earth": "Bumi", "ex.day": "siang", "ex.night": "malam", "ex.lambda": "panjang gelombang", "ex.about": "tentang peta", mapnote: "Kotaknya adalah medan SPHEREx di layar, dan cincinnya mengikuti target dari bingkai ke bingkai. Survei di peta lebih tua, jadi bintang cepat seperti Barnard tampak di selatan cincin, di tempatnya saat 2MASS (1999) dan AllWISE (2010) memotretnya.", "c.cat": "katalog di atas gambar", "c.gaia": "bintang Gaia DR3, digeser dengan gerak dirinya", "c.catwise": "sumber CatWISE2020, untuk yang terlalu dingin bagi Gaia", "c.gmag": "Gaia sampai G", "c.wmag": "CatWISE sampai W2",
    "am.label": "tentang peta", "am.h": "Seluruh langit",
    "a1.t": "tiga bentuk", "a1.d": "Peta meratakan seluruh langit menjadi oval dengan Bima Sakti melintang di tengah, seperti cara para astronom menggambarnya. Dari luar menaruh langit yang sama di bola yang kamu lihat dari luar, berputar pelan. Dari dalam menaruhmu di pusatnya, seperti langit yang terlihat dari tanah.",
    "a2.t": "langit dan Bumi", "a2.d": "Sisi Bumi menampilkan planet yang dikelilingi SPHEREx, siang dan malam, dalam oval yang sama. Setiap gambar langit diambil dari suatu tempat, dan inilah tempatnya.",
    "a3.t": "surveinya", "a3.d": "SPHEREx DR1 adalah rilis seluruh langit pertama misi ini, dalam 102 warna dari 0,75 sampai 5 mikron, dan penggesernya melangkah di antara warna-warna itu. 2MASS, AllWISE, dan DSS2 menampilkan langit yang sama bertahun-tahun atau berpuluh tahun lebih awal, jadi bintang cepat seperti Barnard ada di tempat berbeda di tiap survei.",
    step1: "temukan di seluruh langit", step2: "lihat ia bergerak", "ex.shield": "klik atau ketuk langit untuk menjelajah",
    "cr.t1": "gambar", "cr.d1": "Gambar SPHEREx Level 2 dan kubus seluruh langit DR1, NASA/JPL-Caltech/IPAC, melalui NASA/IPAC IRSA.",
    "cr.t2": "posisi", "cr.d2": "Gaia DR3 (ESA/DPAC) untuk posisi dan gerak, dan untuk WISE 0855 AllWISE dengan gerak dari Kirkpatrick dkk. 2021.",
    "cr.t3": "katalog", "cr.d3": "Gaia DR3 dan CatWISE2020 (Marocco dkk. 2021), keduanya melalui NASA/IPAC IRSA.",
    "cr.t4": "peta langit", "cr.d4": "Aladin Lite (CDS, Strasbourg), dengan 2MASS dan AllWISE melalui IRSA serta DSS2 melalui ESA.",
    "cr.t5": "Bumi", "cr.d5": "Blue Marble dan Black Marble, NASA, melalui NASA GIBS.",
    "cr.t6": "ide", "cr.d6": "Kedipnya mengikuti WiseView karya Caselden dan rekan. Tata letak seluruh langit mengikuti peta langit ultraungu Brice Menard. Lensa, garis silang, dan Home yang tetap berasal dari Time Lens rekan setim kami.",
    "cr.t7": "dibuat oleh", "cr.d7": "Observationally Speaking, di NASA Space Apps Milano, 14 dan 15 November 2026, berangkat dari skrip persiapan kami sendiri tanggal 10 November. Sebagian kode ditulis dengan bantuan Claude (Anthropic).",
    "how.label": "cara kerjanya", "how.h": "Alatnya",
    "p1.t": "teleskopnya", "p1.d": "SPHEREx adalah teleskop survei inframerah seluruh langit milik NASA, diluncurkan pada Maret 2025. Ia memetakan seluruh langit setiap enam bulan dalam 102 warna antara 0,75 dan 5 mikron, sehingga setiap petak langit terlihat berulang kali.",
    "p2.t": "gambarnya", "p2.d": "Untuk tiap petak, alat ini meminta semua pengamatan SPHEREx ke NASA/IPAC IRSA, memotong kotak kecil, menghapus cahaya debu di tata surya kita sendiri, lalu menaruh semua potongan pada satu kisi tetap dengan utara di atas. Bintang jauh diam di tempat. Bintang yang dekat dengan kita berjalan.",
    "p3.t": "pengujiannya", "p3.d": "Kami mengujinya pada objek yang sudah kami kenal. Di 60 pengamatannya, Bintang Barnard rata-rata jatuh kurang dari sepersepuluh piksel dari posisi yang diramalkan Gaia. Kalau alat ini menunjukkan apa yang kami tahu memang ada, kami bisa memercayai apa yang ditunjukkannya di tempat lain.",
    diffnote: "Tampilan selisih mengurangkan median semua gambar dari tiap gambar. Apa pun yang tidak pernah berubah menjadi abu-abu rata. Sesuatu yang bergerak meninggalkan titik terang di tempatnya sekarang dan titik gelap di tempatnya dulu.",
    "tg.label": "lima target", "tg.h": "Para target", "th.t": "target", "th.w": "kenapa ada di sini", "th.d": "detektor",
    planetx: "Tantangannya, Planet X and SPHEREx, juga bertanya apakah SPHEREx bisa menangkap Planet X yang jauh. Bagian dari proyek ini adalah menjawab dengan jujur, dengan angka, seberapa redup yang sudah terlalu redup.",
    "cr.label": "kredit", "cr.h": "Terima kasih",
    "cr.d": "Data dari gambar SPHEREx Level 2, NASA/JPL-Caltech/IPAC, melalui NASA/IPAC IRSA. Posisi dan gerak dari Gaia DR3 (ESA/DPAC), dan untuk WISE 0855 dari AllWISE dengan gerak dari Kirkpatrick dkk. 2021. Lapisan katalognya Gaia DR3 dan CatWISE2020 (Marocco dkk. 2021), keduanya melalui NASA/IPAC IRSA. Peta langitnya Aladin Lite (CDS, Strasbourg) dengan survei warna 2MASS dan AllWISE melalui IRSA serta DSS2 melalui ESA, ide dari prototipe Time Lens rekan setim kami. Peta seluruh langitnya menampilkan kubus seluruh langit SPHEREx DR1 dari NASA/IPAC IRSA, dan Buminya dari Blue Marble dan Black Marble NASA melalui NASA GIBS. Tata letaknya mengikuti peta langit ultraungu Brice Menard. Ide kedipnya mengikuti WiseView karya Caselden dan rekan. Dibuat oleh Observationally Speaking di NASA Space Apps Milano, 14 dan 15 November 2026, berangkat dari skrip persiapan kami sendiri tanggal 10 November. Sebagian kode ditulis dengan bantuan Claude (Anthropic).",
    "b.nasa": "SPHEREx di NASA", "b.irsa": "datanya di IRSA", "b.code": "kodenya di GitHub", "b.home": "kembali ke yourastro.space",
    foot: 'Padova, Italia · 45,4° LU, 11,9° BT · bagian dari <a href="/">yourastro.space</a>',
  },
  it: {
    skip: "Vai al contenuto", "n.home": "home", "n.notes": "appunti",
    eye: "NASA Space Apps Milano 2026 · Observationally Speaking",
    lede: "Scegli una stella e guardala camminare. Questo strumento mostra le immagini pubbliche di SPHEREx di una piccola zona di cielo, un passaggio dopo l’altro, così tutto ciò che è abbastanza vicino da muoversi salta all’occhio sulle stelle dietro.",
    "c.target": "oggetto", "c.show": "cosa mostrare", "c.view": "vista", "c.blink": "blink", "c.diff": "differenza",
    "c.per": "un’immagine per", "c.pass": "passaggio", "c.exp": "esposizione",
    "c.keys": "spazio avvia o ferma · frecce un passo · da 1 a 6 rivelatore · d differenza · m segno · g Gaia · f schermo intero",
    "c.own": "la tua posizione", "c.epoch": "epoca (anno)", "c.size": "campo (arcsec)", "c.det": "rivelatore", "c.tinfo": "questo oggetto", "c.look4": "cosa cercare",
    "c.go": "mostra questo campo",
    "c.hint": "Inserisci la posizione all’epoca, e il moto proprio la sposta alla data di ogni esposizione. Su questo sito i cinque oggetti si aprono subito. Ogni altra posizione interroga l’archivio, e serve il server del repo GitHub acceso sul tuo computer.",
    "c.look": "aspetto", "c.speed": "blink ogni (ms)", "c.contrast": "contrasto (%)", "c.stretch": "scala",
    "c.marker": "segna dove dovrebbe essere l’oggetto", "c.invert": "inverti", "c.mask": "nascondi i pixel che SPHEREx segnala come difettosi",
    "c.copy": "copia il link di questa vista", "c.pick": "scegli una posizione",
    "lens.btn": "lente", "lens.use": "usa questo punto", "ex.centre": "centro · ICRS", "ex.copy": "copia", "ex.cross": "mirino",
    "ex.hint": "clicca il cielo, poi trascina per muoverti · rotella o + e − per lo zoom", "ex.load": "carico tutto il cielo", "ex.map": "mappa", "ex.outside": "da fuori", "ex.inside": "da dentro", "ex.sky": "cielo", "ex.earth": "Terra", "ex.day": "giorno", "ex.night": "notte", "ex.lambda": "lunghezza d’onda", "ex.about": "sulla mappa", mapnote: "Il riquadro è il campo SPHEREx sullo schermo, e l’anello segue l’oggetto fotogramma per fotogramma. Le survey della mappa sono più vecchie, quindi una stella veloce come quella di Barnard appare a sud dell’anello, dove si trovava quando 2MASS (1999) e AllWISE (2010) l’hanno fotografata.", "c.cat": "cataloghi sopra l’immagine", "c.gaia": "stelle Gaia DR3, spostate col loro moto proprio", "c.catwise": "sorgenti CatWISE2020, per ciò che è troppo freddo per Gaia", "c.gmag": "Gaia fino a G", "c.wmag": "CatWISE fino a W2",
    "am.label": "sulla mappa", "am.h": "Tutto il cielo",
    "a1.t": "tre forme", "a1.d": "La mappa appiattisce tutto il cielo in un ovale con la Via Lattea al centro, come la disegnano gli astronomi. Da fuori mette lo stesso cielo su una sfera vista dall’esterno, che gira piano. Da dentro ti mette al centro, come il cielo visto da terra.",
    "a2.t": "cielo e Terra", "a2.d": "Il lato Terra mostra il pianeta attorno a cui gira SPHEREx, di giorno e di notte, nello stesso ovale. Ogni immagine del cielo è presa da qualche parte, ed ecco da dove.",
    "a3.t": "le survey", "a3.d": "SPHEREx DR1 è la prima pubblicazione di tutto il cielo della missione, in 102 colori da 0,75 a 5 micron, e il cursore li percorre. 2MASS, AllWISE e DSS2 mostrano lo stesso cielo anni o decenni prima, così una stella veloce come quella di Barnard si trova in un punto diverso in ognuna.",
    step1: "trovalo in tutto il cielo", step2: "guardalo muoversi", "ex.shield": "clicca o tocca il cielo per esplorarlo",
    "cr.t1": "immagini", "cr.d1": "Immagini SPHEREx Level 2 e il cubo DR1 di tutto il cielo, NASA/JPL-Caltech/IPAC, tramite NASA/IPAC IRSA.",
    "cr.t2": "posizioni", "cr.d2": "Gaia DR3 (ESA/DPAC) per posizioni e moti, e per WISE 0855 AllWISE con il moto di Kirkpatrick et al. 2021.",
    "cr.t3": "cataloghi", "cr.d3": "Gaia DR3 e CatWISE2020 (Marocco et al. 2021), entrambi tramite NASA/IPAC IRSA.",
    "cr.t4": "mappe del cielo", "cr.d4": "Aladin Lite (CDS, Strasburgo), con 2MASS e AllWISE tramite IRSA e DSS2 tramite ESA.",
    "cr.t5": "Terra", "cr.d5": "Blue Marble e Black Marble, NASA, tramite NASA GIBS.",
    "cr.t6": "idee", "cr.d6": "Il blink segue WiseView di Caselden e collaboratori. La disposizione di tutto il cielo segue la mappa del cielo ultravioletto di Brice Menard. La lente, il mirino e la Home fissa vengono dal Time Lens del nostro compagno di squadra.",
    "cr.t7": "fatto da", "cr.d7": "Observationally Speaking, a NASA Space Apps Milano, il 14 e 15 novembre 2026, partendo dai nostri script di preparazione del 10 novembre. Parte del codice è stata scritta con l’aiuto di Claude (Anthropic).",
    "how.label": "come funziona", "how.h": "Lo strumento",
    "p1.t": "il telescopio", "p1.d": "SPHEREx è il telescopio della NASA che osserva tutto il cielo nell’infrarosso, lanciato a marzo 2025. Mappa l’intero cielo ogni sei mesi in 102 colori tra 0,75 e 5 micron, quindi ogni zona del cielo viene vista più e più volte.",
    "p2.t": "le immagini", "p2.d": "Per ogni zona lo strumento chiede a NASA/IPAC IRSA tutte le esposizioni SPHEREx, ritaglia un piccolo quadrato, toglie il bagliore della polvere del nostro sistema solare e mette ogni ritaglio su una griglia fissa con il nord in alto. Le stelle lontane restano ferme. Una stella vicina cammina.",
    "p3.t": "la verifica", "p3.d": "L’abbiamo provato su oggetti che conosciamo già. Nelle sue 60 esposizioni la Stella di Barnard cade in media entro un decimo di pixel da dove Gaia dice che dovrebbe essere. Se lo strumento mostra ciò che sappiamo esserci, possiamo credere a ciò che mostra altrove.",
    diffnote: "La vista differenza sottrae a ogni immagine la mediana di tutte. Ciò che non cambia mai diventa un grigio uniforme. Qualcosa che si è mosso lascia un punto chiaro dove si trova e uno scuro dove era.",
    "tg.label": "i cinque oggetti", "tg.h": "Gli oggetti", "th.t": "oggetto", "th.w": "perché è qui", "th.d": "rivelatore",
    planetx: "La sfida, Planet X and SPHEREx, chiede anche se SPHEREx potrebbe vedere un Pianeta X lontano. Parte del progetto è dire con onestà, con i numeri, quanto debole è troppo debole.",
    "cr.label": "crediti", "cr.h": "Grazie",
    "cr.d": "Dati dalle immagini SPHEREx Level 2, NASA/JPL-Caltech/IPAC, tramite NASA/IPAC IRSA. Posizioni e moti da Gaia DR3 (ESA/DPAC), e per WISE 0855 da AllWISE con il moto di Kirkpatrick et al. 2021. I cataloghi sopra l’immagine sono Gaia DR3 e CatWISE2020 (Marocco et al. 2021), entrambi tramite NASA/IPAC IRSA. La mappa del cielo è Aladin Lite (CDS, Strasburgo) con le survey a colori 2MASS e AllWISE tramite IRSA e DSS2 tramite ESA, un’idea dal prototipo Time Lens del nostro compagno di squadra. La mappa di tutto il cielo mostra il cubo SPHEREx DR1 di NASA/IPAC IRSA, e la Terra viene da Blue Marble e Black Marble della NASA tramite NASA GIBS. La disposizione segue la mappa del cielo ultravioletto di Brice Menard. L’idea del blink segue WiseView di Caselden e collaboratori. Fatto da Observationally Speaking a NASA Space Apps Milano, il 14 e 15 novembre 2026, partendo dai nostri script di preparazione del 10 novembre. Parte del codice è stata scritta con l’aiuto di Claude (Anthropic).",
    "b.nasa": "SPHEREx alla NASA", "b.irsa": "i dati su IRSA", "b.code": "il codice su GitHub", "b.home": "torna a yourastro.space",
    foot: 'Padova, Italia · 45,4° N, 11,9° E · una pagina di <a href="/">yourastro.space</a>',
  },
};

const DEFAULTS = {
  ra: "", dec: "", size: "360", band: "D1", pmra: "0", pmdec: "0", epoch: "2016.0",
  view: "blink", mode: "pass", speed: "500", stretch: "asinh", contrast: "99.5",
  invert: "0", marker: "1", mask: "0", gaia: "1", gmag: "16", catwise: "0", wmag: "16",
  shape: "map", world: "sky", layer: "spherex", frame: "20", earth: "night", cross: "1",
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
  buildTargets(); nowLine(); targetInfo(); exSync(); exTargets();
  if (lastStatus) lastStatus();
  if (data) { buildViews(); draw(); }
}
document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => {
  applyLang(b.dataset.lang);
  try { localStorage.setItem("yas-lang", b.dataset.lang); } catch { /* private window */ }
}));

// ---------- URL <-> settings ----------
// a preset is the position and field, whatever detector is chosen, since every target ships in all six
const POS_KEYS = DATA_KEYS.filter((k) => k !== "band");
const presetFor = () => Object.keys(PRESETS).find((k) => POS_KEYS.every((d) => String(PRESETS[k][d]) === S[d]));

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
    if (t && DATA_KEYS.includes(k)) {
      if (k === "band" && S.band !== PRESETS[t].band) q.set("band", S.band);   // another detector of a target
      continue;
    }
    if (S[k] !== DEFAULTS[k]) q.set(k, S[k]);
  }
  history.replaceState(null, "", (q.toString() ? "?" + q : location.pathname) + location.hash);
}

function syncUI() {
  for (const k of DATA_KEYS) form.elements[k].value = S[k];
  $("speed").value = S.speed; $("contrast").value = S.contrast; $("stretch").value = S.stretch;
  $("marker").checked = S.marker === "1"; $("invert").checked = S.invert === "1"; $("mask").checked = S.mask === "1";
  $("gaia").checked = S.gaia === "1"; $("catwise").checked = S.catwise === "1"; $("gmag").value = S.gmag; $("wmag").value = S.wmag;
  document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.view === S.view)));
  document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.mode === S.mode)));
  const t = presetFor();
  document.querySelectorAll("[data-band]").forEach((b) => {
    b.setAttribute("aria-checked", String(b.dataset.band === S.band));
    b.classList.toggle("best", !!t && b.dataset.band === PRESETS[t].band);
  });
  targetInfo();
  document.querySelectorAll("#targets button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.key === t)));
  const sign = +S.dec >= 0 ? "+" : "";
  $("where").textContent = `ra ${(+S.ra).toFixed(4)} · dec ${sign}${(+S.dec).toFixed(4)} · ${S.band}`;
  nowLine();
}

function nowLine() {
  const t = presetFor();
  const gb = $("goBlink");
  if (gb) gb.textContent = `${T("blinkit")} ${t ? PRESETS[t].label : T("thisfield")} \u2193`;
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
    // every target in all six detectors sits in data/bands/, the best detector also in data/
    if (t && S.size === String(PRESETS[t].size)) {
      const m = S.mask === "1" ? "_mask" : "";
      const files = [`data/bands/${t}_${S.band}${m}.json`];
      if (S.band === PRESETS[t].band) files.push(`data/${t}${m}.json`);
      for (const f of files) {
        try {
          const r = await fetch(f);
          if (r.ok) { j = await r.json(); break; }
        } catch { /* try the next file, then the server */ }
      }
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
    decode(j); data = j; hideLoading(); buildViews(); idx = 0; draw(); if (playing) start();
    viewerReady = true; if (exVisible) loadAladin();
    mapSync();
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

// images arrive as int16 in base64: value = lo + scale * (code + 32767), code -32768 is no data
function decode(j) {
  if (j.encoding !== "int16-b64") return;
  for (const f of j.frames) {
    if (typeof f.image !== "string") continue;
    const bin = atob(f.image), n = bin.length >> 1, out = new Array(n);
    for (let i = 0; i < n; i++) {
      let c = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8);
      if (c > 32767) c -= 65536;
      out[i] = c === -32768 ? null : f.lo + f.scale * (c + 32767);
    }
    f.image = out;
  }
}
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
      image: f.image, target: f.target_xy, year: f.year,
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
        target: [mean(fs.map((f) => f.target_xy[0])), mean(fs.map((f) => f.target_xy[1]))], year: mean(yr),
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
  // catalogue overlay: every source moved to the date of this image with its own proper motion
  const ov = data.overlays || {};
  for (const [kind, on, lim, col] of [["catwise", S.catwise, S.wmag, "#ffb000"], ["gaia", S.gaia, S.gmag, inv ? "#141ef0" : "#7a82ff"]]) {
    if (on !== "1" || !ov[kind]) continue;
    const dt = v.year - ov[kind].epoch, maxMag = parseFloat(lim) || 99, r = Math.max(3, 1.1 * scale);
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, 1.2 * u);
    ctx.beginPath();
    for (const [x0, y0, vx, vy, mag] of ov[kind].sources) {
      if (mag !== null && mag > maxMag) continue;
      const cx = (x0 + vx * dt + 0.5) * scale, cy = (N - 1 - (y0 + vy * dt) + 0.5) * scale;
      if (cx < -r || cy < -r || cx > W + r || cy > W + r) continue;
      ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    }
    ctx.stroke();
  }
  ctx.lineWidth = Math.max(1, 1.6 * u);
  if (S.marker === "1" && v.target) {        // four ticks with a gap, never covering the object
    const cx = (v.target[0] + 0.5) * scale, cy = (N - 1 - v.target[1] + 0.5) * scale;
    const a = Math.max(3 * scale, 10 * u), b = a + Math.max(2 * scale, 8 * u);
    ctx.strokeStyle = inv ? "#111" : "#ffffff";
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
  const leg = [];
  if (S.gaia === "1" && ov.gaia) leg.push(`<span class="key k-gaia"></span>Gaia DR3, G \u2264 ${S.gmag}, ${T("moved")}`);
  if (S.catwise === "1" && ov.catwise) leg.push(`<span class="key k-cw"></span>CatWISE2020, W2 \u2264 ${S.wmag}`);
  $("legend").innerHTML = leg.join(" &nbsp;\u00b7&nbsp; ");
  mapMarker();
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
    tr.innerHTML = `<td><button type="button">${p.label}</button></td><td>${T("long." + key)}</td><td>${p.band}</td>`;
    tr.querySelector("button").addEventListener("click", () => { choose(key); $("tool").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
    tb.appendChild(tr);
  }
}

function choose(key) {
  const p = PRESETS[key];
  for (const k of DATA_KEYS) S[k] = String(p[k]);
  writeURL(); syncUI(); load();
}
function setBand(b) {
  if (b === S.band) return;
  S.band = b; form.elements.band.value = b;
  writeURL(); syncUI(); load();
}

// the panel under the target list: what to look for, and the numbers behind it (data/targets.json)
let FACTS = null;
fetch("data/targets.json").then((r) => (r.ok ? r.json() : null)).then((j) => {
  if (!j) return;
  FACTS = Object.fromEntries(j.targets.map((x) => [x.id, x.numbers]));
  targetInfo();
}).catch(() => { /* the panel just shows the words */ });

function targetInfo() {
  const box = $("tinfo");
  if (!box) return;
  const t = presetFor();
  box.hidden = !t;
  if (!t) return;
  const num = (v, d) => Number(v).toLocaleString(lang, { maximumFractionDigits: d });
  $("tinfoLook").textContent = T("look." + t);
  const f = FACTS && FACTS[t], bits = [];
  if (f) {
    if (f.distance_pc) bits.push(`${num(f.distance_pc, 2)} pc`);
    if (f.pm_total_arcsec_yr != null) bits.push(`${num(f.pm_total_arcsec_yr, 3)}″/yr`);
    if (f.pm_px_yr != null) bits.push(`${num(f.pm_px_yr, 3)} px/yr`);
  }
  bits.push(`${T("best")} ${PRESETS[t].band}`);
  $("tinfoFacts").textContent = bits.join(" · ");
}

function setView(v) { S.view = v; writeURL(); syncUI(); draw(); }
function setMode(m) { S.mode = m; writeURL(); syncUI(); if (data) { buildViews(); idx = 0; draw(); if (playing) start(); } }

document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
document.querySelectorAll("[data-band]").forEach((b) => b.addEventListener("click", () => setBand(b.dataset.band)));
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
for (const k of ["gaia", "catwise"]) $(k).addEventListener("change", (e) => { S[k] = e.target.checked ? "1" : "0"; writeURL(); draw(); });
for (const k of ["gmag", "wmag"]) $(k).addEventListener("change", (e) => { S[k] = e.target.value; writeURL(); draw(); });
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
  else if (e.key === "g") { S.gaia = S.gaia === "1" ? "0" : "1"; writeURL(); syncUI(); draw(); }
  else if (e.key === "m") { S.marker = S.marker === "1" ? "0" : "1"; writeURL(); syncUI(); draw(); }
  else if (/^[1-6]$/.test(e.key)) setBand("D" + e.key);
});
addEventListener("resize", () => { if (data) draw(); });

// ---------- the whole sky: one Aladin Lite map with three shapes, sky or Earth ----------
// The layout follows Brice Menard's ultraviolet sky map; the map beside the viewer was our teammate's Time Lens idea.
const ALADIN_JS = "https://cdn.jsdelivr.net/npm/aladin-lite@3.8.2/dist/aladin.js";
// HiPS surveys by URL. SPHEREx DR1 is a 102-frame cube at IRSA; 2MASS and AllWISE from the IRSA mirror of CDS,
// DSS2 from ESA (the CDS main host was not answering on 14 November 2026).
const SURVEYS = {
  spherex: "https://irsa.ipac.caltech.edu/data/hips/SPHEREx/spherex_allsky_cube",
  "2mass": "https://irsa.ipac.caltech.edu/data/hips/CDS/2MASS/Color",
  allwise: "https://irsa.ipac.caltech.edu/data/hips/CDS/AllWISE/RGB-W4-W2-W1",
  dss2: "https://skies.esac.esa.int/DSSColor",
};
// wavelength of each SPHEREx DR1 frame (um), from the survey's properties; frames 50 and 51 are blank
const LAMBDA = [0.753,0.771,0.790,0.809,0.828,0.848,0.868,0.889,0.910,0.932,0.955,0.978,1.001,1.025,1.050,1.075,1.102,1.113,1.139,1.167,1.195,1.224,1.254,1.284,1.315,1.346,1.378,1.412,1.446,1.481,1.517,1.554,1.592,1.631,1.656,1.695,1.735,1.775,1.818,1.861,1.905,1.949,1.995,2.041,2.089,2.139,2.189,2.240,2.292,2.345,2.399,2.445,2.506,2.575,2.646,2.719,2.794,2.871,2.951,3.033,3.118,3.204,3.293,3.383,3.476,3.570,3.667,3.768,3.833,3.867,3.901,3.935,3.970,4.005,4.040,4.076,4.112,4.148,4.184,4.220,4.257,4.294,4.331,4.368,4.405,4.435,4.467,4.500,4.533,4.566,4.600,4.635,4.669,4.704,4.739,4.773,4.808,4.843,4.879,4.915,4.951,4.988];
const SHAPES = { map: { proj: "MOL", fov: 360 }, outside: { proj: "SIN", fov: 180 }, inside: { proj: "STG", fov: 140 } };
const EX = { shape: "map", world: "sky", layer: "spherex", frame: 20, earth: "night" };
let aladin = null, boxLayer = null, ringLayer = null, pickLayer = null, targetCat = null;
let aladinLoading = false, spinT = 0, spinLon = 0, lastTouch = 0, lensOn = false, lensXY = null;
// Home is fixed for good: the whole sky, centred on the middle of the Milky Way. No preset, URL or saved state moves it.
const HOME = Object.freeze({ l: 0, b: 0 });

// pixel on our north-up TAN grid -> RA, Dec (deg); the inverse gnomonic projection
function gridToSky(x, y) {
  const g = data.grid, d = Math.PI / 180, P = PIX_ARCSEC / 3600 * d;
  const xi = -(x - g.crpix0) * P, eta = (y - g.crpix0) * P;     // east is minus x on the grid
  const rho = Math.hypot(xi, eta), d0 = g.dec * d;
  if (rho === 0) return [g.ra, g.dec];
  const c = Math.atan(rho);
  const ra = g.ra * d + Math.atan2(xi * Math.sin(c), rho * Math.cos(d0) * Math.cos(c) - eta * Math.sin(d0) * Math.sin(c));
  const dec = Math.asin(Math.cos(c) * Math.sin(d0) + eta * Math.sin(c) * Math.cos(d0) / rho);
  return [((ra / d) % 360 + 360) % 360, dec / d];
}
// a preset moved to mid 2026 with its proper motion, for its marker on the whole sky
function presetNow(p) {
  const dt = 2026.5 - p.epoch;
  return [p.ra + p.pmra / 3.6e6 * dt / Math.cos(p.dec * Math.PI / 180), p.dec + p.pmdec / 3.6e6 * dt];
}

function exCaption() {
  const el = $("exNow");
  let k, extra = "";
  if (EX.world === "earth") k = "cap.earth." + EX.earth;
  else { k = "cap." + EX.layer; if (EX.layer === "spherex") extra = `${LAMBDA[EX.frame].toFixed(2)} µm`; }
  const [what, src] = T(k).split("|");
  el.innerHTML = `${what.replace("{l}", extra)} <span class="src">· ${src}</span>`;
  $("exTitle").textContent = EX.world === "earth" ? T("ex.title.earth") : `${T("ex.title")} · ${T("ex.shape." + EX.shape)}`;
  $("lambdaVal").textContent = `${LAMBDA[EX.frame].toFixed(3)} µm`;
}

function exSync() {
  const ex = $("explore");
  ex.dataset.shape = EX.shape; ex.dataset.world = EX.world;
  document.querySelectorAll("#explore [data-shape]").forEach((b) => {
    b.setAttribute("aria-checked", String(b.dataset.shape === EX.shape));
    const off = EX.world === "earth" && b.dataset.shape !== "map";
    b.setAttribute("aria-disabled", String(off)); b.tabIndex = off ? -1 : 0;
  });
  document.querySelectorAll("#world [data-world]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.world === EX.world)));
  document.querySelectorAll("[data-layer]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.layer === EX.layer)));
  document.querySelectorAll("[data-earth]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.earth === EX.earth)));
  $("skyLayers").hidden = EX.world === "earth"; $("earthLayers").hidden = EX.world !== "earth";
  $("lambdaRow").hidden = EX.world === "earth" || EX.layer !== "spherex";
  $("lambda").value = EX.frame;
  const det = Math.floor(EX.frame / 17) + 1;
  document.querySelectorAll("[data-det]").forEach((b) => b.setAttribute("aria-checked", String(+b.dataset.det === det)));
  $("lensState").textContent = lensOn ? T("lens.on") : T("lens.off");
  const img = $("earthImg");
  img.hidden = EX.world !== "earth";
  if (EX.world === "earth") { img.src = `img/earth_${EX.earth}.webp`; img.alt = T("cap.earth." + EX.earth).split("|")[0]; }
  exCaption();
}

function exSave() {        // the explorer's state lives in the URL too
  S.shape = EX.shape; S.world = EX.world; S.layer = EX.layer; S.frame = String(EX.frame); S.earth = EX.earth;
  writeURL();
}

function setShape(sh) {
  if (EX.world === "earth" && sh !== "map") return;
  EX.shape = sh; exSave(); exSync();
  if (!aladin) return;
  aladin.setProjection(SHAPES[sh].proj);
  aladin.setFoV(SHAPES[sh].fov);
  if (sh !== "map") aladin.gotoPosition(spinLon, 0);
  else aladin.gotoPosition(0, 0);
  spin();
}
function setWorld(w) {
  EX.world = w;
  if (w === "earth" && EX.shape !== "map") { EX.shape = "map"; if (aladin) { aladin.setProjection("MOL"); aladin.setFoV(360); } }
  exSave(); exSync(); spin();
}
function setLayer(l) {
  EX.layer = l; exSave(); exSync();
  if (!aladin) return;
  aladin.setImageSurvey(SURVEYS[l]);
  if (l === "spherex") applySlice();
}
function setFrame(i) {
  EX.frame = Math.max(0, Math.min(101, i | 0));
  if (EX.frame === 50 || EX.frame === 51) EX.frame = 52;      // the two dichroic frames are blank
  exSave(); exSync();
  applySlice();
}
// the cube layer only takes a slice once Aladin has added it, so keep trying for a few seconds
let sliceTry = 0;
function applySlice(n = 0) {
  clearTimeout(sliceTry);
  if (!aladin || EX.layer !== "spherex") return;
  const layer = aladin.getBaseImageLayer();
  if (layer && layer.added && layer.setSliceNumber) { layer.setSliceNumber(EX.frame); return; }
  if (n < 40) sliceTry = setTimeout(() => applySlice(n + 1), 250);
}

// the turning sphere: a slow spin in "outside", paused while someone drags or zooms
function spin() {
  cancelAnimationFrame(spinT);
  if (!aladin || EX.shape !== "outside" || EX.world !== "sky" || reduceMotion) return;
  let last = performance.now();
  const step = (t) => {
    if (t - lastTouch > 4000) { spinLon = (spinLon + (t - last) * 0.004) % 360; aladin.gotoPosition(spinLon, 0); }
    last = t; spinT = requestAnimationFrame(step);
  };
  spinT = requestAnimationFrame(step);
}

function exTargets() {
  if (!aladin) return;
  if (targetCat) targetCat.removeAll(); else {
    targetCat = A.catalog({ name: "targets", shape: "circle", sourceSize: 16, color: "#7a82ff", displayLabel: $("sky3").clientWidth > 560, labelColumn: "name", labelColor: "#f2f2f2", labelFont: "12px JetBrains Mono, monospace" });
    aladin.addCatalog(targetCat);
  }
  const cur = presetFor();
  targetCat.addSources(Object.entries(PRESETS).map(([key, p]) => {
    const [ra, dec] = presetNow(p);
    return A.source(ra, dec, { name: (key === cur ? "▸ " : "") + p.label, key });
  }));
}

function loadAladin() {
  if (aladin || aladinLoading) return;
  aladinLoading = true;
  (async () => {
    try {
      window.A = (await import(ALADIN_JS)).default;   // the npm build is an ES module
      await A.init;
      aladin = A.aladin("#sky3", {
        survey: SURVEYS[EX.layer] || SURVEYS.spherex, projection: SHAPES[EX.shape].proj, fov: SHAPES[EX.shape].fov,
        cooFrame: "galactic", target: "0 0",
        showReticle: false, showLayersControl: false, showGotoControl: false, showFullscreenControl: false,
        showFrame: false, showCooLocation: false, showProjectionControl: false, showSettingsControl: false,
        showShareControl: false, showStatusBar: false, showContextMenu: false, showCooGrid: false, showZoomControl: false,
      });
      boxLayer = A.graphicOverlay({ color: "#7a82ff", lineWidth: 2 });
      ringLayer = A.graphicOverlay({ color: "#ffffff", lineWidth: 2 });
      pickLayer = A.graphicOverlay({ color: "#ffb000", lineWidth: 2 });
      aladin.addOverlay(boxLayer); aladin.addOverlay(ringLayer); aladin.addOverlay(pickLayer);
      applySlice();
      exTargets();
      aladin.on("objectClicked", (o) => {
        const key = o && o.data && o.data.key;
        if (!key) return;
        choose(key);
        $("tool").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
      aladin.on("click", () => { lastTouch = performance.now(); });
      aladin.on("positionChanged", centreOut);
      aladin.on("zoomChanged", () => { centreOut(); lensRead(); });
      for (const ev of ["pointerdown", "wheel", "touchstart"]) $("sky3").addEventListener(ev, () => { lastTouch = performance.now(); }, { passive: true });
      $("exLoad").hidden = true;
      if (EX.shape !== "map") { aladin.gotoPosition(spinLon, 0); spin(); }
      mapSync(); centreOut();
    } catch (e) {
      console.warn("sky map:", e);
      $("exLoad").textContent = T("mapfail");
    }
  })();
}

// the SPHEREx field on screen: its exact footprint, and a ring that follows the target frame by frame
function mapSync() {
  if (!aladin || !data || !data.grid) return;
  const g = data.grid, half = g.npix / 2, c = g.crpix0;
  boxLayer.removeAll();
  boxLayer.add(A.polygon([[c - half, c - half], [c + half, c - half], [c + half, c + half], [c - half, c + half]].map(([x, y]) => gridToSky(x, y))));
  exTargets();
  mapMarker();
}
function mapMarker() {
  if (!aladin || !ringLayer || !data || !data.grid || !views[idx] || !views[idx].target) return;
  ringLayer.removeAll();
  const [ra, dec] = gridToSky(views[idx].target[0], views[idx].target[1]);
  ringLayer.add(A.circle(ra, dec, 3 * PIX_ARCSEC / 3600));
}

// ---------- centre readout and crosshair ----------
function centreOut() {
  if (!aladin) return;
  const [ra, dec] = aladin.getRaDec();
  $("centreOut").textContent = `RA ${ra.toFixed(4)}° · Dec ${dec >= 0 ? "+" : ""}${dec.toFixed(4)}°`;
  lensRead();
}
$("copyCentre").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("centreOut").textContent); toast(T("copied")); } catch { toast(T("copyfail")); }
});
$("crossChk").addEventListener("change", (e) => { S.cross = e.target.checked ? "1" : "0"; writeURL(); $("explore").classList.toggle("no-cross", !e.target.checked); });

// ---------- the lens: on or off, dragged over the map, its centre handed to the viewer ----------
function lensClamp(x, y) {
  const st = $("lens").parentElement.getBoundingClientRect(), L = $("lens");
  return [Math.max(0, Math.min(st.width - L.offsetWidth, x)), Math.max(0, Math.min(st.height - L.offsetHeight, y))];
}
function lensPlace(x, y) {
  [x, y] = lensClamp(x, y); lensXY = [x, y];
  $("lens").style.transform = `translate(${x}px, ${y}px)`;
  lensRead();
}
function lensRead() {
  if (!lensOn || !aladin || !lensXY) return;
  const L = $("lens"), cx = lensXY[0] + L.offsetWidth / 2, cy = lensXY[1] + 11 + (L.offsetHeight - 22) / 2;
  let p = null;
  try { p = aladin.pix2world(cx, cy, "icrs"); } catch { p = null; }
  if (!p || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) { $("lensXY").textContent = T("lens.off.sky"); L.dataset.ok = "0"; return; }
  L.dataset.ok = "1"; L.dataset.ra = p[0]; L.dataset.dec = p[1];
  $("lensXY").textContent = `${p[0].toFixed(3)} ${p[1] >= 0 ? "+" : ""}${p[1].toFixed(3)}`;
}
function setLens(on) {
  lensOn = on;
  if (on && EX.world === "earth") setWorld("sky");
  $("lens").hidden = !on;
  $("lensBtn").setAttribute("aria-pressed", String(on));
  $("lensState").textContent = on ? T("lens.on") : T("lens.off");
  if (on) {
    loadAladin();
    const st = $("lens").parentElement.getBoundingClientRect(), L = $("lens");
    if (!lensXY) lensPlace(st.width / 2 - L.offsetWidth / 2, st.height / 2 - L.offsetHeight / 2);
    else lensPlace(...lensXY);
  }
}
$("lensBtn").addEventListener("click", () => setLens(!lensOn));
$("lensClose").addEventListener("click", () => setLens(false));
(() => {
  const bar = $("lensBar");
  let drag = null;
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    drag = { x: e.clientX, y: e.clientY, at: lensXY || [0, 0] };
    bar.setPointerCapture(e.pointerId); e.preventDefault();
  });
  bar.addEventListener("pointermove", (e) => { if (drag) lensPlace(drag.at[0] + e.clientX - drag.x, drag.at[1] + e.clientY - drag.y); });
  const end = () => { drag = null; };
  bar.addEventListener("pointerup", end); bar.addEventListener("pointercancel", end);
  bar.addEventListener("keydown", (e) => {
    const d = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[e.key];
    if (!d || !lensXY) return;
    e.preventDefault(); e.stopPropagation(); lensPlace(lensXY[0] + d[0], lensXY[1] + d[1]);
  });
  if ("ResizeObserver" in window) new ResizeObserver(() => { if (lensOn && lensXY) lensPlace(...lensXY); }).observe(bar.closest(".ex-stage"));
})();
$("lensUse").addEventListener("click", () => {
  const L = $("lens");
  if (L.dataset.ok !== "1") { toast(T("lens.off.sky")); return; }
  form.elements.ra.value = (+L.dataset.ra).toFixed(6); form.elements.dec.value = (+L.dataset.dec).toFixed(6);
  form.elements.pmra.value = "0"; form.elements.pmdec.value = "0"; form.elements.epoch.value = "2016.0";
  $("ownPanel").open = true;
  toast(T("picked"));
});

// ---------- D1 to D6: each button jumps the SPHEREx cube to the middle of that detector ----------
document.querySelectorAll("[data-det]").forEach((b) => b.addEventListener("click", () => {
  if (EX.layer !== "spherex") setLayer("spherex");
  setFrame(17 * (+b.dataset.det - 1) + 8);
}));
document.querySelectorAll("#explore [data-shape]").forEach((b) => b.addEventListener("click", () => setShape(b.dataset.shape)));
document.querySelectorAll("#world [data-world]").forEach((b) => b.addEventListener("click", () => setWorld(b.dataset.world)));
$("wTrack").addEventListener("click", () => setWorld(EX.world === "sky" ? "earth" : "sky"));
document.querySelectorAll("[data-layer]").forEach((b) => b.addEventListener("click", () => setLayer(b.dataset.layer)));
document.querySelectorAll("[data-earth]").forEach((b) => b.addEventListener("click", () => { EX.earth = b.dataset.earth; exSave(); exSync(); }));
$("lambda").addEventListener("input", (e) => setFrame(+e.target.value));
$("zIn").addEventListener("click", () => { lastTouch = performance.now(); if (aladin) aladin.setFoV(aladin.getFoV()[0] / 1.6); });
$("zOut").addEventListener("click", () => { lastTouch = performance.now(); if (aladin) aladin.setFoV(Math.min(SHAPES[EX.shape].fov, aladin.getFoV()[0] * 1.6)); });
$("zAll").addEventListener("click", () => {
  if (!aladin) return;
  lastTouch = performance.now();
  aladin.setFoV(SHAPES[EX.shape].fov);
  aladin.gotoPosition(EX.shape === "outside" ? spinLon : HOME.l, HOME.b);
});
// the blink viewer is the core of the page, so the 2.4 MB map waits until the viewer has its data
let viewerReady = false, exVisible = false;
setTimeout(() => { viewerReady = true; if (exVisible) loadAladin(); }, 4000);
if ("IntersectionObserver" in window) {
  new IntersectionObserver((es) => {
    exVisible = es.some((e) => e.isIntersecting);
    if (exVisible && viewerReady) loadAladin();
    if (!exVisible) shieldOn();
  }, { rootMargin: "200px" }).observe($("explore"));
} else { exVisible = true; }

// the shield: the map takes the wheel and the finger only after a click, so the page never gets stuck
let shieldT = 0;
function shieldOn() { $("exShield").hidden = false; }
$("exShield").addEventListener("pointerdown", () => { $("exShield").hidden = true; loadAladin(); lastTouch = performance.now(); });
$("exShield").addEventListener("wheel", () => {
  const sh = $("exShield"); sh.classList.add("hint"); clearTimeout(shieldT); shieldT = setTimeout(() => sh.classList.remove("hint"), 1400);
}, { passive: true });
$("exShield").addEventListener("touchmove", () => { $("exShield").classList.add("hint"); }, { passive: true });
document.querySelector("#explore .ex-stage").addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") shieldOn(); });

// ---------- full screen, for the map and for the viewer ----------
// the Fullscreen API where it exists; elsewhere (iPhone Safari) a fixed overlay that fills the window
let fullEl = null;
function setFull(el, on) {
  if (on) {
    if (fullEl && fullEl !== el) setFull(fullEl, false);
    fullEl = el; el.classList.add("is-full"); document.body.classList.add("has-full");
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    if (el.id === "explore") { $("exShield").hidden = true; loadAladin(); }
  } else {
    el.classList.remove("is-full"); document.body.classList.remove("has-full"); fullEl = null;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    if (el.id === "explore") shieldOn();
  }
  el.querySelectorAll(".fs-btn").forEach((b) => { b.setAttribute("aria-label", on ? T("fs.exit") : T("fs.enter")); b.title = b.getAttribute("aria-label"); });
  // Aladin sizes its canvas from its box, so tell it the box changed, now and once the browser settles
  const relayout = () => {
    if (data) draw();
    if (aladin && aladin.view && aladin.view.fixLayoutDimensions) { aladin.view.fixLayoutDimensions(); if (aladin.view.requestRedraw) aladin.view.requestRedraw(); }
    if (lensOn && lensXY) lensPlace(...lensXY);
  };
  setTimeout(relayout, 120); setTimeout(relayout, 450);
}
document.querySelectorAll("[data-fs]").forEach((b) => b.addEventListener("click", () => {
  const el = $(b.dataset.fs); setFull(el, !el.classList.contains("is-full"));
}));
document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && fullEl) setFull(fullEl, false); });
addEventListener("resize", () => { if (aladin && aladin.view && aladin.view.fixLayoutDimensions) aladin.view.fixLayoutDimensions(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && fullEl && !document.fullscreenElement) setFull(fullEl, false); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "f" || e.metaKey || e.ctrlKey || e.altKey || e.target.closest("input, select, textarea")) return;
  const el = fullEl || $("viewer"); setFull(el, !el.classList.contains("is-full"));
});

// ---------- start ----------
readURL();
let startLang = "en";
try {
  const saved = localStorage.getItem("yas-lang");
  const nav = (navigator.language || "").toLowerCase().slice(0, 2);
  startLang = ["en", "id", "it"].includes(saved) ? saved : (nav === "id" || nav === "it" ? nav : "en");
} catch { /* private window */ }
EX.shape = SHAPES[S.shape] ? S.shape : "map"; EX.world = S.world === "earth" ? "earth" : "sky";
EX.layer = SURVEYS[S.layer] ? S.layer : "spherex"; EX.frame = Math.max(0, Math.min(101, parseInt(S.frame, 10) || 20));
EX.earth = S.earth === "day" ? "day" : "night";
if (EX.world === "earth") EX.shape = "map";
$("crossChk").checked = S.cross !== "0"; $("explore").classList.toggle("no-cross", S.cross === "0");
applyLang(startLang);
if (!presetFor()) $("ownPanel").open = true;     // a shared custom link opens with its position showing
writeURL(); syncUI(); setPlaying(playing); load();
