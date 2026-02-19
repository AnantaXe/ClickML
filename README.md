<div align="center">

# ClickML
### End-to-End ML Lifecycle Platform
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

ClickML is a modular, full-stack MLOps platform that converts UI-based workflow actions into executable machine learning jobs. It manages the complete ML lifecycle — from data ingestion and preprocessing to pretraining, fine-tuning, quantization, registry tracking, and deployment. Designed for scalability, reproducibility, and hardware compatibility.

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

## Table of Contents

- [System Architecture](#system-architecture)
- [Vision](#vision)
- [Objectives](#objectives)
- [Core Capabilities](#core-capabilities)
- [Example Workflow](#example-workflow-in-clickml)
- [Why ClickML Stands Out](#why-clickml-stands-out)
- [Future Roadmap](#future-roadmap)

# System Architecture

ClickML follows a modular microservice-style structure:


---
## Vision

ClickML simplifies complex ML engineering workflows into structured, traceable pipelines without sacrificing flexibility or control.

It is built for:
- ML Engineers
- AI Researchers
- Data Engineers
- Students building production-grade ML systems

---
# Objectives
- To allow users to create configurable ETL pipelines.
- To automate pipeline scheduling using Apache Airflow.
- To provide a no-code machine learning model creation interface.
- To store processed and raw data in the user’s database.
- To support model training for regression and classification problems.
- To generate pickle files and comprehensive model reports.
- To deploy ML models via API endpoints.
- To create a robust frontend for seamless user interaction.

# Core Capabilities

## Data Governance & ETL Engine
- Structured dataset ingestion
- Data version tracking
- Pipeline-based transformations
- Validation & schema enforcement
- Reproducible preprocessing jobs

- <img width="959" height="446" alt="image" src="https://github.com/user-attachments/assets/c4a4643a-d59c-416c-a8cc-07b38055f10e" />
---
- <img width="1917" height="891" alt="image" src="https://github.com/user-attachments/assets/67405880-f876-4bd5-b4b9-ccdc8fac1945" />


## Model Training Engine

- Pretraining workflows
- Supports Multiple Models:
  - Linear Regression
  - Random Forest Regression
  - Decision Tree Regression
  - Random Forest Classification
  - Decision Tree Classification
- Hyperparameter configuration via UI
- Distributed training support (Docker-ready)
- Training logs & metrics tracking

<img width="1897" height="889" alt="image" src="https://github.com/user-attachments/assets/d327ad76-64f9-44b0-9006-6836475c1824" />

## Deployment Layer
- FastAPI-based inference endpoints
- Containerized model serving
- Production-ready deployment structure

## Workflow Orchestration
- Airflow-integrated job scheduling
- Modular DAG execution
- Background task management
- Retry & failure handling

  
<img width="1897" height="893" alt="image" src="https://github.com/user-attachments/assets/fa8b30f6-f456-4e38-826b-c216cea587c9" />

---

# Why ClickML Stands Out

- Full ML lifecycle coverage
- Built-in reproducibility
- UI → executable pipeline conversion
- Model lineage tracking
- Registry-driven deployment
- Modular & scalable architecture

# Future Roadmap

- RAG pipeline integration

- LLM fine-tuning modules

- Experiment tracking dashboard

- Kubernetes deployment support

- Multi-user workspace system
