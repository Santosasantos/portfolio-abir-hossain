import { Icon } from "@/lib/icons";
import { groupMedia, videoThumb, type MediaItem } from "@/lib/media";
import type { Content, LinkItem, Section } from "@/lib/content";
import { Figures, Video } from "./Media";
import { ChipList, SectionHead, SmartLink } from "./ui";

export function LinkButtons({ links, primaryFirst }: { links: LinkItem[]; primaryFirst?: boolean }) {
  if (!links.length) return null;
  return (
    <div className="btn-row">
      {links.map((l, i) => (
        <SmartLink key={i} href={l.url} className={`btn btn--sm${primaryFirst && i === 0 ? " btn--primary" : ""}`}>
          {/github\.com/.test(l.url) && <Icon name="github" />}{l.label}
        </SmartLink>
      ))}
    </div>
  );
}

/** Card header image: thumbnail image, else the first video, else an icon tile so every card in the grid lines up. */
export function CardMedia({ media, title, icon }: { media: MediaItem[]; title: string; icon?: string }) {
  const { thumbnail, videos } = groupMedia(media);
  if (thumbnail) {
    // eslint-disable-next-line @next/next/no-img-element
    return <div className="card-media"><img src={thumbnail.url} alt={thumbnail.caption || `${title} screenshot`} loading="lazy" /></div>;
  }
  const still = videos[0] && videoThumb(videos[0].url);
  if (videos[0] && still) {
    // A still that opens the video keeps the grid light (no player per card) and matches the reference's thumbnails.
    return (
      <a className="card-media card-media--video" href={videos[0].url} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${title} video`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={still} alt={videos[0].caption || `${title} video`} loading="lazy" />
        <span className="play-badge" aria-hidden="true"><Icon name="youtube" /></span>
      </a>
    );
  }
  if (videos[0]) return <div className="card-media"><Video item={videos[0]} /></div>;
  if (icon) return <div className="card-media card-media--icon" aria-hidden="true"><Icon name={icon} /></div>;
  return null;
}

export default function Projects({ c, section, alt }: { c: Content; section: Section; alt: boolean }) {
  const featured = c.projects.filter((p) => p.featured);
  const rest = c.projects.filter((p) => !p.featured);
  return (
    <section className={`section${alt ? " section--alt" : ""}`} id={section.key} aria-labelledby={`${section.key}-title`}>
      <div className="container">
        <SectionHead section={section} id={`${section.key}-title`} />

        {featured.map((p) => {
          const { figures, videos } = groupMedia(p.media);
          const images = figures.length ? figures : p.media.filter((m) => m.kind === "image");
          return (
            <article key={p.id} className="card project-feature">
              <div>
                {p.badge && <span className="badge badge--featured">{p.badge}</span>}
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="block-gap-sm"><ChipList items={p.tags} label="Technologies" /></div>
                <LinkButtons links={p.links} primaryFirst />
                {p.pipeline.length > 0 && (
                  <ol className="pipeline" aria-label={`${p.title} pipeline`}>
                    {p.pipeline.map((step, i) => (
                      <li key={i} className="pipeline-step">
                        <b>{String(i + 1).padStart(2, "0")}</b>
                        <span><strong>{step.title}</strong>{step.text}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="project-feature-media">
                {videos[0] && <Video item={videos[0]} />}
                {images.length > 0 && <Figures items={images.slice(0, 2)} />}
              </div>
            </article>
          );
        })}

        {rest.length > 0 && (
          <div className="grid grid--3">
            {rest.map((p) => (
              <article key={p.id} className="card card--project">
                <CardMedia media={p.media} title={p.title} icon={p.icon} />
                <div className="card-body">
                  <div className="project-head">
                    <h3><Icon name={p.icon} />{p.title}</h3>
                    {p.year_label && <span className="project-year">{p.year_label}</span>}
                  </div>
                  <p>{p.description}</p>
                  <ChipList items={p.tags} label="Technologies" />
                  <LinkButtons links={p.links} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
