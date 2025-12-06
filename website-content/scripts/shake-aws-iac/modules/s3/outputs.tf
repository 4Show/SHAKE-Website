output "bucket_name" {
  value = aws_s3_bucket.my_bucket.bucket
}

output "bucket_url" {
  value = aws_s3_bucket.my_bucket.website_endpoint
}