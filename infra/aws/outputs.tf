output "topic_arn" {
  value = module.pubsub.main_topic_arn
}

output "event_topic_arn" {
  value = module.pubsub.event_topic_arn
}

output "to_prioritize_topic_arm" {
  value = module.pubsub.to_prioritize_topic_arn
}

output "create_queue_arn" {
  value = module.pubsub.create_queue_arn
}
