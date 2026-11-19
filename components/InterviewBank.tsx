"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BankQuizItem } from "@/lib/markdown";
import { Prose } from "./ReaderParts";
import { SlideLightbox } from "./SlideViewer";

const TIERS = { A: "Hiểu bài", B: "Phỏng vấn lý thuyết", C: "Tình huống doanh nghiệp" };
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
const plain = (s: string) => s.replace(/<[^>]*>/g, " ");
const OPENED_KEY = "ml-interview-opened";

export default function InterviewBank({ items }: { items: BankQuizItem[] }) {
  const [tier, setTier] = useState("BC");
  const [topic, setTopic] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [selfTest, setSelfTest] = useState(true);
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try { const raw = localStorage.getItem(OPENED_KEY); if (raw) setOpened(new Set(JSON.parse(raw))); } catch {}
  }, []);
  const persist = (s: Set<string>) => { try { localStorage.setItem(OPENED_KEY, JSON.stringify(Array.from(s))); } catch {} };

  const topics = useMemo(() => Array.from(new Map(items.map((i) => [i.topicId, i.topicTitle]))), [items]);
  const tags = useMemo(() => Array.from(new Set(items.map((i) => i.tags).flat())).sort(), [items]);
  const indexed = useMemo(() => items.map((item) => ({ item, text: fold(plain([item.q, item.a, item.en, item.want, item.topicTitle, ...item.tags].join(" "))) })), [items]);
  const filtered = useMemo(() => indexed.filter(({ item: i, text }) =>
    tier.includes(i.tier) && (!topic || i.topicId === topic) && (!tag || i.tags.includes(tag)) && text.includes(fold(search).trim())
  ).map(({ item }) => item), [indexed, tier, topic, tag, search]);
  const visible = selected ? filtered.filter((i) => i.key === selected) : filtered;
  const resetDraw = () => setSelected(null);
  const toggle = (key: string) => setOpened((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    persist(next);
    return next;
  });
  const shuffle = () => {
    const pool = filtered.filter((i) => i.key !== selected);
    const draw = pool.length ? pool : filtered;
    if (draw.length) setSelected(draw[Math.floor(Math.random() * draw.length)].key);
  };
  const sel: React.CSSProperties = { width: "100%", marginTop: ".3rem", padding: ".45rem .6rem", font: "inherit", fontSize: 15, color: "var(--r-fg)", background: "var(--r-bg)", border: "1px solid var(--r-line)", borderRadius: 8 };

  return (
    <div>
      <SlideLightbox />
      <section aria-label="Bộ lọc câu hỏi" className="w-box" style={{ marginTop: 0 }}>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))" }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Tầng câu hỏi
            <select aria-label="Tầng câu hỏi" style={sel} value={tier} onChange={(e) => { setTier(e.target.value); resetDraw(); }}>
              <option value="BC">B + C · Phỏng vấn</option><option value="ABC">Tất cả tầng</option>
              {Object.entries(TIERS).map(([key, title]) => <option key={key} value={key}>{key} · {title}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Bài học
            <select aria-label="Bài học" style={sel} value={topic} onChange={(e) => { setTopic(e.target.value); resetDraw(); }}>
              <option value="">Tất cả bài</option>{topics.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Tìm kiếm
            <input type="search" style={sel} value={search} placeholder="Khái niệm, câu hỏi, đáp án…" onChange={(e) => { setSearch(e.target.value); resetDraw(); }} />
          </label>
        </div>
        <details style={{ marginTop: ".9rem" }}>
          <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--r-muted)" }}>Lọc theo tag{tag ? ` · ${tag}` : ""}</summary>
          <div style={{ marginTop: ".6rem", display: "flex", flexWrap: "wrap", gap: ".4rem", maxHeight: "12rem", overflowY: "auto" }}>
            {["", ...tags].map((value) => (
              <button type="button" key={value} aria-pressed={tag === value}
                onClick={() => { setTag(value); resetDraw(); }}
                style={{ font: "inherit", fontSize: 13, padding: ".1rem .7rem", borderRadius: 999, cursor: "pointer", color: tag === value ? "var(--r-bg)" : "var(--r-fg)", background: tag === value ? "var(--r-accent)" : "var(--r-bg)", border: "1px solid var(--r-line)" }}>
                {value || "Tất cả tag"}
              </button>
            ))}
          </div>
        </details>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: ".8rem 1.2rem", marginTop: "1rem", paddingTop: ".9rem", borderTop: "1px dashed var(--r-line)", fontSize: 14 }}>
          <label style={{ display: "flex", gap: ".4rem", alignItems: "center" }}><input type="checkbox" checked={selfTest} onChange={(e) => setSelfTest(e.target.checked)} />Tự test · ẩn đáp án</label>
          <button type="button" className="reader-btn" disabled={!filtered.length} onClick={shuffle}>Rút ngẫu nhiên một câu</button>
          {selected && <button type="button" className="reader-btn" onClick={resetDraw}>Xem danh sách</button>}
          <button type="button" className="reader-btn" onClick={() => { const e = new Set<string>(); setOpened(e); persist(e); setSelfTest(true); }}>Làm lại</button>
        </div>
        <p role="status" className="w-note">{filtered.length} câu phù hợp · đã mở {filtered.filter((i) => opened.has(i.key)).length}/{filtered.length}{selected ? " · đang rút một câu" : ""}</p>
      </section>

      {!visible.length && <p style={{ color: "var(--r-muted)" }}>Không có câu phù hợp. Thử bỏ tag hoặc đổi từ khóa.</p>}

      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {visible.map((item) => {
          const show = !selfTest || opened.has(item.key);
          return (
            <li key={item.key} style={{ padding: "1.6rem 0", borderTop: "1px solid var(--r-line)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem 1rem", fontSize: 13, color: "var(--r-muted)", marginBottom: ".6rem" }}>
                <span style={{ color: "var(--r-accent)", fontWeight: 600 }}>{item.tier} · {TIERS[item.tier as keyof typeof TIERS]}</span>
                <Link href={`/${item.moduleId}/${item.topicId}`} style={{ color: "var(--r-muted)", textDecoration: "underline", textUnderlineOffset: 3 }}>Bài: {item.topicTitle}</Link>
              </div>
              <div style={{ fontWeight: 600, fontSize: 18, lineHeight: 1.6 }}><Prose md={item.q} /></div>
              {selfTest && <button type="button" className="reader-btn" aria-expanded={show} onClick={() => toggle(item.key)}>{show ? "Ẩn đáp án" : "Hiện đáp án"}</button>}
              {show && (
                <div style={{ marginTop: "1rem" }}>
                  <div className="reader-card-note" style={{ marginTop: 0 }}><Prose md={item.a} /></div>
                  {item.en && <Prose md={`> **EN:** ${item.en.replace(/\n/g, "\n> ")}`} />}
                  {item.want && (
                    <div className="reader-note"><div className="reader-label">Người phỏng vấn muốn nghe</div><Prose md={item.want} /></div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
