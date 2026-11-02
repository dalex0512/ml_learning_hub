---
title: Step 3.4 — Correlation và Multicollinearity
order: 20
description: Hệ số tương quan Pearson đo mức quan hệ tuyến tính giữa hai biến (slide 50) — cách tính, cách đọc, vì sao correlation không phải causation; và hiện tượng đa cộng tuyến giữa các feature với ngưỡng |r| > 0.7 (slide 51).
---

## 1. Ý tưởng

Sau khi làm sạch và biến đổi từng cột riêng lẻ (bài 17–19), Step 3.4 nhìn
**các cột trong quan hệ với nhau**. Có hai câu hỏi khác nhau, slide 50 và
51 trả lời lần lượt:

1. **Feature nào liên quan đến target?** (slide 50 — *Mối quan hệ giữa các
   variables (features, target)*) — ví dụ Glucose cao thì khả năng mắc
   tiểu đường có cao hơn không? Liên quan mạnh là **tốt**: feature đó
   hữu ích cho việc dự đoán.
2. **Các feature có "nói cùng một điều" không?** (slide 51 — *Mối quan hệ
   giữa các features*) — ví dụ diện tích căn hộ và số phòng ngủ gần như
   luôn đi cùng nhau. Hai feature quá giống nhau là **xấu** với một số
   model: đó là **(đa) cộng tuyến — multicollinearity**, bước 04 *Remove
   multicollinearity* trên slide 45.

Công cụ chung cho cả hai: **hệ số tương quan (correlation coefficient)**.

> **EN:** After cleaning and transforming single columns (lessons 17–19),
> step 3.4 looks at **columns in relation to each other**. Two questions:
> (1) **does a feature relate to the target?** (slide 50) — strong
> relation is **good**, the feature is useful; (2) **do features say the
> same thing?** (slide 51) — e.g. flat area and number of bedrooms; highly
> similar features are **bad** for some models — **multicollinearity**,
> sub-step 04 on slide 45. The shared tool is the **correlation
> coefficient**.

## 2. Vị trí trong pipeline

```
3.1 Missing → 3.2 Outliers → 3.3 Scaling, Encoding → [ 3.4 Correlation & Multicollinearity ] → 3.5 Balance (bài 21)
```

- **Bài 16**: `groupby("Outcome").mean()` cho thấy người bệnh có Glucose
  trung bình cao hơn ~31 mg/dL. Correlation biến nhận xét đó thành **một
  con số**.
- **Bài 17**: dữ liệu thiếu trá hình (số 0) làm **sai lệch** correlation —
  ví dụ ở mục 3.6.
- **Bài 19**: bộ cột one-hot đầy đủ luôn cộng lại bằng 1 — một trường hợp
  multicollinearity "hoàn hảo" (*dummy variable trap*).
- **Sau này**: heatmap correlation (module 04), chọn feature theo
  correlation (P13), PCA dùng covariance / correlation (P14), regularization
  giảm tác hại của multicollinearity (P12).

> **EN:** Lesson 16's per-class means become a single number here; lesson
> 17's disguised zeros distort correlations (section 3.6); lesson 19's
> full one-hot set is perfect multicollinearity (dummy variable trap).
> Later: correlation heatmaps (module 04), feature selection (P13), PCA
> (P14), regularization (P12).

## 3. Công thức / cách hoạt động

### 3.1. Correlation là gì (slide 50)

Ba gạch đầu dòng của slide:

- **Mức độ 2 hay nhiều variables quan hệ tuyến tính với nhau.**
  "Tuyến tính" nghĩa là khi biến này tăng, biến kia tăng (hoặc giảm) theo
  một **đường thẳng**.
- **Hệ số tương quan nằm trong [−1, 1].**
- **Correlation does not imply causation** — tương quan **không** có nghĩa
  là nhân quả (mục 3.4).

Chú ý chữ **variables** ở slide 50 (tô tím) so với **features** ở slide 51
(tô đỏ): slide 50 nói về mọi biến — cả feature lẫn target; slide 51 chỉ nói
về quan hệ **giữa các feature**.

> **EN:** Slide 50: correlation is the degree to which two or more
> **variables** relate **linearly**; the coefficient lies in **[−1, 1]**;
> **correlation does not imply causation**. Note "variables" (features
> and target) on slide 50 vs "features" on slide 51.

### 3.2. Công thức Pearson (slide 50)

```
            Σ (xᵢ − x̄)(yᵢ − ȳ)
r_xy = ─────────────────────────────
        √[ Σ (xᵢ − x̄)² · Σ (yᵢ − ȳ)² ]
```

Các ký hiệu theo slide:

- r_xy — hệ số tương quan giữa x và y
- xᵢ, yᵢ — giá trị của x, y ở mẫu thứ i
- x̄, ȳ — trung bình của x, y trong mẫu

Hiểu công thức theo từng phần *(bổ sung)*:

- **Tử số** — cộng các tích (xᵢ − x̄)(yᵢ − ȳ). Nếu một điểm có x **trên**
  trung bình và y cũng **trên** trung bình (hoặc cả hai cùng dưới), tích
  **dương**; nếu một trên một dưới, tích **âm**. Tổng dương → hai biến hay
  "cùng phía" → tương quan dương. Tử số chia cho n − 1 chính là
  **covariance** (hiệp phương sai — P14).
- **Mẫu số** — tích độ phân tán của từng biến. Chia cho nó để **bỏ đơn vị**
  và ép kết quả vào [−1, 1]. Nhờ vậy r không đổi khi đổi đơn vị (cm hay m,
  kg hay g) — và **không đổi khi scale** (bài 18).

> **EN:** Pearson's formula (slide 50): r = Σ(xᵢ − x̄)(yᵢ − ȳ) /
> √[Σ(xᵢ − x̄)² Σ(yᵢ − ȳ)²]. *(Supplementary)* The numerator adds products
> that are positive when both values sit on the same side of their means
> — divided by n − 1 it is the **covariance** (P14). The denominator
> removes units and bounds r to [−1, 1], so r is unchanged by unit changes
> or scaling (lesson 18).

### 3.3. Đọc hệ số r (hình scatter slide 50)

Slide vẽ 6 scatter plot với r = 0.7, 0.3, 0 (hàng trên) và −0.7, −0.3, 0
(hàng dưới):

| r | Hình dạng | Ý nghĩa |
|---|---|---|
| **1** | Mọi điểm nằm trên một đường thẳng đi lên | Tương quan dương hoàn hảo |
| **0.7** | Đám điểm dẹt, rõ xu hướng đi lên | Dương, mạnh |
| **0.3** | Đám điểm khá tròn, hơi nghiêng lên | Dương, yếu |
| **0** | Đám điểm tròn, đường xu hướng nằm ngang | Không có quan hệ **tuyến tính** |
| **−0.3** | Hơi nghiêng xuống | Âm, yếu |
| **−0.7** | Rõ xu hướng đi xuống | Âm, mạnh |
| **−1** | Mọi điểm trên một đường thẳng đi xuống | Âm hoàn hảo |

- **Dấu** cho biết **chiều**: dương = cùng tăng; âm = một tăng một giảm.
- **Độ lớn |r|** cho biết **độ chặt** quanh đường thẳng — **không** phải độ
  dốc. Một đường rất thoải nhưng các điểm nằm sát trên nó vẫn có r ≈ 1.

Thang đọc tham khảo *(bổ sung — quy ước, mỗi lĩnh vực mỗi khác)*: |r| <
0.3 yếu; 0.3–0.7 trung bình; > 0.7 mạnh — ngưỡng 0.7 trùng với ngưỡng
multicollinearity của slide 51.

**Hình bên dưới slide 50 — doanh số theo nhiệt độ** *(diễn giải của
Claude; slide không ghi chú thích)*. Trục ngang là nhiệt độ 10–45 °C, trục
dọc là doanh số ($0–$700). Doanh số **tăng** từ ~$190 ở 12 °C lên đỉnh
~$610 ở khoảng 25 °C, rồi **giảm** dần về ~$215 ở 41 °C — đám điểm có hình
**chữ U ngược**. Quan hệ rất rõ, nhưng **không thẳng**: nửa trái đi lên,
nửa phải đi xuống, hai nửa triệt tiêu nhau. Đọc gần đúng 21 điểm trên hình
rồi tính, được **r ≈ 0.007** — gần như bằng 0! Nếu chỉ tính riêng từng nửa
thì r ≈ +0.96 (≤ 25 °C) và r ≈ −0.94 (≥ 25 °C).

Bài học: **r ≈ 0 chỉ có nghĩa là "không có quan hệ tuyến tính", không phải
"không có quan hệ".** Luôn **vẽ scatter plot** (module 04) trước khi kết
luận từ một con số.

> **EN:** Slide 50's six scatter plots (r = ±0.7, ±0.3, 0): the **sign**
> gives direction; **|r|** gives tightness around a line — not the slope.
> *(Supplementary)* Rough guide: |r| < 0.3 weak, 0.3–0.7 moderate, > 0.7
> strong. *(Claude's reading of the lower chart)* Sales rise from ~$190 at
> 12 °C to ~$610 near 25 °C, then fall to ~$215 at 41 °C — an inverted U.
> Using ~21 points read off the chart, **r ≈ 0.007**, although the halves
> give r ≈ +0.96 and −0.94. **r ≈ 0 means no *linear* relationship, not
> no relationship** — always plot first (module 04).

### 3.4. Correlation does not imply causation

Hai biến đi cùng nhau **không** chứng minh biến này **gây ra** biến kia. Ba
khả năng thường gặp *(bổ sung — ví dụ tự soạn)*:

- **Biến ẩn (confounder) gây ra cả hai.** Ở Hà Nội mùa hè, số máy điều hòa
  bán ra và số ca sốc nhiệt cùng tăng — không phải điều hòa gây sốc nhiệt;
  cả hai đều do **nắng nóng**. Tương tự, doanh số kem và số vụ đuối nước
  cùng tăng vào mùa hè.
- **Nhân quả ngược chiều.** Bệnh viện đông bác sĩ thường có tỉ lệ tử vong
  cao — vì bệnh nhân nặng được chuyển tới bệnh viện lớn, không phải vì bác
  sĩ làm tăng tử vong.
- **Trùng hợp.** Hai chuỗi số cùng tăng theo thời gian (giá vàng và số
  thuê bao Internet) sẽ có r cao dù chẳng liên quan.

Với ML: model chỉ cần **dự đoán**, nên một feature tương quan với target
vẫn hữu ích dù không phải nguyên nhân. Nhưng **đừng diễn giải** thành
"tăng feature này sẽ làm thay đổi target" — đó là câu hỏi nhân quả, cần
thí nghiệm hoặc phương pháp khác. Trong Diabetes dataset, Age tương quan
dương với Outcome (r = 0.24), nhưng tuổi không "gây" tiểu đường trực tiếp —
tuổi đi kèm nhiều yếu tố khác.

> **EN:** Co-movement doesn't prove cause. *(Supplementary — own
> examples)* **Confounders** (air-conditioner sales and heatstroke cases
> both rise with summer heat; ice-cream sales and drownings),
> **reverse causation** (hospitals with more doctors have higher death
> rates because severe cases are sent there), **coincidence** (two rising
> time series). For ML, a correlated feature still helps **prediction**,
> but don't interpret it causally — Age correlates with Outcome (r =
> 0.24) without directly causing diabetes.

### 3.5. Correlation trên Diabetes dataset *(Bổ sung)*

**Feature với target** — `data.corr()["Outcome"]`:

| Feature | r với Outcome |
|---|---|
| Glucose | **0.467** |
| BMI | 0.293 |
| Age | 0.238 |
| Pregnancies | 0.222 |
| DiabetesPedigreeFunction | 0.174 |
| Insulin | 0.131 |
| SkinThickness | 0.075 |
| BloodPressure | 0.065 |

Glucose có quan hệ tuyến tính mạnh nhất với bệnh — khớp với nhận xét ở bài
16. (Với target nhị phân 0/1, Pearson r còn có tên **point-biserial
correlation**; vẫn dùng được để xếp hạng feature.)

**Feature với feature** — các cặp có |r| lớn nhất:

| Cặp | r |
|---|---|
| Pregnancies – Age | **0.544** |
| SkinThickness – Insulin | 0.437 |
| SkinThickness – BMI | 0.393 |
| Glucose – Insulin | 0.331 |

Không cặp nào vượt 0.7 → theo ngưỡng của slide 51, Diabetes dataset
**không có** multicollinearity đáng lo. Pregnancies – Age = 0.544 dễ hiểu:
càng lớn tuổi càng có thời gian mang thai nhiều lần.

> **EN:** *(Supplementary)* Feature–target correlations: Glucose 0.467
> (strongest), BMI 0.293, Age 0.238 … BloodPressure 0.065 (with a 0/1
> target this is the point-biserial correlation). Largest feature–feature
> pairs: Pregnancies–Age 0.544, SkinThickness–Insulin 0.437 — none above
> 0.7, so no worrying multicollinearity.

### 3.6. Dữ liệu thiếu trá hình làm sai correlation *(Bổ sung — nối bài 17)*

Tính lại sau khi đổi các số 0 vô lý thành NaN (pandas tự bỏ NaN theo từng
cặp):

| Cặp | r (còn số 0) | r (0 → NaN) |
|---|---|---|
| SkinThickness – BMI | 0.393 | **0.648** |
| Glucose – Insulin | 0.331 | **0.581** |
| Insulin – Outcome | 0.131 | **0.303** |
| SkinThickness – Outcome | 0.075 | **0.259** |

Những số 0 giả làm các quan hệ trông **yếu hơn thật** rất nhiều — lý do
phải xử lý dữ liệu thiếu (bài 17) **trước** khi phân tích correlation.

> **EN:** *(Supplementary — links to lesson 17)* After turning impossible
> zeros into NaN: SkinThickness–BMI 0.393 → 0.648, Glucose–Insulin
> 0.331 → 0.581, Insulin–Outcome 0.131 → 0.303. Fake zeros make
> relationships look much weaker — clean missing data before analysing
> correlation.

### 3.7. Multicollinearity (slide 51)

Hai gạch đầu dòng của slide:

- **Mức độ 2 hay nhiều features quan hệ tuyến tính với nhau.**
- **Thông thường hệ số tương quan > 0.7 hoặc < −0.7 biểu thị rằng 2 hay
  nhiều features có hiện tượng (đa) cộng tuyến với nhau.**

"Cộng tuyến" (*collinearity*) là giữa **2** feature; "đa cộng tuyến"
(*multicollinearity*) là khi **một feature gần như là tổ hợp tuyến tính của
nhiều feature khác** (ví dụ Tổng điểm ≈ Toán + Văn + Anh).

**Đọc sơ đồ Venn trên slide 51.** Vòng tròn **đỏ** = độ biến thiên
(*dispersion*) của **biến phụ thuộc** (target); hai vòng **xanh** = độ biến
thiên của **các biến độc lập** (features). Phần chồng lấn giữa vòng xanh và
vòng đỏ là phần target mà feature đó "giải thích" được.

- **No multicollinearity** (bên trái): hai vòng xanh **không chồng lên
  nhau**, mỗi vòng chạm vào một phần **khác nhau** của vòng đỏ → mỗi
  feature mang thông tin **riêng**; model biết rõ phần nào do feature nào.
- **Multicollinearity** (bên phải): hai vòng xanh **gần như trùng nhau** →
  chúng chạm vào **cùng một phần** của vòng đỏ. Model không thể tách được
  "phần này là nhờ feature 1 hay feature 2", và feature thứ hai gần như
  không thêm thông tin mới.

> **EN:** Slide 51: multicollinearity is the degree to which two or more
> **features** relate linearly; typically |r| > 0.7 indicates it.
> *Collinearity* involves two features; *multicollinearity* means one
> feature is nearly a linear combination of others. **Venn diagram**: the
> red circle is the target's variance, teal circles the features'; overlap
> with red is what a feature explains. Left: features don't overlap — each
> carries unique information. Right: the teal circles nearly coincide —
> they explain the **same** part of the target, so the model can't tell
> which feature deserves the credit, and the second adds little.

### 3.8. Vì sao multicollinearity có hại, và xử lý thế nào *(Bổ sung)*

Tác hại chủ yếu với các model **tuyến tính** (Linear / Logistic
Regression — P05):

- **Hệ số không ổn định.** Giá căn hộ ≈ 0.04 × diện tích. Nếu thêm "số phòng"
  (gần như = diện tích / 30), model có thể chia "công" giữa hai cột theo vô
  số cách: 0.04 × diện tích + 0 × số phòng, hay 0.02 × diện tích + 0.6 × số
  phòng… — đều cho dự đoán gần như nhau. Chỉ cần đổi vài dòng dữ liệu, hệ
  số nhảy lung tung (code mục 5.4).
- **Khó diễn giải.** Không trả lời được "diện tích quan trọng thế nào" vì
  công bị chia tùy ý.
- **Thừa thông tin.** Thêm cột mà không thêm thông tin, chỉ thêm nhiễu và
  số chiều.

Điều thú vị: **độ chính xác dự đoán** thường **ít bị ảnh hưởng** — vấn đề
nằm ở hệ số và sự ổn định. Model dạng cây (P07) gần như không bị ảnh hưởng
về độ chính xác, nhưng feature importance (P13) sẽ bị chia giữa các cột
giống nhau.

Cách xử lý (bước 04 *Remove multicollinearity*):

| Cách | Làm gì |
|---|---|
| **Bỏ bớt** | Trong cặp |r| > 0.7, giữ feature tương quan mạnh hơn với target hoặc dễ hiểu hơn |
| **Gộp** | Tạo feature mới từ các feature trùng: trung bình, tỉ lệ (giá / m²) |
| **PCA** (P14) | Biến các feature tương quan thành các thành phần không tương quan |
| **Regularization** (P12) | Ridge (L2) giúp hệ số ổn định khi các feature tương quan |

Pearson chỉ nhìn **từng cặp**. Để bắt đa cộng tuyến kiểu "Tổng ≈ Toán +
Văn + Anh" (từng cặp có thể chỉ ~0.6) người ta dùng **VIF** (*Variance
Inflation Factor*): hồi quy feature j theo **tất cả** feature còn lại, lấy
R²ⱼ rồi tính

```
VIF_j = 1 / (1 − R²ⱼ)
```

VIF = 1: không cộng tuyến; > 5 đáng chú ý; > 10 nghiêm trọng (quy ước phổ
biến). Diabetes dataset có VIF lớn nhất chỉ **1.59** (Age) → xác nhận
không có đa cộng tuyến.

> **EN:** *(Supplementary)* Harm is mainly to **linear models**:
> **unstable coefficients** (with area and rooms ≈ area/30, the model can
> split credit arbitrarily; small data changes swing coefficients —
> section 5.4), **hard interpretation**, **redundancy**. Predictive
> accuracy is often barely affected; tree models aren't hurt in accuracy,
> though importance gets split. Remedies: **drop** one of a highly
> correlated pair, **combine** them, **PCA** (P14), **regularization**
> (P12). Pairwise r misses multi-feature dependencies; use **VIF** = 1/(1 −
> R²ⱼ) (> 5 notable, > 10 severe). Diabetes' largest VIF is 1.59 (Age).

## 4. Ví dụ tay

### 4.1. Pearson r giữa diện tích và số phòng ngủ *(tự soạn)*

6 căn hộ:

| Căn | Diện tích x (m²) | Số phòng ngủ y |
|---|---|---|
| 1 | 45 | 1 |
| 2 | 60 | 2 |
| 3 | 70 | 2 |
| 4 | 85 | 3 |
| 5 | 100 | 3 |
| 6 | 120 | 4 |

x̄ = 480 / 6 = **80**; ȳ = 15 / 6 = **2.5**

| xᵢ − x̄ | yᵢ − ȳ | tích | (xᵢ − x̄)² | (yᵢ − ȳ)² |
|---|---|---|---|---|
| −35 | −1.5 | 52.5 | 1225 | 2.25 |
| −20 | −0.5 | 10 | 400 | 0.25 |
| −10 | −0.5 | 5 | 100 | 0.25 |
| 5 | 0.5 | 2.5 | 25 | 0.25 |
| 20 | 0.5 | 10 | 400 | 0.25 |
| 40 | 1.5 | 60 | 1600 | 2.25 |
| | **Tổng** | **140** | **3750** | **5.5** |

r = 140 / √(3750 × 5.5) = 140 / √20 625 ≈ 140 / 143.61 ≈ **0.975**

Mọi tích đều dương (căn nào diện tích trên trung bình cũng có số phòng trên
trung bình) → r gần 1. |r| = 0.975 > 0.7 → nếu cả hai cùng làm feature dự
đoán giá nhà, chúng **cộng tuyến**: nên giữ một (diện tích chi tiết hơn) hoặc
gộp thành "diện tích trung bình mỗi phòng".

### 4.2. Pearson r trên 5 dòng đầu Diabetes: Age và Pregnancies

| Dòng | Age (x) | Pregnancies (y) |
|---|---|---|
| 0 | 50 | 6 |
| 1 | 31 | 1 |
| 2 | 32 | 8 |
| 3 | 21 | 1 |
| 4 | 33 | 0 |

x̄ = 167 / 5 = **33.4**; ȳ = 16 / 5 = **3.2**

| xᵢ − x̄ | yᵢ − ȳ | tích | (xᵢ − x̄)² | (yᵢ − ȳ)² |
|---|---|---|---|---|
| 16.6 | 2.8 | 46.48 | 275.56 | 7.84 |
| −2.4 | −2.2 | 5.28 | 5.76 | 4.84 |
| −1.4 | 4.8 | −6.72 | 1.96 | 23.04 |
| −12.4 | −2.2 | 27.28 | 153.76 | 4.84 |
| −0.4 | −3.2 | 1.28 | 0.16 | 10.24 |
| | **Tổng** | **73.6** | **437.2** | **50.8** |

r = 73.6 / √(437.2 × 50.8) = 73.6 / √22 209.76 ≈ 73.6 / 149.03 ≈ **0.494**

Dòng 2 (32 tuổi, mang thai 8 lần) cho tích **âm**, kéo r xuống. Trên toàn
bộ 768 dòng r = 0.544 — gần với kết quả 5 dòng, nhưng đó là may mắn: 5 điểm
quá ít để tin.

### 4.3. Quan hệ rõ ràng nhưng r = 0

x = −2, −1, 0, 1, 2 và y = x² = 4, 1, 0, 1, 4.

x̄ = 0; ȳ = 10 / 5 = 2. Tích (xᵢ − 0)(yᵢ − 2): (−2)(2) + (−1)(−1) + 0 +
(1)(−1) + (2)(2) = −4 + 1 + 0 − 1 + 4 = **0** → **r = 0**.

y được xác định **hoàn toàn** bởi x, vậy mà r = 0 — cùng hiện tượng với
hình doanh số chữ U ngược ở slide 50.

> **EN:** **4.1** *(own example)* Area 45–120 m² vs bedrooms 1–4: means
> 80 and 2.5; Σ products = 140, Σ squares 3750 and 5.5 → r = 140/143.61 ≈
> 0.975 > 0.7 — collinear; keep one or combine. **4.2** Age vs Pregnancies
> on Diabetes' first 5 rows: means 33.4 and 3.2; Σ = 73.6, 437.2, 50.8 →
> r ≈ 0.494 (0.544 on all 768 rows — five points are too few to trust).
> **4.3** y = x² on −2…2: Σ products = 0 → r = 0, though y is fully
> determined by x — the inverted-U effect from slide 50.

## 5. Code

### 5.1. Tính r bằng tay và bằng thư viện

```python
import numpy as np
import pandas as pd

x = np.array([45, 60, 70, 85, 100, 120])
y = np.array([1, 2, 2, 3, 3, 4])

num = ((x - x.mean()) * (y - y.mean())).sum()
den = np.sqrt(((x - x.mean())**2).sum() * ((y - y.mean())**2).sum())
print(num, den, num / den)                 # 140.0 143.61 0.9748
print(np.corrcoef(x, y)[0, 1])             # 0.9748 (NumPy)
print(pd.Series(x).corr(pd.Series(y)))     # 0.9748 (pandas)

# r không đổi khi scale (bài 18)
print(np.corrcoef(x / 100, y * 10)[0, 1])  # vẫn 0.9748

# Quan hệ chữ U: r ~ 0
u = np.array([-2, -1, 0, 1, 2])
print(np.corrcoef(u, u**2)[0, 1])          # 0.0
```

### 5.2. Correlation trên Diabetes dataset

```python
data = pd.read_csv("diabetes.csv")
corr = data.corr()                          # ma trận 9x9, Pearson mặc định
print(corr["Outcome"].drop("Outcome").sort_values(ascending=False).round(3))
# Glucose 0.467, BMI 0.293, Age 0.238, ...

# Liệt kê các cặp feature có |r| > ngưỡng (mỗi cặp một lần)
def high_corr_pairs(df, threshold=0.7):
    c = df.corr().abs()
    upper = c.where(np.triu(np.ones(c.shape, dtype=bool), k=1))
    pairs = upper.stack().sort_values(ascending=False)
    return pairs[pairs > threshold]

features = data.drop(columns="Outcome")
print(high_corr_pairs(features, 0.7))      # rỗng -> không có multicollinearity
print(high_corr_pairs(features, 0.3))      # Pregnancies-Age 0.544, ...

# (bổ sung) Đổi số 0 vô lý thành NaN rồi tính lại (bài 17)
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
clean = data.copy()
clean[zero_cols] = clean[zero_cols].replace(0, np.nan)
print(clean.corr().loc["SkinThickness", "BMI"].round(3))   # 0.648 (trước: 0.393)
```

Heatmap của ma trận này sẽ vẽ ở module 04 (Data visualization).

### 5.3. VIF *(bổ sung)*

```python
from sklearn.linear_model import LinearRegression

def vif(df):
    out = {}
    for col in df.columns:
        others = df.drop(columns=col)
        r2 = LinearRegression().fit(others, df[col]).score(others, df[col])
        out[col] = 1 / (1 - r2)
    return pd.Series(out).round(3)

print(vif(features))      # lớn nhất: Age 1.588 -> không đa cộng tuyến
```

### 5.4. Minh họa hệ số không ổn định khi có multicollinearity *(bổ sung — dữ liệu mô phỏng)*

```python
rng = np.random.default_rng(0)
n = 200
area = rng.uniform(40, 120, n)                      # diện tích
rooms = area / 30 + rng.normal(0, 0.15, n)          # "số phòng" gần như tỉ lệ với diện tích
price = 0.04 * area + rng.normal(0, 0.3, n)         # giá (tỉ) chỉ phụ thuộc diện tích
X2 = np.c_[area, rooms]
print(np.corrcoef(area, rooms)[0, 1].round(3))      # 0.982 -> cộng tuyến mạnh

for seed in [1, 2, 3]:
    idx = np.random.default_rng(seed).choice(n, 60, replace=False)  # 3 mẫu con khác nhau
    both = LinearRegression().fit(X2[idx], price[idx]).coef_
    one = LinearRegression().fit(X2[idx][:, :1], price[idx]).coef_
    print(seed, "2 feature:", both.round(3), "| chỉ diện tích:", one.round(4))
# Hệ số của "rooms" nhảy mạnh giữa các mẫu (0.388, 0.165, 0.053);
# chỉ dùng diện tích thì hệ số ổn định quanh 0.04.
```

> **EN:** 5.1 computes r by hand, with NumPy and pandas, shows r is
> scale-invariant, and that y = x² gives r = 0. 5.2 ranks feature–target
> correlations on Diabetes, lists feature pairs above a threshold (none
> above 0.7), and shows the effect of fake zeros. *(Supplementary)* 5.3
> computes VIF (max 1.588). 5.4 simulates collinear area/rooms data: the
> rooms coefficient swings across subsamples while the area-only
> coefficient stays near 0.04.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Hai feature có r = −0.85. Đọc ý nghĩa và cho biết có
multicollinearity theo slide 51 không.
> **Đáp án:** Quan hệ tuyến tính **âm, mạnh**: feature này tăng thì feature
> kia giảm khá đều. |r| = 0.85 > 0.7 (r < −0.7) → **có** cộng tuyến; nên
> bỏ bớt một hoặc gộp lại.

**Câu 2:** Correlation giữa một feature và **target** cao là tốt hay xấu?
Giữa hai **feature** với nhau cao là tốt hay xấu?
> **Đáp án:** Feature – target cao là **tốt**: feature hữu ích để dự đoán
> (slide 50). Feature – feature cao là **xấu** với model tuyến tính
> (multicollinearity — slide 51): thông tin trùng lặp, hệ số không ổn định.

**Câu 3:** Tính r cho x = 1, 2, 3, 4 và y = 2, 4, 5, 9.
> **Đáp án:** x̄ = 2.5, ȳ = 5. Độ lệch x: −1.5, −0.5, 0.5, 1.5; y: −3,
> −1, 0, 4. Σ tích = 4.5 + 0.5 + 0 + 6 = **11**; Σ(x − x̄)² = **5**;
> Σ(y − ȳ)² = 9 + 1 + 0 + 16 = **26** → r = 11 / √130 ≈ 11 / 11.40 ≈
> **0.965**.

**Câu 4:** Hình doanh số theo nhiệt độ ở slide 50 cho r ≈ 0. Có thể kết
luận "nhiệt độ không ảnh hưởng doanh số" không?
> **Đáp án:** Không. Pearson chỉ đo quan hệ **tuyến tính**; doanh số tăng
> rồi giảm (chữ U ngược) nên hai nửa triệt tiêu, r ≈ 0 dù quan hệ rất rõ.
> Phải vẽ scatter plot trước khi kết luận.

**Câu 5:** Số máy điều hòa bán ra và số ca sốc nhiệt ở Hà Nội có r = 0.8.
Có nên kết luận điều hòa gây sốc nhiệt?
> **Đáp án:** Không — **correlation does not imply causation**. Cả hai
> cùng do biến ẩn **nắng nóng** gây ra.

**Câu 6:** Trong Diabetes dataset, r(SkinThickness, BMI) = 0.393 khi giữ
nguyên số 0, nhưng 0.648 khi đổi số 0 thành NaN. Vì sao?
> **Đáp án:** Các số 0 là dữ liệu thiếu trá hình (bài 17): một người có
> BMI 35 nhưng SkinThickness ghi 0 tạo ra những điểm "lạc" xa đường xu
> hướng, làm quan hệ trông yếu hơn thật. Bỏ chúng đi thì thấy được quan hệ
> thật mạnh hơn → phải xử lý dữ liệu thiếu trước khi tính correlation.

> **EN:**
>
> **Q1:** Two features have r = −0.85. Meaning? Multicollinearity?
> > **A:** Strong negative linear relationship; |r| > 0.7 → yes,
> > collinear — drop or combine one.
>
> **Q2:** High feature–target correlation: good or bad? High
> feature–feature?
> > **A:** Feature–target: good (predictive). Feature–feature: bad for
> > linear models (redundancy, unstable coefficients).
>
> **Q3:** r for x = 1, 2, 3, 4 and y = 2, 4, 5, 9?
> > **A:** Σ products 11, Σ squares 5 and 26 → r = 11/√130 ≈ 0.965.
>
> **Q4:** Slide 50's sales-vs-temperature chart has r ≈ 0. Does
> temperature not matter?
> > **A:** No — Pearson measures only linear relationships; the inverted U
> > cancels out. Plot first.
>
> **Q5:** AC sales and heatstroke cases correlate at 0.8. Do ACs cause
> heatstroke?
> > **A:** No — a confounder (heat) drives both.
>
> **Q6:** Why does r(SkinThickness, BMI) jump from 0.393 to 0.648 when
> zeros become NaN?
> > **A:** The zeros are disguised missing values creating stray points
> > that weaken the apparent relationship; clean them first.
