"use client";

// The homepage's interactive part: search box + cuisine/area filters on top,
// restaurant banner-cards below. Filtering here is pure UI — the numbers on
// each card (average, count) were computed by the API, not by us.
import Link from "next/link";
import { useMemo, useState } from "react";
import FoodImage from "./FoodImage";
import type { RestaurantSummary } from "@/lib/types";

const FOOD_PICTURE: Record<number, { src: string; emoji: string }> = {
  1: { src: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=900&q=80", emoji: "🌯" },
  2: { src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=80", emoji: "🌮" },
  3: { src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&q=80", emoji: "🍛" },
  4: { src: "https://images.unsplash.com/photo-1568901346375-23c9450c5869?w=900&q=80", emoji: "🍔" },
  5: { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80", emoji: "🍸" },
};

function ratingBadge(avg: number | null, count: number) {
  if (avg === null) {
    return (
      <span className="rounded-lg bg-black/20 px-2 py-1 text-xs font-bold text-cream">
        New — no reviews yet
      </span>
    );
  }
  const color = avg >= 4 ? "bg-mood-green" : avg === 3 ? "bg-mood-amber" : "bg-mood-red";
  return (
    <span className={`rounded-lg ${color} px-2 py-1 text-xs font-black text-white shadow`}>
      ★ {avg.toFixed(1)} · {count} reviews
    </span>
  );
}

export default function RestaurantBrowser({
  restaurants,
}: {
  restaurants: RestaurantSummary[];
}) {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("all");
  const [area, setArea] = useState("all");

  const cuisines = useMemo(
    () => [...new Set(restaurants.map((r) => r.cuisine))],
    [restaurants]
  );
  const areas = useMemo(
    () => [...new Set(restaurants.map((r) => r.area))],
    [restaurants]
  );

  // Display-layer filtering of the list the API already gave us.
  const visible = restaurants.filter(
    (r) =>
      (cuisine === "all" || r.cuisine === cuisine) &&
      (area === "all" || r.area === area) &&
      (query.trim() === "" ||
        r.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      {/* Filters on top */}
      <div className="fade-up sticky top-[60px] z-30 my-4 flex flex-wrap items-center gap-2 rounded-2xl bg-cream/90 p-3 shadow-md shadow-black/5 ring-1 ring-crust/10 backdrop-blur sm:my-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search restaurants…"
          className="w-full min-w-40 flex-1 rounded-xl border border-crust/20 bg-white px-3 py-2 text-sm font-medium text-crust-dark outline-none placeholder:text-crust/40 focus:border-grape focus:ring-2 focus:ring-grape/30"
        />
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="rounded-xl border border-crust/20 bg-white px-3 py-2 text-sm font-semibold text-crust-dark outline-none focus:border-grape"
        >
          <option value="all">All cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="rounded-xl border border-crust/20 bg-white px-3 py-2 text-sm font-semibold text-crust-dark outline-none focus:border-grape"
        >
          <option value="all">All areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Restaurant banners */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => {
          const pic = FOOD_PICTURE[r.id] ?? { src: "", emoji: "🍽️" };
          return (
            <Link
              key={r.id}
              href={`/restaurant/${r.id}`}
              className="pop fade-up group overflow-hidden rounded-3xl bg-white shadow-lg shadow-crust/10 ring-1 ring-crust/10"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <FoodImage
                  src={pic.src}
                  alt={`Food at ${r.name}`}
                  emoji={pic.emoji}
                  className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                  <h2 className="text-xl font-black text-white drop-shadow">{r.name}</h2>
                  <p className="text-xs font-semibold text-pineapple">
                    {r.cuisine} · {r.area}
                  </p>
                </div>
                <div className="absolute right-3 top-3">{ratingBadge(r.averageRating, r.totalReviews)}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-center font-semibold text-crust/60">
          No restaurants match those filters. Loosen up a little 🍍
        </p>
      )}
    </div>
  );
}
