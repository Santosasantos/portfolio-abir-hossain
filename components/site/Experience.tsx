import type { Content, Experience as Exp, Section } from "@/lib/content";
import { SectionHead } from "./ui";

const GROUPS: { key: Exp["grp"]; title: string }[] = [
  { key: "professional", title: "Professional Experience" },
  { key: "academic", title: "Academic & Research Experience" },
];

export default function Experience({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container container--narrow">
        <SectionHead section={section} id={`${section.key}-title`} />
        {GROUPS.map((g) => {
          const items = c.experiences.filter((e) => e.grp === g.key);
          if (!items.length) return null;
          return (
            <div key={g.key} className="exp-group">
              <h3 className="subhead">{g.title}</h3>
              <ol className="timeline">
                {items.map((e) => (
                  <li key={e.id}>
                    {e.period && <p className="tl-date">{e.period}</p>}
                    <h4 className="tl-title">{e.title}</h4>
                    {e.org && <p className="tl-org">{e.org}</p>}
                    {e.bullets.length > 0 && (
                      <div className="tl-body"><ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul></div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
