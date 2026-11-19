"use client";

import React, { useState } from "react";
import data from "./data/describe.json";

const IMPOSSIBLE_ZERO = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"];

function note(col: string, stat: string, v: number, row: number[]): { text: string; warn: boolean } {
  const [mean, , min, q1, med, q3, max] = row;
  if (stat === "min" && v === 0 && IMPOSSIBLE_ZERO.includes(col))
    return { warn: true, text: `Giá trị nhỏ nhất của ${col} là 0: điều này không thể có thật ở người còn sống. Đây là dữ liệu thiếu bị ghi thành 0 (${data.zeros[col as keyof typeof data.zeros]} ô).` };
  if (stat === "min" && col === "Pregnancies") return { warn: false, text: "0 lần mang thai là giá trị hợp lệ (111 ô). Không phải dữ liệu thiếu." };
  if (stat === "mean" || stat === "50%") {
    const ratio = mean / (med || 1);
    return { warn: ratio > 1.5, text: `Mean = ${mean}, median = ${med}. ${ratio > 1.5 ? "Mean lớn hơn median nhiều: phân phối lệch phải, hoặc có giá trị cực lớn (và/hoặc nhiều số 0) kéo mean lên." : "Mean và median gần nhau: phân phối khá cân đối."}` };
  }
  if (stat === "25%" && q1 === 0 && IMPOSSIBLE_ZERO.includes(col)) return { warn: true, text: `Ít nhất một phần tư số ô của ${col} bằng 0: số 0 thiếu trá hình rất nhiều.` };
  if (stat === "max") {
    const far = max > 3 * q3;
    return { warn: far, text: `Max = ${max}, còn 75% giá trị ≤ ${q3}. ${far ? "Max xa 75% nhiều: kiểm tra outlier." : "Max không quá xa phân vị 75%."}` };
  }
  if (stat === "std") return { warn: false, text: `Độ trải của ${col} là ${v}. So với các cột khác: thang đo rất khác nhau (Insulin trải ~115, DPF chỉ ~0.33), nên cần scale.` };
  return { warn: false, text: `${col}, ${stat} = ${v}.` };
}

/** Bảng describe() của Diabetes: bấm một ô để đọc ý nghĩa và cảnh báo. */
export default function DescribeTable() {
  const [sel, setSel] = useState<[number, number]>([3, 2]); // Insulin, min
  const row = data.values[sel[0]];
  const n = note(data.cols[sel[0]], data.stats[sel[1]], row[sel[1]], row);
  const flagged = data.cols.filter((c, i) => IMPOSSIBLE_ZERO.includes(c) && data.values[i][2] === 0);
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Thử: bấm một ô của bảng describe()</div>
      <div className="w-table-wrap">
        <table className="w-bars" style={{ fontSize: 13 }}>
          <thead><tr><th>Cột</th>{data.stats.map((s) => <th key={s}>{s}</th>)}</tr></thead>
          <tbody>
            {data.cols.map((c, i) => (
              <tr key={c}>
                <td style={{ whiteSpace: "nowrap" }}>{c}</td>
                {data.values[i].map((v, j) => {
                  const on = sel[0] === i && sel[1] === j;
                  const bad = data.stats[j] === "min" && v === 0 && IMPOSSIBLE_ZERO.includes(c);
                  return (
                    <td key={j} onClick={() => setSel([i, j])}
                        style={{ cursor: "pointer", fontWeight: bad ? 700 : 400, color: bad ? "var(--r-accent)" : undefined, background: on ? "rgba(200,90,70,.16)" : undefined }}>{v}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-metrics" style={{ gridTemplateColumns: "1fr", marginTop: ".8rem" }}>
        <div>
          <span>{data.cols[sel[0]]} · {data.stats[sel[1]]} = {row[sel[1]]}</span>
          <small style={{ fontSize: 14.5, color: n.warn ? "var(--r-accent)" : undefined }}>{n.warn ? "Cảnh báo: " : ""}{n.text}</small>
        </div>
      </div>
      <p className="w-note">Chữ đỏ là các ô nhỏ nhất bằng 0 ở những cột không thể bằng 0 ({flagged.join(", ")}). Mọi số lấy từ bộ Diabetes 768 hàng; std ở đây là std mẫu (chia n − 1), khác một chút so với StandardScaler (chia n).</p>
    </div>
  );
}
