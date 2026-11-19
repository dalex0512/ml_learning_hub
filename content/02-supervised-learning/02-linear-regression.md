---
title: Linear Regression — học một quan hệ tuyến tính
order: 2
description: "Hồi quy tuyến tính (slide 65-66): đọc công thức, chọn đường bằng bình phương tối thiểu, tính tay, đo trên Diabetes và các giới hạn."
slides: 65-66
needs: [supervised-algorithms, loss-function, regression-metrics]
tags: [linear-regression, ols, coefficient, residual, mse, rmse, r2]
---

## Đường thẳng nào đại diện cho đám điểm?

:::intro Mục tiêu bài này
- Đọc công thức `ŷ = β0 + β1·x1 + … + ε` ở slide 65: predictor, hệ số, nhiễu, simple và multiple.
- Hiểu cách chọn đường: làm **tổng bình phương sai số nhỏ nhất** (OLS), và tính tay được độ dốc, tung độ gốc.
- Đọc hệ số, đo mô hình bằng MAE/RMSE/R² trên dữ liệu chưa thấy, và biết giới hạn (outlier, ngoại suy, giả định).
:::

## Bài toán: kéo một đường qua đám điểm

:::slides 65-66 | Slide 65–66: Linear Regression, ví dụ experience và Salary, công thức, quan hệ tăng/giảm, ưu và nhược điểm
:::

Slide 65 vẽ **experience** (số năm kinh nghiệm) trên trục x và **Salary** (lương) trên trục y: các điểm không nằm đúng trên một đường, nhưng có xu hướng tăng. Hồi quy tuyến tính kéo **một đường thẳng** qua đám điểm để dự đoán giá trị số. Slide nhấn ba ý: đây là **một trong những thuật toán cơ bản và đơn giản nhất** của Supervised Learning; **simple** là một input feature, **multiple** là từ hai input feature trở lên; hợp với dữ liệu **tuyến tính**.

Mỗi điểm cách đường một đoạn dọc gọi là **sai số (residual)** `y − ŷ`. Nhiều đường cùng "trông hợp lý", nên cần tiêu chuẩn chọn. Hồi quy tuyến tính chọn đường làm **tổng bình phương sai số** nhỏ nhất (OLS), chính là L2 ở [[bài:loss-function]]. Hãy kéo hai núm độ dốc `m` và tung độ gốc `b` để tự thấy:

:::widget linear-fit
:::

:::predict
Với sáu điểm (1, 1.5), (2, 2.4), (3, 2.8), (4, 4.5), (5, 4.9), (6, 6.3), đường tối ưu có độ dốc xấp xỉ bao nhiêu: gần 0.5, gần 1, hay gần 2?
@answer
**Gần 1 (0.949).** Khi x tăng thêm 1 thì y tăng khoảng 0.95. Tung độ gốc b = 0.413 và SSE nhỏ nhất = **0.427**, so với 3.95 của đường m = 0.5, b = 2 mà ta bắt đầu.
:::

## Đọc công thức trên slide

```text
ŷ = β0 + β1·x1 + β2·x2 + … + βp·xp + ε
```

- **ŷ** (response, biến phụ thuộc): giá trị cần dự đoán. **x1…xp** (predictor, biến độc lập, feature): đầu vào.
- **β0** (intercept): giá trị mô hình cho khi mọi feature bằng 0; nếu x = 0 nằm ngoài miền dữ liệu thì nó chỉ là tham số định vị đường. **β1…βp** (coefficient, hệ số): mức dự đoán thay đổi khi feature đó tăng 1 đơn vị, **giữ các feature còn lại cố định**; đơn vị là đơn vị y trên một đơn vị x.
- **ε** (random error, "noise"): phần dao động ngẫu nhiên mô hình không giải thích; nó là sai số **chưa quan sát**. Còn **residual** `y − ŷ` là số ta **tính được** sau khi fit.
- **Dấu mũ** trên β̂ nghĩa là hệ số **ước lượng** từ dữ liệu: `coef_` trong code là β̂.

Slide 66 nhắc hai điều đọc nhanh: đường dốc **lên** là quan hệ **tăng** (hệ số dương), dốc **xuống** là quan hệ **giảm** (hệ số âm).

## Tính tay độ dốc và tung độ gốc

:::steps
Trung bình: x̄ = 3.5, ȳ = 3.733.
@step
**Độ dốc** m = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)². Với dữ liệu trên, tử số = **16.6**, mẫu số = **17.5**, nên m = 16.6 / 17.5 = **0.949**.
@step
**Tung độ gốc** b = ȳ − m·x̄ = 3.733 − 0.949 × 3.5 = **0.413**.
@step
Đường tối ưu: **ŷ = 0.949x + 0.413**. Tổng bình phương sai số = 0.427, và không đường thẳng nào làm nó nhỏ hơn.
:::

Công thức này chỉ dùng được khi các x **không đều bằng nhau** (mẫu số khác 0). Với nhiều feature, người ta dùng nghiệm ma trận hoặc bộ giải least-squares; thực hành dùng `LinearRegression` của sklearn, không tự nghịch đảo ma trận.

:::ck
Năm điểm x = [1,2,3,4,5], y = [2,4,5,4,5]. Độ dốc và tung độ gốc là bao nhiêu? Dự đoán tại x = 6 có đáng tin không?
@answer
x̄ = 3, ȳ = 4, tử số = 6, mẫu số = 10, nên **m = 0.6, b = 2.2**. Dự đoán tại x = 6 là 5.8, nhưng dữ liệu chỉ có x từ 1 đến 5: đó là **ngoại suy**, kém tin cậy.
:::

## Thử trên dữ liệu thật: đo trên bộ test

Trên Diabetes, bỏ các hàng có BloodPressure = 0 hoặc BMI = 0 (số 0 thiếu, còn 729 hàng), thử dự đoán **huyết áp** từ tuổi và BMI. Chia 75/25 (`random_state=42`), fit trên train, đo trên test:

| Feature | Hệ số | R² | MAE | RMSE |
|---|---|---|---|---|
| Baseline: luôn đoán trung bình train | | | 9.60 | 12.29 |
| Age | 0.320 | 0.161 | 8.69 | 11.25 |
| BMI | 0.570 | 0.026 | 9.20 | 12.12 |
| Age + BMI | 0.314 và 0.560 | **0.181** | **8.38** | **11.11** |

Đọc: tuổi tăng 1 năm thì huyết áp dự đoán tăng khoảng 0.32 mmHg (giữ BMI cố định). Thêm feature giúp một chút, nhưng R² chỉ **0.181**: mô hình giải thích được chưa tới 1/5 biến thiên, hơn baseline ít (MAE 8.38 so với 9.60). Đây là bài học trung thực: hệ số "đọc được" không có nghĩa mô hình dự đoán tốt. Số đo phải so với baseline ([[bài:regression-metrics]]).

## Giả định, ưu nhược và bẫy

Slide 66 liệt kê:

- **Ưu (good):** đơn giản, dễ cài và huấn luyện nhanh; overfitting có thể giảm bằng regularization; chạy tốt khi dữ liệu **gần tuyến tính**.
- **Nhược (bad):** giả định dữ liệu độc lập (hiếm gặp ngoài đời); dễ bị nhiễu và overfitting; **nhạy với outlier**.

Thêm: quan hệ phải gần tuyến tính (nếu cong, dùng [[bài:polynomial-regression]]); các feature không trùng nhau (đa cộng tuyến làm hệ số bất ổn, [[bài:correlation-multicollinearity]]); và **không nên ngoại suy** xa ngoài miền dữ liệu.

:::ck
Đường hồi quy học từ x trong khoảng 1 đến 6. Bạn có nên tin dự đoán cho x = 60 không?
@answer
**Không nên.** Đó là **ngoại suy** ra xa vùng dữ liệu đã thấy; quan hệ có thể đổi hình dạng ngoài vùng đó (ví dụ bão hòa). Mô hình chỉ có bằng chứng trong khoảng nó đã học.
:::

## Code: từ phép tính tay tới bộ test

**Đối chiếu năm điểm tính tay.** x = [1, 2, 3, 4, 5], y = [2, 4, 5, 4, 5] cho m = 0.6, b = 2.2. Công thức, `lstsq` và scikit-learn phải ra cùng nghiệm:

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([2, 4, 5, 4, 5], dtype=float)
slope = np.sum((x - x.mean()) * (y - y.mean())) / np.sum((x - x.mean())**2)
intercept = y.mean() - slope * x.mean()
design = np.column_stack([np.ones(len(x)), x])
beta, *_ = np.linalg.lstsq(design, y, rcond=None)      # bộ giải least-squares
model = LinearRegression().fit(x[:, None], y)
pred = model.predict(x[:, None])
assert np.allclose(beta, [intercept, slope])
assert np.allclose([model.intercept_, model.coef_[0]], [2.2, 0.6])
assert np.allclose(pred, [2.8, 3.4, 4.0, 4.6, 5.2])
print("MSE:", mean_squared_error(y, pred))             # 0.48
print("MAE:", mean_absolute_error(y, pred))             # 0.64
print("RMSE train:", np.sqrt(mean_squared_error(y, pred)))   # 0.6928...
print("x=6:", model.predict([[6]]))                      # [5.8]: ngoại suy
```

**Một điểm nhiễu kéo cả đường.** Đổi giá trị cuối từ 5 thành 20:

```python
changed = y.copy()
changed[-1] = 20
pulled = LinearRegression().fit(x[:, None], changed)
print(pulled.intercept_, pulled.coef_)    # -3.8  [3.6]: từ (2.2, 0.6) thành (-3.8, 3.6)
```

Chỉ một điểm thay đổi mà độ dốc nhảy từ 0.6 lên 3.6 và tung độ gốc từ 2.2 xuống −3.8: đó là sự **nhạy với outlier** của bình phương tối thiểu.

**Chia train/test và so với baseline** (đúng đoạn tạo ra bảng huyết áp ở trên, chạy trên `diabetes.csv`):

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
d = pd.read_csv("diabetes.csv")
d = d[(d.BloodPressure > 0) & (d.BMI > 0)]          # bỏ số 0 thiếu: còn 729 hàng
X, t = d[["Age", "BMI"]], d["BloodPressure"]
Xtr, Xte, ytr, yte = train_test_split(X, t, test_size=0.25, random_state=42)
lr = LinearRegression().fit(Xtr, ytr)
p = lr.predict(Xte)
print(lr.coef_.round(3), round(lr.intercept_, 2))   # [0.314 0.56] 43.93
print(round(r2_score(yte, p), 3), round(mean_absolute_error(yte, p), 2))   # 0.181 8.38
base = np.full(len(yte), ytr.mean())                # baseline: luôn đoán trung bình train
print(round(mean_absolute_error(yte, base), 2))     # 9.6
```

Luôn fit trên train, đo trên test, và đặt cạnh baseline trung bình: R² 0.181 và MAE 8.38 chỉ có nghĩa khi so với MAE 9.60 của baseline.

## Những hiểu sai thường gặp

- **"Đường phải đi qua mọi điểm."** Không; nó chỉ làm tổng bình phương sai số nhỏ nhất.
- **"Hệ số lớn nghĩa là feature quan trọng."** Hệ số phụ thuộc đơn vị; so sánh cần cùng thang đo.
- **"Hệ số là quan hệ nhân quả."** Nó chỉ mô tả quan hệ model học từ dữ liệu.
- **"Residual và ε là một."** ε là nhiễu chưa quan sát, residual là `y − ŷ` đo được.
- **"R² cao là mô hình tốt, R² thấp là vô dụng."** Phải so với baseline và đo trên dữ liệu chưa thấy; ở ví dụ huyết áp, R² 0.181 vẫn hơn baseline một chút.
- **"Cần dữ liệu phân phối chuẩn mới fit được."** OLS tính nghiệm mà không cần; giả định chuẩn liên quan suy luận thống kê.

:::card Linear Regression
- **Mô hình** ŷ = β0 + β1x1 + … + ε; simple = 1 feature, multiple ≥ 2.
- **Học:** chọn hệ số làm tổng bình phương sai số nhỏ nhất (OLS).
- **Công thức một feature:** m = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²; b = ȳ − m·x̄ (ví dụ: m = 0.949, b = 0.413).
- **Đọc hệ số:** thay đổi dự đoán trên mỗi đơn vị feature, giữ các feature khác cố định.
- **Đo trên test, so baseline:** Age + BMI dự đoán huyết áp có R² 0.181, MAE 8.38 so với 9.60.
- **Giới hạn:** gần tuyến tính, nhạy outlier, **không ngoại suy**.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Simple và multiple khác nhau ở số mẫu hay số feature? ε khác residual ra sao?
A: Khác số feature: một và từ hai trở lên. ε là sai số chưa quan sát của mô hình; residual là y − ŷ tính được sau fit. Cả hai không phải một tham số thêm được học riêng cho từng dự đoán mới.
Q: Với năm điểm trong bài, tính β̂0, β̂1 và dự đoán tại x = 6.
A: x̄ = 3, ȳ = 4, tử số slope = 6, mẫu số = 10; β̂1 = 0.6, β̂0 = 2.2. Dự đoán 5.8, là ngoại suy vì train chỉ có x từ 1 tới 5.
Q: SSE = 2.4 trên năm điểm thì MSE và RMSE là bao nhiêu? Có chứng minh tổng quát hóa tốt không?
A: MSE = 0.48, RMSE ≈ 0.6928. Không; đây là các điểm đã dùng để fit, cần kiểm trên dữ liệu chưa thấy với cách split hợp lý.
Q: Một mô hình nhiều biến có β̂ diện tích = 0.03 tỉ/m². Tăng 10 m² nghĩa là gì?
A: Giữ các feature khác cố định, giá dự đoán tăng 0.3 tỉ. Không tự là hiệu ứng nhân quả hoặc cam kết giá bán thật.
Q: y hoặc X không phân phối chuẩn thì sklearn.LinearRegression có bị cấm dùng không?
A: Không. OLS tính nghiệm mà không yêu cầu y/X chuẩn; giả định chuẩn liên quan sai số và suy luận cổ điển. Vẫn cần kiểm cấu trúc trung bình, lỗi dữ liệu và chất lượng ngoài mẫu.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Giải thích hệ số β cho người không chuyên mà không hứa quá mức.
A: Ví dụ giá nhà: mỗi m² tăng thêm tương ứng mức tăng giá dự đoán bằng hệ số, khi các feature khác giữ nguyên. Nói rõ đơn vị, miền dữ liệu và đây là quan hệ model học từ dữ liệu; không tự thành hiệu ứng của việc sửa nhà.
EN: A coefficient describes a predicted change per unit of a feature, holding other modeled features fixed; it is not automatically a causal effect.
Q: **B2.** Vì sao OLS dùng bình phương, không dùng trị tuyệt đối?
A: Bình phương tạo mục tiêu trơn và cấu trúc least-squares thuận tiện, đồng thời phạt mạnh residual lớn; với mô hình thống kê phù hợp, OLS ước lượng quan hệ trung bình. Trị tuyệt đối là lựa chọn khác, bền hơn với residual lớn và gắn với median có điều kiện. Không khẳng định OLS luôn tốt hơn; chọn theo dữ liệu/mục tiêu.
EN: Squared loss gives a smooth least-squares objective and emphasizes large residuals. Absolute loss is a different, more outlier-resistant objective associated with conditional medians.
Q: **B3.** Hai feature tương quan rất mạnh thì hệ số và dự đoán có gì khác nhau?
A: Hệ số có thể đổi lớn/đổi dấu khi dữ liệu thay nhẹ vì khó phân chia đóng góp. Dự đoán trong miền quan sát vẫn có thể ổn, nhưng không bảo đảm khi quan hệ feature thay đổi. Kiểm cấu trúc biến, độ ổn định và validation; cân nhắc bỏ biến trùng/regularization, không xóa máy móc theo một ngưỡng r.
EN: Correlated predictors can destabilize individual coefficients even if in-distribution predictions remain stable; investigate redundancy and validate any remedy.
Q: **B4.** Linear Regression có bắt buộc dùng gradient descent và scale không?
A: Không. Có least-squares solver trực tiếp; sklearn LinearRegression dense thông thường không dùng vòng gradient descent. OLS không penalty với intercept bất biến về prediction khi đổi đơn vị khả nghịch trong điều kiện giải tốt; scale hữu ích cho điều kiện số, gradient descent và penalty. Tiền xử lý phải fit train.
EN: Linear Regression can use direct least-squares solvers. Scaling aids numerical conditioning and iterative or penalized fitting, but is not a universal requirement for unpenalized OLS predictions.
Q: **B5.** Giả định sai số chuẩn và phương sai không đổi có cần để gọi fit không?
A: Không. Chúng liên quan tính chất thống kê và suy luận/khoảng bất định thông thường. Heteroscedasticity không tự làm OLS không tính được hay chắc chắn gây bias khi E[ε|X] = 0; nhưng standard error thường có thể sai. Phân biệt mục tiêu dự đoán với suy luận và kiểm residual.
EN: These assumptions are not required to compute OLS; they matter for conventional uncertainty estimates and efficiency. Heteroscedasticity alone does not imply biased coefficients under conditional mean zero errors.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Model giá nhà có R² test rất cao nhưng môi giới phản ánh dự đoán sai ở khu mới. Bạn kiểm tra gì?
A: Xác nhận test độc lập về thời gian/khu vực, kiểm biến chỉ biết sau giao dịch và cách fit tiền xử lý. Xem MAE/RMSE/residual theo khu, diện tích, khoảng giá; so baseline và miền feature. Khu mới có thể là shift/ngoại suy; cần validation phản ánh triển khai và thu thập dữ liệu đại diện, không chỉ tăng độ phức tạp để nâng R² toàn tập.
WANT: Nhìn qua con số tổng hợp để kiểm quy trình, phân nhóm và miền triển khai.
Q: **C2.** Dự báo doanh số với chi quảng cáo và số lượt xem; hệ số quảng cáo đổi dấu qua các tháng. Sếp muốn cắt quảng cáo. Bạn trả lời sao?
A: Không dùng dấu hệ số làm quyết định nhân quả. Kiểm cộng tuyến giữa chi quảng cáo/lượt xem, lịch mùa vụ, nhãn/độ trễ và độ ổn định theo split thời gian. Tách mục tiêu dự báo với đo hiệu ứng quảng cáo; thử nghiệm can thiệp hoặc thiết kế nhân quả phù hợp mới hỗ trợ quyết định cắt. Có thể giữ model cho dự đoán nếu kiểm chứng tốt, nhưng hạn chế diễn giải hệ số.
WANT: Phân biệt dự đoán với quyết định can thiệp và giải thích được hệ số bất ổn.
Q: **C3.** RMSE tăng mạnh vì vài đơn hàng doanh số cực lớn. Team đề xuất xóa chúng. Bạn làm gì?
A: Kiểm lỗi nhập/đơn vị trước, đối chiếu đó có phải đơn thật thuộc phạm vi phục vụ. Nếu thật, báo cáo riêng nhóm lớn và so MAE/RMSE/chi phí; cân nhắc loss bền, feature hoặc mô hình phù hợp trên validation. Xóa điểm thật chỉ để đẹp metric làm đánh giá lệch và có thể mất nhóm quan trọng; ghi rõ nếu thay phạm vi bài toán.
WANT: Biết điều tra outlier và cân bằng độ bền của model với giá trị nghiệp vụ của các trường hợp hiếm.
:::

## Nối lại bản đồ module

:::next
Khi dữ liệu cong, đường thẳng có thể chưa đủ: [[bài:polynomial-regression]] thêm lũy thừa của input mà vẫn giữ cách học OLS. Quay về [[bài:supervised-algorithms]] để đặt hai mô hình trong bản đồ; ôn [[bài:regression-metrics]] và [[bài:data-visualization]] để kiểm kết quả.
:::
