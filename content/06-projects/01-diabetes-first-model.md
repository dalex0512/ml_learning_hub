---
title: "Thực hành 1 — Diabetes: từ file CSV đến mô hình đầu tiên"
order: 1
description: "Tự gõ đường ống đọc CSV, tách x/y, chia dữ liệu, chuẩn hóa và huấn luyện Logistic Regression trong PyCharm."
needs: [labeled-data, train-test-split, feature-scaling, classification-metrics]
tags: [diabetes, practice, pandas, scikit-learn, train-test-split, standardscaler, data-leakage]
---

## Bước 0 — Mở đúng môi trường và file

:::intro
Tự gõ từng bước, chạy và mở từng biến để hiểu dữ liệu đi đâu. Bài này tái hiện baseline của chủ repo, chưa xử lý số 0 bất thường. Không có slide gốc; mọi kết quả lấy từ file `dataset/diabetes.csv` trong repo.
:::

**Bản đồ:** 0 Chuẩn bị → 1 Đọc bảng → 2 Tách x/y → 3 Chia bộ → 4 Scale → 5 Fit và predict.

**Mục tiêu:** chạy được Python với đúng file CSV. Làm trong một project PyCharm, đặt **Working directory** ở thư mục gốc `D:\ML_VNAI`. Terminal dùng interpreter của project: `python -m pip install pandas scikit-learn matplotlib`. Matplotlib chỉ cần cho bài tập vẽ. Kết quả đã kiểm với Python **3.14.6**, pandas **3.1.1**, NumPy **2.5.4**, sklearn **1.9.1**; phiên bản khác có thể lệch chút kết quả.

**Lý thuyết cần biết:** đường dẫn tương đối được tính từ working directory, giống địa chỉ “ngõ bên cạnh” phải biết đang đứng ở đâu. Bản học dùng `dataset/diabetes.csv`; code chủ repo dùng `diabetes.csv` chỉ chạy nếu CWD chứa trực tiếp file ấy. Trong Run → Edit Configurations đặt Working directory; Python Console có working directory riêng trong Settings → Build, Execution, Deployment → Console → Python Console. Kiểm `os.getcwd()` ở chính nơi đang chạy.

```python
import os  # kiểm thư mục đang chạy
import pandas as pd  # đọc và xem bảng
import numpy as np  # kiểm các mảng số
from sklearn.model_selection import train_test_split  # chia bộ
from sklearn.preprocessing import StandardScaler  # chuẩn hóa
from sklearn.linear_model import LogisticRegression  # classifier đầu tiên
from sklearn.metrics import accuracy_score  # chấm dự đoán
print("Working directory:", os.getcwd())  # phải là thư mục gốc repo
```

**Bạn phải thấy:** đường dẫn gốc repo, chưa có lỗi import. Nếu `FileNotFoundError`, kiểm CWD rồi đường dẫn, không đổi model. Bôi đen code → chuột phải **Execute Selection in Python Console**, mặc định Windows **Alt+Shift+E**. Mỗi khi xuất hiện `data`, `x`, `y`, `x_train`, mở xem một lần bằng **View as DataFrame / Series / Array** trong panel biến; vị trí panel tùy phiên bản/keymap. Chạy từ trên xuống; khi đổi bước trước, chạy lại các bước sau hoặc khởi động Console mới. [Tài liệu PyCharm](https://www.jetbrains.com/help/pycharm/interactive-console.html).

**Tự làm:** ★ mở Console, in CWD và xác nhận tìm được CSV. Chưa cần bài tập nặng.

<details>
<summary>Đáp án bước 0 — mở sau khi thử</summary>

Nếu CWD là `D:\ML_VNAI`, `dataset/diabetes.csv` trỏ đúng file. Nếu đang ở `D:\ML_VNAI\dataset`, đường dẫn phù hợp là `diabetes.csv`. Chọn một cách, giữ nhất quán cả bài; Python Console và Run Configuration có thể khác CWD.

</details>

> **EN:** Relative paths resolve from the current working directory. Use the same project interpreter and verify the directory in the execution surface you actually use. Execute selections in order and inspect new variables in the console's data viewer.

## Bước 1 — Đọc bảng trước khi học model

**Mục tiêu:** biết mỗi hàng/cột là gì và nhãn có bao nhiêu mẫu.

**Lý thuyết cần biết:** như đọc đề trước khi giải, cần xem bảng trước khi chọn thuật toán. Đây là bảng y tế công khai thường dùng để học, thường gọi **Pima Diabetes**; bản CSV không kèm hồ sơ nguồn nên không suy thêm dân số hay tính đại diện. Có 8 feature số và `Outcome`: 0/1 là nhãn không/có tiểu đường của dataset. Đây là [[bài:classification-vs-regression|phân loại nhị phân]], không phải dự đoán mức đường huyết. Đọc thêm [[bài:feature-and-data-types]] và [[bài:descriptive-statistics]]; bài tập này không là công cụ chẩn đoán.

```python
data = pd.read_csv("dataset/diabetes.csv")  # đọc file từ gốc repo
print(data.shape)  # số hàng và cột
print(data.head())  # xem 5 hàng đầu
data.info()  # dtype và số ô không thiếu
print(data.describe())  # thống kê các cột số
print(data["Outcome"].value_counts())  # đếm nhãn
```

**Bạn phải thấy:** `(768, 9)`, không có NaN; 7 cột `int64`, BMI và DiabetesPedigreeFunction là `float64`. Chín cột: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age, Outcome. Outcome=0 có **500** mẫu (**65.1042%**), Outcome=1 có **268** (**34.8958%**). Hàng đầu: `[6,148,72,35,0,33.6,0.627,50,1]`.

![Số mẫu Outcome 0 và 1 trong toàn bộ CSV](/plots/diabetes-outcome.png)

[Mở hình gốc](/plots/diabetes-outcome.png). Cột 0 đông hơn, nên cần so với baseline ở bài 2.

:::pitfall Không có NaN chưa nghĩa là dữ liệu đầy đủ
Glucose có **5**, BloodPressure **35**, SkinThickness **227**, Insulin **374**, BMI **11** giá trị 0 đáng ngờ: trong thực hành này coi là thiếu được mã hóa bằng 0. Pregnancies có **111** số 0 hợp lệ, Outcome có 500 nhãn 0 hợp lệ. Chưa thay gì ở bài này; [[bài:missing-values-outliers]] giải thích sentinel, bài 2 mới xử lý.
:::

**Tự làm:** ★ đếm nhãn và tính phần trăm. ★★ đếm số 0 từng cột, giải thích hai cột không nên đổi 0 thành thiếu. ★★★ vẽ histogram Glucose theo Outcome rồi mô tả vùng chồng lấn; dùng [[bài:data-visualization]] khi cần.

<details>
<summary>Đáp án bước 1 — số đếm và histogram</summary>

```python
print(data["Outcome"].value_counts(normalize=True) * 100)
print((data == 0).sum())
import matplotlib.pyplot as plt
for label in [0, 1]:
    values = data.loc[data["Outcome"] == label, "Glucose"]
    plt.hist(values, bins=np.arange(0, 221, 10), alpha=0.5, label=str(label))
plt.xlabel("Glucose"); plt.ylabel("Count"); plt.legend(); plt.show()
```

DPF/Age có 0 số 0. Pregnancies=0 nghĩa chưa mang thai, Outcome=0 là nhãn, không phải missing. Histogram cho nhóm 1 thường dịch sang Glucose cao hơn nhưng hai nhóm chồng lấn; một feature không phân loại hoàn hảo. Số 0 Glucose chưa làm sạch vẫn có mặt trong hình. Đây là quan sát, không chứng minh nhân quả.

</details>

![Histogram Glucose theo nhãn với cùng khoảng chia](/plots/diabetes-glucose.png)

[Mở hình gốc](/plots/diabetes-glucose.png). So vị trí hai nhóm, đồng thời thấy phần chồng lấn; không dùng histogram để quyết định ngưỡng y tế.

> **EN:** Inspect shape, types, class counts and implausible sentinel zeros before modeling. The raw glucose distributions overlap; absence of NaN does not imply complete measurements. This is a learning dataset, not a validated diagnostic system.

## Bước 2 — Tách đề bài x khỏi đáp án y

**Mục tiêu:** tạo input không chứa nhãn cần dự đoán.

**Lý thuyết cần biết:** như làm bài thi, `x` là thông tin được phép xem, `y` là đáp án. Toán thường viết X hoa cho ma trận, y thường cho vector; code giữ **x, y** theo chủ repo. [[bài:labeled-data]] giải thích shape. `axis=1` chọn cột, `axis=0` chọn hàng; `drop` mặc định trả bảng mới, không sửa `data`.

```python
x = data.drop(labels="Outcome", axis=1)  # bỏ cột đáp án
y = data["Outcome"]  # lấy một cột thành Series
print(x.shape, y.shape)  # kiểm ma trận và vector
print(type(x).__name__, type(y).__name__)  # DataFrame, Series
```

**Bạn phải thấy:** `(768, 8)`, `(768,)`, `DataFrame Series`; `data` vẫn 9 cột. `data.drop("Outcome", axis=1)` hoặc `data.drop(columns="Outcome")` tương đương ở đây. Nếu để Outcome trong x, model có thể nhìn thẳng đáp án: một dạng **data leakage (rò rỉ dữ liệu)**.

**Tự làm:** ★ kiểm shape và x không có Outcome. ★★ thử axis=0, đọc nguyên lỗi. ★★★ tạo `x_no_age` bỏ Outcome và Age cùng lúc; có tự động tốt hơn không?

<details>
<summary>Đáp án bước 2 — axis và bỏ nhiều cột</summary>

```python
assert x.shape == (768, 8) and "Outcome" not in x
try:
    data.drop(labels="Outcome", axis=0)
except KeyError as error:
    print(error)
x_no_age = data.drop(labels=["Outcome", "Age"], axis=1)
print(x_no_age.shape)
```

Pandas 3.1.1 báo `KeyError: "['Outcome'] not found in axis"`: không có hàng index tên Outcome. x_no_age là `(768,7)`. Chỉ bỏ feature nếu có lý do về leakage, tính sẵn có hoặc thử nghiệm validation; tương quan thấp không đủ để kết luận bỏ cột.

</details>

> **EN:** Separate predictors from the target without changing row alignment. Axis 1 removes columns, while axis 0 looks for row labels. Removing a feature is a validation decision, not an automatic improvement.

## Bước 3 — Chia ngẫu nhiên nhưng tái lập được

**Mục tiêu:** giữ một phần dữ liệu để chấm ngoài train.

**Lý thuyết cần biết:** hai học sinh phải thi cùng đề mới dễ so. Nếu hôm qua 80%, hôm nay 78% nhưng test đổi, chưa biết do model hay đề thi. [[bài:train-test-split]]: `test_size=0.2` dành khoảng 20%, còn lại train; shuffle mặc định làm index lộn xộn. `random_state=42` cố định bộ chia khi dữ liệu/thứ tự/cấu hình giữ nguyên, không phải số “tốt nhất”. Seed của forest là việc khác với seed của split.

```python
x_train, x_test, y_train, y_test = train_test_split(  # chia x/y cùng nhau
    x, y, test_size=0.2, random_state=42)  # giữ split của code gốc
print(x_train.shape, x_test.shape)  # kiểm kích thước
print(x_train.index[:5].tolist())  # chỉ số gốc sau xáo trộn
```

**Bạn phải thấy:** train `(614,8)`, test `(154,8)`, index đầu train **[60,618,346,294,231]**. Train nhãn 0/1 là **401/213**, test **99/55**. Không reset index để “sửa” việc trộn; x/y vẫn ghép đúng hàng. 20%×768=153.6 nên sklearn dành 154 test.

![Hai cách chia 80/20 và gần 60/20/20 trên 768 hàng](/plots/diabetes-splits.png)

[Mở hình gốc](/plots/diabetes-splits.png). Chia hai lần: lấy 20% test trước, rồi `test_size=0.25` của phần 80% vì **0.25×0.8=0.2**. Thực tế làm tròn ra **460/154/154**, gần 60/20/20. Có thể dùng [[bài:k-fold-cross-validation]] trên phần development thay vì tách val cứng, tùy dữ liệu/chi phí.

Chỉ cần test_size **hoặc** train_size. Nếu đưa cả hai, sklearn dùng cả hai khi hợp lệ: `.6/.2` lấy 460 train và154 test, **154 hàng không được dùng**, không phải luôn lỗi. Tổng vượt1 là không hợp lệ.

**Tự làm:** ★ chia lại và kiểm shape. ★★ in năm index đầu với seed None ba lượt rồi seed42 ba lượt. ★★★ chia ba bộ; thêm `stratify=y` cho split80/20 và so phân bố nhãn với bản gốc.

<details>
<summary>Đáp án bước 3 — tái lập, ba bộ và stratify</summary>

```python
for seed in [None, None, None, 42, 42, 42]:
    a, b = train_test_split(x, test_size=0.2, random_state=seed)
    print(seed, a.index[:5].tolist())
a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=42)
a_train, a_val = train_test_split(a, test_size=0.25, random_state=42)
print(len(a_train), len(a_val), len(b))
a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)
print(c.value_counts(), d.value_counts())
```

Seed42 lặp đúng index, seed None thường khác; ngẫu nhiên không phải lời hứa mọi lần đều khác. Stratify cho train **400/214**, test **100/54** (nhãn0/1), giữ tỉ lệ gần toàn bộ hơn: class1 train/test **34.6906%/35.7143%** ở bản gốc, **34.8534%/35.0649%** với stratify. Tự kiểm bằng `213/614`, `55/154` và `214/614`, `54/154`; không thay split trong luồng chính. [[bài:stratified-k-fold]] giải thích giữ tỉ lệ; dữ liệu theo thời gian/nhóm còn cần cách chia phù hợp hơn.

</details>

> **EN:** A fixed split seed supports reproducible comparisons, independently of estimator randomness. Stratification preserves class proportions approximately. Specifying both train and test fractions may leave unused rows; nested fractions must account for rounding.

## Bước 4 — Thợ may: fit số đo, transform dữ liệu

**Mục tiêu:** chuẩn hóa bằng thống kê train, không học gì từ test.

**Lý thuyết cần biết:** thợ may **đo** là `fit`, **cắt theo số đo** là `transform`, làm cả hai là `fit_transform`. Lô vải sau dùng lại cùng số đo, không đo riêng để đổi chuẩn. StandardScaler học mean/std từng cột, rồi tính `z=(x−mean)/std`. [[bài:feature-scaling]]: scale quan trọng cho khoảng cách, tối ưu và penalty; Logistic mặc định có regularization L2/C=1 nên đơn vị ảnh hưởng mức phạt. Linear không penalty giải chính xác không bắt buộc scale; KNN/SVM thường nhạy thang.

```python
scaler = StandardScaler()  # tạo đối tượng chưa học số đo
x_train = scaler.fit_transform(x_train)  # học và đổi train
x_test = scaler.transform(x_test)  # chỉ đổi test bằng số đo train
print(np.round(x_train.mean(axis=0), 6))  # mean từng cột
print(np.round(x_train.std(axis=0, ddof=0), 6))  # std chia N
print(np.round(x_test.mean(axis=0), 6))  # không ép test mean=0
```

**Bạn phải thấy:** train mean tám số 0 (có thể `-0.`), std tám số1; sai số float mean tối đa khoảng **5.7×10⁻¹⁶**. Test mean theo thứ tự8 feature: **[.154226,.006151,−.083534,.044444,−.070362,.005926,.040133,.144793]**. Test không mean0 là đúng: dùng chuẩn train, không “sửa” bằng fit lại trên test.

:::worked Hai phép tính tự soạn để hiểu fit
Cột train `[1,2,3,4,5]` có mean3, variance `(4+1+0+1+4)/5=2`, std√2. Sau đổi có `[-1.414214,-.707107,0,.707107,1.414214]`, mean0/std1. Nếu lén đưa test=9 vào fit, mean thành24/6=4 thay vì3: test đã tác động phép học. Đây là leakage dù không dùng nhãn test; nối [[bài:ml-pipeline]].
:::

![Insulin và DPF trước/sau StandardScaler trên train](/plots/diabetes-scaling.png)

[Mở hình gốc](/plots/diabetes-scaling.png). Hai cột khác thang trước scale; sau scale cùng chuẩn mean/std nhưng outlier vẫn có thể xa0. Không chuẩn hóa để buộc hai phân bố có cùng hình dạng.

MinMax dùng min/max nên một cực trị có thể nén phần lớn mẫu. **Cả MinMax lẫn Standard đều nhạy outlier**; Standard không là giải pháp robust vì mean/std cũng bị kéo. Không xếp hạng “Standard luôn ít nhạy hơn” cho mọi dữ liệu; RobustScaler là lựa chọn khác để tìm hiểu.

Sau hai dòng gán, x_train/x_test thành **ndarray NumPy**, mất tên cột/index; y_train/y_test vẫn Series. Nếu muốn giữ bảng, sklearn1.9.1 đã kiểm `StandardScaler().set_output(transform="pandas")` trước fit; khi luyện code chính vẫn dùng ndarray. Python phân biệt `x_test` và `X_test`; viết hoa nhầm biến chưa tồn tại gây NameError.

**Tự làm:** ★ kiểm mean/std. ★★ thử MinMaxScaler trên **split thô mới**, xem min/max train/test. ★★★ cố tình fit scaler toàn bộ x rồi mới chia; so accuracy với cách đúng và chỉ ra leakage.

<details>
<summary>Đáp án bước 4 — MinMax và cách sai để nhận diện leakage</summary>

```python
from sklearn.preprocessing import MinMaxScaler
a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=42)
mm = MinMaxScaler().fit(a)
print(mm.transform(a).min(0), mm.transform(a).max(0))
print(mm.transform(b).min(0), mm.transform(b).max(0))
wrong = StandardScaler().fit(x)  # SAI: học cả các hàng test
leaky = LogisticRegression().fit(wrong.transform(a), c)
print(accuracy_score(d, leaky.predict(wrong.transform(b))))
```

Train MinMax min0/max1; test SkinThickness max **1.571429**, có thể vượt[0,1]. Cách sai có accuracy **0.753247**, bằng cách đúng ở split này: không có chênh điểm không xóa leakage. Thống kê đã nhìn thấy test; mọi bước học tham số từ dữ liệu, gồm imputer, đều phải fit chỉ train/fold. Khởi động lại luồng chính nếu đã gán nhầm biến.

</details>

> **EN:** Fit preprocessing on training data and reuse its parameters for held-out data. StandardScaler uses population variance and remains sensitive to outliers. Equal test accuracy does not make leaky preprocessing valid; transformed test data need not have zero mean.

## Bước 5 — Fit model rồi dự đoán

**Mục tiêu:** tạo classifier đầu tiên và kiểm prediction tương ứng nhãn thật.

**Lý thuyết cần biết:** fit của scaler học **số đo**, fit của model học **quan hệ feature→label**; cùng tên phương thức, khác công việc. [[bài:model-training-pipeline]] và [[bài:logistic-regression]] giải thích sâu. `predict` trả nhãn0/1, không phải xác suất.

```python
model = LogisticRegression()  # tạo model mới
model.fit(x_train, y_train)  # học hệ số trên train đã scale
y_predict = model.predict(x_test)  # đoán nhãn của test đã scale
for predicted, actual in zip(y_predict[:10], y_test.iloc[:10]):  # chỉ 10 cặp
    print("Predicted:", predicted, "Actual:", actual)  # so cùng vị trí
print("Accuracy:", accuracy_score(y_test, y_predict))  # y thật trước
```

**Bạn phải thấy:** y_predict shape `(154,)`, accuracy **0.7532467532**, đúng116/154. Mười cặp đầu: bảy cặp0/0 rồi ba cặp1/0. Đừng suy cả model tốt/xấu từ vài dòng đầu; [[bài:classification-metrics]] và bài tiếp theo sẽ đọc kiểu sai.

**Tự làm:** ★ in mười cặp, kiểm không lệch hàng. ★★ in năm xác suất class1 và áp ngưỡng0.5. ★★★ tự tính accuracy bằng so từng nhãn rồi lấy mean, so hàm thư viện.

<details>
<summary>Đáp án bước 5 — xác suất và accuracy</summary>

```python
p = model.predict_proba(x_test)[:, 1]
print(p[:5])
print((p >= 0.5).astype(int)[:5])
print((y_predict == y_test.to_numpy()).mean())
assert np.isclose((y_predict == y_test.to_numpy()).mean(),
                  accuracy_score(y_test, y_predict))
```

Năm xác suất đầu **[.277364,.185960,.114658,.171396,.468438]**, nên năm nhãn đầu đều0. Hai phép tính accuracy cùng **0.753247**. Xác suất model chưa tự là xác suất đã hiệu chỉnh hay kết luận lâm sàng.

</details>

> **EN:** Estimator fit learns predictive parameters, unlike scaler fit which learns preprocessing statistics. Predict returns labels; predict_proba returns class probabilities. Check row alignment and compare manual accuracy with the library result.

### Bộ code hoàn chỉnh để gõ lại

Gấp bài, thử gõ từ trí nhớ, rồi mở bản sạch này để đối chiếu. Chạy từ gốc repo trong Console mới; đây là ghép đúng các đoạn bước0–5, không gồm bài tập thử sai.

<details>
<summary>Mở bộ code hoàn chỉnh — bài 1</summary>

```python
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
print("Working directory:", os.getcwd())

data = pd.read_csv("dataset/diabetes.csv")
print(data.shape)
print(data.head())
data.info()
print(data.describe())
print(data["Outcome"].value_counts())

x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]
print(x.shape, y.shape)
print(type(x).__name__, type(y).__name__)

x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)
print(x_train.shape, x_test.shape)
print(x_train.index[:5].tolist())

scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)
print(np.round(x_train.mean(axis=0), 6))
print(np.round(x_train.std(axis=0, ddof=0), 6))
print(np.round(x_test.mean(axis=0), 6))

model = LogisticRegression()
model.fit(x_train, y_train)
y_predict = model.predict(x_test)
for predicted, actual in zip(y_predict[:10], y_test.iloc[:10]):
    print("Predicted:", predicted, "Actual:", actual)
print("Accuracy:", accuracy_score(y_test, y_predict))
```

</details>

:::recap
- Đọc shape, dtype, phân bố nhãn và sentinel trước khi học.
- x bỏ Outcome, y giữ Outcome, không lệch hàng.
- Seed42 cố định split, không bảo đảm model tốt.
- Fit scaler chỉ train, transform test bằng số đo train.
- Fit Logistic rồi predict; accuracy chưa mô tả hết lỗi.
:::

### Checklist tự kiểm

- [ ] Tôi xác định được CWD và tự mở từng biến trong PyCharm.
- [ ] Tôi tạo được x768×8 và y768.
- [ ] Tôi giải thích được axis=1 và index bị trộn.
- [ ] Tôi chia được614/154 và tái lập index.
- [ ] Tôi biết vì sao test chỉ transform, không fit.
- [ ] Tôi dự đoán và tự tính accuracy116/154.

### Tự kiểm tra không nhìn code

:::quiz
@tier A | Hiểu bài
Q: x có shape gì? Vì sao không giữ Outcome?
A: **(768,8), để input không chứa đáp án.** Outcome là nhãn riêng trong y shape(768,). Nếu giữ nó, model có thể học từ kết quả cần dự đoán thay vì thông tin có sẵn.
Q: Chia20% test từ768 cho bao nhiêu hàng? Vì sao index không liên tục?
A: **154 test,614 train.** Kích thước test được làm tròn lên và dữ liệu shuffle; index gốc như60/618/346 vẫn hợp lệ. Không được sắp riêng y làm lệch cặp.
Q: Test sau scale không mean0, có cần fit lại không?
A: **Không.** Chuẩn phải học từ train và dùng nhất quán; fit test sẽ đổi chuẩn bằng thông tin đánh giá. Ví dụ mean Glucose test khoảng.006151 là bình thường.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Why do we fit the scaler only on the training set?
A: **Để thống kê test không tham gia học.** Fit lấy mean/std, transform dùng lại; ví dụ thêm test9 vào train1…5 đổi mean3 thành4. Tiền xử lý phải nằm trong fold khi làm CV.
EN: Fit the scaler on training data so held-out statistics do not influence learning; reuse the fitted parameters for validation and test transformations.
Q: **B2.** What does random_state do?
A: **Cố định nguồn ngẫu nhiên để tái lập một thao tác.** Cùng dữ liệu/thứ tự và cấu hình chia, seed42 lặp đúng index; seed của split độc lập seed forest. Nó không tối ưu accuracy hay bảo đảm mọi phiên bản giống nhau.
EN: A fixed random_state makes a randomized operation reproducible under the same inputs and configuration; split randomness and estimator randomness are separate.
Q: **B3.** What is data leakage?
A: **Thông tin ngoài phần được phép học lọt vào quá trình xây model.** Có thể là nhãn nằm trong x hoặc scaler fit cả test. Accuracy không đổi như ví dụ này vẫn không làm quy trình đó đúng.
EN: Leakage occurs when information unavailable to the intended training procedure influences model development, including preprocessing fitted on held-out data.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Sếp hỏi tại sao hôm nay model khác hôm qua dù chỉ sửa một dòng tiền xử lý?
A: **Kiểm khả năng tái lập trước khi kết luận dòng đó làm đổi chất lượng.** So phiên bản dữ liệu, index split, seed model và môi trường; chạy hai quy trình trên cùng development/CV. Ví dụ đổi seed chia cũng đổi các ca khó trong test nên so80% với78% chưa công bằng.
WANT: Tách biến gây khác biệt, kiểm split/model/data rồi mới diễn giải cải thiện.
Q: **C2.** Đồng nghiệp scale cả bộ trước khi chia và nói điểm bằng cách đúng nên được chấp nhận?
A: **Không chấp nhận quy trình ấy dù điểm bằng nhau.** Mean/std đã có dữ liệu test; fit lại trong train/fold và giữ test cuối ngoài vòng chọn. Ví dụ split42 cho cùng accuracy.753247 chỉ cho thấy leakage không luôn tăng điểm nhìn thấy.
WANT: Hiểu leakage là vấn đề thông tin và quy trình, không phải chỉ tìm chênh lệch accuracy.
:::

:::next
[[bài:diabetes-evaluate-improve]] đọc116 dự đoán đúng thành confusion matrix, so mô hình, xử lý số0 thiếu và gói Pipeline để chọn bằng CV. Nếu chưa gõ lại được bước1–5, luyện lại trước khi sang bài2.
:::
