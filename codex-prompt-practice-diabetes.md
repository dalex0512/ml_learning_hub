> **ĐÃ THAY THẾ** bởi `PRACTICE-GUIDE.md`. Giữ lại chỉ để tham khảo lịch sử; không dùng cho bài mới.

# Prompt cho Codex — đợt 9: Thực hành 1 — Diabetes (bài đầu tiên của module 06-projects)

Dán nguyên khối dưới đây cho Codex. Repo: `d:\ML_VNAI`.
Lúc soạn: nhánh `main` đã chứa Decision Tree + Random Forest (module 02 đủ 8 bài). `dataset/diabetes.csv` (768 dòng, 9 cột) đang untracked. Module `06-projects` đang rỗng (`topics: []`) — đây là bài đầu tiên của nó.
Ghi chú tay + code của chủ repo nằm nguyên văn ở cuối khối prompt.

```
Dự án ML Learning Hub (Next.js 14, ghi chú tự học ML của chủ repo). Đã xong: module 01 (23 bài),
module 02 (8 bài: linear, polynomial, logistic, SVM, KNN, Decision Tree, Random Forest). Chủ repo
vừa chuyển sang PHẦN THỰC HÀNH: bài đầu tiên làm trên bộ dữ liệu dataset/diabetes.csv, chạy code
trên PyCharm. Việc của bạn: viết HAI bài thực hành cho module 06-projects (hiện rỗng), thiết kế để
người học (a) nắm lý thuyết đứng sau từng dòng code, (b) gõ lại được bằng tay, (c) tự làm bài tập
cho quen tay. Đây KHÔNG phải bài theo slide: không có slide gốc, không dùng [[slide:N]], không viết
frontmatter slides nếu hạ tầng cho phép bỏ (kiểm; nếu bắt buộc thì báo cáo và xử lý tối thiểu).

BƯỚC 0A — KIỂM TRA TRẠNG THÁI GIT
- git status, git branch --merged main, git log --oneline -5.
- Xác nhận 07-decision-tree.md và 08-random-forest.md đã nằm trong main. Chủ repo đã merge hết vào
  main và yêu cầu LÀM THẲNG TRÊN main: KHÔNG tạo nhánh mới. Chỉ cần đang ở main, working tree sạch
  (ngoài các file untracked đã nêu).
- dataset/ đang untracked: file nhỏ (768 dòng), CHỦ ĐỘNG commit dataset/diabetes.csv cùng bài (đó là
  dữ liệu thực hành). Giữ nguyên các file codex-prompt-*.md chưa track của chủ repo, không commit.

ĐỌC TRƯỚC, theo thứ tự (chỉ file thật; kiểm bằng ls):
1. codex-handoff.md — cú pháp khối (:::intro, :::worked, :::code, :::pitfall, :::compare, :::recap,
   :::quiz, :::next và các khối khác nếu có, ví dụ khối gấp/ẩn cho đáp án), quy trình, pitfalls.
2. project-brief.md — design Notebook, quy ước nội dung, danh sách module.
3. supervised-tree-forest-report.md và supervised-knn-report.md — hạ tầng module, cách thêm topic mới,
   chuẩn ảnh plot, cách xử lý module chưa có bài (06-projects đang topics: []).
4. content/02-supervised-learning/04-logistic-regression.md và 08-random-forest.md — BÀI MẪU về giọng
   văn, độ chi tiết, :::worked/:::code/:::pitfall, quiz. Bài mới phải cùng chuẩn.
5. Bài module 01 cần nối (lấy id thật từ roadmap.json): labeled-data (X, y), feature-and-data-types,
   train-test-split, k-fold-cross-validation, stratified-k-fold, feature-scaling, confusion-matrix,
   classification-metrics, roc-auc, imbalanced-data, missing-values-outliers, descriptive-statistics,
   correlation-multicollinearity, ml-pipeline, model-training-pipeline, data-visualization.
   Module 02: logistic-regression, k-nearest-neighbours, svm, decision-tree, random-forest.

NGUYÊN TẮC THIẾT KẾ — "ĐỪNG NGỢP" (quan trọng nhất, ưu tiên hơn việc nhồi thêm kiến thức)
Chủ repo muốn THUẦN THỤC bài thực hành này, nắm cả lý thuyết và thực hành. Vì vậy:
- Chia thành HAI bài ngắn gọn thay vì một bài khổng lồ (xem PHẦN A). Mỗi bài tối đa 6 mục chính.
- Mỗi "Bước" là một vòng khép kín nhỏ, ĐÚNG THỨ TỰ này, không đổi:
  (1) Mục tiêu 1 câu → (2) Lý thuyết cần biết (ngắn, ví dụ đời thường trước, link bài lý thuyết sâu
  hơn thay vì viết lại) → (3) Code của bước (≤ 15 dòng, chú thích từng dòng) → (4) "Bạn phải thấy"
  (kết quả kỳ vọng: shape/số thật đã chạy, để người học tự đối chiếu) → (5) Bài tập "Tự làm" 2–3 bài
  theo bậc ★ (khởi động) / ★★ (hiểu) / ★★★ (thử thách) — đề trước, ĐÁP ÁN + giải thích gấp sau.
- Không dồn hai khái niệm mới vào một bước. Không giải thích lại thứ đã có bài; một câu nhắc + link.
- Mỗi bài mở đầu bằng "Bản đồ" 1 dòng các bước (Bước 1 → 2 → …) và đóng bằng "Checklist tự kiểm": 5–7
  ý có/không, người học đánh dấu được. Tránh bảng dày; dùng bảng chỉ khi so sánh thật sự.
- Ví dụ làm tay chỉ dùng khi chạm phần dễ hiểu sai (confusion matrix → precision/recall, data
  leakage, fit/transform). Không làm tay mọi thứ.
- Giọng: câu ngắn, thuật ngữ Anh kèm giải thích Việt lần đầu, không độn.

BƯỚC 0 — Khảo sát dữ liệu thật (bắt buộc, chạy Python thật, không đoán)
Trước khi viết, tự chạy và ghi lại các số sau để dùng trong bài (script để thư mục tạm / phụ lục
báo cáo, không để trong content/):
- shape, dtypes, 9 cột, không có NaN; phân bố Outcome (500 âm tính / 268 dương tính — kiểm lại).
- Số giá trị 0 ở từng cột (Glucose, BloodPressure, SkinThickness, Insulin, BMI có 0 vô lý = thiếu
  dữ liệu bị mã hoá thành 0; Pregnancies 0 là hợp lệ). Ghi số đếm thật.
- Ma trận tương quan Pearson thật + tương quan của từng feature với Outcome, sắp xếp. Đối chiếu với
  ảnh bảng correlation trong ghi chú của chủ repo (Glucose 0.487, BMI 0.317, Age 0.314…): bảng đó
  có thể là loại tương quan khác (Spearman?) hoặc số khác Pearson — TÍNH LẠI cả Pearson, Spearman,
  ghi cái nào khớp, và dùng số của bạn trong bài, nêu rõ loại tương quan. Không chép số từ ảnh.
- Chạy toàn bộ code mẫu của chủ repo: sửa lỗi import (thiếu classification_report, confusion_matrix
  → NameError), ghi accuracy/precision/recall/F1 của LogisticRegression và RandomForestClassifier
  (random_state=42 cho split và random_state cố định cho forest). Kết quả thật là cơ sở cho mục
  "Chọn mô hình".

PHẦN A — HAI BÀI (content/06-projects/, thư mục mới; id và file theo quy ước roadmap)

Bài 01 — content/06-projects/01-diabetes-first-model.md  (id: diabetes-first-model)
Tiêu đề gợi ý: "Thực hành 1 — Diabetes: từ file CSV đến mô hình đầu tiên"
Mục tiêu: người học tự tay đi hết đường ống ngắn: đọc dữ liệu → tách X/y → chia train/test →
chuẩn hoá → huấn luyện → dự đoán, và hiểu từng bước vì sao có mặt.
Bước 0 (mục đầu, không bài tập nặng): Chuẩn bị môi trường PyCharm — pip install pandas scikit-learn,
file diabetes.csv đặt ở đâu và vì sao pd.read_csv('diabetes.csv') báo FileNotFoundError khi working
directory khác (cách kiểm tra bằng os.getcwd(); đặt Working directory trong Run Configuration);
mẹo Python Console: bôi đen code → chuột phải/ Alt+Shift+E "Execute Selection in Python Console",
và panel biến bên phải (View as DataFrame / Series) để xem bảng như ảnh chủ repo. Mỗi biến mới
(data, x, y, x_train…) nên mở xem một lần — nói rõ đây là thói quen học nhanh.

Bước 1 — Hiểu dữ liệu trước khi code mô hình
  Lý thuyết: dataset diabetes.csv là gì (Pima Indians, 768 người, 8 feature số + Outcome 0/1: tiểu
  đường hay không — nêu nguồn gốc ở mức chắc chắn, nếu không chắc thì chỉ nói "bộ dữ liệu y tế công
  khai thường dùng để học"). Bài toán = phân loại nhị phân ([[bài:classification-vs-regression]]).
  Code: read_csv, shape, head, info, describe, value_counts. Bạn phải thấy: số thật từ BƯỚC 0.
  Chen một hộp "Cái bẫy của dữ liệu này": cột có 0 vô lý — chỉ CẢNH BÁO ở bước này, xử lý ở bài 02
  (nối [[bài:missing-values-outliers]]).
  Tự làm: ★ đếm Outcome=0/1 + tỉ lệ; ★★ đếm số 0 từng cột, cột nào đáng ngờ và vì sao Pregnancies
  thì không; ★★★ vẽ histogram Glucose tách theo Outcome (nối [[bài:data-visualization]]), nhận xét
  hai nhóm khác nhau thế nào.

Bước 2 — Tách X và y (feature matrix và label vector)
  Lý thuyết: nối [[bài:labeled-data]]. Vì sao X viết hoa/ y viết thường trong toán nhưng code của chủ
  repo dùng x thường — nói 1 câu về quy ước, giữ x, y như code của chủ repo (thống nhất trong cả
  bài). drop(labels="Outcome", axis=1): axis=1 = bỏ CỘT; axis=0 = bỏ HÀNG (tìm hàng tên "Outcome" →
  KeyError). y = data["Outcome"] là Series. Bạn phải thấy: x.shape (768, 8), y.shape (768,).
  Tự làm: ★ tạo x, y và kiểm shape; ★★ cố tình dùng axis=0, đọc lỗi, giải thích; ★★★ tạo x_no_age
  bỏ cùng lúc Outcome và Age (labels là list) và nói khi nào ta bỏ feature.
  Chú thích ngắn nếu hay hỏi: dùng data.drop("Outcome", axis=1) hoặc columns="Outcome" cũng được —
  nêu một dòng, đừng sa đà.

Bước 3 — Chia train / test (và vì sao phải cố định random_state)
  Lý thuyết: nối [[bài:train-test-split]]. test_size và train_size chỉ cần một; dùng số thực (0.2 =
  20%). Dữ liệu bị xáo trộn ngẫu nhiên trước khi chia → chỉ số (index) lộn xộn trong x_train là bình
  thường. random_state=42 (số nào cũng được, nhưng đã chọn thì cố định) để mỗi lần chạy ra đúng bộ
  train/test cũ → so sánh công bằng giữa các lần thử. Ví dụ ngắn "hôm qua accuracy 80%, hôm nay đổi
  cách tiền xử lý ra 78% — nếu bộ test khác nhau thì không biết do cách làm hay do bộ test".
  Chia 3 bộ 60/20/20: train_test_split hai lần, lần hai test_size=0.25 (vì 0.25 × 80% = 20% tổng) —
  làm phép tính chỉ ra. Nói rõ: thực tế thường KHÔNG chia cứng val, mà dùng K-fold CV ([[bài:k-fold-
  cross-validation]]) → để chủ repo hiểu ghi chú "bỏ dòng dưới đi".
  Bạn phải thấy: x_train (614, 8), x_test (154, 8) — kiểm đúng; hai lần chạy cùng random_state cho
  cùng index.
  Tự làm: ★ chia 80/20 + kiểm shape; ★★ chạy 3 lần không random_state rồi 3 lần có, in index[:5] của
  x_train so sánh; ★★★ chia 60/20/20 và tự kiểm bằng len(); thêm stratify=y, so sánh tỉ lệ Outcome ở
  train/test có và không stratify (nối [[bài:stratified-k-fold]]; dữ liệu 65/35 nên stratify có ích
  nhưng chênh lệch nhỏ — báo số thật).

Bước 4 — Chuẩn hoá (scaling) và bài học fit / transform
  Lý thuyết: nối [[bài:feature-scaling]]. Vì sao: các feature khác thang đo (Insulin hàng trăm, DPF
  < 2) → mô hình dựa khoảng cách/gradient bị lấn át. StandardScaler: z = (x − mean)/std. Làm tay một
  cột ngắn (5 giá trị) để thấy mean 0, std 1 (:::worked, kiểm bằng Python).
  Chỗ chủ repo ghi "MinMaxScaler nhạy với outlier nên dùng StandardScaler (ít nhạy hơn)": ĐÚNG ở mức
  tương đối; CHÍNH XÁC: cả hai đều bị outlier ảnh hưởng (mean/std cũng bị kéo), MinMax nhạy hơn vì
  min/max bị outlier quyết định; robust hơn là RobustScaler (chỉ nhắc tên). Ghi rõ điều này.
  Ba phương thức fit(), transform(), fit_transform(). Giữ ví dụ "thợ may" của chủ repo (đo = fit,
  cắt may = transform; vải khác thì chỉ cần transform vì đã có số đo). Quy tắc: CHỈ fit trên train;
  val/test chỉ transform. Giải thích leakage bằng ví dụ số: fit trên toàn bộ dữ liệu thì mean/std
  "nhìn thấy" test (nối [[bài:ml-pipeline]]).
  Lưu ý kỹ thuật cần nói: sau scaler.fit_transform, x_train thành mảng NumPy (mất tên cột/index) —
  chủ repo có thể thấy mất bảng đẹp; cách giữ DataFrame nếu muốn (set_output(transform="pandas") —
  CHỈ ghi nếu phiên bản sklearn đang cài hỗ trợ, kiểm thật). Ghi chú nhỏ: code chủ repo gõ nhầm
  "X_test" ở một chỗ — nhắc hoa/thường.
  Bạn phải thấy: mean xấp xỉ 0 và std xấp xỉ 1 của x_train sau scale (in số thật); mean của x_test
  KHÔNG đúng 0 — giải thích vì sao đó là điều đúng.
  Tự làm: ★ scale và in mean/std; ★★ dùng MinMaxScaler, kiểm min/max train (0,1) và test (có thể
  vượt 0–1 — in số thật nếu có); ★★★ viết CÁCH SAI (fit toàn bộ trước khi chia), nói leakage ở
  đâu, so accuracy với cách đúng và nhận xét (chênh lệch có thể rất nhỏ — nói thật; vấn đề là
  nguyên tắc, không phải con số).

Bước 5 — Mô hình đầu tiên và dự đoán
  Lý thuyết ngắn: fit(x_train, y_train) của MODEL khác fit của scaler (cùng tên, khác việc — chủ repo
  đã ghi chú). predict(x_test) trả mảng nhãn 0/1. So sánh y_predict với y_test.
  Code: LogisticRegression, fit, predict, vòng for zip in vài dòng đầu (head 10, không in 154 dòng).
  Bạn phải thấy: accuracy thật (từ BƯỚC 0).
  Tự làm: ★ chạy LogisticRegression và in 10 cặp dự đoán/thực tế; ★★ dùng predict_proba(x_test)[:,1],
  in 5 xác suất đầu và nói liên hệ với ngưỡng 0.5 ([[bài:logistic-regression]]); ★★★ tính "tay"
  accuracy = (y_predict == y_test).mean() và so với accuracy_score.
Cuối bài 01: :::recap (5 ý), "Checklist tự kiểm", :::quiz ngắn (tầng A ≥3, tầng B ≥3 có EN: "Why
do we fit the scaler only on the training set?", "What does random_state do?", "What is data
leakage?"; tầng C ≥2: sếp hỏi vì sao mô hình hôm nay khác hôm qua; đồng nghiệp scale cả bộ trước khi
chia — bạn giải thích thế nào), :::next sang bài 02.

Bài 02 — content/06-projects/02-diabetes-evaluate-improve.md  (id: diabetes-evaluate-improve)
Tiêu đề gợi ý: "Thực hành 1 — Diabetes: đánh giá, so sánh mô hình và cải thiện"
Mục tiêu: đọc đúng kết quả mô hình, chọn mô hình bằng thực nghiệm, xử lý cái bẫy dữ liệu, dùng
Pipeline + cross-validation như làm thật.
Bước 6 — Đọc kết quả: confusion matrix và metrics
  Lý thuyết: nối [[bài:confusion-matrix]], [[bài:classification-metrics]]. Ở bài toán này
  "dương tính" = có bệnh. Đọc ma trận (hàng = thực tế, cột = dự đoán — nói rõ quy ước sklearn). :::worked
  làm tay từ confusion_matrix thật của LogisticRegression: TN, FP, FN, TP → accuracy, precision,
  recall, F1, khớp với hàm sklearn. classification_report: giải thích từng cột (precision, recall,
  f1-score, support, macro avg, weighted avg) bằng số thật; thứ tự nhãn 0 rồi 1.
  Baseline "đoán toàn bộ là 0": accuracy ≈ tỉ lệ lớp 0 trong test (in số thật) → vì sao accuracy một
  mình dễ đánh lừa ([[bài:imbalanced-data]]). Y tế: bỏ sót bệnh (FN) thường tệ hơn báo nhầm (FP) → ưu
  tiên recall; nói đây là lựa chọn theo bối cảnh, không phải luật.
  Ngưỡng: predict_proba + ngưỡng 0.3/0.5/0.7 → bảng ngắn precision/recall (số thật), đánh đổi giữa hai
  cái (nối [[bài:roc-auc]] một câu).
  Tự làm: ★ in confusion_matrix và gọi tên 4 ô; ★★ tự tính precision và recall từ ma trận, so với
  hàm; ★★★ đổi ngưỡng sang 0.3, mô tả recall/precision thay đổi ra sao và có đáng không.
  Chú ý: code chủ repo thiếu import confusion_matrix, classification_report — nêu NameError như một
  bài học "đọc lỗi".

Bước 7 — Chọn mô hình: tuyến tính hay phi tuyến? (câu hỏi phỏng vấn của chủ repo)
  Trả lời ĐÚNG và công bằng ghi chú của chủ repo: dựa vào bảng tương quan đoán "feature không tương
  quan mạnh với Outcome → dùng phi tuyến". Làm rõ: (1) tương quan Pearson chỉ đo quan hệ TUYẾN TÍNH
  từng cặp, hệ số thấp không chứng minh cần phi tuyến; (2) ở đây Glucose có tương quan mức vừa, các
  feature khác thấp — số thật từ BƯỚC 0; (3) lý thuyết chỉ là giả thuyết để THỬ, kết quả thực nghiệm
  (Logistic ngang hoặc hơn Random Forest, số thật) mới quyết định, đúng như chủ repo đã thấy; (4)
  câu trả lời phỏng vấn tốt: "tôi nhìn tương quan để đoán, rồi thử cả hai bằng cross-validation và
  chọn theo metric phù hợp". Không phán một mô hình luôn tốt hơn.
  Quy tắc "cây/forest không cần scale" (chủ repo đã ghi, đúng): vì cây so sánh feature với ngưỡng, không
  cộng/nhân — nối [[bài:decision-tree]], [[bài:feature-scaling]] — kiểm bằng thực nghiệm (bài tập).
  Code: vòng for qua dict {"Logistic": …, "KNN": …, "SVM": …, "Tree": …, "Forest": …} (tất cả
  random_state cố định), in bảng accuracy/recall/F1 trên test (số thật). Cảnh báo: chọn mô hình theo
  test lặp lại = rò rỉ nhẹ → chuyển sang CV ở Bước 9.
  Tự làm: ★ chạy vòng lặp 5 mô hình và đọc bảng; ★★ chạy hai lần có/không scale, mô hình nào đổi
  nhiều (KNN, SVM, Logistic) và nào gần như không (Tree, Forest) — giải thích; ★★★ đổi
  random_state của split sang 7, 42, 123, xem thứ hạng mô hình có đổi không → hiểu vì sao một lần
  chia test là chưa đủ tin.

Bước 8 — Cái bẫy trong dữ liệu: số 0 thực chất là thiếu
  Lý thuyết: nối [[bài:missing-values-outliers]]. Cột Glucose, BloodPressure, SkinThickness, Insulin,
  BMI có 0 vô lý (số đếm thật). Cách xử lý: thay 0 bằng NaN → điền median (SimpleImputer(strategy=
  "median")) — fit TRÊN TRAIN, transform train và test (cùng quy tắc fit/transform ở Bước 4 — nhấn
  mạnh). Vì sao median chứ không mean (Insulin lệch phải, có giá trị cực lớn — kiểm bằng số thật).
  Có thể thêm cột chỉ báo thiếu (add_indicator) — chỉ nhắc tên. Bảng ngắn trước/sau: accuracy,
  recall, F1 (số thật; nếu cải thiện nhỏ hoặc không cải thiện thì GHI ĐÚNG như vậy, không tô vẽ).
  Tự làm: ★ đếm số 0 từng cột và thay bằng NaN (chỉ các cột phù hợp; Pregnancies giữ nguyên) — kiểm
  data.isna().sum(); ★★ SimpleImputer fit trên train, so mean/median; ★★★ cố tình fit imputer trên toàn
  bộ, nói leakage ở đâu.

Bước 9 — Làm như thật: Pipeline và K-fold cross-validation
  Lý thuyết: nối [[bài:k-fold-cross-validation]], [[bài:ml-pipeline]]. Pipeline([("imputer", …),
  ("scaler", …), ("model", …)]) gói mọi bước: gọi fit/predict một lần, và trong cross_val_score mỗi
  fold tự fit lại imputer/scaler trên phần train của fold → KHÔNG leak. So với cách làm tay ở các
  bước trước (kết quả train/test khớp nếu cùng cấu hình — kiểm).
  cross_val_score(pipeline, x, y, cv=5, scoring="f1") — dùng StratifiedKFold(shuffle=True,
  random_state=42) cho tường minh. In mean ± std (số thật). So 3–4 mô hình; đọc std để biết mô hình
  nào ổn định. Chốt cách chọn: theo mean CV của metric phù hợp (ở đây recall/F1 hợp lý hơn
  accuracy), rồi MỚI đánh giá MỘT lần trên test; nhắc test không dùng để chọn.
  Gói gọn thành hàm evaluate(model, x, y) trả dict metrics → dùng lại cho mọi mô hình (đúng phong
  cách "gom code lặp" của người làm thật).
  Tự làm: ★ chạy Pipeline cho Logistic và so với làm tay; ★★ cross_val_score 5-fold cho Logistic vs
  Forest, nhận xét mean và std; ★★★ viết evaluate() rồi chạy cho 4 mô hình, chọn mô hình theo recall
  và giải thích lựa chọn (kèm lý do y tế).
Cuối bài 02: :::recap, "Checklist tự kiểm" (ví dụ: tôi giải thích được vì sao chỉ fit scaler trên
train; tôi đọc được confusion matrix; tôi biết số 0 trong dữ liệu là thiếu; tôi biết chọn mô hình
bằng CV chứ không bằng test; tôi viết lại được toàn bộ pipeline không nhìn), :::quiz (tầng A ≥4: tính
precision/recall từ ma trận thật, đọc bảng CV; tầng B ≥5 có EN: "How do you choose between a linear
and a non-linear model?", "Why is accuracy misleading on imbalanced data?", "What is data leakage
and how do you avoid it?", "What does a Pipeline give you?", "Why use cross-validation instead of a
single split?"; tầng C ≥3: bài toán sàng lọc bệnh ưu tiên recall; dữ liệu có số 0 bất thường; mô
hình train tốt test tệ), :::next: nêu hướng tiếp theo trong module Projects; CHƯA có bài thì chỉ ghi
tên, KHÔNG tạo [[bài:…]] chết.

Cuối cả hai bài thêm một khối "Bộ code hoàn chỉnh để gõ lại" (:::code) — bản sạch KHÔNG chú thích
dài, dán chạy được ngay (bài 01: bước 1–5; bài 02: bước 6–9). Đây là cái chủ repo dùng để luyện
gõ lại không nhìn. Mọi snippet trong bài phải là đoạn của bản hoàn chỉnh (nhất quán tên biến).

HÌNH ẢNH (ít nhưng đúng chỗ, matplotlib sinh từ code chạy thật, lưu public/plots/, không ảnh AI):
- Bài 01: (1) biểu đồ cột số lượng Outcome 0/1; (2) histogram Glucose tách theo Outcome; (3) hình
  minh hoạ chia 80/20 hoặc 60/20/20 dạng thanh ngang tỉ lệ; (4) trước/sau scale của hai feature
  (ví dụ Insulin vs DPF) trên cùng trục.
- Bài 02: (1) confusion matrix dạng heatmap có ghi số và tên ô TN/FP/FN/TP; (2) đường precision/
  recall theo ngưỡng; (3) bar/box mean ± std CV theo mô hình; (4) số lượng giá trị 0 theo cột.
Mỗi hình có chú thích 1–2 câu "nhìn gì". Không thêm hình ngoài danh sách nếu không cần.

Chuẩn kỹ thuật:
- Frontmatter: title, order (1, 2), description 1 câu có nội dung thật, needs (bài 01: [labeled-
  data, train-test-split, feature-scaling, classification-metrics]; bài 02: [diabetes-first-model,
  confusion-matrix, classification-metrics, k-fold-cross-validation, missing-values-outliers]),
  tags (diabetes, practice, pandas, scikit-learn, train-test-split, standardscaler, pipeline,
  confusion-matrix, cross-validation, data-leakage…). Không có slides nếu hạ tầng cho phép.
- Khung: :::intro → (Bản đồ các bước) → thân (mỗi Bước theo đúng vòng 5 phần ở trên) → :::recap →
  Checklist → :::quiz → :::next.
- MỌI con số (shape, số đếm, tương quan, accuracy/precision/recall/F1, bảng ngưỡng, bảng mô hình, CV
  mean±std) chạy bằng Python thật trước khi ghi; ghi rõ phiên bản scikit-learn/pandas đã dùng và
  random_state. Script kiểm đặt thư mục tạm hoặc phụ lục báo cáo, không để trong content/. Bảng và
  số có thể lệch giữa phiên bản sklearn — ghi "với sklearn x.y.z".
- Không dùng "½" trong code block. Số không lấy từ dữ liệu thật phải ghi "tự soạn".

ĐỐI CHIẾU GHI CHÚ CỦA CHỦ REPO VỚI BÀI (bắt buộc, ghi kết quả vào báo cáo)
- "Dựa vào bảng correlation dùng mô hình phi tuyến thay vì tuyến tính": suy luận hợp lý ở mức giả
  thuyết nhưng chưa đủ; Pearson chỉ đo tuyến tính; số trong ảnh có thể không phải Pearson — báo cáo
  loại tương quan nào khớp. Kết quả thực nghiệm (Logistic vs Forest) quyết định.
- "axis=0 lỗi vì không có hàng nào là Outcome": ĐÚNG (KeyError: ... not found in axis). Kiểm thông
  điệp lỗi thật của phiên bản pandas đang cài.
- "test_size train_size chỉ dùng 1 cái": ĐÚNG; nếu đưa cả hai, sklearn dùng cả hai (không lỗi nếu
  tổng ≤ 1); NÊU CHÍNH XÁC bằng cách thử code, đừng nói theo trí nhớ.
- "Mỗi lần chạy ra index khác nhau vì sklearn trộn": ĐÚNG; random_state cố định bộ chia. Nói thêm
  random_state của split và của model (RandomForest) là HAI thứ độc lập.
- "Fit chỉ trên train; val, test tuyệt đối không fit": ĐÚNG, giữ nguyên; thêm ngoại lệ không có ở
  đây (chỉ nhắc 'các bước tiền xử lý học tham số từ dữ liệu đều theo quy tắc này', gồm imputer).
- "MinMaxScaler nhạy outlier nên dùng StandardScaler": xem Bước 4 — đúng tương đối, cả hai đều bị
  ảnh hưởng.
- "Cây/forest không cần chuẩn hoá vì tương tác bằng so sánh": ĐÚNG; kiểm bằng thực nghiệm Bước 7.
- "Chuẩn hoá cần thiết cho linear, logistic, SVM, kể cả KNN": ĐÚNG; với Logistic có regularization
  mặc định (C=1, L2) nên scale càng quan trọng — nêu 1 câu.
- Code của chủ repo: thiếu import classification_report, confusion_matrix; "X_test" gõ hoa; nhắc
  trong phần "đọc lỗi". Không sửa mà không giải thích.
- 60/20/20 với test_size=0.25 ở lần chia thứ hai: ĐÚNG (0.25 × 0.8 = 0.2); tính để chứng minh.

PHẦN B — Liên kết & cập nhật
- roadmap.json: module 06-projects thêm 2 topic (diabetes-first-model order 1, diabetes-evaluate-
  improve order 2; group "Thực hành 1 — Diabetes"; file path theo cấu trúc hiện có — kiểm cách app
  tìm file ở thư mục 06-projects; nếu hạ tầng chưa hỗ trợ module có topic thực hành, sửa tối thiểu
  và BÁO CÁO rõ mọi thay đổi TypeScript/React).
- Module 02: 04-logistic-regression, 07-decision-tree, 08-random-forest có thể thêm một dòng "Thực
  hành: xem [[bài:diabetes-first-model]]" ở cuối nếu tự nhiên; không ép. Module 01: train-test-split,
  feature-scaling, classification-metrics, k-fold-cross-validation, missing-values-outliers: thêm
  link ngược tới bài thực hành nếu hợp lý (một dòng, không viết lại bài).
- project-brief.md: cập nhật danh sách bài/trạng thái (module 06 có 2 bài thực hành đầu tiên; phần
  Unsupervised vẫn chưa làm).
- Kiểm module index, dependency map, /phong-van (câu B/C mới hiện, lọc được theo tag), search/filter
  nếu có. grep số bài hard-code ("31 bài", "8 bài"…) trong UI/README, sửa.

VERIFY
- npm run build pass; npx tsc --noEmit pass; hai route /06-projects/diabetes-first-model và
  /diabetes-evaluate-improve được sinh; không warning mới.
- Render: TOC, ảnh plot hiện, link chéo (module 01/02), quiz 3 tầng, khối :::code có nút copy, đáp án
  bài tập gấp/ẩn được (hoặc đặt dưới tiêu đề riêng nếu không có khối gấp), bảng/công thức/code không
  tràn ngang ở 390px.
- Prev/next trong module 06 chạy; module 06 không còn hiển thị "trống".
- Chạy TOÀN BỘ code của hai bài từ đầu đến cuối trong môi trường sạch (python -I -c / venv nếu có) với
  dataset/diabetes.csv: chạy không lỗi, số khớp số trong bài. Chạy cả "Bộ code hoàn chỉnh". Thử từng
  bài tập ★★★ để chắc đáp án đúng.
- Đọc lại như người mới học: chỗ nhảy bước, ký hiệu chưa giải thích, thuật ngữ trước định nghĩa, bước
  nào quá dày (> một màn hình code hoặc > 2 khái niệm mới) → tách hoặc cắt. Nếu một bài vẫn "ngợp",
  rút bớt, đừng thêm.

GIT
- Commit THẲNG lên main (chủ repo đã cho phép, không tạo nhánh). Commit nhỏ: chore(dataset) thêm
  diabetes.csv; feat(content) bài 01 + ảnh; feat(content) bài 02 + ảnh; fix(content) liên kết bài cũ;
  docs cho brief. Chỉ commit sau khi build/tsc pass. KHÔNG push. Giữ nguyên các file codex-prompt-*.md
  chưa track. Báo cáo để chủ repo duyệt.

BÁO CÁO CUỐI (file practice-diabetes-report.md ở gốc, ngắn): xác nhận đã làm trên main; cấu trúc hai bài và
số bước/bài tập; kết quả BƯỚC 0 (số đếm, tương quan thật, loại tương quan khớp ảnh chủ repo,
metrics của Logistic và Forest); đối chiếu từng điểm ghi chú chủ repo; mọi thay đổi hạ tầng
(roadmap/TypeScript) và lý do; phiên bản python/pandas/sklearn đã dùng; bảng số chính đã kiểm;
chỗ có thể còn ngợp; việc chưa làm; gợi ý thực hành tiếp theo cho module Projects.

GHI CHÚ + CODE CỦA CHỦ REPO (nguyên văn)

Ghi chú tay (Lesson 8: Practice):
- Dựa vào bảng correlation, dùng mô hình phi tuyến thay vì tuyến tính, vì outcome target không bị ảnh
  hưởng nhiều bởi các feature khác, không có hệ số tương quan lớn. Câu hỏi phỏng vấn: dựa vào bảng
  dữ liệu nên chọn mô hình nào?
- Sau khi in report ta chia dữ liệu thành x và y. Hàm pandas drop: bỏ cột Outcome có x, giữ cột
  Outcome thì có y. axis=0 → lựa chọn hàng → lỗi vì không có hàng nào là Outcome; axis=1 → chọn cột.
- Tách bộ train/test thường dùng scikit-learn (thư viện quốc dân cho ML): pip install -U scikit-learn;
  hàm train_test_split. test_size/train_size chỉ dùng 1 cái, thường dùng số thực float (0.33 = 33%).
- Muốn có bộ validation → tách thêm một lần nữa từ bộ train. Muốn tỉ lệ 60/20/20 thì lần hai
  test_size=0.25 (bộ test 20%, bộ train 80%, ở dòng dưới chia 25% = 0.25). Thường ít chia cứng như
  vậy mà dùng K-fold cross validation nên bỏ dòng dưới đi.
- Sau khi tách, chỉ số x_train bị lộn xộn vì sklearn trộn, mỗi lần chạy lại chỉ số khác nhau, chỉ
  đảm bảo tỉ lệ chia. Nếu không cố định bộ test bộ train thì mỗi lần có kết quả khác nhau: hôm nay
  train mô hình A accuracy 80%, ngày mai thay đổi cách tiền xử lý / mã hoá / phương pháp mới, có bộ
  train test mới thì có kết quả mới, không biết so với hôm qua cái gì làm nó tốt hơn hay tệ hơn. Để
  tránh thì thêm random_state=42 (số nào cũng được, nhưng 42 thì muôn đời phải để 42), đây là cách
  cố định bộ test → bộ train cũng cố định. Ta muốn phân chia ngẫu nhiên nhưng cố định.
- Tiền xử lý dữ liệu: dữ liệu dạng số nên dùng MinMaxScaler (nhạy cảm với outlier) nên dùng
  StandardScaler (ít nhạy cảm với outlier). Mỗi đối tượng có 3 phương thức chuẩn trong tiền xử lý:
  fit(), transform(), fit_transform(). Ví dụ sắp Tết đi may quần áo mới, có mảnh vải đem ra tiệm may,
  việc đầu tiên anh thợ may làm là đo (fit) — tính kỳ vọng và độ lệch chuẩn, chỉ đo chưa cắt xén.
  Đo xong có số liệu rồi thì biến đổi (transform) — cắt may. fit_transform() làm cả hai bước. Quy tắc
  cơ bản: đo trước (fit) rồi mới transform. Một hôm khác lại cầm mảnh vải đến đo thì thợ may chỉ
  transform thôi, vì ông thợ may biết số đo rồi. Ta chỉ fit với bộ train, bộ val bộ test tuyệt đối
  không dùng fit. Vì sao phải tiền xử lý: vì ban đầu xuất phát phải công bằng.
- Sau khi tiền xử lý xong → gọi mô hình: model = RandomForestClassifier(); model.fit(x_train, y_train).
  Đây là train chưa dùng val, mình sẽ đánh giá trên bộ test: y_predict = model.predict(x_test).
- Metrics dành cho bài toán phân loại: đưa vào 2 thứ y thực tế y_true trước và y dự đoán y_predict.
- Mỗi lần chạy ra kết quả khác nhau mặc dù không thay đổi gì? → Random Forest cũng có yếu tố random:
  RandomForestClassifier(random_state=200).
- Theo lý thuyết, mô hình phi tuyến tốt hơn mô hình tuyến tính, nhưng đây chỉ là lý thuyết, phải thử.
  Thử Logistic Regression: chạy thử ta thấy mô hình tuyến tính tốt hơn. Buổi sau sẽ giới thiệu chạy
  một loạt mô hình, việc feature với target chọn mô hình tuyến tính, còn không chọn phi tuyến →
  phục vụ phỏng vấn.
- Nói thêm: việc chuẩn hoá dữ liệu là cần thiết cho rất nhiều thuật toán như linear, logistic, svm,
  thậm chí cho cả KNN. Có những ngoại lệ thuật toán không cần chuẩn hoá features, như decision tree,
  random forest, vì nó khác sự tương tác giữa mô hình với dữ liệu, nó không tương tác qua phép cộng
  phép nhân mà tương tác qua phép so sánh, dải giá trị không còn quan trọng nữa.
- Trong sklearn có report riêng cho classification report (in ra cho tôi xem, nói về chi tiết các
  giá trị in ra), confusion matrix thì có bảng mới.
- Cách chạy code trên PyCharm: bôi đen đoạn code → "Execute Selection in Python Console"
  (Alt+Shift+E) và xem bảng biến ở panel bên phải (View as DataFrame / Series).

Code của bài học:

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score,f1_score
from sklearn.linear_model import LogisticRegression
data = pd.read_csv('diabetes.csv')

x = data.drop(labels="Outcome", axis = 1)
y = data["Outcome"]

x_train, x_test, y_train,y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)

#model = RandomForestClassifier(random_state=200)
model = LogisticRegression()
model.fit(x_train,y_train)

y_predict = model.predict(x_test)
# for i, j in zip(y_predict, y_test):
#     print("Predicted: {}. Actual value:{}".format(i,j))
print("Accuracy:", accuracy_score(y_test, y_predict))
print("Precision:", precision_score(y_test, y_predict))
print("Recall:", recall_score(y_test, y_predict))
print("F1:", f1_score(y_test, y_predict))

print(classification_report(y_test, y_predict))
print(confusion_matrix(y_test,y_predict))
```
