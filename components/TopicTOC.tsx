"use client";

import React, { useEffect, useState } from "react";

interface SectionItem {
  id: string;
  number: number;
  label: string;
}

const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "y-tuong", number: 1, label: "Ý tưởng" },
  { id: "vi-tri-pipeline", number: 2, label: "Vị trí trong pipeline" },
  { id: "cong-thuc", number: 3, label: "Cách hoạt động / Công thức" },
  { id: "vi-du-tay", number: 4, label: "Ví dụ tay" },
  { id: "code", number: 5, label: "Code Python" },
  { id: "cau-hoi-kiem-tra", number: 6, label: "Tự kiểm tra" },
];

interface Props {
  sections?: { id: string; number: number; title: string }[];
}

export default function TopicTOC({ sections: customSections }: Props) {
  const sections: SectionItem[] = customSections
    ? customSections.map((s) => ({
        id: s.id,
        number: s.number,
        label: s.title.replace(/^\d+\.\s*/, ""),
      }))
    : DEFAULT_SECTIONS;

  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "y-tuong");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
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
    <aside className="w-[190px] shrink-0 hidden md:block">
      <div className="sticky top-28 space-y-3">
        {/* TOC Header Note */}
        <div className="px-2">
          <div className="flex items-center gap-1.5 font-hand text-accent-red text-base font-bold">
            <span>✎</span>
            <span>Mục lục {sections.length} phần</span>
          </div>
          <p className="text-[11px] text-text-sub">Cấu trúc sổ tay cố định</p>
        </div>

        {/* Section Items */}
        <nav className="flex flex-col gap-1.5">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                  isActive
                    ? "bg-sticky border-paper-border text-text-main shadow-xs font-semibold"
                    : "border-transparent text-text-muted hover:bg-panel/70 hover:text-text-main"
                }`}
              >
                {/* Red dot indicator when active */}
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isActive ? "bg-accent-red scale-110" : "bg-[#D8CDB3]"
                  }`}
                />
                <span className="truncate">
                  {sec.number}. {sec.label}
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
