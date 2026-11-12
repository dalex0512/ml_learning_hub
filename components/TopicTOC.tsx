"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface SectionItem {
  id: string;
  label: string;
}

interface Props {
  sections: { id: string; title: string }[];
}

export default function TopicTOC({ sections: customSections }: Props) {
  const sections: SectionItem[] = useMemo(() => customSections.map(s => ({ id: s.id, label: s.title })), [customSections]);

  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const active = container?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!container || !active) return;
    const box = container.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.top < box.top) container.scrollTop -= box.top - item.top;
    else if (item.bottom > box.bottom) container.scrollTop += item.bottom - box.bottom;
  }, [activeId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.getBoundingClientRect().top + window.scrollY <= scrollPosition) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <aside className="w-[190px] shrink-0 self-stretch hidden md:block">
      <div ref={containerRef} className="sticky top-28 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
        {/* TOC Header Note */}
        <div className="px-2">
          <div className="flex items-center gap-1.5 font-hand text-accent-red text-base font-bold">
            <span>✎</span>
            <span>Mục lục · {sections.length} phần</span>
          </div>
          <p className="text-[11px] text-text-sub">Bấm để nhảy tới phần</p>
        </div>

        {/* Section Items */}
        <nav className="flex flex-col gap-1.5">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                aria-current={isActive ? "location" : undefined}
                onClick={() => scrollToSection(sec.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-start gap-2 border ${
                  isActive
                    ? "bg-sticky border-paper-border text-text-main shadow-xs font-semibold"
                    : "border-transparent text-text-muted hover:bg-panel/70 hover:text-text-main"
                }`}
              >
                {/* Red dot indicator when active */}
                <span
                  className={`w-2 h-2 mt-[5px] rounded-full shrink-0 transition-colors ${
                    isActive ? "bg-accent-red scale-110" : "bg-[#D8CDB3]"
                  }`}
                />
                <span className="min-w-0 leading-snug">
                  {sec.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Small notebook helper sticky note */}
        <div className="p-3 bg-sticky/70 rounded-lg border border-paper-border text-[11px] text-text-sub font-hand text-sm mt-4 transform -rotate-1">
          💡 "Đọc xong thử làm phần tự kiểm tra để nhớ lâu hơn!"
        </div>
      </div>
    </aside>
  );
}
