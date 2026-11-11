// Mood colours for stars: 1-2 red, 3 yellow, 4-5 green.
// A plain module (no "use client") so both server and client components
// can import it — the browser caught us calling a client function from
// the server, which Next.js rightly refuses.

export function moodColor(stars: number): string {
  if (stars <= 2) return "text-mood-red";
  if (stars === 3) return "text-mood-amber";
  return "text-mood-green";
}

export function moodBg(stars: number): string {
  if (stars <= 2) return "bg-mood-red";
  if (stars === 3) return "bg-mood-amber";
  return "bg-mood-green";
}
