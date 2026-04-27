
resource "aws_sqs_queue" "create_queue" {


  name = "${var.topic_name}-${var.queue_name}"
}

resource "aws_sqs_queue_policy" "allow_sns" {
  queue_url = aws_sqs_queue.create_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.create_queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.main.arn
          }
        }
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "create_queue_sub" {

  topic_arn = aws_sns_topic.main.arn

  protocol = "sqs"

  depends_on = [aws_sqs_queue_policy.allow_sns]
  endpoint   = aws_sqs_queue.create_queue.arn
}

