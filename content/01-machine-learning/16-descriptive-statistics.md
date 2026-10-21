---
title: Step 2 — Thống kê mô tả để hiểu dữ liệu
order: 16
description: Khám phá Diabetes dataset bằng pandas — xem dữ liệu, kiểm tra kiểu từng feature (dtypes), đọc từng dòng của describe() bằng số liệu thật, xem phân bố class 500/268, và phát hiện các giá trị 0 bất thường là dữ liệu thiếu trá hình.
---

## 1. Ý tưởng

Trước khi chữa bệnh, bác sĩ phải **khám**. Step 2 — Statistics là buổi
"khám tổng quát" cho dataset: chưa sửa gì cả, chỉ **nhìn và đo** để trả
lời 4 câu hỏi. Slide 41–44 trả lời lần lượt từng câu trên Diabetes
dataset:

| Câu hỏi | Công cụ pandas | Slide |
|---|---|---|
| Dữ liệu trông như thế nào? | `read_csv`, xem bảng | 41 — *How data looks like* |
| Mỗi feature thuộc kiểu dữ liệu gì? | `data.dtypes` | 42 — *Check each feature's data type* |
| Giá trị mỗi feature phân bố ra sao? | `data.describe()` | 43 — *Statistical Summary of Data* |
| Các class có cân bằng không? | `data.groupby('Outcome').size()` | 44 — *Category distribution* |

Kết quả của buổi khám là một **danh sách vấn đề** để bước 3 (tiền xử lý)
giải quyết. Với Diabetes dataset, buổi khám sẽ phát hiện hai "bệnh" chính:

1. **Class mất cân bằng**: 500 người không bệnh, chỉ 268 người bệnh.
2. **Dữ liệu thiếu trá hình**: không có ô nào trống, nhưng có hàng trăm
   giá trị **0** ở những chỗ không thể bằng 0 (Insulin, Glucose, BMI…).

> **EN:** A doctor examines before treating. Step 2 — Statistics is the
> dataset's "general check-up": we change nothing, we only **look and
> measure** to answer four questions, one per slide: what does the data
> look like (`read_csv`), what type is each feature (`dtypes`), how are
> values distributed (`describe()`), and are the classes balanced
> (`groupby('Outcome').size()`)? The output is a **list of problems** for
> step 3. For the Diabetes dataset: (1) **class imbalance** — 500 vs 268;
> (2) **disguised missing data** — no empty cells, but hundreds of
> impossible **0** values (Insulin, Glucose, BMI…).

## 2. Vị trí trong pipeline

```
Step 1 Data collection → [ Step 2 Statistics ] → Step 3 Preprocessing → Step 4 Visualization → …
                             (bài này)              (bài 17 trở đi)        (module 04)
```

Dataset ở đây là **Diabetes dataset** — đúng bộ đã gặp ở bài 04 khi học
feature matrix X và label vector y: 8 cột feature và cột label `Outcome`
(1 = mắc tiểu đường, 0 = không). Bài 04 mới nhìn vài dòng để hiểu X và y;
bài này nhìn **toàn bộ 768 dòng** qua con mắt thống kê.

Những gì tìm được ở đây sẽ quyết định việc phải làm ở các bài sau:

- Giá trị 0 vô lý → **Step 3.1 Handle missing or invalid values** (slide
  45).
- Giá trị rất lớn như Insulin = 846 → **Step 3.2 Remove outliers** (slide
  46).
- Các feature có thang đo rất khác nhau (DiabetesPedigreeFunction ~0.5,
  Insulin ~80) → **Step 3.3 Scaling** (slide 47).
- Phân bố class 500 / 268 → **Step 3.5 Balance data** (slide 52–54); và
  ngay bây giờ đã cần nhớ bài 09 (Stratified K-fold) và bài 12 (bẫy
  Accuracy).

> **EN:** The dataset is the **Diabetes dataset** from lesson 04 (8
> feature columns plus the `Outcome` label). Lesson 04 looked at a few rows
> to understand X and y; this lesson examines **all 768 rows**
> statistically. Findings drive later work: impossible zeros → step 3.1
> (missing/invalid values); huge values like Insulin = 846 → step 3.2
> (outliers); very different scales → step 3.3 (scaling); the 500/268
> split → step 3.5 (balancing), plus Stratified K-fold (lesson 09) and the
> accuracy trap (lesson 12).

## 3. Công thức / cách hoạt động

### 3.1. Diabetes dataset (slide 40)

Slide 40 cho xem 15 dòng đầu. Ý nghĩa từng cột *(bổ sung — slide chỉ ghi
tên cột; theo mô tả gốc của bộ dữ liệu Pima Indians Diabetes, gồm các phụ
nữ gốc Pima từ 21 tuổi trở lên)*:

| Cột | Ý nghĩa | Đơn vị |
|---|---|---|
| Pregnancies | Số lần mang thai | lần |
| Glucose | Nồng độ glucose huyết tương sau 2 giờ làm nghiệm pháp dung nạp glucose | mg/dL |
| BloodPressure | Huyết áp tâm trương (số dưới) | mm Hg |
| SkinThickness | Độ dày nếp gấp da ở cơ tam đầu (bắp tay sau) | mm |
| Insulin | Insulin huyết thanh sau 2 giờ | μU/ml |
| BMI | Chỉ số khối cơ thể = cân nặng (kg) / chiều cao² (m²) | kg/m² |
| DiabetesPedigreeFunction | Điểm nguy cơ tiểu đường dựa trên tiền sử gia đình | không đơn vị |
| Age | Tuổi | năm |
| **Outcome** | **Label**: 1 = mắc tiểu đường, 0 = không | — |

Slide tô đỏ cột `Outcome` để nhấn mạnh đây là **label (y)**, 8 cột còn
lại là **feature (X)** — giống bài 04.

Nhìn kỹ 15 dòng này đã thấy điều lạ: dòng 8 có **BloodPressure = 0**, dòng
10 có **BMI = 0**, cột Insulin có **9/15** giá trị bằng 0, cột
SkinThickness có 7/15 giá trị bằng 0. Người còn sống không thể có huyết áp
0 hay BMI 0 — đây là manh mối đầu tiên (mục 3.6).

> **EN:** Slide 40 shows the first 15 rows. *(Supplementary — column
> meanings from the original Pima Indians Diabetes description: women of
> Pima heritage aged 21+)* Pregnancies (count), Glucose (2-hour plasma
> glucose, mg/dL), BloodPressure (diastolic, mm Hg), SkinThickness
> (triceps skinfold, mm), Insulin (2-hour serum insulin, μU/ml), BMI
> (kg/m²), DiabetesPedigreeFunction (family-history risk score), Age, and
> **Outcome** — the label, highlighted in red. Even these 15 rows look odd:
> BloodPressure = 0 in row 8, BMI = 0 in row 10, Insulin = 0 in 9 of 15
> rows. A living person can't have zero blood pressure or BMI — the first
> clue (section 3.6).

### 3.2. Xem dữ liệu — How data looks like (slide 41)

```python
import pandas as pd
data = pd.read_csv("diabetes.csv", delimiter=",")
```

- `pd.read_csv` đọc file CSV (*comma-separated values* — các giá trị cách
  nhau bằng dấu phẩy) thành một **DataFrame**: bảng có tên cột và chỉ số
  dòng (index) bắt đầu từ 0.
- `delimiter=","` chỉ rõ ký tự phân cách. Với file CSV chuẩn thì đây là mặc
  định nên có thể bỏ (slide 43–44 cũng bỏ). Tham số này hữu ích khi gặp
  file dùng `;` hoặc tab — chuyện khá thường gặp với file Excel xuất ra ở
  máy cài định dạng số kiểu Việt Nam, nơi dấu phẩy đã dùng làm dấu thập
  phân *(bổ sung)*.
- Ảnh slide là PyCharm ở chế độ *Scientific mode*: bảng bên phải là cửa sổ
  xem biến `data`, các ô được **tô màu theo giá trị** (xanh = nhỏ, đỏ =
  lớn so với cột) nhờ tùy chọn *Colored cells*. Màu chỉ để nhìn nhanh,
  không phải một phần của dữ liệu.

*(Bổ sung)* Nếu không dùng PyCharm, xem dữ liệu bằng `data.head()` (5 dòng
đầu), `data.tail()` (5 dòng cuối), `data.shape` → `(768, 9)`: 768 dòng
(mẫu / sample), 9 cột.

> **EN:** `pd.read_csv` loads the CSV into a **DataFrame** (named columns,
> 0-based row index). `delimiter=","` is the default and can be omitted
> (slides 43–44 do); it matters for files using `;` or tabs — common with
> Excel exports on machines using a comma as the decimal separator
> *(supplementary)*. The screenshot is PyCharm's Scientific mode; cells are
> **colour-coded by value** (blue = low, red = high within the column) —
> only a viewing aid. *(Supplementary)* Elsewhere use `data.head()`,
> `data.tail()` and `data.shape` → `(768, 9)`.

### 3.3. Kiểm tra kiểu dữ liệu — dtypes (slide 42)

```python
print(data.dtypes)
```

| Feature | dtype |
|---|---|
| Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, Age, Outcome | `int64` (số nguyên) |
| BMI, DiabetesPedigreeFunction | `float64` (số thực) |

Kết luận ghi trên slide:

- Tất cả các features và target đều là **numerical data**.
- Có **2 features là float**, còn lại là int.

Vì sao phải kiểm tra? Vì model chỉ làm việc với **số**. Nếu một cột có
dtype `object` (thường là chuỗi chữ, ví dụ "Hà Nội", "Male"), ta phải mã
hóa nó thành số ở Step 3.3 (encoding). Với Diabetes dataset, may mắn là
không có cột nào như vậy → không cần encoding.

*(Nhận xét của Claude)* "dtype là số" **chưa chắc** "ý nghĩa là số". Nối
với bài 02:

- `Outcome` lưu là `int64` nhưng về ý nghĩa là **biến phân loại nhị phân
  (boolean / binary)**: 0 và 1 chỉ là tên gọi của hai class; phép tính
  "trung bình Outcome" chỉ có nghĩa đặc biệt (mục 3.4.2).
- `Pregnancies`, `Age` là số **rời rạc** (đếm được), Glucose, BMI là số
  **liên tục** — tất cả đều là numerical, nhưng khi trực quan hóa sẽ chọn
  biểu đồ khác nhau.
- Ngược lại, một cột mã tỉnh "01, 79, 48" lưu dạng số nhưng thật ra là
  **nominal** — cộng trừ trên nó vô nghĩa.

Nên dtype chỉ là bước kiểm tra đầu; luôn phải hỏi thêm "cột này **có ý
nghĩa** là gì?".

*(Bổ sung)* `data.info()` cho thêm số ô **non-null** của mỗi cột. Với
Diabetes dataset, mọi cột đều `768 non-null` — tức là **không có ô trống
nào**. Đừng vội mừng: mục 3.6 sẽ cho thấy dữ liệu thiếu đang "trốn" dưới
dạng số 0.

> **EN:** `data.dtypes` shows 7 `int64` columns and 2 `float64` columns
> (BMI, DiabetesPedigreeFunction). The slide concludes: **all features and
> the target are numerical**; 2 features are float, the rest int. This
> matters because models only accept numbers — an `object` (string) column
> would need encoding in step 3.3; here none does. *(Claude's note)* A
> numeric dtype doesn't guarantee numeric meaning: `Outcome` is an int but
> semantically a **binary categorical** variable; Pregnancies and Age are
> discrete, Glucose and BMI continuous; a province code stored as numbers
> is really nominal. Always ask what a column *means*. *(Supplementary)*
> `data.info()` shows `768 non-null` everywhere — no empty cells, yet
> missing data hides as zeros (section 3.6).

### 3.4. Tóm tắt thống kê — describe() (slide 43)

```python
from pandas import read_csv
data = read_csv("diabetes.csv")
out = data.describe()
```

`describe()` tính 8 con số cho **mỗi cột số**. Kết quả thật (khớp ảnh
slide, làm tròn):

| | Pregnancies | Glucose | BloodPressure | SkinThickness | Insulin | BMI | DPF | Age | Outcome |
|---|---|---|---|---|---|---|---|---|---|
| **count** | 768 | 768 | 768 | 768 | 768 | 768 | 768 | 768 | 768 |
| **mean** | 3.85 | 120.89 | 69.11 | 20.54 | 79.80 | 31.99 | 0.472 | 33.24 | 0.349 |
| **std** | 3.37 | 31.97 | 19.36 | 15.95 | 115.24 | 7.88 | 0.331 | 11.76 | 0.477 |
| **min** | 0 | **0** | **0** | **0** | **0** | **0** | 0.078 | 21 | 0 |
| **25%** | 1 | 99 | 62 | **0** | **0** | 27.30 | 0.244 | 24 | 0 |
| **50%** | 3 | 117 | 72 | 23 | 30.5 | 32.00 | 0.373 | 29 | 0 |
| **75%** | 6 | 140.25 | 80 | 32 | 127.25 | 36.60 | 0.626 | 41 | 1 |
| **max** | 17 | 199 | 122 | 99 | **846** | 67.10 | 2.420 | 81 | 1 |

(DPF = DiabetesPedigreeFunction. Trong ảnh slide, PyCharm tô đỏ dòng
`count` và ô max của Insulin = 846 vì đó là những giá trị lớn nhất bảng —
một gợi ý trực quan rằng 846 "khác thường".)

#### 3.4.1. Ý nghĩa từng dòng

**count — số giá trị không bị thiếu (non-null).**
Cả 9 cột đều 768 = số dòng → không có ô trống. Nếu một cột có count nhỏ
hơn số dòng, cột đó có ô NaN (thiếu).

**mean — trung bình cộng.**
```
mean = (x₁ + x₂ + … + xₙ) / n
```
Glucose trung bình 120.89 mg/dL; tuổi trung bình 33.24. Mean **nhạy với
giá trị cực trị** — một vài người Insulin rất cao kéo mean Insulin lên
79.8, trong khi người "ở giữa" chỉ có 30.5 (xem 50%).

**std — độ lệch chuẩn (standard deviation).**
```
std = √[ Σ (xᵢ − mean)² / (n − 1) ]
```
Đo các giá trị **phân tán quanh mean xa bao nhiêu**, cùng đơn vị với dữ
liệu. Glucose có std ≈ 32: phần lớn người có Glucose trong khoảng vài chục
đơn vị quanh 121. Insulin có std (115) **lớn hơn cả mean** (80) → phân tán
cực mạnh, dấu hiệu dữ liệu lệch hoặc có vấn đề.
Lưu ý: pandas chia cho **n − 1** (độ lệch chuẩn mẫu — *sample std*), không
chia cho n *(bổ sung)*. Với n = 768 hai cách gần như bằng nhau; với mẫu
nhỏ thì khác rõ (mục 4).

**min / max — nhỏ nhất / lớn nhất.**
Kiểm tra **khoảng giá trị có hợp lý** không. Age từ 21 đến 81: hợp lý (bộ
dữ liệu chỉ gồm người từ 21 tuổi). Nhưng Glucose, BloodPressure,
SkinThickness, Insulin, BMI đều có **min = 0** → vô lý về mặt y học. Max
Insulin = 846, SkinThickness = 99 mm, Pregnancies = 17 → đáng nghi là
outlier, cần xem ở Step 3.2.

**25%, 50%, 75% — các tứ phân vị (quartiles).**
Sắp xếp các giá trị tăng dần rồi chia làm 4 phần bằng nhau:

- **25% (Q1)**: một phần tư số người có giá trị **≤** con số này. Glucose
  Q1 = 99 → 25% người có Glucose ≤ 99.
- **50% (Q2 = median, trung vị)**: điểm chính giữa. Glucose median = 117
  → một nửa ≤ 117, một nửa ≥ 117.
- **75% (Q3)**: ba phần tư số người ≤ con số này. Glucose Q3 = 140.25.

Khi vị trí rơi vào giữa hai giá trị, pandas **nội suy tuyến tính** — đó là
lý do có số lẻ như 140.25 dù Glucose toàn số nguyên (cách tính ở mục 4).

> **EN:** `describe()` computes 8 numbers per numeric column (table
> above, matching the slide). **count** = non-null values (768
> everywhere → no empty cells). **mean** = arithmetic average, sensitive
> to extremes (Insulin mean 79.8 vs median 30.5). **std** = spread around
> the mean in the data's unit; Insulin's std (115) exceeds its mean (80) —
> extremely spread. pandas divides by **n − 1** (sample std).
> **min/max** check plausibility: Age 21–81 is fine, but five columns have
> **min = 0**, medically impossible; Insulin 846, SkinThickness 99 and
> Pregnancies 17 are outlier suspects. **25% / 50% / 75%** are the
> quartiles Q1, median, Q3 — e.g. a quarter of patients have Glucose ≤ 99;
> pandas interpolates linearly, hence values like 140.25.

#### 3.4.2. Đọc bảng describe() như một bác sĩ *(Bổ sung — phân tích của Claude)*

**(a) Mean so với median → phân bố lệch.**

| | mean | median (50%) | skew |
|---|---|---|---|
| Glucose | 120.89 | 117.0 | 0.17 |
| Insulin | 79.80 | 30.5 | 2.27 |

- Glucose: mean ≈ median → phân bố **gần cân đối**.
- Insulin: mean **gấp 2.6 lần** median → phân bố **lệch phải mạnh** (đuôi
  dài về phía giá trị lớn): đa số giá trị nhỏ (và rất nhiều số 0), vài
  giá trị cực lớn (846) kéo mean lên. Hệ số `skew()` > 1 xác nhận điều
  này.

Quy tắc nhanh: **mean > median → lệch phải; mean < median → lệch trái;
gần bằng → gần đối xứng.** Với dữ liệu lệch, **median đại diện cho "người
điển hình" tốt hơn mean** — giống thu nhập: vài tỉ phú kéo mean thu nhập
lên rất cao, nhưng median mới phản ánh người bình thường.

**(b) IQR — khoảng tứ phân vị.**
`IQR = Q3 − Q1`. Glucose: 140.25 − 99 = **41.25** → 50% người ở giữa có
Glucose trải trong khoảng 41.25 mg/dL. IQR chính là công cụ phát hiện
outlier ở Step 3.2 (P02).

**(c) Thang đo rất khác nhau.**
DiabetesPedigreeFunction nằm trong khoảng 0.078–2.42, còn Insulin 0–846.
Nhiều model (KNN, SVM, Logistic Regression có regularization…) sẽ bị cột
có số lớn "lấn át" → cần chuẩn hóa ở Step 3.3.

**(d) Cột Outcome: mean = tỉ lệ class 1.**
Vì Outcome chỉ gồm 0 và 1, tổng của nó = số người bệnh = 268, nên
**mean = 268 / 768 ≈ 0.349** = **34.9% người trong dataset mắc tiểu
đường**. Median = 0 vì hơn một nửa là 0. Đây là mẹo hay: `mean` của một
cột 0/1 luôn là tỉ lệ class 1.

> **EN:** *(Supplementary — Claude's analysis)* (a) **Mean vs median
> reveals skew**: Glucose 120.9 vs 117 (≈ symmetric, skew 0.17); Insulin
> 79.8 vs 30.5 (strong right skew, skew 2.27). Rule: mean > median → right
> skew; for skewed data the **median better represents a typical value**
> (like incomes). (b) **IQR = Q3 − Q1**: Glucose 41.25 — the tool for
> outlier detection in step 3.2. (c) **Very different scales** (DPF up to
> 2.42 vs Insulin up to 846) → scaling in step 3.3. (d) **The mean of a
> 0/1 column is the share of class 1**: Outcome mean ≈ 0.349 → 34.9% of
> patients are diabetic.

### 3.5. Phân bố class — Category distribution (slide 44)

```python
count_class = data.groupby('Outcome').size()
print(count_class)
```

```
Outcome
0    500
1    268
```

- `groupby('Outcome')` gom các dòng có cùng giá trị Outcome thành nhóm;
  `.size()` đếm số dòng mỗi nhóm.
- Kết quả: **500** người không bệnh (65.1%), **268** người bệnh (34.9%);
  500 / 268 ≈ **1.87 : 1**. Khớp với mean Outcome = 0.349 ở trên.

#### Vì sao con số này quan trọng? *(Bổ sung — nối bài 09, 12 và báo trước Step 3.5)*

Đây là dataset **mất cân bằng (imbalanced)**, dù nhẹ hơn ví dụ Cat 90 /
Dog 10 ở bài 09. Ba hệ quả:

**(1) Bẫy Accuracy (bài 12).** Một model "lười" luôn đoán **0 — không
bệnh** đạt Accuracy = 500 / 768 ≈ **65.1%** mà chẳng học gì, và Recall =
0 (bỏ sót **toàn bộ** 268 người bệnh). Vậy với dataset này, một model có
Accuracy 70% **không hề ấn tượng**; phải nhìn Recall, Precision, F1 của
class 1. Bài 15 đã thấy đúng chuyện này: model Logistic Regression đạt
Accuracy 0.708 nhưng Recall chỉ 0.5.

**(2) Chia dữ liệu phải stratified (bài 07, 09).** Khi chia train/test hay
K-fold, dùng `stratify=y` / `StratifiedKFold` để mỗi phần đều giữ tỉ lệ
~65 / 35. Nếu không, một fold có thể ít người bệnh hơn hẳn và điểm đánh giá
dao động thất thường.

**(3) Model có xu hướng nghiêng về class đông.** Vì thấy class 0 nhiều gần
gấp đôi, model dễ "an toàn" đoán 0. **Step 3.5 Balance data** (slide
52–54) sẽ học cách sửa: **over-sampling** (nhân thêm / sinh thêm mẫu class
thiểu số, ví dụ SMOTE) hoặc **under-sampling** (bớt mẫu class đa số).

Bối cảnh thực tế: trong y tế, class "có bệnh" hầu như luôn là class thiểu
số, và cũng là class ta **quan tâm nhất** — bỏ sót một người bệnh (FN) đắt
hơn nhiều so với gọi nhầm một người khỏe đi xét nghiệm lại (FP).

> **EN:** `groupby('Outcome').size()` counts rows per class: **500**
> negatives (65.1%) and **268** positives (34.9%), ≈ **1.87 : 1** —
> matching the Outcome mean. *(Supplementary)* The dataset is
> **imbalanced**, though milder than lesson 09's 90/10. Consequences:
> (1) **accuracy trap** (lesson 12) — always predicting 0 scores ≈ 65.1%
> accuracy with zero Recall, so 70% accuracy is unimpressive here (lesson
> 15's model: accuracy 0.708, Recall 0.5); (2) splits must be
> **stratified** (lessons 07, 09); (3) models lean toward the majority
> class — **Step 3.5 Balance data** (slides 52–54) fixes this with
> over-sampling (e.g. SMOTE) or under-sampling. In medicine the "disease"
> class is usually the minority *and* the one we care about most.

### 3.6. Giá trị 0 bất thường — dữ liệu thiếu trá hình *(Bổ sung — slide không nêu trực tiếp; gối đầu sang Step 3.1)*

`count` = 768 ở mọi cột và `data.isna().sum()` = 0 khiến ta tưởng dữ liệu
đầy đủ. Nhưng **min = 0** ở 5 cột mà về mặt sinh học **không thể bằng 0**
ở người còn sống. Nhiều khả năng người nhập liệu đã ghi 0 khi **không đo**
hoặc **không có kết quả**. Đếm số 0 của từng cột:

| Cột | Số giá trị 0 | Tỉ lệ | 0 có hợp lý không? |
|---|---|---|---|
| Glucose | 5 | 0.65% | Không — đường huyết 0 là không thể |
| BloodPressure | 35 | 4.56% | Không — huyết áp 0 là không thể |
| SkinThickness | 227 | 29.56% | Không — nếp gấp da không thể dày 0 mm |
| Insulin | 374 | **48.70%** | Không — gần nửa số người "thiếu" xét nghiệm này |
| BMI | 11 | 1.43% | Không — BMI 0 nghĩa là nặng 0 kg |
| Pregnancies | 111 | 14.45% | **Có** — chưa từng mang thai là bình thường |
| Outcome | 500 | 65.10% | **Có** — 0 là một class |

Chính bảng `describe()` đã "tố" điều này, nếu đọc kỹ:

- **min = 0** ở 5 cột trên → có ít nhất một giá trị 0 vô lý.
- **25% = 0** ở SkinThickness và Insulin → **ít nhất 25%** số dòng bằng 0
  (thực tế 29.56% và 48.70%).
- **Median Insulin = 30.5** quá thấp so với giá trị insulin sau nghiệm
  pháp thường gặp → vì gần một nửa cột là 0, median bị kéo xuống.

Nếu coi các số 0 này là **thiếu (NaN)** và tính lại thống kê:

| Cột | count | mean (trước → sau) | median (trước → sau) | min (trước → sau) |
|---|---|---|---|---|
| Glucose | 763 | 120.89 → 121.69 | 117 → 117 | 0 → 44 |
| BloodPressure | 733 | 69.11 → 72.41 | 72 → 72 | 0 → 24 |
| SkinThickness | 541 | 20.54 → 29.15 | 23 → 29 | 0 → 7 |
| Insulin | 394 | 79.80 → **155.55** | 30.5 → **125** | 0 → 14 |
| BMI | 757 | 31.99 → 32.46 | 32 → 32.3 | 0 → 18.2 |

Mean Insulin **gần gấp đôi**, median **gấp 4 lần** → nếu để nguyên số 0,
model sẽ học một bức tranh sai về Insulin.

Có **376 / 768 dòng (49%)** chứa ít nhất một số 0 vô lý ở 5 cột trên → nếu
xóa hết các dòng đó thì mất gần nửa dataset. Vì vậy cần các cách thông
minh hơn (điền median, điền theo nhóm…) — nội dung của **Step 3.1 Handle
missing or invalid values** ở bài sau.

Bài học chung: **dữ liệu thiếu không phải lúc nào cũng là ô trống.** Nó
có thể trốn dưới dạng 0, −1, 999, "N/A", "?"… Chỉ phát hiện được khi kết
hợp thống kê với **hiểu biết về ý nghĩa cột** (domain knowledge).

> **EN:** *(Supplementary — not stated in the slides; a lead-in to step
> 3.1)* count = 768 and `isna().sum()` = 0 suggest complete data, but five
> columns have **min = 0**, biologically impossible. Zeros were likely
> entered when a measurement wasn't taken: Glucose 5, BloodPressure 35,
> SkinThickness 227 (29.6%), Insulin 374 (**48.7%**), BMI 11. Zeros in
> Pregnancies and Outcome are legitimate. `describe()` already hinted it:
> min = 0, **25% = 0** for SkinThickness and Insulin (≥ 25% zeros), and an
> implausibly low Insulin median (30.5). Treating the zeros as NaN raises
> Insulin's mean from 79.8 to 155.6 and its median from 30.5 to 125. 376
> of 768 rows (49%) contain at least one such zero, so dropping them would
> lose half the data — step 3.1 covers better options. Missing data isn't
> always blank: it can hide as 0, −1, 999, "N/A"… — spotting it needs
> **domain knowledge**.

### 3.7. So sánh theo class *(Bổ sung)*

Một câu lệnh nữa cho thấy feature nào có vẻ "phân biệt" được hai class:

```python
data.groupby("Outcome").mean()
```

| Feature | Outcome = 0 | Outcome = 1 |
|---|---|---|
| Glucose | 109.98 | **141.26** |
| BMI | 30.30 | 35.14 |
| Age | 31.19 | 37.07 |
| Pregnancies | 3.30 | 4.87 |
| BloodPressure | 68.18 | 70.82 |

Người mắc bệnh có Glucose trung bình cao hơn ~31 mg/dL — chênh lệch lớn
nhất so với độ phân tán của cột → Glucose nhiều khả năng là feature quan
trọng nhất. BloodPressure gần như không khác. (Các con số này vẫn còn
chứa số 0 vô lý, nên chỉ để tham khảo.) Step 4 sẽ **vẽ** sự khác biệt này
thành biểu đồ cho dễ thấy hơn.

> **EN:** *(Supplementary)* `groupby("Outcome").mean()` compares classes:
> diabetic patients average Glucose 141.3 vs 110.0 — the largest gap
> relative to spread, so Glucose is likely the most informative feature;
> BloodPressure barely differs. (Still includes invalid zeros — indicative
> only.) Step 4 will **plot** these differences.

## 4. Ví dụ tay

Tính `describe()` bằng tay cho cột **Glucose** trên **15 dòng của slide
40**.

**Dữ liệu (theo thứ tự trên slide):** 148, 85, 183, 89, 137, 116, 78, 115,
197, 125, 110, 168, 139, 189, 166.

**Sắp xếp tăng dần** (đánh vị trí từ 0 đến 14):

| Vị trí | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Giá trị | 78 | 85 | 89 | 110 | 115 | 116 | 125 | 137 | 139 | 148 | 166 | 168 | 183 | 189 | 197 |

**count** = 15. **min** = 78. **max** = 197.

**mean** = 2045 / 15 ≈ **136.33**.

**std** — bảng độ lệch:

| x | x − mean | (x − mean)² |
|---|---|---|
| 78 | −58.33 | 3402.78 |
| 85 | −51.33 | 2635.11 |
| 89 | −47.33 | 2240.44 |
| 110 | −26.33 | 693.44 |
| 115 | −21.33 | 455.11 |
| 116 | −20.33 | 413.44 |
| 125 | −11.33 | 128.44 |
| 137 | 0.67 | 0.44 |
| 139 | 2.67 | 7.11 |
| 148 | 11.67 | 136.11 |
| 166 | 29.67 | 880.11 |
| 168 | 31.67 | 1002.78 |
| 183 | 46.67 | 2177.78 |
| 189 | 52.67 | 2773.78 |
| 197 | 60.67 | 3680.44 |
| | **Tổng** | **20627.33** |

- Chia n − 1 = 14 (cách của pandas): 20627.33 / 14 ≈ 1473.38 → std =
  √1473.38 ≈ **38.38**.
- Nếu chia n = 15 (độ lệch chuẩn tổng thể): √(20627.33 / 15) ≈ 37.08 —
  khác nhau khoảng 1.3 đơn vị vì mẫu nhỏ.

**Tứ phân vị** — pandas lấy vị trí `p × (n − 1)`, nếu lẻ thì nội suy giữa
hai giá trị kề nhau:

- **25%**: vị trí 0.25 × 14 = **3.5** → giữa vị trí 3 (110) và 4 (115) →
  110 + 0.5 × (115 − 110) = **112.5**
- **50%**: vị trí 0.5 × 14 = **7** → đúng vị trí 7 = **137**
- **75%**: vị trí 0.75 × 14 = **10.5** → giữa 166 và 168 → **167**

Kết quả: count 15, mean 136.33, std 38.38, min 78, 25% 112.5, 50% 137,
75% 167, max 197 — khớp với `data["Glucose"].head(15).describe()`.

**Thêm cột Insulin trên cùng 15 dòng:** 0, 0, 0, 94, 168, 0, 88, 0, 543,
0, 0, 0, 0, 846, 175 → **9 / 15 giá trị bằng 0**.

- mean = (94 + 168 + 88 + 543 + 846 + 175) / 15 = 1914 / 15 = **127.6**
- median = vị trí 7 của dãy đã sắp xếp = **0** (vì 9 số đầu đều là 0)
- 25% = 0; 75% = vị trí 10.5 → giữa 94 và 168 = **131**

Median = 0 trong khi mean = 127.6 — một tín hiệu cực mạnh rằng có vấn đề:
"người điển hình" có insulin bằng 0 là không thể.

**Outcome trên 15 dòng:** 9 người bệnh / 6 người không → **60% bệnh**,
ngược hẳn với 34.9% của toàn bộ 768 dòng. Bài học: **đừng kết luận từ vài
dòng đầu** — luôn tính trên toàn bộ dataset.

> **EN:** Hand-computing `describe()` for **Glucose** on slide 40's 15
> rows. Sorted: 78 … 197; count 15, min 78, max 197, mean 2045/15 ≈
> 136.33. Squared deviations sum to 20627.33 → sample std (÷14) ≈ 38.38
> (population std ÷15 ≈ 37.08). Quartile positions p × (n − 1): 3.5 →
> 112.5, 7 → 137, 10.5 → 167 — matching pandas. **Insulin** on the same
> rows: 9 of 15 are zero, mean 127.6 but median 0 — a typical patient with
> zero insulin is impossible. **Outcome**: 9 of 15 positive (60%) versus
> 34.9% overall — never draw conclusions from the first few rows.

## 5. Code

Cần file `diabetes.csv` (Pima Indians Diabetes Database, có trên Kaggle)
cùng thư mục.

### 5.1. Xem dữ liệu (slide 41)

```python
import pandas as pd

pd.set_option("display.width", 200)
pd.set_option("display.max_columns", 20)

data = pd.read_csv("diabetes.csv", delimiter=",")
print(data.head())     # 5 dòng đầu
print(data.shape)      # (768, 9)
```

### 5.2. Kiểu dữ liệu từng feature (slide 42)

```python
print(data.dtypes)
# Pregnancies                   int64
# Glucose                       int64
# BloodPressure                 int64
# SkinThickness                 int64
# Insulin                       int64
# BMI                         float64
# DiabetesPedigreeFunction    float64
# Age                           int64
# Outcome                       int64

data.info()   # (bổ sung) thêm số non-null: cột nào cũng 768 non-null
```

### 5.3. Tóm tắt thống kê (slide 43)

```python
from pandas import read_csv

data = read_csv("diabetes.csv")
out = data.describe()
print(out.round(2).T)   # .T: xoay bảng cho dễ đọc khi nhiều cột
```

### 5.4. Phân bố class (slide 44)

```python
count_class = data.groupby('Outcome').size()
print(count_class)
# Outcome
# 0    500
# 1    268

# (bổ sung) tỉ lệ và baseline
print(data["Outcome"].value_counts(normalize=True).round(4))  # 0: 0.651, 1: 0.349
print(f"Baseline luôn đoán 0: {count_class[0] / len(data):.4f}")    # 0.6510
print(f"Tỉ lệ 0:1 = {count_class[0] / count_class[1]:.2f} : 1")     # 1.87 : 1
```

### 5.5. Phát hiện dữ liệu thiếu trá hình *(Bổ sung)*

```python
import numpy as np

print(data.isna().sum().sum())          # 0 -> không có ô trống...

zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
zeros = (data[zero_cols] == 0).sum()
print(pd.DataFrame({"so_0": zeros,
                    "ti_le_%": (zeros / len(data) * 100).round(2)}))
#                so_0  ti_le_%
# Glucose           5     0.65
# BloodPressure    35     4.56
# SkinThickness   227    29.56
# Insulin         374    48.70
# BMI              11     1.43

print((data[zero_cols] == 0).any(axis=1).sum())   # 376 dòng có ít nhất một số 0 vô lý

# Coi 0 là NaN rồi xem lại thống kê (chỉ để KHÁM, chưa sửa dữ liệu gốc)
clean = data.copy()
clean[zero_cols] = clean[zero_cols].replace(0, np.nan)
print(clean[zero_cols].describe().round(2).T)

# Mean, median, độ lệch
print(data[["Glucose", "Insulin"]].agg(["mean", "median", "skew"]).round(2))

# So sánh theo class
print(data.groupby("Outcome").mean().round(2).T)
```

### 5.6. Kiểm tra ví dụ tay *(Bổ sung)*

```python
g = data["Glucose"].head(15)
print(sorted(g))
print(g.mean(), g.std(), g.std(ddof=0))     # 136.33  38.38  37.08
print(g.quantile([0.25, 0.5, 0.75]).tolist())  # [112.5, 137.0, 167.0]
print(data["Insulin"].head(15).describe())   # mean 127.6, 50% = 0, 75% = 131
```

> **EN:** Code mirroring slides 41–44 (`read_csv`, `dtypes`,
> `describe()`, `groupby('Outcome').size()`), plus supplementary checks:
> `info()`, class shares and the always-0 baseline, counting impossible
> zeros, recomputing statistics with zeros treated as NaN (inspection only
> — the data isn't modified yet), mean/median/skew, per-class means, and a
> check of the hand-computed example.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** `data.info()` cho thấy mọi cột của Diabetes dataset đều có 768
non-null. Có thể kết luận dataset không có dữ liệu thiếu không? Vì sao?
> **Đáp án:** Không. Không có ô trống (NaN), nhưng có các giá trị **0 vô
> lý** ở Glucose, BloodPressure, SkinThickness, Insulin, BMI — thực chất
> là dữ liệu thiếu được ghi bằng 0 (ví dụ Insulin có 374 số 0, chiếm
> 48.7%). Phải kết hợp thống kê với hiểu biết về ý nghĩa cột mới phát
> hiện được.

**Câu 2:** Trong bảng `describe()`, cột Insulin có 25% = 0 và 50% = 30.5.
Hai con số này cho biết điều gì?
> **Đáp án:** 25% = 0 nghĩa là **ít nhất một phần tư** số dòng có Insulin
> = 0. Median chỉ 30.5 (trong khi mean = 79.8) cho thấy phân bố lệch phải
> mạnh và bị kéo xuống bởi rất nhiều số 0. Cả hai đều là dấu hiệu dữ liệu
> thiếu trá hình.

**Câu 3:** Cột Outcome có mean = 0.349. Con số này có ý nghĩa gì?
> **Đáp án:** Vì Outcome chỉ gồm 0 và 1, mean = (số người mang nhãn 1) /
> (tổng số người) = 268 / 768 ≈ 0.349 → **34.9% người trong dataset mắc
> tiểu đường**.

**Câu 4:** Với phân bố 500 / 268, một model đạt Accuracy 68% có tốt
không? Cần xem thêm gì?
> **Đáp án:** Không đáng tin. Model luôn đoán "không bệnh" đã đạt 500 /
> 768 ≈ 65.1%, nên 68% chỉ hơn khoảng 3 điểm. Cần xem Recall, Precision,
> F1 của class 1 (người bệnh) — bài 12 — và nên chia dữ liệu bằng
> stratified (bài 09). Step 3.5 Balance data sẽ học cách cân bằng class.

**Câu 5:** Tính count, mean, std (chia n − 1), min, 25%, 50%, 75%, max
cho dãy `[2, 4, 4, 5, 10]` theo cách của pandas.
> **Đáp án:** count = 5; mean = 25 / 5 = **5**; độ lệch: −3, −1, −1, 0, 5
> → tổng bình phương = 9 + 1 + 1 + 0 + 25 = 36 → std = √(36 / 4) = **3**;
> min = 2; 25%: vị trí 0.25 × 4 = 1 → **4**; 50%: vị trí 2 → **4**; 75%:
> vị trí 3 → **5**; max = 10. Mean (5) > median (4) → hơi lệch phải do số
> 10.

**Câu 6:** `data.dtypes` cho thấy Outcome là `int64`. Có nên coi Outcome là
một feature số liên tục như Glucose không?
> **Đáp án:** Không. dtype chỉ là cách lưu trữ. Về ý nghĩa, Outcome là
> **biến phân loại nhị phân** (0 = không bệnh, 1 = bệnh) và là **label**
> của bài toán Classification; các giá trị 0, 1 là tên class, không phải
> đại lượng đo được.

> **EN:**
>
> **Q1:** `info()` shows 768 non-null in every column. Is there no
> missing data?
> > **A:** No. There are no NaNs, but impossible **zeros** in Glucose,
> > BloodPressure, SkinThickness, Insulin and BMI are missing values in
> > disguise (Insulin: 374 zeros, 48.7%). Spotting them needs domain
> > knowledge.
>
> **Q2:** Insulin has 25% = 0 and median 30.5. What do they tell you?
> > **A:** At least a quarter of rows are zero; the low median (vs mean
> > 79.8) shows strong right skew dragged down by many zeros — both signs
> > of disguised missing data.
>
> **Q3:** What does Outcome's mean of 0.349 mean?
> > **A:** For a 0/1 column the mean is the share of class 1: 268 / 768 ≈
> > 34.9% of patients are diabetic.
>
> **Q4:** With 500 / 268, is 68% accuracy good? What else to check?
> > **A:** Not convincing — always predicting "no diabetes" scores ≈
> > 65.1%. Check Recall, Precision and F1 for class 1 (lesson 12), use
> > stratified splits (lesson 09); step 3.5 covers balancing.
>
> **Q5:** pandas-style describe for `[2, 4, 4, 5, 10]`.
> > **A:** count 5, mean 5, std 3 (36 / 4 = 9), min 2, 25% 4, 50% 4, 75%
> > 5, max 10; mean > median → slight right skew from the 10.
>
> **Q6:** Outcome's dtype is `int64`. Is it a continuous numeric feature
> like Glucose?
> > **A:** No — dtype is just storage. Outcome is a **binary categorical**
> > variable and the **label** of a Classification task; 0 and 1 are class
> > names, not measurements.
