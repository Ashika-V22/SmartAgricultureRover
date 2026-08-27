import pandas as pd
import joblib
import matplotlib.pyplot as plt


data = pd.read_csv("crop_dataset.csv")


X = data.drop("label", axis=1)


model = joblib.load("crop_model.pkl")


importance = model.feature_importances_


features = X.columns


plt.figure(figsize=(8,5))

plt.bar(
    features,
    importance
)

plt.xlabel("Features")
plt.ylabel("Importance")
plt.title("Crop Prediction Feature Importance")

plt.xticks(rotation=45)

plt.tight_layout()

plt.show()