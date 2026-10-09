---
title: Metric cho Regression — MAE và RMSE
order: 14
description: Đánh giá model dự đoán con số (giá nhà) bằng sai số trung bình — MAE đo sai lệch "điển hình", RMSE phạt nặng sai lệch lớn — cùng mối liên hệ với L1/L2 loss, R² và cách đọc các con số này.
---

## 1. Ý tưởng

Với Regression, gần như không bao giờ model đoán **trúng chính xác** giá
nhà đến từng đồng, nên hỏi "đúng bao nhiêu phần trăm" (Accuracy) là vô
nghĩa. Câu hỏi đúng là: ***"Trung bình model đoán lệch bao nhiêu?"***

Slide 38 đưa ra hai cách trả lời:

- **MAE (Mean Absolute Error)**: lấy trị tuyệt đối sai lệch từng mẫu rồi
  **trung bình** → "trung bình mỗi căn đoán lệch khoảng bao nhiêu tỉ".
- **RMSE (Root Mean Squared Error)**: bình phương sai lệch, trung bình,
  rồi **lấy căn** → cũng ra đơn vị tỉ đồng, nhưng **phạt nặng các lần
  đoán lệch lớn**.

Nếu thấy quen thì đúng vậy: đây chính là **L1 và L2 loss** của bài 06,
chỉ khác là lấy **trung bình** thay vì tổng (và RMSE thêm bước lấy căn).

> **EN:** In Regression a model almost never hits the exact house price,
> so asking "what percentage was right?" (Accuracy) is meaningless. The
> right question is ***"on average, how far off is the model?"*** Slide 38
> gives two answers: **MAE** — average the absolute errors ("each house is
> off by about X billion"); **RMSE** — square the errors, average, then
> take the square root (same unit, but **large errors are penalised
> more**). These are the **L1 and L2 losses** from lesson 06, averaged
> instead of summed (plus a square root for RMSE).

## 2. Vị trí trong pipeline

Slide 38 dùng lại đúng dataset giá nhà của bài 06, nhưng giờ thấy đủ
feature:

```
[Diện tích, Số tầng, Thành phố, Trong ngõ] → [ Model ] → Prediction
                                                            ↕  so sánh
                                                          Label
                                                            ↓
                                                    MAE, RMSE (bài này)
```

So với Classification (bài 11–13), luồng giống hệt: model → prediction →
so với label. Chỉ khác **cách so**: Classification đếm đúng/sai theo
nhãn; Regression đo **khoảng cách** giữa hai con số.

Cùng một công thức có thể đóng hai vai:

| | Vai trò | Ai dùng | Khi nào |
|---|---|---|---|
| **Loss** (L1, L2 — bài 06) | để model **tự sửa** | thuật toán tối ưu | trong lúc train |
| **Metric** (MAE, RMSE — bài này) | để **con người đánh giá** | ta, khi so sánh/báo cáo | trên Validation / Test |

Một model có thể train bằng một loss (ví dụ L2) nhưng được đánh giá bằng
metric khác (ví dụ MAE) — tùy điều ta quan tâm khi dùng thực tế.

> **EN:** Slide 38 reuses lesson 06's house price dataset, now with all
> features shown (area, floors, city, in-alley). The flow mirrors
> Classification — model → prediction → compare with label — only the
> comparison differs: distance between numbers instead of right/wrong
> labels. The same formula can play two roles: as a **loss** (L1/L2)
> it lets the model **correct itself** during training; as a **metric**
> (MAE/RMSE) it lets **us evaluate** the model on Validation/Test. A model
> can be trained with one (e.g. L2) and evaluated with another (e.g. MAE).

## 3. Công thức / cách hoạt động

### 3.1. MAE — Mean Absolute Error

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

### 3.2. RMSE — Root Mean Squared Error

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

### 3.3. MAE và RMSE khác nhau thế nào? *(Bổ sung — slide chỉ cho công thức)*

**Luôn có RMSE ≥ MAE.** Hai giá trị bằng nhau chỉ khi mọi sai lệch có
cùng độ lớn. **Khoảng cách giữa RMSE và MAE càng lớn thì sai lệch càng
không đều**, tức là có vài mẫu bị đoán lệch rất xa.

| | MAE | RMSE |
|---|---|---|
| Phạt sai lệch lớn | tuyến tính, "phạt đều" | bình phương, "phạt nặng" |
| Bị outlier chi phối | ít | nhiều |
| Ý nghĩa trực quan | sai lệch điển hình | sai lệch có tính đến rủi ro lớn |
| Tương ứng với loss | L1 (bài 06) | L2 (bài 06) |

Chọn cái nào?

- Dùng **MAE** khi mọi sai lệch "đắt như nhau" theo đơn vị, hoặc dữ liệu
  có nhiều điểm nhiễu không đáng tin (giống lập luận chọn L1 ở bài 06).
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

### 3.4. R² — so với việc "đoán bừa bằng trung bình" *(Bổ sung)*

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

## 4. Ví dụ tay

Dữ liệu slide 38 (đơn vị: tỉ VND):

| # | Diện tích | Số tầng | Thành phố | Trong ngõ | Prediction | Label | Sai lệch e | \|e\| | e² |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 40 | 6 | HCM | No | 3.45 | 3.75 | −0.30 | 0.30 | 0.0900 |
| 2 | 60 | 4 | Hà Nội | No | 3.90 | 4.12 | −0.22 | 0.22 | 0.0484 |
| 3 | 120 | 3 | Hải Dương | Yes | 2.12 | 2.20 | −0.08 | 0.08 | 0.0064 |
| 4 | 50 | 4 | Huế | No | 2.90 | 2.30 | +0.60 | 0.60 | 0.3600 |
| | | | | | | | **Tổng** | **1.20** | **0.5048** |

### 4.1. MAE

MAE = 1.20 / 4 = **0.30 tỉ** → trung bình mỗi căn đoán lệch 300 triệu.

### 4.2. RMSE

- MSE = 0.5048 / 4 = **0.1262** (tỉ²)
- RMSE = √0.1262 ≈ **0.3552 tỉ**

RMSE (0.355) lớn hơn MAE (0.30) khoảng 18%, do dòng Huế (lệch 0.60) đóng
góp **0.36 / 0.5048 ≈ 71%** tổng bình phương sai lệch, dù chỉ chiếm 1/4
số mẫu.

### 4.3. Liên hệ với bài 06

Bài 06 đã tính trên chính dữ liệu này: L1 = 1.20, L2 = 0.5048. Vậy:

- MAE = L1 / N = 1.20 / 4 = 0.30 ✓
- MSE = L2 / N = 0.5048 / 4 = 0.1262 ✓, RMSE = √MSE

### 4.4. Thí nghiệm outlier *(Bổ sung)*

Như câu hỏi ở bài 06: nếu model đoán căn ở Huế là **4.3 tỉ** (sai lệch
+2.0 thay vì +0.6), ba dòng còn lại giữ nguyên:

| Metric | Trước | Sau | Tăng gấp |
|---|---|---|---|
| MAE | 0.30 | (0.30 + 0.22 + 0.08 + 2.0) / 4 = **0.65** | ≈ 2.2 lần |
| RMSE | 0.3552 | √(4.1448 / 4) ≈ **1.0179** | ≈ 2.9 lần |

Chỉ một căn bị đoán tệ hơn mà RMSE tăng gần gấp ba, trong khi MAE tăng
khoảng 2.2 lần. Khoảng cách RMSE − MAE nới từ 0.055 lên 0.368 — đúng là
dấu hiệu "có một lỗi lớn bất thường".

### 4.5. R² và MAPE *(Bổ sung)*

- Giá trung bình: ȳ = (3.75 + 4.12 + 2.2 + 2.3) / 4 = **3.0925**
- Model "đoán bừa bằng trung bình" có Σ(y − ȳ)² = 0.6575² + 1.0275² +
  0.8925² + 0.7925² ≈ **2.9127**
- R² = 1 − 0.5048 / 2.9127 ≈ **0.827** → model giảm được khoảng 83% sai
  số bình phương so với việc đoán trung bình.
- MAPE = (0.30/3.75 + 0.22/4.12 + 0.08/2.2 + 0.60/2.3) / 4 ≈ (0.080 +
  0.053 + 0.036 + 0.261) / 4 ≈ **10.8%**. Riêng căn ở Huế lệch tới 26%.

> **EN:** Slide 38's data: |errors| sum to 1.20 and squared errors to
> 0.5048. MAE = 0.30 billion; MSE = 0.1262; RMSE ≈ 0.3552 billion. The
> Huế row alone contributes ≈ 71% of the squared error. Link to lesson 06:
> MAE = L1/N, MSE = L2/N. *(Supplementary)* If the Huế prediction becomes
> 4.3 (error +2.0), MAE rises to 0.65 (≈ 2.2×) but RMSE to ≈ 1.018
> (≈ 2.9×). R² ≈ 0.827 against the mean-prediction baseline (ȳ = 3.0925);
> MAPE ≈ 10.8%.

## 5. Code

### 5.1. Tự cài đặt bằng NumPy

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

### 5.2. Đối chiếu bằng scikit-learn

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

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Vì sao không dùng Accuracy để đánh giá model dự đoán giá nhà?
> **Đáp án:** Vì output là số liên tục, model gần như không bao giờ đoán
> trùng khớp tuyệt đối với giá thật, nên Accuracy gần như luôn bằng 0 và
> không phân biệt được model lệch 10 triệu với model lệch 2 tỉ. Regression
> cần metric đo **độ lớn sai lệch** như MAE, RMSE.

**Câu 2:** MAE và L1 loss (bài 06) khác nhau ở đâu? RMSE và L2 loss thì
sao?
> **Đáp án:** MAE = L1 chia cho N (lấy trung bình thay vì tổng). RMSE =
> căn bậc hai của (L2 chia cho N). Lấy trung bình để metric không phụ
> thuộc số lượng mẫu; lấy căn để RMSE quay về cùng đơn vị với label.

**Câu 3:** Vì sao RMSE luôn lớn hơn hoặc bằng MAE? Khi nào bằng nhau?
> **Đáp án:** Bình phương làm các sai lệch lớn chiếm tỉ trọng nhiều hơn
> trong trung bình, nên căn của trung bình bình phương luôn ≥ trung bình
> trị tuyệt đối. Hai giá trị bằng nhau khi mọi sai lệch có cùng độ lớn
> (ví dụ tất cả đều lệch đúng 0.3).

**Câu 4:** Model A: MAE = 0.30, RMSE = 0.32. Model B: MAE = 0.28, RMSE =
0.60. Nhận xét hai model. Dự báo phụ tải điện nên chọn model nào?
> **Đáp án:** A có sai lệch đều (RMSE ≈ MAE). B có sai lệch điển hình nhỏ
> hơn một chút, nhưng RMSE gấp đôi MAE → có vài lần đoán lệch rất xa. Với
> dự báo phụ tải, một lần lệch lớn có thể gây thiếu điện nghiêm trọng,
> nên chọn **A**.

**Câu 5:** Tính MAE và RMSE cho 3 mẫu: prediction = [10, 20, 30], label =
[12, 20, 25].
> **Đáp án:** Sai lệch: −2, 0, +5. MAE = (2 + 0 + 5) / 3 ≈ **2.333**.
> MSE = (4 + 0 + 25) / 3 ≈ 9.667 → RMSE ≈ **3.109**.

**Câu 6:** Một model có R² = −0.2. Điều đó nói gì?
> **Đáp án:** Model **tệ hơn** cả việc luôn đoán bằng giá trị trung bình
> của label. Thường là dấu hiệu model chưa học được gì hữu ích, bị lỗi
> pipeline, hoặc đang đánh giá trên dữ liệu có phân bố rất khác dữ liệu
> train.

> **EN:**
>
> **Q1:** Why not use Accuracy to evaluate a house price model?
> > **A:** The output is continuous, so predictions almost never match
> > exactly; Accuracy would be ~0 and couldn't tell a 10-million miss from
> > a 2-billion miss. Regression needs metrics that measure **error size**.
>
> **Q2:** How does MAE relate to L1 loss (lesson 06)? RMSE to L2 loss?
> > **A:** MAE = L1 / N; RMSE = √(L2 / N). Averaging removes dependence
> > on sample count; the root restores the label's unit.
>
> **Q3:** Why is RMSE always ≥ MAE? When are they equal?
> > **A:** Squaring gives large errors more weight, so the root of the
> > mean square is ≥ the mean absolute value. They're equal only when all
> > errors have the same size.
>
> **Q4:** Model A: MAE 0.30, RMSE 0.32. Model B: MAE 0.28, RMSE 0.60.
> Which suits electricity load forecasting?
> > **A:** A's errors are even; B has a slightly smaller typical error but
> > occasional huge misses (RMSE ≈ 2 × MAE). One big miss can cause
> > shortages, so choose **A**.
>
> **Q5:** Compute MAE and RMSE for prediction = [10, 20, 30], label =
> [12, 20, 25].
> > **A:** Errors −2, 0, +5. MAE ≈ **2.333**; MSE ≈ 9.667 → RMSE ≈
> > **3.109**.
>
> **Q6:** A model has R² = −0.2. What does that say?
> > **A:** It's **worse** than always predicting the mean label — usually a
> > sign the model learned nothing useful, a pipeline bug, or a large
> > distribution shift between training and evaluation data.
