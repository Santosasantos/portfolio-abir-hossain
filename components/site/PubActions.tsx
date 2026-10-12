"use client";

import { useId, useState } from "react";
import { Icon } from "@/lib/icons";
import { deckLabel, downloadUrl, driveFileId, type MediaItem } from "@/lib/media";
import type { LinkItem } from "@/lib/content";
import CopyButton from "./CopyButton";
import { SmartLink } from "./ui";

/** Icon that matches a publication link (IEEE/PDF, DOI, Scholar, code…). */
function linkIcon(l: LinkItem) {
  const t = `${l.label} ${l.url}`.toLowerCase();
  if (/github|code/.test(t)) return "github";
  if (/scholar/.test(t)) return "scholar";
  if (/youtu|video/.test(t)) return "youtube";
  if (/doi/.test(t)) return "link";
  if (/slide|ppt/.test(t)) return "slides";
  return "file";
}

/** Link buttons, auto-added Video / Slides buttons, and a BibTeX toggle whose block opens below the row. */
export default function PubActions({ links, video, slides, bibtex }: {
  links: LinkItem[]; video?: string; slides?: MediaItem; bibtex: string | null;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const isDrive = slides ? Boolean(driveFileId(slides.url)) : false;
  if (!links.length && !video && !slides && !bibtex) return null;

  return (
    <>
      <div className="pub-actions">
        {links.map((l, i) => (
          <SmartLink key={i} className="btn btn--sm" href={l.url}><Icon name={linkIcon(l)} />{l.label}</SmartLink>
        ))}
        {video && <SmartLink className="btn btn--sm" href={video}><Icon name="youtube" />Video Presentation</SmartLink>}
        {slides && (
          <a className="btn btn--sm" href={isDrive ? slides.url : downloadUrl(slides)}
             {...(isDrive ? { target: "_blank", rel: "noopener noreferrer" } : { download: slides.name || true })}>
            <Icon name="slides" />Slides ({deckLabel(slides)})
          </a>
        )}
        {bibtex && (
          <button type="button" className="btn btn--sm" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
            <Icon name="quote" />BibTeX
          </button>
        )}
      </div>
      {bibtex && open && (
        <div className="bibtex" id={id}>
          <pre><code>{bibtex}</code></pre>
          <CopyButton text={bibtex} />
        </div>
      )}
    </>
  );
}
