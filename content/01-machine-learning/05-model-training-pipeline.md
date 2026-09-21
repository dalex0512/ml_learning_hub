---
title: Model Training (Huấn luyện mô hình)
order: 5
---

## 1. Ý tưởng

Model training là quá trình đưa **feature vector** qua **model** để model
tự điều chỉnh sao cho **prediction** (dự đoán) ngày càng gần với **label**
thật.

> **EN:** Model training is the process of feeding a **feature vector**
> through a **model** so the model keeps adjusting itself until its
> **prediction** gets closer and closer to the true **label**.

## 2. Vị trí trong bức tranh lớn

Đây là bước ngay trước Loss Function: `feature vector → Model →
prediction`; `prediction` sau đó được đem so sánh với `label` thật để
tính ra **loss** — xem chi tiết cách tính ở bài **Loss Function** tiếp
theo.

> **EN:** This is the step right before Loss Function: `feature vector →
> Model → prediction`; the `prediction` is then compared against the true
> `label` to compute the **loss** — the exact calculation is covered in
> the next **Loss Function** lesson.

## 3. Cách hoạt động

Chỉ có `prediction` thôi thì chưa đủ để biết model đang làm tốt hay
không — cần **đánh giá chất lượng dự đoán của model** bằng một con số cụ
thể, gọi là **loss value**. Con số này được tính bởi một **Loss
Function**: nhận vào `prediction` và `label`, trả về mức độ sai lệch giữa
chúng.

> **EN:** A `prediction` alone isn't enough to know whether the model is
> doing well — you need to **evaluate the quality of the model's
> prediction** with a concrete number, called the **loss value**. This
> number is computed by a **Loss Function**: it takes in `prediction` and
> `label`, and returns how far apart they are.

## 4. Ví dụ tay

Chưa có ví dụ số liệu ở bài này — ví dụ cụ thể (bảng dự đoán giá nhà) sẽ
xuất hiện ngay ở bài **Loss Function** tiếp theo, dùng chung sơ đồ pipeline
này.

> **EN:** No numeric example in this lesson — the concrete example (a
> house-price prediction table) appears right in the next **Loss
> Function** lesson, using this same pipeline diagram.

## 5. Code

Chưa có code ở bài này — xem bài **Loss Function** tiếp theo.

> **EN:** No code in this lesson — see the next **Loss Function** lesson.

## 6. Câu hỏi tự kiểm tra

- Vì sao chỉ có `prediction` và `label` thôi chưa đủ để biết model tốt
  hay không — cần thêm bước nào nữa?
- Loss value cao thể hiện model đang dự đoán tốt hơn hay tệ hơn?

> **EN:**
> - Why aren't `prediction` and `label` alone enough to know if a model is
>   good — what extra step is needed?
> - Does a high loss value mean the model is predicting better or worse?
