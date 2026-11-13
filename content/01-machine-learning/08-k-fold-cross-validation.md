---
title: K-fold Cross Validation
order: 8
description: "Xoay vòng validation để so sánh cấu hình, đọc điểm trung bình giữa các fold và huấn luyện lại model cuối mà vẫn giữ riêng test."
slides: 23-24
needs: [train-test-split]
tags: [cross-validation, k-fold, leakage]
---

## Một lần chia có đủ đáng tin?

:::intro Đọc xong bài này bạn làm được
- Mô tả một vòng và toàn bộ K-fold.
- Tính kích thước train/validation và loss trung bình.
- Giải thích chi phí chọn K và fit tiền xử lý trong từng fold.
:::

Nền để đọc bài này: [[bài:train-test-split]].

:::slides 23-24 | Slide gốc — K-fold Cross Validation
:::

K-fold Cross Validation là kỹ thuật giúp **tận dụng dữ liệu tốt hơn** khi
chia Train/Validation/Test theo cách thông thường — thay vì "hy sinh" một
phần cố định dữ liệu làm Validation Set duy nhất, ta xoay vòng để mọi mẫu
dữ liệu đều có cơ hội được dùng làm cả dữ liệu train và dữ liệu validation.

> **EN:** K-fold Cross Validation is a technique for **making better use
> of data** than a standard Train/Validation/Test split — instead of
> permanently sacrificing one fixed chunk of data as the sole Validation
> Set, we rotate so that every sample gets a turn being used as both
> training data and validation data.

## Tận dụng dữ liệu mà vẫn giữ riêng test

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

Một ví dụ chọn siêu tham số cụ thể: [[bài:polynomial-regression]] dùng CV để chọn bậc đa thức, thay vì chọn bậc có train error nhỏ nhất; Pipeline được fit lại trong từng fold. [[bài:svm]] áp dụng cùng nguyên tắc với GridSearchCV để chọn C và gamma, giữ scaler bên trong từng fold.

[[bài:k-nearest-neighbours]] chọn số láng giềng K bằng CV với Pipeline; K của KNN khác số fold trong K-fold. Không chọn K chỉ vì K=1 có train accuracy cao.

> **EN:** KNN selects its neighbor count by pipeline-based cross-validation; the neighbor count is distinct from the number of folds, and training accuracy alone does not select it.

> **EN:** Polynomial Regression provides a concrete example of degree selection by CV; SVM applies the same principle to C and gamma, refitting preprocessing within every fold rather than choosing by training error.

## Xoay validation rồi refit model cuối

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

## Bốn lượt trên 100 mẫu

:::worked Ví dụ và số liệu đối chiếu
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
:::

## Lặp fold với model khởi tạo mới

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

## Đọc điểm CV cùng giới hạn (bổ sung)

:::pitfall Fit lại toàn bộ pipeline trong từng fold
Model ở các vòng có cùng cấu hình nhưng phải khởi tạo/fit độc lập; không tiếp tục học từ vòng trước. Scaler, imputer, encoder cũng chỉ fit trên phần train của mỗi fold. Báo cáo cả độ dao động giữa các fold; CV không bảo đảm chất lượng triển khai nếu split sai. Ví dụ 70/15/15 và pool 100 mẫu trong bài là hai minh họa khác nhau, không phải so sánh cùng ngân sách test.
:::

> **EN:** Refit the entire pipeline independently within each fold. Cross-validation measures performance under the chosen splitting assumptions, not guaranteed deployment performance.

## Tóm tắt 1 phút

:::recap
- Tách test ra khỏi vòng lựa chọn.
- Mỗi mẫu trong pool làm validation một lần.
- Mỗi vòng học model mới trên phần train.
- Tổng hợp điểm và độ dao động giữa fold.
- K lớn tăng số lần fit.
- Chọn xong thì refit trên toàn pool và đánh giá test.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Trong K-fold Cross Validation, Test Set có tham gia vào quá
trình xoay vòng fold không?
A: Không. Test Set được tách riêng và giữ cố định ngay từ đầu,
hoàn toàn nằm ngoài quá trình K-fold, và chỉ được dùng đúng 1 lần duy
nhất sau khi đã chọn xong model cuối cùng.
EN: Does the Test Set take part in the fold-rotation process during
K-fold Cross Validation?
**A:** No. The Test Set is separated and kept fixed from the start,
> entirely outside the K-fold process, and is used exactly once after
> the final model has already been chosen.

Q: Nếu chọn K = 5, cần huấn luyện bao nhiêu model, và mỗi model
dùng bao nhiêu phần dữ liệu làm Train (tính theo phân số của phần
Train+Validation)?
A: Cần huấn luyện 5 model. Mỗi model dùng 4/5 dữ liệu làm
Train và 1/5 dữ liệu làm Validation (fold còn lại).
EN: If K = 5, how many models need to be trained, and what fraction
of the Train+Validation data does each model use for training?
**A:** 5 models need to be trained. Each one uses 4/5 of the data for
> training and 1/5 (the remaining fold) for validation.

Q: Sau khi có 5 loss (L1 đến L5) từ 5 model, bước tiếp theo là gì?
A: Tính loss trung bình (Σ Li / 5) để đánh giá chất lượng
tổng thể của cách huấn luyện, sau đó huấn luyện lại 1 model cuối cùng
trên toàn bộ dữ liệu Train+Validation (không chia fold nữa) — model
này mới đem đi đánh giá trên Test Set.
EN: After getting 5 losses (L1 through L5) from 5 models, what's
the next step?
**A:** Average the losses (Σ Li / 5) to evaluate the overall quality
> of the training approach, then retrain one final model on the entire
> Train+Validation data (no more folds) — this final model is the one
> evaluated against the Test Set.
Q: Loss của bốn fold là 2, 4, 3, 3 thì trung bình là gì?
A: (2 + 4 + 3 + 3) / 4 = 3. Cần nhìn thêm độ dao động, không chỉ một giá trị trung bình *(bổ sung)*.
@tier B | Phỏng vấn lý thuyết
Q: K-fold có nghĩa là train tiếp cùng model K lần?
A: Không. Dùng cùng cấu hình, nhưng fit độc lập trên các phần train khác nhau. Nếu giữ tham số đã học từ fold trước, model có thể đã thấy dữ liệu validation hiện tại.
EN: Each fold requires an independent fit; carrying learned parameters across folds can leak validation information.
Q: Chọn K có đánh đổi nào?
A: K lớn cho mỗi model nhiều dữ liệu train hơn nhưng tăng số lần fit và không đảm bảo ước lượng ít biến động hơn. Chọn theo kích thước dữ liệu, sự phụ thuộc và chi phí, không mặc định K càng lớn càng tốt.
EN: Larger K increases training data per fit and computational cost; it does not guarantee a better estimate.
Q: Vì sao scaler phải nằm trong CV?
A: Mean/std tính ngoài CV đã thấy validation. Đặt scaler và model trong cùng pipeline để mỗi vòng học thống kê trên train của vòng đó.
EN: Preprocessing must be fitted inside each fold to keep validation statistics out of training.
Q: Điểm CV được dùng làm gì trước khi triển khai?
A: So sánh các cấu hình theo cùng split và metric, xem độ ổn định rồi chọn một cấu hình. Refit trên pool train+validation và đánh giá test độc lập; không chọn fold may mắn nhất làm model cuối.
EN: Use CV for configuration selection, then refit on the development pool and evaluate on a held-out test set.
@tier C | Tình huống doanh nghiệp
Q: Dữ liệu ít nhưng mỗi lần train rất đắt. Chọn CV sao?
A: Giữ một test phù hợp, thử số fold nhỏ và ít cấu hình trên baseline trước, đo độ dao động. Chỉ tăng fold khi sự bất ổn ảnh hưởng quyết định. Có thể đánh đổi độ chắc của ước lượng với thời gian và chi phí; không dùng test để tiết kiệm validation *(bổ sung)*.
WANT: Có chiến lược phân bổ ngân sách kiểm chứng.
Q: Team scale toàn bộ dữ liệu rồi mới K-fold. Sửa gì?
A: Chạy lại CV với scaler trong pipeline, fit riêng trong mỗi fold, giữ nguyên split và metric để so. Điểm có thể giảm vì bỏ leakage; sau chọn cấu hình mới fit toàn pipeline trên development pool *(bổ sung)*.
WANT: Nêu đúng vị trí leakage và cách đo lại công bằng.
Q: Một cấu hình thắng trung bình nhưng một fold tệ rõ rệt. Chọn luôn không?
A: Kiểm tra thành phần và chất lượng fold đó, nhóm khách, thời gian, nhãn và số mẫu. So phân bố điểm với baseline; nếu fold phản ánh phân khúc quan trọng thì phải xử lý hoặc báo rủi ro. Không xóa fold chỉ để nâng trung bình *(bổ sung)*.
WANT: Quan tâm tính ổn định và ý nghĩa của nhóm bị thất bại.
:::

## Nối sang bài sau

:::next
Xoay fold chưa đảm bảo mỗi lượt có đủ class cần đánh giá. [[bài:stratified-k-fold]] giữ xấp xỉ tỷ lệ class trong các fold, đặc biệt khi lớp thiểu số ít mẫu.
:::
