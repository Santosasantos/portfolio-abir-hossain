# Design System — "Paper & Clay" v2

Version 2.0 · October 10, 2026 · Clockosoft

v2 replaces the v1 "Radiograph" teal theme so the site matches the koshikdebanath.me reference (see `GAP_ANALYSIS.md`). All color and font values are editable in **Admin → Site settings → Theme**; the values below are the defaults.

## 1. Tokens

### Color (editable)
| Token | Default | Admin field | Use |
|---|---|---|---|
| `--bg` | `#F7F4EC` | Page background | Page |
| `--surface` | `#FCFAF5` | Card background | Cards, header |
| `--surface-alt` | `#F1EEE5` | Alternate section background | Alternating sections, icon tiles, presentation panel |
| `--ink` | `#151513` | Text | Body and headings |
| `--muted` | `#595851` | Secondary text | Metadata, captions |
| `--line` | `#DFD8CA` | Borders | Card borders, dividers |
| `--accent` | `#D67757` | Accent | 72×3 px pill under section titles, active nav underline, timeline dots, presentation rule, hover |
| `--dark` | `#1C1B18` | Dark | Primary buttons, "Published" badges, first action button; footer is derived from it |
| `--chip-bg` | `#EDF3EF` | Interest chip background | Sage chips |
| `--chip-ink` | `#234A40` | Interest chip text | Sage chips, feature checkmarks |

Derived (not editable): `--subtle`, `--chip-line`, `--btn-line`, `--footer-bg`, status-badge amber (`#F1E8D3` / `#6F5327` / `#DECDA8`).

Contrast (WCAG AA): ink on bg 17.6:1 · muted on bg 6.9:1 · chip-ink on chip-bg 9.1:1 · on-dark on dark 16.9:1 · badge ink on badge bg 6.0:1.

### Typography (editable)
One serif family for everything, as on the reference: Source Serif 4 (default), Newsreader, Fraunces, Lora, Merriweather, Libre Baskerville or EB Garamond. Monospace only inside BibTeX blocks.

| Role | Size | Weight |
|---|---|---|
| Name (H1) | clamp(2.4rem, 4.6vw, 3.35rem) | 400 |
| Section title | 1.375rem + clay pill underline | 400 |
| Category title (e.g. "Conference Publications") | clamp(1.45rem, 2.4vw, 1.8rem) | 400 |
| Card / paper title | 1.25–1.3rem | 400 / 600 for papers |
| Nav | 0.82rem uppercase, +0.04em | 600 |
| Body | 1rem / 1.65 | 400 |

### Shape & spacing
Pills (999px) for buttons, chips, badges and nav underlines · cards 8px radius with soft shadow · 4px spacing base (4 · 8 · 12 · 16 · 24 · 32 · 48 · 72) · section padding 72px.

### Dark mode
Off by default (the reference is light only). When **Offer a dark-mode toggle** is on, a moon button appears in the header and a fixed dark palette is used.

## 2. Components

| Component | Notes |
|---|---|
| Button | `.btn` outline on white; `.btn--primary` dark fill; `.btn--sm`; first publication action is dark-filled like the reference's IEEE button |
| Chip | Sage (`.chip`) for interests/keywords; neutral (`.chip--neutral`) for secondary items |
| Badge | Amber venue badge; dark "Published"; clay outline "Featured" |
| Section head | Centered title, 72×3 clay pill, muted subtitle |
| Publication card | Optional left figure column (30%) → dark venue badge + date → title → authors (owner bold) · venue · year · status → full venue (italic) → key-result tiles → inline "Abstract—" → beige keyword pills → Conference Presentation panel → outline icon actions (BibTeX opens below) → artifacts row |
| Figure | Bordered image, caption below, click to open a lightbox dialog (Esc or backdrop closes) |
| Conference Presentation panel | Navy `--info` left rule; slides embedded in the 16:9 slot when there is no video; 16:9 video (YouTube-nocookie, Vimeo, Drive, Loom or MP4) + slide-deck card (Download PPTX/PDF, "View here" Office/PDF viewer); note line underneath |
| Artifacts row | Code · Slides · Poster · Demo/Video — amber linked chip when available, grey "Not available" otherwise |
| Project / tool card | 16:9 screenshot, GIF or YouTube still (opens the video) header, icon tile when no media, icon + title, description, checklist (tools), tags, buttons |
| Award list | Year in clay, collapses after *n* items behind "Show more" |
| Footer | Dark, ivory text, three link columns, last-updated stamp |

## 3. Admin media editor

| Part | Behavior |
|---|---|
| Drop zone | Drag & drop or choose multiple files; images, GIF, MP4/WebM, PDF, PPTX up to 50 MB; uploads directly to Supabase Storage with a spinner per file |
| Add link | Paste YouTube / Vimeo / Google Drive / Loom or a direct image/PDF/PPTX/MP4 URL; kind is detected automatically; unclear links show a clear error |
| Item card | Live preview (image, embedded player, or file card with Preview), kind badge, caption, "Show as" (Figure / Card thumbnail / Presentation), move up/down, remove |
| List tables | Thumbnail strip per row (images, YouTube stills, PPT/PDF tiles) |
| Theme | Native color picker + hex field + swatch; invalid hex blocked before save |

## 4. Accessibility
Skip link · visible focus rings in the accent color · figures have captions as alt text · lightbox is a native `<dialog>` · video iframes titled · color never the only signal (artifacts say "Not available") · reduced-motion respected.
