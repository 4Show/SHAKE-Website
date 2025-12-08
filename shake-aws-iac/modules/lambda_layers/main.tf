resource "aws_lambda_layer_version" "example" {
  layer_name = var.layer_name
  compatible_runtimes = var.compatible_runtimes
  s3_bucket = var.s3_bucket
  s3_key = var.s3_key

  lifecycle {
    create_before_destroy = true
  }
}

output "layer_arn" {
  value = aws_lambda_layer_version.example.arn
}