module "archive" {
  source = "./modules/archive"
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "iam" {
  source = "./modules/iam"
  error_sns_topic = var.error_sns_topic
  # destiny_insights_backend_mods_table_arn = module.dynamodb.destiny_insights_backend_mods_table_arn
  # destiny_insights_backend_xur_table_arn = module.dynamodb.destiny_insights_backend_xur_table_arn
  destiny_insights_backend_bungie_api_auth_table_arn = module.dynamodb.destiny_insights_backend_bungie_api_auth_table_arn
}

module "lambda" {
  source = "./modules/lambda"
  error_sns_topic = var.error_sns_topic
  file_placeholder_output_path = module.archive.file_placeholder_output_path
  destiny_insights_backend_role_arn = module.iam.destiny_insights_backend_role_arn
}

module "api_gateway" {
  source = "./modules/api_gateway"
  acm_certificate_arn = var.acm_certificate_arn
  destiny_insights_backend_lambda_arn = module.lambda.destiny_insights_backend_lambda_arn
  destiny_insights_backend_lambda_invoke_arn = module.lambda.destiny_insights_backend_lambda_invoke_arn
}

# Set the generated URL as an output. Run `terraform output url` to get this.
output "endpoint" {
  value = module.api_gateway.endpoint
}
