"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import EstraLogo from "./EstraLogo";
import Estra from "./Estra";

const navVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const interactiveVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  tap: {
    scale: 0.98,
  },
};

const linkClass = (active: boolean) =>
  `inline-block py-1 no-underline hover:no-underline font-sans text-[13px] font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8AA8FF]/60 rounded-sm ${
    active
      ? "text-[#8AA8FF]"
      : "text-muted-foreground hover:text-foreground"
  }`;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="flex w-full items-center justify-between border-none bg-transparent px-5 py-4 outline-none md:px-8 md:py-5"
    >
      {/* Logo */}
      <motion.div
        variants={interactiveVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Link href="/" aria-label="Estra home" className="block">
          <EstraLogo className="hidden h-auto w-32 md:block" />
          <Estra className="block h-auto w-7 md:hidden" />
        </Link>
      </motion.div>

      {/* Navigation links */}
      <div className="flex items-center gap-7">
        {/* About: visible on all screens */}
        <motion.div
          variants={interactiveVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            className={linkClass(pathname === "/about")}
          >
            About
          </Link>
        </motion.div>

        {/* Privacy Policy: tablet and desktop only */}
        <motion.div
          variants={interactiveVariants}
          whileHover="hover"
          whileTap="tap"
          className="hidden md:block"
        >
          <Link
            href="/privacy-terms"
            aria-current={pathname === "/privacy&terms" ? "page" : undefined}
            className={linkClass(pathname === "/privacy-terms")}
          >
            Privacy Policy
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}