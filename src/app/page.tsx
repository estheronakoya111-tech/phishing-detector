"use client";

import { useEffect, useRef, useState } from "react";

import AnalyzerInput from "@/components/sections/AnalyzerInput";
import Result from "@/components/sections/Result";

type AnalysisResult = {
  risk_level: string;
  findings: string[];
  urls: {
    url: string;
    findings: string[];
    score: number;
    threat_intelligence: {
      matched: boolean;
      threat_type: string | null;
      available: boolean;
    };
  }[];
  recommendation: string;
};

const ANALYSIS_STEPS = [
  "Analyzing message...",
  "Checking suspicious patterns...",
  "Inspecting links...",
  "Checking threat intelligence...",
  "Preparing results...",
];

const MIN_ANALYSIS_DURATION = 5000;

export default function Page() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState(false);
  const [analyzerKey, setAnalyzerKey] = useState(0);

  const analysisStartedAt = useRef<number | null>(null);
  const resultTimeout = useRef<number | null>(null);

  const handleAnalysisStart = () => {
    if (resultTimeout.current !== null) {
      window.clearTimeout(resultTimeout.current);
      resultTimeout.current = null;
    }

    setResult(null);
    setAnalysisError(false);
    setAnalysisStep(0);
    setIsAnalyzing(true);

    analysisStartedAt.current = performance.now();
  };

  const handleAnalysisError = () => {
    if (resultTimeout.current !== null) {
      window.clearTimeout(resultTimeout.current);
      resultTimeout.current = null;
    }

    analysisStartedAt.current = null;
    setIsAnalyzing(false);
    setAnalysisStep(0);
    setAnalysisError(true);
  };

  const handleResult = (analysisResult: AnalysisResult) => {
    const startedAt = analysisStartedAt.current;

    if (startedAt === null) {
      setResult(analysisResult);
      setIsAnalyzing(false);
      return;
    }

    const elapsed = performance.now() - startedAt;

    const remainingTime = Math.max(
      0,
      MIN_ANALYSIS_DURATION - elapsed
    );

    resultTimeout.current = window.setTimeout(() => {
      setResult(analysisResult);
      setIsAnalyzing(false);
      setAnalysisError(false);

      resultTimeout.current = null;
      analysisStartedAt.current = null;
    }, remainingTime);
  };

  useEffect(() => {
    if (!isAnalyzing) {
      return;
    }

    const interval = window.setInterval(() => {
      setAnalysisStep((currentStep) => {
        if (currentStep < ANALYSIS_STEPS.length - 1) {
          return currentStep + 1;
        }

        return currentStep;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isAnalyzing]);

  const handleCheckAgain = () => {
    if (resultTimeout.current !== null) {
      window.clearTimeout(resultTimeout.current);
      resultTimeout.current = null;
    }

    analysisStartedAt.current = null;

    setResult(null);
    setIsAnalyzing(false);
    setAnalysisStep(0);
    setAnalysisError(false);

    setAnalyzerKey((currentKey) => currentKey + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <AnalyzerInput
        key={analyzerKey}
        onResult={handleResult}
        onAnalysisStart={handleAnalysisStart}
        onAnalysisError={handleAnalysisError}
      />

      {isAnalyzing && (
        <section className="mx-auto w-full max-w-[1100px] px-6 pb-20 md:px-10">
          <div className="py-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8AA8FF]" />

              <p className="font-sans text-sm font-medium text-foreground">
                {ANALYSIS_STEPS[analysisStep]}
              </p>
            </div>

            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-[#8AA8FF] transition-all duration-700"
                style={{
                  width: `${
                    ((analysisStep + 1) /
                      ANALYSIS_STEPS.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {ANALYSIS_STEPS.map((step, index) => {
                const completed = index < analysisStep;
                const active = index === analysisStep;

                return (
                  <span
                    key={step}
                    className={`font-sans text-xs ${
                      active
                        ? "text-foreground"
                        : completed
                          ? "text-muted-foreground"
                          : "text-muted-foreground/40"
                    }`}
                  >
                    {completed ? "✓ " : ""}
                    {step.replace("...", "")}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {analysisError && !isAnalyzing && (
        <section className="mx-auto w-full max-w-[1100px] px-6 pb-20 md:px-10">
          <div className="flex items-start gap-3 py-1">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8AA8FF]" />

            <div>
              <p className="font-sans text-sm font-medium text-foreground">
                We could not complete the analysis.
              </p>

              <p className="mt-1 font-sans text-xs leading-5 text-muted-foreground">
                Check your internet connection or try again in a
                moment.
              </p>
            </div>
          </div>
        </section>
      )}

      {result && (
        <Result
          result={result}
          onCheckAgain={handleCheckAgain}
        />
      )}
    </>
  );
}