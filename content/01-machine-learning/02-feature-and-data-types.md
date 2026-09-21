---
title: Dataset, Feature và các loại dữ liệu
order: 2
---

## 1. Ý tưởng

Dataset (bộ dữ liệu) trong ML thường ở dạng bảng — gọi là **tabular
data**/**structured data**. Mỗi dòng trong bảng là 1 **sample** (mẫu), mỗi
cột là 1 **feature** (thuộc tính) — thông tin mô tả sample đó, dùng làm đầu
vào cho model.

> **EN:** A dataset in ML is usually shaped like a table — called
> **tabular data**/**structured data**. Each row is a **sample**, and each
> column is a **feature** — a piece of information describing that sample,
> used as input to the model.

## 2. Vị trí trong bức tranh lớn

Trước khi đưa dữ liệu vào model, cần hiểu rõ **từng feature thuộc loại
gì** — vì cách xử lý (tiền xử lý, mã hóa/encode) sẽ khác nhau tùy loại
feature. Phân loại sai ngay từ đầu dễ dẫn tới xử lý sai ở các bước sau.

> **EN:** Before feeding data into a model, you need to know **what type
> each feature is** — because preprocessing and encoding differ by feature
> type. Misclassifying a feature early on tends to cause mistakes in every
> step that follows.

## 3. Cách phân loại feature

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

## 4. Ví dụ tay

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

## 5. Code

```python
import pandas as pd

df = pd.read_csv("adult.csv")
print(df.dtypes)                     # kiểu dữ liệu pandas tự suy ra
print(df["education"].unique())      # các giá trị duy nhất của 1 cột categorical
```

> **EN:** Reads the dataset and inspects pandas' inferred dtypes, then
> lists the unique values of one categorical column — the first sanity
> check before deciding how to encode each feature.

## 6. Câu hỏi tự kiểm tra

**Câu 1:** Cột `hours.per.week` (số giờ làm việc/tuần) thuộc Numerical hay
Categorical? Nếu là Numerical thì Integer hay Float?
> **Đáp án:** Numerical, Integer — số giờ làm việc/tuần thường được ghi
> nhận theo số nguyên (VD: 40, 45), và phép cộng/trừ giữa các giá trị này
> có ý nghĩa toán học thật sự.

**Câu 2:** Một cột "mã bưu điện" (zip code) chứa toàn chữ số — nó có nên
được coi là Numerical feature không? Vì sao?
> **Đáp án:** Không nên. Dù toàn chữ số, mã bưu điện không có quan hệ
> thứ bậc/toán học — cộng hoặc trừ hai mã bưu điện không có ý nghĩa gì.
> Đây là trường hợp ngoại lệ: về hình thức là số nhưng bản chất là
> Categorical (Nominal).

> **EN:**
>
> **Q1:** Is `hours.per.week` Numerical or Categorical? If Numerical, is
> it Integer or Float?
> > **A:** Numerical, Integer — weekly working hours are typically
> > recorded as whole numbers (e.g. 40, 45), and adding/subtracting these
> > values has real arithmetic meaning.
>
> **Q2:** A "zip code" column contains only digits — should it be treated
> as a Numerical feature? Why or why not?
> > **A:** No. Despite being all digits, zip codes have no
> > order/arithmetic relationship — adding or subtracting two zip codes
> > is meaningless. This is the exception case: numeric in form but
> > Categorical (Nominal) in nature.
