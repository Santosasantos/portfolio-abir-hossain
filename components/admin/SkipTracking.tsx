"use client";

import { useEffect } from "react";

/** Marks this browser as the owner's so their own visits don't inflate the visitor numbers. */
export default function SkipTracking() {
  useEffect(() => {
    try { localStorage.setItem("pf-skip-tracking", "1"); } catch { /* storage blocked */ }
  }, []);
  return null;
}
