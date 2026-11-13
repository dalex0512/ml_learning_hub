# Prompt cho Codex — đợt 3: Supervised Learning, bắt đầu từ Linear Regression (slide 64+)

Dán nguyên khối dưới đây cho Codex. Repo: `d:\ML_VNAI`, nhánh `main`.
Lần này chủ repo chưa gửi ghi chú tay; nguồn duy nhất là slide thật.

```
Dự án ML Learning Hub (Next.js 14, ghi chú tự học ML của chủ repo). Module 01
(Machine Learning, 23 bài) đã xong theo khung linh hoạt (:::intro/:::slides/
:::formula/:::worked/:::compare/:::pitfall/:::recap/:::quiz/:::next, quiz 3 tầng
A/B/C, link [[bài:id]] [[slide:N]], slide viewer). Chủ repo vừa học đến slide 64:
mở đầu Supervised Learning Algorithms và Linear Regression. Việc của bạn: mở
module 02 và viết bài đầu tiên.

ĐỌC TRƯỚC, theo thứ tự:
1. codex-handoff.md — cú pháp, quy trình viết bài, pitfalls, checklist verify.
2. project-brief.md — design Notebook, quy ước nội dung.
3. lesson-restructure-report.md — kết quả đợt 1.
4. Bài mẫu giọng văn + độ sâu: 06-loss-function.md (thiên toán, có :::worked),
   12-classification-metrics.md (dài, quiz đầy), 22-data-visualization.md (có code).
Mọi quy ước trong codex-handoff.md vẫn áp dụng nguyên.

BƯỚC 0 — Xem slide thật (bắt buộc, không đoán)
- Ảnh slide ở public/slides/slide-NNN.webp. Xem slide 64 trở đi cho đến hết
  phần Linear Regression (dự kiến slide 64–66; dừng khi sang thuật toán khác,
  ví dụ Polynomial/Logistic). Chủ repo mới học TỚI slide 64, nên:
    · Slide 64 (bảng thuật toán Supervised: regression vs classification, dấu *
      = dùng được cho cả hai) và slide Linear Regression ngay sau nếu có → viết.
    · Từ slide chủ đề khác trở đi (Polynomial, Logistic, SVM, KNN, …) → KHÔNG viết
      bài, chỉ liệt kê tên + số slide trong báo cáo để đợt sau làm.
  Ghi lại mỗi slide nói gì (công thức, ký hiệu, chú thích tay, hình minh hoạ).
- Nếu ranh giới "Linear Regression kết thúc ở đâu" không rõ, chọn theo nội dung
  slide và nêu lý do trong báo cáo.

PHẦN A — Dựng module 02
- roadmap.json: module "02-supervised-learning" hiện topics rỗng. Thêm bài vào
  đó; kiểm xem mọi nơi đọc roadmap (app/[moduleId]/page.tsx module index,
  dependency map, lib/roadmap.ts, trang chủ, prev/next flip, /phong-van, sitemap
  nếu có) xử lý được module thứ hai chưa — module 01 là module duy nhất từng
  có bài, nên có thể có chỗ hard-code. Sửa chỗ nào vỡ, build phải sinh đủ trang
  /02-supervised-learning và từng bài.
- Prev/next giữa bài cuối module 01 (23) và bài đầu module 02: kiểm hành vi,
  hợp lý thì cho nối liền; nếu code chỉ nối trong một module thì để nguyên và
  nêu trong báo cáo, đừng tự thiết kế lại.
- Thư mục content/02-supervised-learning/ (tên file NN-slug.md, NN theo thứ tự
  trong module).

PHẦN B — Bài mới
Dự kiến 2 bài (điều chỉnh theo slide thật; nếu slide chỉ đủ cho 1 bài thì gộp,
đừng độn):
1. 01 Tổng quan thuật toán Supervised (slide 64) — bản đồ: Regression vs
   Classification, các thuật toán trên slide (Linear, Polynomial, Logistic, SVM,
   KNN, Naive Bayes, Decision Tree, Random Forest), dấu * = dùng được cả hai.
   Chức năng bài: "bản đồ module 02" — mỗi thuật toán một dòng "bài toán gì,
   ý tưởng 1 câu, ưu/nhược" và link tới bài tương ứng khi đã có (chưa có thì
   ghi "sắp có", KHÔNG tạo link chết). Nối ngược về [[bài:classification-vs-regression]]
   và [[bài:model-training-pipeline]]. Bảng "chọn thuật toán theo bài toán".
2. 02 Linear Regression — nội dung theo slide thật. Khung gợi ý, bỏ ý nào slide
   không đụng tới thì đừng bịa quá xa (có thể thêm phần mở rộng ngắn, ghi rõ
   "ngoài slide"):
   - Bài toán: dự đoán y liên tục từ x; đường thẳng "khớp nhất" nghĩa là gì.
   - Mô hình: simple (ŷ = β0 + β1x) và multiple (ŷ = β0 + β1x1 + … + βnxn);
     ý nghĩa β0 (intercept), βi (hệ số: x_i tăng 1 đơn vị, giữ các biến khác cố
     định, ŷ đổi βi); ký hiệu dùng đúng như slide.
   - Học tham số = tối thiểu hoá loss: nối [[bài:loss-function]] (MSE/L2) và
     [[bài:regression-metrics]]. Nêu 2 cách: nghiệm đóng (bình phương tối thiểu /
     normal equation) và gradient descent — mức khái niệm trừ khi slide đi sâu.
   - :::worked tính tay β0, β1 cho 4–5 điểm bằng công thức bình phương tối thiểu
     (β1 = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)², β0 = ȳ − β1x̄), rồi dự đoán + tính residual và
     MSE/RMSE. Kiểm lại bằng numpy/sklearn.
   - Giả định (tuyến tính, độc lập, phương sai sai số không đổi, sai số ~chuẩn,
     không đa cộng tuyến → nối [[bài:correlation-multicollinearity]]), và hậu quả
     khi vi phạm. Outlier ảnh hưởng mạnh vì loss bình phương
     ([[bài:missing-values-outliers]]). Cần scale feature khi nào
     ([[bài:feature-scaling]]).
   - Ưu/nhược theo slide (dễ diễn giải, nhanh; chỉ bắt quan hệ tuyến tính, nhạy
     outlier/đa cộng tuyến).
   - Code sklearn LinearRegression (fit/predict/coef_/intercept_), đánh giá
     MAE/RMSE/R² trên tập test, dùng dữ liệu giả lập hoặc sklearn.datasets,
     ghi rõ nguồn dữ liệu. R² chỉ giải thích ngắn nếu slide/bài 14 chưa có.
   - :::pitfall: extrapolation ngoài miền dữ liệu, correlation ≠ causation, R²
     cao ≠ mô hình đúng (ví dụ Anscombe), data leakage khi scale/fit trên cả
     tập.
Với mỗi bài:
  - Frontmatter đủ: title, order, description, slides (range thật), needs, tags.
  - Cấu trúc như bài mẫu: :::intro → :::slides → thân bài tự do → :::recap →
    :::quiz (A ≥4, B ≥4, C ≥2–3 câu, đáp án ẩn, B có EN, C có WANT) → :::next.
  - Câu tầng B/C hướng phỏng vấn thật: "giải thích hệ số β cho non-technical",
    "vì sao dùng bình phương mà không phải trị tuyệt đối", "R² cao nhưng dự đoán
    tệ — nguyên nhân?", "feature tương quan mạnh với nhau thì hệ số ra sao",
    tình huống định giá nhà / dự báo doanh số.
  - Mọi số liệu, ví dụ tay kiểm lại bằng Python trước khi ghi. Không dùng ký tự
    ½ trong code block (xem pitfalls).
  - [[slide:N]] chỉ trỏ tới slide thật đã xem.

PHẦN C — Liên kết ngược
- Bài 10 (classification-vs-regression), 14 (regression-metrics) và 06
  (loss-function): thêm 1 link tới Linear Regression ở chỗ tự nhiên (vd "model
  hồi quy đơn giản nhất → …"), không viết lại bài.
- Cập nhật module index, bản đồ phụ thuộc (kiểm có hiển thị module 02 và quan
  hệ chéo module: needs của bài mới trỏ sang bài module 01 thì [[bài:id]] phải
  resolve đúng URL /01-machine-learning/…; nếu resolver chỉ tìm trong cùng
  module thì sửa), /phong-van (câu B/C của module 02 tự gom và lọc được),
  project-brief.md (module 02 đã mở, danh sách bài).
- grep chỗ hard-code "23 bài"/số bài trong UI, README thì sửa.

VERIFY (như codex-handoff.md, thêm)
- npm run build pass; trang /02-supervised-learning và 2 bài mới được sinh.
- Bài mới render đúng: TOC, slide chip mở đúng slide, link chéo sang module 01
  đúng URL, quiz 3 tầng, code có nút copy, không tràn ngang ở 390px.
- Module 01 không hỏng (build vẫn đủ 23 bài, prev/next vẫn chạy).
- /phong-van có câu của module 02; dependency map hiển thị module 02.
- Chạy lại mọi phép tính ví dụ tay bằng Python.

GIT
- Nhánh feat/supervised-linear-regression từ main. Commit nhỏ theo nhóm
  (feat cho hạ tầng module 02; feat(content) từng bài; docs cho brief).
- KHÔNG push, KHÔNG merge. Dừng và báo cáo để chủ repo duyệt.

BÁO CÁO CUỐI (ngắn): ánh xạ slide 64+ → bài; danh sách slide thuộc chủ đề kế
tiếp (chưa viết); chỗ hạ tầng phải sửa để hỗ trợ module 2; ý ngoài slide đã
thêm (nếu có); điểm slide chưa rõ/khó đọc cần chủ repo xác nhận; việc chưa làm.
```
