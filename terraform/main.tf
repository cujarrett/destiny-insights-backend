module "archive" {
  source = "./modules/archive"
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "iam" {
  source = "./modules/iam"
  error-sns-topic = var.error-sns-topic
  banshee-44-mods-backend-mods-table-arn = module.dynamodb.banshee-44-mods-backend-mods-table-arn
  banshee-44-mods-backend-bungie-api-auth-table-arn = module.dynamodb.banshee-44-mods-backend-bungie-api-auth-table-arn
  banshee-44-mods-backend-last-updated-table-arn = module.dynamodb.banshee-44-mods-backend-last-updated-table-arn
}

module "lambda" {
  source = "./modules/lambda"
  error-sns-topic = var.error-sns-topic
  file-placeholder-output-path = module.archive.file-placeholder-output-path
  banshee-44-mods-backend-role-arn = module.iam.banshee-44-mods-backend-role-arn
}

module "api-gateway" {
  source = "./modules/api-gateway"
  acm-certificate-arn = var.acm-certificate-arn
  banshee-44-mods-backend-lambda-arn = module.lambda.banshee-44-mods-backend-lambda-arn
  banshee-44-mods-backend-lambda-invoke-arn = module.lambda.banshee-44-mods-backend-lambda-invoke-arn
}

# Set the generated URL as an output. Run `terraform output url` to get this.
output "endpoint" {
  value = module.api-gateway.endpoint
}
