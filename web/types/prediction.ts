export interface PredictionRequest {
    age: number;
    sex: number;
    cp: number;
    trestbps: number;
    chol: number;
    fbs: number;
    restecg: number;
    thalach: number;
    exang: number;
    oldpeak: number;
    slope: number;
    ca: number;
    thal: number;
}

export interface PredictionResponse {
    prediction: 0 | 1;
    probability: number;
    riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ModelMetrics {
    model_name: string;
    metrics: {
        cv_roc_auc_mean: number;
        cv_roc_auc_std: number;
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        roc_auc: number;
        confusion_matrix: number[][];
    };
    feature_importance: Record<string, number>;
    all_models_results: Record<string, any>;
}
