import pandas as pd
d = pd.read_csv("dataset/diabetes.csv")
print(d.dtypes.value_counts().to_dict(), d.shape)
print(d.dtypes.to_dict())
