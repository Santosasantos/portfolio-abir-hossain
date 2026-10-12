"use client";

import { useRef, useState } from "react";
import { Icon } from "@/lib/icons";
import { deckLabel, deckViewer, downloadUrl, driveFileId, formatBytes, toVideoEmbed, type MediaItem } from "@/lib/media";

/** Captioned figures that open full size in a lightbox. */
export function Figures({ items }: { items: MediaItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<MediaItem | null>(null);
  if (!items.length) return null;

  const open = (m: MediaItem) => { setActive(m); dialog.current?.showModal(); };
  return (
    <>
      {items.map((m, i) => (
        <figure key={m.url + i} className="figure">
          <button type="button" onClick={() => open(m)} aria-label={`Enlarge ${m.caption || "figure"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.caption || "Figure"} loading="lazy" />
          </button>
          {m.caption && <figcaption>{m.caption}</figcaption>}
        </figure>
      ))}
      <dialog ref={dialog} className="lightbox" onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}>
        {active && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.url} alt={active.caption || "Figure"} />
            {active.caption && <p>{active.caption}</p>}
          </>
        )}
        <form method="dialog"><button className="icon-btn lightbox-close" aria-label="Close">✕</button></form>
      </dialog>
    </>
  );
}

export function Video({ item }: { item: MediaItem }) {
  const embed = toVideoEmbed(item.url);
  return (
    <div className="video-frame">
      {embed
        ? <iframe src={embed} title={item.caption || "Video"} loading="lazy" allowFullScreen
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" />
        : <video src={item.url} controls preload="metadata" />}
    </div>
  );
}

/** Embedded, scrollable slide deck / PDF in a 16:9 frame (used when a paper has slides but no talk video). */
export function DeckFrame({ item, title }: { item: MediaItem; title?: string }) {
  const viewer = deckViewer(item);
  if (!viewer) return null;
  return (
    <div className="video-frame video-frame--deck">
      <iframe src={viewer} title={title || item.caption || "Presentation slides"} loading="lazy" allowFullScreen />
    </div>
  );
}

/** Slide deck / PDF card: icon, label, download, optional open-in-viewer, short note. */
export function SlidesCard({ item, inlineViewer = true }: { item: MediaItem; inlineViewer?: boolean }) {
  const [open, setOpen] = useState(false);
  const label = deckLabel(item);
  const viewer = deckViewer(item);
  const isDrive = Boolean(driveFileId(item.url));
  return (
    <div className="slides-card">
      <span className="doc-icon" aria-hidden="true"><Icon name="slides" /></span>
      <strong>Presentation Slides</strong>
      <a className="btn btn--outline btn--sm" href={downloadUrl(item)} {...(isDrive ? { target: "_blank", rel: "noopener noreferrer" } : { download: item.name || true })}>
        <Icon name="download" />Download {label}
      </a>
      <p className="muted">{item.caption || "Conference presentation slides"}{item.size ? ` · ${formatBytes(item.size)}` : ""}</p>
      {viewer && inlineViewer && (
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Hide preview" : "View here"}
        </button>
      )}
      {viewer && !inlineViewer && (
        <a className="btn btn--ghost btn--sm" href={isDrive ? item.url : viewer} target="_blank" rel="noopener noreferrer">Open full screen</a>
      )}
      {open && viewer && <iframe className="slides-viewer" src={viewer} title="Slides viewer" loading="lazy" />}
    </div>
  );
}
