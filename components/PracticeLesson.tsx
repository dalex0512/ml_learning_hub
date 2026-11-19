"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { TopicData } from "@/lib/markdown";
import type { Block } from "@/lib/blocks";
import { parseStepTitle, practiceStorageKey } from "@/lib/practice";
import { CheckList, PopDetail, Prose, ReaderQuiz } from "./ReaderParts";
import ReaderShell from "./ReaderShell";

interface NavTopic { moduleId: string; topicId: string; title: string }

function Exercise({ block }: { block: Extract<Block, { type: "exercise" }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="reader-try">
      <div className="reader-label">Tự làm{block.title ? ` · ${block.title}` : ""}</div>
      <Prose md={block.prompt} />
      {block.answer && (
        <>
          <button type="button" className="reader-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            {open ? "Ẩn đáp án" : "Làm xong rồi, xem đáp án"}
          </button>
          {open && <div className="ans"><Prose md={block.answer} /></div>}
        </>
      )}
    </div>
  );
}

function BlockView({ block, storeKey }: { block: Block; storeKey: string }) {
  if (block.type === "md") return <Prose md={block.md} />;
  if (block.type === "quiz") return <ReaderQuiz tiers={block.tiers} />;
  if (block.type === "exercise") return <Exercise block={block} />;
  if (block.type !== "box") return null;
  switch (block.kind) {
    case "ask":
      return <div className="reader-ask"><Prose md={block.md} /></div>;
    case "out":
      return <div className="reader-out"><Prose md={block.md} /></div>;
    case "recap":
      return <div className="reader-recap"><div className="reader-label">Nhớ lại</div><Prose md={block.md} /></div>;
    case "pop":
      return <PopDetail title={block.title} md={block.md} />;
    case "more":
      return (
        <details className="reader-more">
          <summary>Biết thêm{block.title ? ` · ${block.title}` : ""}</summary>
          <div><Prose md={block.md} /></div>
        </details>
      );
    case "check":
      return <CheckList md={block.md} storeKey={storeKey} />;
    default:
      return <Prose md={block.md} />;
  }
}

export default function PracticeLesson({
  topicData, moduleId, partLabel, next, prev,
}: {
  topicData: TopicData; moduleId: string; partLabel: string; next: NavTopic | null; prev: NavTopic | null;
}) {
  const steps = useMemo(() => topicData.sections.map((s) => ({ ...parseStepTitle(s.title), id: s.id })), [topicData.sections]);
  const key = practiceStorageKey(topicData.topicId);
  const [done, setDone] = useState<string[]>([]);
  const [active, setActive] = useState(steps[0]?.id ?? "");

  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setDone(JSON.parse(raw)); } catch {}
  }, [key]);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash) window.setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 50);
    const onScroll = () => {
      let cur = steps[0]?.id ?? "";
      for (const s of steps) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) cur = s.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [steps]);

  const toggleDone = (id: string) =>
    setDone((d) => {
      const n = d.includes(id) ? d.filter((x) => x !== id) : [...d, id];
      try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
      return n;
    });

  return (
    <ReaderShell backHref={`/${moduleId}`} backLabel="Lộ trình" title={topicData.title}>
      <div className="reader-layout">
        <nav className="reader-toc" aria-label="Các bước">
          <div className="reader-label" style={{ paddingLeft: ".75rem" }}>{partLabel}</div>
          {steps.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}
               onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="no">{done.includes(s.id) ? <span className="done">✓</span> : s.n ?? "·"}</span>
              <span>{s.label}</span>
            </a>
          ))}
        </nav>

        <main className="reader-main">
          <header>
            <div className="reader-eyebrow">{partLabel}</div>
            <h1 className="reader-title">{topicData.title}</h1>
            {topicData.description && <p className="reader-lead">{topicData.description}</p>}
          </header>

          {topicData.sections.map((section, idx) => {
            const st = steps[idx];
            const following = steps[idx + 1];
            return (
              <section key={section.id} id={section.id} className="reader-step">
                {st.n && <div className="reader-step-no">Bước {st.n}</div>}
                <h2>{st.label}</h2>
                {section.blocks.map((b, i) => <BlockView key={i} block={b} storeKey={`${key}:check:${section.id}`} />)}
                <div className="reader-foot">
                  <button type="button" className="reader-check" onClick={() => toggleDone(section.id)} style={{ fontSize: 14, color: "var(--r-muted)" }}>
                    <span className={`box ${done.includes(section.id) ? "on" : ""}`}>{done.includes(section.id) && <Check size={13} />}</span>
                    <span>Tôi đã hiểu phần này</span>
                  </button>
                  {following && <a href={`#${following.id}`}>Tiếp: {following.label} ↓</a>}
                </div>
              </section>
            );
          })}

          <div className="reader-step" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <Link href={`/${moduleId}`} className="reader-card">← Về lộ trình</Link>
            {next && <Link href={`/${next.moduleId}/${next.topicId}`} className="reader-card">Phần tiếp theo: {next.title} →</Link>}
          </div>
        </main>
      </div>
    </ReaderShell>
  );
}
