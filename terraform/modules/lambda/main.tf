resource "aws_lambda_function" "banshee-44-mods-backend" {
  filename = var.file-placeholder-output-path
  function_name = "banshee-44-mods-backend"
  handler       = "index.handler"
  role          = var.banshee-44-mods-backend-role-arn
  runtime       = "nodejs14.x"
  memory_size   = 512
  timeout       = 300
}

resource "aws_lambda_function_event_invoke_config" "banshee-44-mods-backend-event-invoke-config" {
  function_name = aws_lambda_function.banshee-44-mods-backend.arn
  maximum_event_age_in_seconds = 60
  maximum_retry_attempts       = 0

  destination_config {
    on_failure {
      destination = var.error-sns-topic
    }
  }
}

resource "aws_lambda_permission" "banshee-44-mods-backend" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.banshee-44-mods-backend.arn
  principal     = "apigateway.amazonaws.com"
}

output "banshee-44-mods-backend-lambda-arn" {
  value = aws_lambda_function.banshee-44-mods-backend.arn
}

output "banshee-44-mods-backend-lambda-invoke-arn" {
  value = aws_lambda_function.banshee-44-mods-backend.invoke_arn
}
