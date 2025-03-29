# EMS FastAPI entrypoint
from app.api import devices, sites, schedule

app.include_router(devices.router)
app.include_router(sites.router)
app.include_router(schedule.router)
