"use client";

import React, { useState } from "react";

/* ---------- Bản đồ khái niệm AI, ML, DL, Data Science + bài gọi đúng tên ---------- */
const CONCEPTS = [
  { key: "ai", name: "AI", goal: "Đưa ra hành động từ dữ liệu", note: "Vòng ngoài cùng: mọi hệ thống nhận dữ liệu rồi hành động. Có thể có hoặc không có phần học.", ex: "Điều hòa tự chỉnh nhiệt độ theo cảm biến" },
  { key: "ml", name: "Machine Learning", goal: "Học hỏi từ dữ liệu", note: "Nằm trong AI: quy tắc không do người viết mà do máy học từ ví dụ.", ex: "Bộ lọc spam học từ email đã gán nhãn" },
  { key: "dl", name: "Deep Learning", goal: "Học hỏi từ RẤT NHIỀU dữ liệu", note: "Nằm trong ML: dùng mạng nơ-ron nhiều tầng, cần lượng dữ liệu rất lớn.", ex: "Nhận diện khuôn mặt từ hàng triệu ảnh" },
  { key: "ds", name: "Data Science", goal: "Tạo ra giá trị từ dữ liệu", note: "Giao với cả ba vòng trên: dùng ML như một công cụ, nhưng còn gồm thống kê, kiến thức ngành, trực quan hóa, kỹ thuật dữ liệu.", ex: "Phân tích doanh thu để tư vấn mở chi nhánh" },
] as const;

const JOBS = [
  { t: "Bộ lọc spam học từ 10.000 email đã được gán nhãn spam hay không.", a: "ml" },
  { t: "Mạng nơ-ron 50 tầng nhận diện khuôn mặt từ hàng triệu bức ảnh.", a: "dl" },
  { t: "Nhóm phân tích dùng thống kê, kiến thức ngành và lập trình để trả lời câu hỏi kinh doanh.", a: "ds" },
  { t: "Hệ thống tự điều chỉnh nhiệt độ phòng theo số liệu cảm biến bằng quy tắc cố định.", a: "ai" },
  { t: "Một đường thẳng học từ dữ liệu để dự đoán giá nhà theo diện tích.", a: "ml" },
] as const;

const SEVEN = [
  { n: 1, name: "Thu thập dữ liệu", q: "Có dữ liệu nào, nhãn đến từ đâu?", out: "Bảng dữ liệu thô có nhãn", bug: "Nhãn sai hoặc không đại diện cho tình huống thật", href: "/01-machine-learning/labeled-data" },
  { n: 2, name: "Thống kê mô tả", q: "Dữ liệu trông thế nào, có gì lạ?", out: "Danh sách vấn đề cần xử lý (số 0 vô lý, lệch, outlier)", bug: "Bỏ qua bước này rồi huấn luyện ngay", href: "/01-machine-learning/descriptive-statistics" },
  { n: 3, name: "Tiền xử lý", q: "Làm sạch và biến đổi ra sao?", out: "Dữ liệu sạch, cùng thang, đã mã hóa", bug: "Rò rỉ: fit scaler, imputer trên cả test", href: "/01-machine-learning/missing-values-outliers" },
  { n: 4, name: "Trực quan hóa", q: "Hình vẽ nói gì?", out: "Hiểu biết về phân bố, quan hệ giữa các cột", bug: "Chọn hình theo thói quen thay vì theo câu hỏi", href: "/01-machine-learning/data-visualization" },
  { n: 5, name: "Xây dựng và huấn luyện model", q: "Chọn model nào, học ra sao?", out: "Model đã học tham số", bug: "Chọn model phức tạp trước khi có baseline", href: "/02-supervised-learning/supervised-algorithms" },
  { n: 6, name: "Đánh giá", q: "Tốt đến đâu, sai kiểu nào?", out: "Điểm trên dữ liệu chưa thấy, confusion matrix", bug: "Chấm trên dữ liệu đã học; chọn model bằng bộ test", href: "/01-machine-learning/classification-metrics" },
  { n: 7, name: "Triển khai", q: "Đưa vào dùng thật thế nào, theo dõi ra sao?", out: "Model chạy trong sản phẩm", bug: "Dữ liệu thật khác dữ liệu lúc học (trôi dữ liệu)", href: "" },
] as const;

export default function FlowMap({ props }: { props?: string }) {
  const mode = (props ?? "").trim() || "concepts";
  const [sel, setSel] = useState(0);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [step, setStep] = useState(0);

  if (mode === "pipeline7") {
    const s = SEVEN[step];
    return (
      <div className="w-box">
        <div className="reader-label" style={{ margin: 0 }}>Bấm từng bước của dự án ML</div>
        <div className="w-seg" style={{ margin: ".6rem 0" }}>
          {SEVEN.map((x, i) => <button key={x.n} type="button" className={step === i ? "on" : ""} onClick={() => setStep(i)}>{x.n}</button>)}
        </div>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>Bước {s.n}</span><b style={{ fontSize: 18 }}>{s.name}</b></div>
          <div><span>Câu hỏi của bước</span><small style={{ fontSize: 15 }}>{s.q}</small></div>
          <div><span>Đầu ra</span><small style={{ fontSize: 15 }}>{s.out}</small></div>
          <div><span>Lỗi hay gặp</span><small style={{ fontSize: 15 }}>{s.bug}</small></div>
          {s.href && <div><span>Học ở</span><a href={s.href} className="reader-btn">Mở bài tương ứng →</a></div>}
        </div>
        <p className="w-note">Đường đi không phải đường thẳng: ở bước 6 thấy điểm kém thì quay về bước 2, 3 hoặc 1.</p>
      </div>
    );
  }

  const c = CONCEPTS[sel];
  const job = JOBS[qi];
  const done = Object.keys(picked).length;
  const right = Object.entries(picked).filter(([i, v]) => JOBS[+i].a === v).length;
  return (
    <div className="w-box">
      <div className="reader-label" style={{ margin: 0 }}>Bấm từng khái niệm</div>
      <div className="w-seg" style={{ margin: ".6rem 0" }}>
        {CONCEPTS.map((x, i) => <button key={x.key} type="button" className={sel === i ? "on" : ""} onClick={() => setSel(i)}>{x.name}</button>)}
      </div>
      <div className="w-grid2">
        <svg viewBox="0 0 260 200" width="100%" role="img" aria-label="Các vòng tròn lồng nhau">
          <circle cx="110" cy="100" r="90" fill="none" stroke={sel === 0 ? "var(--r-accent)" : "var(--r-line)"} strokeWidth={sel === 0 ? 3 : 1.5} />
          <circle cx="110" cy="120" r="62" fill="none" stroke={sel === 1 ? "var(--r-accent)" : "var(--r-line)"} strokeWidth={sel === 1 ? 3 : 1.5} />
          <circle cx="110" cy="138" r="33" fill="none" stroke={sel === 2 ? "var(--r-accent)" : "var(--r-line)"} strokeWidth={sel === 2 ? 3 : 1.5} />
          <ellipse cx="185" cy="105" rx="58" ry="52" fill="none" stroke={sel === 3 ? "var(--r-accent)" : "var(--r-muted)"} strokeWidth={sel === 3 ? 3 : 1.5} strokeDasharray="5 4" />
          <text x="110" y="28" textAnchor="middle" fontSize="11" fill="var(--r-muted)">AI</text>
          <text x="110" y="76" textAnchor="middle" fontSize="11" fill="var(--r-muted)">ML</text>
          <text x="110" y="142" textAnchor="middle" fontSize="11" fill="var(--r-muted)">DL</text>
          <text x="205" y="100" textAnchor="middle" fontSize="11" fill="var(--r-muted)">Data</text>
          <text x="205" y="114" textAnchor="middle" fontSize="11" fill="var(--r-muted)">Science</text>
        </svg>
        <div className="w-metrics" style={{ gridTemplateColumns: "1fr" }}>
          <div><span>{c.name} (theo slide 5)</span><b style={{ fontSize: 17 }}>{c.goal}</b></div>
          <div><span>Ý nghĩa</span><small style={{ fontSize: 14.5 }}>{c.note}</small></div>
          <div><span>Ví dụ</span><small style={{ fontSize: 14.5 }}>{c.ex}</small></div>
        </div>
      </div>

      <div className="reader-label" style={{ margin: "1.2rem 0 .3rem" }}>Gọi đúng tên · {done}/{JOBS.length} đã chọn, đúng {right}</div>
      <p style={{ margin: "0 0 .5rem", fontSize: 16 }}>{job.t}</p>
      <div className="w-seg">
        {CONCEPTS.map((x) => {
          const chosen = picked[qi];
          const cls = chosen === x.key ? (x.key === job.a ? "right" : "wrong") : "";
          return <button key={x.key} type="button" className={cls} onClick={() => setPicked((p) => ({ ...p, [qi]: x.key }))}>{x.name}</button>;
        })}
      </div>
      {picked[qi] && <p className="w-note">{picked[qi] === job.a ? "Đúng." : `Chưa đúng: đáp án là ${CONCEPTS.find((x) => x.key === job.a)?.name}.`} Luôn chọn vòng nhỏ nhất đúng với việc đó (Deep Learning cũng là Machine Learning, và cũng là AI).</p>}
      <div style={{ marginTop: ".6rem" }}>
        <button type="button" className="reader-btn" onClick={() => setQi((qi + 1) % JOBS.length)}>Việc tiếp theo →</button>
      </div>
    </div>
  );
}
