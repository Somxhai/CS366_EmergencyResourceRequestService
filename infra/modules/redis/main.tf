resource "aws_security_group" "redis_sg" {

  name   = "${var.name}-redis-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port = 6379
    to_port   = 6379
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

resource "aws_elasticache_subnet_group" "this" {

  name       = "${var.name}-redis-subnet"
  subnet_ids = var.subnets
}

resource "aws_elasticache_cluster" "this" {

  cluster_id = var.name

  engine = "redis"

  node_type = var.node_type

  num_cache_nodes = 1

  subnet_group_name = aws_elasticache_subnet_group.this.name

  security_group_ids = [
    aws_security_group.redis_sg.id
  ]
}
