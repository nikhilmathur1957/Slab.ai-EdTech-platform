output "web_bucket_id" {
  description = "ID of the web S3 bucket"
  value       = aws_s3_bucket.web.id
}

output "web_bucket_arn" {
  description = "ARN of the web S3 bucket"
  value       = aws_s3_bucket.web.arn
}

output "web_bucket_domain_name" {
  description = "Domain name of the web S3 bucket"
  value       = aws_s3_bucket.web.bucket_domain_name
}

output "assets_bucket_id" {
  description = "ID of the assets S3 bucket"
  value       = aws_s3_bucket.assets.id
}

output "assets_bucket_arn" {
  description = "ARN of the assets S3 bucket"
  value       = aws_s3_bucket.assets.arn
}

output "logs_bucket_id" {
  description = "ID of the logs S3 bucket"
  value       = aws_s3_bucket.logs.id
}

output "logs_bucket_arn" {
  description = "ARN of the logs S3 bucket"
  value       = aws_s3_bucket.logs.arn
}
