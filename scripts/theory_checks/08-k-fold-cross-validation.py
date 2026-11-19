# Số bài 08: lấy từ scripts/make-widget-data.py (folds.json). Chạy lại để kiểm.
import json
d = json.load(open("components/widgets/data/folds.json"))
import numpy as np
for k, v in d["folds"].items(): print(k, round(float(np.mean(v)), 3), round(float(np.std(v)), 3))
print("holdout", min(d["holdout"]), max(d["holdout"]))
print("fold size", 614 / 10, 614 / 5, "100 mau: 85/4 =", 85 / 4)
