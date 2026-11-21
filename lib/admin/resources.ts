/**
 * The whole admin panel is generated from this file.
 * To make a new table editable: add a migration, then add one entry here.
 */
import { ICON_OPTIONS } from "@/lib/icons";

export type FieldType =
  | "text" | "textarea" | "url" | "number" | "date" | "boolean"
  | "select" | "icon"
  | "tags"   // text[]  — comma separated
  | "lines"  // text[]  — one item per line
  | "links"  // jsonb [{label,url}]   — "Label | URL" per line
  | "pairs"  // jsonb [{value,label}] — "Value | Label" per line
  | "steps"  // jsonb [{title,text}]  — "Title | Text" per line
  | "scores" // jsonb [{label,score,max,min}] — "Label | Score | Max | Min" per line
  | "file"   // single upload to Supabase Storage (photo, CV) with preview
  | "media"  // gallery: images, GIFs, video links, PPTX, PDF — with live previews
  | "color"; // hex color with picker

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  accept?: string;   // file inputs
  mono?: boolean;    // monospace textarea (BibTeX)
  group?: string;    // fieldset heading in long forms
};

export type Resource = {
  key: string;        // URL slug: /admin/<key>
  table: string;
  label: string;
  description: string;
  nav: "Profile" | "About" | "Research" | "Career" | "Layout";
  singleton?: boolean;              // one row (id = 1), edit-only
  pk?: "id" | "key";
  canCreate?: boolean;              // default true
  columns: string[];                // shown in the list table
  fields: Field[];
};

const icon = (name = "icon", label = "Icon"): Field => ({ name, label, type: "icon", options: ICON_OPTIONS });

export const FONT_OPTIONS = ["Source Serif 4", "Newsreader", "Fraunces", "Lora", "Merriweather", "Libre Baskerville", "EB Garamond"]
  .map((f) => ({ value: f, label: f }));

const color = (name: string, label: string, hint?: string): Field => ({ name, label, type: "color", group: "Theme", hint });

export const RESOURCES: Resource[] = [
  /* ---------------- Profile ---------------- */
  {
    key: "settings", table: "site_settings", label: "Site settings", nav: "Profile", singleton: true,
    description: "Name, headline, bio, photo, CV, status card, background text, contact text, SEO and theme colors.",
    columns: [],
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true, group: "Identity" },
      { name: "headline", label: "Headline", type: "text", group: "Identity", hint: "Shown under the name in the hero." },
      { name: "logo_url", label: "Logo (navbar)", type: "file", accept: "image/*", group: "Identity", hint: "Shown beside your name in the top bar. Square PNG/SVG works best. Leave empty to show your initials." },
      { name: "photo_url", label: "Profile photo", type: "file", accept: "image/*", group: "Identity", hint: "Square image, about 600×600." },
      { name: "cv_url", label: "CV (PDF)", type: "file", accept: "application/pdf", group: "Identity", hint: "Buttons with the URL {cv} point here." },
      { name: "bio", label: "Hero bio", type: "textarea", group: "Hero" },
      { name: "interests_line", label: "Interests line (italic)", type: "text", group: "Hero" },
      { name: "interests_label", label: "Interests label", type: "text", group: "Hero" },
      { name: "featured_label", label: "Featured work label", type: "text", group: "Hero" },
      { name: "status_enabled", label: "Show status card", type: "boolean", group: "Status card" },
      { name: "status_label", label: "Status label", type: "text", group: "Status card" },
      { name: "status_title", label: "Status title", type: "text", group: "Status card" },
      { name: "status_body", label: "Status text", type: "textarea", group: "Status card" },
      { name: "background", label: "About → Background", type: "textarea", group: "About", hint: "Leave a blank line between paragraphs." },
      { name: "scholar_url", label: "Google Scholar URL", type: "url", group: "Publications" },
      { name: "scholar_citations", label: "Citations", type: "number", group: "Publications" },
      { name: "scholar_h_index", label: "h-index", type: "number", group: "Publications" },
      { name: "contact_intro", label: "Contact intro", type: "textarea", group: "Contact & footer" },
      { name: "contact_note", label: "Contact note", type: "text", group: "Contact & footer" },
      { name: "footer_blurb", label: "Footer blurb", type: "textarea", group: "Contact & footer" },
      { name: "last_updated", label: "Last updated", type: "date", group: "Contact & footer" },
      { name: "meta_title", label: "Page title (SEO)", type: "text", group: "SEO" },
      { name: "meta_description", label: "Meta description (SEO)", type: "textarea", group: "SEO" },
      { name: "theme_font", label: "Typeface", type: "select", group: "Theme", options: FONT_OPTIONS, hint: "Used for all text, like the reference site." },
      color("theme_bg", "Page background"),
      color("theme_surface", "Card background"),
      color("theme_surface_alt", "Alternate section background"),
      color("theme_ink", "Text"),
      color("theme_muted", "Secondary text"),
      color("theme_border", "Borders"),
      color("theme_accent", "Accent", "Section underline, highlights and links on hover."),
      color("theme_dark", "Dark (buttons, footer)"),
      color("theme_chip_bg", "Interest chip background"),
      color("theme_chip_ink", "Interest chip text"),
      { name: "dark_mode_enabled", label: "Offer a dark-mode toggle to visitors", type: "boolean", group: "Theme" },
      { name: "achievements_visible", label: "Awards shown before “Show more”", type: "number", group: "Theme" },
    ],
  },
  {
    key: "header-items", table: "header_items", label: "Header info", nav: "Profile",
    description: "Lines under the name (institution, location, email, phone). Each can link somewhere.",
    columns: ["icon", "label", "url", "in_hero", "in_contact"],
    fields: [
      icon(),
      { name: "label", label: "Text", type: "text", required: true },
      { name: "url", label: "Link", type: "text", hint: "https://…, mailto:you@example.com or tel:+880…" },
      { name: "in_hero", label: "Show in hero", type: "boolean" },
      { name: "in_contact", label: "Show in contact section", type: "boolean" },
    ],
  },
  {
    key: "social-links", table: "social_links", label: "Social links", nav: "Profile",
    description: "Profiles such as Google Scholar, GitHub, LinkedIn, Kaggle and ResearchGate.",
    columns: ["icon", "label", "url", "in_hero", "in_contact", "in_footer"],
    fields: [
      icon(),
      { name: "label", label: "Label", type: "text", required: true },
      { name: "url", label: "URL", type: "text", required: true },
      { name: "in_hero", label: "Show in hero", type: "boolean" },
      { name: "in_contact", label: "Show as contact button", type: "boolean" },
      { name: "in_footer", label: "Show in footer", type: "boolean" },
    ],
  },
  {
    key: "hero-buttons", table: "hero_buttons", label: "Hero buttons", nav: "Profile",
    description: "Call-to-action buttons in the hero. Use {cv} as the URL to link the uploaded CV.",
    columns: ["label", "url", "variant"],
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "url", label: "URL", type: "text", required: true, hint: "https://…, #publications, or {cv}" },
      { ...icon(), label: "Icon (optional)" },
      { name: "variant", label: "Style", type: "select", options: [{ value: "primary", label: "Primary (filled)" }, { value: "outline", label: "Outline" }] },
      { name: "is_download", label: "Download link", type: "boolean" },
    ],
  },
  {
    key: "hero-stats", table: "hero_stats", label: "Hero stats", nav: "Profile",
    description: "Small number tiles under the photo.",
    columns: ["value", "suffix", "label"],
    fields: [
      { name: "value", label: "Value", type: "text", required: true },
      { name: "suffix", label: "Suffix", type: "text", hint: "e.g. %" },
      { name: "label", label: "Label", type: "text", required: true },
    ],
  },
  {
    key: "featured", table: "featured_items", label: "Featured work", nav: "Profile",
    description: "Highlights listed in the hero's Featured Work card.",
    columns: ["title", "date_label"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "date_label", label: "Date", type: "text" },
      { name: "links", label: "Links", type: "links", hint: "One per line: Label | URL" },
    ],
  },
  {
    key: "tags", table: "tags", label: "Interests & community", nav: "Profile",
    description: "Research-interest chips in the hero and community chips in Honors.",
    columns: ["grp", "label", "emphasis"],
    fields: [
      { name: "grp", label: "Group", type: "select", options: [{ value: "interest", label: "Research interest" }, { value: "community", label: "Community" }] },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "emphasis", label: "Highlighted (teal) chip", type: "boolean" },
    ],
  },

  /* ---------------- About ---------------- */
  {
    key: "education", table: "education", label: "Education", nav: "About",
    description: "Degrees shown in the About → Education card.",
    columns: ["degree", "institution", "period"],
    fields: [
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text" },
      { name: "period", label: "Period", type: "text" },
      { name: "details", label: "Details", type: "text", hint: "e.g. CGPA, scholarships" },
      { name: "note", label: "Note", type: "textarea", hint: "e.g. thesis title" },
      { name: "logo_url", label: "Institution logo", type: "file", accept: "image/*", hint: "Optional. Shown on the education card when uploaded." },
      { name: "links", label: "Documents", type: "links", hint: "Optional. One button per line: Certificate | https://…  ·  Transcript | https://…  ·  Thesis Book | https://…" },
    ],
  },
  {
    key: "focus-points", table: "focus_points", label: "Research focus", nav: "About",
    description: "Bullet points in the About → Research Focus card.",
    columns: ["label"],
    fields: [{ name: "label", label: "Point", type: "text", required: true }],
  },
  {
    key: "test-scores", table: "test_scores", label: "Test scores", nav: "About",
    description: "GRE, IELTS and other score tiles.",
    columns: ["value", "label", "note"],
    fields: [
      { name: "label", label: "Test name", type: "text", required: true, hint: "e.g. IELTS, GRE General" },
      { name: "value", label: "Overall score", type: "text", required: true, hint: "e.g. 7.0 or 306" },
      { name: "score_caption", label: "Score caption", type: "text", hint: "Shown beside the big number, e.g. Overall Band, Total Score" },
      { name: "breakdown", label: "Section scores", type: "scores", hint: "One per line: Label | Score | Max | Min (Min optional). e.g. Listening | 7.5 | 9   ·   Quant | 167 | 170 | 130" },
      { name: "note", label: "Test date", type: "text", hint: "e.g. Sep 22, 2026" },
      { name: "report_url", label: "Test report link", type: "url", hint: "Optional. Adds the download button; leave empty to hide it." },
      { name: "report_label", label: "Report button text", type: "text", hint: "e.g. Download Test Report" },
    ],
  },
  {
    key: "skills", table: "skill_groups", label: "Skills", nav: "About",
    description: "Technical expertise groups.",
    columns: ["title", "items"],
    fields: [
      { name: "title", label: "Group title", type: "text", required: true },
      { name: "items", label: "Skills", type: "tags", hint: "Comma separated" },
      { name: "highlighted", label: "Highlighted skills", type: "tags", hint: "Comma separated; must match names above" },
    ],
  },

  /* ---------------- Research ---------------- */
  {
    key: "publications", table: "publications", label: "Publications", nav: "Research",
    description: "Papers with metrics, abstract, links and BibTeX.",
    columns: ["title", "media", "category", "status", "date_label"],
    fields: [
      { name: "category", label: "Category", type: "select", group: "Basics", options: [
        { value: "journal", label: "Journal article" }, { value: "conference", label: "Conference paper" },
        { value: "chapter", label: "Book chapter" }, { value: "preprint", label: "Preprint / under review" }, { value: "other", label: "Other" }] },
      { name: "title", label: "Title", type: "text", required: true, group: "Basics" },
      { name: "authors", label: "Authors", type: "text", group: "Basics" },
      { name: "highlight_author", label: "Bold this author", type: "text", group: "Basics", hint: "e.g. A. Hasan" },
      { name: "venue", label: "Venue", type: "textarea", group: "Basics" },
      { name: "venue_badge", label: "Venue badge", type: "text", group: "Basics", hint: "Short, e.g. IEEE ICCIT 2023" },
      { name: "status", label: "Status", type: "text", group: "Basics", hint: "Published, Accepted, Under Review…" },
      { name: "date_label", label: "Date", type: "text", group: "Basics" },
      { name: "anchor", label: "Anchor id", type: "text", group: "Basics", hint: "Lets other links jump here, e.g. pub-transfer" },
      { name: "abstract", label: "Abstract", type: "textarea", group: "Content" },
      { name: "metrics", label: "Key results", type: "pairs", group: "Content", hint: "One per line: 99.16% | InceptionResNetV2 · Dataset II" },
      { name: "keywords", label: "Keywords", type: "tags", group: "Content" },
      { name: "links", label: "Links", type: "links", group: "Links", hint: "One per line: IEEE Xplore | https://…" },
      { name: "bibtex", label: "BibTeX", type: "textarea", mono: true, group: "Links" },
      { name: "media", label: "Figures, video & slides", type: "media", group: "Media",
        hint: "Figures appear beside the paper. Videos and slide decks appear in the Conference Presentation panel and add Video / Slides buttons automatically." },
      { name: "presentation_note", label: "Presentation note", type: "text", group: "Media", hint: "e.g. Presented at ICCIT 2023, Cox's Bazar" },
      { name: "code_url", label: "Code URL", type: "url", group: "Artifacts", hint: "Leave empty to show “Code: Not available”." },
      { name: "poster_url", label: "Poster URL", type: "url", group: "Artifacts" },
      { name: "demo_url", label: "Demo URL", type: "url", group: "Artifacts" },
    ],
  },
  {
    key: "research-areas", table: "research_areas", label: "Research areas", nav: "Research",
    description: "Cards in the Research Areas section.",
    columns: ["icon", "title"],
    fields: [icon(), { name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea" }],
  },
  {
    key: "projects", table: "projects", label: "Projects", nav: "Research",
    description: "Featured projects (with a pipeline) and the project grid, grouped into tabs by the Tab field.",
    columns: ["title", "media", "category", "year_label", "featured"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Tab", type: "text", hint: "The tab this project appears under, e.g. Research or Coursework. Projects with the same name share a tab; an All tab is added automatically. Empty = Projects." },
      { name: "description", label: "Description", type: "textarea" },
      { name: "year_label", label: "Year / label", type: "text" },
      icon(),
      { name: "tags", label: "Tags", type: "tags" },
      { name: "links", label: "Links", type: "links", hint: "One per line: GitHub | https://…" },
      { name: "featured", label: "Featured (large card)", type: "boolean" },
      { name: "badge", label: "Featured badge", type: "text" },
      { name: "pipeline", label: "Pipeline steps", type: "steps", hint: "Featured only. One per line: Data | 3,264 MRI images" },
      { name: "media", label: "Screenshots, GIFs & video", type: "media", hint: "The first image (or one marked Card thumbnail) becomes the card image." },
    ],
  },
  {
    key: "tools", table: "tools", label: "Tools & demos", nav: "Research",
    description: "Research software and interactive demos with screenshots, features and demo links.",
    columns: ["title", "media", "tags"],
    fields: [
      icon(),
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "features", label: "Features", type: "lines", hint: "One per line; shown as a checklist" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "links", label: "Buttons", type: "links", hint: "One per line: Try Demo | https://…  ·  Source Code | https://github.com/…" },
      { name: "media", label: "Screenshot, GIF or video", type: "media" },
    ],
  },

  /* ---------------- Career ---------------- */
  {
    key: "experience", table: "experiences", label: "Experience", nav: "Career",
    description: "Professional and academic timeline entries.",
    columns: ["title", "org", "period", "grp"],
    fields: [
      { name: "grp", label: "Section", type: "text", required: true, hint: "The heading this entry is listed under, e.g. Professional Experience, Academic & Research Experience, Industrial Training. Entries with the same name are grouped; sections follow the list order." },
      { name: "title", label: "Role", type: "text", required: true },
      { name: "org", label: "Organization · location", type: "text" },
      { name: "period", label: "Period", type: "text" },
      { name: "bullets", label: "Highlights", type: "lines", hint: "One per line" },
      { name: "logo_url", label: "Organization logo", type: "file", accept: "image/*", hint: "Optional. Shown beside the role when uploaded." },
      { name: "links", label: "Work links", type: "links", hint: "Optional. One per line: Thesis Book | https://…  ·  Industrial Attachment Report | https://…  ·  Presentation Slides | https://…" },
    ],
  },
  {
    key: "honors", table: "honors", label: "Awards & leadership", nav: "Career",
    description: "Awards and leadership roles.",
    columns: ["title", "year_label", "grp"],
    fields: [
      { name: "grp", label: "Group", type: "select", options: [{ value: "award", label: "Award" }, { value: "leadership", label: "Leadership" }] },
      { name: "year_label", label: "Year", type: "text" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Event / organizer", type: "text", hint: "Shown under the title in the accent color." },
      { name: "description", label: "Description", type: "textarea", hint: "Awards only. A sentence or two shown on the card." },
      { name: "image_url", label: "Photo", type: "file", accept: "image/*", hint: "Awards only. Optional; an award icon is shown when empty." },
      { name: "links", label: "Links", type: "links", hint: "Optional. One button per line: Certificate | https://…  ·  Award | https://…  ·  News | https://…" },
    ],
  },
  {
    key: "certifications", table: "certifications", label: "Certifications", nav: "Career",
    description: "Courses and certificates, shown as cards with the certificate image.",
    columns: ["title", "issuer", "date_label"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text" },
      { name: "date_label", label: "Date", type: "text" },
      { name: "tags", label: "Tags", type: "tags", hint: "Comma separated, shown as chips like on projects, e.g. Python, Data Science" },
      { name: "image_url", label: "Certificate image", type: "file", accept: "image/*", hint: "A screenshot or scan of the certificate (landscape works best). Leave empty to show the issuer name instead." },
      { name: "url", label: "Certificate link", type: "url", hint: "Opens from the card's “Check the Certificate” button. Leave empty to hide the button." },
      { name: "description", label: "Description (not shown on cards)", type: "textarea" },
      { name: "topics", label: "Key topics (not shown on cards)", type: "lines", hint: "One per line" },
    ],
  },

  /* ---------------- Layout ---------------- */
  {
    key: "sections", table: "sections", label: "Sections & menu", nav: "Layout", pk: "key", canCreate: false,
    description: "Rename, reorder or hide whole sections and their menu labels.",
    columns: ["key", "nav_label", "title"],
    fields: [
      { name: "nav_label", label: "Menu label", type: "text", required: true },
      { name: "title", label: "Section title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
    ],
  },
];

export const NAV_GROUPS = ["Profile", "About", "Research", "Career", "Layout"] as const;

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key) ?? null;
}
