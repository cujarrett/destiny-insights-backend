resource "aws_api_gateway_rest_api" "destiny_insights_backend" {
  name                         = "destiny-insights-backend"
  disable_execute_api_endpoint = true
}

resource "aws_api_gateway_resource" "init" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "init"
}

resource "aws_api_gateway_resource" "authorize" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "authorize"
}

resource "aws_api_gateway_resource" "ada_1" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "ada-1"
}

resource "aws_api_gateway_resource" "banshee_44" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "banshee-44"
}

resource "aws_api_gateway_resource" "commander_zavala" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "commander-zavala"
}

resource "aws_api_gateway_resource" "devrim_kay" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "devrim-kay"
}

resource "aws_api_gateway_resource" "failsafe" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "failsafe"
}

resource "aws_api_gateway_resource" "lord_shaxx" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "lord-shaxx"
}

resource "aws_api_gateway_resource" "the_drifter" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "the-drifter"
}

resource "aws_api_gateway_resource" "xur" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "xur"
}

resource "aws_api_gateway_resource" "mod_data_for_last_year" {
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  parent_id   = aws_api_gateway_rest_api.destiny_insights_backend.root_resource_id
  path_part   = "mod-data-for-last-year"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "init" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.init.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "authorize" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.authorize.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "ada_1" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.ada_1.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "banshee_44" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.banshee_44.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "commander_zavala" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.commander_zavala.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "devrim_kay" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.devrim_kay.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "failsafe" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.failsafe.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "lord_shaxx" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.lord_shaxx.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "the_drifter" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.the_drifter.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "xur" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.xur.id
  http_method   = "GET"
  authorization = "NONE"
}

#           GET
# Internet -----> API Gateway
resource "aws_api_gateway_method" "mod_data_for_last_year" {
  rest_api_id   = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id   = aws_api_gateway_resource.mod_data_for_last_year.id
  http_method   = "GET"
  authorization = "NONE"
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "init" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.init.id
  http_method             = aws_api_gateway_method.init.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "authorize" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.authorize.id
  http_method             = aws_api_gateway_method.authorize.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "ada_1" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.ada_1.id
  http_method             = aws_api_gateway_method.ada_1.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "banshee_44" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.banshee_44.id
  http_method             = aws_api_gateway_method.banshee_44.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "commander_zavala" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.commander_zavala.id
  http_method             = aws_api_gateway_method.commander_zavala.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "devrim_kay" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.devrim_kay.id
  http_method             = aws_api_gateway_method.devrim_kay.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "failsafe" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.failsafe.id
  http_method             = aws_api_gateway_method.failsafe.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "lord_shaxx" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.lord_shaxx.id
  http_method             = aws_api_gateway_method.lord_shaxx.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "the_drifter" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.the_drifter.id
  http_method             = aws_api_gateway_method.the_drifter.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "xur" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.xur.id
  http_method             = aws_api_gateway_method.xur.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

#              POST
# API Gateway ------> Lambda
# For Lambda the method is always POST and the type is always AWS_PROXY.
#
# The date 2015-03-31 in the URI is just the version of AWS Lambda.
resource "aws_api_gateway_integration" "mod_data_for_last_year" {
  rest_api_id             = aws_api_gateway_rest_api.destiny_insights_backend.id
  resource_id             = aws_api_gateway_resource.mod_data_for_last_year.id
  http_method             = aws_api_gateway_method.mod_data_for_last_year.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.destiny_insights_backend_lambda_invoke_arn
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "init" {
  depends_on = [
    aws_api_gateway_integration.init
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "authorize" {
  depends_on = [
    aws_api_gateway_integration.authorize
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "ada_1" {
  depends_on = [
    aws_api_gateway_integration.ada_1
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "banshee_44" {
  depends_on = [
    aws_api_gateway_integration.banshee_44
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "commander_zavala" {
  depends_on = [
    aws_api_gateway_integration.commander_zavala
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "devrim_kay" {
  depends_on = [
    aws_api_gateway_integration.devrim_kay
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "failsafe" {
  depends_on = [
    aws_api_gateway_integration.failsafe
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "lord_shaxx" {
  depends_on = [
    aws_api_gateway_integration.lord_shaxx
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "the_drifter" {
  depends_on = [
    aws_api_gateway_integration.the_drifter
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "xur" {
  depends_on = [
    aws_api_gateway_integration.xur
  ]
  rest_api_id = aws_api_gateway_rest_api.destiny_insights_backend.id
  stage_name  = "v1"
}

# This resource defines the URL of the API Gateway.
resource "aws_api_gateway_deployment" "mod_data_for_last_year" {
  depends_on = [
    aws_api_gateway_integration.mod_data_for_last_year
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
  value = aws_api_gateway_deployment.ada_1.invoke_url
}
