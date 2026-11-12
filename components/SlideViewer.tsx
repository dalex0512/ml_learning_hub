"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export const TOTAL_SLIDES = 177;
export const OPEN_SLIDES_EVENT = "open-slides";

export interface OpenSlidesDetail {
  from: number;
  to: number;
  start?: number;
}

export function openSlides(detail: OpenSlidesDetail) {
  window.dispatchEvent(new CustomEvent<OpenSlidesDetail>(OPEN_SLIDES_EVENT, { detail }));
}

const src = (n: number) => `/slides/slide-${String(n).padStart(3, "0")}.webp`;

function useDeck(from: number, to: number, start?: number) {
  const lo = Math.max(1, from);
  const hi = Math.min(TOTAL_SLIDES, to);
  const [cur, setCur] = useState(Math.min(hi, Math.max(lo, start ?? lo)));
  const go = useCallback((n: number) => setCur(Math.min(hi, Math.max(lo, n))), [lo, hi]);
  return { lo, hi, cur, go };
}

interface DeckProps {
  from: number;
  to: number;
  start?: number;
  caption?: string;
  onZoom?: (cur: number) => void;
  large?: boolean;
}

function Deck({ from, to, start, caption, onZoom, large }: DeckProps) {
  const { lo, hi, cur, go } = useDeck(from, to, start);
  const multi = hi > lo;

  useEffect(() => {
    if (!large) return;
    const navigate = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      go(cur + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", navigate);
    return () => window.removeEventListener("keydown", navigate);
  }, [large, cur, go]);

  // prefetch slide kế
  useEffect(() => {
    if (cur < hi) {
      const img = new Image();
      img.src = src(cur + 1);
    }
  }, [cur, hi]);

  const onKey = (e: React.KeyboardEvent) => {
    if (large) return; // lightbox navigation also works while its close button has focus
    if (e.key === "ArrowRight") {
      go(cur + 1);
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      go(cur - 1);
      e.preventDefault();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={onKey}
      className="outline-none focus-visible:ring-2 focus-visible:ring-accent-red/40 rounded-lg"
    >
      <div className="relative rounded-lg border border-paper-border bg-white overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src(cur)}
          alt={`Slide ${cur}`}
          loading="lazy"
          className={`block w-full h-auto ${large ? "max-h-[78vh] object-contain" : ""}`}
        />
        {multi && (
          <>
            <button
              type="button"
              aria-label="Slide trước"
              disabled={cur <= lo}
              onClick={() => go(cur - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-accent-dark/70 text-panel flex items-center justify-center disabled:opacity-20 hover:bg-accent-dark"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Slide sau"
              disabled={cur >= hi}
              onClick={() => go(cur + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-accent-dark/70 text-panel flex items-center justify-center disabled:opacity-20 hover:bg-accent-dark"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        {onZoom && (
          <button
            type="button"
            aria-label="Phóng to"
            onClick={() => onZoom(cur)}
            className="absolute right-2 top-2 w-8 h-8 rounded-md bg-accent-dark/70 text-panel flex items-center justify-center hover:bg-accent-dark"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-2 px-1">
        <span className="font-hand text-accent-red text-base">
          Slide {cur}
          {multi ? ` (${cur - lo + 1}/${hi - lo + 1})` : ""} · khóa học gốc
        </span>
        {caption && <span className="text-xs text-text-sub text-right min-w-0 truncate">{caption}</span>}
      </div>

      {multi && hi - lo < 16 && (
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => go(n)}
              aria-label={`Tới slide ${n}`}
              className={`shrink-0 w-20 rounded border overflow-hidden ${
                n === cur ? "border-accent-red ring-1 ring-accent-red" : "border-paper-border opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(n)} alt="" loading="lazy" className="block w-full h-auto" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Viewer nhúng trong bài (khối :::slides). */
export default function SlideViewer({ from, to, caption }: { from: number; to: number; caption?: string }) {
  return (
    <figure className="slide-viewer my-5">
      <Deck from={from} to={to} caption={caption} onZoom={(cur) => openSlides({ from, to, start: cur })} />
    </figure>
  );
}

/** Lightbox toàn trang, mở bằng openSlides() từ chip / nút header. */
export function SlideLightbox() {
  const [detail, setDetail] = useState<OpenSlidesDetail | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const h = (e: Event) => setDetail((e as CustomEvent<OpenSlidesDetail>).detail);
    window.addEventListener(OPEN_SLIDES_EVENT, h);
    return () => window.removeEventListener(OPEN_SLIDES_EVENT, h);
  }, []);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetail(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [detail]);

  if (!detail) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem slide"
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-3 sm:p-8"
      onClick={(e) => e.target === e.currentTarget && setDetail(null)}
    >
      <div className="w-full max-w-5xl bg-panel rounded-xl p-3 sm:p-4 shadow-2xl">
        <div className="flex justify-end mb-2">
          <button
            ref={closeRef}
            type="button"
            onClick={() => setDetail(null)}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-red"
          >
            <X className="w-4 h-4" /> Đóng (Esc)
          </button>
        </div>
        <Deck
          key={`${detail.from}-${detail.to}-${detail.start}`}
          from={detail.from}
          to={detail.to}
          start={detail.start}
          large
        />
      </div>
    </div>
  );
}

/** Nút "Xem slide gốc" ở khối tiêu đề. */
export function SlideButton({ from, to }: { from: number; to: number }) {
  return (
    <button
      type="button"
      onClick={() => openSlides({ from, to })}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-accent-sticky-yellow/90 border border-paper-border text-sm font-semibold text-text-main hover:bg-accent-sticky-yellow transition-colors"
    >
      <Maximize2 className="w-4 h-4" />
      Xem slide gốc {to > from ? `${from}–${to}` : from}
    </button>
  );
}
