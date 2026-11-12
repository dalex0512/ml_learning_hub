---
title: Labeled Data — feature matrix (X) và label vector (y)
order: 4
description: "Đi từ một sample Diabetes đến feature vector, feature matrix X và label vector y; giữ đúng quan hệ từng hàng khi tách dữ liệu."
slides: 11-16
needs: [feature-and-data-types, learning-paradigms]
tags: [X, y, label, sample, feature-matrix]
---

## Một sample có nhãn gồm những gì?

:::intro Đọc xong bài này bạn làm được
- Tách input và target trong một bảng dữ liệu.
- Đọc được shape của X và y.
- Nhận ra lỗi ghép sai hàng và nhãn không đáng tin.
:::

Nền để đọc bài này: [[bài:feature-and-data-types]], [[bài:learning-paradigms]].

:::slides 11-16 | Slide gốc — Labeled Data — feature matrix (X) và label vector (y)
:::

**Labeled data** (dữ liệu có nhãn) là dữ liệu mà mỗi sample đều đi kèm 1
giá trị đúng đã biết trước, gọi là **label** (hay **target**) — đây là
nguyên liệu bắt buộc cho Supervised learning.

> **EN:** **Labeled data** is data where every sample comes with a known
> correct value attached, called the **label** (or **target**) — this is
> the required raw material for Supervised learning.

## Từ bảng dữ liệu đến X và y

Từ 1 bảng dữ liệu (VD: Diabetes dataset), mỗi dòng là 1 **sample**; các
cột dùng làm đầu vào gộp lại thành **feature vector**, cột còn lại (kết
quả cần dự đoán) là **label**. Toàn bộ feature vector của mọi sample xếp
chồng lên nhau tạo thành **feature matrix (X)**; toàn bộ label xếp thành
**label/target vector (y)**. `X` và `y` chính là input cho bước **Model
training** ở bài tiếp theo.

> **EN:** In a data table (e.g. the Diabetes dataset), each row is a
> **sample**; the input columns combine into a **feature vector**, and the
> remaining column (what we want to predict) is the **label**. Stacking
> every sample's feature vector together forms the **feature matrix
> (X)**; stacking every label together forms the **label/target vector
> (y)**. `X` and `y` are exactly the input to **Model training**, covered
> in the next lesson.

## Ký hiệu cho một mẫu và toàn bộ dataset

- **feature vector**: các giá trị input của 1 sample (VD: `Pregnancies,
  Glucose, BloodPressure, SkinThickness, Insulin, BMI,
  DiabetesPedigreeFunction, Age`)
- **label / target**: giá trị output cần dự đoán của sample đó (VD:
  `Outcome` — có bị tiểu đường hay không)
- **feature matrix (X)**: gộp feature vector của toàn bộ sample thành 1
  ma trận
- **label/target vector (y)**: gộp toàn bộ label thành 1 vector

> **EN:**
> - **feature vector**: a sample's input values (e.g. `Pregnancies,
>   Glucose, BloodPressure, SkinThickness, Insulin, BMI,
>   DiabetesPedigreeFunction, Age`)
> - **label / target**: the output value to predict for that sample (e.g.
>   `Outcome` — has diabetes or not)
> - **feature matrix (X)**: every sample's feature vector stacked into one
>   matrix
> - **label/target vector (y)**: every label stacked into one vector

## Đọc một hàng của Diabetes

:::worked Ví dụ và số liệu đối chiếu
Diabetes dataset, dòng đầu tiên: `Pregnancies=6, Glucose=148,
BloodPressure=72, ..., Age=50` → đây là **1 feature vector**.
`Outcome=1` → đây là **label** tương ứng của sample đó.

> **EN:** Diabetes dataset, first row: `Pregnancies=6, Glucose=148,
> BloodPressure=72, ..., Age=50` → this is **one feature vector**.
> `Outcome=1` → this is the sample's corresponding **label**.
:::

## Tách target khỏi feature matrix

```python
X = df.drop(columns=["Outcome"])   # feature matrix
y = df["Outcome"]                  # label/target vector
```

> **EN:** Splits the dataframe into the feature matrix `X` (everything
> except the target column) and the label vector `y` (the target column
> alone).

## Hàng của X phải đi cùng nhãn của chính nó (bổ sung)

:::pitfall Shuffle và thông tin tương lai
Không shuffle X và y độc lập: đúng số hàng nhưng sai cặp vẫn phá dữ liệu huấn luyện. Không để Outcome hoặc feature chỉ biết sau kết quả lọt vào X; xem [[bài:train-test-split]]. Với một target, X có shape (n_samples, n_features), y thường có shape (n_samples,).
:::

> **EN:** Preserve row alignment between features and targets. Exclude the target and any unavailable future information from the inputs.

## Tóm tắt 1 phút

:::recap
- Sample là đơn vị quan sát.
- Feature vector chứa input của một sample.
- X xếp các vector thành ma trận.
- y chứa target tương ứng từng hàng.
- Số hàng X bằng số nhãn y.
- Giữ đúng cặp và kiểm tra nguồn nhãn.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Nếu 1 dataset không có cột kết quả nào (không có `Outcome`),
dữ liệu đó gọi là gì — labeled hay unlabeled?
A: Unlabeled — không có giá trị đúng đã biết trước đi kèm mỗi
sample thì không thể gọi là labeled data, và cũng không dùng được cho
Supervised learning.
EN: If a dataset has no outcome column at all, is it called labeled
or unlabeled data?
**A:** Unlabeled — without a known correct value attached to each
> sample, it can't be called labeled data, and it can't be used for
> Supervised learning.

Q: Nếu dataset có 500 sample, feature matrix `X` có bao nhiêu
dòng? Label vector `y` có bao nhiêu phần tử?
A: `X` có 500 dòng (mỗi dòng là feature vector của 1 sample),
`y` có 500 phần tử (mỗi phần tử là label tương ứng của đúng sample đó).
EN: If a dataset has 500 samples, how many rows does feature matrix
`X` have? How many elements does label vector `y` have?
**A:** `X` has 500 rows (each row is one sample's feature vector), `y`
> has 500 elements (each one the corresponding label for that exact
> sample).
Q: X có n mẫu và p feature thì shape là gì?
A: X có shape (n, p). Với một target cho mỗi mẫu, y thường có shape (n,).
Q: Shuffle riêng X và y nhưng giữ số hàng có đúng không?
A: Không. Số hàng khớp chưa đủ, mỗi hàng X phải đi cùng target của chính sample đó.
@tier B | Phỏng vấn lý thuyết
Q: Feature vector khác feature matrix thế nào?
A: Vector mô tả một mẫu; ma trận chứa nhiều mẫu theo hàng và feature theo cột. Trong Diabetes, một hàng các chỉ số là vector, toàn bộ các hàng là X.
EN: A feature vector describes one sample; a feature matrix stacks samples as rows and features as columns.
Q: Vì sao phải tách Outcome ra khỏi X?
A: Outcome là thứ cần dự đoán. Nếu dùng chính target làm input, model có thể đọc đáp án trong lúc train mà không có thông tin đó khi sử dụng thật.
EN: The target must be excluded from inputs; otherwise the model can read the answer during training.
Q: Nhãn có phải lúc nào cũng là ground truth hoàn hảo không?
A: Không. Nhãn là kết quả quan sát hoặc gán, có thể sai, chậm hoặc có thiên lệch *(bổ sung)*. Cần biết cách tạo nhãn và kiểm tra độ tin cậy trước khi học.
EN: Observed labels may be noisy, delayed, or biased; their provenance and quality matter.
Q: Shape đúng có đảm bảo dữ liệu huấn luyện đúng không?
A: Không. Cần kiểm tra thứ tự hàng, đơn vị phân tích, thời điểm của feature và định nghĩa target. Hai mảng có shape hợp lệ vẫn có thể ghép nhầm sample.
EN: Valid shapes do not guarantee correct alignment, timing, or target definitions.
@tier C | Tình huống doanh nghiệp
Q: Model dự đoán mua hàng dùng cột trạng thái sau khi thanh toán. Có vấn đề gì?
A: Xác định thời điểm cần dự đoán và thời điểm có trạng thái đó. Nếu chỉ biết sau mua, loại khỏi X và tạo lại dữ liệu theo thời điểm dự đoán. Chất lượng offline có thể giảm nhưng phản ánh khả năng sử dụng thật *(bổ sung)*.
WANT: Kiểm tra thông tin có sẵn lúc dự đoán, không chỉ kiểm tra tên cột.
Q: Hai người gán nhãn cùng một ảnh khác nhau. Bạn làm gì?
A: Xem định nghĩa nhãn và nhóm ảnh hay bất đồng, sửa hướng dẫn, có bước phân xử và kiểm tra lại một mẫu dữ liệu. Không chỉ chọn nhãn theo số đông khi tiêu chí chưa rõ. Đánh đổi tốc độ gán nhãn với độ tin cậy *(bổ sung)*.
WANT: Có quy trình cải thiện chất lượng target thay vì chỉ đổi thuật toán.
Q: Nhóm lấy click làm nhãn thích sản phẩm. Có thiên lệch gì?
A: Click chỉ có ở sản phẩm đã được hiển thị và chịu ảnh hưởng vị trí. Kiểm tra log hiển thị, cách lấy nhãn âm và mục tiêu thật như mua hàng; đánh giá theo nhóm vị trí/nguồn truy cập. Click dễ thu nhưng không tương đương sở thích hay giá trị lâu dài *(bổ sung)*.
WANT: Hiểu nhãn từ hành vi có điều kiện quan sát và không tự là chân lý.
:::

## Nối sang bài sau

:::next
Tiếp theo, [[bài:model-training-pipeline]] sẽ nối phần kiến thức này với bước kế tiếp của lộ trình.
:::
