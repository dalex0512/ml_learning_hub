---
title: Accuracy, Precision, Recall và F1-score
order: 12
description: "Mỗi metric là một câu hỏi khác nhau về cùng bảng nhầm lẫn, tính tay trên ví dụ dog/cat của slide 33 đến 36, vì sao F1 là trung bình điều hòa, và chọn theo cái giá của từng loại sai."
slides: 33-36
needs: [confusion-matrix]
tags: [accuracy, precision, recall, f1, threshold, imbalanced, metric]
---

## Bốn con số, nhiều cách gói: ta quan tâm lỗi nào?

:::intro Mục tiêu bài này
- Nói được **mỗi metric trả lời câu hỏi gì** (Accuracy, Precision, Recall, F1), và tính tay cả bốn trên ví dụ dog/cat của slide 33 đến 36.
- Giải thích vì sao accuracy cao vẫn có thể là một model vô dụng, và vì sao F1 dùng **trung bình điều hòa**.
- Kéo ngưỡng để thấy precision và recall đổi nhau, và chọn metric theo **cái giá của từng loại sai**.
:::

[[bài:confusion-matrix]] cho ta bốn con số: [[từ:tp]], [[từ:fp]], [[từ:fn]], [[từ:tn]]. Bốn con số thì khó so sánh hai model, nên ta **gói** chúng thành một tỉ lệ; tùy cách gói, tỉ lệ đó trả lời **một câu hỏi khác**. Slide 33 đến 36 xây bảng metric từng dòng một trên chính ví dụ dog/cat với TP = 3, FP = 1, FN = 2, TN = 1 (tổng 7):

| Metric | Công thức | Trả lời câu hỏi |
|---|---|---|
| **Accuracy** | (TP + TN) / All | Trong *tất cả* các lần đoán, đúng bao nhiêu? |
| **Precision** | TP / (TP + FP) | Khi model *nói là +*, nó đúng bao nhiêu? |
| **Recall** | TP / (TP + FN) | Trong *những mẫu thật sự là +*, model bắt được bao nhiêu? |
| **F1 score** | (2 · Pre · Re) / (Pre + Re) | Precision và Recall có *cùng cao* không? |

:::slides 33-36 | Slide 33–36: bảng metric xây dần, Accuracy, Precision, Recall, F1, tính trên ví dụ dog/cat
:::

:::steps
**Accuracy** = (TP + TN) / All = (3 + 1) / 7 = **4/7 ≈ 57.1%**. Tử số là hai ô **đúng** (đường chéo); mẫu số là mọi mẫu.
@step
**Precision** = TP / (TP + FP) = 3 / (3 + 1) = **75%**. Model đoán "dog" 4 lần (cột trái: 3 + 1); trong đó 3 lần đúng.
@step
**Recall** = TP / (TP + FN) = 3 / (3 + 2) = **60%**. Có 5 con chó thật (hàng trên: 3 + 2); model bắt được 3.
@step
**F1** = 2 · 0.75 · 0.6 / (0.75 + 0.6) = **0.9 / 1.35 ≈ 66.7%**, khớp với công thức trên slide.
:::

Chú ý ba con số 57.1%, 75%, 60% đều tính từ **cùng một bảng**, nhưng nói ba điều khác nhau: model đúng chung chỉ hơn nửa, khi nó báo "chó" thì khá đáng tin, nhưng nó bỏ sót 40% số chó.

:::predict
Một "model" lười luôn trả lời **"không bệnh"** cho cả 154 người test của bộ Diabetes (99 khoẻ, 55 bệnh). Accuracy của nó là bao nhiêu, và nó tìm được bao nhiêu người bệnh?
@answer
Accuracy = 99 / 154 = **64.3%**, nhưng nó tìm được **0 trong 55** người bệnh. Model lười có accuracy trông tạm ổn mà hoàn toàn vô dụng: đó là lý do một con số duy nhất là không đủ.
:::

## Accuracy: đúng chung, và vì sao dễ đánh lừa

Accuracy đối xử với **mọi loại sai như nhau** và không quan tâm lớp nào hiếm. Điều đó vừa dễ hiểu vừa nguy hiểm. Ví dụ cực đoan: một bệnh hiếm gặp ở 1 trong 100 người. Model luôn đoán "khoẻ" đạt accuracy **99%** mà không cứu được ai.

Với Diabetes của Project, bảng nhầm lẫn của model Logistic là TP = 37, FP = 20, FN = 18, TN = 79: accuracy = (37 + 79) / 154 = **75.3%**, trong khi mức sàn (đoán toàn Âm) là 64.3%. Accuracy chỉ có nghĩa khi **so với mức sàn** và khi các lớp không quá lệch.

:::ck
Một bộ lọc gian lận có 1 giao dịch gian lận trong 1000. Model A đạt accuracy 99.9%. Bạn có kết luận được A tốt không?
@answer
**Không.** Luôn đoán "không gian lận" cũng đạt 99.9%. Cần xem **recall** (bắt được bao nhiêu giao dịch gian lận) và **precision** (báo gian lận thì đáng tin đến đâu), tính trên lớp hiếm.
:::

## Precision và recall: hai câu hỏi về hai nhóm khác nhau

Cùng một tử số (TP), nhưng hai **mẫu số khác nhau** nên hai câu hỏi khác nhau:

- **[[từ:precision|Precision]]** hỏi *khi model báo Dương, đáng tin đến đâu?* Mẫu số là mọi lần model **đoán Dương** (cột trái: TP + FP). Precision thấp nghĩa là nhiều **báo động giả**.
- **[[từ:recall|Recall]]** hỏi *trong số người thật sự Dương, model bắt được bao nhiêu?* Mẫu số là mọi người **thật sự Dương** (hàng trên: TP + FN). Recall thấp nghĩa là nhiều **bỏ sót**. (Slide gọi recall là "độ bao phủ"; chính xác hơn là bao phủ các mẫu thật sự Dương. Nó còn có tên *sensitivity* hoặc *true positive rate*, sẽ gặp lại ở [[bài:roc-auc]].)

Với Diabetes: model đoán Dương cho 37 + 20 = 57 người và có 37 + 18 = 55 người bệnh thật; **precision = 37/57 = 64.9%**, **recall = 37/55 = 67.3%**, F1 = 66.1%.

:::ck
Precision thấp nghĩa là model mắc loại sai nào nhiều? Recall thấp nghĩa là loại sai nào? Làm sao nhớ?
@answer
Precision thấp: nhiều **FP** (báo động giả). Recall thấp: nhiều **FN** (bỏ sót). Nhớ bằng **mẫu số**: precision chia cho "số lần báo Dương" nên bị FP làm giảm; recall chia cho "số người thật sự Dương" nên bị FN làm giảm.
:::

## F1: vì sao trung bình điều hòa?

F1 gộp precision và recall thành một con số, nhưng **không** lấy trung bình cộng. Với dog/cat: trung bình cộng của 0.75 và 0.6 là 0.675, F1 là 0.667: khá gần. Khác biệt lộ ra khi một trong hai quá thấp: precision 100% nhưng recall chỉ 10% (model chỉ báo đúng một vài ca chắc chắn nhất). Trung bình cộng cho **55%**, trông tạm ổn; F1 cho **18.2%**, phản ánh đúng việc model bỏ sót gần hết. **F1 chỉ cao khi cả hai cùng cao**; một bên thấp kéo F1 xuống gần bên đó.

## Kéo ngưỡng: precision và recall đổi nhau thế nào?

Model Logistic không trả "bệnh/không bệnh" mà trả một **xác suất**; ta so với một [[từ:threshold|ngưỡng]] để quyết định. Mặc định là 0.5, nhưng không có gì thiêng liêng ở con số đó.

:::predict
Ta **hạ** ngưỡng từ 0.5 xuống 0.3 (dễ báo "bệnh" hơn). Recall và precision sẽ đổi thế nào?
@answer
**Recall tăng, precision giảm.** Với bộ Diabetes: ở ngưỡng 0.5, recall 67.3% và precision 64.9%; ở 0.3, recall lên **76.4%** nhưng precision tụt xuống **54.5%**; ở 0.7, recall chỉ **49.1%** còn precision lên **81.8%**. Báo Dương dễ hơn thì bắt được nhiều người bệnh hơn, nhưng cũng kéo thêm người khoẻ vào.
:::

Hãy tự kéo. Công cụ có hai bộ dữ liệu: 10 email để thấy từng mẫu một, và 154 bệnh nhân của Project. Chuyển sang Diabetes rồi đặt ngưỡng 0.5, bạn sẽ thấy đúng bảng nhầm lẫn ở trên.

:::widget threshold-matrix
:::

Hai điều đáng nhớ: **không có ngưỡng đúng tuyệt đối** (nó phụ thuộc cái giá của từng loại sai), và precision với recall thường **đổi chác** nhau. Để nhìn mọi ngưỡng cùng lúc, ta vẽ đường ROC ở [[bài:roc-auc]]; slide 37 đã giới thiệu hai trục của nó: TPR (chính là recall) và FPR = FP / (FP + TN).

## Chọn metric theo cái giá của từng loại sai

Chọn metric là chọn câu hỏi ta quan tâm, và câu hỏi đó đến từ **loại sai nào đắt hơn**:

| Tình huống | Loại sai đắt hơn | Ưu tiên |
|---|---|---|
| Sàng lọc bệnh nặng | Bỏ sót người bệnh (FN) | **Recall** (báo nhầm còn có thể xét nghiệm lại) |
| Lọc thư rác | Đẩy email công việc vào thư rác (FP) | **Precision** |
| Phát hiện gian lận, 1 trên 1000 | Cả hai, và accuracy vô nghĩa | **Precision, recall, F1** trên lớp hiếm |
| Chấm bài tự động | Tùy chính sách | Hỏi chi phí thật |

:::ck
Hệ thống tự động khóa tài khoản nghi gian lận. Khóa nhầm khách tốt (FP) làm họ bỏ đi; bỏ sót gian lận (FN) mất tiền. Bạn chọn metric nào, và hỏi gì trước?
@answer
Chưa chọn được ngay: phải **hỏi chi phí thật** của một FP và một FN (mất khách đắt hay mất tiền đắt hơn). Nếu hai cái ngang nhau thì dùng F1; nếu FN đắt gấp mấy lần FP thì ưu tiên recall và hạ ngưỡng, theo chi phí tổng. Đây cũng là cách trả lời tốt trong phỏng vấn: nêu chi phí trước, metric sau.
:::

## Tính và đối chiếu bằng code

Tự cài đặt trước, rồi đối chiếu bằng scikit-learn trên bảy ảnh chó/mèo (`dog` là +):

```python
def classification_metrics(tp, fp, fn, tn):
    all_ = tp + fp + fn + tn
    accuracy  = (tp + tn) / all_
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0   # tránh chia cho 0
    recall    = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall / (precision + recall)
          if (precision + recall) > 0 else 0.0)
    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}

print(classification_metrics(tp=3, fp=1, fn=2, tn=1))
# {'accuracy': 0.571..., 'precision': 0.75, 'recall': 0.6, 'f1': 0.666...}
# Bẫy accuracy: model luôn đoán "bình thường" trên 1000 giao dịch, 10 gian lận
print(classification_metrics(tp=0, fp=0, fn=10, tn=990))
# {'accuracy': 0.99, 'precision': 0.0, 'recall': 0.0, 'f1': 0.0}
```

```python
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, fbeta_score, classification_report)
pred  = ["dog", "cat", "dog", "dog", "cat", "cat", "dog"]
label = ["dog", "dog", "cat", "dog", "cat", "dog", "dog"]
print(accuracy_score(label, pred))                        # 0.5714
print(precision_score(label, pred, pos_label="dog"))      # 0.75
print(recall_score(label, pred, pos_label="dog"))         # 0.6
print(f1_score(label, pred, pos_label="dog"))             # 0.6667
print(fbeta_score(label, pred, beta=2, pos_label="dog"))  # 0.625
print(classification_report(label, pred, digits=4))       # từng class + macro, weighted
```

Chú ý `pos_label`: nếu label là chuỗi, phải chỉ rõ class + là gì, nếu không scikit-learn báo lỗi; với label 0/1 mặc định `pos_label=1`. Báo cáo đầy đủ cho thấy `cat` kém hẳn (F1 0.4) so với `dog` (0.6667): macro-F1 0.5333 lộ điểm yếu này, còn weighted-F1 0.5905 bị class đông kéo lên.

## Những hiểu sai thường gặp

- **"Accuracy cao nghĩa là model tốt."** Chỉ khi lớp cân bằng và so với mức sàn.
- **"Precision và recall là một."** Hai mẫu số khác nhau, hai kiểu sai khác nhau.
- **"F1 là trung bình cộng."** Là trung bình **điều hòa**: bên thấp kéo F1 xuống mạnh.
- **"Ngưỡng 0.5 là chuẩn."** Chỉ là mặc định; đổi ngưỡng đổi precision và recall.
- **"Metric tốt nhất tồn tại."** Không: chọn theo chi phí của từng loại sai.

:::card Accuracy, Precision, Recall, F1
- **Accuracy** = (TP + TN) / All: đúng chung (dog/cat: 4/7 = 57.1%). Chỉ có nghĩa khi so với mức sàn và các lớp không quá lệch.
- **Precision** = TP / (TP + FP): báo Dương thì đáng tin đến đâu (nhìn cột "đoán Dương"; dog/cat: 75%).
- **Recall** = TP / (TP + FN): bắt được bao nhiêu mẫu Dương thật (nhìn hàng "thật Dương"; dog/cat: 60%).
- **F1** = 2·P·R / (P + R): trung bình điều hòa, chỉ cao khi cả hai cùng cao (66.7%).
- **Ngưỡng** đổi precision và recall ngược chiều (Diabetes: 0.3 cho recall 76.4% precision 54.5%; 0.7 cho recall 49.1% precision 81.8%).
- **Chọn metric theo cái giá của FP và FN**; bẫy lớn nhất là tin accuracy khi dữ liệu lệch.
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

Thực hành: [[bài:diabetes-evaluate-improve]] — đọc report thật và tự tính metric từ ma trận79/20/18/37.
:::
