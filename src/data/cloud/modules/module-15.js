export default {
  id: 15,
  title: 'GCP Networking',
  description: 'Сетевая инфраструктура GCP: VPC, подсети, firewall rules, Cloud Load Balancing, Cloud CDN, Cloud DNS, Cloud NAT.',
  lessons: [
    {
      id: 1,
      title: 'GCP VPC и подсети',
      type: 'theory',
      content: [
        { type: 'text', value: 'GCP VPC — глобальный ресурс (не привязан к региону, в отличие от AWS). Подсети — региональные. Одна VPC может содержать подсети в разных регионах, что упрощает глобальную архитектуру.' },
        { type: 'heading', value: 'Отличия GCP VPC от AWS VPC' },
        { type: 'list', value: [
          'VPC — глобальный ресурс (одна VPC для всех регионов)',
          'Подсети — региональные (автоматически распределяются по зонам региона)',
          'Auto mode VPC — автоматически создаёт подсети во всех регионах',
          'Custom mode VPC — вы определяете подсети вручную (рекомендуется для prod)',
          'Firewall rules — на уровне VPC, фильтрация по тегам и Service Accounts'
        ] },
        { type: 'code', language: 'bash', value: '# Создание Custom VPC:\ngcloud compute networks create my-vpc \\\n  --subnet-mode=custom\n\n# Создание подсетей:\ngcloud compute networks subnets create web-subnet \\\n  --network=my-vpc \\\n  --region=europe-west1 \\\n  --range=10.0.1.0/24\n\ngcloud compute networks subnets create app-subnet \\\n  --network=my-vpc \\\n  --region=europe-west1 \\\n  --range=10.0.2.0/24\n\ngcloud compute networks subnets create db-subnet \\\n  --network=my-vpc \\\n  --region=europe-west1 \\\n  --range=10.0.3.0/24 \\\n  --enable-private-ip-google-access\n\n# Private Google Access — доступ к GCP API без публичного IP\n# (Cloud Storage, BigQuery и др. из приватной подсети)' },
        { type: 'tip', value: 'Используйте Custom mode VPC для production. Auto mode создаёт подсети во ВСЕХ регионах, что усложняет управление. --enable-private-ip-google-access позволяет VM без внешнего IP обращаться к GCP сервисам.' }
      ]
    },
    {
      id: 2,
      title: 'Firewall Rules',
      type: 'theory',
      content: [
        { type: 'text', value: 'GCP Firewall Rules работают на уровне VPC. В отличие от AWS Security Groups, они поддерживают deny правила и фильтрацию по network tags. Правила применяются по приоритету (чем меньше число, тем выше приоритет).' },
        { type: 'code', language: 'bash', value: '# Разрешить HTTP для VM с тегом http-server:\ngcloud compute firewall-rules create allow-http \\\n  --network=my-vpc \\\n  --allow=tcp:80,tcp:443 \\\n  --source-ranges=0.0.0.0/0 \\\n  --target-tags=http-server \\\n  --priority=1000\n\n# Разрешить SSH только с определённого IP:\ngcloud compute firewall-rules create allow-ssh \\\n  --network=my-vpc \\\n  --allow=tcp:22 \\\n  --source-ranges=203.0.113.0/32 \\\n  --target-tags=ssh-allowed \\\n  --priority=1000\n\n# Разрешить внутренний трафик между подсетями:\ngcloud compute firewall-rules create allow-internal \\\n  --network=my-vpc \\\n  --allow=tcp,udp,icmp \\\n  --source-ranges=10.0.0.0/16 \\\n  --priority=1000\n\n# Deny правило — заблокировать конкретный IP:\ngcloud compute firewall-rules create deny-bad-ip \\\n  --network=my-vpc \\\n  --action=DENY \\\n  --rules=all \\\n  --source-ranges=198.51.100.0/24 \\\n  --priority=500  # Высокий приоритет — проверяется раньше allow\n\n# Фильтрация по Service Account (более безопасно чем теги):\ngcloud compute firewall-rules create allow-app-to-db \\\n  --network=my-vpc \\\n  --allow=tcp:5432 \\\n  --source-service-accounts=app-sa@project.iam.gserviceaccount.com \\\n  --target-service-accounts=db-sa@project.iam.gserviceaccount.com' },
        { type: 'note', value: 'Firewall rules по Service Account надёжнее чем по тегам: теги может добавить любой с правами на VM, а Service Account контролируется IAM. Используйте для межсервисного трафика.' }
      ]
    },
    {
      id: 3,
      title: 'Cloud Load Balancing',
      type: 'theory',
      content: [
        { type: 'text', value: 'GCP Load Balancer — глобальный, работает на уровне Google front-end серверов. Один IP для мульти-региональных бэкендов. Автоматическое масштабирование, SSL termination, Cloud Armor (WAF).' },
        { type: 'heading', value: 'Типы Load Balancer' },
        { type: 'list', value: [
          'Global HTTP(S) LB — L7, глобальный, для веб-приложений. Рекомендуется',
          'Regional HTTP(S) LB — L7, региональный, для внутренних сервисов',
          'TCP/SSL Proxy LB — L4, глобальный, для non-HTTP TCP трафика',
          'Network LB — L4, региональный, высокая производительность',
          'Internal TCP/UDP LB — L4, для внутреннего трафика между сервисами'
        ] },
        { type: 'code', language: 'bash', value: '# HTTP(S) Load Balancer с MIG backend:\n\n# 1. Health Check\ngcloud compute health-checks create http my-hc \\\n  --port=80 --request-path=/health\n\n# 2. Backend Service\ngcloud compute backend-services create my-backend \\\n  --protocol=HTTP --port-name=http \\\n  --health-checks=my-hc --global\n\n# 3. Добавить MIG как backend:\ngcloud compute backend-services add-backend my-backend \\\n  --instance-group=my-mig \\\n  --instance-group-zone=europe-west1-b \\\n  --global\n\n# 4. URL Map (routing):\ngcloud compute url-maps create my-lb --default-service=my-backend\n\n# 5. HTTP Proxy:\ngcloud compute target-http-proxies create my-proxy --url-map=my-lb\n\n# 6. Forwarding Rule (IP):\ngcloud compute forwarding-rules create my-rule \\\n  --global --target-http-proxy=my-proxy --ports=80\n\n# Для HTTPS: добавить SSL сертификат\ngcloud compute ssl-certificates create my-cert \\\n  --domains=myapp.com --global\n\n# Cloud Armor (WAF) — защита от DDoS и SQL injection:\ngcloud compute security-policies create my-policy\ngcloud compute security-policies rules create 1000 \\\n  --security-policy=my-policy \\\n  --expression="evaluatePreconfiguredExpr(\'sqli-v33-stable\')\" \\\n  --action=deny-403' },
        { type: 'tip', value: 'Global HTTP(S) LB использует Google Global Network: запрос от пользователя попадает в ближайший Google POP и доставляется к бэкенду через backbone Google. Это значительно снижает latency по сравнению с обычным интернетом.' }
      ]
    },
    {
      id: 4,
      title: 'Cloud CDN и Cloud DNS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud CDN кэширует контент на edge-серверах Google по всему миру. Cloud DNS — управляемый DNS с 100% SLA. Оба интегрированы с Load Balancer.' },
        { type: 'code', language: 'bash', value: '# Включить Cloud CDN на backend service:\ngcloud compute backend-services update my-backend \\\n  --enable-cdn --global\n\n# Настройка кэширования:\ngcloud compute backend-services update my-backend \\\n  --cache-mode=CACHE_ALL_STATIC \\\n  --default-ttl=3600 \\\n  --max-ttl=86400 \\\n  --global\n\n# Инвалидация кэша:\ngcloud compute url-maps invalidate-cdn-cache my-lb \\\n  --path="/static/*"\n\n# Cloud DNS — создание зоны:\ngcloud dns managed-zones create myapp-zone \\\n  --dns-name=myapp.com \\\n  --description="My app DNS"\n\n# A запись:\ngcloud dns record-sets create myapp.com \\\n  --zone=myapp-zone \\\n  --type=A \\\n  --ttl=300 \\\n  --rrdatas=34.120.1.1\n\n# CNAME запись:\ngcloud dns record-sets create www.myapp.com \\\n  --zone=myapp-zone \\\n  --type=CNAME \\\n  --ttl=300 \\\n  --rrdatas=myapp.com.\n\n# DNS nameservers (настроить у регистратора):\ngcloud dns managed-zones describe myapp-zone \\\n  --format="value(nameServers)"' },
        { type: 'note', value: 'Cloud CDN работает только с Global HTTP(S) Load Balancer. Для статических сайтов используйте GCS + Cloud CDN + LB. Cloud DNS стоит $0.20/зона/мес + $0.40/млн запросов. 100% SLA — самый надёжный DNS.' }
      ]
    },
    {
      id: 5,
      title: 'Cloud NAT и Private Service Connect',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud NAT позволяет VM без внешнего IP выходить в интернет (для загрузки пакетов, обращения к внешним API). Private Service Connect обеспечивает приватное подключение к GCP сервисам и сторонним API.' },
        { type: 'code', language: 'bash', value: '# Cloud NAT:\n# 1. Создать Cloud Router:\ngcloud compute routers create my-router \\\n  --region=europe-west1 --network=my-vpc\n\n# 2. Создать NAT:\ngcloud compute routers nats create my-nat \\\n  --router=my-router \\\n  --region=europe-west1 \\\n  --auto-allocate-nat-external-ips \\\n  --nat-all-subnet-ip-ranges\n\n# Теперь VM без внешнего IP могут выходить в интернет\n# через Cloud NAT (исходящий трафик)\n\n# VPC Peering — соединение двух VPC:\ngcloud compute networks peerings create peer-to-shared \\\n  --network=my-vpc \\\n  --peer-project=shared-services \\\n  --peer-network=shared-vpc\n\n# Shared VPC — одна сеть на несколько проектов:\n# Host project: содержит VPC\n# Service projects: используют подсети host project\ngcloud compute shared-vpc enable HOST_PROJECT_ID\ngcloud compute shared-vpc associated-projects add SERVICE_PROJECT_ID \\\n  --host-project=HOST_PROJECT_ID\n\n# Cloud Interconnect — выделенный канал от on-premise:\n# Dedicated: 10/100 Gbps, прямое подключение к Google POP\n# Partner: через партнёра (от 50 Mbps), проще настроить' },
        { type: 'tip', value: 'Shared VPC — лучшая практика для multi-project организаций. Сетевая команда управляет VPC в host project, а команды разработки используют подсети из своих service projects. Это централизует управление сетью.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: GCP сеть с LB и CDN',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте сетевую инфраструктуру GCP с VPC, Load Balancer и Cloud CDN.',
      requirements: [
        'Создайте Custom VPC с 2 подсетями в разных регионах',
        'Настройте Firewall Rules для HTTP, SSH и внутреннего трафика',
        'Создайте MIG с Instance Template в одном регионе',
        'Настройте Global HTTP(S) Load Balancer с backend на MIG',
        'Включите Cloud CDN на backend service',
        'Настройте Cloud NAT для приватных VM'
      ],
      hint: 'Создайте VPC с --subnet-mode=custom. Для LB нужны: health check, backend service, URL map, target proxy, forwarding rule. Cloud NAT нуждается в Cloud Router.',
      expectedOutput: 'VPC my-vpc создан с подсетями в europe-west1 и us-central1.\nFirewall rules настроены (HTTP, SSH, internal).\nMIG с 2 инстансами создан.\nGlobal HTTP LB: http://34.120.xx.xx работает.\nCloud CDN включён. Cloud NAT настроен.',
      solution: '# VPC + Subnets\ngcloud compute networks create my-vpc --subnet-mode=custom\ngcloud compute networks subnets create eu-subnet --network=my-vpc --region=europe-west1 --range=10.0.1.0/24\ngcloud compute networks subnets create us-subnet --network=my-vpc --region=us-central1 --range=10.1.1.0/24\n\n# Firewall\ngcloud compute firewall-rules create allow-http --network=my-vpc --allow=tcp:80,tcp:443 --source-ranges=0.0.0.0/0 --target-tags=http-server\ngcloud compute firewall-rules create allow-ssh --network=my-vpc --allow=tcp:22 --source-ranges=0.0.0.0/0 --target-tags=ssh\ngcloud compute firewall-rules create allow-internal --network=my-vpc --allow=tcp,udp,icmp --source-ranges=10.0.0.0/8\n\n# MIG\ngcloud compute instance-templates create web-tmpl --machine-type=e2-small --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud --tags=http-server --network=my-vpc --subnet=eu-subnet --metadata=startup-script="apt-get update && apt-get install -y nginx"\ngcloud compute instance-groups managed create web-mig --template=web-tmpl --size=2 --zone=europe-west1-b\ngcloud compute instance-groups managed set-named-ports web-mig --zone=europe-west1-b --named-ports=http:80\n\n# LB\ngcloud compute health-checks create http web-hc --port=80\ngcloud compute backend-services create web-backend --protocol=HTTP --port-name=http --health-checks=web-hc --enable-cdn --global\ngcloud compute backend-services add-backend web-backend --instance-group=web-mig --instance-group-zone=europe-west1-b --global\ngcloud compute url-maps create web-lb --default-service=web-backend\ngcloud compute target-http-proxies create web-proxy --url-map=web-lb\ngcloud compute forwarding-rules create web-rule --global --target-http-proxy=web-proxy --ports=80\n\n# Cloud NAT\ngcloud compute routers create my-router --region=europe-west1 --network=my-vpc\ngcloud compute routers nats create my-nat --router=my-router --region=europe-west1 --auto-allocate-nat-external-ips --nat-all-subnet-ip-ranges',
      explanation: 'GCP Global LB распределяет трафик по бэкендам в разных регионах через Google backbone. Cloud CDN кэширует контент на edge. Cloud NAT обеспечивает исходящий интернет для приватных VM. Эта архитектура обеспечивает низкую задержку и высокую доступность.'
    }
  ]
}
