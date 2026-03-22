export default {
  id: 16,
  title: 'Docker Best Practices',
  description: 'Лучшие практики работы с Docker: написание Dockerfile, управление данными, безопасность, производительность, troubleshooting и чек-лист для production.',
  lessons: [
    {
      id: 1,
      title: 'Best practices Dockerfile',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хороший Dockerfile — основа надёжного Docker образа. Ключевые принципы: один процесс на контейнер, минимальный образ, правильный порядок для кэша, non-root пользователь, явные версии.' },
        { type: 'code', language: 'bash', value: '# 1. Всегда указывай явные версии:\n# ПЛОХО:\n# FROM node\n# FROM node:latest\n# FROM node:18  # может измениться при patch updates\n# ХОРОШО:\n# FROM node:18.19.0-alpine3.19\n\n# 2. Один процесс = один контейнер:\n# ПЛОХО: один контейнер запускает nginx + app + db\n# ХОРОШО: три отдельных контейнера, связанных в Compose\n\n# 3. Не храни данные в контейнере:\n# Используй volume для persistent данных\n# Логи в stdout/stderr, не в файлы\n\n# 4. Используй multi-stage builds:\n# Разделяй build и runtime\n# В runtime нет компиляторов и dev tools\n\n# 5. COPY конкретно, не COPY . . без .dockerignore:\n# ХОРОШО:\n# COPY package*.json ./\n# COPY src/ ./src/\n# ПЛОХО:\n# COPY . .  # без .dockerignore копирует node_modules, .git, etc.\n\n# 6. Объединяй RUN команды:\n# RUN apt-get update && \\\\\n#     apt-get install -y curl && \\\\\n#     rm -rf /var/lib/apt/lists/*\n\n# 7. Используй ENTRYPOINT + CMD вместе:\n# ENTRYPOINT ["/entrypoint.sh"]  <- не переопределяется случайно\n# CMD ["--config", "default.conf"]  <- аргументы по умолчанию\n\n# 8. LABEL для метаданных:\n# LABEL maintainer="team@company.com"\n# LABEL version="1.0.0"\n# LABEL description="My application"' },
        { type: 'tip', value: 'Используй hadolint — линтер для Dockerfile. Находит нарушения best practices автоматически. Интегрируй в CI: docker run --rm -i hadolint/hadolint < Dockerfile' }
      ]
    },
    {
      id: 2,
      title: 'Управление данными и состоянием',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контейнеры должны быть stateless (без состояния). Все persistent данные — в volumes. Конфигурация — через переменные. Это позволяет легко масштабировать, заменять и восстанавливать контейнеры.' },
        { type: 'code', language: 'bash', value: '# 12-Factor App принципы применительно к Docker:\n\n# III. Конфигурация через environment variables:\n# НЕ хардкодь в Dockerfile:\n# ENV DATABASE_URL=postgresql://prod-server/db  # ПЛОХО!\n# Передавай при запуске:\n# docker run -e DATABASE_URL=... myapp\n\n# IV. Зависимости явно объявлены:\n# requirements.txt / package.json / go.mod\n# Все зависимости внутри образа\n\n# VI. Процессы без состояния:\n# Контейнер можно убить и запустить заново без потери данных\n# Данные в volumes, кэш в Redis/Memcached\n\n# XI. Логи как event streams:\n# stdout/stderr, не файлы\n# Docker собирает и ротирует\n\n# Антипаттерны:\n# docker commit — сохранение изменений в контейнере как образ\n# Изменение файлов внутри контейнера вручную\n# Хранение секретов в переменных образа (ENV в Dockerfile)\n\n# Проверить что контейнер stateless:\ndocker stop myapp && docker rm myapp\ndocker run -d --name myapp -v data:/data myapp\n# Приложение должно работать как ни в чём не бывало' }
      ]
    },
    {
      id: 3,
      title: 'Production чек-лист',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перед отправкой Docker конфигурации в production проверь этот список. Пропущенный пункт может привести к проблемам с безопасностью, производительностью или доступностью.' },
        { type: 'list', value: [
          'Базовый образ: используешь ли slim/alpine/distroless? Указана явная версия?',
          'Multi-stage build: в runtime нет dev зависимостей и build tools?',
          'Non-root пользователь: USER appuser в Dockerfile?',
          'Переменные: нет паролей в ENV Dockerfile? Используешь .env или secrets?',
          'Healthcheck: настроен для каждого сервиса?',
          'Ротация логов: max-size и max-file настроены в daemon.json?',
          'Volumes: данные в named volumes, не в контейнере?',
          'Restart policy: restart: unless-stopped или on-failure для production?',
          'Ресурсные лимиты: memory limit настроен чтобы избежать OOM killer?',
          'Сеть: db не публикует порт 5432 в интернет?',
          'Сканирование: trivy scan проходит без CRITICAL уязвимостей?',
          'Secrets: нет паролей в docker-compose.yml и истории git?',
          'Backup: есть процедура backup/restore для volumes?',
          'Мониторинг: логи централизованы? Алерты настроены?'
        ] },
        { type: 'code', language: 'bash', value: '# Быстрая проверка безопасности:\n# 1. Запущен ли контейнер от root?\ndocker exec myapp whoami\n\n# 2. Нет ли секретов в ENV?\ndocker inspect myapp --format "{{.Config.Env}}"\n\n# 3. Capabilities:\ndocker inspect myapp --format "{{.HostConfig.CapDrop}}"\n\n# 4. Уязвимости:\ntrivy image myapp:latest\n\n# 5. Размер образа:\ndocker images myapp\n\n# 6. Использование диска:\ndocker system df\n\n# 7. Логи не заполняют диск:\ndocker inspect myapp --format "{{.HostConfig.LogConfig}}"' }
      ]
    },
    {
      id: 4,
      title: 'Troubleshooting — диагностика проблем',
      type: 'theory',
      content: [
        { type: 'text', value: 'Умение диагностировать проблемы с Docker — важный навык. Знай как войти в контейнер, проверить сеть, посмотреть ресурсы и понять почему контейнер падает.' },
        { type: 'code', language: 'bash', value: '# КОНТЕЙНЕР НЕ ЗАПУСКАЕТСЯ:\ndocker logs myapp  # Посмотреть ошибку\ndocker run --rm myapp  # Запустить foreground чтобы видеть вывод\ndocker run --rm -it myapp sh  # Переопределить CMD на shell\ndocker inspect myapp  # Полная конфигурация и статус\n\n# КОНТЕЙНЕР ПАДАЕТ (crash loop):\ndocker logs --tail 50 myapp  # Последние строки перед крашем\ndocker events --filter container=myapp  # События\ndocker inspect myapp --format "{{.State}}"  # Exit code\n\n# ПРОБЛЕМЫ С СЕТЬЮ:\ndocker exec myapp ping db  # Проверить доступность другого контейнера\ndocker exec myapp nslookup db  # DNS резолюция\ndocker exec myapp curl http://api:3000/health  # HTTP запрос\ndocker network inspect mynet  # Контейнеры в сети\n\n# ВЫСОКОЕ ПОТРЕБЛЕНИЕ РЕСУРСОВ:\ndocker stats  # Реалтайм метрики CPU/RAM/NET\ndocker stats --no-stream  # Один снапшот\ndocker top myapp  # Процессы в контейнере\n\n# ПРОБЛЕМЫ С VOLUMES:\ndocker exec myapp ls -la /data  # Проверить монтирование\ndocker inspect myapp --format "{{json .Mounts}}" | python3 -m json.tool\n\n# ВОЙТИ В ЗАПУЩЕННЫЙ КОНТЕЙНЕР:\ndocker exec -it myapp bash  # bash\ndocker exec -it myapp sh    # sh (для alpine)\ndocker exec -it myapp /bin/sh\n\n# ВОЙТИ В УПАВШИЙ КОНТЕЙНЕР:\ndocker run -it --rm --entrypoint sh myapp:latest\n# Или создать временный из того же образа:\ndocker run -it --rm --volumes-from crashed-container --network container:crashed-container myapp:latest sh' },
        { type: 'tip', value: 'docker stats — первый инструмент при проблемах с производительностью. Показывает CPU%, MEM/LIMIT, NET I/O, BLOCK I/O в реальном времени для всех контейнеров. Если контейнер использует 100% CPU — проблема в приложении, не в Docker.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны и антипаттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Знание распространённых антипаттернов поможет избежать типичных ошибок. Многие "очевидные" решения в Docker оказываются проблемными в production.' },
        { type: 'heading', value: 'Антипаттерны' },
        { type: 'list', value: [
          'latest тег в production: docker pull myapp:latest — какая версия сейчас? Никто не знает',
          'docker commit: сохранение состояния контейнера — нет воспроизводимости, нет истории',
          'Пароли в ENV в Dockerfile: видны в docker inspect, docker history, логах CI',
          'Всё в одном контейнере: nginx + app + db — нарушает single responsibility',
          'Игнорирование healthcheck: depends_on без condition: service_healthy ненадёжен',
          'Без лимитов памяти: контейнер может занять всю RAM хоста',
          'Хранение данных в writable layer: теряется при удалении контейнера',
          'root в контейнере без причины: security risk'
        ] },
        { type: 'code', language: 'bash', value: '# ПАТТЕРН: Init container для миграций:\nservices:\n  migrate:\n    image: myapp\n    command: python manage.py migrate\n    depends_on:\n      db:\n        condition: service_healthy\n    restart: "no"  # Запустить один раз\n  app:\n    image: myapp\n    depends_on:\n      migrate:\n        condition: service_completed_successfully\n\n# ПАТТЕРН: Sidecar для логов:\nservices:\n  app:\n    image: myapp\n    volumes:\n      - logs:/var/log/app\n  log-shipper:\n    image: fluent/fluent-bit\n    volumes:\n      - logs:/var/log/app:ro\n    # Читает логи app и отправляет в centralized систему\n\n# ПАТТЕРН: Config map через volume:\nservices:\n  nginx:\n    image: nginx\n    volumes:\n      - ./nginx.conf:/etc/nginx/nginx.conf:ro\n    # Изменить конфиг без пересборки образа\n\n# ПАТТЕРН: Wait-for-it:\n# services:\n#   app:\n#     command: ["./wait-for-it.sh", "db:5432", "--", "python", "app.py"]\n# Скрипт ждёт доступности порта перед запуском\n# Альтернатива: depends_on с healthcheck (лучше!)' }
      ]
    },
    {
      id: 6,
      title: 'Мониторинг и обслуживание',
      type: 'theory',
      content: [
        { type: 'text', value: 'Production Docker требует регулярного обслуживания: очистка неиспользуемых образов, мониторинг диска, обновление базовых образов, ротация логов. Автоматизируй рутину.' },
        { type: 'code', language: 'bash', value: '# Мониторинг ресурсов:\ndocker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"\n\n# Использование диска:\ndocker system df\ndu -sh /var/lib/docker/\n\n# Очистка (безопасная):\ndocker system prune  # Остановленные контейнеры + dangling образы + неиспользуемые сети\ndocker image prune   # Только dangling образы (без тега)\n\n# Очистка с удалением данных (ОСТОРОЖНО!):\ndocker system prune -a  # Все неиспользуемые образы\ndocker volume prune     # Неиспользуемые volumes (потеря данных!)\n\n# Автоматическая очистка (cron):\n# 0 3 * * 0 docker system prune -f  # Каждое воскресенье в 3:00\n\n# Watchtower — автообновление контейнеров:\ndocker run -d \\\n  --name watchtower \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  containrrr/watchtower \\\n  --interval 86400  # Проверять каждые 24 часа\n# Автоматически pull и restart при новых образах\n# ОСТОРОЖНО: на production лучше контролируемые обновления!\n\n# Prometheus + cAdvisor для метрик:\ndocker run -d \\\n  --name cadvisor \\\n  -p 8080:8080 \\\n  -v /var/lib/docker/:/var/lib/docker:ro \\\n  -v /sys:/sys:ro \\\n  -v /var/run:/var/run:ro \\\n  gcr.io/cadvisor/cadvisor\n# Метрики всех контейнеров в Prometheus формате\n# Открыть: http://localhost:8080' },
        { type: 'note', value: 'cAdvisor + Prometheus + Grafana — стандартный стек мониторинга для Docker. cAdvisor собирает метрики контейнеров (CPU, RAM, сеть, диск), Prometheus хранит, Grafana визуализирует. Для простых случаев Portainer предоставляет WebUI управления контейнерами.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Аудит Docker окружения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведи полный аудит Docker окружения и исправь найденные проблемы.',
      requirements: [
        'Запусти несколько контейнеров с намеренными проблемами и диагностируй каждую',
        'Проверь все запущенные контейнеры через docker stats — найди проблемы с ресурсами',
        'Проверь что нет секретов в ENV через docker inspect',
        'Проверь что все контейнеры запущены от non-root пользователя',
        'Запусти docker system df и очисти неиспользуемые ресурсы',
        'Напиши shell скрипт audit.sh который проверяет все эти пункты автоматически'
      ],
      hint: 'docker inspect для деталей. docker stats для ресурсов. docker exec whoami для проверки пользователя. docker system prune для очистки.',
      solution: '# Запустить "проблемные" контейнеры:\ndocker run -d --name bad-app1 -e DB_PASSWORD=secret123 nginx\ndocker run -d --name bad-app2 nginx  # root пользователь\ndocker run -d --name bad-app3 -m 32m nginx  # очень мало памяти\n\n# audit.sh:\n# #!/bin/bash\n# echo "=== DOCKER AUDIT REPORT ==="\n# echo ""\n# echo "--- Running containers ---"\n# docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"\n# echo ""\n# echo "--- Resource usage ---"\n# docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"\n# echo ""\n# echo "--- User check ---"\n# for c in $(docker ps -q); do\n#   name=$(docker inspect $c --format "{{.Name}}")\n#   user=$(docker exec $c whoami 2>/dev/null || echo "unknown")\n#   echo "$name: $user"\n# done\n# echo ""\n# echo "--- ENV secrets check ---"\n# for c in $(docker ps -q); do\n#   name=$(docker inspect $c --format "{{.Name}}")\n#   env=$(docker inspect $c --format "{{.Config.Env}}")\n#   if echo "$env" | grep -qi "password\\|secret\\|token\\|key"; then\n#     echo "WARNING: $name has potential secrets in ENV!"\n#   fi\n# done\n# echo ""\n# echo "--- Disk usage ---"\n# docker system df\n# echo ""\n# echo "--- Cleanup suggestion ---"\n# echo "Run: docker system prune -f"\n\nchmod +x audit.sh\n./audit.sh',
      explanation: 'Регулярный аудит предотвращает накопление технического долга: контейнеры от root, секреты в ENV, переполнение диска. Автоматический скрипт запущенный как cron job позволяет получить уведомление до того как проблема станет критической. В production дополни скрипт отправкой алерта в Slack или PagerDuty.'
    }
  ]
}
