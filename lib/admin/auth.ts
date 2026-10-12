import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * Returns the session client for a signed-in admin, or redirects.
 * RLS enforces the same rule in the database; this check gives a clean UX.
 */
export async function requireAdmin() {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return { supabase, user, isAdmin: Boolean(admin) };
}
