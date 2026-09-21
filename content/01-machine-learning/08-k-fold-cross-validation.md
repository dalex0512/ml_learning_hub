---
title: K-fold Cross Validation
order: 8
---

## 1. Ý tưởng

K-fold Cross Validation là kỹ thuật giúp **tận dụng dữ liệu tốt hơn** khi
chia Train/Validation/Test theo cách thông thường — thay vì "hy sinh" một
phần cố định dữ liệu làm Validation Set duy nhất, ta xoay vòng để mọi mẫu
dữ liệu đều có cơ hội được dùng làm cả dữ liệu train và dữ liệu validation.

> **EN:** K-fold Cross Validation is a technique for **making better use
> of data** than a standard Train/Validation/Test split — instead of
> permanently sacrificing one fixed chunk of data as the sole Validation
> Set, we rotate so that every sample gets a turn being used as both
> training data and validation data.

## 2. Vị trí trong bức tranh lớn — vấn đề cần giải quyết

Nếu dataset ít dữ liệu, Validation Set (theo cách chia 3 phần thông
thường) sẽ rất nhỏ. Ví dụ có 100 mẫu dữ liệu, chia Train: 70 / Validation:
15 / Test: 15 → model chỉ được train trên vỏn vẹn 70 mẫu, khá phí dữ liệu.
**K-fold giúp tận dụng dữ liệu tốt hơn** bằng cách dùng luân phiên cả phần
Train lẫn Validation cho việc huấn luyện, chỉ giữ nguyên Test Set tách
riêng từ đầu.

**Lưu ý quan trọng:** K-fold **chỉ áp dụng cho Train Set và Validation
Set**. Test Set vẫn được tách riêng và giữ cố định ngay từ đầu, **không**
tham gia vào quá trình K-fold — và **chỉ được dùng đúng 1 lần duy nhất**
sau khi đã hoàn tất chọn model.

> **EN:** With little data, the Validation Set from a standard 3-way
> split ends up very small. E.g. with 100 samples split as Train: 70 /
> Validation: 15 / Test: 15, the model is trained on only 70 samples —
> a real waste of data. **K-fold makes better use of the data** by
> rotating both the Train and Validation roles across the same pool of
> data, while keeping the Test Set separated from the very start.
>
> **Important:** K-fold **only applies to the Train Set and Validation
> Set**. The Test Set stays separated and fixed from the beginning — it
> does **not** participate in the K-fold process, and it's **used exactly
> once**, only after the final model has been selected.

## 3. Cách hoạt động

**Bước 1 — chọn số K.** Ví dụ chọn K = 4 → chia phần dữ liệu Train+Validation
thành 4 phần bằng nhau (4 "fold").

**Bước 2 — huấn luyện K mô hình giống hệt nhau, luân phiên đổi fold nào
làm Validation:**
- Lần 1: fold 1 làm Validation, 3 fold còn lại (2, 3, 4) làm Train → tính
  được loss `L1`
- Lần 2: fold 2 làm Validation, 3 fold còn lại làm Train → tính được
  `L2`
- Lần 3: fold 3 làm Validation, 3 fold còn lại làm Train → `L3`
- Lần 4: fold 4 làm Validation, 3 fold còn lại làm Train → `L4`

Mỗi fold chỉ đóng vai trò Validation **đúng 1 lần**, không lần nào trùng
lần nào.

**Bước 3 — tính điểm loss trung bình của cả K mô hình:**
```
Loss trung bình = (Σ Li từ i=1 đến K) / K
```
Đây mới là con số đại diện cho chất lượng thật của model (đáng tin hơn 1
lần đánh giá đơn lẻ, vì đã được đánh giá trên toàn bộ dữ liệu, không phụ
thuộc vào việc "may/rủi" chọn đúng fold nào làm validation).

**Bước 4 — huấn luyện lại 1 model cuối cùng trên TOÀN BỘ dữ liệu
Train+Validation** (không tách fold nữa) — model này mới là model thật sự
đem đi đánh giá trên Test Set.

> **EN:**
>
> **Step 1 — choose K.** E.g. K = 4 → split the Train+Validation pool into
> 4 equal parts ("folds").
>
> **Step 2 — train K identical models, rotating which fold is the
> Validation fold:**
> - Round 1: fold 1 is Validation, the other 3 folds (2, 3, 4) are Train
>   → loss `L1`
> - Round 2: fold 2 is Validation, the rest are Train → `L2`
> - Round 3: fold 3 is Validation, the rest are Train → `L3`
> - Round 4: fold 4 is Validation, the rest are Train → `L4`
>
> Each fold plays the Validation role **exactly once**, never repeated.
>
> **Step 3 — average the loss across all K models:**
> ```
> Average loss = (Σ Li from i=1 to K) / K
> ```
> This is the number that truly represents the model's quality — more
> trustworthy than a single evaluation, since it's been evaluated across
> the entire dataset rather than depending on which fold got "lucky" as
> validation.
>
> **Step 4 — retrain one final model on the ENTIRE Train+Validation
> data** (no more folds) — this final model is the one actually evaluated
> against the Test Set.

## 4. Ví dụ tay

100 mẫu dữ liệu Train+Validation, chọn K = 4 → mỗi fold có 25 mẫu.

| Vòng | Fold làm Validation | Fold làm Train | Loss |
|---|---|---|---|
| 1 | Fold 1 (25 mẫu) | Fold 2, 3, 4 (75 mẫu) | L1 |
| 2 | Fold 2 (25 mẫu) | Fold 1, 3, 4 (75 mẫu) | L2 |
| 3 | Fold 3 (25 mẫu) | Fold 1, 2, 4 (75 mẫu) | L3 |
| 4 | Fold 4 (25 mẫu) | Fold 1, 2, 3 (75 mẫu) | L4 |

→ Loss trung bình = (L1 + L2 + L3 + L4) / 4

So với cách chia 3 phần thông thường (chỉ train trên 70/100 mẫu), ở đây
mỗi vòng model được train trên 75/100 mẫu, và **toàn bộ 100 mẫu đều đã
từng được dùng làm Validation** ít nhất 1 lần — tận dụng dữ liệu triệt để
hơn hẳn.

> **EN:** 100 Train+Validation samples, K = 4 → 25 samples per fold (see
> table above). Compared to a standard 3-way split (training on only
> 70/100 samples), here each round trains on 75/100 samples, and **all
> 100 samples get used as Validation** at least once — a much more
> thorough use of the data.

## 5. Code

```python
from sklearn.model_selection import KFold
import numpy as np

kf = KFold(n_splits=4, shuffle=True, random_state=42)
losses = []

for train_idx, val_idx in kf.split(X_train_val):
    X_tr, X_val = X_train_val[train_idx], X_train_val[val_idx]
    y_tr, y_val = y_train_val[train_idx], y_train_val[val_idx]

    model = train_model(X_tr, y_tr)       # huấn luyện model trên fold train
    loss = evaluate(model, X_val, y_val)  # đánh giá trên fold validation
    losses.append(loss)

average_loss = np.mean(losses)
```

> **EN:** Loops through K folds, training on each fold's training portion
> and evaluating on its validation portion, then averages the loss across
> all K rounds — this average is the final cross-validation score.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Trong K-fold Cross Validation, Test Set có tham gia vào quá
trình xoay vòng fold không?
> **Đáp án:** Không. Test Set được tách riêng và giữ cố định ngay từ đầu,
> hoàn toàn nằm ngoài quá trình K-fold, và chỉ được dùng đúng 1 lần duy
> nhất sau khi đã chọn xong model cuối cùng.

**Câu 2:** Nếu chọn K = 5, cần huấn luyện bao nhiêu model, và mỗi model
dùng bao nhiêu phần dữ liệu làm Train (tính theo phân số của phần
Train+Validation)?
> **Đáp án:** Cần huấn luyện 5 model. Mỗi model dùng 4/5 dữ liệu làm
> Train và 1/5 dữ liệu làm Validation (fold còn lại).

**Câu 3:** Sau khi có 5 loss (L1 đến L5) từ 5 model, bước tiếp theo là gì?
> **Đáp án:** Tính loss trung bình (Σ Li / 5) để đánh giá chất lượng
> tổng thể của cách huấn luyện, sau đó huấn luyện lại 1 model cuối cùng
> trên toàn bộ dữ liệu Train+Validation (không chia fold nữa) — model
> này mới đem đi đánh giá trên Test Set.

> **EN:**
>
> **Q1:** Does the Test Set take part in the fold-rotation process during
> K-fold Cross Validation?
> > **A:** No. The Test Set is separated and kept fixed from the start,
> > entirely outside the K-fold process, and is used exactly once after
> > the final model has already been chosen.
>
> **Q2:** If K = 5, how many models need to be trained, and what fraction
> of the Train+Validation data does each model use for training?
> > **A:** 5 models need to be trained. Each one uses 4/5 of the data for
> > training and 1/5 (the remaining fold) for validation.
>
> **Q3:** After getting 5 losses (L1 through L5) from 5 models, what's
> the next step?
> > **A:** Average the losses (Σ Li / 5) to evaluate the overall quality
> > of the training approach, then retrain one final model on the entire
> > Train+Validation data (no more folds) — this final model is the one
> > evaluated against the Test Set.
