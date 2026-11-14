// The story under the viewer, told three ways: for someone new to all of this, for a student,
// and for a scientist. Written from our own study notes and the papers listed in REFS, every
// arXiv number checked against arXiv on 14 November 2026. The reading level lives in the URL
// (?read=curious|student|scientist), like every other setting on the page.
"use strict";

const LAYERS = ["curious", "student", "scientist"];

// sources, cited in the text as [n]
const REFS = [
  { a: "Kuchner, M. J. et al. 2017", t: "The first brown dwarf discovered by the Backyard Worlds: Planet 9 citizen science project", j: "arXiv:1705.02919", u: "https://arxiv.org/abs/1705.02919" },
  { a: "Doré, O. et al. 2014", t: "Cosmology with the SPHEREx all-sky spectral survey", j: "arXiv:1412.4872", u: "https://arxiv.org/abs/1412.4872" },
  { a: "Bock, J. J. et al. 2025", t: "The SPHEREx satellite mission", j: "arXiv:2511.02985", u: "https://arxiv.org/abs/2511.02985" },
  { a: "Korngut, P. M. et al. 2026", t: "The SPHEREx instrument: calibration, testing and performance measurements", j: "arXiv:2603.29835", u: "https://arxiv.org/abs/2603.29835" },
  { a: "Gaia Collaboration, Vallenari, A. et al. 2022", t: "Gaia Data Release 3: summary of the content and survey properties", j: "arXiv:2208.00211", u: "https://arxiv.org/abs/2208.00211" },
  { a: "Marocco, F. et al. 2020", t: "The CatWISE2020 catalog", j: "arXiv:2012.13084", u: "https://arxiv.org/abs/2012.13084" },
  { a: "Kirkpatrick, J. D. et al. 2020", t: "The field substellar mass function based on the full-sky 20 pc census of 525 L, T, and Y dwarfs", j: "arXiv:2011.11616", u: "https://arxiv.org/abs/2011.11616" },
  { a: "Luhman, K. L. 2014", t: "Discovery of a ~250 K brown dwarf at 2 pc from the Sun", j: "ApJ 786, L18 (arXiv:1404.6501)", u: "https://arxiv.org/abs/1404.6501" },
  { a: "Scholz, R.-D. et al. 2002", t: "Epsilon Indi B: a new benchmark T dwarf", j: "A&A 398, L29 (arXiv:astro-ph/0212487)", u: "https://arxiv.org/abs/astro-ph/0212487" },
  { a: "McCaughrean, M. J. et al. 2003", t: "Epsilon Indi Ba/Bb: the nearest binary brown dwarf", j: "arXiv:astro-ph/0309256", u: "https://arxiv.org/abs/astro-ph/0309256" },
  { a: "Trujillo, C. A. and Sheppard, S. S. 2014", t: "A Sedna-like body with a perihelion of 80 astronomical units", j: "Nature 507, 471", u: "" },
  { a: "Batygin, K. and Brown, M. E. 2016", t: "Evidence for a distant giant planet in the Solar System", j: "arXiv:1601.05438", u: "https://arxiv.org/abs/1601.05438" },
  { a: "Batygin, K. et al. 2019", t: "The Planet Nine hypothesis", j: "arXiv:1902.10103", u: "https://arxiv.org/abs/1902.10103" },
  { a: "Brown, M. E. and Batygin, K. 2021", t: "The orbit of Planet Nine", j: "arXiv:2108.09868", u: "https://arxiv.org/abs/2108.09868" },
  { a: "Siraj, A. et al. 2024", t: "Orbit of a possible Planet X", j: "arXiv:2410.18170", u: "https://arxiv.org/abs/2410.18170" },
  { a: "Shankman, C. et al. 2017", t: "OSSOS VI. Striking biases in the detection of large semimajor axis trans-Neptunian objects", j: "arXiv:1706.05348", u: "https://arxiv.org/abs/1706.05348" },
  { a: "Napier, K. J. et al. 2021", t: "No evidence for orbital clustering in the extreme trans-Neptunian objects", j: "arXiv:2102.05601", u: "https://arxiv.org/abs/2102.05601" },
  { a: "Caselden, D. et al. 2018", t: "WiseView: visualizing motion and variability of faint WISE sources", j: "ascl:1806.004", u: "https://ascl.net/1806.004" },
];

const STORY = {
  en: {
    label: "the story", h: "Why blink the sky",
    tabsLabel: "read it as",
    tabs: { curious: "new to this", student: "student", scientist: "scientist" },
    lede: {
      curious: "No background needed. Six short chapters, from why the sky is not still to whether a hidden planet could be caught this way.",
      student: "For someone who knows what a magnitude and a spectrum are. The same six chapters, with the numbers that make them work.",
      scientist: "The same six chapters with the equations, the data products and the open questions, and a source for every claim.",
    },
    chapters: [
      {
        h: "The sky is not still",
        curious: `<p>Look up on a clear night and the stars seem fixed, as if painted on a dome. They are not. Every star is moving, but most are so far away that their motion would take a lifetime to notice.</p>
<p>A few are close enough that a careful camera sees them shift from one year to the next. The way to spot them is old and simple. In 1930 Clyde Tombaugh found Pluto by flipping between two photographs of the same sky taken six days apart. The stars stayed put and one faint dot jumped.</p>
<p>This page does the same thing with pictures from a NASA space telescope. Pick a star above and watch.</p>`,
        student: `<p>The instrument is a <b>blink comparator</b>, invented in 1904. Two aligned photographs of one field are shown in quick turns, so a fixed star stays still and a moving body jumps. Tombaugh found Pluto on plates of 23 and 29 January 1930. Since 2017 volunteers of Backyard Worlds: Planet 9 have done the same with WISE images and found thousands of brown dwarf candidates [1].</p>
<p>What they look for is <b>proper motion</b>, the angle a star moves across the sky per year. It grows with the star's speed across our line of sight and shrinks with its distance. The record holder, Barnard's Star, moves 10.4 arcsec per year. That sounds like a lot, but a SPHEREx pixel is 6.15 arcsec wide, so even this star moves less than one pixel between two visits six months apart.</p>`,
        scientist: `<p>Proper motion and tangential velocity are tied by <i>v</i><sub>t</sub> = 4.74 <i>μ d</i>, with <i>μ</i> in arcsec&nbsp;yr<sup>−1</sup>, <i>d</i> in pc and <i>v</i><sub>t</sub> in&nbsp;km&nbsp;s<sup>−1</sup>. For Barnard's Star, <i>μ</i> = 10.39″&nbsp;yr<sup>−1</sup> and <i>d</i> = 1.83 pc from Gaia DR3 [5], so <i>v</i><sub>t</sub> ≈ 90&nbsp;km&nbsp;s<sup>−1</sup>.</p>
<p>At 6.15″ per pixel that is 1.69 px&nbsp;yr<sup>−1</sup>, or 0.85 px between six-month passes. The motion is sub-pixel per step and the PSF is undersampled, so the tool blinks per-pass medians on one fixed TAN grid rather than single exposures, and a slow mover appears in the difference view as a dipole, the signature Backyard Worlds uses [1, 18]. Across 60 D1 exposures our measured position of Barnard's Star falls on average within a tenth of a pixel of the Gaia prediction moved to each date.</p>`,
      },
      {
        h: "Planets, stars and the things in between",
        curious: `<p>An <b>exoplanet</b> is a planet that circles a star other than the Sun. Astronomers have found thousands of them, mostly by watching their star dim a little or wobble. Very few have been photographed, because a planet is billions of times fainter than the star next to it.</p>
<p>Between planets and stars sits a strange family, the <b>brown dwarfs</b>. They are born like stars but are too light to keep shining, so they slowly cool for ever, glowing in infrared light like a fading ember. The coldest ones are as cold as a planet.</p>
<p>Some of the Sun's nearest neighbours are brown dwarfs that were only found in the last twenty years, because our eyes cannot see their light. An infrared telescope can.</p>`,
        student: `<p>Mass sorts these objects. Below about 13 Jupiter masses an object never burns deuterium, which is the usual line for a planet. Above about 75 to 80 Jupiter masses it burns hydrogen and is a star. In between are brown dwarfs, and close around Sun-like stars they are rare, the so-called brown dwarf desert.</p>
<p>Why the infrared? A body at temperature <i>T</i> emits most at a wavelength <i>λ</i><sub>max</sub> ≈ 2900 μm K / <i>T</i>. A 1000 K brown dwarf peaks near 3 μm, a 250 K one near 12 μm. Methane and water absorb parts of that light, so cold brown dwarfs are bright in a few infrared windows and almost dark elsewhere. Direct imaging of exoplanets works for the same reason, it favours young giant planets that still glow in the infrared, where the planet to star contrast is far kinder than the 10<sup>−10</sup> of an Earth in visible light.</p>`,
        scientist: `<p>The 20 pc census now holds 525 L, T and Y dwarfs [7]. Its coldest member, WISE 0855−0714, is a Y dwarf near 250 K at 2.3 pc [8], with <i>J</i> ≈ 25 but <i>W2</i> = 13.70 in AllWISE, so its flux sits almost entirely near 4.6 μm. Epsilon Indi Ba/Bb, a T1 + T6 pair at 3.7 pc, is a benchmark binary bound to a K5 V star [9, 10].</p>
<p>SPHEREx matters here because each detector sits behind a linear variable filter. Over its passes every point on the sky gets a 0.75 to 5 μm spectrum at <i>R</i> ≈ 35 to 130, which spans the CH<sub>4</sub>, H<sub>2</sub>O and CO bands that set brown dwarf temperatures [3, 4]. Motion and spectrum come from one data set, which is the case for a blink tool that keeps detectors apart.</p>`,
      },
      {
        h: "SPHEREx, a camera with 102 colours",
        curious: `<p>SPHEREx is a small NASA space telescope launched in March 2025. It circles the Earth and photographs the whole sky every six months in infrared light, which our eyes cannot see.</p>
<p>Its trick is that each picture is a rainbow. One edge of the picture sees one colour and the other edge another, so as the telescope sweeps the sky, every spot ends up seen in 102 colours. All the pictures are public, and this page uses them.</p>`,
        student: `<p>SPHEREx has six detectors, D1 to D6, together covering 0.75 to 5.0 μm. Each sits behind a <b>linear variable filter</b> whose wavelength changes across the detector, so one exposure is not one colour and a star seen twice is seen at two slightly different wavelengths. The pixels are 6.15 arcsec. The whole sky is covered about every six months, and much more often near the ecliptic poles.</p>
<p>Each Level 2 file holds the image, a model of the <b>zodiacal light</b> (sunlight scattered by dust in our own Solar System, which changes with the season), a map of flagged pixels, the noise per pixel and the wavelength of every pixel. The tool subtracts the zodiacal light first, otherwise the background would flicker between visits.</p>`,
        scientist: `<p>The mission's core goals are a 3D galaxy survey for primordial non-Gaussianity, the extragalactic background light and a census of interstellar ices [2, 3], from a 20 cm telescope with six 2K HgCdTe arrays [4]. Spectral resolution is <i>R</i> ≈ 35 to 41 in D1 to D4 and about 110 to 130 in D5 and D6.</p>
<p>For a blink the filter is a nuisance as much as a gift. Within one detector the wavelength at the target changes between exposures, so a per-pass median mixes neighbouring channels and a brightness change between passes is partly a colour effect. The tool reports the wavelength of every frame and leaves photometry at fixed wavelength for later. Fields in our data set have 36 to 96 exposures per detector, in two to four passes.</p>`,
      },
      {
        h: "How the blink is made",
        curious: `<p>For the spot you choose, the page asks NASA's archive for every SPHEREx picture that covers it. It cuts a small square out of each one and removes the glow of dust in our own Solar System. Then it lines all the squares up with north at the top, so the distant stars land on exactly the same places. Played in order, anything that moved walks across the screen.</p>
<p>The circles show where other telescopes say each star should be on that day, so you can check the picture against them.</p>`,
        student: `<p>The steps are a query, a cutout and a reprojection. An ADQL query to IRSA lists every exposure whose footprint holds the position. Gaia positions are for the year 2016, so each star is moved with its proper motion to the date of each exposure before the cutout is taken. The zodiacal light model is subtracted, flagged pixels are marked, and every cutout is resampled onto one fixed north-up grid.</p>
<p>You can show one median image per six-month pass, which beats the noise, or every exposure. The difference view subtracts the median of all images, so what never changes turns grey and a mover leaves a bright spot where it is and a dark one where it was. Gaia DR3 and CatWISE2020 sources are drawn on top, each moved to the date on screen [5, 6].</p>`,
        scientist: `<p>Each cutout is sampled bilinearly onto a TAN grid fixed at the mean epoch, 59 × 59 pixels of 6.15″. Passes are split at gaps over 60 days, and polar fields are capped at 40 exposures per pass. Images are stretched per frame with arsinh, using the median and 1.4826 MAD as sky and noise, and travel as int16 with a quantisation error of 1/65534 of the frame range.</p>
<p>Known limits. Proper motion is linear, with no parallax. There is no PSF matching before differencing, so bright stars leave residuals. The wavelength drift within a detector is reported but not corrected. The five targets ship as static files in all six detectors, and any other position runs the same code live on a local server. Every view is a URL, so every figure on this page can be reproduced.</p>`,
      },
      {
        h: "Five test stars, five questions",
        curious: `<p>The challenge gave five test objects, and each one asks the tool a question. <b>Barnard's Star</b> asks whether it can see motion, and it walks north. <b>Epsilon Indi B</b>, two brown dwarfs too close to tell apart, asks whether it can see a tiny motion. <b>WISE 0855</b>, the coldest brown dwarf known, asks whether it can show something invisible in most colours, and it only appears in the reddest detector. <b>RW Aurigae</b> and <b>R Draconis</b> do not move at all. They ask whether the tool can show a star that changes its brightness.</p>`,
        student: `<p>Barnard's Star moves 1.7 px per year and is bright in every detector. Epsilon Indi B moves 0.8 px per year and is best in D5. WISE 0855 moves 1.3 px per year and shows only in D6, near 4.6 μm. RW Aurigae is a young binary whose disk sometimes hides the star. R Draconis is a Mira variable with a period of 246 days and a visible range from magnitude 6.7 to 13.2. Choose a detector with the D1 to D6 buttons and watch which targets appear and fade.</p>`,
        scientist: `<p>Epsilon Indi B has a Gaia RUWE of 4.3, as expected for an unresolved pair [5, 10]. WISE 0855 is split into several CatWISE2020 entries with motions near 8″&nbsp;yr<sup>−1</sup>, because it moved so far across the WISE co-adds [6]. R Draconis lies near the north ecliptic pole, so its visits merge into two or three passes of up to 89 exposures. Six months is not a whole number of its 246-day periods, so each pass samples a different phase. Its CatWISE overlay is empty, because IRSA returns no CatWISE2020 sources in that field. RW Aurigae's companion at 1.45″ is listed separately in Gaia, with a RUWE of 16.</p>`,
      },
      {
        h: "Could it find Planet X?",
        curious: `<p>Some astronomers think a planet a few times heavier than the Earth may circle the Sun far beyond Neptune, because a handful of distant icy bodies have orbits that line up in an odd way. Nobody has seen it, and others think the lining up is just where telescopes happened to look.</p>
<p>If it is there, it only reflects sunlight, and so far from the Sun it would be very faint, fainter than SPHEREx can see in a single picture. So the honest answer is probably not this way. The same method does find real neighbours of the Sun, and saying clearly what we cannot see is part of doing science.</p>`,
        student: `<p>The case rests on the extreme trans-Neptunian objects, small bodies with orbits beyond about 250 AU whose orientations are clustered [11, 12]. A planet of about 5 to 10 Earth masses was proposed in 2016 [12], refined to 6.2 Earth masses at about 380 AU in 2021 [14], and a recent fit puts it lighter and closer, near 4.4 Earth masses and 290 AU [15]. Survey teams find the clustering consistent with where and when they looked [16, 17].</p>
<p>The trouble is light. Sunlight reaches the planet diluted by distance squared and comes back diluted again, so the brightness falls as distance to the fourth power. For likely sizes this gives V ≈ 19 to 22, against roughly V ≈ 17 forecast for one SPHEREx exposure. Motion is not the problem, the Earth's orbit swings a planet at 500 AU by hundreds of arcseconds a year. Depth is.</p>`,
        scientist: `<p>In reflected light at opposition, <i>m</i> = <i>m</i><sub>⊙</sub> − 2.5 log<sub>10</sub>[<i>A</i><sub>g</sub> <i>R</i><sub>p</sub><sup>2</sup> / (<i>r</i><sup>2</sup> <i>Δ</i><sup>2</sup>)], with <i>m</i><sub>⊙</sub> = −26.74 in V and lengths in AU. For <i>R</i><sub>p</sub> = 3 <i>R</i><sub>⊕</sub> and <i>A</i><sub>g</sub> = 0.3, <i>V</i> ≈ 18.8 at 300 AU and 21.0 at 500 AU. Methane lowers <i>A</i><sub>g</sub> in the SPHEREx bands, and thermal emission does not help, since <i>T</i><sub>eq</sub> = 278.6 K / √<i>r</i> ≈ 12.5 K at 500 AU.</p>
<p>The parallax amplitude 206265″ / <i>r</i> is 413″ at 500 AU, about 67 SPHEREx pixels, so the planet never cancels in a difference and a search has to shift and stack along trial orbits in <i>r</i> and direction. The useful product of a SPHEREx search is therefore the region of parameter space it excludes, measured with injected synthetic planets, set against the posterior of [15] and the selection-bias analyses of [16, 17]. This page does not attempt that search. It shows why the top-left corner of the brightness table, a large planet near 300 AU, is the only one within reach.</p>`,
      },
    ],
    honest: {
      h: "What is measured and what is not",
      items: [
        ["measured", "Every pixel you see is a real SPHEREx exposure from NASA/IPAC IRSA, with only the zodiacal light model removed. Positions and motions of the targets are measured by Gaia DR3, or by WISE for WISE 0855."],
        ["predicted", "The red marker and the catalogue circles are where those measurements say each object should be on the date of the image. When the star sits on its marker, the prediction and the image agree."],
        ["forecast", "The SPHEREx depth of about V 17 per exposure is a published forecast, not our measurement. The Planet X brightness is our own calculation for assumed sizes and distances."],
      ],
    },
    refsH: "Sources",
    refsNote: "Every arXiv number was checked on arxiv.org on 14 November 2026.",
  },
};

function storyCite(html) {
  return html.replace(/\[(\d+(?:,\s*\d+)*)\]/g, (m, g) =>
    `<span class="cite">[${g.split(/,\s*/).map((n) => `<a href="#ref-${n}">${n}</a>`).join(", ")}]</span>`);
}

function renderStory() {
  const box = document.getElementById("story");
  if (!box) return;
  const L = STORY[lang] || STORY.en;
  const read = LAYERS.includes(S.read) ? S.read : "curious";
  document.getElementById("storyLabel").textContent = L.label;
  document.getElementById("storyH").textContent = L.h;
  const tabs = document.getElementById("storyTabs");
  tabs.setAttribute("aria-label", L.tabsLabel);
  tabs.querySelectorAll("button").forEach((b) => {
    b.textContent = L.tabs[b.dataset.read];
    b.setAttribute("aria-selected", String(b.dataset.read === read));
    b.tabIndex = b.dataset.read === read ? 0 : -1;
  });
  document.getElementById("storyLede").textContent = L.lede[read];
  document.getElementById("storyChapters").innerHTML = L.chapters.map((c, i) =>
    `<article class="panel chapter"><div class="panel-bar"><span>${c.h}</span><span>${String(i + 1).padStart(2, "0")}</span></div>` +
    `<div class="chapter-body">${storyCite(c[read])}</div></article>`).join("");
  document.getElementById("storyHonest").innerHTML =
    `<div class="panel-bar"><span>${L.honest.h}</span><span></span></div><dl>` +
    L.honest.items.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("") + "</dl>";
  document.getElementById("refsH").textContent = L.refsH;
  document.getElementById("refsNote").textContent = L.refsNote;
  document.getElementById("refList").innerHTML = REFS.map((r, i) =>
    `<li id="ref-${i + 1}">${r.a}. <i>${r.t}</i>. ${r.u ? `<a href="${r.u}" rel="noopener">${r.j}</a>` : r.j}.</li>`).join("");
}

function setRead(r) {
  if (!LAYERS.includes(r) || r === S.read) return;
  S.read = r; writeURL(); renderStory();
}

document.querySelectorAll("#storyTabs button").forEach((b) => {
  b.addEventListener("click", () => setRead(b.dataset.read));
  b.addEventListener("keydown", (e) => {
    const i = LAYERS.indexOf(b.dataset.read);
    const j = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (j === null || j < 0 || j >= LAYERS.length) return;
    e.preventDefault(); e.stopPropagation(); setRead(LAYERS[j]);
    document.querySelector(`#storyTabs [data-read="${LAYERS[j]}"]`).focus();
  });
});
renderStory();
