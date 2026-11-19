"use client";

import React, { useMemo, useState } from "react";
import data from "./data/scaler.json";

type Mode = "raw" | "standard" | "minmax";

const MODES: { key: Mode; label: string }[] = [
  { key: "raw", label: "Dữ liệu gốc" },
  { key: "standard", label: "StandardScaler" },
  { key: "minmax", label: "MinMaxScaler" },
];

/** Hai bệnh nhân: mỗi cột đóng góp bao nhiêu % vào khoảng cách, trước và sau khi scale. */
export default function ScalerBeforeAfter() {
  const [mode, setMode] = useState<Mode>("raw");
  const [pair, setPair] = useState<[number, number]>([0, 1]);

  const { a, b, shares, dist } = useMemo(() => {
    const A = data.rows[pair[0]];
    const B = data.rows[pair[1]];
    const sq = data.cols.map((_, k) => {
      const diff = A[k] - B[k];
      if (mode === "raw") return diff * diff;
      if (mode === "standard") return (diff / data.scale[k]) ** 2;
      return (diff / (data.max[k] - data.min[k])) ** 2;
    });
    const total = sq.reduce((x, y) => x + y, 0) || 1;
    return { a: A, b: B, shares: sq.map((v) => v / total), dist: Math.sqrt(total) };
  }, [mode, pair]);

  const summary = data.summary[mode];
  const randomPair = () => {
    const i = 2 + Math.floor(Math.random() * (data.rows.length - 2));
    let j = 2 + Math.floor(Math.random() * (data.rows.length - 2));
    if (j === i) j = j === data.rows.length - 1 ? 2 : j + 1;
    setPair([i, j]);
  };
  const isPreset = pair[0] === 0 && pair[1] === 1;

  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: mỗi cột đóng góp bao nhiêu vào khoảng cách?</span>
        <span className="w-seg">
          {MODES.map((m) => (
            <button key={m.key} type="button" className={mode === m.key ? "on" : ""} onClick={() => setMode(m.key)}>{m.label}</button>
          ))}
        </span>
      </div>

      <div className="w-head" style={{ marginTop: ".4rem" }}>
        <span className="w-seg">
          <button type="button" className={isPreset ? "on" : ""} onClick={() => setPair([0, 1])}>Hai bệnh nhân trong bài</button>
          <button type="button" className={!isPreset ? "on" : ""} onClick={randomPair}>Cặp ngẫu nhiên</button>
        </span>
        <span style={{ color: "var(--r-muted)", fontSize: 14 }}>
          Khoảng cách Euclid: <strong style={{ color: "var(--r-fg)" }}>{dist.toFixed(mode === "raw" ? 1 : 3)}</strong>
        </span>
      </div>

      <div className="w-table-wrap">
        <table className="w-bars">
          <thead><tr><th>Cột</th><th>Người A</th><th>Người B</th><th style={{ width: "45%" }}>Phần của khoảng cách²</th></tr></thead>
          <tbody>
            {data.cols.map((c, k) => (
              <tr key={c}>
                <td>{c}</td>
                <td>{a[k]}</td>
                <td>{b[k]}</td>
                <td>
                  <span className="w-bar"><span style={{ width: `${shares[k] * 100}%` }} /></span>
                  <span className="w-pct">{(shares[k] * 100).toFixed(0)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reader-label" style={{ margin: "1rem 0 .3rem" }}>Trung bình trên 5000 cặp bệnh nhân ngẫu nhiên (cả bộ train)</div>
      <div className="w-table-wrap">
        <table className="w-bars">
          <tbody>
            {data.cols.map((c, k) => (
              <tr key={c}>
                <td style={{ width: "30%" }}>{c}</td>
                <td>
                  <span className="w-bar"><span style={{ width: `${summary[k] * 100}%` }} /></span>
                  <span className="w-pct">{(summary[k] * 100).toFixed(1)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="w-note">
        {mode === "raw" && "Dữ liệu gốc: Insulin chiếm hơn một nửa khoảng cách, DiabetesPedigreeFunction gần như vô hình."}
        {mode === "standard" && "Sau StandardScaler: tám cột đóng góp gần ngang nhau (khoảng 11% đến 14%, so với 12.5% nếu hoàn toàn công bằng)."}
        {mode === "minmax" && "Sau MinMaxScaler: cũng cân bằng hơn nhiều, nhưng một giá trị cực đoan sẽ kéo giãn min hoặc max và nén các giá trị còn lại."}
      </p>
    </div>
  );
}
