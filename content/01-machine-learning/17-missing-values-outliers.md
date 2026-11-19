---
title: Step 3.1–3.2 — Xử lý dữ liệu thiếu và Outliers
order: 17
description: "Hai phần đầu của Step 3 (slide 45 và 46): bỏ hay điền dữ liệu thiếu bằng median học từ train, và phát hiện outlier bằng IQR và z-score trên Insulin, quyết định theo nguyên nhân."
slides: 45-46
needs: [descriptive-statistics]
tags: [missing, imputation, outlier, iqr, zscore, MCAR, MAR, MNAR, MissForest, IterativeImputer]
---

## Dữ liệu thiếu hay dữ liệu khác thường: xử lý thế nào mà không rò rỉ?

:::intro Mục tiêu bài này
- Nhận ra ba dạng vấn đề ở slide 45 và 46: ô thiếu rõ ràng, giá trị thiếu hoặc sai trá hình, và **outlier**.
- Chọn cách xử lý thiếu (bỏ hay điền) và biết vì sao điền bằng **median học từ train**.
- Phát hiện outlier bằng **IQR** và **z-score**, thấy chúng cho kết quả khác nhau, và quyết định giữ, cắt hay bỏ theo nguyên nhân.
:::

Slide 45 và 46 là hai trong **bốn phần của Step 3 (Data preprocessing)**: *Handle missing or invalid values* (3.1), *Remove outliers* (3.2), *Data transformation* (3.3: [[bài:feature-scaling]], [[bài:categorical-encoding]]) và *Remove multicollinearity* (3.4: [[bài:correlation-multicollinearity]]). Bài này làm hai phần đầu.

## Ba dạng vấn đề

1. **Ô thiếu rõ ràng:** giá trị `NaN`, ô trống. Slide 45 dùng bảng Titanic với các ô thiếu (Missing values) ở những cột như `Age` và `Cabin`; `isna()` đếm được.
2. **Thiếu hoặc sai trá hình:** ô bị ghi thành giá trị "thay thế" như `0`, `-1`, `"N/A"`. Phải nhìn `describe()` ([[bài:descriptive-statistics]]) mới thấy. Diabetes không có ô `NaN` nào, nhưng **374** ô Insulin và **227** ô SkinThickness là số 0 vô lý.
3. **Giá trị khác thường (outlier):** nằm rất xa phần lớn dữ liệu. Slide 46 minh họa bằng một chú chim cánh cụt **trắng giữa bầy đen**: nó có thật, nhưng khác thường.

:::slides 45-46 | Slide 45–46: Step 3.1 xử lý dữ liệu thiếu hoặc sai; Step 3.2 loại bỏ outliers
:::

## Dữ liệu thiếu: bỏ hay điền?

**Bỏ hàng** đơn giản nhưng đắt. Nhìn 20 bệnh nhân đầu của Diabetes: cột Insulin có **11 ô bằng 0** trên 20. Xóa mọi hàng đó thì chỉ còn 9 bệnh nhân, mất hơn một nửa dữ liệu (cả các cột khác của họ, vốn đo đầy đủ). **Điền** (imputation) giữ lại dữ liệu bằng một giá trị hợp lý: trung bình, **trung vị**, giá trị phổ biến nhất, hoặc dự đoán từ các cột khác. Hãy tự thử cả bốn cách trên đúng 20 giá trị đó:

:::widget missing-outlier
impute
:::

:::predict
Trong 9 giá trị Insulin đã biết của 20 bệnh nhân đầu (83, 88, 94, 96, 168, 175, 230, 543, 846), trung bình là 258 và trung vị là 168. Điền ô thiếu bằng cái nào hợp lý hơn, và vì sao?
@answer
**Trung vị (168).** Hai giá trị rất lớn (543 và 846) kéo trung bình lên 258, cao hơn tới 7 trong 9 giá trị thật. Điền bằng trung bình gán cho người chưa đo một giá trị lớn hơn phần đông người thật sự được đo. Trung vị **bền** với giá trị cực đoan. Trên bộ train của Project: median Insulin là **120**, mean là **154.3**.
:::

Việc điền cũng là một bước **học từ dữ liệu** (nó tính median), nên theo luật chung: **tính median chỉ từ train** rồi áp cho cả train và test; tốt nhất đặt `SimpleImputer` trong Pipeline ([[bài:ml-pipeline]]). Ở Project Bước 7, điền median cho năm cột **không làm điểm cross-validation đổi đáng kể**: dọn dữ liệu đúng nguyên tắc không đảm bảo điểm tăng, chỉ đo bằng CV mới biết.

:::ck
Bạn điền ô thiếu bằng median của **toàn bộ** dữ liệu (cả test) rồi mới chia train/test. Điều đó sai ở đâu?
@answer
Median đã tính cả hàng test, nên giá trị điền cho train mang thông tin của test: một dạng **rò rỉ dữ liệu**. Với một con số đơn giản thì rò rỉ nhỏ, nhưng nguyên tắc không đổi, và với các bước học nhiều hơn (điền theo nhóm, điền bằng model) rò rỉ có thể lớn. Đúng cách: chia trước, `fit` imputer trên train.
:::

## Outlier: phát hiện bằng hai cách

Hai cách phổ biến, áp vào cột Insulin (394 giá trị khác 0):

:::steps
**IQR:** sắp xếp rồi lấy phân vị 25% **Q1 = 76.25** và 75% **Q3 = 190**. Khoảng giữa **IQR = Q3 − Q1 = 113.75**.
@step
**Hàng rào trên** = Q3 + 1.5 × IQR = 190 + 170.6 = **360.6**. Có **24** giá trị lớn hơn hàng rào: coi là outlier theo IQR.
@step
**z-score:** mean = 155.55, std = 118.63. Một giá trị bị coi là outlier nếu |z| = |(x − mean) / std| > 3. Có **8** giá trị vượt (giá trị lớn nhất, 846, có z = 5.82).
@step
Hai cách cho **24 so với 8**: khác nhau vì Insulin **lệch phải mạnh**, mean và std bị chính các giá trị lớn kéo lên nên z-score "dễ tính" hơn. Với dữ liệu lệch, IQR đáng tin hơn.
:::

Hãy tự kéo hệ số k của IQR và ngưỡng z để thấy số outlier đổi:

:::widget missing-outlier
outlier
:::

## Phát hiện rồi thì làm gì?

Quyết định theo **nguyên nhân**, không theo con số:

- **Là lỗi nhập liệu** (tuổi 200, giá nhà thiếu hoặc thừa số 0): sửa hoặc bỏ.
- **Là giá trị thật nhưng hiếm** (Insulin 846 ở một bệnh nhân thật): thường **giữ**; dùng scaler bền, model ít nhạy, hoặc biến đổi (ví dụ log).
- **Cắt ngưỡng (winsorize):** thay giá trị vượt hàng rào bằng chính hàng rào; ngưỡng phải học từ **train**.
- Chim cánh cụt trắng ở slide 46 là bài học: nó **hiếm nhưng thật**; xóa nó là xóa một phần của thế giới mà model cần gặp.

:::ck
Insulin 846 vượt hàng rào 360.6. Bạn nên xóa bệnh nhân đó khỏi dữ liệu không?
@answer
**Chưa nên vội.** Hãy kiểm tra: đó có thể là bệnh nhân thật có insulin cao, chính là kiểu mẫu ta muốn model nhận ra. Chỉ xóa khi xác định là lỗi. Nếu giữ, dùng cách xử lý bền (cắt ngưỡng, scaler bền, hoặc model ít nhạy như cây). Outlier **không đồng nghĩa với lỗi**.
:::

## Làm trên Diabetes bằng code

**Phát hiện thiếu trá hình, và vì sao không xóa dòng.** Không có ô trống thật (`isna().sum().sum()` bằng 0), nhưng có số 0 vô lý. Đổi chúng thành `NaN` rồi đếm:

```python
import numpy as np
import pandas as pd
data = pd.read_csv("diabetes.csv")
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
clean = data.copy()
clean[zero_cols] = clean[zero_cols].replace(0, np.nan)
rows_missing = clean[zero_cols].isna().any(axis=1)
print(rows_missing.sum(), (~rows_missing).sum())            # 376 392
print(clean.dropna()["Outcome"].value_counts().to_dict())   # {0: 262, 1: 130}
```

Xóa mọi dòng có ô thiếu chỉ còn **392 dòng** (262 không bệnh, 130 bệnh): mất gần nửa dữ liệu, trong đó mất **138 trên 268** người bệnh, đúng lớp ta đang cần. Vì vậy ta điền thay vì xóa.

**Điền đúng cách: fit trên train.** Tạo cột chỉ báo "từng bị thiếu" cho hai cột thiếu nhiều **trước khi điền**, rồi để median chỉ học từ train:

```python
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
X = clean.drop(columns="Outcome"); y = clean["Outcome"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)
for col in ["SkinThickness", "Insulin"]:
    X_train[f"{col}_missing"] = X_train[col].isna().astype(int)
    X_test[f"{col}_missing"] = X_test[col].isna().astype(int)
imputer = SimpleImputer(strategy="median")
imputer.fit(X_train)                           # median chỉ học từ train
X_train_f = pd.DataFrame(imputer.transform(X_train), columns=X_train.columns)
X_test_f = pd.DataFrame(imputer.transform(X_test), columns=X_test.columns)
print(dict(zip(X_train.columns, imputer.statistics_.round(2).tolist())))
# Glucose 117.0, BloodPressure 72.0, SkinThickness 29.0, Insulin 125.0, BMI 32.4, ...
print(X_train_f.isna().sum().sum(), X_test_f.isna().sum().sum())   # 0 0
```

**Phát hiện outlier bằng IQR và z-score.** Hàng rào IQR là `Q1 − 1.5·IQR` đến `Q3 + 1.5·IQR`; điểm có `|z| > 3` cũng bị đánh dấu:

```python
def iqr_bounds(s, k=1.5):
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    return q1 - k * iqr, q3 + k * iqr

rows = []
for col in X.columns:
    s = clean[col].dropna()
    lo, hi = iqr_bounds(s)
    z = (s - s.mean()) / s.std(ddof=0)
    rows.append({"feature": col, "lo": round(lo, 3), "hi": round(hi, 3),
                 "out_iqr": int(((s < lo) | (s > hi)).sum()),
                 "out_z3": int((z.abs() > 3).sum())})
print(pd.DataFrame(rows).to_string(index=False))
```

Kết quả (sau khi đã coi số 0 vô lý là thiếu): Insulin hàng rào từ −94.375 đến 360.625, **24** điểm ngoài theo IQR và **8** điểm theo z-score; BloodPressure 14 và 8; BMI 8 và 4; Age 9 và 5; DiabetesPedigreeFunction 29 và 11; Glucose không có điểm nào. Hai quy tắc không trùng nhau: IQR chặt hơn z-score với phân phối lệch như Insulin.

**Xử lý outlier: cắt ngưỡng học từ train, hoặc nén đuôi bằng log.**

```python
lo, hi = iqr_bounds(X_train["Insulin"].dropna())          # ngưỡng chỉ tính trên train
X_train["Insulin_capped"] = X_train["Insulin"].clip(lower=lo, upper=hi)
X_test["Insulin_capped"] = X_test["Insulin"].clip(lower=lo, upper=hi)   # áp ngưỡng của train
print(round(hi, 3), X_train["Insulin"].max(), X_train["Insulin_capped"].max())
# 344.75 744.0 344.75   (ngưỡng train khác ngưỡng toàn bộ dataset 360.625)
print(clean["Insulin"].skew().round(2), np.log1p(clean["Insulin"]).skew().round(2))
# 2.17 -0.09   sau log1p (= log(1 + x)) phân bố gần đối xứng
```

Chú ý ngưỡng 344.75 tính trên train khác 360.625 tính trên toàn bộ dataset: dùng ngưỡng của train cho cả test, đúng quy tắc không rò rỉ.

## Những hiểu sai thường gặp

- **"Không có NaN nghĩa là không thiếu."** Số 0 vô lý che đi dữ liệu thiếu (Diabetes không có `NaN` nhưng 374 ô Insulin thiếu).
- **"Điền bằng mean luôn ổn."** Mean nhạy với giá trị cực đoan; với dữ liệu lệch, median an toàn hơn.
- **"Outlier là phải bỏ."** Có thể là tín hiệu quan trọng; bỏ theo nguyên nhân.
- **"z-score và IQR cho cùng kết quả."** Khác nhau khi dữ liệu lệch (24 so với 8).
- **"Dọn dữ liệu chắc chắn tăng điểm."** Project Bước 7: không đáng kể; chỉ CV mới cho biết.

:::card Dữ liệu thiếu và outlier
- **Step 3 có bốn phần (slide 45–46):** xử lý thiếu, bỏ outlier, biến đổi dữ liệu, bỏ đa cộng tuyến.
- **Ba dạng:** ô `NaN`, thiếu trá hình (0, −1, "N/A"), outlier.
- **Xử lý thiếu:** bỏ (20 bệnh nhân đầu mất 11/20) hoặc điền; **median** (168) bền hơn mean (258) khi có giá trị lớn.
- **Điền là bước học từ dữ liệu:** median chỉ tính từ train, đặt trong Pipeline.
- **Outlier:** IQR (hàng rào Q3 + 1.5 IQR = 360.6, 24 giá trị) và z-score (|z| > 3, 8 giá trị); khác nhau khi dữ liệu lệch.
- **Quyết định theo nguyên nhân:** lỗi thì sửa hoặc bỏ; thật mà hiếm thì thường giữ.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: [[slide:45]] chia Step 3 thành những bước con nào? Bước 3.5 nằm ở
đâu?
A: 01 Handle missing or invalid value, 02 Remove outliers, 03
Data Transformation, 04 Remove multicollinearity. Bước 3.5 Balance data
không nằm trong 4 ô này mà ở [[slide:52-54]] ([[bài:imbalanced-data]]).
EN: Which sub-steps does [[slide:45]] list? Where is step 3.5?
**A:** Handle missing/invalid values, remove outliers, data
> transformation, remove multicollinearity; step 3.5 (balance data) is
> on slides 52–54 (lesson 21).

Q: Vì sao với cột Insulin nên điền **median** thay vì **mean**?
A: Insulin lệch phải mạnh và có outlier (846): vài giá trị rất
lớn kéo mean lên cao (ở ví dụ 20 dòng: mean 258.1, median 168). Median
không bị outlier kéo nên đại diện cho bệnh nhân điển hình tốt hơn.
EN: Why fill Insulin with the median rather than the mean?
**A:** Insulin is strongly right-skewed with outliers that inflate the
> mean (258.1 vs median 168 in the 20-row example); the median is
> robust.

Q: Một bạn điền Insulin thiếu bằng "median Insulin của những người
có cùng Outcome". Cách này sai ở đâu?
A: Outcome là label. Khi dự đoán bệnh nhân mới ta chưa biết
Outcome nên không áp dụng được; khi đánh giá thì giá trị điền đã "mách"
label cho model → **data leakage**, điểm đánh giá đẹp giả tạo.
EN: What's wrong with filling Insulin by the median of patients with
the same Outcome?
**A:** Outcome is the label — unknown at prediction time, and using it
> leaks the answer into the features (**data leakage**).

Q: Cho dãy 4, 5, 5, 6, 7, 8, 30. Dùng quy tắc IQR (vị trí
p × (n − 1)) tìm outlier.
A: n = 7. Q1: vị trí 0.25 × 6 = 1.5 → giữa 5 và 5 = **5**;
Q3: vị trí 4.5 → giữa 7 và 8 = **7.5**; IQR = **2.5**; cận dưới = 5 −
3.75 = **1.25**; cận trên = 7.5 + 3.75 = **11.25** → **30** là outlier.
EN: IQR outliers in 4, 5, 5, 6, 7, 8, 30?
**A:** Q1 = 5, Q3 = 7.5, IQR = 2.5, fences 1.25 and 11.25 → 30.

Q: Cùng dãy trên, z-score (std chia n) của 30 là bao nhiêu? Quy
tắc |z| > 3 có bắt được 30 không? Vì sao?
A: mean = 65 / 7 ≈ 9.286; Σ(x − mean)² ≈ 511.43 → std =
√(511.43 / 7) ≈ 8.55 → z(30) ≈ (30 − 9.286) / 8.55 ≈ **2.42** < 3 →
**không bắt được**. Hai lý do: 30 kéo mean và std lên (*masking*), và
với n = 7 thì |z| tối đa chỉ là √6 ≈ 2.45 — quy tắc |z| > 3 vô dụng với
mẫu này. IQR ở Câu 4 thì bắt được.
EN: z-score of 30 in that list; does |z| > 3 catch it?
**A:** z ≈ 2.42 < 3 → not caught: masking, and with n = 7 the
> maximum possible |z| is √6 ≈ 2.45.

Q: Giải thích vì sao không nên xóa các dòng có outlier trong tập
test.
A: Tập test mô phỏng dữ liệu thật mà model sẽ gặp khi triển
khai; ngoài đời không thể bỏ một bệnh nhân vì chỉ số lạ. Xóa outlier ở
test làm điểm đánh giá đẹp hơn thực tế. Với test chỉ áp dụng các phép
biến đổi (cắt ngưỡng, log) đã học từ train.
EN: Why not delete outlier rows from the test set?
**A:** The test set mimics real data; deleting rows inflates the
> score. Only apply train-learned transformations to it.
Q: Điền mean cho [10, 20, 30, thiếu, thiếu] làm std chia n đổi thế nào so với phần quan sát?
A: Mean = 20. Tổng bình phương độ lệch vẫn 200; trước là √(200/3) ≈ 8.1650, sau là √(200/5) ≈ 6.3246. Đây là so phần quan sát với tập sau điền, không phải biết được variance của toàn bộ dữ liệu thật.
@tier B | Phỏng vấn lý thuyết
Q: Khi nào dùng median thay mean để điền?
A: Median phù hợp baseline cho biến số lệch hoặc có cực trị vì ít bị kéo. Nó vẫn làm giảm variation và có thể bỏ qua quan hệ với cột khác; cần kiểm chứng trên validation.
EN: Median imputation is robust to extreme values but can reduce variation and ignore conditional relationships.
Q: IQR khác z-score ra sao?
A: IQR dùng quantile và khoảng giữa, z-score dùng mean/std nên dễ bị cực trị kéo. Hai quy tắc chỉ tạo cờ điều tra, không xác nhận điểm sai.
EN: IQR uses quartiles; z-scores use the mean and standard deviation and can suffer from masking.
Q: MCAR, MAR, MNAR phân biệt thế nào?
A: MCAR không phụ thuộc dữ liệu; MAR phụ thuộc biến đã quan sát; MNAR vẫn phụ thuộc giá trị chưa quan sát sau khi xét biến quan sát. Không xác định chắc cơ chế chỉ từ bảng dữ liệu thiếu.
EN: MCAR is independent missingness; MAR depends on observed variables; MNAR depends on unobserved values after conditioning on observed data.
Q: Vì sao thêm missing indicator có ích nhưng chưa đủ?
A: Thiếu có thể phản ánh quy trình thu thập nên indicator giữ tín hiệu đó. Nhưng model có thể học quy trình của nguồn cũ và không tổng quát; indicator không tự khử bias do MNAR.
EN: Missingness indicators can preserve useful signals but may encode collection bias and do not generally correct MNAR.
Q: MissForest có bảo đảm giữ phân phối và điền theo tần suất không?
A: Không. Nó học dự đoán từng cột từ các cột khác, có thể giữ quan hệ tốt hơn một hằng số trong dữ liệu phù hợp. Nó không phải bộ lấy mẫu theo histogram; dự đoán điểm vẫn có bias và cần kiểm chứng với cơ chế thiếu, mục tiêu và baseline.
EN: MissForest learns conditional predictions through iterative forests; it does not guarantee exact recovery of distributions or category frequencies.
@tier C | Tình huống doanh nghiệp
Q: Cột số có nhiều giá trị 0. Đổi hết thành missing được không?
A: Đọc định nghĩa và quy trình ghi trước: 0 có thể là giá trị thật, như số lần mua. Kiểm tra theo nguồn, thời gian và trường liên quan; chỉ đổi sentinel đã xác nhận, rồi thử imputation trong train. Đổi nhầm xóa tín hiệu thật *(bổ sung)*.
WANT: Không áp quy tắc từ Diabetes cho mọi cột số.
Q: Khi nào không được xóa outlier? Fraud có nhiều giao dịch rất lớn bị IQR đánh dấu, bạn làm gì?
A: Kiểm tra lỗi đơn vị/nhập liệu và liên hệ nhãn; giữ giao dịch hiếm có thật vì có thể chính là mục tiêu phát hiện. Thử biến đổi hoặc model bền, đánh giá trên dữ liệu đại diện. Xóa có thể nâng metric chung nhưng phá recall fraud *(bổ sung)*.
WANT: Phân biệt lỗi dữ liệu với tín hiệu hiếm quan trọng.
Q: Insulin thiếu nhiều, muốn bỏ cột ngay. Bạn quyết định sao?
A: So baseline có/không cột, median kèm indicator và phương án khác trên cùng split. Kiểm tra thiếu do nhóm nào và lúc serving có đo không. Cột thiếu nhiều vẫn có ích; model phức tạp hơn tăng chi phí và nguy cơ học bias nguồn *(bổ sung)*.
WANT: Không dùng một ngưỡng tỷ lệ thiếu làm quyết định tuyệt đối.
Q: Team muốn dùng MissForest cho bảng có cả mã sản phẩm và số đo để khỏi phải nghĩ về kiểu dữ liệu. Bạn xử lý sao?
A: Xác định cột số, categorical, target và thời điểm quan sát trước. Chọn triển khai hỗ trợ mixed types hoặc pipeline riêng, không dùng RandomForestRegressor để nội suy mã category. So median/mode với forest trong CV, fit chỉ train; đánh đổi chi phí, schema và khả năng tổng quát khi gặp category mới.
WANT: Phân biệt thuật toán MissForest với ví dụ iterative regressor, không dùng tên thư viện thay cho thiết kế dữ liệu.
:::

## Nối sang bài sau

:::next
Sau khi hiểu và xử lý giá trị thiếu/ngoại lai, các cột vẫn có thể khác nhau rất xa về đơn vị. [[bài:feature-scaling]] đưa feature số về thang đo thích hợp và giữ quy tắc fit trên train.

Thực hành: [[bài:diabetes-evaluate-improve]] — đổi sentinel0 đúng cột và học median trong train/fold.
:::
