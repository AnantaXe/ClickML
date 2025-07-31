"""Tests for core pipeline functionality"""

import pytest
import pandas as pd
from clickml.core import Pipeline, MLModel
from clickml.pipelines import ETLComponent, PreprocessingComponent, TrainingComponent


def test_pipeline_creation():
    """Test pipeline creation"""
    pipeline = Pipeline("test_pipeline", "Test pipeline description")
    assert pipeline.name == "test_pipeline"
    assert pipeline.description == "Test pipeline description"
    assert pipeline.status == "draft"
    assert len(pipeline.components) == 0


def test_pipeline_add_component():
    """Test adding components to pipeline"""
    pipeline = Pipeline("test_pipeline")
    
    etl_component = ETLComponent("etl_step", {"source_type": "csv"})
    pipeline.add_component(etl_component)
    
    assert len(pipeline.components) == 1
    assert pipeline.components[0].name == "etl_step"


def test_pipeline_validation_empty():
    """Test pipeline validation with no components"""
    pipeline = Pipeline("test_pipeline")
    assert not pipeline.validate()


def test_pipeline_validation_with_components():
    """Test pipeline validation with valid components"""
    pipeline = Pipeline("test_pipeline")
    
    etl_component = ETLComponent("etl_step", {"source_type": "csv"})
    pipeline.add_component(etl_component)
    
    assert pipeline.validate()


def test_etl_component():
    """Test ETL component"""
    config = {
        "source_type": "csv",
        "remove_duplicates": True,
        "fill_na_method": "mean"
    }
    etl = ETLComponent("etl_test", config)
    
    # Test with sample data
    sample_data = pd.DataFrame({
        'A': [1, 2, 2, 4, None],
        'B': [1, 2, 3, 4, 5]
    })
    
    result = etl.transform(sample_data)
    
    # Check that duplicates were removed and NaN was filled
    assert len(result) <= len(sample_data)
    assert not result.isnull().any().any()


def test_preprocessing_component(sample_data):
    """Test preprocessing component"""
    config = {
        "scale_features": True,
        "encode_categorical": True
    }
    preprocessor = PreprocessingComponent("preprocess_test", config)
    
    result = preprocessor.execute(sample_data)
    
    assert isinstance(result, pd.DataFrame)
    assert len(result) == len(sample_data)


def test_training_component(sample_data):
    """Test training component"""
    config = {
        "target_column": "target",
        "model_type": "classification",
        "algorithm": "logistic_regression",
        "test_size": 0.2
    }
    trainer = TrainingComponent("train_test", config)
    
    model = trainer.execute(sample_data)
    
    assert isinstance(model, MLModel)
    assert model.is_trained
    assert "train" in model.metrics
    assert "test" in model.metrics