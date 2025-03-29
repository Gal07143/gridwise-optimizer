# ai_advisor.py - Predict battery dispatch using ML
import joblib
import os
import numpy as np
from pathlib import Path

MODEL_PATH = Path("app/data/models/dispatch_model.pkl")

def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return None

def ai_recommend_dispatch(input_features: dict):
    model = load_model()
    if not model:
        return {"error": "model not trained"}

    X = np.array([[
        input_features.get("load", 0),
        input_features.get("pv", 0),
        input_features.get("tariff", 0),
        input_features.get("soc", 50)
    ]])

    prediction = model.predict(X)[0]  # e.g., -1=charge, 0=idle, 1=discharge
    return {"dispatch_decision": prediction}# ai_advisor.py
