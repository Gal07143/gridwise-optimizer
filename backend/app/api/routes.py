# routes.py
# routes.py - Central API registration for EMS
from fastapi import APIRouter
from app.api import (
    devices, sites, schedule, alerts, forecast, optimize, train, roi, ocpi_sessions
)

router = APIRouter()

router.include_router(devices.router, prefix="/api/devices")
router.include_router(sites.router, prefix="/api/sites")
router.include_router(schedule.router, prefix="/api/schedule")
router.include_router(alerts.router, prefix="/api/alerts")
router.include_router(forecast.router, prefix="/api/forecast")
router.include_router(optimize.router, prefix="/api/optimize")
router.include_router(train.router, prefix="/api/train")
router.include_router(roi.router, prefix="/api/roi")
router.include_router(ocpi_sessions.router, prefix="/api/ocpi")
