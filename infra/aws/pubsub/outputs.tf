
output "main_topic_arn" {
  value = aws_sns_topic.main.arn
}

output "event_topic_arn" {
  value = aws_sns_topic.event_topic.arn
}

output "to_prioritize_topic_arn" {
  value = aws_sns_topic.to_prioritize_topic.arn
}

output "create_queue_arn" {
  value = aws_sqs_queue.create_queue.arn
}
