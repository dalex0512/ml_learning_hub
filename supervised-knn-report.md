# Đợt 7 — K láng giềng gần nhất (KNN)

Ngày 13/11/2026. Đã kiểm Git trước khi sửa: bài/ảnh SVM đã commit, không có thay
đổi chưa commit ở bài 05, nhưng `feat/supervised-svm` chưa nằm trong danh sách
merged main. Rẽ **feat/supervised-knn từ feat/supervised-svm@b7b0f3a** đúng prompt;
không tự merge SVM. Các file cần đọc đều tồn tại. Hai file prompt KNN/SVM chưa
track giữ nguyên; không push/merge trong đợt này.

## Slide và phạm vi

| Slide đã xem bằng ảnh | Nội dung → xử lý |
|---|---|
| 75 | K-Nearest-Neighbour, Before/After K-NN; Category A xanh, B cam, query xanh dương đổi màu. Chú thích “assigned to Category 1” lệch tên A → ghi note, bài dùng A/B. Không có K, tọa độ hay công thức. |
| 76–77 | Decision Tree; 76 luật nhận offer, 77 Gini → chủ đề kế tiếp, **chưa viết**. |
| 78 | Random Forest → thuật toán sau nữa, **chưa viết**. |

Đúng **một bài** `06-k-nearest-neighbours.md`, ID `k-nearest-neighbours`, order 6,
nhóm “Phân loại”, frontmatter/viewer **75**. Tiêu đề tiếng Việt đứng trước tiếng Anh.
Không đoán K=3 từ hình hoặc dựng tọa độ giả thành số slide. Không có phần ảnh mờ
cần xác nhận khác ngoài nhãn 1/A không nhất quán đã nêu.

## Đối chiếu ghi chú chủ repo

- **K=3, vote:** đúng; làm đủ đo mọi khoảng cách → lấy K gần nhất → vote. Với nhiều
  class dùng class nhiều phiếu nhất, không bắt buộc quá nửa; regression lấy mean.
- **K lẻ/hòa:** chỉ bảo đảm không hòa đếm phiếu với đúng hai class, uniform vote.
  Từ ba class trở lên vẫn có thể hòa, không phụ thuộc số class chẵn/lẻ. Weighted
  binary cũng có thể hòa; phân biệt hòa chọn neighbor ở cutoff và hòa khi vote.
- **Gỡ hòa:** bảng K=4 minh họa tăng K→B, nearest→A, mean distance→A, 1/d vote→A;
  mean distance không đồng nhất inverse-distance vote. Tăng K không luôn hết hòa.
  Đã chạy sklearn 1.9.1: uniform vote hòa nhãn chuỗi chọn lớp đầu trong classes_
  đã sắp thứ tự, không tự chọn lớp gần nhất; test Z/A và Z/B/A. Có xử lý d=0.
- **Triển khai là hệ số:** đúng cho Linear/Polynomial/Logistic khi giữ biểu diễn
  cố định, còn cần tiền xử lý. Kernel SVM giữ support vector; KNN giữ features/labels
  train, có thể thêm index. Không đồng nhất mọi SVM với một vector hệ số nhỏ.
- **100 vs một triệu mẫu:** KNN fit không tối ưu bộ hệ số, nhưng vẫn đọc/lưu/kiểm
  dữ liệu; cây tìm kiếm cần dựng index. Brute-force predict tăng theo N·D; linear
  predict theo số feature cố định, Polynomial theo số cột sau mở rộng. Bảng là
  **đếm công việc/bộ nhớ**, không phải đo số giây hay hứa latency tuyệt đối.
- **Tập lớn:** nêu giới hạn bộ nhớ/predict, KD-tree/Ball-tree/ANN/giảm mẫu/chiều,
  cân nhắc mô hình khác khi cần thời gian thực; kiểm chất lượng và chi phí thực tế.

Ngoài slide, đã gắn nhãn: khoảng cách, chọn K/tie rules, lazy/instance-based learning,
chi phí, scale/encoding/nhiễu/số chiều, regression/ngoại suy, so Logistic/SVM,
CV/GridSearch và bẫy xác suất vote. Quiz **A/B/C=6/6/4**, đủ EN/WANT.
Hai hình từ đúng code matplotlib: `public/plots/knn-neighbours.png` (K=1/3/5),
`knn-boundaries.png` (K=1/5/15), có link gốc; không dùng ảnh AI.

## Bảng số chính đã kiểm bằng Python

- q=(4,3), tám khoảng cách theo P1…P8:
  **1, √2, 2, √5, 3, √10, √13, 4**, tương ứng
  1.000000/1.414214/2.000000/2.236068/3.000000/3.162278/3.605551/4.000000.
- K=1/3/5 → **A/A/B**; K=4 hòa 2–2. Mean A=1.5, B=1.825141;
  trọng số A=1.5, B=1.154320 → tỉ lệ **0.565116/0.434884**.
- Scale ba người: q=(25,10 triệu); raw K=1 chọn B (d=35); MinMax fit train
  cho khoảng cách A/B/C **0.026926/0.875/1.007782**, chọn A. Không có nhãn thật
  query để kết luận scale này tốt nhất, chỉ minh họa đơn vị làm đổi láng giềng.
- Regression x=[1,2,4,7,10], t=[10,20,40,70,100], K=3:
  query 3→**23.333333**, query 20→**70**. sklearn dùng mean, median chỉ là quy tắc
  custom. Có thể nhận input ngoài miền nhưng trung bình với trọng số không âm
  không ngoại suy trend vượt miền target của láng giềng.
- D=20: 100/một triệu mẫu cần **2,000/20,000,000** chênh lệch feature cho mỗi query;
  chỉ X float64 **16 kB/160 MB** (thập phân), không gồm nhãn/index/bản sao/batch.

Demo giả lập make_moons 400 mẫu, noise 0.3, seed 42; development/test=300/100,
Pipeline StandardScaler→KNN; CV 5 fold stratified, scaler học riêng từng fold:

| K, Euclid + uniform | Accuracy train dev | Mean CV accuracy |
|---|---|---|
| 1 | 1.000000 | 0.803333 |
| 3 | 0.916667 | 0.853333 |
| 5 | 0.910000 | 0.850000 |
| 9 | 0.886667 | 0.856667 |
| 15 | 0.883333 | 0.873333 |
| 25 | 0.886667 | **0.880000** |

GridSearchCV 24 cấu hình K×weights×metric, 120 fit fold + một refit, chọn
**K=25/uniform/Euclidean**, mean CV **0.880000**. Chỉ chấm test sau chọn:
**[[TN,FP],[FN,TP]]=[[46,4],[4,46]]**, accuracy/precision/recall/F1 mỗi lớp **0.92**,
50 mẫu mỗi lớp. Proba ba query đầu: [0.04,0.96], [0.24,0.76], [0.96,0.04].
K tốt nhất trong lưới không phải bảo đảm tối ưu mọi K; proba là vote chưa mặc định
hiệu chuẩn. Train/CV/test khác lượng dữ liệu fit và mẫu chấm nên không buộc bằng nhau.

Thêm nhiễu độc lập seed 123 trên cùng development/folds, K=5 cố định:

| Thêm cột nhiễu | Tổng cột | Mean CV |
|---|---|---|
| 0 | 2 | 0.850000 |
| 10 | 12 | 0.740000 |
| 50 | 52 | 0.583333 |
| 100 | 102 | 0.600000 |

Không hứa giảm đơn điệu hoặc mọi dữ liệu nhiều chiều đều thất bại. Bốn Python block
chạy thật không warning; assertions so mọi số tay/tie/scale/regression/CV/test/noise
và hình. Môi trường NumPy 2.5.4, sklearn 1.9.1; không đo timing thực trên một triệu mẫu.

## Liên kết và kiểm chứng

- Roadmap thêm topic; overview bỏ “Sắp có” đúng dòng, SVM next nối KNN; Scaling,
  K-fold, Imbalanced, Correlation, Linear có link tự nhiên. Giữ code/quiz/số liệu cũ;
  chỉ sửa next của SVM, không viết lại bài 05. Brief hiện **29 bài=23+6**.
- Module/map/bank dùng hạ tầng hiện có, không đổi TS/React/CSS/dependency. Không có
  README, không thấy số 5/28 bài hard-code trong UI; số cũ ở brief là lịch sử.
- `npm run build` **40/40 pass**, sinh `/02-supervised-learning/k-nearest-neighbours`,
  không warning mới; `npx tsc --noEmit`, `git diff --check`: pass.
- Parser thật: **29 bài, 378 câu** (A151/B131/C96), **227 B/C**, module 02 **83 câu**,
  53 quan hệ needs; frontmatter/IDs/title/order/link/slides/container/fence/EN/WANT
  hợp lệ, không cycle/key trùng. Các đoạn Python cũ module 01 còn nguyên.
- Chrome **1300px/390px** pass: H1/TOC/scrollspy, viewer/chip 75/Esc, hai plot/link gốc,
  copy chính xác bốn Python block, quiz 6/6/4/mở từng/tất cả/EN/WANT, không cuộn ngang
  toàn trang qua từng section; bảng/code cuộn trong khung. Đã duyệt ảnh thực tế.
- Module 02 đủ 6 bài, map node/needs chéo module; bank lọc bài/tag knn có **10 B/C**
  và **16 câu mọi tầng**; Prev/Next SVM↔KNN, module 01 vẫn 23 bài.
- Script/ảnh tạm ở `%TEMP%/ml-hub-round7/`: `verify.py`, `check.cjs`, `browser.cjs`,
  `browser-results.json`, PNG; không commit script kiểm hoặc đưa vào content.

Chưa viết Decision Tree (76–77), Random Forest (78) hoặc thuật toán khác. Không còn
việc triển khai thiếu trong phạm vi KNN; commit theo ba nhóm và dừng cho chủ repo duyệt.
