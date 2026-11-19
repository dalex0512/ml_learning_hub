---
title: Step 3.3 — Feature scaling với MinMaxScaler và StandardScaler
order: 18
description: "Đơn vị đo làm cột số lớn lấn át khoảng cách: thấy bằng số thật, sửa bằng MinMax hoặc Standard, và chỉ fit trên train."
slides: 47
needs: [missing-values-outliers]
tags: [scaling, MinMaxScaler, StandardScaler, RobustScaler, data-leakage, preprocessing]
---

## Hai bệnh nhân này khác nhau nhiều nhất ở cột nào?

:::intro Mục tiêu bài này
- Thấy bằng số thật vì sao cột có số lớn **lấn át** cột có số nhỏ khi model so sánh hai mẫu.
- Đưa mọi cột về cùng một thước bằng **MinMaxScaler** hoặc **StandardScaler**, và chọn đúng khi có outlier.
- Biết model nào cần scale, model nào không, và vì sao chỉ được `fit` scaler trên train.
:::

Nhiều model đo "hai bệnh nhân khác nhau bao nhiêu" bằng [[từ:euclid|khoảng cách]]: lấy chênh lệch từng cột, bình phương, cộng lại. Hãy thử với hai người thật trong bộ Diabetes (bệnh nhân số 3 và số 4 của bảng):

| Cột | Người A | Người B | Chênh |
|---|---|---|---|
| Pregnancies | 1 | 0 | 1 |
| Glucose | 89 | 137 | 48 |
| BloodPressure | 66 | 40 | 26 |
| SkinThickness | 23 | 35 | 12 |
| Insulin | 94 | 168 | 74 |
| BMI | 28.1 | 43.1 | 15 |
| DiabetesPedigreeFunction | 0.167 | 2.288 | 2.121 |
| Age | 21 | 33 | 12 |

:::predict
Tám cột đều khác nhau. Theo bạn, **cột nào chiếm phần lớn nhất** trong khoảng cách giữa hai người này, và nó chiếm khoảng bao nhiêu phần trăm?
@answer
**Insulin, khoảng 61%.** Bình phương chênh lệch: Insulin 74² = 5476, Glucose 48² = 2304, BloodPressure 26² = 676, các cột còn lại cộng lại chưa tới 600. Tổng khoảng 8975, nên Insulin chiếm 5476 / 8975 ≈ 61%, Glucose khoảng 26%. DiabetesPedigreeFunction chênh tới 2.1, một chênh lệch **rất lớn so với thang của nó** (0 đến 2.4), nhưng bình phương chỉ là 4.5 nên gần như không đóng góp gì.
:::

Hãy tự kiểm tra bằng công cụ dưới đây. Bấm giữa ba chế độ để xem cùng một cặp người khi dữ liệu còn gốc, sau StandardScaler, và sau MinMaxScaler; bấm "Cặp ngẫu nhiên" để thử người khác.

:::widget scaler-before-after
:::

Điều đáng nhớ: Insulin không "quan trọng hơn" DiabetesPedigreeFunction. Nó chỉ được đo bằng một **thước lớn hơn**. Một model dùng khoảng cách (KNN, K-Means), hoặc phạt trọng số (Logistic có regularization), sẽ nghe cột Insulin to gấp hàng chục lần chỉ vì đơn vị.

:::ck
Nếu ta đo chiều cao của bệnh nhân bằng **mét** thay vì **centimet**, cột chiều cao sẽ đóng góp nhiều hơn hay ít hơn vào khoảng cách? Thông tin y học có đổi không?
@answer
**Ít hơn rất nhiều** (khoảng 10.000 lần trong bình phương), dù thông tin y học hoàn toàn không đổi. Kết quả của model phụ thuộc vào đơn vị mà ta tình cờ chọn: đó đúng là vấn đề mà scaling giải quyết.
:::

## Làm sao đưa mọi cột về cùng một thước?

Ý tưởng: đổi mỗi cột sang một thước **không phụ thuộc đơn vị gốc**. Có hai cách phổ biến, và [[slide:47]] giới thiệu cả hai trong scikit-learn:

- **MinMaxScaler**: `(x − min) / (max − min)`. Giá trị nhỏ nhất thành 0, lớn nhất thành 1.
- **StandardScaler**: `(x − [[từ:mean|mean]]) / [[từ:std|std]]`. Cho biết giá trị đó cách trung bình bao nhiêu "bước chân" (độ lệch chuẩn), còn gọi là [[từ:z-score]].

Làm tay với một cột nhỏ (số tự soạn), từng bước:

:::steps
Cột train có 5 giá trị: `2, 4, 4, 5, 10`. Ta cần ba con số của nó: **min = 2**, **max = 10**, **mean = (2+4+4+5+10) / 5 = 5**.
@step
**MinMax:** `(x − 2) / (10 − 2)` cho `[0, 0.25, 0.25, 0.375, 1]`. Giá trị nhỏ nhất ra 0, lớn nhất ra 1; mọi giá trị khác nằm giữa theo tỉ lệ.
@step
**Standard, bước 1: độ lệch so với mean.** `x − 5` cho `[−3, −1, −1, 0, 5]`.
@step
**Standard, bước 2: độ lệch chuẩn.** Bình phương các độ lệch: `[9, 1, 1, 0, 25]`, cộng lại 36, chia cho 5 được 7.2, lấy căn: **std = √7.2 ≈ 2.683**.
@step
**Standard, bước 3: chia.** `[−3, −1, −1, 0, 5] / 2.683` cho `[−1.118, −0.373, −0.373, 0, 1.863]`. Cột mới có mean 0 và độ lệch chuẩn 1.
:::

:::slides 47 | Slide 47: MinMaxScaler (trái) và StandardScaler (phải) trong scikit-learn
:::

:::ck
Giá trị `10` ra **1** sau MinMax nhưng ra **1.863** sau Standard. Hai con số này đang nói hai điều khác nhau như thế nào?
@answer
MinMax nói "10 là **giá trị lớn nhất** trong cột, nên đứng ở đầu khoảng 0 đến 1". Standard nói "10 cách trung bình 5 một khoảng **1.863 bước chân**". MinMax cho **vị trí trong khoảng min–max**; Standard cho **khoảng cách so với trung tâm tính theo độ rộng điển hình của cột**.
:::

## Chạy code của slide 47 trên cột Pregnancies

Slide 47 chạy hai scaler của scikit-learn trên cột `Pregnancies` của Diabetes và in từng cặp **Before / After**. Cột này có min = 0, max = 17, mean = 3.845052, std (chia n) = 3.367384. Đối chiếu một vài giá trị:

| Before | MinMaxScaler: (x − 0) / (17 − 0) | StandardScaler: (x − 3.845) / 3.367 |
|---|---|---|
| 0 | 0.000000 | −1.141852 |
| 1 | 0.058824 | −0.844885 |
| 6 | **0.352941** | **0.639947** |
| 8 | 0.470588 | 1.233880 |
| 17 | 1.000000 | 3.906578 |

Chú ý hai điều: MinMax luôn nằm trong [0, 1] (0 là min, 17 là max), còn Standard **không bị chặn**: giá trị lớn nhất 17 cách mean tới 3.9 độ lệch chuẩn. Phần "Đào sâu" có bản đọc từng dòng code của slide.

## MinMax hay Standard? Outlier quyết định

Thêm một giá trị cực đoan vào cột trên: `2, 4, 4, 5, 100`.

| Giá trị | 2 | 4 | 4 | 5 | 100 |
|---|---|---|---|---|---|
| Gốc | 2 | 4 | 4 | 5 | 100 |
| MinMax | 0 | 0.020 | 0.020 | 0.031 | 1 |
| Standard | −0.55 | −0.49 | −0.49 | −0.47 | 2.00 |

Bốn giá trị bình thường bị **nén** vào đoạn 0 đến 0.03 sau MinMax, vì khoảng min–max bị outlier kéo giãn. Standard cũng bị ảnh hưởng (mean và std đều bị kéo), chỉ là bớt nặng hơn. Cách chọn:

- Cần đầu ra trong khoảng cố định (ví dụ [0, 1]): **MinMaxScaler**, sau khi đã xử lý outlier.
- Không có yêu cầu đó: **StandardScaler** thường là lựa chọn mặc định.
- Nhiều outlier: dùng **RobustScaler** (dựa trên trung vị và khoảng tứ phân vị) hoặc xử lý outlier trước, theo [[bài:missing-values-outliers]].

:::ck
Một cột có 99 giá trị trong khoảng 0 đến 10 và một giá trị 1000. Sau MinMaxScaler, 99 giá trị kia nằm gần đâu?
@answer
Gần **0** (từ 0 đến khoảng 0.01), vì `(x − 0) / (1000 − 0)`. Model gần như không phân biệt được chúng. Đây là lý do phải nhìn outlier trước khi scale.
:::

## Model nào cần scale, model nào không?

Một câu hỏi duy nhất để quyết định: **model có cộng, nhân hoặc đo khoảng cách trên giá trị thật của cột không?**

| Cần scale | Vì sao |
|---|---|
| [[bài:k-nearest-neighbours|KNN]], K-Means | Dựa trực tiếp vào khoảng cách |
| [[bài:svm|SVM]] | Đơn vị feature ảnh hưởng margin và kernel |
| Logistic, Linear có regularization | Phạt độ lớn hệ số: cột thang nhỏ cần hệ số lớn nên bị phạt oan |
| Mạng nơ-ron, mọi thứ dùng gradient descent | Hội tụ nhanh và ổn định hơn |

| Không cần scale | Vì sao |
|---|---|
| [[bài:decision-tree|Decision Tree]], [[bài:random-forest|Random Forest]] | Chỉ **so sánh** một cột với một ngưỡng ("Glucose ≤ 127?"); scale không đổi thứ tự các giá trị nên không đổi cách chia |

Bạn sẽ thấy điều này bằng thí nghiệm ở **Bước 8 của Project**: Random Forest cho dự đoán y hệt nhau có và không scale, còn Logistic thì khác.

:::ck
Cây hỏi "Glucose ≤ 127?". Nếu ta scale Glucose bằng StandardScaler, ngưỡng 127 đổi thành một số khác. Cách chia các bệnh nhân vào hai nhóm có đổi không?
@answer
**Không đổi.** StandardScaler là phép biến đổi tăng dần (đơn điệu): người nào có Glucose ≤ 127 trước khi scale thì cũng nằm dưới ngưỡng mới sau khi scale. Nhóm trái và nhóm phải giữ nguyên.
:::

## Đo ở đâu, và vì sao chỉ đo trên train?

Anh thợ may làm hai việc riêng: **đo** người mặc, rồi **cắt vải** theo số đo. Scaler cũng vậy:

```python
scaler = StandardScaler()
scaler.fit(x_train)                  # ĐO: tính mean và std, chỉ trên train
x_train_s = scaler.transform(x_train)   # CẮT train theo số đo đó
x_test_s = scaler.transform(x_test)     # CẮT test, vẫn bằng số đo của train
```

Bộ test đóng vai bệnh nhân **sẽ đến sau này**. Khi hệ thống chạy thật, bạn không thể tính lại trung bình "có cả họ". Nếu lúc thử bạn đo cả test, scaler đã "nhìn trộm" đề thi. Số liệu thật, với người test có Insulin = 579:

| Đo bằng | Mean Insulin | Std Insulin | z của 579 |
|---|---|---|---|
| **Đúng:** chỉ train | 81.44 | 116.14 | **4.284** |
| **Sai:** cả bộ dữ liệu | 79.80 | 115.17 | 4.335 |

Chênh nhẹ vì dữ liệu lớn, nhưng nó có hướng: scaler đã được chuẩn bị cho những người mà lẽ ra nó chưa biết. Với dữ liệu nhỏ, hoặc với các bước "học nhiều hơn" như điền giá trị thiếu hay chọn feature, rò rỉ này có thể làm điểm tăng giả tạo đáng kể. Vì vậy quy tắc phải thành phản xạ: **`fit` chỉ trên train; test chỉ `transform`**. Project Bước 3 làm đúng điều này và có nút "Giải thích chi tiết" cho từng dòng.

:::ck
Một đồng nghiệp chạy `fit_transform` trên toàn bộ dữ liệu rồi mới chia train và test. Điểm test chỉ khác vài phần nghìn. Bạn nói gì với họ?
@answer
Con số gần nhau **không làm cho quy trình đúng**. Mean và std đã tính cả hàng test, nên test không còn là "bệnh nhân chưa từng gặp"; điểm đo được lạc quan hơn thực tế dù ít hay nhiều. Làm lại: chia trước, `fit` trên train, `transform` test, hoặc dùng Pipeline để không thể làm sai.
:::

## Kiểm tra ví dụ tay, fit trên train, và gói vào Pipeline

**Kiểm tra dãy nhỏ 2, 4, 4, 5, 10** (đúng số đã tính tay), kể cả một giá trị mới x = 12 ở tập test, dùng thông số của train:

```python
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler
a = np.array([[2], [4], [4], [5], [10]], dtype=float)
print(MinMaxScaler().fit_transform(a).ravel())     # [0. 0.25 0.25 0.375 1.]
print(StandardScaler().fit_transform(a).ravel())   # [-1.118 -0.3727 -0.3727 0. 1.8634]
print(RobustScaler().fit_transform(a).ravel())     # [-2. 0. 0. 1. 6.]
new = np.array([[12.0]])
print(MinMaxScaler().fit(a).transform(new))        # [[1.25]]  vượt [0, 1], bình thường
print(StandardScaler().fit(a).transform(new))      # [[2.6087]]
```

**Cách làm đúng trên Diabetes: fit trên train.** Scaler học min/max hoặc mean/std từ train, rồi áp cho test:

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
X_train_ss, X_test_ss = ss.transform(X_train), ss.transform(X_test)
print(X_train_ss.mean(axis=0).round(6))            # ~0 trên train
print(X_test_ss.mean(axis=0).round(3))             # gần 0 nhưng không đúng 0 trên test
```

Insulin lớn nhất ở train là 744 nhưng ở test là 846, nên MinMax của train cho test ra **1.137** (lớn hơn 1): đó là bình thường, không phải lỗi, và đừng "sửa" bằng cách fit lại trên test.

**Gói vào Pipeline** để không bao giờ quên quy tắc này, kể cả khi cross-validation ([[bài:k-fold-cross-validation]]): mỗi fold, imputer và scaler được fit lại chỉ trên phần train của fold ([[bài:ml-pipeline]]):

```python
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
Xc = X.copy()
Xc[zero_cols] = Xc[zero_cols].replace(0, np.nan)
model = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, Xc, y, cv=cv, scoring="f1")
print(scores.round(3), scores.mean().round(3))   # [0.639 0.652 0.638 0.596 0.654] 0.636
```

## Những hiểu sai thường gặp

- **"Scale để model chính xác hơn."** Scale giúp model **dùng khoảng cách hoặc trọng số** học công bằng; với cây và forest nó không đổi gì.
- **"StandardScaler làm dữ liệu thành phân phối chuẩn."** Không: nó chỉ dời và co giãn (mean 0, std 1), **hình dạng phân phối giữ nguyên**; dữ liệu lệch vẫn lệch.
- **"Scale cả cột nhãn."** Không: với phân loại, nhãn 0/1 là tên lớp, không scale.
- **"Scale rồi mới chia train/test cho tiện."** Đó là rò rỉ dữ liệu; chia trước, `fit` trên train.
- **"Scale xong thì outlier biến mất."** Outlier vẫn còn, chỉ đổi thang; MinMax còn bị nén vì outlier.

:::card Feature scaling
- **Vấn đề:** cột có số lớn lấn át khoảng cách (Insulin chiếm khoảng 57% khoảng cách trung bình, DPF gần 0%).
- **MinMax:** `(x − min) / (max − min)`, ra khoảng [0, 1], bị outlier nén.
- **Standard:** `(x − mean) / std`, ra "số bước chân", ít bị nén hơn nhưng vẫn bị outlier kéo.
- **Cần scale:** model dùng khoảng cách, trọng số, gradient (KNN, SVM, Logistic, mạng nơ-ron). **Không cần:** cây và forest.
- **Quy tắc:** `fit` chỉ trên train, test chỉ `transform`; dùng Pipeline để không quên.
- **Bẫy lớn nhất:** scale cả bộ dữ liệu trước khi chia.
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
Q: StandardScaler cho mean 0, std 1 có nghĩa mọi điểm nằm trong [−3,3] không?
A: Không. Scaler không chặn khoảng và không làm dữ liệu thành Gaussian. Với phân phối chuẩn, khoảng ±3σ chứa khoảng 99.73%, vẫn có điểm ngoài; với phân phối lệch, quy tắc đó không áp dụng trực tiếp.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Vì sao cần feature scaling? Cho một ví dụ cụ thể.
A: Nhiều thuật toán đối xử với feature theo **độ lớn con số**, không theo ý nghĩa. Ví dụ KNN tính khoảng cách giữa hai bệnh nhân: Insulin chênh 10 và DPF chênh 1 → Insulin chiếm gần hết khoảng cách mà chưa xét ý nghĩa nghiệp vụ của hai cột. Scaling đưa các feature về cùng thang để mỗi feature đóng góp công bằng, đồng thời giúp gradient descent hội tụ nhanh và ổn định hơn.
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
Q: Vì sao “mô hình chú ý feature lớn hơn” chỉ là cách nói gợi nhớ?
A: Độ lớn ảnh hưởng khoảng cách, gradient và regularization, không phải cơ chế chú ý chung của mọi model. Cây so ngưỡng từng cột, còn đổi đơn vị không tự tạo thêm thông tin. Phải nói rõ thuật toán và nguyên nhân.
EN: Scale sensitivity comes from specific distances, optimization or penalties; it is not a universal attention mechanism.
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
Q: Dữ liệu có hai cột cùng đo chiều dài, một cột m và một cột km. Scale xong đã xử lý xong chưa?
A: Kiểm tra trước xem đó là hai phép đo độc lập hay cùng một thông tin đổi đơn vị. Đổi về đơn vị chuẩn, kiểm tra consistency và cân nhắc bỏ cột trùng; scaling không xóa redundancy. So chất lượng và chi phí trên validation, không giữ hai cột chỉ vì đã cùng thang.
WANT: Nhận ra đơn vị đo và đa cộng tuyến là hai vấn đề khác nhau.
:::

## Nối sang bài sau

:::next
Scaling xử lý cột **số**. Nhưng còn cột chữ như giới tính, thành phố, size áo (S/M/L) thì sao? Model cần số, nên phải mã hóa — Ordinal, One-hot, Hash, Embedding.
Đó là nửa còn lại của Step 3.3: [[bài:categorical-encoding]]. Sau đó, [[bài:correlation-multicollinearity]] sẽ kiểm tra các feature đã scale xem có trùng lặp thông tin không.

Thực hành: [[bài:diabetes-first-model]] — tự gõ fit/transform và kiểm mean/std train khác test.
:::
