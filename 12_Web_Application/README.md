# Telugu Agricultural Misinformation Detector — Full-Stack Web Application

**Final-Year CSE Research Project:** "NLP-Based Detection of Agricultural Misinformation in Telugu Social Media – Fake-News Detection"

A complete, modern Full-Stack JavaScript web application integrating actual trained Machine Learning models (Scikit-Learn Logistic Regression & TF-IDF Vectorizer) and dataset statistics (3,200 records).

---

## Architecture Overview

```
12_Web_Application/
├── frontend/             # React.js 18 + Tailwind CSS + Recharts + Lucide Icons (Port 3000)
├── backend/              # Node.js + Express.js REST API + SQLite History (Port 5000)
├── ml_service/           # Optional Python FastAPI microservice bridge (Port 8000)
├── assets/               # High-resolution SVG and PNG application logos
└── README.md             # Complete documentation
```

### ML Inference Modes:
1. **JavaScript Native Scikit-Learn Engine (Default):** Directly evaluates the trained Logistic Regression and TF-IDF parameters extracted from `07_Machine_Learning/Logistic_Regression_Model.pkl` and `06_TFIDF_Feature_Extraction/TFIDF_Vectorizer.pkl`. Provides 100.0% mathematical equivalence with zero external Python runtime required.
2. **Python FastAPI Bridge:** Optional microservice on `http://localhost:8000/predict` loaded via Joblib/Pickle. The Express backend automatically routes to FastAPI if active.

---

## Quick Start (Running the Application)

### 1. Start the Express Backend (Port 5000)

```bash
cd 12_Web_Application/backend
npm install
npm start
```
- API Base: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`

### 2. Start the React Frontend (Port 3000)

In a new terminal window:
```bash
cd 12_Web_Application/frontend
npm install
npm run dev
```
Open your browser and navigate to:
**`http://localhost:3000`**

### 3. Optional: Run the Python ML Microservice (Port 8000)

If Python is installed on your host:
```bash
cd 12_Web_Application/ml_service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

---

## Features & Pages
1. **Home / Dashboard (`/`):** Project title, system architecture overview, dataset statistics (3,200 total records, 1,600 Information, 1,600 Misinformation), and selected model metrics.
2. **Telugu Text Detection (`/detect`):** Real-time Telugu input analyzer with Unicode NFC normalization, TF-IDF n-gram feature matching, probability bar, and contextual explanation.
3. **Dataset Samples (`/samples`):** Authentic Telugu agricultural claims loaded from the dataset across 14 agricultural categories with live side-by-side inference testing.
4. **Analytics Dashboard (`/analytics`):** Interactive Recharts visualizations: 1:1 class distribution pie chart, 14 topic bar chart, text length histogram, and top 20 frequent Telugu words.
5. **Model Performance (`/performance`):** Benchmarking table comparing Logistic Regression, Naive Bayes, Linear SVM, and MuRIL Transformer, along with 640-sample confusion matrix.
6. **Prediction History (`/history`):** Persistent SQLite audit trail with search, class filtering, CSV export, and clear actions.
7. **About Research (`/about`):** Detailed CSE project documentation covering problem statement, methodology, 12-step roadmap, limitations, and future enhancements.
