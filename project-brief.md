---
project: ML Learning Hub
type: personal study notes site (KHÔNG phải đồ án tốt nghiệp)
owner: Duong
status: đã chốt bố cục + nội dung + design, sẵn sàng code
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
    01-pipeline.md
    02-loss-function.md
    03-train-test-split.md
    ...
  02-supervised-learning/
  03-unsupervised-learning/
  04-data-visualization/
  05-model-evaluation/
  06-projects/
```

`roadmap.json` đi kèm file này (`roadmap.json`) — đọc trực tiếp, đừng tự đoán lại
danh sách module/topic.

### Frontmatter chuẩn cho mỗi file topic

```
---
title: <tên hiển thị>
order: <số thứ tự trong module>
---
```

### Template nội dung 1 topic — 6 phần cố định, luôn theo đúng thứ tự này

1. **Ý tưởng** — giải thích bằng lời thường, không chép nguyên slide
2. **Vị trí trong pipeline / liên hệ khái niệm trước** — topic này nằm ở đâu trong bức tranh lớn
3. **Công thức / cách hoạt động**
4. **Ví dụ tay** — số liệu cụ thể, tính tay được
5. **Code** — cài đặt lại từ đầu bằng Python
6. **Câu hỏi tự kiểm tra** — chỉ ghi câu hỏi, KHÔNG ghi đáp án ngay dưới (ẩn/thu gọn)

Nếu 1 topic có đồ thị/sơ đồ minh họa, nhúng ảnh/SVG **bên trong** phần 1 hoặc 3
ở trên — không tạo thêm phần thứ 7 riêng, giữ đúng 6 phần cho mọi topic.

Có sẵn 1 file ví dụ đầy đủ theo đúng template này: `content-example/loss-function.md`
— dùng làm mẫu tham chiếu khi dựng component hiển thị 1 topic.

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
sách topic đầy đủ (dựa trên slide thật); các module 02–06 để trống, sẽ điền dần
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
- **Caveat** (600/700) — CHỈ dùng cho chú thích tay ngắn, màu đỏ, hơi xoay nhẹ
  (`rotate(-1deg)` đến `rotate(1.5deg)`) — không dùng cho đoạn văn dài
- **JetBrains Mono** (400/500) — công thức, code snippet

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
  - Trái (190px, ghim/sticky khi cuộn): mục lục 6 phần, phần đang đọc được
    highlight (nền `bg-sticky`, chấm đỏ)
  - Phải: **cuộn liền mạch một trang**, mỗi trong 6 phần nằm trong 1 khung
    giấy riêng (`bg-panel`, viền `border`, bo góc, đổ bóng nhẹ
    `3px 4px 0 rgba(0,0,0,0.04)`). Phần "Công thức" được nhấn mạnh hơn: viền
    đỏ 2px, layout 2 cột song song (mỗi công thức 1 pill-badge tên + công thức
    mono + 1 dòng chú thích tay đỏ kiểu "bậc 1 → phạt đều", "bậc 2 → phạt nặng
    outlier" — lấy đúng giọng chú thích tay thật từ slide gốc)
- Dưới cùng: nút Prev (viền đứt nét) / Next (nền tối đặc) sang topic liền kề
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

- Framework/stack cụ thể (React/Next.js thuần HTML...) — chưa chọn
- Nội dung topic của module 02–06 — chưa viết, chỉ có khung
- Có cần lưu tiến độ học (đã hiểu/cần ôn) giữa các lần mở lại không — **đã xác
  nhận KHÔNG cần** (Duong chỉ dùng để đọc lại, không cần tracking)

## 7. Prompt khởi động — copy nguyên đoạn dưới đây gửi cho Antigravity

```
Đọc kỹ file project-brief.md và roadmap.json trong repo này trước khi làm
bất cứ điều gì. Bám sát tuyệt đối màu sắc, font, bố cục trang chủ (mục 4 —
bản C) và trang chi tiết topic (mục 4 — bản F) đã mô tả trong brief — không
tự đổi sang thiết kế khác.

Việc đầu tiên: dựng trang chủ (Home) hiển thị roadmap 6 module dạng
sticky-note zigzag theo đúng mô tả, và 1 trang chi tiết mẫu cho topic
"Loss Function" (dùng nội dung có sẵn trong content-example/loss-function.md)
theo đúng bố cục 2 cột + khung giấy đã mô tả.

Hỏi lại tôi nếu cần chọn framework/stack, đừng tự quyết định phần đó.
```
