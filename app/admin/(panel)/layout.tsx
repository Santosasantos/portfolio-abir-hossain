import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "@/lib/admin/actions";
import { NAV_GROUPS, RESOURCES } from "@/lib/admin/resources";
import SkipTracking from "@/components/admin/SkipTracking";

export const metadata = { title: "Portfolio admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin } = await requireAdmin();

  return (
    <div className="admin">
      <SkipTracking />
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">Portfolio admin</Link>
        <nav aria-label="Admin">
          {NAV_GROUPS.map((group) => (
            <div key={group} className="admin-nav-group">
              <p className="eyebrow">{group}</p>
              <ul>
                {RESOURCES.filter((r) => r.nav === group).map((r) => (
                  <li key={r.key}><Link href={`/admin/${r.key}`}>{r.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="admin-nav-group">
            <p className="eyebrow">Insights</p>
            <ul><li><Link href="/admin/visitors">Visitors</Link></li></ul>
          </div>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="muted">{user.email}</span>
          <div className="btn-row">
            <a className="btn btn--outline btn--sm" href="/" target="_blank" rel="noopener">View site</a>
            <form action={signOut}><button className="btn btn--outline btn--sm" type="submit">Sign out</button></form>
          </div>
        </header>
        <div className="admin-content">
          {isAdmin ? children : (
            <div className="card">
              <h1>No admin access</h1>
              <p>You&apos;re signed in as {user.email}, but this account isn&apos;t in the <code>admins</code> table.
                Ask the site owner to add you (see the README, “Make yourself admin”).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
