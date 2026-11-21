import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";

type Bucket = { label: string; count: number };
type Stats = {
  visits: number; visitors: number; today: number; all_time: number;
  by_day: { day: string; visits: number; visitors: number }[];
  countries: Bucket[]; referrers: Bucket[]; devices: Bucket[]; browsers: Bucket[];
};
type Visit = {
  id: number; created_at: string; path: string; referrer: string | null; country: string | null;
  city: string | null; device: string | null; browser: string | null; os: string | null;
};

const RANGES = [{ days: 7, label: "7 days" }, { days: 30, label: "30 days" }, { days: 90, label: "90 days" }, { days: 0, label: "All time" }];

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
function countryName(code: string | null) {
  if (!code || code === "Unknown") return "Unknown";
  try { return regionNames.of(code.toUpperCase()) ?? code; } catch { return code; }
}
function referrerHost(r: string | null) {
  if (!r) return "Direct";
  try { return new URL(r).host.replace(/^www\./, ""); } catch { return r; }
}
// Times and day boundaries use the owner's time zone (set ADMIN_TIME_ZONE to change it).
const TIME_ZONE = process.env.ADMIN_TIME_ZONE || "Asia/Dhaka";
const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: TIME_ZONE });

function BarList({ title, items, format = (s: string) => s }: { title: string; items: Bucket[]; format?: (s: string) => string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <section className="card insight-card">
      <h2 className="eyebrow">{title}</h2>
      {items.length === 0 ? <p className="muted">No data yet.</p> : (
        <ul className="bar-list">
          {items.map((i) => (
            <li key={i.label}>
              <span className="bar-label">{format(i.label)}</span>
              <span className="bar-track" aria-hidden="true"><span style={{ width: `${(i.count / max) * 100}%` }} /></span>
              <span className="bar-value mono">{i.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function VisitorsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { supabase } = await requireAdmin();
  const days = Math.max(0, Number((await searchParams).days ?? 30) || 0);
  const range = RANGES.find((r) => r.days === days) ?? RANGES[1];

  const [{ data: stats, error }, { data: recent }] = await Promise.all([
    supabase.rpc("visit_stats", { days: range.days, tz: TIME_ZONE }),
    supabase.from("visits").select("id, created_at, path, referrer, country, city, device, browser, os").order("created_at", { ascending: false }).limit(50),
  ]);
  const s = stats as Stats | null;
  const peak = Math.max(1, ...(s?.by_day ?? []).map((d) => d.visits));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Visitors</h1>
          <p className="muted">Who is looking at the portfolio. One visit is counted per browser session; your own browser is not counted once you have opened this panel. No IP addresses are stored. Times are shown in {TIME_ZONE.replace("_", " ")} time.</p>
        </div>
        <nav className="range-tabs" aria-label="Date range">
          {RANGES.map((r) => (
            <Link key={r.days} href={`/admin/visitors?days=${r.days}`} className={`btn btn--sm ${r.days === range.days ? "btn--primary" : "btn--outline"}`} aria-current={r.days === range.days ? "page" : undefined}>{r.label}</Link>
          ))}
        </nav>
      </div>

      {error && (
        <div className="alert alert--error">
          Visitor data isn&apos;t available yet. Run <code>supabase/migrations/0008_visitors_email.sql</code> in the Supabase SQL Editor. ({error.message})
        </div>
      )}

      {s && (
        <>
          <div className="stat-grid">
            <div className="card stat"><span className="stat-value">{s.visits}</span><span className="muted">Visits · {range.label.toLowerCase()}</span></div>
            <div className="card stat"><span className="stat-value">{s.visitors}</span><span className="muted">Unique visitors · {range.label.toLowerCase()}</span></div>
            <div className="card stat"><span className="stat-value">{s.today}</span><span className="muted">Visits today</span></div>
            <div className="card stat"><span className="stat-value">{s.all_time}</span><span className="muted">Visits all time</span></div>
          </div>

          <section className="card insight-card">
            <h2 className="eyebrow">Visits per day</h2>
            {s.by_day.length === 0 ? <p className="muted">No visits in this range yet.</p> : (
              <div className="day-chart" role="img" aria-label={`Visits per day, peak ${peak}`}>
                {s.by_day.map((d) => (
                  <div key={d.day} className="day-col" title={`${d.day}: ${d.visits} visits, ${d.visitors} visitors`}>
                    <span className="day-bar" style={{ height: `${(d.visits / peak) * 100}%` }} />
                    <span className="day-label">{d.day.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="insight-grid">
            <BarList title="Countries" items={s.countries} format={countryName} />
            <BarList title="Came from" items={s.referrers} />
            <BarList title="Devices" items={s.devices} />
            <BarList title="Browsers" items={s.browsers} />
          </div>
        </>
      )}

      <section className="card insight-card">
        <h2 className="eyebrow">Latest visits</h2>
        {!recent?.length ? <p className="muted">No visits recorded yet.</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>When</th><th>Location</th><th>Device</th><th>Came from</th><th>Page</th></tr></thead>
              <tbody>
                {(recent as Visit[]).map((v) => (
                  <tr key={v.id}>
                    <td>{when.format(new Date(v.created_at))}</td>
                    <td>{[v.city, countryName(v.country)].filter((x) => x && x !== "Unknown").join(", ") || "Unknown"}</td>
                    <td>{[v.device, v.browser, v.os].filter(Boolean).join(" · ")}</td>
                    <td>{referrerHost(v.referrer)}</td>
                    <td className="mono">{v.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
