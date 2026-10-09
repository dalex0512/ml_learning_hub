---
title: Classification vs Regression
order: 10
description: Hai dạng bài toán cốt lõi của Supervised Learning — dự đoán nhãn rời rạc (Classification) hay dự đoán con số liên tục (Regression) — và vì sao phân biệt đúng dạng bài quyết định cả model lẫn cách đánh giá.
---

## 1. Ý tưởng

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

## 2. Vị trí trong bức tranh lớn

Bài 03 đã chia ML thành Supervised / Unsupervised / Reinforcement. Bài này
đi sâu vào nhánh **Supervised**, chia tiếp thành hai dạng bài (slide 25):

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

1. **Loss function** dùng khi train — Regression hay dùng L1/L2 (bài 06);
   Classification dùng loss khác (Cross-Entropy, sẽ học ở module 02).
2. **Cách chia dữ liệu** — Stratified K-fold (bài 09) chỉ áp dụng được cho
   Classification.
3. **Metric đánh giá** — Classification dùng Confusion Matrix, Accuracy,
   Precision, Recall, F1, ROC/AUC (bài 11–13); Regression dùng MAE, RMSE
   (bài 14).

> **EN:** Lesson 03 split ML into Supervised / Unsupervised /
> Reinforcement. This lesson zooms into the **Supervised** branch, which
> splits into two problem types. Identifying the problem type is the
> **first** decision, because it determines the loss function used in
> training, how the data can be split (Stratified K-fold only works for
> Classification), and which evaluation metrics apply.

## 3. Cách hoạt động

### 3.1. Classification — Binary

Chỉ có **2 class**. Chú thích tay trong slide 26 tóm gọn: *"one thing or
another"* — cái này hoặc cái kia.

Ví dụ trong slide 25:

| Bài toán | Class 1 | Class 2 |
|---|---|---|
| Fraud detection (phát hiện gian lận) | giao dịch gian lận | giao dịch bình thường |
| Email spam detection | spam | not spam |
| Diagnostics (chẩn đoán) | có bệnh | không bệnh |

Slide 26 minh họa bằng hai email: một email viết bình thường ("This deep
learning course is incredible!") → *Not spam*; một email kiểu
"C0ngratu1ations! U win $1139239230" → *Spam*.

Trong Binary Classification thường gọi một class là **class dương
(positive, +)** — class ta quan tâm, muốn bắt được — và class còn lại là
**class âm (negative, −)**. Quy ước này cực kỳ quan trọng ở bài 11.

> **EN:** Binary Classification has exactly **2 classes** — the slide's
> handwritten note puts it as *"one thing or another"*. Examples: fraud
> detection, email spam detection, medical diagnostics. One class is
> usually designated the **positive class (+)** — the one we care about
> catching — and the other the **negative class (−)**. This convention
> becomes central in the next lesson.

### 3.2. Classification — Multiclass

Từ **3 class trở lên**, mỗi mẫu thuộc **đúng một** class. Chú thích tay
slide 26: *"more than one thing or another"*.

Ví dụ slide 25: động vật (cat / dog / horse), trái cây (apple / orange /
lemon), hoa (rose / daisy / sunflower). Slide 26: ảnh này là sushi, steak
hay pizza?

> **EN:** Multiclass Classification has **3 or more classes**, and each
> sample belongs to **exactly one** of them — *"more than one thing or
> another"*. Examples: animals (cat / dog / horse), fruits, flowers, or
> "is this photo sushi, steak or pizza?".

### 3.3. Classification — Multilabel

Slide 26 nhắc thêm dạng thứ ba: **Multilabel Classification** — mỗi mẫu
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

> **EN:** Slide 26 adds a third type: **Multilabel Classification**, where
> each sample can carry **several labels at once** — *"multiple label
> options per sample"* — e.g. a Wikipedia article on Deep Learning tagged
> *Machine learning*, *Representation learning* and *Artificial
> intelligence* simultaneously. Multiclass means exactly one label per
> sample; multilabel means zero, one or many. *(Supplementary, not in the
> slides)* A multilabel problem with K tags can be viewed as **K binary
> classification problems running in parallel**.

### 3.4. Regression

Output là **một số thực liên tục**. Ví dụ slide 25: ước lượng giá nhà
(house price estimation), dự đoán giá cổ phiếu (stock prediction), dự báo
nhiệt độ (temperature forecast). Ví dụ giá nhà chính là dataset đã gặp ở
bài 06 Loss Function.

> **EN:** Regression outputs **a continuous real number**. Examples: house
> price estimation, stock prediction, temperature forecasting. The house
> price example is the same dataset used in lesson 06 (Loss Function).

### 3.5. Bẫy hay gặp khi phân loại dạng bài *(Bổ sung — không có trong slide)*

**Bẫy 1 — label là số nhưng vẫn là Classification.** Cột `Outcome` trong
Diabetes dataset (bài 04) có giá trị `0` / `1`, trông như số, nhưng là
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
"Regression" nhưng được dùng cho **Classification** (sẽ gặp ở module 02).
Tên gọi có lý do lịch sử, đừng phân loại theo tên.

> **EN:** *(Supplementary, not in the slides)* Common traps: (1) a numeric
> label can still be a class code — Diabetes `Outcome` is 0/1, which is
> Binary Classification; (2) an integer target with meaningful order and
> distance (number of floors, number of customers) is usually treated as
> Regression; (3) the same real-world need can be framed either way —
> "will it rain tomorrow?" vs "how many mm of rain?"; (4) despite its
> name, Logistic Regression is a **classification** algorithm.

## 4. Ví dụ tay

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

## 5. Code

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

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Điểm khác biệt cốt lõi giữa Classification và Regression là gì?
> **Đáp án:** Ở dạng của label (output). Classification dự đoán một nhãn
> trong tập hữu hạn các class rời rạc; Regression dự đoán một số thực
> liên tục. Phép thử nhanh: nếu một đáp án hợp lệ có thể nằm giữa hai đáp
> án hợp lệ khác thì đó là Regression.

**Câu 2:** Multiclass và Multilabel khác nhau thế nào? Cho mỗi loại một
ví dụ.
> **Đáp án:** Multiclass: mỗi mẫu thuộc **đúng một** class trong ≥ 3 class
> (ảnh là sushi, steak hoặc pizza). Multilabel: mỗi mẫu có thể mang
> **nhiều nhãn cùng lúc** (bài viết được gắn cả tag "Machine learning"
> lẫn "Artificial intelligence").

**Câu 3:** Cột `Outcome` của Diabetes dataset chứa các số 0 và 1. Đây là
bài toán Regression hay Classification? Vì sao?
> **Đáp án:** Binary Classification. 0 và 1 chỉ là mã hóa của hai class
> (không bệnh / có bệnh), không có giá trị nào nằm giữa, và phép so sánh
> "lớn hơn" giữa chúng không mang ý nghĩa đại lượng.

**Câu 4:** Vì sao phải xác định dạng bài **trước** khi chọn metric đánh
giá?
> **Đáp án:** Vì metric phụ thuộc dạng bài. Classification đo xem đoán
> **đúng hay sai nhãn** (Confusion Matrix, Accuracy, Precision, Recall,
> F1, ROC/AUC); Regression đo **sai lệch bao nhiêu** giữa hai con số
> (MAE, RMSE). Dùng nhầm — ví dụ tính Accuracy cho giá nhà — sẽ cho kết
> quả vô nghĩa, vì gần như không bao giờ đoán trúng chính xác từng đồng.

**Câu 5:** "Dự đoán ngày mai mưa hay không" và "dự đoán lượng mưa ngày
mai" — hai bài này thuộc dạng nào? Rút ra điều gì?
> **Đáp án:** Bài đầu là Binary Classification, bài sau là Regression.
> Cùng một nhu cầu thực tế có thể được thiết kế thành hai dạng bài khác
> nhau tùy câu hỏi muốn trả lời, nên việc chọn dạng bài là một quyết định
> thiết kế, không chỉ là "nhìn dữ liệu là biết".

> **EN:**
>
> **Q1:** What is the core difference between Classification and
> Regression?
> > **A:** The form of the label. Classification predicts one of a finite
> > set of discrete classes; Regression predicts a continuous real
> > number. Quick test: if a valid answer can fall between two other
> > valid answers, it's Regression.
>
> **Q2:** How do Multiclass and Multilabel differ? Give an example of
> each.
> > **A:** Multiclass: each sample belongs to **exactly one** of ≥ 3
> > classes (a photo is sushi, steak or pizza). Multilabel: each sample
> > can carry **several labels at once** (an article tagged both "Machine
> > learning" and "Artificial intelligence").
>
> **Q3:** The Diabetes `Outcome` column contains 0s and 1s. Regression or
> Classification? Why?
> > **A:** Binary Classification. 0 and 1 are just codes for two classes
> > (no diabetes / diabetes); no value lies in between and "greater than"
> > carries no quantitative meaning.
>
> **Q4:** Why must the problem type be identified **before** choosing an
> evaluation metric?
> > **A:** Metrics depend on the problem type. Classification measures
> > whether the **label is right or wrong** (Confusion Matrix, Accuracy,
> > Precision, Recall, F1, ROC/AUC); Regression measures **how far off**
> > a number is (MAE, RMSE). Mixing them up — e.g. computing Accuracy on
> > house prices — is meaningless.
>
> **Q5:** "Will it rain tomorrow?" vs "how much will it rain tomorrow?" —
> which type is each, and what's the lesson?
> > **A:** The first is Binary Classification, the second is Regression.
> > The same real-world need can be framed as different problem types
> > depending on the question, so choosing the type is a design decision.
