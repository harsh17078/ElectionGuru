# ============================================
# Stage 1: Build the Vite React frontend
# ============================================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Set Vite env vars for the build
ENV VITE_GOOGLE_MAPS_API_KEY=AIzaSyBpys2MgEbUuVW-WGlluM93zfDKInyvCFQ
ENV VITE_FIREBASE_API_KEY=AIzaSyBHDYh8C1EcuofwXQnBqUfAdSqTaivroWA
ENV VITE_FIREBASE_AUTH_DOMAIN=election-process-42708.firebaseapp.com
ENV VITE_FIREBASE_PROJECT_ID=election-process-42708
ENV VITE_FIREBASE_STORAGE_BUCKET=election-process-42708.firebasestorage.app
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=519346635423
ENV VITE_FIREBASE_APP_ID=1:519346635423:web:116a5b744742a2957998aa

# Copy package files first for better caching
COPY frontend-app/package.json frontend-app/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend-app/ ./
RUN npm run build

# ============================================
# Stage 2: Python FastAPI backend + serve frontend
# ============================================
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY backend/main.py ./
RUN pip install --no-cache-dir fastapi uvicorn python-dotenv google-genai

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/dist ./static

# Expose port (Cloud Run uses PORT env var, default 8080)
ENV PORT=8080

# Run with uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
