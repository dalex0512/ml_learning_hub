"use client";

import React, { useState } from "react";

const KINDS = ["Số đo", "Nhóm không thứ tự", "Nhóm có thứ tự", "Boolean", "Mã định danh"] as const;
type Kind = (typeof KINDS)[number];

const COLS: { name: string; sample: string; ans: Kind; why: string }[] = [
  { name: "age", sample: "39, 50, 38, 53", ans: "Số đo", why: "Tuổi cộng, trừ, trung bình đều có nghĩa; gấp đôi tuổi là gấp đôi thật." },
  { name: "workclass", sample: "Private, State-gov, Self-emp", ans: "Nhóm không thứ tự", why: "Chỉ là tên các loại việc làm; không loại nào lớn hơn loại nào." },
  { name: "education", sample: "Bachelors, HS-grad, Masters", ans: "Nhóm có thứ tự", why: "Có bậc từ thấp đến cao (HS-grad < Bachelors < Masters), nhưng khoảng cách giữa các bậc không đều." },
  { name: "education-num", sample: "13, 9, 14", ans: "Nhóm có thứ tự", why: "Là cột education đã được mã hóa thành số (slide ghi: có thể số hóa sau này). Dtype là số nhưng bản chất vẫn là bậc học, không phải số đo." },
  { name: "capital-gain", sample: "2174, 0, 14084", ans: "Số đo", why: "Số tiền: cộng trừ có nghĩa. Lưu ý nhiều số 0, có thể cần xem như một tín hiệu riêng." },
  { name: "native-country", sample: "United-States, Vietnam, Thailand", ans: "Nhóm không thứ tự", why: "Tên nước, đúng ví dụ nominal của slide: giống hoặc khác, không có thứ tự." },
  { name: "income", sample: "<=50K, >50K", ans: "Boolean", why: "Chỉ có hai giá trị đúng/sai; đây cũng là nhãn cần dự đoán." },
  { name: "PatientID", sample: "1, 2, 3 ... 768", ans: "Mã định danh", why: "Số nguyên nhưng chỉ để phân biệt người này với người kia; trung bình hay so lớn nhỏ vô nghĩa. Thường bỏ khỏi feature." },
];

/** Phân loại từng cột; có phản hồi và lý do ngay. */
export default function ColumnPeel() {
  const [picked, setPicked] = useState<Record<number, Kind>>({});
  const right = Object.entries(picked).filter(([i, v]) => COLS[+i].ans === v).length;
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: mỗi cột là loại nào?</span>
        <span style={{ fontSize: 14, color: "var(--r-muted)" }}>Đã chọn {Object.keys(picked).length}/{COLS.length}, đúng {right}</span>
      </div>
      <div>
        {COLS.map((c, i) => {
          const p = picked[i];
          return (
            <div key={c.name} style={{ padding: ".7rem 0", borderTop: i ? "1px dashed var(--r-line)" : "none" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem 1rem", alignItems: "baseline" }}>
                <code style={{ fontWeight: 700 }}>{c.name}</code>
                <span style={{ fontSize: 14, color: "var(--r-muted)" }}>{c.sample}</span>
              </div>
              <div className="w-seg" style={{ marginTop: ".4rem" }}>
                {KINDS.map((k) => (
                  <button key={k} type="button" className={p === k ? (k === c.ans ? "right" : "wrong") : ""} onClick={() => setPicked((x) => ({ ...x, [i]: k }))}>{k}</button>
                ))}
              </div>
              {p && <p className="w-note" style={{ marginTop: ".4rem" }}>{p === c.ans ? "Đúng. " : `Chưa đúng, đáp án là "${c.ans}". `}{c.why}</p>}
            </div>
          );
        })}
      </div>
      <p className="w-note">Bảy cột đầu lấy từ Adult dataset của slide 7; PatientID là cột thêm vào để làm ví dụ về mã định danh.</p>
    </div>
  );
}
