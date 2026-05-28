// Middle-eastern styled "bag" icon — a stylized drawstring pouch with an
// Andalusi eight-point star clasp. Drawn as inline SVG so it inherits
// currentColor and works at any size.
export default function SouqBag({ className = "", strokeWidth = 1.6 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Drawstring */}
      <path d="M7 5.5c1.2 1 3 1.5 5 1.5s3.8-.5 5-1.5" />
      <path d="M8.5 4.2c1 .6 2.2.9 3.5.9s2.5-.3 3.5-.9" />
      {/* Pouch body — pinched neck, rounded base, slight Moorish curve */}
      <path d="M6.5 7.2c0 .9-.3 1.5-1 2.3-1.2 1.4-1.8 3-1.8 4.8 0 3.6 3.3 6.2 8.3 6.2s8.3-2.6 8.3-6.2c0-1.8-.6-3.4-1.8-4.8-.7-.8-1-1.4-1-2.3" />
      {/* Eight-point star clasp */}
      <g transform="translate(12 13.6)">
        <path d="M0 -2.4 L0.7 -0.7 L2.4 0 L0.7 0.7 L0 2.4 L-0.7 0.7 L-2.4 0 L-0.7 -0.7 Z" />
        <path d="M-1.7 -1.7 L1.7 1.7 M1.7 -1.7 L-1.7 1.7" opacity="0.55" />
      </g>
      {/* Tassel hint */}
      <path d="M12 20v1.5" />
    </svg>
  );
}
