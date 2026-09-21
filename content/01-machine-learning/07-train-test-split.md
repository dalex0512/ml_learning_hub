---
title: Phân chia Dataset (Train / Validation / Test Split)
order: 7
---

## 1. Ý tưởng

Khi làm việc với 1 bộ dữ liệu, bắt buộc phải **chia nhỏ** nó ra trước khi
huấn luyện — không dùng nguyên cả bộ dữ liệu để vừa train vừa đánh giá,
vì như vậy không thể biết model có thực sự học tốt hay chỉ đang "học
thuộc lòng" đúng những gì đã thấy.

> **EN:** When working with a dataset, you must **split it up** before
> training — you never use the entire dataset for both training and
> evaluation, because then there's no way to tell whether the model is
> actually learning well or just memorizing what it has already seen.

## 2. Vị trí trong bức tranh lớn

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

## 3. Cách hoạt động

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

## 4. Ví dụ tay

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

## 5. Code

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

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Bộ nào trong 3 bộ dữ liệu được dùng để trực tiếp cập nhật
(update) tham số của model?
> **Đáp án:** Chỉ Training Set. Validation Set và Test Set chỉ dùng để
> đánh giá, loss của chúng không bao giờ được dùng để update model.

**Câu 2:** Vì sao không nên "nhìn" Test Set nhiều lần trong lúc phát
triển model?
> **Đáp án:** Vì nếu điều chỉnh model dựa trên kết quả Test Set nhiều lần,
> bạn vô tình biến Test Set thành một dạng Validation Set — lúc đó kết quả
> đánh giá cuối cùng không còn khách quan nữa (model đã "học lỏm" cách để
> đạt điểm tốt trên chính bộ test đó).

**Câu 3:** Nếu dữ liệu bạn có rất ít (ví dụ chỉ 100 mẫu), nên nghiêng tỉ
lệ chia về hướng nào?
> **Đáp án:** Nghiêng tỉ lệ Training Set lớn hơn (VD: 90–5–5) để model có
> đủ dữ liệu học — nhưng đây cũng chính là hạn chế mà kỹ thuật **K-fold
> Cross Validation** (bài tiếp theo) được sinh ra để khắc phục.

> **EN:**
>
> **Q1:** Which of the three sets is used to directly update the model's
> parameters?
> > **A:** Only the Training Set. The Validation Set and Test Set are
> > used purely for evaluation — their loss is never used to update the
> > model.
>
> **Q2:** Why shouldn't you "peek" at the Test Set repeatedly while
> developing a model?
> > **A:** Because repeatedly tuning the model based on Test Set results
> > effectively turns it into a second Validation Set — the final
> > evaluation is no longer objective, since the model has indirectly
> > "learned" how to score well on that specific test data.
>
> **Q3:** If you only have a small amount of data (e.g. 100 samples),
> which way should you skew the split ratio?
> > **A:** Skew toward a larger Training Set (e.g. 90–5–5) so the model
> > has enough to learn from — but this is exactly the limitation that
> > **K-fold Cross Validation** (next lesson) was designed to solve.
