"use client";

import React, { useMemo, useState } from "react";
import data from "./data/insulin.json";

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const quantile = (v: number[], q: number) => { const s = [...v].sort((a, b) => a - b); const p = (s.length - 1) * q; const lo = Math.floor(p); return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (p - lo); };
const std0 = (v: number[]) => { const m = mean(v); return Math.sqrt(mean(v.map((x) => (x - m) ** 2))); };

type Fix = "zero" | "drop" | "mean" | "median";
const FIXES: { key: Fix; label: string }[] = [
  { key: "zero", label: "Giữ số 0" },
  { key: "drop", label: "Xóa hàng thiếu" },
  { key: "mean", label: "Điền mean" },
  { key: "median", label: "Điền median" },
];

export default function MissingOutlier({ props }: { props?: string }) {
  const mode = (props ?? "").trim() || "impute";
  return mode === "outlier" ? <OutlierPart /> : <ImputePart />;
}

function ImputePart() {
  const [fix, setFix] = useState<Fix>("zero");
  const raw = data.first20;
  const known = raw.filter((v) => v > 0);
  const m = mean(known), md = median(known);
  const out = useMemo(() => {
    if (fix === "zero") return raw;
    if (fix === "drop") return known;
    const fill = fix === "mean" ? m : md;
    return raw.map((v) => (v > 0 ? v : Math.round(fill)));
  }, [fix, raw, known, m, md]);
  const max = 850;
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: 20 bệnh nhân đầu, cột Insulin ({raw.length - known.length} ô bằng 0)</span>
        <span className="w-seg">{FIXES.map((f) => <button key={f.key} type="button" className={fix === f.key ? "on" : ""} onClick={() => setFix(f.key)}>{f.label}</button>)}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: ".8rem 0" }}>
        {out.map((v, i) => {
          const orig = fix === "drop" ? v : raw[i];
          const filled = fix !== "zero" && fix !== "drop" && orig === 0;
          return <span key={i} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", minWidth: 40 }}>
            <span style={{ width: 28, height: 56, display: "flex", alignItems: "flex-end" }}><span style={{ width: "100%", height: `${(v / max) * 100}%`, minHeight: v ? 2 : 0, background: filled ? "var(--r-ok)" : orig === 0 ? "var(--r-accent)" : "var(--r-muted)", borderRadius: 2 }} /></span>
            <small style={{ fontSize: 11, color: "var(--r-muted)" }}>{v}</small>
          </span>;
        })}
      </div>
      <div className="w-metrics" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div><span>Số giá trị</span><b>{out.length}</b></div>
        <div><span>Mean</span><b>{mean(out).toFixed(1)}</b></div>
        <div><span>Median</span><b>{median(out).toFixed(1)}</b></div>
        <div><span>Std</span><b>{std0(out).toFixed(1)}</b></div>
      </div>
      <p className="w-note">
        {fix === "zero" && "Giữ số 0 vô lý: mean và median bị kéo xuống rất thấp (median = 0), và phân phối có một cột sai ở 0."}
        {fix === "drop" && `Xóa mọi hàng có Insulin = 0 chỉ còn ${known.length} trên 20 bệnh nhân: mất hơn một nửa dữ liệu (cả các cột khác của họ).`}
        {fix === "mean" && `Điền mean của các giá trị đã biết (${m.toFixed(0)}): mean mới không đổi nhưng giá trị điền (xanh) lớn hơn phần đông người thật sự được đo, vì hai giá trị lớn (543 và 846) kéo mean lên.`}
        {fix === "median" && `Điền median của các giá trị đã biết (${md.toFixed(0)}): bền với hai giá trị lớn, giá trị điền nằm giữa phần đông. Median phải tính chỉ từ train.`}
      </p>
    </div>
  );
}

function OutlierPart() {
  const v = data.nonzero;
  const [k, setK] = useState(1.5);
  const [zt, setZt] = useState(3);
  const q1 = quantile(v, 0.25), q3 = quantile(v, 0.75), iqr = q3 - q1;
  const fence = q3 + k * iqr;
  const m = mean(v), s = std0(v);
  const nIqr = v.filter((x) => x > fence).length;
  const nZ = v.filter((x) => (x - m) / s > zt).length;
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thử: IQR và z-score trên 394 giá trị Insulin khác 0</div>
      <label className="w-slider"><span>Hệ số k của IQR = <strong>{k.toFixed(1)}</strong> (hàng rào trên = Q3 + k × IQR = <strong>{fence.toFixed(1)}</strong>)</span>
        <input type="range" min={0.5} max={3} step={0.1} value={k} onChange={(e) => setK(parseFloat(e.target.value))} /></label>
      <label className="w-slider"><span>Ngưỡng z = <strong>{zt.toFixed(1)}</strong></span>
        <input type="range" min={1.5} max={4} step={0.1} value={zt} onChange={(e) => setZt(parseFloat(e.target.value))} /></label>
      <div className="w-metrics" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div><span>Q1 / Q3 / IQR</span><b style={{ fontSize: 17 }}>{q1.toFixed(2)} / {q3.toFixed(0)} / {iqr.toFixed(2)}</b></div>
        <div><span>mean / std</span><b style={{ fontSize: 17 }}>{m.toFixed(1)} / {s.toFixed(1)}</b></div>
        <div><span>IQR: số giá trị bị coi là outlier</span><b>{nIqr}</b><small>giá trị lớn hơn {fence.toFixed(1)}</small></div>
        <div><span>z-score: số giá trị bị coi là outlier</span><b>{nZ}</b><small>z lớn hơn {zt.toFixed(1)}</small></div>
      </div>
      <p className="w-note">Ở k = 1.5 và z = 3, IQR gắn cờ 24 giá trị còn z-score chỉ gắn cờ 8: dữ liệu lệch phải, mean và std bị chính các giá trị lớn kéo lên nên z-score "dễ tính" hơn. Không có ngưỡng đúng tuyệt đối: phát hiện chỉ để điều tra, quyết định giữ hay bỏ dựa vào nguyên nhân.</p>
    </div>
  );
}
