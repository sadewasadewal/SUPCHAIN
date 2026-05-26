# SUPCHAIN - Supply Chain Shipping Time Predictor

A full-stack machine learning application that predicts shipping times in supply chain operations. Built with FastAPI backend, React frontend, and scikit-learn ML model.

## 🎯 Features

- **ML-Powered Predictions**: Predict shipping times based on shipping mode, customer segment, location, and department
- **Interactive Dashboard**: Real-time analytics with feature importance and scatter plots
- **RESTful API**: FastAPI backend with comprehensive endpoints for predictions and analytics
- **Responsive UI**: Modern React frontend with Tailwind CSS and interactive charts
- **Hot Reload**: Development servers with auto-reload for seamless development

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.115.6
- **Server**: Uvicorn with hot reload
- **ML Model**: scikit-learn RandomForestRegressor
- **Data Processing**: Pandas, NumPy
- **Testing**: pytest, httpx

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.0.5
- **Styling**: Tailwind CSS 3.4.17
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React 0.469.0

## 📋 Prerequisites

- Python 3.14+
- Node.js 18+
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SUPCHAIN
```

### 2. Backend Setup
```bash
cd backend
python3.14 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
source .venv/bin/activate
.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend Dev Server:**
```bash
cd frontend
npm run dev -- --host
```

The application will be available at:
- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:8000/
- **API Docs**: http://localhost:8000/docs (Swagger UI)

## 📁 Project Structure

```
SUPCHAIN/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration and paths
│   │   ├── main.py            # FastAPI application
│   │   └── ml/
│   │       ├── predict.py     # ModelService for predictions
│   │       └── train.py       # Model training pipeline
│   ├── tests/
│   │   └── test_api.py        # API tests
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── api.ts             # API client
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── components/
│   │       ├── Dashboard.tsx  # Main dashboard
│   │       ├── Predictor.tsx  # Prediction form
│   │       ├── Analytics.tsx  # Analytics view
│   │       └── Layout.tsx     # Layout wrapper
│   ├── package.json           # Node dependencies
│   └── vite.config.ts         # Vite configuration
├── Datasets/
│   └── DataCoSupplyChainDataset.csv
└── README.md
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### Get Model Metrics
```http
GET /api/metrics
```
Returns MAE, baseline std, training/test row counts, feature count, and average shipping days.

### Get Available Options
```http
GET /api/options
```
Returns available shipping modes, customer segments, departments, regions, and countries.

### Get Analytics Data
```http
GET /api/analytics
```
Returns feature importance, scatter plot data, and model performance metrics.

### Make Predictions
```http
POST /api/predict
Content-Type: application/json

{
  "shipping_mode": "Flight",
  "customer_segment": "Corporate",
  "department_name": "Automotive",
  "order_region": "Western Europe",
  "order_country": "Germany",
  "latitude": 51.1657,
  "longitude": 10.4515
}
```

## 📊 Model Details

- **Algorithm**: Random Forest Regressor (50 estimators)
- **Features**: 7 input features with one-hot encoding
- **Training/Test Split**: 80/20
- **Performance**: Displays MAE (Mean Absolute Error) for model accuracy
- **Auto-Training**: Model automatically trains on first startup if artifacts don't exist

## 🧪 Testing

Run the API tests:
```bash
cd backend
source .venv/bin/activate
pytest tests/
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Deployment
Consider using:
- Docker for containerization
- Gunicorn for production ASGI server
- Environment variables for configuration

## 🔄 Development Workflow

1. **Backend Development**: Changes to `backend/app/` trigger automatic reload
2. **Frontend Development**: Vite's HMR provides instant updates
3. **Model Updates**: Train.py can be run independently; model artifacts are cached
