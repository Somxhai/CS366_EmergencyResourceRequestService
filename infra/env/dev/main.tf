module "network" {

  source = "../../modules/network"

  name = "dev"

  cidr = "10.0.0.0/16"

  azs = [
    "us-east-1a",
    "us-east-1b"
  ]

  public_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  private_subnets = [
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]
}

module "ecs_cluster" {
  source = "../../modules/ecs-cluster"

  name = "dev-cluster"
}

module "ecr" {
  source = "../../modules/ecr"

  name = "resource-request-registry"
}

# module "task" {
#   source = "../../modules/ecs-task"
#
#   name  = "api"
#   image = "123456.dkr.ecr.ap-southeast-1.amazonaws.com/api:latest"
#
#   cpu    = 256
#   memory = 512
#
#   port = 3000
#
#   execution_role = var.execution_role
#
#   environment = [
#     {
#       name  = "DATABASE_URL"
#       value = module.rds.endpoint
#     }
#   ]
# }
#
# module "service" {
#
#   source = "../../modules/ecs-service"
#   vpc_id = module.network.vpc_id
#   name   = "api"
#
#   cluster = module.ecs_cluster.cluster_id
#
#   task_definition = module.task.arn
#
#   desired_count = 2
#
#   subnets = module.network.private_subnets
#
# }

module "rds" {

  source = "../../modules/rds"

  name = "dev-postgres"

  vpc_id = module.network.vpc_id

  subnets = module.network.private_subnets

  instance_class = "db.t3.micro"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  ecs_security_group = aws_security_group.ecs_sg.id
}

module "redis" {

  source = "../../modules/redis"

  name = "dev-redis"

  vpc_id = module.network.vpc_id

  subnets = module.network.private_subnets

  node_type = "cache.t3.micro"

  ecs_security_group = aws_security_group.ecs_sg.id
}

module "pubsub" {

  source = "../../modules/pubsub"

  topic_name = "reservation-events"

  queue_names = [
    "email",
    "analytics",
    "notifications"
  ]
}

resource "aws_security_group" "ecs_sg" {

  name = "ecs-sg"

  vpc_id = module.network.vpc_id

  ingress {
    from_port = 3000
    to_port   = 3000
    protocol  = "tcp"

    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = ["0.0.0.0/0"]
  }
}
