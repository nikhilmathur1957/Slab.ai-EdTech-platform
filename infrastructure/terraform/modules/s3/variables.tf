variable "name_prefix" {
  description = "Prefix for bucket names"
  type        = string
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}
