import numpy as np
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
def gini(c): p=np.asarray(c,float)/np.sum(c); return 1-np.sum(p**2)
def ent(c): p=np.asarray(c,float)/np.sum(c); p=p[p>0]; return -np.sum(p*np.log2(p))
print("H parent",round(ent([9,5]),6),"H youth",round(ent([2,3]),6),"split",round(10/14*ent([2,3]),6),"gain",round(ent([9,5])-10/14*ent([2,3]),6))
x=np.array([1,2,3,4,5,6.]);lab=np.array([0,0,0,1,1,1])
for t in [1.5,2.5,3.5,4.5,5.5]:
    l=lab[x<=t];r=lab[x>t];c=lambda a:[int((a==0).sum()),int((a==1).sum())]
    print(t,c(l),c(r),round(len(l)/6*gini(c(l))+len(r)/6*gini(c(r)),4))
xr=np.array([1,2,3,4,5,6.]).reshape(-1,1);tr=np.array([2,2,4,8,8,10.])
m=DecisionTreeRegressor(max_depth=1).fit(xr,tr);print(m.tree_.threshold[0],m.predict([[2],[5],[20]]))
p=m.predict(xr);print(((tr-p)**2).sum(),((tr-p)**2).mean())
