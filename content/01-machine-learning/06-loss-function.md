---
title: Loss Function (Hàm mất mát)
order: 6
description: Loss là con số đo "model đang sai bao nhiêu". Hiểu L1 vs L2 là hiểu vì sao model có thể bị outlier kéo lệch — và là nền cho mọi bài về huấn luyện phía sau.
slides: 19-21
needs: [model-training-pipeline]
tags: [loss, L1, L2, MAE, MSE, outlier, regression]
---

## Loss giải quyết vấn đề gì?

:::intro Đọc xong bài này bạn làm được
- Giải thích bằng lời thường: loss là gì, vì sao model **cần** nó để học.
- Tính tay L1 và L2 loss, và nói được vì sao L2 "nhạy outlier" hơn.
- Chọn L1 hay L2 cho một bài toán có dữ liệu nhiễu, và biện luận được lựa chọn đó.
:::

Ở bài [[bài:model-training-pipeline]], model nhận feature vector và nhả ra một
`prediction`. Nhưng chỉ có prediction thì chưa biết model đang đoán **tốt hay dở**.
Ta cần một **con số duy nhất** nói "sai bao nhiêu" — con số đó là **loss**.
Loss nhỏ nghĩa là prediction gần label; loss lớn nghĩa là xa. Đây cũng là
tín hiệu để model biết cần chỉnh tham số theo hướng nào.

> **EN:** A prediction alone doesn't tell you whether a model is doing well. A
> **loss** is a single number measuring how wrong the predictions currently are:
> smaller means closer to ground truth. It is also the signal the model uses to
> decide which direction to adjust its parameters.

:::slides 19-21 | Slide 19–21: ví dụ giá nhà, L1/L2 và đồ thị hai hàm loss
:::

## Loss nằm ở đâu trong vòng huấn luyện

```
feature matrix → [Model] → prediction ─┐
                                         ├──> so sánh ──> loss
                              label ────┘
                                         │
                    update  <───────────┘
```

- `prediction` vs `label`: model đoán, còn `label` là giá trị thật đã biết trong tập huấn luyện.
- `loss`: hàm nhận (prediction, label), trả về **một con số** đo sai lệch.
- `update`: loss được dùng để chỉnh lại tham số của model. Lặp lại nhiều vòng → loss giảm dần → model "học".

Quan trọng: loss là thước đo **model dùng để tự học**, khác với metric (accuracy, MAE…) là thước đo **con người dùng để đánh giá**.
Hai thứ thường trùng nhau trong regression nhưng không bắt buộc — xem câu hỏi phỏng vấn B2.

> **EN:** Features flow through the model to produce a `prediction`, which is compared
> with the known `label` to compute the `loss`. That value drives the parameter `update`
> — the core training loop. A loss is what the *model* optimizes; a metric is what
> *humans* use to judge it.

## L1 và L2 — hai cách phạt sai lệch

:::formula
**L1 loss** (Least Absolute Deviations / Absolute Error):
```
L1 = Σ |y_prediction − y_actual|
```
<!-- note: bậc 1 → phạt đều -->
Cộng đều trị tuyệt đối các sai lệch — không khuếch đại sai lệch lớn. Model có
xu hướng sửa đều ở nhiều điểm thay vì dồn sức vào một điểm sai nặng.

**L2 loss** (Least Square Errors / Squared Error):
```
L2 = Σ (y_prediction − y_actual)²
```
<!-- note: bậc 2 → phạt nặng outlier -->
Bình phương sai lệch → sai lệch lớn bị khuếch đại mạnh. Model nhạy với outlier
hơn, ưu tiên sửa điểm sai nhiều nhất trước.
:::

> **EN:** L1 sums absolute errors, so no single error is amplified. L2 sums squared
> errors, so large deviations dominate the total — the model becomes far more
> sensitive to outliers and chases the worst-predicted points first.

### Chia trung bình thì sao?

Slide dùng tổng (`Σ`). Trong thực tế người ta thường chia cho số mẫu `n` để loss không phụ thuộc vào việc dữ liệu có bao nhiêu dòng:

| Dạng | Công thức | Tên thường gặp |
|---|---|---|
| L1 trung bình | `(1/n) Σ \|ŷ − y\|` | MAE (Mean Absolute Error) |
| L2 trung bình | `(1/n) Σ (ŷ − y)²` | MSE (Mean Squared Error) |
| Căn của MSE | `√MSE` | RMSE — cùng đơn vị với label, dễ đọc hơn |

Chia cho `n` không đổi hướng tối ưu, chỉ đổi thang đo. Hai metric MAE/RMSE sẽ được dùng lại ở bài [[bài:regression-metrics]].

Ứng dụng cụ thể ở module 02: [[bài:linear-regression]] học hệ số bằng cách tối thiểu tổng bình phương residual (OLS).

> **EN:** In module 02, Linear Regression applies squared loss to learn coefficients by ordinary least squares.

### Vì sao L2 "dễ học" hơn về mặt toán

Model học bằng cách đi ngược hướng đạo hàm của loss. Đạo hàm L2 theo sai lệch `e` là `2e`: sai nhỏ thì bước chỉnh nhỏ → hội tụ êm quanh điểm đúng. Đạo hàm L1 là `±1` không đổi và **không xác định tại 0** → bước chỉnh luôn cùng độ lớn, dễ dao động quanh đáy. Đó là lý do L2 phổ biến khi huấn luyện, còn L1 phổ biến khi cần **chống outlier**.

### Một phương án dung hòa: Huber loss

Huber dùng dạng bình phương khi sai lệch nhỏ (êm như L2) và chuyển thành tuyến tính khi sai lệch lớn (bền như L1), với ngưỡng `δ`:

```
Huber(e) = 1/2 e²              nếu |e| ≤ δ
         = δ (|e| − δ/2)     nếu |e| > δ
```

:::pitfall Nhầm lẫn hay gặp
- "Loss nhỏ = model tốt": chỉ đúng nếu loss tính trên **dữ liệu chưa thấy** (test). Loss trên train nhỏ mà test lớn là overfitting (sẽ gặp ở bài [[bài:train-test-split]]).
- So sánh L1 và L2 bằng **con số**: 1.20 và 0.5048 không so sánh được với nhau, vì khác thang đo. Chỉ so sánh cùng loại loss giữa hai model.
- Quên rằng loss **tổng** tăng theo số dòng; muốn so giữa hai tập dữ liệu khác kích thước thì phải chia `n`.
:::

## Ví dụ tay: dự đoán giá nhà

:::worked Giá nhà (tỉ VND) — đúng bộ số trên slide 19
| Diện tích | Thành phố | Prediction | Label | Sai lệch (pred − label) |
|---|---|---|---|---|
| 40 | HCM | 3.45 | 3.75 | −0.30 |
| 60 | Hà Nội | 3.9 | 4.12 | −0.22 |
| 120 | Hải Dương | 2.12 | 2.2 | −0.08 |
| 50 | Huế | 2.9 | 2.3 | **+0.60** (outlier) |

- L1 = 0.30 + 0.22 + 0.08 + 0.60 = **1.20** → MAE = 1.20 / 4 = **0.30**
- L2 = 0.30² + 0.22² + 0.08² + 0.60² = 0.09 + 0.0484 + 0.0064 + 0.36 = **0.5048** → MSE = **0.1262**, RMSE ≈ **0.3552**
- Huber (δ = 0.5) = 0.045 + 0.0242 + 0.0032 + 0.175 = **0.2474**

Nhìn riêng dòng Huế: nó đóng góp 0.60/1.20 = **50%** vào L1, nhưng 0.36/0.5048 ≈ **71%** vào L2. Một điểm sai nặng "chiếm sóng" L2 nhiều hơn hẳn.
:::

## Code: tự cài lại

```python
import numpy as np

pred = np.array([3.45, 3.9, 2.12, 2.9])
actual = np.array([3.75, 4.12, 2.2, 2.3])
e = pred - actual

l1 = np.sum(np.abs(e))
l2 = np.sum(e ** 2)
print("L1:", l1)                       # 1.2
print("L2:", l2)                       # 0.5048
print("MAE:", l1 / len(e))             # 0.3
print("RMSE:", np.sqrt(l2 / len(e)))   # 0.3552...

# Huber, delta = 0.5
delta = 0.5
huber = np.where(np.abs(e) <= delta, 0.5 * e**2, delta * (np.abs(e) - 0.5 * delta))
print("Huber:", huber.sum())           # 0.2474

# Điểm khác biệt cốt lõi: hằng số "tốt nhất" cho L1 là median, cho L2 là mean
y = np.array([1, 2, 3, 100])
print(np.mean(y), np.median(y))        # 26.5  2.5
```

## Tóm tắt 1 phút

:::recap
- **Loss** = một con số đo model đang sai bao nhiêu; model dùng nó để tự sửa.
- **L1** (trị tuyệt đối): phạt đều, bền với outlier. **L2** (bình phương): phạt nặng điểm sai lớn, nhạy outlier.
- Chia `n` ra MAE / MSE; lấy căn ra RMSE (cùng đơn vị với label).
- L2 trơn nên dễ tối ưu; L1 bền nên hợp dữ liệu nhiễu; Huber là đường giữa.
- Loss (model tối ưu) ≠ metric (người đánh giá).

| Khi nào | Chọn |
|---|---|
| Dữ liệu sạch, muốn đạo hàm êm | L2 / MSE |
| Nhiều outlier không đáng tin | L1 / MAE hoặc Huber |
| Cần báo cáo sai số theo đơn vị gốc | RMSE hoặc MAE |
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Nếu đổi sai lệch dòng Huế từ +0.60 thành +2.0, L1 tăng thêm đúng bao nhiêu? L2 thì tăng bằng phần chênh lệch hay nhiều hơn?
A: L1 tăng đúng **1.40** (mới = 1.20 − 0.60 + 2.0 = 2.60), vì cộng thẳng vào tổng. L2 tăng **nhiều hơn** phần chênh: 0.60² = 0.36 → 2.0² = 4.0, tăng 3.64 (mới = 4.1448). Đầu vào chỉ gấp ~3.3 lần nhưng phần đóng góp vào L2 gấp hơn 10 lần.
Q: Một model có tổng L2 = 18 trên 6 mẫu. Tính MSE và RMSE.
A: MSE = 18 / 6 = **3**; RMSE = √3 ≈ **1.732**. RMSE cùng đơn vị với label nên dễ diễn giải hơn MSE.
Q: Trong ví dụ, dòng Huế đóng góp bao nhiêu % vào L1 và vào L2? Con số nói lên điều gì?
A: L1: 0.60/1.20 = 50%. L2: 0.36/0.5048 ≈ 71%. Một điểm sai nặng chi phối L2 mạnh hơn nhiều so với L1 — đó chính là nghĩa của "L2 nhạy với outlier".
Q: Với y = [1, 2, 3, 100], dự đoán một hằng số duy nhất. Hằng số nào làm L2 nhỏ nhất, hằng số nào làm L1 nhỏ nhất?
A: L2 nhỏ nhất tại **mean = 26.5** (tổng L2 = 7205); L1 nhỏ nhất tại **median** (bất kỳ giá trị trong [2, 3], vd 2.5 cho L1 = 100). Mean bị giá trị 100 kéo đi xa, median thì không → L1 "bền" hơn.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Giải thích loss function cho một người chưa biết ML, trong 30 giây.
A: Loss là con số cho biết model đang đoán sai bao nhiêu so với đáp án thật. Giống điểm số bài kiểm tra: model làm bài, ta chấm điểm sai, rồi model dựa vào đó sửa cách làm. Huấn luyện chính là lặp lại "đoán → chấm → sửa" cho tới khi loss đủ nhỏ.
EN: A loss function is a number telling the model how far its predictions are from the truth. Training is repeatedly predicting, measuring that error, and adjusting parameters to reduce it.
Q: **B2.** Loss khác metric ở chỗ nào? Cho ví dụ loss và metric không trùng nhau.
A: Loss là thứ model **tối ưu** trong lúc học, bắt buộc phải có đạo hàm tốt để dùng gradient. Metric là thứ **con người** dùng để đánh giá kết quả, nên phải phản ánh mục tiêu kinh doanh. Ví dụ: bài phân loại dùng **cross-entropy** làm loss (trơn, có đạo hàm) nhưng báo cáo **accuracy / F1** làm metric (rời rạc, không dùng trực tiếp để huấn luyện được).
EN: The loss is what the optimizer minimizes and must be differentiable; the metric is what stakeholders care about. E.g. classifiers train on cross-entropy but are reported with accuracy or F1.
Q: **B3.** Vì sao L2 nhạy với outlier còn L1 thì không? Nêu cả lý do toán lẫn trực giác.
A: Toán: L2 bình phương sai lệch nên sai lệch lớn gấp k lần thì đóng góp gấp k² lần; L1 chỉ gấp k lần. Trực giác: model muốn giảm tổng loss, nên với L2 nó "đổi" rất nhiều sai nhỏ để bớt một sai lớn → bị outlier kéo đường dự đoán lệch. Thêm góc nhìn thống kê: tối ưu L2 ra **mean**, tối ưu L1 ra **median**; mean nhạy outlier, median thì không.
EN: Squaring makes the penalty grow quadratically, so a single large residual dominates. Statistically, minimizing L2 yields the mean while L1 yields the median, which is robust.
Q: **B4.** Vì sao L2 hay được dùng khi huấn luyện dù nhạy outlier? Huber loss giải quyết gì?
A: L2 khả vi mọi nơi và đạo hàm tỉ lệ với sai lệch nên gradient descent hội tụ êm gần đáy; L1 có đạo hàm ±1 và không xác định tại 0 nên dễ dao động. Huber ghép hai ưu điểm: bình phương khi sai nhỏ (trơn), tuyến tính khi sai lớn (bền outlier), điều chỉnh bằng ngưỡng δ.
EN: L2 is smooth with a gradient proportional to the error, giving stable convergence. Huber is quadratic for small errors and linear for large ones, combining smoothness with robustness.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Bạn làm model dự đoán giá nhà cho một sàn bất động sản. Dữ liệu có vài căn bị nhập sai giá (thêm số 0). Chọn L1 hay L2? Bạn xử lý thế nào?
A: Không chọn L2 thuần vì vài điểm nhập sai sẽ kéo cả model lệch. Thứ tự hợp lý: (1) kiểm tra và làm sạch outlier rõ ràng là lỗi nhập liệu (xem bài [[bài:missing-values-outliers]]); (2) với những điểm còn nghi ngờ, dùng L1 hoặc Huber để giảm ảnh hưởng; (3) đánh giá bằng cả MAE và RMSE — nếu RMSE lớn hơn MAE nhiều nghĩa là vẫn còn vài sai số rất lớn.
WANT: Bạn phân biệt được "outlier là lỗi" (nên sửa dữ liệu) với "outlier là thật nhưng hiếm" (nên chọn loss bền), thay vì phản xạ "đổi sang L1" ngay.
Q: **C2.** Model dự đoán thời gian giao hàng. Đến sớm 10 phút chỉ làm khách hơi thích, nhưng trễ 10 phút làm khách hủy đơn. L1 hay L2 có phản ánh được điều này không?
A: Không. Cả L1 và L2 đều **đối xứng**: sớm và trễ cùng độ lớn bị phạt như nhau. Khi chi phí thực tế bất đối xứng, ta tự thiết kế loss: phạt trễ nặng hơn sớm (ví dụ quantile / pinball loss hoặc nhân trọng số cho sai số dương). Điểm mấu chốt: **loss phải phản ánh chi phí kinh doanh**, không phải mặc định.
WANT: Bạn hiểu loss là nơi mã hóa mục tiêu kinh doanh, và biết rằng có thể tùy biến loss thay vì chỉ dùng MSE/MAE có sẵn.
Q: **C3.** Train loss giảm đều nhưng chất lượng model ngoài thực tế tệ. Bạn nghĩ tới những nguyên nhân nào?
A: (1) Overfitting: loss chỉ giảm trên train — cần theo dõi loss trên validation/test (bài [[bài:train-test-split]]); (2) loss không khớp metric kinh doanh (tối ưu MSE nhưng khách quan tâm sai số lớn nhất); (3) dữ liệu train khác phân phối dữ liệu thật; (4) rò rỉ dữ liệu làm loss train đẹp giả tạo.
WANT: Bạn có checklist chẩn đoán có hệ thống, bắt đầu từ việc so sánh train với validation chứ không chỉ nhìn một đường loss.
:::

## Nối sang bài sau

:::next
Loss mới chỉ **đo** sai số trên dữ liệu model đã thấy. Muốn biết model đoán tốt trên dữ liệu **chưa thấy** thì phải chia dữ liệu cẩn thận — đó là nội dung của [[bài:train-test-split]].
:::
