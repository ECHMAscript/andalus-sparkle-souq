// @ts-nocheck
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

/**
 * Each guide provides:
 *  - A Diagram component that receives `activeStep` + `onStepClick` and
 *    renders numbered hotspots at meaningful points on the illustration.
 *  - `steps`: the text bubble shown when a hotspot is clicked. Titles are
 *    short; bodies explain the step with units and tolerances.
 *  - `chart`: a size reference table shown beneath.
 */

// ---- Hotspot primitive ------------------------------------------------------
// A gold-rimmed numbered dot placed at (x, y) in SVG user units. Clicking it
// bubbles the step index up to the parent so the info card can update.
function Hotspot({ n, x, y, active, onClick }) {
  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onClick(n);
      }}
      style={{ cursor: "pointer" }}
    >
      {/* soft halo when active */}
      {active && (
        <circle cx={x} cy={y} r="13" fill="currentColor" opacity="0.15">
          <animate attributeName="r" values="10;15;10" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <circle
        cx={x}
        cy={y}
        r="9"
        fill={active ? "currentColor" : "hsl(var(--background))"}
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <text
        x={x}
        y={y + 3.2}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={active ? "hsl(var(--background))" : "currentColor"}
        style={{ pointerEvents: "none", fontFamily: "inherit" }}
      >
        {n}
      </text>
    </g>
  );
}

// ---- Diagrams ---------------------------------------------------------------
function RingDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 260 180" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* finger */}
        <path d="M100 12 C 92 60, 92 110, 100 168" opacity="0.35" />
        <path d="M160 12 C 168 60, 168 110, 160 168" opacity="0.35" />
        {/* ring band */}
        <ellipse cx="130" cy="92" rx="42" ry="52" />
        <ellipse cx="130" cy="92" rx="34" ry="44" strokeDasharray="3 3" opacity="0.55" />
        {/* inner diameter arrow */}
        <line x1="96" y1="92" x2="164" y2="92" opacity="0.6" />
        <path d="M96 92 l6 -4 M96 92 l6 4 M164 92 l-6 -4 M164 92 l-6 4" />
      </g>
      <text x="130" y="86" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="2" opacity="0.85">
        INNER ⌀
      </text>
      <Hotspot n={1} x={130} y={30} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={130} y={92} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={172} y={140} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={88} y={140} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

function NecklaceDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 260 200" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* neck & shoulders */}
        <path d="M90 30 C 100 55, 100 70, 90 90 L 40 130" opacity="0.35" />
        <path d="M170 30 C 160 55, 160 70, 170 90 L 220 130" opacity="0.35" />
        {/* chains at different lengths */}
        <path d="M90 40 C 110 78, 150 78, 170 40" />
        <path d="M85 40 C 115 100, 145 100, 175 40" opacity="0.7" />
        <path d="M80 40 C 120 130, 140 130, 180 40" opacity="0.45" />
        {/* pendant */}
        <line x1="130" y1="130" x2="130" y2="150" strokeDasharray="2 3" />
        <path d="M130 150 l6 8 l-6 8 l-6 -8 z" />
      </g>
      <Hotspot n={1} x={130} y={62} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={130} y={92} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={130} y={128} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={130} y={166} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

function BraceletDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 260 180" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* forearm */}
        <path d="M20 60 L 240 60" opacity="0.3" />
        <path d="M20 120 L 240 120" opacity="0.3" />
        {/* wrist bone marker */}
        <circle cx="80" cy="60" r="3" opacity="0.6" />
        {/* bangle wrapping wrist */}
        <ellipse cx="140" cy="90" rx="52" ry="30" />
        <ellipse cx="140" cy="90" rx="52" ry="30" strokeDasharray="2 4" opacity="0.4" transform="rotate(6 140 90)" />
        {/* clasp */}
        <rect x="188" y="86" width="10" height="8" rx="1.5" />
      </g>
      <Hotspot n={1} x={80} y={80} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={140} y={90} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={193} y={90} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={140} y={140} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

function AnkletDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 260 200" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* leg */}
        <path d="M100 10 L 100 110 Q 100 150, 140 150 L 230 150" opacity="0.35" />
        <path d="M130 10 L 130 100 Q 130 130, 150 130" opacity="0.35" />
        {/* ankle bone */}
        <circle cx="115" cy="128" r="3" opacity="0.6" />
        {/* anklet */}
        <ellipse cx="155" cy="140" rx="55" ry="14" />
        {/* bell charm */}
        <line x1="205" y1="145" x2="212" y2="160" strokeDasharray="1 2" />
        <circle cx="212" cy="164" r="4" />
      </g>
      <Hotspot n={1} x={115} y={128} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={155} y={140} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={212} y={164} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={155} y={178} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

function EarringDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 260 200" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* ear */}
        <path d="M140 30 Q 90 55, 100 110 Q 108 155, 140 158 Q 158 158, 162 138" opacity="0.4" />
        <path d="M148 148 Q 158 148, 158 140 Q 158 132, 148 130" opacity="0.4" />
        {/* piercing */}
        <circle cx="140" cy="120" r="3" fill="currentColor" />
        {/* post & drop */}
        <line x1="140" y1="120" x2="140" y2="180" strokeDasharray="2 3" />
        {/* drop element */}
        <path d="M140 135 Q 128 155, 140 175 Q 152 155, 140 135 Z" />
        {/* weight indicator */}
        <line x1="175" y1="120" x2="175" y2="175" opacity="0.5" />
        <path d="M175 120 l-4 6 M175 120 l4 6 M175 175 l-4 -6 M175 175 l4 -6" opacity="0.5" />
      </g>
      <Hotspot n={1} x={140} y={120} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={140} y={155} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={175} y={148} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={140} y={188} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

function BridalDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* ring */}
        <circle cx="55" cy="55" r="22" />
        <circle cx="55" cy="55" r="16" strokeDasharray="2 3" opacity="0.5" />
        {/* necklace */}
        <path d="M120 30 C 130 90, 210 90, 220 30" />
        <path d="M170 90 l0 12 M170 102 l-5 6 l5 6 l5 -6 z" />
        {/* bangle */}
        <ellipse cx="60" cy="150" rx="34" ry="12" />
        <ellipse cx="60" cy="150" rx="34" ry="12" strokeDasharray="2 3" opacity="0.5" transform="rotate(4 60 150)" />
        {/* earring pair */}
        <circle cx="220" cy="135" r="3" fill="currentColor" />
        <path d="M220 138 Q 214 152, 220 168 Q 226 152, 220 138 Z" />
      </g>
      <text x="55" y="98" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="1.5" opacity="0.7">RING</text>
      <text x="170" y="24" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="1.5" opacity="0.7">NECKLACE</text>
      <text x="60" y="180" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="1.5" opacity="0.7">BANGLE</text>
      <text x="220" y="185" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="1.5" opacity="0.7">EARRING</text>
      <Hotspot n={1} x={55} y={55} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={170} y={80} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={60} y={150} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={220} y={155} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

// ---- Guide data -------------------------------------------------------------
const GUIDES = {
  Rings: {
    diagram: RingDiagram,
    intro:
      "Ring size is the inner circumference of the band, measured in millimetres. Fingers swell in heat and after meals, so we recommend taking three readings across the day and rounding up.",
    steps: [
      {
        title: "Warm the finger first",
        body:
          "Measure late in the day when the finger is at its widest. Avoid taking a reading after a cold shower or a long flight — you'll size a full mm small.",
      },
      {
        title: "Read the inner diameter",
        body:
          "The number quoted on the chart is the inside of the band, in millimetres. A ring that already fits: measure the inside with a caliper — that is your target ⌀.",
      },
      {
        title: "Clear the knuckle",
        body:
          "The band must slide over the knuckle then rest snug at the base. If the knuckle is much wider than the base, size for the knuckle and we'll add a discreet sizing bead inside the band, free of charge.",
      },
      {
        title: "Season & climate",
        body:
          "In cold seasons the finger can lose up to 0.4 mm. If you live in a cold climate or wear the ring year-round, choose the larger of two half-sizes.",
      },
    ],
    chart: [
      ["Size 5", "49.3 mm inner ⌀"],
      ["Size 6", "51.9 mm inner ⌀"],
      ["Size 7", "54.4 mm inner ⌀"],
      ["Size 8", "57.0 mm inner ⌀"],
      ["Size 9", "59.5 mm inner ⌀"],
      ["Size 10", "62.1 mm inner ⌀"],
    ],
  },
  Necklaces: {
    diagram: NecklaceDiagram,
    intro:
      "Chain length is measured end-to-end with the necklace laid flat, in inches. The length dictates where the pendant will rest on your chest.",
    steps: [
      {
        title: "16\" — Choker",
        body:
          "Sits at the base of the throat, above the collarbone. Best over open necklines and evening dresses; not ideal for high collars.",
      },
      {
        title: "18\" — Princess",
        body:
          "Falls just below the collarbone — the most universal length. Works with almost every neckline and layers well with an 20\" chain.",
      },
      {
        title: "20–22\" — Matinée",
        body:
          "Rests above the bust. Made for pendants: the extra length gives the medallion room to sway and catch light.",
      },
      {
        title: "24\"+ — Opera",
        body:
          "Falls below the bust. Statement-length; often doubled into a two-tier choker for evening wear.",
      },
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
      "Bracelets are sized by wrist circumference plus ease. Use a soft tape or a strip of paper — never a rigid ruler.",
    steps: [
      {
        title: "Find the wrist bone",
        body:
          "Locate the small bump on the outside of the wrist. All measurements are taken just below this point, on the hand side.",
      },
      {
        title: "Wrap snug, not tight",
        body:
          "Wrap the tape once. It should sit flush against the skin without indenting it. Read to the nearest millimetre and convert to inches (÷ 25.4).",
      },
      {
        title: "Add ease for the clasp",
        body:
          "Add ½\" (1.3 cm) for a tailored fit or 1\" (2.5 cm) for a drape fit. Bangles are rigid — add ¾\" so the piece slides over the knuckles.",
      },
      {
        title: "Try the string test",
        body:
          "Cut a piece of string to your chosen length and tape it into a loop. Slip it on: it should rotate freely but not slide over the hand.",
      },
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
      "Anklets follow the same logic as bracelets but need more ease so the piece drapes over the top of the foot rather than gripping the ankle.",
    steps: [
      {
        title: "Above the ankle bone",
        body:
          "Wrap the tape just above the ankle bone, where the anklet naturally rests. Barefoot, standing — sizing while seated adds ~3 mm.",
      },
      {
        title: "Add drape ease",
        body:
          "Add 1 cm for a close fit or 2 cm for a relaxed drape. Traditional Khalkhal anklets are worn loose, at +2.5 cm.",
      },
      {
        title: "Charm placement",
        body:
          "Bells and jasmine charms are placed to hang at the outside of the ankle, never at the front — this is a deliberate choice for both sound and comfort.",
      },
      {
        title: "Adjustable jump-ring",
        body:
          "Every anklet ships with a 2 cm adjustable chain at the clasp, so you can tune the drape after receipt. Bring both ankles into consideration — they're rarely identical.",
      },
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
      "Earrings are described by drop (post to lowest point) and by weight. Both matter — a light earring with a long drop wears very differently to a compact but dense stud.",
    steps: [
      {
        title: "Post to lobe",
        body:
          "The post enters the piercing and sits flush against the back of the lobe. All drop measurements start from this point, not from the top of the piece.",
      },
      {
        title: "Measure the drop",
        body:
          "Hold a ruler flat against the lobe and let the earring hang freely. Read the distance from the post to the lowest point — this is the drop.",
      },
      {
        title: "Check the weight",
        body:
          "Under 4 g wears all-day comfortably. 4–8 g is evening-appropriate. Over 8 g we recommend a support disc (included with every chandelier).",
      },
      {
        title: "Clearance from shoulder",
        body:
          "Chandeliers should stop at least 2 cm above the shoulder to avoid catching on fabric. Measure your lobe-to-shoulder distance if you're unsure.",
      },
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
      "A bridal parure is sized as one set — the ring, necklace, bangle and earrings are matched so that proportions read from across the room. Take each measurement individually then choose the dominant fit.",
    steps: [
      {
        title: "Ring leads",
        body:
          "Measure the ring finger of the dominant hand as described in the Rings guide. This is the anchor — the rest of the set scales from here.",
      },
      {
        title: "Necklace to neckline",
        body:
          "Match the chain length to the neckline of the gown. High necklines want 20–22\"; sweetheart and off-shoulder want 16–18\" so the medallion sits at the décolleté.",
      },
      {
        title: "Bangle over the knuckles",
        body:
          "Bridal bangles are rigid. Measure the widest point of the hand with the thumb tucked in — the bangle needs to clear this to reach the wrist.",
      },
      {
        title: "Earrings & headpiece",
        body:
          "Choose earring drop against the hairstyle. Updo → chandeliers (45 mm+). Loose hair → medium drops (25–35 mm) so the piece still reads.",
      },
    ],
    chart: [
      ["Petite", 'Ring 5–6 · Bangle 6.5" · 16" chain'],
      ["Standard", 'Ring 7–8 · Bangle 7" · 18" chain'],
      ["Grande", 'Ring 9–10 · Bangle 7.5"+ · 20"+ chain'],
    ],
  },
};

// ---- Panel ------------------------------------------------------------------
export default function SizeGuide({ category, onClose }) {
  const guide = GUIDES[category] ?? GUIDES.Rings;
  const Diagram = guide.diagram;
  // 1-indexed step; null means no bubble is open.
  const [activeStep, setActiveStep] = useState(1);
  const step = activeStep ? guide.steps[activeStep - 1] : null;

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

      {/* Interactive diagram */}
      <div className="mt-5 neo-inset rounded-2xl p-5 text-primary relative">
        <Diagram
          activeStep={activeStep}
          onStepClick={(n) => setActiveStep((prev) => (prev === n ? null : n))}
        />
        <div className="mt-2 text-center text-[10px] uppercase tracking-[0.25em] text-foreground/60">
          Tap a number to read the step
        </div>
      </div>

      {/* Step bubble — sits below the diagram, arabesque-styled */}
      <div
        key={activeStep ?? "empty"}
        className="mt-4 animate-fade-in"
      >
        {step ? (
          <div className="relative neo-sm rounded-2xl px-5 py-4 border border-primary/20">
            {/* little tail pointing up to the diagram */}
            <div className="absolute -top-2 left-8 size-4 rotate-45 bg-background border-l border-t border-primary/20" />
            <div className="flex items-start gap-3">
              <span className="shrink-0 size-7 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center text-[11px] font-bold">
                {activeStep}
              </span>
              <div className="min-w-0">
                <div className="font-display text-lg leading-snug">{step.title}</div>
                <p className="text-sm text-foreground/75 leading-relaxed mt-1">{step.body}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic px-1">
            Select a number on the diagram to see how to measure that part.
          </div>
        )}
      </div>

      {/* Chart */}
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
