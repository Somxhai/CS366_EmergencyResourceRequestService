terraform {
  backend "s3" {
    bucket = "resource-request-state-6609611816"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
  }
}
