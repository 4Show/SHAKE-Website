output "hosted_zone_id" {
  value = aws_route53_zone.main.id
}

output "hosted_zone_name" {
  value = aws_route53_zone.main.name
}

output "record_set_fqdn" {
  value = aws_route53_record.main.fqdn
}