from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class TelemetryLog(Base):
    __tablename__ = "telemetry_log"

    id = Column(String, primary_key=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    message = Column(JSON, nullable=False)  # Store the telemetry data
    source = Column(String, nullable=False)  # 'mqtt', 'http', etc.
    topic = Column(String, nullable=True)  # For MQTT messages
    severity = Column(String, default='info')  # info, warning, error, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 