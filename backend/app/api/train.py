# train.py
# train.py - ML model training API for energy optimization
from fastapi import APIRouter
from app.services.model_trainer import train_dispatch_model

router = APIRouter()

@router.post("/")
def trigger_training():
    score = train_dispatch_model()
    return {"message": "Training complete", "model_accuracy_r2": score}
