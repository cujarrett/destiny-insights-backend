resource "aws_dynamodb_table" "banshee-44-mods-backend-mods" {
  name           = "banshee-44-mods-backend-mods"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "timestamp"

  point_in_time_recovery {
    enabled = true
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "mod1"
    type = "S"
  }

  attribute {
    name = "mod2"
    type = "S"
  }

  global_secondary_index {
    name               = "mod1"
    hash_key           = "mod1"
    write_capacity     = 5
    read_capacity      = 5
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "mod2"
    hash_key           = "mod2"
    write_capacity     = 5
    read_capacity      = 5
    projection_type    = "ALL"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "banshee-44-mods-backend-bungie-api-auth" {
  name           = "banshee-44-mods-backend-bungie-api-auth"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "app"

  attribute {
    name = "app"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "banshee-44-mods-backend-last-updated" {
  name           = "banshee-44-mods-backend-last-updated"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "app"

  attribute {
    name = "app"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

output "banshee-44-mods-backend-mods-table-arn" {
  value = aws_dynamodb_table.banshee-44-mods-backend-mods.arn
}

output "banshee-44-mods-backend-bungie-api-auth-table-arn" {
  value = aws_dynamodb_table.banshee-44-mods-backend-bungie-api-auth.arn
}

output "banshee-44-mods-backend-last-updated-table-arn" {
  value = aws_dynamodb_table.banshee-44-mods-backend-last-updated.arn
}
