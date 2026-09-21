"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotebookHeroCard() {
  return (
    <div className="w-full max-w-md mx-auto relative group">
      {/* Washi Tape strip on top */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#E5D7A8]/90 border border-[#CEBD89] shadow-xs rounded-xs transform -rotate-1 z-20 backdrop-blur-xs flex items-center justify-center">
        <span className="font-hand text-[11px] text-[#786C4E] tracking-widest uppercase">
          ✦ SỔ TAY ML
        </span>
      </div>

      {/* Main Notebook Paper Sheet */}
      <div className="relative rounded-2xl bg-[#FFFDF8] border border-paper-border shadow-paper-md p-6 pt-7 transition-all duration-300 hover:shadow-sticky-hover hover:-translate-y-1">
        {/* Notebook Binder Hole Punches on left edge */}
        <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around py-8 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EADDC2] border border-[#D5C5A4] shadow-inner"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#EADDC2] border border-[#D5C5A4] shadow-inner"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#EADDC2] border border-[#D5C5A4] shadow-inner"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#EADDC2] border border-[#D5C5A4] shadow-inner"></span>
        </div>

        {/* Content area with left margin for binder holes */}
        <div className="pl-4">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-paper-dashed pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-accent-red text-white uppercase tracking-wider">
                Ghi chú
              </span>
              <span className="font-hand text-text-muted text-base">
                Sổ tay tự học
              </span>
            </div>
          </div>

          {/* Title inside notebook */}
          <h3 className="text-base sm:text-lg font-bold text-text-main font-sans flex items-center justify-between">
            <span>Vài dòng ghi chú</span>
            <span className="font-hand text-accent-red text-sm font-normal transform -rotate-2">
              vẽ tay ✦
            </span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5 mb-3">
            Học tới đâu, vẽ lại tới đó cho dễ nhớ
          </p>

          {/* Illustration */}
          <div className="bg-[#FAF4E4] rounded-xl p-3 border border-paper-border relative overflow-hidden flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/coder-illustration.png"
              alt="Học tập Machine Learning"
              className="max-h-[170px] w-auto object-contain rounded-md"
            />
          </div>

          {/* Yellow Sticky Note pasted on bottom with slight rotation */}
          <div className="mt-4 p-3.5 rounded-xl bg-accent-sticky-yellow/90 border border-[#debd35] shadow-sticky-note transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-start gap-2">
              <span className="text-base leading-none">📌</span>
              <div className="space-y-1">
                <p className="font-hand text-sm sm:text-base text-text-main font-bold leading-tight">
                  "Ghi chú của Dương:"
                </p>
                <p className="font-sans text-xs text-text-main leading-relaxed">
                  Đọc lý thuyết xong, làm lại ví dụ tính tay trước khi xem code —
                  nhớ lâu hơn nhiều đấy.
                </p>
              </div>
            </div>
          </div>

          {/* Direct link to detail page */}
          <div className="mt-4 pt-3 border-t border-paper-dashed flex items-center justify-end">
            <Link
              href="/01-machine-learning/what-is-ml"
              className="inline-flex items-center gap-1 text-xs font-bold text-accent-red hover:underline group"
            >
              <span>Bắt đầu học: Bài 01</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
