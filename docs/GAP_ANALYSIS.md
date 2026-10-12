# Gap analysis: koshikdebanath.me (reference) vs. Abir Hasan build v1

Reviewed October 10, 2026 by inspecting the live reference in Chrome (computed styles, CSS variables, DOM structure, embedded media) and comparing against build v1.

## 1. Theme

| Area | Reference | Build v1 | Gap | Resolution (v2) |
|---|---|---|---|---|
| Background / surfaces | Warm paper `#F7F4EC`, card `#FCFAF5`, strong surface `#F1EEE5`, border `#DFD8CA` | Similar paper but cooler alt sections `#EFEBE1` | Minor drift | Adopt reference tokens exactly |
| Accent | Clay `#D67757` used for the 72×3 px pill under every section title | Clinical teal `#1C6E74` everywhere (links, rules, chips, active nav) | **Major** — different visual identity | Clay accent for section rules and highlights; teal removed |
| Primary / dark | Near-black `#1C1B18` for primary buttons, "Published" badges and the footer | Ink buttons, light footer | **Major** — reference footer is dark | Dark footer, dark "Published" badges |
| Interest chips | Sage chips: `#EDF3EF` fill, `#234A40` text, `#D6E1DC` border | Teal-tinted chips, no border | Moderate | Sage chip tokens |
| Outline buttons | White fill, `#CFC6B7` border, pill | Surface fill, line border | Minor | Match |
| Typography | One serif family for everything, including nav, buttons and chips; H1 ≈ 54 px regular | Serif display + Inter UI + JetBrains Mono | **Major** — sans UI text reads as a different site | Single serif family site-wide; mono only inside BibTeX |
| Dark mode | None (always light) | Light/dark toggle | Divergent | Light by default; dark mode becomes an admin switch, off by default |
| Theming control | Hard-coded CSS | Hard-coded CSS | Not maintainable by the client | **New:** Theme panel in Site settings (colors, font, dark-mode switch) |

## 2. Information representation

| Element | Reference | Build v1 | Gap | Resolution (v2) |
|---|---|---|---|---|
| Publication figures | 1–2 figures per paper (architecture diagram, model comparison) in a left column with captions | Text only | **Major** | `media` gallery per publication; images/GIFs render as captioned figures with click-to-enlarge |
| Conference presentation | Embedded YouTube talk + slides card with "Download PPTX" and "Presented at …" note | None | **Major** | Presentation panel: video embed + slide-deck card (download + in-browser preview) + note |
| Publication actions | IEEE · DOI · BibTeX · Video Presentation · Slides (PPTX) | IEEE · DOI · Scholar · BibTeX | Moderate | Video and Slides buttons are generated automatically from attached media |
| Artifacts row | Code / Slides / Poster / Demo chips — linked and highlighted when available, greyed "not available" otherwise | Free-text chips, never linked | Moderate | Structured artifacts: code, poster and demo URLs plus attached slides/video, rendered linked or greyed |
| Project cards | Screenshot or animated GIF thumbnail on every card | Icon only | **Major** | Project media; first image becomes the thumbnail; featured project shows a gallery |
| Tools & Demos section | Thumbnail, feature checklist, tags, Try Demo / Watch Demo / Source buttons | Missing | **Major** | New `tools` content type and section (shown only when it has items) |
| Certifications | Issuer, date, description, key topics, View Certificate | Title, issuer, date | Moderate | Description + key topics + certificate link |
| Achievements | Long list collapsed behind "Show more achievements" | Always fully expanded | Minor | Collapses after a configurable count |

## 3. Admin panel

| Need | Build v1 | Gap | Resolution (v2) |
|---|---|---|---|
| Add images / GIFs with a visual preview | Photo field only, uploaded through the form, preview only after save | **Major** | Media editor: drag-and-drop or pick files; upload straight to Supabase Storage with progress; instant thumbnail |
| Add a video by link with preview | Not possible | **Major** | Paste YouTube, Vimeo, Google Drive or MP4 link → live embedded player in the form |
| Add PPTX / PDF slides with preview | Not possible | **Major** | Upload PPTX/PDF → file card with size, download and an in-place preview (Office Online viewer for PPTX, native viewer for PDF) |
| Order, caption and remove media | — | — | Per-item caption, role (figure / presentation / thumbnail), move up/down, remove |
| Media visible in list tables | — | — | Thumbnail strip + counts in list rows |
| Edit theme without code | — | **Major** | Color pickers with live swatches, font picker, dark-mode switch |

## 4. Content note

Abir does not currently have talk recordings, slide decks or paper figures online, so v2 ships with the capability empty for him. The seed leaves `media` empty rather than inventing material; adding his ICCIT slides or figures takes one upload each in the admin panel.

## 5. v3 pass (October 12, 2026): reference publication/project media

Compared the build against koshikdebanath.me again, focused on the publication card the client flagged (figure column, venue badge + year, owner-bold authors, abstract, keyword pills, Conference Presentation panel, link buttons, Artifacts row) and on project thumbnails.

| Gap found in v2 | v3 change |
|---|---|
| No figures, slides or video on any of Abir's papers, so the media layout never appeared | Real figures from his thesis notebooks (MRI samples, EfficientNetB0 confusion matrix, custom-CNN architecture, ROC curves) and his ICCIT slides (Google Drive PDFs from his portfolio) attached to both papers |
| Abstract hidden behind a toggle | Shown inline as "Abstract—…" like the reference |
| Authors, venue, year and status split across badges and lines | One line: **A. Hasan**, co-authors · IEEE ICCIT · 2023 · Status: Published; dark venue badge with date on the right |
| Keywords used the sage interest chips | Beige bold keyword pills (reference style); keywords now match his papers' IEEE index terms |
| Presentation panel had no fallback without a video and no slide-deck card styling | Navy rule panel, slide deck embedded in the video slot when there is no talk video, "Presentation Slides" card with Download, note line with icons |
| First action button forced dark; BibTeX on its own row | Outline icon buttons (IEEE Xplore, DOI, Slides, BibTeX) in one row; BibTeX block opens below the row |
| Artifacts: Code always "Not available" | Code linked to the thesis repository; Slides linked to the deck |
| Google Drive links treated as videos only | Drive PDFs/decks: embedded preview + direct download; admin can set the Type of a Drive link |
| Project cards without media showed no header, so the grid looked uneven | Photos/screenshots from his repos (6-bit CPU circuit, line-follower robot), YouTube still for the COVID tracker demo, icon tile fallback for the rest |
| Tools & Demos section empty (hidden) but still linked in the footer | Section filled with his Kaggle notebooks and dataset; footer hides it whenever it is empty |
| Awards had no evidence links | Optional certificate link per award (migration 0003), filled from his portfolio's Drive certificates |
| Ongoing CT kidney work and the new MIST paper missing | Kidney CT study added under "Preprints & Work in Progress"; MIST paper added to Featured Work with a hidden placeholder publication waiting for details |
| No favicon (404 on every load) | `app/icon.svg` monogram |
| `npm run lint` had no ESLint setup | ESLint 8 + `next/core-web-vitals` config added |
