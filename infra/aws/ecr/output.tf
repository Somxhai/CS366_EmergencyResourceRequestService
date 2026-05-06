output "resource_request_inserter_repo_url" {
  value = aws_ecr_repository.resource-request-inserter-repo.repository_url
}
output "resource_request_inserter_name" {
  value = aws_ecr_repository.resource-request-inserter-repo.name
}
output "resource_request_priority_updater_repo_url" {
  value = aws_ecr_repository.resource-request-priority-update-repo.repository_url
}
output "resource_request_priority_updater_name" {
  value = aws_ecr_repository.resource-request-priority-update-repo.name
}
