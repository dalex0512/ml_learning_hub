---
title: Step 3.3 — Mã hóa categorical features (Ordinal, One-hot, Hash, Embedding)
order: 19
description: "Giữ đúng nghĩa khi chuyển category thành số: ordinal, one-hot, hash và embedding, cùng category mới và giới hạn khi cardinality cao."
slides: 48-49
needs: [feature-and-data-types, feature-scaling]
tags: [encoding, one-hot, ordinal, hash, embedding, cardinality]
---

## Đổi chữ thành số sao cho đúng nghĩa?

:::intro Đọc xong bài này bạn làm được
- Đọc output OrdinalEncoder theo thứ tự khai báo.
- So sánh one-hot, hashing và embedding theo bộ nhớ và thông tin.
- Thiết kế cách xử lý category mới khi serving.
:::

Nền để đọc bài này: [[bài:feature-and-data-types]], [[bài:feature-scaling]].

:::slides 48-49 | Slide gốc — Step 3.3 — Mã hóa categorical features (Ordinal, One-hot, Hash, Embedding)
:::

Model chỉ làm toán được trên **số**. Nhưng rất nhiều dữ liệu thật là
**chữ**: size áo "S, M, L", màu "Red, Blue", quốc gia "USA, Korea", học lực
"Khá, Giỏi"… **Encoding** (mã hóa) là việc đổi các giá trị chữ (category)
thành số — phần thứ hai của bước **03 Data Transformation**.

Cái khó là **đổi thế nào cho đúng nghĩa**. Bài 02 đã chia dữ liệu
categorical thành hai loại, và mỗi loại cần một cách mã hóa riêng:

- **Ordinal** — các giá trị có **thứ tự**: XS < S < M < L < XL. Mã hóa phải
  **giữ thứ tự** đó → [[slide:48]]: **OrdinalEncoder**.
- **Nominal** — các giá trị **không có thứ tự**: Red, Green, Blue không cái
  nào "lớn hơn" cái nào. Mã hóa **không được bịa ra thứ tự** → [[slide:49]]: ba
  cách **One-hot encoding**, **Hash encoding**, **Word embedding**.

> **EN:** Models compute only on **numbers**, yet much real data is text:
> sizes, colours, countries, grades. **Encoding** converts categories to
> numbers — the second half of step **03 Data Transformation**. The hard
> part is preserving meaning. Lesson 02's two categorical types need
> different encoders: **ordinal** values have an order (XS < … < XL) that
> must be kept — **OrdinalEncoder** ([[slide:48]]); **nominal** values have no
> order, which must not be invented — **one-hot**, **hash encoding** and
> **word embedding** ([[slide:49]]).

## Encoding nối vào pipeline thế nào?

```
3.1 Missing → 3.2 Outliers → [ 3.3 Transformation: Scaling (bài 18) + Encoding (bài này) ] → 3.4 Correlation → 3.5 Balance
```

- Bài 02 — các loại dữ liệu: Numerical (discrete / continuous) và
  Categorical (Nominal / Ordinal / Boolean). Bài này là "phần thực hành"
  của bảng phân loại đó.
- Bài 16 — `data.dtypes`: cột có dtype `object` là dấu hiệu cần encoding.
  Diabetes dataset toàn số nên không cần; Titanic ([[bài:missing-values-outliers]]) có `Sex`,
  `Embarked` là chữ → cần.
- Bài 04 — feature vector: sau encoding, một cột chữ có thể biến thành
  **nhiều** cột số (one-hot), làm feature vector dài thêm.
- Như scaler ([[bài:feature-scaling]]), encoder cũng **fit trên train** (học danh sách
  category) rồi transform test.

> **EN:** This lesson puts lesson 02's taxonomy (numerical vs nominal /
> ordinal / boolean categorical) into practice. An `object` dtype (lesson
> 16) signals encoding is needed — Diabetes is all numeric, Titanic has
> `Sex` and `Embarked`. One-hot can turn one column into several,
> lengthening the feature vector (lesson 04). Like scalers, encoders are
> **fitted on the training set** (they learn the category list).

## Từng cách mã hóa và giới hạn

## OrdinalEncoder cho ordinal features ([[slide:48]])

Code trên slide, viết lại:

```python
from pandas import DataFrame
from sklearn.preprocessing import OrdinalEncoder

before = DataFrame(["XL", "L", "S", "M", "XS", "XS", "L", "M"])
values = ["XS", "S", "M", "L", "XL"]
scaler = OrdinalEncoder(categories=[values])
after = scaler.fit_transform(before)
for b, a in zip(before.values, after):
    print("Before: {}. After: {}".format(b, a))
```

Output (khớp ảnh slide):

| Before | After |
|---|---|
| 'XL' | 4. |
| 'L' | 3. |
| 'S' | 1. |
| 'M' | 2. |
| 'XS' | 0. |
| 'XS' | 0. |
| 'L' | 3. |
| 'M' | 2. |

Cách hoạt động: `categories=[values]` khai báo **thứ tự đúng** XS → S → M
→ L → XL; mỗi giá trị được thay bằng **vị trí** của nó trong danh sách,
bắt đầu từ 0. Danh sách bọc trong một cặp ngoặc nữa (`[values]`) vì
encoder nhận **một danh sách cho mỗi cột** — ở đây chỉ có 1 cột.

**Dòng quan trọng nhất là `categories=[values]`** *(nhận xét của Claude)*.
Nếu bỏ đi, OrdinalEncoder tự sắp category theo **thứ tự bảng chữ cái**:
L = 0, M = 1, S = 2, XL = 3, XS = 4 → XS thành lớn nhất, S lớn hơn L — thứ
tự sai hoàn toàn, model sẽ học một quan hệ vô nghĩa. Ordinal phải luôn
khai báo thứ tự bằng tay.

*(Nhận xét nhỏ)* Slide đặt tên biến `scaler` cho một encoder — chạy vẫn
đúng, nhưng nên đặt `encoder` cho khỏi nhầm với [[bài:feature-scaling]].

Ví dụ ordinal khác *(bổ sung)*: học lực Yếu < Trung bình < Khá < Giỏi <
Xuất sắc; mức độ hài lòng 1–5 sao; trình độ Cử nhân < Thạc sĩ < Tiến sĩ;
hạng vé Titanic `Pclass` 1 / 2 / 3 (đã là số).

Hạn chế: OrdinalEncoder giả định các bậc **cách đều nhau** (S → M bằng M →
L, đều là +1). Thường chấp nhận được, nhưng cần nhớ đó là một giả định.

> **EN:** [[slide:48]]'s `OrdinalEncoder(categories=[values])` declares the
> correct order XS → S → M → L → XL and replaces each value by its
> position (0–4); the extra brackets give one list per column. *(Claude's
> note)* `categories=` is the crucial line: without it, categories are
> sorted **alphabetically** (L = 0, M = 1, S = 2, XL = 3, XS = 4) —
> a nonsense order. The slide names the encoder `scaler`; `encoder` would
> be clearer. *(Supplementary)* Other ordinal examples: academic grades,
> star ratings, degrees, Titanic's `Pclass`. Limitation: steps are assumed
> **equally spaced**.

## Vì sao không dùng OrdinalEncoder cho nominal?

Nếu mã hóa màu Red = 0, Green = 1, Blue = 2, Black = 3, model sẽ hiểu:

- Black (3) **lớn gấp 3** Green (1);
- trung bình của Red (0) và Blue (2) **là** Green (1);
- Red **gần** Green hơn Black.

Không điều nào có nghĩa. Một Linear / Logistic Regression sẽ gán một hệ
số cho cột màu, ép hiệu ứng của màu phải **tăng đều** theo thứ tự bịa ra
đó. Với nominal cần cách mã hóa không tạo thứ tự — [[slide:49]].

> **EN:** Encoding colours as 0–3 would tell the model Black is "three
> times" Green, Green is the "average" of Red and Blue, and Red is
> "closer" to Green than to Black — all meaningless. A linear model would
> force the colour effect to grow evenly along this fake order. Nominal
> data needs order-free encodings ([[slide:49]]).

## One-hot encoding ([[slide:49]], cột xanh lá)

Mỗi category thành **một cột riêng**; mỗi dòng có đúng một số 1 ("hot") ở
cột của nó, còn lại là 0. Ví dụ trên slide — feature **Color**:

| Color | Red | Green | Blue | Black |
|---|---|---|---|---|
| Red | **1** | 0 | 0 | 0 |
| Green | 0 | **1** | 0 | 0 |
| Blue | 0 | 0 | **1** | 0 |
| Black | 0 | 0 | 0 | **1** |

- **Advantage (slide): Simple** — dễ hiểu, dễ làm, không bịa thứ tự: mọi
  cặp màu cách nhau như nhau (khoảng cách Euclid giữa hai dòng bất kỳ đều
  là √2).
- **Disadvantage (slide): Sparse data** — dữ liệu **thưa**: hầu hết là số
  0. Với 4 màu thì không sao, nhưng một cột có 10 000 giá trị khác nhau (mã
  sản phẩm, tên đường, từ vựng) sẽ thành 10 000 cột, mỗi dòng chỉ có một số
  1 — tốn bộ nhớ và làm số chiều tăng vọt (*curse of dimensionality* —
  P13).

*(Bổ sung)* Ba chi tiết khi dùng thật:

1. **Category mới ở tập test.** Train chỉ có 4 màu, test xuất hiện
   "Purple" → `OneHotEncoder(handle_unknown="ignore")` cho ra toàn 0 thay vì
   báo lỗi.
2. **Bẫy biến giả (dummy variable trap).** 4 cột one-hot luôn cộng lại
   bằng 1, nên biết 3 cột là suy ra cột thứ 4 → các cột **phụ thuộc tuyến
   tính** hoàn toàn — đây chính là **đa cộng tuyến** (multicollinearity, bài
   20). Với Linear / Logistic Regression không có regularization nên bỏ một
   cột: `drop="first"` (cột bị bỏ trở thành "mức chuẩn"). Model dạng cây
   hoặc có regularization thì không cần.
3. `pd.get_dummies` làm one-hot nhanh để khám phá, nhưng không "nhớ" danh
   sách category → khi train và test có category khác nhau thì số cột lệch
   nhau. Trong pipeline nên dùng `OneHotEncoder` của scikit-learn (fit trên
   train).

> **EN:** **One-hot**: one column per category, a single 1 per row. Slide:
> advantage **simple** (no fake order — every pair of colours is √2
> apart); disadvantage **sparse data** (mostly zeros; 10 000 categories →
> 10 000 columns — the curse of dimensionality, P13). *(Supplementary)*
> Use `handle_unknown="ignore"` for unseen test categories; beware the
> **dummy variable trap** — one-hot columns always sum to 1, a perfect
> linear dependency (multicollinearity, lesson 20), so drop one column
> (`drop="first"`) for unregularized linear models; prefer
> `OneHotEncoder` (fitted on train) over `pd.get_dummies` in pipelines.

## Hash encoding ([[slide:49]], cột cam)

Ý tưởng: chọn trước **số cột cố định** k (ví dụ k = 3), rồi dùng một **hàm
băm (hash function)** — hàm biến chuỗi chữ bất kỳ thành một số nguyên — để
quyết định mỗi category rơi vào cột nào: `cột = hash(category) mod k`.

Ví dụ trên slide — feature **Country** với k = 3:

| Country | Cột 0 | Cột 1 | Cột 2 |
|---|---|---|---|
| USA | **1** | 0 | 0 |
| UK | 0 | 0 | **1** |
| Korea | 0 | **1** | 0 |
| Russia | **1** | 0 | 0 |

Slide in đậm USA và Russia: **cả hai cùng ra 1, 0, 0** — đó là **va chạm
(collision)**: hai category khác nhau bị băm vào cùng một cột, model không
phân biệt được hai nước này nữa.

- **Advantage: Simple** — không cần lưu danh sách category, category mới ở
  test vẫn băm được bình thường.
- **Advantage: Less sparse** — số cột do ta chọn (k), không phụ thuộc số
  category. 10 000 mã sản phẩm có thể dồn vào 1 000 cột.
- **Disadvantage: Collision** — k nhỏ hơn số category thì chắc chắn có va
  chạm (4 nước, 3 cột → ít nhất 2 nước chung cột — nguyên lý chuồng bồ
  câu).
- **Disadvantage: No inverse-mapping** — từ cột 0 = 1 không suy ngược được
  là USA hay Russia; khó giải thích model.

*(Bổ sung)* Slide không nói dùng hàm băm nào; bảng trên chỉ để minh họa.
`FeatureHasher` của scikit-learn dùng hàm băm MurmurHash3 nên cho kết quả
khác (và còn có thể ra −1 thay vì 1 để các va chạm có xu hướng triệt tiêu
nhau — tham số `alternate_sign`). Hash encoding hay dùng khi số category rất
lớn hoặc luôn có category mới (từ trong văn bản, ID người dùng, URL).

> **EN:** **Hash encoding**: fix k columns, put each category in column
> hash(category) mod k. Slide (k = 3): USA → 1,0,0; UK → 0,0,1; Korea →
> 0,1,0; Russia → 1,0,0 — USA and Russia **collide**. Pros: **simple** (no
> category list; unseen categories still hash) and **less sparse** (k is
> our choice). Cons: **collisions** (inevitable when k < number of
> categories — pigeonhole principle) and **no inverse mapping**.
> *(Supplementary)* The slide's hash is illustrative; scikit-learn's
> `FeatureHasher` uses MurmurHash3 (and may output −1 via
> `alternate_sign`). Useful for huge or ever-growing category sets.

## Word embedding ([[slide:49]], cột đỏ)

Mỗi category được biểu diễn bằng một **vector số thực dày (dense)** —
vài chục đến vài trăm số, không phải 0/1 — và các vector này được **học từ
dữ liệu** sao cho những category **giống nhau về nghĩa** có vector **gần
nhau**. Ví dụ trên slide — feature **Animal**, vector 3 chiều:

| Animal | Vector |
|---|---|
| Dog | 0.27, −0.31, −0.53 |
| Lion | **−0.7, 0.61, 0.42** |
| Tiger | **−0.71, 0.6, 0.38** |
| Mouse | 0.31, −0.34, 0.76 |

Slide in đậm Lion và Tiger: hai vector **gần như trùng nhau** — vì sư tử
và hổ đều là mèo lớn ăn thịt, embedding đã "học" được điều đó. One-hot
thì coi Lion–Tiger xa nhau y như Lion–Mouse.

Đo mức "giống" bằng **cosine similarity** *(bổ sung — sẽ dùng lại ở NLP
P09 và hệ gợi ý P15)*:

```
cos(u, v) = (u · v) / (‖u‖ × ‖v‖)      ∈ [−1, 1]
```

1 = cùng hướng (rất giống), 0 = không liên quan, −1 = ngược hướng. Với các
vector trên slide: cos(Lion, Tiger) ≈ **0.999**, cos(Dog, Lion) ≈
**−0.879** (tính ở mục 4).

- **Advantage: Memory efficient** — 10 000 từ chỉ cần, ví dụ, 100 cột
  thay vì 10 000 cột one-hot.
- **Advantage: Relationship learnt** — quan hệ ngữ nghĩa được học (Lion ≈
  Tiger).
- **Disadvantage: Word2vec model needed** — phải có (hoặc tự huấn luyện)
  một model như **Word2vec** trên lượng dữ liệu lớn để sinh ra vector.
- **Disadvantage: Maybe many dimensions needed** — để mã hóa đủ sắc thái
  nghĩa có thể cần hàng trăm chiều.

*(Nhận xét của Claude)* Các con số trên slide là ví dụ minh họa (3 chiều),
không phải vector Word2vec thật; ví dụ cos(Dog, Mouse) ≈ −0.36 không mang
nhiều ý nghĩa. Embedding chủ yếu dùng cho **văn bản** (từ, câu) và các
category có số lượng khổng lồ; với cột vài giá trị như màu sắc thì one-hot
là đủ.

> **EN:** **Word embedding**: each category is a learned **dense
> real-valued vector**; similar categories get nearby vectors. Slide
> (3-D): Lion (−0.7, 0.61, 0.42) and Tiger (−0.71, 0.6, 0.38) almost
> coincide. *(Supplementary)* Measure similarity with **cosine
> similarity** (u·v)/(‖u‖‖v‖) ∈ [−1, 1]: cos(Lion, Tiger) ≈ 0.999,
> cos(Dog, Lion) ≈ −0.879 (reused in NLP, P09, and recommenders, P15).
> Pros: **memory efficient**, **relationships learnt**. Cons: needs a
> **Word2vec**-style model; may need **many dimensions**. *(Claude's
> note)* The slide's vectors are illustrative, not real Word2vec output;
> embeddings suit text and huge category sets, while one-hot is enough
> for a few colours.

## Tổng hợp: chọn cách mã hóa

| Loại dữ liệu | Cách | Ví dụ | Ghi chú |
|---|---|---|---|
| **Boolean** (2 giá trị) | 0 / 1 | Sex: male / female; Có / Không | Một cột là đủ *(bổ sung)* |
| **Ordinal** | OrdinalEncoder (khai báo thứ tự) | Size, học lực, Pclass | [[slide:48]] |
| **Nominal, ít category** | One-hot | Color, Embarked (S / C / Q) | [[slide:49]] — mặc định an toàn |
| **Nominal, rất nhiều / luôn có category mới** | Hash encoding | Mã sản phẩm, URL, từ | Chấp nhận va chạm |
| **Văn bản / category có quan hệ ngữ nghĩa** | Word embedding | Từ trong câu, tên con vật | Cần model như Word2vec (P09) |

Bảng ưu nhược theo [[slide:49]]:

| | One-hot | Hash encoding | Word embedding |
|---|---|---|---|
| Advantage | Simple | Simple, Less sparse | Memory efficient, Relationship learnt |
| Disadvantage | Sparse data | Collision, No inverse-mapping | Word2vec model needed, Maybe many dimensions needed |

Ví dụ thực tế Việt Nam *(bổ sung)*: dự đoán giá thuê phòng trọ —
"Quận/huyện" là **nominal** (vài chục giá trị) → one-hot; "Nội thất: Không
/ Cơ bản / Đầy đủ" là **ordinal** → 0 / 1 / 2; "Có ban công" là
**boolean** → 0 / 1; "Mô tả phòng" là văn bản → embedding hoặc các kỹ thuật
ở P09.

> **EN:** Summary: **boolean** → 0/1 (one column); **ordinal** →
> OrdinalEncoder with an explicit order ([[slide:48]]); **nominal, few
> categories** → one-hot (safe default); **nominal, huge or growing** →
> hash encoding; **text / semantic categories** → word embeddings (P09).
> *(Supplementary)* Vietnamese rental example: district (nominal) →
> one-hot; furnishing None/Basic/Full (ordinal) → 0/1/2; balcony (boolean)
> → 0/1; free-text description → embeddings or P09 techniques.

## Mã hóa bảng sinh viên, hash và cosine

## Mã hóa một bảng nhỏ *(tự soạn)*

5 sinh viên:

| SV | Học lực | Quê | Ở KTX |
|---|---|---|---|
| A | Khá | Hà Nội | Có |
| B | Giỏi | Huế | Không |
| C | Trung bình | Hà Nội | Có |
| D | Xuất sắc | Đà Nẵng | Không |
| E | Khá | Huế | Có |

- **Học lực** — ordinal, thứ tự Trung bình < Khá < Giỏi < Xuất sắc →
  0, 1, 2, 3.
- **Quê** — nominal, 3 giá trị → one-hot 3 cột (sắp theo chữ cái như
  scikit-learn: Huế, Hà Nội, Đà Nẵng — thứ tự cột không quan trọng).
- **Ở KTX** — boolean → Có = 1, Không = 0.

| SV | HocLuc | Que_Huế | Que_Hà Nội | Que_Đà Nẵng | KTX |
|---|---|---|---|---|---|
| A | 1 | 0 | 1 | 0 | 1 |
| B | 2 | 1 | 0 | 0 | 0 |
| C | 0 | 0 | 1 | 0 | 1 |
| D | 3 | 0 | 0 | 1 | 0 |
| E | 1 | 1 | 0 | 0 | 1 |

3 cột chữ → **5 cột số**. Feature vector của A là `[1, 0, 1, 0, 1]`. Nếu
dùng `drop="first"` cho Quê thì bỏ cột `Que_Huế`, còn 4 cột: Huế được hiểu
là "cả hai cột còn lại bằng 0".

## Hash encoding bằng tay với một hàm băm đơn giản *(tự soạn)*

Hàm băm tự chọn: **cộng mã ASCII của các chữ cái, rồi lấy dư khi chia
cho 3**.

| Country | Tổng mã ASCII | mod 3 | Vector (3 cột) |
|---|---|---|---|
| USA | U 85 + S 83 + A 65 = **233** | 233 = 3 × 77 + 2 → **2** | 0, 0, 1 |
| UK | 85 + K 75 = **160** | 160 = 3 × 53 + 1 → **1** | 0, 1, 0 |
| Korea | 75 + 111 + 114 + 101 + 97 = **498** | 498 = 3 × 166 → **0** | 1, 0, 0 |
| Russia | 82 + 117 + 115 + 115 + 105 + 97 = **631** | 631 = 3 × 210 + 1 → **1** | 0, 1, 0 |
| Vietnam (mới) | 86 + 105 + 101 + 116 + 110 + 97 + 109 = **724** | 724 = 3 × 241 + 1 → **1** | 0, 1, 0 |

- Va chạm: **UK, Russia, Vietnam** cùng rơi vào cột 1 (hàm băm khác slide
  nên cặp va chạm khác, nhưng hiện tượng giống hệt).
- "Vietnam" chưa từng xuất hiện vẫn được mã hóa ngay, không cần sửa
  encoder — ưu điểm của hash.
- Nhìn vector 0, 1, 0 không biết là UK, Russia hay Vietnam — **no
  inverse-mapping**.

## Cosine similarity với vector trên slide

**Lion · Tiger** = (−0.7)(−0.71) + (0.61)(0.6) + (0.42)(0.38)
= 0.497 + 0.366 + 0.1596 = **1.0226**

‖Lion‖ = √(0.49 + 0.3721 + 0.1764) = √1.0385 ≈ **1.0191**
‖Tiger‖ = √(0.5041 + 0.36 + 0.1444) = √1.0085 ≈ **1.0042**

cos(Lion, Tiger) = 1.0226 / (1.0191 × 1.0042) ≈ 1.0226 / 1.0234 ≈
**0.9992** → gần như cùng hướng.

**Dog · Lion** = (0.27)(−0.7) + (−0.31)(0.61) + (−0.53)(0.42)
= −0.189 − 0.1891 − 0.2226 = **−0.6007**
‖Dog‖ = √(0.0729 + 0.0961 + 0.2809) = √0.4499 ≈ **0.6707**
cos(Dog, Lion) = −0.6007 / (0.6707 × 1.0191) ≈ **−0.879** → rất khác.

Với one-hot (Dog, Lion, Tiger, Mouse mỗi con một cột), cos giữa **mọi cặp**
khác nhau đều bằng **0** — one-hot không biểu diễn được "Lion giống Tiger".

> **EN:** **4.1** Five students: grade (ordinal) → 0–3; hometown
> (nominal) → 3 one-hot columns; dorm (boolean) → 0/1; 3 text columns
> become 5 numeric columns (4 with `drop="first"`). **4.2** A toy hash —
> sum of ASCII codes mod 3: USA 233 → 2; UK 160 → 1; Korea 498 → 0; Russia
> 631 → 1; Vietnam (unseen) 724 → 1. UK, Russia and Vietnam collide; the
> unseen country still encodes; the vector can't be inverted. **4.3**
> Slide vectors: Lion·Tiger = 1.0226, norms 1.0191 and 1.0042 → cosine ≈
> 0.9992; Dog·Lion = −0.6007, ‖Dog‖ ≈ 0.6707 → cosine ≈ −0.879. Under
> one-hot every distinct pair has cosine 0.

## Tự tính rồi chạy encoder

## Chạy lại code [[slide:48]] và thử bỏ `categories`

```python
from pandas import DataFrame
from sklearn.preprocessing import OrdinalEncoder

before = DataFrame(["XL", "L", "S", "M", "XS", "XS", "L", "M"])
values = ["XS", "S", "M", "L", "XL"]
encoder = OrdinalEncoder(categories=[values])        # slide đặt tên là scaler
after = encoder.fit_transform(before)
for b, a in zip(before.values, after):
    print("Before: {}. After: {}".format(b, a))
# XL -> 4, L -> 3, S -> 1, M -> 2, XS -> 0, ...

# (bổ sung) Không khai báo thứ tự -> sắp theo bảng chữ cái, SAI nghĩa
wrong = OrdinalEncoder().fit(before)
print(wrong.categories_)               # [array(['L', 'M', 'S', 'XL', 'XS'], ...)]
print(wrong.transform(before).ravel()) # [3. 0. 2. 1. 4. 4. 0. 1.]
```

## One-hot encoding *(bổ sung)*

```python
import pandas as pd
from sklearn.preprocessing import OneHotEncoder

colors = pd.DataFrame({"Color": ["Red", "Green", "Blue", "Black"]})
ohe = OneHotEncoder(categories=[["Red", "Green", "Blue", "Black"]],
                    sparse_output=False, handle_unknown="ignore")
print(ohe.fit_transform(colors))        # ma trận đơn vị 4x4 như slide 49
print(ohe.transform(pd.DataFrame({"Color": ["Purple"]})))   # [[0. 0. 0. 0.]] - màu lạ

print(pd.get_dummies(colors, dtype=int))                    # cách nhanh của pandas
print(OneHotEncoder(drop="first", sparse_output=False)
      .fit(colors).get_feature_names_out())  # ['Color_Blue' 'Color_Green' 'Color_Red'] - bỏ Black
```

## Hash encoding *(bổ sung)*

```python
from sklearn.feature_extraction import FeatureHasher

countries = [["USA"], ["UK"], ["Korea"], ["Russia"], ["Vietnam"]]

# Hàm băm tự chế ở ví dụ tay
for (c,) in countries:
    s = sum(ord(ch) for ch in c)
    print(c, s, s % 3)                  # USA 233 2, UK 160 1, Korea 498 0, Russia 631 1, Vietnam 724 1

# FeatureHasher của scikit-learn (MurmurHash3) - kết quả khác hàm tự chế
fh = FeatureHasher(n_features=3, input_type="string", alternate_sign=False)
print(fh.transform(countries).toarray())
# USA -> cột 2, UK -> cột 1, Korea -> cột 2, Russia -> cột 0, Vietnam -> cột 1
# va chạm: USA với Korea, UK với Vietnam
fh8 = FeatureHasher(n_features=8, input_type="string", alternate_sign=False)
print(fh8.transform(countries).toarray())   # nhiều cột hơn -> ít va chạm hơn
```

## Cosine similarity cho vector embedding của slide *(bổ sung)*

```python
import numpy as np

E = {"Dog": [0.27, -0.31, -0.53], "Lion": [-0.7, 0.61, 0.42],
     "Tiger": [-0.71, 0.6, 0.38], "Mouse": [0.31, -0.34, 0.76]}

def cosine(u, v):
    u, v = np.array(u), np.array(v)
    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))

for a, b in [("Lion", "Tiger"), ("Dog", "Lion"), ("Dog", "Mouse")]:
    print(a, b, round(cosine(E[a], E[b]), 4))   # 0.9992  -0.8788  -0.3586
```

## Mã hóa nhiều cột cùng lúc bằng ColumnTransformer *(bổ sung)*

```python
from sklearn.compose import ColumnTransformer

students = pd.DataFrame({
    "HocLuc": ["Khá", "Giỏi", "Trung bình", "Xuất sắc", "Khá"],
    "Que": ["Hà Nội", "Huế", "Hà Nội", "Đà Nẵng", "Huế"],
    "KTX": ["Có", "Không", "Có", "Không", "Có"],
})
ct = ColumnTransformer([
    ("ordinal", OrdinalEncoder(categories=[["Trung bình", "Khá", "Giỏi", "Xuất sắc"]]), ["HocLuc"]),
    ("onehot", OneHotEncoder(sparse_output=False, handle_unknown="ignore"), ["Que"]),
    ("bool", OrdinalEncoder(categories=[["Không", "Có"]]), ["KTX"]),
])
out = ct.fit_transform(students)
print(ct.get_feature_names_out())
print(out)        # khớp bảng ở mục 4.1
```

> **EN:** 5.1 reruns [[slide:48]] (renaming `scaler` to `encoder`) and shows
> the alphabetical order you get without `categories`. *(Supplementary)*
> 5.2 one-hot with `OneHotEncoder` (unknown categories → all zeros,
> `drop="first"`) and `pd.get_dummies`; 5.3 the toy ASCII hash and
> scikit-learn's `FeatureHasher`; 5.4 cosine similarity of the slide's
> embeddings; 5.5 a `ColumnTransformer` encoding ordinal, nominal and
> boolean columns together, matching table 4.1.

## Những giả định không nằm trong mã số (bổ sung)

:::compare Chọn theo cấu trúc và quy mô
| Tình huống | Điểm bắt đầu | Cần kiểm tra |
|---|---|---|
| Ordinal | Thứ tự khai báo | Model có áp khoảng cách đều không |
| Nominal ít mức | One-hot sparse | Vocabulary train và unknown |
| Nhiều mức hoặc tăng liên tục | Hash hoặc nhóm mức hiếm | Collision, khả năng giải thích |
| Category có cấu trúc học được | Embedding | Dữ liệu học, OOV và bộ nhớ bảng vector |
:::

:::note Làm rõ các nhận xét (bổ sung)
OrdinalEncoder tạo mã nguyên liên tiếp; giả định hiệu ứng/khoảng cách đều đến từ model dùng mã đó, không từ encoder tự khẳng định. Dummy variable trap của bộ one-hot đầy đủ liên quan cột intercept: tổng các dummy bằng cột hằng 1; không phải mọi trường hợp đều bắt buộc drop. Với drop và ignore unknown, vector toàn 0 có thể trùng category chuẩn. Sparse one-hot có thể tiết kiệm hơn dense embedding cho mỗi mẫu; embedding còn cần lưu bảng vector và học quan hệ, không bảo đảm ngữ nghĩa. Target encoding dùng thống kê target theo category nên phải fit trong fold hoặc out-of-fold để tránh leakage; xem như một lựa chọn bổ sung cho cardinality cao.
:::

> **EN:** Consecutive ordinal codes do not themselves justify equal spacing. Full one-hot encoding is redundant with an intercept; unknown-category handling and target encoding require careful validation.

## Tóm tắt 1 phút

:::recap
- Ordinal phải giữ đúng thứ tự nghiệp vụ.
- One-hot tránh thứ tự giả.
- Vocabulary học trên train và dùng lại khi serving.
- Hash dùng số chiều cố định nhưng có collision.
- Embedding học biểu diễn, cần dữ liệu và OOV policy.
- Không fit target encoding bằng nhãn validation.
- So chất lượng, bộ nhớ và khả năng giải thích.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Phân loại và chọn cách mã hóa: (a) Size giày 38–44, (b) Hãng
điện thoại, (c) Mức độ hài lòng "Rất tệ … Rất tốt", (d) Đã kết hôn Có /
Không.
A: (a) Numerical (số đo thật) — giữ nguyên, có thể scale;
(b) Nominal → one-hot; (c) Ordinal → OrdinalEncoder với thứ tự khai báo
tay; (d) Boolean → 0 / 1.
EN: Classify and encode: shoe size 38–44, phone brand, satisfaction
"very bad … very good", married yes/no.
**A:** Numerical (keep, maybe scale); nominal → one-hot; ordinal →
> OrdinalEncoder with explicit order; boolean → 0/1.

Q: Chạy `OrdinalEncoder()` (không truyền `categories`) trên
`["S", "M", "L"]`. Kết quả là gì và có vấn đề gì?
A: Category sắp theo chữ cái L, M, S → L = 0, M = 1, S = 2. Thứ
tự ngược với ý nghĩa (S nhỏ nhất lại thành lớn nhất). Phải truyền
`categories=[["S", "M", "L"]]`.
EN: `OrdinalEncoder()` without `categories` on S, M, L?
**A:** Alphabetical: L = 0, M = 1, S = 2 — reversed meaning; pass the
> order explicitly.

Q: Một cột "Tỉnh/thành" có 34 giá trị. One-hot sẽ tạo bao nhiêu
cột? Bao nhiêu nếu dùng `drop="first"`? Vì sao Linear Regression nên dùng
`drop="first"`?
A: 34 cột; 33 cột với `drop="first"`. Vì 34 cột one-hot luôn
cộng lại bằng 1 → phụ thuộc tuyến tính hoàn toàn (**dummy variable
trap**, một dạng multicollinearity — [[bài:correlation-multicollinearity]]), làm hệ số của Linear
Regression không xác định duy nhất.
EN: 34 provinces: how many one-hot columns, with `drop="first"`, and
why drop for Linear Regression?
**A:** 34 and 33; the full set always sums to 1 (dummy variable trap,
> multicollinearity), so coefficients aren't uniquely determined.

Q: Hash encoding với k = 4 cột cho 6 category. Có chắc chắn xảy ra
va chạm không? Vì sao?
A: Chắc chắn có. 6 category mà chỉ 4 cột → theo nguyên lý chuồng
bồ câu, ít nhất 2 category phải chung một cột.
EN: Hash 6 categories into 4 columns — collision guaranteed?
**A:** Yes, by the pigeonhole principle.

Q: Tính cosine similarity giữa u = (1, 2, 2) và v = (2, 1, 2).
A: u · v = 2 + 2 + 4 = 8; ‖u‖ = ‖v‖ = √9 = 3 → cos = 8 / 9 ≈
**0.889**.
EN: Cosine of (1, 2, 2) and (2, 1, 2)?
**A:** 8/9 ≈ 0.889.

Q: Vì sao với one-hot, khoảng cách Euclid giữa hai category khác
nhau bất kỳ đều bằng √2? Điều đó tốt hay xấu?
A: Hai vector one-hot khác nhau đúng ở 2 vị trí (một bên 1/0,
bên kia 0/1) → √(1² + 1²) = √2. Tốt: không bịa ra thứ tự hay khoảng cách
giả. Hạn chế: không biểu diễn được quan hệ giống nhau (Lion và Tiger
cũng xa như Lion và Mouse) — điều mà word embedding làm được.
EN: Why are distinct one-hot vectors always √2 apart? Good or bad?
**A:** They differ in exactly two positions. Good: no fake order or
> distance. Bad: no notion of similarity, which embeddings provide.
@tier B | Phỏng vấn lý thuyết
Q: Khi nào ordinal hợp, khi nào one-hot hợp?
A: Ordinal hợp mức có thứ tự đã xác nhận; one-hot là baseline cho nominal ít category. Chú ý linear model dùng ordinal có thể áp hiệu ứng tuyến tính đều giữa mức, nên cần kiểm chứng.
EN: Ordinal encoding preserves a declared order; one-hot encoding is a baseline for nominal categories without artificial ordering.
Q: Hash đánh đổi gì với one-hot?
A: Hash cố định số chiều và không cần vocabulary, nhưng có collision và khó đảo ngược. One-hot phân biệt mức đã biết rõ hơn nhưng rộng theo cardinality. So bộ nhớ sparse thực tế thay vì chỉ số cột.
EN: Hashing fixes dimensionality and handles new values but introduces collisions and loses inverse mapping.
Q: Dummy variable trap có luôn bắt drop một cột?
A: Bộ dummy đầy đủ cùng intercept phụ thuộc tuyến tính, gây không xác định duy nhất hệ số của mô hình không regularize. Drop một mức là cách phổ biến; regularization và loại model thay đổi cách xử lý, nên không coi drop là luật mọi nơi.
EN: A full dummy set is redundant with an intercept; dropping a reference level is common but is not universally required.
Q: Embedding có tự biết hai category giống nhau không?
A: Không. Quan hệ phải được học từ dữ liệu/mục tiêu hoặc từ model pretrained phù hợp. Vector nhỏ không bảo đảm có nghĩa, và category mới cần policy OOV *(bổ sung)*.
EN: Embeddings learn relationships from an objective and data; semantic similarity is not automatic.
@tier C | Tình huống doanh nghiệp
Q: Cột sản phẩm có 50.000 giá trị, chọn gì?
A: Đo cardinality, tần suất và memory baseline sparse one-hot; cân nhắc nhóm hiếm/hash để cố định chiều, embedding nếu có dữ liệu học quan hệ. Target encoding là lựa chọn khác nhưng fit trong fold. So theo split thời gian và sản phẩm mới; đánh đổi giải thích với chi phí và chất lượng *(bổ sung)*.
WANT: Không phản xạ dùng embedding chỉ vì nhiều category.
Q: Serving gặp quốc gia mới và encoder lỗi. Xử lý sao?
A: Đặt unknown policy trước, dùng encoder đã fit train và lưu cùng pipeline. One-hot ignore cho toàn 0 hoặc gộp unknown theo thiết kế, theo dõi tỷ lệ unknown để phát hiện đổi nguồn. Không refit vocabulary riêng mỗi request vì đổi schema *(bổ sung)*.
WANT: Giữ schema train–serving nhất quán và biết ý nghĩa unknown.
Q: Team target-encode toàn dataset rồi CV, điểm tăng mạnh. Tin không?
A: Không kết luận trước khi chạy lại đúng: mỗi validation fold chỉ nhận encoding học từ train, phần train có thể cần out-of-fold encoding; xử lý unseen bằng prior train. Điểm có thể giảm vì bỏ thông tin nhãn rò rỉ. So baseline trên cùng split *(bổ sung)*.
WANT: Nhận diện target leakage và nêu cách cross-fitting cụ thể.
:::

## Nối sang bài sau

:::next
Tiếp theo, [[bài:correlation-multicollinearity]] sẽ nối phần kiến thức này với bước kế tiếp của lộ trình.
:::
