resource "aws_ecr_repository" "resource-request-inserter-repo" {
  name = "resource-request-inserter-repo"


  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

