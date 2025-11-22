variable "name_prefix" {
  description = "Prefix for repository names"
  type        = string
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}
