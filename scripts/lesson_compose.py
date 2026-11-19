"""compose2.py <file bài> <core.md> <description> [tiền tố mục cần BỎ ...]

Lõi mới + mọi mục cũ còn lại thành [sâu]. Tự giữ 'Câu hỏi tự kiểm tra' và 'Nối sang bài sau';
bỏ 'Tóm tắt 1 phút'; mục đầu tiên đổi tên 'Phần mở đầu gốc'. Từ chối chạy nếu bài đã ghép.
"""
import re
import sys

path, core_path, description = sys.argv[1:4]
drops = sys.argv[4:]

src = open(path, encoding="utf-8").read()
if "## [sâu]" in src:
    raise SystemExit("bài đã được ghép rồi: " + path)
m = re.match(r"---\n(.*?)\n---\n(.*)", src, re.S)
fm, body = m.group(1), m.group(2)

parts, cur, infence = [], None, False
for line in body.split("\n"):
    if re.match(r"^\s*(```|~~~)", line):
        infence = not infence
    h = None if infence else re.match(r"^## (.*)$", line)
    if h:
        cur = [h.group(1).strip(), []]
        parts.append(cur)
    elif cur is not None:
        cur[1].append(line)

keep, deep = [], []
for i, (t, b) in enumerate(parts):
    text = "\n".join(b).strip()
    if t.startswith("Câu hỏi tự kiểm tra") or t.startswith("Nối sang") or t.startswith("Nối lại"):
        keep.append((t, text))
    elif t.startswith("Tóm tắt 1 phút") or any(t.startswith(d) for d in drops):
        continue
    elif i == 0:
        deep.append(("Phần mở đầu gốc", text))
    else:
        deep.append((t, text))

fm = re.sub(r"^description:.*$", "description: " + description, fm, flags=re.M)
out = ["---", fm, "---", "", open(core_path, encoding="utf-8").read().strip(), ""]
for t, text in keep:
    out += ["## " + t, "", text, ""]
for t, text in deep:
    out += ["## [sâu] " + t, "", text, ""]
open(path, "w", encoding="utf-8", newline="\n").write("\n".join(out).rstrip() + "\n")
print("ok", path, "keep", len(keep), "deep", len(deep))
