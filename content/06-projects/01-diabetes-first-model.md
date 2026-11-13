---
title: "Từ file CSV đến mô hình đầu tiên"
order: 1
layout: practice
description: "Sáu bước ngắn: đọc CSV, tách x/y, chia train/test, chuẩn hoá, huấn luyện Logistic Regression và dự đoán trong PyCharm."
needs: [labeled-data, train-test-split, feature-scaling, classification-metrics]
tags: [diabetes, practice, pandas, scikit-learn, train-test-split, standardscaler, data-leakage, random-state]
---

## Bước 1 — Chuẩn bị môi trường

:::goal
Chạy được Python trong PyCharm và tìm thấy file `dataset/diabetes.csv`.
:::

:::learn
- **Đường dẫn tương đối** được tính từ *working directory* (thư mục Python đang đứng). Giống hỏi đường: phải biết mình đang đứng ở đâu thì "ngõ bên cạnh" mới có nghĩa.
- Bài này dùng `dataset/diabetes.csv`, nên working directory phải là **thư mục gốc dự án** (`D:\ML_VNAI`). Code gốc của bạn dùng `diabetes.csv` — cách đó chỉ chạy khi working directory đã nằm trong thư mục `dataset`. Chọn một cách và giữ nhất quán.
- **Chạy từng đoạn trong PyCharm:** bôi đen code → chuột phải → *Execute Selection in Python Console* (phím tắt Windows `Alt+Shift+E`).
- **Xem bảng:** mỗi khi có biến mới (`data`, `x`, `y`, `x_train`…), mở panel biến bên phải và chọn *View as DataFrame / Series / Array*. Nhìn tận mắt là cách học nhanh nhất.
- Console chạy theo thứ tự bạn bôi đen. Nếu sửa một bước phía trên, hãy chạy lại các bước phía dưới (hoặc khởi động lại Console).
:::

:::code Cài thư viện và kiểm tra thư mục
Chạy một lần trong Terminal của PyCharm:

```bash
python -m pip install pandas scikit-learn matplotlib
```

Rồi chạy trong Python Console:

```python
import os                                              # kiểm tra thư mục đang đứng
import pandas as pd                                    # đọc và xử lý bảng
import numpy as np                                     # mảng số
from sklearn.model_selection import train_test_split   # chia dữ liệu
from sklearn.preprocessing import StandardScaler       # chuẩn hoá
from sklearn.linear_model import LogisticRegression    # mô hình đầu tiên
from sklearn.metrics import accuracy_score             # chấm điểm

print(os.getcwd())                                     # phải là thư mục gốc dự án
```
:::

:::see
Đường dẫn thư mục gốc dự án và **không có lỗi import**. Bài đã kiểm với Python 3.14, pandas 3.0, scikit-learn 1.9; phiên bản khác có thể lệch vài chữ số cuối.
:::

:::pitfall Console và nút Run có thể đứng ở hai thư mục khác nhau
Gặp `FileNotFoundError`? Đừng đổi mô hình. In `os.getcwd()` **ở đúng nơi bạn đang chạy** rồi sửa đường dẫn hoặc đặt lại Working directory (Run → Edit Configurations, hoặc Settings → Build, Execution, Deployment → Console → Python Console).
:::

:::ex ★ In thư mục hiện tại và kiểm tra file tồn tại
Dùng `os.path.exists("dataset/diabetes.csv")`. Kết quả phải là `True`.
@answer
```python
print(os.path.exists("dataset/diabetes.csv"))
```
Nếu ra `False`: working directory đang sai, không phải file hỏng.
:::

## Bước 2 — Đọc và hiểu bảng dữ liệu

:::goal
Biết bảng có gì: **768 hàng, 8 feature + cột Outcome**, nhãn lệch 500/268, và có số `0` đáng ngờ.
:::

:::learn
- Đây là bài toán **phân loại nhị phân** ([[bài:classification-vs-regression|Classification vs Regression]]): đoán `Outcome` = 0 (không) hoặc 1 (có tiểu đường).
- Bộ dữ liệu y tế công khai, thường gọi *Pima Indians Diabetes*, dùng để học. **Không phải công cụ chẩn đoán.**
- 8 feature đều là số: Pregnancies (số lần mang thai), Glucose (đường huyết), BloodPressure (huyết áp), SkinThickness (độ dày nếp da), Insulin, BMI, DiabetesPedigreeFunction (chỉ số tiền sử gia đình), Age.
- Quy tắc của người làm thật: **nhìn dữ liệu trước, chọn mô hình sau** ([[bài:descriptive-statistics]]).
:::

:::code Đọc bảng
```python
data = pd.read_csv("dataset/diabetes.csv")   # đọc file vào DataFrame
print(data.shape)                            # (số hàng, số cột)
print(data.head())                           # 5 hàng đầu
data.info()                                  # kiểu dữ liệu, ô thiếu
print(data.describe())                       # thống kê từng cột
print(data["Outcome"].value_counts())        # đếm nhãn
```
:::

:::see
- `(768, 9)`, không có ô NaN; hàng đầu tiên là `6, 148, 72, 35, 0, 33.6, 0.627, 50, 1`.
- Outcome = 0 có **500** mẫu (65.1%), Outcome = 1 có **268** mẫu (34.9%).

![Số mẫu Outcome 0 và 1](/plots/diabetes-outcome.png)
:::

:::pitfall Không có NaN không có nghĩa là dữ liệu đầy đủ
Các cột Glucose (**5** số 0), BloodPressure (**35**), SkinThickness (**227**), Insulin (**374**), BMI (**11**) có giá trị `0` vô lý — thực chất là *thiếu dữ liệu bị mã hoá thành 0*. Ở Phần A ta **chưa xử lý** (để đúng baseline của bạn); Bước 9 ở Phần B sẽ xử lý. Pregnancies = 0 thì hợp lệ (chưa mang thai).
:::

:::ex ★ Đếm nhãn và tính phần trăm
Dùng `value_counts(normalize=True)`.
@answer
```python
print(data["Outcome"].value_counts(normalize=True) * 100)
```
Ra khoảng 65.10% và 34.90%. Vì lớp 0 đông hơn, một mô hình "đoán toàn bộ là 0" đã đúng ~65% — nhớ con số này cho Bước 7.
:::

:::ex ★★ Đếm số 0 từng cột
Cột nào đáng ngờ? Vì sao Pregnancies thì không?
@answer
```python
print((data == 0).sum())
```
Năm cột Glucose, BloodPressure, SkinThickness, Insulin, BMI không thể bằng 0 ở người sống → đáng ngờ. Pregnancies = 0 là có thật. Cột `Outcome` có 500 số 0 là *nhãn*, không phải thiếu.
:::

:::ex ★★★ Vẽ histogram Glucose tách theo Outcome
Hai nhóm khác nhau thế nào? Có tách hẳn được không?
@answer
```python
import matplotlib.pyplot as plt
for label in [0, 1]:
    values = data.loc[data["Outcome"] == label, "Glucose"]
    plt.hist(values, bins=np.arange(0, 221, 10), alpha=0.5, label=str(label))
plt.xlabel("Glucose"); plt.ylabel("Count"); plt.legend(); plt.show()
```
Nhóm 1 lệch sang Glucose cao hơn nhưng hai nhóm **chồng lấn nhiều** → một feature không đủ để phân loại. (Cột đứng ở Glucose = 0 chính là các số 0 thiếu.)

![Histogram Glucose theo nhãn](/plots/diabetes-glucose.png)
:::

## Bước 3 — Tách x (đề bài) và y (đáp án)

:::goal
Tạo `x` (8 feature) và `y` (nhãn), **không để nhãn lọt vào x**.
:::

:::learn
- Như đi thi: `x` là thông tin được phép xem, `y` là đáp án. Toán thường viết X hoa, y thường; code của bạn dùng `x`, `y` thường — giữ nguyên ([[bài:labeled-data]]).
- `data.drop(labels="Outcome", axis=1)`: bỏ **cột** `Outcome`, trả bảng mới (không sửa `data`).
- `axis=1` = theo cột, `axis=0` = theo hàng. Dùng `axis=0` thì pandas đi tìm *hàng* tên "Outcome" → không có → `KeyError`.
- `data["Outcome"]` lấy một cột, cho ra `Series` (một vector).
- Để `Outcome` lọt vào `x` thì mô hình nhìn thẳng đáp án: đó là **data leakage (rò rỉ dữ liệu)**.
:::

:::code Tách x và y
```python
x = data.drop(labels="Outcome", axis=1)   # bỏ cột đáp án
y = data["Outcome"]                       # chỉ lấy cột đáp án
print(x.shape, y.shape)                   # kiểm tra kích thước
```
:::

:::see
`(768, 8) (768,)`. Mở `x` bằng *View as DataFrame*: 8 cột, **không có Outcome**. `data` vẫn còn nguyên 9 cột.
:::

:::ex ★★ Cố tình dùng axis=0
Đọc lỗi và giải thích bằng lời của bạn.
@answer
```python
data.drop(labels="Outcome", axis=0)
```
Lỗi: `KeyError: "['Outcome'] not found in axis"`. Nghĩa là: không có *hàng* nào có nhãn index "Outcome" (index là 0, 1, 2…).
:::

:::ex ★★★ Tạo `x_no_age` bỏ cả Outcome và Age
Khi nào ta bỏ một feature?
@answer
```python
x_no_age = data.drop(labels=["Outcome", "Age"], axis=1)
print(x_no_age.shape)   # (768, 7)
```
Chỉ bỏ feature khi có lý do (rò rỉ nhãn, không có sẵn lúc dự đoán thật) hoặc khi thử bằng validation thấy tốt hơn. Tương quan thấp một mình **chưa đủ** để bỏ.
:::

## Bước 4 — Chia train / test

:::goal
Giữ riêng 20% dữ liệu để chấm điểm, và **cố định cách chia** để lần nào chạy cũng ra cùng bộ test.
:::

:::learn
- Thi thử bằng đề đã học thuộc thì chưa biết giỏi hay không. Ta cất **bộ test** đi, chỉ dùng chấm điểm cuối ([[bài:train-test-split]]).
- `test_size=0.2` = 20% làm test. Chỉ dùng **một** trong `test_size` / `train_size`; dùng số thực (0.33 = 33%).
- sklearn **xáo trộn** dữ liệu trước khi chia → chỉ số (index) của `x_train` lộn xộn là bình thường, `x` và `y` vẫn ghép đúng hàng.
- **`random_state=42`** cố định cách xáo. Số nào cũng được, nhưng đã chọn thì **giữ nguyên**. Vì sao? Hôm qua mô hình A đạt 80%, hôm nay bạn đổi cách tiền xử lý ra 78%. Nếu bộ test khác nhau mỗi lần chạy thì không biết do *cách làm* hay do *đề thi khác*.
- `random_state` của lúc chia và `random_state` của mô hình (như Random Forest) là **hai thứ độc lập**.
:::

:::code Chia 80/20
```python
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)   # chia x và y cùng lúc
print(x_train.shape, x_test.shape)          # kích thước hai bộ
print(x_train.index[:5].tolist())           # index gốc sau khi xáo
```
:::

:::see
- `(614, 8) (154, 8)` (20% × 768 = 153.6 → sklearn làm tròn lên 154).
- Index đầu của train: `[60, 618, 346, 294, 231]`. Chạy lại bao nhiêu lần cũng ra y hệt.
- Nhãn 0/1 trong train: **401 / 213**; trong test: **99 / 55**.
:::

:::learn Muốn có thêm bộ validation (60/20/20)?
Chia **hai lần**: lần một lấy 20% làm test; lần hai lấy từ phần train 80% còn lại một phần `test_size=0.25` làm validation, vì **0.25 × 80% = 20%** của tổng.

![Hai cách chia dữ liệu](/plots/diabetes-splits.png)

Thực tế người ta hay **bỏ lần chia thứ hai** và dùng K-fold cross validation ([[bài:k-fold-cross-validation]]) — Bước 10 sẽ làm.
:::

:::ex ★★ Quan sát tác dụng của random_state
In `index[:5]` của train ba lần với `random_state=None`, rồi ba lần với `42`.
@answer
```python
for seed in [None, None, None, 42, 42, 42]:
    a, b = train_test_split(x, test_size=0.2, random_state=seed)
    print(seed, a.index[:5].tolist())
```
`None` cho ba dãy khác nhau; `42` lặp lại đúng `[60, 618, 346, 294, 231]`.
:::

:::ex ★★★ Chia 60/20/20 và thử `stratify=y`
Kiểm bằng `len()`. Với `stratify=y`, tỉ lệ nhãn ở train/test thay đổi thế nào?
@answer
```python
a, x_test2, b, y_test2 = train_test_split(x, y, test_size=0.2, random_state=42)
x_tr, x_val, y_tr, y_val = train_test_split(a, b, test_size=0.25, random_state=42)
print(len(x_tr), len(x_val), len(x_test2))        # 460 154 154

_, _, ytr_s, yte_s = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)
print(ytr_s.value_counts().to_dict(), yte_s.value_counts().to_dict())
```
Có stratify: train **400/214**, test **100/54** — tỉ lệ nhãn ở hai bộ gần bằng tỉ lệ toàn bộ (~35% nhãn 1). Không stratify: test có 55/154 = 35.7% nhãn 1. Chênh nhỏ ở dữ liệu 65/35, nhưng với dữ liệu rất lệch thì stratify rất quan trọng ([[bài:stratified-k-fold]]).
:::

:::pitfall Đưa cả train_size và test_size
Chỉ cần một. Nếu đưa cả hai và tổng nhỏ hơn 1, sklearn vẫn chạy nhưng **bỏ phần dữ liệu còn lại** (ví dụ `train_size=0.6, test_size=0.2` → 460 train, 154 test, 154 hàng không dùng).
:::

## Bước 5 — Chuẩn hoá dữ liệu: bài học của anh thợ may

:::goal
Đưa các feature về cùng thang đo, và nhớ quy tắc vàng: **chỉ `fit` trên train**.
:::

:::learn
- Các cột khác nhau xa về thang: Insulin lên tới hàng trăm, DiabetesPedigreeFunction chỉ khoảng 0–2. Mô hình dựa vào khoảng cách hoặc phạt trọng số sẽ bị cột số lớn "lấn át". Chuẩn hoá để **xuất phát công bằng** ([[bài:feature-scaling]]).
- **StandardScaler**: mỗi cột trừ trung bình rồi chia độ lệch chuẩn: `z = (x − mean) / std` → trung bình 0, độ lệch chuẩn 1.
- Mỗi bộ tiền xử lý có 3 phương thức:
  - `fit()` — **đo** (tính mean, std). Chưa đổi dữ liệu.
  - `transform()` — **cắt may** theo số đo đã có.
  - `fit_transform()` — làm cả hai.
- **Anh thợ may:** có mảnh vải, anh *đo* trước (fit) rồi mới *cắt* (transform). Lần sau cầm mảnh vải khác tới, anh dùng lại số đo cũ và chỉ cắt. Với ta: **chỉ `fit` trên bộ train**; bộ validation và bộ test **tuyệt đối chỉ `transform`**.
- Vì sao? Nếu `fit` cả test thì mean/std đã "nhìn thấy" test — đó là **data leakage**, dù không dùng nhãn ([[bài:ml-pipeline]]).
:::

:::code Chuẩn hoá đúng cách
```python
scaler = StandardScaler()                    # chưa học gì cả
x_train = scaler.fit_transform(x_train)      # đo + cắt trên TRAIN
x_test = scaler.transform(x_test)            # chỉ cắt TEST bằng số đo của train
print(np.round(x_train.mean(axis=0), 3))     # mean từng cột
print(np.round(x_train.std(axis=0), 3))      # std từng cột
print(np.round(x_test.mean(axis=0), 3))      # mean của test
```
:::

:::see
- Train: 8 số mean ≈ **0** và 8 số std = **1**.
- Test: mean **không** bằng 0, ví dụ `[0.154, 0.006, -0.084, 0.044, -0.07, 0.006, 0.04, 0.145]`. Điều này **đúng**: test được cắt theo số đo của train, ta không "sửa" nó.

![Insulin và DPF trước và sau khi scale](/plots/diabetes-scaling.png)
:::

:::worked Một cột nhỏ làm tay (số tự soạn)
Cột train `[1, 2, 3, 4, 5]`: mean = 3, phương sai = (4+1+0+1+4)/5 = 2, std = √2 ≈ 1.414.
Sau scale: `[-1.414, -0.707, 0, 0.707, 1.414]` — mean 0, std 1.
Nếu lén đưa thêm test = 9 vào lúc `fit`, mean thành 24/6 = **4** thay vì 3: số đo đã bị test thay đổi.
:::

:::learn Hai ghi chú nhỏ
- **MinMaxScaler** nén về [0, 1] bằng min/max nên rất nhạy outlier; **StandardScaler** dùng mean/std nên ít nhạy hơn *tương đối*, nhưng **cả hai đều bị outlier ảnh hưởng**. Muốn bền hơn thì xem `RobustScaler`.
- Sau `fit_transform`, `x_train`/`x_test` biến thành **mảng NumPy** (mất tên cột, mất index). `y_train`/`y_test` vẫn là Series. Python phân biệt `x_test` và `X_test` — gõ hoa nhầm sẽ báo `NameError`.
:::

:::ex ★★ Thử MinMaxScaler
Trên split thô mới, xem min/max của train và test.
@answer
```python
from sklearn.preprocessing import MinMaxScaler
a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=42)
mm = MinMaxScaler().fit(a)
print(mm.transform(a).min(0), mm.transform(a).max(0))   # 0 và 1
print(mm.transform(b).min(0), mm.transform(b).max(0))   # test có thể vượt 1
```
Train đúng 0–1. Test có cột SkinThickness lên tới **1.571** (> 1): test có giá trị lớn hơn mọi giá trị trong train. Bình thường, không phải lỗi.
:::

:::ex ★★★ Viết cách sai (fit trên toàn bộ x) để nhận diện leakage
So accuracy với cách đúng và nhận xét.
@answer
```python
a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=42)
wrong = StandardScaler().fit(x)                   # SAI: đã nhìn cả hàng test
leaky = LogisticRegression().fit(wrong.transform(a), c)
print(accuracy_score(d, leaky.predict(wrong.transform(b))))   # 0.7532
```
Accuracy ra **0.7532**, trùng cách đúng ở split này — nhưng **không có nghĩa là đúng**. Leakage là vấn đề về nguyên tắc: bước học tham số từ dữ liệu (scaler, imputer, encoder…) chỉ được `fit` trên train. Khi dữ liệu nhỏ hoặc có outlier, chênh lệch có thể lớn.
:::

:::en
**Why do we fit the scaler only on the training set?** — Because the scaler learns parameters (mean, std). Fitting on all data lets information from the test set leak into preprocessing, so the test score becomes over-optimistic. We fit on train, then only `transform` validation and test data.
:::

## Bước 6 — Huấn luyện mô hình và dự đoán

:::goal
Huấn luyện Logistic Regression, dự đoán trên bộ test và đọc ra **accuracy**.
:::

:::learn
- `scaler.fit()` học *số đo*. `model.fit(x_train, y_train)` học *quan hệ feature → nhãn*. **Cùng tên phương thức, khác công việc.**
- `model.predict(x_test)` trả về mảng nhãn 0/1 — **mô hình chưa từng thấy** `y_test`.
- Metric phân loại luôn nhận **thứ tự: `y_thật` trước, `y_dự_đoán` sau**: `accuracy_score(y_test, y_predict)`.
- Vì bộ test chưa dùng để chọn gì nên đây là phép chấm trung thực, nhưng mới là **một lần chia** — Phần B sẽ cho thấy một lần là chưa đủ tin ([[bài:logistic-regression]]).
:::

:::code Mô hình đầu tiên
```python
model = LogisticRegression()                 # mô hình tuyến tính cho phân loại
model.fit(x_train, y_train)                  # học trên train đã scale
y_predict = model.predict(x_test)            # dự đoán test đã scale

for i, j in list(zip(y_predict, y_test))[:10]:        # chỉ in 10 cặp đầu
    print("Predicted: {}. Actual value: {}".format(i, j))
print("Accuracy:", accuracy_score(y_test, y_predict))
```
:::

:::see
`Accuracy: 0.7532467532467533` — đúng **116/154** mẫu test. Phần B sẽ đọc kỹ 38 mẫu sai.
:::

:::ex ★★ Xem xác suất thay vì nhãn
In 5 xác suất đầu của lớp 1 và nói liên hệ với ngưỡng 0.5.
@answer
```python
print(model.predict_proba(x_test)[:5, 1].round(3))
```
`predict` chọn nhãn 1 khi xác suất ≥ 0.5. Đổi ngưỡng sẽ đổi dự đoán — Bước 7 sẽ khai thác điều này.
:::

:::ex ★★★ Tự tính accuracy bằng tay
Rồi so với `accuracy_score`.
@answer
```python
print((y_predict == y_test).mean())      # 0.7532...
```
Accuracy = số đoán đúng / tổng. So sánh `==` cho ra True/False từng mẫu, `.mean()` coi True = 1 nên chính là tỉ lệ đúng.
:::

## Tổng kết Phần A

:::recap
1. **Đọc dữ liệu trước**: 768 hàng, nhãn 500/268, năm cột có số 0 đáng ngờ.
2. **x = feature, y = nhãn**; `axis=1` bỏ cột; không để nhãn lọt vào x.
3. **Chia train/test** rồi **cố định `random_state`** để so sánh công bằng giữa các lần thử.
4. **Scaler: `fit` chỉ trên train**, test chỉ `transform` (thợ may đo một lần).
5. Model `fit` trên train, `predict` trên test; metric nhận `(y_thật, y_dự_đoán)`.
:::

:::check
- Tôi giải thích được vì sao `axis=0` báo lỗi còn `axis=1` thì không.
- Tôi giải thích được vì sao phải cố định `random_state`.
- Tôi nói được 20% → 60/20/20 cần `test_size=0.25` ở lần chia thứ hai.
- Tôi giải thích được "đo" và "cắt may" tương ứng `fit` và `transform`.
- Tôi biết vì sao không được `fit` scaler trên bộ test.
- Tôi chạy lại được cả bài mà không nhìn đáp án.
:::

:::code Bộ code hoàn chỉnh để gõ lại không nhìn
```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

data = pd.read_csv("dataset/diabetes.csv")
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]

x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)

model = LogisticRegression()
model.fit(x_train, y_train)
y_predict = model.predict(x_test)
print("Accuracy:", accuracy_score(y_test, y_predict))   # 0.7532...
```
:::

:::quiz
@tier A | Kiểm tra đã hiểu
Q: Với 768 mẫu và `test_size=0.2`, train và test có bao nhiêu mẫu? Muốn 60/20/20 thì lần chia thứ hai dùng `test_size` bằng bao nhiêu?
A: **614 train, 154 test; lần hai dùng 0.25.** 20% × 768 = 153.6 làm tròn thành 154. Phần train 80% chia tiếp 25% thành validation: 0.25 × 80% = 20% tổng, còn lại 60%.
Q: Scaler `fit` trên train cho mean của test là 0.154 ở cột đầu. Có phải lỗi không?
A: **Không, đó là điều đúng.** Test được biến đổi bằng mean/std của train nên không có mean 0. Nếu ép về 0 bằng cách fit lại trên test là data leakage.
Q: Chạy lại cùng đoạn chia dữ liệu hai lần, lần một không có `random_state`. Chuyện gì xảy ra?
A: **Hai bộ test khác nhau**, nên accuracy hai lần không so sánh công bằng được. Thêm `random_state=42` thì cả hai lần ra đúng cùng một bộ.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Why do we fit the scaler only on the training set?
A: **Để thông tin từ test không rò vào bước tiền xử lý.** Scaler học mean/std; fit trên dữ liệu có test sẽ làm điểm test lạc quan hơn thực tế. Ví dụ thêm một giá trị test vào lúc fit làm mean của cột đổi từ 3 thành 4.
EN: Fitting preprocessing on the full dataset leaks test information into training and makes the evaluation optimistic. Fit on train only, then transform validation and test data.
Q: **B2.** What does `random_state` do in `train_test_split`?
A: **Cố định cách xáo trộn để split lặp lại được.** Cùng dữ liệu và cùng seed cho cùng train/test, nhờ đó so sánh hai cách tiền xử lý là công bằng. Nó không liên quan tới seed của mô hình.
EN: It seeds the shuffling so the split is reproducible, which makes experiments comparable across runs.
Q: **B3.** What is data leakage? Give an example.
A: **Thông tin ngoài tập train (hoặc đáp án) lọt vào quá trình học.** Ví dụ: để cột `Outcome` trong `x`, hoặc `fit` scaler trên cả bộ dữ liệu trước khi chia.
EN: Data leakage is when information unavailable at prediction time influences training, for example including the target in the features or fitting a scaler on test data.
@tier C | Tình huống
Q: Sếp hỏi: "Hôm qua mô hình đạt 80%, hôm nay 78% sau khi đổi cách xử lý. Cách mới tệ hơn à?" Bạn kiểm tra gì đầu tiên?
A: **Kiểm tra bộ test có cố định không.** Nếu không cố định `random_state`, hai con số đo trên hai bộ test khác nhau và chưa thể kết luận. Sau khi cố định, một lần chia vẫn dao động; dùng cross-validation để chắc hơn.
WANT: Biết cố định split, so sánh cùng điều kiện, nhắc tới độ dao động giữa các lần chia.
Q: Đồng nghiệp scale toàn bộ dữ liệu rồi mới chia train/test và báo accuracy rất cao. Bạn giải thích rủi ro thế nào?
A: **Đó là leakage trong tiền xử lý.** Mean/std đã bao gồm hàng test nên điểm có thể lạc quan. Làm lại: chia trước, `fit` scaler trên train, `transform` test — hoặc đưa scaler vào Pipeline để không thể quên.
WANT: Nêu đúng thứ tự chia → fit trên train → transform test, nhắc Pipeline.
:::

:::next
Phần B: đọc kỹ kết quả (confusion matrix, precision, recall), so sánh nhiều mô hình, xử lý số 0 thiếu, rồi làm như thật với Pipeline và cross-validation.
:::
