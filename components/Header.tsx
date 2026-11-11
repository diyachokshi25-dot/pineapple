"use client";

// Top bar: half-cut pineapple logo, the name, and a greeting from the
// username-only "login" (a cookie — no passwords, no auth library).
import Link from "next/link";
import { useEffect, useState } from "react";
import PineappleLogo from "./PineappleLogo";

export default function Header() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )pineapple_user=([^;]*)/);
    setUsername(match ? decodeURIComponent(match[1]) : null);
  }, []);

  function logOut() {
    document.cookie = "pineapple_user=; path=/; max-age=0";
    window.location.href = "/";
  }

  return (
    <header className="honeycomb-dark sticky top-0 z-40 bg-crust-dark/95 text-cream shadow-lg shadow-black/20 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.03]">
          <PineappleLogo size={36} />
          <span className="text-xl font-black tracking-tight">
            Pine<span className="text-pineapple">apple</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {username ? (
            <>
              <span className="hidden font-semibold text-pineapple sm:inline">
                Hi, {username}!
              </span>
              <button
                onClick={logOut}
                className="rounded-full border border-cream/30 px-3 py-1.5 font-semibold transition-colors hover:bg-cream/10"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-grape px-4 py-1.5 font-bold text-white transition-transform hover:scale-105"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
