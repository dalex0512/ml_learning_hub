import numpy as np, pandas as pd
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler, MinMaxScaler
x=np.array([[1],[2],[4],[7],[10]],float);t=np.array([10,20,40,70,100],float)
print(KNeighborsRegressor(3).fit(x,t).predict([[3],[20]]),70/3)
Xh=np.array([[4,4],[5,4],[4,5],[6,4],[4,6],[1,2],[7,5],[0,3]],float);d=np.linalg.norm(Xh-[4,3],axis=1);print(d.round(6))
print("K4 mean dist A",(d[0]+d[2])/2,"B",(d[1]+d[3])/2,"inv A",1/d[0]+1/d[2],"B",1/d[1]+1/d[3])
Xs=np.array([[24,11e6],[60,10e6],[20,110e6]],float);ys=np.array(["A","B","B"]);q=np.array([[25,10e6]])
sc=MinMaxScaler().fit(Xs);print(KNeighborsClassifier(1).fit(Xs,ys).predict(q),KNeighborsClassifier(1).fit(sc.transform(Xs),ys).predict(sc.transform(q)),np.linalg.norm(sc.transform(Xs)-sc.transform(q),axis=1).round(4),np.linalg.norm(Xs-q,axis=1).round(1))
Xb,yb=make_moons(n_samples=400,noise=0.3,random_state=42)
Xd,_,yd,_=train_test_split(Xb,yb,test_size=0.25,random_state=42,stratify=yb)
cv=StratifiedKFold(5,shuffle=True,random_state=42);extra=np.random.default_rng(123).normal(size=(len(Xd),100))
for a in [0,10,50,100]:
    Xa=np.c_[Xd,extra[:,:a]];print(a,Xa.shape[1],round(cross_val_score(make_pipeline(StandardScaler(),KNeighborsClassifier(5)),Xa,yd,cv=cv).mean(),6))
dd=pd.read_csv("dataset/diabetes.csv");X=dd.drop(columns="Outcome");y=dd["Outcome"]
Xdev,Xte,ydev,yte=train_test_split(X,y,test_size=0.2,random_state=42,stratify=y)
g=GridSearchCV(make_pipeline(StandardScaler(),KNeighborsClassifier()),{"kneighborsclassifier__n_neighbors":[1,5,15,25,51],"kneighborsclassifier__weights":["uniform","distance"],"kneighborsclassifier__metric":["euclidean","manhattan"]},cv=cv).fit(Xdev,ydev)
print(g.best_params_,round(g.best_score_,3),round(g.score(Xte,yte),3))
