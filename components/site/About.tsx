import { Icon } from "@/lib/icons";
import type { Content, Section } from "@/lib/content";
import { ChipList, Paragraphs, SectionHead } from "./ui";

export default function About({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container">
        <SectionHead section={section} id={`${section.key}-title`} />

        {(c.education.length > 0 || c.focusPoints.length > 0) && (
          <div className="grid grid--2">
            {c.education.length > 0 && (
              <article className="card">
                <span className="card-icon"><Icon name="cap" /></span>
                <h3>Education</h3>
                <div className="edu-list">
                  {c.education.map((e) => (
                    <div key={e.id} className="edu-item">
                      <h4>{e.degree}</h4>
                      {e.institution && <p>{e.institution}</p>}
                      {(e.period || e.details) && <p className="mono">{[e.period, e.details].filter(Boolean).join(" · ")}</p>}
                      {e.note && <p>{e.note}</p>}
                    </div>
                  ))}
                </div>
              </article>
            )}
            {c.focusPoints.length > 0 && (
              <article className="card">
                <span className="card-icon"><Icon name="bulb" /></span>
                <h3 className="card-title-gap">Research Focus</h3>
                <ul className="check-list">{c.focusPoints.map((f) => <li key={f.id}>{f.label}</li>)}</ul>
              </article>
            )}
          </div>
        )}

        {c.settings.background && (
          <article className="card prose block-gap">
            <h3 className="card-title-gap">Background</h3>
            <Paragraphs text={c.settings.background} />
          </article>
        )}

        {c.testScores.length > 0 && (
          <>
            <h3 className="subhead">Standardized Test Scores</h3>
            <div className="stats">
              {c.testScores.map((t) => (
                <div key={t.id} className="stat">
                  <div className="stat-value">{t.value}</div>
                  <div className="stat-label">{t.label}</div>
                  {t.note && <div className="stat-note">{t.note}</div>}
                </div>
              ))}
            </div>
          </>
        )}

        {c.skillGroups.length > 0 && (
          <>
            <h3 className="subhead">Technical Expertise</h3>
            <article className="card">
              <div className="skills">
                {c.skillGroups.map((g) => (
                  <div key={g.id}>
                    <h4>{g.title}</h4>
                    <ChipList items={g.items} highlighted={g.highlighted} label={g.title} />
                  </div>
                ))}
              </div>
            </article>
          </>
        )}
      </div>
    </section>
  );
}
