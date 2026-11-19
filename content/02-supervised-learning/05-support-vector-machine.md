---
title: Máy vector hỗ trợ (Support Vector Machine — SVM)
order: 5
description: "SVM (slide 70-74): chọn đường có lề rộng nhất, soft margin với C, kernel và gamma uốn ranh giới bằng cách thêm chiều; đo C và gamma trên Diabetes."
slides: 70-74
needs: [logistic-regression, polynomial-regression, feature-scaling, classification-metrics]
tags: [svm, support-vector, hyperplane, margin, kernel, rbf, soft-margin, C, gamma]
---

## Nhiều đường cùng đúng, chọn đường nào?

:::intro Mục tiêu bài này
- Đọc bốn slide SVM (70 đến 73): lề rộng nhất, support vector, tách được và không tách được, thêm chiều.
- Hiểu **soft margin** (tham số C) và **kernel** (tham số gamma) qua số đo thật trên Diabetes.
- Biết dùng SVM đúng cách: scale, chọn C và gamma bằng cross-validation, và nhận ra khi nào bị overfit.
:::

## Chọn đường có lề rộng nhất (slide 70)

:::slides 70-74 | Slide 70–74: Support Vector Machine, lề rộng nhất, tách được và không tách được, thêm chiều bằng hàm ánh xạ
:::

Hai nhóm điểm tách được bằng **vô số** đường thẳng (hình trái slide 70: nhiều đường xanh/đỏ đều đúng). Đường sát một nhóm thì mong manh: một điểm mới nhích nhẹ là bị đoán sai. SVM chọn đường **cách đều hai nhóm và xa nhất có thể** (hình phải): **optimal hyperplane** (siêu phẳng tối ưu, trong 2 chiều chỉ là một đường thẳng) nằm giữa hai mép đứt. Khoảng giữa hai mép là **maximum margin** (lề rộng nhất). Những điểm nằm ngay trên mép gọi là **support vector**: chỉ chúng quyết định đường.

:::predict
Hai nhóm điểm tách được. Ta **xóa một điểm xa mép lề** (không phải support vector). Đường SVM có đổi không? Còn nếu xóa một support vector?
@answer
Xóa điểm xa mép: **đường không đổi** (nó không quyết định gì). Xóa một support vector: đường **thường đổi** (lề có thể rộng hơn). Vì vậy SVM chỉ "nhớ" một phần nhỏ dữ liệu, các điểm nằm sát biên.
:::

Hãy tự tìm: kéo góc và vị trí của đường; chỉ những đường tách đúng mới có lề, và nút "Đặt về lề rộng nhất" cho đường tối ưu.

:::widget svm-margin
:::

Hình học nhỏ: với đường `w·x + b = 0` và mép được chuẩn hóa ở `±1`, độ rộng lề toàn dải là `2/‖w‖`, nên tìm lề rộng nhất nghĩa là làm `‖w‖` nhỏ nhất. Ví dụ `w = (3, 4)`, `b = −5`: ‖w‖ = 5, lề = 2/5 = **0.4**; điểm (3, 0) có `f = 3·3 + 4·0 − 5 = 4`, cách biên 4/5 = **0.8**.

## Tách được và không tách được (slide 71)

Slide 71 đặt cạnh nhau hai tình huống. **Linearly separable:** một đường thẳng tách hoàn toàn hai nhóm. **Not linearly separable:** nhóm xanh lục nằm **giữa** một đám đỏ bao quanh, không đường thẳng nào tách được. Có hai cách xử lý, mỗi cách là một tham số của SVM.

### Cách 1: soft margin, tham số C

Dữ liệu thật thường lẫn lộn. **Soft margin** cho phép vài điểm **nằm sai phía hoặc trong lề**, với một **mức phạt** điều khiển bởi **C**: C lớn phạt nặng điểm sai nên lề hẹp, bám sát dữ liệu (dễ overfit); C nhỏ chấp nhận nhiều điểm sai, lề rộng, đơn giản (dễ underfit).

### Cách 2: thêm chiều, kernel và gamma (slide 72 và 73)

Slide 72 cho thấy chính xác ý tưởng: không gian 2D với nhóm lục nằm giữa đám đỏ; **hàm ánh xạ** φ(x1, x2) = (x1, x2, z) thêm **chiều thứ ba z** (trục "New Dimension"); trong 3D, một **mặt phẳng** tách được hai nhóm. Slide 73 vẽ lại ví dụ đó: nhìn mặt phẳng tách ấy từ trên xuống thì thành **một vòng tròn** ở 2D, là ranh giới cong.

:::steps
Một chiều: lớp A ở x = −1, 0, 1; lớp B ở x = −3 và x = 3. **Không có điểm cắt nào** trên trục x tách được hai lớp (A nằm giữa B).
@step
**Thêm chiều:** thêm cột z = x². Lớp A có z = 1, 0, 1; lớp B có z = 9, 9.
@step
Trong mặt phẳng (x, z), một **đường thẳng ngang z = 4** tách hoàn toàn hai lớp. Nhìn lại trên trục x, đó là hai điểm cắt x = ±2: ranh giới cong.
@step
**Kernel trick:** thay vì dựng thật các cột mới (có thể là vô hạn), kernel tính trực tiếp "độ giống" như thể mẫu đã ở không gian cao chiều. Kernel **RBF** phổ biến: tham số **gamma** điều khiển độ cong (gamma lớn: ranh giới uốn sát từng điểm, dễ overfit).
:::

## Số thật trên Diabetes: C và gamma

Pipeline `StandardScaler` rồi `SVC`, CV 5-fold có phân tầng (`random_state=42`); cột "train" đo trên 614 mẫu train (chia 80/20).

| C (gamma mặc định) | Train | CV | Số support vector (trên 614) |
|---|---|---|---|
| 0.01 | 0.651 | 0.651 | 432 |
| 0.1 | 0.795 | 0.753 | 426 |
| **1** | 0.836 | **0.762** | 352 |
| 10 | 0.891 | 0.728 | 319 |
| 100 | 0.963 | 0.698 | 300 |

| gamma (C = 1) | Train | CV |
|---|---|---|
| 0.001 | 0.658 | 0.654 |
| **0.01** | 0.792 | **0.766** |
| 0.1 | 0.832 | 0.758 |
| 1 | 0.969 | 0.703 |
| 10 | **1.000** | 0.651 |

Ba điều đọc được. **Một:** C và gamma đều có **vùng giữa tốt**; quá nhỏ thì underfit (C = 0.01 chỉ bằng mức sàn 0.651), quá lớn thì train tăng còn CV **giảm** (C = 100: train 0.963, CV 0.698; gamma = 10: train 1.000, CV 0.651, tệ ngang đoán toàn 0). **Hai:** support vector không "chỉ vài điểm": với dữ liệu lẫn lộn như Diabetes, hơn một nửa mẫu train (300 đến 432) đều là support vector; ý "chỉ vài điểm" đúng cho dữ liệu tách gọn. **Ba:** kernel không tự thắng: SVM tuyến tính cho CV **0.771**, RBF 0.762, đa thức 0.734; Diabetes gần như không cần ranh giới cong. Đo trên một bộ dữ liệu với một cách chia, nên chênh lệch dưới độ lệch giữa các fold (khoảng 0.02) chưa kết luận được.

:::ck
SVM RBF với gamma rất lớn đạt 100% trên train nhưng thấp trên test. Có bất ngờ không? Chỉnh gì?
@answer
Không bất ngờ: gamma lớn uốn ranh giới sát từng điểm nên **học thuộc** (overfitting); trên Diabetes gamma = 10 cho train 1.000 nhưng CV chỉ 0.651. Giảm gamma và/hoặc giảm C, chọn bằng cross-validation.
:::

## Dùng SVM đúng cách

- **Scale trước:** khoảng cách và lề nhạy với đơn vị ([[bài:feature-scaling]]). Trên Diabetes RBF không scale cho CV 0.760, gần bằng khi có scale (0.762); đừng suy ra scale không cần, vì bộ này có thang đo tương đối cân; vẫn nên scale làm mặc định.
- **Chọn C và gamma bằng cross-validation** trong Pipeline, không chọn bằng bộ test ([[bài:k-fold-cross-validation]]).
- **So với Logistic** ([[bài:logistic-regression]]): SVM có thể bắt ranh giới cong (kernel) nhưng điểm của nó không phải xác suất, và chậm hơn với dữ liệu rất lớn.

## Code: chọn C và gamma bằng GridSearchCV trong Pipeline

`GridSearchCV` thử từng cấu hình và lấy điểm CV trung bình; khi bọc cả `Pipeline` (scaler rồi SVC), toàn bộ pipeline được fit lại **bên trong mỗi fold**, nên scaler không nhìn thấy fold validation. Test chỉ dùng một lần ở cuối. Trên Diabetes (chia 80/20 có phân tầng):

```python
import pandas as pd
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
d = pd.read_csv("diabetes.csv")
X, y = d.drop(columns="Outcome"), d["Outcome"]
X_dev, X_test, y_dev, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
search = GridSearchCV(make_pipeline(StandardScaler(), SVC()),
                      {"svc__C": [0.1, 1, 10], "svc__gamma": [0.001, 0.01, 0.1]}, cv=cv)
search.fit(X_dev, y_dev)                 # refit cấu hình tốt nhất trên toàn bộ development
print(search.best_params_, round(search.best_score_, 3))   # {'svc__C': 1, 'svc__gamma': 0.01} 0.783
print(round(search.score(X_test, y_test), 3))             # 0.734: chạm test một lần
```

Điểm CV cao nhất là **0.783** (C = 1, gamma = 0.01); các cấu hình lân cận gần như ngang (C = 10, gamma = 0.01: 0.780; C = 10, gamma = 0.001: 0.778), còn C = 0.1 với gamma nhỏ chỉ bằng mức sàn 0.651. Trên test, cấu hình thắng đạt **0.734**, thấp hơn điểm CV một chút: điều bình thường, vì test là một lần chia nhỏ (154 mẫu), và là lý do không nên tin một con số duy nhất.

**Demo vòng tròn: nơi kernel thật sự thắng.** Dữ liệu giả lập hai vòng tròn lồng nhau (`make_circles(n_samples=240, factor=0.4, noise=0.12, random_state=42)`), chia 180 development và 60 test. CV 5-fold trên 180 mẫu development:

| Kernel | C | gamma | CV trung bình |
|---|---|---|---|
| linear | 0.01 / 1 / 100 | | 0.628 / 0.611 / 0.594 |
| RBF | 0.01 | 0.01 / 1 / 100 | 0.689 / 0.939 / 0.700 |
| RBF | **1** | 0.01 / **1** / 100 | 0.689 / **0.983** / 0.856 |
| RBF | 100 | 0.01 / 1 / 100 | 0.978 / 0.972 / 0.861 |

Đường thẳng không tách được hai vòng tròn nên SVM tuyến tính chỉ 0.59 đến 0.63, còn RBF với C = 1, gamma = 1 đạt **0.983**. Sau khi refit trên 180 mẫu, mô hình thắng chỉ cần **42 support vector** (22 lớp 0, 20 lớp 1) và đạt **0.983** trên test. Ở gamma = 100 điểm CV tụt xuống 0.856 dù train đạt 1.000: bám từng điểm. So với Diabetes ở trên, điều này cho thấy kernel hữu ích khi ranh giới thật sự **cong**; khi không, SVM tuyến tính hay Logistic đã đủ. Cấu hình thắng ở đây không có nghĩa C = 1 và gamma = 1 tốt cho mọi bộ dữ liệu.

## Những hiểu sai thường gặp

- **"Chọn đường tách đúng nào cũng như nhau."** Đường có lề rộng nhất chống nhiễu tốt hơn.
- **"Mọi điểm đều ảnh hưởng đường."** Chỉ support vector; nhưng với dữ liệu lẫn lộn có thể có rất nhiều support vector.
- **"Gamma lớn nghĩa là mô hình mạnh hơn."** Nó chỉ linh hoạt hơn; train 1.000 đi kèm CV 0.651.
- **"Kernel luôn tốt hơn tuyến tính."** Không; Diabetes cho tuyến tính 0.771 so với RBF 0.762.
- **"Train 100% là cấu hình tốt nhất."** Chọn bằng CV, không bằng train.
- **"Kernel trick dựng ra các cột mới."** Nó tránh dựng chúng; chỉ tính độ giống giữa các cặp mẫu.

:::card SVM
- **Chọn đường có lề rộng nhất** (lề = 2/‖w‖); **support vector** là các điểm trên mép lề quyết định đường.
- **Soft margin (C):** C lớn bám dữ liệu hơn, C nhỏ đơn giản hơn (Diabetes: C = 1 tốt nhất, CV 0.762).
- **Kernel (slide 72 và 73):** thêm chiều (x → x², hoặc (x1, x2) → (x1, x2, z)) để một siêu phẳng tách được; RBF với gamma điều khiển độ cong (gamma = 10: train 1.000, CV 0.651).
- **Scale trước; chọn C, gamma bằng CV**, không bằng train hay test.
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
