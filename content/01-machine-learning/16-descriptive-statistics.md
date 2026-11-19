---
title: Step 2 — Thống kê mô tả để hiểu dữ liệu
order: 16
description: "Bốn việc của Step 2 (slide 40 đến 44) trên Diabetes: xem dữ liệu, dtypes, describe tính tay và đọc từng ô, phân bố lớp, số 0 thiếu trá hình, mean xa median."
slides: 40-44
needs: [ml-pipeline]
tags: [describe, mean, median, std, dtypes, statistics]
---

## Nhìn dữ liệu bằng số trước khi sửa gì

:::intro Mục tiêu bài này
- Làm đủ bốn việc của **Step 2 (Statistics)** trong slide 40 đến 44: xem dữ liệu, kiểm tra kiểu, tóm tắt thống kê, đếm phân bố lớp.
- Đọc bảng `describe()`: mean, std, min, các phân vị, max, và biết mỗi con số gợi ý điều gì.
- Phát hiện **dữ liệu thiếu trá hình** (số 0 vô lý), độ lệch và outlier; hiểu thống kê là **manh mối**, không phải kết luận.
:::

Trước khi sửa hay huấn luyện, ta hiểu dữ liệu bằng vài con số. Slide 40 đến 44 đi qua bộ Diabetes bằng bốn thao tác pandas, mỗi thao tác trả lời một câu hỏi:

| Việc (slide) | Code | Câu hỏi |
|---|---|---|
| Xem dữ liệu, *How data looks like* (41) | `pd.read_csv(...)`, `head()` | Bảng trông thế nào? |
| Kiểm tra kiểu, *data type* (42) | `data.dtypes` | Mỗi cột lưu bằng kiểu gì? |
| Tóm tắt thống kê (43) | `data.describe()` | Giá trị mỗi cột trải thế nào? |
| Phân bố lớp, *category distribution* (44) | `data.groupby("Outcome").size()` | Mỗi nhãn có bao nhiêu mẫu? |

:::slides 40-44 | Slide 40–44: Step 2 Statistics trên Diabetes, xem dữ liệu, dtypes, describe, phân bố lớp
:::

## Kiểu dữ liệu và phân bố lớp

**`data.dtypes`** (slide 42) cho thấy cả tám feature và nhãn đều là **numerical**: có **2 cột float** (BMI và DiabetesPedigreeFunction), 7 cột còn lại là `int64` (kể cả `Outcome`, vốn là nhãn). Nhớ rằng `dtype` chỉ cho biết cách **lưu**, không nói bản chất ([[bài:feature-and-data-types]]).

**Phân bố lớp** (slide 44): `Outcome = 0` có **500** mẫu, `Outcome = 1` có **268** mẫu. Tức 65.1% và 34.9%. Đây chính là **mức sàn**: một model luôn đoán "không bệnh" đã đúng 65.1%. Mọi con số accuracy của dự án phải được so với mốc này.

## `describe()` nói gì, và không nói gì?

`data.describe()` (slide 43) cho mỗi cột số: `count` (số ô có giá trị), `mean` (trung bình), `std` (độ trải), `min`, các phân vị `25%`, `50%` (trung vị), `75%`, và `max`. Hãy bấm vào bảng của Diabetes để đọc ý nghĩa từng ô:

:::widget describe-table
:::

:::predict
Nhìn bảng: (1) `Glucose` có `min = 0`: điều đó có nghĩa y học không? (2) `Insulin` có `mean = 79.8` nhưng `50% = 30.5`: hai con số lệch nhau nói lên điều gì?
@answer
(1) **Không**: đường huyết bằng 0 là không thể ở người còn sống; đó là ô **chưa đo** bị ghi thành 0 ("dữ liệu thiếu trá hình"). (2) **Mean lớn hơn median nhiều** nghĩa là phân phối **lệch phải**: nhiều giá trị thấp (kể cả số 0 thiếu) và vài giá trị rất lớn (max 846) kéo trung bình lên. Insulin có `25% = 0`: ít nhất một phần tư số ô là 0.
:::

## Tính tay `describe()` trên 15 hàng

Slide 40 chỉ hiện 15 hàng đầu của bảng. Hãy tự tính tóm tắt của cột **Glucose** trên 15 giá trị đó để biết `describe()` làm gì:

:::steps
15 giá trị Glucose: 148, 85, 183, 89, 137, 116, 78, 115, 197, 125, 110, 168, 139, 189, 166. Xếp tăng dần: **78, 85, 89, 110, 115, 116, 125, 137, 139, 148, 166, 168, 183, 189, 197**.
@step
**min = 78, max = 197.** **Trung vị** (giá trị thứ 8 trong 15) = **137**.
@step
**Trung bình** = tổng / 15 = 2045 / 15 = **136.33**. (Mean và median gần nhau: dãy này khá cân đối.)
@step
**Phân vị 25% và 75%** (nội suy giữa hai giá trị kề nhau như pandas): 25% nằm giữa 110 và 115, được **112.5**; 75% nằm giữa 166 và 168, được **167**.
@step
**std** (pandas chia n − 1): tổng bình phương độ lệch so với trung bình = 20627.33; chia 14 được 1473.38; căn bậc hai: **38.39**.
:::

Kiểm tra bằng `data["Glucose"].head(15).describe()` sẽ cho đúng các số trên. Chú ý `describe()` của pandas dùng std **mẫu** (chia n − 1), còn `StandardScaler` dùng chia n ([[bài:feature-scaling]]).

## Đọc từng manh mối của Diabetes

- **`min = 0` ở cột không thể bằng 0** (Glucose, BloodPressure, SkinThickness, Insulin, BMI): dữ liệu thiếu trá hình. Số ô 0: Glucose **5**, BloodPressure **35**, SkinThickness **227**, Insulin **374**, BMI **11**. Riêng `Pregnancies = 0` (111 ô) hợp lệ. Xử lý ở [[bài:missing-values-outliers]].
- **Mean xa median** (Insulin 79.8 so với 30.5): lệch hoặc có outlier; dùng median khi điền thiếu.
- **`max` quá xa `75%`** (Insulin: 127 so với 846; SkinThickness: 32 so với 99): kiểm tra outlier.
- **`std` rất khác giữa các cột** (Insulin 115, DPF 0.33): các cột khác thang đo, cần [[bài:feature-scaling]].
- **So theo lớp:** trung vị Glucose là **140** ở nhóm bệnh và **107** ở nhóm không bệnh; Age lần lượt **36** và **27**; BMI **34.25** và **30.05**. Glucose tách hai nhóm rõ nhất, khớp với những gì Project Bước 1 thấy bằng histogram.

:::ck
Cột `Age` có min 21 và max 81, còn `Pregnancies` có max 17. Có cần nghi ngờ gì không?
@answer
**Không có dấu hiệu bất thường**: 21 đến 81 là khoảng tuổi hợp lý của bộ dữ liệu, và 17 lần mang thai tuy hiếm vẫn có thể. Thống kê chỉ gợi ý chỗ cần kiểm tra; ta đánh giá theo **ý nghĩa thực tế** của cột, không theo việc con số nghe lớn hay nhỏ.
:::

:::ck
Bạn tính trung bình `Insulin` của cả bảng được 79.8 và đưa nó cho bác sĩ như "insulin điển hình". Có vấn đề gì?
@answer
Con số đó **không đại diện**: 374 trong 768 ô là số 0 thiếu (không phải insulin bằng 0), và vài giá trị lớn kéo mean lên; median (30.5) cũng bị số 0 kéo xuống. Phải xử lý số 0 trước rồi mới nói "điển hình" (sau khi bỏ số 0, median của Insulin là khoảng 125 trên 394 giá trị).
:::

## Tự chạy lại bằng code

Các câu lệnh dưới đây tái hiện đúng những gì vừa đọc (đã chạy trên `diabetes.csv`):

```python
import numpy as np
import pandas as pd
data = pd.read_csv("diabetes.csv")
print(data.shape, data.isna().sum().sum())     # (768, 9) 0: không ô trống nào
print(data.dtypes)                             # kiểu dữ liệu từng cột
print(data["Outcome"].value_counts())          # 0: 500, 1: 268
print(data.describe())                         # count, mean, std, min, 25%, 50%, 75%, max

# Số 0 vô lý ở năm cột mà 0 là không thể
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
print((data[zero_cols] == 0).sum().to_dict())
# {'Glucose': 5, 'BloodPressure': 35, 'SkinThickness': 227, 'Insulin': 374, 'BMI': 11}
print((data[zero_cols] == 0).any(axis=1).sum())    # 376 dòng (49%) có ít nhất một số 0 vô lý

# Tính lại thống kê khi coi các số 0 đó là thiếu
print(data[zero_cols].replace(0, np.nan).describe())
data.groupby("Outcome").mean()                  # so sánh theo nhóm
```

Kết quả khi coi số 0 là thiếu, so với trước đó:

| Cột | count | mean (trước, sau) | median (trước, sau) | min (trước, sau) |
|---|---|---|---|---|
| Glucose | 763 | 120.89, 121.69 | 117, 117 | 0, 44 |
| BloodPressure | 733 | 69.11, 72.41 | 72, 72 | 0, 24 |
| SkinThickness | 541 | 20.54, 29.15 | 23, 29 | 0, 7 |
| Insulin | 394 | 79.80, **155.55** | 30.5, **125** | 0, 14 |
| BMI | 757 | 31.99, 32.46 | 32, 32.3 | 0, 18.2 |

Mean của Insulin **gần gấp đôi** và median **gấp hơn 4 lần** khi bỏ số 0: để nguyên thì model học một bức tranh sai về Insulin. Có **376 trên 768 dòng (49%)** chứa ít nhất một số 0 vô lý, nên xóa hết các dòng đó là mất gần nửa dữ liệu; đó là việc của bài [[bài:missing-values-outliers]]. Bài học chung: dữ liệu thiếu không phải lúc nào cũng là ô trống; nó có thể trốn dưới dạng 0, −1, 999, "N/A", "?".

Một câu `groupby` nữa cho thấy feature nào có vẻ phân biệt được hai nhóm: Glucose trung bình 109.98 (không bệnh) so với **141.26** (bệnh), BMI 30.30 so với 35.14, Age 31.19 so với 37.07, còn BloodPressure gần như không khác (68.18 so với 70.82). Các số này vẫn còn chứa số 0 vô lý nên chỉ để tham khảo; Step 4 sẽ vẽ sự khác biệt này ([[bài:data-visualization]]).

## Những hiểu sai thường gặp

- **"Không có NaN nghĩa là dữ liệu đầy đủ."** Sai: số 0 vô lý che đi dữ liệu thiếu (Diabetes không có ô `NaN` nào).
- **"Mean là giá trị điển hình."** Chỉ khi phân phối cân đối; với dữ liệu lệch, median đại diện tốt hơn.
- **"`std` của pandas và của StandardScaler là một."** Pandas chia n − 1, scaler chia n.
- **"Thống kê đủ để quyết định."** Nó là manh mối; cần nhìn biểu đồ ([[bài:data-visualization]]) và hỏi người hiểu lĩnh vực.

:::card Thống kê mô tả
- **Bốn việc của Step 2 (slide 40–44):** xem dữ liệu, `dtypes`, `describe()`, phân bố lớp.
- **Diabetes:** 2 cột float, 7 cột int; nhãn 500 và 268 (mức sàn 65.1%).
- **`min = 0` ở cột không thể 0** là dữ liệu thiếu trá hình (Insulin 374 ô, SkinThickness 227 ô).
- **Mean xa median** thì lệch hoặc có outlier; **max xa 75%** thì kiểm tra outlier; **std rất khác nhau** thì cần scale.
- **Tính tay mẫu 15 hàng:** Glucose mean 136.33, median 137, Q1 112.5, Q3 167, std 38.39.
- **Thống kê là manh mối**, không phải kết luận.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: `data.info()` cho thấy mọi cột của Diabetes dataset đều có 768
non-null. Có thể kết luận dataset không có dữ liệu thiếu không? Vì sao?
A: Không. Không có ô trống (NaN), nhưng có các giá trị **0 vô
lý** ở Glucose, BloodPressure, SkinThickness, Insulin, BMI — thực chất
là dữ liệu thiếu được ghi bằng 0 (ví dụ Insulin có 374 số 0, chiếm
48.7%). Phải kết hợp thống kê với hiểu biết về ý nghĩa cột mới phát
hiện được.
EN: `info()` shows 768 non-null in every column. Is there no
missing data?
**A:** No. There are no NaNs, but impossible **zeros** in Glucose,
> BloodPressure, SkinThickness, Insulin and BMI are missing values in
> disguise (Insulin: 374 zeros, 48.7%). Spotting them needs domain
> knowledge.

Q: Trong bảng `describe()`, cột Insulin có 25% = 0 và 50% = 30.5.
Hai con số này cho biết điều gì?
A: 25% = 0 nghĩa là **ít nhất một phần tư** số dòng có Insulin
= 0. Median chỉ 30.5 (trong khi mean = 79.8) cho thấy phân bố lệch phải
mạnh và bị kéo xuống bởi rất nhiều số 0. Cả hai đều là dấu hiệu dữ liệu
thiếu trá hình.
EN: Insulin has 25% = 0 and median 30.5. What do they tell you?
**A:** At least a quarter of rows are zero; the low median (vs mean
> 79.8) shows strong right skew dragged down by many zeros — both signs
> of disguised missing data.

Q: Cột Outcome có mean = 0.349. Con số này có ý nghĩa gì?
A: Vì Outcome chỉ gồm 0 và 1, mean = (số người mang nhãn 1) /
(tổng số người) = 268 / 768 ≈ 0.349 → **34.9% người trong dataset mắc
tiểu đường**.
EN: What does Outcome's mean of 0.349 mean?
**A:** For a 0/1 column the mean is the share of class 1: 268 / 768 ≈
> 34.9% of patients are diabetic.

Q: Với phân bố 500 / 268, một model đạt Accuracy 68% có tốt
không? Cần xem thêm gì?
A: Không đáng tin. Model luôn đoán "không bệnh" đã đạt 500 /
768 ≈ 65.1%, nên 68% chỉ hơn khoảng 3 điểm. Cần xem Recall, Precision,
F1 của class 1 (người bệnh) — [[bài:classification-metrics]] — và nên chia dữ liệu bằng
stratified ([[bài:stratified-k-fold]]). Step 3.5 Balance data sẽ học cách cân bằng class.
EN: With 500 / 268, is 68% accuracy good? What else to check?
**A:** Not convincing — always predicting "no diabetes" scores ≈
> 65.1%. Check Recall, Precision and F1 for class 1 (lesson 12), use
> stratified splits (lesson 09); step 3.5 covers balancing.

Q: Tính count, mean, std (chia n − 1), min, 25%, 50%, 75%, max
cho dãy `[2, 4, 4, 5, 10]` theo cách của pandas.
A: count = 5; mean = 25 / 5 = **5**; độ lệch: −3, −1, −1, 0, 5
→ tổng bình phương = 9 + 1 + 1 + 0 + 25 = 36 → std = √(36 / 4) = **3**;
min = 2; 25%: vị trí 0.25 × 4 = 1 → **4**; 50%: vị trí 2 → **4**; 75%:
vị trí 3 → **5**; max = 10. Mean (5) > median (4) → hơi lệch phải do số
10.
EN: pandas-style describe for `[2, 4, 4, 5, 10]`.
**A:** count 5, mean 5, std 3 (36 / 4 = 9), min 2, 25% 4, 50% 4, 75%
> 5, max 10; mean > median → slight right skew from the 10.

Q: `data.dtypes` cho thấy Outcome là `int64`. Có nên coi Outcome là
một feature số liên tục như Glucose không?
A: Không. dtype chỉ là cách lưu trữ. Về ý nghĩa, Outcome là
**biến phân loại nhị phân** (0 = không bệnh, 1 = bệnh) và là **label**
của bài toán Classification; các giá trị 0, 1 là tên class, không phải
đại lượng đo được.
EN: Outcome's dtype is `int64`. Is it a continuous numeric feature
like Glucose?
**A:** No — dtype is just storage. Outcome is a **binary categorical**
> variable and the **label** of a Classification task; 0 and 1 are class
> names, not measurements.
@tier B | Phỏng vấn lý thuyết
Q: Mean và median khác nhau khi có cực trị?
A: Mean dùng mọi độ lớn nên bị cực trị kéo; median dựa vị trí nên bền hơn. Tuy nhiên không kết luận hình dạng chỉ từ hai số: cần xem thêm phân bố.
EN: The mean is sensitive to extreme magnitudes; the median is more robust, but neither alone establishes distribution shape.
Q: Std chia n và n−1 khác gì?
A: Chia n mô tả độ phân tán của tập giá trị đang xét; chia n−1 dùng hiệu chỉnh khi ước lượng variance tổng thể từ mẫu. pandas mặc định n−1; StandardScaler dùng n.
EN: Population-style variance divides by n; sample variance uses n−1. Tool defaults must be checked.
Q: Non-null đủ có nghĩa dữ liệu đủ chất lượng?
A: Không. Sentinel như 0, −1, dấu hỏi có thể không phải NaN, dtype cũng có thể sai. Kiểm tra range, unique values, nghĩa cột và nguồn ghi dữ liệu.
EN: Complete non-null counts can hide missing-value sentinels and invalid measurements.
Q: Vì sao thống kê theo class hữu ích nhưng dễ bị lạm dụng?
A: Nó cho biết nhóm có khác biệt quan sát và gợi ý phân tích tiếp. Chưa cho biết quan hệ nhân quả hay hiệu quả dự đoán ngoài mẫu. Nếu dùng kết quả để chọn feature, thực hiện trên phần development.
EN: Class-wise summaries suggest associations, not causal effects or guaranteed out-of-sample predictive value.
@tier C | Tình huống doanh nghiệp
Q: Bảng mới không có NaN nhưng mean một cột tụt mạnh. Kiểm tra gì?
A: So range, tỷ lệ 0/sentinel, dtype và nguồn thu theo thời gian; kiểm tra đơn vị hoặc mã thiếu mới. Xác nhận với người quản lý dữ liệu trước khi thay thế. Điền vội có thể xóa thay đổi thật *(bổ sung)*.
WANT: Kết hợp thống kê và định nghĩa dữ liệu để chẩn đoán.
Q: Báo cáo chỉ head vài dòng rồi kết luận class cân bằng. Bạn phản biện sao?
A: Đếm toàn bộ nhãn, tỷ lệ theo nhóm/thời gian và baseline majority. Vài dòng đầu có thể sắp theo nguồn hoặc nhãn. Dùng thống kê toàn development pool, giữ test ngoài vòng lựa chọn *(bổ sung)*.
WANT: Biết sampling bias và hạn chế quan sát vài hàng.
Q: Mean doanh thu tăng, median đứng yên. Giải thích thế nào?
A: Kiểm tra các giao dịch lớn, quantile, số khách và lỗi đơn vị, so theo phân khúc. Có thể một nhóm nhỏ tăng mạnh, chưa thể kết luận khách điển hình mua nhiều hơn. Báo cáo cả trung tâm và đuôi phân bố *(bổ sung)*.
WANT: Không lấy một số trung bình thay cho toàn bộ phân bố.
:::

## Nối sang bài sau

:::next
Thống kê đã chỉ ra số 0 bất thường và đuôi phân bố dài. [[bài:missing-values-outliers]] phân biệt dữ liệu thiếu, lỗi đo và điểm hiếm có thật để chọn cách xử lý.
:::
