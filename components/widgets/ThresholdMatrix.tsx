"use client";

import React, { useState } from "react";
import data from "./data/threshold.json";

type Key = "email" | "diabetes";

const pct = (v: number | null) => (v === null ? "—" : `${(v * 100).toFixed(1)}%`);

/** Ma trận nhầm lẫn + bốn metric thay đổi trực tiếp khi kéo ngưỡng. */
export default function ThresholdMatrix({ props }: { props?: string }) {
  const [ds, setDs] = useState<Key>(props?.includes("diabetes") ? "diabetes" : "email");
  const [t, setT] = useState(0.5);
  const d = data[ds];
  const n = d.scores.length;

  let tp = 0, fp = 0, fn = 0, tn = 0;
  d.scores.forEach((s, i) => {
    const pred = s >= t ? 1 : 0;
    const lab = d.labels[i];
    if (pred && lab) tp++; else if (pred && !lab) fp++; else if (!pred && lab) fn++; else tn++;
  });
  const acc = (tp + tn) / n;
  const prec = tp + fp ? tp / (tp + fp) : null;
  const rec = tp + fn ? tp / (tp + fn) : null;
  const f1 = prec !== null && rec !== null && prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : null;
  const positives = tp + fn;
  const baseline = (n - positives) / n;

  const order = d.scores.map((s, i) => ({ s, lab: d.labels[i] })).sort((a, b) => b.s - a.s);

  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: kéo ngưỡng</span>
        <span className="w-seg">
          <button type="button" className={ds === "email" ? "on" : ""} onClick={() => { setDs("email"); setT(0.5); }}>10 email (tự soạn)</button>
          <button type="button" className={ds === "diabetes" ? "on" : ""} onClick={() => { setDs("diabetes"); setT(0.5); }}>154 bệnh nhân (Diabetes)</button>
        </span>
      </div>

      <label className="w-slider">
        <span>Ngưỡng = <strong>{t.toFixed(2)}</strong>: đoán <em>Dương</em> khi score ≥ ngưỡng</span>
        <input type="range" min={0} max={1} step={ds === "email" ? 0.05 : 0.01} value={t} onChange={(e) => setT(parseFloat(e.target.value))} />
      </label>

      {ds === "email" && (
        <div className="w-strip" aria-label="10 email xếp theo score">
          {order.map((o, i) => (
            <span key={i} className={`w-chip ${o.s >= t ? "pred" : ""} ${o.lab ? "pos" : "neg"}`} title={o.lab ? "Thật sự là spam" : "Thật sự không phải spam"}>
              <b>{o.s.toFixed(2)}</b>
              <small>{o.lab ? "spam" : "không"}</small>
            </span>
          ))}
        </div>
      )}
      {ds === "email" && <p className="w-note">Mỗi ô là một email: số là score của model, chữ là sự thật. Ô có viền đậm là email bị đoán là spam ở ngưỡng hiện tại.</p>}

      <div className="w-grid2">
        <table className="w-matrix">
          <thead><tr><th></th><th>Đoán Dương</th><th>Đoán Âm</th></tr></thead>
          <tbody>
            <tr><th>Thật Dương</th><td className="ok"><small>TP</small>{tp}</td><td className="bad"><small>FN</small>{fn}</td></tr>
            <tr><th>Thật Âm</th><td className="bad"><small>FP</small>{fp}</td><td className="ok"><small>TN</small>{tn}</td></tr>
          </tbody>
        </table>
        <div className="w-metrics">
          <div><span>Accuracy</span><b>{pct(acc)}</b><small>({tp}+{tn}) / {n}</small></div>
          <div><span>Precision</span><b>{pct(prec)}</b><small>{tp} / ({tp}+{fp})</small></div>
          <div><span>Recall</span><b>{pct(rec)}</b><small>{tp} / ({tp}+{fn})</small></div>
          <div><span>F1</span><b>{pct(f1)}</b><small>trung bình điều hòa</small></div>
        </div>
      </div>

      <p className="w-note">
        {t === 0 && "Ngưỡng 0: đoán mọi thứ là Dương, nên recall 100% nhưng precision chỉ bằng tỉ lệ Dương thật."}
        {t > 0 && tp + fp === 0 && "Ngưỡng quá cao: không có mẫu nào bị đoán Dương, precision không xác định và recall bằng 0."}
        {t > 0 && tp + fp > 0 && ds === "diabetes" && `Mức sàn: đoán toàn Âm đạt accuracy ${(baseline * 100).toFixed(1)}% nhưng recall 0%. Hạ ngưỡng để tăng recall thì FP tăng, precision giảm.`}
        {t > 0 && tp + fp > 0 && ds === "email" && "Hạ ngưỡng để bắt thêm spam (recall tăng) thì cũng kéo thêm email bình thường vào thư rác (precision giảm)."}
      </p>
    </div>
  );
}
