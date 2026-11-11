"use client";

// The review form. Star picker with mood colours, comment box, submit.
// `?item=N` in the URL means you're rating one dish; otherwise the place.
// `?rating=N` pre-fills stars when you tapped one on the restaurant page.
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import StarPicker from "@/components/StarPicker";
import type { RestaurantDetail } from "@/lib/types";

export default function ReviewForm({ restaurantId }: { restaurantId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<{ name: string; item?: { id: number; name: string } } | null>(
    null
  );

  // One fetch to learn the restaurant / dish names for the heading.
  // Everything on this screen is display; the numbers come from the API.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preRating = Number(params.get("rating"));
    if (Number.isInteger(preRating) && preRating >= 1 && preRating <= 5) {
      setRating(preRating);
    }
    const preItem = Number(params.get("item"));
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RestaurantDetail | null) => {
        if (!data) return;
        const menuItem =
          Number.isInteger(preItem) && preItem > 0
            ? data.menuItems.find((m) => m.id === preItem)
            : undefined;
        setTarget({ name: data.name, item: menuItem });
      })
      .catch(() => setTarget({ name: `Restaurant #${restaurantId}` }));
  }, [restaurantId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating === null) {
      setError("Pick a star. Even a red one.");
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        restaurantId,
        rating,
        comment,
      };
      if (target?.item) body.menuItemId = target.item.id;

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
        return;
      }
      // The frontend steps back. The restaurant page re-computes everything.
      router.push(`/restaurant/${restaurantId}?thanks=1`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="fade-up w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-crust/10 ring-1 ring-crust/10"
      >
        <p className="text-center text-sm font-bold uppercase tracking-widest text-grape">
          {target?.item ? "Rate this dish" : "Rate this place"}
        </p>
        <h1 className="mt-1 text-center text-2xl font-black text-crust-dark">
          {target?.item ? target.item.name : target?.name ?? "Loading…"}
        </h1>
        {target?.item && (
          <Link
            href={`/restaurant/${restaurantId}`}
            className="mt-1 block text-center text-sm font-semibold text-grape hover:underline"
          >
            for {target.name} — or rate the whole place instead
          </Link>
        )}

        <div className="mt-6 flex justify-center">
          <StarPicker value={rating} onSelect={setRating} size="text-5xl" />
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-crust/50">
          1–2 stars red · 3 yellow · 4–5 green
        </p>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Funny, sarcastic, honest — the internet is waiting."
          rows={4}
          className="mt-5 w-full resize-none rounded-2xl border border-crust/20 bg-cream px-4 py-3 font-medium outline-none placeholder:text-crust/40 focus:border-grape focus:ring-2 focus:ring-grape/30"
        />

        {error && <p className="mt-2 text-sm font-bold text-mood-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="pop mt-4 w-full rounded-2xl bg-grape py-3 font-black text-white shadow-lg shadow-grape/30 disabled:opacity-60"
        >
          {submitting ? "Filing your hot take…" : "Submit 🍍"}
        </button>
        <p className="mt-3 text-center text-xs font-medium text-crust/50">
          The backend will re-check your rating — because anyone can talk to an API directly.
        </p>
      </form>
    </main>
  );
}
