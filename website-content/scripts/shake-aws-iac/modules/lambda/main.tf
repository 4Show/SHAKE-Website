resource "aws_lambda_function" "my_lambda" {
  function_name = var.function_name
  handler       = var.handler
  runtime       = var.runtime
  role          = aws_iam_role.lambda_exec.arn
  memory_size   = var.memory_size
  timeout       = var.timeout

  source_code_hash = filebase64sha256(var.source_code_path)

  environment {
    variables = var.environment_variables
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.function_name}_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_logs" {
  name       = "${var.function_name}_logs"
  roles      = [aws_iam_role.lambda_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_layer_version" "my_layer" {
  layer_name = var.layer_name
  compatible_runtimes = var.compatible_runtimes
  filename = var.layer_zip_path
}

output "lambda_function_arn" {
  value = aws_lambda_function.my_lambda.arn
}

output "lambda_layer_arn" {
  value = aws_lambda_layer_version.my_layer.arn
}