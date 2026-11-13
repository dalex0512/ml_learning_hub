# Đợt 6 — Máy vector hỗ trợ (SVM)

Ngày 13/11/2026. Nhánh `feat/supervised-svm`, rẽ từ **main@9673ca9** đã có
Polynomial/Logistic. Các file được yêu cầu đọc đều tồn tại; không có file thiếu.
Giữ nguyên `codex-prompt-svm.md` và `codex-prompt-knn.md` chưa track. Không push, không merge.

## Phạm vi slide và bài

| Slide đã xem | Nội dung thật → xử lý |
|---|---|
| 70 | Hai đường đỏ/xanh; Optimal Hyperplane, Support vector, Maximised margin → hook và margin. |
| 71 | Linearly Separable / Not Linearly Separable; lớp giữa bị lớp ngoài bao quanh → nhu cầu đổi biểu diễn. |
| 72 | 2D Space → Mapping Function φ(x1,x2)=(x1,x2,z) → 3D Space, New Dimension, Hyperplane → ánh xạ. |
| 73 | Bốn hình: 2D x/y → x/z → Best Hyperplane → đường tròn ở input gốc. **Không có công thức z**. |
| 74 | Chỉ khung đen trên nền trắng, **không có nội dung đọc được**; không đoán nội dung/video. |
| 75 | K-Nearest-Neighbour → chủ đề tiếp theo, **chưa viết**. |

Đã phóng to 72/73. Chọn **một bài** `05-support-vector-machine.md`, ID `svm`,
order 5, nhóm “Phân loại”, frontmatter/viewer **70–74**, chú thích rõ 74 trống.
Giữ margin → soft margin → kernel trong cùng mạch, tránh tách phần kernel khỏi
động cơ hình học. Tiêu đề có tên tiếng Việt đứng trước tiếng Anh.

## Đối chiếu ghi chú chủ repo

- **Chọn tập con ảnh dễ nhầm:** giữ câu hỏi và trực giác điểm sát biên, đổi sang
  ảnh mèo/chó trung tính, không suy quốc tịch từ mặt. Ghi rõ là phép liên hệ,
  không phải quy tắc lấy mẫu tối ưu; chưa fit chưa biết support vector. Phân biệt
  khó với nhãn sai/outlier, giữ đại diện/đa dạng và tập đánh giá độc lập; giới thiệu
  hard example mining và active learning ngắn, kèm nguồn khảo sát của Settles.
- **Đường xanh tốt hơn:** giải thích tối đa khoảng cách nhỏ nhất, cân giữa hai
  lớp trong hard margin. Không đo tọa độ/margin chính xác của hình slide.
- **“Siêu phẳng bậc nhỏ hơn 1”:** sửa thành số chiều **n−1**; ví dụ điểm 0D
  trong 1D, đường trong 2D, mặt phẳng trong 3D. Phân biệt mỗi bên và toàn dải.
- **Chỉ điểm gần nhất quyết định:** phân biệt hard/soft margin; soft margin còn
  gồm điểm vi phạm/sai phía. Điểm đúng mép có thể suy biến hệ số 0; số support
  vector không bảo đảm ít. Code thêm/xóa/dịch điểm xa giữ thang đo cho cùng biên.
- **Nâng chiều:** diễn giải feature map rồi kernel trick không cần dựng mọi cột;
  nhiều chiều không tự tốt, kernel còn chi phí theo số mẫu. Bài dùng
  **z=x1²+x2² tự soạn**, không phải công thức của slide; dấu dương nên nhóm giữa thấp
  hơn; hình slide 72 nâng nhóm giữa lên cao nhưng không cho công thức z.

Các điểm cần làm rõ, đã xử lý trong bài: z=x² cắt tại 2.5 cho **±√2.5≈±1.581139**,
không phải ±1.5 như gợi ý prompt; vòng tròn chiếu ngược không là hyperplane trong
2D gốc. `probability=True` dùng Platt là cách cũ; tài liệu sklearn 1.9 đã deprecated,
khuyên CalibratedClassifierCV. Không có điểm mờ khác cần chủ repo xác nhận;
không thể khôi phục nội dung slide 74 từ ảnh hiện có.

## Phần ngoài slide và số đã kiểm

Đã gắn nhãn ngoài slide cho công thức, tính tay, soft margin/hinge loss/C,
kernel/gamma, scale, CV, thực hành, so Logistic, chọn tập con và quiz bổ sung.
Năm PNG matplotlib từ đúng bốn Python block trong bài: `svm-max-margin`,
`svm-soft-margin`, `svm-lift-1d`, `svm-lift-circle`, `svm-rbf-grid` trong
`public/plots/`; có link ảnh gốc, cùng trục giữa các panel cần so. Không dùng AI.
Dùng fenced Python có copy vì parser không hỗ trợ `:::code`.

- Hook 8 điểm: ba đường x1=−0.5/0/0.5 đều 100% train; clearance 0.5/1/0.5.
- 1D: w=1,b=−2, biên x=2, margin toàn dải 2; support x=1/3 không đổi khi thêm
  x=0/5 rồi dịch xa hơn. 2D: w≈(1,0),b≈0; SV (−1,−1),(−1,1),(1,0), D cách biên 3.
- Quiz w=(3,4),b=−5: norm=5, width=0.4, điểm (3,0) cách biên 0.8.
- Mapping: x²=[9,4,1,0,1,4,9]; vòng bán kính 1/2 cho z=1/4, mặt phẳng z=2.5.
- Kernel a=(1,2),b=(3,1): (a·b)²=25=φ(a)·φ(b). RBF khoảng cách 2,
  gamma 0.1/1 → K≈0.670320/0.018316. Ví dụ scale và hinge loss đã kiểm số.

Demo tuyến tính 160 mẫu, seed 42, train/holdout=120/40, scaler fit train:

| C | nSV | Margin sau scale | Accuracy train | Holdout |
|---|---|---|---|---|
| 0.01 | 112 | 2.764332 | 0.925000 | 0.950000 |
| 1 | 25 | 1.109398 | 0.933333 | 0.975000 |
| 100 | 23 | 1.101201 | 0.933333 | 0.975000 |

Demo vòng tròn **độc lập**, seed 42, dev/test=180/60; CV 5-fold chọn kernel/C/gamma:

| RBF C \ gamma | 0.01 | 1 | 100 |
|---|---|---|---|
| 0.01 | 0.688889 | 0.938889 | 0.700000 |
| 1 | 0.688889 | **0.983333** | 0.855556 |
| 100 | 0.977778 | 0.972222 | 0.861111 |

Đây là **mean CV accuracy**. Linear C=0.01/1/100: 0.627778/0.611111/0.594444.
Chọn RBF **C=1,gamma=1**, refit 180 mẫu, 42 SV (22/20); test **[[30,0],[1,29]]**,
accuracy **0.983333**, precision lớp 1 **1**, recall **0.966667**. Bảng train/CV trong
bài đối chiếu đủ chín cấu hình; không dùng holdout của demo nhiễu hoặc test vòng
tròn để chọn. NumPy 2.5.4/sklearn 1.9.1; cả bốn block chạy không warning.

## Liên kết, kiểm chứng và bàn giao

- Roadmap thêm SVM, overview bỏ “Sắp có” đúng dòng, Logistic next có link thật;
  Polynomial, Scaling, K-fold, Imbalanced thêm link tự nhiên. Các bài cũ giữ code,
  số liệu và quiz. Brief hiện **28 bài=23+5**, số cũ đánh dấu lịch sử.
- Không có README; không thấy số 4/27 bài hard-code trong UI cần sửa. Không sửa
  TypeScript/React/CSS/dependency; module/map/bank dùng hạ tầng hiện có.
- `npm run build`: **39/39 pass**, route `/02-supervised-learning/svm` được sinh,
  không warning mới; `npx tsc --noEmit`, `git diff --check`: pass.
- Parser thật: **28 bài, 362 câu** (A145/B125/C92), **217 B/C**, module 02 **67 câu**,
  48 quan hệ needs; frontmatter/title/order/ID/link/slide/container/fence/EN/WANT
  hợp lệ, không cycle/key trùng. Quiz SVM **5/6/4**.
- Chrome **1300px/390px** pass: H1/TOC/scrollspy, viewer 70→74 và ←/→/Esc,
  chip riêng 70–74, năm plot/link ảnh gốc, copy chính xác cả bốn Python block,
  quiz ba tầng/mở từng/tất cả/EN/WANT, không cuộn ngang toàn trang qua từng section.
  Đã duyệt ảnh title, công thức, tính tay, plots, quiz, map và bank.
- Module 02 đủ 5 bài, map node/needs chéo module; bank lọc bài/tag svm được
  10 câu B/C và 15 câu mọi tầng; Prev/Next Logistic↔SVM; module 01 vẫn 23 bài.
- Script/ảnh kiểm tạm ở `%TEMP%/ml-hub-round6/`: `verify.py`, `check.cjs`,
  `browser.cjs`, `browser-results.json`, PNG. Không commit script kiểm.

Chưa viết KNN (slide 75) hoặc suy nội dung 74. Không có việc triển khai còn thiếu
trong phạm vi bài SVM; commit theo ba nhóm, dừng để chủ repo duyệt, không push/merge.
