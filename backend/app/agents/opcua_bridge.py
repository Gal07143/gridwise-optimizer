# opcua_bridge.py - Interface with OPC UA servers for industrial data
from opcua import Client
from app.services.history_logger import log_dispatch_result

class OPCUABridge:
    def __init__(self, endpoint_url):
        self.client = Client(endpoint_url)
        self.client.connect()

    def read_data(self, node_id):
        try:
            node = self.client.get_node(node_id)
            return node.get_value()
        except Exception as e:
            print(f"Error reading OPC UA node {node_id}: {str(e)}")
            return None

    def write_data(self, node_id, value):
        try:
            node = self.client.get_node(node_id)
            node.set_value(value)
        except Exception as e:
            print(f"Error writing OPC UA node {node_id}: {str(e)}")

    def disconnect(self):
        self.client.disconnect()
# opcua_bridge.py
