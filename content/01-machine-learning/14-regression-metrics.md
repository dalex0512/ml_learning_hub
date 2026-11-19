---
title: Metric cho Regression — MAE và RMSE
order: 14
description: "MAE và RMSE khác nhau ở cách đối xử với sai số lớn (tính tay trên bảng giá nhà của slide 38), R² so với đoán trung bình, MAPE và cách chọn metric."
slides: 38
needs: [loss-function]
tags: [mae, rmse, r2, regression, outlier]
---

## Dự đoán lệch bao nhiêu?

:::intro Mục tiêu bài này
- Tính tay **MAE** và **RMSE** trên bảng giá nhà của slide 38, và nói được chúng khác nhau ở cách đối xử với sai số lớn.
- Đọc **R²** như "tốt hơn đoán bừa bằng trung bình bao nhiêu".
- Chọn metric hồi quy theo cái giá của sai số lớn, và biết giới hạn của MAPE.
:::

Slide 38 lấy lại đúng bảng giá nhà của [[bài:loss-function]] (đơn vị tỉ VND) và đưa hai công thức đánh giá model hồi quy:

| Diện tích | Số tầng | Thành phố | Trong ngõ | Prediction | Label | Sai số `e` = pred − label |
|---|---|---|---|---|---|---|
| 40 | 6 | HCM | No | 3.45 | 3.75 | −0.30 |
| 60 | 4 | Hà Nội | No | 3.90 | 4.12 | −0.22 |
| 120 | 3 | Hải Dương | Yes | 2.12 | 2.20 | −0.08 |
| 50 | 4 | Huế | No | 2.90 | 2.30 | **+0.60** |

- **Mean Absolute Error (MAE)** = (1/N) Σ |y_prediction − y_actual|
- **Root Mean Squared Error (RMSE)** = √( (1/N) Σ (y_prediction − y_actual)² )

Công thức trùng với L1 và L2 của bài Loss function; khác ở **vai trò**: ở đó ta dùng chúng để **học**, ở đây dùng để **đánh giá** model trên dữ liệu chưa thấy. Hai metric đều **cùng đơn vị với y** (tỉ đồng), nên dễ đọc.

:::slides 38 | Slide 38: metric cho Regression, MAE và RMSE trên bảng giá nhà
:::

:::steps
**MAE:** (0.30 + 0.22 + 0.08 + 0.60) / 4 = 1.20 / 4 = **0.30 tỉ đồng**. Đọc: "trung bình mỗi dự đoán lệch khoảng 0.30 tỉ".
@step
**MSE:** (0.30² + 0.22² + 0.08² + 0.60²) / 4 = (0.0900 + 0.0484 + 0.0064 + 0.3600) / 4 = 0.5048 / 4 = **0.1262**.
@step
**RMSE** = √0.1262 = **0.355 tỉ đồng**. Căn bậc hai đưa đơn vị về lại "tỉ đồng" (MSE có đơn vị tỉ², khó đọc).
@step
**RMSE ≥ MAE** luôn đúng (0.355 ≥ 0.300). Hai số bằng nhau chỉ khi mọi sai số có cùng độ lớn; khoảng cách giữa chúng cho biết sai số **không đều** đến mức nào.
:::

:::predict
Căn nhà Huế bị đoán lệch thêm 3 tỉ (đoán 5.9 thay vì 2.9, sai số +3.6), ba căn kia giữ nguyên. MAE và RMSE mới là bao nhiêu? Cái nào tăng nhiều hơn?
@answer
MAE = (0.30 + 0.22 + 0.08 + 3.6) / 4 = **1.05** (gấp 3.5 lần). RMSE = √((0.09 + 0.0484 + 0.0064 + 12.96) / 4) = √3.276 ≈ **1.81** (gấp 5.1 lần). **RMSE tăng nhiều hơn**, vì sai số 3.6 bị bình phương thành 12.96, chiếm gần hết tổng.
:::

Hãy tự kéo: công cụ dùng đúng bốn căn nhà của slide; kéo thanh trượt để căn nhà Huế bị đoán lệch thêm và theo dõi MAE, MSE, RMSE, R².

:::widget loss-outlier
slide
:::

## R²: so với việc "đoán bừa bằng trung bình"

MAE và RMSE chỉ nói "lệch bao nhiêu", không nói đó là **tốt hay tệ**. **R²** thêm một mốc so sánh: cách đoán đơn giản nhất là **luôn đoán giá trung bình** của y.

> R² = 1 − (tổng bình phương sai số của model) / (tổng bình phương sai số của cách luôn đoán trung bình)

:::steps
Giá nhà thật trung bình: (3.75 + 4.12 + 2.20 + 2.30) / 4 = **3.0925**. Cách đoán "luôn 3.0925" có tổng bình phương sai số = (0.6575² + 1.0275² + 0.8925² + 0.7925²) = **2.9127**.
@step
Tổng bình phương sai số của model = **0.5048** (đã tính ở trên).
@step
**R² = 1 − 0.5048 / 2.9127 = 0.827.** Model giải thích được khoảng 83% biến động của giá nhà so với cách đoán trung bình.
@step
Khi căn nhà Huế bị lệch thêm 3 tỉ, tổng bình phương sai số lên 13.1, và R² = 1 − 13.1 / 2.9127 = **−3.50**: model **tệ hơn** cả cách luôn đoán trung bình.
:::

- **R² = 1:** hoàn hảo. **R² = 0:** không hơn đoán trung bình. **R² âm:** tệ hơn đoán trung bình.
- MAE của cách "luôn đoán trung bình" là 0.8425 tỉ; MAE của model là 0.30: model giảm sai số trung bình khoảng 64%.
- Ví dụ trên Diabetes (đoán Glucose từ các cột còn lại): MAE 19.2 mg/dL so với 24.4 của cách đoán trung bình, R² = 0.36 ([[bài:classification-vs-regression]]).

## MAPE và chọn metric

**MAPE** = trung bình |e| / |y|, cho sai số **theo phần trăm**: với bảng nhà là **10.8%**. Dễ hiểu với người không chuyên, nhưng **hỏng khi y gần 0** (chia cho số rất nhỏ) và thiên về phạt dự đoán quá thấp. Nên dùng cùng MAE hoặc RMSE chứ không thay thế.

Chọn theo **cái giá của sai số lớn**:

- **MAE**: dễ giải thích ("trung bình lệch 0.30 tỉ"), **bền với outlier**. Hợp khi mọi sai số đáng kể như nhau.
- **RMSE**: nhạy sai số lớn. Hợp khi **sai lớn đắt hơn nhiều** (dự báo tồn kho: thiếu hàng nhiều tệ hơn thiếu ít).
- **R²**: nói model hơn mức sàn bao nhiêu; không có đơn vị nên không thay được MAE hay RMSE.
- Luôn **ghi kèm đơn vị** và **so với mức sàn** (đoán trung bình).

:::ck
Hai model cùng có MAE = 5 triệu. Model A sai đều quanh 5 triệu; model B chính xác hầu hết nhưng có vài lần sai 50 triệu. RMSE của hai model giống hay khác? Bạn chọn model nào nếu một lần sai 50 triệu rất đắt?
@answer
**RMSE của B lớn hơn A nhiều**, vì các sai số 50 triệu bị bình phương. Nếu một sai lớn rất đắt, chọn **A** (RMSE thấp hơn). MAE giống nhau che mất khác biệt này; đây là lý do nên báo cáo cả MAE và RMSE.
:::

:::ck
Model đạt R² = 0.95 trên **train** nhưng 0.40 trên **test**. Điều đó nói lên gì, và bạn tin con số nào?
@answer
Model **học vẹt (overfitting)**: tốt trên dữ liệu đã học, kém trên dữ liệu mới. Tin con số trên **test** (0.40); như mọi metric, R² chỉ có nghĩa khi tính trên dữ liệu model chưa từng thấy ([[bài:train-test-split]]).
:::

## Tự cài đặt và đối chiếu bằng code

Bốn căn nhà ở trên: cài từng metric bằng NumPy, thử "thí nghiệm outlier" (căn ở Huế bị đoán 4.3 tỉ), rồi đối chiếu scikit-learn:

```python
import numpy as np
pred   = np.array([3.45, 3.90, 2.12, 2.90])
actual = np.array([3.75, 4.12, 2.20, 2.30])
def mae(p, y):  return np.mean(np.abs(p - y))
def mse(p, y):  return np.mean((p - y) ** 2)
def rmse(p, y): return np.sqrt(mse(p, y))
def r2(p, y):   return 1 - np.sum((y - p) ** 2) / np.sum((y - y.mean()) ** 2)
def mape(p, y): return np.mean(np.abs(p - y) / np.abs(y))
print(f"MAE  = {mae(pred, actual):.4f}")    # 0.3000
print(f"MSE  = {mse(pred, actual):.4f}")    # 0.1262
print(f"RMSE = {rmse(pred, actual):.4f}")   # 0.3552
print(f"R²   = {r2(pred, actual):.4f}")     # 0.8267
print(f"MAPE = {mape(pred, actual):.2%}")   # 10.77%
pred_bad = pred.copy(); pred_bad[3] = 4.3   # một dự đoán sai nặng
print(f"MAE  = {mae(pred_bad, actual):.4f}")    # 0.6500
print(f"RMSE = {rmse(pred_bad, actual):.4f}")   # 1.0179

from sklearn.metrics import (mean_absolute_error, mean_squared_error,
                             r2_score, mean_absolute_percentage_error)
print(mean_absolute_error(actual, pred))              # 0.30
print(np.sqrt(mean_squared_error(actual, pred)))      # 0.3552
print(r2_score(actual, pred))                         # 0.8267
print(mean_absolute_percentage_error(actual, pred))   # 0.1077
```

Lưu ý: hàm của scikit-learn nhận **`y_true` trước, `y_pred` sau**. Với MAE và RMSE đổi chỗ không sao vì công thức đối xứng, nhưng với R² và MAPE đổi chỗ sẽ ra **kết quả sai**. Bản scikit-learn mới có sẵn `root_mean_squared_error`.

## Những hiểu sai thường gặp

- **"MAE nhỏ là model tốt."** Phải so với **mức sàn** và theo đơn vị của bài toán (0.30 tỉ có nhỏ không còn tùy giá nhà).
- **"RMSE và MAE là một."** RMSE phạt sai số lớn nặng hơn; chúng chỉ bằng nhau khi mọi sai số cùng độ lớn.
- **"R² không thể âm."** Có thể âm trên dữ liệu mới, khi model tệ hơn đoán trung bình.
- **"R² cao thì dự đoán chính xác."** R² cao vẫn có thể có MAE lớn nếu y trải rộng; luôn xem cả hai.
- **"MAPE luôn tiện."** Hỏng khi y gần 0.

:::card Metric hồi quy
- **MAE** = trung bình |e| (đơn vị của y, bền với outlier). **RMSE** = √(trung bình e²) (phạt nặng sai số lớn); RMSE ≥ MAE.
- **R² = 1 − SS_model / SS_trung_bình**: 1 là hoàn hảo, 0 là bằng đoán trung bình, âm là tệ hơn.
- **Bảng nhà slide 38:** MAE 0.30, RMSE 0.355, R² 0.827 (mức sàn MAE 0.8425); Huế lệch thêm 3 tỉ: MAE 1.05, RMSE 1.81, R² −3.50.
- **MAPE** (10.8%) cho sai số theo phần trăm nhưng hỏng khi y gần 0.
- **Chọn theo giá của sai lớn; luôn ghi đơn vị và so với mức sàn; chấm trên dữ liệu chưa thấy.**
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Vì sao không dùng Accuracy để đánh giá model dự đoán giá nhà?
A: Vì output là số liên tục, model gần như không bao giờ đoán
trùng khớp tuyệt đối với giá thật, nên Accuracy gần như luôn bằng 0 và
không phân biệt được model lệch 10 triệu với model lệch 2 tỉ. Regression
cần metric đo **độ lớn sai lệch** như MAE, RMSE.
EN: Why not use Accuracy to evaluate a house price model?
**A:** The output is continuous, so predictions almost never match
> exactly; Accuracy would be ~0 and couldn't tell a 10-million miss from
> a 2-billion miss. Regression needs metrics that measure **error size**.

Q: MAE và L1 loss ([[bài:loss-function]]) khác nhau ở đâu? RMSE và L2 loss thì
sao?
A: MAE = L1 chia cho N (lấy trung bình thay vì tổng). RMSE =
căn bậc hai của (L2 chia cho N). Lấy trung bình để metric không phụ
thuộc số lượng mẫu; lấy căn để RMSE quay về cùng đơn vị với label.
EN: How does MAE relate to L1 loss (lesson 06)? RMSE to L2 loss?
**A:** MAE = L1 / N; RMSE = √(L2 / N). Averaging removes dependence
> on sample count; the root restores the label's unit.

Q: Vì sao RMSE luôn lớn hơn hoặc bằng MAE? Khi nào bằng nhau?
A: Bình phương làm các sai lệch lớn chiếm tỉ trọng nhiều hơn
trong trung bình, nên căn của trung bình bình phương luôn ≥ trung bình
trị tuyệt đối. Hai giá trị bằng nhau khi mọi sai lệch có cùng độ lớn
(ví dụ tất cả đều lệch đúng 0.3).
EN: Why is RMSE always ≥ MAE? When are they equal?
**A:** Squaring gives large errors more weight, so the root of the
> mean square is ≥ the mean absolute value. They're equal only when all
> errors have the same size.

Q: Model A: MAE = 0.30, RMSE = 0.32. Model B: MAE = 0.28, RMSE =
0.60. Nhận xét hai model. Dự báo phụ tải điện nên chọn model nào?
A: A có sai lệch đều (RMSE ≈ MAE). B có sai lệch điển hình nhỏ
hơn một chút, nhưng RMSE gấp đôi MAE → có vài lần đoán lệch rất xa. Với
dự báo phụ tải, một lần lệch lớn có thể gây thiếu điện nghiêm trọng,
nên chọn **A**.
EN: Model A: MAE 0.30, RMSE 0.32. Model B: MAE 0.28, RMSE 0.60.
Which suits electricity load forecasting?
**A:** A's errors are even; B has a slightly smaller typical error but
> occasional huge misses (RMSE ≈ 2 × MAE). One big miss can cause
> shortages, so choose **A**.

Q: Tính MAE và RMSE cho 3 mẫu: prediction = [10, 20, 30], label =
[12, 20, 25].
A: Sai lệch: −2, 0, +5. MAE = (2 + 0 + 5) / 3 ≈ **2.333**.
MSE = (4 + 0 + 25) / 3 ≈ 9.667 → RMSE ≈ **3.109**.
EN: Compute MAE and RMSE for prediction = [10, 20, 30], label =
[12, 20, 25].
**A:** Errors −2, 0, +5. MAE ≈ **2.333**; MSE ≈ 9.667 → RMSE ≈
> **3.109**.

Q: Một model có R² = −0.2. Điều đó nói gì?
A: Model **tệ hơn** cả việc luôn đoán bằng giá trị trung bình
của label. Thường là dấu hiệu model chưa học được gì hữu ích, bị lỗi
pipeline, hoặc đang đánh giá trên dữ liệu có phân bố rất khác dữ liệu
train.
EN: A model has R² = −0.2. What does that say?
**A:** It's **worse** than always predicting the mean label — usually a
> sign the model learned nothing useful, a pipeline bug, or a large
> distribution shift between training and evaluation data.
@tier B | Phỏng vấn lý thuyết
Q: MAE khác RMSE về độ nhạy ra sao?
A: MAE cộng độ lớn sai lệch tuyến tính. RMSE bình phương trước khi lấy trung bình nên lỗi lớn chi phối mạnh hơn. Chọn theo chi phí lỗi lớn, kiểm tra lỗi do dữ liệu trước khi đổi metric.
EN: MAE weights absolute errors linearly; RMSE emphasizes large residuals through squaring.
Q: RMSE lớn hơn MAE nhiều chứng minh điều gì?
A: Cho thấy độ lớn sai lệch không đều. Chưa đủ biết lỗi ở đâu hoặc do outlier thật, nhóm bị bỏ quên hay lỗi nhãn; cần xem residual theo nhóm và kiểm tra các mẫu sai lớn.
EN: A large RMSE–MAE gap indicates uneven error magnitudes, but not their cause.
Q: Loss và metric có cần cùng công thức?
A: Không. Loss dùng để tối ưu model; metric đánh giá theo mục tiêu. Có thể train MSE nhưng theo dõi MAE hoặc chi phí vận hành, miễn quy trình lựa chọn dùng validation.
EN: The optimization loss and reporting metric may differ when the business objective requires it.
Q: MAPE dễ hiểu nhưng có hạn chế gì?
A: Chia sai số cho giá trị thật nên gần 0 có thể phóng đại và tại 0 cần quy ước. Với nhu cầu thường bằng 0, không nên dùng MAPE đơn độc; xem MAE và chi phí theo mặt hàng.
EN: MAPE becomes unstable near zero targets and requires careful handling of zeros.
@tier C | Tình huống doanh nghiệp
Q: Thiếu hàng đắt hơn tồn hàng, MAE hay RMSE?
A: Cả hai không phân biệt chiều sai. Trước hết ước lượng chi phí thiếu/tồn theo mặt hàng, dùng metric chi phí có dấu hoặc quantile loss *(bổ sung)*, kèm MAE/RMSE để dễ đọc. Chọn trên validation, kiểm tra mức tồn tăng khi giảm thiếu hàng.
WANT: Nhận ra metric đối xứng chưa mã hóa chi phí bất đối xứng.
Q: Báo cáo MAE giảm nhưng khách VIP phản ánh dự báo tệ hơn. Làm gì?
A: Tách residual theo nhóm khách, quy mô đơn, thời gian; kiểm tra lỗi lớn và chất lượng nhãn. Báo cáo metric từng nhóm hoặc trọng số theo chi phí đã thống nhất. Tối ưu toàn tập có thể đánh đổi một nhóm nhỏ quan trọng *(bổ sung)*.
WANT: Không để trung bình che phân khúc chịu tổn thất.
Q: Model giá nhà thành phố này có RMSE thấp hơn thành phố khác. Kết luận tốt hơn?
A: Kiểm tra đơn vị, phân bố giá và cách split; dùng baseline từng nơi và cùng khung đánh giá. RMSE thấp có thể chỉ vì thang giá nhỏ. Đánh giá thêm sai số theo phân khúc trước khi ưu tiên triển khai *(bổ sung)*.
WANT: Hiểu phụ thuộc thang đo và điều kiện so sánh công bằng.
:::

## Nối sang bài sau

:::next
Đã có công cụ đo cho cả classification và regression. [[bài:ml-pipeline]] ghép chúng với thu thập, tiền xử lý, huấn luyện và triển khai thành bức tranh dự án.
:::
