"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import AuroraButton from "@/components/ui/aurora";

import Estra from "./Estra";

/* ==========================================================================
   DEMO CONTENT
   Each scenario is a message split into segments. Segments with a `flag` get
   highlighted in place while the scanner works through them, so the visitor
   sees exactly WHICH words trigger each finding. The last scenario is safe on
   purpose: it shows Estra doesn't just cry wolf.
   ========================================================================== */

type Severity = "high" | "med" | "ok";

interface Flag {
  label: string;
  note: string;
  severity: Severity;
  weight: number;
}

interface Segment {
  text: string;
  flag?: Flag;
}

interface Scenario {
  segments: Segment[];
}

const SCENARIOS: Scenario[] = [
  {
    segments: [
      {
        text: "URGENT:",
        flag: {
          label: "Urgent language",
          note: "Pushes you to act before you think.",
          severity: "med",
          weight: 18,
        },
      },
      { text: " " },
      {
        text: "Your account has been suspended.",
        flag: {
          label: "Account suspension claim",
          note: "A common scare tactic to force a reaction.",
          severity: "med",
          weight: 20,
        },
      },
      { text: " " },
      {
        text: "Verify your account now",
        flag: {
          label: "Credential request pattern",
          note: "Real services rarely ask for this by message.",
          severity: "high",
          weight: 24,
        },
      },
      { text: " at " },
      {
        text: "https://secure-account-check.com",
        flag: {
          label: "Suspicious link",
          note: "Generic look-alike domain, not a known brand.",
          severity: "high",
          weight: 30,
        },
      },
    ],
  },
  {
    segments: [
      { text: "Courier notice: We couldn't deliver your parcel. " },
      {
        text: "Pay a ₦1,500 redelivery fee",
        flag: {
          label: "Unexpected payment request",
          note: "Small fees are a common way to capture card details.",
          severity: "high",
          weight: 26,
        },
      },
      { text: " " },
      {
        text: "within 12 hours",
        flag: {
          label: "Artificial deadline",
          note: "Urgency is used to stop you checking.",
          severity: "med",
          weight: 18,
        },
      },
      { text: ": " },
      {
        text: "https://redeliver-parcel-fee.top",
        flag: {
          label: "Suspicious link",
          note: "Unusual domain ending and no courier name.",
          severity: "high",
          weight: 30,
        },
      },
    ],
  },
  {
    segments: [
      { text: "Your verification code is 482913. " },
      {
        text: "It expires in 10 minutes.",
        flag: {
          label: "Normal expiry window",
          note: "Short-lived codes are standard.",
          severity: "ok",
          weight: 0,
        },
      },
      { text: " " },
      {
        text: "Never share this code with anyone.",
        flag: {
          label: "Warns you not to share",
          note: "Genuine code messages say this. No link, no request.",
          severity: "ok",
          weight: 0,
        },
      },
    ],
  },
];

const SCAN_STEPS = [
  "Reading the wording…",
  "Checking the link…",
  "Comparing against known scams…",
];

const BASE_SCORE = 6;

const SEVERITY_STYLE: Record<
  Severity,
  { text: string; fill: string; line: string }
> = {
  high: {
    text: "#FF9A9A",
    fill: "rgba(255,107,107,0.16)",
    line: "#FF6B6B",
  },
  med: {
    text: "#FFCB7D",
    fill: "rgba(255,180,84,0.15)",
    line: "#FFB454",
  },
  ok: {
    text: "#7BE5B5",
    fill: "rgba(80,220,160,0.13)",
    line: "#4FD8A0",
  },
};

const CARD_GLOW = {
  idle: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 120px -40px rgba(138,168,255,0.22)",
  high: "0 0 0 1px rgba(255,107,107,0.30), 0 40px 130px -30px rgba(255,107,107,0.30)",
  med: "0 0 0 1px rgba(255,180,84,0.28), 0 40px 130px -30px rgba(255,180,84,0.24)",
  ok: "0 0 0 1px rgba(80,220,160,0.28), 0 40px 130px -30px rgba(80,220,160,0.24)",
} as const;

const HEADLINE = "Something about that message and link feels off.".split(" ");

type Stage = "typing" | "scanning" | "verdict";

/* ==========================================================================
   HELPERS
   ========================================================================== */

const getFlags = (s: Scenario) =>
  s.segments.flatMap((seg) => (seg.flag ? [seg.flag] : []));

const getLength = (s: Scenario) =>
  s.segments.reduce((n, seg) => n + seg.text.length, 0);

const scoreTone = (score: number) =>
  score >= 60 ? "high" : score >= 30 ? "med" : "ok";

const toneColor = { high: "#FF6B6B", med: "#FFB454", ok: "#4FD8A0" } as const;
const toneLabel = { high: "High risk", med: "Medium risk", ok: "Low risk" } as const;

function Counter({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, motionValue]);

  return <>{display}</>;
}

interface IntroOverlayProps {
  onEnter: () => void;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function IntroOverlay({ onEnter }: IntroOverlayProps) {
  const reduced = useReducedMotion();

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [rawStage, setStage] = useState<Stage>("typing");
  const [rawTypedCount, setTypedCount] = useState(0);
  const [rawFlagCount, setFlagCount] = useState(0);

  const scenario = SCENARIOS[scenarioIndex];
  const flags = getFlags(scenario);
  const totalChars = getLength(scenario);
  const fullText = scenario.segments.map((s) => s.text).join("");

  // With reduced motion, skip the animation and show the finished state.
  const stage: Stage = reduced ? "verdict" : rawStage;
  const typedCount = reduced ? totalChars : rawTypedCount;
  const flagCount = reduced ? flags.length : rawFlagCount;

  // Where each segment starts, and how many flags come before it.
  const segmentMeta = scenario.segments.reduce<
    { start: number; flagIndex: number }[]
  >((acc, _seg, i) => {
    const prev = acc[i - 1];
    const prevSeg = scenario.segments[i - 1];
    acc.push({
      start: prev ? prev.start + prevSeg.text.length : 0,
      flagIndex: prev ? prev.flagIndex + (prevSeg.flag ? 1 : 0) : 0,
    });
    return acc;
  }, []);

  const score = Math.min(
    100,
    BASE_SCORE +
      flags.slice(0, flagCount).reduce((sum, f) => sum + f.weight, 0),
  );
  const tone = scoreTone(score);
  const glowKey = stage === "verdict" ? tone : "idle";

  // Cursor spotlight
  const px = useMotionValue(760);
  const py = useMotionValue(300);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${px}px ${py}px, rgba(138,168,255,0.10), transparent 65%)`;

  /* ---------- 1. Typing ---------- */
  useEffect(() => {
    if (reduced || stage !== "typing") return;

    if (typedCount >= totalChars) {
      const t = window.setTimeout(() => setStage("scanning"), 700);
      return () => window.clearTimeout(t);
    }

    const lastChar = fullText[typedCount - 1] ?? "";
    const delay = 20 + Math.random() * 16 + (/[.:]/.test(lastChar) ? 160 : 0);
    const t = window.setTimeout(() => setTypedCount((c) => c + 1), delay);
    return () => window.clearTimeout(t);
  }, [reduced, stage, typedCount, totalChars, fullText]);

  /* ---------- 2. Scanning: reveal one finding at a time ---------- */
  useEffect(() => {
    if (reduced || stage !== "scanning") return;

    if (flagCount < flags.length) {
      const t = window.setTimeout(() => setFlagCount((c) => c + 1), 950);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(
      () => setStage("verdict"),
      flags.length === 0 ? 1600 : 800,
    );
    return () => window.clearTimeout(t);
  }, [reduced, stage, flagCount, flags.length]);

  /* ---------- 3. Verdict, then next scenario ---------- */
  useEffect(() => {
    if (reduced || stage !== "verdict") return;

    const t = window.setTimeout(() => {
      setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
      setTypedCount(0);
      setFlagCount(0);
      setStage("typing");
    }, 4800);
    return () => window.clearTimeout(t);
  }, [reduced, stage]);

  /* ---------- Status line ---------- */
  const revealedFlags = flags.slice(0, flagCount);
  const problemCount = revealedFlags.filter((f) => f.severity !== "ok").length;

  let status = "Ready to scan";
  if (stage === "scanning") {
    status = SCAN_STEPS[Math.min(flagCount, SCAN_STEPS.length - 1)];
  } else if (stage === "verdict") {
    status =
      tone === "ok"
        ? "No phishing signs found"
        : `${toneLabel[tone]} · ${problemCount} ${
            problemCount === 1 ? "sign" : "signs"
          } found`;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onPointerMove={(e) => {
        px.set(e.clientX);
        py.set(e.clientY);
      }}
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[#0B1020]"
    >
      {/* ------------------------------------------------------------------
          BACKGROUND: grid, glow, cursor spotlight
          ------------------------------------------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 65% 50%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 65% 50%, black, transparent 75%)",
          }}
        />
        <div className="absolute -right-40 top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-[#4C6FFF]/[0.14] blur-[140px]" />
        {!reduced && (
          <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        )}
      </div>

      {/* ------------------------------------------------------------------
          WORDMARK
          ------------------------------------------------------------------ */}
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.1 }}
  className="absolute left-6 top-6 z-20 md:left-10 md:top-8"
>
  

  <Estra className="block h-auto w-8 " />
</motion.div>

      {/* ------------------------------------------------------------------
          CONTENT
          ------------------------------------------------------------------ */}
      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1240px] flex-col justify-center gap-12 px-6 pb-16 pt-28 md:px-10 lg:flex-row lg:items-center lg:gap-14 lg:py-16">
        {/* ---------------- HERO COPY ---------------- */}
        <div className="lg:w-[44%] lg:shrink-0">
          <h1 className="font-sans text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.035em] text-white md:text-6xl">
            {HEADLINE.map((word, i) => (
              <span
                key={i}
                className="mr-[0.24em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.25 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="mt-6 font-sans text-xl font-medium tracking-[-0.02em] text-white/80 md:text-2xl"
          >
            Don&apos;t guess. Spot the signs.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
            className="mt-4 max-w-[480px] font-sans text-[15px] leading-7 text-white/55 md:text-base"
          >
            ESTRA analyzes messages and links together, looking for suspicious
            wording, unusual links, and patterns commonly associated with
            phishing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mt-9"
          >
            <AuroraButton onClick={onEnter}>Spot the Signs →</AuroraButton>
          </motion.div>
        </div>

        {/* ---------------- LIVE SCAN DEMO ---------------- */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 flex-1"
        >
          <motion.div
            animate={{ boxShadow: CARD_GLOW[glowKey] }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[22px] bg-[#11182B]/90 backdrop-blur-xl"
          >
            {/* Input header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-3.5">
              <span className="text-xs text-white/40">Message + link</span>
              <span className="text-xs tabular-nums text-white/30">
                {typedCount.toLocaleString()} / 10,000
              </span>
            </div>

            {/* Message with in-place highlights */}
            <div className="relative min-h-[168px] overflow-hidden px-6 py-6 sm:min-h-[150px]">
              <p className="relative z-10 break-words font-sans text-base leading-[1.9] text-white/85 md:text-[17px]">
                {scenario.segments.map((seg, i) => {
                  const { start, flagIndex: myIndex } = segmentMeta[i];
                  const visible = seg.text.slice(
                    0,
                    Math.max(0, typedCount - start),
                  );
                  if (!visible) return null;

                  if (!seg.flag) return <span key={i}>{visible}</span>;

                  const revealed = myIndex < flagCount;
                  const active =
                    stage === "scanning" && myIndex === flagCount;
                  const style = SEVERITY_STYLE[seg.flag.severity];

                  return (
                    <span
                      key={i}
                      className="rounded-[5px] px-[3px] py-px transition-all duration-500"
                      style={{
                        background: revealed
                          ? style.fill
                          : active
                            ? "rgba(255,255,255,0.08)"
                            : "transparent",
                        color: revealed ? style.text : undefined,
                        boxShadow: revealed
                          ? `inset 0 -2px 0 ${style.line}`
                          : "none",
                      }}
                    >
                      {visible}
                    </span>
                  );
                })}

                {stage === "typing" && (
                  <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-[#8AA8FF]" />
                )}
              </p>

              {stage === "scanning" && !reduced && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 w-28"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(138,168,255,0.16), transparent)",
                  }}
                  initial={{ left: "-15%" }}
                  animate={{ left: "110%" }}
                  transition={{
                    duration: 1.9,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </div>

            {/* Risk meter */}
            <div className="border-t border-white/[0.07] px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full transition-colors duration-500"
                    style={{
                      background:
                        stage === "typing"
                          ? "rgba(255,255,255,0.25)"
                          : stage === "scanning"
                            ? "#8AA8FF"
                            : toneColor[tone],
                    }}
                  />
                  <span className="truncate text-sm font-medium text-white/70">
                    {status}
                  </span>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-white/40">
                  {stage === "typing" ? "–" : <Counter value={score} />}
                  <span className="text-white/20"> / 100</span>
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  animate={{
                    width: stage === "typing" ? "0%" : `${score}%`,
                    backgroundColor:
                      stage === "scanning" && flagCount === 0
                        ? "#8AA8FF"
                        : toneColor[tone],
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Findings */}
            <div className="min-h-[76px] border-t border-white/[0.07] px-6 py-2 md:min-h-[196px]">
              <AnimatePresence initial={false}>
                {revealedFlags.map((flag) => {
                  const style = SEVERITY_STYLE[flag.severity];
                  return (
                    <motion.div
                      key={`${scenarioIndex}-${flag.label}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex items-start gap-3 border-b border-white/[0.05] py-2.5 last:border-b-0"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: style.line }}
                      />
                      <div className="min-w-0 md:flex md:flex-1 md:items-baseline md:justify-between md:gap-6">
                        <p className="text-sm font-medium text-white/80">
                          {flag.label}
                        </p>
                        <p className="text-xs leading-5 text-white/40 md:text-right">
                          {flag.note}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}