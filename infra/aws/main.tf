terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    bucket = "resource-request-state"
    key    = "dev/terraform.tfstate"
    region = "ap-southeast-7"

  }
}

provider "aws" {
  region = "ap-southeast-7"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "resource-request-state"
  region = "ap-southeast-7"
  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
  }
}

module "pubsub" {
  source = "./pubsub"

  topic_name       = "resource-request"
  event_topic_name = "resource-request-event"

  queue_name = "resource-request-create-queue"

}
