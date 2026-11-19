"""lesson_recompose.py <file bài> <core.md> [description]

Thay PHẦN LÕI của một bài đã ghép (phần nằm trước mục 'Câu hỏi tự kiểm tra') bằng lõi mới.
Giữ nguyên frontmatter (trừ description nếu có), quiz, 'Nối sang bài sau' và mọi mục [sâu].
"""
import re
import sys

path, core_path = sys.argv[1:3]
desc = sys.argv[3] if len(sys.argv) > 3 else None
src = open(path, encoding="utf-8").read()
m = re.match(r"(---\n.*?\n---\n)(.*)", src, re.S)
fm, body = m.group(1), m.group(2)
cut = None
for mm in re.finditer(r"^## (.*)$", body, re.M):
    t = mm.group(1)
    if t.startswith("Câu hỏi tự kiểm tra") or t.startswith("Nối sang") or t.startswith("Nối lại") or t.startswith("[sâu]"):
        cut = mm.start()
        break
if cut is None:
    raise SystemExit("không thấy điểm cắt")
if desc:
    fm = re.sub(r"^description:.*$", "description: " + desc, fm, flags=re.M)
core = open(core_path, encoding="utf-8").read().strip()
open(path, "w", encoding="utf-8", newline="\n").write(fm + "\n" + core + "\n\n" + body[cut:])
print("ok", path)
