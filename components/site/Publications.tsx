import { Icon } from "@/lib/icons";
import { groupMedia, type MediaItem } from "@/lib/media";
import type { Content, Publication, Section } from "@/lib/content";
import { DeckFrame, Figures, SlidesCard, Video } from "./Media";
import PubActions from "./PubActions";
import GroupTabs, { type TabGroup } from "./GroupTabs";
import { SectionHead, SmartLink } from "./ui";

/** Tab label, and the type tag shown inside each card. */
const GROUPS: { key: Publication["category"]; tab: string; tag: string }[] = [
  { key: "journal", tab: "Journal", tag: "Journal Article" },
  { key: "conference", tab: "Conference", tag: "Conference Paper" },
  { key: "chapter", tab: "Book Chapters", tag: "Book Chapter" },
  { key: "preprint", tab: "Preprints", tag: "Preprint" },
  { key: "other", tab: "Other", tag: "Publication" },
];
const typeTag = (p: Publication) => GROUPS.find((g) => g.key === p.category)?.tag ?? "Publication";

function Authors({ text, highlight }: { text: string; highlight: string | null }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, ...rest] = text.split(highlight);
  return <>{before}<strong>{highlight}</strong>{rest.join(highlight)}</>;
}

function Artifact({ label, href }: { label: string; href?: string | null }) {
  return href
    ? <SmartLink className="artifact artifact--on" href={href}>{label}</SmartLink>
    : <span className="artifact artifact--off">{label}: Not available</span>;
}

const yearOf = (p: Publication) => p.date_label?.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;
/** "IEEE ICCIT 2023" → "IEEE ICCIT" so the meta line reads "… · IEEE ICCIT · 2023 · …" like the reference. */
const venueShort = (p: Publication, year: string | null) =>
  p.venue_badge ? (year ? p.venue_badge.replace(new RegExp(`\\s*${year}$`), "") : p.venue_badge).trim() : null;

function Presentation({ p, videos, slides }: { p: Publication; videos: MediaItem[]; slides: MediaItem[] }) {
  const video = videos[0];
  const deck = slides[0];
  const available = [videos.length && "Video", slides.length && "Slides"].filter(Boolean).join(" & ");
  return (
    <div className="presentation">
      <p className="presentation-title"><Icon name="play" />{p.category === "conference" ? "Conference Presentation" : "Presentation"}</p>
      <div className={`presentation-grid${deck ? "" : " presentation-grid--single"}`}>
        {video ? <Video item={video} /> : deck && <DeckFrame item={deck} title={`${p.title} — slides`} />}
        {deck && <div className="slides-stack"><SlidesCard item={deck} inlineViewer={Boolean(video)} /></div>}
      </div>
      {videos.length > 1 && <div className="presentation-more">{videos.slice(1).map((v, i) => <Video key={i} item={v} />)}</div>}
      <p className="presentation-note">
        {p.presentation_note && <span><Icon name="calendar" />{p.presentation_note}</span>}
        {p.presentation_note && <span aria-hidden="true">•</span>}
        <span><Icon name={video ? "youtube" : "slides"} />{available} Available</span>
      </p>
    </div>
  );
}

function PubCard({ p }: { p: Publication }) {
  const { figures, videos, slides } = groupMedia(p.media);
  const year = yearOf(p);
  const venue = venueShort(p, year);
  const meta = [venue, year, p.status && `Status: ${p.status}`].filter(Boolean) as string[];
  const abstract = p.abstract?.replace(/^\s*abstract\s*[—:-]\s*/i, "");

  return (
    <article className="card card--pub" id={p.anchor ?? undefined}>
      <div className={`pub-layout${figures.length ? " pub-layout--figures" : ""}`}>
        {figures.length > 0 && <div className="pub-figures"><Figures items={figures} /></div>}

        <div className="pub-body">
          <div className="pub-top">
            <div className="badges">
              <span className={`badge badge--type badge--type-${p.category}`}>{typeTag(p)}</span>
              {p.venue_badge && <span className="badge badge--venue">{p.venue_badge}</span>}
            </div>
            {p.date_label && <span className="pub-date">{p.date_label}</span>}
          </div>
          <h3>{p.title}</h3>
          <p className="pub-authors">
            <Authors text={p.authors} highlight={p.highlight_author} />
            {meta.map((m) => <span key={m}> · {m}</span>)}
          </p>
          {p.venue && <p className="pub-venue">{p.venue}</p>}

          {p.metrics.length > 0 && (
            <div className="metrics">
              {p.metrics.map((m, i) => <div key={i} className="metric"><b>{m.value}</b><span>{m.label}</span></div>)}
            </div>
          )}

          {abstract && <p className="pub-abstract"><span className="pub-abstract-label">Abstract—</span>{abstract}</p>}

          {p.keywords.length > 0 && (
            <ul className="chip-row pub-keywords" aria-label="Keywords">
              {p.keywords.map((k) => <li key={k} className="kw">{k}</li>)}
            </ul>
          )}

          {(videos.length > 0 || slides.length > 0) && <Presentation p={p} videos={videos} slides={slides} />}

          <PubActions links={p.links} video={videos[0]?.url} slides={slides[0]} bibtex={p.bibtex} />

          <div className="artifacts">
            <span className="artifacts-label">Artifacts:</span>
            <Artifact label="Code" href={p.code_url} />
            <Artifact label="Slides" href={slides[0]?.url} />
            <Artifact label="Poster" href={p.poster_url} />
            <Artifact label="Demo/Video" href={p.demo_url ?? videos[0]?.url} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Publications({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  const s = c.settings;
  const published = c.publications.filter((p) => /published|accepted|presented/i.test(p.status)).length;
  // One tab per publication type that has entries; each card carries its own type tag, so no group headings.
  const groups: TabGroup[] = GROUPS.flatMap((g) => {
    const items = c.publications.filter((p) => p.category === g.key);
    return items.length ? [{ key: g.key, label: g.tab, count: items.length,
      content: <div className="pub-list">{items.map((p) => <PubCard key={p.id} p={p} />)}</div> }] : [];
  });
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container">
        <SectionHead section={section} id={`${section.key}-title`} />

        {(s.scholar_citations != null || s.scholar_h_index != null) && (
          <div className="card scholar-strip">
            <div className="scholar-stats">
              {s.scholar_citations != null && <div><div className="stat-value">{s.scholar_citations}</div><div className="stat-label">Citations</div></div>}
              {s.scholar_h_index != null && <div><div className="stat-value">{s.scholar_h_index}</div><div className="stat-label">h-index</div></div>}
              <div><div className="stat-value">{published}</div><div className="stat-label">Publications</div></div>
            </div>
            {s.scholar_url && <SmartLink className="btn btn--sm" href={s.scholar_url}><Icon name="scholar" />Google Scholar profile</SmartLink>}
          </div>
        )}

        {groups.length > 1
          ? <div className="block-gap"><GroupTabs id={section.key} label="Publication types" groups={groups} /></div>
          : groups.map((g) => <div key={g.key}>{g.content}</div>)}
      </div>
    </section>
  );
}
