"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useSyncExternalStore } from "react";
import IntroOverlay from "./IntroOverlay";

interface IntroGateProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "estra-intro-seen";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("estra-intro-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("estra-intro-change", callback);
  };
};

const getSnapshot = () => {
  return localStorage.getItem(STORAGE_KEY) === "true";
};

const getServerSnapshot = () => {
  return false;
};

export default function IntroGate({ children }: IntroGateProps) {
  const pathname = usePathname();

  const hasSeenIntro = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isHomePage = pathname === "/";

  const handleEnter = () => {
    localStorage.setItem(STORAGE_KEY, "true");

    window.dispatchEvent(new Event("estra-intro-change"));
  };

  if (isHomePage && !hasSeenIntro) {
    return (
      <AnimatePresence>
        <IntroOverlay onEnter={handleEnter} />
      </AnimatePresence>
    );
  }

  return children;
}