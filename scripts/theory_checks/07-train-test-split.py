import numpy as np
rng = np.random.default_rng(0)
n_test = 154
print("80/10/10 of 768:", round(768*.8), round(768*.1), round(768*.1))
print("70/15/15 of 768:", round(768*.7), round(768*.15), round(768*.15))
# mô phỏng: model không có kỹ năng (đoán mò, đúng 50%), chọn model tốt nhất theo điểm test
for k in (1, 5, 20, 100):
    best = [max(rng.binomial(n_test, 0.5, size=k)) / n_test for _ in range(5000)]
    print(k, "models: mean best accuracy", round(float(np.mean(best)), 3), "p95", round(float(np.quantile(best, .95)), 3))
