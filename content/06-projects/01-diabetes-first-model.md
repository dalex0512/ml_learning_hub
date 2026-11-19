---
title: "Từ file CSV đến mô hình đầu tiên"
order: 1
layout: practice
description: "Bốn bước: nhìn dữ liệu, cất bộ test, chuẩn hoá, huấn luyện. Mỗi bước bắt đầu từ một thứ sẽ hỏng nếu bạn bỏ qua nó."
needs: [labeled-data, train-test-split, feature-scaling, classification-metrics]
tags: [diabetes, practice, pandas, scikit-learn, train-test-split, standardscaler, data-leakage, random-state, logistic-regression]
---

## Chuẩn bị

Bài chạy trên PyCharm, trong Python Console. Cài thư viện một lần ở Terminal:

```bash
python -m pip install pandas scikit-learn matplotlib
```

Ba điều cần nhớ để khỏi mất thời gian vô ích:

1. **Đứng đúng thư mục.** Bài dùng đường dẫn `dataset/diabetes.csv`, nên thư mục làm việc (working directory) phải là thư mục gốc dự án. Kiểm tra bằng `print(os.getcwd())`. Nếu gặp `FileNotFoundError`, gần như chắc chắn là đứng sai thư mục, không phải file hỏng.
2. **Chạy từng đoạn.** Bôi đen code, bấm `Alt+Shift+E` (Execute Selection in Python Console). Chạy từ trên xuống. Sửa một bước phía trên thì chạy lại các bước phía dưới.
3. **Nhìn tận mắt.** Mỗi biến mới (`data`, `x`, `x_train`…) xuất hiện ở panel biến bên phải; chọn *View as DataFrame* để xem như bảng.

Kết quả trong bài đã được chạy thật với Python 3.14, pandas 3.0, scikit-learn 1.9. Phiên bản khác có thể lệch chữ số cuối.

## Bước 1 — Nhìn dữ liệu

:::ask
Máy sẽ học gì từ bảng này, và đoán đúng bao nhiêu phần trăm thì mới gọi là giỏi?
:::

Bảng `diabetes.csv` có 768 hàng. Mỗi hàng là một bệnh nhân, mỗi cột là một phép đo. Cột cuối `Outcome` là **đáp án**: 1 là có tiểu đường, 0 là không. Tám cột còn lại là thông tin mô hình được phép nhìn. Đây là bộ dữ liệu y tế công khai thường dùng để học, không dùng để chẩn đoán thật.

```python
import pandas as pd

data = pd.read_csv("dataset/diabetes.csv")
print(data.shape)
print(data.head(3).to_string())
```

:::out
```text
(768, 9)
   Pregnancies  Glucose  BloodPressure  SkinThickness  Insulin   BMI  DiabetesPedigreeFunction  Age  Outcome
0            6      148             72             35        0  33.6                     0.627   50        1
1            1       85             66             29        0  26.6                     0.351   31        0
2            8      183             64              0        0  23.3                     0.672   32        1
```
:::

Việc thứ hai là đếm đáp án.

```python
print(data["Outcome"].value_counts())
print("Đoán toàn 0 thì đúng:", round((data["Outcome"] == 0).mean(), 3))
```

:::out
```text
Outcome
0    500
1    268
Name: count, dtype: int64
Đoán toàn 0 thì đúng: 0.651
```
:::

500 người không bệnh, 268 người bệnh. Nếu bạn nhắm mắt đoán "không bệnh" cho tất cả, bạn đúng 65.1%. Đó là **mức sàn**: một mô hình chỉ đáng giá khi vượt hẳn mức này. Hãy nhớ con số 65.1%, ta sẽ quay lại nó ở Bước 4 và Bước 5.

Việc thứ ba là tìm những ô vô lý. Glucose bằng 0 nghĩa là máu không có đường, điều này không thể xảy ra ở người còn sống.

```python
print((data.drop(columns="Outcome") == 0).sum())
```

:::out
```text
Pregnancies                 111
Glucose                       5
BloodPressure                35
SkinThickness               227
Insulin                     374
BMI                          11
DiabetesPedigreeFunction      0
Age                           0
dtype: int64
```
:::

Năm cột (Glucose, BloodPressure, SkinThickness, Insulin, BMI) có số 0 không thể có thật. Đó là ô **chưa đo** nhưng bị ghi thành 0. Riêng `Pregnancies = 0` thì hợp lệ (chưa mang thai). Ta chỉ ghi nhớ điều này; Bước 7 sẽ xử lý.

Cuối cùng, một cột đơn lẻ có đủ để đoán bệnh không? Thử với Glucose:

![Phân bố Glucose theo Outcome](/plots/practice/glucose-light.png)
![Phân bố Glucose theo Outcome](/plots/practice/glucose-dark.png)

Nhóm bệnh (đỏ) lệch sang phải, tức Glucose cao hơn. Nhưng hai nhóm chồng lên nhau nhiều: nhiều người có Glucose quanh 100 đến 130 thuộc cả hai nhóm. Không cột nào đủ một mình, nên ta cần mô hình kết hợp cả tám cột.

:::ex So sánh Glucose và BMI
Dùng `groupby("Outcome")` để so trung vị (median) của Glucose và BMI giữa hai nhóm. Cột nào tách hai nhóm rõ hơn?
@answer
```python
print(data.groupby("Outcome")[["Glucose", "BMI"]].median())
```
Glucose: 107 so với 140 (chênh khoảng 31%). BMI: 30.05 so với 34.25 (chênh khoảng 14%). Glucose tách hai nhóm rõ hơn, khớp với hệ số tương quan của chúng với Outcome (0.47 và 0.29) mà Bước 8 sẽ dùng.
:::

:::recap
- Mỗi hàng là một người; `Outcome` là đáp án, tám cột còn lại là đề.
- Đoán toàn "không bệnh" đã đúng 65.1%: đó là mức sàn mà mô hình phải vượt.
- Năm cột có số 0 không thể có thật: dữ liệu thiếu bị ghi thành 0 (xử lý ở Bước 7).
:::

## Bước 2 — Tách đề, rồi cất một phần đi

:::ask
Một mô hình báo đúng 100% trên dữ liệu nó đã thấy. Điều đó có đáng tin không?
:::

Trước hết, tách đề khỏi đáp án:

```python
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]
print(x.shape, y.shape)
```

:::out
```text
(768, 8) (768,)
```
:::

`axis=1` nghĩa là bỏ **cột**. Nếu viết `axis=0`, pandas đi tìm *hàng* tên "Outcome", không thấy và báo `KeyError`. Đừng quên bỏ cột `Outcome` khỏi `x`: nếu để lọt, mô hình nhìn thẳng đáp án và đạt điểm cao giả tạo. Đó là **rò rỉ dữ liệu** (data leakage).

Giờ là thí nghiệm. Cây quyết định (Decision Tree) có thể học thuộc từng bệnh nhân bằng cách hỏi thật nhiều câu hỏi. Cho nó học cả 768 người, rồi chấm lại đúng 768 người đó:

```python
from sklearn.tree import DecisionTreeClassifier

tree = DecisionTreeClassifier(random_state=0).fit(x, y)
print("Chấm trên chính dữ liệu đã học:", tree.score(x, y))
```

:::out
```text
Chấm trên chính dữ liệu đã học: 1.0
```
:::

100%. Nhưng điểm này chỉ chứng minh cây **thuộc bài**, chưa chứng minh nó **hiểu bài**. Muốn biết, phải cho làm một đề chưa từng thấy. Vì vậy ta cất 20% bệnh nhân đi làm **bộ test**; 80% còn lại là **bộ train** để học.

```python
from sklearn.model_selection import train_test_split

x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)
print(x_train.shape, x_test.shape)

tree = DecisionTreeClassifier(random_state=0).fit(x_train, y_train)
print("train:", tree.score(x_train, y_train))
print("test :", round(tree.score(x_test, y_test), 3))
```

:::out
```text
(614, 8) (154, 8)
train: 1.0
test : 0.747
```
:::

Cùng một cây: 100% trên đề đã học, 74.7% trên đề mới. Khoảng cách 25 điểm đó là **overfitting** (học vẹt). Từ đây có luật số một của học máy: **không bao giờ chấm mô hình trên dữ liệu nó đã học.** (20% của 768 là 153.6, sklearn làm tròn thành 154 hàng test.)

Còn `random_state=42` để làm gì? `train_test_split` xáo ngẫu nhiên trước khi chia, nên chạy lại sẽ ra bộ test khác. Hãy xem cùng một cây được chấm qua 30 cách chia khác nhau:

```python
scores = []
for seed in range(30):
    a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=seed)
    scores.append(DecisionTreeClassifier(random_state=0).fit(a, c).score(b, d))
print(round(min(scores), 3), round(max(scores), 3))
```

:::out
```text
0.656 0.766
```
:::

![Điểm của cùng một cây qua 30 cách chia](/plots/practice/seeds-light.png)
![Điểm của cùng một cây qua 30 cách chia](/plots/practice/seeds-dark.png)

Điểm dao động từ 65.6% đến 76.6%, tức chênh 11 điểm chỉ vì may rủi của lần chia. Ba hệ quả:

- Đặt `random_state=42` (số nào cũng được, miễn đã chọn thì giữ nguyên) để mọi lần thử dùng **cùng một đề thi**. Nếu đề đổi mỗi lần, bạn không biết điểm tăng là do cải tiến thật hay do đề dễ hơn.
- Đừng chọn seed vì nó cho điểm đẹp. Đó là tự lừa mình.
- Ngay cả khi đã cố định, một con số duy nhất từ một lần chia vẫn rất dao động. Bước 6 sẽ giải quyết điều này.

:::ex Chia ba bộ 60/20/20
Muốn có thêm bộ validation theo tỉ lệ 60/20/20, lần chia thứ hai dùng `test_size` bằng bao nhiêu? Kiểm tra bằng `len()`.
@answer
```python
x_rest, x_test2, y_rest, y_test2 = train_test_split(x, y, test_size=0.2, random_state=42)
x_tr, x_val, y_tr, y_val = train_test_split(x_rest, y_rest, test_size=0.25, random_state=42)
print(len(x_tr), len(x_val), len(x_test2))
```
Lần hai dùng `0.25`, vì 25% của phần 80% còn lại là 20% tổng. Kết quả 460, 154, 154. Thực tế người ta ít chia cứng thế này mà dùng K-fold (Bước 6).
:::

:::recap
- Tách `x` (đề) khỏi `y` (đáp án); `axis=1` là bỏ cột.
- Điểm trên dữ liệu đã học không chứng minh gì: cây đạt 100% khi học thuộc nhưng chỉ 74.7% trên đề mới.
- Luôn cất bộ test đi, và cố định `random_state` để so sánh công bằng.
:::

## Bước 3 — Chuẩn hoá

:::ask
Insulin lên tới 846, còn DiabetesPedigreeFunction chỉ tới 2.4. Mô hình có "nghe" hai cột này công bằng không?
:::

Nhiều mô hình đo "hai bệnh nhân khác nhau bao nhiêu" bằng khoảng cách, hoặc cộng các cột lại theo trọng số. Khi đó cột có số lớn lấn át cột có số nhỏ. Hãy xem với hai bệnh nhân thật (số 3 và số 4 trong bảng):

```python
import numpy as np

a, b = x.iloc[3], x.iloc[4]
sq = (a - b) ** 2
print((sq / sq.sum()).round(2))
```

:::out
```text
Pregnancies                 0.00
Glucose                     0.26
BloodPressure               0.08
SkinThickness               0.02
Insulin                     0.61
BMI                         0.03
DiabetesPedigreeFunction    0.00
Age                         0.02
dtype: float64
```
:::

Trong khoảng cách giữa hai người này, Glucose chiếm 26% còn Insulin chiếm tới 61%, chỉ vì Insulin được đo bằng thước lớn. Với 5000 cặp bệnh nhân ngẫu nhiên thì sao?

```python
def distance_share(X, n_pairs=5000, seed=0):
    rng = np.random.default_rng(seed)
    i, j = rng.integers(0, len(X), (2, n_pairs))
    sq = (X[i] - X[j]) ** 2
    sq = sq[sq.sum(axis=1) > 0]
    return (sq / sq.sum(axis=1, keepdims=True)).mean(axis=0)

raw = distance_share(x_train.to_numpy())
print(pd.Series(raw, index=x.columns).round(3))
```

:::out
```text
Pregnancies                 0.006
Glucose                     0.200
BloodPressure               0.085
SkinThickness               0.072
Insulin                     0.566
BMI                         0.023
DiabetesPedigreeFunction    0.000
Age                         0.047
dtype: float64
```
:::

Trung bình, Insulin tạo ra 56.6% khoảng cách, còn DPF gần như 0%. Trong mắt mô hình, DPF gần như vô hình, không phải vì nó vô dụng mà vì nó được đo bằng thước nhỏ.

Cách sửa là **StandardScaler**: đổi mỗi cột thành "lệch bao nhiêu độ lệch chuẩn so với trung bình":

> z = (giá trị − trung bình) / độ lệch chuẩn

Ví dụ (số tự soạn): một cột có trung bình 120 và độ lệch chuẩn 30, thì giá trị 150 thành (150 − 120) / 30 = 1. Mọi cột đều thành cùng một thước: 0 là trung bình, 1 là cao hơn một độ lệch chuẩn.

:::pop Độ lệch chuẩn (std) tính như thế nào
Độ lệch chuẩn đo **một giá trị thường cách trung bình bao xa**. Công thức qua 4 bước:

1. Tính trung bình: `mean = (x1 + x2 + … + xn) / n`.
2. Với mỗi giá trị, lấy hiệu so với trung bình: `x − mean`.
3. Bình phương từng hiệu, cộng lại rồi chia cho `n`. Kết quả gọi là **phương sai** (variance).
4. Lấy căn bậc hai của phương sai. Đó là std.

> std = √( [ (x1 − mean)² + (x2 − mean)² + … + (xn − mean)² ] / n )

### Ví dụ làm tay (số tự soạn)

Glucose của 3 người: `100, 120, 140`. Trung bình là 120.

| Giá trị | x − mean | Bình phương |
|---|---|---|
| 100 | −20 | 400 |
| 120 | 0 | 0 |
| 140 | +20 | 400 |
| | | **Tổng = 800** |

- Phương sai = 800 / 3 = 266.67
- std = √266.67 = **16.33**

Đọc kết quả: "một người trong nhóm này thường cách trung bình khoảng 16 đơn vị". Hai người cách 20, một người cách 0, nên 16.33 nằm giữa là hợp lý.

### Hai câu hỏi hay gặp

**Vì sao bình phương rồi mới căn?** Hiệu −20 và +20 nếu cộng thẳng sẽ triệt tiêu thành 0, dù hai người đều cách xa trung bình. Bình phương làm mọi hiệu thành số dương. Căn ở cuối đưa đơn vị về như ban đầu (mg/dL chứ không phải mg²/dL²). Bình phương còn phạt giá trị xa nặng hơn: người cách 40 đóng góp 1600, gấp 4 lần người cách 20.

**Chia cho `n` hay `n − 1`?**

| Phiên bản | Chia cho | Với ví dụ trên | Dùng ở |
|---|---|---|---|
| Std tổng thể (population) | `n` | 16.33 | `StandardScaler`, `numpy.std` |
| Std mẫu (sample) | `n − 1` | 20.00 | `pandas .std()` mặc định |

Với hàng trăm dòng, hai cách chênh rất ít. `StandardScaler` chia cho `n`, nên nếu so `x_train["Glucose"].std()` của pandas với `scaler.scale_[1]` sẽ lệch nhẹ ở chữ số cuối. Để khớp chính xác, dùng `std(ddof=0)`.

### Kiểm tra bằng code

```python
from sklearn.preprocessing import StandardScaler
g = np.array([100, 120, 140])
print(g.mean(), round(g.std(), 2), g.std(ddof=1))
print(round(np.sqrt(((g - g.mean()) ** 2).mean()), 2))     # tự làm đúng 4 bước
print(round(x_train["Glucose"].std(ddof=0), 2), round(StandardScaler().fit(x_train).scale_[1], 2))
```

### Vì sao scaler chia cho std

Sau bước `x − mean`, mọi cột đều xoay quanh 0 nhưng độ rộng vẫn khác nhau (Glucose trải khoảng ±32, Insulin khoảng ±116). Chia cho std của chính cột đó đưa mọi cột về cùng độ rộng: "một đơn vị = một bước chân điển hình của cột". Vì vậy sau chuẩn hoá, std của mọi cột bằng đúng 1.
:::

Anh thợ may làm hai việc riêng biệt: **đo** người mặc, rồi **cắt vải** theo số đo. Scaler cũng vậy:

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
scaler.fit(x_train)                        # ĐO: tính mean và std từng cột, chỉ trên train
x_train_s = scaler.transform(x_train)      # CẮT: đổi train theo số đo đó
x_test_s = scaler.transform(x_test)        # CẮT: đổi test, vẫn bằng số đo của train

print(x_train_s.mean(axis=0).round(2) + 0.0)
print(x_train_s.std(axis=0).round(2))
print(x_test_s.mean(axis=0).round(2))
```

:::out
```text
[0. 0. 0. 0. 0. 0. 0. 0.]
[1. 1. 1. 1. 1. 1. 1. 1.]
[ 0.15  0.01 -0.08  0.04 -0.07  0.01  0.04  0.14]
```
:::

Train có trung bình 0 và độ lệch chuẩn 1 cho mọi cột, đúng như thiết kế. Test thì **không** có trung bình đúng 0 (ví dụ 0.15 ở cột đầu), và đó là điều đúng: test được cắt theo số đo của train.

Vì sao test không được tham gia bước **đo**? Bộ test đóng vai bệnh nhân mới sẽ đến sau này. Khi triển khai thật, bạn không có sẵn những bệnh nhân đó để tính trung bình. Nếu lúc thử bạn đo cả bộ test, bạn đã dùng thông tin mà đời thực không bao giờ có, và điểm thu được lạc quan hơn sự thật. Đó là rò rỉ dữ liệu. Quy tắc: `fit` chỉ trên train, test chỉ `transform`.

:::pop fit, transform và vì sao test không được tham gia
### 1. Scaler là một cuốn sổ ghi số đo

Sau `scaler.fit(x_train)`, scaler chỉ giữ hai dãy số, mỗi cột một số:

| Cột | `mean_` (trung bình) | `scale_` (độ lệch chuẩn) |
|---|---|---|
| Pregnancies | 3.74 | 3.31 |
| Glucose | 120.86 | 32.01 |
| BloodPressure | 69.42 | 18.50 |
| SkinThickness | 20.40 | 15.42 |
| Insulin | 81.44 | 116.14 |
| BMI | 31.98 | 7.73 |
| DiabetesPedigreeFunction | 0.47 | 0.34 |
| Age | 32.91 | 11.49 |

```python
print(pd.DataFrame({"mean_": scaler.mean_, "scale_": scaler.scale_}, index=x.columns).round(2))
```

Hai bảng 8 số này là **toàn bộ kiến thức** của scaler. `fit` chưa đổi dữ liệu nào, giống anh thợ may đã ghi số đo vào sổ nhưng chưa cắt vải.

- **Mean** là "người điển hình", trung tâm của cột: Glucose điển hình trong train là 120.86.
- **Std** là "một bước chân dài bao nhiêu": Glucose thường cách trung tâm khoảng 32 đơn vị, Insulin khoảng 116. Insulin có bước chân dài gấp 3.6 lần Glucose, nên cùng chênh 32 đơn vị thì Glucose là "một bước" còn Insulin chỉ là "0.28 bước".

### 2. `transform` đổi đơn vị sang "số bước chân"

Công thức: **z = (giá trị − mean) / std**. Làm tay với bệnh nhân đầu tiên của train (Glucose = 84):

> z = (84 − 120.86) / 32.01 = −1.15

Nghĩa là "thấp hơn người điển hình 1.15 bước chân". Với Insulin = 579 (giá trị cao nhất của bộ test):

> z = (579 − 81.44) / 116.14 = 4.28

Nghĩa là "xa người điển hình hơn 4 bước chân", rất bất thường. Mọi cột dùng chung một thang, nên mô hình so sánh công bằng được. `transform` không tính lại gì, chỉ dùng số đo trong sổ; vì thế hai dòng `transform` (train và test) dùng **cùng một bộ số đo**.

### 3. Vì sao ba dòng `print` ra kết quả đó

- **Train ra 0 và 1 là tất yếu.** Số đo lấy từ chính nhóm này rồi áp lại cho chính nó, giống lấy chiều cao trung bình của lớp rồi hỏi "trung bình của lớp so với trung bình của lớp" thì dĩ nhiên bằng 0.
- **Test ra 0.15, 0.01, −0.08… là bình thường.** Test là 154 người khác, không bắt buộc trùng trung bình với train. Cột đầu 0.15 nghĩa là test có số lần mang thai nhỉnh hơn train 0.15 bước chân.
- **Nếu test ra đúng 0 thì đáng nghi**: có thể bạn đã `fit` trên test, hoặc `fit` cả bộ rồi mới tách.
- Dòng `+ 0.0` chỉ để máy in `0.` thay vì `-0.` (số 0 âm do làm tròn).

### 4. Thợ may, đối chiếu từng chi tiết

| Thợ may | Scaler |
|---|---|
| Đo người, ghi số vào sổ | `fit`: tính mean và std, lưu vào `mean_`, `scale_` |
| Cắt vải theo số đo | `transform`: áp công thức |
| Khách mới đến, lấy sổ ra cắt tiếp | `transform` dữ liệu mới, không `fit` lại |

Điểm mấu chốt: **cuốn sổ chỉ được cập nhật bằng bài tập (train), không được cập nhật bằng bài thi (test).**

### 5. Vì sao test không được tham gia bước đo

**Tình huống thật.** Bạn xây hệ thống cho phòng khám. Hôm nay có 614 bệnh nhân cũ để học. Từ ngày mai, bệnh nhân mới đến từng người một và mỗi người được đổi bằng sổ số đo đã chốt: `scaler.transform(bệnh_nhân_mới)`. Bạn không thể chờ mọi bệnh nhân tương lai đến đủ rồi mới tính trung bình.

**Bộ test phải mô phỏng đúng điều đó.** Nó đóng vai bệnh nhân tương lai. Nếu lúc thử bạn đo cả test, hệ thống đã biết trước thông tin về những người "chưa đến". Phép thử thành gian lận: điểm trông tốt nhưng đời thật không đạt được.

Số liệu thật, với người test có Insulin = 579:

| Đo bằng | Mean Insulin | Std Insulin | z của 579 |
|---|---|---|---|
| **Đúng:** chỉ train | 81.44 | 116.14 | **4.284** |
| **Sai:** cả bộ dữ liệu | 79.80 | 115.17 | 4.335 |

Scaler đã "thấy" cả những người test nên số đo xê dịch. Với 614 người, thêm 154 người làm số đo đổi rất ít, nên rò rỉ **nhỏ**, nhưng nó có hướng: mô hình đã được chuẩn bị cho dữ liệu mà lẽ ra nó chưa biết.

### 6. Khi nào rò rỉ lớn, khi nào nhỏ

Nếu bạn cố tình `fit` trên toàn bộ dữ liệu, accuracy ở bài này vẫn là 0.7532, y hệt cách đúng. Vì scaler chỉ học 16 con số, và thêm test gần như không làm mean và std đổi. Nhưng với các bước **học nhiều hơn** (điền giá trị thiếu theo nhóm, chọn feature theo tương quan với nhãn, mã hoá category theo trung bình của nhãn) rò rỉ có thể làm điểm tăng giả tạo rất nhiều. Dữ liệu nhỏ hoặc có outlier cũng làm scaler rò rỉ mạnh hơn. Vì vậy quy tắc phải thành phản xạ: **mọi thứ "học từ dữ liệu" chỉ được học từ train.**

### 7. Ba cách dễ phạm lỗi

1. **`fit_transform` trên toàn bộ `x` rồi mới chia.** Lỗi phổ biến nhất. Cách tránh: chia trước, `fit` sau.
2. **`scaler.fit_transform(x_test)`.** Code chạy không báo gì nhưng test bị đo bằng thước của chính nó (mean ra đúng 0).
3. **Chạy lại ô scale hai lần khi ghi đè `x_train`.** Dữ liệu bị chuẩn hoá hai lần mà không báo lỗi. Đó là lý do bài dùng tên mới `x_train_s`.

Pipeline giải quyết cả ba: `pipe.fit(x_train, y_train)` tự `fit` scaler chỉ trên train, `pipe.predict(x_test)` tự `transform` test.
:::

Kiểm tra xem scaler đã sửa vấn đề ban đầu chưa:

```python
scaled = distance_share(x_train_s)
print(pd.DataFrame({"gốc": raw, "sau scale": scaled}, index=x.columns).round(3))
```

:::out
```text
                            gốc  sau scale
Pregnancies               0.006      0.134
Glucose                   0.200      0.130
BloodPressure             0.085      0.108
SkinThickness             0.072      0.144
Insulin                   0.566      0.108
BMI                       0.023      0.128
DiabetesPedigreeFunction  0.000      0.125
Age                       0.047      0.123
```
:::

![Mỗi cột đóng góp bao nhiêu vào khoảng cách](/plots/practice/distance-light.png)
![Mỗi cột đóng góp bao nhiêu vào khoảng cách](/plots/practice/distance-dark.png)

Sau khi scale, tám cột đóng góp gần ngang nhau (khoảng 11% đến 14%, so với 12.5% nếu hoàn toàn công bằng). Lưu ý ta đặt tên mới `x_train_s` thay vì ghi đè `x_train`: nếu lỡ chạy lại ô scale hai lần trong Console, dữ liệu sẽ bị chuẩn hoá hai lần mà không báo lỗi.

:::ex Tự tính z bằng tay
Lấy Glucose của bệnh nhân đầu tiên trong `x_train`, dùng `scaler.mean_` và `scaler.scale_` để tính z, rồi so với `x_train_s`.
@answer
```python
g = x_train["Glucose"].iloc[0]
z = (g - scaler.mean_[1]) / scaler.scale_[1]     # cột Glucose là cột số 1
print(round(z, 3), round(x_train_s[0, 1], 3))
```
Hai số bằng nhau. `mean_` và `scale_` chính là "số đo" mà `fit` đã lưu lại.
:::

:::ex Đồng nghiệp scale cả bộ rồi mới chia
Đồng nghiệp chạy `fit_transform` trên toàn bộ `x` rồi mới chia train/test. Điểm test chỉ khác vài phần nghìn. Vậy có sao không?
@answer
Có. Con số gần nhau không làm cho quy trình đúng. Trung bình và độ lệch chuẩn đã tính cả hàng test, nên bộ test không còn là "bệnh nhân chưa từng gặp". Với bộ dữ liệu nhỏ hoặc có giá trị cực đoan, chênh lệch có thể lớn hơn nhiều. Cách làm đúng là chia trước, `fit` trên train. Bước 6 sẽ giới thiệu Pipeline để không thể làm sai.
:::

:::more Khi nào dùng MinMaxScaler, và một lưu ý về kiểu dữ liệu
- MinMaxScaler đưa mỗi cột về [0, 1] bằng min và max. Một giá trị cực đoan sẽ nén phần còn lại. StandardScaler ít nhạy hơn nhưng **cả hai** vẫn bị outlier ảnh hưởng; muốn bền hơn thì xem RobustScaler.
- Sau `transform`, kết quả là mảng NumPy: mất tên cột và index. `y_train`, `y_test` vẫn là Series.
- Cây quyết định và Random Forest không cần scale; Bước 8 sẽ chứng minh điều này bằng thí nghiệm.
:::

:::recap
- Mô hình dùng khoảng cách hoặc trọng số bị cột có số lớn lấn át: Insulin chiếm 56.6% khoảng cách, DPF gần 0%.
- StandardScaler đổi mọi cột về cùng thước (trung bình 0, độ lệch chuẩn 1).
- `fit` là đo, `transform` là cắt. Chỉ đo trên train, vì test đóng vai dữ liệu mới chưa từng gặp.
:::

## Bước 4 — Huấn luyện, dự đoán, và xem mô hình học được gì

:::ask
Sau khi học từ 614 người, mô hình thật sự giữ lại cái gì trong đầu?
:::

Ta dùng Logistic Regression: mô hình đơn giản, và (khác với đa số mô hình) mở ra được để nhìn bên trong.

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

model = LogisticRegression()
model.fit(x_train_s, y_train)              # HỌC: tìm trọng số từ train
y_predict = model.predict(x_test_s)        # DỰ ĐOÁN trên bộ test chưa từng thấy

print("Accuracy:", round(accuracy_score(y_test, y_predict), 4))
print("Đoán toàn 0:", round((y_test == 0).mean(), 4))
```

:::out
```text
Accuracy: 0.7532
Đoán toàn 0: 0.6429
```
:::

Lưu ý `fit` của mô hình khác `fit` của scaler: scaler học "số đo", mô hình học "mối quan hệ giữa các cột và đáp án". Kết quả 75.3% so với mức sàn 64.3% trên bộ test (đoán toàn 0): hơn khoảng 11 điểm. Khá, chưa đáng kinh ngạc.

Mô hình giữ lại gì? Logistic Regression giữ một **trọng số cho mỗi cột**:

```python
weights = pd.Series(model.coef_[0], index=x.columns).sort_values(ascending=False)
print(weights.round(3))
print("intercept:", model.intercept_.round(3))
```

:::out
```text
Glucose                     1.071
BMI                         0.778
Age                         0.421
DiabetesPedigreeFunction    0.231
Pregnancies                 0.213
SkinThickness               0.046
Insulin                    -0.201
BloodPressure              -0.248
dtype: float64
intercept: [-0.886]
```
:::

![Trọng số của mô hình](/plots/practice/weights-light.png)
![Trọng số của mô hình](/plots/practice/weights-dark.png)

Trọng số dương đẩy về "có bệnh", trọng số âm đẩy về "không bệnh". Glucose có trọng số lớn nhất, khớp với những gì ta thấy ở biểu đồ Bước 1. (Vì các cột đã được chuẩn hoá nên so sánh độ lớn trọng số mới có nghĩa. Đừng đọc trọng số âm nhỏ của Insulin hay BloodPressure như "insulin cao thì ít bệnh hơn": khi nhiều cột liên quan nhau, trọng số chỉ cho biết phần đóng góp riêng của từng cột, không phải quan hệ nhân quả.)

Từ đó mô hình tính một bệnh nhân theo hai bước: cộng có trọng số, rồi ép vào khoảng 0 đến 1 bằng hàm sigmoid.

> z = intercept + w1·x1 + w2·x2 + … &nbsp; rồi &nbsp; p = 1 / (1 + e^(−z))

Làm bằng tay với bệnh nhân đầu tiên của bộ test, rồi so với kết quả của sklearn:

```python
row = x_test_s[0]
z = row @ model.coef_[0] + model.intercept_[0]
p = 1 / (1 + np.exp(-z))
print(round(z, 3), round(p, 3))
print(model.predict_proba(x_test_s[:1])[0].round(3), "nhãn thật:", y_test.iloc[0])
```

:::out
```text
-0.958 0.277
[0.723 0.277] nhãn thật: 0
```
:::

Xác suất bị bệnh là 0.277. Dưới ngưỡng 0.5 nên mô hình đoán 0, và đáp án thật đúng là 0. Vậy `predict` chỉ là "tính p, rồi so với 0.5". Điều này quan trọng: ở Bước 5 ta sẽ thay ngưỡng 0.5 bằng ngưỡng khác.

:::ex Người mà mô hình tự tin nhất
Dùng `predict_proba`, tìm ba bệnh nhân test mà mô hình tin nhất là "có bệnh". Cả ba có thật sự bệnh không?
@answer
```python
proba = model.predict_proba(x_test_s)[:, 1]
top = np.argsort(-proba)[:3]
print(top, proba[top].round(3), y_test.iloc[top].tolist())
```
Ba xác suất 0.969, 0.965, 0.956 và nhãn thật `[1, 1, 0]`: người thứ ba bị đoán bệnh với độ tự tin 95.6% nhưng thật ra không bệnh. Mô hình tự tin không có nghĩa là đúng.
:::

:::recap
- `fit` của mô hình học trọng số; `predict` chỉ là tính xác suất rồi so với 0.5.
- Accuracy 75.3% so với mức sàn 64.3%: có học được, nhưng chưa nhiều.
- Mô hình tuyến tính đọc được: Glucose là cột nặng nhất.
:::

## Tổng kết Phần A

Bạn vừa đi qua một đường ống hoàn chỉnh. Mỗi bước tồn tại vì một thứ sẽ hỏng nếu thiếu nó:

| Bước | Nếu bỏ qua thì |
|---|---|
| Nhìn dữ liệu | Không biết mức sàn 65.1%, không thấy số 0 vô lý |
| Cất bộ test | Điểm 100% trên dữ liệu đã học, không biết mô hình có hiểu bài |
| `random_state` | Mỗi lần chạy một đề thi khác, so sánh vô nghĩa |
| Scale (fit trên train) | Cột số lớn lấn át cột số nhỏ; hoặc điểm lạc quan vì rò rỉ |
| Đọc trọng số | Mô hình là hộp đen |

Bộ code hoàn chỉnh, để bạn gõ lại không nhìn:

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

scaler = StandardScaler().fit(x_train)
x_train_s = scaler.transform(x_train)
x_test_s = scaler.transform(x_test)

model = LogisticRegression().fit(x_train_s, y_train)
y_predict = model.predict(x_test_s)
print("Accuracy:", round(accuracy_score(y_test, y_predict), 4))
```

:::out
```text
Accuracy: 0.7532
```
:::

:::check
- Tôi nói được vì sao mức sàn của bài này là 65.1% và vì sao phải vượt nó.
- Tôi giải thích được vì sao điểm trên dữ liệu đã học không đáng tin.
- Tôi giải thích được vì sao cố định `random_state`, và vì sao đừng chọn seed theo điểm.
- Tôi nói được vì sao scaler chỉ `fit` trên train, bằng ví dụ bệnh nhân mới đến sau.
- Tôi tính được xác suất của một bệnh nhân từ trọng số và sigmoid.
- Tôi gõ lại được cả đoạn code trên mà không nhìn.
:::

:::quiz
@tier A | Kiểm tra đã hiểu
Q: Với 768 mẫu và `test_size=0.2`, train và test có bao nhiêu mẫu? Muốn 60/20/20 thì lần chia thứ hai dùng `test_size` bao nhiêu?
A: **614 train, 154 test; lần hai dùng 0.25.** 20% × 768 = 153.6, làm tròn thành 154. Phần train 80% chia tiếp 25% thành validation: 0.25 × 80% = 20% tổng, còn lại 60%.
Q: Sau khi scale, mean của `x_test_s` ở cột đầu là 0.15 chứ không phải 0. Có lỗi không?
A: **Không, đó là điều đúng.** Test được biến đổi bằng mean và std của train. Ép nó về 0 bằng cách fit lại trên test là rò rỉ dữ liệu.
Q: Một cây quyết định đạt 100% trên train và 74.7% trên test. Điều đó nói lên gì?
A: **Mô hình học vẹt (overfitting).** Điểm train không đo khả năng tổng quát hoá; chỉ điểm trên dữ liệu chưa thấy mới đo được.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Why do we fit the scaler only on the training set?
A: **Để thông tin của test không lọt vào bước tiền xử lý.** Khi triển khai thật, dữ liệu mới chưa tồn tại lúc ta tính mean và std. Fit cả test làm điểm đánh giá lạc quan hơn thực tế.
EN: Fitting preprocessing on all data leaks test information into training and makes the evaluation optimistic. Fit on train only, then transform validation and test data.
Q: **B2.** What does `random_state` do in `train_test_split`?
A: **Cố định cách xáo để lần chia lặp lại được.** Cùng dữ liệu và cùng seed thì cùng train/test, nhờ đó so sánh hai cách làm là công bằng. Nó không liên quan tới seed của mô hình.
EN: It seeds the shuffling so the split is reproducible, which makes experiments comparable across runs.
Q: **B3.** What is data leakage? Give an example.
A: **Thông tin không có lúc dự đoán thật lại lọt vào quá trình học.** Ví dụ: để cột `Outcome` trong `x`, hoặc fit scaler trên cả bộ dữ liệu trước khi chia.
EN: Leakage is when information unavailable at prediction time influences training, such as keeping the target in the features or fitting a scaler on test data.
@tier C | Tình huống
Q: Sếp hỏi: "Hôm qua mô hình đạt 80%, hôm nay đổi cách xử lý còn 78%. Cách mới tệ hơn à?" Bạn kiểm tra gì đầu tiên?
A: **Kiểm tra bộ test có cố định không.** Nếu không, hai con số đo trên hai đề khác nhau và chưa kết luận được. Sau khi cố định, một lần chia vẫn dao động nhiều (cây ở Bước 2 dao động 11 điểm); cần cross-validation để chắc hơn.
WANT: Biết cố định split, so sánh cùng điều kiện, nhắc tới độ dao động giữa các lần chia.
Q: Đồng nghiệp scale toàn bộ dữ liệu rồi mới chia train/test và báo accuracy rất cao. Bạn giải thích rủi ro thế nào?
A: **Đó là rò rỉ trong tiền xử lý.** Mean và std đã bao gồm hàng test nên điểm có thể lạc quan. Làm lại: chia trước, `fit` scaler trên train, `transform` test, hoặc dùng Pipeline để không thể làm sai.
WANT: Nêu đúng thứ tự chia, fit trên train, transform test; nhắc Pipeline.
:::

:::ask
Accuracy 75.3% có thật sự tốt không? Mô hình sai theo kiểu nào, và con số này đáng tin tới đâu? Phần B trả lời.
:::
