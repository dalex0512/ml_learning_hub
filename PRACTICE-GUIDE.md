# PRACTICE-GUIDE — cách viết mọi bài thực hành

File này là **quy chuẩn bắt buộc** cho mọi bài trong module `06-projects` (và mọi bài thực hành sau này). Ai viết bài tiếp theo (Claude, Codex, hay chính chủ repo) chỉ cần đọc file này và làm theo; không cần hỏi lại. Bài mẫu chuẩn: `content/06-projects/01-diabetes-first-model.md` và `02-diabetes-evaluate-improve.md`.

Thay thế hoàn toàn `codex-prompt-practice-diabetes.md` (bản cũ, đã bị bỏ vì tạo ra bài dài, rối, khó học lại).

---

## 1. Vì sao có file này (phản hồi của chủ repo, đừng lặp lại lỗi)

Bản đầu tiên bị chê, sau vài ngày đọc lại chỉ hiểu một phần. Nguyên nhân đã xác định:

| Lỗi | Biểu hiện | Cách tránh |
|---|---|---|
| Liệt kê thay vì giải thích | Mỗi bước là 6 gạch đầu dòng sự kiện, không có sợi chỉ logic | Mỗi bước kể **một câu chuyện**: câu hỏi, thí nghiệm, giải thích |
| Nhồi quá nhiều khái niệm một bước | Bước "chuẩn hoá" gồm scaler, fit/transform, leakage, MinMax, ndarray, regularization | **Một ý chính mỗi bước.** Ý phụ vào khối "Biết thêm" (gấp lại) hoặc bỏ |
| Giải thích "là gì" nhưng không chứng minh "vì sao cần" | Người đọc nhớ quy tắc, không hiểu lý do | **Làm hỏng thử**: cho thấy điều tệ xảy ra khi bỏ bước đó, bằng số thật |
| Quá nhiều loại hộp màu | Vàng, xanh, đỏ, nhãn in hoa, icon, đáp án rải rác | Chỉ 6 loại thành phần (mục 5), một màu nhấn |
| Giao diện nhức mắt | Nền kem có chấm, nhiều viền, nhiều màu, chữ nhỏ | Chế độ đọc: nền phẳng, sáng/tối, chữ 17px, một cột (mục 6) |
| Không nhìn lại được toàn cảnh | Người học mất lộ trình | Trang lộ trình + "Tổng kết" có bảng "bỏ bước này thì hỏng gì" |

## 2. Nguyên tắc dạy (rút từ nghiên cứu về học tập: cognitive load, worked example, retrieval practice, productive failure)

1. **Câu hỏi trước, đáp án sau.** Mỗi bước mở bằng một câu hỏi người học thật sự muốn biết (`:::ask`). Não nhớ lâu câu trả lời cho câu mình đã tò mò.
2. **Làm hỏng thử (break it first).** Trước khi đưa cách sửa, cho người học thấy cái gì hỏng và hỏng bao nhiêu, bằng một thí nghiệm nhỏ chạy ra số. Ví dụ: cây quyết định đạt 100% khi chấm trên dữ liệu đã học nhưng 74.7% trên đề mới, rồi mới nói về bộ test.
3. **Một ý chính mỗi bước.** Nếu một bước cần hơn 2 khái niệm mới thì tách bước hoặc cắt.
4. **Mỗi bước phải đẻ ra bước sau.** Kết quả bước N tạo câu hỏi của bước N+1 (mức sàn 65.1% ở Bước 1 quay lại ở Bước 4 và 5; số 0 ở Bước 1 quay lại ở Bước 7). Người học thấy một sợi chỉ, không phải danh sách.
5. **Mọi khẳng định có số đi kèm, mọi số có nguồn từ code chạy thật** (mục 8). Không viết "thường", "khá", "đáng kể" khi có thể viết con số.
6. **Trung thực với kết quả xấu.** Nếu một kỹ thuật không giúp (dọn số 0 không tăng điểm, một lần chia đảo ngược kết luận), ghi đúng như vậy và biến nó thành bài học về cách đo. Không chọn seed hay số liệu để câu chuyện đẹp.
7. **Cụ thể trước, trừu tượng sau.** Ví dụ đời thường hoặc số nhỏ làm tay trước; công thức sau. Giữ ví dụ "thợ may" cho fit/transform vì chủ repo đã quen.
8. **Gợi nhớ chủ động (retrieval).** Mỗi bước có 1 bài "Tự làm" (đáp án gấp); cuối phần có checklist tự kiểm và bộ code gõ lại không nhìn; quiz 3 tầng cho ngân hàng phỏng vấn.
9. **Giải thích thuật ngữ đúng một lần, ở lần đầu xuất hiện**, bằng lời thường (tiếng Anh kèm tiếng Việt). Sau đó dùng nhất quán một tên.
10. **Phân biệt "đúng nguyên tắc" và "tăng điểm".** Người học hay nhầm hai thứ này.

## 3. Cấu trúc một bài (khuôn cứng)

```
Frontmatter (layout: practice)
## Chuẩn bị                  <- chỉ môi trường và biến cần có; không bài tập
## Bước N — Tên ngắn         <- 3 đến 5 bước mỗi bài (tối đa 5)
## Tổng kết Phần X           <- bảng "bỏ bước nào thì hỏng gì" + code hoàn chỉnh + checklist + quiz
```

Giới hạn cứng mỗi bài: **tối đa 5 bước**, mỗi bước **tối đa khoảng 450 từ văn xuôi**, **tối đa 3 khối code**, **đúng 1 bài tự làm chính (tối đa 2)**, **tối đa 1 khối "Biết thêm"**. Vượt quá thì tách bài hoặc cắt.

Số bước đánh liên tục xuyên suốt các bài của cùng một dự án (Phần A: Bước 1–4; Phần B: Bước 5–8). Tiêu đề phần: "Thực hành N — Tên bộ dữ liệu" đặt ở `group` trong `roadmap.json`; tiêu đề bài ngắn, mô tả hành động.

## 4. Khuôn một bước

```
## Bước 3 — Chuẩn hoá

:::ask
Một câu hỏi người học thật sự thắc mắc, có số hoặc tình huống cụ thể.
:::

(1–2 đoạn dẫn vào vấn đề.)

(code thí nghiệm "làm hỏng thử")
:::out ... :::

(Đọc kết quả: nói thẳng "điều này nghĩa là gì" bằng 2–3 câu.)

(Cách sửa + giải thích VÌ SAO nó sửa được.)

(code cách sửa)
:::out ... :::

(Kiểm tra: chạy lại phép đo ban đầu cho thấy vấn đề đã hết.)

:::ex Tên bài tập
Đề.
@answer
Đáp án + giải thích.
:::

:::more Chủ đề phụ        <- tùy chọn, gấp lại
:::

:::recap
- 3 dòng, mỗi dòng một ý có thể nói lại bằng lời.
:::
```

Bước phải **đọc được độc lập sau vài ngày**: người học đọc `ask` + `recap` là nhớ lại ý; đọc cả bước là hiểu lại sâu.

## 5. Các thành phần được phép dùng (và chỉ những thứ này)

| Thành phần | Cú pháp | Dùng để |
|---|---|---|
| Văn xuôi, danh sách ngắn, bảng | Markdown thường | Giải thích. Bảng chỉ khi so sánh số thật |
| Câu hỏi của bước | `:::ask` | Mở bước; hiện ở trang lộ trình |
| Code | ```` ```python ```` | Mỗi khối chạy được và ngắn |
| Kết quả chạy | `:::out` chứa khối ```` ```text ```` | In đúng output thật (tự điền bằng script, mục 8) |
| Bài tự làm | `:::ex Tiêu đề` ... `@answer` ... `:::` | Đề rồi đáp án gấp |
| Biết thêm | `:::more Tiêu đề` | Ý phụ, gấp lại |
| Nhớ lại | `:::recap` | Cuối bước, 3 dòng |
| Checklist | `:::check` | Cuối phần, người học tick |
| Quiz | `:::quiz` với `@tier A/B/C` | Giữ định dạng cũ để vào ngân hàng phỏng vấn |
| Ảnh | hai dòng ảnh `-light.png` và `-dark.png` liền nhau | Chế độ đọc tự chọn bản đúng |

**Không dùng:** `:::goal`, `:::learn`, `:::see`, `:::pitfall`, `:::worked`, `:::compare`, `:::en` rải rác, nhãn in hoa, emoji, hộp màu. (Bẫy hay gặp hãy viết thành một đoạn văn trong bước đúng chỗ; câu EN chỉ nằm trong quiz tầng B.)

Quy tắc quiz: tầng A (≥3, tính toán/đọc kết quả bằng số thật của bài), tầng B (≥3, có dòng `EN:` trả lời tiếng Anh), tầng C (≥2, tình huống, có dòng `WANT:`).

## 6. Giao diện (đã xây dựng, đừng tự phát minh lại)

- Bài có `layout: practice` ở frontmatter tự dùng **chế độ đọc**: ẩn header/footer của site, nền phẳng, một cột 44rem, chữ 17px, line-height 1.85. Mặc định **tối** (chủ repo dùng PyCharm và Notion tối), có nút đổi sáng/tối, lưu trong trình duyệt.
- Một màu nhấn duy nhất (đỏ gạch/hồng nhạt ở nền tối). Code nền xám nhẹ; kết quả chạy hiện dạng chữ xám có vạch trái, gắn liền ngay dưới code.
- Thanh bên trái (từ 1100px) liệt kê các bước, bước đang đọc được tô đậm, có dấu ✓ khi bạn tick "Tôi đã hiểu phần này". Tiến độ lưu trong `localStorage`.
- Trang `/06-projects` là **lộ trình**: một dòng "đường đi" các bước, danh sách bước với câu hỏi `ask`, nút "Bắt đầu / Tiếp tục".
- Mã nguồn: `app/reader.css`, `components/ReaderShell.tsx`, `components/PracticeLesson.tsx`, `components/PracticeRoadmap.tsx`, `lib/practice.ts`, các loại khối trong `lib/blocks.ts`. Sửa giao diện chung ở đó, không sửa riêng trong bài.
- Không thêm màu mới, hộp mới, icon trang trí. Nếu thấy cần thành phần mới, hãy tự hỏi bước đó có đang nhồi quá nhiều không.

## 7. Quy tắc viết (tiếng Việt)

- Câu ngắn, chủ động. Một đoạn một ý. Không quá 4 câu liên tiếp không có ví dụ hoặc số.
- Xưng "ta" khi cùng làm, "bạn" khi hướng dẫn trực tiếp. Không khoe, không tuyên bố "rất quan trọng" mà không nói vì sao.
- Mỗi thuật ngữ lần đầu: **in đậm** + giải thích bằng lời thường. Giữ tên tiếng Anh của hàm, tham số, thuật ngữ phỏng vấn.
- Tránh: "đáng kể", "khá tốt", "thường", "nên" khi không có căn cứ. Thay bằng số hoặc nói thẳng "chưa kiểm chứng".
- Khi một kết quả đảo ngược kỳ vọng, dành hẳn một đoạn giải thích điều đó dạy ta gì.
- Số liệu so sánh mô hình luôn kèm cách đo (một lần chia hay CV) và độ dao động.
- Ghi chú tay của chủ repo là nguyên liệu quý: giữ cách ví von của họ (thợ may, 42 muôn đời là 42), nhưng sửa chỗ chưa chính xác và nói rõ đã sửa.

## 8. Quy trình xác minh (bắt buộc trước khi báo xong)

1. Viết code bài trước, để các khối `:::out` chứa chữ `TODO`.
2. `python scripts/practice_verify.py --fill content/06-projects/<file>.md` chạy mọi khối code theo thứ tự (như Python Console) và **ghi output thật** vào `:::out`. Code trong đáp án bài tập (sau `@answer`) chạy trên bản sao vùng nhớ.
3. Đọc output, **viết/sửa văn xuôi cho khớp output** (không làm ngược lại). Mọi con số trong văn bản phải tìm được trong output hoặc trong đáp án đã chạy.
4. `python scripts/practice_verify.py content/06-projects/*.md` (không `--fill`) phải ra `XONG`. Chạy lại sau mỗi lần sửa code.
5. Hình: `python scripts/make-practice-plots.py` (thêm hàm cho hình mới; cùng seed và cùng cách chia với bài). Nền trong suốt, mỗi hình có `-light.png` và `-dark.png`.
6. `npx tsc --noEmit` và `npm run build` phải pass. Mở thử trang thực hành bằng trình duyệt, xem cả sáng và tối.
7. **Bài kiểm "đọc lại sau vài ngày":** đọc chỉ phần `ask` và `recap` của từng bước. Có dựng lại được toàn bộ câu chuyện không? Nếu không, bước đó chưa đủ rõ ý chính. Rồi hỏi: mỗi khái niệm có được chứng minh bằng một con số không, hay chỉ được tuyên bố?
8. Với bài mới: phiên bản Python và thư viện đã dùng ghi ở "Chuẩn bị".

## 9. Cách thêm bài thực hành tiếp theo

1. Chọn bộ dữ liệu, đặt vào `dataset/`. Khảo sát trước (hình dạng, nhãn lệch, giá trị lạ, tương quan) và **ghi ra các "bẫy thật" của bộ dữ liệu**; mỗi bẫy là một cơ hội cho thí nghiệm "làm hỏng thử".
2. Lập dàn ý: dự án trả lời chuỗi câu hỏi nào? Mỗi câu hỏi thành một bước; kiểm tra bước N có đẻ ra bước N+1 không. Ghi dàn ý (câu hỏi, thí nghiệm, kết luận mỗi bước) trước khi viết.
3. Tạo `content/06-projects/NN-ten-bai.md` với `layout: practice`, thêm topic vào `roadmap.json` (cùng `group` nếu là cùng dự án, `group` mới nếu dự án mới; cập nhật `intro` của module nếu cần). Trang lộ trình hiện đang gom mọi bài trong module thành một đường; nếu có nhiều dự án, thêm phần chia theo `group` vào `PracticeRoadmap` (đã có `label` theo group).
4. Viết theo mục 3 đến 5, xác minh theo mục 8.
5. Liên kết: thêm link ngược (một dòng) từ bài lý thuyết liên quan sang bài thực hành nếu tự nhiên; cập nhật `project-brief.md` (danh sách bài, trạng thái).
6. Commit nhỏ, thông điệp rõ (`feat(practice): ...`); không push nếu chủ repo chưa yêu cầu.

## 10. Danh sách kiểm cuối (dán vào báo cáo khi xong)

- [ ] Mỗi bước mở bằng `ask`, có thí nghiệm "làm hỏng thử" hoặc ví dụ số, có `recap` 3 dòng.
- [ ] Mỗi bước một ý chính; không bước nào vượt giới hạn mục 3.
- [ ] `practice_verify.py` ra `XONG`; mọi số trong văn bản khớp output.
- [ ] Kết quả xấu hoặc đảo ngược được ghi trung thực và có lời giải thích.
- [ ] Chỉ dùng thành phần ở mục 5; không hộp màu thừa.
- [ ] Hình có bản sáng và tối; xem được ở chế độ đọc.
- [ ] `tsc` và `build` pass; đã mở trang xem thật.
- [ ] Đã qua bài kiểm "đọc lại sau vài ngày".
