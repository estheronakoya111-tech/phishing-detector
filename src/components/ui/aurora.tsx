// components/blocks/buttons/button-styles/aurora/aurora.tsx
"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type AuroraButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  icon?: ReactNode;
};

const shape = "rounded-[28px_14px_28px_14px]";
const gradient = "linear-gradient(115deg, #5b8cff, #a855f7, #34d399, #5b8cff)";
const fill = "rgba(11, 16, 32, 0.92)";

export function AuroraButton({ children, icon, disabled, className = "", ...props }: AuroraButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden px-6 py-3 text-sm font-semibold tracking-wider text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${shape} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1020] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${className}`}
      style={{
        border: "1.5px solid transparent",
        backgroundImage: `linear-gradient(${fill}, ${fill}), ${gradient}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        backgroundSize: "100% 100%, 200% 200%",
      }}
      {...props}
    >
      {/* 1. Ambient Background Blur Pulse */}
      <motion.span
        className={`pointer-events-none absolute -inset-2 -z-20 ${shape} opacity-50 transition-opacity duration-300 group-hover:opacity-80`}
        style={{
          background: gradient,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          filter: ["blur(10px)", "blur(18px)", "blur(10px)"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 2. Top-edge Inner Specular Highlight */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* 3. Smooth Shimmer Sweep on Hover */}
      <span className="pointer-events-none absolute inset-0 -z-10 w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />

      {/* 4. Icon & Text Content */}
      {icon && <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      <span className="relative z-10 tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{children}</span>
    </motion.button>
  );
}

export default AuroraButton;