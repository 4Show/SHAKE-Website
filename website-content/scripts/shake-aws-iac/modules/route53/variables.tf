variable "domain_name" {
  description = "The domain name for the Route 53 hosted zone."
  type        = string
}

variable "record_name" {
  description = "The name of the DNS record to create."
  type        = string
}

variable "record_type" {
  description = "The type of DNS record (e.g., A, CNAME)."
  type        = string
}

variable "ttl" {
  description = "The time to live for the DNS record."
  type        = number
  default     = 300
}

variable "zone_id" {
  description = "The ID of the Route 53 hosted zone."
  type        = string
}