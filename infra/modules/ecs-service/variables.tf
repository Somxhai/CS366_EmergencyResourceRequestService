variable "vpc_id" {
  type = string
}

variable "name" {
  type = string
}

variable "cluster" {
  type = string
}

variable "task_definition" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "desired_count" {
  type = number
}

