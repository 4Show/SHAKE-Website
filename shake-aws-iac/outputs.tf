output "api_gateway_endpoint" {
  value = module.api_gateway.api_endpoint
}

output "lambda_function_arn" {
  value = module.lambda.lambda_arn
}

output "lambda_layer_arn" {
  value = module.lambda_layers.layer_arn
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "route53_hosted_zone_id" {
  value = module.route53.hosted_zone_id
}