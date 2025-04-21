# DockerFolder/Dockerfile.ml

FROM python:3.10-slim  
WORKDIR /app

# ✅ Install Python dependencies directly
RUN pip install flask joblib scikit-learn numpy

# ✅ Copy the ML service code and model files
COPY Backend/ml_model_api.py /app/
COPY Backend/model.pkl /app/
COPY Backend/label_encoder.pkl /app/

# ✅ Optional: if additional files are needed, copy them here

EXPOSE 5001  
ENV PYTHONUNBUFFERED=1

# ✅ Ensure the app binds to 0.0.0.0 inside container (check ml_model_api.py too!)
CMD ["python", "ml_model_api.py"]
