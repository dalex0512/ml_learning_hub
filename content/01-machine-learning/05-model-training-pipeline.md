---
title: Model Training (Huấn luyện mô hình)
order: 5
description: "Học là chỉnh tham số theo loss: hai sơ đồ của slide 17 và 18, làm tay một vòng cập nhật, và vì sao bước nhảy η quá nhỏ thì chậm, quá lớn thì văng."
slides: 17-18
needs: [labeled-data]
tags: [training, prediction, loss, update]
---

## Khi "học", model thay đổi cái gì?

:::intro Mục tiêu bài này
- Hiểu model là một bộ **tham số**, và học là **chỉnh tham số** để sai lệch (loss) nhỏ đi.
- Đọc hai sơ đồ của slide 17 và 18: một mẫu đi qua model, rồi cả bảng đi qua model, và vòng **update**.
- Tính tay được một vòng cập nhật, và hiểu vì sao **bước nhảy η** quá nhỏ thì chậm, quá lớn thì văng.
:::

Hãy tưởng tượng một model đơn giản nhất: `ŷ = a · x`, chỉ có **một tham số `a`**. Dữ liệu có ba cặp (x, y): (1, 2), (2, 4), (3, 6). Ta không biết `a` nên bắt đầu đoán bừa `a = 1`. Model khi đó dự đoán 1, 2, 3, còn đáp án là 2, 4, 6: **sai hết**. Học là quá trình **chỉnh `a`** để sai lệch nhỏ đi. Đó là toàn bộ ý tưởng; phần còn lại của bài chỉ là làm nó chính xác.

## Một mẫu đi qua model (slide 17)

Slide 17 vẽ: **feature vector** đi vào **Model**, ra **prediction**. Prediction được đặt cạnh **label** (đáp án thật), và hai thứ đó đi vào **loss**, cho ra một con số gọi là **loss value**. Con số đó cho biết **model đang sai bao nhiêu** trên mẫu này.

:::slides 17-18 | Slide 17–18: model training, prediction so với label cho ra loss, rồi update model
:::

## Cả bảng đi qua model, rồi cập nhật (slide 18)

Trong thực tế ta không đưa từng mẫu một mà đưa **cả feature matrix**: model cho ra một **cột prediction**, đặt cạnh **cột label**, và từ đó tính **loss function** (một con số tổng hợp cho cả bảng). Khác biệt quan trọng của slide 18 là mũi tên **update** đi từ loss ngược về Model: **loss không chỉ để đo, mà để chỉnh model**. Một vòng đầy đủ:

1. Model nhận feature matrix, cho ra prediction.
2. So prediction với label, tính loss ([[bài:loss-function]]).
3. Dùng loss để **cập nhật tham số** của model.
4. Lặp lại cho tới khi loss đủ nhỏ.

## Làm tay một vòng cập nhật

:::steps
**Dự đoán:** với `a = 1`, ŷ = (1, 2, 3) cho x = (1, 2, 3).
@step
**So với đáp án:** sai số ŷ − y = (−1, −2, −3). Bình phương rồi lấy trung bình: (1 + 4 + 9) / 3 ≈ **4.667**. Đây là **loss** (MSE).
@step
**Tìm hướng chỉnh:** loss có độ dốc theo `a`, gọi là **gradient** = (2/3)·Σ(sai số × x) = (2/3)(−1 − 4 − 9) = **−9.333**. Gradient âm nghĩa là **tăng `a` thì loss giảm**.
@step
**Cập nhật:** `a ← a − η · gradient` với **η = 0.05** (bước nhảy): `a = 1 − 0.05 × (−9.333) = 1.467`. Loss mới giảm còn **1.327**.
@step
**Lặp lại:** năm vòng tiếp theo cho `a` = 1.716, 1.848, 1.919, 1.957, 1.977 và loss = 0.378, 0.107, 0.031, 0.009, 0.003. `a` tiến sát **2**, giá trị đúng.
:::

Hãy tự vặn: kéo `a` bằng tay để thấy loss đổi, hoặc bấm "Một bước cập nhật" để máy tự đi xuống theo gradient.

:::widget param-knob
:::

:::ck
Model có hàng triệu tham số thay vì một. Ý tưởng "dự đoán, đo loss, cập nhật tham số" có thay đổi không?
@answer
**Không đổi về bản chất.** Chỉ khác là gradient trở thành một **vector** (mỗi tham số một thành phần) và mỗi tham số được chỉnh theo hướng làm loss giảm. Vòng lặp chung giống hệt; đó cũng là lý do ví dụ một tham số này đủ để hiểu cả mạng nơ-ron.
:::

## Bước nhảy η: không quá nhỏ, không quá lớn

η (đọc "eta", còn gọi là **learning rate**) quyết định mỗi lần cập nhật nhảy bao xa. Với ví dụ này, mỗi vòng sai số của `a` (so với 2) được nhân với hệ số **1 − η·9.333**. Hệ quả:

| η | Hệ số mỗi vòng | `a` sau 8 vòng (bắt đầu 1) | Nhận xét |
|---|---|---|---|
| 0.01 | 0.907 | 1.543 | quá chậm: mới đi được nửa đường |
| 0.05 | 0.533 | 1.994 | êm, hội tụ tốt |
| 0.10 | 0.067 | 2.000 | rất nhanh (gần như đến đích sau 4 vòng) |
| 0.20 | −0.867 | 1.682 (dao động 2.87, 1.25, 2.65...) | nhảy qua lại quanh đích, hội tụ rất chậm |
| 0.30 | −1.8 | −108.2 | **văng xa**: mỗi vòng sai hơn, loss tăng vô hạn |

:::predict
Với η = 0.3, mỗi vòng cập nhật làm `a` ở lần kế tiếp **lệch xa 2 hơn** lần trước. Vì sao một bước đi "theo hướng làm loss giảm" lại làm loss tăng?
@answer
Vì hướng đúng nhưng **bước quá dài**: ta nhảy **qua** đáy và sang phía bên kia, nơi còn dốc hơn, rồi lần sau lại nhảy qua tiếp, mỗi lần xa hơn. Hệ số 1 − 0.3 × 9.333 = −1.8 có độ lớn lớn hơn 1 nên sai số phình ra. Bước nhảy phải đủ nhỏ so với độ dốc của loss.
:::

η không phải tham số do model học mà do **ta chọn** trước khi học: loại này gọi là **siêu tham số (hyperparameter)**, và ta chọn chúng bằng validation, không bằng bộ test ([[bài:k-fold-cross-validation]]).

## Lúc học và lúc dùng

- **Lúc học (training):** dùng dữ liệu có nhãn, vòng lặp chạy nhiều lần, **[[từ:parameter|tham số]] thay đổi**.
- **Lúc dùng ([[từ:inference|inference]]):** tham số **đã đóng băng**. Model nhận input mới và chỉ tính ŷ; không so với đáp án (chưa có), không cập nhật.

Trong scikit-learn: `model.fit(x_train, y_train)` là lúc học; `model.predict(x_new)` là lúc dùng. Và vì loss trên dữ liệu **đã học** luôn đẹp hơn thực tế, ta đánh giá bằng dữ liệu **chưa từng học** ([[bài:train-test-split]]).

## Những hiểu sai thường gặp

- **"Học là nhớ dữ liệu."** Không: học là chỉnh tham số để **khái quát** quy luật. Nhớ thuộc lòng (overfitting) là một dạng học hỏng.
- **"Loss trên train thấp nghĩa là model tốt."** Chưa: phải xem trên dữ liệu chưa thấy.
- **"η, số cây, độ sâu cây là tham số của model."** Đó là **siêu tham số**: ta chọn, máy không học. Tham số là thứ máy học (như `a`, các trọng số).
- **"Gradient chỉ cách tính phức tạp của mạng nơ-ron."** Nó chính là **độ dốc**: ví dụ một tham số ở trên đã đủ.

:::card Model Training
- **Model = hàm có tham số; học = chỉnh tham số theo loss.**
- **Vòng lặp (slide 17–18):** feature → model → prediction; so với label → loss; **update** model; lặp.
- **Ví dụ:** `ŷ = a·x` trên (1,2), (2,4), (3,6): gradient −9.333, a: 1 → 1.467 → ... → 1.977, loss 4.667 → 0.003 (η = 0.05).
- **η quá nhỏ thì chậm (0.01), quá lớn thì văng (0.3); η là siêu tham số do ta chọn.**
- **Lúc dùng:** tham số đóng băng; `fit` là học, `predict` là dùng.
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
