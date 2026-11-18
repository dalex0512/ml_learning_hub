---
title: "Đánh giá, so sánh và cải thiện mô hình"
order: 2
layout: practice
description: "Bốn bước: đọc đúng kết quả, biết một con số đáng tin tới đâu, xử lý số 0 thiếu, rồi chốt mô hình và chấm bộ test đúng một lần."
needs: [diabetes-first-model, confusion-matrix, classification-metrics, k-fold-cross-validation, missing-values-outliers]
tags: [diabetes, practice, confusion-matrix, precision, recall, pipeline, cross-validation, imputer, model-selection, data-leakage]
---

## Chuẩn bị

Phần B tiếp tục từ Phần A. Nếu Console đã đóng, chạy lại đoạn này để có đủ biến. Hai bộ dữ liệu cùng tồn tại: `x_train`, `x_test` (chưa scale) và `x_train_s`, `x_test_s` (đã scale).

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

data = pd.read_csv("dataset/diabetes.csv")
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]

x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(x_train)
x_train_s = scaler.transform(x_train)
x_test_s = scaler.transform(x_test)

model = LogisticRegression().fit(x_train_s, y_train)
y_predict = model.predict(x_test_s)
```

## Bước 5 — Đọc kết quả

:::ask
75% là tốt hay tệ? Và mô hình sai theo kiểu nào?
:::

Accuracy chỉ cho một con số, che mất việc mô hình sai ở đâu. **Confusion matrix** (ma trận nhầm lẫn) đếm bốn loại kết quả:

```python
from sklearn.metrics import confusion_matrix

cm = confusion_matrix(y_test, y_predict)
print(cm)
```

:::out
```text
[[79 20]
 [18 37]]
```
:::

![Confusion matrix](/plots/practice/confusion-light.png)
![Confusion matrix](/plots/practice/confusion-dark.png)

Hàng là **sự thật**, cột là **dự đoán**. "Dương tính" ở đây nghĩa là có bệnh.

- **TN = 79**: người khoẻ, đoán khoẻ. Đúng.
- **FP = 20**: người khoẻ, nhưng bị báo bệnh. Báo động giả.
- **FN = 18**: người bệnh, nhưng bị báo khoẻ. **Bỏ sót.**
- **TP = 37**: người bệnh, đoán bệnh. Đúng.

Từ bốn số này có hai câu hỏi hữu ích hơn accuracy:

- **Precision**: khi máy báo "bệnh", tin được bao nhiêu? = TP / (TP + FP) = 37 / 57.
- **Recall**: trong số người bệnh thật, máy bắt được bao nhiêu? = TP / (TP + FN) = 37 / 55.

```python
tn, fp, fn, tp = cm.ravel()
print("precision:", round(tp / (tp + fp), 3))
print("recall   :", round(tp / (tp + fn), 3))
```

:::out
```text
precision: 0.649
recall   : 0.673
```
:::

Hãy nhớ mức sàn ở Bước 1. Mô hình "đoán toàn 0" có accuracy 64.3% trên bộ test, nhưng recall bằng **0**: nó không bắt được người bệnh nào. Đó là lý do accuracy một mình dễ đánh lừa, nhất là khi một lớp đông hơn hẳn.

Trong bối cảnh y tế, bỏ sót người bệnh (FN) thường tệ hơn báo nhầm (FP), vì báo nhầm còn có thể xét nghiệm lại. Nên ta quan tâm tới **recall**. Đó là lựa chọn theo bối cảnh, không phải luật chung.

Làm sao tăng recall? Ở Bước 4 ta biết `predict` chỉ là "tính xác suất p, rồi so với 0.5". Hạ ngưỡng thì mô hình dễ báo "bệnh" hơn:

```python
proba = model.predict_proba(x_test_s)[:, 1]
for t in [0.3, 0.5, 0.7]:
    pred = (proba >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
    print(f"ngưỡng {t}: FP={fp:2d} FN={fn:2d} precision={tp/(tp+fp):.3f} recall={tp/(tp+fn):.3f}")
```

:::out
```text
ngưỡng 0.3: FP=35 FN=13 precision=0.545 recall=0.764
ngưỡng 0.5: FP=20 FN=18 precision=0.649 recall=0.673
ngưỡng 0.7: FP= 6 FN=28 precision=0.818 recall=0.491
```
:::

![Precision và recall theo ngưỡng](/plots/practice/thresholds-light.png)
![Precision và recall theo ngưỡng](/plots/practice/thresholds-dark.png)

Hạ ngưỡng xuống 0.3: recall tăng từ 0.673 lên 0.764 (FN từ 18 còn 13), nhưng đổi lại FP tăng từ 20 lên 35. **Không có ngưỡng đúng tuyệt đối**; ngưỡng phụ thuộc vào việc bỏ sót đắt gấp mấy lần báo nhầm.

:::ex Chọn ngưỡng theo chi phí
Giả sử bỏ sót một người bệnh (FN) đắt gấp 3 lần báo nhầm một người khoẻ (FP). Với các ngưỡng 0.1, 0.2, …, 0.7, tính chi phí `3 * FN + FP` và chọn ngưỡng rẻ nhất.
@answer
```python
for t in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
    pred = (proba >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
    print(t, "chi phí =", 3 * fn + fp)
```
Chi phí thấp nhất ở khoảng ngưỡng 0.2 (68), kế đó 0.1 (70) và 0.3 (74), còn ngưỡng mặc định 0.5 là 74. Đổi tỉ lệ chi phí (gấp 5 chẳng hạn) thì ngưỡng tốt nhất dịch thấp hơn nữa. Bài học: ngưỡng là quyết định nghiệp vụ, không phải hằng số của thuật toán.
:::

:::more classification_report và F1
- **F1** là trung bình điều hoà của precision và recall: chỉ cao khi cả hai cùng cao.
- `classification_report(y_test, y_predict)` in precision, recall, F1 cho **từng lớp** (0 rồi 1), cùng `support` là số mẫu thật của lớp đó (99 và 55). `macro avg` là trung bình đơn giản hai lớp; `weighted avg` tính theo support.
:::

:::recap
- Confusion matrix cho biết mô hình sai theo kiểu nào: FP (báo nhầm) hay FN (bỏ sót).
- Precision là "báo bệnh thì tin được bao nhiêu", recall là "bắt được bao nhiêu người bệnh thật".
- Đoán toàn 0 được accuracy 64.3% nhưng recall 0; ngưỡng 0.5 chỉ là mặc định, đổi được theo chi phí.
:::

## Bước 6 — Một con số có đáng tin không?

:::ask
Con số 75% này, nếu chia dữ liệu khác đi thì còn 75% không? Và mô hình nào thật sự tốt nhất?
:::

Ta thử năm mô hình, mỗi mô hình trên ba cách chia khác nhau (đã scale đúng cách cho mỗi lần chia):

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
for seed in [7, 42, 123]:
    a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=seed)
    s = StandardScaler().fit(a)
    acc = {n: round(m.fit(s.transform(a), c).score(s.transform(b), d), 3) for n, m in models.items()}
    print(seed, acc)
```

:::out
```text
7 {'Logistic': 0.786, 'KNN': 0.727, 'SVM': 0.799, 'Tree': 0.753, 'Forest': 0.805}
42 {'Logistic': 0.753, 'KNN': 0.695, 'SVM': 0.734, 'Tree': 0.747, 'Forest': 0.721}
123 {'Logistic': 0.799, 'KNN': 0.766, 'SVM': 0.766, 'Tree': 0.799, 'Forest': 0.76}
```
:::

Người dẫn đầu **đổi theo cách chia**: Forest ở seed 7 (0.805), Logistic ở seed 42 (0.753), Logistic và Tree hoà ở seed 123 (0.799). Chênh lệch giữa các mô hình chỉ vài điểm, nhỏ hơn mức dao động do may rủi của lần chia (Bước 2 đã thấy dao động 11 điểm). Vậy một lần chia không đủ để chọn mô hình.

Cách sửa là **K-fold cross-validation**. Chia dữ liệu train thành 5 phần (fold); lần lượt lấy mỗi phần làm đề thi, 4 phần còn lại để học. Sau 5 lần, **mọi bệnh nhân đều được chấm đúng một lần** và ta có 5 điểm thay vì 1: trung bình cho biết mức, độ lệch chuẩn cho biết độ dao động.

Có một bẫy: scaler phải được `fit` lại **trong từng fold**, chỉ trên phần học của fold đó. Làm tay rất dễ quên, nên ta gói scaler và mô hình vào một **Pipeline**: Pipeline tự `fit` đúng chỗ, đúng thứ tự.

```python
from sklearn.pipeline import Pipeline
from sklearn.model_selection import StratifiedKFold, cross_validate

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for name, m in models.items():
    pipe = Pipeline([("scaler", StandardScaler()), ("model", m)])
    r = cross_validate(pipe, x_train, y_train, cv=skf, scoring=["accuracy", "f1", "recall"])
    print(f"{name:9s} acc {r['test_accuracy'].mean():.3f} ± {r['test_accuracy'].std():.3f}"
          f"   f1 {r['test_f1'].mean():.3f}   recall {r['test_recall'].mean():.3f}")
```

:::out
```text
Logistic  acc 0.765 ± 0.015   f1 0.617   recall 0.554
KNN       acc 0.748 ± 0.023   f1 0.610   recall 0.568
SVM       acc 0.756 ± 0.030   f1 0.611   recall 0.554
Tree      acc 0.704 ± 0.030   f1 0.570   recall 0.568
Forest    acc 0.770 ± 0.025   f1 0.635   recall 0.583
```
:::

![Accuracy từng fold của năm mô hình](/plots/practice/folds-light.png)
![Accuracy từng fold của năm mô hình](/plots/practice/folds-dark.png)

Mỗi chấm là một fold, vạch đỏ là trung bình. Có ba điều nên đọc ra:

- **Tree thấp nhất** (khoảng 0.70), đúng như dự đoán từ Bước 2: cây không giới hạn học vẹt.
- **Bốn mô hình còn lại sát nhau** (accuracy 0.748 đến 0.770), độ lệch chuẩn 0.015 đến 0.03. Khoảng cách giữa chúng nhỏ so với dao động, nên đừng khẳng định "mô hình A hơn mô hình B" chỉ vì chênh vài phần nghìn.
- Forest nhỉnh hơn ở F1 và recall. Ta sẽ dùng bằng chứng này ở Bước 8.

:::ex Đổi cách xáo của K-fold
Chạy lại vòng lặp CV cho Logistic và Forest với `StratifiedKFold(random_state=0)` thay vì 42, chỉ in accuracy trung bình. Thứ hạng hai mô hình có giữ nguyên không?
@answer
```python
for seed in [0, 42]:
    skf2 = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)
    for name in ["Logistic", "Forest"]:
        pipe = Pipeline([("scaler", StandardScaler()), ("model", models[name])])
        r = cross_validate(pipe, x_train, y_train, cv=skf2, scoring="accuracy")
        print(seed, name, round(r["test_score"].mean(), 3))
```
Ở seed 0 Logistic nhỉnh hơn (0.759 so với 0.754), ở seed 42 Forest nhỉnh hơn (0.770 so với 0.765). Thứ hạng đảo chiều: hai mô hình hoà về accuracy, và con số chênh lệch nằm trong vùng nhiễu.
:::

:::recap
- Một lần chia cho một con số dao động; người dẫn đầu đổi theo seed.
- K-fold cho nhiều điểm: dùng trung bình ± độ lệch chuẩn để so sánh.
- Pipeline gói scaler và mô hình để mỗi fold tự `fit` đúng, không rò rỉ.
:::

## Bước 7 — Dữ liệu bẩn: số 0 là thiếu

:::ask
Các số 0 ở Insulin, SkinThickness… có đang đánh lừa mô hình không? Dọn chúng đi thì điểm có tăng không?
:::

Ở Bước 1 ta thấy năm cột có số 0 không thể có thật. Cách xử lý đúng nguyên tắc có hai bước: **thay 0 bằng NaN** (nghĩa là "chưa biết"), rồi **điền** bằng một giá trị hợp lý. Ta điền bằng **trung vị** (median) của cột.

```python
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
x_clean = x.copy()
x_clean[zero_cols] = x_clean[zero_cols].replace(0, np.nan)
x_clean_train = x_clean.loc[x_train.index]      # đúng những hàng của x_train
x_clean_test = x_clean.loc[x_test.index]

print(x_clean_train.isna().sum()[zero_cols].to_dict())
col = x_clean_train["Insulin"]
print("Insulin: median", col.median(), "mean", round(col.mean(), 1))
```

:::out
```text
{'Glucose': 5, 'BloodPressure': 24, 'SkinThickness': 176, 'Insulin': 290, 'BMI': 7}
Insulin: median 120.0 mean 154.3
```
:::

Vì sao median? Insulin có những giá trị rất lớn (tới 846) kéo trung bình (154) lên cao hơn trung vị (120). Điền bằng trung bình sẽ gán cho người chưa đo một giá trị lớn hơn phần đông người thật sự được đo.

Việc điền cũng là một bước "học từ dữ liệu", nên **cùng luật thợ may**: median chỉ được tính từ phần train (từng fold). Cho `SimpleImputer` vào đầu Pipeline là đủ. Để so sánh đáng tin hơn, ta lặp 5-fold 5 lần (25 điểm):

```python
from sklearn.impute import SimpleImputer
from sklearn.model_selection import RepeatedStratifiedKFold

rskf = RepeatedStratifiedKFold(n_splits=5, n_repeats=5, random_state=42)

def cv_report(model, X, y, impute=False):
    steps = [("imputer", SimpleImputer(strategy="median"))] if impute else []
    steps += [("scaler", StandardScaler()), ("model", model)]
    r = cross_validate(Pipeline(steps), X, y, cv=rskf, scoring=["accuracy", "f1", "recall"])
    return {k: round(float(r[f"test_{k}"].mean()), 3) for k in ["accuracy", "f1", "recall"]}

for name in ["Logistic", "Forest"]:
    print(name, "giữ số 0   ", cv_report(models[name], x_train, y_train))
    print(name, "điền median", cv_report(models[name], x_clean_train, y_train, impute=True))
```

:::out
```text
Logistic giữ số 0    {'accuracy': 0.763, 'f1': 0.612, 'recall': 0.545}
Logistic điền median {'accuracy': 0.762, 'f1': 0.614, 'recall': 0.55}
Forest giữ số 0    {'accuracy': 0.764, 'f1': 0.629, 'recall': 0.582}
Forest điền median {'accuracy': 0.759, 'f1': 0.63, 'recall': 0.595}
```
:::

**Điểm gần như không đổi.** Chênh lệch nhiều nhất chỉ khoảng 0.013 và hướng thì lúc lên lúc xuống: dọn số 0 **không** làm điểm tăng rõ rệt ở bộ dữ liệu này. Đừng coi đây là thất bại; nó dạy ba điều:

- Dọn dữ liệu đúng nguyên tắc không đảm bảo điểm tăng. Chỉ đo bằng cross-validation mới biết.
- Một lời giải thích có thể (ta chưa kiểm chứng): chính việc "ô này bằng 0" cũng mang thông tin, ví dụ người ta thường không đo Insulin cho nhóm nào đó, nên mô hình vẫn khai thác được.
- Khi hai lựa chọn hoà về điểm, chọn cái **có ý nghĩa đúng** và dễ giải thích hơn. Một ô Glucose bằng 0 thì không thể là sự thật, nên ta giữ bước điền median trong đường ống cuối.

:::ex Thêm cờ "ô này từng thiếu"
`SimpleImputer(strategy="median", add_indicator=True)` thêm cột đánh dấu ô nào đã thiếu. Điều đó có giúp F1 không?
@answer
```python
def cv_f1(model, X, y, imputer):
    pipe = Pipeline([("imputer", imputer), ("scaler", StandardScaler()), ("model", model)])
    return round(float(cross_validate(pipe, X, y, cv=rskf, scoring="f1")["test_score"].mean()), 3)

for name in ["Logistic", "Forest"]:
    print(name,
          "median:", cv_f1(models[name], x_clean_train, y_train, SimpleImputer(strategy="median")),
          "median + cờ:", cv_f1(models[name], x_clean_train, y_train, SimpleImputer(strategy="median", add_indicator=True)))
```
Cả hai mô hình chỉ tăng khoảng 0.002 (Logistic 0.614 lên 0.616, Forest 0.630 lên 0.632): nằm trong vùng nhiễu, không có lợi ích rõ ràng. Lại một lần nữa, đo bằng CV trước khi tin.
:::

:::recap
- Năm cột có số 0 vô lý: thay bằng NaN rồi điền median, và median phải tính chỉ từ phần train (Pipeline lo việc này).
- Ở bộ dữ liệu này, dọn số 0 không làm điểm CV đổi đáng kể.
- Khi tie, chọn cách đúng ý nghĩa dữ liệu; luôn đo bằng CV thay vì tin vào linh cảm.
:::

## Bước 8 — Chốt mô hình, chấm bộ test một lần

:::ask
Cuối cùng chọn mô hình nào, vì sao? Và câu phỏng vấn "tuyến tính hay phi tuyến" trả lời thế nào?
:::

Ghi chú ban đầu của bạn: "bảng tương quan thấp, nên dùng mô hình phi tuyến". Hãy xem bảng đó thật sự nói gì.

```python
print(data.corr()["Outcome"].drop("Outcome").sort_values(ascending=False).round(3))
```

:::out
```text
Glucose                     0.467
BMI                         0.293
Age                         0.238
Pregnancies                 0.222
DiabetesPedigreeFunction    0.174
Insulin                     0.131
SkinThickness               0.075
BloodPressure               0.065
Name: Outcome, dtype: float64
```
:::

Hệ số tương quan Pearson chỉ đo quan hệ **tuyến tính** giữa hai cột. Hệ số thấp cho ta **gợi ý** (không cột nào một mình quyết định, Glucose mạnh nhất với 0.467), nhưng không chứng minh cần phi tuyến. Gợi ý chỉ là giả thuyết để thử. Bạn đã thử trên một lần chia và thấy Logistic hơn Forest (0.753 so với 0.721), nhưng một lần chia là chưa đủ. Với cross-validation (Bước 6 và 7), Forest nhỉnh hơn nhẹ ở F1 và recall, tức **ngược chiều** với một lần chia. Đó chính là lý do ta không chọn mô hình bằng một lần chia.

Một thí nghiệm nữa, về quy tắc "cây và forest không cần scale":

```python
rf_raw = RandomForestClassifier(random_state=42).fit(x_train, y_train).predict(x_test)
rf_scaled = RandomForestClassifier(random_state=42).fit(x_train_s, y_train).predict(x_test_s)
print("Forest: dự đoán giống hệt nhau?", np.array_equal(rf_raw, rf_scaled))

lr_raw = LogisticRegression(max_iter=1000).fit(x_train, y_train).predict(x_test)
lr_scaled = LogisticRegression().fit(x_train_s, y_train).predict(x_test_s)
print("Logistic: dự đoán giống hệt nhau?", np.array_equal(lr_raw, lr_scaled))
```

:::out
```text
Forest: dự đoán giống hệt nhau? True
Logistic: dự đoán giống hệt nhau? False
```
:::

Forest cho dự đoán **y hệt** dù có scale hay không; Logistic thì khác. Lý do: cây chỉ **so sánh** giá trị với một ngưỡng ("Glucose ≤ 127?"), và scale không làm đổi thứ tự các giá trị. Mô hình tuyến tính thì cộng và nhân giá trị thật, nên thang đo ảnh hưởng trực tiếp.

**Chốt:** theo CV, Forest nhỉnh hơn Logistic ở F1 và recall trong cả ba lần so sánh ở Bước 6 và 7 (một lần 5-fold và hai lần lặp 5×5). Trong bài toán sàng lọc nơi bỏ sót là tệ nhất, ta chọn **Random Forest**, kèm điền median cho số 0. Lưu ý chênh lệch nhỏ, và nếu cần mô hình đọc được như Bước 4 thì Logistic vẫn là lựa chọn hợp lý.

Giờ mới là lúc dùng bộ test, **đúng một lần**:

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

final = Pipeline([("imputer", SimpleImputer(strategy="median")),
                  ("model", RandomForestClassifier(random_state=42))])
final.fit(x_clean_train, y_train)
pred = final.predict(x_clean_test)

print("accuracy :", round(accuracy_score(y_test, pred), 3), "(đoán toàn 0:", round((y_test == 0).mean(), 3), ")")
print("precision:", round(precision_score(y_test, pred), 3))
print("recall   :", round(recall_score(y_test, pred), 3))
print("f1       :", round(f1_score(y_test, pred), 3))
print(confusion_matrix(y_test, pred))
```

:::out
```text
accuracy : 0.74 (đoán toàn 0: 0.643 )
precision: 0.623
recall   : 0.691
f1       : 0.655
[[76 23]
 [17 38]]
```
:::

Đọc kết quả trung thực: mô hình vượt mức sàn (khoảng 74% so với 64%), nhưng recall chỉ khoảng 0.69, tức vẫn bỏ sót gần ba trong mười người bệnh. Đây là bài học và cũng là giới hạn của một mô hình trên 768 người, chưa đủ cho sàng lọc thật. **Không quay lại đổi mô hình rồi chấm test lần nữa**: mỗi lần như vậy bộ test lại trở thành một phần của việc chọn, và điểm mất giá trị.

:::ex Ngưỡng cho mô hình cuối
Dùng `final.predict_proba(x_clean_test)[:, 1]`, tìm ngưỡng lớn nhất để recall đạt ít nhất 0.75. Phải chấp nhận bao nhiêu báo nhầm (FP)?
@answer
```python
proba = final.predict_proba(x_clean_test)[:, 1]
for t in [0.5, 0.4, 0.35, 0.3, 0.25, 0.2]:
    p = (proba > t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, p).ravel()
    print(t, "recall", round(tp / (tp + fn), 3), "FP", fp)
```
Ở ngưỡng 0.5 recall là 0.691 với 23 báo nhầm. Hạ xuống **0.4** thì recall lên 0.8 (đạt yêu cầu) với 27 báo nhầm: thêm 4 báo nhầm để bắt thêm 6 người bệnh. Hạ tiếp xuống 0.2 thì recall 0.945 nhưng báo nhầm lên 52. Quyết định ngưỡng cuối cùng cần chi phí thật của việc bỏ sót và báo nhầm.
:::

:::recap
- Tương quan thấp chỉ là gợi ý; chọn tuyến tính hay phi tuyến bằng cross-validation, không bằng một lần chia.
- Cây và forest không cần scale vì chỉ so sánh với ngưỡng; mô hình tuyến tính thì cần.
- Chọn bằng CV trên train, chấm test đúng một lần, và đọc kết quả trung thực kể cả giới hạn.
:::

## Tổng kết Phần B

Mỗi câu hỏi có một công cụ trả lời:

| Câu hỏi | Công cụ |
|---|---|
| Mô hình sai theo kiểu nào? | Confusion matrix, precision, recall |
| Chọn ngưỡng ở đâu? | `predict_proba` cùng chi phí FN và FP |
| Một con số đáng tin tới đâu? | K-fold CV: trung bình ± độ lệch chuẩn |
| Làm sao không rò rỉ trong tiền xử lý? | Pipeline |
| Dữ liệu có ô thiếu giấu dưới dạng 0? | Thay NaN, điền median fit trên train |
| Cuối cùng chấm ở đâu? | Bộ test, đúng một lần |

Đường ống hoàn chỉnh, để bạn gõ lại không nhìn (từ đầu đến cuối, gồm cả Phần A):

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import recall_score, confusion_matrix

data = pd.read_csv("dataset/diabetes.csv")
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
data[zero_cols] = data[zero_cols].replace(0, np.nan)      # số 0 vô lý -> thiếu
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]

x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)

def make_pipe(model):
    return Pipeline([("imputer", SimpleImputer(strategy="median")),
                     ("scaler", StandardScaler()),
                     ("model", model)])

candidates = {"Logistic": LogisticRegression(),
              "Forest": RandomForestClassifier(random_state=42)}
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for name, m in candidates.items():                        # chọn bằng CV trên train
    r = cross_validate(make_pipe(m), x_train, y_train, cv=skf, scoring=["f1", "recall"])
    print(name, "f1", round(r["test_f1"].mean(), 3), "recall", round(r["test_recall"].mean(), 3))

final = make_pipe(candidates["Forest"]).fit(x_train, y_train)
pred = final.predict(x_test)                              # chấm test một lần
print("recall:", round(recall_score(y_test, pred), 3))
print(confusion_matrix(y_test, pred))
```

:::out
```text
Logistic f1 0.602 recall 0.54
Forest f1 0.635 recall 0.616
recall: 0.691
[[76 23]
 [17 38]]
```
:::

:::check
- Tôi đọc được confusion matrix và tính tay được precision, recall.
- Tôi giải thích được vì sao accuracy một mình dễ đánh lừa, bằng ví dụ "đoán toàn 0".
- Tôi nói được vì sao một lần chia là chưa đủ và cross-validation giải quyết thế nào.
- Tôi giải thích được Pipeline giúp tránh rò rỉ ở đâu.
- Tôi trả lời được câu "tuyến tính hay phi tuyến" mà không dựa vào mỗi bảng tương quan.
- Tôi biết số 0 trong năm cột là dữ liệu thiếu, và cách xử lý không rò rỉ.
- Tôi gõ lại được cả đường ống mà không nhìn.
:::

:::quiz
@tier A | Kiểm tra đã hiểu
Q: Từ ma trận `[[79, 20], [18, 37]]`, tính precision và recall của lớp 1.
A: **Precision = 37/57 ≈ 0.649; recall = 37/55 ≈ 0.673.** Precision chia cho số mẫu bị báo dương (37 + 20); recall chia cho số mẫu thật sự dương (37 + 18).
Q: Đoán toàn bộ là 0 trên bộ test (99 mẫu 0, 55 mẫu 1) đạt accuracy bao nhiêu và recall bao nhiêu?
A: **Accuracy 99/154 ≈ 0.643; recall = 0.** Mô hình không tìm được người bệnh nào nhưng accuracy vẫn trông tạm ổn; vì vậy phải nhìn recall và precision.
Q: Hạ ngưỡng từ 0.5 xuống 0.3 ở mô hình Phần A thì FP và FN đổi thế nào?
A: **FP tăng 20 → 35, FN giảm 18 → 13.** Recall lên 0.764 nhưng precision tụt xuống 0.545: đánh đổi giữa hai metric.
Q: Cross-validation cho Logistic accuracy 0.765 ± 0.015 và Forest 0.770 ± 0.025. Mô hình nào tốt hơn?
A: **Chưa kết luận được.** Chênh lệch 0.005 nhỏ hơn độ lệch chuẩn của cả hai. Cần thêm tiêu chí khác (F1, recall, độ đơn giản) hoặc thêm dữ liệu.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** How do you choose between a linear and a non-linear model?
A: **Dùng tương quan để gợi ý, rồi thử cả hai bằng cross-validation.** Pearson chỉ đo quan hệ tuyến tính nên hệ số thấp không chứng minh cần phi tuyến. Ở bài này một lần chia nghiêng về Logistic, còn CV nghiêng nhẹ về Forest.
EN: Use correlation only as a hint, then compare both model families under cross-validation with preprocessing inside the folds, and pick by the metric that matches the cost of errors.
Q: **B2.** Why is accuracy misleading on imbalanced data?
A: **Vì dự đoán lớp đông cho accuracy cao mà không tìm được lớp hiếm.** Ví dụ đoán toàn 0 đúng 64.3% nhưng recall bằng 0.
EN: Predicting the majority class gives high accuracy with zero recall on the minority class, so precision, recall and F1 are needed.
Q: **B3.** What does a Pipeline give you?
A: **Một đối tượng gói tiền xử lý và mô hình.** Mỗi lần fit hay predict chạy đúng chuỗi, và trong CV mỗi fold tự fit lại imputer và scaler trên phần train, nên không rò rỉ.
EN: It chains preprocessing and the estimator so every step is fitted only on the training portion, including inside each cross-validation fold.
Q: **B4.** Why use cross-validation instead of a single split?
A: **Vì một lần chia có thể may hoặc rủi.** Ở bài này người dẫn đầu đổi giữa các seed 7, 42, 123. CV cho trung bình và độ lệch chuẩn nên đo được cả mức điểm lẫn độ dao động.
EN: A single split can be lucky or unlucky; cross-validation averages several splits and exposes the variance.
Q: **B5.** Do tree-based models need feature scaling?
A: **Không.** Cây chỉ so sánh giá trị với ngưỡng nên scale không đổi thứ tự. Ở Bước 8 Forest cho dự đoán y hệt có và không scale, còn Logistic thì khác.
EN: No. Trees split on thresholds, and monotonic rescaling preserves the ordering of values, so predictions do not change.
@tier C | Tình huống
Q: Bài toán sàng lọc bệnh: bỏ sót nguy hiểm hơn báo nhầm. Bạn chọn metric và ngưỡng thế nào?
A: **Ưu tiên recall, hạ ngưỡng và chấp nhận thêm báo nhầm.** Trình bày đánh đổi bằng số: ngưỡng 0.3 cho recall 0.764 nhưng precision 0.545. Chốt ngưỡng cùng chuyên gia theo chi phí xét nghiệm lại.
WANT: Nêu recall, ngưỡng, đánh đổi precision, và hỏi chi phí nghiệp vụ.
Q: Dữ liệu có cột Insulin chứa rất nhiều số 0. Bạn xử lý thế nào để không rò rỉ?
A: **Coi 0 là thiếu, thay NaN, điền median fit trên train trong Pipeline.** Đo bằng CV xem có cải thiện thật không (ở bài này thì không), và chọn cách đúng ý nghĩa dữ liệu khi hai cách hoà.
WANT: Nhận ra giá trị thiếu bị mã hoá, median, fit trên train, Pipeline, kiểm chứng bằng CV.
Q: Mô hình đạt điểm cao trên train nhưng thấp trên test. Bạn kiểm tra những gì?
A: **Overfitting hoặc lỗi quy trình.** Kiểm tra độ phức tạp mô hình (cây không giới hạn học vẹt), so train với CV, rà soát rò rỉ (scale hay điền thiếu trước khi chia, nhãn lọt vào x).
WANT: Phân biệt overfit với leakage, đề xuất CV.
:::

Hướng tiếp theo: lặp lại cả đường ống trên một bộ dữ liệu khác, tự gõ từ trang trống, và chỉ mở lại bài này khi bí.
