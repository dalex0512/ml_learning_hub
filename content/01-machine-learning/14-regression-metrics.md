---
title: Metric cho Regression — MAE và RMSE
order: 14
description: "MAE và RMSE khác nhau ở cách đối xử với sai số lớn (tính tay trên bảng giá nhà của slide 38), R² so với đoán trung bình, MAPE và cách chọn metric."
slides: 38
needs: [loss-function]
tags: [mae, rmse, r2, regression, outlier]
---

## Dự đoán lệch bao nhiêu?

:::intro Mục tiêu bài này
- Tính tay **MAE** và **RMSE** trên bảng giá nhà của slide 38, và nói được chúng khác nhau ở cách đối xử với sai số lớn.
- Đọc **R²** như "tốt hơn đoán bừa bằng trung bình bao nhiêu".
- Chọn metric hồi quy theo cái giá của sai số lớn, và biết giới hạn của MAPE.
:::

Slide 38 lấy lại đúng bảng giá nhà của [[bài:loss-function]] (đơn vị tỉ VND) và đưa hai công thức đánh giá model hồi quy:

| Diện tích | Số tầng | Thành phố | Trong ngõ | Prediction | Label | Sai số `e` = pred − label |
|---|---|---|---|---|---|---|
| 40 | 6 | HCM | No | 3.45 | 3.75 | −0.30 |
| 60 | 4 | Hà Nội | No | 3.90 | 4.12 | −0.22 |
| 120 | 3 | Hải Dương | Yes | 2.12 | 2.20 | −0.08 |
| 50 | 4 | Huế | No | 2.90 | 2.30 | **+0.60** |

- **Mean Absolute Error (MAE)** = (1/N) Σ |y_prediction − y_actual|
- **Root Mean Squared Error (RMSE)** = √( (1/N) Σ (y_prediction − y_actual)² )

Công thức trùng với L1 và L2 của bài Loss function; khác ở **vai trò**: ở đó ta dùng chúng để **học**, ở đây dùng để **đánh giá** model trên dữ liệu chưa thấy. Hai metric đều **cùng đơn vị với y** (tỉ đồng), nên dễ đọc.

:::slides 38 | Slide 38: metric cho Regression, MAE và RMSE trên bảng giá nhà
:::

:::steps
**MAE:** (0.30 + 0.22 + 0.08 + 0.60) / 4 = 1.20 / 4 = **0.30 tỉ đồng**. Đọc: "trung bình mỗi dự đoán lệch khoảng 0.30 tỉ".
@step
**MSE:** (0.30² + 0.22² + 0.08² + 0.60²) / 4 = (0.0900 + 0.0484 + 0.0064 + 0.3600) / 4 = 0.5048 / 4 = **0.1262**.
@step
**RMSE** = √0.1262 = **0.355 tỉ đồng**. Căn bậc hai đưa đơn vị về lại "tỉ đồng" (MSE có đơn vị tỉ², khó đọc).
@step
**RMSE ≥ MAE** luôn đúng (0.355 ≥ 0.300). Hai số bằng nhau chỉ khi mọi sai số có cùng độ lớn; khoảng cách giữa chúng cho biết sai số **không đều** đến mức nào.
:::

:::predict
Căn nhà Huế bị đoán lệch thêm 3 tỉ (đoán 5.9 thay vì 2.9, sai số +3.6), ba căn kia giữ nguyên. MAE và RMSE mới là bao nhiêu? Cái nào tăng nhiều hơn?
@answer
MAE = (0.30 + 0.22 + 0.08 + 3.6) / 4 = **1.05** (gấp 3.5 lần). RMSE = √((0.09 + 0.0484 + 0.0064 + 12.96) / 4) = √3.276 ≈ **1.81** (gấp 5.1 lần). **RMSE tăng nhiều hơn**, vì sai số 3.6 bị bình phương thành 12.96, chiếm gần hết tổng.
:::

Hãy tự kéo: công cụ dùng đúng bốn căn nhà của slide; kéo thanh trượt để căn nhà Huế bị đoán lệch thêm và theo dõi MAE, MSE, RMSE, R².

:::widget loss-outlier
slide
:::

## R²: so với việc "đoán bừa bằng trung bình"

MAE và RMSE chỉ nói "lệch bao nhiêu", không nói đó là **tốt hay tệ**. **R²** thêm một mốc so sánh: cách đoán đơn giản nhất là **luôn đoán giá trung bình** của y.

> R² = 1 − (tổng bình phương sai số của model) / (tổng bình phương sai số của cách luôn đoán trung bình)

:::steps
Giá nhà thật trung bình: (3.75 + 4.12 + 2.20 + 2.30) / 4 = **3.0925**. Cách đoán "luôn 3.0925" có tổng bình phương sai số = (0.6575² + 1.0275² + 0.8925² + 0.7925²) = **2.9127**.
@step
Tổng bình phương sai số của model = **0.5048** (đã tính ở trên).
@step
**R² = 1 − 0.5048 / 2.9127 = 0.827.** Model giải thích được khoảng 83% biến động của giá nhà so với cách đoán trung bình.
@step
Khi căn nhà Huế bị lệch thêm 3 tỉ, tổng bình phương sai số lên 13.1, và R² = 1 − 13.1 / 2.9127 = **−3.50**: model **tệ hơn** cả cách luôn đoán trung bình.
:::

- **R² = 1:** hoàn hảo. **R² = 0:** không hơn đoán trung bình. **R² âm:** tệ hơn đoán trung bình.
- MAE của cách "luôn đoán trung bình" là 0.8425 tỉ; MAE của model là 0.30: model giảm sai số trung bình khoảng 64%.
- Ví dụ trên Diabetes (đoán Glucose từ các cột còn lại): MAE 19.2 mg/dL so với 24.4 của cách đoán trung bình, R² = 0.36 ([[bài:classification-vs-regression]]).

## MAPE và chọn metric

**MAPE** = trung bình |e| / |y|, cho sai số **theo phần trăm**: với bảng nhà là **10.8%**. Dễ hiểu với người không chuyên, nhưng **hỏng khi y gần 0** (chia cho số rất nhỏ) và thiên về phạt dự đoán quá thấp. Nên dùng cùng MAE hoặc RMSE chứ không thay thế.

Chọn theo **cái giá của sai số lớn**:

- **MAE**: dễ giải thích ("trung bình lệch 0.30 tỉ"), **bền với outlier**. Hợp khi mọi sai số đáng kể như nhau.
- **RMSE**: nhạy sai số lớn. Hợp khi **sai lớn đắt hơn nhiều** (dự báo tồn kho: thiếu hàng nhiều tệ hơn thiếu ít).
- **R²**: nói model hơn mức sàn bao nhiêu; không có đơn vị nên không thay được MAE hay RMSE.
- Luôn **ghi kèm đơn vị** và **so với mức sàn** (đoán trung bình).

:::ck
Hai model cùng có MAE = 5 triệu. Model A sai đều quanh 5 triệu; model B chính xác hầu hết nhưng có vài lần sai 50 triệu. RMSE của hai model giống hay khác? Bạn chọn model nào nếu một lần sai 50 triệu rất đắt?
@answer
**RMSE của B lớn hơn A nhiều**, vì các sai số 50 triệu bị bình phương. Nếu một sai lớn rất đắt, chọn **A** (RMSE thấp hơn). MAE giống nhau che mất khác biệt này; đây là lý do nên báo cáo cả MAE và RMSE.
:::

:::ck
Model đạt R² = 0.95 trên **train** nhưng 0.40 trên **test**. Điều đó nói lên gì, và bạn tin con số nào?
@answer
Model **học vẹt (overfitting)**: tốt trên dữ liệu đã học, kém trên dữ liệu mới. Tin con số trên **test** (0.40); như mọi metric, R² chỉ có nghĩa khi tính trên dữ liệu model chưa từng thấy ([[bài:train-test-split]]).
:::

## Những hiểu sai thường gặp

- **"MAE nhỏ là model tốt."** Phải so với **mức sàn** và theo đơn vị của bài toán (0.30 tỉ có nhỏ không còn tùy giá nhà).
- **"RMSE và MAE là một."** RMSE phạt sai số lớn nặng hơn; chúng chỉ bằng nhau khi mọi sai số cùng độ lớn.
- **"R² không thể âm."** Có thể âm trên dữ liệu mới, khi model tệ hơn đoán trung bình.
- **"R² cao thì dự đoán chính xác."** R² cao vẫn có thể có MAE lớn nếu y trải rộng; luôn xem cả hai.
- **"MAPE luôn tiện."** Hỏng khi y gần 0.

:::card Metric hồi quy
- **MAE** = trung bình |e| (đơn vị của y, bền với outlier). **RMSE** = √(trung bình e²) (phạt nặng sai số lớn); RMSE ≥ MAE.
- **R² = 1 − SS_model / SS_trung_bình**: 1 là hoàn hảo, 0 là bằng đoán trung bình, âm là tệ hơn.
- **Bảng nhà slide 38:** MAE 0.30, RMSE 0.355, R² 0.827 (mức sàn MAE 0.8425); Huế lệch thêm 3 tỉ: MAE 1.05, RMSE 1.81, R² −3.50.
- **MAPE** (10.8%) cho sai số theo phần trăm nhưng hỏng khi y gần 0.
- **Chọn theo giá của sai lớn; luôn ghi đơn vị và so với mức sàn; chấm trên dữ liệu chưa thấy.**
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Vì sao không dùng Accuracy để đánh giá model dự đoán giá nhà?
A: Vì output là số liên tục, model gần như không bao giờ đoán
trùng khớp tuyệt đối với giá thật, nên Accuracy gần như luôn bằng 0 và
không phân biệt được model lệch 10 triệu với model lệch 2 tỉ. Regression
cần metric đo **độ lớn sai lệch** như MAE, RMSE.
EN: Why not use Accuracy to evaluate a house price model?
**A:** The output is continuous, so predictions almost never match
> exactly; Accuracy would be ~0 and couldn't tell a 10-million miss from
> a 2-billion miss. Regression needs metrics that measure **error size**.

Q: MAE và L1 loss ([[bài:loss-function]]) khác nhau ở đâu? RMSE và L2 loss thì
sao?
A: MAE = L1 chia cho N (lấy trung bình thay vì tổng). RMSE =
căn bậc hai của (L2 chia cho N). Lấy trung bình để metric không phụ
thuộc số lượng mẫu; lấy căn để RMSE quay về cùng đơn vị với label.
EN: How does MAE relate to L1 loss (lesson 06)? RMSE to L2 loss?
**A:** MAE = L1 / N; RMSE = √(L2 / N). Averaging removes dependence
> on sample count; the root restores the label's unit.

Q: Vì sao RMSE luôn lớn hơn hoặc bằng MAE? Khi nào bằng nhau?
A: Bình phương làm các sai lệch lớn chiếm tỉ trọng nhiều hơn
trong trung bình, nên căn của trung bình bình phương luôn ≥ trung bình
trị tuyệt đối. Hai giá trị bằng nhau khi mọi sai lệch có cùng độ lớn
(ví dụ tất cả đều lệch đúng 0.3).
EN: Why is RMSE always ≥ MAE? When are they equal?
**A:** Squaring gives large errors more weight, so the root of the
> mean square is ≥ the mean absolute value. They're equal only when all
> errors have the same size.

Q: Model A: MAE = 0.30, RMSE = 0.32. Model B: MAE = 0.28, RMSE =
0.60. Nhận xét hai model. Dự báo phụ tải điện nên chọn model nào?
A: A có sai lệch đều (RMSE ≈ MAE). B có sai lệch điển hình nhỏ
hơn một chút, nhưng RMSE gấp đôi MAE → có vài lần đoán lệch rất xa. Với
dự báo phụ tải, một lần lệch lớn có thể gây thiếu điện nghiêm trọng,
nên chọn **A**.
EN: Model A: MAE 0.30, RMSE 0.32. Model B: MAE 0.28, RMSE 0.60.
Which suits electricity load forecasting?
**A:** A's errors are even; B has a slightly smaller typical error but
> occasional huge misses (RMSE ≈ 2 × MAE). One big miss can cause
> shortages, so choose **A**.

Q: Tính MAE và RMSE cho 3 mẫu: prediction = [10, 20, 30], label =
[12, 20, 25].
A: Sai lệch: −2, 0, +5. MAE = (2 + 0 + 5) / 3 ≈ **2.333**.
MSE = (4 + 0 + 25) / 3 ≈ 9.667 → RMSE ≈ **3.109**.
EN: Compute MAE and RMSE for prediction = [10, 20, 30], label =
[12, 20, 25].
**A:** Errors −2, 0, +5. MAE ≈ **2.333**; MSE ≈ 9.667 → RMSE ≈
> **3.109**.

Q: Một model có R² = −0.2. Điều đó nói gì?
A: Model **tệ hơn** cả việc luôn đoán bằng giá trị trung bình
của label. Thường là dấu hiệu model chưa học được gì hữu ích, bị lỗi
pipeline, hoặc đang đánh giá trên dữ liệu có phân bố rất khác dữ liệu
train.
EN: A model has R² = −0.2. What does that say?
**A:** It's **worse** than always predicting the mean label — usually a
> sign the model learned nothing useful, a pipeline bug, or a large
> distribution shift between training and evaluation data.
@tier B | Phỏng vấn lý thuyết
Q: MAE khác RMSE về độ nhạy ra sao?
A: MAE cộng độ lớn sai lệch tuyến tính. RMSE bình phương trước khi lấy trung bình nên lỗi lớn chi phối mạnh hơn. Chọn theo chi phí lỗi lớn, kiểm tra lỗi do dữ liệu trước khi đổi metric.
EN: MAE weights absolute errors linearly; RMSE emphasizes large residuals through squaring.
Q: RMSE lớn hơn MAE nhiều chứng minh điều gì?
A: Cho thấy độ lớn sai lệch không đều. Chưa đủ biết lỗi ở đâu hoặc do outlier thật, nhóm bị bỏ quên hay lỗi nhãn; cần xem residual theo nhóm và kiểm tra các mẫu sai lớn.
EN: A large RMSE–MAE gap indicates uneven error magnitudes, but not their cause.
Q: Loss và metric có cần cùng công thức?
A: Không. Loss dùng để tối ưu model; metric đánh giá theo mục tiêu. Có thể train MSE nhưng theo dõi MAE hoặc chi phí vận hành, miễn quy trình lựa chọn dùng validation.
EN: The optimization loss and reporting metric may differ when the business objective requires it.
Q: MAPE dễ hiểu nhưng có hạn chế gì?
A: Chia sai số cho giá trị thật nên gần 0 có thể phóng đại và tại 0 cần quy ước. Với nhu cầu thường bằng 0, không nên dùng MAPE đơn độc; xem MAE và chi phí theo mặt hàng.
EN: MAPE becomes unstable near zero targets and requires careful handling of zeros.
@tier C | Tình huống doanh nghiệp
Q: Thiếu hàng đắt hơn tồn hàng, MAE hay RMSE?
A: Cả hai không phân biệt chiều sai. Trước hết ước lượng chi phí thiếu/tồn theo mặt hàng, dùng metric chi phí có dấu hoặc quantile loss *(bổ sung)*, kèm MAE/RMSE để dễ đọc. Chọn trên validation, kiểm tra mức tồn tăng khi giảm thiếu hàng.
WANT: Nhận ra metric đối xứng chưa mã hóa chi phí bất đối xứng.
Q: Báo cáo MAE giảm nhưng khách VIP phản ánh dự báo tệ hơn. Làm gì?
A: Tách residual theo nhóm khách, quy mô đơn, thời gian; kiểm tra lỗi lớn và chất lượng nhãn. Báo cáo metric từng nhóm hoặc trọng số theo chi phí đã thống nhất. Tối ưu toàn tập có thể đánh đổi một nhóm nhỏ quan trọng *(bổ sung)*.
WANT: Không để trung bình che phân khúc chịu tổn thất.
Q: Model giá nhà thành phố này có RMSE thấp hơn thành phố khác. Kết luận tốt hơn?
A: Kiểm tra đơn vị, phân bố giá và cách split; dùng baseline từng nơi và cùng khung đánh giá. RMSE thấp có thể chỉ vì thang giá nhỏ. Đánh giá thêm sai số theo phân khúc trước khi ưu tiên triển khai *(bổ sung)*.
WANT: Hiểu phụ thuộc thang đo và điều kiện so sánh công bằng.
:::

## Nối sang bài sau

:::next
Đã có công cụ đo cho cả classification và regression. [[bài:ml-pipeline]] ghép chúng với thu thập, tiền xử lý, huấn luyện và triển khai thành bức tranh dự án.
:::

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Tính tay MAE và RMSE, giữ đúng đơn vị.
- Giải thích vì sao RMSE ≥ MAE.
- Chọn metric theo chi phí thay vì tên gọi quen thuộc.
:::

Nền để đọc bài này: [[bài:loss-function]]. Để thấy model học prediction rồi được đánh giá bằng các metric này, đọc [[bài:linear-regression]] ở module 02.

> **EN:** The Linear Regression lesson in module 02 shows how fitted predictions are evaluated with these metrics.

:::slides 38 | Slide gốc — Metric cho Regression — MAE và RMSE
:::

Với Regression, gần như không bao giờ model đoán **trúng chính xác** giá
nhà đến từng đồng, nên hỏi "đúng bao nhiêu phần trăm" (Accuracy) là vô
nghĩa. Câu hỏi đúng là: ***"Trung bình model đoán lệch bao nhiêu?"***

[[slide:38]] đưa ra hai cách trả lời:

- **MAE (Mean Absolute Error)**: lấy trị tuyệt đối sai lệch từng mẫu rồi
  **trung bình** → "trung bình mỗi căn đoán lệch khoảng bao nhiêu tỉ".
- **RMSE (Root Mean Squared Error)**: bình phương sai lệch, trung bình,
  rồi **lấy căn** → cũng ra đơn vị tỉ đồng, nhưng **phạt nặng các lần
  đoán lệch lớn**.

Nếu thấy quen thì đúng vậy: đây chính là **L1 và L2 loss** của [[bài:loss-function]],
chỉ khác là lấy **trung bình** thay vì tổng (và RMSE thêm bước lấy căn).

> **EN:** In Regression a model almost never hits the exact house price,
> so asking "what percentage was right?" (Accuracy) is meaningless. The
> right question is ***"on average, how far off is the model?"*** [[slide:38]]
> gives two answers: **MAE** — average the absolute errors ("each house is
> off by about X billion"); **RMSE** — square the errors, average, then
> take the square root (same unit, but **large errors are penalised
> more**). These are the **L1 and L2 losses** from lesson 06, averaged
> instead of summed (plus a square root for RMSE).

## [sâu] Một công thức, hai vai trò loss và metric

[[slide:38]] dùng lại đúng dataset giá nhà của [[bài:loss-function]], nhưng giờ thấy đủ
feature:

```
[Diện tích, Số tầng, Thành phố, Trong ngõ] → [ Model ] → Prediction
                                                            ↕  so sánh
                                                          Label
                                                            ↓
                                                    MAE, RMSE (bài này)
```

So với Classification ([[bài:confusion-matrix]] đến [[bài:roc-auc]]), luồng giống hệt: model → prediction →
so với label. Chỉ khác **cách so**: Classification đếm đúng/sai theo
nhãn; Regression đo **khoảng cách** giữa hai con số.

Cùng một công thức có thể đóng hai vai:

| | Vai trò | Ai dùng | Khi nào |
|---|---|---|---|
| **Loss** (L1, L2 — [[bài:loss-function]]) | để model **tự sửa** | thuật toán tối ưu | trong lúc train |
| **Metric** (MAE, RMSE — bài này) | để **con người đánh giá** | ta, khi so sánh/báo cáo | trên Validation / Test |

Một model có thể train bằng một loss (ví dụ L2) nhưng được đánh giá bằng
metric khác (ví dụ MAE) — tùy điều ta quan tâm khi dùng thực tế.

> **EN:** [[slide:38]] reuses lesson 06's house price dataset, now with all
> features shown (area, floors, city, in-alley). The flow mirrors
> Classification — model → prediction → compare with label — only the
> comparison differs: distance between numbers instead of right/wrong
> labels. The same formula can play two roles: as a **loss** (L1/L2)
> it lets the model **correct itself** during training; as a **metric**
> (MAE/RMSE) it lets **us evaluate** the model on Validation/Test. A model
> can be trained with one (e.g. L2) and evaluated with another (e.g. MAE).

## [sâu] MAE — Mean Absolute Error

```
MAE = (1/N) · Σ |y_prediction − y_actual|
```

- Sai lệch mỗi mẫu được tính bằng **trị tuyệt đối**, nên lệch lên hay
  lệch xuống đều tính là lệch.
- Mọi sai lệch đóng góp **tỉ lệ thuận** với độ lớn của nó: lệch 0.6 tỉ
  "nặng" gấp đôi lệch 0.3 tỉ.
- **Đơn vị giống label** (tỉ VND), nên đọc rất tự nhiên: MAE = 0.3 nghĩa
  là "trung bình mỗi căn đoán lệch 0.3 tỉ".

> **EN:** MAE = (1/N) · Σ |y_prediction − y_actual|. Absolute value makes
> over- and under-estimates count equally; each error contributes in
> proportion to its size; the **unit matches the label**, so MAE = 0.3
> reads as "off by 0.3 billion VND per house on average".

## [sâu] RMSE — Root Mean Squared Error

```
RMSE = √[ (1/N) · Σ (y_prediction − y_actual)² ]
```

Ba bước, đọc từ trong ra ngoài:

1. **Squared**: bình phương từng sai lệch → sai lệch lớn bị **khuếch đại**
   (0.6² = 0.36 gấp hơn 5 lần 0.22² = 0.0484, dù 0.6 chỉ gấp ~2.7 lần
   0.22).
2. **Mean**: lấy trung bình → được **MSE (Mean Squared Error)**, đơn vị là
   "tỉ²" — khó hình dung.
3. **Root**: lấy căn → đưa đơn vị **về lại tỉ VND**, dễ đọc.

> **EN:** RMSE = √[(1/N) · Σ (y_prediction − y_actual)²], read inside-out:
> **square** each error (large errors get amplified), take the **mean**
> (that's **MSE**, in squared units like "billion²" — hard to interpret),
> then take the **root** to return to the label's unit.

## [sâu] MAE và RMSE khác nhau thế nào? (Bổ sung — slide chỉ cho công thức)

**Luôn có RMSE ≥ MAE.** Hai giá trị bằng nhau chỉ khi mọi sai lệch có
cùng độ lớn. **Khoảng cách giữa RMSE và MAE càng lớn thì sai lệch càng
không đều**, tức là có vài mẫu bị đoán lệch rất xa.

| | MAE | RMSE |
|---|---|---|
| Phạt sai lệch lớn | tuyến tính, "phạt đều" | bình phương, "phạt nặng" |
| Bị outlier chi phối | ít | nhiều |
| Ý nghĩa trực quan | sai lệch điển hình | sai lệch có tính đến rủi ro lớn |
| Tương ứng với loss | L1 ([[bài:loss-function]]) | L2 ([[bài:loss-function]]) |

Chọn cái nào?

- Dùng **MAE** khi mọi sai lệch "đắt như nhau" theo đơn vị, hoặc dữ liệu
  có nhiều điểm nhiễu không đáng tin (giống lập luận chọn L1 ở [[bài:loss-function]]).
- Dùng **RMSE** khi một lần đoán lệch rất xa **gây hậu quả nặng hơn
  nhiều** so với nhiều lần lệch nhỏ. Ví dụ dự báo nhu cầu điện: thiếu hụt
  lớn một lần có thể gây mất điện diện rộng.
- Trong thực tế thường **báo cáo cả hai**: MAE cho biết mức lệch điển
  hình, RMSE (so với MAE) cho biết có lệch lớn bất thường hay không.

> **EN:** *(Supplementary)* **RMSE ≥ MAE always**, with equality only
> when all errors have the same size; **the bigger the gap, the more
> uneven the errors** (a few very large misses). MAE penalises linearly
> and is robust to outliers (like L1); RMSE penalises quadratically and is
> dominated by large errors (like L2). Use MAE when every unit of error
> costs the same or data is noisy; use RMSE when one big miss is far
> worse than several small ones. In practice, report both.

## [sâu] R² — so với việc "đoán bừa bằng trung bình" (Bổ sung)

MAE = 0.3 tỉ là tốt hay tệ? Còn tùy: nhà 3 tỉ mà lệch 0.3 tỉ là 10%, nhà
30 tỉ thì lệch 0.3 tỉ là rất ít. MAE và RMSE **phụ thuộc thang đo** của
label nên khó so giữa các bài toán khác nhau.

**R² (coefficient of determination)** so model với một model "ngây thơ"
**luôn đoán bằng giá trung bình** ȳ:

```
R² = 1 − Σ(y_actual − y_prediction)² / Σ(y_actual − ȳ)²
   = 1 − MSE(model) / MSE(đoán bằng trung bình)
```

| R² | Ý nghĩa |
|---|---|
| 1 | dự đoán hoàn hảo |
| 0 | không hơn gì việc luôn đoán giá trung bình |
| < 0 | **tệ hơn** cả việc đoán trung bình |

R² không có đơn vị, nên dễ so giữa các bài toán. Nhưng R² cao chưa chắc
sai lệch nhỏ theo nghĩa thực tế — vẫn cần nhìn MAE/RMSE.

**MAPE (Mean Absolute Percentage Error)** là một metric khác, đo sai lệch
theo **phần trăm** của giá trị thật: MAPE = (1/N) · Σ |y_pred − y_actual|
/ |y_actual|. Dễ hiểu với người không chuyên ("lệch trung bình 10%"),
nhưng sẽ bùng nổ khi giá trị thật gần 0.

> **EN:** *(Supplementary)* MAE and RMSE depend on the label's scale, so
> they're hard to compare across problems. **R²** compares the model with
> a naive baseline that always predicts the mean ȳ: R² = 1 − MSE(model) /
> MSE(mean baseline). R² = 1 is perfect, 0 is no better than predicting
> the mean, negative is worse than that. **MAPE** measures error as a
> percentage of the true value — intuitive, but it explodes when true
> values are near zero.

## [sâu] Tính trên bốn căn nhà

Dữ liệu [[slide:38]] (đơn vị: tỉ VND):

| # | Diện tích | Số tầng | Thành phố | Trong ngõ | Prediction | Label | Sai lệch e | \|e\| | e² |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 40 | 6 | HCM | No | 3.45 | 3.75 | −0.30 | 0.30 | 0.0900 |
| 2 | 60 | 4 | Hà Nội | No | 3.90 | 4.12 | −0.22 | 0.22 | 0.0484 |
| 3 | 120 | 3 | Hải Dương | Yes | 2.12 | 2.20 | −0.08 | 0.08 | 0.0064 |
| 4 | 50 | 4 | Huế | No | 2.90 | 2.30 | +0.60 | 0.60 | 0.3600 |
| | | | | | | | **Tổng** | **1.20** | **0.5048** |

## [sâu] MAE

MAE = 1.20 / 4 = **0.30 tỉ** → trung bình mỗi căn đoán lệch 300 triệu.

## [sâu] RMSE

- MSE = 0.5048 / 4 = **0.1262** (tỉ²)
- RMSE = √0.1262 ≈ **0.3552 tỉ**

RMSE (0.355) lớn hơn MAE (0.30) khoảng 18%, do dòng Huế (lệch 0.60) đóng
góp **0.36 / 0.5048 ≈ 71%** tổng bình phương sai lệch, dù chỉ chiếm 1/4
số mẫu.

## [sâu] Liên hệ với Loss Function (Hàm mất mát)

[[bài:loss-function]] đã tính trên chính dữ liệu này: L1 = 1.20, L2 = 0.5048. Vậy:

- MAE = L1 / N = 1.20 / 4 = 0.30 ✓
- MSE = L2 / N = 0.5048 / 4 = 0.1262 ✓, RMSE = √MSE

## [sâu] Thí nghiệm outlier (Bổ sung)

Như câu hỏi ở [[bài:loss-function]]: nếu model đoán căn ở Huế là **4.3 tỉ** (sai lệch
+2.0 thay vì +0.6), ba dòng còn lại giữ nguyên:

| Metric | Trước | Sau | Tăng gấp |
|---|---|---|---|
| MAE | 0.30 | (0.30 + 0.22 + 0.08 + 2.0) / 4 = **0.65** | ≈ 2.2 lần |
| RMSE | 0.3552 | √(4.1448 / 4) ≈ **1.0179** | ≈ 2.9 lần |

Chỉ một căn bị đoán tệ hơn mà RMSE tăng gần gấp ba, trong khi MAE tăng
khoảng 2.2 lần. Khoảng cách RMSE − MAE nới từ 0.055 lên 0.368 — đúng là
dấu hiệu "có một lỗi lớn bất thường".

## [sâu] R² và MAPE (Bổ sung)

- Giá trung bình: ȳ = (3.75 + 4.12 + 2.2 + 2.3) / 4 = **3.0925**
- Model "đoán bừa bằng trung bình" có Σ(y − ȳ)² = 0.6575² + 1.0275² +
  0.8925² + 0.7925² ≈ **2.9127**
- R² = 1 − 0.5048 / 2.9127 ≈ **0.827** → model giảm được khoảng 83% sai
  số bình phương so với việc đoán trung bình.
- MAPE = (0.30/3.75 + 0.22/4.12 + 0.08/2.2 + 0.60/2.3) / 4 ≈ (0.080 +
  0.053 + 0.036 + 0.261) / 4 ≈ **10.8%**. Riêng căn ở Huế lệch tới 26%.

> **EN:** [[slide:38]]'s data: |errors| sum to 1.20 and squared errors to
> 0.5048. MAE = 0.30 billion; MSE = 0.1262; RMSE ≈ 0.3552 billion. The
> Huế row alone contributes ≈ 71% of the squared error. Link to lesson 06:
> MAE = L1/N, MSE = L2/N. *(Supplementary)* If the Huế prediction becomes
> 4.3 (error +2.0), MAE rises to 0.65 (≈ 2.2×) but RMSE to ≈ 1.018
> (≈ 2.9×). R² ≈ 0.827 against the mean-prediction baseline (ȳ = 3.0925);
> MAPE ≈ 10.8%.

## [sâu] Tự cài đặt bằng NumPy

```python
import numpy as np

pred   = np.array([3.45, 3.90, 2.12, 2.90])
actual = np.array([3.75, 4.12, 2.20, 2.30])

def mae(p, y):  return np.mean(np.abs(p - y))
def mse(p, y):  return np.mean((p - y) ** 2)
def rmse(p, y): return np.sqrt(mse(p, y))
def r2(p, y):   return 1 - np.sum((y - p) ** 2) / np.sum((y - y.mean()) ** 2)
def mape(p, y): return np.mean(np.abs(p - y) / np.abs(y))

print(f"MAE  = {mae(pred, actual):.4f}")    # 0.3000
print(f"MSE  = {mse(pred, actual):.4f}")    # 0.1262
print(f"RMSE = {rmse(pred, actual):.4f}")   # 0.3552
print(f"R²   = {r2(pred, actual):.4f}")     # 0.8267
print(f"MAPE = {mape(pred, actual):.2%}")   # 10.77%

# Thí nghiệm outlier: căn ở Huế đoán 4.3 tỉ
pred_bad = pred.copy(); pred_bad[3] = 4.3
print(f"MAE  → {mae(pred_bad, actual):.4f}")    # 0.6500
print(f"RMSE → {rmse(pred_bad, actual):.4f}")   # 1.0179
```

## [sâu] Đối chiếu bằng scikit-learn

```python
from sklearn.metrics import (mean_absolute_error, mean_squared_error,
                             r2_score, mean_absolute_percentage_error)

print(mean_absolute_error(actual, pred))              # 0.30
print(np.sqrt(mean_squared_error(actual, pred)))      # 0.3552
print(r2_score(actual, pred))                         # 0.8267
print(mean_absolute_percentage_error(actual, pred))   # 0.1077
```

Lưu ý: hàm của scikit-learn nhận **y_true trước, y_pred sau**. Với MAE,
RMSE thì đổi chỗ không sao vì công thức đối xứng, nhưng với R² và MAPE
đổi chỗ sẽ ra **kết quả sai**. Bản scikit-learn mới cũng có sẵn
`root_mean_squared_error`.

> **EN:** Implement MAE, MSE, RMSE, R² and MAPE in a few lines of NumPy,
> then verify with scikit-learn. scikit-learn takes **y_true first,
> y_pred second** — swapping is harmless for MAE/RMSE (symmetric) but
> gives **wrong results** for R² and MAPE. Recent versions also provide
> `root_mean_squared_error`.

## [sâu] Đừng suy quá xa từ một con số (bổ sung)

:::pitfall Đối xứng và bối cảnh
MAE là trung bình trị tuyệt đối, không phải median sai số. Cả MAE và RMSE đều đối xứng giữa dự đoán thừa và thiếu. R² dùng trung bình y của chính tập đánh giá trong mẫu số; không tự chứng minh model thắng baseline triển khai tính từ train. R² không có đơn vị nhưng khác phân phối target vẫn làm so sánh giữa bài toán thiếu ý nghĩa. Tập có target hằng cần xử lý riêng vì mẫu số R² bằng 0.
:::

> **EN:** MAE is a mean, not a median. Both MAE and RMSE penalize over- and underprediction symmetrically. R² depends on target variance and needs care for constant targets.
