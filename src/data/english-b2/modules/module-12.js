export default {
  id: 12,
  title: 'IT: Cloud и инфраструктура',
  description: 'AWS/Azure/GCP терминология: VPC, IAM, Lambda, EC2, load balancer, auto-scaling',
  lessons: [
    {
      id: 1,
      title: 'Networking: VPC, subnet, security group',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сетевые концепции облачных провайдеров используют специфическую терминологию, которую нужно знать для работы в международных командах.' },
        { type: 'heading', value: 'VPC — Virtual Private Cloud' },
        { type: 'text', value: '"A VPC is an isolated virtual network within the cloud provider\'s infrastructure."\n"We deploy all production workloads within a dedicated VPC."\n"VPC peering allows two VPCs to communicate as if they were on the same network."\n"A VPC spans multiple availability zones within a region."' },
        { type: 'heading', value: 'Subnet' },
        { type: 'text', value: '"A subnet is a range of IP addresses within your VPC."\n"Public subnets have direct access to the internet via an internet gateway."\n"Private subnets are isolated from the internet — they can only communicate outbound via a NAT gateway."\n"Best practice: deploy application servers in private subnets, load balancers in public subnets."' },
        { type: 'heading', value: 'Security Group' },
        { type: 'text', value: '"A security group acts as a virtual firewall, controlling inbound and outbound traffic."\n"Security groups are stateful: if you allow inbound traffic, the response is automatically allowed."\n"We restrict port 5432 (PostgreSQL) to traffic from the application security group only."' },
        { type: 'tip', value: 'Типичный вопрос на infrastructure interview: "Walk me through how you would set up a three-tier architecture in AWS with proper network isolation." Знание VPC, subnets и security groups обязательно.' }
      ]
    },
    {
      id: 2,
      title: 'IAM: Identity and Access Management',
      type: 'theory',
      content: [
        { type: 'text', value: 'IAM — фундаментальная тема для облачной безопасности. В международных командах это обсуждается постоянно.' },
        { type: 'heading', value: 'Core IAM concepts' },
        { type: 'text', value: '"IAM controls who can do what to which resources."\n"Principal: the entity making requests (user, group, role, or service account)."\n"Policy: a JSON document defining allowed or denied actions."\n"Role: an IAM identity with permissions that can be assumed by a principal."' },
        { type: 'heading', value: 'Least privilege principle' },
        { type: 'text', value: '"The principle of least privilege means granting only the permissions required to perform a specific task."\n"We follow the least privilege principle: the Lambda function only has read access to the S3 bucket it needs."\n"Over-permissive IAM policies are one of the most common cloud security mistakes."' },
        { type: 'heading', value: 'IAM в практике' },
        { type: 'text', value: '"We use IAM roles instead of long-lived access keys for EC2 instances."\n"Service accounts in GCP and managed identities in Azure serve the same purpose as IAM roles in AWS."\n"IAM policies can be attached to users, groups, or roles."\n"We use AWS Organizations with Service Control Policies to enforce guardrails across accounts."' },
        { type: 'warning', value: 'Распространённая ошибка: хранить AWS access keys в коде или .env файлах. Правильно: использовать IAM roles для EC2/Lambda, instance profiles, и environment-specific secrets managers.' }
      ]
    },
    {
      id: 3,
      title: 'Compute: EC2, Lambda, containers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вычислительные сервисы облачных провайдеров — основа большинства IT-архитектур.' },
        { type: 'heading', value: 'EC2 — Elastic Compute Cloud' },
        { type: 'text', value: '"EC2 provides resizable virtual servers in the cloud."\n"Instance types: t3.micro for dev/test, c5.4xlarge for compute-intensive workloads."\n"Reserved instances offer up to 72% discount compared to on-demand pricing."\n"Spot instances use spare capacity at up to 90% discount but can be terminated with 2 minutes notice."' },
        { type: 'heading', value: 'Lambda — Serverless Functions' },
        { type: 'text', value: '"Lambda runs code without provisioning or managing servers."\n"You pay only for the compute time consumed — no charge when code is not running."\n"Lambda functions are stateless and scale automatically."\n"Cold start: the latency overhead when a Lambda function is invoked for the first time or after a period of inactivity."\n"Lambda is ideal for event-driven workloads, such as processing S3 events or API requests."' },
        { type: 'heading', value: 'Containers: ECS, EKS' },
        { type: 'text', value: '"ECS (Elastic Container Service) is AWS\'s proprietary container orchestration service."\n"EKS (Elastic Kubernetes Service) is managed Kubernetes on AWS."\n"Fargate eliminates the need to manage underlying EC2 instances for container workloads."' }
      ]
    },
    {
      id: 4,
      title: 'Storage: S3, RDS, DynamoDB, ElastiCache',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хранилища данных в облаке — ключевая часть любой архитектуры.' },
        { type: 'heading', value: 'S3 — Simple Storage Service' },
        { type: 'text', value: '"S3 provides object storage with virtually unlimited capacity."\n"Objects in S3 are organised into buckets."\n"S3 offers different storage classes for cost optimisation: Standard, Infrequent Access, Glacier for archiving."\n"S3 versioning protects against accidental deletions."\n"Pre-signed URLs allow temporary access to private objects."' },
        { type: 'heading', value: 'RDS — Relational Database Service' },
        { type: 'text', value: '"RDS is a managed relational database service supporting PostgreSQL, MySQL, and others."\n"Multi-AZ deployments provide high availability with automatic failover."\n"Read replicas offload read traffic from the primary database."' },
        { type: 'heading', value: 'DynamoDB и ElastiCache' },
        { type: 'text', value: '"DynamoDB is a fully managed NoSQL database with single-digit millisecond latency at any scale."\n"ElastiCache is a managed in-memory caching service supporting Redis and Memcached."\n"We use ElastiCache in front of RDS to reduce database load and improve response times."' }
      ]
    },
    {
      id: 5,
      title: 'Load Balancer и Auto-Scaling',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обеспечение доступности и масштабируемости — core навык для cloud architects.' },
        { type: 'heading', value: 'Load Balancer types in AWS' },
        { type: 'text', value: '"ALB (Application Load Balancer): operates at Layer 7, can route based on URL path or headers."\n"NLB (Network Load Balancer): operates at Layer 4, ultra-high performance, handles millions of requests per second."\n"GLB (Gateway Load Balancer): used for deploying inline network appliances."\n"The ALB target group can contain EC2 instances, ECS tasks, or Lambda functions."' },
        { type: 'heading', value: 'Auto Scaling' },
        { type: 'text', value: '"Auto Scaling adjusts the number of EC2 instances based on demand."\n"Scaling policies: target tracking (maintain a target metric), step scaling (add instances based on alarm thresholds), scheduled scaling."\n"Minimum, maximum, and desired capacity are the three key parameters."\n"Scale-out: adding instances; Scale-in: removing instances."\n"Cooldown period prevents rapid oscillation between scale-out and scale-in actions."' },
        { type: 'tip', value: 'Классический вопрос интервью: "How would you ensure zero-downtime deployments?" Ответ: ALB + Auto Scaling Group + rolling deploys + health checks.' }
      ]
    },
    {
      id: 6,
      title: 'DevOps и CI/CD в облаке',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инфраструктура как код и автоматизация — современный стандарт для облачных команд.' },
        { type: 'heading', value: 'Infrastructure as Code (IaC)' },
        { type: 'text', value: '"Infrastructure as Code means managing and provisioning infrastructure through machine-readable configuration files rather than manual processes."\n"Terraform is the most widely used IaC tool, supporting multiple cloud providers."\n"AWS CloudFormation is AWS-native IaC."\n"IaC provides repeatability, version control, and the ability to review infrastructure changes in code."' },
        { type: 'heading', value: 'CI/CD Pipeline terminology' },
        { type: 'text', value: '"CI (Continuous Integration): automatically building and testing code on every commit."\n"CD (Continuous Delivery): automatically deploying to a staging environment."\n"CD (Continuous Deployment): automatically deploying to production without manual approval."\n"Pipeline stages: Source → Build → Test → Deploy to Staging → Approval → Deploy to Production."' },
        { type: 'heading', value: 'Deployment strategies' },
        { type: 'text', value: '"Blue/Green deployment: two identical environments; traffic switches from Blue (old) to Green (new)."\n"Canary deployment: route a small percentage of traffic to the new version first."\n"Rolling deployment: gradually replace instances with the new version."\n"Feature flags: enable/disable features without redeployment."' }
      ]
    },
    {
      id: 7,
      title: 'Практика: облачная архитектура',
      type: 'practice',
      difficulty: 'hard',
      description: 'Опишите облачную архитектуру для e-commerce платформы, используя правильную терминологию.',
      requirements: [
        'Используйте минимум 12 терминов из модуля',
        'Охватите: compute, storage, networking, security, scaling',
        'Опишите trade-offs выбранных решений'
      ],
      hint: 'Структура: 1) VPC и network setup, 2) Compute layer, 3) Database tier, 4) Caching, 5) Load balancing и auto-scaling, 6) Security.',
      solution: 'For the e-commerce platform, I would design the following AWS architecture:\n\nNetworking: A dedicated VPC spanning three availability zones for high availability. Public subnets host the Application Load Balancer. Application servers and databases reside in private subnets to prevent direct internet exposure. Security groups restrict database access to the application tier only.\n\nCompute: An Auto Scaling Group of EC2 instances (c5.xlarge) behind the ALB handles web traffic. The scaling policy targets 60% CPU utilisation, with a minimum of 2 instances across AZs. For order processing, I\'d use Lambda functions triggered by SQS messages — this handles burst traffic without over-provisioning.\n\nStorage: RDS PostgreSQL in Multi-AZ configuration for product and order data. An S3 bucket with CloudFront CDN for static assets and product images. S3 versioning is enabled for the image bucket.\n\nCaching: ElastiCache Redis cluster for session data and frequently accessed product listings. This reduces RDS load significantly during peak traffic.\n\nSecurity: IAM roles with least-privilege policies for all services. No long-lived access keys. WAF (Web Application Firewall) in front of the ALB to protect against common attacks.\n\nDeployments: Blue/Green deployments via CodeDeploy eliminate downtime. Infrastructure defined in Terraform for reproducibility.',
      explanation: 'Описание облачных архитектур на английском — обязательный навык для cloud engineers и architects. Интервьюеры в западных компаниях ожидают fluent use of this terminology.'
    }
  ]
}
