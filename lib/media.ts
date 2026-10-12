/* Media helpers shared by the public site and the admin editor. */

export type MediaKind = "image" | "video" | "slides" | "pdf";
export type MediaRole = "figure" | "presentation" | "thumbnail";

export type MediaItem = {
  kind: MediaKind;
  url: string;
  caption?: string;
  role?: MediaRole;
  name?: string;   // original file name, for uploads
  size?: number;   // bytes, for uploads
};

const ext = (url: string) => url.split(/[?#]/)[0].split(".").pop()?.toLowerCase() ?? "";

/** Google Drive file id from a share / view / open link, else null. */
export function driveFileId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.replace(/^www\./, "") !== "drive.google.com") return null;
    return u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? u.searchParams.get("id");
  } catch { return null; }
}

/** Guess the kind of a URL or file name. */
export function detectKind(url: string, mime?: string): MediaKind | null {
  const m = mime ?? "";
  const e = ext(url);
  if (m.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(e)) return "image";
  if (m.includes("presentation") || m.includes("powerpoint") || ["pptx", "ppt", "key", "odp"].includes(e)) return "slides";
  if (m === "application/pdf" || e === "pdf") return "pdf";
  if (m.startsWith("video/") || ["mp4", "webm", "mov"].includes(e) || toVideoEmbed(url)) return "video";
  return null;
}

/** Turns YouTube / Vimeo / Google Drive / Loom links into an embeddable URL. Direct files return null. */
export function toVideoEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/)?.[2];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.match(/\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com") return url;
    if (host === "drive.google.com") {
      const id = u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? u.searchParams.get("id");
      return id ? `https://drive.google.com/file/d/${id}/preview` : null;
    }
    if (host === "loom.com") {
      const id = u.pathname.match(/\/share\/([^/?]+)/)?.[1];
      return id ? `https://www.loom.com/embed/${id}` : null;
    }
  } catch { /* not a URL */ }
  return null;
}

/** Thumbnail image for a video link, when the platform offers one. */
export function videoThumb(url: string): string | null {
  const id = toVideoEmbed(url)?.match(/youtube-nocookie\.com\/embed\/([^/?]+)/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/** In-browser viewer for slide decks (works for publicly reachable files). */
export function officeViewer(url: string) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
}

/** Embeddable viewer for a slide deck or PDF: Drive preview, the PDF itself, or Office Online for public PPTX. */
export function deckViewer(item: MediaItem): string | null {
  const drive = driveFileId(item.url);
  if (drive) return `https://drive.google.com/file/d/${drive}/preview`;
  if (item.kind === "pdf") return item.url;
  return /^https:\/\//.test(item.url) ? officeViewer(item.url) : null;
}

/** Direct-download URL (Drive share links become export links). */
export function downloadUrl(item: MediaItem): string {
  const drive = driveFileId(item.url);
  return drive ? `https://drive.google.com/uc?export=download&id=${drive}` : item.url;
}

/** "PDF" / "PPTX" label for a deck. */
export const deckLabel = (item: MediaItem) => (item.kind === "pdf" ? "PDF" : "PPTX");

export function formatBytes(n?: number) {
  if (!n) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(i ? 1 : 0)} ${units[i]}`;
}

/** Validates and normalises what the admin editor submits. */
export function parseMedia(raw: string): { value: MediaItem[]; error?: string } {
  if (!raw.trim()) return { value: [] };
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error();
    const items = data
      .filter((d) => d && typeof d.url === "string" && d.url.trim())
      .map((d): MediaItem => ({
        kind: (["image", "video", "slides", "pdf"].includes(d.kind) ? d.kind : detectKind(d.url) ?? "image") as MediaKind,
        url: String(d.url).trim(),
        caption: d.caption ? String(d.caption).slice(0, 300) : undefined,
        role: (["figure", "presentation", "thumbnail"].includes(d.role) ? d.role : undefined) as MediaRole | undefined,
        name: d.name ? String(d.name) : undefined,
        size: typeof d.size === "number" ? d.size : undefined,
      }));
    return { value: items };
  } catch {
    return { value: [], error: "Media list could not be read. Reload the page and try again." };
  }
}

/** Splits a media list the way the public site lays it out. */
export function groupMedia(items: MediaItem[]) {
  const figures = items.filter((m) => m.kind === "image" && m.role !== "thumbnail" && m.role !== "presentation");
  const thumbnail = items.find((m) => m.kind === "image" && m.role === "thumbnail") ?? items.find((m) => m.kind === "image") ?? null;
  const videos = items.filter((m) => m.kind === "video");
  const slides = items.filter((m) => m.kind === "slides" || m.kind === "pdf");
  return { figures, thumbnail, videos, slides };
}
