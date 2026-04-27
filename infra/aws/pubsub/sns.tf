
resource "aws_sns_topic" "main" {
  name = var.topic_name
}

resource "aws_sns_topic" "event_topic" {
  name = var.event_topic_name
}

