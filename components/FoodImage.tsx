"use client";

// Real-food photo from Unsplash. If the network or the photo is unavailable,
// it falls back to a gradient tile with an emoji — the page never breaks.
import { useState } from "react";

export default function FoodImage({
  src,
  alt,
  emoji,
  className = "",
}: {
  src: string;
  alt: string;
  emoji: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-pineapple to-pineapple-deep text-6xl ${className}`}
        role="img"
        aria-label={alt}
      >
        {emoji}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
