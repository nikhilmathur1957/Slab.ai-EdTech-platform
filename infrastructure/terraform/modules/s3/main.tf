# S3 Module for SLAB.AI - Learner Account Compatible

# Web Bucket - private for now
resource "aws_s3_bucket" "web" {
  bucket = "${var.name_prefix}-web"
  tags   = var.tags
}

# Assets Bucket  
resource "aws_s3_bucket" "assets" {
  bucket = "${var.name_prefix}-assets"
  tags   = var.tags
}

# Logs Bucket
resource "aws_s3_bucket" "logs" {
  bucket = "${var.name_prefix}-logs"
  tags   = var.tags
}
