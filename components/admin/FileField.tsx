"use client";

import { useRef, useState } from "react";
import { detectKind } from "@/lib/media";
import { uploadMedia } from "@/lib/supabase/browser";
import MediaPreview from "./MediaPreview";

type Props = { id: string; name: string; initial: string; accept?: string; folder: string };

/** Single file (photo, CV) with upload, URL entry and a live preview. */
export default function FileField({ id, name, initial, accept, folder }: Props) {
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const kind = url ? detectKind(url) ?? (accept?.startsWith("image") ? "image" : "pdf") : null;

  async function onPick(file?: File) {
    if (!file) return;
    setBusy(true); setError(null);
    try { setUrl(await uploadMedia(file, folder)); }
    catch (e) { setError(`Upload failed: ${(e as Error).message}. Check your connection and that the “media” storage bucket exists.`); }
    finally { setBusy(false); }
  }

  return (
    <div className="file-field">
      {url && kind && (
        <div className={kind === "image" ? "file-field-thumb" : "file-field-doc"}>
          <MediaPreview item={{ kind, url }} />
        </div>
      )}
      <div className="media-link">
        <input id={id} type="text" name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… or /file.pdf" />
        <button type="button" className="btn btn--outline btn--sm" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </button>
        {url && <button type="button" className="btn btn--ghost btn--sm btn--danger" onClick={() => setUrl("")}>Remove</button>}
      </div>
      <input ref={input} type="file" accept={accept} hidden onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = ""; }} />
      {error && <p className="alert alert--error" role="alert">{error}</p>}
    </div>
  );
}
