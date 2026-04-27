output "topic_arn" {
  value = module.pubsub.topic_arn
}

output "event_topic_arn" {
  value = module.pubsub.event_topic_arn
}

output "create_queue_arn" {
  value = module.pubsub.create_queue
}
