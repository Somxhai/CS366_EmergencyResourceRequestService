terraform {
  backend "s3" {
    bucket = "resource-request-state-414776912688-ap-southeast-7-an"
    key    = "dev/terraform.tfstate"
    region = "ap-southeast-7"
  }
}
