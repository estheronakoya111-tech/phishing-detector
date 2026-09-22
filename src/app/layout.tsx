import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import IntroGate from "@/components/sections/IntroGate";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import FluidBackground from "@/components/ui/FluidBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "ESTRA",
  description:
    "Analyze suspicious messages and links before you click.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        sora.variable
      )}
    >
      <body className="min-h-full">
        <IntroGate>
          <FluidBackground>
            <div className="min-h-screen">
              <Navbar />

              {children}

              <Footer />
            </div>
          </FluidBackground>
        </IntroGate>
      </body>
    </html>
  );
}