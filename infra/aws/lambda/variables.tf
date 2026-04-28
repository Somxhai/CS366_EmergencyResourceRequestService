variable "create_topic_arn" {
  type = string
}

variable "event_topic_arn" {
  type = string
}

variable "create_queue_arn" {
  type = string
}

variable "create_function_name" {
  type = string
}

variable "insert_request_to_db_image_uri" {
  type = string
}

variable "db_host" {}
variable "db_user" {}
variable "db_password" { sensitive = true }
variable "db_database" {}
variable "db_port" { default = "5432" }
variable "event_sns_topic_arn" {}
variable "prioritization_topic_arn" {}
