---
title: ROC curve và AUC
order: 13
description: "Mỗi ngưỡng một điểm: ROC là kết quả quét ngưỡng với hai trục TPR và FPR của slide 37, AUC vừa là diện tích vừa là xác suất xếp đúng cặp, và số thật trên Diabetes."
slides: 37
needs: [classification-metrics]
tags: [roc, auc, tpr, fpr, precision-recall, threshold]
---

## Một ngưỡng chỉ cho một điểm; ROC cho ta nhìn mọi ngưỡng cùng lúc

:::intro Mục tiêu bài này
- Hiểu đường **ROC** là kết quả **quét ngưỡng**: mỗi ngưỡng cho một điểm (FPR, TPR), hai trục của slide 37.
- Hiểu **AUC** vừa là diện tích dưới đường cong, vừa là xác suất model xếp một ca Dương cao hơn một ca Âm.
- Biết AUC **không** chọn hộ ngưỡng, cách chọn ngưỡng từ ROC, và khi nào nên nhìn thêm đường Precision-Recall.
:::

[[bài:classification-metrics]] cho thấy mỗi ngưỡng cho một cặp precision và recall khác nhau. Để so hai model **không phụ thuộc ngưỡng**, ta vẽ kết quả của **mọi ngưỡng** lên một đồ thị. Slide 37 đặt hai trục:

| Trục | Công thức | Ý nghĩa |
|---|---|---|
| **True Positive Rate (= Recall)** | TP / (TP + FN) | bắt được bao nhiêu người Dương thật |
| **False Positive Rate** | FP / (FP + TN) | trong số người Âm thật, bao nhiêu bị **báo nhầm** là Dương |

Đường cong kết quả gọi là **ROC** (Receiver Operating Characteristic). Vùng nằm dưới nó là **AUC** (Area Under the Curve). Trên slide còn có hai mốc: **perfect classifier** (ngôi sao ở góc trên trái: TPR = 1, FPR = 0) và **đường chéo** (đoán mò).

:::slides 37 | Slide 37: Receiver Operating Characteristic curve, TPR, FPR, AUC
:::

:::predict
Một model cho mỗi mẫu một score. Nếu ta đặt ngưỡng **bằng 0** (mọi mẫu đều bị đoán Dương), TPR và FPR là bao nhiêu? Còn nếu ngưỡng cao hơn mọi score (không mẫu nào bị đoán Dương)?
@answer
Ngưỡng 0: bắt được **mọi** người Dương nhưng cũng báo nhầm **mọi** người Âm, nên (FPR, TPR) = **(1, 1)**, góc trên phải. Ngưỡng cao hơn mọi score: không đoán Dương, nên (FPR, TPR) = **(0, 0)**, góc dưới trái. Đường ROC đi từ (0, 0) đến (1, 1) khi hạ ngưỡng dần; model càng tốt thì đường càng ôm góc trên trái.
:::

## Quét ngưỡng trên 10 email

Hãy tự kéo ngưỡng. Điểm đỏ chạy trên đường ROC; bảng bên dưới cập nhật theo.

:::widget roc-sweep
:::

Đường ROC được dựng như thế này (5 email spam, 5 email thường, xếp theo score từ cao xuống thấp):

:::steps
Bắt đầu ở ngưỡng cao nhất: không đoán Dương, điểm (FPR, TPR) = **(0, 0)**.
@step
Hạ ngưỡng qua từng email theo thứ tự score giảm dần. Gặp một **spam** thì TPR tăng 1/5 = 0.2 (đường đi **lên**). Gặp một **email thường** thì FPR tăng 0.2 (đường đi **sang phải**).
@step
Thứ tự trong ví dụ: spam, spam, thường, spam, spam, thường, spam, thường, thường, thường. Đường đi: lên, lên, phải, lên, lên, phải, lên, phải, phải, phải, đến **(1, 1)**.
@step
**AUC** = diện tích dưới đường này = **0.84**. Nó bằng đúng tỉ lệ các cặp (spam, email thường) mà model xếp spam **cao hơn**: 21 trên 25 cặp = 0.84.
:::

## Trên dữ liệu thật: Diabetes

Với model Logistic của Project (154 người test: 55 bệnh, 99 khoẻ), ba ngưỡng quen thuộc cho ba điểm trên ROC:

| Ngưỡng | TPR (recall) | FPR | Nhận xét |
|---|---|---|---|
| 0.3 | 0.764 | 0.354 | bắt nhiều bệnh, báo nhầm nhiều |
| 0.5 | 0.673 | 0.202 | mặc định |
| 0.7 | 0.491 | 0.061 | ít báo nhầm, bỏ sót nhiều |

**AUC của model là 0.815**: nếu bốc ngẫu nhiên một người bệnh và một người khoẻ, model xếp người bệnh cao hơn trong **81.5%** các cặp. Mức đoán mò là 0.5, mức hoàn hảo là 1.

## Đọc AUC, và những giới hạn

- **AUC = 0.5:** đường chéo, model xếp hạng như đoán mò. **AUC = 1:** xếp mọi Dương cao hơn mọi Âm.
- **AUC không phụ thuộc ngưỡng**, nên so hai model công bằng. Nhưng nó cũng **không chọn hộ ngưỡng**: model AUC 0.95 vẫn có thể có recall thấp nếu ta chọn ngưỡng sai.
- **Chọn ngưỡng từ ROC:** một cách là điểm làm **TPR − FPR** lớn nhất (chỉ số Youden J). Với Diabetes: J = 0.513 tại ngưỡng khoảng **0.54** (TPR 0.655, FPR 0.141), gần 0.5. Cách tốt hơn là chọn theo **chi phí** của FP và FN (xem bài tập ở Project Bước 5).
- **Dữ liệu rất lệch:** FPR chia cho số lượng Âm rất lớn nên ROC có thể trông đẹp dù precision thấp. Khi lớp Dương hiếm, hãy nhìn thêm đường **Precision-Recall**: với Diabetes, tỉ lệ Dương là 35.7% và average precision là 0.716, so mức sàn 0.357.

:::ck
Model A có AUC = 0.50 trên bộ test. Model B có AUC = 0.80. Nếu hai model cùng dùng ngưỡng 0.5, B chắc chắn có accuracy cao hơn A không?
@answer
**Không chắc.** AUC đo khả năng **xếp hạng** trên mọi ngưỡng, còn accuracy ở ngưỡng 0.5 phụ thuộc cách model hiệu chỉnh score. B xếp hạng tốt hơn rõ rệt (0.80 so với đoán mò), nhưng ở một ngưỡng cụ thể thì kết quả có thể khác. Muốn nói về accuracy phải tính accuracy.
:::

:::ck
Hai model có cùng AUC = 0.85. Model 1 xếp đúng ở vùng score cao (bắt được các ca rõ nhất), model 2 xếp đúng ở vùng score thấp. Bạn dùng model nào cho bài sàng lọc, nơi bỏ sót là tệ nhất?
@answer
Cần nhìn **hình dạng** đường ROC, không chỉ diện tích: sàng lọc cần TPR cao ở FPR thấp-vừa. Hai đường cùng diện tích có thể rất khác ở vùng ta quan tâm. AUC là một con số tóm tắt, không thay cho việc xem đường cong và chọn điểm làm việc theo chi phí.
:::

## Tự cài đặt ROC và AUC bằng code

Mười email ở trên, cài ROC từ đầu rồi đối chiếu với scikit-learn. AUC tính bằng **diện tích** và bằng **đếm cặp** cho cùng một con số:

```python
import numpy as np
scores = np.array([0.95, 0.85, 0.80, 0.70, 0.60, 0.55, 0.40, 0.30, 0.20, 0.10])
labels = np.array([1,    1,    0,    1,    1,    0,    1,    0,    0,    0   ])

def roc_points(scores, labels):
    order = np.argsort(-scores)              # sắp theo score giảm dần
    y = labels[order]
    P, N = y.sum(), len(y) - y.sum()
    tpr, fpr = [0.0], [0.0]                  # bắt đầu tại (0, 0)
    tp = fp = 0
    for yi in y:                             # hạ ngưỡng qua từng mẫu
        if yi == 1: tp += 1                  # mẫu + : đi lên
        else:       fp += 1                  # mẫu - : sang phải
        tpr.append(tp / P)
        fpr.append(fp / N)
    return np.array(fpr), np.array(tpr)

fpr, tpr = roc_points(scores, labels)
print("AUC (diện tích):", np.trapezoid(tpr, fpr))        # 0.84 (NumPy cũ < 2.0 dùng np.trapz)
pos, neg = scores[labels == 1], scores[labels == 0]
print("AUC (đếm cặp):", np.mean([p > n for p in pos for n in neg]))   # 0.84
```

Cách cài trên giả sử không có hai mẫu trùng score; nếu có, cần gộp các mẫu cùng score thành một bước (scikit-learn đã xử lý việc này, và AUC tính điểm hòa là một nửa). Với scikit-learn:

```python
from sklearn.metrics import roc_curve, roc_auc_score
fpr, tpr, thresholds = roc_curve(labels, scores)
print("AUC:", roc_auc_score(labels, scores))             # 0.84
best = (tpr - fpr).argmax()                              # Youden's J: TPR - FPR lớn nhất
print("Ngưỡng tốt nhất theo Youden:", thresholds[best])
```

Với model thật, `scores = model.predict_proba(X_test)[:, 1]`, tức cột xác suất của class +.

## Những hiểu sai thường gặp

- **"AUC cao thì model chắc chắn dùng được."** Nó cho thấy khả năng xếp hạng, không cho thấy ngưỡng nào dùng, và không đảm bảo xác suất chuẩn.
- **"ROC tốt thì precision cao."** Với lớp Dương hiếm, ROC có thể đẹp mà precision thấp.
- **"Đường ROC phụ thuộc ngưỡng ta chọn."** Không: nó **là** kết quả của việc quét mọi ngưỡng; ta chọn một điểm trên nó.
- **"AUC 0.5 nghĩa là model bằng nhau."** Nó nghĩa là xếp hạng không hơn đoán mò.

:::card ROC và AUC
- **ROC** vẽ (FPR, TPR) cho **mọi ngưỡng**; đi từ (0, 0) đến (1, 1); ngôi sao góc trên trái là perfect classifier, đường chéo là đoán mò (slide 37).
- **TPR = recall = TP/(TP+FN); FPR = FP/(FP+TN)** (báo nhầm trong số Âm thật).
- **AUC** = diện tích dưới ROC = xác suất model xếp một Dương cao hơn một Âm (email: 21/25 = 0.84; Diabetes: 0.815).
- **AUC không chọn hộ ngưỡng**; chọn theo chi phí hoặc Youden J (Diabetes: ngưỡng ~0.54).
- **Lớp Dương hiếm:** xem thêm Precision-Recall.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: TPR và FPR được tính trên nhóm mẫu nào? Mỗi cái ta muốn cao hay
thấp?
A: TPR = TP / (TP + FN), tính trên nhóm **+ thật** — muốn
**cao**. FPR = FP / (FP + TN), tính trên nhóm **− thật** — muốn
**thấp**. Cả hai đều là "tỉ lệ bị báo +", chỉ khác nhóm.
EN: Over which group of samples are TPR and FPR computed? Do we want
each high or low?
**A:** TPR = TP / (TP + FN), over **actual positives** — want it
> **high**. FPR = FP / (FP + TN), over **actual negatives** — want it
> **low**.

Q: Vì sao đường chéo nối (0, 0) và (1, 1) tương ứng với một model
đoán ngẫu nhiên?
A: Model ngẫu nhiên không phân biệt được + và −, nên tỉ lệ báo
+ trên nhóm dương thật bằng tỉ lệ báo + trên nhóm âm thật: TPR = FPR. Tập
hợp các điểm có TPR = FPR chính là đường chéo, và diện tích dưới nó là
0.5.
EN: Why does the diagonal from (0, 0) to (1, 1) correspond to a
random classifier?
**A:** A random model can't tell + from −, so it flags the same share
> of each group: TPR = FPR. Those points form the diagonal, with area
> 0.5 beneath it.

Q: Trong ví dụ 10 email, nếu email C (không spam, score 0.80) được
model chấm lại 0.35 thì AUC thay đổi thế nào?
A: Thứ tự mới: A, B, D, E, F, G, C, H, I, J. Đếm lại số email
không spam có score thấp hơn mỗi spam: A 5, B 5, D 5, E 5 (cả bốn đều
cao hơn mọi email thường, vì email thường cao nhất giờ là F = 0.55), G 4
(thua F, thắng C 0.35, H, I, J). Tổng = 24 → AUC = 24/25 = **0.96**.
Tăng vì model xếp hạng tốt hơn: mẫu − từng "chen" lên trên ba spam đã bị
đẩy xuống dưới.
EN: In the 10-email example, if email C (not spam, score 0.80) is
re-scored to 0.35, how does AUC change?
**A:** New counts of lower-scored non-spam per spam: A 5, B 5, D 5,
> E 5, G 4 → 24 → AUC = 24/25 = **0.96**. Better ranking, higher AUC.

Q: Model X có AUC = 0.92, model Y có AUC = 0.85. Có chắc X tốt hơn
Y tại threshold 0.5 không?
A: Không chắc. AUC tổng hợp trên **mọi** threshold; hai đường
ROC có thể cắt nhau, nên tại một threshold cụ thể Y vẫn có thể có TPR
hoặc FPR tốt hơn. AUC cao nói rằng X **xếp hạng** tốt hơn về tổng thể,
còn hiệu năng tại một điểm vận hành phải xem trực tiếp điểm đó.
EN: Model X has AUC 0.92, model Y 0.85. Is X definitely better at
threshold 0.5?
**A:** No. AUC summarises **all** thresholds; the ROC curves can cross,
> so Y may still be better at a specific operating point.

Q: Một model có AUC = 0.3. Điều đó có nghĩa gì và nên làm gì?
A: Model xếp hạng **ngược**: thường chấm mẫu − cao hơn mẫu +.
Đảo dấu dự đoán (dùng 1 − score) sẽ cho AUC = 0.7. Nhưng trước khi đảo,
nên kiểm tra lỗi trong pipeline — ví dụ đảo nhầm label 0/1 hoặc lấy nhầm
cột xác suất của class −.
EN: A model has AUC = 0.3. What does it mean and what should you do?
**A:** It ranks **backwards**. Using 1 − score gives AUC 0.7, but first
> check the pipeline for bugs such as flipped labels or using the wrong
> probability column.

Q: Vì sao với dữ liệu rất mất cân bằng (1% là +), ROC/AUC có thể
trông lạc quan hơn thực tế?
A: Vì FPR chia cho số mẫu − rất lớn: hàng chục, hàng trăm lần
báo nhầm vẫn chỉ cho FPR nhỏ, nên đường ROC vẫn đẹp. Trong khi Precision
(chia cho số lần báo +) có thể rất thấp. Lúc đó nên xem thêm
Precision–Recall curve và Average Precision.
EN: Why can ROC/AUC look overly optimistic on heavily imbalanced data
(1% positive)?
**A:** FPR divides by the huge number of negatives, so many false
> alarms still give a small FPR, while Precision may be very low. Check
> the Precision–Recall curve and Average Precision as well.
@tier B | Phỏng vấn lý thuyết
Q: AUC bằng 0.5 nói gì và không nói gì?
A: Ranking tổng thể không tốt hơn mức không phân biệt theo AUC. Không có nghĩa mọi ngưỡng có accuracy 50%, cũng không chứng minh score hoàn toàn độc lập với nhãn. Cần xem đường cong và chất lượng dữ liệu.
EN: An AUC of 0.5 indicates no overall ranking advantage under this measure; it does not imply 50% accuracy at every threshold.
Q: AUC cao có bảo đảm xác suất đúng không?
A: Không. AUC chỉ xét thứ tự; đổi score bằng hàm tăng nghiêm ngặt giữ nguyên AUC nhưng có thể đổi ý nghĩa xác suất. Calibration là việc khác *(bổ sung)*.
EN: AUC measures ranking, not probability calibration; strictly increasing score transformations preserve it.
Q: ROC khác PR khi class dương hiếm thế nào?
A: FPR chia theo số âm, nên nhiều FP có thể vẫn cho FPR nhỏ. Precision chia số cảnh báo dương, phản ánh trực tiếp độ sạch danh sách cảnh báo. Xem cả ROC và PR, kèm tỷ lệ class và chi phí.
EN: ROC uses false-positive rate; PR exposes precision among alerts and depends on positive prevalence.
Q: Hai model ROC cắt nhau thì chọn bằng AUC được không?
A: AUC tóm tắt toàn miền. Nếu chỉ vận hành ở FPR rất thấp, cần so vùng đó và chi phí tại ngưỡng khả thi; model AUC thấp hơn có thể tốt hơn ở vùng cần dùng.
EN: Crossing ROC curves require comparison in the relevant operating region, not only by total AUC.
@tier C | Tình huống doanh nghiệp
Q: Fraud chỉ 0.1%, AUC cao mà đội duyệt than quá nhiều báo nhầm. Làm gì?
A: Đo precision, recall và số cảnh báo/ngày trên validation có tỷ lệ thật. Chọn ngưỡng theo công suất duyệt và chi phí fraud bỏ sót, xem PR curve; chốt trước khi đánh giá test. AUC vẫn hữu ích cho ranking nhưng chưa phản ánh tải vận hành *(bổ sung)*.
WANT: Nối metric với tỷ lệ class, ngân sách xử lý và trade-off.
Q: Hai model AUC tương đương nhưng chỉ được duyệt một danh sách ngắn. Chọn sao?
A: So precision/recall ở đúng ngân sách cảnh báo trên cùng validation, kiểm tra độ ổn định theo thời gian và nhóm giao dịch. Cân nhắc chi phí suy luận; không chọn theo chênh AUC nhỏ ngoài vùng sử dụng *(bổ sung)*.
WANT: Ưu tiên điểm vận hành thực tế và tính ổn định.
Q: AUC tụt dưới 0.5 sau một lần cập nhật pipeline. Có đảo score ngay?
A: Kiểm tra class mapping, cột predict_proba và chiều score trước, so vài mẫu đã biết. Nếu lỗi kỹ thuật thì sửa và đo lại; nếu thật sự đảo ranking thì kiểm tra nhãn/phân phối. Đảo score chỉ chữa triệu chứng nếu nguyên nhân chưa rõ *(bổ sung)*.
WANT: Debug có thứ tự trước khi áp mẹo 1 − score.
:::

## Nối sang bài sau

:::next
ROC/AUC kết thúc phần metric phân loại. Nếu target là đại lượng, [[bài:regression-metrics]] thay câu hỏi đúng/sai nhãn bằng sai lệch số đo MAE và RMSE.
:::
