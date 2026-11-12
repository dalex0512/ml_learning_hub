import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Item {
  moduleId: string;
  topicId: string;
  title: string;
}

interface Props {
  needs: Item[];
  prev: Item | null;
  current: string;
  next: Item | null;
  backlinks: Item[];
}

const chip =
  "inline-block px-2.5 py-1 rounded-md border border-paper-border bg-panel text-xs text-text-main hover:bg-sticky transition-colors";

/** Bản đồ vị trí bài: tiền đề → bài này → bài sau, và bài nào dùng lại bài này. */
export default function LessonMap({ needs, prev, current, next, backlinks }: Props) {
  const before = needs.length ? needs : prev ? [prev] : [];
  return (
    <div className="rounded-lg border border-dashed border-paper-dashed-dark bg-sticky/50 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-hand text-accent-red text-base mr-1">Bạn đang ở đây:</span>
        {before.map((b) => (
          <React.Fragment key={b.topicId}>
            <Link href={`/${b.moduleId}/${b.topicId}`} className={chip}>
              {b.title}
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-text-sub" />
          </React.Fragment>
        ))}
        <span className="px-2.5 py-1 rounded-md bg-accent-dark text-panel text-xs font-semibold">{current}</span>
        {next && (
          <>
            <ArrowRight className="w-3.5 h-3.5 text-text-sub" />
            <Link href={`/${next.moduleId}/${next.topicId}`} className={chip}>
              {next.title}
            </Link>
          </>
        )}
      </div>
      {backlinks.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-text-muted">
          <span>Được dùng lại ở:</span>
          {backlinks.map((b) => (
            <Link
              key={b.topicId}
              href={`/${b.moduleId}/${b.topicId}`}
              className="underline decoration-dashed underline-offset-4 hover:text-accent-red"
            >
              {b.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
