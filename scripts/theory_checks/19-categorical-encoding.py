import numpy as np
from sklearn.preprocessing import OrdinalEncoder, OneHotEncoder
sizes = [["XL"], ["L"], ["S"], ["M"], ["XS"]]
print("default", OrdinalEncoder().fit(sizes).categories_, OrdinalEncoder().fit_transform(sizes).ravel())
oe = OrdinalEncoder(categories=[["XS", "S", "M", "L", "XL"]]); print("explicit", oe.fit_transform(sizes).ravel())
colors = [["Red"], ["Green"], ["Blue"], ["Black"]]
o = OneHotEncoder().fit(colors); print(o.categories_, o.transform(colors).toarray().tolist())
print("alphabetical codes", OrdinalEncoder().fit_transform(colors).ravel())
enc = {"Red": 3, "Black": 0, "Blue": 1, "Green": 2}; print("Red-Blue", abs(enc["Red"]-enc["Blue"]), "Red-Green", abs(enc["Red"]-enc["Green"]))
print("onehot dist", np.sqrt(2))
h = lambda s: sum(map(ord, s)) % 3
print({c: h(c) for c in ["USA", "UK", "Korea", "Russia"]})
v = {"Dog": [0.27, -0.31, -0.53], "Lion": [-0.7, 0.61, 0.42], "Tiger": [-0.71, 0.6, 0.38], "Mouse": [0.31, -0.34, 0.76]}
cos = lambda a, b: float(np.dot(a, b) / np.linalg.norm(a) / np.linalg.norm(b))
for a, b in [("Lion", "Tiger"), ("Dog", "Lion"), ("Dog", "Mouse"), ("Dog", "Tiger")]: print(a, b, round(cos(v[a], v[b]), 3))
