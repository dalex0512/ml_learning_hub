"use client";

import React, { useState } from "react";

type A = { name: string; reg: boolean; cls: boolean; read: "cao" | "vừa" | "thấp"; scale: boolean; lesson: string };
const ALGOS: A[] = [
  { name: "Linear Regression", reg: true, cls: false, read: "cao", scale: false, lesson: "linear-regression" },
  { name: "Polynomial Regression", reg: true, cls: false, read: "vừa", scale: true, lesson: "polynomial-regression" },
  { name: "Logistic Regression", reg: false, cls: true, read: "cao", scale: true, lesson: "logistic-regression" },
  { name: "SVM*", reg: true, cls: true, read: "thấp", scale: true, lesson: "svm" },
  { name: "KNN*", reg: true, cls: true, read: "vừa", scale: true, lesson: "k-nearest-neighbours" },
  { name: "Decision Tree*", reg: true, cls: true, read: "cao", scale: false, lesson: "decision-tree" },
  { name: "Random Forest*", reg: true, cls: true, read: "thấp", scale: false, lesson: "random-forest" },
];

/** Lọc ứng viên theo loại target và nhu cầu giải thích; hiện nhu cầu scale. */
export default function AlgoFilter() {
  const [t, setT] = useState<"reg" | "cls">("cls");
  const [need, setNeed] = useState(false);
  const list = ALGOS.filter((a) => (t === "reg" ? a.reg : a.cls) && (!need || a.read !== "thấp"));
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thu hẹp ứng viên</div>
      <div className="w-seg" style={{ margin: ".6rem 0" }}>
        <button type="button" className={t === "cls" ? "on" : ""} onClick={() => setT("cls")}>Target là nhóm</button>
        <button type="button" className={t === "reg" ? "on" : ""} onClick={() => setT("reg")}>Target là số</button>
      </div>
      <label style={{ display: "block", fontSize: 15 }}>
        <input type="checkbox" checked={need} onChange={(e) => setNeed(e.target.checked)} /> Cần giải thích được (đọc được hệ số hoặc luật)
      </label>
      <div className="w-table-wrap">
        <table className="w-bars">
          <thead><tr><th>Thuật toán</th><th>Dễ đọc</th><th>Cần scale</th><th>Bài</th></tr></thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.name}>
                <td><strong>{a.name}</strong></td>
                <td>{a.read}</td>
                <td>{a.scale ? "có" : "không"}</td>
                <td><a href={`/02-supervised-learning/${a.lesson}`}>mở bài</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="w-note">Dấu * là các họ dùng được cho cả hồi quy lẫn phân loại (chữ xanh trong slide 64). Đây là gợi ý để <strong>chọn 2 đến 3 ứng viên</strong>, không phải phán quyết: cuối cùng vẫn phải đo bằng cross-validation.</p>
    </div>
  );
}
