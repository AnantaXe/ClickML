"""ETL (Extract, Transform, Load) components"""

from typing import Any, Dict
import pandas as pd
from clickml.core.base import BaseComponent


class ETLComponent(BaseComponent):
    """Extract, Transform, Load component for data processing"""
    
    def __init__(self, name: str, config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.source_type = config.get("source_type", "csv") if config else "csv"
        self.source_path = config.get("source_path", "") if config else ""
    
    def extract(self, source_path: str = None) -> pd.DataFrame:
        """Extract data from source"""
        path = source_path or self.source_path
        
        if self.source_type == "csv":
            return pd.read_csv(path)
        elif self.source_type == "json":
            return pd.read_json(path)
        elif self.source_type == "parquet":
            return pd.read_parquet(path)
        else:
            raise ValueError(f"Unsupported source type: {self.source_type}")
    
    def transform(self, data: pd.DataFrame) -> pd.DataFrame:
        """Transform the data"""
        # Basic transformations - can be extended
        transformed_data = data.copy()
        
        # Remove duplicates
        if self.config.get("remove_duplicates", False):
            transformed_data = transformed_data.drop_duplicates()
        
        # Handle missing values
        if self.config.get("fill_na_method"):
            method = self.config["fill_na_method"]
            if method == "mean":
                transformed_data = transformed_data.fillna(transformed_data.mean())
            elif method == "median":
                transformed_data = transformed_data.fillna(transformed_data.median())
            elif method == "forward_fill":
                transformed_data = transformed_data.fillna(method="ffill")
        
        return transformed_data
    
    def load(self, data: pd.DataFrame, destination_path: str) -> None:
        """Load data to destination"""
        file_format = self.config.get("output_format", "csv")
        
        if file_format == "csv":
            data.to_csv(destination_path, index=False)
        elif file_format == "json":
            data.to_json(destination_path, orient="records")
        elif file_format == "parquet":
            data.to_parquet(destination_path)
    
    def execute(self, data: Any = None) -> pd.DataFrame:
        """Execute the ETL process"""
        if data is None:
            # Extract from source
            data = self.extract()
        elif not isinstance(data, pd.DataFrame):
            # Convert to DataFrame if needed
            data = pd.DataFrame(data)
        
        # Transform the data
        transformed_data = self.transform(data)
        
        # Optionally save to destination
        if self.config.get("output_path"):
            self.load(transformed_data, self.config["output_path"])
        
        return transformed_data
    
    def validate(self) -> bool:
        """Validate ETL component configuration"""
        if not self.name:
            return False
        
        if self.source_path and self.source_type not in ["csv", "json", "parquet"]:
            return False
        
        return True