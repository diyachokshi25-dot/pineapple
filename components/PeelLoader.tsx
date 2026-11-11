// The official loader of this app: a pineapple being skinned in a spiral.
// The crosshatched skin slides down and off (with a twist and a torn
// spiral edge), revealing the pale flesh underneath. Pure CSS animation —
// the keyframes live in globals.css.
export default function PeelLoader({ label = "Peeling…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <svg
        className="peel-spiral"
        viewBox="0 0 80 100"
        role="img"
        aria-label="Pineapple being skinned in a spiral"
      >
        <defs>
          <clipPath id="peel-fruit">
            <ellipse cx="40" cy="56" rx="21" ry="27" />
          </clipPath>
        </defs>

        {/* crown leaves */}
        <path d="M36 30 L26 8 L40 26 Z" fill="#1f5e2e" />
        <path d="M40 30 L40 6 L50 26 Z" fill="#2e7d3a" />
        <path d="M44 30 L56 12 L54 30 Z" fill="#1f5e2e" />

        {/* bare flesh underneath — revealed as the skin slides off */}
        <ellipse cx="40" cy="56" rx="21" ry="27" fill="#fff3d6" />
        <g fill="#f0b95c">
          <circle cx="36" cy="52" r="2" />
          <circle cx="45" cy="58" r="2" />
          <circle cx="38" cy="64" r="2" />
          <circle cx="45" cy="70" r="2" />
        </g>

        {/* the skin: crosshatched, twisted, torn at the bottom edge */}
        <g clipPath="url(#peel-fruit)">
          <g className="peel-skin">
            <rect x="14" y="14" width="52" height="30" fill="#e8a41f" />
            <g stroke="#8a5a1a" strokeWidth="1.3" fill="none">
              <path d="M14 22 L66 30" />
              <path d="M14 30 L66 38" />
              <path d="M14 38 L66 46" />
              <path d="M66 22 L14 30" />
              <path d="M66 30 L14 38" />
              <path d="M66 38 L14 46" />
            </g>
            {/* the torn spiral edge where the skin is being pulled */}
            <path
              d="M14 44 Q21 49 28 44 Q35 39 42 44 Q49 49 56 44 Q61 41 66 44"
              fill="#e8a41f"
              stroke="#8a5a1a"
              strokeWidth="1.6"
            />
          </g>
        </g>
      </svg>
      <p className="text-sm font-semibold text-leaf">{label}</p>
    </div>
  );
}
