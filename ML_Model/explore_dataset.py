import pandas as pd

data = pd.read_csv("crop_dataset.csv")

print("Dataset Shape:")
print(data.shape)

print("\nColumns:")
print(data.columns)

print("\nFirst 5 rows:")
print(data.head())

print("\nMissing Values:")
print(data.isnull().sum())