resource "aws_lambda_function" "destiny_insights_backend" {
  filename      = var.file_placeholder_output_path
  function_name = "destiny-insights-backend"
  handler       = "index.handler"
  role          = var.destiny_insights_backend_role_arn
  runtime       = "nodejs14.x"
  memory_size   = 1024
  timeout       = 300
}

resource "aws_lambda_function_event_invoke_config" "destiny_insights_backend_event_invoke_config" {
  function_name                = aws_lambda_function.destiny_insights_backend.arn
  maximum_event_age_in_seconds = 60
  maximum_retry_attempts       = 0

  destination_config {
    on_failure {
      destination = var.error_sns_topic
    }
  }
}

resource "aws_lambda_permission" "destiny_insights_backend" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.destiny_insights_backend.arn
  principal     = "apigateway.amazonaws.com"
}

output "destiny_insights_backend_lambda_arn" {
  value = aws_lambda_function.destiny_insights_backend.arn
}

output "destiny_insights_backend_lambda_invoke_arn" {
  value = aws_lambda_function.destiny_insights_backend.invoke_arn
}
