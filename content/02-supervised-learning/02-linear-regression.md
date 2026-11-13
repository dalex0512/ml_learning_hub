---
title: Linear Regression — học một quan hệ tuyến tính
order: 2
description: "Đọc mô hình β trên slide 65–66, tính tay đường bình phương tối thiểu và kiểm tra dự đoán bằng sklearn; phân biệt khớp dữ liệu với diễn giải nhân quả."
slides: 65-66
needs: [supervised-algorithms, loss-function, regression-metrics]
tags: [linear-regression, ols, coefficient, residual, mse, rmse, r2]
---

## Đường thẳng nào đại diện cho đám điểm?

:::intro Đọc xong bài này bạn làm được
- Phân biệt simple và multiple Linear Regression, đọc intercept/hệ số/sai số.
- Tính một đường OLS cho năm điểm và kiểm residual, MSE/RMSE.
- Fit/predict bằng sklearn, so test với baseline và nhận ra giới hạn ngoại suy.
- Giải thích vì sao hệ số dễ đọc vẫn chưa chứng minh quan hệ nhân quả.
:::

[[bài:supervised-algorithms]] đặt Linear Regression ở cột hồi quy. [[slide:65]] minh họa **experience → Salary**: các điểm không nằm đúng trên đường, nhưng có một xu hướng tăng. Model học một quan hệ tuyến tính để dự đoán **giá trị số**, không cần đi qua mọi điểm. “Khớp nhất” phải gắn với loss cụ thể từ [[bài:loss-function]]; ở đây ta dùng **ordinary least squares (OLS)**, tức tổng bình phương residual nhỏ nhất.

> **EN:** Linear Regression predicts a numeric response from a linear predictor. Ordinary least squares chooses coefficients that minimize the sum of squared residuals; the fitted line need not pass through every observation.

:::slides 65-66 | Experience–Salary, công thức β, simple/multiple và ưu/nhược điểm
:::

:::note Phần nào thuộc slide, phần nào bổ sung?
Slide 65 có ví dụ experience/Salary, simple một input feature, multiple từ hai input features và công thức có β, ε. Slide 66 có quan hệ tăng/giảm và bảng ưu/nhược. **OLS, công thức tính tay, các cách tối ưu, bảng giả định và code dưới đây là bổ sung ngoài slide**, để nối kiến thức đã học; không suy ra tọa độ số từ hình Salary.
:::

## Đọc β và ε: quan sát khác với dự đoán

:::formula
**Simple Linear Regression** — một feature:
```text
y = β0 + β1 x + ε
ŷ = β̂0 + β̂1 x
```
<!-- note: đường dự đoán không cộng một ε chưa biết -->

**Multiple Linear Regression** — p feature, ký hiệu theo slide 65:
```text
y = β0 + β1 x1 + β2 x2 + ... + βp xp + ε
ŷ = β̂0 + β̂1 x1 + β̂2 x2 + ... + β̂p xp
```
<!-- note: nhiều feature vẫn tuyến tính theo hệ số -->
:::

**β0** là intercept: giá trị trên mô hình khi các feature bằng 0. Nếu x = 0 nằm ngoài miền dữ liệu, intercept có thể chỉ là tham số định vị đường, không có diễn giải thực tế đáng tin. **βi** là mức thay đổi dự đoán khi xi tăng một đơn vị, **giữ các feature còn lại cố định**. Dấu dương/âm ứng với xu hướng tăng/giảm như hình [[slide:66]]. Đơn vị hệ số là đơn vị y trên một đơn vị xi.

**ε** là sai số chưa quan sát trong mô hình thống kê; **residual** là số ta tính sau khi fit: `ei = yi − ŷi`. Dấu mũ trên β̂ chỉ hệ số ước lượng từ dữ liệu. Khi code in `coef_`, đó là β̂, không phải biết tham số thật của thế giới. Simple/multiple nói về **số feature**, không phải số mẫu hay số target.

> **EN:** The intercept is the fitted value at zero features; a coefficient gives the predicted change per unit of its feature with the others held fixed. The unobserved error ε differs from the fitted residual y − ŷ. Estimated coefficients are denoted by hats.

:::worked Đọc hệ số bằng đơn vị (bổ sung, mô hình tự soạn)
Giả sử `ŷ = 0.5 + 0.03 × diện_tích`, diện tích tính bằng m², giá tính bằng tỉ VND. Hệ số 0.03 nghĩa là thêm 1 m² tương ứng dự đoán tăng **0.03 tỉ = 30 triệu VND** trong mô hình. Thêm 10 m² → tăng 0.3 tỉ. Trong mô hình nhiều biến, phát biểu này còn kèm “giữ các biến còn lại cố định”. Không được suy thành cam kết sửa nhà thêm 10 m² sẽ làm giá bán tăng đúng số đó.
:::

## Học hệ số bằng bình phương tối thiểu (bổ sung ngoài slide)

Với n mẫu, OLS chọn β̂ để tối thiểu `SSE = Σ(yi − ŷi)²`. Chia SSE cho n ra **MSE**, không đổi nghiệm tối ưu khi dùng cùng tập dữ liệu. Lấy căn ra RMSE để báo cáo cùng đơn vị y; nối lại [[bài:regression-metrics]]. Bình phương khiến residual lớn đóng góp mạnh, nên outlier có thể kéo đường lệch. Chọn loss khác là một lựa chọn mô hình/ước lượng khác, không còn OLS thuần.

> **EN:** Minimizing SSE or MSE yields the same OLS coefficients on a fixed dataset. Squaring magnifies large residuals, while RMSE restores the response unit for reporting.

:::formula
**Nghiệm cho một feature có intercept** — khi x không hằng:
```text
β̂1 = Σ(xi − x̄)(yi − ȳ) / Σ(xi − x̄)²
β̂0 = ȳ − β̂1 x̄
```
<!-- note: x hằng → mẫu số 0, không xác định duy nhất slope và intercept -->

**Nghiệm ma trận và gradient descent** — chỉ cần hiểu cách học:
```text
X̃ = [cột 1, X]
β̂ = (X̃ᵀX̃)⁻¹ X̃ᵀy       nếu X̃ đủ hạng cột
β ← β − α ∇β MSE           cập nhật lặp với learning rate α
```
<!-- note: thực hành dùng least-squares solver, không tự nghịch đảo ma trận -->
:::

Nghiệm đóng mô tả đích tối ưu; **gradient descent** tiến dần tới đích bằng cập nhật. Không phải mọi Linear Regression đều học bằng gradient descent. Với ma trận dense thông thường, `sklearn.LinearRegression` dùng least-squares solver; `numpy.linalg.lstsq` giúp tránh tự tính nghịch đảo. Khi thiếu hạng, nghiệm hệ số có thể không duy nhất; thư viện vẫn có thể chọn một nghiệm, nhưng không chữa được vấn đề diễn giải.

> **EN:** Closed-form expressions describe the solution, while gradient descent approaches it iteratively. Numerical least-squares solvers avoid explicit matrix inversion; rank deficiency can leave individual coefficients unidentifiable.

## Tính tay một đường rồi kiểm residual (bổ sung ngoài slide)

:::worked Năm điểm tự soạn, không phải tọa độ Salary trên slide
Cho x = `[1,2,3,4,5]`, y = `[2,4,5,4,5]`. Đây là dữ liệu minh họa không gắn đơn vị thực.

1. `x̄ = 3`, `ȳ = 4`.
2. `Σ(x−3)(y−4) = 4 + 0 + 0 + 0 + 2 = 6`.
3. `Σ(x−3)² = 4 + 1 + 0 + 1 + 4 = 10`.
4. `β̂1 = 6/10 = 0.6`, `β̂0 = 4 − 0.6×3 = 2.2`.

| x | y | ŷ = 2.2 + 0.6x | Residual y − ŷ | Residual² |
|---|---|---|---|---|
| 1 | 2 | 2.8 | −0.8 | 0.64 |
| 2 | 4 | 3.4 | +0.6 | 0.36 |
| 3 | 5 | 4.0 | +1.0 | 1.00 |
| 4 | 4 | 4.6 | −0.6 | 0.36 |
| 5 | 5 | 5.2 | −0.2 | 0.04 |

SSE = **2.4**, MSE = **0.48**, RMSE ≈ **0.6928**, MAE = **0.64**. Tổng residual bằng 0 (trong sai số làm tròn), là tính chất OLS có intercept trên **train**, không phải bảo đảm ở test. Tại x = 6, dự đoán **5.8**, nhưng đó đã nằm ngoài miền x từ 1 tới 5.
:::

Đây là sai số **trên năm điểm dùng để fit**, không phải ước lượng chất lượng ngoài mẫu. Nếu thay y cuối từ 5 thành 20, fit lại cho slope **3.6**, intercept **−3.8**: một thay đổi kéo cả đường đi. Cần kiểm tra điểm bất thường ở [[bài:missing-values-outliers]], không tự xóa vì nó làm metric xấu.

> **EN:** These are training errors, not held-out estimates. Changing one endpoint can move the entire OLS line; investigate unusual observations rather than deleting them solely to improve a metric.

## Ưu/nhược trên slide và cách đọc cho đúng

[[slide:66]] nêu dễ triển khai, huấn luyện hiệu quả; regularization có thể giảm overfitting; nhạy noise/outlier và có thể overfit. Một baseline tuyến tính thường tiện để đọc tác động theo đơn vị, nhưng hệ số không tự là “độ quan trọng”: đổi đơn vị feature sẽ đổi hệ số. Feature tương quan mạnh còn làm hệ số bất ổn; xem [[bài:correlation-multicollinearity]].

> **EN:** Linear models can be efficient and interpretable, but coefficient magnitudes depend on units. Correlated predictors can make individual coefficients unstable even when predictions remain useful.

:::note Nhận xét về câu chữ trên slide 66
- Slide ghi “Performs well when the dataset is linearly separable”. **Linearly separable** thường mô tả phân loại. Với hồi quy, nên hiểu là quan hệ trung bình có điều kiện được mô tả hợp lý bằng predictor tuyến tính; tách được class không phải điều kiện OLS.
- “Assumes that the data is independent” cần hiểu theo phụ thuộc giữa **quan sát/sai số** trong mô hình thống kê, không phải mọi feature phải độc lập nhau.
- Regularization là phần mở rộng như Ridge/Lasso, **không bật sẵn trong `LinearRegression()`**; đợt này chưa viết bài riêng.
:::

> **EN:** Linear separability is classification terminology. For regression, examine the conditional mean structure and error dependence. Ordinary LinearRegression does not add regularization automatically.

## Giả định để dự đoán và để suy luận (bổ sung ngoài slide)

Fit được một đường không đòi y hay X phải có phân phối chuẩn. Các giả định dưới đây giúp hiểu khi nào ước lượng/diễn giải đáng tin; vi phạm không đồng nghĩa thư viện sẽ báo lỗi. Sai số ε là khái niệm của mô hình, residual là thứ dùng để chẩn đoán gần đúng.

:::compare Giả định → điều cần kiểm tra
| Điều kiện | Vai trò / hệ quả nếu lệch | Kiểm tra hoặc xử lý ở mức nhập môn |
|---|---|---|
| Trung bình có điều kiện tuyến tính, E[ε\|X] = 0 | Bỏ sót quan hệ, biến liên quan hoặc measurement error có thể làm hệ số lệch; “giữ biến khác cố định” không tạo nhân quả | Xem residual theo feature/fitted, hiểu cách thu thập biến |
| Quan sát/sai số không phụ thuộc theo cách mô hình chưa tính tới | Chuỗi thời gian/khách lặp lại có thể làm đánh giá và standard error quá lạc quan | Split theo thời gian/nhóm, xem phụ thuộc residual |
| Phương sai sai số không đổi | Không bắt buộc để tính OLS; khi lệch, standard error thông thường và hiệu quả ước lượng có thể bị ảnh hưởng | Xem residual có hình quạt; suy luận cần phương pháp phù hợp |
| Sai số gần chuẩn | Chủ yếu cho kiểm định/khoảng tin cậy cổ điển ở mẫu nhỏ; không cần để gọi fit hoặc có nghiệm OLS | Không ép X/y phải chuẩn; xem đuôi residual nếu làm suy luận |
| Không đa cộng tuyến hoàn hảo | Thiếu hạng làm hệ số không duy nhất; gần cộng tuyến làm chúng bất ổn | Xem cấu trúc feature, bỏ biến trùng/regularize có kiểm chứng |
:::

**Scale khi nào?** OLS không regularization, có intercept và giải chính xác không tự đổi dự đoán chỉ vì chuyển m² sang đơn vị khác; hệ số đổi theo đơn vị. Scale có thể giúp điều kiện số và giúp gradient descent hội tụ; với penalty phụ thuộc độ lớn hệ số, scale còn ảnh hưởng cách phạt. Nếu dùng scaler/imputer, fit chỉ train hoặc trong fold; nối [[bài:feature-scaling]]. Đừng đồng nhất OLS với [[bài:k-nearest-neighbours|KNN]] vốn dùng trực tiếp khoảng cách feature.

> **EN:** Normality is not required to compute OLS. Homoscedasticity and error dependence matter especially for conventional inference. Feature scaling can aid numerical conditioning and iterative optimization; fit any preprocessing on training data only.

## Code: từ phép tính tay tới test độc lập (bổ sung ngoài slide)

Cài `pip install numpy scikit-learn`. Đoạn đầu đối chiếu năm điểm bằng công thức, `lstsq` và sklearn; đoạn sau tự sinh dữ liệu giá nhà bằng seed cố định, **không phải dữ liệu giá thật hay dữ liệu Salary trên slide**. Chia train/test trước fit. Một feature số sạch, solver OLS, không dùng scaler nên không có bước tiền xử lý cần học từ test.

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([2, 4, 5, 4, 5], dtype=float)
slope = np.sum((x - x.mean()) * (y - y.mean())) / np.sum((x - x.mean())**2)
intercept = y.mean() - slope * x.mean()
design = np.column_stack([np.ones(len(x)), x])
beta, *_ = np.linalg.lstsq(design, y, rcond=None)
model = LinearRegression().fit(x[:, None], y)
pred = model.predict(x[:, None])
assert np.allclose(beta, [intercept, slope])
assert np.allclose([model.intercept_, model.coef_[0]], [2.2, 0.6])
assert np.allclose(pred, [2.8, 3.4, 4.0, 4.6, 5.2])
assert np.isclose(mean_squared_error(y, pred), 0.48)
assert np.isclose(mean_absolute_error(y, pred), 0.64)
print("residual:", np.round(y - pred, 3))
print("RMSE train:", np.sqrt(mean_squared_error(y, pred)))  # 0.6928...
print("x=6:", model.predict([[6]]))  # [5.8], ngoại suy

changed = y.copy()
changed[-1] = 20
pulled = LinearRegression().fit(x[:, None], changed)
assert np.allclose([pulled.intercept_, pulled.coef_[0]], [-3.8, 3.6])
```

```python
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyRegressor

rng = np.random.default_rng(42)
area = rng.uniform(40, 160, size=200)
price = 0.5 + 0.03 * area + rng.normal(0, 0.25, size=200)  # tỉ VND, giả lập
X_train, X_test, y_train, y_test = train_test_split(
    area[:, None], price, test_size=0.25, random_state=42
)
reg = LinearRegression().fit(X_train, y_train)
baseline = DummyRegressor(strategy="mean").fit(X_train, y_train)
print("intercept_, coef_:", reg.intercept_, reg.coef_)
for name, estimator in [("OLS", reg), ("Mean train", baseline)]:
    prediction = estimator.predict(X_test)
    print(name, {
        "MAE": round(mean_absolute_error(y_test, prediction), 4),
        "RMSE": round(float(np.sqrt(mean_squared_error(y_test, prediction))), 4),
        "R2": round(r2_score(y_test, prediction), 4),
    })
```

Với seed/split này, OLS cho MAE **0.1904**, RMSE **0.2412** tỉ VND, R² **0.9427**; baseline mean train cho **0.8770**, **1.0119**, **−0.0088** tương ứng. Đây là kết quả dữ liệu giả lập, không phải benchmark giá nhà thực tế.

Giá trị fit sẽ gần nhưng không buộc bằng đúng hệ số sinh dữ liệu vì có noise và chỉ fit một tập hữu hạn. R² ở [[bài:regression-metrics]] so SSE với độ biến thiên quanh **mean của tập đang đánh giá**, khác với baseline triển khai dùng mean **train**. R² không phải phần trăm dự đoán đúng; có thể âm. Đoạn code chỉ minh họa một lần đánh giá model đã chốt, không dùng test để chọn thuật toán/tune; khi lựa chọn cần validation/CV.

> **EN:** Finite noisy samples need not recover the generating coefficients exactly. R² uses the evaluation-set mean as its mathematical reference, while a deployable mean baseline learns from training data. Use validation for selection and test for final evaluation.

Nguồn đối chiếu phần bổ sung: [OLS và hệ số trong sklearn](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html), [linear models và giới hạn cộng tuyến](https://scikit-learn.org/stable/modules/linear_model.html), [chẩn đoán hồi quy](https://www.statsmodels.org/stable/diagnostic.html).

## Bẫy khi mang đường thẳng ra thực tế

:::pitfall Ngoại suy, nhân quả và R² cao (bổ sung ngoài slide)
- **Ngoại suy:** học trong miền diện tích đã quan sát không chứng minh đường thẳng đúng với biệt thự cực lớn; đánh dấu input ngoài miền và đánh giá riêng.
- **Correlation ≠ causation:** β dương có thể do biến nhiễu/chọn mẫu. Dự đoán “giữ feature khác cố định” không chứng minh can thiệp sẽ tạo hiệu ứng đó.
- **R² cao ≠ mô hình đúng:** cùng thống kê có thể giấu hình dạng khác nhau, như bài học từ Anscombe; vẽ scatter/residual ở [[bài:data-visualization]], kiểm nhóm và dữ liệu chưa thấy. Không cần học riêng bộ số Anscombe trong bài này.
- **Leakage:** không fit scaler/imputer trên cả bảng rồi mới split; biến biết sau thời điểm dự đoán cũng là leakage, dù code fit đúng train.
:::

> **EN:** Avoid unsupported extrapolation and causal claims. High R² can hide misspecification or leakage; inspect plots, subgroups and genuinely held-out performance.

## Tóm tắt 1 phút

:::recap
- Simple có một feature; multiple có nhiều feature, vẫn tuyến tính theo β.
- Dự đoán dùng hệ số ước lượng; ε chưa biết không cộng trực tiếp vào prediction.
- OLS tối thiểu tổng bình phương residual; SSE/MSE cùng nghiệm trên cùng tập.
- Ví dụ tay: β̂0 = 2.2, β̂1 = 0.6; MSE train = 0.48, RMSE ≈ 0.6928.
- Dễ đọc hệ số theo đơn vị, nhưng outlier/cộng tuyến có thể làm chúng bất ổn.
- Giả định chuẩn của sai số phục vụ suy luận, không phải điều kiện gọi fit.
- Kiểm test với baseline, tránh leakage và ngoại suy không có bằng chứng.
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
