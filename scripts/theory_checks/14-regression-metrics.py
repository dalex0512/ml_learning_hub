import numpy as np
pred = np.array([3.45, 3.9, 2.12, 2.9]); lab = np.array([3.75, 4.12, 2.2, 2.3]); e = pred - lab
mae = abs(e).mean(); rmse = np.sqrt((e**2).mean()); sst = ((lab - lab.mean())**2).sum()
print("MAE", mae.round(4), "MSE", (e**2).mean().round(4), "RMSE", rmse.round(4), "R2", (1 - (e**2).sum()/sst).round(4), "SST", sst.round(4), "mean", lab.mean())
print("baseline MAE (đoán trung bình)", abs(lab - lab.mean()).mean().round(4), "baseline RMSE", np.sqrt(((lab - lab.mean())**2).mean()).round(4))
print("MAPE", (abs(e)/abs(lab)).mean().round(4))
e2 = e.copy(); e2[3] += 3
print("Hue +3: MAE", abs(e2).mean().round(4), "RMSE", np.sqrt((e2**2).mean()).round(4), "R2", (1 - (e2**2).sum()/sst).round(4), "ratio", (abs(e2).mean()/mae).round(2), (np.sqrt((e2**2).mean())/rmse).round(2))
print("RMSE >= MAE", rmse >= mae)
