# config.py - Configuration and environment settings for the EMS system
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Example: Fetching environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
MQTT_BROKER = os.getenv("MQTT_BROKER")
OCPI_ENDPOINT = os.getenv("OCPI_ENDPOINT")
SECRET_KEY = os.getenv("SECRET_KEY")

# Default configurations
DEFAULT_TARIF_RATE = 0.45  # Example for base tariff
# config.py
