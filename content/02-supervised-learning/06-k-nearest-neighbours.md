---
title: K láng giềng gần nhất (K-Nearest Neighbours — KNN)
order: 6
description: "Tính khoảng cách, bỏ phiếu từ K mẫu gần nhất và chọn K bằng CV; hiểu vì sao KNN ít công học nhưng tốn bộ nhớ và thời gian dự đoán."
slides: 75
needs: [feature-scaling, train-test-split, k-fold-cross-validation, classification-metrics, logistic-regression]
tags: [knn, k-nearest-neighbours, lazy-learning, distance, euclidean, curse-of-dimensionality, classification, instance-based]
---

## Không học một đường, chỉ hỏi những người gần nhất?

:::intro Đọc xong bài này bạn làm được
- Tính khoảng cách, tìm K láng giềng và giải thích vì sao đổi K có thể đổi lớp.
- Xử lý hòa phiếu, phân biệt vote đều và vote theo khoảng cách.
- Hiểu lazy learning: ít công fit nhưng phải giữ train và tìm hàng xóm lúc predict.
- Chọn K/metric/weights bằng CV, scale đúng và nhận ra ảnh hưởng của feature nhiễu.
- Tính một ví dụ KNN regression và phân biệt score vote với xác suất hiệu chuẩn.
:::

Bạn vừa chuyển đến khu mới, muốn đoán một quán thuộc nhóm giá rẻ hay đắt. Một cách đơn giản là hỏi ba quán gần đó rồi chọn nhóm xuất hiện nhiều nhất. Đây là **phép ẩn dụ**: “gần” cần liên quan tới điều muốn dự đoán; gần địa lý không bảo đảm giống giá.

**K-Nearest Neighbours (KNN)**, hay **K láng giềng gần nhất**, làm tương tự trong không gian feature. **K** là số nguyên dương do ta chọn, không lớn hơn số mẫu dùng để tìm láng giềng. [[bài:logistic-regression]] học hệ số cho xác suất; [[bài:svm]] học biên theo margin. KNN không fit một phương trình biên toàn cục như vậy; khi có input mới, nó tìm những mẫu train gần nhất rồi dùng nhãn/giá trị của chúng. KNN vẫn tạo **ranh giới quyết định ngầm**, thấy được khi ta dự đoán trên nhiều vị trí.

> **EN:** KNN predicts from nearby stored examples rather than fitting a global parametric boundary. The choice of neighborhood and distance defines which examples are relevant; proximity is useful only when the representation matches the task.

:::slides 75 | Before K-NN / After K-NN: điểm mới được gán lớp từ láng giềng
:::

:::note Đọc đúng nguồn và nhãn trên slide
[[slide:75]] có tiêu đề “K-Nearest-Neighbour”, hai hình “Before K-NN” / “After K-NN”. Nhóm xanh ghi **Category A**, nhóm cam ghi **Category B**; điểm mới màu xanh dương đổi sang màu nhóm xanh. Tuy nhiên chú thích bên phải ghi “assigned to **Category 1**”, lệch với tên Category A. Bài dùng **A/B** nhất quán, không sửa ảnh và không suy thêm một class thứ ba từ số 1.

Slide không cho K cụ thể, công thức khoảng cách hay tọa độ. **Mọi số, công thức, hình matplotlib, code và phân tích dưới đây đều là bổ sung ngoài slide; dữ liệu tự soạn/giả lập, không phải số liệu slide.** Không đoán K=3 hay lấy tọa độ chấm từ ảnh làm số thật.
:::

## Ba bước: đo, lấy K điểm, rồi vote (ngoài slide)

**Train** là tập mẫu đã có nhãn. Khi có một điểm mới **q**, KNN thực hiện ba bước:

1. Tính khoảng cách từ q tới các mẫu train. Với cách tìm **brute force** (duyệt trực tiếp), phải so với mọi mẫu.
2. Lấy K điểm có khoảng cách nhỏ nhất, gọi là **neighbors** (láng giềng).
3. **Classification:** mỗi láng giềng bỏ phiếu cho class của nó; chọn class nhiều phiếu nhất. Với từ ba class trở lên, “nhiều nhất” không nhất thiết vượt nửa số phiếu. **Regression:** lấy trung bình các target của láng giềng.

```text
q mới → khoảng cách tới train → K láng giềng
                              ├─ nhãn → vote → class
                              └─ target số → trung bình → giá trị
```

Ban đầu xét **uniform weights**: mỗi mẫu có một phiếu như nhau. Không có hệ số β hay w toàn cục được học để thay cho tập train. K, cách tính khoảng cách và cách vote là **siêu tham số**, vẫn phải chọn bằng dữ liệu development.

> **EN:** Brute-force KNN computes distances to stored training samples, selects K neighbors and aggregates their labels or numeric targets. Uniform voting is a starting rule; K, the distance metric and weighting scheme are hyperparameters.

### Hai khoảng cách dễ tính tay

Gọi **a,b** là hai vector input có **D feature**, **j** là chỉ số cột từ 1 tới D; a_j,b_j là giá trị feature đó. **d(a,b)** là khoảng cách; D là số feature, không phải ký hiệu d của khoảng cách. Dấu Σ nghĩa là cộng qua các feature.

:::formula
**Euclidean distance — khoảng cách Euclid**
```text
d(a,b) = √Σ_j (a_j − b_j)²
2D: √[(a1−b1)² + (a2−b2)²]
```
<!-- note: đường thẳng giữa hai điểm, trên thang đo đã chọn -->

**Manhattan distance — tổng độ lệch tuyệt đối**
```text
d(a,b) = Σ_j |a_j − b_j|
2D: |a1−b1| + |a2−b2|
```
<!-- note: đi theo từng trục như đường ô bàn cờ -->
:::

Ví dụ a=(4,3), b=(5,4): Euclid là `√[(4−5)²+(3−4)²]=√(1+1)=√2≈1.414214`; Manhattan là `|−1|+|−1|=2`. Hai metric có thể đổi thứ tự láng giềng nên phải chọn phù hợp bài toán. **Minkowski** là họ khoảng cách chứa Manhattan/Euclid; **cosine distance** so hướng vector, thường gặp với text/embedding. Không phải mọi metric đều được mọi thuật toán tìm kiếm hỗ trợ.

> **EN:** Euclidean distance measures straight-line separation; Manhattan sums coordinate-wise differences. Different metrics can produce different neighbors, and their usefulness depends on units and representation.

## Tính tay tám khoảng cách, rồi đổi K (ngoài slide)

:::worked q=(4,3), số tự soạn để căn bậc hai dễ kiểm
Hai feature là tọa độ minh họa, không gắn đơn vị thực. Chọn khoảng cách **khác nhau** để ví dụ chính không bị hòa khoảng cách ở vị trí K. Cột “tổng bình phương” tính trước, sau đó mới lấy căn.

| Mẫu | (x1,x2) | Class | (x1−4)²+(x2−3)² | Khoảng cách tới q |
|---|---|---|---|---|
| P1 | (4,4) | A | 0²+1²=1 | 1.000000 |
| P2 | (5,4) | B | 1²+1²=2 | √2≈1.414214 |
| P3 | (4,5) | A | 0²+2²=4 | 2.000000 |
| P4 | (6,4) | B | 2²+1²=5 | √5≈2.236068 |
| P5 | (4,6) | B | 0²+3²=9 | 3.000000 |
| P6 | (1,2) | A | (−3)²+(−1)²=10 | √10≈3.162278 |
| P7 | (7,5) | B | 3²+2²=13 | √13≈3.605551 |
| P8 | (0,3) | B | (−4)²+0²=16 | 4.000000 |

Thứ tự gần→xa là **P1,P2,P3,P4,P5,P6,P7,P8**. Đếm lần lượt, không chọn điểm theo màu trước khi đo:

- **K=1:** chỉ P1, A có 1 phiếu, B có 0 → **A**.
- **K=3:** P1/P2/P3 có nhãn A/B/A → A=2, B=1 → **A**.
- **K=5:** thêm P4/P5 đều B → A=2, B=3 → **B**.

Cùng q, cùng train, chỉ đổi K đã đổi kết quả. Ta chưa có nhãn thật của q nên không kết luận K nào đúng chỉ từ hình; việc chọn cần validation/CV.
:::

![Ba vòng tròn chứa 1, 3 và 5 láng giềng quanh q; kết quả uniform vote đổi từ A sang B](/plots/knn-neighbours.png)

[Mở hình gốc](/plots/knn-neighbours.png). Các panel dùng chung trục/tỉ lệ; ngôi sao là q, vòng tròn đỏ có bán kính bằng khoảng cách tới láng giềng thứ K, vòng đen khoanh các điểm được dùng. Điểm trên đường tròn thứ K vẫn được tính vào K láng giềng.

> **EN:** The same query is classified as A for K=1 or 3 and B for K=5. Larger neighborhoods use more evidence but may include samples from a different local region; the correct choice requires held-out evaluation.

### K lẻ có luôn hết hòa? Gỡ bằng cách nào?

Với **đúng hai class, vote đều và đúng K phiếu**, K lẻ không chia đều thành hai phần được. K chẵn **có thể** hòa, không phải luôn hòa. Với **từ ba class trở lên**, K lẻ vẫn có thể hòa: K=3, ba láng giềng A/B/C cho mỗi class một phiếu. Điều kiện là số class có thể nhận phiếu, không phải “số class phải lẻ”. Nếu vote có trọng số, K lẻ cũng không còn bảo đảm tổng trọng số của hai class khác nhau.

:::worked K=4 hòa 2–2 ngay trên bộ số phía trên
P1/P2/P3/P4 có nhãn A/B/A/B. Có nhiều **quy tắc khác nhau** để xử lý; cần chọn trước và kiểm trên validation, không sửa theo đáp án test:

| Cách gỡ | Phép tính trên bốn điểm | Kết quả |
|---|---|---|
| Tăng K lên 5 | Thêm P5 thuộc B → A=2, B=3 | B |
| Chọn class của láng giềng gần nhất | P1 cách 1, thuộc A | A |
| So khoảng cách trung bình từng class hòa | A: (1+2)/2=1.5; B: (√2+√5)/2≈1.825141 | A gần hơn |
| Vote trọng số nghịch đảo khoảng cách | A: 1/1+1/2=1.5; B: 1/√2+1/√5≈1.154320 | A nhiều trọng số hơn |

Với trọng số **w_i=1/d_i**, i là chỉ số láng giềng, d_i là khoảng cách, w_i là **trọng số tính từ khoảng cách**, không phải hệ số học như w trong SVM. Chuẩn hóa tổng trọng số hai class cho tỉ lệ A≈**0.565116**, B≈**0.434884**.

“Khoảng cách trung bình” và “vote 1/d” đều dùng khoảng cách nhưng **không phải cùng thuật toán**, có thể khác kết quả trên dữ liệu khác. Tăng K cũng đổi mô hình cục bộ và không bảo đảm giải mọi hòa nhiều lớp. Nếu d_i=0, không chia trực tiếp cho 0: sklearn với `weights='distance'` ưu tiên các láng giềng trùng đúng vị trí và bỏ ảnh hưởng các điểm có khoảng cách khác 0 trong nhóm K ấy.
:::

**Quy ước sklearn đã kiểm bằng code:** trong môi trường sklearn 1.9.1, uniform vote hòa ở ví dụ nhãn chuỗi chọn class đứng trước trong `classes_` đã sắp thứ tự. Với hai điểm x=1 nhãn Z và x=3 nhãn A, query x=0, K=2 cho A dù Z gần hơn. Vì vậy không diễn giải kết quả hòa mặc định là “thư viện tự chọn class gần nhất”. Một tình huống khác là **d_K=d_(K+1)** mà nhãn khác nhau: mẫu nào lọt vào nhóm K có thể phụ thuộc thứ tự train; đây là hòa khi **chọn láng giềng**, khác hòa khi vote.

> **EN:** Odd K prevents count ties only for unweighted binary voting. Multiclass counts and weighted votes can still tie. Tie-breaking by nearest neighbor, mean distance, inverse-distance voting or class order are distinct policies; equal distances at the neighbor cutoff are a separate issue.

### Code kiểm vote, hòa và sinh vòng tròn láng giềng

Cài `pip install numpy scikit-learn matplotlib`. Các Python block tự đủ imports, chạy độc lập; ảnh ghi vào **knn_output** trong nơi chạy. `algorithm='brute'` dùng duyệt trực tiếp để cách tính khớp ví dụ tay.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier

out = Path("knn_output")
out.mkdir(exist_ok=True)
X_hand = np.array([[4,4],[5,4],[4,5],[6,4],[4,6],[1,2],[7,5],[0,3]], dtype=float)
y_hand = np.array(["A","B","A","B","B","A","B","B"])
query = np.array([[4,3]], dtype=float)
print("all distances:", np.linalg.norm(X_hand-query, axis=1))
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), constrained_layout=True)
for ax, k in zip(axes, [1,3,5]):
    model = KNeighborsClassifier(n_neighbors=k, algorithm="brute").fit(X_hand, y_hand)
    distances, indices = model.kneighbors(query)
    print("K, indices from 0, class, proba:", k, indices, model.predict(query), model.predict_proba(query))
    for label, color, marker in [("A","#70A330","o"),("B","#3978B8","D")]:
        pts = X_hand[y_hand == label]
        ax.scatter(pts[:,0], pts[:,1], c=color, marker=marker, s=55, label=label)
    chosen = X_hand[indices[0]]
    ax.scatter(chosen[:,0], chosen[:,1], s=150, facecolors="none", edgecolors="black")
    ax.scatter(*query[0], marker="*", c="black", s=160, label="q")
    ax.add_patch(plt.Circle(query[0], distances[0,-1], fill=False, color="#D64545"))
    for i, point in enumerate(X_hand, 1):
        ax.annotate(f"P{i}", point, xytext=(4,5), textcoords="offset points", fontsize=8)
    ax.set(title=f"K={k}: {model.predict(query)[0]}", xlabel="x1", ylabel="x2",
           xlim=(-1,8), ylim=(-0.5,7))
    ax.set_aspect("equal")
    ax.grid(alpha=0.2)
axes[0].legend(loc="lower left", fontsize=8)
fig.savefig(out / "knn-neighbours.png", dpi=160)
plt.close(fig)

for weights in ["uniform", "distance"]:
    tie = KNeighborsClassifier(n_neighbors=4, weights=weights, algorithm="brute").fit(X_hand, y_hand)
    print("K=4", weights, tie.classes_, tie.predict(query), tie.predict_proba(query))
label_tie = KNeighborsClassifier(n_neighbors=2, algorithm="brute").fit([[1],[3]], ["Z","A"])
print("tie classes and prediction:", label_tie.classes_, label_tie.predict([[0]]))
assert label_tie.predict([[0]])[0] == "A"  # hòa vote; không phải nearest Z
multi_tie = KNeighborsClassifier(n_neighbors=3, algorithm="brute").fit([[1],[2],[3]], ["Z","B","A"])
assert multi_tie.predict([[0]])[0] == "A"  # K lẻ vẫn hòa ba lớp
```

## K nhỏ hay lớn: phải nhìn ngoài train (ngoài slide)

K nhỏ nhìn rất cục bộ. Với **K=1**, một nhãn nhiễu có thể tạo một vùng dự đoán sai quanh chính điểm đó. Nếu gửi lại **X_train** để chấm chính nó, mỗi điểm thường có khoảng cách 0 tới bản thân, cho train accuracy 100% khi tọa độ không trùng với nhãn mâu thuẫn. Đó là ghi nhớ, không chứng minh dự đoán tốt. Ngoại lệ quan trọng: hai hàng có feature giống hệt nhưng nhãn khác nhau thì không thể cùng được phân loại đúng chỉ từ feature ấy.

K lớn thường làm biên mượt hơn nhưng có thể xóa mất nhóm nhỏ/cấu trúc cục bộ: **underfitting** (mô hình quá đơn giản cho cấu trúc cần học). K nhỏ có thể **overfitting** (bám chi tiết riêng/nhiễu train). Đây là xu hướng, không phải quy luật mọi dataset. Với **K=N, uniform vote**, N là số mẫu train, mọi query dùng cùng tập N nhãn nên cùng nhận class đa số hoặc cùng quy tắc hòa; với distance weights thì kết luận ấy không còn bắt buộc.

Chọn K bằng [[bài:k-fold-cross-validation]] trên development và giữ test riêng theo [[bài:train-test-split]]. **K láng giềng khác số fold của K-fold**: một số đặt độ lớn lân cận, số kia đặt cách chia validation. K phải không lớn hơn số mẫu train của **từng fold**, không chỉ số hàng của cả development.

> **EN:** Small neighborhoods can memorize noise, while overly large neighborhoods can erase local structure. Perfect resubstitution accuracy at K=1 is not generalization evidence; select K using validation folds and keep final test data separate.

![Ranh giới KNN trên cùng development giả lập với K=1,5,15; cùng metric Euclid, uniform weights và scaler fit development](/plots/knn-boundaries.png)

[Mở hình gốc](/plots/knn-boundaries.png). Chấm là mẫu **development**; các panel cùng trục. K=1 chia nhiều mảnh nhỏ, K lớn có xu hướng mượt hơn. Hình minh họa các cấu hình định trước, không phải cách chọn model; CV bên dưới mới dùng để chọn. Không có test trong hình.

## Lazy learning: công việc chuyển sang lúc dự đoán (ngoài slide)

**Lazy learning** (học lười/học trì hoãn) nghĩa là KNN trì hoãn phần lớn việc suy luận tới lúc có query. **Instance-based learning** nghĩa là dự đoán dựa trên các mẫu đã lưu. “Không có huấn luyện” chỉ là cách nói tắt: `fit` vẫn kiểm tra/lưu dữ liệu, và có thể dựng chỉ mục tìm kiếm. Scaler cũng cần học mean/std hoặc min/max từ train.

Linear/Logistic mang theo hệ số và tiền xử lý; Polynomial còn cần phép mở rộng feature. Các mẫu train không cần xuất hiện trực tiếp trong phép dự đoán của các mô hình ấy. **Kernel SVM khác:** vẫn giữ support vector để tính kernel khi predict, xem [[bài:svm]]. KNN cần tập feature train đã xử lý và nhãn của chúng; không có một vector hệ số nhỏ thay thế toàn bộ tập ấy trong KNN chuẩn.

### 100 mẫu và một triệu mẫu khác nhau thế nào?

**O(…)** mô tả tốc độ tăng chi phí theo kích thước, không phải số giây. Với N mẫu, D feature, tìm brute force cần khoảng **O(N·D)** công tính khoảng cách cho **một query**; còn có chi phí chọn K nhỏ nhất/vote. Nếu sắp xếp toàn bộ N khoảng cách thì tốn thêm O(N log N), nhưng không bắt buộc phải sắp xếp toàn bộ để lấy K nhỏ nhất.

:::compare Đếm công việc với D=20 cố định, không phải đo thời gian máy
| Đại lượng | N=100 | N=1,000,000 |
|---|---|---|
| KNN brute: kiểm/lưu ma trận train | 100×20=2,000 giá trị | 1,000,000×20=20,000,000 giá trị |
| KNN brute: số chênh lệch feature cho một query | 2,000 | 20,000,000 — gấp 10,000 lần |
| Chỉ ma trận X float64, 8 byte/giá trị | 16,000 byte = 16 kB | 160,000,000 byte = 160 MB |
| Linear/Logistic: số feature dùng cho một query | 20 | Vẫn 20 |
| Linear/Logistic: số hệ số kể cả intercept | 21 | Vẫn 21 |
:::

kB/MB ở bảng dùng hệ thập phân; chưa tính nhãn, scaler, index, bản sao dữ liệu hay bộ nhớ tạm khi dự đoán theo batch. Không nói KNN fit thật sự miễn phí: chỉ đọc/copy X đã tăng theo N·D, dựng KD-tree/Ball-tree còn có chi phí thêm. Linear/Polynomial thường fit lâu hơn khi tăng N, nhưng prediction không tăng theo N **nếu giữ cố định số feature/mô hình**. Với Polynomial, phải tính theo số cột sau mở rộng, không chỉ số input gốc.

**KD-tree/Ball-tree** là các cấu trúc chỉ mục để giảm lượng điểm phải xét, thường hữu ích khi số chiều thấp và dữ liệu phù hợp; không bảo đảm nhanh hơn brute force trong chiều cao. **Approximate Nearest Neighbour (ANN)** là tìm láng giềng gần đúng, đổi một phần độ chính xác tìm kiếm lấy tốc độ. Giảm mẫu/chiều cũng có thể giúp nhưng cần kiểm giữ chất lượng; không tạo link tới bài giảm chiều chưa có.

> **EN:** KNN avoids fitting a compact global prediction function but still pays for storage, validation and possibly indexing. Brute-force query cost grows with N·D; fixed-size linear models do not revisit N training samples at prediction time. Trees and approximate search offer conditional speed–quality trade-offs.

## Scale có thể đổi ngay người hàng xóm gần nhất (ngoài slide)

Nếu so tuổi bằng năm và thu nhập bằng đồng, chênh tiền hàng triệu dễ lấn át chênh vài chục tuổi. KNN không biết ý nghĩa đơn vị. Cần chọn metric/cách scale có lý do; scale không tự chứng minh tuổi và thu nhập quan trọng ngang nhau trong nghiệp vụ.

:::worked Ba người train và một người mới, K=1
Dữ liệu **tự soạn**, không phải hồ sơ thật: query q=(25 tuổi, 10 triệu đồng). Tập train:

| Người | Tuổi | Thu nhập (đồng) | Class |
|---|---|---|---|
| A | 24 | 11,000,000 | A |
| B | 60 | 10,000,000 | B |
| C | 20 | 110,000,000 | B |

**Trước scale:** d(q,A)=`√[(25−24)²+(10,000,000−11,000,000)²]=√(1+10^12)≈1,000,000`; d(q,B)=`√[(25−60)²+0²]=35`. C cách gần 100 triệu trên thang đo thô, xa hơn cả hai. K=1 chọn người B → class B.

**MinMaxScaler fit chỉ ba người train**, xem [[bài:feature-scaling]]. Tuổi min=20,max=60 nên range=40; tiền min=10 triệu,max=110 triệu nên range=100 triệu. Mỗi cột biến đổi bằng `(giá trị−min_train)/range_train`.

- q → `((25−20)/40,0/100,000,000)` = **(0.125,0)**.
- A → `(4/40,1,000,000/100,000,000)` = **(0.1,0.01)**.
- B → `(40/40,0)` = **(1,0)**.
- C → `(0,100,000,000/100,000,000)` = **(0,1)**.

Khoảng cách mới: A là `√[(0.125−0.1)²+(0−0.01)²]=√(0.000625+0.0001)≈0.026926`; B là `|0.125−1|=0.875`; C là `√(0.125²+1)≈1.007782`. K=1 đổi sang **A**. Không có nhãn thật của query nên chưa kết luận cách nào đúng; ví dụ chỉ cho thấy đơn vị/cách scale quyết định láng giềng.
:::

Fit scaler trong **train của mỗi fold**, dùng Pipeline để không lẫn dữ liệu validation/test. Với categorical, xem [[bài:categorical-encoding]]: mã hóa số 0/1/2 có thể tạo thứ tự/khoảng cách giả; one-hot cũng không tự làm mọi nhóm feature có đóng góp phù hợp.

> **EN:** Scaling changes neighborhood geometry. The worked example switches its nearest neighbor after train-only MinMax scaling, illustrating unit sensitivity rather than proving that one metric is always better. Fit preprocessing inside validation folds and check categorical representations explicitly.

## KNN cũng hồi quy được (ngoài slide)

**KNN regression** lấy trung bình target số của K láng giềng thay vì vote class. Với weights='distance', dùng trung bình có trọng số không âm. Median (trung vị) cũng có thể là một quy tắc tổng hợp tự xây, nhưng **không phải mặc định của KNeighborsRegressor**. Vì có phiên bản hồi quy nên KNN có dấu sao trong [[bài:supervised-algorithms]].

:::worked Năm điểm tự soạn, K=3
Train x=`[1,2,4,7,10]`, target t=`[10,20,40,70,100]`; t ở đây là đại lượng số minh họa, không phải threshold của bài Logistic. Query x=3 có khoảng cách `|3−1|=2`, `|3−2|=1`, `|3−4|=1`, `|3−7|=4`, `|3−10|=7`.

Ba láng giềng là x=2/4/1, target 20/40/10; thứ tự hai điểm đồng khoảng cách 1 không ảnh hưởng vì lấy cả hai. Dự đoán uniform = `(20+40+10)/3=70/3≈23.333333`.

Query x=20 ngoài miền train cho ba láng giềng x=10/7/4, target 100/70/40; trung bình = `210/3=70`, vẫn nằm trong khoảng target train [10,100]. KNN vẫn **nhận input ngoài miền**, nhưng trung bình trọng số không âm không tạo target vượt min/max của các target láng giềng. Vì vậy nó không ngoại suy xu hướng như kéo dài một đường Linear/Polynomial; nối [[bài:polynomial-regression]]. Đánh giá target số bằng MAE/RMSE ở [[bài:regression-metrics]], không dùng accuracy.
:::

```python
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor

# Kiểm ví dụ scale; scaler chỉ fit ba hàng train.
X_scale = np.array([[24,11e6],[60,10e6],[20,110e6]], dtype=float)
y_scale = np.array(["A","B","B"])
q_scale = np.array([[25,10e6]], dtype=float)
scaler = MinMaxScaler().fit(X_scale)
scaled_train, scaled_query = scaler.transform(X_scale), scaler.transform(q_scale)
raw_model = KNeighborsClassifier(n_neighbors=1).fit(X_scale, y_scale)
scaled_model = KNeighborsClassifier(n_neighbors=1).fit(scaled_train, y_scale)
print("raw/scaled class:", raw_model.predict(q_scale), scaled_model.predict(scaled_query))
print("scaled distances:", np.linalg.norm(scaled_train-scaled_query, axis=1))

# Hồi quy: target là số, không phải mã class.
x_reg = np.array([[1],[2],[4],[7],[10]], dtype=float)
t_reg = np.array([10,20,40,70,100], dtype=float)
reg = KNeighborsRegressor(n_neighbors=3, weights="uniform").fit(x_reg, t_reg)
print("regression at 3 and 20:", reg.predict([[3],[20]]))
```

## Code: chọn K, weights, metric bằng CV rồi mới test (ngoài slide)

Sinh **400 mẫu giả lập** hai hình trăng khuyết bằng `make_moons(noise=0.3, random_state=42)`. Noise là độ lệch chuẩn nhiễu tọa độ, không phải tỉ lệ nhãn sai. Tách **development 300 / test 100**, stratify; hai lớp cân bằng nên accuracy đủ cho minh họa này. Development dùng CV 5 fold, scaler refit từng fold, trước hết so K với **Euclid + uniform** cố định:

| K | Accuracy train toàn development | Mean accuracy CV |
|---|---|---|
| 1 | **1.000000** | 0.803333 |
| 3 | 0.916667 | 0.853333 |
| 5 | 0.910000 | 0.850000 |
| 9 | 0.886667 | 0.856667 |
| 15 | 0.883333 | 0.873333 |
| 25 | 0.886667 | **0.880000** |

K=1 thắng train nhưng không thắng CV. Trong sáu ứng viên này, K=25 tốt nhất theo mean CV; vì nằm ở đầu lớn của lưới, ta chưa biết K ngoài lưới có tốt hơn không. Điểm train/CV không buộc biến thiên đơn điệu theo K. Bảng này không phải quy luật “luôn chọn K=25” và không dùng test để mở rộng lưới sau khi nhìn đáp án.

Sau đó **GridSearchCV** thử cả K, uniform/distance và Euclidean/Manhattan: **6×2×2=24 cấu hình**, mỗi cấu hình 5 fold → **120 lượt fit fold**, thêm một refit ứng viên thắng trên 300 mẫu. Dùng cùng development/folds, không phải một nguồn dữ liệu độc lập mới. Kết quả sklearn 1.9.1 chọn **K=25, uniform, Euclidean**, mean CV **0.880000**; nếu nhiều cấu hình bằng điểm, lựa chọn còn theo thứ tự ứng viên, không xem đó là chênh lệch chất lượng có ý nghĩa.

Model chốt cho **test accuracy=0.920000**, ma trận `[[TN,FP],[FN,TP]]` với class 1 là positive: **[[46,4],[4,46]]**. Precision/recall/F1 của mỗi class đều **0.920000**, mỗi class 50 mẫu. Test tốt hơn mean CV ở lần chia này không phải lỗi: tập hữu hạn và lượng dữ liệu fit khác nhau; không hứa lần nào test cũng cao hơn. Nối [[bài:confusion-matrix]] và [[bài:classification-metrics]] để đọc 4 FP/4 FN.

`predict_proba` trả **tỉ lệ vote** theo thứ tự `classes_`, hoặc tỉ lệ tổng trọng số nếu weights='distance'. Với K=3 uniform, ví dụ tay cho A=2/3,B=1/3; với model K=25, ba query test đầu có các hàng **[0.04,0.96], [0.24,0.76], [0.96,0.04]**, classes=[0,1]. Các giá trị này phản ánh hàng xóm dưới metric đang dùng, **không mặc định là xác suất đã hiệu chuẩn tốt**. Với K=1, đầu ra thô chỉ 0 hoặc 1 vẫn có thể sai ở test.

> **EN:** Select the complete pipeline by development cross-validation, then evaluate a fixed model once on test data. KNN probabilities are neighbor vote fractions or normalized distance weights; they are not automatically calibrated probabilities for deployment.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.datasets import make_moons
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV
from sklearn.metrics import confusion_matrix, classification_report

out = Path("knn_output")
out.mkdir(exist_ok=True)
X_moons, y_moons = make_moons(n_samples=400, noise=0.3, random_state=42)
X_dev, X_test, y_dev, y_test = train_test_split(
    X_moons, y_moons, test_size=0.25, random_state=42, stratify=y_moons
)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
ks = [1,3,5,9,15,25]
def make_knn(k):
    return make_pipeline(StandardScaler(), KNeighborsClassifier(
        n_neighbors=k, weights="uniform", metric="euclidean", n_jobs=1
    ))

# Chỉ đo trên development; tiền xử lý được học lại bên trong mỗi fold.
k_rows = []
for k in ks:
    model = make_knn(k).fit(X_dev, y_dev)
    scores = cross_val_score(make_knn(k), X_dev, y_dev, cv=cv, scoring="accuracy", n_jobs=1)
    row = (k, model.score(X_dev, y_dev), scores.mean())
    k_rows.append(row)
    print(f"K={k:2d} train={row[1]:.6f} CV={row[2]:.6f}")

# Vẽ cấu hình định trước trên toàn dev, không đưa test vào hình.
low, high = X_dev.min(axis=0)-0.4, X_dev.max(axis=0)+0.4
xx, yy = np.meshgrid(np.linspace(low[0],high[0],260), np.linspace(low[1],high[1],220))
mesh = np.c_[xx.ravel(), yy.ravel()]
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), constrained_layout=True)
for ax, k in zip(axes, [1,5,15]):
    model = make_knn(k).fit(X_dev, y_dev)
    pred = model.predict(mesh).reshape(xx.shape)
    ax.contourf(xx, yy, pred, levels=[-0.5,0.5,1.5], colors=["#E1EBF5","#E8F0DA"])
    ax.contour(xx, yy, pred, levels=[0.5], colors=["#D64545"], linewidths=1)
    for label, color in [(0,"#3978B8"),(1,"#70A330")]:
        pts = X_dev[y_dev == label]
        ax.scatter(pts[:,0], pts[:,1], c=color, s=14)
    ax.set(title=f"K={k} | uniform + Euclidean", xlabel="x1", ylabel="x2",
           xlim=(low[0],high[0]), ylim=(low[1],high[1]))
    ax.set_aspect("equal")
fig.savefig(out / "knn-boundaries.png", dpi=160)
plt.close(fig)

# Chọn cả metric và cách vote bằng CV, scaler nằm trong Pipeline.
params = {
    "kneighborsclassifier__n_neighbors": ks,
    "kneighborsclassifier__weights": ["uniform", "distance"],
    "kneighborsclassifier__metric": ["euclidean", "manhattan"],
}
search = GridSearchCV(make_knn(5), params, scoring="accuracy", cv=cv, n_jobs=1, refit=True)
search.fit(X_dev, y_dev)
best = search.best_estimator_
print("selected:", search.best_params_, "CV:", round(search.best_score_, 6))
# Cấu hình đã chốt. Không quay lại sửa theo kết quả test.
test_pred = best.predict(X_test)
print("test confusion [[TN,FP],[FN,TP]]:")
print(confusion_matrix(y_test, test_pred, labels=[0,1]))
print(classification_report(y_test, test_pred, digits=6, zero_division=0))
print("classes / first 3 vote fractions:", best.classes_, best.predict_proba(X_test[:3]))
```

## Nhiều feature hơn có thể làm hàng xóm kém liên quan (ngoài slide)

**Curse of dimensionality** (lời nguyền số chiều) mô tả những khó khăn khi số chiều tăng: dữ liệu trở nên thưa trong không gian lớn, có thể cần nhiều mẫu hơn để có lân cận đủ ý nghĩa. Với nhiều chiều nhiễu, các khoảng cách có thể gần nhau tương đối và “gần nhất” không còn phản ánh nhãn. Không phải mọi dữ liệu nhiều chiều đều vô dụng; feature có cấu trúc/tín hiệu và metric phù hợp vẫn có thể tốt.

Feature trùng/thừa còn có thể **đếm lặp một hướng** trong khoảng cách. Ví dụ nhân đôi cùng một cột khiến độ lệch bình phương của cột đó được cộng hai lần, tăng trọng số tương đối mà không thêm thông tin; nối [[bài:correlation-multicollinearity]]. Đây khác với chuyện hệ số hồi quy bất ổn, vì KNN không có hệ số β để diễn giải.

:::worked Thêm feature nhiễu độc lập, giữ nguyên split/fold/K
Giữ 300 mẫu development của demo, K=5, StandardScaler trong fold. Sinh sẵn 100 cột Gaussian độc lập bằng seed **123**, trung bình 0, độ lệch chuẩn 1, rồi lấy lần lượt 0/10/50/100 cột đầu. Không chọn bằng test; bảng chỉ chẩn đoán trên CV development.

| Số feature nhiễu thêm | Tổng số feature | Mean CV accuracy |
|---|---|---|
| 0 | 2 | 0.850000 |
| 10 | 12 | 0.740000 |
| 50 | 52 | 0.583333 |
| 100 | 102 | 0.600000 |

Thêm nhiễu làm kết quả thấp hơn baseline hai feature trong cả ba trường hợp; từ 50 lên 100 cột lại tăng nhẹ, nên **không khẳng định giảm đều từng bước**. Scale không thể tự xóa feature vô ích: các cột nhiễu đã được chuẩn hóa vẫn góp vào khoảng cách. Dữ liệu thực cần chọn feature/biểu diễn và đánh giá lại cả quy trình trên validation; đừng bỏ cột chỉ vì thấy một kết quả test xấu.
:::

```python
import numpy as np
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

# Tạo lại đúng development của demo; không dùng test cho chẩn đoán này.
X_base, y_base = make_moons(n_samples=400, noise=0.3, random_state=42)
X_ndev, _, y_ndev, _ = train_test_split(
    X_base, y_base, test_size=0.25, random_state=42, stratify=y_base
)
cv_noise = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
extra = np.random.default_rng(123).normal(size=(len(X_ndev),100))
noise_rows = []
for added in [0,10,50,100]:
    X_aug = np.c_[X_ndev, extra[:, :added]]
    pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5, n_jobs=1))
    scores = cross_val_score(pipe, X_aug, y_ndev, cv=cv_noise, scoring="accuracy", n_jobs=1)
    noise_rows.append((added, X_aug.shape[1], scores.mean()))
    print("extra, total, CV:", added, X_aug.shape[1], round(scores.mean(), 6))
```

> **EN:** Uninformative dimensions can dilute useful neighborhoods even after scaling. The experiment holds folds and K fixed while adding independent noise; all noisy variants perform worse here, without claiming strictly monotonic deterioration for every sample.

## KNN, Logistic hay SVM? (ngoài slide)

:::compare Chọn theo dữ liệu và chi phí, không theo tên hay hơn
| Tiêu chí | KNN | Logistic Regression | SVM |
|---|---|---|---|
| Học gì | Lưu mẫu/nhãn, có thể dựng index; không học bộ hệ số biên toàn cục | Hệ số và intercept cho log-odds | Biên margin; linear có hệ số, kernel cần support vector |
| Ranh giới | Cục bộ, phụ thuộc metric/K/vote | Tuyến tính theo feature đã đưa vào | Tuyến tính hoặc phi tuyến qua kernel |
| Fit/predict | Ít công fit hơn nhiều mô hình, predict có thể đắt theo N | Fit tối ưu loss; predict nhanh theo số feature | Kernel fit có thể đắt, predict phụ thuộc số support vector |
| Bộ nhớ triển khai | Train features/labels và index nếu có | Hệ số và tiền xử lý | Hệ số hoặc support vector/thuộc tính solver |
| Giải thích | Chỉ ra các mẫu giống nhất và phiếu | Hệ số đọc qua log-odds/odds | Margin dễ hình dung; kernel khó đọc theo từng input |
| Nhạy cảm | Scale, feature nhiễu/thừa, mật độ và nhãn cục bộ | Biểu diễn tuyến tính, scale/penalty, nhãn và cộng tuyến | Scale, kernel/C/gamma, điểm vi phạm/nhãn sai |
| Siêu tham số chính | K, weights, metric, cách tìm kiếm | C/regularization và solver | C, kernel, gamma với RBF |
:::

KNN đáng thử khi bộ dữ liệu vừa phải, khoảng cách có ý nghĩa và cần minh họa bằng mẫu tương tự. Nếu dữ liệu tăng mạnh hoặc cần độ trễ thấp, so thêm Logistic/linear SVM và đo tài nguyên; nếu cấu trúc phi tuyến, cũng có thể thử kernel hoặc cách biểu diễn khác. Không có mô hình thắng mọi bối cảnh.

**Class mất cân bằng:** khi K lớn, class đông có thể lấn vote; với K=N uniform, ta quay về dự đoán class đa số. `weights='distance'` có thể giúp nếu lớp hiếm có láng giềng thực sự gần, nhưng **không bảo đảm giải mất cân bằng** và có thể làm nhãn nhiễu gần query ảnh hưởng mạnh hơn. Đánh giá precision/recall theo class và chi phí, nối [[bài:imbalanced-data]]; không coi accuracy cao là đủ.

> **EN:** KNN is useful when meaningful neighborhoods and example-based explanations justify its query and storage cost. Imbalance and local label noise still require class-aware evaluation; distance weighting is not a universal cure.

## Những bẫy dễ mắc (ngoài slide)

:::pitfall K=1 đạt 100% train nên không cần test
Đưa lại X_train vào model thường tìm đúng chính nó, không phải một mẫu mới. Demo cho train 1.0 nhưng CV≈0.803333; dùng CV chọn cấu hình, giữ test độc lập.
:::

:::pitfall K lẻ thì luôn hết hòa; tăng K luôn tốt
K lẻ chỉ tránh hòa đếm phiếu với đúng hai class và vote đều. K=3 vẫn hòa ba class; tăng K có thể xóa cấu trúc hoặc vẫn hòa, cần quy tắc đã chốt và validation.
:::

:::pitfall Không học hệ số nên không overfit, không cần tuning
KNN vẫn có độ linh hoạt phụ thuộc K/metric/weights và có thể bám nhãn nhiễu. Fit không tối ưu β không có nghĩa miễn công lưu/index hoặc không cần chọn siêu tham số.
:::

:::pitfall Scale cả bảng rồi mới chia fold; thêm cột nào cũng tốt
Đó là leakage tiền xử lý; Pipeline phải fit trong train/fold. Bảng feature nhiễu cho thấy nhiều cột có thể làm hàng xóm kém liên quan dù đã scale.
:::

:::pitfall Mang một triệu mẫu đi predict vẫn nhanh như mô hình vài hệ số
Brute force phải so với train, chi phí tăng theo N·D cho mỗi query và có thể tốn bộ nhớ tạm theo batch. Đo latency/RAM, cân nhắc index/ANN/giảm mẫu hoặc mô hình khác trước khi dùng thời gian thực.
:::

:::pitfall predict_proba=1 nghĩa là chắc chắn đúng
K=1 uniform chỉ nhìn nhãn một người hàng xóm, vẫn có thể nhầm. Tỉ lệ vote là đầu ra model cần kiểm chất lượng xác suất riêng, không tự được hiệu chuẩn.
:::

> **EN:** Lazy learning still needs tuning and validation. Avoid resubstitution optimism, leakage, unjustified features, unbounded query costs and interpreting vote fractions as guaranteed probabilities.

Nguồn đối chiếu phần ngoài slide: [Nearest Neighbors và thuật toán tìm kiếm](https://scikit-learn.org/stable/modules/neighbors.html), [KNeighborsClassifier, weights và hòa khoảng cách](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html), [KNeighborsRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html).

## Tóm tắt 1 phút

:::recap
- KNN đo khoảng cách → lấy K mẫu train gần nhất → vote class hoặc trung bình target số.
- Ví dụ q=(4,3): K=1/3 cho A, K=5 cho B; metric/K là lựa chọn cần kiểm chứng.
- K lẻ chỉ ngăn hòa đếm phiếu trong binary uniform; weighted/multiclass vẫn có thể hòa.
- Lazy learning không có bộ hệ số nhỏ thay train; fit/index/lưu dữ liệu vẫn tốn công.
- Brute force predict một điểm tốn công khoảng N·D, bộ nhớ lưu train cũng tăng theo N·D.
- Scale trong train/fold; categorical và feature nhiễu/thừa cần biểu diễn có ý nghĩa.
- Chọn K/weights/metric bằng CV, giữ test riêng; train accuracy 100% của K=1 không đủ.
- predict_proba là tỉ lệ vote/trọng số; KNN regression trung bình không ngoại suy target vượt miền láng giềng.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Từ q=(4,3) tới P2=(5,4), Euclid và Manhattan bằng bao nhiêu? Ba láng giềng đầu vote thế nào?
A: **Euclid=√2≈1.414214, Manhattan=2; K=3 chọn A.** Tính độ lệch (1,1), bình phương/cộng/căn hoặc cộng tuyệt đối. Ba điểm gần nhất P1/P2/P3 có nhãn A/B/A nên A=2, B=1; không chọn theo nhãn trước khi đo khoảng cách.
Q: Tăng K từ 3 lên 5 trong ví dụ tay có đổi lớp không?
A: **Có, A chuyển thành B.** K=3 có A=2,B=1; thêm P4/P5 đều B tạo A=2,B=3. Đây là dự đoán khác nhau cho cùng q, chưa biết cái nào đúng vì chưa có nhãn thật của query.
Q: K=4 hòa thì khoảng cách trung bình và inverse-distance vote cho gì? Tăng lên 5 thì sao?
A: **Hai cách dùng khoảng cách trong ví dụ chọn A, tăng K=5 chọn B.** Mean distance A=1.5, B≈1.825141; tổng trọng số A=1.5, B≈1.154320. Tăng K thêm P5 thuộc B. Các cách gỡ khác nhau không phải một quy tắc mặc định duy nhất.
Q: K=3 có thể hòa ba class không? K lẻ còn bảo đảm hết hòa nếu weighted vote không?
A: **Có thể hòa ba class, và không bảo đảm với weighted vote.** Ba láng giềng A/B/C cho mỗi class một phiếu. Với binary có hai A cách 2 và một B cách 1, inverse-distance weights cho A=1/2+1/2=1, B=1/1=1, vẫn hòa dù K=3.
Q: Dùng bảng train/CV chọn K nào trong sáu ứng viên uniform Euclid? Vì sao không chọn theo train?
A: **Chọn K=25 theo mean CV trong bảng, không khẳng định tối ưu ngoài lưới.** CV 0.880000 cao nhất; K=1 train 1.0 nhưng CV 0.803333. Ví dụ tự khớp điểm train cho thấy ghi nhớ khác dự đoán mẫu mới; test chỉ dùng sau khi chốt lựa chọn.
Q: Với năm điểm hồi quy trong bài và query x=3, K=3 dự đoán gì? Tại x=20 có ngoại suy trend thành 200 không?
A: **Dự đoán 70/3≈23.333333; tại 20 là 70.** Lấy target 20/40/10 rồi trung bình; ngoài miền input, ba target gần nhất là 100/70/40 nên mean=70. KNN không tự kéo dài trend thành 200, dù vẫn nhận được query x=20.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** How does KNN work? Giải thích cho người mới.
A: **Tìm K mẫu gần query rồi tổng hợp kết quả của chúng.** Định nghĩa metric và preprocessing, tìm láng giềng, vote cho classification hoặc trung bình cho regression. Ví dụ ba điểm A/B/A cho A; nếu thay K hoặc đơn vị feature thì hàng xóm và dự đoán có thể đổi.
EN: KNN retrieves K nearby stored samples under a chosen representation and metric, then votes for classification or averages numeric targets for regression.
Q: **B2.** How do you choose K?
A: **Chọn bằng validation/CV với metric nghiệp vụ, không bằng test hoặc train.** Gói scaler trong Pipeline, thử K cùng weights/metric, kiểm chi phí và độ ổn định; K phải hợp kích thước từng fold. Ví dụ K=25 thắng CV trong bảng dù K=1 khớp train tuyệt đối; K lẻ chỉ là mẹo tránh hòa binary uniform.
EN: Select K and related hyperparameters through validation with preprocessing inside each fold. Odd K is a tie-avoidance convenience for unweighted binary voting, not a selection criterion.
Q: **B3.** Why is KNN called a lazy learner?
A: **Vì phần lớn công suy luận được hoãn tới lúc có query.** Fit chủ yếu lưu/kiểm dữ liệu hoặc dựng index; predict mới tìm hàng xóm và vote. Ví dụ tăng N từ 100 lên một triệu làm lượng công khoảng cách brute force tăng 10,000 lần ở cùng D, không có nghĩa fit/index và lưu dữ liệu miễn phí.
EN: KNN defers most inference work to query time, storing training instances rather than fitting a compact global predictor. Storage and indexing still cost resources, and brute-force queries scale with N·D.
Q: **B4.** Why must you pay attention to feature scaling for KNN?
A: **Vì khoảng cách trực tiếp bị đơn vị feature chi phối.** Chênh một triệu đồng dễ áp đảo chênh vài chục tuổi nếu dùng số thô; ví dụ sau MinMax, hàng xóm đổi từ người B sang A. Fit scaler trên train/fold và kiểm ý nghĩa metric; nếu feature đã có thang đo phù hợp thì không cần scale lặp lại máy móc.
EN: Units directly shape KNN neighborhoods. Scale heterogeneous features within training folds and validate the resulting geometry; scaling is not a substitute for choosing a meaningful representation.
Q: **B5.** What is the curse of dimensionality?
A: **Là khó khăn do dữ liệu thưa hơn trong không gian nhiều chiều và khoảng cách có thể kém phân biệt.** Feature nhiễu/thừa có thể lấn tín hiệu dù đã scale; nhiều chiều có cấu trúc tốt không tự thất bại. Ví dụ thêm 50 cột nhiễu làm mean CV của K=5 từ 0.85 xuống 0.583333 trên demo.
EN: Higher-dimensional neighborhoods can become sparse and less informative, especially with irrelevant features. This is a representation and sample-coverage issue, not a claim that every high-dimensional dataset defeats KNN.
Q: **B6.** KNN khác Logistic và SVM khi triển khai thế nào?
A: **Khác thứ cần giữ và lượng công lúc dự đoán.** Logistic dùng hệ số, kernel SVM dùng support vector, KNN chuẩn giữ train và nhãn; brute force phải so khoảng cách với các mẫu ấy. Ví dụ model nhiều triệu hàng cần đo latency/RAM, còn fixed-size Logistic không duyệt lại N mẫu; không đánh đồng mọi SVM với một vector hệ số.
EN: Logistic Regression predicts from coefficients, kernel SVMs use support vectors, and standard KNN retains training instances and labels. Deployment cost therefore depends on different model-size and retrieval factors.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Team cần gợi ý/tìm hồ sơ tương tự, dữ liệu ít và muốn giải thích bằng ví dụ gần nhất. Bạn thử KNN thế nào?
A: **Thử một hệ thống tìm láng giềng với biểu diễn và metric có ý nghĩa trước.** Xác định “giống” theo mục tiêu, chuẩn hóa/mã hóa phù hợp, chọn K và cách tổng hợp bằng validation; nếu có nhãn thì mới dùng KNN classifier/regressor trực tiếp. Ví dụ trả ba sản phẩm tương tự là retrieval, không tự là bài toán vote class; cần đo cả chất lượng gợi ý, độ phủ và thời gian đáp ứng. Giải thích bằng hàng xóm hữu ích nhưng không chứng minh quan hệ nhân quả.
WANT: Phân biệt tìm mẫu tương tự với supervised KNN, thiết kế metric và đánh giá cho quyết định thực.
Q: **C2.** Model KNN predict chậm khi train tăng 1000 lần. Bạn xử lý gì?
A: **Đo thời gian tìm kiếm và bộ nhớ, rồi so phương án theo ngân sách latency.** Với brute force và D cố định, số phép so khoảng cách tăng tương ứng N; index/batch/phần cứng làm thời gian thực khác tỉ lệ đếm. Thử KD/Ball-tree khi phù hợp, ANN hoặc giảm mẫu/chiều có validation, so Logistic/linear model nếu chấp nhận cách dự đoán khác. Ví dụ ANN nhanh hơn nhưng có thể bỏ lỡ một hàng xóm ảnh hưởng vote; đo lại chất lượng thay vì chỉ báo throughput.
WANT: Hiểu trade-off lưu dữ liệu/query time và có phương án kiểm chứng cả tốc độ lẫn chất lượng.
Q: **C3.** KNN tốt trên notebook nhưng giảm chất lượng sau khi team thêm nhiều feature mới. Bạn kiểm gì?
A: **Kiểm dữ liệu, thang đo và ý nghĩa khoảng cách trước khi tăng K.** Rà pipeline train/serve, đơn vị và missing/encoding; đo từng nhóm feature trên validation, loại nhiễu/trùng có kiểm chứng và tune lại K/metric. Ví dụ thêm 50 cột nhiễu khiến CV giảm dù đã StandardScaler; không dùng test nhiều lần để quyết định bỏ từng cột. Kiểm thêm drift nếu dữ liệu triển khai khác notebook.
WANT: Phân biệt lỗi tiền xử lý, feature vô ích và thay đổi phân bố; sửa bằng quy trình validation nhất quán.
Q: **C4.** Hồ sơ có tuổi theo năm, thu nhập theo đồng và mã thành phố bằng số. Chỉ đưa thẳng vào KNN được không?
A: **Chưa đủ cơ sở để khoảng cách thô có ý nghĩa.** Kiểm đơn vị, scale số trong train/fold, xem mã thành phố là categorical để encode phù hợp; đánh giá đóng góp nhóm one-hot thay vì mặc định mọi cột ngang nhau. Ví dụ tiền lớn có thể lấn tuổi, còn mã 1/2/3 tạo khoảng cách địa lý giả. Dùng Pipeline tránh leakage, chọn metric/K trên validation và giữ test cuối.
WANT: Kết nối ngữ nghĩa feature, encoding, scaling và chống leakage; không chỉ gọi một scaler cho toàn bảng.
:::

## Nối sang bài sau

:::next
Quay về [[bài:supervised-algorithms]] để so KNN với [[bài:logistic-regression]] và [[bài:svm]]. Slide 76 chuyển sang **Decision Tree (cây quyết định)**: cây có bước học các luật “nếu–thì”, thay vì dự đoán bằng khoảng cách tới tập train như KNN. Chưa viết bài Decision Tree trong đợt này.
:::
