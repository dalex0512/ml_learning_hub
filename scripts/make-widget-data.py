"""Sinh dữ liệu cho các công cụ tương tác (components/widgets/data/*.json).

Chạy từ thư mục gốc dự án:  python scripts/make-widget-data.py
Mọi số phải trùng với bài thực hành Diabetes (cùng split 42, cùng seed).
"""
import json
import os
import warnings

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, StandardScaler

warnings.filterwarnings("ignore")
OUT = os.path.join("components", "widgets", "data")
os.makedirs(OUT, exist_ok=True)

data = pd.read_csv("dataset/diabetes.csv")
x = data.drop(columns="Outcome")
y = data["Outcome"]
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
cols = list(x.columns)


def dump(name, obj):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
    print(name, os.path.getsize(os.path.join(OUT, name)), "bytes")


# 1. Ngưỡng: xác suất của Logistic (giống Project) và 10 email tự soạn
scaler = StandardScaler().fit(x_train)
model = LogisticRegression().fit(scaler.transform(x_train), y_train)
proba = model.predict_proba(scaler.transform(x_test))[:, 1]
pred = (proba >= 0.5).astype(int)
tn = int(((pred == 0) & (y_test == 0)).sum()); fp = int(((pred == 1) & (y_test == 0)).sum())
fn = int(((pred == 0) & (y_test == 1)).sum()); tp = int(((pred == 1) & (y_test == 1)).sum())
assert (tn, fp, fn, tp) == (79, 20, 18, 37), (tn, fp, fn, tp)
dump("threshold.json", {
    "diabetes": {"scores": [round(float(p), 4) for p in proba], "labels": [int(v) for v in y_test]},
    "email": {
        "scores": [0.95, 0.90, 0.85, 0.80, 0.60, 0.55, 0.40, 0.30, 0.20, 0.10],
        "labels": [1, 1, 0, 1, 1, 0, 1, 0, 0, 0],
    },
})


# 2. Scaler: khoảng cách giữa hai bệnh nhân
def distance_share(X, n_pairs=5000, seed=0):
    rng = np.random.default_rng(seed)
    i, j = rng.integers(0, len(X), (2, n_pairs))
    sq = (X[i] - X[j]) ** 2
    sq = sq[sq.sum(axis=1) > 0]
    return (sq / sq.sum(axis=1, keepdims=True)).mean(axis=0)


mm = MinMaxScaler().fit(x_train)
raw = distance_share(x_train.to_numpy())
std = distance_share(scaler.transform(x_train))
mmx = distance_share(mm.transform(x_train))
rows = [x.iloc[3].tolist(), x.iloc[4].tolist()] + x_train.head(120).values.tolist()
dump("scaler.json", {
    "cols": cols,
    "rows": rows,
    "mean": [round(float(v), 6) for v in scaler.mean_],
    "scale": [round(float(v), 6) for v in scaler.scale_],
    "min": [float(v) for v in mm.data_min_],
    "max": [float(v) for v in mm.data_max_],
    "summary": {
        "raw": [round(float(v), 4) for v in raw],
        "standard": [round(float(v), 4) for v in std],
        "minmax": [round(float(v), 4) for v in mmx],
    },
})

# 3. K-fold: điểm từng fold của Logistic (Pipeline scaler + model) trên bộ train
folds = {}
for k in (3, 5, 10):
    skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=42)
    r = cross_validate(Pipeline([("s", StandardScaler()), ("m", LogisticRegression())]), x_train, y_train,
                       cv=skf, scoring="accuracy")
    folds[str(k)] = [round(float(v), 4) for v in r["test_score"]]
holdout = []
for seed in range(30):
    a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=seed)
    s = StandardScaler().fit(a)
    holdout.append(round(float(LogisticRegression().fit(s.transform(a), c).score(s.transform(b), d)), 4))
dump("folds.json", {"folds": folds, "holdout": holdout})
print("holdout", min(holdout), max(holdout))
print({k: (round(float(np.mean(v)), 3), round(float(np.std(v)), 3)) for k, v in folds.items()})
print("raw", raw.round(3), "std", std.round(3), "mm", mmx.round(3))

# 4. Bảng 24 hàng đầu của Diabetes (bài X và y) + hoán vị cố định để minh họa xáo lệch
head = data.head(24)
perm = [int(v) for v in np.random.default_rng(0).permutation(24)]
aligned = float(((head["Glucose"] >= 140).astype(int) == head["Outcome"]).mean())
shuffled = float(((head["Glucose"].to_numpy()[perm] >= 140).astype(int) == head["Outcome"].to_numpy()).mean())
dump("rows.json", {"cols": cols + ["Outcome"], "rows": head.values.tolist(), "perm": perm, "aligned": aligned, "shuffled": shuffled})
print("aligned", aligned, "shuffled", shuffled)
