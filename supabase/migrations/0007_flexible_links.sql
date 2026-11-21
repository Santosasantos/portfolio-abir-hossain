-- =====================================================================
-- v7: client correction notes (November 21, 2026) — everything admin-driven.
--   · education.links       — any number of documents (Certificate, Transcript,
--                             Thesis Book…). Replaces certificate_url / thesis_url.
--   · experiences.grp       — free-text section name, so new sections such as
--                             "Industrial Training" can be added from the admin.
--   · honors.links          — any number of links per award (Certificate, Award,
--                             News…). Replaces url.
--   · certifications.tags   — project-style tag chips on certificate cards.
-- Existing values are copied over before the old columns are removed.
-- Run after 0001–0006. Safe to re-run.
-- =====================================================================

-- Education documents ------------------------------------------------------
alter table public.education add column if not exists links jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'education' and column_name = 'certificate_url') then
    update public.education set links =
      coalesce((select jsonb_agg(x) from (
        select jsonb_build_object('label', 'Certificate', 'url', certificate_url) as x where coalesce(certificate_url, '') <> ''
        union all
        select jsonb_build_object('label', 'Thesis Book', 'url', thesis_url) where coalesce(thesis_url, '') <> ''
      ) s), '[]'::jsonb)
    where links = '[]'::jsonb;
    alter table public.education drop column certificate_url, drop column thesis_url;
  end if;
end $$;

-- Experience sections --------------------------------------------------------
alter table public.experiences drop constraint if exists experiences_grp_check;
alter table public.experiences alter column grp set default 'Professional Experience';
update public.experiences set grp = 'Professional Experience' where grp = 'professional';
update public.experiences set grp = 'Academic & Research Experience' where grp = 'academic';

-- Award / leadership links -----------------------------------------------------
alter table public.honors add column if not exists links jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'honors' and column_name = 'url') then
    update public.honors set links = jsonb_build_array(jsonb_build_object('label', 'Certificate', 'url', url))
    where coalesce(url, '') <> '' and links = '[]'::jsonb;
    alter table public.honors drop column url;
  end if;
end $$;

-- Certificate tags ------------------------------------------------------------
alter table public.certifications add column if not exists tags text[] not null default '{}';
