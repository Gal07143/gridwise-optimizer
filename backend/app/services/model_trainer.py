# model_trainer.py - Train AI model to optimize dispatch
import pandas as pd
import joblib
from sklearn.linear_model import Ridge
from pathlib import Path

MODEL_PATH = Path("app/data/models/dispatch_model.pkl")
HISTORY_PATH = Path("app/data/optimization_history.jsonl")

def train_dispatch_model():
    if not HISTORY_PATH.exists():
        return 0.0
    
    df = pd.read_json(HISTORY_PATH, lines=True)
    if df.empty or not {'load_kw', 'pv_kw', 'tariff', 'soc', 'dispatch'}.issubset(df.columns):
        return 0.0

    X = df[['load_kw', 'pv_kw', 'tariff', 'soc']]
    y = df['dispatch']

    model = Ridge().fit(X, y)
    joblib.dump(model, MODEL_PATH)
    return model.score(X, y)
# model_trainer.py
