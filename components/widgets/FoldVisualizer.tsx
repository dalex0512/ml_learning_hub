"use client";

import React, { useState } from "react";
import data from "./data/folds.json";

const N = 100;
const KS = [3, 5, 10] as const;
type K = (typeof KS)[number];

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const std = (v: number[]) => Math.sqrt(mean(v.map((x) => (x - mean(v)) ** 2)));

/** Xoay validation qua từng fold; so điểm K-fold với điểm của một lần chia. */
export default function FoldVisualizer() {
  const [k, setK] = useState<K>(5);
  const [fold, setFold] = useState(0);
  const f = Math.min(fold, k - 1);
  const start = Math.round((f * N) / k);
  const end = Math.round(((f + 1) * N) / k);
  const scores = data.folds[String(k) as "3" | "5" | "10"];
  const lo = Math.min(...data.holdout, ...scores);
  const hi = Math.max(...data.holdout, ...scores);
  const x = (v: number) => `${((v - lo) / (hi - lo || 1)) * 100}%`;

  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: xoay fold</span>
        <span className="w-seg">
          {KS.map((v) => (
            <button key={v} type="button" className={k === v ? "on" : ""} onClick={() => { setK(v); setFold(0); }}>K = {v}</button>
          ))}
        </span>
      </div>

      <div className="w-seg" style={{ margin: ".6rem 0" }}>
        {Array.from({ length: k }, (_, i) => (
          <button key={i} type="button" className={f === i ? "on" : ""} onClick={() => setFold(i)}>Lượt {i + 1}</button>
        ))}
      </div>

      <div className="w-cells" aria-label="100 mẫu minh họa">
        {Array.from({ length: N }, (_, i) => (
          <span key={i} className={i >= start && i < end ? "val" : "trn"} />
        ))}
      </div>
      <p className="w-note">
        Minh họa 100 mẫu. Lượt {f + 1}: <strong>{end - start}</strong> mẫu làm validation (đỏ), <strong>{N - (end - start)}</strong> mẫu để train (xám).
        Qua {k} lượt, mỗi mẫu làm validation đúng một lần.
      </p>

      <div className="reader-label" style={{ margin: "1.2rem 0 .3rem" }}>Điểm thật: Logistic Regression trên bộ train Diabetes (614 mẫu)</div>
      <div className="w-fold-scores">
        {scores.map((v, i) => (
          <span key={i} className={i === f ? "on" : ""}><small>lượt {i + 1}</small>{(v * 100).toFixed(1)}%</span>
        ))}
      </div>
      <p style={{ margin: ".6rem 0 0" }}>
        Trung bình <strong>{(mean(scores) * 100).toFixed(1)}%</strong>, độ lệch chuẩn <strong>{(std(scores) * 100).toFixed(1)} điểm</strong>.
      </p>

      <div className="reader-label" style={{ margin: "1.2rem 0 .3rem" }}>So với một lần chia 80/20 (30 cách chia khác nhau)</div>
      <div className="w-range">
        <span className="w-range-line" />
        {data.holdout.map((v, i) => (
          <span key={i} className="w-dot" style={{ left: x(v) }} />
        ))}
        {scores.map((v, i) => (
          <span key={`f${i}`} className="w-dot fold" style={{ left: x(v) }} />
        ))}
      </div>
      <p className="w-note">
        Chấm xám: điểm của 30 lần chia 80/20 khác nhau (từ {(Math.min(...data.holdout) * 100).toFixed(1)}% đến {(Math.max(...data.holdout) * 100).toFixed(1)}%).
        Chấm đỏ: {k} điểm của K-fold. Một lần chia có thể rơi bất cứ đâu trong dải xám; K-fold cho cả mức điểm lẫn độ dao động.
      </p>
    </div>
  );
}
