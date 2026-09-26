from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, train_test_split


BASE_DIR = Path(__file__).resolve().parent
dataset = pd.read_csv(BASE_DIR / "model" / "cardio_train.csv", sep=";")

features = [
    "age",
    "gender",
    "height",
    "weight",
    "ap_hi",
    "ap_lo",
    "cholesterol",
    "gluc",
    "smoke",
    "alco",
    "active",
]
X = dataset[features]
y = dataset["cardio"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

parameters = {
    "n_estimators": [50, 100, 150],
    "max_depth": [None, 10, 20],
    "min_samples_split": [2, 5],
}
grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    parameters,
    cv=5,
    scoring="accuracy",
)
grid_search.fit(X_train, y_train)

output_path = BASE_DIR / "model" / "cardio_model1.pkl"
joblib.dump(grid_search.best_estimator_, output_path)
print(f"Saved {output_path}")
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.6f}")