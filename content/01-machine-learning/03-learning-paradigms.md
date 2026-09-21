---
title: Các phương thức học trong Machine Learning
order: 3
---

## 1. Ý tưởng

Machine Learning được chia thành 3 nhóm theo **phương thức học** — tức
cách model tương tác với dữ liệu trong lúc huấn luyện: **Supervised
learning** (học có giám sát), **Unsupervised learning** (học không giám
sát), và **Reinforcement learning** (học tăng cường).

> **EN:** Machine Learning splits into three groups by **learning
> paradigm** — how the model interacts with data during training:
> **Supervised learning**, **Unsupervised learning**, and **Reinforcement
> learning**.

## 2. Vị trí trong bức tranh lớn

Phần lớn dữ liệu xung quanh ta vốn là **dữ liệu thô** (unlabeled). Biến dữ
liệu thô thành dữ liệu có nhãn (labeled) gọi là **data labelling/data
annotation** — quá trình này luôn cần sự can thiệp của con người. Việc
dữ liệu bạn có là loại nào (có nhãn hay không) quyết định bạn dùng được
phương thức học nào.

> **EN:** Most data around us starts out as **unlabeled, raw data**.
> Turning raw data into labeled data is called **data labelling/data
> annotation** — a process that always requires human involvement. Which
> learning paradigm you can use depends on whether your data is labeled.

## 3. Cách hoạt động của từng nhóm

**Supervised learning** — bắt buộc cần **labeled data**. Chia 2 dạng bài
toán:
- *Classification* (phân loại): output là 1 trong hữu hạn nhãn. VD: fraud
  detection, email spam detection, image classification.
- *Regression* (hồi quy): output là 1 giá trị số liên tục. VD: risk
  assessment, score prediction (dự đoán giá nhà).

**Unsupervised learning** — huấn luyện với dữ liệu **không có nhãn**:
- *Clustering* (phân cụm): gom các điểm dữ liệu giống nhau vào cùng 1
  cụm. VD: customer clustering, data visualization.
- *Association* (luật kết hợp): tìm quan hệ giữa các mục dữ liệu. VD:
  recommendation system.

**Reinforcement learning** — thiên về toán, khó học hơn, ít việc làm hơn
trong ML truyền thống. Model học qua thử-sai để tối đa hoá phần thưởng. VD:
game theory, xe tự lái (autonomous cars).

> **EN:**
>
> **Supervised learning** — requires **labeled data**. Two problem types:
> - *Classification*: output is one of a finite set of labels. E.g. fraud
>   detection, email spam detection, image classification.
> - *Regression*: output is a continuous numeric value. E.g. risk
>   assessment, score prediction (house price prediction).
>
> **Unsupervised learning** — trains on **unlabeled data**:
> - *Clustering*: groups similar data points together. E.g. customer
>   clustering, data visualization.
> - *Association*: finds relationships between items. E.g. recommendation
>   systems.
>
> **Reinforcement learning** — more math-heavy, harder to learn, fewer
> jobs in traditional ML. The model learns through trial and error to
> maximize a reward. E.g. game theory, autonomous cars.

## 4. Ví dụ tay

- "Dự đoán 1 email có phải spam không" → Supervised, Classification (2
  nhãn: spam / không spam)
- "Dự đoán giá nhà" → Supervised, Regression
- "Nhóm khách hàng theo hành vi mua sắm, không biết trước có bao nhiêu
  nhóm" → Unsupervised, Clustering

> **EN:**
> - "Predict whether an email is spam" → Supervised, Classification (2
>   labels: spam / not spam)
> - "Predict a house price" → Supervised, Regression
> - "Group customers by shopping behavior, without knowing the number of
>   groups in advance" → Unsupervised, Clustering

## 5. Code

Chưa cần code ở bài này — mỗi thuật toán cụ thể (trong module Supervised
Learning / Unsupervised Learning) sẽ có code riêng ở các bài sau. Bài này
chỉ là bức tranh tổng quan để chọn đúng nhóm bài toán trước khi bắt tay
code.

> **EN:** No code needed in this lesson — each specific algorithm (in the
> Supervised/Unsupervised Learning modules) gets its own code in later
> lessons. This lesson is only the overview needed to pick the right
> problem category before writing any code.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Bài toán "gợi ý sản phẩm nên mua tiếp theo cho khách hàng"
thuộc Supervised hay Unsupervised? Vì sao?
> **Đáp án:** Thường là Unsupervised (Association) — hệ thống tìm quan hệ
> giữa các mục hàng dựa trên hành vi mua sắm chung, không có nhãn "đúng"
> sẵn cho biết khách hàng nên mua gì tiếp theo.

**Câu 2:** Vì sao Reinforcement Learning không cần dữ liệu có nhãn
(labeled data) như Supervised learning?
> **Đáp án:** Vì RL học qua **thử-sai** (trial and error) để tối đa hoá
> phần thưởng (reward) nhận được từ môi trường, thay vì học từ các cặp
> (input, label) đã biết trước như Supervised learning.

> **EN:**
>
> **Q1:** Is "recommend the next product a customer should buy" Supervised
> or Unsupervised? Why?
> > **A:** Usually Unsupervised (Association) — the system finds
> > relationships between items based on shared purchasing behavior, with
> > no pre-existing "correct" label telling it what the customer should
> > buy next.
>
> **Q2:** Why doesn't Reinforcement Learning need labeled data the way
> Supervised learning does?
> > **A:** Because RL learns through **trial and error** to maximize the
> > reward received from the environment, instead of learning from known
> > (input, label) pairs like Supervised learning.
