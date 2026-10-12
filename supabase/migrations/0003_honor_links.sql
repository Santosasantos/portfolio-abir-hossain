-- =====================================================================
-- v3: certificate / evidence link on awards & leadership rows.
-- Run after 0001 and 0002. Safe to re-run.
-- =====================================================================
alter table public.honors
  add column if not exists url text;
