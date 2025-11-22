# SLAB.AI Dev Environment
# Integrates all infrastructure modules

module "vpc" {
  source = "../../modules/vpc"

  name_prefix          = "${local.name_prefix}-dev"
  vpc_cidr            = var.vpc_cidr
  azs                 = slice(data.aws_availability_zones.available.names, 0, 2)
  enable_nat_gateway  = var.enable_nat_gateway
  tags                = local.common_tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name    = "${local.name_prefix}-dev"
  cluster_version = var.eks_cluster_version
  subnet_ids      = module.vpc.private_subnet_ids
  instance_types  = var.eks_instance_types
  desired_size    = 2
  min_size        = 1
  max_size        = 3
  tags            = local.common_tags
}

module "s3" {
  source = "../../modules/s3"

  name_prefix = "${local.name_prefix}-dev"
  tags        = local.common_tags
}

module "ecr" {
  source = "../../modules/ecr"

  name_prefix = "${local.name_prefix}-dev"
  tags        = local.common_tags
}

# CloudFront commented out due to learner account restrictions
# module "cloudfront" {
#   source = "../../modules/cloudfront"
#   name_prefix             = "${local.name_prefix}-dev"
#   domain_name             = var.domain_name
#   s3_bucket_domain_name   = module.s3.web_bucket_domain_name
#   tags                    = local.common_tags
# }

# Additional resources for the dev environment

# ECR Repository for MongoDB (if needed)
resource "aws_ecr_repository" "mongodb" {
  name = "${local.name_prefix}-dev-mongodb"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

# IAM Role for EKS cluster access
resource "aws_iam_role" "eks_admin" {
  name = "${local.name_prefix}-dev-eks-admin"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "eks_admin" {
  role       = aws_iam_role.eks_admin.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}
