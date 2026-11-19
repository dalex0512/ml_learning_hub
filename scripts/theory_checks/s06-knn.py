import numpy as np, pandas as pd
from math import hypot
P=[(4,5,0),(6,4,1),(4,1.5,1),(0.5,4,0),(8,4,1)]
for p in P: print(p, round(hypot(p[0]-4,p[1]-4),2))
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
d=pd.read_csv("dataset/diabetes.csv"); x=d.drop(columns="Outcome"); y=d["Outcome"]
cv=StratifiedKFold(5,shuffle=True,random_state=42)
xtr,xte,ytr,yte=train_test_split(x,y,test_size=0.2,random_state=42,stratify=y)
print("K  train  cv(scaled)  cv(unscaled)")
for k in (1,3,5,9,15,25,51):
    ms=make_pipeline(StandardScaler(),KNeighborsClassifier(k)); mu=KNeighborsClassifier(k)
    f=ms.fit(xtr,ytr)
    print(k,round(f.score(xtr,ytr),3),round(cross_val_score(ms,x,y,cv=cv).mean(),3),round(cross_val_score(mu,x,y,cv=cv).mean(),3))
print(x.describe().loc[["min","max"]].round(1).T)
