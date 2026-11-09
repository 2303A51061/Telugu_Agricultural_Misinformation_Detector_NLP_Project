import os
import re
import unicodedata
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Telugu Agricultural Misinformation ML Inference Service",
    description="Minimal FastAPI inference bridge for the Telugu Agricultural Fake-News Detection model",
    version="1.0.0"
)

# Enable CORS for full-stack Node.js backend & frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve paths to original trained model & vectorizer
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))

MODEL_PATH = os.path.join(PROJECT_ROOT, "07_Machine_Learning", "Logistic_Regression_Model.pkl")
VECTORIZER_PATH = os.path.join(PROJECT_ROOT, "06_TFIDF_Feature_Extraction", "TFIDF_Vectorizer.pkl")

model = None
vectorizer = None

def load_models():
    global model, vectorizer
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
    if not os.path.exists(VECTORIZER_PATH):
        raise FileNotFoundError(f"TFIDF Vectorizer file not found at: {VECTORIZER_PATH}")
    
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)
    print(f"[ML Service] Successfully loaded model from {MODEL_PATH}")
    print(f"[ML Service] Successfully loaded TF-IDF vectorizer from {VECTORIZER_PATH}")

try:
    load_models()
except Exception as e:
    print(f"[ML Service Warning] Model loading delayed or failed: {e}")

def preprocess_text(text: str) -> str:
    """Exact Telugu text preprocessing matching Steps 5 & 12 of the pipeline."""
    text = str(text or "")
    text = unicodedata.normalize("NFC", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

class PredictRequest(BaseModel):
    text: str = Field(..., description="Telugu agricultural social media text to analyze")

class PredictResponse(BaseModel):
    news_text: str
    predicted_label: str
    confidence: float
    p_information: float
    p_misinformation: float
    model_name: str
    is_misinformation: bool

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Telugu Agricultural Misinformation FastAPI Bridge",
        "model_loaded": model is not None,
        "vectorizer_loaded": vectorizer is not None,
        "model_file": os.path.basename(MODEL_PATH),
        "classes": list(model.classes_) if model is not None and hasattr(model, "classes_") else ["INFORMATION", "MISINFORMATION"]
    }

@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    if model is None or vectorizer is None:
        try:
            load_models()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model not loaded: {str(e)}")

    news_text = payload.text
    if not news_text or not news_text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    cleaned_text = preprocess_text(news_text)
    text_vector = vectorizer.transform([cleaned_text])
    predicted_class = model.predict(text_vector)[0]

    probabilities = model.predict_proba(text_vector)[0]
    classes = list(model.classes_)

    p_info = 0.0
    p_misinfo = 0.0
    for idx, cls_name in enumerate(classes):
        if cls_name == "INFORMATION":
            p_info = float(probabilities[idx]) * 100
        elif cls_name == "MISINFORMATION":
            p_misinfo = float(probabilities[idx]) * 100

    confidence = max(p_info, p_misinfo)

    return PredictResponse(
        news_text=news_text,
        predicted_label=predicted_class,
        confidence=round(confidence, 2),
        p_information=round(p_info, 2),
        p_misinformation=round(p_misinfo, 2),
        model_name="Logistic Regression (Trained Scikit-Learn)",
        is_misinformation=(predicted_class == "MISINFORMATION")
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
