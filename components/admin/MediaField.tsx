"use client";

import { useRef, useState } from "react";
import { detectKind, driveFileId, type MediaItem, type MediaKind, type MediaRole } from "@/lib/media";
import { uploadMedia } from "@/lib/supabase/browser";
import MediaPreview from "./MediaPreview";

type Props = { name: string; label: string; initial: string; folder: string; hint?: string };

const KIND_LABEL: Record<MediaKind, string> = { image: "Image", video: "Video", slides: "Slides", pdf: "PDF" };
const ACCEPT = "image/*,video/mp4,video/webm,application/pdf,.pptx,.ppt";

function parse(initial: string): MediaItem[] {
  try { const v = JSON.parse(initial || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}

/**
 * Visual editor for a media list: upload or link images, GIFs, videos, PPTX and PDF,
 * see a live preview, caption them, choose where they appear and reorder them.
 */
export default function MediaField({ name, label, initial, folder, hint }: Props) {
  const [items, setItems] = useState<MediaItem[]>(() => parse(initial));
  const [uploading, setUploading] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const update = (i: number, patch: Partial<MediaItem>) => setItems((list) => list.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  const move = (i: number, d: -1 | 1) => setItems((list) => {
    const next = [...list]; const j = i + d;
    if (j < 0 || j >= next.length) return list;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  async function addFiles(files: FileList | File[]) {
    setError(null);
    for (const file of Array.from(files)) {
      const kind = detectKind(file.name, file.type);
      if (!kind) { setError(`${file.name}: unsupported file type. Use images, GIF, MP4/WebM, PDF or PPTX.`); continue; }
      if (file.size > 50 * 1024 * 1024) { setError(`${file.name} is larger than 50 MB.`); continue; }
      setUploading((u) => [...u, file.name]);
      try {
        const url = await uploadMedia(file, folder);
        setItems((list) => [...list, {
          kind, url, name: file.name, size: file.size,
          role: kind === "image" ? "figure" : "presentation", caption: "",
        }]);
      } catch (e) {
        setError(`Couldn't upload ${file.name}: ${(e as Error).message}. Check your connection and that the “media” storage bucket exists.`);
      } finally {
        setUploading((u) => u.filter((n) => n !== file.name));
      }
    }
  }

  function addLink() {
    const url = link.trim();
    if (!url) return;
    if (!/^(https?:\/\/|\/)/.test(url)) { setError("Links must start with https://"); return; }
    const kind = detectKind(url);
    if (!kind) { setError("Couldn't tell what this link is. Use a YouTube, Vimeo, Google Drive or Loom link, or a direct image/PDF/PPTX/MP4 URL."); return; }
    setError(null);
    setItems((list) => [...list, { kind, url, role: kind === "image" ? "figure" : "presentation", caption: "" }]);
    setLink("");
  }

  return (
    <div className="media-field">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <div
        className={`media-drop${dragging ? " is-dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
      >
        <p><strong>Drop files here</strong> or{" "}
          <button type="button" className="link-btn" onClick={() => fileInput.current?.click()}>choose files</button>
        </p>
        <p className="hint">Images, GIFs, MP4/WebM, PDF and PPTX · up to 50 MB each · Google Drive links: pick the right Type after adding</p>
        <input ref={fileInput} type="file" multiple accept={ACCEPT} hidden aria-label={`Upload ${label}`}
               onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }} />
      </div>

      <div className="media-link">
        <input type="text" inputMode="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste a YouTube, Vimeo, Drive or file link"
               aria-label="Media link" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }} />
        <button type="button" className="btn btn--outline btn--sm" onClick={addLink}>Add link</button>
      </div>

      {hint && <p className="hint">{hint}</p>}
      {error && <p className="alert alert--error" role="alert">{error}</p>}
      {uploading.length > 0 && <p className="media-uploading" role="status"><span className="spinner" aria-hidden="true" />Uploading {uploading.join(", ")}…</p>}

      {items.length > 0 && (
        <ol className="media-list">
          {items.map((m, i) => (
            <li key={m.url + i} className="media-item">
              <div className="media-item-preview"><MediaPreview item={m} /></div>
              <div className="media-item-body">
                <div className="media-item-top">
                  <span className={`kind-badge kind-badge--${m.kind}`}>{KIND_LABEL[m.kind]}</span>
                  <span className="media-item-url" title={m.url}>{m.name || m.url}</span>
                </div>
                <label className="visually-hidden" htmlFor={`${name}-cap-${i}`}>Caption</label>
                <input id={`${name}-cap-${i}`} type="text" placeholder="Caption (e.g. Model architecture)"
                       value={m.caption ?? ""} onChange={(e) => update(i, { caption: e.target.value })} />
                <div className="media-item-controls">
                  {driveFileId(m.url) && (
                    <label className="inline-select">
                      <span>Type</span>
                      <select value={m.kind} onChange={(e) => {
                        const kind = e.target.value as MediaKind;
                        update(i, { kind, role: kind === "image" ? "figure" : "presentation" });
                      }}>
                        {(Object.keys(KIND_LABEL) as MediaKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
                      </select>
                    </label>
                  )}
                  <label className="inline-select">
                    <span>Show as</span>
                    <select value={m.role ?? (m.kind === "image" ? "figure" : "presentation")}
                            onChange={(e) => update(i, { role: e.target.value as MediaRole })}>
                      {m.kind === "image" && <option value="figure">Figure</option>}
                      {m.kind === "image" && <option value="thumbnail">Card thumbnail</option>}
                      <option value="presentation">{m.kind === "image" ? "Presentation image" : "Presentation"}</option>
                    </select>
                  </label>
                  <div className="media-item-buttons">
                    <button type="button" className="icon-btn icon-btn--sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                    <button type="button" className="icon-btn icon-btn--sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
                    <button type="button" className="btn btn--ghost btn--sm btn--danger" onClick={() => setItems((l) => l.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
