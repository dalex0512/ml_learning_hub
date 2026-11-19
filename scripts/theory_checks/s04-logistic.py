import numpy as np, pandas as pd
from math import exp, log
s=lambda z:1/(1+exp(-z))
for x in (5,7,3):
    z=1.2*x-6; print(x,round(z,1),round(s(z),3))
print("logloss y=1:",round(-log(s(2.4)),3),round(-log(s(-2.4)),3))
print("odds p=0.8:",0.8/0.2,"logit 0.8:",round(log(4),3))
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score
d=pd.read_csv("dataset/diabetes.csv"); x=d.drop(columns="Outcome"); y=d["Outcome"]
xtr,xte,ytr,yte=train_test_split(x,y,test_size=0.2,random_state=42)
sc=StandardScaler().fit(xtr); m=LogisticRegression(max_iter=1000).fit(sc.transform(xtr),ytr)
print(dict(zip(x.columns,m.coef_[0].round(3))),m.intercept_.round(3))
p=m.predict_proba(sc.transform(xte))[:,1]
print("first z",round(m.decision_function(sc.transform(xte))[0],3),"p",round(p[0],3))
print("floor",round((yte==0).mean(),3))
for t in (0.5,0.3,0.7):
    yp=(p>=t).astype(int)
    print(t,"acc",round(accuracy_score(yte,yp),3),"prec",round(precision_score(yte,yp),3),"rec",round(recall_score(yte,yp),3),"n_pos",yp.sum())
# one feature: Glucose only (probability curve)
m1=LogisticRegression(max_iter=1000).fit(xtr[["Glucose"]],ytr)
for g in (80,120,160): print("glucose",g,round(m1.predict_proba(pd.DataFrame({"Glucose":[g]}))[0,1],3))
print("glucose w,b",m1.coef_[0].round(4),m1.intercept_.round(3))
