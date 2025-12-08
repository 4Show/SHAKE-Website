variable "api_name" {
  description = "The name of the API Gateway"
  type        = string
}

variable "endpoint_type" {
  description = "The endpoint type for the API Gateway"
  type        = string
  default     = "REGIONAL"
}

variable "lambda_function_arn" {
  description = "The ARN of the Lambda function to integrate with the API Gateway"
  type        = string
}

variable "cors_enabled" {
  description = "Enable CORS for the API Gateway"
  type        = bool
  default     = false
}

variable "cors_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = []
}