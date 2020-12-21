resource "aws_api_gateway_rest_api" "bungie-api-client" {
  name = "bungie-api-client"
}

resource "aws_api_gateway_method" "proxy-root" {
  rest_api_id   = aws_api_gateway_rest_api.bungie-api-client.id
  resource_id   = aws_api_gateway_rest_api.bungie-api-client.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "bungie-api-client" {
  rest_api_id             = aws_api_gateway_rest_api.bungie-api-client.id
  resource_id             = aws_api_gateway_method.proxy-root.resource_id
  http_method             = aws_api_gateway_method.proxy-root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.aws-lambda-function-bungie-api-client-invoke-arn
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.bungie-api-client.id
  parent_id   = aws_api_gateway_rest_api.bungie-api-client.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.bungie-api-client.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.bungie-api-client.id
  resource_id             = aws_api_gateway_method.proxy.resource_id
  http_method             = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.aws-lambda-function-bungie-api-client-invoke-arn
}

resource "aws_api_gateway_deployment" "bungie-api-client_v1" {
  depends_on = [
    aws_api_gateway_integration.bungie-api-client
  ]
  rest_api_id = aws_api_gateway_rest_api.bungie-api-client.id
  stage_name  = "v1"
}

output "endpoint" {
  value = aws_api_gateway_deployment.bungie-api-client_v1.invoke_url
}
