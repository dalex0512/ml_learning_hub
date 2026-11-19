---
title: Cây quyết định (Decision Tree)
order: 7
description: "Cây quyết định (slide 76-77): nút, nhánh, lá; chọn câu hỏi bằng Gini có trọng số; cây không giới hạn học thuộc, đo theo độ sâu trên Diabetes."
slides: 76-77
needs: [logistic-regression, k-fold-cross-validation, classification-metrics]
tags: [decision-tree, gini, entropy, impurity, overfitting, pruning, tree-depth]
---

## Câu hỏi nào nên hỏi trước?

:::intro Mục tiêu bài này
- Đọc một cây quyết định như chuỗi câu hỏi và luật "nếu... thì..." (slide 76).
- Hiểu cách chọn câu hỏi: làm các nhóm con **thuần hơn**, đo bằng **Gini có trọng số** (slide 77).
- Hiểu vì sao cây không giới hạn **học thuộc**, đo bằng độ sâu trên Diabetes, và vì sao cây không cần scale.
:::

## Đọc slide 76: cây là chuỗi câu hỏi

:::slides 76-77 | Slide 76–77: Decision Tree với ví dụ nhận việc, và công thức Gini cùng bốn cách chia
:::

Slide 76 vẽ cây trả lời "có nên nhận offer việc làm mới không?":

- **Root node (gốc):** "salary at least $50,000?" Nếu **no** thì *decline offer* (lá).
- Nếu yes, **decision node** tiếp: "commute more than 1 hour?" Nếu yes thì *decline*.
- Nếu no, hỏi tiếp "offers free coffee?" Yes thì *accept offer*, no thì *decline offer*.

Mỗi **nút** hỏi một câu về một feature, mỗi **nhánh** là một câu trả lời, mỗi **lá (leaf node)** đưa ra dự đoán. Đi từ gốc xuống lá là đọc ra một luật, ví dụ "lương ≥ 50k VÀ đi lại ≤ 1 giờ VÀ có cà phê miễn phí thì nhận". Câu hỏi quan trọng: **hỏi câu nào trước?**

## Chọn câu hỏi bằng Gini (slide 77)

Chọn câu hỏi làm các nhóm con **thuần nhất nhất**, tức mỗi nhóm có phần lớn cùng nhãn. Đo độ không thuần bằng **Gini** (công thức bên trái slide 77):

> Gini = 1 − Σ pᵢ² (pᵢ là tỉ lệ lớp i trong nút)

Nút toàn một lớp có Gini = 0 (thuần); nút 50/50 hai lớp có Gini = 0.5. Một cách chia được chấm bằng **Gini có trọng số** = tổng (số người trong nhánh / tổng) × Gini của nhánh. **Gini càng nhỏ càng tốt.**

:::steps
Bộ 14 người của slide 77: 9 người mua (Yes), 5 người không (No); Gini của gốc là 1 − (9/14)² − (5/14)² = 0.459. Thử chia theo **Age** (Youth, Middle age, Senior).
@step
**Youth:** 2 Yes, 3 No (5 người): Gini = 1 − (0.4² + 0.6²) = **0.48**. **Middle age:** 4 Yes, 0 No: Gini = **0** (thuần). **Senior:** 3 Yes, 2 No: Gini = **0.48**.
@step
**Gini có trọng số** = (5 × 0.48 + 4 × 0 + 5 × 0.48) / 14 = **0.343**.
@step
Làm tương tự cho các feature khác: **Income 0.440**, **Student 0.367**, **Credit Rating 0.429**. Age có Gini có trọng số **nhỏ nhất (0.343)**, nên mũi tên "Best" của slide chỉ vào Age và nó làm gốc. Nhánh Middle age đã thuần, thành lá.
:::

Hãy tự tính: chọn từng feature và xem Gini của nhánh và Gini có trọng số.

:::widget gini-calc
:::

:::predict
Một câu hỏi tạo ra một nhánh rất thuần nhưng chỉ có **1 mẫu**, và một nhánh còn lại rất lớn và lẫn lộn. Câu hỏi đó có chắc là tốt không?
@answer
**Chưa chắc.** Gini **có trọng số** tính theo số mẫu của từng nhánh, nên nhánh nhỏ xíu rất thuần đóng góp rất ít, còn nhánh lớn lẫn lộn kéo Gini tổng lên. "Chia càng lệch càng tốt" nghĩa chính xác là: các nhóm con **thuần, tính theo trọng số số mẫu**, không chỉ một nhánh đẹp.
:::

Với feature số (như Glucose), thuật toán thử nhiều **ngưỡng** ("Glucose ≤ 127.5?") và chọn ngưỡng làm Gini có trọng số nhỏ nhất. Học là **tham lam**: mỗi nút chọn cách chia tốt nhất tại thời điểm đó, không bảo đảm cây tối ưu toàn cục. Entropy là cách đo độ không thuần khác, cho cây tương tự.

## Cây sâu thuộc bài: đo trên Diabetes

Trên Diabetes (chia 80/20, `random_state=42`; CV 5-fold có phân tầng), thay đổi `max_depth`:

| max_depth | Số lá | Train | Test (1 lần chia) | CV |
|---|---|---|---|---|
| 1 | 2 | 0.735 | 0.740 | 0.730 |
| **2** | 4 | 0.772 | 0.773 | **0.750** |
| 3 | 8 | 0.777 | 0.760 | 0.746 |
| 4 | 16 | 0.798 | 0.695 | 0.733 |
| 5 | 27 | 0.842 | 0.799 | 0.732 |
| 8 | 73 | 0.943 | 0.740 | 0.687 |
| không giới hạn | 103 | **1.000** | 0.747 | 0.700 |

Ba điều. **Một:** cây không giới hạn có train **1.000** nhưng CV 0.700: học thuộc bằng 103 lá. **Hai:** train tăng đều theo độ sâu, còn **CV đạt đỉnh ở độ sâu 2** rồi đi xuống. **Ba:** test một lần chia **nhảy lung tung** (độ sâu 4 là 0.695, độ sâu 5 lại 0.799): với 154 mẫu test, một lần chia quá nhiễu để chọn siêu tham số; đó là lý do dùng CV ([[bài:k-fold-cross-validation]]).

Cây nông nhất đọc được ngay thành luật. Cây độ sâu 2: nếu **Glucose ≤ 127.5** thì đoán không bệnh; nếu Glucose > 127.5 và **BMI > 29.95** thì đoán bệnh, còn BMI ≤ 29.95 thì không bệnh. Vài câu hỏi đủ cho CV 0.750, ngang các mô hình phức tạp hơn trong [[bài:supervised-algorithms]].

:::ck
Một cây không giới hạn độ sâu đạt 99% trên train và 70% trên test. Bạn chỉnh gì?
@answer
Giới hạn độ sâu hoặc số mẫu tối thiểu mỗi lá (hoặc cắt tỉa), chọn bằng cross-validation (Diabetes: độ sâu 2 cho CV tốt nhất). Hoặc dùng [[bài:random-forest]] (nhiều cây bỏ phiếu) để giảm học thuộc.
:::

## Thực hành

- **Không cần scale:** cây chỉ so một feature với một ngưỡng, scale không đổi thứ tự nên không đổi cách chia. Kiểm tra trên Diabetes: cây không giới hạn dự đoán **y hệt** trước và sau `StandardScaler` ([[bài:feature-scaling]]).
- **Dễ đọc** (thành luật), xử lý được cả số lẫn nhóm; **nhược:** dễ học thuộc, **bất ổn** (đổi ít dữ liệu, cây đổi nhiều), ranh giới vuông góc trục, **không ngoại suy**.
- **Cây hồi quy:** lá dự đoán **trung bình** target của các mẫu trong lá; dự đoán là hàm bậc thang.

## Thêm ba điều: entropy, ngưỡng số, và cây hồi quy

**Entropy là cách đo độ lẫn khác.** `H = −Σ pᵢ·log₂(pᵢ)`, quy ước 0·log₂(0) = 0. Nút 50/50 hai lớp có H = 1; nút thuần có H = 0. **Information gain** là H của nút cha trừ H có trọng số của các nhánh con. Với bộ 14 người (9 Yes, 5 No) chia theo Age: H(cha) ≈ **0.940**; H(Youth) = H(Senior) ≈ **0.971**; H(Middle age) = 0; H sau chia = (10/14) × 0.971 ≈ **0.694**; gain ≈ **0.247**. Entropy và Gini có thang khác nhau nên không so trực tiếp trị số của hai loại; thường cho cây rất giống nhau.

**Feature số: thử các ngưỡng giữa các giá trị liền kề.** Sáu điểm x = [1, 2, 3, 4, 5, 6] với nhãn [0, 0, 0, 1, 1, 1]. Câu hỏi "x ≤ t?" với t là các trung điểm 1.5, 2.5, 3.5, 4.5, 5.5:

| t | Trái (lớp 0 / lớp 1) | Phải (lớp 0 / lớp 1) | Gini có trọng số |
|---|---|---|---|
| 1.5 | 1 / 0 | 2 / 3 | (1/6)·0 + (5/6)·(12/25) = 0.4 |
| 2.5 | 2 / 0 | 1 / 3 | (2/6)·0 + (4/6)·(6/16) = 0.25 |
| **3.5** | 3 / 0 | 0 / 3 | **0** |
| 4.5 | 3 / 1 | 0 / 2 | (4/6)·(6/16) + (2/6)·0 = 0.25 |
| 5.5 | 3 / 2 | 0 / 1 | (5/6)·(12/25) + (1/6)·0 = 0.4 |

Chọn **t = 3.5** vì cả hai nhánh con thuần; `DecisionTreeClassifier` cũng tự chọn đúng ngưỡng này. Ngưỡng không cần là một giá trị đã có trong train. Cây dừng khi nút thuần, không còn cách chia có ích, chạm giới hạn độ sâu, hoặc không đủ mẫu; và một feature số có thể được hỏi **nhiều lần** ở các độ sâu khác nhau với ngưỡng khác nhau. Một lưu ý khi đọc slide 77: bảng đếm của Credit Rating trên slide cộng ra tổng Yes khác 9, nên hãy xem đó là hình minh họa ý tưởng chọn cách chia, không phải bảng dữ liệu cần đối chiếu từng ô.

**Cây hồi quy.** `DecisionTreeRegressor` (squared error) dự đoán **trung bình target trong lá** và chọn cách chia làm tổng sai số bình phương trong các nhánh con nhỏ nhất. Đó là lý do Decision Tree có dấu sao ở bản đồ thuật toán ([[bài:supervised-algorithms]]). Sáu điểm x = [1, 2, 3, 4, 5, 6], target [2, 2, 4, 8, 8, 10], chia tại x ≤ 3.5:

- Lá trái: trung bình (2 + 2 + 4)/3 = 8/3 ≈ **2.667**; SSE = 4/9 + 4/9 + 16/9 = 8/3.
- Lá phải: trung bình (8 + 8 + 10)/3 = 26/3 ≈ **8.667**; SSE cũng bằng 8/3.
- Tổng SSE = 16/3, MSE = (16/3)/6 ≈ **0.889**.

Dự đoán x = 2 là 2.667; x = 5 là 8.667. Với x = 20, **ngoài miền train**, cây vẫn đi vào lá phải và trả **8.667**, không kéo dài xu hướng tăng: hàm dự đoán là các **bậc thang**, và giá trị dự đoán không bao giờ vượt khoảng target đã thấy trong lá.

```python
import numpy as np
from sklearn.tree import DecisionTreeRegressor
x = np.array([1, 2, 3, 4, 5, 6], dtype=float).reshape(-1, 1)
t = np.array([2, 2, 4, 8, 8, 10], dtype=float)
m = DecisionTreeRegressor(max_depth=1).fit(x, t)
print(m.tree_.threshold[0])              # 3.5
print(m.predict([[2], [5], [20]]))       # [2.667 8.667 8.667]
print(((t - m.predict(x)) ** 2).sum())   # 5.333 = 16/3
```

## Những hiểu sai thường gặp

- **"Cây sâu hơn là mô hình tốt hơn."** Chỉ tốt hơn trên train; CV tốt nhất ở độ sâu 2.
- **"Gini 0 là cây tốt."** Gini 0 ở một lá nhỏ có thể chỉ là học thuộc.
- **"Một lần chia test đủ để chọn độ sâu."** Test nhảy 0.695 đến 0.799; dùng CV.
- **"Cây cần scale như KNN."** Không; thứ tự giá trị không đổi.
- **"Cây ổn định."** Đổi ít dữ liệu có thể đổi cả cấu trúc cây.

:::card Decision Tree
- **Nút, nhánh, lá**; đi từ gốc xuống lá đọc ra luật (slide 76).
- **Gini = 1 − Σ pᵢ²** (0 là thuần); chọn cách chia có **Gini có trọng số nhỏ nhất** (Age 0.343, Student 0.367, Credit 0.429, Income 0.440).
- **Cây không giới hạn học thuộc** (train 1.000, CV 0.700); độ sâu 2 cho CV tốt nhất 0.750; chọn bằng CV.
- **Không cần scale**; dễ đọc nhưng bất ổn, không ngoại suy.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Nút 3 Yes/2 No có Gini bao nhiêu? Nút 4 Yes/0 No thì sao?
A: **0.48 và 0.** Nút đầu có p=3/5 và 2/5 nên 1−9/25−4/25=12/25=0.48; nút sau 1−1²−0²=0. Ví dụ Middle age trên slide là trường hợp thuần, không phải Gini càng lớn càng tốt.
Q: Age chia 5/4/5 mẫu, Gini 0.48/0/0.48. Tính Gini split và đọc mũi tên Best.
A: **12/35≈0.342857, làm tròn 0.343; Best chỉ Age.** Tính (5/14)×0.48+(4/14)×0+(5/14)×0.48. Age có số tổng thấp nhất, nhưng khi so cả bốn bảng phải giữ chú thích Credit có tổng nhãn không nhất quán.
Q: Vì sao không chọn cách chia có một lá thuần một mẫu trong phản ví dụ?
A: **Vì phần còn lại lớn và còn lẫn nhiều.** Nhánh 1 mẫu G=0 cộng nhánh 9 mẫu G=40/81 cho split 4/9≈0.444444; hai nhánh 5 mẫu với G=0.32 mỗi nhánh cho 0.32, tốt hơn. Phải dùng trọng số chứ không chỉ chọn nhánh đẹp nhất.
Q: Mẫu salary=60,000, commute=60 phút, coffee=1 đi qua luật slide 76 ra sao?
A: **Nhận offer.** 60,000≥50,000 nên qua root; 60 phút không “quá 1 giờ”, đi nhánh No ở commute; coffee=1 nên Accept. Đây là đọc luật minh họa, không phải chứng minh root salary được tối ưu từ dataset gốc.
Q: Đọc bảng độ sâu: chọn depth nào? Vì sao không chọn None?
A: **Chọn 5 trong lưới theo CV.** CV 0.89 cao nhất; None tuy train 1.0 nhưng CV 0.86. Giữ test sau lựa chọn; một lần chia/cấu hình không chứng minh depth=5 tốt cho mọi dataset.
Q: Cây hồi quy hai lá trong bài dự đoán tại x=20 bằng bao nhiêu?
A: **26/3≈8.666667.** x=20 đi vào lá phải chứa target 8/8/10, mean=26/3. Cây nhận input ngoài miền nhưng không tự kéo dài xu hướng tăng; đó là giới hạn ngoại suy cần kiểm khi triển khai.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** How does a decision tree choose a split?
A: **Chọn giảm impurity lớn nhất ở nút hiện tại trong các split hợp lệ.** Tính impurity con có trọng số, so trên cùng parent, rồi lặp ở con; đây là greedy nên không bảo đảm cây tối ưu toàn cục. Ví dụ Age có weighted Gini≈0.343 thấp hơn Student≈0.367 trên các bảng có cùng tổng nhãn.
EN: A decision tree greedily selects a valid split that maximizes impurity reduction at the current node, using sample-weighted child impurities rather than a globally optimal tree search.
Q: **B2.** What is Gini impurity?
A: **Là mức lẫn class 1−Σp_i² trong một nút.** Thuần thì 0, phân bố đều thì lớn nhất; binary trần 0.5, C class trần 1−1/C. Ví dụ 50/50 có G=0.5, không có nghĩa accuracy bằng 50% trong mọi model.
EN: Gini impurity is one minus the sum of squared class proportions. It is zero for a pure node and largest for equal proportions, with maximum 1−1/C for C classes.
Q: **B3.** How do you prevent overfitting in a decision tree?
A: **Giới hạn độ phức tạp và chọn bằng validation/CV.** Thử max_depth, min_samples_leaf/min_samples_split hoặc ccp_alpha, giữ tiền xử lý trong fold và test cuối. Ví dụ depth=5 thắng CV cây không giới hạn trong demo dù train error cao hơn; không chữa bằng cách tune lặp trên test.
EN: Control depth and node sizes or apply cost-complexity pruning, select the procedure on validation folds, and reserve test data for final evaluation.
Q: **B4.** Do decision trees need feature scaling?
A: **CART dạng này thường không cần scale vì split theo ngưỡng từng cột.** Đổi đơn vị theo tỉ lệ dương giữ thứ tự và ngưỡng tương ứng, khác KNN/SVM dùng hình học khoảng cách. Vẫn phải encode categorical/kiểm missing và tránh leakage; scale không thay việc hạn chế depth.
EN: Standard CART trees usually do not require feature scaling because they split individual features by thresholds. This does not remove encoding, missing-data or validation requirements.
Q: **B5.** Gini vs entropy: có gì khác?
A: **Cả hai đo độ không thuần nhưng dùng hàm khác nhau.** Gini dùng bình phương tỉ lệ, entropy dùng −p log2 p; tối ưu reduction trên cùng parent. Ví dụ binary 50/50 có Gini 0.5 và entropy 1, không so trực tiếp hai giá trị như cùng đơn vị; split được chọn có thể trùng hoặc khác.
EN: Gini and entropy are alternative impurity measures based on squared proportions and logarithms respectively. Their numerical scales differ and they need not rank every candidate split identically.
Q: **B6.** Why is a decision tree unstable?
A: **Vì đổi một split sớm có thể đổi toàn bộ các split phía dưới.** Những ứng viên gần điểm nhau dễ đổi thứ hạng khi thêm/bớt mẫu, nhất là cây sâu. Ví dụ nhãn nhiễu làm một gốc đổi có thể kéo theo nhiều luật khác; forest sẽ dùng đa dạng cây để giảm biến động, không hứa triệt tiêu bias hay leakage.
EN: Small data changes can alter an early greedy split and propagate throughout the tree. Deep trees can therefore have high variance; averaging diverse trees addresses some of that variability.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Duyệt khoản vay cần giải thích luật cho người dùng. Có chọn cây là xong không?
A: **Cây nhỏ là ứng viên dễ đọc, nhưng luật đọc được chưa đủ để quyết định đáng tin.** Chọn depth bằng validation, kiểm feature có sẵn lúc duyệt, lỗi theo nhóm và độ ổn định; phối hợp yêu cầu giải thích với người chịu trách nhiệm quyết định. Ví dụ luật “thu nhập vượt ngưỡng” học từ mẫu lệch không tự chứng minh nhân quả/công bằng; giữ test độc lập và theo dõi thay đổi dữ liệu.
WANT: Phân biệt khả năng đọc luật với chất lượng, tính hợp lệ của feature và trách nhiệm kiểm chứng quyết định.
Q: **C2.** Cây train 100% nhưng tuần sau sai nhiều. Bạn làm gì trước?
A: **Kiểm split/leakage và khoảng cách giữa train với validation trước khi tăng độ sâu.** Rà biến biết sau kết quả, thời gian/nhóm lặp, encoding/imputation; so cây đơn giản và depth/leaf constraints trên validation phù hợp. Ví dụ cây None đạt train 1.0 nhưng thua depth=5 trên CV; nếu tuần mới đổi phân bố thì còn phải kiểm drift, không quy hết cho overfit.
WANT: Chẩn đoán có thứ tự, phân biệt ghi nhớ, leakage và thay đổi phân bố; không sửa theo test đã xem nhiều lần.
Q: **C3.** Dữ liệu có số, category dạng chữ và NaN. Cây có cần tiền xử lý không?
A: **Có, cần pipeline phù hợp với loại dữ liệu và phiên bản estimator.** Sklearn CART không tự biến mọi chuỗi nominal thành nhánh nhóm; encode có kiểm chứng, kiểm native NaN đúng cấu hình hoặc dùng imputer fit trong fold. Ví dụ probe numeric NaN với gini/best chạy được không chứng minh toàn bộ bảng chữ/thiếu hợp lệ; tránh fit encoder/imputer trên test.
WANT: Không nhầm “ít cần scale” với “không cần tiền xử lý”; biết kiểm giới hạn thư viện và leakage.
Q: **C4.** Cây fraud accuracy rất cao nhưng bỏ sót class hiếm. Có dựa vào Gini train để kết luận tốt không?
A: **Không, impurity dùng học split không thay metric quyết định.** Kiểm confusion matrix/precision/recall và chi phí, so baseline class đa số trên validation theo thời gian; cân nhắc class_weight và cấu hình depth/leaf có kiểm chứng. Ví dụ nhiều lá toàn class bình thường vẫn có thể bỏ sót fraud; chốt chính sách và cấu hình trước test cuối.
WANT: Liên hệ mất cân bằng với tiêu chí học và mục tiêu vận hành, thay vì chỉ nhìn accuracy/impurity train.
:::

## Nối sang bài sau

:::next
Một cây có thể đổi nhiều khi dữ liệu thay nhẹ. [[bài:random-forest]] kết hợp nhiều cây được tạo khác nhau để giảm biến động; bài tiếp theo giải thích bootstrap, feature ngẫu nhiên và vì sao “70% dữ liệu” không phải mặc định của sklearn.

Thực hành: [[bài:diabetes-evaluate-improve]] — so tree/forest với logistic và kiểm thực nghiệm việc không cần scale.
:::
