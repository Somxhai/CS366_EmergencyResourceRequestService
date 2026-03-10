resource "aws_sns_topic_subscription" "subs" {

  for_each = aws_sqs_queue.queues

  topic_arn = aws_sns_topic.this.arn

  protocol = "sqs"

  endpoint = each.value.arn
}
