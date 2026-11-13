# Đợt 8 — Cây quyết định và Rừng ngẫu nhiên

## Phạm vi và Git

- Nhánh `feat/supervised-tree-forest` được tạo từ `feat/supervised-knn@eee1f18`:
  KNN/SVM đã commit nhưng chưa merge vào `main` (`9673ca9` lúc bắt đầu).
- Thêm `07-decision-tree.md` (id `decision-tree`, slide 76–77) và
  `08-random-forest.md` (id `random-forest`, slide 78–80), nhóm Phân loại,
  tiêu đề tiếng Việt trước. Module 02 có 8 bài, toàn site 31 bài.
- Slide 81 mở Unsupervised/K-Means, thuộc module 03: chưa viết bài, không tạo link chết.
- Đã xem slide 64–81: Naive Bayes chỉ được liệt kê ở slide 64, không có slide riêng
  trong 64–80. Hoàn tất phạm vi các bài riêng của phần Supervised không đồng nghĩa
  đã viết Naive Bayes hoặc mọi thuật toán supervised.
- Cập nhật roadmap, overview, KNN next, các liên kết tự nhiên ở module 01 và brief.
  Sửa đáp án Loss B2 vốn khẳng định mọi loss phải khả vi: yêu cầu phụ thuộc optimizer;
  cây chọn split không dùng gradient. Giữ code và các câu hỏi cũ.
- Không sửa React/TS/CSS hay thêm dependency. Giữ nguyên ba prompt untracked của chủ repo.
  Không push, không merge; bốn commit theo nhóm nội dung/ảnh, liên kết, tài liệu.

## Đã đối chiếu slide gốc

| Slide | Nội dung thấy trực tiếp | Cách dùng |
|---|---|---|
| 76 | Salary ít nhất $50,000 → commute quá 1 giờ → free coffee; Accept/Decline | Đọc thuật ngữ, đường đi, biên điều kiện; 8 offer tự soạn có nhãn rõ |
| 77 | Gini; Age/Income/Student/Credit Rating, bảng đếm; Best chỉ Age | Chép số đếm, tính từng nút và weighted Gini, nêu lỗi nguồn |
| 78 | Single Decision Tree vs nhiều cây Class 1/Class 2 | Động cơ ensemble |
| 79 | Training Set → Training Data 1…n → Tree → Voting (averaging); Test Set riêng | Pipeline; ảnh không ghi 70% |
| 80 | Cùng instance trái cây → A,A,B → Majority Voting → A | Hard vote; phân biệt cách sklearn trung bình xác suất |
| 81 | Unsupervised Learning algorithms, Before/After K-Means | Chỉ nối phần tiếp theo, chưa triển khai |

Gini slide 77, tính từ số đếm chưa làm tròn:

| Feature | Các nhánh Yes/No | Gini từng nhánh | Weighted Gini |
|---|---|---|---|
| Age | 2/3, 4/0, 3/2 | .48, 0, .48 | 12/35=.342857 → .343 |
| Income | 2/2, 4/2, 3/1 | .5, 4/9, .375 | 37/84=.440476 → .440 |
| Student | 6/1, 3/4 | 12/49, 24/49 | 18/49=.367347 → .367 |
| Credit | 3/3, 2/6 | .5, .375 | 3/7=.428571 → .429 |

Tổng weighted Gini đều khớp số in. Low/Excellent in .37 nhưng .375 làm tròn hai
chữ số phải .38; Student=No in .48 nhưng .489796 phải .49. Credit cộng thành
**5 Yes/9 No**, khác **9 Yes/5 No** ở ba bảng kia. Best chỉ Age và Age nhỏ nhất;
không chứng nhận cả bốn bảng là split của cùng dataset khi tổng nhãn chưa khớp.
Đảo toàn bộ nhãn riêng bảng Credit sẽ giữ Gini, nhưng chưa có 14 hàng gốc nên
không tự sửa. Điểm cần chủ repo/giảng viên xác nhận: tổng nhãn Credit và các số
nút đã cắt chữ số. Slide nhiều nhánh không phải cây CART nhị phân sklearn.

## Đối chiếu ghi chú của chủ repo

| Ghi chú | Diễn đạt đã dùng |
|---|---|
| “Chọn feature phân chia càng lệch càng tốt” | Là nhãn trong các nhóm con càng thuần, tính trọng số số mẫu; không phải kích thước nhánh càng chênh. Phản ví dụ split có lá thuần một mẫu vẫn thua .444444 vs .32. |
| “Vì sao salary là gốc?” | Nhánh lương thấp ra lá Decline minh họa độ thuần; slide 76 không có số đếm ứng viên nên chưa chứng minh tối ưu. Dùng slide 77 chứng minh cách chọn bằng số. |
| “Nhiều cây cải thiện accuracy” | Mục tiêu giảm variance khi lỗi bớt tương quan; có thể giúp accuracy nhưng không bảo đảm thắng mọi model. Demo cây depth5 có CV cao hơn forest đã thử. |
| “Cần quyết định số mô hình con” | n_estimators chọn trên CV, cân nhắc thời gian/RAM; 100 và 300 bằng CV mean nên ưu tiên 100 trong lưới này. |
| “Tập con khoảng 70%” | Mặc định sklearn bootstrap N lượt có hoàn lại; kỳ vọng khoảng 63.2% dòng khác nhau khi N lớn. max_samples=.7 vẫn có hoàn lại, giới hạn kỳ vọng unique≈50.34%, không phải 70%. Slide 79 không ghi tỉ lệ. |
| “Các cây không dùng hết feature” | Lấy feature ứng viên tại từng split; không cố định một subset suốt cây. Kiểm default sqrt; D=2 → max_features_=1 nhưng cây đầu dùng cả x1/x2 qua các nút. Có thể kiểm thêm feature để tìm phân hoạch hợp lệ. |
| “Sao không dùng cả train cho mỗi cây?” | Cùng dữ liệu/feature/quy tắc và phá hòa có thể cho cây giống nhau. Sampling tạo đa dạng để giảm tương quan lỗi; chỉ nhân bản cây không tạo lợi ích. |
| “Gini nhỏ nhất là tốt nhất” | So weighted child Gini trên cùng parent; tương đương gain lớn nhất. Không chỉ chọn nhánh con thuần nhất. |

## Phần ngoài slide và các số đã chạy

Thêm entropy/gain, CART greedy, ngưỡng số, pruning/depth, hồi quy mean lá, bootstrap/OOB,
probability averaging, bias–variance ở mức nhập môn, importance/correlation, so sánh mô hình,
code/plots và tình huống phỏng vấn. Các ví dụ tự soạn được gắn nhãn; không bịa dataset slide.
Mỗi bài có quiz A/B/C=6/6/4, EN ở B và WANT ở C. Sáu hàng tổng kết cuối Forest gộp
Linear/Polynomial cùng hàng, tức bảy tên mô hình.

- Entropy parent 9/5=.940286, Age weighted entropy=.693536, gain=.246750.
- Ngưỡng x=1…6, nhãn 000111: Gini cho 1.5/2.5/3.5/4.5/5.5=.4/.25/0/.25/.4.
- Stump hồi quy y=[2,2,4,8,8,10]: split3.5, mean lá8/3 và26/3,
  SSE16/3, MSE8/9; x20 vẫn dự đoán26/3.
- Năm phiếu độc lập p=.7: đa số đúng .83692, không phải lời hứa accuracy forest thật.
- Bootstrap seed42 từ1…10: [1,8,7,5,5,9,1,7,3,1], OOB=[2,4,6,10].
  P(OOB)=.9^10=.3486784401, unique kỳ vọng6.513215599; giới hạn OOB1/e=.367879.
- Soft vote P(A)=[.51,.51,.01] có trung bình .343333, chọn B dù hard vote A,A,B.
  Đã assert forest.predict_proba bằng trung bình predict_proba của các cây thật.
- Công thức phương sai trung bình σ²[ρ+(1−ρ)/T] được ghi rõ giả định;
  σ²1/T5 cho .2 khiρ0 và .84 khiρ.8, không diễn giải thành công thức accuracy.

Dataset chung tự soạn: make_moons400/noise.3/seed42, stratified development300/test100;
CV5 fold shuffle seed42 trên development. Tree train/CV theo depth:

| Depth | Full development train | CV mean |
|---|---|---|
| 1 | .786667 | .763333 |
| 2 | .873333 | .830000 |
| 3 | .876667 | .830000 |
| 5 | .943333 | .890000 |
| 10 | .993333 | .860000 |
| None | 1 | .860000 |

Tree5 chọn bằng CV; test.88, confusion[[45,5],[7,43]], class1 precision.895833,
recall.86. Importance[.488478,.511522]. Không khẳng định mọi lá cây sâu chứa một mẫu.

| Forest số cây | CV mean | CV std (ddof0) | Giây cả 5-fold CV, một lần đo |
|---|---|---|---|
| 1 | .843333 | .041633 | .081944 |
| 5 | .870000 | .024495 | .116925 |
| 25 | .873333 | .022608 | .501214 |
| 100 | .876667 | .032660 | 1.773105 |
| 300 | .876667 | .027080 | 5.248291 |

Thời gian Windows, i5-12450HX/12 logical processors, Python3.14.6/sklearn1.9.1,
NumPy2.5.4, n_jobs1: có phụ thuộc tải/máy/lần chạy, không phải inference latency.
Chạy lại code cho cùng accuracy, thời gian thay đổi bình thường. RF100 train1,
OOB.883333, test.9, confusion[[45,5],[5,45]], importance[.463064,.536936].
Không chọn model family bằng test; Tree5 CV.89 cao hơn RF mặc định đã thử .876667.
Stability chỉ dùng development chia225base/75probe seed17, mười bootstrap base seed0…9:
Tree mean/std=.806667/.027487; RF=.850667/.026533; mức giảm std nhỏ, không phải
mười test độc lập. NaN probe gini/best của DecisionTreeClassifier1.9.1 chạy được,
không suy cho mọi cấu hình/category/phiên bản.

## Kiểm chứng và giới hạn

- Chạy cả 4 Python block trích nguyên văn, assert các số tay/CV/OOB/ma trận/importance,
  không warning; sinh 5 ảnh matplotlib thật ở public/plots, đã xem ảnh.
- Parser toàn site: 31 bài; 410 câu (A163/B143/C104); ngân hàng B/C247;
  module02 có115 câu;58 cạnh needs. ID/link/slide/frontmatter/container/EN/WANT,
  dependency không chu trình; code module01 giữ nguyên so với nhánh gốc.
- `npm run build`: 42/42 trang; `npx tsc --noEmit`, `git diff --check`: pass.
- Playwright Chrome ở1300×1000 và390×1000: tên Việt, progress7/8 và8/8, TOC,
  mọi section không tràn viewport;5 plots và link gốc;copy cả4 Python block đúng
  nguyên văn;quiz3 tầng/count/EN/WANT;viewer76–80/phím mũi tên/Escape/chip;
  bank B/C247, mỗi bài10 B/C hoặc16 ABC với tag;index8 bài, map needs/backlinks,
  điều hướng KNN↔Tree↔Forest;module01 vẫn23 bài;không lỗi JavaScript.
- Bảng/code dài cuộn trong khung trên mobile, không tràn ngang toàn trang. Plot nhỏ
  trên màn hình hẹp có link gốc để đọc chi tiết. Không thay đổi thiết kế hiện có.
- Log/script/screenshot kiểm nằm ở thư mục tạm `ml-hub-round8`, không commit vào repo.
- Chưa làm: Unsupervised slide81+, Naive Bayes ngoài phạm vi slide riêng, giải quyết
  lỗi dữ liệu nguồn Credit khi chưa có xác nhận. Không push/merge theo yêu cầu đợt8.
