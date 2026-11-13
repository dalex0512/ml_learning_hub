"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Flag,
  Keyboard,
  Languages,
  ListChecks,
  PencilLine,
  Target,
} from "lucide-react";
import type { TopicData } from "@/lib/markdown";
import type { Block } from "@/lib/blocks";
import { parseStepTitle, practiceStorageKey } from "@/lib/practice";
import MarkdownContent from "./MarkdownContent";
import Quiz from "./Quiz";

interface NavTopic {
  moduleId: string;
  topicId: string;
  title: string;
}

interface Props {
  topicData: TopicData;
  moduleId: string;
  partLabel: string;
  next: NavTopic | null;
  prev: NavTopic | null;
}

const LEVEL_STYLE: Record<number, string> = {
  1: "bg-[#E3EFD3] text-[#3E5F1F] border-[#BCD6A0]",
  2: "bg-[#FBEBC2] text-[#7A5A06] border-[#E9CF84]",
  3: "bg-[#F6D5CF] text-[#8E2E22] border-[#E4A99F]",
};

function SectionLabel({ icon: Icon, children, tone = "text-text-sub" }: { icon: React.ElementType; children: React.ReactNode; tone?: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${tone}`}>
      <Icon className="w-4 h-4" />
      {children}
    </div>
  );
}

function Exercise({ block }: { block: Extract<Block, { type: "exercise" }> }) {
  const [open, setOpen] = useState(false);
  const level = Math.min(3, Math.max(1, block.level.replace(/[^★]/g, "").length || 1));
  return (
    <div className="rounded-xl border border-paper-dashed bg-panel overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded-md border text-xs font-bold tracking-wide ${LEVEL_STYLE[level]}`}>
            {"★".repeat(level)}
          </span>
          {block.title && <span className="font-semibold text-sm text-text-main">{block.title}</span>}
        </div>
        <MarkdownContent md={block.prompt} />
      </div>
      {block.answer && (
        <div className="border-t border-paper-dashed bg-[#FDFBF3]">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 text-sm font-semibold text-accent-red hover:bg-sticky/60 transition-colors"
          >
            <span>{open ? "Ẩn đáp án" : "Làm xong rồi? Xem đáp án"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="px-4 sm:px-5 pb-4">
              <MarkdownContent md={block.answer} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckList({ md, storeKey }: { md: string; storeKey: string }) {
  const items = useMemo(
    () => md.split("\n").map((l) => l.replace(/^[-*]\s*(\[[ xX]\]\s*)?/, "").trim()).filter(Boolean),
    [md]
  );
  const [done, setDone] = useState<Record<number, boolean>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, [storeKey]);
  const toggle = (i: number) =>
    setDone((d) => {
      const n = { ...d, [i]: !d[i] };
      try { localStorage.setItem(storeKey, JSON.stringify(n)); } catch {}
      return n;
    });
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() => toggle(i)}
            className="w-full flex items-start gap-3 text-left rounded-lg px-3 py-2 hover:bg-white/60 transition-colors"
          >
            <span className={`mt-0.5 w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center ${done[i] ? "bg-[#4E7A2B] border-[#4E7A2B] text-white" : "border-[#9DB784] bg-white"}`}>
              {done[i] && <Check className="w-3.5 h-3.5" />}
            </span>
            <span className={`text-sm sm:text-[15px] leading-relaxed ${done[i] ? "line-through text-text-sub" : "text-text-main"}`}>{t}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function EnBlock({ md }: { md: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-paper-dashed bg-panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3 text-sm font-semibold text-text-main"
      >
        <span className="flex items-center gap-2"><Languages className="w-4 h-4 text-accent-red" />Trả lời phỏng vấn bằng tiếng Anh</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 sm:px-5 pb-4"><MarkdownContent md={md} /></div>}
    </div>
  );
}

function BlockView({ block, prevType, storeKey }: { block: Block; prevType: string | null; storeKey: string }) {
  if (block.type === "md") return <MarkdownContent md={block.md} />;
  if (block.type === "quiz") return <Quiz tiers={block.tiers} />;
  if (block.type === "exercise") {
    return (
      <div className="space-y-3">
        {prevType !== "exercise" && (
          <SectionLabel icon={PencilLine} tone="text-accent-red">Tự làm — thử trước, xem đáp án sau</SectionLabel>
        )}
        <Exercise block={block} />
      </div>
    );
  }
  if (block.type !== "box") return null;

  switch (block.kind) {
    case "goal":
      return (
        <div className="flex items-start gap-3 rounded-xl bg-sticky border border-paper-border px-4 py-3.5">
          <Target className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-sub mb-0.5">Mục tiêu bước này</div>
            <MarkdownContent md={block.md} className="!text-base font-medium" />
          </div>
        </div>
      );
    case "learn":
      return (
        <section className="space-y-2">
          <SectionLabel icon={BookOpen}>Hiểu nhanh{block.title ? ` · ${block.title}` : ""}</SectionLabel>
          <div className="rounded-xl bg-panel border border-paper-dashed p-4 sm:p-5">
            <MarkdownContent md={block.md} />
          </div>
        </section>
      );
    case "code":
      return (
        <section className="space-y-2">
          <SectionLabel icon={Keyboard}>Gõ code{block.title ? ` · ${block.title}` : ""}</SectionLabel>
          <MarkdownContent md={block.md} />
        </section>
      );
    case "see":
      return (
        <section className="rounded-xl bg-[#F3F7EC] border border-[#C9D9B5] p-4 sm:p-5 space-y-2">
          <SectionLabel icon={CheckCircle2} tone="text-[#3E5F1F]">Bạn phải thấy{block.title ? ` · ${block.title}` : ""}</SectionLabel>
          <MarkdownContent md={block.md} />
        </section>
      );
    case "pitfall":
      return (
        <section className="rounded-xl bg-[#FFF1EE] border border-[#E9B5AC] p-4 sm:p-5 space-y-2">
          <SectionLabel icon={AlertTriangle} tone="text-[#8E2E22]">Bẫy hay gặp{block.title ? ` · ${block.title}` : ""}</SectionLabel>
          <MarkdownContent md={block.md} />
        </section>
      );
    case "en":
      return <EnBlock md={block.md} />;
    case "check":
      return (
        <section className="rounded-xl bg-[#F3F7EC] border border-[#C9D9B5] p-3 sm:p-4 space-y-2">
          <div className="px-2"><SectionLabel icon={ListChecks} tone="text-[#3E5F1F]">Checklist tự kiểm{block.title ? ` · ${block.title}` : ""}</SectionLabel></div>
          <CheckList md={block.md} storeKey={storeKey} />
        </section>
      );
    case "recap":
      return (
        <section className="rounded-xl bg-[#F3F7EC] border border-[#C9D9B5] p-4 sm:p-5 space-y-2">
          <SectionLabel icon={ListChecks} tone="text-[#3E5F1F]">Nhớ 5 điều</SectionLabel>
          <MarkdownContent md={block.md} />
        </section>
      );
    case "worked":
      return (
        <section className="rounded-xl bg-[#FDFBF3] border border-paper-dashed p-4 sm:p-5 space-y-2">
          <SectionLabel icon={PencilLine}>Làm tay{block.title ? ` · ${block.title}` : ""}</SectionLabel>
          <MarkdownContent md={block.md} />
        </section>
      );
    default:
      return (
        <section className="rounded-xl bg-sticky border border-paper-border p-4 sm:p-5">
          {block.title && <div className="font-semibold text-sm mb-1">{block.title}</div>}
          <MarkdownContent md={block.md} />
        </section>
      );
  }
}

export default function PracticeLesson({ topicData, moduleId, partLabel, next, prev }: Props) {
  const steps = useMemo(
    () => topicData.sections.map((s) => ({ ...parseStepTitle(s.title), id: s.id })),
    [topicData.sections]
  );
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const key = practiceStorageKey(topicData.topicId);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    const idx = steps.findIndex((s) => s.id === hash);
    if (idx >= 0) setActive(idx);
  }, [key, steps]);

  const go = useCallback(
    (i: number) => {
      const n = Math.min(steps.length - 1, Math.max(0, i));
      setActive(n);
      try { window.history.replaceState(null, "", `#${steps[n].id}`); } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [steps]
  );

  const markDone = (id: string, value = true) =>
    setDone((d) => {
      const n = value ? Array.from(new Set([...d, id])) : d.filter((x) => x !== id);
      try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
      return n;
    });

  const section = topicData.sections[active];
  const step = steps[active];
  const isDone = done.includes(step.id);
  const isLast = active === steps.length - 1;
  const total = steps.length;
  const doneCount = steps.filter((s) => done.includes(s.id)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-20">
      <Link href={`/${moduleId}`} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-red">
        <ArrowLeft className="w-4 h-4" /> Xem toàn bộ lộ trình thực hành
      </Link>

      <header className="mt-5 mb-7 max-w-3xl">
        <span className="font-hand text-accent-red text-xl sm:text-2xl font-bold">{partLabel}</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main mt-1">{topicData.title}</h1>
        {topicData.description && <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed">{topicData.description}</p>}
      </header>

      <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10 items-start">
        {/* Thanh lộ trình */}
        <aside className="lg:sticky lg:top-28 mb-6 lg:mb-0">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-hand text-accent-red text-lg font-bold">Lộ trình</span>
            <span className="text-xs text-text-sub">{doneCount}/{total} xong</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#EADFC0] mb-3 overflow-hidden">
            <div className="h-full bg-accent-red transition-all" style={{ width: `${(doneCount / total) * 100}%` }} />
          </div>
          <nav aria-label="Các bước" className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1">
            {steps.map((s, i) => {
              const on = i === active;
              const d = done.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={on ? "step" : undefined}
                  className={`shrink-0 flex items-center gap-3 text-left rounded-lg border px-3 py-2 transition-colors ${
                    on ? "bg-sticky border-paper-border shadow-xs" : "border-transparent hover:bg-panel"
                  }`}
                >
                  <span
                    className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      d ? "bg-[#4E7A2B] border-[#4E7A2B] text-white" : on ? "bg-accent-red border-accent-red text-white" : "bg-white border-paper-dashed-dark text-text-muted"
                    }`}
                  >
                    {d ? <Check className="w-4 h-4" /> : s.n ?? <Flag className="w-3.5 h-3.5" />}
                  </span>
                  <span className={`text-sm leading-snug lg:max-w-[170px] ${on ? "font-semibold text-text-main" : "text-text-muted"}`}>{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Nội dung một bước */}
        <main className="min-w-0">
          <div className="paper-card p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-paper-dashed">
              <span className="font-hand text-accent-red text-2xl font-bold whitespace-nowrap">
                {step.n ? `Bước ${step.n}` : "Tổng kết"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-main leading-tight">{step.label}</h2>
              <span className="ml-auto text-xs text-text-sub whitespace-nowrap">{active + 1}/{total}</span>
            </div>

            <div className="space-y-6">
              {section.blocks.map((b, i) => (
                <BlockView
                  key={`${section.id}-${i}`}
                  block={b}
                  prevType={i > 0 ? section.blocks[i - 1].type : null}
                  storeKey={`${key}:check:${section.id}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-paper-border bg-sticky text-sm font-medium disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" /> Bước trước
            </button>
            <div className="flex flex-wrap items-center gap-3">
              {isDone && (
                <button type="button" onClick={() => markDone(step.id, false)} className="text-xs text-text-sub underline">
                  Bỏ đánh dấu
                </button>
              )}
              {!isLast ? (
                <button
                  type="button"
                  onClick={() => { markDone(step.id); go(active + 1); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-dark text-panel text-sm font-semibold hover:bg-black"
                >
                  Xong bước này <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => markDone(step.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-dark text-panel text-sm font-semibold hover:bg-black"
                  >
                    <Check className="w-4 h-4" /> Hoàn thành phần này
                  </button>
                  {next && (
                    <Link href={`/${next.moduleId}/${next.topicId}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-paper-border bg-sticky text-sm font-semibold">
                      Phần tiếp theo <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
