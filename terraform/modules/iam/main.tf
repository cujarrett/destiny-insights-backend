resource "aws_iam_role" "banshee-44-mods-backend" {
  name               = "banshee-44-mods-backend"
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

resource "aws_iam_policy" "banshee-44-mods-backend-logs" {
  name        = "banshee-44-mods-backend-logs"
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

resource "aws_iam_role_policy_attachment" "attach-logs" {
  role       = aws_iam_role.banshee-44-mods-backend.name
  policy_arn = aws_iam_policy.banshee-44-mods-backend-logs.arn
}

resource "aws_iam_policy" "banshee-44-mods-backend-sns" {
  name        = "banshee-44-mods-backend-sns"
  description = "Adds sns access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sns:Publish",
      "Resource": "${var.error-sns-topic}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach-sns" {
  role       = aws_iam_role.banshee-44-mods-backend.name
  policy_arn = aws_iam_policy.banshee-44-mods-backend-sns.arn
}

resource "aws_iam_policy" "banshee-44-mods-backend-mods" {
  name        = "banshee-44-mods-backend-mods-dynamodb"
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
      "Resource": "${var.banshee-44-mods-backend-mods-table-arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach-banshee-44-mods-backend-mods-dynamodb" {
  role       = aws_iam_role.banshee-44-mods-backend.name
  policy_arn = aws_iam_policy.banshee-44-mods-backend-mods.arn
}

resource "aws_iam_policy" "banshee-44-mods-backend-bungie-api-auth" {
  name        = "banshee-44-mods-backend-bungie-api-auth-dynamodb"
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
      "Resource": "${var.banshee-44-mods-backend-bungie-api-auth-table-arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach-banshee-44-mods-backend-bungie-api-auth-dynamodb" {
  role       = aws_iam_role.banshee-44-mods-backend.name
  policy_arn = aws_iam_policy.banshee-44-mods-backend-bungie-api-auth.arn
}

resource "aws_iam_policy" "banshee-44-mods-backend-last-updated" {
  name        = "banshee-44-mods-backend-last-updated-dynamodb"
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
      "Resource": "${var.banshee-44-mods-backend-last-updated-table-arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach-banshee-44-mods-backend-last-updated-dynamodb" {
  role       = aws_iam_role.banshee-44-mods-backend.name
  policy_arn = aws_iam_policy.banshee-44-mods-backend-last-updated.arn
}

output "banshee-44-mods-backend-role-arn" {
  value = aws_iam_role.banshee-44-mods-backend.arn
}
