---
title: Polynomial Regression — uốn đường cong bằng feature đa thức
order: 3
description: "Thêm feature x², x³ để uốn đường thẳng; bậc cao luôn giảm sai số train nhưng test giảm rồi tăng, nên chọn bậc bằng validation."
slides: 67
needs: [linear-regression, loss-function, train-test-split, feature-scaling]
tags: [polynomial-regression, polynomial-features, overfitting, underfitting, degree, bias-variance, cross-validation]
---

## Khi đường thẳng bỏ sót hình dạng của dữ liệu

:::intro Mục tiêu bài này
- Hiểu cách **thêm feature** x², x³… để đường thẳng uốn thành đường cong mà vẫn dùng cách học cũ.
- Thấy bằng số rằng bậc cao hơn luôn giảm sai số train nhưng **không** luôn giảm sai số test.
- Chọn bậc bằng sai số trên dữ liệu chưa thấy (validation hoặc CV), không bằng train.
:::

Dữ liệu có dạng sóng nhưng ta chỉ có đường thẳng: nó bỏ sót hình dạng. Mẹo của Polynomial Regression: **thêm cột mới x², x³… vào bảng feature**, rồi vẫn dùng hồi quy tuyến tính. Model là tuyến tính theo **các cột** (x, x², x³…) nhưng cong theo x. Bậc `d` là lũy thừa cao nhất; d = 1 là đường thẳng.

:::predict
Ta có 10 điểm train (dạng sóng có nhiễu) và 9 điểm test chưa thấy. Khi tăng bậc từ 1 lên 9, sai số trên train sẽ thế nào? Sai số trên test có luôn giảm theo không?
@answer
Sai số **train luôn giảm** (đến 0 ở bậc 9, đường cong đi qua đúng 10 điểm). Nhưng sai số **test giảm rồi tăng vọt**: ở bậc 5 là thấp nhất, còn bậc 9 sai số test lên tới 0.79. Bậc cao uốn theo cả nhiễu ("học thuộc"), nên điểm train đẹp không có nghĩa là model tốt.
:::

Hãy tự thử với thanh trượt bậc và nhìn hai con số.

:::widget poly-degree
:::

Với dữ liệu trong công cụ, sai số RMSE (train / test) là: bậc 1: 0.496 / 0.414; bậc 3: 0.199 / 0.081; bậc 5: 0.128 / **0.069**; bậc 7: 0.112 / 0.124; bậc 9: **0.000** / 0.790. Bậc tốt nhất theo test là **5**, không phải bậc có sai số train nhỏ nhất.

## Chọn bậc cho đúng

- **Chọn bằng dữ liệu chưa thấy:** validation hoặc cross-validation ([[bài:k-fold-cross-validation]]), chọn bậc có sai số validation nhỏ nhất.
- **Nội suy mọi điểm không chứng minh đã học đúng:** bậc 9 đi qua mọi điểm train nhưng dao động dữ dội giữa các điểm.
- **Scale và hệ số bất ổn:** x, x², x³… có thang rất khác nhau và tương quan mạnh với nhau, nên nên **scale** (và có thể center) trước khi fit; hệ số bậc cao rất nhạy ([[bài:feature-scaling]]).
- **Nhiều biến:** số cột tăng rất nhanh theo bậc (hai biến bậc 3 đã sinh nhiều cột chéo), nên chỉ dùng bậc thấp.
- Gói trong Pipeline: `PolynomialFeatures`, `StandardScaler`, `LinearRegression`.

:::ck
Model bậc 9 có sai số train bằng 0. Đồng nghiệp bảo "model hoàn hảo". Bạn trả lời thế nào?
@answer
Sai số train bằng 0 chỉ chứng tỏ đường cong **đi qua mọi điểm đã thấy**, không chứng tỏ nó đúng với điểm mới. Hãy xem sai số trên dữ liệu chưa thấy: ở ví dụ này nó lên tới 0.79, tệ hơn cả đường thẳng. Đó là overfitting.
:::

:::slides 67 | Slide 67: Polynomial Regression
:::

:::card Polynomial Regression
- **Thêm feature** x², x³… để uốn đường thẳng; vẫn là hồi quy tuyến tính trên các cột mới.
- **Bậc cao** luôn giảm sai số train; sai số test giảm rồi tăng (bậc 5 tốt nhất, bậc 9 test 0.79).
- **Chọn bậc bằng validation hoặc CV**, không bằng train.
- **Scale** các cột lũy thừa; nhiều biến thì chỉ dùng bậc thấp.
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

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Biến một feature x thành x, x²,… và giải thích “cong theo x, tuyến tính theo hệ số”.
- Tự lập ma trận, giải hệ số bậc hai, tính prediction và residual từng bước.
- Đọc bảng train/validation, chọn bậc bằng kiểm định chéo (CV) và giữ test độc lập.
- Nhận ra ngoại suy, hệ số bất ổn và leakage trong quy trình đa thức.
:::

Ở [[bài:linear-regression]], ta học một đường thẳng. Nhưng khi nhiệt độ rời xa mức dễ chịu, nhu cầu sưởi hoặc làm mát có thể tăng ở **cả hai phía**. Một đường chỉ tăng hoặc chỉ giảm khó mô tả hình chữ U. Làm sao uốn được đường mà vẫn dùng cách học cũ?

[[slide:67]] đặt một đường cong cạnh hai hình “Simple linear model” và “Polynomial model”. Hình trái ghi `y = b0 + b1x`; hình phải thêm số hạng bình phương, dạng `y = b0 + b1x1 + b2x1²`. Chỉ số 1 ở x1 là tên feature thứ nhất; số 2 viết phía trên nghĩa là **bình phương**, không phải feature thứ hai. Với một feature, bài dùng x thay x1 cho dễ đọc.

> **EN:** A straight line can miss a curved pattern. Slide 67 adds a squared input term to bend the fitted relationship while retaining a linear combination of coefficients.

:::slides 67 | Polynomial Regression: đường cong và so sánh mô hình thẳng / bậc hai
:::

:::note Nguồn và phạm vi bổ sung
Slide 67 chỉ có hình và công thức minh họa; không có bảng tọa độ gốc, code hay bảng ưu/nhược. Các ví dụ số, OLS, chọn bậc, CV và bẫy thực hành bên dưới đều là **bổ sung ngoài slide**, được tính lại bằng Python. Không lấy tọa độ ước lượng từ hình làm dữ liệu thật. Slide 68–69 đã sang [[bài:logistic-regression]].
:::

:::worked Đường thẳng sai bằng số, không chỉ nhìn hình (bổ sung ngoài slide)
Dùng năm điểm tự soạn, không gắn đơn vị thực: x = `[-2,−1,0,1,2]`, y = `[1,0,1,4,9]`. Chọn x đối xứng quanh 0 để phép tính tay ngắn; x âm có thể hiểu là độ lệch so với một mốc, không phải diện tích âm.

Theo công thức ở [[bài:linear-regression]]: trung bình x bằng 0, trung bình y bằng `(1+0+1+4+9)/5 = 3`. Tổng `xy = −2×1 −1×0 +0×1 +1×4 +2×9 = 20`; tổng `x² = 4+1+0+1+4 = 10`. Slope = `20/10 = 2`, intercept = `3−2×0 = 3`; đường OLS bậc một là **ŷ = 3 + 2x**.

| x | y | ŷ thẳng | Residual e = y − ŷ | e² |
|---|---|---|---|---|
| −2 | 1 | −1 | 2 | 4 |
| −1 | 0 | 1 | −1 | 1 |
| 0 | 1 | 3 | −2 | 4 |
| 1 | 4 | 5 | −1 | 1 |
| 2 | 9 | 7 | 2 | 4 |

SSE, tức tổng bình phương residual, là `4+1+4+1+4 = 14`. MSE, trung bình bình phương sai số, là `14/5 = 2.8`; RMSE, căn của MSE, là `√2.8 ≈ 1.6733`. Residual dương ở hai đầu, âm ở giữa: đường thẳng bỏ sót cấu trúc cong. Đây là lỗi trên **train**, chưa phải đánh giá tổng quát hóa.
:::

## [sâu] Thêm feature, giữ cách học (bổ sung ngoài slide)

**x² = x×x**, **x³ = x×x×x**. Ta tạo những cột này từ x, rồi vẫn fit Linear Regression trên bảng mới. Feature mới không phải dữ liệu thu thập thêm, cũng không phải thêm mẫu: mỗi hàng vẫn là một quan sát cũ.

:::compare Cùng một sample, cách biểu diễn khác nhau
| Dữ liệu gốc [x] | Sau biến đổi bậc hai [x, x²] | Số hàng |
|---|---|---|
| [−2] | [−2, 4] | Vẫn một sample |
| [0] | [0, 0] | Vẫn một sample |
| [2] | [2, 4] | Vẫn một sample |
:::

Trong biểu thức `b0 + b1x + b2x²`, ta **nhân mỗi hệ số với một feature rồi cộng**. Không có `b1²`, `b1×b2` hay hàm mũ của b. Đó là nghĩa **tuyến tính theo tham số**: các b là tham số cần học. Đường có thể cong theo x nhưng OLS, tức bình phương tối thiểu, vẫn học được hệ số bằng cách của bài trước và loss ở [[bài:loss-function]].

> **EN:** Polynomial expansion creates columns, not observations. The model is nonlinear in the original input but linear in its coefficients, so ordinary least squares still applies to the expanded design.

## [sâu] Bậc d và ý nghĩa hệ số

**Bậc d** là số mũ lớn nhất ta cho phép, ví dụ d = 2 cho x². Nó là **siêu tham số** (hyperparameter): người làm mô hình chọn trước khi fit; các hệ số b mới là tham số được học khi fit. Ký hiệu b của slide tương ứng β ở bài trước. Dưới đây b chỉ hệ số đã ước lượng; ŷ đọc là “y dự đoán”.

:::formula
**Bậc một và bậc hai** — một feature x:
```text
d = 1: ŷ = b0 + b1 x
d = 2: ŷ = b0 + b1 x + b2 x²
```
<!-- note: bậc 1 chính là đường thẳng đã học -->

**Bậc ba và bậc d** — cho phép đến lũy thừa d:
```text
d = 3: ŷ = b0 + b1 x + b2 x² + b3 x³
d bất kỳ: ŷ = b0 + b1 x + ... + bd x^d
```
<!-- note: hệ số bậc cao nhất có thể học ra 0 -->
:::

**b0** là giá trị dự đoán tại x = 0. **b1** là độ dốc tại x = 0 của mô hình này, không còn là mức tăng cố định ở mọi x. **b2** điều khiển độ cong của mô hình bậc hai: dương mở lên, âm mở xuống; bậc cao hơn còn chịu tác động của các số hạng khác. “Độ dốc tại một điểm” là tốc độ thay đổi tức thời; với bậc hai, nó bằng `b1 + 2b2x`.

Ví dụ `ŷ = 1 + 2x + x²`: tại x = 1, độ dốc là `2+2×1 = 4`; tại x = 2 là `2+2×2 = 6`. Tăng x từ 1 lên 2 cho dự đoán từ `1+2+1 = 4` lên `1+4+4 = 9`, tăng **5**, không phải b1 = 2. Không thể tăng x mà giữ x² cố định, nên đừng diễn giải từng hệ số như các feature độc lập có thể thay đổi riêng.

> **EN:** Degree is a hyperparameter; coefficients are fitted parameters. For a quadratic, the slope is b1 + 2b2x and varies with x. Powers of the same input cannot be varied independently, so isolated coefficient interpretations are misleading.

## [sâu] Tính tay bậc hai: từ bảng tới nghiệm (bổ sung ngoài slide)

### Lập ma trận thiết kế

:::worked Bước 1–2: thêm cột x², cột 1 và vector y
Tiếp tục đúng năm điểm ở đầu bài. Thêm cột toàn số 1 để nhân với intercept b0. **Ma trận thiết kế A** là bảng số model thực sự dùng, mỗi hàng `[1, x, x²]`; dùng tên A để phân biệt với bảng input gốc X chỉ có x. **Vector y** là cột các nhãn thật theo cùng thứ tự hàng.

| 1 | x | x² | y |
|---|---|---|---|
| 1 | −2 | 4 | 1 |
| 1 | −1 | 1 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 4 |
| 1 | 2 | 4 | 9 |

```text
    [1  -2  4]           [1]
    [1  -1  1]           [0]
A = [1   0  0]      y = [1]     b = [b0, b1, b2]ᵀ
    [1   1  1]           [4]
    [1   2  4]           [9]
```
:::

### Từ bình phương sai số tới hệ phương trình

Với dự đoán `Ab`, OLS tối thiểu `Σ(yi − ŷi)²`. Nghiệm thỏa **normal equation**, tức hệ phương trình `AᵀA b = Aᵀy`. Dấu ᵀ là **chuyển vị**: đổi hàng thành cột. Nếu các cột A độc lập tuyến tính, nghĩa là không cột nào là tổng có trọng số của các cột còn lại, có thể viết `b = (AᵀA)⁻¹Aᵀy`; dấu ⁻¹ là nghịch đảo ma trận. Đây là công thức toán; code nên dùng least-squares solver, không tự tính nghịch đảo.

> **EN:** The design includes a constant column for the intercept. OLS satisfies the normal equations; solving them avoids manually expanding an inverse. In code, use a numerical least-squares solver.

:::worked Bước 3: tính các tổng rồi giải, không bỏ bước
Các tổng từ bảng:

- `Σ1 = 5`, `Σx = −2−1+0+1+2 = 0`.
- `Σx² = 4+1+0+1+4 = 10`.
- `Σx³ = −8−1+0+1+8 = 0`.
- `Σx⁴ = 16+1+0+1+16 = 34`.
- `Σy = 1+0+1+4+9 = 15`.
- `Σxy = −2+0+0+4+18 = 20`.
- `Σx²y = 4×1 +1×0 +0×1 +1×4 +4×9 = 44`.

Vì mỗi ô của AᵀA là tổng tích hai cột tương ứng:

```text
        [ 5   0  10]            [15]
AᵀA =   [ 0  10   0]     Aᵀy = [20]
        [10   0  34]            [44]
```

Suy ra ba phương trình:

1. `5b0 + 10b2 = 15`.
2. `10b1 = 20` → **b1 = 2**.
3. `10b0 + 34b2 = 44`.

Nhân phương trình 1 với 2: `10b0 + 20b2 = 30`. Lấy phương trình 3 trừ phương trình vừa nhân: `(34−20)b2 = 44−30`, tức `14b2 = 14` → **b2 = 1**. Thế lại phương trình 1: `5b0 +10 =15` → `5b0 =5` → **b0 = 1**.

Vậy **ŷ = 1 + 2x + x²**. Chọn x đối xứng giúp tổng lũy thừa lẻ bằng 0; với dữ liệu khác, không được tự bỏ các số hạng đó.
:::

:::worked Bước 4–6: dự đoán, residual rồi so với đường thẳng
Tại x mới = 1.5: tính `x² = 1.5×1.5 = 2.25`; nhân hệ số `2×1.5 = 3`; cộng lại `ŷ = 1+3+2.25 = 6.25`. Điểm này nằm giữa −2 và 2, nên là **nội suy**, tức dự đoán trong miền x đã quan sát.

| x | Thay vào 1 + 2x + x² | ŷ | y − ŷ | (y − ŷ)² |
|---|---|---|---|---|
| −2 | 1−4+4 | 1 | 0 | 0 |
| −1 | 1−2+1 | 0 | 0 | 0 |
| 0 | 1+0+0 | 1 | 0 | 0 |
| 1 | 1+2+1 | 4 | 0 | 0 |
| 2 | 1+4+4 | 9 | 0 | 0 |

SSE = `0+0+0+0+0 = 0`; MSE = `0/5 = 0`; RMSE = `√0 = 0`. So cùng dữ liệu, bậc một có MSE **2.8**, bậc hai có MSE **0**. Lý do là bộ số **được tạo đúng theo một đa thức bậc hai không nhiễu**, không phải mọi bài toán đều cần bậc hai hay train error 0 là tốt. Code số thực có thể cho sai số rất nhỏ gần 0.
:::

### Code đối chiếu ví dụ tay

```python
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

x = np.array([-2, -1, 0, 1, 2], dtype=float)
y = np.array([1, 0, 1, 4, 9], dtype=float)
A = np.column_stack([np.ones(len(x)), x, x**2])
b, *_ = np.linalg.lstsq(A, y, rcond=None)  # b0, b1, b2
assert np.allclose(b, [1, 2, 1])
assert np.allclose(A.T @ A, [[5, 0, 10], [0, 10, 0], [10, 0, 34]])
assert np.allclose(A.T @ y, [15, 20, 44])
assert np.allclose(np.polyfit(x, y, 2), b[::-1])  # polyfit trả b2, b1, b0

poly = PolynomialFeatures(degree=2, include_bias=False)
expanded = poly.fit_transform(x[:, None])  # chỉ x, x²; intercept do model lo
quad = LinearRegression().fit(expanded, y)
line = LinearRegression().fit(x[:, None], y)
assert np.allclose([quad.intercept_, *quad.coef_], b)
print("x=1.5:", quad.predict(poly.transform([[1.5]])))  # [6.25]
for name, pred in [("degree 1", line.predict(x[:, None])),
                   ("degree 2", quad.predict(expanded))]:
    mse = mean_squared_error(y, pred)
    print(name, "MSE:", mse, "RMSE:", np.sqrt(mse))
```

## [sâu] Nhiều biến: số cột tăng nhanh (bổ sung ngoài slide)

Với hai input x1 và x2, bậc hai mặc định tạo `[x1, x2, x1², x1x2, x2²]`: **5 feature** chưa tính intercept. **Tích chéo** x1x2 mô tả tương tác: tác động của x1 có thể phụ thuộc x2. Bậc của tích là tổng số mũ, nên x1x2 có bậc 2, x1²x2 có bậc 3.

[[bài:svm]] dùng cùng ý tưởng ánh xạ feature để uốn ranh giới phân loại, rồi giới thiệu kernel trick: tính tích vô hướng trong không gian mới mà không dựng đủ mọi cột.

> **EN:** SVM extends the feature-map idea to classification and uses kernels to evaluate feature-space inner products without explicit expansion.

Với **n input feature** và bậc tối đa d, số cột khác hằng là **C(n+d, d) − 1** nếu tạo đủ mọi lũy thừa/tích đến bậc d. C(a,b) là số cách chọn b phần tử từ a, tính bằng `a! / (b!(a−b)!)`; dấu ! là giai thừa, ví dụ `3! = 3×2×1`. Ở đây n là số feature, khác **N** dùng cho số mẫu.

Với n = 10, d = 3: `C(13,3) = (13×12×11)/(3×2×1) = 286`; bỏ cột hằng được **285**, không phải 286. Điều kiện tương ứng sklearn là `include_bias=False`, `interaction_only=False` mặc định; nếu chỉ tạo tương tác giữa biến khác nhau, công thức đếm sẽ khác.

> **EN:** Multivariate expansion includes interactions and can grow combinatorially. With ten inputs and total degree at most three, there are 285 nonconstant terms. Feature count is not sample count.

```python
from math import comb
import numpy as np
from sklearn.preprocessing import PolynomialFeatures

assert comb(10 + 3, 3) - 1 == 285
pf = PolynomialFeatures(degree=3, include_bias=False)
assert pf.fit_transform(np.zeros((1, 10))).shape == (1, 285)
```

## [sâu] Chọn bậc bằng lỗi ngoài train (bổ sung ngoài slide)

**Underfitting** là mô hình quá hạn chế, bỏ sót cấu trúc thật: đường thẳng ở ví dụ đầu không uốn được chữ U. **Overfitting** là mô hình khớp cả chi tiết nhiễu của train nên dự đoán kém trên mẫu mới: đường bậc cao có thể ngoằn ngoèo giữa các điểm. Đây là đánh đổi **bias–variance** ở mức trực giác: bậc thấp dễ lệch có hệ thống; bậc cao dễ biến động khi đổi dữ liệu.

Nếu giữ nguyên tập train và dùng OLS không penalty, tăng bậc giữ lại mọi số hạng cũ, nên nghiệm tối ưu có train MSE **không tăng** trong toán chính xác: model có thể đặt hệ số mới bằng 0. Không có bảo đảm tương tự cho validation. Sai số số học hoặc một quy trình fit khác có thể làm kết quả thực tế lệch tính chất này.

> **EN:** Nested unpenalized polynomial models cannot increase the optimal training error in exact arithmetic. Validation error has no such guarantee; degree trades approximation flexibility against sensitivity to the sample.

:::compare Cùng dữ liệu giả lập có nhiễu, seed 42 — số thực chạy được
Sinh 80 mẫu `x ~ Uniform(−1,1)`, tức x lấy ngẫu nhiên đều trong khoảng −1 tới 1; `y = 1 + 2x² + noise`. Noise là nhiễu phân phối chuẩn (Gaussian), trung bình 0, độ lệch chuẩn 0.2. Tách test 16 mẫu; 64 mẫu development còn lại chia **train nhỏ 16 / validation 48** để thấy rõ rủi ro thiếu dữ liệu. Mỗi hàng fit đúng cùng 16 mẫu, cùng Pipeline ở phần code.

| Bậc d | MSE train | MSE validation |
|---|---|---|
| 1 | 0.290760 | 0.326536 |
| 2 | 0.011856 | 0.049132 |
| 3 | 0.006578 | 0.057918 |
| 5 | 0.006412 | 0.056852 |
| 9 | **0.003912** | **17.742702** |
:::

Bậc 2 tốt nhất theo validation ở lần chia này; bậc 9 thắng train nhưng thua xa validation. Sai số validation có thể dao động giữa bậc 3 và 5, không buộc tăng đều từng bước. Train nhỏ có x lớn nhất chỉ khoảng **0.6654**, còn validation có điểm phía phải xa hơn: thiếu độ phủ miền và bậc cao cùng góp phần làm lỗi tăng. Đây là một minh họa, không phải quy luật “luôn chọn 2” hay benchmark trên dữ liệu thực.

Để giảm phụ thuộc một lần chia, dùng [[bài:k-fold-cross-validation]] trên **development pool**, tức phần dữ liệu dành cho fit/chọn model; giữ test riêng như [[bài:train-test-split]]. Bên dưới chạy CV 5 fold cho từng d và chọn mean MSE nhỏ nhất, rồi refit trên toàn development. CV cũng là một phép ước lượng có dao động; khi chênh rất nhỏ, cân nhắc bậc đơn giản và độ ổn định thay vì xem một hàng là kết luận tuyệt đối.

> **EN:** The small training split also lacks right-side coverage, amplifying the high-degree failure. Cross-validation on development data reduces dependence on a single split; only a final held-out test estimates performance after selection.

## [sâu] Nội suy mọi điểm không chứng minh đã học đúng

Với **N giá trị x phân biệt**, luôn có một đa thức bậc **không quá N−1** đi qua N cặp (x,y) trong toán chính xác. Ta có N hệ số cho N điều kiện; ma trận lũy thừa, gọi là **Vandermonde**, đủ hạng khi các x phân biệt. Nếu nhiều điểm cùng x nhưng y khác nhau, một hàm y(x) không thể đi qua tất cả. Code số thực cũng không bảo đảm ra đúng 0 vì giới hạn độ chính xác.

Đi qua tất cả điểm có thể chỉ là **nội suy cả nhiễu**, chưa chứng minh học được quan hệ tổng quát. Nếu dữ liệu thật đúng một đa thức không nhiễu, nội suy có thể hợp lý; cần phân biệt với phản xạ chọn N−1 chỉ để train MSE bằng 0.

**Runge** là tên hiện tượng nội suy đa thức bậc cao trên các nút cách đều có thể dao động mạnh gần biên, ngay **trong** khoảng dữ liệu; xem [giải thích của Chebfun](https://www.chebfun.org/docs/guide/guide04.html). Nó khác **ngoại suy**, tức dự đoán ngoài miền x đã thấy. Cả hai nhắc ta xem đường cong và miền áp dụng, không chỉ residual tại các điểm train.

:::worked Ngoại suy vọt đuôi trên đúng demo có nhiễu (bổ sung ngoài slide)
Lấy các model fit 16 điểm trong bảng trước, hỏi x = 2, ngoài miền sinh dữ liệu [−1,1]. Hàm sinh không nhiễu cho `1+2×2² = 9`. Model bậc 2 dự đoán khoảng **9.1387**; bậc 9 khoảng **83,311.7590**. Đây là dự đoán của model demo trước refit CV, không phải model cuối. Biết hàm sinh nên ta đối chiếu được ở ví dụ này; dữ liệu thực thường không cho ta “đáp án ngoài miền”.
:::

Cách hạn chế overfit ở mức khái niệm: chọn d bằng validation/CV, thêm dữ liệu **đại diện cho miền dùng**, hoặc cân nhắc **Ridge/Lasso**. Chúng dùng regularization, tức thêm hạng phạt (penalty) để hạn chế hệ số; không viết bài riêng ở đây. Scale hay thêm dữ liệu lặp lại không tự cứu một lựa chọn bậc quá cao. Đa thức không mô tả bão hòa tốt trên mọi miền: đuôi của nó có thể tiếp tục tăng/giảm không giới hạn.

> **EN:** Interpolation can memorize noisy observations. Runge oscillations concern behavior within an interval near its boundaries; extrapolation concerns points outside the observed domain. Neither is assessed by training fit alone.

## [sâu] Center, scale và hệ số bất ổn (bổ sung ngoài slide)

**Center** là trừ đi mean; **scale** là đổi thang đo, như StandardScaler ở [[bài:feature-scaling]]. Các cột x, x²,… có thể gần phụ thuộc tuyến tính, nhất là trên một khoảng lệch xa 0; liên hệ [[bài:correlation-multicollinearity]]. Khi đó solver khó tách đóng góp từng cột: hệ số có thể lớn và đổi mạnh dù đường dự đoán trong miền còn gần nhau.

:::worked Tương quan trước/sau center, không khẳng định hết phụ thuộc
Với x = 1,…,10, Pearson corr(x,x²) ≈ **0.974559**. Mean x = 5.5. Đặt z = x−5.5, rồi **tính lại z²**; các z đối xứng quanh 0 nên corr(z,z²) = **0** (sai số máy có thể rất nhỏ). Phải phân biệt:

- Đúng để có ví dụ này: `[x] → z = x−5.5 → [z,z²]`.
- Chỉ scale hai cột đã có `[x,x²]` thì Pearson corr vẫn khoảng **0.974559**; StandardScaler không xóa tương quan tuyến tính.

Corr bằng 0 không có nghĩa độc lập: z² vẫn được xác định hoàn toàn từ z. Center không chữa mọi dạng cộng tuyến, đặc biệt không giải quyết feature trùng hoàn toàn.
:::

Scale các cột sau mở rộng có thể giảm chênh lệch độ lớn, hỗ trợ tính toán; center input trước khi lấy lũy thừa đôi khi cải thiện thêm. **Đa thức trực giao** là một cách chọn bộ hàm cơ sở khác để giảm tương quan trong điều kiện phù hợp; ở đây chỉ cần biết tên, chưa triển khai. Scale/center không thêm thông tin và không bảo đảm hết overfit. Với OLS cùng intercept, cùng không gian đa thức và giải chính xác, đổi cơ sở khả nghịch không tự đổi prediction: ta chỉ đổi qua lại giữa hai bộ cột bằng phép biến đổi tuyến tính không mất thông tin.

Outlier vẫn chịu loss bình phương. Điểm x xa có thể được khuếch đại qua x^d và có ảnh hưởng mạnh tới đường fit; bậc cao tạo thêm tự do để bám điểm đó. Mức ảnh hưởng không tăng máy móc ở mọi dataset; cần xem điểm ảnh hưởng và residual, không xóa tự động — [[bài:missing-values-outliers]].

> **EN:** Centering before expansion and scaling afterward address different numerical issues. Scaling alone preserves Pearson correlations and does not fix rank deficiency or overfitting. High powers can amplify the influence of extreme inputs.

## [sâu] Code thực hành: Pipeline, validation, CV rồi test (bổ sung ngoài slide)

Cài `pip install numpy scikit-learn matplotlib`. Code chạy theo thứ tự các block; phần demo dưới đây tự đủ imports. **Pipeline** gói các bước biến đổi và fit thành một model, để mỗi fold chỉ fit scaler/model trên phần train của fold. `PolynomialFeatures` chỉ tạo lũy thừa/tích theo cấu hình, không học mean từ dữ liệu; StandardScaler mới học mean/std. Gói chung vẫn giúp tránh sai thứ tự và giữ biến đổi nhất quán lúc predict.

`include_bias=False` bỏ cột hằng vì LinearRegression đã có intercept. `neg_mean_squared_error` trả **âm MSE** theo quy ước “score lớn hơn là tốt hơn” của sklearn; lấy dấu trừ để đọc MSE dương. Không được chọn bậc từ điểm test. Với dữ liệu thời gian/nhóm, thay random split/KFold bằng cách chia phù hợp.

> **EN:** A pipeline keeps preprocessing inside each training fold and consistent at prediction time. Cross-validation returns negative MSE under scikit-learn's score convention; negate it for error reporting. Test data must not guide degree selection.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")  # xuất ảnh không cần cửa sổ; bỏ nếu dùng plt.show()
import matplotlib.pyplot as plt
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.metrics import mean_squared_error

def make_model(degree):
    return make_pipeline(
        PolynomialFeatures(degree=degree, include_bias=False),
        StandardScaler(),
        LinearRegression(),
    )

# Dữ liệu giả lập; X có 80 hàng, mỗi hàng một feature.
rng = np.random.default_rng(42)
X = rng.uniform(-1, 1, size=(80, 1))
y = 1 + 2 * X[:, 0]**2 + rng.normal(0, 0.2, size=80)

# Giữ test từ đầu. Demo cố ý chỉ fit 16 mẫu để lộ rủi ro bậc cao.
X_dev, X_test, y_dev, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
X_train, X_val, y_train, y_val = train_test_split(
    X_dev, y_dev, train_size=16, random_state=42
)
degrees = [1, 2, 3, 5, 9]
models, rows = {}, []
for d in degrees:
    model = make_model(d).fit(X_train, y_train)  # fit chỉ train
    models[d] = model
    train_mse = mean_squared_error(y_train, model.predict(X_train))
    val_mse = mean_squared_error(y_val, model.predict(X_val))
    rows.append((d, train_mse, val_mse))
    print(f"{d:2d} train={train_mse:.6f} val={val_mse:.6f}")

# Mỗi bậc có một panel, trục y tự co theo đường fit của panel đó.
grid = np.linspace(-1, 1, 400).reshape(-1, 1)
fig, axes = plt.subplots(2, 3, figsize=(14, 8), constrained_layout=True)
for ax, (d, train_mse, val_mse) in zip(axes.flat, rows):
    ax.scatter(X_train[:, 0], y_train, label="train", s=24)
    ax.scatter(X_val[:, 0], y_val, label="validation", s=15, alpha=0.4)
    ax.plot(grid[:, 0], 1 + 2 * grid[:, 0]**2, "k--", label="true mean")
    ax.plot(grid[:, 0], models[d].predict(grid), color="#D64545", label="fit")
    ax.set(title=f"degree {d} | val MSE {val_mse:.4f}", xlabel="x", ylabel="y")
    ax.grid(alpha=0.2)
axes.flat[0].legend(fontsize=8)
ax = axes.flat[-1]
ax.plot(degrees, [r[1] for r in rows], "o-", label="train")
ax.plot(degrees, [r[2] for r in rows], "o-", label="validation")
ax.set(yscale="log", xlabel="degree", ylabel="MSE (log scale)", title="Same 16-point training split")
ax.set_xticks(degrees)
ax.legend()
ax.grid(alpha=0.2)
out = Path("polynomial_output")
out.mkdir(exist_ok=True)
fig.savefig(out / "degree-comparison.png", dpi=150)
plt.close(fig)

# Đối chiếu ngoại suy của model demo, không dùng để chọn bậc.
for d in [2, 9]:
    print("Demo degree", d, "at x=2:", models[d].predict([[2]])[0])

# Quy trình chọn cuối dùng CV trên 64 mẫu development, test vẫn chưa dùng.
cv = KFold(n_splits=5, shuffle=True, random_state=42)
cv_mse = {}
for d in degrees:
    scores = cross_val_score(
        make_model(d), X_dev, y_dev, cv=cv,
        scoring="neg_mean_squared_error", n_jobs=1
    )
    cv_mse[d] = -scores.mean()
    print("degree", d, "CV MSE:", round(cv_mse[d], 6))
best_degree = min(cv_mse, key=cv_mse.get)
final_model = make_model(best_degree).fit(X_dev, y_dev)
test_mse = mean_squared_error(y_test, final_model.predict(X_test))
print("Selected degree:", best_degree, "Final test MSE:", round(test_mse, 6))
```

Chạy với seed/split trên: CV MSE cho d = 1/2/3/5/9 lần lượt **0.297014 / 0.038220 / 0.038337 / 0.039231 / 0.086073**. Chọn **d = 2**, refit trên 64 mẫu development, test MSE **0.032951**. CV và bảng holdout trước dùng lượng dữ liệu fit khác nhau; không so chúng như hai phép đo của đúng một model. Test chỉ đánh giá lựa chọn đã chốt, không quay lại sửa d theo test.

Ảnh dưới được sinh từ đúng code trên. **Trục y của năm panel tự co riêng** để thấy đầy đủ đuôi bậc 9; panel cuối dùng thang log cho MSE, tức mỗi bước đều trên trục biểu thị một tỉ lệ nhân thay vì một chênh lệch cộng. Muốn so độ cao số, đọc nhãn trục và bảng, không so bằng mắt giữa các panel.

![Năm bậc đa thức trên cùng split và đồ thị MSE train/validation](/plots/polynomial-degree-comparison.png)

[Mở hình ở độ phân giải gốc](/plots/polynomial-degree-comparison.png). Cách đọc scatter, đường fit và nhãn trục nối với [[bài:data-visualization]].

> **EN:** Five-fold CV selects degree two here, followed by a single held-out test evaluation. These results are specific to the synthetic sample. Plot panels use independent y scales; the error panel uses a logarithmic scale.

```python
# Kiểm ví dụ center; block này độc lập với demo trước.
import numpy as np
from sklearn.preprocessing import StandardScaler

x = np.arange(1, 11, dtype=float)
raw = np.column_stack([x, x**2])
z = x - x.mean()
center_then_expand = np.column_stack([z, z**2])
print(np.corrcoef(raw, rowvar=False)[0, 1])  # 0.9745586...
print(np.corrcoef(center_then_expand, rowvar=False)[0, 1])  # 0.0
scaled = StandardScaler().fit_transform(raw)
assert np.isclose(np.corrcoef(scaled, rowvar=False)[0, 1],
                  np.corrcoef(raw, rowvar=False)[0, 1])
```

## [sâu] Linear hay Polynomial: chọn theo cấu trúc và cách đo

:::compare So sánh bổ sung, slide 67 không có bảng ưu/nhược
| Tiêu chí | Linear trên feature gốc | Polynomial + OLS |
|---|---|---|
| Hình dạng với một input | Đường thẳng | Đường cong khi có bậc từ hai |
| Cách học hệ số | OLS | Vẫn OLS trên feature mở rộng |
| Khi thử trước | Xu hướng gần thẳng, baseline dễ kiểm tra | Residual gợi cấu trúc cong, có đủ dữ liệu để kiểm bậc |
| Diễn giải | Hệ số theo đơn vị, giữ các biến khác cố định | Tác động theo x phụ thuộc vị trí; không thay x riêng với x² |
| Rủi ro | Underfit quan hệ cong, vẫn có outlier/ngoại suy | Overfit, đuôi vọt, số cột tăng, điều kiện số xấu |
| Quyết định cuối | Validation/CV và chi phí | Cùng nguyên tắc, thêm chọn d trong development |
:::

## [sâu] Những cách hiểu sai cần chặn

:::pitfall Cong theo x không đồng nghĩa đổi hoàn toàn cách học
Sai: “Polynomial phi tuyến nên không dùng Linear Regression”. Đúng: nó tuyến tính theo b trên bảng feature mới; chẳng hạn `[x,x²]` vẫn đi vào một LinearRegression. Đổi cơ sở biểu diễn khác với đổi loss.
:::

:::pitfall Chọn bậc bằng train error hoặc ít điểm nhưng bậc rất cao
Bậc 9 trong bảng có train MSE thấp nhất nhưng validation tệ nhất. N−1 có thể nội suy N điểm x phân biệt, kể cả nhiễu; không có bằng chứng đó là bậc nên triển khai. Chọn bằng validation/CV và xem miền dữ liệu.
:::

:::pitfall Đuôi vọt và bão hòa giả
Fit cong trong một khoảng không bảo đảm có hành vi hợp lý ngoài khoảng đó. Giá nhà có dấu hiệu bão hòa trong train không có nghĩa đa thức tự giữ bão hòa ở diện tích rất lớn; đánh dấu input ngoài miền, kiểm riêng hoặc giới hạn phạm vi dùng.
:::

:::pitfall Scale không xóa cộng tuyến, không thay quy trình đánh giá
Không scale có thể làm lũy thừa chênh độ lớn, nhất là x lớn và d cao; nhưng scale không bảo đảm hết lỗi số hay overfit. Fit scaler trên cả dữ liệu trước split/CV là leakage; Pipeline fit trong từng train fold mới giữ đúng ranh giới.
:::

:::pitfall b1 không còn là mức tăng cố định, b2 không phải “độ quan trọng”
Với ŷ = 1+2x+x², tăng x từ 1 lên 2 làm prediction tăng 5 chứ không phải b1 = 2. Xem cả hàm dự đoán, đơn vị, miền dữ liệu và việc các lũy thừa cùng thay đổi; không suy nhân quả từ từng hệ số.
:::

> **EN:** Degree selection, extrapolation, conditioning and interpretation are separate concerns. A visually flexible curve and a well-scaled pipeline do not replace independent validation.

Nguồn đối chiếu phần ngoài slide: [PolynomialFeatures](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html), [Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html), [underfit/overfit](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html), [NumPy polynomial least squares và điều kiện số](https://numpy.org/doc/stable/reference/generated/numpy.polyfit.html).
