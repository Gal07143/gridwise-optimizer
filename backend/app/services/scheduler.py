import asyncio
from datetime import datetime
from app.services.model_trainer import train_model


async def auto_retrain():
    while True:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            print(f"[Scheduler] Triggering auto-retrain at {now}")
            result = train_model()
            print(f"[Scheduler] Retrain completed: {result}")
        except Exception as e:
            print(f"[Scheduler] Retrain failed: {str(e)}")

        await asyncio.sleep(6 * 3600)  # wait 6 hours


def start_scheduler():
    loop = asyncio.get_event_loop()
    loop.create_task(auto_retrain())
