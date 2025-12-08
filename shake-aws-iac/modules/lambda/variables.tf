variable "function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "handler" {
  description = "The function entry point in your code"
  type        = string
}

variable "runtime" {
  description = "The runtime environment for the Lambda function"
  type        = string
}

variable "memory_size" {
  description = "The amount of memory available to the function"
  type        = number
  default     = 128
}

variable "timeout" {
  description = "The amount of time that Lambda allows a function to run before stopping it"
  type        = number
  default     = 3
}

variable "role_arn" {
  description = "The ARN of the IAM role that Lambda assumes when it executes the function"
  type        = string
}