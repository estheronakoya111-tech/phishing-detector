
"use client";

import { useState, useMemo, useRef, ChangeEvent, UIEvent } from "react";
import AuroraButton from "@/components/ui/aurora";

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

interface AnalyzerInputProps {
  onResult: (result: AnalysisResult) => void;
  onAnalysisStart: () => void;
  onAnalysisError: (message?: string) => void;
}

// ==========================================
// PHISHING TRIGGER KEYWORDS
// ==========================================
const RISK_KEYWORDS = [
  "action required",
  "verify account",
  "verify your account",
  "immediate action",
  "security alert",
  "account suspended",
  "unauthorized login",
  "update payment",
  "urgent",
  "password reset",
  "suspicious activity",
];

// ==========================================
// URL REGEX
// ==========================================
const URL_REGEX =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*)/gi;

const KEYWORD_REGEX = new RegExp(
  `\\b(${RISK_KEYWORDS.join("|")})\\b`,
  "gi"
);

// ==========================================
// SAMPLE MESSAGES
// ==========================================
const SAMPLES: { label: string; text: string }[] = [
  {
    label: "Bank alert",
    text: "Security alert: unauthorized login detected on your account. Immediate action required. Verify your account within 24 hours or it will be suspended.\n\nhttp://secure-login.bankverify.top/confirm\n\nEnter your password and one-time code to restore access.",
  },
  {
    label: "Delivery fee",
    text: "Your parcel is on hold. A customs fee of $1.99 is required before delivery. Pay here: https://bit.ly/3xParcelFee\n\nFinal notice: the package will be returned in 48 hours.",
  },
  {
    label: "Prize claim",
    text: "Congratulations! You have won a gift card. Claim your prize now: http://paypal.com.rewards-center.xyz/claim\n\nAct now, this offer expires today. Confirm your card number to receive it.",
  },
  {
    label: "Looks normal",
    text: "Hi Ada, the notes from Tuesday's meeting are in the shared folder. Let me know if you'd like changes before Friday and I'll update them.",
  },
];

export default function AnalyzerInput({
  onResult,
  onAnalysisStart,
  onAnalysisError,
}: AnalyzerInputProps) {
  const [text, setText] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const maxLength = 10000;

  // ==========================================
  // REAL-TIME HIGHLIGHTING
  // ==========================================
  const highlightedContent = useMemo(() => {
    if (!text) return null;

    const combinedRegex = new RegExp(
      `(${URL_REGEX.source})|(${KEYWORD_REGEX.source})`,
      "gi"
    );

    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(text)) !== null) {
      const matchText = match[0];
      const matchIndex = match.index;

      // Normal text before the match
      if (matchIndex > lastIndex) {
        parts.push(text.slice(lastIndex, matchIndex));
      }

      // Check whether the matched text is a URL
      const isUrl = new RegExp(
        `^${URL_REGEX.source}$`,
        "i"
      ).test(matchText);

      if (isUrl) {
        // URL highlight
        parts.push(
          <span
            key={matchIndex}
            className="rounded bg-[#8AA8FF]/25 text-transparent underline decoration-[#8AA8FF]/60 underline-offset-4"
          >
            {matchText}
          </span>
        );
      } else {
        // Suspicious keyword highlight
        parts.push(
          <span
            key={matchIndex}
            className="rounded bg-red-500/25 text-transparent"
          >
            {matchText}
          </span>
        );
      }

      lastIndex = combinedRegex.lastIndex;
    }

    // Remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  }, [text]);

  // Keeps the highlight layer aligned when the textarea scrolls
  const syncScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // ==========================================
  // ANALYZE
  // ==========================================
  const handleAnalyze = async () => {
    // Prevent duplicate submissions
    if (hasSubmitted || !text.trim()) {
      return;
    }

    // Lock immediately
    setHasSubmitted(true);

    // Tell Home that analysis has started
    onAnalysisStart();

    try {
      // Read base URL from environment variable,
      // falling back to local port 8000 if not set
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://127.0.0.1:8000";

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      // Rate limit exceeded
      if (response.status === 429) {
        onAnalysisError(
          "Too many analysis requests. Please wait a minute before trying again."
        );
        return;
      }

      // Other server errors
      if (!response.ok) {
        onAnalysisError(
          "We could not complete the analysis. Please try again."
        );
        return;
      }

      const result: AnalysisResult = await response.json();

      // Send result back to Home
      onResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);

      // Unlock the analyzer so the user can try again
      setHasSubmitted(false);

      // Network / connection error
      onAnalysisError(
        "We could not reach the analysis service. Check your internet connection and try again."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col px-6 pb-20 pt-7 md:px-10 md:pt-10">

      {/* Guidance */}
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Check a message or link
        </h1>

        <p className="mt-2 max-w-[650px] font-sans text-sm leading-6 text-muted-foreground md:text-base">
          Paste a suspicious message, link, or both below. We’ll look
          for signs that may indicate phishing.
        </p>
      </div>

      {/* ==========================================
          NO MESSAGE HANDY
          Only shows while the box is empty
          ========================================== */}
      {!text && !hasSubmitted && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            No message handy? Try one:
          </span>

          {SAMPLES.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setText(s.text);
                textareaRef.current?.focus();
              }}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-ice-blue/60 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ice-blue"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Shell */}
      <div className="group relative overflow-hidden rounded-[22px] border border-border bg-surface transition-colors duration-300 focus-within:border-ice-blue/60">

        <div className="relative min-h-[360px] w-full md:min-h-[380px]">

          {/* Highlight Layer */}
          <div
            ref={highlightRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none overflow-hidden whitespace-pre-wrap break-words px-6 py-6 font-sans text-[15px] font-normal leading-[1.8] text-transparent md:px-7 md:py-7"
          >
            {highlightedContent}

            {text.endsWith("\n") && <br />}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            maxLength={maxLength}
            value={text}
            onChange={handleChange}
            onScroll={syncScroll}
            placeholder="Paste a message, link, or both here…"
            disabled={hasSubmitted}
            className="absolute inset-0 h-full w-full resize-none overflow-y-auto bg-transparent px-6 py-6 font-sans text-[15px] font-normal leading-[1.8] text-foreground caret-white outline-none [scrollbar-width:none] placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-80 md:px-7 md:py-7 [&::-webkit-scrollbar]:hidden"
          />
        </div>

        {/* Bottom Metadata */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3.5 md:px-7">
          <span className="font-sans text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
            {text.length.toLocaleString()} /{" "}
            {maxLength.toLocaleString()}
          </span>

          <span className="font-sans text-[11px] text-muted-foreground/70">
            Message + link
          </span>
        </div>
      </div>

      {/* ==========================================
          SPOT THE SIGNS
          Comes back if the analysis fails
          ========================================== */}
      {!hasSubmitted && (
        <div className="mt-5 flex items-center justify-end">
          <AuroraButton
            disabled={!text.trim()}
            onClick={handleAnalyze}
          >
            Spot the Signs →
          </AuroraButton>
        </div>
      )}
    </section>
  );
}

