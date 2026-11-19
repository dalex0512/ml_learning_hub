import numpy as np, pandas as pd
d = pd.read_csv("dataset/diabetes.csv"); p = d.Pregnancies
mn, mx, mu, sd = p.min(), p.max(), p.mean(), p.std(ddof=0)
print("min", mn, "max", mx, "mean", round(mu, 6), "std", round(sd, 6))
for v in (6, 1, 8, 0, 17): print(v, "minmax", round((v - mn) / (mx - mn), 6), "standard", round((v - mu) / sd, 6))
# ví dụ outlier và ví dụ 2,4,4,5,10 (xem bài)
w = np.array([2, 4, 4, 5, 100.]); print(((w - 2) / 98).round(3), ((w - w.mean()) / w.std()).round(2))
