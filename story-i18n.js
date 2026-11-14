// "Why blink the sky" in Indonesian and Italian. Same chapters, same sources [n], same figures as the
// English in story.js, which stays the reference. Loaded after story.js, then the story redraws.
"use strict";

STORY.id = {
  label: "ceritanya", h: "Kenapa mengedipkan langit",
  tabsLabel: "baca sebagai",
  tabs: { curious: "baru kenal", student: "pelajar", scientist: "ilmuwan" },
  lede: {
    curious: "Tidak perlu latar belakang apa pun. Enam bab pendek, dari kenapa langit tidak diam sampai apakah planet tersembunyi bisa ditangkap dengan cara ini.",
    student: "Untuk yang sudah tahu apa itu magnitudo dan spektrum. Enam bab yang sama, dengan angka-angka yang membuatnya bekerja.",
    scientist: "Enam bab yang sama dengan persamaan, produk data, dan pertanyaan yang masih terbuka, serta sumber untuk setiap klaim.",
  },
  chapters: [
    {
      h: "Langit tidak diam",
      hook: "Geser waktunya dan lihat bintang tercepat di langit berjalan.",
      photoCap: "Yang asli. Pelat Clyde Tombaugh tanggal 23 dan 29 Januari 1930. Kedipkan keduanya, dan satu titik redup melompat, itulah Pluto. Semua yang lain tetap diam.",
      curious: `<p>Lihatlah ke atas di malam yang cerah, dan bintang-bintang tampak diam, seperti dilukis di sebuah kubah. Sebenarnya tidak. Setiap bintang bergerak, tetapi kebanyakan begitu jauh sehingga geraknya baru terasa setelah seumur hidup.</p>
<p>Beberapa cukup dekat sehingga kamera yang teliti bisa melihatnya bergeser dari tahun ke tahun. Cara menemukannya sudah tua dan sederhana. Pada 1930 Clyde Tombaugh menemukan Pluto dengan membolak-balik dua foto langit yang sama, yang diambil berselang enam hari. Bintang-bintang tetap di tempatnya dan satu titik redup melompat.</p>
<p>Halaman ini melakukan hal yang sama dengan gambar dari teleskop luar angkasa NASA. Pilih sebuah bintang di atas dan perhatikan.</p>`,
      student: `<p>Alatnya bernama <b>blink comparator</b>, ditemukan pada 1904. Dua foto dari medan yang sama, yang sudah dijajarkan, ditampilkan bergantian dengan cepat, sehingga bintang yang diam tetap diam dan benda yang bergerak melompat. Tombaugh menemukan Pluto di pelat tanggal 23 dan 29 Januari 1930. Sejak 2017 para relawan Backyard Worlds: Planet 9 melakukan hal yang sama dengan citra WISE dan menemukan ribuan kandidat katai cokelat [1].</p>
<p>Yang mereka cari adalah <b>gerak diri</b>, sudut yang ditempuh sebuah bintang di langit per tahun. Gerak ini makin besar kalau bintangnya bergerak cepat melintang dari garis pandang kita, dan makin kecil kalau bintangnya jauh. Pemegang rekornya, Bintang Barnard, bergerak 10,4 detik busur per tahun. Kedengarannya banyak, tetapi satu piksel SPHEREx lebarnya 6,15 detik busur, jadi bintang ini pun bergerak kurang dari satu piksel di antara dua kunjungan yang berselang enam bulan.</p>`,
      scientist: `<p>Gerak diri dan kecepatan tangensial terhubung lewat <i>v</i><sub>t</sub> = 4,74 <i>μ d</i>, dengan <i>μ</i> dalam detik busur&nbsp;tahun<sup>−1</sup>, <i>d</i> dalam pc dan <i>v</i><sub>t</sub> dalam km&nbsp;s<sup>−1</sup>. Untuk Bintang Barnard, <i>μ</i> = 10,39″&nbsp;tahun<sup>−1</sup> dan <i>d</i> = 1,83 pc dari Gaia DR3 [5], sehingga <i>v</i><sub>t</sub> ≈ 90&nbsp;km&nbsp;s<sup>−1</sup>.</p>
<p>Dengan 6,15″ per piksel, itu sama dengan 1,69&nbsp;px&nbsp;tahun<sup>−1</sup>, atau 0,85 px di antara lintasan enam bulanan. Gerak per langkahnya kurang dari satu piksel dan PSF-nya kurang tersampel, jadi alat ini juga bisa mengedipkan median per lintasan pada satu kisi TAN tetap, dan benda yang bergerak lambat muncul di tampilan selisih sebagai dipol, ciri yang dipakai Backyard Worlds [1, 18]. Dalam 60 pengamatan D1, posisi Bintang Barnard yang kami ukur rata-rata jatuh dalam sepersepuluh piksel dari prediksi Gaia yang digeser ke tiap tanggal.</p>`,
    },
    {
      h: "Planet, bintang, dan yang di antaranya",
      hook: "Kenapa tetangga Matahari yang paling dingin bersinar dalam cahaya yang tak bisa kita lihat.",
      photoCap: "Planet, katai cokelat, dan bintang, diurutkan menurut massa. Katai cokelat ada di antara sekitar 13 dan 80 kali massa Jupiter.",
      curious: `<p><b>Eksoplanet</b> adalah planet yang mengitari bintang selain Matahari. Para astronom sudah menemukan ribuan, kebanyakan dengan melihat bintangnya sedikit meredup atau bergoyang. Sangat sedikit yang pernah difoto, karena sebuah planet miliaran kali lebih redup daripada bintang di sebelahnya.</p>
<p>Di antara planet dan bintang ada keluarga yang aneh, <b>katai cokelat</b>. Mereka lahir seperti bintang tetapi terlalu ringan untuk terus bersinar, jadi mereka pelan-pelan mendingin selamanya, berpendar dalam cahaya inframerah seperti bara yang memudar. Yang paling dingin sedingin sebuah planet.</p>
<p>Beberapa tetangga terdekat Matahari adalah katai cokelat yang baru ditemukan dalam dua puluh tahun terakhir, karena mata kita tidak bisa melihat cahayanya. Teleskop inframerah bisa.</p>`,
      student: `<p>Massa yang memisahkan benda-benda ini. Di bawah sekitar 13 massa Jupiter, sebuah benda tidak pernah membakar deuterium, dan itulah batas yang biasa untuk planet. Di atas sekitar 75 sampai 80 massa Jupiter, ia membakar hidrogen dan menjadi bintang. Di antaranya ada katai cokelat, dan di orbit dekat bintang mirip Matahari mereka jarang, yang disebut gurun katai cokelat.</p>
<p>Kenapa inframerah? Sebuah benda bersuhu <i>T</i> paling banyak memancar pada panjang gelombang <i>λ</i><sub>max</sub> ≈ 2900 μm K / <i>T</i>. Katai cokelat 1000 K memuncak dekat 3 μm, yang 250 K dekat 12 μm. Metana dan air menyerap sebagian cahaya itu, jadi katai cokelat yang dingin terang di beberapa jendela inframerah dan hampir gelap di tempat lain. Pencitraan langsung eksoplanet bekerja karena alasan yang sama, ia lebih mudah untuk planet raksasa muda yang masih berpendar di inframerah, di mana kontras planet terhadap bintang jauh lebih ramah daripada 10<sup>−10</sup> untuk Bumi dalam cahaya kasatmata.</p>`,
      scientist: `<p>Sensus 20 pc kini berisi 525 katai L, T dan Y [7]. Anggota terdinginnya, WISE 0855−0714, adalah katai Y dekat 250 K pada jarak 2,3 pc [8], dengan <i>J</i> ≈ 25 tetapi <i>W2</i> = 13,70 di AllWISE, sehingga fluksnya hampir seluruhnya dekat 4,6 μm. Epsilon Indi Ba/Bb, pasangan T1 + T6 pada 3,7 pc, adalah biner acuan yang terikat pada bintang K5 V [9, 10].</p>
<p>SPHEREx penting di sini karena tiap detektornya ada di belakang filter variabel linear. Selama lintasannya, setiap titik di langit mendapat spektrum 0,75 sampai 5 μm pada <i>R</i> ≈ 35 sampai 130, yang mencakup pita CH<sub>4</sub>, H<sub>2</sub>O dan CO yang menentukan suhu katai cokelat [3, 4]. Gerak dan spektrum datang dari satu set data, dan itulah alasan alat kedip ini memisahkan tiap detektor.</p>`,
    },
    {
      h: "SPHEREx, kamera dengan 102 warna",
      hook: "Satu kamera kecil, 102 warna. Geser sebuah bintang melintasinya.",
      photoCap: "Teleskop SPHEREx dan detektornya di laboratorium sebelum diluncurkan. Teleskopnya dimiringkan supaya wahana bisa menyapu seluruh langit sambil menjauhkan Matahari.",
      curious: `<p>SPHEREx adalah teleskop luar angkasa kecil milik NASA yang diluncurkan pada Maret 2025. Ia mengitari Bumi dan memotret seluruh langit setiap enam bulan dalam cahaya inframerah, yang tidak bisa dilihat mata kita.</p>
<p>Triknya, setiap gambar adalah pelangi. Satu tepi gambar melihat satu warna dan tepi lainnya warna lain, jadi saat teleskop menyapu langit, setiap titik akhirnya terlihat dalam 102 warna. Semua gambarnya terbuka untuk umum, dan halaman ini memakainya.</p>`,
      student: `<p>SPHEREx punya enam detektor, D1 sampai D6, yang bersama-sama mencakup 0,75 sampai 5,0 μm. Tiap detektor ada di belakang <b>filter variabel linear</b> yang panjang gelombangnya berubah di sepanjang detektor, jadi satu pengamatan bukan satu warna, dan bintang yang terlihat dua kali terlihat pada dua panjang gelombang yang sedikit berbeda. Pikselnya 6,15 detik busur. Seluruh langit tercakup kira-kira setiap enam bulan, dan jauh lebih sering di dekat kutub ekliptika.</p>
<p>Setiap berkas Level 2 berisi gambarnya, model <b>cahaya zodiak</b> (cahaya Matahari yang dihamburkan debu di Tata Surya kita sendiri, yang berubah menurut musim), peta piksel yang ditandai, derau tiap piksel, dan panjang gelombang setiap piksel. Alat ini mengurangi cahaya zodiak lebih dulu, kalau tidak latar belakangnya akan berkedip di antara kunjungan.</p>`,
      scientist: `<p>Tujuan utama misi ini adalah survei galaksi 3D untuk non-Gaussianitas primordial, cahaya latar ekstragalaksi, dan sensus es antarbintang [2, 3], dari teleskop 20 cm dengan enam larik HgCdTe 2K [4]. Resolusi spektralnya <i>R</i> ≈ 35 sampai 41 di D1 sampai D4 dan sekitar 110 sampai 130 di D5 dan D6.</p>
<p>Bagi sebuah kedipan, filter ini sama-sama gangguan dan anugerah. Di dalam satu detektor, panjang gelombang di target berubah antarpengamatan, jadi median per lintasan mencampur kanal yang bertetangga, dan perubahan kecerlangan antarlintasan sebagian adalah efek warna. Alat ini melaporkan panjang gelombang setiap bingkai dan menyisakan fotometri pada panjang gelombang tetap untuk nanti. Medan-medan dalam data kami punya 36 sampai 96 pengamatan per detektor, dalam dua sampai empat lintasan.</p>`,
    },
    {
      h: "Bagaimana kedipan dibuat",
      hook: "Lima langkah dari arsip NASA sampai gambar yang bergerak.",
      curious: `<p>Untuk titik yang kamu pilih, halaman ini meminta arsip NASA setiap gambar SPHEREx yang mencakupnya. Ia memotong kotak kecil dari masing-masing gambar dan menghapus pendaran debu di Tata Surya kita sendiri. Lalu semua kotak dijajarkan dengan utara di atas, sehingga bintang-bintang jauh jatuh tepat di tempat yang sama. Kalau diputar berurutan, apa pun yang bergerak akan berjalan melintasi layar.</p>
<p>Lingkaran-lingkaran menunjukkan di mana tiap bintang seharusnya berada pada hari itu menurut teleskop lain, jadi kamu bisa mencocokkan gambarnya.</p>`,
      student: `<p>Langkahnya adalah kueri, potongan, dan proyeksi ulang. Kueri ADQL ke IRSA mendaftar setiap pengamatan yang jejaknya mencakup posisi itu. Posisi Gaia berlaku untuk tahun 2016, jadi tiap bintang digeser dengan gerak dirinya ke tanggal tiap pengamatan sebelum potongan diambil. Model cahaya zodiak dikurangkan, piksel yang ditandai diberi tanda, dan setiap potongan ditempatkan ulang pada satu kisi tetap dengan utara di atas.</p>
<p>Kamu bisa menampilkan setiap pengamatan, atau satu gambar median per lintasan enam bulanan, yang mengalahkan derau. Tampilan selisih mengurangkan median semua gambar, jadi yang tidak pernah berubah menjadi abu-abu, dan benda yang bergerak meninggalkan titik terang di tempatnya sekarang dan titik gelap di tempatnya dulu. Sumber Gaia DR3 dan CatWISE2020 digambar di atasnya, masing-masing digeser ke tanggal di layar [5, 6].</p>`,
      scientist: `<p>Setiap potongan disampel bilinear ke kisi TAN yang tetap pada epoch rata-rata, 59 × 59 piksel berukuran 6,15″. Lintasan dipisah pada celah lebih dari 60 hari, dan medan kutub dibatasi 40 pengamatan per lintasan. Gambar diregangkan per bingkai dengan arsinh, memakai median dan 1,4826 MAD sebagai langit dan derau, dan dikirim sebagai int16 dengan galat kuantisasi 1/65534 dari rentang bingkai.</p>
<p>Batasan yang diketahui. Gerak diri dianggap linear, tanpa paralaks. Tidak ada penyamaan PSF sebelum pengurangan, jadi bintang terang meninggalkan sisa. Pergeseran panjang gelombang di dalam detektor dilaporkan tetapi tidak dikoreksi. Kelima target dikirim sebagai berkas statis di keenam detektor, dan posisi lain menjalankan kode yang sama secara langsung di server lokal. Setiap tampilan adalah sebuah URL, jadi setiap gambar di halaman ini bisa diulang.</p>`,
    },
    {
      h: "Lima bintang uji, lima pertanyaan",
      hook: "Lima benda, lima pertanyaan. Pilih satu dan perhatikan.",
      curious: `<p>Tantangan ini memberi lima benda uji, dan masing-masing mengajukan satu pertanyaan kepada alatnya. <b>Bintang Barnard</b> bertanya apakah alat ini bisa melihat gerak, dan bintang itu berjalan ke utara. <b>Epsilon Indi B</b>, dua katai cokelat yang terlalu dekat untuk dibedakan, bertanya apakah ia bisa melihat gerak yang sangat kecil. <b>WISE 0855</b>, katai cokelat terdingin yang diketahui, bertanya apakah ia bisa menunjukkan sesuatu yang tak terlihat di kebanyakan warna, dan ia hanya muncul di detektor yang paling merah. <b>RW Aurigae</b> dan <b>R Draconis</b> sama sekali tidak bergerak. Mereka bertanya apakah alat ini bisa menunjukkan bintang yang berubah kecerlangannya.</p>`,
      student: `<p>Bintang Barnard bergerak 1,7 px per tahun dan terang di semua detektor. Epsilon Indi B bergerak 0,8 px per tahun dan paling jelas di D5. WISE 0855 bergerak 1,3 px per tahun dan hanya muncul di D6, dekat 4,6 μm. RW Aurigae adalah biner muda yang piringannya kadang menutupi bintangnya. R Draconis adalah bintang variabel Mira dengan periode 246 hari dan rentang kasatmata dari magnitudo 6,7 sampai 13,2. Pilih detektor dengan tombol D1 sampai D6 dan lihat target mana yang muncul dan memudar.</p>`,
      scientist: `<p>Epsilon Indi B punya RUWE Gaia 4,3, sesuai dugaan untuk pasangan yang tak terpisahkan [5, 10]. WISE 0855 terpecah menjadi beberapa entri CatWISE2020 dengan gerak dekat 8″&nbsp;tahun<sup>−1</sup>, karena ia bergerak sangat jauh selama penggabungan citra WISE [6]. R Draconis terletak dekat kutub ekliptika utara, jadi kunjungannya menyatu menjadi dua atau tiga lintasan berisi sampai 89 pengamatan. Enam bulan bukan kelipatan utuh dari periodenya yang 246 hari, jadi tiap lintasan mencicipi fase yang berbeda. Lapisan CatWISE-nya kosong, karena IRSA tidak mengembalikan sumber CatWISE2020 di medan itu. Pasangan RW Aurigae pada 1,45″ tercatat terpisah di Gaia, dengan RUWE 16.</p>`,
    },
    {
      h: "Bisakah ia menemukan Planet X?",
      hook: "Geser tiga penggeser dan lihat kenapa planet tersembunyi begitu sulit ditangkap.",
      photoCap: "Memperbesar dari planet-planet ke sabuk Kuiper, ke Sedna, dan ke orbit panjang benda-benda jauh yang kesejajarannya melahirkan gagasan Planet Sembilan, dengan satu orbit usulan berwarna jingga.",
      curious: `<p>Sebagian astronom menduga ada sebuah planet beberapa kali lebih berat dari Bumi yang mengitari Matahari jauh di luar Neptunus, karena segelintir benda es yang jauh punya orbit yang berjajar dengan cara yang aneh. Belum ada yang melihatnya, dan yang lain menduga jajaran itu hanya akibat di mana teleskop kebetulan melihat.</p>
<p>Kalau planet itu ada, ia hanya memantulkan cahaya Matahari, dan sejauh itu dari Matahari ia akan sangat redup, lebih redup daripada yang bisa dilihat SPHEREx dalam satu gambar. Jadi jawaban jujurnya, kemungkinan besar tidak dengan cara ini. Cara yang sama memang menemukan tetangga Matahari yang nyata, dan mengatakan dengan jelas apa yang tidak bisa kita lihat adalah bagian dari sains.</p>`,
      student: `<p>Dasarnya adalah benda trans-Neptunus ekstrem, benda kecil dengan orbit di luar sekitar 250 SA yang arahnya berkumpul [11, 12]. Planet sekitar 5 sampai 10 massa Bumi diusulkan pada 2016 [12], diperhalus menjadi 6,2 massa Bumi pada sekitar 380 SA pada 2021 [14], dan sebuah pencocokan terbaru menempatkannya lebih ringan dan lebih dekat, sekitar 4,4 massa Bumi dan 290 SA [15]. Tim survei mendapati pengumpulan itu sesuai dengan di mana dan kapan mereka melihat [16, 17].</p>
<p>Masalahnya adalah cahaya. Cahaya Matahari sampai ke planet dengan diencerkan oleh kuadrat jarak, lalu kembali dengan diencerkan lagi, jadi kecerlangannya turun sebanding pangkat empat jarak. Untuk ukuran yang mungkin, hasilnya V ≈ 19 sampai 22, sedangkan satu pengamatan SPHEREx diperkirakan mencapai sekitar V ≈ 17. Gerak bukan masalahnya, orbit Bumi membuat planet pada 500 SA berayun ratusan detik busur per tahun. Masalahnya kedalaman.</p>`,
      scientist: `<p>Dalam cahaya pantulan saat oposisi, <i>m</i> = <i>m</i><sub>⊙</sub> − 2,5 log<sub>10</sub>[<i>A</i><sub>g</sub> <i>R</i><sub>p</sub><sup>2</sup> / (<i>r</i><sup>2</sup> <i>Δ</i><sup>2</sup>)], dengan <i>m</i><sub>⊙</sub> = −26,74 di V dan panjang dalam SA. Untuk <i>R</i><sub>p</sub> = 3 <i>R</i><sub>⊕</sub> dan <i>A</i><sub>g</sub> = 0,3, <i>V</i> ≈ 18,8 pada 300 SA dan 21,0 pada 500 SA. Metana menurunkan <i>A</i><sub>g</sub> di pita SPHEREx, dan pancaran termal tidak membantu, karena <i>T</i><sub>eq</sub> = 278,6 K / √<i>r</i> ≈ 12,5 K pada 500 SA.</p>
<p>Amplitudo paralaks 206265″ / <i>r</i> adalah 413″ pada 500 SA, sekitar 67 piksel SPHEREx, jadi planet itu tidak pernah saling meniadakan dalam selisih, dan pencarian harus menggeser dan menumpuk sepanjang orbit uji dalam <i>r</i> dan arah. Hasil yang berguna dari pencarian dengan SPHEREx karenanya adalah daerah ruang parameter yang ia singkirkan, diukur dengan planet sintetis yang disuntikkan, dibandingkan dengan posterior [15] dan analisis bias seleksi [16, 17]. Halaman ini tidak mencoba pencarian itu. Ia menunjukkan kenapa pojok kiri atas tabel kecerlangan, planet besar dekat 300 SA, adalah satu-satunya yang terjangkau.</p>`,
    },
  ],
  honest: {
    h: "Apa yang diukur dan apa yang tidak",
    items: [
      ["diukur", "Setiap piksel yang kamu lihat adalah pengamatan SPHEREx sungguhan dari NASA/IPAC IRSA, hanya dikurangi model cahaya zodiak. Posisi dan gerak target diukur oleh Gaia DR3, atau oleh WISE untuk WISE 0855."],
      ["diprediksi", "Penanda merah dan lingkaran katalog adalah tempat setiap benda seharusnya berada pada tanggal gambar menurut pengukuran itu. Kalau bintang duduk di atas penandanya, prediksi dan gambar sepakat."],
      ["prakiraan", "Kedalaman SPHEREx sekitar V 17 per pengamatan adalah prakiraan yang sudah diterbitkan, bukan pengukuran kami. Kecerlangan Planet X adalah hitungan kami sendiri untuk ukuran dan jarak yang diandaikan."],
    ],
  },
  refsH: "Sumber",
  refsNote: "Setiap nomor arXiv sudah dicek di arxiv.org pada 14 November 2026.",
};

STORY.it = {
  label: "la storia", h: "Perché fare il blink del cielo",
  tabsLabel: "leggila come",
  tabs: { curious: "nuovo a tutto questo", student: "studente", scientist: "scienziato" },
  lede: {
    curious: "Non serve nessuna base. Sei brevi capitoli, dal perché il cielo non è fermo fino a se un pianeta nascosto si possa scoprire così.",
    student: "Per chi sa cosa sono una magnitudine e uno spettro. Gli stessi sei capitoli, con i numeri che li fanno funzionare.",
    scientist: "Gli stessi sei capitoli con le equazioni, i prodotti dei dati e le domande aperte, e una fonte per ogni affermazione.",
  },
  chapters: [
    {
      h: "Il cielo non è fermo",
      hook: "Trascina il tempo e guarda camminare la stella più veloce del cielo.",
      photoCap: "L’originale. Le lastre di Clyde Tombaugh del 23 e 29 gennaio 1930. Fai il blink e un puntino debole salta, è Plutone. Tutto il resto resta fermo.",
      curious: `<p>Guarda in alto in una notte limpida e le stelle sembrano ferme, come dipinte su una cupola. Non lo sono. Ogni stella si muove, ma quasi tutte sono così lontane che il loro moto si noterebbe solo in una vita intera.</p>
<p>Alcune sono abbastanza vicine perché una fotocamera attenta le veda spostarsi da un anno all’altro. Il modo per trovarle è antico e semplice. Nel 1930 Clyde Tombaugh scoprì Plutone passando avanti e indietro tra due fotografie dello stesso cielo, prese a sei giorni di distanza. Le stelle restavano al loro posto e un puntino debole saltava.</p>
<p>Questa pagina fa la stessa cosa con le immagini di un telescopio spaziale della NASA. Scegli una stella qui sopra e guarda.</p>`,
      student: `<p>Lo strumento è un <b>comparatore a blink</b>, inventato nel 1904. Due fotografie allineate dello stesso campo si alternano in fretta, così una stella fissa resta ferma e un corpo in movimento salta. Tombaugh trovò Plutone sulle lastre del 23 e del 29 gennaio 1930. Dal 2017 i volontari di Backyard Worlds: Planet 9 fanno lo stesso con le immagini di WISE e hanno trovato migliaia di candidate nane brune [1].</p>
<p>Quello che cercano è il <b>moto proprio</b>, l’angolo che una stella percorre nel cielo in un anno. Cresce con la velocità della stella di traverso alla nostra linea di vista e diminuisce con la distanza. La detentrice del record, la Stella di Barnard, si muove di 10,4 secondi d’arco all’anno. Sembra tanto, ma un pixel SPHEREx è largo 6,15 secondi d’arco, quindi anche questa stella si sposta di meno di un pixel tra due visite a sei mesi di distanza.</p>`,
      scientist: `<p>Moto proprio e velocità tangenziale sono legati da <i>v</i><sub>t</sub> = 4,74 <i>μ d</i>, con <i>μ</i> in secondi d’arco&nbsp;anno<sup>−1</sup>, <i>d</i> in pc e <i>v</i><sub>t</sub> in km&nbsp;s<sup>−1</sup>. Per la Stella di Barnard, <i>μ</i> = 10,39″&nbsp;anno<sup>−1</sup> e <i>d</i> = 1,83 pc da Gaia DR3 [5], quindi <i>v</i><sub>t</sub> ≈ 90&nbsp;km&nbsp;s<sup>−1</sup>.</p>
<p>A 6,15″ per pixel sono 1,69&nbsp;px&nbsp;anno<sup>−1</sup>, ovvero 0,85 px tra due passaggi semestrali. Il moto per passo è sotto il pixel e la PSF è sottocampionata, quindi lo strumento può anche fare il blink delle mediane per passaggio su una griglia TAN fissa, e un oggetto lento appare nella vista differenza come un dipolo, la firma usata da Backyard Worlds [1, 18]. Nelle 60 esposizioni D1 la posizione misurata della Stella di Barnard cade in media entro un decimo di pixel dalla previsione di Gaia spostata a ogni data.</p>`,
    },
    {
      h: "Pianeti, stelle e ciò che sta in mezzo",
      hook: "Perché i vicini più freddi del Sole brillano in una luce che non vediamo.",
      photoCap: "Pianeti, nane brune e stelle, ordinati per massa. Le nane brune stanno tra circa 13 e 80 volte la massa di Giove.",
      curious: `<p>Un <b>esopianeta</b> è un pianeta che gira attorno a una stella diversa dal Sole. Gli astronomi ne hanno trovati migliaia, quasi sempre guardando la loro stella affievolirsi un poco oppure oscillare. Pochissimi sono stati fotografati, perché un pianeta è miliardi di volte più debole della stella che ha accanto.</p>
<p>Tra pianeti e stelle c’è una strana famiglia, le <b>nane brune</b>. Nascono come stelle ma sono troppo leggere per continuare a brillare, quindi si raffreddano lentamente per sempre, risplendendo nella luce infrarossa come una brace che si spegne. Le più fredde sono fredde come un pianeta.</p>
<p>Alcuni dei vicini più prossimi del Sole sono nane brune trovate solo negli ultimi vent’anni, perché i nostri occhi non vedono la loro luce. Un telescopio infrarosso sì.</p>`,
      student: `<p>È la massa a distinguere questi oggetti. Sotto circa 13 masse di Giove un oggetto non brucia mai il deuterio, ed è il confine abituale per un pianeta. Sopra circa 75 a 80 masse di Giove brucia idrogeno ed è una stella. In mezzo ci sono le nane brune, che vicino a stelle simili al Sole sono rare, il cosiddetto deserto delle nane brune.</p>
<p>Perché l’infrarosso? Un corpo a temperatura <i>T</i> emette di più a una lunghezza d’onda <i>λ</i><sub>max</sub> ≈ 2900 μm K / <i>T</i>. Una nana bruna di 1000 K ha il picco vicino a 3 μm, una di 250 K vicino a 12 μm. Metano e acqua assorbono parte di quella luce, quindi le nane brune fredde sono luminose in poche finestre infrarosse e quasi buie altrove. L’imaging diretto degli esopianeti funziona per la stessa ragione, favorisce i pianeti giganti giovani che brillano ancora nell’infrarosso, dove il contrasto tra pianeta e stella è molto più clemente del 10<sup>−10</sup> di una Terra nella luce visibile.</p>`,
      scientist: `<p>Il censimento entro 20 pc conta ora 525 nane L, T e Y [7]. La più fredda, WISE 0855−0714, è una nana Y vicina a 250 K a 2,3 pc [8], con <i>J</i> ≈ 25 ma <i>W2</i> = 13,70 in AllWISE, quindi il suo flusso è quasi tutto vicino a 4,6 μm. Epsilon Indi Ba/Bb, una coppia T1 + T6 a 3,7 pc, è un sistema binario di riferimento legato a una stella K5 V [9, 10].</p>
<p>SPHEREx conta qui perché ogni rivelatore sta dietro un filtro a variazione lineare. Nei suoi passaggi ogni punto del cielo riceve uno spettro da 0,75 a 5 μm a <i>R</i> ≈ 35 a 130, che copre le bande di CH<sub>4</sub>, H<sub>2</sub>O e CO che fissano la temperatura delle nane brune [3, 4]. Moto e spettro vengono dallo stesso insieme di dati, ed è la ragione per cui uno strumento di blink tiene separati i rivelatori.</p>`,
    },
    {
      h: "SPHEREx, una fotocamera da 102 colori",
      hook: "Una piccola fotocamera, 102 colori. Fai scorrere una stella attraverso.",
      photoCap: "Il telescopio SPHEREx e i suoi rivelatori in laboratorio prima del lancio. Il telescopio è inclinato perché il veicolo possa spazzare tutto il cielo tenendo fuori il Sole.",
      curious: `<p>SPHEREx è un piccolo telescopio spaziale della NASA lanciato a marzo 2025. Gira attorno alla Terra e fotografa tutto il cielo ogni sei mesi nella luce infrarossa, che i nostri occhi non vedono.</p>
<p>Il suo trucco è che ogni immagine è un arcobaleno. Un bordo dell’immagine vede un colore e l’altro bordo un altro, così mentre il telescopio spazza il cielo ogni punto finisce per essere visto in 102 colori. Tutte le immagini sono pubbliche, e questa pagina le usa.</p>`,
      student: `<p>SPHEREx ha sei rivelatori, da D1 a D6, che insieme coprono da 0,75 a 5,0 μm. Ognuno sta dietro un <b>filtro a variazione lineare</b> la cui lunghezza d’onda cambia lungo il rivelatore, quindi una esposizione non è un solo colore e una stella vista due volte è vista a due lunghezze d’onda leggermente diverse. I pixel sono di 6,15 secondi d’arco. Tutto il cielo viene coperto circa ogni sei mesi, e molto più spesso vicino ai poli dell’eclittica.</p>
<p>Ogni file Level 2 contiene l’immagine, un modello della <b>luce zodiacale</b> (la luce del Sole diffusa dalla polvere del nostro Sistema Solare, che cambia con le stagioni), una mappa dei pixel segnalati, il rumore di ogni pixel e la lunghezza d’onda di ogni pixel. Lo strumento sottrae prima la luce zodiacale, altrimenti lo sfondo sfarfallerebbe tra una visita e l’altra.</p>`,
      scientist: `<p>Gli obiettivi principali della missione sono una mappa 3D delle galassie per la non gaussianità primordiale, la luce di fondo extragalattica e un censimento dei ghiacci interstellari [2, 3], con un telescopio da 20 cm e sei matrici HgCdTe 2K [4]. La risoluzione spettrale è <i>R</i> ≈ 35 a 41 in D1 a D4 e circa 110 a 130 in D5 e D6.</p>
<p>Per un blink il filtro è un fastidio quanto un dono. Dentro un rivelatore la lunghezza d’onda sul bersaglio cambia tra le esposizioni, quindi una mediana per passaggio mescola canali vicini e un cambio di luminosità tra passaggi è in parte un effetto di colore. Lo strumento riporta la lunghezza d’onda di ogni fotogramma e lascia a dopo la fotometria a lunghezza d’onda fissa. I campi dei nostri dati hanno da 36 a 96 esposizioni per rivelatore, in due a quattro passaggi.</p>`,
    },
    {
      h: "Come si fa il blink",
      hook: "Cinque passi dall’archivio della NASA all’immagine che si muove.",
      curious: `<p>Per il punto che scegli, la pagina chiede all’archivio della NASA ogni immagine SPHEREx che lo copre. Ritaglia un piccolo quadrato da ciascuna e toglie il bagliore della polvere del nostro Sistema Solare. Poi allinea tutti i quadrati con il nord in alto, così le stelle lontane cadono esattamente negli stessi punti. Mostrati in ordine, qualunque cosa si sia mossa cammina sullo schermo.</p>
<p>I cerchi mostrano dove altri telescopi dicono che ogni stella dovrebbe essere quel giorno, così puoi confrontare l’immagine.</p>`,
      student: `<p>I passi sono una query, un ritaglio e una riproiezione. Una query ADQL a IRSA elenca ogni esposizione la cui impronta contiene la posizione. Le posizioni di Gaia valgono per l’anno 2016, quindi ogni stella viene spostata con il suo moto proprio alla data di ogni esposizione prima del ritaglio. Il modello di luce zodiacale viene sottratto, i pixel segnalati vengono marcati e ogni ritaglio viene ricampionato su una griglia fissa con il nord in alto.</p>
<p>Puoi mostrare ogni esposizione, oppure una mediana per passaggio semestrale, che batte il rumore. La vista differenza sottrae la mediana di tutte le immagini, così ciò che non cambia mai diventa grigio e un oggetto in movimento lascia un punto chiaro dove si trova e uno scuro dove era. Le sorgenti di Gaia DR3 e CatWISE2020 sono disegnate sopra, ciascuna spostata alla data mostrata [5, 6].</p>`,
      scientist: `<p>Ogni ritaglio è campionato in modo bilineare su una griglia TAN fissa all’epoca media, 59 × 59 pixel da 6,15″. I passaggi si separano a intervalli oltre 60 giorni, e i campi polari sono limitati a 40 esposizioni per passaggio. Le immagini sono stirate fotogramma per fotogramma con arsinh, usando la mediana e 1,4826 MAD come cielo e rumore, e viaggiano come int16 con un errore di quantizzazione di 1/65534 dell’intervallo del fotogramma.</p>
<p>Limiti noti. Il moto proprio è lineare, senza parallasse. Non c’è adattamento della PSF prima della differenza, quindi le stelle luminose lasciano residui. La deriva della lunghezza d’onda dentro un rivelatore è riportata ma non corretta. I cinque oggetti sono forniti come file statici in tutti e sei i rivelatori, e ogni altra posizione esegue lo stesso codice dal vivo su un server locale. Ogni vista è un URL, quindi ogni figura di questa pagina si può riprodurre.</p>`,
    },
    {
      h: "Cinque stelle di prova, cinque domande",
      hook: "Cinque oggetti, cinque domande. Scegline uno e guardalo.",
      curious: `<p>La sfida ha dato cinque oggetti di prova, e ognuno fa una domanda allo strumento. La <b>Stella di Barnard</b> chiede se sa vedere il moto, e infatti cammina verso nord. <b>Epsilon Indi B</b>, due nane brune troppo vicine per distinguerle, chiede se sa vedere un moto minuscolo. <b>WISE 0855</b>, la nana bruna più fredda che si conosca, chiede se sa mostrare qualcosa di invisibile nella maggior parte dei colori, e compare solo nel rivelatore più rosso. <b>RW Aurigae</b> e <b>R Draconis</b> non si muovono affatto. Chiedono se lo strumento sa mostrare una stella che cambia luminosità.</p>`,
      student: `<p>La Stella di Barnard si muove di 1,7 px all’anno ed è luminosa in ogni rivelatore. Epsilon Indi B si muove di 0,8 px all’anno e si vede meglio in D5. WISE 0855 si muove di 1,3 px all’anno e compare solo in D6, vicino a 4,6 μm. RW Aurigae è una binaria giovane il cui disco a volte nasconde la stella. R Draconis è una variabile Mira con un periodo di 246 giorni e un intervallo visibile dalla magnitudine 6,7 alla 13,2. Scegli un rivelatore con i pulsanti da D1 a D6 e guarda quali oggetti compaiono e quali svaniscono.</p>`,
      scientist: `<p>Epsilon Indi B ha un RUWE di Gaia di 4,3, come ci si aspetta per una coppia non risolta [5, 10]. WISE 0855 è divisa in più voci di CatWISE2020 con moti vicini a 8″&nbsp;anno<sup>−1</sup>, perché si è spostata molto durante le somme di immagini WISE [6]. R Draconis sta vicino al polo nord dell’eclittica, quindi le sue visite si fondono in due o tre passaggi fino a 89 esposizioni. Sei mesi non sono un numero intero dei suoi periodi di 246 giorni, quindi ogni passaggio coglie una fase diversa. Il suo strato CatWISE è vuoto, perché IRSA non restituisce sorgenti CatWISE2020 in quel campo. La compagna di RW Aurigae a 1,45″ è elencata a parte in Gaia, con un RUWE di 16.</p>`,
    },
    {
      h: "Potrebbe trovare il Pianeta X?",
      hook: "Muovi tre cursori e scopri perché un pianeta nascosto è così difficile da trovare.",
      photoCap: "Uno zoom dai pianeti alla fascia di Kuiper, a Sedna e alle lunghe orbite degli oggetti lontani il cui allineamento ha fatto nascere l’idea del Pianeta Nove, con un’orbita proposta in arancione.",
      curious: `<p>Alcuni astronomi pensano che un pianeta qualche volta più pesante della Terra possa girare attorno al Sole molto oltre Nettuno, perché una manciata di lontani corpi ghiacciati ha orbite allineate in modo strano. Nessuno l’ha visto, e altri pensano che l’allineamento dipenda solo da dove i telescopi hanno guardato.</p>
<p>Se esiste, riflette solo la luce del Sole, e così lontano sarebbe debolissimo, più debole di quanto SPHEREx veda in una sola immagine. Quindi la risposta onesta è probabilmente non così. Lo stesso metodo trova davvero vicini del Sole, e dire con chiarezza cosa non possiamo vedere fa parte della scienza.</p>`,
      student: `<p>L’argomento si basa sugli oggetti transnettuniani estremi, piccoli corpi con orbite oltre circa 250 UA i cui orientamenti sono raggruppati [11, 12]. Un pianeta di circa 5 a 10 masse terrestri è stato proposto nel 2016 [12], affinato a 6,2 masse terrestri a circa 380 UA nel 2021 [14], e un fit recente lo mette più leggero e più vicino, circa 4,4 masse terrestri a 290 UA [15]. I gruppi che conducono le survey trovano il raggruppamento coerente con dove e quando hanno osservato [16, 17].</p>
<p>Il problema è la luce. La luce del Sole arriva al pianeta diluita dal quadrato della distanza e torna diluita di nuovo, quindi la luminosità cala con la quarta potenza della distanza. Per le dimensioni probabili si ottiene V ≈ 19 a 22, contro circa V ≈ 17 previsto per una esposizione SPHEREx. Il moto non è il problema, l’orbita della Terra fa oscillare un pianeta a 500 UA di centinaia di secondi d’arco all’anno. Il problema è la profondità.</p>`,
      scientist: `<p>In luce riflessa all’opposizione, <i>m</i> = <i>m</i><sub>⊙</sub> − 2,5 log<sub>10</sub>[<i>A</i><sub>g</sub> <i>R</i><sub>p</sub><sup>2</sup> / (<i>r</i><sup>2</sup> <i>Δ</i><sup>2</sup>)], con <i>m</i><sub>⊙</sub> = −26,74 in V e lunghezze in UA. Per <i>R</i><sub>p</sub> = 3 <i>R</i><sub>⊕</sub> e <i>A</i><sub>g</sub> = 0,3, <i>V</i> ≈ 18,8 a 300 UA e 21,0 a 500 UA. Il metano abbassa <i>A</i><sub>g</sub> nelle bande di SPHEREx, e l’emissione termica non aiuta, perché <i>T</i><sub>eq</sub> = 278,6 K / √<i>r</i> ≈ 12,5 K a 500 UA.</p>
<p>L’ampiezza della parallasse 206265″ / <i>r</i> è di 413″ a 500 UA, circa 67 pixel SPHEREx, quindi il pianeta non si cancella mai in una differenza e una ricerca deve spostare e sommare lungo orbite di prova in <i>r</i> e direzione. Il prodotto utile di una ricerca con SPHEREx è quindi la regione dello spazio dei parametri che esclude, misurata con pianeti sintetici iniettati, da confrontare con la posteriore di [15] e con le analisi del bias di selezione di [16, 17]. Questa pagina non tenta quella ricerca. Mostra perché l’angolo in alto a sinistra della tabella di luminosità, un pianeta grande vicino a 300 UA, è l’unico a portata.</p>`,
    },
  ],
  honest: {
    h: "Cosa è misurato e cosa no",
    items: [
      ["misurato", "Ogni pixel che vedi è una vera esposizione SPHEREx di NASA/IPAC IRSA, a cui è tolto solo il modello di luce zodiacale. Posizioni e moti degli oggetti sono misurati da Gaia DR3, o da WISE per WISE 0855."],
      ["previsto", "Il segno rosso e i cerchi dei cataloghi indicano dove quelle misure dicono che ogni oggetto dovrebbe trovarsi alla data dell’immagine. Quando la stella sta sul suo segno, previsione e immagine concordano."],
      ["stimato", "La profondità di SPHEREx di circa V 17 per esposizione è una previsione pubblicata, non una nostra misura. La luminosità del Pianeta X è un nostro calcolo per dimensioni e distanze ipotizzate."],
    ],
  },
  refsH: "Fonti",
  refsNote: "Ogni numero arXiv è stato controllato su arxiv.org il 14 novembre 2026.",
};

renderStory();
