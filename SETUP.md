# Setup Guide - NetSecOps AI Platform

## Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python train_model.py  # Train model (first time only)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Or use the startup script:**
- Windows: `start-backend.bat`
- Linux/Mac: `chmod +x start-backend.sh && ./start-backend.sh`

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### 2. Frontend Setup

```bash
npm install
npm run dev
```

The frontend will be available at http://localhost:5173

## Integration Status

The frontend automatically connects to the backend API:
- ✅ **API Status Indicator**: Shows connection status in header
- ✅ **Real-time Predictions**: Uses ML API for risk scoring
- ✅ **Model Metrics**: Fetches from `/metrics` endpoint
- ✅ **Feedback Loop**: Submits to `/feedback` endpoint
- ✅ **Retraining**: Calls `/mlops/retrain` endpoint
- ✅ **Fallback**: Works offline with local calculations if API unavailable

## Troubleshooting

### Backend not starting?

1. **Check Python version**: `python --version` (requires 3.8+)
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Train model**: `python train_model.py`
4. **Check port**: Ensure port 8000 is not in use

### Frontend can't connect?

1. **Check backend is running**: Visit http://localhost:8000/health
2. **Check API URL**: Default is `http://localhost:8000`
3. **Set custom URL**: Create `.env` file with `VITE_API_URL=http://your-backend-url:8000`
4. **Check CORS**: Backend allows `localhost:5173` by default

### Model not loading?

1. **Train model**: Run `python train_model.py` in backend directory
2. **Check files**: Ensure `app/ml/fraud_model.joblib` exists
3. **Check logs**: Backend will show model load status

## Environment Variables

Create `.env` file in root directory (optional):

```env
VITE_API_URL=http://localhost:8000
```

## API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /predict` - Risk prediction
- `GET /metrics` - Model metrics
- `POST /feedback` - Submit feedback

### MLOps Endpoints
- `POST /mlops/retrain` - Trigger retraining
- `GET /mlops/drift` - Get drift status
- `GET /mlops/registry` - List model versions
- `POST /mlops/deploy/{version}` - Deploy model
- `GET /mlops/experiments` - List experiments

## Development

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
npm run dev
```

### Testing API
```bash
# Health check
curl http://localhost:8000/health

# Predict
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "source_ip": "192.168.1.1"}'

# Metrics
curl http://localhost:8000/metrics
```

## Production Deployment

1. **Build frontend**: `npm run build`
2. **Serve backend**: Use production WSGI server (gunicorn, etc.)
3. **Set environment variables**: Configure API URLs
4. **Enable HTTPS**: Use reverse proxy (nginx, etc.)
