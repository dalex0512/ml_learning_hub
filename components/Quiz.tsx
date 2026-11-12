"use client";

import React, { useMemo, useState } from "react";
import { renderMarkdown } from "@/lib/renderMarkdown";
import type { QuizTier } from "@/lib/blocks";

const TIER_HINT: Record<string, string> = {
  A: "Kiểm tra đã hiểu bài chưa — tự làm trước, đừng nhìn đáp án.",
  B: "Câu hỏi phỏng vấn lý thuyết — tập trả lời thành lời trong 30–60 giây.",
  C: "Tình huống doanh nghiệp — không có công thức, phải chọn và biện luận.",
};

function Md({ md, className = "" }: { md: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(md, { copyButtons: "lang" }), [md]);
  return (
    <div
      className={`notebook-prose text-sm sm:text-[15px] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function Quiz({ tiers }: { tiers: QuizTier[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  if (!tiers.length) return null;
  const tier = tiers[active];

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const setAll = (v: boolean) =>
    setOpen((o) => {
      const n = { ...o };
      tier.items.forEach((_, i) => (n[`${tier.key}${i}`] = v));
      return n;
    });
  const opened = tier.items.filter((_, i) => open[`${tier.key}${i}`]).length;

  return (
    <div className="quiz">
      <div role="tablist" className="flex flex-wrap gap-2 mb-3">
        {tiers.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={i === active}
            type="button"
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
              i === active
                ? "bg-sticky border-paper-border text-text-main"
                : "border-transparent text-text-muted hover:bg-panel"
            }`}
          >
            <span className="font-mono text-accent-red mr-1.5">{t.key}</span>
            {t.title}
            <span className="ml-1.5 text-xs text-text-sub">({t.items.length})</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="font-hand text-accent-red text-base">{TIER_HINT[tier.key] ?? ""}</p>
        <button
          type="button"
          onClick={() => setAll(opened < tier.items.length)}
          className="text-xs text-text-muted underline decoration-dashed underline-offset-4 hover:text-accent-red shrink-0"
        >
          {opened < tier.items.length ? "Mở tất cả đáp án" : "Ẩn tất cả"}
        </button>
      </div>

      <ol className="space-y-4">
        {tier.items.map((it, i) => {
          const k = `${tier.key}${i}`;
          const isOpen = !!open[k];
          return (
            <li key={k} className="rounded-lg border border-paper-dashed bg-[#FDFBF3] p-4">
              <div className="flex gap-3">
                <span className="font-mono text-xs font-semibold text-accent-red pt-1 shrink-0">
                  {tier.key}
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Md md={it.q} className="font-medium" />
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(k)}
                    className="mt-3 text-sm font-semibold px-3 py-1 rounded-md border border-paper-border bg-panel hover:bg-sticky transition-colors"
                  >
                    {isOpen ? "Ẩn đáp án" : "Hiện đáp án"}
                  </button>
                  {isOpen && (
                    <div className="mt-3 space-y-3">
                      <div className="rounded-md border-l-[3px] border-accent-red bg-[#F3F7EC] px-4 py-3">
                        <Md md={it.a} />
                      </div>
                      {it.want && (
                        <div className="rounded-md border border-dashed border-paper-dashed-dark bg-sticky px-4 py-3">
                          <span className="font-hand text-accent-red text-base block mb-1">
                            Người phỏng vấn muốn nghe:
                          </span>
                          <Md md={it.want} />
                        </div>
                      )}
                      {it.en && (
                        <div className="text-[13px] text-text-sub leading-relaxed">
                          <span className="notebook-prose">
                            <span className="en-badge">EN</span>
                          </span>
                          <Md md={it.en} className="!text-[13px] !text-text-sub" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
