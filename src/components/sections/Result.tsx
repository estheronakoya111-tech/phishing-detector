import React from "react";
import AuroraButton from "@/components/ui/aurora";
// ==========================================
// TYPE DEFINITIONS
// ==========================================
type UrlFinding = {
  url: string;
  findings: string[];
  score: number;
  threat_intelligence: {
    matched: boolean;
    threat_type: string | null;
    available: boolean;
  };
};

type ResultData = {
  risk_level: string; // "HIGH", "MEDIUM", "LOW"
  findings: string[];
  urls: UrlFinding[];
  recommendation: string;
};

type ResultProps = {
  result?: ResultData | null;
  onCheckAgain: () => void;
};

// ==========================================
// HELPER: RISK CONFIGURATION
// ==========================================
function getRiskConfig(level: string = "") {
  const normalized = level.toUpperCase();

  switch (normalized) {
    case "HIGH":
    case "CRITICAL":
      return {
        headline: "This message looks suspicious.",
        subtext: "We found several signals worth paying attention to.",
        badgeDot: "bg-[#718096]", // Dark grey dot icon matching screenshot
        gaugeProgress: "w-[85%]", // Fills gauge bar up to HIGH
      };

    case "MEDIUM":
    case "MODERATE":
      return {
        headline: "Proceed with caution.",
        subtext: "Some elements match known risk patterns.",
        badgeDot: "bg-[#718096]",
        gaugeProgress: "w-[50%]", // Fills gauge bar up to MEDIUM
      };

    case "LOW":
    case "SAFE":
      return {
        headline: "No obvious threats detected.",
        subtext: "This message appears clear based on automated checks.",
        badgeDot: "bg-[#718096]",
        gaugeProgress: "w-[15%]", // Fills gauge bar up to LOW
      };

    default:
      return {
        headline: "Analysis Complete",
        subtext: "Review the detected details below.",
        badgeDot: "bg-[#718096]",
        gaugeProgress: "w-[0%]",
      };
  }
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Result({ result, onCheckAgain }: ResultProps) {
  // Safe Fallback if backend returns null/empty
  if (!result) {
    return (
      <section className="mx-auto w-full max-w-[1100px] px-6 py-20 text-center">
        <div className="rounded-[20px] border border-white/10 bg-[#0D131F] p-12">
          <p className="font-sans text-sm text-[#9CA9BC]">
            No analysis data available yet.
          </p>
        </div>
      </section>
    );
  }

  const config = getRiskConfig(result.risk_level);
  const signalsCount = result.findings?.length || 0;
  const linksCount = result.urls?.length || 0;

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col px-6 pb-24 pt-8 md:px-10">
      
      {/* ----------------------------------------------------------------- */}
      {/* 1. TOP HEADER: ANALYSIS COMPLETE + DYNAMIC HEADLINE              */}
      {/* ----------------------------------------------------------------- */}
      <div className="mb-10">
        {/* Eyebrow label */}
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9CA9BC]">
          ANALYSIS COMPLETE
        </span>

        {/* Headline */}
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          {config.headline}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 font-sans text-base text-[#9CA9BC] md:text-lg">
          {config.subtext}
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. MAIN RISK LEVEL CARD                                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-[20px] border border-white/10 bg-[#0D131F] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Risk Badge & Text */}
          <div className="lg:col-span-6">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9CA9BC]">
              RISK LEVEL
            </span>

            {/* HIGH • Badge */}
            <div className="mt-2 flex items-center gap-2">
              <h2 className="font-heading text-4xl font-black uppercase tracking-wide text-white md:text-5xl">
                {result.risk_level || "HIGH"}
              </h2>
              <span className="h-2 w-2 rounded-full bg-[#718096]" />
            </div>

            {/* Signals Count Subtitle */}
            <p className="mt-4 font-heading text-lg font-bold text-white">
              {signalsCount} suspicious signals detected
            </p>

            {/* Card Description */}
            <p className="mt-2 font-sans text-xs leading-relaxed text-[#9CA9BC]">
              The message contains patterns that may indicate an attempt to pressure you or request sensitive information.
            </p>
          </div>

          {/* Right Column: Progress Gauge Bar */}
          <div className="lg:col-span-6">
            <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[#080C14] p-6">
              
              {/* Track Bar */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                {/* Active Filled Progress Bar */}
                <div
                  className={`h-full rounded-full bg-[#8AA8FF] transition-all duration-500 ${config.gaugeProgress}`}
                />
              </div>

              {/* LOW / MEDIUM / HIGH labels below bar */}
              <div className="flex justify-between font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA9BC]">
                <span>LOW</span>
                <span>MEDIUM</span>
                <span>HIGH</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. THREE-COLUMN METRIC STATS BAR                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        
        {/* Box 1: MESSAGE SIGNALS */}
        <div className="rounded-[18px] border border-white/10 bg-[#0D131F] p-6">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9CA9BC]">
            MESSAGE SIGNALS
          </span>
          <p className="mt-3 font-heading text-2xl font-bold text-white">
            {signalsCount} <span className="text-sm font-normal text-[#9CA9BC]">detected</span>
          </p>
        </div>

        {/* Box 2: LINKS ANALYZED */}
        <div className="rounded-[18px] border border-white/10 bg-[#0D131F] p-6">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9CA9BC]">
            LINKS ANALYZED
          </span>
          <p className="mt-3 font-heading text-2xl font-bold text-white">
            {linksCount}
          </p>
        </div>

        {/* Box 3: ANALYSIS */}
        <div className="rounded-[18px] border border-white/10 bg-[#0D131F] p-6">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9CA9BC]">
            ANALYSIS
          </span>
          <p className="mt-3 font-heading text-2xl font-bold text-white">
            Complete
          </p>
        </div>

      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. WHAT WE FOUND (DETAILED BREAKDOWN)                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-16">
        <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9CA9BC]">
          WHAT WE FOUND
        </h3>

        {/* List of Message Findings */}
        <div className="mt-6 flex flex-col gap-3">
          {result.findings && result.findings.length > 0 ? (
            result.findings.map((finding, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-[14px] border border-white/10 bg-[#0D131F] p-5"
              >
                <span className="text-base text-amber-400">⚠️</span>
                <p className="font-sans text-sm leading-relaxed text-white">
                  {finding}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[14px] border border-white/10 bg-[#0D131F] p-5">
              <p className="font-sans text-sm text-[#9CA9BC]">
                No threat patterns flagged in message body.
              </p>
            </div>
          )}
        </div>

        {/* Analyzed URLs Details */}
        {result.urls && result.urls.length > 0 && (
          <div className="mt-10">
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9CA9BC]">
              ANALYZED LINKS ({result.urls.length})
            </h4>

            <div className="mt-4 flex flex-col gap-4">
              {result.urls.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[14px] border border-white/10 bg-[#0D131F] p-6"
                >
                  <p className="break-all font-mono text-sm font-semibold text-[#8AA8FF]">
                    {item.url}
                  </p>

                  {item.findings && item.findings.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                      {item.findings.map((finding, fIndex) => (
                        <p key={fIndex} className="font-sans text-xs text-[#9CA9BC]">
                          • {finding}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Section */}
        {result.recommendation && (
          <div className="mt-10 rounded-[16px] border border-[#8AA8FF]/20 bg-[#8AA8FF]/5 p-6">
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#8AA8FF]">
              RECOMMENDATION
            </h4>
            <p className="mt-3 font-sans text-sm leading-relaxed text-white">
              {result.recommendation}
            </p>
          </div>
        )}
      {/* Check Again */}
     <div className="mt-10 flex justify-center">
  <AuroraButton onClick={onCheckAgain}>
    Check Again →
  </AuroraButton>
</div>
      </div>

    </section>
  );
}