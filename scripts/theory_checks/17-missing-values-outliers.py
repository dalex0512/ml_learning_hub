import numpy as np, pandas as pd
d = pd.read_csv("dataset/diabetes.csv")
f = d.Insulin.head(20).tolist(); print(f)
nz = [v for v in f if v > 0]; print("zeros", f.count(0), "nonzero", len(nz), "median nz", np.median(nz), "mean nz", round(np.mean(nz), 2), "mean all", round(np.mean(f), 2), "median all", np.median(f))
print("fill mean:", round(np.mean(nz), 1), "-> new mean", round((sum(nz) + f.count(0) * np.mean(nz)) / 20, 2))
ins = d.Insulin[d.Insulin > 0]
q1, q3 = ins.quantile([.25, .75]); iqr = q3 - q1; print("n", len(ins), "q1", q1, "q3", q3, "iqr", iqr, "fence", q3 + 1.5 * iqr, "above", (ins > q3 + 1.5 * iqr).sum(), "k=3 fence", q3 + 3 * iqr, (ins > q3 + 3 * iqr).sum())
z = (ins - ins.mean()) / ins.std(ddof=0); print("mean", round(ins.mean(), 2), "std", round(ins.std(ddof=0), 2), "z>3", (z > 3).sum(), "z>2", (z > 2).sum(), "max", ins.max(), "max z", round(z.max(), 2))
print("lower fence", q1 - 1.5 * iqr)
# train-based
from sklearn.model_selection import train_test_split
x = d.drop(columns="Outcome"); y = d.Outcome
xtr, xte, ytr, yte = train_test_split(x, y, test_size=0.2, random_state=42)
t = xtr.Insulin.replace(0, np.nan); print("train median", t.median(), "mean", round(t.mean(), 1), "missing", t.isna().sum())
