---
title: Step 3.4 — Correlation và Multicollinearity
order: 20
description: "Hệ số tương quan Pearson chỉ đo quan hệ tuyến tính; feature trùng nhau (đa cộng tuyến) làm hệ số bất ổn."
slides: 50-51
needs: [feature-scaling, categorical-encoding]
tags: [correlation, multicollinearity, vif, pearson, causation, feature-importance]
---

## Hai câu hỏi khác nhau về quan hệ giữa các cột

:::intro Mục tiêu bài này
- Tính và đọc **hệ số tương quan Pearson r**.
- Hiểu r chỉ đo quan hệ **tuyến tính**: r gần 0 không có nghĩa là không có quan hệ.
- Hiểu **đa cộng tuyến** (feature trùng lặp nhau) làm hệ số bất ổn thế nào.
:::

Có hai câu hỏi hay bị trộn lẫn:

1. **Feature với target:** cột này có liên quan tới đáp án không? (Có ích để dự đoán không?)
2. **Feature với feature:** hai cột này có đang nói **cùng một điều** không? (Có trùng lặp không?)

Công cụ chung là **hệ số tương quan Pearson r**, một số từ −1 đến 1: gần 1 là cùng tăng; gần −1 là một tăng một giảm; gần 0 là không có quan hệ **tuyến tính**.

:::steps
Năm điểm (x, y): (1, 2), (2, 4), (3, 5), (4, 4), (5, 5). Trung bình x = 3, y = 4.
@step
Độ lệch: dx = (−2, −1, 0, 1, 2), dy = (−2, 0, 1, 0, 1).
@step
Tổng tích chéo Σ dx·dy = 4 + 0 + 0 + 0 + 2 = **6**. Σ dx² = 10, Σ dy² = 6.
@step
**r = 6 / √(10 × 6) = 6 / 7.746 ≈ 0.775**: quan hệ tuyến tính khá mạnh, cùng chiều.
:::

:::predict
Một cột y phụ thuộc **rất rõ** vào x theo dạng parabol (y = (x − 4.5)², tức đường cong chữ U). Hệ số r giữa x và y sẽ khoảng bao nhiêu?
@answer
**Gần 0.** Nửa trái đường cong đi xuống, nửa phải đi lên, nên hai nửa triệt tiêu nhau. Y phụ thuộc hoàn toàn vào x mà r vẫn ≈ 0: **r chỉ đo quan hệ tuyến tính**. Hãy thử ngay bên dưới.
:::

:::widget corr-drag
:::

## Tương quan không phải nhân quả, và bảng của Diabetes

r cao chỉ cho biết hai cột **đi cùng nhau**, không cho biết cột nào gây ra cột nào (có thể có yếu tố thứ ba). Tương quan của từng cột Diabetes với `Outcome`: Glucose **0.467**, BMI 0.293, Age 0.238, Pregnancies 0.222, DPF 0.174, Insulin 0.131, SkinThickness 0.075, BloodPressure 0.065. Glucose mạnh nhất, nhưng không cột nào đủ để quyết định một mình; hệ số thấp cũng **không** chứng minh cần mô hình phi tuyến (Project Bước 8). Lưu ý các số 0 thiếu trá hình ([[bài:missing-values-outliers]]) làm sai các hệ số này.

## Đa cộng tuyến

Khi **hai feature gần như trùng nhau** (ví dụ cân nặng tính bằng kg và bằng lb, r gần 1), model tuyến tính không biết chia công cho cột nào: hệ số của chúng **bất ổn**, đổi mạnh khi dữ liệu đổi nhẹ, dù dự đoán tổng thể vẫn ổn. Công cụ đo là **VIF** = 1 / (1 − R²), trong đó R² là mức một feature được giải thích bởi các feature còn lại; VIF trên khoảng 5 đến 10 là **tín hiệu để điều tra** (không phải án quyết).

Cách xử lý: bỏ một trong hai cột, gộp chúng, dùng regularization, hoặc PCA. Cây quyết định và Random Forest ít bị ảnh hưởng.

:::ck
Hai feature `Weight_kg` và `Weight_lb` có r = 0.999. Dự đoán của model tuyến tính có hỏng không? Còn việc đọc hệ số?
@answer
**Dự đoán thường vẫn tốt**, vì hai cột chứa cùng thông tin. Nhưng **việc đọc hệ số hỏng**: model có thể gán +50 cho cột này và −49 cho cột kia, nên không thể nói "cân nặng ảnh hưởng thế nào". Cần bỏ một cột nếu muốn giải thích.
:::

:::slides 50-51 | Slide 50–51: correlation và multicollinearity
:::

:::card Correlation và Multicollinearity
- **Hai câu hỏi:** feature với target (có ích?) và feature với feature (trùng lặp?).
- **Pearson r** từ −1 đến 1, chỉ đo quan hệ **tuyến tính**; parabol rõ ràng vẫn có r ≈ 0.
- **Tương quan không phải nhân quả.**
- **Đa cộng tuyến:** feature gần trùng làm hệ số bất ổn; đo bằng VIF; xử lý bằng bỏ, gộp, regularization.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Hai feature có r = −0.85. Đọc ý nghĩa và cho biết có
multicollinearity theo [[slide:51]] không.
A: Quan hệ tuyến tính **âm, mạnh**: feature này tăng thì feature
kia giảm khá đều. |r| = 0.85 > 0.7 (r < −0.7) → **có** cộng tuyến; nên
bỏ bớt một hoặc gộp lại.
EN: Two features have r = −0.85. Meaning? Multicollinearity?
**A:** Strong negative linear relationship; |r| > 0.7 → yes,
> collinear — drop or combine one.

Q: Correlation giữa một feature và **target** cao là tốt hay xấu?
Giữa hai **feature** với nhau cao là tốt hay xấu?
A: Feature – target cao là **tốt**: feature hữu ích để dự đoán
([[slide:50]]). Feature – feature cao là **xấu** với model tuyến tính
(multicollinearity — [[slide:51]]): thông tin trùng lặp, hệ số không ổn định.
EN: High feature–target correlation: good or bad? High
feature–feature?
**A:** Feature–target: good (predictive). Feature–feature: bad for
> linear models (redundancy, unstable coefficients).

Q: Tính r cho x = 1, 2, 3, 4 và y = 2, 4, 5, 9.
A: x̄ = 2.5, ȳ = 5. Độ lệch x: −1.5, −0.5, 0.5, 1.5; y: −3,
−1, 0, 4. Σ tích = 4.5 + 0.5 + 0 + 6 = **11**; Σ(x − x̄)² = **5**;
Σ(y − ȳ)² = 9 + 1 + 0 + 16 = **26** → r = 11 / √130 ≈ 11 / 11.40 ≈
**0.965**.
EN: r for x = 1, 2, 3, 4 and y = 2, 4, 5, 9?
**A:** Σ products 11, Σ squares 5 and 26 → r = 11/√130 ≈ 0.965.

Q: Hình doanh số theo nhiệt độ ở [[slide:50]] cho r ≈ 0. Có thể kết
luận "nhiệt độ không ảnh hưởng doanh số" không?
A: Không. Pearson chỉ đo quan hệ **tuyến tính**; doanh số tăng
rồi giảm (chữ U ngược) nên hai nửa triệt tiêu, r ≈ 0 dù quan hệ rất rõ.
Phải vẽ scatter plot trước khi kết luận.
EN: [[slide:50]]'s sales-vs-temperature chart has r ≈ 0. Does
temperature not matter?
**A:** No — Pearson measures only linear relationships; the inverted U
> cancels out. Plot first.

Q: Số máy điều hòa bán ra và số ca sốc nhiệt ở Hà Nội có r = 0.8.
Có nên kết luận điều hòa gây sốc nhiệt?
A: Không — **correlation does not imply causation**. Cả hai
cùng do biến ẩn **nắng nóng** gây ra.
EN: AC sales and heatstroke cases correlate at 0.8. Do ACs cause
heatstroke?
**A:** No — a confounder (heat) drives both.

Q: Trong Diabetes dataset, r(SkinThickness, BMI) = 0.393 khi giữ
nguyên số 0, nhưng 0.648 khi đổi số 0 thành NaN. Vì sao?
A: Các số 0 là dữ liệu thiếu trá hình ([[bài:missing-values-outliers]]): một người có
BMI 35 nhưng SkinThickness ghi 0 tạo ra những điểm "lạc" xa đường xu
hướng, làm quan hệ trông yếu hơn thật. Bỏ chúng đi thì thấy tương quan trên phần dữ liệu quan sát còn lại mạnh hơn → phải xử lý dữ liệu thiếu trước khi tính correlation.
EN: Why does r(SkinThickness, BMI) jump from 0.393 to 0.648 when
zeros become NaN?
**A:** The zeros are disguised missing values creating stray points
> that weaken the apparent relationship; clean them first.
Q: Model phi tuyến có học được một quan hệ tuyến tính không?
A: Có. “Phi tuyến” mô tả khả năng biểu diễn, không cấm quan hệ tuyến tính. Cây có thể xấp xỉ quan hệ đó bằng các ngưỡng; vì thế không giải thích tính bền với cộng tuyến bằng câu “cây không quan tâm quan hệ tuyến tính”.
@tier B | Phỏng vấn lý thuyết
Q: r bằng 0 có nghĩa độc lập không?
A: Không. Ví dụ y=x² trên x đối xứng cho r=0 nhưng quan hệ hoàn toàn xác định. Pearson chỉ đo phần liên hệ tuyến tính; cần scatter và hiểu dạng quan hệ.
EN: Zero Pearson correlation does not imply independence; deterministic nonlinear relationships can have zero correlation.
Q: Cộng tuyến ảnh hưởng dự đoán và diễn giải giống nhau?
A: Không. Hệ số có thể rất bất ổn dù dự đoán trong miền quen thuộc vẫn khá ổn. Khi ngoại suy hoặc phân phối quan hệ feature đổi, rủi ro tăng; không lấy coefficient làm tác động nhân quả.
EN: Multicollinearity can destabilize coefficients without greatly changing in-distribution predictions.
Q: VIF bổ sung gì so với ma trận correlation?
A: VIF hồi quy mỗi feature theo tất cả feature khác, đo mức phóng đại variance qua 1/(1−R²). Nó phát hiện tổ hợp nhiều biến mà từng cặp chưa có r rất lớn.
EN: VIF detects multivariate linear redundancy that a pairwise correlation matrix can miss.
Q: Xóa một trong hai feature tương quan cao dựa vào gì?
A: Xem chất lượng đo, missing, chi phí thu thập, tính sẵn có khi serving và khả năng dự đoán trên validation. Có thể dùng regularization thay xóa; ngưỡng r không đủ quyết định.
EN: Choose remedies using measurement quality, availability, cost, and validation performance, not a correlation threshold alone.
Q: Random Forest có điểm dự đoán ổn thì feature importance của hai cột tương quan cao có đáng tin riêng từng cột?
A: Chưa chắc. Cột thay thế nhau có thể chia importance, hoặc permutation từng cột trông ít ảnh hưởng vì cột còn lại giữ tín hiệu. Kiểm tra theo nhóm feature và validation; không đồng nhất importance với nhân quả.
EN: Correlated predictors can share attribution or mask individual permutation importance even when predictive performance is stable.
@tier C | Tình huống doanh nghiệp
Q: Hai feature có r=0.95, quản lý yêu cầu bỏ một. Bạn làm gì?
A: Kiểm tra định nghĩa, leakage và chất lượng, so mô hình giữ cả với regularization và bỏ từng cột trên cùng split. Nếu cần diễn giải hệ số, ưu tiên biến ổn định và dễ đo; nếu cần dự đoán, dùng bằng chứng validation. Bỏ cột có thể giảm chi phí nhưng mất thông tin ở vùng hiếm *(bổ sung)*.
WANT: Ra quyết định từ mục tiêu và kiểm chứng, không chỉ ngưỡng.
Q: Một feature có r thấp với target nên team loại ngay. Có vấn đề?
A: Xem scatter và tương tác với cột khác, kiểm tra missing và nhóm dữ liệu. r thấp chỉ nói liên hệ tuyến tính đơn biến thấp. So qua validation trước khi bỏ; giữ mọi biến cũng có chi phí và nguy cơ nhiễu *(bổ sung)*.
WANT: Nhận ra quan hệ phi tuyến và thông tin có điều kiện.
Q: Hệ số đổi dấu giữa các lần train nhưng điểm ổn. Giải thích sao?
A: Kiểm tra cộng tuyến, VIF và độ ổn định qua mẫu con, đồng thời xác nhận pipeline giống nhau. Thử gộp/bỏ cột hoặc regularize để ổn định. Không diễn giải dấu hệ số là tác động kinh doanh khi chưa xử lý các phụ thuộc *(bổ sung)*.
WANT: Phân biệt ổn định dự đoán với ổn định diễn giải.
Q: Hai biến tương quan cao cùng có importance thấp khi hoán vị riêng, quản lý muốn bỏ cả hai. Bạn làm gì?
A: Kiểm tra định nghĩa và leakage; thử bỏ từng biến rồi bỏ cả nhóm trên cùng validation, hoặc hoán vị nhóm để xem tín hiệu chung. Nếu chúng thay thế nhau, phép đo riêng có thể che vai trò của nhóm. Cân nhắc chi phí đo và độ ổn định, không kết luận từ một kiểu importance.
WANT: Biết sự thay thế giữa feature làm diễn giải sai dù metric dự đoán tốt.
:::

## Nối sang bài sau

:::next
Quan hệ giữa các feature mới là một phần chất lượng dữ liệu. [[bài:imbalanced-data]] quay lại phân bố target để so cách học và ra quyết định khi class cần tìm rất hiếm.
:::

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Tính Pearson r và giải thích dấu/độ lớn.
- Nêu ví dụ r bằng 0 dù có quan hệ rõ.
- Chẩn đoán hệ số không ổn định mà không tự động xóa feature.
:::

Nền để đọc bài này: [[bài:feature-scaling]], [[bài:categorical-encoding]].

:::slides 50-51 | Slide gốc — Step 3.4 — Correlation và Multicollinearity
:::

Sau khi làm sạch và biến đổi từng cột riêng lẻ ([[bài:missing-values-outliers]] đến [[bài:categorical-encoding]]), Step 3.4 nhìn
**các cột trong quan hệ với nhau**. Có hai câu hỏi khác nhau, [[slide:50]] và
51 trả lời lần lượt:

1. **Feature nào liên quan đến target?** ([[slide:50]] — *Mối quan hệ giữa các
   variables (features, target)*) — ví dụ Glucose cao thì khả năng mắc
   tiểu đường có cao hơn không? Liên quan mạnh là **tốt**: feature đó
   hữu ích cho việc dự đoán.
2. **Các feature có "nói cùng một điều" không?** ([[slide:51]] — *Mối quan hệ
   giữa các features*) — ví dụ diện tích căn hộ và số phòng ngủ gần như
   luôn đi cùng nhau. Hai feature quá giống nhau là **xấu** với một số
   model: đó là **(đa) cộng tuyến — multicollinearity**, bước 04 *Remove
   multicollinearity* trên [[slide:45]].

Công cụ chung cho cả hai: **hệ số tương quan (correlation coefficient)**.

> **EN:** After cleaning and transforming single columns (lessons 17–19),
> step 3.4 looks at **columns in relation to each other**. Two questions:
> (1) **does a feature relate to the target?** ([[slide:50]]) — strong
> relation is **good**, the feature is useful; (2) **do features say the
> same thing?** ([[slide:51]]) — e.g. flat area and number of bedrooms; highly
> similar features are **bad** for some models — **multicollinearity**,
> sub-step 04 on [[slide:45]]. The shared tool is the **correlation
> coefficient**.

## [sâu] Nhìn liên hệ sau khi xử lý từng feature

```
3.1 Missing → 3.2 Outliers → 3.3 Scaling, Encoding → [ 3.4 Correlation & Multicollinearity ] → 3.5 Balance (bài 21)
```

- **[[bài:descriptive-statistics]]**: `groupby("Outcome").mean()` cho thấy người bệnh có Glucose
  trung bình cao hơn ~31 mg/dL. Correlation biến nhận xét đó thành **một
  con số**.
- **[[bài:missing-values-outliers]]**: dữ liệu thiếu trá hình (số 0) làm **sai lệch** correlation —
  ví dụ ở mục 3.6.
- **[[bài:categorical-encoding]]**: bộ cột one-hot đầy đủ luôn cộng lại bằng 1 — một trường hợp
  multicollinearity "hoàn hảo" (*dummy variable trap*).
- **Sau này**: heatmap correlation (module 04), chọn feature theo
  correlation (P13), PCA dùng covariance / correlation (P14), regularization
  giảm tác hại của multicollinearity (P12).

> **EN:** Lesson 16's per-class means become a single number here; lesson
> 17's disguised zeros distort correlations (section 3.6); lesson 19's
> full one-hot set is perfect multicollinearity (dummy variable trap).
> Later: correlation heatmaps (module 04), feature selection (P13), PCA
> (P14), regularization (P12).

## [sâu] Correlation là gì (slide 50)

Ba gạch đầu dòng của slide:

- **Mức độ 2 hay nhiều variables quan hệ tuyến tính với nhau.**
  "Tuyến tính" nghĩa là khi biến này tăng, biến kia tăng (hoặc giảm) theo
  một **đường thẳng**.
- **Hệ số tương quan nằm trong [−1, 1].**
- **Correlation does not imply causation** — tương quan **không** có nghĩa
  là nhân quả (mục 3.4).

Chú ý chữ **variables** ở [[slide:50]] (tô tím) so với **features** ở [[slide:51]]
(tô đỏ): [[slide:50]] nói về mọi biến — cả feature lẫn target; [[slide:51]] chỉ nói
về quan hệ **giữa các feature**.

> **EN:** [[slide:50]]: correlation is the degree to which two or more
> **variables** relate **linearly**; the coefficient lies in **[−1, 1]**;
> **correlation does not imply causation**. Note "variables" (features
> and target) on [[slide:50]] vs "features" on [[slide:51]].

## [sâu] Công thức Pearson (slide 50)

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
  kg hay g) — và **không đổi khi scale** ([[bài:feature-scaling]]).

> **EN:** Pearson's formula ([[slide:50]]): r = Σ(xᵢ − x̄)(yᵢ − ȳ) /
> √[Σ(xᵢ − x̄)² Σ(yᵢ − ȳ)²]. *(Supplementary)* The numerator adds products
> that are positive when both values sit on the same side of their means
> — divided by n − 1 it is the **covariance** (P14). The denominator
> removes units and bounds r to [−1, 1], so r is unchanged by unit changes
> or scaling (lesson 18).

## [sâu] Đọc hệ số r (hình scatter slide 50)

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
multicollinearity của [[slide:51]].

**Hình bên dưới [[slide:50]] — doanh số theo nhiệt độ** *(diễn giải của
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

> **EN:** [[slide:50]]'s six scatter plots (r = ±0.7, ±0.3, 0): the **sign**
> gives direction; **|r|** gives tightness around a line — not the slope.
> *(Supplementary)* Rough guide: |r| < 0.3 weak, 0.3–0.7 moderate, > 0.7
> strong. *(Claude's reading of the lower chart)* Sales rise from ~$190 at
> 12 °C to ~$610 near 25 °C, then fall to ~$215 at 41 °C — an inverted U.
> Using ~21 points read off the chart, **r ≈ 0.007**, although the halves
> give r ≈ +0.96 and −0.94. **r ≈ 0 means no *linear* relationship, not
> no relationship** — always plot first (module 04).

## [sâu] Correlation does not imply causation

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
dương với Outcome (r = 0.24), nhưng con số này không đủ kết luận tác động nhân quả của tuổi — tuổi đi kèm nhiều yếu tố khác.

> **EN:** Co-movement doesn't prove cause. *(Supplementary — own
> examples)* **Confounders** (air-conditioner sales and heatstroke cases
> both rise with summer heat; ice-cream sales and drownings),
> **reverse causation** (hospitals with more doctors have higher death
> rates because severe cases are sent there), **coincidence** (two rising
> time series). For ML, a correlated feature still helps **prediction**,
> but don't interpret it causally — Age correlates with Outcome (r =
> 0.24) without establishing a causal effect from correlation alone.

## [sâu] Correlation trên Diabetes dataset (Bổ sung)

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

Không cặp nào vượt 0.7 → theo ngưỡng của [[slide:51]], Diabetes dataset
**không có** multicollinearity đáng lo. Pregnancies – Age = 0.544 dễ hiểu:
càng lớn tuổi càng có thời gian mang thai nhiều lần.

> **EN:** *(Supplementary)* Feature–target correlations: Glucose 0.467
> (strongest), BMI 0.293, Age 0.238 … BloodPressure 0.065 (with a 0/1
> target this is the point-biserial correlation). Largest feature–feature
> pairs: Pregnancies–Age 0.544, SkinThickness–Insulin 0.437 — none above
> 0.7, so no pair exceeds the stated threshold; multivariate checks are still needed.

## [sâu] Dữ liệu thiếu trá hình làm sai correlation (Bổ sung — nối Step 3.1–3.2 — Xử lý dữ liệu thiếu và Outliers)

Tính lại sau khi đổi các số 0 vô lý thành NaN (pandas tự bỏ NaN theo từng
cặp):

| Cặp | r (còn số 0) | r (0 → NaN) |
|---|---|---|
| SkinThickness – BMI | 0.393 | **0.648** |
| Glucose – Insulin | 0.331 | **0.581** |
| Insulin – Outcome | 0.131 | **0.303** |
| SkinThickness – Outcome | 0.075 | **0.259** |

Những số 0 giả làm các quan hệ trông **yếu hơn thật** rất nhiều — lý do
phải xử lý dữ liệu thiếu ([[bài:missing-values-outliers]]) **trước** khi phân tích correlation.

> **EN:** *(Supplementary — links to lesson 17)* After turning impossible
> zeros into NaN: SkinThickness–BMI 0.393 → 0.648, Glucose–Insulin
> 0.331 → 0.581, Insulin–Outcome 0.131 → 0.303. Fake zeros make
> relationships look much weaker — clean missing data before analysing
> correlation.

## [sâu] Multicollinearity (slide 51)

Hai gạch đầu dòng của slide:

- **Mức độ 2 hay nhiều features quan hệ tuyến tính với nhau.**
- **Thông thường hệ số tương quan > 0.7 hoặc < −0.7 biểu thị rằng 2 hay
  nhiều features có hiện tượng (đa) cộng tuyến với nhau.**

"Cộng tuyến" (*collinearity*) là giữa **2** feature; "đa cộng tuyến"
(*multicollinearity*) là khi **một feature gần như là tổ hợp tuyến tính của
nhiều feature khác** (ví dụ Tổng điểm ≈ Toán + Văn + Anh).

**Đọc sơ đồ Venn trên [[slide:51]].** Vòng tròn **đỏ** = độ biến thiên
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

> **EN:** [[slide:51]]: multicollinearity is the degree to which two or more
> **features** relate linearly; typically |r| > 0.7 indicates it.
> *Collinearity* involves two features; *multicollinearity* means one
> feature is nearly a linear combination of others. **Venn diagram**: the
> red circle is the target's variance, teal circles the features'; overlap
> with red is what a feature explains. Left: features don't overlap — each
> carries unique information. Right: the teal circles nearly coincide —
> they explain the **same** part of the target, so the model can't tell
> which feature deserves the credit, and the second adds little.

## [sâu] Vì sao multicollinearity có hại, và xử lý thế nào (Bổ sung)

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
nằm ở hệ số và sự ổn định. Model dạng cây (P07) thường ít bị ảnh hưởng hơn về dự đoán, nhưng feature importance (P13) sẽ bị chia giữa các cột
giống nhau.

Liên hệ [[bài:k-nearest-neighbours]]: feature trùng/thừa có thể đếm lặp một hướng trong khoảng cách dù KNN không học hệ số hồi quy. Vì vậy tác động lên KNN là thay đổi hàng xóm, khác với hệ số β bất ổn.

> **EN:** Redundant features can count the same direction repeatedly in KNN distances; this changes neighborhoods rather than destabilizing regression coefficients.

Ngoài slide: [[bài:decision-tree]] và [[bài:random-forest]] không gặp cùng vấn đề xác định hệ số như OLS, nhưng các cột tương quan có thể thay thế/chia sẻ importance. Biểu đồ impurity importance không chứng minh nhân quả, cũng không đủ để xóa một cột chỉ vì điểm thấp.

> **EN:** Correlated predictors can share or substitute for importance in trees and forests. Impurity importance is neither causal evidence nor, by itself, a feature-removal rule.

Cách xử lý (bước 04 *Remove multicollinearity*):

| Cách | Làm gì |
|---|---|
| **Bỏ bớt** | Trong cặp \|r\| > 0.7, giữ feature tương quan mạnh hơn với target hoặc dễ hiểu hơn |
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
biến). Diabetes dataset có VIF lớn nhất chỉ **1.59** (Age) → không gợi ý đa cộng tuyến mạnh theo phép đo này.

> **EN:** *(Supplementary)* Harm is mainly to **linear models**:
> **unstable coefficients** (with area and rooms ≈ area/30, the model can
> split credit arbitrarily; small data changes swing coefficients —
> section 5.4), **hard interpretation**, **redundancy**. Predictive
> accuracy is often barely affected; tree predictions are often less sensitive,
> though importance gets split. Remedies: **drop** one of a highly
> correlated pair, **combine** them, **PCA** (P14), **regularization**
> (P12). Pairwise r misses multi-feature dependencies; use **VIF** = 1/(1 −
> R²ⱼ) (> 5 notable, > 10 severe). Diabetes' largest VIF is 1.59 (Age).

## [sâu] Pearson r giữa diện tích và số phòng ngủ (tự soạn)

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

## [sâu] Pearson r trên 5 dòng đầu Diabetes: Age và Pregnancies

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

## [sâu] Quan hệ rõ ràng nhưng r = 0

x = −2, −1, 0, 1, 2 và y = x² = 4, 1, 0, 1, 4.

x̄ = 0; ȳ = 10 / 5 = 2. Tích (xᵢ − 0)(yᵢ − 2): (−2)(2) + (−1)(−1) + 0 +
(1)(−1) + (2)(2) = −4 + 1 + 0 − 1 + 4 = **0** → **r = 0**.

y được xác định **hoàn toàn** bởi x, vậy mà r = 0 — cùng hiện tượng với
hình doanh số chữ U ngược ở [[slide:50]].

> **EN:** **4.1** *(own example)* Area 45–120 m² vs bedrooms 1–4: means
> 80 and 2.5; Σ products = 140, Σ squares 3750 and 5.5 → r = 140/143.61 ≈
> 0.975 > 0.7 — collinear; keep one or combine. **4.2** Age vs Pregnancies
> on Diabetes' first 5 rows: means 33.4 and 3.2; Σ = 73.6, 437.2, 50.8 →
> r ≈ 0.494 (0.544 on all 768 rows — five points are too few to trust).
> **4.3** y = x² on −2…2: Σ products = 0 → r = 0, though y is fully
> determined by x — the inverted-U effect from [[slide:50]].

## [sâu] Tính r bằng tay và bằng thư viện

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

## [sâu] Correlation trên Diabetes dataset

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

## [sâu] VIF (bổ sung)

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

## [sâu] Minh họa hệ số không ổn định khi có multicollinearity (bổ sung — dữ liệu mô phỏng)

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

## [sâu] Ngưỡng chỉ là tín hiệu điều tra (bổ sung)

:::note Số đọc từ hình chưa phải bảng gốc (nhận xét)
Các giá trị doanh số/nhiệt độ và r ≈ 0.007, +0.96, −0.94 ở phần đọc hình là ước lượng của nội dung cũ từ các điểm trên ảnh; slide không cung cấp bảng tọa độ để xác nhận độ chính xác đó. Chỉ dùng chúng để minh họa dạng U ngược. Ví dụ y = x² có dữ liệu tường minh và tính lại được là cách kiểm chứng chắc chắn hơn cho ý “r = 0 không đồng nghĩa không có quan hệ”.
:::

:::compare Correlation và multicollinearity
| Câu hỏi | Công cụ | Giới hạn |
|---|---|---|
| Hai biến liên hệ tuyến tính? | Pearson r, scatter | Bỏ lỡ quan hệ phi tuyến |
| Một feature được giải thích bởi các feature khác? | Hồi quy phụ, VIF | Cần xử lý missing, intercept và cột hằng đúng |
| Thay đổi X có gây thay đổi y? | Thiết kế nhân quả/thí nghiệm | r đơn độc không trả lời được |
:::

:::note Không kết luận quá mức (nhận xét)
Ngưỡng |r| > 0.7 trên [[slide:51]] là quy ước, không là kiểm định hay lệnh bỏ cột. Không có cặp vượt ngưỡng chưa loại trừ phụ thuộc nhiều biến. Sau đổi 0 thành NaN, correlation tính trên cặp quan sát còn lại có thể thay đổi do selection bias; không gọi đó là quan hệ thật đã được khôi phục. Pearson không đổi với affine scaling có hệ số dương; nhân một biến với số âm đảo dấu, biến hằng làm r không xác định.
:::

> **EN:** Pairwise thresholds do not rule out multivariate dependencies. Complete-case correlations can change through selection bias; they are not automatically the true population correlations.

## [sâu] Ghi nhớ cho đúng: tốt hoặc xấu với mục tiêu nào? (bổ sung từ ghi chú)

:::compare Liên hệ tuyến tính và loại model
| Quan hệ | Lợi ích hoặc rủi ro | Quyết định |
|---|---|---|
| Feature–target có r đáng kể | Có thể là tín hiệu tuyến tính hữu ích | Kiểm tra leakage và validation, không suy nhân quả |
| Feature–feature tương quan cao với model tuyến tính | Hệ số khó ổn định/diễn giải, có thể thêm chi phí | Bỏ/gộp cột hoặc regularize rồi đo lại |
| Feature–feature tương quan cao với cây/boosting dạng cây | Không gặp cùng bài toán nghịch đảo ma trận hệ số của OLS | Không bắt buộc bỏ; vẫn xem redundancy, thời gian và importance |
:::

Ghi chú “phi tuyến không khai thác quan hệ tuyến tính nên không quan tâm” cần sửa: **model phi tuyến vẫn học được quan hệ tuyến tính**. Cây/boosting thường chịu được feature tương quan tốt hơn khi xét dự đoán, nhưng không miễn nhiễm mọi hậu quả. Importance có thể chia cho các feature thay thế nhau; permutation importance từng cột có thể thấp vì cột còn lại thay thế được. “Ít ảnh hưởng độ chính xác” không đồng nghĩa diễn giải đáng tin.

> **EN:** Nonlinear models can learn linear relationships. Tree models avoid the same coefficient-identification problem as OLS, but correlated predictors can still affect cost and attribution.

:::pitfall Không tự động bỏ feature theo khẩu quyết
“Feature–target tốt, feature–feature xấu” là cách gợi nhớ trong bối cảnh tuyến tính, không phải luật chọn feature. r thấp có thể bỏ lỡ quan hệ phi tuyến/tương tác; r cao có thể do leakage. Với model tuyến tính, bỏ bớt có thể ổn định hệ số và giảm thời gian nhưng cũng có thể mất tín hiệu; so cùng split với regularization. Muốn nhìn dạng quan hệ trước khi bỏ cột, xem heatmap và scatter ở [[bài:data-visualization]].
:::
