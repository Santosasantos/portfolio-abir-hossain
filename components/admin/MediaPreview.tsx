"use client";

import { useState } from "react";
import { deckViewer, driveFileId, formatBytes, toVideoEmbed, type MediaItem } from "@/lib/media";

const isPublic = (url: string) => /^https:\/\//.test(url) && !/localhost|127\.0\.0\.1/.test(url);

/** Visual preview of one media item, used inside the admin editor. */
export default function MediaPreview({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(false);

  if (item.kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="mp-image" src={item.url} alt={item.caption ?? ""} loading="lazy" />;
  }

  if (item.kind === "video") {
    const embed = toVideoEmbed(item.url);
    return embed
      ? <iframe className="mp-video" src={embed} title={item.caption || "Video preview"} loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      : <video className="mp-video" src={item.url} controls preload="metadata" />;
  }

  // Slides (PPTX) and PDF
  const label = item.kind === "pdf" ? "PDF" : "Slides";
  const viewer = item.kind === "pdf" || driveFileId(item.url) || isPublic(item.url) ? deckViewer(item) : null;
  return (
    <div className="mp-doc">
      <div className="mp-doc-card">
        <span className={`mp-doc-icon mp-doc-icon--${item.kind}`} aria-hidden="true">{item.kind === "pdf" ? "PDF" : "PPT"}</span>
        <div className="mp-doc-meta">
          <strong>{item.name || item.url.split("/").pop()}</strong>
          <span className="muted">{label}{item.size ? ` · ${formatBytes(item.size)}` : ""}</span>
        </div>
        <div className="mp-doc-actions">
          {viewer && (
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              {open ? "Hide preview" : "Preview"}
            </button>
          )}
          <a className="btn btn--ghost btn--sm" href={item.url} target="_blank" rel="noopener noreferrer">Open</a>
        </div>
      </div>
      {open && viewer && <iframe className="mp-doc-frame" src={viewer} title={`${label} preview`} loading="lazy" />}
      {!viewer && <p className="hint">In-browser slide preview works once the file is on a public https address (after upload to Supabase).</p>}
    </div>
  );
}
