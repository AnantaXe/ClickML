# 🚀 ClickML – End-to-End ML Lifecycle Platform 

#### ClickML is a modular, full-stack MLOps platform that converts UI-based workflow actions into executable machine learning jobs.
#### It manages the complete ML lifecycle — from data ingestion and preprocessing to pretraining, fine-tuning, quantization, registry tracking, and deployment.
#### Designed for scalability, reproducibility, and hardware compatibility.

<img width="959" height="446" alt="image" src="https://github.com/user-attachments/assets/c4a4643a-d59c-416c-a8cc-07b38055f10e" />
---

## 📚 Table of Contents
## 📑 Table of Contents

- [🎯 Vision](#-vision)
- [Objectives](#objectives)
- [🧠 Core Capabilities](#-core-capabilities)
- [🏗️ System Architecture](#%EF%B8%8F-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔄 Example Workflow](#-example-workflow-in-clickml)
- [📊 Why ClickML Stands Out](#-why-clickml-stands-out)
- [🔐 Future Roadmap](#-future-roadmap)

  
## 🎯 Vision

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

# 🧠 Core Capabilities

## 1️⃣ Data Governance & ETL Engine
- Structured dataset ingestion
- Data version tracking
- Pipeline-based transformations
- Validation & schema enforcement
- Reproducible preprocessing jobs

- <img width="1917" height="891" alt="image" src="https://github.com/user-attachments/assets/67405880-f876-4bd5-b4b9-ccdc8fac1945" />


## 2️⃣ Model Training Engine
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

## 3️⃣ Deployment Layer
- FastAPI-based inference endpoints
- Containerized model serving
- Production-ready deployment structure

## 4️⃣ Workflow Orchestration
- Airflow-integrated job scheduling
- Modular DAG execution
- Background task management
- Retry & failure handling
<img width="1897" height="893" alt="image" src="https://github.com/user-attachments/assets/fa8b30f6-f456-4e38-826b-c216cea587c9" />

---

# 🏗️ System Architecture

ClickML follows a modular microservice-style structure:

<img width="6261" height="3824" alt="ClickMLPlatform" src="https://github.com/user-attachments/assets/237bff55-c5be-4d23-aeac-85875503a9e7" />



---

# 🛠️ Tech Stack

| Layer              | Technology Used |
|-------------------|----------------|
| Frontend          | TypeScript + React |
| Backend API       | Python + FastAPI |
| Workflow Engine   | Apache Airflow |
| ML Framework      | PyTorch / Scikit-learn |
| Containerization  | Docker |
| Orchestration     | Docker Compose |

---

# ⚙️ Installation & Setup

## 🔹 Prerequisites

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose
- Git

---
## 🔹 Backend Setup
cd Backend

pip install -r requirements.txt

## 🔹 Frontend Setup
cd Frontend/clickml

npm install

npm run dev

## 🔹 Start Full System (Recommended)
docker compose up --build

## 🔄 Example Workflow in ClickML

<img width="4933" height="2942" alt="image" src="https://github.com/user-attachments/assets/f7a13b1c-4d8d-4dcf-a3dd-a5d7f8ec22a1" />

# 📊 Why ClickML Stands Out

- Full ML lifecycle coverage
- Built-in reproducibility
- UI → executable pipeline conversion
- Model lineage tracking
- Registry-driven deployment
- Modular & scalable architecture

# 🔐 Future Roadmap

- RAG pipeline integration

- LLM fine-tuning modules

- Experiment tracking dashboard

- Kubernetes deployment support

- Multi-user workspace system
