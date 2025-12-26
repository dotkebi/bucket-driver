# variables.tf - 변수 정의

variable "aws_region" {
  description = "AWS 리전"
  type        = string
  default     = "ap-northeast-2"
}

variable "aws_profile" {
  description = "AWS CLI 프로파일"
  type        = string
  default     = "default"
}

variable "project_name" {
  description = "프로젝트 이름"
  type        = string
  default     = "bucket"
}

variable "environment" {
  description = "환경 (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "tags" {
  description = "추가 태그"
  type        = map(string)
  default     = {}
}

# ECS 설정
variable "task_cpu" {
  description = "ECS Task CPU (256, 512, 1024, 2048, 4096)"
  type        = string
  default     = "256"
}

variable "task_memory" {
  description = "ECS Task 메모리 (MB)"
  type        = string
  default     = "512"
}

variable "desired_count" {
  description = "ECS Service 원하는 태스크 수"
  type        = number
  default     = 1
}

variable "container_port" {
  description = "컨테이너 포트"
  type        = number
  default     = 3002
}

# 네트워크 설정
variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private 서브넷 ID 목록"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "ALB Security Group ID"
  type        = string
}

variable "target_group_arn" {
  description = "기존 ALB Target Group ARN (front와 동일한 ALB 사용)"
  type        = string
}

# Auto Scaling 설정
variable "autoscaling_min_capacity" {
  description = "Auto Scaling 최소 용량"
  type        = number
  default     = 1
}

variable "autoscaling_max_capacity" {
  description = "Auto Scaling 최대 용량"
  type        = number
  default     = 4
}

variable "autoscaling_target_cpu" {
  description = "Auto Scaling CPU 목표 사용률 (%)"
  type        = number
  default     = 70
}

variable "autoscaling_target_memory" {
  description = "Auto Scaling 메모리 목표 사용률 (%)"
  type        = number
  default     = 80
}

# 환경 변수
variable "next_public_api_url" {
  description = "API 서버 URL"
  type        = string
}

variable "nextauth_url" {
  description = "NextAuth URL"
  type        = string
  default     = ""
}

variable "auth_secret" {
  description = "NextAuth Secret"
  type        = string
  sensitive   = true
  default     = ""
}
