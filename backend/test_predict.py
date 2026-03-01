import requests
import json

url = "http://localhost:8000/predict"
payload = {
    "amount": 15000.50,
    "source_ip": "192.168.1.100",
    "timestamp": 1700000000000
}

try:
    response = requests.post(url, json=payload, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {response.headers}")
    print(f"Text: {response.text}")
    if response.status_code == 200:
        print(f"JSON: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
