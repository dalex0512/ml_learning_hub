"use client";

import React, { useMemo } from "react";
import {
  Lightbulb,
  HelpCircle,
  BookOpen,
  Presentation,
  ListChecks,
  Calculator,
} from "lucide-react";
import type { TopicData, SectionContent } from "@/lib/markdown";
import { renderMarkdown, parseFormulaLayout } from "@/lib/renderMarkdown";
import type { Block, BoxKind } from "@/lib/blocks";
import SlideViewer, { openSlides } from "./SlideViewer";
import Quiz from "./Quiz";

interface Props {
  topicData: TopicData;
}

// Xoay nhẹ cho chú thích tay: −1° đến 1.5°
const NOTE_ROTATIONS = [-1, 1.2, -0.6, 1.5];

const BOX_STYLE: Record<BoxKind, { label: string; wrap: string; tag: string }> = {
  intro: { label: "Mở đầu", wrap: "bg-sticky border-paper-border", tag: "bg-accent-sticky-yellow/70" },
  worked: { label: "Ví dụ tay", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
  compare: { label: "So sánh", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
  pitfall: { label: "Bẫy hay gặp", wrap: "bg-[#FFF1EE] border-[#E9B5AC]", tag: "bg-[#F6C9C1]" },
  recap: { label: "Tóm tắt 1 phút", wrap: "bg-[#F3F7EC] border-[#C9D9B5]", tag: "bg-[#DCE9C8]" },
  next: { label: "Nối sang bài sau", wrap: "bg-sticky border-paper-border", tag: "bg-accent-sticky-yellow/70" },
  note: { label: "Ghi chú", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
  goal: { label: "Mục tiêu", wrap: "bg-sticky border-paper-border", tag: "bg-accent-sticky-yellow/70" },
  learn: { label: "Hiểu nhanh", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
  code: { label: "Code", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
  see: { label: "Bạn phải thấy", wrap: "bg-[#F3F7EC] border-[#C9D9B5]", tag: "bg-[#DCE9C8]" },
  en: { label: "EN", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
  check: { label: "Checklist", wrap: "bg-[#F3F7EC] border-[#C9D9B5]", tag: "bg-[#DCE9C8]" },
  ask: { label: "Câu hỏi", wrap: "bg-sticky border-paper-border", tag: "bg-accent-sticky-yellow/70" },
  out: { label: "Kết quả", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
  more: { label: "Biết thêm", wrap: "bg-[#FDFBF3] border-paper-dashed", tag: "bg-sticky" },
};

function handleProseClick(e: React.MouseEvent<HTMLElement>) {
  const target = e.target as HTMLElement;

  const chip = target.closest<HTMLButtonElement>(".slide-chip");
  if (chip) {
    const from = parseInt(chip.dataset.slide ?? "", 10);
    const to = parseInt(chip.dataset.to ?? "", 10);
    if (!Number.isNaN(from)) openSlides({ from, to: Number.isNaN(to) ? from : to });
    return;
  }

  const btn = target.closest<HTMLButtonElement>(".code-copy-btn");
  if (!btn) return;
  const code = btn.closest(".code-block")?.querySelector("code");
  if (!code) return;
  navigator.clipboard.writeText(code.textContent ?? "");
  btn.textContent = "Đã chép!";
  btn.classList.add("copied");
  window.setTimeout(() => {
    btn.textContent = "Sao chép";
    btn.classList.remove("copied");
  }, 2000);
}

function Prose({ md, copy }: { md: string; copy?: boolean | "lang" }) {
  const html = useMemo(() => renderMarkdown(md, { copyButtons: copy }), [md, copy]);
  return (
    <div
      className="notebook-prose text-sm sm:text-base"
      onClick={handleProseClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function FormulaSection({ md }: { md: string }) {
  const layout = useMemo(() => parseFormulaLayout(md), [md]);

  if (!layout) return <Prose md={md} />;

  return (
    <>
      {layout.introHtml && (
        <div
          className="notebook-prose text-sm sm:text-base mb-5"
          dangerouslySetInnerHTML={{ __html: layout.introHtml }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {layout.groups.map((g, i) => (
          <div
            key={g.name}
            className="min-w-0 rounded-lg bg-[#FDFBF3] border border-paper-dashed p-4 flex flex-col"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-sticky border border-paper-border text-xs font-mono font-semibold uppercase tracking-wide text-text-main">
                {g.name}
              </span>
              {g.subtitleHtml && (
                <span
                  className="text-[11px] text-text-sub"
                  dangerouslySetInnerHTML={{ __html: g.subtitleHtml }}
                />
              )}
            </div>
            <pre className="formula-code">
              <code>{g.code}</code>
            </pre>
            {g.note && (
              <p
                className="hand-note text-lg sm:text-xl font-bold mt-1 mb-3 self-start"
                style={{ transform: `rotate(${NOTE_ROTATIONS[i % NOTE_ROTATIONS.length]}deg)` }}
              >
                {g.note}
              </p>
            )}
            <div className="notebook-prose text-sm" dangerouslySetInnerHTML={{ __html: g.restHtml }} />
          </div>
        ))}
      </div>
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "md":
      return <Prose md={block.md} copy="lang" />;
    case "formula":
      return (
        <div className="my-4 rounded-lg border-2 border-accent-red p-4">
          <FormulaSection md={block.md} />
        </div>
      );
    case "slides":
      return <SlideViewer from={block.from} to={block.to} caption={block.caption} />;
    case "quiz":
      return <Quiz tiers={block.tiers} />;
    case "exercise":
      return <Prose md={`**${block.level} ${block.title}**

${block.prompt}

${block.answer}`} copy="lang" />;
    case "box": {
      const s = BOX_STYLE[block.kind];
      return (
        <aside className={`my-5 rounded-lg border p-4 sm:p-5 ${s.wrap}`}>
          <div className="mb-2.5 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wide text-text-main ${s.tag}`}>
              {s.label}
            </span>
            {block.title && <span className="text-sm font-semibold text-text-main">{block.title}</span>}
          </div>
          <Prose md={block.md} copy="lang" />
        </aside>
      );
    }
  }
}

function sectionIcon(section: SectionContent) {
  const types = new Set(section.blocks.map((b) => (b.type === "box" ? b.kind : b.type)));
  if (types.has("quiz")) return HelpCircle;
  if (types.has("recap")) return ListChecks;
  if (types.has("slides") && types.size === 1) return Presentation;
  if (types.has("formula")) return Calculator;
  if (types.has("intro")) return Lightbulb;
  return BookOpen;
}

export default function DynamicTopicPanels({ topicData }: Props) {
  return (
    <div className="flex-1 min-w-0 space-y-8">
      {topicData.sections.map((section, idx) => {
        const Icon = sectionIcon(section);

        return (
          <section
            key={section.id || idx}
            id={section.id}
            className="paper-card p-5 sm:p-7 relative transition-all duration-300 scroll-mt-28"
          >
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-paper-dashed">
              <div className="w-8 h-8 rounded-lg bg-sticky flex items-center justify-center text-text-main border border-paper-border shrink-0">
                <Icon className="w-4 h-4 text-accent-red" />
              </div>
              <h2 className="text-xl font-bold text-text-main font-sans">{section.title}</h2>
            </div>

            <div className="space-y-1">
              {section.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
