# Abir Hasan — Portfolio (Next.js + Supabase)

A one-page academic portfolio whose every word, link, image and section comes from Supabase, with a protected admin panel at `/admin` to create, edit, reorder, hide and delete all of it.

Built by Clockosoft. Design system: `docs/DESIGN_SYSTEM.md` · Architecture: `docs/ARCHITECTURE.md` · Reference comparison: `docs/GAP_ANALYSIS.md`.

## Stack

| Part | Choice |
|---|---|
| Framework | Next.js 15 (App Router, server components, server actions) |
| Data / auth / files | Supabase: Postgres + row-level security, email/password auth, `media` storage bucket |
| Styling | Plain CSS with design tokens (no UI library) |
| Runtime deps | `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr` — nothing else |

## Setup (about 10 minutes)

1. **Create a Supabase project** at supabase.com.
2. **Create the tables:** Supabase → SQL Editor → run `supabase/migrations/0001_schema.sql`, then `0002_media_theme.sql`, then `0003_honor_links.sql`, then `0004_profile_media.sql`, then `0005_project_tabs.sql`, then `0006_certificate_images.sql`, then `0007_flexible_links.sql`, then `0008_visitors_email.sql`, then `0009_documents_bucket.sql` (in that order). Upgrading an existing database: run the migrations newer than your version (v8–v12 → `0009`; v7 → `0008`, `0009`; v6 → `0007`–`0009`; v5 → `0006`–`0009`; v4 → `0005`–`0009`; v3 → `0004`–`0009`), then `seed.sql` only if you want to reset content. `0007` copies existing education certificate/thesis links and award links into the new link lists before removing the old columns, so it can also be run without re-seeding.
3. **Load Abir's content:** run `supabase/seed.sql` the same way. (Re-running it resets content to the original.)
4. **Create the admin login:** Supabase → Authentication → Users → *Add user* (email + password, tick *Auto confirm*).
5. **Make yourself admin:** in the SQL Editor run
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
6. **Configure the app:**
   ```bash
   cp .env.example .env.local      # paste Project URL + anon key from Supabase → Settings → API
   npm install
   npm run dev                     # http://localhost:3000  and  http://localhost:3000/admin
   ```
7. **Deploy:** push to GitHub and import into Vercel (or any Node host). Add the same three env vars. In Supabase → Authentication → URL Configuration, set the Site URL to your domain.

Optional hardening: Supabase → Authentication → Providers → Email → turn **off** "Allow new users to sign up", so only accounts you create can sign in. (Even if someone signs up, they can't edit anything unless they are in `admins`.)

## What the admin can edit

| Admin page | Controls |
|---|---|
| Site settings | **Navbar logo** (shown beside the name; initials appear when empty), name, headline, bio, photo upload, CV upload, status card, About background, Scholar stats, contact text, footer, SEO, **theme colors, typeface, dark-mode switch** |
| Header info | Every line under the name (institution, location, email, phone) — each with its own link, shown in hero and/or contact |
| Social links | Scholar, GitHub, LinkedIn, Kaggle, ResearchGate, ORCID, X… — choose hero / contact / footer placement |
| Hero buttons · Hero stats · Featured work · Interests & community | Everything in the hero |
| Education · Research focus · Test scores · Skills | About section. Education: **institution logo** and **Documents** — any number of buttons such as Certificate, Transcript, Thesis Book (hidden when empty); each row can **upload a file** (PDF, image, Word; up to 20 MB) to the public `documents` storage bucket or take a pasted link. Test scores: one row per test with overall score, caption, **sub-score bars** and a **test report link** |
| Publications · Research areas · Projects · Tools & demos | Projects have a **Tab** field (e.g. Research, Coursework): projects with the same tab name are grouped, and an *All* tab is added automatically when there is more than one. Publications get the same tabs from their **Category** (Journal, Conference, Book chapter, Preprint, Other). Research content: metrics, BibTeX, pipelines, **figures, talk videos, PPTX/PDF slides, screenshots and GIFs with live previews** |
| Experience · Awards & leadership · Certifications | Career content. Experience: **Section** (free text — Professional Experience, Academic & Research Experience, Industrial Training or any new heading), **organization logo** and **work links** (thesis book, industrial attachment report, slides; the title you type is the button text). Awards: **photo, description and any number of links** (Certificate, Award, News…; all optional). Certifications: **certificate image**, **tags** and link, shown as cards with a *Check the Certificate* button |
| Sections & menu | Rename, reorder or hide whole sections and their menu labels |

Every list supports add, edit, delete, move up/down and show/hide. Saving updates the public page immediately.

### Adding figures, videos and slides
Open a publication, project or tool and use the **Media** box:
- **Drop files** (images, GIFs, MP4/WebM, PDF, PPTX — up to 50 MB) or **paste a link** (YouTube, Vimeo, Google Drive, Loom, or a direct file URL).
- Each item shows a live preview. Add a caption and choose **Show as**: *Figure* (beside the paper), *Card thumbnail* (project/tool card image) or *Presentation* (Conference Presentation panel).
- Videos and slide decks automatically add **Video Presentation** and **Slides (PPTX)** buttons and light up the matching Artifacts chips.
- **Google Drive links** (slides, PDFs, videos): after adding, pick the right **Type** on the item (Video / Slides / PDF / Image). Drive slides and PDFs embed in the presentation panel and get a download button automatically; the file must be shared as "Anyone with the link".
- If a paper has slides but no talk video, the slides are embedded in the video slot so the panel still looks complete.
- PPTX "View here" previews use Microsoft's Office viewer, which needs the file at a public https address (true for uploads to Supabase).

### Visitors (Admin → Insights → Visitors)
- Every visit to the public page is recorded once per browser session: date, page, where the visitor came from (Google, LinkedIn…), country and city, device, browser and OS. No IP addresses are stored; a random id kept in the visitor's browser counts unique visitors.
- Country and city come from the hosting provider's location headers, so they appear on Vercel (or behind Cloudflare). Running locally they show as *Unknown*.
- Bots and crawlers are ignored, and your own browser stops being counted once you open the admin panel in it.
- Pick 7 days, 30 days, 90 days or all time. Times use Bangladesh time; set `ADMIN_TIME_ZONE` to change it.

### Default email (Site settings → Contact & footer)
- **Email subject** and **Email message** are pre-filled in the visitor's email app when they press *Email Me* (or any email link). They can edit before sending, or send it as is.
- `{name}` in the message becomes your name; `[brackets]` are prompts for the visitor. Leave the message empty to use the built-in professional text.

### Text formats in the forms
- **Tags** (keywords, skills): comma separated.
- **Lines** (experience highlights): one per line.
- **Links / key results / pipeline steps:** one per line as `Label | URL`, `99.16% | Dataset II`, `Data | 3,264 MRI images`.
- **Hero button URL `{cv}`** points to whichever CV is uploaded in Site settings.
- **Background text:** leave a blank line between paragraphs.
- **Test score breakdown:** one line per sub-score as `Label | Score | Max | Min`, e.g. `Listening | 7.5 | 9` or `Verbal | 139 | 170 | 130`. Max and Min set how full the bar is (Min defaults to 0); leave them out to show the value without a bar.
- **Education documents:** one row per button. Click *+ Certificate*, *+ Transcript*, *+ Thesis Book* or *+ Other document*, then **Upload** a file or paste a link. Files go to the `documents` bucket (created by `0009_documents_bucket.sql`; anyone can view, only admins can upload).
- **Award links:** one per line as `Award | https://…`. The icon is picked from the title.
- **Hidden placeholders:** the seed adds an SSC education entry and a Spring Rain *Industrial Training* entry switched off. Fill them in, then turn on *Visible*.
- **Experience work links:** one per line as `Thesis Book | https://…`, `Industrial Attachment Report | https://…`, `Presentation Slides | https://…`.
- **Logos and award photos:** upload a PNG/SVG/JPG. Anything left empty is simply not shown on the site.

## Adding a new kind of content

1. Add a table in a new migration (copy any list table; keep `sort_order` and `is_visible`, and add the table name to the RLS loop).
2. Add one entry to `lib/admin/resources.ts` — the admin list, forms, validation and actions are generated from it.
3. Render it in a component under `components/site/`.

## Built-in media

Figures and project photos that ship with the seed live in `public/media/` (served at `/media/...`). They come from Abir's own work: plots exported from his thesis notebooks (MRI samples, confusion matrix, CNN architecture, ROC curves, training curves) and photos from his GitHub repos. Anything added through the admin goes to Supabase Storage instead.

## Quality checks

```bash
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # TypeScript
npm run build      # production build
```

## Notes

- Edits made through `/admin` appear instantly. Edits made directly in the Supabase table editor appear within an hour (or immediately after a redeploy).
- **MIST conference paper:** Featured Work shows a short "details coming soon" entry, and a hidden placeholder row exists in Admin → Publications (anchor `pub-mist`). When Abir sends the details, fill in that row (title, authors, venue, abstract, keywords, slides/video), tick **Visible**, and edit the Featured Work entry to add a date and `Details | #pub-mist` link.
- Before launch, confirm with the client: a professional headshot (upload in Site settings), the thesis repository URL, whether to show the phone number (Header info → untick "Show in contact"), and any LinkedIn-only details.
