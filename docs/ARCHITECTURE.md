# Architecture

The goal is a portfolio that a non-developer can fully maintain, with as few moving parts as possible.

```
Browser ──► Next.js on Vercel ──► Supabase
             │                     ├─ Postgres (content tables + RLS)
             │                     ├─ Auth (admin login)
             │                     └─ Storage bucket "media" (photo, CV)
             │
             ├─ "/"       static page (ISR), read with the anon key
             └─ "/admin"  dynamic, session cookie, server actions write as the signed-in admin
```

## Decisions

| Decision | Why |
|---|---|
| One table per content block, no generic key/value store | Real columns keep the data typed, queryable and easy to edit in the Supabase dashboard too. |
| Admin panel generated from `lib/admin/resources.ts` | 19 editable resources share 3 pages (list / new / edit), 1 form component and 4 server actions. Adding content means a migration plus one config entry, not new UI code. |
| Server actions instead of an API layer | No REST routes to maintain; actions run on the server with the user's session. |
| Security in the database (RLS + `is_admin()`) | Even a bug in the app can't let a non-admin write: Postgres rejects it. The public site only ever sees `is_visible` rows. |
| Public page is static (ISR) with `revalidatePath("/")` on every save | Fast, cheap page loads; edits still appear immediately. |
| Anon-key client for the public page, cookie client only in `/admin` | Keeps the public page cacheable and free of session work. |
| No UI kit, no ORM, no state library | Five runtime dependencies in total. |
| Media stored as a `jsonb` list on each row | Figures, videos and slides travel with their publication/project/tool; no join tables, ordering is just array order. |
| Uploads go browser → Supabase Storage directly | No large request bodies through Next.js; Storage RLS only lets admins write to the `media` bucket. |
| Theme stored in `site_settings`, injected as CSS variables | The client can restyle the site without a deploy; the static page is regenerated on save. |

## Request flow for an edit

1. Admin submits a form → `saveRecord(resource, id)` server action.
2. The action checks the resource exists in the config and the user is in `admins`.
3. Each field is decoded by type (`lib/admin/fields.ts`); media files were already uploaded to Storage from the browser, so only their URLs arrive here.
4. Row is written with the user's session → RLS verifies `is_admin()`.
5. `revalidatePath("/")` regenerates the public page.

## Folder map

```
app/
  page.tsx                      public page; renders sections in DB order
  admin/login/                  sign-in
  admin/(panel)/                admin shell, dashboard, generic [resource] pages
components/site/                one component per public section
components/admin/               ResourceForm, MediaField, FileField, ColorField, MediaPreview, MediaThumbs
lib/content.ts                  types + one parallel fetch of all content
lib/media.ts                    media kinds, video embed URLs, Office viewer, validation
lib/admin/resources.ts          the admin config (fields, labels, columns)
lib/admin/fields.ts             form <-> DB value conversion and validation
lib/admin/actions.ts            save, delete, reorder, show/hide, sign in/out
lib/supabase/                   public and session clients
supabase/migrations/            schema, RLS, storage bucket
supabase/seed.sql               Abir's content
```
