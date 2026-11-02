---
title: Step 3.3 — Feature scaling với MinMaxScaler và StandardScaler
order: 18
description: Vì sao phải đưa các feature số về cùng thang đo, công thức MinMaxScaler và StandardScaler đọc từ code slide 47, cách tính lại từng con số output, và quy tắc fit trên train rồi mới transform test.
---

## 1. Ý tưởng

Thử so sánh hai bệnh nhân bằng "khoảng cách" giữa họ:

| | Insulin | DiabetesPedigreeFunction |
|---|---|---|
| Bệnh nhân A | 100 | 0.2 |
| Bệnh nhân B | 110 | 1.2 |

Về y học, chênh lệch DPF 0.2 → 1.2 (từ tiền sử gia đình nhẹ lên rất nặng)
quan trọng hơn nhiều so với Insulin 100 → 110. Nhưng về **con số**, Insulin
chênh 10 còn DPF chỉ chênh 1 — mọi phép tính dựa trên khoảng cách sẽ coi
Insulin quan trọng gấp 10 lần. Lý do duy nhất là **đơn vị đo**: Insulin
tính bằng μU/ml với giá trị vài trăm, DPF là điểm số quanh 0–2.

**Feature scaling** (chuẩn hóa thang đo) đưa mọi feature số về **cùng một
thang** để không cột nào "lấn át" cột nào chỉ vì đơn vị của nó. Đây là phần
đầu của bước **03 Data Transformation** (slide 45), slide 47 gọi là
*"Tiền xử lý numerical features"* và giới thiệu hai công cụ của
scikit-learn: **MinMaxScaler** và **StandardScaler**.

> **EN:** Compare two patients by distance: Insulin 100 vs 110, DPF 0.2
> vs 1.2. Medically the DPF jump matters far more, but numerically
> Insulin differs by 10 and DPF by 1, so any distance-based computation
> treats Insulin as 10× more important — purely because of its unit.
> **Feature scaling** puts all numeric features on a **common scale** so
> no column dominates because of its unit. It's the first part of step
> **03 Data Transformation** (slide 45); slide 47 ("preprocessing
> numerical features") introduces scikit-learn's **MinMaxScaler** and
> **StandardScaler**.

## 2. Vị trí trong pipeline

```
3.1 Missing → 3.2 Outliers → [ 3.3 Transformation: Scaling (bài này) + Encoding (bài 19) ] → 3.4 Correlation → 3.5 Balance
```

- **Sau** khi xử lý thiếu và outlier (bài 17): MinMaxScaler dùng min và max,
  StandardScaler dùng mean và std — đều bị số 0 vô lý và outlier kéo lệch.
  Làm sạch trước rồi mới scale.
- Bài 16 đã chỉ ra Diabetes dataset có thang đo rất khác nhau: DPF trong
  0.078–2.42, Insulin 0–846, Glucose 0–199.
- Quy tắc **fit trên train, transform trên validation/test** (bài 07) áp
  dụng đúng nghĩa đen ở đây: `scaler.fit(X_train)` rồi
  `scaler.transform(X_test)`.

> **EN:** Scaling comes **after** handling missing values and outliers
> (lesson 17), because min/max and mean/std are distorted by them. Lesson
> 16 showed very different ranges (DPF 0.078–2.42, Insulin 0–846). The
> rule from lesson 07 applies literally: `fit` on the training set,
> `transform` validation/test.

## 3. Công thức / cách hoạt động

### 3.1. Code trên slide 47

Hai đoạn code giống hệt nhau, chỉ khác scaler. Viết lại:

```python
from pandas import read_csv
from sklearn.preprocessing import MinMaxScaler      # hoặc StandardScaler

data = read_csv("diabetes.csv")
scaler = MinMaxScaler(feature_range=(0, 1))          # hoặc StandardScaler()
before = data[["Pregnancies"]].values
after = scaler.fit_transform(data[["Pregnancies"]])
for b, a in zip(before, after):
    print("Before: {}. After: {}".format(b, a))
```

Từng dòng:

- `data[["Pregnancies"]]` — **hai** cặp ngoặc vuông để lấy ra một
  DataFrame **2 chiều** (768 dòng × 1 cột). scikit-learn luôn đòi đầu vào
  dạng bảng 2 chiều (n mẫu × n feature); một cặp ngoặc `data["Pregnancies"]`
  chỉ cho Series 1 chiều và sẽ báo lỗi.
- `.values` — chuyển sang mảng NumPy, nên output in ra dạng `[6]` (một
  dòng có một phần tử).
- `fit_transform` = `fit` (**học** các thông số: min, max hoặc mean, std)
  + `transform` (**áp** công thức lên dữ liệu) trong một lệnh.
- `zip(before, after)` — đi song song hai mảng để in từng cặp trước/sau.

Output (10 dòng đầu, chép từ ảnh slide — khớp khi chạy lại):

| Before | MinMaxScaler | StandardScaler |
|---|---|---|
| 6 | 0.35294118 | 0.63994726 |
| 1 | 0.05882353 | −0.84488505 |
| 8 | 0.47058824 | 1.23388019 |
| 1 | 0.05882353 | −0.84488505 |
| 0 | 0. | −1.14185152 |
| 5 | 0.29411765 | 0.3429808 |
| 3 | 0.17647059 | −0.25095213 |
| 10 | 0.58823529 | 1.82781311 |
| 2 | 0.11764706 | −0.54791859 |
| 8 | 0.47058824 | 1.23388019 |

Nhận xét đầu tiên: cả hai đều giữ **thứ tự** (8 vẫn lớn hơn 6) và **cùng
giá trị cho ra cùng kết quả** (hai số 1 → cùng 0.0588). Scaling chỉ **đổi
thang**, không đổi hình dạng phân bố.

> **EN:** Slide 47's two snippets differ only in the scaler.
> `data[["Pregnancies"]]` (double brackets) yields a **2-D** DataFrame —
> scikit-learn always expects (n_samples × n_features); `.values` makes a
> NumPy array, hence outputs like `[6]`. `fit_transform` = `fit` (learn
> min/max or mean/std) + `transform` (apply the formula). The output table
> (first 10 rows, copied from the slide and reproduced exactly) shows both
> scalers preserve **order** and map equal inputs to equal outputs —
> scaling changes the scale, not the shape of the distribution.

### 3.2. MinMaxScaler — đưa về khoảng [0, 1]

```
x' = (x − min) / (max − min)
```

- Giá trị nhỏ nhất → 0, lớn nhất → 1, các giá trị khác nằm theo **tỉ lệ**
  giữa hai đầu.
- Tham số `feature_range=(0, 1)` trên slide là mặc định. Muốn khoảng khác
  [a, b] thì scikit-learn tính tiếp: `x'' = x' × (b − a) + a` *(bổ sung)*.
- Với cột Pregnancies: min = 0, max = 17 → `x' = x / 17`. Ví dụ 6 / 17 =
  **0.35294118** — đúng dòng đầu tiên của slide.

Ưu: dễ hiểu, giữ nguyên số 0 nếu min = 0, kết quả bị chặn trong [0, 1] —
hợp với dữ liệu cần khoảng cố định (cường độ pixel ảnh 0–255 → 0–1, đầu
vào mạng nơ-ron). Nhược: **rất nhạy với outlier** — chỉ một giá trị max
khổng lồ là toàn bộ các giá trị khác bị ép vào một khoảng hẹp gần 0.

> **EN:** **MinMaxScaler**: x' = (x − min)/(max − min); min → 0, max → 1,
> everything else proportionally in between. `feature_range=(0, 1)` is the
> default (*supplementary*: other ranges via x'' = x'·(b − a) + a). For
> Pregnancies (min 0, max 17), x' = x/17, e.g. 6/17 = 0.35294118 — the
> slide's first row. Pros: intuitive, bounded — good for pixel
> intensities or neural-net inputs. Cons: **very outlier-sensitive** — one
> huge max squeezes all other values near 0.

### 3.3. StandardScaler — đưa về mean 0, std 1

```
z = (x − μ) / σ
```

- μ (mean) và σ (độ lệch chuẩn) của cột, **học từ dữ liệu fit**.
- Kết quả gọi là **z-score** (đã gặp ở bài 17 khi phát hiện outlier): giá
  trị cách trung bình bao nhiêu lần độ lệch chuẩn. Sau khi scale, cột có
  mean = 0 và std = 1; giá trị âm = dưới trung bình, dương = trên trung
  bình.
- Không bị chặn: phần lớn giá trị nằm khoảng −3 đến 3 nhưng có thể vượt.
- Với Pregnancies: μ = 3.84505, σ = 3.36738 → z(6) = (6 − 3.84505) /
  3.36738 ≈ **0.63995** — đúng dòng đầu slide.

**Chi tiết dễ nhầm** *(bổ sung — nhận xét của Claude)*: `StandardScaler`
tính σ bằng cách **chia cho n** (độ lệch chuẩn tổng thể, `ddof=0`), còn
pandas `describe()` / `.std()` ở bài 16 **chia cho n − 1** (độ lệch chuẩn
mẫu). Vì vậy bài 16 ghi std Pregnancies = 3.3696, còn StandardScaler dùng
3.3674. Nếu tự tính z bằng `data.std()` của pandas sẽ lệch chút ít so với
output slide. P19 sẽ giải thích vì sao có hai cách chia.

> **EN:** **StandardScaler**: z = (x − μ)/σ with μ, σ learned at fit
> time. The result is the **z-score** (seen in lesson 17): mean 0, std 1;
> negative = below average. Unbounded — mostly within ±3. For Pregnancies
> μ = 3.84505, σ = 3.36738 → z(6) ≈ 0.63995, the slide's first row.
> *(Supplementary — Claude's note)* StandardScaler's σ divides by **n**
> (`ddof=0`), while pandas `.std()`/`describe()` divides by **n − 1** —
> 3.3674 vs 3.3696 for Pregnancies; computing z with pandas' std won't
> match the slide exactly. P19 explains the two conventions.

### 3.4. So sánh và chọn scaler

| | MinMaxScaler | StandardScaler | RobustScaler *(bổ sung)* |
|---|---|---|---|
| Công thức | (x − min)/(max − min) | (x − mean)/std | (x − median)/IQR |
| Khoảng kết quả | [0, 1] (trên dữ liệu fit) | Không chặn, quanh 0 | Không chặn, quanh 0 |
| Học thông số gì | min, max | mean, std | median, Q1, Q3 |
| Bị outlier ảnh hưởng | **Rất mạnh** | Vừa | **Ít** |
| Dùng khi | Cần khoảng cố định; dữ liệu không có outlier | Mặc định phổ biến; dữ liệu gần chuẩn | Có nhiều outlier thật muốn giữ lại (bài 17) |

Quy tắc chọn nhanh: không biết chọn gì → **StandardScaler**; dữ liệu có
outlier mà không muốn xóa → **RobustScaler**; cần đúng khoảng [0, 1] →
**MinMaxScaler**.

> **EN:** MinMax: [0, 1], learns min/max, most outlier-sensitive.
> Standard: unbounded around 0, learns mean/std, moderately sensitive —
> the usual default. *(Supplementary)* **RobustScaler**: (x − median)/IQR,
> barely affected by outliers — use it when you keep genuine outliers.

### 3.5. Model nào cần scaling? *(Bổ sung)*

| Cần scaling | Vì sao | Không cần | Vì sao |
|---|---|---|---|
| KNN, K-Means (P07, P08) | Dựa trực tiếp vào khoảng cách | Decision Tree, Random Forest (P07) | Mỗi lần chỉ so một feature với một ngưỡng: "Glucose > 127?" — đổi thang không đổi thứ tự nên không đổi kết quả |
| SVM (P06) | Dựa vào khoảng cách tới hyperplane | Naive Bayes | Xét từng feature riêng |
| Logistic / Linear Regression có regularization (P12) | Phạt độ lớn hệ số — feature có thang nhỏ cần hệ số lớn sẽ bị phạt oan | | |
| PCA (P14) | Tìm hướng có phương sai lớn — cột thang lớn có phương sai lớn "giả" | | |
| Mạng nơ-ron, mọi thứ dùng gradient descent | Hội tụ nhanh và ổn định hơn | | |

Ngoài ra scaling còn giúp **so sánh hệ số**: sau StandardScaler, hệ số của
Logistic Regression cho biết "tăng 1 độ lệch chuẩn của feature này thì
log-odds thay đổi bao nhiêu" — so được giữa các feature.

**Không scale label** trong bài toán Classification (Outcome 0/1 là tên
class). Với Regression, scale target là tùy chọn và phải đổi ngược lại khi
báo kết quả.

> **EN:** *(Supplementary)* Scaling matters for distance-based models
> (KNN, K-Means), SVM, regularized linear/logistic models (penalties hit
> coefficients of small-scale features unfairly), PCA (large-scale
> columns have spuriously large variance) and anything trained by
> gradient descent. Tree models and Naive Bayes don't need it — a split
> "Glucose > 127?" is unchanged by rescaling. Standardized coefficients
> become comparable. Don't scale a classification label.

### 3.6. Fit trên train, transform trên test *(Bổ sung — slide fit trên toàn bộ dataset để minh họa)*

Code slide 47 gọi `fit_transform` trên **toàn bộ** 768 dòng — chấp nhận
được khi chỉ để xem scaler làm gì. Khi làm model thật thì phải:

```python
scaler.fit(X_train)                   # học min/max hoặc mean/std CHỈ từ train
X_train_s = scaler.transform(X_train)
X_test_s = scaler.transform(X_test)   # dùng lại thông số của train, KHÔNG fit lại
```

Vì sao? Tập test đóng vai "bệnh nhân tương lai" chưa từng thấy. Nếu min,
max, mean, std tính cả từ test thì thông tin của test đã lọt vào quá trình
chuẩn bị dữ liệu (**data leakage**) — điểm đánh giá sẽ lạc quan hơn thực tế.
Hai lỗi hay gặp:

- `scaler.fit_transform(X_test)` — fit lại trên test → test được scale theo
  thang của **chính nó**, không cùng thang với train mà model đã học.
- Scale toàn bộ dataset rồi mới `train_test_split`.

Hệ quả bình thường của cách làm đúng: dữ liệu test sau MinMaxScaler **có
thể ra ngoài [0, 1]**. Ví dụ thật trên Diabetes dataset (chia 80/20,
`stratify=y`, `random_state=42`): Insulin lớn nhất trong train là 744,
nhưng tập test có một bệnh nhân Insulin 846 → 846 / 744 ≈ **1.137**. Đây
không phải lỗi; nó chỉ nói bệnh nhân này vượt ngoài những gì đã thấy khi
huấn luyện. (Muốn ép về đúng khoảng thì dùng `MinMaxScaler(clip=True)`.)

> **EN:** *(Supplementary — slide 47 fits on the whole dataset for
> illustration)* For real models: `fit` on the training set, `transform`
> both sets with the same parameters. Fitting on test data leaks
> information and inflates scores. Common mistakes: `fit_transform` on the
> test set (different scale from training), or scaling before splitting.
> A correct side effect: scaled test values can fall **outside [0, 1]** —
> on Diabetes (80/20 split, `stratify=y`, `random_state=42`) the training
> Insulin max is 744 but a test patient has 846 → 846/744 ≈ 1.137. Not a
> bug; `MinMaxScaler(clip=True)` forces the range if needed.

## 4. Ví dụ tay

### 4.1. Tính lại output của slide 47

Cột Pregnancies trên toàn bộ 768 dòng: **min = 0, max = 17**, **μ =
3.845052**, **σ (chia n) = 3.367384**.

| x | MinMax: x / 17 | Standard: (x − 3.845052) / 3.367384 |
|---|---|---|
| 0 | 0 / 17 = **0** | −3.845052 / 3.367384 = **−1.1419** |
| 1 | 1 / 17 = **0.0588** | −2.845052 / 3.367384 = **−0.8449** |
| 3 | 3 / 17 = **0.1765** | −0.845052 / 3.367384 = **−0.2510** |
| 6 | 6 / 17 = **0.3529** | 2.154948 / 3.367384 = **0.6399** |
| 10 | 10 / 17 = **0.5882** | 6.154948 / 3.367384 = **1.8278** |

Khớp từng số với ảnh slide. Nếu dùng σ của pandas (3.369578, chia n − 1)
thì z(6) = 0.6395 — lệch ở chữ số thứ tư.

### 4.2. Một dãy nhỏ tính trọn vẹn

Tập train gồm 5 giá trị: **2, 4, 4, 5, 10** (dãy ở Câu 5 bài 16).

**MinMaxScaler:** min = 2, max = 10, max − min = 8

| x | (x − 2) / 8 |
|---|---|
| 2 | **0** |
| 4 | **0.25** |
| 4 | **0.25** |
| 5 | **0.375** |
| 10 | **1** |

**StandardScaler:** μ = 25 / 5 = 5; Σ(x − μ)² = 9 + 1 + 1 + 0 + 25 = 36 →
σ (chia n) = √(36 / 5) = √7.2 ≈ **2.6833**

| x | (x − 5) / 2.6833 |
|---|---|
| 2 | −3 / 2.6833 = **−1.1180** |
| 4 | −1 / 2.6833 = **−0.3727** |
| 4 | **−0.3727** |
| 5 | **0** |
| 10 | 5 / 2.6833 = **1.8634** |

Kiểm tra: tổng các z = −1.1180 − 0.3727 − 0.3727 + 0 + 1.8634 = 0 → mean
= 0 ✓.

**RobustScaler** *(bổ sung)*: median = 4; Q1 = 4, Q3 = 5 (vị trí 1 và 3)
→ IQR = 1 → (x − 4) / 1: **−2, 0, 0, 1, 6**. Giá trị 10 vẫn nổi bật rõ
(6), không làm co các điểm khác lại.

Nhìn lại MinMax: chỉ vì số 10, bốn điểm còn lại bị dồn vào [0, 0.375] —
minh họa "MinMax nhạy với outlier".

**Một giá trị mới ở tập test: x = 12** (dùng thông số của train, không fit
lại):

- MinMax: (12 − 2) / 8 = **1.25** → vượt khỏi [0, 1], hoàn toàn bình
  thường.
- Standard: (12 − 5) / 2.6833 ≈ **2.6087**.

Nếu ai đó lỡ fit lại trên tập test chỉ có một giá trị 12 thì max − min = 0
→ phép chia cho 0 (scikit-learn sẽ trả về 0) — một minh họa vui cho việc vì
sao **không được fit trên test**.

> **EN:** **4.1** Pregnancies: min 0, max 17, μ = 3.845052, σ (÷n) =
> 3.367384 → 0 → 0 / −1.1419, 1 → 0.0588 / −0.8449, 3 → 0.1765 / −0.2510,
> 6 → 0.3529 / 0.6399, 10 → 0.5882 / 1.8278 — matching the slide; pandas'
> σ (÷n−1) would give 0.6395 for x = 6. **4.2** Training values 2, 4, 4,
> 5, 10: MinMax → 0, 0.25, 0.25, 0.375, 1; Standard (μ 5, σ = √7.2 ≈
> 2.6833) → −1.1180, −0.3727, −0.3727, 0, 1.8634 (sums to 0);
> *(supplementary)* Robust (median 4, IQR 1) → −2, 0, 0, 1, 6. A new test
> value 12 with training parameters: MinMax 1.25 (outside [0, 1] — fine),
> Standard ≈ 2.6087. Refitting on a one-value test set would divide by
> zero — why we never fit on test data.

## 5. Code

### 5.1. Chạy lại code slide 47

```python
from pandas import read_csv
from sklearn.preprocessing import MinMaxScaler, StandardScaler

data = read_csv("diabetes.csv")
before = data[["Pregnancies"]].values

for scaler in [MinMaxScaler(feature_range=(0, 1)), StandardScaler()]:
    after = scaler.fit_transform(data[["Pregnancies"]])
    print(type(scaler).__name__)
    for b, a in list(zip(before, after))[:10]:      # 10 dòng đầu như slide
        print("Before: {}. After: {}".format(b, a))

# Thông số scaler đã học
mm = MinMaxScaler().fit(data[["Pregnancies"]])
ss = StandardScaler().fit(data[["Pregnancies"]])
print(mm.data_min_, mm.data_max_)          # [0.] [17.]
print(ss.mean_, ss.scale_)                 # [3.84505208] [3.36738361]
print(data["Pregnancies"].std())           # 3.3695780626988694 (pandas chia n-1)
```

### 5.2. Kiểm tra ví dụ tay *(bổ sung)*

```python
import numpy as np
from sklearn.preprocessing import RobustScaler

a = np.array([[2], [4], [4], [5], [10]], dtype=float)
print(MinMaxScaler().fit_transform(a).ravel())     # [0. 0.25 0.25 0.375 1.]
print(StandardScaler().fit_transform(a).ravel())   # [-1.118 -0.3727 -0.3727 0. 1.8634]
print(RobustScaler().fit_transform(a).ravel())     # [-2. 0. 0. 1. 6.]

new = np.array([[12.0]])
print(MinMaxScaler().fit(a).transform(new))        # [[1.25]]
print(StandardScaler().fit(a).transform(new))      # [[2.6087]]
```

### 5.3. Cách làm đúng trên Diabetes: fit trên train *(bổ sung)*

```python
import pandas as pd
from sklearn.model_selection import train_test_split

X = data.drop(columns="Outcome")
y = data["Outcome"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

mm = MinMaxScaler().fit(X_train)                   # học min/max từ train
X_test_mm = pd.DataFrame(mm.transform(X_test), columns=X.columns)
print(X_train["Insulin"].max(), X_test["Insulin"].max())   # 744 846
print(X_test_mm.max().round(3).to_dict())          # Insulin 1.137, DPF 1.041 (> 1, bình thường)

ss = StandardScaler().fit(X_train)                 # học mean/std từ train
X_train_ss = ss.transform(X_train)
X_test_ss = ss.transform(X_test)
print(X_train_ss.mean(axis=0).round(6))            # ~0 trên train
print(X_train_ss.std(axis=0).round(6))             # 1 trên train
print(X_test_ss.mean(axis=0).round(3))             # gần 0 nhưng không đúng 0 trên test
```

### 5.4. Gói vào Pipeline *(bổ sung — nối bài 15)*

`Pipeline` đảm bảo không bao giờ quên quy tắc fit-trên-train, kể cả khi
dùng cross-validation (bài 08): mỗi fold, scaler được fit lại chỉ trên
phần train của fold đó.

```python
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
Xc = X.copy()
Xc[zero_cols] = Xc[zero_cols].replace(0, np.nan)   # bài 17

model = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, Xc, y, cv=cv, scoring="f1")
print(scores.round(3), scores.mean().round(3))   # [0.639 0.652 0.638 0.596 0.654] 0.636
```

> **EN:** 5.1 reruns slide 47 and prints the learned parameters
> (`data_min_`, `data_max_`, `mean_`, `scale_`) next to pandas' n − 1 std.
> 5.2 checks the hand example. *(Supplementary)* 5.3 fits scalers on the
> training set only — the test Insulin maximum 846 maps to 1.137 under
> MinMax, and test means are near but not exactly 0. 5.4 wraps
> imputation, scaling and the model in a `Pipeline` so cross-validation
> refits the scaler on each training fold.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Vì sao code slide 47 viết `data[["Pregnancies"]]` (hai cặp
ngoặc) chứ không phải `data["Pregnancies"]`?
> **Đáp án:** Hai cặp ngoặc trả về DataFrame **2 chiều** (768 × 1);
> scikit-learn yêu cầu đầu vào dạng (số mẫu × số feature). Một cặp ngoặc
> trả về Series 1 chiều và scaler sẽ báo lỗi.

**Câu 2:** Cột Glucose (sau khi bỏ số 0) có min = 44, max = 199. Tính giá
trị MinMaxScaler của Glucose = 120.
> **Đáp án:** (120 − 44) / (199 − 44) = 76 / 155 ≈ **0.4903**.

**Câu 3:** Một cột có mean = 50, std (chia n) = 8. Giá trị 70 và 38 sau
StandardScaler là bao nhiêu? Đọc ý nghĩa.
> **Đáp án:** z(70) = 20 / 8 = **2.5** (cao hơn trung bình 2.5 độ lệch
> chuẩn); z(38) = −12 / 8 = **−1.5** (thấp hơn trung bình 1.5 độ lệch
> chuẩn).

**Câu 4:** Bạn tự tính z cho Pregnancies = 6 bằng `data["Pregnancies"].std()`
và được 0.6395, khác slide (0.6399). Ai sai?
> **Đáp án:** Không ai sai. pandas `.std()` chia **n − 1** (3.3696), còn
> `StandardScaler` chia **n** (3.3674). Muốn khớp thì dùng
> `.std(ddof=0)`.

**Câu 5:** Sau khi fit MinMaxScaler trên train, một giá trị ở tập test ra
1.137. Có phải lỗi không? Có nên fit lại trên test để nó về ≤ 1 không?
> **Đáp án:** Không phải lỗi — giá trị test lớn hơn max của train (Insulin
> 846 > 744). **Không** được fit lại trên test: như vậy test sẽ ở thang
> khác với train mà model đã học, và là data leakage. Nếu cần chặn khoảng
> thì dùng `clip=True`.

**Câu 6:** Model nào sau đây **không** cần scaling: KNN, SVM, Random
Forest, Logistic Regression có regularization? Vì sao?
> **Đáp án:** **Random Forest** — mỗi nút chỉ so một feature với một
> ngưỡng; đổi thang giữ nguyên thứ tự nên cách chia không đổi. KNN và SVM
> dựa vào khoảng cách; Logistic Regression có regularization phạt độ lớn
> hệ số nên phụ thuộc thang đo.

> **EN:**
>
> **Q1:** Why `data[["Pregnancies"]]` rather than `data["Pregnancies"]`?
> > **A:** Double brackets give a 2-D DataFrame (768 × 1), which
> > scikit-learn requires; single brackets give a 1-D Series.
>
> **Q2:** Glucose (zeros removed) has min 44, max 199. MinMax value of 120?
> > **A:** 76/155 ≈ 0.4903.
>
> **Q3:** Mean 50, std 8: standardize 70 and 38.
> > **A:** 2.5 (2.5 SDs above average) and −1.5.
>
> **Q4:** Using pandas' `.std()` gives z(6) = 0.6395, not the slide's
> 0.6399. Who's wrong?
> > **A:** Neither — pandas divides by n − 1, StandardScaler by n; use
> > `.std(ddof=0)` to match.
>
> **Q5:** A scaled test value is 1.137 after MinMax. Bug? Refit on test?
> > **A:** Not a bug (846 exceeds the training max 744). Never refit on
> > test — different scale and leakage; use `clip=True` if needed.
>
> **Q6:** Which doesn't need scaling: KNN, SVM, Random Forest, regularized
> Logistic Regression?
> > **A:** Random Forest — threshold splits are unchanged by rescaling.
