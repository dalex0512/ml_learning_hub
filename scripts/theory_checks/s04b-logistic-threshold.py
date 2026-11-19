import numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_score, recall_score, roc_auc_score
d=pd.read_csv("dataset/diabetes.csv"); X=d.drop(columns="Outcome"); y=d["Outcome"]
X_dev,X_test,y_dev,y_test=train_test_split(X,y,test_size=0.2,random_state=42,stratify=y)
X_train,X_val,y_train,y_val=train_test_split(X_dev,y_dev,test_size=0.25,random_state=42,stratify=y_dev)
print(len(y_train),len(y_val),len(y_test))
model=make_pipeline(StandardScaler(),LogisticRegression(max_iter=1000)).fit(X_train,y_train)
col=np.flatnonzero(model[-1].classes_==1)[0]
p_val=model.predict_proba(X_val)[:,col]
rows=[]
for t in [0.7,0.5,0.3]:
    pr=(p_val>=t).astype(int); tn,fp,fn,tp=confusion_matrix(y_val,pr,labels=[0,1]).ravel()
    rec=recall_score(y_val,pr); rows.append((t,rec))
    print(t,tp,fp,fn,tn,round(precision_score(y_val,pr),3),round(rec,3))
el=[t for t,r in rows if r>=0.7]; print("eligible",el)
t=max(el) if el else None
p_te=model.predict_proba(X_test)[:,col]; tp_=(p_te>=t).astype(int)
print(t,confusion_matrix(y_test,tp_,labels=[0,1]).tolist(),round(precision_score(y_test,tp_),3),round(recall_score(y_test,tp_),3),round(roc_auc_score(y_test,p_te),3))
