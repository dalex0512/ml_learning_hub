import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllFlattenedTopics } from "./roadmap";
import { parseBlocks, parseRange, slugify, type Block } from "./blocks";

export interface SectionContent {
  id: string;
  number: number; // chỉ có nghĩa với bài cũ (heading "1. …")
  numbered: boolean;
  title: string;
  rawContent: string;
  blocks: Block[];
}

export interface TopicData {
  title: string;
  order: number;
  moduleId: string;
  topicId: string;
  description: string | null;
  slides: { from: number; to: number } | null;
  needs: string[];
  tags: string[];
  /** true nếu bài còn theo khung 6 mục đánh số cũ */
  legacy: boolean;
  sections: SectionContent[];
}

export interface BacklinkItem {
  moduleId: string;
  topicId: string;
  title: string;
}

const LEGACY_IDS: Record<number, string> = {
  1: "y-tuong",
  2: "vi-tri-pipeline",
  3: "cong-thuc",
  4: "vi-du-tay",
  5: "code",
  6: "cau-hoi-kiem-tra",
};

/** Tách theo heading `## ` nhưng bỏ qua dòng nằm trong code fence. */
function splitSections(content: string): { heading: string; body: string }[] {
  const out: { heading: string; body: string[] }[] = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const m = !inFence ? line.match(/^##\s+(.*)$/) : null;
    if (m) {
      out.push({ heading: m[1].trim(), body: [] });
    } else if (out.length) {
      out[out.length - 1].body.push(line);
    }
  }
  return out.map((s) => ({ heading: s.heading, body: s.body.join("\n").trim() }));
}

function lessonIndex() {
  const map = new Map<string, { href: string; title: string }>();
  for (const { module, topic } of getAllFlattenedTopics()) {
    map.set(topic.id, { href: `/${module.id}/${topic.id}`, title: topic.title });
  }
  return map;
}

/**
 * Đổi cú pháp liên kết ngắn thành HTML chip:
 *   [[bài:loss-function]]        -> link tới bài (tiêu đề tự lấy từ roadmap)
 *   [[bài:loss-function|chữ]]    -> link với chữ tùy chọn
 *   [[slide:50]] / [[slide:48-51]] -> nút mở slide
 */
function expandLinks(src: string, index: ReturnType<typeof lessonIndex>): string {
  return src
    .replace(/\[\[bài:([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_m, id: string, label?: string) => {
      const hit = index.get(id);
      if (!hit) return `**${label ?? id}**`;
      const text = (label ?? hit.title).replace(/</g, "&lt;");
      return `<a class="lesson-chip" href="${hit.href}">${text}</a>`;
    })
    .replace(/\[\[slide:(\d+)(?:\s*[-–]\s*(\d+))?\]\]/g, (_m, a: string, b?: string) => {
      const label = b ? `Slide ${a}–${b}` : `Slide ${a}`;
      return `<button type="button" class="slide-chip" data-slide="${a}" data-to="${b ?? a}">${label}</button>`;
    });
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v.trim()) return v.split(",").map((s) => s.trim());
  return [];
}

export function getTopicContent(moduleId: string, filename: string, topicId: string): TopicData | null {
  const filePath = path.join(process.cwd(), "content", moduleId, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
  const index = lessonIndex();
  const parts = splitSections(content);
  const legacy = parts.length > 0 && parts.every((p) => /^\d+\.\s/.test(p.heading));

  const used = new Set<string>();
  const sections: SectionContent[] = parts.map((p, i) => {
    const numMatch = p.heading.match(/^(\d+)\.\s/);
    const number = numMatch ? parseInt(numMatch[1], 10) : i + 1;
    let id = legacy ? LEGACY_IDS[number] ?? `section-${number}` : slugify(p.heading) || `muc-${i + 1}`;
    while (used.has(id)) id += "-b";
    used.add(id);

    const raw = expandLinks(p.body, index);
    return {
      id,
      number,
      numbered: legacy,
      title: p.heading,
      rawContent: raw,
      blocks: parseBlocks(raw),
    };
  });

  const slides =
    data.slides !== undefined && data.slides !== null
      ? parseRange(Array.isArray(data.slides) ? `${data.slides[0]}-${data.slides[data.slides.length - 1]}` : String(data.slides))
      : null;

  return {
    title: data.title || "Topic",
    order: data.order || 1,
    moduleId,
    topicId,
    description: typeof data.description === "string" ? data.description : null,
    slides,
    needs: toStringArray(data.needs),
    tags: toStringArray(data.tags),
    legacy,
    sections,
  };
}

/** Các bài khác có nhắc tới `topicId` bằng `[[bài:topicId]]` hoặc khai báo needs. */
export function getBacklinks(topicId: string): BacklinkItem[] {
  const result: BacklinkItem[] = [];
  for (const { module, topic } of getAllFlattenedTopics()) {
    if (topic.id === topicId) continue;
    const fp = path.join(process.cwd(), "content", module.id, topic.file);
    if (!fs.existsSync(fp)) continue;
    const { data, content } = matter(fs.readFileSync(fp, "utf-8"));
    const hit =
      content.includes(`[[bài:${topicId}`) || toStringArray(data.needs).includes(topicId);
    if (hit) result.push({ moduleId: module.id, topicId: topic.id, title: topic.title });
  }
  return result;
}

export function getLessonLookup(ids: string[]): { moduleId: string; topicId: string; title: string }[] {
  const flat = getAllFlattenedTopics();
  return ids
    .map((id) => flat.find((f) => f.topic.id === id))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .map((x) => ({ moduleId: x.module.id, topicId: x.topic.id, title: x.topic.title }));
}
