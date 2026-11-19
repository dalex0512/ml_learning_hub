"use client";

import React, { useState } from "react";

type Animal = "dog" | "cat";
const PRED: Animal[] = ["dog", "cat", "dog", "dog", "cat", "cat", "dog"];
const LABEL: Animal[] = ["dog", "dog", "cat", "dog", "cat", "dog", "dog"];
const EMOJI: Record<Animal, string> = { dog: "🐶", cat: "🐱" };
const CELLS = ["TP", "FP", "FN", "TN"] as const;
type Cell = (typeof CELLS)[number];

function truth(pos: Animal, pred: Animal, label: Animal): Cell {
  if (pred === pos) return label === pos ? "TP" : "FP";
  return label === pos ? "FN" : "TN";
}

/** Tự xếp bảy ảnh dog/cat vào bốn ô; đổi lớp dương thì đáp án đổi. */
export default function ConfusionSorter() {
  const [pos, setPos] = useState<Animal>("dog");
  const [picked, setPicked] = useState<(Cell | null)[]>(Array(7).fill(null));

  const reset = (p: Animal) => { setPos(p); setPicked(Array(7).fill(null)); };
  const answered = picked.filter(Boolean).length;
  const correct = picked.filter((c, i) => c && c === truth(pos, PRED[i], LABEL[i])).length;
  const counts: Record<Cell, number> = { TP: 0, FP: 0, FN: 0, TN: 0 };
  PRED.forEach((p, i) => { counts[truth(pos, p, LABEL[i])]++; });
  const neg: Animal = pos === "dog" ? "cat" : "dog";

  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: xếp từng ảnh vào đúng ô</span>
        <span className="w-seg">
          <button type="button" className={pos === "dog" ? "on" : ""} onClick={() => reset("dog")}>Dương = dog</button>
          <button type="button" className={pos === "cat" ? "on" : ""} onClick={() => reset("cat")}>Dương = cat</button>
        </span>
      </div>
      <p className="w-note" style={{ marginTop: ".2rem" }}>Mỗi hàng: ảnh thật và lời model nói. Dương = {pos}, Âm = {neg}. Chọn ô cho từng ảnh.</p>

      <div>
        {PRED.map((p, i) => {
          const t = truth(pos, p, LABEL[i]);
          const c = picked[i];
          return (
            <div key={i} className="w-sort-row">
              <span className="w-sort-img">
                <span style={{ fontSize: 26 }}>{EMOJI[LABEL[i]]}</span>
                <small>ảnh {i + 1}: thật là {LABEL[i]}, model nói <b>{p}</b></small>
              </span>
              <span className="w-seg">
                {CELLS.map((cell) => (
                  <button
                    key={cell}
                    type="button"
                    className={c === cell ? (cell === t ? "right" : "wrong") : ""}
                    onClick={() => setPicked((arr) => arr.map((v, j) => (j === i ? cell : v)))}
                  >{cell}</button>
                ))}
              </span>
            </div>
          );
        })}
      </div>

      <p className="w-note">
        {answered === 0 && "Gợi ý: nhìn chữ sau (Positive/Negative) là model đoán gì, chữ trước (True/False) là lời đoán đúng hay sai."}
        {answered > 0 && answered < 7 && `Đã xếp ${answered}/7, đúng ${correct}.`}
        {answered === 7 && (correct === 7 ? "Đúng cả bảy ảnh." : `Đúng ${correct}/7. Ô viền đỏ là chỗ cần xem lại.`)}
      </p>

      <table className="w-matrix" style={{ marginTop: ".6rem" }}>
        <thead><tr><th></th><th>Đoán {pos} (+)</th><th>Đoán {neg} (−)</th></tr></thead>
        <tbody>
          <tr><th>Thật {pos} (+)</th><td className="ok"><small>TP</small>{answered === 7 && correct === 7 ? counts.TP : "?"}</td><td className="bad"><small>FN</small>{answered === 7 && correct === 7 ? counts.FN : "?"}</td></tr>
          <tr><th>Thật {neg} (−)</th><td className="bad"><small>FP</small>{answered === 7 && correct === 7 ? counts.FP : "?"}</td><td className="ok"><small>TN</small>{answered === 7 && correct === 7 ? counts.TN : "?"}</td></tr>
        </tbody>
      </table>
      <p className="w-note">Ma trận chỉ hiện số khi bạn xếp đúng cả bảy ảnh.</p>
    </div>
  );
}
