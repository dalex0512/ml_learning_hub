"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BankQuizItem } from "@/lib/markdown";
import MarkdownContent from "./MarkdownContent";
import { SlideLightbox } from "./SlideViewer";

const TIERS = { A: "Hiểu bài", B: "Phỏng vấn lý thuyết", C: "Tình huống doanh nghiệp" };
const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
const plain = (s: string) => s.replace(/<[^>]*>/g, " ");

export default function InterviewBank({ items }: { items: BankQuizItem[] }) {
  const [tier, setTier] = useState("BC");
  const [topic, setTopic] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [selfTest, setSelfTest] = useState(true);
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const topics = useMemo(() => Array.from(new Map(items.map(i => [i.topicId, i.topicTitle]))), [items]);
  const tags = useMemo(() => Array.from(new Set(items.map(i => i.tags).flat())).sort(), [items]);
  const indexed = useMemo(() => items.map(item => ({ item, text: fold(plain([item.q, item.a, item.en, item.want, item.topicTitle, ...item.tags].join(" "))) })), [items]);
  const filtered = useMemo(() => indexed.filter(({ item: i, text }) =>
    tier.includes(i.tier) && (!topic || i.topicId === topic) && (!tag || i.tags.includes(tag)) && text.includes(fold(search).trim())
  ).map(({ item }) => item), [indexed, tier, topic, tag, search]);
  const visible = selected ? filtered.filter(i => i.key === selected) : filtered;
  const resetDraw = () => setSelected(null);
  const toggle = (key: string) => setOpened(previous => {
    const next = new Set(previous);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });
  const shuffle = () => {
    const pool = filtered.filter(i => i.key !== selected);
    const draw = pool.length ? pool : filtered;
    if (draw.length) setSelected(draw[Math.floor(Math.random() * draw.length)].key);
  };

  return <div className="space-y-6">
    <SlideLightbox />
    <section className="paper-card p-5 sm:p-7 space-y-4" aria-label="Bộ lọc câu hỏi">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold">Tầng câu hỏi
          <select className="notebook-input" value={tier} onChange={e => { setTier(e.target.value); resetDraw(); }}>
            <option value="BC">B + C · Phỏng vấn</option><option value="ABC">Tất cả tầng</option>
            {Object.entries(TIERS).map(([key, title]) => <option key={key} value={key}>{key} · {title}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Bài học
          <select className="notebook-input" value={topic} onChange={e => { setTopic(e.target.value); resetDraw(); }}>
            <option value="">Tất cả bài</option>{topics.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Tìm kiếm
          <input type="search" className="notebook-input" value={search} placeholder="Khái niệm, câu hỏi, đáp án…" onChange={e => { setSearch(e.target.value); resetDraw(); }} />
        </label>
      </div>
      <details>
        <summary className="cursor-pointer text-sm font-semibold">Lọc theo tag{tag ? ` · ${tag}` : ""}</summary>
        <div className="mt-3 flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {["", ...tags].map(value => <button type="button" key={value} aria-pressed={tag === value}
            className={`rounded-full border border-paper-border px-3 py-1 text-xs ${tag === value ? "bg-sticky font-bold" : "bg-panel"}`}
            onClick={() => { setTag(value); resetDraw(); }}>{value || "Tất cả tag"}</button>)}
        </div>
      </details>
      <div className="flex flex-wrap gap-3 items-center border-t border-dashed border-paper-dashed pt-4">
        <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={selfTest} onChange={e => setSelfTest(e.target.checked)} />Tự test · ẩn đáp án</label>
        <button type="button" className="notebook-button" disabled={!filtered.length} onClick={shuffle}>Xáo ngẫu nhiên</button>
        {selected && <button type="button" className="notebook-button" onClick={resetDraw}>Xem danh sách</button>}
        <button type="button" className="text-sm underline decoration-dashed" onClick={() => { setOpened(new Set()); setSelfTest(true); }}>Làm lại</button>
      </div>
      <p role="status" className="text-sm text-text-muted">{filtered.length} câu phù hợp · Đã mở {filtered.filter(i => opened.has(i.key)).length}/{filtered.length} câu{selected ? " · Đang rút một câu" : ""}</p>
    </section>
    {!visible.length && <p className="paper-card p-6">Không có câu phù hợp. Thử bỏ tag hoặc đổi từ khóa.</p>}
    <ol className="space-y-5">
      {visible.map(item => {
        const show = !selfTest || opened.has(item.key);
        return <li key={item.key} className="paper-card p-5 sm:p-7 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 mb-4 text-xs">
            <span className="rounded bg-sticky border border-paper-border px-2 py-1 font-mono">{item.tier} · {TIERS[item.tier as keyof typeof TIERS]}</span>
            <Link href={`/${item.moduleId}/${item.topicId}`} className="text-accent-red underline decoration-dashed underline-offset-4">{item.topicTitle}</Link>
          </div>
          <MarkdownContent md={item.q} className="font-semibold" />
          {selfTest && <button type="button" className="notebook-button mt-4" aria-expanded={show} onClick={() => toggle(item.key)}>{show ? "Ẩn đáp án" : "Hiện đáp án"}</button>}
          {show && <div className="mt-4 space-y-4">
            <div className="rounded border-l-[3px] border-accent-red bg-[#F3F7EC] p-4"><MarkdownContent md={item.a} /></div>
            {item.en && <MarkdownContent md={`> **EN:** ${item.en.replace(/\n/g, "\n> ")}`} />}
            {item.want && <div className="rounded border border-dashed border-paper-dashed bg-sticky p-4"><p className="font-hand text-accent-red mb-2">Người phỏng vấn muốn nghe:</p><MarkdownContent md={item.want} /></div>}
          </div>}
        </li>;
      })}
    </ol>
  </div>;
}
