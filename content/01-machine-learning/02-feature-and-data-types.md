---
title: Dataset, Feature và các loại dữ liệu
order: 2
description: "Mỗi cột là loại thông tin gì: số đo, nhóm hay mã định danh, và vì sao dtype không nói hết bản chất."
slides: 7-8
needs: [what-is-ml]
tags: [dataset, feature, numerical, categorical, ordinal, nominal]
---

## Mỗi cột trong bảng là loại thông tin gì?

:::intro Mục tiêu bài này
- Đọc một bảng dữ liệu như model đọc: hàng là **mẫu**, cột là **feature**.
- Phân biệt **số đo**, **mã định danh** và **nhóm (categorical)**, kể cả khi kiểu lưu trữ đánh lừa.
- Biết loại cột quyết định ta được làm gì với nó (tính trung bình, scale, mã hóa).
:::

Một **dataset** là một bảng: mỗi **hàng** là một mẫu (một bệnh nhân, một email), mỗi **cột** là một **feature** (một thông tin mô tả mẫu đó). Với bộ Diabetes: 768 hàng, 8 cột feature và 1 cột nhãn. Model không "hiểu" chữ nghĩa của tên cột; nó chỉ thấy các con số. Vì vậy **ta** phải biết mỗi cột thật sự là gì trước khi quyết định xử lý.

:::predict
Bảng có hai cột kiểu số nguyên: `Age` (tuổi) và `PatientID` (mã bệnh nhân, từ 1 đến 768). Tính trung bình của từng cột có ý nghĩa không?
@answer
**Trung bình `Age` có ý nghĩa** (tuổi trung bình của nhóm). **Trung bình `PatientID` vô nghĩa**: mã chỉ để phân biệt người này với người kia, số 400 không "lớn gấp đôi" số 200. Cả hai đều là số nguyên, nhưng một cái là **số đo**, một cái là **mã định danh**.
:::

## Ba loại cột quan trọng nhất

| Loại | Ví dụ | Phép tính có nghĩa | Cách xử lý thường gặp |
|---|---|---|---|
| **Số đo** (numerical) | Age, Glucose, BMI | cộng, trừ, trung bình, so lớn nhỏ | scale ([[bài:feature-scaling]]) |
| **Nhóm có thứ tự** (ordinal) | cỡ áo S, M, L; mức độ hài lòng 1 đến 5 | so lớn nhỏ, nhưng khoảng cách chưa chắc đều | mã hóa theo thứ tự |
| **Nhóm không thứ tự** (nominal) | màu sắc, thành phố | chỉ "giống" hay "khác" | one-hot ([[bài:categorical-encoding]]) |
| **Mã định danh** | PatientID, số điện thoại | chỉ để nhận diện | thường **bỏ** khỏi feature |

Câu hỏi cốt lõi cho từng cột: *các phép tính (cộng, trung bình, so sánh) trên nó có nghĩa không?* Nếu không, đừng đưa vào model như một con số thường.

:::ck
Cột `ZipCode` (mã vùng) được pandas đọc thành `int64`. Nó là loại cột nào, và nên làm gì?
@answer
Là **nhóm không thứ tự (hoặc mã định danh)**, dù pandas lưu bằng số. Mã vùng 70000 không "lớn hơn" 10000 theo nghĩa nào có ích. Cách làm: mã hóa như categorical (one-hot nếu số vùng ít), hoặc bỏ nếu chỉ là mã. `dtype` cho biết cách **lưu**, không cho biết bản chất **ý nghĩa**.
:::

## Kiểm tra bằng pandas, nhưng đừng tin mỗi `dtype`

```python
data.dtypes           # kiểu lưu của từng cột
data.describe()       # thống kê cột số
data["Outcome"].value_counts()   # đếm giá trị của cột nhóm
```

Ba bẫy hay gặp: (1) mã định danh lưu bằng số; (2) nhóm lưu bằng số (ví dụ 0/1 cho giới tính); (3) số lưu bằng chữ (ví dụ "1,200" hoặc "N/A") nên bị đọc thành `object`. Luôn đọc tên cột, nhìn vài giá trị, rồi mới kết luận. Bước tiếp theo, tách cột đáp án khỏi bảng, nằm ở [[bài:labeled-data]].

:::slides 7-8 | Slide 7–8: dataset, feature và các loại dữ liệu
:::

:::card Dataset và feature
- **Hàng = mẫu, cột = feature**; model chỉ thấy các con số.
- **Số đo**: cộng, trừ, trung bình có nghĩa. **Nhóm**: chỉ giống hay khác (ordinal có thêm thứ tự). **Mã định danh**: chỉ để nhận diện, thường bỏ.
- Hỏi mỗi cột: *các phép tính trên nó có nghĩa không?*
- **`dtype` chỉ cho biết cách lưu**, không cho biết ý nghĩa: `ZipCode` là `int64` nhưng là nhóm.
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
