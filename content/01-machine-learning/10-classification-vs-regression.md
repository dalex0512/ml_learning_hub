---
title: Classification vs Regression
order: 10
description: "Phân loại đoán nhóm, hồi quy đoán số (slide 25), ba kiểu phân loại binary, multiclass, multilabel (slide 26), và dạng bài quyết định loss và metric."
slides: 25-26
needs: [learning-paradigms]
tags: [classification, regression, multiclass, multilabel, ordinal]
---

## Ta cần dự đoán một nhãn hay một đại lượng?

:::intro Mục tiêu bài này
- Phân biệt **Classification** (đầu ra là nhóm) và **Regression** (đầu ra là số đo) theo slide 25.
- Phân biệt ba kiểu phân loại ở slide 26: **binary, multiclass, multilabel**.
- Thấy rằng dạng bài toán quyết định **loss và metric**, và một bảng dữ liệu có thể sinh ra nhiều bài toán khác nhau.
:::

Hai câu hỏi nghe giống nhau nhưng khác hẳn: "người này có bị tiểu đường **không**?" (một trong hai nhóm) và "đường huyết của người này sẽ là **bao nhiêu**?" (một con số). Câu đầu là **phân loại (Classification)**; câu sau là **hồi quy (Regression)**. Cả hai đều thuộc Supervised Learning ([[bài:learning-paradigms]]): có nhãn; khác nhau ở **loại nhãn**.

## Bản đồ các bài toán trong Supervised Learning (slide 25)

| Dạng | Loại nhỏ | Ví dụ trên slide |
|---|---|---|
| **Classification** (phân loại) | **Binary** (hai lớp) | fraud detection, email spam detection, diagnostics |
| | **Multiclass** (nhiều lớp) | động vật (cat/dog/horse), trái cây (apple/orange/lemon), hoa (rose/daisy/sunflower) |
| **Regression** (hồi quy) | | ước tính giá nhà, dự đoán chứng khoán, dự báo nhiệt độ |

:::slides 25-26 | Slide 25–26: các bài toán trong Supervised Learning; ba kiểu classification
:::

## Ba kiểu phân loại (slide 26)

Slide 26 phân biệt bằng **câu hỏi mà bài toán đặt ra**:

- **Binary:** *"Email này là spam hay không phải spam?"*: một thứ **hoặc** thứ kia. Hai lớp, mỗi mẫu thuộc đúng một lớp.
- **Multiclass:** *"Ảnh này là sushi, steak hay pizza?"*: nhiều hơn hai lớp, nhưng mỗi mẫu **vẫn thuộc đúng một** lớp.
- **Multilabel:** *"Bài báo này nên gắn những thẻ nào?"*: **nhiều nhãn cho cùng một mẫu**; mỗi thẻ là một câu hỏi có/không riêng.

:::predict
Phân loại hay hồi quy: (1) đoán số sao (1 đến 5) khách chấm cho một quán; (2) đoán mức hài lòng "thấp, vừa, cao"; (3) đoán số lượt bấm vào quảng cáo?
@answer
Cả ba đều **không có đáp án duy nhất**, tùy cách đặt bài toán. (1) Nếu coi 1 đến 5 là năm **nhóm** thì phân loại có thứ tự; nếu coi là **số đo** và muốn đoán 3.7 thì hồi quy. (2) **Phân loại có thứ tự** (ordinal). (3) **Hồi quy** (số đếm), hoặc mô hình đếm chuyên biệt. Mấu chốt: **có thứ tự hay là số chưa đủ để gọi là hồi quy**; phải hỏi ta muốn đoán **nhóm** hay một số có **khoảng cách đều**.
:::

Hãy tự phân loại tám tình huống bên dưới, và đọc lý do cùng loss và metric tương ứng.

:::widget scenario-cards
:::

## Dạng bài toán quyết định loss và metric

Ngay khi chọn dạng bài toán, ta đã chọn luôn cách **học** (loss) và cách **đo** (metric):

| | Phân loại | Hồi quy |
|---|---|---|
| **Đầu ra** | nhãn rời rạc (nhóm) | số liên tục, có ý nghĩa đo lường |
| **Loss thường dùng** | cross-entropy (log loss) | MSE, MAE ([[bài:loss-function]]) |
| **Metric thường dùng** | accuracy, precision, recall, F1 ([[bài:classification-metrics]]) | MAE, RMSE, R² ([[bài:regression-metrics]]) |
| **Dự đoán thường là** | một nhóm, hoặc xác suất của mỗi nhóm | một con số |

Dùng sai cặp là lỗi nghiêm trọng: accuracy vô nghĩa với giá nhà (không có "đoán đúng 100%" một con số liên tục), còn MAE vô nghĩa với nhãn spam.

## Một bảng dữ liệu, hai bài toán

Bộ Diabetes có thể sinh ra **cả hai** loại bài toán:

| | Bài toán A: phân loại | Bài toán B: hồi quy |
|---|---|---|
| Câu hỏi | Người này có tiểu đường không? | Đường huyết (Glucose) của người này là bao nhiêu? |
| Nhãn | `Outcome` (0 hoặc 1) | `Glucose` (một số) |
| Model ví dụ | Logistic Regression | Linear Regression |
| Cách chấm | accuracy **75.3%** (mức sàn đoán toàn 0: 64.3%) | MAE **19.2** mg/dL, R² **0.36** (mức sàn đoán trung bình: MAE 24.4) |

Cùng một bảng, hai câu hỏi, **hai loss và hai metric khác nhau**. (Bài toán B dùng các hàng có Glucose > 0 và các cột còn lại, kể cả `Outcome`; đây chỉ là ví dụ minh họa.)

:::ck
Công ty muốn đoán "khách hàng có rời đi trong tháng tới không" và cũng muốn đoán "khách sẽ chi bao nhiêu tiền trong tháng tới". Mỗi câu là dạng bài nào, và metric nào hợp lý?
@answer
Câu đầu là **phân loại nhị phân** (metric: recall, precision, F1; thường cần chọn ngưỡng). Câu sau là **hồi quy** (metric: MAE hoặc RMSE). Dùng cùng dữ liệu khách hàng nhưng **hai mô hình, hai loss, hai cách đo** khác nhau.
:::

## Những vùng xám cần chú ý

- **Nhãn có thứ tự** (số sao, mức độ): có thể đặt thành phân loại có thứ tự hoặc hồi quy; chọn theo việc dùng kết quả. Nếu cần "sai một bậc khác sai hai bậc" thì cách đo phải phản ánh thứ tự.
- **Số đếm** (số lượt bấm): không âm và là số nguyên; hồi quy thường vẫn dùng được, nhưng có mô hình đếm chuyên biệt.
- **Cổ phiếu:** "giá ngày mai là bao nhiêu" là hồi quy; "ngày mai tăng hay giảm" là phân loại nhị phân. Cùng dữ liệu, **khác bài toán**.
- **Xác suất không phải hồi quy:** Logistic Regression cho ra xác suất nhưng đây vẫn là **phân loại** ([[bài:logistic-regression]]).

## Kiểm tra nhanh kiểu label bằng code

Một thói quen tốt khi mới nhận dataset là xem hình dạng của label. Code chỉ **gợi ý**; ý nghĩa của label mới quyết định:

```python
import numpy as np
def guess_problem_type(y, max_classes=20):
    y = np.asarray(y)
    if y.ndim == 2:                       # mỗi mẫu là một vector 0/1: multilabel
        return "Multilabel classification"
    n_unique = len(np.unique(y))
    if y.dtype.kind in "OUSb":            # chuỗi hoặc bool: chắc chắn là class
        return "Binary classification" if n_unique == 2 else "Multiclass classification"
    if n_unique == 2:
        return "Binary classification (nhãn số nhưng chỉ 2 giá trị)"
    if n_unique <= max_classes and np.all(y == y.astype(int)):
        return "Có thể là Multiclass HOẶC Regression số nguyên: cần xem ý nghĩa"
    return "Regression"
print(guess_problem_type(["spam", "not spam", "spam"]))   # Binary
print(guess_problem_type([[1, 0, 1], [0, 1, 1]]))         # Multilabel
print(guess_problem_type([0, 1, 1, 0, 1]))                # Binary (như Outcome)
print(guess_problem_type([3.75, 4.12, 2.2, 2.3]))         # Regression
print(guess_problem_type([1, 2, 3, 4, 2, 3]))             # cần xem ý nghĩa
```

Ca cuối hàm không tự quyết được: số nguyên có thể là class hoặc là đại lượng đếm. Một cách nhìn hữu ích: Multilabel với K tag có thể coi như **K bài Binary chạy song song**, mỗi bài trả lời "mẫu này có tag thứ k không".

## Những hiểu sai thường gặp

- **"Nhãn là số thì là hồi quy."** Không: nhãn 0/1 là số nhưng là nhóm; mã loại hoa 1, 2, 3 cũng là nhóm.
- **"Tên thuật toán nói lên dạng bài."** Logistic *Regression* là phân loại; một số thuật toán (cây, KNN, SVM) làm được cả hai.
- **"Multiclass là nhiều bài binary."** Có thể xây như vậy, nhưng **dạng bài** khác: mỗi mẫu thuộc đúng một lớp.
- **"Metric nào cũng dùng được."** Cặp loss và metric phải khớp dạng bài.

:::card Classification và Regression
- **Phân loại:** đoán nhóm (binary, multiclass, multilabel). **Hồi quy:** đoán số đo liên tục (giá nhà, nhiệt độ, chứng khoán).
- **Slide 26:** binary là một thứ hoặc thứ kia; multiclass là nhiều hơn hai nhưng mỗi mẫu một lớp; multilabel là nhiều nhãn cho cùng một mẫu.
- **Dạng bài quyết định loss và metric:** cross-entropy với accuracy, precision, recall, F1; MSE với MAE, RMSE, R².
- **Một bảng, nhiều bài toán:** Diabetes phân loại `Outcome` (75.3%) hoặc hồi quy `Glucose` (MAE 19.2, R² 0.36).
- **Có thứ tự hay là số chưa đủ để gọi là hồi quy:** hỏi ta muốn đoán nhóm hay số có khoảng cách đều.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Điểm khác biệt cốt lõi giữa Classification và Regression là gì?
A: Ở dạng của label (output). Classification dự đoán một nhãn
trong tập hữu hạn các class rời rạc; Regression dự đoán một số thực
liên tục. Phép thử nhanh: nếu một đáp án hợp lệ có thể nằm giữa hai đáp
án hợp lệ khác thì đó là Regression.
EN: What is the core difference between Classification and
Regression?
**A:** The form of the label. Classification predicts one of a finite
> set of discrete classes; Regression predicts a continuous real
> number. Quick test: if a valid answer can fall between two other
> valid answers, it's Regression.

Q: Multiclass và Multilabel khác nhau thế nào? Cho mỗi loại một
ví dụ.
A: Multiclass: mỗi mẫu thuộc **đúng một** class trong ≥ 3 class
(ảnh là sushi, steak hoặc pizza). Multilabel: mỗi mẫu có thể mang
**nhiều nhãn cùng lúc** (bài viết được gắn cả tag "Machine learning"
lẫn "Artificial intelligence").
EN: How do Multiclass and Multilabel differ? Give an example of
each.
**A:** Multiclass: each sample belongs to **exactly one** of ≥ 3
> classes (a photo is sushi, steak or pizza). Multilabel: each sample
> can carry **several labels at once** (an article tagged both "Machine
> learning" and "Artificial intelligence").

Q: Cột `Outcome` của Diabetes dataset chứa các số 0 và 1. Đây là
bài toán Regression hay Classification? Vì sao?
A: Binary Classification. 0 và 1 chỉ là mã hóa của hai class
(không bệnh / có bệnh), không có giá trị nào nằm giữa, và phép so sánh
"lớn hơn" giữa chúng không mang ý nghĩa đại lượng.
EN: The Diabetes `Outcome` column contains 0s and 1s. Regression or
Classification? Why?
**A:** Binary Classification. 0 and 1 are just codes for two classes
> (no diabetes / diabetes); no value lies in between and "greater than"
> carries no quantitative meaning.

Q: Vì sao phải xác định dạng bài **trước** khi chọn metric đánh
giá?
A: Vì metric phụ thuộc dạng bài. Classification đo xem đoán
**đúng hay sai nhãn** (Confusion Matrix, Accuracy, Precision, Recall,
F1, ROC/AUC); Regression đo **sai lệch bao nhiêu** giữa hai con số
(MAE, RMSE). Dùng nhầm — ví dụ tính Accuracy cho giá nhà — sẽ cho kết
quả vô nghĩa, vì gần như không bao giờ đoán trúng chính xác từng đồng.
EN: Why must the problem type be identified **before** choosing an
evaluation metric?
**A:** Metrics depend on the problem type. Classification measures
> whether the **label is right or wrong** (Confusion Matrix, Accuracy,
> Precision, Recall, F1, ROC/AUC); Regression measures **how far off**
> a number is (MAE, RMSE). Mixing them up — e.g. computing Accuracy on
> house prices — is meaningless.

Q: "Dự đoán ngày mai mưa hay không" và "dự đoán lượng mưa ngày
mai" — hai bài này thuộc dạng nào? Rút ra điều gì?
A: Bài đầu là Binary Classification, bài sau là Regression.
Cùng một nhu cầu thực tế có thể được thiết kế thành hai dạng bài khác
nhau tùy câu hỏi muốn trả lời, nên việc chọn dạng bài là một quyết định
thiết kế, không chỉ là "nhìn dữ liệu là biết".
EN: "Will it rain tomorrow?" vs "how much will it rain tomorrow?" —
which type is each, and what's the lesson?
**A:** The first is Binary Classification, the second is Regression.
> The same real-world need can be framed as different problem types
> depending on the question, so choosing the type is a design decision.
@tier B | Phỏng vấn lý thuyết
Q: Vì sao Outcome số 0/1 vẫn là classification?
A: Đây là mã của hai class, không phải đại lượng có khoảng cách cần tối ưu. Model có thể xuất xác suất nhưng target vẫn là class và cần metric phân loại.
EN: Numeric codes for categories remain classification targets; a probability output does not change the task type.
Q: Một mẫu có nhiều class có luôn là multiclass không?
A: Không. Multiclass chọn đúng một trong nhiều class, còn multilabel cho phép nhiều nhãn đồng thời. Phân loại món ăn loại trừ nhau khác gắn nhiều thể loại phim.
EN: Multiclass selects one class; multilabel assigns multiple potentially co-occurring labels.
Q: Dự đoán số khách ngày mai là regression hay classification?
A: Thường là bài toán số đếm vì chênh lệch có ý nghĩa định lượng. Có thể đặt thành nhóm thấp/vừa/cao nếu quyết định chỉ cần nhóm, nhưng sẽ mất chi tiết và đổi metric.
EN: Counts are quantitative targets; discretizing them into categories changes the objective and loses detail.
Q: Có thể dùng accuracy cho mọi target số không?
A: Không. Với giá nhà, sai ít vẫn không khớp tuyệt đối nên accuracy không phản ánh mức sai. Dùng MAE/RMSE; với mã class số thì dùng metric classification.
EN: Exact-match accuracy is not a meaningful general-purpose metric for continuous predictions.
@tier C | Tình huống doanh nghiệp
Q: Sàn có rating theo sao và muốn dự đoán mức hài lòng. Chọn dạng bài nào?
A: Hỏi cần điểm số hay mức để hành động. Nếu thứ tự quan trọng nhưng khoảng cách chưa đều, cân nhắc ordinal classification; nếu dùng điểm trung bình có thể thử regression kèm giả định rõ. So theo chi phí dự đoán lệch nhiều mức, không chỉ accuracy *(bổ sung)*.
WANT: Không chọn chỉ vì nhãn được lưu bằng số.
Q: Một bài viết có thể thuộc nhiều chủ đề nhưng hệ thống bắt chọn một. Sửa thế nào?
A: Kiểm tra định nghĩa nhãn và mục tiêu tìm kiếm. Nếu chủ đề thực sự đồng thời, đổi thành multilabel và dữ liệu gán nhiều nhãn; đánh giá theo từng tag và chi phí bỏ sót. Nếu nghiệp vụ cần một mục chính, giữ multiclass với quy tắc mục chính rõ *(bổ sung)*.
WANT: Biết mục tiêu nghiệp vụ quyết định tính loại trừ của class.
Q: Kho chỉ cần biết ngày mai nhu cầu vượt sức chứa không. Cần regression?
A: Có thể classification vượt/không vượt nếu đó là quyết định duy nhất. Regression dự báo số lượng hỗ trợ nhiều ngưỡng nhưng đòi hỏi metric và kiểm chứng khác. Chọn theo hành động, chi phí báo động giả/bỏ sót và nhu cầu chi tiết *(bổ sung)*.
WANT: Biết cùng một dữ liệu có nhiều cách đặt bài toán hợp lệ.
:::

## Nối sang bài sau

:::next
Khi đầu ra là class, sai không chỉ có một kiểu. [[bài:confusion-matrix]] tách báo động giả và bỏ sót thành bốn ô TP, FP, FN, TN.
:::
