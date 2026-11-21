import { Icon } from "@/lib/icons";
import { withEmailTemplate, type Content, type Section } from "@/lib/content";
import { SectionHead, SmartLink } from "./ui";

export default function Contact({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  const lines = c.headerItems.filter((h) => h.in_contact);
  const email = lines.find((l) => l.url?.startsWith("mailto:"));
  const socials = c.socialLinks.filter((l) => l.in_contact);
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container container--narrow">
        <SectionHead section={section} id={`${section.key}-title`} />
        <article className="card contact-card">
          {c.settings.contact_intro && <p>{c.settings.contact_intro}</p>}
          <div className="btn-row">
            {email?.url && <a className="btn btn--primary" href={withEmailTemplate(email.url, c.settings)}><Icon name="mail" />Email Me</a>}
            {socials.map((l) => (
              <SmartLink key={l.id} className="btn btn--outline" href={l.url}><Icon name={l.icon} />{l.label}</SmartLink>
            ))}
          </div>
          {lines.length > 0 && (
            <div className="contact-lines">
              {lines.map((l) => (l.url ? <SmartLink key={l.id} href={withEmailTemplate(l.url, c.settings)}>{l.label}</SmartLink> : <span key={l.id}>{l.label}</span>))}
            </div>
          )}
          {c.settings.contact_note && <p className="muted contact-note">{c.settings.contact_note}</p>}
        </article>
      </div>
    </section>
  );
}
