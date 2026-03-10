variable "name" {}
variable "image" {}
variable "cpu" {}
variable "memory" {}
variable "port" {}
variable "execution_role" {}

variable "environment" {
  type = list(object({
    name  = string
    value = string
  }))
}
