# mqtt_agent.py - Realtime telemetry subscription
import asyncio
import paho.mqtt.client as mqtt

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TELEMETRY_TOPIC = "telemetry/#"

telemetry_data = {}

client = mqtt.Client()


def on_connect(client, userdata, flags, rc):
    client.subscribe(TELEMETRY_TOPIC)


def on_message(client, userdata, msg):
    telemetry_data[msg.topic] = msg.payload.decode()


client.on_connect = on_connect
client.on_message = on_message


async def run_mqtt_listener():
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()
    while True:
        await asyncio.sleep(5)
# mqtt_agent.py
