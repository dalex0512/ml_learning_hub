import numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
d = pd.read_csv("dataset/diabetes.csv"); x = d.drop(columns="Outcome"); y = d.Outcome
xtr, xte, ytr, yte = train_test_split(x, y, test_size=0.2, random_state=42)
print("train", ytr.value_counts().to_dict(), "test", yte.value_counts().to_dict())
s = StandardScaler().fit(xtr); A = s.transform(xtr); B = s.transform(xte)
def rep(name, m, A_, y_):
    p = m.fit(A_, y_).predict(B); print(f"{name:28s} acc {accuracy_score(yte,p):.3f} prec {precision_score(yte,p):.3f} rec {recall_score(yte,p):.3f} f1 {f1_score(yte,p):.3f} predicted_pos {p.sum()}")
rep("LR gốc", LogisticRegression(), A, ytr)
rep("LR class_weight=balanced", LogisticRegression(class_weight="balanced"), A, ytr)
rng = np.random.default_rng(0)
pos = np.where(ytr.values == 1)[0]; neg = np.where(ytr.values == 0)[0]
# random oversampling
extra = rng.choice(pos, len(neg) - len(pos), replace=True)
Ao = np.vstack([A, A[extra]]); yo = np.r_[ytr.values, ytr.values[extra]]
rep("LR + random oversample", LogisticRegression(), Ao, yo)
# SMOTE tay (k=5)
nn = NearestNeighbors(n_neighbors=6).fit(A[pos]); _, idx = nn.kneighbors(A[pos])
new = []
for _ in range(len(neg) - len(pos)):
    i = rng.integers(len(pos)); j = idx[i][rng.integers(1, 6)]; lam = rng.random(); new.append(A[pos][i] + lam * (A[pos][j] - A[pos][i]))
As = np.vstack([A, np.array(new)]); ys = np.r_[ytr.values, np.ones(len(new), int)]
rep("LR + SMOTE (tay)", LogisticRegression(), As, ys)
# undersampling
keep = rng.choice(neg, len(pos), replace=False); idxu = np.r_[pos, keep]
rep("LR + undersample", LogisticRegression(), A[idxu], ytr.values[idxu])
# CÁCH SAI: oversample trước khi chia, dùng Random Forest
full = pd.concat([x, y], axis=1); mn = full[full.Outcome == 1]; mj = full[full.Outcome == 0]
bal = pd.concat([mj, mn.sample(len(mj), replace=True, random_state=0)])
xb, yb = bal.drop(columns="Outcome"), bal.Outcome
a, b, c, e = train_test_split(xb, yb, test_size=0.2, random_state=42)
p = RandomForestClassifier(random_state=42).fit(a, c).predict(b); print("SAI (oversample rồi chia) RF: acc", round(accuracy_score(e, p), 3), "rec", round(recall_score(e, p), 3))
p = RandomForestClassifier(random_state=42).fit(xtr, ytr).predict(xte); print("ĐÚNG RF trên test thật: acc", round(accuracy_score(yte, p), 3), "rec", round(recall_score(yte, p), 3))
