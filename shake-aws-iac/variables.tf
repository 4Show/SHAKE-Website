variable "api_gateway_name" {
  description = "The name of the API Gateway"
  type        = string
}

variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "lambda_handler" {
  description = "The handler for the Lambda function"
  type        = string
}

variable "lambda_memory_size" {
  description = "The memory size for the Lambda function"
  type        = number
  default     = 128
}

variable "lambda_timeout" {
  description = "The timeout for the Lambda function in seconds"
  type        = number
  default     = 3
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "route53_domain_name" {
  description = "The domain name for Route 53"
  type        = string
}

variable "route53_record_type" {
  description = "The type of the Route 53 record"
  type        = string
  default     = "A"
}

variable "lambda_layer_name" {
  description = "The name of the Lambda layer"
  type        = string
}

variable "lambda_layer_runtimes" {
  description = "The runtimes compatible with the Lambda layer"
  type        = list(string)
}