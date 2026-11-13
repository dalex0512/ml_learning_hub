# Prompt cho Codex — đợt 4: Polynomial Regression (slide 67+)

Dán nguyên khối dưới đây cho Codex. Repo: `d:\ML_VNAI`, nhánh `main`.
Chủ repo chưa gửi ghi chú tay cho phần này; nguồn là slide thật. Nếu sau này có
ghi chú, dán thêm vào cuối khối prompt.

```
Dự án ML Learning Hub (Next.js 14, ghi chú tự học ML của chủ repo). Đã xong:
module 01 (23 bài) và module 02 có 2 bài: 01-supervised-algorithms, 02-linear-
regression (slide 64–66). Chủ repo vừa học xong Polynomial Regression (bắt đầu từ
slide 67). Việc của bạn: viết bài Polynomial Regression cho module 02.

ĐỌC TRƯỚC, theo thứ tự:
1. codex-handoff.md — cú pháp khối, quy trình viết bài, pitfalls, checklist verify.
2. project-brief.md — design Notebook, quy ước nội dung.
3. supervised-linear-regression-report.md — đợt trước làm gì, ranh giới slide,
   hạ tầng module 02 đã xử lý.
4. content/02-supervised-learning/02-linear-regression.md — BÀI MẪU CHÍNH: giọng
   văn, độ chi tiết, cách dựng :::worked, :::pitfall, quiz. Bài mới phải cùng
   chuẩn (hoặc kỹ hơn) và phải NỐI TIẾP bài này.
5. 01-supervised-algorithms.md (dòng Polynomial trong bảng đang ghi "Sắp có").

YÊU CẦU CỐT LÕI: DỄ HIỂU + CHI TIẾT
Người đọc là chủ repo đang tự học, về sau ôn lại và chuẩn bị phỏng vấn. Mỗi ý
phải đi theo thứ tự: trực giác (hình dung, ví dụ đời thường) → công thức → ví dụ
số làm tay từng bước → code → cách hiểu sai thường gặp. Cụ thể:
- Mỗi ký hiệu giải thích ngay lần đầu xuất hiện (x², β2, bậc d, ma trận thiết kế…).
- Không nhảy bước trong ví dụ tay: viết ra từng phép tính, đừng "dễ thấy rằng".
- Câu ngắn, thuật ngữ tiếng Anh kèm giải thích tiếng Việt lần đầu.
- Khi một ý khó, cho ví dụ đối lập (đúng vs sai, bậc thấp vs bậc cao).
- Không độn: chi tiết nghĩa là đủ bước và đủ lý do, không phải dài.

BƯỚC 0 — Xem slide thật (bắt buộc, không đoán)
- Ảnh ở public/slides/slide-NNN.webp. Báo cáo đợt trước ghi slide 67 là tiêu đề
  Polynomial Regression (đường cong, so sánh simple linear vs polynomial). Xem từ
  slide 67 tới khi sang thuật toán khác (dự kiến Logistic Regression ở slide
  68–69 — phải xác nhận bằng mắt, đừng tin số này). Ghi lại mỗi slide: công thức,
  ký hiệu, chú thích tay, hình, ưu/nhược trên slide.
- Phạm vi bài = slide Polynomial Regression thôi. Slide chủ đề khác chỉ liệt kê
  trong báo cáo, KHÔNG viết bài.
- Bám đúng ký hiệu và cách trình bày trên slide (ví dụ dạng y = β0 + β1x + β2x² +
  … + βdx^d nếu slide ghi vậy); nếu slide dùng ký hiệu khác bài Linear Regression
  thì giữ theo slide và ghi chú tương ứng.

PHẦN A — Bài mới: content/02-supervised-learning/03-polynomial-regression.md
Nếu slide chỉ đủ cho nội dung ngắn thì bài vẫn phải đầy đủ phần giải thích nền
(vì sao cần, hoạt động ra sao, rủi ro); phần mở rộng ngoài slide thêm ngắn và
ghi rõ nhãn "ngoài slide". Khung gợi ý, sắp xếp lại được:

1. Vì sao cần nó (hook): đưa dữ liệu cong (ví dụ quãng đường phanh theo tốc độ,
   hoặc giá nhà theo diện tích bão hoà dần). Cho thấy đường thẳng khớp tệ: tính
   residual/MSE của Linear Regression trên dữ liệu đó để thấy "tệ" bằng số, không
   chỉ bằng hình. Câu hỏi dẫn: làm sao uốn được đường mà không bỏ cách học cũ?

2. Ý tưởng cốt lõi: tạo thêm feature x², x³,… rồi vẫn chạy Linear Regression.
   Làm rõ điểm hay gây hiểu lầm nhất: "polynomial" là cong theo x, nhưng vẫn
   TUYẾN TÍNH THEO THAM SỐ β — nên tái dùng OLS/loss của bài 02 và [[bài:loss-function]].
   Có :::compare hoặc hình mô tả: dữ liệu gốc [x] → sau biến đổi [x, x²].

3. Công thức: bậc 1, 2, 3, d; ý nghĩa từng β (β0 điểm cắt, β1 độ dốc "gốc", β2
   độ cong…; diễn giải từng hệ số riêng KHÔNG còn trực quan như linear — nêu rõ).
   Trường hợp nhiều biến: có thêm số hạng tích chéo x1·x2 (số feature tăng nhanh:
   công thức tổ hợp C(n+d, d) − 1; ví dụ n=10, d=3 ra bao nhiêu feature — tính bằng
   Python rồi ghi).

4. :::worked tính tay đầy đủ, dữ liệu nhỏ (5–6 điểm, số đẹp), bậc 2:
   - bước 1 lập bảng thêm cột x²; bước 2 viết hệ phương trình / ma trận thiết kế X
     và vector y; bước 3 giải β (normal equation β = (XᵀX)⁻¹Xᵀy — tính tay hoặc
     rút gọn có chú thích, kiểm bằng numpy.polyfit/sklearn); bước 4 dự đoán điểm
     mới; bước 5 residual, MSE, RMSE; bước 6 so với đường thẳng trên cùng dữ
     liệu. Chọn số để tính tay thực sự làm được (đối xứng, x centered nếu cần) và
     nói rõ vì sao chọn vậy.

5. Chọn bậc d — phần quan trọng nhất của bài:
   - Underfitting (bậc quá thấp) ↔ overfitting (bậc quá cao). Bảng demo bằng số:
     cùng một bộ dữ liệu có nhiễu, bậc 1, 2, 3, 5, 9 → MSE train vs MSE validation
     (chạy Python, ghi số thật, seed cố định). Thấy rõ: train MSE giảm mãi, val
     MSE giảm rồi tăng. Nối [[bài:train-test-split]], [[bài:k-fold-cross-validation]]
     (chọn d bằng cross-validation), [[bài:loss-function]].
   - Với N điểm, bậc N−1 đi qua mọi điểm (train error = 0): giải thích vì sao đó
     là "học thuộc", không phải học được.
   - Hiện tượng Runge/đuôi vọt khi ngoại suy (extrapolation): bậc cao dự đoán
     ngoài miền dữ liệu cực tệ — ví dụ số cụ thể.
   - Cách chống overfit mức khái niệm (ngoài slide, ghi nhãn): chọn bậc bằng CV,
     regularization Ridge/Lasso (chỉ nhắc tên + 1 câu, KHÔNG viết bài riêng), thêm
     dữ liệu.

6. Vấn đề số học & thực hành:
   - x, x², x³ tương quan rất mạnh với nhau → đa cộng tuyến
     ([[bài:correlation-multicollinearity]]), hệ số bất ổn. Giải bằng scale/center
     ([[bài:feature-scaling]]) hoặc đa thức trực giao (nhắc tên). Ví dụ số: tính
     corr(x, x²) cho x từ 1..10 rồi sau khi center.
   - Outlier ảnh hưởng càng mạnh ở bậc cao ([[bài:missing-values-outliers]]).
   - Quy trình đúng trong sklearn: PolynomialFeatures(degree, include_bias=False)
     + StandardScaler + LinearRegression gói trong Pipeline; fit CHỈ trên train
     (tránh leakage, nhắc lại pitfall của bài 02).

7. :::code — code sklearn chạy được, từng bước chú thích: sinh dữ liệu cong có
   nhiễu (ghi rõ dữ liệu giả lập, seed), tách train/test, vòng lặp thử các bậc,
   in bảng MSE train/val, vẽ đường fit từng bậc bằng matplotlib (nối
   [[bài:data-visualization]]), chọn bậc tốt nhất bằng cross_val_score. Chạy thật
   và chỉ ghi kết quả đã chạy ra.

8. :::compare Linear vs Polynomial: khi nào dùng, ưu/nhược theo slide (bắt được
   quan hệ cong, vẫn dùng OLS; bậc cao dễ overfit, ngoại suy tệ, khó diễn giải,
   số feature bùng nổ).

9. :::pitfall (mỗi bẫy 1–3 câu + ví dụ): "polynomial = phi tuyến nên khác linear
   hoàn toàn" (sai: tuyến tính theo β); chọn bậc bằng train error; ngoại suy;
   quên scale; dùng bậc cao cho dữ liệu ít điểm; đọc hệ số riêng lẻ như linear.

10. :::recap + :::quiz + :::next:
   - Quiz tầng A ≥4 (tính tay: bậc 2 dự đoán 1 điểm, đếm số feature sinh ra,
     đọc bảng train/val chọn bậc…), tầng B ≥4 (EN kèm theo): "Vì sao Polynomial
     Regression vẫn gọi là linear model?", "Làm sao chọn bậc?", "Overfitting biểu
     hiện thế nào trên đường cong?", "Khác Linear Regression ở đâu?", tầng C ≥3
     (WANT kèm theo): tình huống doanh nghiệp — dự báo doanh số theo thời tiết/
     nhiệt độ (quan hệ hình chuông), định giá bất động sản theo diện tích có điểm
     bão hoà, model train 0.99 R² nhưng tuần sau sai bét (nguyên nhân: bậc cao +
     ngoại suy). Mỗi đáp án có khung: ý chính 1 câu → giải thích → ví dụ.
   - :::next: nói bài sau là chủ đề kế tiếp trên slide (xác nhận từ slide, dự kiến
     Logistic Regression) và vì sao cần nó; CHƯA có bài thì chỉ ghi tên, KHÔNG
     tạo [[bài:…]] chết.

Chuẩn kỹ thuật cho bài:
- Frontmatter: title, order: 3, description (1 câu có nội dung thật), slides (range
  thật), needs [linear-regression, loss-function, train-test-split, feature-scaling],
  tags (polynomial-regression, polynomial-features, overfitting, underfitting,
  degree, bias-variance …).
- Cấu trúc khung nhẹ: :::intro → :::slides → thân bài tự do → :::recap → :::quiz →
  :::next. Chèn [[slide:N]] chỉ cho slide thật đã xem.
- MỌI con số trong bài (ví dụ tay, bảng MSE, số feature, corr…) chạy lại bằng
  Python trước khi ghi; đưa script kiểm vào báo cáo hoặc thư mục tạm, không để
  trong content. Không dùng ký tự "½" trong code block (xem pitfalls handoff);
  dùng x^2 hoặc x**2 trong code, x² trong văn xuôi.
- Nếu slide có công thức hoặc ví dụ số riêng, dùng ví dụ của slide làm một ví dụ
  trong bài (giải thích lại cho dễ hiểu) chứ không bỏ.

PHẦN B — Liên kết & cập nhật
- roadmap.json: thêm topic polynomial-regression (order 3, file 03-polynomial-
  regression.md) vào module 02, group "Mô hình hồi quy".
- 01-supervised-algorithms.md: dòng Polynomial trong bảng đổi "Sắp có" thành
  [[bài:polynomial-regression]]; sửa mọi câu "chưa được viết" liên quan.
- 02-linear-regression.md: :::next đổi từ "chưa được viết" sang link
  [[bài:polynomial-regression]], thêm 1 câu "đường thẳng không đủ khi dữ liệu cong".
  Chỉ sửa chỗ cần, không viết lại bài.
- Bài 07/08 (train-test-split, k-fold) hoặc 06 (loss-function): thêm 1 link tự nhiên
  tới Polynomial ở chỗ nói chọn siêu tham số / overfitting nếu có chỗ hợp lý. Không
  ép link vào chỗ không hợp.
- Kiểm module index, bản đồ phụ thuộc (module 02 giờ 3 bài), /phong-van (câu B/C
  mới hiện và lọc được), project-brief.md (danh sách bài module 02).
- grep chỗ hard-code số bài (vd "25 bài", "2 bài") trong UI/README, sửa.

VERIFY
- npm run build pass; /02-supervised-learning/polynomial-regression được sinh;
  không warning mới.
- Bài render đúng: TOC, slide chip mở đúng slide, link chéo (cả sang module 01),
  quiz 3 tầng, code có nút copy, bảng không tràn ngang ở 390px.
- Prev/next trong module 02 hoạt động (02 ↔ 03).
- Chạy lại mọi phép tính ví dụ tay + bảng bậc d bằng Python; con số trong bài khớp.
- Đọc lại bài như người mới: có chỗ nào nhảy bước, ký hiệu chưa giải thích, hoặc
  thuật ngữ xuất hiện trước định nghĩa thì sửa.

GIT
- Nhánh feat/supervised-polynomial-regression từ main. Commit nhỏ theo nhóm
  (feat(content) bài mới; fix(content) liên kết bài cũ; docs cho brief).
- KHÔNG push, KHÔNG merge. Dừng và báo cáo để chủ repo duyệt.

BÁO CÁO CUỐI (ngắn): ánh xạ slide 67+ → bài; slide thuộc chủ đề kế tiếp (chưa
viết) kèm số slide; phần ngoài slide đã thêm; điểm slide khó đọc/mơ hồ cần chủ repo
xác nhận; bảng số chính đã kiểm (bậc d → MSE train/val); việc chưa làm.
```
