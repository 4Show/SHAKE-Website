#!/bin/bash

# Navigate to the Terraform configuration directory
cd ../

# Initialize Terraform
terraform init

# Validate the Terraform configuration
terraform validate

# Plan the deployment
terraform plan -var-file="../env/dev.tfvars"

# Apply the deployment
terraform apply -var-file="../env/dev.tfvars" -auto-approve

# Output the results
terraform output