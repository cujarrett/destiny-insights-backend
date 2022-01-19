variable "destiny_insights_backend_lambda_arn" {
  description = "destiny_insights_backend Lambda ARN"
  type        = string
}

variable "destiny_insights_backend_lambda_invoke_arn" {
  description = "destiny_insights_backend Lambda invoke ARN"
  type        = string
}

variable "acm_certificate_arn" {
  description = "api.destinyinsights.com ACM ARN"
  type        = string
}
