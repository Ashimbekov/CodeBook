export default {
  id: 14,
  title: 'IT: DevOps термины',
  description: 'Ключевые DevOps термины: pipeline, deploy, container, orchestration, scaling, monitoring, rollback и другие. Словарь DevOps инженера.',
  lessons: [
    {
      id: 1,
      title: 'Pipeline: CI/CD',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'PIPELINE (пайплайн) — автоматизированная последовательность шагов от кода до деплоя.\n\nCI (Continuous Integration) — непрерывная интеграция: автоматическое тестирование при каждом коммите.\nCD (Continuous Delivery/Deployment) — непрерывная доставка/деплой.\n\nКлючевые фразы:\n- to run a pipeline / to trigger a pipeline\n- pipeline stage (стадия пайплайна)\n- build stage / test stage / deploy stage\n- to pass / fail the pipeline\n- pipeline configuration\n- to set up a CI/CD pipeline\n- pipeline as code (пайплайн описан кодом)\n- artifact (артефакт — результат сборки)\n\nExamples:\n1. "Every pull request triggers the CI pipeline automatically."\n2. "The pipeline consists of three stages: build, test, and deploy."\n3. "The deployment was blocked because the pipeline failed the security scan."\n4. "We use GitHub Actions to define our CI/CD pipeline."\n5. "The pipeline produces a Docker image as an artifact."\n6. "Our pipeline runs over 2000 tests in under 5 minutes."\n7. "We implemented pipeline as code using YAML configuration files."'
        },
        {
          type: 'text',
          value: 'BUILD (сборка) — компиляция и подготовка приложения к запуску.\n\nФразы:\n- to build the application\n- build time (время сборки)\n- build artifact\n- failed build\n- to trigger a build\n- build dependencies\n\nTEST AUTOMATION (автоматизация тестирования):\n- unit tests\n- integration tests\n- end-to-end tests (e2e)\n- smoke tests (базовые проверки после деплоя)\n- regression tests\n- to run the test suite\n- test coverage (покрытие тестами)\n\nExamples:\n1. "The build takes 3 minutes because we compile TypeScript to JavaScript."\n2. "Build artifacts are stored in S3 and retained for 30 days."\n3. "We run smoke tests immediately after each deployment to verify the release."\n4. "Our test suite has 85% code coverage — we aim for 90%."\n5. "Integration tests run against a real database in a Docker container."'
        }
      ]
    },
    {
      id: 2,
      title: 'Deploy: стратегии и процессы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'DEPLOY (деплой) — развёртывание приложения в окружение.\n\nОкружения (environments):\n- development (dev) — локальная разработка\n- staging — тестовое окружение, копия продакшна\n- production (prod) — боевое окружение для реальных пользователей\n\nКлючевые фразы:\n- to deploy to production / staging\n- deployment process\n- deployment strategy\n- to push to production\n- production deployment\n- zero-downtime deployment (деплой без простоя)\n- deployment freeze (запрет на деплой)\n- to release a version\n\nExamples:\n1. "We deploy to production every Tuesday and Thursday."\n2. "Changes are first deployed to staging for QA testing."\n3. "We use blue-green deployment for zero-downtime releases."\n4. "A deployment freeze is in effect during the holiday season."\n5. "The deployment failed because the health check didn\'t pass."'
        },
        {
          type: 'text',
          value: 'Стратегии деплоя (Deployment Strategies):\n\nBLUE-GREEN DEPLOYMENT:\n"In blue-green deployment, we run two identical environments. Traffic is switched from the blue (old) to the green (new) environment instantaneously. If issues arise, we can switch back immediately."\n\nCANARY DEPLOYMENT:\n"A canary deployment gradually shifts traffic to the new version. We start with 5% of users, monitor for issues, and slowly increase to 100%."\n\nROLLING DEPLOYMENT:\n"A rolling deployment updates instances one by one. At any point, some instances run the old version and some run the new version."\n\nExamples:\n1. "We use canary deployments to test new features with 1% of users first."\n2. "The blue-green approach allows instant rollback without downtime."\n3. "Rolling updates ensure that the application remains available during deployment."\n4. "Feature flags let us deploy code without activating the feature for all users."'
        }
      ]
    },
    {
      id: 3,
      title: 'Container, Docker, Image',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'CONTAINER (контейнер) — изолированная среда выполнения приложения.\n\nCONTAINERIZATION — упаковка приложения со всеми зависимостями в контейнер.\n\nКлючевые термины:\n- container image (образ контейнера)\n- Dockerfile — файл с инструкциями для создания образа\n- to build an image\n- to run a container\n- container registry (реестр образов)\n- to push / pull an image\n- base image\n- multi-stage build\n- container orchestration\n\nExamples:\n1. "Each microservice is packaged as a Docker container."\n2. "We build the Docker image in the CI pipeline and push it to the registry."\n3. "The Dockerfile defines the base image, dependencies, and startup command."\n4. "Docker Hub is a public container registry where we store our images."\n5. "Running the same container in dev and prod eliminates \'works on my machine\' issues."\n6. "We use multi-stage builds to keep the production image small."'
        },
        {
          type: 'text',
          value: 'ORCHESTRATION (оркестрация) — управление множеством контейнеров.\n\nKubernetes (K8s) — стандарт де-факто для оркестрации контейнеров.\n\nКлючевые термины Kubernetes:\n- cluster (кластер) — группа узлов\n- node (узел) — сервер в кластере\n- pod (под) — минимальная единица деплоя\n- deployment — описание желаемого состояния\n- service (сервис) — сетевой доступ к подам\n- namespace (неймспейс) — логическое разделение ресурсов\n- to scale a deployment\n- desired state vs actual state\n- to apply a manifest (применить конфигурацию)\n\nExamples:\n1. "Kubernetes automatically restarts pods that fail health checks."\n2. "We deploy to a Kubernetes cluster with 10 worker nodes."\n3. "Each service has its own Kubernetes namespace."\n4. "kubectl apply -f deployment.yaml applies the configuration to the cluster."\n5. "Kubernetes maintains the desired state — if a pod crashes, it creates a new one."\n6. "We use Helm charts to manage Kubernetes deployments."'
        }
      ]
    },
    {
      id: 4,
      title: 'Scaling, Auto-scaling',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'SCALING (масштабирование) — увеличение или уменьшение ресурсов системы.\n\nSCALE UP (vertical scaling) — добавить ресурсы одному серверу (CPU, RAM).\nSCALE OUT / SCALE DOWN (horizontal scaling) — добавить/убрать серверы.\n\nAUTO-SCALING (автоматическое масштабирование) — система сама добавляет/убирает ресурсы.\n\nКлючевые фразы:\n- to scale up / scale down\n- to scale out / scale in\n- auto-scaling group\n- to configure auto-scaling policies\n- scaling trigger (триггер масштабирования)\n- target CPU utilization\n- minimum/maximum instances\n- to handle traffic spikes\n\nExamples:\n1. "We configured auto-scaling to add instances when CPU exceeds 70%."\n2. "During Black Friday, the system automatically scaled out to 50 instances."\n3. "We scale down to 5 instances overnight to reduce costs."\n4. "Kubernetes horizontal pod autoscaler scales pods based on CPU and memory usage."\n5. "Without auto-scaling, we would have experienced downtime during the traffic spike."\n6. "We set the minimum to 3 instances for high availability and maximum to 20."'
        },
        {
          type: 'text',
          value: 'LOAD TESTING (нагрузочное тестирование):\n\nФразы:\n- to run load tests\n- to simulate concurrent users\n- throughput (пропускная способность, запросов в секунду)\n- latency / response time\n- P99 latency (99-й перцентиль задержки)\n- to find the breaking point\n- TPS (transactions per second)\n- RPS (requests per second)\n\nExamples:\n1. "We run load tests before every major release."\n2. "The system handles 10,000 RPS with P99 latency under 200ms."\n3. "Load testing revealed that the database was the bottleneck at 5,000 concurrent users."\n4. "We use k6 to simulate concurrent user load."\n5. "The load test found that the service starts degrading above 8,000 requests per second."'
        }
      ]
    },
    {
      id: 5,
      title: 'Monitoring, Alerting, Observability',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'MONITORING (мониторинг) — непрерывное наблюдение за системой.\nALERTING (алертинг) — уведомления при отклонениях.\nOBSERVABILITY (наблюдаемость) — способность понять состояние системы.\n\nТри столпа наблюдаемости (Three Pillars of Observability):\n1. METRICS (метрики) — числовые показатели\n2. LOGS (логи) — записи событий\n3. TRACES (трейсы) — отслеживание пути запроса\n\nКлючевые фразы:\n- to monitor system health\n- to set up alerts / alerting rules\n- to trigger an alert\n- alert threshold (порог срабатывания)\n- on-call engineer (дежурный инженер)\n- incident response\n- to acknowledge an alert\n- dashboards and metrics\n- error rate / request rate / latency\n\nExamples:\n1. "We monitor CPU, memory, disk usage, and request latency."\n2. "An alert fires when the error rate exceeds 1% for more than 5 minutes."\n3. "The on-call engineer received an alert at 3 AM and responded immediately."\n4. "We use Prometheus for metrics collection and Grafana for dashboards."\n5. "Distributed tracing with Jaeger helps us track requests across microservices."\n6. "Centralized logging with the ELK stack makes it easy to search through logs."'
        },
        {
          type: 'text',
          value: 'SLI, SLO, SLA (ключевые метрики надёжности):\n\nSLI (Service Level Indicator) — метрика измерения качества сервиса.\nSLO (Service Level Objective) — внутренняя цель по качеству.\nSLA (Service Level Agreement) — договорное обязательство.\n\nExamples:\n1. "Our SLI is the percentage of requests that complete in under 200ms."\n2. "We set an SLO of 99.9% availability for the payment service."\n3. "The SLA with the client guarantees 99.95% uptime."\n4. "We have an error budget of 0.1% — if we exceed it, we stop feature development."\n5. "SRE (Site Reliability Engineering) focuses on meeting SLOs while enabling fast delivery."'
        }
      ]
    },
    {
      id: 6,
      title: 'Rollback, Hotfix, Incident',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'ROLLBACK (откат) — возврат к предыдущей версии приложения.\n\nФразы:\n- to roll back a deployment\n- to revert to the previous version\n- rollback procedure\n- automated rollback\n- to trigger a rollback\n\nExamples:\n1. "We rolled back the deployment after noticing a spike in errors."\n2. "The rollback took 3 minutes and restored service immediately."\n3. "We have automated rollback configured to trigger if the error rate exceeds 5%."\n4. "Blue-green deployments make rollback instantaneous."\n\nHOTFIX (горячее исправление) — срочное исправление критического бага в продакшне.\n\nФразы:\n- to release a hotfix\n- emergency fix\n- hotfix branch\n- to deploy outside of the regular release cycle\n\nExamples:\n1. "We deployed a hotfix to address the critical security vulnerability."\n2. "Hotfixes bypass the normal code review process — but we review them afterward."\n3. "The hotfix was deployed within 30 minutes of discovering the issue."\n\nINCIDENT (инцидент) — незапланированное нарушение работы сервиса.\n\nINCI­DENT RESPONSE CYCLE:\nDetection → Triage → Investigation → Resolution → Post-mortem\n\nExamples:\n1. "We declared a P1 incident when the payment service went down."\n2. "The incident was resolved in 47 minutes."\n3. "The post-mortem identified three root causes and five action items."\n4. "We use PagerDuty to manage on-call rotations and incident notifications."'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: DevOps разговор и отчёты',
      type: 'practice',
      description: 'Переведи DevOps-фразы на английский язык.',
      solution: 'Правильные ответы:\n1. The pipeline failed at the testing stage due to a failing integration test.\n2. We rolled back the deployment after the error rate exceeded 5%.\n3. The system automatically scaled out to 30 instances during the traffic spike.\n4. The on-call engineer received an alert at 2 AM and immediately started investigating.\n5. The post-mortem identified a single point of failure in our architecture.',
      content: [
        {
          type: 'text',
          value: 'Ключевые фразы для DevOps-встреч:\n\n"The CI pipeline is failing on the integration tests."\n"We need to roll back — the error rate jumped to 15% after deployment."\n"I\'m going to trigger a rollback and investigate the root cause."\n"The auto-scaling kicked in and we went from 5 to 20 instances in 3 minutes."\n"The monitoring dashboard shows elevated latency on the checkout service."\n"We have a P1 incident — the database is unresponsive."\n"Let\'s create a hotfix branch and deploy directly to production."\n"The post-mortem is scheduled for tomorrow — please document your timeline."\n"Our SLO states that 99.9% of requests must complete within 500ms."\n"We need better observability — right now we\'re flying blind."'
        },
        {
          type: 'text',
          value: 'Переведите на английский:\n\n1. Пайплайн упал на этапе тестирования из-за неудачного интеграционного теста.\n→ The pipeline failed at the testing stage due to a failing integration test.\n\n2. Мы откатили деплой после того, как уровень ошибок превысил 5%.\n→ We rolled back the deployment after the error rate exceeded 5%.\n\n3. Система автоматически масштабировалась до 30 инстансов во время пикового трафика.\n→ The system automatically scaled out to 30 instances during the traffic spike.\n\n4. Дежурный инженер получил алерт в 2 ночи и немедленно начал расследование.\n→ The on-call engineer received an alert at 2 AM and immediately started investigating.\n\n5. Постмортем выявил единственную точку отказа в нашей архитектуре.\n→ The post-mortem identified a single point of failure in our architecture.'
        }
      ]
    }
  ]
}
