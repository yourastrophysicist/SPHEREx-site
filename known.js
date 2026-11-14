// Known objects on the whole-sky map: 29 bright stars, clusters, nebulae and galaxies, plus the Sun and the ecliptic.
// The list and the first English text are our teammate's (review sheet, 14 November 2026); the text was fact-checked
// and corrected the same day. Positions are SIMBAD J2000 (ICRS), checked against SIMBAD on 14 November 2026.
// Tier 1 is always on the map; tier 2 appears once the map is zoomed in below 70 degrees.
"use strict";

const KNOWN_TIER2_FOV = 70;

const KNOWN_TYPES = {
  star:    { en: "star", id: "bintang", it: "stella" },
  system:  { en: "star system", id: "sistem bintang", it: "sistema stellare" },
  nebula:  { en: "nebula", id: "nebula", it: "nebulosa" },
  cluster: { en: "star cluster", id: "gugus bintang", it: "ammasso stellare" },
  galaxy:  { en: "galaxy", id: "galaksi", it: "galassia" },
  core:    { en: "Milky Way core", id: "inti Bima Sakti", it: "nucleo della Via Lattea" },
  snr:     { en: "supernova remnant", id: "sisa supernova", it: "resto di supernova" },
  sun:     { en: "our star", id: "bintang kita", it: "la nostra stella" },
};

const KNOWN_WORDS = {
  en: { note: "A known object, not a new discovery. Distances and sizes are approximate.", zoom: "zoom in here", close: "Close", label: "known objects", sunNote: "Its place today comes from a textbook formula, good to about 0.01 degrees." },
  id: { note: "Objek yang sudah dikenal, bukan penemuan baru. Jarak dan ukuran dibulatkan.", zoom: "perbesar di sini", close: "Tutup", label: "objek terkenal", sunNote: "Posisinya hari ini dihitung dengan rumus buku teks, tepat sampai sekitar 0,01 derajat." },
  it: { note: "Un oggetto noto, non una nuova scoperta. Distanze e dimensioni sono approssimate.", zoom: "ingrandisci qui", close: "Chiudi", label: "oggetti noti", sunNote: "La sua posizione di oggi viene da una formula da manuale, precisa a circa 0,01 gradi." },
};

// n: name (a string, or {en,id,it} where the name changes), t: type, k: tier, fov: zoom (deg) for "zoom in here"
const KNOWN = [
  { key: "sirius", n: "Sirius", t: "star", k: 1, ra: 101.287, dec: -16.716, fov: 8,
    en: "The brightest star in the night sky, in the constellation Canis Major (the Great Dog). It is a close neighbor, only about 8.6 light-years away, and shines about 25 times brighter than the Sun.",
    id: "Bintang paling terang di langit malam, di rasi Canis Major (Anjing Besar). Ia tetangga dekat, hanya sekitar 8,6 tahun cahaya dari kita, dan bersinar sekitar 25 kali lebih terang dari Matahari.",
    it: "La stella più luminosa del cielo notturno, nella costellazione del Cane Maggiore. È una nostra vicina, a circa 8,6 anni luce, e brilla circa 25 volte più del Sole." },
  { key: "canopus", n: "Canopus", t: "star", k: 1, ra: 95.988, dec: -52.696, fov: 8,
    en: "The second-brightest star in the night sky, in the constellation Carina and best seen from the southern hemisphere. It is a huge, very luminous star roughly 300 light-years away.",
    id: "Bintang paling terang kedua di langit malam, di rasi Carina, paling mudah dilihat dari belahan bumi selatan. Ia bintang raksasa yang sangat terang, kira-kira 300 tahun cahaya jauhnya.",
    it: "La seconda stella più luminosa del cielo notturno, nella costellazione della Carena, visibile soprattutto dall’emisfero australe. È una stella enorme e molto luminosa, a circa 300 anni luce." },
  { key: "arcturus", n: "Arcturus", t: "star", k: 1, ra: 213.915, dec: 19.182, fov: 8,
    en: "The brightest star in the northern half of the sky, in the constellation Boötes. It is an aging orange giant about 37 light-years away and much larger than the Sun.",
    id: "Bintang paling terang di belahan langit utara, di rasi Boötes. Ia raksasa jingga yang menua, sekitar 37 tahun cahaya jauhnya, dan jauh lebih besar dari Matahari.",
    it: "La stella più luminosa della metà settentrionale del cielo, nella costellazione del Boote. È una gigante arancione ormai anziana, a circa 37 anni luce, molto più grande del Sole." },
  { key: "vega", n: "Vega", t: "star", k: 1, ra: 279.235, dec: 38.784, fov: 8,
    en: "A bright blue-white star in the constellation Lyra, about 25 light-years away. Astronomers long used it as the standard for measuring how bright other stars are.",
    id: "Bintang putih kebiruan yang terang di rasi Lyra, sekitar 25 tahun cahaya jauhnya. Lama sekali para astronom memakainya sebagai patokan untuk mengukur terang bintang lain.",
    it: "Una stella brillante bianco-azzurra nella costellazione della Lira, a circa 25 anni luce. Per molto tempo gli astronomi l’hanno usata come riferimento per misurare la luminosità delle altre stelle." },
  { key: "capella", n: "Capella", t: "star", k: 1, ra: 79.172, dec: 45.998, fov: 8,
    en: "A bright golden star in the constellation Auriga, about 43 light-years away. To the eye it looks like one star, but it is really a family of four stars, in two pairs.",
    id: "Bintang keemasan yang terang di rasi Auriga, sekitar 43 tahun cahaya jauhnya. Di mata ia tampak satu bintang, padahal sebenarnya keluarga empat bintang, dalam dua pasang.",
    it: "Una stella dorata e brillante nella costellazione dell’Auriga, a circa 43 anni luce. A occhio sembra una stella sola, ma in realtà è una famiglia di quattro stelle, in due coppie." },
  { key: "rigel", n: "Rigel", t: "star", k: 1, ra: 78.634, dec: -8.202, fov: 8,
    en: "A blue-white supergiant in the constellation Orion, marking his foot. It lies roughly 860 light-years away and shines more than 100,000 times brighter than the Sun.",
    id: "Maharaksasa putih kebiruan di rasi Orion, menandai kakinya. Jaraknya kira-kira 860 tahun cahaya, dan ia bersinar lebih dari 100.000 kali lebih terang dari Matahari.",
    it: "Una supergigante bianco-azzurra nella costellazione di Orione, di cui segna il piede. Si trova a circa 860 anni luce e brilla più di 100.000 volte del Sole." },
  { key: "betelgeuse", n: "Betelgeuse", t: "star", k: 1, ra: 88.793, dec: 7.407, fov: 8,
    en: "A red supergiant in the constellation Orion, marking his shoulder. Placed where the Sun is, it would reach well past the orbit of Mars. Its brightness changes over time, and it lies roughly 550 to 650 light-years away.",
    id: "Maharaksasa merah di rasi Orion, menandai bahunya. Jika diletakkan di tempat Matahari, ia akan menjangkau jauh melewati orbit Mars. Terangnya berubah-ubah, dan jaraknya kira-kira 550 sampai 650 tahun cahaya.",
    it: "Una supergigante rossa nella costellazione di Orione, di cui segna la spalla. Messa al posto del Sole, arriverebbe ben oltre l’orbita di Marte. La sua luminosità cambia nel tempo e si trova tra circa 550 e 650 anni luce." },
  { key: "polaris", n: { en: "Polaris", id: "Polaris", it: "Stella Polare" }, t: "star", k: 1, ra: 37.955, dec: 89.264, fov: 8,
    en: "The North Star. It sits almost exactly above Earth’s north pole, so it hardly moves while the rest of the sky turns around it. It is about 430 light-years away and is not especially bright.",
    id: "Bintang Utara. Letaknya hampir tepat di atas kutub utara Bumi, jadi ia nyaris tidak bergerak sementara bagian langit lainnya berputar mengelilinginya. Jaraknya sekitar 430 tahun cahaya, dan terangnya biasa saja.",
    it: "La Stella Polare. Si trova quasi esattamente sopra il polo nord della Terra, quindi resta quasi ferma mentre il resto del cielo le gira intorno. È a circa 430 anni luce e non è particolarmente brillante." },
  { key: "m42", n: { en: "Orion Nebula", id: "Nebula Orion", it: "Nebulosa di Orione" }, t: "nebula", k: 1, ra: 83.820, dec: -5.388, fov: 3,
    en: "A glowing cloud of gas and dust in Orion’s sword, about 1,300 light-years away. New stars are being born inside it. It is bright enough to be seen without a telescope as a fuzzy patch.",
    id: "Awan gas dan debu yang berpendar di pedang Orion, sekitar 1.300 tahun cahaya jauhnya. Bintang-bintang baru sedang lahir di dalamnya. Ia cukup terang untuk terlihat tanpa teleskop sebagai bercak kabur.",
    it: "Una nube luminosa di gas e polvere nella spada di Orione, a circa 1.300 anni luce. Al suo interno stanno nascendo nuove stelle. È abbastanza brillante da vedersi senza telescopio come una macchia sfocata." },
  { key: "m45", n: { en: "Pleiades", id: "Pleiades", it: "Pleiadi" }, t: "cluster", k: 1, ra: 56.601, dec: 24.114, fov: 4,
    en: "Also called the Seven Sisters, a young cluster of stars in Taurus about 440 light-years away. Six or seven of its stars are easy to see by eye, but the cluster holds more than a thousand.",
    id: "Disebut juga Tujuh Bersaudari, gugus bintang muda di Taurus, sekitar 440 tahun cahaya jauhnya. Enam atau tujuh bintangnya mudah dilihat dengan mata, tetapi gugus ini berisi lebih dari seribu bintang.",
    it: "Dette anche le Sette Sorelle, sono un giovane ammasso di stelle nel Toro, a circa 440 anni luce. Sei o sette stelle si vedono facilmente a occhio nudo, ma l’ammasso ne contiene più di mille." },
  { key: "m31", n: { en: "Andromeda Galaxy", id: "Galaksi Andromeda", it: "Galassia di Andromeda" }, t: "galaxy", k: 1, ra: 10.685, dec: 41.269, fov: 6,
    en: "The nearest large galaxy to our own Milky Way, about 2.5 million light-years away. From a dark place it can be seen by eye as a faint, elongated glow. It may collide and merge with the Milky Way in several billion years, though recent studies put the chance at only about even.",
    id: "Galaksi besar terdekat dari Bima Sakti kita, sekitar 2,5 juta tahun cahaya jauhnya. Dari tempat yang gelap ia terlihat dengan mata sebagai cahaya redup yang lonjong. Beberapa miliar tahun lagi ia mungkin bertabrakan dan menyatu dengan Bima Sakti, meski penelitian terbaru menyebut peluangnya hanya sekitar separuh.",
    it: "La grande galassia più vicina alla nostra Via Lattea, a circa 2,5 milioni di anni luce. Da un luogo buio si vede a occhio nudo come un debole bagliore allungato. Tra alcuni miliardi di anni potrebbe scontrarsi e fondersi con la Via Lattea, anche se studi recenti danno a questo esito circa una probabilità su due." },
  { key: "lmc", n: { en: "Large Magellanic Cloud", id: "Awan Magellan Besar", it: "Grande Nube di Magellano" }, t: "galaxy", k: 1, ra: 80.894, dec: -69.756, fov: 20,
    en: "A small companion galaxy of the Milky Way, about 160,000 light-years away. From the southern hemisphere it looks like a detached patch of the Milky Way. It contains the huge Tarantula Nebula.",
    id: "Galaksi pendamping kecil Bima Sakti, sekitar 160.000 tahun cahaya jauhnya. Dari belahan bumi selatan ia tampak seperti potongan Bima Sakti yang terlepas. Di dalamnya ada Nebula Tarantula yang sangat besar.",
    it: "Una piccola galassia compagna della Via Lattea, a circa 160.000 anni luce. Dall’emisfero australe sembra un pezzo staccato della Via Lattea. Contiene l’enorme Nebulosa Tarantola." },
  { key: "smc", n: { en: "Small Magellanic Cloud", id: "Awan Magellan Kecil", it: "Piccola Nube di Magellano" }, t: "galaxy", k: 1, ra: 13.158, dec: -72.800, fov: 10,
    en: "Another companion galaxy of the Milky Way, about 200,000 light-years away and smaller than the Large Magellanic Cloud. From the southern hemisphere it looks like a separate faint cloud.",
    id: "Galaksi pendamping Bima Sakti yang lain, sekitar 200.000 tahun cahaya jauhnya dan lebih kecil dari Awan Magellan Besar. Dari belahan bumi selatan ia tampak seperti awan redup yang terpisah.",
    it: "Un’altra galassia compagna della Via Lattea, a circa 200.000 anni luce e più piccola della Grande Nube di Magellano. Dall’emisfero australe sembra una debole nube separata." },
  { key: "gc", n: { en: "Galactic Center", id: "Pusat Galaksi", it: "Centro Galattico" }, t: "core", k: 1, ra: 266.417, dec: -29.008, fov: 4,
    en: "The direction of the center of our Milky Way, in Sagittarius, about 26,000 light-years away. A supermassive black hole called Sagittarius A* sits there with roughly 4 million times the mass of the Sun. Dust hides it from visible light, but infrared light passes through dust much better.",
    id: "Arah pusat Bima Sakti kita, di Sagittarius, sekitar 26.000 tahun cahaya jauhnya. Di sana ada lubang hitam supermasif bernama Sagittarius A*, dengan massa kira-kira 4 juta kali Matahari. Debu menutupinya dari cahaya tampak, tetapi cahaya inframerah jauh lebih mudah menembus debu.",
    it: "La direzione del centro della nostra Via Lattea, nel Sagittario, a circa 26.000 anni luce. Lì si trova un buco nero supermassiccio chiamato Sagittarius A*, con circa 4 milioni di volte la massa del Sole. La polvere lo nasconde alla luce visibile, ma la luce infrarossa attraversa la polvere molto meglio." },
  { key: "alfcen", n: "Alpha Centauri", t: "system", k: 2, ra: 219.902, dec: -60.834, fov: 8,
    en: "The closest star system to the Sun, about 4.4 light-years away, in the southern constellation Centaurus. The bright star marked here is really a close pair, with a much fainter third member, Proxima Centauri, which is the closest star to the Sun.",
    id: "Sistem bintang terdekat dari Matahari, sekitar 4,4 tahun cahaya jauhnya, di rasi selatan Centaurus. Bintang terang yang ditandai di sini sebenarnya sepasang bintang yang berdekatan, dengan anggota ketiga yang jauh lebih redup, Proxima Centauri, bintang terdekat dari Matahari.",
    it: "Il sistema stellare più vicino al Sole, a circa 4,4 anni luce, nella costellazione australe del Centauro. La stella brillante segnata qui è in realtà una coppia stretta, con un terzo membro molto più debole, Proxima Centauri, che è la stella più vicina al Sole." },
  { key: "procyon", n: "Procyon", t: "star", k: 2, ra: 114.826, dec: 5.225, fov: 8,
    en: "A bright star in the constellation Canis Minor, only about 11.5 light-years away, so it is one of our nearer neighbors. It has a faint white dwarf companion.",
    id: "Bintang terang di rasi Canis Minor, hanya sekitar 11,5 tahun cahaya jauhnya, jadi termasuk tetangga dekat kita. Ia punya pendamping katai putih yang redup.",
    it: "Una stella brillante nella costellazione del Cane Minore, a soli 11,5 anni luce circa, quindi una delle nostre vicine. Ha una debole compagna, una nana bianca." },
  { key: "altair", n: "Altair", t: "star", k: 2, ra: 297.696, dec: 8.868, fov: 8,
    en: "A bright star in the constellation Aquila (the Eagle), about 17 light-years away. It spins so fast, a turn in under ten hours, that it bulges at the equator, about a quarter wider there than from pole to pole.",
    id: "Bintang terang di rasi Aquila (Elang), sekitar 17 tahun cahaya jauhnya. Ia berputar sangat cepat, satu putaran dalam kurang dari sepuluh jam, sehingga khatulistiwanya menggembung, sekitar seperempat lebih lebar daripada jarak kutub ke kutub.",
    it: "Una stella brillante nella costellazione dell’Aquila, a circa 17 anni luce. Ruota così in fretta, un giro in meno di dieci ore, che si allarga all’equatore, dove è circa un quarto più larga che da polo a polo." },
  { key: "aldebaran", n: "Aldebaran", t: "star", k: 2, ra: 68.980, dec: 16.509, fov: 8,
    en: "The eye of Taurus (the Bull), an orange giant about 65 light-years away. It only appears to sit among the Hyades star cluster, which is more than twice as far away.",
    id: "Mata rasi Taurus (Banteng), raksasa jingga sekitar 65 tahun cahaya jauhnya. Ia hanya tampak berada di tengah gugus Hyades, padahal gugus itu lebih dari dua kali lebih jauh.",
    it: "L’occhio del Toro, una gigante arancione a circa 65 anni luce. Sembra stare in mezzo all’ammasso delle Iadi, ma l’ammasso è più del doppio più lontano." },
  { key: "antares", n: "Antares", t: "star", k: 2, ra: 247.352, dec: -26.432, fov: 8,
    en: "A red supergiant in the constellation Scorpius. Its name means rival of Mars, because its red color looks similar. It is roughly 550 light-years away and several hundred times wider than the Sun.",
    id: "Maharaksasa merah di rasi Scorpius. Namanya berarti saingan Mars, karena warna merahnya mirip. Jaraknya kira-kira 550 tahun cahaya, dan lebarnya beberapa ratus kali Matahari.",
    it: "Una supergigante rossa nella costellazione dello Scorpione. Il nome significa rivale di Marte, perché il suo colore rosso gli somiglia. È a circa 550 anni luce ed è alcune centinaia di volte più larga del Sole." },
  { key: "spica", n: "Spica", t: "star", k: 2, ra: 201.298, dec: -11.161, fov: 8,
    en: "The brightest star in the constellation Virgo, a hot blue star about 250 light-years away. It is really a close pair of stars orbiting each other every four days.",
    id: "Bintang paling terang di rasi Virgo, bintang biru yang panas, sekitar 250 tahun cahaya jauhnya. Sebenarnya ia sepasang bintang berdekatan yang saling mengitari setiap empat hari.",
    it: "La stella più luminosa della Vergine, una stella blu e calda a circa 250 anni luce. In realtà è una coppia stretta di stelle che si girano attorno ogni quattro giorni." },
  { key: "deneb", n: "Deneb", t: "star", k: 2, ra: 310.358, dec: 45.280, fov: 8,
    en: "A very luminous white supergiant in the constellation Cygnus (the Swan). It is more than a thousand light-years away, yet still shines brightly in our sky.",
    id: "Maharaksasa putih yang sangat terang di rasi Cygnus (Angsa). Jaraknya lebih dari seribu tahun cahaya, tetapi ia tetap bersinar terang di langit kita.",
    it: "Una supergigante bianca molto luminosa nella costellazione del Cigno. È a più di mille anni luce, eppure brilla ancora forte nel nostro cielo." },
  { key: "regulus", n: "Regulus", t: "star", k: 2, ra: 152.093, dec: 11.967, fov: 8,
    en: "The brightest star in Leo (the Lion), about 79 light-years away. It is a blue-white star that spins very fast.",
    id: "Bintang paling terang di Leo (Singa), sekitar 79 tahun cahaya jauhnya. Ia bintang putih kebiruan yang berputar sangat cepat.",
    it: "La stella più luminosa del Leone, a circa 79 anni luce. È una stella bianco-azzurra che ruota molto in fretta." },
  { key: "fomalhaut", n: "Fomalhaut", t: "star", k: 2, ra: 344.413, dec: -29.622, fov: 8,
    en: "The brightest star in Piscis Austrinus, about 25 light-years away. It is surrounded by wide rings of dust and icy debris, left over from planet formation and kept fresh by collisions.",
    id: "Bintang paling terang di Piscis Austrinus, sekitar 25 tahun cahaya jauhnya. Ia dikelilingi cincin lebar dari debu dan serpihan es, sisa pembentukan planet yang terus diperbarui oleh tabrakan.",
    it: "La stella più luminosa del Pesce Australe, a circa 25 anni luce. È circondata da ampi anelli di polvere e detriti ghiacciati, avanzi della formazione dei pianeti tenuti vivi dalle collisioni." },
  { key: "carina", n: { en: "Carina Nebula", id: "Nebula Carina", it: "Nebulosa della Carena" }, t: "nebula", k: 2, ra: 161.259, dec: -59.700, fov: 5,
    en: "A huge star-forming cloud in the southern sky, about 8,000 light-years away. It is much larger than the Orion Nebula and contains some of the most massive stars known, including Eta Carinae.",
    id: "Awan pembentuk bintang yang sangat besar di langit selatan, sekitar 8.000 tahun cahaya jauhnya. Ia jauh lebih besar dari Nebula Orion dan berisi beberapa bintang paling masif yang diketahui, termasuk Eta Carinae.",
    it: "Un’enorme nube di formazione stellare nel cielo australe, a circa 8.000 anni luce. È molto più grande della Nebulosa di Orione e contiene alcune delle stelle più massicce conosciute, tra cui Eta Carinae." },
  { key: "m8", n: { en: "Lagoon Nebula", id: "Nebula Laguna", it: "Nebulosa Laguna" }, t: "nebula", k: 2, ra: 270.904, dec: -24.387, fov: 3,
    en: "A large glowing cloud of gas in Sagittarius, about 4,000 light-years away, where stars are forming. From a dark site it can be seen without a telescope as a faint smudge.",
    id: "Awan gas besar yang berpendar di Sagittarius, sekitar 4.000 tahun cahaya jauhnya, tempat bintang-bintang sedang terbentuk. Dari tempat yang gelap ia terlihat tanpa teleskop sebagai noda redup.",
    it: "Una grande nube di gas luminosa nel Sagittario, a circa 4.000 anni luce, dove si formano stelle. Da un luogo buio si vede senza telescopio come una debole macchia." },
  { key: "m1", n: { en: "Crab Nebula", id: "Nebula Kepiting", it: "Nebulosa del Granchio" }, t: "snr", k: 2, ra: 83.632, dec: 22.017, fov: 1.5,
    en: "The expanding remains of a star that exploded. Chinese astronomers recorded it as a guest star in the year 1054. It is about 6,500 light-years away, and a neutron star spinning about 30 times a second sits at its heart.",
    id: "Sisa bintang yang meledak, yang terus mengembang. Astronom Tiongkok mencatatnya sebagai bintang tamu pada tahun 1054. Jaraknya sekitar 6.500 tahun cahaya, dan di jantungnya ada bintang neutron yang berputar sekitar 30 kali per detik.",
    it: "I resti in espansione di una stella esplosa. Gli astronomi cinesi la registrarono come stella ospite nell’anno 1054. È a circa 6.500 anni luce e al suo centro c’è una stella di neutroni che ruota circa 30 volte al secondo." },
  { key: "hyades", n: { en: "Hyades", id: "Hyades", it: "Iadi" }, t: "cluster", k: 2, ra: 67.447, dec: 16.948, fov: 12,
    en: "The nearest open star cluster to the Sun, about 150 light-years away, forming the V-shaped face of Taurus the Bull. Its stars were born together roughly 600 million years ago.",
    id: "Gugus bintang terbuka terdekat dari Matahari, sekitar 150 tahun cahaya jauhnya, membentuk wajah berbentuk V pada Taurus si Banteng. Bintang-bintangnya lahir bersama kira-kira 600 juta tahun lalu.",
    it: "L’ammasso aperto più vicino al Sole, a circa 150 anni luce, che forma il muso a V del Toro. Le sue stelle sono nate insieme circa 600 milioni di anni fa." },
  { key: "omegacen", n: "Omega Centauri", t: "cluster", k: 2, ra: 201.697, dec: -47.479, fov: 2,
    en: "The largest and brightest globular cluster visible from Earth, a ball of millions of stars about 17,000 light-years away. Some astronomers think it is the leftover core of a small galaxy swallowed by the Milky Way.",
    id: "Gugus bola terbesar dan paling terang yang terlihat dari Bumi, bola berisi jutaan bintang sekitar 17.000 tahun cahaya jauhnya. Sebagian astronom menduga ia sisa inti galaksi kecil yang ditelan Bima Sakti.",
    it: "L’ammasso globulare più grande e luminoso visibile dalla Terra, una sfera di milioni di stelle a circa 17.000 anni luce. Alcuni astronomi pensano che sia il nucleo rimasto di una piccola galassia inghiottita dalla Via Lattea." },
  { key: "m33", n: { en: "Triangulum Galaxy", id: "Galaksi Triangulum", it: "Galassia del Triangolo" }, t: "galaxy", k: 2, ra: 23.462, dec: 30.660, fov: 3,
    en: "A spiral galaxy about 2.7 million light-years away, the third largest in our Local Group after Andromeda and the Milky Way. It is faint and needs dark skies to be seen by eye.",
    id: "Galaksi spiral sekitar 2,7 juta tahun cahaya jauhnya, terbesar ketiga di Grup Lokal kita setelah Andromeda dan Bima Sakti. Ia redup dan butuh langit gelap untuk terlihat dengan mata.",
    it: "Una galassia a spirale a circa 2,7 milioni di anni luce, la terza più grande del nostro Gruppo Locale dopo Andromeda e la Via Lattea. È debole e serve un cielo buio per vederla a occhio nudo." },
];

const KNOWN_SUN = { key: "sun", n: { en: "The Sun", id: "Matahari", it: "Il Sole" }, t: "sun", k: 1, fov: 30,
  en: "The star at the center of our solar system, about 150 million kilometers from Earth. Seen from Earth it travels once a year around the sky along the ecliptic, the orange line. The marker shows roughly where it is today. The sky images behind it were collected over months and years, so the Sun itself is not in the picture.",
  id: "Bintang di pusat tata surya kita, sekitar 150 juta kilometer dari Bumi. Dilihat dari Bumi, ia mengelilingi langit sekali setahun di sepanjang ekliptika, garis jingga. Penanda ini menunjukkan kira-kira posisinya hari ini. Gambar langit di belakangnya dikumpulkan selama berbulan-bulan dan bertahun-tahun, jadi Matahari sendiri tidak ada di gambar.",
  it: "La stella al centro del nostro sistema solare, a circa 150 milioni di chilometri dalla Terra. Vista dalla Terra, percorre il cielo una volta all’anno lungo l’eclittica, la linea arancione. Il segno mostra all’incirca dove si trova oggi. Le immagini del cielo dietro sono state raccolte in mesi e anni, quindi il Sole stesso non compare." };

const OBLIQUITY_J2000 = 23.4392911;

// ecliptic (lon, lat) in the J2000 frame -> ICRS RA, Dec (deg)
function eclToEq(lon, lat) {
  const d = Math.PI / 180, e = OBLIQUITY_J2000 * d, l = lon * d, b = lat * d;
  const ra = Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
  const dec = Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
  return [((ra / d) % 360 + 360) % 360, dec / d];
}

// The Sun today, low-precision formula of the Astronomical Almanac (about 0.01 deg). That formula gives the
// longitude against the equinox of the date; the map is J2000, so take off the precession since 2000
// (5029.1 arcsec per century), about 0.37 deg in 2026, before converting.
function sunNow(date = new Date()) {
  const n = date.getTime() / 86400000 + 2440587.5 - 2451545.0, d = Math.PI / 180;
  const L = 280.460 + 0.9856474 * n, g = (357.528 + 0.9856003 * n) * d;
  const lamDate = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  const lamJ2000 = lamDate - 1.396971 * (n / 36525);
  return eclToEq(((lamJ2000 % 360) + 360) % 360, 0);
}

// the ecliptic as short runs of points, so no single segment jumps across the edge of the map
function eclipticRuns(step = 2, perRun = 6) {
  const runs = [];
  for (let s = 0; s < 360; s += step * (perRun - 1)) {
    const run = [];
    for (let i = 0; i < perRun; i++) run.push(eclToEq(Math.min(360, s + i * step), 0));
    runs.push(run);
  }
  return runs;
}

const knownName = (o, l) => (typeof o.n === "string" ? o.n : o.n[l] || o.n.en);
