export default {
  id: 8,
  title: 'Service Discovery',
  description: 'Обнаружение сервисов в динамической среде: Consul, Eureka, DNS-based discovery, client-side и server-side load balancing.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен Service Discovery',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисной архитектуре сервисы динамически создаются и уничтожаются. IP-адреса меняются при каждом деплое. Service Discovery — механизм автоматического обнаружения адресов сервисов.' },
        { type: 'code', language: 'bash', value: '# Проблема: адреса сервисов меняются\n# order-service нужен user-service\n# Вчера:  user-service на 10.0.1.5:8081\n# Сегодня: user-service на 10.0.2.8:8081 (после деплоя)\n# Завтра:  user-service на 10.0.1.5:8081 и 10.0.3.2:8081 (масштабирование)\n\n# Решение: Service Registry\n# 1. Сервис стартует -> регистрируется в Registry\n# 2. Клиент спрашивает Registry: "Где user-service?"\n# 3. Registry отвечает: "10.0.2.8:8081, 10.0.3.2:8081"\n# 4. Клиент выбирает один адрес (load balancing)\n\n# Два подхода:\n# Client-Side Discovery:\n# [Client] -> запрос к Registry -> получил адреса -> вызов сервиса\n# Примеры: Eureka + Spring Cloud LoadBalancer\n\n# Server-Side Discovery:\n# [Client] -> запрос к Load Balancer -> LB спрашивает Registry -> вызов сервиса\n# Примеры: Kubernetes Service, AWS ALB + Cloud Map' },
        { type: 'tip', value: 'В Kubernetes Service Discovery встроен: каждый Service получает DNS-имя (user-service.default.svc.cluster.local). Не нужен отдельный Eureka/Consul. Для не-Kubernetes сред — используйте Consul или Eureka.' }
      ]
    },
    {
      id: 2,
      title: 'Netflix Eureka',
      type: 'theory',
      content: [
        { type: 'text', value: 'Eureka — Service Registry от Netflix, тесно интегрированный со Spring Cloud. Eureka Server хранит реестр сервисов. Eureka Client регистрируется при старте и получает адреса других сервисов.' },
        { type: 'code', language: 'java', value: '// Eureka Server\n@SpringBootApplication\n@EnableEurekaServer\npublic class EurekaServerApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(EurekaServerApplication.class, args);\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# Eureka Server — application.yml\nserver:\n  port: 8761\n\neureka:\n  client:\n    register-with-eureka: false  # Сервер не регистрирует себя\n    fetch-registry: false\n  server:\n    enable-self-preservation: true # Защита от массового дерегистрирования\n    renewal-percent-threshold: 0.85\n\n---\n# Eureka Client (User Service) — application.yml\nspring:\n  application:\n    name: user-service  # Имя сервиса в реестре\n\neureka:\n  client:\n    service-url:\n      defaultZone: http://eureka-server:8761/eureka/\n    registry-fetch-interval-seconds: 5  # Обновление кэша\n  instance:\n    prefer-ip-address: true\n    lease-renewal-interval-in-seconds: 10  # Heartbeat каждые 10 сек\n    lease-expiration-duration-in-seconds: 30  # Удалить после 30 сек без heartbeat\n    metadata-map:\n      version: 1.2.0\n      zone: us-east-1a' },
        { type: 'code', language: 'java', value: '// Eureka Client — вызов другого сервиса через Discovery\n@Service\npublic class OrderService {\n    private final RestClient.Builder restClientBuilder;\n\n    // lb://user-service -> Eureka resolve -> http://10.0.1.5:8081\n    public UserResponse getUser(UUID userId) {\n        return restClientBuilder.build()\n            .get()\n            .uri("http://user-service/api/v1/users/{id}", userId)\n            .retrieve()\n            .body(UserResponse.class);\n    }\n}\n\n// Load Balancer выбирает из нескольких инстансов\n@Configuration\npublic class LoadBalancerConfig {\n    @Bean\n    @LoadBalanced  // Включает client-side load balancing\n    public RestClient.Builder restClientBuilder() {\n        return RestClient.builder();\n    }\n}' },
        { type: 'note', value: 'Self-preservation mode Eureka: если много сервисов одновременно перестают слать heartbeat (сетевая проблема), Eureka не удаляет их из реестра. Это предотвращает каскадный отказ при сетевых проблемах.' }
      ]
    },
    {
      id: 3,
      title: 'HashiCorp Consul',
      type: 'theory',
      content: [
        { type: 'text', value: 'Consul — не только Service Discovery, но и KV-хранилище, Service Mesh, health checking. Поддерживает multi-datacenter. Используется в production крупных компаний.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — Consul кластер\nservices:\n  consul:\n    image: hashicorp/consul:1.17\n    ports:\n      - "8500:8500"   # UI и HTTP API\n      - "8600:8600"   # DNS\n    command: agent -server -bootstrap-expect=1 -ui -client=0.0.0.0\n    volumes:\n      - consul-data:/consul/data\n\n# Регистрация сервиса в Consul (consul-config.json)\n# {\n#   "service": {\n#     "name": "user-service",\n#     "port": 8081,\n#     "tags": ["v1", "production"],\n#     "check": {\n#       "http": "http://localhost:8081/actuator/health",\n#       "interval": "10s",\n#       "timeout": "3s"\n#     }\n#   }\n# }' },
        { type: 'code', language: 'java', value: '// Spring Boot + Consul\n// build.gradle:\n// implementation "org.springframework.cloud:spring-cloud-starter-consul-discovery"\n\n// application.yml\n// spring:\n//   cloud:\n//     consul:\n//       host: consul\n//       port: 8500\n//       discovery:\n//         service-name: user-service\n//         health-check-path: /actuator/health\n//         health-check-interval: 10s\n//         instance-id: ${spring.application.name}:${random.value}\n\n// Consul также предоставляет KV Store для конфигурации\n@Service\npublic class ConfigService {\n    private final ConsulClient consulClient;\n\n    public String getConfig(String key) {\n        Response<GetValue> response = consulClient.getKVValue(key);\n        if (response.getValue() != null) {\n            return new String(Base64.getDecoder()\n                .decode(response.getValue().getDecodedValue()));\n        }\n        return null;\n    }\n}\n\n// Consul DNS discovery:\n// dig @consul user-service.service.consul\n// user-service.service.consul. 0 IN A 10.0.1.5\n// user-service.service.consul. 0 IN A 10.0.2.8' },
        { type: 'list', value: [
          'Consul: multi-datacenter, KV store, Service Mesh, health checks',
          'Eureka: простой, идеален для Spring Cloud экосистемы',
          'etcd: KV store, используется в Kubernetes (не Service Discovery напрямую)',
          'Zookeeper: координация, используется в Kafka (устаревает в пользу KRaft)'
        ] }
      ]
    },
    {
      id: 4,
      title: 'DNS-based Service Discovery',
      type: 'theory',
      content: [
        { type: 'text', value: 'DNS — самый простой механизм Service Discovery. В Kubernetes каждый Service получает DNS-запись. CoreDNS резолвит имена сервисов в IP-адреса. Не нужен дополнительный реестр.' },
        { type: 'code', language: 'yaml', value: '# Kubernetes Service — автоматический DNS\napiVersion: v1\nkind: Service\nmetadata:\n  name: user-service\n  namespace: shop\nspec:\n  selector:\n    app: user-service\n  ports:\n    - port: 80\n      targetPort: 8081\n  type: ClusterIP\n\n# DNS записи создаются автоматически:\n# user-service.shop.svc.cluster.local -> ClusterIP\n# Из того же namespace: http://user-service:80\n# Из другого namespace: http://user-service.shop.svc.cluster.local:80\n\n---\n# Headless Service — для получения IP всех Pod-ов\napiVersion: v1\nkind: Service\nmetadata:\n  name: user-service-headless\nspec:\n  clusterIP: None  # Headless!\n  selector:\n    app: user-service\n  ports:\n    - port: 80\n      targetPort: 8081\n\n# DNS для Headless Service возвращает IP всех Pod-ов:\n# dig user-service-headless.shop.svc.cluster.local\n# -> 10.244.1.5\n# -> 10.244.2.8\n# -> 10.244.3.2\n# Клиент сам выбирает (client-side load balancing)' },
        { type: 'code', language: 'java', value: '// В Kubernetes не нужен Eureka!\n// application.yml для Kubernetes\nspring:\n  application:\n    name: order-service\n\nservices:\n  user-service:\n    url: http://user-service.shop.svc.cluster.local  # DNS!\n  payment-service:\n    url: http://payment-service.shop.svc.cluster.local\n\n// Или просто по имени (в том же namespace):\nservices:\n  user-service:\n    url: http://user-service  # Kubernetes DNS резолвит' },
        { type: 'warning', value: 'DNS кэшируется! При масштабировании Pod-ов новые IP могут не сразу появиться в DNS-кэше. TTL по умолчанию в Kubernetes DNS — 30 секунд. Для мгновенного обнаружения используйте Headless Service + client-side discovery.' }
      ]
    },
    {
      id: 5,
      title: 'Health Checks и Load Balancing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Health Check определяет живой ли инстанс сервиса. Load Balancer распределяет нагрузку между здоровыми инстансами. Оба компонента критичны для надёжного Service Discovery.' },
        { type: 'code', language: 'java', value: '// Spring Boot Actuator — health endpoint\n// GET /actuator/health\n// {\n//   "status": "UP",\n//   "components": {\n//     "db": {"status": "UP"},\n//     "kafka": {"status": "UP"},\n//     "diskSpace": {"status": "UP"}\n//   }\n// }\n\n// Кастомный Health Indicator\n@Component\npublic class PaymentGatewayHealthIndicator implements HealthIndicator {\n\n    private final PaymentGatewayClient paymentGateway;\n\n    @Override\n    public Health health() {\n        try {\n            boolean reachable = paymentGateway.ping();\n            if (reachable) {\n                return Health.up()\n                    .withDetail("gateway", "reachable")\n                    .withDetail("latency", paymentGateway.getLatency() + "ms")\n                    .build();\n            }\n            return Health.down()\n                .withDetail("gateway", "unreachable")\n                .build();\n        } catch (Exception e) {\n            return Health.down(e).build();\n        }\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# Kubernetes liveness и readiness probes\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: user-service\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n        - name: user-service\n          image: user-service:1.0.0\n          ports:\n            - containerPort: 8081\n          # Liveness: жив ли процесс?\n          livenessProbe:\n            httpGet:\n              path: /actuator/health/liveness\n              port: 8081\n            initialDelaySeconds: 30\n            periodSeconds: 10\n            failureThreshold: 3  # 3 ошибки -> restart\n          # Readiness: готов принимать трафик?\n          readinessProbe:\n            httpGet:\n              path: /actuator/health/readiness\n              port: 8081\n            initialDelaySeconds: 10\n            periodSeconds: 5\n            failureThreshold: 3  # 3 ошибки -> убрать из Service' },
        { type: 'tip', value: 'Разделяйте liveness и readiness: liveness проверяет что процесс не завис (перезапуск при сбое). Readiness проверяет что сервис готов к запросам (не получает трафик пока не готов). Не делайте liveness зависимым от внешних сервисов!' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Service Discovery с Consul',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Service Discovery с Consul для трёх микросервисов с health checks и load balancing.',
      requirements: [
        'Запустите Consul agent в Docker',
        'Зарегистрируйте 3 сервиса: user-service, order-service, payment-service',
        'Настройте HTTP health checks для каждого сервиса',
        'Реализуйте client-side discovery через Consul DNS',
        'Запустите 2 инстанса user-service и проверьте load balancing',
        'Добавьте KV конфигурацию для database URL'
      ],
      hint: 'Используйте spring-cloud-starter-consul-discovery. Consul DNS доступен на порту 8600. Для KV store используйте HTTP API: PUT http://consul:8500/v1/kv/config/db-url.',
      expectedOutput: 'Consul UI доступен на http://localhost:8500.\nСервисы зарегистрированы: user-service (2 instances), order-service (1), payment-service (1).\nHealth checks: все зелёные.\nDNS: dig @localhost -p 8600 user-service.service.consul -> 2 A записи.\nLoad balancing: запросы распределяются между 2 инстансами user-service.\nKV: consul kv get config/db-url -> jdbc:postgresql://db:5432/shop.',
      solution: '# docker-compose.yml\nservices:\n  consul:\n    image: hashicorp/consul:1.17\n    ports:\n      - "8500:8500"\n      - "8600:8600/udp"\n    command: agent -server -bootstrap-expect=1 -ui -client=0.0.0.0\n\n  user-service-1:\n    build: ./user-service\n    environment:\n      SPRING_CLOUD_CONSUL_HOST: consul\n      SERVER_PORT: 8081\n      SPRING_APPLICATION_NAME: user-service\n\n  user-service-2:\n    build: ./user-service\n    environment:\n      SPRING_CLOUD_CONSUL_HOST: consul\n      SERVER_PORT: 8081\n      SPRING_APPLICATION_NAME: user-service\n\n  order-service:\n    build: ./order-service\n    environment:\n      SPRING_CLOUD_CONSUL_HOST: consul\n      SERVER_PORT: 8082\n\n# application.yml для каждого сервиса\nspring:\n  cloud:\n    consul:\n      host: consul\n      port: 8500\n      discovery:\n        health-check-path: /actuator/health\n        health-check-interval: 10s\n\n# Проверка\ncurl http://localhost:8500/v1/catalog/service/user-service | jq\ncurl http://localhost:8500/v1/health/service/user-service | jq\nconsul kv put config/db-url "jdbc:postgresql://db:5432/shop"\nconsul kv get config/db-url',
      explanation: 'Consul обеспечивает автоматическое обнаружение сервисов. Сервисы регистрируются при старте и отправляют heartbeat. Health checks определяют доступность. Consul DNS возвращает адреса здоровых инстансов. Client-side load balancer распределяет запросы.'
    }
  ]
}
