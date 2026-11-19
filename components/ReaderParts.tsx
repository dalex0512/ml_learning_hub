"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizTier } from "@/lib/blocks";
import { renderMarkdown } from "@/lib/renderMarkdown";
import { handleMarkdownClick } from "./MarkdownContent";

/** Các mảnh dùng chung của chế độ đọc (bài thực hành và bài lý thuyết). */

export function Prose({ md }: { md: string }) {
  const html = useMemo(() => renderMarkdown(md, { copyButtons: "lang" }), [md]);
  return <div className="practice-prose" onClick={handleMarkdownClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function PopDetail({ title, md, label = "Giải thích chi tiết" }: { title: string; md: string; label?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <>
      <button type="button" className="reader-pop-btn" onClick={() => setOpen(true)}>
        <span aria-hidden>＋</span> {label}: {title}
      </button>
      {open && (
        <div className="reader-modal-overlay" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={title}>
          <div className="reader-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reader-modal-head">
              <strong>{title}</strong>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng"><X size={20} /></button>
            </div>
            <div className="reader-modal-body"><Prose md={md} /></div>
          </div>
        </div>
      )}
    </>
  );
}

export function CheckList({ md, storeKey }: { md: string; storeKey: string }) {
  const items = useMemo(() => md.split("\n").map((l) => l.replace(/^[-*]\s*(\[[ xX]\]\s*)?/, "").trim()).filter(Boolean), [md]);
  const [done, setDone] = useState<Record<number, boolean>>({});
  useEffect(() => {
    try { const raw = localStorage.getItem(storeKey); if (raw) setDone(JSON.parse(raw)); } catch {}
  }, [storeKey]);
  const toggle = (i: number) =>
    setDone((d) => {
      const n = { ...d, [i]: !d[i] };
      try { localStorage.setItem(storeKey, JSON.stringify(n)); } catch {}
      return n;
    });
  return (
    <div>
      {items.map((t, i) => (
        <button key={i} type="button" className="reader-check" onClick={() => toggle(i)}>
          <span className={`box ${done[i] ? "on" : ""}`}>{done[i] && <Check size={13} />}</span>
          <span>{t}</span>
        </button>
      ))}
    </div>
  );
}

const TIER_HINT: Record<string, string> = {
  A: "Tự trả lời trước, rồi mới mở đáp án.",
  B: "Tập nói thành lời trong 30 đến 60 giây.",
  C: "Tình huống thật: không có công thức, phải chọn và biện luận.",
};

export function ReaderQuiz({ tiers }: { tiers: QuizTier[] }) {
  return (
    <div>
      {tiers.map((tier) => (
        <div key={tier.key} style={{ marginTop: "1.6rem" }}>
          <div className="reader-label">{tier.title}</div>
          {TIER_HINT[tier.key] && <p style={{ color: "var(--r-muted)", fontSize: 14, margin: "0 0 .4rem" }}>{TIER_HINT[tier.key]}</p>}
          {tier.items.map((it, i) => (
            <details key={i} className="reader-q">
              <summary>{it.q.replace(/^\*\*B\d+\.\*\*\s*/, "")}</summary>
              <div>
                <Prose md={it.a} />
                {it.en && <Prose md={`> ${it.en}`} />}
                {it.want && <Prose md={`> **Nhà tuyển dụng muốn nghe:** ${it.want}`} />}
              </div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
