# Đợt 3 — mở module 02 và Linear Regression

Ngày kiểm chứng: 12/11/2026. Nhánh: `feat/supervised-linear-regression`.

## Ánh xạ đã xem bằng ảnh: slide 64+ → bài

| Slide | Nội dung thực tế | Xử lý |
|---|---|---|
| 64 | Supervised Learning algorithms: cột Regression có Linear, Polynomial; Classification có Logistic, SVM*, KNN*, Naive Bayes, Decision Tree*, Random Forest*. “*Could also be used here” chỉ phiên bản hồi quy của bốn họ có sao. | Module 02 bài 01 `supervised-algorithms` |
| 65 | Linear Regression: experience trên x, Salary trên y, đám điểm tăng quanh đường; simple một input, multiple từ hai input; phù hợp linear dataset. Công thức y = β0 + β1x1 + … + βpxp + ε, nhãn predictor/coefficient/linear predictor/response/noise. | Module 02 bài 02 `linear-regression` |
| 66 | Hình quan hệ tăng và giảm (Negative Linear Relationship); bảng GOOD: đơn giản/hiệu quả, regularization có thể giảm overfit, câu “linearly separable”; BAD: giả định independent data, noise/overfit/outlier. | Cùng bài 02; có note giới hạn câu chữ |
| 67 | Tiêu đề Polynomial Regression; đường cong và hình so simple linear / polynomial. | Chủ đề kế tiếp, **chưa viết** |

Ranh giới rõ ở slide 67, nên dừng xem tại đó đúng yêu cầu; không suy đoán số
slide của Logistic/SVM/KNN hoặc dải Polynomial tiếp theo. Không có ghi chú tay
do chủ repo cung cấp ở đợt này. Không lấy tọa độ của scatter Salary làm dữ liệu
chính xác vì ảnh không có bảng tọa độ gốc.

## Nội dung đã thêm

- `01-supervised-algorithms.md`: bản đồ slide 64, cách đọc dấu sao; bảng một
  dòng ý tưởng/ưu/nhược cho mỗi họ, bảng chọn ứng viên, baseline và validation.
  Chỉ Linear Regression có link bài riêng; các họ còn lại ghi “Sắp có”.
- `02-linear-regression.md`: slide 65–66, simple/multiple, β0/βi/ε, phân biệt
  quan sát/prediction/residual; OLS và các cách học ở mức nhập môn, ví dụ tay,
  code sklearn, bảng giả định, outlier/cộng tuyến/scale, leakage/ngoại suy/nhân quả.
- Bài 06, 10, 14 của module 01 chỉ thêm link tự nhiên sang Linear Regression
  và câu EN; giữ code, ví dụ và quiz cũ. Các bài module 01 khác không đổi.
- Mỗi bài mới có intro, viewer, recap, quiz A/B/C, next và khối EN.
  Bài bản đồ: 4/4/3 câu; Linear Regression: 5/5/3 câu.

**Ngoài slide, đã ghi nhãn trong bài:** mô tả ý tưởng/ưu nhược ở bản đồ;
OLS/SSE/MSE, công thức slope/intercept và normal equation/gradient descent;
ví dụ tự soạn, code, chẩn đoán giả định và các bẫy triển khai. Không viết sâu
thuật toán tiếp theo hoặc tự thêm bài Ridge/Lasso/Polynomial.

Các điểm slide được làm rõ, không cần đoán lại nguồn:

1. “Linearly separable” trên slide 66 là từ thường dùng cho classification;
   hồi quy cần xem cấu trúc trung bình có điều kiện tuyến tính.
2. “Independent data” không có nghĩa mọi feature phải độc lập. Quan sát/sai số
   phụ thuộc và cộng tuyến giữa feature là các vấn đề khác nhau.
3. Regularization có thể giảm overfit nhưng không bật sẵn trong
   `LinearRegression()`; chưa viết bài riêng.
4. Normality/homoscedasticity liên quan tính chất thống kê và suy luận, không
   phải yêu cầu để gọi fit. ε khác residual; hệ số không tự là hiệu ứng nhân quả.

## Hạ tầng và điều hướng

- **Sửa lỗi bản đồ phụ thuộc:** trang module trước đây lọc graph theo module
  rồi component dùng chính tập đó để lookup, khiến tiên quyết module 01 bị
  ẩn ở module 02. Nay hiển thị node của module hiện tại nhưng lookup toàn
  graph; link tiên quyết giữ đúng `/01-machine-learning/...`.
- **Trang chủ:** bỏ hard-code current module = 01. Dấu “bạn đang ở đây” lấy
  module cuối có topics trong roadmap, hiện là 02; giữ design/animation cũ.
- Roadmap thêm đúng hai topic, order 1/2 trong module 02, ID duy nhất toàn site.
  Nhóm “Bản đồ thuật toán” và “Mô hình hồi quy”; module 01 không đổi roadmap.
- Resolver `[[bài:id]]`, needs/backlinks, generateStaticParams, breadcrumb,
  progress theo module và bank đã đọc toàn roadmap nên không cần sửa.
  Không có sitemap riêng trong repo để cập nhật.
- Prev/Next vốn nối danh sách toàn roadmap: **RegEx ↔ bản đồ Supervised ↔
  Linear Regression**. Đã kiểm click hai chiều qua ranh giới module; giữ FlipLink.
- `/phong-van` tự gom bài module 02 và lọc theo bài/tag được; không thêm bộ lọc
  module mới vì yêu cầu hiện tại dùng được qua bộ lọc bài đã có.
- Không thấy số “23 bài” hard-code trong UI/README cần thay; module 01 vẫn
  thực sự có 23 bài. Brief cập nhật module 02 mở, module 03–06 còn trống;
  báo cáo các đợt trước giữ nguyên làm lịch sử.

## Kiểm chứng

- `npx tsc --noEmit` và `npm run build`: pass, **36/36 trang**, gồm index
  module 02 và hai bài mới; không phát sinh warning build mới.
- Script tạm dùng parser thật kiểm **25 bài, 319 câu** (A 130, B 108, C 81),
  **189 câu B/C**, 35 quan hệ tiên quyết. Frontmatter, ID/order/title, link,
  needs, slide range, container/fence, số câu và EN/WANT hợp lệ; không chu trình,
  không trùng key. Đối chiếu main: code cũ còn nguyên, 20 bài module 01 khác
  không thay nội dung (chuẩn hóa CRLF/LF khi so).
- Python chạy cả hai code block mới không warning, NumPy 2.5.4 / sklearn 1.9.1.
  Tự tính: β̂0 = 2.2, β̂1 = 0.6; residual −0.8/0.6/1/−0.6/−0.2;
  SSE 2.4, MSE 0.48, RMSE 0.6928203, MAE 0.64; x = 6 → 5.8.
  Thay y cuối thành 20 cho intercept −3.8, slope 3.6. Kiểm lại cả đổi đơn vị
  hệ số 0.03 tỉ/m² và phép tăng 10 m² trong bài/quiz.
- Code giả lập 200 căn, seed 42, train/test 150/50: OLS test MAE 0.1904,
  RMSE 0.2412, R² 0.9427; baseline mean train 0.8770 / 1.0119 / −0.0088.
  Ghi rõ dữ liệu giả, không dùng test tune model và phân biệt mean baseline
  train với mean tập đánh giá trong định nghĩa R².
- Chrome headless 1300px và 390px: hai bài mới, TOC/scrollspy, quiz 3 tầng,
  đáp án từng câu/tất cả, EN/WANT, slide chip/lightbox/←/→/Esc, copy Python,
  không tràn ngang toàn trang khi đọc từng section. Bảng/công thức/code rộng
  cuộn bên trong khung theo hạ tầng có sẵn. Đã duyệt ảnh top, worked, formula,
  code, quiz và dependency map.
- Kiểm module 01 đủ 23 bài, link ngược ở 06/10/14, module trống 03, trang chủ
  đánh dấu 02, bank lọc hai bài mới (7 và 8 câu B/C), link bank đúng module.
  Console không lỗi JS.
- `git diff --check`: pass. Script và screenshot ở `%TEMP%/ml-hub-round3`,
  không commit; không thêm dependency frontend hoặc đổi design Notebook.

## Giới hạn và trạng thái bàn giao

Không có điểm ảnh nào cần chủ repo xác nhận để hoàn tất phạm vi 64–66.
Các câu chữ chưa chuẩn của slide đã giữ dấu vết và chú thích, không âm thầm
coi là định lý. Chưa viết Polynomial (bắt đầu 67) và các thuật toán sau đó.

Commit nhỏ trên nhánh riêng; **không push, không merge**. Giữ nguyên hai file
prompt chưa track của chủ repo, không đưa vào commit.

Nguồn đối chiếu phần bổ sung: [sklearn LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html),
[Linear Models](https://scikit-learn.org/stable/modules/linear_model.html),
[statsmodels diagnostics](https://www.statsmodels.org/stable/diagnostic.html).
