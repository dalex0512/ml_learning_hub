---
title: Hồi quy logistic (Logistic Regression)
order: 4
description: "Hồi quy logistic (slide 68-69): sigmoid biến điểm tuyến tính thành xác suất, tính tay xác suất và log loss, ngưỡng đổi precision/recall đo trên Diabetes."
slides: 68-69
needs: [linear-regression, classification-vs-regression, confusion-matrix, classification-metrics, loss-function]
tags: [logistic-regression, sigmoid, classification, threshold, log-loss, odds, decision-boundary]
---

## Từ dự đoán một con số sang dự đoán một lớp

:::intro Mục tiêu bài này
- Hiểu vì sao dùng đường thẳng cho nhãn 0/1 là **sai**, và **sigmoid** (S-curve ở slide 68) sửa điều đó thế nào.
- Tính tay xác suất và **log loss** của một mẫu; hiểu odds.
- Hiểu ngưỡng đổi precision và recall (đo thật trên Diabetes), đọc trọng số, và biết ưu nhược của model.
:::

## Vấn đề: đường thẳng cho nhãn 0/1

Dự đoán "đậu hay rớt" từ số giờ học. Nếu dùng hồi quy tuyến tính ([[bài:linear-regression]]), đầu ra là một con số bất kỳ, có thể −0.3 hoặc 1.4: không đọc được như xác suất. Ta giữ ý tưởng **điểm tuyến tính** `z = w·x + b` nhưng đưa nó qua hàm **sigmoid** để ép về khoảng (0, 1):

> p = σ(z) = 1 / (1 + e^(−z))

p là **xác suất thuộc lớp 1**. Ta đoán lớp 1 khi p ≥ ngưỡng (mặc định 0.5, tức z ≥ 0).

:::ck
Vì sao không dùng hồi quy tuyến tính thẳng cho nhãn 0/1, chỉ cắt ở 0.5?
@answer
Một điểm **ngoại lai** (ví dụ một người học 100 giờ) kéo cả đường nghiêng đi, làm đổi điểm cắt 0.5 cho những người ở vùng giữa. Đầu ra cũng vượt ngoài [0, 1]. Sigmoid giới hạn đầu ra và log loss không để một điểm xa phá cách phân chia.
:::

## Đọc slide 68

:::slides 68-69 | Slide 68–69: Logistic Regression, S-curve và ngưỡng, công thức sigmoid, đường phân tách và ưu nhược điểm
:::

- **S-curve:** các điểm lớp 0 nằm ở y = 0, lớp 1 ở y = 1; đường cong chữ S nối hai mức. **Threshold value** là đường đứt tại **0.5**; các điểm xanh trên đường cong ví dụ y = 0.3 (nằm dưới ngưỡng, đoán lớp 0) và y = 0.8 (trên ngưỡng, đoán lớp 1).
- **Hàm sigmoid** φ(z) = 1 / (1 + e^(−z)): z rất âm cho gần 0, z = 0 cho đúng 0.5, z rất dương cho gần 1.
- **Hình phân tán xanh/vàng** (slide 69): hai lớp tách bằng **một đường thẳng**. Đó là ranh giới của Logistic: z = 0.

## Tính tay một dự đoán

:::steps
Giả sử w = 1.2 và b = −6, x là số giờ học. Điểm z = 1.2·x − 6.
@step
**x = 5 giờ:** z = 0, p = σ(0) = **0.5**. Đây là điểm chuyển: đúng ngưỡng.
@step
**x = 7 giờ:** z = 2.4, p = σ(2.4) = **0.917**. Học nhiều: gần như chắc đậu.
@step
**x = 3 giờ:** z = −2.4, p = σ(−2.4) = **0.083**. Học ít: gần như chắc rớt.
@step
**Log loss** (loss để học): với sinh viên **đã đậu (y = 1)**, nếu model cho p = 0.917 thì loss = −ln(0.917) = **0.087** (nhỏ, đoán đúng và tự tin); nếu model cho p = 0.083 thì loss = −ln(0.083) = **2.487** (lớn, đoán sai và tự tin). Log loss phạt nặng việc **tự tin mà sai** ([[bài:loss-function]]).
:::

Một cách nhìn khác: **odds** = p / (1 − p). Với p = 0.8, odds = 4 (khả năng lớp 1 gấp 4 lần lớp 0), và **log-odds = ln 4 = 1.386**. Logistic Regression thực chất giả định log-odds là hàm tuyến tính của feature: chữ "regression" nằm ở chỗ đó, còn đầu ra cuối cùng là xác suất để phân loại.

Hãy tự kéo: `w` làm đường dốc hơn, `b` dịch điểm chuyển, ngưỡng đổi precision và recall.

:::widget logistic-play
:::

## Ngưỡng đổi precision và recall: số thật trên Diabetes

:::predict
Ta **hạ** ngưỡng từ 0.5 xuống 0.3. Model sẽ báo "bệnh" nhiều hơn hay ít hơn, và recall đổi thế nào?
@answer
Báo **nhiều hơn**; recall **tăng**, còn precision **giảm** vì kéo thêm cả người không bệnh vào. Số đo ngay dưới đây xác nhận.
:::

Logistic Regression có scale, chia 80/20 (`random_state=42`), bộ test 154 người, mức sàn đoán toàn 0 là 0.643:

| Ngưỡng | Số người báo bệnh | Accuracy | Precision | Recall |
|---|---|---|---|---|
| 0.3 | 77 | 0.688 | 0.545 | **0.764** |
| 0.5 | 57 | 0.753 | 0.649 | 0.673 |
| 0.7 | 33 | **0.779** | **0.818** | 0.491 |

Hạ ngưỡng xuống 0.3 bắt thêm 20 người (recall 0.673 lên 0.764) nhưng precision tụt 0.649 xuống 0.545. Nâng lên 0.7 thì ngược lại. **Accuracy cao nhất ở 0.7 không có nghĩa là ngưỡng tốt nhất**: nếu bỏ sót ca bệnh đắt hơn báo nhầm, ta chọn ngưỡng thấp ([[bài:classification-metrics]]).

## Đọc model và dùng nó

Sau khi scale, trọng số của 8 cột trên Diabetes: Glucose **1.071**, BMI 0.778, Age 0.421, DiabetesPedigreeFunction 0.231, Pregnancies 0.213, SkinThickness 0.046, Insulin −0.201, BloodPressure −0.248; intercept −0.886. `w > 0` đẩy về lớp 1, `w < 0` đẩy về lớp 0; so độ lớn giữa các cột có nghĩa **chỉ khi đã scale** ([[bài:feature-scaling]]). Người đầu tiên của bộ test có z = −0.958, p = 0.277, nên bị đoán không bệnh.

Slide 69 liệt kê ưu và nhược:

- **Ưu:** ít bị overfitting hơn (nhưng vẫn có thể overfit khi số feature rất lớn), hiệu quả khi các lớp **tách tuyến tính**, dễ cài đặt và huấn luyện.
- **Nhược:** không nên dùng khi **số quan sát ít hơn số feature**; giả định tuyến tính hiếm khi đúng hoàn toàn; chỉ dự đoán được đầu ra **rời rạc** (các lớp), không phải giá trị liên tục.

:::ck
Hai người có z = 2.4 và z = 0.1. Ai có xác suất lớp 1 cao hơn, và cả hai có cùng nhãn dự đoán ở ngưỡng 0.5 không?
@answer
Người z = 2.4 (p = 0.917) cao hơn người z = 0.1 (p ≈ 0.525). Ở ngưỡng 0.5 **cả hai cùng bị đoán lớp 1**, nhưng độ chắc chắn rất khác: xác suất cho thêm thông tin mà nhãn không có.
:::

## Code: chọn ngưỡng bằng validation, đo test một lần

Ở bảng ngưỡng phía trên ta so các ngưỡng ngay trên bộ test để **hiểu** cách ngưỡng đổi precision và recall. Khi thật sự **chọn** ngưỡng, quy trình đúng là chọn trên validation rồi đo test đúng một lần. Ví dụ dưới đặt mục tiêu minh họa "recall trên validation ít nhất 0.7" (đây là lựa chọn của ví dụ, không phải chuẩn chung) và lấy ngưỡng cao nhất đạt mục tiêu. Chia ba phần 60/20/20 có phân tầng, nên số liệu khác với bảng ngưỡng phía trên (chia 80/20 không phân tầng):

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_score, recall_score, roc_auc_score

d = pd.read_csv("diabetes.csv")
X, y = d.drop(columns="Outcome"), d["Outcome"]
X_dev, X_test, y_dev, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
X_train, X_val, y_train, y_val = train_test_split(
    X_dev, y_dev, test_size=0.25, random_state=42, stratify=y_dev)      # 460 / 154 / 154

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_train, y_train)
col = np.flatnonzero(model[-1].classes_ == 1)[0]     # predict_proba theo thứ tự classes_: lấy đúng cột lớp 1
p_val = model.predict_proba(X_val)[:, col]
rows = []
for t in [0.7, 0.5, 0.3]:
    pred = (p_val >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_val, pred, labels=[0, 1]).ravel()
    rows.append((t, recall_score(y_val, pred)))
    print(t, tp, fp, fn, tn, round(precision_score(y_val, pred), 3), round(recall_score(y_val, pred), 3))
chosen_t = max(t for t, r in rows if r >= 0.7)       # ngưỡng cao nhất vẫn đạt mục tiêu
p_test = model.predict_proba(X_test)[:, col]
test_pred = (p_test >= chosen_t).astype(int)         # chốt xong, đo test một lần, không chỉnh theo kết quả này
print(chosen_t, confusion_matrix(y_test, test_pred, labels=[0, 1]))
print(precision_score(y_test, test_pred), recall_score(y_test, test_pred), roc_auc_score(y_test, p_test))
```

| Ngưỡng (validation) | TP | FP | FN | TN | Precision | Recall |
|---|---|---|---|---|---|---|
| 0.7 | 21 | 4 | 33 | 96 | 0.840 | 0.389 |
| 0.5 | 33 | 10 | 21 | 90 | 0.767 | 0.611 |
| **0.3** | 43 | 28 | 11 | 72 | 0.606 | **0.796** |

Chỉ ngưỡng 0.3 đạt mục tiêu recall, nên chọn 0.3. Đo test một lần cho ma trận `[[TN, FP], [FN, TP]] = [[70, 30], [11, 43]]`, precision **0.589**, recall **0.796**, ROC AUC **0.822** (AUC nhận **xác suất**, không phải nhãn cứng). Recall trên test (0.796) gần với validation (0.796), một dấu hiệu tốt, nhưng precision chỉ 0.589: đổi lấy recall cao là chấp nhận báo nhầm nhiều hơn. Chọn ngưỡng từ ba ứng viên không bảo đảm đã tối ưu mọi ngưỡng; và đừng refit model hay đổi ngưỡng sau khi đã nhìn test.

**Nhiều lớp thì sao?** Logistic Regression mở rộng cho nhiều lớp theo **One-vs-Rest** (học một bài toán nhị phân cho mỗi lớp, một lớp so với phần còn lại, rồi kết hợp điểm) hoặc theo **softmax** (multinomial), biến điểm của mọi lớp thành một phân phối xác suất có tổng bằng 1. Tham số `C` của `LogisticRegression` là **nghịch đảo** độ mạnh regularization: C nhỏ phạt mạnh hơn, hệ số nhỏ hơn.

## Những hiểu sai thường gặp

- **"Logistic Regression là hồi quy."** Nó phân loại; đầu ra là xác suất rồi cắt theo ngưỡng.
- **"p = 0.917 nghĩa là chắc 91.7% đúng."** Đó là xác suất model ước lượng, đáng tin chỉ khi model được hiệu chuẩn tốt.
- **"Ngưỡng 0.5 là bắt buộc."** Chỉ là mặc định; hãy chọn theo chi phí sai lầm.
- **"Trọng số lớn nhất là nguyên nhân gây bệnh."** Nó chỉ mô tả quan hệ model học, không phải nhân quả.
- **"So trọng số khi chưa scale."** Khác đơn vị thì không so được.
- **"Hơn mức sàn là tốt."** Test accuracy 0.753 chỉ hơn mức sàn 0.643 khoảng 11 điểm.

:::card Logistic Regression
- **z = w·x + b**, rồi **p = σ(z) = 1 / (1 + e^(−z))**: xác suất lớp 1; log-odds là hàm tuyến tính của feature.
- **Đoán lớp 1 khi p ≥ ngưỡng**; trên Diabetes ngưỡng 0.3 cho recall 0.764, precision 0.545; ngưỡng 0.7 cho recall 0.491, precision 0.818.
- **Log loss** phạt nặng tự tin mà sai (0.087 so với 2.487 trong ví dụ).
- **Trọng số đọc được** sau khi scale (Glucose 1.071 lớn nhất); ranh giới là một đường thẳng.
- **Không hợp** khi quan sát ít hơn feature hoặc ranh giới cong.
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
