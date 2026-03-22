export default {
  id: 13,
  title: 'Логирование в Docker',
  description: 'Работа с логами контейнеров: docker logs, log drivers (json-file, syslog, fluentd, awslogs), ротация логов, централизованное логирование с ELK и Loki.',
  lessons: [
    {
      id: 1,
      title: 'docker logs — базовые команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker собирает stdout и stderr процессов контейнера. docker logs позволяет просматривать логи любого контейнера независимо от того запущен он или остановлен.' },
        { type: 'code', language: 'bash', value: '# Основные команды docker logs:\ndocker logs mycontainer              # Все логи\ndocker logs -f mycontainer           # Follow (в реальном времени)\ndocker logs --tail 100 mycontainer   # Последние 100 строк\ndocker logs --since 1h mycontainer   # За последний час\ndocker logs --since 2024-01-15T10:00:00 mycontainer  # С определённого времени\ndocker logs --until 2024-01-15T12:00:00 mycontainer  # До определённого времени\ndocker logs -t mycontainer           # С timestamps\ndocker logs --details mycontainer    # Дополнительные атрибуты\n\n# Комбинации:\ndocker logs -f --tail 50 mycontainer    # Follow + последние 50\ndocker logs -t --since 30m mycontainer  # С временем, за 30 минут\n\n# Только stderr:\ndocker logs mycontainer 2>&1 | grep ERROR\n\n# Сохранить логи в файл:\ndocker logs mycontainer > app.log 2>&1\n\n# Логи через compose:\ndocker compose logs                  # Все сервисы\ndocker compose logs app              # Конкретный сервис\ndocker compose logs -f app db        # Несколько сервисов\ndocker compose logs --tail 20 app    # Последние 20 строк\n\n# Важно: docker logs работает только с log drivers\n# которые поддерживают чтение!\n# json-file и journald: поддерживают docker logs\n# syslog, fluentd, awslogs: НЕ поддерживают docker logs!' },
        { type: 'tip', value: 'Приложения должны писать логи в stdout/stderr, не в файлы. Это принцип 12-factor app. Docker перехватывает stdout/stderr и передаёт выбранному log driver. Если приложение пишет в файл — нужен дополнительный sidecar контейнер или tail в stdout.' }
      ]
    },
    {
      id: 2,
      title: 'Log drivers — куда пишутся логи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Log driver определяет куда Docker отправляет логи контейнера. По умолчанию: json-file (локальные файлы). Для production: централизованные системы (fluentd, awslogs, gcplogs).' },
        { type: 'code', language: 'bash', value: '# Доступные log drivers:\n# json-file  — JSON файлы на хосте (дефолт)\n# journald   — systemd journal\n# syslog     — syslog/rsyslog\n# fluentd    — Fluentd log collector\n# awslogs    — Amazon CloudWatch\n# gcplogs    — Google Cloud Logging\n# splunk     — Splunk\n# gelf       — Graylog Extended Log Format\n# none       — Отключить логирование\n\n# Настроить driver для конкретного контейнера:\ndocker run \\\n  --log-driver json-file \\\n  --log-opt max-size=10m \\\n  --log-opt max-file=3 \\\n  nginx\n\n# Глобальная настройка в daemon.json:\n# {\n#   "log-driver": "json-file",\n#   "log-opts": {\n#     "max-size": "100m",\n#     "max-file": "5"\n#   }\n# }\n\n# AWS CloudWatch logs:\ndocker run \\\n  --log-driver awslogs \\\n  --log-opt awslogs-region=us-east-1 \\\n  --log-opt awslogs-group=/myapp/production \\\n  --log-opt awslogs-create-group=true \\\n  myapp\n\n# Проверить текущий driver:\ndocker inspect mycontainer --format "{{.HostConfig.LogConfig.Type}}"' },
        { type: 'code', language: 'yaml', value: '# Log driver в docker-compose.yml:\nservices:\n  app:\n    image: myapp\n    logging:\n      driver: json-file\n      options:\n        max-size: "10m"\n        max-file: "3"\n        labels: "service,environment"\n        tag: "{{.Name}}/{{.ID}}"\n\n  # Journald:\n  nginx:\n    image: nginx\n    logging:\n      driver: journald\n      options:\n        tag: nginx-{{.Name}}\n\n  # None — отключить логи:\n  background-worker:\n    image: worker\n    logging:\n      driver: none' },
        { type: 'warning', value: 'Без настройки ротации логов (max-size, max-file) файлы json-file могут заполнить весь диск! Это очень распространённая проблема на production. Всегда устанавливай max-size в daemon.json как глобальный дефолт.' }
      ]
    },
    {
      id: 3,
      title: 'Ротация логов и управление диском',
      type: 'theory',
      content: [
        { type: 'text', value: 'Без ротации логи занимают неограниченное место. json-file поддерживает встроенную ротацию. Для journald используется journald.conf. Мониторинг использования диска — обязательная практика.' },
        { type: 'code', language: 'bash', value: '# Ротация для json-file:\n# daemon.json:\n# {\n#   "log-driver": "json-file",\n#   "log-opts": {\n#     "max-size": "100m",   <- максимальный размер одного файла\n#     "max-file": "5"       <- количество файлов (итого: 500MB максимум)\n#   }\n# }\n# При достижении max-size: старый файл ротируется, создаётся новый\n# При достижении max-file: старейший файл удаляется\n\n# Где хранятся логи json-file:\n# /var/lib/docker/containers/{container-id}/{container-id}-json.log\nls -lh /var/lib/docker/containers/abc123*/\n# -rw-r--r-- 1 root root 98M Jan 15 10:00 abc123-json.log\n\n# Использование диска:\ndocker system df\n# TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE\n# Images          15        3         8.2GB     6.1GB\n# Containers      5         2         250MB     180MB\n# Local Volumes   3         2         1.2GB     0B\n# Build Cache     20        0         512MB     512MB\n\n# Подробно по контейнерам:\ndocker system df -v | head -30\n\n# Найти контейнеры с большими логами:\ndu -sh /var/lib/docker/containers/*/\n# 150M  /var/lib/docker/containers/abc123.../\n# 2.1G  /var/lib/docker/containers/def456.../  <- проблема!\n\n# Очистить логи без удаления контейнера:\n# (не рекомендуется но иногда нужно в emergency)\ntruncate -s 0 /var/lib/docker/containers/{id}/{id}-json.log\n\n# Правильное решение: настроить ротацию и перезапустить контейнер' }
      ]
    },
    {
      id: 4,
      title: 'Fluentd — централизованный сбор логов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fluentd — популярный агрегатор логов. Собирает логи со всех контейнеров и отправляет в хранилище: Elasticsearch, S3, BigQuery, etc. Docker имеет встроенный fluentd driver.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml с Fluentd:\nservices:\n  fluentd:\n    image: fluentd:v1.16\n    volumes:\n      - ./fluentd/fluent.conf:/fluentd/etc/fluent.conf\n      - fluentd_logs:/fluentd/log\n    ports:\n      - "24224:24224"\n      - "24224:24224/udp"\n\n  app:\n    image: myapp\n    logging:\n      driver: fluentd\n      options:\n        fluentd-address: localhost:24224\n        tag: myapp.{{.Name}}\n        fluentd-async: "true"  # Не блокировать если fluentd недоступен\n\n  elasticsearch:\n    image: elasticsearch:8.11.0\n    environment:\n      - discovery.type=single-node\n      - xpack.security.enabled=false\n    volumes:\n      - es_data:/usr/share/elasticsearch/data\n\nvolumes:\n  fluentd_logs:\n  es_data:' },
        { type: 'code', language: 'bash', value: '# fluent.conf — конфигурация Fluentd:\n# <source>\n#   @type forward\n#   port 24224\n#   bind 0.0.0.0\n# </source>\n#\n# <filter myapp.**>\n#   @type record_transformer\n#   <record>\n#     hostname "#{Socket.gethostname}"\n#     environment production\n#   </record>\n# </filter>\n#\n# <match myapp.**>\n#   @type elasticsearch\n#   host elasticsearch\n#   port 9200\n#   index_name fluentd\n#   type_name _doc\n# </match>\n#\n# <match **>\n#   @type stdout\n# </match>\n\n# Проверить что логи поступают в Fluentd:\ndocker compose exec fluentd tail -f /fluentd/log/fluentd.log\n\n# Запросить логи в Elasticsearch:\ncurl http://localhost:9200/fluentd/_search?pretty=true\n\n# fluentd-async: true — важно!\n# Если Fluentd упал — приложение НЕ блокируется\n# Логи буферизуются локально' }
      ]
    },
    {
      id: 5,
      title: 'Loki и Grafana — современный стек логирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Grafana Loki — лёгкий агрегатор логов от Grafana Labs. Как Prometheus, но для логов. Хранит только индексы (labels), не полный текст — дешевле Elasticsearch. Отлично интегрируется с Grafana.' },
        { type: 'code', language: 'yaml', value: '# Стек: Promtail (агент) -> Loki (хранилище) -> Grafana (UI)\nservices:\n  loki:\n    image: grafana/loki:2.9.0\n    ports:\n      - "3100:3100"\n    command: -config.file=/etc/loki/local-config.yaml\n    volumes:\n      - loki_data:/loki\n\n  promtail:\n    image: grafana/promtail:2.9.0\n    volumes:\n      - /var/lib/docker/containers:/var/lib/docker/containers:ro\n      - /var/run/docker.sock:/var/run/docker.sock\n      - ./promtail-config.yml:/etc/promtail/config.yml\n    command: -config.file=/etc/promtail/config.yml\n\n  grafana:\n    image: grafana/grafana:10.0.0\n    ports:\n      - "3000:3000"\n    volumes:\n      - grafana_data:/var/lib/grafana\n    environment:\n      - GF_SECURITY_ADMIN_PASSWORD=admin\n\nvolumes:\n  loki_data:\n  grafana_data:' },
        { type: 'code', language: 'bash', value: '# promtail-config.yml:\n# server:\n#   http_listen_port: 9080\n# positions:\n#   filename: /tmp/positions.yaml\n# clients:\n#   - url: http://loki:3100/loki/api/v1/push\n# scrape_configs:\n#   - job_name: docker\n#     docker_sd_configs:\n#       - host: unix:///var/run/docker.sock\n#         refresh_interval: 5s\n#     relabel_configs:\n#       - source_labels: [\'__meta_docker_container_name\']\n#         target_label: container\n#       - source_labels: [\'__meta_docker_container_log_stream\']\n#         target_label: stream\n\n# Grafana -> Add Data Source -> Loki\n# URL: http://loki:3100\n# Запрос LogQL:\n# {container="myapp"} |= "error"\n# rate({container="myapp"} |= "error" [5m])\n\n# Преимущества Loki перед Elasticsearch:\n# - В 10x дешевле хранение (только индексы)\n# - Встроенная интеграция с Grafana\n# - LogQL похож на PromQL (если уже используешь Prometheus)\n# - Горизонтальное масштабирование\n# Недостатки:\n# - Нет full-text search (только label фильтры + regex)\n# - Меньше фич чем ELK' },
        { type: 'note', value: 'Выбор между Loki и Elasticsearch зависит от задачи: Loki хорош для метрик и поиска по labels, Elasticsearch — для полнотекстового поиска и аналитики. Для большинства микросервисных приложений Loki достаточно.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка логирования',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой ротацию логов, просмотри логи нескольких сервисов и разверни простой стек централизованного логирования.',
      requirements: [
        'Запусти nginx и postgres через Compose с настроенной ротацией логов (max-size: 10m, max-file: 3)',
        'Научись фильтровать логи: за последние 5 минут, по паттерну, с timestamps',
        'Проверь использование диска логами через docker system df',
        'Настрой разные log drivers для разных сервисов (json-file для app, none для dev-tools)',
        'Добавь labels к логам для фильтрации (service=nginx, env=dev)',
        'Напиши скрипт который выводит последние ошибки из всех сервисов Compose'
      ],
      hint: 'docker logs --since 5m для фильтрации. docker logs -t для timestamp. docker system df -v для подробной информации. logging.options.labels в compose для меток. grep ERROR для фильтрации ошибок.',
      expectedOutput: 'docker compose up -d — все сервисы запущены.\n\ndocker compose logs -t nginx:\n2026-03-21T10:00:01.123456789Z 172.18.0.1 - - [21/Mar/2026:10:00:01 +0000] "GET / HTTP/1.1" 200 615\n\ndocker system df показывает размер логов контейнеров.\n\n./check-errors.sh:\n=== Errors in nginx ===\n(нет ошибок)\n=== Errors in postgres ===\n(нет ошибок)\n\nПри driver: none для pgadmin логи не доступны через docker logs.',
      solution: '# docker-compose.yml:\n# services:\n#   nginx:\n#     image: nginx:alpine\n#     ports:\n#       - "8080:80"\n#     logging:\n#       driver: json-file\n#       options:\n#         max-size: "10m"\n#         max-file: "3"\n#         labels: "service,env"\n#         tag: "nginx-{{.Name}}"\n#     labels:\n#       - "service=nginx"\n#       - "env=dev"\n#\n#   postgres:\n#     image: postgres:15-alpine\n#     environment:\n#       POSTGRES_PASSWORD: secret\n#     logging:\n#       driver: json-file\n#       options:\n#         max-size: "10m"\n#         max-file: "3"\n#\n#   pgadmin:\n#     image: dpage/pgadmin4\n#     logging:\n#       driver: none  # dev инструмент — логи не нужны\n\ndocker compose up -d\n\n# Просмотр логов:\ndocker compose logs -f\ndocker compose logs --since 5m app\ndocker compose logs -t nginx  # с timestamp\n\n# Фильтрация ошибок:\ndocker compose logs nginx 2>&1 | grep -i error\n\n# Использование диска:\ndocker system df\ndocker system df -v\n\n# Скрипт для ошибок из всех сервисов:\n# cat > check-errors.sh << \'EOF\'\n# #!/bin/bash\n# for service in $(docker compose config --services); do\n#   echo "=== Errors in $service ===" \n#   docker compose logs --since 1h $service 2>&1 | grep -i -E "error|fatal|exception" | tail -5\n# done\n# EOF\n# chmod +x check-errors.sh\n# ./check-errors.sh',
      explanation: 'Правильное логирование: всегда настраивай ротацию (max-size + max-file), иначе диск переполнится. Labels помогают фильтровать логи в centralized системах. none driver для dev-инструментов экономит ресурсы. docker logs --since работает только с json-file и journald drivers. Для production — централизованное решение (Loki, ELK, CloudWatch).'
    }
  ]
}
