
output "topic_arn" {
  value = aws_sns_topic.main.arn
}

output "event_topic_arn" {
  value = aws_sns_topic.event_topic.arn
}


output "create_queue" {
  value = aws_sqs_queue.create_queue.arn
}
