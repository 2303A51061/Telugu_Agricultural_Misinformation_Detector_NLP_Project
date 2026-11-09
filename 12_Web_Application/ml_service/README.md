# Telugu Agricultural Misinformation – Python ML Microservice

This minimal FastAPI microservice loads your actual trained Scikit-Learn `Logistic_Regression_Model.pkl` and `TFIDF_Vectorizer.pkl` directly from `07_Machine_Learning/` and `06_TFIDF_Feature_Extraction/`.

## Prerequisites
- Python 3.9, 3.10, 3.11, or 3.12

## Setup Instructions

1. Open a terminal and navigate to this folder:
```bash
cd 12_Web_Application/ml_service
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Linux / macOS:
source venv/bin/activate
```

3. Install requirements:
```bash
pip install -r requirements.txt
```

4. Run the inference server:
```bash
uvicorn app:app --reload --port 8000
```

The service will start on `http://localhost:8000`.
- Health Check: `http://localhost:8000/health`
- Interactive Swagger Documentation: `http://localhost:8000/docs`

> **Note on Full-Stack Architecture:**
> The Express.js backend automatically detects whether this FastAPI service is running. If running, requests are routed to this service. If not running, the backend seamlessly employs its built-in native JavaScript inference engine with exact bit-for-bit mathematical equivalence to the trained model.
