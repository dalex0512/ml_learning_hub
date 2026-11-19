# Số dùng trong bài 01 (ví dụ tự soạn: luật "chứa free" trên 10 email)
tp, fp, fn, tn = 3, 1, 2, 4
print("precision", tp / (tp + fp), "recall", tp / (tp + fn), "accuracy", (tp + tn) / 10)
