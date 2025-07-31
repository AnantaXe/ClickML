# Getting Started with ClickML

ClickML is a low-code/no-code MLOps platform that helps you build end-to-end machine learning pipelines through a simple, intuitive interface.

## Installation

### Using pip

```bash
pip install clickml
```

### Using Docker

```bash
git clone https://github.com/AnantaXe/ClickML.git
cd ClickML
docker-compose up
```

### From Source

```bash
git clone https://github.com/AnantaXe/ClickML.git
cd ClickML
pip install -e .
```

## Quick Start

### 1. Start the Server

```bash
clickml server --host 0.0.0.0 --port 8000
```

### 2. Create Your First Pipeline

```python
from clickml.core import Pipeline
from clickml.pipelines import ETLComponent, PreprocessingComponent, TrainingComponent

# Create a new pipeline
pipeline = Pipeline("my_first_pipeline", "A simple ML pipeline")

# Add components
etl = ETLComponent("data_loader", {"source_type": "csv", "source_path": "data.csv"})
preprocessor = PreprocessingComponent("preprocessing", {"scale_features": True})
trainer = TrainingComponent("model_training", {
    "target_column": "target",
    "model_type": "classification",
    "algorithm": "random_forest"
})

pipeline.add_component(etl)
pipeline.add_component(preprocessor)
pipeline.add_component(trainer)

# Execute the pipeline
results = pipeline.execute()
```

### 3. Access the Web Interface

Open your browser and go to `http://localhost:8000` to access the ClickML dashboard.

## Next Steps

- [Learn about Pipelines](pipelines.md)
- [Explore Model Management](models.md)
- [Check out the API Documentation](../api/rest-api.md)