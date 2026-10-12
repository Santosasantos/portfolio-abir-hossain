import { isSupabaseConfigured } from "@/lib/supabase/env";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="admin-login">
      <div className="card">
        <p className="eyebrow">Portfolio admin</p>
        <h1>Sign in</h1>
        {isSupabaseConfigured
          ? <LoginForm />
          : <p className="alert alert--error">Supabase isn&apos;t configured. Add the keys from <code>.env.example</code> to <code>.env.local</code>.</p>}
      </div>
    </main>
  );
}
