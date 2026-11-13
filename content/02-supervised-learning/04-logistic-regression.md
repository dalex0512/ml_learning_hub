---
title: Hồi quy logistic (Logistic Regression)
order: 4
description: "Biến điểm tuyến tính thành xác suất bằng sigmoid, tính log loss và giải thích bằng số vì sao giảm ngưỡng giúp tăng recall."
slides: 68-69
needs: [linear-regression, classification-vs-regression, confusion-matrix, classification-metrics, loss-function]
tags: [logistic-regression, sigmoid, classification, threshold, log-loss, odds, decision-boundary]
---

## Từ dự đoán một con số sang dự đoán một lớp

:::intro Đọc xong bài này bạn làm được
- Gọi đúng tên **hồi quy logistic**, và giải thích vì sao đây là thuật toán phân loại.
- Tính từng bước: feature → điểm tuyến tính → sigmoid → xác suất → lớp.
- Tính log loss, odds và đọc ý nghĩa hệ số.
- Đếm lại confusion matrix ở ba ngưỡng để giải thích đánh đổi precision/recall.
- Chạy sklearn với Pipeline, chọn ngưỡng trên validation và giữ test độc lập.
:::

[[bài:linear-regression]] dự đoán đại lượng số; [[bài:polynomial-regression]] thêm feature để uốn đường. Nếu câu hỏi đổi thành “đậu hay trượt”, target là **nhãn lớp** (class), không phải điểm thi. Theo [[bài:classification-vs-regression]], ta đã chuyển sang **phân loại nhị phân** (binary classification): chỉ có hai lớp, ở đây mã hóa trượt = 0, đậu = 1.

> **EN:** Logistic Regression, or “hồi quy logistic” in Vietnamese, is a classifier. A binary label encodes one of two outcomes rather than a continuous quantity.

:::slides 68-69 | Sigmoid, Threshold Value và ưu/nhược của Logistic Regression
:::

:::note Nguồn và phạm vi
[[slide:68]] có đường chữ S (S-curve), ngưỡng 0.5, hai điểm ghi y=0.3/y=0.8 và công thức φ(z). [[slide:69]] có scatter hai lớp, đường phân tách đỏ và bảng GOOD/BAD. Không có bảng tọa độ gốc, loss hay code. **Các bộ số dưới đây là ví dụ tự soạn hoặc lấy từ ảnh ghi chú chuột do chủ repo cung cấp, không phải số liệu slide 68–69**; từng ví dụ ghi rõ nguồn. Các phép tính tay, odds, huấn luyện, chọn ngưỡng và code là **bổ sung ngoài slide**. Không suy tọa độ thật từ hình.
:::

:::worked Vì sao không dùng thẳng đầu ra Linear? (ngoài slide)
Tự soạn tám học viên: số giờ học x = `[1,2,3,4,5,6,7,8]`, nhãn y = `[0,0,0,0,1,1,1,1]`. Dữ liệu cố ý đơn giản để thấy giới hạn đầu ra, không khẳng định học đủ giờ sẽ chắc chắn đậu.

Fit OLS như bài trước: trung bình x = `36/8 = 4.5`, trung bình y = `4/8 = 0.5`. Tổng bình phương độ lệch x là `12.25+6.25+2.25+0.25+0.25+2.25+6.25+12.25 = 42`. Tổng tích độ lệch x,y là `1.75+1.25+0.75+0.25+0.25+0.75+1.25+1.75 = 8`.

Slope = `8/42 = 4/21`; intercept = `0.5 − (4/21)×4.5 = −5/14`. Vậy ŷ = `−5/14 + (4/21)x`.

- Tại x = 1: `−15/42 + 8/42 = −7/42 ≈ −0.1667`.
- Tại x = 8: `−15/42 + 64/42 = 49/42 ≈ 1.1667`.

Cả hai nằm ngoài [0,1], ngay trong miền train. Chúng vẫn là dự đoán số của đường OLS, nhưng **không thể đọc là xác suất**. Cắt cứng về 0/1 chỉ che giới hạn đầu ra; ta cần một mô hình xác suất và loss thích hợp ngay từ lúc học.
:::

> **EN:** An OLS fit to binary labels can predict below zero or above one even within the training range. Such values are not probabilities; clipping does not replace fitting a probabilistic classification model.

## Con chuột 10 kg kéo lệch đường Linear thế nào? (ngoài slide)

Ghi chú bổ sung của chủ repo dùng ví dụ: biết **cân nặng** của chuột, cần phân loại **không béo phì / béo phì**. Trực giác là nếu dùng một đường Linear Regression rồi cắt ở ngưỡng 0.5, một con chuột cực nặng có thể kéo lệch cả đường và làm thay đổi phân loại của con khác. Đây là cách nhìn cụ thể cho hạn chế của OLS khi đem dự đoán số áp vào nhãn 0/1.

:::worked Dữ liệu từ ảnh 1 của chủ repo; không phải dữ liệu slide
Quy đổi hết sang **kg** trước khi fit. Gọi x là cân nặng, y=0 là “Không” và y=1 là “Có” ở cột béo phì. Đây là nhãn của ví dụ minh họa trong ảnh, không phải ngưỡng sinh học thực tế; “không béo phì” cũng không đồng nghĩa đã xác nhận khỏe mạnh về mọi mặt.

| Cân nặng trên ảnh | x (kg) | Béo phì | y |
|---|---|---|---|
| 500 g | 0.50 | Không | 0 |
| 250 g | 0.25 | Không | 0 |
| 1 kg | 1.00 | Có | 1 |
| 2 kg | 2.00 | Có | 1 |
| 3 kg | 3.00 | Có | 1 |
| 150 g | 0.15 | Không | 0 |

**Bước 1 — fit sáu con ban đầu.** Viết đường OLS là `s(x)=b+mx`, trong đó m là slope, b là intercept, còn s là **điểm đầu ra Linear**, không phải xác suất hợp lệ. Dùng s thay y để phân biệt dự đoán với nhãn thật. Với N mẫu, công thức slope tương đương bài [[bài:linear-regression]] là:

```text
m = [N Σxy − (Σx)(Σy)] / [N Σx² − (Σx)²]
b = (Σy − m Σx) / N
```

Từ sáu hàng: N=6, `Σx=6.9`, `Σy=3`, `Σx²=14.335`, `Σxy=6`.

- Tử số slope: `6×6 − 6.9×3 = 36−20.7 = 15.3`.
- Mẫu số: `6×14.335 − 6.9² = 86.01−47.61 = 38.4`.
- `m=15.3/38.4=0.3984375`; `b=(3−0.3984375×6.9)/6=0.041796875`.

Vậy `s(x)=0.041796875+0.3984375x`. Quy ước s≥0.5 thì gọi béo phì. Điểm cắt là `x=(0.5−0.041796875)/0.3984375=1.15 kg`. **0.5 là ngưỡng trên điểm đầu ra, không phải cân nặng 0.5 kg.**

**Bước 2 — thêm một con 10 kg, nhãn béo phì y=1, rồi fit lại.** Đây là tình huống giả định chủ repo nêu: điểm cực đoan nằm rất xa miền cân nặng ban đầu, không khẳng định chuột thực tế có cân nặng như vậy.

N mới=7; `Σx=6.9+10=16.9`, `Σy=3+1=4`, `Σx²=14.335+100=114.335`, `Σxy=6+10×1=16`.

- Tử số slope mới: `7×16−16.9×4=112−67.6=44.4`.
- Mẫu số mới: `7×114.335−16.9²=800.345−285.61=514.735`.
- `m=44.4/514.735≈0.086257977`; `b=(4−m×16.9)/7≈0.363177169`.

Đường mới là `s(x)≈0.363177169+0.086257977x`. Nó phẳng hơn; điểm cắt s=0.5 chuyển lên **x≈1.586205 kg**. Các phép tính dùng hệ số chưa làm tròn.

**Bước 3 — nhìn một dự đoán thực sự đổi lớp.** Xét một con mới **1.3 kg**, do ta chọn thêm để kiểm tra, không phải hàng dữ liệu trong ảnh:

| Model OLS | Tính s tại x=1.3 | So với 0.5 | Lớp dự đoán |
|---|---|---|---|
| Trước khi thêm 10 kg | 0.041796875+0.3984375×1.3≈0.559766 | ≥0.5 | Béo phì |
| Sau khi thêm 10 kg | 0.363177169+0.086257977×1.3≈0.475313 | <0.5 | Không béo phì |

Con 1.3 kg không đổi cân nặng; chỉ thêm một mẫu xa đã làm **cùng input đổi lớp**. Ta chưa có nhãn thật của con mới nên chưa kết luận dự đoán nào đúng. OLS cố giảm tổng bình phương sai số của **mọi** mẫu; với đường cũ, x=10 cho s≈4.026172 trong khi y=1. Fit lại kéo đường xuống ở phía cân nặng lớn, đồng thời đổi slope/intercept và điểm cắt của các con còn lại. Điểm x xa có khả năng kéo đường mạnh như vậy thường được gọi là điểm có **đòn bẩy cao** (high leverage).
:::

> **EN:** Using the six weights supplied in the owner's screenshot, the OLS threshold crossing moves from 1.15 kg to about 1.586205 kg after adding a hypothetical 10 kg positive sample. A new 1.3 kg input flips class, illustrating the influence of an extreme predictor on a least-squares classifier.

:::note Hình minh họa và phép fit từ bảng không nhất thiết trùng nhau
Ảnh 2–3 minh họa trực giác đường thẳng bị kéo khi thêm điểm xa; không có tọa độ chính xác cho mọi chấm để tái dựng đường vẽ. Khi fit **đúng sáu hàng trong ảnh 1**, con 1 kg đã có s≈0.440234<0.5 từ đầu; sau thêm 10 kg, s≈0.449435 vẫn dưới 0.5. Vì vậy không nói con 1 kg “đang đúng thành sai” dựa trên bảng này. Ví dụ 1.3 kg phía trên thể hiện việc đổi lớp bằng số đã kiểm, còn sáu mẫu gốc không đổi lớp ở lần thêm điểm này.
:::

:::pitfall Không kết luận “Logistic sinh ra chỉ vì Linear nhạy outlier”
Đây là **động cơ trực giác để chọn mô hình phù hợp cho phân loại**, không phải khẳng định về lịch sử ra đời. Logistic mô hình hóa xác suất lớp bằng sigmoid và học bằng log loss, thay vì bắt một đường OLS khớp các nhãn 0/1 như đại lượng liên tục. Nó **không miễn nhiễm outlier**: feature cực đoan, nhãn sai hoặc điểm xa nằm ngược lớp vẫn có thể ảnh hưởng mạnh; vẫn cần kiểm dữ liệu và regularization. Đổi loss nhưng giữ predictor tuyến tính tạo ra Logistic, chứ không phải chỉ “bẻ cong đường để bỏ qua chuột 10 kg”.
:::

> **EN:** This is a motivation for probabilistic classification, not a historical claim that Logistic Regression was invented solely to fix outliers. Logistic Regression is not automatically robust to extreme predictors or mislabeled observations.

### Code kiểm lại ví dụ chuột

Đoạn độc lập này chỉ kiểm OLS trước/sau và ngưỡng, chưa huấn luyện Logistic; phần tiếp theo giải thích sigmoid và code Logistic ở cuối bài.

```python
import numpy as np
from sklearn.linear_model import LinearRegression

# Sáu hàng từ ảnh chủ repo, đổi hết sang kg; 10 kg là mẫu thêm giả định.
weights = np.array([0.50, 0.25, 1.00, 2.00, 3.00, 0.15])
obese = np.array([0, 0, 1, 1, 1, 0])
before = LinearRegression().fit(weights[:, None], obese)
after = LinearRegression().fit(
    np.append(weights, 10.0)[:, None], np.append(obese, 1)
)
for name, fitted in [("before", before), ("after", after)]:
    b, m = fitted.intercept_, fitted.coef_[0]
    crossing = (0.5 - b) / m
    score = fitted.predict([[1.3]])[0]  # con mới, không có trong bảng ảnh
    print(f"{name}: b={b:.9f}, m={m:.9f}, crossing={crossing:.6f} kg")
    print(f"score(1.3 kg)={score:.6f}, obese={int(score >= 0.5)}")
```

## Giữ điểm tuyến tính, đưa qua hàm sigmoid

Ta giữ phần cộng có trọng số đã học: **z** là điểm tuyến tính, bằng intercept **β0** cộng hệ số **βj** nhân feature **xj**; chỉ số j chạy từ 1 tới n, với n là số feature. Trong bài, β là hệ số đang xét; khi fit dữ liệu, ta chỉ có ước lượng của chúng. z có thể âm, dương, không bị chặn trong [0,1].

**Hàm sigmoid (hàm logistic)** biến z thành số trong (0,1). Slide dùng chữ Hy Lạp **φ**, đọc là phi; tài liệu khác thường dùng **σ**, đọc là sigma. Trong bài này **p = φ(z) = σ(z)**, là xác suất mô hình ước lượng cho lớp 1 khi biết feature x, viết **P(y=1 \| x)**. **e ≈ 2.71828** là hằng số Euler, cơ số hàm mũ; e^(−z) nghĩa là e lũy thừa −z.

:::formula
**Điểm tuyến tính và xác suất**
```text
z = β0 + β1 x1 + ... + βn xn
p = φ(z) = 1 / (1 + e^(−z))
```
<!-- note: slide dùng φ; σ cũng là cùng hàm sigmoid -->

**Ngưỡng quyết định** — threshold t là mức xác suất dùng để gán lớp:
```text
ŷ = 1 nếu p ≥ t
ŷ = 0 nếu p < t
```
<!-- note: bài quy ước điểm đúng bằng ngưỡng vào lớp 1 -->
:::

:::compare Từ input tới class
| Bước | Kết quả | Ý nghĩa |
|---|---|---|
| Nhận x | Các feature | Ví dụ giờ học |
| Tính z | Một số thực | Tổng có trọng số |
| Tính φ(z) | p trong (0,1) | Xác suất ước lượng của lớp 1 |
| So p với t | ŷ bằng 0 hoặc 1 | Quyết định lớp cuối cùng |
:::

Trong [[slide:68]], hai nhãn y=0.3 và y=0.8 trên đường cong nên đọc là **đầu ra xác suất**, không phải nhãn thật của hai lớp. Với t = 0.5: `0.3 < 0.5` → lớp 0; `0.8 ≥ 0.5` → lớp 1. Các chấm ở hàng 0/1 minh họa nhãn rời rạc, còn đường S mô tả đầu ra liên tục.

> **EN:** A linear score is passed through a sigmoid to estimate the probability of class one; a separate threshold converts that probability into a label. The 0.3 and 0.8 annotations in slide 68 represent probability outputs.

:::pitfall Không phải fit OLS rồi gắn thêm sigmoid (ngoài slide)
Ghi chú “output của Linear là input của sigmoid” đúng ở **cấu trúc phép tính z**. Khi huấn luyện Logistic, hệ số được học bằng loss phân loại, không lấy hệ số OLS đã fit nhãn 0/1 rồi giữ nguyên. Hai mô hình cùng khung tuyến tính nhưng khác mục tiêu học.
:::

## Tính sigmoid và hiểu đường phân tách

:::worked Năm giá trị của đường S (ngoài slide)
Chọn z = −4, −2, 0, 2, 4 để thấy hai đuôi và tâm; làm tròn sau khi tính, không làm tròn trước khi so ngưỡng.

| z | Tính e^(−z) | Cộng 1 | Lấy nghịch đảo → φ(z) |
|---|---|---|---|
| −4 | e⁴ ≈ 54.598150 | 55.598150 | 1/55.598150 ≈ 0.017986 |
| −2 | e² ≈ 7.389056 | 8.389056 | 1/8.389056 ≈ 0.119203 |
| 0 | e⁰ = 1 | 2 | 1/2 = 0.500000 |
| 2 | e⁻² ≈ 0.135335 | 1.135335 | 1/1.135335 ≈ 0.880797 |
| 4 | e⁻⁴ ≈ 0.018316 | 1.018316 | 1/1.018316 ≈ 0.982014 |
:::

Sigmoid **đơn điệu tăng**: tăng z thì p tăng. Nó có tính đối xứng `φ(−z) = 1−φ(z)`, chẳng hạn `0.119203 ≈ 1−0.880797`. Khi z đi rất xa về âm/dương, p tiến sát 0/1, gọi là **tiệm cận**, nhưng không đạt đúng hai đầu với z hữu hạn trong toán chính xác. Máy tính có thể làm tròn thành 0 hoặc 1; đó là giới hạn số học.

**Ranh giới quyết định** (decision boundary) là nơi hai vùng dự đoán gặp nhau. Với t = 0.5: `φ(z)=0.5` → `1+e^(−z)=2` → `e^(−z)=1` → `z=0`. Do đó ranh giới là `β0 + β1x1 + … + βnxn = 0`: một đường thẳng với hai feature, một **siêu phẳng** (hyperplane, dạng tương tự đường/phẳng trong nhiều chiều) với nhiều feature. Đường đỏ ở [[slide:69]] minh họa dạng phân tách này; không có hệ số để suy ra phương trình cụ thể từ slide.

Đường xác suất cong không làm ranh giới mặc định cong: sigmoid chỉ biến đổi **một điểm số**, còn các điểm có cùng z vẫn trên cùng siêu phẳng. Vì thế Logistic là bộ phân loại tuyến tính theo các feature đang dùng. Với `0 < t < 1`, đổi ngưỡng chuyển ranh giới sang `z = ln(t/(1−t))`, vẫn là siêu phẳng; ln được giải thích ngay dưới.

> **EN:** The sigmoid is increasing, symmetric around (0, 0.5), and asymptotic to zero and one. Its curved probability output still produces a linear decision boundary in the supplied feature space.

## Odds và log-odds: tuyến tính ở đâu? (ngoài slide)

Ví dụ xác suất đậu p = 0.8: xác suất trượt là `1−0.8 = 0.2`. **Odds**, tức tỉ số xác suất xảy ra với không xảy ra, bằng `p/(1−p) = 0.8/0.2 = 4`: “4 so với 1”. Odds không phải xác suất; nó có thể lớn hơn 1.

**ln** là logarit tự nhiên, hàm ngược của e mũ: `ln(e^z)=z`. **Log-odds**, còn gọi là **logit**, là ln của odds. Từ sigmoid: `1−p = e^(−z)/(1+e^(−z))`; chia p cho 1−p được `1/e^(−z) = e^z`; lấy ln cho `ln(p/(1−p)) = z`. Vậy giả định tuyến tính là **log-odds tuyến tính theo feature**, không phải xác suất tuyến tính theo x.

:::worked Ý nghĩa β1 = 0.7, giữ các feature khác cố định
Tăng x1 một đơn vị → z tăng 0.7 → log-odds tăng 0.7 → odds nhân `e^0.7 ≈ 2.013753`. Nếu ban đầu p = 0.5, odds = 1; odds mới ≈ 2.013753 nên p mới = `2.013753/(1+2.013753) ≈ 0.668188`. Xác suất tăng khoảng 0.168188, **không phải tăng 0.7 hay nhân 2.013753**.

Nếu x1 đã chuẩn hóa bằng StandardScaler, một đơn vị ở đây là **một độ lệch chuẩn theo train**, không còn một giờ hay một đồng. Cách đọc hệ số phải đi cùng cách biến đổi feature; đây là quan hệ model học, không tự chứng minh nhân quả.
:::

> **EN:** A coefficient is an additive change in log-odds and a multiplicative change in odds, holding other modeled features fixed. It is neither a constant probability increment nor automatically a causal effect.

## Tính tay dự đoán và log loss (ngoài slide)

:::worked Một mô hình cho sẵn, chưa phải kết quả fit
Tự soạn **z = −4 + x**, với x là giờ học. Chọn intercept −4 và slope 1 để các x chẵn dẫn tới đúng bảng sigmoid vừa tính; không tuyên bố đây là hệ số tối ưu của tám điểm OLS đầu bài.

| x | y thật tự soạn | z = −4+x | p = φ(z) | ŷ ở t=0.5 |
|---|---|---|---|---|
| 0 | 0 | −4+0 = −4 | 0.017986 | 0 |
| 2 | 0 | −4+2 = −2 | 0.119203 | 0 |
| 4 | 1 | −4+4 = 0 | 0.500000 | 1 |
| 6 | 1 | −4+6 = 2 | 0.880797 | 1 |
| 8 | 1 | −4+8 = 4 | 0.982014 | 1 |

Ví dụ hàng x=6: nhân `1×6=6`, cộng `−4+6=2`, tính `e⁻²≈0.135335`, lấy `1/(1+0.135335)≈0.880797`, rồi so `0.880797≥0.5` để dự đoán đậu.
:::

[[bài:loss-function]] giải thích loss là tín hiệu học. Với nhãn 0/1, **log loss**, còn gọi **binary cross-entropy** (entropy chéo nhị phân), đo mức xác suất model gán cho **kết quả thật**. Mỗi mẫu i có nhãn yi và xác suất pi; N là số mẫu. Dấu Σ nghĩa là cộng qua các mẫu.

:::formula
**Loss từng mẫu**
```text
Li = −[yi ln(pi) + (1−yi) ln(1−pi)]
yi = 1 → Li = −ln(pi)
yi = 0 → Li = −ln(1−pi)
```

**Loss trung bình và mục tiêu học**
```text
J = (L1 + ... + LN) / N
Chọn β để J nhỏ nhất (có thể thêm penalty)
```
:::

:::worked Tính loss của đủ năm hàng trên
| x | Thế nhãn vào công thức | Li |
|---|---|---|
| 0 | −[0×ln(p)+1×ln(1−p)] = −ln(0.982014…) | 0.018150 |
| 2 | −[0×ln(p)+1×ln(1−p)] = −ln(0.880797…) | 0.126928 |
| 4 | −[1×ln(p)+0×ln(1−p)] = −ln(0.5) | 0.693147 |
| 6 | −ln(0.880797…) | 0.126928 |
| 8 | −ln(0.982014…) | 0.018150 |

Cộng bằng số chưa làm tròn: `ΣLi ≈ 0.983303`, chia 5 được **J ≈ 0.196661**. Cả năm nhãn đều đúng theo quy ước ≥ nhưng loss chưa bằng 0, vì xác suất chưa hoàn toàn chắc chắn. Hai model có cùng nhãn dự đoán vẫn có thể khác log loss.

Nếu y=0 mà model báo p=0.99: `Li = −ln(1−0.99) = −ln(0.01) ≈ 4.605170`. Nếu báo p=0.5 thì loss ≈ 0.693147. Tự tin sai bị phạt nặng hơn nhiều.
:::

**Vì sao không giữ MSE?** MSE trên đầu ra sigmoid vẫn tính được, nhưng mục tiêu theo β nói chung **không lồi**, có thể có vùng phẳng/cực trị gây khó tối ưu. “Lồi” có thể hình dung như một chiếc bát: cực tiểu cục bộ cũng là cực tiểu toàn cục. Log loss kết hợp predictor tuyến tính là hàm lồi theo β và tương ứng với việc làm dữ liệu nhãn quan sát được có khả năng xảy ra cao nhất trong mô hình Bernoulli (một phép thử có hai kết quả). Tính lồi không bảo đảm luôn có nghiệm hữu hạn hoặc duy nhất; xem bẫy tách hoàn toàn bên dưới. Không kết luận MSE bị cấm cho mọi mô hình xác suất.

> **EN:** Binary log loss rewards probability assigned to the observed outcome and strongly penalizes confident mistakes. With a linear logistic predictor it is convex in the coefficients; squared error composed with a sigmoid is generally nonconvex.

### Một bước học hệ số thay vì chỉ dùng hệ số có sẵn

**Gradient** là vector độ dốc cho biết loss tăng nhanh theo hướng nào. Với một mẫu, đạo hàm log loss theo intercept là `p−y`, theo βj là `(p−y)xj`. Với loss trung bình, lấy trung bình các gradient mẫu. **Gradient descent** đi ngược hướng đó: `β ← β − α×gradient`; **α** là learning rate, độ lớn bước đi. Công thức này chưa có regularization.

:::worked Một mẫu dễ tính, chỉ để thấy hướng cập nhật
Tự soạn x=2, y=1; bắt đầu β0=0, β1=0, α=0.1. Ta có z=`0+0×2=0`, p=`φ(0)=0.5`, loss ban đầu `−ln(0.5)≈0.693147`.

1. Gradient intercept: `0.5−1 = −0.5`.
2. Gradient slope: `(0.5−1)×2 = −1`.
3. Cập nhật **đồng thời** từ gradient cũ: β0 mới = `0−0.1×(−0.5)=0.05`; β1 mới = `0−0.1×(−1)=0.1`.
4. z mới = `0.05+0.1×2=0.25`; p mới ≈ **0.562177**; loss mới ≈ **0.575939**.

Xác suất lớp thật tăng, loss giảm ở bước này. Một mẫu không đủ để đánh giá tổng quát hóa; bước quá lớn cũng có thể làm tối ưu kém. sklearn dùng solver tối ưu lặp, không bắt buộc đúng vòng gradient descent thủ công này.
:::

> **EN:** For mean unregularized log loss, average the sample gradients (p−y)x, including a constant feature for the intercept. Update coefficients together from the old gradient; practical solvers need not use plain gradient descent.

## Giảm hay tăng ngưỡng để tăng recall? (ngoài slide)

Hãy tưởng tượng một máy sàng lọc: ngưỡng cao chỉ báo dương khi rất chắc; ngưỡng thấp cho nhiều hồ sơ vào nhóm cần kiểm tra hơn. Quy ước **positive** (dương) là lớp 1. Như [[bài:confusion-matrix]]: **TP** là dương thật báo dương, **FP** là âm thật báo dương, **FN** là dương thật bị bỏ sót, **TN** là âm thật báo âm.

Theo [[bài:classification-metrics]], **precision** (độ chính xác của nhóm báo dương) = `TP/(TP+FP)`; **recall** (độ bao phủ lớp dương) = `TP/(TP+FN)`. Mẫu số recall là số dương thật, không đổi khi ta chỉ đổi ngưỡng trên cùng tập.

> **EN:** Lowering the threshold flags more samples. Recall measures how many actual positives are caught; precision measures how many flagged samples are truly positive.

:::worked Giữ nguyên xác suất, chỉ thay ngưỡng
Mười hồ sơ tự soạn, không phải tọa độ slide. p là xác suất **đã cố định**, chưa cần biết mô hình nào sinh ra nó. Dùng quy tắc p≥t là dương; ở đây không có p đúng bằng ba ngưỡng.

| Hồ sơ | p | y thật | ŷ ở 0.7 | ŷ ở 0.5 | ŷ ở 0.3 |
|---|---|---|---|---|---|
| A | 0.95 | 1 | 1 | 1 | 1 |
| B | 0.85 | 1 | 1 | 1 | 1 |
| C | 0.75 | 0 | 1 | 1 | 1 |
| D | 0.65 | 1 | 0 | 1 | 1 |
| E | 0.55 | 0 | 0 | 1 | 1 |
| F | 0.45 | 1 | 0 | 0 | 1 |
| G | 0.35 | 0 | 0 | 0 | 1 |
| H | 0.25 | 1 | 0 | 0 | 0 |
| I | 0.15 | 0 | 0 | 0 | 0 |
| J | 0.05 | 0 | 0 | 0 | 0 |

- **t=0.7:** gọi A,B,C là dương. A,B là TP=2; C là FP=1. Bỏ sót D,F,H nên FN=3; âm thật còn E,G,I,J cho TN=4. Precision=`2/(2+1)=2/3`; recall=`2/(2+3)=2/5`.
- **t=0.5:** thêm D,E. D chuyển FN→TP; E chuyển TN→FP. TP=3, FP=2, FN=2, TN=3. Precision=`3/5`; recall=`3/5`.
- **t=0.3:** thêm F,G. F chuyển FN→TP; G chuyển TN→FP. TP=4, FP=3, FN=1, TN=2. Precision=`4/7`; recall=`4/5`.

| Ngưỡng | TP | FP | FN | TN | Precision | Recall |
|---|---|---|---|---|---|---|
| 0.7 | 2 | 1 | 3 | 4 | 0.666667 | 0.400000 |
| 0.5 | 3 | 2 | 2 | 3 | 0.600000 | 0.600000 |
| 0.3 | 4 | 3 | 1 | 2 | 0.571429 | 0.800000 |
:::

**Vì sao recall không giảm?** Khi hạ t, mọi hồ sơ từng được báo dương vẫn được báo dương. TP chỉ tăng hoặc giữ; FN chỉ giảm hoặc giữ; tổng `TP+FN=5` cố định. Do đó recall **tăng hoặc giữ nguyên**. Nếu khoảng ngưỡng vừa hạ không chứa thêm dương thật nào, recall giữ nguyên. Cái giá thường là FP tăng và precision giảm, như bảng; precision **không có bảo đảm đơn điệu**, vì nó phụ thuộc nhãn của những điểm vừa thêm. Tăng ngưỡng thì recall giảm hoặc giữ, thường đổi lấy nhóm dương đáng tin hơn.

Trên S-curve [[slide:68]], kéo đường ngang ngưỡng xuống làm nhiều vị trí trên đường cong vượt ngưỡng hơn. Với sigmoid tăng theo z, điểm cắt dịch về phía z nhỏ hơn. Trong nhiều feature, hãy nghĩ tới **vùng dự đoán dương mở rộng**, không khẳng định mọi feature x đều có hệ số dương.

Mỗi ngưỡng cho một điểm trên [[bài:roc-auc]]: trục tung TPR chính là recall; trục hoành FPR=`FP/(FP+TN)`. Ba điểm (FPR,TPR) ở bảng là **(0.2,0.4), (0.4,0.6), (0.6,0.8)**. Đổi ngưỡng không đổi xếp hạng p, nên không đổi ROC-AUC của cùng model trên cùng tập; nó đổi **điểm vận hành**.

> **EN:** With fixed scores, lowering the threshold produces a superset of predicted positives, so recall cannot decrease. Precision is not guaranteed to move monotonically. Threshold changes move the operating point, not the score ranking or ROC-AUC.

### Chọn ngưỡng theo chi phí, không theo thói quen

0.5 là mặc định thường dùng, không phải chân lý. Sàng lọc bệnh có thể ưu tiên giảm FN (bỏ sót) nhưng vẫn cần đủ năng lực xét nghiệm tiếp; lọc spam quá mạnh có thể làm mất email thật do FP. Đặt chi phí/recall mục tiêu trước, so các ngưỡng trên **validation**, chốt ngưỡng rồi mới đo test; không hạ ngưỡng chỉ vì thấy test recall thấp. Nối lại [[bài:train-test-split]] và [[bài:imbalanced-data]].

> **EN:** Choose the threshold from validation data using error costs, recall targets and operational capacity. Lock it before final test evaluation; a default of 0.5 is a convention, not a universal optimum.

## Đọc từng ưu/nhược trên slide 69

:::compare GOOD/BAD và điều kiện đi kèm
| Ý trên slide | Giải thích dễ hiểu và giới hạn |
|---|---|
| Ít overfit nhưng vẫn overfit ở dữ liệu nhiều chiều | Khung tuyến tính ít linh hoạt hơn nhiều mô hình phức tạp, nhưng nhiều feature so với mẫu vẫn dễ học nhiễu. Không có bảo đảm miễn overfit. |
| Hiệu quả khi feature tách tuyến tính | Một đường/siêu phẳng có thể là ranh giới hợp lý, như hình đỏ. Không cần tách hoàn hảo mới dùng được Logistic; các lớp thực tế có thể chồng lấn. |
| Dễ triển khai, train hiệu quả | Là baseline gọn, có solver tối ưu phổ biến và hệ số dễ kiểm tra. Thời gian còn phụ thuộc số mẫu, số feature, solver và hội tụ. |
| Không nên dùng khi quan sát ít hơn feature | Cảnh báo rủi ro quá nhiều tham số: hệ số khó xác định ổn định, dễ tách hoàn toàn. Không phải lệnh cấm mọi Logistic có regularization. |
| Giả định tuyến tính hiếm đúng | Phải kiểm **log-odds tuyến tính theo feature** có phù hợp không, không hiểu thành “xác suất là đường thẳng”. Không có tỉ lệ phổ quát chứng minh chữ “hiếm”. |
| Chỉ dự đoán “discrete functions” | Bài toán cuối là class rời rạc, còn xác suất nội bộ liên tục. Không dùng Logistic nhị phân để dự đoán trực tiếp giá nhà; chọn mô hình hồi quy cho target liên tục. |
:::

:::note Làm rõ câu chữ slide và phần mở rộng ngoài slide
Slide 69 ghi “Should not be used when the number of observations are lesser than the number of features” và “Can only be used to predict discrete functions”. Hai câu là cách nói giản lược; các điều kiện và diễn giải chính xác nằm ở bảng trên. Không biến lời cảnh báo thành kết luận rằng thư viện không fit được, hoặc sigmoid là hàm rời rạc.

**Ngoài slide:** regularization thêm hạng phạt để hạn chế hệ số; L1/L2 là hai dạng thường gặp. sklearn LogisticRegression mặc định có regularization L2; **C nhỏ hơn → phạt mạnh hơn**, với cấu hình penalty phù hợp. Chỉ nêu tên ở đây, chưa có bài riêng. Thêm feature đa thức/tương tác như [[bài:polynomial-regression]] có thể tạo ranh giới cong trong **input gốc**, nhưng vẫn tuyến tính theo feature mở rộng và tăng nguy cơ overfit.
:::

> **EN:** Slide 69's warnings need qualification: high-dimensional problems can still be modeled with suitable regularization and validation. The linearity assumption concerns log-odds in the supplied features, and the discrete target does not make predicted probabilities discrete.

## Linear và Logistic khác nhau thế nào? (ngoài slide)

:::compare Câu hỏi phỏng vấn kinh điển
| Trục so sánh | Linear Regression thông thường | Logistic Regression nhị phân |
|---|---|---|
| Bài toán | Hồi quy, ví dụ giá nhà | Phân loại, ví dụ đậu/trượt |
| Khung chung | z = β0 + β·x | Cùng tổng tuyến tính z; β·x là tổng βj xj |
| Hàm đầu ra | Identity: giữ nguyên z làm ŷ | Sigmoid(z) cho p; so ngưỡng cho ŷ |
| Miền đầu ra | Số thực không bị chặn | p trong (0,1); class 0/1 |
| Loss điển hình | MSE/SSE cho OLS | Log loss, thường thêm penalty |
| Học hệ số | Có biểu thức nghiệm OLS; solver least squares hoặc lặp | Tối ưu lặp như L-BFGS/Newton/gradient; không có nghiệm đóng OLS tương tự nói chung |
| Đánh giá | MAE, RMSE, R² | Accuracy, precision, recall; ROC-AUC đo score, log loss đo xác suất |
| Ưu điểm chung | Gọn, nhanh, hệ số tương đối dễ giải thích | Tương tự, hệ số đọc qua log-odds/odds |
| Hạn chế chung | Feature thiếu/nhiễu, cộng tuyến, điểm ảnh hưởng có thể làm fit bất ổn | Có các rủi ro tương ứng, cộng thêm lựa chọn ngưỡng, cân bằng lớp và hiệu chuẩn xác suất |
:::

Ý “hai cái từ một khung mà ra” đúng ở tổng tuyến tính và nhiều hạn chế biểu diễn; **không có nghĩa ưu/nhược giống hệt**. OLS phạt bình phương residual không giới hạn, còn Logistic dùng loss nhãn nhị phân; mức nhạy outlier không thể đánh đồng. Feature cực đoan hoặc nhãn sai vẫn có thể ảnh hưởng mạnh tới Logistic. [[bài:correlation-multicollinearity]] giải thích vì sao feature tương quan làm từng hệ số bất ổn, dù dự đoán đôi khi còn dùng được.

Tên có chữ **regression** vì ta mô hình hóa log-odds bằng biểu thức hồi quy tuyến tính; mục tiêu ứng dụng ở đây vẫn là **classification**. Đừng phân loại thuật toán theo tên tiếng Việt “hồi quy”; hãy hỏi target là gì và quyết định cuối là gì.

> **EN:** Linear and Logistic Regression share a linear predictor but differ in response model, loss, estimation and evaluation. Logistic Regression models linear log-odds for classification; shared structure does not make all robustness properties identical.

## Thực hành và code sklearn (ngoài slide)

**Scale** feature giúp penalty không bị chi phối bởi đơn vị và hỗ trợ nhiều solver hội tụ; xem [[bài:feature-scaling]]. Fit scaler chỉ trên train, hoặc train của từng fold. **Pipeline** gói scaler và classifier để lúc predict dùng đúng mean/std đã học, tránh leakage. Accuracy có thể đánh lừa khi lớp hiếm; `class_weight` là tùy chọn đổi trọng số khi học, khác với đổi ngưỡng sau học và không thay cho đánh giá theo chi phí.

`predict_proba` trả xác suất theo thứ tự `classes_`; cần lấy đúng cột lớp 1. `predict` trả nhãn theo quy tắc mặc định của estimator; bài chủ động dùng `p>=t` để kiểm soát cả trường hợp bằng ngưỡng. sklearn nhị phân dùng điểm quyết định >0 cho lớp thứ hai, nên tại đúng p=0.5 có thể khác quy ước ≥ của bài. Các ví dụ đếm ngưỡng và demo dưới không có điểm bằng ngưỡng; đừng dựa vào làm tròn để quyết định lớp.

> **EN:** Scale within a pipeline, inspect classes_ before selecting probability columns, and distinguish class weighting during fitting from thresholding afterward. Define tie handling explicitly instead of assuming every API uses the same equality rule.

Cài `pip install numpy scikit-learn`. Code dưới tự đủ imports, dữ liệu **giả lập**, seed 42. Sinh hai feature số chuẩn rồi sinh nhãn từ xác suất biết trước; nhãn vẫn có ngẫu nhiên nên không tách hoàn hảo. Tách train/validation/test có `stratify` để giữ gần tỉ lệ lớp; ví dụ độc lập này dùng random split, còn thời gian/khách lặp cần split phù hợp.

```python
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_score, recall_score, roc_auc_score

# Dữ liệu giả lập: X có 400 hàng, 2 feature; y là nhãn 0/1.
rng = np.random.default_rng(42)
X = rng.normal(size=(400, 2))
true_p = 1 / (1 + np.exp(-(-0.8 + 1.4*X[:, 0] - 0.7*X[:, 1])))
y = rng.binomial(1, true_p)

# Giữ test riêng; validation dùng chọn ngưỡng, không fit model/scaler.
X_dev, X_test, y_dev, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
X_train, X_val, y_train, y_val = train_test_split(
    X_dev, y_dev, test_size=0.25, random_state=42, stratify=y_dev
)
model = make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=1000))
model.fit(X_train, y_train)
clf = model.named_steps["logisticregression"]
print("split:", len(y_train), len(y_val), len(y_test))
print("classes:", clf.classes_)
# Hệ số ứng với feature đã chuẩn hóa; intercept ứng với mean train.
print("intercept:", np.round(clf.intercept_, 6))
print("coefficients:", np.round(clf.coef_, 6))
positive_column = np.flatnonzero(clf.classes_ == 1)[0]
p_val = model.predict_proba(X_val)[:, positive_column]

# Mục tiêu minh họa chốt trước: recall validation >= 0.8;
# trong ba ứng viên đạt mục tiêu, lấy ngưỡng cao nhất.
rows = []
print("threshold TP FP FN TN precision recall (validation)")
for t in [0.7, 0.5, 0.3]:
    pred = (p_val >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_val, pred, labels=[0, 1]).ravel()
    precision = precision_score(y_val, pred, zero_division=0)
    recall = recall_score(y_val, pred, zero_division=0)
    rows.append((t, recall))
    print(f"{t:.1f} {tp} {fp} {fn} {tn} {precision:.6f} {recall:.6f}")
eligible = [t for t, recall in rows if recall >= 0.8]
if not eligible:
    raise RuntimeError("Chưa có ứng viên đạt mục tiêu; chưa dùng test để chữa.")
chosen_t = max(eligible)
print("chosen threshold:", chosen_t)

# Chốt model và ngưỡng, đánh giá test một lần; không tune theo kết quả này.
p_test = model.predict_proba(X_test)[:, positive_column]
test_pred = (p_test >= chosen_t).astype(int)
print("test confusion [[TN,FP],[FN,TP]]:")
print(confusion_matrix(y_test, test_pred, labels=[0, 1]))
print("test precision:", round(precision_score(y_test, test_pred, zero_division=0), 6))
print("test recall:", round(recall_score(y_test, test_pred, zero_division=0), 6))
# AUC nhận xác suất, không truyền test_pred là nhãn cứng.
print("test ROC-AUC:", round(roc_auc_score(y_test, p_test), 6))
print("default predict first 5:", model.predict(X_test[:5]))
```

Kết quả đã chạy với NumPy 2.5.4 / sklearn 1.9.1: train/validation/test = **240/80/80**. Intercept = **−0.477270**, hai hệ số sau scale = **1.131367, −0.409148**. Đây là hệ số ước lượng trên dữ liệu hữu hạn có nhiễu, không buộc bằng hệ số sinh nhãn.

| Ngưỡng validation | TP | FP | FN | TN | Precision | Recall |
|---|---|---|---|---|---|---|
| 0.7 | 8 | 1 | 24 | 47 | 0.888889 | 0.250000 |
| 0.5 | 20 | 8 | 12 | 40 | 0.714286 | 0.625000 |
| 0.3 | 30 | 24 | 2 | 24 | 0.555556 | 0.937500 |

Chọn **t=0.3** vì chỉ ứng viên này đạt recall validation≥0.8. Test sau khi chốt cho ma trận `[[22,26],[3,29]]` theo thứ tự `[[TN,FP],[FN,TP]]`, precision **0.527273**, recall **0.906250**, ROC-AUC **0.723307**. Năm nhãn `predict` mặc định đầu tiên là `[0,0,0,0,0]`. Không lẫn bảng validation này với mười hồ sơ tính tay ở trên; kết quả test chỉ minh họa dữ liệu giả lập.

Mục tiêu recall 0.8 là lựa chọn minh họa, không phải chuẩn chung. Chọn ngưỡng từ ba ứng viên không bảo đảm tối ưu mọi ngưỡng. Không refit model sau khi chọn t trong demo này, vì refit có thể đổi xác suất và cần quy trình kiểm chứng ngưỡng tương ứng. `zero_division=0` quy ước precision bằng 0 nếu không có dự đoán dương, thay vì chia cho 0; cần báo rõ tình huống ấy khi đánh giá thực tế.

> **EN:** This synthetic example chooses among three validation thresholds under a predefined recall target, then evaluates a fixed model and threshold once on test data. Validation recall is an estimate, not a guarantee for deployment.

### Nhiều lớp thì sao? (ngoài slide)

**One-vs-Rest** (một lớp so với phần còn lại) học một bài toán nhị phân cho mỗi lớp rồi kết hợp điểm. **Softmax**, dùng trong multinomial Logistic Regression, biến nhiều điểm số thành vector xác suất các lớp có tổng bằng 1. Chỉ cần biết có hai hướng mở rộng; bài này tập trung nhị phân, không lấy một sigmoid duy nhất để mã hóa ba lớp.

> **EN:** Multiclass extensions include One-vs-Rest and multinomial Logistic Regression with softmax. A single binary sigmoid is not a three-class probability model.

Nguồn đối chiếu phần ngoài slide: [mô hình logistic và mục tiêu tối ưu](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression), [LogisticRegression, C và solver](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html), [chọn threshold bằng validation](https://scikit-learn.org/stable/modules/classification_threshold.html).

## Những bẫy dễ mắc (ngoài slide)

:::pitfall Thấy chữ “hồi quy” thì dùng dự đoán giá nhà
Logistic Regression là bộ phân loại trong phạm vi bài này. Giá nhà liên tục cần regressor; p=0.8 là xác suất lớp 1, không phải giá bằng 0.8.
:::

:::pitfall Ngưỡng 0.5 là bắt buộc; hạ ngưỡng luôn làm precision giảm
0.5 chỉ là mặc định. Recall không giảm khi hạ t trên cùng score; precision có thể tăng nếu những điểm mới thêm đều đúng. Bảng trong bài minh họa precision giảm, không chứng minh quy luật cho mọi dữ liệu.
:::

:::pitfall Xác suất 0.8 mặc định đã hiệu chuẩn tốt
Mô hình có thể tự tin sai: trong nhóm báo 0.8, tỉ lệ dương thực tế không buộc là 80%. Hiệu chuẩn (calibration) cần kiểm riêng trên dữ liệu độc lập; xác suất trong [0,1] mới chỉ là điều kiện miền giá trị.
:::

:::pitfall Accuracy cao là đủ cho lớp hiếm
Nếu chỉ 1% hồ sơ gian lận, luôn báo bình thường đạt accuracy 99% nhưng recall gian lận bằng 0. Kiểm precision/recall, tải duyệt nhầm và chi phí; xem [[bài:imbalanced-data]].
:::

:::pitfall Quên scale hoặc fit scaler cả test
Feature tiền tính bằng đồng có thể khác hàng nghìn lần feature số lần mua; penalty và điều kiện số chịu tác động của đơn vị. Dùng Pipeline fit train, không fit scaler cả bảng rồi mới split.
:::

:::pitfall β tăng 0.7 nghĩa là xác suất tăng 0.7
Hệ số tác động cộng lên log-odds, nhân lên odds. Ví dụ odds nhân e^0.7≈2.013753; từ p=0.5 chuyển thành khoảng 0.668188, không phải 1.2.
:::

:::pitfall Tách hoàn toàn nên hệ số càng lớn càng tốt
Ngoài slide: khi dữ liệu tách hoàn toàn và không regularization, tối ưu log loss có thể đẩy độ lớn hệ số ra vô hạn thay vì có nghiệm hữu hạn; regularization và validation giúp kiểm soát, không coi hệ số phình là bằng chứng model tốt.
:::

> **EN:** Keep task definition, threshold choice, calibration, imbalance, preprocessing and coefficient interpretation separate. Perfect separation can make unregularized coefficient estimates diverge.

## Tóm tắt 1 phút

:::recap
- Hồi quy logistic (Logistic Regression) dùng cho classification: z tuyến tính → sigmoid → p → so ngưỡng → class.
- φ là ký hiệu sigmoid trên slide; φ(0)=0.5, tăng theo z, có miền (0,1).
- Ở ngưỡng 0.5, ranh giới là z=0; đường p cong nhưng ranh giới tuyến tính theo feature.
- Log-odds = ln(p/(1−p)) = z; tăng xj một đơn vị nhân odds với e^βj.
- Học bằng log loss, không fit OLS rồi gắn sigmoid; năm điểm ví dụ có loss trung bình 0.196661.
- Hạ ngưỡng → TP không giảm, FN không tăng → recall tăng hoặc giữ; precision thường giảm nhưng không bắt buộc.
- Chọn ngưỡng bằng validation theo chi phí, không dùng test để tune; AUC nhận score/xác suất.
- Scale trong train, kiểm lớp hiếm và xác suất hiệu chuẩn; regularization không thay đánh giá độc lập.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Tính φ(−2), rồi dự đoán ở ngưỡng 0.5 và 0.1.
A: **p≈0.119203; lớp lần lượt 0 và 1.** Tính e²≈7.389056, cộng 1 được 8.389056, lấy nghịch đảo. So xác suất chưa làm tròn với ngưỡng; đổi ngưỡng không đổi p.
Q: Với z=−4+x, x=6, hãy đi đủ các bước ra class ở t=0.9.
A: **Dự đoán lớp 0.** z=−4+6=2; e⁻²≈0.135335, p=1/(1+0.135335)≈0.880797. Vì p<0.9 nên lớp 0, dù ở ngưỡng 0.5 sẽ là lớp 1.
Q: Trong bảng mười hồ sơ, hạ ngưỡng từ 0.5 xuống 0.3 thay đổi những ô nào?
A: **TP từ 3 lên 4, FP từ 2 lên 3, FN từ 2 xuống 1, TN từ 3 xuống 2.** F chuyển FN→TP, G chuyển TN→FP; recall từ 3/5=0.6 lên 4/5=0.8, precision từ 3/5=0.6 xuống 4/7≈0.571429.
Q: p=0.8 có odds bao nhiêu? Hệ số 0.7 nhân odds lên bao nhiêu lần?
A: **Odds=4, hệ số cho hệ số nhân khoảng 2.013753.** Lấy 0.8/(1−0.8)=4, rồi e^0.7≈2.013753; không nhân trực tiếp p với số đó. Ví dụ bắt đầu odds=1 thì p mới≈0.668188.
Q: y=0, p=0.99 thì log loss bao nhiêu? Vì sao nhãn đúng chưa chắc loss bằng 0?
A: **Loss≈4.605170.** Lấy −ln(1−0.99)=−ln(0.01). Log loss chấm xác suất của kết quả thật, không chỉ nhãn sau ngưỡng: mẫu y=1, p=0.5 được gọi đúng theo ≥ nhưng vẫn có loss≈0.693147.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Phân biệt Linear Regression và Logistic Regression.
A: **Linear dự đoán đại lượng; Logistic dùng xác suất để phân loại.** Cùng predictor z tuyến tính, nhưng Linear/OLS giữ z và tối ưu SSE/MSE, Logistic qua sigmoid và học bằng log loss, thường kèm penalty. Ví dụ giá nhà dùng MAE/RMSE; có bán được nhà không dùng precision/recall và ngưỡng theo chi phí. Hệ số và rủi ro có phần tương ứng, không giống hệt.
EN: Both share a linear predictor, but OLS predicts a numeric response using squared loss, whereas binary Logistic Regression models a class probability using a sigmoid and log loss.
Q: **B2.** Vì sao có chữ Regression mà lại là Classification?
A: **Vì mô hình hồi quy log-odds, còn target là lớp.** ln(p/(1−p)) được mô tả bằng β0+β·x; sigmoid đưa về xác suất rồi ngưỡng tạo class. Ví dụ p=0.8 có thể dẫn tới “đậu”, không phải điểm thi 0.8.
EN: The regression structure describes log-odds as a linear function of predictors; the modeled outcome is categorical, so the task is classification.
Q: **B3.** Sigmoid dùng để làm gì, có tính chất gì?
A: **Đưa điểm thực z vào (0,1) để mô hình hóa xác suất.** Hàm tăng, φ(0)=0.5, φ(−z)=1−φ(z), tiệm cận 0/1; ngưỡng là bước riêng. Ví dụ z=2 cho p≈0.880797, nhưng nếu t=0.9 thì vẫn dự đoán lớp 0.
EN: The sigmoid maps a real score to (0,1), is increasing, equals 0.5 at zero, and is symmetric through σ(−z)=1−σ(z); classification requires a separate decision rule.
Q: **B4.** Giảm hay tăng threshold để tăng recall, vì sao?
A: **Giảm threshold để recall tăng hoặc giữ trên cùng tập score.** Tập báo dương mở rộng nên TP không giảm, FN không tăng; số dương thật cố định. Ví dụ từ t=0.5 xuống 0.3 trong bài, recall 0.6→0.8 và FP 2→3; kiểm cả precision/chi phí trên validation vì precision không bảo đảm đơn điệu.
EN: Lowering the threshold cannot reduce recall for fixed scores, since predicted positives form a superset. It can increase false positives; precision need not be monotonic.
Q: **B5.** Vì sao Logistic thường dùng log loss thay vì MSE?
A: **Log loss phù hợp mô hình nhãn nhị phân và cho mục tiêu lồi theo hệ số tuyến tính.** MSE ghép sigmoid nói chung không lồi, trong khi log loss còn phạt tự tin sai rất mạnh. Ví dụ y=0,p=0.99 cho loss≈4.605170; không suy ra MSE bị cấm cho mọi bài toán xác suất.
EN: Binary log loss matches the Bernoulli likelihood and yields a convex objective for a linear logistic predictor; squared error composed with sigmoid is generally nonconvex.
Q: **B6.** Diễn giải hệ số trong Logistic như thế nào?
A: **Tăng feature một đơn vị làm log-odds tăng β và odds nhân e^β, giữ các feature khác cố định.** Cần nói rõ đơn vị, nhất là sau scale, và không suy nhân quả. Ví dụ β=0.7 nhân odds≈2.013753; p ban đầu 0.5 chuyển≈0.668188, không tăng 0.7.
EN: A one-unit predictor increase adds β to log-odds and multiplies odds by exp(β), conditional on other modeled features; probability changes depend on the starting value.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Sàng lọc bệnh hiếm cần recall cao, nhưng phòng xét nghiệm có giới hạn lượt mỗi ngày. Bạn chọn ngưỡng ra sao?
A: **Chọn trên validation theo mục tiêu bỏ sót và năng lực xử lý, không chỉ hạ ngưỡng tối đa.** Xác định lớp dương, nhãn đáng tin và split phản ánh triển khai; so recall, precision, số FP và tổng lượt báo dương ở các ngưỡng. Hạ ngưỡng thường bắt thêm ca thật lẫn báo nhầm, nên thống nhất mức vận hành với đội chuyên môn, chốt rồi kiểm test độc lập. Không bảo đảm recall validation giữ nguyên khi tỉ lệ bệnh/dữ liệu đổi.
WANT: Kết nối class hiếm, chi phí FN/FP và công suất thực tế; biết ngưỡng phải chọn ngoài test.
Q: **C2.** Dự đoán khách rời bỏ để gửi ưu đãi. Team muốn dùng p để xếp hạng và gửi cho mọi khách p≥0.5. Bạn đề xuất gì?
A: **Tách đánh giá xếp hạng khỏi chính sách gửi.** Dùng score để ưu tiên, nhưng chọn ngưỡng hoặc số khách trên validation theo ngân sách, chi phí ưu đãi và giá trị giữ khách; kiểm hiệu chuẩn nếu dùng p tính lợi ích kỳ vọng. Ví dụ khách có nguy cơ cao chưa chắc phản hồi ưu đãi; đo hiệu quả chiến dịch bằng thử nghiệm thích hợp, không coi xác suất churn là tác động nhân quả của việc gửi.
WANT: Phân biệt ranking, quyết định theo chi phí và hiệu quả can thiệp; không mặc định 0.5 tối ưu kinh doanh.
Q: **C3.** Duyệt khoản vay cần giải thích. Một hệ số sau StandardScaler bằng 0.7, bạn trình bày sao?
A: **Nói một độ lệch chuẩn theo train làm odds của lớp 1 nhân khoảng 2.01, giữ biến khác cố định.** Xác nhận lớp 1 là vỡ nợ hay trả đúng hạn trước khi nói tăng/giảm rủi ro; không diễn giải thành xác suất tăng 70 điểm phần trăm. Kiểm cộng tuyến, độ ổn định theo nhóm/thời gian và quy trình dùng feature có sẵn lúc duyệt; hệ số dễ đọc không tự chứng minh công bằng hay đủ căn cứ cho quyết định thực tế.
WANT: Giải thích đúng đơn vị, hướng class và giới hạn của hệ số; biết diễn giải model không thay thế kiểm chứng quyết định.
Q: **C4.** Model gian lận báo accuracy 99% nhưng không bắt được vụ nào. Có nên giữ vì số cao?
A: **Không dùng accuracy đó làm bằng chứng hữu ích.** Nếu gian lận chỉ 1%, luôn báo bình thường cũng đạt 99%, trong khi recall=0. Kiểm confusion matrix, phân bố score, precision/recall và chi phí; so baseline, thử ngưỡng trên validation và kiểm nhãn/leakage trước khi đổi model hoặc class_weight. Chốt cấu hình rồi đo test; tăng recall có thể tăng tải duyệt nhầm nên cần ngân sách xử lý.
WANT: Nhìn ra baseline lớp đa số và thiết kế đánh giá theo giá trị phát hiện, không chỉ theo một metric tổng hợp.
:::

## Nối sang bài sau

:::next
Quay lại [[bài:supervised-algorithms]] để đặt [[bài:linear-regression]], [[bài:polynomial-regression]] và hồi quy logistic vào đúng nhóm. Tiếp theo là [[bài:svm]], bắt đầu ở slide 70: trong trường hợp tách tuyến tính, SVM hướng tới biên có khoảng cách tới các điểm gần nhất lớn nhất (maximum margin), còn Logistic học ranh giới theo log loss và regularization.

Thực hành: [[bài:diabetes-first-model]] — tự gõ logistic từ csv đến prediction trên dữ liệu diabetes.
:::
