# anomaly_detection.py - Anomaly detection engine for EMS
import numpy as np
from sklearn.ensemble import IsolationForest
from app.services.history_logger import log_dispatch_result

# Example of anomaly detection using IsolationForest
class AnomalyDetector:
    def __init__(self, n_estimators=100, contamination=0.1):
        self.model = IsolationForest(n_estimators=n_estimators, contamination=contamination)

    def fit(self, data):
        X = np.array([d['value'] for d in data]).reshape(-1, 1)
        self.model.fit(X)

    def predict(self, data):
        X = np.array([d['value'] for d in data]).reshape(-1, 1)
        return self.model.predict(X)  # 1: anomaly, -1: normal

anomaly_detector = AnomalyDetector()

# Example: Detect anomalies based on deviation from expected behavior
def detect_anomaly(actual_value, expected_value):
    deviation = abs(actual_value - expected_value)
    threshold = 0.2 * expected_value  # 20% deviation considered an anomaly
    return deviation > threshold

# Batch processing anomaly detection
def detect_batch_anomalies(readings):
    anomalies = []
    for reading in readings:
        if detect_anomaly(reading['actual'], reading['expected']):
            anomalies.append(reading)
    return anomalies

# Log detected anomalies
def log_anomalies(anomalies):
    for anomaly in anomalies:
        log_dispatch_result(anomaly)
# anomaly_detection.py
