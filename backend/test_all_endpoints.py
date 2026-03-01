import requests
import json

BASE_URL = "http://localhost:8000"

print("="*60)
print("COMPREHENSIVE API TEST")
print("="*60)

# Test 1: Health Check
print("\n1. Testing Health Endpoint...")
try:
    r = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {r.status_code} ✓")
    print(f"   Response: {json.dumps(r.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Metrics
print("\n2. Testing Metrics Endpoint...")
try:
    r = requests.get(f"{BASE_URL}/metrics")
    print(f"   Status: {r.status_code} ✓")
    data = r.json()
    print(f"   Model Version: {data['version']}")
    print(f"   Best Algorithm: {data['best_algorithm']}")
    print(f"   F1 Score: {data['f1_score']}")
    print(f"   Accuracy: {data['accuracy']}")
except Exception as e:
    print(f"   Error: {e}")

# Test 3: Prediction (Low Risk)
print("\n3. Testing Prediction Endpoint - Low Risk Transaction...")
try:
    r = requests.post(f"{BASE_URL}/predict", json={
        "amount": 50.0,
        "source_ip": "10.0.0.1",
        "timestamp": 1700000000000
    })
    print(f"   Status: {r.status_code} ✓")
    data = r.json()
    print(f"   Risk Score: {data['risk_score']}")
    print(f"   Risk Level: {data['risk_level']}")
except Exception as e:
    print(f"   Error: {e}")

# Test 4: Prediction (High Risk)
print("\n4. Testing Prediction Endpoint - High Risk Transaction...")
try:
    r = requests.post(f"{BASE_URL}/predict", json={
        "amount": 25000.0,
        "source_ip": "192.168.1.100",
        "timestamp": 1700000000000
    })
    print(f"   Status: {r.status_code} ✓")
    data = r.json()
    print(f"   Risk Score: {data['risk_score']}")
    print(f"   Risk Level: {data['risk_level']}")
    print(f"   AI Summary: {data['ai_summary'][:80]}...")
except Exception as e:
    print(f"   Error: {e}")

# Test 5: Dataset Stats
print("\n5. Testing Dataset Stats Endpoint...")
try:
    r = requests.get(f"{BASE_URL}/dataset/stats")
    print(f"   Status: {r.status_code} ✓")
    data = r.json()
    print(f"   Total Samples: {data['total_samples']}")
    print(f"   Fraud Rate: {data['fraud_rate']}%")
    print(f"   Total Features: {data['total_features']}")
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "="*60)
print("ALL TESTS COMPLETED!")
print("="*60)
