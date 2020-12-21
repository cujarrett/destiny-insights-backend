module "archive" {
  source = "./modules/archive"
}

module "iam" {
  source = "./modules/iam"
  parameter-store-bungie-api-client-arn = var.parameter-store-bungie-api-client-arn
}

module "lambda" {
  source = "./modules/lambda"
  data-archive-file-placeholder-output-path = module.archive.data-archive-file-placeholder-output-path
  aws-iam-role-bungie-api-client-arn = module.iam.aws-iam-role-bungie-api-client-arn
}

module "api-gateway" {
  source = "./modules/api-gateway"
  aws-lambda-function-bungie-api-client-arn = module.lambda.aws-lambda-function-bungie-api-client-arn
  aws-lambda-function-bungie-api-client-invoke-arn = module.lambda.aws-lambda-function-bungie-api-client-invoke-arn
}

# Set the generated URL as an output. Run `terraform output url` to get this.
output "endpoint" {
  value = module.api-gateway.endpoint
}
