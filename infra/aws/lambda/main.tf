resource "aws_lambda_function" "insert_request_to_db_fn" {
  function_name = var.create_function_name
  role          = aws_iam_role.resource_request_lambda_role.arn
  package_type  = "Image"

  image_uri = "${var.insert_request_to_db_image_uri}:latest"
  timeout   = 15

  environment {
    variables = {
      DB_HOST                  = var.db_host
      DB_USER                  = var.db_user
      DB_PASSWORD              = var.db_password
      DB_DATABASE              = var.db_database
      DB_PORT                  = var.db_port
      EVENT_SNS_TOPIC_ARN      = var.event_sns_topic_arn
      PRIORITIZATION_TOPIC_ARN = var.prioritization_topic_arn
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs" {
  event_source_arn = var.create_queue_arn
  function_name    = aws_lambda_function.insert_request_to_db_fn.arn
  batch_size       = 10

}
