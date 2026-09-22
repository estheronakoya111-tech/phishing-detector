"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FluidBackgroundProps {
  children: ReactNode;
}

export default function FluidBackground({
  children,
}: FluidBackgroundProps) {
  return (
    <div className="relative min-h-screen bg-[#0B1020] text-foreground antialiased">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-95 [perspective:1000px]"
      >
        {/* Deep Slate Base Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,140,255,0.08)_0%,rgba(11,16,32,1)_80%)]" />

        {/* Master Vortex Container */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[160vw] w-[160vw] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
          animate={{
            rotateZ: [0, 360],
            rotateX: [15, -15, 15],
            rotateY: [-10, 10, -10],
          }}
          transition={{
            rotateZ: {
              duration: 32,
              repeat: Infinity,
              ease: "linear",
            },
            rotateX: {
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotateY: {
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Stream 1 */}
          <motion.div
            className="absolute left-[15%] top-[10%] h-[70vw] w-[70vw]"
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full blur-[40px] opacity-80"
            >
              <defs>
                <linearGradient
                  id="electric-stream"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#5B8CFF"
                    stopOpacity="0.9"
                  />
                  <stop
                    offset="50%"
                    stopColor="#8AA8FF"
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor="#0B1020"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <motion.path
                fill="url(#electric-stream)"
                animate={{
                  d: [
                    "M40,-60C52,-48,61,-33,65,-17C69,-1,68,16,61,30C54,44,41,55,25,62C9,69,-10,72,-27,67C-44,62,-59,49,-67,33C-75,17,-76,-2,-70,-19C-64,-36,-51,-51,-36,-62C-21,-73,-4,-80,14,-78C32,-76,28,-72,40,-60Z",
                    "M50,-65C63,-52,72,-36,74,-19C76,-2,71,16,62,31C53,46,40,58,24,65C8,72,-11,74,-29,69C-47,64,-64,52,-72,35C-80,18,-79,-4,-71,-23C-63,-42,-48,-58,-31,-67C-14,-76,5,-78,25,-75C45,-72,37,-78,50,-65Z",
                    "M40,-60C52,-48,61,-33,65,-17C69,-1,68,16,61,30C54,44,41,55,25,62C9,69,-10,72,-27,67C-44,62,-59,49,-67,33C-75,17,-76,-2,-70,-19C-64,-36,-51,-51,-36,-62C-21,-73,-4,-80,14,-78C32,-76,28,-72,40,-60Z",
                  ],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                transform="translate(100, 100)"
              />
            </svg>
          </motion.div>

          {/* Stream 2 */}
          <motion.div
            className="absolute right-[10%] bottom-[15%] h-[65vw] w-[65vw]"
            animate={{
              rotate: [360, 180, 0],
              scale: [0.9, 1.25, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full blur-[45px] opacity-75 mix-blend-screen"
            >
              <defs>
                <linearGradient
                  id="mint-stream"
                  x1="100%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#34D399"
                    stopOpacity="0.85"
                  />
                  <stop
                    offset="60%"
                    stopColor="#5B8CFF"
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="100%"
                    stopColor="#0B1020"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <motion.path
                fill="url(#mint-stream)"
                animate={{
                  d: [
                    "M45,-55C58,-43,67,-27,69,-10C71,7,66,25,56,40C46,55,31,67,13,71C-5,75,-26,71,-42,61C-58,51,-69,35,-73,17 C-77,-1,-74,-21,-64,-37C-54,-53,-37,-65,-19,-69C-1,-73,17,-69,32,-67Z",
                    "M35,-50C48,-38,57,-22,60,-5C63,12,60,30,50,44C40,58,23,68,4,70C-15,72,-36,66,-50,54C-64,42,-71,24,-72,6 C-73,-12,-68,-30,-57,-44C-46,-58,-29,-68,-11,-70C7,-72,22,-62,35,-50Z",
                    "M45,-55C58,-43,67,-27,69,-10C71,7,66,25,56,40C46,55,31,67,13,71C-5,75,-26,71,-42,61C-58,51,-69,35,-73,17 C-77,-1,-74,-21,-64,-37C-54,-53,-37,-65,-19,-69C-1,-73,17,-69,32,-67Z",
                  ],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                transform="translate(100, 100)"
              />
            </svg>
          </motion.div>

          {/* Stream 3 */}
          <motion.div
            className="absolute left-[30%] top-[30%] h-[45vw] w-[45vw]"
            animate={{
              x: [-60, 80, -60],
              y: [-40, 60, -40],
              rotate: [0, 360],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="h-full w-full rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#8AA8FF_0%,#5B8CFF_40%,#34D399_70%,transparent_100%)] blur-[35px] opacity-70 mix-blend-screen" />
          </motion.div>
        </motion.div>

        {/* Lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(138,168,255,0.15)_0%,transparent_60%)]" />

        {/* Grain */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.25] contrast-150 brightness-110 mix-blend-overlay">
          <filter id="saas-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>

          <rect
            width="100%"
            height="100%"
            filter="url(#saas-grain)"
          />
        </svg>
      </div>

      {/* Entire application sits on the same canvas */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}