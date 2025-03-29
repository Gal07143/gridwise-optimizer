import requests

OCPI_PARTNER_ENDPOINT = "https://ocpi.partner.com/remote_commands"
OCPI_AUTH_TOKEN = "secret-token"


def notify_ocpi_partner(session_id: str, device_id: str, action: str) -> dict:
    headers = {
        "Authorization": f"Token {OCPI_AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "session_id": session_id,
        "device_id": device_id,
        "command": action
    }
    try:
        response = requests.post(OCPI_PARTNER_ENDPOINT, json=payload, headers=headers)
        return {
            "status": response.status_code,
            "message": response.text
        }
    except Exception as e:
        return {
            "status": 500,
            "error": str(e)
        }
