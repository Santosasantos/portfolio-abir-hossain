"use client";

import { useRef, useState, type ReactNode, type KeyboardEvent } from "react";

export type ProjectTab = { key: string; label: string; count: number; panel: ReactNode };

/** Accessible tab strip for the Projects section. Panels are rendered on the server and passed in. */
export default function ProjectTabs({ id, tabs }: { id: string; tabs: ProjectTab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Project categories">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${t.key}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${t.key}`}
            tabIndex={i === active ? 0 : -1}
            className="tab"
            onClick={() => setActive(i)}
            onKeyDown={onKey}
          >
            {t.label}<span className="tab-count">{t.count}</span>
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.key} role="tabpanel" id={`${id}-panel-${t.key}`} aria-labelledby={`${id}-tab-${t.key}`} hidden={i !== active} className="tab-panel">
          {t.panel}
        </div>
      ))}
    </>
  );
}
