terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.19.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = local.common_tags
  }
}

# Additional provider for CloudFront certificates (must be in ca_central_1)
provider "aws" {
  alias  = "ca_central_1"
  region = "ca_central_1"
  
  default_tags {
    tags = local.common_tags
  }
}
