import numpy as np, pandas as pd
from math import comb
print("5 trees 0.7:",round(sum(comb(5,k)*.7**k*.3**(5-k) for k in (3,4,5)),3),[round(comb(5,3)*.7**3*.3**2,3),round(comb(5,4)*.7**4*.3,3),round(.7**5,3)])
print("(1-1/n)^n:",[round((1-1/n)**n,3) for n in (10,100,1000)],"1/e",round(1/np.e,3))
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
d=pd.read_csv("dataset/diabetes.csv"); x=d.drop(columns="Outcome"); y=d["Outcome"]
cv=StratifiedKFold(5,shuffle=True,random_state=42)
print("tree",round(cross_val_score(DecisionTreeClassifier(random_state=0),x,y,cv=cv).mean(),3))
print("n_trees cv")
for n in (1,5,25,100,300):
    s=cross_val_score(RandomForestClassifier(n_estimators=n,random_state=0),x,y,cv=cv); print(n,round(s.mean(),3),round(s.std(),3))
xtr,xte,ytr,yte=train_test_split(x,y,test_size=0.2,random_state=42)
f=RandomForestClassifier(n_estimators=300,oob_score=True,random_state=0).fit(xtr,ytr)
print("oob",round(f.oob_score_,3),"test",round(f.score(xte,yte),3),"train",round(f.score(xtr,ytr),3))
t=DecisionTreeClassifier(random_state=0).fit(xtr,ytr); print("tree train/test",round(t.score(xtr,ytr),3),round(t.score(xte,yte),3))
print(pd.Series(f.feature_importances_,index=x.columns).sort_values(ascending=False).round(3).to_dict())
# correlation of single-tree errors vs forest: fraction of single trees (in forest) correct on test, vs forest
acc=[e.score(xte.values,yte) for e in f.estimators_]
print("single-tree-in-forest test acc mean",round(np.mean(acc),3),"min",round(min(acc),3),"max",round(max(acc),3))
