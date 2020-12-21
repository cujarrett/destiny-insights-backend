resource "aws_lambda_function" "bungie-api-client" {
  filename = var.data-archive-file-placeholder-output-path
  function_name = "bungie-api-client"
  handler       = "index.handler"
  role          = var.aws-iam-role-bungie-api-client-arn
  runtime       = "nodejs12.x"
  memory_size   = 256
  timeout       = 300
}

resource "aws_lambda_function_event_invoke_config" "bungie-api-client-event-invoke-config" {
  function_name = aws_lambda_function.bungie-api-client.arn
  maximum_event_age_in_seconds = 60
  maximum_retry_attempts       = 0
}

resource "aws_lambda_permission" "bungie-api-client" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.bungie-api-client.arn
  principal     = "apigateway.amazonaws.com"
}

output "aws-lambda-function-bungie-api-client-arn" {
  value = aws_lambda_function.bungie-api-client.arn
}

output "aws-lambda-function-bungie-api-client-invoke-arn" {
  value = aws_lambda_function.bungie-api-client.invoke_arn
}
