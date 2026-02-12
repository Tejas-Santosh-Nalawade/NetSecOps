# NetSecOps AI - Autonomous Fraud Intelligence Platform

A complete enterprise-grade fraud detection and monitoring platform built with modern web technologies.

## 🚀 Features

- **Real-time Fraud Detection**: Live anomaly detection with AI-powered risk scoring
- **Incident Management**: Comprehensive incident tracking with detailed analysis
- **Model Monitoring**: Track model performance, drift, and latency metrics
- **Feedback Loop**: Validate predictions and trigger model retraining
- **System Visualization**: Clear architecture diagrams and data flow
- **MLOps Pipeline**: Complete MLOps infrastructure with experiment tracking, model registry, drift detection, and CI/CD

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Routing**: React Router v6
- **State Management**: Zustand
- **Backend**: FastAPI + Python
- **ML**: scikit-learn, XGBoost
- **MLOps**: MLflow, Model Registry, Drift Detection, CI/CD (GitHub Actions)

## 📦 Installation

### Frontend

```bash
npm install
npm run dev
```

### Backend (ML API)

```bash
cd backend
pip install -r requirements.txt
python train_model.py   # Run once to train and save the model
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Set `VITE_API_URL=http://localhost:8000` if the API runs on a different host/port. The frontend uses the ML API for risk scoring, metrics, and feedback when the backend is available.

**Quick Start Scripts:**
- Windows: `start-backend.bat` (starts backend)
- Linux/Mac: `chmod +x start-backend.sh && ./start-backend.sh`

See `SETUP.md` for detailed setup instructions.

## 🎯 Usage

1. **Login**: Use any email, password, and MFA code to access the platform
2. **Dashboard**: Monitor real-time fraud detection and metrics
3. **Incidents**: Review and take action on flagged transactions
4. **Model Monitoring**: Track ML model performance and health
5. **Feedback**: Validate predictions to improve model accuracy
6. **Architecture**: Understand the system design and data flow

## 🔒 Security Features

- Multi-factor authentication
- Role-based access control
- Audit logging
- Authorized personnel access only

## 📊 Key Metrics

- Transaction processing rate: 800-1300 tx/sec
- Average latency: ~50ms
- Model accuracy: 94%+
- False positive rate: <7%

## 🎨 Design Philosophy

- Clean, professional SaaS interface
- Minimal animations for performance
- Accessible and responsive design
- Enterprise-grade user experience

## 🔄 Real-time Simulation

The platform simulates:
- Random transaction generation
- AI risk scoring
- Automatic incident creation
- Live chart updates
- Model performance metrics

## 🤖 MLOps Pipeline

The platform includes a complete MLOps infrastructure:

- **Experiment Tracking**: MLflow integration for logging training runs, metrics, and hyperparameters
- **Model Registry**: Version control for models with metadata tracking
- **Drift Detection**: Real-time monitoring of feature and prediction drift
- **Automated Retraining**: API endpoint to trigger model retraining pipeline
- **CI/CD**: GitHub Actions workflows for automated training and validation
- **Model Deployment**: Versioned model deployment with validation gates

See `backend/MLOPS.md` for detailed documentation.

### MLOps Endpoints

- `POST /mlops/retrain` - Trigger model retraining
- `GET /mlops/drift` - Get drift detection status
- `GET /mlops/registry` - List all model versions
- `POST /mlops/deploy/{version}` - Deploy model to production
- `GET /mlops/experiments` - List training experiments

## 📝 License

MIT License - Built for demonstration purposes

## 👥 Credits

Built with ❤️ for the Allianz Tech Championship
