"use client";

import React, { useState } from "react";

type Data = "color" | "size";
type Enc = "alpha" | "order" | "onehot";

const DATA: Record<Data, { name: string; values: string[]; ordered?: string[] }> = {
  color: { name: "Color (nominal: không thứ tự)", values: ["Red", "Green", "Blue", "Black"] },
  size: { name: "Size (ordinal: XS < S < M < L < XL)", values: ["XS", "S", "M", "L", "XL"], ordered: ["XS", "S", "M", "L", "XL"] },
};

function codes(d: Data, e: Enc): Record<string, number[]> {
  const vals = DATA[d].values;
  const out: Record<string, number[]> = {};
  if (e === "onehot") {
    const cols = [...vals].sort(); // sklearn sắp cột theo bảng chữ cái
    vals.forEach((v) => (out[v] = cols.map((c) => (c === v ? 1 : 0))));
  } else if (e === "alpha") {
    const s = [...vals].sort();
    vals.forEach((v) => (out[v] = [s.indexOf(v)]));
  } else {
    const o = DATA[d].ordered ?? vals;
    vals.forEach((v) => (out[v] = [o.indexOf(v)]));
  }
  return out;
}
const dist = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));

/** Cùng một cột chữ, ba cách mã hóa: xem mã số và khoảng cách giữa các giá trị. */
export default function EncodeTable() {
  const [d, setD] = useState<Data>("color");
  const [e, setE] = useState<Enc>("alpha");
  const c = codes(d, e);
  const vals = DATA[d].values;
  const encLabel: Record<Enc, string> = {
    alpha: "Đánh số theo bảng chữ cái (mặc định)",
    order: d === "size" ? "Ordinal đúng thứ tự (chỉ rõ categories)" : "Đánh số theo thứ tự ta liệt kê",
    onehot: "One-hot",
  };
  let note = "";
  if (d === "color" && e !== "onehot") note = "Các màu không có thứ tự, nhưng mã số bắt model tin rằng màu có mã 0 gần màu có mã 1 hơn màu có mã 3: khoảng cách giả.";
  if (d === "color" && e === "onehot") note = "Mọi cặp màu cách đều √2 ≈ 1.414: không còn thứ tự giả. Đổi lại là 4 cột thay vì 1 (thưa, nhiều số 0).";
  if (d === "size" && e === "alpha") note = "Mặc định sklearn sắp theo chữ cái: L=0, M=1, S=2, XL=3, XS=4. Thứ tự này sai: XL (3) nhỏ hơn XS (4)!";
  if (d === "size" && e === "order") note = "Chỉ rõ categories theo thứ tự thật: XS=0, S=1, M=2, L=3, XL=4. Thứ tự đúng, dù khoảng cách giữa các cỡ chưa chắc đều.";
  if (d === "size" && e === "onehot") note = "One-hot bỏ mất thông tin thứ tự: XS giống XL như XS giống S. Chỉ dùng khi thứ tự không quan trọng.";
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: mã hóa cột chữ</span>
        <span className="w-seg">{(Object.keys(DATA) as Data[]).map((k) => <button key={k} type="button" className={d === k ? "on" : ""} onClick={() => setD(k)}>{k === "color" ? "Color" : "Size"}</button>)}</span>
      </div>
      <p className="w-note" style={{ marginTop: ".3rem" }}>{DATA[d].name}</p>
      <div className="w-seg" style={{ margin: ".4rem 0" }}>
        {(["alpha", "order", "onehot"] as Enc[]).map((k) => <button key={k} type="button" className={e === k ? "on" : ""} onClick={() => setE(k)}>{encLabel[k]}</button>)}
      </div>
      <div className="w-grid2">
        <div className="w-table-wrap">
          <table className="w-bars">
            <thead><tr><th>Giá trị</th><th>Mã số</th></tr></thead>
            <tbody>{vals.map((v) => <tr key={v}><td>{v}</td><td>{c[v].join(", ")}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="w-table-wrap">
          <table className="w-bars">
            <thead><tr><th>Khoảng cách</th>{vals.map((v) => <th key={v}>{v}</th>)}</tr></thead>
            <tbody>{vals.map((a) => <tr key={a}><td>{a}</td>{vals.map((b) => <td key={b}>{dist(c[a], c[b]).toFixed(2)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
      <p className="w-note">{note}</p>
    </div>
  );
}
