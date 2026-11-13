---
title: Step 3.5 — Cân bằng dữ liệu (Imbalanced data)
order: 21
description: "Class balancing cho classification: so resampling, class weight và đổi threshold; giữ validation/test theo phân bố thật và chọn bằng chất lượng ở điểm vận hành."
slides: 52-54
needs: [classification-metrics, stratified-k-fold]
tags: [smote, oversampling, undersampling, class-weight, imbalanced, threshold]
---

## Accuracy cao nhưng bỏ sót lớp cần tìm

:::intro Đọc xong bài này bạn làm được
- Phân biệt nhân bản, nội suy và giảm mẫu.
- Tính SMOTE và class weight bằng tay.
- Đặt sampler trong từng fold và biện luận chi phí FP/FN.
:::

Nền để đọc bài này: [[bài:classification-metrics]], [[bài:stratified-k-fold]].

:::slides 52-54 | Slide gốc — Step 3.5 — Cân bằng dữ liệu (Imbalanced data)
:::

Một lớp học có 90 bạn chăm và 10 bạn hay nghỉ học. Nếu giáo viên đoán "bạn
nào cũng chăm", thầy đúng 90% — nhưng **không phát hiện được bạn nào** cần
giúp. Model ML gặp đúng chuyện này khi dữ liệu **mất cân bằng (imbalanced)**:
class đông (*majority class*) áp đảo class ít (*minority class*), nên model
"an toàn" bằng cách nghiêng về class đông, còn class ít — thường lại là class
ta quan tâm nhất (người bệnh, giao dịch gian lận) — bị bỏ sót.

**Step 3.5 Balance data** ([[slide:52-54]]) sửa vấn đề bằng cách **thay đổi số
mẫu mỗi class trong tập train** cho cân bằng hơn. Hai hướng:

| Hướng | Làm gì | Công cụ trên slide |
|---|---|---|
| **Over-sampling** ([[slide:52-53]]) | **Thêm** mẫu cho class ít — nhân bản hoặc sinh mẫu mới | RandomOverSampler, SMOTE, ADASYN |
| **Under-sampling** ([[slide:54]]) | **Bớt** mẫu của class đông | ClusterCentroids |

Ba slide gần như chỉ có **hình**: ranh giới quyết định (*decision function*)
của Logistic Regression trước và sau khi resample, và dữ liệu trông thế nào
sau mỗi cách. Bài này giải thích những hình đó, cơ chế từng cách, rồi thử
tất cả trên Diabetes dataset.

> **EN:** In a class of 90 diligent and 10 frequently absent students,
> guessing "everyone is diligent" is 90% right yet finds no one who needs
> help. Models face the same issue with **imbalanced data**: the
> **majority class** dominates, the model leans toward it, and the
> **minority class** — often the one we care about (patients, fraud) — is
> missed. **Step 3.5 Balance data** (slides 52–54) changes the class counts
> **in the training set**: **over-sampling** adds minority samples
> (RandomOverSampler, SMOTE, ADASYN — slides 52–53); **under-sampling**
> removes majority samples (ClusterCentroids — [[slide:54]]). The slides are
> almost all pictures; this lesson explains them, the mechanics, and tests
> every method on the Diabetes dataset.

## Từ stratification đến thay đổi cách học

```
3.1 Missing → 3.2 Outliers → 3.3 Scaling, Encoding → 3.4 Correlation → [ 3.5 Balance data ] → Step 4 Visualization → …
   (bài 17)     (bài 17)       (bài 18, 19)           (bài 20)            (bài này)             (module 04)
```

Đây là bước cuối của Step 3 tiền xử lý. Nó nối với nhiều bài trước:

- **[[bài:descriptive-statistics]]** — phát hiện Diabetes dataset có **500 không bệnh / 268 bệnh**
  (≈ 1.87 : 1) và đã báo trước bước này.
- **[[bài:stratified-k-fold]] — Stratified K-fold**: giữ **tỉ lệ** class giống nhau ở mọi fold
  để **đánh giá** công bằng. Stratified **không cân bằng** dữ liệu — nó chỉ
  đảm bảo mỗi fold vẫn 65/35. Bài này thì **thay đổi** tỉ lệ trong tập train
  để model **học** tốt hơn. Hai việc bổ sung cho nhau và dùng cùng lúc.
- **[[bài:classification-metrics]] — bẫy Accuracy**: model "lười" luôn đoán 0 đạt Accuracy ≈ 65%
  với Recall = 0. Vì vậy ở bài này ta đo bằng **Recall, Precision, F1** của
  class 1, không phải Accuracy.
- **[[bài:ml-pipeline]]** — model Logistic Regression đầu tiên: Accuracy 0.708 nhưng
  Recall chỉ **0.50** (bỏ sót nửa số người bệnh). Bài này sẽ thấy Recall
  tăng lên khoảng 0.65–0.74 sau khi cân bằng.

> **EN:** The final preprocessing step. Links: lesson 16 found the
> **500 / 268** split; **lesson 09 (Stratified K-fold)** keeps the class
> **ratio** in every fold for fair **evaluation** — it does *not* balance
> anything, while this lesson changes the training ratio so the model
> **learns** better; the two are used together. **Lesson 12**: accuracy
> is a trap, so we judge by Recall, Precision and F1 of class 1. **Lesson
> 15**'s baseline had Recall 0.50; balancing lifts it to about 0.65–0.74.

## Vì sao mất cân bằng làm model "lệch"

Hầu hết model học bằng cách **giảm tổng loss trên tất cả các mẫu** (bài
05–06). Với 400 mẫu class 0 và 214 mẫu class 1 trong tập train Diabetes,
class 0 đóng góp gần gấp đôi vào tổng loss → model ưu tiên làm đúng cho
class 0, dời ranh giới quyết định **lấn sang vùng của class 1**. Kết quả:
nhiều người bệnh bị đoán là "không bệnh" (FN tăng, Recall giảm).

Mức độ mất cân bằng *(bổ sung — quy ước tham khảo)*:

| Tỉ lệ class ít | Mức | Ví dụ |
|---|---|---|
| 20–40% | Nhẹ | Diabetes (34.9%) |
| 1–20% | Vừa | Khách hàng rời bỏ dịch vụ, Cat 90 / Dog 10 ([[bài:stratified-k-fold]]) |
| < 1% | Nặng | Gian lận thẻ tín dụng, lỗi sản phẩm trên dây chuyền |

Mất cân bằng **nhẹ** như Diabetes không phải "thảm họa", nhưng vẫn kéo
Recall xuống rõ (0.50 ở [[bài:ml-pipeline]]).

> **EN:** Models minimise the **total loss over all samples** (lessons
> 05–06). With 400 class-0 vs 214 class-1 training samples, class 0
> contributes almost twice as much, so the decision boundary shifts into
> class 1's region → more FN, lower Recall. *(Supplementary)* Rough
> severity: 20–40% minority = mild (Diabetes, 34.9%), 1–20% = moderate,
> < 1% = severe (card fraud). Even mild imbalance dragged Recall to 0.50
> in lesson 15.

## Đọc hình slide 52 — decision function trước và sau RandomOverSampler

[[slide:52]] có tiêu đề hình *"Decision function of LogisticRegression"*, hai
khung:

- Dữ liệu 2 chiều, **3 class**: **vàng** (đông nhất, chiếm phần lớn điểm),
  **xanh ngọc** (vừa), **tím** (ít nhất — chỉ khoảng 5 điểm).
- Màu nền là **vùng quyết định**: một điểm mới rơi vào vùng màu nào thì
  model đoán class đó.

**Without resampling** (trái): nền gần như chỉ có **vàng** (nửa dưới) và
**xanh** (nửa trên). Vùng **tím** chỉ là một tam giác nhỏ xíu ở mép trái —
gần như **không điểm tím nào** được đoán đúng. Model đã "hy sinh" class tím
vì nó quá ít, chẳng đáng kể trong tổng loss.

**Using RandomOverSampler** (phải): sau khi nhân bản các điểm tím cho bằng
class đông, vùng **tím mở rộng hẳn** chiếm cả góc trái; vùng xanh cũng rộng
ra. Các điểm tím giờ nằm trong vùng tím → được nhận diện. Đổi lại, một số
điểm vàng ở bên trái giờ rơi vào vùng tím → bị đoán nhầm (FP tăng).

Đây là **đánh đổi cốt lõi** của cân bằng dữ liệu: **Recall của class ít
tăng, Precision của nó (và độ chính xác cho class đông) thường giảm.**

*(Nhận xét của Claude)* Hình [[slide:52-54]] có vẻ lấy từ các ví dụ trong tài
liệu chính thức của thư viện **imbalanced-learn** — dùng dữ liệu tổng hợp 3
class, không phải Diabetes dataset. Mục 5.4 có code dựng lại hình tương tự.

> **EN:** [[slide:52]], "Decision function of LogisticRegression": 2-D toy
> data, **3 classes** — yellow (majority), teal (middle), purple (≈ 5
> points). Background colour = predicted class. **Without resampling** the
> purple region is a tiny triangle at the left edge — purple is
> sacrificed. **With RandomOverSampler** the purple region grows to fill
> the left side and purple points are now recognised, but some yellow
> points fall into it (more FP). The core trade-off: **minority Recall up,
> its Precision (and majority accuracy) usually down.** *(Claude's note)*
> The figures appear to come from the imbalanced-learn documentation
> examples (synthetic data, not Diabetes); section 5.4 rebuilds a similar
> plot.

## RandomOverSampler — nhân bản ngẫu nhiên

Cách đơn giản nhất: **bốc ngẫu nhiên có hoàn lại** các mẫu class ít rồi
**chép thêm** cho đến khi bằng class đông.

- Diabetes (train): class 1 có 214 mẫu, cần thêm 400 − 214 = **186 bản sao**
  → 400 / 400.
- Không tạo thông tin mới; chỉ làm mỗi mẫu class ít "nặng ký" hơn trong tổng
  loss.

Ở [[slide:53]], khung *"Resampling with RandomOverSampler"* trông **gần như y hệt**
*"Original dataset"* — vì các bản sao **nằm chồng đúng lên** điểm gốc; chỉ
thấy các chấm tím và xanh **đậm màu hơn** (nhiều chấm chồng nhau).

| Ưu | Nhược |
|---|---|
| Đơn giản, nhanh, không mất dữ liệu | Không thêm thông tin mới |
| Không tạo điểm "giả" lạ | Dễ **overfitting**: model thấy một điểm lặp lại nhiều lần nên "học thuộc" chính điểm đó (gối đầu P11) |

> **EN:** **RandomOverSampler** samples minority points **with
> replacement** and duplicates them until the classes match — on Diabetes,
> 186 copies of class 1 → 400/400. No new information; each minority point
> just weighs more. On [[slide:53]] the RandomOverSampler panel looks almost
> identical to the original because copies sit exactly on top of the
> originals (darker dots). Pros: simple, no data lost. Cons: risk of
> **overfitting** to repeated points (P11).

## SMOTE — sinh điểm mới bằng nội suy

**SMOTE** (*Synthetic Minority Over-sampling Technique*) không chép mà
**tạo điểm mới nằm giữa** các điểm class ít gần nhau *(cơ chế là bổ sung —
slide chỉ có hình)*:

```
1. Chọn một điểm class ít xᵢ.
2. Tìm k láng giềng gần nhất của xᵢ TRONG CÙNG class ít (mặc định k = 5).
3. Chọn ngẫu nhiên một láng giềng x_nn trong k láng giềng đó.
4. Bốc ngẫu nhiên λ trong khoảng [0, 1].
5. Điểm mới:  x_new = xᵢ + λ × (x_nn − xᵢ)
6. Lặp lại cho đến khi đủ số điểm cần thêm.
```

Bước 5 là **nội suy tuyến tính**: x_new nằm **trên đoạn thẳng** nối xᵢ và
x_nn; λ = 0 → trùng xᵢ, λ = 1 → trùng x_nn, λ = 0.5 → đúng trung điểm.

Ở [[slide:53]], khung *"Resampling with SMOTE"*: các chấm tím và xanh mới xếp
thành **những vệt / đường thẳng** nối giữa các điểm gốc — dấu vết của phép
nội suy. Vùng tím phía dưới giữa hình dày đặc lên thành một "đám" chứ không
còn vài chấm lẻ.

| Ưu | Nhược |
|---|---|
| Tạo điểm **mới** (không trùng) → ít overfitting hơn chép | Điểm mới có thể rơi vào **vùng của class đông** nếu nối hai điểm class ít nằm hai bên một cụm class đông, hoặc nối từ một điểm nhiễu |
| Phủ đều vùng của class ít | Chỉ dùng được cho feature **số liên tục** (nội suy "Red" với "Blue" vô nghĩa — dùng biến thể SMOTENC cho dữ liệu có cột categorical) |
| | Cần tính khoảng cách → **phải scale trước** ([[bài:feature-scaling]]) |

> **EN:** **SMOTE** creates **new points between nearby minority
> points** *(mechanism supplementary — slide shows only a picture)*: pick a
> minority point xᵢ, find its k nearest **minority** neighbours (default 5),
> pick one x_nn, draw λ ∈ [0, 1], and set x_new = xᵢ + λ(x_nn − xᵢ) — a
> point on the segment between them. On [[slide:53]], SMOTE's new points form
> **streaks along lines** between originals. Pros: new, non-duplicate
> points; fills the minority region. Cons: can create points inside the
> majority region (bridging across it or from noisy points); numeric
> features only (SMOTENC handles categoricals); distance-based, so **scale
> first** (lesson 18).

## ADASYN — sinh nhiều điểm hơn ở vùng khó

**ADASYN** (*Adaptive Synthetic sampling*) giống SMOTE ở cách nội suy, nhưng
**không chia đều** số điểm mới cho mọi điểm class ít. Nó sinh **nhiều điểm
hơn quanh những điểm "khó học"** — những điểm class ít bị bao quanh bởi
nhiều điểm class đông *(cơ chế là bổ sung)*:

```
1. G = tổng số điểm cần sinh (ví dụ để cân bằng: N_đông − N_ít).
2. Với mỗi điểm class ít xᵢ: tìm K láng giềng gần nhất trong TOÀN BỘ dữ liệu,
   đếm Δᵢ = số láng giềng thuộc class đông.  rᵢ = Δᵢ / K.
3. Chuẩn hóa: r̂ᵢ = rᵢ / Σ rⱼ    (tổng các r̂ bằng 1).
4. Số điểm sinh quanh xᵢ:  gᵢ = r̂ᵢ × G   (làm tròn).
5. Mỗi điểm trong gᵢ được tạo bằng nội suy như SMOTE.
```

Điểm class ít nằm giữa "lòng" class của nó (Δ = 0) không được sinh thêm
điểm nào; điểm nằm sát biên giới hoặc lọt giữa class đông được sinh nhiều
nhất. Vì làm tròn từng gᵢ nên tổng có thể lệch 1–2 so với G (Diabetes: ra
**401** thay vì 400).

Ở [[slide:53]], khung *"Resampling with ADASYN"*: so với SMOTE, các điểm xanh
mới **dồn về phía vùng vàng** (giữa và trên hình, nơi hai class chồng lấn),
còn vùng xanh "an toàn" bên phải lại thưa hơn. Đúng tinh thần "tập trung vào
vùng khó".

| Ưu | Nhược |
|---|---|
| Tập trung vào **biên giới** giữa các class — nơi model hay sai | **Nhạy với nhiễu**: một điểm class ít bị gán nhãn sai lọt giữa class đông sẽ được sinh rất nhiều điểm |
| Thích nghi với độ khó của từng vùng | Có thể làm ranh giới bị kéo sâu vào vùng class đông → Precision giảm |

> **EN:** **ADASYN** interpolates like SMOTE but generates **more points
> around hard minority points** — those surrounded by majority points
> *(mechanism supplementary)*: for each minority xᵢ, count Δᵢ majority
> points among its K nearest neighbours (whole dataset), set rᵢ = Δᵢ/K,
> normalise, and generate gᵢ = r̂ᵢ·G points around it. Points deep inside
> their own class (Δ = 0) get none. Rounding can shift the total (401
> instead of 400 on Diabetes). On [[slide:53]], ADASYN's new teal points crowd
> toward the yellow region (the overlap), unlike SMOTE. Pros: focuses on
> the boundary. Cons: **noise-sensitive** — a mislabelled point inside the
> majority gets many synthetic neighbours; may push the boundary into the
> majority region.

## Under-sampling: ClusterCentroids (slide 54)

Hướng ngược lại: **giảm** class đông xuống bằng class ít.

- **RandomUnderSampler** *(bổ sung — không có trên slide)*: bỏ ngẫu nhiên
  các mẫu class đông. Diabetes (train): giữ 214 trong 400 mẫu class 0 → bỏ
  **186 mẫu (46.5%)** — mất gần nửa dữ liệu class 0.
- **ClusterCentroids** ([[slide:54]]): thay vì bỏ ngẫu nhiên, chạy **K-Means**
  (sẽ học ở P08) trên class đông với **K = số mẫu class ít**, rồi **thay cả
  class đông bằng K tâm cụm (centroid)**. Mỗi centroid "tóm tắt" một nhóm
  điểm gần nhau, nên tập mới vẫn **phủ được hình dạng** của class đông dù ít
  điểm hơn nhiều.

**Đọc hình [[slide:54]]:**

- *Resampling with ClusterCentroids* (phải): sau khi resample, **cả 3 class
  chỉ còn khoảng 20 điểm mỗi class** — bằng class ít nhất. Các điểm vàng
  giờ là **centroid**, xếp thành một dải chéo trải đều theo hình dạng đám
  vàng ban đầu, chứ không phải 20 điểm ngẫu nhiên dồn một chỗ.
- *Decision function with ClusterCentroids* (trái): model được huấn luyện
  trên tập nhỏ đó, nhưng hình vẽ **toàn bộ dữ liệu gốc** (đám vàng dày đặc)
  lên trên vùng quyết định. Ba vùng vàng / xanh / tím có diện tích khá cân
  đối; vùng tím chiếm cả nửa dưới. Nhiều điểm vàng ở mép dưới của đám vàng
  rơi vào vùng tím → bị đoán nhầm: cái giá của việc bỏ bớt thông tin class
  đông.

*(Bổ sung)* Trong imbalanced-learn, mặc định ClusterCentroids dùng **chính
centroid** (điểm "nhân tạo", không có trong dữ liệu gốc) với dữ liệu dày; đặt
`voting="hard"` để thay bằng **điểm thật gần centroid nhất**.

| Ưu | Nhược |
|---|---|
| Tập train nhỏ → huấn luyện **nhanh** | **Mất thông tin** của class đông |
| ClusterCentroids giữ được hình dạng phân bố tốt hơn bỏ ngẫu nhiên | Centroid là điểm nhân tạo; K-Means chậm với dữ liệu lớn |
| Hợp khi class đông **rất lớn** (hàng triệu mẫu) | Với dataset nhỏ như Diabetes, bỏ gần nửa class 0 là phí |

> **EN:** **Under-sampling** shrinks the majority class.
> *(Supplementary)* **RandomUnderSampler** drops random majority samples —
> on Diabetes, 186 of 400 (46.5%). **ClusterCentroids** ([[slide:54]]) runs
> **K-Means** (P08) on the majority class with K = minority size and
> replaces it with the K **centroids**, preserving its shape. [[slide:54]]
> right: each class ends with ≈ 20 points; the yellow ones are centroids
> spread along the original band. Left: a model trained on that small set,
> drawn over the full original data — balanced regions, but many yellow
> points fall into the purple region. *(Supplementary)* By default the
> centroids themselves are used; `voting="hard"` uses the nearest real
> samples. Pros: fast, keeps shape. Cons: **loses information** — wasteful
> on small data like Diabetes; best when the majority is huge.

## Quy tắc vàng: chỉ resample tập train (Bổ sung — slide không nói)

**Tuyệt đối không resample tập validation / test.** Lý do:

1. **Tập test phải giống thực tế.** Trong ví dụ Diabetes, tỷ lệ class 1 khoảng 35%; tỷ lệ ở nơi triển khai thật cần đo riêng. Đánh giá trên tập test đã cân bằng 50/50 cho ra
   Precision, F1 **không phản ánh** những gì model sẽ gặp.
2. **Rò rỉ dữ liệu (data leakage).** Nếu resample **trước** khi chia, bản
   sao (RandomOverSampler) hay điểm nội suy (SMOTE) của **cùng một bệnh
   nhân** có thể nằm ở cả train lẫn test → model được "xem trước đề thi".

Thử nghiệm trên Diabetes (Logistic Regression, Stratified 5-fold):

| Cách làm | F1 trung bình |
|---|---|
| SAI — SMOTE toàn bộ dataset rồi mới cross-validate | **0.736** |
| ĐÚNG — SMOTE bên trong từng fold, chỉ trên phần train | 0.684 |
| SAI — RandomOverSampler toàn bộ rồi cross-validate | **0.736** |
| ĐÚNG — RandomOverSampler chỉ trên phần train | 0.660 |

Cách sai cho điểm **cao hơn giả tạo** 5–8 điểm phần trăm. Cách tránh: dùng
**`Pipeline` của imbalanced-learn** (`imblearn.pipeline.Pipeline`), nó tự
động **chỉ resample khi `fit`** (trên train) và **bỏ qua bước resample khi
`predict`** (trên validation/test). `Pipeline` của scikit-learn không làm được
vì sampler không có hàm `transform`.

Thứ tự đúng trong pipeline: **impute ([[bài:missing-values-outliers]]) → scale ([[bài:feature-scaling]]) → resample →
model**. SMOTE/ADASYN/ClusterCentroids cần khoảng cách nên phải scale trước,
và không nội suy được giá trị NaN nên phải impute trước.

> **EN:** *(Supplementary — not on the slides)* **Never resample
> validation/test data**: the test set must mirror reality (≈ 35% positives),
> and resampling before splitting leaks copies or interpolations of the same
> patient into both sets. On Diabetes (Stratified 5-fold), resampling the
> whole dataset first inflates F1 to 0.736 versus 0.684 (SMOTE) and 0.660
> (RandomOverSampler) done correctly. Use **imbalanced-learn's
> `Pipeline`**, which resamples only during `fit` and skips it at
> `predict`; scikit-learn's `Pipeline` can't host samplers. Order: impute →
> scale → resample → model.

## Cách khác: class_weight và đổi ngưỡng (Bổ sung — không có trong slide)

Không cần thay đổi dữ liệu cũng có thể "cân bằng":

**(a) class_weight — tăng trọng số loss cho class ít.** Thay vì nhân bản
mẫu, ta nhân **loss** của mỗi mẫu class ít lên. Với
`class_weight="balanced"`, scikit-learn đặt trọng số

```
w_c = n_mẫu / (n_class × n_mẫu_của_class_c)
```

Diabetes (train 614 mẫu): w₀ = 614 / (2 × 400) ≈ **0.768**, w₁ = 614 / (2 ×
214) ≈ **1.435** → mỗi người bệnh "nặng ký" gấp 1.435 / 0.768 ≈ **1.87** lần
một người khỏe — đúng bằng tỉ lệ 400 / 214. Tổng trọng số hai class bằng
nhau: 400 × 0.768 ≈ 214 × 1.435 ≈ 307. Về bản chất gần giống
RandomOverSampler (trên Diabetes, hai cách cho **cùng** confusion matrix trên
tập test — mục 3.9), nhưng không tạo thêm dữ liệu, nhanh hơn, không cần thư
viện ngoài. Nhiều model hỗ trợ: LogisticRegression, SVC, DecisionTree,
RandomForest… [[bài:svm]] giải thích vai trò C và vì sao `class_weight` có thể làm thay đổi mức phạt vi phạm margin của từng lớp.

**(b) Đổi ngưỡng quyết định (threshold).** [[bài:logistic-regression]] giải thích bằng bảng số vì sao hạ ngưỡng làm recall tăng hoặc giữ nguyên. Logistic Regression cho xác suất;
mặc định đoán 1 khi xác suất ≥ 0.5. Hạ ngưỡng → đoán 1 nhiều hơn → Recall
tăng. Trên tập test Diabetes (model không resample):

| Ngưỡng | Precision | Recall | F1 |
|---|---|---|---|
| 0.5 | 0.600 | 0.500 | 0.545 |
| 0.4 | 0.614 | 0.648 | 0.631 |
| 0.3 | 0.597 | 0.796 | 0.683 |

Nhớ [[bài:roc-auc]]: AUC = 0.813 cho thấy model **xếp hạng** người bệnh khá tốt — vấn
đề Recall thấp phần lớn nằm ở ngưỡng 0.5. Lưu ý: ngưỡng phải chọn trên tập
**validation**, không chọn trên test (bảng trên chỉ để minh họa).

> **EN:** *(Supplementary)* **(a) class_weight**: weight each sample's loss
> instead of duplicating it; `"balanced"` sets w_c = n / (n_classes ×
> n_c) — on Diabetes 0.768 vs 1.435, a 1.87× ratio equal to 400/214. Close
> to RandomOverSampler in effect (identical test confusion matrix here),
> but no extra data and no extra library. **(b) Threshold moving**: lower
> the 0.5 cut-off to predict class 1 more often — 0.4 gives Recall 0.648,
> 0.3 gives 0.796. AUC 0.813 (lesson 13) shows the ranking is decent; the
> low Recall is mostly the threshold. Choose thresholds on validation data,
> not test.

## So sánh trên Diabetes dataset (Bổ sung — thí nghiệm của Claude)

Cùng quy trình như [[bài:ml-pipeline]]: đổi số 0 vô lý → NaN, chia 80/20 `stratify=y`,
`random_state=42` (train 400/214, test 100/54), pipeline impute median →
StandardScaler → [resample] → LogisticRegression. Đánh giá trên tập test
**không resample**, cộng thêm F1 và Recall trung bình Stratified 5-fold trên
toàn bộ dữ liệu (resample bên trong từng fold).

| Cách | Train sau resample | TN, FP, FN, TP | Accuracy | Precision | Recall | F1 | AUC | F1 (CV) | Recall (CV) |
|---|---|---|---|---|---|---|---|---|---|
| Không resample | 400 / 214 | 82, 18, 27, 27 | 0.708 | 0.600 | 0.500 | 0.545 | 0.813 | 0.636 | 0.571 |
| RandomOverSampler | 400 / 400 | 75, 25, 16, 38 | 0.734 | 0.603 | 0.704 | 0.650 | 0.816 | 0.660 | 0.709 |
| SMOTE | 400 / 400 | 74, 26, 19, 35 | 0.708 | 0.574 | 0.648 | 0.609 | 0.811 | **0.684** | 0.739 |
| ADASYN | 400 / 401 | 72, 28, 14, 40 | 0.727 | 0.588 | **0.741** | 0.656 | 0.809 | 0.675 | **0.765** |
| RandomUnderSampler | 214 / 214 | 74, 26, 15, 39 | 0.734 | 0.600 | 0.722 | 0.655 | 0.813 | 0.679 | 0.739 |
| ClusterCentroids | 214 / 214 | 78, 22, 21, 33 | 0.721 | 0.600 | 0.611 | 0.606 | 0.811 | 0.654 | 0.657 |
| class_weight="balanced" | 400 / 214 | 75, 25, 16, 38 | 0.734 | 0.603 | 0.704 | 0.650 | 0.813 | 0.669 | 0.727 |

Đọc bảng:

- **Mọi cách cân bằng đều tăng Recall** rõ rệt (0.50 → 0.61–0.74): phát hiện
  thêm 6–13 người bệnh trong 54 người bệnh ở tập test. Đổi lại FP tăng
  (18 → 22–28): thêm vài người khỏe bị gọi đi xét nghiệm lại — trong y tế
  thường là đánh đổi chấp nhận được.
- **AUC gần như không đổi** (0.809–0.816). Cân bằng dữ liệu chủ yếu **dời
  ranh giới quyết định**, không làm model "giỏi xếp hạng" hơn — giống hiệu
  ứng hạ ngưỡng ở mục 3.8.
- **Accuracy gần như không đổi** — thêm một bằng chứng Accuracy không phải
  thước đo phù hợp ([[bài:classification-metrics]]).
- Trên tập test 154 mẫu, chênh lệch giữa các cách chỉ vài người → **không
  đủ để tuyên bố cách nào thắng**. Cột CV ổn định hơn: SMOTE, ADASYN,
  RandomUnderSampler nhỉnh hơn một chút về F1, nhưng mọi cách cân bằng đều
  hơn hẳn "không làm gì". Với dataset khác, thứ hạng có thể đổi hoàn toàn
  → luôn **thử và đo bằng cross-validation**.
- ClusterCentroids yếu nhất trong nhóm cân bằng ở đây — với dataset nhỏ,
  thay 400 người thật bằng 214 tâm cụm làm mất thông tin.

> **EN:** *(Supplementary — Claude's experiment)* Same setup as lesson
> 15, evaluated on the untouched test set plus Stratified 5-fold CV with
> in-fold resampling. Every balancing method lifts Recall (0.50 →
> 0.61–0.74, catching 6–13 more of 54 diabetic test patients) at the cost
> of a few more FP. **AUC barely moves** (0.809–0.816) — balancing mainly
> shifts the boundary, like lowering the threshold. Accuracy barely moves
> either. On 154 test samples the differences are a handful of patients,
> too few to crown a winner; CV slightly favours SMOTE, ADASYN and random
> under-sampling, but any balancing beats none. Rankings vary by dataset —
> always compare with cross-validation. ClusterCentroids is weakest here:
> on small data, replacing 400 real patients with 214 centroids loses
> information.

## Tổng hợp: chọn cách nào?

| Tình huống | Gợi ý |
|---|---|
| Muốn đơn giản, model hỗ trợ | `class_weight="balanced"` hoặc đổi ngưỡng — thử đầu tiên |
| Dataset nhỏ / vừa, feature số | SMOTE (hoặc ADASYN nếu biên giới khó) |
| Có cột categorical | RandomOverSampler, hoặc SMOTENC |
| Class đông cực lớn, cần huấn luyện nhanh | Under-sampling (Random hoặc ClusterCentroids) |
| Dữ liệu nhiều nhiễu / nhãn sai | Tránh ADASYN; cẩn thận với SMOTE |

Và ba điều không đổi: **(1)** chỉ resample tập train (dùng `imblearn`
Pipeline); **(2)** chia dữ liệu và cross-validate bằng **stratified** (bài
09); **(3)** đánh giá bằng Recall, Precision, F1, AUC — không phải Accuracy
([[bài:classification-metrics]] đến [[bài:roc-auc]]).

> **EN:** Start simple with `class_weight="balanced"` or threshold moving;
> SMOTE (or ADASYN for hard boundaries) for small/medium numeric data;
> RandomOverSampler or SMOTENC with categoricals; under-sampling when the
> majority is huge; avoid ADASYN on noisy labels. Always: resample only the
> training data (imblearn Pipeline), split and validate with
> **stratification** (lesson 09), and judge with Recall/Precision/F1/AUC,
> not accuracy (lessons 12–13).

## Số mẫu sau mỗi cách trên Diabetes (tập train 400 / 214)

| Cách | Class 0 | Class 1 | Tổng | Thay đổi |
|---|---|---|---|---|
| Gốc | 400 | 214 | 614 | — |
| Over-sampling (Random / SMOTE) | 400 | 214 + **186** = 400 | 800 | Thêm 186 mẫu class 1 (86.9% số mẫu class 1 gốc) |
| Under-sampling (Random / ClusterCentroids) | 400 − **186** = 214 | 214 | 428 | Bỏ 186 mẫu class 0 (46.5%) |

Baseline "luôn đoán 0" trên tập test (100 / 54): Accuracy = 100 / 154 ≈
**0.649**, Recall = **0**. Model ADASYN ở mục 3.9 có Accuracy 0.727 — chỉ hơn
baseline 8 điểm — nhưng Recall 0.741, tức tìm được 40 / 54 người bệnh. Đây là
lý do ta nhìn Recall.

## SMOTE bằng tay (tự soạn)

Class ít có 4 điểm 2 chiều: **A(2, 3), B(3, 5), C(5, 3), D(8, 6)**. Dùng
k = 2 láng giềng.

**Bảng khoảng cách Euclid** (chỉ giữa các điểm class ít):

| | A | B | C | D |
|---|---|---|---|---|
| A | — | √(1² + 2²) = **2.236** | √(3² + 0²) = **3.000** | √(6² + 3²) = 6.708 |
| B | 2.236 | — | √(2² + 2²) = **2.828** | √(5² + 1²) = 5.099 |
| C | 3.000 | 2.828 | — | √(3² + 3²) = **4.243** |
| D | 6.708 | 5.099 | 4.243 | — |

**2 láng giềng gần nhất** (số in đậm theo hàng): A → {B, C}; B → {A, C};
C → {B, A}; D → {C, B}.

**Sinh điểm 1:** chọn A, láng giềng C, λ = 0.4

x_new = A + 0.4 × (C − A) = (2, 3) + 0.4 × (3, 0) = (2 + 1.2, 3 + 0) =
**(3.2, 3.0)** — nằm trên đoạn AC, cách A 40% quãng đường.

**Sinh điểm 2:** chọn D, láng giềng C, λ = 0.5

x_new = D + 0.5 × (C − D) = (8, 6) + 0.5 × (−3, −3) = **(6.5, 4.5)** — trung
điểm của DC.

Nhận xét: D nằm xa nhóm A, B, C (khoảng cách gần nhất 4.243). Nếu giữa D và
C có một cụm class đông, điểm (6.5, 4.5) sẽ rơi **ngay giữa vùng class
đông** — đúng nhược điểm của SMOTE ở mục 3.4.

**So với RandomOverSampler:** cần thêm 2 điểm thì bốc ngẫu nhiên có hoàn lại,
ví dụ được B và B → thêm hai bản **(3, 5), (3, 5)** chồng đúng lên B. Không
có điểm mới nào.

## ADASYN: chia số điểm cần sinh (tự soạn)

4 điểm class ít, K = 5 láng giềng (trong toàn bộ dữ liệu), cần sinh G = 8
điểm. Đếm số láng giềng thuộc class đông:

| Điểm | Δ (láng giềng class đông / 5) | r = Δ / 5 | r̂ = r / Σr | g = r̂ × 8 |
|---|---|---|---|---|
| P1 | 1 | 0.2 | 0.2 / 1.6 = 0.125 | **1** |
| P2 | 0 | 0.0 | 0 | **0** |
| P3 | 2 | 0.4 | 0.4 / 1.6 = 0.25 | **2** |
| P4 | 5 | 1.0 | 1.0 / 1.6 = 0.625 | **5** |
| | | Σ = 1.6 | 1 | 8 |

- P2 nằm giữa class của nó → **không** sinh điểm nào.
- P4 bị class đông bao quanh hoàn toàn → nhận **5 / 8** điểm mới. Nếu P4
  thật sự là ca khó ở biên giới → tốt. Nếu P4 là **nhãn sai** (nhiễu) →
  ADASYN đã "nhân bản lỗi" 5 lần.
- SMOTE chọn điểm gốc ngẫu nhiên: kỳ vọng mỗi điểm 2 điểm mới, không bảo đảm đúng 2 cho từng điểm.

## ClusterCentroids bằng tay (tự soạn)

Class đông có 6 điểm: (1, 1), (2, 1), (1, 2) và (8, 8), (9, 8), (8, 9). Class
ít có 2 điểm: (4, 5), (5, 4). Cần giảm class đông xuống **2** điểm → K-Means
với K = 2.

- Cụm 1: (1, 1), (2, 1), (1, 2) → centroid = ((1 + 2 + 1)/3, (1 + 1 + 2)/3) =
  **(1.333, 1.333)**
- Cụm 2: (8, 8), (9, 8), (8, 9) → centroid = ((8 + 9 + 8)/3, (8 + 8 + 9)/3) =
  **(8.333, 8.333)**

Tập sau resample: class 0 = {(1.333, 1.333), (8.333, 8.333)}, class 1 =
{(4, 5), (5, 4)} → 2 / 2. Hai centroid vẫn đại diện cho **cả hai cụm** của
class đông. Nếu bỏ ngẫu nhiên 4 điểm, có thể xui xẻo giữ lại (1, 1) và
(2, 1) — mất hẳn cụm thứ hai.

## class_weight bằng tay

Train Diabetes: n = 614, n₀ = 400, n₁ = 214, 2 class.

- w₀ = 614 / (2 × 400) = 614 / 800 = **0.7675**
- w₁ = 614 / (2 × 214) = 614 / 428 ≈ **1.4346**
- Tỉ lệ w₁ / w₀ = 1.4346 / 0.7675 ≈ **1.869** = 400 / 214 ✓
- Tổng trọng số: 400 × 0.7675 = **307**; 214 × 1.4346 ≈ **307** → hai class
  đóng góp ngang nhau vào loss.

> **EN:** **4.1** Train counts: over-sampling adds 186 class-1 samples
> (800 total); under-sampling removes 186 class-0 samples (46.5%; 428
> total). The always-0 baseline scores 0.649 accuracy with Recall 0; ADASYN
> scores 0.727 but finds 40 of 54 patients. **4.2** SMOTE with minority
> points A(2,3), B(3,5), C(5,3), D(8,6), k = 2: neighbours A→{B,C},
> B→{A,C}, C→{B,A}, D→{C,B}; A + 0.4(C − A) = (3.2, 3.0); D + 0.5(C − D) =
> (6.5, 4.5) — the isolated D may create a point inside a majority cluster.
> RandomOverSampler would just add copies such as (3,5), (3,5). **4.3**
> ADASYN with Δ = 1, 0, 2, 5 (K = 5), G = 8: r = 0.2, 0, 0.4, 1.0 → shares
> 0.125, 0, 0.25, 0.625 → 1, 0, 2, 5 new points; a mislabelled P4 would be
> copied 5 times. **4.4** ClusterCentroids: majority clusters → centroids
> (1.333, 1.333) and (8.333, 8.333), keeping both clusters. **4.5**
> class_weight: w₀ = 0.7675, w₁ ≈ 1.4346, ratio 1.869 = 400/214, each class
> totals ≈ 307.

## Đặt sampler đúng trong imblearn Pipeline

Cần cài thư viện **imbalanced-learn**: `pip install imbalanced-learn` (import
bằng tên `imblearn`). Code trong mục này là *tự soạn* — slide chỉ có hình,
không có code.

## Đếm class và resample thử

```python
import numpy as np
import pandas as pd
from collections import Counter
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import RandomOverSampler, SMOTE, ADASYN
from imblearn.under_sampling import RandomUnderSampler, ClusterCentroids

data = pd.read_csv("diabetes.csv")
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
data[zero_cols] = data[zero_cols].replace(0, np.nan)          # bài 17

X = data.drop(columns="Outcome")
y = data["Outcome"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)          # bài 07, 09
print(Counter(y_train), Counter(y_test))   # {0: 400, 1: 214} {0: 100, 1: 54}

# Impute + scale (fit trên train) trước khi resample
imputer = SimpleImputer(strategy="median").fit(X_train)
scaler = StandardScaler().fit(imputer.transform(X_train))
X_train_s = scaler.transform(imputer.transform(X_train))

for sampler in [RandomOverSampler(random_state=42), SMOTE(random_state=42),
                ADASYN(random_state=42), RandomUnderSampler(random_state=42),
                ClusterCentroids(random_state=42)]:
    X_res, y_res = sampler.fit_resample(X_train_s, y_train)
    print(f"{type(sampler).__name__:20s}", dict(sorted(Counter(y_res).items())))
# RandomOverSampler    {0: 400, 1: 400}
# SMOTE                {0: 400, 1: 400}
# ADASYN               {0: 400, 1: 401}
# RandomUnderSampler   {0: 214, 1: 214}
# ClusterCentroids     {0: 214, 1: 214}
# Tập test KHÔNG resample.
```

## So sánh các cách bằng imblearn Pipeline

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score, roc_auc_score
from imblearn.pipeline import Pipeline       # Pipeline của imblearn, KHÔNG phải sklearn

samplers = {
    "Không resample": None,
    "RandomOverSampler": RandomOverSampler(random_state=42),
    "SMOTE": SMOTE(random_state=42),
    "ADASYN": ADASYN(random_state=42),
    "RandomUnderSampler": RandomUnderSampler(random_state=42),
    "ClusterCentroids": ClusterCentroids(random_state=42),
    "class_weight=balanced": "cw",
}
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

rows = []
for name, s in samplers.items():
    steps = [("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]
    if s not in (None, "cw"):
        steps.append(("resample", s))            # chỉ chạy khi fit (trên train)
    steps.append(("clf", LogisticRegression(
        max_iter=1000, class_weight="balanced" if s == "cw" else None)))
    model = Pipeline(steps)

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)                # predict: bỏ qua bước resample
    y_prob = model.predict_proba(X_test)[:, 1]
    rows.append({
        "cach": name,
        "TN,FP,FN,TP": confusion_matrix(y_test, y_pred).ravel().tolist(),
        "precision": round(precision_score(y_test, y_pred), 3),
        "recall": round(recall_score(y_test, y_pred), 3),
        "f1": round(f1_score(y_test, y_pred), 3),
        "auc": round(roc_auc_score(y_test, y_prob), 3),
        "f1_cv": round(cross_val_score(Pipeline(steps), X, y, cv=cv, scoring="f1").mean(), 3),
    })
print(pd.DataFrame(rows).to_string(index=False))
# Không resample: [82, 18, 27, 27], recall 0.5   -> giống bài 15
# SMOTE:          [74, 26, 19, 35], recall 0.648, f1_cv 0.684
# ADASYN:         [72, 28, 14, 40], recall 0.741, f1_cv 0.675
```

## Cách SAI: resample trước khi chia (để thấy điểm bị thổi phồng)

```python
X_all = StandardScaler().fit_transform(SimpleImputer(strategy="median").fit_transform(X))
X_bad, y_bad = SMOTE(random_state=42).fit_resample(X_all, y)   # SAI: resample cả dataset
wrong = cross_val_score(LogisticRegression(max_iter=1000), X_bad, y_bad,
                        cv=cv, scoring="f1").mean()

right_model = Pipeline([("impute", SimpleImputer(strategy="median")),
                        ("scale", StandardScaler()),
                        ("resample", SMOTE(random_state=42)),
                        ("clf", LogisticRegression(max_iter=1000))])
right = cross_val_score(right_model, X, y, cv=cv, scoring="f1").mean()
print(f"SAI: {wrong:.3f}   ĐÚNG: {right:.3f}")   # SAI: 0.736   ĐÚNG: 0.684
```

## Dựng lại hình kiểu slide 52-54 (dữ liệu tổng hợp 3 class)

```python
import matplotlib
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification

X2, y2 = make_classification(
    n_samples=100, n_features=2, n_informative=2, n_redundant=0, n_repeated=0,
    n_classes=3, n_clusters_per_class=1, weights=[0.05, 0.10, 0.85],
    class_sep=0.8, random_state=0)
print(np.bincount(y2))                     # [ 5 10 85] - tím ít, xanh vừa, vàng đông

def plot_decision(ax, model, X, y, title):
    xx, yy = np.meshgrid(np.linspace(X[:, 0].min() - 1, X[:, 0].max() + 1, 300),
                         np.linspace(X[:, 1].min() - 1, X[:, 1].max() + 1, 300))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=0.4)      # màu nền = vùng quyết định
    ax.scatter(X[:, 0], X[:, 1], c=y, edgecolor="k", s=25)
    ax.set_title(title)

samplers2 = [("Without resampling", None),
             ("RandomOverSampler", RandomOverSampler(random_state=0)),
             ("SMOTE", SMOTE(random_state=0, k_neighbors=3)),
             ("ADASYN", ADASYN(random_state=0, n_neighbors=3)),
             ("ClusterCentroids", ClusterCentroids(random_state=0))]

fig, axes = plt.subplots(2, 5, figsize=(22, 8))
for i, (name, s) in enumerate(samplers2):
    Xr, yr = (X2, y2) if s is None else s.fit_resample(X2, y2)
    clf = LogisticRegression(max_iter=1000).fit(Xr, yr)
    plot_decision(axes[0, i], clf, X2, y2, f"Decision function: {name}")   # hàng trên: như slide 52, 54 trái
    axes[1, i].scatter(Xr[:, 0], Xr[:, 1], c=yr, edgecolor="k", s=25)      # hàng dưới: như slide 53, 54 phải
    axes[1, i].set_title(f"{name}: {np.bincount(yr).tolist()}")
plt.tight_layout()
plt.savefig("balance_data.png", dpi=100)
```

Kết quả: hàng trên, khung *Without resampling* rất giống [[slide:52]] — vùng tím
(class 5 điểm) chỉ là một góc hẹp ở mép trái, hầu hết điểm tím nằm trong vùng
vàng hoặc xanh; các khung có resample thì vùng tím mở rộng chiếm cả góc trái
và nửa trái phía dưới. Hàng dưới, khung
RandomOverSampler trông như dữ liệu gốc (bản sao chồng lên nhau), SMOTE tạo
các vệt điểm nối giữa điểm gốc, ADASYN dồn điểm mới về phía biên giới với
class đông, ClusterCentroids chỉ còn 5 điểm mỗi class. Số mẫu in trên tiêu
đề: `[85, 85, 85]` cho RandomOverSampler và SMOTE, `[84, 86, 85]` cho ADASYN,
`[5, 5, 5]` cho ClusterCentroids.

## Kiểm tra ví dụ tay

```python
from sklearn.cluster import KMeans
from sklearn.utils.class_weight import compute_class_weight

# SMOTE tay
P = {"A": (2, 3), "B": (3, 5), "C": (5, 3), "D": (8, 6)}
A, C, D = (np.array(P[k]) for k in "ACD")
print(A + 0.4 * (C - A), D + 0.5 * (C - D))          # [3.2 3. ] [6.5 4.5]

# ADASYN tay
r = np.array([1, 0, 2, 5]) / 5
print(np.rint(r / r.sum() * 8))                     # [1. 0. 2. 5.]

# ClusterCentroids tay
M = np.array([[1, 1], [2, 1], [1, 2], [8, 8], [9, 8], [8, 9]], dtype=float)
print(KMeans(n_clusters=2, n_init=10, random_state=0).fit(M).cluster_centers_)
# [[8.333 8.333] [1.333 1.333]]

# class_weight tay
print(compute_class_weight("balanced", classes=np.array([0, 1]), y=y_train))
# [0.7675 1.4346]
```

> **EN:** *(Own code — the slides contain no code)* Install
> `imbalanced-learn` (imported as `imblearn`). 5.1 resamples the scaled
> training set with each method and prints class counts. 5.2 compares all
> methods plus `class_weight="balanced"` inside an **imblearn Pipeline**
> (resampling only at `fit`), on the untouched test set and with
> Stratified 5-fold CV. 5.3 shows the inflated score from resampling before
> splitting (0.736 vs 0.684). 5.4 rebuilds [[slide:52-54]]-style plots on
> synthetic 3-class data (5 / 10 / 85 points). 5.5 checks the hand
> examples.

## Thí nghiệm không phải lời hứa cho mọi dữ liệu (bổ sung)

:::note Kiểm lại số liệu (nhận xét)
F1 của RandomUnderSampler từ TP = 39, FP = 26, FN = 15 là 2 × 39 / (2 × 39 + 26 + 15) = 78 / 119 ≈ 0.655462, làm tròn ba chữ số là **0.655**, thay cho 0.656 trong nội dung cũ. Các confusion matrix và kết quả CV trong bảng được chạy đối chiếu lại; đây là kết quả của ví dụ, không là thứ hạng bảo đảm cho dataset khác. Quy tắc resample trong train được giải thích thêm ở [tài liệu imbalanced-learn](https://imbalanced-learn.org/stable/common_pitfalls.html).
:::

:::compare Ba nơi có thể can thiệp
| Cách | Thay đổi | Đánh đổi |
|---|---|---|
| Resampling | Dữ liệu train | Bản sao/nội suy/mất thông tin |
| Class weight | Trọng số loss | Cần model hỗ trợ, có thể đổi calibration |
| Threshold | Quyết định sau score | Recall/precision và tải cảnh báo |
:::

:::pitfall Giữ giới hạn của phép so sánh
Mất cân bằng không tự quyết định model thất bại; còn phụ thuộc overlap, nhãn, loss và threshold. Tổng loss từng class còn phụ thuộc mức sai từng mẫu, không chỉ số mẫu. Bảng Diabetes là thí nghiệm cụ thể, không chứng minh mọi cân bằng luôn tăng chất lượng. SMOTE phân bổ mẫu ngẫu nhiên, không bảo đảm đúng số bằng nhau quanh từng điểm; ADASYN chủ động phân bổ theo độ khó và rounding có thể lệch nhiều hơn 1–2. CV trên toàn dữ liệu trong bảng là minh họa riêng: nếu dùng để chọn model thì phần test cũ không còn độc lập cho lựa chọn đó.
:::

> **EN:** Resampling is not guaranteed to improve performance. Use development-only CV for selection and keep a separate untouched test set; empirical results do not establish a universal ranking.

## Balance data áp dụng cho class, không cho mọi giá trị hiếm (bổ sung từ ghi chú)

Ghi chú của buổi học nhấn mạnh đúng mục tiêu: cho class cần tìm được model gặp đủ hơn, thường là class thiểu số như spam hoặc fraud. Trong bài này **class balancing dành cho classification** vì có số mẫu của từng class. Không đem nhãn liên tục của regression coi mỗi giá trị là một class rồi cân bằng. Regression cũng có thể thiếu mẫu ở vùng target hiếm; đó là bài toán phân bố/đánh trọng số khác, không có nghĩa regression hoàn toàn không có vấn đề dữ liệu lệch.

> **EN:** Class balancing is a classification concept. Regression can still have underrepresented target regions, but these are not discrete classes to balance in the same way.

:::pitfall Gặp nhiều hơn chưa phải đa dạng hơn
Random oversampling tăng số lần gặp mẫu cũ, không tạo thêm quan sát độc lập. SMOTE/ADASYN tạo mẫu tổng hợp dựa vào cấu trúc đã có, có thể làm vùng train dày hơn nhưng không bảo đảm thêm thông tin đúng; nhãn nhiễu có thể bị khuếch đại. Undersampling có thể bỏ mẫu đa số tốt. Chỉ resample **train trong từng fold**, giữ validation/test ở phân bố cần đánh giá. [[bài:classification-metrics]] giải thích vì sao accuracy đơn độc dễ gây hiểu nhầm; nó vẫn có giá trị khi đọc cùng baseline và metric từng class. Nếu “mẫu hiếm” có thể là tín hiệu thật, xem [[bài:missing-values-outliers]] trước khi xóa.
:::

## Tóm tắt 1 phút

:::recap
- Không dùng accuracy đơn độc khi class dương hiếm.
- Stratification giữ tỷ lệ, resampling đổi train.
- Random oversampling không thêm thông tin.
- SMOTE nội suy, ADASYN ưu tiên vùng khó.
- Undersampling có thể mất thông tin đa số.
- Class weight và threshold là baseline đáng thử.
- Resample trong train từng fold, đánh giá phân bố thật.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Stratified K-fold ([[bài:stratified-k-fold]]) và SMOTE đều liên quan đến dữ liệu
mất cân bằng. Chúng khác nhau thế nào? Có dùng cùng lúc được không?
A: Stratified K-fold **giữ nguyên** tỉ lệ class ở mọi fold để
**đánh giá** công bằng; nó không cân bằng gì cả. SMOTE **thay đổi** tỉ lệ
class trong **tập train** để model **học** tốt class ít. Dùng cùng lúc
được và nên dùng: chia fold bằng stratified, rồi SMOTE chỉ phần train của
mỗi fold (imblearn Pipeline).
EN: How do Stratified K-fold and SMOTE differ? Can they be combined?
**A:** Stratification **preserves** class ratios per fold for fair
> evaluation; SMOTE **changes** the training ratio so the model learns
> the minority. Combine them: stratified folds, SMOTE on each training
> part (imblearn Pipeline).

Q: Tập train có 900 mẫu class 0 và 100 mẫu class 1. Sau
RandomOverSampler và sau RandomUnderSampler (cân bằng hoàn toàn) mỗi class
còn bao nhiêu mẫu? Mỗi cách thêm / bỏ bao nhiêu?
A: Over-sampling: 900 / 900 — thêm **800** bản sao class 1 (mỗi
mẫu class 1 xuất hiện trung bình 9 lần → nguy cơ overfitting). Under-
sampling: 100 / 100 — bỏ **800** mẫu class 0 (mất 88.9% dữ liệu class 0).
EN: 900 vs 100 training samples — counts after full over- and
under-sampling?
**A:** 900/900 (800 copies added, each minority sample ≈ 9 times —
> overfitting risk); 100/100 (800 majority samples dropped, 88.9%).

Q: Dùng SMOTE với xᵢ = (4, 10), láng giềng x_nn = (6, 4), λ = 0.25.
Tính điểm mới.
A: x_nn − xᵢ = (2, −6); x_new = (4, 10) + 0.25 × (2, −6) = (4 +
0.5, 10 − 1.5) = **(4.5, 8.5)**.
EN: SMOTE with xᵢ = (4, 10), x_nn = (6, 4), λ = 0.25?
**A:** (4.5, 8.5).

Q: Một bạn SMOTE toàn bộ Diabetes dataset rồi mới chia train/test và
được F1 = 0.74, cao hơn hẳn bạn khác (0.68). Kết quả nào đáng tin hơn? Vì
sao?
A: 0.68. Resample trước khi chia làm **rò rỉ dữ liệu**: điểm nội
suy từ cùng một bệnh nhân nằm cả ở train và test; tập test còn bị cân bằng
50/50, không giống thực tế (≈ 35% bệnh). Chỉ được resample tập train.
EN: SMOTE on the whole dataset before splitting gives F1 0.74 vs
0.68 done correctly. Which to trust?
**A:** 0.68 — resampling first leaks synthetic copies across the split
> and makes the test set unrealistically balanced.

Q: ADASYN khác SMOTE ở điểm nào? Khi nào ADASYN có thể gây hại?
A: ADASYN sinh **nhiều điểm hơn quanh những điểm class ít bị
class đông bao quanh** (vùng khó, gần biên giới); SMOTE chọn điểm gốc ngẫu nhiên thay vì phân bổ chủ động theo độ khó. ADASYN
gây hại khi dữ liệu **có nhiễu / nhãn sai**: một điểm bị gán nhãn sai nằm
giữa class đông sẽ được sinh rất nhiều điểm giả, kéo ranh giới vào sâu
vùng class đông.
EN: ADASYN vs SMOTE; when does ADASYN hurt?
**A:** ADASYN generates more points around minority samples surrounded
> by the majority; it hurts with noisy labels, multiplying mislabelled
> points and pushing the boundary into the majority region.

Q: Sau khi cân bằng, Recall trên Diabetes tăng từ 0.50 lên khoảng
0.70 nhưng AUC gần như không đổi (≈ 0.81). Giải thích.
A: AUC đo khả năng **xếp hạng** người bệnh cao hơn người khỏe ở
**mọi ngưỡng** ([[bài:roc-auc]]). Cân bằng dữ liệu chủ yếu **dời ranh giới quyết
định** (giống hạ ngưỡng) — model đoán "bệnh" nhiều hơn nên Recall tăng,
nhưng thứ tự xếp hạng gần như giữ nguyên nên AUC không đổi. Vì vậy hạ
ngưỡng hoặc class_weight cũng cho hiệu quả tương tự.
EN: Recall rises from 0.50 to ≈ 0.70 but AUC stays ≈ 0.81. Why?
**A:** AUC measures ranking across all thresholds; balancing mainly
> shifts the decision boundary (like lowering the threshold), so Recall
> rises while the ranking — and AUC — barely changes.
Q: Nhân bản một mẫu thiểu số nhiều lần có tạo nhiều quan sát độc lập không?
A: Không. Nó tăng trọng lượng hoặc số lần mẫu đó xuất hiện trong quá trình học, không làm đa dạng nguồn quan sát. Mẫu tổng hợp cũng cần kiểm chứng, không tự có thông tin thật mới.
@tier B | Phỏng vấn lý thuyết
Q: Vì sao SMOTE trước split gây leakage?
A: Mẫu tổng hợp dùng thông tin láng giềng trên toàn dataset nên có thể phụ thuộc các mẫu sau đó thuộc validation/test. Ngoài ra tập đánh giá bị đổi tỷ lệ. Split trước và đặt sampler trong pipeline từng fold.
EN: Resampling before splitting can leak neighbor information and alter the evaluation class distribution.
Q: SMOTE có luôn hơn nhân bản?
A: Không. Nó mở rộng vùng thiểu số nhưng có thể nội suy qua vùng sai hoặc từ nhãn nhiễu. Random oversampling đơn giản và giữ category; cần so trên cùng validation theo mục tiêu.
EN: SMOTE can generate unhelpful or invalid samples; it is not universally better than random oversampling.
Q: Class weight khác resampling và threshold?
A: Weight đổi đóng góp loss trong train, resampling đổi dữ liệu train, threshold đổi quyết định từ score sau học. Hiệu ứng có thể gần nhau nhưng không tương đương mọi model hay regularization.
EN: Class weighting changes the objective, resampling changes training data, and thresholding changes decisions after scoring.
Q: ADASYN có rủi ro nào với nhãn sai?
A: Điểm thiểu số nằm giữa đa số được coi khó và sinh nhiều mẫu quanh nó. Nếu nhãn gốc sai, ADASYN khuếch đại nhiễu; cần kiểm tra nhãn và overlap trước khi tăng độ phức tạp.
EN: ADASYN can amplify mislabeled minority samples surrounded by majority neighbors.
Q: “Hồi quy không có mất cân bằng” nên hiểu thế nào trong bài này?
A: Regression không có các class rời rạc để cân bằng số lượng theo cách đang học. Tuy vậy target liên tục có thể có vùng hiếm và mô hình dự đoán kém ở vùng đó; phải thiết kế đánh giá/trọng số phù hợp chứ không phủ nhận vấn đề.
EN: Regression lacks discrete classes to balance, but rare target regions can still be underrepresented.
@tier C | Tình huống doanh nghiệp
Q: Fraud 0.1%, chọn SMOTE hay class_weight?
A: Giữ split thời gian/nhóm phù hợp và validation tỷ lệ thật, xây baseline score, weight và threshold trước. Đo PR, recall ở ngân sách duyệt và chi phí; thử SMOTE chỉ train nếu feature và láng giềng có nghĩa. Nội suy có thể tạo giao dịch không hợp lệ, weight đơn giản hơn nhưng vẫn cần chọn ngưỡng *(bổ sung)*.
WANT: Biết bắt đầu đơn giản, đánh giá đúng phân bố và kiểm tra tính hợp lệ mẫu tổng hợp.
Q: Recall tăng sau SMOTE nhưng đội duyệt quá tải. Có thành công?
A: Đếm FP và cảnh báo/ngày, precision ở ngưỡng đang dùng và giá trị fraud bắt thêm. Chọn ngưỡng trên validation theo công suất, cân nhắc tỷ lệ resampling nhỏ hơn. Thành công là lợi ích sau chi phí, không riêng recall *(bổ sung)*.
WANT: Biện luận chất lượng ở điểm vận hành và giới hạn nguồn lực.
Q: Dữ liệu chứa mã sản phẩm one-hot, team muốn SMOTE thường. Bạn xử lý sao?
A: Nội suy có thể tạo giá trị category phân số không hợp lệ. Thử RandomOverSampler hoặc SMOTENC khi còn cấu trúc categorical và tiền xử lý đúng; so baseline weight. Giữ pipeline trong fold và kiểm tra schema đầu ra, đánh đổi đơn giản với khả năng mô tả vùng thiểu số *(bổ sung)*.
WANT: Không áp khoảng cách và nội suy số liên tục một cách máy móc.
Q: Khách VIP rất hiếm trong model dự đoán doanh thu. Có SMOTE nhãn doanh thu như các class được không?
A: Không coi từng con số doanh thu là một class. Phân tích lỗi theo vùng target và nhóm khách, xác định chi phí rồi thử trọng số hoặc cách lấy mẫu phù hợp regression. Đánh giá trên phân bố triển khai, tránh áp kỹ thuật class balancing chỉ vì thấy nhóm hiếm.
WANT: Phân biệt bài toán class imbalance với target liên tục phân bố lệch.
:::

## Nối sang bài sau

:::next
Đã hoàn tất các phần chính của Step 3. [[bài:data-visualization]] chuyển sang Step 4: nhìn phân bố và quan hệ bằng biểu đồ trước khi chọn mô hình. Giữ [[bài:classification-metrics]] và [[bài:roc-auc]] làm công cụ kiểm chứng hiệu quả của cân bằng.
:::
