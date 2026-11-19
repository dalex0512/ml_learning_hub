import numpy as np
pred = np.array([3.45, 3.9, 2.12, 2.9]); lab = np.array([3.75, 4.12, 2.2, 2.3])
e = pred - lab
print("err", e.round(3), "L1 sum", abs(e).sum().round(3), "MAE", abs(e).mean().round(3))
print("L2 sum", (e**2).sum().round(4), "MSE", (e**2).mean().round(4), "RMSE", np.sqrt((e**2).mean()).round(4))
print("share of 4th house in L2", ((e**2)[3] / (e**2).sum()).round(3), "in L1", (abs(e)[3] / abs(e).sum()).round(3))
for d in (0.3, 1, 3): print(d, "L1", d, "L2", d * d)
# thử lệch thêm 3 cho nhà thứ tư
e2 = e.copy(); e2[3] += 3; print("with +3:", abs(e2).sum().round(3), (e2**2).sum().round(3), ((e2**2)[3] / (e2**2).sum()).round(3))
print("R2", 1 - (e**2).sum() / ((lab - lab.mean())**2).sum(), lab.mean())
