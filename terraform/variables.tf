variable "acm_certificate_arn" {
  description = "api.destinyinsights.com ACM ARN"
  type = string
}

variable "destiny_insights_items_arn" {
  description = "destiny_insights_items_arn DynamoDB table ARN"
  type = string
}

variable "aws_region" {
  description = "AWS region for the infrastructure"
  type = string
  default = "us-east-1"
}

variable "error_sns_topic" {
  description = "SNS Topic ARN to trigger on lambda failure"
  type = string
}
