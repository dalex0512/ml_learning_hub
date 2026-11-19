"use client";

import React, { useState } from "react";

const KINDS = ["Classification", "Regression", "Clustering", "Association", "Reinforcement"] as const;
type Kind = (typeof KINDS)[number];

const WHERE: Record<Kind, string> = {
  Classification: "Supervised learning (có nhãn, nhãn là nhóm)",
  Regression: "Supervised learning (có nhãn, nhãn là số)",
  Clustering: "Unsupervised learning (không nhãn, gom nhóm)",
  Association: "Unsupervised learning (không nhãn, tìm luật đi cùng nhau)",
  Reinforcement: "Reinforcement learning (thưởng và phạt)",
};

const CASES: { t: string; ans: Kind; why: string }[] = [
  { t: "Phát hiện giao dịch gian lận từ lịch sử giao dịch đã được gán nhãn gian lận hay không.", ans: "Classification", why: "Có nhãn, và nhãn là một nhóm (gian lận hoặc không)." },
  { t: "Dự đoán điểm thi của học sinh từ số giờ học.", ans: "Regression", why: "Có nhãn (điểm thật) và nhãn là một con số." },
  { t: "Chia 100.000 khách hàng thành các nhóm có hành vi giống nhau; chưa ai gán nhãn nhóm.", ans: "Clustering", why: "Không có nhãn; ta để máy tự tìm các nhóm tự nhiên." },
  { t: "Gợi ý sản phẩm theo luật \"người mua A thường mua thêm B\" rút ra từ giỏ hàng.", ans: "Association", why: "Không có đáp án sẵn; tìm các thứ hay xuất hiện cùng nhau (hệ thống gợi ý)." },
  { t: "Xe tự lái học cách lái bằng cách thử, nhận điểm thưởng khi đi đúng và bị phạt khi va chạm.", ans: "Reinforcement", why: "Phản hồi là thưởng và phạt sau hành động, không có đáp án cho từng mẫu." },
  { t: "Chấm điểm rủi ro tín dụng của khách thành một số từ 0 đến 100 dựa trên hồ sơ cũ có kết quả trả nợ.", ans: "Regression", why: "Có nhãn và nhãn là một con số (slide xếp Risk assessment vào Regression)." },
];

/** Cây hỏi chọn phương thức học + sáu tình huống để tự đặt vào đúng nhóm. */
export default function ParadigmChooser() {
  const [labeled, setLabeled] = useState<boolean | null>(null);
  const [numeric, setNumeric] = useState<boolean | null>(null);
  const [reward, setReward] = useState<boolean | null>(null);
  const [picked, setPicked] = useState<Record<number, Kind>>({});

  let result = "";
  if (labeled === true && numeric === true) result = "Supervised, Regression";
  if (labeled === true && numeric === false) result = "Supervised, Classification";
  if (labeled === false && reward === true) result = "Reinforcement learning";
  if (labeled === false && reward === false) result = "Unsupervised (Clustering hoặc Association)";
  const right = Object.entries(picked).filter(([i, v]) => CASES[+i].ans === v).length;

  const yn = (v: boolean | null, set: (b: boolean) => void) => (
    <span className="w-seg">
      <button type="button" className={v === true ? "on" : ""} onClick={() => set(true)}>Có</button>
      <button type="button" className={v === false ? "on" : ""} onClick={() => set(false)}>Không</button>
    </span>
  );

  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Cây câu hỏi chọn phương thức học</div>
      <div style={{ margin: ".7rem 0", display: "grid", gap: ".6rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem 1rem", alignItems: "center" }}>
          <span>1. Mỗi mẫu có <strong>đáp án (nhãn)</strong> sẵn không?</span>{yn(labeled, (b) => { setLabeled(b); setNumeric(null); setReward(null); })}
        </div>
        {labeled === true && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem 1rem", alignItems: "center" }}>
            <span>2. Nhãn là <strong>một con số</strong> (không phải một nhóm)?</span>{yn(numeric, setNumeric)}
          </div>
        )}
        {labeled === false && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem 1rem", alignItems: "center" }}>
            <span>2. Có <strong>điểm thưởng hoặc phạt</strong> sau mỗi hành động?</span>{yn(reward, setReward)}
          </div>
        )}
      </div>
      {result && <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}><div><span>Kết luận</span><b style={{ fontSize: 18 }}>{result}</b></div></div>}

      <div className="reader-label" style={{ margin: "1.2rem 0 .3rem" }}>Đặt sáu tình huống vào đúng nhóm · đúng {right}/{Object.keys(picked).length}</div>
      {CASES.map((c, i) => {
        const p = picked[i];
        return (
          <div key={i} style={{ padding: ".6rem 0", borderTop: "1px dashed var(--r-line)" }}>
            <div style={{ fontSize: 15.5 }}>{c.t}</div>
            <div className="w-seg" style={{ marginTop: ".4rem" }}>
              {KINDS.map((k) => <button key={k} type="button" className={p === k ? (k === c.ans ? "right" : "wrong") : ""} onClick={() => setPicked((x) => ({ ...x, [i]: k }))}>{k}</button>)}
            </div>
            {p && <p className="w-note" style={{ marginTop: ".3rem" }}>{p === c.ans ? "Đúng. " : `Chưa đúng, đáp án là ${c.ans}. `}{c.why} Thuộc: {WHERE[c.ans]}.</p>}
          </div>
        );
      })}
    </div>
  );
}
