// Server-side helper: pages talk to our own API endpoints (the waiter),
// exactly like a browser would. Fresh on every request — no caching,
// because review counts should never go stale.
import { headers } from "next/headers";

export async function apiGet(path: string) {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  return fetch(`${proto}://${host}${path}`, { cache: "no-store" });
}
