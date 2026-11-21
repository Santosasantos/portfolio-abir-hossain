import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|monitor|curl|wget|python-requests/i;

/** Very small user-agent reader: enough for "Mobile · Chrome · Android" style breakdowns. */
function readAgent(ua: string) {
  const device = /ipad|tablet/i.test(ua) ? "Tablet" : /mobi|iphone|android/i.test(ua) ? "Mobile" : "Desktop";
  const browser =
    /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /samsungbrowser/i.test(ua) ? "Samsung Internet"
    : /firefox|fxios/i.test(ua) ? "Firefox" : /chrome|crios/i.test(ua) ? "Chrome" : /safari/i.test(ua) ? "Safari" : "Other";
  const os =
    /windows/i.test(ua) ? "Windows" : /iphone|ipad|ios/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android"
    : /mac os/i.test(ua) ? "macOS" : /linux/i.test(ua) ? "Linux" : "Other";
  return { device, browser, os };
}

const clip = (v: unknown, n: number) => (typeof v === "string" && v ? v.slice(0, n) : null);

/** Records one visit. Country/city come from the host's geo headers (Vercel, Cloudflare); no IP is stored. */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) return new NextResponse(null, { status: 204 });
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: { visitorId?: unknown; path?: unknown; referrer?: unknown } = {};
  try { body = await req.json(); } catch { /* empty body */ }
  const visitorId = clip(body.visitorId, 64);
  if (!visitorId || visitorId.length < 8) return new NextResponse(null, { status: 204 });

  // Ignore links from the site itself so only real sources (Google, LinkedIn…) show up.
  let referrer = clip(body.referrer, 500);
  try { if (referrer && new URL(referrer).host === req.nextUrl.host) referrer = null; } catch { referrer = null; }

  const decode = (v: string | null) => { try { return v ? decodeURIComponent(v) : null; } catch { return v; } };
  const country = req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry");
  const city = decode(req.headers.get("x-vercel-ip-city"));

  await createPublicClient().from("visits").insert({
    visitor_id: visitorId,
    path: clip(body.path, 300) ?? "/",
    referrer,
    country: country && country !== "XX" ? country.slice(0, 64) : null,
    city: clip(city, 120),
    ...readAgent(ua),
  });
  return new NextResponse(null, { status: 204 });
}
