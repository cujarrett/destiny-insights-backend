resource "aws_dynamodb_table" "destiny_insights_backend_bungie_api_auth" {
  name           = "destiny-insights-backend-bungie-api-auth"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "app"

  attribute {
    name = "app"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

output "destiny_insights_backend_bungie_api_auth_arn" {
  value = aws_dynamodb_table.destiny_insights_backend_bungie_api_auth.arn
}
