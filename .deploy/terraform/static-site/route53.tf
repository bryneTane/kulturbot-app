# .deploy/terraform/static-site/route53.tf
resource "aws_route53_zone" "primary" {
  name = var.domain_name
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name = var.domain_name
  type = "A"
  alias {
    name = aws_cloudfront_distribution.prod_distribution.domain_name
    zone_id = aws_cloudfront_distribution.prod_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.primary.zone_id
}

# resource "aws_route53_record" "cert_validation" {
#   count = length(aws_acm_certificate.cert.domain_validation_options)
#   name = element(aws_acm_certificate.cert.domain_validation_options.*.resource_record_name, count.index)
#   type = element(aws_acm_certificate.cert.domain_validation_options.*.resource_record_type, count.index)
#   zone_id = aws_route53_zone.primary.zone_id
#   records = [element(aws_acm_certificate.cert.domain_validation_options.*.resource_record_value, count.index)]
#   ttl = 60
# }