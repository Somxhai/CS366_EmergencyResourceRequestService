# For inserter
resource "aws_sqs_queue" "create_queue" {


  name = "${var.topic_name}-create"
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

# subscribe to priotization service for results
resource "aws_sqs_queue" "prioritization_event_queue" {
  name = "${var.topic_name}-consume-prioritization-events"
}

resource "aws_sqs_queue_policy" "prioritization_event_allow_sns" {
  queue_url = aws_sqs_queue.prioritization_event_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "sns.amazonaws.com" }
        Action    = "sqs:SendMessage"
        Resource  = aws_sqs_queue.prioritization_event_queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = var.rescue_prioritization_event_topic_arn
          }
        }
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "prioritization_event_sub" {
  topic_arn  = var.rescue_prioritization_event_topic_arn
  provider   = aws.us_east_1
  protocol   = "sqs"
  endpoint   = aws_sqs_queue.prioritization_event_queue.arn
  depends_on = [aws_sqs_queue_policy.prioritization_event_allow_sns]
}

