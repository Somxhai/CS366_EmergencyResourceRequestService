variable "name" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

variable "node_type" {
  type = string
}

variable "ecs_security_group" {
  type = string
}
