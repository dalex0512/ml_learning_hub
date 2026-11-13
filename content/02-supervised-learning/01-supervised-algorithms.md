---
title: Bản đồ thuật toán Supervised Learning
order: 1
description: "Đọc bảng thuật toán trên slide 64: chọn họ mô hình từ target, hiểu dấu sao và dùng baseline để bắt đầu thử nghiệm."
slides: 64
needs: [classification-vs-regression, model-training-pipeline]
tags: [supervised, regression, classification, algorithm, baseline]
---

## Đã biết bài toán, bắt đầu thử mô hình nào?

:::intro Đọc xong bài này bạn làm được
- Đọc đúng hai cột và dấu sao trên slide 64.
- Phân biệt tên họ thuật toán với phiên bản dành cho regression/classification.
- Chọn một baseline có lý do, rồi đánh giá trên dữ liệu chưa thấy.
:::

[[bài:classification-vs-regression]] giúp xác định **target cần dự đoán**; [[bài:model-training-pipeline]] giải thích mô hình học từ X và y. Module này bắt đầu đi vào từng thuật toán. Bảng [[slide:64]] là bản đồ các lựa chọn, không phải bảng xếp hạng chất lượng.

> **EN:** The target defines the task; the algorithm defines how a model learns from features and labels. This slide is a map of model families, not a performance ranking.

:::slides 64 | Hai cột Regression / Classification; dấu * chỉ họ thuật toán có phiên bản hồi quy
:::

## Đọc đúng hai cột và dấu sao

Trên slide, cột **Regression** ghi Linear Regression, Polynomial Regression. Cột **Classification** ghi Logistic Regression, Support Vector Machine*, K-nearest neighbours*, Naive Bayes, Decision Tree*, Random Forest*. Dòng “*Could also be used here” ở cột trái nói rằng **bốn họ có dấu sao cũng dùng được cho regression**.

Không phải lấy nguyên một classifier rồi truyền label liên tục vào. Ta chọn phiên bản phù hợp: ví dụ `SVC` / `SVR`, `KNeighborsClassifier` / `KNeighborsRegressor`. Tên **Logistic Regression** có chữ regression nhưng trong bảng này nó là thuật toán **classification**; Polynomial Regression vẫn dự đoán đại lượng số.

> **EN:** Stars mark families with both classification and regression variants. Choose the appropriate estimator and objective; Logistic Regression is a classifier despite its name.

:::note Phạm vi nguồn
Slide 64 chỉ liệt kê tên và dấu sao. Các câu mô tả ý tưởng, ưu/nhược và bảng chọn dưới đây là **bổ sung ngoài slide** để đọc bản đồ; chưa phải bài hướng dẫn các thuật toán chưa học. Linear Regression, Polynomial Regression, hồi quy logistic và SVM đã có bài riêng.
:::

## Mỗi họ thuật toán giải quyết điều gì? (bổ sung ngoài slide)

:::compare Bản đồ module — ý tưởng để định hướng, không phải cam kết chất lượng
| Thuật toán trên slide | Bài toán | Ý tưởng một câu | Điểm mạnh / giới hạn cần nhớ | Bài riêng |
|---|---|---|---|---|
| Linear Regression | Regression | Khớp tổng có trọng số của các feature với target | Nhanh, dễ giải thích hệ số / khó khớp đường cong khi chỉ dùng feature gốc, nhạy outlier | [[bài:linear-regression]] |
| Polynomial Regression | Regression | Thêm lũy thừa/tích của feature để mô tả đường cong | Biểu diễn được quan hệ cong / bậc cao dễ overfit và ngoại suy kém | [[bài:polynomial-regression]] |
| Logistic Regression | Classification | Biến điểm tuyến tính thành xác suất class trong mô hình logistic | Baseline dễ kiểm tra / ranh giới hạn chế nếu feature không đủ | [[bài:logistic-regression]] |
| Support Vector Machine* | Cả hai, tùy phiên bản | SVC tìm biên phân tách; SVR khớp với một vùng dung sai | Kernel có thể mô tả phi tuyến / cần chú ý scale, tham số và chi phí với tập lớn | [[bài:svm]] |
| K-nearest neighbours* | Cả hai | Dựa vào nhãn/giá trị của các láng giềng gần nhất | Trực quan, ít bước fit / nhạy scale, số chiều, tốn chi phí khi dự đoán | Sắp có |
| Naive Bayes | Classification trong bảng này | Kết hợp bằng chứng theo xác suất với giả định độc lập có điều kiện | Nhẹ, thường là baseline cho text / giả định có thể lệch dữ liệu | Sắp có |
| Decision Tree* | Cả hai | Chia dữ liệu theo các điều kiện rồi dự đoán ở lá | Bắt tương tác, ít cần scale / cây sâu dễ overfit và bất ổn | Sắp có |
| Random Forest* | Cả hai | Gộp nhiều cây có ngẫu nhiên hóa mẫu/feature | Giảm biến động so với một cây / nặng hơn và khó giải thích bằng một hệ số | Sắp có |
:::

Đây là **xu hướng để chọn ứng viên**, không phải kết quả benchmark. Cùng một họ có nhiều cấu hình; dữ liệu, cách split, metric và tài nguyên mới quyết định lựa chọn cuối. Các tên “Sắp có” là văn bản, chưa tạo đường dẫn tới bài chưa viết.

> **EN:** These are starting intuitions, not benchmark results. Model selection depends on the data, split, metric and resource budget.

## Chọn ứng viên theo bài toán (bổ sung ngoài slide)

:::compare Từ target đến thử nghiệm đầu tiên
| Câu hỏi thực tế | Loại target | Bắt đầu hợp lý | Kiểm tra trước khi nâng độ phức tạp |
|---|---|---|---|
| Dự đoán giá nhà | Giá trị tiền | Baseline dự đoán mean, rồi Linear Regression | MAE/RMSE, residual theo diện tích/khu vực, split đúng |
| Email spam hay bình thường | Class | Baseline theo tần suất; Naive Bayes hoặc Logistic là ứng viên | Precision/Recall, nhãn, cách biểu diễn text |
| Dữ liệu bảng có tương tác/ngưỡng | Tùy target | So baseline với cây/forest đúng phiên bản | Validation, overfit, chi phí và cách diễn giải |
| Điểm gần nhau có hành vi giống nhau | Tùy target | KNN là ứng viên có thể thử | Scale, khoảng cách, số chiều, thời gian dự đoán |
:::

“Bắt đầu đơn giản” nghĩa là tạo mốc đo có thể kiểm chứng. Với regression, mean của **train** là baseline dùng cho các tập sau; với classification, đoán class đông nhất giúp nhận ra bẫy accuracy. Chọn/tune bằng validation hoặc [[bài:k-fold-cross-validation]]; giữ test cho đánh giá cuối. Dữ liệu thời gian/nhóm cần cách split tương ứng, không mặc định chia ngẫu nhiên.

> **EN:** A baseline gives a reference, not a final model. Learn baseline parameters from training data, use validation for selection, and reserve test data for the final estimate.

:::pitfall Dấu sao không có nghĩa model tự nhận ra bài toán
Random Forest có thể hồi quy và phân loại nhưng cần chọn estimator, loss và metric thích hợp. Một mã class dạng số vẫn có thể là target categorical; đừng quyết định chỉ từ dtype. Với class hiếm, nối lại [[bài:classification-metrics]] trước khi chọn ứng viên theo accuracy.
:::

## Tóm tắt 1 phút

:::recap
- Slide 64 là bản đồ regression/classification, không xếp hạng thuật toán.
- Linear/Polynomial ở cột hồi quy; Logistic ở cột phân loại.
- SVM, KNN, Decision Tree, Random Forest có dấu sao: có phiên bản cho cả hai.
- Loại target quyết định bài toán; tên class estimator và metric phải khớp.
- Dùng baseline, validation và giới hạn tài nguyên để so ứng viên.
- Linear Regression, Polynomial Regression, hồi quy logistic và SVM đã có bài riêng; các họ khác sẽ bổ sung sau.
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
Bắt đầu với [[bài:linear-regression]]: học hệ số của một quan hệ tuyến tính, tự tính một ví dụ nhỏ rồi đối chiếu sklearn; sau đó [[bài:polynomial-regression]] thêm feature để khớp đường cong. [[bài:logistic-regression]] chuyển sang phân loại bằng xác suất và ngưỡng; [[bài:svm]] học biên theo margin và dùng kernel khi cần. Những họ còn lại trên bản đồ chưa có bài riêng.
:::
