# 🏗️ SLAB.AI - Terraform Infrastructure

## Overview
Terraform configuration for deploying SLAB.AI 2.0 to AWS with production-grade architecture.

## Architecture
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ CloudFront │ │ EKS │ │ MongoDB │
│ + S3 │◄──►│ (Backend) │◄──►│ Atlas │
│ (Frontend) │ │ │ │ (Database) │
└─────────────────┘ └──────────────────┘ └─────────────────┘

text


## Prerequisites
- AWS CLI configured with appropriate permissions
- Terraform 1.0+ installed
- kubectl installed
- Docker installed

## Quick Start

### 1. Initialize Terraform

cd infrastructure/terraform/environments/dev

# Initialize Terraform
terraform init

# Plan the infrastructure
terraform plan

# Apply the infrastructure
terraform apply
2. Configure kubectl for EKS

# Update kubeconfig
aws eks update-kubeconfig --region ca-central-1 --name slab-ai-dev

# Verify cluster access
kubectl get nodes
3. Deploy Application

# Apply Kubernetes manifests
kubectl apply -k ../../kubernetes

# Check deployment status
kubectl get all -n slab-ai
Module Structure


modules/
├── vpc/          # VPC, subnets, routing
├── eks/          # EKS cluster, node groups
├── s3/           # S3 buckets (web, assets, logs)
├── ecr/          # ECR repositories
└── cloudfront/   # CDN distribution
Environments
dev - Development environment (current)
staging - Staging environment (future)
prod - Production environment (future)
Outputs
After deployment, you'll get:

EKS cluster endpoint
ECR repository URLs
S3 bucket names
CloudFront distribution URL
kubectl configuration commands
Cost Estimation
EKS: ~$70/month
EC2 instances: ~$50/month
S3: ~$10/month
CloudFront: ~$15/month
Total: ~$145/month
Security Notes
All resources tagged appropriately
Private subnets for EKS nodes
S3 buckets with proper access controls
ECR repositories with image scanning
Troubleshooting
Common Issues
Terraform state lock: Check DynamoDB table
EKS node group failing: Check IAM roles and subnets
CloudFront certificate: Must be in us-east-1 region

Useful Commands
# Destroy infrastructure
terraform destroy

# Import existing resources
terraform import

# View state
terraform state list
terraform show
Next Steps
Set up CI/CD pipeline for ECR pushes
Configure MongoDB Atlas
Set up monitoring (Prometheus/Grafana)
Configure WAF and security groups
