/**
 * Parser thuần (không dùng fs) cho cú pháp container của bài học:
 *
 *   :::tên tham-số
 *   nội dung markdown
 *   :::
 *
 * Tên hợp lệ: intro, worked, compare, pitfall, recap, next, note, formula,
 * slides, quiz. Container không lồng nhau; code fence bên trong được tôn trọng.
 */

export type BoxKind =
  | "intro"
  | "worked"
  | "compare"
  | "pitfall"
  | "recap"
  | "next"
  | "note"
  | "goal"
  | "learn"
  | "code"
  | "see"
  | "en"
  | "check"
  | "ask"
  | "out"
  | "more";

export interface QuizItem {
  q: string;
  a: string;
  en?: string;
  want?: string;
}

export interface QuizTier {
  key: string; // "A" | "B" | "C"
  title: string;
  items: QuizItem[];
}

export type Block =
  | { type: "md"; md: string }
  | { type: "box"; kind: BoxKind; title: string; md: string }
  | { type: "formula"; md: string }
  | { type: "slides"; from: number; to: number; caption: string }
  | { type: "quiz"; tiers: QuizTier[] }
  | { type: "exercise"; level: string; title: string; prompt: string; answer: string };

const BOX_KINDS: BoxKind[] = [
  "intro", "worked", "compare", "pitfall", "recap", "next", "note",
  "goal", "learn", "code", "see", "en", "check", "ask", "out", "more",
];

const FENCE_RE = /^\s*(```|~~~)/;
const OPEN_RE = /^:::([a-z]+)\s*(.*)$/;

export function parseRange(s: string): { from: number; to: number } | null {
  const m = s.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?/);
  if (!m) return null;
  const from = parseInt(m[1], 10);
  const to = m[2] ? parseInt(m[2], 10) : from;
  return { from: Math.min(from, to), to: Math.max(from, to) };
}

function parseQuiz(body: string): QuizTier[] {
  const tiers: QuizTier[] = [];
  let tier: QuizTier | null = null;
  let item: QuizItem | null = null;
  let field: "q" | "a" | "en" | "want" | null = null;
  let inFence = false;

  const push = (f: "q" | "a" | "en" | "want", text: string) => {
    if (!item) return;
    const cur = (item[f] as string | undefined) ?? "";
    item[f] = cur ? cur + "\n" + text : text;
  };

  for (const line of body.split("\n")) {
    if (FENCE_RE.test(line)) inFence = !inFence;
    if (!inFence) {
      const t = line.match(/^@tier\s+([A-Za-z])\s*\|\s*(.+)$/);
      if (t) {
        tier = { key: t[1].toUpperCase(), title: t[2].trim(), items: [] };
        tiers.push(tier);
        item = null;
        field = null;
        continue;
      }
      const m = line.match(/^(Q|A|EN|WANT):\s?(.*)$/);
      if (m && tier) {
        const f = m[1].toLowerCase() as "q" | "a" | "en" | "want";
        if (f === "q") {
          item = { q: "", a: "" };
          tier.items.push(item);
        }
        field = f;
        push(f, m[2]);
        continue;
      }
    }
    if (field) push(field, line);
  }
  for (const t of tiers) {
    for (const it of t.items) {
      it.q = it.q.trim();
      it.a = it.a.trim();
      if (it.en) it.en = it.en.trim();
      if (it.want) it.want = it.want.trim();
    }
  }
  return tiers;
}

export function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  let md: string[] = [];
  let inFence = false;

  const flush = () => {
    const text = md.join("\n").trim();
    if (text) blocks.push({ type: "md", md: text });
    md = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (FENCE_RE.test(line)) inFence = !inFence;

    const open = !inFence ? line.match(OPEN_RE) : null;
    if (!open) {
      md.push(line);
      continue;
    }

    // gom thân container tới dòng ":::" đóng
    const name = open[1];
    const arg = open[2].trim();
    const body: string[] = [];
    let fence = false;
    let j = i + 1;
    for (; j < lines.length; j++) {
      if (FENCE_RE.test(lines[j])) fence = !fence;
      if (!fence && /^:::\s*$/.test(lines[j])) break;
      body.push(lines[j]);
    }
    const bodyText = body.join("\n").trim();
    i = j; // nhảy qua dòng đóng

    flush();
    if (name === "slides") {
      const [rangePart, ...cap] = arg.split("|");
      const r = parseRange(rangePart ?? "");
      if (r) blocks.push({ type: "slides", from: r.from, to: r.to, caption: (cap.join("|") || bodyText).trim() });
    } else if (name === "quiz") {
      blocks.push({ type: "quiz", tiers: parseQuiz(bodyText) });
    } else if (name === "ex") {
      // :::ex ★ Tiêu đề  —  đề, rồi dòng "@answer", rồi đáp án
      const m = arg.match(/^(★+)?\s*\|?\s*(.*)$/);
      const at = bodyText.search(/^@answer\s*$/m);
      const prompt = (at >= 0 ? bodyText.slice(0, at) : bodyText).trim();
      const answer = at >= 0 ? bodyText.slice(at).replace(/^@answer\s*/, "").trim() : "";
      blocks.push({ type: "exercise", level: m?.[1] ?? "", title: m?.[2] ?? "", prompt, answer });
    } else if (name === "formula") {
      blocks.push({ type: "formula", md: bodyText });
    } else if ((BOX_KINDS as string[]).includes(name)) {
      blocks.push({ type: "box", kind: name as BoxKind, title: arg, md: bodyText });
    } else {
      // container lạ: giữ nguyên như markdown thường để không mất nội dung
      blocks.push({ type: "md", md: bodyText });
    }
  }
  flush();
  return blocks;
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
