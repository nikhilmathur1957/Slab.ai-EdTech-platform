# SSM Secrets Manager Configuration

## Secrets Required for Slab.ai
- /slab-ai/dev/MONGO_URI
- /slab-ai/dev/AWS_ACCESS_KEY_ID
- /slab-ai/dev/AWS_SECRET_ACCESS_KEY  
- /slab-ai/dev/STRIPE_SECRET_KEY
- /slab-ai/dev/JWT_SECRET

## Terraform SSM Configuration

resource "aws_ssm_parameter" "mongo_uri" {
  name  = "/slab-ai/dev/MONGO_URI"
  type  = "SecureString"
  value = var.mongo_uri
}

resource "aws_ssm_parameter" "stripe_secret" {
  name  = "/slab-ai/dev/STRIPE_SECRET_KEY"
  type  = "SecureString"
  value = var.stripe_secret_key
}

## Kubernetes Secret Reference

apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  MONGO_URI: "{{ssm:/slab-ai/dev/MONGO_URI}}"
