---
title: Classification vs Regression
order: 10
description: "Phân loại đoán nhóm, hồi quy đoán số; dạng đầu ra quyết định loss, metric và cách đặt bài toán."
slides: 25-26
needs: [learning-paradigms]
tags: [classification, regression, multiclass, multilabel, ordinal]
---

## Ta cần dự đoán một nhãn hay một đại lượng?

:::intro Mục tiêu bài này
- Phân biệt **phân loại** (đầu ra là nhóm) và **hồi quy** (đầu ra là số đo).
- Thấy rằng dạng đầu ra quyết định **loss và metric** phù hợp.
- Tự phân loại một tình huống thật bằng một chuỗi câu hỏi ngắn.
:::

Hai câu hỏi nghe giống nhau nhưng khác hẳn: "người này có bị tiểu đường **không**?" (một trong hai nhóm) và "đường huyết của người này sẽ là **bao nhiêu**?" (một con số). Câu đầu là **phân loại (classification)**; câu sau là **hồi quy (regression)**.

| | Phân loại | Hồi quy |
|---|---|---|
| **Đầu ra** | nhãn rời rạc (nhóm) | số liên tục, có ý nghĩa đo lường |
| **Ví dụ** | spam hay không, loại bệnh | giá nhà, nhiệt độ |
| **Loss thường dùng** | cross-entropy (log loss) | MSE, MAE |
| **Metric thường dùng** | accuracy, precision, recall, F1 ([[bài:classification-metrics]]) | MAE, RMSE, R² ([[bài:regression-metrics]]) |

Cách chọn dạng bài quyết định cả loss lẫn cách đo, nên là bước đầu tiên khi đặt bài toán.

:::predict
Phân loại hay hồi quy? (1) đoán số sao (1 đến 5) khách chấm; (2) đoán một email là spam hay không; (3) đoán doanh thu tháng sau; (4) đoán loại tin tức (thể thao, kinh tế, giải trí); (5) đoán số lượt bấm vào quảng cáo; (6) đoán mức độ hài lòng "thấp, vừa, cao".
@answer
(1) **Có thể cả hai**: tùy cách đặt. Nếu coi 1 đến 5 là năm nhóm thì phân loại (nhóm có thứ tự); nếu coi là số đo và muốn đoán 3.7 thì hồi quy. (2) **Phân loại nhị phân.** (3) **Hồi quy.** (4) **Phân loại nhiều lớp.** (5) **Hồi quy** (số đếm, hoặc mô hình đếm chuyên biệt). (6) **Phân loại** có thứ tự (ordinal). Mấu chốt: **có thứ tự hay là số không đủ để gọi là hồi quy**; phải hỏi ta muốn đoán **nhóm** hay **một số có khoảng cách đều**.
:::

## Các dạng đầu ra cần phân biệt

- **Nhị phân:** hai nhóm (có bệnh hay không).
- **Nhiều lớp:** nhiều nhóm loại trừ nhau (một tin chỉ thuộc một chuyên mục).
- **Nhiều nhãn:** một mẫu có thể có nhiều nhãn cùng lúc (một ảnh vừa có "chó" vừa có "bãi cỏ").
- **Hồi quy:** số liên tục.
- **Đếm và thứ tự:** nằm giữa hai bờ; chọn cách đặt phù hợp với việc cần dùng kết quả để làm gì.

:::ck
Công ty muốn đoán "khách hàng có rời đi trong tháng tới không" và cũng muốn đoán "khách sẽ chi bao nhiêu tiền trong tháng tới". Mỗi câu là dạng bài nào, và metric nào hợp lý?
@answer
Câu đầu **phân loại nhị phân** (metric: recall, precision, F1; có thể cần ngưỡng). Câu sau **hồi quy** (metric: MAE hoặc RMSE). Dùng cùng dữ liệu khách hàng nhưng **hai mô hình, hai loss, hai cách đo** khác nhau.
:::

:::slides 25-26 | Slide 25–26: classification và regression
:::

:::card Classification và Regression
- **Phân loại:** đoán nhóm. **Hồi quy:** đoán số có khoảng cách đều.
- **Dạng bài quyết định loss và metric** (cross-entropy với accuracy, precision, recall; MSE với MAE, RMSE).
- **Có thứ tự hay là số chưa đủ** để gọi là hồi quy; hỏi ta muốn đoán nhóm hay số.
- **Một dữ liệu có thể sinh nhiều bài toán** (rời đi hay không là phân loại; chi bao nhiêu là hồi quy).
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Điểm khác biệt cốt lõi giữa Classification và Regression là gì?
A: Ở dạng của label (output). Classification dự đoán một nhãn
trong tập hữu hạn các class rời rạc; Regression dự đoán một số thực
liên tục. Phép thử nhanh: nếu một đáp án hợp lệ có thể nằm giữa hai đáp
án hợp lệ khác thì đó là Regression.
EN: What is the core difference between Classification and
Regression?
**A:** The form of the label. Classification predicts one of a finite
> set of discrete classes; Regression predicts a continuous real
> number. Quick test: if a valid answer can fall between two other
> valid answers, it's Regression.

Q: Multiclass và Multilabel khác nhau thế nào? Cho mỗi loại một
ví dụ.
A: Multiclass: mỗi mẫu thuộc **đúng một** class trong ≥ 3 class
(ảnh là sushi, steak hoặc pizza). Multilabel: mỗi mẫu có thể mang
**nhiều nhãn cùng lúc** (bài viết được gắn cả tag "Machine learning"
lẫn "Artificial intelligence").
EN: How do Multiclass and Multilabel differ? Give an example of
each.
**A:** Multiclass: each sample belongs to **exactly one** of ≥ 3
> classes (a photo is sushi, steak or pizza). Multilabel: each sample
> can carry **several labels at once** (an article tagged both "Machine
> learning" and "Artificial intelligence").

Q: Cột `Outcome` của Diabetes dataset chứa các số 0 và 1. Đây là
bài toán Regression hay Classification? Vì sao?
A: Binary Classification. 0 và 1 chỉ là mã hóa của hai class
(không bệnh / có bệnh), không có giá trị nào nằm giữa, và phép so sánh
"lớn hơn" giữa chúng không mang ý nghĩa đại lượng.
EN: The Diabetes `Outcome` column contains 0s and 1s. Regression or
Classification? Why?
**A:** Binary Classification. 0 and 1 are just codes for two classes
> (no diabetes / diabetes); no value lies in between and "greater than"
> carries no quantitative meaning.

Q: Vì sao phải xác định dạng bài **trước** khi chọn metric đánh
giá?
A: Vì metric phụ thuộc dạng bài. Classification đo xem đoán
**đúng hay sai nhãn** (Confusion Matrix, Accuracy, Precision, Recall,
F1, ROC/AUC); Regression đo **sai lệch bao nhiêu** giữa hai con số
(MAE, RMSE). Dùng nhầm — ví dụ tính Accuracy cho giá nhà — sẽ cho kết
quả vô nghĩa, vì gần như không bao giờ đoán trúng chính xác từng đồng.
EN: Why must the problem type be identified **before** choosing an
evaluation metric?
**A:** Metrics depend on the problem type. Classification measures
> whether the **label is right or wrong** (Confusion Matrix, Accuracy,
> Precision, Recall, F1, ROC/AUC); Regression measures **how far off**
> a number is (MAE, RMSE). Mixing them up — e.g. computing Accuracy on
> house prices — is meaningless.

Q: "Dự đoán ngày mai mưa hay không" và "dự đoán lượng mưa ngày
mai" — hai bài này thuộc dạng nào? Rút ra điều gì?
A: Bài đầu là Binary Classification, bài sau là Regression.
Cùng một nhu cầu thực tế có thể được thiết kế thành hai dạng bài khác
nhau tùy câu hỏi muốn trả lời, nên việc chọn dạng bài là một quyết định
thiết kế, không chỉ là "nhìn dữ liệu là biết".
EN: "Will it rain tomorrow?" vs "how much will it rain tomorrow?" —
which type is each, and what's the lesson?
**A:** The first is Binary Classification, the second is Regression.
> The same real-world need can be framed as different problem types
> depending on the question, so choosing the type is a design decision.
@tier B | Phỏng vấn lý thuyết
Q: Vì sao Outcome số 0/1 vẫn là classification?
A: Đây là mã của hai class, không phải đại lượng có khoảng cách cần tối ưu. Model có thể xuất xác suất nhưng target vẫn là class và cần metric phân loại.
EN: Numeric codes for categories remain classification targets; a probability output does not change the task type.
Q: Một mẫu có nhiều class có luôn là multiclass không?
A: Không. Multiclass chọn đúng một trong nhiều class, còn multilabel cho phép nhiều nhãn đồng thời. Phân loại món ăn loại trừ nhau khác gắn nhiều thể loại phim.
EN: Multiclass selects one class; multilabel assigns multiple potentially co-occurring labels.
Q: Dự đoán số khách ngày mai là regression hay classification?
A: Thường là bài toán số đếm vì chênh lệch có ý nghĩa định lượng. Có thể đặt thành nhóm thấp/vừa/cao nếu quyết định chỉ cần nhóm, nhưng sẽ mất chi tiết và đổi metric.
EN: Counts are quantitative targets; discretizing them into categories changes the objective and loses detail.
Q: Có thể dùng accuracy cho mọi target số không?
A: Không. Với giá nhà, sai ít vẫn không khớp tuyệt đối nên accuracy không phản ánh mức sai. Dùng MAE/RMSE; với mã class số thì dùng metric classification.
EN: Exact-match accuracy is not a meaningful general-purpose metric for continuous predictions.
@tier C | Tình huống doanh nghiệp
Q: Sàn có rating theo sao và muốn dự đoán mức hài lòng. Chọn dạng bài nào?
A: Hỏi cần điểm số hay mức để hành động. Nếu thứ tự quan trọng nhưng khoảng cách chưa đều, cân nhắc ordinal classification; nếu dùng điểm trung bình có thể thử regression kèm giả định rõ. So theo chi phí dự đoán lệch nhiều mức, không chỉ accuracy *(bổ sung)*.
WANT: Không chọn chỉ vì nhãn được lưu bằng số.
Q: Một bài viết có thể thuộc nhiều chủ đề nhưng hệ thống bắt chọn một. Sửa thế nào?
A: Kiểm tra định nghĩa nhãn và mục tiêu tìm kiếm. Nếu chủ đề thực sự đồng thời, đổi thành multilabel và dữ liệu gán nhiều nhãn; đánh giá theo từng tag và chi phí bỏ sót. Nếu nghiệp vụ cần một mục chính, giữ multiclass với quy tắc mục chính rõ *(bổ sung)*.
WANT: Biết mục tiêu nghiệp vụ quyết định tính loại trừ của class.
Q: Kho chỉ cần biết ngày mai nhu cầu vượt sức chứa không. Cần regression?
A: Có thể classification vượt/không vượt nếu đó là quyết định duy nhất. Regression dự báo số lượng hỗ trợ nhiều ngưỡng nhưng đòi hỏi metric và kiểm chứng khác. Chọn theo hành động, chi phí báo động giả/bỏ sót và nhu cầu chi tiết *(bổ sung)*.
WANT: Biết cùng một dữ liệu có nhiều cách đặt bài toán hợp lệ.
:::

## Nối sang bài sau

:::next
Khi đầu ra là class, sai không chỉ có một kiểu. [[bài:confusion-matrix]] tách báo động giả và bỏ sót thành bốn ô TP, FP, FN, TN.
:::

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Phân loại bài toán từ target thay vì dtype.
- Phân biệt multiclass và multilabel.
- Liên hệ dạng bài với loss và metric.
:::

Nền để đọc bài này: [[bài:learning-paradigms]]. Ví dụ mô hình hồi quy đầu tiên ở module 02: [[bài:linear-regression]].

> **EN:** Linear Regression in module 02 provides a first concrete regression model.

:::slides 25-26 | Slide gốc — Classification vs Regression
:::

Trong Supervised Learning, mọi bài toán đều có dạng "nhìn feature → đoán
label". Điểm khác nhau nằm ở **label trông như thế nào**:

- Nếu label là **một nhãn trong một tập hữu hạn** (spam / không spam;
  mèo / chó / ngựa) → bài toán **Classification (phân loại)**.
- Nếu label là **một con số liên tục** (giá nhà 3.75 tỉ, nhiệt độ 31.4°C)
  → bài toán **Regression (hồi quy)**.

Câu hỏi để tự phân biệt: *"Đáp án có thể nằm ở giữa hai giá trị không?"*
Giá nhà 3.75 và 3.76 tỉ đều hợp lệ, còn 3.755 cũng hợp lệ → Regression.
Một email không thể "nửa spam nửa không" → Classification.

> **EN:** Every Supervised Learning problem has the form "look at the
> features → predict the label". What differs is **what the label looks
> like**: a value from a finite set of categories (spam / not spam; cat /
> dog / horse) means **Classification**; a continuous number (a house
> price of 3.75 billion VND, a temperature of 31.4°C) means
> **Regression**. A quick test: *"Can a valid answer fall between two
> other valid answers?"* If yes, it's Regression.

## [sâu] Dạng bài quyết định loss và metric

[[bài:learning-paradigms]] đã chia ML thành Supervised / Unsupervised / Reinforcement. Bài này
đi sâu vào nhánh **Supervised**, chia tiếp thành hai dạng bài ([[slide:25]]):

```
Supervised Learning
├── Classification (phân loại)
│   ├── Binary Classification      — 2 class
│   └── Multiclass Classification  — từ 3 class trở lên
│   (+ Multilabel Classification   — slide 26)
└── Regression (hồi quy)
```

Xác định đúng dạng bài là **việc đầu tiên** cần làm, vì nó quyết định ba
thứ phía sau:

1. **Loss function** dùng khi train — Regression hay dùng L1/L2 ([[bài:loss-function]]);
   Classification dùng loss khác (Cross-Entropy, sẽ học ở module 02).
2. **Cách chia dữ liệu** — Stratified K-fold ([[bài:stratified-k-fold]]) chỉ áp dụng được cho
   Classification.
3. **Metric đánh giá** — Classification dùng Confusion Matrix, Accuracy,
   Precision, Recall, F1, ROC/AUC ([[bài:confusion-matrix]] đến [[bài:roc-auc]]); Regression dùng MAE, RMSE
   ([[bài:regression-metrics]]).

> **EN:** Lesson 03 split ML into Supervised / Unsupervised /
> Reinforcement. This lesson zooms into the **Supervised** branch, which
> splits into two problem types. Identifying the problem type is the
> **first** decision, because it determines the loss function used in
> training, how the data can be split (Stratified K-fold only works for
> Classification), and which evaluation metrics apply.

## [sâu] Các dạng đầu ra cần phân biệt

### Classification — Binary

Chỉ có **2 class**. Chú thích tay trong [[slide:26]] tóm gọn: *"one thing or
another"* — cái này hoặc cái kia.

Ví dụ trong [[slide:25]]:

| Bài toán | Class 1 | Class 2 |
|---|---|---|
| Fraud detection (phát hiện gian lận) | giao dịch gian lận | giao dịch bình thường |
| Email spam detection | spam | not spam |
| Diagnostics (chẩn đoán) | có bệnh | không bệnh |

[[slide:26]] minh họa bằng hai email: một email viết bình thường ("This deep
learning course is incredible!") → *Not spam*; một email kiểu
"C0ngratu1ations! U win $1139239230" → *Spam*.

Trong Binary Classification thường gọi một class là **class dương
(positive, +)** — class ta quan tâm, muốn bắt được — và class còn lại là
**class âm (negative, −)**. Quy ước này cực kỳ quan trọng ở [[bài:confusion-matrix]].

> **EN:** Binary Classification has exactly **2 classes** — the slide's
> handwritten note puts it as *"one thing or another"*. Examples: fraud
> detection, email spam detection, medical diagnostics. One class is
> usually designated the **positive class (+)** — the one we care about
> catching — and the other the **negative class (−)**. This convention
> becomes central in the next lesson.

### Classification — Multiclass

Từ **3 class trở lên**, mỗi mẫu thuộc **đúng một** class. Chú thích tay
[[slide:26]]: *"more than one thing or another"*.

Ví dụ [[slide:25]]: động vật (cat / dog / horse), trái cây (apple / orange /
lemon), hoa (rose / daisy / sunflower). [[slide:26]]: ảnh này là sushi, steak
hay pizza?

> **EN:** Multiclass Classification has **3 or more classes**, and each
> sample belongs to **exactly one** of them — *"more than one thing or
> another"*. Examples: animals (cat / dog / horse), fruits, flowers, or
> "is this photo sushi, steak or pizza?".

### Classification — Multilabel

[[slide:26]] nhắc thêm dạng thứ ba: **Multilabel Classification** — mỗi mẫu
có thể mang **nhiều nhãn cùng lúc**. Chú thích tay: *"multiple label
options per sample"*. Ví dụ: một bài viết Wikipedia về Deep Learning được
gắn đồng thời 3 tag *Machine learning*, *Representation learning*,
*Artificial intelligence*.

Khác biệt với Multiclass nằm ở chữ "đúng một":

| | Multiclass | Multilabel |
|---|---|---|
| Số nhãn mỗi mẫu | đúng 1 | 0, 1 hoặc nhiều |
| Ví dụ | ảnh là sushi **hoặc** pizza | bài viết vừa là ML **vừa là** AI |
| Label dạng | `"pizza"` | `[1, 0, 1]` (có/không cho từng tag) |

*(Bổ sung — không có trong slide)* Một cách nhìn hữu ích: Multilabel với K
tag có thể coi như **K bài Binary Classification chạy song song**, mỗi bài
trả lời "mẫu này có tag thứ k hay không".

> **EN:** [[slide:26]] adds a third type: **Multilabel Classification**, where
> each sample can carry **several labels at once** — *"multiple label
> options per sample"* — e.g. a Wikipedia article on Deep Learning tagged
> *Machine learning*, *Representation learning* and *Artificial
> intelligence* simultaneously. Multiclass means exactly one label per
> sample; multilabel means zero, one or many. *(Supplementary, not in the
> slides)* A multilabel problem with K tags can be viewed as **K binary
> classification problems running in parallel**.

### Regression

Output là **một số thực liên tục**. Ví dụ [[slide:25]]: ước lượng giá nhà
(house price estimation), dự đoán giá cổ phiếu (stock prediction), dự báo
nhiệt độ (temperature forecast). Ví dụ giá nhà chính là dataset đã gặp ở
[[bài:loss-function]] Loss Function.

> **EN:** Regression outputs **a continuous real number**. Examples: house
> price estimation, stock prediction, temperature forecasting. The house
> price example is the same dataset used in lesson 06 (Loss Function).

### Bẫy hay gặp khi phân loại dạng bài *(Bổ sung — không có trong slide)*

**Bẫy 1 — label là số nhưng vẫn là Classification.** Cột `Outcome` trong
Diabetes dataset ([[bài:labeled-data]]) có giá trị `0` / `1`, trông như số, nhưng là
**mã hóa của class** (không bệnh / có bệnh). Không có mẫu nào có
Outcome = 0.5. → Binary Classification.

**Bẫy 2 — số nguyên chưa chắc là class.** Dự đoán *số tầng* của một căn
nhà (1, 2, 3, …) hay *số khách đến quán ngày mai* là số nguyên, nhưng
giữa chúng có **thứ tự và khoảng cách** có ý nghĩa (đoán 5 khi thật là 6
thì tốt hơn đoán 20). → thường xử lý như Regression.

**Bẫy 3 — cùng một nhu cầu, có thể đặt thành hai dạng.** "Ngày mai có mưa
không?" là Classification; "ngày mai mưa bao nhiêu mm?" là Regression. Một
bài toán thực tế có thể được **thiết kế** theo dạng nào tùy câu hỏi ta
muốn trả lời.

**Bẫy 4 — tên gọi Logistic Regression.** Thuật toán này có chữ
"Regression" nhưng được dùng cho **Classification**; xem [[bài:logistic-regression]] ở module 02.
Tên gọi có lý do lịch sử, đừng phân loại theo tên.

> **EN:** *(Supplementary, not in the slides)* Common traps: (1) a numeric
> label can still be a class code — Diabetes `Outcome` is 0/1, which is
> Binary Classification; (2) an integer target with meaningful order and
> distance (number of floors, number of customers) is usually treated as
> Regression; (3) the same real-world need can be framed either way —
> "will it rain tomorrow?" vs "how many mm of rain?"; (4) despite its
> name, Logistic Regression is a **classification** algorithm.

## [sâu] Tám tình huống để tự phân loại

:::worked Ví dụ và số liệu đối chiếu
Xác định dạng bài cho từng tình huống sau (che cột phải để tự làm trước):

| # | Tình huống | Dạng bài | Lý do |
|---|---|---|---|
| 1 | Ngân hàng dự đoán khách có trả nợ đúng hạn không | Binary | 2 class: trả / không trả |
| 2 | Dự đoán điểm thi THPT môn Toán (0–10, bước 0.2) | Regression | điểm có thứ tự và khoảng cách |
| 3 | Nhận dạng chữ số viết tay 0–9 | Multiclass | 10 class, mỗi ảnh đúng 1 chữ số |
| 4 | Gắn tag thể loại cho phim (hành động, hài, tình cảm…) | Multilabel | 1 phim có thể nhiều thể loại |
| 5 | Dự đoán lượng điện tiêu thụ tháng sau (kWh) | Regression | số thực liên tục |
| 6 | Ảnh X-quang: bình thường / viêm phổi / lao | Multiclass | 3 class loại trừ nhau |
| 7 | Dự đoán Outcome trong Diabetes dataset | Binary | 0 / 1 là mã class |
| 8 | Phân loại bình luận: tích cực / tiêu cực | Binary | 2 class |

*(Bổ sung — các tình huống trên do Claude soạn, không có trong slide.)*

> **EN:** Exercise: identify the problem type for each scenario (loan
> repayment → Binary; national exam math score → Regression; handwritten
> digits 0–9 → Multiclass; movie genre tags → Multilabel; next month's
> electricity usage → Regression; chest X-ray normal / pneumonia /
> tuberculosis → Multiclass; Diabetes `Outcome` → Binary; positive /
> negative comment → Binary). *(Scenarios written by Claude, not from the
> slides.)*
:::

## [sâu] Code chỉ gợi ý, ý nghĩa mới quyết định

Kiểm tra nhanh kiểu label bằng code — một thói quen tốt khi mới nhận
dataset:

```python
import numpy as np

def guess_problem_type(y, max_classes=20):
    """Đoán dạng bài từ vector label y (chỉ là gợi ý, luôn kiểm tra lại bằng hiểu biết về dữ liệu)."""
    y = np.asarray(y)
    if y.ndim == 2:                       # mỗi mẫu là 1 vector 0/1 → multilabel
        return "Multilabel classification"
    n_unique = len(np.unique(y))
    if y.dtype.kind in "OUSb":            # chuỗi / bool → chắc chắn là class
        return "Binary classification" if n_unique == 2 else "Multiclass classification"
    if n_unique == 2:
        return "Binary classification (nhãn số nhưng chỉ 2 giá trị)"
    if n_unique <= max_classes and np.all(y == y.astype(int)):
        return "Có thể là Multiclass HOẶC Regression số nguyên — cần xem ý nghĩa"
    return "Regression"

print(guess_problem_type(["spam", "not spam", "spam"]))       # Binary
print(guess_problem_type(["sushi", "steak", "pizza"]))        # Multiclass
print(guess_problem_type([[1, 0, 1], [0, 1, 1]]))             # Multilabel
print(guess_problem_type([0, 1, 1, 0, 1]))                    # Binary (Outcome)
print(guess_problem_type([3.75, 4.12, 2.2, 2.3]))             # Regression
print(guess_problem_type([1, 2, 3, 4, 2, 3]))                 # cần xem ý nghĩa
```

Hàm này chỉ dựa vào **hình dạng dữ liệu**, nên trường hợp cuối nó không
tự quyết được — đúng như Bẫy 2 ở phần 3.5: số nguyên có thể là class hoặc
là đại lượng đếm. Quyết định cuối cùng luôn dựa trên **ý nghĩa** của label.

> **EN:** A quick sanity check on the label vector — a good habit when
> receiving a new dataset. The function only looks at the **shape of the
> data**, so it can't decide the last case on its own: small integers may
> be class codes or counts. The final decision always rests on what the
> label **means**.

## [sâu] Target có thứ tự chưa quyết định một cách làm (bổ sung)

:::note Rating và số đếm
Số sao có thứ tự, có thể đặt thành ordinal classification hoặc regression tùy mục tiêu và giả định khoảng cách. Quy tắc 'có số nằm giữa' chỉ là mẹo nhập môn; số đếm vẫn có thể là regression. X-quang trong bảng chỉ là multiclass nếu các nhãn được định nghĩa loại trừ nhau; bệnh có thể đồng thời xuất hiện thì dùng multilabel.
:::

> **EN:** Problem formulation depends on target semantics and the decision objective. Ordered ratings and integer counts require more care than a dtype-based heuristic.
