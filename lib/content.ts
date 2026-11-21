import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { MediaItem } from "@/lib/media";

/* ---------- Row shapes (mirror supabase/migrations/0001_schema.sql) ---------- */
export type LinkItem = { label: string; url: string };
export type Metric = { value: string; label: string };
export type Step = { title: string; text: string };

type Base = { id: string; sort_order: number; is_visible: boolean };

export type Settings = {
  full_name: string; headline: string; bio: string; interests_line: string;
  interests_label: string; featured_label: string;
  photo_url: string | null; cv_url: string | null;
  status_enabled: boolean; status_label: string; status_title: string; status_body: string;
  background: string;
  scholar_url: string | null; scholar_citations: number | null; scholar_h_index: number | null;
  contact_intro: string; contact_note: string; footer_blurb: string;
  email_subject: string; email_body: string;
  last_updated: string; meta_title: string; meta_description: string;
  theme_bg: string; theme_surface: string; theme_surface_alt: string; theme_ink: string; theme_muted: string;
  theme_border: string; theme_accent: string; theme_dark: string; theme_chip_bg: string; theme_chip_ink: string;
  theme_font: string; dark_mode_enabled: boolean; achievements_visible: number; logo_url: string | null;
};
export type Section = { key: string; nav_label: string; title: string; subtitle: string; sort_order: number; is_visible: boolean };
export type HeaderItem = Base & { icon: string; label: string; url: string | null; in_hero: boolean; in_contact: boolean };
export type SocialLink = Base & { icon: string; label: string; url: string; in_hero: boolean; in_contact: boolean; in_footer: boolean };
export type HeroButton = Base & { label: string; url: string; icon: string | null; variant: "primary" | "outline"; is_download: boolean };
export type HeroStat = Base & { value: string; suffix: string | null; label: string };
export type Tag = Base & { grp: "interest" | "community"; label: string; emphasis: boolean };
export type FeaturedItem = Base & { title: string; summary: string; date_label: string | null; links: LinkItem[] };
export type Education = Base & {
  degree: string; institution: string; period: string | null; details: string | null; note: string | null;
  logo_url: string | null; links: LinkItem[];
};
export type FocusPoint = Base & { label: string };
export type ScoreLine = { label: string; score: string; max?: number; min?: number };
export type TestScore = Base & {
  value: string; label: string; note: string | null; score_caption: string;
  breakdown: ScoreLine[]; report_url: string | null; report_label: string;
};
export type SkillGroup = Base & { title: string; items: string[]; highlighted: string[] };
export type Publication = Base & {
  category: "journal" | "conference" | "preprint" | "chapter" | "other";
  anchor: string | null; venue_badge: string | null; status: string; date_label: string | null;
  title: string; authors: string; highlight_author: string | null; venue: string | null;
  abstract: string | null; keywords: string[]; metrics: Metric[]; links: LinkItem[];
  bibtex: string | null; media: MediaItem[]; presentation_note: string | null;
  code_url: string | null; poster_url: string | null; demo_url: string | null;
};
export type ResearchArea = Base & { icon: string; title: string; description: string };
export type Experience = Base & {
  grp: string; period: string | null; title: string; org: string | null; bullets: string[];
  logo_url: string | null; links: LinkItem[];
};
export type Project = Base & {
  featured: boolean; badge: string | null; year_label: string | null; icon: string;
  title: string; description: string; tags: string[]; links: LinkItem[]; pipeline: Step[]; media: MediaItem[];
  category: string;
};
export type Tool = Base & { icon: string; title: string; description: string; features: string[]; tags: string[]; links: LinkItem[]; media: MediaItem[] };
export type Honor = Base & { grp: "award" | "leadership"; year_label: string | null; title: string; subtitle: string | null; links: LinkItem[]; image_url: string | null; description: string | null };
export type Certification = Base & {
  title: string; issuer: string | null; date_label: string | null; url: string | null; description: string | null; topics: string[];
  image_url: string | null; tags: string[];
};

export type Content = {
  settings: Settings;
  sections: Section[];
  headerItems: HeaderItem[];
  socialLinks: SocialLink[];
  heroButtons: HeroButton[];
  heroStats: HeroStat[];
  tags: Tag[];
  featured: FeaturedItem[];
  education: Education[];
  focusPoints: FocusPoint[];
  testScores: TestScore[];
  skillGroups: SkillGroup[];
  publications: Publication[];
  researchAreas: ResearchArea[];
  experiences: Experience[];
  projects: Project[];
  tools: Tool[];
  honors: Honor[];
  certifications: Certification[];
};

const LIST_TABLES = {
  headerItems: "header_items",
  socialLinks: "social_links",
  heroButtons: "hero_buttons",
  heroStats: "hero_stats",
  tags: "tags",
  featured: "featured_items",
  education: "education",
  focusPoints: "focus_points",
  testScores: "test_scores",
  skillGroups: "skill_groups",
  publications: "publications",
  researchAreas: "research_areas",
  experiences: "experiences",
  projects: "projects",
  tools: "tools",
  honors: "honors",
  certifications: "certifications",
} as const;

/**
 * Loads every block of the portfolio in parallel (one round trip per table).
 * Returns null when Supabase isn't configured yet; throws on query errors so
 * Next.js keeps serving the last good page instead of caching a broken one.
 */
export async function getContent(): Promise<Content | null> {
  if (!isSupabaseConfigured) return null;
  const db = createPublicClient();

  const [settingsRes, sectionsRes, ...lists] = await Promise.all([
    db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    db.from("sections").select("*").order("sort_order"),
    ...Object.values(LIST_TABLES).map((t) => db.from(t).select("*").order("sort_order")),
  ]);

  for (const res of [settingsRes, sectionsRes, ...lists]) {
    if (res.error) throw new Error(`Supabase: ${res.error.message}`);
  }
  if (!settingsRes.data) return null;

  const listData = Object.fromEntries(
    Object.keys(LIST_TABLES).map((key, i) => [key, lists[i].data ?? []]),
  );

  return {
    settings: settingsRes.data as Settings,
    sections: (sectionsRes.data ?? []) as Section[],
    ...(listData as Omit<Content, "settings" | "sections">),
  };
}

/** Replaces the {cv} token so buttons can point at whatever CV is uploaded. */
export function resolveUrl(url: string | null | undefined, settings: Settings) {
  if (!url) return null;
  return url.replace("{cv}", settings.cv_url ?? "#");
}

export const DEFAULT_EMAIL_SUBJECT = "Inquiry from your portfolio website";
export const DEFAULT_EMAIL_BODY = "Dear {name},\n\nI came across your portfolio and am interested in your work. I would like to get in touch with you regarding [research collaboration / an opportunity / a question about your work].\n\n[A few lines about yourself and your message.]\n\nI look forward to hearing from you.\n\nBest regards,\n[Your name]\n[Your affiliation / organization]";

/**
 * Adds the admin's default subject and message to a mailto: link so the visitor's
 * email app opens ready to send (they can still edit it). {name} becomes the owner's name.
 * Links that already carry a subject/body are left as they are.
 */
export function withEmailTemplate(url: string, settings: Settings) {
  if (!/^mailto:/i.test(url) || /[?&](subject|body)=/i.test(url)) return url;
  const fill = (t: string) => t.replaceAll("{name}", settings.full_name || "there");
  const subject = fill(settings.email_subject?.trim() || DEFAULT_EMAIL_SUBJECT);
  const body = fill(settings.email_body?.trim() || DEFAULT_EMAIL_BODY).replace(/\r?\n/g, "\r\n");
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const isExternal = (url: string) => /^https?:\/\//i.test(url);
