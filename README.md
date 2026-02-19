<div align="center">
  
<img width="5624" height="1224" alt="ClickMLBanner" src="https://github.com/user-attachments/assets/8c3ff6c2-f378-44e2-bd91-54ad79e12440" />

![Static Badge](https://img.shields.io/badge/license-Apache--2.0-blue)
![Static Badge](https://img.shields.io/badge/Build_ClickML_Docker_Images-passing-green?logo=github)
![Static Badge](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql&logoColor=white)
![Static Badge](https://img.shields.io/badge/FastAPI-white?logo=fastapi&logoColor=%23009688)
---
![Apache Airflow](https://img.shields.io/badge/Apache%20Airflow-017CEE?style=for-the-badge&logo=apacheairflow&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

#### ClickML is a low-code/no-code platform that helps MLOps engineers and data teams to create end-to-end ML pipelines — from ETL to model training and deployment — all through a simple, click-based interface.

## Architecture

<img width="6261" height="3824" alt="ClickMLPlatform" src="https://github.com/user-attachments/assets/237bff55-c5be-4d23-aeac-85875503a9e7" />

## Workflow in ClickML

```mermaid
flowchart TB
    %% ── Storage Layer (top-left) ──────────────────────────────
    subgraph STORAGE["Storage Layer"]
        LogFiles[("Log Files\nPostgreSQL")]
        ModelDB[("Model File\nDatabase (S3)")]
        PlatformDB[("Platform-dependent\nDatabase (PostgreSQL)")]
    end

    subgraph USER_STORE["User Storage"]
        UserData[("User Data")]
        UserDatabase[("User Database")]
    end

    %% ── Auth ──────────────────────────────────────────────────
    UserA(["User"])
    UserB(["User"])
    SignUp["Sign Up"]
    Login["Login"]

    UserA --> SignUp --> UserDatabase
    UserB --> Login --> UserDatabase
    UserDatabase --> |"Authenticate"| InteractionLayer

    %% ── ETL Pipeline (top-center) ─────────────────────────────
    subgraph ETL["Airflow – ETL Pipeline"]
        RunDAG["Run DAG"]
        Extract["Extract Data"]
        Transform["Transform"]
        Load["Load Data"]
        Trigger1{{"Trigger"}}

        RunDAG --> Extract --> Transform --> Load --> Trigger1
    end

    APIConfig["API's State\nEndpoint / Secret Key"] --> ETL
    ETL --> |"Logs"| LogFiles
    Trigger1 --> |"Database?"| DBCheck{{"DB?"}}
    DBCheck --> |"Yes"| DataLake
    DBCheck --> |"No – Fetch data"| DataLake

    DataLake[("Data Lake /\nWarehouse")]

    %% ── Interaction Layer ─────────────────────────────────────
    subgraph InteractionLayer["Interaction Layer"]
        direction TB
        PipelineCreate["Data Pipeline Creation"]
        MLPipeline["ML / DL Pipeline"]
        ModelDeploy["Model Deployment"]
    end

    PipelineCreate --> |"Format (optional)\nTransform data format"| ETL
    PipelineCreate --> |"Database: hostname,\npassword, dbname"| ETL
    PipelineCreate --> |"Trigger Time"| ETL

    MLPipeline --> ModelSelection["Model Selection"]
    ModelDeploy --> Redeploy["Redeploy"]
    ModelDeploy --> ModelFileSelection["Model File Selection"]

    %% ── ML Training Pipeline (right) ─────────────────────────
    subgraph TRAINING["ML Training Pipeline"]
        direction TB
        Trigger2{{"Trigger"}}
        DataPreprocess["Data Preprocess"]
        ModelTrain["Model Train"]
        Evaluation["Evaluation"]
        TestVal["Test Validation"]

        Trigger2 --> DataPreprocess --> ModelTrain --> TestVal --> Evaluation
    end

    ModelSelection --> |"Model Type"| TRAINING
    ModelSelection --> |"Parameters"| TRAINING
    ModelSelection --> |"Input/Output Features"| TRAINING
    DataLake --> |"Fetch Data"| TRAINING

    Evaluation --> ModelReport["Model Report"]
    Evaluation --> ModelPKL[("Model\n(.pkl) File")]
    TRAINING --> |"Logs"| TrainingLogs[("Model Training\nLogs")]
    ModelPKL --> |"Storing output files"| DataLake

    %% ── Deployment (bottom-center) ────────────────────────────
    ModelFileSelection --> |"Model File (.pkl)"| DeployFlow

    subgraph DeployFlow["Deployment Flow"]
        FastAPI["Create Fast API Server"]
        EC2Deploy["Deploy on AWS EC2"]
        OutputJob["Output – Server Job"]

        FastAPI --> EC2Deploy --> OutputJob
    end

    DeployFlow --> |"Logs"| LogFiles

    %% ── Infrastructure (bottom-left) ──────────────────────────
    subgraph INFRA["Infrastructure (AWS)"]
        Terminal[">_ Terminal\nssh -i print-key clickml@ec2-ip"]
        EC2["EC2 Instance"]
        RDS[("RDS")]
        ClickMLDB[("clickml-database")]

        Terminal --> |"connect@ssh username"| EC2
        EC2 --> |"Insert username\n+ password"| RDS
        RDS --> ClickMLDB
    end

    InteractionLayer --> |"Send Models"| ModelSelection
    ModelPKL --> ModelFileSelection
    STORAGE --> InteractionLayer

    %% ── Styles ────────────────────────────────────────────────
    classDef storage fill:#4a90d9,stroke:#2c5f8a,color:#fff
    classDef process fill:#f9f3d9,stroke:#c8a84b,color:#333
    classDef decision fill:#ffe0b2,stroke:#e65100,color:#333
    classDef infra fill:#e8f5e9,stroke:#388e3c,color:#333
    classDef io fill:#fce4ec,stroke:#c62828,color:#333

    class LogFiles,ModelDB,PlatformDB,UserData,UserDatabase,DataLake,TrainingLogs,ModelPKL,ClickMLDB,RDS storage
    class Extract,Transform,Load,RunDAG,DataPreprocess,ModelTrain,Evaluation,FastAPI,EC2Deploy,ModelSelection process
    class Trigger1,Trigger2,DBCheck decision
    class EC2,Terminal infra
    class ModelReport,OutputJob io
```

---

## Use Cases

| Use Case | Description |
|----------|-------------|
| **Data Pipeline Automation** | Connect to any database and build ETL pipelines without writing Airflow DAGs manually |
| **No-Code Model Training** | Select your dataset, choose an ML/DL algorithm, configure hyperparameters — and train with one click |
| **One-Click Deployment** | Deploy trained `.pkl` models as live FastAPI endpoints on AWS EC2 instantly |
| **Model Monitoring** | Track training logs, evaluation metrics, and model reports in one place |
| **Redeployment** | Swap out model versions and redeploy without touching infrastructure |


> [!TIP]
> For faster training, connect a Data Lake/Warehouse instead of a raw database — it reduces ETL overhead significantly.

## Features

- **ETL Pipeline Builder** — Configure database credentials, set triggers, and run Airflow DAGs through the UI
- **ML/DL Pipeline** — Select model type, input/output features, and parameters visually
- **Model Training** — Automated data preprocessing → training → test validation → evaluation
- **Model Deployment** — Auto-generates a FastAPI server and deploys to AWS EC2
- **Log Viewer** — Real-time logs for ETL runs, training jobs, and deployed servers
- **Model File Management** — Download or redeploy stored `.pkl` model files from S3
- **User Authentication** — Secure sign-up/login with role-based access

## Project Structure
```
ClickML/
├── Frontend/clickml/        # React/Next.js frontend (TypeScript)
├── Backend/                 # Core API server (authentication, pipeline management)
├── ETL-Backend/             # Airflow DAG generator and ETL orchestration
├── ML-Backend/              # Model training, evaluation, and serialization
├── airflow-processor/       # Airflow DAG definitions and processors
└── README.md
```

## Installation & Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL
- Apache Airflow
- AWS account (EC2 + S3 + RDS)

> [!NOTE]
> ClickML requires active AWS credentials to enable model deployment. Without them, training still works locally.

### 1. Clone the Repository
```bash
git clone https://github.com/AnantaXe/ClickML.git
cd ClickML
```

### 2. Frontend Setup
```bash
cd Frontend/clickml
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. ML Backend Setup
```bash
cd ML-Backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 5. ETL Backend + Airflow Setup
```bash
cd ETL-Backend
pip install -r requirements.txt

# Initialize Airflow
airflow db init
airflow webserver --port 8080 &
airflow scheduler &
```

> [!IMPORTANT]
> Make sure all 3 backends (Backend, ML-Backend, ETL-Backend) are running simultaneously for the full platform to work.

### 6. Environment Variables

Create a `.env` file in each service directory:
```env
# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=clickml
DB_USER=your-user
DB_PASSWORD=your-password

# AWS
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
S3_BUCKET=your-bucket

# Airflow
AIRFLOW__CORE__EXECUTOR=LocalExecutor
```

> [!WARNING]
> Do not expose your `.env` file — it contains AWS keys and database credentials. Add it to `.gitignore` before pushing.

## How to Use

### Step 1 — Create an Account
Sign up at the platform URL and log in to access your dashboard.

### Step 2 — Set Up a Data Pipeline
1. Go to **Data Pipeline Creation**
2. Enter your database credentials (hostname, port, database name, password)
3. Configure your data format and transformation rules
4. Set a trigger time or run manually
5. ClickML will auto-generate and deploy an Airflow DAG

### Step 3 — Train a Model
1. Navigate to **ML / DL Pipeline**
2. Select your dataset (from the connected data source or Data Lake)
3. Choose a model type (classification, regression, etc.)
4. Define input/output features and set hyperparameters
5. Click **Train** — the platform handles preprocessing, training, validation, and evaluation

### Step 4 — Deploy Your Model
1. Go to **Model Deployment**
2. Select a trained `.pkl` model file
3. Click **Deploy** — a FastAPI server is spun up on AWS EC2 automatically
4. Copy your live API endpoint and start sending inference requests

### Step 5 — Monitor & Redeploy
- View real-time logs from the **Logs** panel
- Download model reports and evaluation metrics
- Use **Redeploy** to update a running endpoint with a new model version

> [!CAUTION]
> Redeploying a model will **replace** the existing live endpoint. Ensure the new model is validated before redeployment.

> ## Live Demo
> Try the live demo at: **[click-ml-53za.vercel.app](https://click-ml-53za.vercel.app)**

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please open an issue first for major changes to discuss what you'd like to change.
