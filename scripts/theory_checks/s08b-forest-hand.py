import numpy as np
from math import exp
draw=np.random.default_rng(42).integers(1,11,size=10);c=np.bincount(draw,minlength=11)[1:]
print(draw.tolist(),c.tolist(),np.arange(1,11)[c==0].tolist(),(0.9)**10,10*(1-0.9**10))
print(exp(-1),1-exp(-1))
pa=np.array([0.51,0.51,0.01]);print(pa.mean(),1-pa.mean())
print(np.unique(np.array(list("AB AAB".replace(" ",""))),return_counts=True))
v=np.array(["A","B","A","A","B","A","B"]);print(np.unique(v,return_counts=True))
