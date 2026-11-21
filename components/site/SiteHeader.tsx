"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/lib/icons";

type NavItem = { href: string; label: string };

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

export default function SiteHeader({ name, logo, nav, darkMode }: { name: string; logo?: string | null; nav: NavItem[]; darkMode: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(nav[0]?.href ?? "");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setShowTop(y > 700);
      const pos = y + window.innerHeight * 0.3;
      let current = nav[0]?.href ?? "";
      for (const item of nav) {
        const el = document.querySelector<HTMLElement>(item.href);
        if (el && el.offsetTop <= pos) current = item.href;
      }
      if (window.innerHeight + y >= document.body.scrollHeight - 4) current = nav[nav.length - 1]?.href ?? current;
      setActive(current);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, [nav]);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch { /* storage unavailable */ }
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container">
          <a className="brand" href="#home" aria-label={`${name} — home`}>
            {logo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img className="brand-logo" src={logo} alt="" width={36} height={36} />
              : <span className="brand-logo brand-logo--initials" aria-hidden="true">{initials(name)}</span>}
            <span className="brand-name">{name}</span>
          </a>
          <nav className="nav" aria-label="Primary">
            <ul id="nav-menu" className={open ? "is-open" : undefined}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={active === item.href ? "is-active" : undefined} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-actions">
              {darkMode && (
                <button className="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode" onClick={toggleTheme}>
                  <span className="icon-sun"><Icon name="moon" /></span>
                  <span className="icon-moon"><Icon name="sun" /></span>
                </button>
              )}
              <button className="icon-btn nav-toggle" type="button" aria-expanded={open} aria-controls="nav-menu"
                      aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
                <Icon name="menu" />
              </button>
            </div>
          </nav>
        </div>
      </header>
      <button className={`icon-btn to-top${showTop ? " is-visible" : ""}`} type="button" aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0 })}>
        <Icon name="up" />
      </button>
    </>
  );
}
