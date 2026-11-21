import { Icon } from "@/lib/icons";
import { resolveUrl, withEmailTemplate, type Content } from "@/lib/content";
import { SmartLink } from "./ui";
import Portrait from "./Portrait";

export default function Hero({ c }: { c: Content }) {
  const s = c.settings;
  const interests = c.tags.filter((t) => t.grp === "interest");

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div>
          <h1 id="hero-title">{s.full_name}</h1>
          {s.headline && <p className="hero-role">{s.headline}</p>}

          <ul className="meta-list">
            {c.headerItems.filter((h) => h.in_hero).map((h) => (
              <li key={h.id}>
                <Icon name={h.icon} />
                {h.url ? <SmartLink href={withEmailTemplate(h.url, s)}>{h.label}</SmartLink> : h.label}
              </li>
            ))}
          </ul>

          {s.bio && <p className="hero-lead">{s.bio}</p>}
          {s.interests_line && <p className="hero-tagline">{s.interests_line}</p>}

          {interests.length > 0 && (
            <>
              <p className="eyebrow">{s.interests_label}</p>
              <ul className="chip-row" aria-label={s.interests_label}>
                {interests.map((t) => <li key={t.id} className={t.emphasis ? "chip" : "chip chip--neutral"}>{t.label}</li>)}
              </ul>
            </>
          )}

          {c.heroButtons.length > 0 && (
            <div className="btn-row">
              {c.heroButtons.map((b) => (
                <SmartLink key={b.id} href={resolveUrl(b.url, s) ?? "#"} download={b.is_download}
                           className={`btn ${b.variant === "primary" ? "btn--primary" : "btn--outline"}`}>
                  {b.icon && <Icon name={b.icon} />}{b.label}
                </SmartLink>
              ))}
            </div>
          )}

          <ul className="socials" aria-label="Profiles">
            {c.socialLinks.filter((l) => l.in_hero).map((l) => (
              <li key={l.id}><SmartLink className="social" href={l.url}><Icon name={l.icon} />{l.label}</SmartLink></li>
            ))}
          </ul>

          {c.featured.length > 0 && (
            <div className="card feature-panel">
              <p className="eyebrow">{s.featured_label}</p>
              <div className="feature-scroll" tabIndex={0} aria-label={s.featured_label}>
              <ul className="feature-list">
                {c.featured.map((f) => (
                  <li key={f.id} className="feature-item">
                    <p><strong>{f.title}:</strong> {f.summary}</p>
                    <div className="feature-meta">
                      {f.date_label && <span>Date: {f.date_label}</span>}
                      {f.links.map((l, i) => (
                        <span key={l.url + i} className="feature-link">
                          {i > 0 && <span aria-hidden="true">|</span>}
                          <SmartLink href={l.url}>{l.label}</SmartLink>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          )}
        </div>

        <aside className="portrait-wrap" aria-label="Profile photo and status">
          <Portrait src={s.photo_url} name={s.full_name} />
          {s.status_enabled && (
            <div className="status-card">
              <p className="eyebrow"><span className="pulse" aria-hidden="true" />{s.status_label}</p>
              <p><strong>{s.status_title}</strong>{s.status_body && <> — {s.status_body}</>}</p>
            </div>
          )}
          {c.heroStats.length > 0 && (
            <div className="stats hero-stats">
              {c.heroStats.map((st) => (
                <div key={st.id} className="stat">
                  <div className="stat-value">{st.value}{st.suffix && <small>{st.suffix}</small>}</div>
                  <div className="stat-label">{st.label}</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
