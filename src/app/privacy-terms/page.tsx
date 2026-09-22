"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Tab = "privacy" | "terms";

type Section = {
  id: string;
  title: string;
  body: string;
  items?: { title: string; text: string }[];
  note?: string;
};

type Doc = {
  label: string;
  summary: string;
  callout: { title: string; body: string };
  sections: Section[];
};

const UPDATED = "September 2026";

const DOCS: Record<Tab, Doc> = {
  privacy: {
    label: "Privacy Policy",
    summary: "What ESTRA processes, what it sends out, and what it keeps.",
    callout: {
      title: "Zero payload logging",
      body: "When you paste a text message, email snippet, or link into Estra, it is processed only to inspect it for threats. We do not store, retain, or sell the content of your submissions, and we do not build persistent profiles from it.",
    },
    sections: [
      {
        id: "information",
        title: "Information processed",
        body: "To evaluate potential security risks, Estra processes the following inputs during an active analysis request.",
        items: [
          {
            title: "Message text",
            text: "Checked for urgency, credential-harvesting patterns, financial requests, suspicious wording, and other social-engineering signals.",
          },
          {
            title: "Extracted URLs",
            text: "Parsed to inspect URL structure, domain characteristics, IP-based hosts, unusual patterns, and other signs of a suspicious link.",
          },
        ],
      },
      {
        id: "threat-intelligence",
        title: "Threat intelligence",
        body: "ESTRA checks the URLs it extracts against the Google Safe Browsing API to see whether each one is known for phishing or other malicious activity.",
        note: "Only the extracted URL is sent to Google Safe Browsing. The surrounding message is never included in that request.",
      },
      {
        id: "analytics",
        title: "Analytics and infrastructure",
        body: "Standard technical telemetry, such as request counts and basic hosting diagnostic logs, may be processed by the infrastructure that runs Estra. This helps us keep the service available and performing well.",
      },
      {
        id: "responsibility",
        title: "Your responsibility",
        body: "Avoid submitting passwords, authentication codes, payment details, private keys, or any other sensitive information that isn't necessary for an analysis.",
      },
    ],
  },

  terms: {
    label: "Terms of Service",
    summary: "The ground rules for using Estra, in plain language.",
    callout: {
      title: "An assistive security tool",
      body: "ESTRA helps identify common phishing indicators. Its results are informational and do not guarantee that a message or link is safe. Always verify sensitive requests through trusted, official channels.",
    },
    sections: [
      {
        id: "acceptable-use",
        title: "Acceptable use",
        body: "ESTRA is provided for personal, educational, and internal decision-support purposes. You agree not to reverse engineer, overload, abuse, or intentionally disrupt the analysis service or its backend infrastructure.",
      },
      {
        id: "no-guarantee",
        title: "No security guarantee",
        body: "Phishing and social-engineering techniques keep evolving. Estra may miss new, modified, or previously unknown threats. You remain responsible for independently verifying sensitive requests and deciding how to respond to them.",
      },
      {
        id: "modifications",
        title: "Platform modifications",
        body: "ESTRA may be updated, changed, or temporarily unavailable as the project evolves.",
      },
    ],
  },
};

const HIGHLIGHTS = [
  { value: "0", label: "Submissions stored" },
  { value: "URL only", label: "Sent to Google Safe Browsing" },
  { value: "Assistive", label: "Not a safety guarantee" },
];

const STACK = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Python",
  "FastAPI",
  "Google Safe Browsing",
];

function LegalContent() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const initialTab: Tab =
    sectionParam === "terms" ? "terms" : "privacy";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [activeSection, setActiveSection] = useState<string>(
    DOCS[initialTab].sections[0].id
  );

  const doc = DOCS[activeTab];

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setActiveSection(DOCS[tab].sections[0].id);
  };

  useEffect(() => {
    const elements = DOCS[activeTab].sections
      .map((s) => document.getElementById(`${activeTab}-${s.id}`))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length > 0) {
          setActiveSection(
            visible[0].target.id.replace(`${activeTab}-`, "")
          );
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    document
      .getElementById(`${activeTab}-${id}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    setActiveSection(id);
  };

  return (
    <main className="min-h-screen text-white antialiased selection:bg-[#8AA8FF]/30 selection:text-white">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-6 md:px-10 md:py-8">

        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="group -ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8AA8FF]/60"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              ←
            </span>
            Back to Analyzer
          </Link>
        </header>

        {/* Hero */}
        <section className="mt-12 md:mt-16">
          <h1 className="max-w-[820px] text-[40px] font-semibold leading-[1.05] tracking-[-0.045em] text-white md:text-[68px]">
            Legal, without the
            <br className="hidden md:block" /> legalese.
          </h1>

          <p className="mt-4 max-w-[560px] text-base leading-7 text-white/55 md:text-lg md:leading-8">
            ESTRA inspects suspicious messages and links. Here is exactly what
            that involves, and what you can expect from us.
          </p>

          {/* Highlights */}
          <dl className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] md:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={h.label}
                className={`px-6 py-4 ${
                  i > 0
                    ? "border-t border-white/10 md:border-l md:border-t-0"
                    : ""
                }`}
              >
                <dt className="order-2 text-sm text-white/45">
                  {h.label}
                </dt>

                <dd className="mt-0.5 text-2xl font-semibold tracking-tight text-white">
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Tabs */}
        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div
            role="tablist"
            aria-label="Legal documents"
            className="inline-flex w-full rounded-xl border border-white/10 bg-white/[0.03] p-1 md:w-auto"
          >
            {(Object.keys(DOCS) as Tab[]).map((tab) => {
              const selected = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8AA8FF]/60 md:flex-none ${
                    selected
                      ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.3)]"
                      : "text-white/45 hover:text-white/80"
                  }`}
                >
                  {DOCS[tab].label}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-white/40">
            Last updated {UPDATED}
          </p>
        </div>

        {/* Body */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav
              aria-label="On this page"
              className="sticky top-10 border-l border-white/10"
            >
              <p className="mb-2 pl-4 text-sm font-medium text-white/80">
                On this page
              </p>

              <ul className="space-y-0.5">
                {doc.sections.map((s) => {
                  const current = activeSection === s.id;

                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(s.id)}
                        aria-current={current ? "true" : undefined}
                        className={`relative -ml-px block w-full border-l py-1.5 pl-4 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:text-white ${
                          current
                            ? "border-[#8AA8FF] text-white"
                            : "border-transparent text-white/40 hover:text-white/75"
                        }`}
                      >
                        {s.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div key={activeTab} role="tabpanel" className="min-w-0">

            <p className="max-w-[560px] text-base leading-7 text-white/55">
              {doc.summary}
            </p>

            {/* Callout */}
            <section className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_60px_-24px_rgba(0,0,0,0.6)] md:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#8AA8FF]/70 to-transparent"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#8AA8FF]/[0.07] blur-3xl"
              />

              <div className="relative flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#8AA8FF]/25 bg-[#8AA8FF]/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8AA8FF"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
                    <path d="M9.5 12l1.8 1.8L15 10" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {doc.callout.title}
                  </h2>

                  <p className="mt-2 max-w-[620px] text-[15px] leading-7 text-white/60 md:text-base md:leading-8">
                    {doc.callout.body}
                  </p>
                </div>
              </div>
            </section>

            {/* Sections */}
            <div className="mt-10 divide-y divide-white/[0.08]">
              {doc.sections.map((s, i) => (
                <section
                  key={s.id}
                  id={`${activeTab}-${s.id}`}
                  className={`scroll-mt-10 py-7 ${
                    i === 0 ? "pt-0" : ""
                  }`}
                >
                  <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {s.title}
                  </h2>

                  <p className="mt-3 max-w-[640px] text-[15px] leading-7 text-white/55 md:text-base md:leading-8">
                    {s.body}
                  </p>

                  {s.items && (
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {s.items.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-xl border border-white/10 bg-white/[0.025] p-5 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.04]"
                        >
                          <h3 className="text-sm font-semibold text-white">
                            {item.title}
                          </h3>

                          <p className="mt-1.5 text-sm leading-6 text-white/45">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.note && (
                    <div className="mt-5 flex max-w-[640px] gap-3 rounded-xl border border-[#8AA8FF]/15 bg-[#8AA8FF]/[0.04] p-4">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8AA8FF]"
                      />

                      <p className="text-sm leading-6 text-white/65">
                        {s.note}
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.08] pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">
                Built with
              </p>

              <ul className="mt-2.5 flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-white/10 bg-white/[0.025] px-2.5 py-1 text-xs text-white/50"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B1020] shadow-[0_8px_30px_rgba(138,168,255,0.18)] transition-all duration-200 hover:bg-[#DDE6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8AA8FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020] md:self-auto"
            >
              Analyze a message

              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          <p className="mt-8 pb-4 text-xs text-white/30">
            ESTRA. Analyze before you click.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen text-white/50 p-10">Loading...</div>}>
      <LegalContent />
    </Suspense>
  );
}