"""Test configuration and utilities"""

import pytest
import os
import tempfile
from clickml.config import Config


@pytest.fixture
def test_config():
    """Create a test configuration"""
    with tempfile.TemporaryDirectory() as temp_dir:
        config = Config()
        config.ml.model_storage_path = os.path.join(temp_dir, "models")
        config.ml.data_storage_path = os.path.join(temp_dir, "data")
        config.debug = True
        yield config


@pytest.fixture
def sample_data():
    """Create sample data for testing"""
    import pandas as pd
    import numpy as np
    
    np.random.seed(42)
    data = pd.DataFrame({
        'feature1': np.random.randn(100),
        'feature2': np.random.randn(100),
        'feature3': np.random.randint(0, 5, 100),
        'target': np.random.randint(0, 2, 100)
    })
    return data