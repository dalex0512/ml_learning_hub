"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { practiceStorageKey, type PracticeStep } from "@/lib/practice";
import ReaderShell from "./ReaderShell";

export interface PracticePart {
  topicId: string;
  label: string;
  title: string;
  description: string;
  steps: PracticeStep[];
}

export default function PracticeRoadmap({
  moduleId, title, intro, parts,
}: { moduleId: string; title: string; intro: string; parts: PracticePart[] }) {
  const [done, setDone] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const next: Record<string, string[]> = {};
    for (const p of parts) {
      try { const raw = localStorage.getItem(practiceStorageKey(p.topicId)); next[p.topicId] = raw ? JSON.parse(raw) : []; }
      catch { next[p.topicId] = []; }
    }
    setDone(next);
  }, [parts]);

  const numbered = parts.flatMap((p) => p.steps.filter((s) => s.n).map((s) => ({ p, s })));
  const all = parts.flatMap((p) => p.steps.map((s) => ({ p, s })));
  const doneCount = all.filter(({ p, s }) => done[p.topicId]?.includes(s.id)).length;
  const first = all.find(({ p, s }) => !done[p.topicId]?.includes(s.id)) ?? all[0];

  return (
    <ReaderShell backHref="/#roadmap" backLabel="Roadmap" title={title}>
      <div className="reader-layout" style={{ display: "block" }}>
        <main className="reader-main" style={{ margin: "0 auto" }}>
          <div className="reader-eyebrow">Module 06 · Thực hành</div>
          <h1 className="reader-title">{title}</h1>
          <p className="reader-lead">{intro}</p>

          <div className="reader-label">Đường đi, từ trái sang phải</div>
          <div className="reader-flow">
            {numbered.map(({ s }, i) => (
              <React.Fragment key={s.id}>
                {i > 0 && <span>→</span>}
                <span className="chip">{s.label}</span>
              </React.Fragment>
            ))}
          </div>

          {first && (
            <p style={{ marginBottom: "2.5rem" }}>
              <Link href={`/${moduleId}/${first.p.topicId}#${first.s.id}`} className="reader-card" style={{ display: "inline-block" }}>
                {doneCount ? "Tiếp tục học" : "Bắt đầu"} → {first.s.label}
              </Link>
              <span style={{ marginLeft: "1rem", color: "var(--r-muted)", fontSize: 14 }}>{doneCount}/{all.length} phần đã hiểu</span>
            </p>
          )}

          {parts.map((part) => (
            <section key={part.topicId} style={{ marginBottom: "3rem" }}>
              <div className="reader-eyebrow">{part.label}</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: ".2rem 0 .4rem" }}>{part.title}</h2>
              <p style={{ color: "var(--r-muted)", margin: "0 0 1.2rem" }}>{part.description}</p>
              <div>
                {part.steps.map((s) => {
                  const d = done[part.topicId]?.includes(s.id);
                  return (
                    <Link key={s.id} href={`/${moduleId}/${part.topicId}#${s.id}`}
                      style={{ display: "flex", gap: "1rem", padding: ".9rem 0", borderTop: "1px solid var(--r-line)", textDecoration: "none", color: "inherit" }}>
                      <span style={{ minWidth: "2rem", fontWeight: 700, color: d ? "var(--r-ok)" : "var(--r-accent)" }}>{d ? "✓" : s.n ?? "·"}</span>
                      <span>
                        <span style={{ fontWeight: 600, display: "block" }}>{s.label}</span>
                        {s.goal && <span style={{ color: "var(--r-muted)", fontSize: 15, lineHeight: 1.6, display: "block", marginTop: ".15rem" }}>{s.goal}</span>}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>
    </ReaderShell>
  );
}
