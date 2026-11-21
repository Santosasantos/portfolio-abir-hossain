-- =====================================================================
-- v8: visitor insights + default email text (November 2026).
--   · visits             — one row per visit to the public page. No IP
--                          addresses are stored; a random browser id counts
--                          unique visitors. Anyone may insert, only admins read.
--   · visit_stats(days)  — aggregates for the admin "Visitors" page.
--   · site_settings.email_subject / email_body — pre-filled into the visitor's
--     email app when they press "Email Me" (they can still edit before sending).
-- Run after 0001–0007. Safe to re-run.
-- =====================================================================

alter table public.site_settings
  add column if not exists email_subject text not null default 'Inquiry from your portfolio website',
  add column if not exists email_body text not null default E'Dear {name},\n\nI came across your portfolio and am interested in your work. I would like to get in touch with you regarding [research collaboration / an opportunity / a question about your work].\n\n[A few lines about yourself and your message.]\n\nI look forward to hearing from you.\n\nBest regards,\n[Your name]\n[Your affiliation / organization]';

create table if not exists public.visits (
  id          bigint generated always as identity primary key,
  visitor_id  text not null check (char_length(visitor_id) between 8 and 64),
  path        text not null default '/' check (char_length(path) <= 300),
  referrer    text check (char_length(referrer) <= 500),
  country     text check (char_length(country) <= 64),
  city        text check (char_length(city) <= 120),
  device      text check (char_length(device) <= 20),
  browser     text check (char_length(browser) <= 40),
  os          text check (char_length(os) <= 40),
  created_at  timestamptz not null default now()
);
create index if not exists visits_created_at_idx on public.visits (created_at desc);

alter table public.visits enable row level security;
drop policy if exists "anyone can record a visit" on public.visits;
create policy "anyone can record a visit" on public.visits for insert to anon, authenticated with check (true);
drop policy if exists "admins read visits" on public.visits;
create policy "admins read visits" on public.visits for select to authenticated using (public.is_admin());
drop policy if exists "admins delete visits" on public.visits;
create policy "admins delete visits" on public.visits for delete to authenticated using (public.is_admin());
grant insert on public.visits to anon, authenticated;
grant select, delete on public.visits to authenticated;

-- Aggregates for the admin page. days = 0 means all time; days are cut in time zone tz. Admins only.
create or replace function public.visit_stats(days int default 30, tz text default 'Asia/Dhaka')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  since timestamptz := case when days > 0 then now() - make_interval(days => days) else '-infinity'::timestamptz end;
  today timestamptz := date_trunc('day', now() at time zone tz) at time zone tz;
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  with v as (select * from public.visits where created_at >= since)
  select jsonb_build_object(
    'visits',   (select count(*) from v),
    'visitors', (select count(distinct visitor_id) from v),
    'today',    (select count(*) from public.visits where created_at >= today),
    'all_time', (select count(*) from public.visits),
    'by_day',   coalesce((select jsonb_agg(jsonb_build_object('day', d, 'visits', n, 'visitors', u) order by d)
                 from (select (created_at at time zone tz)::date d, count(*) n, count(distinct visitor_id) u from v group by 1) s), '[]'::jsonb),
    'countries', coalesce((select jsonb_agg(jsonb_build_object('label', k, 'count', n) order by n desc)
                 from (select coalesce(nullif(country, ''), 'Unknown') k, count(*) n from v group by 1 order by 2 desc limit 10) s), '[]'::jsonb),
    'referrers', coalesce((select jsonb_agg(jsonb_build_object('label', k, 'count', n) order by n desc)
                 from (select coalesce(nullif(substring(referrer from '^[a-z]+://(?:www\.)?([^/:?#]+)'), ''), 'Direct') k, count(*) n
                       from v group by 1 order by 2 desc limit 10) s), '[]'::jsonb),
    'devices',  coalesce((select jsonb_agg(jsonb_build_object('label', k, 'count', n) order by n desc)
                 from (select coalesce(nullif(device, ''), 'Unknown') k, count(*) n from v group by 1 order by 2 desc) s), '[]'::jsonb),
    'browsers', coalesce((select jsonb_agg(jsonb_build_object('label', k, 'count', n) order by n desc)
                 from (select coalesce(nullif(browser, ''), 'Unknown') k, count(*) n from v group by 1 order by 2 desc limit 8) s), '[]'::jsonb)
  ) into result;
  return result;
end $$;

revoke all on function public.visit_stats(int, text) from public, anon;
grant execute on function public.visit_stats(int, text) to authenticated;
