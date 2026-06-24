// @ts-nocheck
import { ArrowLeft } from "lucide-react";

// Inline SVG diagrams catered per jewelry type. Stroked with the primary
// gold so they sit naturally within the page theme.
function RingDiagram() {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-auto" aria-hidden>
      <defs>
        <marker id="ah-r" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="120" cy="80" r="48" />
        <circle cx="120" cy="80" r="40" strokeDasharray="3 3" opacity="0.5" />
        <line x1="72" y1="80" x2="168" y2="80" markerStart="url(#ah-r)" markerEnd="url(#ah-r)" />
      </g>
      <text x="120" y="74" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2">INNER ⌀</text>
      <text x="120" y="148" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2" opacity="0.7">
        Measure across the inside of the band
      </text>
    </svg>
  );
}

function NecklaceDiagram() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M60 30 C 60 120, 180 120, 180 30" />
        <path d="M120 110 L 120 140" strokeDasharray="3 3" />
        <circle cx="120" cy="142" r="5" />
      </g>
      <text x="120" y="22" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2">CHAIN LENGTH</text>
      <text x="200" y="80" fontSize="9" fill="currentColor" letterSpacing="1">16" choker</text>
      <text x="200" y="95" fontSize="9" fill="currentColor" letterSpacing="1">18" princess</text>
      <text x="200" y="110" fontSize="9" fill="currentColor" letterSpacing="1">20"+ matinée</text>
    </svg>
  );
}

function BraceletDiagram() {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="120" cy="80" rx="80" ry="34" />
        <ellipse cx="120" cy="80" rx="80" ry="34" strokeDasharray="2 4" opacity="0.4" transform="rotate(8 120 80)" />
        <path d="M40 80 Q 120 130, 200 80" />
      </g>
      <text x="120" y="74" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2">WRIST CIRCUM.</text>
      <text x="120" y="150" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2" opacity="0.7">
        Wrap a string just below the wrist bone
      </text>
    </svg>
  );
}

function AnkletDiagram() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M100 20 L100 90 Q 100 130, 140 130 L200 130" />
        <ellipse cx="150" cy="130" rx="50" ry="14" />
      </g>
      <text x="120" y="160" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2">ANKLE CIRCUM.</text>
      <text x="120" y="174" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2" opacity="0.7">
        Measure just above the ankle bone
      </text>
    </svg>
  );
}

function EarringDiagram() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M120 30 Q 80 60, 90 100 Q 100 140, 120 140 Q 140 140, 150 100 Q 160 60, 120 30 Z" opacity="0.5" />
        <circle cx="120" cy="70" r="3" fill="currentColor" />
        <line x1="120" y1="70" x2="120" y2="150" strokeDasharray="3 3" />
        <line x1="115" y1="150" x2="125" y2="150" />
      </g>
      <text x="155" y="112" fontSize="9" fill="currentColor" letterSpacing="2">DROP</text>
      <text x="120" y="170" textAnchor="middle" fontSize="9" fill="currentColor" letterSpacing="2" opacity="0.7">
        Drop = post to lowest point
      </text>
    </svg>
  );
}

function BridalDiagram() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-auto" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="60" cy="60" r="20" />
        <path d="M120 40 C 120 100, 200 100, 200 40" />
        <ellipse cx="60" cy="130" rx="28" ry="10" />
      </g>
      <text x="60" y="64" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="1">RING</text>
      <text x="160" y="60" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="1">NECKLACE</text>
      <text x="60" y="134" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="1">BANGLE</text>
    </svg>
  );
}

const GUIDES = {
  Rings: {
    diagram: RingDiagram,
    intro:
      "Ring size is the inner circumference of the band. Measure in the evening when fingers are warmest, and from the dominant hand if you write a lot.",
    steps: [
      "Wrap a thin strip of paper around the base of the finger.",
      "Mark where it overlaps and measure the length in millimetres.",
      "Match the millimetres to the chart below — round up half sizes.",
    ],
    chart: [
      ["Size 5", "49.3 mm"],
      ["Size 6", "51.9 mm"],
      ["Size 7", "54.4 mm"],
      ["Size 8", "57.0 mm"],
      ["Size 9", "59.5 mm"],
      ["Size 10", "62.1 mm"],
    ],
  },
  Necklaces: {
    diagram: NecklaceDiagram,
    intro:
      "Chain length is measured end-to-end with the necklace laid flat. The number sits where the pendant naturally rests on the chest.",
    steps: [
      "Use a piece of string to mimic where you'd like the piece to fall.",
      "Lay the string flat and measure in inches.",
      "Pick the length closest to your measurement — we'll size pendants accordingly.",
    ],
    chart: [
      ['16"', "Choker — at the collarbone"],
      ['18"', "Princess — just below the collarbone"],
      ['20"', "Matinée — above the bust"],
      ['22"', "Matinée — at the bust"],
      ['24"', "Opera — below the bust"],
    ],
  },
  Bracelets: {
    diagram: BraceletDiagram,
    intro:
      "Bracelets are sized by wrist circumference plus a little ease so the piece moves naturally on the wrist.",
    steps: [
      "Wrap a soft tape just below the wrist bone, snug but not tight.",
      "Add 1.3 cm (½\") of ease for a relaxed fit, or 2.5 cm (1\") for a drape fit.",
      "Match the total to the chart — bangles are measured at the inner diameter.",
    ],
    chart: [
      ['6.5"', "Petite wrist"],
      ['7"', "Standard wrist"],
      ['7.5"', "Comfort fit"],
      ['8"', "Drape / cuff fit"],
    ],
  },
  Anklets: {
    diagram: AnkletDiagram,
    intro:
      "Anklets are sized like bracelets — circumference with a touch of movement. We finish each piece with an adjustable jump-ring.",
    steps: [
      "Measure around the ankle, just above the ankle bone.",
      "Add 1 cm of ease for a close fit, 2 cm for a relaxed drape.",
      "Choose the closest size — bells and charms are placed to sit at the outside of the ankle.",
    ],
    chart: [
      ['9"', "Close fit"],
      ['10"', "Standard"],
      ['11"', "Relaxed drape"],
    ],
  },
  Earrings: {
    diagram: EarringDiagram,
    intro:
      "Earrings are described by their drop — the distance from the earring post to the lowest point of the piece.",
    steps: [
      "Hold a ruler against the lobe and let it hang freely.",
      "Note the distance from the post to the lowest point of the design.",
      "Match the drop to Small (under 25 mm), Medium (25–45 mm) or Large (45 mm+).",
    ],
    chart: [
      ["Small", "Up to 25 mm — studs & huggies"],
      ["Medium", "25–45 mm — drops"],
      ["Large", "45 mm+ — statement chandeliers"],
    ],
  },
  Bridal: {
    diagram: BridalDiagram,
    intro:
      "Bridal parures are sized as a set. We offer three standard fits, and each set can be re-sized by our atelier within 30 days of receipt.",
    steps: [
      "Take your ring, necklace and wrist measurements as described above.",
      "Match the dominant fit — ring sizing leads, with the bangle adjusted to follow.",
      "If you fall between two sizes, choose the larger — we'll fine-tune at fitting.",
    ],
    chart: [
      ["Petite", "Ring 5–6 · Bangle 6.5\" · 16\" chain"],
      ["Standard", "Ring 7–8 · Bangle 7\" · 18\" chain"],
      ["Grande", "Ring 9–10 · Bangle 7.5\"+ · 20\"+ chain"],
    ],
  },
};

export default function SizeGuide({ category, onClose }) {
  const guide = GUIDES[category] ?? GUIDES.Rings;
  const Diagram = guide.diagram;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to piece
        </button>
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary">{category} guide</span>
      </div>

      <h2 className="font-display text-3xl leading-tight">
        How to find your <span className="italic text-gold-gradient">size</span>
      </h2>

      <p className="text-sm text-foreground/75 leading-relaxed mt-3">{guide.intro}</p>

      <div className="mt-5 neo-inset rounded-2xl p-5 text-primary">
        <Diagram />
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-[0.25em] text-foreground/80 mb-3">How to measure</div>
        <ol className="space-y-2.5">
          {guide.steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground/80">
              <span className="shrink-0 size-6 rounded-full neo-sm inline-flex items-center justify-center text-[11px] font-semibold text-primary">
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-[0.25em] text-foreground/80 mb-3">Read your size</div>
        <div className="neo-sm rounded-2xl overflow-hidden">
          {guide.chart.map(([label, val], i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-5 py-3 text-sm ${
                i !== guide.chart.length - 1 ? "border-b border-border/40" : ""
              }`}
            >
              <span className="font-semibold text-foreground">{label}</span>
              <span className="text-muted-foreground">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="btn-gold mt-7 py-3.5 text-xs uppercase tracking-widest font-semibold"
      >
        Got it — choose my size
      </button>
    </div>
  );
}
