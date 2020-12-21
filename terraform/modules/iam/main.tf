resource "aws_iam_role" "bungie-api-client" {
  name               = "bungie-api-client"
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

resource "aws_iam_policy" "bungie-api-client-logs" {
  name        = "bungie-api-client-logs"
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
  role       = aws_iam_role.bungie-api-client.name
  policy_arn = aws_iam_policy.bungie-api-client-logs.arn
}

resource "aws_iam_policy" "bungie-api-client-parameter-store" {
  name        = "bungie-api-client-parameter-store"
  description = "Adds Parameter Store access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParametersByPath",
        "ssm:PutParameter"
      ],
      "Resource": [
        "${var.parameter-store-bungie-api-client-arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach-parameter-store" {
  role       = aws_iam_role.bungie-api-client.name
  policy_arn = aws_iam_policy.bungie-api-client-parameter-store.arn
}

output "aws-iam-role-bungie-api-client-arn" {
  value = aws_iam_role.bungie-api-client.arn
}
