"use client";

import React, { useState } from "react";
import data from "./data/rows.json";

/** Bảng Diabetes: bấm một hàng để thấy x⁽ⁱ⁾ và y⁽ⁱ⁾; tách thành X và y; xáo lệch X so với y. */
export default function XyTable() {
  const [sel, setSel] = useState(0);
  const [split, setSplit] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const feats = data.cols.slice(0, 8);
  const n = data.rows.length;
  const show = 10;
  const xRow = (i: number) => data.rows[shuffle ? data.perm[i] : i].slice(0, 8);
  const y = (i: number) => data.rows[i][8];
  const acc = shuffle ? data.shuffled : data.aligned;
  const short = (c: string) => (c === "DiabetesPedigreeFunction" ? "DPF" : c === "BloodPressure" ? "BP" : c === "SkinThickness" ? "Skin" : c === "Pregnancies" ? "Preg" : c);
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: bảng Diabetes (10 hàng đầu của 768)</span>
        <span className="w-seg">
          <button type="button" className={!split ? "on" : ""} onClick={() => { setSplit(false); setShuffle(false); }}>Một bảng</button>
          <button type="button" className={split ? "on" : ""} onClick={() => setSplit(true)}>Tách thành X và y</button>
        </span>
      </div>
      <div className="w-table-wrap">
        <table className="w-bars" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>#</th>
              {feats.map((c) => <th key={c}>{short(c)}</th>)}
              {split ? null : <th style={{ color: "var(--r-accent)" }}>Outcome</th>}
              {split && <th style={{ paddingLeft: "1.2rem", color: "var(--r-accent)" }}>y</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: show }, (_, i) => {
              const on = sel === i;
              const row = xRow(i);
              return (
                <tr key={i} onClick={() => setSel(i)} style={{ cursor: "pointer", background: on ? "rgba(200,90,70,.14)" : undefined }}>
                  <td>{i + 1}</td>
                  {row.map((v, k) => <td key={k}>{v}</td>)}
                  <td style={{ paddingLeft: split ? "1.2rem" : undefined, fontWeight: 700, color: "var(--r-accent)" }}>{y(i)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="w-metrics" style={{ gridTemplateColumns: "1fr", marginTop: ".8rem" }}>
        <div>
          <span>Mẫu thứ {sel + 1}</span>
          <small style={{ fontSize: 14.5 }}>
            x⁽{sel + 1}⁾ = ({xRow(sel).join(", ")}) &nbsp;→&nbsp; y⁽{sel + 1}⁾ = <strong>{y(sel)}</strong>
          </small>
        </div>
      </div>
      {split && (
        <div style={{ marginTop: ".8rem" }}>
          <label style={{ display: "flex", gap: ".5rem", alignItems: "center", fontSize: 15 }}>
            <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />
            Xáo riêng các hàng của X, giữ nguyên y (sai lầm hay gặp)
          </label>
          <p className="w-note">
            Dùng luật đơn giản "Glucose ≥ 140 thì đoán 1" trên {n} hàng đầu: khi hàng và nhãn <strong>khớp</strong> luật đúng {(data.aligned * 100).toFixed(1)}%; sau khi xáo lệch chỉ còn {(data.shuffled * 100).toFixed(1)}%.
            {shuffle ? ` Đang xem bản xáo lệch: độ chính xác ${(acc * 100).toFixed(1)}% (tệ hơn đoán mò), vì x⁽ⁱ⁾ không còn đi với y⁽ⁱ⁾ của chính nó.` : " Bật ô trên để xem bảng khi bị xáo lệch."}
          </p>
        </div>
      )}
      <p className="w-note">Hàng thứ 6 ({data.rows[5].slice(0, 8).join(", ")}, nhãn {data.rows[5][8]}) chính là mẫu được khoanh đỏ ở slide 12; cột BMI là một feature ở slide 13; cột Outcome là label ở slide 14.</p>
    </div>
  );
}
