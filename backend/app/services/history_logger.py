# history_logger.py - Persist optimization data for ML training
import json
from pathlib import Path
from datetime import datetime

LOG_PATH = Path("app/data/optimization_history.jsonl")
LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

def log_dispatch_result(data: dict):
    data["timestamp"] = datetime.utcnow().isoformat()
    with LOG_PATH.open("a") as f:
        f.write(json.dumps(data) + "\n")# history_logger.py
