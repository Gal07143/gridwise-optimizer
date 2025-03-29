# startup.py - Initialize application and connect to services
from fastapi import FastAPI
from app.core.config import DATABASE_URL, MQTT_BROKER
from app.services.history_logger import log_info
import databases
import paho.mqtt.client as mqtt

# Initialize FastAPI app
app = FastAPI()

# Database setup
DATABASE = databases.Database(DATABASE_URL)

# MQTT client setup
mqtt_client = mqtt.Client()
mqtt_client.connect(MQTT_BROKER)

@app.on_event("startup")
async def startup_event():
    # Connect to the database and MQTT broker on startup
    await DATABASE.connect()
    mqtt_client.loop_start()
    log_info("Application started and connected to database and MQTT broker.")

@app.on_event("shutdown")
async def shutdown_event():
    # Clean up resources during shutdown
    await DATABASE.disconnect()
    mqtt_client.loop_stop()
    log_info("Application shutdown and disconnected from database and MQTT broker.")
# startup.py
