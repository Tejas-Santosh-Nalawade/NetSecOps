# Backend-Frontend Integration Guide

## ✅ Integration Status

The backend and frontend are now **fully integrated** with the following features:

### 1. **API Connection Status**
- ✅ Real-time connection indicator in header
- ✅ Shows "API Connected" / "API Disconnected" status
- ✅ Displays "Model Loaded" when backend model is ready
- ✅ Auto-refreshes every 10 seconds

### 2. **Real-time Predictions**
- ✅ Frontend uses ML API for risk scoring (`/predict` endpoint)
- ✅ Falls back to local calculations if API unavailable
- ✅ Seamless error handling

### 3. **Model Metrics**
- ✅ Fetches metrics from `/metrics` endpoint
- ✅ Displays in Model Monitoring page
- ✅ Shows best algorithm and comparison table
- ✅ Auto-refreshes every 30 seconds

### 4. **Feedback Loop**
- ✅ Submits feedback to `/feedback` endpoint
- ✅ Stores locally and sends to backend
- ✅ Used for model improvement

### 5. **Retraining Integration**
- ✅ "Retrain Model" button calls `/mlops/retrain`
- ✅ Shows loading state during retraining
- ✅ Refreshes metrics after completion
- ✅ Falls back to simulated retraining if API fails

## 🔧 How It Works

### Frontend → Backend Flow

```
Frontend Component
    ↓
API Client (src/api/client.ts)
    ↓
Fetch Request → Backend API (http://localhost:8000)
    ↓
FastAPI Endpoint (backend/app/main.py)
    ↓
ML Model Inference (backend/app/ml/model.py)
    ↓
Response → Frontend
```

### Error Handling

The frontend gracefully handles API failures:
1. **Connection Errors**: Shows "API Disconnected" status
2. **Prediction Failures**: Falls back to local risk calculation
3. **Metrics Failures**: Uses cached/default metrics
4. **Retraining Failures**: Falls back to simulated retraining

## 🚀 Starting the System

### Option 1: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python train_model.py  # First time only
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Option 2: Startup Scripts

**Windows:**
```bash
start-backend.bat  # In one terminal
npm run dev        # In another terminal
```

**Linux/Mac:**
```bash
chmod +x start-backend.sh
./start-backend.sh  # In one terminal
npm run dev         # In another terminal
```

## 🔍 Verification

### Check Backend is Running

Visit: http://localhost:8000/health

Expected response:
```json
{
  "status": "ok",
  "model_loaded": true
}
```

### Check Frontend Connection

1. Open frontend: http://localhost:5173
2. Look at header - should show "API Connected • Model Loaded"
3. If red dot appears, backend is not running

### Test Integration

1. **Login** to the platform
2. **Dashboard** should show transactions (using ML API)
3. **Model Monitoring** should show real metrics from API
4. **Feedback** page should submit to backend
5. **Retrain** button should trigger backend retraining

## 🐛 Troubleshooting

### Backend Not Starting

**Error**: `ModuleNotFoundError`
```bash
cd backend
pip install -r requirements.txt
```

**Error**: `Model not found`
```bash
cd backend
python train_model.py
```

**Error**: `Port already in use`
- Change port in `uvicorn` command: `--port 8001`
- Update frontend `.env`: `VITE_API_URL=http://localhost:8001`

### Frontend Can't Connect

**Check 1**: Is backend running?
```bash
curl http://localhost:8000/health
```

**Check 2**: CORS configuration
- Backend allows: `http://localhost:5173` and `http://127.0.0.1:5173`
- If using different port, update `backend/app/main.py` CORS settings

**Check 3**: API URL configuration
- Default: `http://localhost:8000`
- Override: Create `.env` file with `VITE_API_URL=http://your-url:port`

### Model Not Loading

**Check**: Model file exists
```bash
ls backend/app/ml/fraud_model.joblib
```

**Fix**: Train model
```bash
cd backend
python train_model.py
```

## 📊 API Endpoints Used

| Endpoint | Method | Used By | Purpose |
|----------|--------|---------|---------|
| `/health` | GET | ApiStatus component | Check connection |
| `/predict` | POST | Transaction generation | Risk scoring |
| `/metrics` | GET | Model Monitoring | Display metrics |
| `/feedback` | POST | Feedback page | Submit feedback |
| `/mlops/retrain` | POST | Retrain button | Trigger retraining |

## 🎯 Next Steps

1. ✅ Backend and frontend are integrated
2. ✅ API connection status visible
3. ✅ Real-time predictions working
4. ✅ Metrics fetching working
5. ✅ Feedback submission working
6. ✅ Retraining integration working

The system is ready to use! 🚀
