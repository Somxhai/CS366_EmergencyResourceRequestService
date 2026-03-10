resource "aws_security_group" "db_sg" {

  name   = "${var.name}-db-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"

    security_groups = [
      var.ecs_security_group
    ]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "this" {

  name       = "${var.name}-subnet"
  subnet_ids = var.subnets
}

resource "aws_db_instance" "this" {

  identifier = var.name

  engine = "postgres"

  instance_class = var.instance_class

  allocated_storage = 20

  db_name  = var.db_name
  username = var.username
  password = var.password

  vpc_security_group_ids = [
    aws_security_group.db_sg.id
  ]

  db_subnet_group_name = aws_db_subnet_group.this.name

  skip_final_snapshot = true
}
