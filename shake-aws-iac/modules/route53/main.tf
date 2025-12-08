resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name     = "www.${var.domain_name}"
  type     = "A"
  alias {
    name                   = aws_api_gateway_rest_api.main.execution_arn
    zone_id                = aws_api_gateway_rest_api.main.execution_arn
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name     = var.domain_name
  type     = "A"
  alias {
    name                   = aws_api_gateway_rest_api.main.execution_arn
    zone_id                = aws_api_gateway_rest_api.main.execution_arn
    evaluate_target_health = true
  }
}