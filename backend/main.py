# EMS FastAPI entrypoint
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.api import devices, sites, schedule
from app.core.config import settings
from app.core.logging import setup_logging

# Initialize logging
setup_logging()

app = FastAPI(
    title="EMS API",
    version="1.0.0",
    description="Energy Management System API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add routers with version prefix
app.include_router(devices.router, prefix="/api/v1")
app.include_router(sites.router, prefix="/api/v1")
app.include_router(schedule.router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
