# modbus_a# modbus_agent.py - Interface with Modbus devices (e.g., inverters, meters)
import minimalmodbus
import serial

class ModbusAgent:
    def __init__(self, device_id, port, baudrate=9600, timeout=1):
        self.device_id = device_id
        self.instrument = minimalmodbus.Instrument(port, device_id)  # port, slave address
        self.instrument.serial.baudrate = baudrate
        self.instrument.serial.timeout = timeout

    def read_register(self, register, num_registers=1):
        try:
            return self.instrument.read_register(register, num_registers)
        except Exception as e:
            print(f"Error reading Modbus register {register}: {str(e)}")
            return None

    def write_register(self, register, value):
        try:
            self.instrument.write_register(register, value)
        except Exception as e:
            print(f"Error writing Modbus register {register}: {str(e)}")
gent.py
