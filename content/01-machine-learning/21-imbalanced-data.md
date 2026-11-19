---
title: Step 3.5 — Cân bằng dữ liệu (Imbalanced data)
order: 21
description: "Lớp hiếm làm model lệch: thử class_weight và ngưỡng trước, rồi resampling (slide 52 đến 54), và quy tắc vàng chỉ cân bằng trên train với số thật cho thấy cách sai thổi phồng điểm thế nào."
slides: 52-54
needs: [classification-metrics, stratified-k-fold]
tags: [smote, oversampling, undersampling, class-weight, imbalanced, threshold]
---

## Accuracy cao nhưng bỏ sót lớp ta cần tìm

:::intro Mục tiêu bài này
- Hiểu vì sao lớp hiếm làm model "lệch" và vì sao accuracy đánh lừa.
- Biết thử cách **nhẹ** trước (đổi ngưỡng, `class_weight`) rồi mới đến **resampling** (slide 52 đến 54): over-sampling (random, SMOTE, ADASYN) và under-sampling (ClusterCentroids).
- Nắm **quy tắc vàng**: chỉ cân bằng trên tập train, và thấy bằng số điểm test bị thổi phồng thế nào nếu làm sai.
:::

Một bộ dữ liệu gian lận chỉ có 1 giao dịch gian lận trong 1000. Model luôn đoán "không gian lận" đạt accuracy **99.9%** mà không bắt được vụ nào ([[bài:classification-metrics]]). Khi một lớp hiếm, model được "thưởng" khi đoán lớp đông, nên nó **lệch** về phía đó: ranh giới quyết định dịch vào vùng của lớp hiếm. Slide 52 vẽ đúng điều này: hình trái (*Without resampling*) cho vùng của lớp hiếm rất nhỏ; hình phải (*Using RandomOverSampler*) mở rộng vùng đó.

Bộ Diabetes lệch **nhẹ**: train có 401 mẫu không bệnh và 213 mẫu bệnh (65% và 35%). Nhẹ nên hiệu ứng hiện rõ vừa phải, rất hợp để quan sát.

## Thử cách nhẹ trước: `class_weight` và ngưỡng

`class_weight="balanced"` bảo model **phạt sai lớp hiếm nặng hơn** (theo tỉ lệ nghịch với số mẫu), không thêm hay bớt dữ liệu. Đổi ngưỡng ([[bài:classification-metrics]]) cho hiệu ứng tương tự mà bạn điều khiển tinh hơn.

:::predict
Trên bộ Diabetes (Logistic, cùng split của Project), bật `class_weight="balanced"` sẽ làm recall và precision của lớp bệnh đổi thế nào, và accuracy ra sao?
@answer
Recall **tăng nhẹ** (67.3% lên 70.9%), precision **giảm mạnh hơn** (64.9% xuống 55.7%), accuracy **giảm** (75.3% xuống 69.5%). Model báo "bệnh" nhiều hơn (từ 57 lên 70 người): bắt thêm người bệnh nhưng báo nhầm nhiều hơn. Đây là một **đánh đổi**, không phải cải thiện miễn phí.
:::

## Resampling: đổi dữ liệu thay vì đổi mô hình (slide 52 đến 54)

Hãy tự thử: chọn từng kỹ thuật và xem số mẫu hai lớp.

:::widget resample
:::

- **Over-sampling** (tăng lớp hiếm), slide 52 và 53:
  - **RandomOverSampler:** sao chép ngẫu nhiên mẫu lớp hiếm. Đơn giản, không thêm thông tin; dễ học vẹt.
  - **SMOTE:** tạo mẫu **mới** nằm trên đoạn nối hai mẫu hiếm gần nhau (nội suy).
  - **ADASYN:** giống SMOTE nhưng sinh nhiều điểm hơn ở vùng khó (gần biên lớp). Slide 53 so sánh ba cách trên một bộ ba lớp.
- **Under-sampling** (giảm lớp đông), slide 54: **ClusterCentroids** thay nhiều mẫu lớp đông bằng tâm của các cụm; hai lớp bằng nhau nhưng mất dữ liệu.

:::steps
**SMOTE tay.** Hai mẫu hiếm gần nhau: a = (2, 3) và b = (4, 7). Chọn hệ số ngẫu nhiên λ trong [0, 1], ví dụ λ = 0.25.
@step
Mẫu mới = a + λ(b − a) = (2, 3) + 0.25 × (2, 4) = **(2.5, 4.0)**. Nó nằm trên đoạn nối a và b, cách a một phần tư đường.
@step
Lặp lại cho tới khi hai lớp bằng nhau: với Diabetes, tạo thêm 401 − 213 = **188** mẫu hiếm mới.
:::

**Kết quả trên Diabetes** (Logistic, cùng train/test của Project; SMOTE tự cài vì máy này không có thư viện `imbalanced-learn`):

| Cách | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| Gốc | **0.753** | **0.649** | 0.673 | **0.661** |
| `class_weight="balanced"` | 0.695 | 0.557 | 0.709 | 0.624 |
| Random over-sampling | 0.695 | 0.557 | 0.709 | 0.624 |
| SMOTE (tay, k = 5) | 0.708 | 0.571 | **0.727** | 0.640 |
| Under-sampling | 0.695 | 0.557 | 0.709 | 0.624 |

Bốn cách "cân bằng" cho kết quả **gần y hệt nhau**: recall tăng vài điểm, precision và accuracy giảm. (Random over-sampling trùng `class_weight` vì sao chép mẫu có tác dụng như gán trọng số lớn hơn.) Không cách nào làm F1 tăng; chúng chỉ **dịch** điểm làm việc trên đường precision-recall, giống như hạ ngưỡng.

## Quy tắc vàng: chỉ cân bằng trên train

:::predict
Bạn dùng over-sampling trên **toàn bộ dữ liệu**, rồi mới chia train/test và huấn luyện một Random Forest. Điểm test có đáng tin không?
@answer
**Không.** Sao chép mẫu hiếm trước khi chia khiến cùng một mẫu xuất hiện **cả ở train lẫn test**; model gặp lại chính những gì nó đã học. Trên Diabetes, Random Forest đạt **accuracy 0.925 và recall 0.952** theo cách sai (oversample rồi chia), trong khi cách đúng (chia trước, đánh giá trên test thật) chỉ cho **accuracy 0.721 và recall 0.618**. Điểm "tốt hơn" là ảo.
:::

Cách đúng: **chia trước**, rồi resample **chỉ trên train**, tốt nhất bằng Pipeline của thư viện `imbalanced-learn` để mỗi fold của cross-validation tự resample đúng chỗ ([[bài:k-fold-cross-validation]]). **Validation và test giữ phân bố thật** của thế giới, vì đó là tình huống model sẽ gặp. Và đổi metric: dùng precision, recall, F1 hoặc đường Precision-Recall thay cho accuracy.

| Cách | Khi dùng |
|---|---|
| Đổi ngưỡng, `class_weight` | Thử đầu tiên; ít rủi ro |
| Over-sampling (SMOTE) | Lớp hiếm quá ít, model không học được |
| Under-sampling | Dữ liệu rất lớn |
| Thêm dữ liệu lớp hiếm | Nếu thu thập được, thường tốt nhất |

:::ck
Cân bằng dữ liệu áp dụng cho **mọi giá trị hiếm** (ví dụ một thành phố ít khách) hay chỉ cho **lớp nhãn**?
@answer
Chỉ cho **lớp nhãn** (target). Một giá trị hiếm của một feature (thành phố ít khách) không làm model lệch theo cách đó; xử lý nó là chuyện khác (gộp nhóm hiếm khi mã hóa, [[bài:categorical-encoding]]).
:::

:::ck
Sau khi dùng SMOTE trên train, bạn thấy accuracy trên **validation đã cân bằng** cũng cao. Có vấn đề gì?
@answer
Validation phải giữ **phân bố thật** (lệch). Nếu cũng cân bằng nó, bạn đang đo model trên một thế giới không có thật, nên precision và accuracy không phản ánh thực tế sử dụng. Chỉ train được resample.
:::

## Tính tay từng cách

**SMOTE bằng tay.** Lớp ít có 4 điểm hai chiều: A(2, 3), B(3, 5), C(5, 3), D(8, 6); dùng k = 2 láng giềng. Khoảng cách Euclid giữa các điểm lớp ít:

| | A | B | C | D |
|---|---|---|---|---|
| A | | 2.236 | 3.000 | 6.708 |
| B | 2.236 | | 2.828 | 5.099 |
| C | 3.000 | 2.828 | | 4.243 |
| D | 6.708 | 5.099 | 4.243 | |

Hai láng giềng gần nhất: A → {B, C}; B → {A, C}; C → {B, A}; D → {C, B}.

- **Điểm mới 1:** chọn A, láng giềng C, λ = 0.4: `A + 0.4 × (C − A) = (2, 3) + 0.4 × (3, 0) = (3.2, 3.0)`, nằm trên đoạn AC, cách A 40% quãng đường.
- **Điểm mới 2:** chọn D, láng giềng C, λ = 0.5: `D + 0.5 × (C − D) = (8, 6) + 0.5 × (−3, −3) = (6.5, 4.5)`, trung điểm DC.

D nằm xa nhóm A, B, C (khoảng cách gần nhất 4.243). Nếu giữa D và C có một cụm lớp đông, điểm (6.5, 4.5) sẽ rơi **ngay giữa vùng lớp đông**: đúng nhược điểm của SMOTE. So với `RandomOverSampler`: cần thêm 2 điểm thì bốc ngẫu nhiên có hoàn lại, ví dụ được B và B, thêm hai bản (3, 5), (3, 5) chồng đúng lên B, không có điểm mới nào.

**ADASYN: chia số điểm cần sinh.** Bốn điểm lớp ít, K = 5 láng giềng (trong toàn bộ dữ liệu), cần sinh G = 8 điểm. Đếm số láng giềng thuộc lớp đông:

| Điểm | Láng giềng lớp đông | r = Δ / 5 | r̂ = r / Σr | g = r̂ × 8 |
|---|---|---|---|---|
| P1 | 1 | 0.2 | 0.2 / 1.6 = 0.125 | **1** |
| P2 | 0 | 0.0 | 0 | **0** |
| P3 | 2 | 0.4 | 0.25 | **2** |
| P4 | 5 | 1.0 | 0.625 | **5** |

P2 nằm giữa lớp của nó nên **không** sinh điểm nào; P4 bị lớp đông bao quanh hoàn toàn nên nhận **5 trên 8** điểm mới. Nếu P4 thật sự là ca khó ở biên giới thì tốt; nếu P4 là **nhãn sai** (nhiễu), ADASYN đã "nhân bản lỗi" 5 lần. SMOTE thì chọn điểm gốc ngẫu nhiên: kỳ vọng mỗi điểm 2 điểm mới, không bảo đảm đúng 2 cho từng điểm.

**ClusterCentroids bằng tay.** Lớp đông có 6 điểm: (1, 1), (2, 1), (1, 2) và (8, 8), (9, 8), (8, 9); lớp ít có 2 điểm (4, 5), (5, 4). Cần giảm lớp đông xuống **2** điểm bằng K-Means với K = 2:

- Cụm 1: centroid = ((1 + 2 + 1)/3, (1 + 1 + 2)/3) = **(1.333, 1.333)**.
- Cụm 2: centroid = ((8 + 9 + 8)/3, (8 + 8 + 9)/3) = **(8.333, 8.333)**.

Sau resample, lớp 0 còn hai centroid, lớp 1 còn hai điểm: 2 và 2. Hai centroid vẫn đại diện cho **cả hai cụm** của lớp đông; nếu bỏ ngẫu nhiên 4 điểm, có thể xui xẻo giữ lại (1, 1) và (2, 1) và mất hẳn cụm thứ hai.

**`class_weight="balanced"` bằng tay.** Train Diabetes: n = 614, n₀ = 400, n₁ = 214, hai lớp.

- w₀ = 614 / (2 × 400) = **0.7675**; w₁ = 614 / (2 × 214) ≈ **1.4346**.
- Tỉ lệ w₁ / w₀ ≈ **1.869** = 400 / 214.
- Tổng trọng số: 400 × 0.7675 = **307**; 214 × 1.4346 ≈ **307**: hai lớp đóng góp ngang nhau vào loss.

**Đặt sampler đúng chỗ khi dùng thư viện.** Cài `imbalanced-learn` (`pip install imbalanced-learn`, import bằng tên `imblearn`). Điều quan trọng không phải tên lớp mà là **vị trí**: sampler đứng **trong** `Pipeline` của `imblearn` (không phải của scikit-learn), sau các bước imputer và scaler, để nó chỉ chạy trên phần train của mỗi fold và **không** đụng tới validation hay test:

```python
from imblearn.pipeline import Pipeline            # Pipeline của imblearn
from imblearn.over_sampling import SMOTE
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
model = Pipeline([("impute", SimpleImputer(strategy="median")),
                  ("scale", StandardScaler()),
                  ("resample", SMOTE(random_state=42)),
                  ("clf", LogisticRegression(max_iter=1000))])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print(cross_val_score(model, X, y, cv=cv, scoring="f1").mean())
```

(Đoạn này chưa được chạy kiểm trong môi trường soạn bài vì chưa cài `imbalanced-learn`; các con số của bài đều đến từ thí nghiệm bằng scikit-learn ở trên.) Làm ngược lại, resample **cả dataset trước khi chia**, sẽ thổi phồng điểm số như thí nghiệm Random Forest ở phần quy tắc vàng.

## Những hiểu sai thường gặp

- **"Cân bằng dữ liệu làm model tốt hơn."** Trên Diabetes, F1 không tăng; chỉ điểm làm việc dịch chuyển (recall lên, precision xuống).
- **"Cân bằng trước rồi chia cho tiện."** Đó là rò rỉ, thổi phồng điểm (recall 0.952 so với 0.618 thật).
- **"Accuracy vẫn là metric chính."** Với dữ liệu lệch, dùng precision, recall, F1.
- **"SMOTE tạo ra thông tin mới."** Nó chỉ nội suy trong vùng đã có; không thay thế dữ liệu thật.

:::card Dữ liệu mất cân bằng
- **Accuracy đánh lừa** khi một lớp hiếm; ranh giới quyết định dịch vào vùng lớp hiếm (slide 52).
- **Cách nhẹ trước:** đổi ngưỡng, `class_weight` (Diabetes: recall 67.3% lên 70.9%, precision 64.9% xuống 55.7%).
- **Resampling:** over-sampling (random, SMOTE: mẫu mới = a + λ(b − a), ADASYN), under-sampling (ClusterCentroids); trên Diabetes cả bốn cách cho F1 ≈ 0.62–0.64, thấp hơn gốc 0.661.
- **Quy tắc vàng:** chia trước, chỉ cân bằng trên train, trong Pipeline; validation và test giữ phân bố thật (sai thì recall 0.952 ảo so với 0.618 thật).
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Stratified K-fold ([[bài:stratified-k-fold]]) và SMOTE đều liên quan đến dữ liệu
mất cân bằng. Chúng khác nhau thế nào? Có dùng cùng lúc được không?
A: Stratified K-fold **giữ nguyên** tỉ lệ class ở mọi fold để
**đánh giá** công bằng; nó không cân bằng gì cả. SMOTE **thay đổi** tỉ lệ
class trong **tập train** để model **học** tốt class ít. Dùng cùng lúc
được và nên dùng: chia fold bằng stratified, rồi SMOTE chỉ phần train của
mỗi fold (imblearn Pipeline).
EN: How do Stratified K-fold and SMOTE differ? Can they be combined?
**A:** Stratification **preserves** class ratios per fold for fair
> evaluation; SMOTE **changes** the training ratio so the model learns
> the minority. Combine them: stratified folds, SMOTE on each training
> part (imblearn Pipeline).

Q: Tập train có 900 mẫu class 0 và 100 mẫu class 1. Sau
RandomOverSampler và sau RandomUnderSampler (cân bằng hoàn toàn) mỗi class
còn bao nhiêu mẫu? Mỗi cách thêm / bỏ bao nhiêu?
A: Over-sampling: 900 / 900 — thêm **800** bản sao class 1 (mỗi
mẫu class 1 xuất hiện trung bình 9 lần → nguy cơ overfitting). Under-
sampling: 100 / 100 — bỏ **800** mẫu class 0 (mất 88.9% dữ liệu class 0).
EN: 900 vs 100 training samples — counts after full over- and
under-sampling?
**A:** 900/900 (800 copies added, each minority sample ≈ 9 times —
> overfitting risk); 100/100 (800 majority samples dropped, 88.9%).

Q: Dùng SMOTE với xᵢ = (4, 10), láng giềng x_nn = (6, 4), λ = 0.25.
Tính điểm mới.
A: x_nn − xᵢ = (2, −6); x_new = (4, 10) + 0.25 × (2, −6) = (4 +
0.5, 10 − 1.5) = **(4.5, 8.5)**.
EN: SMOTE with xᵢ = (4, 10), x_nn = (6, 4), λ = 0.25?
**A:** (4.5, 8.5).

Q: Một bạn SMOTE toàn bộ Diabetes dataset rồi mới chia train/test và
được F1 = 0.74, cao hơn hẳn bạn khác (0.68). Kết quả nào đáng tin hơn? Vì
sao?
A: 0.68. Resample trước khi chia làm **rò rỉ dữ liệu**: điểm nội
suy từ cùng một bệnh nhân nằm cả ở train và test; tập test còn bị cân bằng
50/50, không giống thực tế (≈ 35% bệnh). Chỉ được resample tập train.
EN: SMOTE on the whole dataset before splitting gives F1 0.74 vs
0.68 done correctly. Which to trust?
**A:** 0.68 — resampling first leaks synthetic copies across the split
> and makes the test set unrealistically balanced.

Q: ADASYN khác SMOTE ở điểm nào? Khi nào ADASYN có thể gây hại?
A: ADASYN sinh **nhiều điểm hơn quanh những điểm class ít bị
class đông bao quanh** (vùng khó, gần biên giới); SMOTE chọn điểm gốc ngẫu nhiên thay vì phân bổ chủ động theo độ khó. ADASYN
gây hại khi dữ liệu **có nhiễu / nhãn sai**: một điểm bị gán nhãn sai nằm
giữa class đông sẽ được sinh rất nhiều điểm giả, kéo ranh giới vào sâu
vùng class đông.
EN: ADASYN vs SMOTE; when does ADASYN hurt?
**A:** ADASYN generates more points around minority samples surrounded
> by the majority; it hurts with noisy labels, multiplying mislabelled
> points and pushing the boundary into the majority region.

Q: Sau khi cân bằng, Recall trên Diabetes tăng từ 0.50 lên khoảng
0.70 nhưng AUC gần như không đổi (≈ 0.81). Giải thích.
A: AUC đo khả năng **xếp hạng** người bệnh cao hơn người khỏe ở
**mọi ngưỡng** ([[bài:roc-auc]]). Cân bằng dữ liệu chủ yếu **dời ranh giới quyết
định** (giống hạ ngưỡng) — model đoán "bệnh" nhiều hơn nên Recall tăng,
nhưng thứ tự xếp hạng gần như giữ nguyên nên AUC không đổi. Vì vậy hạ
ngưỡng hoặc class_weight cũng cho hiệu quả tương tự.
EN: Recall rises from 0.50 to ≈ 0.70 but AUC stays ≈ 0.81. Why?
**A:** AUC measures ranking across all thresholds; balancing mainly
> shifts the decision boundary (like lowering the threshold), so Recall
> rises while the ranking — and AUC — barely changes.
Q: Nhân bản một mẫu thiểu số nhiều lần có tạo nhiều quan sát độc lập không?
A: Không. Nó tăng trọng lượng hoặc số lần mẫu đó xuất hiện trong quá trình học, không làm đa dạng nguồn quan sát. Mẫu tổng hợp cũng cần kiểm chứng, không tự có thông tin thật mới.
@tier B | Phỏng vấn lý thuyết
Q: Vì sao SMOTE trước split gây leakage?
A: Mẫu tổng hợp dùng thông tin láng giềng trên toàn dataset nên có thể phụ thuộc các mẫu sau đó thuộc validation/test. Ngoài ra tập đánh giá bị đổi tỷ lệ. Split trước và đặt sampler trong pipeline từng fold.
EN: Resampling before splitting can leak neighbor information and alter the evaluation class distribution.
Q: SMOTE có luôn hơn nhân bản?
A: Không. Nó mở rộng vùng thiểu số nhưng có thể nội suy qua vùng sai hoặc từ nhãn nhiễu. Random oversampling đơn giản và giữ category; cần so trên cùng validation theo mục tiêu.
EN: SMOTE can generate unhelpful or invalid samples; it is not universally better than random oversampling.
Q: Class weight khác resampling và threshold?
A: Weight đổi đóng góp loss trong train, resampling đổi dữ liệu train, threshold đổi quyết định từ score sau học. Hiệu ứng có thể gần nhau nhưng không tương đương mọi model hay regularization.
EN: Class weighting changes the objective, resampling changes training data, and thresholding changes decisions after scoring.
Q: ADASYN có rủi ro nào với nhãn sai?
A: Điểm thiểu số nằm giữa đa số được coi khó và sinh nhiều mẫu quanh nó. Nếu nhãn gốc sai, ADASYN khuếch đại nhiễu; cần kiểm tra nhãn và overlap trước khi tăng độ phức tạp.
EN: ADASYN can amplify mislabeled minority samples surrounded by majority neighbors.
Q: “Hồi quy không có mất cân bằng” nên hiểu thế nào trong bài này?
A: Regression không có các class rời rạc để cân bằng số lượng theo cách đang học. Tuy vậy target liên tục có thể có vùng hiếm và mô hình dự đoán kém ở vùng đó; phải thiết kế đánh giá/trọng số phù hợp chứ không phủ nhận vấn đề.
EN: Regression lacks discrete classes to balance, but rare target regions can still be underrepresented.
@tier C | Tình huống doanh nghiệp
Q: Fraud 0.1%, chọn SMOTE hay class_weight?
A: Giữ split thời gian/nhóm phù hợp và validation tỷ lệ thật, xây baseline score, weight và threshold trước. Đo PR, recall ở ngân sách duyệt và chi phí; thử SMOTE chỉ train nếu feature và láng giềng có nghĩa. Nội suy có thể tạo giao dịch không hợp lệ, weight đơn giản hơn nhưng vẫn cần chọn ngưỡng *(bổ sung)*.
WANT: Biết bắt đầu đơn giản, đánh giá đúng phân bố và kiểm tra tính hợp lệ mẫu tổng hợp.
Q: Recall tăng sau SMOTE nhưng đội duyệt quá tải. Có thành công?
A: Đếm FP và cảnh báo/ngày, precision ở ngưỡng đang dùng và giá trị fraud bắt thêm. Chọn ngưỡng trên validation theo công suất, cân nhắc tỷ lệ resampling nhỏ hơn. Thành công là lợi ích sau chi phí, không riêng recall *(bổ sung)*.
WANT: Biện luận chất lượng ở điểm vận hành và giới hạn nguồn lực.
Q: Dữ liệu chứa mã sản phẩm one-hot, team muốn SMOTE thường. Bạn xử lý sao?
A: Nội suy có thể tạo giá trị category phân số không hợp lệ. Thử RandomOverSampler hoặc SMOTENC khi còn cấu trúc categorical và tiền xử lý đúng; so baseline weight. Giữ pipeline trong fold và kiểm tra schema đầu ra, đánh đổi đơn giản với khả năng mô tả vùng thiểu số *(bổ sung)*.
WANT: Không áp khoảng cách và nội suy số liên tục một cách máy móc.
Q: Khách VIP rất hiếm trong model dự đoán doanh thu. Có SMOTE nhãn doanh thu như các class được không?
A: Không coi từng con số doanh thu là một class. Phân tích lỗi theo vùng target và nhóm khách, xác định chi phí rồi thử trọng số hoặc cách lấy mẫu phù hợp regression. Đánh giá trên phân bố triển khai, tránh áp kỹ thuật class balancing chỉ vì thấy nhóm hiếm.
WANT: Phân biệt bài toán class imbalance với target liên tục phân bố lệch.
:::

## Nối sang bài sau

:::next
Đã hoàn tất các phần chính của Step 3. [[bài:data-visualization]] chuyển sang Step 4: nhìn phân bố và quan hệ bằng biểu đồ trước khi chọn mô hình. Giữ [[bài:classification-metrics]] và [[bài:roc-auc]] làm công cụ kiểm chứng hiệu quả của cân bằng.
:::
