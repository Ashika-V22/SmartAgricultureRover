import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("Crop_dataset.csv")

# Model 2 inputs
X = df[
    [
        "temperature",
        "humidity"
    ]
]

# Target crop
y = df["label"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(
    X_train,
    y_train
)

# Test model
predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("Model 2 Accuracy:", accuracy)

# Save new Model 2
joblib.dump(
    model,
    "crop_model_basic.pkl"
)

print("crop_model_basic.pkl saved successfully!")