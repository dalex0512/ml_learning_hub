---
title: K láng giềng gần nhất (K-Nearest Neighbours — KNN)
order: 6
description: "KNN (slide 75): đo khoảng cách, lấy K gần nhất, bỏ phiếu; chọn K và scale đo trên Diabetes; lazy learner."
slides: 75
needs: [feature-scaling, train-test-split, k-fold-cross-validation, classification-metrics, logistic-regression]
tags: [knn, k-nearest-neighbours, lazy-learning, distance, euclidean, curse-of-dimensionality, classification, instance-based]
---

## Không học một đường, chỉ hỏi những người gần nhất?

:::intro Mục tiêu bài này
- Hiểu ba bước của KNN: **đo khoảng cách, lấy K hàng xóm gần nhất, bỏ phiếu** (slide 75).
- Thấy **K** và **thang đo** đổi dự đoán thế nào, bằng số đo thật trên Diabetes.
- Hiểu KNN là **lazy learner**: gần như không học, mọi công sức nằm ở lúc dự đoán.
:::

## Đọc slide 75

:::slides 75 | Slide 75: K-Nearest Neighbour, trước và sau khi chạy K-NN
:::

Hình trái ("Before K-NN"): hai nhóm, **Category A** (chấm xanh lục, dưới trái) và **Category B** (chấm cam, trên phải), cùng một **new data point** (chấm xanh dương) chưa có nhãn, nằm gần nhóm A. Mũi tên "K-NN" dẫn sang hình phải ("After K-NN"): điểm mới được gán vào nhóm gần nó nhất (slide ghi "Category 1", tức nhóm xanh lục A) và đổi thành màu của nhóm đó.

Bạn vừa chuyển đến khu mới và muốn đoán một quán thuộc nhóm giá rẻ hay đắt: hỏi **K quán gần nhất** rồi lấy nhóm đông nhất. KNN làm đúng vậy: để đoán một mẫu mới, nó tìm **K mẫu đã biết nhãn gần nhất** (theo khoảng cách) và cho họ bỏ phiếu. Không có đường hay trọng số nào được học.

## Tính tay một dự đoán

:::steps
Điểm cần đoán q = (4, 4). Năm mẫu đã biết: P1 (4, 5) lớp 0; P2 (6, 4) lớp 1; P3 (4, 1.5) lớp 1; P4 (0.5, 4) lớp 0; P5 (8, 4) lớp 1.
@step
**Đo khoảng cách Euclid** từ q (căn của tổng bình phương độ lệch): P1 = **1**, P2 = **2**, P3 = **2.5**, P4 = **3.5**, P5 = **4**.
@step
**K = 1:** hàng xóm gần nhất là P1 (lớp 0), nên đoán **lớp 0**.
@step
**K = 3:** ba gần nhất là P1 (0), P2 (1), P3 (1): lớp 1 có 2 phiếu, lớp 0 có 1 phiếu, nên đoán **lớp 1**.
@step
**K = 5:** lớp 1 có P2, P3, P5 (3 phiếu), lớp 0 có P1, P4 (2 phiếu): đoán **lớp 1**. Đổi K từ 1 lên 3 đã **đổi lớp dự đoán**.
:::

:::predict
Một cột có thang 0 đến 1000, một cột có thang 0 đến 10. Lớp chỉ phụ thuộc vào cột thang nhỏ. Nếu **không scale**, KNN sẽ chọn hàng xóm theo cột nào?
@answer
Gần như **chỉ theo cột thang lớn** (nhiễu), vì chênh lệch của nó (hàng trăm) át chênh lệch của cột thang nhỏ (vài đơn vị) trong khoảng cách. Hàng xóm "gần nhất" khi đó thật ra là gần nhất theo nhiễu, nên dự đoán lung tung. Hãy thử ngay bên dưới.
:::

:::widget knn-play
:::

## Số thật trên Diabetes: chọn K và scale

Cùng một bảng 768 hàng; CV 5-fold có phân tầng (`random_state=42`); "train" đo trên 614 mẫu train (chia 80/20). Thang các cột rất khác nhau: Insulin 0 đến 846, còn DiabetesPedigreeFunction chỉ 0.1 đến 2.4.

| K | Train | CV (có scale) | CV (không scale) |
|---|---|---|---|
| 1 | **1.000** | 0.704 | 0.680 |
| 3 | 0.863 | 0.721 | 0.695 |
| 5 | 0.806 | 0.728 | 0.698 |
| 9 | 0.801 | 0.747 | 0.740 |
| 15 | 0.792 | 0.749 | **0.752** |
| 25 | 0.770 | 0.741 | 0.745 |
| 51 | 0.764 | **0.760** | 0.732 |

Đọc: **K = 1 có train 1.000** (mỗi mẫu là hàng xóm của chính nó) nhưng CV chỉ 0.704: học thuộc. K tăng thì train giảm dần còn CV tăng, rồi cả hai tiến lại gần nhau: K lớn **mượt hơn**. Scale giúp rõ ở K nhỏ (K = 5: 0.728 so với 0.698) nhưng không đều ở mọi K (K = 15 không scale lại nhỉnh hơn), vì Insulin và Glucose vừa to thang vừa liên quan tới nhãn. Chênh lệch dưới 0.02 giữa các cấu hình gần nhau chưa đủ kết luận. Quy trình đúng: chọn K bằng CV, đặt scaler trong Pipeline ([[bài:feature-scaling]], [[bài:k-fold-cross-validation]]).

:::ck
Bạn chọn K bằng cách thử K = 1 đến 30 và lấy K có điểm cao nhất **trên tập train**. Vì sao sai, và K nào sẽ thắng?
@answer
**K = 1 sẽ thắng** (100% trên train, mỗi mẫu là hàng xóm của chính nó), nhưng đó là học thuộc (CV chỉ 0.704). Phải chọn K bằng điểm trên **validation hoặc cross-validation**.
:::

## K, thang đo và chi phí

- **K nhỏ:** nhạy nhiễu, ranh giới răng cưa. **K lớn:** mượt hơn, nhưng có thể bỏ lỡ chi tiết. Dùng K **lẻ** cho bài hai lớp để tránh hòa phiếu.
- **Phải scale:** thang đo quyết định ai là hàng xóm.
- **Lazy learning:** `fit` chỉ lưu dữ liệu; mỗi lần `predict` phải tính khoảng cách tới **mọi** mẫu, nên chậm và tốn bộ nhớ khi dữ liệu lớn.
- **Nhiều feature không liên quan** làm mọi mẫu gần như cách đều nhau, hàng xóm kém ý nghĩa (curse of dimensionality).
- KNN cũng làm hồi quy: lấy **trung bình** target của K hàng xóm; nó **không ngoại suy** ngoài vùng dữ liệu.

## Thêm ba điều đáng thử: hòa phiếu, hồi quy, và nhiều feature nhiễu

**K chẵn có thể hòa, và có nhiều cách gỡ.** Lấy tám điểm train P1 (4, 4) lớp A, P2 (5, 4) B, P3 (4, 5) A, P4 (6, 4) B, P5 (4, 6) B, P6 (1, 2) A, P7 (7, 5) B, P8 (0, 3) B, và q = (4, 3). Khoảng cách tới q từ gần đến xa: 1, √2 ≈ 1.414, 2, √5 ≈ 2.236, 3, √10 ≈ 3.162, √13 ≈ 3.606, 4. Với K = 1, 3, 5 ta được A, A, B (đúng như ví dụ ở trên: đổi K đổi kết quả). Với **K = 4**, bốn láng giềng là A, B, A, B: hòa 2 đến 2. Mỗi cách gỡ là một quy tắc khác nhau, nên chọn trước và kiểm trên validation, không sửa theo đáp án test:

| Cách gỡ | Phép tính | Kết quả |
|---|---|---|
| Tăng K lên 5 | thêm P5 thuộc B: A = 2, B = 3 | B |
| Lấy lớp của láng giềng gần nhất | P1 cách 1, thuộc A | A |
| Khoảng cách trung bình từng lớp | A: (1 + 2)/2 = 1.5; B: (√2 + √5)/2 ≈ 1.825 | A gần hơn |
| Vote trọng số nghịch đảo khoảng cách (`weights="distance"`) | A: 1/1 + 1/2 = 1.5; B: 1/√2 + 1/√5 ≈ 1.154 | A nhiều trọng số hơn |

Với đúng hai lớp và vote đều, K lẻ không thể hòa; K chẵn **có thể** hòa. Với ba lớp trở lên, ngay cả K lẻ vẫn có thể hòa (ví dụ K = 3 với ba lớp mỗi lớp một phiếu).

**KNN cũng làm hồi quy.** Thay vì vote, lấy **trung bình** target của K láng giềng. Train x = [1, 2, 4, 7, 10], target t = [10, 20, 40, 70, 100], K = 3. Query x = 3 có khoảng cách 2, 1, 1, 4, 7, nên ba láng giềng là x = 2, 4, 1 với target 20, 40, 10 và dự đoán là (20 + 40 + 10) / 3 = **23.33**. Query x = 20 (ngoài miền train) có ba láng giềng x = 10, 7, 4 với target 100, 70, 40, dự đoán (100 + 70 + 40) / 3 = **70**: vẫn nằm trong khoảng target train [10, 100]. Vì vậy KNN **không ngoại suy**, khác Linear Regression.

```python
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
x_reg = np.array([[1], [2], [4], [7], [10]], dtype=float)
t_reg = np.array([10, 20, 40, 70, 100], dtype=float)
reg = KNeighborsRegressor(n_neighbors=3, weights="uniform").fit(x_reg, t_reg)
print(reg.predict([[3], [20]]))     # [23.333  70.]
```

**Scale đổi ngay người hàng xóm gần nhất.** Ba người train: A (24 tuổi, 11 triệu), B (60 tuổi, 10 triệu), B (20 tuổi, 110 triệu); query 25 tuổi, 10 triệu. Khoảng cách thô tới query là 1 000 000, **35** và 100 000 000: gần nhất là người thứ hai (cách 35) vì **tiền át hết tuổi**, nên 1-NN trả **B**. Sau MinMax scale (scaler chỉ fit trên ba hàng train), khoảng cách là 0.027, 0.875 và 1.008: gần nhất là người thứ nhất, nên 1-NN trả **A**. Cùng dữ liệu, cùng K, chỉ đổi thang đo là đổi dự đoán.

**Nhiều feature nhiễu làm hàng xóm kém liên quan** (curse of dimensionality). Dữ liệu giả lập `make_moons(n_samples=400, noise=0.3, random_state=42)`, 300 mẫu development, K = 5, `StandardScaler` trong fold, thêm lần lượt 0, 10, 50, 100 cột nhiễu Gaussian độc lập:

| Số feature nhiễu thêm | Tổng số feature | CV accuracy |
|---|---|---|
| 0 | 2 | **0.850** |
| 10 | 12 | 0.740 |
| 50 | 52 | 0.583 |
| 100 | 102 | 0.600 |

Thêm nhiễu làm kết quả tụt rõ; từ 50 lên 100 cột lại tăng nhẹ nên **không khẳng định giảm đều từng bước**. Scale không xóa được feature vô ích: các cột nhiễu vẫn đóng góp vào khoảng cách, làm hai điểm "gần" theo nhãn lại xa nhau. Hệ quả thực hành: với KNN, chọn feature trước còn quan trọng hơn chọn K. Cũng đừng nhân đôi một cột: nó khiến cột đó bị đếm hai lần trong khoảng cách.

**Chọn K, weights và metric bằng CV rồi mới chạm test.** Trên Diabetes (chia 80/20 có phân tầng, CV 5-fold trong `Pipeline` có scaler):

```python
import pandas as pd
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
d = pd.read_csv("diabetes.csv")
X, y = d.drop(columns="Outcome"), d["Outcome"]
X_dev, X_test, y_dev, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
grid = {"kneighborsclassifier__n_neighbors": [1, 5, 15, 25, 51],
        "kneighborsclassifier__weights": ["uniform", "distance"],
        "kneighborsclassifier__metric": ["euclidean", "manhattan"]}
search = GridSearchCV(make_pipeline(StandardScaler(), KNeighborsClassifier()), grid, cv=cv).fit(X_dev, y_dev)
print(search.best_params_, round(search.best_score_, 3))   # K=25, weights=distance, manhattan; CV 0.762
print(round(search.score(X_test, y_test), 3))              # 0.753 trên test
```

Cấu hình thắng (K = 25, trọng số theo khoảng cách, khoảng cách Manhattan) có CV **0.762** và test **0.753**. Chênh lệch giữa các cấu hình lân cận thường nhỏ hơn độ lệch giữa các fold (khoảng 0.02), nên đừng diễn giải quá mức việc "manhattan thắng euclidean".

## Những hiểu sai thường gặp

- **"KNN học một mô hình."** Nó chỉ lưu dữ liệu; mọi tính toán nằm ở lúc dự đoán.
- **"K = 1 chính xác nhất vì train 100%."** Đó là học thuộc; CV chỉ 0.704.
- **"Khoảng cách không phụ thuộc đơn vị."** Phụ thuộc; không scale thì cột thang lớn át cột thang nhỏ.
- **"Đa số phiếu là chắc chắn."** K = 3 thắng 2 so với 1 không nói gì về độ chắc; đổi K có thể đổi lớp.
- **"Thêm feature luôn giúp KNN."** Feature nhiễu làm hàng xóm kém ý nghĩa.

:::card KNN
- **Ba bước:** đo khoảng cách, lấy K gần nhất, bỏ phiếu (trung bình cho hồi quy).
- **Đổi K có thể đổi lớp** (ví dụ K = 1 đoán 0, K = 3 đoán 1); chọn K bằng CV, không bằng train (K = 1 có train 1.000, CV 0.704).
- **Scale:** thang đo quyết định người hàng xóm (K = 5: 0.728 có scale so với 0.698 không scale).
- **Lazy:** `fit` chỉ lưu dữ liệu; `predict` chậm; nhiều feature nhiễu làm hàng xóm kém ý nghĩa.
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
Quay về [[bài:supervised-algorithms]] để so KNN với [[bài:logistic-regression]] và [[bài:svm]]. [[bài:decision-tree]] (slide 76–77) chuyển sang cây quyết định: cây có bước học các luật “nếu–thì”, thay vì dự đoán bằng khoảng cách tới tập train như KNN. Sau đó [[bài:random-forest]] kết hợp nhiều cây để giảm biến động.
:::
