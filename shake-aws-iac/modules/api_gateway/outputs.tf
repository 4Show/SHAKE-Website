output "api_gateway_id" {
  value = aws_api_gateway_rest_api.my_api.id
}

output "api_gateway_endpoint" {
  value = aws_api_gateway_deployment.my_api_deployment.invoke_url
}