variable "layer_name" {
  description = "The name of the Lambda layer."
  type        = string
}

variable "compatible_runtimes" {
  description = "A list of runtimes that the layer is compatible with."
  type        = list(string)
}

variable "layer_description" {
  description = "A description of the Lambda layer."
  type        = string
  default     = ""
}

variable "layer_content" {
  description = "The S3 bucket and key for the layer content."
  type        = map(string)
}