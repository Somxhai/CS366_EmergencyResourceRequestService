terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    bucket = "resource-request-tf-state"
    key    = "dev/terraform.tfstate"
    region = "ap-southeast-2"
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
}


resource "aws_s3_bucket" "terraform_state" {
  bucket = "resource-request-tf-state"
  region = "ap-southeast-2"
  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = false
  }
}

module "ecr" {
  source = "./ecr"
}

module "lambda" {
  source               = "./lambda"
  create_topic_arn     = module.pubsub.main_topic_arn
  event_topic_arn      = module.pubsub.event_topic_arn
  create_queue_arn     = module.pubsub.create_queue_arn
  create_function_name = "resource-request-inserter"

  db_port     = var.db_port
  db_user     = var.db_user
  db_password = var.db_password
  db_host     = var.db_host
  db_database = var.db_database

  event_sns_topic_arn            = module.pubsub.event_topic_arn
  prioritization_topic_arn       = module.pubsub.to_prioritize_topic_arn
  insert_request_to_db_image_uri = module.ecr.resource_request_inserter_repo_url
}

module "pubsub" {
  source = "./pubsub"
  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }
  topic_name                            = "resource-request"
  event_topic_name                      = "resource-request-event"
  subscriber_account_ids                = ["arn:aws:iam::955468203539:root"]
  to_prioritize_topic_name              = "to-prioritize-service"
  rescue_prioritization_event_topic_arn = "arn:aws:sns:us-east-1:955468203539:rescue-prioritization-events-v1"

  queue_name = "resource-request-create-queue"

}

module "oidc" {
  source = "./oidc"

  github_repo = "https://github.com/Somxhai/CS366_EmergencyResourceRequestService"
}
