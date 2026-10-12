"use client";

import { useEffect, useRef, useState } from "react";

/** Profile photo with an initials fallback if the image is missing or fails to load. */
export default function Portrait({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  // The image can fail before hydration attaches onError, so check once on mount too.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="portrait">
      {src && !failed
        // eslint-disable-next-line @next/next/no-img-element
        ? <img ref={img} src={src} alt={`Portrait of ${name}`} width={260} height={260} onError={() => setFailed(true)} />
        : <div className="portrait-fallback" role="img" aria-label={name}>{initials}</div>}
    </div>
  );
}
