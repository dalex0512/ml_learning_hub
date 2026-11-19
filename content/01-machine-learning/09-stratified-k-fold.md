---
title: Stratified K-fold
order: 9
description: "Chia ngẫu nhiên có thể tạo fold thiếu lớp hiếm (slide 24: 90 Cat và 10 Dog); Stratified K-fold giữ đúng tỉ lệ nhãn ở mọi fold, chỉ cho Classification."
slides: 24
needs: [k-fold-cross-validation]
tags: [stratified, imbalanced, cross-validation]
---

## Nếu một fold không có lớp hiếm thì sao?

:::intro Mục tiêu bài này
- Thấy bằng số vì sao K-fold thường có thể tạo ra fold **thiếu hẳn lớp hiếm** (slide 24: fold không có Dog nào thì validation "sai hoàn toàn").
- Hiểu **Stratified K-fold**: giữ tỉ lệ nhãn của dữ liệu gốc ở **mọi** fold.
- Biết khi nào dùng (chỉ cho **Classification**), phải truyền cả `y`, và giới hạn của lời hứa giữ tỉ lệ.
:::

Slide 24 dùng một bài toán Classification: bộ dữ liệu có **Cat 90 mẫu (90%)** và **Dog 10 mẫu (10%)**. Ta chia K = 4 fold, mỗi fold 25 mẫu, bằng cách xáo ngẫu nhiên rồi cắt. Mỗi fold *kỳ vọng* có 2.5 mẫu Dog, nhưng ngẫu nhiên có thể cho kết quả khác hẳn: có fold gần như đầy Dog, có fold **không có con Dog nào**. Slide ghi: *"có fold 0 con Dog, model validation sai hoàn toàn"*.

:::predict
Với cách xáo ngẫu nhiên ở K = 4 (mỗi fold 25 mẫu), xác suất để **một fold cụ thể không có Dog nào** là bao nhiêu? Còn xác suất để **ít nhất một trong bốn fold** không có Dog?
@answer
Một fold cụ thể: khoảng **4.8%** (nhỏ). Nhưng ít nhất một trong bốn fold: khoảng **18.8%**: cứ khoảng năm lần chia thì có một lần hỏng. Với K = 5 (mỗi fold 20 mẫu), xác suất một fold không có Dog là 9.5% và xác suất **ít nhất một fold hỏng** lên tới khoảng **43.2%**. Fold hỏng không đo được recall của lớp Dog (không có mẫu Dog nào để bắt).
:::

Hãy tự thử: bấm "Xáo lại và chia" ở chế độ K-fold thường rồi so với Stratified.

:::widget fold-compare
:::

## Stratified K-fold: giữ tỉ lệ thay vì chia đều số mẫu

**Stratified K-fold** chia **theo từng lớp**: lấy 90 Cat chia đều ra K phần, lấy 10 Dog chia đều ra K phần, rồi ghép lại. Ở K = 4 (slide 24): Cat chia thành 22, 22, 23, 23 và Dog chia thành 3, 3, 2, 2, nên **mọi fold đều có Dog** và tỉ lệ ở mỗi fold gần đúng 90% / 10% như dữ liệu gốc. Ở K = 5: mỗi fold đúng 18 Cat và 2 Dog.

:::slides 24 | Slide 24: Stratified K-fold với 90 Cat và 10 Dog
:::

Để làm được việc đó, hàm chia **phải biết nhãn**: truyền cả `y`.

```python
from sklearn.model_selection import StratifiedKFold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for train_idx, val_idx in skf.split(x, y):   # phải đưa y vào
    ...
```

Project Bước 6 dùng `StratifiedKFold` cho bộ Diabetes (500 và 268, tức 65% và 35%); và `cross_val_score` với bài phân loại tự dùng stratified khi `cv` là một số nguyên.

## Khi nào dùng và giới hạn

- **Chỉ dùng cho Classification** (slide ghi rõ): với hồi quy không có nhãn nhóm để phân tầng.
- **Càng cần khi lớp hiếm hoặc dữ liệu ít:** với lớp 50/50 và dữ liệu lớn, K-fold thường đã đủ cân.
- **Giới hạn:** mỗi lớp cần ít nhất **K mẫu** thì mới chia đủ vào K fold. Lớp chỉ có 3 mẫu mà K = 5 thì ít nhất hai fold không có mẫu của lớp đó dù đã Stratified.
- **Stratified chỉ giữ tỉ lệ nhãn**, không giải quyết rò rỉ: scaler, imputer vẫn phải nằm trong Pipeline ([[bài:k-fold-cross-validation]]).
- **Test set cũng nên phân tầng** khi chia ban đầu (`stratify=y` trong `train_test_split`, Project Bước 4 bài tập 3).

:::ck
Có một lớp rất hiếm: chỉ 3 mẫu trong cả bộ dữ liệu 1000 mẫu. Bạn dùng Stratified 5-fold. Có đủ chỗ cho lớp đó ở mọi fold không? Bạn làm gì?
@answer
**Không.** 3 mẫu không thể chia vào 5 fold: ít nhất hai fold không có mẫu nào của lớp đó, dù đã Stratified (sklearn sẽ cảnh báo). Cách xử lý: **giảm K** xuống tối đa 3, gom thêm dữ liệu cho lớp hiếm, hoặc dùng cách đánh giá khác (ví dụ leave-one-out). Stratified giữ tỉ lệ **nếu có đủ mẫu**.
:::

## Những hiểu sai thường gặp

- **"Stratified làm model tốt hơn."** Không: nó làm **phép đo** đáng tin hơn (mọi fold đều có lớp hiếm), không đổi cách model học.
- **"Quên truyền `y` cũng được."** Không: `split(x)` mà không có `y` thì không có gì để phân tầng (sklearn báo lỗi hoặc dùng phân tầng sai).
- **"Dùng được cho hồi quy."** Không trực tiếp; có thể phân tầng theo khoảng giá trị, nhưng đó là kỹ thuật khác.
- **"Stratified chữa mất cân bằng."** Không: dữ liệu vẫn lệch; để model học tốt lớp hiếm cần cách khác ([[bài:imbalanced-data]]).

:::card Stratified K-fold
- **Vấn đề:** chia ngẫu nhiên có thể tạo fold không có lớp hiếm (90 Cat và 10 Dog: K = 4 hỏng ~18.8%, K = 5 hỏng ~43.2%).
- **Stratified:** chia từng lớp riêng rồi ghép; K = 4 cho Cat 22/22/23/23 và Dog 3/3/2/2; mọi fold giữ tỉ lệ 90/10.
- **Phải truyền `y`**; chỉ dùng cho **Classification**.
- **Giới hạn:** mỗi lớp cần ít nhất K mẫu; vẫn cần Pipeline để không rò rỉ; nó làm phép đo đáng tin, không làm model tốt hơn.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Vì sao K-fold thường (ngẫu nhiên) có thể gây vấn đề với dataset
mất cân bằng?
A: Vì việc chia fold hoàn toàn ngẫu nhiên có thể khiến class
thiểu số (như Dog chỉ có 10/100 mẫu) bị phân bố không đều — có fold gần
như không chứa mẫu nào của class đó, khiến việc đánh giá (validation)
trên fold đó sai hoàn toàn cho class thiểu số.
EN: Why can standard (random) K-fold cause problems with an
imbalanced dataset?
**A:** Because a fully random fold split can distribute the minority
> class (e.g. Dog with only 10/100 samples) unevenly — some folds may
> end up with almost none of that class, making validation on those
> folds completely wrong for the minority class.

Q: Stratified K-fold có dùng được cho bài toán Regression (dự
đoán giá nhà) không? Vì sao?
A: Không. Stratified K-fold cần khái niệm "class" để giữ tỉ lệ
giữa các class trong mỗi fold — bài toán Regression có output là số
liên tục, không có class rời rạc, nên không áp dụng được.
EN: Can Stratified K-fold be used for a Regression problem (e.g.
house price prediction)? Why or why not?
**A:** No. Stratified K-fold relies on the concept of "class" to
> preserve class ratios in each fold — Regression has a continuous
> numeric output with no discrete classes, so it doesn't apply.

Q: Điểm khác biệt cốt lõi giữa K-fold thường và Stratified K-fold
là gì?
A: K-fold thường chia dữ liệu vào các fold hoàn toàn ngẫu
nhiên theo số lượng mẫu; Stratified K-fold chia sao cho **tỉ lệ giữa
các class** trong mỗi fold xấp xỉ giống tỉ lệ ở dataset gốc.
EN: What's the core difference between standard K-fold and
Stratified K-fold?
**A:** Standard K-fold splits data into folds completely randomly by
> sample count; Stratified K-fold splits so that the **ratio between
> classes** in each fold approximately matches the ratio in the
> original dataset.
Q: Bảng stratified Cat 22,22,23,23 và Dog 3,3,2,2 có đúng tổng không?
A: Cat = 90, Dog = 10; mỗi fold có 25 mẫu, tổng 100. Tỷ lệ Dog là 12%,12%,8%,8%, xấp xỉ 10% vì số lượng phải nguyên *(bổ sung: tính lại)*.
@tier B | Phỏng vấn lý thuyết
Q: Stratification có giải quyết mất cân bằng không?
A: Không. Nó giữ tỷ lệ gốc để các fold đại diện hơn. Class weighting hoặc resampling thay cách học/phân bố train là câu chuyện khác ở [[bài:imbalanced-data]].
EN: Stratification preserves class ratios across folds; it does not rebalance the training data.
Q: Khi nào không thể có mọi class trong mọi fold?
A: Nếu số mẫu của một class ít hơn số fold thì không đủ mẫu để mỗi fold nhận ít nhất một. Giảm K hoặc xem lại phương án đánh giá, không giả định stratification tạo được thông tin mới.
EN: If a class has fewer samples than folds, every validation fold cannot contain that class.
Q: Tại sao split cần X và y?
A: y cung cấp class để phân phối mẫu theo tỷ lệ. X chỉ xác định mẫu và kích thước; không cho biết tỷ lệ nhãn. Vì vậy .split(X, y) khác KFold chỉ cần X.
EN: Stratified splitting needs target labels to allocate samples according to class proportions.
Q: Stratified có thay thế time split hoặc group split không?
A: Không. Giữ tỷ lệ không ngăn cùng khách lọt hai tập hay dùng tương lai dự đoán quá khứ. Ưu tiên cấu trúc triển khai rồi mới cân nhắc tỷ lệ class.
EN: Class balance constraints do not prevent entity overlap or temporal leakage.
@tier C | Tình huống doanh nghiệp
Q: Fraud rất hiếm, random fold không có fraud. Bạn làm gì?
A: Đếm mẫu dương và kiểm tra loại split theo thời gian/khách trước. Nếu các mẫu độc lập, dùng stratified với K phù hợp số mẫu thiểu số, báo metric từng class. Giữ tỷ lệ không tăng dữ liệu fraud; cần thể hiện độ bất định *(bổ sung)*.
WANT: Không nhầm việc chia fold với xử lý mất cân bằng.
Q: Marketing có tỷ lệ churn thay đổi theo tháng. Stratify ngẫu nhiên có đủ?
A: Không đủ nếu triển khai dự đoán tháng sau. Dùng đánh giá theo thời gian, báo số churn và metric theo giai đoạn. Chấp nhận tỷ lệ validation thay đổi như thực tế, thay vì ép tỷ lệ làm mất mục tiêu kiểm chứng *(bổ sung)*.
WANT: Đặt tính đại diện triển khai cao hơn sự đẹp của tỷ lệ fold.
Q: Nhóm muốn oversample trước stratified split cho các fold đều hơn. Bạn phản biện sao?
A: Split dữ liệu gốc trước, resample chỉ train từng fold. Nếu oversample trước, bản sao hoặc mẫu tổng hợp có thể liên quan trực tiếp tới validation, làm điểm lạc quan. Validation giữ phân bố thật dù metric dao động hơn *(bổ sung)*.
WANT: Nhận diện leakage từ bản sao và mẫu tổng hợp.
:::

## Nối sang bài sau

:::next
Stratification cần biết target là class. [[bài:classification-vs-regression]] giúp quyết định dạng bài từ ý nghĩa target trước khi chọn cách đánh giá.
:::

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Giải thích fold thiếu class thiểu số làm đánh giá khó thế nào.
- Tính lại bảng stratified Cat/Dog.
- Phân biệt giữ tỷ lệ class với cân bằng số mẫu.
:::

Nền để đọc bài này: [[bài:k-fold-cross-validation]].

:::slides 24 | Slide gốc — Stratified K-fold
:::

Stratified K-fold là 1 biến thể của K-fold Cross Validation, sinh ra để
giải quyết vấn đề **dataset mất cân bằng** (imbalanced dataset) — khi các
lớp (class) trong bài toán Classification có số lượng mẫu chênh lệch lớn.

> **EN:** Stratified K-fold is a variant of K-fold Cross Validation
> designed to handle **imbalanced datasets** — when the classes in a
> Classification problem have very unequal sample counts.

## [sâu] Bài toán 90 Cat và 10 Dog

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

## [sâu] Giữ tỷ lệ thay vì chia đều class

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

## [sâu] Đối chiếu bảng trên slide

:::worked Ví dụ và số liệu đối chiếu
Dataset: 90 Cat, 10 Dog (tổng 100 mẫu), chia K = 4 fold.

**Nếu chia K-fold thường (ngẫu nhiên)** — có thể ra kết quả lệch, ví dụ:

| Fold | Số Cat | Số Dog |
|---|---|---|
| Fold 1 | 25 | 0 |
| Fold 2 | 20 | 5 |
| Fold 3 | 30 | 0 |
| Fold 4 | 15 | 3 |

→ Fold 1 và Fold 3 **không có mẫu Dog nào** — nếu dùng 1 trong 2 fold này
làm Validation, model hoàn toàn không được đánh giá trên lớp Dog.

*(Nhận xét của Claude)* Bảng trên chép đúng số liệu [[slide:24]]. Cột Cat cộng
lại đủ 90, nhưng cột Dog chỉ cộng ra 0 + 5 + 0 + 3 = **8** thay vì 10 — có lẽ
slide ghi nhầm (ví dụ Fold 4 lẽ ra là 5 Dog). Ý chính không đổi: chia ngẫu
nhiên có thể để lại fold không có Dog nào. Các fold ở đây cũng không đều
nhau về kích thước (25, 25, 30, 18 mẫu), trong khi K-fold thật chia gần
bằng nhau; slide chỉ minh họa ý tưởng.

**Nếu chia bằng Stratified K-fold** — tỉ lệ Cat:Dog ~90:10 được giữ đều ở
mọi fold:

| Fold | Số Cat | Số Dog |
|---|---|---|
| Fold 1 | 22 | 3 |
| Fold 2 | 22 | 3 |
| Fold 3 | 23 | 2 |
| Fold 4 | 23 | 2 |

→ Fold nào cũng có cả Cat lẫn Dog theo đúng tỉ lệ ~90:10, đảm bảo mọi
lượt Validation đều đánh giá được cả 2 class công bằng.

> **EN:** Dataset: 90 Cat, 10 Dog (100 total), split into K = 4 folds.
>
> **With standard (random) K-fold**, the result can be skewed, e.g. Fold
> 1 and Fold 3 end up with **zero Dog samples** — using either as
> Validation means the model is never evaluated on the Dog class at all.
> *(Claude's note)* The table copies [[slide:24]] (Cat 25/20/30/15, Dog
> 0/5/0/3). The Dog column only sums to 8 instead of 10 — likely a slide
> typo; the point still stands.
>
> **With Stratified K-fold**, the ~90:10 Cat:Dog ratio is preserved evenly
> across every fold, so every Validation round fairly evaluates both
> classes.
:::

## [sâu] Truyền cả y cho StratifiedKFold

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

## [sâu] Giới hạn của lời hứa giữ tỷ lệ (bổ sung)

:::note Bảng [[slide:24]] (nhận xét)
Giữ nguyên bảng Cat 25/20/30/15, Dog 0/5/0/3: tổng Dog là 8 thay vì 10, kích thước các fold cũng không gần bằng nhau. Không tự sửa ô theo phỏng đoán; dùng bảng stratified 22/22/23/23 và 3/3/2/2 để minh họa riêng.
:::

:::pitfall Không tự tạo thêm dữ liệu thiểu số
Muốn mọi validation fold có mẫu của từng class thì số mẫu lớp ít nhất phải đủ cho số fold. Stratification không chữa mất cân bằng, không thay kiểm tra group/time. StratifiedKFold chuẩn nhận target classification; chia bin target regression là một thiết kế khác có giả định riêng, không đưa trực tiếp số liên tục vào API.
:::

> **EN:** Stratification preserves approximate class proportions; it neither balances the dataset nor solves group or temporal leakage.
