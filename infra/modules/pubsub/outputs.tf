output "topic_arn" {
  value = aws_sns_topic.this.arn
}

output "queues" {
  value = aws_sqs_queue.queues
}
