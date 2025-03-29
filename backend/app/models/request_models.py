# request_models.py - Define request models for input validation (Pydantic)
from pydantic import BaseModel

# Request model for calculating ROI
class ROICalculationRequest(BaseModel):
    pv_kwh: float
    avoided_peak_kwh: float
    grid_rate: float
    battery_cost: float
    pv_cost: float

# Request model for OCPI session start
class OCPIStartRequest(BaseModel):
    evse_id: str
    session_id: str
    start_time: str

# Request model for OCPI session stop
class OCPIStopRequest(BaseModel):
    session_id: str
# request_models.py
