"use client";

import React from "react";
import Link from "next/link";
import NotebookHeroCard from "./NotebookHeroCard";

export default function Hero() {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-paper-dashed/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Top handwritten note tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-panel border border-paper-border mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-sans">
                Ghi chú cá nhân
              </span>
              <span className="text-xs text-text-sub">|</span>
              <span className="font-hand text-accent-red text-base transform -rotate-1">
                Data Science, ML & Python course
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-main font-sans leading-[1.2]">
              Ghi chú tự học <br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10">Machine Learning</span>
                {/* Subtle highlighter underlay */}
                <span className="absolute left-0 bottom-1.5 w-full h-3 bg-accent-sticky-yellow/45 -rotate-0.5 rounded-sm -z-0"></span>
              </span>
            </h1>

            {/* Handwritten Annotation Line in Patrick Hand (full Vietnamese support) */}
            <div className="mt-3 flex items-center gap-2">
              <span className="font-hand text-2xl sm:text-3xl text-accent-red font-bold transform -rotate-1 inline-block">
                ✍️ "từng bước một, vẽ tay & tính tay để hiểu bản chất"
              </span>
            </div>

            {/* Subhead */}
            <p className="mt-4 text-base sm:text-lg text-text-muted font-normal max-w-xl leading-relaxed">
              Hệ thống hóa các khái niệm trọng tâm từ khóa học: từ kiến trúc pipeline,
              hàm mất mát, phân tách tập dữ liệu cho tới các mô hình phân loại & hồi quy.
              Không lý thuyết suông — luôn có ví dụ tính tay và code cài đặt mẫu.
            </p>

            {/* 2 CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* CTA 1: Chính - Nền tối đặc */}
              <Link
                href="/01-machine-learning/what-is-ml"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-dark text-panel font-semibold text-sm sm:text-base shadow-paper-md hover:bg-black hover:-translate-y-0.5 transition-all"
              >
                <span>Bắt đầu học: Bài 01</span>
                <span className="text-accent-sticky-yellow">→</span>
              </Link>

              {/* CTA 2: Phụ - Nền sticky vàng xoay nhẹ */}
              <a
                href="#roadmap"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent-sticky-yellow text-accent-dark font-semibold text-sm sm:text-base border border-[#deb72b] shadow-sticky-note transform rotate-1 hover:rotate-0 hover:scale-105 transition-all"
              >
                <span>Lộ trình 6 Module</span>
                <span>📌</span>
              </a>
            </div>

            {/* Note badge */}
            <div className="mt-8 flex items-center gap-3 text-xs text-text-sub font-mono bg-panel/80 px-3 py-1.5 rounded border border-paper-border/80">
              <span className="text-accent-red font-bold">LƯU Ý:</span>
              <span>Nơi lưu trữ ghi chú tự ôn, ưu tiên dễ đọc và trực quan.</span>
            </div>
          </div>

          {/* Right Column: Notebook Page Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center w-full">
            <NotebookHeroCard />
          </div>
        </div>
      </div>
    </section>
  );
}

