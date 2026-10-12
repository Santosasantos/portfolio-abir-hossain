import Link from "next/link";
import { notFound } from "next/navigation";
import ResourceForm from "@/components/admin/ResourceForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteRecord, moveRecord, saveRecord, setVisibility } from "@/lib/admin/actions";
import { encodeRow, preview } from "@/lib/admin/fields";
import { getResource } from "@/lib/admin/resources";
import { Icon } from "@/lib/icons";
import MediaThumbs from "@/components/admin/MediaThumbs";
import type { MediaItem } from "@/lib/media";

type Params = { params: Promise<{ resource: string }>; searchParams: Promise<{ saved?: string }> };

export default async function ResourcePage({ params, searchParams }: Params) {
  const { resource: key } = await params;
  const { saved } = await searchParams;
  const resource = getResource(key);
  if (!resource) notFound();
  const { supabase } = await requireAdmin();

  /* Singleton → edit form directly */
  if (resource.singleton) {
    const { data } = await supabase.from(resource.table).select("*").eq("id", 1).maybeSingle();
    return (
      <>
        <div className="admin-head"><div><h1>{resource.label}</h1><p className="muted">{resource.description}</p></div></div>
        <ResourceForm folder={resource.table} fields={resource.fields} values={encodeRow(resource.fields, data)}
                      action={saveRecord.bind(null, resource.key, null)} />
      </>
    );
  }

  const pk = resource.pk ?? "id";
  const { data: rows, error } = await supabase.from(resource.table).select("*").order("sort_order");
  const list = (rows ?? []) as Record<string, unknown>[];
  const canCreate = resource.canCreate !== false;
  const typeOf = (c: string) => resource.fields.find((f) => f.name === c)?.type;
  const linkCol = resource.columns.find((c) => typeOf(c) !== "icon" && typeOf(c) !== "media") ?? resource.columns[0];

  return (
    <>
      <div className="admin-head">
        <div><h1>{resource.label}</h1><p className="muted">{resource.description}</p></div>
        {canCreate && <Link className="btn btn--primary" href={`/admin/${resource.key}/new`}>Add new</Link>}
      </div>

      {saved && <p className="alert alert--ok" role="status">Saved. The public page is updated.</p>}
      {error && <p className="alert alert--error">{error.message}</p>}

      {list.length === 0 ? (
        <div className="card admin-empty">
          <p>Nothing here yet.</p>
          {canCreate && <Link className="btn btn--outline btn--sm" href={`/admin/${resource.key}/new`}>Add the first one</Link>}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Order</th>
                {resource.columns.map((c) => (
                  <th key={c} scope="col">{resource.fields.find((f) => f.name === c)?.label ?? c}</th>
                ))}
                <th scope="col">Visible</th>
                <th scope="col"><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {list.map((row, i) => {
                const id = String(row[pk]);
                const visible = Boolean(row.is_visible);
                return (
                  <tr key={id} className={visible ? undefined : "is-hidden"}>
                    <td>
                      <div className="order-btns">
                        <form action={moveRecord.bind(null, resource.key, id, "up")}>
                          <button className="icon-btn icon-btn--sm" type="submit" disabled={i === 0} aria-label="Move up">↑</button>
                        </form>
                        <form action={moveRecord.bind(null, resource.key, id, "down")}>
                          <button className="icon-btn icon-btn--sm" type="submit" disabled={i === list.length - 1} aria-label="Move down">↓</button>
                        </form>
                      </div>
                    </td>
                    {resource.columns.map((c) => (
                      <td key={c}>
                        {typeOf(c) === "media" ? <MediaThumbs items={(row[c] ?? []) as MediaItem[]} />
                          : typeOf(c) === "icon" ? <span className="cell-icon"><Icon name={String(row[c] ?? "")} /></span>
                          : c === linkCol
                            ? <Link href={`/admin/${resource.key}/${encodeURIComponent(id)}`} className="row-title">{preview(row[c])}</Link>
                            : preview(row[c])}
                      </td>
                    ))}
                    <td>
                      <form action={setVisibility.bind(null, resource.key, id, !visible)}>
                        <button type="submit" className={`pill-toggle${visible ? " is-on" : ""}`} aria-pressed={visible}>
                          {visible ? "Shown" : "Hidden"}
                        </button>
                      </form>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link className="btn btn--ghost btn--sm" href={`/admin/${resource.key}/${encodeURIComponent(id)}`}>Edit</Link>
                        {canCreate && (
                          <form action={deleteRecord.bind(null, resource.key, id)}>
                            <ConfirmButton className="btn btn--ghost btn--sm btn--danger" message="Delete this item? This can't be undone.">Delete</ConfirmButton>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
