"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Browser client (admin only) — used to upload media straight to Storage with the admin's session. */
export function browserClient() {
  client ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

/** Uploads a file to a public bucket ("media" by default, "documents" for education files) and returns its public URL. */
export async function uploadMedia(file: File, folder: string, bucket = "media") {
  const supabase = browserClient();
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+/, "");
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
