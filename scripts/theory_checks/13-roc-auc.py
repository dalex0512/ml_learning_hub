import numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, roc_curve, average_precision_score
d = pd.read_csv("dataset/diabetes.csv"); x = d.drop(columns="Outcome"); y = d.Outcome
xtr, xte, ytr, yte = train_test_split(x, y, test_size=0.2, random_state=42)
s = StandardScaler().fit(xtr); m = LogisticRegression().fit(s.transform(xtr), ytr); p = m.predict_proba(s.transform(xte))[:, 1]
print("AUC", round(roc_auc_score(yte, p), 3), "AP", round(average_precision_score(yte, p), 3), "baseline prevalence", round(yte.mean(), 3))
fpr, tpr, th = roc_curve(yte, p); j = tpr - fpr; k = j.argmax(); print("Youden J", round(j[k], 3), "thr", round(th[k], 3), "tpr", round(tpr[k], 3), "fpr", round(fpr[k], 3))
for t in (0.3, 0.5, 0.7):
    pr = p >= t; tp = (pr & (yte == 1)).sum(); fp = (pr & (yte == 0)).sum(); print(t, "TPR", round(tp / 55, 3), "FPR", round(fp / 99, 3))
# AUC = xác suất xếp đúng cặp
pos = p[yte.values == 1]; neg = p[yte.values == 0]
print("pair prob", round(np.mean([(a > b) + 0.5 * (a == b) for a in pos for b in neg]), 3))
# email ví dụ
sc = np.array([.95, .9, .85, .8, .6, .55, .4, .3, .2, .1]); lb = np.array([1, 1, 0, 1, 1, 0, 1, 0, 0, 0]); print("email AUC", roc_auc_score(lb, sc))
