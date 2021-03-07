variable "banshee-44-mods-backend-mods-table-arn" {
  description = "DynamoDB banshee-44-mods-backend-mods table ARN"
  type = string
}

variable "banshee-44-mods-backend-bungie-api-auth-table-arn" {
  description = "DynamoDB banshee-44-mods-backend-bungie-api-auth table ARN"
  type = string
}

variable "banshee-44-mods-backend-last-updated-table-arn" {
  description = "DynamoDB banshee-44-mods-backend-last-updated-table-arn table ARN"
  type = string
}

variable "error-sns-topic" {
  description = "SNS Topic ARN to trigger on lambda failure"
  type = string
}
