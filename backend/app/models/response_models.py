# response_models.py - Define response models for API responses
from pydantic import BaseModel

# Response model for ROI calculation
class ROICalculationResponse(BaseModel):
    roi_percentage: float
    cost_saved: float
    investment: float

# Response model for OCPI session start
class OCPIStartResponse(BaseModel):
    session_id: str
    status: str
    start_time: str

# Response model for OCPI session stop
class OCPIStopResponse(BaseModel):
    session_id: str
    status: str
    end_time: str# response_models.py
