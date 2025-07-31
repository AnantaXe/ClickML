"""Tests for API endpoints"""

import pytest
from fastapi.testclient import TestClient
from backend.app import create_app
from clickml.config import Config


@pytest.fixture
def client():
    """Create test client"""
    config = Config()
    config.debug = True
    app = create_app(config)
    return TestClient(app)


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_health_endpoint(client):
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_api_health_endpoint(client):
    """Test API health endpoint"""
    response = client.get("/api/v1/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_create_pipeline(client):
    """Test pipeline creation via API"""
    response = client.post(
        "/api/v1/pipelines/",
        params={"name": "test_pipeline", "description": "Test pipeline"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "message" in data
    assert "pipeline" in data


def test_list_pipelines(client):
    """Test listing pipelines"""
    # First create a pipeline
    client.post("/api/v1/pipelines/", params={"name": "test_pipeline"})
    
    # Then list pipelines
    response = client.get("/api/v1/pipelines/")
    assert response.status_code == 200
    data = response.json()
    assert "pipelines" in data
    assert len(data["pipelines"]) >= 1


def test_create_model(client):
    """Test model creation via API"""
    response = client.post(
        "/api/v1/models/",
        params={"name": "test_model", "model_type": "classification"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "message" in data
    assert "model" in data


def test_list_models(client):
    """Test listing models"""
    # First create a model
    client.post("/api/v1/models/", params={"name": "test_model", "model_type": "classification"})
    
    # Then list models
    response = client.get("/api/v1/models/")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) >= 1