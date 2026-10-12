import Link from "next/link";
import { notFound } from "next/navigation";
import ResourceForm from "@/components/admin/ResourceForm";
import { requireAdmin } from "@/lib/admin/auth";
import { saveRecord } from "@/lib/admin/actions";
import { encodeRow } from "@/lib/admin/fields";
import { getResource } from "@/lib/admin/resources";

export default async function EditRecordPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource: key, id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const resource = getResource(key);
  if (!resource || resource.singleton) notFound();

  const { supabase } = await requireAdmin();
  const { data } = await supabase.from(resource.table).select("*").eq(resource.pk ?? "id", id).maybeSingle();
  if (!data) notFound();

  const title = String(data.title ?? data.label ?? data.degree ?? data.nav_label ?? "Edit");
  return (
    <>
      <p className="crumbs"><Link href={`/admin/${resource.key}`}>{resource.label}</Link> / Edit</p>
      <div className="admin-head"><h1>{title}</h1></div>
      <ResourceForm folder={resource.table} fields={resource.fields} values={encodeRow(resource.fields, data)} visible={Boolean(data.is_visible)}
                    action={saveRecord.bind(null, resource.key, id)} cancelHref={`/admin/${resource.key}`} />
    </>
  );
}
