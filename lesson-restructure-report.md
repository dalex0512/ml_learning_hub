# Báo cáo chuyển khung ML Learning Hub

Ngày kiểm chứng: 12/11/2026. Nhánh: `feat/lesson-restructure`.

## Phạm vi đã chuyển

| Nhóm | Các bài |
|---|---|
| Nền tảng | 01 AI/ML/DL/DS; 02 Dataset/Feature; 03 Learning paradigms; 04 X/y; 05 Model training |
| Chia dữ liệu và đánh giá | 07 Train/Validation/Test; 08 K-fold; 09 Stratified K-fold; 10 Classification/Regression; 11 Confusion Matrix |
| Metric và quy trình | 13 ROC/AUC; 14 MAE/RMSE; 15 ML Pipeline; 16 Descriptive Statistics; 17 Missing/Outliers |
| Tiền xử lý nâng cao | 19 Categorical Encoding; 20 Correlation/Multicollinearity; 21 Imbalanced Data |

Ba bài pilot 06, 12, 18 giữ nguyên nội dung. Tất cả 21 bài có frontmatter,
intro, slide nhúng, recap, quiz A/B/C, next và liên kết hợp lệ. Nội dung cũ
được giữ, tách thành mục theo khái niệm; mọi code block cũ của 18 bài được
đối chiếu với commit gốc để tránh làm mất ví dụ. Câu hỏi cũ chuyển vào tầng A.

Toàn module có **259 câu**: A = 107, B = 87, C = 65. Phần bổ sung gồm 13 câu A,
72 câu B và 54 câu C. Mỗi câu B có EN, mỗi câu C có WANT. Có 27 quan hệ tiên quyết,
không có vòng phụ thuộc. `roadmap.json` chỉ thêm trường `group`, giữ nguyên các
trường định danh, thứ tự, tên và file.

## Nội dung bổ sung và hiệu chỉnh đáng chú ý

- 01/03: lượng dữ liệu không định nghĩa DL; annotation có thể tận dụng tín
  hiệu nghiệp vụ; recommendation có nhiều cách đặt bài toán. Lời gợi nhớ
  trên slide được giữ nhưng có chú thích giới hạn.
- 07–09: phân biệt ảnh hưởng gián tiếp của validation với update tham số;
  split theo thời gian/nhóm, fit tiền xử lý trong fold; stratification
  không cân bằng dữ liệu và bị giới hạn bởi số mẫu thiểu số.
- 09: bảng slide 24 giữ số Cat 25/20/30/15, Dog 0/5/0/3. Tổng Dog chỉ 8
  thay vì 10, fold cũng không gần bằng nhau. Không tự sửa ô theo phỏng đoán.
- 13: AUC cho nửa điểm cặp hòa; AP là precision có trọng số theo mức tăng
  recall, khác diện tích hình thang dưới PR. Ví dụ precision khoảng 0.17
  nay nêu rõ TP = 8, FP = 40. Chọn threshold trên validation.
- 14: MAE là mean absolute error, không phải median; MAE/RMSE đối xứng,
  không tự thể hiện chi phí thiếu hàng lớn hơn dư hàng. Nêu giới hạn R².
- 15: thêm bản đồ Step 2–3 với link chính xác tới 16–21; các bước 4–7 tiếp
  tục ở module sau. Module 02–06 vẫn chưa có bài, không tự tạo nội dung.
- 16/17: mean/median chỉ gợi ý hình dạng; missing indicator không tự khử
  bias MNAR; imputation và gắn cờ outlier cần kiểm chứng, không xóa máy móc.
- 19: dummy variable trap có liên hệ intercept; khoảng cách đều là giả
  định của model dùng mã ordinal; unknown category, hashing, embedding,
  target encoding trong fold và chi phí cardinality cao.
- 20: ngưỡng |r| > 0.7 là quy ước, không là lệnh bỏ cột; pairwise r thấp
  chưa loại trừ phụ thuộc nhiều biến. Bỏ NaN theo cặp không tự khôi phục
  “tương quan thật”; nêu selection bias và giới hạn diễn giải nhân quả.
- 21: resampling/weight/threshold can thiệp ở ba nơi khác nhau; SMOTE
  không bảo đảm phân bổ chính xác bằng nhau quanh từng điểm; ADASYN có
  thể khuếch đại nhiễu. Sửa F1 RandomUnderSampler từ **0.656 → 0.655**:
  TP = 39, FP = 26, FN = 15 nên F1 = 78/119 ≈ 0.655462.

Tình huống phỏng vấn tập trung vào zip/ID, ít nhãn, nhãn hành vi có bias,
time/group leakage, chi phí train/CV, fraud hiếm và công suất duyệt, nhu
cầu hàng hóa, category mới khi serving và hệ số bất ổn do cộng tuyến.

## Hạ tầng

- `/phong-van`: tái sử dụng parser bài học, mặc định B+C (152 câu); lọc
  tầng/bài/tag, tìm kiếm có hoặc không dấu, tự test, mở đáp án, đếm câu mở,
  rút câu ngẫu nhiên, làm lại và link về bài.
- `/{moduleId}`: nhóm bài và mô tả frontmatter, lưới phụ thuộc có mũi tên,
  mọi node và tiên quyết bấm được, trạng thái module trống.
- Breadcrumb và tiêu đề trạm roadmap dẫn tới trang module; footer bài
  dẫn tới ngân hàng phỏng vấn. Giữ `FlipLink` và hiệu ứng Prev/Next.
- Xóa nhánh legacy, ID legacy, mục lục mặc định và switch subhead.
  Giữ renderer công thức và cú pháp đáp án cũ.
- Sửa parser chuẩn hóa CRLF/LF: build đơn thuần không phát hiện trường
  hợp parser trả về 0 section. Script kiểm tra nay kiểm nội dung đã parse.
- Bảng rộng cuộn trong khung; mục lục có vùng cuộn và ghim theo chiều dài
  bài, tự đưa mục đang đọc vào vùng nhìn thấy. Lightbox nhận ←/→ cả khi
  nút đóng có focus; Esc đóng như trước. Thẻ Prev/Next co được khi tên bài
  dài, tránh tràn ngang desktop. Tiêu đề mục giữ dạng chữ dễ đọc, không
  lộ cú pháp chip hoặc dấu markdown trong mục lục.
- Cập nhật `project-brief.md`; 177 ảnh slide và manifest đã nằm trong git,
  không cần tạo lại. Không đổi palette, font hay hiệu ứng lật trang.

## Kiểm chứng

- `npx tsc --noEmit`: pass.
- `npx next build`: pass, sinh 32/32 trang.
- Script tạm ngoài repo: kiểm frontmatter, ID/link/needs, container/fence,
  dải slide, quiz đủ tầng và trường EN/WANT, section không rỗng, code cũ
  còn nguyên, bank key không trùng, DAG không chu trình và pilot không đổi.
- Tính lại số mới bằng Python; chạy lại code bảng Diabetes ở 15/16/17,
  encoding ở 19, Pearson/VIF/mô phỏng ở 20, resampling và CV ở 21. Thư viện
  kiểm chứng đặt ngoài repo: scikit-learn 1.9.1, imbalanced-learn 0.14.2,
  NumPy 2.5.4, pandas 3.0.5. Dữ liệu Pima tải vào scratchpad, không commit.
- Kiểm bằng Chrome headless ở 1300px và 390px: tiêu đề, nội dung section,
  quiz ba tầng, mở từng/tất cả đáp án, EN/WANT, viewer nhúng, chip slide,
  lightbox, ←/→ và Esc, tràn ngang, trang chủ/module/module trống/bank.
  Kiểm riêng tìm kiếm/lọc/tự test/rút câu và Prev/Next; duyệt ảnh chụp.
- Script và ảnh kiểm tra nằm trong `%TEMP%/ml-hub-review`, không commit.

## Điểm cần đọc với giới hạn

1. Slide 24 có lỗi số liệu nêu trên; chỉ tác giả slide mới xác nhận ô nào
   thực sự định viết. Bài không thay số gốc.
2. Các số doanh số/nhiệt độ và r ≈ 0.007, +0.96, −0.94 ở phần đọc hình
   slide 50 là ước lượng sẵn có trong nội dung cũ. Không có bảng tọa độ
   gốc để xác nhận độ chính xác; đã đặt note rõ. Ví dụ y = x² là phép
   minh họa có dữ liệu tường minh để kiểm lại.
3. Slide 49 không ghi nguồn model embedding, nên không khẳng định các
   vector là output Word2vec thật. Dùng chúng như bộ số minh họa cosine.
4. Bảng Diabetes minh họa trên dataset/seed cụ thể, không là kết luận
   tổng quát hay hướng dẫn ra quyết định cho bệnh nhân. Phần so nhiều
   phương án trên test là minh họa; quy trình lựa chọn thực tế cần CV
   trong development pool và một test độc lập.

Nguồn kỹ thuật đối chiếu: [scikit-learn — Average Precision](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html),
[OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html),
[imbalanced-learn — data leakage](https://imbalanced-learn.org/stable/common_pitfalls.html).
