# Stage 1: Backend
FROM node:16-alpine as backend-builder
WORKDIR /app

# Copy package files from root (where package.json is)
COPY package*.json ./
RUN npm install --only=production

# Copy backend code
COPY Backend/ ./Backend/

# Stage 2: ML Service
FROM python:3.10-slim as ml-builder
WORKDIR /ml
RUN pip install --no-cache-dir flask joblib scikit-learn numpy boto3
COPY Backend/ml_model_api.py Backend/model.pkl Backend/label_encoder.pkl ./

# Final Stage
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies (Nginx + Supervisor)
RUN apt-get update && \
    apt-get install -y nginx supervisor && \
    rm -rf /var/lib/apt/lists/*

# Copy backend
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/Backend ./Backend

# Copy ML service
COPY --from=ml-builder /ml ./ml

# Copy frontend (static files)
COPY FrontENd ./FrontENd

# Copy configs
COPY render-config/nginx.conf /etc/nginx/conf.d/default.conf
COPY render-config/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Set environment variables (AWS, PORT, etc.)
ENV PORT=5000
ENV PYTHONUNBUFFERED=1

# Expose port (Nginx will listen here)
EXPOSE 80

# Start Supervisor
CMD ["/usr/bin/supervisor"]