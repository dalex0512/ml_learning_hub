"use client";

import React, { useState } from "react";

const X = [1, 2, 3];
const Y = [2, 4, 6];

/** Một núm vặn a: thấy loss, gradient và vòng lặp cập nhật a ← a − η·gradient. */
export default function ParamKnob() {
  const [a, setA] = useState(1);
  const [eta, setEta] = useState(0.05);
  const [hist, setHist] = useState<{ a: number; loss: number }[]>([]);
  const err = X.map((x, i) => a * x - Y[i]);
  const loss = err.reduce((s, e) => s + e * e, 0) / X.length;
  const grad = (2 / X.length) * err.reduce((s, e, i) => s + e * X[i], 0);
  const step = () => {
    setHist((h) => [...h.slice(-9), { a, loss }]);
    setA(a - eta * grad);
  };
  const reset = () => { setA(1); setHist([]); };
  const W = 300, H = 150, pad = 24;
  const sx = (v: number) => pad + ((v + 1) / 5) * (W - 2 * pad);
  const lossAt = (v: number) => X.reduce((s, x, i) => s + (v * x - Y[i]) ** 2, 0) / 3;
  const maxL = lossAt(-1);
  const sy = (l: number) => H - pad - Math.min(1, l / maxL) * (H - 2 * pad);
  const path = Array.from({ length: 101 }, (_, i) => { const v = -1 + (i / 100) * 5; return `${i ? "L" : "M"}${sx(v)},${sy(lossAt(v))}`; }).join(" ");
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: vặn núm a của model ŷ = a·x</span>
        <span className="w-seg"><button type="button" onClick={step}>Một bước cập nhật</button><button type="button" onClick={reset}>Đặt lại</button></span>
      </div>
      <label className="w-slider"><span>Tham số a = <strong>{a.toFixed(3)}</strong> (đáp án đúng là a = 2)</span>
        <input type="range" min={-1} max={4} step={0.01} value={Math.max(-1, Math.min(4, a))} onChange={(e) => { setA(parseFloat(e.target.value)); setHist([]); }} /></label>
      <label className="w-slider"><span>Bước nhảy η = <strong>{eta.toFixed(2)}</strong></span>
        <input type="range" min={0.01} max={0.3} step={0.01} value={eta} onChange={(e) => setEta(parseFloat(e.target.value))} /></label>
      <div className="w-grid2">
        <div className="w-table-wrap">
          <table className="w-bars">
            <thead><tr><th>x</th><th>y thật</th><th>ŷ = a·x</th><th>sai số</th></tr></thead>
            <tbody>{X.map((x, i) => <tr key={i}><td>{x}</td><td>{Y[i]}</td><td>{(a * x).toFixed(2)}</td><td>{err[i].toFixed(2)}</td></tr>)}</tbody>
          </table>
          <div className="w-metrics" style={{ gridTemplateColumns: "1fr 1fr", marginTop: ".6rem" }}>
            <div><span>Loss (MSE)</span><b>{loss.toFixed(3)}</b></div>
            <div><span>Gradient</span><b>{grad.toFixed(2)}</b><small>{Math.abs(grad) < 0.01 ? "đã đến đáy" : grad < 0 ? "tăng a để giảm loss" : "giảm a để giảm loss"}</small></div>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Loss theo a">
          <path d={path} fill="none" stroke="var(--r-muted)" strokeWidth={2} />
          {hist.map((h, i) => <circle key={i} cx={sx(Math.max(-1, Math.min(4, h.a)))} cy={sy(h.loss)} r={3} fill="var(--r-accent)" opacity={0.5} />)}
          <circle cx={sx(Math.max(-1, Math.min(4, a)))} cy={sy(loss)} r={6} fill="var(--r-accent)" />
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--r-muted)">tham số a</text>
        </svg>
      </div>
      <p className="w-note">Đường cong là loss ứng với mỗi giá trị của a; điểm đỏ là vị trí hiện tại. Bấm "Một bước cập nhật" để máy tự đi xuống theo gradient. Thử η = 0.01 (chậm), 0.05 (êm), 0.2 (dao động), 0.3 (văng xa).</p>
    </div>
  );
}
