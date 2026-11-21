import type { LinkItem } from "./content";

/** Icon that fits a document/work link from its title or URL (slides, video, code, certificate, report…). */
export function linkIcon(l: LinkItem): string {
  const t = `${l.label} ${l.url}`.toLowerCase();
  if (/slide|ppt|presentation|deck/.test(t)) return "slides";
  if (/youtu|vimeo|video|demo/.test(t)) return "youtube";
  if (/github|code|notebook/.test(t)) return "github";
  if (/certificate|award|credential|badge|credly/.test(t)) return "award";
  if (/news|article|post|press/.test(t)) return "link";
  return "file";
}
