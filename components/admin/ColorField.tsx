"use client";

import { useState } from "react";

/** Hex color with a native picker and a text box kept in sync. */
export default function ColorField({ id, name, initial }: { id: string; name: string; initial: string }) {
  const [value, setValue] = useState(initial || "#000000");
  const valid = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <div className="color-field">
      <input type="color" value={valid ? value : "#000000"} onChange={(e) => setValue(e.target.value.toUpperCase())} aria-label="Pick color" />
      <input id={id} type="text" name={name} value={value} onChange={(e) => setValue(e.target.value)} maxLength={7}
             pattern="#[0-9A-Fa-f]{6}" className="mono" />
      <span className="color-swatch" style={{ background: valid ? value : "transparent" }} aria-hidden="true" />
    </div>
  );
}
