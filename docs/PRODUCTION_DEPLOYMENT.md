# SLAB.AI 2.0 - Production Deployment Guide

##  Production Architecture
- **Frontend**: S3 + CloudFront (CDN)
- **Backend**: EKS (Kubernetes) 
- **Database**: MongoDB Atlas (Recommended)
- **Monitoring**: Prometheus + Grafana

##  Pre-requisites
- AWS Account with appropriate permissions
- MongoDB Atlas cluster
- Docker images built and pushed to ECR
- Terraform installed

##  Deployment Steps

### 1. Build Production Images
```bash
# Build backend
docker build -f backend/Dockerfile.prod -t <account>.dkr.ecr.<region>.amazonaws.com/slab-ai-backend:2.0.0 ./backend

# Build frontend  
docker build -f frontend/Dockerfile.prod -t <account>.dkr.ecr.<region>.amazonaws.com/slab-ai-frontend:2.0.0 ./frontend
