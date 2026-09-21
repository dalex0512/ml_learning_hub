---
title: Labeled Data — feature matrix (X) và label vector (y)
order: 4
---

## 1. Ý tưởng

**Labeled data** (dữ liệu có nhãn) là dữ liệu mà mỗi sample đều đi kèm 1
giá trị đúng đã biết trước, gọi là **label** (hay **target**) — đây là
nguyên liệu bắt buộc cho Supervised learning.

> **EN:** **Labeled data** is data where every sample comes with a known
> correct value attached, called the **label** (or **target**) — this is
> the required raw material for Supervised learning.

## 2. Vị trí trong bức tranh lớn

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

## 3. Cách hoạt động / ký hiệu chuẩn

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

## 4. Ví dụ tay

Diabetes dataset, dòng đầu tiên: `Pregnancies=6, Glucose=148,
BloodPressure=72, ..., Age=50` → đây là **1 feature vector**.
`Outcome=1` → đây là **label** tương ứng của sample đó.

> **EN:** Diabetes dataset, first row: `Pregnancies=6, Glucose=148,
> BloodPressure=72, ..., Age=50` → this is **one feature vector**.
> `Outcome=1` → this is the sample's corresponding **label**.

## 5. Code

```python
X = df.drop(columns=["Outcome"])   # feature matrix
y = df["Outcome"]                  # label/target vector
```

> **EN:** Splits the dataframe into the feature matrix `X` (everything
> except the target column) and the label vector `y` (the target column
> alone).

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Nếu 1 dataset không có cột kết quả nào (không có `Outcome`),
dữ liệu đó gọi là gì — labeled hay unlabeled?
> **Đáp án:** Unlabeled — không có giá trị đúng đã biết trước đi kèm mỗi
> sample thì không thể gọi là labeled data, và cũng không dùng được cho
> Supervised learning.

**Câu 2:** Nếu dataset có 500 sample, feature matrix `X` có bao nhiêu
dòng? Label vector `y` có bao nhiêu phần tử?
> **Đáp án:** `X` có 500 dòng (mỗi dòng là feature vector của 1 sample),
> `y` có 500 phần tử (mỗi phần tử là label tương ứng của đúng sample đó).

> **EN:**
>
> **Q1:** If a dataset has no outcome column at all, is it called labeled
> or unlabeled data?
> > **A:** Unlabeled — without a known correct value attached to each
> > sample, it can't be called labeled data, and it can't be used for
> > Supervised learning.
>
> **Q2:** If a dataset has 500 samples, how many rows does feature matrix
> `X` have? How many elements does label vector `y` have?
> > **A:** `X` has 500 rows (each row is one sample's feature vector), `y`
> > has 500 elements (each one the corresponding label for that exact
> > sample).
