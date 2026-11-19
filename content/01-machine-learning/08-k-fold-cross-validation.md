---
title: K-fold Cross Validation
order: 8
description: "Một lần chia dao động theo may rủi và phí dữ liệu; K-fold của slide 23 và 24 cho mức điểm và độ dao động, refit model cuối và vẫn giữ riêng test."
slides: 23-24
needs: [train-test-split]
tags: [cross-validation, k-fold, leakage]
---

## Một con số từ một lần chia có đáng tin không?

:::intro Mục tiêu bài này
- Thấy vì sao với dữ liệu ít, một validation set nhỏ cho điểm **dao động mạnh theo may rủi**, và vì sao chia cứng 70/15/15 còn **phí dữ liệu** (slide 23).
- Hiểu K-fold: mỗi mẫu làm validation **đúng một lần**, nên ta báo cả trung bình lẫn độ dao động.
- Biết test set **không** tham gia K-fold, refit model cuối, và đặt scaler trong Pipeline để không rò rỉ.
:::

Ở [[bài:train-test-split]] ta chia ba tập cứng. Slide 23 chỉ ra điểm yếu: nếu dữ liệu ít thì **validation set rất nhỏ**. Ví dụ 100 mẫu chia Train 70, Validation 15, Test 15: model chỉ được học trên 70 mẫu (**phí dữ liệu**), còn validation 15 mẫu thì điểm đo nhiễu vô cùng (một mẫu đoán khác đi là điểm đổi 6.7 điểm phần trăm).

:::predict
Ta lấy **cùng một model** (Logistic Regression trên bộ Diabetes) và chia 80/20 theo **30 cách khác nhau** (khác `random_state`). Theo bạn, điểm accuracy nhận được dao động trong khoảng nào?
@answer
Từ **73.4% đến 82.5%**: chênh khoảng **9 điểm** chỉ vì may rủi của lần chia, trong khi model và dữ liệu không đổi. Với cây quyết định ở Project Bước 2, khoảng đó còn rộng hơn (65.6% đến 76.6%). Nếu hai model hơn kém nhau 2 điểm, **một lần chia không thể** nói ai hơn.
:::

## K-fold: xoay vai validation (slide 23)

Slide 23 vẽ ý tưởng bằng K = 4. **Test set cố định**, nằm riêng ngay từ đầu. Phần còn lại (train + validation) được chia thành **K phần bằng nhau** (gọi là [[từ:fold|fold]]), rồi huấn luyện **K model y hệt nhau**, mỗi lần đổi vai trò:

:::steps
Test set (15 mẫu) được tách ra và **cất đi**. Còn 85 mẫu, chia thành K = 4 fold: 21, 21, 21, 22 mẫu.
@step
**Lần 1 (L1):** fold 1 làm validation, 3 fold còn lại (khoảng 64 mẫu) để train. Huấn luyện một model **mới**, chấm trên fold 1, được loss L1.
@step
**Lần 2, 3, 4:** lặp lại, mỗi lần một fold khác làm validation. Sau 4 lần, **mọi mẫu đã làm validation đúng một lần** và đã tham gia train ba lần.
@step
**Tính trung bình loss:** (L1 + L2 + L3 + L4) / K, đúng công thức Σ Lᵢ / K ghi trên slide. Ta cũng nên xem **độ lệch chuẩn** của bốn điểm để biết mức dao động.
:::

Hãy tự xoay fold. Công cụ vẽ 100 mẫu minh họa và dùng điểm **thật** của Logistic Regression trên bộ train Diabetes (614 mẫu); bên dưới là so sánh với một lần chia 80/20.

:::widget fold-visualizer
:::

:::ck
Ở K = 5 điểm trung bình là 76.5% với độ lệch chuẩn 1.5 điểm; ở K = 10 là 75.9% với độ lệch chuẩn 5.2 điểm. Vì sao độ lệch chuẩn ở K = 10 lớn hơn nhiều?
@answer
Với K = 10, mỗi fold chỉ có khoảng **61 mẫu** (614 / 10), nên điểm của từng fold nhiễu hơn (đổi vài mẫu là điểm đổi nhiều). Trung bình vẫn ổn, nhưng từng fold riêng lẻ dao động nhiều hơn so với K = 5 (khoảng 123 mẫu mỗi fold). K lớn không làm điểm "tốt hơn", nó đổi cách điểm dao động.
:::

## Điểm CV dùng để làm gì, và model cuối ở đâu?

Slide 24 nhấn mạnh hai điều: **K-fold chỉ áp dụng cho train set và validation set**, còn **test set chỉ dùng một lần duy nhất** ở cuối. Điểm CV (trung bình ± độ lệch chuẩn) dùng để **so sánh cấu hình**: model nào, tham số nào, tiền xử lý nào. Khi đã chọn xong:

1. **Refit:** huấn luyện lại cấu hình đã chọn trên **toàn bộ** phần train + validation (85 mẫu trong ví dụ, nhiều hơn 70 của cách chia cứng). Các model trong từng fold chỉ là công cụ đo, không phải model để dùng.
2. **Chấm bộ test một lần.** Test chưa từng tham gia chọn nên là phép thử trung thực.

Điểm CV **không phải** điểm test: nó cho mức dự kiến và độ dao động; điểm test là một lần đo cuối cùng, độc lập. Project Bước 6 và Bước 8 làm đúng quy trình này.

## Làm sao để CV không rò rỉ?

Từng lượt phải **mô phỏng đúng** việc ta làm thật: model **mới** mỗi lượt, và **mọi bước học từ dữ liệu** (scaler, imputer) chỉ được `fit` trên phần train của lượt đó. Nếu ta scale cả bộ dữ liệu trước khi chia fold, thông tin của phần validation đã lọt vào ([[bài:feature-scaling]]). Cách để không thể làm sai là gói các bước vào một **Pipeline**:

```python
pipe = Pipeline([("scaler", StandardScaler()), ("model", LogisticRegression())])
cross_validate(pipe, x_train, y_train, cv=5, scoring="accuracy")
```

Mỗi lượt, Pipeline tự `fit` lại scaler chỉ trên phần học của lượt đó.

:::ck
Bạn `fit` StandardScaler trên toàn bộ `x_train`, rồi mới chạy cross-validation trên dữ liệu đã scale. Điểm CV sai ở đâu?
@answer
Lúc `fit`, scaler đã nhìn thấy cả phần validation của **mọi** lượt, nên điểm CV lạc quan hơn thực tế (một dạng [[từ:data-leakage|rò rỉ dữ liệu]]). Đúng cách: đặt scaler trong Pipeline để mỗi lượt tự `fit` lại chỉ trên phần train của lượt đó.
:::

## Chọn K và những giới hạn

- **5 hoặc 10** là hai lựa chọn phổ biến (slide ví dụ K = 4). K lớn: mỗi lượt train trên nhiều dữ liệu hơn nên giống tình huống thật hơn, nhưng mỗi fold nhỏ nên điểm từng fold nhiễu hơn, và tốn thời gian hơn (K lần huấn luyện). K nhỏ: nhanh hơn, nhưng mỗi lượt train trên ít dữ liệu nên điểm hơi bi quan.
- **Lớp hiếm:** dùng [[bài:stratified-k-fold]] để mỗi fold giữ đúng tỉ lệ nhãn.
- **Dữ liệu theo thời gian hoặc theo nhóm:** không xáo ngẫu nhiên; dùng cách chia tôn trọng thời gian hoặc nhóm.
- **Dữ liệu rất lớn:** một validation set cứng đã đủ lớn, không cần K-fold.

## Vòng lặp K-fold viết bằng code

Mỗi vòng **khởi tạo model mới** (không học tiếp từ vòng trước), train trên các fold còn lại, chấm trên fold validation, rồi lấy trung bình. Scaler, imputer, encoder cũng chỉ fit trên phần train của mỗi fold:

```python
from sklearn.model_selection import KFold
import numpy as np
kf = KFold(n_splits=4, shuffle=True, random_state=42)
losses = []
for train_idx, val_idx in kf.split(X_train_val):
    X_tr, X_val = X_train_val[train_idx], X_train_val[val_idx]
    y_tr, y_val = y_train_val[train_idx], y_train_val[val_idx]
    model = train_model(X_tr, y_tr)       # model mới, huấn luyện trên fold train
    loss = evaluate(model, X_val, y_val)  # chấm trên fold validation
    losses.append(loss)
average_loss = np.mean(losses)            # nên báo cả độ dao động giữa các fold
```

Với 100 mẫu và K = 4, mỗi vòng train trên 75 mẫu (so với 70 của cách chia 70/15/15), và cả 100 mẫu đều từng làm validation đúng một lần.

## Những hiểu sai thường gặp

- **"K-fold huấn luyện một model."** Không: nó huấn luyện **K model độc lập**, rồi lấy trung bình điểm.
- **"CV thay thế được test set."** Không: CV dùng để chọn; test vẫn cần để chấm cuối.
- **"Test set cũng được chia vào các fold."** Không: slide 24 nói test đã tách ngay từ đầu.
- **"Điểm CV cao thì model chắc chắn tốt."** Nó là ước lượng; nếu quy trình rò rỉ thì điểm vẫn cao giả tạo.

:::card K-fold Cross Validation
- **Vấn đề:** dữ liệu ít thì validation nhỏ và nhiễu; một lần chia dao động (Logistic: 73.4% đến 82.5% qua 30 lần chia).
- **K-fold:** test cất riêng; train + validation chia K fold; K model mới, mỗi lần một fold làm validation; **mọi mẫu làm validation đúng một lần**; loss trung bình Σ Lᵢ / K.
- **Báo cáo:** trung bình **và** độ lệch chuẩn của K điểm (Diabetes: K = 5 là 76.5% ± 1.5; K = 10 là 75.9% ± 5.2).
- **Sau khi chọn:** refit trên toàn bộ train + validation, rồi chấm test **một lần**.
- **Không rò rỉ:** model mới mỗi lượt; scaler, imputer nằm trong Pipeline.
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

Thực hành: [[bài:diabetes-evaluate-improve]] — so pipeline trên development với cùng fold, không chọn model bằng test.
:::
