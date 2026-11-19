---
title: Step 3.4 — Correlation và Multicollinearity
order: 20
description: "Hệ số tương quan Pearson chỉ đo quan hệ tuyến tính (slide 50); đa cộng tuyến (slide 51) làm hệ số bất ổn dù dự đoán vẫn ổn, đo bằng VIF, và số thật trên Diabetes."
slides: 50-51
needs: [feature-scaling, categorical-encoding]
tags: [correlation, multicollinearity, vif, pearson, causation, feature-importance]
---

## Hai câu hỏi khác nhau về quan hệ giữa các cột

:::intro Mục tiêu bài này
- Tính và đọc **hệ số tương quan Pearson r** (slide 50), và nhớ rằng nó chỉ đo quan hệ **tuyến tính**, không phải nhân quả.
- Phân biệt hai câu hỏi: **feature với target** (có ích không?) và **feature với feature** (có trùng nhau không?).
- Hiểu **đa cộng tuyến** (slide 51): quy tắc |r| > 0.7, vì sao nó làm hệ số bất ổn, và cách đo bằng VIF.
:::

Slide 50 và 51 là hai mặt của cùng một công cụ. Slide 50 hỏi về **variables (features, target)**: cột nào có liên quan tới đáp án. Slide 51 hỏi về **các features với nhau**: có cột nào đang nói **cùng một điều** không.

1. **Feature với target:** cột này có liên quan tới đáp án không? (Có ích để dự đoán không?)
2. **Feature với feature:** hai cột này có đang trùng nhau không? (Có dư thừa không?)

## Hệ số tương quan Pearson (slide 50)

Slide 50 định nghĩa **correlation** là mức độ hai hay nhiều biến có quan hệ **tuyến tính** với nhau, hệ số nằm trong **[−1, 1]**, kèm lời nhắc: *correlation does not imply causation*. Công thức:

> r = Σ(xᵢ − x̄)(yᵢ − ȳ) / √( Σ(xᵢ − x̄)² · Σ(yᵢ − ȳ)² )

:::steps
Năm điểm (x, y): (1, 2), (2, 4), (3, 5), (4, 4), (5, 5). Trung bình x̄ = 3, ȳ = 4.
@step
Độ lệch: dx = (−2, −1, 0, 1, 2), dy = (−2, 0, 1, 0, 1).
@step
Tổng tích chéo Σ dx·dy = 4 + 0 + 0 + 0 + 2 = **6**. Σ dx² = **10**, Σ dy² = **6**.
@step
**r = 6 / √(10 × 6) = 6 / 7.746 ≈ 0.775**: quan hệ tuyến tính khá mạnh, cùng chiều.
:::

:::slides 50 | Slide 50: correlation, công thức Pearson, các scatter plot với r khác nhau và quan hệ Sales với Temperature
:::

## r chỉ đo quan hệ tuyến tính

Slide 50 vẽ hai thứ: sáu biểu đồ phân tán với r từ −1 đến 1 (cho thấy r càng gần ±1 thì điểm càng nằm sát một đường thẳng), và một đồ thị **Sales theo Temperature** có dạng **vòm cong** (doanh số cao ở nhiệt độ vừa phải, thấp ở quá lạnh hoặc quá nóng). Với dạng vòm đó, doanh số phụ thuộc rất rõ vào nhiệt độ, nhưng nửa tăng và nửa giảm triệt tiêu nhau nên r gần 0.

:::predict
Một cột y phụ thuộc **rất rõ** vào x theo dạng parabol (đường cong chữ U hoặc vòm). Hệ số r giữa x và y sẽ khoảng bao nhiêu?
@answer
**Gần 0.** Nửa trái đường cong đi xuống, nửa phải đi lên (hoặc ngược lại), nên hai nửa triệt tiêu nhau. Y phụ thuộc hoàn toàn vào x mà r vẫn ≈ 0: **r chỉ đo quan hệ tuyến tính**. Hãy thử ngay bên dưới.
:::

:::widget corr-drag
:::

## Tương quan trên Diabetes

Tương quan của từng cột Diabetes với `Outcome` (feature với target): Glucose **0.467**, BMI 0.293, Age 0.238, Pregnancies 0.222, DPF 0.174, Insulin 0.131, SkinThickness 0.075, BloodPressure 0.065. Glucose mạnh nhất, nhưng không cột nào đủ để quyết định một mình, và hệ số thấp **không** chứng minh cần mô hình phi tuyến (Project Bước 8).

Còn **feature với feature**: cặp mạnh nhất là Pregnancies và Age với r = **0.544**; tiếp theo SkinThickness với Insulin (0.437). **Không cặp nào vượt 0.7**, nên theo quy tắc của slide 51, bộ Diabetes **không có đa cộng tuyến** đáng lo.

Một chi tiết thú vị liên kết với [[bài:missing-values-outliers]]: các số 0 thiếu trá hình làm sai hệ số. Khi bỏ các hàng có Glucose = 0, r giữa Glucose và Outcome tăng từ 0.467 lên **0.495**; với BMI từ 0.293 lên **0.314**. Số 0 giả làm tương quan **bị kéo xuống**.

## Đa cộng tuyến (slide 51)

Slide 51 định nghĩa **(multi)collinearity**: mức độ hai hay nhiều **features** có quan hệ tuyến tính với nhau. Quy tắc thường dùng: hệ số tương quan **> 0.7 hoặc < −0.7** cho thấy hiện tượng (đa) cộng tuyến. Hình Venn của slide cho thấy ý nghĩa: khi các biến độc lập **chồng lấn** nhau (multicollinearity), phần "giải thích" của chúng không còn tách bạch.

Hậu quả với model tuyến tính là **hệ số bất ổn**. Mô phỏng hai feature gần như trùng nhau: cân nặng tính bằng kg và bằng lb (r = 0.9997), với dự đoán thật phụ thuộc 0.3 × kg. Lấy ba mẫu con khác nhau, hệ số của (kg, lb) lần lượt là (−0.15, 0.21), (−1.63, 0.89), (−0.06, 0.18): **đổi mạnh cả dấu lẫn độ lớn**. Nhưng **tác động tổng** (hệ số kg + 2.2046 × hệ số lb) lại ổn định, khoảng 0.31 đến 0.34. Vì vậy **dự đoán vẫn tốt, nhưng việc đọc hệ số hỏng**.

:::ck
Hai feature `Weight_kg` và `Weight_lb` có r = 0.999. Dự đoán của model tuyến tính có hỏng không? Còn việc đọc hệ số?
@answer
**Dự đoán thường vẫn tốt**, vì hai cột chứa cùng thông tin. Nhưng **việc đọc hệ số hỏng**: model có thể gán +0.89 cho cột này và −1.63 cho cột kia, nên không thể nói "cân nặng ảnh hưởng thế nào". Cần bỏ một cột (hoặc gộp) nếu muốn giải thích.
:::

**VIF** (variance inflation factor) đo mức một feature bị giải thích bởi **các feature còn lại**: VIF = 1 / (1 − R²). VIF = 1 là không trùng; VIF trên khoảng 5 đến 10 là tín hiệu để điều tra (không phải án quyết). VIF của các feature Diabetes chỉ từ **1.07 đến 1.59**: rất thấp, khớp với kết luận "không đa cộng tuyến".

Cách xử lý khi có đa cộng tuyến: bỏ một trong hai cột, gộp chúng (trung bình, hiệu), dùng regularization, hoặc PCA. Cây quyết định và Random Forest ít bị ảnh hưởng.

:::ck
Slide 50 nhắc "correlation does not imply causation". Glucose có r = 0.467 với Outcome. Bạn kết luận "đường huyết cao gây tiểu đường" được không?
@answer
**Không.** r cao chỉ nói hai cột **đi cùng nhau**; nó không nói cột nào là nguyên nhân, và có thể có yếu tố thứ ba. Trong y học, đường huyết cao vừa là triệu chứng vừa liên quan tới nhiều yếu tố khác. Tương quan là **manh mối để điều tra**, không phải bằng chứng nhân quả.
:::

## Tính r và đa cộng tuyến bằng code

**Pearson r bằng tay và bằng thư viện.** Sáu căn hộ (diện tích 45, 60, 70, 85, 100, 120 m²; số phòng ngủ 1, 2, 2, 3, 3, 4): x̄ = 80, ȳ = 2.5, tổng tích độ lệch = 140, nên r = 140 / √(3750 × 5.5) = 140 / 143.61 ≈ **0.975**. Mọi tích đều dương (căn nào diện tích trên trung bình cũng có số phòng trên trung bình), nên r gần 1. Nếu cả hai cùng làm feature dự đoán giá, chúng **cộng tuyến**: nên giữ một hoặc gộp thành "diện tích trung bình mỗi phòng".

```python
import numpy as np
import pandas as pd
x = np.array([45, 60, 70, 85, 100, 120])
y = np.array([1, 2, 2, 3, 3, 4])
num = ((x - x.mean()) * (y - y.mean())).sum()
den = np.sqrt(((x - x.mean())**2).sum() * ((y - y.mean())**2).sum())
print(num, den, num / den)                 # 140.0 143.61 0.9748
print(np.corrcoef(x, y)[0, 1])             # 0.9748 (NumPy)
print(pd.Series(x).corr(pd.Series(y)))     # 0.9748 (pandas)
print(np.corrcoef(x / 100, y * 10)[0, 1])  # vẫn 0.9748: r không đổi khi scale
u = np.array([-2, -1, 0, 1, 2])
print(np.corrcoef(u, u**2)[0, 1])          # 0.0: quan hệ chữ U hoàn toàn xác định, r vẫn bằng 0
```

Ví dụ nhỏ trên Diabetes: năm dòng đầu, Age (50, 31, 32, 21, 33) và Pregnancies (6, 1, 8, 1, 0) cho r ≈ **0.494**; dòng thứ ba (32 tuổi, mang thai 8 lần) có tích **âm** kéo r xuống. Trên cả 768 dòng r = 0.544: gần, nhưng đó là may, vì 5 điểm quá ít để tin.

**Tương quan trên Diabetes.**

```python
data = pd.read_csv("diabetes.csv")
corr = data.corr()                          # ma trận 9x9, Pearson mặc định
print(corr["Outcome"].drop("Outcome").sort_values(ascending=False).round(3))
# Glucose 0.467, BMI 0.293, Age 0.238, ...

def high_corr_pairs(df, threshold=0.7):     # liệt kê các cặp |r| > ngưỡng, mỗi cặp một lần
    c = df.corr().abs()
    upper = c.where(np.triu(np.ones(c.shape, dtype=bool), k=1))
    pairs = upper.stack().sort_values(ascending=False)
    return pairs[pairs > threshold]
features = data.drop(columns="Outcome")
print(high_corr_pairs(features, 0.7))       # rỗng: không cặp nào vượt 0.7
print(high_corr_pairs(features, 0.3))       # Pregnancies-Age 0.544, SkinThickness-Insulin 0.437, ...

zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
clean = data.copy()
clean[zero_cols] = clean[zero_cols].replace(0, np.nan)    # số 0 vô lý thành thiếu
print(clean.corr().loc["SkinThickness", "BMI"].round(3))  # 0.648 (trước: 0.393)
```

Số 0 vô lý làm hệ số bị kéo xuống: sau khi coi chúng là thiếu, tương quan SkinThickness với BMI tăng từ 0.393 lên 0.648.

**VIF: một feature được giải thích bởi các feature còn lại đến đâu.** `VIF = 1 / (1 − R²)` của hồi quy phụ:

```python
from sklearn.linear_model import LinearRegression
def vif(df):
    out = {}
    for col in df.columns:
        others = df.drop(columns=col)
        r2 = LinearRegression().fit(others, df[col]).score(others, df[col])
        out[col] = 1 / (1 - r2)
    return pd.Series(out).round(3)
print(vif(features))   # lớn nhất: Age 1.588, SkinThickness 1.507; không cột nào gần 5 hay 10
```

**Hệ số bất ổn khi có đa cộng tuyến** (dữ liệu mô phỏng: "số phòng" gần như tỉ lệ với diện tích, giá chỉ phụ thuộc diện tích):

```python
rng = np.random.default_rng(0)
n = 200
area = rng.uniform(40, 120, n)
rooms = area / 30 + rng.normal(0, 0.15, n)
price = 0.04 * area + rng.normal(0, 0.3, n)
X2 = np.c_[area, rooms]
print(np.corrcoef(area, rooms)[0, 1].round(3))          # 0.982: cộng tuyến mạnh
for seed in [1, 2, 3]:
    idx = np.random.default_rng(seed).choice(n, 60, replace=False)   # 3 mẫu con khác nhau
    both = LinearRegression().fit(X2[idx], price[idx]).coef_
    one = LinearRegression().fit(X2[idx][:, :1], price[idx]).coef_
    print(seed, "2 feature:", both.round(3), "| chỉ diện tích:", one.round(4))
# Hệ số của "rooms" nhảy mạnh giữa các mẫu: 0.388, 0.165, 0.053
# Chỉ dùng diện tích thì hệ số ổn định quanh 0.04 (0.0407, 0.0396, 0.0384)
```

Ngưỡng |r| > 0.7 là quy ước để **điều tra**, không phải kiểm định hay lệnh bỏ cột; không có cặp vượt ngưỡng cũng chưa loại trừ được phụ thuộc giữa nhiều biến (đó là việc của VIF). Và "feature với target tương quan tốt, feature với feature tương quan xấu" chỉ là cách gợi nhớ trong bối cảnh mô hình tuyến tính: cây và boosting thường chịu được feature trùng nhau.

## Những hiểu sai thường gặp

- **"r = 0 thì không có quan hệ."** Chỉ không có quan hệ **tuyến tính**; parabol vẫn có quan hệ rõ.
- **"r cao là nguyên nhân."** Tương quan không phải nhân quả.
- **"Đa cộng tuyến làm model dự đoán kém."** Chủ yếu làm **hệ số bất ổn và khó đọc**; dự đoán thường vẫn ổn.
- **"Tương quan thấp với target nghĩa là bỏ cột."** Một cột tương quan thấp một mình vẫn có thể có ích khi kết hợp với cột khác.
- **"Tính r trên dữ liệu thô là đủ."** Số 0 thiếu trá hình và outlier làm r sai; dọn dữ liệu trước.

:::card Correlation và Multicollinearity
- **Hai câu hỏi:** feature với target (có ích?) và feature với feature (trùng lặp?).
- **Pearson r** trong [−1, 1], chỉ đo **tuyến tính**; parabol rõ ràng vẫn có r ≈ 0; tương quan không phải nhân quả (slide 50).
- **Diabetes:** Glucose với Outcome r = 0.467 (0.495 sau khi bỏ số 0); cặp feature mạnh nhất Pregnancies–Age 0.544 < 0.7.
- **Đa cộng tuyến (slide 51):** |r| > 0.7 giữa các features; hệ số bất ổn (kg và lb), dự đoán vẫn ổn; đo bằng VIF (Diabetes 1.07–1.59).
- **Xử lý:** bỏ hoặc gộp cột, regularization, PCA; cây ít bị ảnh hưởng.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Hai feature có r = −0.85. Đọc ý nghĩa và cho biết có
multicollinearity theo [[slide:51]] không.
A: Quan hệ tuyến tính **âm, mạnh**: feature này tăng thì feature
kia giảm khá đều. |r| = 0.85 > 0.7 (r < −0.7) → **có** cộng tuyến; nên
bỏ bớt một hoặc gộp lại.
EN: Two features have r = −0.85. Meaning? Multicollinearity?
**A:** Strong negative linear relationship; |r| > 0.7 → yes,
> collinear — drop or combine one.

Q: Correlation giữa một feature và **target** cao là tốt hay xấu?
Giữa hai **feature** với nhau cao là tốt hay xấu?
A: Feature – target cao là **tốt**: feature hữu ích để dự đoán
([[slide:50]]). Feature – feature cao là **xấu** với model tuyến tính
(multicollinearity — [[slide:51]]): thông tin trùng lặp, hệ số không ổn định.
EN: High feature–target correlation: good or bad? High
feature–feature?
**A:** Feature–target: good (predictive). Feature–feature: bad for
> linear models (redundancy, unstable coefficients).

Q: Tính r cho x = 1, 2, 3, 4 và y = 2, 4, 5, 9.
A: x̄ = 2.5, ȳ = 5. Độ lệch x: −1.5, −0.5, 0.5, 1.5; y: −3,
−1, 0, 4. Σ tích = 4.5 + 0.5 + 0 + 6 = **11**; Σ(x − x̄)² = **5**;
Σ(y − ȳ)² = 9 + 1 + 0 + 16 = **26** → r = 11 / √130 ≈ 11 / 11.40 ≈
**0.965**.
EN: r for x = 1, 2, 3, 4 and y = 2, 4, 5, 9?
**A:** Σ products 11, Σ squares 5 and 26 → r = 11/√130 ≈ 0.965.

Q: Hình doanh số theo nhiệt độ ở [[slide:50]] cho r ≈ 0. Có thể kết
luận "nhiệt độ không ảnh hưởng doanh số" không?
A: Không. Pearson chỉ đo quan hệ **tuyến tính**; doanh số tăng
rồi giảm (chữ U ngược) nên hai nửa triệt tiêu, r ≈ 0 dù quan hệ rất rõ.
Phải vẽ scatter plot trước khi kết luận.
EN: [[slide:50]]'s sales-vs-temperature chart has r ≈ 0. Does
temperature not matter?
**A:** No — Pearson measures only linear relationships; the inverted U
> cancels out. Plot first.

Q: Số máy điều hòa bán ra và số ca sốc nhiệt ở Hà Nội có r = 0.8.
Có nên kết luận điều hòa gây sốc nhiệt?
A: Không — **correlation does not imply causation**. Cả hai
cùng do biến ẩn **nắng nóng** gây ra.
EN: AC sales and heatstroke cases correlate at 0.8. Do ACs cause
heatstroke?
**A:** No — a confounder (heat) drives both.

Q: Trong Diabetes dataset, r(SkinThickness, BMI) = 0.393 khi giữ
nguyên số 0, nhưng 0.648 khi đổi số 0 thành NaN. Vì sao?
A: Các số 0 là dữ liệu thiếu trá hình ([[bài:missing-values-outliers]]): một người có
BMI 35 nhưng SkinThickness ghi 0 tạo ra những điểm "lạc" xa đường xu
hướng, làm quan hệ trông yếu hơn thật. Bỏ chúng đi thì thấy tương quan trên phần dữ liệu quan sát còn lại mạnh hơn → phải xử lý dữ liệu thiếu trước khi tính correlation.
EN: Why does r(SkinThickness, BMI) jump from 0.393 to 0.648 when
zeros become NaN?
**A:** The zeros are disguised missing values creating stray points
> that weaken the apparent relationship; clean them first.
Q: Model phi tuyến có học được một quan hệ tuyến tính không?
A: Có. “Phi tuyến” mô tả khả năng biểu diễn, không cấm quan hệ tuyến tính. Cây có thể xấp xỉ quan hệ đó bằng các ngưỡng; vì thế không giải thích tính bền với cộng tuyến bằng câu “cây không quan tâm quan hệ tuyến tính”.
@tier B | Phỏng vấn lý thuyết
Q: r bằng 0 có nghĩa độc lập không?
A: Không. Ví dụ y=x² trên x đối xứng cho r=0 nhưng quan hệ hoàn toàn xác định. Pearson chỉ đo phần liên hệ tuyến tính; cần scatter và hiểu dạng quan hệ.
EN: Zero Pearson correlation does not imply independence; deterministic nonlinear relationships can have zero correlation.
Q: Cộng tuyến ảnh hưởng dự đoán và diễn giải giống nhau?
A: Không. Hệ số có thể rất bất ổn dù dự đoán trong miền quen thuộc vẫn khá ổn. Khi ngoại suy hoặc phân phối quan hệ feature đổi, rủi ro tăng; không lấy coefficient làm tác động nhân quả.
EN: Multicollinearity can destabilize coefficients without greatly changing in-distribution predictions.
Q: VIF bổ sung gì so với ma trận correlation?
A: VIF hồi quy mỗi feature theo tất cả feature khác, đo mức phóng đại variance qua 1/(1−R²). Nó phát hiện tổ hợp nhiều biến mà từng cặp chưa có r rất lớn.
EN: VIF detects multivariate linear redundancy that a pairwise correlation matrix can miss.
Q: Xóa một trong hai feature tương quan cao dựa vào gì?
A: Xem chất lượng đo, missing, chi phí thu thập, tính sẵn có khi serving và khả năng dự đoán trên validation. Có thể dùng regularization thay xóa; ngưỡng r không đủ quyết định.
EN: Choose remedies using measurement quality, availability, cost, and validation performance, not a correlation threshold alone.
Q: Random Forest có điểm dự đoán ổn thì feature importance của hai cột tương quan cao có đáng tin riêng từng cột?
A: Chưa chắc. Cột thay thế nhau có thể chia importance, hoặc permutation từng cột trông ít ảnh hưởng vì cột còn lại giữ tín hiệu. Kiểm tra theo nhóm feature và validation; không đồng nhất importance với nhân quả.
EN: Correlated predictors can share attribution or mask individual permutation importance even when predictive performance is stable.
@tier C | Tình huống doanh nghiệp
Q: Hai feature có r=0.95, quản lý yêu cầu bỏ một. Bạn làm gì?
A: Kiểm tra định nghĩa, leakage và chất lượng, so mô hình giữ cả với regularization và bỏ từng cột trên cùng split. Nếu cần diễn giải hệ số, ưu tiên biến ổn định và dễ đo; nếu cần dự đoán, dùng bằng chứng validation. Bỏ cột có thể giảm chi phí nhưng mất thông tin ở vùng hiếm *(bổ sung)*.
WANT: Ra quyết định từ mục tiêu và kiểm chứng, không chỉ ngưỡng.
Q: Một feature có r thấp với target nên team loại ngay. Có vấn đề?
A: Xem scatter và tương tác với cột khác, kiểm tra missing và nhóm dữ liệu. r thấp chỉ nói liên hệ tuyến tính đơn biến thấp. So qua validation trước khi bỏ; giữ mọi biến cũng có chi phí và nguy cơ nhiễu *(bổ sung)*.
WANT: Nhận ra quan hệ phi tuyến và thông tin có điều kiện.
Q: Hệ số đổi dấu giữa các lần train nhưng điểm ổn. Giải thích sao?
A: Kiểm tra cộng tuyến, VIF và độ ổn định qua mẫu con, đồng thời xác nhận pipeline giống nhau. Thử gộp/bỏ cột hoặc regularize để ổn định. Không diễn giải dấu hệ số là tác động kinh doanh khi chưa xử lý các phụ thuộc *(bổ sung)*.
WANT: Phân biệt ổn định dự đoán với ổn định diễn giải.
Q: Hai biến tương quan cao cùng có importance thấp khi hoán vị riêng, quản lý muốn bỏ cả hai. Bạn làm gì?
A: Kiểm tra định nghĩa và leakage; thử bỏ từng biến rồi bỏ cả nhóm trên cùng validation, hoặc hoán vị nhóm để xem tín hiệu chung. Nếu chúng thay thế nhau, phép đo riêng có thể che vai trò của nhóm. Cân nhắc chi phí đo và độ ổn định, không kết luận từ một kiểu importance.
WANT: Biết sự thay thế giữa feature làm diễn giải sai dù metric dự đoán tốt.
:::

## Nối sang bài sau

:::next
Quan hệ giữa các feature mới là một phần chất lượng dữ liệu. [[bài:imbalanced-data]] quay lại phân bố target để so cách học và ra quyết định khi class cần tìm rất hiếm.
:::
