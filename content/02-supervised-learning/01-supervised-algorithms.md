---
title: Bản đồ thuật toán Supervised Learning
order: 1
description: "Bản đồ thuật toán Supervised Learning (slide 64): chọn ứng viên theo ba câu hỏi, baseline trước, và so sánh thật bằng cross-validation trên Diabetes."
slides: 64
needs: [classification-vs-regression, model-training-pipeline]
tags: [supervised, regression, classification, algorithm, baseline]
---

## Biết bài toán rồi, thử mô hình nào trước?

:::intro Mục tiêu bài này
- Đọc bảng thuật toán Supervised Learning của slide 64 (hai cột và dấu sao).
- Hiểu mỗi họ thuật toán **giải quyết điều gì** mà họ trước không giải quyết được.
- Biết quy trình chọn: **baseline trước**, rồi so các ứng viên bằng cross-validation.
:::

Sau khi đặt bài toán ([[bài:classification-vs-regression]]), câu hỏi tiếp theo: dùng mô hình nào? Câu trả lời trung thực là: **không có mô hình tốt nhất cho mọi bài**. Mỗi mô hình hợp với một kiểu dữ liệu, và cách duy nhất để biết là thử, đo công bằng, rồi so sánh.

## Đọc slide 64

:::slides 64 | Slide 64: Supervised Learning algorithms, hai cột Regression và Classification
:::

- **Cột Regression (hồi quy):** Linear Regression, Polynomial Regression, và dòng chú thích "Could also be used here".
- **Cột Classification (phân loại):** Logistic Regression, Support Vector Machine\*, K-nearest neighbours\*, Naive Bayes, Decision Tree\*, Random Forest\*.
- **Chữ xanh có dấu \*** là các thuật toán **cũng dùng được cho hồi quy** (SVM, KNN, Decision Tree, Random Forest). Logistic Regression dù tên có chữ "regression" vẫn là bộ phân loại.
- **Naive Bayes** có trên slide nhưng khóa học không có bài riêng cho nó; ở đây chỉ cần biết nó là một họ phân loại dựa trên xác suất.

Thử thu hẹp ứng viên theo loại target và nhu cầu giải thích:

:::widget algo-filter
:::

:::predict
Bạn có một bảng 768 dòng, 8 cột số, nhãn 0/1. Bạn **chưa biết** mô hình nào hợp. Cách nào nên làm đầu tiên: (a) chọn mô hình phức tạp nhất, (b) chọn một mô hình đơn giản làm baseline rồi so các mô hình khác với nó, (c) chọn mô hình mà bài báo mới nhất khen?
@answer
**(b).** Một baseline đơn giản cho bạn **mức sàn** để biết mô hình phức tạp có thật sự hơn không. Số đo ngay bên dưới sẽ cho thấy vì sao.
:::

## Mỗi họ giải quyết điều gì

| Họ | Ý chính | Bài |
|---|---|---|
| **Linear / Logistic** | một đường thẳng (hoặc điểm tuyến tính qua sigmoid); đơn giản, đọc được hệ số | [[bài:linear-regression]], [[bài:logistic-regression]] |
| **Polynomial** | uốn đường thẳng thành đường cong bằng feature đa thức | [[bài:polynomial-regression]] |
| **SVM** | đường phân tách có **lề rộng nhất**, kernel cho ranh giới cong | [[bài:svm]] |
| **KNN** | không học một đường; hỏi những mẫu **gần nhất** | [[bài:k-nearest-neighbours]] |
| **Decision Tree** | chuỗi câu hỏi có/không, đọc được thành luật | [[bài:decision-tree]] |
| **Random Forest** | nhiều cây bỏ phiếu để ổn định hơn một cây | [[bài:random-forest]] |

## Chọn ứng viên theo bài toán

Ba câu hỏi giúp thu hẹp:

1. **Target là số hay nhóm?** (số: hồi quy; nhóm: phân loại.)
2. **Có cần giải thích được không?** (Linear, Logistic, cây: dễ đọc; SVM kernel, forest: khó hơn.)
3. **Dữ liệu cần scale không, có nhiều outlier không?** (KNN, SVM, Logistic cần scale; cây thì không, [[bài:feature-scaling]].)

Rồi chọn **2 đến 3 ứng viên**, đặt chung một Pipeline và so bằng cross-validation ([[bài:k-fold-cross-validation]]).

## Thử thật trên Diabetes

Cùng một bảng Diabetes (768 hàng, 8 feature, 34.9% là nhãn 1), 5-fold CV có phân tầng (`StratifiedKFold(5, shuffle=True, random_state=42)`), mô hình mặc định, accuracy trung bình:

| Mô hình | Accuracy | Độ lệch giữa các fold |
|---|---|---|
| Baseline: đoán lớp đông (nhãn 0) | 0.651 | 0.002 |
| Logistic Regression (có scale) | **0.775** | 0.015 |
| Random Forest | 0.769 | 0.018 |
| SVM (có scale) | 0.762 | 0.017 |
| KNN (có scale) | 0.728 | 0.020 |
| Decision Tree (một cây) | 0.700 | 0.041 |

Ba điều đọc được. **Một:** baseline 0.651 trùng đúng tỉ lệ lớp đông, nên mọi mô hình phải vượt mức đó mới có giá trị. **Hai:** mô hình đơn giản nhất (Logistic) đứng đầu, chỉ hơn Random Forest 0.006, nhỏ hơn độ lệch giữa các fold (0.015 đến 0.018): hai mô hình này **chưa phân biệt được**. **Ba:** một cây đơn lẻ kém nhất và dao động mạnh nhất (0.041), đúng lý do người ta gộp nhiều cây thành forest. Đây là kết quả trên **một** bộ dữ liệu với tham số mặc định; bộ khác có thể cho thứ tự khác.

:::ck
Một mô hình đạt accuracy 80% trên bộ test, nhưng đoán toàn lớp đông cũng được 78%. Nên kết luận gì?
@answer
Mô hình chỉ hơn mức sàn **2 điểm**: chưa chắc có giá trị. Luôn so với **baseline** (đoán lớp đông, hoặc mô hình đơn giản nhất) trước khi khen một con số.
:::

## Tự so sánh ứng viên bằng code

Đoạn dưới tái hiện bảng ở trên (đã chạy trên `diabetes.csv`): cùng một cách chia fold cho mọi mô hình, mô hình cần scale thì đặt scaler trong `Pipeline`, và luôn có một **baseline**:

```python
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

data = pd.read_csv("diabetes.csv")
X, y = data.drop(columns="Outcome"), data["Outcome"]
cv = StratifiedKFold(5, shuffle=True, random_state=42)
models = {
    "Dummy (đoán lớp đông)": DummyClassifier(strategy="most_frequent"),
    "Logistic":              make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
    "KNN":                   make_pipeline(StandardScaler(), KNeighborsClassifier()),
    "SVM":                   make_pipeline(StandardScaler(), SVC()),
    "Decision Tree":         DecisionTreeClassifier(random_state=42),
    "Random Forest":         RandomForestClassifier(random_state=42),
}
for name, model in models.items():
    s = cross_val_score(model, X, y, cv=cv)
    print(f"{name:24s} {s.mean():.3f}  (độ lệch {s.std():.3f})")
# Dummy 0.651, Logistic 0.775, SVM 0.762... xem bảng trên
```

Sau bước này mới có cơ sở chọn: ứng viên nào hơn baseline rõ rệt, chênh lệch có lớn hơn độ lệch giữa các fold không, và có cần giải thích được không. Các bài sau lần lượt mở từng họ.

## Những hiểu sai thường gặp

- **"Có mô hình tốt nhất."** Không; thứ tự phụ thuộc dữ liệu, metric và cách chia.
- **"Phức tạp hơn là tốt hơn."** Trên Diabetes, Logistic đơn giản ngang hoặc hơn Forest.
- **"Logistic Regression là hồi quy."** Nó là bộ phân loại; chữ "regression" nằm ở cách nó tính xác suất.
- **"Dấu * nghĩa là dùng thế nào cũng được."** Chỉ nghĩa là có phiên bản cho cả hai loại target; mỗi phiên bản là một mô hình riêng.
- **"Hơn 0.006 là thắng."** Khi chênh lệch nhỏ hơn độ lệch giữa các fold thì chưa kết luận được.

:::card Bản đồ thuật toán
- **Không có mô hình tốt nhất** cho mọi bài; thử và đo công bằng.
- **Baseline trước** (đoán lớp đông: 0.651 trên Diabetes), rồi so ứng viên bằng CV.
- **Thu hẹp bằng ba câu hỏi:** target là số hay nhóm; cần giải thích không; có cần scale không.
- **Dấu \* ở slide 64:** SVM, KNN, Decision Tree, Random Forest dùng được cho cả hai loại target.
- **Mô hình phức tạp hơn không tự động tốt hơn:** Logistic 0.775 so với Forest 0.769.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Slide 64 có bốn họ mang dấu sao nào? Dấu sao có nghĩa gì?
A: SVM, KNN, Decision Tree, Random Forest. Các họ này có phiên bản cho regression và classification; không có nghĩa dùng cùng một classifier cho target liên tục.
Q: Vì sao Logistic Regression ở cột Classification dù tên có chữ regression?
A: Bài toán nó giải quyết trong bảng là dự đoán class, thường qua xác suất rồi quy tắc quyết định. Phải nhìn đầu ra và mục tiêu, không suy từ tên; [[bài:logistic-regression]] giải thích phần hồi quy log-odds và sigmoid.
Q: Dự đoán giá căn hộ và dự đoán căn hộ có bán trong tháng là cùng bài toán không?
A: Không. Giá là target số cho regression; có/không bán là class cho binary classification. Có thể cùng feature nhưng khác label, estimator và metric.
Q: Có được dùng mã class 0/1/2 làm lý do chọn Linear Regression không?
A: Không. Đó có thể là mã nominal. Cần xác định ý nghĩa và chi phí sai, rồi chọn bài toán phù hợp; khoảng cách số giữa các mã không tự mang ý nghĩa.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Giải thích bản đồ này cho người mới trong 30 giây.
A: Trước tiên hỏi cần đoán một đại lượng hay một loại. Sau đó chọn vài họ phù hợp, bắt đầu bằng baseline. Một số họ có cả bản hồi quy và phân loại; chất lượng phải đo trên validation cùng metric.
EN: Define the target first, choose compatible model families, and compare candidates against a baseline on validation data.
Q: **B2.** Vì sao không mặc định chọn Random Forest vì có nhiều cây hơn?
A: Nhiều cây không bảo đảm tốt hơn cho mọi dữ liệu/mục tiêu. Cần so sai số, chi phí dự đoán, dung lượng và khả năng giải thích với baseline đơn giản dưới cùng cách split.
EN: More trees do not guarantee the best fit for every task; compare predictive quality, cost and interpretability under the same evaluation protocol.
Q: **B3.** Chọn classifier hay regressor của một họ bằng cách nào?
A: Từ ý nghĩa target và quyết định cần đưa ra. Class dùng classifier với metric phân loại; đại lượng số dùng regressor với metric hồi quy. Kiểm tra cả giả định của nhãn, không chỉ dtype.
EN: Choose the estimator variant from the semantics of the target and the decision, rather than its storage type.
Q: **B4.** Baseline giúp gì trước khi thử thuật toán phức tạp?
A: Cho mốc về giá trị tăng thêm của model và giúp phát hiện lỗi pipeline. Nếu model không vượt dự đoán mean train hoặc quy tắc đơn giản trên validation, cần xem dữ liệu, split, metric trước khi tăng độ phức tạp.
EN: A baseline measures incremental value and helps reveal pipeline problems before adding complexity.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Sếp yêu cầu “dùng SVM để dự đoán doanh số”. Bạn chốt thử nghiệm thế nào?
A: Xác định doanh số theo thời điểm/đơn vị, feature có sẵn lúc dự đoán và chi phí sai. Dựng baseline, Linear Regression, rồi SVR nếu hợp lý; scale trong train và split theo thời gian nếu dự báo tương lai. So validation cùng metric và thời gian chạy; không cam kết thuật toán trước khi đo.
WANT: Chuyển yêu cầu tên thuật toán thành thiết kế thử nghiệm có target, baseline và đánh giá phù hợp.
Q: **C2.** Team muốn chọn classifier cho fraud bằng accuracy cao nhất. Bạn phản hồi gì?
A: Xem tỉ lệ fraud và baseline luôn đoán bình thường, thống nhất chi phí bỏ sót/duyệt nhầm và năng lực xử lý. So Precision/Recall hoặc chi phí ở ngưỡng chọn trên validation, dùng cùng split chống leakage; chọn họ model sau khi có khung đo đó.
WANT: Metric và quyết định kinh doanh đi trước cuộc thi thuật toán.
Q: **C3.** Hai ứng viên có chất lượng validation tương đương, một mô hình dễ giải thích và một mô hình chậm hơn nhiều. Làm gì?
A: Kiểm tra độ biến động qua split/fold và các nhóm quan trọng. Nếu chênh lệch chưa rõ mà model đơn giản đáp ứng yêu cầu, ưu tiên chi phí thấp và dễ vận hành; ghi lại đánh đổi và theo dõi dữ liệu thực thay vì tối ưu một con số rất nhỏ.
WANT: Biết cân bằng độ bất định, chất lượng và chi phí vận hành.
:::

## Nối sang bài sau

:::next
Bắt đầu với [[bài:linear-regression]]: học hệ số của một quan hệ tuyến tính, tự tính một ví dụ nhỏ rồi đối chiếu sklearn; sau đó [[bài:polynomial-regression]] thêm feature để khớp đường cong. [[bài:logistic-regression]] chuyển sang phân loại bằng xác suất và ngưỡng; [[bài:svm]] học biên theo margin và dùng kernel khi cần; [[bài:k-nearest-neighbours]] dự đoán từ các mẫu train gần nhất. [[bài:decision-tree]] học chuỗi luật chia dữ liệu; [[bài:random-forest]] gộp nhiều cây đa dạng và khép lại phạm vi slide 64–80. Naive Bayes chưa có slide riêng trong phạm vi này nên chưa có bài.
:::
