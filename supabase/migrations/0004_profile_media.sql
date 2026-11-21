-- =====================================================================
-- v4: logos and evidence links requested by the client (November 2026).
--   · navbar logo
--   · education: institution logo, certificate link, thesis book link
--   · test scores: per-test cards with sub-score bars and a report link
--   · experience: organization logo and work links (thesis, reports, slides)
--   · awards: photo, description, award link (url from 0003)
-- Run after 0001–0003. Safe to re-run.
-- =====================================================================

alter table public.site_settings
  add column if not exists logo_url text;

alter table public.education
  add column if not exists logo_url text,
  add column if not exists certificate_url text,
  add column if not exists thesis_url text;

-- One row per test (IELTS, GRE…): value = headline score, label = test name, note = test date.
alter table public.test_scores
  add column if not exists score_caption text not null default '',
  add column if not exists breakdown jsonb not null default '[]'::jsonb,   -- [{label, score, max, min?}]
  add column if not exists report_url text,
  add column if not exists report_label text not null default 'Download Test Report';

alter table public.experiences
  add column if not exists logo_url text,
  add column if not exists links jsonb not null default '[]'::jsonb;      -- [{label, url}]

alter table public.honors
  add column if not exists image_url text,
  add column if not exists description text;
