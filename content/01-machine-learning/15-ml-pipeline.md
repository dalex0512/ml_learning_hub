---
title: Machine Learning Pipeline — 7 bước của một dự án ML
order: 15
description: Bức tranh toàn cảnh một dự án ML từ lúc thu thập dữ liệu đến khi đưa model vào sử dụng — 7 bước theo slide 39, mỗi bước làm gì, vì sao cần, và sẽ được học ở bài nào.
---

## 1. Ý tưởng

Từ bài 01 đến bài 14, ta đã học từng "mảnh" riêng lẻ: feature và label,
loss, chia train/test, K-fold, confusion matrix, các metric… Slide 39 ghép
tất cả lại thành **một quy trình hoàn chỉnh** — gọi là **Machine Learning
pipeline** — gồm 7 bước:

| Bước | Tên (slide) | Nghĩa (slide) |
|---|---|---|
| Step 1 | Data collection | Thu thập dữ liệu |
| Step 2 | Statistics | Hiểu dữ liệu thông qua thống kê |
| Step 3 | Data preprocessing | Tiền xử lý dữ liệu |
| Step 4 | Data visualization | Trực quan hóa dữ liệu |
| Step 5 | Model building | Xây dựng và huấn luyện mô hình |
| Step 6 | Model evaluation | Đánh giá mô hình |
| Step 7 | Model deployment | Triển khai mô hình |

Một cách dễ nhớ là so với **nấu một nồi phở** *(ví dụ tự soạn)*:

| Nấu phở | Bước ML |
|---|---|
| Đi chợ mua xương, thịt, bánh phở | 1. Thu thập dữ liệu |
| Xem nguyên liệu: bao nhiêu cân, có miếng nào hỏng không | 2. Thống kê |
| Rửa, chần xương, bỏ phần hỏng, thái thịt đều nhau | 3. Tiền xử lý |
| Nhìn màu nước dùng, nếm thử | 4. Trực quan hóa |
| Ninh nước dùng theo công thức | 5. Xây dựng & huấn luyện model |
| Cho vài người ăn thử, chấm điểm | 6. Đánh giá |
| Mở quán bán cho khách | 7. Triển khai |

Điểm mấu chốt: **model chỉ là bước 5**. Phần lớn công sức của một dự án ML
thật nằm ở các bước **trước** (hiểu và làm sạch dữ liệu) và **sau** (đánh
giá, triển khai). Nguyên liệu hỏng thì đầu bếp giỏi mấy cũng không cứu
được — trong ML gọi là ***garbage in, garbage out***.

> **EN:** Lessons 01–14 covered individual pieces (features and labels,
> loss, train/test split, K-fold, confusion matrix, metrics…). Slide 39
> assembles them into one complete workflow — the **Machine Learning
> pipeline** — with 7 steps: **data collection, statistics, data
> preprocessing, data visualization, model building, model evaluation,
> model deployment**. *(Own analogy)* It's like cooking phở: shopping for
> ingredients, inspecting them, washing and cutting, tasting the broth,
> simmering by recipe, letting people taste-test, then opening a shop. The
> key point: **the model is only step 5** — most of the effort in a real
> project goes into the steps before (understanding and cleaning data) and
> after (evaluation, deployment). ***Garbage in, garbage out.***

## 2. Vị trí trong pipeline

Bài này **chính là** pipeline, nên câu hỏi đúng ở đây là: *những bài đã
học nằm ở đâu trong 7 bước?*

- **Bài 02, 04** (dataset, feature, label, X và y) → cái ta có trong tay
  sau **Step 1**.
- **Bài 05, 06** (model training, loss function) → bên trong **Step 5**.
  Sơ đồ Input → Model → Output → so với Label → Loss ở bài 05 chính là
  "phóng to" của bước Model building.
- **Bài 07, 08, 09** (chia Train/Validation/Test, K-fold, Stratified
  K-fold) → cách tổ chức dữ liệu để **Step 5 và Step 6** làm việc đúng.
- **Bài 10–14** (Classification/Regression, confusion matrix, Accuracy,
  Precision, Recall, F1, ROC–AUC, MAE, RMSE) → công cụ của **Step 6**.

Nói cách khác: phần đầu khóa học đã dạy "nửa sau" của pipeline (bước 5–6)
trước. Từ bài 16 trở đi, khóa học quay lại dạy "nửa đầu" (bước 2–4) rồi
mới đi sâu vào các thuật toán của bước 5.

> **EN:** This lesson *is* the pipeline, so the useful question is where
> earlier lessons fit. Lessons 02 and 04 (dataset, features, labels, X
> and y) describe what we hold after **Step 1**. Lessons 05–06 (training,
> loss) live inside **Step 5**. Lessons 07–09 (splits, K-fold, Stratified
> K-fold) organise data so **Steps 5–6** work correctly. Lessons 10–14
> (metrics) are the tools of **Step 6**. So the course taught the second
> half (steps 5–6) first; from lesson 16 on it goes back to steps 2–4,
> then dives into the algorithms of step 5.

## 3. Công thức / cách hoạt động

### 3.1. Step 1 — Data collection (Thu thập dữ liệu)

Lấy dữ liệu về: từ file CSV có sẵn, cơ sở dữ liệu của công ty, khảo sát,
cảm biến, API, crawl web… Trong khóa học, bước này gần như đã được làm sẵn:
ta nhận file `diabetes.csv` và đọc vào.

*(Bổ sung — không có trong slide)* Những câu hỏi cần đặt ra ở bước này:
dữ liệu có **đại diện** cho tình huống sẽ dùng model không (ví dụ Diabetes
dataset chỉ gồm phụ nữ từ 21 tuổi, dùng cho nam giới sẽ không đáng tin)?
Label có **đáng tin** không (ai gán, gán thế nào)? Có được phép dùng dữ
liệu đó không (quyền riêng tư, nhất là dữ liệu y tế)?

> **EN:** Get the data: existing CSV files, company databases, surveys,
> sensors, APIs, web crawling… In this course it's essentially done for
> us — we receive `diabetes.csv`. *(Supplementary)* Questions to ask: is
> the data **representative** of where the model will be used (the
> Diabetes dataset contains only women aged 21+)? Are the labels
> **reliable**? Are we **allowed** to use it (privacy, especially medical
> data)?

### 3.2. Step 2 — Statistics (Hiểu dữ liệu thông qua thống kê)

Trước khi sửa bất cứ thứ gì, phải **biết dữ liệu trông như thế nào**:
bao nhiêu dòng, bao nhiêu cột, mỗi cột kiểu gì, giá trị nằm trong khoảng
nào, các class có cân bằng không. Slide 40–44 làm đúng việc này trên
Diabetes dataset bằng `read_csv`, `dtypes`, `describe()` và
`groupby(...).size()`.

Kết quả của bước 2 là **danh sách vấn đề** cần xử lý ở bước 3. Ví dụ với
Diabetes: Insulin bằng 0 ở gần một nửa số dòng (không thể có thật), và
class 0 nhiều gấp ~1.87 lần class 1. → **Học chi tiết ở bài 16.**

> **EN:** Before changing anything, **know what the data looks like**:
> rows, columns, each column's type, value ranges, class balance. Slides
> 40–44 do exactly this on the Diabetes dataset with `read_csv`,
> `dtypes`, `describe()` and `groupby(...).size()`. The output of step 2
> is a **list of problems** for step 3 — e.g. Insulin is 0 in almost half
> the rows, and class 0 outnumbers class 1 about 1.87 to 1. → **Lesson
> 16.**

### 3.3. Step 3 — Data preprocessing (Tiền xử lý dữ liệu)

Sửa những vấn đề tìm thấy ở bước 2 và biến dữ liệu thành dạng model "ăn"
được. Theo các slide tiếp theo, bước này có 5 phần nhỏ:

| Phần | Nội dung | Slide |
|---|---|---|
| 3.1 | Xử lý giá trị thiếu / không hợp lệ (missing, invalid) | 45 |
| 3.2 | Loại bỏ outlier | 46 |
| 3.3 | Chuẩn hóa feature số (MinMaxScaler, StandardScaler); mã hóa feature phân loại (Ordinal, One-hot…) | 47–49 |
| 3.4 | Correlation và multicollinearity | 50–51 |
| 3.5 | Cân bằng dữ liệu (over-sampling, under-sampling) | 52–54 |

→ **Học ở bài 17 trở đi** (phần P02 và P03, dự kiến khoảng 4–5 bài trong
module 01).

> **EN:** Fix the problems found in step 2 and turn the data into a form
> the model can consume. Upcoming slides split it into: 3.1 missing /
> invalid values, 3.2 outliers, 3.3 scaling numeric features and encoding
> categorical ones, 3.4 correlation and multicollinearity, 3.5 balancing
> classes. → **Lessons 17 onward** (parts P02–P03, roughly 4–5 lessons in
> module 01).

### 3.4. Step 4 — Data visualization (Trực quan hóa dữ liệu)

Vẽ biểu đồ (histogram, boxplot, scatter, heatmap…) để **nhìn** thấy những
điều bảng số khó cho thấy: phân bố lệch, outlier, quan hệ giữa feature và
label. Slide 55–63 dùng `matplotlib` và `seaborn`.

→ **Học ở module 04 — Data Visualization** (phần P04).

> **EN:** Plot the data (histograms, boxplots, scatter plots, heatmaps…)
> to **see** what tables of numbers hide: skewed distributions, outliers,
> feature–label relationships. Slides 55–63 use `matplotlib` and
> `seaborn`. → **Module 04 — Data Visualization** (part P04).

### 3.5. Step 5 — Model building (Xây dựng và huấn luyện mô hình)

Chọn thuật toán, đưa dữ liệu train vào để model học (cơ chế đã gặp ở bài
05–06: model đoán → so với label → tính loss → tự điều chỉnh).

→ Các thuật toán học ở:
- **Module 02 — Supervised Learning**: Linear / Polynomial / Logistic
  Regression, SVM, KNN, Decision Tree, Random Forest (P05–P07).
- **Module 03 — Unsupervised Learning**: K-Means (P08).
- **Module 06 — Projects** *(đề xuất, chưa chốt)*: NLP, Time series,
  Recommendation system (P09, P10, P15).

> **EN:** Choose an algorithm and train it (the loop from lessons 05–06:
> predict → compare with label → compute loss → adjust). → Algorithms in
> **module 02** (Linear/Polynomial/Logistic Regression, SVM, KNN, Decision
> Tree, Random Forest), **module 03** (K-Means), and *(proposed)*
> **module 06** (NLP, time series, recommendation systems).

### 3.6. Step 6 — Model evaluation (Đánh giá mô hình)

Đo model tốt đến đâu trên dữ liệu **chưa từng thấy** (Validation / Test).

→ Phần công cụ đo **đã học ở bài 07–14**. Phần chẩn đoán và cải thiện
model học ở **Module 05 — Model Evaluation**: bias, variance,
underfitting, overfitting, regularization, giảm chiều dữ liệu, PCA
(P11–P14).

> **EN:** Measure how good the model is on **unseen** data (Validation /
> Test). The measuring tools were **lessons 07–14**; diagnosing and
> improving models (bias, variance, under/overfitting, regularization,
> dimensionality reduction, PCA) is **module 05** (P11–P14).

### 3.7. Step 7 — Model deployment (Triển khai mô hình)

Đưa model ra dùng thật: lưu model thành file, gắn vào web/app/API, nhận
dữ liệu mới và trả dự đoán.

*(Bổ sung — slide 39 chỉ nêu tên bước, khóa học không có slide riêng)*
Triển khai không phải là kết thúc: dữ liệu thực tế thay đổi theo thời
gian (gọi là **data drift**), nên cần **theo dõi** (monitoring) độ chính
xác và huấn luyện lại định kỳ. Ví dụ model chấm điểm tín dụng train trên
dữ liệu trước dịch COVID-19 có thể đoán sai nhiều sau dịch vì hành vi
vay–trả của khách hàng đã khác.

> **EN:** Put the model to real use: save it to a file, plug it into a
> web app / API, receive new data and return predictions.
> *(Supplementary — slide 39 only names this step)* Deployment isn't the
> end: real-world data changes over time (**data drift**), so the model
> must be **monitored** and periodically retrained — e.g. a credit-scoring
> model trained on pre-COVID data may degrade afterwards.

### 3.8. Bản đồ học tập: bước nào học ở đâu

| Bước | Slide | Phần | Nơi học |
|---|---|---|---|
| 1. Data collection | — | — | (đã có sẵn file; bài 02, 04) |
| 2. Statistics | 40–44 | P01 | **bài 16** (module 01) |
| 3. Data preprocessing (3.1–3.4) | 45–51 | P02 | bài 17 trở đi (module 01) |
| 3.5. Balance data | 52–54 | P03 | bài cuối phần tiền xử lý (module 01) |
| 4. Data visualization | 55–63 | P04 | module 04 |
| 5. Model building | 64–96, 132–139 | P05–P10, P15 | module 02, 03, 06 (đề xuất) |
| 6. Model evaluation | 22–38, 97–131 | — / P11–P14 | **bài 07–14 (đã học)**; module 05 |
| 7. Model deployment | — | — | không có slide riêng |

*Số thứ tự bài từ 17 trở đi là dự kiến, có thể đổi khi đọc slide thật.*

> **EN:** Learning map — step 2 → lesson 16; steps 3.1–3.4 → lessons 17+;
> step 3.5 → last preprocessing lesson; step 4 → module 04; step 5 →
> modules 02, 03, 06 (proposed); step 6 → lessons 07–14 (done) and module
> 05; step 7 → no dedicated slides. Lesson numbers from 17 on are
> tentative.

### 3.9. Pipeline không phải đường thẳng *(Nhận xét của Claude — không có trong slide)*

Slide vẽ 7 bước nối nhau một chiều, nhưng ngoài thực tế có hai điều cần
lưu ý:

**(a) Quay vòng liên tục.** Đánh giá (bước 6) thấy model kém → quay lại
bước 3 thêm feature, hoặc bước 1 thu thêm dữ liệu. Trực quan hóa (bước 4)
thường được làm **xen kẽ** với bước 2 và 3 chứ không chỉ sau bước 3: vẽ
histogram là cách nhanh nhất để phát hiện outlier *trước khi* xử lý.

**(b) Chia Train/Test ở đâu?** Slide 39 không có bước "chia dữ liệu",
nhưng đây là chỗ hay sai nhất. Quy tắc:

```
Step 1 → Step 2 → [ CHIA TRAIN / TEST ] → Step 3 (fit trên train) → Step 5 → Step 6 (trên test)
```

Mọi thao tác ở bước 3 mà **"học" từ dữ liệu** — tính median để điền giá
trị thiếu, tính mean/std để chuẩn hóa, sinh mẫu mới để cân bằng class —
phải tính **chỉ trên tập train**, rồi mới áp dụng sang tập test. Nếu tính
trên toàn bộ dữ liệu, thông tin của tập test đã "rò" vào quá trình train,
gọi là **data leakage** → điểm test đẹp hơn thực tế. Tập test phải giống
"đề thi chưa ai xem trước" (bài 07).

> **EN:** *(Claude's note — not in the slides)* (a) The pipeline loops:
> poor evaluation sends you back to step 3 or step 1, and visualization is
> usually interleaved with steps 2–3 rather than strictly after step 3.
> (b) Slide 39 has no "split" step, yet this is where most mistakes
> happen: split **after step 2 and before step 3**. Anything in step 3
> that *learns* from data (medians for imputation, mean/std for scaling,
> synthetic samples for balancing) must be fitted **on the training set
> only**, then applied to the test set. Otherwise test information leaks
> into training — **data leakage** — and test scores look better than
> reality.

## 4. Ví dụ tay

Đi qua cả 7 bước với Diabetes dataset, mỗi bước một con số cụ thể
*(phần số liệu sau bước 2 là ví dụ tự soạn, chạy bằng code ở mục 5)*.

**Step 1 — Thu thập.** File `diabetes.csv`: **768** bệnh nhân × **9**
cột (8 feature + `Outcome`).

**Step 2 — Thống kê.** Hai phát hiện quan trọng (chi tiết ở bài 16):

- `Outcome`: **500** người không bệnh (0), **268** người bệnh (1) → 65.1% /
  34.9%.
- Có giá trị 0 vô lý: Glucose 5 dòng, BloodPressure 35, SkinThickness 227,
  Insulin 374, BMI 11.

**Chia dữ liệu.** 80% train / 20% test, **stratified** theo `Outcome`
(bài 09):

| | Tổng | Outcome = 0 | Outcome = 1 |
|---|---|---|---|
| Test (20%) | 768 × 0.2 = 153.6 → **154** | 154 × 0.651 ≈ **100** | **54** |
| Train | 768 − 154 = **614** | 500 − 100 = **400** | 268 − 54 = **214** |

Tỉ lệ class 1 ở train: 214 / 614 ≈ 34.9%; ở test: 54 / 154 ≈ 35.1% — giữ
gần đúng tỉ lệ gốc 34.9%.

**Step 3 — Tiền xử lý.** Đổi các số 0 vô lý thành "thiếu", điền bằng
median **của tập train**, rồi chuẩn hóa (StandardScaler) — đều fit trên
614 dòng train.

**Step 5 — Huấn luyện.** Logistic Regression (sẽ học ở module 02).

**Step 6 — Đánh giá trên 154 dòng test.** Confusion matrix (sắp theo
scikit-learn `[[TN, FP], [FN, TP]]`):

| | Đoán 0 | Đoán 1 |
|---|---|---|
| **Thật 0** | TN = 82 | FP = 18 |
| **Thật 1** | FN = 27 | TP = 27 |

Tính tay (công thức bài 12):

- Accuracy = (82 + 27) / 154 = 109 / 154 ≈ **0.7078**
- Precision = 27 / (27 + 18) = 27 / 45 = **0.60**
- Recall = 27 / (27 + 27) = 27 / 54 = **0.50**
- F1 = 2 · 0.6 · 0.5 / (0.6 + 0.5) = 0.6 / 1.1 ≈ **0.5455**

So với model "lười" **luôn đoán 0**: Accuracy = 100 / 154 ≈ **0.6494**.
Model thật chỉ hơn khoảng **6 điểm phần trăm**, và Recall = 0.5 nghĩa là
**bỏ sót một nửa** số người bệnh. Đây đúng là bẫy Accuracy ở bài 12 — và
là lý do khóa học có **Step 3.5 Balance data**.

**Step 7 — Triển khai.** Lưu model thành file, nạp lại và dự đoán cho một
bệnh nhân mới (Glucose 150, BMI 33.5, 45 tuổi…) → xác suất mắc bệnh ≈
**0.582** → model kết luận "có nguy cơ" (vì > 0.5).

**Ví dụ thực tế** *(tự soạn)*: một phòng khám ở Hà Nội muốn sàng lọc tiểu
đường từ kết quả khám tổng quát. Bước 1 là xuất dữ liệu từ phần mềm quản
lý bệnh án; bước 2 phát hiện ô "Insulin" thường để trống vì ít người làm
xét nghiệm này; bước 6 phải ưu tiên Recall (bỏ sót người bệnh nguy hiểm
hơn gọi nhầm người khỏe đi xét nghiệm lại); bước 7 là gắn model vào phần
mềm để bác sĩ thấy cảnh báo, và theo dõi xem độ chính xác có giảm theo
thời gian không.

> **EN:** Walking the Diabetes dataset through all 7 steps *(numbers
> after step 2 are our own example, produced by the code in section 5)*:
> 768 rows × 9 columns; 500 negatives / 268 positives; impossible zeros in
> 5 columns. A stratified 80/20 split gives 614 train (400/214) and 154
> test (100/54). After median imputation and scaling fitted on train, a
> Logistic Regression yields TN = 82, FP = 18, FN = 27, TP = 27 on test:
> Accuracy ≈ 0.7078, Precision = 0.60, Recall = 0.50, F1 ≈ 0.5455. Always
> predicting 0 already scores ≈ 0.6494, so the model is only ~6 points
> better and **misses half the diabetic patients** — the accuracy trap from
> lesson 12 and the motivation for **Step 3.5 Balance data**. Deployed,
> the saved model gives a new patient a probability ≈ 0.582. *(Own
> real-world example)* A Hanoi clinic screening for diabetes: export
> records (1), notice Insulin is often blank (2), prioritise Recall (6),
> embed the model in the clinic software and monitor it (7).

## 5. Code

Toàn bộ pipeline trong một file. Cần file `diabetes.csv` (Pima Indians
Diabetes Database, có trên Kaggle) đặt cùng thư mục. Các bước 3–6 sẽ được
giải thích kỹ ở những bài sau — ở đây chỉ để thấy **khung tổng thể**
*(code tự soạn — không có trong slide)*.

```python
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, accuracy_score, precision_score,
                             recall_score, f1_score, roc_auc_score)

# Step 1 — Data collection
data = pd.read_csv("diabetes.csv")

# Step 2 — Statistics (bài 16)
print(data.shape)                                   # (768, 9)
print(data.groupby("Outcome").size().to_dict())     # {0: 500, 1: 268}
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
print((data[zero_cols] == 0).sum().to_dict())
# {'Glucose': 5, 'BloodPressure': 35, 'SkinThickness': 227, 'Insulin': 374, 'BMI': 11}

# Chia train/test TRƯỚC khi tiền xử lý (bài 07, 09)
X = data.drop(columns="Outcome")
y = data["Outcome"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)
print(len(X_train), len(X_test))                    # 614 154
print(y_train.value_counts().to_dict(), y_test.value_counts().to_dict())
# {0: 400, 1: 214} {0: 100, 1: 54}

# Step 3 — Preprocessing: số 0 vô lý -> NaN (sẽ điền bằng median của train)
X_train = X_train.copy(); X_test = X_test.copy()
X_train[zero_cols] = X_train[zero_cols].replace(0, np.nan)
X_test[zero_cols] = X_test[zero_cols].replace(0, np.nan)

# Step 5 — Model building. Pipeline gom bước 3 + 5: khi .fit() trên train,
# median và mean/std chỉ được tính từ train -> tránh data leakage
model = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)

# Step 6 — Model evaluation (bài 11–13)
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(confusion_matrix(y_test, y_pred))             # [[82 18] [27 27]]
print(f"Accuracy  = {accuracy_score(y_test, y_pred):.4f}")    # 0.7078
print(f"Precision = {precision_score(y_test, y_pred):.4f}")   # 0.6000
print(f"Recall    = {recall_score(y_test, y_pred):.4f}")      # 0.5000
print(f"F1        = {f1_score(y_test, y_pred):.4f}")          # 0.5455
print(f"ROC AUC   = {roc_auc_score(y_test, y_prob):.4f}")     # 0.8130
print(f"Baseline (luôn đoán 0) = {(y_test == 0).mean():.4f}") # 0.6494

# Step 7 — Model deployment: lưu model, nạp lại, dự đoán bệnh nhân mới
joblib.dump(model, "diabetes_model.joblib")
loaded = joblib.load("diabetes_model.joblib")
new_patient = pd.DataFrame([{
    "Pregnancies": 2, "Glucose": 150, "BloodPressure": 70, "SkinThickness": 30,
    "Insulin": 120, "BMI": 33.5, "DiabetesPedigreeFunction": 0.5, "Age": 45}])
print(f"P(diabetes) = {loaded.predict_proba(new_patient)[0, 1]:.3f}")  # 0.582
```

Ghi chú:

- `Pipeline` của scikit-learn đúng nghĩa đen là "đường ống": dữ liệu đi
  qua impute → scale → model theo thứ tự. Lợi ích chính là **không thể
  quên** fit trên train rồi mới transform test.
- ROC AUC = 0.813 khá ổn (bài 13), nghĩa là model **xếp hạng** người bệnh
  cao hơn người khỏe khá tốt — vấn đề Recall thấp một phần do ngưỡng 0.5
  và dữ liệu mất cân bằng.
- Kết quả có thể lệch chút ít giữa các phiên bản scikit-learn.

> **EN:** *(Own code — not in the slides)* The whole pipeline in one
> file; needs `diabetes.csv` (Pima Indians Diabetes Database, on Kaggle).
> Steps 3–6 are explained in later lessons — here we only want the overall
> skeleton. scikit-learn's `Pipeline` chains impute → scale → model, so
> preprocessing statistics are always fitted on the training set only (no
> leakage). ROC AUC ≈ 0.813 shows decent ranking; the low Recall is partly
> due to the 0.5 threshold and the class imbalance. Numbers may differ
> slightly across scikit-learn versions.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Kể tên 7 bước của ML pipeline theo đúng thứ tự trong slide 39.
> **Đáp án:** Data collection → Statistics → Data preprocessing → Data
> visualization → Model building → Model evaluation → Model deployment.

**Câu 2:** Mỗi tình huống sau thuộc bước nào? (a) Phát hiện cột Insulin
có 374 giá trị bằng 0. (b) Thay các số 0 đó bằng median. (c) Tính F1 trên
tập test. (d) Gắn model vào phần mềm của phòng khám.
> **Đáp án:** (a) Step 2 — Statistics; (b) Step 3 — Data preprocessing;
> (c) Step 6 — Model evaluation; (d) Step 7 — Model deployment.

**Câu 3:** Vì sao phải chia train/test **trước** khi tính median để điền
giá trị thiếu hoặc tính mean/std để chuẩn hóa?
> **Đáp án:** Vì median, mean, std là những thứ "học" từ dữ liệu. Nếu tính
> trên toàn bộ dataset thì thông tin của tập test đã lọt vào quá trình
> huấn luyện (data leakage), làm điểm trên test đẹp hơn so với khi gặp dữ
> liệu thật. Phải fit trên train, rồi chỉ transform test.

**Câu 4:** Một model trên test có TN = 82, FP = 18, FN = 27, TP = 27. Tính
Accuracy và Recall. So với model luôn đoán 0 thì sao?
> **Đáp án:** Accuracy = 109 / 154 ≈ 0.708; Recall = 27 / 54 = 0.5. Model
> luôn đoán 0 có Accuracy = 100 / 154 ≈ 0.649 nhưng Recall = 0. Model thật
> chỉ hơn ~6 điểm Accuracy và vẫn bỏ sót một nửa người bệnh.

**Câu 5:** Đã học xong các metric ở bài 11–14, vì sao vẫn còn cả module
05 "Model Evaluation" phía sau?
> **Đáp án:** Bài 11–14 dạy cách **đo** model. Module 05 dạy cách **chẩn
> đoán và cải thiện**: vì sao model kém (bias/variance, underfitting/
> overfitting) và cách sửa (regularization, chọn model, giảm chiều dữ
> liệu, PCA).

**Câu 6:** Triển khai xong model là dự án kết thúc, đúng hay sai?
> **Đáp án:** Sai. Dữ liệu thực tế thay đổi theo thời gian (data drift),
> nên phải theo dõi hiệu năng và huấn luyện lại khi cần; pipeline là một
> vòng lặp, không phải đường thẳng.

> **EN:**
>
> **Q1:** Name the 7 pipeline steps in slide 39's order.
> > **A:** Data collection → Statistics → Data preprocessing → Data
> > visualization → Model building → Model evaluation → Model deployment.
>
> **Q2:** Which step: (a) finding 374 zeros in Insulin; (b) replacing
> them with the median; (c) computing F1 on the test set; (d) plugging the
> model into clinic software?
> > **A:** (a) Statistics; (b) Data preprocessing; (c) Model evaluation;
> > (d) Model deployment.
>
> **Q3:** Why split before computing the median or mean/std?
> > **A:** Those statistics are learned from data; computing them on the
> > full dataset leaks test information into training (data leakage),
> > inflating test scores. Fit on train, transform test.
>
> **Q4:** TN = 82, FP = 18, FN = 27, TP = 27. Accuracy and Recall? Compare
> with always predicting 0.
> > **A:** Accuracy ≈ 0.708, Recall = 0.5. Always-0 scores ≈ 0.649
> > accuracy with Recall 0. The model is only ~6 points better and misses
> > half the patients.
>
> **Q5:** Why is there a whole "Model Evaluation" module after lessons
> 11–14?
> > **A:** Lessons 11–14 teach how to **measure**; module 05 teaches how to
> > **diagnose and improve** (bias/variance, under/overfitting,
> > regularization, model selection, dimensionality reduction, PCA).
>
> **Q6:** True or false: once deployed, the project is finished.
> > **A:** False — data drifts over time, so performance must be monitored
> > and the model retrained; the pipeline is a loop.
