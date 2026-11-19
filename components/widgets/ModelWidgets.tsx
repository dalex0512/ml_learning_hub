"use client";

import React, { useMemo, useState } from "react";

function rng(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

/* ---------- 1. KNN: thang đo đổi người hàng xóm ---------- */
// x1 thang nhỏ (0 đến 10) quyết định lớp; x2 thang lớn (0 đến 1000) là nhiễu
const KNN_PTS = (() => {
  const r = rng(5);
  const out: { x1: number; x2: number; c: 0 | 1 }[] = [];
  for (let i = 0; i < 12; i++) out.push({ x1: 1 + r() * 3.5, x2: r() * 1000, c: 0 });
  for (let i = 0; i < 12; i++) out.push({ x1: 5.5 + r() * 3.5, x2: r() * 1000, c: 1 });
  return out;
})();
const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v: number[]) => Math.sqrt(mean(v.map((x) => (x - mean(v)) ** 2)));
const M1 = mean(KNN_PTS.map((p) => p.x1)), S1 = sd(KNN_PTS.map((p) => p.x1));
const M2 = mean(KNN_PTS.map((p) => p.x2)), S2 = sd(KNN_PTS.map((p) => p.x2));

export function KnnPlay() {
  const [k, setK] = useState(3);
  const [scaled, setScaled] = useState(false);
  const [q1, setQ1] = useState(7);
  const [q2, setQ2] = useState(300);
  const dist = (p: { x1: number; x2: number }) =>
    scaled ? Math.hypot((p.x1 - q1) / S1, (p.x2 - q2) / S2) : Math.hypot(p.x1 - q1, p.x2 - q2);
  const sorted = [...KNN_PTS].map((p) => ({ p, d: dist(p) })).sort((a, b) => a.d - b.d);
  const nb = sorted.slice(0, k);
  const votes1 = nb.filter((n) => n.p.c === 1).length;
  const pred = votes1 * 2 > k ? 1 : votes1 * 2 < k ? 0 : -1;
  const W = 320, H = 220, pad = 22;
  const sx = (x: number) => pad + (x / 10) * (W - 2 * pad), sy = (y: number) => H - pad - (y / 1000) * (H - 2 * pad);
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: ai là hàng xóm gần nhất?</span>
        <span className="w-seg">
          <button type="button" className={!scaled ? "on" : ""} onClick={() => setScaled(false)}>Dữ liệu gốc</button>
          <button type="button" className={scaled ? "on" : ""} onClick={() => setScaled(true)}>Sau StandardScaler</button>
        </span>
      </div>
      <label className="w-slider"><span>K = <strong>{k}</strong></span>
        <input type="range" min={1} max={9} step={2} value={k} onChange={(e) => setK(parseInt(e.target.value, 10))} /></label>
      <label className="w-slider"><span>Điểm cần đoán: x1 = <strong>{q1.toFixed(1)}</strong> (thang 0 đến 10)</span>
        <input type="range" min={0} max={10} step={0.1} value={q1} onChange={(e) => setQ1(parseFloat(e.target.value))} /></label>
      <label className="w-slider"><span>x2 = <strong>{Math.round(q2)}</strong> (thang 0 đến 1000)</span>
        <input type="range" min={0} max={1000} step={10} value={q2} onChange={(e) => setQ2(parseFloat(e.target.value))} /></label>
      <div className="w-grid2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Điểm cần đoán và hàng xóm">
          <rect x={pad} y={pad} width={W - 2 * pad} height={H - 2 * pad} fill="none" stroke="var(--r-line)" />
          {nb.map((n, i) => <line key={i} x1={sx(q1)} y1={sy(q2)} x2={sx(n.p.x1)} y2={sy(n.p.x2)} stroke="var(--r-accent)" opacity={0.6} />)}
          {KNN_PTS.map((p, i) => p.c === 0
            ? <circle key={i} cx={sx(p.x1)} cy={sy(p.x2)} r={5} fill="var(--r-muted)" />
            : <rect key={i} x={sx(p.x1) - 5} y={sy(p.x2) - 5} width={10} height={10} fill="var(--r-ok)" />)}
          <path d={`M${sx(q1) - 7},${sy(q2)} L${sx(q1) + 7},${sy(q2)} M${sx(q1)},${sy(q2) - 7} L${sx(q1)},${sy(q2) + 7}`} stroke="var(--r-accent)" strokeWidth={3} />
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--r-muted)">x1 (thang nhỏ) →</text>
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>{k} hàng xóm gần nhất</span><b>{k - votes1} tròn, {votes1} vuông</b></div>
          <div><span>Dự đoán</span><b>{pred === -1 ? "hòa" : pred === 1 ? "lớp vuông" : "lớp tròn"}</b></div>
        </div>
      </div>
      <p className="w-note">Lớp (tròn hay vuông) thật ra chỉ phụ thuộc x1; x2 là nhiễu nhưng thang lớn hơn nhiều. Ở dữ liệu gốc, "gần nhất" gần như chỉ dựa vào x2 nên dự đoán lung tung; sau khi scale, x1 được nghe đúng mức. Thử đổi giữa hai chế độ và kéo x2.</p>
    </div>
  );
}

/* ---------- 2. Máy tính Gini (14 mẫu của slide 77) ---------- */
type Branch = { name: string; yes: number; no: number };
const GINI_DATA: Record<string, Branch[]> = {
  Age: [{ name: "Youth", yes: 2, no: 3 }, { name: "Middle age", yes: 4, no: 0 }, { name: "Senior", yes: 3, no: 2 }],
  Income: [{ name: "High", yes: 2, no: 2 }, { name: "Medium", yes: 4, no: 2 }, { name: "Low", yes: 3, no: 1 }],
  Student: [{ name: "Yes", yes: 6, no: 1 }, { name: "No", yes: 3, no: 4 }],
  "Credit Rating": [{ name: "Fair", yes: 6, no: 2 }, { name: "Excellent", yes: 3, no: 3 }],
};
const gini = (y: number, n: number) => (y + n ? 1 - (y / (y + n)) ** 2 - (n / (y + n)) ** 2 : 0);
const weighted = (bs: Branch[]) => { const t = bs.reduce((s, b) => s + b.yes + b.no, 0); return bs.reduce((s, b) => s + ((b.yes + b.no) / t) * gini(b.yes, b.no), 0); };

export function GiniCalc() {
  const [feat, setFeat] = useState("Age");
  const all = Object.entries(GINI_DATA).map(([k, v]) => ({ k, g: weighted(v) }));
  const best = all.reduce((a, b) => (b.g < a.g ? b : a));
  const bs = GINI_DATA[feat];
  const total = bs.reduce((s, b) => s + b.yes + b.no, 0);
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: chọn câu hỏi làm gốc (14 người, 9 Yes và 5 No)</span>
        <span className="w-seg">{Object.keys(GINI_DATA).map((k) => <button key={k} type="button" className={feat === k ? "on" : ""} onClick={() => setFeat(k)}>{k}</button>)}</span>
      </div>
      <div className="w-table-wrap">
        <table className="w-bars">
          <thead><tr><th>Nhánh</th><th>Yes</th><th>No</th><th>Gini nhánh</th><th>Trọng số</th></tr></thead>
          <tbody>
            {bs.map((b) => (
              <tr key={b.name}>
                <td>{b.name}</td><td>{b.yes}</td><td>{b.no}</td>
                <td>{gini(b.yes, b.no).toFixed(3)}</td>
                <td>{b.yes + b.no}/{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-metrics" style={{ marginTop: ".8rem", gridTemplateColumns: "1fr 1fr" }}>
        <div><span>Gini có trọng số khi chia theo {feat}</span><b>{weighted(bs).toFixed(3)}</b></div>
        <div><span>Cách chia tốt nhất (Gini nhỏ nhất)</span><b>{best.k}</b><small>{best.g.toFixed(3)}</small></div>
      </div>
      <table className="w-bars" style={{ marginTop: ".8rem" }}>
        <tbody>{all.map((a) => (
          <tr key={a.k}><td style={{ width: "28%" }}>{a.k}</td>
            <td><span className="w-bar"><span style={{ width: `${a.g * 200}%`, background: a.k === best.k ? "var(--r-ok)" : undefined }} /></span><span className="w-pct" style={{ width: "3.6rem" }}>{a.g.toFixed(3)}</span></td></tr>
        ))}</tbody>
      </table>
      <p className="w-note">Gini của một nút = 1 − (tỉ lệ Yes)² − (tỉ lệ No)²: bằng 0 khi nút thuần. Chọn cách chia làm Gini có trọng số nhỏ nhất, tức hai nhóm con thuần nhất tính theo số người. Nhánh Middle age (4 Yes, 0 No) đã thuần nên thành lá.</p>
    </div>
  );
}

/* ---------- 3. Bootstrap và bỏ phiếu ---------- */
const binomMajority = (n: number, p: number) => {
  const c = (a: number, b: number) => { let r = 1; for (let i = 1; i <= b; i++) r = (r * (a - b + i)) / i; return r; };
  let s = 0;
  for (let k = Math.floor(n / 2) + 1; k <= n; k++) s += c(n, k) * p ** k * (1 - p) ** (n - k);
  return s;
};

export function BootstrapVote() {
  const [seed, setSeed] = useState(1);
  const [trees, setTrees] = useState(5);
  const [p, setP] = useState(0.7);
  const draw = useMemo(() => {
    const r = rng(seed * 9973 + 17);
    const counts = Array(10).fill(0);
    for (let i = 0; i < 10; i++) counts[Math.floor(r() * 10)]++;
    return counts;
  }, [seed]);
  const unique = draw.filter((c) => c > 0).length;
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử 1: lấy một mẫu bootstrap từ 10 mẫu</span>
        <button type="button" className="reader-btn" onClick={() => setSeed((s) => s + 1)}>Lấy mẫu mới</button>
      </div>
      <div className="w-strip">
        {draw.map((c, i) => (
          <span key={i} className={`w-chip ${c > 0 ? "pred" : ""}`}><b>mẫu {i + 1}</b><small>{c > 0 ? `${c} lần` : "OOB"}</small></span>
        ))}
      </div>
      <p className="w-note">Mỗi cây bốc 10 lần có hoàn lại. Lần này có <strong>{unique}</strong> mẫu khác nhau xuất hiện và <strong>{10 - unique}</strong> mẫu không được chọn (out-of-bag, OOB). Khi dữ liệu lớn, một mẫu không được chọn với xác suất (1 − 1/n)ⁿ → 1/e ≈ 36.8%, nên mỗi cây thấy khoảng 63.2% mẫu khác nhau.</p>

      <div className="reader-label" style={{ margin: "1.2rem 0 0" }}>Thử 2: nhiều cây bỏ phiếu</div>
      <label className="w-slider"><span>Số cây = <strong>{trees}</strong></span>
        <input type="range" min={1} max={101} step={2} value={trees} onChange={(e) => setTrees(parseInt(e.target.value, 10))} /></label>
      <label className="w-slider"><span>Độ chính xác của mỗi cây = <strong>{(p * 100).toFixed(0)}%</strong></span>
        <input type="range" min={0.55} max={0.9} step={0.01} value={p} onChange={(e) => setP(parseFloat(e.target.value))} /></label>
      <div className="w-metrics" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div><span>Cây độc lập hoàn toàn</span><b>{(binomMajority(trees, p) * 100).toFixed(1)}%</b><small>đa số đúng</small></div>
        <div><span>Mọi cây giống hệt nhau</span><b>{(p * 100).toFixed(1)}%</b><small>vote không giúp gì</small></div>
      </div>
      <p className="w-note">Với 5 cây độc lập, mỗi cây đúng 70%, đa số đúng 83.7%. Nhưng nếu các cây giống hệt nhau (huấn luyện trên cùng dữ liệu, cùng cách chia) thì vote vô nghĩa: độ chính xác vẫn là 70%. Vì vậy Random Forest cố tình làm các cây khác nhau bằng bootstrap và chọn feature ngẫu nhiên. Thực tế các cây chỉ gần độc lập, nên kết quả nằm giữa hai cột.</p>
    </div>
  );
}

/* ---------- 4. Thanh dữ liệu train / validation / test ---------- */
export function SplitBar() {
  const [train, setTrain] = useState(80);
  const [val, setVal] = useState(10);
  const test = Math.max(0, 100 - train - val);
  const set = (t: number, v: number) => { const tt = Math.min(95, Math.max(10, t)); setTrain(tt); setVal(Math.min(v, 100 - tt)); };
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: chia 100 mẫu</span>
        <span className="w-seg">
          <button type="button" onClick={() => set(80, 0)}>80 / 0 / 20</button>
          <button type="button" onClick={() => set(80, 10)}>80 / 10 / 10</button>
          <button type="button" onClick={() => set(60, 20)}>60 / 20 / 20</button>
        </span>
      </div>
      <label className="w-slider"><span>Train = <strong>{train}%</strong></span>
        <input type="range" min={10} max={95} step={5} value={train} onChange={(e) => set(parseInt(e.target.value, 10), val)} /></label>
      <label className="w-slider"><span>Validation = <strong>{val}%</strong></span>
        <input type="range" min={0} max={100 - train} step={5} value={val} onChange={(e) => setVal(parseInt(e.target.value, 10))} /></label>
      <div style={{ display: "flex", height: 34, borderRadius: 8, overflow: "hidden", margin: ".6rem 0", fontSize: 13, color: "var(--r-bg)" }}>
        <div style={{ width: `${train}%`, background: "var(--r-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>train {train}</div>
        {val > 0 && <div style={{ width: `${val}%`, background: "var(--r-ok)", display: "flex", alignItems: "center", justifyContent: "center" }}>val {val}</div>}
        {test > 0 && <div style={{ width: `${test}%`, background: "var(--r-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>test {test}</div>}
      </div>
      <div className="w-metrics" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div><span>Train: để học</span><b>{train}</b><small>model cập nhật tham số</small></div>
        <div><span>Validation: để chọn</span><b>{val}</b><small>chọn model, chỉnh tham số</small></div>
        <div><span>Test: để chấm cuối</span><b>{test}</b><small>chỉ dùng một lần</small></div>
      </div>
      <p className="w-note">
        {val === 0 && "Không có validation: mọi lựa chọn (model, tham số) buộc phải dựa vào test hoặc train, nên test không còn độc lập. Thường người ta thay validation cứng bằng cross-validation trên train."}
        {val > 0 && train < 50 && "Train nhỏ: model có ít dữ liệu để học, điểm sẽ bi quan."}
        {val > 0 && train >= 50 && test < 10 && "Test quá nhỏ: điểm chấm cuối dao động mạnh."}
        {val > 0 && train >= 50 && test >= 10 && "Mỗi tập có một vai: train học, validation chọn, test chấm cuối. Test chưa từng được dùng để quyết định gì."}
      </p>
    </div>
  );
}
