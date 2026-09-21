---
title: Stratified K-fold
order: 9
---

## 1. Ý tưởng

Stratified K-fold là 1 biến thể của K-fold Cross Validation, sinh ra để
giải quyết vấn đề **dataset mất cân bằng** (imbalanced dataset) — khi các
lớp (class) trong bài toán Classification có số lượng mẫu chênh lệch lớn.

> **EN:** Stratified K-fold is a variant of K-fold Cross Validation
> designed to handle **imbalanced datasets** — when the classes in a
> Classification problem have very unequal sample counts.

## 2. Vị trí trong bức tranh lớn

Giả sử giải quyết 1 bài toán Classification: dataset có 2 class `Cat` và
`Dog`, với số lượng lần lượt là **90 Cat** và chỉ **10 Dog** → đây là 1
dataset mất cân bằng.

Nếu chia K-fold **bình thường** (ngẫu nhiên, như bài trước), có thể xảy ra
tình huống: vì lớp `Dog` chỉ có 10 mẫu trên tổng 100, khi chia ngẫu nhiên
thành các fold, có fold có thể **không rơi trúng mẫu `Dog` nào cả** (hoặc
rất ít), trong khi fold khác lại có nhiều `Dog` hơn hẳn. Khi 1 fold gần
như không có mẫu `Dog` nào, việc dùng fold đó làm Validation khiến kết quả
đánh giá **sai hoàn toàn** cho lớp `Dog` — model không hề được kiểm tra
đúng cách với lớp thiểu số này.

> **EN:** Suppose we're solving a Classification problem: a dataset with
> 2 classes `Cat` and `Dog`, with **90 Cat** samples and only **10 Dog**
> samples — this is an imbalanced dataset.
>
> With a **standard** (random) K-fold split like the previous lesson,
> since `Dog` only has 10 samples out of 100, a random split into folds
> can end up with a fold that **contains almost no `Dog` samples at all**
> (or none), while another fold gets more than its fair share. When a
> fold has almost no `Dog` samples, using it as Validation makes the
> evaluation for the `Dog` class **completely wrong** — the model never
> gets properly tested on this minority class.

## 3. Cách hoạt động

**Stratified K-fold giúp giữ tỉ lệ giống tỉ lệ ở dataset gốc trong MỌI
fold.** Với ví dụ trên: dataset gốc có tỉ lệ Cat 90% / Dog 10%, thì
Stratified K-fold đảm bảo **mỗi fold** cũng giữ đúng xấp xỉ tỉ lệ 90%
Cat / 10% Dog — thay vì để việc chia fold hoàn toàn ngẫu nhiên như K-fold
thường.

Nói cách khác: K-fold thường chia ngẫu nhiên theo **số lượng mẫu**;
Stratified K-fold chia theo **tỉ lệ giữa các class**, đảm bảo class thiểu
số luôn xuất hiện đều đặn ở mọi fold, không bị "bỏ sót" ở fold nào.

**Lưu ý quan trọng: Stratified K-fold chỉ dùng cho bài toán
Classification** (vì nó cần khái niệm "class" để giữ tỉ lệ — bài toán
Regression không có class rời rạc nên không áp dụng được).

> **EN:** **Stratified K-fold keeps the same class ratio as the original
> dataset in EVERY fold.** In the example above: the original dataset has
> a 90% Cat / 10% Dog ratio, so Stratified K-fold ensures **each fold**
> also keeps approximately that same 90% Cat / 10% Dog ratio — instead of
> letting the fold split happen completely at random like standard
> K-fold.
>
> In other words: standard K-fold splits randomly by **sample count**;
> Stratified K-fold splits by **class ratio**, ensuring the minority class
> shows up consistently in every fold, never "missed" in any of them.
>
> **Important: Stratified K-fold is only used for Classification
> problems** (it relies on the concept of "class" to preserve ratios —
> Regression has no discrete classes, so it doesn't apply).

## 4. Ví dụ tay

Dataset: 90 Cat, 10 Dog (tổng 100 mẫu), chia K = 4 fold.

**Nếu chia K-fold thường (ngẫu nhiên)** — có thể ra kết quả lệch, ví dụ:

| Fold | Số Cat | Số Dog |
|---|---|---|
| Fold 1 | 23 | 0 |
| Fold 2 | 20 | 5 |
| Fold 3 | 24 | 0 |
| Fold 4 | 23 | 5 |

→ Fold 1 và Fold 3 **không có mẫu Dog nào** — nếu dùng 1 trong 2 fold này
làm Validation, model hoàn toàn không được đánh giá trên lớp Dog.

**Nếu chia bằng Stratified K-fold** — tỉ lệ Cat:Dog ~90:10 được giữ đều ở
mọi fold:

| Fold | Số Cat | Số Dog |
|---|---|---|
| Fold 1 | 22 | 3 |
| Fold 2 | 23 | 2 |
| Fold 3 | 22 | 3 |
| Fold 4 | 23 | 2 |

→ Fold nào cũng có cả Cat lẫn Dog theo đúng tỉ lệ ~90:10, đảm bảo mọi
lượt Validation đều đánh giá được cả 2 class công bằng.

> **EN:** Dataset: 90 Cat, 10 Dog (100 total), split into K = 4 folds.
>
> **With standard (random) K-fold**, the result can be skewed, e.g. Fold
> 1 and Fold 3 end up with **zero Dog samples** — using either as
> Validation means the model is never evaluated on the Dog class at all.
>
> **With Stratified K-fold**, the ~90:10 Cat:Dog ratio is preserved evenly
> across every fold, so every Validation round fairly evaluates both
> classes.

## 5. Code

```python
from sklearn.model_selection import StratifiedKFold

skf = StratifiedKFold(n_splits=4, shuffle=True, random_state=42)
losses = []

for train_idx, val_idx in skf.split(X_train_val, y_train_val):
    X_tr, X_val = X_train_val[train_idx], X_train_val[val_idx]
    y_tr, y_val = y_train_val[train_idx], y_train_val[val_idx]

    model = train_model(X_tr, y_tr)
    loss = evaluate(model, X_val, y_val)
    losses.append(loss)
```

> **EN:** Same loop structure as standard K-fold, but `StratifiedKFold`
> also takes `y_train_val` as input to `.split()` — this is what lets it
> preserve the class ratio in every fold.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Vì sao K-fold thường (ngẫu nhiên) có thể gây vấn đề với dataset
mất cân bằng?
> **Đáp án:** Vì việc chia fold hoàn toàn ngẫu nhiên có thể khiến class
> thiểu số (như Dog chỉ có 10/100 mẫu) bị phân bố không đều — có fold gần
> như không chứa mẫu nào của class đó, khiến việc đánh giá (validation)
> trên fold đó sai hoàn toàn cho class thiểu số.

**Câu 2:** Stratified K-fold có dùng được cho bài toán Regression (dự
đoán giá nhà) không? Vì sao?
> **Đáp án:** Không. Stratified K-fold cần khái niệm "class" để giữ tỉ lệ
> giữa các class trong mỗi fold — bài toán Regression có output là số
> liên tục, không có class rời rạc, nên không áp dụng được.

**Câu 3:** Điểm khác biệt cốt lõi giữa K-fold thường và Stratified K-fold
là gì?
> **Đáp án:** K-fold thường chia dữ liệu vào các fold hoàn toàn ngẫu
> nhiên theo số lượng mẫu; Stratified K-fold chia sao cho **tỉ lệ giữa
> các class** trong mỗi fold xấp xỉ giống tỉ lệ ở dataset gốc.

> **EN:**
>
> **Q1:** Why can standard (random) K-fold cause problems with an
> imbalanced dataset?
> > **A:** Because a fully random fold split can distribute the minority
> > class (e.g. Dog with only 10/100 samples) unevenly — some folds may
> > end up with almost none of that class, making validation on those
> > folds completely wrong for the minority class.
>
> **Q2:** Can Stratified K-fold be used for a Regression problem (e.g.
> house price prediction)? Why or why not?
> > **A:** No. Stratified K-fold relies on the concept of "class" to
> > preserve class ratios in each fold — Regression has a continuous
> > numeric output with no discrete classes, so it doesn't apply.
>
> **Q3:** What's the core difference between standard K-fold and
> Stratified K-fold?
> > **A:** Standard K-fold splits data into folds completely randomly by
> > sample count; Stratified K-fold splits so that the **ratio between
> > classes** in each fold approximately matches the ratio in the
> > original dataset.
