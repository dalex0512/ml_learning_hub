---
title: Dataset, Feature và các loại dữ liệu
order: 2
description: "Đọc bảng dữ liệu như model: mẫu và feature (slide 7), numerical và categorical (slide 8), mã định danh, và vì sao dtype không nói hết bản chất của cột."
slides: 7-8
needs: [what-is-ml]
tags: [dataset, feature, numerical, categorical, ordinal, nominal]
---

## Một bảng dữ liệu nói gì với model?

:::intro Mục tiêu bài này
- Chỉ đúng **mẫu (sample)** và **feature** trong một bảng, cả Adult dataset (slide 7) lẫn Diabetes.
- Phân loại feature theo slide 8: **numerical** (integer, float) và **categorical** (nominal, ordinal, boolean), thêm loại **mã định danh**.
- Hiểu vì sao `dtype` của pandas **không** quyết định bản chất của một cột.
:::

Trong ML, dữ liệu thường ở dạng bảng (gọi là **tabular data** hay structured data). Mỗi **hàng** là một **mẫu (sample)**: một người, một email, một giao dịch. Mỗi **cột** là một **[[từ:feature|feature]]**: một thông tin mô tả mẫu đó, dùng làm đầu vào cho model. Slide 7 dùng **Adult dataset**: mỗi hàng là một người, các cột là `age`, `workclass`, `education`, `marital-status`, `occupation`, `capital-gain`, `hours-per-week`, `native-country`... và cột cuối `income`. Bộ Diabetes của Project có 768 hàng và 9 cột (8 feature và 1 nhãn).

:::slides 7 | Slide 7: Adult dataset, mỗi hàng một mẫu, mỗi cột một feature
:::

Model **không hiểu chữ nghĩa của tên cột**: nó chỉ thấy các con số. Vì vậy chính ta phải biết mỗi cột thật sự là gì **trước khi** xử lý, vì cách xử lý phụ thuộc loại cột.

## Hai họ lớn, năm loại cụ thể

Slide 8 chia feature thành hai họ:

| Họ | Loại | Ví dụ trên slide |
|---|---|---|
| **Numerical** (số) | **Integer** (số nguyên) | 1, 2, 3, −2, −1, 0, 1, 2 |
| | **Float** (số thực) | 0.1, 0.2, 0.3 |
| **Categorical** (phân loại) | **Nominal** (định danh): giá trị khác nhau, không có thứ tự | Red, green, blue; US, Vietnam, Thailand |
| | **Ordinal** (thứ bậc): có thứ tự | Happy, normal, sad; XS, S, M, L, XL |
| | **Boolean** (logic) | True, False; Yes, No |

Thêm một loại mà slide không tách riêng nhưng rất hay gặp: **mã định danh** (ID), ví dụ `PatientID` hay số điện thoại: số nguyên nhưng chỉ để **nhận diện**.

:::slides 8 | Slide 8: các loại feature, numerical và categorical
:::

:::predict
Bảng có hai cột kiểu số nguyên: `Age` (tuổi) và `PatientID` (mã bệnh nhân từ 1 đến 768). Tính **trung bình** của từng cột có ý nghĩa không?
@answer
**Trung bình `Age` có ý nghĩa** (tuổi trung bình của nhóm). **Trung bình `PatientID` vô nghĩa**: mã chỉ để phân biệt người này với người kia; người số 400 không "lớn gấp đôi" người số 200. Cả hai đều là số nguyên, nhưng một cái là **số đo**, một cái là **mã định danh**.
:::

## Câu hỏi để phân loại: phép tính trên cột có nghĩa không?

Thay vì nhớ danh sách, hãy hỏi một câu duy nhất cho mỗi cột: *các phép tính (cộng, trừ, trung bình, so lớn nhỏ) trên nó có nghĩa không?*

| Loại | Phép có nghĩa | Phép **không** có nghĩa |
|---|---|---|
| Số đo | cộng, trừ, trung bình, so lớn nhỏ, tỉ lệ | |
| Ordinal | so lớn nhỏ, xếp hạng | cộng trừ (khoảng cách giữa bậc chưa chắc đều) |
| Nominal | so bằng nhau hay khác nhau | so lớn nhỏ, trung bình |
| Boolean | đúng hay sai, đếm | trung bình theo nghĩa đo lường |
| Mã định danh | nhận diện duy nhất | mọi phép tính số học |

Hãy thử phân loại tám cột bên dưới (bảy cột của Adult và một cột mã); mỗi lựa chọn có phản hồi và lý do.

:::widget column-peel
:::

## `dtype` chỉ cho biết cách lưu

Pandas cho biết kiểu **lưu** của mỗi cột bằng `data.dtypes`. Với Diabetes: 7 cột là `int64` (Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, Age, **Outcome**) và 2 cột là `float64` (BMI, DiabetesPedigreeFunction). Chú ý `Outcome` là `int64` nhưng bản chất là **nhãn boolean** (có hay không có bệnh), không phải số đo. Còn `Pregnancies` là số nguyên đếm và hoàn toàn là số đo.

Ba bẫy hay gặp:

1. **Mã định danh lưu bằng số** (`PatientID`, `ZipCode`): pandas đọc thành `int64` nhưng không phải số đo.
2. **Nhóm lưu bằng số** (0/1 cho giới tính, 1 đến 5 cho cung chòm sao): số lưu, bản chất nhóm.
3. **Số lưu bằng chữ** ("1,200", "N/A") nên bị đọc thành `object`.

Luôn đọc tên cột, nhìn vài giá trị, hỏi người hiểu lĩnh vực, rồi mới kết luận.

:::ck
Cột `education-num` trong Adult có giá trị 9, 13, 14 (là mã số của các bậc học). Nó là số đo hay ordinal? Tính trung bình cột này có đáng tin không?
@answer
Bản chất là **ordinal** (bậc học đã được mã hóa thành số). Trung bình 11.5 không có ý nghĩa rõ ràng vì khoảng cách giữa 9 và 13 (từ HS-grad lên Bachelors) chưa chắc bằng khoảng cách giữa 13 và 17. Slide ghi chú đúng ý này: categorical có thể **số hóa sau này** để xử lý, nhưng số hóa không biến nó thành số đo.
:::

## Loại cột quyết định cách xử lý

Phân loại đúng ngay từ đầu giúp tránh sai ở mọi bước sau:

| Loại | Xử lý thường gặp | Bài |
|---|---|---|
| Số đo | scale; điền thiếu bằng median | [[bài:feature-scaling]], [[bài:missing-values-outliers]] |
| Nominal | one-hot (không đánh số thẳng) | [[bài:categorical-encoding]] |
| Ordinal | ordinal encoding theo thứ tự | [[bài:categorical-encoding]] |
| Boolean | 0/1 | |
| Mã định danh | thường **bỏ** khỏi feature | [[bài:labeled-data]] |

## Những hiểu sai thường gặp

- **"Cột là số thì là số đo."** Sai: `PatientID`, `ZipCode`, `education-num` đều là số mà không phải số đo.
- **"Ordinal thì khoảng cách đều."** Không chắc: từ "ít hài lòng" lên "bình thường" có thật sự bằng từ "bình thường" lên "rất hài lòng" không?
- **"Một cột có hai giá trị thì mã hóa gì cũng được."** Với boolean thật sự thì 0/1 ổn; nhưng một cột hai nhóm trong đó nhóm có ý nghĩa riêng (ví dụ nam, nữ) vẫn phải nhớ đây là nhóm chứ không phải "lớn hơn".
- **"Bỏ qua việc phân loại, cứ đưa hết vào model."** Model sẽ coi mã định danh như một số đo và tìm quy luật giả.

:::card Dataset và feature
- **Hàng = mẫu, cột = feature**; model chỉ thấy các con số.
- **Slide 8:** Numerical (integer, float); Categorical (nominal, ordinal, boolean); thêm **mã định danh**.
- **Câu hỏi cho mỗi cột:** các phép tính trên nó có nghĩa không?
- **`dtype` chỉ cho biết cách lưu:** `Outcome` là `int64` nhưng là nhãn; `education-num` là số nhưng là bậc học; `PatientID` là số nhưng là mã.
- **Loại cột quyết định xử lý:** số đo thì scale; nominal thì one-hot; ordinal thì encode theo thứ tự; mã thì bỏ.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Cột `hours.per.week` (số giờ làm việc/tuần) thuộc Numerical hay
Categorical? Nếu là Numerical thì Integer hay Float?
A: Numerical, Integer — số giờ làm việc/tuần thường được ghi
nhận theo số nguyên (VD: 40, 45), và phép cộng/trừ giữa các giá trị này
có ý nghĩa toán học thật sự.
EN: Is `hours.per.week` Numerical or Categorical? If Numerical, is
it Integer or Float?
**A:** Numerical, Integer — weekly working hours are typically
> recorded as whole numbers (e.g. 40, 45), and adding/subtracting these
> values has real arithmetic meaning.

Q: Một cột "mã bưu điện" (zip code) chứa toàn chữ số — nó có nên
được coi là Numerical feature không? Vì sao?
A: Không nên. Dù toàn chữ số, mã bưu điện không có quan hệ
thứ bậc/toán học — cộng hoặc trừ hai mã bưu điện không có ý nghĩa gì.
Đây là trường hợp ngoại lệ: về hình thức là số nhưng bản chất là
Categorical (Nominal).
EN: A "zip code" column contains only digits — should it be treated
as a Numerical feature? Why or why not?
**A:** No. Despite being all digits, zip codes have no
> order/arithmetic relationship — adding or subtracting two zip codes
> is meaningless. This is the exception case: numeric in form but
> Categorical (Nominal) in nature.
Q: XS, S, M, L, XL thuộc loại nào?
A: Categorical ordinal vì có thứ tự kích cỡ. Khoảng cách giữa các size không tự động là một đơn vị số đo.
Q: Cột chứa 0/1 luôn là numerical đúng không?
A: Không. Nếu mã hóa có/không thì đó là biến nhị phân categorical. Cần đọc định nghĩa cột, không chỉ dtype.
@tier B | Phỏng vấn lý thuyết
Q: Nominal khác ordinal ra sao?
A: Nominal chỉ phân biệt nhóm, như màu sắc. Ordinal có thứ tự có nghĩa, như mức hài lòng. Gán mã số cho nominal có thể tạo thứ tự giả; ordinal cũng không đảm bảo các khoảng cách bằng nhau.
EN: Nominal categories have no intrinsic order; ordinal categories do, but their spacing need not be equal.
Q: Vì sao dtype integer chưa đủ để chọn cách xử lý?
A: Integer là cách lưu trữ. Mã khách hàng là định danh, còn tuổi là đại lượng. Cùng dtype nhưng cách mã hóa và so sánh khác nhau.
EN: A storage dtype is not a semantic type. Customer IDs and ages can both be integers but require different treatment.
Q: Feature khác sample thế nào?
A: Sample là một đối tượng quan sát ở một đơn vị phân tích cụ thể; feature là thuộc tính đo trên đối tượng đó. Trong bảng khách hàng, mỗi dòng có thể là một khách và cột tuổi là một feature.
EN: A sample is an observation; a feature is an input attribute measured for that observation.
Q: Chọn sai loại feature gây hậu quả gì?
A: Dùng mã bưu điện như số đo tạo khoảng cách không có ý nghĩa; coi số đo liên tục là nhóm có thể làm mất cấu trúc. Cần dựa vào nghĩa nghiệp vụ rồi kiểm tra cách encoding/scaling phù hợp.
EN: Incorrect feature typing can introduce artificial distances or discard useful numeric structure.
@tier C | Tình huống doanh nghiệp
Q: Công ty đưa mã bưu điện vào model khoảng cách như một số nguyên. Bạn sửa thế nào?
A: Xác nhận mã là định danh vùng, kiểm tra số 0 đầu và giá trị thiếu, rồi giữ mã dạng category. Thử encoding phù hợp hoặc bổ sung tọa độ nếu mục tiêu cần khoảng cách địa lý. So sánh trên cùng split; one-hot có thể rất rộng khi nhiều mã *(bổ sung)*.
WANT: Nhận ra khoảng cách giữa mã không phải khoảng cách địa lý.
Q: ID khách hàng dự đoán tốt bất ngờ. Có giữ không?
A: Kiểm tra ID có mã hóa thời gian, nhóm nguồn hay vô tình trùng khách giữa train/test. Đánh giá theo khách mới và thời gian thật; cân nhắc bỏ ID và dùng thuộc tính có ý nghĩa. ID có thể giúp ghi nhớ khách cũ nhưng không tổng quát cho khách mới *(bổ sung)*.
WANT: Biết kiểm tra tín hiệu thật, ghi nhớ định danh và rò rỉ dữ liệu.
Q: Cột mức hài lòng được mã hóa bằng số. Quản lý muốn lấy trung bình rồi kết luận. Bạn làm gì?
A: Đọc định nghĩa thang mức và thứ tự, kiểm tra phân bố từng mức trước. Trung bình ngầm giả định khoảng cách giữa mức tương đương; nên báo cáo thêm tỷ lệ theo mức hoặc median. Chọn cách báo cáo theo ý nghĩa nghiệp vụ, ghi rõ giả định *(bổ sung)*.
WANT: Phân biệt thứ tự với khoảng cách định lượng.
:::

## Nối sang bài sau

:::next
Biết loại feature mới là hiểu đầu vào. [[bài:learning-paradigms]] đi tiếp: model sẽ học từ nhãn, cấu trúc dữ liệu hay phản hồi của môi trường?
:::

## [sâu] Phần mở đầu gốc

:::intro Đọc xong bài này bạn làm được
- Chỉ đúng sample và feature trong Adult dataset.
- Phân biệt nominal, ordinal, boolean và numerical.
- Giải thích vì sao mã số không nhất thiết là đại lượng số.
:::

Nền để đọc bài này: [[bài:what-is-ml]].

:::slides 7-8 | Slide gốc — Dataset, Feature và các loại dữ liệu
:::

Dataset (bộ dữ liệu) trong ML thường ở dạng bảng — gọi là **tabular
data**/**structured data**. Mỗi dòng trong bảng là 1 **sample** (mẫu), mỗi
cột là 1 **feature** (thuộc tính) — thông tin mô tả sample đó, dùng làm đầu
vào cho model.

> **EN:** A dataset in ML is usually shaped like a table — called
> **tabular data**/**structured data**. Each row is a **sample**, and each
> column is a **feature** — a piece of information describing that sample,
> used as input to the model.

## [sâu] Vì sao phải hiểu feature trước khi xử lý?

Trước khi đưa dữ liệu vào model, cần hiểu rõ **từng feature thuộc loại
gì** — vì cách xử lý (tiền xử lý, mã hóa/encode) sẽ khác nhau tùy loại
feature. Phân loại sai ngay từ đầu dễ dẫn tới xử lý sai ở các bước sau.

> **EN:** Before feeding data into a model, you need to know **what type
> each feature is** — because preprocessing and encoding differ by feature
> type. Misclassifying a feature early on tends to cause mistakes in every
> step that follows.

## [sâu] Số đo hay mã định danh?

**Numerical (số):**
- Integer (số nguyên): `1, 2, 3` hoặc `-2, -1, 0, 1, 2`
- Float (số thực): `0.1, 0.2, 0.3`

**Categorical (phân loại)** — có hữu hạn các giá trị khác nhau, rời rạc:
- Nominal (định danh): các giá trị bình đẳng về ý nghĩa, không có thứ bậc.
  VD: `red, green, blue`; `US, Vietnam, Thailand`
- Ordinal (thứ bậc): các giá trị có liên quan thứ tự với nhau về mặt thứ
  bậc. VD: `happy, normal, sad`; `XS, S, M, L, XL`
- Boolean (logic): `True/False`, `Yes/No`

**Lưu ý quan trọng:** có trường hợp ngoại lệ — 1 cột trông giống numerical
feature (toàn số) nhưng thực chất là categorical. Cách phân biệt: xem các
giá trị này **có quan hệ thứ bậc/ý nghĩa toán học hay không**. Ví dụ mã số
xe là số, nhưng cộng/trừ hai mã số xe không có ý nghĩa gì — nên nó vẫn là
categorical (nominal), dù đã được số hóa.

> **EN:**
>
> **Numerical:**
> - Integer: `1, 2, 3` or `-2, -1, 0, 1, 2`
> - Float: `0.1, 0.2, 0.3`
>
> **Categorical** — a finite set of distinct, discrete values:
> - Nominal: values are equal in meaning, with no inherent order.
>   E.g. `red, green, blue`; `US, Vietnam, Thailand`
> - Ordinal: values have a meaningful order/ranking relative to each other.
>   E.g. `happy, normal, sad`; `XS, S, M, L, XL`
> - Boolean: `True/False`, `Yes/No`
>
> **Important edge case:** a column can look numerical (all digits) but
> actually be categorical. The test is whether the values have a
> meaningful order/arithmetic relationship. A vehicle ID number is
> numeric, but adding or subtracting two IDs is meaningless — so it stays
> categorical (nominal) even though it's been digitized.

## [sâu] Đọc các cột của Adult dataset

:::worked Ví dụ và số liệu đối chiếu
Trong bộ dữ liệu **Adult dataset**:
- `age` → Numerical, Integer
- `education` → Categorical, Ordinal (có thứ bậc: HS-grad < Some-college <
  Bachelors < Masters < Doctorate)
- `sex` → Categorical, Nominal (không có thứ bậc giữa Male/Female)
- `income` (`<=50K` / `>50K`) → Categorical, có thể coi là Ordinal (có thứ
  bậc thấp/cao) hoặc Boolean tùy cách đặt bài toán

> **EN:** In the **Adult dataset**:
> - `age` → Numerical, Integer
> - `education` → Categorical, Ordinal (ranked: HS-grad < Some-college <
>   Bachelors < Masters < Doctorate)
> - `sex` → Categorical, Nominal (no ranking between Male/Female)
> - `income` (`<=50K` / `>50K`) → Categorical — arguably Ordinal (low/high
>   ranking) or Boolean depending on how the problem is framed
:::

## [sâu] Kiểm tra dtype và giá trị bằng pandas

```python
import pandas as pd

df = pd.read_csv("adult.csv")
print(df.dtypes)                     # kiểu dữ liệu pandas tự suy ra
print(df["education"].unique())      # các giá trị duy nhất của 1 cột categorical
```

> **EN:** Reads the dataset and inspects pandas' inferred dtypes, then
> lists the unique values of one categorical column — the first sanity
> check before deciding how to encode each feature.

## [sâu] Dtype chưa phải bản chất feature (bổ sung)

:::pitfall ID và thứ tự giả
Cột mã khách hàng lưu dạng integer vẫn có thể là nominal. Không tự suy ra khoảng cách hay xếp hạng từ mã. Ordinal có thứ tự nhưng khoảng cách giữa các mức chưa chắc bằng nhau; xem [[bài:categorical-encoding]] trước khi đưa mã số vào model.
:::

> **EN:** Storage dtype does not determine feature semantics. An ordinal variable has an order, but not necessarily equal spacing between levels.
