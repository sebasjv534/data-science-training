from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os

app = FastAPI(title="Heart Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "best_model.joblib")
model = None
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")

class PatientData(BaseModel):
    age: float = Field(..., alias="Age", ge=0, le=120)
    sex: float = Field(..., alias="Sex", ge=0, le=1) # 0 or 1
    cp: float = Field(..., alias="Chest pain type", ge=1, le=4)
    trestbps: float = Field(..., alias="BP")
    chol: float = Field(..., alias="Cholesterol")
    fbs: float = Field(..., alias="FBS over 120", ge=0, le=1)
    restecg: float = Field(..., alias="EKG results")
    thalach: float = Field(..., alias="Max HR")
    exang: float = Field(..., alias="Exercise angina", ge=0, le=1)
    oldpeak: float = Field(..., alias="ST depression")
    slope: float = Field(..., alias="Slope of ST")
    ca: float = Field(..., alias="Number of vessels fluro")
    thal: float = Field(..., alias="Thallium")

    class Config:
        populate_by_name = True

@app.post("/predict")
def predict(data: PatientData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server.")
    
    # Needs to match exactly the column names expected by the model
    # During training:
    # Age, Sex, Chest pain type, BP, Cholesterol, FBS over 120, EKG results, 
    # Max HR, Exercise angina, ST depression, Slope of ST, Number of vessels fluro, Thallium
    input_data = {
        "Age": [data.age],
        "Sex": [data.sex],
        "Chest pain type": [data.cp],
        "BP": [data.trestbps],
        "Cholesterol": [data.chol],
        "FBS over 120": [data.fbs],
        "EKG results": [data.restecg],
        "Max HR": [data.thalach],
        "Exercise angina": [data.exang],
        "ST depression": [data.oldpeak],
        "Slope of ST": [data.slope],
        "Number of vessels fluro": [data.ca],
        "Thallium": [data.thal],
    }
    
    df = pd.DataFrame(input_data)
    
    try:
        prediction_val = int(model.predict(df)[0])
        probability = float(model.predict_proba(df)[0][1]) if hasattr(model, "predict_proba") else float(prediction_val)
        
        risk_level = "Low"
        if probability >= 0.7:
            risk_level = "High"
        elif probability >= 0.4:
            risk_level = "Medium"
            
        return {
            "prediction": prediction_val,
            "probability": round(probability * 100, 2),
            "riskLevel": risk_level
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
