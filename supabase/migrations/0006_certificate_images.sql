-- =====================================================================
-- v6: certificate cards (November 2026).
--   · certifications.image_url — photo or scan of the certificate, shown at
--     the top of its card. Optional: an issuer tile shows when empty.
-- Run after 0001–0005. Safe to re-run.
-- =====================================================================

alter table public.certifications
  add column if not exists image_url text;
