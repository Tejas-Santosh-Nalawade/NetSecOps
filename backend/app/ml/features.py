import numpy as np
from datetime import datetime
import re


def ip_to_features(ip: str) -> tuple[float, float, float]:
    """Extract numeric features from IP string."""
    parts = re.findall(r"\d+", ip)
    if len(parts) < 4:
        return 0.0, 0.0, 0.0
    octets = [float(p) for p in parts[:4]]
    # First octet (network), second, and sum of last two (host part)
    return octets[0] / 255.0, octets[1] / 255.0, (octets[2] + octets[3]) / 510.0


def timestamp_to_features(ts_ms: int | None) -> tuple[float, float]:
    """Extract hour and day-of-week from timestamp (normalized)."""
    if ts_ms is None:
        return 0.5, 0.5  # neutral
    dt = datetime.fromtimestamp(ts_ms / 1000.0)
    hour = dt.hour / 23.0
    dow = dt.weekday() / 6.0
    return hour, dow


def extract_features(amount: float, source_ip: str, timestamp: int | None = None) -> np.ndarray:
    """Build feature vector for the model: amount_norm, ip features, time features."""
    # Normalize amount (log-scale, cap at ~60k)
    amount_norm = min(np.log1p(amount) / 12.0, 1.0)  # ~0-1 for 0-60k
    ip1, ip2, ip3 = ip_to_features(source_ip)
    hour, dow = timestamp_to_features(timestamp)
    return np.array([[amount_norm, ip1, ip2, ip3, hour, dow]], dtype=np.float32)
