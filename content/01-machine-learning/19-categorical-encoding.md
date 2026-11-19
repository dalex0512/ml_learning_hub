---
title: Step 3.3 — Mã hóa categorical features (Ordinal, One-hot, Hash, Embedding)
order: 19
description: "Đổi chữ thành số mà không bịa ra thứ tự: ordinal với categories (slide 48), one-hot, hash và word embedding (slide 49) kèm ưu nhược, và quy tắc fit trên train."
slides: 48-49
needs: [feature-and-data-types, feature-scaling]
tags: [encoding, one-hot, ordinal, hash, embedding, cardinality]
---

## Đổi chữ thành số sao cho đúng nghĩa?

:::intro Mục tiêu bài này
- Hiểu vì sao đánh số thẳng cho nhóm không thứ tự tạo ra **thứ tự và khoảng cách giả**.
- Chọn giữa **ordinal** (slide 48), **one-hot**, **hash** và **word embedding** (slide 49), nêu ưu nhược của từng cách.
- Làm đúng quy tắc: encoder `fit` trên train, chỉ rõ thứ tự khi ordinal, và xử lý được nhóm lạ ở test.
:::

Model chỉ làm việc với số, nên cột chữ như `Color = Red, Green, Blue, Black` phải đổi sang số. Cách "hiển nhiên" là đánh số: Red = 0, Green = 1, Blue = 2, Black = 3. Cách này ngầm nói một điều mà dữ liệu không hề nói.

:::predict
Với Red = 0, Green = 1, Blue = 2, một model dùng khoảng cách sẽ coi **Red xa Blue** gấp mấy lần **Red xa Green**? Điều đó có đúng với màu sắc không?
@answer
Khoảng cách Red đến Blue là 2, Red đến Green là 1: model coi **Red xa Blue gấp đôi** Red xa Green. Điều đó **không đúng**: ba màu không có thứ tự, không cái nào "ở giữa". Đánh số thẳng đã tự bịa ra một thứ tự và khoảng cách không có trong dữ liệu.
:::

## Ordinal: khi nhóm thật sự có thứ tự (slide 48)

Cỡ áo XS < S < M < L < XL có thứ tự thật. Slide 48 dùng `OrdinalEncoder` và **chỉ rõ thứ tự bằng `categories`**:

```python
scaler = OrdinalEncoder(categories=[["XS", "S", "M", "L", "XL"]])
after = scaler.fit_transform(before)    # XL -> 4, L -> 3, M -> 2, S -> 1, XS -> 0
```

Phần `categories` **rất quan trọng**. Nếu bỏ nó đi, scikit-learn tự sắp theo **bảng chữ cái**: L = 0, M = 1, S = 2, XL = 3, XS = 4: kết quả sai, vì lúc đó XL (3) nhỏ hơn XS (4). Với danh sách `['XL','L','S','M','XS']`, cách mặc định cho `[3, 0, 2, 1, 4]` còn cách chỉ rõ thứ tự cho `[4, 3, 1, 2, 0]`. Lưu ý thêm: khoảng cách giữa các bậc **chưa chắc đều** (từ S lên M có thật bằng từ L lên XL không?), nên ordinal vẫn là một giả định.

:::slides 48 | Slide 48: OrdinalEncoder cho ordinal features, chỉ rõ thứ tự bằng categories
:::

## Các cách mã hóa nominal (slide 49)

Với nhóm **không thứ tự** (nominal), slide 49 đưa ba cách, kèm ưu nhược:

| Cách | Ví dụ trên slide | Ưu | Nhược |
|---|---|---|---|
| **One-hot** | Color: Red → 1,0,0,0; Green → 0,1,0,0; Blue → 0,0,1,0; Black → 0,0,0,1 | đơn giản | dữ liệu **thưa** (nhiều số 0), số cột tăng theo số nhóm |
| **Hash** | Country: USA → 1,0,0; UK → 0,0,1; Korea → 0,1,0; **Russia → 1,0,0** | đơn giản, ít thưa hơn | **va chạm** (USA và Russia cùng mã), không suy ngược được |
| **Word embedding** | Animal: Dog → 0.27, −0.31, −0.53; Lion → −0.7, 0.61, 0.42; ... | tiết kiệm bộ nhớ, **học được quan hệ** | cần model như word2vec, có thể cần nhiều chiều |

:::slides 49 | Slide 49: các cách mã hóa nominal features, one-hot, hash, word embedding
:::

Hãy tự thử với hai cột Color và Size; xem mã số và bảng khoảng cách giữa các giá trị.

:::widget encode-table
:::

:::steps
**One-hot:** cột `Color` có 4 giá trị nên tạo **4 cột**, mỗi cột ứng một màu. Mỗi hàng đúng **một cột bằng 1**. (scikit-learn sắp cột theo bảng chữ cái nên thứ tự cột có thể khác slide, ý nghĩa như nhau.)
@step
Khoảng cách giữa hai màu bất kỳ đều là √2 ≈ **1.414**: mọi cặp cách đều nhau, không còn thứ tự giả.
@step
Nhược điểm: cột `Thành phố` có 1000 giá trị sẽ thành 1000 cột, phần lớn là 0. Khi đó cân nhắc hash hoặc embedding.
@step
**Hash:** dùng một hàm băm đưa mỗi nhóm vào **một trong số cột cố định** (ví dụ 3 cột). Với hàm băm minh họa "tổng mã ký tự chia 3 lấy dư": USA → 2, UK → 1, Korea → 0, Russia → 1, nên **UK và Russia va chạm** (cùng cột). Số cột không đổi dù có thêm hàng nghìn nước, đổi lại là chấp nhận va chạm.
:::

## Embedding: khoảng cách mang ý nghĩa

Mỗi nhóm là một **vector học được**, các nhóm giống nhau về ngữ nghĩa nằm gần nhau. Độ gần đo bằng **cosine similarity** (gần 1 là cùng hướng, gần −1 là ngược hướng). Với vector trên slide: **Lion và Tiger có cosine 0.999** (hai loài mèo lớn, gần như cùng hướng), trong khi Dog và Lion có cosine −0.879 (khác hẳn). Đó là điều one-hot không làm được: trong one-hot, Lion cách Tiger và cách Dog **như nhau**.

## Chọn cách nào, và quy tắc fit

| Tình huống | Chọn |
|---|---|
| Nhóm có thứ tự rõ | Ordinal, **chỉ rõ `categories`** |
| Ít nhóm, không thứ tự | One-hot |
| Rất nhiều nhóm, cần số cột cố định | Hash |
| Từ ngữ, nhóm rất nhiều cần mang ngữ nghĩa | Embedding |

Encoder cũng **học từ dữ liệu** (danh sách nhóm), nên `fit` chỉ trên train. Nếu test có một nhóm train chưa từng thấy (ví dụ màu Purple), `OneHotEncoder` sẽ báo lỗi trừ khi đặt `handle_unknown="ignore"` (cột one-hot toàn 0).

:::ck
Cột `Gender` có hai giá trị Male, Female. Bạn đổi Male = 0, Female = 1. Có vấn đề gì không? Còn cột `City` có 5 giá trị?
@answer
Với **hai** giá trị thì không có thứ tự giả đáng kể (chỉ một khoảng cách), nên 0/1 ổn; đây cũng chính là one-hot rút gọn một cột. Với **City 5 giá trị**, đánh số 0 đến 4 tạo thứ tự và khoảng cách giả, nên dùng **one-hot**.
:::

:::ck
Bạn dùng `OrdinalEncoder()` mặc định cho cột `["XL", "L", "S", "M", "XS"]` và không chỉ định `categories`. Model nhận được mã nào cho XL và XS, và điều đó sai thế nào?
@answer
Mặc định sắp theo chữ cái: **XL = 3, XS = 4**. Model sẽ coi XS lớn hơn XL, ngược hoàn toàn với thực tế. Phải truyền `categories=[["XS","S","M","L","XL"]]`.
:::

## Tính tay và chạy lại bằng code

**Mã hóa một bảng nhỏ.** Năm sinh viên, ba cột chữ: Học lực (ordinal: Trung bình < Khá < Giỏi < Xuất sắc), Quê (nominal, 3 giá trị) và Ở KTX (boolean).

| SV | Học lực | Quê | Ở KTX |
|---|---|---|---|
| A | Khá | Hà Nội | Có |
| B | Giỏi | Huế | Không |
| C | Trung bình | Hà Nội | Có |
| D | Xuất sắc | Đà Nẵng | Không |
| E | Khá | Huế | Có |

Học lực thành 0, 1, 2, 3; Quê thành one-hot 3 cột (scikit-learn sắp theo chữ cái: Huế, Hà Nội, Đà Nẵng); KTX thành 1 hoặc 0. Ba cột chữ thành **5 cột số**, ví dụ feature vector của A là `[1, 0, 1, 0, 1]`:

| SV | HocLuc | Que_Huế | Que_Hà Nội | Que_Đà Nẵng | KTX |
|---|---|---|---|---|---|
| A | 1 | 0 | 1 | 0 | 1 |
| B | 2 | 1 | 0 | 0 | 0 |
| C | 0 | 0 | 1 | 0 | 1 |
| D | 3 | 0 | 0 | 1 | 0 |
| E | 1 | 1 | 0 | 0 | 1 |

```python
import pandas as pd
from sklearn.preprocessing import OrdinalEncoder, OneHotEncoder
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
print(ct.fit_transform(students))   # khớp bảng trên (phải fit trước)
print(ct.get_feature_names_out())   # ['ordinal__HocLuc' 'onehot__Que_Huế' 'onehot__Que_Hà Nội' ...]
```

`ColumnTransformer` mã hóa nhiều cột cùng lúc, mỗi cột một cách. Nếu dùng `drop="first"` cho Quê thì bỏ cột đầu, còn 4 cột: Huế được hiểu là "cả hai cột còn lại bằng 0".

**One-hot với màu lạ.**

```python
colors = pd.DataFrame({"Color": ["Red", "Green", "Blue", "Black"]})
ohe = OneHotEncoder(categories=[["Red", "Green", "Blue", "Black"]],
                    sparse_output=False, handle_unknown="ignore")
print(ohe.fit_transform(colors))                           # ma trận đơn vị 4x4 như slide 49
print(ohe.transform(pd.DataFrame({"Color": ["Purple"]})))  # [[0. 0. 0. 0.]]: màu lạ
print(pd.get_dummies(colors, dtype=int))                   # cách nhanh của pandas
print(OneHotEncoder(drop="first", sparse_output=False).fit(colors).get_feature_names_out())
# ['Color_Blue' 'Color_Green' 'Color_Red']  (bỏ Black)
```

**Hash encoding bằng tay.** Chọn hàm băm đơn giản: cộng mã ASCII của các chữ cái rồi lấy dư khi chia cho 3.

| Country | Tổng mã ASCII | mod 3 | Vector (3 cột) |
|---|---|---|---|
| USA | 85 + 83 + 65 = **233** | 233 = 3 × 77 + 2, dư **2** | 0, 0, 1 |
| UK | 85 + 75 = **160** | 160 = 3 × 53 + 1, dư **1** | 0, 1, 0 |
| Korea | 75 + 111 + 114 + 101 + 97 = **498** | 498 = 3 × 166, dư **0** | 1, 0, 0 |
| Russia | 82 + 117 + 115 + 115 + 105 + 97 = **631** | 631 = 3 × 210 + 1, dư **1** | 0, 1, 0 |
| Vietnam (mới) | 86 + 105 + 101 + 116 + 110 + 97 + 109 = **724** | 724 = 3 × 241 + 1, dư **1** | 0, 1, 0 |

Ba điều rút ra: **UK, Russia và Vietnam va chạm** (cùng cột 1); "Vietnam" chưa từng thấy vẫn được mã hóa ngay, không cần sửa encoder; và nhìn vector 0, 1, 0 không biết là nước nào (**không có ánh xạ ngược**). Với `FeatureHasher` của scikit-learn (MurmurHash3, 3 cột) kết quả khác hàm tự chế (USA và Korea va chạm ở cột 2, UK và Vietnam ở cột 1), nhưng hiện tượng giống hệt; thêm cột thì ít va chạm hơn.

```python
from sklearn.feature_extraction import FeatureHasher
countries = [["USA"], ["UK"], ["Korea"], ["Russia"], ["Vietnam"]]
fh = FeatureHasher(n_features=3, input_type="string", alternate_sign=False)
print(fh.transform(countries).toarray())   # USA cột 2, UK cột 1, Korea cột 2, Russia cột 0, Vietnam cột 1
```

**Cosine similarity với vector embedding trên slide.** Lion · Tiger = (−0.7)(−0.71) + (0.61)(0.6) + (0.42)(0.38) = 1.0226; ‖Lion‖ ≈ 1.0191, ‖Tiger‖ ≈ 1.0042, nên cos(Lion, Tiger) ≈ **0.9992**, gần như cùng hướng. Dog · Lion = −0.6007, ‖Dog‖ ≈ 0.6707, nên cos(Dog, Lion) ≈ **−0.879**, rất khác. Với one-hot, cosine giữa **mọi cặp** khác nhau đều bằng **0**: one-hot không biểu diễn được "Lion giống Tiger".

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

## Những hiểu sai thường gặp

- **"Đánh số là mã hóa."** Đánh số chỉ đúng khi nhóm thật sự có thứ tự (và bạn chỉ rõ thứ tự đó).
- **"One-hot luôn tốt nhất."** Nó thưa và phình số cột khi nhiều nhóm.
- **"Hash không mất gì."** Có va chạm (hai nhóm cùng mã) và không đảo ngược được.
- **"Mã hóa xong là dùng được ngay."** Phải `fit` trên train, và xử lý nhóm lạ ở test.
- **"Cây cũng cần one-hot."** Cây xử lý được mã số theo thứ tự rất tốt, nhưng thứ tự giả vẫn có thể đánh lừa; nhiều thư viện cây có xử lý nhóm riêng.

:::card Mã hóa categorical
- **Đánh số thẳng** cho nhóm không thứ tự tạo thứ tự và khoảng cách giả (Red = 0, Green = 1, Blue = 2: Red xa Blue gấp đôi Green).
- **Ordinal (slide 48)** cho nhóm có thứ tự; **luôn chỉ rõ `categories`** (mặc định theo chữ cái cho XL = 3, XS = 4: sai).
- **One-hot** (mọi cặp cách đều √2): đơn giản nhưng thưa; **hash** (có va chạm); **embedding** (học được quan hệ: cosine Lion–Tiger 0.999).
- **Encoder `fit` trên train**; `handle_unknown="ignore"` cho nhóm lạ ở test.
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
Encoding có thể tạo thêm cột và phụ thuộc tuyến tính, như bộ dummy cùng intercept. [[bài:correlation-multicollinearity]] xem quan hệ giữa feature, target và các cột với nhau.
:::
