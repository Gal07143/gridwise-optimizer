# optimization.py - EMS decision engine
from app.services.ai_advisor import ai_recommend_dispatch
from app.services.battery_manager import battery_state
from app.services.tariff_engine import get_tariff_rate

def optimize_dispatch(request):
    soc = request.soc
    pv = request.pv_kw
    load = request.load_kw

    # Simple rule-based fallback
    net = pv - load
    tariff = get_tariff_rate()

    if soc < 20:
        dispatch = -1  # charge
    elif soc > 90:
        dispatch = 1   # discharge
    else:
        dispatch = 0

    # AI override if model exists
    ai = ai_recommend_dispatch({"load": load, "pv": pv, "tariff": tariff, "soc": soc})

    return {
        "dispatch": dispatch,
        "ai_advisory": ai.get("dispatch_decision"),
        "battery_health": battery_state.estimate_health(),
        "tariff": tariff,
        "net": net
    }
