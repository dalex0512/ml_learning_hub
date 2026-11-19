---
title: Regular Expression — tìm và làm sạch dữ liệu chuỗi với Python re
order: 23
description: "Regex mô tả hình dạng của chuỗi: ký hiệu cốt lõi, search, match, fullmatch, nhóm, greedy và lazy, và làm sạch cột chuỗi trong pandas; có ô thử pattern."
slides: null
needs: [feature-and-data-types]
tags: [regex, python, text-cleaning, pattern, validation]
---

## Ta cần tìm khuôn mẫu nào trong chuỗi?

:::intro Mục tiêu bài này
- Hiểu **regular expression (regex)** là cách mô tả **hình dạng** của chuỗi cần tìm, thay cho hàng chục câu `if`.
- Đọc bộ ký hiệu cốt lõi, phân biệt `search`, `match`, `fullmatch`, và dùng **nhóm** để trích dữ liệu.
- Biết khác biệt **greedy** và **lazy**, và làm sạch một cột chuỗi trong pandas bằng regex.
:::

Dữ liệu thật thường có cột chữ lộn xộn: số điện thoại viết nhiều kiểu, email lẫn trong câu, khoảng trắng thừa, ngày tháng lẫn trong ghi chú. Thay vì viết hàng chục `if`, ta mô tả **hình dạng** cần tìm bằng một **pattern**, ví dụ "ba chữ số, dấu gạch, bốn chữ số":

```python
import re
re.findall(r"\d{3}-\d{4}", "Gọi 555-1234 hoặc 555-9876")
# ['555-1234', '555-9876']
```

Hãy tự thử pattern trên các chuỗi mẫu, rồi tự sửa pattern và chuỗi:

:::widget regex-tester
:::

## Bộ ký hiệu đủ dùng

| Ký hiệu | Nghĩa |
|---|---|
| `\d`, `\w`, `\s` | một chữ số / một ký tự chữ-số-gạch dưới / một khoảng trắng |
| `\D`, `\W`, `\S` | phủ định của ba cái trên |
| `.` | một ký tự bất kỳ (**trừ xuống dòng**) |
| `[abc]`, `[a-z]`, `[^abc]` | một ký tự trong tập / ngoài tập |
| `+`, `*`, `?` | một hoặc nhiều / không hoặc nhiều / không hoặc một |
| `{3}`, `{2,4}` | đúng 3 / từ 2 đến 4 lần |
| `^`, `$` | đầu chuỗi / cuối chuỗi |
| `( )`, `\|` | nhóm để trích / hoặc |
| `\.` | dấu chấm **thật** (cần "thoát" ký tự đặc biệt) |

Ví dụ: `a.c` khớp `abc` nhưng với `a.c` bạn phải viết `a\.c` nếu muốn đúng dấu chấm. Trên chuỗi `"abc a\nc"`, `a.c` chỉ khớp `abc` vì `.` không khớp xuống dòng (trừ khi bật cờ `re.S`).

:::predict
Pattern `\d+` được dùng với `search`, `match` và `fullmatch` trên chuỗi `"abc123"`. Hàm nào tìm thấy, hàm nào không?
@answer
`re.search(r"\d+", "abc123")` **tìm thấy** (quét cả chuỗi, thấy "123"). `re.match(r"\d+", "abc123")` **không** (chỉ khớp từ **đầu** chuỗi, mà đầu chuỗi là chữ). `re.fullmatch(r"\d+", "abc123")` **không** (cả chuỗi phải khớp). Còn `re.fullmatch(r"\d+", "123")` thì **có**, và `re.fullmatch(r"\d+", "123a")` thì **không**.
:::

## Tìm, trích, kiểm, thay

- **`re.findall(p, s)`:** liệt kê mọi phần khớp. Trích email: `re.findall(r"[\w.]+@[\w.]+\.\w+", "an@mail.com, binh.k@corp.vn")` cho `['an@mail.com', 'binh.k@corp.vn']`.
- **`re.fullmatch(p, s)`:** kiểm cả chuỗi có đúng khuôn không (xác nhận định dạng). Số điện thoại `0\d{9}`: `"0912345678"` đúng, `"912345678"` sai.
- **`re.sub(p, thay, s)`:** thay mọi phần khớp. `re.sub(r"\s+", " ", "a   b \t c")` cho `'a b c'` (gộp khoảng trắng).
- **`re.split(p, s)`:** cắt theo pattern: `re.split(r"[,;]\s*", "a, b;c,  d")` cho `['a', 'b', 'c', 'd']`.

### Nhóm `( )`: lấy từng phần của phần khớp

```python
m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "Ngày 2024-11-19 giờ 08:30")
m.groups()      # ('2024', '11', '19')
m.group(0)      # '2024-11-19' (toàn bộ phần khớp)
m = re.search(r"(?P<y>\d{4})-(?P<m>\d{2})-(?P<d>\d{2})", "2024-11-19")
m.groupdict()   # {'y': '2024', 'm': '11', 'd': '19'}
```

Mỗi cặp ngoặc là một nhóm, đánh số từ 1; nhóm có tên dùng `(?P<tên>...)` (cú pháp riêng của Python).

## Greedy và lazy: khớp tham lam hay vừa đủ

Mặc định `+` và `*` **tham lam**: lấy nhiều nhất có thể. Thêm `?` thì thành **lazy**: lấy ít nhất có thể.

:::steps
Chuỗi `"<a><b>"`. Pattern `<.+>`: `<` khớp ở đầu, `.+` ban đầu nuốt **hết** phần còn lại, rồi lùi dần cho tới khi gặp `>` cuối cùng.
@step
Kết quả **greedy**: `re.findall(r"<.+>", "<a><b>")` cho `['<a><b>']`: một phần khớp duy nhất, nuốt cả hai thẻ.
@step
Pattern `<.+?>` (lazy): `.+?` lấy **ít nhất có thể** rồi dừng ở `>` đầu tiên. Kết quả `['<a>', '<b>']`: từng thẻ một.
@step
Cách khác không cần lazy: `<[^>]+>` (mọi ký tự trừ `>`). Với `"<b>đậm</b> và <i>nghiêng</i>"` cho `['<b>', '</b>', '<i>', '</i>']`.
:::

:::ck
Bạn muốn lấy từng thẻ HTML riêng trong chuỗi `"<b>đậm</b> và <i>nghiêng</i>"`. Dùng `<.+>` có đúng không? Dùng gì thay?
@answer
**Không đúng**: `<.+>` tham lam sẽ nuốt từ `<b>` đầu đến `</i>` cuối thành **một** phần khớp. Dùng `<.+?>` (lazy) hoặc `<[^>]+>`.
:::

## Làm sạch cột chuỗi trong pandas

Regex là công cụ chính khi làm sạch dữ liệu chuỗi trong Step 2 và 3 của pipeline ([[bài:ml-pipeline]]). pandas có các hàm `str` nhận regex:

```python
s = pd.Series(["(028) 3822-1234", "0912.345.678", "+84 912 345 678"])
s.str.replace(r"\D", "", regex=True).tolist()
# ['02838221234', '0912345678', '84912345678']      # chỉ giữ chữ số
pd.Series(["Order #123 ok", "Order #4567", "none"]).str.extract(r"#(\d+)")[0].tolist()
# ['123', '4567', nan]                                # trích số sau dấu #
```

`\D` là "ký tự **không** phải chữ số", nên thay chúng bằng chuỗi rỗng chỉ còn lại chữ số. `str.extract` trả `NaN` khi không khớp, và `NaN` đó là dữ liệu thiếu thật ([[bài:missing-values-outliers]]).

## Viết pattern cẩn thận bằng Python

Thư viện `re` có sẵn trong Python, không cần cài thêm. Đoạn dưới đã chạy kiểm bằng `assert` (dữ liệu tự soạn): biên dịch pattern một lần, dùng nhóm có tên, và phân biệt `search`, `match`, `fullmatch`.

```python
import re
from datetime import date
text = "Đơn DH-2026-0042, tổng 150000 VND"
order = re.compile(r"\bDH-(?P<year>[0-9]{4})-(?P<seq>[0-9]{4})\b")
found = order.search(text)
assert found.group(0) == "DH-2026-0042"
assert found.groupdict() == {"year": "2026", "seq": "0042"}
assert found.span() == (4, 16)                       # vị trí trong chuỗi
assert order.match(text) is None                      # không khớp từ đầu chuỗi
assert order.fullmatch(text) is None                  # cả chuỗi không khớp
assert order.fullmatch(found.group(0)) is not None

phone = re.compile(r"0[0-9]{9}")                      # quy tắc minh họa: 10 số, bắt đầu bằng 0
assert phone.fullmatch("0912345678") is not None
assert phone.fullmatch("SĐT: 0912345678") is None     # xác thực một trường: dùng fullmatch
assert phone.search("SĐT: 0912345678") is not None    # tìm trong văn bản: dùng search
```

Mấy điều dễ vấp, mỗi điều có một dòng kiểm:

```python
# findall: có nhóm thì trả về danh sách các bộ nhóm, không phải toàn bộ phần khớp
two = "DH-2026-0042 và DH-2026-0043"
assert re.findall(r"DH-[0-9]{4}-[0-9]{4}", two) == ["DH-2026-0042", "DH-2026-0043"]
assert order.findall(two) == [("2026", "0042"), ("2026", "0043")]
assert [m.group("seq") for m in order.finditer(two)] == ["0042", "0043"]

# Gộp khoảng trắng; thay bằng nhóm có tên
assert re.sub(r"\s+", " ", "  Hà   Nội\tQuận 1  ").strip() == "Hà Nội Quận 1"
assert order.sub(r"ORDER-\g<year>-\g<seq>", "DH-2026-0042") == "ORDER-2026-0042"

# Đúng khuôn chưa chắc đúng ý nghĩa: 2025-02-29 khớp YYYY-MM-DD nhưng ngày không tồn tại
assert re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", "2025-02-29") is not None
try:
    date.fromisoformat("2025-02-29")
except ValueError:
    print("Đúng khuôn, nhưng ngày không tồn tại")

# Tìm một chuỗi người dùng nhập theo nghĩa đen: escape trước
assert re.search(re.escape("a+b.txt"), "file: a+b.txt") is not None
```

**Greedy và lazy, thêm một lần nữa.** `re.findall(r"\[.*\]", "[A] [B]")` cho `["[A] [B]"]` (greedy lấy hết), còn `r"\[.*?\]"` cho `["[A]", "[B]"]`. Lazy không có nghĩa là "luôn dừng sớm": nếu phần sau chưa khớp, nó vẫn mở rộng và quay lui.

**Giới hạn tài nguyên (catastrophic backtracking).** Pattern mơ hồ có lượng từ lồng nhau, như `(a+)+$`, có thể thử rất nhiều cách chia khi input gần khớp nhưng thất bại ở cuối; với input dài thời gian tăng vọt. Đừng chạy thử input dài lên pattern chưa kiểm, và đừng đưa pattern phức tạp trực tiếp lên dữ liệu người dùng không tin cậy.

**Thử pattern mà không nhầm engine.** Công cụ trực tuyến như RegExr giúp tô phần khớp nhanh, nhưng hãy kiểm tra engine và cờ của công cụ: cú pháp Python như `(?P<year>...)` không chạy y hệt ở mọi nơi (ô thử ở đầu bài chạy bằng engine JavaScript). Một bộ ví dụ thử nên có: chuỗi hợp lệ, không hợp lệ, gần đúng nhưng sai, rỗng, có xuống dòng, có Unicode, và chuỗi dài trong giới hạn dự kiến. Với email, chỉ nên dùng một pattern đơn giản để tìm ứng viên rồi dùng bộ xác thực phù hợp yêu cầu, thay vì tin một regex ngắn là kiểm tra đủ.

## Những hiểu sai thường gặp

- **"`.` khớp mọi thứ."** Không khớp xuống dòng (trừ khi bật `re.S`); và muốn khớp dấu chấm thật phải viết `\.`.
- **"`match` và `search` như nhau."** `match` chỉ khớp từ **đầu** chuỗi; `search` quét cả chuỗi.
- **"Regex hoàn hảo cho mọi thứ."** Không dùng regex để phân tích HTML hoặc email đầy đủ theo chuẩn; pattern đơn giản chỉ bắt được các trường hợp thường gặp.
- **"Viết pattern một lần là xong."** Luôn thử trên cả ví dụ **sẽ khớp** lẫn **không nên khớp**.
- **"Regex mọi nơi giống nhau."** Python, JavaScript, công cụ web có khác biệt nhỏ; kiểm tra bằng **đúng engine** bạn sẽ dùng, và dùng chuỗi thô `r"..."` trong Python để khỏi phải nhân đôi dấu gạch chéo.

:::card Regular expression
- **Pattern mô tả hình dạng** của chuỗi cần tìm: `\d{3}-\d{4}`.
- **Ký hiệu cốt lõi:** `\d \w \s . [] + * ? {n} ^ $ () |`; thoát dấu chấm bằng `\.`.
- **`search`** quét cả chuỗi; **`match`** chỉ từ đầu; **`fullmatch`** cả chuỗi phải khớp; **`findall`, `sub`, `split`**; **nhóm `( )`** để trích từng phần.
- **Greedy** (`.+`) lấy nhiều nhất, **lazy** (`.+?`) lấy ít nhất (`<.+>` so với `<.+?>`).
- **Trong pandas:** `str.replace(r"\D", "", regex=True)`, `str.extract(r"#(\d+)")`.
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
