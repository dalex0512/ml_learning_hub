"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ModuleItem } from "@/lib/roadmap";
import { ChevronRight, Sparkles, BookOpen, Clock } from "lucide-react";

interface Props {
  modules: ModuleItem[];
}

export default function RoadmapZigzag({ modules }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based SVG dashed curve progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Rotation angles for authentic hand-placed sticky notes
  const rotations = [-1.2, 1.4, -0.8, 1.2, -1.5, 0.9];

  return (
    <section id="roadmap" ref={containerRef} className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sticky border border-paper-border mb-3 shadow-sm">
            <span className="font-hand text-accent-red text-base font-bold">✦ Lộ trình khóa học</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main font-sans tracking-tight">
            Roadmap 6 Chặng Học Tập
          </h2>
          <p className="mt-2 text-text-muted text-sm sm:text-base">
            Mỗi chặng được ghi chú theo đúng thứ tự logic trong slide bài giảng.
            Các trạm hoàn thành sẽ mở khóa kiến thức nền tảng vững chắc.
          </p>
        </div>

        {/* Zigzag Container */}
        <div className="relative">
          {/* Connecting SVG Curved Dashed Path for Desktop (hidden on mobile for responsive layout) */}
          <div className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none -z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 1350"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Background faint guide line */}
              <path
                d="M 220 80 C 220 220, 580 180, 580 320 C 580 460, 220 420, 220 560 C 220 700, 580 660, 580 800 C 580 940, 220 900, 220 1040 C 220 1180, 580 1140, 580 1280"
                stroke="#E7D9A8"
                strokeWidth="3"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              {/* Animated hand-drawn connecting dashed stroke */}
              <motion.path
                d="M 220 80 C 220 220, 580 180, 580 320 C 580 460, 220 420, 220 560 C 220 700, 580 660, 580 800 C 580 940, 220 900, 220 1040 C 220 1180, 580 1140, 580 1280"
                stroke="#D64545"
                strokeWidth="3.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
                style={{
                  pathLength: pathLength,
                }}
              />
            </svg>
          </div>

          {/* Module Stations Grid */}
          <div className="flex flex-col gap-12 sm:gap-16 relative z-10">
            {modules.map((module, index) => {
              const isLeft = index % 2 === 0;
              const isCurrent = module.id === "01-machine-learning";
              const rotation = rotations[index % rotations.length];
              const hasTopics = module.topics && module.topics.length > 0;

              return (
                <div
                  key={module.id}
                  className={`flex flex-col ${
                    isLeft ? "md:items-start" : "md:items-end"
                  }`}
                >
                  <div className="w-full md:w-[500px] relative">
                    {/* Chú thích tay "bạn đang ở đây ↓" cho Module 01 */}
                    {isCurrent && (
                      <div className="absolute -top-12 sm:-top-14 left-4 sm:left-8 z-20 flex items-center gap-2">
                        <span className="font-hand text-xl sm:text-2xl text-accent-red font-bold transform -rotate-6 animate-bounce">
                          bạn đang ở đây ↓
                        </span>
                        <svg
                          className="w-7 h-7 text-accent-red transform -rotate-12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                      </div>
                    )}

                    {/* Sticky Note Station Card */}
                    <div
                      style={{ transform: `rotate(${rotation}deg)` }}
                      className={`relative transition-all duration-300 hover:rotate-0 hover:scale-[1.02] rounded-xl p-5 sm:p-6 border ${
                        isCurrent
                          ? "bg-sticky border-paper-border shadow-sticky-hover ring-2 ring-accent-red/30"
                          : "bg-panel/95 border-paper-border shadow-paper"
                      }`}
                    >
                      {/* Paper pin/tape effect on top */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#e8debf]/80 border border-[#d3c7a0] rounded-sm transform rotate-1 backdrop-blur-xs shadow-xs"></div>

                      {/* Header info */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                              isCurrent
                                ? "bg-accent-red text-white"
                                : "bg-[#EDE2CB] text-text-muted"
                            }`}
                          >
                            0{module.order}
                          </span>
                          <span className="text-xs uppercase tracking-wider font-semibold text-text-muted font-sans">
                            Chặng 0{module.order}
                          </span>
                        </div>

                        {/* Status Badge */}
                        {hasTopics ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 border border-paper-border text-accent-red">
                            <Sparkles className="w-3 h-3" />
                            <span>{module.topics.length} chủ đề</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0e8d5] text-text-sub border border-paper-dashed">
                            <Clock className="w-3 h-3" />
                            <span>Chưa có nội dung</span>
                          </span>
                        )}
                      </div>

                      {/* Module Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-text-main font-sans">
                        {module.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-muted mt-1 italic font-sans">
                        {module.subtitle}
                      </p>

                      {/* Topics List or Empty Notice */}
                      <div className="mt-4 pt-3 border-t border-paper-dashed/80">
                        {hasTopics ? (
                          <div className="space-y-1.5">
                            {module.topics.map((t) => {
                              return (
                                <Link
                                  key={t.id}
                                  href={`/${module.id}/${t.id}`}
                                  className="group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs sm:text-sm transition-all hover:bg-[#f6ebd4] text-text-muted hover:text-text-main"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-text-sub">
                                      {String(t.order).padStart(2, "0")}.
                                    </span>
                                    <span>{t.title}</span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-text-sub" />
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-xs text-text-sub font-hand text-base text-[#8A8172]">
                              ~ Đang hoàn thiện ghi chú chặng này ~
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

