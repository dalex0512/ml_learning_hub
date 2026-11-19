import numpy as np, pandas as pd
from sklearn.datasets import make_circles
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
Xc,yc=make_circles(n_samples=240,factor=0.4,noise=0.12,random_state=42)
Xd,Xt,yd,yt=train_test_split(Xc,yc,test_size=0.25,random_state=42,stratify=yc)
cv=StratifiedKFold(5,shuffle=True,random_state=42)
grid=[{"svc__kernel":["linear"],"svc__C":[0.01,1,100]},{"svc__kernel":["rbf"],"svc__C":[0.01,1,100],"svc__gamma":[0.01,1,100]}]
s=GridSearchCV(make_pipeline(StandardScaler(),SVC()),grid,scoring="accuracy",cv=cv,refit=True).fit(Xd,yd)
for p,m in zip(s.cv_results_["params"],s.cv_results_["mean_test_score"]): print(p,round(m,6))
print(s.best_params_,s.best_estimator_[-1].n_support_,round(s.score(Xt,yt),6))
d=pd.read_csv("dataset/diabetes.csv");X=d.drop(columns="Outcome");y=d["Outcome"]
Xd,Xt,yd,yt=train_test_split(X,y,test_size=0.2,random_state=42,stratify=y)
g=GridSearchCV(make_pipeline(StandardScaler(),SVC()),{"svc__C":[0.1,1,10],"svc__gamma":[0.001,0.01,0.1]},cv=cv).fit(Xd,yd)
print(g.best_params_,round(g.best_score_,3),round(g.score(Xt,yt),3))
for p,m in zip(g.cv_results_["params"],g.cv_results_["mean_test_score"]): print(p,round(m,3))
