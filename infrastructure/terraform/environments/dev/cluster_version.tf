variable "cluster_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.34"  # Updated to support any auto-mode features
}
