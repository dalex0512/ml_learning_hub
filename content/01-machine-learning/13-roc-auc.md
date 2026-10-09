---
title: ROC curve và AUC
order: 13
description: Thay vì chấm model tại một threshold duy nhất, quét qua mọi threshold rồi vẽ True Positive Rate theo False Positive Rate — diện tích dưới đường cong (AUC) cho một con số đánh giá khả năng phân biệt hai class.
---

## 1. Ý tưởng

Ở bài 12, mọi metric đều tính tại **một threshold cố định** (thường 0.5).
Đổi threshold là Precision, Recall đổi theo. Vậy khi so hai model, nếu
model A thắng ở threshold 0.5 nhưng thua ở 0.3 thì kết luận thế nào?

**ROC curve** giải quyết chuyện này bằng cách **thử tất cả các
threshold**: với mỗi threshold, tính một cặp số (FPR, TPR) và chấm một
điểm. Nối các điểm lại được một đường cong mô tả **toàn bộ** hành vi của
model.

**AUC** (Area Under the ROC Curve) là **diện tích dưới đường cong** đó —
một con số từ 0 đến 1, càng gần 1 thì model càng giỏi **tách** class +
khỏi class −, bất kể sau này chọn threshold nào.

> **EN:** Every metric in lesson 12 is computed at **one fixed threshold**
> (usually 0.5); change the threshold and the numbers change. The **ROC
> curve** solves this by **trying every threshold**: each one yields a
> pair (FPR, TPR) plotted as a point, and joining the points traces the
> model's **full** behaviour. **AUC** (Area Under the ROC Curve) is the
> area under that curve — a single number from 0 to 1; the closer to 1,
> the better the model **separates** positives from negatives, regardless
> of which threshold is chosen later.

## 2. Vị trí trong pipeline

```
Confusion Matrix (bài 11)
   │
   ├─ tại 1 threshold → Accuracy, Precision, Recall, F1   (bài 12)
   │
   └─ quét MỌI threshold → mỗi threshold cho 1 cặp (FPR, TPR)
                          → nối lại = ROC curve
                          → diện tích = AUC                (bài này)
```

Đây là **slide 37**, slide cuối của phần đánh giá model Classification.
Slide đặt Confusion Matrix bên trái, bảng định nghĩa TPR/FPR ở dưới, và
hình ROC curve bên phải.

Điều kiện để vẽ được ROC: model phải cho ra **điểm số / xác suất** (score)
chứ không chỉ một nhãn cứng. Hầu hết model phân loại đều làm được (ví dụ
`predict_proba` trong scikit-learn).

> **EN:** This is slide 37, the last slide on Classification evaluation.
> The ROC curve extends the Confusion Matrix from one threshold to all of
> them. Requirement: the model must output a **score / probability**, not
> just a hard label — most classifiers can (e.g. `predict_proba` in
> scikit-learn).

## 3. Công thức / cách hoạt động

### 3.1. Hai trục của ROC

| Metric | Công thức | Ý nghĩa | Trục |
|---|---|---|---|
| **True Positive Rate** (= Recall = Sensitivity) | TP / (TP + FN) | trong các mẫu **+ thật**, bao nhiêu phần được báo + | trục tung (y) |
| **False Positive Rate** (= 1 − Specificity) | FP / (FP + TN) | trong các mẫu **− thật**, bao nhiêu phần bị báo nhầm là + | trục hoành (x) |

Để ý tính đối xứng đẹp: **TPR chia theo hàng Actual +**, **FPR chia theo
hàng Actual −**. Cả hai đều là "tỉ lệ bị gọi là +" — một cái trên nhóm
dương thật (muốn **cao**), một cái trên nhóm âm thật (muốn **thấp**).

Slide ghi trục hoành là "False Positive Rate (1 − Specificity)", vì
Specificity = TN / (TN + FP) nên 1 − Specificity = FP / (FP + TN) = FPR.

> **EN:** **TPR** (= Recall = Sensitivity) = TP / (TP + FN): the share of
> actual positives flagged as positive — the y-axis, want it **high**.
> **FPR** (= 1 − Specificity) = FP / (FP + TN): the share of actual
> negatives wrongly flagged as positive — the x-axis, want it **low**.
> Note the symmetry: TPR is computed over the Actual + row, FPR over the
> Actual − row.

### 3.2. Đọc hình ROC trong slide

- **Perfect classifier** (dấu sao góc trên trái, điểm (0, 1)): FPR = 0,
  TPR = 1 — bắt hết mẫu + mà không báo nhầm mẫu − nào. Đường cong càng
  **ôm sát góc trên trái** thì model càng tốt.
- **Random classifier** (đường chéo nét đứt): model đoán ngẫu nhiên, tỉ lệ
  báo + trên nhóm dương và nhóm âm như nhau, nên TPR = FPR. AUC = 0.5.
- **ROC** (đường cong xanh): model thực tế, nằm giữa hai trường hợp trên.
- **AUC** (vùng tô xám): diện tích dưới đường ROC.

> **EN:** Reading the slide's figure: the **perfect classifier** sits at
> the top-left corner (FPR = 0, TPR = 1) — the closer the curve hugs that
> corner, the better. The **random classifier** is the dashed diagonal
> (TPR = FPR, AUC = 0.5). The blue **ROC** curve is the real model, and
> the shaded region beneath it is the **AUC**.

### 3.3. Đường cong được vẽ ra như thế nào *(Bổ sung — slide chỉ cho hình, không cho cách vẽ)*

1. Model cho mỗi mẫu một **score** (xác suất là +).
2. **Sắp xếp** các mẫu theo score giảm dần.
3. Bắt đầu với threshold cao hơn mọi score: không mẫu nào bị báo + →
   TP = FP = 0 → điểm **(0, 0)**.
4. Hạ threshold dần, mỗi lần vượt qua một mẫu:
   - nếu mẫu đó là **+ thật** → TP tăng 1 → đường cong **đi lên** một bước
     1/P (P = số mẫu + thật);
   - nếu mẫu đó là **− thật** → FP tăng 1 → đường cong **đi sang phải** một
     bước 1/N (N = số mẫu − thật).
5. Threshold thấp hơn mọi score: mọi mẫu đều bị báo + → điểm **(1, 1)**.

Model tốt xếp các mẫu + lên **đầu** danh sách → đường cong **đi lên trước,
sang phải sau** → ôm góc trên trái. Model ngẫu nhiên xen lẫn + và − →
đường cong đi gần đường chéo.

> **EN:** *(Supplementary — the slide shows the figure but not how it's
> built)* Sort samples by score, descending. Start above every score:
> nothing is flagged → (0, 0). Lower the threshold past one sample at a
> time: an actual positive moves the curve **up** by 1/P; an actual
> negative moves it **right** by 1/N. Below every score, everything is
> flagged → (1, 1). A good model ranks positives first, so the curve goes
> up before it goes right and hugs the top-left corner.

### 3.4. Ý nghĩa của AUC *(Bổ sung)*

AUC có một cách hiểu rất trực quan:

> **AUC = xác suất để một mẫu + chọn ngẫu nhiên được model chấm điểm cao
> hơn một mẫu − chọn ngẫu nhiên.**

Vì vậy AUC đo **khả năng xếp hạng (ranking)** của model, không phụ thuộc
threshold. Thang đọc tham khảo:

| AUC | Ý nghĩa |
|---|---|
| 1.0 | hoàn hảo: mọi mẫu + đều có điểm cao hơn mọi mẫu − |
| 0.9 – 1.0 | rất tốt |
| 0.8 – 0.9 | tốt |
| 0.7 – 0.8 | chấp nhận được |
| 0.5 | không hơn đoán ngẫu nhiên |
| < 0.5 | xếp hạng **ngược** — đảo dấu dự đoán sẽ ra AUC > 0.5, thường là dấu hiệu lỗi (ví dụ đảo nhầm label) |

Các mốc 0.7 / 0.8 / 0.9 chỉ là quy ước phổ biến, không phải chuẩn cứng;
"đủ tốt" tùy lĩnh vực.

> **EN:** *(Supplementary)* **AUC = the probability that a randomly
> chosen positive gets a higher score than a randomly chosen negative.**
> It measures the model's **ranking** ability, independent of the
> threshold. Rough guide: 1.0 perfect; 0.9–1.0 excellent; 0.8–0.9 good;
> 0.7–0.8 fair; 0.5 no better than random; < 0.5 ranks backwards (often a
> sign of flipped labels). These bands are common conventions, not hard
> rules.

### 3.5. Chọn threshold từ ROC *(Bổ sung)*

ROC cho thấy mọi lựa chọn; việc chọn **một** điểm để triển khai phụ thuộc
cái giá của FP và FN (giống bài 12, phần 3.10):

- Sàng lọc bệnh → chọn điểm có **TPR cao**, chấp nhận FPR lớn hơn.
- Hệ thống mà báo nhầm rất tốn kém → chọn điểm có **FPR thấp**.
- Nếu không có ưu tiên rõ ràng, một cách đơn giản là chọn điểm có
  **TPR − FPR lớn nhất** (Youden's J), tức điểm xa đường chéo nhất theo
  chiều dọc.

> **EN:** *(Supplementary)* ROC shows every option; picking **one**
> operating point depends on error costs: screening → high TPR, accept
> higher FPR; costly false alarms → low FPR; no clear preference → maximise
> **TPR − FPR** (Youden's J), the point farthest above the diagonal.

### 3.6. Giới hạn của ROC và PR curve *(Bổ sung)*

FPR chia cho số mẫu − thật. Khi class − **rất đông** (ví dụ 990 giao dịch
bình thường so với 10 gian lận), dù model báo nhầm 40 giao dịch thì
FPR = 40 / 990 ≈ 0.04 — trông rất nhỏ. Đường ROC vẫn đẹp và AUC vẫn cao,
dù Precision thực tế chỉ khoảng 0.17.

Vì vậy với dữ liệu **rất mất cân bằng**, người ta hay xem thêm
**Precision–Recall curve (PR curve)**: trục x là Recall, trục y là
Precision, quét qua mọi threshold tương tự. Diện tích dưới PR curve gọi là
**Average Precision (AP)**. PR curve nhạy với FP hơn vì Precision chia cho
số lần báo +, không phải cho cả nhóm − đông đảo.

> **EN:** *(Supplementary)* FPR divides by the number of actual negatives.
> When negatives vastly outnumber positives (990 normal vs 10 fraud), even
> 40 false alarms give FPR ≈ 0.04 — so ROC/AUC can look great while real
> precision is about 0.17. For **heavily imbalanced** data, also check the
> **Precision–Recall curve** (x = Recall, y = Precision); its area is
> **Average Precision (AP)**. It's more sensitive to FP because Precision
> divides by predicted positives, not by the huge negative class.

## 4. Ví dụ tay

*(Bổ sung — slide 37 không có số liệu cụ thể; ví dụ dưới đây do Claude
soạn.)*

10 email, model cho điểm "xác suất là spam". Class + = spam: có P = 5 spam
và N = 5 không spam. Đã sắp xếp theo score giảm dần:

| Email | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| Score | 0.95 | 0.85 | 0.80 | 0.70 | 0.60 | 0.55 | 0.40 | 0.30 | 0.20 | 0.10 |
| Label | + | + | − | + | + | − | + | − | − | − |

### 4.1. Quét threshold (báo + nếu score ≥ threshold)

| Threshold | Báo + là | TP | FP | TPR = TP/5 | FPR = FP/5 |
|---|---|---|---|---|---|
| > 0.95 | (không ai) | 0 | 0 | 0.0 | 0.0 |
| 0.95 | A | 1 | 0 | 0.2 | 0.0 |
| 0.85 | A–B | 2 | 0 | 0.4 | 0.0 |
| 0.80 | A–C | 2 | 1 | 0.4 | 0.2 |
| 0.70 | A–D | 3 | 1 | 0.6 | 0.2 |
| 0.60 | A–E | 4 | 1 | 0.8 | 0.2 |
| 0.55 | A–F | 4 | 2 | 0.8 | 0.4 |
| 0.40 | A–G | 5 | 2 | 1.0 | 0.4 |
| 0.30 | A–H | 5 | 3 | 1.0 | 0.6 |
| 0.20 | A–I | 5 | 4 | 1.0 | 0.8 |
| 0.10 | A–J | 5 | 5 | 1.0 | 1.0 |

Mỗi dòng là một điểm trên ROC. Đúng như quy tắc 3.3: gặp mẫu + thì TPR
tăng 0.2 (đi lên), gặp mẫu − thì FPR tăng 0.2 (sang phải).

Threshold mặc định 0.5 rơi vào dòng 0.55 (A–F bị báo +): TP = 4, FP = 2,
FN = 1, TN = 3 → TPR = 0.8, FPR = 0.4, Precision = 4/6 ≈ 0.667.

### 4.2. Tính AUC bằng diện tích

Đường ROC là một đường bậc thang. Cộng diện tích các khối chữ nhật dưới
nó theo từng đoạn FPR:

| Đoạn FPR | Chiều cao TPR | Diện tích |
|---|---|---|
| 0.0 → 0.2 | 0.4 | 0.2 × 0.4 = 0.08 |
| 0.2 → 0.4 | 0.8 | 0.2 × 0.8 = 0.16 |
| 0.4 → 1.0 | 1.0 | 0.6 × 1.0 = 0.60 |
| **Tổng** | | **AUC = 0.84** |

### 4.3. Kiểm tra bằng cách đếm cặp (ý nghĩa xác suất)

Có 5 × 5 = 25 cặp (spam, không spam). Đếm số cặp mà spam có score **cao
hơn**:

| Spam | Score | Số email không spam có score thấp hơn |
|---|---|---|
| A | 0.95 | 5 (C, F, H, I, J) |
| B | 0.85 | 5 |
| D | 0.70 | 4 (thua C = 0.80) |
| E | 0.60 | 4 (thua C) |
| G | 0.40 | 3 (thua C, F) |
| **Tổng** | | **21** |

AUC = 21 / 25 = **0.84** — khớp với cách tính diện tích. Nghĩa là: lấy
ngẫu nhiên 1 spam và 1 email thường, 84% khả năng model chấm spam cao hơn.

### 4.4. Chọn threshold theo Youden's J

TPR − FPR lớn nhất là **0.6**, đạt tại threshold 0.60 (TPR 0.8, FPR 0.2)
và 0.40 (TPR 1.0, FPR 0.4). Nếu bỏ sót spam đáng ngại hơn thì chọn 0.40
(bắt hết spam); nếu báo nhầm đáng ngại hơn thì chọn 0.60.

> **EN:** *(Example written by Claude; slide 37 has no numbers.)* 10
> emails with spam scores, 5 spam and 5 not. Sweeping the threshold yields
> 11 (FPR, TPR) points — each positive moves the curve up 0.2, each
> negative moves it right 0.2. At the default 0.5 threshold: TPR = 0.8,
> FPR = 0.4. AUC by area: 0.08 + 0.16 + 0.60 = 0.84. Check by counting
> pairs: in 21 of 25 (spam, non-spam) pairs the spam scores higher →
> 21/25 = 0.84. Youden's J peaks at 0.6 at thresholds 0.60 and 0.40.

## 5. Code

### 5.1. Tự cài đặt ROC và AUC

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
    for yi in y:                             # hạ threshold qua từng mẫu
        if yi == 1: tp += 1                  # mẫu + → đi lên
        else:       fp += 1                  # mẫu − → sang phải
        tpr.append(tp / P)
        fpr.append(fp / N)
    return np.array(fpr), np.array(tpr)

fpr, tpr = roc_points(scores, labels)
auc_area = np.trapezoid(tpr, fpr)            # diện tích dưới đường cong (NumPy ≥ 2.0)
print("AUC (diện tích):", auc_area)          # 0.84

# AUC theo nghĩa xác suất: đếm cặp (+, −) mà + có score cao hơn
pos, neg = scores[labels == 1], scores[labels == 0]
auc_pairs = np.mean([p > n for p in pos for n in neg])
print("AUC (đếm cặp):", auc_pairs)            # 0.84
```

Lưu ý: cách cài đặt trên giả sử không có hai mẫu trùng score. Nếu có, cần
gộp các mẫu cùng score thành một bước (scikit-learn đã xử lý việc này).
Nếu dùng NumPy bản cũ (< 2.0), thay `np.trapezoid` bằng `np.trapz`.

### 5.2. Dùng scikit-learn và vẽ hình

```python
from sklearn.metrics import roc_curve, roc_auc_score
import matplotlib.pyplot as plt

fpr, tpr, thresholds = roc_curve(labels, scores)
print("AUC:", roc_auc_score(labels, scores))     # 0.84

plt.plot(fpr, tpr, marker="o", label="ROC (AUC = 0.84)")
plt.plot([0, 1], [0, 1], "--", label="Random classifier")
plt.scatter([0], [1], marker="*", s=200, label="Perfect classifier")
plt.xlabel("False Positive Rate (1 - Specificity)")
plt.ylabel("True Positive Rate (Sensitivity)")
plt.legend(); plt.show()

# Youden's J: threshold có TPR - FPR lớn nhất
best = (tpr - fpr).argmax()
print("Threshold tốt nhất theo Youden:", thresholds[best])
```

Với model thật, `scores` lấy từ cột xác suất của class +:
`scores = model.predict_proba(X_test)[:, 1]`.

> **EN:** Implement the ROC sweep from scratch (sort by score, step up for
> each positive, right for each negative), compute AUC both as the area
> (`np.trapezoid`; `np.trapz` on NumPy < 2.0) and as the pairwise
> probability, then verify with scikit-learn's `roc_curve` /
> `roc_auc_score` and plot. With a real model, use
> `model.predict_proba(X_test)[:, 1]` as the scores.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** TPR và FPR được tính trên nhóm mẫu nào? Mỗi cái ta muốn cao hay
thấp?
> **Đáp án:** TPR = TP / (TP + FN), tính trên nhóm **+ thật** — muốn
> **cao**. FPR = FP / (FP + TN), tính trên nhóm **− thật** — muốn
> **thấp**. Cả hai đều là "tỉ lệ bị báo +", chỉ khác nhóm.

**Câu 2:** Vì sao đường chéo nối (0, 0) và (1, 1) tương ứng với một model
đoán ngẫu nhiên?
> **Đáp án:** Model ngẫu nhiên không phân biệt được + và −, nên tỉ lệ báo
> + trên nhóm dương thật bằng tỉ lệ báo + trên nhóm âm thật: TPR = FPR. Tập
> hợp các điểm có TPR = FPR chính là đường chéo, và diện tích dưới nó là
> 0.5.

**Câu 3:** Trong ví dụ 10 email, nếu email C (không spam, score 0.80) được
model chấm lại 0.35 thì AUC thay đổi thế nào?
> **Đáp án:** Thứ tự mới: A, B, D, E, F, G, C, H, I, J. Đếm lại số email
> không spam có score thấp hơn mỗi spam: A 5, B 5, D 5, E 5 (cả bốn đều
> cao hơn mọi email thường, vì email thường cao nhất giờ là F = 0.55), G 4
> (thua F, thắng C 0.35, H, I, J). Tổng = 24 → AUC = 24/25 = **0.96**.
> Tăng vì model xếp hạng tốt hơn: mẫu − từng "chen" lên trên ba spam đã bị
> đẩy xuống dưới.

**Câu 4:** Model X có AUC = 0.92, model Y có AUC = 0.85. Có chắc X tốt hơn
Y tại threshold 0.5 không?
> **Đáp án:** Không chắc. AUC tổng hợp trên **mọi** threshold; hai đường
> ROC có thể cắt nhau, nên tại một threshold cụ thể Y vẫn có thể có TPR
> hoặc FPR tốt hơn. AUC cao nói rằng X **xếp hạng** tốt hơn về tổng thể,
> còn hiệu năng tại một điểm vận hành phải xem trực tiếp điểm đó.

**Câu 5:** Một model có AUC = 0.3. Điều đó có nghĩa gì và nên làm gì?
> **Đáp án:** Model xếp hạng **ngược**: thường chấm mẫu − cao hơn mẫu +.
> Đảo dấu dự đoán (dùng 1 − score) sẽ cho AUC = 0.7. Nhưng trước khi đảo,
> nên kiểm tra lỗi trong pipeline — ví dụ đảo nhầm label 0/1 hoặc lấy nhầm
> cột xác suất của class −.

**Câu 6:** Vì sao với dữ liệu rất mất cân bằng (1% là +), ROC/AUC có thể
trông lạc quan hơn thực tế?
> **Đáp án:** Vì FPR chia cho số mẫu − rất lớn: hàng chục, hàng trăm lần
> báo nhầm vẫn chỉ cho FPR nhỏ, nên đường ROC vẫn đẹp. Trong khi Precision
> (chia cho số lần báo +) có thể rất thấp. Lúc đó nên xem thêm
> Precision–Recall curve và Average Precision.

> **EN:**
>
> **Q1:** Over which group of samples are TPR and FPR computed? Do we want
> each high or low?
> > **A:** TPR = TP / (TP + FN), over **actual positives** — want it
> > **high**. FPR = FP / (FP + TN), over **actual negatives** — want it
> > **low**.
>
> **Q2:** Why does the diagonal from (0, 0) to (1, 1) correspond to a
> random classifier?
> > **A:** A random model can't tell + from −, so it flags the same share
> > of each group: TPR = FPR. Those points form the diagonal, with area
> > 0.5 beneath it.
>
> **Q3:** In the 10-email example, if email C (not spam, score 0.80) is
> re-scored to 0.35, how does AUC change?
> > **A:** New counts of lower-scored non-spam per spam: A 5, B 5, D 5,
> > E 5, G 4 → 24 → AUC = 24/25 = **0.96**. Better ranking, higher AUC.
>
> **Q4:** Model X has AUC 0.92, model Y 0.85. Is X definitely better at
> threshold 0.5?
> > **A:** No. AUC summarises **all** thresholds; the ROC curves can cross,
> > so Y may still be better at a specific operating point.
>
> **Q5:** A model has AUC = 0.3. What does it mean and what should you do?
> > **A:** It ranks **backwards**. Using 1 − score gives AUC 0.7, but first
> > check the pipeline for bugs such as flipped labels or using the wrong
> > probability column.
>
> **Q6:** Why can ROC/AUC look overly optimistic on heavily imbalanced data
> (1% positive)?
> > **A:** FPR divides by the huge number of negatives, so many false
> > alarms still give a small FPR, while Precision may be very low. Check
> > the Precision–Recall curve and Average Precision as well.
