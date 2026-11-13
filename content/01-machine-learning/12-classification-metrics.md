---
title: Accuracy, Precision, Recall và F1-score
order: 12
description: Bốn metric phân loại tính từ Confusion Matrix — mỗi cái trả lời một câu hỏi khác nhau — cùng bẫy Accuracy với dữ liệu mất cân bằng và cách chọn metric theo cái giá của từng loại sai.
slides: 33-36
needs: [confusion-matrix]
tags: [accuracy, precision, recall, f1, threshold, imbalanced, metric]
---

## Từ 4 con số đến 1 câu hỏi

:::intro Đọc xong bài này bạn làm được
- Viết và giải thích 4 metric (Accuracy, Precision, Recall, F1) từ TP/FP/FN/TN, **kể cả không nhìn công thức**.
- Chỉ ra mỗi metric nhìn vào phần nào của Confusion Matrix và trả lời câu hỏi gì.
- Giải thích vì sao Accuracy 99% vẫn có thể là model vô dụng.
- Chọn metric theo bối cảnh: "FP hay FN đắt hơn?", và biện luận được trong buổi phỏng vấn.
:::

[[bài:confusion-matrix]] cho ta 4 con số TP, FP, FN, TN. Bốn con số thì khó so sánh hai model.
Ta cần **gói chúng lại thành một tỉ lệ** — và tùy cách gói, tỉ lệ đó trả lời **một câu hỏi khác nhau**:

| Metric | Câu hỏi nó trả lời |
|---|---|
| **Accuracy** | Trong *tất cả* các lần đoán, đúng bao nhiêu phần? |
| **Precision** | Khi model *nói là +*, nó đúng bao nhiêu phần? |
| **Recall** | Trong *những mẫu thật sự là +*, model bắt được bao nhiêu phần? |
| **F1-score** | Precision và Recall có *cùng cao* không? |

Ý quan trọng nhất của bài: **không có metric nào "tốt nhất" cho mọi bài toán**. Chọn metric = chọn câu hỏi mình quan tâm,
và câu hỏi đó phụ thuộc vào **cái giá của từng loại sai** (FP hay FN đắt hơn).

> **EN:** The Confusion Matrix gives four numbers that are hard to compare across models, so we condense them
> into ratios — each answering a different question. **No metric is best for every problem**: choosing one means
> choosing the question you care about, which depends on the **cost of each kind of error**.

### Slide gốc

Slide 33–36 xây bảng metric từng dòng, mỗi dòng tính ngay trên ví dụ dog/cat của bài 11
(TP = 3, FP = 1, FN = 2, TN = 1, All = 7). Mở slide song song với bài này để đối chiếu.

:::slides 33-36 | Bảng metric xây dần: Accuracy → Precision → Recall → F1
:::

## Bảng tổng hợp và mẹo nhớ

| Metric | Công thức | Ý nghĩa (theo slide) |
|---|---|---|
| Accuracy | (TP + TN) / All | Độ chính xác tổng quát |
| Precision | TP / (TP + FP) | Độ chính xác đối với class + |
| Recall | TP / (TP + FN) | Độ bao phủ đối với class + |
| F1-score | 2 · Pre · Re / (Pre + Re) | Trung bình điều hòa giữa Precision và Recall |

Mẹo nhớ: **tử số của Precision, Recall và F1 đều xoay quanh TP**, chỉ khác ở **mẫu số** — tức là "so với cái gì".

```
                    Predicted +      Predicted −
   Actual +   [      TP        ]   [      FN        ]   ← Recall nhìn HÀNG này:  TP / (TP+FN)
   Actual −   [      FP        ]   [      TN        ]
                     ↑
        Precision nhìn CỘT này: TP / (TP+FP)
```

Khi dùng K-fold ([[bài:k-fold-cross-validation]]), metric được tính trên **từng fold** rồi lấy trung bình — giống như đã làm với loss.

> **EN:** Precision and Recall share TP in the numerator and differ only in the denominator: Precision divides by the
> *Predicted +* column, Recall by the *Actual +* row. With K-fold, compute the metric per fold and average.

## Accuracy — độ chính xác tổng quát

```
Accuracy = (TP + TN) / (TP + FP + FN + TN)
```

Tử số là **hai ô đường chéo** (đoán đúng), mẫu số là **tất cả**. Accuracy đối xử với mọi loại sai **như nhau**
và không quan tâm class nào là +. Đây vừa là điểm mạnh (dễ hiểu) vừa là điểm yếu chí mạng (xem mục "Bẫy Accuracy" bên dưới).

> **EN:** The numerator is the main diagonal; the denominator is everything. Accuracy treats every error the same
> — easy to understand, but fatal on imbalanced data.

## Precision — "nói + thì đáng tin đến đâu?"

```
Precision = TP / (TP + FP)        mẫu số = số lần model ĐOÁN +  (cột trái)
```

Precision chỉ nhìn **cột "Predicted +"**: trong những lần model hô "đây là +", bao nhiêu lần đúng.
Precision thấp nghĩa là model **báo động giả nhiều** (FP lớn). Precision quan trọng khi **FP đắt** —
ví dụ bộ lọc spam: đẩy một email công việc vào thư rác (FP) tệ hơn để lọt một email quảng cáo (FN).

> **EN:** Precision looks only at the "Predicted +" column. Low precision means many false alarms; it matters when
> FP is costly — e.g. a spam filter.

## Recall — "bắt được bao nhiêu trong số thật sự là +?"

```
Recall = TP / (TP + FN)           mẫu số = số mẫu THẬT SỰ là +  (hàng trên)
```

Recall chỉ nhìn **hàng "Actual +"**: trong những mẫu thật sự là +, model bắt được bao nhiêu. Recall thấp nghĩa là model
**bỏ sót nhiều** (FN lớn). Recall còn có tên **Sensitivity** hoặc **True Positive Rate (TPR)** — tên TPR sẽ gặp lại ở
[[bài:roc-auc]]. Recall quan trọng khi **FN đắt** — ví dụ sàng lọc ung thư: bỏ sót người bệnh có thể trả giá bằng tính mạng,
còn báo nhầm chỉ dẫn tới xét nghiệm thêm.

:::note Lưu ý về cách diễn đạt trong slide
Slide ghi Recall là "độ bao phủ đối với các dự đoán về class +". Đọc kỹ công thức thì mẫu số TP + FN là **số mẫu thật sự
thuộc class +** (dù model đoán gì), không phải số *dự đoán* class +. Nên hiểu Recall là độ bao phủ trên các **mẫu thật sự**
thuộc class +. Công thức trong slide đúng; chỉ lời diễn đạt hơi lệch.
:::

> **EN:** Recall looks only at the "Actual +" row; low recall means many misses (large FN). Also called Sensitivity or TPR.
> It matters when FN is costly — e.g. cancer screening.

## F1-score — trung bình điều hòa

```
F1 = 2 · Precision · Recall / (Precision + Recall)
```

**Vì sao không lấy trung bình cộng (P + R) / 2?** Vì có cách "ăn gian" rất dễ: cho model **luôn đoán +**.
Khi đó FN = 0 nên Recall = 1.0 dù Precision có thể rất thấp.

Ví dụ: Precision = 1.0, Recall = 0.02 (model chỉ dám đoán + đúng 1 lần, bỏ sót gần hết):

- Trung bình cộng: (1.0 + 0.02) / 2 = **0.51** → trông "tạm ổn"
- Trung bình điều hòa: 2 · 1.0 · 0.02 / 1.02 ≈ **0.039** → lộ ra model tệ

Trung bình điều hòa **bị kéo mạnh về phía giá trị nhỏ hơn**, nên F1 chỉ cao khi **cả hai** cùng cao.

> **EN:** The harmonic mean is pulled toward the smaller value, so F1 is high only when both P and R are high. With
> P = 1.0 and R = 0.02 the arithmetic mean is 0.51 but F1 ≈ 0.039.

## Bẫy Accuracy với dữ liệu mất cân bằng

:::pitfall Accuracy paradox (bổ sung — không có trong slide)
Nhớ ví dụ Cat 90 / Dog 10 ở [[bài:stratified-k-fold]]: model "lười" **luôn đoán Cat** đạt Accuracy 90% mà không học được gì.

Ví dụ thực tế — phát hiện gian lận: 1000 giao dịch, chỉ 10 gian lận (class + = gian lận).

| | Model A: luôn đoán "bình thường" | Model B |
|---|---|---|
| TP / FN | 0 / 10 | 8 / 2 |
| FP / TN | 0 / 990 | 40 / 950 |
| **Accuracy** | **0.990** | 0.958 |
| Precision | không xác định (0/0) | 8/48 ≈ 0.167 |
| **Recall** | **0.000** | 0.800 |
| F1 | 0.000 | ≈ 0.276 |

Nhìn Accuracy thì A thắng, nhưng A **không bắt được vụ gian lận nào**. B bắt 8/10 vụ, đổi lại phải kiểm tra thủ công 48 giao dịch.
Quy tắc: **khi các class mất cân bằng, đừng chỉ nhìn Accuracy** — xem Precision, Recall, F1 của class thiểu số.
Đây cũng là lý do cần Stratified K-fold, và là mở đầu cho bài [[bài:imbalanced-data]].
:::

> **EN:** A model that always predicts the majority class scores 99% accuracy on a 1%-fraud set with 0 recall. With
> imbalanced classes never rely on accuracy alone — check precision, recall and F1 on the minority class.

## Đánh đổi Precision – Recall và ngưỡng (threshold)

Phần lớn model không trả thẳng "dog" hay "cat" mà trả về một **điểm / xác suất** (vd 0.73 là dog), rồi so với một **ngưỡng**, thường là 0.5:

- **Hạ ngưỡng** (dễ dãi hơn khi nói +) → Recall **tăng hoặc giữ**, FP tăng hoặc giữ → Precision **thường giảm**.
- **Tăng ngưỡng** (khắt khe hơn) → Precision **thường tăng**, Recall **giảm hoặc giữ**.

Precision không bảo đảm đơn điệu: nếu các điểm vừa thêm đều là dương thật, cả precision và recall có thể tăng. Đổi ngưỡng không cải thiện xếp hạng của model; xem bảng ba ngưỡng trong [[bài:logistic-regression]] để đếm cụ thể TP/FP/FN/TN.
[[bài:roc-auc]] sẽ vẽ toàn bộ sự đánh đổi này thành một đường cong.

> **EN:** Lowering the threshold cannot reduce recall for fixed scores, while precision need not be monotonic. Both may improve at some operating points, but threshold tuning does not improve the score ranking.

## Specificity, F-beta và bài toán nhiều class

### Specificity (True Negative Rate) — "Recall của class −"

```
Specificity = TN / (TN + FP)
```

Trong y tế, Sensitivity (= Recall) và Specificity luôn đi thành cặp: xét nghiệm tốt phải vừa bắt được người bệnh vừa không báo nhầm người khỏe.

### F-beta — F1 có thiên vị

```
F_β = (1 + β²) · P · R / (β² · P + R)
```

- β = 1 → F1, coi trọng P và R ngang nhau.
- β = 2 → **F2**, coi trọng Recall hơn (sàng lọc bệnh).
- β = 0.5 → **F0.5**, coi trọng Precision hơn (lọc spam).

### Nhiều class: macro, weighted, micro

Precision/Recall/F1 được định nghĩa cho **một class +**. Với nhiều class ta lần lượt coi **từng class là +**, tính cho từng class, rồi gộp:

:::compare Ba cách gộp
| Cách gộp | Cách tính | Khi nào dùng |
|---|---|---|
| **macro** | trung bình cộng các class, mỗi class nặng như nhau | muốn class thiểu số được coi trọng ngang class đông |
| **weighted** | trung bình có trọng số theo số mẫu thật (support) | muốn phản ánh phân bố dữ liệu thực |
| **micro** | cộng dồn TP, FP, FN của mọi class rồi mới tính | đánh giá tổng thể; với bài 1 nhãn/mẫu, micro-F1 = Accuracy |
:::

> **EN:** Specificity = TN / (TN + FP). F-beta generalises F1 (β = 2 favours recall, β = 0.5 favours precision). For
> multiclass, treat each class as positive in turn, then aggregate with macro, weighted or micro averaging.

## Chọn metric theo bối cảnh

Câu hỏi luôn phải tự đặt ra trước khi chọn metric: ***"Với bài này, FP hay FN tốn kém hơn?"***

:::compare Bảng chọn metric
| Bài toán | Loại sai đắt hơn | Ưu tiên |
|---|---|---|
| Sàng lọc ung thư | FN — bỏ sót người bệnh | Recall / F2 |
| Lọc spam | FP — mất email quan trọng | Precision / F0.5 |
| Phát hiện gian lận thẻ | FN — mất tiền; nhưng FP quá nhiều làm phiền khách | Recall, giữ Precision ở mức chấp nhận được |
| Gợi ý 10 sản phẩm đầu trang | FP — gợi ý sai làm mất niềm tin | Precision |
| Dữ liệu cân bằng, hai loại sai ngang nhau | không bên nào đắt hơn | Accuracy vẫn ổn |
:::

## Ví dụ tay

:::worked Ví dụ slide (dog là +): TP = 3, FP = 1, FN = 2, TN = 1, All = 7
| Metric | Thay số | Kết quả |
|---|---|---|
| Accuracy | (3 + 1) / 7 | 4/7 ≈ **0.5714** |
| Precision | 3 / (3 + 1) | 3/4 = **0.75** |
| Recall | 3 / (3 + 2) | 3/5 = **0.60** |
| F1 | 2 · 0.75 · 0.6 / (0.75 + 0.6) = 0.9 / 1.35 | ≈ **0.6667** |

- **Accuracy 0.57**: đúng 4 trên 7 ảnh.
- **Precision 0.75**: cứ 4 lần model nói "chó" thì đúng 3.
- **Recall 0.60**: có 5 con chó thật, nhận ra 3 (bỏ sót 2).
- **F1 0.67**: nằm giữa 0.6 và 0.75, gần phía nhỏ hơn — đúng tính chất trung bình điều hòa (trung bình cộng sẽ là 0.675).
:::

:::worked Metric mở rộng trên cùng ví dụ
- **Specificity** = 1 / (1 + 1) = **0.50** — trong 2 con mèo thật chỉ nhận đúng 1.
- **F2** = 5 · 0.75 · 0.6 / (4 · 0.75 + 0.6) = 2.25 / 3.6 = **0.625** — thấp hơn F1 vì F2 coi trọng Recall mà Recall (0.6) là điểm yếu.
- **F0.5** = 1.25 · 0.75 · 0.6 / (0.25 · 0.75 + 0.6) = 0.5625 / 0.7875 ≈ **0.714** — cao hơn F1 vì nghiêng về Precision.
:::

:::worked Coi `cat` là +, rồi gộp macro / weighted / micro
Khi cat là +: TP = 1, FP = 2, FN = 1, TN = 3 → Precision(cat) = 1/3 ≈ 0.333, Recall(cat) = 0.5, F1(cat) = 0.4.

Gộp hai class (support: dog = 5, cat = 2):

| Cách gộp | F1 |
|---|---|
| macro | (0.6667 + 0.4) / 2 ≈ **0.5333** |
| weighted | (5 · 0.6667 + 2 · 0.4) / 7 ≈ **0.5905** |
| micro | = Accuracy ≈ **0.5714** |

Model nhận diện mèo kém hơn hẳn chó. Macro-F1 (0.53) lộ điểm yếu này rõ hơn weighted-F1 (0.59), vì weighted bị class đông kéo lên.
:::

## Code

### Tự cài đặt từ đầu

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

### Đối chiếu bằng scikit-learn

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

Chú ý `pos_label`: nếu label là chuỗi, phải chỉ rõ class + là gì, nếu không scikit-learn báo lỗi. Với label 0/1, mặc định `pos_label=1`.

## Tóm tắt 1 phút

:::recap
- **Accuracy** = đúng / tất cả — dễ hiểu nhưng bị lừa khi dữ liệu mất cân bằng.
- **Precision** = TP / (TP+FP): "nói + thì đúng bao nhiêu" → quan tâm khi **FP đắt**.
- **Recall** = TP / (TP+FN): "có + thì bắt được bao nhiêu" → quan tâm khi **FN đắt**.
- **F1** = trung bình điều hòa của P và R → chỉ cao khi cả hai cùng cao. F-beta để nghiêng về một bên.
- Hạ ngưỡng: Recall tăng hoặc giữ, Precision thường giảm nhưng không bảo đảm; xếp hạng score không đổi.
- Nhiều class: macro (công bằng giữa các class) / weighted (theo phân bố) / micro (= Accuracy với bài 1 nhãn).
- Chọn metric = trả lời "FP hay FN tốn kém hơn?".
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Precision và Recall có cùng tử số TP. Khác nhau ở đâu, và mỗi cái nhìn vào phần nào của Confusion Matrix?
A: Khác ở mẫu số. Precision chia cho TP + FP = số lần model **đoán +** (cột Predicted +). Recall chia cho TP + FN = số mẫu **thật sự là +** (hàng Actual +). Precision hỏi "nói + thì đúng bao nhiêu"; Recall hỏi "có + thì bắt được bao nhiêu".
Q: Model sàng lọc bệnh có Accuracy = 98% trên dữ liệu có 2% người bệnh. Đã nên tin chưa? Cần xem thêm gì?
A: Chưa. Một model luôn đoán "không bệnh" cũng đạt 98%. Phải xem **Recall của class "có bệnh"** và Precision, F1 của class đó. Recall gần 0 thì model vô dụng dù Accuracy cao.
Q: Vì sao F1 dùng trung bình điều hòa thay vì trung bình cộng? Minh họa bằng số.
A: Trung bình điều hòa bị kéo về giá trị nhỏ hơn nên F1 chỉ cao khi cả P và R cao. Với P = 1.0, R = 0.02: trung bình cộng = 0.51 (trông ổn), F1 ≈ 0.039 (lộ ra model bỏ sót gần hết).
Q: Ví dụ slide (TP = 3, FP = 1, FN = 2, TN = 1): nếu model sửa đúng mẫu 2 (chó bị đoán nhầm là mèo) thì các metric thay đổi thế nào?
A: Mẫu 2 chuyển từ FN sang TP: TP = 4, FP = 1, FN = 1, TN = 1. Accuracy = 5/7 ≈ 0.714; Precision = 4/5 = 0.8; Recall = 4/5 = 0.8; F1 = 0.8. Cả bốn đều tăng, Recall tăng nhiều nhất (0.6 → 0.8) vì FN giảm.
Q: Hạ threshold từ 0.5 xuống 0.2 thì Recall và Precision thường thay đổi ra sao? Vì sao?
A: Recall **tăng** (hoặc giữ nguyên) vì model nói + dễ dãi hơn nên bắt được nhiều + thật hơn (FN giảm). Precision **thường giảm** vì nhiều mẫu − cũng bị kéo vào nhóm + (FP tăng). Recall không bao giờ giảm khi hạ ngưỡng; Precision thì không chắc chắn giảm, chỉ là thường giảm.
Q: Tính macro-F1 và weighted-F1 nếu F1(dog) = 0.80 (support 90) và F1(cat) = 0.20 (support 10). Con số nào "trung thực" hơn về class cat?
A: macro = (0.80 + 0.20)/2 = **0.50**; weighted = (90·0.80 + 10·0.20)/100 = **0.74**. Macro trung thực hơn về class thiểu số vì weighted bị class đông (dog) kéo lên, che mất việc model nhận diện cat rất kém.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Giải thích Precision và Recall cho người không rành kỹ thuật, bằng một ví dụ đời thường.
A: Ví dụ ngư dân quăng lưới bắt cá hồi. **Precision** = trong số cá kéo lên, bao nhiêu phần thật sự là cá hồi (lưới có lẫn rác/cá khác không). **Recall** = trong số cá hồi có ở ao, lưới bắt được bao nhiêu phần. Lưới thưa chỉ bắt chắc chắn → Precision cao, Recall thấp. Lưới dày vét hết → Recall cao, Precision thấp.
EN: Precision is the share of what you caught that is actually the target; recall is the share of all targets that you caught.
Q: **B2.** Vì sao Accuracy không phù hợp với dữ liệu mất cân bằng? Đưa ví dụ số.
A: Accuracy cộng cả đoán đúng class đa số lẫn thiểu số nên bị class đa số chi phối. Với 1000 giao dịch có 10 gian lận, model luôn đoán "bình thường" đạt 99% nhưng Recall = 0. Nên dùng Precision/Recall/F1 của class thiểu số, hoặc PR-AUC.
EN: Accuracy is dominated by the majority class, so a trivial classifier can score 99% while catching nothing; use per-class precision/recall/F1 instead.
Q: **B3.** F1 và F-beta khác nhau thế nào? Khi nào dùng F2?
A: F1 coi P và R ngang nhau. F-beta thêm tham số β: β > 1 thiên về Recall, β < 1 thiên về Precision. Dùng F2 khi bỏ sót (FN) đắt hơn báo nhầm, ví dụ sàng lọc bệnh. Cần nói rõ đây là lựa chọn dựa trên chi phí chứ không phải mặc định.
EN: F-beta weights recall β times as much as precision; use F2 when false negatives cost more, e.g. disease screening.
Q: **B4.** Precision và Recall đánh đổi nhau như thế nào? Ngưỡng đóng vai trò gì?
A: Model xuất ra điểm số, ngưỡng quyết định ranh giới nói +. Hạ ngưỡng → Recall tăng hoặc giữ, thường thêm báo nhầm nên Precision thường giảm; tăng ngưỡng thì Recall giảm hoặc giữ. Đánh đổi này là của **một model cố định**; Precision không bảo đảm đơn điệu nên đôi khi cả hai cùng tăng ở một số điểm vận hành. Muốn cải thiện xếp hạng cần đổi model/feature/dữ liệu; ngưỡng là lựa chọn cho quyết định, không phải hệ số học của model Logistic.
EN: A model outputs scores and the threshold sets the operating point; moving it trades precision for recall on a fixed model.
Q: **B5.** Micro, macro, weighted-F1 khác nhau thế nào? Vì sao micro-F1 bằng Accuracy trong bài đơn nhãn?
A: Macro: trung bình đều các class. Weighted: trung bình theo support. Micro: cộng dồn TP/FP/FN toàn bộ rồi tính. Trong bài đơn nhãn nhiều class, mỗi lần đoán sai vừa là 1 FP của class bị đoán nhầm vừa là 1 FN của class thật → tổng FP = tổng FN = số lần sai, nên micro-Precision = micro-Recall = Accuracy.
EN: In single-label multiclass every error is one FP for some class and one FN for another, so pooled FP = FN, hence micro-P = micro-R = micro-F1 = accuracy.
Q: **B6.** Có thể đạt Recall = 100% một cách "ăn gian" không? Nói lên điều gì về việc chỉ báo cáo Recall?
A: Có: luôn đoán +. FN = 0 nên Recall = 1, còn Precision chỉ bằng tỉ lệ class + trong dữ liệu (ví dụ 1%). Vì vậy Recall luôn phải báo cùng Precision (hoặc F1) — tương tự, Precision cao một mình cũng có thể ăn gian bằng cách chỉ đoán + khi cực kỳ chắc.
EN: Always predicting positive gives recall 1 with precision equal to the base rate, so recall must be reported together with precision.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Team chống gian lận có 10 vụ gian lận/1000 giao dịch. Model A luôn đoán "bình thường"; model B có TP = 8, FN = 2, FP = 40. Mỗi vụ gian lận bị bỏ sót mất trung bình 500$; mỗi giao dịch bị kiểm tra thủ công tốn 5$. Chọn model nào? Tính chi phí.
A: Chi phí A = 10 × 500 = **5000$**. Chi phí B = bỏ sót 2 × 500 + kiểm tra 48 giao dịch bị đánh dấu (8 TP + 40 FP) × 5 = 1000 + 240 = **1240$**. Chọn B dù Accuracy thấp hơn (95.8% so với 99%). Điểm then chốt: so sánh model bằng **chi phí kỳ vọng**, và Accuracy ở đây còn đánh lừa theo hướng ngược lại.
WANT: Bạn chuyển được metric thành tiền (cost-sensitive) và nhận ra Accuracy xếp hạng sai hai model. Kết thúc bằng ý "chọn ngưỡng sao cho tổng chi phí nhỏ nhất".
Q: **C2.** Sản phẩm gợi ý hiển thị 10 mục đầu trang. Sếp muốn "tăng Recall cho model". Bạn phản hồi thế nào?
A: Làm rõ mục tiêu trước: chỉ có 10 chỗ hiển thị nên mỗi gợi ý sai (FP) tiêu tốn một chỗ và làm giảm niềm tin. Metric sát sản phẩm là **Precision@10** (hoặc các metric xếp hạng như MAP/NDCG), không phải Recall toàn cục. Nếu thật sự cần Recall (ví dụ bước retrieval lấy ứng viên) thì đó là giai đoạn khác trong hệ thống nhiều tầng.
WANT: Bạn hỏi lại mục tiêu kinh doanh trước khi tối ưu, và biết metric phải gắn với giao diện/quy trình thật.
Q: **C3.** Model chẩn đoán có Precision 0.9, Recall 0.4. Bác sĩ phàn nàn "bỏ sót nhiều ca". Bạn làm gì?
A: Recall thấp = FN nhiều, đúng như bác sĩ nói. Các hướng: (1) hạ ngưỡng để tăng Recall, chấp nhận Precision giảm vì xét nghiệm thêm rẻ hơn bỏ sót; (2) đổi metric tối ưu sang F2 hoặc đặt ràng buộc "Recall ≥ 0.9, tối đa hóa Precision"; (3) kiểm tra dữ liệu mất cân bằng và áp dụng resampling/class weight ([[bài:imbalanced-data]]); (4) báo cáo kèm confusion matrix để bác sĩ thấy rõ phép đánh đổi.
WANT: Bạn đề xuất cách chỉnh có kiểm soát (ngưỡng, metric, dữ liệu) và giải thích đánh đổi với người dùng không chuyên.
Q: **C4.** Team báo cáo "F1 = 0.92 trên tập test" nhưng sản phẩm hoạt động tệ khi chạy thật. Bạn nghi ngờ điều gì, và kiểm tra theo thứ tự nào?
A: (1) Rò rỉ dữ liệu / chia tập sai: test không độc lập với train (bài [[bài:train-test-split]]); (2) phân phối dữ liệu thật khác tập test (data drift), hoặc tỉ lệ class thật khác — Precision phụ thuộc mạnh vào tỉ lệ class; (3) F1 gộp che mất class quan trọng — xem từng class, macro vs weighted; (4) ngưỡng chọn trên test thay vì validation; (5) metric không phản ánh cái hệ thống cần (ví dụ cần Recall tại mức Precision cố định).
WANT: Một danh sách chẩn đoán có thứ tự, bắt đầu từ lỗi quy trình đánh giá trước khi đổ lỗi cho thuật toán.
:::

## Nối sang bài sau

:::next
Mọi metric trong bài này phụ thuộc vào **một ngưỡng cố định** (thường 0.5). Nếu đổi ngưỡng liên tục từ 0 đến 1 và vẽ lại TPR theo FPR, ta được đường cong ROC và con số AUC — thước đo không phụ thuộc ngưỡng: [[bài:roc-auc]].
:::
