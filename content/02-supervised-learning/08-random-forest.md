---
title: "Rừng ngẫu nhiên (Random Forest)"
order: 8
description: "Kết hợp các cây đa dạng bằng bootstrap và feature ngẫu nhiên, kiểm OOB, chọn số cây bằng CV và đọc feature importance đúng giới hạn."
slides: 78-80
needs: [decision-tree, k-fold-cross-validation]
tags: [random-forest, bagging, bootstrap, ensemble, oob, feature-importance, classification, regression]
---

## Vì sao kết hợp nhiều cây?

:::intro
Một [[bài:decision-tree]] có thể đổi nhiều khi thêm vài mẫu. Nếu hỏi một hội đồng gồm nhiều cây được tạo khác nhau, các lỗi riêng có thể bù bớt cho nhau. **Rừng ngẫu nhiên (Random Forest)** kết hợp cây bằng hai nguồn ngẫu nhiên: mẫu train cho từng cây và feature ứng viên tại từng lần chia. Mục tiêu chính là giảm biến động; chất lượng trên dữ liệu mới vẫn phải đo.
:::

> **EN:** A random forest combines trees diversified by bootstrap samples and random split candidates. It aims to reduce variability, while generalization still requires measurement on appropriate held-out data.

:::slides 78-80 | Từ một cây tới nhiều cây, pipeline huấn luyện và ví dụ bỏ phiếu trái cây
:::

## Một người hay một hội đồng?

[[slide:78]] đặt một cây cạnh nhiều cây dự đoán Class 1/Class 2. **Ensemble** nghĩa là mô hình kết hợp nhiều mô hình con. Hỏi năm bản sao có cùng lỗi thì không giúp bằng hỏi năm người có hiểu biết khác nhau.

:::worked Năm phiếu đúng 70%: ví dụ tự soạn, ngoài slide
Giả sử phân loại hai class, mỗi cây đúng với xác suất p=0.7, các biến cố đúng/sai **độc lập**, phiếu có cùng trọng số. Năm cây thắng đa số khi đúng 3, 4 hoặc 5 cây. Với k cây đúng, có C(5,k) cách chọn những cây đó:

P(đa số đúng) = C(5,3)×0.7³×0.3² + C(5,4)×0.7⁴×0.3 + 0.7⁵

= 10×0.343×0.09 + 5×0.2401×0.3 + 0.16807

= 0.3087 + 0.36015 + 0.16807 = **0.83692 = 83.692%**.

Đây là mô hình xác suất minh họa, không phải accuracy đã đo của Random Forest. Các cây thật dùng chung nguồn dữ liệu nên lỗi thường tương quan; nếu cả năm luôn sai cùng lúc, kết hợp vẫn chỉ đúng 70%.
:::

> **EN:** An ensemble can improve predictions when its members make sufficiently different errors. The 83.692% majority-vote calculation assumes five independent binary voters with identical 70% accuracy; real forest errors are correlated.

## Đọc pipeline và phiếu trái cây trên slide

[[slide:79]] vẽ Training Set → Training Data 1…n → Decision Tree 1…n → Voting (averaging) → Prediction. Test Set được vẽ riêng: dữ liệu đánh giá không dùng để tạo các tập bootstrap hay chọn split. Slide không ghi “70%”.

[[slide:80]] đưa cùng một **instance** (một mẫu giỏ trái cây) qua nhiều cây. Ba kết quả minh họa là Class-A, Class-A, Class-B: đếm A=2, B=1 nên majority voting (bỏ phiếu đa số) chọn **A**. Đây là bỏ phiếu **nhãn cứng**, mỗi cây một phiếu.

:::worked Mở rộng bảy cây — tự soạn, ngoài slide
Phiếu A, B, A, A, B, A, B có A=4, B=3, nên chọn A với 4/7 phiếu. Tỉ lệ phiếu không tự trở thành xác suất đã hiệu chỉnh của sự kiện thật. Với hai class và bảy phiếu không hòa; số cây lẻ không loại mọi kiểu hòa trong phân loại nhiều class.
:::

:::note Phân biệt hình minh họa và cách sklearn dự đoán — ngoài slide
`RandomForestClassifier` trong sklearn **lấy trung bình xác suất class từ các cây rồi chọn class có trung bình lớn nhất**. Nó không luôn trùng majority vote của nhãn cứng trên slide. Ví dụ ba cây cho P(A)=[0.51,0.51,0.01]: nhãn cứng A,A,B chọn A; trung bình P(A)=1.03/3≈0.343333, P(B)≈0.656667 nên sklearn chọn B. Khi mọi lá thuần và xác suất từng cây là 0/1, hai cách tương đương nếu xử lý hòa giống nhau. Code phía dưới kiểm cách lấy trung bình trên forest thật.
:::

Hồi quy lấy trung bình dự đoán số từ các cây. Ví dụ ngoài slide, ba cây dự đoán 6, 9, 12 thì forest trả (6+9+12)/3=9; mỗi cây với `squared_error` dùng mean target tại lá như bài trước.

> **EN:** The slides illustrate hard-label majority voting. Scikit-learn instead averages per-tree class probabilities and chooses the highest average, which can disagree with hard voting. Regression forests average numerical tree predictions.

## Hai nguồn ngẫu nhiên tạo đa dạng (ngoài slide)

**Bootstrap** là lấy mẫu **có hoàn lại**: rút một dòng rồi vẫn có thể rút lại dòng đó. **Bagging** (bootstrap aggregating) huấn luyện nhiều mô hình trên các bootstrap sample rồi kết hợp. Mặc định mỗi cây RF sklearn rút N lượt từ N dòng train, vì `bootstrap=True, max_samples=None`; số dòng khác nhau thường nhỏ hơn N.

**Feature ngẫu nhiên:** tại **mỗi nút**, chọn ngẫu nhiên một tập feature ứng viên rồi tìm split tốt trong tập đó. `max_features='sqrt'` là mặc định của classifier đã kiểm trên sklearn 1.9.1. Với D=2 cột, mỗi nút thường xét floor(√2)=1 feature; nút khác có thể chọn cột khác. Cây đầu của demo có `max_features_=1` nhưng các split của cả cây dùng cả x1 lẫn x2. Nếu cần để tìm một phân hoạch hợp lệ, việc tìm split có thể kiểm tra thêm feature vượt số ứng viên này.

Không phải mỗi cây cố định một tập feature cho suốt đời cây; cách cố định theo cây là ý tưởng random subspace khác. Nếu huấn luyện cây cùng toàn bộ dữ liệu, cùng feature, cùng quy tắc và cách phá hòa, chúng có thể giống nhau. Chỉ đổi seed đôi khi cũng đổi cây do phá hòa, nhưng bootstrap và feature sampling tạo đa dạng có chủ đích hơn.

:::note Đối chiếu ghi chú “khoảng 70% bộ gốc”
Đây không phải quy tắc mặc định sklearn. Mặc định rút N lượt có hoàn lại, kỳ vọng khoảng **63.2% dòng khác nhau** khi N lớn. `max_samples=0.7` nghĩa là rút khoảng 0.7N lượt **vẫn có hoàn lại**; khi N lớn kỳ vọng chỉ khoảng 1−exp(−0.7)≈**50.34% dòng khác nhau**, không phải 70%. Lấy 70% không hoàn lại là thủ tục lấy mẫu khác. Slide 79 chỉ ghi Training Data 1…n, không ấn định tỉ lệ.
:::

> **EN:** Standard forests combine bootstrap sampling per tree with random feature candidates per split. The default bootstrap draw count is the training-set size, not 70% distinct rows. A tree may use different features at different nodes.

## Làm tay bootstrap và out-of-bag (ngoài slide)

:::worked Mười mẫu, seed 42 — tự soạn, không phải số liệu slide
Đánh số mẫu 1…10. `default_rng(42).integers(1,11,size=10)` rút được:

**[1,8,7,5,5,9,1,7,3,1]**.

| Mẫu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Số lần rút | 3 | 0 | 1 | 0 | 2 | 0 | 2 | 1 | 1 | 0 |

Có 10 lượt nhưng chỉ 6 dòng khác nhau: {1,3,5,7,8,9}. **Out-of-bag (OOB)** là các dòng không được rút cho cây này: **{2,4,6,10}**. Cây khác có bộ OOB khác; một dòng có thể OOB với cây này và là train của cây kia.

Với một dòng cụ thể, xác suất không bị chọn ở một lượt là 9/10. Mười lượt độc lập có hoàn lại cho P(OOB)=(9/10)¹⁰=**0.3486784401**. Kỳ vọng số dòng khác nhau=10×(1−0.3486784401)=**6.513215599**; kết quả rút thực tế 6 là bình thường, không bắt buộc bằng kỳ vọng.
:::

![Bootstrap 10 lượt: các mẫu xuất hiện lặp và các mẫu OOB](/plots/random-forest-bootstrap.png)

[Mở hình bootstrap ở độ phân giải gốc](/plots/random-forest-bootstrap.png).

:::formula Xác suất OOB với N dòng và N lượt rút
P(một dòng OOB) = (1−1/N)^N → exp(−1)≈0.367879 khi N→∞.

Tỉ lệ dòng khác nhau kỳ vọng = 1−(1−1/N)^N → 0.632121.

Mỗi cây thấy khoảng 63.2% **dòng khác nhau**, nhưng vẫn nhận N **lượt** rút. Tỉ lệ này là kỳ vọng giới hạn, không phải con số đúng cho mọi cây hay mọi N.
:::

Để dự đoán OOB cho dòng i, chỉ tổng hợp các cây **không từng rút dòng i**. Gom các dự đoán đó để tính OOB score; `oob_score=True` trong demo dùng accuracy. OOB tái sử dụng các lượt bỏ sót để có đánh giá nội bộ, không cần tách thêm một tập riêng chỉ cho bước này; vẫn có chi phí tính toán và cây ít có thể chưa cho mọi mẫu đủ phiếu OOB.

OOB không thay [[bài:train-test-split|test cuối]]. Nếu imputer/encoder/feature selection đã học trên toàn bộ development trước forest, mẫu OOB có thể đã ảnh hưởng tiền xử lý; OOB không tự sửa leakage đó. Khi chọn cả pipeline, dùng [[bài:k-fold-cross-validation]] phù hợp; test thời gian/nhóm phải phản ánh triển khai.

> **EN:** OOB predictions for a row use only trees whose bootstrap samples omitted that row. The familiar 36.8% OOB and 63.2% distinct-sample rates are large-N expectations. OOB evaluation does not automatically validate preprocessing or replace an untouched final test set.

## Code kiểm xác suất, bootstrap và hình (ngoài slide)

Code Python độc lập, sinh ảnh bootstrap bằng matplotlib; seed và các ví dụ là tự soạn.

```python
from pathlib import Path
from math import comb, exp
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

out = Path("tree_forest_output")
out.mkdir(exist_ok=True)
p = 0.7
terms = [comb(5, k) * p**k * (1-p)**(5-k) for k in (3, 4, 5)]
print("Majority:", terms, sum(terms))
assert np.isclose(sum(terms), 0.83692)
votes = np.array(["A", "B", "A", "A", "B", "A", "B"])
print("7 hard votes:", np.unique(votes, return_counts=True))
pa = np.array([0.51, 0.51, 0.01])
print("Soft vote P(A), P(B):", pa.mean(), 1-pa.mean())
draw = np.random.default_rng(42).integers(1, 11, size=10)
counts = np.bincount(draw, minlength=11)[1:]
oob = np.arange(1, 11)[counts == 0]
print("Draw:", draw, "OOB:", oob)
assert draw.tolist() == [1, 8, 7, 5, 5, 9, 1, 7, 3, 1]
assert oob.tolist() == [2, 4, 6, 10]
print("N=10 OOB:", (1-1/10)**10)
print("Expected distinct:", 10*(1-(1-1/10)**10))
print("Limits:", exp(-1), 1-exp(-1), "0.7N draws:", 1-exp(-0.7))
fig, ax = plt.subplots(figsize=(9, 4))
ax.bar(np.arange(1, 11), counts,
       color=np.where(counts == 0, "#d47250", "#487a87"))
for i, c in enumerate(counts, 1):
    ax.text(i, c+0.08, str(c) if c else "OOB", ha="center")
ax.set(xticks=np.arange(1, 11), yticks=[0, 1, 2, 3], ylim=(0, 3.7),
       xlabel="Sample ID", ylabel="Times drawn",
       title="Bootstrap: 10 draws, 6 distinct samples (seed 42)")
fig.tight_layout()
fig.savefig(out / "random-forest-bootstrap.png", dpi=170)
plt.close(fig)
```

## Chọn bao nhiêu cây? (ngoài slide)

**n_estimators** là số cây T. Tăng T thường làm kết quả trung bình bớt phụ thuộc những lượt ngẫu nhiên riêng, nhưng tốn RAM, thời gian train và predict. Không giống tăng depth của một cây, thêm cây chủ yếu làm giảm phương sai do lấy trung bình; không hứa CV tăng từng bước, không miễn overfit do nhiễu/leakage.

:::formula Vì sao tương quan giữa cây quan trọng? — mô hình minh họa
Với T đại lượng dự đoán có cùng phương sai σ² và mọi cặp có cùng tương quan ρ:

Var(trung bình) = σ²[ρ+(1−ρ)/T].

Ví dụ tự soạn σ²=1, T=5: ρ=0 cho phương sai 0.2; ρ=0.8 cho 0.84. Cây càng giống nhau, trung bình càng ít giảm dao động. Đây là công thức cho trung bình đại lượng số, không phải công thức trực tiếp của accuracy majority vote.
:::

**Thí nghiệm tự soạn**, cùng bài Tree: `make_moons(400, noise=0.3, random_state=42)`, tách stratify 300 development/100 test, năm fold stratify shuffle seed42 chỉ trên development. Tất cả model seed42, `n_jobs=1`. Chọn cấu hình từ CV, chưa nhìn test.

| Số cây | CV accuracy trung bình | Độ lệch chuẩn 5 fold (ddof=0) | Thời gian cả lượt 5-fold CV (giây) |
|---|---|---|---|
| 1 | 0.843333 | 0.041633 | 0.081944 |
| 5 | 0.870000 | 0.024495 | 0.116925 |
| 25 | 0.873333 | 0.022608 | 0.501214 |
| 100 | 0.876667 | 0.032660 | 1.773105 |
| 300 | 0.876667 | 0.027080 | 5.248291 |

Chọn **100 cây**: CV mean bằng 300 nhưng rẻ hơn trong lần đo này. Std không giảm đều, và std fold không phải confidence interval. Thời gian là một lượt đo thật trên Windows/Python 3.14.6, sklearn 1.9.1, CPU i5-12450HX, 12 logical processors nhưng `n_jobs=1`; gồm fit và scoring cả năm fold. Máy khác/lần chạy khác cho thời gian khác; không đọc nó như độ trễ một prediction.

> **EN:** Select the number of trees on development folds while accounting for cost. More trees reduce Monte Carlo variability but do not guarantee monotonically increasing CV accuracy. The measured timings cover an entire five-fold run and depend on hardware and runtime conditions.

## Một cây và cả rừng: kiểm trên cùng dữ liệu (ngoài slide)

| Mô hình | Accuracy fit toàn development | CV mean | CV std |
|---|---|---|---|
| Tree không giới hạn | 1.000000 | 0.860000 | 0.034319 |
| Forest 100 cây | 1.000000 | 0.876667 | 0.032660 |
| Tree depth=5 của bài trước | 0.943333 | 0.890000 | 0.032660 |

Forest hơn cây không giới hạn về CV ở thí nghiệm này, nhưng **cây depth=5 có CV cao hơn forest mặc định đã thử**. Không kết luận forest luôn thắng, không chọn họ mô hình bằng test. Tối ưu cả hai họ trên development có thể cho kết quả khác.

Để xem độ dao động khi thay dữ liệu train, code tách riêng 225 dòng base/75 dòng probe **từ development**, seed17. Mười lần lấy bootstrap 225 lượt từ base, fit Tree/Forest trên cùng lượt rút, seed0…9, đo trên probe cố định. Tree đạt mean **0.806667**, std **0.027487**; Forest đạt mean **0.850667**, std **0.026533**. Giảm std ở đây khá nhỏ; đây là chẩn đoán trên một probe cố định, không là chứng minh phổ quát hay mười test độc lập.

![Xác suất và ranh giới của một cây so với forest 100 cây](/plots/random-forest-boundaries.png)

[Mở hình ranh giới ở độ phân giải gốc](/plots/random-forest-boundaries.png).

Hình dùng cùng development. Màu là P(class1), đường đỏ là mức 0.5. Trung bình nhiều cây làm xác suất đổi theo mức nhỏ hơn, biên nhìn bớt răng cưa ở một số vùng. Forest vẫn là tổ hợp các vùng bậc thang theo trục; **không phải hàm trơn giải tích**, cũng không bảo đảm mọi đoạn biên đều đẹp hơn.

**Bias** là sai lệch có hệ thống của cách học; **variance** là độ đổi dự đoán khi thay tập train. Lấy trung bình cây đa dạng thường giảm variance so với một cây sâu. Bias có thể thay đổi theo sampling, feature và độ sâu; không khẳng định giữ nguyên tuyệt đối. Sẽ học kỹ bias–variance ở phần Error in ML sau này, chưa có bài riêng để liên kết.

> **EN:** Forest averaging often reduces the variance of deep trees, but bias need not remain exactly unchanged. In this demonstration a tuned shallow tree has a higher CV mean than the tested forest. Averaged tree probability surfaces remain piecewise constant, even when they look visually smoother.

## Code thí nghiệm đầy đủ và feature importance (ngoài slide)

Code độc lập dùng NumPy 2.5.4, sklearn 1.9.1, matplotlib. Chạy tuần tự để so thời gian; không cần cài Graphviz. `n_jobs=1` giữ điều kiện đo, có thể đổi `n_jobs` để song song hóa khi dùng thật. Không dùng scale ở đây; xem [[bài:feature-scaling]], [[bài:categorical-encoding]], [[bài:missing-values-outliers]] cho input bảng thật.

```python
from pathlib import Path
from time import perf_counter
import numpy as np
import sklearn
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report

out = Path("tree_forest_output")
out.mkdir(exist_ok=True)
print("Versions:", np.__version__, sklearn.__version__)
X, y = make_moons(n_samples=400, noise=0.3, random_state=42)
X_dev, X_test, y_dev, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
rows = []
for n in [1, 5, 25, 100, 300]:
    candidate = RandomForestClassifier(
        n_estimators=n, max_features="sqrt", random_state=42, n_jobs=1)
    start = perf_counter()
    scores = cross_validate(candidate, X_dev, y_dev, cv=cv,
                            scoring="accuracy", return_train_score=True, n_jobs=1)
    elapsed = perf_counter() - start
    rows.append((n, scores["train_score"].mean(), scores["test_score"].mean(),
                 scores["test_score"].std(ddof=0), elapsed))
print("n, CV train mean, CV validation mean, std, seconds")
for row in rows:
    print(row)
# Equal mean: first entry wins, so prefer 100 over 300 in this grid.
best_n = max(rows, key=lambda row: row[2])[0]
forest = RandomForestClassifier(n_estimators=best_n, max_features="sqrt",
    bootstrap=True, oob_score=True, random_state=42, n_jobs=1)
forest.fit(X_dev, y_dev)
tree = DecisionTreeClassifier(random_state=42).fit(X_dev, y_dev)
tree_cv = cross_validate(DecisionTreeClassifier(random_state=42),
    X_dev, y_dev, cv=cv, scoring="accuracy", n_jobs=1)["test_score"]
print("Tree full train / CV mean / std:", tree.score(X_dev, y_dev),
      tree_cv.mean(), tree_cv.std(ddof=0))
print("Forest full train / OOB:", forest.score(X_dev, y_dev), forest.oob_score_)
defaults = RandomForestClassifier().get_params()
print("Defaults:", {k: defaults[k] for k in ["max_features", "bootstrap", "max_samples"]})
print("First tree candidate count:", forest.estimators_[0].max_features_)
print("First tree features (-2 marks leaves):",
      np.unique(forest.estimators_[0].tree_.feature))

# Diagnostic only: both base and probe come from development, never final test.
X_base, X_probe, y_base, y_probe = train_test_split(
    X_dev, y_dev, test_size=0.25, stratify=y_dev, random_state=17)
stability = []
for seed in range(10):
    idx = np.random.default_rng(seed).integers(0, len(X_base), size=len(X_base))
    single = DecisionTreeClassifier(random_state=seed).fit(X_base[idx], y_base[idx])
    bag = RandomForestClassifier(n_estimators=100, random_state=seed, n_jobs=1)
    bag.fit(X_base[idx], y_base[idx])
    stability.append([single.score(X_probe, y_probe), bag.score(X_probe, y_probe)])
stability = np.array(stability)
print("Fixed development probe, tree/forest rows:", stability)
print("Probe mean/std:", stability.mean(axis=0), stability.std(axis=0, ddof=0))

gx, gy = np.meshgrid(np.linspace(X_dev[:, 0].min()-0.4, X_dev[:, 0].max()+0.4, 260),
                     np.linspace(X_dev[:, 1].min()-0.4, X_dev[:, 1].max()+0.4, 220))
grid = np.c_[gx.ravel(), gy.ravel()]
fig, axes = plt.subplots(1, 2, figsize=(12, 5), sharex=True, sharey=True)
for ax, model, title in zip(axes, [tree, forest], ["Unlimited tree", "Forest: 100 trees"]):
    z = model.predict_proba(grid)[:, 1].reshape(gx.shape)
    surface = ax.contourf(gx, gy, z, levels=np.linspace(0, 1, 11), cmap="GnBu", vmin=0, vmax=1)
    ax.contour(gx, gy, z, levels=[0.5], colors="#b94b38", linewidths=1.3)
    ax.scatter(*X_dev.T, c=y_dev, cmap="GnBu", vmin=0, vmax=1,
               edgecolor="#31434a", linewidth=0.3, s=13)
    ax.set(title=title, xlabel="x1", ylabel="x2", aspect="equal")
fig.colorbar(surface, ax=axes.tolist(), label="P(class 1)", shrink=0.75)
fig.savefig(out / "random-forest-boundaries.png", dpi=170, bbox_inches="tight")
plt.close(fig)
print("Impurity importances:", forest.feature_importances_)
fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(["x1", "x2"], forest.feature_importances_, color=["#487a87", "#8b9e5b"])
ax.set(ylabel="Normalized impurity decrease", ylim=(0, 0.65),
       title="Forest impurity importance (not causal effects)")
for i, value in enumerate(forest.feature_importances_):
    ax.text(i, value+0.015, f"{value:.6f}", ha="center")
fig.tight_layout()
fig.savefig(out / "random-forest-importance.png", dpi=170)
plt.close(fig)

# Final evaluation only after choosing the forest configuration on development.
pred = forest.predict(X_test)
mean_tree_proba = np.mean([t.predict_proba(X_test) for t in forest.estimators_], axis=0)
assert np.allclose(mean_tree_proba, forest.predict_proba(X_test))
print("Test accuracy:", forest.score(X_test, y_test))
print(confusion_matrix(y_test, pred))
print(classification_report(y_test, pred, digits=6, zero_division=0))
```

Kết quả forest100: train **1.0**, OOB **0.883333**, test **0.90**; confusion matrix theo hàng nhãn thật 0/1, cột dự đoán 0/1 là **[[45,5],[5,45]]**. Mỗi class có 50 mẫu, precision/recall/F1 đều **0.90**. OOB chỉ dùng các cây bỏ sót mỗi dòng, còn CV fit lại từng fold và test dùng các dòng giữ riêng; ba số có quy trình khác nhau nên không bắt buộc bằng nhau. Xem [[bài:confusion-matrix]] và [[bài:classification-metrics]]. Đây là đánh giá minh họa sau lựa chọn forest, không dùng test để đổi sang họ model khác.

![Feature importance dựa trên giảm impurity của forest](/plots/random-forest-importance.png)

[Mở biểu đồ importance ở độ phân giải gốc](/plots/random-forest-importance.png).

Importance là tổng giảm impurity có trọng số do feature tạo ra, chuẩn hóa trong cây và tổng hợp qua các cây. Demo có **[0.463064,0.536936]** cho x1/x2. Đây không phải “x2 giải thích 53.7% hiện tượng thật”. Feature nhiều giá trị/ngưỡng có thể được ưu ái; feature tương quan chia sẻ/thay thế thông tin nên importance một cột có thể thấp dù hữu ích. Nối [[bài:correlation-multicollinearity]]. **Permutation importance** đo giảm điểm khi xáo một cột trên dữ liệu đánh giá phù hợp là một cách kiểm thêm, nhưng cũng cần thận trọng với tương quan.

> **EN:** Impurity importance summarizes split-related reductions, not causal effects. High-cardinality features and correlated predictors complicate its interpretation. OOB, CV and final-test scores estimate performance through different procedures and need not coincide.

## Khi nên thử, khi phải dè chừng (ngoài slide)

Forest thường là baseline hữu ích cho dữ liệu bảng, bắt tương tác mà ít cần scale. Vẫn phải [[bài:categorical-encoding|mã hóa dữ liệu chữ]] phù hợp, kiểm [[bài:missing-values-outliers|missing/outlier]], giữ preprocessing trong fold, bảo đảm mọi feature có sẵn tại lúc dự đoán. `class_weight='balanced'` là cấu hình có thể thử cho [[bài:imbalanced-data]], nhưng phải đo metric theo chi phí chứ không tin accuracy tổng.

Forest nặng hơn một cây: nhiều cấu trúc phải lưu và nhiều đường đi phải duyệt. `n_jobs` có thể song song hóa một số công việc, không xóa chi phí tài nguyên. Forest hồi quy trung bình các mean lá; với cấu hình squared_error thông thường, dự đoán vẫn nằm trong khoảng target train, không tự kéo dài trend ngoài miền feature. Nối [[bài:regression-metrics]].

**Gradient Boosting**, gồm những triển khai như XGBoost/LightGBM, là họ khác: mô hình con được xây nối tiếp để cải thiện objective hiện tại; RF tạo các cây ngẫu nhiên rồi lấy trung bình. Chỉ giới thiệu tên ngoài slide, chưa học thuật toán boosting.

:::compare Tree và Forest: không có người thắng mọi dataset
| Tiêu chí | Decision Tree | Random Forest |
|---|---|---|
| Chất lượng mới | Cây sâu dễ variance cao; cây đã tune có thể tốt | Thường giảm variance; vẫn phải kiểm CV |
| Giải thích | Cây nhỏ đọc đường đi rõ | Nhiều cây khó chuyển thành vài luật chung |
| Train/predict/RAM | Thường gọn hơn forest cùng loại cây | Tăng theo số cây và kích thước cây |
| Tinh chỉnh | Depth, leaf size, pruning | Thêm số cây, max_features, bootstrap/max_samples |
| Scale | Thường không cần | Thường không cần |
:::

:::compare Sáu nhóm đã học: Linear và Polynomial gộp một hàng
| Nhóm | Bài toán đã minh họa | Scale | Giải thích / lúc nên thử |
|---|---|---|---|
| [[bài:linear-regression|Linear]] / [[bài:polynomial-regression|Polynomial]] | Hồi quy | Hữu ích cho tối ưu/penalty; chú ý đa thức | Hệ số theo feature; baseline quan hệ đơn giản/cong |
| [[bài:logistic-regression|Logistic]] | Phân loại | Quan trọng với penalty | Log-odds, baseline xác suất và biên tuyến tính |
| [[bài:svm|SVM]] | Phân loại; có SVR | Quan trọng | Margin/kernel; thử khi hình học thích hợp, kiểm chi phí |
| [[bài:k-nearest-neighbours|KNN]] | Phân loại; có hồi quy | Quan trọng | Dựa mẫu gần; thử khi khoảng cách có nghĩa |
| [[bài:decision-tree|Tree]] | Cả hai | Thường không cần | Luật cây nhỏ, tương tác/phi tuyến trên bảng |
| Random Forest | Cả hai | Thường không cần | Baseline bảng với nhiều cây, đổi RAM/độ rõ lấy ổn định |
:::

Bảng có **sáu nhóm, bảy tên mô hình** vì gộp Linear/Polynomial. Slide 64 còn liệt kê Naive Bayes nhưng không có slide riêng trong 64–80, nên chưa có bài Naive Bayes; “xong phần supervised của slide 64–80” không nghĩa đã học mọi thuật toán supervised tồn tại.

> **EN:** Forests are useful tabular baselines, with costs in memory, latency and global interpretability. Model choice remains data- and validation-dependent. Boosting is a different sequential ensemble family. The summary groups Linear and Polynomial Regression into one row.

## Những hiểu sai cần chặn (ngoài slide)

:::pitfall Nhiều cây bảo đảm không overfit
Rừng vẫn có thể học nhiễu hoặc feature rò rỉ. Thêm cây không chữa một cột chứa kết quả tương lai; kiểm feature/split, depth/leaf size và CV trước khi tăng n_estimators.
:::

:::pitfall Bootstrap là 70% dòng khác nhau; mỗi cây chỉ có một bộ feature cố định
Mặc định N lượt có hoàn lại, kỳ vọng khoảng 63.2% dòng khác nhau khi N lớn. Feature được lấy lại ở từng nút; demo mỗi nút xét một feature nhưng một cây vẫn có thể dùng cả hai cột.
:::

:::pitfall OOB miễn phí nên bỏ test và tune thoải mái
OOB có chi phí và có thể bị tiền xử lý/selection làm thiên lệch; tune lặp cũng dùng thông tin đánh giá. Giữ test cuối, dùng CV cho quy trình và split đúng thời gian/nhóm nếu cần, không chỉ dựa stratify khi dữ liệu phụ thuộc.
:::

:::pitfall Importance là nhân quả; forest giải thích như một cây nhỏ
Importance cao chỉ mô tả thống kê model đã học. Khi nghiệp vụ cần từng luật ngắn, cân nhắc cây nhỏ/baseline diễn giải được và đo độ đánh đổi; không biến hàng trăm cây thành một “lý do” duy nhất từ biểu đồ importance.
:::

:::pitfall Nhãn cây vote ra sao thì sklearn luôn ra vậy; forest hồi quy ngoại suy trend
Sklearn trung bình xác suất nên ba nhãn A,A,B có thể vẫn cho B. Hồi quy trung bình mean lá không kéo dài đường xu hướng ra ngoài miền; cả hai nhầm lẫn đều cần kiểm cơ chế dự đoán thật.
:::

> **EN:** More trees cannot repair leakage, biased validation or invalid inputs. OOB is not a substitute for final testing, impurity importance is not causal, probability averaging differs from hard voting, and regression forests do not extend a learned trend beyond the observed range.

Nguồn ngoài slide: [Forests of randomized trees](https://scikit-learn.org/stable/modules/ensemble.html#forest), [RandomForestClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html), [Permutation importance](https://scikit-learn.org/stable/modules/permutation_importance.html).

## Tóm tắt 1 phút

:::recap
- RF kết hợp cây đa dạng để thường giảm variance; không hứa accuracy luôn cao hơn cây đã tune.
- Bootstrap mặc định N lượt có hoàn lại; khoảng 63.2% dòng khác nhau là kỳ vọng giới hạn.
- max_features chọn feature ứng viên từng split; không cố định một bộ feature suốt cây.
- Slide dùng hard voting; sklearn classifier trung bình xác suất, hồi quy trung bình số.
- OOB của một dòng chỉ dùng cây không từng rút dòng đó; vẫn giữ test cuối.
- Chọn n_estimators/depth/feature bằng development, cân bằng chất lượng và chi phí.
- Impurity importance có thiên vị và không là nhân quả; forest vẫn cần input hợp lệ/chống leakage.
- Supervised trong phạm vi slide 64–80 kết thúc; slide 81 chuyển sang Unsupervised.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Theo hard vote, A,A,B ra class nào? Với bảy phiếu A,B,A,A,B,A,B thì sao?
A: **Đều ra A.** Lần đầu A thắng 2/3, lần sau 4/7; đó là đếm nhãn cứng. Ví dụ sklearn trung bình xác suất có thể cho kết quả khác, nên cần biết phiếu đang là nhãn hay phân bố xác suất.
Q: Ba cây có P(A)=0.51,0.51,0.01. Sklearn forest chọn class nào?
A: **B.** Trung bình P(A)=1.03/3≈0.343333, P(B)≈0.656667; sklearn chọn xác suất trung bình lớn nhất. Đây là phản ví dụ với hard vote A,A,B, không phải lỗi bỏ phiếu của thư viện.
Q: Bootstrap mười lượt trong bài bỏ sót mẫu nào? Tỉ lệ kỳ vọng OOB của một dòng là bao nhiêu?
A: **Bỏ sót 2,4,6,10; kỳ vọng OOB của mỗi dòng là 0.9¹⁰≈0.348678.** Bộ rút thực có bốn OOB, còn kỳ vọng số OOB là khoảng 3.486784; số thực hiện không cần bằng kỳ vọng. Có hoàn lại nên 10 lượt chỉ chứa 6 dòng khác nhau trong lần rút này.
Q: Vì sao max_samples=0.7 không nghĩa mỗi cây thấy 70% dòng khác nhau?
A: **Vì đó là số lượt rút có hoàn lại, có thể trùng dòng.** Khi N lớn, 0.7N lượt cho tỉ lệ khác nhau kỳ vọng khoảng 1−exp(−0.7)=0.503415. Ví dụ hai lượt cùng rút một dòng chỉ tăng số lượt, không tăng số dòng khác nhau.
Q: Theo bảng CV, chọn 100 hay 300 cây?
A: **Chọn 100 trong lưới này khi ưu tiên rẻ hơn ở cùng CV mean.** Cả hai đạt 0.876667, lần đo 100 cây khoảng 1.773 giây so với 5.248 giây cho 300; std fold khác nhau không đủ để tuyên bố một mô hình chắc chắn tốt hơn. Không mở test để phá hòa.
Q: Năm cây độc lập đều đúng 70% có đa số đúng bao nhiêu? Điều kiện nào dễ sai trong forest thật?
A: **0.83692, với giả định độc lập cùng p=0.7.** Cộng ba trường hợp đúng 3/4/5 cây được 0.3087+0.36015+0.16807. Forest dùng cùng nguồn dữ liệu nên lỗi có tương quan; không dùng con số này làm lời hứa accuracy thực tế.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** How does Random Forest work?
A: **Kết hợp nhiều cây tạo bởi bootstrap và feature sampling từng split.** Mỗi cây học trên mẫu có hoàn lại; classifier sklearn trung bình xác suất rồi chọn class, regressor trung bình dự đoán số. Ví dụ A,A,B trên slide là hard vote minh họa, không mô tả đầy đủ soft vote của sklearn.
EN: Random Forest combines trees trained with bootstrap samples and random feature candidates at each split. Scikit-learn averages class probabilities for classification and numerical predictions for regression.
Q: **B2.** Why does Random Forest train each tree on a random subset?
A: **Để các cây có lỗi bớt giống nhau, giúp trung bình giảm variance.** Cùng dữ liệu/feature/quy tắc có thể cho các cây trùng nhau; bootstrap đổi trọng lượng mẫu, feature sampling đổi ứng viên split. Ví dụ năm bản sao luôn sai cùng lúc vẫn chỉ đúng 70%, không đạt 83.692% của giả định độc lập.
EN: Randomized samples and split candidates encourage diversity and reduce error correlation. Averaging near-identical trees offers little variance reduction; a bootstrap sample contains repeated rows rather than a simple distinct subset.
Q: **B3.** What are bagging and out-of-bag error?
A: **Bagging gộp model học trên bootstrap; OOB dùng các cây bỏ sót dòng cần đánh giá.** Với N lượt từ N dòng, xác suất một dòng OOB là (1−1/N)^N, tiến tới 1/e. Ví dụ mẫu 2 không xuất hiện trong bộ rút minh họa nên có thể được cây ấy dự đoán OOB; test cuối vẫn giữ riêng.
EN: Bagging aggregates models fitted to bootstrap samples. An OOB prediction uses only models whose bootstrap samples omitted that row; it is useful internal evaluation but does not automatically validate preprocessing or replace final testing.
Q: **B4.** How does Random Forest reduce overfitting compared with a single tree?
A: **Chủ yếu giảm variance bằng trung bình các cây đa dạng.** Tương quan cao giới hạn lợi ích; bias không nhất thiết giữ nguyên và thêm cây không chữa leakage. Ví dụ demo RF hơn cây không giới hạn về CV nhưng vẫn thua cây depth=5 đã tune, nên không tuyên bố luôn thắng.
EN: Averaging diverse trees primarily reduces variance relative to a deep individual tree. Correlated errors, bias, noisy labels and leakage remain limitations, so better generalization is empirical rather than guaranteed.
Q: **B5.** Random Forest vs Gradient Boosting?
A: **RF tạo các cây ngẫu nhiên để gộp, boosting xây mô hình nối tiếp nhằm cải thiện objective hiện tại.** Hai họ khác cơ chế; hiệu quả phụ thuộc dữ liệu và tuning. Ví dụ XGBoost/LightGBM là những triển khai boosting sẽ học sau, không phải tên khác của RF.
EN: Random Forest aggregates randomized trees, whereas gradient boosting sequentially adds models to improve a current objective. They are different ensemble families and neither universally dominates.
Q: **B6.** How do you obtain feature importance and what are its pitfalls?
A: **Đọc feature_importances_ để có importance dựa trên giảm impurity, rồi kiểm giới hạn.** Nhiều ngưỡng có thể được ưu ái, feature tương quan chia sẻ thông tin; permutation importance là kiểm bổ sung trên tập phù hợp. Ví dụ x2≈0.536936 trong demo không nghĩa can thiệp x2 gây 53.7% thay đổi kết quả thật.
EN: Impurity-based importance summarizes normalized split reductions across trees. High cardinality, correlated predictors and noncausal associations complicate interpretation; permutation importance can provide a complementary evaluation.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Cần baseline churn trên bảng khách hàng có nhiều category. Bạn bắt đầu thế nào?
A: **Thử RF cùng baseline đơn giản trong pipeline được validation đúng.** Xác định thời điểm dự đoán, encode/impute trong fold, chọn metric theo chi phí giữ khách, kiểm class lệch và thời gian/khách lặp. Ví dụ “ngày hủy hợp đồng” biết sau churn phải bỏ; OOB cao không cứu feature rò rỉ nhãn.
WANT: Dùng RF như baseline có kiểm chứng, xử lý tính sẵn có của feature, categorical, leakage và split phù hợp nghiệp vụ.
Q: **C2.** Forest vượt giới hạn RAM và latency. Có chỉ tăng n_jobs không?
A: **Đo bottleneck rồi giảm độ phức tạp với kiểm tra chất lượng.** Thử ít cây hơn, depth/leaf size phù hợp và đo lại CV/latency/RAM ở môi trường đích; song song hóa không giảm số cây lưu. Ví dụ bảng này 100 và 300 cùng CV mean nên 100 đáng thử; distillation là một hướng khác chỉ nêu tên khi cần, không tự triển khai khi chưa đo.
WANT: Cân đối chất lượng và tài nguyên qua phép đo thực, không coi song song hóa là cách xóa chi phí mô hình.
Q: **C3.** Nghiệp vụ muốn biết yếu tố nào “gây” churn từ importance. Bạn trả lời sao?
A: **Biểu đồ importance mô tả model, chưa chứng minh nguyên nhân.** Kiểm feature nhiều mức, tương quan, độ ổn định và leakage; bổ sung permutation trên dữ liệu phù hợp rồi giải thích giới hạn. Ví dụ hai biến hoạt động gần trùng nhau chia importance, không thể kết luận biến ít điểm là vô dụng hay can thiệp biến cao điểm sẽ giảm churn.
WANT: Phân biệt liên hệ dự đoán với nhân quả; giải thích thiên vị importance và kế hoạch kiểm chứng cho người dùng nghiệp vụ.
Q: **C4.** Forest fraud accuracy cao, OOB đẹp nhưng bỏ sót giao dịch rủi ro. Sửa gì?
A: **Chọn mục tiêu lỗi và quy trình đánh giá đúng trước khi tăng số cây.** Đọc confusion matrix/recall/precision theo thời gian, so class đa số, kiểm stratify khi phù hợp và thử class_weight trên development. Ví dụ cột xác nhận gian lận có sau điều tra gây leakage; giữ test cuối và kiểm threshold/chi phí trên validation thay vì tối ưu accuracy tổng.
WANT: Chẩn đoán mất cân bằng, leakage và metric; hiểu OOB hay nhiều cây không thay được thiết kế đánh giá.
:::

## Nối sang phần sau

:::next
Module Supervised kết thúc phạm vi slide 64–80 tại đây. [[slide:81]] mở **Unsupervised Learning**, minh họa Before/After K-Means: các mô hình supervised vừa học cần label khi huấn luyện, còn K-Means tìm nhóm không dùng label làm đáp án học. Phần đó thuộc module 03, chưa viết bài nên chưa có liên kết bài học. Có thể quay về [[bài:supervised-algorithms]] để ôn bản đồ hoặc [[bài:decision-tree]] để đọc lại nền tảng từng cây.
:::
