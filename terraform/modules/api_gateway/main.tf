resource "aws_api_gateway_rest_api" "destiny_insights_backend" {
  name                         = "destiny-insights-backend"
  disable_execute_api_endpoint = true
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "destiny_insights_backend" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_method.proxy_root.resource_id
  http_method             = aws_api_gateway_method.proxy_root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_method.proxy.resource_id
  http_method             = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

resource "aws_api_gateway_deployment" "destiny_insights_backend_v1" {
  depends_on = [
    aws_api_gateway_integration.destiny_insights_backend
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

resource "aws_api_gateway_domain_name" "destiny_insights_backend" {
  certificate_arn = var.acm_certificate_arn
  security_policy = "TLS_1_2"
  domain_name     = "api.destinyinsights.com"
}

resource "aws_api_gateway_base_path_mapping" "destiny_insights_backend" {
  api_id      = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
  domain_name = "api.destinyinsights.com"
}

output "endpoint" {
  value = aws_api_gateway_deployment.destiny_insights_backend_v1.invoke_url
}
