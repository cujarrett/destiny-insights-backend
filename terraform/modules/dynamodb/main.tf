resource "aws_dynamodb_table" "destiny_insights_backend_mods" {
  name           = "destiny-insights-backend-mods"
  billing_mode   = "PROVISIONED"
  read_capacity  = 15
  write_capacity = 2
  hash_key       = "key"

  point_in_time_recovery {
    enabled = true
  }

  attribute {
    name = "key"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  global_secondary_index {
    name               = "timestamp"
    hash_key           = "timestamp"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "type"
    hash_key           = "type"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "name"
    hash_key           = "name"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "ALL"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "destiny_insights_backend_xur" {
  name           = "destiny-insights-backend-xur"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "key"

  point_in_time_recovery {
    enabled = true
  }

  attribute {
    name = "key"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  global_secondary_index {
    name               = "timestamp"
    hash_key           = "timestamp"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "type"
    hash_key           = "type"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "name"
    hash_key           = "name"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "ALL"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "destiny_insights_backend_vendors_last_updated" {
  name           = "destiny-insights-backend-vendors-last-updated"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "app"

  point_in_time_recovery {
    enabled = true
  }

  attribute {
    name = "app"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

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

output "destiny_insights_backend_mods_arn" {
  value = aws_dynamodb_table.destiny_insights_backend_mods.arn
}

output "destiny_insights_backend_xur_arn" {
  value = aws_dynamodb_table.destiny_insights_backend_xur.arn
}

output "destiny_insights_backend_vendors_last_updated_arn" {
  value = aws_dynamodb_table.destiny_insights_backend_vendors_last_updated.arn
}

output "destiny_insights_backend_bungie_api_auth_arn" {
  value = aws_dynamodb_table.destiny_insights_backend_bungie_api_auth.arn
}
