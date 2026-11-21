import type { Metadata } from "next";
import type { ComponentType } from "react";
import { getContent, type Content, type Section } from "@/lib/content";
import SiteHeader from "@/components/site/SiteHeader";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Publications from "@/components/site/Publications";
import Research from "@/components/site/Research";
import Experience from "@/components/site/Experience";
import Projects from "@/components/site/Projects";
import Honors from "@/components/site/Honors";
import Tools from "@/components/site/Tools";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import { FONT_OPTIONS } from "@/lib/admin/resources";

// Static page, refreshed on demand when the admin saves (revalidatePath) and hourly as a fallback.
export const revalidate = 3600;

type SectionProps = { c: Content; section: Section; alt: boolean };
const SECTION_COMPONENTS: Record<string, ComponentType<SectionProps>> = {
  about: About,
  publications: Publications,
  research: Research,
  experience: Experience,
  projects: Projects,
  tools: Tools,
  honors: Honors,
  contact: Contact,
};

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  if (!c) return { title: "Portfolio" };
  const s = c.settings;
  return {
    title: s.meta_title || s.full_name,
    description: s.meta_description,
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
    openGraph: { title: s.meta_title || s.full_name, description: s.meta_description, type: "profile", images: s.photo_url ? [s.photo_url] : [] },
  };
}

export default async function HomePage() {
  const c = await getContent();
  if (!c) return <SetupNotice />;

  // Hide sections that have nothing to show (e.g. Tools before any tool is added).
  const empty: Record<string, boolean> = { tools: c.tools.length === 0 };
  const sections = c.sections.filter((s) => s.is_visible && SECTION_COMPONENTS[s.key] && !empty[s.key]);
  const nav = [{ href: "#home", label: "Home" }, ...sections.map((s) => ({ href: `#${s.key}`, label: s.nav_label }))];

  return (
    <>
      <ThemeStyle s={c.settings} />
      <SiteHeader name={c.settings.full_name} logo={c.settings.logo_url} nav={nav} darkMode={c.settings.dark_mode_enabled} />
      <main id="main">
        <Hero c={c} />
        {sections.map((section, i) => {
          const Component = SECTION_COMPONENTS[section.key];
          return <Component key={section.key} c={c} section={section} alt={i % 2 === 0} />;
        })}
      </main>
      <Footer c={c} />
    </>
  );
}

const HEX = /^#[0-9a-f]{6}$/i;
const FONTS = FONT_OPTIONS.map((f) => f.value);

/** Injects the admin-chosen theme as CSS variables, loads the chosen typeface and applies dark mode if allowed. */
function ThemeStyle({ s }: { s: Content["settings"] }) {
  const map: [string, string][] = [
    ["--bg", s.theme_bg], ["--surface", s.theme_surface], ["--surface-alt", s.theme_surface_alt],
    ["--ink", s.theme_ink], ["--muted", s.theme_muted], ["--line", s.theme_border], ["--accent", s.theme_accent],
    ["--dark", s.theme_dark], ["--chip-bg", s.theme_chip_bg], ["--chip-ink", s.theme_chip_ink],
  ];
  const font = FONTS.includes(s.theme_font) ? s.theme_font : "Source Serif 4";
  const vars = map.filter(([, v]) => v && HEX.test(v)).map(([k, v]) => `${k}:${v}`).join(";");
  const css = `:root{${vars};--font:"${font}",Georgia,"Times New Roman",serif}`;
  const fontHref = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:ital,wght@0,400;0,600;1,400&display=swap`;
  const darkScript = s.dark_mode_enabled
    ? `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){}`
    : `document.documentElement.dataset.theme='light'`;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontHref} precedence="default" />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script dangerouslySetInnerHTML={{ __html: darkScript }} />
    </>
  );
}

function SetupNotice() {
  return (
    <main className="setup">
      <div className="card">
        <p className="eyebrow">Setup needed</p>
        <h1>Connect Supabase to load the portfolio</h1>
        <p>Copy <code>.env.example</code> to <code>.env.local</code>, add your Supabase URL and anon key, then run the files in
          <code>supabase/migrations/</code> (in order) and <code>supabase/seed.sql</code> in the Supabase SQL editor.
          The README has the full steps.</p>
      </div>
    </main>
  );
}
