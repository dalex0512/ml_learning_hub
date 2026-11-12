---
title: Step 4 — Data Visualization với matplotlib và pandas
order: 22
description: "Chọn và đọc histogram, density, box plot, correlation matrix và scatter matrix; hiểu Figure/Axes, nhãn trục, grid và legend qua slide 55–63."
slides: 55-63
needs: [descriptive-statistics, correlation-multicollinearity]
tags: [visualization, matplotlib, pandas, histogram, density, boxplot, heatmap, scatter, kde]
---

## Bảng số chưa trả lời được điều gì?

:::intro Đọc xong bài này bạn làm được
- Chọn biểu đồ theo câu hỏi về phân bố, cực trị hoặc quan hệ giữa các biến.
- Đọc năm loại biểu đồ trong slide và nhận ra bẫy của bin, bandwidth, outlier và correlation.
- Phân biệt Figure, Axes, Axis; thêm tên trục, grid và legend để người khác đọc được hình.
- Chạy lại code bằng dữ liệu có sẵn và không nhầm hai bộ Diabetes.
:::

[[bài:descriptive-statistics]] cho mean, median, std và quantile. Hai cột có các số tóm tắt gần nhau vẫn có thể có hình dạng rất khác. Step 4 trong [[bài:ml-pipeline]] dùng hình để thấy cấu trúc đó; nó cũng giúp đặt câu hỏi cho bước làm sạch, không chỉ trang trí kết quả cuối. [[slide:55]] giới thiệu **matplotlib** và **seaborn**; pandas cung cấp các hàm vẽ tiện dụng dựa trên matplotlib.

> **EN:** Visualization reveals distribution shapes and relationships that summary statistics can hide. Pandas offers plotting helpers backed by Matplotlib; Seaborn provides higher-level statistical plots.

:::slides 55-61 | Step 4 và năm loại biểu đồ: histogram, density, box, correlation, scatter matrix
:::

## Hỏi gì thì chọn hình đó

:::compare Câu hỏi → biểu đồ
| Câu hỏi | Biểu đồ đầu tiên | Đọc gì | Điều phải kiểm tra |
|---|---|---|---|
| Giá trị hay nằm ở vùng nào? Có lệch/đa đỉnh? | Histogram | Số mẫu hoặc density theo khoảng | Bin và biên bin |
| Hình dạng phân bố trơn ra sao? | Density/KDE | Đỉnh, đuôi, vùng mật độ cao | Bandwidth, miền hợp lệ |
| Median, khoảng giữa và điểm xa khác nhau thế nào? | Box plot | Q1, median, Q3, whisker, các điểm ngoài | Quy ước whisker, cỡ mẫu, đa đỉnh bị che |
| Cặp biến số nào liên hệ tuyến tính? | Correlation matrix/heatmap | Dấu và độ lớn r | Ý nghĩa cột số, missing, leakage |
| Quan hệ có cong, cụm hoặc cực trị không? | Scatter matrix | Hình dạng từng cặp và histogram đường chéo | Quá nhiều điểm/cột, overplotting |
:::

Ghi chú của chủ repo gọi histogram “dễ, hay dùng”, correlation matrix “thường dùng”, box/scatter matrix “ít dùng”. Giữ đây như cách ưu tiên trong buổi học, **không phải xếp hạng phổ quát**: box plot rất hữu ích khi so nhiều nhóm; scatter matrix tiện khi số feature vừa phải. Mỗi hình có câu hỏi riêng.

> **EN:** Usage frequency is contextual. Choose a plot for the question, rather than treating a classroom preference as a universal ranking.

## Histogram: gom giá trị vào khoảng rồi đếm

[[slide:56]] dùng `data.hist()` và `plt.show()` để nhìn nhiều cột của Pima Diabetes cùng lúc. Mỗi cột có một histogram riêng: trục ngang là giá trị, trục dọc mặc định là **số mẫu** trong bin. Đuôi dài của Insulin hoặc nhiều giá trị 0 là tín hiệu cần tìm nguyên nhân ở [[bài:missing-values-outliers]]. Histogram không biết 0 là thiếu hay là số đo thật.

Ghi chú gọi đây là “rời rạc hóa”: chính xác hơn, ta **gom khoảng để biểu diễn**, không nhất thiết biến đổi bảng đưa vào model. Ít bin che cấu trúc; quá nhiều bin làm nhiễu nổi lên. So một vài lựa chọn bin và giữ cùng biên bin khi so hai nhóm. Với `density=True`, chiều cao là mật độ: **tổng diện tích** các cột bằng 1, không phải tổng chiều cao; mật độ có đơn vị nghịch đảo đơn vị x.

> **EN:** Histograms group observations into bins for display. Counts depend on bin boundaries; a density histogram normalizes total bar area, not total bar height, to one.

:::worked Đếm bin và tính density (bổ sung, dữ liệu tự soạn)
Dữ liệu: `[1, 2, 2, 3, 4, 8]`. Biên bin `[0, 2, 4, 6, 8]`.

| Bin | Giá trị trong bin | Count | Density = count / (6 × độ rộng 2) |
|---|---|---|---|
| [0,2) | 1 | 1 | 1/12 ≈ 0.0833 |
| [2,4) | 2,2,3 | 3 | 3/12 = 0.25 |
| [4,6) | 4 | 1 | 1/12 ≈ 0.0833 |
| [6,8] | 8 | 1 | 1/12 ≈ 0.0833 |

Theo quy ước NumPy/matplotlib, bin cuối bao gồm biên phải 8. Tổng count = 6. Diện tích = 2 × (1/12 + 1/4 + 1/12 + 1/12) = **1**. Nếu gộp còn hai bin `[0,4), [4,8]`, count thành **4 và 2**: cùng dữ liệu, cảm giác về hình khác đi.
:::

## Density plot: ước lượng trơn, không phải biết mật độ thật

[[slide:57]] dùng `data.plot(kind="density", subplots=True, layout=(3,3), sharex=False)`. Dạng này thường là **kernel density estimation (KDE)**: đặt một “gò” trơn quanh mỗi mẫu rồi cộng lại, thay cho cột đếm. Ghi chú “liên tục hóa” nói về cách biểu diễn/ước lượng, không chứng minh biến gốc liên tục hay biến đổi nó thành Gaussian.

**Bandwidth** quyết định độ mượt: quá nhỏ tạo nhiều đỉnh giả; quá lớn che nhóm con. Trục y là density, không phải xác suất đúng tại một điểm. Xác suất cho một khoảng tương ứng diện tích dưới đường trong khoảng đó; density có thể lớn hơn 1. KDE Gaussian có thể vẽ sang giá trị âm dù dữ liệu không âm, và không phải lựa chọn hợp lý cho mã class/cột chỉ có rất ít giá trị rời rạc.

> **EN:** KDE estimates a smooth density; bandwidth controls the smoothness. The curve can extend beyond valid bounds and should not be read as pointwise probability or evidence that discrete data are continuous.

## Box plot: phần giữa nằm đâu, điểm nào cần xem lại?

[[slide:58]] dùng `data.plot(kind="box", subplots=True, layout=(3,3), sharex=False, sharey=False)`. Hộp trải Q1→Q3; đường trong hộp là median. Với quy ước phổ biến `whis=1.5`, râu kéo tới **điểm quan sát xa nhất còn trong** `[Q1−1.5 IQR, Q3+1.5 IQR]`, không nhất thiết tới đúng hai cận. Điểm ngoài râu được vẽ riêng, không tự là lỗi hay lệnh xóa.

> **EN:** The box spans Q1 to Q3 with a median line. Under the 1.5-IQR rule, whiskers end at observed values within the fences; outside points are flags to investigate, not automatic deletion candidates.

:::worked Tứ phân vị và râu (bổ sung, cùng quy ước nội suy của pandas)
Với `[4,5,5,6,7,8,30]`: Q1 = 5, median = 6, Q3 = 7.5, IQR = 2.5. Hai cận là **1.25 và 11.25**. Vì các điểm quan sát trong cận trải từ 4 đến 8, râu nằm ở **4 và 8**, còn 30 là điểm ngoài râu. Không đặt râu ở 1.25 và 11.25 khi hai số đó không có trong dữ liệu.
:::

:::pitfall Hộp gọn có thể giấu hai cụm
Box plot không cho thấy đầy đủ hình dạng/đa đỉnh và thường không cho biết cỡ mẫu. So nhóm nhỏ với nhóm lớn cần xem số quan sát, histogram hoặc các điểm. “Outlier trên hình” và “class thiểu số” ở [[bài:imbalanced-data]] là hai khái niệm khác nhau.
:::

## Correlation matrix: số trong ô quan trọng hơn cảm giác màu

[[slide:59]] tính `data.corr()` rồi xem bảng số; [[slide:60]] vẽ bằng seaborn `heatmap(..., annot=True)`. Mỗi ô là Pearson r giữa hai cột; ma trận đối xứng, đường chéo bằng 1 với cột không hằng. Nối với [[bài:correlation-multicollinearity]]: r đo quan hệ tuyến tính, không đo độ dốc và không chứng minh nhân quả.

“Miễn là dữ liệu dạng số” chưa đủ: mã khách hàng hoặc mã nominal lưu bằng số không tạo một phép đo Pearson có nghĩa. Cột hằng cho r không xác định; missing có thể khiến mỗi cặp dùng một tập hàng khác nhau. Dùng thang màu cố định từ −1 tới 1, tâm 0, khi so nhiều hình; màu đỏ không mặc định là “nguy hiểm” hay “quan trọng”.

> **EN:** A correlation heatmap needs semantically meaningful numeric variables, not merely numeric storage types. Fix the color scale when comparing plots and inspect missingness, constant columns and possible target leakage.

## Scatter matrix: nhìn quan hệ từng cặp trước khi kết luận

[[slide:61]] dùng `scatter_matrix(data)`. Mỗi ô ngoài đường chéo là scatter của một cặp feature: đọc **tên cột ngang cho x**, **tên hàng dọc cho y**. Đường chéo thường là histogram của chính biến đó. Các ô đối xứng mang cùng quan hệ đổi trục; không cần đọc cả hai như bằng chứng độc lập.

Đám điểm theo đường cong cho thấy vì sao r gần 0 chưa nói “không có quan hệ”. Nếu quá nhiều điểm chồng nhau, giảm kích thước marker, thêm `alpha`, lấy mẫu có mô tả rõ hoặc dùng plot mật độ phù hợp. Với p biến, lưới có p² ô: 4 biến → **16 ô**, trong đó có **6 cặp phân biệt**; 10 biến → **100 ô**, dễ khó đọc. Chọn một tập feature có lý do trước.

> **EN:** A scatter matrix shows pairwise shapes, clusters and outliers. Its quadratic size and overplotting limit readability; mirrored panels are not independent evidence.

## Code: năm biểu đồ trên dữ liệu có sẵn (bổ sung)

Trong repo không có `diabetes.csv`. Ảnh slide dùng **Pima classification** với `Outcome`; code dưới dùng **Diabetes regression có sẵn trong scikit-learn**, với các feature đã scale và target định lượng. Không chép số 500/268 hoặc cách diễn giải trục gốc của Pima sang dữ liệu này. Chỉ chọn `age`, `bmi`, `bp`, `s5` để hình gọn; không dùng KDE cho cột `sex` được mã hóa hai mức.

Cài: `pip install numpy pandas matplotlib scipy scikit-learn`. `scipy` phục vụ KDE. Không cần seaborn cho bản code tương đương bằng matplotlib; code gốc của slide 60 dùng seaborn, đó là một cách khác để vẽ cùng bảng r.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")  # chạy không cần cửa sổ; bỏ dòng này nếu muốn plt.show()
import matplotlib.pyplot as plt
from pandas.plotting import scatter_matrix
from sklearn.datasets import load_diabetes

out = Path("visualization_output")
out.mkdir(exist_ok=True)
data = load_diabetes(as_frame=True).data[["age", "bmi", "bp", "s5"]]
assert not data.isna().any().any()

# 1. Histogram — thử hai lựa chọn bin trên cùng một cột
fig, axes = plt.subplots(1, 2, figsize=(9, 3), layout="constrained")
for ax, bins in zip(axes, [8, 24]):
    ax.hist(data["bmi"], bins=bins, edgecolor="white")
    ax.set(title=f"BMI: {bins} bins", xlabel="Scaled BMI", ylabel="Count")
fig.savefig(out / "histogram.png", dpi=150)
plt.close(fig)

# 2. Density — ảnh hưởng bandwidth, dùng pandas + scipy
ax = data["bmi"].plot.kde(bw_method=0.2, label="bw=0.2")
data["bmi"].plot.kde(bw_method=0.8, ax=ax, label="bw=0.8")
ax.set(title="KDE bandwidth comparison", xlabel="Scaled BMI", ylabel="Density")
ax.legend()
ax.figure.savefig(out / "density.png", dpi=150, bbox_inches="tight")
plt.close(ax.figure)

# 3. Box plot — các cột đã cùng thang nhưng vẫn đọc theo từng biến
fig, ax = plt.subplots(figsize=(6, 4), layout="constrained")
data.plot.box(ax=ax, whis=1.5)
ax.set(title="Quartiles and outside points", ylabel="Scaled feature values")
fig.savefig(out / "boxplot.png", dpi=150)
plt.close(fig)

# 4. Correlation matrix — tương đương ý tưởng seaborn heatmap ở slide 60
corr = data.corr()
fig, ax = plt.subplots(figsize=(6, 5), layout="constrained")
im = ax.imshow(corr, vmin=-1, vmax=1, cmap="coolwarm")
ax.set_xticks(np.arange(len(corr)), labels=corr.columns)
ax.set_yticks(np.arange(len(corr)), labels=corr.index)
for i in range(len(corr)):
    for j in range(len(corr)):
        ax.text(j, i, f"{corr.iloc[i, j]:.2f}", ha="center", va="center")
ax.set_title("Pearson correlation")
fig.colorbar(im, ax=ax, label="r")
fig.savefig(out / "correlation.png", dpi=150)
plt.close(fig)

# 5. Scatter matrix — đường chéo là histogram, các ô khác là từng cặp
axes = scatter_matrix(data, figsize=(9, 9), diagonal="hist", alpha=0.25, s=12)
from matplotlib.ticker import FixedLocator, FixedFormatter, StrMethodFormatter
# pandas ánh xạ nhãn y ở ô đầu tiên về thang feature: giữ ánh xạ này.
first = axes[0, 0]
first_positions = first.get_yticks()
first_labels = [f"{float(label.get_text()):.2f}" for label in first.get_yticklabels()]
for ax in axes.flat:
    ax.xaxis.set_major_formatter(StrMethodFormatter("{x:.2f}"))
    ax.yaxis.set_major_formatter(StrMethodFormatter("{x:.2f}"))
first.yaxis.set_major_locator(FixedLocator(first_positions))
first.yaxis.set_major_formatter(FixedFormatter(first_labels))
fig = axes[0, 0].figure
fig.suptitle("Pairwise feature views")
fig.savefig(out / "scatter_matrix.png", dpi=150, bbox_inches="tight")
plt.close(fig)

# Kiểm lại hai ví dụ tay
values = np.array([1, 2, 2, 3, 4, 8])
edges = [0, 2, 4, 6, 8]
counts, _ = np.histogram(values, bins=edges)
density, edges = np.histogram(values, bins=edges, density=True)
assert counts.tolist() == [1, 3, 1, 1]
assert np.isclose(np.sum(density * np.diff(edges)), 1)
q1, median, q3 = np.quantile([4, 5, 5, 6, 7, 8, 30], [0.25, 0.5, 0.75])
assert np.allclose([q1, median, q3], [5, 6, 7.5])
```

Nếu dùng Pima CSV thật để chạy `data.hist()` như slide, cần đọc định nghĩa cột, phân biệt `Outcome` khỏi feature và cân nhắc số 0 sentinel. Dùng biểu đồ trên development/train để ra quyết định tiền xử lý; không nhìn test rồi lặp chọn feature/ngưỡng đến khi đẹp.

> **EN:** These runnable examples use scikit-learn's regression dataset, not Pima. Data provenance, units, preprocessing and development/test separation are part of interpreting a plot correctly.

## Figure, Axes, Axis: gọi đúng để sửa đúng hình

:::slides 62-63 | Cấu tạo biểu đồ matplotlib; ảnh so sánh grid và legend
:::

[[slide:62]] khoanh **Figure** là toàn bộ tấm hình, **Axes** là một vùng vẽ, còn **Axis** là trục x/y với ticks và tick labels. “Axes” ở đây là tên một đối tượng vùng vẽ, không phải chỉ hai đường trục. Một Figure có thể chứa nhiều Axes. Hình bên phải chỉ title, dữ liệu/đường, nhãn x/y và tick labels: đọc chúng trước khi diễn giải độ cao của đường cong.

[[slide:63]] so sánh có/không grid ở hàng trên, có/không legend ở hàng dưới. Grid giúp ước lượng tọa độ nhưng quá đậm có thể lấn dữ liệu; legend giải thích đường nào là chuỗi nào. Không chỉ dựa màu khi in trắng đen hoặc với người khó phân biệt màu: dùng thêm marker/kiểu nét và nhãn *(bổ sung)*.

> **EN:** A Figure is the whole canvas, an Axes is one plotting region, and an Axis manages a coordinate scale and its ticks. Grid lines support reading values; legends identify plotted series.

```python
import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 2 * np.pi, 200)
fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(t, np.sin(t), label="sin(t)", linestyle="-")
ax.plot(t, np.cos(t), label="cos(t)", linestyle="--")
ax.set(title="Two labeled curves", xlabel="t (radians)", ylabel="Value")
ax.grid(True, alpha=0.25)
ax.legend()
fig.savefig("figure_axes_grid_legend.png", dpi=150)
plt.close(fig)
```

Ví dụ sin/cos là phần bổ sung để thao tác API, không phải khẳng định đường trong slide dùng đúng hai hàm này. Tham khảo [hướng dẫn matplotlib](https://matplotlib.org/stable/users/explain/quick_start.html).

## Tóm tắt 1 phút

:::recap
- Histogram nhìn phân bố qua các bin; thử biên/số bin trước khi kết luận.
- KDE làm trơn ước lượng; bandwidth và miền hợp lệ quan trọng.
- Box plot tóm tắt tứ phân vị; điểm ngoài râu cần điều tra.
- Heatmap r chỉ nhìn tuyến tính, cần ý nghĩa cột số và không suy nhân quả.
- Scatter matrix giúp thấy quan hệ cong/cụm nhưng số ô tăng theo p².
- Figure chứa Axes; Axis là hệ trục/ticks; title, đơn vị, grid và legend giúp đọc đúng.
- Xem nguồn dữ liệu và tập dùng để khám phá trước khi tin hình đẹp.
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
