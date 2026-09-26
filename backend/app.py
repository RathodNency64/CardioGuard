from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path(
    os.environ.get("CARDIOGUARD_MODEL_PATH", BASE_DIR / "model" / "cardio_model1.pkl")
)
DATASET_PATH = BASE_DIR / "model" / "cardio_train.csv"

FEATURES = [
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
REQUIRED_FIELDS = set(FEATURES)

RECORDED_METRICS = [
    {
        "name": "Logistic Regression",
        "accuracy": 0.7136428571428571,
        "precision": 0.7313710302091402,
        "recall": 0.6748141795311606,
        "f1": 0.7019552449631997,
    },
    {
        "name": "Random Forest",
        "accuracy": 0.7121428571428572,
        "precision": 0.7177679882525697,
        "recall": 0.6986849628359062,
        "f1": 0.7080979284369114,
    },
    {
        "name": "AdaBoost",
        "accuracy": 0.7245714285714285,
        "precision": 0.7621035058430717,
        "recall": 0.6525157232704403,
        "f1": 0.7030648390574464,
    },
    {
        "name": "Gradient Boosting",
        "accuracy": 0.7325714285714285,
        "precision": 0.7482442748091603,
        "recall": 0.7005431675242996,
        "f1": 0.7236084452975048,
    },
]

app = Flask(__name__)
CORS(app, origins=os.environ.get("CORS_ORIGINS", "*").split(","))

model: Any | None = None
model_load_error: str | None = None

try:
    model = joblib.load(MODEL_PATH)
except Exception as exc:  # Keep the API alive so health reports the real failure.
    model_load_error = str(exc)


def error_response(message: str, status_code: int):
    return jsonify({"error": message}), status_code


def _as_number(payload: dict[str, Any], field: str) -> float:
    value = payload.get(field)
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{field} must be a number.")
    return float(value)


def validate_prediction_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object.")

    missing = sorted(REQUIRED_FIELDS - payload.keys())
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}.")

    age = _as_number(payload, "age")
    height = _as_number(payload, "height")
    weight = _as_number(payload, "weight")
    ap_hi = _as_number(payload, "ap_hi")
    ap_lo = _as_number(payload, "ap_lo")

    if not 18 <= age <= 120:
        raise ValueError("Age must be between 18 and 120 years.")
    if height <= 0 or weight <= 0:
        raise ValueError("Height and weight must be positive.")
    if not 80 <= ap_hi <= 250:
        raise ValueError("Systolic blood pressure must be between 80 and 250.")
    if not 40 <= ap_lo <= 150:
        raise ValueError("Diastolic blood pressure must be between 40 and 150.")

    integer_fields = {
        "gender": {1, 2},
        "cholesterol": {1, 2, 3},
        "gluc": {1, 2, 3},
        "smoke": {0, 1},
        "alco": {0, 1},
        "active": {0, 1},
    }
    normalized: dict[str, Any] = {
        "age": age,
        "height": height,
        "weight": weight,
        "ap_hi": ap_hi,
        "ap_lo": ap_lo,
    }
    for field, allowed in integer_fields.items():
        value = payload.get(field)
        if isinstance(value, bool) or not isinstance(value, int) or value not in allowed:
            values = ", ".join(str(item) for item in sorted(allowed))
            raise ValueError(f"{field} must be one of: {values}.")
        normalized[field] = value
    return normalized


def _dataset_insights() -> tuple[int, float]:
    if not DATASET_PATH.exists():
        return 0, 0.0
    dataset = pd.read_csv(DATASET_PATH, sep=";", usecols=["cardio"])
    return int(len(dataset)), float(dataset["cardio"].mean())


@app.get("/api/healthz")
@app.get("/api/health")
def health():
    if model is None:
        return jsonify({"status": "error"}), 500
    return jsonify({"status": "ok"})


@app.post("/api/predict")
def predict():
    if model is None:
        return error_response("The prediction model is not available.", 500)

    try:
        payload = validate_prediction_payload(request.get_json(silent=False))
        model_input = pd.DataFrame(
            [
                [
                    payload["age"] * 365.25,
                    payload["gender"],
                    payload["height"],
                    payload["weight"],
                    payload["ap_hi"],
                    payload["ap_lo"],
                    payload["cholesterol"],
                    payload["gluc"],
                    payload["smoke"],
                    payload["alco"],
                    payload["active"],
                ]
            ],
            columns=FEATURES,
        )
        prediction = int(model.predict(model_input)[0])
        probability = float(model.predict_proba(model_input)[0][1])
        return jsonify(
            {
                "prediction": prediction,
                "prediction_label": (
                    "Elevated cardiovascular disease risk detected"
                    if prediction == 1
                    else "No cardiovascular disease detected"
                ),
                "probability": probability,
                "model_name": "Tuned Random Forest",
            }
        )
    except ValueError as exc:
        return error_response(str(exc), 400)
    except Exception:
        return error_response("The prediction could not be generated. Please try again.", 500)


@app.get("/api/model")
def model_info():
    return jsonify(
        {
            "dataset": "Cardiovascular Disease Dataset (70,000 records)",
            "target": "cardio",
            "model": "Tuned Random Forest classifier",
            "features": FEATURES,
            "prediction_type": "Binary classification",
            "approach": (
                "The notebook compared four classifiers and tuned a Random Forest "
                "with GridSearchCV before saving cardio_model1.pkl."
            ),
            "metrics": RECORDED_METRICS,
        }
    )


@app.get("/api/insights")
def insights():
    rows, positive_rate = _dataset_insights()
    return jsonify(
        {
            "available": False,
            "message": (
                "The uploaded project contains exploratory notebook outputs but no "
                "standalone chart assets. This page only shows verified dataset facts."
            ),
            "dataset_rows": rows,
            "positive_rate": positive_rate,
            "notes": [
                "The notebook removed duplicate rows and filtered unrealistic blood pressure, height, and weight values during preprocessing.",
                "The classification notebook used the 11 features shown on the prediction form.",
                "Age is stored by the source dataset in days and is converted from years before prediction.",
            ],
        }
    )


@app.errorhandler(400)
def bad_request(_error):
    return error_response("Invalid request. Please check the submitted values.", 400)


@app.errorhandler(404)
def not_found(_error):
    return error_response("The requested endpoint was not found.", 404)


@app.errorhandler(500)
def internal_error(_error):
    return error_response("An unexpected server error occurred.", 500)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "5000")),
        debug=False,
    )