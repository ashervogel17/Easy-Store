provider "aws" {
    region = var.region
    profile = var.aws_profile
}

resource "aws_s3_bucket" "main_bucket" {
  bucket = var.bucket
}

resource "aws_s3_bucket_cors_configuration" "open_get_put" {
  bucket = aws_s3_bucket.main_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "GET"]
    allowed_origins = ["*"]
    expose_headers = []
  }
}

resource "aws_iam_policy" "server_iam_policy" {
  name = var.server_iam_policy
  description = "IAM policy that allows putObject, getObject, and deleteObject on our s3 bucket"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:getObject",
          "s3:DeleteObject",
        ]
        Effect   = "Allow"
        Resource = "${aws_s3_bucket.main_bucket.arn}/*"
      },
    ]
  })
}

resource "aws_iam_user" "easy_upload_iam_user" {
  name = var.server_iam_role
}

resource "aws_iam_user_policy_attachment" "server" {
  user = aws_iam_user.easy_upload_iam_user.name
  policy_arn = aws_iam_policy.server_iam_policy.arn
}

resource "aws_iam_access_key" "server_iam_key" {
  user = aws_iam_user.easy_upload_iam_user.id
}