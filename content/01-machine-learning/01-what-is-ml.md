---
title: AI, Machine Learning, Deep Learning và Data Science là gì
order: 1
description: "ML là học quy tắc từ ví dụ: vì sao luật viết tay không đủ, bốn khái niệm AI, ML, Deep Learning, Data Science qua mục tiêu và hình vòng tròn, và sơ đồ input, model, output."
slides: 3-6
needs: []
tags: [ai, ml, dl, data-science]
---

## Viết luật bằng tay hay học từ ví dụ?

:::intro Mục tiêu bài này
- Giải thích được ML là gì bằng **một ví dụ có số liệu**: vì sao luật viết tay không đủ và máy học quy tắc từ ví dụ khác ở chỗ nào.
- Phân biệt **AI, Machine Learning, Deep Learning, Data Science** bằng mục tiêu của từng cái (theo slide 5) và hình vòng tròn (slide 4).
- Đọc sơ đồ **input → model → output** (slide 6) và chỉ ra "học" xảy ra ở đâu.
:::

Giả sử ta cần một bộ lọc thư rác. Cách thứ nhất là **tự viết luật**: "email nào chứa chữ *free* thì là spam". Thử trên 10 email, trong đó thật sự có 5 spam và 5 email thường (số tự soạn):

:::steps
Luật "chứa *free* thì là spam" **chặn 4 email**, trong đó 3 là spam thật và 1 là email của bạn bè ("free time this weekend?").
@step
Nó **bắt được 3 trong 5 spam** (recall 60%): hai spam viết kiểu "fr33" hoặc "miễn phí" lọt qua.
@step
Nó chặn nhầm **1 trong 5** email thường. Trong 4 email bị chặn, 3 là spam thật (precision 75%).
@step
Mỗi lỗi lại thêm một luật (`fr33`, `miễn phí`, `giảm giá`...). Số luật phình ra, các luật đụng nhau, và kẻ gửi spam đổi chữ nhanh hơn ta viết luật.
:::

Cách thứ hai: **đưa cho máy hàng nghìn email đã gán nhãn** spam hoặc không, để nó tự tìm ra quy tắc phân biệt. Quy tắc đó không nằm trong code ta viết mà nằm trong các **[[từ:parameter|tham số]]** máy học được; khi có thêm ví dụ, ta huấn luyện lại thay vì viết thêm luật. Đó là **Machine Learning**: học quy tắc từ ví dụ.

:::ck
Một lập trình viên viết 500 câu `if` để nhận ra spam, và cập nhật mỗi tuần khi có spam mới lọt qua. Đây có phải Machine Learning không? Vì sao?
@answer
**Không.** Quy tắc do **người** viết và chỉ đổi khi người sửa. Với ML, ta đưa dữ liệu có nhãn và **máy tự điều chỉnh tham số** để phân biệt; thêm dữ liệu thì huấn luyện lại. Dấu hiệu nhận ra: quy tắc có nằm trong code do người viết, hay nằm trong tham số do máy học?
:::

## Bốn cái tên, bốn mục tiêu

Bốn thuật ngữ hay bị dùng lẫn. Slide 5 tách chúng bằng **mục tiêu** của mỗi cái:

| Khái niệm | Mục tiêu (slide 5) |
|---|---|
| **AI** | đưa ra **hành động** từ dữ liệu |
| **Machine Learning** | **học hỏi** từ dữ liệu |
| **Deep Learning** | học hỏi từ **RẤT NHIỀU** dữ liệu |
| **Data Science** | tạo ra **giá trị** từ dữ liệu |

Hãy bấm từng khái niệm để xem nó nằm ở đâu trong hình, rồi làm năm câu "gọi đúng tên" bên dưới.

:::widget flow-map
concepts
:::

:::slides 5 | Slide 5: tổng quan các khái niệm, mục tiêu của AI, ML, Deep Learning và Data Science
:::

## Vòng tròn lồng nhau và vòng tròn giao nhau

Slide 4 vẽ quan hệ bằng hình Venn. Có hai điều cần nhớ:

1. **AI chứa Machine Learning chứa Deep Learning.** Mọi Deep Learning đều là ML, mọi ML đều là AI, nhưng chiều ngược lại không đúng: một hệ thống AI dùng quy tắc cố định thì không phải ML.
2. **Data Science giao với cả ba vòng**, không nằm gọn trong vòng nào. Hình Venn thứ hai của slide cho thấy vì sao: Data Science nằm ở **chỗ gặp nhau của ba năng lực**: kiến thức ngành (domain expertise), khoa học máy tính, và toán học (gồm thống kê). ML chỉ là một phần của giao điểm đó.

:::predict
Đặt mỗi việc vào **vòng nhỏ nhất đúng**: (a) mạng nơ-ron 50 tầng nhận diện ảnh, (b) bộ lọc spam học từ email gán nhãn, (c) bảng báo cáo doanh thu theo vùng kèm lời khuyên mở chi nhánh, (d) bộ điều khiển nhiệt độ theo quy tắc cố định.
@answer
(a) **Deep Learning** (cũng là ML và AI). (b) **Machine Learning**. (c) **Data Science**: tạo giá trị từ dữ liệu, có thể không cần ML. (d) **AI** nhưng **không phải ML**: nhận dữ liệu cảm biến và hành động, nhưng quy tắc do người viết. Luôn chọn vòng nhỏ nhất đúng với việc đó.
:::

## Sơ đồ input, model, output

Mọi bài toán ML đều có cùng một hình (slide 6): **Input (feature vector) → Model → Output (prediction)**.

:::steps
**Input:** thông tin đầu vào, gọi là một **vector các [[từ:feature|feature]]**. Một email thì có thể là (số lần xuất hiện chữ "free", có đính kèm không, độ dài...). Một bệnh nhân thì là 8 phép đo.
@step
**Model:** một hàm có **tham số** ("núm vặn"). Lúc đầu tham số chưa tốt nên model đoán sai.
@step
**Output (prediction):** dự đoán của model: spam hay không, giá nhà bao nhiêu.
@step
**Học:** đưa input, so output với **[[từ:label|nhãn]]** (đáp án thật), đo sai lệch, rồi chỉnh tham số để lần sau đoán tốt hơn. Phần so và chỉnh là nội dung của [[bài:model-training-pipeline]] và [[bài:loss-function]].
:::

:::slides 6 | Slide 6: Machine Learning, input (feature vector) → model → output (prediction)
:::

Sau khi học xong, tham số được **đóng băng**: model chỉ nhận input mới và tính output (gọi là [[từ:inference|inference]]), không còn bước chỉnh. Trong code scikit-learn, `fit` là lúc học còn `predict` là lúc dùng.

## Những hiểu sai thường gặp

- **"ML và AI là một."** Không: ML là một nhánh của AI. Luật viết tay vẫn có thể là AI.
- **"Deep Learning luôn tốt hơn ML cổ điển."** Không: slide ghi Deep Learning học từ **RẤT NHIỀU** dữ liệu. Với bảng vài trăm hàng như Diabetes, mô hình đơn giản (Logistic) thường ngang hoặc hơn mạng nơ-ron.
- **"Data Science chỉ là ML."** Không: nó còn gồm thống kê, kiến thức ngành và trực quan hóa. Nhiều dự án Data Science không cần ML.
- **"Máy hiểu như người."** Model chỉ tìm quy luật thống kê trong dữ liệu; nó giỏi đúng ở loại dữ liệu nó đã học.

:::ck
Công ty muốn "dùng AI" để dự đoán khách rời đi. Đội dữ liệu bảo đầu tiên cần xem **bảng dữ liệu khách hàng và nhãn "đã rời đi"**. Vì sao họ không bắt đầu bằng việc chọn thuật toán?
@answer
Vì ML **học từ dữ liệu có nhãn**: chất lượng và nhãn quyết định giới hạn của mọi thuật toán. Nếu dữ liệu thiếu hoặc nhãn sai, thuật toán nào cũng học ra quy tắc sai. Đây là lý do ML Pipeline bắt đầu bằng **thu thập và hiểu dữ liệu** ([[bài:ml-pipeline]]).
:::

:::card AI, ML, Deep Learning, Data Science
- **ML = học quy tắc từ ví dụ**; luật viết tay thì không phải ML (ví dụ luật "free": recall 60%, precision 75%, và phải thêm luật mãi).
- **Mục tiêu (slide 5):** AI = hành động từ dữ liệu; ML = học từ dữ liệu; DL = học từ RẤT NHIỀU dữ liệu; Data Science = tạo giá trị từ dữ liệu.
- **Hình (slide 4):** AI chứa ML chứa DL; Data Science giao với cả ba (giao của kiến thức ngành, khoa học máy tính, toán).
- **Sơ đồ (slide 6):** input (feature vector) → model (tham số) → output (prediction); học = chỉnh tham số theo sai lệch so với nhãn.
- **Sau khi học:** tham số đóng băng; `fit` là học, `predict` là dùng.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Deep Learning có phải là một nhánh hoàn toàn tách biệt với
Machine Learning không? Vì sao?
A: Không. Deep Learning là **tập con** của Machine Learning —
nó vẫn là học từ dữ liệu, chỉ khác ở chỗ dùng mạng nơ-ron nhiều lớp và
thường cần nhiều dữ liệu khi train từ đầu; lượng dữ liệu không phải định nghĩa của DL.
EN: Is Deep Learning a completely separate branch from Machine
Learning? Why or why not?
**A:** No. Deep Learning is a **subset** of Machine Learning — it
> still learns from data, just using multi-layer neural networks and
> often requiring substantial data when trained from scratch.

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
Đã biết ML học từ dữ liệu, giờ cần biết dữ liệu được mô tả bằng những gì. [[bài:feature-and-data-types]] giúp đọc sample, feature và ý nghĩa từng loại cột.
:::
