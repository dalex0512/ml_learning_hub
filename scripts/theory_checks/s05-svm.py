import numpy as np, pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
# 1D kernel idea
xa=np.array([-1,0,1]); xb=np.array([-3,3]); print("z=x^2:",xa**2,xb**2)
print("w=(3,4)",np.hypot(3,4),2/5,(3*3-5)/5)
d=pd.read_csv("dataset/diabetes.csv"); x=d.drop(columns="Outcome"); y=d["Outcome"]
cv=StratifiedKFold(5,shuffle=True,random_state=42)
xtr,xte,ytr,yte=train_test_split(x,y,test_size=0.2,random_state=42,stratify=y)
print("linear vs rbf, scaled, CV acc")
for k in ("linear","rbf","poly"):
    m=make_pipeline(StandardScaler(),SVC(kernel=k)); print(k,round(cross_val_score(m,x,y,cv=cv).mean(),3))
print("no scale rbf",round(cross_val_score(SVC(),x,y,cv=cv).mean(),3))
print("C grid (rbf gamma=scale)")
for C in (0.01,0.1,1,10,100):
    m=make_pipeline(StandardScaler(),SVC(C=C)); cvm=cross_val_score(m,x,y,cv=cv).mean()
    f=m.fit(xtr,ytr); print(C,"train",round(f.score(xtr,ytr),3),"cv",round(cvm,3),"nSV",f[-1].n_support_.sum(),"of",len(xtr))
print("gamma grid (C=1)")
for g in (0.001,0.01,0.1,1,10):
    m=make_pipeline(StandardScaler(),SVC(gamma=g)); cvm=cross_val_score(m,x,y,cv=cv).mean()
    f=m.fit(xtr,ytr); print(g,"train",round(f.score(xtr,ytr),3),"cv",round(cvm,3))
