"use client";

// Amazon-style star filter for the comments. Clicking a star asks the API
// for "only the N-star reviews" — the backend filters, the frontend prints.
// The counts on the chips also come from the API (ratingCounts).
import { useState } from "react";
import { moodBg, moodColor } from "@/lib/mood";
import type { Review } from "@/lib/types";

export default function ReviewsSection({
  restaurantId,
  initialReviews,
  initialCounts,
}: {
  restaurantId: number;
  initialReviews: Review[];
  initialCounts: Record<string, number>;
}) {
  const [stars, setStars] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [loading, setLoading] = useState(false);

  async function filter(next: number | null) {
    setStars(next);
    setLoading(true);
    try {
      const qs = next === null ? "" : `?stars=${next}`;
      const res = await fetch(`/api/restaurants/${restaurantId}${qs}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setCounts(data.ratingCounts);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black text-crust-dark">
        What people are saying
      </h2>

      {/* Star filter chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => filter(null)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
            stars === null
              ? "bg-grape text-white shadow-md shadow-grape/40"
              : "bg-white text-crust ring-1 ring-crust/15 hover:ring-grape/50"
          }`}
        >
          All
        </button>
        {[5, 4, 3, 2, 1].map((n) => (
          <button
            key={n}
            onClick={() => filter(n)}
            className={`rounded-full px-4 py-2 text-sm font-bold text-white transition-all ${
              stars === n
                ? `${moodBg(n)} shadow-md`
                : "bg-white text-crust ring-1 ring-crust/15 hover:ring-grape/50"
            }`}
          >
            <span>{"★".repeat(n)}</span>{" "}
            <span className={stars === n ? "text-white/70" : "text-crust/70"}>
              ({counts[String(n)] ?? 0})
            </span>
          </button>
        ))}
      </div>

      {/* Review cards */}
      <div className={`mt-5 space-y-3 transition-opacity ${loading ? "opacity-40" : ""}`}>
        {reviews.map((r) => (
          <article
            key={r.id}
            className="fade-up flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-crust/10"
          >
            <span className={`text-2xl ${moodColor(r.rating)}`}>
              {"★".repeat(r.rating)}
              <span className="text-crust/20">{"★".repeat(5 - r.rating)}</span>
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-crust-dark">{r.comment}</p>
              <time className="text-xs text-crust/50">
                {new Date(r.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </time>
            </div>
          </article>
        ))}

        {reviews.length === 0 && !loading && (
          <p className="rounded-2xl bg-white p-6 text-center font-semibold text-crust/60 ring-1 ring-crust/10">
            No {stars}-star reviews yet. Someone has to be first 🍍
          </p>
        )}
      </div>
    </section>
  );
}
