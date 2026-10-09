import { Marked, type Token, type Tokens } from "marked";

const NOTE_RE = /^<!--\s*note:\s*([\s\S]*?)\s*-->\s*$/;
const EN_LABEL_RE = /^\*\*EN\s*:\*\*/;
const ANSWER_LABEL_RE = /^\*\*(Đáp án|A)\s*:\*\*/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function createRenderer(opts: { copyButtons?: boolean } = {}) {
  const instance = new Marked();
  instance.use({
    renderer: {
      // `<!-- note: ... -->` được đọc riêng ở phần Công thức, không in ra HTML
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return NOTE_RE.test(text.trim()) ? "" : text;
      },
      // Phân loại blockquote theo nhãn đầu tiên: EN / Đáp án
      blockquote({ tokens }: Tokens.Blockquote) {
        const first = tokens[0];
        const head = first && first.type === "paragraph" ? first.raw.trim() : "";
        let inner = this.parser.parse(tokens);

        if (EN_LABEL_RE.test(head)) {
          inner = inner.replace(
            /<strong>EN\s*:<\/strong>/,
            '<span class="en-badge">EN</span>'
          );
          return `<blockquote class="en-block">${inner}</blockquote>\n`;
        }
        if (ANSWER_LABEL_RE.test(head)) {
          return `<blockquote class="answer-block">${inner}</blockquote>\n`;
        }
        return `<blockquote>${inner}</blockquote>\n`;
      },
      code({ text, lang }: Tokens.Code) {
        const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
        const pre = `<pre><code${cls}>${escapeHtml(text)}</code></pre>`;
        if (!opts.copyButtons) return pre + "\n";
        return (
          `<div class="code-block">` +
          `<button type="button" class="code-copy-btn" aria-label="Sao chép code">Sao chép</button>` +
          pre +
          `</div>\n`
        );
      },
    },
  });
  return instance;
}

export function renderMarkdown(src: string, opts: { copyButtons?: boolean } = {}) {
  return createRenderer(opts).parse(src) as string;
}

export interface FormulaGroup {
  name: string;
  subtitleHtml: string;
  code: string;
  note: string | null;
  restHtml: string;
}

export interface FormulaLayout {
  introHtml: string;
  groups: FormulaGroup[];
}

/**
 * Tách phần 3 thành các công thức. Mỗi công thức = 1 đoạn mở đầu bằng chữ
 * in đậm (tên) + 1 code block, tùy chọn có `<!-- note: ... -->` ngay sau code.
 * Trả về null nếu có ít hơn 2 công thức (giữ layout 1 cột).
 */
export function parseFormulaLayout(src: string): FormulaLayout | null {
  const r = createRenderer();
  const tokens = r.lexer(src);

  const isNameToken = (t: Token | undefined, next: Token | undefined) =>
    !!t &&
    t.type === "paragraph" &&
    /^\*\*[^*]+\*\*/.test(t.raw.trim()) &&
    !!next &&
    next.type === "code";

  const starts: number[] = [];
  tokens.forEach((t, i) => {
    if (isNameToken(t, tokens[i + 1])) starts.push(i);
  });
  if (starts.length < 2) return null;

  const render = (ts: Token[]) => r.parser(ts as Token[]) as string;
  const introHtml = render(tokens.slice(0, starts[0]));

  const groups: FormulaGroup[] = starts.map((s, gi) => {
    const end = gi + 1 < starts.length ? starts[gi + 1] : tokens.length;
    const para = tokens[s] as Tokens.Paragraph;
    const codeTok = tokens[s + 1] as Tokens.Code;

    const m = para.raw.trim().match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
    const name = m ? m[1].trim() : para.raw.trim();
    const subtitle = m ? m[2].trim().replace(/:$/, "") : "";

    let cursor = s + 2;
    let note: string | null = null;
    const maybeNote = tokens[cursor];
    if (maybeNote && maybeNote.type === "html") {
      const nm = (maybeNote as Tokens.HTML).text.trim().match(NOTE_RE);
      if (nm) {
        note = nm[1];
        cursor++;
      }
    }

    return {
      name,
      subtitleHtml: subtitle ? (r.parseInline(subtitle) as string) : "",
      code: codeTok.text,
      note,
      restHtml: render(tokens.slice(cursor, end)),
    };
  });

  return { introHtml, groups };
}
