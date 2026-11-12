---
title: Step 3.3 — Feature scaling với MinMaxScaler và StandardScaler
order: 18
description: Vì sao phải đưa các feature số về cùng thang đo, công thức MinMaxScaler và StandardScaler đọc từ code slide 47, cách tính lại từng con số output, và quy tắc fit trên train rồi mới transform test.
slides: 47
needs: [missing-values-outliers]
tags: [scaling, MinMaxScaler, StandardScaler, RobustScaler, data-leakage, preprocessing]
---

## Vấn đề: đơn vị đo làm lệch phép so sánh

:::intro Đọc xong bài này bạn làm được
- Nói được **vì sao** cần scaling bằng một ví dụ cụ thể (không chỉ "để cho chuẩn").
- Tính tay MinMax và Standard, và đối chiếu từng số trên slide 47.
- Chọn scaler: MinMax / Standard / Robust — theo outlier và theo yêu cầu khoảng giá trị.
- Biết model nào cần scaling, model nào không, và giải thích được.
- Làm đúng quy tắc **fit trên train, transform trên test** và giải thích data leakage.
:::

Thử so sánh hai bệnh nhân bằng "khoảng cách" giữa họ:

| | Insulin | DiabetesPedigreeFunction |
|---|---|---|
| Bệnh nhân A | 100 | 0.2 |
| Bệnh nhân B | 110 | 1.2 |

Về y học, chênh lệch DPF 0.2 → 1.2 (từ tiền sử gia đình nhẹ lên rất nặng) quan trọng hơn nhiều so với Insulin 100 → 110.
Nhưng về **con số**, Insulin chênh 10 còn DPF chỉ chênh 1 — mọi phép tính dựa trên khoảng cách sẽ coi Insulin quan trọng gấp 10 lần.
Lý do duy nhất là **đơn vị đo**: Insulin tính bằng μU/ml với giá trị vài trăm, DPF là điểm số quanh 0–2.

**Feature scaling** (chuẩn hóa thang đo) đưa mọi feature số về **cùng một thang** để không cột nào "lấn át" cột nào chỉ vì đơn vị.
Đây là phần đầu của bước **03 Data Transformation**; slide 47 gọi là *"Tiền xử lý numerical features"* và giới thiệu hai công cụ
của scikit-learn: **MinMaxScaler** và **StandardScaler**.

> **EN:** Compare two patients by distance: Insulin differs by 10 and DPF by 1, so a distance-based computation treats
> Insulin as 10x more important — purely because of its unit. **Feature scaling** puts all numeric features on a common
> scale so no column dominates because of its unit. Slide 47 introduces scikit-learn's **MinMaxScaler** and **StandardScaler**.

### Nó nằm ở đâu trong pipeline

```
3.1 Missing → 3.2 Outliers → [ 3.3 Transformation: Scaling (bài này) + Encoding (bài 19) ] → 3.4 Correlation → 3.5 Balance
```

- **Sau** khi xử lý thiếu và outlier ([[bài:missing-values-outliers]]): MinMaxScaler dùng min và max, StandardScaler dùng mean và std
  — đều bị số 0 vô lý và outlier kéo lệch. Làm sạch trước rồi mới scale.
- [[bài:descriptive-statistics]] đã chỉ ra Diabetes dataset có thang đo rất khác nhau: DPF 0.078–2.42, Insulin 0–846, Glucose 0–199.
- Quy tắc **fit trên train, transform trên validation/test** ([[bài:train-test-split]]) áp dụng đúng nghĩa đen ở đây.
- Phần còn lại của Step 3.3 — mã hóa categorical — ở [[bài:categorical-encoding]].

:::slides 47 | Slide 47 — Tiền xử lý numerical features: MinMaxScaler (trái) và StandardScaler (phải)
:::

## Đọc code slide 47 từng dòng

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

- `data[["Pregnancies"]]` — **hai** cặp ngoặc vuông để lấy ra một DataFrame **2 chiều** (768 dòng × 1 cột). scikit-learn luôn đòi đầu vào
  dạng bảng 2 chiều (n mẫu × n feature); `data["Pregnancies"]` chỉ cho Series 1 chiều và sẽ báo lỗi.
- `.values` — chuyển sang mảng NumPy, nên output in ra dạng `[6]`.
- `fit_transform` = `fit` (**học** thông số: min, max hoặc mean, std) + `transform` (**áp** công thức lên dữ liệu) trong một lệnh.
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

Nhận xét đầu tiên: cả hai đều giữ **thứ tự** (8 vẫn lớn hơn 6) và **cùng giá trị cho ra cùng kết quả** (hai số 1 → cùng 0.0588).
Scaling chỉ **đổi thang**, không đổi hình dạng phân bố.

> **EN:** Double brackets yield a 2-D DataFrame (n_samples × n_features), as scikit-learn requires. `fit_transform` = `fit`
> (learn min/max or mean/std) + `transform` (apply the formula). Both scalers preserve order and map equal inputs to equal
> outputs — scaling changes the scale, not the shape of the distribution.

## MinMaxScaler — đưa về khoảng [0, 1]

:::formula
**MinMaxScaler** (đưa về [0, 1]):
```
x' = (x − min) / (max − min)
```
<!-- note: min → 0, max → 1, còn lại theo tỉ lệ -->
Giá trị nhỏ nhất → 0, lớn nhất → 1, các giá trị khác nằm theo **tỉ lệ** giữa hai đầu. `feature_range=(0, 1)` là mặc định;
muốn khoảng [a, b] thì scikit-learn tính tiếp `x'' = x' × (b − a) + a`.

**StandardScaler** (z-score):
```
z = (x − μ) / σ
```
<!-- note: mean 0, std 1 → đo "cách TB mấy độ lệch chuẩn" -->
μ và σ **học từ dữ liệu fit**. Sau khi scale, cột có mean = 0 và std = 1; giá trị âm = dưới trung bình. Không bị chặn khoảng.
:::

Với cột Pregnancies: min = 0, max = 17 → `x' = x / 17`. Ví dụ 6 / 17 = **0.35294118** — đúng dòng đầu của slide.

**Ưu:** dễ hiểu, giữ nguyên số 0 nếu min = 0, bị chặn trong [0, 1] — hợp với dữ liệu cần khoảng cố định
(cường độ pixel ảnh 0–255 → 0–1, đầu vào mạng nơ-ron).
**Nhược:** **rất nhạy với outlier** — chỉ một giá trị max khổng lồ là toàn bộ giá trị khác bị ép vào một khoảng hẹp gần 0.

> **EN:** MinMax: min → 0, max → 1. Pros: intuitive, bounded. Cons: very outlier-sensitive — one huge max squeezes everything
> else near 0.

## StandardScaler — đưa về mean 0, std 1

Kết quả gọi là **z-score** (đã gặp ở [[bài:missing-values-outliers]] khi phát hiện outlier): giá trị cách trung bình bao nhiêu lần độ lệch chuẩn.
Phần lớn giá trị nằm khoảng −3 đến 3 nhưng có thể vượt. Với Pregnancies: μ = 3.84505, σ = 3.36738 → z(6) = (6 − 3.84505) / 3.36738 ≈ **0.63995** — đúng dòng đầu slide.

:::pitfall Chi tiết dễ nhầm: σ chia n hay n − 1?
`StandardScaler` tính σ bằng cách **chia cho n** (độ lệch chuẩn tổng thể, `ddof=0`), còn pandas `describe()` / `.std()` ở
[[bài:descriptive-statistics]] **chia cho n − 1** (độ lệch chuẩn mẫu). Vì vậy bài đó ghi std Pregnancies = 3.3696, còn StandardScaler dùng 3.3674.
Nếu tự tính z bằng `data.std()` của pandas sẽ lệch chút ít so với output slide (dùng `.std(ddof=0)` để khớp).
:::

> **EN:** StandardScaler: z = (x − μ)/σ with μ, σ learned at fit time → mean 0, std 1; mostly within ±3. Its σ divides by n
> (`ddof=0`), while pandas `.std()` divides by n − 1 (3.3674 vs 3.3696 for Pregnancies).

## So sánh và chọn scaler

:::compare MinMax vs Standard vs Robust
| | MinMaxScaler | StandardScaler | RobustScaler *(bổ sung)* |
|---|---|---|---|
| Công thức | (x − min)/(max − min) | (x − mean)/std | (x − median)/IQR |
| Khoảng kết quả | [0, 1] (trên dữ liệu fit) | Không chặn, quanh 0 | Không chặn, quanh 0 |
| Học thông số gì | min, max | mean, std | median, Q1, Q3 |
| Bị outlier ảnh hưởng | **Rất mạnh** | Vừa | **Ít** |
| Dùng khi | Cần khoảng cố định; dữ liệu không có outlier | Mặc định phổ biến; dữ liệu gần chuẩn | Có nhiều outlier thật muốn giữ lại |
:::

Quy tắc chọn nhanh: không biết chọn gì → **StandardScaler**; có outlier mà không muốn xóa → **RobustScaler**; cần đúng khoảng [0, 1] → **MinMaxScaler**.

> **EN:** Default: StandardScaler. Genuine outliers you keep: RobustScaler (median/IQR). Need a fixed [0, 1] range: MinMaxScaler.

## Model nào cần scaling?

:::compare Cần hay không cần scaling
| Cần scaling | Vì sao | Không cần | Vì sao |
|---|---|---|---|
| KNN, K-Means | Dựa trực tiếp vào khoảng cách | Decision Tree, Random Forest | Mỗi lần chỉ so một feature với một ngưỡng ("Glucose > 127?") — đổi thang không đổi thứ tự nên không đổi kết quả |
| SVM | Dựa vào khoảng cách tới hyperplane | Naive Bayes | Xét từng feature riêng |
| Logistic / Linear Regression có regularization | Phạt độ lớn hệ số — feature thang nhỏ cần hệ số lớn bị phạt oan | | |
| PCA | Tìm hướng phương sai lớn — cột thang lớn có phương sai lớn "giả" | | |
| Mạng nơ-ron, mọi thứ dùng gradient descent | Hội tụ nhanh và ổn định hơn | | |
:::

Ngoài ra scaling giúp **so sánh hệ số**: sau StandardScaler, hệ số của Logistic Regression cho biết "tăng 1 độ lệch chuẩn của feature này thì log-odds
thay đổi bao nhiêu" — so được giữa các feature. **Không scale label** trong Classification (Outcome 0/1 là tên class).

> **EN:** Distance-based models, SVM, regularized linear models, PCA and gradient-descent models need scaling; tree models and
> Naive Bayes do not, since a split threshold is unchanged by rescaling.

## Fit trên train, transform trên test

Code slide 47 gọi `fit_transform` trên **toàn bộ** 768 dòng — chấp nhận được khi chỉ để xem scaler làm gì. Khi làm model thật thì phải:

```python
scaler.fit(X_train)                   # học min/max hoặc mean/std CHỈ từ train
X_train_s = scaler.transform(X_train)
X_test_s = scaler.transform(X_test)   # dùng lại thông số của train, KHÔNG fit lại
```

Vì sao? Tập test đóng vai "bệnh nhân tương lai" chưa từng thấy. Nếu min, max, mean, std tính cả từ test thì thông tin của test đã lọt
vào quá trình chuẩn bị dữ liệu (**data leakage**) — điểm đánh giá sẽ lạc quan hơn thực tế.

:::pitfall Hai lỗi hay gặp
- `scaler.fit_transform(X_test)` — fit lại trên test → test được scale theo thang của **chính nó**, không cùng thang với train mà model đã học.
- Scale toàn bộ dataset rồi mới `train_test_split`.
:::

Hệ quả bình thường của cách làm đúng: dữ liệu test sau MinMaxScaler **có thể ra ngoài [0, 1]**. Ví dụ thật trên Diabetes (chia 80/20,
`stratify=y`, `random_state=42`): Insulin lớn nhất trong train là 744, nhưng test có một bệnh nhân Insulin 846 → 846 / 744 ≈ **1.137**.
Đây không phải lỗi; nó chỉ nói bệnh nhân này vượt ngoài những gì đã thấy khi huấn luyện. (Muốn ép về khoảng thì dùng `MinMaxScaler(clip=True)`.)

> **EN:** Fit on the training set only, then transform both sets with the same parameters; fitting on test data leaks
> information. A correct side effect: scaled test values can fall outside [0, 1] (846/744 ≈ 1.137); use `clip=True` if needed.

## Ví dụ tay

:::worked Tính lại output slide 47 — Pregnancies: min = 0, max = 17, μ = 3.845052, σ (chia n) = 3.367384
| x | MinMax: x / 17 | Standard: (x − 3.845052) / 3.367384 |
|---|---|---|
| 0 | 0 / 17 = **0** | −3.845052 / 3.367384 = **−1.1419** |
| 1 | 1 / 17 = **0.0588** | −2.845052 / 3.367384 = **−0.8449** |
| 3 | 3 / 17 = **0.1765** | −0.845052 / 3.367384 = **−0.2510** |
| 6 | 6 / 17 = **0.3529** | 2.154948 / 3.367384 = **0.6399** |
| 10 | 10 / 17 = **0.5882** | 6.154948 / 3.367384 = **1.8278** |

Khớp từng số với ảnh slide. Nếu dùng σ của pandas (3.369578, chia n − 1) thì z(6) = 0.6395 — lệch ở chữ số thứ tư.
:::

:::worked Một dãy nhỏ tính trọn vẹn — tập train: 2, 4, 4, 5, 10
**MinMaxScaler:** min = 2, max = 10, max − min = 8 → (x − 2) / 8:

| x | 2 | 4 | 4 | 5 | 10 |
|---|---|---|---|---|---|
| MinMax | **0** | **0.25** | **0.25** | **0.375** | **1** |

**StandardScaler:** μ = 25 / 5 = 5; Σ(x − μ)² = 9 + 1 + 1 + 0 + 25 = 36 → σ (chia n) = √(36 / 5) = √7.2 ≈ **2.6833**

| x | 2 | 4 | 4 | 5 | 10 |
|---|---|---|---|---|---|
| z | **−1.1180** | **−0.3727** | **−0.3727** | **0** | **1.8634** |

Kiểm tra: tổng các z = 0 → mean = 0 ✓.

**RobustScaler:** median = 4; Q1 = 4, Q3 = 5 → IQR = 1 → (x − 4) / 1 = **−2, 0, 0, 1, 6**. Giá trị 10 vẫn nổi bật rõ (6), không làm co các điểm khác lại.
Nhìn lại MinMax: chỉ vì số 10, bốn điểm còn lại bị dồn vào [0, 0.375] — minh họa "MinMax nhạy với outlier".

**Một giá trị mới ở tập test: x = 12** (dùng thông số của train, không fit lại): MinMax: (12 − 2) / 8 = **1.25** (vượt [0, 1], bình thường);
Standard: (12 − 5) / 2.6833 ≈ **2.6087**. Nếu lỡ fit lại trên tập test chỉ có giá trị 12 thì max − min = 0 → phép chia cho 0 —
một minh họa vui cho việc vì sao **không được fit trên test**.
:::

## Code

### Chạy lại code slide 47

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

### Kiểm tra ví dụ tay

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

### Cách làm đúng trên Diabetes: fit trên train

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

### Gói vào Pipeline (nối [[bài:ml-pipeline]])

`Pipeline` đảm bảo không bao giờ quên quy tắc fit-trên-train, kể cả khi dùng cross-validation ([[bài:k-fold-cross-validation]]):
mỗi fold, scaler được fit lại chỉ trên phần train của fold đó.

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

## Tóm tắt 1 phút

:::recap
- Scaling = đưa các feature số về cùng thang để đơn vị đo không quyết định "độ quan trọng".
- **MinMax**: `(x − min)/(max − min)` → [0, 1]; nhạy outlier. **Standard**: `(x − μ)/σ` → mean 0, std 1; mặc định tốt. **Robust**: dùng median/IQR; bền với outlier.
- StandardScaler chia σ cho **n**, pandas `.std()` chia **n − 1**.
- Cần scaling: KNN, K-Means, SVM, mô hình có regularization, PCA, gradient descent. Không cần: cây quyết định, Random Forest, Naive Bayes.
- **Fit chỉ trên train**, transform cả train và test bằng cùng thông số. Dùng `Pipeline` để không bao giờ quên.
- Giá trị test ngoài [0, 1] sau MinMax là bình thường, không phải lỗi.
- Không scale label của bài Classification.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Vì sao code slide 47 viết `data[["Pregnancies"]]` (hai cặp ngoặc) chứ không phải `data["Pregnancies"]`?
A: Hai cặp ngoặc trả về DataFrame **2 chiều** (768 × 1); scikit-learn yêu cầu đầu vào dạng (số mẫu × số feature). Một cặp ngoặc trả về Series 1 chiều và scaler sẽ báo lỗi.
Q: Cột Glucose (sau khi bỏ số 0) có min = 44, max = 199. Tính giá trị MinMaxScaler của Glucose = 120.
A: (120 − 44) / (199 − 44) = 76 / 155 ≈ **0.4903**.
Q: Một cột có mean = 50, std (chia n) = 8. Giá trị 70 và 38 sau StandardScaler là bao nhiêu? Đọc ý nghĩa.
A: z(70) = 20 / 8 = **2.5** (cao hơn trung bình 2.5 độ lệch chuẩn); z(38) = −12 / 8 = **−1.5** (thấp hơn trung bình 1.5 độ lệch chuẩn).
Q: Bạn tự tính z cho Pregnancies = 6 bằng `data["Pregnancies"].std()` và được 0.6395, khác slide (0.6399). Ai sai?
A: Không ai sai. pandas `.std()` chia **n − 1** (3.3696), còn `StandardScaler` chia **n** (3.3674). Muốn khớp thì dùng `.std(ddof=0)`.
Q: Sau khi fit MinMaxScaler trên train, một giá trị ở tập test ra 1.137. Có phải lỗi không? Có nên fit lại trên test để nó về ≤ 1 không?
A: Không phải lỗi — giá trị test lớn hơn max của train (Insulin 846 > 744). **Không** được fit lại trên test: test sẽ ở thang khác với train mà model đã học, và là data leakage. Nếu cần chặn khoảng thì dùng `clip=True`.
Q: Model nào sau đây **không** cần scaling: KNN, SVM, Random Forest, Logistic Regression có regularization? Vì sao?
A: **Random Forest** — mỗi nút chỉ so một feature với một ngưỡng; đổi thang giữ nguyên thứ tự nên cách chia không đổi. KNN và SVM dựa vào khoảng cách; Logistic Regression có regularization phạt độ lớn hệ số nên phụ thuộc thang đo.
Q: Dữ liệu [10, 20, 30, 40, 1000]. MinMax của 20, 30, 40 là bao nhiêu? Nhận xét.
A: min = 10, max = 1000, khoảng = 990. 20 → 10/990 ≈ **0.0101**; 30 → **0.0202**; 40 → **0.0303**. Bốn điểm bình thường bị nén vào [0, 0.03] chỉ vì một outlier 1000 — minh họa MinMax rất nhạy với outlier; nên dùng RobustScaler hoặc xử lý outlier trước.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Vì sao cần feature scaling? Cho một ví dụ cụ thể.
A: Nhiều thuật toán đối xử với feature theo **độ lớn con số**, không theo ý nghĩa. Ví dụ KNN tính khoảng cách giữa hai bệnh nhân: Insulin chênh 10 và DPF chênh 1 → Insulin chiếm gần hết khoảng cách dù DPF mới quan trọng hơn về y học. Scaling đưa các feature về cùng thang để mỗi feature đóng góp công bằng, đồng thời giúp gradient descent hội tụ nhanh và ổn định hơn.
EN: Many algorithms treat features by numeric magnitude; without scaling, a large-unit feature dominates distance computations and slows gradient-based convergence.
Q: **B2.** Phân biệt normalization (MinMax) và standardization. Khi nào dùng cái nào?
A: MinMax đưa về [a, b] dựa trên min/max — dùng khi cần khoảng cố định (pixel ảnh, đầu vào mạng nơ-ron) và dữ liệu ít outlier. Standardization dùng mean/std, kết quả quanh 0, không chặn khoảng — mặc định tốt cho đa số thuật toán, đặc biệt khi dữ liệu gần phân phối chuẩn hoặc có outlier nhẹ. Có outlier thật cần giữ → RobustScaler (median/IQR). Lưu ý: thuật ngữ "normalization" đôi khi cũng chỉ việc chuẩn hóa từng vector về độ dài 1 (`Normalizer`) — nên hỏi lại ngữ cảnh.
EN: MinMax rescales to a fixed range using min/max; standardization centres to mean 0 and unit variance. Robust scaling uses median/IQR when genuine outliers remain.
Q: **B3.** Scaling có làm dữ liệu thành phân phối chuẩn hoặc loại bỏ outlier không?
A: Không. Cả MinMax và Standard đều là biến đổi **tuyến tính**, nên giữ nguyên hình dạng phân bố (lệch vẫn lệch) và outlier vẫn là outlier — chỉ đổi thang. Muốn giảm lệch phải dùng biến đổi phi tuyến như log hoặc PowerTransformer; muốn xử lý outlier phải làm bước riêng.
EN: Scaling is a linear transform: it keeps the distribution's shape and outliers. Use log/power transforms to reduce skew.
Q: **B4.** Giải thích data leakage trong scaling. Vì sao fit scaler trên toàn bộ dữ liệu rồi mới chia train/test là sai?
A: Khi tính mean/std/min/max trên cả dữ liệu, thông tin thống kê của tập test đã ảnh hưởng đến cách train được biến đổi → model gián tiếp "biết" phân bố test → điểm đánh giá lạc quan hơn thực tế. Cách đúng: chia trước, `fit` scaler chỉ trên train, rồi `transform` test bằng thông số đó. Trong cross-validation dùng `Pipeline` để scaler được fit lại ở mỗi fold.
EN: Computing scaling statistics on the full data lets test-set information influence preprocessing, inflating scores; fit on train only and reuse the parameters.
Q: **B5.** Vì sao cây quyết định / Random Forest không cần scaling còn KNN, SVM thì cần?
A: Cây chỉ so sánh từng feature với một ngưỡng ("Glucose > 127?"); phép biến đổi đơn điệu không đổi thứ tự nên không đổi cách chia → kết quả giống hệt. KNN và SVM (kernel RBF) dùng khoảng cách tới điểm khác/hyperplane nên độ lớn từng feature ảnh hưởng trực tiếp. Mô hình có regularization phạt độ lớn hệ số nên cũng phụ thuộc thang.
EN: Trees compare one feature to a threshold, which a monotonic rescale doesn't change; distance- and penalty-based models depend on feature magnitude.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Model chạy tốt trong notebook nhưng khi triển khai API thì dự đoán sai lệch hẳn. Bạn phát hiện lúc training có StandardScaler nhưng code serving nạp dữ liệu thô. Bạn sửa thế nào và phòng ngừa ra sao?
A: Nguyên nhân là **training–serving skew**: model học trên dữ liệu đã scale nhưng nhận dữ liệu thô khi phục vụ. Sửa: lưu **cả pipeline** (imputer + scaler + model) bằng `joblib`/`pickle` và gọi `pipeline.predict(raw)` khi serving, tuyệt đối không tự scale lại bằng thông số tính tay. Phòng ngừa: có test so sánh đầu ra giữa môi trường train và serving trên cùng mẫu, version hóa pipeline.
WANT: Bạn nhận ra scaler là một **phần của model** cần được đóng gói cùng, và biết khái niệm training–serving skew.
Q: **C2.** Hệ thống chấm điểm tín dụng dùng MinMaxScaler. Hôm nay xuất hiện khách có thu nhập gấp 20 lần max trong dữ liệu train. Điều gì xảy ra và bạn xử lý thế nào?
A: MinMax cho giá trị ≈ 20 (ngoài [0, 1]); với model nhạy thang (mạng nơ-ron, KNN) điểm số có thể vô lý. Hướng xử lý: (1) cân nhắc `clip=True` hoặc cắt giá trị ở ngưỡng hợp lý; (2) cảnh báo/đẩy sang duyệt tay khi feature vượt xa phân phối train (giám sát drift); (3) xem xét dùng RobustScaler hoặc biến đổi log cho feature đuôi dài như thu nhập; (4) huấn luyện lại định kỳ khi phân phối đổi.
WANT: Bạn nghĩ đến giám sát dữ liệu đầu vào trong production và chọn kỹ thuật theo bản chất feature, không chỉ theo mặc định.
Q: **C3.** Feature "doanh thu khách hàng" có đuôi rất dài (vài khách gấp hàng nghìn lần trung bình). StandardScaler cho kết quả tệ trên KNN. Bạn làm gì?
A: StandardScaler không sửa được độ lệch: phần lớn khách vẫn bị nén gần nhau còn vài khách cực lớn có z rất cao. Thử theo thứ tự: biến đổi **log** (hoặc `PowerTransformer`) để giảm lệch rồi mới scale; hoặc RobustScaler; đánh giá từng phương án bằng cross-validation trong Pipeline. Cần kiểm tra xem outlier là thật (khách VIP — giữ) hay lỗi dữ liệu (sửa/loại).
WANT: Bạn phân biệt được "scale" với "đổi hình dạng phân bố", và quyết định dựa trên thực nghiệm có kiểm soát leakage.
Q: **C4.** Đồng nghiệp báo "thêm scaling thì F1 của KNN tăng từ 0.62 lên 0.71". Bạn kiểm tra gì trước khi tin?
A: (1) Scaler có được fit **chỉ trên train** (hay Pipeline trong CV) — nếu fit trên toàn bộ dữ liệu thì điểm bị thổi phồng nhẹ; (2) chênh 0.09 có vượt độ dao động giữa các fold không (xem độ lệch chuẩn của score qua CV, dùng cùng `random_state`/cùng fold cho cả hai cấu hình); (3) so sánh công bằng: cùng hyperparameter (k) hoặc cùng quy trình tune; (4) mức tăng có hợp lý không — KNN rất nhạy thang nên tăng lớn là dễ hiểu.
WANT: Bạn có thói quen xác minh cải tiến bằng quy trình đánh giá đúng thay vì tin một con số.
:::

## Nối sang bài sau

:::next
Scaling xử lý cột **số**. Nhưng còn cột chữ như giới tính, thành phố, size áo (S/M/L) thì sao? Model cần số, nên phải mã hóa — Ordinal, One-hot, Hash, Embedding.
Đó là nửa còn lại của Step 3.3: [[bài:categorical-encoding]]. Sau đó, [[bài:correlation-multicollinearity]] sẽ kiểm tra các feature đã scale xem có trùng lặp thông tin không.
:::
