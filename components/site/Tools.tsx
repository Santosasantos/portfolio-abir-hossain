import type { Content, Section } from "@/lib/content";
import { CardMedia, LinkButtons } from "./Projects";
import { ChipList, SectionHead } from "./ui";

export default function Tools({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  if (!c.tools.length) return null;
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container">
        <SectionHead section={section} id={`${section.key}-title`} />
        <div className="grid grid--3">
          {c.tools.map((t) => (
            <article key={t.id} className="card card--tool">
              <CardMedia media={t.media} title={t.title} icon={t.icon} />
              <div className="card-body">
                <h3>{t.title}</h3>
                {t.description && <p className="card-desc">{t.description}</p>}
                {t.features.length > 0 && <ul className="feature-checks">{t.features.map((f, i) => <li key={i}>{f}</li>)}</ul>}
                <ChipList items={t.tags} label="Tags" />
                <LinkButtons links={t.links} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
