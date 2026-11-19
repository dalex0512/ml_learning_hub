---
title: Confusion Matrix (Ma trận nhầm lẫn)
order: 11
description: "Xếp từng mẫu vào bốn ô TP, FP, FN, TN, đọc đúng thứ tự hàng cột và phân biệt báo động giả với bỏ sót."
slides: 27-32
needs: [classification-vs-regression]
tags: [confusion-matrix, TP, FP, FN, TN]
---

## "Đúng 4 trên 7" che mất điều gì?

:::intro Mục tiêu bài này
- Đặt prediction cạnh label và xếp từng mẫu vào đúng **một trong bốn ô** (TP, FP, FN, TN).
- Đọc tên ô bằng quy tắc hai chữ, không học thuộc; hiểu "lớp dương" là lớp ta muốn phát hiện.
- Phân biệt **báo động giả** và **bỏ sót**, và biết vì sao hai lỗi này có giá khác nhau.
:::

[[slide:27]] cho bảy bức ảnh chó và mèo đi qua một model. Model sinh ra một hàng **prediction**, và ta đặt nó ngay trên hàng **label** (sự thật) để so từng cặp:

```
prediction:  dog  cat  dog  dog  cat  cat  dog
label:       dog  dog  cat  dog  cat  dog  dog
```

Model đúng ở các cột 1, 4, 5, 7: tức **4 trên 7**. Nghe ổn, nhưng ba lần sai **không giống nhau**: có lần model gọi con mèo là chó, có hai lần nó bỏ sót con chó. Muốn phân biệt hai kiểu sai đó, ta cần một bảng đếm thay vì một con số duy nhất. Hãy thử tự xếp: chọn một ô cho từng ảnh, và đổi "lớp dương" để thấy tên ô đổi theo.

:::widget confusion-sorter
:::

:::slides 27-32 | Slide 27–32: dog vs cat, lớp dương, bốn ô của ma trận
:::

## Đọc tên bốn ô: chữ sau là model đoán gì, chữ trước là đúng hay sai

Một ô có tên gồm **hai chữ**, và mỗi chữ có một nghĩa riêng:

- **Chữ sau (Positive hoặc Negative):** model **đã đoán** gì.
- **Chữ trước (True hoặc False):** lời đoán đó **đúng hay sai**.

| Tên | Model đoán | Đoán đúng không? | Ví dụ (dog là dương) |
|---|---|---|---|
| **TP** (True Positive) | Dương | đúng | ảnh chó, model nói chó |
| **FP** (False Positive) | Dương | sai | ảnh mèo, model nói chó |
| **FN** (False Negative) | Âm | sai | ảnh chó, model nói mèo |
| **TN** (True Negative) | Âm | đúng | ảnh mèo, model nói mèo |

Ma trận xếp **hàng là sự thật**, **cột là dự đoán**:

| | Đoán dog (+) | Đoán cat (−) | Tổng hàng |
|---|---|---|---|
| **Thật dog (+)** | TP = 3 | FN = 2 | 5 chó thật |
| **Thật cat (−)** | FP = 1 | TN = 1 | 2 mèo thật |
| **Tổng cột** | 4 lần đoán chó | 3 lần đoán mèo | **7** |

"Dương" **không** có nghĩa là "tốt". **Lớp dương là lớp ta muốn phát hiện**: trong y tế là "có bệnh", trong lọc thư rác là "spam". Với bài nhiều lớp, ta chọn một lớp làm dương và gộp mọi lớp còn lại thành âm.

:::ck
Nếu ta đổi lớp dương từ **dog** sang **cat**, dữ liệu và model không đổi. Ba con số TP, FP, FN, TN có đổi không? Ảnh số 3 (thật là cat, model nói dog) rơi vào ô nào?
@answer
**Các con số đổi vai** dù dữ liệu y nguyên. Khi dương là cat: ảnh số 3 (thật cat, model nói dog) thành **FN** (thật Dương nhưng model đoán Âm), thay vì FP như lúc dương là dog. Đây là lý do luôn phải nói rõ lớp dương là lớp nào.
:::

## Hai lỗi khác nhau: báo động giả và bỏ sót

Hai ô đường chéo (TP, TN) là đoán đúng. Hai ô còn lại là hai loại sai mà thống kê gọi tên riêng:

- **FP là lỗi loại I: báo động giả.** Hệ thống kêu lên nhưng không có gì.
- **FN là lỗi loại II: bỏ sót.** Có chuyện thật nhưng hệ thống im lặng.

Mẹo nhớ qua chuyện cậu bé chăn cừu: lần đầu cậu hô "sói đến!" khi không có sói thì đó là lỗi loại I; lần sau sói đến thật mà dân làng không tin thì đó là lỗi loại II. Hai lỗi này **không đắt như nhau**: bỏ sót ung thư (FN) và báo nhầm ung thư (FP) có hậu quả rất khác. Vì vậy một con số accuracy không đủ; [[bài:classification-metrics]] sẽ dùng chính bốn ô này để trả lời "ta quan tâm lỗi nào".

## Bốn tổng là nền của mọi metric

Mỗi mẫu rơi vào **đúng một** ô, nên TP + FP + FN + TN luôn bằng tổng số mẫu. Bốn **tổng hàng và tổng cột** sẽ là mẫu số của các metric sau:

- **TP + FN** = số mẫu **thật sự** Dương (tổng hàng trên): 3 + 2 = 5 chó.
- **FP + TN** = số mẫu **thật sự** Âm (tổng hàng dưới): 1 + 1 = 2 mèo.
- **TP + FP** = số lần model **đoán** Dương (tổng cột trái): 3 + 1 = 4.
- **FN + TN** = số lần model **đoán** Âm (tổng cột phải): 2 + 1 = 3.

## Bẫy: scikit-learn đặt TP ở góc dưới phải

Slide xếp lớp dương lên **trước**. Nhưng `confusion_matrix` của scikit-learn sắp lớp theo thứ tự sắp xếp (0 trước 1). Với nhãn 0/1, kết quả là:

```
[[TN, FP],
 [FN, TP]]
```

tức TP nằm ở góc **dưới phải**, ngược với slide. Cách an toàn: tách đúng thứ tự bằng `tn, fp, fn, tp = cm.ravel()`. Bảng của Project, `[[79, 20], [18, 37]]`, đọc đúng là TN = 79, FP = 20, FN = 18, TP = 37.

:::ck
Một đồng nghiệp in `confusion_matrix(y_test, y_pred)` ra `[[50, 5], [10, 35]]` với nhãn 0/1 (1 là bệnh). Có bao nhiêu người bệnh bị **bỏ sót**?
@answer
**10 người.** Theo thứ tự `[[TN, FP], [FN, TP]]`, FN là phần tử ở hàng 2, cột 1 = 10. Chỉ có 35 người bệnh được bắt đúng (TP). Nếu đọc nhầm theo thứ tự trong slide, bạn sẽ nhầm 50 thành TP.
:::

:::card Confusion Matrix
- **Hàng = sự thật, cột = dự đoán.** Mỗi mẫu rơi vào đúng một ô; bốn ô cộng lại bằng tổng số mẫu.
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

## [sâu] Đặt prediction cạnh label

[[slide:27]] đặt bài toán: **Classification: dog vs cat**. Bảy bức ảnh đi qua
model, model sinh ra một hàng **prediction** (khung đỏ), và ta đặt nó
**ngay trên** hàng **label** (khung xanh) để so từng cặp:

```
ảnh      →  [ model ]  →  prediction:  dog  cat  dog  dog  cat  cat  dog
                                        ↕    ↕    ↕    ↕    ↕    ↕    ↕
                           label:      dog  dog  cat  dog  cat  dog  dog
```

Đây chính là pipeline của [[bài:model-training-pipeline]] (Model Training): prediction được so với
label. Điểm khác:

- Khi **train**, phép so sánh cho ra **loss** để model tự sửa ([[bài:loss-function]]).
- Khi **đánh giá** (trên tập Validation/Test — [[bài:train-test-split]], 08, 09), phép so
  sánh cho ra **metric** để *con người* biết model tốt đến đâu.

Confusion Matrix là bước đầu tiên của việc đánh giá model Classification:
mọi metric ở [[bài:classification-metrics]] đến [[bài:roc-auc]] (Accuracy, Precision, Recall, F1, ROC/AUC) đều
được **tính ra từ 4 con số** của bảng này.

> **EN:** [[slide:27]] sets up **Classification: dog vs cat**. Seven images
> go through the model, producing a row of **predictions** (red), which
> is lined up **directly against** the row of **labels** (green) for a
> pair-by-pair comparison — the same comparison as in lesson 05. During
> **training**, that comparison yields a **loss** the model uses to
> correct itself; during **evaluation** (on Validation/Test data), it
> yields **metrics** that tell *us* how good the model is. Every metric in
> lessons 12–13 is computed from the 4 numbers in this matrix.

## [sâu] Chọn class dương (+) và class âm (−)

[[slide:28]] ghi rõ quy ước:

- **Class +**: class ta quan tâm, ví dụ `dog`.
- **Class −**: class (hoặc các class) còn lại, ví dụ `cat`.

"Dương" **không** có nghĩa là "tốt". Trong y tế, class + thường là "có
bệnh"; trong lọc thư rác, class + là "spam". Class + là class ta **muốn
phát hiện**. Lưu ý chữ "class(es)" trong slide: với bài nhiều class, ta
vẫn có thể chọn 1 class làm + và **gộp tất cả class còn lại** thành −.

> **EN:** [[slide:28]]'s convention: **Class +** is the class we care about
> (e.g. `dog`); **Class −** is the remaining class(es) (e.g. `cat`).
> "Positive" does **not** mean "good" — in medicine the positive class is
> usually "has the disease", in spam filtering it's "spam". It's the class
> we **want to detect**. Note the "(es)": with many classes, we can pick
> one as + and lump all the others into −.

## [sâu] Bốn ô của ma trận

Ma trận trong slide: **hàng = Actual class (label thật)**, **cột =
Predicted class (dự đoán)**, class + đứng trước:

|  | **Predicted +** | **Predicted −** |
|---|---|---|
| **Actual +** | **TP** — True Positive | **FN** — False Negative (Type II error) |
| **Actual −** | **FP** — False Positive (Type I error) | **TN** — True Negative |

Cách đọc tên không cần học thuộc: tên gồm **2 phần**.

- **Chữ sau (Positive / Negative)** = model **đã đoán** gì.
- **Chữ trước (True / False)** = lời đoán đó **đúng hay sai**.

| Tên | Model đoán | Đoán đúng? | Ví dụ dog/cat (dog là +) |
|---|---|---|---|
| TP | + | đúng | ảnh chó, model nói chó |
| FP | + | sai | ảnh mèo, model nói chó |
| FN | − | sai | ảnh chó, model nói mèo |
| TN | − | đúng | ảnh mèo, model nói mèo |

Hai ô **đường chéo chính** (TP, TN — màu xanh trong slide) là đoán đúng;
hai ô còn lại (FP, FN — màu đỏ) là đoán sai.

> **EN:** In the slide's matrix, **rows = actual class**, **columns =
> predicted class**, positive first. The names decode in two parts: the
> **second word** (Positive/Negative) is what the model **predicted**; the
> **first word** (True/False) is whether that prediction was **correct**.
> TP: predicted +, correct. FP: predicted +, wrong. FN: predicted −,
> wrong. TN: predicted −, correct. The main diagonal (TP, TN — green) are
> correct predictions; the off-diagonal cells (FP, FN — red) are errors.

## [sâu] Type I error và Type II error

Slide ghi thêm hai tên gọi đến từ thống kê:

- **FP = Type I error (lỗi loại I)** — "báo động giả": hệ thống kêu lên
  nhưng không có gì cả.
- **FN = Type II error (lỗi loại II)** — "bỏ sót": có chuyện thật nhưng hệ
  thống im lặng.

*(Bổ sung — không có trong slide)* Mẹo nhớ hay dùng: chuyện cậu bé chăn
cừu. Lần đầu cậu hô "sói đến!" khi không có sói → **Type I** (FP). Lần sau
sói đến thật mà dân làng không tin, coi như "không có sói" → **Type II**
(FN).

> **EN:** The slide also labels the errors with their statistics names:
> **FP = Type I error** ("false alarm" — the system raises an alert but
> nothing is there) and **FN = Type II error** ("miss" — something real
> happens and the system stays silent). *(Supplementary)* Mnemonic: the
> boy who cried wolf — crying "wolf!" with no wolf is Type I; the real
> wolf arriving while the villagers believe there's none is Type II.

## [sâu] Quy trình đếm

Với mỗi mẫu, nhìn cặp (label, prediction) và bỏ vào đúng 1 ô:

```
label = +  và  prediction = +   →  TP
label = −  và  prediction = +   →  FP
label = +  và  prediction = −   →  FN
label = −  và  prediction = −   →  TN
```

Mỗi mẫu rơi vào **đúng một** ô, nên luôn có **TP + FP + FN + TN = tổng số
mẫu (All)**. Ngoài ra:

- **TP + FN** = số mẫu **thật sự** là + (tổng hàng trên)
- **FP + TN** = số mẫu **thật sự** là − (tổng hàng dưới)
- **TP + FP** = số lần model **đoán** + (tổng cột trái)
- **FN + TN** = số lần model **đoán** − (tổng cột phải)

Bốn tổng này sẽ là mẫu số của các metric ở [[bài:classification-metrics]], nên hãy nắm chắc chúng.

> **EN:** For each sample, look at the (label, prediction) pair and drop
> it into exactly one cell. Hence **TP + FP + FN + TN = total samples**.
> Also: TP + FN = actual positives (top row); FP + TN = actual negatives
> (bottom row); TP + FP = predicted positives (left column); FN + TN =
> predicted negatives (right column). These four totals become the
> denominators of the metrics in lesson 12.

## [sâu] Bẫy: thứ tự hàng/cột trong scikit-learn (Bổ sung — không có trong slide)

Slide xếp class + lên **trước**. Nhưng hàm `confusion_matrix` của
scikit-learn sắp class theo **thứ tự sắp xếp** (0 trước 1, chữ cái a→z).
Với label 0/1, kết quả là:

```
[[TN, FP],
 [FN, TP]]
```

tức là **ngược** với slide: TP nằm ở góc **dưới phải**. Đọc nhầm vị trí
là lỗi rất phổ biến. Cách an toàn: luôn truyền tham số `labels=[...]` để
tự chỉ định thứ tự, hoặc dùng `.ravel()` theo đúng thứ tự
`tn, fp, fn, tp`.

> **EN:** *(Supplementary)* The slide puts the positive class **first**,
> but scikit-learn's `confusion_matrix` orders classes by **sorted
> order**, so with 0/1 labels you get `[[TN, FP], [FN, TP]]` — TP ends up
> in the **bottom-right**. Misreading this is a very common bug. Pass
> `labels=[...]` explicitly, or unpack with `.ravel()` as
> `tn, fp, fn, tp`.

## [sâu] Đếm từng ảnh dog/cat

Đây chính là ví dụ của [[slide:28-32]]. Class + = `dog`, class − = `cat`.

| Mẫu | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Prediction | dog | cat | dog | dog | cat | cat | dog |
| Label | dog | dog | cat | dog | cat | dog | dog |
| Kết quả | **TP** | **FN** | **FP** | **TP** | **TN** | **FN** | **TP** |

Giải thích từng ô (slide khoanh màu theo đúng thứ tự này):

- **TP ([[slide:29]])**: mẫu 1, 4, 7 — label `dog`, đoán `dog`. → **TP = 3**
- **FP ([[slide:30]])**: mẫu 3 — label `cat` nhưng đoán `dog` (báo nhầm là
  chó). → **FP = 1**
- **FN ([[slide:31]])**: mẫu 2, 6 — label `dog` nhưng đoán `cat` (bỏ sót chó).
  → **FN = 2**
- **TN ([[slide:32]])**: mẫu 5 — label `cat`, đoán `cat`. → **TN = 1**

Ma trận hoàn chỉnh:

|  | Predicted dog (+) | Predicted cat (−) | Tổng hàng |
|---|---|---|---|
| **Actual dog (+)** | TP = 3 | FN = 2 | 5 chó thật |
| **Actual cat (−)** | FP = 1 | TN = 1 | 2 mèo thật |
| **Tổng cột** | 4 lần đoán chó | 3 lần đoán mèo | **All = 7** |

Kiểm tra: 3 + 1 + 2 + 1 = 7 ✓. Model đoán đúng 3 + 1 = 4 mẫu, sai
1 + 2 = 3 mẫu.

## [sâu] Nếu đổi class + thành cat thì sao? (Bổ sung)

Không có dữ liệu nào thay đổi, nhưng **các ô đổi vai**:

|  | Predicted cat (+) | Predicted dog (−) |
|---|---|---|
| **Actual cat (+)** | TP = 1 (mẫu 5) | FN = 1 (mẫu 3) |
| **Actual dog (−)** | FP = 2 (mẫu 2, 6) | TN = 3 (mẫu 1, 4, 7) |

FN của góc nhìn "dog" (mẫu 2, 6) trở thành FP của góc nhìn "cat". Nghĩa
là: **TP/FP/FN/TN không phải thuộc tính cố định của một mẫu** — nó phụ
thuộc vào việc ta chọn class nào là +. Đây là lý do mọi báo cáo metric
phải ghi rõ class + là gì.

> **EN:** This is the [[slide:28-32]] example, with `dog` as positive. TP:
> samples 1, 4, 7 → 3. FP: sample 3 (a cat predicted as dog) → 1. FN:
> samples 2, 6 (dogs predicted as cat) → 2. TN: sample 5 → 1. Check:
> 3 + 1 + 2 + 1 = 7. *(Supplementary)* If `cat` is chosen as positive
> instead, nothing in the data changes but the cells swap roles — the
> dog-view FNs (samples 2, 6) become cat-view FPs. TP/FP/FN/TN are **not**
> fixed properties of a sample; they depend on which class is positive,
> which is why every metric report must state the positive class.

## [sâu] Tự đếm bằng Python thuần

```python
pred  = ["dog", "cat", "dog", "dog", "cat", "cat", "dog"]
label = ["dog", "dog", "cat", "dog", "cat", "dog", "dog"]
positive = "dog"

tp = fp = fn = tn = 0
for p, y in zip(pred, label):
    if   y == positive and p == positive: tp += 1
    elif y != positive and p == positive: fp += 1
    elif y == positive and p != positive: fn += 1
    else:                                 tn += 1

print(f"TP={tp}  FP={fp}  FN={fn}  TN={tn}  All={tp+fp+fn+tn}")
# TP=3  FP=1  FN=2  TN=1  All=7
```

## [sâu] Dùng NumPy (nhanh hơn với dữ liệu lớn)

```python
import numpy as np

pred  = np.array(["dog", "cat", "dog", "dog", "cat", "cat", "dog"])
label = np.array(["dog", "dog", "cat", "dog", "cat", "dog", "dog"])

p_pos = pred  == "dog"     # model đoán +
y_pos = label == "dog"     # thật sự là +

tp = np.sum( y_pos &  p_pos)
fp = np.sum(~y_pos &  p_pos)
fn = np.sum( y_pos & ~p_pos)
tn = np.sum(~y_pos & ~p_pos)
print(tp, fp, fn, tn)      # 3 1 2 1
```

## [sâu] Dùng scikit-learn — chú ý thứ tự

```python
from sklearn.metrics import confusion_matrix

# Chỉ định labels=[+, −] để ra đúng bố cục như slide
cm = confusion_matrix(label, pred, labels=["dog", "cat"])
print(cm)
# [[3 2]     ← hàng Actual dog:  TP=3, FN=2
#  [1 1]]    ← hàng Actual cat:  FP=1, TN=1

# Nếu KHÔNG chỉ định labels, sklearn sắp theo a→z: cat trước dog
print(confusion_matrix(label, pred))
# [[1 1]     ← Actual cat
#  [2 3]]    ← Actual dog   → TP nằm ở góc dưới phải!
```

> **EN:** Three ways to build the matrix: plain Python counting, vectorised
> NumPy boolean masks, and scikit-learn. With scikit-learn, pass
> `labels=["dog", "cat"]` to get the slide's layout (positive first);
> without it, classes are sorted alphabetically and TP lands in the
> bottom-right corner.
