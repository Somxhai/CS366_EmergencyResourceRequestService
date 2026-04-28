
resource "aws_sns_topic" "main" {
  name = var.topic_name
}

resource "aws_sns_topic" "to_prioritize_topic" {
  name = var.to_prioritize_topic_name
}

resource "aws_sns_topic" "event_topic" {
  name = var.event_topic_name
}

resource "aws_sns_topic_policy" "prioritize_policy" {
  arn = aws_sns_topic.to_prioritize_topic.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowOwnerFullAccess"
        Effect = "Allow"
        Principal = {
          AWS = "*"
        }
        Action = [
          "SNS:Subscribe",
          "SNS:Publish",
          "SNS:Receive"
        ]
        Resource = aws_sns_topic.to_prioritize_topic.arn
        Condition = {
          StringEquals = {
            "AWS:SourceOwner" = "414776912688" # your account
          }
        }
      },
      {
        Sid    = "AllowExternalSubscribe"
        Effect = "Allow"
        Principal = {
          AWS = var.subscriber_account_ids # other team's AWS account IDs
        }
        Action = [
          "SNS:Subscribe",
          "SNS:Receive"
        ]
        Resource = aws_sns_topic.to_prioritize_topic.arn
      }
    ]
  })
}

