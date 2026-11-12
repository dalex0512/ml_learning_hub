---
title: AI, Machine Learning, Deep Learning và Data Science là gì
order: 1
description: "Phân biệt AI, ML, Deep Learning và Data Science, hiểu sơ đồ input → model → output và quyết định khi nào cần học từ dữ liệu."
slides: 3-6
needs: []
tags: [ai, ml, dl, data-science]
---

## ML đứng ở đâu trong bức tranh dữ liệu?

:::intro Đọc xong bài này bạn làm được
- Vẽ được quan hệ AI ⊃ ML ⊃ DL và vùng giao với Data Science.
- Phân biệt hệ thống học từ dữ liệu với chương trình dùng luật.
- Chọn một nhu cầu thực tế phù hợp để bắt đầu với ML.
:::

:::slides 3-6 | Slide gốc — AI, Machine Learning, Deep Learning và Data Science là gì
:::

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

## Các vòng tròn giao nhau ra sao?

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

## Bốn mục tiêu dễ bị nhầm

:::compare Bốn khái niệm
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
:::

## Nhìn vào công việc để gọi đúng tên

:::worked Ví dụ và số liệu đối chiếu
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
:::

## Từ khái niệm đến dữ liệu thật

Ở bước tổng quan này chưa cần viết code — chỉ cần nắm chắc 4 khái niệm và
mối quan hệ giữa chúng. Đoạn code đầu tiên sẽ xuất hiện ở bài tiếp theo
("Feature & Data types") khi bắt đầu đọc dữ liệu thật bằng pandas.

> **EN:** No code is needed at this overview stage — just get a solid grasp
> of the four concepts and how they relate. The first code snippet appears
> in the next lesson ("Feature & Data types") when we start reading real
> data with pandas.

## Đọc sơ đồ input → model → output

[[slide:6]] mô tả lúc dùng mô hình: feature vector đi vào model, prediction đi ra. Mô hình đã học một quy luật từ dữ liệu trước đó; nó không tự hiểu mục tiêu kinh doanh chỉ từ đầu vào.

> **EN:** At inference time, a feature vector enters a trained model and a prediction comes out. The business objective must be defined separately.

:::note Cách diễn đạt trên slide (nhận xét)
[[slide:5]] dùng lượng dữ liệu để gợi nhớ Deep Learning. Đặc điểm định nghĩa DL là mạng nơ-ron nhiều lớp, không phải một ngưỡng số mẫu. DL thường cần nhiều dữ liệu khi train từ đầu, nhưng transfer learning có thể dùng ít dữ liệu gán nhãn hơn *(bổ sung)*. AI cũng có thể dùng luật; Data Science có thể tạo giá trị bằng thống kê và báo cáo. Các ví dụ nhận diện ảnh và gợi ý sản phẩm không thuộc độc quyền một kỹ thuật.
:::

## Tóm tắt 1 phút

:::recap
- AI là phạm vi rộng, gồm cả hệ thống dùng luật.
- ML học quy luật từ dữ liệu.
- DL thuộc ML và dùng mạng nơ-ron nhiều lớp.
- Data Science kết hợp lĩnh vực, lập trình và thống kê để tạo giá trị.
- Input là feature vector; output là prediction.
- Chọn công cụ từ vấn đề, dữ liệu và cách đánh giá.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Deep Learning có phải là một nhánh hoàn toàn tách biệt với
Machine Learning không? Vì sao?
A: Không. Deep Learning là **tập con** của Machine Learning —
nó vẫn là học từ dữ liệu, chỉ khác ở chỗ dùng mạng nơ-ron nhiều lớp và
cần lượng dữ liệu rất lớn.
EN: Is Deep Learning a completely separate branch from Machine
Learning? Why or why not?
**A:** No. Deep Learning is a **subset** of Machine Learning — it
> still learns from data, just using multi-layer neural networks and
> requiring a very large amount of data.

Q: Một chatbot trả lời câu hỏi hoàn toàn theo kịch bản lập trình
sẵn (if-else, không học từ dữ liệu) có được coi là Machine Learning không?
A: Không. Vì nó không *học* gì từ dữ liệu — chỉ chạy theo luật
lập trình sẵn. Nó có thể được coi là AI (theo nghĩa rộng: hệ thống tự
đưa ra hành động), nhưng không phải Machine Learning.
EN: Is a chatbot that answers questions purely through hardcoded
if-else rules (learning nothing from data) considered Machine Learning?
**A:** No. It doesn't *learn* anything from data — it just follows
> hardcoded rules. It could be considered AI (in the broad sense: a
> system that takes action), but not Machine Learning.
Q: Một báo cáo doanh thu chỉ dùng thống kê có thuộc Data Science không?
A: Có, nếu nó tạo insight hoặc hỗ trợ quyết định từ dữ liệu. Không bắt buộc phải huấn luyện model.
Q: Trong sơ đồ input → model → output, output là gì?
A: Là prediction. Giá trị đúng dùng để so sánh với prediction là label; hai thứ không đồng nhất.
@tier B | Phỏng vấn lý thuyết
Q: Giải thích ML khác lập trình bằng luật thế nào?
A: Chương trình dùng luật nhận quy tắc do người viết. ML học tham số/quy luật từ các ví dụ để dự đoán trên dữ liệu mới. Ví dụ lọc spam có thể dùng danh sách từ khóa hoặc model học từ email đã gán nhãn.
EN: Rule-based programs use explicit rules; machine learning learns patterns from examples and applies them to unseen data.
Q: Deep Learning được định nghĩa bằng dữ liệu lớn hay kiến trúc?
A: Bằng mạng nơ-ron nhiều lớp. Dữ liệu lớn thường hữu ích nhưng không phải định nghĩa; cần xét khả năng tái sử dụng model đã học *(bổ sung)*.
EN: Deep learning uses multilayer neural networks. A large dataset is common, but it is not the defining criterion.
Q: Data Science có luôn cần ML không?
A: Không. Làm sạch dữ liệu, thống kê doanh thu và kiểm chứng một giả thuyết có thể tạo giá trị mà không huấn luyện model. ML là một công cụ trong bức tranh đó.
EN: Data science can create value through statistics and analysis without training a predictive model.
Q: Vì sao không bắt đầu mọi bài toán bằng DL?
A: Cần kiểm tra mục tiêu, dữ liệu, baseline và nguồn lực trước. Với quy tắc nghiệp vụ rõ và ít thay đổi, một luật minh bạch có thể đủ; model phức tạp thêm chi phí và nhu cầu kiểm chứng *(bổ sung)*.
EN: Start with the objective and a simple baseline. Model complexity must be justified by measurable benefits.
@tier C | Tình huống doanh nghiệp
Q: Shop muốn chặn đơn có địa chỉ trống. Có nên train ML?
A: Trước hết viết kiểm tra bắt buộc cho trường địa chỉ, đo số đơn lỗi bị chặn và xử lý ngoại lệ. Đây là điều kiện rõ ràng, chưa cần học từ dữ liệu. Chỉ cân nhắc ML nếu cần phát hiện địa chỉ bất thường khó mô tả bằng luật; khi đó phải có dữ liệu và tiêu chí đánh giá *(bổ sung)*.
WANT: Biết chọn giải pháp theo độ phức tạp của vấn đề và chi phí vận hành.
Q: Quản lý nói doanh thu giảm, muốn làm AI ngay. Bắt đầu ở đâu?
A: Làm rõ quyết định cần hỗ trợ, kiểm tra dữ liệu và phân rã doanh thu theo sản phẩm, thời gian, kênh bán. Nếu cần giải thích biến động thì phân tích Data Science có thể đủ. Nếu cần dự báo để nhập hàng, mới đặt bài toán ML và so với một baseline đơn giản *(bổ sung)*.
WANT: Phân biệt nhu cầu insight với nhu cầu dự đoán, gắn đầu ra với hành động.
Q: Startup muốn nhận diện ảnh nhưng có ít ảnh đã gán nhãn. Bạn đề xuất gì?
A: Kiểm tra loại ảnh, nhãn và quyền sử dụng dữ liệu, rồi tạo tập đánh giá đại diện. Thử model có sẵn/transfer learning và so với phương án đơn giản trước khi train từ đầu. Đánh đổi giữa chất lượng, chi phí gán nhãn và khả năng triển khai *(bổ sung)*.
WANT: Không coi DL là đồng nghĩa với tự train một mạng lớn từ đầu.
:::

## Nối sang bài sau

:::next
Tiếp theo, [[bài:feature-and-data-types]] sẽ nối phần kiến thức này với bước kế tiếp của lộ trình.
:::
