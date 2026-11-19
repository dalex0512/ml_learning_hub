import numpy as np
from math import comb
print("P(fold of 25 has no Dog)", comb(90,25)/comb(100,25))
print("P(fold of 20 has no Dog)", comb(90,20)/comb(100,20))
rng = np.random.default_rng(0)
lab = np.array([1]*10 + [0]*90)
for K in (4, 5):
    bad = 0; mn = []
    for _ in range(100000):
        p = rng.permutation(100); folds = np.array_split(lab[p], K)
        c = [int(f.sum()) for f in folds]; bad += min(c) == 0; mn.append(min(c))
    print("K", K, "P(some fold has 0 Dog)", bad/100000, "mean min dogs", np.mean(mn))
print("stratified K=4:", [22,22,23,23], [3,3,2,2], sum([22,22,23,23]), sum([3,3,2,2]))
print("stratified K=5: 18 Cat + 2 Dog each")
