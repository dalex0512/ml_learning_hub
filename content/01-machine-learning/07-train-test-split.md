---
title: Phân chia Dataset (Train / Validation / Test Split)
order: 7
description: "Tách vai trò train, validation và test; chọn cách chia theo tình huống triển khai và tránh vô tình học từ dữ liệu đánh giá."
slides: 22
needs: [loss-function]
tags: [split, validation, test, leakage]
---

## Vì sao không chấm trên dữ liệu đã học?

:::intro Đọc xong bài này bạn làm được
- Nói rõ tập nào cập nhật tham số, tập nào chọn model, tập nào đánh giá cuối.
- Tính được tỉ lệ chia hai lần.
- Nhận ra rò rỉ theo thời gian, khách hàng và tiền xử lý.
:::

Nền để đọc bài này: [[bài:loss-function]].

:::slides 22 | Slide gốc — Phân chia Dataset (Train / Validation / Test Split)
:::

Khi làm việc với 1 bộ dữ liệu, bắt buộc phải **chia nhỏ** nó ra trước khi
huấn luyện — không dùng nguyên cả bộ dữ liệu để vừa train vừa đánh giá,
vì như vậy không thể biết model có thực sự học tốt hay chỉ đang "học
thuộc lòng" đúng những gì đã thấy.

> **EN:** When working with a dataset, you must **split it up** before
> training — you never use the entire dataset for both training and
> evaluation, because then there's no way to tell whether the model is
> actually learning well or just memorizing what it has already seen.

## Ba tập, ba vai trò

Về mặt lý thuyết, dữ liệu được chia thành 3 bộ con:
- **Training Set**: dùng trong suốt quá trình huấn luyện (training)
- **Validation Set**: dùng để đánh giá quá trình huấn luyện, ở giữa và
  sau mỗi giai đoạn train
- **Test Set**: dùng sau khi huấn luyện xong hoàn toàn, để đánh giá cuối
  cùng

Tỉ lệ chia thường gặp: **80–10–10** hoặc **90–5–5** (tỉ lệ Training Set
luôn lớn nhất) — dùng tỉ lệ nghiêng hẳn về Train khi dữ liệu khan hiếm, để
model có đủ dữ liệu học.

> **EN:** In theory, data is split into three subsets:
> - **Training Set**: used throughout the training process
> - **Validation Set**: used to evaluate the training process, both
>   during and after each stage
> - **Test Set**: used only after training is fully complete, for the
>   final evaluation
>
> Common split ratios: **80–10–10** or **90–5–5** (the Training Set share
> is always the largest) — lean the ratio heavily toward Train when data
> is scarce, so the model has enough to learn from.

## Loss được dùng để cập nhật hay để lựa chọn?

**Sự khác biệt quan trọng nhất giữa 3 bộ nằm ở cách dùng loss:**

- **Training Set**: loss value tính trên bộ này được dùng để **quay
  ngược lại update model** (đây là bộ duy nhất model thực sự "học" từ đó).
- **Validation Set** và **Test Set**: loss value tính trên 2 bộ này **chỉ
  dùng để đánh giá**, không được dùng để cập nhật model. Mục đích của
  Validation Set là giám sát xem quá trình huấn luyện có đang đi đúng
  hướng hay không — nếu train đúng hướng, loss trên validation set sẽ
  càng ngày càng tốt hơn theo thời gian.

Một cách ví von dễ nhớ: **Validation Set giống như các bài kiểm tra giữa
kỳ** — làm nhiều lần trong quá trình học, để biết mình đang học ổn không
và còn kịp điều chỉnh. **Test Set giống kỳ thi tốt nghiệp THPT** — chỉ thi
1 lần duy nhất, sau khi đã học xong hết, đánh giá thực lực cuối cùng,
không có cơ hội "thi lại rồi sửa cách học".

> **EN:** **The key difference between the three sets is how their loss
> is used:**
> - **Training Set**: its loss value is used to **update the model** (the
>   only set the model actually "learns" from).
> - **Validation Set** and **Test Set**: their loss values are used
>   **only for evaluation**, never to update the model. The Validation
>   Set's job is to monitor whether training is heading in the right
>   direction — if so, validation loss should keep improving over time.
>
> A helpful analogy: the **Validation Set is like periodic mid-term
> quizzes** — taken repeatedly while studying, to check you're on track
> and still have time to adjust. The **Test Set is like a final
> graduation exam** — taken only once, after all studying is done,
> measuring your true final ability with no chance to "retake and fix
> your approach."

## Chia 100 mẫu theo 80–10–10

:::worked Ví dụ và số liệu đối chiếu
Diabetes dataset, chia theo tỉ lệ 80–10–10 (giả sử có 100 sample):
- Training Set: 80 sample đầu — dùng để huấn luyện
- Validation Set: 10 sample tiếp — dùng để theo dõi trong lúc train
- Test Set: 10 sample cuối — chỉ chạm tới đúng 1 lần, sau khi đã chọn
  xong model cuối cùng

> **EN:** Diabetes dataset, split 80–10–10 (assume 100 samples):
> - Training Set: first 80 samples — used for training
> - Validation Set: next 10 samples — used to monitor progress during
>   training
> - Test Set: last 10 samples — touched exactly once, after the final
>   model has already been chosen
:::

## Tách test trước rồi chia validation

```python
from sklearn.model_selection import train_test_split

# bước 1: tách Test set ra trước, giữ nguyên không đụng tới
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y, test_size=0.10, random_state=42
)

# bước 2: chia phần còn lại thành Train và Validation
X_train, X_val, y_train, y_val = train_test_split(
    X_train_val, y_train_val, test_size=1/9, random_state=42
)
# kết quả xấp xỉ tỉ lệ 80-10-10 trên toàn bộ dataset
```

> **EN:** Split off the Test set first and leave it untouched, then split
> the remaining data into Train and Validation — the `1/9` ratio in step
> 2 produces an overall split that approximates 80–10–10 across the full
> dataset.

## Chia theo cách sẽ dùng model (bổ sung)

:::pitfall Không phải lúc nào cũng shuffle
Ví dụ '80 mẫu đầu, 10 mẫu tiếp, 10 mẫu cuối' chỉ minh họa số lượng. Với dữ liệu độc lập có thể chia ngẫu nhiên; với dự báo tương lai phải chia theo thời gian; cùng một người xuất hiện nhiều dòng cần cân nhắc chia theo người. Fit scaler/imputer trên train, rồi transform validation/test. Validation không cập nhật trực tiếp tham số nhưng vẫn ảnh hưởng việc chọn model và dừng train. Tỉ lệ 90–5–5 không tự phù hợp khi dữ liệu ít: tập đánh giá quá nhỏ sẽ rất bất ổn.
:::

> **EN:** Match the split to deployment: random splits for independent samples, temporal splits for forecasting, and group splits for repeated entities. Validation guides model selection; the test set remains independent.

## Tóm tắt 1 phút

:::recap
- Train dùng để học tham số.
- Validation dùng để chọn cấu hình và theo dõi.
- Test đánh giá sau khi đã chốt lựa chọn.
- Tỉ lệ là lựa chọn theo dữ liệu, không phải quy luật.
- Split theo thời gian hoặc nhóm khi cần.
- Mọi bước fit tiền xử lý phải nằm trong train.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Bộ nào trong 3 bộ dữ liệu được dùng để trực tiếp cập nhật
(update) tham số của model?
A: Chỉ Training Set. Validation Set và Test Set chỉ dùng để
đánh giá, loss của chúng không bao giờ được dùng để update model.
EN: Which of the three sets is used to directly update the model's
parameters?
**A:** Only the Training Set. The Validation Set and Test Set are
> used purely for evaluation — their loss is never used to update the
> model.

Q: Vì sao không nên "nhìn" Test Set nhiều lần trong lúc phát
triển model?
A: Vì nếu điều chỉnh model dựa trên kết quả Test Set nhiều lần,
bạn vô tình biến Test Set thành một dạng Validation Set — lúc đó kết quả
đánh giá cuối cùng không còn khách quan nữa (model đã "học lỏm" cách để
đạt điểm tốt trên chính bộ test đó).
EN: Why shouldn't you "peek" at the Test Set repeatedly while
developing a model?
**A:** Because repeatedly tuning the model based on Test Set results
> effectively turns it into a second Validation Set — the final
> evaluation is no longer objective, since the model has indirectly
> "learned" how to score well on that specific test data.

Q: Nếu dữ liệu bạn có rất ít (ví dụ chỉ 100 mẫu), nên nghiêng tỉ
lệ chia về hướng nào?
A: Nghiêng tỉ lệ Training Set lớn hơn (VD: 90–5–5) để model có
đủ dữ liệu học — nhưng đây cũng chính là hạn chế mà kỹ thuật **K-fold
Cross Validation** (bài tiếp theo) được sinh ra để khắc phục.
EN: If you only have a small amount of data (e.g. 100 samples),
which way should you skew the split ratio?
**A:** Skew toward a larger Training Set (e.g. 90–5–5) so the model
> has enough to learn from — but this is exactly the limitation that
> **K-fold Cross Validation** (next lesson) was designed to solve.
Q: Tách 10% test, rồi lấy 1/9 phần còn lại làm validation, trên 100 mẫu được bao nhiêu?
A: 90 mẫu còn lại; 90 × 1/9 = 10 validation; còn 80 train. Tổng là 80/10/10 *(bổ sung: tính lại)*.
@tier B | Phỏng vấn lý thuyết
Q: Validation không update tham số thì vì sao vẫn ảnh hưởng model?
A: Kết quả validation được dùng chọn hyperparameter, model và thời điểm dừng. Vì vậy nó ảnh hưởng lựa chọn gián tiếp; test cần độc lập để đánh giá lựa chọn cuối.
EN: Validation guides model selection indirectly even though it does not directly update learned parameters.
Q: Leakage là gì?
A: Là thông tin không thể có lúc dự đoán hoặc từ tập đánh giá lọt vào quá trình học. Ví dụ fit scaler trên toàn bộ dữ liệu trước split khiến thống kê test ảnh hưởng train.
EN: Data leakage occurs when unavailable information or evaluation data influences training.
Q: Khi nào random split gây đánh giá lạc quan?
A: Khi các hàng không độc lập hoặc có trật tự thời gian: cùng khách ở hai tập, hoặc tương lai được dùng dự đoán quá khứ. Cần split phản ánh đối tượng và thời điểm sẽ triển khai.
EN: Random splits can be optimistic with temporal dependence or repeated entities shared across sets.
Q: Vì sao không dùng test để chọn model tốt nhất?
A: Khi lặp chọn theo test, ta thích nghi với nhiễu của chính test. Test trở thành validation và điểm cuối không còn độc lập. Dùng validation/CV để chọn rồi chốt trước khi đo test.
EN: Repeated selection on the test set makes its score optimistically biased.
@tier C | Tình huống doanh nghiệp
Q: Dự báo doanh số tháng sau đạt điểm rất tốt khi random split. Bạn kiểm tra gì?
A: Kiểm tra timestamp của feature/target và thử chia theo mốc thời gian, train quá khứ rồi đánh giá tương lai. Fit toàn bộ xử lý trong train. Có thể mất điểm nhưng đo đúng bối cảnh; phải giữ đủ mùa vụ để so sánh *(bổ sung)*.
WANT: Đặt thiết kế đánh giá theo câu hỏi triển khai.
Q: Một bệnh nhân có nhiều lần khám, cần đánh giá với bệnh nhân mới. Chia sao?
A: Chia theo patient ID để một người không xuất hiện cả hai phía, kiểm tra thêm thời gian nếu dự đoán tương lai. Dữ liệu ít hơn theo nhóm có thể làm metric dao động; báo cáo số người thay vì chỉ số dòng *(bổ sung)*.
WANT: Phân biệt đơn vị quan sát với đơn vị độc lập của đánh giá.
Q: Team đã chọn model sau nhiều lần xem test. Cứ báo điểm đó được không?
A: Ghi rõ test đã tham gia chọn model, dừng tune trên nó và dành một tập độc lập mới nếu có thể. Dùng validation/CV cho vòng phát triển tiếp theo. Nếu chưa có tập mới, báo giới hạn thay vì xem điểm cũ là ước lượng khách quan *(bổ sung)*.
WANT: Biết khôi phục quy trình và trình bày trung thực độ tin cậy.
:::

## Nối sang bài sau

:::next
Một validation split có thể quá phụ thuộc vào cách lấy mẫu. [[bài:k-fold-cross-validation]] xoay vòng vai trò validation để kiểm tra cấu hình trên nhiều phần dữ liệu mà vẫn giữ riêng test.

Thực hành: [[bài:diabetes-first-model]] — tự chia614/154 hàng và kiểm index tái lập.
:::
