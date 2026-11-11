"use client";

// The square rating window: big counter animation + mood-coloured star picker.
// It is a Client Component because tapping a star navigates — event handlers
// can only live on this side of the server/client boundary. The numbers it
// shows arrived as props from the API; it computes nothing itself.
import { useRouter } from "next/navigation";
import RatingCounter from "./RatingCounter";
import StarPicker from "./StarPicker";

export default function RatingWindow({
  restaurantId,
  averageRating,
  totalReviews,
}: {
  restaurantId: number;
  averageRating: number | null;
  totalReviews: number;
}) {
  const router = useRouter();

  return (
    <section className="fade-up rounded-3xl bg-gradient-to-br from-pineapple to-pineapple-deep p-6 text-center shadow-xl shadow-pineapple/40 ring-4 ring-crust/10">
      <div className="mx-auto grid aspect-square w-full max-w-72 place-items-center rounded-2xl bg-crust/90 shadow-inner">
        <div>
          <RatingCounter value={averageRating} />
          <p className="mt-1 text-4xl text-mood-amber">★★★★★</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-cream/80">
            {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm font-black uppercase tracking-wider text-crust-dark">
        Rate this place
      </p>
      <div className="mt-2 flex justify-center">
        <StarPicker
          value={null}
          size="text-4xl"
          onSelect={(n) => router.push(`/review/${restaurantId}?rating=${n}`)}
        />
      </div>
      <p className="mt-2 text-xs font-semibold text-crust/70">
        1–2 stars red · 3 yellow · 4–5 green — pick a mood
      </p>
    </section>
  );
}
