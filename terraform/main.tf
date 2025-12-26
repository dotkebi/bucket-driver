# main.tf - 프로바이더 및 데이터 소스 설정

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # S3 백엔드 사용 시 주석 해제
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "driver/terraform.tfstate"
  #   region         = "ap-northeast-2"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = merge(
      {
        Project     = var.project_name
        Environment = var.environment
        ManagedBy   = "Terraform"
      },
      var.tags
    )
  }
}

# 현재 AWS 계정 정보
data "aws_caller_identity" "current" {}

# 현재 리전 정보
data "aws_region" "current" {}

locals {
  name_prefix = "${var.project_name}-${var.environment}-driver"
  account_id  = data.aws_caller_identity.current.account_id
  region      = data.aws_region.current.name
}
