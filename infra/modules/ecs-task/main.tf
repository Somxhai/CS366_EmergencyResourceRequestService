resource "aws_ecs_task_definition" "this" {

  family                   = var.name
  requires_compatibilities = ["FARGATE"]

  network_mode = "awsvpc"

  cpu    = var.cpu
  memory = var.memory

  execution_role_arn = var.execution_role

  container_definitions = jsonencode([
    {
      name  = var.name
      image = var.image

      portMappings = [
        {
          containerPort = var.port
        }
      ]

      environment = var.environment
    }
  ])
}
