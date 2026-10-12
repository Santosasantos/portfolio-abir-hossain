import type { Content, Honor, Section } from "@/lib/content";
import { SectionHead, SmartLink } from "./ui";

function Rows({ items }: { items: Honor[] }) {
  return (
    <ul className="award-list">
      {items.map((h) => (
        <li key={h.id}>
          <span className="award-year">{h.year_label}</span>
          <div>
            <p><strong>{h.title}</strong></p>
            {h.subtitle && <p className="muted">{h.subtitle}</p>}
            {h.url && <SmartLink className="award-link" href={h.url}>Certificate</SmartLink>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function HonorList({ title, items, visible }: { title: string; items: Honor[]; visible?: number }) {
  if (!items.length) return null;
  const limit = visible && visible > 0 ? visible : items.length;
  const shown = items.slice(0, limit);
  const more = items.slice(limit);
  return (
    <article className="card">
      <h3 className="card-title-gap-lg">{title}</h3>
      <Rows items={shown} />
      {more.length > 0 && (
        <details className="show-more">
          <summary className="btn btn--sm">
            <span className="when-closed">Show {more.length} more</span><span className="when-open">Show less</span>
          </summary>
          <Rows items={more} />
        </details>
      )}
    </article>
  );
}

export default function Honors({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  const community = c.tags.filter((t) => t.grp === "community");
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container">
        <SectionHead section={section} id={`${section.key}-title`} />
        <div className="grid grid--2">
          <HonorList title="Awards" items={c.honors.filter((h) => h.grp === "award")} visible={c.settings.achievements_visible} />
          <div className="grid stack">
            <HonorList title="Leadership" items={c.honors.filter((h) => h.grp === "leadership")} />
            {community.length > 0 && (
              <article className="card">
                <h3 className="card-title-gap">Community</h3>
                <ul className="chip-row">
                  {community.map((t) => <li key={t.id} className={t.emphasis ? "chip" : "chip chip--neutral"}>{t.label}</li>)}
                </ul>
              </article>
            )}
          </div>
        </div>

        {c.certifications.length > 0 && (
          <article className="card block-gap">
            <h3 className="card-title-gap-lg">Certifications &amp; Professional Development</h3>
            <ul className="cert-list">
              {c.certifications.map((ce) => (
                <li key={ce.id} className="cert-item">
                  <div className="cert-head">
                    <strong>{ce.title}</strong>
                    <span className="muted">{[ce.issuer, ce.date_label].filter(Boolean).join(" · ")}</span>
                  </div>
                  {ce.description && <p>{ce.description}</p>}
                  {ce.topics.length > 0 && <ul>{ce.topics.map((t, i) => <li key={i}>{t}</li>)}</ul>}
                  {ce.url && <SmartLink className="btn btn--sm" href={ce.url}>View certificate</SmartLink>}
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </section>
  );
}
