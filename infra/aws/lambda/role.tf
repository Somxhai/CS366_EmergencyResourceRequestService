resource "aws_iam_role" "resource_request_lambda_role" {
  name = "resource_request_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "resource_request_lambda_permissions" {
  name = "resource_request_lambda_permissions"
  role = aws_iam_role.resource_request_lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "sns:Publish"
        Effect   = "Allow"
        Resource = [var.create_topic_arn, var.event_topic_arn, var.prioritization_topic_arn]
      },
      {
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Effect   = "Allow"
        Resource = [var.create_queue_arn, var.prioritization_event_queue_arn]
      }
    ]
  })
}
