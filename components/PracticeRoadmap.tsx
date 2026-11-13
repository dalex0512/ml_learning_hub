"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Flag } from "lucide-react";
import { practiceStorageKey, type PracticeStep } from "@/lib/practice";

export interface PracticePart {
  topicId: string;
  label: string;
  title: string;
  description: string;
  steps: PracticeStep[];
}

export default function PracticeRoadmap({ moduleId, parts }: { moduleId: string; parts: PracticePart[] }) {
  const [done, setDone] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const next: Record<string, string[]> = {};
    for (const p of parts) {
      try {
        const raw = localStorage.getItem(practiceStorageKey(p.topicId));
        next[p.topicId] = raw ? JSON.parse(raw) : [];
      } catch {
        next[p.topicId] = [];
      }
    }
    setDone(next);
  }, [parts]);

  const all = parts.flatMap((p) => p.steps.map((s) => ({ part: p, step: s })));
  const doneCount = all.filter(({ part, step }) => done[part.topicId]?.includes(step.id)).length;
  const firstTodo = all.find(({ part, step }) => !done[part.topicId]?.includes(step.id)) ?? all[0];

  return (
    <div className="mt-8">
      <div className="paper-card p-5 sm:p-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="min-w-[220px] flex-1">
          <div className="text-sm font-semibold text-text-main">Tiến độ của bạn: {doneCount}/{all.length} bước</div>
          <div className="h-2 rounded-full bg-[#EADFC0] mt-2 overflow-hidden">
            <div className="h-full bg-accent-red transition-all" style={{ width: `${(doneCount / all.length) * 100}%` }} />
          </div>
        </div>
        {firstTodo && (
          <Link
            href={`/${moduleId}/${firstTodo.part.topicId}#${firstTodo.step.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-dark text-panel text-sm font-semibold hover:bg-black"
          >
            {doneCount ? "Tiếp tục học" : "Bắt đầu"} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="mt-8 space-y-10">
        {parts.map((part) => (
          <section key={part.topicId}>
            <div className="mb-4">
              <span className="font-hand text-accent-red text-xl font-bold">{part.label}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-main">{part.title}</h2>
              <p className="text-sm text-text-muted mt-1 max-w-2xl">{part.description}</p>
            </div>
            <ol className="relative">
              {part.steps.map((s, i) => {
                const d = done[part.topicId]?.includes(s.id);
                const last = i === part.steps.length - 1;
                return (
                  <li key={s.id} className="relative pl-14 pb-4">
                    {!last && <span className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-paper-dashed-dark/60" aria-hidden />}
                    <span
                      className={`absolute left-0 top-1 w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        d ? "bg-[#4E7A2B] border-[#4E7A2B] text-white" : "bg-white border-paper-dashed-dark text-text-main"
                      }`}
                    >
                      {d ? <Check className="w-5 h-5" /> : s.n ?? <Flag className="w-4 h-4" />}
                    </span>
                    <Link
                      href={`/${moduleId}/${part.topicId}#${s.id}`}
                      className="block rounded-xl border border-paper-dashed bg-panel px-4 py-3 hover:border-accent-red hover:bg-sticky/50 transition-colors"
                    >
                      <div className="font-semibold text-text-main">{s.label}</div>
                      {s.goal && <div className="text-sm text-text-muted mt-0.5 leading-relaxed">{s.goal}</div>}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
