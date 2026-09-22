"use client";

import Link from "next/link";

const handleNavigation = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
};

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-10">
      <div className="flex items-center justify-between border-t border-border pt-6">
        <p className="font-sans text-xs text-muted-foreground">
          <span className="sm:hidden">
            © 2026 Estra — Spot the signs.
          </span>

          <span className="hidden sm:inline">
            © 2026 Estra — Built to help you spot the signs.
          </span>
        </p>

        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            scroll={false}
            onClick={handleNavigation}
            className="font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>

          <Link
            href="/privacy-terms?section=privacy"
            scroll={false}
            onClick={handleNavigation}
            className="font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>

          <Link
            href="/privacy-terms?section=terms"
            scroll={false}
            onClick={handleNavigation}
            className="font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}