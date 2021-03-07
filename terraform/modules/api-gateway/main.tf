resource "aws_api_gateway_rest_api" "banshee-44-mods-backend" {
  name                         = "banshee-44-mods-backend"
  disable_execute_api_endpoint = true
}

resource "aws_api_gateway_method" "proxy-root" {
  rest_api_id   = aws_api_gateway_rest_api.banshee-44-mods-backend.id
  resource_id   = aws_api_gateway_rest_api.banshee-44-mods-backend.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "banshee-44-mods-backend" {
  rest_api_id             = aws_api_gateway_rest_api.banshee-44-mods-backend.id
  resource_id             = aws_api_gateway_method.proxy-root.resource_id
  http_method             = aws_api_gateway_method.proxy-root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.banshee-44-mods-backend-lambda-invoke-arn
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.banshee-44-mods-backend.id
  parent_id   = aws_api_gateway_rest_api.banshee-44-mods-backend.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.banshee-44-mods-backend.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.banshee-44-mods-backend.id
  resource_id             = aws_api_gateway_method.proxy.resource_id
  http_method             = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.banshee-44-mods-backend-lambda-invoke-arn
}

resource "aws_api_gateway_deployment" "banshee-44-mods-backend_v1" {
  depends_on = [
    aws_api_gateway_integration.banshee-44-mods-backend
  ]
  rest_api_id = aws_api_gateway_rest_api.banshee-44-mods-backend.id
  stage_name  = "v1"
}

resource "aws_api_gateway_domain_name" "banshee-44-mods-backend" {
  certificate_arn = var.acm-certificate-arn
  security_policy = "TLS_1_2"
  domain_name     = "api.banshee44mods.com"
}

resource "aws_api_gateway_base_path_mapping" "banshee-44-mods-backend" {
  api_id      = aws_api_gateway_rest_api.banshee-44-mods-backend.id
  stage_name  = "v1"
  domain_name = "api.banshee44mods.com"
}

output "endpoint" {
  value = aws_api_gateway_deployment.banshee-44-mods-backend_v1.invoke_url
}
