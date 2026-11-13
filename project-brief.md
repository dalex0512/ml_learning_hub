---
project: ML Learning Hub
type: personal study notes site (KHÔNG phải đồ án tốt nghiệp)
owner: Duong
status: module 01 có 23 bài; module 02 có 4 bài gồm tổng quan, Linear, Polynomial và hồi quy logistic
---

# ML Learning Hub — Project Brief cho AI coding agent (Antigravity)

Đọc toàn bộ file này trước khi code bất kỳ phần nào. Đây là "bộ não" của dự án —
mọi quyết định bên dưới đã được chốt qua nhiều vòng thảo luận, không cần hỏi lại
trừ khi thật sự mơ hồ.

## 1. Đây là gì

Một trang web cá nhân để tự ôn tập lại các khái niệm trong khóa học
*"Data Science, Machine Learning, Python course"*. **Không phải đồ án tốt nghiệp,
không phải sản phẩm thương mại** — chỉ là nơi ghi chú và ôn lại, ưu tiên số 1 là
**dễ đọc, dễ hình dung, dễ hiểu**, số 2 mới là đẹp/sinh động.

Không dùng chữ "Đồ án tốt nghiệp" ở bất kỳ đâu trong copy (footer, meta, v.v.).
Gợi ý copy: "Ghi chú tự học Machine Learning" hoặc để Duong tự điền sau.

## 2. Cấu trúc nội dung (không được đổi khác đi)

Mỗi chủ đề = 1 file, đường dẫn file **chính là** vị trí của nó trên roadmap —
không dùng suy luận ngữ nghĩa để xếp vị trí.

```
/roadmap.json                     ← nguồn sự thật duy nhất cho menu/sidebar/thứ tự
/content/
  01-machine-learning/
    01-what-is-ml.md
    02-feature-and-data-types.md
    03-learning-paradigms.md
    ...
  02-supervised-learning/
  03-unsupervised-learning/
  04-data-visualization/
  05-model-evaluation/
  06-projects/
```

`roadmap.json` đi kèm file này (`roadmap.json`) — đọc trực tiếp, đừng tự đoán lại
danh sách module/topic.

### Frontmatter chuẩn và khung nội dung linh hoạt

```yaml
---
title: <đúng title trong roadmap.json>
order: <thứ tự>
description: <bài này giải quyết vấn đề gì>
slides: 19-21
needs: [model-training-pipeline]
tags: [loss, L1, L2]
---
```

Mỗi `##` là một paper card và một mục trên mục lục; đặt tên theo nội dung,
không đánh số theo khung cố định. Bài ngắn có thể gộp mục; bài dài tách theo
khái niệm/kỹ thuật. Giữ mọi ví dụ, code và nhận xét gốc; phần bổ sung phải
ghi rõ. Ba mẫu đã duyệt: 06 Loss, 12 Classification Metrics, 18 Scaling.

Khung chung: mở đầu với `:::intro` (mục tiêu), dẫn dắt có link tiên quyết và
`:::slides`; thân bài tự tổ chức; ví dụ tay và code nếu có; `:::recap`;
`:::quiz` ba tầng; `:::next` có link bài kế. Container đóng bằng `:::` ở đầu
dòng, không lồng nhau. Các container hỗ trợ:

| Container | Vai trò |
|---|---|
| intro | Mục tiêu đọc bài |
| slides A-B \| chú thích | Viewer slide gốc |
| formula | Công thức, từ hai nhóm hợp lệ chia hai cột |
| worked | Ví dụ tính tay |
| compare | So sánh và cách chọn |
| pitfall | Bẫy, giới hạn, hiểu nhầm |
| note | Ghi chú, nhận xét về slide |
| recap | Tóm tắt một phút |
| quiz | A hiểu bài, B lý thuyết, C tình huống doanh nghiệp |
| next | Nối kiến thức và bài sau |

Quiz dùng `@tier A | Hiểu bài`, `Q:`, `A:`; tương tự tầng B có thêm `EN:`
cho mỗi câu, tầng C thêm `WANT:`. Đáp án ẩn mặc định, có nút mở từng câu
hoặc tất cả trong tầng. Giữ câu cũ ở A; bài mới tối thiểu A/B/C = 4/4/3.
Không để nội dung thường bắt đầu bằng marker. Cú pháp đáp án cũ
`> **Đáp án:**` vẫn được renderer hỗ trợ, nhưng bài mới dùng `:::quiz`.

Liên kết: `[[bài:topic-id]]`, `[[bài:topic-id|nhãn]]` và `[[slide:50]]` /
`[[slide:48-51]]` được expand thành chip bấm được. `needs` dùng ID roadmap.
Parser chuẩn hóa CRLF/LF và không tách heading bên trong code fence.

### Song ngữ Việt – Anh (bắt buộc cho mọi đoạn văn giải thích)

Tiếng Việt là chính. Ngay dưới mỗi cụm giải thích chính bằng tiếng Việt (không áp dụng cho
bảng số liệu, công thức, code — những phần đó vốn đã trung lập ngôn ngữ),
thêm 1 khối dịch tiếng Anh, dùng **đúng thuật ngữ chuẩn ngành** (không dịch
word-by-word) — dùng cú pháp blockquote để phân biệt với đoạn chính:

```
[Đoạn tiếng Việt giải thích khái niệm]

> **EN:** [Bản tiếng Anh, viết như tài liệu kỹ thuật thật, giữ đúng thuật
> ngữ ngành — Loss, Gradient Descent, overfitting... không phiên âm/dịch nghĩa]
```

Không làm nút chuyển đổi ngôn ngữ (language switcher) — cả 2 khối luôn hiển
thị cùng lúc. Khối EN hiển thị nhỏ hơn khối VI (khoảng 13px so với 14–15px),
màu chữ nhạt hơn (`text-muted`), có thể thêm 1 nhãn nhỏ "EN" viết hoa,
letter-spacing rộng, font `JetBrains Mono`, đặt ngay trước đoạn dịch. Giữ
khoảng cách trên (`margin-top`) rõ ràng với đoạn tiếng Việt để không bị dính.

Dùng ba bài pilot 06, 12, 18 làm chuẩn. Không bắt buộc khối EN trong intro, recap; quiz dùng trường EN riêng.

## 3. Roadmap thật (6 module, lấy từ mục lục khóa học gốc)

```
01. Machine Learning       — Tổng quan về Machine Learning
02. Supervised Learning    — Các mô hình cơ bản
03. Unsupervised Learning  — Các mô hình cơ bản
04. Data Visualization     — Trực quan hóa dữ liệu
05. Model Evaluation       — Đánh giá mô hình
06. Projects               — Xây dựng mô hình với các datasets
```

Chi tiết topic bên trong từng module: xem `roadmap.json`. Module 01 đã có danh
sách topic đầy đủ (dựa trên slide thật); module 02 đã mở, các module 03–06 để trống, sẽ điền dần
khi Duong ghi chú tới đâu — component phải tự xử lý được module chưa có topic
nào (hiện "Chưa có nội dung" thay vì lỗi).

## 4. Design đã chốt — bám sát tuyệt đối, không tự sáng tạo màu/font khác

**Tông:** Sổ tay / Notebook — giấy ấm, thủ công, gần gũi. KHÔNG dùng tông
tech tối màu/neon/kính mờ.

### Màu sắc
| Token | Hex | Dùng cho |
|---|---|---|
| `bg-paper` | `#FBF6EC` | nền chính |
| `bg-panel` | `#FFFDF8` | nền khung nội dung (paper panel) |
| `bg-sticky` | `#FFF6DC` | thẻ sticky-note |
| `text-main` | `#2E2A22` | chữ chính |
| `text-muted` | `#57503F` / `#8A8172` | mô tả, phụ đề |
| `border` | `#E7D9A8` | viền khung |
| `border-dashed` | `#DED2AE` / `#C9BC97` | viền đứt nét trang trí |
| `accent-red` | `#D64545` | chú thích tay, trạng thái hiện tại, nhấn mạnh |
| `accent-dark` | `#2E2A22` | nút CTA chính |
| `accent-sticky-yellow` | `#F3D34A` | nút CTA phụ kiểu sticky-note |

Nền trang có lưới chấm nhẹ (mô phỏng giấy kẻ chấm):
`background-image: radial-gradient(circle, #E9E0CB 1.2px, transparent 1.2px); background-size: 26px 26px;`

### Font (Google Fonts — đều hỗ trợ tiếng Việt)
- **Be Vietnam Pro** (400/500/600/700) — font chính cho toàn bộ body text, nav, nút
- **Patrick Hand** (thay Caveat vì Caveat không có subset tiếng Việt trên Google Fonts, thiếu dấu U+1EA0–1EF9) — CHỈ dùng cho chú thích tay ngắn, màu đỏ, hơi xoay nhẹ
  (`rotate(-1deg)` đến `rotate(1.5deg)`) — không dùng cho đoạn văn dài
- **JetBrains Mono** (400/500) — công thức, code snippet

### Cú pháp markdown mở rộng

- Khối EN: blockquote mở đầu `> **EN:** ...` → class `en-block` (13px, nhạt, badge "EN").
- Khối đáp án: blockquote mở đầu `> **Đáp án:**` hoặc `> **A:**` → class `answer-block`
  (viền trái đỏ 3px, nền xanh lá nhạt). Lồng được trong khối EN (`> > **A:**`).
- Chú thích tay cho công thức (phần 3): đặt ngay SAU code block của công thức một dòng
  `<!-- note: bậc 1 → phạt đều -->`. Mỗi công thức = 1 dòng in đậm tên (`**L1 loss** (...)`)
  + 1 code block (+ note tùy chọn). Từ 2 công thức trở lên → layout 2 cột; ít hơn → 1 cột.

### Bố cục trang chủ (Home)
Lấy nguyên bản thiết kế **C — Sổ tay (Notebook)**:
- Nav trên cùng: logo chữ thường + link + nút CTA sticky-note vàng xoay nhẹ
- Hero: tiêu đề chính + 1 dòng chú thích tay đỏ (Caveat) + subhead + 2 nút CTA
- Roadmap: 6 module hiển thị dạng "trạm" sticky-note xếp zigzag, nối bằng
  đường SVG đứt nét (không phải đường thẳng cứng), module hiện tại có chú
  thích tay đỏ "bạn đang ở đây ↓" kèm mũi tên — y hệt phong cách chú thích tay
  thật trong slide gốc khóa học

### Bố cục trang chi tiết 1 topic
Lấy nguyên bản thiết kế **F — kết hợp cuộn liền mạch + khung giấy**:
- Thanh trên: breadcrumb `Machine Learning Hub › <Module> › <Topic>` +
  progress nhỏ "Chủ đề x/N" kèm thanh tiến độ
- Khối tiêu đề: eyebrow Caveat đỏ "Module 0X · <tên module>" → H1 → subhead in nghiêng
- Bố cục 2 cột:
  - Trái (190px, ghim/sticky khi cuộn): mục lục sinh từ section thật, cuộn độc lập với bài dài; phần đang đọc được
    highlight (nền `bg-sticky`, chấm đỏ)
  - Phải: **cuộn liền mạch một trang**, mỗi section nội dung nằm trong 1 khung
    giấy riêng (`bg-panel`, viền `border`, bo góc, đổ bóng nhẹ
    `3px 4px 0 rgba(0,0,0,0.04)`). Phần "Công thức" được nhấn mạnh hơn: viền
    đỏ 2px, layout 2 cột song song (mỗi công thức 1 pill-badge tên + công thức
    mono + 1 dòng chú thích tay đỏ kiểu "bậc 1 → phạt đều", "bậc 2 → phạt nặng
    outlier" — lấy đúng giọng chú thích tay thật từ slide gốc)
- Đầu bài có description, LessonMap (tiên quyết, trước/sau, backlinks), nút xem slide gốc và viewer nhúng. Quiz có ba tab, đáp án ẩn/hiện; bảng rộng cuộn trong khung trên mobile.
- Dưới cùng có link ngân hàng phỏng vấn và nút Prev (viền đứt nét) / Next (nền tối đặc) sang topic liền kề
  theo đúng thứ tự trong `roadmap.json`

### Chuyển động / hiệu ứng — giữ đúng tông giấy/thủ công, KHÔNG dùng 3D kính/neon
- **Hero**: vật thể 3D low-poly kiểu "paper-craft" (bút chì, tờ giấy gấp góc,
  kẹp giấy...) xoay nhẹ, chất liệu giấy/gỗ ấm — dùng three.js hoặc tương đương
- **Chuyển trang giữa 2 topic (Prev/Next)**: hiệu ứng lật trang 3D thật
  (`transform: rotateY()` + đổ bóng theo góc lật) — mô phỏng lật một trang sổ
- **Đường roadmap ở trang chủ**: "tự vẽ" dần bằng animation `stroke-dasharray`
  khi cuộn tới, như đang viết tay
- Tùy chọn thêm: parallax nhẹ theo chuột ở hero (nhiều lớp giấy/bút di chuyển
  khác tốc độ) — ưu tiên thấp hơn 3 mục trên

## 5. Skill nên cài cho Antigravity trước khi code (qua skills.sh)

```
npx skills add anthropics/skills --skill frontend-design
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
npx skills add pbakaus/impeccable --skill critique
npx skills add pbakaus/impeccable --skill polish
```
Dùng `frontend-design` + `web-design-guidelines` khi dựng khung ban đầu;
dùng `critique` rồi `polish` làm 1 vòng rà soát sau khi có bản code đầu tiên.

## 6. Việc CHƯA quyết định (đừng tự bịa, hỏi Duong nếu cần)

- Stack đã chọn: Next.js 14 App Router, React, TypeScript và Tailwind
- Các bài tiếp theo của module 02 và nội dung module 03–06 — chưa viết, chỉ thêm khi học tới
- Có cần lưu tiến độ học (đã hiểu/cần ôn) giữa các lần mở lại không — **đã xác
  nhận KHÔNG cần** (Duong chỉ dùng để đọc lại, không cần tracking)

## 7. Khi tiếp tục dự án

Module 01 hiện có 23 bài, đã hoàn tất chuyển khung; không dựng lại hạ tầng hay ba bài pilot.
Đọc roadmap và nội dung hiện có trước khi sửa. Mọi thay đổi giữ design Notebook,
liên kết slide và quy tắc fit trong train. Module 02 đã có bốn bài đầu; module 03–06 chưa có nội dung;
không tự suy diễn danh sách bài. Báo cáo chuyển đổi ở lesson-restructure-report.md.

## 8. Điều hướng, dữ liệu và kiểm chứng

- `/phong-van`: lấy quiz từ parser bài học, mặc định B+C; lọc tầng/bài/tag,
  tìm có hoặc không dấu, tự test, mở đáp án và rút câu ngẫu nhiên.
- `/{moduleId}`: nhóm bài theo `group` tùy chọn trong roadmap, mô tả từ
  frontmatter và bản đồ tiên quyết từ `needs`; thiếu group vào “Khác”.
  Module 03–06 chưa có bài và hiển thị “Chưa có nội dung”.
- Breadcrumb module và tiêu đề trạm roadmap dẫn về trang module. Prev/Next
  vẫn dùng cơ chế lật trang hiện có.
- `public/slides/` được quản lý trong git. Tạo lại từ PDF bằng
  `python scripts/render-slides.py` (cần PyMuPDF và Pillow).
- Kiểm tra: `npx tsc --noEmit`, `npx next build`; kiểm đủ frontmatter,
  liên kết/needs, container và quiz A/B/C, đối chiếu số liệu, duyệt desktop
  và mobile khoảng 390px. Không viết lại pilot khi chuyển nội dung khác; đợt 2 cho phép bổ sung trực tiếp bài 18 theo ghi chú mới.

## 9. Đợt 2 — ghi chú đến slide 63

- Module 01 có 23 bài: 01–21 giữ thứ tự; 22 `data-visualization` thuộc nhóm
  “Quy trình ML & tiền xử lý dữ liệu”, bao phủ slide 55–63 (cả Figure/Axes,
  grid và legend); 23 `regular-expressions` thuộc “Công cụ hỗ trợ”.
- Bài 23 do chủ repo yêu cầu bổ sung từ ghi chú dù không có ảnh slide tương
  ứng: `slides: null`, không có `:::slides`, có note giải thích nguồn.
  Đây là ngoại lệ có chủ đích; không gán slide 63 cho RegEx.
- Step 4 hiện đọc ngay ở bài 22 trong module 01. Module 04 vẫn trống;
  không chuyển hoặc nhân đôi nội dung tự động sang module này.
- Bài 17 thêm giới hạn của imputation và iterative forest; bài 18 thêm
  ví dụ đơn vị/giới hạn Gaussian; bài 20 làm rõ model phi tuyến và importance;
  bài 21 làm rõ phạm vi class balancing. Bài 16/19 không cần sửa vì đã đủ
  ý ghi chú liên quan.
- Báo cáo đợt 2: `lesson-extend-55-63-report.md`. Báo cáo đợt 1 giữ nguyên
  như tài liệu lịch sử với số bài/số câu tại thời điểm đó.

## 10. Đợt 3 — mở Supervised Learning

- Đợt 3 mở module 02 với `01-supervised-algorithms.md` (slide 64) và
  `02-linear-regression.md` (slide 65–66). Khi kết thúc đợt 3 toàn site có
  25 bài; Polynomial từ slide 67 được bổ sung ở đợt 4 bên dưới.
- Nguồn nội dung chính là ảnh slide, không có ghi chú tay đợt này.
  OLS/tính tay, code sklearn và chẩn đoán giả định được ghi rõ “bổ sung ngoài slide”.
- ID bài duy nhất toàn roadmap; resolver/needs/backlinks/bank dùng toàn bộ
  module. DependencyMap hiển thị node của module hiện tại nhưng tra cứu
  tiên quyết trên toàn graph để giữ link sang module 01.
- Prev/Next đã nối toàn roadmap: RegEx → bản đồ Supervised → Linear Regression;
  giữ nguyên FlipLink. “Bạn đang ở đây” ở trang chủ đánh dấu module cuối đã có bài,
  lấy từ roadmap, không phải tracking cá nhân.
- Báo cáo đợt 3: `supervised-linear-regression-report.md`. Không thêm bài về
  thuật toán tiếp theo khi chưa có yêu cầu; mục “Sắp có” không tạo link chết.

## 11. Đợt 4 — Polynomial Regression

- Module 02 có thêm `03-polynomial-regression.md`, order 3, group “Mô hình hồi quy”,
  bao phủ đúng slide 67; tại thời điểm kết thúc đợt 4, slide 68–69 là Logistic Regression chưa viết bài.
  Khi kết thúc đợt 4: module 01 vẫn 23 bài; module 02 có 3 bài, toàn site 26 bài.
- Bài dùng b0/b1/b2 theo slide và giải thích tương ứng β ở Linear Regression.
  Ví dụ tay, chọn bậc/CV, số học và code đều gắn nhãn bổ sung ngoài slide.
- Ví dụ tay 5 điểm giải đầy đủ normal equations; demo nhiễu seed 42 so d = 1/2/3/5/9
  bằng holdout, rồi chọn bằng CV trên development và giữ test riêng. Không lấy
  train error 0 làm tiêu chí chọn bậc; phân biệt scale với center trước mở rộng.
- Hình `public/plots/polynomial-degree-comparison.png` sinh bằng matplotlib từ
  code trong bài; có link mở ảnh gốc, trục y các panel tự co và MSE dùng thang log.
- Roadmap/overview/next Linear và bài K-fold đã liên kết tới bài mới.
  Hạ tầng module/map/bank dùng lại cơ chế hiện có, không đổi giao diện.
- Báo cáo: `supervised-polynomial-regression-report.md`; báo cáo đợt 3 giữ nguyên
  như lịch sử. Các thuật toán tiếp theo chỉ thêm khi được yêu cầu.

## 12. Đợt 5 — Hồi quy logistic (Logistic Regression)

- Module 02 có `04-logistic-regression.md`, order 4, nhóm “Phân loại”, slide 68–69.
  Tiêu đề tiếng Việt đứng trước tên tiếng Anh trong frontmatter và roadmap.
  Hiện module 01 có 23 bài, module 02 có 4 bài, toàn site 27 bài.
- Bài nối predictor tuyến tính → sigmoid φ → xác suất → ngưỡng; giải thích
  log-odds, log loss, gradient một bước và so Linear/Logistic, gắn nhãn ngoài slide.
- Bảng mười hồ sơ giữ nguyên score để so ba ngưỡng; recall không giảm khi hạ
  ngưỡng, precision không bảo đảm đơn điệu. Phần metrics cũ được làm rõ tương ứng.
- Demo sklearn dùng Pipeline, train/validation/test, chọn ngưỡng trên validation;
  không refit sau chọn ngưỡng trong ví dụ và không tune theo test. Quiz A/B/C = 5/6/4.
- Overview, Polynomial và các bài nền có liên kết thật. Module index, dependency
  map và bank dùng hạ tầng hiện có; không đổi TypeScript/React hoặc design.
- Slide 70 bắt đầu Support Vector Machine, chưa viết bài. Báo cáo đợt này:
  `supervised-logistic-regression-report.md`; báo cáo cũ giữ nguyên như lịch sử.
