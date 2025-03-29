# websocket.py - Real-time WebSocket alert + telemetry bridge
from fastapi import WebSocket, APIRouter, WebSocketDisconnect

router = APIRouter()
clients = set()

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    try:
        while True:
            await ws.receive_text()  # Keep connection alive (or use ping)
    except WebSocketDisconnect:
        clients.remove(ws)

# Broadcast helper
async def broadcast_alert(message: dict):
    for client in list(clients):
        try:
            await client.send_json(message)
        except:
            clients.remove(client)# websocket.py
