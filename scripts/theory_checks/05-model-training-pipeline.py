import numpy as np
x = np.array([1, 2, 3.]); y = np.array([2, 4, 6.])
def run(a, eta, steps):
    out = []
    for _ in range(steps):
        e = a * x - y; loss = (e ** 2).mean(); g = (2 / 3) * (e * x).sum()
        out.append((round(a, 4), round(loss, 4), round(g, 4)))
        a = a - eta * g
    out.append((round(a, 4), round(((a * x - y) ** 2).mean(), 4), None))
    return out
print("eta .05", run(1.0, 0.05, 6))
for eta in (0.01, 0.05, 0.1, 0.2, 0.3):
    r = run(1.0, eta, 8); print(eta, "factor", round(1 - eta * 28 / 3, 3), [t[0] for t in r])
print("sum x^2", (x**2).sum())
