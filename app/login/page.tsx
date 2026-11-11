// Screen 1 — Login: type a unique username, no password. The username
// rides along in a browser cookie (not localStorage — that's banned here)
// purely so the header can greet you. Reviews stay anonymous in the database.
"use client";

import { useState } from "react";
import PineappleLogo from "@/components/PineappleLogo";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError("A username is the one thing we ask for. Give us something.");
      return;
    }
    if (!/^[a-zA-Z0-9_]{2,20}$/.test(trimmed)) {
      setError("Letters, numbers and underscores only — 2 to 20 characters.");
      return;
    }
    document.cookie = `pineapple_user=${encodeURIComponent(trimmed)}; path=/; max-age=31536000; SameSite=Lax`;
    // A real page load (not client-side navigation) so the header remounts,
    // re-reads the cookie we just set, and greets you immediately.
    window.location.assign("/");
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="fade-up w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl shadow-crust/10 ring-1 ring-crust/10"
      >
        <div className="mx-auto w-fit animate-bounce">
          <PineappleLogo size={56} />
        </div>
        <h1 className="mt-4 text-center text-2xl font-black">Who&apos;s eating?</h1>
        <p className="mt-1 text-center text-sm font-medium text-crust/60">
          Just a unique username. No password, no emails, no drama.
        </p>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="e.g. hungry_hippo"
          autoFocus
          className="mt-6 w-full rounded-xl border border-crust/20 bg-cream px-4 py-3 font-semibold outline-none focus:border-grape focus:ring-2 focus:ring-grape/30"
        />
        {error && (
          <p className="mt-2 text-sm font-bold text-mood-red">{error}</p>
        )}
        <button
          type="submit"
          className="pop mt-4 w-full rounded-xl bg-grape py-3 font-black text-white shadow-lg shadow-grape/30"
        >
          Let me in 🍍
        </button>
      </form>
    </main>
  );
}
