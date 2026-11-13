import type { SectionContent } from "./markdown";

export interface PracticeStep {
  id: string;
  /** Số bước (1, 2, …) hoặc null với mục tổng kết. */
  n: number | null;
  label: string;
  goal: string;
}

const STEP_RE = /^Bước\s+(\d+)\s*[—–:-]\s*(.*)$/;

export function parseStepTitle(title: string): { n: number | null; label: string } {
  const m = title.match(STEP_RE);
  return m ? { n: parseInt(m[1], 10), label: m[2].trim() } : { n: null, label: title };
}

/** Rút gọn markdown của khối :::goal thành một dòng chữ thuần để hiện trên lộ trình. */
function plain(md: string): string {
  return md
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[[^\]]+\]\]/g, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPracticeSteps(sections: SectionContent[]): PracticeStep[] {
  return sections.map((s) => {
    const { n, label } = parseStepTitle(s.title);
    const goal = s.blocks.find((b) => b.type === "box" && b.kind === "goal");
    return { id: s.id, n, label, goal: goal && goal.type === "box" ? plain(goal.md) : "" };
  });
}

export const practiceStorageKey = (topicId: string) => `ml-practice:${topicId}`;
