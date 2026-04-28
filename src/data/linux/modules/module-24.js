export default {
  id: 24,
  title: 'Высокая доступность',
  description: 'HAProxy, keepalived, кластеризация, балансировка нагрузки, failover.',
  lessons: [
    {
      id: 1,
      title: 'Концепции высокой доступности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Высокая доступность (HA) — способность системы продолжать работу при отказе компонентов. Измеряется в "девятках": 99.9% = 8.76 часов простоя в год, 99.99% = 52 минуты, 99.999% = 5 минут.' },
        { type: 'heading', value: 'Ключевые концепции' },
        { type: 'list', value: [
          'Redundancy — дублирование компонентов (несколько серверов, дисков, сетей)',
          'Failover — автоматическое переключение на резерв при отказе',
          'Load Balancing — распределение нагрузки между серверами',
          'Health Checks — проверка работоспособности компонентов',
          'Floating IP (VIP) — виртуальный IP, перемещающийся между серверами',
          'Split-brain — проблема когда оба узла считают себя primary'
        ] },
        { type: 'code', language: 'text', value: 'Типичная HA-архитектура:\n\n                   [Clients]\n                      |\n               [Floating VIP]\n                 /         \\\n        [HAProxy-1]    [HAProxy-2]     <- keepalived (failover)\n           |    \\         /    |\n        [Web-1] [Web-2] [Web-3]       <- backend servers\n           |       |       |\n        [DB Primary] -> [DB Replica]  <- replication + failover' },
        { type: 'tip', value: 'HA — это не один инструмент, а архитектурный подход. Устраните Single Points of Failure (SPOF): каждый критический компонент должен быть продублирован с автоматическим failover.' }
      ]
    },
    {
      id: 2,
      title: 'HAProxy — балансировка нагрузки',
      type: 'theory',
      content: [
        { type: 'text', value: 'HAProxy — высокопроизводительный TCP/HTTP балансировщик нагрузки. Распределяет трафик между несколькими backend-серверами, проверяет их здоровье и убирает нерабочие.' },
        { type: 'code', language: 'bash', value: '# Установка:\nsudo apt install haproxy\nsudo systemctl enable --now haproxy' },
        { type: 'code', language: 'text', value: '# /etc/haproxy/haproxy.cfg\n\nglobal\n    maxconn 50000\n    log /dev/log local0\n    chroot /var/lib/haproxy\n    stats socket /run/haproxy/admin.sock mode 660 level admin\n    user haproxy\n    group haproxy\n    daemon\n\ndefaults\n    mode http\n    log global\n    option httplog\n    option dontlognull\n    timeout connect 5s\n    timeout client 30s\n    timeout server 30s\n    retries 3\n\nfrontend http_front\n    bind *:80\n    bind *:443 ssl crt /etc/ssl/certs/mysite.pem\n    redirect scheme https if !{ ssl_fc }\n    default_backend web_servers\n\nbackend web_servers\n    balance roundrobin\n    option httpchk GET /health\n    http-check expect status 200\n    server web1 10.0.1.1:8000 check inter 5s fall 3 rise 2\n    server web2 10.0.1.2:8000 check inter 5s fall 3 rise 2\n    server web3 10.0.1.3:8000 check inter 5s fall 3 rise 2 backup\n\nlisten stats\n    bind *:8404\n    stats enable\n    stats uri /stats\n    stats auth admin:password' },
        { type: 'code', language: 'bash', value: '# Проверить конфигурацию:\nsudo haproxy -c -f /etc/haproxy/haproxy.cfg\nsudo systemctl reload haproxy\n\n# Статистика: http://server:8404/stats\n\n# Алгоритмы балансировки:\n# roundrobin — по очереди (по умолчанию)\n# leastconn  — на сервер с наименьшим числом соединений\n# source     — один клиент всегда на один сервер (sticky)\n# uri        — по URI (для кэширования)\n\n# Health checks:\n# check          — включить проверку\n# inter 5s       — проверять каждые 5 секунд\n# fall 3         — 3 неудачи = сервер мёртв\n# rise 2         — 2 успеха = сервер жив\n# backup         — использовать только если все основные упали' },
        { type: 'tip', value: 'HAProxy + health checks — сервер автоматически выводится из балансировки при проблемах и возвращается когда починится. Endpoint /health должен проверять подключение к БД и другие зависимости.' }
      ]
    },
    {
      id: 3,
      title: 'keepalived — Floating IP и failover',
      type: 'theory',
      content: [
        { type: 'text', value: 'keepalived управляет виртуальным (floating) IP-адресом между серверами с помощью протокола VRRP. При отказе master, backup-сервер автоматически перехватывает VIP.' },
        { type: 'code', language: 'bash', value: '# Установка:\nsudo apt install keepalived\n\n# Конфигурация MASTER: /etc/keepalived/keepalived.conf\nvrrp_script check_haproxy {\n    script "/usr/bin/systemctl is-active haproxy"\n    interval 2\n    weight -20\n    fall 3\n    rise 2\n}\n\nvrrp_instance VI_1 {\n    state MASTER\n    interface eth0\n    virtual_router_id 51\n    priority 100\n    advert_int 1\n\n    authentication {\n        auth_type PASS\n        auth_pass secret123\n    }\n\n    virtual_ipaddress {\n        192.168.1.100/24\n    }\n\n    track_script {\n        check_haproxy\n    }\n}\n\n# Конфигурация BACKUP (на втором сервере):\n# Отличия: state BACKUP, priority 90\n\n# Запуск:\nsudo systemctl enable --now keepalived\n\n# Проверить VIP:\nip addr show eth0 | grep 192.168.1.100\n\n# Тест failover:\nsudo systemctl stop haproxy\n# VIP переедет на backup сервер за 3-5 секунд\nip addr show eth0  # VIP пропал\n# На backup: ip addr show eth0  # VIP появился' },
        { type: 'note', value: 'virtual_router_id должен быть одинаковым на master и backup, но уникальным в сети. auth_pass одинаковый на обоих серверах. priority выше на master. При падении haproxy weight -20 снижает приоритет.' }
      ]
    },
    {
      id: 4,
      title: 'Мониторинг и алертинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мониторинг — глаза и уши HA-системы. Без мониторинга вы не узнаете о проблемах пока пользователи не пожалуются. Prometheus + Grafana — стандартный стек мониторинга.' },
        { type: 'code', language: 'bash', value: '# Node Exporter — сбор метрик Linux:\nsudo apt install prometheus-node-exporter\nsudo systemctl enable --now prometheus-node-exporter\n# Метрики: http://localhost:9100/metrics\n\n# Простой мониторинг на bash:\n#!/bin/bash\n# /usr/local/bin/check-services.sh\n\nSERVICES=("nginx" "postgresql" "haproxy")\nALERT_EMAIL="admin@example.com"\n\nfor SERVICE in "${SERVICES[@]}"; do\n    if ! systemctl is-active "$SERVICE" &>/dev/null; then\n        MSG="ALERT: $SERVICE is DOWN on $(hostname) at $(date)"\n        echo "$MSG" | mail -s "$MSG" "$ALERT_EMAIL"\n        logger -t monitoring "$MSG"\n    fi\ndone\n\n# Проверка доступности веб-сервиса:\nHTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)\nif [[ "$HTTP_CODE" != "200" ]]; then\n    logger -t monitoring "ALERT: Health check failed (HTTP $HTTP_CODE)"\nfi' },
        { type: 'heading', value: 'Что мониторить' },
        { type: 'list', value: [
          'CPU load, Memory usage, Disk usage, Disk I/O',
          'Network traffic, packet loss, latency',
          'Сервисы: nginx, postgresql, haproxy — running?',
          'HTTP endpoints: /health возвращает 200?',
          'SSL сертификаты: когда истекают?',
          'Логи: количество ошибок растёт?',
          'Бэкапы: последний бэкап успешен?',
          'DNS: домены резолвятся?'
        ] },
        { type: 'tip', value: 'Минимальный мониторинг: cron-скрипт проверяет сервисы каждую минуту и шлёт email/Telegram при проблемах. Для серьёзной инфраструктуры: Prometheus + Grafana + Alertmanager.' }
      ]
    },
    {
      id: 5,
      title: 'Blue-Green и Rolling деплой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Zero-downtime деплой — обновление приложения без прерывания обслуживания. Blue-Green: два идентичных окружения, трафик переключается. Rolling: серверы обновляются по одному.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# Rolling deploy — обновление серверов по одному\nset -euo pipefail\n\nSERVERS=("web1" "web2" "web3")\nAPP_DIR="/opt/myapp"\nREPO="git@github.com:user/app.git"\nBRANCH="main"\n\nfor SERVER in "${SERVERS[@]}"; do\n    echo "=== Deploying to $SERVER ==="\n\n    # 1. Вывести из балансировки\n    echo "Draining $SERVER from HAProxy..."\n    ssh haproxy "echo \\"disable server web_servers/$SERVER\\" | socat stdio /run/haproxy/admin.sock"\n    sleep 5  # дождаться завершения текущих запросов\n\n    # 2. Обновить код\n    ssh $SERVER "cd $APP_DIR && git pull origin $BRANCH"\n\n    # 3. Перезапустить приложение\n    ssh $SERVER "sudo systemctl restart myapp"\n    sleep 10  # дождаться запуска\n\n    # 4. Health check\n    for i in {1..10}; do\n        if ssh $SERVER "curl -sf http://localhost:8000/health" &>/dev/null; then\n            echo "$SERVER is healthy"\n            break\n        fi\n        echo "Waiting for $SERVER... ($i/10)"\n        sleep 3\n    done\n\n    # 5. Вернуть в балансировку\n    echo "Enabling $SERVER in HAProxy..."\n    ssh haproxy "echo \\"enable server web_servers/$SERVER\\" | socat stdio /run/haproxy/admin.sock"\n\n    echo "=== $SERVER deployed ==="\ndone\n\necho "=== All servers deployed ==="' },
        { type: 'tip', value: 'Rolling deploy — простейший zero-downtime деплой. Серверы обновляются по одному, остальные продолжают обслуживать трафик. HAProxy автоматически перенаправляет запросы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Высокая доступность',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируйте и настройте HA-архитектуру.',
      requirements: [
        'Установите и настройте HAProxy для балансировки между двумя backend',
        'Настройте health checks для backend серверов',
        'Включите статистику HAProxy на порту 8404',
        'Напишите скрипт проверки доступности всех компонентов',
        'Создайте скрипт rolling deploy для обновления серверов',
        'Нарисуйте (опишите) архитектуру HA для вашего проекта'
      ],
      hint: 'sudo apt install haproxy. Конфиг в /etc/haproxy/haproxy.cfg. option httpchk для health check. listen stats для статистики. curl -sf для проверки.',
      expectedOutput: 'HAProxy: running, балансирует web1 и web2\nHealth checks: web1 UP, web2 UP\nСтатистика: http://localhost:8404/stats\nМониторинг: все сервисы active\nRolling deploy: скрипт создан\nАрхитектура: VIP -> HAProxy x2 -> Web x3 -> DB primary+replica',
      solution: '# 1-3. HAProxy конфигурация\nsudo apt install -y haproxy\nsudo tee /etc/haproxy/haproxy.cfg << \'EOF\'\nglobal\n    maxconn 50000\n    log /dev/log local0\n    user haproxy\n    group haproxy\n    daemon\n\ndefaults\n    mode http\n    log global\n    timeout connect 5s\n    timeout client 30s\n    timeout server 30s\n\nfrontend http_front\n    bind *:80\n    default_backend web_servers\n\nbackend web_servers\n    balance roundrobin\n    option httpchk GET /\n    server web1 127.0.0.1:8001 check inter 5s fall 3 rise 2\n    server web2 127.0.0.1:8002 check inter 5s fall 3 rise 2\n\nlisten stats\n    bind *:8404\n    stats enable\n    stats uri /stats\n    stats auth admin:admin\nEOF\n\nsudo haproxy -c -f /etc/haproxy/haproxy.cfg\nsudo systemctl restart haproxy\n\n# 4. Скрипт мониторинга\ncat << \'SCRIPT\'\n#!/bin/bash\nfor PORT in 80 8001 8002 8404; do\n    if curl -sf http://localhost:$PORT/ &>/dev/null; then\n        echo "Port $PORT: OK"\n    else\n        echo "Port $PORT: FAIL"\n    fi\ndone\nSCRIPT\n\n# 5. Rolling deploy script (см. теорию)\n\n# 6. Архитектура\necho "VIP (192.168.1.100) -> keepalived"\necho "  -> HAProxy-1 (master) + HAProxy-2 (backup)"\necho "    -> Web-1, Web-2, Web-3 (backend)"\necho "      -> PostgreSQL Primary -> Replica"',
      explanation: 'HAProxy распределяет трафик между backend серверами. Health checks автоматически выводят сломанные серверы из балансировки. Статистика на /stats показывает состояние всех серверов. keepalived обеспечивает failover самого HAProxy через floating VIP.'
    }
  ]
}
