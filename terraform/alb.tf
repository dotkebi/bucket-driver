# alb.tf - ALB 설정
# front 프로젝트와 동일한 ALB를 사용하므로 target_group_arn을 변수로 받음
# 별도의 리소스 생성 없이 기존 ALB의 Target Group을 참조
