variable "aws-region" {
  description = "AWS region for the infrastructure"
  type = string
  default = "us-east-1"
}

variable "parameter-store-bungie-api-client-arn" {
  description = "Parameter Store for Bungie API Client ARN"
  type = string
}
