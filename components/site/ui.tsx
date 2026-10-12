import type { ReactNode } from "react";
import { isExternal, type Section } from "@/lib/content";

/** Anchor that opens external URLs in a new tab and leaves #anchors/mailto alone. */
export function SmartLink({ href, className, children, download }: {
  href: string; className?: string; children: ReactNode; download?: boolean;
}) {
  const ext = isExternal(href);
  return (
    <a href={href} className={className} download={download || undefined}
       {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

export function SectionHead({ section, id }: { section: Section; id: string }) {
  return (
    <header className="section-head">
      <h2 id={id}>{section.title}</h2>
      {section.subtitle && <p>{section.subtitle}</p>}
    </header>
  );
}

export function ChipList({ items, highlighted, label }: { items: string[]; highlighted?: string[]; label?: string }) {
  if (!items.length) return null;
  return (
    <ul className="chip-row" aria-label={label}>
      {items.map((t) => (
        <li key={t} className={!highlighted || highlighted.includes(t) ? "chip" : "chip chip--neutral"}>{t}</li>
      ))}
    </ul>
  );
}

/** Splits text on blank lines into paragraphs. */
export function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p.trim()}</p>)}</>;
}
