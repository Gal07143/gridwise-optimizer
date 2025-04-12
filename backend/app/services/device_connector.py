from typing import Dict, Any, Optional
import asyncio
import aiohttp
import paho.mqtt.client as mqtt
import json
from datetime import datetime
from .supabase_service import supabase_service

class DeviceConnector:
    def __init__(self):
        self.mqtt_client = None
        self.http_session = None
        self.devices: Dict[str, Dict[str, Any]] = {}
        self._setup_mqtt()
        self._setup_http()

    def _setup_mqtt(self):
        """Initialize MQTT client with connection handlers"""
        self.mqtt_client = mqtt.Client()
        self.mqtt_client.on_connect = self._on_mqtt_connect
        self.mqtt_client.on_message = self._on_mqtt_message
        self.mqtt_client.on_disconnect = self._on_mqtt_disconnect

    def _setup_http(self):
        """Initialize HTTP session"""
        self.http_session = aiohttp.ClientSession()

    async def connect_mqtt(self, broker_url: str, username: Optional[str] = None, password: Optional[str] = None):
        """Connect to MQTT broker"""
        if username and password:
            self.mqtt_client.username_pw_set(username, password)
        
        try:
            self.mqtt_client.connect(broker_url)
            self.mqtt_client.loop_start()
            return True
        except Exception as e:
            print(f"MQTT connection error: {e}")
            return False

    def _on_mqtt_connect(self, client, userdata, flags, rc):
        """Handle MQTT connection"""
        print(f"Connected to MQTT broker with result code {rc}")
        # Subscribe to device topics
        client.subscribe("devices/+/telemetry")
        client.subscribe("devices/+/control")

    def _on_mqtt_message(self, client, userdata, msg):
        """Handle incoming MQTT messages"""
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode())
            
            # Extract device ID from topic
            device_id = topic.split('/')[1]
            
            # Process telemetry data
            if 'telemetry' in topic:
                asyncio.create_task(self._process_telemetry(device_id, payload))
            elif 'control' in topic:
                asyncio.create_task(self._process_control(device_id, payload))
                
        except Exception as e:
            print(f"Error processing MQTT message: {e}")

    def _on_mqtt_disconnect(self, client, userdata, rc):
        """Handle MQTT disconnection"""
        print(f"Disconnected from MQTT broker with result code {rc}")
        if rc != 0:
            print("Unexpected disconnection. Attempting to reconnect...")
            client.reconnect()

    async def _process_telemetry(self, device_id: str, data: Dict[str, Any]):
        """Process and store telemetry data"""
        try:
            # Store telemetry in Supabase
            await supabase_service.create_telemetry(device_id, data, source='mqtt')
            
            # Update device status
            await supabase_service.update_device_status(device_id, 'online')
            
        except Exception as e:
            print(f"Error processing telemetry: {e}")

    async def _process_control(self, device_id: str, data: Dict[str, Any]):
        """Process control commands"""
        try:
            # Implement control logic here
            pass
        except Exception as e:
            print(f"Error processing control command: {e}")

    async def send_http_command(self, device_id: str, endpoint: str, method: str = 'GET', data: Optional[Dict] = None):
        """Send HTTP command to device"""
        try:
            device = await supabase_service.get_device(device_id)
            if not device or not device.get('http_endpoint'):
                raise ValueError(f"Device {device_id} not found or HTTP endpoint not configured")

            url = f"{device['http_endpoint']}/{endpoint}"
            async with self.http_session.request(method, url, json=data) as response:
                return await response.json()
        except Exception as e:
            print(f"Error sending HTTP command: {e}")
            return None

    async def publish_mqtt_message(self, topic: str, payload: Dict[str, Any]):
        """Publish message to MQTT topic"""
        try:
            self.mqtt_client.publish(topic, json.dumps(payload))
            return True
        except Exception as e:
            print(f"Error publishing MQTT message: {e}")
            return False

    async def close(self):
        """Cleanup connections"""
        if self.mqtt_client:
            self.mqtt_client.loop_stop()
            self.mqtt_client.disconnect()
        if self.http_session:
            await self.http_session.close()

# Create a singleton instance
device_connector = DeviceConnector() 