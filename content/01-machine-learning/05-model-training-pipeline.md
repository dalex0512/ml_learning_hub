---
title: Model Training (Huấn luyện mô hình)
order: 5
description: "Nối X và y thành vòng predict → loss → update, phân biệt huấn luyện với sử dụng mô hình và cách theo dõi việc học."
slides: 17-18
needs: [labeled-data]
tags: [training, prediction, loss, update]
---

## Model thay đổi điều gì khi học?

:::intro Đọc xong bài này bạn làm được
- Theo dõi đường đi feature → model → prediction.
- Giải thích vai trò của label và loss trong update.
- Phân biệt lúc train với lúc chỉ dự đoán.
:::

Nền để đọc bài này: [[bài:labeled-data]].

:::slides 17-18 | Slide gốc — Model Training (Huấn luyện mô hình)
:::

Model training là quá trình đưa **feature vector** qua **model** để model
tự điều chỉnh sao cho **prediction** (dự đoán) ngày càng gần với **label**
thật.

> **EN:** Model training is the process of feeding a **feature vector**
> through a **model** so the model keeps adjusting itself until its
> **prediction** gets closer and closer to the true **label**.

## Prediction nối với loss ra sao?

Đây là bước ngay trước Loss Function: `feature vector → Model →
prediction`; `prediction` sau đó được đem so sánh với `label` thật để
tính ra **loss** — xem chi tiết cách tính ở bài **Loss Function** tiếp
theo.

> **EN:** This is the step right before Loss Function: `feature vector →
> Model → prediction`; the `prediction` is then compared against the true
> `label` to compute the **loss** — the exact calculation is covered in
> the next **Loss Function** lesson.

## Từ sai lệch đến tín hiệu cập nhật

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

## Ví dụ số nằm ở bài Loss Function

:::worked Ví dụ và số liệu đối chiếu
Chưa có ví dụ số liệu ở bài này — ví dụ cụ thể (bảng dự đoán giá nhà) sẽ
xuất hiện ngay ở bài **Loss Function** tiếp theo, dùng chung sơ đồ pipeline
này.

> **EN:** No numeric example in this lesson — the concrete example (a
> house-price prediction table) appears right in the next **Loss
> Function** lesson, using this same pipeline diagram.
:::

Chưa có code ở bài này — xem bài **Loss Function** tiếp theo.

> **EN:** No code in this lesson — see the next **Loss Function** lesson.

## Vòng lặp và lúc sử dụng model

```text
X → model → prediction → so với y → loss → update tham số
       ↑_______________________________________|
```

Khi train, prediction và y tạo loss, thuật toán tối ưu dùng tín hiệu đó để cập nhật tham số. Khi inference, chỉ cần input và model đã học để tạo prediction; chưa có label vẫn dùng được model. Loss không đảm bảo giảm ở từng bước và train loss thấp chưa đủ kết luận tổng quát tốt *(bổ sung)*.

> **EN:** Training uses targets and a loss to update parameters. Inference applies the trained model without requiring targets. A lower training loss alone does not establish generalization.

## Tóm tắt 1 phút

:::recap
- X cung cấp feature cho model.
- Prediction là kết quả model đoán.
- Label là mục tiêu đã biết trong train.
- Loss lượng hóa sai lệch theo một hàm cụ thể.
- Update điều chỉnh tham số rồi lặp lại.
- Inference dùng model đã học; kiểm tra generalization cần dữ liệu riêng.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Vì sao chỉ có `prediction` và `label` thôi chưa đủ để biết
model tốt hay không — cần thêm bước nào nữa?
A: Cần thêm bước tính **loss value** thông qua một **Loss
Function** — nhận vào `prediction` và `label`, trả về 1 con số cụ thể
đo mức độ sai lệch, từ đó mới đánh giá được model đang tốt hay tệ.
EN: Why aren't `prediction` and `label` alone enough to know if a
model is good — what extra step is needed?
**A:** You need the extra step of computing a **loss value** through a
> **Loss Function** — it takes in `prediction` and `label` and returns a
> concrete number measuring how far apart they are, which is what lets
> you judge whether the model is good or bad.

Q: Loss value cao thể hiện model đang dự đoán tốt hơn hay tệ hơn?
A: Tệ hơn. Loss đo mức độ sai lệch giữa prediction và label —
loss càng cao nghĩa là dự đoán càng lệch xa giá trị thật, loss càng
thấp thì model dự đoán càng gần đúng.
EN: Does a high loss value mean the model is predicting better or
worse?
**A:** Worse. Loss measures how far off the prediction is from the
> label — the higher the loss, the further the prediction is from the
> true value; the lower the loss, the closer the prediction is to
> correct.
Q: Khi inference có bắt buộc biết label không?
A: Không. Model đã học nhận feature và tạo prediction; có label sau đó mới đánh giá được độ đúng.
Q: Update thay đổi label hay tham số model?
A: Thay đổi tham số model. Label cung cấp mục tiêu so sánh, không phải thứ model tự sửa để có điểm đẹp.
@tier B | Phỏng vấn lý thuyết
Q: Mô tả vòng huấn luyện trong một phút?
A: Đưa X qua model để có prediction, so với y bằng loss, dùng thuật toán tối ưu cập nhật tham số rồi lặp. Ví dụ giá nhà: input là thuộc tính căn nhà, target là giá thật, loss đo sai lệch dự đoán.
EN: Training repeats prediction, loss computation against targets, and parameter updates.
Q: Training khác inference ở đâu?
A: Training cập nhật tham số dựa trên dữ liệu và tín hiệu học. Inference dùng tham số đã học để dự đoán trên input mới, không cần label ở thời điểm dự đoán.
EN: Training changes model parameters; inference applies the learned parameters to new inputs.
Q: Loss có tự cập nhật model không?
A: Loss trả về một giá trị đo sai lệch. Thuật toán tối ưu dùng thông tin từ loss, chẳng hạn gradient, để thay đổi tham số *(bổ sung)*. Không đồng nhất phép chấm sai số với cơ chế sửa.
EN: A loss measures error; an optimization algorithm uses that signal to update parameters.
Q: Train loss giảm có đồng nghĩa model tốt ngoài thực tế?
A: Không. Model có thể ghi nhớ train, gặp phân phối khác hoặc tối ưu mục tiêu không khớp nhu cầu. Cần validation và đánh giá theo mục tiêu; chi tiết ở [[bài:train-test-split]].
EN: Decreasing training loss does not guarantee generalization; independent validation and relevant metrics are necessary.
@tier C | Tình huống doanh nghiệp
Q: Train chạy lâu mà loss gần như đứng yên. Bạn kiểm tra gì?
A: Kiểm tra input–label có đúng cặp, dữ liệu thiếu/bất thường và tham số có thực sự được cập nhật. Thử học trên một tập nhỏ để xác định lỗi vòng train trước khi tăng tài nguyên. Sau đó mới cân nhắc learning rate và kiến trúc; tăng độ phức tạp có thể chỉ tăng chi phí *(bổ sung)*.
WANT: Debug theo đường đi dữ liệu và tín hiệu học, có thí nghiệm nhỏ để khoanh vùng.
Q: Train loss giảm, validation loss tăng. Có nên train tiếp?
A: Kiểm tra cách tách và đo trên hai tập, lưu phiên bản có validation tốt, cân nhắc dừng sớm hoặc giảm độ phức tạp. Không dùng test để chọn thời điểm dừng. Train tiếp có thể học thuộc thêm thay vì tăng khả năng tổng quát *(bổ sung)*.
WANT: Phân biệt tối ưu trên train với đánh giá trên dữ liệu mới.
Q: Hệ thống dự đoán được nhưng chưa có nhãn tháng này. Làm sao biết tốt?
A: Kiểm tra dữ liệu đầu vào và hoạt động pipeline ngay, nhưng chưa kết luận accuracy/loss khi thiếu nhãn thật. Thu nhãn khi có kết quả và đánh giá theo thời điểm; dùng chỉ số vận hành tạm thời với giới hạn được ghi rõ. Nhãn chậm tạo độ trễ giám sát *(bổ sung)*.
WANT: Không lấy prediction hoặc chỉ số thay thế làm bằng chứng chất lượng có giám sát.
:::

## Nối sang bài sau

:::next
Sơ đồ train cần một cách lượng hóa sai lệch để model biết phải sửa. [[bài:loss-function]] tính L1, L2 trên cùng ví dụ giá nhà và giải thích độ nhạy với lỗi lớn.
:::
