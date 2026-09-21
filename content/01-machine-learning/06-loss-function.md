---
title: Loss Function (Hàm mất mát)
order: 6
---

## 1. Ý tưởng

Loss chỉ là một con số đo "model đang dự đoán sai bao nhiêu" so với thực tế.
Loss càng nhỏ, model đoán càng gần đúng. Đây là thước đo để model biết cần
sửa mình theo hướng nào.

> **EN:** A loss is simply a single number measuring how wrong a model's
> predictions currently are. The smaller the loss, the closer the
> predictions are to ground truth — it's the signal the model uses to know
> which direction to correct itself in.

## 2. Vị trí trong pipeline

```
feature matrix → [Model] → prediction ─┐
                                         ├──> so sánh ──> loss
                              label ────┘
                                         │
                    update  <───────────┘
```

- `feature matrix → Model`: dữ liệu đầu vào đi qua model để ra một dự đoán
- `prediction` vs `label`: model đoán ra `prediction`, `label` là giá trị
  thật đã biết trước (trong tập huấn luyện)
- `loss`: hàm nhận vào (prediction, label), trả về 1 con số đo sai lệch
- `update`: con số loss được dùng để chỉnh lại tham số bên trong model

> **EN:** Features flow through the model to produce a `prediction`, which
> is compared against the known `label` to compute the `loss`. That loss
> value is then used to `update` the model's internal parameters — this is
> the core training loop.

## 3. Công thức

**L1 loss** (Least Absolute Deviations / Absolute Error):
```
L1 = Σ |y_prediction − y_actual|
```
Cộng đều trị tuyệt đối các sai lệch — không khuếch đại sai lệch lớn. Model có
xu hướng sửa đều ở nhiều điểm thay vì dồn sức vào 1 điểm sai nặng.

> **EN:** L1 sums the absolute value of each error, so a large error isn't
> amplified — the model tends to correct many points evenly instead of
> chasing a single large deviation.

**L2 loss** (Least Square Errors / Squared Error):
```
L2 = Σ (y_prediction − y_actual)²
```
Bình phương sai lệch → sai lệch lớn bị khuếch đại mạnh. Model nhạy với
outlier hơn, ưu tiên sửa điểm sai nhiều nhất trước.

> **EN:** L2 squares each error, so large deviations get amplified sharply.
> This makes the model far more sensitive to outliers, prioritizing the
> worst-predicted points first.

## 4. Ví dụ tay

Dự đoán giá nhà (đơn vị: tỉ VND):

| Diện tích | Thành phố | Prediction | Label | Sai lệch (pred − label) |
|---|---|---|---|---|
| 40 | HCM | 3.45 | 3.75 | −0.30 |
| 60 | Hà Nội | 3.9 | 4.12 | −0.22 |
| 120 | Hải Dương | 2.12 | 2.2 | −0.08 |
| 50 | Huế | 2.9 | 2.3 | **+0.60** (outlier) |

→ L1 = 0.30 + 0.22 + 0.08 + 0.60 = **1.20**
→ L2 = 0.30² + 0.22² + 0.08² + 0.60² = **0.4568**

## 5. Code

```python
import numpy as np

pred = np.array([3.45, 3.9, 2.12, 2.9])
actual = np.array([3.75, 4.12, 2.2, 2.3])

l1 = np.sum(np.abs(pred - actual))
l2 = np.sum((pred - actual) ** 2)

print("L1 loss:", l1)   # 1.20
print("L2 loss:", l2)   # 0.4568
```

## 6. Câu hỏi tự kiểm tra

- Nếu đổi sai lệch dòng Huế từ +0.60 thành +2.0, L1 loss tăng thêm đúng bao
  nhiêu? Còn L2 loss thì sao — tăng đúng bằng phần chênh lệch hay nhiều hơn?
- Tại sao nói L2 loss "nhạy với outlier" hơn L1 loss?
- Nếu dữ liệu của bạn có nhiều điểm nhiễu/sai số đo đạc (nhiều outlier
  không đáng tin), nên ưu tiên dùng L1 hay L2?

> **EN:**
> - If the Huế row's error changed from +0.60 to +2.0, how much would L1
>   loss increase by? What about L2 — does it increase by the same amount,
>   or more?
> - Why is L2 loss described as more "sensitive to outliers" than L1 loss?
> - If your dataset has a lot of noisy/unreliable outliers, should you
>   prefer L1 or L2?
