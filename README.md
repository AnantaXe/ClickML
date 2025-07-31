# ClickML - build MLOps workflow (just click, save and use)

ClickML is a low-code/no-code platform that helps MLOps engineers and data teams to create end-to-end ML pipelines — from ETL to model training and deployment — all through a simple, click-based interface.

## Features

-  🎯 Drag-and-drop pipeline builder
-  🔄 ETL pipeline execution (transform, clean, normalize)
-  🤖 Train ML models via dedicated ML backend
-  🚀 Model serialization and deployment (FastAPI endpoints)
-  📊 View logs, metrics, and monitor deployed models
-  🏗️ Modular architecture for easy scaling and team collaboration

## Quick Start

### 1. Install ClickML

```bash
pip install clickml
```

### 2. Start the Server

```bash
clickml server
```

### 3. Access the Platform

Open your browser to `http://localhost:8000` to access the ClickML interface.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/AnantaXe/ClickML.git
cd ClickML

# Run the setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

## Project Structure

```
ClickML/
├── clickml/              # Core ClickML package
│   ├── core/            # Core ML functionality (Pipeline, MLModel)
│   ├── pipelines/       # Pipeline components (ETL, preprocessing, training)
│   ├── config/          # Configuration management
│   └── cli.py          # Command line interface
├── backend/             # FastAPI backend server
│   ├── api/            # REST API endpoints
│   ├── core/           # Backend core functionality
│   └── app.py          # FastAPI application
├── frontend/            # React/Vue frontend (UI)
├── docs/               # Documentation
├── tests/              # Test suites
├── data/               # Data storage
├── models/             # Model storage
└── scripts/            # Utility scripts
```

## Documentation

- [Getting Started Guide](docs/user-guide/getting-started.md)
- [Architecture Overview](docs/developer-guide/architecture.md)
- [API Documentation](docs/api/rest-api.md)

---
