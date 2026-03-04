import fs from 'fs';
import path from 'path';
import { ModelMetrics } from '../types/prediction';

export function getModelMetrics(): ModelMetrics {
    // Read from the public directory which is available on Vercel
    const filePath = path.join(process.cwd(), 'public', 'model_metrics.json');

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent) as ModelMetrics;
    } catch (error) {
        console.error("Error reading model metrics:", error);
        // Return empty fallback
        return {
            model_name: "Unknown",
            metrics: {
                cv_roc_auc_mean: 0,
                cv_roc_auc_std: 0,
                accuracy: 0,
                precision: 0,
                recall: 0,
                f1_score: 0,
                roc_auc: 0,
                confusion_matrix: [[0, 0], [0, 0]]
            },
            feature_importance: {},
            all_models_results: {}
        };
    }
}
