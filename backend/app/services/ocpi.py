# ocpi.py - Handles OCPI integration for EV sessions and partners
from fastapi import HTTPException
from app.services.ocpi_adapter import start_ocpi_session, stop_ocpi_session
from app.models.request_models import OCPIStartRequest, OCPIStopRequest

async def handle_ocpi_session_start(request: OCPIStartRequest):
    try:
        return await start_ocpi_session(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

async def handle_ocpi_session_stop(session_id: str):
    try:
        return await stop_ocpi_session(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
# ocpi.py
