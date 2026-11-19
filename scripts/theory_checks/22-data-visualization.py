import pandas as pd
d = pd.read_csv("dataset/diabetes.csv")
for c in ["Glucose", "Insulin", "BMI", "Age"]:
    q1, q3 = d[c].quantile([.25, .75]); i = q3 - q1; lo, hi = q1 - 1.5 * i, q3 + 1.5 * i
    print(c, "Q1", q1, "Q3", q3, "IQR", i, "fences", round(lo, 2), round(hi, 2), "below", int((d[c] < lo).sum()), "above", int((d[c] > hi).sum()))
print(d.groupby("Outcome")[["Glucose", "Insulin", "BMI", "Age"]].median().to_dict())
print(d.corr()["Outcome"].round(2).to_dict())
print(d[["Glucose", "BMI"]].corr().iloc[0, 1].round(3), d[["Pregnancies", "Age"]].corr().iloc[0, 1].round(3))
