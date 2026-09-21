"use client";

import React, { useState } from "react";
import { marked } from "marked";
import {
  Lightbulb,
  GitBranch,
  Layers,
  Table,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TopicData } from "@/lib/markdown";

interface Props {
  topicData: TopicData;
}

const ICONS = [
  Lightbulb,
  GitBranch,
  Layers,
  Table,
  Terminal,
  HelpCircle,
];

export default function DynamicTopicPanels({ topicData }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedQuiz, setExpandedQuiz] = useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 min-w-0 space-y-8">
      {topicData.sections.map((section, idx) => {
        const IconComponent = ICONS[idx % ICONS.length];
        const isCodeSection = section.number === 5;
        const isQuizSection = section.number === 6;

        // Render markdown HTML
        const htmlContent = marked.parse(section.rawContent) as string;

        return (
          <section
            key={section.id || idx}
            id={section.id}
            className="paper-card p-6 sm:p-7 relative transition-all duration-300"
          >
            {/* Section Header */}
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-paper-dashed">
              <div className="w-8 h-8 rounded-lg bg-sticky flex items-center justify-center text-text-main border border-paper-border shrink-0">
                <IconComponent className="w-4 h-4 text-accent-red" />
              </div>
              <h2 className="text-xl font-bold text-text-main font-sans">
                {section.title}
              </h2>
              {isCodeSection && (
                <button
                  onClick={() => handleCopy(section.rawContent, idx)}
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium bg-panel border border-paper-border hover:bg-sticky transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-text-muted" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Section Content formatted as notebook prose */}
            <div
              className="notebook-prose text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* If Quiz Section: provide an interactive reflection note */}
            {isQuizSection && (
              <div className="mt-5 pt-3 border-t border-paper-dashed">
                <button
                  onClick={() => setExpandedQuiz(!expandedQuiz)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-sticky/60 hover:bg-sticky border border-paper-border text-xs text-text-main font-medium transition-colors"
                >
                  <span className="font-hand text-accent-red text-base font-bold">
                    💡 Hướng dẫn tự kiểm tra & thảo luận
                  </span>
                  <div className="flex items-center gap-1 text-text-sub">
                    <span className="text-[11px]">
                      {expandedQuiz ? "Thu gọn" : "Xem gợi ý phương pháp"}
                    </span>
                    {expandedQuiz ? (
                      <ChevronUp className="w-3.5 h-3.5 text-accent-red" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {expandedQuiz && (
                  <div className="mt-2 p-3.5 rounded-lg bg-panel border border-paper-border text-xs text-text-muted space-y-2">
                    <p>
                      <strong>Gợi ý ôn tập:</strong> Hãy thử tự viết câu trả lời ra giấy nháp trước khi đối chiếu lại các phần lý thuyết 1, 2 và 3 ở trên.
                    </p>
                    <p className="italic text-text-sub">
                      Phần câu hỏi tiếng Anh kèm theo (EN) giúp bạn làm quen với các thuật ngữ phỏng vấn và tài liệu chuẩn quốc tế.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

