"use client";

import React, { useMemo } from "react";
import {
  Lightbulb,
  GitBranch,
  Layers,
  Table,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { TopicData, SectionContent } from "@/lib/markdown";
import { renderMarkdown, parseFormulaLayout } from "@/lib/renderMarkdown";

interface Props {
  topicData: TopicData;
}

const ICONS = [Lightbulb, GitBranch, Layers, Table, Terminal, HelpCircle];

// Xoay nhẹ cho chú thích tay: −1° đến 1.5°
const NOTE_ROTATIONS = [-1, 1.2, -0.6, 1.5];

function handleProseClick(e: React.MouseEvent<HTMLDivElement>) {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".code-copy-btn");
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

function FormulaSection({ section }: { section: SectionContent }) {
  const layout = useMemo(() => parseFormulaLayout(section.rawContent), [section.rawContent]);

  if (!layout) {
    return (
      <div
        className="notebook-prose text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(section.rawContent) }}
      />
    );
  }

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
            <div
              className="notebook-prose text-sm"
              dangerouslySetInnerHTML={{ __html: g.restHtml }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default function DynamicTopicPanels({ topicData }: Props) {
  return (
    <div className="flex-1 min-w-0 space-y-8">
      {topicData.sections.map((section, idx) => {
        const IconComponent = ICONS[idx % ICONS.length];
        const isFormulaSection = section.number === 3;
        const isCodeSection = section.number === 5;

        return (
          <section
            key={section.id || idx}
            id={section.id}
            className={`${
              isFormulaSection ? "paper-card paper-card-emph" : "paper-card"
            } p-6 sm:p-7 relative transition-all duration-300`}
          >
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-paper-dashed">
              <div className="w-8 h-8 rounded-lg bg-sticky flex items-center justify-center text-text-main border border-paper-border shrink-0">
                <IconComponent className="w-4 h-4 text-accent-red" />
              </div>
              <h2 className="text-xl font-bold text-text-main font-sans">
                {section.title}
              </h2>
            </div>

            {isFormulaSection ? (
              <FormulaSection section={section} />
            ) : (
              <div
                className="notebook-prose text-sm sm:text-base"
                onClick={isCodeSection ? handleProseClick : undefined}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(section.rawContent, { copyButtons: isCodeSection }),
                }}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
