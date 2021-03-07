variable "acm-certificate-arn" {
  description = "api.banshee44mods.com ACM ARN"
  type = string
}

variable "aws-region" {
  description = "AWS region for the infrastructure"
  type = string
  default = "us-east-1"
}

variable "error-sns-topic" {
  description = "SNS Topic ARN to trigger on lambda failure"
  type = string
}
