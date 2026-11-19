"use client";

import React, { useState } from "react";

const ITEMS = [
  { key: "hist", q: "Một cột phân bố thế nào?", chart: "Histogram (hoặc density)", img: "hist", code: 'data.hist(bins=25)   # hoặc data.plot(kind="density", subplots=True, layout=(3, 3))',
    read: "Mỗi cột hiện hình dạng phân bố: Glucose gần đối xứng nhưng có một cột nhỏ ở 0; Insulin dồn rất mạnh về 0 và có đuôi dài bên phải; Age lệch phải. Nhìn số bin: quá ít che chi tiết, quá nhiều gây nhiễu." },
  { key: "box", q: "So sánh các nhóm, tìm điểm lạ?", chart: "Box plot", img: "box", code: 'data.boxplot(column="Glucose", by="Outcome")',
    read: "Hộp từ Q1 đến Q3, vạch là trung vị, ria 1.5 × IQR, chấm ngoài là outlier tiềm năng. Glucose: trung vị 140 (nhóm bệnh) so với 107; năm chấm thấp nhất là các số 0 thiếu trá hình. BMI có 11 chấm ở 0 và 8 chấm rất cao." },
  { key: "scatter", q: "Hai biến liên hệ thế nào?", chart: "Scatter plot", img: "scatter", code: 'plt.scatter(data["Glucose"], data["BMI"], c=data["Outcome"])',
    read: "Mỗi điểm là một bệnh nhân. Nhóm bệnh (đỏ) lệch sang Glucose cao nhưng chồng lấn với nhóm không bệnh nhiều: một cặp cột chưa đủ để tách. Hàng điểm sát trục ở BMI = 0 và cột ở Glucose = 0 là số 0 thiếu." },
  { key: "corr", q: "Cột nào tương quan với cột nào?", chart: "Correlation matrix (heatmap có số)", img: "corr", code: 'sns.heatmap(data.corr(), annot=True)   # hoặc data.corr()',
    read: "Đọc số trong ô, không chỉ màu. Glucose với Outcome 0.47 là cao nhất; cặp feature mạnh nhất là Pregnancies với Age 0.54. Chỉ đo quan hệ tuyến tính, và số 0 thiếu làm các hệ số bị kéo xuống." },
  { key: "matrix", q: "Nhìn mọi cặp một lượt?", chart: "Scatter matrix", img: "matrix", code: "from pandas.plotting import scatter_matrix\nscatter_matrix(data)",
    read: "Đường chéo là histogram từng cột, các ô còn lại là scatter từng cặp. Chậm và rối khi nhiều cột, nhưng thấy được quan hệ cong hoặc nhóm tách rời mà hệ số r không thấy." },
] as const;

/** Chọn câu hỏi, xem hình tương ứng vẽ từ chính bộ Diabetes, kèm cách đọc và code. */
export default function VizChooser() {
  const [k, setK] = useState(0);
  const it = ITEMS[k];
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Bắt đầu từ câu hỏi, rồi chọn hình</div>
      <div className="w-seg" style={{ margin: ".6rem 0" }}>
        {ITEMS.map((x, i) => <button key={x.key} type="button" className={k === i ? "on" : ""} onClick={() => setK(i)}>{x.q}</button>)}
      </div>
      <div className="w-metrics" style={{ gridTemplateColumns: "1fr", marginBottom: ".6rem" }}>
        <div><span>Hình phù hợp</span><b style={{ fontSize: 18 }}>{it.chart}</b></div>
      </div>
      <img src={`/plots/viz/${it.img}-light.png`} alt={it.chart} style={{ maxWidth: "100%", margin: "0 auto", display: "block" }} />
      <img src={`/plots/viz/${it.img}-dark.png`} alt={it.chart} style={{ maxWidth: "100%", margin: "0 auto", display: "block" }} />
      <p className="w-note"><strong>Cách đọc:</strong> {it.read}</p>
      <pre style={{ margin: ".6rem 0 0", padding: ".7rem 1rem", background: "var(--r-code)", border: "1px solid var(--r-line)", borderRadius: 8, fontSize: 13.5, overflowX: "auto" }}><code>{it.code}</code></pre>
    </div>
  );
}
