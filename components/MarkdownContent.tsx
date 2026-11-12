"use client";

import { useMemo, type MouseEvent } from "react";
import { renderMarkdown } from "@/lib/renderMarkdown";
import { openSlides } from "./SlideViewer";

export function handleMarkdownClick(e: MouseEvent<HTMLElement>) {
  const target = e.target as HTMLElement;
  const chip = target.closest<HTMLButtonElement>(".slide-chip");
  if (chip) {
    const from = Number(chip.dataset.slide);
    const to = Number(chip.dataset.to ?? from);
    if (Number.isInteger(from) && from > 0) openSlides({ from, to });
    return;
  }
  const button = target.closest<HTMLButtonElement>(".code-copy-btn");
  const code = button?.closest(".code-block")?.querySelector("code");
  if (!button || !code) return;
  navigator.clipboard.writeText(code.textContent ?? "").then(() => {
    button.textContent = "Đã chép!";
    window.setTimeout(() => { button.textContent = "Sao chép"; }, 2000);
  }).catch(() => { button.textContent = "Chưa chép được"; });
}

export default function MarkdownContent({ md, className = "" }: { md: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(md, { copyButtons: "lang" }), [md]);
  return <div className={`notebook-prose text-sm sm:text-[15px] ${className}`}
    onClick={handleMarkdownClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
