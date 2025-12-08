# README for SHAKE AWS Infrastructure as Code

## Overview
This project is designed to provision and manage AWS infrastructure using Terraform. It includes modules for API Gateway, Lambda functions, Lambda Layers, S3 buckets, and Route 53 DNS management.

## Project Structure
The project is organized into several modules, each responsible for a specific part of the infrastructure:

- **modules/api_gateway**: Contains resources for AWS API Gateway.
- **modules/lambda**: Defines AWS Lambda functions.
- **modules/lambda_layers**: Manages AWS Lambda Layers.
- **modules/s3**: Handles AWS S3 bucket creation and configuration.
- **modules/route53**: Manages Route 53 DNS records and hosted zones.

## Environment Configuration
The project supports multiple environments through variable files located in the `env` directory:

- **dev.tfvars**: Development environment variables.
- **prod.tfvars**: Production environment variables.

## Deployment
To deploy the infrastructure, run the following commands:

1. Initialize Terraform:
   ```
   terraform init
   ```

2. Plan the deployment:
   ```
   terraform plan -var-file=env/dev.tfvars
   ```

3. Apply the changes:
   ```
   terraform apply -var-file=env/dev.tfvars
   ```

Replace `dev.tfvars` with `prod.tfvars` for production deployments.

## Usage
Each module has its own set of input variables and outputs. Refer to the respective `variables.tf` and `outputs.tf` files within each module for details on configuration options and outputs.

## Requirements
- Terraform 1.x or later
- AWS account with appropriate permissions

## License
This project is licensed under the MIT License. See the LICENSE file for more details.