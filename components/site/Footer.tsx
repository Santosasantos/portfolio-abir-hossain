import type { Content } from "@/lib/content";
import { SmartLink } from "./ui";

const RESEARCH_KEYS = ["publications", "research", "projects"];

export default function Footer({ c }: { c: Content }) {
  const s = c.settings;
  const visible = c.sections.filter((x) => x.is_visible && !(x.key === "tools" && c.tools.length === 0));
  const research = visible.filter((x) => RESEARCH_KEYS.includes(x.key));
  const profile = visible.filter((x) => !RESEARCH_KEYS.includes(x.key));
  const updated = new Date(s.last_updated + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">{s.full_name}</p>
            {s.footer_blurb && <p className="muted footer-blurb">{s.footer_blurb}</p>}
          </div>
          <div>
            <h4>Research</h4>
            <ul>{research.map((x) => <li key={x.key}><a href={`#${x.key}`}>{x.nav_label}</a></li>)}</ul>
          </div>
          <div>
            <h4>Profile</h4>
            <ul>
              {profile.map((x) => <li key={x.key}><a href={`#${x.key}`}>{x.nav_label}</a></li>)}
              {s.cv_url && <li><a href={s.cv_url} download>Download CV</a></li>}
            </ul>
          </div>
          <div>
            <h4>External</h4>
            <ul>{c.socialLinks.filter((l) => l.in_footer).map((l) => <li key={l.id}><SmartLink href={l.url}>{l.label}</SmartLink></li>)}</ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {s.full_name}</span>
          <span>Last updated: {updated}</span>
        </div>
      </div>
    </footer>
  );
}
