# Handoff cho Codex — Tái cấu trúc ML Learning Hub (phần còn lại)

> Đọc toàn bộ file này **trước khi sửa bất cứ thứ gì**. Đọc thêm `project-brief.md` (design Notebook đã chốt — màu, font, hiệu ứng lật trang) và `roadmap.json`.
> Người dùng nói tiếng Việt; mọi nội dung bài viết bằng tiếng Việt (kèm thuật ngữ/khối EN theo quy ước bên dưới). Ghi chú commit/PR bằng tiếng Anh hoặc Việt đều được, ngắn gọn.

---

## 1. Bối cảnh & mục tiêu

Dự án: site Next.js 14 (App Router, Tailwind, TypeScript) ghi chú tự học khóa **"Data Science / Machine Learning / Python course"** (slide gốc: `Data Science_Machine Learning course.pdf`, 177 slide). 21 bài của Module 01 nằm ở `content/01-machine-learning/*.md`, thứ tự lấy từ `roadmap.json`.

Người học dùng site để **ôn lại**, và muốn:
1. Mỗi bài đọc xong **hiểu thật sự**, không chỉ chép slide.
2. Bố cục mỗi bài **không cần giống nhau** — tùy bản chất bài (toán, khái niệm, so sánh, code) — nhưng dễ nhìn, dễ quét.
3. **Liên kết giữa các bài** (bài trước → bài này → bài sau; link bấm được).
4. **Xem slide gốc trực tiếp** ngay trong bài.
5. **Câu hỏi** vừa để hiểu bài, vừa luyện **phỏng vấn lý thuyết** và **tình huống doanh nghiệp**.

### Trạng thái hiện tại (đã làm xong — KHÔNG làm lại)

- Hạ tầng đã code và build pass: slide viewer, parser container, Quiz 3 tầng, LessonMap, liên kết chéo, backlinks.
- **3 bài pilot đã viết lại xong và được người dùng duyệt**: `06-loss-function.md`, `12-classification-metrics.md`, `18-feature-scaling.md`. **Dùng 3 bài này làm mẫu chuẩn** cho mọi bài còn lại.
- 18 bài còn lại vẫn theo **khung cũ 6 mục đánh số** (`## 1. Ý tưởng` … `## 6. Câu hỏi tự kiểm tra`). Parser còn tương thích ngược nên chúng vẫn render bình thường cho tới khi được chuyển.

### Việc cần làm (tóm tắt)

| # | Việc | Mục |
|---|---|---|
| A | Chuyển 18 bài còn lại sang khung mới (+ slide + liên kết + quiz 3 tầng) | §6–§8 |
| B | Trang ngân hàng phỏng vấn `/phong-van` | §9.1 |
| C | Trang index module `/[moduleId]` + bản đồ phụ thuộc bài | §9.2 |
| D | Dọn legacy, cập nhật `project-brief.md` | §9.3 |
| E | Kiểm chứng toàn bộ | §10 |

Thứ tự khuyến nghị: **A theo nhóm → B → C → D → E**. Làm xong mỗi nhóm bài thì chạy build + commit riêng.

---

## 2. Cấu trúc repo (các file liên quan)

```
content/01-machine-learning/NN-<slug>.md   # nội dung bài (21 file)
roadmap.json                               # nguồn sự thật duy nhất: module/topic/thứ tự/file
lib/blocks.ts                              # parser container ::: (thuần, không fs) — QUAN TRỌNG
lib/markdown.ts                            # đọc file, tách ## section, expand [[bài:..]] [[slide:..]], backlinks
lib/renderMarkdown.ts                      # marked renderer: en-block, answer-block, code copy, parseFormulaLayout
lib/roadmap.ts                             # getRoadmap, getAllFlattenedTopics, getAdjacentTopics
components/DynamicTopicPanels.tsx          # render section → block (md/box/formula/slides/quiz); legacy path
components/SlideViewer.tsx                 # SlideViewer, SlideLightbox, SlideButton, openSlides()
components/Quiz.tsx                        # quiz 3 tầng, đáp án ẩn/hiện
components/LessonMap.tsx                   # prev → current → next + backlinks
components/TopicTOC.tsx                    # mục lục sticky sinh từ section thật
app/[moduleId]/[topicId]/page.tsx          # trang bài
app/globals.css                            # style .notebook-prose, .lesson-chip, .slide-chip …
scripts/render-slides.py                   # PDF → public/slides/slide-NNN.webp (+ manifest.json) — đã chạy, ảnh đã có
public/slides/slide-001.webp … 177         # đã sinh sẵn (3.6MB)
```

Lệnh: `npm run dev`, `npm run build`, `npx tsc --noEmit`. Windows + Git Bash/PowerShell. **Đừng dùng heredoc dài trong bash để tạo file nhiều dòng chứa dấu nháy — hãy dùng công cụ ghi file của bạn.**

---

## 3. Cú pháp nội dung (spec đầy đủ)

### 3.1 Frontmatter

```yaml
---
title: Tên bài                    # bắt buộc, giữ đúng như roadmap.json
order: 6                          # bắt buộc
description: 1–2 câu hiển thị dưới H1 (nghiêng).   # BẮT BUỘC cho bài mới (thay thế switch cứng trong page.tsx)
slides: 19-21                     # dải slide gốc của bài (số đơn "47" cũng được) → sinh nút "Xem slide gốc"
needs: [model-training-pipeline]  # id các bài tiên quyết (id trong roadmap.json) → hiện trong LessonMap
tags: [loss, L1, L2]              # dùng cho trang /phong-van để lọc
---
```

### 3.2 Mục (section)

- Mỗi `## Tiêu đề` là **một khung giấy** (paper card) và một mục trên mục lục bên trái. **Tên mục tự đặt theo nội dung bài**, KHÔNG đánh số `1.`–`6.` (nếu **mọi** heading đều có dạng `N. …` thì parser coi là bài legacy — tránh điều này ở bài mới).
- Dùng `###` cho tiêu đề phụ bên trong mục. Không dùng `#`.
- Heading `##` bên trong code fence không bị tách (parser tôn trọng fence).
- `id` mục = slug của tiêu đề (bỏ dấu); không cần tự đặt.

### 3.3 Container `:::`

Cú pháp (đặt ở đầu dòng, không thụt lề, **không lồng container trong container**; code fence bên trong thì được):

```
:::tên tham-số-tùy-chọn
nội dung markdown
:::
```

| Container | Dùng cho | Tham số |
|---|---|---|
| `:::intro [tiêu đề]` | Mở đầu bài: 2–4 gạch "Đọc xong bài này bạn làm được…" | tiêu đề tùy chọn |
| `:::slides A-B \| chú thích` | Nhúng viewer slide A→B (một slide: `:::slides 47 \| …`) | dải slide, chú thích |
| `:::formula` | Công thức 2 cột. Mỗi công thức = 1 đoạn mở đầu bằng **chữ đậm** + 1 code block + (tùy chọn) `<!-- note: chú thích tay đỏ -->` ngay sau code. ≥2 công thức → 2 cột | — |
| `:::worked [tiêu đề]` | Ví dụ tay: bảng số liệu + từng bước tính | tiêu đề |
| `:::compare [tiêu đề]` | Bảng so sánh | tiêu đề |
| `:::pitfall [tiêu đề]` | Bẫy / lỗi hay gặp (nền đỏ nhạt) | tiêu đề |
| `:::note [tiêu đề]` | Ghi chú phụ, nhận xét về lời diễn đạt của slide | tiêu đề |
| `:::recap` | **Tóm tắt 1 phút** (5–8 gạch + tùy chọn bảng "khi nào dùng") | — |
| `:::next` | **Nối sang bài sau** (1–3 câu + link) | — |
| `:::quiz` | Câu hỏi 3 tầng — xem §3.5 | — |

Container lạ → được giữ như markdown thường (không mất chữ).

### 3.4 Liên kết ngắn (expand lúc đọc file, lib/markdown.ts)

- `[[bài:loss-function]]` → chip link tới bài, chữ lấy từ tiêu đề trong `roadmap.json`. Có nhãn riêng: `[[bài:loss-function|xem Loss]]`. Id sai → in đậm id, **không báo lỗi** → bạn phải tự kiểm id (xem §10).
- `[[slide:50]]` hoặc `[[slide:48-51]]` → nút bấm mở lightbox slide.
- Đừng viết "bài 11" trơn; dùng `[[bài:confusion-matrix]]` để người đọc bấm được. (Trong code block/ASCII diagram có thể giữ chữ thường.)
- Mỗi bài nên có link chéo: ít nhất tới bài tiên quyết (trong `:::intro` hoặc đoạn mở đầu) và bài kế (trong `:::next`), cộng thêm link tại chỗ nào kiến thức được dùng lại.

Bảng id bài (từ `roadmap.json`):
`what-is-ml, feature-and-data-types, learning-paradigms, labeled-data, model-training-pipeline, loss-function, train-test-split, k-fold-cross-validation, stratified-k-fold, classification-vs-regression, confusion-matrix, classification-metrics, roc-auc, regression-metrics, ml-pipeline, descriptive-statistics, missing-values-outliers, feature-scaling, categorical-encoding, correlation-multicollinearity, imbalanced-data`

### 3.5 Quiz — định dạng chính xác

```
:::quiz
@tier A | Hiểu bài
Q: Câu hỏi (có thể nhiều dòng, markdown, code fence)
A: Đáp án (nhiều dòng được)
Q: ...
A: ...
@tier B | Phỏng vấn lý thuyết
Q: **B1.** Câu hỏi
A: Đáp án theo khung: ý chính → giải thích → ví dụ
EN: Một–hai câu trả lời tiếng Anh dùng đúng thuật ngữ ngành
@tier C | Tình huống doanh nghiệp
Q: **C1.** Tình huống
A: Cách xử lý có thứ tự + lý do + đánh đổi
WANT: Người phỏng vấn thật sự muốn nghe điều gì (1–2 câu)
:::
```

Quy tắc parser: dòng bắt đầu bằng `@tier X | tiêu đề`, `Q:`, `A:`, `EN:`, `WANT:` là marker; mọi dòng sau tiếp nối trường hiện tại tới marker kế. **Không để dòng nào trong đáp án tự bắt đầu bằng `Q:`/`A:`/`EN:`/`WANT:`/`@tier`** (trừ trong code fence). Mỗi `Q:` bắt đầu một câu mới. Thiếu tầng nào thì tầng đó không hiện tab.

Số câu tối thiểu mỗi bài (bài ngắn có thể ở mức thấp, bài dài ở mức cao):

| Tầng | Nội dung | Tối thiểu |
|---|---|---|
| A — Hiểu bài | Khái niệm + tính tay có số, bẫy hiểu nhầm. Giữ lại các câu hỏi cũ đang có trong bài (đừng làm mất), bổ sung nếu thiếu | 4–7 |
| B — Phỏng vấn lý thuyết | "Giải thích X cho người mới", "X khác Y thế nào", "Vì sao…", "Khi nào dùng…", "Điều gì xảy ra nếu…". Mỗi câu có **`EN:`** | 4–6 |
| C — Tình huống doanh nghiệp | Bối cảnh thật (tài chính, y tế, e-commerce, quảng cáo, vận hành): chọn metric/kỹ thuật, debug "sao model tệ ngoài thực tế", đánh đổi chi phí. Mỗi câu có **`WANT:`** | 3–4 |

Tiêu chí câu hỏi tốt: (1) trả lời được bằng lời trong 30–90 giây; (2) có số liệu kiểm chứng được khi là câu tính; (3) tầng C không có đáp án "một dòng" — phải biện luận và nêu đánh đổi; (4) không lặp ý giữa các tầng; (5) không hỏi thứ bài không dạy (nếu cần kiến thức bổ sung, giải thích ngắn trong đáp án và gắn nhãn *bổ sung*).

### 3.6 Khối EN (quy ước cũ, vẫn giữ)

Ngay dưới mỗi đoạn giải thích chính (không áp dụng cho bảng số, code, công thức) thêm blockquote:

```
> **EN:** Bản tiếng Anh ngắn, thuật ngữ ngành chuẩn, không dịch word-by-word.
```

Trong bài mới có thể gộp: 1 khối EN cho 1 cụm đoạn thay vì sau từng đoạn nhỏ, để bài không phình. Không cần khối EN cho `:::intro`, `:::recap`, `:::quiz` (quiz dùng trường `EN:`).

### 3.7 Quy ước chữ/ký tự

- Tránh ký tự `½`, `⅓`… (font mono bị lỗi, hiện `%`). Viết `1/2`.
- Dấu `|` trong ô bảng markdown viết `\|`.
- Khi trích số liệu từ slide, **giữ đúng số trên slide**; nếu slide sai/diễn đạt lệch, ghi trong `:::note` kèm "(nhận xét)". Nội dung không có trong slide gắn nhãn *(bổ sung)* ở tiêu đề mục/ghi chú.

---

## 4. Khung mới của một bài (tham khảo từ pilot)

Mọi bài có "xương sống" nhẹ sau; **phần giữa tự do**:

1. **Mở đầu** (mục đầu tiên, tên là câu hỏi/vấn đề của bài): `:::intro` (mục tiêu) → 1–3 đoạn dẫn dắt có link tới bài tiên quyết → **slide gốc** (`:::slides`).
2. **Thân bài**: các mục `##` đặt tên theo nội dung. Công cụ: `:::formula`, `:::worked`, `:::compare`, `:::pitfall`, `:::note`, code block, sơ đồ ASCII.
3. **Code** (mục riêng nếu có code; tự cài đặt từ đầu rồi đối chiếu thư viện).
4. **Tóm tắt 1 phút**: `:::recap`.
5. **Câu hỏi tự kiểm tra**: `:::quiz` 3 tầng.
6. **Nối sang bài sau**: `:::next` với link.

Phân hóa theo loại bài (xem pilot):
- **Bài thiên toán** (vd 06 Loss): intro → formula → worked → code → recap → quiz.
- **Bài dài nhiều khái niệm** (vd 12 Metrics): slide → mỗi khái niệm một mục → `:::pitfall` → `:::compare` bảng chọn → worked → code → recap → quiz đầy đủ.
- **Bài so sánh kỹ thuật + code** (vd 18 Scaling): vấn đề → đọc code slide → công thức → `:::compare` → quy tắc/pitfall → worked → code → recap → quiz.
- **Bài khái niệm ngắn** (vd 01–05): ít mục, nhiều sơ đồ/ví dụ đời thường, quiz tối thiểu vẫn đủ 3 tầng (A 3–4, B 3–4, C 2–3).

**Không được làm mất kiến thức**: toàn bộ nội dung hiện có (ví dụ tay, code, giải thích, nhận xét về lỗi slide, mục *bổ sung*) phải còn trong bài mới — chỉ **sắp xếp lại và làm rõ**, rồi **bổ sung** phần phỏng vấn/liên kết. Được rút gọn chỗ lặp, không được bỏ ý.

---

## 5. Cách chuyển một bài (quy trình lặp cho từng bài)

1. Đọc bài hiện tại + bài trước/sau trong `roadmap.json` để nắm mạch.
2. Mở slide tương ứng (bảng §6; ảnh ở `public/slides/slide-NNN.webp`) — đối chiếu số liệu, chú thích tay, hình. Dùng slide làm chuẩn khi nội dung cũ có chỗ lệch.
3. Lên dàn ý: đặt tên các mục theo **bản chất** bài (không theo khung 6 mục). Ghi nhanh: bài tiên quyết, bài kế, 3–5 thuật ngữ/khái niệm chính.
4. Viết lại file `.md`: frontmatter đầy đủ → các mục → recap → quiz → next. Giữ mọi ví dụ tay + code.
5. **Kiểm số liệu**: mọi con số trong ví dụ/đáp án mới phải được tính lại bằng Python (hoặc tay) — ghi script tạm ở thư mục scratchpad, không commit.
6. Kiểm id link: mọi `[[bài:…]]` phải khớp bảng id §3.4.
7. `npx next build` + mở trang bài, xem: mục lục, viewer slide, quiz 3 tab, link chip, bảng không tràn ngang trên mobile (≈390px).
8. Commit riêng mỗi nhóm bài (xem §11).

---

## 6. Ánh xạ bài ↔ slide (đã đối chiếu bằng ảnh)

Điền vào frontmatter `slides:` và nhúng `:::slides` ở đúng chỗ (đầu bài, hoặc gần chỗ nói về slide đó; bài dài có thể nhúng nhiều lần cho từng đoạn slide):

| Bài (id) | File | `slides:` | Ghi chú nội dung slide |
|---|---|---|---|
| what-is-ml | 01 | 3-6 | 4 Venn AI/ML/DL/DS; 5 tổng quan khái niệm; 6 Input→Model→Output |
| feature-and-data-types | 02 | 7-8 | 7 Adult dataset (tabular); 8 Feature: numerical vs categorical |
| learning-paradigms | 03 | 9-10 | 9 Supervised/Unsupervised/Reinforcement (nhiều chú thích tay) |
| labeled-data | 04 | 11-16 | sample, feature, label, feature vector, feature matrix X, label vector y |
| model-training-pipeline | 05 | 17-18 | Model training, loss, update |
| loss-function | 06 | 19-21 | **đã xong** |
| train-test-split | 07 | 22 | Train/Validation/Test (nhiều chú thích tay) |
| k-fold-cross-validation | 08 | 23-24 | K-fold viết tay; 24 gồm cả Stratified |
| stratified-k-fold | 09 | 24 | bảng Cat/Dog theo fold (slide 24 ghi sai tổng Dog — giữ nhận xét hiện có) |
| classification-vs-regression | 10 | 25-26 | 25 Classification vs Regression; 26 các dạng classification |
| confusion-matrix | 11 | 27-32 | 27 dog vs cat; 28–32 dựng ma trận TP/FP/FN/TN |
| classification-metrics | 12 | 33-36 | **đã xong** |
| roc-auc | 13 | 37 | ROC + bảng TPR/FPR |
| regression-metrics | 14 | 38 | MAE, RMSE trên ví dụ giá nhà |
| ml-pipeline | 15 | 39 | pipeline 7 bước |
| descriptive-statistics | 16 | 40-44 | Step 2: xem dữ liệu, dtypes, describe(), phân bố class |
| missing-values-outliers | 17 | 45-46 | 45 Step 3.1 (missing); 46 Step 3.2 (outliers) |
| feature-scaling | 18 | 47 | **đã xong** |
| categorical-encoding | 19 | 48-49 | 48 OrdinalEncoder; 49 các encoder tiếp theo |
| correlation-multicollinearity | 20 | 50-51 | Step 3.4 |
| imbalanced-data | 21 | 52-54 | 52 RandomOverSampler/SMOTE hình; 53–54 ADASYN, ClusterCentroids |

Nếu khi đối chiếu ảnh thấy dải khác (ví dụ bài 19 thực ra dùng cả slide 50), **sửa theo ảnh** và ghi chú trong commit. Số trong nội dung cũ có dạng "slide 49" thì thay bằng `[[slide:49]]` (chip bấm được).

---

## 7. Đề xuất `needs`, `tags`, và gợi ý nội dung phỏng vấn theo bài

> Gợi ý để định hướng — **đừng chép máy móc**; đọc nội dung bài thật và đối chiếu. Tầng C phải có bối cảnh doanh nghiệp cụ thể.

| Bài | `needs` | `tags` gợi ý | Hướng câu hỏi B (lý thuyết) | Hướng câu hỏi C (doanh nghiệp) |
|---|---|---|---|---|
| 01 what-is-ml | — | ai, ml, dl, data-science | AI vs ML vs DL vs DS; ML khác lập trình truyền thống thế nào | Khi nào KHÔNG nên dùng ML (rule-based đủ); chọn ML cho bài toán nào của công ty |
| 02 feature-and-data-types | what-is-ml | feature, numerical, categorical | numerical vs categorical, ordinal vs nominal; vì sao kiểu dữ liệu quyết định tiền xử lý | Cột "mã bưu điện", "ID khách hàng" — số hay categorical? hậu quả nếu coi sai |
| 03 learning-paradigms | what-is-ml | supervised, unsupervised, reinforcement | 3 paradigm khác nhau; semi-supervised; ví dụ mỗi loại | Công ty có nhiều dữ liệu nhưng ít nhãn → làm gì; chi phí gán nhãn |
| 04 labeled-data | feature-and-data-types, learning-paradigms | X, y, label, sample | feature matrix/label vector; shape của X, y | Nhãn nhiễu/sai; nhãn lấy từ hành vi người dùng có thiên lệch gì |
| 05 model-training-pipeline | labeled-data | training, prediction, loss | vòng lặp predict→loss→update | Vì sao train lâu; theo dõi quá trình train |
| 07 train-test-split | loss-function | split, validation, test, leakage | vai trò train/val/test; vì sao không tune trên test | Rò rỉ dữ liệu theo thời gian (dữ liệu chuỗi thời gian chia ngẫu nhiên) |
| 08 k-fold | train-test-split | cross-validation, k-fold | K-fold hoạt động ra sao; chọn K; trade-off | Dữ liệu ít, train đắt → chọn CV thế nào; leakage khi tiền xử lý trước CV |
| 09 stratified-k-fold | k-fold-cross-validation | stratified, imbalanced | vì sao cần stratify | Tỉ lệ class 1:99 mà fold ngẫu nhiên ra fold không có class thiểu số |
| 10 classification-vs-regression | learning-paradigms | classification, regression | phân biệt; binary/multiclass/multilabel | Biến mục tiêu "số sao 1–5": classification hay regression? ordinal? |
| 11 confusion-matrix | classification-vs-regression | TP, FP, FN, TN | đọc ma trận; Type I/II error | Chọn "class dương" thế nào cho bài toán thực |
| 13 roc-auc | classification-metrics | roc, auc, tpr, fpr | AUC nghĩa là gì (xác suất xếp hạng); AUC=0.5, <0.5 | ROC vs PR curve khi mất cân bằng; chọn ngưỡng vận hành |
| 14 regression-metrics | loss-function | mae, rmse, regression | MAE vs RMSE nhạy outlier | Dự báo nhu cầu: chọn metric khi thiếu hàng đắt hơn thừa hàng |
| 15 ml-pipeline | (các bài nền) | pipeline, workflow | 7 bước; thứ tự đúng và vì sao | Dự án ML thất bại thường ở bước nào; đưa lên production |
| 16 descriptive-statistics | ml-pipeline | describe, mean, median, std, dtypes | mean vs median; std chia n vs n−1; đọc describe() | Phát hiện dữ liệu bất thường chỉ bằng thống kê mô tả |
| 17 missing-values-outliers | descriptive-statistics | missing, imputation, outlier, iqr, zscore | các dạng thiếu (MCAR/MAR/MNAR) *(bổ sung)*; impute mean vs median; IQR vs z-score | Giá trị 0 là "thiếu"; outlier là lỗi hay tín hiệu (gian lận) |
| 19 categorical-encoding | feature-and-data-types, feature-scaling | encoding, one-hot, ordinal, hash, embedding | ordinal vs one-hot; dummy variable trap; cardinality cao | Cột có 50.000 giá trị (mã sản phẩm) → hash/embedding/target encoding; category mới khi serving |
| 20 correlation-multicollinearity | feature-scaling | correlation, multicollinearity, vif | tương quan ≠ nhân quả; đa cộng tuyến ảnh hưởng gì | Hai feature tương quan 0.95 — bỏ cái nào, vì sao; diễn giải hệ số |
| 21 imbalanced-data | classification-metrics, stratified-k-fold | smote, oversampling, undersampling, class-weight | các kỹ thuật resample; vì sao chỉ resample train | Fraud 0.1%: chọn SMOTE/class_weight/đổi ngưỡng; rò rỉ nếu resample trước split |

Với bài đã có sẵn câu hỏi cũ (2–6 câu): **chuyển nguyên vào tầng A** (giữ đáp án), rồi bổ sung tầng B/C.

---

## 8. Danh sách việc A — chuyển 18 bài (chia nhóm, mỗi nhóm một commit)

- **Nhóm 1 (nền tảng, bài ngắn):** 01, 02, 03, 04, 05
- **Nhóm 2 (chia dữ liệu & đánh giá):** 07, 08, 09, 10, 11
- **Nhóm 3 (metric & pipeline):** 13, 14, 15, 16, 17
- **Nhóm 4 (tiền xử lý nâng cao):** 19, 20, 21

Yêu cầu riêng:
- **Bài 01–05**: slide hiện chưa được ghi số trong nội dung → phải mở ảnh slide (bảng §6) để biết bài nói gì, thêm `:::slides`.
- **Bài 09**: giữ nhận xét về lỗi bảng slide 24 (tổng Dog chỉ 8 thay vì 10) trong `:::note`.
- **Bài 15 (ml-pipeline)**: là "bản đồ" cho cả Step 2–3 → thêm bảng "bước nào học ở bài nào" có link tới 16–21 (và ghi rõ bước 4–7 sẽ học ở các module sau).
- **Bài 16, 17, 19, 20, 21** dài (27–45KB): tách mục theo từng khái niệm/kỹ thuật; dùng `:::compare` cho bảng so sánh; không đổ hết vào 1 mục. Giữ các ví dụ tay "tự soạn" và các thí nghiệm trên Diabetes (kiểm lại số nếu sửa câu chữ).
- **Bài 13 (ROC/AUC)** và **14**: thêm câu phỏng vấn ROC vs PR curve, MAE vs RMSE (xem §7).
- Giữ nguyên **số liệu của slide**; mọi số mới phải tính lại bằng Python.

Sau khi chuyển xong, trong `roadmap.json` KHÔNG cần đổi gì (id/file giữ nguyên). Nếu muốn nhóm bài theo chủ đề trên trang module (§9.2) thì thêm trường tùy chọn `group` vào mỗi topic (xem §9.2), không đổi các trường cũ.

---

## 9. Hạ tầng còn lại

### 9.1 Trang `/phong-van` — ngân hàng câu hỏi phỏng vấn

Mục tiêu: gom mọi câu **tầng B và C** (và tùy chọn A) từ tất cả bài để ôn phỏng vấn.

- File: `app/phong-van/page.tsx` (server) + `components/InterviewBank.tsx` (client).
- Server: duyệt `getAllFlattenedTopics()`, đọc từng bài bằng cách tái dùng `getTopicContent` (trả `sections[].blocks`, block `type: "quiz"` có `tiers[].items[] {q,a,en,want}`). **Không parse lại bằng regex** — dùng `parseBlocks` đã có. Tạo hàm `getAllQuizItems()` trong `lib/markdown.ts` trả về `{moduleId, topicId, topicTitle, tags, tier, key, q, a, en?, want?}[]`.
- Client (`InterviewBank`): 
  - Bộ lọc: theo tầng (A/B/C), theo bài, theo `tags` (chip), ô tìm kiếm chữ.
  - Chế độ **"Tự test"**: ẩn đáp án, nút "Hiện đáp án" từng câu; nút "Xáo ngẫu nhiên" (câu hỏi ngẫu nhiên kế tiếp); đếm số câu đã mở.
  - Mỗi câu hiển thị: tầng, tên bài (link bấm về bài), câu hỏi, đáp án (+ khối EN, + "Người phỏng vấn muốn nghe" cho tầng C).
  - Render markdown bằng `renderMarkdown` (đã có), giống `Quiz.tsx`. **Đáp án có thể chứa link chip** (`<a class="lesson-chip">` đã expand sẵn ở server) → nhớ bọc trong `.notebook-prose`.
- Thêm link tới `/phong-van` ở thanh nav trên cùng (xem `app/layout.tsx` / `components/Hero.tsx` nơi có nav) và ở footer trang bài.
- `generateStaticParams` không cần (trang tĩnh). Giữ design Notebook (paper-card, sticky, font-hand đỏ).

### 9.2 Trang index module `/[moduleId]` + bản đồ phụ thuộc

- File: `app/[moduleId]/page.tsx`. Hiện `app/[moduleId]/template.tsx` đã có (hiệu ứng chuyển trang) — kiểm xem route này không xung đột với `[topicId]`.
- Nội dung: tiêu đề module + subtitle; danh sách bài **nhóm theo chủ đề** kèm 1 dòng "bài này giải quyết gì" (lấy `description` từ frontmatter); module chưa có bài (02–06) hiện "Chưa có nội dung" (đã là yêu cầu trong `project-brief.md`).
- Nhóm đề xuất cho module 01 (thêm trường `group` vào từng topic trong `roadmap.json`; trường tùy chọn, code đọc thiếu thì gom vào "Khác"):
  - "Nền tảng": 01–05
  - "Huấn luyện & chia dữ liệu": 06–09
  - "Đánh giá mô hình": 10–14
  - "Quy trình ML & tiền xử lý dữ liệu": 15–21
  Cập nhật `TopicItem` interface trong `lib/roadmap.ts` (thêm `group?: string`).
- **Bản đồ phụ thuộc**: component `components/DependencyMap.tsx` vẽ sơ đồ (SVG hoặc lưới) các bài và mũi tên theo `needs` trong frontmatter. Dữ liệu: hàm `getDependencyGraph()` trong `lib/markdown.ts` (đọc frontmatter `needs` của mọi bài). Cho bấm vào node để tới bài. Bố cục đơn giản, dễ đọc (theo nhóm cột/hàng), **không** cần thư viện đồ thị nặng; giữ phong cách sổ tay (nét đứt, sticky).
- Liên kết: breadcrumb trong `components/TopicBreadcrumb.tsx` — link "Machine Learning" nên trỏ tới `/{moduleId}` (hiện có thể trỏ nơi khác; kiểm tra). Roadmap ở trang chủ (`RoadmapZigzag`) có thể thêm link vào trang module.

### 9.3 Dọn dẹp & tài liệu

- Khi **không còn bài legacy nào** (tất cả bài đã chuyển): xóa nhánh legacy trong `components/DynamicTopicPanels.tsx` (`legacy`, `LEGACY_ICONS`, `FormulaSection` dùng cho mục 3 cũ — nhưng `FormulaSection` vẫn dùng cho `:::formula` nên GIỮ hàm này), bỏ `LEGACY_IDS`/`legacy` trong `lib/markdown.ts`, bỏ `DEFAULT_SECTIONS` trong `components/TopicTOC.tsx`, bỏ `getSubhead` switch trong `app/[moduleId]/[topicId]/page.tsx` (đã có `description` ở mọi bài). Chạy build sau khi dọn.
- Cập nhật `project-brief.md`: mục 2 "Template nội dung 1 topic — 6 phần cố định" → thay bằng khung chung nhẹ + danh sách container (§3–§4 file này). Ghi chú: cú pháp đáp án cũ `> **Đáp án:**` còn được renderer hỗ trợ nhưng bài mới dùng `:::quiz`. Cập nhật mô tả bố cục trang bài (mục lục sinh từ section thật, nút xem slide, LessonMap, quiz 3 tầng).
- `bo-prompt-theo-slide.md` và `slide-theo-phan_P01-P20/` đã nằm trong `.gitignore`; **không đụng**.
- Xem xét `public/slides/` (3.6MB): commit vào git (đồng bộ với site). Script `scripts/render-slides.py` chạy lại bằng `python scripts/render-slides.py` (cần PyMuPDF + Pillow); ghi lệnh này vào `README`/brief.

---

## 10. Kiểm chứng (phải làm trước khi báo xong)

Tự động:
```
npx tsc --noEmit
npx next build          # phải "Generating static pages (N/N)" không lỗi
```
Script kiểm nội dung (viết nhanh bằng Node/Python, chạy một lần, không commit):
1. Mọi `[[bài:ID]]` có ID ∈ bảng §3.4; mọi `needs` có ID hợp lệ.
2. Mọi `:::` mở đều có `:::` đóng (đếm theo từng file).
3. Mọi `:::quiz` có đủ tier A, B, C; tier B mọi câu có `EN:`; tier C mọi câu có `WANT:`; số câu ≥ mức tối thiểu §3.5.
4. Mọi file có `description`, `slides`, `needs` (trừ bài 01 không có `needs`), `tags`.
5. Không còn heading `## N. …` dạng đánh số trong bài đã chuyển.
6. `slides:` của mỗi bài khớp bảng §6 (hoặc đã sửa có lý do).

Thủ công (chạy `npm run dev` hoặc `next start`, có thể chụp ảnh bằng Chrome headless: `chrome --headless=new --window-size=1300,6000 --virtual-time-budget=6000 --screenshot=… <url>`):
- Mỗi bài đã chuyển: tiêu đề + subhead (description) hiện đúng; LessonMap có bài trước/sau; nút "Xem slide gốc" mở lightbox đúng slide, phím ←/→ chuyển slide, Esc đóng; viewer nhúng lật được; chip `Slide N` mở đúng slide; mục lục bên trái đúng và cuộn theo; quiz có 3 tab, "Hiện đáp án" hoạt động, "Mở tất cả đáp án" hoạt động.
- Mobile ~390px: không có cuộn ngang toàn trang (bảng rộng được cuộn trong khung hoặc co lại; nếu bảng tràn, thêm `overflow-x-auto` bọc quanh `.notebook-prose table` trong `globals.css`).
- Trang `/phong-van`: lọc theo tầng/bài/tag, tìm kiếm, tự test hoạt động; link về bài đúng.
- Trang `/01-machine-learning`: nhóm bài, bản đồ phụ thuộc, link đúng.
- Prev/Next cuối bài vẫn có hiệu ứng lật trang (không phá `FlipLink`/`TopicNavigation`).

Đọc lại nội dung: tầng B/C có thật sự "phỏng vấn được" — đáp án đúng kỹ thuật, không mơ hồ, tránh khẳng định tuyệt đối sai (ví dụ "SMOTE luôn tốt hơn" là sai).

---

## 11. Quy tắc làm việc & commit

- Làm trên nhánh mới (vd `feat/lesson-restructure`), **không commit thẳng vào `main`**. Commit theo nhóm bài (§8) và theo hạ tầng (§9.1, §9.2, §9.3) — mỗi commit build pass.
- Thông điệp commit mô tả ngắn gọn, ví dụ: `content: restructure lessons 01-05 (slides, links, 3-tier quiz)`.
- Không sửa `roadmap.json` ngoài việc thêm trường `group` (nếu làm §9.2). Không đổi `id`, `file`, `order`, `title`.
- Không thay đổi design đã chốt (màu, font, hiệu ứng) — xem `project-brief.md` §4. Thêm style mới chỉ để phục vụ component mới và bám theo token hiện có (`paper`, `panel`, `sticky`, `accent-red`, `paper-border`, `paper-dashed`).
- Không thêm thư viện nặng. Dùng được: những gì đã có trong `package.json` (framer-motion, lucide-react, marked, gray-matter, three, tailwind).
- Không xóa nội dung kiến thức cũ; không bịa số liệu — số nào không có trong slide thì tính lại bằng code và ghi *(bổ sung)*.
- Khi gặp chỗ slide mờ/không đọc rõ: ghi nhận xét trong `:::note` và nêu trong báo cáo cuối, **đừng đoán**.

---

## 12. Cạm bẫy đã gặp (tránh lặp lại)

- Tạo file bằng heredoc bash chứa nhiều dấu nháy trên Windows → lỗi `unexpected EOF`. Dùng công cụ ghi file.
- `½` hiển thị thành `%` trong code block (font mono) → dùng `1/2`.
- Heading `##` nằm trong code fence (vd comment Python `## …`) từng làm vỡ tách mục ở bản cũ; bản mới đã xử lý nhưng vẫn nên tránh.
- Container `:::formula` chỉ chia 2 cột khi có **≥2** công thức dạng "đoạn bắt đầu bằng **chữ đậm** + code block liền sau"; 1 công thức → 1 cột.
- Trong `:::quiz`, dòng bắt đầu bằng `Q:`/`A:`/`EN:`/`WANT:` luôn bị coi là marker.
- `[[bài:id]]` sai id không báo lỗi lúc build — phải chạy script kiểm §10.
- StandardScaler chia σ cho n, pandas `.std()` chia n−1 (đã giải thích ở bài 18) — nhớ khi tính lại số.
- Ảnh minh họa đầu bài (`public/illustrations/<topicId>.png`) chỉ có cho vài bài; code đã kiểm tồn tại file trước khi hiển thị — đừng thêm placeholder rỗng.

---

## 13. Định nghĩa "xong"

- [ ] 18 bài còn lại ở khung mới; không còn bài legacy; frontmatter đủ 5 trường (`title, order, description, slides, needs, tags`).
- [ ] Mỗi bài: `:::intro`, ≥1 `:::slides`, các mục tự đặt tên, `:::recap`, `:::quiz` đủ 3 tầng, `:::next`, link chéo hợp lệ.
- [ ] `/phong-van` và `/[moduleId]` (+ bản đồ phụ thuộc) hoạt động.
- [ ] Legacy code đã dọn; `project-brief.md` đã cập nhật.
- [ ] `npx tsc --noEmit` và `npx next build` pass; script kiểm §10 không lỗi; đã chụp/duyệt thủ công các trang chính (desktop + mobile).
- [ ] Báo cáo cuối: liệt kê bài đã chuyển, chỗ lệch giữa slide và nội dung cũ đã phát hiện, câu hỏi/nội dung bổ sung đáng chú ý, và mọi điểm chưa chắc cần người dùng xem lại.
