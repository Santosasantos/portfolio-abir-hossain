import type { ReactNode } from "react";

/* One small icon set shared by the site and the admin panel. */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONS: Record<string, { label: string; svg: ReactNode }> = {
  building: { label: "Building / institution", svg: <g {...stroke}><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 9h2a2 2 0 0 1 2 2v10" /><path d="M8 7h4M8 11h4M8 15h4M3 21h18" /></g> },
  pin: { label: "Location pin", svg: <g {...stroke}><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></g> },
  mail: { label: "Email", svg: <g {...stroke}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></g> },
  phone: { label: "Phone", svg: <g {...stroke}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></g> },
  globe: { label: "Website", svg: <g {...stroke}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></g> },
  cap: { label: "Graduation cap", svg: <g {...stroke}><path d="M2 9l10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /><path d="M22 9v6" /></g> },
  scholar: { label: "Google Scholar", svg: <path fill="currentColor" d="M12 3 1 9.5l4 2.4V17l7 4 7-4v-5.1l2-1.2V16h2V9.5L12 3Zm0 2.3 7.3 4.2L12 13.7 4.7 9.5 12 5.3ZM7 13.1l5 2.9 5-2.9v2.8l-5 2.9-5-2.9v-2.8Z" /> },
  github: { label: "GitHub", svg: <path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /> },
  linkedin: { label: "LinkedIn", svg: <path fill="currentColor" d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.2 2.4 4.2 5.4v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" /> },
  kaggle: { label: "Kaggle", svg: <path fill="currentColor" d="M18.8 23.6c0 .3-.1.4-.4.4h-3.1c-.2 0-.4-.1-.5-.3l-5.2-6.6-1.4 1.4v5.1c0 .3-.1.4-.4.4H5.4c-.3 0-.4-.1-.4-.4V.4C5 .1 5.1 0 5.4 0h2.4c.3 0 .4.1.4.4v14.4l6.2-6.2c.2-.2.4-.3.6-.3h3.2c.1 0 .3.1.3.2v.3l-6.5 6.3 6.8 8.4.1.1Z" /> },
  researchgate: { label: "ResearchGate", svg: <path fill="currentColor" d="M2 2h20v20H2V2Zm11.6 4.1c-1.7 0-2.6 1.1-2.6 2.6v.9c0 1.6.9 2.6 2.6 2.6 1.3 0 2.2-.6 2.4-1.7v-1.6h-2.3v.9h1.2v.5c-.1.6-.6 1-1.3 1-.9 0-1.4-.6-1.4-1.7v-.9c0-1 .5-1.6 1.4-1.6.6 0 1 .3 1.2.8h1.1c-.2-1.1-1.1-1.7-2.3-1.7ZM5.5 9.3v8.4h1.6v-3.4h1l1.8 3.4h1.8l-2-3.7c1-.4 1.6-1.2 1.6-2.3 0-1.5-1.1-2.4-2.8-2.4H5.5Zm1.6 1.3h1.3c.8 0 1.2.4 1.2 1.1s-.4 1.1-1.2 1.1H7.1v-2.2Z" /> },
  orcid: { label: "ORCID", svg: <g><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M8 7.5v.01M8 10v7M11 10v7h2.5a3.5 3.5 0 0 0 0-7H11" fill="none" stroke="var(--color-surface)" strokeWidth="1.6" strokeLinecap="round" /></g> },
  x: { label: "X / Twitter", svg: <path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" /> },
  facebook: { label: "Facebook", svg: <path fill="currentColor" d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8Z" /> },
  youtube: { label: "YouTube", svg: <path fill="currentColor" d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15V9l5.2 3L10 15Z" /> },
  file: { label: "Document / PDF", svg: <g {...stroke}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></g> },
  link: { label: "Link", svg: <g {...stroke}><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" /></g> },
  play: { label: "Play", svg: <g {...stroke}><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5 3.5-5 3.5v-7Z" /></g> },
  calendar: { label: "Calendar", svg: <g {...stroke}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></g> },
  slides: { label: "Slides", svg: <g {...stroke}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M12 16v4M8 20h8M10 8l4 2-4 2V8Z" /></g> },
  quote: { label: "Citation", svg: <g {...stroke}><path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" /></g> },
  download: { label: "Download", svg: <g {...stroke}><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></g> },
  arrow: { label: "External arrow", svg: <g {...stroke}><path d="M7 17 17 7M8 7h9v9" /></g> },
  brain: { label: "Brain", svg: <g {...stroke}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3 3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Z" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 3 3 0 0 1-3-3" /></g> },
  layers: { label: "Layers", svg: <g {...stroke}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></g> },
  eye: { label: "Eye", svg: <g {...stroke}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></g> },
  dna: { label: "DNA", svg: <g {...stroke}><path d="M6 3c0 6 12 6 12 12M6 21c0-6 12-6 12-12" /><path d="M8 6h8M8 18h8M9.5 9h5M9.5 15h5" /></g> },
  bulb: { label: "Light bulb", svg: <g {...stroke}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.9 1 .9 1.6V16h5.2v-.5c0-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z" /></g> },
  chart: { label: "Chart", svg: <g {...stroke}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></g> },
  lock: { label: "Lock", svg: <g {...stroke}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></g> },
  cpu: { label: "Chip", svg: <g {...stroke}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></g> },
  code: { label: "Code", svg: <g {...stroke}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></g> },
  award: { label: "Award", svg: <g {...stroke}><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" /></g> },
  sun: { label: "Sun", svg: <g {...stroke}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></g> },
  moon: { label: "Moon", svg: <g {...stroke}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></g> },
  menu: { label: "Menu", svg: <g {...stroke}><path d="M4 7h16M4 12h16M4 17h16" /></g> },
  up: { label: "Up arrow", svg: <g {...stroke}><path d="M12 19V5m0 0-6 6m6-6 6 6" /></g> },
};

export const ICON_OPTIONS = Object.entries(ICONS)
  .filter(([k]) => !["sun", "moon", "menu", "up"].includes(k))
  .map(([value, { label }]) => ({ value, label }));

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const icon = ICONS[name ?? ""] ?? ICONS.globe;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {icon.svg}
    </svg>
  );
}
