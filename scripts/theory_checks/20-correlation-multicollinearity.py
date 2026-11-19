import numpy as np, pandas as pd
from sklearn.linear_model import LinearRegression
d = pd.read_csv("dataset/diabetes.csv")
x = np.array([1, 2, 3, 4, 5.]); y = np.array([2, 4, 5, 4, 5.]); print("r", round(np.corrcoef(x, y)[0, 1], 4))
t = np.arange(10, 46, 5.); s = -(t - 27.5) ** 2 + 600  # dạng parabol như slide 50
print("parabola r", round(np.corrcoef(t, s)[0, 1], 4))
c = d.drop(columns="Outcome").corr(); mask = np.triu(np.ones(c.shape, bool), 1)
pairs = c.where(mask).stack().sort_values(key=abs, ascending=False).head(4); print(pairs.round(3).to_dict())
print("max abs feature-feature", round(c.where(mask).stack().abs().max(), 3))
print("corr with outcome", d.corr()["Outcome"].drop("Outcome").round(3).to_dict())
# thiếu trá hình: bỏ số 0 ở Glucose/BMI rồi tính lại
g = d[(d.Glucose > 0)]; print("Glucose-Outcome r with zeros", round(d.Glucose.corr(d.Outcome), 3), "without zeros", round(g.Glucose.corr(g.Outcome), 3))
b = d[(d.BMI > 0)]; print("BMI-Outcome with zeros", round(d.BMI.corr(d.Outcome), 3), "without", round(b.BMI.corr(b.Outcome), 3))
f = d.drop(columns="Outcome")
vif = {}
for col in f.columns:
    X = f.drop(columns=col); r2 = LinearRegression().fit(X, f[col]).score(X, f[col]); vif[col] = round(1 / (1 - r2), 2)
print("VIF", vif)
# hai feature gần trùng: thêm cột trọng lượng kg và lb
rng = np.random.default_rng(0); n = 200; kg = rng.normal(70, 10, n); lb = kg * 2.2046 + rng.normal(0, 0.5, n); yy = 0.3 * kg + rng.normal(0, 3, n)
for seed in (1, 2, 3):
    i = np.random.default_rng(seed).choice(n, 100, replace=False)
    m = LinearRegression().fit(np.c_[kg[i], lb[i]], yy[i]); print("coef", m.coef_.round(2), "corr", round(np.corrcoef(kg, lb)[0, 1], 4))
