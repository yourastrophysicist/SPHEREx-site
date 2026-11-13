# SPHEREx-site

The `/SPHEREx` page of [yourastro.space](https://www.yourastro.space/SPHEREx/).

For now it is a coming-soon page that says what the project will be. It will be a small web tool
that plays the public SPHEREx images of any patch of sky like a flipbook, so anything that moved
between visits jumps out. It is being built at NASA Space Apps Milano, 14 and 15 November 2026,
and the page fills in after the hackathon.

The page is plain HTML and CSS in the same look as the main site, in English, Indonesian and
Italian, with an ASCII flipbook that shows the idea. It is served through GitHub Pages and shown
at `yourastro.space/SPHEREx` by a rewrite in the main site's `vercel.json`. The light and dark
button comes from `/theme.js` on the main site.

## prep/

The `prep/` folder holds the test notebook and two scripts I made on 10 November 2026 to check
that the SPHEREx data path works before the hackathon. It is study material, not the hackathon
project. See `prep/README.md` to run it and `prep/GUIDE.md` for a step-by-step walk through the notebook.
