import numpy as np
P=np.array([[2,3],[3,5],[5,3],[8,6]],float)
D=np.linalg.norm(P[:,None]-P[None],axis=2).round(3);print(D)
print("p1",P[0]+0.4*(P[2]-P[0]),"p2",P[3]+0.5*(P[2]-P[3]))
r=np.array([1,0,2,5])/5;rh=r/r.sum();print(r.sum(),rh,rh*8)
print(np.mean([[1,1],[2,1],[1,2]],axis=0).round(3),np.mean([[8,8],[9,8],[8,9]],axis=0).round(3))
n,n0,n1=614,400,214;w0=n/(2*n0);w1=n/(2*n1);print(w0,round(w1,4),round(w1/w0,3),n0*w0,round(n1*w1,1))
