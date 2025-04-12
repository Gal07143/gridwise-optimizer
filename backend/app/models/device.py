from sqlalchemy import Column, String, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    protocol = Column(String, nullable=False)  # 'mqtt', 'http', 'https', etc.
    mqtt_topic = Column(String, nullable=True)
    http_endpoint = Column(String, nullable=True)
    credentials = Column(JSON, nullable=True)  # Store protocol-specific credentials
    status = Column(String, default='offline')
    last_seen = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    metadata = Column(JSON, nullable=True)  # Additional device-specific metadata 