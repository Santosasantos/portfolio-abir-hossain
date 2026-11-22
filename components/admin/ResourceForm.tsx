"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Field } from "@/lib/admin/resources";
import type { FormState } from "@/lib/admin/actions";
import ColorField from "./ColorField";
import FileField from "./FileField";
import LinksField from "./LinksField";
import MediaField from "./MediaField";

type Props = {
  fields: Field[];
  values: Record<string, string>;
  visible?: boolean;           // undefined for singletons
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  cancelHref?: string;
  folder: string;              // storage folder for uploads
};

function SaveButton() {
  const { pending } = useFormStatus();
  return <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</button>;
}

function Input({ field, value, folder }: { field: Field; value: string; folder: string }) {
  const id = `f-${field.name}`;
  const common = { id, name: field.name, defaultValue: value, required: field.required };

  if (field.type === "links" && field.accept)
    return <LinksField id={id} name={field.name} initial={value} accept={field.accept} bucket={field.bucket} presets={field.presets} folder={`${folder}/${field.name}`} />;

  switch (field.type) {
    case "boolean":
      return (
        <label className="check" htmlFor={id}>
          <input type="checkbox" id={id} name={field.name} defaultChecked={value === "on"} />
          <span>{field.label}</span>
        </label>
      );
    case "textarea": case "lines": case "links": case "pairs": case "steps": case "scores":
      return <textarea {...common} rows={field.mono ? 10 : field.type === "textarea" ? 5 : 4} className={field.mono ? "mono" : undefined} />;
    case "select": case "icon":
      return (
        <select {...common}>
          {field.type === "icon" && <option value="">— Default —</option>}
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "number": return <input type="number" {...common} />;
    case "date": return <input type="date" {...common} />;
    case "file":
      return <FileField id={id} name={field.name} initial={value} accept={field.accept} folder={`${folder}/${field.name}`} />;
    case "media":
      return <MediaField name={field.name} label={field.label} initial={value} hint={field.hint} folder={`${folder}/${field.name}`} />;
    case "color":
      return <ColorField id={id} name={field.name} initial={value} />;
    default:
      return <input type="text" {...common} />;
  }
}

export default function ResourceForm({ fields, values, visible, action, cancelHref, folder }: Props) {
  const [state, formAction] = useActionState(action, { error: null });
  const current = state.values ?? values;
  const isVisible = state.values ? state.values.is_visible === "on" : visible;

  // Group fields into fieldsets when the config defines groups.
  const groups: { name: string; fields: Field[] }[] = [];
  for (const f of fields) {
    const g = f.group ?? "";
    const last = groups[groups.length - 1];
    if (last && last.name === g) last.fields.push(f);
    else groups.push({ name: g, fields: [f] });
  }

  return (
    <form key={state.n ?? 0} action={formAction} className="admin-form">
      {state.error && <p className="alert alert--error" role="alert">{state.error}</p>}
      {state.saved && <p className="alert alert--ok" role="status">Saved. The public page is updated.</p>}

      {groups.map((g) => (
        <fieldset key={g.name || "main"} className="admin-fieldset">
          {g.name && <legend>{g.name}</legend>}
          {g.fields.map((f) => (
            <div key={f.name} className={`form-row${f.type === "boolean" ? " form-row--check" : ""}`}>
              {f.type !== "boolean" && f.type !== "media" && <label htmlFor={`f-${f.name}`}>{f.label}{f.required && <span aria-hidden="true"> *</span>}</label>}
              {f.type === "media" && <p className="form-label">{f.label}</p>}
              <Input field={f} value={current[f.name] ?? ""} folder={folder} />
              {f.hint && f.type !== "media" && <p className="hint">{f.hint}</p>}
            </div>
          ))}
        </fieldset>
      ))}

      {visible !== undefined && (
        <div className="form-row form-row--check">
          <label className="check" htmlFor="f-is_visible">
            <input type="checkbox" id="f-is_visible" name="is_visible" defaultChecked={isVisible} />
            <span>Visible on the public site</span>
          </label>
        </div>
      )}

      <div className="form-actions">
        <SaveButton />
        {cancelHref && <Link className="btn btn--outline" href={cancelHref}>Cancel</Link>}
      </div>
    </form>
  );
}
