"use client";

import React, { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { pageFlip } from "@/lib/pageFlip";

const DURATION = 0.6;
const MAX_ANGLE = -110;

// Tờ giấy lật 3D phủ viewport, bản lề ở cạnh trái. Next: tờ giấy lật từ 0 sang trái để lộ
// trang mới. Prev: tờ giấy lật ngược từ trái về phủ lại rồi mờ đi.
function Leaf({ dir, onDone }: { dir: 1 | -1; onDone: () => void }) {
  // p: 0 → 1 theo thời gian; góc lật suy ra từ p
  const p = useMotionValue(0);
  const angle = useTransform(p, (v) => (dir === 1 ? MAX_ANGLE * v : MAX_ANGLE * (1 - v)));
  const shade = useTransform(angle, (a) => Math.abs(Math.sin((a * Math.PI) / 180)) * 0.28);
  const castShadow = useTransform(angle, (a) => Math.abs(Math.sin((a * Math.PI) / 180)) * 0.45);
  const opacity = useTransform(p, (v) => (v > 0.8 ? 1 - (v - 0.8) / 0.2 : 1));

  useEffect(() => {
    const controls = animate(p, 1, {
      duration: DURATION,
      ease: [0.4, 0, 0.2, 1],
      onComplete: onDone,
    });
    return () => controls.stop();
  }, [p, onDone]);

  const transform = useTransform(angle, (a) => `perspective(2200px) rotateY(${a}deg)`);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden" aria-hidden>
      {/* Bóng đổ của tờ giấy lên trang bên dưới */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: castShadow,
          background:
            "linear-gradient(to right, rgba(46,42,34,0.35), rgba(46,42,34,0) 55%)",
        }}
      />
      <motion.div
        className="absolute inset-0 bg-paper"
        style={{
          transform,
          opacity,
          transformOrigin: "left center",
          backgroundImage: "radial-gradient(circle, #E9E0CB 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
          boxShadow: "6px 0 30px rgba(46,42,34,0.25)",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: shade,
            background: "linear-gradient(to right, rgba(46,42,34,0.1), rgba(46,42,34,1))",
          }}
        />
      </motion.div>
    </div>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  // Đọc hướng lật một lần khi mount; xóa cờ để lần tải trang sau không lật.
  const [dir] = useState(() => pageFlip.dir);
  const [flipping, setFlipping] = useState(dir !== 0 && !reduceMotion);

  useEffect(() => {
    pageFlip.dir = 0;
  }, []);

  return (
    <>
      {flipping && dir !== 0 && <Leaf dir={dir} onDone={() => setFlipping(false)} />}
      {children}
    </>
  );
}
