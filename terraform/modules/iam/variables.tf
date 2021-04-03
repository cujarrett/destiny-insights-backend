variable "destiny_insights_backend_mods_table_arn" {
  description = "DynamoDB destiny_insights_backend_mods table ARN"
  type = string
}

variable "destiny_insights_backend_bungie_api_auth_table_arn" {
  description = "DynamoDB destiny_insights_backend_bungie_api_auth table ARN"
  type = string
}

variable "destiny_insights_backend_last_updated_table_arn" {
  description = "DynamoDB destiny_insights_backend_last_updated_table_arn table ARN"
  type = string
}

variable "error_sns_topic" {
  description = "SNS Topic ARN to trigger on lambda failure"
  type = string
}
