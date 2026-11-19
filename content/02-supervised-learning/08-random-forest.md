---
title: "Rừng ngẫu nhiên (Random Forest)"
order: 8
description: "Random Forest (slide 78-80): nhiều cây học tập dữ liệu bootstrap rồi bỏ phiếu; tính xác suất đa số, OOB, và đo số cây trên Diabetes."
slides: 78-80
needs: [decision-tree, k-fold-cross-validation]
tags: [random-forest, bagging, bootstrap, ensemble, oob, feature-importance, classification, regression]
---

## Vì sao kết hợp nhiều cây?

:::intro Mục tiêu bài này
- Đọc ba slide Random Forest (78 đến 80): một cây so với cả rừng, mỗi cây học một tập dữ liệu, bỏ phiếu đa số.
- Hiểu hai nguồn ngẫu nhiên tạo sự **đa dạng**: **bootstrap** và chọn feature ngẫu nhiên; tính được xác suất bỏ phiếu đa số.
- Hiểu **out-of-bag (OOB)** và đọc số đo thật: bao nhiêu cây là đủ, rừng hơn cây đơn bao nhiêu trên Diabetes.
:::

## Đọc slide 78 đến 80

:::slides 78-80 | Slide 78–80: Random Forest, một cây so với cả rừng, mỗi cây học tập dữ liệu riêng, bỏ phiếu đa số
:::

- **Slide 78:** bên trái là **một Decision Tree**; bên phải là **cả rừng** gồm nhiều cây nhỏ, mỗi cây có màu riêng và tự đưa ra lớp của mình (ghi Class 1, Class 2...). Ý chính: thay một cây lớn bằng **nhiều cây khác nhau**.
- **Slide 79:** sơ đồ quy trình. Training Set tách thành **Training Data 1, 2, …, n**; mỗi tập huấn luyện một **Decision Tree** riêng; các cây đi vào ô **Voting (averaging)** rồi ra **Prediction**. Test Set đi qua cùng rừng đó.
- **Slide 80:** một **Instance** (một quả) đi qua các cây: Tree-1 nói Class A (táo), Tree-2 nói Class A, Tree-n nói Class B (chuối); **Majority-Voting** chọn A, nên **Final-Class** là táo. Đúng bằng đếm phiếu: A thắng 2 so với 1.

## Vì sao bỏ phiếu giúp được

Hỏi ý kiến **một người** hay **một hội đồng**? Một cây quyết định hay thay đổi và hay học thuộc ([[bài:decision-tree]]). Nếu huấn luyện nhiều cây và cho chúng **bỏ phiếu**, lỗi riêng từng cây có thể bù trừ nhau. Hãy tính: năm cây, mỗi cây đúng 70%, và (giả định) mắc lỗi **độc lập**. Đa số (ít nhất 3 trong 5 cây) đúng với xác suất:

:::steps
Chính xác 3 cây đúng: C(5,3)·0.7³·0.3² = 10 × 0.343 × 0.09 = **0.309**.
@step
Chính xác 4 cây đúng: C(5,4)·0.7⁴·0.3 = 5 × 0.2401 × 0.3 = **0.360**.
@step
Cả 5 cây đúng: 0.7⁵ = **0.168**. Cộng lại: 0.309 + 0.360 + 0.168 = **0.837**.
@step
Từ 70% lên **83.7%** chỉ nhờ bỏ phiếu. Nhưng điều kiện quyết định là **độc lập**: nếu năm cây giống hệt nhau, bỏ phiếu không giúp gì (vẫn 70%).
:::

:::predict
Nếu ta cho **cả năm cây học trên toàn bộ dữ liệu train như nhau**, với cùng thuật toán tham lam, các cây sẽ khác nhau nhiều không? Bỏ phiếu giúp được bao nhiêu?
@answer
Các cây sẽ **gần như giống hệt nhau**: cùng dữ liệu, cùng cách chia tham lam. Bỏ phiếu giữa các cây giống nhau **gần như không cải thiện gì** so với một cây. Muốn cải thiện, các cây phải **khác nhau**: đó là lý do mỗi cây học từ một góc nhìn khác (Training Data 1, 2, …, n ở slide 79).
:::

## Hai nguồn ngẫu nhiên để các cây khác nhau

1. **Bootstrap (bagging):** mỗi cây học trên một **mẫu bốc có hoàn lại** từ dữ liệu train (cùng kích thước n). Mẫu nào không được chọn gọi là **out-of-bag (OOB)**. Đây chính là "Training Data 1, 2, …, n" của slide 79.
2. **Chọn feature ngẫu nhiên:** ở **mỗi lần chia**, cây chỉ xét một tập con feature ngẫu nhiên (mặc định `sqrt` số feature cho phân loại trong sklearn), nên các cây không đều chọn cùng feature mạnh nhất.

Hãy thử cả hai: bấm "Lấy mẫu mới" để xem bootstrap, và kéo số cây để xem bỏ phiếu.

:::widget bootstrap-vote
:::

Một mẫu **không** được chọn trong n lần bốc với xác suất (1 − 1/n)ⁿ: 0.349 khi n = 10, 0.366 khi n = 100, tiến tới 1/e ≈ **0.368**. Nên mỗi cây thấy khoảng **63.2%** mẫu khác nhau, và khoảng 36.8% còn lại là OOB. Vì OOB chưa được cây đó thấy, nó dùng như một **validation miễn phí** (`oob_score=True`), nhưng vẫn nên giữ bộ test cuối.

## Số đo thật trên Diabetes

CV 5-fold có phân tầng (`random_state=42`), `RandomForestClassifier(random_state=0)`; độ lệch là độ lệch chuẩn giữa các fold:

| Số cây | CV accuracy | Độ lệch |
|---|---|---|
| 1 | 0.668 | 0.033 |
| 5 | 0.728 | 0.023 |
| 25 | 0.750 | 0.013 |
| 100 | 0.762 | 0.025 |
| 300 | 0.763 | 0.030 |
| (một Decision Tree đầy đủ) | 0.700 | |

Đọc: rừng 100 cây hơn một cây khoảng **6 điểm** (0.762 so với 0.700). Lợi ích **giảm dần**: 25 lên 100 cây thêm 0.012, còn 100 lên 300 chỉ thêm 0.001, nằm trong dao động giữa các fold. Thêm cây tốn thời gian và bộ nhớ nhưng không làm xấu đi nhiều.

Trên chia 80/20 (`random_state=42`, 300 cây): **điểm OOB 0.777** (ước lượng không cần test), test **0.747**, train **1.000**. Cả cây đơn lẫn rừng đều chạm train 1.000 vì mỗi cây vẫn sâu hết cỡ; khác biệt nằm ở độ ổn định chứ không phải độ khớp train. Mỗi cây riêng trong rừng chỉ đúng **0.674** trên test (từ 0.519 đến 0.773), vậy mà cả rừng cho 0.747: đúng là "yếu nhưng khác nhau thì bỏ phiếu mạnh". Trên bộ test chỉ 154 mẫu, chênh lệch vài điểm chưa kết luận được, nên số CV đáng tin hơn.

**Feature importance** (độ giảm độ không thuần trung bình): Glucose 0.251, BMI 0.163, Age 0.145, DiabetesPedigreeFunction 0.123, BloodPressure 0.091, Pregnancies 0.080, Insulin 0.075, SkinThickness 0.070. Cùng thứ hạng đầu (Glucose, BMI, Age) với trọng số Logistic ở [[bài:logistic-regression]], nhưng đừng đọc như quan hệ nhân quả; nó cũng thiên về feature có nhiều giá trị khác nhau.

:::ck
Một đồng nghiệp bảo "thêm cây mãi thì Random Forest sẽ không bao giờ overfit". Đúng hay sai?
@answer
**Đúng một nửa.** Thêm cây **giảm phương sai** và thường không làm overfit nặng hơn (100 lên 300 cây gần như không đổi), nhưng nếu mỗi cây quá sâu trên dữ liệu nhiễu, rừng vẫn có thể bám nhiễu (train vẫn 1.000); và nếu feature rò rỉ nhãn, rừng vẫn rò rỉ. Thêm cây không chữa được lỗi dữ liệu.
:::

## Thực hành

- **Không cần scale**, ít cần tinh chỉnh; nặng hơn và khó giải thích hơn một cây; vẫn **không ngoại suy**.
- Chọn số cây và độ sâu bằng cross-validation ([[bài:k-fold-cross-validation]]); đặt `random_state` để tái lập.
- So với các mô hình khác trên cùng bảng: [[bài:supervised-algorithms]] (Logistic 0.775 và Forest 0.769 ngang nhau).

## Làm tay bootstrap và out-of-bag, và hai cách bỏ phiếu

**Mười mẫu, mười lượt rút.** Đánh số mẫu 1 đến 10. `np.random.default_rng(42).integers(1, 11, size=10)` rút được **[1, 8, 7, 5, 5, 9, 1, 7, 3, 1]** (số tự soạn để minh họa):

| Mẫu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Số lần rút | 3 | 0 | 1 | 0 | 2 | 0 | 2 | 1 | 1 | 0 |

![Bootstrap 10 lượt: các mẫu xuất hiện lặp và các mẫu OOB](/plots/random-forest-bootstrap.png)

Có 10 lượt nhưng chỉ **6 dòng khác nhau**: {1, 3, 5, 7, 8, 9}. **Out-of-bag (OOB)** của cây này là các dòng không được rút: **{2, 4, 6, 10}**; cây khác có bộ OOB khác. Với một dòng, xác suất không bị chọn ở một lượt là 9/10, nên sau 10 lượt độc lập có hoàn lại P(OOB) = (9/10)¹⁰ = **0.3487**, và kỳ vọng số dòng khác nhau là 10 × (1 − 0.3487) ≈ **6.51**. Số thực hiện (4 dòng OOB, 6 dòng khác nhau) không cần bằng kỳ vọng. Với N lớn, (1 − 1/N)ᴺ tiến tới e⁻¹ ≈ 0.368 và tỉ lệ dòng khác nhau tiến tới 0.632.

Để có **điểm OOB**, mỗi dòng chỉ được dự đoán bằng các cây **không từng rút dòng đó**, rồi gom lại tính accuracy (`oob_score=True`). OOB tận dụng phần dữ liệu mỗi cây bỏ qua làm validation, nhưng không thay được bộ test cuối ([[bài:train-test-split]]); và nếu imputer, encoder hay chọn feature đã học trên toàn bộ development trước khi vào forest, mẫu OOB có thể đã ảnh hưởng tiền xử lý.

**Bỏ phiếu cứng và bỏ phiếu mềm.** *Hard vote* đếm nhãn: bảy cây A, B, A, A, B, A, B cho A thắng 4 so với 3. *Soft vote* trung bình xác suất, và `RandomForestClassifier` của scikit-learn làm theo cách này: ba cây có P(A) = 0.51, 0.51, 0.01 cho trung bình P(A) = 1.03/3 ≈ **0.343** và P(B) ≈ **0.657**, nên chọn **B**, dù hard vote (A, A, B) chọn A. Hai cây tự tin vừa phải bị một cây rất tự tin kéo lệch: biết phiếu đang là nhãn hay xác suất là biết kết quả sẽ khác thế nào.

```python
import numpy as np
from math import comb
p = 0.7
terms = [comb(5, k) * p**k * (1 - p)**(5 - k) for k in (3, 4, 5)]
print(terms, sum(terms))                       # 0.3087 0.36015 0.16807 -> 0.83692
draw = np.random.default_rng(42).integers(1, 11, size=10)
counts = np.bincount(draw, minlength=11)[1:]
print(draw.tolist(), np.arange(1, 11)[counts == 0].tolist())   # [1, 8, 7, 5, 5, 9, 1, 7, 3, 1] [2, 4, 6, 10]
print((1 - 1/10)**10, 10 * (1 - (1 - 1/10)**10))              # 0.3487 6.513
pa = np.array([0.51, 0.51, 0.01])
print(pa.mean(), 1 - pa.mean())                                # 0.3433 0.6567 (soft vote)
```

## Những hiểu sai thường gặp

- **"Nhiều cây giống nhau thì bỏ phiếu tốt hơn."** Phải khác nhau; nhờ bootstrap và chọn feature ngẫu nhiên.
- **"Bỏ phiếu luôn nâng 70% lên 83.7%."** Chỉ khi lỗi độc lập, hiếm khi đạt đủ.
- **"Mỗi cây chỉ dùng một phần dữ liệu nên bỏ phí phần còn lại."** Phần OOB dùng làm validation.
- **"Random Forest không bao giờ overfit."** Chỉ ổn hơn một cây; dữ liệu rò rỉ hay nhiễu vẫn là vấn đề.
- **"Importance là nguyên nhân."** Nó chỉ nói cột nào mô hình dùng nhiều.

:::card Random Forest
- **Nhiều cây bỏ phiếu** (slide 79 và 80); 5 cây độc lập, mỗi cây đúng 70% cho đa số đúng **83.7%**; cây giống nhau thì vote vô nghĩa.
- **Đa dạng** từ bootstrap (mỗi cây thấy ~63.2% mẫu; 36.8% là OOB) và chọn feature ngẫu nhiên mỗi lần chia.
- **Số đo Diabetes:** một cây CV 0.700, rừng 100 cây 0.762; từ 100 cây trở đi thêm cây gần như không đổi.
- **Không cần scale**; nặng, khó giải thích hơn một cây; importance không phải nhân quả.
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

Thực hành: [[bài:diabetes-evaluate-improve]] — kiểm forest trên bảng diabetes và chọn pipeline bằng cv.
:::
