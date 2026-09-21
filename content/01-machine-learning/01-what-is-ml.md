---
title: AI, Machine Learning, Deep Learning và Data Science là gì
order: 1
---

## 1. Ý tưởng

Machine Learning (ML) không đứng một mình — nó nằm trong một bức tranh lớn
hơn cùng với AI, Deep Learning (DL) và Data Science. **AI** là tập lớn nhất:
hệ thống có thể tự đưa ra hành động từ dữ liệu. **ML** là một tập con của
AI: hệ thống *học hỏi* từ dữ liệu thay vì được lập trình sẵn từng luật.
**Deep Learning** lại là tập con của ML: học hỏi từ **rất nhiều** dữ liệu,
dùng mạng nơ-ron nhiều lớp. **Data Science** giao thoa với cả ba: mục tiêu
là tạo ra giá trị/insight từ dữ liệu, không nhất thiết phải "học" theo
nghĩa ML.

> **EN:** Machine Learning doesn't stand alone — it sits inside a bigger
> picture together with AI, Deep Learning, and Data Science. **AI** is the
> broadest set: systems that can take action from data. **ML** is a subset
> of AI: systems that *learn* from data instead of following hardcoded
> rules. **Deep Learning** is a subset of ML: learning from a **very
> large** amount of data using multi-layer neural networks. **Data
> Science** overlaps with all three: its goal is generating value/insight
> from data, not necessarily "learning" in the ML sense.

## 2. Vị trí trong bức tranh lớn

Quan hệ giữa 4 khái niệm là các vòng tròn lồng nhau: `AI ⊃ ML ⊃ Deep Learning`,
còn Data Science là vùng giao thoa giữa 3 mảng: Domain Expertise (hiểu biết
lĩnh vực), Computer Science, và Mathematics/Statistics — phần lõi ở giữa
chính là Data Science, và một phần của vùng giao thoa đó trùng với Machine
Learning. Toàn bộ khóa học này tập trung vào nhánh **ML**.

> **EN:** The relationship between the four concepts is a set of nested
> circles: `AI ⊃ ML ⊃ Deep Learning`, while Data Science sits at the
> intersection of three areas — Domain Expertise, Computer Science, and
> Mathematics/Statistics — with the core overlap partially shared with
> Machine Learning. This entire course focuses on the **ML** branch.

## 3. Cách phân biệt

| Khái niệm | Làm gì từ dữ liệu |
|---|---|
| AI | Đưa ra hành động từ dữ liệu |
| Machine Learning | Học hỏi từ dữ liệu |
| Deep Learning | Học hỏi từ **rất nhiều** dữ liệu |
| Data Science | Tạo ra giá trị từ dữ liệu |

> **EN:**
>
> | Concept | What it does with data |
> |---|---|
> | AI | Takes action from data |
> | Machine Learning | Learns from data |
> | Deep Learning | Learns from a **very large** amount of data |
> | Data Science | Creates value from data |

## 4. Ví dụ tay

- Gợi ý sản phẩm nên mua tiếp theo → Machine Learning
- Nhận diện khuôn mặt trong ảnh → Deep Learning
- Báo cáo phân tích vì sao doanh thu quý này giảm → Data Science
- Trợ lý ảo trả lời câu hỏi, thực hiện hành động thay người dùng → AI (nói chung)

> **EN:**
> - Recommending the next product a customer might buy → Machine Learning
> - Recognizing faces in a photo → Deep Learning
> - A report analyzing why this quarter's revenue dropped → Data Science
> - A virtual assistant answering questions and taking actions on a user's
>   behalf → AI (in general)

## 5. Code

Ở bước tổng quan này chưa cần viết code — chỉ cần nắm chắc 4 khái niệm và
mối quan hệ giữa chúng. Đoạn code đầu tiên sẽ xuất hiện ở bài tiếp theo
("Feature & Data types") khi bắt đầu đọc dữ liệu thật bằng pandas.

> **EN:** No code is needed at this overview stage — just get a solid grasp
> of the four concepts and how they relate. The first code snippet appears
> in the next lesson ("Feature & Data types") when we start reading real
> data with pandas.

## 6. Câu hỏi tự kiểm tra

- Deep Learning có phải là một nhánh hoàn toàn tách biệt với Machine
  Learning không? Vì sao?
- Một chatbot trả lời câu hỏi hoàn toàn theo kịch bản lập trình sẵn
  (if-else, không học từ dữ liệu) có được coi là Machine Learning không?

> **EN:**
> - Is Deep Learning a completely separate branch from Machine Learning?
>   Why or why not?
> - Is a chatbot that answers questions purely through hardcoded if-else
>   rules (learning nothing from data) considered Machine Learning?
