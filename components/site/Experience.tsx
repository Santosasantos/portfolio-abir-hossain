import { Icon } from "@/lib/icons";
import type { Content, Section } from "@/lib/content";
import { linkIcon } from "@/lib/linkIcon";
import { SectionHead, SmartLink } from "./ui";

/** Section names are free text in the admin; the two original keys are kept readable for older data. */
const LEGACY: Record<string, string> = { professional: "Professional Experience", academic: "Academic & Research Experience" };
const sectionName = (grp: string) => LEGACY[grp?.trim()] ?? (grp?.trim() || "Experience");

export default function Experience({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  // Sections follow the admin's list order: a section appears where its first entry is.
  const groups = [...new Set(c.experiences.map((e) => sectionName(e.grp)))];
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container container--narrow">
        <SectionHead section={section} id={`${section.key}-title`} />
        {groups.map((g) => {
          const items = c.experiences.filter((e) => sectionName(e.grp) === g);
          return (
            <div key={g} className="exp-group">
              <h3 className="subhead">{g}</h3>
              <ol className="timeline">
                {items.map((e) => (
                  <li key={e.id}>
                    {e.period && <p className="tl-date">{e.period}</p>}
                    <div className={`tl-head${e.logo_url ? " tl-head--logo" : ""}`}>
                      {e.logo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="org-logo" src={e.logo_url} alt={`${(e.org ?? e.title).split("·")[0].trim()} logo`} loading="lazy" />
                      )}
                      <div>
                        <h4 className="tl-title">{e.title}</h4>
                        {e.org && <p className="tl-org">{e.org}</p>}
                      </div>
                    </div>
                    {e.bullets.length > 0 && (
                      <div className="tl-body"><ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul></div>
                    )}
                    {e.links.length > 0 && (
                      <div className="tl-links" aria-label={`${e.title} work`}>
                        {e.links.map((l, i) => (
                          <SmartLink key={l.url + i} className="btn btn--sm" href={l.url}><Icon name={linkIcon(l)} />{l.label}</SmartLink>
                        ))}
                      </div>
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
