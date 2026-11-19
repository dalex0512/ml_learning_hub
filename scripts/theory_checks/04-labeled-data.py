# Số bài 04: mẫu thứ 6, shape, luật Glucose>=140 trên 24 hàng đầu (xem scripts/make-widget-data.py, rows.json)
import pandas as pd, numpy as np
d = pd.read_csv("dataset/diabetes.csv")
print(d.iloc[5].tolist(), d.drop(columns="Outcome").shape, d["Outcome"].shape)
h = d.head(24); perm = np.random.default_rng(0).permutation(24)
print(((h.Glucose >= 140).astype(int) == h.Outcome).mean(), ((h.Glucose.to_numpy()[perm] >= 140).astype(int) == h.Outcome.to_numpy()).mean())
