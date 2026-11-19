import numpy as np, pandas as pd
def gini(*c):
    n=sum(c); return 1-sum((k/n)**2 for k in c)
def w(groups):
    N=sum(sum(g) for g in groups); return sum(sum(g)/N*gini(*g) for g in groups)
print("Age",[round(gini(*g),3) for g in [(2,3),(4,0),(3,2)]],round(w([(2,3),(4,0),(3,2)]),3))
print("Income",round(w([(2,2),(4,2),(3,1)]),3),"Student",round(w([(6,1),(3,4)]),3),"Credit",round(w([(6,2),(3,3)]),3))
print("root gini",round(gini(9,5),3))
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text
d=pd.read_csv("dataset/diabetes.csv"); x=d.drop(columns="Outcome"); y=d["Outcome"]
cv=StratifiedKFold(5,shuffle=True,random_state=42)
xtr,xte,ytr,yte=train_test_split(x,y,test_size=0.2,random_state=42)
print("depth train test cv leaves")
for dp in (1,2,3,4,5,8,None):
    t=DecisionTreeClassifier(max_depth=dp,random_state=0).fit(xtr,ytr)
    print(dp,round(t.score(xtr,ytr),3),round(t.score(xte,yte),3),round(cross_val_score(DecisionTreeClassifier(max_depth=dp,random_state=0),x,y,cv=cv).mean(),3),t.get_n_leaves(),t.get_depth())
t=DecisionTreeClassifier(max_depth=2,random_state=0).fit(xtr,ytr)
print(export_text(t,feature_names=list(x.columns)))
print("root gini",round(1-(ytr.mean())**2-(1-ytr.mean())**2,3))
# scale invariance
from sklearn.preprocessing import StandardScaler
a=DecisionTreeClassifier(random_state=0).fit(xtr,ytr).predict(xte)
sc=StandardScaler().fit(xtr); b=DecisionTreeClassifier(random_state=0).fit(sc.transform(xtr),ytr).predict(sc.transform(xte))
print("same predictions after scaling:",(a==b).all())
