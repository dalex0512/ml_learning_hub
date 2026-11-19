"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { TopicData } from "@/lib/markdown";
import type { Block } from "@/lib/blocks";
import { parseFormulaLayout } from "@/lib/renderMarkdown";
import { openSlides } from "./SlideViewer";
import { CheckList, PopDetail, Prose, ReaderQuiz } from "./ReaderParts";
import ReaderShell from "./ReaderShell";
import { WIDGETS } from "./widgets";

interface NavTopic { moduleId: string; topicId: string; title: string }

interface Props {
  topicData: TopicData;
  moduleId: string;
  moduleTitle: string;
  moduleOrder: number;
  topicOrder: number;
  needs: NavTopic[];
  prev: NavTopic | null;
  next: NavTopic | null;
  backlinks: NavTopic[];
}

const storageKey = (id: string) => `ml-theory:${id}`;

function Formula({ md }: { md: string }) {
  const layout = useMemo(() => parseFormulaLayout(md), [md]);
  if (!layout) return <div className="reader-formula"><Prose md={md} /></div>;
  return (
    <div className="reader-formula">
      <div className="reader-label">Công thức</div>
      {layout.introHtml && <div className="practice-prose" dangerouslySetInnerHTML={{ __html: layout.introHtml }} />}
      {layout.groups.map((g) => (
        <div key={g.name} className="reader-formula-item">
          <div className="reader-formula-name">
            <strong>{g.name}</strong>
            {g.subtitleHtml && <span dangerouslySetInnerHTML={{ __html: g.subtitleHtml }} />}
          </div>
          <pre className="reader-formula-code"><code>{g.code}</code></pre>
          {g.note && <p className="reader-formula-note">{g.note}</p>}
          {g.restHtml && <div className="practice-prose" dangerouslySetInnerHTML={{ __html: g.restHtml }} />}
        </div>
      ))}
    </div>
  );
}

function Reveal({ block }: { block: Extract<Block, { type: "exercise" }> }) {
  const [open, setOpen] = useState(false);
  const label = block.level === "predict" ? "Đoán trước" : block.level === "ck" ? "Kiểm hiểu" : "Tự làm";
  const btn = block.level === "predict" ? "Xem kết quả" : "Xem đáp án";
  return (
    <div className={`reader-try ${block.level}`}>
      <div className="reader-label">{label}{block.title ? ` · ${block.title}` : ""}</div>
      <Prose md={block.prompt} />
      {block.answer && (
        <>
          <button type="button" className="reader-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{open ? "Ẩn" : btn}</button>
          {open && <div className="ans"><Prose md={block.answer} /></div>}
        </>
      )}
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  const [n, setN] = useState(1);
  return (
    <div className="reader-steps">
      <div className="reader-label">Làm tay từng bước · {Math.min(n, items.length)}/{items.length}</div>
      {items.slice(0, n).map((t, i) => (
        <div key={i} className="reader-steps-item">
          <span className="no">{i + 1}</span>
          <div><Prose md={t} /></div>
        </div>
      ))}
      {n < items.length ? (
        <button type="button" className="reader-btn" onClick={() => setN(n + 1)}>Bước tiếp theo ↓</button>
      ) : items.length > 1 ? (
        <button type="button" className="reader-btn" onClick={() => setN(1)}>Xem lại từ đầu</button>
      ) : null}
    </div>
  );
}

function BlockView({ block, storeKey }: { block: Block; storeKey: string }) {
  if (block.type === "md") return <Prose md={block.md} />;
  if (block.type === "exercise") return <Reveal block={block} />;
  if (block.type === "steps") return <Steps items={block.items} />;
  if (block.type === "widget") {
    const W = WIDGETS[block.name];
    return W ? <W props={block.props} /> : null;
  }
  if (block.type === "quiz") return <ReaderQuiz tiers={block.tiers} />;
  if (block.type === "formula") return <Formula md={block.md} />;
  if (block.type === "slides") {
    return (
      <button type="button" className="reader-slide-btn" onClick={() => openSlides({ from: block.from, to: block.to })}>
        <span className="reader-slide-no">{block.from === block.to ? `Slide ${block.from}` : `Slide ${block.from}–${block.to}`}</span>
        <span>{block.caption || "Xem slide gốc"}</span>
        <span aria-hidden>→</span>
      </button>
    );
  }
  if (block.type !== "box") return null;
  const title = block.title ? ` · ${block.title}` : "";
  switch (block.kind) {
    case "intro":
      return (
        <div className="reader-intro">
          <div className="reader-label">{block.title || "Mục tiêu bài này"}</div>
          <Prose md={block.md} />
        </div>
      );
    case "worked":
      return (
        <div className="reader-worked">
          <div className="reader-label">Ví dụ làm tay{title}</div>
          <Prose md={block.md} />
        </div>
      );
    case "compare":
      return (
        <div className="reader-compare">
          <div className="reader-label">So sánh{title}</div>
          <Prose md={block.md} />
        </div>
      );
    case "pitfall":
      return (
        <div className="reader-pitfall">
          <div className="reader-label">Bẫy hay gặp{title}</div>
          <Prose md={block.md} />
        </div>
      );
    case "note":
      return (
        <div className="reader-note">
          {block.title && <div className="reader-label">{block.title}</div>}
          <Prose md={block.md} />
        </div>
      );
    case "recap":
      return <div className="reader-recap"><div className="reader-label">Nhớ lại</div><Prose md={block.md} /></div>;
    case "card":
      return <div className="reader-card-note"><div className="reader-label">Thẻ nhớ{block.title ? ` · ${block.title}` : ""}</div><Prose md={block.md} /></div>;
    case "next":
      return <div className="reader-next"><div className="reader-label">Nối sang bài sau</div><Prose md={block.md} /></div>;
    case "pop":
      return <PopDetail title={block.title} md={block.md} />;
    case "more":
      return (
        <details className="reader-more">
          <summary>Biết thêm{title}</summary>
          <div><Prose md={block.md} /></div>
        </details>
      );
    case "check":
      return <CheckList md={block.md} storeKey={storeKey} />;
    default:
      return <Prose md={block.md} />;
  }
}

export default function TheoryLesson({ topicData, moduleId, moduleTitle, moduleOrder, topicOrder, needs, prev, next, backlinks }: Props) {
  const key = storageKey(topicData.topicId);
  const sections = topicData.sections;
  const [done, setDone] = useState<string[]>([]);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setDone(JSON.parse(raw)); } catch {}
  }, [key]);

  useEffect(() => {
    try { localStorage.setItem("ml-last", JSON.stringify({ href: `/${moduleId}/${topicData.topicId}`, title: topicData.title, where: moduleTitle })); } catch {}
  }, [moduleId, topicData.topicId, topicData.title, moduleTitle]);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash) window.setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 50);
    const onScroll = () => {
      let cur = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) cur = s.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const toggleDone = (id: string) =>
    setDone((d) => {
      const n = d.includes(id) ? d.filter((x) => x !== id) : [...d, id];
      try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
      return n;
    });

  const eyebrow = `Module ${String(moduleOrder).padStart(2, "0")} · ${moduleTitle} · Bài ${String(topicOrder).padStart(2, "0")}`;
  const before = needs.length ? needs : prev ? [prev] : [];

  return (
    <ReaderShell backHref={`/${moduleId}`} backLabel={moduleTitle} title={topicData.title}>
      <div className="reader-layout">
        <nav className="reader-toc reader-toc-long" aria-label="Mục lục">
          <div className="reader-label" style={{ paddingLeft: ".75rem" }}>Trong bài này</div>
          {sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}
               onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="no">{done.includes(s.id) ? <span className="done">✓</span> : i + 1}</span>
              <span>{s.title}</span>
            </a>
          ))}
        </nav>

        <main className="reader-main">
          <header>
            <div className="reader-eyebrow">{eyebrow}</div>
            <h1 className="reader-title">{topicData.title}</h1>
            {topicData.description && <p className="reader-lead" style={{ marginBottom: "1.2rem" }}>{topicData.description}</p>}
            <div className="reader-trail">
              {before.length > 0 && (
                <span>
                  <span className="reader-trail-label">Cần biết trước</span>
                  {before.map((b, i) => (
                    <React.Fragment key={b.topicId}>{i > 0 && ", "}<Link href={`/${b.moduleId}/${b.topicId}`}>{b.title}</Link></React.Fragment>
                  ))}
                </span>
              )}
              {next && (
                <span>
                  <span className="reader-trail-label">Bài sau</span>
                  <Link href={`/${next.moduleId}/${next.topicId}`}>{next.title}</Link>
                </span>
              )}
              {topicData.slides && (
                <button type="button" className="reader-btn" onClick={() => openSlides({ from: topicData.slides!.from, to: topicData.slides!.to })}>
                  Xem slide gốc {topicData.slides.from === topicData.slides.to ? topicData.slides.from : `${topicData.slides.from}–${topicData.slides.to}`}
                </button>
              )}
            </div>
          </header>

          {sections.map((section, idx) => (
            <section key={section.id} id={section.id} className="reader-step">
              <div className="reader-step-no">Phần {idx + 1}</div>
              <h2>{section.title}</h2>
              {section.blocks.map((b, i) => <BlockView key={i} block={b} storeKey={`${key}:check:${section.id}`} />)}
              <div className="reader-foot">
                <button type="button" className="reader-check" onClick={() => toggleDone(section.id)} style={{ fontSize: 14, color: "var(--r-muted)" }}>
                  <span className={`box ${done.includes(section.id) ? "on" : ""}`}>{done.includes(section.id) && <Check size={13} />}</span>
                  <span>Tôi đã hiểu phần này</span>
                </button>
                {sections[idx + 1] && <a href={`#${sections[idx + 1].id}`}>Tiếp: {sections[idx + 1].title} ↓</a>}
              </div>
            </section>
          ))}

          <div className="reader-step">
            {backlinks.length > 0 && (
              <p className="reader-trail" style={{ marginBottom: "1.5rem" }}>
                <span>
                  <span className="reader-trail-label">Được dùng lại ở</span>
                  {backlinks.map((b, i) => (
                    <React.Fragment key={b.topicId}>{i > 0 && ", "}<Link href={`/${b.moduleId}/${b.topicId}`}>{b.title}</Link></React.Fragment>
                  ))}
                </span>
              </p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              {prev ? <Link href={`/${prev.moduleId}/${prev.topicId}`} className="reader-card">← {prev.title}</Link> : <span />}
              {next && <Link href={`/${next.moduleId}/${next.topicId}`} className="reader-card">{next.title} →</Link>}
            </div>
            <p style={{ marginTop: "1.5rem" }}><Link href="/phong-van" className="reader-btn">Ôn lại trong ngân hàng phỏng vấn →</Link></p>
          </div>
        </main>
      </div>
    </ReaderShell>
  );
}
