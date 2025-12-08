terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "terraform/state"
    region         = "us-west-2"
    dynamodb_table = "terraform-locks"
  }
}