# control.py - Execute EMS dispatch actions (Modbus, MQTT, etc)
import json
from app.services.mqtt import publish_control_message

MODBUS_REGISTERS = {
    "charge": 100,
    "discharge": 101,
    "idle": 102
}

async def dispatch_command(decision: int, device_id: str):
    if decision == -1:
        action = "charge"
    elif decision == 1:
        action = "discharge"
    else:
        action = "idle"

    payload = {
        "device_id": device_id,
        "action": action
    }

    # Option 1: MQTT command
    await publish_control_message(device_id, json.dumps(payload))

    # Option 2: Modbus (future)
    # write_modbus_register(device_id, MODBUS_REGISTERS[action])
# control.py
