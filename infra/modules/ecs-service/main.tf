resource "aws_security_group" "ecs_sg" {

  name = "${var.name}-ecs-sg"

  vpc_id = var.vpc_id

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

resource "aws_ecs_service" "this" {

  name = var.name

  cluster = var.cluster

  task_definition = var.task_definition

  desired_count = var.desired_count

  launch_type = "FARGATE"

  network_configuration {

    subnets = var.subnets

    security_groups = [
      aws_security_group.ecs_sg.id
    ]

    assign_public_ip = false
  }
}
