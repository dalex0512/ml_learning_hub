---
title: Step 4 — Data Visualization với matplotlib và pandas
order: 22
description: "Chọn biểu đồ theo câu hỏi (slide 55 đến 63): histogram, density, box plot, correlation matrix, scatter matrix vẽ từ Diabetes, và các phần Figure, Axes, Axis của matplotlib."
slides: 55-63
needs: [descriptive-statistics, correlation-multicollinearity]
tags: [visualization, matplotlib, pandas, histogram, density, boxplot, heatmap, scatter, kde]
---

## Hỏi gì thì chọn hình đó

:::intro Mục tiêu bài này
- Chọn biểu đồ theo **câu hỏi** muốn trả lời, không theo thói quen, qua các hình của Step 4 (slide 55 đến 63).
- Đọc đúng **histogram, density, box plot, correlation matrix, scatter matrix** trên chính bộ Diabetes.
- Gọi đúng tên các phần của một hình trong matplotlib: **Figure, Axes, Axis**, tiêu đề, nhãn, lưới, chú giải.
:::

Bảng số cho ta con số, nhưng không cho thấy **hình dạng**. Biểu đồ trả lời những câu hỏi mà `describe()` không trả lời được. Step 4 của pipeline ([[bài:ml-pipeline]]) dùng hai thư viện: **matplotlib** và **seaborn** (slide 55). Quy tắc: **bắt đầu từ câu hỏi**, rồi chọn hình.

:::slides 55-63 | Slide 55–63: Step 4 Data visualization, histogram, density, box plot, correlation matrix, scatter matrix và các phần của matplotlib
:::

Hãy bấm từng câu hỏi bên dưới để xem hình tương ứng (vẽ từ bộ Diabetes), cách đọc và dòng code:

:::widget viz-chooser
:::

:::predict
Bạn muốn biết **Glucose của người bệnh có khác người không bệnh** không. Chọn hình nào, và bạn mong thấy gì?
@answer
**Histogram chồng (hoặc box plot) của Glucose theo `Outcome`.** Mong thấy nhóm bệnh lệch sang phải (trung vị 140 so với 107) nhưng hai nhóm **chồng lấn nhiều**: không một cột nào đủ để tách hẳn hai nhóm. Đây chính là hình ở Project Bước 1.
:::

## Histogram và density (slide 56 và 57)

**Histogram** chia trục giá trị thành các khoảng (bin) và đếm số mẫu mỗi khoảng; `data.hist()` vẽ cả tám cột một lượt. **Số bin** ảnh hưởng hình dạng: quá ít thì che chi tiết, quá nhiều thì nhiễu. **Density plot** (slide 57, `kind="density"`) làm trơn histogram thành một đường cong: đẹp, nhưng đó là **ước lượng**, không phải mật độ thật, và độ trơn cũng là một lựa chọn.

Trên Diabetes, histogram cho thấy ngay hai điều: **Insulin** dồn rất mạnh về 0 (nhiều số 0 thiếu) với đuôi dài bên phải, và **Glucose** có một cột nhỏ lạc ở 0. Đó chính là hai manh mối đã thấy bằng `describe()`, nhưng nhìn bằng hình thì rõ hơn nhiều.

## Box plot (slide 58)

Một hộp trải từ **Q1 đến Q3** (nửa giữa của dữ liệu), vạch trong hộp là **trung vị**. Hai "ria" kéo tới giá trị xa nhất còn nằm trong **1.5 × IQR** tính từ hộp; điểm ngoài ria được vẽ riêng là **outlier tiềm năng** ([[bài:missing-values-outliers]]).

Các con số thật trên Diabetes (tính trên cả 768 hàng):

| Cột | Q1 | Q3 | Hàng rào (1.5 × IQR) | Điểm ngoài |
|---|---|---|---|---|
| Glucose | 99 | 140.25 | 37.1 đến 202.1 | 5 điểm **dưới** (đều là số 0) |
| BMI | 27.3 | 36.6 | 13.4 đến 50.6 | 11 điểm dưới (số 0) và 8 điểm trên |
| Age | 24 | 41 | −1.5 đến 66.5 | 9 điểm trên |
| Insulin | 0 | 127.25 | −190.9 đến 318.1 | 34 điểm trên |

Box plot vì thế là công cụ rất tốt để **lộ ra số 0 thiếu trá hình** ở Glucose và BMI: chúng hiện ra thành các chấm lẻ loi dưới ria. Với Insulin, Q1 = 0 (hơn một phần tư số ô là 0) nên cả hộp bị kéo xuống 0 và box plot kém hữu ích cho tới khi ta xử lý số 0.

## Correlation matrix và scatter matrix (slide 59 đến 62)

**Correlation matrix** (`data.corr()`, rồi tô màu bằng `sns.heatmap(..., annot=True)`) là bảng hệ số r của mọi cặp cột. Hãy đọc **con số** trong ô, đừng chỉ nhìn màu (màu dễ đánh lừa độ mạnh), và nhớ r chỉ đo quan hệ **tuyến tính** ([[bài:correlation-multicollinearity]]). **Scatter matrix** (`scatter_matrix(data)`, slide 62) vẽ histogram trên đường chéo và scatter cho từng cặp: chậm và rối khi nhiều cột, nhưng cho thấy quan hệ cong hay nhóm tách rời mà r không thấy.

:::ck
Correlation matrix cho thấy r giữa hai cột là 0.02. Có thể kết luận hai cột không liên quan không? Hình nào giúp kiểm tra?
@answer
**Chưa kết luận được.** r gần 0 chỉ nói không có quan hệ **tuyến tính**; có thể có quan hệ cong (chữ U). Vẽ **scatter** của hai cột để kiểm tra.
:::

## Figure, Axes và Axis trong matplotlib (slide 63)

Slide 63 đánh số các phần của một hình để gọi đúng tên và sửa đúng chỗ:

- **Figure:** cả tờ giấy (khung ngoài cùng).
- **Axes:** một khung vẽ trên tờ giấy đó (có thể có nhiều); có **title**, **x label**, **y label**.
- **Axis:** một trục (x hoặc y) của Axes, với các vạch chia (tick).
- Ngoài ra: **lưới (grid)** và **chú giải (legend)**, hai thứ làm hình dễ đọc hơn (slide cuối so sánh hình có và không có chúng).

```python
fig, ax = plt.subplots()       # một Figure, một Axes
ax.hist(data["Glucose"], bins=20)
ax.set_title("Glucose")
ax.set_xlabel("Glucose")
ax.grid(True)
```

:::ck
Bạn gọi `plt.title("...")` ngay sau khi vẽ hai biểu đồ con. Tiêu đề thuộc biểu đồ nào, và vì sao nên dùng `ax.set_title`?
@answer
`plt.title` đặt tiêu đề cho Axes **hiện hành** (thường là cái vừa tạo), dễ gắn nhầm khi có nhiều Axes. `ax.set_title` chỉ rõ **Axes nào**, nên khi có nhiều biểu đồ con luôn dùng cách này (và `fig, axs = plt.subplots(...)`).
:::

## Tự vẽ bằng code, và hai ví dụ tính tay

**Năm biểu đồ trên Diabetes.** Mỗi đoạn trả lời một câu hỏi ở trên (đã chạy trên `diabetes.csv`; dùng `matplotlib.use("Agg")` để lưu ảnh không cần cửa sổ, bỏ dòng đó và gọi `plt.show()` nếu muốn xem trực tiếp):

```python
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pandas.plotting import scatter_matrix
data = pd.read_csv("diabetes.csv")

# 1. Histogram: thử hai lựa chọn số bin trên cùng một cột
fig, axes = plt.subplots(1, 2, figsize=(9, 3), layout="constrained")
for ax, bins in zip(axes, [8, 30]):
    ax.hist(data["BMI"], bins=bins, edgecolor="white")
    ax.set(title=f"BMI: {bins} bins")
fig.savefig("histogram.png")

# 2. Density: ảnh hưởng của độ trơn (bandwidth)
ax = data["Insulin"].plot.kde(bw_method=0.2, label="bw=0.2")
data["Insulin"].plot.kde(bw_method=0.8, ax=ax, label="bw=0.8")
ax.legend()

# 3. Box plot: so hai nhóm
data.boxplot(column="Glucose", by="Outcome")

# 4. Correlation matrix: số trong ô, không chỉ màu
corr = data.corr()
fig, ax = plt.subplots(figsize=(8, 7))
im = ax.imshow(corr, vmin=-1, vmax=1, cmap="coolwarm")
ax.set_xticks(range(len(corr)), labels=corr.columns, rotation=90)
ax.set_yticks(range(len(corr)), labels=corr.index)
for i in range(len(corr)):
    for j in range(len(corr)):
        ax.text(j, i, f"{corr.iloc[i, j]:.2f}", ha="center", va="center", fontsize=7)
fig.colorbar(im, ax=ax)

# 5. Scatter matrix: đường chéo là histogram, các ô khác là từng cặp
scatter_matrix(data[["Glucose", "BMI", "Age"]], figsize=(7, 7), diagonal="hist", alpha=0.3)
```

Với Diabetes thật, nhớ phân biệt `Outcome` (nhãn) khỏi feature, và để ý số 0 giả ở Glucose, BMI, Insulin: chúng hiện ra thành cột lạc ở 0 trên histogram và thành chấm lẻ loi dưới ria trên box plot. (Slide dùng thêm `seaborn.heatmap` cho bước 4; bản `matplotlib` ở trên cho cùng ý tưởng mà không cần cài thêm.)

**Histogram và density bằng tay.** Dãy `[1, 2, 2, 3, 4, 8]` với các biên bin `[0, 2, 4, 6, 8]`: bin đầu `[0, 2)` có 1 giá trị (số 1), bin hai `[2, 4)` có 3 giá trị (2, 2, 3), bin ba `[4, 6)` có 1 (số 4), bin cuối `[6, 8]` có 1 (số 8; bin cuối đóng cả hai đầu). Kết quả `np.histogram` ra `[1, 3, 1, 1]`. Với `density=True`, tổng **diện tích** các cột bằng 1 (tổng của độ cao × độ rộng bin), nên độ cao không còn là số đếm.

**Box plot bằng tay.** Dãy `[4, 5, 5, 6, 7, 8, 30]`: Q1 = 5, trung vị = 6, Q3 = 7.5, nên IQR = 2.5 và hàng rào trên = 7.5 + 1.5 × 2.5 = **11.25**. Số 30 vượt hàng rào nên hiện thành một chấm riêng: **outlier tiềm năng** (có thể là lỗi, có thể là giá trị thật, xem [[bài:missing-values-outliers]]), trong khi ria trên kéo tới 8, giá trị lớn nhất còn nằm trong hàng rào.

## Những hiểu sai thường gặp

- **"Chọn hình đẹp nhất."** Chọn hình **trả lời câu hỏi**; hình đẹp mà không trả lời được thì vô ích.
- **"Density plot cho mật độ thật."** Nó là ước lượng làm trơn, phụ thuộc cách làm trơn.
- **"Điểm ngoài ria của box plot là lỗi."** Chỉ là outlier **tiềm năng**; số 0 ở Glucose là lỗi, còn BMI rất cao có thể là thật.
- **"Màu của heatmap là đủ."** Đọc số trong ô; r chỉ đo tuyến tính.
- **"Hình thay được kiểm chứng."** Hình gợi ý, không kết luận; kết luận cần số và ý nghĩa thực tế.

:::card Data Visualization
- **Bắt đầu từ câu hỏi:** một biến (histogram, density), so nhóm và outlier (box plot), hai biến (scatter), mọi cặp (correlation, scatter matrix).
- **Histogram** phụ thuộc số bin; **density** là ước lượng trơn.
- **Box plot:** hộp Q1–Q3, vạch trung vị, ria 1.5 × IQR; trên Diabetes lộ số 0 ở Glucose (5 điểm) và BMI (11 điểm).
- **Correlation matrix:** đọc số, không chỉ màu; chỉ đo tuyến tính (Glucose với Outcome 0.47; Pregnancies với Age 0.54).
- **Figure, Axes, Axis:** tờ giấy, khung vẽ, trục; dùng `fig, ax = plt.subplots()` và `ax.set_...`.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Với dữ liệu và biên bin trong ví dụ tay, số 2 và số 8 thuộc bin nào?
A: 2 vào [2,4), không vào [0,2). 8 vào bin cuối [6,8] vì bin cuối gồm biên phải. Counts là [1,3,1,1].
Q: Density histogram có bốn bin rộng 2 với density 1/12, 1/4, 1/12, 1/12. Tổng xác suất là bao nhiêu?
A: Tổng diện tích = 2 × (1/12 + 1/4 + 1/12 + 1/12) = 1. Không cộng riêng chiều cao rồi gọi đó là xác suất.
Q: Dãy [4,5,5,6,7,8,30] có râu box plot tới 1.25 và 11.25 không?
A: Không. Đó là cận 1.5 IQR; râu tới điểm quan sát trong cận là 4 và 8. 30 được vẽ ngoài râu.
Q: Ma trận correlation có r gần 0 thì có thể bỏ scatter plot không?
A: Không. Quan hệ có thể phi tuyến như y=x² trên x đối xứng; scatter giúp thấy hình dạng mà Pearson không phản ánh.
Q: Bốn feature tạo bao nhiêu ô scatter matrix và bao nhiêu cặp phân biệt?
A: 4² = 16 ô. Có 4 ô đường chéo và 4 × 3 / 2 = 6 cặp phân biệt, mỗi cặp xuất hiện ở hai ô đổi trục.
@tier B | Phỏng vấn lý thuyết
Q: Histogram khác KDE ở giả định và cách đọc thế nào?
A: Histogram đếm hoặc tính density theo bin, nhạy với biên/số bin. KDE dùng kernel và bandwidth để tạo đường trơn, có thể đi ngoài miền hợp lệ. Cả hai là góc nhìn từ mẫu dữ liệu, không phải phân phối thật đã biết.
EN: Histograms depend on bins; KDE depends on bandwidth and may extend beyond valid support. Neither reveals the true population distribution without assumptions.
Q: Vì sao một điểm ngoài râu không đủ để xóa hàng?
A: Đó là nhãn theo quy ước thống kê, chưa chứng minh lỗi nhập liệu. Cần kiểm đơn vị, nguồn đo và ý nghĩa nghiệp vụ; ca hiếm có thật có thể là mục tiêu cần phát hiện.
EN: A box-plot flier is a statistical flag, not proof of a data error; context determines whether to correct, retain or investigate it.
Q: Dữ liệu đều là số thì correlation heatmap có luôn có nghĩa?
A: Không. Mã nominal không có khoảng cách định lượng; cột hằng cho correlation không xác định. Cần định nghĩa cột, missing handling và kiểm tra leakage trước khi diễn giải.
EN: Numeric storage does not guarantee meaningful Pearson correlations; identifiers, constant columns and missingness need special care.
Q: Phân biệt Figure, Axes và Axis trong matplotlib?
A: Figure là canvas chứa toàn hình; Axes là một vùng vẽ với dữ liệu/title/labels; Axis quản lý trục và ticks. plt.subplots tạo Figure và một hoặc nhiều Axes, rồi gọi ax.set để đặt nhãn vùng vẽ.
EN: A Figure is the canvas, an Axes is a plotting region, and an Axis controls coordinate ticks and scale.
@tier C | Tình huống doanh nghiệp
Q: Marketing thấy hai đỉnh trên KDE rồi muốn chia khách thành hai phân khúc ngay. Bạn làm gì?
A: Kiểm tra cỡ mẫu, bandwidth, histogram và thay đổi theo thời gian/nguồn. So nhóm bằng đặc điểm có ý nghĩa, chưa coi đỉnh là class thật. Thử chiến dịch nhỏ nếu cần phân khúc; làm trơn hoặc nhiễu có thể tạo/che đỉnh, còn phân khúc chỉ có ích khi hỗ trợ hành động.
WANT: Không biến hình trơn thành bằng chứng phân khúc chắc chắn; biết kiểm tra độ nhạy và giá trị nghiệp vụ.
Q: Báo cáo doanh thu dùng hai heatmap tự động đổi thang màu. Một nhóm trông tương quan mạnh hơn. Có kết luận được không?
A: Đọc các giá trị r, giữ vmin/vmax chung, kiểm cỡ mẫu/missing và cùng định nghĩa cột. Màu đậm có thể chỉ do thang màu khác. Báo cả số và giới hạn, không suy nhân quả hoặc ưu tiên đầu tư từ cảm giác màu.
WANT: Kiểm soát điều kiện so sánh trước khi suy diễn kinh doanh.
Q: Vận hành yêu cầu xóa mọi điểm ngoài râu để dashboard đẹp hơn. Bạn xử lý sao?
A: Kiểm lỗi dữ liệu và tách khỏi ca hiếm thật, giữ bảng gốc để truy vết. Có thể dùng trục log hoặc hình bổ sung để nhìn phần đông nhưng phải ghi rõ; không loại điểm khỏi đánh giá chỉ để hình gọn. Cân nhắc tính dễ đọc với việc không che rủi ro quan trọng.
WANT: Phân biệt trình bày dễ đọc với thay đổi dữ liệu và tiêu chí đánh giá.
:::

## Nối sang bài sau

:::next
Biểu đồ giúp phát hiện giá trị đáng nghi; dữ liệu dạng chuỗi còn cần quy tắc tìm và chuẩn hóa. [[bài:regular-expressions]] là phần công cụ bổ sung từ ghi chú, không thuộc slide 55–63. Để ghép visualization vào dự án, quay lại [[bài:ml-pipeline]].
:::
