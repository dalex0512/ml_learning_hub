"""Chạy mọi code trong bài thực hành và đối chiếu với khối kết quả (:::out).

  python scripts/practice_verify.py content/06-projects/01-*.md            # kiểm tra
  python scripts/practice_verify.py --fill content/06-projects/01-*.md     # ghi kết quả thật vào :::out

Quy ước trong bài:
  - Mỗi khối ```python chạy theo thứ tự, chung một vùng nhớ (như Python Console).
  - Nếu ngay sau khối code có
        :::out
        ```text
        ...
        ```
        :::
    thì phần text phải bằng đúng những gì code in ra.
  - Code nằm sau dòng @answer (đáp án bài tập) chạy trên BẢN SAO vùng nhớ, không ảnh hưởng bước sau.
  - Dòng đầu "# noverify" bỏ qua việc chạy khối đó.
"""
import contextlib
import io
import os
import re
import sys
import traceback
import warnings

os.environ.setdefault("MPLBACKEND", "Agg")
warnings.filterwarnings("ignore")


def parse(lines):
    """Trả về danh sách khối python: dict(start, end, code, in_answer, out=(s,e) hoặc None)."""
    blocks, i, in_answer = [], 0, False
    while i < len(lines):
        ln = lines[i]
        if ln.startswith(":::ex"):
            in_answer = False
        if ln.strip() == "@answer":
            in_answer = True
        if ln.strip() == ":::" and in_answer:
            in_answer = False
        if ln.strip().startswith("```python"):
            s = i
            j = i + 1
            while not lines[j].strip().startswith("```"):
                j += 1
            blk = dict(start=s, end=j, code="\n".join(lines[s + 1:j]), in_answer=in_answer, out=None)
            k = j + 1
            while k < len(lines) and not lines[k].strip():
                k += 1
            if k < len(lines) and lines[k].strip() == ":::out":
                if lines[k + 1].strip().startswith("```"):
                    e = k + 2
                    while not lines[e].strip().startswith("```"):
                        e += 1
                    blk["out"] = (k + 2, e)  # nội dung nằm giữa k+2 .. e-1
            blocks.append(blk)
            i = j
        i += 1
    return blocks


def run(code, ns):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(code, "<bài>", "exec"), ns)
    return "\n".join(l.rstrip() for l in buf.getvalue().rstrip("\n").split("\n"))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    fill = "--fill" in sys.argv
    bad = 0
    for path in args:
        with open(path, encoding="utf-8") as f:
            lines = f.read().split("\n")
        blocks = parse(lines)
        ns = {"__name__": "__bai__"}
        patches = []
        print(f"== {path}: {len(blocks)} khối code")
        for n, b in enumerate(blocks):
            code = b["code"]
            if code.lstrip().startswith("# noverify"):
                continue
            target = dict(ns) if b["in_answer"] else ns
            try:
                got = run(code, target)
            except Exception:
                bad += 1
                print(f"-- LỖI ở khối {n} (dòng {b['start'] + 1}):")
                traceback.print_exc(limit=3)
                continue
            if b["out"]:
                s, e = b["out"]
                want = "\n".join(l.rstrip() for l in lines[s:e])
                if fill:
                    patches.append((s, e, got.split("\n") if got else []))
                elif want != got:
                    bad += 1
                    print(f"-- LỆCH ở khối {n} (dòng {b['start'] + 1}):\n--- bài ghi:\n{want}\n--- chạy thật:\n{got}")
            elif got and not b["in_answer"]:
                pass
        if fill:
            for s, e, new in reversed(patches):
                lines[s:e] = new
            with open(path, "w", encoding="utf-8", newline="\n") as f:
                f.write("\n".join(lines))
            print(f"   đã ghi {len(patches)} khối kết quả")
    print("XONG" if not bad else f"CÓ {bad} VẤN ĐỀ")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
