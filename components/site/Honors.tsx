import { Icon } from "@/lib/icons";
import { linkIcon } from "@/lib/linkIcon";
import type { Certification, Content, Honor, Section } from "@/lib/content";
import { ChipList, SectionHead, SmartLink } from "./ui";

/** Award card: photo (or award icon), title, event in accent, date, description, optional award link. */
function AwardCard({ h }: { h: Honor }) {
  return (
    <li className="award-card">
      <div className={`award-media${h.image_url ? "" : " award-media--icon"}`}>
        {h.image_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={h.image_url} alt={`${h.title} — ${h.subtitle ?? "award"}`} loading="lazy" />
          : <Icon name="award" />}
      </div>
      <div className="award-body">
        <h4 className="award-title">{h.title}</h4>
        {h.subtitle && <p className="award-event">{h.subtitle}</p>}
        {h.year_label && <p className="award-date">{h.year_label}</p>}
        {h.description && <p className="award-desc">{h.description}</p>}
        {(h.links ?? []).length > 0 && (
          <div className="award-links">
            {(h.links ?? []).map((l, i) => <SmartLink key={l.url + i} className="btn btn--sm" href={l.url}><Icon name={linkIcon(l)} />{l.label}</SmartLink>)}
          </div>
        )}
      </div>
    </li>
  );
}

function Awards({ items, visible }: { items: Honor[]; visible: number }) {
  if (!items.length) return null;
  const limit = visible > 0 ? visible : items.length;
  const more = items.slice(limit);
  return (
    <>
      <h3 className="subhead subhead--first">Awards</h3>
      <ul className="award-grid">{items.slice(0, limit).map((h) => <AwardCard key={h.id} h={h} />)}</ul>
      {more.length > 0 && (
        <details className="show-more show-more--center">
          <summary className="btn btn--sm">
            <span className="when-closed">Show {more.length} more achievements</span><span className="when-open">Show fewer</span>
          </summary>
          <ul className="award-grid">{more.map((h) => <AwardCard key={h.id} h={h} />)}</ul>
        </details>
      )}
    </>
  );
}

/** Certificate card: certificate image (or issuer tile), title, issuer, date, full-width link button. */
function CertCard({ ce }: { ce: Certification }) {
  return (
    <li className="cert-card">
      <div className={`cert-media${ce.image_url ? "" : " cert-media--empty"}`}>
        {ce.image_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={ce.image_url} alt={`${ce.title} certificate`} loading="lazy" />
          : <><Icon name="award" /><span>{ce.issuer || "Certificate"}</span></>}
      </div>
      <div className="cert-body">
        <h4 className="cert-title">{ce.title}</h4>
        {ce.issuer && <p className="cert-issuer">{ce.issuer}</p>}
        {ce.date_label && <p className="cert-date">{ce.date_label}</p>}
        {(ce.tags ?? []).length > 0 && <div className="cert-tags"><ChipList items={ce.tags ?? []} label={`${ce.title} topics`} /></div>}
        {ce.url && <SmartLink className="btn btn--sm cert-btn" href={ce.url}><Icon name="arrow" />Check the Certificate</SmartLink>}
      </div>
    </li>
  );
}

function Rows({ items }: { items: Honor[] }) {
  return (
    <ul className="award-list">
      {items.map((h) => (
        <li key={h.id}>
          <span className="award-year">{h.year_label}</span>
          <div>
            <p><strong>{h.title}</strong></p>
            {h.subtitle && <p className="muted">{h.subtitle}</p>}
            {(h.links ?? []).length > 0 && (
              <p className="row-links">{(h.links ?? []).map((l, i) => <SmartLink key={l.url + i} className="text-link" href={l.url}>{l.label}</SmartLink>)}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Honors({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  const community = c.tags.filter((t) => t.grp === "community");
  const leadership = c.honors.filter((h) => h.grp === "leadership");
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container">
        <SectionHead section={section} id={`${section.key}-title`} />

        <Awards items={c.honors.filter((h) => h.grp === "award")} visible={c.settings.achievements_visible} />

        {(leadership.length > 0 || community.length > 0) && (
          <div className="grid grid--2 block-gap">
            {leadership.length > 0 && (
              <article className="card">
                <h3 className="card-title-gap-lg">Leadership</h3>
                <Rows items={leadership} />
              </article>
            )}
            {community.length > 0 && (
              <article className="card">
                <h3 className="card-title-gap">Community</h3>
                <ul className="chip-row">
                  {community.map((t) => <li key={t.id} className={t.emphasis ? "chip" : "chip chip--neutral"}>{t.label}</li>)}
                </ul>
              </article>
            )}
          </div>
        )}

        {c.certifications.length > 0 && (
          <>
            <h3 className="subhead">Certifications &amp; Professional Development</h3>
            <ul className="cert-grid">{c.certifications.map((ce) => <CertCard key={ce.id} ce={ce} />)}</ul>
          </>
        )}
      </div>
    </section>
  );
}
