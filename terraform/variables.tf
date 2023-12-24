variable "aws_profile" {
  description = "Name of existing AWS profile in credentials file"
  default = "default"
}

variable "region" {
  description = "AWS region"
  default     = "us-west-1"
}

variable "bucket" {
  description = "Name of the S3 bucket"
  default = "easy-store-bucket"
}

variable "server_iam_policy" {
  description = "IAM policy that grants getObject, putObject, and deleteObject permission on the S3 bucket"
  default = "easy-store-server-iam-policy"
}

variable "server_iam_role" {
  description = "IAM role that grants getObject, putObject, and deleteObject permission on the S3 bucket"
  default = "easy-store-server-iam-user"
}