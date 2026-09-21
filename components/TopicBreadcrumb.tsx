import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  moduleTitle: string;
  moduleId: string;
  topicTitle: string;
  currentOrder: number;
  totalTopics: number;
}

export default function TopicBreadcrumb({
  moduleTitle,
  moduleId,
  topicTitle,
  currentOrder,
  totalTopics,
}: Props) {
  const progressPercent =
    totalTopics > 0 ? Math.round((currentOrder / totalTopics) * 100) : 0;

  return (
    <div className="bg-panel/80 border-b border-paper-border/80 sticky top-16 z-30 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Breadcrumb links */}
        <nav className="flex items-center gap-1.5 text-xs text-text-sub flex-wrap font-sans">
          <Link href="/" className="hover:text-text-main transition-colors">
            Machine Learning Hub
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-sub/60" />
          <Link
            href="/#roadmap"
            className="hover:text-text-main transition-colors font-medium text-text-muted"
          >
            {moduleTitle}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-sub/60" />
          <span className="text-text-main font-semibold truncate max-w-[200px] sm:max-w-none">
            {topicTitle}
          </span>
        </nav>

        {/* Progress Tracker: Chủ đề x/N + progress bar */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className="text-xs font-mono text-text-muted">
            Chủ đề <strong className="text-accent-red">{currentOrder}</strong>/{totalTopics}
          </span>
          <div className="w-24 h-2 bg-[#EADFCA] rounded-full overflow-hidden border border-paper-border">
            <div
              className="h-full bg-accent-red rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

