resource "aws_lambda_function" "this" {
  function_name = var.name
  role          = aws_iam_role.this.arn
  package_type  = "Zip"
  runtime       = "nodejs22.x"
  handler       = "index.handler"

  filename         = "${path.module}/dummy.zip"  # placeholder for first deploy
  source_code_hash = filebase64sha256("${path.module}/dummy.zip")

  environment {
    variables = {
      DB_HOST                = var.db_host
      DB_USER                = var.db_user
      DB_PASSWORD            = var.db_password
      DB_NAME                = var.db_name
      EVENT_SNS_TOPIC        = var.event_sns_topic
    }
  }
}
