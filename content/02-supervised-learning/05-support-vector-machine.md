---
title: Máy vector hỗ trợ (Support Vector Machine — SVM)
order: 5
description: "Chọn đường phân tách có margin lớn, tìm support vector và dùng kernel để uốn ranh giới; tính tay rồi kiểm C/gamma bằng Pipeline và CV."
slides: 70-74
needs: [logistic-regression, polynomial-regression, feature-scaling, classification-metrics]
tags: [svm, support-vector, hyperplane, margin, kernel, rbf, soft-margin, C, gamma]
---

## Nhiều đường cùng đúng, đường nào nên chọn?

:::intro Đọc xong bài này bạn làm được
- Giải thích **máy vector hỗ trợ**, margin và vai trò của những điểm sát biên.
- Tính tay siêu phẳng, khoảng cách và độ rộng margin trong 1D/2D.
- Hiểu soft margin, C, ánh xạ feature và kernel trick qua số và hình.
- Phân biệt SVM với Logistic; chọn C/gamma bằng CV, scale đúng trong train.
:::

Ở [[bài:logistic-regression]], ta học xác suất bằng log loss rồi so ngưỡng để phân loại. **Support Vector Machine (SVM)** đặt câu hỏi khác: nếu nhiều đường đều tách đúng các mẫu train, đường nào để lại **khoảng trống an toàn lớn nhất** giữa hai lớp? Phần đầu xét hai lớp tách hoàn toàn; sau đó mới cho phép nhiễu và ranh giới cong.

> **EN:** Logistic Regression fits class probabilities through log loss. A separating SVM instead asks which boundary leaves the largest clearance to the nearest training points; later we relax perfect separation and allow nonlinear boundaries.

:::slides 70-74 | SVM: maximum margin, ánh xạ 2D→3D; slide 74 chỉ có khung đen
:::

:::note Nguồn và phạm vi
[[slide:70]] có hai đường ứng viên đỏ/xanh, rồi “Optimal Hyperplane”, “Support vector”, “Maximised margin”. [[slide:71]] so “Linearly Separable” với “Not Linearly Separable”. [[slide:72]] ghi “Mapping Function” φ(x1,x2)=(x1,x2,z); [[slide:73]] minh họa biến đổi rồi chiếu ranh giới về đường tròn, **không ghi công thức z**. [[slide:74]] chỉ có khung đen, không có nội dung đọc được; không đoán video bên trong.

Các công thức tối ưu, soft margin, C/gamma, kernel, code, hình matplotlib và ví dụ số trong bài là **bổ sung ngoài slide**. Tất cả bộ số là **tự soạn hoặc giả lập, không phải số liệu slide**; không suy tọa độ từ các chấm trong ảnh.
:::

:::worked Tám điểm tự soạn, ba đường đều đạt 100% train (ngoài slide)
Mỗi điểm có hai feature x1,x2 không gắn đơn vị thực. Dùng nhãn **−1/+1** để công thức SVM gọn; đây vẫn là hai class như 0/1 ở bài trước.

| Class −1 | Class +1 |
|---|---|
| (−1,0) | (1,0) |
| (−2,−1) | (2,−1) |
| (−2,1) | (2,1) |
| (−3,0) | (3,0) |

Thử ba đường thẳng đứng `x1=−0.5`, `x1=0`, `x1=0.5`. Bên trái gọi −1, bên phải gọi +1. Mọi điểm âm có x1≤−1, mọi điểm dương có x1≥1 nên cả ba đường đều tách đúng tám điểm.

Nhưng khoảng cách gần nhất tới đường khác nhau: đường −0.5 cách điểm (−1,0) là `|−1−(−0.5)|=0.5`; đường 0 cách hai điểm (−1,0)/(1,0) đều 1; đường 0.5 cách điểm (1,0) là 0.5. **Đường giữa có khoảng đệm nhỏ nhất lớn nhất: 1 thay vì 0.5.** Không chỉ đếm đúng/sai trên train.
:::

![Ba đường cùng tách đúng tám điểm; đường giữa có khoảng đệm lớn nhất và hai support vector được khoanh](/plots/svm-max-margin.png)

[Mở hình gốc](/plots/svm-max-margin.png). Mọi panel dùng cùng trục và tỉ lệ x/y; d là khoảng cách nhỏ nhất tới một điểm train, vùng tô là d mỗi bên đường. Ở panel giữa, hai vòng đen khoanh support vector của nghiệm margin lớn nhất.

[[slide:70]] thể hiện cùng trực giác: đường xanh nằm giữa hai cụm hợp lý hơn đường đỏ áp sát một phía. Đây là nhận xét về hình minh họa; không có tọa độ để đo chính xác margin của slide. **Phép ẩn dụ:** hai đội đứng hai bên một lối đi; SVM tìm lối đi rộng nhất mà không đụng ai. Những người đứng sát mép giới hạn độ rộng lối đi.

Margin lớn giúp chống lại một mức xê dịch nhỏ của input **trong thang đo feature đang dùng**. Nó là nguyên tắc kiểm soát mô hình, không bảo đảm mọi điểm mới sẽ đúng: dữ liệu mới có thể đổi phân bố, nhãn có thể sai, cách scale có thể không phù hợp.

> **EN:** Equal training accuracy does not imply equal clearance. A larger margin tolerates larger input perturbations in the chosen feature metric, but it is not a guarantee against distribution shift or labeling errors.

## Siêu phẳng, hai mép và support vector

**Hyperplane (siêu phẳng)** là tập điểm thỏa một phương trình tuyến tính có vector hệ số khác 0: trong không gian 2D nó là đường thẳng 1D; trong 3D là mặt phẳng 2D; trong n chiều là một tập phẳng **n−1 chiều**. “Nhỏ hơn 1” nói về **số chiều**, không phải bậc đa thức.

Gọi **x=(x1,…,xn)** là vector feature của một mẫu, **w=(w1,…,wn)** là vector pháp tuyến, tức hướng vuông góc với siêu phẳng. Tích vô hướng **w·x** nghĩa là `w1x1+…+wnxn`. **b** là intercept, điều chỉnh vị trí đường; **f(x)=w·x+b** là điểm quyết định. Dấu f quyết định phía của đường; bài xét f>0 là lớp +1, f<0 là −1. Điểm đúng trên f=0 là trường hợp hòa, không dùng làm ví dụ quyết định lớp ở đây.

**‖w‖**, đọc là chuẩn của w, là độ dài Euclid `√(w1²+…+wn²)`. Khoảng cách vuông góc từ x tới biên là `|f(x)|/‖w‖`; | | nghĩa là trị tuyệt đối. f tự nó **chưa phải khoảng cách** nếu chưa chia cho ‖w‖, và cũng không phải xác suất.

> **EN:** A hyperplane has one dimension fewer than its ambient space. Its normal vector w determines orientation, b shifts its position, and the geometric distance is the absolute decision score divided by the norm of w.

### Quy ước margin để không nhầm hệ số 2 (ngoài slide)

Nhân cả w,b với cùng một số dương không đổi đường f=0. Trong trường hợp tách hoàn toàn, ta chọn cách chuẩn hóa để điểm sát biên nhất thỏa `y_i f(x_i)=1`. **i** là chỉ số mẫu, **y_i∈{−1,+1}** là nhãn; nhân y với f để cùng một điều kiện áp dụng cho cả hai phía.

:::formula
**Ba mặt song song**
```text
Biên quyết định: w·x + b = 0
Mép lớp +1:     w·x + b = +1
Mép lớp −1:     w·x + b = −1
```
<!-- note: ±1 là chuẩn hóa điểm số, không phải khoảng cách 1 mặc định -->

**Khoảng cách và mục tiêu hard margin**
```text
Mỗi bên: 1 / ‖w‖
Toàn dải: 2 / ‖w‖
Minimize (1/2) ‖w‖²
với mọi i: y_i (w·x_i + b) ≥ 1
```
<!-- note: bài gọi margin toàn dải là 2/‖w‖ -->
:::

**Hard margin** là phiên bản yêu cầu mọi điểm ở đúng phía và ngoài/đúng mép. Giảm ‖w‖ trong điều kiện chuẩn hóa trên làm dải margin rộng hơn; không được tùy ý giảm w,b mà bỏ qua ràng buộc. Ví dụ lớp −1 có f=−2 thì `y f=(−1)×(−2)=2≥1`, đạt; lớp +1 có f=0.3 tuy đúng phía nhưng chưa đạt mép +1.

**Support vector (vector hỗ trợ)** là mẫu có vai trò trong biểu diễn nghiệm SVM. Ở hard margin, đó là các mẫu sát mép có hệ số đóng góp khác 0; các điểm nằm ngoài margin không đóng góp trực tiếp vào biểu thức nghiệm. Trong tình huống suy biến, một số điểm nằm đúng mép có thể có hệ số bằng 0; số điểm “ở mép” không nhất thiết bằng số phần tử `support_vectors_` mà solver lưu.

Với nghiệm đã cố định và thang đo cố định, bỏ hoặc dịch một **điểm không phải support vector**, nhưng vẫn giữ nó thỏa điều kiện ngoài margin, không làm mất nghiệm tối ưu cũ. Điều này không phải giấy phép bỏ dữ liệu tùy ý trước fit, cũng không áp dụng nguyên xi khi refit scaler làm đổi thang đo. Số support vector cũng không được bảo đảm là ít; ví dụ soft margin bên dưới có thể dùng gần hết train.

> **EN:** Hard-margin SVM maximizes geometric clearance subject to canonical constraints. Non-support points outside the margin do not contribute to the fitted representation, but preprocessing changes and degenerate solutions require care; support vectors need not be a small fraction of the sample.

## Tính tay từ 1D tới 2D (ngoài slide)

:::worked Một chiều: ở giữa 1 và 3
Chọn số đối xứng quanh 2 để tính tay gọn: lớp −1 ở x=1, lớp +1 ở x=3. Trong 1D, siêu phẳng là **một điểm cắt**. Đặt biên tại `x=(1+3)/2=2`, khoảng cách mỗi bên `2−1=3−2=1`.

Để hai điểm có f=−1/+1, giải `w×1+b=−1`, `w×3+b=1`. Lấy phương trình sau trừ trước: `2w=2` → **w=1**; thế lại `1+b=−1` → **b=−2**. Vậy f(x)=x−2, ‖w‖=1, **margin toàn dải=2/1=2**.

Kiểm ràng buộc: tại x=1, y f=`(−1)×(1−2)=1`; tại x=3, y f=`(+1)×(3−2)=1`. Cả hai là support vector. Thêm x=0 thuộc −1 và x=5 thuộc +1: y f lần lượt `(-1)×(-2)=2` và `1×3=3`, đều >1. Chúng nằm xa mép nên biên vẫn ở 2.
:::

:::worked Hai chiều: ba support vector, một điểm ở xa
Tự soạn lớp −1: **A=(−1,−1), B=(−1,1)**; lớp +1: **C=(1,0), D=(3,0)**. Chọn hai điểm âm đối xứng để nghiệm không nghiêng theo x2. Đây là bộ bốn điểm riêng, không phải tám điểm hook.

Viết w=(w1,w2). Cho A,B,C ở mép:

1. A: `−w1−w2+b=−1`.
2. B: `−w1+w2+b=−1`.
3. C: `w1+b=1`.

Lấy 2 trừ 1: `2w2=0` → w2=0. Khi đó `−w1+b=−1`; lấy 3 trừ phương trình này cho `2w1=2` → w1=1; suy ra b=0. Biên là **x1=0**, hai mép là x1=±1; ‖w‖=`√(1²+0²)=1`; margin toàn dải **2**.

A,B,C có y f=1 nên là ba support vector trong nghiệm solver của ví dụ. D có `y f=1×3=3>1`, nằm ngoài dải. Khoảng cách D tới biên là `|1×3+0×0+0|/1=3`. Không thể nới clearance vượt 1 vì hai lớp đã có A/B ở x1=−1 và C ở x1=1, đối xứng quanh đường giữa.
:::

### Code đối chiếu và sinh hình margin

Cài `pip install numpy scikit-learn matplotlib`. Các Python block trong bài có thể chạy độc lập, ảnh ghi vào thư mục **svm_output** trong nơi chạy. `C=1e6` là xấp xỉ hard margin trên các bộ số tách được này; SVC vẫn là solver soft margin hữu hạn, không phải chế độ hard margin riêng.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.svm import SVC

out = Path("svm_output")
out.mkdir(exist_ok=True)
# Kiểm 1D: thêm, xóa và dịch điểm xa mà không vượt mép.
one = SVC(kernel="linear", C=1e6, tol=1e-10).fit([[1], [3]], [-1, 1])
for far in [[[0], [1], [3], [5]], [[-5], [1], [3], [8]]]:
    fitted = SVC(kernel="linear", C=1e6, tol=1e-10).fit(far, [-1, -1, 1, 1])
    assert np.allclose(fitted.coef_, one.coef_)
    assert np.allclose(fitted.intercept_, one.intercept_)
    assert np.allclose(fitted.support_vectors_.ravel(), [1, 3])
assert np.allclose(one.coef_, [[1]]) and np.allclose(one.intercept_, [-2])

X_hand = np.array([[-1, -1], [-1, 1], [1, 0], [3, 0]], dtype=float)
y_hand = np.array([-1, -1, 1, 1])
hand = SVC(kernel="linear", C=1e6, tol=1e-10).fit(X_hand, y_hand)
print("2D w, b:", hand.coef_, hand.intercept_)
print("2D support vectors:", hand.support_vectors_)
assert np.allclose(hand.coef_, [[1, 0]], atol=1e-8)
assert np.allclose(hand.intercept_, [0], atol=1e-8)
assert np.array_equal(hand.support_, [0, 1, 2])

# Tám điểm hook; ba đường ứng viên có chung accuracy nhưng khác clearance.
X_small = np.array([[-1,0],[-2,-1],[-2,1],[-3,0],
                    [1,0],[2,-1],[2,1],[3,0]], dtype=float)
y_small = np.array([-1]*4 + [1]*4)
optimal = SVC(kernel="linear", C=1e6, tol=1e-10).fit(X_small, y_small)
fig, axes = plt.subplots(1, 3, figsize=(13, 4), constrained_layout=True)
for ax, cut in zip(axes, [-0.5, 0.0, 0.5]):
    pred = np.where(X_small[:, 0] > cut, 1, -1)
    d = np.min(np.abs(X_small[:, 0] - cut))
    assert np.array_equal(pred, y_small)
    ax.axvspan(cut-d, cut+d, color="#F3D34A", alpha=0.2)
    ax.axvline(cut, color="#D64545")
    for edge in [cut-d, cut+d]:
        ax.axvline(edge, color="#8A8172", linestyle="--")
    for label, color, marker in [(-1, "#3978B8", "D"), (1, "#70A330", "o")]:
        pts = X_small[y_small == label]
        ax.scatter(pts[:, 0], pts[:, 1], c=color, marker=marker, s=65, label=f"class {label}")
    if cut == 0:
        sv = optimal.support_vectors_
        ax.scatter(sv[:,0], sv[:,1], s=210, facecolors="none", edgecolors="black", label="support vector")
    ax.set(xlim=(-3.5,3.5), ylim=(-2,2), xlabel="x1", ylabel="x2",
           title=f"x1 = {cut:g} | train 100% | d = {d:g}")
    ax.set_aspect("equal")
    ax.grid(alpha=0.2)
axes[1].legend(fontsize=8, loc="upper center")
fig.savefig(out / "svm-max-margin.png", dpi=160)
plt.close(fig)
```

## Không tách hoàn toàn: soft margin và C (ngoài slide)

Nếu hai mẫu có cùng feature nhưng trái nhãn, không có đường nào tách đúng hết. Hoặc chỉ một nhãn nhiễu đã ép đường nghiêng rất mạnh. **Soft margin** cho phép điểm vào dải margin, thậm chí sang phía sai, rồi tính một mức phạt để đổi lấy biên hợp lý hơn.

Gọi **ξ_i** (xi, biến bù) là mức thiếu so với yêu cầu y f≥1. Ví dụ y f=0.4 thì thiếu `1−0.4=0.6`; y f=−0.2 thì thiếu `1−(−0.2)=1.2`, đã sai phía. **Hinge loss** là `max(0,1−y f)`: bằng 0 nếu đủ mép, dương nếu vi phạm. Điều này nối loss học mô hình ở [[bài:loss-function]] với hình học.

:::formula
**Mục tiêu soft margin**
```text
Minimize (1/2) ‖w‖² + C Σ ξ_i
với y_i f(x_i) ≥ 1 − ξ_i, ξ_i ≥ 0
Tương đương: ξ_i = max(0, 1 − y_i f(x_i)) tại tối ưu
```
<!-- note: phạt vi phạm margin, không chỉ đếm nhãn sai -->
:::

**C>0** là siêu tham số cân bằng hai phần: C lớn phạt vi phạm nặng hơn tương đối so với ‖w‖²; C nhỏ cho phép nhiều vi phạm hơn và thường tạo dải rộng hơn. C lớn có thể bám nhiễu/overfit, C nhỏ có thể bỏ sót cấu trúc/underfit. Không phải cứ tăng C là test xấu đi; số support vector hay accuracy không có quy luật tăng/giảm tuyệt đối trên mọi dữ liệu.

Ở soft margin, support vector gồm những điểm trên mép và các điểm vi phạm margin có đóng góp vào nghiệm; **không chỉ những điểm gần biên quyết định về khoảng cách**. Điểm bị gán nhầm nằm xa bên phía kia vẫn có thể là support vector. Không gọi mọi điểm khó là thông tin tốt mà bỏ qua chất lượng nhãn.

> **EN:** Soft-margin SVM trades a norm penalty against hinge-loss violations. Large C emphasizes violations and may follow noise; small C allows more violations. Support vectors can lie on the margin, inside it, or on the wrong side, so difficult examples must be checked for label quality.

:::worked Cùng dữ liệu có nhiễu, chỉ đổi C
Giả lập 160 mẫu, hai feature, seed 42; `flip_y=0.12` cho xác suất thay nhãn ngẫu nhiên, **không có nghĩa chính xác 12% nhãn cuối bị lật**. Tách train 120 / holdout 40 theo stratify. Mỗi hàng dùng cùng split, StandardScaler fit train và SVC tuyến tính.

| C | Số support vector | Margin 2/‖w‖ sau scale | Accuracy train | Accuracy holdout |
|---|---|---|---|---|
| 0.01 | 112 | 2.764332 | 0.925000 | 0.950000 |
| 1 | 25 | 1.109398 | 0.933333 | 0.975000 |
| 100 | 23 | 1.101201 | 0.933333 | 0.975000 |

C nhỏ cho dải rộng hơn nhưng nhiều điểm vi phạm hơn; **112/120** điểm thành support vector. Từ C=1 tới 100, accuracy không đổi ở độ chính xác này; không bịa một đường xu hướng “C càng lớn càng tệ”. Đây là thí nghiệm chẩn đoán các cấu hình định trước, **không dùng holdout để chọn model cuối**; phần CV bên dưới dùng một bộ dữ liệu độc lập và giữ test riêng.
:::

![Ba giá trị C, các mép f bằng −1 và +1, support vector khoanh đen trên cùng tọa độ đã chuẩn hóa](/plots/svm-soft-margin.png)

[Mở hình gốc](/plots/svm-soft-margin.png). Chấm vẽ là **train**, hai trục đã chuẩn hóa; đường liền f=0, đường đứt f=±1. Khoảng 2/‖w‖ là khoảng giữa hai đường đứt, không phải khoảng tới mọi điểm gần nhất trong dữ liệu nhiễu.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

out = Path("svm_output")
out.mkdir(exist_ok=True)
X_noise, y_noise = make_classification(
    n_samples=160, n_features=2, n_informative=2, n_redundant=0,
    n_clusters_per_class=1, class_sep=0.8, flip_y=0.12, random_state=42
)
X_nt, X_nh, y_nt, y_nh = train_test_split(
    X_noise, y_noise, test_size=0.25, random_state=42, stratify=y_noise
)
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), constrained_layout=True)
soft_rows = []
for ax, C in zip(axes, [0.01, 1, 100]):
    pipe = make_pipeline(StandardScaler(), SVC(kernel="linear", C=C, tol=1e-7))
    pipe.fit(X_nt, y_nt)  # scaler và classifier chỉ học train
    clf = pipe.named_steps["svc"]
    Z = pipe.named_steps["standardscaler"].transform(X_nt)
    width = 2 / np.linalg.norm(clf.coef_[0])
    soft_rows.append((C, int(clf.n_support_.sum()), width,
                      pipe.score(X_nt, y_nt), pipe.score(X_nh, y_nh)))
    print("C, nSV, margin, train, holdout:", soft_rows[-1])
    xx, yy = np.meshgrid(np.linspace(-3.5,3.5,200), np.linspace(-3.5,3.5,200))
    scores = clf.decision_function(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contour(xx, yy, scores, levels=[-1,0,1], colors=["gray","#D64545","gray"],
               linestyles=["--","-","--"])
    ax.scatter(Z[:,0], Z[:,1], c=y_nt, cmap="coolwarm", s=20)
    sv = clf.support_vectors_  # nằm trong tọa độ SAU scaler
    ax.scatter(sv[:,0], sv[:,1], s=65, facecolors="none", edgecolors="black")
    ax.set(title=f"C={C:g} | nSV={len(sv)} | width={width:.3f}",
           xlabel="scaled x1", ylabel="scaled x2", xlim=(-3.5,3.5), ylim=(-3.5,3.5))
    ax.set_aspect("equal")
fig.savefig(out / "svm-soft-margin.png", dpi=160)
plt.close(fig)
```

## Khi một đường không đủ: thêm chiều có ý nghĩa

Trong [[slide:71]], “linearly separable” nghĩa là tách được hai class bằng một đường trong 2D. Khi một lớp nằm giữa và lớp kia bao quanh, một đường không thể ôm riêng lớp ở giữa. [[slide:72]] đưa dữ liệu từ 2D lên 3D: **φ** (phi) ở đây là **hàm ánh xạ feature**, không phải sigmoid φ trong bài Logistic. Nó nhận x1,x2 và tạo vector mới `(x1,x2,z)`; z là feature tính từ input cũ, không phải một nhãn mới cần thu thập.

[[slide:73]] đi từ scatter 2D tới hình có trục x,z, thêm đường “Best Hyperplane”, rồi chiếu về đường tròn trong input gốc. Đường tròn là **ranh giới quyết định trong không gian gốc**, không phải một siêu phẳng Euclid trong chính không gian 2D ấy. Siêu phẳng nằm trong không gian feature đã ánh xạ.

> **EN:** A nonlinear feature map can make a curved original-space boundary linear in feature space. The φ symbol now denotes a feature map, not the sigmoid from Logistic Regression; the projected circle is not a hyperplane in the original plane.

:::worked Một chiều → hai chiều: z=x² (ngoài slide)
Tự soạn lớp A ở x=−1,0,1, lớp B ở x=−3,−2,2,3. Đi từ trái sang phải gặp **B rồi A rồi B**, nên một điểm cắt không thể đặt toàn bộ A về một phía và B về phía kia.

| x | Class | z=x² |
|---|---|---|
| −3 | B | (−3)×(−3)=9 |
| −2 | B | (−2)×(−2)=4 |
| −1 | A | (−1)×(−1)=1 |
| 0 | A | 0×0=0 |
| 1 | A | 1×1=1 |
| 2 | B | 2×2=4 |
| 3 | B | 3×3=9 |

Ánh xạ φ(x)=(x,x²). A có z≤1, B có z≥4, nên đường ngang **z=(1+4)/2=2.5** tách được. Chiếu về input x: `x²=2.5` → hai điểm cắt **x=±√2.5≈±1.581139**. Vùng A là `|x|<√2.5`; **không phải |x|<1.5** nếu chọn đúng z=2.5. Đổi biểu diễn không làm thêm quan sát, chỉ thêm cột feature như [[bài:polynomial-regression]].
:::

![Các điểm 1D x và sau ánh xạ thành điểm x,x² được tách bởi đường z=2.5](/plots/svm-lift-1d.png)

[Mở hình gốc](/plots/svm-lift-1d.png). Panel trái đặt các điểm lên một hàng để xem vị trí x, không coi hàng class là một feature đầu vào.

:::worked Hai chiều → ba chiều: ví dụ tự soạn, không phải công thức trên slide
Chọn **z=x1²+x2²**, bình phương khoảng cách tới gốc. Các điểm trong vòng bán kính 1 có z≤1; điểm trên/ngoài vòng bán kính 2 có z≥4. Mặt phẳng **z=2.5** nằm giữa hai nhóm. Ví dụ (1,0) → z=1; (0,2) → z=4; (−2,0) → z=4.

Chiếu về gốc: `x1²+x2²=2.5` là đường tròn bán kính `√2.5≈1.581139`. Trong không gian `(x1,x2,z)`, phương trình là `0x1+0x2+1z−2.5=0`, một mặt phẳng thật sự.

Slide 72 vẽ nhóm giữa ở phía cao hơn, nhưng **không cho công thức z**; chọn dấu âm của bình phương khoảng cách sẽ đảo cao/thấp. Ví dụ của bài dùng dấu dương nên nhóm giữa ở dưới. Ý chung là tách được bằng mặt phẳng, không khẳng định công thức tự soạn tái tạo đúng tọa độ/hướng nâng của slide.
:::

![Dữ liệu hai vòng trong 2D, nâng bằng z=x1²+x2², và đường tròn khi chiếu ngược](/plots/svm-lift-circle.png)

[Mở hình gốc](/plots/svm-lift-circle.png). Hai vòng có bán kính 1 và 2, tám điểm mỗi vòng; màu/lớp được giữ nguyên ở cả ba panel. Chỉ đổi cách biểu diễn feature.

## Kernel trick: không cần dựng mọi chiều (ngoài slide)

Tạo x² bằng tay là cách dễ thấy ý tưởng, nhưng không gian feature có thể rất lớn, thậm chí vô hạn chiều. **Kernel** là hàm `K(a,b)=φ(a)·φ(b)`: tính tích vô hướng giữa hai input **sau ánh xạ**, thông qua công thức trực tiếp trên input gốc. “Độ giống” là cách nói trực giác; không phải cứ chọn một hàm bất kỳ gọi là similarity thì có kernel hợp lệ.

**Kernel trick** dùng các tích này trong phép học/dự đoán để không cần tạo tất cả tọa độ φ tường minh. Nó tiết kiệm việc dựng feature, **không bảo đảm tiết kiệm tổng tài nguyên khi số mẫu lớn**: số cặp mẫu vẫn có thể rất lớn.

> **EN:** A kernel computes an inner product in an implicit feature space. The trick avoids explicitly constructing that space, but pairwise computations can still be expensive as the sample count grows.

:::worked Kernel đa thức bậc hai cho cùng một số qua hai cách
Tự soạn a=(1,2), b=(3,1). Chọn `K(a,b)=(a·b)²`.

1. Tính trực tiếp: `a·b=1×3+2×1=3+2=5`; bình phương `5²=25`.
2. Dựng feature: **φ(u1,u2)=(u1²,√2 u1u2,u2²)**. Hệ số √2 cần để tích chéo có hệ số 2 khi khai triển bình phương tổng.
3. φ(a)=(1,2√2,4); φ(b)=(9,3√2,1).
4. Tích vô hướng: `1×9+(2√2)×(3√2)+4×1=9+12+4=25`.

Cùng **25**, nhưng cách 1 không cần tạo vector ba chiều. Đây là ánh xạ minh họa cho kernel cụ thể, khác ánh xạ ba chiều `(x1,x2,x1²+x2²)` của ví dụ đường tròn.
:::

:::compare Các kernel thường gặp
| Kernel | Công thức | Trực giác |
|---|---|---|
| Linear | K(a,b)=a·b | Không uốn phi tuyến trong feature gốc |
| Polynomial | K(a,b)=(γ a·b+r)^d | Ngầm tạo lũy thừa/tương tác; γ nhân tích vô hướng, d là bậc, r là hằng số |
| RBF/Gaussian | K(a,b)=exp(−γ‖a−b‖²) | Điểm gần nhau ảnh hưởng nhau mạnh, ảnh hưởng giảm theo khoảng cách |
:::

**exp(v)=e^v**, e là hằng số Euler. Với **RBF** (Radial Basis Function, hàm cơ sở xuyên tâm), **gamma γ>0** quyết định mức giảm theo khoảng cách: γ lớn → ảnh hưởng hẹp, có thể tạo nhiều đảo nhỏ/bám nhiễu; γ nhỏ → ảnh hưởng rộng, thường mượt hơn nhưng có thể quá đơn giản. C và gamma cần chọn cùng nhau; tăng C đôi khi bù được một phần gamma nhỏ, không đọc mỗi tham số tách rời.

Ví dụ khoảng cách hai điểm là 2 nên bình phương khoảng cách bằng 4. Nếu γ=0.1 thì K=exp(−0.4)≈**0.670320**; nếu γ=1 thì K=exp(−4)≈**0.018316**. Cùng khoảng cách, gamma lớn làm “độ giống” rơi nhanh hơn. RBF có biểu diễn feature vô hạn chiều, không phải thực sự lưu vô hạn cột trên máy.

> **EN:** RBF gamma sets a locality scale: larger gamma makes influence narrower, while C controls the cost of margin violations. Their effects interact, so tune them jointly rather than assuming either has a universally best value.

### Code ánh xạ và sinh hai hình nâng chiều

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

out = Path("svm_output")
out.mkdir(exist_ok=True)
x = np.array([-3,-2,-1,0,1,2,3], dtype=float)
is_A = np.abs(x) <= 1
fig, axes = plt.subplots(1, 2, figsize=(10, 4), constrained_layout=True)
for mask, color, marker, label in [(is_A,"#70A330","o","A"), (~is_A,"#3978B8","D","B")]:
    axes[0].scatter(x[mask], np.zeros(mask.sum()), c=color, marker=marker, label=label, s=65)
    axes[1].scatter(x[mask], x[mask]**2, c=color, marker=marker, label=label, s=65)
axes[0].set(xlabel="x", yticks=[], title="Original 1D: B - A - B", ylim=(-1,1))
axes[1].axhline(2.5, color="#D64545", label="z=2.5")
axes[1].set(xlabel="x", ylabel="z=x^2", title="Mapped 2D: one horizontal cut")
axes[1].legend()
fig.savefig(out / "svm-lift-1d.png", dpi=160)
plt.close(fig)

angles = np.arange(8) * 2*np.pi/8
inner = np.c_[np.cos(angles), np.sin(angles)]
outer = 2*inner
fig = plt.figure(figsize=(14, 4.5), constrained_layout=True)
left = fig.add_subplot(131)
middle = fig.add_subplot(132, projection="3d")
right = fig.add_subplot(133)
for pts, color, marker, label in [(inner,"#70A330","o","inner"), (outer,"#3978B8","D","outer")]:
    z = np.sum(pts**2, axis=1)
    for ax in [left,right]:
        ax.scatter(pts[:,0], pts[:,1], c=color, marker=marker, s=45, label=label)
    middle.scatter(pts[:,0], pts[:,1], z, c=color, marker=marker, s=45)
gx, gy = np.meshgrid(np.linspace(-2.2,2.2,12), np.linspace(-2.2,2.2,12))
middle.plot_surface(gx, gy, np.full_like(gx,2.5), color="#F3D34A", alpha=0.3)
middle.set(xlabel="x1", ylabel="x2", zlabel="z=x1^2+x2^2", title="Lift: plane z=2.5")
theta = np.linspace(0,2*np.pi,200)
right.plot(np.sqrt(2.5)*np.cos(theta), np.sqrt(2.5)*np.sin(theta), color="#D64545")
for ax, title in [(left,"Original 2D: concentric classes"), (right,"Back in 2D: circular boundary")]:
    ax.set(xlabel="x1", ylabel="x2", xlim=(-2.4,2.4), ylim=(-2.4,2.4), title=title)
    ax.set_aspect("equal")
left.legend(fontsize=8)
fig.savefig(out / "svm-lift-circle.png", dpi=160)
plt.close(fig)

def phi_poly(u):
    return np.array([u[0]**2, np.sqrt(2)*u[0]*u[1], u[1]**2])
a, b = np.array([1,2]), np.array([3,1])
assert np.isclose(phi_poly(a) @ phi_poly(b), (a @ b)**2)
print("kernel, radius:", (a @ b)**2, np.sqrt(2.5))
print("RBF distance=2:", np.exp(-0.1*4), np.exp(-1*4))
```

## Scale trước, chọn C và gamma bên trong CV (ngoài slide)

Khoảng cách phụ thuộc đơn vị: hai người lệch **10 tuổi và 1,000,000 đồng** cho bình phương khoảng cách thô `10²+1,000,000²=100+10^12`; số hạng tiền lớn gấp **10^10** lần số hạng tuổi. Với feature tuổi khoảng 0–100 và thu nhập khoảng 0–10^8, hình học thô có thể bị đơn vị tiền chi phối. Đổi đồng sang triệu đồng làm cùng dữ liệu có khoảng cách khác. Với SVM tuyến tính, đổi đơn vị còn đổi mức phạt ‖w‖²; với RBF, nó đổi trực tiếp ‖a−b‖² trong kernel.

Vì vậy **luôn kiểm thang đo**, dùng scale làm mặc định cho các feature số khác đơn vị trong bài; [[bài:feature-scaling]] giải thích các lựa chọn. Nếu feature đã có thang đo/chuẩn hóa phù hợp thì không bắt buộc scale thêm lần nữa. StandardScaler không chữa nhãn sai hay mọi outlier. Fit scaler chỉ train và **train của từng fold**, không fit cả bảng trước CV.

Với dữ liệu văn bản **thưa** (sparse, phần lớn phần tử bằng 0), trừ mean có thể biến nhiều số 0 thành khác 0 và làm tốn bộ nhớ. Cần giữ tính thưa, ví dụ `StandardScaler(with_mean=False)` nếu chọn scaler này; không mặc định áp nguyên bước center của demo số dense bên dưới cho ma trận văn bản. Xem [StandardScaler với dữ liệu thưa](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html).

**Pipeline** gói scaler→SVC; **GridSearchCV** thử các cấu hình và lấy điểm validation trung bình qua các fold. Chọn bằng [[bài:k-fold-cross-validation]], giữ test riêng theo [[bài:train-test-split]]. **StratifiedKFold** giữ gần tỉ lệ class giữa các fold; dữ liệu thời gian/nhóm cần cách chia phù hợp hơn random split.

> **EN:** Feature units define SVM geometry and regularization. Scale heterogeneous numeric features inside each training fold; preserve sparsity for sparse text instead of centering it. A pipeline with cross-validation prevents validation statistics from leaking into preprocessing.

### Demo vòng tròn: xem cả hình và điểm ngoài train

Sinh **240 mẫu giả lập**, `make_circles(factor=0.4, noise=0.12, random_state=42)`. Factor là tỉ lệ bán kính vòng trong/ngoài, noise là độ lệch chuẩn nhiễu tọa độ. Tách **development 180 / test 60**, stratify. Development dùng CV 5 fold cho 3 cấu hình linear và 9 cấu hình RBF, tổng **12 ứng viên / 60 lượt fit fold**, rồi refit ứng viên thắng một lần. Metric accuracy phù hợp để minh họa bộ hai lớp cân bằng này; bài toán class hiếm cần metric khác, nối [[bài:imbalanced-data]].

![Chín cấu hình RBF: hàng là C, cột là gamma; đường f=0, vòng đen là support vector và điểm là development](/plots/svm-rbf-grid.png)

[Mở hình gốc để đọc từng panel](/plots/svm-rbf-grid.png). Cùng trục/tỉ lệ giữa các panel. Mỗi hình fit toàn development chỉ để xem ranh giới và train accuracy, **không dùng hình/train score chọn cấu hình**; việc chọn dùng CV với scaler refit ở từng fold. Viền lượn/đảo nhỏ ở gamma lớn cho thấy độ linh hoạt, còn overfit phải đối chiếu điểm ngoài train.

| Kernel | C | Gamma | Accuracy train toàn dev | Mean accuracy CV |
|---|---|---|---|---|
| RBF | 0.01 | 0.01 | 0.677778 | 0.688889 |
| RBF | 0.01 | 1 | 0.950000 | 0.938889 |
| RBF | 0.01 | 100 | 0.922222 | 0.700000 |
| RBF | 1 | 0.01 | 0.677778 | 0.688889 |
| RBF | 1 | 1 | 0.983333 | **0.983333** |
| RBF | 1 | 100 | 1.000000 | 0.855556 |
| RBF | 100 | 0.01 | 0.994444 | 0.977778 |
| RBF | 100 | 1 | 1.000000 | 0.972222 |
| RBF | 100 | 100 | 1.000000 | 0.861111 |

Linear với C=0.01/1/100 có mean CV lần lượt **0.627778/0.611111/0.594444**. RBF C=1,gamma=1 thắng trong lưới này; không có nghĩa hai số ấy tốt cho mọi dataset. C=1,gamma=100 khớp toàn dev 100% nhưng CV chỉ 0.855556 — minh họa vì sao không chọn bằng train. Các hàng C=100,gamma=0.01 và C=1,gamma=1 cũng cho thấy C/gamma có thể bù nhau phần nào.

Sau refit trên 180 mẫu development, model thắng có **42 support vector (22 lớp 0, 20 lớp 1)**. Test accuracy **0.983333**, ma trận theo thứ tự `[[TN,FP],[FN,TP]]` với lớp 1 là positive: **[[30,0],[1,29]]**. Precision lớp 1 = `29/(29+0)=1`, recall = `29/(29+1)=0.966667`; dùng [[bài:confusion-matrix]] và [[bài:classification-metrics]] để đọc từng loại sai. Test chỉ chấm sau khi chọn, không quay lại đổi C/gamma theo một lỗi này.

> **EN:** On this synthetic sample, CV selects RBF with C=1 and gamma=1, then a single refitted model is evaluated on held-out test data. Perfect development fit can accompany much worse validation accuracy; these scores are illustrative, not a universal parameter recommendation.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.datasets import make_circles
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix

out = Path("svm_output")
out.mkdir(exist_ok=True)
X_circle, y_circle = make_circles(n_samples=240, factor=0.4, noise=0.12, random_state=42)
X_dev, X_test, y_dev, y_test = train_test_split(
    X_circle, y_circle, test_size=0.25, random_state=42, stratify=y_circle
)
# GridSearchCV clone và fit TOÀN Pipeline bên trong mỗi fold.
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
param_grid = [
    {"svc__kernel": ["linear"], "svc__C": [0.01, 1, 100]},
    {"svc__kernel": ["rbf"], "svc__C": [0.01, 1, 100], "svc__gamma": [0.01, 1, 100]},
]
search = GridSearchCV(make_pipeline(StandardScaler(), SVC()), param_grid,
                      scoring="accuracy", cv=cv, n_jobs=1, refit=True)
search.fit(X_dev, y_dev)
cv_rows = list(zip(search.cv_results_["params"], search.cv_results_["mean_test_score"]))
for params, score in cv_rows:
    print(params, "CV:", round(score, 6))
print("Selected:", search.best_params_)
best = search.best_estimator_  # đã refit toàn dev; chưa dùng test để chọn
print("n_support_ by class:", best.named_steps["svc"].n_support_)

# Chín hình chẩn đoán dùng toàn dev, cùng giới hạn trục; không xem test.
lo, hi = -1.5, 1.5
xx, yy = np.meshgrid(np.linspace(lo,hi,250), np.linspace(lo,hi,250))
mesh = np.c_[xx.ravel(), yy.ravel()]
fig, axes = plt.subplots(3, 3, figsize=(12, 12), constrained_layout=True)
rbf_rows = []
for row, C in enumerate([0.01, 1, 100]):
    for col, gamma in enumerate([0.01, 1, 100]):
        pipe = make_pipeline(StandardScaler(), SVC(C=C, gamma=gamma, kernel="rbf"))
        pipe.fit(X_dev, y_dev)
        clf = pipe.named_steps["svc"]
        # support_vectors_ đã scale; đổi ngược để vẽ trên trục input gốc.
        sv = pipe.named_steps["standardscaler"].inverse_transform(clf.support_vectors_)
        ax = axes[row, col]
        scores = pipe.decision_function(mesh).reshape(xx.shape)
        ax.contourf(xx, yy, scores > 0, levels=[-0.5,0.5,1.5], colors=["#E1EBF5","#E8F0DA"])
        ax.contour(xx, yy, scores, levels=[0], colors=["#D64545"])
        for label, color in [(0,"#3978B8"),(1,"#70A330")]:
            pts = X_dev[y_dev == label]
            ax.scatter(pts[:,0], pts[:,1], c=color, s=12)
        ax.scatter(sv[:,0], sv[:,1], s=35, facecolors="none", edgecolors="black", linewidths=0.5)
        train_acc = pipe.score(X_dev, y_dev)
        rbf_rows.append((C, gamma, int(clf.n_support_.sum()), train_acc))
        ax.set(title=f"C={C:g}, gamma={gamma:g}\ntrain={train_acc:.3f}, nSV={len(sv)}",
               xlim=(lo,hi), ylim=(lo,hi), xlabel="x1", ylabel="x2")
        ax.set_aspect("equal")
fig.savefig(out / "svm-rbf-grid.png", dpi=160)
plt.close(fig)

# Chỉ sau khi chốt cấu hình mới đánh giá model cuối trên test độc lập.
test_pred = best.predict(X_test)
print("test confusion [[TN,FP],[FN,TP]]:")
print(confusion_matrix(y_test, test_pred, labels=[0, 1]))
print(classification_report(y_test, test_pred, digits=6, zero_division=0))
print("test accuracy:", round(best.score(X_test, y_test), 6))
```

## SVM hay Logistic: chọn theo điều mình cần (ngoài slide)

:::compare Cùng phân loại, khác mục tiêu và đầu ra
| Tiêu chí | SVM/SVC | Logistic Regression |
|---|---|---|
| Mục tiêu | Margin lớn, cân bằng norm và hinge loss ở soft margin | Mô hình xác suất, tối ưu log loss và penalty |
| Mẫu đóng góp vào ranh giới | Support vector có hệ số đóng góp; điểm ngoài margin không góp trực tiếp | Mọi mẫu có đóng góp vào log loss; mức đóng góp khác nhau |
| Đầu ra mặc định | Class; `decision_function` là score có dấu | `predict_proba` là xác suất ước lượng, `predict` là class |
| Khoảng cách | Linear: score chia ‖w‖ mới là khoảng cách; RBF không đọc là khoảng cách Euclid ở input gốc | Score trước sigmoid là log-odds, không phải khoảng cách hay xác suất |
| Ranh giới phi tuyến | Có thể dùng kernel | Có thể tạo feature đa thức/tương tác |
| Scale | Quan trọng với hình học/penalty | Quan trọng với penalty và tối ưu |
| Diễn giải | Linear có w; RBF khó đọc bằng hệ số input | Hệ số đọc qua log-odds/odds có điều kiện |
| Tập rất lớn | Kernel SVC có thể đắt; cân nhắc LinearSVC/SGD hoặc xấp xỉ kernel | Thường là baseline dễ mở rộng hơn kernel SVC |
:::

SVC mặc định không cho xác suất. Cách cũ `SVC(probability=True)` dùng hiệu chuẩn Platt cho nhị phân và tốn thêm CV; trong sklearn **1.9**, tham số này đã bị đánh dấu deprecated, tài liệu khuyên dùng **CalibratedClassifierCV** thay thế. Hiệu chuẩn là bước học thêm trên dữ liệu train/CV thích hợp, không tự bảo đảm xác suất tốt trên mọi dữ liệu. Nếu chỉ cần xếp hạng, score có thể đủ; nếu cần xác suất để tính chi phí thì phải kiểm hiệu chuẩn. Xem [tài liệu SVC hiện hành](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html).

Với N mẫu, một ma trận kernel đầy đủ có **N²** phần tử; 100 lần số mẫu tạo **10,000 lần** số cặp. libsvm có cache nên không bắt buộc luôn lưu toàn ma trận, nhưng fit kernel SVC thường tăng chi phí hơn tuyến tính theo N. Không khẳng định thời gian luôn tăng chính xác 10,000 lần. Hàng triệu mẫu cần đo tài nguyên và so linear/Logistic, giảm mẫu có kiểm chứng hoặc xấp xỉ kernel.

Dữ liệu lệch lớp có thể thử `class_weight`, xem [[bài:imbalanced-data]]: trong SVC, trọng số lớp nhân với C để đổi mức phạt vi phạm của các mẫu thuộc lớp đó; vẫn phải chọn metric/chi phí đúng. **SVR** là phiên bản Support Vector Regression cho target liên tục, dùng vùng dung sai quanh đường dự đoán; đó là lý do SVM có dấu sao ở [[bài:supervised-algorithms]]. Bài này không triển khai SVR hay multiclass; `SVC` hỗ trợ nhiều lớp nhưng công thức/hình ở đây tập trung nhị phân.

> **EN:** Choose based on validation quality, required outputs, interpretability and scale. Kernel SVC is not inherently probabilistic and pairwise kernel computations can be costly; linear alternatives and proper calibration solve different needs.

## Chọn tập con: điểm khó có phải luôn tốt? (ngoài slide)

Ghi chú chủ repo đặt câu hỏi: nếu chỉ đủ tài nguyên học từ một phần dữ liệu ảnh đã gán nhãn, nên chọn ảnh nào? Ta giữ bản chất câu hỏi bằng ví dụ **ảnh mèo/chó dễ nhầm**, không suy diễn quốc tịch hoặc đặc điểm nhóm người từ khuôn mặt.

Các ảnh gần ranh giới của một model hiện có có thể mang nhiều thông tin hơn ảnh quá dễ nằm xa mép. Đây là **phép liên hệ** với support vector, không phải quy tắc “chọn toàn ảnh khó thì model tốt nhất”. Trước khi fit chưa biết chắc điểm nào sẽ là support vector; thay tập train hay C/kernel có thể đổi ranh giới và tập support vector.

**Khó ≠ nhãn sai/nhiễu.** Ảnh mờ hoặc gán nhầm có thể bị model xem là rất khó nhưng làm lệch margin, nhất là C lớn. Cần nhãn đáng tin, độ phủ các nhóm/tình huống và số mẫu đủ đại diện; luôn giữ tập đánh giá đại diện độc lập thay vì chỉ chấm ảnh khó đã chọn. Với ảnh, cách biểu diễn feature cũng rất quan trọng; không hứa SVM trên pixel thô phân biệt tốt mọi ảnh.

Tên ý tưởng gần gũi là **hard example mining** (tập trung mẫu khó trong quá trình học) và **active learning** (chọn mẫu chưa có nhãn đáng gán nhãn tiếp, thường dựa trên mức bất định). Chọn gần biên chỉ là một chiến lược; cần cân bằng độ đa dạng, đại diện và chất lượng nhãn. Xem [khảo sát Active Learning của Burr Settles](https://burrsettles.com/pub/settles.activelearning.pdf) về chọn mẫu và chất lượng nguồn nhãn.

> **EN:** Informative boundary examples motivate hard example mining and uncertainty-based active learning, but they are not a universal sampling rule. Preserve representative coverage, trustworthy labels and an independent evaluation set; difficult mislabeled examples can be harmful.

## Những hiểu sai cần chặn (ngoài slide)

:::pitfall Đường nào tách đúng train cũng tốt như nhau
Ba đường hook đều 100% nhưng clearance khác nhau. Margin giúp chọn giữa chúng; không thay thế việc đo dữ liệu mới.
:::

:::pitfall Chỉ hai điểm gần biên quyết định mọi SVM
Ví dụ 2D có ba support vector; soft margin còn gồm mẫu vi phạm, đôi khi rất nhiều mẫu. Không xóa dữ liệu tùy tiện hoặc refit scaler rồi trông chờ biên giữ nguyên.
:::

:::pitfall C lớn, gamma lớn, khớp train thì tốt
RBF C=1,gamma=100 đạt train 1.0 nhưng CV≈0.855556 trong demo. Chọn C/gamma bằng CV, không bằng train hoặc test; nhãn sai có thể kéo lệch nghiệm khi phạt lớn.
:::

:::pitfall Càng nhiều chiều càng tốt; kernel không tốn tài nguyên
Ánh xạ có thể làm tách train dễ hơn nhưng vẫn overfit; nhiều chiều với ít dữ liệu có thể làm việc học/đánh giá khó hơn, gọi là lời nguyền số chiều (curse of dimensionality). Kernel tránh dựng mọi cột, không tránh mọi phép so cặp mẫu.
:::

:::pitfall Quên scale hoặc gọi score là xác suất
Tuổi và tiền khác thang đo làm đổi hình học; scale trong Pipeline, không fit cả test. `decision_function=2` không nghĩa xác suất 200%, và score linear chưa chia ‖w‖ cũng chưa là khoảng cách.
:::

> **EN:** Training fit, support-vector sparsity, kernel geometry, scaling and probabilistic interpretation are separate concerns. Validate the complete learning procedure rather than relying on a single geometric picture.

Nguồn đối chiếu phần ngoài slide: [SVM và công thức tối ưu](https://scikit-learn.org/stable/modules/svm.html), [SVC và các thuộc tính](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html), [tương tác C/gamma](https://scikit-learn.org/stable/auto_examples/svm/plot_rbf_parameters.html), [Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html).

## Tóm tắt 1 phút

:::recap
- Siêu phẳng có n−1 chiều trong không gian n chiều; linear SVM dùng w·x+b=0.
- Chuẩn hóa mép ở ±1: clearance mỗi bên 1/‖w‖, margin toàn dải 2/‖w‖.
- Support vector là mẫu đóng góp vào nghiệm; soft margin còn gồm điểm vi phạm, không bảo đảm số ít.
- C lớn phạt vi phạm nặng hơn; C nhỏ thường cho dải rộng hơn, cần kiểm underfit/overfit.
- Ánh xạ thêm feature có thể làm biên cong ở input gốc thành siêu phẳng ở không gian mới.
- Kernel tính tích vô hướng ngầm; RBF gamma lớn làm ảnh hưởng hẹp, cần chọn cùng C.
- Scale trong train/fold, chọn bằng CV, giữ test riêng; default SVC không có xác suất.
- Mẫu khó cần nhãn tin cậy và độ phủ; không suy “càng khó/càng nhiều chiều càng tốt”.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Với w=(3,4), b=−5, tính ‖w‖, margin toàn dải và khoảng cách điểm (3,0) tới biên.
A: **Chuẩn 5, margin 0.4, khoảng cách 0.8**, khi w,b dùng chuẩn hóa mép ±1. Tính √(3²+4²)=5; 2/5=0.4. Tại (3,0), f=3×3+4×0−5=4, khoảng cách |4|/5=0.8; không đọc f=4 thành xác suất hay khoảng cách trực tiếp.
Q: Trong ví dụ 1D x=1 thuộc −1, x=3 thuộc +1, thêm x=0 và x=5 đúng lớp có đổi biên không?
A: **Không, trong bài toán cố định thang đo này biên vẫn x=2.** Nghiệm w=1,b=−2 cho y f=1 ở hai mẫu cũ; điểm mới cho y f=2 và 3, nằm ngoài margin. Ví dụ code fit lại vẫn giữ support vector [1,3]; refit scaler là bài toán khác nên không suy rộng máy móc.
Q: Với bốn điểm A,B,C,D trong bài, điểm nào là support vector? D cách biên bao xa?
A: **A,B,C là support vector trong nghiệm ví dụ; D cách biên 3.** Với w=(1,0),b=0, ba điểm đầu thỏa y f=1; D=(3,0) có y f=3. Lấy |3|/1=3 cho khoảng cách, còn margin toàn dải là 2.
Q: Ánh xạ z=x², cắt z=2.5 thì hai điểm cắt trên x có phải ±1.5 không?
A: **Không, là ±√2.5≈±1.581139.** Giải x²=2.5 rồi lấy hai căn đối dấu. Ví dụ x=−1,0,1 ở dưới đường, x=±2,±3 ở trên; ±1.5 chỉ tương ứng mức z=2.25.
Q: Đọc bảng C và bảng RBF: có chọn cấu hình train 100% thay cho CV tốt nhất không?
A: **Không; dùng CV theo mục tiêu đã chốt.** C nhỏ có 112/120 support vector nên không mặc định SVM chỉ dùng vài điểm. Ở vòng tròn, C=1,gamma=100 có train 1.0 nhưng CV 0.855556, thấp hơn C=1,gamma=1 với CV 0.983333; test giữ cho đánh giá cuối.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Support vector là gì và vì sao chỉ chúng quan trọng trong nghiệm?
A: **Đó là các mẫu có hệ số đóng góp vào biểu diễn nghiệm SVM.** Ở hard margin chúng nằm trên mép; soft margin còn có mẫu vi phạm, kể cả sai phía. Điểm ngoài margin không góp trực tiếp, nhưng chọn preprocessing và thay dữ liệu trước fit vẫn có thể đổi nghiệm; ví dụ bài 2D có ba support vector và một điểm xa D.
EN: Support vectors have nonzero contributions to the fitted SVM representation. They lie on the hard margin or may violate the soft margin; non-support points outside the margin do not directly contribute under a fixed representation.
Q: **B2.** Maximum margin nghĩa là gì, vì sao có thể giúp tổng quát hóa?
A: **Là tối đa khoảng đệm nhỏ nhất tới các điểm train trong hard-margin setting.** Nó giảm nhạy với nhiễu input nhỏ theo thang đo đã chọn; dưới chuẩn hóa ±1, tối thiểu ‖w‖² tương đương tối đa 2/‖w‖. Ví dụ ba đường cùng đúng nhưng đường giữa có clearance 1 thay vì 0.5; không hứa chống được drift hay mọi nhãn sai.
EN: Maximum margin maximizes the minimum geometric clearance under hard-margin constraints. It can improve robustness to small perturbations in the chosen metric, but does not guarantee generalization under arbitrary data shifts.
Q: **B3.** Kernel trick là gì? Cho một ví dụ số.
A: **Tính tích vô hướng trong không gian ánh xạ mà không dựng mọi tọa độ.** Với a=(1,2),b=(3,1), kernel (a·b)²=(3+2)²=25, bằng φ(a)·φ(b) khi φ(u)=(u1²,√2u1u2,u2²). Tránh dựng feature không đồng nghĩa tránh chi phí so các cặp mẫu.
EN: A kernel evaluates a feature-space inner product implicitly, such as (a·b)² for a quadratic feature map. This avoids explicit expansion but not necessarily expensive pairwise computations.
Q: **B4.** C và gamma ảnh hưởng thế nào?
A: **C đặt giá vi phạm margin; RBF gamma đặt độ cục bộ của kernel.** C lớn cố giảm hinge violations, có thể bám nhiễu; gamma lớn cho ảnh hưởng hẹp, dễ tạo biên phức tạp. Chọn cùng nhau bằng CV; ví dụ C=1,gamma=100 khớp dev tuyệt đối nhưng CV kém cấu hình 1/1.
EN: C controls the relative penalty on margin violations, while RBF gamma controls locality. Their effects interact and should be selected jointly through validation rather than training fit.
Q: **B5.** SVM khác Logistic Regression ở đâu?
A: **SVM tối ưu margin/hinge loss, Logistic tối ưu mô hình xác suất bằng log loss.** SVC mặc định cho score/class, Logistic cho xác suất ước lượng; cả hai cần kiểm scale và regularization. Ví dụ muốn ranh giới phi tuyến có thể thử RBF, còn cần xác suất chiến dịch nên so Logistic với SVM được hiệu chuẩn, không coi score là p.
EN: SVM emphasizes margins and hinge loss, whereas Logistic Regression fits probabilities with log loss. Default SVC scores are not probabilities; nonlinear kernels and probability calibration address different requirements.
Q: **B6.** Vì sao SVM cần chú ý scale?
A: **Vì đơn vị feature quyết định hình học khoảng cách và mức regularization.** Chênh 10 tuổi/1,000,000 đồng tạo bình phương chênh 100/10^12, nên tiền chi phối khoảng cách thô. Dùng Pipeline fit scaler trong từng fold; nếu dữ liệu đã ở thang phù hợp thì không bắt buộc chuẩn hóa lặp lại.
EN: Feature units change distances, kernel values and regularization geometry. Scale heterogeneous features inside each training fold, while respecting representations that are already appropriately normalized.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Ít ảnh/văn bản có nhãn nhưng feature nhiều chiều: có nên thử SVM không?
A: **Có thể thử như ứng viên, phải đánh giá cách biểu diễn và regularization.** Dùng feature phù hợp như vector văn bản/embedding ảnh, so linear SVM và Logistic bằng split đúng nhóm/nguồn, chọn C qua CV; với sparse text không center phá tính thưa. Nhiều chiều không tự tốt hơn và kernel chưa chắc cần thiết; ví dụ ít ảnh nhưng pixel nhiễu có thể thua feature biểu diễn tốt. Giữ test độc lập và kiểm chất lượng nhãn.
WANT: Nối ít nhãn với biểu diễn, regularization và đánh giá; không mặc định RBF thắng vì linh hoạt.
Q: **C2.** Dữ liệu tăng 100 lần, kernel SVM train quá chậm. Bạn làm gì?
A: **Đo nút thắt rồi so phương án mở rộng, không chỉ tăng máy.** Số cặp kernel đầy đủ tăng 10,000 lần về mặt đếm, dù cache/solver làm thời gian thực tế khác. So LinearSVC hoặc Logistic/SGD với metric và latency, cân nhắc kernel approximation hay tập con đại diện được kiểm chứng; ví dụ dữ liệu text nhiều chiều có thể đủ với linear. Kiểm cả số support vector vì nó ảnh hưởng dự đoán, giữ chất lượng bằng validation.
WANT: Hiểu chi phí theo số mẫu, phân biệt đếm cặp với thời gian thực tế và đề xuất phương án có đo đánh đổi.
Q: **C3.** Khách rời bỏ cần xác suất để tính lợi ích ưu đãi. Có lấy decision_function của SVC làm xác suất không?
A: **Không; score chỉ là điểm quyết định, có thể dùng xếp hạng nhưng không tự là xác suất.** So Logistic baseline hoặc hiệu chuẩn SVM bằng CV trên development, kiểm chất lượng xác suất và lợi ích chiến dịch trước khi chốt; không dùng test để học hiệu chuẩn. Ví dụ score=2 không nghĩa p=2 hay 200%; bản sklearn hiện tại cũng khuyến nghị CalibratedClassifierCV thay tùy chọn probability cũ.
WANT: Phân biệt score/ranking/probability và thiết kế hiệu chuẩn không leakage, thay vì chỉ gọi thêm một hàm API.
Q: **C4.** Chỉ đủ tài nguyên train một tập con ảnh mèo/chó. Có lấy toàn ảnh model hay nhầm không?
A: **Không chọn toàn ảnh khó mà bỏ đại diện và nhãn tin cậy.** Dùng model ban đầu tìm mẫu gần biên/bất định, kiểm nhãn rồi chọn thêm đa dạng nhóm/điều kiện, giữ cả mẫu dễ đại diện và test độc lập. Ví dụ ảnh nhãn sai có thể rất khó nhưng kéo margin sai, nhất là C lớn; support vector của tập đầy đủ cũng chưa biết trước fit. Nếu chọn ảnh chưa nhãn để hỏi người gán, đó là active learning, khác chỉ lọc tập đã nhãn.
WANT: Giữ trực giác điểm sát biên nhiều thông tin, đồng thời phân biệt nhiễu, selection bias và chiến lược lấy mẫu có kiểm chứng.
:::

## Nối sang bài sau

:::next
[[bài:supervised-algorithms]] đã có Logistic và SVM trong nhóm phân loại. Tiếp theo là [[bài:k-nearest-neighbours]] ở slide 75: thay vì học một đường phân tách như SVM, KNN dự đoán từ những mẫu train gần input mới.
:::
