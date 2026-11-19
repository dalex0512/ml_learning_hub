"use client";

import React, { useMemo, useState } from "react";

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const f = (v: number, d = 2) => v.toFixed(d);

/* ---------- 1. Kéo một căn nhà outlier: L1, L2, MAE, RMSE, R² ---------- */
export function LossOutlier({ props }: { props?: string }) {
  const slide = (props ?? "").includes("slide");
  const actual = slide ? [3.75, 4.12, 2.2, 2.3] : [2.0, 2.5, 3.0, 3.5, 4.0];
  const base = slide ? [3.45, 3.9, 2.12, 2.9] : [2.2, 2.4, 3.3, 3.4, 4.0];
  const last = actual.length - 1;
  const [e, setE] = useState(0);
  const pred = base.map((p, i) => (i === last ? p + e : p));
  const err = pred.map((p, i) => p - actual[i]);
  const mae = mean(err.map(Math.abs));
  const mse = mean(err.map((x) => x * x));
  const rmse = Math.sqrt(mse);
  const ma = mean(actual);
  const r2 = 1 - err.reduce((s, x) => s + x * x, 0) / actual.reduce((s, y) => s + (y - ma) ** 2, 0);
  const maxPen = Math.max(...err.map((x) => x * x), 1e-9);
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thử: căn nhà cuối bị đoán lệch thêm</div>
      <label className="w-slider">
        <span>Sai số thêm của căn nhà cuối = <strong>{f(e)}</strong> tỉ đồng (đoán {f(pred[last])} so với thật {f(actual[last])})</span>
        <input type="range" min={0} max={5} step={0.1} value={e} onChange={(ev) => setE(parseFloat(ev.target.value))} />
      </label>
      <div className="w-table-wrap">
        <table className="w-bars">
          <thead><tr><th>Nhà</th><th>Thật</th><th>Đoán</th><th>Sai số</th><th style={{ width: "30%" }}>Phạt L1 |sai|</th><th style={{ width: "30%" }}>Phạt L2 sai²</th></tr></thead>
          <tbody>
            {err.map((x, i) => (
              <tr key={i}>
                <td>{i + 1}</td><td>{f(actual[i])}</td><td>{f(pred[i])}</td><td>{f(x)}</td>
                <td><span className="w-bar" style={{ width: "100%" }}><span style={{ width: `${(Math.abs(x) / Math.sqrt(maxPen)) * 100}%` }} /></span></td>
                <td><span className="w-bar" style={{ width: "100%" }}><span style={{ width: `${((x * x) / maxPen) * 100}%` }} /></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-metrics" style={{ marginTop: ".8rem", gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div><span>MAE</span><b>{f(mae, 3)}</b></div>
        <div><span>MSE</span><b>{f(mse, 3)}</b></div>
        <div><span>RMSE</span><b>{f(rmse, 3)}</b></div>
        <div><span>R²</span><b>{f(r2, 3)}</b></div>
      </div>
      <p className="w-note">Kéo thanh trượt: phạt L1 tăng đều, phạt L2 (bình phương) tăng vọt. RMSE phản ứng với một sai số lớn mạnh hơn MAE nhiều.</p>
    </div>
  );
}

/* ---------- 2. Kéo điểm để thấy hệ số tương quan r đổi ---------- */
const pearson = (x: number[], y: number[]) => {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0, syy = 0;
  x.forEach((xi, i) => { sxy += (xi - mx) * (y[i] - my); sxx += (xi - mx) ** 2; syy += (y[i] - my) ** 2; });
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
};

export function CorrDrag() {
  const [mode, setMode] = useState<"line" | "parabola">("line");
  const [last, setLast] = useState(8);
  const xs = [1, 2, 3, 4, 5, 6, 7, 8];
  const ys = useMemo(() => {
    const base = mode === "line" ? [1.2, 2.1, 2.8, 4.2, 4.9, 6.1, 6.8, 8] : [9, 4, 1, 0, 0, 1, 4, 9];
    return base.map((y, i) => (i === 7 ? last : y));
  }, [mode, last]);
  const r = pearson(xs, ys);
  const W = 300, H = 190, pad = 24;
  const ymin = -2, ymax = 16;
  const sx = (x: number) => pad + ((x - 0.5) / 8) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad);
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: kéo điểm cuối</span>
        <span className="w-seg">
          <button type="button" className={mode === "line" ? "on" : ""} onClick={() => { setMode("line"); setLast(8); }}>Quan hệ đường thẳng</button>
          <button type="button" className={mode === "parabola" ? "on" : ""} onClick={() => { setMode("parabola"); setLast(9); }}>Quan hệ parabol</button>
        </span>
      </div>
      <label className="w-slider">
        <span>Giá trị y của điểm cuối = <strong>{last.toFixed(1)}</strong></span>
        <input type="range" min={-2} max={16} step={0.5} value={last} onChange={(e) => setLast(parseFloat(e.target.value))} />
      </label>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Biểu đồ phân tán">
          <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--r-line)" />
          <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="var(--r-line)" />
          {xs.map((x, i) => (
            <circle key={i} cx={sx(x)} cy={sy(ys[i])} r={i === 7 ? 6 : 4} fill={i === 7 ? "var(--r-accent)" : "var(--r-muted)"} />
          ))}
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>Hệ số tương quan Pearson r</span><b>{r.toFixed(3)}</b></div>
          <div><span>Đọc</span><small style={{ fontSize: 14 }}>{Math.abs(r) > 0.8 ? "Quan hệ tuyến tính mạnh" : Math.abs(r) > 0.4 ? "Quan hệ tuyến tính vừa" : "Gần như không có quan hệ tuyến tính"}</small></div>
        </div>
      </div>
      <p className="w-note">
        {mode === "parabola" ? "Với parabol, y phụ thuộc rất rõ vào x, nhưng r gần 0: r chỉ đo quan hệ tuyến tính. Kéo điểm cuối để thấy một điểm có thể làm r đổi dấu." : "Kéo điểm cuối xuống thấp: một điểm lạc có thể kéo r từ gần 1 xuống rất thấp."}
      </p>
    </div>
  );
}

/* ---------- 3. Kéo hai núm (độ dốc, tung độ), thấy residual và tổng bình phương ---------- */
const PTS: [number, number][] = [[1, 1.5], [2, 2.4], [3, 2.8], [4, 4.5], [5, 4.9], [6, 6.3]];

export function LinearFit() {
  const [m, setM] = useState(0.5);
  const [b, setB] = useState(2);
  const xs = PTS.map((p) => p[0]), ys = PTS.map((p) => p[1]);
  const mx = mean(xs), my = mean(ys);
  const mOpt = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  const bOpt = my - mOpt * mx;
  const sse = (mm: number, bb: number) => PTS.reduce((s, [x, y]) => s + (y - (mm * x + bb)) ** 2, 0);
  const W = 300, H = 200, pad = 26;
  const sx = (x: number) => pad + (x / 7) * (W - 2 * pad);
  const sy = (y: number) => H - pad - (y / 8) * (H - 2 * pad);
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: tự tìm đường thẳng</span>
        <button type="button" className="reader-btn" onClick={() => { setM(+mOpt.toFixed(2)); setB(+bOpt.toFixed(2)); }}>Đặt về đường tối ưu (OLS)</button>
      </div>
      <label className="w-slider"><span>Độ dốc m = <strong>{f(m)}</strong></span>
        <input type="range" min={-1} max={2} step={0.01} value={m} onChange={(e) => setM(parseFloat(e.target.value))} /></label>
      <label className="w-slider"><span>Tung độ gốc b = <strong>{f(b)}</strong></span>
        <input type="range" min={-3} max={6} step={0.01} value={b} onChange={(e) => setB(parseFloat(e.target.value))} /></label>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Đường thẳng và residual">
          <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--r-line)" />
          <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="var(--r-line)" />
          <line x1={sx(0)} y1={sy(b)} x2={sx(7)} y2={sy(m * 7 + b)} stroke="var(--r-accent)" strokeWidth={2} />
          {PTS.map(([x, y], i) => (
            <g key={i}>
              <line x1={sx(x)} y1={sy(y)} x2={sx(x)} y2={sy(m * x + b)} stroke="var(--r-muted)" strokeDasharray="3 3" />
              <circle cx={sx(x)} cy={sy(y)} r={4} fill="var(--r-fg)" />
            </g>
          ))}
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>Tổng bình phương sai số (SSE)</span><b>{f(sse(m, b), 3)}</b><small>nhỏ nhất có thể: {f(sse(mOpt, bOpt), 3)} tại m = {f(mOpt)}, b = {f(bOpt)}</small></div>
        </div>
      </div>
      <p className="w-note">Mỗi vạch đứt là một sai số (residual). Học tức là chỉnh m và b cho tổng bình phương các vạch đó nhỏ nhất.</p>
    </div>
  );
}

/* ---------- 4. Bậc đa thức: train error và test error ---------- */
const g = (x: number) => 0.9 * Math.sin(2 * Math.PI * x);
const NOISE = [0.12, -0.18, 0.15, -0.1, 0.2, -0.15, 0.1, -0.2, 0.18, -0.1];
const TR_X = [0, 0.1, 0.2, 0.3, 0.4, 0.55, 0.65, 0.78, 0.9, 1.0];
const TR_Y = TR_X.map((x, i) => g(x) + NOISE[i]);
const TE_X = [0.05, 0.15, 0.25, 0.35, 0.47, 0.6, 0.72, 0.84, 0.95];
const TE_Y = TE_X.map((x) => g(x));

function polyfit(x: number[], y: number[], d: number): number[] {
  const n = d + 1;
  const A = Array.from({ length: n }, () => Array(n + 1).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) A[i][j] = x.reduce((s, xv) => s + xv ** (i + j), 0);
    A[i][n] = x.reduce((s, xv, k) => s + y[k] * xv ** i, 0);
  }
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    [A[i], A[p]] = [A[p], A[i]];
    const div = A[i][i] || 1e-12;
    for (let c = i; c <= n; c++) A[i][c] /= div;
    for (let r = 0; r < n; r++) if (r !== i) { const k = A[r][i]; for (let c = i; c <= n; c++) A[r][c] -= k * A[i][c]; }
  }
  return A.map((row) => row[n]);
}
const peval = (c: number[], x: number) => c.reduce((s, ci, i) => s + ci * x ** i, 0);

export function PolyDegree() {
  const [d, setD] = useState(1);
  const c = useMemo(() => polyfit(TR_X, TR_Y, d), [d]);
  const rmse = (xs: number[], ys: number[]) => Math.sqrt(mean(xs.map((x, i) => (peval(c, x) - ys[i]) ** 2)));
  const tr = rmse(TR_X, TR_Y), te = rmse(TE_X, TE_Y);
  const W = 320, H = 210, pad = 26;
  const sx = (x: number) => pad + x * (W - 2 * pad);
  const clamp = (y: number) => Math.max(-1.6, Math.min(1.6, y));
  const sy = (y: number) => H / 2 - (clamp(y) / 1.6) * (H / 2 - pad);
  const path = Array.from({ length: 101 }, (_, i) => { const x = i / 100; return `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(peval(c, x)).toFixed(1)}`; }).join(" ");
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thử: tăng bậc đa thức</div>
      <label className="w-slider"><span>Bậc d = <strong>{d}</strong></span>
        <input type="range" min={1} max={9} step={1} value={d} onChange={(e) => setD(parseInt(e.target.value, 10))} /></label>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Đường cong đa thức">
          <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="var(--r-line)" />
          <path d={path} fill="none" stroke="var(--r-accent)" strokeWidth={2} />
          {TR_X.map((x, i) => <circle key={`a${i}`} cx={sx(x)} cy={sy(TR_Y[i])} r={4} fill="var(--r-fg)" />)}
          {TE_X.map((x, i) => <rect key={`b${i}`} x={sx(x) - 4} y={sy(TE_Y[i]) - 4} width={8} height={8} fill="none" stroke="var(--r-muted)" strokeWidth={1.5} />)}
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>Sai số trên train (chấm tròn)</span><b>{f(tr, 3)}</b></div>
          <div><span>Sai số trên test (ô vuông)</span><b>{f(te, 3)}</b></div>
        </div>
      </div>
      <p className="w-note">Bậc tăng thì sai số train luôn giảm, còn sai số test giảm rồi tăng trở lại: đường cong bắt đầu "học thuộc" nhiễu. Bậc tốt là bậc có sai số test thấp nhất, không phải bậc có sai số train thấp nhất.</p>
    </div>
  );
}
