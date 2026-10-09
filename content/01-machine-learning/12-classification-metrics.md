---
title: Accuracy, Precision, Recall và F1-score
order: 12
description: Bốn metric phân loại cơ bản tính từ Confusion Matrix — mỗi cái trả lời một câu hỏi khác nhau — cùng cái bẫy Accuracy với dữ liệu mất cân bằng và cách chọn metric theo bối cảnh thực tế.
---

## 1. Ý tưởng

Confusion Matrix (bài 11) cho ta 4 con số TP, FP, FN, TN. Nhưng 4 con số
thì khó so sánh hai model với nhau. Ta cần **gói chúng lại thành một tỉ
lệ** — và tùy cách gói, tỉ lệ đó trả lời **một câu hỏi khác nhau**:

| Metric | Câu hỏi nó trả lời |
|---|---|
| **Accuracy** | Trong *tất cả* các lần đoán, đúng bao nhiêu phần? |
| **Precision** | Khi model *nói là +*, nó đúng bao nhiêu phần? |
| **Recall** | Trong *những mẫu thật sự là +*, model bắt được bao nhiêu phần? |
| **F1-score** | Precision và Recall có *cùng cao* không? |

Ý quan trọng nhất của bài: **không có metric nào "tốt nhất" cho mọi bài
toán**. Chọn metric = chọn câu hỏi mình quan tâm, và câu hỏi đó phụ thuộc
vào **cái giá của từng loại sai** (FP hay FN đắt hơn).

> **EN:** The Confusion Matrix gives us four numbers, which are hard to
> compare across models. So we **condense them into ratios** — and each
> ratio answers **a different question**: **Accuracy** — of all
> predictions, what fraction was right? **Precision** — when the model
> *says +*, how often is it right? **Recall** — of all *actual +* cases,
> how many did the model catch? **F1-score** — are Precision and Recall
> *both* high? The key lesson: **no metric is best for every problem**.
> Choosing a metric means choosing the question you care about, which
> depends on **the cost of each kind of error**.

## 2. Vị trí trong pipeline

```
model → prediction ┐
                   ├→ Confusion Matrix (TP, FP, FN, TN)  ← bài 11
label ─────────────┘            │
                                ▼
          Accuracy · Precision · Recall · F1             ← bài này
                                │
                                ▼
          dùng để: so sánh model, chọn hyperparameter (trên Validation),
                   báo cáo kết quả cuối (trên Test)       ← bài 07–09
```

Trong slide, đây là phần **slide 33–36**: bảng metric được xây dần từng
dòng, mỗi dòng tính luôn trên ví dụ dog/cat của bài 11 (TP = 3, FP = 1,
FN = 2, TN = 1, All = 7).

Khi dùng K-fold (bài 08), ta tính metric trên **từng fold** rồi lấy trung
bình — giống như đã làm với loss.

> **EN:** These metrics sit right after the Confusion Matrix. They're used
> to compare models, tune hyperparameters on the Validation set, and
> report final results on the Test set. In the slides this is slides
> 33–36, where the metric table is built row by row on the dog/cat
> example (TP = 3, FP = 1, FN = 2, TN = 1, All = 7). With K-fold, the
> metric is computed on **each fold** and then averaged.

## 3. Công thức / cách hoạt động

### 3.1. Bảng tổng hợp theo slide

| Metric | Công thức | Ý nghĩa (theo slide) |
|---|---|---|
| Accuracy | (TP + TN) / All | Độ chính xác tổng quát |
| Precision | TP / (TP + FP) | Độ chính xác đối với class + |
| Recall | TP / (TP + FN) | Độ bao phủ đối với class + |
| F1-score | 2 · Pre · Re / (Pre + Re) | Trung bình điều hòa giữa Precision và Recall |

Mẹo nhớ cả bảng: **tử số của Precision, Recall và F1 đều xoay quanh TP**,
chỉ khác ở **mẫu số** — tức là "so với cái gì".

> **EN:** Summary from the slides: Accuracy = (TP + TN) / All (overall
> correctness); Precision = TP / (TP + FP) (correctness on the positive
> class); Recall = TP / (TP + FN) (coverage of the positive class); F1 =
> 2·P·R / (P + R) (harmonic mean of Precision and Recall). Precision and
> Recall share TP in the numerator — they differ only in the denominator,
> i.e. "out of what".

### 3.2. Accuracy — độ chính xác tổng quát

```
Accuracy = (TP + TN) / (TP + FP + FN + TN)
```

Tử số là **hai ô đường chéo** (đoán đúng), mẫu số là **tất cả**. Accuracy
đối xử với mọi loại sai **như nhau** và không quan tâm class nào là +.
Đây vừa là điểm mạnh (dễ hiểu) vừa là điểm yếu chí mạng (xem 3.6).

> **EN:** The numerator is the main diagonal (correct predictions); the
> denominator is everything. Accuracy treats every error the same and
> doesn't care which class is positive — easy to understand, but a fatal
> weakness on imbalanced data (see 3.6).

### 3.3. Precision — "nói + thì đáng tin đến đâu?"

```
Precision = TP / (TP + FP)        mẫu số = số lần model ĐOÁN +  (cột trái)
```

Precision chỉ nhìn **cột "Predicted +"**: trong những lần model hô "đây là
+", bao nhiêu lần đúng. Precision thấp nghĩa là model **báo động giả
nhiều** (FP lớn).

Precision quan trọng khi **FP đắt**. Ví dụ bộ lọc spam: nếu một email công
việc quan trọng bị đẩy vào thư rác (FP) thì thiệt hại lớn hơn việc lọt
một email quảng cáo vào hộp thư (FN).

> **EN:** Precision only looks at the **"Predicted +" column**: of all the
> times the model shouted "positive", how many were right? Low precision
> means **many false alarms** (large FP). Precision matters when **FP is
> costly** — e.g. a spam filter: sending an important work email to spam
> (FP) hurts more than letting an ad through (FN).

### 3.4. Recall — "bắt được bao nhiêu trong số thật sự là +?"

```
Recall = TP / (TP + FN)           mẫu số = số mẫu THẬT SỰ là +  (hàng trên)
```

Recall chỉ nhìn **hàng "Actual +"**: trong những mẫu thật sự là +, model
bắt được bao nhiêu. Recall thấp nghĩa là model **bỏ sót nhiều** (FN lớn).
Recall còn có tên **Sensitivity** hoặc **True Positive Rate (TPR)** — tên
TPR sẽ gặp lại ở bài 13 (ROC).

Lưu ý về cách diễn đạt trong slide: slide ghi Recall là "độ bao phủ đối
với các dự đoán về class +". Đọc kỹ công thức thì mẫu số TP + FN là **số
mẫu thật sự thuộc class +** (dù model đoán gì), không phải số *dự đoán*
class +. Nên hiểu Recall là **độ bao phủ trên các mẫu thật sự thuộc
class +**. Đây là nhận xét của Claude về cách diễn đạt; công thức trong
slide là đúng.

Recall quan trọng khi **FN đắt**. Ví dụ sàng lọc ung thư: bỏ sót một
người bệnh (FN) có thể trả giá bằng tính mạng, còn báo nhầm (FP) chỉ dẫn
tới xét nghiệm thêm.

> **EN:** Recall only looks at the **"Actual +" row**: of all truly
> positive samples, how many did the model catch? Low recall means **many
> misses** (large FN). Also called **Sensitivity** or **True Positive Rate
> (TPR)**. Note on the slide's wording: it describes Recall as "coverage
> of predictions about class +", but the denominator TP + FN is the number
> of **actual** positive samples, regardless of what was predicted — so
> Recall is better read as coverage of the truly positive samples (this
> is Claude's note on wording; the slide's formula is correct). Recall
> matters when **FN is costly** — e.g. cancer screening.

### 3.5. F1-score — trung bình điều hòa

```
F1 = 2 · Precision · Recall / (Precision + Recall)
```

**Vì sao không lấy trung bình cộng (P + R) / 2?** Vì có một cách "ăn
gian" rất dễ: cho model **luôn đoán +**. Khi đó FN = 0 nên Recall = 1.0,
dù Precision có thể rất thấp.

Ví dụ: Precision = 1.0, Recall = 0.02 (model chỉ dám đoán + đúng 1 lần
và bỏ sót gần hết):

- Trung bình cộng: (1.0 + 0.02) / 2 = **0.51** → trông "tạm ổn"
- Trung bình điều hòa: 2 · 1.0 · 0.02 / 1.02 ≈ **0.039** → lộ ra model tệ

Trung bình điều hòa **bị kéo mạnh về phía giá trị nhỏ hơn**, nên F1 chỉ
cao khi **cả hai** cùng cao. Đó chính là ý nghĩa của F1.

> **EN:** **Why not the arithmetic mean?** Because it's easy to game:
> always predict + and Recall hits 1.0. With Precision = 1.0 and Recall =
> 0.02, the arithmetic mean is 0.51 (looks okay) while the harmonic mean
> is ≈ 0.039 (exposes a bad model). The harmonic mean is **pulled toward
> the smaller value**, so F1 is high only when **both** are high.

### 3.6. Bẫy Accuracy với dữ liệu mất cân bằng *(Bổ sung — không có trong slide)*

Nhớ lại ví dụ Cat 90 / Dog 10 ở bài 09. Một model "lười" **luôn đoán
Cat** sẽ có Accuracy = 90% mà không học được gì. Hiện tượng này gọi là
**accuracy paradox**.

Ví dụ thực tế hơn — phát hiện giao dịch gian lận: 1000 giao dịch, chỉ 10
gian lận (class + = gian lận).

| | Model A: luôn đoán "bình thường" | Model B |
|---|---|---|
| TP / FN | 0 / 10 | 8 / 2 |
| FP / TN | 0 / 990 | 40 / 950 |
| **Accuracy** | **0.990** | 0.958 |
| Precision | không xác định (0/0) | 8/48 ≈ 0.167 |
| **Recall** | **0.000** | 0.800 |
| F1 | 0.000 | ≈ 0.276 |

Nhìn Accuracy thì A thắng. Nhưng A **không bắt được giao dịch gian lận
nào** — vô dụng hoàn toàn. B bắt được 8/10 vụ, đổi lại phải kiểm tra thủ
công 48 giao dịch bị đánh dấu. Với ngân hàng, B tốt hơn A rất nhiều.

Quy tắc rút ra: **khi các class mất cân bằng, đừng chỉ nhìn Accuracy** —
luôn xem Precision, Recall, F1 của class thiểu số (thường là class ta quan
tâm). Đây cũng là lý do bài 09 cần Stratified K-fold: để mỗi fold có đủ
mẫu class thiểu số mà tính được những metric này.

> **EN:** *(Supplementary)* Recall the 90 Cat / 10 Dog example: a lazy
> model that always predicts Cat scores 90% accuracy while learning
> nothing — the **accuracy paradox**. Fraud example: 1000 transactions, 10
> fraudulent. Model A (always "normal") has 99.0% accuracy but **0
> recall**; Model B has 95.8% accuracy but catches 8 of 10 frauds (recall
> 0.8, precision ≈ 0.167, F1 ≈ 0.276). By accuracy A "wins", yet it's
> useless. Rule: **with imbalanced classes, never rely on Accuracy alone**
> — check Precision, Recall and F1 on the minority class.

### 3.7. Đánh đổi giữa Precision và Recall *(Bổ sung)*

Phần lớn model phân loại không trả về thẳng "dog" hay "cat" mà trả về một
**điểm / xác suất** (ví dụ 0.73 là dog), rồi so với một **ngưỡng
(threshold)**, thường là 0.5:

- **Hạ ngưỡng** (dễ dãi hơn khi nói +) → bắt được nhiều + hơn → Recall
  **tăng**, nhưng cũng báo nhầm nhiều hơn → Precision **thường giảm**.
- **Tăng ngưỡng** (khắt khe hơn) → chỉ nói + khi rất chắc → Precision
  **thường tăng**, Recall **giảm**.

Không thể kéo cả hai lên cùng lúc chỉ bằng cách chỉnh ngưỡng; muốn cả hai
cùng cao thì phải có **model tốt hơn**. Bài 13 sẽ vẽ toàn bộ sự đánh đổi
này thành đường cong (ROC).

> **EN:** *(Supplementary)* Most classifiers output a **score /
> probability**, compared against a **threshold** (usually 0.5). Lowering
> the threshold catches more positives (Recall up) but raises more false
> alarms (Precision usually down); raising it does the opposite. Tuning
> the threshold alone can't raise both — that requires a better model.
> Lesson 13 draws this whole trade-off as a curve (ROC).

### 3.8. Specificity và F-beta *(Bổ sung)*

**Specificity (True Negative Rate)** — "Recall của class −":

```
Specificity = TN / (TN + FP)
```

Trong y tế, Sensitivity (= Recall) và Specificity luôn đi thành cặp: một
xét nghiệm tốt phải vừa bắt được người bệnh (Sensitivity cao) vừa không
báo nhầm người khỏe (Specificity cao).

**F-beta** — tổng quát hóa F1, cho phép ưu tiên một bên:

```
F_β = (1 + β²) · P · R / (β² · P + R)
```

- β = 1 → F1, coi trọng P và R ngang nhau.
- β = 2 → **F2**, coi trọng Recall hơn (ví dụ sàng lọc bệnh).
- β = 0.5 → **F0.5**, coi trọng Precision hơn (ví dụ lọc spam).

> **EN:** *(Supplementary)* **Specificity** (True Negative Rate) = TN /
> (TN + FP) — "recall of the negative class"; in medicine it's always
> paired with Sensitivity. **F-beta** generalises F1: β = 1 weighs P and
> R equally; β = 2 (F2) favours Recall; β = 0.5 (F0.5) favours Precision.

### 3.9. Bài toán nhiều class: macro, micro, weighted *(Bổ sung)*

Precision/Recall/F1 được định nghĩa cho **một class +**. Với nhiều class,
ta lần lượt coi **từng class là +** (các class còn lại là −), tính metric
cho từng class, rồi **gộp lại** theo một trong ba cách:

| Cách gộp | Cách tính | Khi nào dùng |
|---|---|---|
| **macro** | trung bình cộng các class, mỗi class nặng như nhau | muốn class thiểu số được coi trọng ngang class đông |
| **weighted** | trung bình có trọng số theo số mẫu thật (support) mỗi class | muốn phản ánh phân bố dữ liệu thực |
| **micro** | cộng dồn TP, FP, FN của mọi class rồi mới tính | đánh giá tổng thể; với bài 1 nhãn/mẫu, micro-F1 = Accuracy |

> **EN:** *(Supplementary)* For multiclass problems, treat **each class
> as positive in turn**, compute the metric per class, then aggregate:
> **macro** (plain average, every class weighs the same — protects
> minority classes), **weighted** (average weighted by each class's
> support), **micro** (pool all TP/FP/FN first; for single-label problems
> micro-F1 equals Accuracy).

### 3.10. Chọn metric theo bối cảnh *(Bổ sung)*

| Bài toán | Loại sai đắt hơn | Ưu tiên |
|---|---|---|
| Sàng lọc ung thư | FN — bỏ sót người bệnh | Recall / F2 |
| Lọc spam | FP — mất email quan trọng | Precision / F0.5 |
| Phát hiện gian lận thẻ | FN — mất tiền; nhưng FP quá nhiều làm phiền khách | Recall, giữ Precision ở mức chấp nhận được |
| Gợi ý 10 sản phẩm đầu trang | FP — gợi ý sai làm mất niềm tin | Precision |
| Dữ liệu cân bằng, hai loại sai ngang nhau | không bên nào đắt hơn | Accuracy vẫn ổn |

Câu hỏi luôn phải tự đặt ra trước khi chọn metric: ***"Với bài này, FP
hay FN tốn kém hơn?"***

> **EN:** *(Supplementary)* Cancer screening → Recall / F2 (missing a
> patient is costly). Spam filtering → Precision / F0.5 (losing an
> important email is costly). Card fraud → Recall, while keeping
> Precision acceptable. Top-10 recommendations → Precision. Balanced data
> with equal error costs → Accuracy is fine. Always ask first: ***"Is FP
> or FN more costly here?"***

## 4. Ví dụ tay

### 4.1. Ví dụ của slide (dog là +)

TP = 3, FP = 1, FN = 2, TN = 1, All = 7.

| Metric | Thay số | Kết quả |
|---|---|---|
| Accuracy | (3 + 1) / 7 | 4/7 ≈ **0.5714** |
| Precision | 3 / (3 + 1) | 3/4 = **0.75** |
| Recall | 3 / (3 + 2) | 3/5 = **0.60** |
| F1 | 2 · 0.75 · 0.6 / (0.75 + 0.6) = 0.9 / 1.35 | ≈ **0.6667** |

Diễn giải bằng lời:

- **Accuracy 0.57**: đúng 4 trên 7 ảnh.
- **Precision 0.75**: cứ 4 lần model nói "chó" thì đúng 3 (một lần nói
  nhầm mèo thành chó).
- **Recall 0.60**: có 5 con chó thật, model nhận ra được 3 (bỏ sót 2).
- **F1 0.67**: nằm giữa 0.6 và 0.75, gần phía nhỏ (0.6) hơn — đúng tính
  chất trung bình điều hòa. Trung bình cộng sẽ là 0.675.

> **EN:** Slide example (dog = +): Accuracy = 4/7 ≈ 0.5714; Precision =
> 3/4 = 0.75 (of 4 "dog" calls, 3 were right); Recall = 3/5 = 0.60 (of 5
> real dogs, 3 were found); F1 = 0.9/1.35 ≈ 0.6667 — between 0.6 and 0.75,
> closer to the smaller value, as a harmonic mean should be.

### 4.2. Tính thêm các metric mở rộng *(Bổ sung)*

- **Specificity** = TN / (TN + FP) = 1 / (1 + 1) = **0.50** → trong 2 con
  mèo thật, chỉ nhận ra đúng 1.
- **F2** = 5 · 0.75 · 0.6 / (4 · 0.75 + 0.6) = 2.25 / 3.6 = **0.625** →
  thấp hơn F1 vì F2 coi trọng Recall, mà Recall (0.6) là điểm yếu.
- **F0.5** = 1.25 · 0.75 · 0.6 / (0.25 · 0.75 + 0.6) = 0.5625 / 0.7875 ≈
  **0.714** → cao hơn F1 vì nghiêng về Precision (0.75).

### 4.3. Coi `cat` là + và tính macro / weighted *(Bổ sung)*

Từ bài 11, khi cat là +: TP = 1, FP = 2, FN = 1, TN = 3.

- Precision(cat) = 1 / (1 + 2) ≈ **0.333**
- Recall(cat) = 1 / (1 + 1) = **0.5**
- F1(cat) = 2 · 0.333 · 0.5 / 0.833 = **0.4**

Gộp hai class (support: dog = 5, cat = 2):

| Cách gộp | F1 |
|---|---|
| macro | (0.6667 + 0.4) / 2 ≈ **0.5333** |
| weighted | (5 · 0.6667 + 2 · 0.4) / 7 ≈ **0.5905** |
| micro | = Accuracy ≈ **0.5714** |

Model nhận diện mèo kém hơn hẳn nhận diện chó. Macro-F1 (0.53) phản ánh
điểm yếu này rõ hơn weighted-F1 (0.59), vì weighted bị class đông (dog)
kéo lên.

> **EN:** *(Supplementary)* Specificity = 1/2 = 0.50; F2 = 0.625 (below
> F1, because Recall is the weak side); F0.5 ≈ 0.714. With cat as
> positive: Precision ≈ 0.333, Recall = 0.5, F1 = 0.4. Aggregated F1:
> macro ≈ 0.5333, weighted ≈ 0.5905, micro = Accuracy ≈ 0.5714. Macro
> exposes the weak cat class more clearly than weighted, which is pulled
> up by the majority class.

## 5. Code

### 5.1. Tự cài đặt từ đầu

```python
def classification_metrics(tp, fp, fn, tn):
    all_ = tp + fp + fn + tn
    accuracy  = (tp + tn) / all_
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0   # tránh chia cho 0
    recall    = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall / (precision + recall)
          if (precision + recall) > 0 else 0.0)
    return {"accuracy": accuracy, "precision": precision,
            "recall": recall, "f1": f1}

print(classification_metrics(tp=3, fp=1, fn=2, tn=1))
# {'accuracy': 0.571..., 'precision': 0.75, 'recall': 0.6, 'f1': 0.666...}

# Bẫy accuracy: model luôn đoán "bình thường" trên 1000 giao dịch, 10 gian lận
print(classification_metrics(tp=0, fp=0, fn=10, tn=990))
# {'accuracy': 0.99, 'precision': 0.0, 'recall': 0.0, 'f1': 0.0}
```

### 5.2. Đối chiếu bằng scikit-learn

```python
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, fbeta_score, classification_report)

pred  = ["dog", "cat", "dog", "dog", "cat", "cat", "dog"]
label = ["dog", "dog", "cat", "dog", "cat", "dog", "dog"]

print(accuracy_score(label, pred))                      # 0.5714
print(precision_score(label, pred, pos_label="dog"))    # 0.75
print(recall_score(label, pred, pos_label="dog"))       # 0.6
print(f1_score(label, pred, pos_label="dog"))           # 0.6667
print(fbeta_score(label, pred, beta=2, pos_label="dog"))  # 0.625

# Báo cáo đầy đủ cho mọi class + macro/weighted
print(classification_report(label, pred, digits=4))
#               precision    recall  f1-score   support
#          cat     0.3333    0.5000    0.4000         2
#          dog     0.7500    0.6000    0.6667         5
#     accuracy                         0.5714         7
#    macro avg     0.5417    0.5500    0.5333         7
# weighted avg     0.6310    0.5714    0.5905         7
```

Chú ý tham số `pos_label`: nếu label là chuỗi, phải chỉ rõ class + là gì,
nếu không scikit-learn sẽ báo lỗi. Với label 0/1, mặc định `pos_label=1`.

> **EN:** Implement the metrics from scratch (guarding against division by
> zero), then verify with scikit-learn. With string labels you must pass
> `pos_label`; with 0/1 labels it defaults to 1. `classification_report`
> prints per-class metrics plus macro and weighted averages.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Precision và Recall có cùng tử số TP. Khác nhau ở đâu, và mỗi
cái nhìn vào phần nào của Confusion Matrix?
> **Đáp án:** Khác ở mẫu số. Precision chia cho TP + FP = số lần model
> **đoán +** (cột Predicted +). Recall chia cho TP + FN = số mẫu **thật
> sự là +** (hàng Actual +). Precision hỏi "nói + thì đúng bao nhiêu";
> Recall hỏi "có + thì bắt được bao nhiêu".

**Câu 2:** Một model sàng lọc bệnh có Accuracy = 98% trên dữ liệu có 2%
người bệnh. Đã nên tin model này chưa? Cần xem thêm gì?
> **Đáp án:** Chưa. Một model luôn đoán "không bệnh" cũng đạt đúng 98%.
> Phải xem **Recall của class "có bệnh"** (bắt được bao nhiêu người bệnh)
> và Precision, F1 của class đó. Nếu Recall gần 0 thì model vô dụng dù
> Accuracy cao.

**Câu 3:** Vì sao F1 dùng trung bình điều hòa thay vì trung bình cộng?
Minh họa bằng số.
> **Đáp án:** Vì trung bình điều hòa bị kéo về giá trị nhỏ hơn, nên F1
> chỉ cao khi cả P và R đều cao. Với P = 1.0, R = 0.02: trung bình cộng =
> 0.51 (trông ổn), F1 ≈ 0.039 (lộ ra model bỏ sót gần hết).

**Câu 4:** Với ví dụ slide (TP = 3, FP = 1, FN = 2, TN = 1), nếu model sửa
được đúng mẫu 2 (chó bị đoán nhầm là mèo) thành đoán đúng "dog", các
metric thay đổi thế nào?
> **Đáp án:** Mẫu 2 chuyển từ FN sang TP: TP = 4, FP = 1, FN = 1, TN = 1.
> Accuracy = 5/7 ≈ 0.714; Precision = 4/5 = 0.8; Recall = 4/5 = 0.8;
> F1 = 0.8. Cả bốn metric đều tăng, và Recall tăng nhiều nhất (0.6 → 0.8)
> vì ta vừa giảm FN.

**Câu 5:** Lọc spam nên ưu tiên Precision hay Recall? Sàng lọc ung thư thì
sao? (class + = spam / có bệnh)
> **Đáp án:** Lọc spam ưu tiên **Precision**: FP (email quan trọng bị
> đưa vào spam) đắt hơn FN (lọt quảng cáo). Sàng lọc ung thư ưu tiên
> **Recall**: FN (bỏ sót người bệnh) đắt hơn FP (xét nghiệm thêm).

**Câu 6:** Hạ threshold từ 0.5 xuống 0.2 thì Recall và Precision thường
thay đổi ra sao? Vì sao?
> **Đáp án:** Recall **tăng** (hoặc giữ nguyên) vì model nói + dễ dãi
> hơn, bắt được nhiều + thật hơn (FN giảm). Precision **thường giảm** vì
> nhiều mẫu − cũng bị kéo vào nhóm + (FP tăng). Recall không bao giờ giảm
> khi hạ ngưỡng; Precision thì không chắc chắn giảm, chỉ là thường giảm.

> **EN:**
>
> **Q1:** Precision and Recall share the numerator TP. How do they differ,
> and which part of the matrix does each use?
> > **A:** The denominator. Precision divides by TP + FP = predicted
> > positives (the Predicted + column); Recall divides by TP + FN = actual
> > positives (the Actual + row).
>
> **Q2:** A screening model has 98% accuracy on data with 2% sick
> patients. Trust it yet? What else must you check?
> > **A:** No — always predicting "healthy" also scores 98%. Check
> > **Recall on the "sick" class**, plus its Precision and F1.
>
> **Q3:** Why does F1 use the harmonic mean? Show with numbers.
> > **A:** It's pulled toward the smaller value, so F1 is high only if
> > both P and R are high. P = 1.0, R = 0.02: arithmetic mean 0.51,
> > F1 ≈ 0.039.
>
> **Q4:** In the slide example, if the model fixes sample 2 (a dog
> predicted as cat), how do the metrics change?
> > **A:** FN → TP: TP = 4, FP = 1, FN = 1, TN = 1. Accuracy ≈ 0.714,
> > Precision = 0.8, Recall = 0.8, F1 = 0.8. Recall improves most
> > (0.6 → 0.8) because FN dropped.
>
> **Q5:** Spam filtering: Precision or Recall? Cancer screening?
> > **A:** Spam → **Precision** (a lost important email is worse).
> > Cancer screening → **Recall** (a missed patient is worse).
>
> **Q6:** Lowering the threshold from 0.5 to 0.2 — what usually happens to
> Recall and Precision?
> > **A:** Recall rises (or stays the same) because more true positives
> > are caught; Precision usually falls because more negatives are pulled
> > in as false positives. Recall never drops when the threshold is
> > lowered; Precision usually, but not always, does.
