def estimate_battery_soh(cycles: int, depth_of_discharge: float, temperature: float = 25.0) -> float:
    """
    Estimate battery State of Health (SoH) based on usage and environment.
    """
    baseline_loss = 0.0002 * cycles
    dod_factor = (depth_of_discharge - 0.8) * 0.05 if depth_of_discharge > 0.8 else 0
    temp_penalty = max(0, (temperature - 30) * 0.0015)
    soh = 1.0 - baseline_loss - dod_factor - temp_penalty
    return round(max(soh, 0.0), 4)


def calculate_degradation_penalty(soh: float) -> float:
    """
    Return a degradation multiplier to penalize ROI and dispatch probability.
    """
    if soh >= 0.9:
        return 1.0
    elif soh >= 0.75:
        return 0.9
    elif soh >= 0.6:
        return 0.75
    else:
        return 0.5


def lifecycle_summary(cycles: int, dod: float, temperature: float = 25.0) -> dict:
    soh = estimate_battery_soh(cycles, dod, temperature)
    penalty = calculate_degradation_penalty(soh)
    return {
        "cycles": cycles,
        "depth_of_discharge": dod,
        "temperature": temperature,
        "state_of_health": soh,
        "degradation_penalty": penalty
    }
