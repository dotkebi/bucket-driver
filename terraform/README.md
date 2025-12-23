# Driver ECS Terraform Configuration

이 디렉토리는 Driver 프로젝트를 AWS ECS (Fargate)에 배포하기 위한 Terraform 구성을 포함합니다.

## 📋 사전 요구사항

- Terraform >= 1.0
- AWS CLI 설정 완료
- 기존 VPC 및 네트워크 인프라
- Front 프로젝트와 동일한 ALB 사용

## 🏗️ 인프라 구성

### 생성되는 리소스

- **ECR Repository**: Docker 이미지 저장소
- **ECS Cluster**: Fargate 클러스터
- **ECS Service**: Driver 애플리케이션 서비스
- **ECS Task Definition**: 컨테이너 정의 (ARM64/Graviton)
- **CloudWatch Log Group**: 애플리케이션 로그
- **IAM Roles**: ECS Task 실행 및 애플리케이션 권한
- **Security Groups**: ECS Tasks용 보안 그룹
- **Auto Scaling**: CPU/메모리 기반 자동 확장

### 기존 리소스 참조

- **VPC**: 기존 VPC 사용
- **Subnets**: 기존 Private Subnets 사용
- **ALB**: Front 프로젝트와 동일한 ALB 사용
- **Target Group**: Driver용 Target Group (별도 생성 필요)

## 🚀 배포 방법

### 1. 변수 파일 설정

```bash
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` 파일을 열어 다음 값들을 설정:

```hcl
vpc_id                 = "vpc-xxxxx"           # 기존 VPC ID
private_subnet_ids     = ["subnet-xxx", ...]  # Private Subnet IDs
alb_security_group_id  = "sg-xxxxx"            # ALB Security Group ID
target_group_arn       = "arn:aws:..."         # Driver Target Group ARN
```

### 2. Terraform 초기화

```bash
terraform init
```

### 3. 실행 계획 확인

```bash
terraform plan
```

### 4. 인프라 배포

```bash
terraform apply
```

## 📦 Docker 이미지 빌드 및 푸시

### 1. ECR 로그인

```bash
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com
```

### 2. ARM64 이미지 빌드

```bash
cd ../
docker buildx build --platform linux/arm64 -t bucket-prod-driver:latest .
```

### 3. 이미지 태그 및 푸시

```bash
docker tag bucket-prod-driver:latest <ecr-url>:latest
docker push <ecr-url>:latest
```

### 4. ECS 서비스 업데이트

```bash
aws ecs update-service \
  --cluster bucket-prod-driver-cluster \
  --service bucket-prod-driver-service \
  --force-new-deployment \
  --region ap-northeast-2
```

## 🔧 주요 설정

### ECS Task 사양

- **CPU**: 256 (0.25 vCPU)
- **Memory**: 512 MB
- **Platform**: ARM64 (Graviton)
- **Port**: 3002

### Auto Scaling

- **Min**: 1 task
- **Max**: 4 tasks
- **CPU Target**: 70%
- **Memory Target**: 80%

## 📊 모니터링

### CloudWatch Logs

```bash
aws logs tail /ecs/bucket-prod-driver --follow
```

### ECS 서비스 상태

```bash
aws ecs describe-services \
  --cluster bucket-prod-driver-cluster \
  --services bucket-prod-driver-service
```

## 🔄 업데이트 및 롤백

### 새 버전 배포

1. 새 이미지 빌드 및 푸시
2. ECS 서비스 강제 업데이트 (위 명령어 참조)

### 롤백

```bash
# 이전 Task Definition으로 롤백
aws ecs update-service \
  --cluster bucket-prod-driver-cluster \
  --service bucket-prod-driver-service \
  --task-definition bucket-prod-driver-task:<revision>
```

## 🗑️ 리소스 삭제

```bash
terraform destroy
```

**주의**: ECR 리포지토리에 이미지가 있으면 삭제가 실패할 수 있습니다. 먼저 이미지를 삭제하세요.

## 📝 참고사항

- Front 프로젝트와 동일한 ALB를 사용하므로 ALB 리스너 규칙에서 경로 기반 라우팅 설정 필요
- Driver는 포트 3002를 사용하며, ALB에서 `/driver/*` 경로로 라우팅 권장
- ARM64 아키텍처 사용으로 비용 약 20% 절감
- Auto Scaling으로 트래픽에 따라 자동 확장/축소

## 🔗 관련 문서

- [AWS ECS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
