// The half-cut pineapple logo, drawn as SVG so it stays crisp everywhere.
export default function PineappleLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.125}
      viewBox="0 0 64 72"
      role="img"
      aria-label="Pineapple logo"
    >
      {/* crown leaves */}
      <path d="M30 24 L20 4 L34 20 Z" fill="#1f5e2e" />
      <path d="M32 24 L32 2 L42 22 Z" fill="#2e7d3a" />
      <path d="M34 24 L46 8 L46 24 Z" fill="#1f5e2e" />
      {/* body dome — half a pineapple */}
      <path d="M14 26 Q14 62 32 62 Q50 62 50 26 Z" fill="#e8a41f" />
      {/* crosshatch skin on the left of the cut */}
      <clipPath id="pineapple-body">
        <path d="M14 26 Q14 62 32 62 Q50 62 50 26 Z" />
      </clipPath>
      <g clipPath="url(#pineapple-body)" stroke="#8a5a1a" strokeWidth="1.4" fill="none">
        <path d="M10 30 L54 42" />
        <path d="M10 38 L54 50" />
        <path d="M10 46 L54 58" />
        <path d="M10 54 L54 66" />
        <path d="M54 30 L10 42" />
        <path d="M54 38 L10 50" />
        <path d="M54 46 L10 58" />
        <path d="M54 54 L10 66" />
      </g>
      {/* the cut face — cream, right of the cut line */}
      <path d="M34 26 Q34 62 32 62 Q50 62 50 26 Z" fill="#fff3d6" />
      <path d="M34 26 L34 62" stroke="#8a5a1a" strokeWidth="1.6" />
      {/* juicy core dots */}
      <g fill="#f0b95c">
        <circle cx="41" cy="32" r="2.1" />
        <circle cx="45" cy="40" r="2.1" />
        <circle cx="41" cy="48" r="2.1" />
        <circle cx="45" cy="56" r="2.1" />
      </g>
    </svg>
  );
}
