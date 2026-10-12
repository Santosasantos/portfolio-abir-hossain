import Link from "next/link";
import { notFound } from "next/navigation";
import ResourceForm from "@/components/admin/ResourceForm";
import { saveRecord } from "@/lib/admin/actions";
import { getResource } from "@/lib/admin/resources";

export default async function NewRecordPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource || resource.singleton || resource.canCreate === false) notFound();

  // Sensible defaults: checkboxes on, first option of each select.
  const values = Object.fromEntries(resource.fields.map((f) => [
    f.name,
    f.type === "boolean" ? (f.name === "featured" || f.name === "is_download" ? "" : "on")
      : f.type === "select" ? f.options?.[0]?.value ?? "" : "",
  ]));

  return (
    <>
      <p className="crumbs"><Link href={`/admin/${resource.key}`}>{resource.label}</Link> / New</p>
      <div className="admin-head"><h1>Add to {resource.label.toLowerCase()}</h1></div>
      <ResourceForm folder={resource.table} fields={resource.fields} values={values} visible
                    action={saveRecord.bind(null, resource.key, null)} cancelHref={`/admin/${resource.key}`} />
    </>
  );
}
