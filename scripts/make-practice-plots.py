"""Sinh hình cho bài thực hành Diabetes (public/plots/practice/*-light.png / *-dark.png).

Chạy từ thư mục gốc dự án:  python scripts/make-practice-plots.py
Nền trong suốt; mỗi hình có hai bản sáng/tối, CSS của chế độ đọc tự chọn bản đúng.
Mọi số phải trùng với code trong bài (cùng seed, cùng cách chia).
"""
import os
import warnings

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_score, recall_score
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

warnings.filterwarnings("ignore")
OUT = os.path.join("public", "plots", "practice")
os.makedirs(OUT, exist_ok=True)

THEMES = {
    "light": dict(fg="#23262B", muted="#646B73", line="#CFCFC8", accent="#B5432D", blue="#3B6E8F"),
    "dark": dict(fg="#D8DADF", muted="#959BA3", line="#3A3C42", accent="#E8907D", blue="#7FB0D1"),
}

data = pd.read_csv("dataset/diabetes.csv")
x = data.drop(columns="Outcome")
y = data["Outcome"]
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(x_train)
x_train_s, x_test_s = scaler.transform(x_train), scaler.transform(x_test)
model = LogisticRegression().fit(x_train_s, y_train)


def style(ax, t):
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    for s in ("left", "bottom"):
        ax.spines[s].set_color(t["line"])
    ax.tick_params(colors=t["muted"], labelsize=10)
    ax.xaxis.label.set_color(t["muted"])
    ax.yaxis.label.set_color(t["muted"])
    ax.title.set_color(t["fg"])


def save(fig, name, theme):
    fig.savefig(os.path.join(OUT, f"{name}-{theme}.png"), dpi=170, transparent=True, bbox_inches="tight")
    plt.close(fig)


def distance_share(X, n_pairs=5000, seed=0):
    rng = np.random.default_rng(seed)
    i, j = rng.integers(0, len(X), (2, n_pairs))
    sq = (X[i] - X[j]) ** 2
    sq = sq[sq.sum(axis=1) > 0]
    return (sq / sq.sum(axis=1, keepdims=True)).mean(axis=0)


def build(theme):
    t = THEMES[theme]

    # 1. Glucose theo Outcome
    fig, ax = plt.subplots(figsize=(7, 3.4))
    bins = np.arange(0, 221, 10)
    ax.hist(data.loc[data.Outcome == 0, "Glucose"], bins=bins, alpha=0.75, color=t["blue"], label="Outcome 0 (500 người)")
    ax.hist(data.loc[data.Outcome == 1, "Glucose"], bins=bins, alpha=0.75, color=t["accent"], label="Outcome 1 (268 người)")
    ax.set_xlabel("Glucose")
    ax.set_ylabel("Số người")
    ax.legend(frameon=False, labelcolor=t["fg"], fontsize=10)
    style(ax, t)
    save(fig, "glucose", theme)

    # 2. 30 cách chia, cùng một cây
    scores = []
    for seed in range(30):
        a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=seed)
        scores.append(DecisionTreeClassifier(random_state=0).fit(a, c).score(b, d))
    fig, ax = plt.subplots(figsize=(7, 3.2))
    ax.scatter(range(30), scores, color=t["accent"], s=28)
    ax.axhline(np.mean(scores), color=t["muted"], lw=1, ls="--")
    ax.set_ylim(0.6, 0.82)
    ax.set_xlabel("random_state của lần chia (0 đến 29)")
    ax.set_ylabel("Accuracy trên bộ test")
    style(ax, t)
    save(fig, "seeds", theme)

    # 3. Phần đóng góp vào khoảng cách
    raw = distance_share(x_train.to_numpy())
    scaled = distance_share(x_train_s)
    order = np.argsort(raw)
    fig, ax = plt.subplots(figsize=(7, 3.8))
    pos = np.arange(len(order))
    ax.barh(pos + 0.2, raw[order] * 100, height=0.38, color=t["accent"], label="Dữ liệu gốc")
    ax.barh(pos - 0.2, scaled[order] * 100, height=0.38, color=t["blue"], label="Sau StandardScaler")
    ax.set_yticks(pos)
    ax.set_yticklabels(np.array(x.columns)[order])
    ax.set_xlabel("% khoảng cách (bình phương) do cột này tạo ra, trung bình 5000 cặp người")
    ax.legend(frameon=False, labelcolor=t["fg"], fontsize=10, loc="lower right")
    style(ax, t)
    save(fig, "distance", theme)

    # 4. Trọng số của Logistic
    w = pd.Series(model.coef_[0], index=x.columns).sort_values()
    fig, ax = plt.subplots(figsize=(7, 3.6))
    ax.barh(w.index, w.values, color=[t["accent"] if v > 0 else t["blue"] for v in w.values])
    ax.axvline(0, color=t["line"], lw=1)
    ax.set_xlabel("Trọng số (cột đã chuẩn hoá): dương đẩy về 'có bệnh', âm đẩy về 'không'")
    style(ax, t)
    save(fig, "weights", theme)

    # 5. Confusion matrix (ô đúng màu xanh, ô sai màu đỏ)
    cm = confusion_matrix(y_test, model.predict(x_test_s))
    fig, ax = plt.subplots(figsize=(3.8, 3.2))
    names = [["TN", "FP"], ["FN", "TP"]]
    for r in range(2):
        for c in range(2):
            good = r == c
            ax.add_patch(plt.Rectangle((c - 0.5, r - 0.5), 1, 1, color=t["blue"] if good else t["accent"], alpha=0.28, lw=0))
            ax.text(c, r, f"{names[r][c]}\n{cm[r, c]}", ha="center", va="center", fontsize=14, color=t["fg"])
    ax.set_xlim(-0.5, 1.5)
    ax.set_ylim(1.5, -0.5)
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["đoán 0", "đoán 1"])
    ax.set_yticks([0, 1])
    ax.set_yticklabels(["thật 0", "thật 1"])
    for sp in ax.spines.values():
        sp.set_visible(False)
    ax.tick_params(colors=t["muted"], labelsize=10, length=0)
    save(fig, "confusion", theme)

    # 6. Precision/recall theo ngưỡng
    proba = model.predict_proba(x_test_s)[:, 1]
    ts = np.linspace(0.05, 0.9, 60)
    prec = [precision_score(y_test, (proba >= v).astype(int), zero_division=0) for v in ts]
    rec = [recall_score(y_test, (proba >= v).astype(int)) for v in ts]
    fig, ax = plt.subplots(figsize=(7, 3.4))
    ax.plot(ts, rec, color=t["accent"], lw=2, label="recall")
    ax.plot(ts, prec, color=t["blue"], lw=2, label="precision")
    for v in (0.3, 0.5, 0.7):
        ax.axvline(v, color=t["line"], lw=1, ls=":")
    ax.set_xlabel("Ngưỡng: đoán 'có bệnh' khi xác suất lớn hơn hoặc bằng ngưỡng")
    ax.legend(frameon=False, labelcolor=t["fg"], fontsize=10)
    style(ax, t)
    save(fig, "thresholds", theme)

    # 7. Điểm từng fold của 5 mô hình (CV trên bộ train)
    models = {
        "Logistic": LogisticRegression(),
        "KNN": KNeighborsClassifier(),
        "SVM": SVC(),
        "Tree": DecisionTreeClassifier(random_state=42),
        "Forest": RandomForestClassifier(random_state=42),
    }
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    fig, ax = plt.subplots(figsize=(7, 3.6))
    for k, (name, m) in enumerate(models.items()):
        r = cross_validate(Pipeline([("scaler", StandardScaler()), ("model", m)]), x_train, y_train, cv=skf, scoring="accuracy")
        s = r["test_score"]
        ax.scatter([k] * len(s), s, color=t["blue"], s=26, alpha=0.9)
        ax.hlines(s.mean(), k - 0.25, k + 0.25, color=t["accent"], lw=2.5)
    ax.set_xticks(range(len(models)))
    ax.set_xticklabels(models.keys())
    ax.set_ylabel("Accuracy từng fold")
    style(ax, t)
    save(fig, "folds", theme)


for th in THEMES:
    build(th)
print("done", sorted(os.listdir(OUT)))
