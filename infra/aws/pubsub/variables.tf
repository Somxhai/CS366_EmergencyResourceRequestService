
variable "topic_name" {
  type = string
}

variable "event_topic_name" {
  type = string
}

variable "to_prioritize_topic_name" {
  type = string
}

variable "rescue_prioritization_event_topic_arn" {
  type = string
}

variable "queue_name" {
  type = string
}

variable "subscriber_account_ids" {
  type = list(string)
}
