-- =====================================================================
-- v5: project tabs (November 2026).
--   · projects.category — the tab a project is listed under on the site
--     (e.g. "Research", "Coursework"). Projects sharing a name share a tab;
--     an "All" tab is added automatically when there is more than one.
-- Run after 0001–0004. Safe to re-run.
-- =====================================================================

alter table public.projects
  add column if not exists category text not null default 'Projects';
