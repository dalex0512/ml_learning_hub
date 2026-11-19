---
title: Labeled Data — feature matrix (X) và label vector (y)
order: 4
description: "Gọi đúng tên sample, feature, label, feature vector, X và y theo slide 11 đến 16; tách bảng Diabetes thành X (768 × 8) và y, và vì sao hàng và nhãn phải luôn khớp."
slides: 11-16
needs: [feature-and-data-types, learning-paradigms]
tags: [X, y, label, sample, feature-matrix]
---

## Một mẫu có nhãn gồm những gì?

:::intro Mục tiêu bài này
- Gọi đúng tên các phần của **labeled data** theo slide 11 đến 16: sample, feature, label (target), feature vector, feature matrix **X** và label vector **y**.
- Tách một bảng thành **X** và **y** và biết hình dạng của chúng (Diabetes: X là 768 × 8, y có 768 phần tử).
- Hiểu vì sao hàng i của X phải luôn đi cùng nhãn y⁽ⁱ⁾, và điều gì xảy ra khi chúng lệch nhau.
:::

Slide 11 mở đầu bằng bảng Diabetes (dữ liệu có nhãn). Cứ mỗi lần slide tô một vùng, nó đặt một cái tên:

| Phần của bảng | Tên | Slide |
|---|---|---|
| Một **hàng** | **sample** (mẫu) | 12 |
| Một **cột** thông tin (ví dụ BMI) | **feature** | 13 |
| Cột đáp án `Outcome` | **label (target)** | 14 |
| Các feature của **một** mẫu | **feature vector** (đầu vào, input) | 15 |
| Label tương ứng của mẫu đó | **corresponding label (target)** (đầu ra, output) | 15 |
| Toàn bộ các cột feature | **feature matrix (X)** | 16 |
| Toàn bộ cột nhãn | **label/target vector (y)** | 16 |

:::slides 11-16 | Slide 11–16: labeled data, sample, feature, label, feature vector, feature matrix X và label vector y
:::

Hãy bấm vào bảng Diabetes dưới đây để thấy x⁽ⁱ⁾ và y⁽ⁱ⁾ của từng mẫu, bấm "Tách thành X và y" để thấy bảng chia hai.

:::widget xy-table
:::

## Một mẫu có nhãn = đề + đáp án

Lấy mẫu thứ 6 của bộ Diabetes (mẫu được khoanh đỏ ở slide 12):

| Pregnancies | Glucose | BloodPressure | SkinThickness | Insulin | BMI | DPF | Age | Outcome |
|---|---|---|---|---|---|---|---|---|
| 5 | 116 | 74 | 0 | 0 | 25.6 | 0.201 | 30 | **0** |

Tám con số đầu là **đề bài** (feature vector, input): thông tin ta có về một người. Con số cuối, `Outcome = 0`, là **đáp án** (label, output): người này không bị tiểu đường. Model học bằng cách nhìn rất nhiều cặp (đề, đáp án) như vậy, rồi tự tìm quy luật nối đề với đáp án ([[bài:model-training-pipeline]]).

## Từ bảng đến X và y

Ta tách bảng thành hai thứ và đặt tên theo quy ước toán học:

- **X**: ma trận feature, mỗi **hàng** là một mẫu, mỗi **cột** là một feature. Với Diabetes: **768 hàng × 8 cột**.
- **y**: vector nhãn, mỗi phần tử là đáp án của một mẫu. Với Diabetes: **768 phần tử**.

Với mẫu thứ i, ta viết **x⁽ⁱ⁾** (hàng i của X, một vector 8 số) và **y⁽ⁱ⁾** (nhãn của nó). Ở ví dụ trên, x⁽⁶⁾ = (5, 116, 74, 0, 0, 25.6, 0.201, 30) và y⁽⁶⁾ = 0. Model là một hàm nhận x⁽ⁱ⁾ và trả ra dự đoán ŷ⁽ⁱ⁾ để so với y⁽ⁱ⁾.

```python
x = data.drop(labels="Outcome", axis=1)   # bỏ cột đáp án: còn 8 cột
y = data["Outcome"]                        # chỉ lấy cột đáp án
print(x.shape, y.shape)                    # (768, 8) (768,)
```

Chú ý `y.shape` là `(768,)`, không phải `(768, 1)`: y là **một dãy** (vector), không phải bảng một cột. Project Bước 3 làm đúng bước này và có nút "Giải thích code" cho từng dòng (kể cả vì sao `axis=1` bỏ cột còn `axis=0` báo lỗi).

:::predict
Bạn lỡ để cột `Outcome` lại trong `x` khi huấn luyện. Điểm trên bộ test sẽ thế nào, và điều đó có đáng mừng không?
@answer
Điểm sẽ **cao bất thường** (gần 100%), vì model nhìn thẳng đáp án như một feature. Không đáng mừng: đó là **rò rỉ dữ liệu ([[từ:data-leakage]])**. Khi dùng thật ta không có đáp án để đưa vào, nên model hỏng ngay. Quy tắc: cột nhãn chỉ nằm trong y, không bao giờ nằm trong X.
:::

## Hàng của X phải đi cùng nhãn của chính nó

X và y là **hai nửa của cùng một bảng**: hàng i của X chỉ có nghĩa khi ghép với y⁽ⁱ⁾. Điều này dễ bị phá khi ta xáo, lọc hoặc chia dữ liệu:

- Xáo **riêng** X mà không xáo y: mọi cặp (đề, đáp án) bị lệch. Ở công cụ trên, luật đơn giản "Glucose ≥ 140 thì đoán 1" đúng **66.7%** trên 24 hàng đầu khi hàng và nhãn khớp, nhưng chỉ còn **41.7%** sau khi xáo lệch: tệ hơn đoán mò, vì không còn quy luật nào để học.
- Lọc hàng của X nhưng quên lọc y: hai bên khác độ dài hoặc lệch hàng.
- Chia train/test: phải chia X và y **cùng một cách**. `train_test_split(x, y, ...)` nhận cả hai để đảm bảo điều đó ([[bài:train-test-split]]).

:::ck
Sau khi xáo ngẫu nhiên các hàng của `x` (quên xáo `y`), model đạt accuracy khoảng 50% trên một bộ phân loại hai lớp cân bằng. Điều đó nói lên gì? Và nếu model đạt **100%** thì sao?
@answer
Accuracy 50% nghĩa là **model không học được gì** (bằng đoán mò): sau khi xáo riêng, x⁽ⁱ⁾ không còn là mẫu có nhãn y⁽ⁱ⁾ nên không có quan hệ nào để học. Còn nếu đạt 100%, hãy nghi ngờ ngay một lỗi **rò rỉ** (ví dụ nhãn lọt vào x). Cả hai con số cực đoan đều là tín hiệu cần kiểm tra quy trình trước khi tin điểm.
:::

## Những hiểu sai thường gặp

- **"y là một bảng một cột."** Thực ra y là vector `(768,)`; với một vài hàm cần `(768, 1)` ta mới `reshape`.
- **"Feature vector là cả bảng."** Feature vector là **một hàng** của X (một mẫu). Cả bảng feature là **feature matrix**.
- **"Nhãn chỉ là chữ."** Nhãn có thể là số (0/1, điểm thi) hoặc chữ (dog/cat); điều quan trọng là nó là đáp án.
- **"Không cần để ý thứ tự hàng."** Thứ tự **không** quan trọng, nhưng **sự khớp giữa x⁽ⁱ⁾ và y⁽ⁱ⁾** thì tuyệt đối quan trọng.

:::card Labeled data
- **Sample = một hàng; feature = một cột; label (target) = đáp án.** Một mẫu có nhãn = feature vector (input) + label (output).
- **X** là feature matrix (số mẫu × số feature); **y** là label vector (độ dài bằng số mẫu). Diabetes: X là 768 × 8, y là `(768,)`.
- **x⁽ⁱ⁾, y⁽ⁱ⁾** là mẫu thứ i; hàng i của X luôn đi cùng y⁽ⁱ⁾ (xáo lệch: luật đúng 66.7% còn 41.7%).
- **Không để cột nhãn lọt vào X** (rò rỉ dữ liệu); xáo, lọc, chia luôn làm trên X và y cùng lúc.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Nếu 1 dataset không có cột kết quả nào (không có `Outcome`),
dữ liệu đó gọi là gì — labeled hay unlabeled?
A: Unlabeled — không có giá trị đúng đã biết trước đi kèm mỗi
sample thì không thể gọi là labeled data, và cũng không dùng được cho
Supervised learning.
EN: If a dataset has no outcome column at all, is it called labeled
or unlabeled data?
**A:** Unlabeled — without a known correct value attached to each
> sample, it can't be called labeled data, and it can't be used for
> Supervised learning.

Q: Nếu dataset có 500 sample, feature matrix `X` có bao nhiêu
dòng? Label vector `y` có bao nhiêu phần tử?
A: `X` có 500 dòng (mỗi dòng là feature vector của 1 sample),
`y` có 500 phần tử (mỗi phần tử là label tương ứng của đúng sample đó).
EN: If a dataset has 500 samples, how many rows does feature matrix
`X` have? How many elements does label vector `y` have?
**A:** `X` has 500 rows (each row is one sample's feature vector), `y`
> has 500 elements (each one the corresponding label for that exact
> sample).
Q: X có n mẫu và p feature thì shape là gì?
A: X có shape (n, p). Với một target cho mỗi mẫu, y thường có shape (n,).
Q: Shuffle riêng X và y nhưng giữ số hàng có đúng không?
A: Không. Số hàng khớp chưa đủ, mỗi hàng X phải đi cùng target của chính sample đó.
@tier B | Phỏng vấn lý thuyết
Q: Feature vector khác feature matrix thế nào?
A: Vector mô tả một mẫu; ma trận chứa nhiều mẫu theo hàng và feature theo cột. Trong Diabetes, một hàng các chỉ số là vector, toàn bộ các hàng là X.
EN: A feature vector describes one sample; a feature matrix stacks samples as rows and features as columns.
Q: Vì sao phải tách Outcome ra khỏi X?
A: Outcome là thứ cần dự đoán. Nếu dùng chính target làm input, model có thể đọc đáp án trong lúc train mà không có thông tin đó khi sử dụng thật.
EN: The target must be excluded from inputs; otherwise the model can read the answer during training.
Q: Nhãn có phải lúc nào cũng là ground truth hoàn hảo không?
A: Không. Nhãn là kết quả quan sát hoặc gán, có thể sai, chậm hoặc có thiên lệch *(bổ sung)*. Cần biết cách tạo nhãn và kiểm tra độ tin cậy trước khi học.
EN: Observed labels may be noisy, delayed, or biased; their provenance and quality matter.
Q: Shape đúng có đảm bảo dữ liệu huấn luyện đúng không?
A: Không. Cần kiểm tra thứ tự hàng, đơn vị phân tích, thời điểm của feature và định nghĩa target. Hai mảng có shape hợp lệ vẫn có thể ghép nhầm sample.
EN: Valid shapes do not guarantee correct alignment, timing, or target definitions.
@tier C | Tình huống doanh nghiệp
Q: Model dự đoán mua hàng dùng cột trạng thái sau khi thanh toán. Có vấn đề gì?
A: Xác định thời điểm cần dự đoán và thời điểm có trạng thái đó. Nếu chỉ biết sau mua, loại khỏi X và tạo lại dữ liệu theo thời điểm dự đoán. Chất lượng offline có thể giảm nhưng phản ánh khả năng sử dụng thật *(bổ sung)*.
WANT: Kiểm tra thông tin có sẵn lúc dự đoán, không chỉ kiểm tra tên cột.
Q: Hai người gán nhãn cùng một ảnh khác nhau. Bạn làm gì?
A: Xem định nghĩa nhãn và nhóm ảnh hay bất đồng, sửa hướng dẫn, có bước phân xử và kiểm tra lại một mẫu dữ liệu. Không chỉ chọn nhãn theo số đông khi tiêu chí chưa rõ. Đánh đổi tốc độ gán nhãn với độ tin cậy *(bổ sung)*.
WANT: Có quy trình cải thiện chất lượng target thay vì chỉ đổi thuật toán.
Q: Nhóm lấy click làm nhãn thích sản phẩm. Có thiên lệch gì?
A: Click chỉ có ở sản phẩm đã được hiển thị và chịu ảnh hưởng vị trí. Kiểm tra log hiển thị, cách lấy nhãn âm và mục tiêu thật như mua hàng; đánh giá theo nhóm vị trí/nguồn truy cập. Click dễ thu nhưng không tương đương sở thích hay giá trị lâu dài *(bổ sung)*.
WANT: Hiểu nhãn từ hành vi có điều kiện quan sát và không tự là chân lý.
:::

## Nối sang bài sau

:::next
X và y đã sẵn sàng nhưng chưa có quy luật dự đoán. [[bài:model-training-pipeline]] nối chúng thành vòng prediction → loss → update.
:::
