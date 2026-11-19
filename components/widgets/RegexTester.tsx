"use client";

import React, { useMemo, useState } from "react";

const PRESETS = [
  { name: "Số điện thoại", p: "\\d{3}-\\d{4}", t: "Gọi 555-1234 hoặc 555-9876 để đặt lịch." },
  { name: "Email", p: "[\\w.]+@[\\w.]+\\.\\w+", t: "Liên hệ an@mail.com hoặc binh.k@corp.vn nhé." },
  { name: "Thẻ HTML: greedy", p: "<.+>", t: "<b>đậm</b> và <i>nghiêng</i>" },
  { name: "Thẻ HTML: lazy", p: "<.+?>", t: "<b>đậm</b> và <i>nghiêng</i>" },
  { name: "Ngày YYYY-MM-DD", p: "\\d{4}-\\d{2}-\\d{2}", t: "Họp ngày 2024-11-19, hạn 2024-12-01." },
];

/** Thử pattern trên một chuỗi: phần khớp được tô sáng. Chạy bằng RegExp của JavaScript. */
export default function RegexTester() {
  const [p, setP] = useState(PRESETS[0].p);
  const [t, setT] = useState(PRESETS[0].t);
  const res = useMemo(() => {
    if (!p) return { err: "", parts: [{ s: t, hit: false }], n: 0 };
    try {
      const re = new RegExp(p, "g");
      const parts: { s: string; hit: boolean }[] = [];
      let last = 0, n = 0, m: RegExpExecArray | null;
      while ((m = re.exec(t)) !== null) {
        if (m[0] === "") { re.lastIndex++; continue; }
        if (m.index > last) parts.push({ s: t.slice(last, m.index), hit: false });
        parts.push({ s: m[0], hit: true });
        last = m.index + m[0].length; n++;
        if (n > 500) break;
      }
      if (last < t.length) parts.push({ s: t.slice(last), hit: false });
      return { err: "", parts, n };
    } catch (e) {
      return { err: (e as Error).message, parts: [{ s: t, hit: false }], n: 0 };
    }
  }, [p, t]);
  const field: React.CSSProperties = { width: "100%", marginTop: ".3rem", padding: ".45rem .6rem", font: "inherit", fontSize: 15, color: "var(--r-fg)", background: "var(--r-bg)", border: "1px solid var(--r-line)", borderRadius: 8, fontFamily: "var(--font-jetbrains-mono), monospace" };
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thử: pattern trên một chuỗi</div>
      <div className="w-seg" style={{ margin: ".6rem 0" }}>
        {PRESETS.map((x) => <button key={x.name} type="button" className={p === x.p && t === x.t ? "on" : ""} onClick={() => { setP(x.p); setT(x.t); }}>{x.name}</button>)}
      </div>
      <label style={{ fontSize: 14, fontWeight: 600 }}>Pattern<input value={p} onChange={(e) => setP(e.target.value)} style={field} spellCheck={false} /></label>
      <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginTop: ".6rem" }}>Chuỗi cần tìm<textarea value={t} onChange={(e) => setT(e.target.value)} rows={2} style={{ ...field, resize: "vertical" }} spellCheck={false} /></label>
      <div style={{ marginTop: ".8rem", padding: ".7rem 1rem", border: "1px solid var(--r-line)", borderRadius: 8, background: "var(--r-bg)", whiteSpace: "pre-wrap", lineHeight: 1.8, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 14.5 }}>
        {res.parts.map((x, i) => x.hit ? <mark key={i} style={{ background: "rgba(200,90,70,.35)", color: "var(--r-fg)", borderRadius: 3, padding: "0 1px" }}>{x.s}</mark> : <span key={i}>{x.s}</span>)}
      </div>
      <p className="w-note">{res.err ? `Pattern chưa hợp lệ: ${res.err}` : `${res.n} phần khớp (giống re.findall).`} Ô thử này chạy bằng engine RegExp của <strong>JavaScript</strong>, không phải của Python: cú pháp cơ bản giống nhau nhưng một số tính năng khác (ví dụ nhóm đặt tên Python dùng (?P&lt;tên&gt;...)). Luôn kiểm tra lại bằng module <code>re</code> trước khi dùng.</p>
    </div>
  );
}
