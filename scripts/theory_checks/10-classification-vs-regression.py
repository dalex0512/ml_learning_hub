import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score
d = pd.read_csv("dataset/diabetes.csv")
# bài 1 (phân loại): đoán Outcome
x = d.drop(columns="Outcome"); y = d.Outcome
xtr, xte, ytr, yte = train_test_split(x, y, test_size=0.2, random_state=42)
s = StandardScaler().fit(xtr); m = LogisticRegression().fit(s.transform(xtr), ytr)
print("classification accuracy", round(accuracy_score(yte, m.predict(s.transform(xte))), 4), "baseline", round((yte == 0).mean(), 4))
# bài 2 (hồi quy): đoán Glucose (chỉ dùng các hàng Glucose > 0)
g = d[d.Glucose > 0]
x2 = g.drop(columns=["Glucose"]); y2 = g.Glucose
a, b, c, e = train_test_split(x2, y2, test_size=0.2, random_state=42)
s2 = StandardScaler().fit(a); r = LinearRegression().fit(s2.transform(a), c); p = r.predict(s2.transform(b))
print("regression MAE", round(mean_absolute_error(e, p), 2), "R2", round(r2_score(e, p), 3), "baseline MAE (đoán trung bình)", round(mean_absolute_error(e, [c.mean()] * len(e)), 2))
