# Stage 1: Build frontend assets (if needed)
FROM node:16-alpine as frontend-builder
WORKDIR /frontend
COPY FrontENd/package.json FrontENd/package-lock.json ./
RUN npm install
COPY FrontENd .
# Add build step here if your frontend needs compilation

# Stage 2: Prepare backend
FROM node:16-alpine as backend-builder
WORKDIR /backend
COPY package*.json ./
RUN npm install --only=production
COPY Backend .

# Stage 3: Prepare ML service
FROM python:3.10-slim as ml-builder
WORKDIR /ml
RUN pip install --no-cache-dir flask joblib scikit-learn numpy boto3
COPY Backend/ml_model_api.py Backend/model.pkl Backend/label_encoder.pkl ./

# Final image
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y nginx supervisor && \
    rm -rf /var/lib/apt/lists/*

# Copy frontend
COPY --from=frontend-builder /frontend /app/frontend

# Copy backend
COPY --from=backend-builder /backend /app/backend

# Copy ML service
COPY --from=ml-builder /ml /app/ml

# Copy configuration files
COPY render-config/nginx.conf /etc/nginx/conf.d/default.conf
COPY render-config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port (Render will use this)
EXPOSE 80

# Health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start supervisor
CMD ["/usr/bin/supervisord"]