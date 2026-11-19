---
title: Step 3.1–3.2 — Xử lý dữ liệu thiếu và Outliers
order: 17
description: "Hai phần đầu của Step 3 (slide 45 và 46): bỏ hay điền dữ liệu thiếu bằng median học từ train, và phát hiện outlier bằng IQR và z-score trên Insulin, quyết định theo nguyên nhân."
slides: 45-46
needs: [descriptive-statistics]
tags: [missing, imputation, outlier, iqr, zscore, MCAR, MAR, MNAR, MissForest, IterativeImputer]
---

## Dữ liệu thiếu hay dữ liệu khác thường: xử lý thế nào mà không rò rỉ?

:::intro Mục tiêu bài này
- Nhận ra ba dạng vấn đề ở slide 45 và 46: ô thiếu rõ ràng, giá trị thiếu hoặc sai trá hình, và **outlier**.
- Chọn cách xử lý thiếu (bỏ hay điền) và biết vì sao điền bằng **median học từ train**.
- Phát hiện outlier bằng **IQR** và **z-score**, thấy chúng cho kết quả khác nhau, và quyết định giữ, cắt hay bỏ theo nguyên nhân.
:::

Slide 45 và 46 là hai trong **bốn phần của Step 3 (Data preprocessing)**: *Handle missing or invalid values* (3.1), *Remove outliers* (3.2), *Data transformation* (3.3: [[bài:feature-scaling]], [[bài:categorical-encoding]]) và *Remove multicollinearity* (3.4: [[bài:correlation-multicollinearity]]). Bài này làm hai phần đầu.

## Ba dạng vấn đề

1. **Ô thiếu rõ ràng:** giá trị `NaN`, ô trống. Slide 45 dùng bảng Titanic với các ô thiếu (Missing values) ở những cột như `Age` và `Cabin`; `isna()` đếm được.
2. **Thiếu hoặc sai trá hình:** ô bị ghi thành giá trị "thay thế" như `0`, `-1`, `"N/A"`. Phải nhìn `describe()` ([[bài:descriptive-statistics]]) mới thấy. Diabetes không có ô `NaN` nào, nhưng **374** ô Insulin và **227** ô SkinThickness là số 0 vô lý.
3. **Giá trị khác thường (outlier):** nằm rất xa phần lớn dữ liệu. Slide 46 minh họa bằng một chú chim cánh cụt **trắng giữa bầy đen**: nó có thật, nhưng khác thường.

:::slides 45-46 | Slide 45–46: Step 3.1 xử lý dữ liệu thiếu hoặc sai; Step 3.2 loại bỏ outliers
:::

## Dữ liệu thiếu: bỏ hay điền?

**Bỏ hàng** đơn giản nhưng đắt. Nhìn 20 bệnh nhân đầu của Diabetes: cột Insulin có **11 ô bằng 0** trên 20. Xóa mọi hàng đó thì chỉ còn 9 bệnh nhân, mất hơn một nửa dữ liệu (cả các cột khác của họ, vốn đo đầy đủ). **Điền** (imputation) giữ lại dữ liệu bằng một giá trị hợp lý: trung bình, **trung vị**, giá trị phổ biến nhất, hoặc dự đoán từ các cột khác. Hãy tự thử cả bốn cách trên đúng 20 giá trị đó:

:::widget missing-outlier
impute
:::

:::predict
Trong 9 giá trị Insulin đã biết của 20 bệnh nhân đầu (83, 88, 94, 96, 168, 175, 230, 543, 846), trung bình là 258 và trung vị là 168. Điền ô thiếu bằng cái nào hợp lý hơn, và vì sao?
@answer
**Trung vị (168).** Hai giá trị rất lớn (543 và 846) kéo trung bình lên 258, cao hơn tới 7 trong 9 giá trị thật. Điền bằng trung bình gán cho người chưa đo một giá trị lớn hơn phần đông người thật sự được đo. Trung vị **bền** với giá trị cực đoan. Trên bộ train của Project: median Insulin là **120**, mean là **154.3**.
:::

Việc điền cũng là một bước **học từ dữ liệu** (nó tính median), nên theo luật chung: **tính median chỉ từ train** rồi áp cho cả train và test; tốt nhất đặt `SimpleImputer` trong Pipeline ([[bài:ml-pipeline]]). Ở Project Bước 7, điền median cho năm cột **không làm điểm cross-validation đổi đáng kể**: dọn dữ liệu đúng nguyên tắc không đảm bảo điểm tăng, chỉ đo bằng CV mới biết.

:::ck
Bạn điền ô thiếu bằng median của **toàn bộ** dữ liệu (cả test) rồi mới chia train/test. Điều đó sai ở đâu?
@answer
Median đã tính cả hàng test, nên giá trị điền cho train mang thông tin của test: một dạng **rò rỉ dữ liệu**. Với một con số đơn giản thì rò rỉ nhỏ, nhưng nguyên tắc không đổi, và với các bước học nhiều hơn (điền theo nhóm, điền bằng model) rò rỉ có thể lớn. Đúng cách: chia trước, `fit` imputer trên train.
:::

## Outlier: phát hiện bằng hai cách

Hai cách phổ biến, áp vào cột Insulin (394 giá trị khác 0):

:::steps
**IQR:** sắp xếp rồi lấy phân vị 25% **Q1 = 76.25** và 75% **Q3 = 190**. Khoảng giữa **IQR = Q3 − Q1 = 113.75**.
@step
**Hàng rào trên** = Q3 + 1.5 × IQR = 190 + 170.6 = **360.6**. Có **24** giá trị lớn hơn hàng rào: coi là outlier theo IQR.
@step
**z-score:** mean = 155.55, std = 118.63. Một giá trị bị coi là outlier nếu |z| = |(x − mean) / std| > 3. Có **8** giá trị vượt (giá trị lớn nhất, 846, có z = 5.82).
@step
Hai cách cho **24 so với 8**: khác nhau vì Insulin **lệch phải mạnh**, mean và std bị chính các giá trị lớn kéo lên nên z-score "dễ tính" hơn. Với dữ liệu lệch, IQR đáng tin hơn.
:::

Hãy tự kéo hệ số k của IQR và ngưỡng z để thấy số outlier đổi:

:::widget missing-outlier
outlier
:::

## Phát hiện rồi thì làm gì?

Quyết định theo **nguyên nhân**, không theo con số:

- **Là lỗi nhập liệu** (tuổi 200, giá nhà thiếu hoặc thừa số 0): sửa hoặc bỏ.
- **Là giá trị thật nhưng hiếm** (Insulin 846 ở một bệnh nhân thật): thường **giữ**; dùng scaler bền, model ít nhạy, hoặc biến đổi (ví dụ log).
- **Cắt ngưỡng (winsorize):** thay giá trị vượt hàng rào bằng chính hàng rào; ngưỡng phải học từ **train**.
- Chim cánh cụt trắng ở slide 46 là bài học: nó **hiếm nhưng thật**; xóa nó là xóa một phần của thế giới mà model cần gặp.

:::ck
Insulin 846 vượt hàng rào 360.6. Bạn nên xóa bệnh nhân đó khỏi dữ liệu không?
@answer
**Chưa nên vội.** Hãy kiểm tra: đó có thể là bệnh nhân thật có insulin cao, chính là kiểu mẫu ta muốn model nhận ra. Chỉ xóa khi xác định là lỗi. Nếu giữ, dùng cách xử lý bền (cắt ngưỡng, scaler bền, hoặc model ít nhạy như cây). Outlier **không đồng nghĩa với lỗi**.
:::

## Những hiểu sai thường gặp

- **"Không có NaN nghĩa là không thiếu."** Số 0 vô lý che đi dữ liệu thiếu (Diabetes không có `NaN` nhưng 374 ô Insulin thiếu).
- **"Điền bằng mean luôn ổn."** Mean nhạy với giá trị cực đoan; với dữ liệu lệch, median an toàn hơn.
- **"Outlier là phải bỏ."** Có thể là tín hiệu quan trọng; bỏ theo nguyên nhân.
- **"z-score và IQR cho cùng kết quả."** Khác nhau khi dữ liệu lệch (24 so với 8).
- **"Dọn dữ liệu chắc chắn tăng điểm."** Project Bước 7: không đáng kể; chỉ CV mới cho biết.

:::card Dữ liệu thiếu và outlier
- **Step 3 có bốn phần (slide 45–46):** xử lý thiếu, bỏ outlier, biến đổi dữ liệu, bỏ đa cộng tuyến.
- **Ba dạng:** ô `NaN`, thiếu trá hình (0, −1, "N/A"), outlier.
- **Xử lý thiếu:** bỏ (20 bệnh nhân đầu mất 11/20) hoặc điền; **median** (168) bền hơn mean (258) khi có giá trị lớn.
- **Điền là bước học từ dữ liệu:** median chỉ tính từ train, đặt trong Pipeline.
- **Outlier:** IQR (hàng rào Q3 + 1.5 IQR = 360.6, 24 giá trị) và z-score (|z| > 3, 8 giá trị); khác nhau khi dữ liệu lệch.
- **Quyết định theo nguyên nhân:** lỗi thì sửa hoặc bỏ; thật mà hiếm thì thường giữ.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: [[slide:45]] chia Step 3 thành những bước con nào? Bước 3.5 nằm ở
đâu?
A: 01 Handle missing or invalid value, 02 Remove outliers, 03
Data Transformation, 04 Remove multicollinearity. Bước 3.5 Balance data
không nằm trong 4 ô này mà ở [[slide:52-54]] ([[bài:imbalanced-data]]).
EN: Which sub-steps does [[slide:45]] list? Where is step 3.5?
**A:** Handle missing/invalid values, remove outliers, data
> transformation, remove multicollinearity; step 3.5 (balance data) is
> on slides 52–54 (lesson 21).

Q: Vì sao với cột Insulin nên điền **median** thay vì **mean**?
A: Insulin lệch phải mạnh và có outlier (846): vài giá trị rất
lớn kéo mean lên cao (ở ví dụ 20 dòng: mean 258.1, median 168). Median
không bị outlier kéo nên đại diện cho bệnh nhân điển hình tốt hơn.
EN: Why fill Insulin with the median rather than the mean?
**A:** Insulin is strongly right-skewed with outliers that inflate the
> mean (258.1 vs median 168 in the 20-row example); the median is
> robust.

Q: Một bạn điền Insulin thiếu bằng "median Insulin của những người
có cùng Outcome". Cách này sai ở đâu?
A: Outcome là label. Khi dự đoán bệnh nhân mới ta chưa biết
Outcome nên không áp dụng được; khi đánh giá thì giá trị điền đã "mách"
label cho model → **data leakage**, điểm đánh giá đẹp giả tạo.
EN: What's wrong with filling Insulin by the median of patients with
the same Outcome?
**A:** Outcome is the label — unknown at prediction time, and using it
> leaks the answer into the features (**data leakage**).

Q: Cho dãy 4, 5, 5, 6, 7, 8, 30. Dùng quy tắc IQR (vị trí
p × (n − 1)) tìm outlier.
A: n = 7. Q1: vị trí 0.25 × 6 = 1.5 → giữa 5 và 5 = **5**;
Q3: vị trí 4.5 → giữa 7 và 8 = **7.5**; IQR = **2.5**; cận dưới = 5 −
3.75 = **1.25**; cận trên = 7.5 + 3.75 = **11.25** → **30** là outlier.
EN: IQR outliers in 4, 5, 5, 6, 7, 8, 30?
**A:** Q1 = 5, Q3 = 7.5, IQR = 2.5, fences 1.25 and 11.25 → 30.

Q: Cùng dãy trên, z-score (std chia n) của 30 là bao nhiêu? Quy
tắc |z| > 3 có bắt được 30 không? Vì sao?
A: mean = 65 / 7 ≈ 9.286; Σ(x − mean)² ≈ 511.43 → std =
√(511.43 / 7) ≈ 8.55 → z(30) ≈ (30 − 9.286) / 8.55 ≈ **2.42** < 3 →
**không bắt được**. Hai lý do: 30 kéo mean và std lên (*masking*), và
với n = 7 thì |z| tối đa chỉ là √6 ≈ 2.45 — quy tắc |z| > 3 vô dụng với
mẫu này. IQR ở Câu 4 thì bắt được.
EN: z-score of 30 in that list; does |z| > 3 catch it?
**A:** z ≈ 2.42 < 3 → not caught: masking, and with n = 7 the
> maximum possible |z| is √6 ≈ 2.45.

Q: Giải thích vì sao không nên xóa các dòng có outlier trong tập
test.
A: Tập test mô phỏng dữ liệu thật mà model sẽ gặp khi triển
khai; ngoài đời không thể bỏ một bệnh nhân vì chỉ số lạ. Xóa outlier ở
test làm điểm đánh giá đẹp hơn thực tế. Với test chỉ áp dụng các phép
biến đổi (cắt ngưỡng, log) đã học từ train.
EN: Why not delete outlier rows from the test set?
**A:** The test set mimics real data; deleting rows inflates the
> score. Only apply train-learned transformations to it.
Q: Điền mean cho [10, 20, 30, thiếu, thiếu] làm std chia n đổi thế nào so với phần quan sát?
A: Mean = 20. Tổng bình phương độ lệch vẫn 200; trước là √(200/3) ≈ 8.1650, sau là √(200/5) ≈ 6.3246. Đây là so phần quan sát với tập sau điền, không phải biết được variance của toàn bộ dữ liệu thật.
@tier B | Phỏng vấn lý thuyết
Q: Khi nào dùng median thay mean để điền?
A: Median phù hợp baseline cho biến số lệch hoặc có cực trị vì ít bị kéo. Nó vẫn làm giảm variation và có thể bỏ qua quan hệ với cột khác; cần kiểm chứng trên validation.
EN: Median imputation is robust to extreme values but can reduce variation and ignore conditional relationships.
Q: IQR khác z-score ra sao?
A: IQR dùng quantile và khoảng giữa, z-score dùng mean/std nên dễ bị cực trị kéo. Hai quy tắc chỉ tạo cờ điều tra, không xác nhận điểm sai.
EN: IQR uses quartiles; z-scores use the mean and standard deviation and can suffer from masking.
Q: MCAR, MAR, MNAR phân biệt thế nào?
A: MCAR không phụ thuộc dữ liệu; MAR phụ thuộc biến đã quan sát; MNAR vẫn phụ thuộc giá trị chưa quan sát sau khi xét biến quan sát. Không xác định chắc cơ chế chỉ từ bảng dữ liệu thiếu.
EN: MCAR is independent missingness; MAR depends on observed variables; MNAR depends on unobserved values after conditioning on observed data.
Q: Vì sao thêm missing indicator có ích nhưng chưa đủ?
A: Thiếu có thể phản ánh quy trình thu thập nên indicator giữ tín hiệu đó. Nhưng model có thể học quy trình của nguồn cũ và không tổng quát; indicator không tự khử bias do MNAR.
EN: Missingness indicators can preserve useful signals but may encode collection bias and do not generally correct MNAR.
Q: MissForest có bảo đảm giữ phân phối và điền theo tần suất không?
A: Không. Nó học dự đoán từng cột từ các cột khác, có thể giữ quan hệ tốt hơn một hằng số trong dữ liệu phù hợp. Nó không phải bộ lấy mẫu theo histogram; dự đoán điểm vẫn có bias và cần kiểm chứng với cơ chế thiếu, mục tiêu và baseline.
EN: MissForest learns conditional predictions through iterative forests; it does not guarantee exact recovery of distributions or category frequencies.
@tier C | Tình huống doanh nghiệp
Q: Cột số có nhiều giá trị 0. Đổi hết thành missing được không?
A: Đọc định nghĩa và quy trình ghi trước: 0 có thể là giá trị thật, như số lần mua. Kiểm tra theo nguồn, thời gian và trường liên quan; chỉ đổi sentinel đã xác nhận, rồi thử imputation trong train. Đổi nhầm xóa tín hiệu thật *(bổ sung)*.
WANT: Không áp quy tắc từ Diabetes cho mọi cột số.
Q: Khi nào không được xóa outlier? Fraud có nhiều giao dịch rất lớn bị IQR đánh dấu, bạn làm gì?
A: Kiểm tra lỗi đơn vị/nhập liệu và liên hệ nhãn; giữ giao dịch hiếm có thật vì có thể chính là mục tiêu phát hiện. Thử biến đổi hoặc model bền, đánh giá trên dữ liệu đại diện. Xóa có thể nâng metric chung nhưng phá recall fraud *(bổ sung)*.
WANT: Phân biệt lỗi dữ liệu với tín hiệu hiếm quan trọng.
Q: Insulin thiếu nhiều, muốn bỏ cột ngay. Bạn quyết định sao?
A: So baseline có/không cột, median kèm indicator và phương án khác trên cùng split. Kiểm tra thiếu do nhóm nào và lúc serving có đo không. Cột thiếu nhiều vẫn có ích; model phức tạp hơn tăng chi phí và nguy cơ học bias nguồn *(bổ sung)*.
WANT: Không dùng một ngưỡng tỷ lệ thiếu làm quyết định tuyệt đối.
Q: Team muốn dùng MissForest cho bảng có cả mã sản phẩm và số đo để khỏi phải nghĩ về kiểu dữ liệu. Bạn xử lý sao?
A: Xác định cột số, categorical, target và thời điểm quan sát trước. Chọn triển khai hỗ trợ mixed types hoặc pipeline riêng, không dùng RandomForestRegressor để nội suy mã category. So median/mode với forest trong CV, fit chỉ train; đánh đổi chi phí, schema và khả năng tổng quát khi gặp category mới.
WANT: Phân biệt thuật toán MissForest với ví dụ iterative regressor, không dùng tên thư viện thay cho thiết kế dữ liệu.
:::

## Nối sang bài sau

:::next
Sau khi hiểu và xử lý giá trị thiếu/ngoại lai, các cột vẫn có thể khác nhau rất xa về đơn vị. [[bài:feature-scaling]] đưa feature số về thang đo thích hợp và giữ quy tắc fit trên train.

Thực hành: [[bài:diabetes-evaluate-improve]] — đổi sentinel0 đúng cột và học median trong train/fold.
:::

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Phân biệt ô trống, sentinel và giá trị sai.
- Tính ngưỡng IQR, đọc giới hạn z-score.
- Chọn xử lý dựa vào nguyên nhân mà không làm sạch test để lấy điểm.
:::

Nền để đọc bài này: [[bài:descriptive-statistics]].

:::slides 45-46 | Slide gốc — Step 3.1–3.2 — Xử lý dữ liệu thiếu và Outliers
:::

[[bài:descriptive-statistics]] đã "khám bệnh" cho Diabetes dataset và lập được danh sách vấn đề.
Từ bài này bắt đầu **chữa bệnh** — Step 3 *Data preprocessing* (tiền xử
lý dữ liệu). [[slide:45-46]] vẽ Step 3 thành **4 bước con**:

| Bước | Tên trên slide | Nghĩa | Bài |
|---|---|---|---|
| 01 | Handle missing or invalid value | Xử lý dữ liệu thiếu hoặc sai | **17 (bài này)** |
| 02 | Remove outliers | Loại bỏ outliers | **17 (bài này)** |
| 03 | Data Transformation | Biến đổi dữ liệu (scaling, encoding) | 18, 19 |
| 04 | Remove multicollinearity | Loại bỏ đa cộng tuyến | 20 |

Sau 4 bước này slide còn một bước **3.5 Balance data** ([[slide:52-54]]) —
[[bài:imbalanced-data]].

Hai vấn đề của bài này rất đời thường:

- **Dữ liệu thiếu (missing values)**: ô bị bỏ trống vì không ai ghi, không
  đo được, hoặc người khai không muốn trả lời. [[slide:45]] lấy ví dụ bảng
  **Titanic**: ô `Age` của hành khách số 6 và nhiều ô `Cabin` bị trống
  (các mũi tên đỏ "Missing values").
- **Dữ liệu sai (invalid values)**: ô có giá trị nhưng giá trị đó **không
  thể đúng** — như huyết áp = 0 trong Diabetes dataset ([[bài:descriptive-statistics]]), tuổi = −5,
  chiều cao 1700 cm do gõ thừa số 0.
- **Outlier (giá trị ngoại lai)**: điểm dữ liệu **khác hẳn** phần còn lại.
  [[slide:46]] minh họa bằng một bức ảnh: giữa đàn chim cánh cụt đen là một
  con **trắng toát** (mũi tên cam chỉ vào nó). Nó không "sai" — nó thật sự
  tồn tại — nhưng khác thường đến mức có thể làm lệch những gì model học
  về "chim cánh cụt điển hình".

Câu hỏi của bài: **phát hiện** những ô này thế nào, và **xử lý** thế nào
mà không làm hỏng dữ liệu còn lại?

> **EN:** Lesson 16 diagnosed the Diabetes dataset; from here we start the
> treatment — Step 3 *Data preprocessing*. Slides 45–46 split it into
> **four sub-steps**: (01) handle missing or invalid values, (02) remove
> outliers, (03) data transformation (lessons 18–19), (04) remove
> multicollinearity (lesson 20); step 3.5 balance data follows in lesson
> 21. **Missing values** are empty cells — [[slide:45]]'s **Titanic** table
> has an empty `Age` for passenger 6 and several empty `Cabin` cells.
> **Invalid values** are present but impossible (blood pressure 0, age
> −5). An **outlier** is a point far from the rest — [[slide:46]] shows a
> **white penguin** among black ones: real, not wrong, but unusual enough
> to distort what a model learns about a "typical" penguin. This lesson:
> how to **detect** and **treat** them without damaging the remaining
> data.

## [sâu] Đưa danh sách vấn đề sang bước xử lý

```
Step 2 Statistics → [ Step 3 Preprocessing ] → Step 4 Visualization → Step 5 Model building → …
   (bài 16)           3.1 Missing  ← bài 17
                      3.2 Outliers ← bài 17
                      3.3 Scaling (bài 18), Encoding (bài 19)
                      3.4 Correlation & Multicollinearity (bài 20)
                      3.5 Balance data (bài 21)
```

Bài này dùng trực tiếp ba phát hiện của [[bài:descriptive-statistics]]:

- `count` = 768 ở mọi cột → không có ô trống, nhưng có **374 số 0** ở
  Insulin, 227 ở SkinThickness… → dữ liệu thiếu **trá hình**.
- Max Insulin = 846, SkinThickness = 99 → **nghi outlier**.
- **IQR = Q3 − Q1** (đã gặp ở [[bài:descriptive-statistics]], mục 3.4.2) chính là công cụ phát
  hiện outlier ở bài này.

Và một nguyên tắc từ [[bài:train-test-split]]: mọi con số dùng để "sửa" dữ liệu (median để
điền, ngưỡng để cắt outlier) phải **tính trên tập train**, rồi áp dụng y
nguyên cho validation/test.

> **EN:** This lesson builds on three findings of lesson 16: no empty
> cells but **374 zeros** in Insulin (disguised missing data); suspicious
> maxima (Insulin 846, SkinThickness 99); and the **IQR**, which becomes
> our outlier detector. Plus a rule from lesson 07: every statistic used
> to fix data (fill values, outlier cut-offs) must be **computed on the
> training set** and then applied unchanged to validation/test.

## [sâu] Ba dạng dữ liệu thiếu hoặc sai

| Dạng | Trông như thế nào | Cách phát hiện | Ví dụ |
|---|---|---|---|
| **Ô trống thật** | `NaN`, `None`, ô rỗng | `data.isna().sum()` | Titanic: `Age`, `Cabin` ([[slide:45]]) |
| **Thiếu trá hình** | Một giá trị "giữ chỗ": 0, −1, 999, "?", "N/A" | Thống kê + hiểu ý nghĩa cột (`describe()`, đếm số 0) | Diabetes: Insulin = 0 |
| **Sai / không hợp lệ** | Có giá trị nhưng vô lý | So với khoảng hợp lý của cột | Tuổi = −5; huyết áp = 0; giới tính = "Nam " (thừa dấu cách) |

Dạng 2 và 3 phải **đổi về NaN** trước, sau đó xử lý chung như dạng 1.

*(Bổ sung — không có trong slide)* Nên hỏi thêm **vì sao** dữ liệu thiếu,
vì nó quyết định cách xử lý:

- **Thiếu hoàn toàn ngẫu nhiên** (MCAR — *Missing Completely At Random*):
  máy đo hỏng độc lập với các biến trong dữ liệu. Xóa dòng có thể ít gây bias nếu giả định đúng, nhưng vẫn mất dữ liệu; điền một hằng số vẫn có thể làm méo variance.
- **Thiếu phụ thuộc vào cột khác** (MAR — *Missing At Random*): ví dụ
  người trẻ ít được chỉ định xét nghiệm Insulin. Điền dựa trên các cột khác
  sẽ tốt hơn điền một số chung.
- **Thiếu phụ thuộc chính giá trị bị thiếu** (MNAR — *Missing Not At
  Random*): người thu nhập rất cao hay bỏ trống ô thu nhập. Bản thân việc
  "bị thiếu" đã mang thông tin → nên thêm cột chỉ báo (mục 3.2).

> **EN:** Three forms: **true blanks** (`NaN`; detect with
> `isna().sum()` — Titanic's `Age`, `Cabin`), **disguised missing
> values** (placeholders such as 0, −1, 999, "?" — need statistics plus
> domain knowledge; Diabetes' Insulin = 0) and **invalid values**
> (impossible entries such as age −5 or "Male " with a trailing space).
> Convert forms 2 and 3 to NaN first. *(Supplementary)* Ask **why** data
> is missing: **MCAR** (independent missingness — deletion still loses data and constant filling can distort variance),
> **MAR** (depends on other columns — impute using them), **MNAR**
> (depends on the missing value itself — the fact of being missing is
> informative; add an indicator column).

## [sâu] Các cách xử lý dữ liệu thiếu (Bổ sung — slide chỉ nêu tên bước, không liệt kê cách)

| Cách | Làm gì | Ưu | Nhược | Khi nào dùng |
|---|---|---|---|---|
| **Xóa dòng** (`dropna`) | Bỏ mọi dòng có ô thiếu | Đơn giản, không "bịa" số | Mất dữ liệu; có thể làm lệch mẫu | Rất ít dòng thiếu (< vài %) |
| **Xóa cột** | Bỏ cả feature | Đơn giản | Mất cả một nguồn thông tin | Cột thiếu quá nhiều (ví dụ > 60–70%) |
| **Điền mean** | Thay bằng trung bình cột | Giữ nguyên số dòng | Bị outlier kéo lệch; làm giảm độ phân tán | Cột số, phân bố gần đối xứng |
| **Điền median** | Thay bằng trung vị | Không bị outlier kéo | Vẫn làm giảm độ phân tán | Cột số **lệch** (như Insulin) |
| **Điền mode** | Thay bằng giá trị xuất hiện nhiều nhất | Dùng được cho cột chữ | Làm class phổ biến càng phổ biến | Cột categorical (ví dụ `Embarked`) |
| **Điền hằng số** | Thay bằng "Unknown", −1… | Giữ thông tin "đã từng thiếu" | Hằng số có thể bị hiểu nhầm là giá trị thật | Cột categorical; MNAR |
| **Điền theo nhóm** | Median của nhóm cùng đặc điểm | Sát thực tế hơn | Phức tạp hơn; **không được nhóm theo label** | Có cột liên quan rõ (tuổi theo danh xưng Mr/Mrs ở Titanic) |
| **Model điền** (`KNNImputer`, `IterativeImputer`) | Dự đoán ô thiếu từ các cột khác | Có thể tận dụng quan hệ giữa các cột | Chậm, phức tạp; không bảo đảm tốt nhất | Dataset vừa, MAR |
| **Thêm cột chỉ báo** | Cột mới `Insulin_missing` = 1/0, rồi điền | Model biết dòng nào từng bị thiếu | Thêm feature | MNAR; kết hợp với cách điền khác |

Hai lưu ý quan trọng:

**(1) Điền theo nhóm nhưng tuyệt đối không nhóm theo label.** Ví dụ trong
Diabetes dataset, median Insulin (bỏ số 0) của người không bệnh là 102.5,
của người bệnh là 169.5. Điền "median theo Outcome" trông rất hợp lý, nhưng
khi dự đoán bệnh nhân mới ta **chưa biết Outcome** → không thể áp dụng;
còn khi đánh giá thì ta đã vô tình "mách bài" cho model → điểm đánh giá đẹp
giả tạo. Đây là một dạng **rò rỉ dữ liệu (data leakage)**.

**(2) Điền cũng là "học" từ dữ liệu → chỉ học trên train.** Median dùng
để điền phải tính từ tập train rồi điền cho cả train lẫn test (giống
`fit` trên train, `transform` test — [[bài:train-test-split]], sẽ gặp lại ở [[bài:feature-scaling]]). Nếu
tính median trên toàn bộ dataset, thông tin của tập test đã lọt vào quá
trình huấn luyện.

> **EN:** *(Supplementary — the slide only names the step)* Options:
> **drop rows** (few missing), **drop columns** (mostly missing),
> **mean** (symmetric numeric), **median** (skewed numeric like Insulin),
> **mode** (categorical), **constant** such as "Unknown", **group-wise
> fill**, **model-based** (`KNNImputer`, `IterativeImputer`), and a
> **missing-indicator column**. Two rules: (1) never group by the
> **label** — Insulin medians are 102.5 (healthy) vs 169.5 (diabetic), but
> the label is unknown at prediction time and using it leaks information;
> (2) imputation is learning — compute the fill value on the **training
> set** only and apply it to both sets.

## [sâu] Áp dụng vào hai dataset trên slide

**Titanic ([[slide:45]])** *(số liệu toàn bộ dataset là bổ sung — slide chỉ
cho 6 dòng)*. Bộ Titanic đầy đủ có 891 hành khách:

| Cột | Số ô thiếu | Tỉ lệ | Cách hợp lý |
|---|---|---|---|
| Age | 177 | 19.9% | Điền median (có thể theo nhóm danh xưng Mr/Mrs/Miss/Master), thêm cột chỉ báo |
| Cabin | 687 | 77.1% | Thiếu quá nhiều → bỏ cột, hoặc chỉ giữ cột "có cabin hay không" |
| Embarked | 2 | 0.2% | Điền mode (`S`) hoặc xóa 2 dòng |

Với `Cabin`, việc **thiếu** gần như chắc chắn mang thông tin: hành khách
hạng 1 thường có số cabin ghi lại, hạng 3 thì không — tức là "thiếu" gắn
với hạng vé và khả năng sống sót.

**Diabetes ([[bài:descriptive-statistics]])**:

| Cột | Số 0 vô lý | Tỉ lệ | Cách hợp lý |
|---|---|---|---|
| Glucose | 5 | 0.65% | Đổi 0 → NaN, điền median |
| BloodPressure | 35 | 4.56% | Đổi 0 → NaN, điền median |
| BMI | 11 | 1.43% | Đổi 0 → NaN, điền median |
| SkinThickness | 227 | 29.56% | Điền median + cột chỉ báo |
| Insulin | 374 | 48.70% | Điền median + cột chỉ báo (hoặc cân nhắc bỏ cột) |

Vì sao không xóa dòng? Có **376 / 768 dòng** chứa ít nhất một số 0 vô lý;
xóa hết chỉ còn **392 dòng** (262 không bệnh, 130 bệnh) — mất gần nửa dữ
liệu, trong đó mất 138 / 268 người bệnh, đúng class mà ta đang thiếu.

> **EN:** **Titanic** *(full-dataset counts are supplementary)*: of 891
> passengers, Age is missing for 177 (19.9%) → median, perhaps by title,
> plus an indicator; Cabin for 687 (77.1%) → drop it or keep only "has a
> cabin"; Embarked for 2 → mode `S`. Missing Cabin is informative (tied
> to ticket class). **Diabetes**: convert impossible zeros to NaN and fill
> with the median; add indicators for SkinThickness and Insulin. Dropping
> rows would leave only **392 of 768** rows (262 healthy, 130 diabetic) —
> losing 138 of the 268 diabetic patients, the class we already lack.

## [sâu] Outlier là gì và đến từ đâu

**Outlier** là điểm dữ liệu nằm **rất xa** phần lớn các điểm khác. Có hai
loại, xử lý khác nhau hoàn toàn *(bổ sung)*:

- **Outlier do lỗi**: gõ nhầm (BMI = 670 thay vì 67.0), sai đơn vị (cân
  nặng ghi gram thay vì kg), máy đo hỏng. → Sửa nếu biết giá trị đúng, nếu
  không thì coi như dữ liệu thiếu.
- **Outlier thật**: hiếm nhưng có thật — như chú chim cánh cụt trắng ở
  [[slide:46]], hay một bệnh nhân có Insulin 846 thật. → Không nên vội xóa:
  đôi khi chính những điểm hiếm này là thứ quan trọng nhất (giao dịch gian
  lận, ca bệnh nặng).

Vì sao outlier gây hại? Nhiều thứ trong ML dựa vào **mean và bình phương
sai số**, mà bình phương phóng đại khoảng cách lớn: một điểm lệch 10 đơn vị
đóng góp 100 vào tổng, bằng 100 điểm lệch 1 đơn vị. Nhớ lại [[bài:loss-function]]: L2
loss (bình phương) nhạy với outlier hơn L1 loss (trị tuyệt đối) chính vì
vậy. Tương tự: mean, std, MinMaxScaler ([[bài:feature-scaling]]), Linear Regression đều bị
outlier kéo; median, IQR và các model dạng cây (Decision Tree, Random
Forest — P07) thì ít bị ảnh hưởng.

> **EN:** An **outlier** lies far from most points. *(Supplementary)*
> **Error outliers** (typos, wrong units, broken sensors) should be
> corrected or treated as missing; **genuine outliers** (the white
> penguin, a real Insulin of 846) shouldn't be deleted blindly — rare
> cases are sometimes what matters most (fraud, severe illness). They
> hurt because much of ML relies on **means and squared errors**: a
> deviation of 10 contributes 100, as much as 100 deviations of 1 —
> exactly why L2 loss is more outlier-sensitive than L1 (lesson 06).
> Mean, std, MinMaxScaler and Linear Regression are pulled by outliers;
> median, IQR and tree models are robust.

## [sâu] Phát hiện outlier: IQR và z-score (Bổ sung — slide chỉ có hình minh họa)

**Cách 1 — Quy tắc IQR (của Tukey).**

```
IQR = Q3 − Q1
Cận dưới = Q1 − 1.5 × IQR
Cận trên = Q3 + 1.5 × IQR
Outlier: giá trị < cận dưới hoặc > cận trên
```

Đây chính là cách **box plot** vẽ "râu" và chấm outlier (sẽ học ở module
04). Vì dùng Q1, Q3 nên ngưỡng **không bị chính outlier kéo lệch** → hợp
với dữ liệu lệch. Hệ số 1.5 là quy ước; dùng 3 nếu chỉ muốn bắt outlier
"cực đoan".

**Cách 2 — z-score.**

```
z = (x − mean) / std
Outlier: |z| > 3 (đôi khi dùng 2.5 hoặc 2)
```

z cho biết điểm đó cách mean bao nhiêu lần độ lệch chuẩn. Nếu dữ liệu gần
phân phối chuẩn, chỉ khoảng 0.27% điểm có |z| > 3 (quy tắc 3σ — sẽ học ở
P16). Nhược điểm: mean và std **bị chính outlier kéo** → outlier "che"
chính mình (*masking*). Với mẫu nhỏ còn tệ hơn: với n điểm, |z| (std chia
n) **không bao giờ vượt quá √(n − 1)** — với n ≤ 10 thì |z| ≤ 3, tức quy
tắc |z| > 3 **không thể** bắt được outlier nào (ví dụ ở mục 4).

| | IQR | z-score |
|---|---|---|
| Dựa trên | Q1, Q3 (vững với outlier) | mean, std (bị outlier kéo) |
| Hợp với | Dữ liệu lệch, mẫu nhỏ | Dữ liệu gần phân phối chuẩn, mẫu lớn |
| Ngưỡng mặc định | 1.5 × IQR | \|z\| > 3 |

**Kết quả trên Diabetes dataset** (đã đổi số 0 vô lý thành NaN, tính trên
toàn bộ 768 dòng để minh họa):

| Cột | Q1 | Q3 | IQR | Cận dưới | Cận trên | Outlier (IQR) | Outlier (\|z\| > 3) |
|---|---|---|---|---|---|---|---|
| Glucose | 99 | 141 | 42 | 36 | 204 | 0 | 0 |
| BloodPressure | 64 | 80 | 16 | 40 | 104 | 14 | 8 |
| SkinThickness | 22 | 36 | 14 | 1 | 57 | 3 | 2 |
| Insulin | 76.25 | 190 | 113.75 | −94.375 | 360.625 | 24 | 8 |
| BMI | 27.5 | 36.6 | 9.1 | 13.85 | 50.25 | 8 | 4 |
| Pregnancies | 1 | 6 | 5 | −6.5 | 13.5 | 4 | 4 |
| DPF | 0.244 | 0.626 | 0.382 | −0.330 | 1.200 | 29 | 11 |
| Age | 24 | 41 | 17 | −1.5 | 66.5 | 9 | 5 |

Đọc bảng: IQR "khó tính" hơn z-score (bắt nhiều hơn) với các cột lệch phải
như Insulin, DPF. Nhưng **"bị đánh dấu" chưa có nghĩa là "phải xóa"**:
29 người có DPF > 1.2 chỉ là những người có tiền sử gia đình nặng — thông
tin quý cho bài toán tiểu đường. Người mang thai 17 lần hiếm nhưng hoàn
toàn có thể. Chỉ SkinThickness = 99 mm (với BMI 34.7) là trông giống lỗi
đo hơn.

> **EN:** *(Supplementary — the slide only has a picture)* **IQR rule
> (Tukey)**: flag values below Q1 − 1.5·IQR or above Q3 + 1.5·IQR — the
> same rule box plots use (module 04); robust because quartiles aren't
> pulled by outliers. **z-score**: z = (x − mean)/std, flag |z| > 3
> (≈ 0.27% of normal data — the 3σ rule, P16); but mean and std are
> pulled by the outliers themselves (**masking**), and with n points |z|
> never exceeds √(n − 1), so for n ≤ 10 the |z| > 3 rule can't flag
> anything. On Diabetes (zeros as NaN), IQR flags more points than z in
> skewed columns (Insulin 24 vs 8, DPF 29 vs 11). **Flagged ≠ delete**:
> high DPF is valuable family history and 17 pregnancies is rare but
> possible; only SkinThickness = 99 mm looks like a measurement error.

## [sâu] Xử lý outlier (Bổ sung)

| Cách | Làm gì | Khi nào |
|---|---|---|
| **Xóa** | Bỏ dòng chứa outlier | Chắc chắn là lỗi, và số dòng bị xóa ít |
| **Sửa / coi là thiếu** | Đổi thành NaN rồi điền như mục 3.2 | Lỗi nhưng không biết giá trị đúng |
| **Cắt ngưỡng** (*capping / winsorizing*) | Kéo giá trị vượt cận về đúng cận (`clip`) | Muốn giữ dòng nhưng hạn chế ảnh hưởng |
| **Biến đổi** | Lấy log, căn bậc hai để "nén" đuôi dài | Cột lệch phải mạnh (Insulin, thu nhập) |
| **Giữ nguyên** | Không làm gì; chọn model/scaler vững với outlier | Outlier thật, mang thông tin (dùng RobustScaler — [[bài:feature-scaling]], model dạng cây — P07) |

Ba quy tắc an toàn:

1. **Tìm hiểu trước khi xóa.** Hỏi "giá trị này có thể xảy ra trong thực
   tế không?" — câu hỏi của domain knowledge, không phải của thống kê.
2. **Ngưỡng tính trên train.** Q1, Q3, mean, std dùng làm ngưỡng phải tính
   từ train.
3. **Không xóa dòng ở tập test.** Tập test đại diện cho dữ liệu thật mà
   model sẽ gặp; ngoài đời không thể "xóa" một bệnh nhân vì chỉ số lạ. Với
   test chỉ được dùng cách **biến đổi** (cắt ngưỡng, log) đã học từ train.

> **EN:** *(Supplementary)* Treatments: **delete** (certain errors, few
> rows), **set to missing** and impute, **cap/winsorize** to the cut-offs
> (`clip`), **transform** (log, square root) to compress a long tail, or
> **keep** and use robust tools (RobustScaler, tree models). Safety rules:
> investigate before deleting (can this value happen in reality?);
> compute cut-offs on the training set; never delete test rows — the test
> set mimics real-world data; only apply train-learned transformations to
> it.

## [sâu] Điền dữ liệu thiếu trên bảng Titanic của slide 45

6 hành khách trên slide có Age: 22, 38, 26, 35, 35, **trống**.

- Mean của 5 giá trị có: (22 + 38 + 26 + 35 + 35) / 5 = 156 / 5 = **31.2**
- Median: sắp xếp 22, 26, 35, 35, 38 → giá trị giữa = **35**

Điền mean → Age hành khách 6 = 31.2; điền median → 35. Hai cách cho kết
quả khác nhau gần 4 tuổi chỉ vì một người 22 tuổi kéo mean xuống. Cột
`Cabin` thì 4 / 6 ô trống (≈ 67%) ngay trong 6 dòng này — dấu hiệu nên bỏ
cột hoặc chỉ giữ "có / không có cabin".

## [sâu] Insulin của 20 bệnh nhân đầu tiên (Diabetes)

Insulin của 20 dòng đầu: 0, 0, 0, 94, 168, 0, 88, 0, 543, 0, 0, 0, 0,
846, 175, 0, 230, 0, 83, 96.

**Bước 1 — Phát hiện thiếu.** Có **11 / 20** số 0 → đổi thành NaN. Còn 9
giá trị thật, sắp xếp:

| Vị trí | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| Giá trị | 83 | 88 | 94 | 96 | 168 | 175 | 230 | 543 | 846 |

**Bước 2 — Chọn giá trị điền.**

- mean = (83 + 88 + 94 + 96 + 168 + 175 + 230 + 543 + 846) / 9 = 2323 / 9
  ≈ **258.1**
- median = giá trị ở vị trí 4 = **168**

Mean lớn hơn median 90 đơn vị vì hai số 543 và 846 → điền **median** hợp
lý hơn. Nếu điền mean, 11 bệnh nhân sẽ được gán Insulin 258 — cao hơn 7 / 9
người có số đo thật.

**Bước 3 — Phát hiện outlier bằng IQR** (vị trí p × (n − 1) như [[bài:descriptive-statistics]]):

- Q1: vị trí 0.25 × 8 = 2 → **94**
- Q3: vị trí 0.75 × 8 = 6 → **230**
- IQR = 230 − 94 = **136**
- Cận dưới = 94 − 1.5 × 136 = 94 − 204 = **−110**
- Cận trên = 230 + 204 = **434**

→ **543 và 846** là outlier theo IQR.

**Bước 4 — Thử z-score** (std chia n, như `StandardScaler`):

- Σ(x − mean)² ≈ 555 406.9 → std = √(555 406.9 / 9) ≈ **248.4**
- z(846) = (846 − 258.1) / 248.4 ≈ **2.37**
- z(543) = (543 − 258.1) / 248.4 ≈ **1.15**

Không điểm nào có |z| > 3 → z-score **không bắt được** outlier nào! Lý do:
chính 846 đã kéo mean lên 258 và std lên 248 (*masking*); hơn nữa với n = 9,
|z| tối đa chỉ có thể là √(9 − 1) = √8 ≈ **2.83**.

**Bước 5 — Xử lý bằng cắt ngưỡng.** Nếu quyết định capping ở cận trên 434:
543 → 434, 846 → 434. Dãy mới có mean = (2323 − 543 − 846 + 434 + 434) / 9
= 1802 / 9 ≈ **200.2** (giảm từ 258.1), còn median vẫn **168** — median
không đổi, minh chứng nó vững với outlier.

> **EN:** **4.1 Titanic ([[slide:45]]):** ages 22, 38, 26, 35, 35 and one
> blank → mean 31.2, median 35; one young passenger drags the mean down.
> Cabin is blank in 4 of 6 rows. **4.2 Insulin, first 20 Diabetes rows:**
> 11 of 20 are zeros → NaN; the 9 real values have mean ≈ 258.1 and median
> 168 → fill with the median. IQR: Q1 = 94, Q3 = 230, IQR = 136, fences
> −110 and 434 → 543 and 846 are outliers. z-score (population std ≈
> 248.4): z(846) ≈ 2.37, z(543) ≈ 1.15 → nothing flagged (masking; with
> n = 9 the maximum possible |z| is √8 ≈ 2.83). Capping at 434 lowers the
> mean to ≈ 200.2 while the median stays 168.

## [sâu] Fit trên train rồi áp dụng test

Cần file `diabetes.csv` cùng thư mục (như [[bài:descriptive-statistics]]). Toàn bộ code mục này
là *tự soạn — slide không có code cho Step 3.1–3.2*.

## [sâu] Phát hiện và đổi dữ liệu thiếu trá hình thành NaN

```python
import numpy as np
import pandas as pd

data = pd.read_csv("diabetes.csv")
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]

print(data.isna().sum().sum())                     # 0 -> không có ô trống thật
print((data[zero_cols] == 0).sum().to_dict())
# {'Glucose': 5, 'BloodPressure': 35, 'SkinThickness': 227, 'Insulin': 374, 'BMI': 11}

clean = data.copy()
clean[zero_cols] = clean[zero_cols].replace(0, np.nan)
print(clean.isna().sum()[zero_cols].to_dict())     # giờ là NaN thật

rows_missing = clean[zero_cols].isna().any(axis=1)
print(rows_missing.sum(), (~rows_missing).sum())   # 376 392
print(clean.dropna()["Outcome"].value_counts().to_dict())  # {0: 262, 1: 130}
```

## [sâu] Điền dữ liệu thiếu đúng cách: fit trên train

```python
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer

X = clean.drop(columns="Outcome")
y = clean["Outcome"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

# Cột chỉ báo "từng bị thiếu" cho 2 cột thiếu nhiều (tạo trước khi điền)
for col in ["SkinThickness", "Insulin"]:
    X_train[f"{col}_missing"] = X_train[col].isna().astype(int)
    X_test[f"{col}_missing"] = X_test[col].isna().astype(int)

imputer = SimpleImputer(strategy="median")
imputer.fit(X_train)                     # median chỉ học từ train
X_train_f = pd.DataFrame(imputer.transform(X_train), columns=X_train.columns)
X_test_f = pd.DataFrame(imputer.transform(X_test), columns=X_test.columns)

print(dict(zip(X_train.columns, imputer.statistics_.round(2).tolist())))
# Glucose 117.0, BloodPressure 72.0, SkinThickness 29.0, Insulin 125.0, BMI 32.4, ...
print(X_train_f.isna().sum().sum(), X_test_f.isna().sum().sum())   # 0 0
```

## [sâu] Phát hiện outlier bằng IQR và z-score

```python
def iqr_bounds(s, k=1.5):
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    return q1 - k * iqr, q3 + k * iqr

rows = []
for col in X.columns:
    s = clean[col].dropna()
    lo, hi = iqr_bounds(s)
    z = (s - s.mean()) / s.std(ddof=0)
    rows.append({"feature": col, "lo": round(lo, 3), "hi": round(hi, 3),
                 "out_iqr": int(((s < lo) | (s > hi)).sum()),
                 "out_z3": int((z.abs() > 3).sum())})
print(pd.DataFrame(rows).to_string(index=False))
# Insulin: lo = -94.375, hi = 360.625, out_iqr = 24, out_z3 = 8
```

## [sâu] Xử lý outlier: cắt ngưỡng học từ train

```python
lo, hi = iqr_bounds(X_train["Insulin"].dropna())   # ngưỡng chỉ tính trên train
X_train["Insulin_capped"] = X_train["Insulin"].clip(lower=lo, upper=hi)
X_test["Insulin_capped"] = X_test["Insulin"].clip(lower=lo, upper=hi)  # áp ngưỡng của train
print(round(hi, 3), X_train["Insulin"].max(), X_train["Insulin_capped"].max())
# 344.75 744.0 344.75  (ngưỡng train khác ngưỡng toàn bộ dataset 360.625)

# Biến đổi log để nén đuôi dài (log1p = log(1 + x), an toàn khi x = 0)
print(clean["Insulin"].skew().round(2), np.log1p(clean["Insulin"]).skew().round(2))
# 2.17 -0.09  -> sau log, phân bố gần đối xứng
```

## [sâu] Kiểm tra ví dụ tay

```python
ins = data["Insulin"].head(20)
print((ins == 0).sum())                            # 11
v = ins[ins > 0]
print(sorted(v), round(v.mean(), 1), v.median())   # mean 258.1, median 168.0
print(iqr_bounds(v))                               # (-110.0, 434.0)
z = (v - v.mean()) / v.std(ddof=0)
print(z.round(2).max(), round(np.sqrt(8), 2))      # 2.37  2.83
capped = v.clip(upper=434)
print(round(capped.mean(), 1), capped.median())    # 200.2 168.0
```

> **EN:** *(Own code — the slides have no code for steps 3.1–3.2)* 5.1
> converts impossible zeros to NaN and shows that dropping incomplete
> rows leaves 392 rows. 5.2 splits first, adds missing-indicator columns,
> and fits a median `SimpleImputer` on the training set only. 5.3 counts
> outliers per column with IQR and |z| > 3. 5.4 caps Insulin at
> train-learned IQR fences and shows `log1p` reducing skew. 5.5 checks
> the hand example.

## [sâu] Giả định cần nói rõ khi điền (bổ sung)

:::compare MCAR, MAR và MNAR
| Cơ chế | Thiếu phụ thuộc vào | Hệ quả |
|---|---|---|
| MCAR | Không phụ thuộc dữ liệu quan sát hay chưa quan sát | Xóa dòng vẫn giảm dữ liệu; điền đơn giản vẫn có thể méo variance |
| MAR | Biến đã quan sát | Có thể tận dụng biến liên quan khi impute |
| MNAR | Giá trị thiếu/chưa quan sát, dù đã điều kiện trên biến quan sát | Indicator có thể hữu ích nhưng không tự sửa được bias |
:::

:::pitfall Nhãn outlier không phải bằng chứng sai
IQR và z-score là quy tắc gắn cờ, không tự quyết định xóa. Model-based imputation không bảo đảm chính xác nhất; cần so trên validation. Lỗi định dạng như khoảng trắng nên chuẩn hóa nếu khôi phục được giá trị, không bắt buộc đổi mọi lỗi thành NaN. Với bài học này, các con số y sinh chỉ là ví dụ dữ liệu, không dùng làm ngưỡng quyết định thực tế.
:::

> **EN:** Missingness mechanisms require assumptions. An indicator is not a general cure for MNAR bias; outlier flags and model-based imputation also require validation.

## [sâu] Điền một giá trị chung làm phân phối đổi thế nào? (bổ sung từ ghi chú)

Ghi chú nhấn mạnh: dữ liệu số có thể điền mean/median, categorical nominal hoặc ordinal có thể điền mode. Median là baseline bền với outlier, nhưng không luôn tốt nhất; mode có thể làm nhóm phổ biến áp đảo hơn. Xóa hàng khi tỷ lệ rất nhỏ, chẳng hạn dưới khoảng 5%, chỉ là điểm bắt đầu cân nhắc: vẫn phải xem hàng bị xóa thuộc nhóm nào và cơ chế thiếu. Thiếu ít nhưng tập trung ở một nhóm hiếm vẫn có thể gây bias lớn.

> **EN:** Median and mode are useful baselines, not universal rules. A small deletion rate does not guarantee that dropping rows is unbiased.

:::worked Co phương sai và làm yếu tương quan — dữ liệu tự soạn
Giả sử bảng đầy đủ được biết để kiểm chứng trong ví dụ:

| x | y đầy đủ | y sau khi che | y điền mean/median |
|---|---|---|---|
| 1 | 10 | 10 | 10 |
| 2 | 20 | 20 | 20 |
| 3 | 30 | 30 | 30 |
| 4 | 40 | thiếu | 20 |
| 5 | 50 | thiếu | 20 |

Ba giá trị quan sát có mean = median = 20. Tổng bình phương độ lệch quanh 20 là 100 + 0 + 100 = 200.

- Chỉ xét ba giá trị quan sát: variance chia n = 200/3, std ≈ **8.1650**.
- Sau điền: thêm hai số đúng bằng mean, không thêm độ lệch; variance = 200/5 = 40, std ≈ **6.3246**.
- Bảng đầy đủ giả lập ban đầu có mean 30, std ≈ **14.1421** và r(x,y) = **1**. Sau điền r ≈ **0.4472**: hai hàng x lớn không còn đi cùng y lớn.

Không được dùng std của ba giá trị quan sát làm “std thật của dữ liệu đầy đủ”. Ở dữ liệu thật ta không biết các ô bị che; bảng này chỉ cho thấy một cơ chế làm méo dữ liệu. Điền median không nhất thiết giảm variance trong mọi trường hợp; làm yếu correlation cũng không phải định luật cho mọi cách thiếu.
:::

```python
import numpy as np

x = np.arange(1, 6)
truth = np.array([10., 20., 30., 40., 50.])
observed = np.array([10., 20., 30., np.nan, np.nan])
filled = np.where(np.isnan(observed), np.nanmean(observed), observed)
print(np.nanstd(observed), filled.std(), truth.std())  # ddof=0
# 8.1649658, 6.3245553, 14.1421356
print(np.corrcoef(x, truth)[0, 1], np.corrcoef(x, filled)[0, 1])
# 1.0, 0.4472136
```

> **EN:** Filling every missing entry with the same mean adds no centered variation but increases the denominator. It can distort both marginal distributions and cross-feature relationships; the effect depends on the missingness pattern.

## [sâu] MissForest: dự đoán ô thiếu từ các cột khác (bổ sung)

MissForest khởi tạo các ô thiếu, rồi lần lượt học random forest để dự đoán phần thiếu của từng cột từ những cột còn lại; cập nhật qua nhiều lượt tới tiêu chí dừng hoặc giới hạn lặp. Với dữ liệu hỗn hợp, cột số dùng hồi quy, cột categorical dùng phân loại. Ý chính của ghi chú “tần suất cao điền nhiều, thấp điền ít” là **không gán cùng một số cho mọi hàng**, mà tận dụng quan hệ có điều kiện giữa các cột. Đây không phải quy tắc lấy mẫu theo histogram và không bảo đảm giữ nguyên tần suất/phân phối.

> **EN:** MissForest iteratively predicts missing entries using forests fitted to the other variables. It exploits conditional relationships rather than filling by a global frequency rule.

:::pitfall Không có bảo đảm khôi phục phân phối gốc
Random forest có thể tận dụng quan hệ phi tuyến nhưng vẫn sai khi thiếu thông tin, nhãn/feature nhiễu hoặc MNAR. Dự đoán điểm cũng có thể làm giảm độ phân tán; “tốt hơn baseline” cần được kiểm chứng. Chi phí huấn luyện tăng vì học nhiều rừng qua nhiều lượt. Không dùng target tương lai làm đầu vào cho imputer. Xem [bài báo MissForest](https://arxiv.org/abs/1105.0828).
:::

### Code chạy được: iterative imputation với random forest cho cột số

Cài `pip install numpy scikit-learn`. Ví dụ dùng **Diabetes regression của scikit-learn**, không phải bảng Pima `Outcome` trong slide. Chỉ dùng feature số, bỏ target. Đây là phương án có tinh thần tương tự MissForest; không phải bản tái hiện đầy đủ MissForest cho dữ liệu hỗn hợp hay cùng tiêu chí dừng.

```python
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.experimental import enable_iterative_imputer  # noqa: F401
from sklearn.impute import IterativeImputer
from sklearn.ensemble import RandomForestRegressor

X, _ = load_diabetes(return_X_y=True)
X_train, X_test = train_test_split(X, test_size=0.2, random_state=42)
rng = np.random.default_rng(42)
X_train = X_train.copy()
X_test = X_test.copy()
X_train[rng.random(X_train.shape) < 0.15] = np.nan
X_test[rng.random(X_test.shape) < 0.15] = np.nan

imputer = IterativeImputer(
    estimator=RandomForestRegressor(
        n_estimators=50, max_depth=6, min_samples_leaf=3,
        random_state=42, n_jobs=1),
    initial_strategy="median", max_iter=30, tol=0.1, random_state=42)
train_filled = imputer.fit_transform(X_train)  # chỉ học trên train
test_filled = imputer.transform(X_test)        # dùng các mô hình đã học
assert train_filled.shape == X_train.shape
assert test_filled.shape == X_test.shape
assert not np.isnan(train_filled).any()
assert not np.isnan(test_filled).any()
print("Số lượt:", imputer.n_iter_)
```

API còn experimental, cần import enable trước; `max_iter` là trần số lượt, không cam kết hội tụ. Trong CV, đặt imputer trong Pipeline để fit lại trong từng fold. Không truyền mã category vào regressor rồi coi số lẻ trả về là category hợp lệ. Đối chiếu [IterativeImputer](https://scikit-learn.org/stable/modules/generated/sklearn.impute.IterativeImputer.html).

> **EN:** The example is numeric-only iterative forest imputation, not a full mixed-type MissForest implementation. Fit on training data only and refit inside each CV fold.

:::pitfall Khi outlier chính là mục tiêu
Đừng xóa giao dịch hiếm hoặc ca bất thường chỉ vì chúng xa số đông. Nếu mục tiêu là phát hiện fraud hay bệnh hiếm, xóa chúng có thể xóa chính tín hiệu cần học. Một ca bệnh hiếm chưa chắc là outlier trong không gian feature; “class thiểu số” và “outlier” không đồng nghĩa. Nối với [[bài:imbalanced-data]] để chọn metric và cách học cho lớp cần phát hiện.
:::
