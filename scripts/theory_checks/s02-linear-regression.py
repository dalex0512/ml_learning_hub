import numpy as np, pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
x=np.array([1,2,3,4,5,6.]); y=np.array([1.5,2.4,2.8,4.5,4.9,6.3])
m=((x-x.mean())*(y-y.mean())).sum()/((x-x.mean())**2).sum(); b=y.mean()-m*x.mean()
print("m,b",round(m,3),round(b,3),"SSE",round(((y-(m*x+b))**2).sum(),3))
x2=np.array([1,2,3,4,5.]);y2=np.array([2,4,5,4,5.])
print("5pt", ((x2-3)*(y2-4)).sum(), ((x2-3)**2).sum())
d=pd.read_csv("dataset/diabetes.csv"); d=d[(d.BloodPressure>0)&(d.BMI>0)]
print(len(d))
X=d[["Age","BMI"]]; t=d["BloodPressure"]
Xtr,Xte,ytr,yte=train_test_split(X,t,test_size=0.25,random_state=42)
for cols in (["Age"],["BMI"],["Age","BMI"]):
    lr=LinearRegression().fit(Xtr[cols],ytr); p=lr.predict(Xte[cols])
    print(cols,lr.coef_.round(3),round(lr.intercept_,2),"R2",round(r2_score(yte,p),3),"MAE",round(mean_absolute_error(yte,p),2),"RMSE",round(mean_squared_error(yte,p)**.5,2))
print("baseline MAE",round(mean_absolute_error(yte,np.full(len(yte),ytr.mean())),2),"RMSE",round(mean_squared_error(yte,np.full(len(yte),ytr.mean()))**.5,2))
