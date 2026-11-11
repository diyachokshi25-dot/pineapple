// Screen 2 — Homepage: list of restaurants, filters on top.
// The list is fetched from GET /api/restaurants, which computed every
// average and count. This page prints; it does not calculate.
import { Suspense } from "react";
import Link from "next/link";
import PeelLoader from "@/components/PeelLoader";
import PineappleLogo from "@/components/PineappleLogo";
import RestaurantBrowser from "@/components/RestaurantBrowser";
import { apiGet } from "@/lib/fetch-server";
import type { RestaurantSummary } from "@/lib/types";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="honeycomb-dark bg-crust py-14 text-center text-cream">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4">
          <div className="animate-bounce">
            <PineappleLogo size={72} />
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Rate food. Read <span className="text-pineapple">chaos</span>.
          </h1>
          <p className="max-w-md font-medium text-cream/80">
            Honest reviews of imaginary restaurants. Every average you see was
            computed the moment this page loaded — nothing here is ever stored.
          </p>
          <Link
            href="/login"
            className="pop rounded-full bg-grape px-6 py-2.5 font-bold text-white shadow-lg shadow-grape/40"
          >
            Grab a username →
          </Link>
        </div>
      </section>

      <Suspense fallback={<PeelLoader label="Peeling the menu…" />}>
        <RestaurantList />
      </Suspense>
    </main>
  );
}

async function RestaurantList() {
  const res = await apiGet("/api/restaurants");
  if (!res.ok) {
    throw new Error(`GET /api/restaurants failed with ${res.status}`);
  }
  const { restaurants } = (await res.json()) as { restaurants: RestaurantSummary[] };
  return <RestaurantBrowser restaurants={restaurants} />;
}
