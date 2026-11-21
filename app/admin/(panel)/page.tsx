import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { NAV_GROUPS, RESOURCES } from "@/lib/admin/resources";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const counts = await Promise.all(
    RESOURCES.map(async (r) => {
      if (r.singleton) return null;
      const { count } = await supabase.from(r.table).select("*", { count: "exact", head: true });
      return count ?? 0;
    }),
  );

  const { data: stats } = await supabase.rpc("visit_stats", { days: 30, tz: process.env.ADMIN_TIME_ZONE || "Asia/Dhaka" });
  const visits = stats as { visits: number; visitors: number } | null;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Content</h1>
          <p className="muted">Everything on the public page comes from here. Changes go live as soon as you save.</p>
        </div>
      </div>
      <section className="admin-dash-group">
        <h2 className="eyebrow">Insights</h2>
        <div className="admin-cards">
          <Link href="/admin/visitors" className="card admin-card">
            <span className="admin-card-title">Visitors</span>
            <span className="muted">Visits, countries, where people came from and their devices.</span>
            <span className="mono admin-card-count">{visits ? `${visits.visitors} visitors · ${visits.visits} visits (30 days)` : "Open"}</span>
          </Link>
        </div>
      </section>
      {NAV_GROUPS.map((group) => (
        <section key={group} className="admin-dash-group">
          <h2 className="eyebrow">{group}</h2>
          <div className="admin-cards">
            {RESOURCES.map((r, i) => r.nav !== group ? null : (
              <Link key={r.key} href={`/admin/${r.key}`} className="card admin-card">
                <span className="admin-card-title">{r.label}</span>
                <span className="muted">{r.description}</span>
                <span className="mono admin-card-count">{r.singleton ? "Edit" : `${counts[i]} item${counts[i] === 1 ? "" : "s"}`}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
