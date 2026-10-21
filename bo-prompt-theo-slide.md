# Bộ prompt viết bài ML Learning Hub — theo số slide

Mỗi prompt dùng cho **1 chat mới** trong Project "MachineLearning". Cách dùng:

1. Mở chat mới trong Project, **đặt tên chat theo mã phần** (ví dụ
   `P05 · Slide 64–69 · Linear/Logistic`) để sau này dễ tìm.
2. **Đính kèm file PDF của phần đó** (`Pxx_slide-aaa-bbb.pdf` trong bộ file
   đã cắt sẵn). Bắt buộc, vì PDF trong Project là ảnh nên Claude không đọc được
   chữ từ đó.
3. Dán nguyên khối prompt của phần đó vào.
4. Làm lần lượt P01 → P20, xong phần này mới sang phần sau, vì các phần cùng
   sửa `roadmap.json`.
5. Xong mỗi phần, dán dòng trạng thái Claude trả về vào bảng tiến độ cuối file.

Quy ước nội dung, design, trạng thái repo và quy trình chung nằm trong
`ml-learning-hub-handoff.md` (mục 10 là quy trình mỗi chat phải làm theo), nên
các prompt bên dưới chỉ ghi phần riêng của từng phần.

---

## P01 · Slide 39–44 · ML pipeline + Step 2 Statistics

```
[ML Hub · P01 · Slide 39–44]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 39–44, file đính kèm P01_slide-039-044.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả chú thích tay):
- 39: Machine Learning pipeline 7 bước (Data collection → Statistics → Data
  preprocessing → Data visualization → Model building → Model evaluation →
  Model deployment)
- 40–44: Step 2 Statistics trên Diabetes dataset: xem dữ liệu (pandas
  read_csv), kiểm tra kiểu dữ liệu từng feature (dtypes), describe(), phân bố
  class của Outcome (500 / 268)

Dự kiến: module 01, bài 15 (ML pipeline tổng thể) và bài 16 (Thống kê mô tả /
khám phá dữ liệu). Bài 15 là "bản đồ" cho các phần P02–P04 phía sau, nên nói
rõ mỗi bước sẽ học ở bài nào.
Lưu ý: nối phân bố class 500/268 với dữ liệu mất cân bằng (bài 09, 12) và
báo trước Step 3.5 Balance data. Giải thích từng cột của describe() (count,
mean, std, min, 25%, 50%, 75%, max) bằng số liệu thật; chỉ ra các giá trị 0
bất thường (Glucose, BloodPressure, Insulin, BMI = 0) như dấu hiệu dữ liệu
thiếu — gối đầu sang P02.
Việc phụ: nếu có quyền vào D:\ML_VNAI, sửa bảng K-fold thường ở bài 09 theo
mục 8 của handoff.
```

---

## P02 · Slide 45–51 · Step 3 Tiền xử lý dữ liệu

```
[ML Hub · P02 · Slide 45–51]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 45–51, file đính kèm P02_slide-045-051.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả chú thích tay):
- 45: Step 3.1 Handle missing or invalid values (ví dụ bảng Titanic có ô trống)
- 46: Step 3.2 Remove outliers (ảnh chim cánh cụt khác màu)
- 47: Step 3.3 tiền xử lý numerical features: MinMaxScaler, StandardScaler
  (ảnh code + output)
- 48: Step 3.3 ordinal features: OrdinalEncoder
- 49: Step 3.3 mã hóa nominal: One-hot, Hash encoding, Word embedding (ưu/nhược)
- 50: Step 3.4 Correlation giữa các biến (công thức Pearson, scatter plot)
- 51: Step 3.4 (Multi)collinearity (ngưỡng |r| > 0.7, sơ đồ Venn)

Dự kiến: module 01, nối tiếp bài 16. Gợi ý chia: Missing values & Outliers /
Feature scaling / Encoding categorical features / Correlation &
Multicollinearity (tách hay gộp tùy độ dài khi đọc slide).
Lưu ý: nối encoding với bài 02 (Nominal/Ordinal/Boolean). Với scaling, nhấn
mạnh fit trên tập train rồi mới transform tập validation/test (nối bài 07) —
đánh dấu là bổ sung nếu slide không nói. Outlier: giải thích IQR và z-score
bằng ví dụ tay. Correlation: tính tay hệ số Pearson cho một bộ số nhỏ; ghi
rõ "correlation does not imply causation" (có trong slide). Dùng Diabetes
dataset khi có thể.
```

---

## P03 · Slide 52–54 · Step 3.5 Balance data

```
[ML Hub · P03 · Slide 52–54]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 52–54, file đính kèm P03_slide-052-054.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 52–53: Over-sampling: RandomOverSampler, SMOTE, ADASYN (decision function
  của LogisticRegression trước/sau resampling)
- 54: Under-sampling: ClusterCentroids

Dự kiến: module 01, 1 bài "Cân bằng dữ liệu (Imbalanced data)", là bài cuối
phần tiền xử lý.
Lưu ý: nối chặt với bài 09 (Stratified K-fold) và bài 12 (bẫy Accuracy, F1).
Giải thích SMOTE bằng ví dụ tay (nội suy giữa 2 điểm láng giềng). Nhấn mạnh
chỉ resample trên tập train, không resample validation/test (đánh dấu bổ sung
nếu slide không nói). Code dùng thư viện imbalanced-learn trên Diabetes
dataset (500/268). Nêu thêm class_weight như một cách khác (bổ sung).
```

---

## P04 · Slide 55–63 · Step 4 Data visualization

```
[ML Hub · P04 · Slide 55–63]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 55–63, file đính kèm P04_slide-055-063.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả code trong ảnh):
- 55: matplotlib & seaborn
- 56: Histogram; 57: Density plot; 58: Box plot (Diabetes dataset)
- 59–60: Correlation matrix (data.corr()) và heatmap seaborn
- 61: Scatter matrix
- 62: Giải phẫu một hình matplotlib (Figure, Axes, Axis, title, label…)
- 63: Grid, Legend

Dự kiến: đây là module mới — 04-data-visualization, bắt đầu từ bài 01. Gợi
ý chia: Giải phẫu matplotlib (Figure/Axes) / Biểu đồ phân bố 1 biến
(histogram, density, box plot) / Biểu đồ quan hệ nhiều biến (correlation
heatmap, scatter matrix). Có thể đặt bài giải phẫu matplotlib lên đầu cho dễ
học dù slide để cuối — ghi rõ lý do.
Lưu ý: với mỗi loại biểu đồ, nói rõ "dùng để trả lời câu hỏi gì" và "đọc nó
thế nào" (ví dụ đọc box plot: median, IQR, râu, outlier — nối với P02). Ví dụ
tay: dựng histogram/box plot bằng tay cho một dãy số nhỏ. Code chạy được với
matplotlib/seaborn; mô tả bằng lời hình kết quả trông ra sao.
```

---

## P05 · Slide 64–69 · Linear, Polynomial, Logistic Regression

```
[ML Hub · P05 · Slide 64–69]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 64–69, file đính kèm P05_slide-064-069.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả chú thích tay):
- 64: Bảng thuật toán Supervised: Regression (Linear, Polynomial) và
  Classification (Logistic, SVM*, KNN*, Naive Bayes, Decision Tree*, Random
  Forest*), dấu * = dùng được cho cả regression
- 65–66: Linear Regression (simple/multiple, công thức y = β0 + β1x1 + …,
  ưu/nhược)
- 67: Polynomial Regression
- 68–69: Logistic Regression (sigmoid, threshold 0.5, ưu/nhược)

Dự kiến: module mới 02-supervised-learning, bắt đầu từ bài 01. Gợi ý chia:
Tổng quan thuật toán Supervised / Linear Regression / Polynomial Regression /
Logistic Regression.
Lưu ý: Linear Regression nối với L2 loss (bài 06) — tính tay β0, β1 bằng
công thức bình phương tối thiểu cho 4–5 điểm. Logistic: tính tay sigmoid cho
vài giá trị, nối với threshold và ROC (bài 12–13), giải thích vì sao tên có
"Regression" nhưng dùng cho Classification (bài 10). Polynomial: nói trước về
overfitting khi bậc quá cao (gối đầu sang P11). Có thể chèn thêm Naive Bayes
nếu slide có (bảng slide 64 có tên nhưng có thể không có slide riêng — nếu
không có thì chỉ nhắc, đừng viết bài riêng).
```

---

## P06 · Slide 70–74 · Support Vector Machine

```
[ML Hub · P06 · Slide 70–74]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 70–74, file đính kèm P06_slide-070-074.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 70: Hyperplane, support vector, maximum margin
- 71: Linearly separable vs not linearly separable
- 72: Mapping sang chiều cao hơn (2D → 3D, φ(x1, x2) = (x1, x2, z))
- 73: Ví dụ biến đổi để tìm hyperplane (kernel trick)
- 74: khung đen — có lẽ video nhúng, bỏ qua

Dự kiến: module 02, nối tiếp sau Logistic Regression; 1–2 bài (SVM tuyến
tính / Kernel trick).
Lưu ý: ví dụ tay — dữ liệu 1D không tách được bằng 1 điểm, thêm z = x² thì
tách được bằng 1 đường thẳng. Giải thích tham số C và các kernel phổ biến
(linear, poly, RBF) — đánh dấu bổ sung nếu slide không có. So sánh với
Logistic Regression. Nhắc SVM cần scaling (nối P02).
```

---

## P07 · Slide 75–80 · KNN, Decision Tree, Random Forest

```
[ML Hub · P07 · Slide 75–80]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 75–80, file đính kèm P07_slide-075-080.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả số trong bảng Gini):
- 75: K-Nearest Neighbour (trước/sau KNN)
- 76: Decision Tree (cây quyết định "có nhận lời mời làm việc không")
- 77: Gini impurity, bảng tính Gini cho Age / Income / Student / Credit
  Rating, chọn feature tốt nhất
- 78–80: Random Forest (nhiều cây, bootstrap training data, voting/averaging)

Dự kiến: module 02, 3 bài: KNN / Decision Tree / Random Forest.
Lưu ý: KNN — tính tay khoảng cách Euclidean và chọn K, nhắc cần scaling, K
lẻ để tránh hòa. Decision Tree — tính lại từng con số Gini trong slide 77,
nếu slide sai thì ghi chú; giải thích Gini của một node và Gini có trọng số
của một lần chia. Random Forest — bagging, vì sao nhiều cây giảm variance
(gối đầu sang P11), feature importance (gối đầu P13). Nói rõ cả ba đều dùng
được cho regression (dấu * ở slide 64).
```

---

## P08 · Slide 81–82 · K-Means

```
[ML Hub · P08 · Slide 81–82]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 81–82, file đính kèm P08_slide-081-082.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 81: Unsupervised Learning algorithms — trước/sau K-Means
- 82: Các vòng lặp K-Means (chọn tâm, gán điểm, cập nhật tâm)

Dự kiến: module mới 03-unsupervised-learning, bài 01 K-Means.
Lưu ý: slide ít, nên phần mở rộng sẽ nhiều — đánh dấu rõ. Ví dụ tay: chạy
2–3 vòng K-Means với K = 2 trên 6 điểm 2D, ghi tọa độ tâm từng vòng. Bổ sung:
cách chọn K (elbow, silhouette), khởi tạo k-means++, vì sao không có
label nên không dùng được Accuracy (nối bài 03, 11–12), nhắc cần scaling.
```

---

## P09 · Slide 83–91 · NLP cơ bản

```
[ML Hub · P09 · Slide 83–91]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 83–91, file đính kèm P09_slide-083-091.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả code trong ảnh):
- 83: Natural Language Processing (Classical NLP vs Deep Learning)
- 84–86: Bag of Words, corpus 4 câu, CountVectorizer
- 87: Text preprocessing (bỏ dấu câu, lowercase, tokenization, stopwords,
  stemming vs lemmatization)
- 88–90: Hạn chế của BoW → N-grams (uni/bi/tri-gram), CountVectorizer
  ngram_range
- 91: TF-IDF

Chỗ đặt: NLP không có module riêng trong slide 2. Đề xuất module
06-projects. Hỏi tôi 1 câu để chốt trước khi tạo file (lựa chọn này sẽ dùng
luôn cho P10 và P15).
Dự kiến 3–4 bài: Text preprocessing / Bag of Words & N-grams / TF-IDF.
Lưu ý: tính tay TF-IDF cho corpus nhỏ trong slide, đúng công thức slide ghi;
nói rõ sklearn dùng công thức IDF có làm mượt nên số khác tính tay — chỉ ra
cách khớp lại. Nối BoW với "feature vector" (bài 04) và one-hot (P02).
```

---

## P10 · Slide 92–96 · Time series forecasting

```
[ML Hub · P10 · Slide 92–96]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 92–96, file đính kèm P10_slide-092-096.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 92: Time series forecasting (recursive multi-step t+1)
- 93–94: Time series data, biến chuỗi thành bảng X/y bằng cửa sổ trượt (lag),
  exogenous variable
- 95: Recursive multi-step forecasting
- 96: Direct multi-step forecasting

Chỗ đặt: theo lựa chọn đã chốt ở P09 (mặc định module 06-projects).
Dự kiến 2 bài: Biến time series thành bài Supervised (sliding window) /
Recursive vs Direct multi-step.
Lưu ý: ví dụ tay với chuỗi 1…10 như slide, lập bảng X/y với window = 5. Bổ
sung: không được shuffle hay K-fold thường với time series — dùng chia theo
thời gian (TimeSeriesSplit), nối với bài 07–08. Metric dùng MAE/RMSE (bài 14).
So sánh ưu nhược recursive (dồn sai số) vs direct (nhiều model).
```

---

## P11 · Slide 97–106 · Error in ML, Bias–Variance, chọn model

```
[ML Hub · P11 · Slide 97–106]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 97–106, file đính kèm P11_slide-097-106.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả chú thích tay):
- 97: Reducible error (Bias, Variance) vs Irreducible error
- 98: Bias — high bias = underfitting
- 99: Variance — high variance = overfitting
- 100–101: Bias–Variance tradeoff (đồ thị error theo model complexity, bia
  bắn), underfitting / optimal / overfitting
- 102: Chọn model theo dữ liệu (low bias + high variance vs high bias + low
  variance; nhiều data/ít feature…)
- 103: Chọn model theo business domain (metric, tốc độ, bộ nhớ,
  interpretability)
- 104: Interpretability vs Accuracy trade-off
- 105: Tips chọn model (bắt đầu đơn giản, GridSearchCV/RandomizedSearchCV)
- 106: Underfitting / Overfitting cho regression và classification

Dự kiến: module mới 05-model-evaluation, bắt đầu từ bài 01. Gợi ý chia:
Bias, Variance & Bias–Variance tradeoff / Underfitting & Overfitting (cách
phát hiện qua train error vs validation error) / Chọn model & Hyperparameter
tuning.
Lưu ý: nối với Train/Validation/Test và K-fold (bài 07–08), Polynomial
Regression (P05). Ví dụ tay: bảng train error / validation error của 3 model
và chẩn đoán từng cái. Code: vẽ learning curve hoặc so sánh polynomial bậc
1/3/15; GridSearchCV với cv = StratifiedKFold.
```

---

## P12 · Slide 107–111 · Regularization

```
[ML Hub · P12 · Slide 107–111]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 107–111, file đính kèm P12_slide-107-111.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả code trong ảnh):
- 107: Ý tưởng regularization (h(x) quá phức tạp, phạt θ bậc cao)
- 108: Công thức L1 (Lasso) và L2 (Ridge) regularization, hình thoi vs hình
  tròn
- 109: Hình 3D bề mặt loss
- 110: L1 sparsity, L2 weight sharing, L1 + L2 (Elastic Net)
- 111: Ví dụ code LogisticRegression penalty l1 / l2 trên Diabetes, so sánh
  hệ số

Dự kiến: module 05, nối sau bài Bias–Variance; 1–2 bài.
Lưu ý: phân biệt rõ L1/L2 **loss** (bài 06, đo sai số) với L1/L2
**regularization** (phạt độ lớn trọng số) — dễ nhầm nhất. Ví dụ tay: tính
cost = loss + λ·Σ|w| và loss + λ·Σw² cho 2 bộ trọng số, thấy λ thay đổi lựa
chọn. Giải thích hình học vì sao L1 cho trọng số bằng 0. Nói về tham số C
trong sklearn = 1/λ. Chạy lại code slide 111 và so sánh hệ số.
```

---

## P13 · Slide 112–120 · Dimensionality reduction & Feature selection

```
[ML Hub · P13 · Slide 112–120]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 112–120, file đính kèm P13_slide-112-120.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kể cả code trong ảnh):
- 112: Dimensionality reduction = Feature selection vs Feature extraction
- 113: Curse of dimensionality (1D 4 vùng, 2D 16 vùng, 3D 64 vùng)
- 114: Feature selection
- 115: Theo Correlation coefficient (heatmap)
- 116: VarianceThreshold
- 117: Lasso (L1)
- 118: RandomForest feature_importances_
- 119: Feature extraction (minh họa)
- 120: Feature extraction — PCA (hình minh họa)

Dự kiến: module 05, nối sau Regularization. Gợi ý chia: Curse of
dimensionality & 2 hướng giảm chiều / Các phương pháp Feature selection.
Feature extraction (PCA) để sang P14.
Lưu ý: nối Correlation với P02, Lasso với P12, RF importance với P07. Ví dụ
tay: tính phương sai từng cột để áp VarianceThreshold; đếm số vùng trong
curse of dimensionality. Code chạy trên Diabetes dataset, đối chiếu với output
trong ảnh slide.
```

---

## P14 · Slide 121–131 · Variance, Covariance, Correlation và PCA

```
[ML Hub · P14 · Slide 121–131]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 121–131, file đính kèm P14_slide-121-131.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật, kiểm tra từng con số):
- 121: Variance in data (chiều cao 2 nhóm người)
- 122–123: Covariance vs Correlation (công thức, bảng so sánh)
- 124: PCA step 1 Standardize (bảng 5×4, μ, σ)
- 125: Step 2 Covariance matrix
- 126–127: Step 3 Eigenvector, eigenvalue (định nghĩa, ví dụ 2×2,
  eigenvalue 2.515 / 1.065 / 0.393 / 0.025)
- 128: Step 4 Sort eigenvalues
- 129: Step 5 Chọn k = 2
- 130: Step 6 Transform N×4 → N×2
- 131: PCA visualization

Dự kiến: module 05, nối sau Feature selection. Gợi ý chia: Variance,
Covariance, Correlation / PCA từng bước / (tuỳ chọn) PCA trong thực tế
(explained variance ratio, chọn k).
Lưu ý: tính lại toàn bộ bảng số của slide 124–130 bằng NumPy. Chú ý slide
dùng σ chia N hay N−1 khi standardize và khi tính covariance — xác định đúng
từ số liệu và ghi rõ, vì đây là chỗ dễ lệch số (P19 sẽ học N vs N−1). Ví dụ
tay eigenvalue 2×2 như slide. Tính tỉ lệ phương sai giữ lại khi k = 2.
```

---

## P15 · Slide 132–139 · Recommendation systems

```
[ML Hub · P15 · Slide 132–139]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 132–139, file đính kèm P15_slide-132-139.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 132–133: Recommendation system là gì
- 134: Các loại: Popularity-based, Content-based, Collaborative filtering,
  Hybrid
- 135: Popularity-based (giao diện Netflix)
- 136: Content-based filtering
- 137: Collaborative filtering
- 138: Hybrid
- 139: Utility matrix

Chỗ đặt: theo lựa chọn đã chốt ở P09 (mặc định module 06-projects).
Dự kiến 2 bài: Tổng quan & Popularity / Content-based vs Collaborative
filtering & Utility matrix.
Lưu ý: slide chủ yếu là hình, phần công thức sẽ là bổ sung — đánh dấu rõ.
Ví dụ tay: utility matrix 4 user × 5 item, tính cosine similarity giữa user
để gợi ý (user-based CF); content-based dùng vector TF-IDF (nối P09). Nêu
cold-start problem.
```

---

## P16 · Slide 140–148 · Phân phối chuẩn và Định lý giới hạn trung tâm

```
[ML Hub · P16 · Slide 140–148]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 140–148, file đính kèm P16_slide-140-148.pdf. Đây là phần
đầu của chương Kiểm định giả thuyết (P16–P20).
Nội dung tôi lướt thấy (phải đọc slide thật):
- 140: Tiêu đề "Kiểm định giả thuyết"
- 141: Phân phối chuẩn N(μ, σ²), hàm mật độ, 68.27 / 95.45 / 99.73%
- 142: Quy tắc 3σ
- 143: P(a ≤ X ≤ b) qua hàm Laplace, bảng giá trị hàm Laplace
- 144–147: Định lý giới hạn trung tâm (n ≥ 30, ví dụ tung xúc xắc, bảng Galton)
- 148: Tổng quát: population → sampling → sample → inference

TRƯỚC KHI TẠO FILE, hỏi tôi chọn chỗ đặt cho cả chương P16–P20 (xem mục 3
của handoff): (a) module mới 07 "Thống kê & Kiểm định giả thuyết" (phải sửa
roadmap.json và giao diện trang chủ đang vẽ cho 6 module — nếu chọn a, viết
kèm một prompt ngắn cho Claude trong VS Code để sửa giao diện), hoặc (b) đặt
vào module 05.
Dự kiến 2 bài: Phân phối chuẩn & quy tắc 3σ / Định lý giới hạn trung tâm.
Lưu ý: ví dụ tay tính xác suất bằng chuẩn hóa Z và tra bảng (ví dụ chiều
cao); nói rõ quy ước bảng Laplace Φ0 (từ 0 đến z) khác bảng phân phối tích
lũy Φ (từ −∞ đến z) — dễ nhầm. Code: scipy.stats.norm, mô phỏng CLT bằng
tung xúc xắc với NumPy.
```

---

## P17 · Slide 149–158 · Khái niệm kiểm định giả thuyết

```
[ML Hub · P17 · Slide 149–158]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 149–158, file đính kèm P17_slide-149-158.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 149: Hypothesis, statistical hypothesis (tham số / phi tham số), hypothesis
  testing
- 150: H0 và H1 (=, ≠, >, <; ví dụ tuổi thọ trung bình người VN = 65)
- 151–152: Ví dụ chiều cao người Anh 1m75; lương nhân viên 10 triệu
- 153–154: Quyết định: "bác bỏ H0" / "không đủ cơ sở bác bỏ H0", vì sao không
  nói "chấp nhận H0" (ví dụ tôm hùm cây, tòa án)
- 155: Nguyên lý xác suất nhỏ
- 156: Phương pháp phản chứng
- 157: Bảng quyết định & sai lầm loại I (α) / loại II (β), lực kiểm định 1 − β
- 158: Tiêu đề "Các bước tiến hành kiểm định giả thuyết" (nội dung ở P18)

Chỗ đặt: theo lựa chọn đã chốt ở P16.
Dự kiến 2 bài: Giả thuyết thống kê, H0/H1 và logic kiểm định / Sai lầm loại
I, loại II và mức ý nghĩa.
Lưu ý: nối trực tiếp với bài 11 — Type I = FP, Type II = FN; với α, β đặt cạnh
FPR và 1 − Recall. Ví dụ thực tế gắn bối cảnh Việt Nam. Bài tập: tự lập H0/H1
cho 5 tình huống.
```

---

## P18 · Slide 159–167 · 5 bước kiểm định Z

```
[ML Hub · P18 · Slide 159–167]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 159–167, file đính kèm P18_slide-159-167.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 159: Bước 1 lập cặp giả thuyết H0, H1
- 160–161: Bước 2 chọn thống kê Z = (X̄ − μ0)√n / σ, điều kiện (X phân phối
  chuẩn hoặc n > 30)
- 162–165: Bước 3 miền bác bỏ: kiểm định 2 phía, phía trái, phía phải; tra
  z_α, z_α/2 (1.96, 1.65)
- 166: Bước 4 tính giá trị quan sát Z
- 167: Bước 5 so sánh và kết luận

Chỗ đặt: theo lựa chọn đã chốt ở P16.
Dự kiến 1–2 bài: Quy trình 5 bước kiểm định Z (1 phía / 2 phía).
Lưu ý: làm trọn vẹn 2 ví dụ tay (1 bài 2 phía, 1 bài 1 phía) theo đúng 5 bước,
có hình miền bác bỏ mô tả bằng lời. Bổ sung p-value như cách kết luận tương
đương. Code bằng scipy.stats, in ra Z, giá trị tới hạn, p-value.
```

---

## P19 · Slide 168–172 · T-test khi không biết phương sai

```
[ML Hub · P19 · Slide 168–172]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.
Viết luôn thành bài cho web, thật đầy đủ.

Phần này: slide 168–172, file đính kèm P19_slide-168-172.pdf.
Nội dung tôi lướt thấy (phải đọc slide thật):
- 168: Trường hợp không biết phương sai tổng thể
- 169: Z → T = (X̄ − μ0)√n / S
- 170: Phương sai tổng thể (chia N) vs phương sai mẫu hiệu chỉnh (chia n − 1)
- 171: Bảng phân phối Student, z_α → t_α^(n−1)
- 172: Z-test vs T-test (biết σ? n > 30?)

Chỗ đặt: theo lựa chọn đã chốt ở P16.
Dự kiến 1–2 bài: Phương sai mẫu & bậc tự do / T-test và khi nào dùng Z hay T.
Lưu ý: giải thích trực giác vì sao chia n − 1 (bổ sung), chỉ ra np.var mặc
định chia N, pandas .var() chia n − 1 (nối với PCA ở P14). Ví dụ tay đủ 5
bước với n nhỏ. Code scipy.stats.ttest_1samp.
```

---

## P20 · Slide 173–177 · Bài tập kiểm định giả thuyết

```
[ML Hub · P20 · Slide 173–177]
Đây là dự án ML Learning Hub (trang ghi chú tự học ML, không phải đồ án). Đọc
ml-learning-hub-handoff.md trong Project trước rồi làm đúng quy trình mục 10.

Phần này: slide 173–177, file đính kèm P20_slide-173-177.pdf — 5 slide bài
tập kiểm định giả thuyết (khoảng 15 bài).
Việc cần làm: giải đầy đủ từng bài theo đúng 5 bước (lập H0/H1, chọn Z hay T
và lý do, miền bác bỏ, giá trị quan sát, kết luận bằng lời), kiểm tra bằng
scipy. Chép lại đề chính xác từ slide (gõ lại, không tóm tắt); chỗ nào đọc
không rõ thì đánh dấu và hỏi tôi.
Chỗ đặt: theo lựa chọn đã chốt ở P16, 1 bài "Bài tập kiểm định giả thuyết"
(hoặc chia 2 bài nếu quá dài). Template 6 phần có thể điều chỉnh: mục 1–3 tóm
tắt quy trình và bảng chọn Z/T, mục 4 lời giải từng bài, mục 5 code, mục 6 vài
bài tự luyện mới có đáp án.
```

---

## Bảng tiến độ (dán dòng trạng thái mỗi chat trả về)

| Mã | Slide | Trạng thái | Bài đã viết | Ghi chú |
|---|---|---|---|---|
| — | 1–38 | xong | 01/01–14 | |
| P01 | 39–44 | | | |
| P02 | 45–51 | | | |
| P03 | 52–54 | | | |
| P04 | 55–63 | | | |
| P05 | 64–69 | | | |
| P06 | 70–74 | | | |
| P07 | 75–80 | | | |
| P08 | 81–82 | | | |
| P09 | 83–91 | | | |
| P10 | 92–96 | | | |
| P11 | 97–106 | | | |
| P12 | 107–111 | | | |
| P13 | 112–120 | | | |
| P14 | 121–131 | | | |
| P15 | 132–139 | | | |
| P16 | 140–148 | | | |
| P17 | 149–158 | | | |
| P18 | 159–167 | | | |
| P19 | 168–172 | | | |
| P20 | 173–177 | | | |
