import { Icon } from "@/lib/icons";
import { linkIcon } from "@/lib/linkIcon";
import type { Content, Education, ScoreLine, Section, TestScore } from "@/lib/content";
import { ChipList, Paragraphs, SectionHead, SmartLink } from "./ui";

/** One school in the Education card: optional small logo beside the text, document links underneath. */
function EducationItem({ e }: { e: Education }) {
  const links = (e.links ?? []).filter((l) => l.url);
  return (
    <div className={`edu-item${e.logo_url ? " edu-item--logo" : ""}`}>
      {e.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="edu-logo" src={e.logo_url} alt={`${e.institution ?? e.degree} logo`} loading="lazy" />
      )}
      <div className="edu-text">
        <h4>{e.degree}</h4>
        {e.institution && <p>{e.institution}</p>}
        {(e.period || e.details) && <p className="mono">{[e.period, e.details].filter(Boolean).join(" · ")}</p>}
        {e.note && <p>{e.note}</p>}
        {links.length > 0 && (
          <p className="edu-docs">
            {links.map((l, i) => <SmartLink key={l.url + i} className="edu-doc" href={l.url}><Icon name={linkIcon(l)} />{l.label}</SmartLink>)}
          </p>
        )}
      </div>
    </div>
  );
}

/** Share of the bar to fill: (score − min) / (max − min), clamped to 0–100%. */
function fill(b: ScoreLine) {
  const score = Number(b.score);
  if (!b.max || !Number.isFinite(score)) return null;
  const min = b.min ?? 0;
  return Math.max(0, Math.min(1, (score - min) / (b.max - min)));
}

function ScoreCard({ t }: { t: TestScore }) {
  return (
    <article className="card score-card">
      <div className="score-head">
        <h4 className="score-test">{t.label}</h4>
        {t.note && <span className="score-date">{t.note}</span>}
      </div>
      <p className="score-total"><span className="score-big">{t.value}</span>{t.score_caption && <span className="score-caption">{t.score_caption}</span>}</p>
      {t.breakdown.length > 0 && (
        <dl className="score-bars">
          {t.breakdown.map((b) => {
            const f = fill(b);
            return (
              <div key={b.label} className="score-row">
                <dt>{b.label}</dt>
                <dd className="score-track" aria-hidden="true">{f != null && <span style={{ width: `${(f * 100).toFixed(1)}%` }} />}</dd>
                <dd className="score-value">{b.score}</dd>
              </div>
            );
          })}
        </dl>
      )}
      {t.report_url && (
        <SmartLink className="btn btn--sm score-report" href={t.report_url}><Icon name="file" />{t.report_label || "Download Test Report"}</SmartLink>
      )}
    </article>
  );
}

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
                <div className="edu-list">{c.education.map((e) => <EducationItem key={e.id} e={e} />)}</div>
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
            <div className="credentials-grid">{c.testScores.map((t) => <ScoreCard key={t.id} t={t} />)}</div>
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
