"use client";

import React, { useState } from "react";

const KINDS = ["Binary", "Multiclass", "Multilabel", "Regression"] as const;
type Kind = (typeof KINDS)[number];

const HINT: Record<Kind, string> = {
  Binary: "Loss thường dùng: log loss (cross-entropy); metric: precision, recall, F1.",
  Multiclass: "Loss thường dùng: cross-entropy nhiều lớp; metric: accuracy, F1 trung bình theo lớp.",
  Multilabel: "Mỗi nhãn là một câu hỏi có/không riêng; metric tính theo từng nhãn.",
  Regression: "Loss thường dùng: MSE hoặc MAE; metric: MAE, RMSE, R².",
};

const CASES: { t: string; ans: Kind; why: string }[] = [
  { t: "\"Email này là spam hay không phải spam?\"", ans: "Binary", why: "Hai nhóm, mỗi email thuộc đúng một nhóm (slide 26: một thứ hoặc thứ kia)." },
  { t: "\"Ảnh này là sushi, steak hay pizza?\"", ans: "Multiclass", why: "Nhiều hơn hai nhóm, nhưng mỗi ảnh vẫn thuộc đúng một nhóm." },
  { t: "\"Bài báo này nên gắn những thẻ (tag) nào?\"", ans: "Multilabel", why: "Mỗi bài báo có thể có nhiều thẻ cùng lúc (nhiều lựa chọn nhãn cho mỗi mẫu)." },
  { t: "Ước tính giá một căn nhà theo diện tích, số tầng, vị trí.", ans: "Regression", why: "Đầu ra là một số liên tục (giá nhà), đúng ví dụ của slide 25." },
  { t: "Phát hiện một giao dịch ngân hàng có gian lận hay không.", ans: "Binary", why: "Hai nhóm: gian lận hoặc không (slide 25: fraud detection)." },
  { t: "Dự báo nhiệt độ ngày mai là bao nhiêu độ C.", ans: "Regression", why: "Đầu ra là một số đo liên tục (temperature forecast)." },
  { t: "Nhận ra một bông hoa là hồng, cúc hay hướng dương.", ans: "Multiclass", why: "Ba nhóm loại trừ nhau (slide 25: flowers)." },
  { t: "Dự đoán giá cổ phiếu ngày mai là bao nhiêu (một con số).", ans: "Regression", why: "Đoán một số. (Nếu hỏi 'ngày mai giá tăng hay giảm' thì lại là Binary: cùng dữ liệu, khác bài toán.)" },
];

/** Tám tình huống: chọn dạng bài toán, nhận phản hồi, lý do và loss/metric đi kèm. */
export default function ScenarioCards() {
  const [picked, setPicked] = useState<Record<number, Kind>>({});
  const right = Object.entries(picked).filter(([i, v]) => CASES[+i].ans === v).length;
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: tám tình huống, dạng bài toán nào?</span>
        <span style={{ fontSize: 14, color: "var(--r-muted)" }}>Đã chọn {Object.keys(picked).length}/{CASES.length}, đúng {right}</span>
      </div>
      {CASES.map((c, i) => {
        const p = picked[i];
        return (
          <div key={i} style={{ padding: ".65rem 0", borderTop: i ? "1px dashed var(--r-line)" : "none" }}>
            <div style={{ fontSize: 15.5 }}>{i + 1}. {c.t}</div>
            <div className="w-seg" style={{ marginTop: ".4rem" }}>
              {KINDS.map((k) => <button key={k} type="button" className={p === k ? (k === c.ans ? "right" : "wrong") : ""} onClick={() => setPicked((x) => ({ ...x, [i]: k }))}>{k}</button>)}
            </div>
            {p && <p className="w-note" style={{ marginTop: ".3rem" }}>{p === c.ans ? "Đúng. " : `Chưa đúng, đáp án là ${c.ans}. `}{c.why} {HINT[c.ans]}</p>}
          </div>
        );
      })}
    </div>
  );
}
