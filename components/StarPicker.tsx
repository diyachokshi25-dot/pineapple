"use client";

// The star picker. Mood colouring as specified:
//   1-2 stars -> red, 3 stars -> yellow, 4-5 stars -> green.
// Clicking a star hands a number to the parent — no maths happens here.
import { useState } from "react";
import { moodColor } from "@/lib/mood";

export default function StarPicker({
  value,
  onSelect,
  size = "text-3xl",
}: {
  value: number | null;
  onSelect: (stars: number) => void;
  size?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={`${size} leading-none transition-transform hover:scale-125 focus:scale-125 ${
            n <= shown ? `${moodColor(n)} drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]` : "text-black/25"
          }`}
          onClick={() => onSelect(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
        >
          <span key={n <= shown ? "lit" : "dim"} className="inline-block star-pop">
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
