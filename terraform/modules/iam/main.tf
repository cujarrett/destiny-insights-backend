resource "aws_iam_role" "destiny_insights_backend" {
  name               = "destiny-insights-backend"
  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": {
    "Action": "sts:AssumeRole",
    "Principal": {
      "Service": "lambda.amazonaws.com"
    },
    "Effect": "Allow"
  }
}
POLICY
}

resource "aws_iam_policy" "destiny_insights_backend_logs" {
  name        = "destiny-insights-backend-logs"
  description = "Adds logging access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_logs" {
  role       = aws_iam_role.destiny_insights_backend.name
  policy_arn = aws_iam_policy.destiny_insights_backend_logs.arn
}

resource "aws_iam_policy" "destiny_insights_backend_sns" {
  name        = "destiny-insights-backend-sns"
  description = "Adds sns access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sns:Publish",
      "Resource": "${var.error_sns_topic}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_sns" {
  role       = aws_iam_role.destiny_insights_backend.name
  policy_arn = aws_iam_policy.destiny_insights_backend_sns.arn
}

resource "aws_iam_policy" "destiny_insights_backend_bungie_api_auth" {
  name        = "destiny-insights-backend-bungie-api-auth-dynamodb"
  description = "Adds DynamoDB access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:UpdateItem"
      ],
      "Resource": "${var.destiny_insights_backend_bungie_api_auth_arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_destiny_insights_backend_bungie_api_auth_dynamodb" {
  role       = aws_iam_role.destiny_insights_backend.name
  policy_arn = aws_iam_policy.destiny_insights_backend_bungie_api_auth.arn
}

resource "aws_iam_policy" "destiny_insights_items" {
  name        = "destiny-insights-backend-items-dynamodb"
  description = "Adds DynamoDB access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan"
      ],
      "Resource": "${var.destiny_insights_items_arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_destiny_insights_items_dynamodb" {
  role       = aws_iam_role.destiny_insights_backend.name
  policy_arn = aws_iam_policy.destiny_insights_items.arn
}

output "destiny_insights_backend_role_arn" {
  value = aws_iam_role.destiny_insights_backend.arn
}
