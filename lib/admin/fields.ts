import type { Field } from "./resources";
import { parseMedia } from "@/lib/media";

type Row = Record<string, unknown>;
const SEP = " | ";
type ScoreLine = { label: string; score: string; max?: number; min?: number };

/** DB value → string shown in the form input. */
export function encodeValue(field: Field, value: unknown): string {
  if (value == null) return "";
  switch (field.type) {
    case "boolean": return value ? "on" : "";
    case "tags": return (value as string[]).join(", ");
    case "lines": return (value as string[]).join("\n");
    case "links": return (value as { label: string; url: string }[]).map((l) => `${l.label}${SEP}${l.url}`).join("\n");
    case "pairs": return (value as { value: string; label: string }[]).map((p) => `${p.value}${SEP}${p.label}`).join("\n");
    case "steps": return (value as { title: string; text: string }[]).map((s) => `${s.title}${SEP}${s.text}`).join("\n");
    case "scores": return (value as ScoreLine[]).map((b) => [b.label, b.score, b.max, b.min].filter((x) => x != null && x !== "").join(SEP)).join("\n");
    case "media": return JSON.stringify(value);
    default: return String(value);
  }
}

const splitPipe = (line: string) => {
  const i = line.indexOf("|");
  return i === -1 ? [line.trim(), ""] : [line.slice(0, i).trim(), line.slice(i + 1).trim()];
};
const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

/** Form string → DB value. Returns an error message for invalid input. */
export function decodeValue(field: Field, raw: string): { value: unknown; error?: string } {
  const s = raw.trim();
  switch (field.type) {
    case "boolean": return { value: raw === "on" };
    case "number": {
      if (!s) return { value: null };
      const n = Number(s);
      return Number.isFinite(n) ? { value: Math.trunc(n) } : { value: null, error: `${field.label} must be a number` };
    }
    case "date": return { value: s || null };
    case "tags": return { value: s.split(",").map((t) => t.trim()).filter(Boolean) };
    case "lines": return { value: lines(raw) };
    case "links": {
      const items = lines(raw).map(splitPipe).map(([label, url]) => ({ label, url }));
      const bad = items.find((l) => !l.url);
      return bad ? { value: [], error: `${field.label}: "${bad.label}" needs "Label | URL"` } : { value: items };
    }
    case "pairs": return { value: lines(raw).map(splitPipe).map(([value, label]) => ({ value, label })) };
    case "steps": return { value: lines(raw).map(splitPipe).map(([title, text]) => ({ title, text })) };
    case "scores": {
      const out: ScoreLine[] = [];
      for (const line of lines(raw)) {
        const [label, score, max, min] = line.split("|").map((x) => x.trim());
        const n = (x?: string) => (x ? Number(x) : undefined);
        if (!label || !score) return { value: [], error: `${field.label}: "${line}" needs at least "Label | Score"` };
        if ([n(score), n(max), n(min)].some((x) => x !== undefined && !Number.isFinite(x)))
          return { value: [], error: `${field.label}: "${line}" — score, max and min must be numbers` };
        out.push({ label, score, ...(max ? { max: n(max) } : {}), ...(min ? { min: n(min) } : {}) });
      }
      return { value: out };
    }
    case "media": return parseMedia(raw);
    case "file": return { value: s || null };
    case "color":
      return /^#[0-9a-f]{6}$/i.test(s) ? { value: s.toUpperCase() } : { value: null, error: `${field.label} must be a color like #D67757` };
    case "url": {
      if (!s) return { value: null };
      return /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(s) ? { value: s } : { value: null, error: `${field.label} must start with https://` };
    }
    default: return field.required && !s ? { value: s, error: `${field.label} is required` } : { value: s };
  }
}

export function encodeRow(fields: Field[], row: Row | null): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.name, encodeValue(f, row?.[f.name])]));
}

/** Short text for list tables. */
export function preview(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value) && value.length && typeof value[0] === "object" && "kind" in (value[0] as Row)) {
    const counts: Record<string, number> = {};
    for (const m of value as Row[]) counts[String(m.kind)] = (counts[String(m.kind)] ?? 0) + 1;
    return Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(" · ");
  }
  if (Array.isArray(value)) return value.map((v) => (typeof v === "object" ? (v as Row).label ?? (v as Row).title ?? "" : v)).join(", ");
  const s = String(value);
  return s.length > 70 ? s.slice(0, 67) + "…" : s;
}
