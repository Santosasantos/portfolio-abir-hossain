"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "./auth";
import { decodeValue } from "./fields";
import { getResource, type Resource } from "./resources";

export type FormState = { error: string | null; saved?: boolean; values?: Record<string, string>; n?: number };

async function adminFor(resourceKey: string) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("Unknown resource");
  const ctx = await requireAdmin();
  if (!ctx.isAdmin) throw new Error("Your account is not an admin.");
  return { resource, ...ctx };
}

const pkOf = (r: Resource) => r.pk ?? "id";

function refresh(resource: Resource) {
  revalidatePath("/");
  revalidatePath(`/admin/${resource.key}`);
}

/** Create or update one row from the generic form. */
export async function saveRecord(resourceKey: string, id: string | null, _prev: FormState, form: FormData): Promise<FormState> {
  const { resource, supabase } = await adminFor(resourceKey);
  const row: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const field of resource.fields) {
    const { value, error } = decodeValue(field, String(form.get(field.name) ?? ""));
    if (error) errors.push(error);
    row[field.name] = value;
  }

  if (!resource.singleton) row.is_visible = form.get("is_visible") === "on";

  // On failure, hand the submitted text back so the form keeps the user's edits.
  const submitted = (): Record<string, string> => Object.fromEntries([
    ...resource.fields.map((f) => [f.name, String(form.get(f.name) ?? "")]),
    ["is_visible", form.get("is_visible") === "on" ? "on" : ""],
  ]);
  const fail = (error: string): FormState => ({ error, values: submitted(), n: (_prev.n ?? 0) + 1 });

  if (errors.length) return fail(errors.join(" · "));

  let error;
  if (resource.singleton) {
    ({ error } = await supabase.from(resource.table).upsert({ id: 1, ...row }));
  } else if (id) {
    ({ error } = await supabase.from(resource.table).update(row).eq(pkOf(resource), id));
  } else {
    const { data: last } = await supabase.from(resource.table).select("sort_order")
      .order("sort_order", { ascending: false }).limit(1).maybeSingle();
    ({ error } = await supabase.from(resource.table).insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 }));
  }
  if (error) return fail(error.message);

  refresh(resource);
  if (resource.singleton) return { error: null, saved: true, n: (_prev.n ?? 0) + 1 };
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function deleteRecord(resourceKey: string, id: string) {
  const { resource, supabase } = await adminFor(resourceKey);
  if (resource.singleton || resource.canCreate === false) throw new Error("This item can't be deleted.");
  const { error } = await supabase.from(resource.table).delete().eq(pkOf(resource), id);
  if (error) throw new Error(error.message);
  refresh(resource);
}

export async function setVisibility(resourceKey: string, id: string, visible: boolean) {
  const { resource, supabase } = await adminFor(resourceKey);
  const { error } = await supabase.from(resource.table).update({ is_visible: visible }).eq(pkOf(resource), id);
  if (error) throw new Error(error.message);
  refresh(resource);
}

/** Moves a row one step up or down by renumbering the (small) list. */
export async function moveRecord(resourceKey: string, id: string, direction: "up" | "down") {
  const { resource, supabase } = await adminFor(resourceKey);
  const pk = pkOf(resource);
  const { data, error } = await supabase.from(resource.table).select(`${pk}, sort_order`).order("sort_order");
  if (error || !data) throw new Error(error?.message ?? "Could not load rows");

  const ids = (data as unknown as Record<string, string>[]).map((r) => r[pk]);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];

  await Promise.all(ids.map((rowId, index) =>
    supabase.from(resource.table).update({ sort_order: index + 1 }).eq(pk, rowId)));
  refresh(resource);
}

/* ---------- Auth ---------- */
export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (error) return { error: "Email or password is incorrect.", values: { email: String(form.get("email") ?? "") } };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
