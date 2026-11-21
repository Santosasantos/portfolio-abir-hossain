"use client";

import { useEffect } from "react";

const ID_KEY = "pf-visitor-id";
const SESSION_KEY = "pf-visit-recorded";
export const SKIP_KEY = "pf-skip-tracking";

/** Records one visit per browser session. Admins' browsers are skipped (set when they open the admin panel). */
export default function VisitTracker() {
  useEffect(() => {
    try {
      if (localStorage.getItem(SKIP_KEY) || sessionStorage.getItem(SESSION_KEY)) return;
      let id = localStorage.getItem(ID_KEY);
      if (!id) {
        id = crypto.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
        localStorage.setItem(ID_KEY, id);
      }
      sessionStorage.setItem(SESSION_KEY, "1");
      const payload = JSON.stringify({ visitorId: id, path: location.pathname + location.hash, referrer: document.referrer || null });
      fetch("/api/visit", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    } catch {
      // Storage blocked (private mode etc.): skip tracking rather than break the page.
    }
  }, []);
  return null;
}
