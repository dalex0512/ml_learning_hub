"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReaderShell from "./ReaderShell";

export interface HomeTopic {
  id: string;
  order: number;
  title: string;
  group: string;
  description: string;
  sections: number;
  practice: boolean;
}

export interface HomeModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  topics: HomeTopic[];
}

interface Last { href: string; title: string; where?: string }

export default function HomeRoadmap({ modules, questionCount }: { modules: HomeModule[]; questionCount: number }) {
  const [done, setDone] = useState<Record<string, number>>({});
  const [last, setLast] = useState<Last | null>(null);

  useEffect(() => {
    const d: Record<string, number> = {};
    for (const m of modules) {
      for (const t of m.topics) {
        try {
          const raw = localStorage.getItem(`${t.practice ? "ml-practice" : "ml-theory"}:${t.id}`);
          const arr = raw ? JSON.parse(raw) : [];
          d[t.id] = Array.isArray(arr) ? arr.length : 0;
        } catch { d[t.id] = 0; }
      }
    }
    setDone(d);
    try { const raw = localStorage.getItem("ml-last"); if (raw) setLast(JSON.parse(raw)); } catch {}
  }, [modules]);

  const firstTopic = modules.find((m) => m.topics.length)?.topics[0];
  const live = modules.filter((m) => m.topics.length);

  const stats = useMemo(() => {
    const total = live.reduce((n, m) => n + m.topics.reduce((a, t) => a + t.sections, 0), 0);
    const finished = live.reduce((n, m) => n + m.topics.reduce((a, t) => a + Math.min(done[t.id] ?? 0, t.sections), 0), 0);
    return { total, finished };
  }, [live, done]);

  return (
    <ReaderShell title="">
      <div className="reader-layout" style={{ display: "block" }}>
        <main className="reader-main" style={{ margin: "0 auto", maxWidth: "46rem" }}>
          {/* 1. Tiếp tục học */}
          <section style={{ marginBottom: "3rem" }}>
            {last ? (
              <Link href={last.href} className="reader-card" style={{ padding: "1.2rem 1.4rem" }}>
                <div className="reader-label">Tiếp tục học</div>
                <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>{last.title} →</div>
                {last.where && <div style={{ color: "var(--r-muted)", fontSize: 14, marginTop: ".2rem" }}>{last.where}</div>}
              </Link>
            ) : firstTopic ? (
              <Link href={`/${live[0].id}/${firstTopic.id}`} className="reader-card" style={{ padding: "1.2rem 1.4rem" }}>
                <div className="reader-label">Bắt đầu</div>
                <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>{firstTopic.title} →</div>
                <div style={{ color: "var(--r-muted)", fontSize: 14, marginTop: ".2rem" }}>Bài đầu tiên của lộ trình</div>
              </Link>
            ) : null}
          </section>

          {/* 2. Giới thiệu */}
          <section style={{ marginBottom: "3.5rem" }}>
            <h1 className="reader-title" style={{ marginTop: 0 }}>Học Machine Learning từ gốc, theo đúng thứ tự</h1>
            <p className="reader-lead" style={{ marginBottom: "1.6rem" }}>
              Mỗi bài giải thích một ý chính, có ví dụ số làm tay, và nối với một dự án thực hành. Đọc đến đâu hiểu đến đó, rồi ôn lại bằng câu hỏi phỏng vấn.
            </p>
            <ol className="home-steps">
              <li><span className="n">1</span><span><strong>Đọc lý thuyết</strong><br />Từng bài, từng ý, có ví dụ.</span></li>
              <li><span className="n">2</span><span><strong>Làm Project</strong><br />Gõ code trên dữ liệu thật.</span></li>
              <li><span className="n">3</span><span><strong>Ôn phỏng vấn</strong><br />Trả lời trước, xem đáp án sau.</span></li>
            </ol>
          </section>

          {/* 3. Lộ trình */}
          <section id="roadmap" style={{ marginBottom: "3.5rem" }}>
            <div className="reader-eyebrow">Lộ trình</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: ".2rem 0 .6rem" }}>Sáu module, đi từ trên xuống</h2>
            <p style={{ color: "var(--r-muted)", margin: "0 0 1.6rem" }}>
              {stats.total > 0 ? `Đã hiểu ${stats.finished} trên ${stats.total} phần của các bài hiện có.` : ""}
            </p>
            <div>
              {modules.map((m) => {
                const sections = m.topics.reduce((a, t) => a + t.sections, 0);
                const finished = m.topics.reduce((a, t) => a + Math.min(done[t.id] ?? 0, t.sections), 0);
                const pct = sections ? Math.round((finished / sections) * 100) : 0;
                const groups = Array.from(new Set(m.topics.map((t) => t.group)));
                const empty = m.topics.length === 0;
                return (
                  <details key={m.id} className="home-module" open={!empty && m.order === live[0]?.order && false}>
                    <summary>
                      <span className="home-no">{String(m.order).padStart(2, "0")}</span>
                      <span className="home-main">
                        <span className="home-name">{m.title}</span>
                        <span className="home-sub">{m.subtitle}</span>
                        {!empty && (
                          <span className="home-bar" aria-hidden><span style={{ width: `${pct}%` }} /></span>
                        )}
                      </span>
                      <span className="home-meta">{empty ? "Sắp có" : `${m.topics.length} bài · ${pct}%`}</span>
                    </summary>
                    {!empty && (
                      <div className="home-lessons">
                        {groups.map((g) => (
                          <div key={g}>
                            <div className="reader-label" style={{ margin: "1rem 0 .3rem" }}>{g}</div>
                            {m.topics.filter((t) => t.group === g).map((t) => {
                              const d = Math.min(done[t.id] ?? 0, t.sections);
                              return (
                                <Link key={t.id} href={`/${m.id}/${t.id}`} className="home-lesson">
                                  <span className="home-lno">{String(t.order).padStart(2, "0")}</span>
                                  <span style={{ flex: 1, minWidth: 0 }}>
                                    <span className="home-lname">{t.title}</span>
                                    <span className="home-ldesc">{t.description}</span>
                                  </span>
                                  <span className="home-lprog">{d > 0 ? `${d}/${t.sections}` : `${t.sections} phần`}</span>
                                </Link>
                              );
                            })}
                          </div>
                        ))}
                        <p style={{ margin: "1rem 0 0" }}><Link href={`/${m.id}`} className="reader-btn">Xem tổng quan module →</Link></p>
                      </div>
                    )}
                  </details>
                );
              })}
            </div>
          </section>

          {/* 4. Lối vào nhanh */}
          <section style={{ marginBottom: "3rem" }}>
            <div className="reader-eyebrow">Lối vào nhanh</div>
            <div className="home-quick">
              <Link href="/06-projects" className="reader-card"><strong>Project thực hành</strong><span>Dự án phân loại đầu tiên: 8 bước từ CSV đến mô hình.</span></Link>
              <Link href="/phong-van" className="reader-card"><strong>Ngân hàng phỏng vấn</strong><span>{questionCount} câu hỏi lý thuyết và tình huống.</span></Link>
              <Link href="/02-supervised-learning/supervised-algorithms" className="reader-card"><strong>Bản đồ thuật toán</strong><span>Biết bài toán rồi, thử mô hình nào trước.</span></Link>
            </div>
          </section>

          <footer style={{ color: "var(--r-muted)", fontSize: 14, borderTop: "1px solid var(--r-line)", paddingTop: "1.2rem" }}>
            Ghi chú tự học Machine Learning. Tiến độ lưu ngay trên trình duyệt này.
          </footer>
        </main>
      </div>
    </ReaderShell>
  );
}
