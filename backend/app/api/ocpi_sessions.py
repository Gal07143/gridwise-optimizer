# ocpi_sessions.py - OCPI session hooks and EMS interaction
from fastapi import APIRouter, HTTPException
from app.services.ocpi import handle_ocpi_session_start, handle_ocpi_session_stop
from app.models.request_models import OCPIStartRequest, OCPIStopRequest

router = APIRouter()

@router.post("/start")
def start_session(req: OCPIStartRequest):
    success = handle_ocpi_session_start(req)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to start OCPI session")
    return {"status": "started"}

@router.post("/stop")
def stop_session(req: OCPIStopRequest):
    success = handle_ocpi_session_stop(req.session_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to stop OCPI session")
    return {"status": "stopped"}# ocpi_sessions.py
