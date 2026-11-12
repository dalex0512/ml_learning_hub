---
title: Regular Expression — tìm và làm sạch dữ liệu chuỗi với Python re
order: 23
description: "Định nghĩa pattern rồi tìm, trích hoặc thay thế trong chuỗi; phân biệt search, match, fullmatch, group, greedy/lazy và giới hạn của RegEx."
slides: null
needs: [feature-and-data-types]
tags: [regex, python, text-cleaning, pattern, validation]
---

## Ta cần tìm khuôn mẫu nào trong chuỗi?

:::intro Đọc xong bài này bạn làm được
- Viết một pattern đơn giản cho mã đơn, số điện thoại hoặc định dạng ngày.
- Chọn search/match/fullmatch/findall/sub đúng với mục tiêu.
- Đọc từng phần của pattern, dùng group để trích thông tin và giữ số 0 đầu.
- Tránh nhầm escape, greedy, xác thực cú pháp và tính hợp lệ nghiệp vụ.
:::

:::note Nguồn bài: bổ sung từ ghi chú, không có slide gốc
RegEx có trong ghi chú của chủ repo nhưng không xuất hiện trong ảnh slide 55–63. Bài này phát triển ý “định nghĩa pattern cần tìm, rồi dò trong input”, dùng tài liệu Python để giải thích thêm. Vì không có slide tương ứng, bài không gán dải slide hoặc hiển thị viewer giả. Phần [[bài:data-visualization]] mới là nội dung slide 55–63.
:::

**Regular Expression (RegEx)** là ngôn ngữ mô tả khuôn mẫu trong chuỗi. Thay vì hỏi “chuỗi có đúng bằng DH-2026-0042 không?”, ta hỏi “ở đâu có DH-, tiếp theo là bốn chữ số, dấu -, rồi bốn chữ số?”. Với dữ liệu chữ ở [[bài:feature-and-data-types]], pattern giúp tìm, trích xuất, kiểm tra định dạng hoặc chuẩn hóa; nó không tự hiểu nghĩa của dữ liệu.

> **EN:** A regular expression specifies a text pattern. Matching structure supports extraction and cleaning, but does not establish semantic correctness.

## Bộ ký hiệu đủ để đọc các ví dụ

:::compare Ký hiệu → ý nghĩa
| Cú pháp | Nghĩa trong Python re | Ví dụ |
|---|---|---|
| `abc` | Chuỗi ký tự cụ thể | `DH-` |
| `.` | Một ký tự bất kỳ, mặc định trừ xuống dòng | `a.c` |
| `[0-9]` | Một chữ số ASCII | `7` |
| `[A-Z]` | Một chữ hoa ASCII | `D` |
| `\d`, `\w`, `\s` | Chữ số, ký tự từ, khoảng trắng | Unicode có ảnh hưởng |
| `[^0-9]` | Một ký tự không phải số ASCII | `A` |
| `?`, `*`, `+` | 0–1, 0–n, 1–n lần | `[0-9]+` |
| `{m}`, `{m,n}` | Đúng m hoặc từ m tới n lần | `[0-9]{4}` |
| `^`, `$` | Mốc đầu/cuối, có chi tiết về newline/flags | Để kiểm toàn chuỗi, ưu tiên `fullmatch` |
| `\b` | Ranh giới từ | Không phải một ký tự khoảng trắng |
| `(…)`, `(?P<name>…)` | Group thường hoặc có tên | Trích year, seq |
| `(?:…)` | Group không thu kết quả | Gom nhánh khi chỉ cần cấu trúc |
| `a\|b` | Nhánh a hoặc b | Dấu `\|` trong bảng được escape để hiển thị |
| `\.` | Dấu chấm literal | Khác `.` bất kỳ |
:::

Trong code dùng chuỗi raw `r"..."` để backslash của regex không bị Python xử lý trước. `r"\b"` đưa ký hiệu ranh giới từ cho regex; `"\b"` là ký tự backspace của Python. Raw string không làm mất ý nghĩa đặc biệt của dấu chấm hoặc lượng từ trong regex. Nếu đưa một đoạn text tùy ý vào pattern, dùng `re.escape(text)` thay vì nối thẳng.

Với chuỗi Unicode, `\d` có thể khớp chữ số ngoài ASCII; dùng `[0-9]` khi định dạng yêu cầu đúng 0–9. Tương tự, `\w` không chỉ gồm chữ cái Latin và có cả underscore. Không lấy `\w+` làm định nghĩa mọi từ tiếng Việt hay mọi loại tên.

> **EN:** Raw strings avoid Python string-escape interference; regex metacharacters still apply. Unicode character classes can be broader than ASCII business formats, so choose them deliberately.

## Tìm ở đâu và có cần khớp toàn chuỗi?

:::compare Chọn API theo câu hỏi
| API | Câu hỏi | Kết quả chính |
|---|---|---|
| `re.search` | Có pattern ở vị trí bất kỳ không? | Match đầu tiên hoặc None |
| `re.match` | Pattern có bắt đầu ngay đầu chuỗi không? | Match đầu chuỗi hoặc None |
| `re.fullmatch` | Toàn chuỗi có đúng khuôn không? | Match toàn chuỗi hoặc None |
| `re.findall` | Các lần khớp không chồng lấp là gì? | List; hình dạng phụ thuộc capturing groups |
| `re.finditer` | Cần từng match, group và vị trí? | Iterator các Match |
| `re.sub` | Thay mọi lần khớp bằng gì? | Chuỗi sau thay thế |
:::

`match` không đồng nghĩa “xác thực toàn chuỗi”: nó chỉ yêu cầu bắt đầu ở vị trí đầu. `search` cũng không đủ để kiểm một trường điện thoại vì nó có thể tìm được đoạn hợp lệ bên trong một chuỗi dài sai định dạng. Dùng `fullmatch` cho trường độc lập và xử lý khoảng trắng ngoài theo chính sách rõ ràng.

> **EN:** Search scans for a match anywhere; match checks the start; fullmatch validates the entire input against the pattern. Extraction and field validation are different tasks.

:::worked Đọc pattern mã đơn từng phần (bổ sung, ví dụ tự soạn)
Input: `Đơn DH-2026-0042, tổng 150000 VND`.

```python
r"\bDH-(?P<year>[0-9]{4})-(?P<seq>[0-9]{4})\b"
```

1. `\b` đòi ranh giới trước chữ D; không khớp giữa một từ như `XDH-...`.
2. `DH-` khớp ba ký tự cụ thể.
3. Group `year` lấy đúng bốn số `2026`.
4. `-` khớp dấu phân cách tiếp theo.
5. Group `seq` lấy đúng bốn số `0042`.
6. `\b` kiểm tra ranh giới sau số cuối; dấu phẩy tạo được ranh giới đó.

`search` tìm token ở đoạn `[4,16)` của chuỗi Python; đầu vào phía trước không cần khớp. `match` trả None vì input bắt đầu bằng `Đơn `. `fullmatch` cũng trả None vì còn cả phần văn bản khác. Khi lấy riêng token `DH-2026-0042`, fullmatch thành công. Giữ `seq` là chuỗi để không mất hai số 0 đầu.
:::

## Code Python re: tìm, trích, kiểm và thay

Thư viện `re` có sẵn trong Python, không cần pip install. Code sau chạy độc lập; dữ liệu đều tự soạn.

```python
import re
from datetime import date

text = "Đơn DH-2026-0042, tổng 150000 VND"
order = re.compile(r"\bDH-(?P<year>[0-9]{4})-(?P<seq>[0-9]{4})\b")
found = order.search(text)
assert found is not None
assert found.group(0) == "DH-2026-0042"
assert found.groupdict() == {"year": "2026", "seq": "0042"}
assert found.span() == (4, 16)
assert order.match(text) is None
assert order.fullmatch(text) is None
assert order.fullmatch(found.group(0)) is not None

# Không dùng search để xác thực một trường điện thoại độc lập.
# Đây chỉ là quy tắc minh họa 10 số ASCII bắt đầu bằng 0,
# không chứng minh số tồn tại hay thuộc một nhà mạng hợp lệ.
phone = re.compile(r"0[0-9]{9}")
assert phone.fullmatch("0912345678") is not None
assert phone.fullmatch("SĐT: 0912345678") is None
assert phone.search("SĐT: 0912345678") is not None

# findall có group thu kết quả sẽ đổi hình dạng list trả về
two = "DH-2026-0042 và DH-2026-0043"
assert re.findall(r"DH-[0-9]{4}-[0-9]{4}", two) == [
    "DH-2026-0042", "DH-2026-0043"]
assert order.findall(two) == [("2026", "0042"), ("2026", "0043")]
assert [m.group("seq") for m in order.finditer(two)] == ["0042", "0043"]

# Chuẩn hóa whitespace, nhưng không tự thay đổi nội dung nghiệp vụ
raw = "  Hà   Nội\tQuận 1  "
clean = re.sub(r"\s+", " ", raw).strip()
assert clean == "Hà Nội Quận 1"

# Thay bằng group có tên
assert order.sub(r"ORDER-\g<year>-\g<seq>", "DH-2026-0042") == "ORDER-2026-0042"

# Định dạng ngày đúng chưa đảm bảo ngày tồn tại
day_pattern = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}")
bad_day = "2025-02-29"
assert day_pattern.fullmatch(bad_day) is not None
try:
    date.fromisoformat(bad_day)
except ValueError:
    print("Đúng khuôn YYYY-MM-DD, nhưng ngày không tồn tại")
else:
    raise AssertionError("Ví dụ phải bị từ chối về mặt lịch")

# Escape text người dùng nhập nếu muốn tìm literal
needle = "a+b.txt"
assert re.search(re.escape(needle), "file: a+b.txt") is not None
```

Muốn trích email có thể bắt đầu bằng pattern đơn giản để tìm ứng viên, rồi dùng parser/validator phù hợp yêu cầu. Không quảng cáo một regex ngắn là kiểm đủ mọi email hợp lệ. Với trường cấu trúc như URL, CSV, JSON hoặc HTML lồng nhau, ưu tiên parser đúng định dạng *(bổ sung)*.

> **EN:** A pattern can recognize a date or phone-like format without validating its meaning or existence. Structured formats often need dedicated parsers and domain validation after extraction.

## Greedy, lazy và giới hạn tài nguyên

```python
import re

text = "[A] [B]"
assert re.findall(r"\[.*\]", text) == ["[A] [B]"]
assert re.findall(r"\[.*?\]", text) == ["[A]", "[B]"]
```

`.*` là greedy: cố lấy nhiều ký tự nhất rồi quay lui nếu cần để phần sau khớp. `.*?` là lazy: thử ít trước, nhưng vẫn có thể mở rộng và backtrack. Lazy không có nghĩa “an toàn với mọi input” hay “parser cho cấu trúc lồng”. Nếu nội dung không được chứa `]`, có thể dùng lớp phủ định như `r"\[[^\]]*\]"` để nói rõ giới hạn.

:::pitfall Catastrophic backtracking (bổ sung)
Pattern mơ hồ có lượng từ lồng, như `(a+)+$`, có thể thử rất nhiều cách chia khi input gần khớp nhưng thất bại ở cuối. Không chạy thử input dài với pattern này trong bài. Giới hạn độ dài input, tránh lượng từ lồng mơ hồ, ưu tiên lớp ký tự/định dạng có biên rõ và kiểm thử trên chuỗi gần đúng nhưng sai. `re` chuẩn không cung cấp timeout cho từng lệnh match; lazy không tự sửa vấn đề. Với dữ liệu không tin cậy, cần chiến lược engine/cô lập và ngân sách tài nguyên phù hợp.
:::

> **EN:** Greedy and lazy quantifiers change matching preference, not a general runtime guarantee. Ambiguous nested quantifiers can cause pathological backtracking on near-miss inputs.

## Thử pattern mà không nhầm engine

[RegExr](https://regexr.com/) giúp tô phần khớp và thử pattern nhanh. Kiểm tra engine/flags của công cụ; đừng giả định cú pháp Python như `(?P<year>...)` chạy y hệt ở engine khác. Kết quả cuối cho bài này phải kiểm lại bằng `re` trong Python. Dùng dữ liệu giả lập khi thử trên công cụ web, không dán dữ liệu khách hàng thật.

Một bộ ví dụ thử nên có: chuỗi hợp lệ, không hợp lệ, gần đúng nhưng sai, rỗng, xuống dòng, Unicode và chuỗi dài trong giới hạn dự kiến. Chạy thử không thay thế đặc tả: trước hết phải biết muốn chấp nhận định dạng nào. Xem [tài liệu Python re](https://docs.python.org/3/library/re.html) cho cú pháp/flags cụ thể.

> **EN:** Regex syntax and flags depend on the engine. Verify the final pattern in Python and test valid, invalid, near-miss, empty and Unicode cases against an explicit specification.

## Tóm tắt 1 phút

:::recap
- RegEx mô tả khuôn chuỗi, không tự hiểu ý nghĩa dữ liệu.
- Raw string giúp tránh xung đột escape của Python.
- Search tìm bất kỳ đâu; match nhìn đầu; fullmatch kiểm toàn chuỗi.
- Group giúp trích trường, nhưng làm đổi kết quả findall.
- Greedy/lazy khác ưu tiên khớp, không bảo đảm runtime an toàn.
- Định dạng đúng vẫn cần kiểm nghiệp vụ/lịch/parser.
- Thử trên RegExr rồi kiểm lại đúng engine Python với dữ liệu tự soạn.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Vì sao search thấy mã đơn trong “Đơn DH-2026-0042” mà match không thấy?
A: Search dò mọi vị trí; match cần pattern bắt đầu ở vị trí 0. Input bắt đầu bằng “Đơn ” nên match thất bại, còn search thấy token phía sau.
Q: Pattern 0[0-9]{9} dùng với search có đủ xác thực toàn trường điện thoại không?
A: Không. Search có thể tìm đoạn phù hợp trong chuỗi thừa chữ hoặc số. Dùng fullmatch cho toàn trường; vẫn cần xác thực nghiệp vụ nếu muốn biết số có hợp lệ/thực sự tồn tại.
Q: findall với hai named groups year và seq trả list token đầy đủ hay tuple?
A: Nó trả list tuple của hai group, như [("2026","0042")]. Dùng finditer rồi group(0) nếu muốn Match đầy đủ và thông tin vị trí.
Q: Greedy và lazy cho kết quả gì trên “[A] [B]” với hai pattern trong bài?
A: Pattern greedy lấy một chuỗi “[A] [B]”; lazy lấy hai chuỗi “[A]” và “[B]”. Đây là ưu tiên khớp, không phải bảo đảm hiệu năng.
Q: Vì sao “2025-02-29” khớp định dạng ngày nhưng vẫn sai?
A: Regex trong bài chỉ kiểm bốn số, dấu -, hai số, dấu -, hai số. Năm 2025 không có ngày 29/2; date.fromisoformat phát hiện lỗi lịch.
@tier B | Phỏng vấn lý thuyết
Q: Search, match, fullmatch khác nhau thế nào và chọn khi nào?
A: Search để tìm/trích token trong văn bản; match để kiểm tiền tố có cấu trúc; fullmatch để kiểm toàn trường theo pattern. Chọn theo việc cần một đoạn hay toàn input, không theo thói quen dùng một API.
EN: Search scans anywhere, match anchors to the start, and fullmatch requires the entire input to match. Extraction and field validation need different choices.
Q: Vì sao cần raw string và re.escape?
A: Raw string hạn chế Python xử lý backslash trước khi regex nhận pattern. re.escape bảo vệ metacharacter trong đoạn text cần tìm literal; nó không làm thay vai trò của raw string. Một cái thuộc cú pháp chuỗi Python, một cái thuộc cú pháp regex.
EN: Raw strings avoid Python escape interference; re.escape quotes regex metacharacters in literal text. They solve different problems.
Q: RegEx xác thực định dạng có thay được kiểm tra nghiệp vụ không?
A: Không. Chuỗi ngày có thể đúng khuôn mà sai lịch, số điện thoại đúng số ký tự mà không tồn tại. Dùng regex cho cấu trúc, sau đó parser và quy tắc miền cho ý nghĩa.
EN: Regex validates textual structure; parsers and domain checks are needed for semantic validity and existence.
Q: Vì sao đổi greedy thành lazy chưa xử lý xong catastrophic backtracking?
A: Lazy thay thứ tự các khả năng được thử, vẫn có thể backtrack qua nhiều tổ hợp. Cần bớt mơ hồ/lượng từ lồng, giới hạn input và kiểm near-miss; với nguồn không tin cậy còn phải kiểm ngân sách tài nguyên.
EN: Lazy quantifiers change search order but can still backtrack pathologically. Pattern structure and resource limits matter.
@tier C | Tình huống doanh nghiệp
Q: ETL lấy điện thoại bằng search rồi chấp nhận mọi trường có một đoạn khớp. Dữ liệu rác lọt qua. Sửa sao?
A: Chốt định dạng được phép, chuẩn hóa ngoài theo quy tắc rõ và fullmatch toàn trường. Tách bước trích token khỏi bước xác thực; lưu trường lỗi để kiểm lại thay vì xóa âm thầm. Nếu cần kiểm số thật, thêm xác thực miền ngoài regex; chấp nhận chặt hơn có thể từ chối một số định dạng cũ cần migration.
WANT: Nhận ra lỗi chọn API và thiết kế luồng dữ liệu lỗi có thể truy vết.
Q: Dịch vụ nhận text người dùng, một pattern đôi lúc làm CPU tăng cao. Bạn điều tra gì?
A: Khoanh pattern và input near-miss bằng dữ liệu giả, kiểm lượng từ lồng/nhánh mơ hồ và giới hạn input trước khi match. Viết lại pattern rõ hơn, đo thời gian theo độ dài, cân nhắc engine hoặc cô lập khi cần. Không chạy payload dài vô hạn trong process phục vụ để chứng minh lỗi.
WANT: Hiểu hiệu năng là một phần độ đúng của bộ xử lý input, không chỉ kết quả khớp.
Q: Pattern đúng trên RegExr nhưng lỗi trong Python. Có chép lại thêm backslash đến khi chạy không?
A: Kiểm engine, flags, raw string và các cú pháp riêng như named group trước; tạo bộ test tối thiểu bằng Python re. Chốt một đặc tả chung và test trong môi trường thực thi. Khả năng tương thích cần xác nhận, không chỉnh escape ngẫu nhiên làm đổi pattern.
WANT: Phân tách lớp chuỗi Python, cú pháp regex và khác biệt engine.
:::

## Nối lại quy trình dữ liệu

:::next
Sau khi trích/chuẩn hóa text, kiểm lại dtype, giá trị thiếu và miền hợp lệ ở [[bài:descriptive-statistics]] và [[bài:missing-values-outliers]]. Quay về [[bài:ml-pipeline]] để đặt RegEx đúng vai trò công cụ hỗ trợ; nó không thay thế toàn bộ bước làm sạch hay mô hình ML.
:::
