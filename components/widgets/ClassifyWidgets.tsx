"use client";

import React, { useMemo, useState } from "react";
import data from "./data/threshold.json";

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/* ---------- 1. Quét ngưỡng: điểm chạy trên đường ROC ---------- */
export function RocSweep() {
  const { scores, labels } = data.email;
  const [t, setT] = useState(0.5);
  const P = labels.filter(Boolean).length, N = labels.length - P;
  const at = (th: number) => {
    let tp = 0, fp = 0;
    scores.forEach((s, i) => { if (s >= th) { if (labels[i]) tp++; else fp++; } });
    return { tpr: tp / P, fpr: fp / N, tp, fp };
  };
  const ths = Array.from(new Set([1.01, ...scores, 0])).sort((a, b) => b - a);
  const pts = ths.map((th) => at(th));
  let auc = 0;
  for (let i = 1; i < pts.length; i++) auc += ((pts[i].fpr - pts[i - 1].fpr) * (pts[i].tpr + pts[i - 1].tpr)) / 2;
  let pairs = 0, win = 0;
  scores.forEach((sp, i) => { if (labels[i]) scores.forEach((sn, j) => { if (!labels[j]) { pairs++; if (sp > sn) win++; else if (sp === sn) win += 0.5; } }); });
  const cur = at(t);
  const S = 220, pad = 24;
  const sx = (v: number) => pad + v * (S - 2 * pad), sy = (v: number) => S - pad - v * (S - 2 * pad);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p.fpr)},${sy(p.tpr)}`).join(" ");
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thử: quét ngưỡng trên 10 email</div>
      <label className="w-slider"><span>Ngưỡng = <strong>{t.toFixed(2)}</strong></span>
        <input type="range" min={0} max={1} step={0.05} value={t} onChange={(e) => setT(parseFloat(e.target.value))} /></label>
      <div className="w-strip">
        {scores.map((s, i) => (
          <span key={i} className={`w-chip ${s >= t ? "pred" : ""} ${labels[i] ? "pos" : "neg"}`}><b>{s.toFixed(2)}</b><small>{labels[i] ? "spam" : "không"}</small></span>
        ))}
      </div>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${S} ${S}`} width="100%" role="img" aria-label="Đường ROC">
          <rect x={pad} y={pad} width={S - 2 * pad} height={S - 2 * pad} fill="none" stroke="var(--r-line)" />
          <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="var(--r-line)" strokeDasharray="4 4" />
          <path d={d} fill="none" stroke="var(--r-muted)" strokeWidth={2} />
          <circle cx={sx(cur.fpr)} cy={sy(cur.tpr)} r={6} fill="var(--r-accent)" />
          <text x={S / 2} y={S - 4} textAnchor="middle" fontSize="10" fill="var(--r-muted)">FPR (báo nhầm)</text>
          <text x={8} y={S / 2} fontSize="10" fill="var(--r-muted)" transform={`rotate(-90 8 ${S / 2})`} textAnchor="middle">TPR (recall)</text>
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div><span>TPR (recall)</span><b>{(cur.tpr * 100).toFixed(0)}%</b><small>{cur.tp} / {P} spam</small></div>
          <div><span>FPR</span><b>{(cur.fpr * 100).toFixed(0)}%</b><small>{cur.fp} / {N} email thường</small></div>
          <div><span>AUC (diện tích)</span><b>{auc.toFixed(3)}</b></div>
          <div><span>Xác suất xếp đúng cặp</span><b>{(win / pairs).toFixed(3)}</b><small>{win} / {pairs} cặp</small></div>
        </div>
      </div>
      <p className="w-note">Mỗi ngưỡng cho một điểm (FPR, TPR); đường ROC nối mọi điểm khi quét ngưỡng từ cao xuống thấp. AUC bằng xác suất model xếp một email spam cao hơn một email thường.</p>
    </div>
  );
}

/* ---------- 2. Logistic: sigmoid, trọng số, ngưỡng ---------- */
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const PASS = [0, 0, 0, 0, 1, 0, 1, 1, 1, 1];

export function LogisticPlay() {
  const [w, setW] = useState(1.2);
  const [b, setB] = useState(-6);
  const [t, setT] = useState(0.5);
  const probs = HOURS.map((h) => sigmoid(w * h + b));
  let tp = 0, fp = 0, fn = 0, tn = 0;
  probs.forEach((p, i) => { const pr = p >= t; if (pr && PASS[i]) tp++; else if (pr) fp++; else if (PASS[i]) fn++; else tn++; });
  const W = 320, H = 190, pad = 26;
  const sx = (x: number) => pad + ((x - 0) / 11) * (W - 2 * pad), sy = (y: number) => H - pad - y * (H - 2 * pad);
  const path = Array.from({ length: 111 }, (_, i) => { const x = i / 10; return `${i ? "L" : "M"}${sx(x)},${sy(sigmoid(w * x + b))}`; }).join(" ");
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thử: giờ học → xác suất đậu</div>
      <label className="w-slider"><span>Trọng số w = <strong>{w.toFixed(2)}</strong> (độ dốc)</span>
        <input type="range" min={0} max={3} step={0.05} value={w} onChange={(e) => setW(parseFloat(e.target.value))} /></label>
      <label className="w-slider"><span>Hệ số chặn b = <strong>{b.toFixed(1)}</strong> (dịch đường sang trái/phải)</span>
        <input type="range" min={-15} max={3} step={0.1} value={b} onChange={(e) => setB(parseFloat(e.target.value))} /></label>
      <label className="w-slider"><span>Ngưỡng = <strong>{t.toFixed(2)}</strong></span>
        <input type="range" min={0.05} max={0.95} step={0.05} value={t} onChange={(e) => setT(parseFloat(e.target.value))} /></label>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Đường sigmoid">
          <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--r-line)" />
          <line x1={pad} y1={sy(t)} x2={W - pad} y2={sy(t)} stroke="var(--r-accent)" strokeDasharray="4 4" />
          <path d={path} fill="none" stroke="var(--r-accent)" strokeWidth={2} />
          {HOURS.map((h, i) => <circle key={i} cx={sx(h)} cy={sy(PASS[i])} r={5} fill={PASS[i] ? "var(--r-ok)" : "var(--r-muted)"} />)}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--r-muted)">số giờ học</text>
        </svg>
        <div className="w-metrics">
          <div><span>Đoán đậu khi p ≥ ngưỡng</span><b>{probs.filter((p) => p >= t).length}/10</b></div>
          <div><span>Điểm p = 0.5 tại</span><b>{w > 0 ? (-b / w).toFixed(1) : "—"} giờ</b></div>
          <div><span>Precision</span><b>{tp + fp ? ((tp / (tp + fp)) * 100).toFixed(0) + "%" : "—"}</b></div>
          <div><span>Recall</span><b>{tp + fn ? ((tp / (tp + fn)) * 100).toFixed(0) + "%" : "—"}</b></div>
        </div>
      </div>
      <p className="w-note">Chấm xanh là sinh viên đậu, xám là rớt. Đường cong là p = sigmoid(w·giờ + b). Kéo b để dịch điểm chuyển, kéo w để làm đường dốc hơn, kéo ngưỡng để đổi precision và recall.</p>
    </div>
  );
}

/* ---------- 3. SVM: đường nào có lề rộng nhất? ---------- */
const A: [number, number][] = [[1, 2], [1.5, 3.5], [2, 1.5], [2.5, 3], [1, 4], [2.2, 2.2]];
const B: [number, number][] = [[5, 4.5], [5.5, 3], [6, 5.5], [4.8, 2.5], [6.2, 3.8], [5.2, 5.2]];

export function SvmMargin() {
  const [theta, setTheta] = useState(10);
  const [c, setC] = useState(0);
  const calc = (th: number, off: number) => {
    const a = (th * Math.PI) / 180, nx = Math.cos(a), ny = Math.sin(a);
    const mid = ((3.2 * nx + 3.2 * ny)); // điểm giữa hai cụm xấp xỉ
    const sa = A.map(([x, y]) => nx * x + ny * y - mid - off);
    const sb = B.map(([x, y]) => nx * x + ny * y - mid - off);
    const ok = sa.every((v) => v < 0) && sb.every((v) => v > 0);
    const margin = ok ? Math.min(...sa.map((v) => -v), ...sb) : 0;
    return { nx, ny, mid: mid + off, ok, margin, sa, sb };
  };
  const cur = calc(theta, c);
  const best = useMemo(() => {
    let r = { th: 0, off: 0, m: -1 };
    for (let th = -80; th <= 80; th += 1) for (let off = -2; off <= 2; off += 0.05) {
      const q = calc(th, off); if (q.ok && q.margin > r.m) r = { th, off, m: q.margin };
    }
    return r;
  }, []);
  const W = 320, H = 220, pad = 20;
  const sx = (x: number) => pad + (x / 7.5) * (W - 2 * pad), sy = (y: number) => H - pad - (y / 6.5) * (H - 2 * pad);
  const line = (k: number) => {
    // n·p = mid + k ; hai đầu theo x
    const pts: [number, number][] = [];
    [0, 7.5].forEach((x) => { const y = ((cur.mid + k) - cur.nx * x) / (cur.ny || 1e-9); pts.push([x, y]); });
    return pts;
  };
  const l0 = line(0), lp = line(cur.margin), lm = line(-cur.margin);
  const isSv = (v: number) => cur.ok && Math.abs(Math.abs(v) - cur.margin) < 1e-6;
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: tìm đường có lề rộng nhất</span>
        <button type="button" className="reader-btn" onClick={() => { setTheta(best.th); setC(+best.off.toFixed(2)); }}>Đặt về lề rộng nhất</button>
      </div>
      <label className="w-slider"><span>Góc của đường: <strong>{theta}°</strong></span>
        <input type="range" min={-80} max={80} step={1} value={theta} onChange={(e) => setTheta(parseInt(e.target.value, 10))} /></label>
      <label className="w-slider"><span>Dịch đường: <strong>{c.toFixed(2)}</strong></span>
        <input type="range" min={-2} max={2} step={0.05} value={c} onChange={(e) => setC(parseFloat(e.target.value))} /></label>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Đường phân tách và lề">
          <line x1={sx(l0[0][0])} y1={sy(l0[0][1])} x2={sx(l0[1][0])} y2={sy(l0[1][1])} stroke={cur.ok ? "var(--r-accent)" : "var(--r-muted)"} strokeWidth={2} />
          {cur.ok && [lp, lm].map((l, i) => <line key={i} x1={sx(l[0][0])} y1={sy(l[0][1])} x2={sx(l[1][0])} y2={sy(l[1][1])} stroke="var(--r-accent)" strokeDasharray="4 4" opacity={0.7} />)}
          {A.map(([x, y], i) => <circle key={`a${i}`} cx={sx(x)} cy={sy(y)} r={isSv(cur.sa[i]) ? 8 : 5} fill="var(--r-muted)" stroke={isSv(cur.sa[i]) ? "var(--r-accent)" : "none"} strokeWidth={2} />)}
          {B.map(([x, y], i) => <rect key={`b${i}`} x={sx(x) - 5} y={sy(y) - 5} width={10} height={10} fill="var(--r-ok)" stroke={isSv(cur.sb[i]) ? "var(--r-accent)" : "none"} strokeWidth={2} />)}
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>Tách đúng hai lớp?</span><b>{cur.ok ? "Có" : "Chưa"}</b></div>
          <div><span>Độ rộng lề (mỗi bên)</span><b>{cur.ok ? cur.margin.toFixed(2) : "—"}</b><small>lớn nhất có thể: {best.m.toFixed(2)}</small></div>
        </div>
      </div>
      <p className="w-note">Nhiều đường cùng tách đúng; SVM chọn đường có lề rộng nhất. Điểm viền đỏ là support vector: chỉ những điểm này quyết định đường, các điểm xa hơn có thể bỏ đi mà đường không đổi.</p>
    </div>
  );
}

/* ---------- 4. Resample: mất cân bằng ---------- */
function rng(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
const MAJ: [number, number][] = (() => { const r = rng(7); return Array.from({ length: 36 }, () => [r() * 6 + 0.5, r() * 6 + 0.5] as [number, number]); })();
const MIN: [number, number][] = (() => { const r = rng(11); return Array.from({ length: 6 }, () => [r() * 2 + 5, r() * 2 + 4.5] as [number, number]); })();

export function Resample() {
  const [mode, setMode] = useState<"orig" | "over" | "smote" | "under">("orig");
  const view = useMemo(() => {
    const r = rng(3);
    let maj = MAJ, mn = MIN, extra: [number, number][] = [];
    if (mode === "over") extra = Array.from({ length: MAJ.length - MIN.length }, () => MIN[Math.floor(r() * MIN.length)]);
    if (mode === "smote") extra = Array.from({ length: MAJ.length - MIN.length }, () => {
      const a = MIN[Math.floor(r() * MIN.length)];
      const d = MIN.map((p) => ({ p, d: Math.hypot(p[0] - a[0], p[1] - a[1]) })).sort((x, y) => x.d - y.d).slice(1, 4);
      const nb = d[Math.floor(r() * d.length)].p; const k = r();
      return [a[0] + k * (nb[0] - a[0]), a[1] + k * (nb[1] - a[1])] as [number, number];
    });
    if (mode === "under") maj = [...MAJ].sort(() => r() - 0.5).slice(0, MIN.length);
    return { maj, mn, extra };
  }, [mode]);
  const W = 320, H = 230, pad = 16;
  const sx = (x: number) => pad + (x / 7.5) * (W - 2 * pad), sy = (y: number) => H - pad - (y / 7.5) * (H - 2 * pad);
  const label: Record<string, string> = { orig: "Dữ liệu gốc", over: "Nhân bản ngẫu nhiên", smote: "SMOTE (nội suy)", under: "Bỏ bớt lớp đông" };
  const jitter = (i: number) => ((i * 37) % 7) / 40 - 0.08;
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: cân bằng hai lớp</span>
        <span className="w-seg">
          {(["orig", "over", "smote", "under"] as const).map((m) => <button key={m} type="button" className={mode === m ? "on" : ""} onClick={() => setMode(m)}>{label[m]}</button>)}
        </span>
      </div>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Hai lớp mất cân bằng">
          <rect x={pad} y={pad} width={W - 2 * pad} height={H - 2 * pad} fill="none" stroke="var(--r-line)" />
          {view.maj.map(([x, y], i) => <circle key={`m${i}`} cx={sx(x)} cy={sy(y)} r={4} fill="var(--r-muted)" opacity={0.8} />)}
          {view.mn.map(([x, y], i) => <rect key={`n${i}`} x={sx(x) - 5} y={sy(y) - 5} width={10} height={10} fill="var(--r-accent)" />)}
          {view.extra.map(([x, y], i) => <rect key={`e${i}`} x={sx(x + (mode === "over" ? jitter(i) : 0)) - 4} y={sy(y + (mode === "over" ? jitter(i + 3) : 0)) - 4} width={8} height={8} fill="none" stroke="var(--r-accent)" strokeWidth={1.5} />)}
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>Lớp đông (chấm xám)</span><b>{view.maj.length}</b></div>
          <div><span>Lớp hiếm (ô vuông đỏ)</span><b>{view.mn.length + view.extra.length}</b><small>{view.extra.length ? `gồm ${view.extra.length} mẫu thêm (ô rỗng)` : "chỉ mẫu thật"}</small></div>
        </div>
      </div>
      <p className="w-note">
        {mode === "orig" && "Lớp hiếm chỉ có 6 mẫu so với 36: model dễ đoán toàn lớp đông."}
        {mode === "over" && "Nhân bản: thêm bản sao của mẫu thật (vẽ lệch nhẹ để thấy). Không có thông tin mới."}
        {mode === "smote" && "SMOTE: tạo mẫu mới trên đoạn nối hai mẫu hiếm gần nhau. Có điểm mới, nhưng chỉ nội suy trong vùng đã có."}
        {mode === "under" && "Bỏ bớt: hai lớp bằng nhau nhưng mất đi phần lớn dữ liệu lớp đông."}
        {" "}Quy tắc vàng: chỉ cân bằng trên tập train, không bao giờ trên validation hoặc test.
      </p>
    </div>
  );
}
