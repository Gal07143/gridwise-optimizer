# logging.py - Event and error logging for EMS system
import logging
from pathlib import Path

LOG_DIR = Path("app/data/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "system_events.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()]
)

# Log info event
def log_info(message: str):
    logging.info(message)

# Log error event
def log_error(message: str):
    logging.error(message)

# Log warning event
def log_warning(message: str):
    logging.warning(message)

# Log debug event
def log_debug(message: str):
    logging.debug(message)
# logging.py
