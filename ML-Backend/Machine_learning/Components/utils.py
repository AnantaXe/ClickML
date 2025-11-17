import os
import sys
import dill
import boto3
import pickle
import psycopg2
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import Preformatted
# from Exception.exception import CustomException
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import r2_score
from datetime import datetime

import tempfile
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from io import StringIO

from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix,
    roc_curve, auc, precision_recall_curve, classification_report,
    mean_absolute_error, mean_squared_error, r2_score
)
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet

def evaluate_model(X_train,y_train,X_test,y_test,model,param):

            gs = GridSearchCV(model,param,cv=3)
            gs.fit(X_train,y_train)

            model.set_params(**gs.best_params_)
            model=model.fit(X_train,y_train)
            
            #Making Predictions
            y_train_pred=model.predict(X_train)
            y_test_pred=model.predict(X_test)

            # report = f"{model.__class__.__name__}:trained_model_score:{train_model_score},test_model_score:{test_model_score}"
            timestamp=datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            output_path = f"Model_Report_{timestamp}.pdf"
            report_path=generate_ml_report(y_true=y_test,y_pred=y_test_pred,report_temp_path=output_path)
            
            return report_path,model
    


def save_object(file_path,obj):
    
        dir_path = os.path.dirname(file_path)

        os.makedirs(dir_path,exist_ok=True)

        with open(file_path,"wb") as file_obj:
            dill.dump(obj,file_obj)
    
def upload_to_s3(model_obj,report_path, bucket_name, s3_directory, filename, region="us-east-1"):
    """
    Serialize a Python object to pickle and upload it to a given S3 directory.
    
    Parameters:
        obj          : Any Python object to pickle.
        bucket_name  : S3 bucket name (str).
        s3_directory : Path inside the bucket, e.g. "models/v1/" (str).
        filename     : Pickle file name to store in S3, e.g. "model.pkl" (str).
        region       : AWS region (default 'us-east-1').
    """
    # Ensure the directory ends with '/'
    if not s3_directory.endswith('/'):
        s3_directory += '/'

    # Create a temporary local file
    local_path = f"/tmp/{filename}"
    save_object(local_path,model_obj)

    # Build S3 key: directory + filename
    s3_key = f"{s3_directory}{filename}"
    s3_key_report=f"{s3_directory}report.pdf"

    # Upload to S3
    load_dotenv()

    access_key= os.getenv("aws_access_key_id")
    secret_access_key=os.getenv("aws_secret_access_key")
    s3 = boto3.client("s3",aws_access_key_id=access_key,aws_secret_access_key=secret_access_key)
    s3.upload_file(local_path, bucket_name, s3_key)
    s3.upload_file(report_path,bucket_name,s3_key_report, ExtraArgs={'ContentType': 'application/pdf'})

    # Optional: remove local temp file
    os.remove(local_path)
    os.remove(report_path)
    model_s3=f"s3://{bucket_name}/{s3_key}"
    report_s3=f"s3://{bucket_name}/{s3_key_report}"

    return model_s3,report_s3
 # Function to fetch data from users postgres database
def fetch_data_postgresql(DBsource:dict):
# --- Connect to PostgreSQL ---
    
    host = DBsource["host"]
    port = DBsource.get("port",5432)
    database = DBsource["database"]
    user = DBsource["user"]
    password = DBsource["password"]
    
    # from table name and selected models will come here
    # --- Read table into DataFrame ---
    features = DBsource["features"]
    targetf = features.get("targetf")
    inputf = features.get("inputf")
    table = DBsource.get("table")
    # Normalize input fields: accept list/tuple or comma-separated string
    if isinstance(inputf, (list, tuple)):
        columns = ", ".join(inputf)
    elif isinstance(inputf, str):
        columns = inputf
    else:
        raise ValueError("inputf must be a list/tuple of column names or a comma-separated string")
    query = f"SELECT {columns}, {targetf} FROM {table};"

    # Use SQLAlchemy engine to avoid pandas DBAPI warning
    conn_str = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    engine = create_engine(conn_str)
    try:
        df = pd.read_sql_query(query, engine)
        # --- Show headers and first few rows ---
        print("Headers:", df.columns.tolist())
    finally:
        engine.dispose()
    
    return df
    return df




def generate_ml_report(y_true, y_pred,report_temp_path, y_prob=None, model_name="ML_Model"):
    """
    Generate a detailed PDF report for any ML model (Classification or Regression)
    Includes metrics, visualizations, and summaries.
    """

    # Detect problem type
    is_classification = len(np.unique(y_true)) < 20 and np.array_equal(np.unique(y_true), np.unique(y_true).astype(int))
    
    tmpdir = tempfile.mkdtemp()
    plots = []
    styles = getSampleStyleSheet()

    # ========== CLASSIFICATION REPORT ==========
    if is_classification:
        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_true, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_true, y_pred)
        
        report_dict = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
        report_df = pd.DataFrame(report_dict).transpose().round(3)

        # Build the table header
        header = f"{'Class':<15}{'Precision':>12}{'Recall':>12}{'F1-Score':>12}{'Support':>10}\n"
        lines = [header, "-" * 65 + "\n"]

        # Add each row neatly formatted
        for cls, row in report_df.iterrows():
            lines.append(
                f"{cls:<15}{row['precision']:>12.3f}{row['recall']:>12.3f}{row['f1-score']:>12.3f}{int(row['support']):>10}\n"
            )

        formatted_report = "".join(lines)
        
        # --- Confusion Matrix ---
        plt.figure(figsize=(6,5))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title("Confusion Matrix")
        plt.xlabel("Predicted")
        plt.ylabel("True")
        cm_path = os.path.join(tmpdir, "confusion_matrix.png")
        plt.tight_layout()
        plt.savefig(cm_path)
        plt.close()
        plots.append(cm_path)

        # --- ROC Curve ---
        if y_prob is not None and len(np.unique(y_true)) == 2:
            fpr, tpr, _ = roc_curve(y_true, y_pred)
            roc_auc = auc(fpr, tpr)
            plt.figure(figsize=(6,5))
            plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
            plt.plot([0, 1], [0, 1], linestyle='--', color='gray')
            plt.title("ROC Curve")
            plt.xlabel("False Positive Rate")
            plt.ylabel("True Positive Rate")
            plt.legend(loc="lower right")
            roc_path = os.path.join(tmpdir, "roc_curve.png")
            plt.tight_layout()
            plt.savefig(roc_path)
            plt.close()
            plots.append(roc_path)

            # --- Precision-Recall Curve ---
            precision, recall, _ = precision_recall_curve(y_true, y_prob)
            plt.figure(figsize=(6,5))
            plt.plot(recall, precision, color='purple')
            plt.title("Precision-Recall Curve")
            plt.xlabel("Recall")
            plt.ylabel("Precision")
            pr_path = os.path.join(tmpdir, "precision_recall_curve.png")
            plt.tight_layout()
            plt.savefig(pr_path)
            plt.close()
            plots.append(pr_path)

        # --- Prediction Distribution ---
        plt.figure(figsize=(6,5))
        sns.histplot(y_pred, kde=True, color='green')
        plt.title("Predicted Label Distribution")
        dist_path = os.path.join(tmpdir, "prediction_distribution.png")
        plt.tight_layout()
        plt.savefig(dist_path)
        plt.close()
        plots.append(dist_path)

        # --- Summary ---
        summary = f"""
        <b>Accuracy:</b> {acc:.4f}<br/>
        <b>Precision:</b> {prec:.4f}<br/>
        <b>Recall:</b> {rec:.4f}<br/>
        <b>F1 Score:</b> {f1:.4f}<br/>
        """

        # --- PDF BUILD ---
        doc = SimpleDocTemplate(report_temp_path, pagesize=A4)
        story = [
            Paragraph(f"<b>Machine Learning Model Report</b>", styles['Title']),
            Spacer(1, 12),
            Paragraph(f"<b>Model Name:</b> {model_name}", styles['Normal']),
            Spacer(1, 12),
            Paragraph(summary, styles['Normal']),
            Spacer(1, 12),
            Paragraph("<b>Classification Report:</b>", styles['Heading2']),
            Spacer(1, 6),
            Preformatted(formatted_report, styles['Code']),
            Spacer(1, 12)
        ]

        for p in plots:
            story.append(Image(p, width=400, height=300))
            story.append(Spacer(1, 12))

        doc.build(story)
        return report_temp_path
    
    # ========== REGRESSION REPORT ==========
    else:
        mae = mean_absolute_error(y_true, y_pred)
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_true, y_pred)

        # --- Scatter Plot (Pred vs Actual) ---
        plt.figure(figsize=(6,5))
        sns.scatterplot(x=y_true, y=y_pred, color='blue', alpha=0.6)
        plt.plot([min(y_true), max(y_true)], [min(y_true), max(y_true)], color='red', linestyle='--')
        plt.xlabel("True Values")
        plt.ylabel("Predicted Values")
        plt.title("Actual vs Predicted")
        scatter_path = os.path.join(tmpdir, "actual_vs_pred.png")
        plt.tight_layout()
        plt.savefig(scatter_path)
        plt.close()
        plots.append(scatter_path)

        # --- Residual Plot ---
        residuals = y_true - y_pred
        plt.figure(figsize=(6,5))
        sns.scatterplot(x=y_pred, y=residuals, alpha=0.6)
        plt.axhline(0, color='red', linestyle='--')
        plt.xlabel("Predicted")
        plt.ylabel("Residuals")
        plt.title("Residual Plot")
        resid_path = os.path.join(tmpdir, "residuals.png")
        plt.tight_layout()
        plt.savefig(resid_path)
        plt.close()
        plots.append(resid_path)

        # --- Distribution of Residuals ---
        plt.figure(figsize=(6,5))
        sns.histplot(residuals, kde=True, color='green')
        plt.title("Distribution of Residuals")
        resid_dist_path = os.path.join(tmpdir, "residual_dist.png")
        plt.tight_layout()
        plt.savefig(resid_dist_path)
        plt.close()
        plots.append(resid_dist_path)

        # --- Error Line Plot ---
        plt.figure(figsize=(6,5))
        plt.plot(y_true[:50], label='True', marker='o')
        plt.plot(y_pred[:50], label='Predicted', marker='x')
        plt.title("True vs Predicted (Sample of 50)")
        plt.legend()
        line_path = os.path.join(tmpdir, "true_vs_pred_line.png")
        plt.tight_layout()
        plt.savefig(line_path)
        plt.close()
        plots.append(line_path)

        # --- Summary ---
        summary = f"""
        <b>Mean Absolute Error (MAE):</b> {mae:.4f}<br/>
        <b>Mean Squared Error (MSE):</b> {mse:.4f}<br/>
        <b>Root Mean Squared Error (RMSE):</b> {rmse:.4f}<br/>
        <b>R² Score:</b> {r2:.4f}<br/>
        """

        # --- PDF BUILD ---
        doc = SimpleDocTemplate(report_temp_path, pagesize=A4)
        story = [
            Paragraph(f"<b>Machine Learning Model Report</b>", styles['Title']),
            Spacer(1, 12),
            Paragraph(f"<b>Model Name:</b> {model_name}", styles['Normal']),
            Spacer(1, 12),
            Paragraph(summary, styles['Normal']),
            Spacer(1, 12),
        ]

        for p in plots:
            story.append(Image(p, width=400, height=300))
            story.append(Spacer(1, 12))

        doc.build(story)
        return report_temp_path
