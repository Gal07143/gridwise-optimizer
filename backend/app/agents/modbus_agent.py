# modbus_agent.py
import minimalmodbus
import time

class ModbusAgent:
    def __init__(self, port: str, slave_address: int):
        self.instrument = minimalmodbus.Instrument(port, slave_address)
        self.instrument.serial.baudrate = 9600
        self.instrument.serial.timeout = 1

    def read_register(self, register: int, decimal_places: int = 0) -> float:
        try:
            value = self.instrument.read_register(register, decimal_places)
            return value
        except Exception as e:
            print(f"Error reading register {register}: {e}")
            return None

    def write_register(self, register: int, value: float, decimal_places: int = 0) -> bool:
        try:
            self.instrument.write_register(register, value, decimal_places)
            return True
        except Exception as e:
            print(f"Error writing to register {register}: {e}")
            return False

if __name__ == '__main__':
    agent = ModbusAgent('/dev/ttyUSB0', 1)
    print("Voltage:", agent.read_register(0))
    print("Writing control signal:", agent.write_register(10, 1))
