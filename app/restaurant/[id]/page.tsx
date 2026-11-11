// Screen 3 — Restaurant page, top to bottom:
//   1. banner with name, cuisine, address (+ a real food picture)
//   2. square rating window with a counter-style animation and a star picker
//   3. the latest review, highlighted — recency is what people trust
//   4. menu items you can review individually, then all older reviews
// Every number here came from GET /api/restaurants/[id]. This page renders.
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import FoodImage from "@/components/FoodImage";
import PeelLoader from "@/components/PeelLoader";
import RatingWindow from "@/components/RatingWindow";
import ReviewsSection from "@/components/ReviewsSection";
import { apiGet } from "@/lib/fetch-server";
import { moodColor } from "@/lib/mood";
import type { RestaurantDetail } from "@/lib/types";

const FOOD_PICTURE: Record<number, { src: string; emoji: string }> = {
  1: { src: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1600&q=80", emoji: "🌯" },
  2: { src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1600&q=80", emoji: "🌮" },
  3: { src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1600&q=80", emoji: "🍛" },
  4: { src: "https://images.unsplash.com/photo-1568901346375-23c9450c5869?w=1600&q=80", emoji: "🍔" },
  5: { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80", emoji: "🍸" },
};

export default function RestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ thanks?: string }>;
}) {
  // All runtime data access (params, searchParams, the API) happens inside
  // the Suspense child — so Next.js can prerender the shell instantly and
  // stream the fresh content in, with the pineapple-peel loader in between.
  return (
    <Suspense fallback={<PeelLoader label="Peeling the reviews…" />}>
      <RestaurantContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function RestaurantContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ thanks?: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const thanks = (await searchParams).thanks === "1";
  // This page is different on every request (fresh reviews, fresh averages),
  // so we tell Next.js to always render it at request time, never prerender.
  await connection();
  const res = await apiGet(`/api/restaurants/${id}`);
  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error(`GET /api/restaurants/${id} failed with ${res.status}`);
  }
  const data = (await res.json()) as RestaurantDetail;
  const pic = FOOD_PICTURE[id] ?? { src: "", emoji: "🍽️" };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      {/* 1. Banner */}
      <section className="fade-up relative mt-4 h-56 w-full overflow-hidden rounded-3xl shadow-xl shadow-crust/20 sm:h-72">
        <FoodImage src={pic.src} alt={`Food at ${data.name}`} emoji={pic.emoji} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-5xl">
            {data.name}
          </h1>
          <p className="mt-1 font-bold text-pineapple drop-shadow">
            {data.cuisine} · {data.area}
          </p>
        </div>
      </section>

      {thanks && (
        <div className="fade-up mt-4 rounded-2xl bg-mood-green/15 p-4 text-center font-black text-leaf ring-2 ring-mood-green/40">
          Thanks! Your review is in the database — one row of facts, computed into these numbers just now.
        </div>
      )}

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* On mobile the rating window comes first; on desktop it sits to the right */}
        <div className="order-2 lg:order-1 lg:flex-1">
          {/* 3. Latest review, highlighted */}
          <section className="mt-2">
            <h2 className="text-2xl font-black text-crust-dark">Latest review</h2>
            {data.latestReview ? (
              <article className="fade-up mt-3 rounded-3xl bg-gradient-to-br from-grape to-grape-shout p-5 text-white shadow-lg shadow-grape/30">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  Latest · what people trust
                </span>
                <p className="mt-3 text-2xl">
                  <span className={moodColor(data.latestReview.rating)}>
                    {"★".repeat(data.latestReview.rating)}
                  </span>
                  <span className="text-white/30">{"★".repeat(5 - data.latestReview.rating)}</span>
                </p>
                <p className="mt-2 text-lg font-semibold leading-snug">
                  “{data.latestReview.comment}”
                </p>
                <p className="mt-2 text-xs text-white/80">
                  {data.latestReview.username ? (
                    <span className="font-black text-pineapple">@{data.latestReview.username}</span>
                  ) : (
                    <span className="font-bold text-white/60">anonymous</span>
                  )}
                  <span>
                    {" · "}
                    {new Date(data.latestReview.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </article>
            ) : (
              <p className="mt-3 rounded-3xl bg-white p-6 font-semibold text-crust/60 ring-1 ring-crust/10">
                No reviews yet — be the first. The big yellow box is waiting for you.
              </p>
            )}
          </section>

          {/* 4. Older reviews, with the Amazon-style star filter */}
          <ReviewsSection
            restaurantId={id}
            initialReviews={data.reviews}
            initialCounts={data.ratingCounts}
          />
        </div>

        <div className="order-1 lg:order-2 lg:w-96 lg:flex-none">
          {/* 2. Square rating window: big, first thing your eye lands on */}
          <RatingWindow
            restaurantId={id}
            averageRating={data.averageRating}
            totalReviews={data.totalReviews}
          />

          {/* Menu items — each individually reviewable */}
          <section className="mt-6">
            <h2 className="text-2xl font-black text-crust-dark">The weird menu</h2>
            <ul className="mt-3 space-y-2">
              {data.menuItems.map((item) => (
                <li
                  key={item.id}
                  className="fade-up rounded-2xl bg-white p-4 shadow-sm ring-1 ring-crust/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-crust-dark">{item.name}</h3>
                      <p className="text-sm font-medium text-crust/70">{item.description}</p>
                      <p className="mt-1 text-sm font-bold text-leaf">₹{item.price}</p>
                    </div>
                    <div className="text-right">
                      {item.averageRating !== null ? (
                        <span
                          className={`inline-block rounded-lg px-2 py-1 text-xs font-black text-white ${
                            item.averageRating >= 4
                              ? "bg-mood-green"
                              : item.averageRating === 3
                                ? "bg-mood-amber"
                                : "bg-mood-red"
                          }`}
                        >
                          ★ {item.averageRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-crust/40">unrated</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/review/${id}?item=${item.id}`}
                    className="pop mt-2 inline-block rounded-full bg-grape/10 px-3 py-1 text-xs font-black text-grape transition-colors hover:bg-grape hover:text-white"
                  >
                    Rate this dish →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
