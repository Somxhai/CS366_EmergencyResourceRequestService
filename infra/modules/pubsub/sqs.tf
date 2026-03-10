resource "aws_sqs_queue" "queues" {

  for_each = toset(var.queue_names)

  name = "${var.topic_name}-${each.key}"
}
