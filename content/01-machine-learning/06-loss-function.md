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
<!-- note: bậc 1 → phạt đều -->
Cộng đều trị tuyệt đối các sai lệch — không khuếch đại sai lệch lớn. Model có
xu hướng sửa đều ở nhiều điểm thay vì dồn sức vào 1 điểm sai nặng.

> **EN:** L1 sums the absolute value of each error, so a large error isn't
> amplified — the model tends to correct many points evenly instead of
> chasing a single large deviation.

**L2 loss** (Least Square Errors / Squared Error):
```
L2 = Σ (y_prediction − y_actual)²
```
<!-- note: bậc 2 → phạt nặng outlier -->
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
→ L2 = 0.30² + 0.22² + 0.08² + 0.60² = **0.5048**

## 5. Code

```python
import numpy as np

pred = np.array([3.45, 3.9, 2.12, 2.9])
actual = np.array([3.75, 4.12, 2.2, 2.3])

l1 = np.sum(np.abs(pred - actual))
l2 = np.sum((pred - actual) ** 2)

print("L1 loss:", l1)   # 1.20
print("L2 loss:", l2)   # 0.5048
```

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Nếu đổi sai lệch dòng Huế từ +0.60 thành +2.0, L1 loss tăng
thêm đúng bao nhiêu? Còn L2 loss thì sao — tăng đúng bằng phần chênh lệch
hay nhiều hơn?
> **Đáp án:** L1 tăng đúng 1.40 (từ 0.60 lên 2.0, cộng thẳng vào tổng —
> L1 mới = 1.20 − 0.60 + 2.0 = 2.60). L2 tăng **nhiều hơn** phần chênh
> lệch tuyệt đối, vì bị bình phương: 0.60² = 0.36 → 2.0² = 4.0, tăng 3.64
> (L2 mới = 0.5048 − 0.36 + 4.0 = 4.1448) — chênh lệch input chỉ gấp
> ~3.3 lần nhưng phần đóng góp vào loss tăng gấp hơn 10 lần.

**Câu 2:** Tại sao nói L2 loss "nhạy với outlier" hơn L1 loss?
> **Đáp án:** Vì L2 bình phương sai lệch trước khi cộng — 1 điểm sai lệch
> lớn (outlier) sẽ bị khuếch đại mạnh trong tổng, kéo loss lên rất nhiều
> chỉ vì 1 điểm. L1 chỉ cộng trị tuyệt đối, không khuếch đại, nên ít bị
> chi phối bởi riêng 1 điểm sai lệch lớn.

**Câu 3:** Nếu dữ liệu của bạn có nhiều điểm nhiễu/sai số đo đạc (nhiều
outlier không đáng tin), nên ưu tiên dùng L1 hay L2?
> **Đáp án:** Nên ưu tiên L1. Vì L2 sẽ để model bị outlier "kéo lệch" quá
> mức (dồn sức sửa những điểm nhiễu không đáng tin), trong khi L1 đối xử
> công bằng hơn giữa các điểm, ít bị vài outlier chi phối.

> **EN:**
>
> **Q1:** If the Huế row's error changed from +0.60 to +2.0, how much
> would L1 loss increase by? What about L2 — does it increase by the same
> amount, or more?
> > **A:** L1 increases by exactly 1.40 (added straight into the sum —
> > new L1 = 1.20 − 0.60 + 2.0 = 2.60). L2 increases by **more** than the
> > raw difference, because it's squared: 0.60² = 0.36 → 2.0² = 4.0, an
> > increase of 3.64 (new L2 = 0.5048 − 0.36 + 4.0 = 4.1448) — the input
> > only grew ~3.3x but its contribution to the loss grew over 10x.
>
> **Q2:** Why is L2 loss described as more "sensitive to outliers" than
> L1 loss?
> > **A:** Because L2 squares each error before summing — one large error
> > (outlier) gets amplified sharply in the total, pulling the loss up a
> > lot because of a single point. L1 just sums absolute values with no
> > amplification, so it's less dominated by any one large error.
>
> **Q3:** If your dataset has a lot of noisy/unreliable outliers, should
> you prefer L1 or L2?
> > **A:** Prefer L1. L2 would let outliers "pull" the model too much
> > (forcing it to chase unreliable noisy points), while L1 treats points
> > more evenly and is less dominated by a few outliers.
