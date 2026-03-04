**Project Overview**

This repository contains an end-to-end proof-of-concept for training, evaluating and serving a supervised machine learning model for binary classification (cardiac screening). The project is organized to separate data, model training, backend APIs and a Next.js frontend dashboard that visualizes model metrics and feature importance.

**Scope**

- Model training scripts, artifacts and evaluation outputs
- Lightweight backend for prediction and metrics APIs
- Frontend dashboard to visualize model performance and diagnostics

**Contents**

- **data/**: raw and split datasets used for training and testing.
- **ml/**: notebook/script assets and the primary training script `train_model.py` used to train the model.
- **backend/**: Python API entrypoint and server code. See [backend/main.py](backend/main.py) and [backend/requirements.txt](backend/requirements.txt).
- **web/**: Next.js frontend (React + TypeScript) and supporting configuration. Key files: [web/package.json](web/package.json), [web/tsconfig.json](web/tsconfig.json), [web/postcss.config.mjs](web/postcss.config.mjs).
- **web/public/**: static assets and precomputed metrics used by the dashboard, including [web/public/model_metrics.json](web/public/model_metrics.json) and several SVG icons.
- `best_model.joblib`: serialized model artifact (trained estimator).
- `model_metrics.json`: model evaluation summary (available in the `web/public` folder for the UI).

**Architecture & Data Flow**

1. Data is prepared and preprocessed in the `ml/` pipeline.
2. The training script (`ml/train_model.py`) fits an estimator and serializes the final model to `best_model.joblib` and writes evaluation metadata into JSON.
3. The backend exposes prediction and metrics endpoints which the frontend consumes. The frontend is implemented in the `web/` Next.js app and reads `web/public/model_metrics.json` for dashboard visuals.

**Technologies**

- Python 3.8+ for training and backend components
- scikit-learn / joblib (model training & serialization)
- FastAPI / minimal Python HTTP server pattern for backend (see `backend/main.py`)
- Node.js + Next.js (React 19, TypeScript) for the frontend dashboard
- Recharts for charts and visualization in the dashboard
- Tailwind CSS via PostCSS for styling

**How To Run — Local Development**

Prerequisites:

- Python 3.8+ and virtual environment tooling
- Node.js 18+ and npm or yarn

Backend (Python):

```bash
python -m venv .venv
source .venv/bin/activate   # on Windows: .venv\\Scripts\\activate
pip install -r backend/requirements.txt
python backend/main.py
```

Frontend (Next.js):

```bash
cd web
npm install
npm run dev
```

The frontend runs by default on `http://localhost:3000` and consumes the backend endpoints or the static `web/public/model_metrics.json` when available.

**API Endpoints**

- `GET /api/metrics` — returns model metrics used by the dashboard (implemented in `web/app/api/metrics/route.ts`).
- `POST /api/predict` — prediction endpoint accepting a structured request and returning probability and risk level (see `web/app/api/predict/route.ts` and types in [web/types/prediction.ts](web/types/prediction.ts)).

Request/response contract (client types): see [web/types/prediction.ts](web/types/prediction.ts).

**Model Training & Reproducibility**

- The training logic is in `ml/train_model.py`. The script performs data loading, preprocessing, cross-validation, model selection and writes the final `best_model.joblib` artifact and evaluation JSON.
- To retrain from scratch (recommended in an isolated environment):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python ml/train_model.py
```

Note: `requirements.txt` at the repository root contains the Python packages used by the ML pipeline. Use `backend/requirements.txt` if you only run the API server.

**Testing & Validation**

- Model evaluation metrics and confusion matrices are included in `web/public/model_metrics.json` for reproducible reference.
- Unit and integration tests are not included in this snapshot; consider adding a `tests/` suite (pytest) and CI pipeline to validate training and API behavior.

**Project Conventions**

- Commits follow Conventional Commits format. Branching is feature-oriented. The current work is on `feature/model-training`.
- Type definitions for the frontend API contract are located at [web/types/prediction.ts](web/types/prediction.ts).

**Security & Privacy**

- This repository contains only model artifacts and aggregated metrics; it should not include raw protected health data. Ensure all datasets are de-identified and that you have legal clearance before sharing or deploying.

**Next Steps & Recommendations**

1. Add automated tests (unit + integration) and a CI pipeline (GitHub Actions) to validate training, serialization, and API surface.
2. Add schema validation for the prediction API (pydantic in backend) and robust error handling.
3. Add containerization (Dockerfile) for backend and frontend for consistent deployments.
4. Harden the model lifecycle: model versioning, reproducible training (random seeds recorded), and model governance metadata.

**Contributing**

Contributions should follow the repository conventions: open a branch from `main` or the current feature branch, use descriptive Conventional Commit messages, and open a PR with a clear description of the change and testing performed.

**License & Contact**

This repository does not include an explicit license file. Add a `LICENSE` file if you intend to publish or share the code under a specific license. For questions regarding the implementation, contact the repository owner.
# CardioPredict - Machine Learning Heart Disease Analysis

CardioPredict is a professional, predictive health application based on the "Heart Disease Prediction Using Machine Learning" dataset from Kaggle. The tool integrates a trained statistical model (Gradient Boosting) wrapped in a FastAPI microservice, and exposed via a modern Next.js 14 web dashboard.

## Overview & Problem Definition
Heart disease is a leading cause of mortality worldwide. Early and accurate detection based on clinical indicators is essential to mitigate severe outcomes. This academic project aims to apply machine learning algorithms to historically diagnosed patients, mapping their age, lifestyle factors, and physiological tests (13 variables total) to the presence of cardiovascular disease.

## Methodology
The analytical flow implemented in this repository covers:
1. **Exploratory Data Analysis & Cleaning**: Evaluating missing values, target distribution, and feature correlations.
2. **Model Training**: Comparing Logistic Regression, Random Forest, and Gradient Boosting.
3. **Cross-Validation**: 5-fold cross validation for robust metric estimation and avoiding data leakage.
4. **Model Selection**: Gradient Boosting Classifier was chosen due to its highest ROC-AUC on the test set.

## Compared Models & Justification
Three models were evaluated:
- **Logistic Regression**: Reliable linear baseline. 
- **Random Forest**: Good handling of non-linear data and mixed feature types.
- **Gradient Boosting**: Chosen as the absolute best model due to superior ROC-AUC (~95.4%), offering the highest discrimination capacity between healthy individuals and those positive for heart disease. It handles complex non-linear combinations of the physiological variables more efficiently.

### Selected Model Metrics
- **Accuracy**: 88.8%
- **Precision**: 88.1%
- **Recall (Sensitivity)**: 86.6% (critical metric for medical diagnostics)
- **F1-Score**: 87.4%
- **ROC-AUC**: 95.4%

## Project Architecture
This repository follows Clean Architecture principles separating the heavy data processing and the frontend.
* **`ml/`**: Jupyter/Python scripts for exploratory data analysis and model training (`train_model.py`).
* **`backend/`**: A lightweight Python REST API based on FastAPI to serve the serialized `.joblib` model.
* **`web/`**: A Next.js 14 React frontend built with Tailwind CSS, consisting of a landing page, a dashboard to display clinical metrics, and a React form for generating real-time predictions.

## Limitations & Ethical Considerations
- **Not for Clinical Diagnosis**: This is a statistical tool reflecting historical patterns strictly for research and pedagogical purposes. It possesses false positives and false negatives and should **never** replace professional medical oversight.
- **Data Representation**: The dataset may contain biases depending on the demographics of the evaluated subset. Models derived from such data require external validation before being deployed in distinct clinical contexts.

## Deployment Instructions

### Local Execution
1. **Train Model** (Optional, pre-trained `best_model.joblib` exists):
   ```bash
   python ml/train_model.py
   ```
2. **Start FastAPI Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
3. **Start Next.js Web App**:
   ```bash
   cd web
   npm install
   npm run dev
   ```
   Navigate to `http://localhost:3000`.

### Vercel / Render Deployment
To deploy this full-stack application safely:
1. **Backend (Render / Railway / Heroku)**:
   - Create a Web Service pointing to the `./backend` folder.
   - Use `uvicorn main:app --host 0.0.0.0 --port $PORT` in the start command.
   - Once deployed, copy the provided public URL.
2. **Frontend (Vercel)**:
   - Import the project in Vercel.
   - Set the Root Directory to `web/`.
   - Add an Environment Variable: `FASTAPI_URL` equal to the URL obtained in step 1.
   - Deploy. Next.js will use its internal `api/predict/route.ts` as a secure proxy to the external backend.
