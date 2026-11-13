---
title: "Đánh giá, so sánh và cải thiện mô hình"
order: 2
layout: practice
description: "Bốn bước: đọc confusion matrix, so sánh năm mô hình, xử lý số 0 thiếu, rồi làm như thật với Pipeline và cross-validation."
needs: [diabetes-first-model, confusion-matrix, classification-metrics, k-fold-cross-validation, missing-values-outliers]
tags: [diabetes, practice, confusion-matrix, precision, recall, pipeline, cross-validation, imputer, model-selection, data-leakage]
---

## Bước 7 — Đọc kết quả: mô hình sai ở đâu?

:::goal
Đọc **confusion matrix**, **precision**, **recall**, **F1** và hiểu vì sao accuracy một mình dễ đánh lừa.
:::

:::learn Khởi động lại từ Phần A
Phần B dùng lại đoạn chuẩn bị ở cuối Phần A. Nếu Console đã đóng, chạy lại đoạn này trước (có thêm vài import cho các bước sau):

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, classification_report, confusion_matrix)

data = pd.read_csv("dataset/diabetes.csv")
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)
model = LogisticRegression().fit(x_train, y_train)
y_predict = model.predict(x_test)
```
:::

:::learn Confusion matrix — bảng đếm bốn loại kết quả
Ở bài này **"dương tính" = có tiểu đường (nhãn 1)**. Trong sklearn, **hàng = thực tế, cột = dự đoán**.

|  | Đoán 0 | Đoán 1 |
|---|---|---|
| **Thực 0** | **TN** — đúng, khoẻ | **FP** — báo nhầm có bệnh |
| **Thực 1** | **FN** — bỏ sót bệnh | **TP** — đúng, có bệnh |

- **Accuracy** = (TN + TP) / tất cả — tỉ lệ đoán đúng chung.
- **Precision** = TP / (TP + FP) — trong số mô hình *báo có bệnh*, bao nhiêu phần thật sự bệnh.
- **Recall** = TP / (TP + FN) — trong số người *thật sự bệnh*, mô hình tìm ra bao nhiêu phần.
- **F1** = trung bình điều hoà của precision và recall.

Xem lại [[bài:confusion-matrix]] và [[bài:classification-metrics]] nếu cần.
:::

:::code Đọc kết quả của mô hình Phần A
```python
print(confusion_matrix(y_test, y_predict))        # bảng 2x2
print(classification_report(y_test, y_predict))   # báo cáo theo từng lớp
```
:::

:::see
```
[[79 20]
 [18 37]]
              precision    recall  f1-score   support
           0       0.81      0.80      0.81        99
           1       0.65      0.67      0.66        55
    accuracy                           0.75       154
   macro avg       0.73      0.74      0.73       154
weighted avg       0.76      0.75      0.75       154
```
Đọc: **TN = 79, FP = 20, FN = 18, TP = 37**. `support` là số mẫu thật của mỗi lớp (99 và 55). `macro avg` là trung bình đơn giản hai lớp; `weighted avg` có tính trọng số theo support.

![Confusion matrix của mô hình Phần A](/plots/diabetes-confusion.png)
:::

:::worked Tính tay từ bảng trên
- Accuracy = (79 + 37) / 154 = **0.7532**
- Precision = 37 / (37 + 20) = 37/57 = **0.6491**
- Recall = 37 / (37 + 18) = 37/55 = **0.6727**
- F1 = 2 × 0.6491 × 0.6727 / (0.6491 + 0.6727) = **0.6607**

Khớp với `precision_score`, `recall_score`, `f1_score` của sklearn.
:::

:::learn Vì sao accuracy dễ đánh lừa, và nên ưu tiên gì?
- **Baseline ngu:** đoán *tất cả là 0* cho đúng 99/154 = **64.3%**. Mô hình của ta 75.3% chỉ hơn khoảng 11 điểm — chưa ấn tượng như con số bề ngoài ([[bài:imbalanced-data]]).
- **Bối cảnh y tế:** bỏ sót người bệnh (FN) thường tệ hơn báo nhầm (FP) — vì báo nhầm còn có thể xét nghiệm lại. Nên ta quan tâm **recall**. Đây là lựa chọn theo bối cảnh, không phải luật chung.
- **Ngưỡng:** `predict` mặc định chọn lớp 1 khi xác suất ≥ 0.5. Hạ ngưỡng thì tìm được nhiều người bệnh hơn nhưng báo nhầm nhiều hơn (liên quan [[bài:roc-auc]]).
:::

:::code Đổi ngưỡng bằng predict_proba
```python
proba = model.predict_proba(x_test)[:, 1]            # xác suất là lớp 1
for t in [0.3, 0.5, 0.7]:
    pred = (proba >= t).astype(int)                  # nhãn theo ngưỡng t
    print(t, round(precision_score(y_test, pred), 3),
          round(recall_score(y_test, pred), 3),
          confusion_matrix(y_test, pred).ravel())    # TN FP FN TP
```
:::

:::see
| Ngưỡng | Precision | Recall | TN / FP / FN / TP |
|---|---|---|---|
| 0.3 | 0.545 | **0.764** | 64 / 35 / 13 / 42 |
| 0.5 | 0.649 | 0.673 | 79 / 20 / 18 / 37 |
| 0.7 | **0.818** | 0.491 | 93 / 6 / 28 / 27 |

Ngưỡng thấp: recall tăng, precision giảm. Không có ngưỡng "đúng" tuyệt đối; chọn theo chi phí của FN và FP.

![Precision và recall theo ngưỡng](/plots/diabetes-thresholds.png)
:::

:::pitfall Code gốc thiếu import
Code của bạn gọi `classification_report` và `confusion_matrix` nhưng không import hai hàm này, nên Python báo `NameError: name 'classification_report' is not defined`. Cách đọc lỗi: tên nào "not defined" thì thiếu `import` hoặc gõ sai tên. Thêm vào `from sklearn.metrics import ...`.
:::

:::ex ★ Gọi tên bốn ô
In `confusion_matrix(y_test, y_predict)` và viết bằng lời ý nghĩa của từng ô.
@answer
`[[79, 20], [18, 37]]`: 79 người khoẻ đoán đúng (TN); 20 người khoẻ bị báo bệnh (FP); 18 người bệnh bị bỏ sót (FN); 37 người bệnh đoán đúng (TP).
:::

:::ex ★★ Tự tính precision và recall từ ma trận
So với hàm của sklearn.
@answer
```python
tn, fp, fn, tp = confusion_matrix(y_test, y_predict).ravel()
print(tp / (tp + fp), precision_score(y_test, y_predict))   # 0.6491
print(tp / (tp + fn), recall_score(y_test, y_predict))      # 0.6727
```
:::

:::ex ★★★ Hạ ngưỡng xuống 0.3: có đáng không?
Mô tả recall và precision thay đổi ra sao.
@answer
Với ngưỡng 0.3: recall tăng từ 0.673 lên **0.764** (tìm thêm 5 người bệnh: FN giảm 18 → 13) nhưng FP tăng từ 20 lên **35**, precision giảm xuống 0.545. Có đáng hay không tuỳ chi phí: nếu xét nghiệm lại rẻ và bỏ sót rất nguy hiểm thì đáng; nếu mỗi báo nhầm gây tốn kém lớn thì không.
:::

:::en
**Why is accuracy misleading on imbalanced data?** — A model that always predicts the majority class gets high accuracy while finding no positives. Precision, recall and F1 look at the positive class directly, and the right choice depends on the cost of false negatives versus false positives.
:::

## Bước 8 — So sánh nhiều mô hình: tuyến tính hay phi tuyến?

:::goal
Chọn mô hình bằng **thực nghiệm**, không bằng linh cảm — và thấy vì sao cây/forest không cần scale.
:::

:::learn Câu hỏi phỏng vấn của bạn
*"Dựa vào bảng dữ liệu, nên chọn mô hình nào?"* Bạn đã ghi: tương quan giữa các feature và Outcome không lớn → dùng phi tuyến. Làm rõ cho trọn:

- Hệ số tương quan Pearson chỉ đo quan hệ **tuyến tính** từng cặp. Với Outcome: Glucose **0.467**, BMI 0.293, Age 0.238, Pregnancies 0.222, DPF 0.174, Insulin 0.131, SkinThickness 0.075, BloodPressure 0.065 ([[bài:correlation-multicollinearity]]). Hệ số nhỏ *gợi ý*, **không chứng minh** cần phi tuyến.
- Lý thuyết chỉ là **giả thuyết để thử**. Bạn đã thử và thấy Logistic (tuyến tính) không thua Random Forest.
- Câu trả lời phỏng vấn tốt: *"Tôi nhìn tương quan để đoán, rồi thử cả hai bằng cross-validation và chọn theo metric phù hợp."*
:::

:::learn Ai cần scale, ai không?
- **Cần scale:** Logistic, SVM, KNN (và linear nói chung) — vì dựa vào phép cộng/nhân/khoảng cách trên giá trị feature.
- **Không cần:** Decision Tree, Random Forest — vì chúng chỉ **so sánh** (`Glucose ≤ 127?`), mà thứ tự các giá trị không đổi khi scale ([[bài:decision-tree]], [[bài:feature-scaling]]).
:::

:::code Chạy năm mô hình trên cùng một split
Dùng `x_train`, `x_test` đã scale từ Phần A:

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

models = {
    "Logistic": LogisticRegression(),
    "KNN": KNeighborsClassifier(),
    "SVM": SVC(),
    "Tree": DecisionTreeClassifier(random_state=42),
    "Forest": RandomForestClassifier(random_state=42),
}
for name, m in models.items():
    pred = m.fit(x_train, y_train).predict(x_test)
    print(name, round(accuracy_score(y_test, pred), 3),
          round(recall_score(y_test, pred), 3), round(f1_score(y_test, pred), 3))
```
:::

:::see
| Mô hình | Accuracy | Recall | F1 |
|---|---|---|---|
| Logistic | **0.753** | 0.673 | 0.661 |
| KNN | 0.695 | 0.509 | 0.544 |
| SVM | 0.734 | 0.564 | 0.602 |
| Tree | 0.747 | **0.727** | **0.672** |
| Forest | 0.721 | 0.618 | 0.613 |

Logistic cao nhất về accuracy; Tree lại có recall/F1 cao nhất. Forest *không* thắng dù là mô hình phi tuyến mạnh. Đây là kết quả **trên đúng một lần chia**.
:::

:::pitfall Chọn mô hình bằng bộ test là rò rỉ nhẹ
Nếu thử nhiều mô hình rồi chọn con có điểm test cao nhất, bộ test đã bị dùng để *chọn* — nó không còn là phép chấm độc lập. Cách đúng là chọn bằng cross-validation (Bước 10), test chỉ dùng **một lần** cuối.
:::

:::ex ★★ Chạy có và không scale
Mô hình nào đổi nhiều, mô hình nào gần như không đổi? Giải thích.
@answer
```python
raw_train, raw_test, y_tr, y_te = train_test_split(x, y, test_size=0.2, random_state=42)
for name, m in models.items():
    pred = m.fit(raw_train.values, y_tr).predict(raw_test.values)
    print(name, round(accuracy_score(y_te, pred), 3))
```
Không scale: KNN tụt từ 0.695 xuống **0.662**, SVM nhảy từ 0.734 lên 0.766 (SVM không scale rất thất thường), Logistic gần như đổi ít nhưng có thể cảnh báo chưa hội tụ. **Tree (0.747) và Forest (0.721) không đổi một chút nào** — vì cây chỉ so sánh với ngưỡng nên scale không làm đổi cách chia.
:::

:::ex ★★★ Đổi `random_state` của split: 7, 42, 123
Thứ hạng các mô hình có đổi không?
@answer
```python
for rs in [7, 42, 123]:
    a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=rs)
    s = StandardScaler().fit(a)
    res = {n: round(accuracy_score(d, m.fit(s.transform(a), c).predict(s.transform(b))), 3)
           for n, m in models.items()}
    print(rs, res)
```
Accuracy theo seed 7 / 42 / 123: Logistic 0.786 / 0.753 / 0.799; Forest **0.805** / 0.721 / 0.760; SVM 0.799 / 0.734 / 0.766. Người dẫn đầu **đổi theo seed** (Forest ở seed 7, Logistic ở 42 và 123). Một lần chia chưa đủ tin → cần cross-validation.
:::

:::en
**How do you choose between a linear and a non-linear model?** — Correlation only measures linear association, so it can only suggest a direction. I would try both under cross-validation, with preprocessing inside each fold, and pick by the metric that matches the business cost.
:::

## Bước 9 — Cái bẫy của dữ liệu: số 0 thật ra là thiếu

:::goal
Biến các số `0` vô lý thành *thiếu*, điền bằng **median học từ train**, rồi xem điểm thay đổi ra sao.
:::

:::learn
- Năm cột (Glucose, BloodPressure, SkinThickness, Insulin, BMI) có `0` không thể xảy ra ở người thật → coi là **thiếu dữ liệu bị mã hoá bằng 0** ([[bài:missing-values-outliers]]). Pregnancies = 0 vẫn giữ.
- Cách làm: thay `0` bằng `NaN`, rồi **điền bằng median** của cột. Dùng median vì ít bị kéo bởi giá trị cực lớn (Insulin có giá trị tới 846).
- `SimpleImputer` cũng là bộ tiền xử lý → **cùng luật thợ may**: `fit` (tính median) **chỉ trên train**, `transform` cho cả train và test.

![Số giá trị 0 trong từng cột](/plots/diabetes-zeros.png)
:::

:::code Thay 0 bằng NaN và điền median
```python
from sklearn.impute import SimpleImputer

cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
data2 = data.copy()                                   # giữ nguyên bảng gốc
data2[cols] = data2[cols].replace(0, np.nan)          # 0 -> thiếu
x2 = data2.drop(labels="Outcome", axis=1)
print(x2.isna().sum().to_dict())                      # đếm ô thiếu

a_train, a_test, b_train, b_test = train_test_split(x2, y, test_size=0.2, random_state=42)
imputer = SimpleImputer(strategy="median").fit(a_train)       # median CHỈ từ train
a_train, a_test = imputer.transform(a_train), imputer.transform(a_test)
s = StandardScaler().fit(a_train)
m2 = LogisticRegression().fit(s.transform(a_train), b_train)
pred = m2.predict(s.transform(a_test))
print(accuracy_score(b_test, pred), recall_score(b_test, pred), f1_score(b_test, pred))
```
:::

:::see
- Số ô thiếu: Glucose 5, BloodPressure 35, SkinThickness 227, Insulin 374, BMI 11; các cột khác 0.
- Median học từ train: Glucose **118**, BloodPressure **72**, SkinThickness **28.5**, Insulin **120**, BMI **32.0**.

| Cùng split 42 | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| Logistic, giữ số 0 | 0.753 | 0.649 | 0.673 | 0.661 |
| Logistic, điền median | 0.753 | 0.667 | 0.618 | 0.642 |
| Forest, giữ số 0 | 0.721 | 0.607 | 0.618 | 0.613 |
| Forest, điền median | 0.740 | 0.623 | 0.691 | 0.655 |

Kết quả **không cải thiện đều**: Logistic gần như không đổi (recall còn giảm), Forest tăng. Trên một lần chia, đừng vội kết luận — xử lý dữ liệu đúng vẫn là việc nên làm dù điểm một lần chia không tăng.
:::

:::ex ★ Thay 0 bằng NaN và kiểm tra
Chỉ năm cột phù hợp; Pregnancies giữ nguyên. Kiểm bằng `isna().sum()`.
@answer
Làm như đoạn code ở trên. Kỳ vọng: Pregnancies, DPF và Age đều 0 ô thiếu; năm cột kia có số ô thiếu như bảng trên.
:::

:::ex ★★ So median và mean của Insulin trên train
Vì sao median phù hợp hơn?
@answer
```python
col = train_test_split(x2, y, test_size=0.2, random_state=42)[0]["Insulin"]
print(col.median(), col.mean())
```
Median = **120**, mean ≈ **154**: Insulin lệch phải, có giá trị rất lớn, nên mean cao hơn median khá nhiều; điền mean sẽ gán cho người thiếu một giá trị lớn hơn hầu hết người thật sự được đo. Median bền hơn với giá trị cực đoan.
:::

:::ex ★★★ Cố tình `fit` imputer trên toàn bộ x2
Leakage nằm ở đâu?
@answer
```python
imp_all = SimpleImputer(strategy="median").fit(x2)   # SAI: có cả hàng test
```
Median được tính từ cả hàng test, nên giá trị điền cho train mang thông tin của test. Trong bài nhỏ này chênh lệch ít, nhưng nguyên tắc không đổi: **mọi bước học từ dữ liệu (imputer, scaler, encoder) chỉ fit trên train hoặc trên phần train của từng fold.**
:::

## Bước 10 — Làm như thật: Pipeline và cross-validation

:::goal
Gói mọi bước vào một **Pipeline** và chọn mô hình bằng **K-fold cross-validation** thay vì một lần chia.
:::

:::learn
- **Pipeline** xếp các bước theo thứ tự: điền thiếu → scale → mô hình. Gọi `fit` một lần là cả chuỗi chạy; `predict` cũng vậy. Không thể quên bước, không thể fit nhầm trên test ([[bài:ml-pipeline]]).
- **K-fold CV** chia dữ liệu thành K phần; lần lượt dùng mỗi phần làm validation, K−1 phần còn lại để train; lấy trung bình điểm ([[bài:k-fold-cross-validation]]). Trong mỗi fold, Pipeline **tự fit lại** imputer và scaler chỉ trên phần train của fold → không leak.
- `StratifiedKFold(shuffle=True, random_state=42)` giữ tỉ lệ nhãn mỗi fold và cố định cách xáo.
- Đọc cả **mean** (mức điểm) lẫn **std** (độ dao động) của các fold.
- Quy trình chuẩn: **chọn mô hình bằng CV → rồi mới chấm MỘT lần trên bộ test.**
:::

:::code Pipeline và CV cho bốn mô hình
```python
from sklearn.pipeline import Pipeline
from sklearn.model_selection import StratifiedKFold, cross_val_score

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
candidates = {
    "Logistic": LogisticRegression(),
    "KNN": KNeighborsClassifier(),
    "SVM": SVC(),
    "Forest": RandomForestClassifier(random_state=42),
}
for name, m in candidates.items():
    pipe = Pipeline([("imputer", SimpleImputer(strategy="median")),
                     ("scaler", StandardScaler()),
                     ("model", m)])
    f1 = cross_val_score(pipe, x2, y, cv=skf, scoring="f1")
    rec = cross_val_score(pipe, x2, y, cv=skf, scoring="recall")
    print(name, "F1 %.3f ± %.3f" % (f1.mean(), f1.std()),
          "| recall %.3f ± %.3f" % (rec.mean(), rec.std()))
```
:::

:::see
| Mô hình | F1 (mean ± std) | Recall (mean ± std) |
|---|---|---|
| Logistic | **0.636 ± 0.021** | 0.571 ± 0.047 |
| KNN | 0.587 ± 0.043 | 0.567 ± 0.041 |
| SVM | 0.607 ± 0.026 | 0.545 ± 0.026 |
| Forest | 0.635 ± 0.041 | **0.597 ± 0.040** |

Logistic và Forest **gần như hoà** về F1 (0.636 vs 0.635). Logistic ổn định hơn (std nhỏ hơn một nửa) và đơn giản hơn; Forest hơn một chút về recall nhưng nằm trong mức dao động. Với bài sàng lọc bệnh ưu tiên recall, Forest hợp lý; nếu cần mô hình dễ giải thích và ổn định, chọn Logistic.

![Mean và std của CV](/plots/diabetes-cv.png)
:::

:::code Chốt mô hình và chấm test đúng một lần
```python
final = Pipeline([("imputer", SimpleImputer(strategy="median")),
                  ("scaler", StandardScaler()),
                  ("model", LogisticRegression())])
t_train, t_test, u_train, u_test = train_test_split(x2, y, test_size=0.2, random_state=42)
final.fit(t_train, u_train)                       # pipeline tự fit từng bước trên train
pred = final.predict(t_test)                      # và tự transform test
print(accuracy_score(u_test, pred), recall_score(u_test, pred))   # 0.7532, 0.6182
```

Kết quả **khớp từng chữ số** với cách làm tay ở Bước 9 (accuracy 0.753, recall 0.618): Pipeline chỉ là gói gọn, không đổi toán.
:::

:::ex ★ Dùng Pipeline cho Logistic và so với làm tay
Kết quả phải khớp.
@answer
Dùng đoạn "Chốt mô hình" ở trên: accuracy 0.7532 và recall 0.6182 — đúng bằng kết quả làm tay ở Bước 9.
:::

:::ex ★★ So Logistic và Forest bằng 5-fold CV
Nhận xét mean và std.
@answer
Dùng vòng lặp ở trên với hai mô hình này. F1 gần bằng nhau (0.636 và 0.635) nhưng std của Forest (0.041) gấp đôi Logistic (0.021): Forest dao động nhiều giữa các fold hơn.
:::

:::ex ★★★ Viết hàm `evaluate(model, x, y)`
Trả về dict mean F1 và recall; chạy cho bốn mô hình và chọn theo recall.
@answer
```python
def evaluate(model, x, y):
    pipe = Pipeline([("imputer", SimpleImputer(strategy="median")),
                     ("scaler", StandardScaler()),
                     ("model", model)])
    f1 = cross_val_score(pipe, x, y, cv=skf, scoring="f1")
    rec = cross_val_score(pipe, x, y, cv=skf, scoring="recall")
    return {"f1": round(float(f1.mean()), 3), "recall": round(float(rec.mean()), 3)}

for name, m in candidates.items():
    print(name, evaluate(m, x2, y))
```
Theo recall, Forest (0.597) cao nhất, nhưng chênh với Logistic (0.571) nằm trong sai số (std ≈ 0.04–0.05). Trả lời tốt nêu được: chọn Forest nếu bỏ sót bệnh rất đắt, kèm lưu ý chênh lệch nhỏ, rồi chấm test đúng một lần.
:::

:::en
**What does a Pipeline give you, and why use cross-validation instead of a single split?** — A Pipeline keeps preprocessing and the model as one object, so every step is fitted only on training data, including inside each fold. Cross-validation averages over several splits, so we see both the typical score and its variance instead of trusting one lucky or unlucky split.
:::

## Tổng kết Phần B

:::recap
1. **Đọc confusion matrix trước**: TN, FP, FN, TP rồi mới tính precision, recall, F1.
2. **Accuracy không đủ**: baseline đoán toàn 0 đã được 64.3%; chọn metric theo chi phí sai lầm (y tế: chú ý recall).
3. **Tuyến tính hay phi tuyến phải thử**: tương quan chỉ là gợi ý; cây/forest không cần scale, KNN/SVM/Logistic cần.
4. **Số 0 trong năm cột là thiếu**: thay NaN, điền median **fit trên train**.
5. **Pipeline + CV**: chọn mô hình bằng mean ± std của CV, rồi chấm test đúng một lần.
:::

:::check
- Tôi đọc được confusion matrix và tính tay precision, recall.
- Tôi giải thích được vì sao accuracy một mình dễ đánh lừa.
- Tôi trả lời được câu hỏi phỏng vấn "chọn tuyến tính hay phi tuyến".
- Tôi biết vì sao cây/forest không cần scale còn Logistic/KNN/SVM thì cần.
- Tôi biết các số 0 ở năm cột là dữ liệu thiếu và cách xử lý không rò rỉ.
- Tôi biết chọn mô hình bằng CV, không bằng bộ test.
- Tôi viết lại được cả đường ống mà không nhìn.
:::

:::code Bộ code hoàn chỉnh của Phần B
```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, recall_score, f1_score,
                             classification_report, confusion_matrix)

data = pd.read_csv("dataset/diabetes.csv")
cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
data[cols] = data[cols].replace(0, np.nan)          # số 0 vô lý -> thiếu
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]

def make_pipe(model):
    return Pipeline([("imputer", SimpleImputer(strategy="median")),
                     ("scaler", StandardScaler()),
                     ("model", model)])

candidates = {
    "Logistic": LogisticRegression(),
    "KNN": KNeighborsClassifier(),
    "SVM": SVC(),
    "Forest": RandomForestClassifier(random_state=42),
}
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for name, m in candidates.items():                  # chọn bằng CV
    f1 = cross_val_score(make_pipe(m), x, y, cv=skf, scoring="f1")
    print(name, "F1 %.3f ± %.3f" % (f1.mean(), f1.std()))

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
final = make_pipe(LogisticRegression()).fit(x_train, y_train)   # chốt, chấm test 1 lần
y_predict = final.predict(x_test)
print(accuracy_score(y_test, y_predict), recall_score(y_test, y_predict))
print(confusion_matrix(y_test, y_predict))
print(classification_report(y_test, y_predict))
```
:::

:::quiz
@tier A | Kiểm tra đã hiểu
Q: Từ ma trận `[[79, 20], [18, 37]]`, tính precision và recall của lớp 1.
A: **Precision = 37/57 ≈ 0.649; recall = 37/55 ≈ 0.673.** Precision chia cho số mẫu bị báo dương (37 + 20), recall chia cho số mẫu thật sự dương (37 + 18).
Q: Đoán toàn bộ là 0 trên bộ test (99 mẫu 0, 55 mẫu 1) đạt accuracy bao nhiêu? Recall của lớp 1 là bao nhiêu?
A: **Accuracy 99/154 ≈ 0.643; recall = 0.** Mô hình không tìm được người bệnh nào nhưng accuracy vẫn trông tạm ổn — vì vậy phải nhìn recall/precision.
Q: Bảng CV cho Logistic F1 0.636 ± 0.021 và Forest 0.635 ± 0.041. Chọn mô hình nào?
A: **Hai mô hình gần như hoà.** Logistic ổn định hơn và đơn giản hơn; Forest hơn một chút ở recall. Quyết định theo chi phí bỏ sót bệnh, rồi chấm test một lần.
Q: Hạ ngưỡng từ 0.5 xuống 0.3 thì TP, FP, FN thay đổi thế nào ở mô hình Phần A?
A: **TP tăng 37 → 42, FN giảm 18 → 13, FP tăng 20 → 35.** Recall lên 0.764 nhưng precision tụt xuống 0.545: đánh đổi giữa hai metric.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** How do you choose between a linear and a non-linear model?
A: **Dùng tương quan để gợi ý, rồi thử cả hai bằng cross-validation.** Pearson chỉ đo quan hệ tuyến tính nên hệ số thấp không chứng minh cần phi tuyến. Ở bài này Logistic ngang Forest.
EN: Use correlation as a hint only, then compare both model families under cross-validation with preprocessing inside the folds.
Q: **B2.** Why is accuracy misleading on imbalanced data?
A: **Vì dự đoán lớp đông cho accuracy cao mà không tìm được lớp hiếm.** Ví dụ baseline đoán toàn 0 đã đúng 64.3% nhưng recall bằng 0.
EN: Predicting the majority class gives high accuracy with zero recall on the minority class, so precision, recall and F1 are needed.
Q: **B3.** What is data leakage and how do you avoid it?
A: **Thông tin ngoài train lọt vào bước học.** Tránh bằng cách chia trước, fit mọi bộ tiền xử lý (scaler, imputer) chỉ trên train, và dùng Pipeline để chuỗi bước luôn đúng thứ tự.
EN: Leakage is when training uses information unavailable at prediction time. Split first, fit preprocessing on train only, and wrap steps in a Pipeline.
Q: **B4.** What does a Pipeline give you?
A: **Một đối tượng gói tiền xử lý và mô hình.** Mỗi lần fit/predict chạy đúng chuỗi, và trong CV mỗi fold tự fit lại imputer/scaler nên không rò rỉ.
EN: It chains preprocessing and the estimator into one object so every step is fitted only on the training portion, including inside each CV fold.
Q: **B5.** Why use cross-validation instead of a single split?
A: **Vì một lần chia có thể may hoặc rủi.** Ở bài này người dẫn đầu đổi giữa các seed 7, 42, 123. CV cho mean và std nên đo được cả mức điểm lẫn độ dao động.
EN: A single split can be lucky or unlucky; cross-validation averages several splits and exposes the variance.
@tier C | Tình huống
Q: Bài toán sàng lọc bệnh: bỏ sót người bệnh nguy hiểm hơn báo nhầm. Bạn chọn metric và ngưỡng thế nào?
A: **Ưu tiên recall, hạ ngưỡng dự đoán và chấp nhận thêm báo nhầm.** Trình bày đánh đổi bằng số: ngưỡng 0.3 cho recall 0.764 nhưng precision 0.545. Chốt ngưỡng cùng chuyên gia theo chi phí xét nghiệm lại.
WANT: Nêu recall, ngưỡng, đánh đổi precision, hỏi chi phí nghiệp vụ.
Q: Dữ liệu có cột Insulin chứa rất nhiều số 0. Bạn xử lý thế nào để không bị rò rỉ?
A: **Coi 0 là thiếu, thay NaN, điền median fit trên train bằng Pipeline.** Không điền trên toàn bộ dữ liệu; có thể thêm cờ "đã thiếu" làm feature và kiểm bằng CV xem có cải thiện thật không.
WANT: Nhận ra sentinel, median, fit trên train/fold, Pipeline.
Q: Mô hình train rất tốt nhưng test tệ. Bạn kiểm tra những gì?
A: **Overfitting hoặc lỗi quy trình.** Kiểm tra độ phức tạp mô hình, so train với CV, và rà soát leakage (scale/impute trước khi chia, nhãn lọt vào x).
WANT: Phân biệt overfit và leakage, đề xuất CV.
:::

:::next
Bạn đã đi hết một dự án phân loại nhỏ từ CSV đến mô hình chọn bằng CV. Bước tiếp theo là làm lại trên một bộ dữ liệu khác, tự gõ toàn bộ đường ống mà không nhìn đáp án.
:::
