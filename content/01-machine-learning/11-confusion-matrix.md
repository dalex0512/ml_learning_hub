---
title: Confusion Matrix (Ma trận nhầm lẫn)
order: 11
description: "Xếp từng mẫu vào bốn ô TP, FP, FN, TN theo slide 27 đến 32, đọc đúng thứ tự hàng cột và phân biệt báo động giả với bỏ sót."
slides: 27-32
needs: [classification-vs-regression]
tags: [confusion-matrix, TP, FP, FN, TN]
---

## "Đúng 4 trên 7" che mất điều gì?

:::intro Mục tiêu bài này
- Đặt prediction cạnh label và xếp từng mẫu vào đúng **một trong bốn ô** (TP, FP, FN, TN) theo slide 27 đến 32.
- Đọc tên ô bằng quy tắc hai chữ, không học thuộc; hiểu **lớp dương** là lớp ta muốn phát hiện, không phải lớp "tốt".
- Phân biệt **báo động giả (lỗi loại I)** với **bỏ sót (lỗi loại II)** và biết vì sao hai lỗi có giá khác nhau.
:::

[[slide:27]] cho bảy bức ảnh chó và mèo đi qua một model. Model sinh ra một hàng **prediction** (khung đỏ), và ta đặt nó ngay trên hàng **label** (sự thật, khung xanh) để so từng cặp:

```
prediction:  dog  cat  dog  dog  cat  cat  dog
label:       dog  dog  cat  dog  cat  dog  dog
```

Model đúng ở các cột 1, 4, 5, 7: tức **4 trên 7**. Nghe ổn, nhưng ba lần sai **không giống nhau**: ở cột 3 model gọi con mèo là chó; ở cột 2 và 6 nó gọi con chó là mèo. Hai kiểu sai này có hậu quả khác nhau, mà một con số "4/7" không phân biệt được. Muốn thấy, ta cần một bảng đếm. Hãy thử tự xếp: chọn một ô cho từng ảnh, rồi đổi "lớp dương" để thấy tên ô đổi theo.

:::widget confusion-sorter
:::

:::slides 27-32 | Slide 27–32: dog vs cat, lớp dương, bốn ô của ma trận, đếm TP, FP, FN, TN
:::

## Chọn lớp dương và đọc tên bốn ô

Slide 28 quy ước: **Class +** là class ta quan tâm (ví dụ `dog`), **Class −** là các class còn lại (ví dụ `cat`). "Dương" **không** có nghĩa là "tốt": trong y tế lớp dương là "có bệnh", trong lọc thư rác là "spam". **Lớp dương là lớp ta muốn phát hiện.**

Ma trận trong slide xếp **hàng là Actual class (sự thật)**, **cột là Predicted class (dự đoán)**. Mỗi ô có tên gồm **hai chữ** với hai nghĩa riêng:

- **Chữ sau (Positive hoặc Negative):** model **đã đoán** gì.
- **Chữ trước (True hoặc False):** lời đoán đó **đúng hay sai**.

| Tên | Model đoán | Đoán đúng không? | Ví dụ (dog là dương) |
|---|---|---|---|
| **TP** (True Positive) | Dương | đúng | ảnh chó, model nói chó |
| **FP** (False Positive) | Dương | sai | ảnh mèo, model nói chó |
| **FN** (False Negative) | Âm | sai | ảnh chó, model nói mèo |
| **TN** (True Negative) | Âm | đúng | ảnh mèo, model nói mèo |

Hai ô đường chéo (TP, TN, màu xanh trên slide) là đoán đúng; hai ô còn lại (FP, FN, màu đỏ) là đoán sai.

## Đếm từng ảnh

Quy trình đếm chỉ có một quy tắc: với mỗi mẫu, nhìn cặp (label, prediction) và bỏ vào **đúng một ô**.

:::steps
**TP (slide 29):** label `dog` và prediction `dog`: các cột **1, 4, 7**. **TP = 3.**
@step
**FP (slide 30):** label `cat` nhưng prediction `dog` (báo nhầm là chó): cột **3**. **FP = 1.**
@step
**FN (slide 31):** label `dog` nhưng prediction `cat` (bỏ sót con chó): cột **2 và 6**. **FN = 2.**
@step
**TN (slide 32):** label `cat` và prediction `cat`: cột **5**. **TN = 1.**
@step
**Kiểm tra:** 3 + 1 + 2 + 1 = **7** = tổng số mẫu. Mỗi mẫu rơi vào đúng một ô nên bốn ô luôn cộng lại bằng tổng.
:::

Ma trận hoàn chỉnh:

| | Đoán dog (+) | Đoán cat (−) | Tổng hàng |
|---|---|---|---|
| **Thật dog (+)** | TP = 3 | FN = 2 | 5 chó thật |
| **Thật cat (−)** | FP = 1 | TN = 1 | 2 mèo thật |
| **Tổng cột** | 4 lần đoán chó | 3 lần đoán mèo | **7** |

:::ck
Nếu ta đổi lớp dương từ **dog** sang **cat**, dữ liệu và model không đổi. Bốn con số TP, FP, FN, TN có đổi không? Ảnh số 3 (thật là cat, model nói dog) rơi vào ô nào?
@answer
**Các con số đổi vai** dù dữ liệu y nguyên: khi dương là cat thì TP = 1 (ảnh 5), FP = 2 (ảnh 2 và 6, model nói cat mà thật là dog), FN = 1 (ảnh 3), TN = 3. Ảnh số 3 (thật cat, model nói dog) thành **FN** (thật Dương nhưng model đoán Âm), thay vì FP như lúc dương là dog. Vì vậy luôn phải nói rõ lớp dương là lớp nào.
:::

## Hai lỗi khác nhau: báo động giả và bỏ sót

Slide 29 đến 32 gắn hai ô lỗi với hai tên từ thống kê:

- **FP = lỗi loại I (Type I error): báo động giả.** Hệ thống kêu lên nhưng không có gì.
- **FN = lỗi loại II (Type II error): bỏ sót.** Có chuyện thật nhưng hệ thống im lặng.

Mẹo nhớ qua chuyện cậu bé chăn cừu: lần đầu cậu hô "sói đến!" khi không có sói là lỗi loại I; lần sau sói đến thật mà dân làng không tin là lỗi loại II. Hai lỗi **không đắt như nhau**: bỏ sót ung thư (FN) và báo nhầm ung thư (FP) có hậu quả rất khác; thư công việc bị đẩy vào mục spam (FP) khác với một thư quảng cáo lọt vào hộp thư (FN). Vì vậy một con số accuracy không đủ; [[bài:classification-metrics]] dùng chính bốn ô này để trả lời "ta quan tâm lỗi nào".

## Bốn tổng là nền của mọi metric

Từ ma trận, bốn **tổng hàng và tổng cột** sẽ là mẫu số của các metric sau:

- **TP + FN** = số mẫu **thật sự** Dương (hàng trên): 3 + 2 = 5 chó.
- **FP + TN** = số mẫu **thật sự** Âm (hàng dưới): 1 + 1 = 2 mèo.
- **TP + FP** = số lần model **đoán** Dương (cột trái): 3 + 1 = 4.
- **FN + TN** = số lần model **đoán** Âm (cột phải): 2 + 1 = 3.

## Bẫy: scikit-learn đặt TP ở góc dưới phải

Slide xếp lớp dương lên **trước** (góc trên trái). Nhưng `confusion_matrix` của scikit-learn sắp lớp theo thứ tự sắp xếp (0 trước 1). Với nhãn 0/1 (dog = 1), ví dụ trên cho `[[1, 1], [2, 3]]`, tức:

```
[[TN, FP],
 [FN, TP]]
```

TP nằm ở góc **dưới phải**, ngược với slide. Cách an toàn: tách đúng thứ tự bằng `tn, fp, fn, tp = cm.ravel()`. Bảng của Project, `[[79, 20], [18, 37]]`, đọc đúng là TN = 79, FP = 20, FN = 18, TP = 37.

:::ck
Một đồng nghiệp in `confusion_matrix(y_test, y_pred)` ra `[[50, 5], [10, 35]]` với nhãn 0/1 (1 là bệnh). Có bao nhiêu người bệnh bị **bỏ sót**?
@answer
**10 người.** Theo thứ tự `[[TN, FP], [FN, TP]]`, FN là phần tử ở hàng 2, cột 1 = 10. Chỉ có 35 người bệnh được bắt đúng (TP). Nếu đọc nhầm theo thứ tự trong slide (TP ở góc trên trái), bạn sẽ nhầm 50 thành số người bệnh được bắt.
:::

## Tự đếm bằng code

Cùng bảy ảnh chó/mèo (class dương là `dog`). Ba cách, cùng kết quả TP = 3, FP = 1, FN = 2, TN = 1:

```python
# 1) Python thuần
pred  = ["dog", "cat", "dog", "dog", "cat", "cat", "dog"]
label = ["dog", "dog", "cat", "dog", "cat", "dog", "dog"]
positive = "dog"
tp = fp = fn = tn = 0
for p, y in zip(pred, label):
    if   y == positive and p == positive: tp += 1
    elif y != positive and p == positive: fp += 1
    elif y == positive and p != positive: fn += 1
    else:                                 tn += 1
print(f"TP={tp}  FP={fp}  FN={fn}  TN={tn}  All={tp+fp+fn+tn}")   # TP=3  FP=1  FN=2  TN=1  All=7

# 2) NumPy (nhanh hơn với dữ liệu lớn)
import numpy as np
p_pos = np.array(pred)  == "dog"     # model đoán +
y_pos = np.array(label) == "dog"     # thật sự là +
print(np.sum(y_pos & p_pos), np.sum(~y_pos & p_pos), np.sum(y_pos & ~p_pos), np.sum(~y_pos & ~p_pos))  # 3 1 2 1

# 3) scikit-learn: chú ý thứ tự hàng/cột
from sklearn.metrics import confusion_matrix
print(confusion_matrix(label, pred, labels=["dog", "cat"]))
# [[3 2]    hàng Actual dog: TP=3, FN=2
#  [1 1]]   hàng Actual cat: FP=1, TN=1
print(confusion_matrix(label, pred))   # KHÔNG chỉ định labels: sắp theo a-z, cat đứng trước dog
# [[1 1]    Actual cat
#  [2 3]]   Actual dog: TP nằm ở góc dưới phải
```

## Những hiểu sai thường gặp

- **"Dương là tốt."** Không: dương là lớp ta muốn phát hiện (bệnh, spam, gian lận).
- **"FP và FN chỉ là hai cái tên."** Chúng là hai kiểu sai với **chi phí khác nhau**; chọn metric là chọn quan tâm kiểu nào.
- **"Ma trận luôn có TP ở trên trái."** Chỉ trong slide; trong scikit-learn với nhãn 0/1 TP ở dưới phải.
- **"Chỉ cần accuracy là đủ."** Accuracy chỉ nhìn đường chéo (TP + TN) và che mất hai ô lỗi.

:::card Confusion Matrix
- **Hàng = sự thật, cột = dự đoán.** Mỗi mẫu rơi vào đúng một ô; bốn ô cộng lại bằng tổng số mẫu (ví dụ 3 + 1 + 2 + 1 = 7).
- **Tên ô:** chữ sau = model đoán gì (Positive/Negative); chữ trước = đúng hay sai (True/False).
- **Lớp dương** là lớp ta muốn phát hiện, không phải lớp "tốt"; đổi lớp dương thì các ô đổi vai.
- **FP = báo động giả (lỗi loại I). FN = bỏ sót (lỗi loại II).** Hai lỗi có giá khác nhau.
- **TP + FN** là số mẫu thật sự Dương; **TP + FP** là số lần đoán Dương: mẫu số của precision và recall.
- **Bẫy sklearn:** với nhãn 0/1 ma trận là `[[TN, FP], [FN, TP]]`, dùng `.ravel()` theo đúng thứ tự.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Giải thích tên "False Negative" mà không cần học thuộc.
A: Chữ sau "Negative" = model đã đoán class −. Chữ trước
"False" = lời đoán đó sai. Đoán − mà sai nghĩa là mẫu thật ra là +.
Vậy FN = mẫu dương thật bị model bỏ sót.
EN: Decode the name "False Negative" without memorising it.
**A:** "Negative" = the model predicted the negative class. "False" =
> that prediction was wrong. So the sample was actually positive — an
> FN is a positive case the model missed.

Q: Trong ví dụ dog/cat, mẫu 3 (label `cat`, prediction `dog`) rơi
vào ô nào? Nếu đổi class + thành `cat` thì sao?
A: Với dog là +: model đoán + (dog) nhưng sai → **FP**. Với cat
là +: model đoán − (dog) nhưng mẫu thật là + (cat) → **FN**. Cùng một
mẫu nhưng ô thay đổi theo lựa chọn class +.
EN: In the dog/cat example, which cell does sample 3 (label `cat`,
prediction `dog`) fall into? What if `cat` is the positive class?
**A:** With dog as +: predicted + but wrong → **FP**. With cat as +:
> predicted − (dog) but actually + (cat) → **FN**. Same sample,
> different cell depending on the positive class.

Q: Một hệ thống báo cháy kêu lúc không có cháy. Đây là Type I hay
Type II error? Nếu có cháy thật mà không kêu thì sao? (Class + = có cháy.)
A: Kêu khi không có cháy = báo động giả = **FP = Type I
error**. Có cháy mà không kêu = bỏ sót = **FN = Type II error**. Với
báo cháy, Type II nguy hiểm hơn nhiều.
EN: A fire alarm goes off with no fire. Type I or Type II error?
What if there's a real fire and it stays silent? (Positive = fire.)
**A:** Alarm without fire = false alarm = **FP = Type I**. Real fire,
> no alarm = miss = **FN = Type II** — far more dangerous here.

Q: Một model phân loại 200 email có TP = 40, FN = 10, FP = 5.
Tính TN, số spam thật, và số lần model báo spam (class + = spam).
A: TN = 200 − 40 − 10 − 5 = **145**. Spam thật = TP + FN =
**50**. Số lần báo spam = TP + FP = **45**.
EN: A model classifying 200 emails has TP = 40, FN = 10, FP = 5.
Find TN, the number of actual spam emails, and the number flagged as
spam.
**A:** TN = 200 − 40 − 10 − 5 = **145**. Actual spam = TP + FN =
> **50**. Flagged as spam = TP + FP = **45**.

Q: Chạy `confusion_matrix(y_true, y_pred)` với label 0/1 (1 là
class +) ra `[[80, 5], [12, 3]]`. TP bằng bao nhiêu?
A: scikit-learn sắp 0 trước 1, nên bố cục là `[[TN, FP], [FN,
TP]]`. Vậy **TP = 3** (không phải 80). TN = 80, FP = 5, FN = 12. Đây là
model rất tệ trong việc bắt class + dù trông "đúng nhiều": nó bỏ sót 12
trên 15 mẫu dương.
EN: `confusion_matrix(y_true, y_pred)` with 0/1 labels (1 =
positive) returns `[[80, 5], [12, 3]]`. What is TP?
**A:** scikit-learn sorts 0 before 1, so the layout is `[[TN, FP],
> [FN, TP]]` → **TP = 3**, not 80. The model misses 12 of 15 positives.
@tier B | Phỏng vấn lý thuyết
Q: Class dương có nghĩa là kết quả tốt không?
A: Không. Đó là class cần quan tâm phát hiện, như fraud hoặc spam. Ghi rõ class dương vì cùng prediction có thể thành FP hay FN khi đổi quy ước.
EN: The positive class is the class of interest, not necessarily a desirable outcome.
Q: Vì sao accuracy không thay được confusion matrix?
A: Accuracy gộp mọi sai vào một tổng. Ma trận cho biết sai là báo động giả hay bỏ sót, cần thiết khi chi phí hai loại khác nhau. Cùng accuracy có thể có phân bố FP/FN rất khác.
EN: A confusion matrix separates false alarms from misses, which accuracy hides.
Q: Cách kiểm tra ma trận đếm có hợp lệ?
A: Tổng bốn ô phải bằng số mẫu; tổng hàng phải khớp số nhãn thật từng class, tổng cột khớp số prediction từng class. Kiểm tra cả thứ tự class trước khi gán tên ô.
EN: Check total count, row supports, column prediction counts, and explicit class ordering.
Q: Liên hệ Type I/II error có giả định gì?
A: Với giả thuyết nền là class âm, FP tương ứng bác bỏ nhầm giả thuyết nền (Type I), FN tương ứng bỏ sót class dương (Type II). Luôn nêu quy ước thay vì học vị trí ô.
EN: With the negative class as the null, false positives correspond to Type I errors and false negatives to Type II errors.
@tier C | Tình huống doanh nghiệp
Q: Bộ lọc spam đẩy thư hợp đồng vào rác. Đây là ô nào và làm gì?
A: Quy ước spam là dương thì đó là FP. Xem các FP theo nhóm thư, kiểm tra nhãn và ngưỡng; thử giảm báo động giả trên validation rồi đánh giá phần spam lọt tăng thêm. Quyết định cần chi phí hai loại lỗi *(bổ sung)*.
WANT: Nêu class dương, xác định lỗi và đánh đổi trước khi sửa.
Q: Hai dashboard cùng dữ liệu nhưng TP trái ngược. Debug thế nào?
A: Kiểm tra label mapping, thứ tự class và hàng/cột; đếm lại vài cặp label–prediction cụ thể. Chốt một quy ước chung và ghi trên dashboard. Không so giá trị ô khi chưa đồng nhất định nghĩa *(bổ sung)*.
WANT: Biết lỗi báo cáo có thể đến từ quy ước chứ không phải model.
Q: Hệ thống cảnh báo lỗi máy bỏ sót nhiều sự cố hiếm. Chỉ tăng số cảnh báo được không?
A: Trước hết đếm FN/FP theo thời gian và kiểm tra nhãn sự cố. Thử ngưỡng để tăng bắt sự cố trên validation, đồng thời đo tải xử lý cảnh báo giả và thời gian phát hiện. Chấp nhận nhiều FP hơn chỉ khi vận hành chịu được *(bổ sung)*.
WANT: Nối ma trận với năng lực vận hành và chi phí thay vì tối đa một ô.
:::

## Nối sang bài sau

:::next
Bốn ô đã đếm đủ nhưng cần tỷ lệ để so sánh model. [[bài:classification-metrics]] dùng chúng tính Accuracy, Precision, Recall và F1 theo câu hỏi cần trả lời.
:::
