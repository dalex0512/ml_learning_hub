import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { ModuleItem, TopicItem } from "@/lib/roadmap";

interface Props {
  prev: { module: ModuleItem; topic: TopicItem } | null;
  next: { module: ModuleItem; topic: TopicItem } | null;
}

export default function TopicNavigation({ prev, next }: Props) {
  return (
    <div className="mt-14 pt-8 border-t border-paper-dashed page-flip-container">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Prev Button: Viền đứt nét */}
        {prev ? (
          <Link
            href={`/${prev.module.id}/${prev.topic.id}`}
            className="page-flip-card group flex-1 p-4 rounded-xl border-2 border-dashed border-paper-dashed hover:border-paper-border bg-panel hover:bg-sticky/50 transition-all flex items-center gap-3 shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-[#f2e7d3] flex items-center justify-center text-text-main group-hover:-translate-x-1 transition-transform shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] uppercase tracking-wider font-mono text-text-sub block">
                Chủ đề trước
              </span>
              <span className="text-sm font-semibold text-text-main block truncate">
                {prev.topic.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex-1 p-4 rounded-xl border border-dashed border-paper-dashed/50 opacity-40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-text-sub shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs text-text-sub font-mono">Bắt đầu khóa học</span>
          </div>
        )}

        {/* Home/Roadmap quick shortcut */}
        <Link
          href="/#roadmap"
          className="hidden md:flex flex-col items-center justify-center px-4 py-2 text-xs font-medium text-text-sub hover:text-accent-red transition-colors"
        >
          <BookOpen className="w-4 h-4 mb-1" />
          <span>Về Roadmap</span>
        </Link>

        {/* Next Button: Nền tối đặc */}
        {next ? (
          <Link
            href={`/${next.module.id}/${next.topic.id}`}
            className="page-flip-card group flex-1 p-4 rounded-xl bg-accent-dark text-panel hover:bg-black transition-all flex items-center justify-end gap-3 shadow-paper-md"
          >
            <div className="text-right min-w-0">
              <span className="text-[11px] uppercase tracking-wider font-mono text-accent-sticky-yellow block">
                Chủ đề kế tiếp
              </span>
              <span className="text-sm font-semibold text-panel block truncate">
                {next.topic.title}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-panel group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ) : (
          <div className="flex-1 p-4 rounded-xl bg-panel border border-paper-border opacity-60 flex items-center justify-end gap-3">
            <span className="text-xs text-text-sub font-mono">Hết danh sách module</span>
            <div className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-text-sub shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

