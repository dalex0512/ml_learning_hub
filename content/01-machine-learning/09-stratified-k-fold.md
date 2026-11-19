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

## Dùng StratifiedKFold: truyền cả y

`StratifiedKFold` cần biết nhãn để giữ tỉ lệ, nên `split` nhận **cả `X` và `y`** (khác `KFold` chỉ cần `X`):

```python
from sklearn.model_selection import StratifiedKFold
skf = StratifiedKFold(n_splits=4, shuffle=True, random_state=42)
losses = []
for train_idx, val_idx in skf.split(X_train_val, y_train_val):
    X_tr, X_val = X_train_val.iloc[train_idx], X_train_val.iloc[val_idx]
    y_tr, y_val = y_train_val.iloc[train_idx], y_train_val.iloc[val_idx]
    model = train_model(X_tr, y_tr)
    losses.append(evaluate(model, X_val, y_val))
```

Một lưu ý khi đọc bảng ở slide 24: ở bảng chia ngẫu nhiên, cột Dog chỉ cộng ra 0 + 5 + 0 + 3 = **8** (không phải 10) và các fold không đều nhau (25, 25, 30, 18 mẫu). Có lẽ slide ghi chưa chuẩn, nhưng ý chính không đổi: chia ngẫu nhiên có thể để lại fold không có Dog nào. Muốn mọi fold đều có lớp hiếm thì lớp ít nhất phải có ít nhất bằng số fold mẫu.

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
