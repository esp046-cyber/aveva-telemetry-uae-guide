"""Mock edge collector: polls fake points and prints JSON. Replace read_point() with real Modbus/DNP3 reads."""
import json, random, time
POINTS = ["AI001", "AI002", "DI001"]
def read_point(pid):
    return round(random.uniform(5, 14), 2) if pid.startswith("AI") else random.choice([0, 1])
while True:
    print(json.dumps({"ts": time.time(), "values": {p: read_point(p) for p in POINTS}}))
    time.sleep(5)
