"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/lib/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>;
}

export default function LoginForm() {
  const [state, action] = useActionState(signIn, { error: null });
  return (
    <form action={action} className="admin-form">
      {state.error && <p className="alert alert--error" role="alert">{state.error}</p>}
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} key={state.values?.email} />
      </div>
      <div className="form-row">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <div className="form-actions"><Submit /></div>
    </form>
  );
}
