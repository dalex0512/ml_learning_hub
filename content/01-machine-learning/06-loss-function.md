---
title: Loss Function (Hàm mất mát)
order: 6
description: "Biến sai số thành một con số máy giảm được: tính tay L1 và L2 trên bảng giá nhà của slide 19, hình dạng của hai loss, và loss khác metric."
slides: 19-21
needs: [model-training-pipeline]
tags: [loss, L1, L2, MAE, MSE, outlier, regression]
---

## Làm sao biến "sai bao nhiêu" thành một con số máy giảm được?

:::intro Mục tiêu bài này
- Hiểu vì sao cần một con số duy nhất (**loss**) để đo mức sai của model trên cả bảng dữ liệu.
- Tính tay **L1** và **L2** trên bảng giá nhà của slide 19, và so sánh cách chúng đối xử với sai số lớn (slide 20 và 21).
- Phân biệt **loss** (để model học) với **metric** (để con người đánh giá).
:::

Slide 19 cho một model dự đoán giá nhà ở Việt Nam (đơn vị: **tỉ VND**) từ diện tích, số tầng, thành phố và có ở trong ngõ hay không:

| Diện tích | Số tầng | Thành phố | Trong ngõ | **Prediction** | **Label** | Sai số (pred − label) |
|---|---|---|---|---|---|---|
| 40 | 6 | HCM | No | 3.45 | 3.75 | −0.30 |
| 60 | 4 | Hà Nội | No | 3.90 | 4.12 | −0.22 |
| 120 | 3 | Hải Dương | Yes | 2.12 | 2.20 | −0.08 |
| 50 | 4 | Huế | No | 2.90 | 2.30 | **+0.60** |

Bốn dự đoán, bốn sai số khác nhau. Để máy **chỉnh được tham số** ([[bài:model-training-pipeline]]), ta cần gói bốn sai số thành **một con số**: càng nhỏ càng tốt. Con số đó là **loss**, và slide 19 vẽ nó ở đúng chỗ: prediction và label cùng đi vào **loss**.

:::slides 19 | Slide 19: ví dụ dự đoán giá nhà ở Việt Nam, prediction và label đi vào loss
:::

## Hai cách gói sai số: L1 và L2

Slide 20 giới thiệu hai loss phổ biến, mỗi cái có nhiều tên gọi:

| | Công thức | Tên gọi khác |
|---|---|---|
| **L1 loss** | Σ \|y_prediction − y_actual\| | Least Absolute Deviations (LAD), Absolute Error, trung bình của các sai số tuyệt đối |
| **L2 loss** | Σ (y_prediction − y_actual)² | Least Squares (LS), Squared Error, trung bình của các sai số bình phương |

:::steps
**L1 trên bảng giá nhà:** |−0.30| + |−0.22| + |−0.08| + |+0.60| = **1.20**. Lấy trung bình (chia 4) được **0.30** tỉ đồng.
@step
**L2 trên bảng giá nhà:** 0.30² + 0.22² + 0.08² + 0.60² = 0.0900 + 0.0484 + 0.0064 + 0.3600 = **0.5048**. Lấy trung bình được **0.1262**.
@step
**So phần đóng góp của căn nhà Huế** (sai số 0.60, lớn nhất): với L1 nó chiếm 0.60 / 1.20 = **50%** tổng loss; với L2 nó chiếm 0.36 / 0.5048 = **71%**. Cùng một sai số, L2 **dồn sự chú ý** vào nó hơn.
@step
**Thêm một lần lệch:** nếu căn nhà Huế bị đoán lệch thêm 3 tỉ nữa (sai số 3.6): L1 = 4.2 (căn đó chiếm 86%) còn L2 = 13.105 (căn đó chiếm **98.9%**). L2 gần như chỉ còn nhìn thấy một căn nhà.
:::

:::slides 20-21 | Slide 20–21: L1 loss và L2 loss, đồ thị so sánh theo sai số từ −1 đến 1
:::

## Hình dạng của hai loss (slide 21)

Slide 21 vẽ L1 và L2 theo sai số. L1 là hình **chữ V** (đi lên thẳng đều); L2 là **parabol** (cong). Nhìn bảng:

| Sai số | L1 (\|e\|) | L2 (e²) |
|---|---|---|
| 0.3 | 0.3 | **0.09** (nhẹ hơn) |
| 1 | 1 | 1 (bằng nhau) |
| 3 | 3 | **9** (nặng hơn nhiều) |

Sai số **nhỏ hơn 1**: L2 phạt **nhẹ hơn** L1 (0.09 so với 0.3). Sai số **lớn hơn 1**: L2 phạt **nặng hơn** (9 so với 3). Ghi chú tay trên slide nói đúng điều đó: L1 có xu hướng phạt **đều** các sai lệch; L2 có xu hướng **tập trung vào những sai số lớn** vì chúng đóng góp nhiều nhất vào loss.

:::predict
Căn nhà thứ tư (Huế) lệch +0.6 tỉ. Nếu model cố làm **loss L2 nhỏ nhất**, nó sẽ ưu tiên sửa căn nhà nào trước, và vì sao so với khi dùng L1?
@answer
Với L2, căn nhà **Huế**: nó chiếm 71% loss, nên giảm sai số của nó cho "lời" nhiều nhất. Với L1, mỗi đơn vị sai số đóng góp như nhau, nên model quan tâm đều tới mọi căn nhà hơn. Nói cách khác, **L2 ưu tiên giảm sai số lớn trước**, còn L1 giảm sai số đều tay.
:::

Hãy tự kéo: công cụ dùng đúng bốn căn nhà của slide 19; kéo thanh trượt để căn nhà Huế bị đoán lệch thêm và xem cột phạt L1 so với L2.

:::widget loss-outlier
slide
:::

## Chọn L1 hay L2?

- **L2 nhạy với sai số lớn và với outlier:** một sai số lớn chiếm gần hết loss, nên model bị kéo mạnh về phía đó. Tốt khi sai số lớn thật sự đáng sợ; **hại khi sai số lớn chỉ là dữ liệu sai** (nhập thừa một số 0): model bị kéo lệch để chiều một điểm lỗi.
- **L1 bền hơn** với outlier vì phạt tăng đều.
- **L2 mượt** (đạo hàm liên tục), nên tối ưu thường dễ hơn; đó là lý do MSE rất phổ biến. L1 có "góc nhọn" tại 0.
- Slide dùng **tổng** (Σ), thực tế thường dùng **trung bình** (chia cho số mẫu). Chia cho một hằng số không đổi cách chọn tham số tốt nhất, chỉ đổi cỡ của con số.

:::ck
Dữ liệu giá nhà có vài căn bị nhập sai thêm số 0 (giá thật 3 tỉ ghi thành 30 tỉ). Bạn nghiêng về L1 hay L2, và bạn nên làm gì trước?
@answer
Nghiêng về **L1** (bền hơn), nhưng việc đầu tiên là **phát hiện và sửa các điểm sai** ([[bài:missing-values-outliers]]), vì L2 sẽ bị kéo mạnh bởi vài giá trị sai do phạt bình phương. Chọn loss chỉ là giảm nhẹ hậu quả; làm sạch dữ liệu mới giải quyết nguyên nhân.
:::

## Tự cài lại bằng NumPy

Chạy lại đúng bộ số giá nhà ở trên để thấy mỗi con số tự ra:

```python
import numpy as np
pred = np.array([3.45, 3.9, 2.12, 2.9])
actual = np.array([3.75, 4.12, 2.2, 2.3])
e = pred - actual
l1 = np.sum(np.abs(e))
l2 = np.sum(e ** 2)
print("L1:", l1)                       # 1.2
print("L2:", l2)                       # 0.5048
print("MAE:", l1 / len(e))             # 0.3
print("RMSE:", np.sqrt(l2 / len(e)))   # 0.3552...
delta = 0.5                            # Huber
huber = np.where(np.abs(e) <= delta, 0.5 * e**2, delta * (np.abs(e) - 0.5 * delta))
print("Huber:", huber.sum())           # 0.2474
y = np.array([1, 2, 3, 100])           # hằng số tốt nhất: L1 là median, L2 là mean
print(np.mean(y), np.median(y))        # 26.5  2.5
```

## Loss khác metric

**Loss** là con số máy dùng để **học** (cần mượt, có đạo hàm). **Metric** là con số con người dùng để **đánh giá** (cần dễ hiểu theo nghiệp vụ). Hai thứ có thể trùng (MSE vừa là loss vừa là cách báo cáo), nhưng cũng có thể khác: bài phân loại thường huấn luyện bằng một loss mượt (log loss) nhưng báo cáo accuracy, precision, recall. Loss tính trên **train** để cập nhật; ta so sánh model bằng metric trên dữ liệu **chưa thấy** ([[bài:train-test-split]], [[bài:regression-metrics]]).

## Những hiểu sai thường gặp

- **"Loss càng thấp càng tốt, bất kể ở đâu."** Loss thấp trên **train** có thể là học vẹt; chỉ loss trên dữ liệu chưa thấy mới nói lên khả năng tổng quát.
- **"L1 và L2 chỉ khác công thức."** Chúng khác về **chính sách**: đối xử với sai số lớn ra sao.
- **"Loss và metric là một."** Có thể trùng nhưng vai trò khác nhau: loss để học, metric để đánh giá.
- **"Σ hay trung bình khác nhau nhiều."** Không đổi tham số tối ưu; chỉ đổi cỡ con số, nên khi so loss giữa hai bộ dữ liệu cần dùng trung bình.

:::card Loss function
- **Loss** gói sai số của cả bảng thành một con số để máy giảm (slide 19: prediction và label vào loss).
- **L1 = Σ|e|** (LAD, MAE): trên bảng nhà = 1.20 (trung bình 0.30). **L2 = Σe²** (LS, MSE): 0.5048 (trung bình 0.1262).
- **L2 dồn vào sai số lớn** (căn Huế chiếm 71% L2 nhưng 50% L1); sai số < 1 thì L2 nhẹ hơn, > 1 thì nặng hơn.
- **L2 nhạy outlier**, L1 bền hơn; làm sạch dữ liệu sai trước khi chọn loss.
- **Loss để học; metric để đánh giá**; loss thấp trên train chưa chắc tốt.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Nếu đổi sai lệch dòng Huế từ +0.60 thành +2.0, L1 tăng thêm đúng bao nhiêu? L2 thì tăng bằng phần chênh lệch hay nhiều hơn?
A: L1 tăng đúng **1.40** (mới = 1.20 − 0.60 + 2.0 = 2.60), vì cộng thẳng vào tổng. L2 tăng **nhiều hơn** phần chênh: 0.60² = 0.36 → 2.0² = 4.0, tăng 3.64 (mới = 4.1448). Đầu vào chỉ gấp ~3.3 lần nhưng phần đóng góp vào L2 gấp hơn 10 lần.
Q: Một model có tổng L2 = 18 trên 6 mẫu. Tính MSE và RMSE.
A: MSE = 18 / 6 = **3**; RMSE = √3 ≈ **1.732**. RMSE cùng đơn vị với label nên dễ diễn giải hơn MSE.
Q: Trong ví dụ, dòng Huế đóng góp bao nhiêu % vào L1 và vào L2? Con số nói lên điều gì?
A: L1: 0.60/1.20 = 50%. L2: 0.36/0.5048 ≈ 71%. Một điểm sai nặng chi phối L2 mạnh hơn nhiều so với L1 — đó chính là nghĩa của "L2 nhạy với outlier".
Q: Với y = [1, 2, 3, 100], dự đoán một hằng số duy nhất. Hằng số nào làm L2 nhỏ nhất, hằng số nào làm L1 nhỏ nhất?
A: L2 nhỏ nhất tại **mean = 26.5** (tổng L2 = 7205); L1 nhỏ nhất tại **median** (bất kỳ giá trị trong [2, 3], vd 2.5 cho L1 = 100). Mean bị giá trị 100 kéo đi xa, median thì không → L1 "bền" hơn.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Giải thích loss function cho một người chưa biết ML, trong 30 giây.
A: Loss là con số cho biết model đang đoán sai bao nhiêu so với đáp án thật. Giống điểm số bài kiểm tra: model làm bài, ta chấm điểm sai, rồi model dựa vào đó sửa cách làm. Huấn luyện chính là lặp lại "đoán → chấm → sửa" cho tới khi loss đủ nhỏ.
EN: A loss function is a number telling the model how far its predictions are from the truth. Training is repeatedly predicting, measuring that error, and adjusting parameters to reduce it.
Q: **B2.** Loss khác metric ở chỗ nào? Cho ví dụ loss và metric không trùng nhau.
A: **Loss/objective hướng dẫn học, metric đánh giá kết quả theo mục tiêu.** Yêu cầu đạo hàm phụ thuộc thuật toán tối ưu: dùng gradient cần xử lý đạo hàm/subgradient phù hợp, còn [[bài:decision-tree]] chọn split bằng giảm impurity mà không dùng gradient. Ví dụ classifier có thể tối ưu cross-entropy nhưng báo cáo accuracy/F1; không kết luận mọi loss đều bắt buộc khả vi.
EN: The loss or objective guides learning, while metrics assess outcomes. Differentiability requirements depend on the optimizer: gradient methods need appropriate derivatives or subgradients, whereas trees select impurity-reducing splits without gradients. A classifier may optimize cross-entropy and report accuracy or F1.
Q: **B3.** Vì sao L2 nhạy với outlier còn L1 thì không? Nêu cả lý do toán lẫn trực giác.
A: Toán: L2 bình phương sai lệch nên sai lệch lớn gấp k lần thì đóng góp gấp k² lần; L1 chỉ gấp k lần. Trực giác: model muốn giảm tổng loss, nên với L2 nó "đổi" rất nhiều sai nhỏ để bớt một sai lớn → bị outlier kéo đường dự đoán lệch. Thêm góc nhìn thống kê: tối ưu L2 ra **mean**, tối ưu L1 ra **median**; mean nhạy outlier, median thì không.
EN: Squaring makes the penalty grow quadratically, so a single large residual dominates. Statistically, minimizing L2 yields the mean while L1 yields the median, which is robust.
Q: **B4.** Vì sao L2 hay được dùng khi huấn luyện dù nhạy outlier? Huber loss giải quyết gì?
A: L2 khả vi mọi nơi và đạo hàm tỉ lệ với sai lệch nên gradient descent hội tụ êm gần đáy; L1 có đạo hàm ±1 và không xác định tại 0 nên dễ dao động. Huber ghép hai ưu điểm: bình phương khi sai nhỏ (trơn), tuyến tính khi sai lớn (bền outlier), điều chỉnh bằng ngưỡng δ.
EN: L2 is smooth with a gradient proportional to the error, giving stable convergence. Huber is quadratic for small errors and linear for large ones, combining smoothness with robustness.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Bạn làm model dự đoán giá nhà cho một sàn bất động sản. Dữ liệu có vài căn bị nhập sai giá (thêm số 0). Chọn L1 hay L2? Bạn xử lý thế nào?
A: Không chọn L2 thuần vì vài điểm nhập sai sẽ kéo cả model lệch. Thứ tự hợp lý: (1) kiểm tra và làm sạch outlier rõ ràng là lỗi nhập liệu (xem bài [[bài:missing-values-outliers]]); (2) với những điểm còn nghi ngờ, dùng L1 hoặc Huber để giảm ảnh hưởng; (3) đánh giá bằng cả MAE và RMSE — nếu RMSE lớn hơn MAE nhiều nghĩa là vẫn còn vài sai số rất lớn.
WANT: Bạn phân biệt được "outlier là lỗi" (nên sửa dữ liệu) với "outlier là thật nhưng hiếm" (nên chọn loss bền), thay vì phản xạ "đổi sang L1" ngay.
Q: **C2.** Model dự đoán thời gian giao hàng. Đến sớm 10 phút chỉ làm khách hơi thích, nhưng trễ 10 phút làm khách hủy đơn. L1 hay L2 có phản ánh được điều này không?
A: Không. Cả L1 và L2 đều **đối xứng**: sớm và trễ cùng độ lớn bị phạt như nhau. Khi chi phí thực tế bất đối xứng, ta tự thiết kế loss: phạt trễ nặng hơn sớm (ví dụ quantile / pinball loss hoặc nhân trọng số cho sai số dương). Điểm mấu chốt: **loss phải phản ánh chi phí kinh doanh**, không phải mặc định.
WANT: Bạn hiểu loss là nơi mã hóa mục tiêu kinh doanh, và biết rằng có thể tùy biến loss thay vì chỉ dùng MSE/MAE có sẵn.
Q: **C3.** Train loss giảm đều nhưng chất lượng model ngoài thực tế tệ. Bạn nghĩ tới những nguyên nhân nào?
A: (1) Overfitting: loss chỉ giảm trên train — cần theo dõi loss trên validation/test (bài [[bài:train-test-split]]); (2) loss không khớp metric kinh doanh (tối ưu MSE nhưng khách quan tâm sai số lớn nhất); (3) dữ liệu train khác phân phối dữ liệu thật; (4) rò rỉ dữ liệu làm loss train đẹp giả tạo.
WANT: Bạn có checklist chẩn đoán có hệ thống, bắt đầu từ việc so sánh train với validation chứ không chỉ nhìn một đường loss.
:::

## Nối sang bài sau

:::next
Loss mới chỉ **đo** sai số trên dữ liệu model đã thấy. Muốn biết model đoán tốt trên dữ liệu **chưa thấy** thì phải chia dữ liệu cẩn thận — đó là nội dung của [[bài:train-test-split]].
:::
