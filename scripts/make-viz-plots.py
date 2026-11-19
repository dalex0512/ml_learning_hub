"""Hình cho bài 22 (public/plots/viz/*-light|dark.png) từ bộ Diabetes. Chạy: python scripts/make-viz-plots.py"""
import os, warnings
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, numpy as np, pandas as pd
warnings.filterwarnings("ignore")
OUT = os.path.join("public", "plots", "viz"); os.makedirs(OUT, exist_ok=True)
T = {"light": dict(fg="#23262B", muted="#646B73", line="#CFCFC8", a="#B5432D", b="#3B6E8F"),
     "dark": dict(fg="#D8DADF", muted="#959BA3", line="#3A3C42", a="#E8907D", b="#7FB0D1")}
d = pd.read_csv("dataset/diabetes.csv")

def sty(ax, t):
    for s in ("top", "right"): ax.spines[s].set_visible(False)
    for s in ("left", "bottom"): ax.spines[s].set_color(t["line"])
    ax.tick_params(colors=t["muted"], labelsize=9); ax.title.set_color(t["fg"]); ax.xaxis.label.set_color(t["muted"]); ax.yaxis.label.set_color(t["muted"])

def save(fig, name, th): fig.savefig(os.path.join(OUT, f"{name}-{th}.png"), dpi=150, transparent=True, bbox_inches="tight"); plt.close(fig)

for th, t in T.items():
    # 1. histogram 4 cột
    fig, axs = plt.subplots(2, 2, figsize=(7, 4.4))
    for ax, c in zip(axs.ravel(), ["Glucose", "Insulin", "BMI", "Age"]):
        ax.hist(d[c], bins=25, color=t["b"]); ax.set_title(c, fontsize=10); sty(ax, t)
    fig.tight_layout(); save(fig, "hist", th)
    # 2. box plot theo Outcome
    fig, axs = plt.subplots(1, 4, figsize=(8, 3.6))
    for ax, c in zip(axs, ["Glucose", "Insulin", "BMI", "Age"]):
        bp = ax.boxplot([d.loc[d.Outcome == 0, c], d.loc[d.Outcome == 1, c]], tick_labels=["0", "1"], patch_artist=True,
                        medianprops=dict(color=t["a"], lw=2), flierprops=dict(markeredgecolor=t["muted"], markersize=3))
        for p, col in zip(bp["boxes"], [t["b"], t["a"]]): p.set_facecolor(col); p.set_alpha(0.45); p.set_edgecolor(t["line"])
        for k in ("whiskers", "caps"):
            for w in bp[k]: w.set_color(t["muted"])
        ax.set_title(c, fontsize=10); ax.set_xlabel("Outcome"); sty(ax, t)
    fig.tight_layout(); save(fig, "box", th)
    # 3. scatter Glucose vs BMI theo Outcome
    fig, ax = plt.subplots(figsize=(6, 3.8))
    for o, col in ((0, t["b"]), (1, t["a"])): s = d[d.Outcome == o]; ax.scatter(s.Glucose, s.BMI, s=10, color=col, alpha=0.6, label=f"Outcome {o}")
    ax.set_xlabel("Glucose"); ax.set_ylabel("BMI"); ax.legend(frameon=False, labelcolor=t["fg"], fontsize=9); sty(ax, t)
    fig.tight_layout(); save(fig, "scatter", th)
    # 4. correlation heatmap có số
    c = d.corr().round(2); cols = list(c.columns); short = [x.replace("DiabetesPedigreeFunction", "DPF").replace("BloodPressure", "BP").replace("SkinThickness", "Skin").replace("Pregnancies", "Preg") for x in cols]
    fig, ax = plt.subplots(figsize=(6.6, 5.2)); ax.imshow(c.values, cmap="coolwarm", vmin=-1, vmax=1, alpha=0.55)
    for i in range(len(cols)):
        for j in range(len(cols)): ax.text(j, i, f"{c.values[i, j]:.2f}", ha="center", va="center", fontsize=8, color=t["fg"])
    ax.set_xticks(range(len(cols))); ax.set_xticklabels(short, rotation=45, ha="right"); ax.set_yticks(range(len(cols))); ax.set_yticklabels(short)
    for s in ax.spines.values(): s.set_visible(False)
    ax.tick_params(colors=t["muted"], labelsize=9, length=0); fig.tight_layout(); save(fig, "corr", th)
    # 5. scatter matrix 4 cột
    cs = ["Glucose", "BMI", "Age", "Insulin"]; fig, axs = plt.subplots(4, 4, figsize=(7, 6.4))
    for i, a in enumerate(cs):
        for j, b in enumerate(cs):
            ax = axs[i, j]
            if i == j: ax.hist(d[a], bins=20, color=t["b"])
            else: ax.scatter(d[b], d[a], s=3, color=t["a"], alpha=0.5)
            ax.set_xticks([]); ax.set_yticks([]); sty(ax, t)
            if j == 0: ax.set_ylabel(a, fontsize=8)
            if i == 3: ax.set_xlabel(b, fontsize=8)
    fig.tight_layout(); save(fig, "matrix", th)
print(sorted(os.listdir(OUT)))
