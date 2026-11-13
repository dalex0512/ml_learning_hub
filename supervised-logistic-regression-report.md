# Đợt 5 — Hồi quy logistic (Logistic Regression)

Kiểm chứng ngày 13/11/2026. Nhánh `feat/supervised-logistic-regression` rẽ từ
`feat/supervised-polynomial-regression` tại **7469897**: nhánh Polynomial chưa
merge vào main theo `git branch --merged main`. Không push, không merge.
Các file prompt chưa track của chủ repo được giữ nguyên.

## Slide đã xem bằng ảnh

| Slide | Nội dung và ánh xạ |
|---|---|
| 68 | Logistic Regression; S-curve, Threshold Value=0.5, điểm y=0.3/y=0.8; φ(z)=1/(1+e^(−z)), z từ −8 tới 8, φ(0)=0.5. Bài 04 `logistic-regression`. |
| 69 | Scatter hai class 0/1, đường phân tách đỏ; hình S và GOOD/BAD. Cùng bài 04. |
| 70 | Đổi tiêu đề sang Support Vector Machine, hình hyperplane/support vector/maximum margin. Chủ đề kế tiếp, **chưa viết**. |

Ranh giới xác nhận là **68–69**. Không có bảng tọa độ gốc hoặc chú thích tay
bổ sung cần chép từ ảnh. Chữ trên slide đọc được; không có điểm mờ cần xác nhận.
Các câu giản lược trên 69 được giữ ý và nhận xét, không đoán số từ scatter.

## Nội dung, tên tiếng Việt và ghi chú chủ repo

- Frontmatter và roadmap cùng tên **Hồi quy logistic (Logistic Regression)**,
  đã kiểm H1 desktop/mobile. Order 4, group “Phân loại”, needs đúng năm bài yêu cầu.
- Ghi chú “output Linear → sigmoid”: giữ cấu trúc z tuyến tính → φ(z) →
  P(y=1|x) → threshold → class; làm rõ **không fit OLS rồi gắn sigmoid**.
  z cũng là log-odds; φ/σ là hai ký hiệu cùng hàm.
- “Hàm xích moi”: dùng đúng “hàm sigmoid (hàm logistic)”; với z hữu hạn,
  miền toán học là **(0,1)**, không gồm hai đầu. Máy tính có thể làm tròn.
- “Giảm ngưỡng tăng recall”: bảng 10 hồ sơ cố định dưới đây và từng chuyển
  FN→TP/TN→FP. Recall tăng **hoặc giữ**, precision thường giảm nhưng không
  bảo đảm đơn điệu; nêu validation, chi phí FN/FP và liên hệ ROC/imbalanced.
- “Ưu/nhược tương ứng Linear”: bảng phỏng vấn so task, output, link, loss,
  solver, metric và rủi ro; chỉ tương đồng khung tuyến tính, không đồng nhất
  độ nhạy outlier hay cách học. Logistic mô hình hóa log-odds tuyến tính.
- “Discrete functions” trên slide 69 được sửa nghĩa: target/class rời rạc,
  xác suất nội bộ liên tục; không dùng binary Logistic dự đoán giá liên tục.
- “Ít quan sát hơn feature”: giải thích nguy cơ quá nhiều tham số, tách hoàn
  toàn/hệ số bất ổn; đây là cảnh báo, **không cấm** Logistic có regularization.
  Phần regularization L1/L2/C được đánh dấu ngoài slide.
- “Linearity rare in practice”: nêu đúng giả định theo log-odds, không lặp
  thành kết luận phổ quát; feature đa thức/tương tác có thể uốn ranh giới gốc.

Ngoài slide đã gắn nhãn: hook OLS tám điểm; sigmoid năm giá trị; odds/logit;
dự đoán và log loss năm điểm; gradient một bước; bảng threshold/ROC;
so Linear/Logistic; Pipeline và demo giả lập train/validation/test;
multiclass OvR/softmax ngắn; calibration, imbalance, cộng tuyến và các bẫy.
Quiz **A/B/C=5/6/4**, B có EN, C có WANT, đáp án ý chính → lý do → ví dụ.
Không thêm plot vì viewer slide và các bảng đã đủ cho bài; không dùng AI.
Dùng fenced Python có nút copy, không dùng `:::code` vì parser không hỗ trợ.

## Số đã kiểm bằng Python

Mười hồ sơ tự soạn (không phải dữ liệu slide):

| t | TP | FP | FN | TN | Precision | Recall |
|---|---|---|---|---|---|---|
| 0.7 | 2 | 1 | 3 | 4 | 0.666667 | 0.400000 |
| 0.5 | 3 | 2 | 2 | 3 | 0.600000 | 0.600000 |
| 0.3 | 4 | 3 | 1 | 2 | 0.571429 | 0.800000 |

- ROC (FPR,TPR): (0.2,0.4), (0.4,0.6), (0.6,0.8).
- OLS hook: intercept −5/14, slope 4/21; x=1/8 → −0.166667/1.166667.
- φ(−4/−2/0/2/4) ≈ 0.017986/0.119203/0.500000/0.880797/0.982014.
- Loss từng mẫu: 0.018150/0.126928/0.693147/0.126928/0.018150;
  tổng **0.983303**, trung bình **0.196661**. y=0,p=0.99 → **4.605170**.
- e^0.7≈2.013753; p ban đầu 0.5 → p mới 0.668188.
- Gradient x=2,y=1, β=(0,0), α=0.1 → β mới=(0.05,0.1), z=0.25,
  p=0.562177, loss từ 0.693147 xuống 0.575939.

Demo giả lập seed 42, NumPy **2.5.4**, sklearn **1.9.1**, split **240/80/80**:
intercept −0.477270; hệ số sau StandardScaler 1.131367, −0.409148.

| t trên validation | TP | FP | FN | TN | Precision | Recall |
|---|---|---|---|---|---|---|
| 0.7 | 8 | 1 | 24 | 47 | 0.888889 | 0.250000 |
| 0.5 | 20 | 8 | 12 | 40 | 0.714286 | 0.625000 |
| 0.3 | 30 | 24 | 2 | 24 | 0.555556 | 0.937500 |

Mục tiêu chốt trước recall validation≥0.8 chọn **t=0.3** trong ba ứng viên.
Test: `[[TN,FP],[FN,TP]]=[[22,26],[3,29]]`, precision **0.527273**,
recall **0.906250**, ROC-AUC **0.723307**. Không tune bằng test hoặc refit sau
chọn threshold trong demo. Quy ước bằng ngưỡng của bài được nêu riêng với
quy tắc `predict` sklearn; không có tie ở các ngưỡng dùng trong demo.

## Liên kết và kiểm chứng

- Overview/Polynomial và module 01 bài 10/12/13/21 có link thật. Bài 11
  không có lời hứa Logistic cần thay nên giữ nguyên. Metrics sửa các câu
  tuyệt đối “không thể tăng cả hai bằng ngưỡng” cho đúng precision không đơn
  điệu; giữ toàn bộ code cũ, số liệu và số câu quiz.
- Brief cập nhật hiện trạng 27 bài (23+4); các con số cũ được đánh dấu lịch
  sử. Không thấy số bài hard-code cần sửa trong UI; không có README trong repo.
- Không sửa TypeScript/React/CSS: module index/map/bank tự đọc roadmap/parser.
- `npm run build`: **pass 38/38 trang**, route Logistic sinh tĩnh; không warning
  build mới. `npx tsc --noEmit`, `git diff --check`: pass.
- Parser thật kiểm **27 bài, 347 câu** (A 140/B 119/C 88), **207 câu B/C**,
  module 02 có **52 câu**, 44 quan hệ needs. ID/link/frontmatter/slides,
  container/fence, EN/WANT và graph không lỗi; không có chu trình/key trùng.
- Python chạy nguyên code trong bài, đối chiếu mọi bảng số/loss/odds/gradient
  bằng assertions, không warning; số xuất bản khớp độ chính xác sáu chữ số.
- Chrome headless **1300px/390px**: H1 tiếng Việt, TOC/scrollspy, slide
  viewer 68↔69/←/→/Esc và chip riêng 68/69, quiz 5/6/4/mở từng và tất cả,
  EN/WANT, copy đúng Python, không cuộn ngang toàn trang qua từng section.
  Bảng/code rộng cuộn trong khung; đã duyệt ảnh title, công thức, worked,
  bảng threshold, quiz, map và bank. Prev/Next Polynomial↔Logistic pass.
- Module 02 hiện 4 bài/nhóm Phân loại, map có node và tiên quyết chéo module;
  bank lọc bài/tag có 10 câu B/C, 15 câu cả ba tầng; module 01 vẫn 23 bài.

Script và ảnh kiểm chứng tạm ở `%TEMP%/ml-hub-round5/`:
`verify.py`, `check.cjs`, `browser.cjs`, `browser-results.json`, ảnh PNG.
Không đưa script kiểm vào content hoặc commit. Chưa viết SVM (slide 70),
chưa push/merge; chờ chủ repo duyệt nội dung và ba commit theo nhóm.
