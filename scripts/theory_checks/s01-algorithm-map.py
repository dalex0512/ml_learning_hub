import pandas as pd, numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
d=pd.read_csv("dataset/diabetes.csv"); X=d.drop(columns="Outcome"); y=d["Outcome"]
cv=StratifiedKFold(5,shuffle=True,random_state=42)
ms={"Dummy":DummyClassifier(strategy="most_frequent"),
"Logistic":make_pipeline(StandardScaler(),LogisticRegression(max_iter=1000)),
"KNN":make_pipeline(StandardScaler(),KNeighborsClassifier()),
"SVM":make_pipeline(StandardScaler(),SVC()),
"Tree":DecisionTreeClassifier(random_state=42),
"Forest":RandomForestClassifier(random_state=42)}
print(y.value_counts(normalize=True).round(3).to_dict())
for k,m in ms.items():
    s=cross_val_score(m,X,y,cv=cv); print(k,round(s.mean(),3),round(s.std(),3))
