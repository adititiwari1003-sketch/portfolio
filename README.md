# Aditi Tiwari — portfolio (2026 redesign)

Static site, no build step, no dependencies. A small hash-routed single-page
app: one shared engine (router, WebGL "glass" hero shader, scroll reveals,
custom cursor, magnetic buttons) renders all 13 pages from one data model.

## Pages
- `index.html` — Home
- `work.html` — Work index (all 8 case studies)
- `how-i-work.html` — Process
- `about.html` — About
- `contact.html` — Contact (mad-libs form)
- `case-studies/{aimate,zenfire,goal,system}.html` — the 4 flagship case studies
- `projects/{onedigital,clara,invictus,aif}.html` — the 4 supporting projects

Each of the above is a thin shell that sets the initial route (`#/case/aimate`
etc.) and loads the same engine — in-app navigation never reloads the page,
it just changes the hash and re-renders, with a page-transition wipe
animation. Visiting any of these URLs directly also works.

## Structure
- `assets/css/app.css` — fonts (self-hosted Geist + Instrument Serif
  woff2), resets, keyframes; per-element hover/focus styles are generated
  at runtime (see `hv()`/`fc()` in `app.js`) rather than hand-written, since
  the design specifies them inline per element.
- `assets/js/data.js` — all copy and content constants, plus `IMAGES` (maps
  an image-slot id to a real asset path; anything not listed there renders
  as an honest "pending" placeholder).
- `assets/js/app.js` — state + the data→view-model transforms (flagship
  panel states, case-study step sequencing, hire selector, etc).
- `assets/js/screens.js` — HTML builders for each screen plus the shared
  chrome (header, nav, cursor, page-transition overlay, footer).
- `assets/js/engine.js` — router, click/hover delegation, scroll reveals,
  the WebGL hero shader, and the physics (magnetic buttons, tilt/glare,
  marquee, the "what I believe" chip cloud).
- `assets/fonts/`, `assets/img/` — self-hosted fonts and imagery.

## Run locally
```
npx serve .
```
(or open `index.html` directly — no build step, no server-side routing
needed since navigation is hash-based)

## Deploy
- **Netlify (drag & drop)** — netlify.com/drop, drop this folder.
- **Vercel** — `npx vercel` in this folder, or import the repo with framework "Other".
- **GitHub Pages** — push to a repo, Settings → Pages → deploy from branch (root).
- **Any host / cPanel** — upload the contents to the web root.

## Before going live
- Several image slots (About portrait, the "How I work with AI" screen
  recording, and most in-case-study figures) show a "screens pending"
  panel — add the real exports to `assets/img/` and register them in
  `assets/js/data.js`'s `IMAGES` map.
- Add a real `Aditi-Tiwari-CV.pdf` at the repo root — the "Download CV" /
  "Résumé" links point to it but no file exists yet.

## Source
- `project/` and `chats/` hold the *previous* (Organic-system) Claude
  Design handoff this repo was originally implemented from — superseded by
  this redesign and kept only for history.
