---
title: Polynomial Regression — uốn đường cong bằng feature đa thức
order: 3
description: "Hồi quy đa thức (slide 67): thêm feature x², x³ để uốn đường thẳng; bậc cao giảm train nhưng test giảm rồi tăng, nên chọn bậc bằng validation."
slides: 67
needs: [linear-regression, loss-function, train-test-split, feature-scaling]
tags: [polynomial-regression, polynomial-features, overfitting, underfitting, degree, bias-variance, cross-validation]
---

## Khi đường thẳng bỏ sót hình dạng của dữ liệu

:::intro Mục tiêu bài này
- Hiểu cách **thêm feature** x², x³… để đường thẳng uốn thành đường cong mà vẫn dùng cách học cũ (slide 67).
- Thấy bằng số rằng bậc cao hơn luôn giảm sai số train nhưng **không** luôn giảm sai số test.
- Chọn bậc bằng sai số trên dữ liệu chưa thấy (validation hoặc CV), không bằng train.
:::

## Đọc slide 67

:::slides 67 | Slide 67: Polynomial Regression, đường cong qua các điểm và so sánh simple linear model với polynomial model
:::

Bên trái là dữ liệu có dạng "lõm xuống rồi đi lên": một đường thẳng không thể bám theo, còn một đường cong thì có. Bên phải so hai mô hình trên cùng đám điểm:

- **Simple linear model:** `y = b0 + b1·x`, một đường thẳng, lệch khỏi các điểm cong.
- **Polynomial model:** `y = b0 + b1·x + b2·x²`, một đường cong bám sát hơn.

Mẹo chỉ có một: **thêm cột mới x², x³… vào bảng feature**, rồi vẫn dùng hồi quy tuyến tính ([[bài:linear-regression]]). Mô hình vẫn **tuyến tính theo các hệ số** b, nhưng cong theo x. Bậc `d` là lũy thừa cao nhất; d = 1 là đường thẳng.

:::steps
Dữ liệu tự soạn đúng theo ŷ = 1 + 2x + x². Với bậc 2, sklearn tạo thêm cột x² cạnh cột x; cột 1 là intercept.
@step
Dự đoán tại x = 1.5: 1 + 2×1.5 + 1.5² = 1 + 3 + 2.25 = **6.25**.
@step
Mức tăng **không** cố định: từ x = 1 đến 2, ŷ đi từ 4 lên 9, tăng **5**, không phải tăng 2 như hệ số b1. Đó chính là điểm khác đường thẳng: độ dốc đổi theo vị trí.
@step
Số cột sinh ra: hai input với bậc 2 cho 5 cột (x1, x2, x1², x1x2, x2²); mười input với bậc 3 cho **285** cột. Vì vậy với nhiều biến chỉ nên dùng bậc thấp.
:::

## Tự thử: kéo bậc đa thức

:::predict
Ta có 10 điểm train (dạng sóng có nhiễu) và 9 điểm test chưa thấy. Khi tăng bậc từ 1 lên 9, sai số trên train sẽ thế nào? Sai số trên test có luôn giảm theo không?
@answer
Sai số **train luôn giảm** (đến 0 ở bậc 9, đường cong đi qua đúng 10 điểm). Nhưng sai số **test giảm rồi tăng vọt**: ở bậc 5 là thấp nhất, còn bậc 9 sai số test lên tới 0.79. Bậc cao uốn theo cả nhiễu ("học thuộc"), nên điểm train đẹp không có nghĩa là model tốt.
:::

:::widget poly-degree
:::

Với dữ liệu trong công cụ, RMSE (train / test) là:

| Bậc | Train | Test |
|---|---|---|
| 1 | 0.496 | 0.414 |
| 3 | 0.199 | 0.081 |
| 5 | 0.128 | **0.069** |
| 7 | 0.112 | 0.124 |
| 9 | **0.000** | 0.790 |

Train chỉ đi xuống; test chạm đáy ở **bậc 5** rồi tăng. Hai đầu mút là hai lỗi quen thuộc: bậc 1 **thiếu linh hoạt** (underfit, bỏ sót hình sóng) và bậc 9 **quá linh hoạt** (overfit, uốn theo cả nhiễu). Một chi tiết thú vị: bậc 2 cho kết quả y hệt bậc 1 và bậc 4 y hệt bậc 3, vì đường sin đối xứng nên các số hạng chẵn gần như không đóng góp; đừng giả định "tăng bậc đều đặn thì sai số giảm đều đặn".

## Chọn bậc cho đúng

- **Chọn bằng dữ liệu chưa thấy:** validation hoặc cross-validation ([[bài:k-fold-cross-validation]]), chọn bậc có sai số validation nhỏ nhất; test chỉ dùng một lần sau cùng.
- **Nội suy mọi điểm không chứng minh đã học đúng:** bậc 9 đi qua mọi điểm train nhưng dao động dữ dội giữa các điểm.
- **Scale:** x, x², x³… có thang rất khác nhau và tương quan mạnh với nhau, nên nên **scale** trước khi fit ([[bài:feature-scaling]]).
- **Gói trong Pipeline** để cả `PolynomialFeatures` và scaler chỉ fit trên train của mỗi fold:

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression
model = make_pipeline(PolynomialFeatures(degree=3, include_bias=False),
                      StandardScaler(), LinearRegression())
```

:::ck
Model bậc 9 có sai số train bằng 0. Đồng nghiệp bảo "model hoàn hảo". Bạn trả lời thế nào?
@answer
Sai số train bằng 0 chỉ chứng tỏ đường cong **đi qua mọi điểm đã thấy**, không chứng tỏ nó đúng với điểm mới. Hãy xem sai số trên dữ liệu chưa thấy: ở ví dụ này nó lên tới 0.79, tệ hơn cả đường thẳng (0.414). Đó là overfitting.
:::

## Code: Pipeline, validation, CV rồi mới đến test

Một thí nghiệm nhỏ có đáp án biết trước: dữ liệu thật sự là `y = 1 + 2x²` cộng nhiễu (80 mẫu). Quy trình đúng: giữ test từ đầu, chọn bậc bằng CV trên phần development, rồi refit và đo test **một lần**. `include_bias=False` bỏ cột hằng vì `LinearRegression` đã có intercept; `neg_mean_squared_error` trả **âm** MSE theo quy ước "điểm lớn hơn là tốt hơn" của sklearn.

```python
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.metrics import mean_squared_error

def make_model(degree):
    return make_pipeline(PolynomialFeatures(degree=degree, include_bias=False),
                         StandardScaler(), LinearRegression())

rng = np.random.default_rng(42)
X = rng.uniform(-1, 1, size=(80, 1))
y = 1 + 2 * X[:, 0]**2 + rng.normal(0, 0.2, size=80)
X_dev, X_test, y_dev, y_test = train_test_split(X, y, test_size=0.2, random_state=42)   # giữ test từ đầu
X_train, X_val, y_train, y_val = train_test_split(X_dev, y_dev, train_size=16, random_state=42)

degrees = [1, 2, 3, 5, 9]
for d in degrees:                      # chỉ 16 mẫu train để lộ rủi ro bậc cao
    m = make_model(d).fit(X_train, y_train)
    print(d, mean_squared_error(y_train, m.predict(X_train)), mean_squared_error(y_val, m.predict(X_val)))

cv = KFold(n_splits=5, shuffle=True, random_state=42)    # chọn bậc bằng CV trên 64 mẫu development
cv_mse = {d: -cross_val_score(make_model(d), X_dev, y_dev, cv=cv,
                              scoring="neg_mean_squared_error").mean() for d in degrees}
print(cv_mse)
best = min(cv_mse, key=cv_mse.get)
final = make_model(best).fit(X_dev, y_dev)
print("Chọn bậc", best, "| MSE test:", mean_squared_error(y_test, final.predict(X_test)))
```

Kết quả (đã chạy):

| Bậc | MSE train (16 mẫu) | MSE validation | MSE trung bình qua CV |
|---|---|---|---|
| 1 | 0.290760 | 0.326536 | 0.297014 |
| **2** | 0.011856 | **0.049132** | **0.038220** |
| 3 | 0.006578 | 0.057918 | 0.038337 |
| 5 | 0.006412 | 0.056852 | 0.039231 |
| 9 | **0.003912** | **17.742702** | 0.086073 |

Train luôn giảm theo bậc, validation lại **vọt lên 17.74** ở bậc 9. CV chọn **bậc 2** (đúng bậc của hàm thật, dù bậc 3 và 5 gần như ngang), refit trên 64 mẫu development, MSE trên test là **0.032951**. Khi chênh lệch CV nhỏ như vậy, hãy ưu tiên bậc thấp hơn cho đơn giản.

**Center và scale.** Với x = 1, …, 10, hai cột x và x² tương quan **0.9746**. Center x trước khi bình phương (z = x − trung bình) đưa tương quan giữa z và z² về **0.0**, nhưng chỉ vì bộ số này đối xứng; z² vẫn tính hoàn toàn từ z, nên "tương quan 0" không có nghĩa độc lập. Chỉ scale hai cột `[x, x²]` thì tương quan không đổi:

```python
x = np.arange(1, 11, dtype=float)
raw = np.column_stack([x, x**2])
z = x - x.mean()
print(np.corrcoef(raw, rowvar=False)[0, 1])                          # 0.9745586...
print(np.corrcoef(np.column_stack([z, z**2]), rowvar=False)[0, 1])   # 0.0
scaled = StandardScaler().fit_transform(raw)
assert np.isclose(np.corrcoef(scaled, rowvar=False)[0, 1], np.corrcoef(raw, rowvar=False)[0, 1])
```

## Những hiểu sai thường gặp

- **"Polynomial Regression là mô hình phi tuyến hoàn toàn khác."** Nó vẫn là hồi quy tuyến tính, trên các cột đã biến đổi.
- **"Bậc càng cao càng tốt."** Chỉ đúng trên train; test giảm rồi tăng.
- **"Train error bằng 0 là hoàn hảo."** Đó thường là dấu hiệu học thuộc.
- **"Đa thức ngoại suy tốt."** Ngoài miền dữ liệu, đường cong bậc cao thường vọt rất nhanh.
- **"Chọn bậc theo test cho nhanh."** Làm vậy test hết là dữ liệu chưa thấy; dùng validation/CV.

:::card Polynomial Regression
- **Thêm feature** x², x³… để uốn đường thẳng; vẫn là hồi quy tuyến tính trên các cột mới (slide 67: b0 + b1x + b2x²).
- **Bậc cao** luôn giảm sai số train; sai số test giảm rồi tăng (bậc 5 tốt nhất 0.069, bậc 9 test 0.79).
- **Chọn bậc bằng validation hoặc CV**, không bằng train.
- **Scale** các cột lũy thừa; nhiều biến thì số cột bùng nổ (10 input, bậc 3: 285 cột), chỉ dùng bậc thấp.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Với ŷ = 1+2x+x², tính prediction tại x = 1.5 và mức tăng khi x đi từ 1 tới 2.
A: **Prediction là 6.25, mức tăng là 5.** Tính 1.5² = 2.25 rồi 1+2×1.5+2.25 = 6.25. Tại 1 được 4, tại 2 được 9, chênh 9−4 = 5; không dùng b1 = 2 làm mức tăng ở mọi vị trí.
Q: Hai input, degree=2, include_bias=False sinh những cột nào? Mười input degree=3 thì bao nhiêu?
A: **Có 5 cột và 285 cột tương ứng.** Hai input tạo x1,x2,x1²,x1x2,x2². Mười input mở rộng đầy đủ tới tổng bậc 3 cho C(13,3)−1 = 286−1 = 285, không tính intercept.
Q: Đọc bảng train/validation trong bài: bậc nào nên chọn nếu chỉ có lần chia này? Vì sao không chọn 9?
A: **Chọn 2 theo validation trong bảng.** MSE validation 0.049132 thấp nhất; bậc 9 dù train 0.003912 lại validation 17.742702. Sau đó cần kiểm độ ổn định bằng CV và giữ test độc lập; không xem một split là chân lý chung.
Q: Vì sao ví dụ tay có MSE bậc hai bằng 0 còn đường thẳng là 2.8?
A: **Vì dữ liệu tự soạn đúng theo một đa thức bậc hai không nhiễu.** Bậc hai khớp y = 1+2x+x²; đường thẳng có residual 2,−1,−2,−1,2 nên SSE 14, MSE 14/5 = 2.8. Không suy ra MSE train 0 là mục tiêu chọn model thực tế.
Q: Center x = 1,…,10 rồi lấy bình phương cho corr bằng 0 có nghĩa z và z² độc lập không?
A: **Không.** Tương quan Pearson bằng 0 chỉ nói về quan hệ tuyến tính của hai cột này trên bộ số đối xứng; z² vẫn hoàn toàn tính được từ z. Chỉ scale [x,x²] cũng không làm corr 0.974559 biến mất.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Vì sao Polynomial Regression vẫn là linear model?
A: **Vì tuyến tính theo tham số, dù cong theo input.** Với feature φ(x) = [x,x²] (φ là tên phép biến đổi), prediction là intercept cộng các hệ số nhân feature; OLS vẫn tối ưu loss bình phương. Ví dụ b0+b1x+b2x² không có tích hay lũy thừa của b.
EN: Polynomial regression is linear in its fitted coefficients over a nonlinear feature map, so ordinary least squares still applies.
Q: **B2.** Bạn chọn bậc d như thế nào?
A: **Chọn bằng dữ liệu development, không bằng train error hoặc test.** So các bậc trên validation/CV với Pipeline fit trong mỗi fold, xem dao động và ưu tiên đơn giản nếu tương đương; refit cấu hình đã chốt rồi đo test. Ví dụ bảng này chọn 2 thay vì 9 dù 9 khớp train tốt hơn.
EN: Select degree through validation or cross-validation with preprocessing inside each fold, then refit and evaluate once on held-out test data.
Q: **B3.** Underfit/overfit thể hiện trên đường cong thế nào?
A: **Underfit bỏ sót hình dạng; overfit bám chi tiết riêng của train.** Đường thẳng có residual hình U gợi thiếu độ linh hoạt; đường bậc cao ngoằn ngoèo hoặc vọt biên gợi bất ổn. Xem cả validation vì chỉ nhìn một hình chưa chứng minh được overfit, ví dụ dữ liệu thật có thể vốn nhiều dao động.
EN: Underfitting misses systematic structure; overfitting follows sample-specific variation. Curve shape is diagnostic, but held-out errors are needed to assess generalization.
Q: **B4.** Polynomial khác Linear Regression trên feature gốc ở đâu?
A: **Khác không gian feature, không bắt buộc khác solver hoặc loss.** Polynomial thêm lũy thừa/tương tác để diễn tả cong, đổi lại số cột và rủi ro bất ổn tăng. Ví dụ hai input bậc hai tạo 5 cột, vẫn có thể fit bằng OLS như một model tuyến tính nhiều feature.
EN: Polynomial expansion changes the representation and model capacity while retaining the same least-squares fitting machinery.
Q: **B5.** StandardScaler có chữa đa cộng tuyến của feature đa thức không?
A: **Không bảo đảm, vì scale giữ Pearson correlation giữa các cột.** Nó giúp giảm khác biệt thang đo, còn center trước mở rộng có thể giảm một số tương quan do vị trí gốc. Ví dụ x = 1,…,10 có corr(x,x²) ≈ 0.974559 trước/sau scale; center rồi tạo z² cho corr 0 ở bộ số đối xứng, nhưng không xóa quan hệ hàm.
EN: Scaling improves relative magnitudes but preserves pairwise Pearson correlations. Centering before expansion can reduce some correlations without removing deterministic dependence or guaranteeing stability.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Dự báo doanh số theo nhiệt độ có hình chuông, team muốn tăng bậc tới khi train MSE bằng 0. Bạn đề xuất gì?
A: **Chọn độ linh hoạt bằng kiểm chứng ngoài train, không theo mục tiêu khớp hết điểm.** Vẽ dữ liệu/residual, thử bậc thấp như 2 bên cạnh baseline, chia theo thời gian vì dự báo tương lai; kiểm thêm mùa vụ/khuyến mại thay vì buộc nhiệt độ giải thích mọi thứ. Chọn bằng validation/CV phù hợp, xem miền nhiệt độ, giữ test cuối; đa thức có thể dự đoán doanh số âm ở đuôi nên cần giới hạn miền hoặc mô hình hợp lý hơn nếu xảy ra.
WANT: Nối hình dạng với thiết kế đánh giá và hiểu giới hạn nghiệp vụ, không tăng bậc để che biến còn thiếu.
Q: **C2.** Model giá nhà theo diện tích có đường cong bão hòa đẹp trên train. Có dùng để định giá biệt thự lớn gấp nhiều lần miền train không?
A: **Chưa có bằng chứng để ngoại suy như vậy.** Kiểm miền diện tích và phân khúc/khu vực, đo sai số theo nhóm, tìm dữ liệu đại diện cho nhà lớn; so mô hình đơn giản và cách biểu diễn phù hợp trên validation. Đa thức chỉ cong trong khoảng quan sát, không bảo đảm bão hòa ngoài miền; đánh dấu input ngoài phạm vi và có quy trình định giá thay thế trong lúc thiếu dữ liệu.
WANT: Hiểu khác biệt giữa mô tả đường cong trong mẫu và cam kết hành vi ngoài miền.
Q: **C3.** Model đa thức có R² train 0.99 nhưng tuần sau sai lớn. Bạn kiểm tra theo thứ tự nào?
A: **Kiểm cách đánh giá và miền dữ liệu trước khi đổi thuật toán.** Rà leakage, split thời gian và Pipeline; so validation theo thời gian với train để phát hiện bậc quá cao. Kiểm tuần mới có input vượt miền cũ, thay đổi mùa vụ/giá/nguồn dữ liệu hay outlier; ví dụ đuôi bậc 9 có thể vọt khi input ra ngoài vùng đã fit. Chọn lại bậc bằng development phù hợp, bổ sung dữ liệu đại diện và so baseline; không tune lặp trên test của tuần vừa báo cáo.
WANT: Có thứ tự chẩn đoán, phân biệt overfit, ngoại suy và drift, rồi sửa quy trình bằng dữ liệu kiểm chứng.
:::

## Nối sang bài sau

:::next
[[bài:supervised-algorithms]] đã có cả [[bài:linear-regression]] và bài Polynomial này cho target số. Slide kế tiếp, 68–69, chuyển sang [[bài:logistic-regression]]: cần mô hình cho phân loại bằng xác suất và ngưỡng thay vì uốn thêm đường dự đoán đại lượng.
:::
