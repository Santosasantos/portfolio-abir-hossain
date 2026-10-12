-- =====================================================================
-- Portfolio CMS schema
-- Every block of the public site is a row in one of these tables.
-- Public: read visible rows. Admins (rows in public.admins): full CRUD.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Admins & helpers ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------- Singleton: site settings ----------
create table if not exists public.site_settings (
  id                 int primary key default 1 check (id = 1),
  full_name          text not null default '',
  headline           text not null default '',
  bio                text not null default '',
  interests_line     text not null default '',
  interests_label    text not null default 'Research interests',
  featured_label     text not null default 'Featured work',
  photo_url          text,
  cv_url             text,
  status_enabled     boolean not null default true,
  status_label       text not null default 'Open to opportunities',
  status_title       text not null default '',
  status_body        text not null default '',
  background         text not null default '',
  scholar_url        text,
  scholar_citations  int,
  scholar_h_index    int,
  contact_intro      text not null default '',
  contact_note       text not null default '',
  footer_blurb       text not null default '',
  last_updated       date not null default current_date,
  meta_title         text not null default '',
  meta_description   text not null default '',
  updated_at         timestamptz not null default now()
);

-- ---------- Sections (titles, nav labels, visibility, order) ----------
create table if not exists public.sections (
  key        text primary key,
  nav_label  text not null,
  title      text not null,
  subtitle   text not null default '',
  sort_order int  not null default 0,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------- Generic list tables ----------
-- Each has: id, sort_order, is_visible, created_at, updated_at.

create table if not exists public.header_items (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'globe',
  label text not null,
  url text,
  in_hero boolean not null default true,
  in_contact boolean not null default false,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'globe',
  label text not null,
  url text not null,
  in_hero boolean not null default true,
  in_contact boolean not null default false,
  in_footer boolean not null default true,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.hero_buttons (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon text,
  variant text not null default 'outline' check (variant in ('primary', 'outline')),
  is_download boolean not null default false,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.hero_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  suffix text,
  label text not null,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  grp text not null default 'interest' check (grp in ('interest', 'community')),
  label text not null,
  emphasis boolean not null default true,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.featured_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  date_label text,
  links jsonb not null default '[]'::jsonb,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null default '',
  period text,
  details text,
  note text,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.focus_points (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.test_scores (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  note text,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  items text[] not null default '{}',
  highlighted text[] not null default '{}',
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'conference'
    check (category in ('journal', 'conference', 'preprint', 'chapter', 'other')),
  anchor text,
  venue_badge text,
  status text not null default 'Published',
  date_label text,
  title text not null,
  authors text not null default '',
  highlight_author text,
  venue text,
  abstract text,
  keywords text[] not null default '{}',
  metrics jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  bibtex text,
  artifacts text[] not null default '{}',
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.research_areas (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'bulb',
  title text not null,
  description text not null default '',
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  grp text not null default 'professional' check (grp in ('professional', 'academic')),
  period text,
  title text not null,
  org text,
  bullets text[] not null default '{}',
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  featured boolean not null default false,
  badge text,
  year_label text,
  icon text not null default 'layers',
  title text not null,
  description text not null default '',
  tags text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  pipeline jsonb not null default '[]'::jsonb,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.honors (
  id uuid primary key default gen_random_uuid(),
  grp text not null default 'award' check (grp in ('award', 'leadership')),
  year_label text,
  title text not null,
  subtitle text,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  date_label text,
  url text,
  sort_order int not null default 0, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- ---------- Triggers + RLS (applied uniformly) ----------
do $$
declare
  t text;
  list_tables text[] := array[
    'header_items','social_links','hero_buttons','hero_stats','tags','featured_items',
    'education','focus_points','test_scores','skill_groups','publications',
    'research_areas','experiences','projects','honors','certifications'
  ];
begin
  foreach t in array list_tables || array['site_settings','sections'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$I', t);
    execute format('create trigger touch_%1$s before update on public.%1$I
                    for each row execute function public.touch_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated
                    using (public.is_admin()) with check (public.is_admin())', t);
    execute format('drop policy if exists "public read" on public.%I', t);
  end loop;

  foreach t in array list_tables loop
    execute format('create policy "public read" on public.%I for select to anon, authenticated
                    using (is_visible or public.is_admin())', t);
    execute format('create index if not exists %1$s_order_idx on public.%1$I (sort_order)', t);
  end loop;

  execute 'create policy "public read" on public.site_settings for select to anon, authenticated using (true)';
  execute 'create policy "public read" on public.sections for select to anon, authenticated
           using (is_visible or public.is_admin())';
end $$;

alter table public.admins enable row level security;
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select to authenticated using (user_id = auth.uid());

-- ---------- Storage: public "media" bucket for photo / CV / images ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
