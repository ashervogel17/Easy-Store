output "aws_region" {
  value = var.region
}

output "access_key_id" {
  value = aws_iam_access_key.server_iam_key.id
}

output "secret_access_key" {
  value = aws_iam_access_key.server_iam_key.secret
  sensitive = true
}

output "s3_bucket_name" {
  value = var.bucket
}