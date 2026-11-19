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

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Đi từ gốc xuống lá để dự đoán bằng chuỗi luật nếu–thì.
- Giải thích “chia càng lệch” bằng độ thuần của các nhóm con có trọng số.
- Tính đầy đủ Gini của Age/Income/Student/Credit Rating trên slide, nhận ra lỗi nguồn.
- Phân biệt Gini nhỏ nhất với gain lớn nhất; chọn độ sâu bằng CV.
- Chạy cây phân loại/hồi quy, đọc luật và hiểu giới hạn của feature importance.
:::

[[bài:k-nearest-neighbours]] hỏi các hàng xóm gần nhất; [[bài:logistic-regression]] học một biểu thức cho xác suất. **Decision Tree (cây quyết định)** học một chuỗi câu hỏi: “lương đủ cao không?”, “đi lại có quá lâu không?”. Mỗi câu trả lời đưa ta tới câu hỏi tiếp hoặc một kết luận. Cây giống trò “20 câu hỏi”, nhưng ở đây câu hỏi được chọn từ feature và dữ liệu có nhãn.

> **EN:** A decision tree predicts by following feature-based questions from a root to a leaf. Learning chooses which questions to ask and where to stop, rather than retrieving neighbors or fitting one global linear predictor.

:::slides 76-77 | Cây nhận việc và ví dụ Gini theo bốn feature
:::

:::note Nguồn và phạm vi
[[slide:76]] là luật “Should I accept a new job offer?” với salary/commute/free coffee. [[slide:77]] dùng **ví dụ khác** có Age/Income/Student/Credit Rating và hai class Yes/No; không có bảng 14 hàng gốc. Không ghép hai slide thành một dataset.

Bảng nhận việc, entropy, ngưỡng số, code/CV, overfit, hồi quy và các hình matplotlib dưới đây là **bổ sung ngoài slide**; số tự soạn được ghi rõ. Bảng đếm Gini thì chép đúng slide 77, kể cả chỗ không nhất quán, rồi tính lại bằng Python.
:::

## [sâu] Đi từ root tới leaf: đọc luật trước khi học luật

**Node (nút)** là vị trí trên cây. **Root node (nút gốc)** là câu hỏi đầu; **decision/internal node (nút quyết định/nút trong)** chứa câu hỏi tiếp; **branch (nhánh)** là kết quả của câu hỏi; **leaf node (nút lá)** đưa ra dự đoán. **Split** là phép chia mẫu vào các nhánh. **Depth (độ sâu)** đếm số cạnh từ gốc, gốc có depth 0.

Slide 76 hỏi theo thứ tự:

```text
salary ít nhất $50,000?
  Không → decline offer (từ chối)
  Có → commute quá 1 giờ?
          Có → từ chối
          Không → free coffee?
                    Có → accept offer (nhận)
                    Không → từ chối
```

Đây là bốn lá, ba nút câu hỏi, đường dài nhất đi qua ba câu hỏi tới lá depth 3. **Rule (luật)** là một đường nếu–thì, chẳng hạn “salary≥50,000 và commute≤60 phút và có cà phê → nhận”. Cà phê ở đây chỉ thuộc ví dụ, không phải khuyến nghị chọn việc thực tế.

> **EN:** Root and internal nodes ask questions, branches represent outcomes, and leaves predict. Each root-to-leaf path is an if–then rule; the slide's longest path contains three decisions.

:::worked Tám offer tự soạn, không phải số liệu slide
Salary tính bằng USD theo ví dụ; commute bằng phút; coffee 1=có, 0=không. Nhãn được tạo **đúng theo luật slide 76** để tập đọc cây, không phải dữ liệu tuyển dụng thật.

| Mẫu | Salary | Commute | Coffee | Nhãn |
|---|---|---|---|---|
| A | 40,000 | 30 | 1 | Từ chối |
| B | 45,000 | 20 | 1 | Từ chối |
| C | 48,000 | 90 | 0 | Từ chối |
| D | 50,000 | 30 | 1 | Nhận |
| E | 55,000 | 45 | 1 | Nhận |
| F | 60,000 | 60 | 1 | Nhận |
| G | 65,000 | 90 | 1 | Từ chối |
| H | 70,000 | 45 | 0 | Từ chối |

**E:** 55,000≥50,000 → đi tiếp; 45>60 là sai → hỏi coffee; coffee=1 → **nhận**. **G:** 65,000≥50,000 → đi tiếp; 90>60 đúng → **từ chối ngay**, không cần đọc coffee. D có salary đúng ngưỡng vẫn đi nhánh “ít nhất”; F có commute đúng 60 phút không phải “quá 1 giờ”.
:::

## [sâu] “Chia càng lệch càng tốt” nghĩa chính xác là gì?

**Impurity (độ không thuần)** đo mức lẫn nhãn **bên trong một nút**. Nhóm toàn Yes hoặc toàn No là thuần; nhóm Yes/No gần ngang nhau là lẫn. Câu hỏi tốt tạo các nhóm con thuần hơn, tính trên **tất cả các nhánh với trọng số số mẫu**. Không phải chia sao cho kích thước hai nhánh chênh nhau nhiều nhất, cũng không phải chỉ nhìn một nhánh rất đẹp.

Vì sao salary là gốc slide 76? Nhánh salary<50,000 đi thẳng tới “decline”, phù hợp trực giác nhóm thuần. Nhưng slide là **hình minh họa luật**, không kèm số đếm các câu hỏi ứng viên, nên chưa chứng minh được salary tối ưu theo Gini trên dữ liệu gốc. Bảng tám offer tự soạn cũng không thay thế bằng chứng ấy. Ta dùng **slide 77 có số đếm** để học cách so split bằng số.

> **EN:** A good split makes child nodes purer in a sample-weighted sense, not merely unequal in size. Slide 76 illustrates a sensible rule but lacks the counts needed to prove that salary is the impurity-optimal root.

### Gini: số nhỏ là ít lẫn nhãn

Trong một nút có **C class**, **p_i** là tỉ lệ mẫu thuộc class i, i chạy từ 1 tới C. C ở đây là **số class**, khác tham số phạt C của SVM/Logistic. Các p_i không âm và có tổng bằng 1.

:::formula
**Gini impurity của một nút**
```text
G = 1 − Σ_i p_i²
Hai class với tỉ lệ p và 1−p:
G = 2p(1−p) = 0.5 − 2(p−0.5)²
```
<!-- note: G nhỏ → nút thuần; G không phải accuracy -->

**Đánh giá một lần chia** — nhánh j có n_j mẫu, tổng N mẫu:
```text
G_split = Σ_j (n_j / N) G_j
Gain = G_parent − G_split
Chọn G_split nhỏ nhất ↔ gain lớn nhất
```
<!-- note: chỉ so gain như vậy khi cùng một nút cha -->
:::

Nút 50% Yes/50% No: `1−0.5²−0.5²=0.5`. Nút toàn Yes: `1−1²−0²=0`. Với hai class, `G=0.5−2(p−0.5)²` đạt lớn nhất 0.5 tại p=0.5, nhỏ nhất 0 tại p=0 hoặc 1.

Với C class, `Σ(p_i−1/C)²≥0` suy ra `Σp_i²≥1/C`, nên `G≤1−1/C`. Mặt khác p_i²≤p_i nên Σp_i²≤1, tức G≥0. Vậy **0≤G≤1−1/C**, tối đa khi các class có cùng tỉ lệ, tối thiểu khi chỉ một class xuất hiện. Không áp trần 0.5 của binary cho mọi bài nhiều class.

> **EN:** Gini is zero for pure nodes and maximal for equal class proportions. For a fixed parent, minimizing weighted child impurity is equivalent to maximizing impurity reduction; binary Gini ranges from zero to 0.5.

:::worked Phản ví dụ: một nhánh thuần nhỏ chưa chắc tốt (ngoài slide)
Tự soạn nút cha 10 mẫu, 5 Yes/5 No, G_parent=0.5. Hai câu hỏi khác nhau cùng chia đúng 10 mẫu ấy:

- **Cách 1:** nhánh nhỏ 1 Yes/0 No có G=0; nhánh lớn 4 Yes/5 No có `G=1−(4/9)²−(5/9)²=40/81≈0.493827`. Tổng có trọng số = `(1/10)×0+(9/10)×(40/81)=4/9≈0.444444`.
- **Cách 2:** hai nhánh 4 Yes/1 No và 1 Yes/4 No; mỗi nhánh G=`1−(4/5)²−(1/5)²=0.32`. Tổng = `(5/10)×0.32+(5/10)×0.32=0.32`.

Chọn **cách 2** vì 0.32<0.444444, dù nó không có nhánh nào thuần tuyệt đối. Gain lần lượt `0.5−4/9≈0.055556` và `0.5−0.32=0.18`.
:::

## [sâu] Tính lại toàn bộ Gini của slide 77

:::worked Age: mũi tên Best chỉ vào đây
Đã đọc ảnh phóng to: **Youth 2 Yes/3 No**, **Middle age 4 Yes/0 No**, **Senior 3 Yes/2 No**. Tổng 14 mẫu, 9 Yes/5 No.

1. Youth: N=5, `G=1−(2/5)²−(3/5)²=1−4/25−9/25=12/25=0.48`.
2. Middle age: N=4, `G=1−(4/4)²−0²=0` → nút thuần, có thể kết luận Yes ở nhánh ấy.
3. Senior: N=5, `G=1−(3/5)²−(2/5)²=0.48`.
4. Có trọng số: `(5/14)×0.48+(4/14)×0+(5/14)×0.48=12/35≈0.342857` → làm tròn **0.343**, khớp slide.
:::

:::worked Income: không lấy trung bình đều ba nhánh
**High 2 Yes/2 No**, **Medium 4 Yes/2 No**, **Low 3 Yes/1 No**; tổng 14, 9 Yes/5 No.

1. High: `G=1−(2/4)²−(2/4)²=0.5`, 4 mẫu.
2. Medium: `G=1−(4/6)²−(2/6)²=1−16/36−4/36=4/9≈0.444444`, 6 mẫu.
3. Low: `G=1−(3/4)²−(1/4)²=1−9/16−1/16=3/8=0.375`, 4 mẫu.
4. Tổng: `(4/14)×0.5+(6/14)×(4/9)+(4/14)×0.375=37/84≈0.440476` → **0.440**, khớp giá trị tổng trên slide.
:::

:::worked Student: phân biệt tên feature với nhãn Yes/No
Nhánh **Student=Yes** có 6 Yes/1 No ở target; nhánh **Student=No** có 3 Yes/4 No. Cả hai nhánh 7 mẫu, tổng 9 Yes/5 No.

1. Student=Yes: `G=1−(6/7)²−(1/7)²=12/49≈0.244898`.
2. Student=No: `G=1−(3/7)²−(4/7)²=24/49≈0.489796`.
3. Tổng: `(7/14)×(12/49)+(7/14)×(24/49)=18/49≈0.367347` → **0.367**, khớp slide.
:::

:::worked Credit Rating: giữ đúng số trên ảnh rồi nêu lỗi nguồn
Ảnh ghi **Fair 3 Yes/3 No**, **Excellent 2 Yes/6 No**, tổng 6+8=14 mẫu.

1. Fair: `G=1−(3/6)²−(3/6)²=0.5`.
2. Excellent: `G=1−(2/8)²−(6/8)²=1−4/64−36/64=3/8=0.375`.
3. Tổng: `(6/14)×0.5+(8/14)×0.375=3/7≈0.428571` → **0.429**, khớp giá trị tổng.

Nhưng tổng nhãn ở đây là **5 Yes/9 No**, khác 9 Yes/5 No ở ba feature trước. Các ứng viên split của **cùng dataset** phải giữ tổng mỗi class, nên số đếm slide không hoàn toàn nhất quán.
:::

:::compare Kết quả tính bằng số đếm chưa làm tròn
| Feature | Gini có trọng số đã kiểm | Số tổng in trên slide | Tổng Yes/No |
|---|---|---|---|
| Age | **0.342857** | 0.343 | 9/5 |
| Income | 0.440476 | 0.440 | 9/5 |
| Student | 0.367347 | 0.367 | 9/5 |
| Credit Rating | 0.428571 | 0.429 | **5/9** |
:::

**Age có số tổng nhỏ nhất** và mũi tên “Best” thật sự chỉ Age. Age cũng thắng trong ba bảng có cùng tổng 9/5. Tuy nhiên không thể xem cả bốn bảng là bốn split hợp lệ của cùng 14 hàng trước khi sửa lỗi tổng Credit Rating. Nếu Yes/No bị đảo toàn bộ ở riêng bảng Credit thì Gini vẫn không đổi, nhưng ta **không tự sửa nhãn** khi chưa có dữ liệu gốc.

:::note Nhận xét về số in và giới hạn đối chiếu slide 77
Các tổng 0.343/0.440/0.367/0.429 đều khớp khi tính từ số đếm. Một số số ở **nút con** bị cắt bớt chữ số: Low/Excellent in 0.37 nhưng đúng là 0.375 (làm tròn hai số thập phân phải 0.38); Student=No in 0.48 nhưng đúng khoảng 0.489796 (làm tròn phải 0.49). Không dùng các số con đã cắt ấy để tính lại tổng.

Slide 77 chia Age/Income thành ba nhánh; **CART trong sklearn chia nhị phân**. Không có bảng 14 hàng, nên code dưới chỉ tái tính bảng đếm, không bịa dữ liệu để hứa fit ra đúng cây ba nhánh của slide.
:::

> **EN:** All four printed weighted Gini totals match the displayed counts after rounding, and the Best arrow points to Age. Child-node rounding and Credit Rating's inconsistent class totals must still be flagged; the slide does not supply a complete row-level dataset or a binary CART tree.

## [sâu] Entropy, ngưỡng số và cách học tham lam (ngoài slide)

**Entropy** là một cách đo lẫn nhãn khác: `H=−Σ p_i log2(p_i)`, với log2 là logarit cơ số 2, quy ước 0 log2(0)=0. Binary 50/50 cho `H=−0.5×(−1)−0.5×(−1)=1`; nút thuần có H=0. **Information gain** là H cha trừ H con có trọng số, nên gain càng lớn càng tốt. Gini/entropy thường cho kết quả gần nhau nhưng không bắt buộc chọn cùng split.

Với parent 9 Yes/5 No của Age: H_parent≈**0.940286**; H_Youth=H_Senior≈**0.970951**, H_Middle=0. H_split=`(10/14)×0.970951…≈0.693536`; gain≈**0.246750**. Không so trị số entropy và Gini như cùng đơn vị. ID3/C4.5/CART là các họ thuật toán cây; sklearn dùng biến thể CART chia hai nhánh.

Cây học theo cách **greedy (tham lam)**: tại mỗi nút, thử các lần chia hợp lệ, chọn giảm impurity tốt nhất **ngay tại nút đó**, rồi làm tiếp ở con. Không duyệt mọi cây có thể để chứng minh tối ưu toàn cục. Gini là tiêu chí chọn split, nối ý “đo độ tệ để học” ở [[bài:loss-function]], nhưng cây không cần gradient của nó để chọn ngưỡng.

> **EN:** Entropy and Gini are alternative impurity criteria; information gain is a parent-to-children reduction. CART makes greedy local binary decisions, not a globally optimal search over all trees, and does not require gradient descent.

:::worked Sáu điểm số tự soạn: thử các ngưỡng giữa giá trị liền kề
Feature x=`[1,2,3,4,5,6]`, nhãn `[0,0,0,1,1,1]`; hỏi **x≤t?**, t là ngưỡng. Các trung điểm ứng viên: 1.5,2.5,3.5,4.5,5.5.

| t | Đếm lớp 0/1 ở trái | Đếm 0/1 ở phải | Gini có trọng số |
|---|---|---|---|
| 1.5 | 1/0 | 2/3 | (1/6)×0+(5/6)×(12/25)=0.4 |
| 2.5 | 2/0 | 1/3 | (2/6)×0+(4/6)×(6/16)=0.25 |
| 3.5 | 3/0 | 0/3 | 0 |
| 4.5 | 3/1 | 0/2 | (4/6)×(6/16)+(2/6)×0=0.25 |
| 5.5 | 3/2 | 0/1 | (5/6)×(12/25)+(1/6)×0=0.4 |

Chọn **t=3.5** vì cả hai con thuần. Không bắt buộc ngưỡng là một giá trị đã xuất hiện trong train. Với feature categorical, có thể chia theo nhóm; sklearn CART cổ điển cần mã hóa feature đầu vào thành số, không đưa trực tiếp chuỗi nominal rồi mong nó tự hiểu nhóm; xem [[bài:categorical-encoding]].
:::

Cây dừng khi nút thuần, không có split hợp lệ/có ích, chạm giới hạn depth hoặc không đủ mẫu theo quy định. “Hết feature” không có nghĩa CART chỉ được dùng mỗi feature một lần: cùng x có thể được hỏi lại ở nút con với ngưỡng khác.

> **EN:** Numerical CART splits test thresholds between adjacent sorted values; the toy data become pure at 3.5. A feature can be reused deeper in the tree. Growth stops when no useful valid split remains or a configured size/depth limit is reached.

## [sâu] Tính tay cây hồi quy và giới hạn ngoại suy (ngoài slide)

Với **DecisionTreeRegressor** dùng squared_error, lá dự đoán mean target, chọn chia để giảm tổng sai số bình phương/MSE trong các con. Đây là lý do Decision Tree có dấu sao ở [[bài:supervised-algorithms]]. Không dùng Gini của nhãn class để chấm target liên tục; nối [[bài:regression-metrics]].

:::worked Sáu điểm, một lần chia
Tự soạn x=[1,2,3,4,5,6], target=[2,2,4,8,8,10]. Chia tại x≤3.5:

- Lá trái mean=`(2+2+4)/3=8/3≈2.666667`.
- Lá phải mean=`(8+8+10)/3=26/3≈8.666667`.
- SSE trái=`(2−8/3)²+(2−8/3)²+(4−8/3)²=4/9+4/9+16/9=8/3`.
- SSE phải cũng `4/9+4/9+16/9=8/3`; tổng SSE=`16/3`, MSE=`(16/3)/6=8/9≈0.888889`.

Dự đoán x=2 là 2.666667; x=5 là 8.666667. Với x=20 ngoài miền train, cây vẫn đi vào lá phải và trả **8.666667**, không kéo dài xu hướng tăng. Hàm dự đoán là các bậc thang; mean lá không vượt miền target trong lá. “Không ngoại suy” ở đây là **không ngoại suy xu hướng**, không phải cấm gọi predict ngoài miền input.
:::

### Code kiểm số tay, không giả dữ liệu slide

> **EN:** With squared-error regression, each leaf predicts its mean target. The worked stump has training MSE 8/9 and predicts 26/3 at x=20: accepting an out-of-range input does not mean extrapolating the training trend. The following code recalculates displayed counts without inventing the missing slide dataset.

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

def gini(counts):
    p = np.asarray(counts, dtype=float) / np.sum(counts)
    return 1 - np.sum(p**2)

def entropy(counts):
    p = np.asarray(counts, dtype=float) / np.sum(counts)
    p = p[p > 0]  # quy ước 0*log2(0)=0, tránh log2(0)
    return -np.sum(p*np.log2(p))

# Chép đúng các bảng trên slide 77, gồm cả tổng nhãn Credit bị lệch.
slide_counts = {
    "Age": [[2,3],[4,0],[3,2]],
    "Income": [[2,2],[4,2],[3,1]],
    "Student": [[6,1],[3,4]],
    "Credit Rating": [[3,3],[2,6]],
}
gini_rows = {}
for feature, branches in slide_counts.items():
    total = sum(sum(row) for row in branches)
    weighted = sum(sum(row)/total * gini(row) for row in branches)
    gini_rows[feature] = weighted
    print(feature, "child Gini:", [gini(row) for row in branches],
          "weighted:", round(weighted, 6), "Yes/No:", np.sum(branches, axis=0))
age_entropy = sum(sum(row)/14*entropy(row) for row in slide_counts["Age"])
print("Age entropy parent/split/gain:", entropy([9,5]), age_entropy, entropy([9,5])-age_entropy)

# Hai dự đoán theo đúng luật slide 76; không phải fit OLS/CART từ slide.
def accept_offer(salary, minutes, coffee):
    if salary < 50000:
        return 0
    if minutes > 60:
        return 0
    return int(coffee == 1)
assert accept_offer(55000,45,1) == 1
assert accept_offer(65000,90,1) == 0
assert accept_offer(50000,30,1) == 1 and accept_offer(60000,60,1) == 1

x_threshold = np.arange(1,7, dtype=float)[:,None]
binary = np.array([0,0,0,1,1,1])
stump = DecisionTreeClassifier(max_depth=1, random_state=42).fit(x_threshold, binary)
assert np.isclose(stump.tree_.threshold[0], 3.5)
reg = DecisionTreeRegressor(max_depth=1, random_state=42).fit(x_threshold, [2,2,4,8,8,10])
print("Regression predictions:", reg.predict([[2],[5],[20]]))
print("Regression train MSE:", np.mean((reg.predict(x_threshold)-[2,2,4,8,8,10])**2))

# Probe chỉ cho cấu hình/phiên bản đã kiểm, không suy hỗ trợ mọi cấu hình NaN.
nan_tree = DecisionTreeClassifier(criterion="gini", splitter="best", random_state=0)
nan_tree.fit([[0],[1],[6],[np.nan]], [0,0,1,1])
assert np.array_equal(nan_tree.predict([[0],[1],[6],[np.nan]]), [0,0,1,1])
```

## [sâu] Cây sâu có thể thuộc bài, không phải hiểu bài (ngoài slide)

Không giới hạn độ sâu có thể tạo những lá rất nhỏ, kể cả một mẫu, để tách cả nhiễu. Không phải **mọi** lá đều phải một mẫu: một nhóm lớn cùng class cũng thuần. Dữ liệu train tách được hết có accuracy 100% vẫn có thể kém ngoài mẫu.

Kiểm soát bằng **max_depth** (độ sâu tối đa), **min_samples_split** (số mẫu tối thiểu của nút được phép xét chia), **min_samples_leaf** (số mẫu tối thiểu mỗi lá), hoặc **pruning** (cắt tỉa) qua **ccp_alpha**. Tăng alpha có xu hướng phạt độ phức tạp mạnh hơn; vẫn chọn bằng validation/CV, không bằng test. Cùng ý chọn bậc ở [[bài:polynomial-regression]], chọn độ sâu quá nhỏ có thể underfit.

Giả lập 400 mẫu make_moons, noise=0.3, seed 42; development/test=300/100 stratify. Dưới đây train accuracy đo trên toàn dev, CV 5 fold refit cây trong từng fold; chưa dùng test để chọn:

| max_depth | Accuracy train dev | Mean CV accuracy |
|---|---|---|
| 1 | 0.786667 | 0.763333 |
| 2 | 0.873333 | 0.830000 |
| 3 | 0.876667 | 0.830000 |
| 5 | 0.943333 | **0.890000** |
| 10 | 0.993333 | 0.860000 |
| None | **1.000000** | 0.860000 |

Chọn **depth=5** trong lưới này. Test sau refit cho **accuracy 0.880000**, ma trận `[[TN,FP],[FN,TP]]` với class 1 dương: **[[45,5],[7,43]]**. Precision lớp 1=`43/48≈0.895833`, recall=`43/50=0.86`. Không quay lại sửa depth để làm test đẹp; nối [[bài:train-test-split]], [[bài:k-fold-cross-validation]], [[bài:confusion-matrix]], [[bài:classification-metrics]].

> **EN:** Depth five wins development CV in this synthetic example; the unlimited tree memorizes training labels without improving validation accuracy. Depth limits, minimum node sizes and pruning control complexity, but require held-out selection.

![Cây depth 2 riêng để đọc các nút, ngưỡng, Gini và dự đoán lá trên dữ liệu giả lập](/plots/decision-tree-small.png)

[Mở cây ở độ phân giải gốc](/plots/decision-tree-small.png). Đây là **cây depth=2 để minh họa**, không phải cây depth=5 chốt bằng CV, cũng không phải cây ba nhánh của slide 77. Nhánh trái là điều kiện ≤ đúng; nhánh phải là >. value là số mẫu từng class của ví dụ, samples là số mẫu tới nút.

![Ranh giới trục vuông góc của cây depth 1, depth 3 và không giới hạn trên cùng development](/plots/decision-tree-boundaries.png)

[Mở hình gốc](/plots/decision-tree-boundaries.png). Các đường chia theo một feature tạo các ô vuông góc trục. Cây sâu tạo nhiều ô nhỏ; một đường chéo có thể cần nhiều ô để xấp xỉ. Cùng trục/tỉ lệ giữa các panel, chấm chỉ là development.

```python
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.datasets import make_moons
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import confusion_matrix, classification_report

out = Path("tree_forest_output")
out.mkdir(exist_ok=True)
X_tree, y_tree = make_moons(n_samples=400, noise=0.3, random_state=42)
X_dev, X_test, y_dev, y_test = train_test_split(
    X_tree, y_tree, test_size=0.25, random_state=42, stratify=y_tree
)
depths = [1,2,3,5,10,None]
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
depth_rows = []
for depth in depths:
    tree = DecisionTreeClassifier(criterion="gini", max_depth=depth, random_state=42)
    scores = cross_val_score(tree, X_dev, y_dev, cv=cv, scoring="accuracy", n_jobs=1)
    tree.fit(X_dev, y_dev)
    depth_rows.append((depth, tree.score(X_dev,y_dev), scores.mean()))
    print(depth, "train/CV:", round(depth_rows[-1][1],6), round(depth_rows[-1][2],6))
best_depth = max(depth_rows, key=lambda row: row[2])[0]
final_tree = DecisionTreeClassifier(max_depth=best_depth, random_state=42).fit(X_dev,y_dev)
print("selected depth:", best_depth, "importance:", final_tree.feature_importances_)

# Cây nhỏ riêng cho hình/luật; không thay model đã chọn bằng CV.
small = DecisionTreeClassifier(max_depth=2, random_state=42).fit(X_dev,y_dev)
print(export_text(small, feature_names=["x1","x2"], decimals=2))
fig, ax = plt.subplots(figsize=(13,6), constrained_layout=True)
plot_tree(small, feature_names=["x1","x2"], class_names=["0","1"],
          filled=True, rounded=True, fontsize=10, ax=ax)
ax.set_title("Illustrative depth-2 tree (not the selected depth-5 model)")
fig.savefig(out / "decision-tree-small.png", dpi=170)
plt.close(fig)

low, high = X_dev.min(axis=0)-0.4, X_dev.max(axis=0)+0.4
xx, yy = np.meshgrid(np.linspace(low[0],high[0],260), np.linspace(low[1],high[1],220))
mesh = np.c_[xx.ravel(),yy.ravel()]
fig, axes = plt.subplots(1,3,figsize=(14,4.5),constrained_layout=True)
for ax, depth in zip(axes,[1,3,None]):
    tree = DecisionTreeClassifier(max_depth=depth,random_state=42).fit(X_dev,y_dev)
    pred = tree.predict(mesh).reshape(xx.shape)
    ax.contourf(xx,yy,pred,levels=[-0.5,0.5,1.5],colors=["#E1EBF5","#E8F0DA"])
    ax.contour(xx,yy,pred,levels=[0.5],colors=["#D64545"],linewidths=1)
    for label,color in [(0,"#3978B8"),(1,"#70A330")]:
        pts = X_dev[y_dev==label]
        ax.scatter(pts[:,0],pts[:,1],c=color,s=14)
    ax.set(title=f"max_depth={depth}",xlabel="x1",ylabel="x2",
           xlim=(low[0],high[0]),ylim=(low[1],high[1]))
    ax.set_aspect("equal")
fig.savefig(out / "decision-tree-boundaries.png",dpi=160)
plt.close(fig)

# Đánh giá cấu hình đã chốt một lần trên test độc lập.
test_pred = final_tree.predict(X_test)
print(confusion_matrix(y_test,test_pred,labels=[0,1]))
print(classification_report(y_test,test_pred,digits=6,zero_division=0))
```

`feature_importances_` của cây chốt là **[0.488478,0.511522]**, dựa trên tổng giảm impurity có trọng số do mỗi feature tạo ra rồi chuẩn hóa. Nó có thể thiên vị feature có nhiều giá trị/ngưỡng ứng viên, không phải hệ số nhân quả hay bằng chứng x2 “quan trọng thật” hơn x1 trong mọi hoàn cảnh. Xem [[bài:correlation-multicollinearity]] khi các feature chia sẻ thông tin.

> **EN:** Feature importances summarize normalized impurity reductions. They may favor features with many candidate thresholds and must not be interpreted as causal effects; correlated features can share attribution.

## [sâu] Thực hành: dễ đọc nhưng không miễn tiền xử lý (ngoài slide)

Ưu điểm: cây nhỏ có luật rõ, bắt được tương tác/phi tuyến, thường không cần scale vì hỏi **một cột với một ngưỡng**, không so khoảng cách giữa các cột. Đổi đơn vị theo tỉ lệ dương giữ thứ tự và cho ngưỡng tương ứng trong toán chính xác; đối chiếu [[bài:feature-scaling]], [[bài:k-nearest-neighbours]], [[bài:svm]]. Sai số số học có thể tạo khác biệt nhỏ, và scale không phải cách chữa overfit cây.

Nhược điểm: một split ở gốc đổi có thể đổi cả các nhánh sau, nên cây dễ bất ổn khi dữ liệu thay nhẹ. Ranh giới vuông góc trục khó xấp xỉ đường chéo gọn. Cây sâu khó giải thích hơn cây nhỏ; “có luật” không tự đồng nghĩa quyết định đáng tin hoặc công bằng.

Sklearn 1.9.1 đã được chạy probe với **DecisionTreeClassifier(criterion='gini', splitter='best')** nhận numeric NaN; không suy hỗ trợ mọi cấu hình, dữ liệu chuỗi/category hoặc mọi phiên bản. Cần kiểm kiểu dữ liệu/thiếu/nhãn như [[bài:missing-values-outliers]]; nếu dùng imputer/encoder thì fit trong train/fold. Outlier ở feature không kéo một đường OLS, nhưng nhãn sai và target hồi quy cực đoan vẫn có thể ảnh hưởng split/mean lá.

> **EN:** Trees usually do not need feature scaling but still need valid inputs, appropriate encoding and leakage-free preprocessing. Small perturbations can alter early splits and downstream structure. Numeric missing-value support is configuration- and version-specific, not a license to skip data checks.

:::compare Tree so với các mô hình vừa học
| Mô hình | Học và biên | Scale | Diễn giải / chi phí cần nhớ |
|---|---|---|---|
| Logistic | Hệ số log-odds, tuyến tính theo feature | Quan trọng với penalty | Hệ số tương đối dễ đọc, predict gọn |
| SVM | Margin, tuyến tính hoặc kernel | Quan trọng | Kernel cần support vector, có thể đắt |
| KNN | Mẫu train/láng giềng, biên cục bộ | Quan trọng | Giải thích bằng mẫu gần, predict/RAM tăng theo train |
| Decision Tree | Chuỗi split, các ô theo trục | Thường không cần | Cây nhỏ dễ đọc, depth ảnh hưởng predict; cây sâu dễ bám nhiễu |
:::

Logistic thường fit/predict khá gọn; chọn penalty/C và kiểm feature phi tuyến khi cần. SVM kernel thường train đắt hơn khi dữ liệu lớn, predict phụ thuộc số support vector; C/gamma quyết định độ linh hoạt và nhạy nhiễu. KNN fit chủ yếu lưu dữ liệu, predict phải tìm láng giềng; K/metric/weights ảnh hưởng độ nhạy nhiễu. Tree cần tìm split lúc train, predict chỉ duyệt một đường; depth/min_samples_leaf/ccp_alpha kiểm độ phức tạp. Đây là xu hướng, không phải benchmark hay thứ hạng tốc độ tuyệt đối.

> **EN:** Logistic models are compact baselines; kernel SVM costs depend on data and support vectors; KNN shifts work toward neighbor search at prediction time; trees search splits during fitting and traverse one path at prediction. Their main complexity controls differ, so noise sensitivity and runtime should be compared empirically.

## [sâu] Những hiểu sai cần chặn (ngoài slide)

:::pitfall Một nhánh rất lệch là split tốt nhất
Phải tính impurity con có trọng số trên toàn lần chia. Nhánh một mẫu thuần vẫn có thể thua hai nhánh năm mẫu hơi lẫn, như 0.444444 so với 0.32.
:::

:::pitfall Train 100%, depth không giới hạn là tốt nhất
Demo không giới hạn đạt train 1.0 nhưng CV 0.86, thua depth=5 có CV 0.89. Chọn depth/pruning trên development, không dùng test để thử tới khi đẹp.
:::

:::pitfall Scale chữa cây overfit; importance cao là nguyên nhân
Scale thường không cần cho CART dạng này, không hạn chế số lá. Importance là thống kê model học, có thiên vị và chia sẻ giữa feature tương quan; không chứng minh can thiệp vào feature sẽ đổi kết quả thật.
:::

:::pitfall Cây tự xử lý mọi categorical/missing và không thể lệch class
Native missing hỗ trợ một số cấu hình, không có nghĩa tự hiểu chuỗi nominal. Kiểm encoding/NaN và leakage; class lệch vẫn cần precision/recall và có thể thử `class_weight`, nối [[bài:imbalanced-data]].
:::

:::pitfall Cây hồi quy dự đoán được input ngoài train nên ngoại suy trend tốt
Nhận x=20 không có nghĩa kéo dài xu hướng. Ví dụ stump vẫn trả mean lá 8.666667; phải kiểm miền triển khai, không coi predict chạy được là bằng chứng đáng tin.
:::

> **EN:** Weighted impurity, independent depth selection, input validation and noncausal importance interpretation remain essential even for an interpretable tree.

Nguồn ngoài slide: [Decision Trees và CART](https://scikit-learn.org/stable/modules/tree.html), [DecisionTreeClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html), [DecisionTreeRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html).
