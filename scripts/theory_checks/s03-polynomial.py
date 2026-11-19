from math import comb
f=lambda x:1+2*x+x*x
print(f(1.5),f(1),f(2),f(2)-f(1))
print("cols 2 inputs deg2:",comb(4,2)-1,"10 inputs deg3:",comb(13,3)-1)
import json,glob
for p in glob.glob("components/widgets/data/*poly*"): print(p)
import numpy as np
g=lambda x:0.9*np.sin(2*np.pi*x)
N=np.array([0.12,-0.18,0.15,-0.1,0.2,-0.15,0.1,-0.2,0.18,-0.1])
tx=np.array([0,0.1,0.2,0.3,0.4,0.55,0.65,0.78,0.9,1.0]);ty=g(tx)+N
ex=np.array([0.05,0.15,0.25,0.35,0.47,0.6,0.72,0.84,0.95]);ey=g(ex)
for d in (1,2,3,4,5,6,7,8,9):
    c=np.polyfit(tx,ty,d)
    r=lambda x,y:np.sqrt(np.mean((np.polyval(c,x)-y)**2))
    print(d,round(r(tx,ty),3),round(r(ex,ey),3))
