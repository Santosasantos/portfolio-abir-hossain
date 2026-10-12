import { videoThumb, type MediaItem } from "@/lib/media";

/** Compact thumbnail strip for list tables. */
export default function MediaThumbs({ items }: { items: MediaItem[] }) {
  if (!items.length) return <span className="muted">—</span>;
  return (
    <div className="thumbs">
      {items.slice(0, 4).map((m, i) => {
        const src = m.kind === "image" ? m.url : m.kind === "video" ? videoThumb(m.url) : null;
        return src
          // eslint-disable-next-line @next/next/no-img-element
          ? <img key={i} src={src} alt="" className={`thumb${m.kind === "video" ? " thumb--video" : ""}`} loading="lazy" />
          : <span key={i} className={`thumb thumb--doc thumb--${m.kind}`}>{m.kind === "pdf" ? "PDF" : m.kind === "slides" ? "PPT" : "VID"}</span>;
      })}
      {items.length > 4 && <span className="thumb thumb--more">+{items.length - 4}</span>}
    </div>
  );
}
