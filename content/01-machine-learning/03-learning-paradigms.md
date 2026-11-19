---
title: Các phương thức học trong Machine Learning
order: 3
description: "Ba phương thức học của slide 9 (supervised, unsupervised, reinforcement), vì sao nhãn quyết định phương thức, và cây câu hỏi để đặt bài toán vào đúng nhóm."
slides: 9-10
needs: [what-is-ml]
tags: [supervised, unsupervised, reinforcement, labels]
---

## Model học từ loại phản hồi nào?

:::intro Mục tiêu bài này
- Phân biệt ba phương thức học của slide 9: **Supervised**, **Unsupervised**, **Reinforcement**, và các dạng bài toán trong mỗi loại.
- Hiểu vì sao câu hỏi đầu tiên luôn là: **dữ liệu có nhãn (đáp án) không?**
- Đặt một bài toán thật vào đúng nhóm bằng chuỗi hai câu hỏi.
:::

Một đứa trẻ học qua ba kiểu phản hồi khác nhau: (1) người lớn **chỉ vào và gọi tên** ("đây là con chó"); (2) trẻ tự **nhận ra các nhóm** đồ vật giống nhau dù chưa ai gọi tên; (3) trẻ **thử rồi nhận hậu quả**: đạp xe ngã thì đau, đi đúng thì được khen. Ba kiểu này chính là ba phương thức học của máy, và cái làm chúng khác nhau là **loại phản hồi mà máy nhận được**.

## Bản đồ ba phương thức (slide 9)

| Phương thức | Phản hồi | Dạng bài toán và ví dụ trên slide |
|---|---|---|
| **Supervised learning** (học có giám sát) | đáp án (nhãn) cho từng mẫu | **Classification:** phát hiện gian lận, lọc email spam, chẩn đoán bệnh, phân loại ảnh. **Regression:** đánh giá rủi ro, dự đoán điểm số |
| **Unsupervised learning** (học không giám sát) | không có đáp án; tự tìm cấu trúc | **Clustering:** gom khách hàng, trực quan hóa dữ liệu. **Association:** hệ thống gợi ý |
| **Reinforcement learning** (học tăng cường) | điểm thưởng hoặc phạt sau hành động | lý thuyết trò chơi (game theory), xe tự lái |

:::slides 9-10 | Slide 9–10: các phương thức học trong Machine Learning; bắt đầu với supervised learning
:::

## Nhãn quyết định phương thức học

Câu hỏi đầu tiên luôn là: **mỗi mẫu có sẵn đáp án không?** Đáp án đó gọi là **[[từ:label|nhãn]]**, và dữ liệu có nhãn gọi là *labeled data* (slide ghi chú việc gán nhãn là *data labelling*).

- **Có nhãn** và nhãn là một **nhóm** (spam hay không): *supervised, classification*.
- **Có nhãn** và nhãn là một **con số** (điểm thi, giá nhà): *supervised, regression*. Hai dạng này là chủ đề của [[bài:classification-vs-regression]].
- **Không có nhãn**: *unsupervised*. Máy chỉ nhận dữ liệu và tìm cấu trúc bên trong (các nhóm giống nhau, các thứ hay đi cùng nhau).
- **Không có nhãn từng mẫu nhưng có thưởng hoặc phạt** sau chuỗi hành động: *reinforcement*.

Gán nhãn thường là phần **đắt nhất** của một dự án ML (cần người đọc, chẩn đoán, gán từng mẫu), nên có nhãn hay không là chuyện rất thực tế, không chỉ là thuật ngữ.

:::predict
Bạn có 100.000 ảnh sản phẩm, **chưa ai gán nhãn**, và muốn chia chúng thành các nhóm giống nhau để sắp xếp kệ hàng. Thuộc phương thức nào, và dạng bài toán nào?
@answer
**Unsupervised, dạng Clustering.** Không có đáp án sẵn, ta để máy tìm các nhóm tự nhiên. Nếu ta **đã có** nhãn "áo", "giày", "túi" cho từng ảnh và muốn dạy máy đoán nhãn cho ảnh mới, đó mới là supervised classification: cùng loại dữ liệu nhưng **khác bài toán vì khác nhãn**.
:::

Hãy tự thử: trả lời hai câu hỏi trong cây để ra kết luận, rồi đặt sáu tình huống vào đúng nhóm.

:::widget paradigm-chooser
:::

## Supervised: học khi có đáp án để chấm

Vì mỗi mẫu có đáp án, ta **chấm được** model: so dự đoán với nhãn thật, đo sai lệch ([[bài:loss-function]]), rồi chỉnh. Cả hai dạng đều có chung cấu trúc "feature vào, nhãn ra"; chỉ khác loại nhãn:

- **Classification:** nhãn thuộc một tập hữu hạn (gian lận hoặc không; một trong 10 loại ảnh).
- **Regression:** nhãn là số liên tục (điểm số, mức rủi ro).

Toàn bộ Project (Diabetes) là supervised classification: 768 người, nhãn `Outcome` 0 hoặc 1.

## Unsupervised và Reinforcement: khi không có đáp án cho từng mẫu

- **Unsupervised:** không có nhãn nên **không có đáp án đúng để chấm**. Clustering cho ra các nhóm, nhưng "nhóm nào đúng" phải do người đánh giá bằng ý nghĩa. Association tìm quy luật như "người mua A thường mua B".
- **Reinforcement:** một **tác tử** hành động trong một **môi trường**, nhận **thưởng hoặc phạt**, và học chuỗi hành động tối đa hóa tổng thưởng. Không có bảng dữ liệu có nhãn sẵn; dữ liệu sinh ra từ chính các lần thử.

:::ck
Một ứng dụng nghe nhạc gợi ý bài hát "những người giống bạn cũng thích". Dựa vào **tên ứng dụng** (hệ thống gợi ý), bạn kết luận ngay được phương thức học chưa?
@answer
**Chưa.** Slide xếp hệ thống gợi ý vào Association (unsupervised), nhưng trên thực tế nó còn có thể là **supervised** nếu ta có nhãn "người dùng đã bấm thích bài này" và đoán xác suất thích. Phương thức học do **dữ liệu và nhãn** quyết định, không do tên sản phẩm. Luôn hỏi: dữ liệu có nhãn nào, mục tiêu là gì?
:::

## Những hiểu sai thường gặp

- **"Unsupervised nghĩa là không cần dữ liệu."** Sai: vẫn cần dữ liệu, chỉ là không có nhãn.
- **"Tên ứng dụng cho biết phương thức học."** Sai: cùng một sản phẩm có thể dùng supervised hoặc unsupervised tùy dữ liệu.
- **"Regression là supervised, classification là khác."** Cả hai đều là supervised; khác nhau ở loại nhãn.
- **"Có nhiều dữ liệu nghĩa là supervised được."** Sai: supervised cần **nhãn**, không chỉ cần nhiều dữ liệu.

:::card Các phương thức học
- **Supervised:** có nhãn cho từng mẫu; **Classification** (nhãn là nhóm) và **Regression** (nhãn là số).
- **Unsupervised:** không có nhãn; **Clustering** (gom nhóm), **Association** (luật đi cùng nhau).
- **Reinforcement:** học qua thưởng và phạt sau hành động (game, xe tự lái).
- **Câu hỏi đầu tiên:** mỗi mẫu có sẵn đáp án không? Nếu có: nhãn là nhóm hay số?
- **Đừng suy từ tên ứng dụng**, hãy nhìn dữ liệu và nhãn.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Bài toán "gợi ý sản phẩm nên mua tiếp theo cho khách hàng"
thuộc Supervised hay Unsupervised? Vì sao?
A: Thường là Unsupervised (Association) — hệ thống tìm quan hệ
giữa các mục hàng dựa trên hành vi mua sắm chung, không có nhãn "đúng"
sẵn cho biết khách hàng nên mua gì tiếp theo.
EN: Is "recommend the next product a customer should buy" Supervised
or Unsupervised? Why?
**A:** Usually Unsupervised (Association) — the system finds
> relationships between items based on shared purchasing behavior, with
> no pre-existing "correct" label telling it what the customer should
> buy next.

Q: Vì sao Reinforcement Learning không cần dữ liệu có nhãn
(labeled data) như Supervised learning?
A: Vì RL học qua **thử-sai** (trial and error) để tối đa hoá
phần thưởng (reward) nhận được từ môi trường, thay vì học từ các cặp
(input, label) đã biết trước như Supervised learning.
EN: Why doesn't Reinforcement Learning need labeled data the way
Supervised learning does?
**A:** Because RL learns through **trial and error** to maximize the
> reward received from the environment, instead of learning from known
> (input, label) pairs like Supervised learning.
Q: Gom khách hàng khi chưa có phân khúc chuẩn thuộc nhóm nào?
A: Unsupervised, thường là clustering. Cần diễn giải và kiểm chứng các cụm thay vì coi cụm là nhãn đúng có sẵn.
Q: Có ít nhãn và nhiều dữ liệu chưa nhãn thì có hướng học nào?
A: Có thể cân nhắc semi-supervised *(bổ sung)*, nhưng vẫn cần nhãn đánh giá đáng tin và baseline supervised trên phần có nhãn.
@tier B | Phỏng vấn lý thuyết
Q: Ba phương thức học khác nhau ở tín hiệu nào?
A: Supervised nhận target đúng; unsupervised không có target đó và tìm cấu trúc; RL tương tác với môi trường để tối đa reward dài hạn. Ví dụ: phân loại spam, phân cụm khách, tác tử chơi game.
EN: Supervised learning uses targets, unsupervised learning finds structure without targets, and reinforcement learning optimizes rewards through interaction.
Q: Clustering khác classification thế nào?
A: Classification học các class được định nghĩa bằng nhãn. Clustering tạo nhóm theo độ tương đồng, nhóm chưa tự có ý nghĩa nghiệp vụ. Phải đánh giá và diễn giải sau khi phân cụm.
EN: Classification predicts predefined labels; clustering discovers similarity-based groups that require interpretation.
Q: Vì sao không gọi RL là supervised với một nhãn reward?
A: Reward đánh giá kết quả của hành động, có thể đến muộn và phụ thuộc chuỗi hành động; nó không nhất thiết cho biết hành động đúng tại từng bước *(bổ sung)*. Khác với cặp input–label đã biết.
EN: A reward evaluates outcomes and may be delayed; it does not necessarily specify the correct action for each input.
Q: Semi-supervised có thay thế được kiểm tra nhãn không?
A: Không. Nó tận dụng dữ liệu chưa nhãn, nhưng giả định có thể sai và pseudo-label có thể lan truyền lỗi. Cần kiểm tra chất lượng nhãn và đánh giá độc lập *(bổ sung)*.
EN: Semi-supervised learning can exploit unlabeled data, but unreliable pseudo-labels can propagate errors.
@tier C | Tình huống doanh nghiệp
Q: Sàn bán hàng có nhiều ảnh nhưng ít nhãn sản phẩm. Làm gì trước?
A: Xác định bộ nhãn và tập đánh giá được kiểm tra thủ công, xây baseline trên dữ liệu đã nhãn. Cân nhắc gán nhãn thêm mẫu đại diện, transfer learning hoặc semi-supervised; đo cải thiện trước khi mở rộng. Giảm tiền gán nhãn có thể đổi lấy nhiễu nhãn *(bổ sung)*.
WANT: Gắn việc chọn paradigm với chi phí và chất lượng nhãn.
Q: Marketing muốn các nhóm khách hàng chưa từng được định nghĩa. Chọn gì?
A: Thử clustering trên feature hành vi đã xử lý, diễn giải từng nhóm cùng người làm nghiệp vụ rồi kiểm chứng bằng chiến dịch nhỏ. Không gọi số cụm là class đúng. Nhóm đẹp về khoảng cách chưa chắc hữu ích cho doanh thu *(bổ sung)*.
WANT: Biết phân biệt khám phá cấu trúc với dự đoán nhãn có sẵn.
Q: Kho vận muốn thử RL ngay trên hệ thống thật để giảm chi phí. Bạn trả lời sao?
A: Làm rõ quyết định tuần tự, reward và ràng buộc, so với luật hiện hành. Kiểm tra có môi trường mô phỏng/đánh giá an toàn trước khi cho tác tử khám phá; nếu chỉ dự đoán nhu cầu thì supervised có thể phù hợp hơn. Reward sai có thể tối ưu chi phí mà phá chất lượng phục vụ *(bổ sung)*.
WANT: Nhận ra điều kiện để dùng RL và tác hại của reward lệch mục tiêu.
:::

## Nối sang bài sau

:::next
Với supervised learning, mỗi input cần gắn với target đúng. [[bài:labeled-data]] biến ý tưởng đó thành feature matrix X và label vector y.
:::

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Phân biệt học từ nhãn, cấu trúc dữ liệu và reward.
- Đặt ví dụ classification, regression, clustering, association.
- Nêu phương án khi có nhiều dữ liệu nhưng ít nhãn.
:::

Nền để đọc bài này: [[bài:what-is-ml]].

:::slides 9-10 | Slide gốc — Các phương thức học trong Machine Learning
:::

Machine Learning được chia thành 3 nhóm theo **phương thức học** — tức
cách model tương tác với dữ liệu trong lúc huấn luyện: **Supervised
learning** (học có giám sát), **Unsupervised learning** (học không giám
sát), và **Reinforcement learning** (học tăng cường).

> **EN:** Machine Learning splits into three groups by **learning
> paradigm** — how the model interacts with data during training:
> **Supervised learning**, **Unsupervised learning**, and **Reinforcement
> learning**.

## [sâu] Nhãn dữ liệu quyết định điều gì?

Phần lớn dữ liệu xung quanh ta vốn là **dữ liệu thô** (unlabeled). Biến dữ
liệu thô thành dữ liệu có nhãn (labeled) gọi là **data labelling/data
annotation** — quá trình này có thể do người thực hiện hoặc tận dụng tín hiệu từ quy trình nghiệp vụ *(bổ sung)*. Việc
dữ liệu bạn có là loại nào (có nhãn hay không) quyết định bạn dùng được
phương thức học nào.

> **EN:** Most data around us starts out as **unlabeled, raw data**.
> Turning raw data into labeled data is called **data labelling/data
> annotation** — a process that can use human annotation or operational signals. Which
> learning paradigm you can use depends on whether your data is labeled.

## [sâu] Ba phương thức học và các dạng bài toán

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

## [sâu] Đặt bài toán qua ví dụ

:::worked Ví dụ và số liệu đối chiếu
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
:::

Chưa cần code ở bài này — mỗi thuật toán cụ thể (trong module Supervised
Learning / Unsupervised Learning) sẽ có code riêng ở các bài sau. Bài này
chỉ là bức tranh tổng quan để chọn đúng nhóm bài toán trước khi bắt tay
code.

> **EN:** No code needed in this lesson — each specific algorithm (in the
> Supervised/Unsupervised Learning modules) gets its own code in later
> lessons. This lesson is only the overview needed to pick the right
> problem category before writing any code.

## [sâu] Tránh suy luận chỉ từ tên ứng dụng (bổ sung)

:::note Đọc ví dụ trên slide (nhận xét)
Recommendation được đặt dưới Association ở [[slide:9]], nhưng hệ gợi ý cũng có thể học có giám sát từ lịch sử click/mua. Annotation có thể đến từ người, quy trình nghiệp vụ hoặc tín hiệu tự động; chất lượng nhãn vẫn cần kiểm tra. Nhận xét viết tay về độ khó và việc làm RL là góc nhìn của khóa học, không phải quy luật hay thống kê thị trường.
:::

**Semi-supervised learning** kết hợp một phần dữ liệu có nhãn với nhiều dữ liệu chưa nhãn. Không coi nhãn model tự đoán là chân lý: cần tập đánh giá có nhãn đáng tin và theo dõi sai lệch.

> **EN:** Applications do not uniquely determine a learning paradigm. Semi-supervised learning combines labeled and unlabeled examples and still needs reliable evaluation labels.
