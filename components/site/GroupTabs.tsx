"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabGroup = { key: string; label: string; count: number; content: ReactNode };

/**
 * Tabs that filter groups rendered once on the server: "All" shows every group,
 * a single tab shows just that group. Each item exists once in the page, so in-page links (#pub-…)
 * keep working: following one switches back to "All" if its group is hidden.
 */
export default function GroupTabs({ id, label, groups }: { id: string; label: string; groups: TabGroup[] }) {
  const tabs = [{ key: "all", label: "All", count: groups.reduce((n, g) => n + g.count, 0) }, ...groups];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = () => {
      const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target && root.current?.contains(target) && target.closest("[hidden]")) {
        setActive(0);
        requestAnimationFrame(() => target.scrollIntoView());
      }
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    const next = e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  const current = tabs[active].key;
  return (
    <div ref={root}>
      <div className="tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${t.key}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            className="tab"
            onClick={() => setActive(i)}
            onKeyDown={onKey}
          >
            {t.label}<span className="tab-count">{t.count}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${current}`} className="tab-panel">
        {groups.map((g) => (
          <div key={g.key} className="tab-group" hidden={current !== "all" && current !== g.key}>
            {g.content}
          </div>
        ))}
      </div>
    </div>
  );
}
