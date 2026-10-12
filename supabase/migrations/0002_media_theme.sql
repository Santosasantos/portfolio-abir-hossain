-- =====================================================================
-- v2: media galleries, presentation assets, structured artifacts,
--     Tools & Demos, certification details, editable theme.
-- Media items are stored as jsonb arrays:
--   [{ "kind": "image"|"video"|"slides"|"pdf",
--      "url": "...", "caption": "...", "role": "figure"|"presentation"|"thumbnail",
--      "name": "file.pptx", "size": 123456 }]
-- =====================================================================

-- ---------- Theme (site settings) ----------
alter table public.site_settings
  add column if not exists theme_bg            text not null default '#F7F4EC',
  add column if not exists theme_surface       text not null default '#FCFAF5',
  add column if not exists theme_surface_alt   text not null default '#F1EEE5',
  add column if not exists theme_ink           text not null default '#151513',
  add column if not exists theme_muted         text not null default '#595851',
  add column if not exists theme_border        text not null default '#DFD8CA',
  add column if not exists theme_accent        text not null default '#D67757',
  add column if not exists theme_dark          text not null default '#1C1B18',
  add column if not exists theme_chip_bg       text not null default '#EDF3EF',
  add column if not exists theme_chip_ink      text not null default '#234A40',
  add column if not exists theme_font          text not null default 'Source Serif 4',
  add column if not exists dark_mode_enabled   boolean not null default false,
  add column if not exists achievements_visible int not null default 5;

-- ---------- Publications ----------
alter table public.publications
  add column if not exists media jsonb not null default '[]'::jsonb,
  add column if not exists presentation_note text,
  add column if not exists code_url text,
  add column if not exists poster_url text,
  add column if not exists demo_url text;
alter table public.publications drop column if exists artifacts;

-- ---------- Projects ----------
alter table public.projects
  add column if not exists media jsonb not null default '[]'::jsonb;

-- ---------- Certifications ----------
alter table public.certifications
  add column if not exists description text,
  add column if not exists topics text[] not null default '{}';

-- ---------- Tools & Demos ----------
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'code',
  title text not null,
  description text not null default '',
  features text[] not null default '{}',
  tags text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  media jsonb not null default '[]'::jsonb,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

drop trigger if exists touch_tools on public.tools;
create trigger touch_tools before update on public.tools for each row execute function public.touch_updated_at();
alter table public.tools enable row level security;
drop policy if exists "admin write" on public.tools;
create policy "admin write" on public.tools for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "public read" on public.tools;
create policy "public read" on public.tools for select to anon, authenticated using (is_visible or public.is_admin());
create index if not exists tools_order_idx on public.tools (sort_order);

insert into public.sections (key, nav_label, title, subtitle, sort_order)
values ('tools', 'Tools & Demos', 'Research Software, Tools & Interactive Demos',
        'Research software, technical tools, and educational visualizations', 6)
on conflict (key) do nothing;
update public.sections set sort_order = 7 where key = 'honors' and sort_order = 6;
update public.sections set sort_order = 8 where key = 'contact' and sort_order = 7;

-- ---------- Storage: size and type limits for the media bucket ----------
update storage.buckets
set file_size_limit = 52428800, -- 50 MB
    allowed_mime_types = array[
      'image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/avif',
      'video/mp4','video/webm',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ]
where id = 'media';
