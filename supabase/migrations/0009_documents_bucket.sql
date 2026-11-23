-- v13/v14: a public "documents" storage bucket for education certificates, transcripts and thesis books,
-- and experience files (industrial attachment reports, presentation slides).
-- Admin → Education → Documents and Admin → Experience → Work files upload here; visitors open the files from the public link.
-- Safe to re-run: running it again updates the size limit and file types of an existing bucket.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents', 'documents', true,
  52428800, -- 50 MB per file (slide decks can be large)
  array[
    'application/pdf',
    'image/png', 'image/jpeg', 'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "documents public read" on storage.objects;
create policy "documents public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'documents');

drop policy if exists "documents admin write" on storage.objects;
create policy "documents admin write" on storage.objects for all to authenticated
  using (bucket_id = 'documents' and public.is_admin())
  with check (bucket_id = 'documents' and public.is_admin());
