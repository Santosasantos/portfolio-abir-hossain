"use client";

import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/supabase/browser";

type Row = { key: number; label: string; url: string; busy?: boolean; error?: string };
type Props = { id: string; name: string; initial: string; accept: string; bucket?: string; presets?: string[]; folder: string };

let nextKey = 1;
const parse = (s: string): Row[] =>
  s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((line) => {
    const i = line.indexOf("|");
    return { key: nextKey++, label: (i === -1 ? line : line.slice(0, i)).trim(), url: i === -1 ? "" : line.slice(i + 1).trim() };
  });
/** "Thesis_Book-final.pdf" → "Thesis Book final" when a file is uploaded into a row with no label. */
const labelFromFile = (name: string) => name.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
const fileName = (url: string) => decodeURIComponent(url.split("?")[0].split("/").pop() ?? "").replace(/^\d{10,}-/, "");

/**
 * Label + link rows where each link can be pasted or uploaded to Storage.
 * Saves in the same "Label | URL" per line format as the plain links textarea.
 */
export default function LinksField({ id, name, initial, accept, bucket, presets = [], folder }: Props) {
  const [rows, setRows] = useState<Row[]>(() => parse(initial));
  const inputs = useRef(new Map<number, HTMLInputElement>());

  const update = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const add = (label = "") => setRows((rs) => [...rs, { key: nextKey++, label, url: "" }]);
  const remove = (key: number) => setRows((rs) => rs.filter((r) => r.key !== key));
  const move = (i: number, d: number) => setRows((rs) => {
    const j = i + d;
    if (j < 0 || j >= rs.length) return rs;
    const out = [...rs];
    [out[i], out[j]] = [out[j], out[i]];
    return out;
  });

  async function onPick(row: Row, file?: File) {
    if (!file) return;
    update(row.key, { busy: true, error: undefined });
    try {
      const url = await uploadMedia(file, folder, bucket);
      setRows((rs) => rs.map((r) => (r.key === row.key ? { ...r, url, busy: false, label: r.label || labelFromFile(file.name) } : r)));
    } catch (e) {
      update(row.key, { busy: false, error: `Upload failed: ${(e as Error).message}. Check that the “${bucket ?? "media"}” storage bucket exists (run the latest migration) and the file is under the size limit.` });
    }
  }

  const value = rows.filter((r) => r.label.trim() || r.url.trim()).map((r) => `${r.label.trim()} | ${r.url.trim()}`).join("\n");
  const used = new Set(rows.map((r) => r.label.trim().toLowerCase()));
  const missing = presets.filter((p) => !used.has(p.toLowerCase()));

  return (
    <div className="links-field">
      <input type="hidden" name={name} value={value} />
      {rows.length > 0 && (
        <ul className="links-rows">
          {rows.map((r, i) => (
            <li key={r.key} className="links-row">
              <input id={i === 0 ? id : undefined} type="text" aria-label="Button label" placeholder="Label, e.g. Transcript" value={r.label}
                onChange={(e) => update(r.key, { label: e.target.value })} />
              <input type="text" aria-label={`${r.label || "Document"} link`} placeholder="https://… or upload a file" value={r.url}
                onChange={(e) => update(r.key, { url: e.target.value })} />
              <div className="links-row-buttons">
                <button type="button" className="btn btn--outline btn--sm" disabled={r.busy} onClick={() => inputs.current.get(r.key)?.click()}>
                  {r.busy ? "Uploading…" : r.url ? "Replace" : "Upload"}
                </button>
                {r.url && <a className="btn btn--ghost btn--sm" href={r.url} target="_blank" rel="noreferrer">Open</a>}
                <button type="button" className="btn btn--ghost btn--sm" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                <button type="button" className="btn btn--ghost btn--sm" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>↓</button>
                <button type="button" className="btn btn--ghost btn--sm btn--danger" onClick={() => remove(r.key)}>Remove</button>
              </div>
              <input ref={(el) => { if (el) inputs.current.set(r.key, el); else inputs.current.delete(r.key); }} type="file" accept={accept} hidden
                onChange={(e) => { onPick(r, e.target.files?.[0]); e.target.value = ""; }} />
              {r.url && !r.busy && r.url.includes("/storage/v1/object/public/") && <p className="links-row-file">Uploaded file: {fileName(r.url)}</p>}
              {r.error && <p className="alert alert--error links-row-file" role="alert">{r.error}</p>}
            </li>
          ))}
        </ul>
      )}
      <div className="links-add">
        {missing.map((p) => <button key={p} type="button" className="btn btn--outline btn--sm" onClick={() => add(p)}>+ {p}</button>)}
        <button type="button" className="btn btn--outline btn--sm" onClick={() => add()}>+ Other document</button>
      </div>
    </div>
  );
}
