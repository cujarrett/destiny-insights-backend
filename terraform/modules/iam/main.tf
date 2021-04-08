resource "aws_iam_role" "destiny_insights_backend" {
  name               = "destiny_insights_backend"
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
  name        = "destiny_insights_backend_logs"
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
  name        = "destiny_insights_backend_sns"
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

resource "aws_iam_policy" "destiny_insights_backend_mods" {
  name        = "destiny_insights_backend_mods_dynamodb"
  description = "Adds DynamoDB access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:PutItem"
      ],
      "Resource": "${var.destiny_insights_backend_mods_table_arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_destiny_insights_backend_mods_dynamodb" {
  role       = aws_iam_role.destiny_insights_backend.name
  policy_arn = aws_iam_policy.destiny_insights_backend_mods.arn
}

resource "aws_iam_policy" "destiny_insights_backend_xur" {
  name        = "destiny_insights_backend_xur_dynamodb"
  description = "Adds DynamoDB access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:PutItem"
      ],
      "Resource": "${var.destiny_insights_backend_xur_table_arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_destiny_insights_backend_xur_dynamodb" {
  role       = aws_iam_role.destiny_insights_backend.name
  policy_arn = aws_iam_policy.destiny_insights_backend_xur.arn
}

resource "aws_iam_policy" "destiny_insights_backend_bungie_api_auth" {
  name        = "destiny_insights_backend_bungie_api_auth_dynamodb"
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
      "Resource": "${var.destiny_insights_backend_bungie_api_auth_table_arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_destiny_insights_backend_bungie_api_auth_dynamodb" {
  role       = aws_iam_role.destiny_insights_backend.name
  policy_arn = aws_iam_policy.destiny_insights_backend_bungie_api_auth.arn
}

output "destiny_insights_backend_role_arn" {
  value = aws_iam_role.destiny_insights_backend.arn
}
