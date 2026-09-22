"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React from "react";
import AuroraButton from "@/components/ui/aurora";
import Link from "next/link";

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const HIGHLIGHTS = [
  { label: "Core Focus", value: "Text + Link" },
  { label: "Inspection Speed", value: "Real-time" },
  { label: "Data Retention", value: "Zero Storage" },
  { label: "Output Style", value: "Human Readable" },
];

const CORE_PILLARS = [
  {
    number: "01",
    title: "Dual Context Analysis",
    description:
      "A message might seem safe on its own, but the link tells another story—or vice versa. Estra inspects text tone and destination URLs together to catch hidden red flags.",
    badge: "Joint Inspection",
  },
  {
    number: "02",
    title: "Privacy First",
    description:
      "Your personal communications are submitted solely to detect security risks. Estra processes inputs to extract threat signals without logging or storing message payload history.",
    badge: "Zero Payload Storage",
  },
  {
    number: "03",
    title: "Threat Intelligence",
    description:
      "When available, Estra compares extracted links against threat-intelligence data sources to cross-check domains against known malicious databases.",
    badge: "Domain Lookup",
  },
];

const DETECTION_STAGES = [
  {
    title: "Paste Content",
    subtitle: "Input Submission",
    description:
      "Copy any suspicious text message, email content, or link directly into the Estra analyzer field.",
  },
  {
    title: "Dual-Engine Analysis",
    subtitle: "Structural & Intent Inspection",
    description:
      "Estra evaluates language urgency, credential harvesting patterns, raw IP hosts, lookalike domains, and suspicious link structures.",
  },
  {
    title: "Clear Findings & Guidance",
    subtitle: "Risk Breakdown",
    description:
      "Receive a High, Medium, or Low risk rating along with an itemized explanation of why specific elements were flagged.",
  },
];

const TEAM_VALUES = [
  {
    title: "Clarity Over Complexity",
    text: "Estra doesn't hide behind confusing technical scores. It explicitly lists the suspicious signs found so you understand why a message was flagged.",
  },
  {
    title: "Assistive Decision Support",
    text: "Estra provides real-time guidance to help you spot phishing attempts before you click links or give away personal account credentials.",
  },
  {
    title: "Built with Integrity",
    text: "No exaggerated claims or artificial guarantees. Estra is designed as an assistive tool to complement personal security awareness.",
  },
];

// ============================================================================
// COMPONENT: 3D SPATIAL TILT CARD
// ============================================================================

function SpatialCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(
    mouseY,
    [-0.5, 0.5],
    ["8deg", "-8deg"]
  );

  const rotateY = useTransform(
    mouseX,
    [-0.5, 0.5],
    ["-8deg", "8deg"]
  );

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="[perspective:1000px] w-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full rounded-[24px] border border-white/[0.08] bg-[#11182B] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors hover:border-white/[0.15]"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AboutPage() {
  return (
    <main className="min-h-screen text-slate-100 antialiased selection:bg-[#8AA8FF]/30 selection:text-white">

      {/* Back to Analyzer */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 pt-6 md:px-10 md:pt-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-white/45 transition-colors hover:text-white focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            ←
          </span>
          Back to Analyzer
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pt-16 pb-12 md:px-10 md:pt-24 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-[820px]"
        >
          <h1 className="mt-2 font-sans text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            Spotting malicious intent before it takes hold.
          </h1>

          <p className="mt-5 font-sans text-lg leading-relaxed text-white/60 md:text-xl">
            ESTRA is an assistive security platform built to help you
            recognize phishing attempts before interacting with them. By
            evaluating messages and links side-by-side, ESTRA highlights
            suspicious signs so you don’t have to guess.
          </p>
        </motion.div>

        {/* Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-white/[0.08] bg-[#11182B]/60 p-5 md:grid-cols-4 md:p-6"
        >
          {HIGHLIGHTS.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="font-sans text-2xl font-semibold text-white md:text-3xl">
                {item.value}
              </p>

              <p className="font-sans text-xs text-white/40 md:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <div className="max-w-[600px]">
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Engineered for clarity and privacy
            </h2>

            <p className="mt-2 font-sans text-base text-white/50">
              How ESTRA combines message analysis with link threat
              inspection.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {CORE_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col justify-between rounded-[20px] border border-white/[0.07] bg-[#11182B] p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium text-[#8AA8FF]">
                      {pillar.number}
                    </span>

                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-white/40">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 font-sans text-xl font-semibold text-white">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 font-sans text-sm leading-relaxed text-white/50">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spatial 3D Interactive Feature Focus */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <SpatialCard>
            <div className="grid gap-7 md:grid-cols-2 md:items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#8AA8FF]">
                  Detection Architecture
                </span>

                <h3 className="mt-2 font-sans text-3xl font-semibold text-white md:text-4xl">
                  Message + Link context evaluated together.
                </h3>

                <p className="mt-3 font-sans text-sm leading-relaxed text-white/55 md:text-base">
                  Most link checkers look at a domain in isolation. ESTRA
                  evaluates the body text and destination URL as a pair,
                  revealing deceptive patterns—like fake bank alerts paired
                  with unverified links—that standard checkers miss.
                </p>

                <div className="mt-6">
                  <Link href="/">
                    <AuroraButton>
                      Try Analyzer Demo →
                    </AuroraButton>
                  </Link>
                </div>
              </div>

              {/* Graphical Display Box inside 3D Spatial Frame */}
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                  <p className="text-[11px] text-white/40">
                    INPUT_PAYLOAD
                  </p>

                  <p className="mt-1 text-white/80">
                    &quot;URGENT: Your account has been suspended. Verify at https://secure-account-check.com&quot;
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">
                      LANGUAGE FLAG
                    </span>

                    <span className="text-amber-300">
                      URGENCY CLAIM
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">
                      LINK HOST
                    </span>

                    <span className="text-rose-400">
                      SUSPICIOUS TLD
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">
                      CALCULATED RISK
                    </span>

                    <span className="text-rose-400">
                      HIGH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SpatialCard>
        </div>
      </section>

      {/* Analysis Flow Timeline */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <div className="max-w-[600px]">
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl">
              How ESTRA inspects threats
            </h2>

            <p className="mt-2 font-sans text-base text-white/50">
              A straightforward process: Paste → Analyze → Understand.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {DETECTION_STAGES.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-[#11182B] p-5 md:flex-row md:items-center md:justify-between md:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] font-mono text-sm text-[#8AA8FF]">
                    0{idx + 1}
                  </div>

                  <div>
                    <h3 className="font-sans text-lg font-semibold text-white">
                      {stage.title}
                    </h3>

                    <p className="font-sans text-xs text-[#8AA8FF]/80">
                      {stage.subtitle}
                    </p>

                    <p className="mt-1.5 font-sans text-sm text-white/50 md:max-w-xl">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Values */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Our Core Principles
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {TEAM_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6"
              >
                <h3 className="font-sans text-lg font-semibold text-white">
                  {val.title}
                </h3>

                <p className="mt-2 font-sans text-sm leading-relaxed text-white/50">
                  {val.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitation Notice */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-8 md:px-10">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 md:p-6">
          <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-amber-300">
            Important Limitation
          </h3>

          <p className="mt-1.5 font-sans text-xs leading-relaxed text-white/60 md:text-sm">
            ESTRA is an assistive security tool designed to support your
            judgment, not an absolute guarantee of safety. Phishing
            techniques constantly adapt. Always verify unexpected requests
            through official direct channels.
          </p>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-12 md:px-10">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 md:p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-white/30">
            Built With
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Next.js / React",
              "Tailwind CSS",
              "Python",
              "Flask",
              "Threat Intelligence API",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 font-mono text-xs text-white/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1100px] px-6 text-center md:px-10">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Never second-guess a suspicious message again.
          </h2>

          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-white/50">
            Paste any doubtful email, text message, or link into ESTRA and
            get a clear security breakdown.
          </p>

          <div className="mt-6 flex justify-center">
            <Link href="/">
              <AuroraButton>
                Spot the Signs Now →
              </AuroraButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}