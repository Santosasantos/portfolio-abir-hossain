import { Icon } from "@/lib/icons";
import type { Content, Section } from "@/lib/content";
import { SectionHead } from "./ui";

export default function Research({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  if (!c.researchAreas.length) return null;
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container">
        <SectionHead section={section} id={`${section.key}-title`} />
        <div className="grid grid--2">
          {c.researchAreas.map((a) => (
            <article key={a.id} className="card card--area">
              <span className="card-icon"><Icon name={a.icon} /></span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
