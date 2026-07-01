// @ts-nocheck
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

/**
 * Each guide's diagram literally illustrates the measurement METHOD
 * (string around finger, tape around wrist, ruler measuring the mark, etc).
 * Numbered hotspots are placed ON the part of the illustration that shows
 * that step, and clicking a hotspot reveals the detailed instruction.
 *
 * Instructions are sourced from standard jeweller sizing guidance
 * (Blue Nile, Tiffany & Co., GIA, Mejuri sizing references).
 */

// ---- Hotspot primitive ------------------------------------------------------
function Hotspot({ n, x, y, active, onClick }) {
  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onClick(n);
      }}
      style={{ cursor: "pointer" }}
    >
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

// ---- RING: string-and-ruler method -----------------------------------------
// Illustrates: (1) wrap string around finger base, (2) mark overlap with pen,
// (3) lay string flat and measure length in mm with a ruler, (4) divide by π
// to get inner diameter / look up size on chart.
function RingDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 300 220" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* Step 1 — finger with string wrapped around base */}
        <path d="M55 20 C 45 70, 45 130, 55 205" opacity="0.4" />
        <path d="M95 20 C 105 70, 105 130, 95 205" opacity="0.4" />
        {/* string loop around finger base */}
        <ellipse cx="75" cy="120" rx="26" ry="9" stroke="currentColor" strokeWidth="1.6" />
        {/* loose string ends dangling */}
        <path d="M99 118 C 115 122, 118 135, 112 148" strokeWidth="1.2" />
        <path d="M101 122 C 118 128, 122 140, 116 152" strokeWidth="1.2" opacity="0.7" />

        {/* Step 2 — pen marking the overlap point */}
        <path d="M132 70 l 22 -22 l 8 8 l -22 22 z" />
        <path d="M154 48 l 8 8" />
        <circle cx="132" cy="80" r="2" fill="currentColor" />
        <text x="128" y="96" fontSize="8" fill="currentColor" opacity="0.7">mark</text>

        {/* Step 3 — string laid flat next to ruler, measured in mm */}
        <line x1="150" y1="150" x2="285" y2="150" strokeWidth="1.6" />
        {/* ruler */}
        <rect x="150" y="165" width="135" height="18" rx="1.5" />
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135].map((t) => (
          <line key={t} x1={150 + t} y1="165" x2={150 + t} y2={t % 30 === 0 ? 175 : 171} />
        ))}
        <text x="150" y="197" fontSize="7" fill="currentColor" opacity="0.7">0</text>
        <text x="207" y="197" fontSize="7" fill="currentColor" opacity="0.7">mm</text>
        <text x="280" y="197" fontSize="7" fill="currentColor" opacity="0.7">55</text>
        {/* marked point on string */}
        <circle cx="205" cy="150" r="2.5" fill="currentColor" />

        {/* Step 4 — chart / size lookup card */}
        <rect x="200" y="30" width="80" height="70" rx="4" />
        <line x1="200" y1="48" x2="280" y2="48" opacity="0.5" />
        <line x1="240" y1="30" x2="240" y2="100" opacity="0.5" />
        <text x="220" y="43" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.8">SIZE</text>
        <text x="260" y="43" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.8">mm</text>
        <text x="220" y="62" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">6</text>
        <text x="260" y="62" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">51.9</text>
        <text x="220" y="76" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">7</text>
        <text x="260" y="76" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">54.4</text>
        <text x="220" y="90" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">8</text>
        <text x="260" y="90" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">57.0</text>
      </g>
      <Hotspot n={1} x={75} y={120} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={140} y={62} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={205} y={150} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={240} y={65} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

// ---- NECKLACE: tape from nape, drop points on torso ------------------------
function NecklaceDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 260 240" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* head + torso silhouette */}
        <circle cx="130" cy="35" r="20" opacity="0.4" />
        <path d="M110 55 C 100 70, 100 80, 90 95 L 40 140 L 40 230" opacity="0.4" />
        <path d="M150 55 C 160 70, 160 80, 170 95 L 220 140 L 220 230" opacity="0.4" />
        <path d="M110 55 L 150 55" opacity="0.4" />

        {/* Step 1 — tape at nape / base of neck */}
        <path d="M108 62 Q 130 72, 152 62" strokeDasharray="3 2" opacity="0.7" />

        {/* Step 2 — tape draped down front, chain resting at collarbone (16") */}
        <path d="M108 62 C 118 85, 142 85, 152 62" />
        {/* Step 3 — 18" princess just below collarbone */}
        <path d="M100 70 C 118 105, 142 105, 160 70" opacity="0.75" />
        {/* Step 4 — 20-24" matinee / opera on chest */}
        <path d="M92 78 C 118 140, 142 140, 168 78" opacity="0.55" />
        <path d="M85 82 C 118 180, 142 180, 175 82" opacity="0.4" />

        {/* rest-point markers on body */}
        <line x1="105" y1="80" x2="155" y2="80" strokeDasharray="1 3" opacity="0.5" />
        <line x1="100" y1="105" x2="160" y2="105" strokeDasharray="1 3" opacity="0.5" />
        <line x1="95" y1="140" x2="165" y2="140" strokeDasharray="1 3" opacity="0.5" />

        {/* length labels */}
        <text x="205" y="82" fontSize="8" fill="currentColor" opacity="0.7">16"</text>
        <text x="205" y="108" fontSize="8" fill="currentColor" opacity="0.7">18"</text>
        <text x="205" y="143" fontSize="8" fill="currentColor" opacity="0.7">20–22"</text>
        <text x="205" y="182" fontSize="8" fill="currentColor" opacity="0.7">24"+</text>
      </g>
      <Hotspot n={1} x={130} y={65} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={130} y={82} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={130} y={107} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={130} y={165} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

// ---- BRACELET: tape wrapped around wrist -----------------------------------
function BraceletDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* hand + forearm outline */}
        <path d="M20 75 L 150 75 Q 175 75, 185 65 L 220 55 L 235 60 L 240 78 L 220 90 L 200 90 Q 195 100, 200 108 L 210 118 L 205 130 L 185 125 L 175 118 L 150 125 L 20 125 Z" opacity="0.35" />
        {/* wrist bone bump */}
        <circle cx="150" cy="75" r="3" opacity="0.7" />
        <text x="153" y="70" fontSize="7" fill="currentColor" opacity="0.6">wrist bone</text>

        {/* Step 2 — tape wrapped around wrist just past the bone */}
        <ellipse cx="130" cy="100" rx="8" ry="26" strokeWidth="1.7" />
        <ellipse cx="130" cy="100" rx="8" ry="26" strokeWidth="1.7" opacity="0.4" transform="rotate(3 130 100)" />

        {/* Step 3 — tape unrolled below, measuring in mm/inches */}
        <rect x="30" y="155" width="240" height="20" rx="1.5" />
        {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map((t) => (
          <line key={t} x1={30 + t} y1="155" x2={30 + t} y2={t % 40 === 0 ? 165 : 161} />
        ))}
        <text x="30" y="188" fontSize="7" fill="currentColor" opacity="0.7">0</text>
        <text x="150" y="188" fontSize="7" fill="currentColor" opacity="0.7">100 mm</text>
        <text x="245" y="188" fontSize="7" fill="currentColor" opacity="0.7">200 mm</text>
        {/* marked measurement point */}
        <circle cx="200" cy="155" r="2.5" fill="currentColor" />

        {/* Step 4 — add ease (½–1 inch) indicator */}
        <path d="M200 148 L 230 148" strokeDasharray="2 2" />
        <path d="M200 148 l 4 -3 M200 148 l 4 3 M230 148 l -4 -3 M230 148 l -4 3" />
        <text x="215" y="142" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.75">+ ease</text>
      </g>
      <Hotspot n={1} x={150} y={75} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={130} y={100} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={150} y={165} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={215} y={148} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

// ---- ANKLET: tape around ankle above the bone ------------------------------
function AnkletDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 300 220" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* leg + foot */}
        <path d="M110 10 L 108 130 Q 108 155, 128 158 L 240 158 L 250 168 L 250 178 L 230 185 L 130 180 Q 100 178, 96 155 L 96 10" opacity="0.35" />
        {/* ankle bone marker */}
        <circle cx="105" cy="145" r="3" opacity="0.7" />
        <text x="20" y="148" fontSize="7" fill="currentColor" opacity="0.7">ankle bone</text>
        <path d="M55 148 L 95 148" strokeDasharray="1 2" opacity="0.5" />

        {/* Step 2 — tape wrapped ABOVE the bone */}
        <ellipse cx="102" cy="128" rx="12" ry="6" strokeWidth="1.7" />
        <ellipse cx="102" cy="128" rx="12" ry="6" strokeWidth="1.7" opacity="0.4" transform="rotate(4 102 128)" />

        {/* Step 3 — measured while standing barefoot */}
        <line x1="200" y1="185" x2="200" y2="210" opacity="0.5" />
        <path d="M195 210 L 205 210" />
        <text x="145" y="200" fontSize="8" fill="currentColor" opacity="0.7">stand barefoot</text>

        {/* Step 4 — extra drape ease shown as loose loop */}
        <path d="M180 60 C 220 55, 260 65, 270 90 C 275 110, 250 120, 220 115 C 195 112, 180 95, 180 60 Z" opacity="0.5" strokeDasharray="3 3" />
        <text x="225" y="90" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.75">+ drape</text>
      </g>
      <Hotspot n={1} x={105} y={145} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={102} y={128} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={200} y={200} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={225} y={90} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

// ---- EARRING: measure drop from post, weigh on scale -----------------------
function EarringDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 300 220" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* ear silhouette */}
        <path d="M80 30 Q 40 55, 45 115 Q 50 165, 90 170 Q 115 170, 118 148" opacity="0.45" />
        <path d="M100 155 Q 112 155, 112 145 Q 112 133, 100 132" opacity="0.45" />
        {/* piercing hole */}
        <circle cx="90" cy="125" r="3" fill="currentColor" />

        {/* Step 2 — ruler measuring drop from post */}
        <rect x="130" y="30" width="18" height="170" rx="1.5" />
        {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((t) => (
          <line key={t} x1="130" y1={30 + t} x2={t % 40 === 0 ? 148 : 138} y2={30 + t} />
        ))}
        <text x="155" y="35" fontSize="7" fill="currentColor" opacity="0.7">0</text>
        <text x="155" y="115" fontSize="7" fill="currentColor" opacity="0.7">45 mm</text>
        <text x="155" y="195" fontSize="7" fill="currentColor" opacity="0.7">90 mm</text>

        {/* earring: post at top, drop hanging */}
        <line x1="90" y1="125" x2="130" y2="30" strokeWidth="1" opacity="0.5" />
        <line x1="130" y1="30" x2="130" y2="120" strokeDasharray="2 2" />
        <path d="M130 30 Q 118 75, 130 120 Q 142 75, 130 30 Z" />
        {/* drop endpoint */}
        <circle cx="130" cy="120" r="2.5" fill="currentColor" />

        {/* Step 3 — weight on a small scale */}
        <rect x="200" y="150" width="80" height="50" rx="4" />
        <line x1="200" y1="175" x2="280" y2="175" opacity="0.5" />
        <text x="240" y="170" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" opacity="0.85">4.2 g</text>
        <text x="240" y="192" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.6">weight per earring</text>

        {/* Step 4 — clearance to shoulder */}
        <line x1="270" y1="30" x2="270" y2="130" strokeDasharray="3 3" opacity="0.6" />
        <path d="M266 30 L 274 30 M266 130 L 274 130" opacity="0.6" />
        <text x="278" y="82" fontSize="7" fill="currentColor" opacity="0.75">shoulder</text>
        <text x="278" y="92" fontSize="7" fill="currentColor" opacity="0.75">clearance</text>
      </g>
      <Hotspot n={1} x={90} y={125} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={130} y={75} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={240} y={175} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={270} y={80} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

// ---- BRIDAL: parure sized as a set -----------------------------------------
function BridalDiagram({ activeStep, onStepClick }) {
  return (
    <svg viewBox="0 0 300 220" className="w-full h-auto" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* head + shoulders */}
        <circle cx="150" cy="40" r="22" opacity="0.4" />
        <path d="M128 62 C 118 78, 118 88, 108 100 L 60 140" opacity="0.4" />
        <path d="M172 62 C 182 78, 182 88, 192 100 L 240 140" opacity="0.4" />

        {/* Step 1 — ring on hand (anchor size) */}
        <circle cx="45" cy="180" r="14" />
        <circle cx="45" cy="180" r="9" strokeDasharray="2 2" opacity="0.5" />
        <text x="45" y="205" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">ring (anchor)</text>

        {/* Step 2 — necklace matched to neckline */}
        <path d="M128 70 C 140 100, 160 100, 172 70" />
        <path d="M120 72 C 140 115, 160 115, 180 72" opacity="0.65" />
        <line x1="128" y1="88" x2="172" y2="88" strokeDasharray="1 3" opacity="0.5" />
        <text x="200" y="90" fontSize="7" fill="currentColor" opacity="0.7">neckline match</text>

        {/* Step 3 — bangle over knuckles */}
        <ellipse cx="120" cy="180" rx="24" ry="8" />
        <ellipse cx="120" cy="180" rx="24" ry="8" strokeDasharray="2 2" opacity="0.5" transform="rotate(4 120 180)" />
        <text x="120" y="205" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">bangle over knuckle</text>

        {/* Step 4 — earring drop vs hairstyle */}
        <circle cx="230" cy="165" r="3" fill="currentColor" />
        <path d="M230 168 Q 220 185, 230 205 Q 240 185, 230 168 Z" />
        <text x="230" y="217" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.7">earring drop</text>
      </g>
      <Hotspot n={1} x={45} y={180} active={activeStep === 1} onClick={onStepClick} />
      <Hotspot n={2} x={150} y={92} active={activeStep === 2} onClick={onStepClick} />
      <Hotspot n={3} x={120} y={180} active={activeStep === 3} onClick={onStepClick} />
      <Hotspot n={4} x={230} y={185} active={activeStep === 4} onClick={onStepClick} />
    </svg>
  );
}

// ---- Guide data (sourced from standard jeweller sizing guidance) -----------
const GUIDES = {
  Rings: {
    diagram: RingDiagram,
    intro:
      "The most reliable at-home method is the string-and-ruler technique used by most jewellers. You'll need a strip of paper or a piece of non-stretchy string, a pen, and a millimetre ruler.",
    steps: [
      {
        title: "Wrap a string around the base of your finger",
        body:
          "Cut a 100 mm piece of non-stretchy string or a thin strip of paper. Wrap it around the base of the finger you'll wear the ring on. It should sit flat against the skin — snug, but not tight enough to leave a mark. Measure late in the day when the finger is at its widest, and never right after a cold shower.",
      },
      {
        title: "Mark where the string overlaps",
        body:
          "With a pen, make a small mark exactly where the string overlaps itself. That single point represents the full circumference of your finger — this is the measurement the ring size is calculated from. Take three separate readings and use the largest of the three.",
      },
      {
        title: "Lay the string flat and measure the length in millimetres",
        body:
          "Unwrap the string, lay it flat next to a millimetre ruler, and read the distance from the end of the string to the pen mark. This number is your finger circumference in mm — for example, 54.4 mm. Millimetres only; inches will not give you an accurate size.",
      },
      {
        title: "Look up the size on the chart",
        body:
          "Find your circumference in the chart below to get your ring size. If your reading falls between two sizes, always round UP — a slightly loose ring can be resized down, but a ring that won't clear the knuckle cannot be worn at all.",
      },
    ],
    chart: [
      ["Size 5", "49.3 mm circumference"],
      ["Size 6", "51.9 mm circumference"],
      ["Size 7", "54.4 mm circumference"],
      ["Size 8", "57.0 mm circumference"],
      ["Size 9", "59.5 mm circumference"],
      ["Size 10", "62.1 mm circumference"],
    ],
  },
  Necklaces: {
    diagram: NecklaceDiagram,
    intro:
      "Necklaces aren't sized to your body — they come in fixed lengths. The choice is about where you want the chain (and any pendant) to rest. Use a tape measure held against your body to preview each length before you order.",
    steps: [
      {
        title: "Start at the base of the neck",
        body:
          "Loop a soft tape measure around the base of your neck where a shirt collar would sit. This is the 'zero point' — every standard length is measured from here. A 14\" chain sits tight against the throat (a true collar); most people want at least 16\".",
      },
      {
        title: "16\" — Choker, at the collarbone",
        body:
          "Sits right on the collarbone. Best over open necklines, boat necks and evening dresses. Avoid with high collars or turtlenecks — the chain will disappear into the fabric.",
      },
      {
        title: "18\" — Princess, just below the collarbone",
        body:
          "The most universal length and the standard for pendants. Falls just below the collarbone on most adults. Works with almost every neckline and layers cleanly with a 20\" chain above the bust.",
      },
      {
        title: "20–24\" — Matinée & Opera, on the chest",
        body:
          "Matinée (20–22\") rests above the bust and is made for pendants — the drop gives the medallion room to swing and catch light. Opera (24\"+) falls below the bust; a true statement length, often doubled into a two-tier choker for evening wear.",
      },
    ],
    chart: [
      ['14"', "Collar — tight against the throat"],
      ['16"', "Choker — at the collarbone"],
      ['18"', "Princess — just below the collarbone"],
      ['20–22"', "Matinée — above / at the bust"],
      ['24"+', "Opera — below the bust"],
    ],
  },
  Bracelets: {
    diagram: BraceletDiagram,
    intro:
      "Bracelets are sized by wrist circumference plus 'ease' — extra length so the piece drapes rather than grips. Use a soft tape measure or a strip of paper, never a rigid ruler.",
    steps: [
      {
        title: "Find your wrist bone",
        body:
          "Locate the small bump on the outside of your wrist (the ulnar styloid). All measurements are taken just BELOW this point, on the hand side — this is where the bracelet will actually sit. Measuring above the bone gives a reading that is too small.",
      },
      {
        title: "Wrap the tape snug against the skin — once",
        body:
          "Wrap the tape (or strip of paper) around your wrist exactly once. It should sit flush against the skin without indenting it. If you're using paper, mark where it overlaps with a pen — same principle as the ring method.",
      },
      {
        title: "Read the length in millimetres or inches",
        body:
          "Lay the tape or marked paper flat and read the length. That number is your bare wrist circumference. Take the reading with your hand relaxed and flat — clenching the fist adds up to 5 mm.",
      },
      {
        title: "Add ease for the clasp",
        body:
          "Now add extra length so the bracelet moves: add ½\" (1.3 cm) for a tailored fit that sits at the wrist bone, or 1\" (2.5 cm) for a relaxed drape that slides toward the hand. Rigid bangles need ¾\" so the piece clears your knuckles when you put it on.",
      },
    ],
    chart: [
      ['6.5"', "Petite wrist — tailored fit"],
      ['7"', "Standard wrist"],
      ['7.5"', "Comfort / drape fit"],
      ['8"', "Cuff / bangle fit"],
    ],
  },
  Anklets: {
    diagram: AnkletDiagram,
    intro:
      "Anklets follow the same principle as bracelets but sit differently — the piece drapes across the top of the foot rather than resting flat against the ankle, so you need more ease.",
    steps: [
      {
        title: "Find the ankle bone",
        body:
          "Locate the bony bump on the outside of your ankle. This is your reference point — every measurement is taken relative to it.",
      },
      {
        title: "Wrap the tape ABOVE the ankle bone",
        body:
          "Wrap a soft tape measure once around the leg just above the ankle bone, where the anklet naturally rests. Wrapping below the bone or across the foot gives a much larger reading and produces an anklet that slips off.",
      },
      {
        title: "Measure standing, barefoot",
        body:
          "Take the reading standing up and barefoot — sitting or wearing shoes narrows the ankle by 2–4 mm and will make the anklet too tight. Both ankles are rarely identical; measure the one you plan to wear it on.",
      },
      {
        title: "Add drape ease — 1 to 2 cm",
        body:
          "Add 1 cm (⅜\") for a close fit that hugs the ankle, or 2 cm (¾\") for a relaxed drape that falls onto the foot. Traditional khalkhal-style anklets are worn loose at +2.5 cm so the bells sound as you walk.",
      },
    ],
    chart: [
      ['9"', "Close fit — petite ankle"],
      ['10"', "Standard drape"],
      ['11"', "Relaxed drape — falls on foot"],
    ],
  },
  Earrings: {
    diagram: EarringDiagram,
    intro:
      "Earrings are described by two numbers: DROP (how far they hang below the ear) and WEIGHT (how heavy each earring is). Both matter — a light 60 mm chandelier wears very differently to a dense 20 mm stud.",
    steps: [
      {
        title: "Start at the piercing",
        body:
          "The post enters the piercing and sits flush against the back of the lobe. This is the ZERO point for the drop measurement — not the top of the decorative element, and not the top of the ear.",
      },
      {
        title: "Measure the drop with a ruler",
        body:
          "Hold the earring against a ruler, letting it hang freely under its own weight. Read the distance from the post to the LOWEST point of the earring. Studs are under 15 mm; drops are 25–45 mm; chandeliers are 45 mm+.",
      },
      {
        title: "Check the weight per earring",
        body:
          "Weight is quoted per single earring, in grams. Under 4 g wears all day comfortably. 4–8 g is evening-appropriate. Over 8 g we recommend a plastic or silicone support disc behind the lobe — one is included with every chandelier.",
      },
      {
        title: "Check clearance to the shoulder",
        body:
          "For any earring over 40 mm, measure from your earlobe straight down to your shoulder. The earring drop should be at least 20 mm SHORTER than this distance, or it will catch on collars, coats and hair.",
      },
    ],
    chart: [
      ["Studs", "Under 15 mm — all-day, any weight"],
      ["Huggies", "15–25 mm — hug the lobe"],
      ["Drops", "25–45 mm — everyday statement"],
      ["Chandeliers", "45 mm+ — evening / bridal"],
    ],
  },
  Bridal: {
    diagram: BridalDiagram,
    intro:
      "A bridal parure is sized as a matched set — ring, necklace, bangle and earrings scaled together so the proportions read from across the room. Size each piece individually first, then check the four rules below.",
    steps: [
      {
        title: "Size the ring first — it anchors the set",
        body:
          "Measure your ring finger using the string-and-ruler method from the Rings guide. Because the ring is worn every day after the wedding, this measurement anchors the entire parure — the other pieces are scaled around it.",
      },
      {
        title: "Match necklace length to your neckline",
        body:
          "High necks and illusion tops want a 20–22\" chain that sits below the fabric. Sweetheart, off-shoulder and strapless want a 16–18\" chain so the medallion rests on the exposed décolleté. V-necks: aim for the pendant to end 2–3 cm above the point of the V.",
      },
      {
        title: "Bangle must clear the knuckles",
        body:
          "Bridal bangles are rigid — they have to pass over your closed hand to reach the wrist. Measure around the widest part of your hand with the thumb tucked in, and add ¼\" (0.6 cm). This is the bangle's inner circumference, NOT your wrist size.",
      },
      {
        title: "Match earring drop to your hairstyle",
        body:
          "Updo or veil pulled back — go long (45 mm+ chandeliers) since the ear is fully exposed. Loose hair or half-up — stay medium (25–35 mm drops) so the piece still reads through the hair. Match the metal and stone family across all four pieces or the parure won't read as a set.",
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
          Tap a number to read that step
        </div>
      </div>

      {/* Step bubble */}
      <div key={activeStep ?? "empty"} className="mt-4 animate-fade-in">
        {step ? (
          <div className="relative neo-sm rounded-2xl px-5 py-4 border border-primary/20">
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
