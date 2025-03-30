
# mqtt.py - MQTT service for handling device telemetry

import json
import time
import logging
from paho.mqtt import client as mqtt_client
from app.core.config import MQTT_BROKER, DATABASE_URL
from app.services.history_logger import log_info, log_error
import databases

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
database = databases.Database(DATABASE_URL)

# MQTT client setup
def connect_mqtt(client_id="ems_mqtt_client"):
    """Connect to MQTT broker and return client"""
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            log_info(f"MQTT client connected to {MQTT_BROKER}")
        else:
            log_error(f"MQTT client failed to connect, return code {rc}")

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    try:
        client.connect(MQTT_BROKER)
        return client
    except Exception as e:
        log_error(f"MQTT connection error: {str(e)}")
        return None

async def publish(client, topic, msg):
    """Publish message to MQTT topic"""
    result = client.publish(topic, json.dumps(msg))
    status = result[0]
    if status == 0:
        logger.info(f"Published to {topic}: {msg}")
    else:
        logger.error(f"Failed to publish to {topic}")
    return status

async def subscribe(client, topic, callback):
    """Subscribe to MQTT topic"""
    client.subscribe(topic)
    client.message_callback_add(topic, callback)
    log_info(f"Subscribed to {topic}")

async def handle_telemetry(client, userdata, msg):
    """Process telemetry messages and store in database"""
    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic
        
        # Insert into telemetry_log table
        query = """
        INSERT INTO telemetry_log (device_id, message, topic, severity, source)
        VALUES (:device_id, :message, :topic, :severity, :source)
        """
        
        # Connect if not connected
        if not database.is_connected:
            await database.connect()
            
        # Extract device_id from topic or payload
        device_id = None
        if 'device_id' in payload:
            device_id = payload['device_id']
        elif '/devices/' in topic:
            # Try to extract from topic pattern like "devices/{device_id}/telemetry"
            parts = topic.split('/')
            if len(parts) >= 2:
                try:
                    # This assumes UUID format in topic
                    device_id_index = parts.index('devices') + 1
                    if device_id_index < len(parts):
                        device_id = parts[device_id_index]
                except ValueError:
                    pass
                    
        values = {
            "device_id": device_id,
            "message": json.dumps(payload),
            "topic": topic,
            "severity": payload.get("severity", "info"),
            "source": "mqtt"
        }
        
        await database.execute(query, values)
        logger.info(f"Stored telemetry from {topic}")
    except Exception as e:
        log_error(f"Error handling telemetry: {str(e)}")

# Setup MQTT client for EMS
def setup_mqtt_client():
    """Setup MQTT client with default subscriptions"""
    client = connect_mqtt()
    if client:
        client.on_message = handle_telemetry
        # Subscribe to all device telemetry
        client.subscribe("devices/+/telemetry")
        client.subscribe("ems/#")
        client.loop_start()
        return client
    return None
