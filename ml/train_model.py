import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import json
import joblib
import os
import warnings

from typing import Dict, Any

from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, roc_auc_score, confusion_matrix)

warnings.filterwarnings('ignore')

def main():
    # 1. Load dataset
    print("Loading dataset...")
    df = pd.read_csv('data/train.csv')
    
    # 2. EDA & Cleaning
    print("Performing EDA and Cleaning...")
    os.makedirs('eda', exist_ok=True)
    
    # Drop 'id' if it exists as it's not a feature
    if 'id' in df.columns:
        df = df.drop('id', axis=1)
    
    # Transform Target
    df['Heart Disease'] = df['Heart Disease'].map({'Absence': 0, 'Presence': 1})
    
    # Save descriptive stats
    df.describe().to_csv('eda/descriptive_statistics.csv')
    
    # Target distribution
    plt.figure(figsize=(6, 4))
    sns.countplot(data=df, x='Heart Disease')
    plt.title('Distribution of Target Variable')
    plt.savefig('eda/target_distribution.png')
    plt.close()
    
    # Correlation matrix
    plt.figure(figsize=(12, 10))
    sns.heatmap(df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Correlation Matrix')
    plt.savefig('eda/correlation_matrix.png')
    plt.close()
    
    # Check nulls (should be 0)
    print("Null values:\n", df.isnull().sum())
    
    # Prepare features and target
    X = df.drop('Heart Disease', axis=1)
    y = df['Heart Disease']
    
    # Note: Categorical features exist like 'Chest pain type', 'EKG results', 'Slope of ST', 'Thallium'
    # For a robust linear model we should ideally one-hot encode them, but tree based models handle them as numerical fine.
    # We will treat them as numerical for simplicity if they are ordinal, otherwise OHE would be better.
    # The requirement is basic encoding. We'll leave them as is for this iteration to match the requested features strictly.

    # 4. Division del dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # 5. Model Definitions
    # To handle 630.000 rows efficiently, using smaller n_estimators and setting max_depth, 
    # and maybe using HistGradientBoostingClassifier instead due to data size, but keeping original reqs.
    models = {
        'Logistic Regression': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(random_state=42, max_iter=1000))
        ]),
        'Random Forest Classifier': RandomForestClassifier(random_state=42, n_estimators=50, max_depth=15, n_jobs=-1),
        'Gradient Boosting Classifier': GradientBoostingClassifier(random_state=42, n_estimators=50, max_depth=5)
    }
    
    # 6. Training & Evaluation
    print("Training and Evaluating Models...")
    results = {}
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    
    best_roc_auc = 0
    best_model_name = ""
    best_model = None
    best_model_metrics: Dict[str, Any] = {}
    
    for name, model in models.items():
        print(f"--> Training {name}")
        # Cross-validation based on ROC-AUC
        cv_scores = cross_val_score(model, X_train, y_train, cv=kf, scoring='roc_auc')
        
        # Fit on whole train set
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else y_pred
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        results[name] = {
            'cv_roc_auc_mean': float(cv_scores.mean()),
            'cv_roc_auc_std': float(cv_scores.std()),
            'accuracy': float(acc),
            'precision': float(prec),
            'recall': float(rec),
            'f1_score': float(f1),
            'roc_auc': float(roc_auc),
            'confusion_matrix': cm
        }
        
        # Select best model based on TEST ROC-AUC (as per requirement 8)
        if roc_auc > best_roc_auc:
            best_roc_auc = roc_auc
            best_model_name = name
            best_model = model
            best_model_metrics = results[name]
            
    print(f"Best Model: {best_model_name} with ROC-AUC = {best_roc_auc:.4f}")
    
    # 9. Extract feature importance
    feature_importance = {}
    if best_model_name in ['Random Forest Classifier', 'Gradient Boosting Classifier']:
        importances = best_model.feature_importances_
        feature_importance = {feat: float(imp) for feat, imp in zip(X.columns, importances)}
    elif best_model_name == 'Logistic Regression':
        # Get coefficients from the Logistic Regression step in the pipeline
        importances = best_model.named_steps['clf'].coef_[0]
        feature_importance = {feat: float(imp) for feat, imp in zip(X.columns, importances)}
        # Take absolute value for visualizing relative importance
        feature_importance = {k: abs(v) for k, v in feature_importance.items()}
        
    # Sort feature importance
    feature_importance = dict(sorted(feature_importance.items(), key=lambda item: item[1], reverse=True))
    
    # 10. Export best model
    joblib.dump(best_model, 'best_model.joblib')
    print("Model exported to best_model.joblib")
    
    # 11. Generate JSON
    output_json = {
        'model_name': best_model_name,
        'metrics': best_model_metrics,
        'feature_importance': feature_importance,
        'all_models_results': results
    }
    
    with open('model_metrics.json', 'w') as f:
        json.dump(output_json, f, indent=4)
        
    print("Metrics exported to model_metrics.json")
    print("Done!")

if __name__ == '__main__':
    main()
