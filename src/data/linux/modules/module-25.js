export default {
  id: 25,
  title: 'Практический проект: production сервер',
  description: 'Полная настройка production Linux-сервера: от базовой конфигурации до деплоя приложения с мониторингом и бэкапами.',
  lessons: [
    {
      id: 1,
      title: 'Планирование: архитектура и требования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перед настройкой production-сервера нужно определить требования: какое приложение, ожидаемая нагрузка, SLA, бюджет. Это определяет выбор ОС, размер сервера, архитектуру.' },
        { type: 'heading', value: 'Проектное задание' },
        { type: 'list', value: [
          'Приложение: веб-приложение (Node.js/Python/Go) + PostgreSQL',
          'Ожидаемая нагрузка: 1000 RPS, 10000 одновременных пользователей',
          'SLA: 99.9% (менее 8.76 часов простоя в год)',
          'Стек: Ubuntu 22.04 LTS + Nginx + App + PostgreSQL',
          'Безопасность: SSH-ключи, firewall, fail2ban, автообновления',
          'Мониторинг: логи, метрики, алертинг',
          'Бэкапы: ежедневные, 30 дней хранения, проверка восстановления'
        ] },
        { type: 'code', language: 'text', value: 'Архитектура сервера:\n\n[Internet] -> [Firewall (UFW)]\n                  |\n              [Nginx :443]\n              SSL termination\n              Static files\n              Rate limiting\n                  |\n              [App :8000]\n              Business logic\n              Health endpoint\n                  |\n              [PostgreSQL :5432]\n              Data storage\n              Daily backups\n\nВспомогательные сервисы:\n- fail2ban (защита SSH)\n- logrotate (ротация логов)\n- unattended-upgrades (автообновления)\n- systemd timer (бэкапы)\n- certbot (SSL сертификаты)' },
        { type: 'tip', value: 'Всегда начинайте с планирования. Даже для одного сервера зафиксируйте: какие сервисы, какие порты, кто имеет доступ, как деплоить, как бэкапить, как мониторить.' }
      ]
    },
    {
      id: 2,
      title: 'Этап 1: Базовая настройка сервера',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первый этап — базовая безопасность и конфигурация: создание пользователя, SSH, firewall, обновления. Этот этап выполняется на каждом новом сервере.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# production-setup-step1.sh — Базовая настройка\nset -euo pipefail\n\nAPP_USER="deploy"\nSSH_PORT=22\n\necho "=== Шаг 1: Обновление системы ==="\napt update && apt upgrade -y\n\necho "=== Шаг 2: Базовые пакеты ==="\napt install -y \\\n    vim htop curl wget tree jq \\\n    fail2ban ufw \\\n    unattended-upgrades \\\n    logrotate rsync \\\n    git build-essential\n\necho "=== Шаг 3: Создание пользователя $APP_USER ==="\nuseradd -m -s /bin/bash -G sudo "$APP_USER"\nmkdir -p /home/$APP_USER/.ssh\nchmod 700 /home/$APP_USER/.ssh\n# Добавьте свой публичный ключ:\n# echo "ssh-ed25519 AAAA..." > /home/$APP_USER/.ssh/authorized_keys\nchmod 600 /home/$APP_USER/.ssh/authorized_keys\nchown -R $APP_USER:$APP_USER /home/$APP_USER/.ssh\n\necho "=== Шаг 4: SSH hardening ==="\nsed -i "s/#PermitRootLogin.*/PermitRootLogin no/" /etc/ssh/sshd_config\nsed -i "s/#PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config\nsed -i "s/#MaxAuthTries.*/MaxAuthTries 3/" /etc/ssh/sshd_config\nsshd -t && systemctl reload sshd\n\necho "=== Шаг 5: Firewall ==="\nufw default deny incoming\nufw default allow outgoing\nufw allow $SSH_PORT/tcp\nufw allow 80/tcp\nufw allow 443/tcp\nufw --force enable\n\necho "=== Шаг 6: fail2ban ==="\ntee /etc/fail2ban/jail.local << \'EOF\'\n[DEFAULT]\nbantime = 3600\nmaxretry = 5\n\n[sshd]\nenabled = true\nmaxretry = 3\nbantime = 86400\nEOF\nsystemctl enable --now fail2ban\n\necho "=== Шаг 7: Автообновления ==="\ndpkg-reconfigure -plow unattended-upgrades\n\necho "=== Базовая настройка завершена ==="' },
        { type: 'note', value: 'После настройки SSH с отключённым root и паролем — убедитесь что вы можете зайти от deploy с ключом. Иначе потеряете доступ к серверу!' }
      ]
    },
    {
      id: 3,
      title: 'Этап 2: Установка сервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Второй этап — установка и настройка основных сервисов: Nginx, PostgreSQL, среды выполнения приложения (Node.js / Python).' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# production-setup-step2.sh — Установка сервисов\nset -euo pipefail\n\necho "=== Nginx ==="\napt install -y nginx\nsystemctl enable nginx\n\n# Убрать версию из ответов:\nsed -i "s/# server_tokens off/server_tokens off/" /etc/nginx/nginx.conf\n\necho "=== PostgreSQL ==="\napt install -y postgresql postgresql-client\nsystemctl enable postgresql\n\n# Создать БД и пользователя:\nsudo -u postgres psql << SQL\nCREATE USER appuser WITH PASSWORD \'$(openssl rand -base64 32)\';\nCREATE DATABASE appdb OWNER appuser;\nGRANT ALL PRIVILEGES ON DATABASE appdb TO appuser;\nSQL\n\necho "=== Node.js (пример) ==="\ncurl -fsSL https://deb.nodesource.com/setup_20.x | bash -\napt install -y nodejs\n\n# Или Python:\n# apt install -y python3 python3-pip python3-venv\n\necho "=== Certbot (SSL) ==="\napt install -y certbot python3-certbot-nginx\n\necho "=== Каталог приложения ==="\nmkdir -p /opt/myapp\nchown deploy:deploy /opt/myapp\n\necho "=== Сервисы установлены ==="' },
        { type: 'tip', value: 'Пароль PostgreSQL генерируется автоматически через openssl rand. Сохраните его в безопасном месте (password manager, Vault). Не используйте простые пароли на production!' }
      ]
    },
    {
      id: 4,
      title: 'Этап 3: Конфигурация Nginx и деплой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Настраиваем Nginx как reverse proxy с SSL, systemd-сервис для приложения, процесс деплоя.' },
        { type: 'code', language: 'nginx', value: '# /etc/nginx/sites-available/myapp\nserver {\n    listen 80;\n    server_name myapp.com www.myapp.com;\n    return 301 https://$host$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name myapp.com www.myapp.com;\n\n    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;\n    ssl_protocols TLSv1.2 TLSv1.3;\n\n    # Security headers\n    add_header X-Frame-Options "SAMEORIGIN" always;\n    add_header X-Content-Type-Options "nosniff" always;\n    add_header Strict-Transport-Security "max-age=63072000" always;\n\n    # Rate limiting\n    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n\n    # Static files\n    location /static/ {\n        alias /opt/myapp/static/;\n        expires 30d;\n        access_log off;\n    }\n\n    # API\n    location / {\n        limit_req zone=api burst=20 nodelay;\n        proxy_pass http://localhost:8000;\n        proxy_http_version 1.1;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n\n    client_max_body_size 10m;\n    access_log /var/log/nginx/myapp-access.log;\n    error_log /var/log/nginx/myapp-error.log;\n}' },
        { type: 'code', language: 'bash', value: '# Systemd сервис для приложения:\nsudo tee /etc/systemd/system/myapp.service << \'EOF\'\n[Unit]\nDescription=My Application\nAfter=network.target postgresql.service\nWants=postgresql.service\n\n[Service]\nType=simple\nUser=deploy\nGroup=deploy\nWorkingDirectory=/opt/myapp\nEnvironmentFile=/opt/myapp/.env\nExecStart=/usr/bin/node /opt/myapp/server.js\nRestart=always\nRestartSec=5\nStandardOutput=journal\nStandardError=journal\nSyslogIdentifier=myapp\n\n[Install]\nWantedBy=multi-user.target\nEOF\n\nsudo systemctl daemon-reload\nsudo systemctl enable myapp\n\n# SSL сертификат:\nsudo certbot --nginx -d myapp.com -d www.myapp.com\n\n# Активировать сайт:\nsudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/\nsudo rm -f /etc/nginx/sites-enabled/default\nsudo nginx -t && sudo systemctl reload nginx' },
        { type: 'tip', value: 'EnvironmentFile=/opt/myapp/.env — конфигурация через переменные окружения (12-factor app). Файл .env содержит DATABASE_URL, SECRET_KEY и другие настройки. Chmod 600 на .env!' }
      ]
    },
    {
      id: 5,
      title: 'Этап 4: Бэкапы и мониторинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Настраиваем автоматические бэкапы, мониторинг сервисов и логирование. Без этого production-сервер — бомба замедленного действия.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# /usr/local/bin/production-backup.sh\nset -euo pipefail\n\nBACKUP_DIR="/backup"\nDATE=$(date +%Y%m%d-%H%M%S)\nRETENTION=30\nLOG="/var/log/backup.log"\n\nlog() { echo "[$(date +%Y-%m-%dT%H:%M:%S)] $1" | tee -a "$LOG"; }\ntrap \'log "ОШИБКА в строке $LINENO"\' ERR\n\nmkdir -p "$BACKUP_DIR"/{db,files}\n\nlog "=== Начало бэкапа ==="\n\n# 1. Бэкап PostgreSQL\nlog "Бэкап PostgreSQL..."\nsudo -u postgres pg_dump -Fc appdb > "$BACKUP_DIR/db/appdb-$DATE.dump"\nlog "БД: $(du -h "$BACKUP_DIR/db/appdb-$DATE.dump" | cut -f1)"\n\n# 2. Бэкап файлов\nlog "Бэкап файлов..."\ntar -czf "$BACKUP_DIR/files/config-$DATE.tar.gz" \\\n    /etc/nginx /etc/systemd/system/myapp.service \\\n    /opt/myapp/.env 2>/dev/null\nlog "Файлы: $(du -h "$BACKUP_DIR/files/config-$DATE.tar.gz" | cut -f1)"\n\n# 3. Ротация\nlog "Ротация (удаление старше $RETENTION дней)..."\nfind "$BACKUP_DIR" -name "*.dump" -mtime +$RETENTION -delete\nfind "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION -delete\n\nlog "=== Бэкап завершён ==="' },
        { type: 'heading', value: 'Мониторинг' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# /usr/local/bin/production-monitor.sh\n\nHOSTNAME=$(hostname)\nALERT_WEBHOOK="https://hooks.slack.com/services/xxx"  # или Telegram\n\nalert() {\n    local MSG="[$HOSTNAME] $1"\n    logger -t production-monitor "$MSG"\n    # curl -X POST "$ALERT_WEBHOOK" -d "{\"text\": \"$MSG\"}" 2>/dev/null\n    echo "$MSG"\n}\n\n# Проверка сервисов\nfor SVC in nginx myapp postgresql; do\n    if ! systemctl is-active "$SVC" &>/dev/null; then\n        alert "CRITICAL: $SVC is DOWN!"\n    fi\ndone\n\n# Проверка диска (> 85%)\ndf -h --output=target,pcent | tail -n+2 | while read MOUNT PCT; do\n    NUM=${PCT%\\%}\n    [ "$NUM" -gt 85 ] && alert "WARNING: Disk $MOUNT at ${PCT}"\ndone\n\n# Проверка RAM\nAVAIL=$(free -m | awk \'/Mem:/ {print $7}\')\n[ "$AVAIL" -lt 256 ] && alert "WARNING: Low memory (${AVAIL}MB available)"\n\n# Проверка HTTP\nHTTP=$(curl -sf -o /dev/null -w "%{http_code}" http://localhost/health 2>/dev/null || echo "000")\n[ "$HTTP" != "200" ] && alert "CRITICAL: Health check failed (HTTP $HTTP)"\n\n# Проверка SSL (дней до истечения)\nEXPIRY=$(echo | openssl s_client -servername myapp.com -connect localhost:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)\nif [ -n "$EXPIRY" ]; then\n    DAYS=$(( ($(date -d "$EXPIRY" +%s) - $(date +%s)) / 86400 ))\n    [ "$DAYS" -lt 14 ] && alert "WARNING: SSL expires in $DAYS days"\nfi' },
        { type: 'code', language: 'bash', value: '# Автоматизация через cron:\nsudo crontab -e\n# Бэкап каждый день в 3:00:\n# 0 3 * * * /usr/local/bin/production-backup.sh\n# Мониторинг каждую минуту:\n# * * * * * /usr/local/bin/production-monitor.sh' },
        { type: 'tip', value: 'Отправляйте алерты в Slack/Telegram, а не на email — email слишком медленный для критических проблем. Проверяйте SSL-сертификат за 14 дней до истечения — certbot может не обновить автоматически.' }
      ]
    },
    {
      id: 6,
      title: 'Этап 5: Скрипт деплоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Автоматический деплой — обновление приложения одной командой. Включает: pull кода, установку зависимостей, миграции БД, перезапуск сервиса, health check.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# /usr/local/bin/deploy.sh\nset -euo pipefail\n\nAPP_DIR="/opt/myapp"\nBRANCH="${1:-main}"\nLOG="/var/log/deploy.log"\n\nlog() { echo "[$(date +%Y-%m-%dT%H:%M:%S)] $1" | tee -a "$LOG"; }\n\nlog "=== Деплой ветки $BRANCH ==="\n\n# 1. Pre-deploy бэкап\nlog "Pre-deploy бэкап..."\nsudo -u postgres pg_dump -Fc appdb > "/backup/pre-deploy-$(date +%Y%m%d%H%M%S).dump"\n\n# 2. Pull кода\nlog "Обновление кода..."\ncd "$APP_DIR"\ngit fetch origin\ngit checkout "$BRANCH"\ngit pull origin "$BRANCH"\n\n# 3. Зависимости\nlog "Установка зависимостей..."\nnpm ci --production    # или pip install -r requirements.txt\n\n# 4. Миграции БД\nlog "Миграции БД..."\nnpm run migrate        # или python manage.py migrate\n\n# 5. Перезапуск\nlog "Перезапуск приложения..."\nsudo systemctl restart myapp\n\n# 6. Health check\nlog "Health check..."\nfor i in {1..15}; do\n    if curl -sf http://localhost:8000/health &>/dev/null; then\n        log "Приложение работает!"\n        log "=== Деплой завершён успешно ==="\n        exit 0\n    fi\n    log "Ожидание... ($i/15)"\n    sleep 2\ndone\n\nlog "ОШИБКА: Health check не прошёл!"\nlog "Откат: восстановление из бэкапа..."\nexit 1' },
        { type: 'tip', value: 'Всегда делайте бэкап БД ПЕРЕД деплоем (pre-deploy backup). Если что-то пойдёт не так с миграциями — можно быстро откатить. Health check после перезапуска — обязателен.' }
      ]
    },
    {
      id: 7,
      title: 'Финальная практика: Production сервер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Выполните полную настройку production Linux-сервера.',
      requirements: [
        'Выполните базовую настройку: пользователь, SSH, firewall, fail2ban',
        'Установите и настройте Nginx с reverse proxy на порт 8000',
        'Установите PostgreSQL, создайте БД и пользователя',
        'Создайте systemd-сервис для приложения',
        'Настройте ежедневные бэкапы БД с ротацией 30 дней',
        'Создайте скрипт мониторинга сервисов (nginx, postgresql)',
        'Создайте скрипт деплоя с health check'
      ],
      hint: 'Используйте скрипты из предыдущих уроков как основу. Каждый шаг проверяйте перед переходом к следующему. systemctl status для проверки сервисов. nginx -t для проверки конфигов.',
      expectedOutput: 'Пользователь deploy: создан, SSH-ключ настроен\nUFW: active, 22/80/443 ALLOW\nfail2ban: active, sshd jail enabled\nNginx: active, reverse proxy на :8000\nPostgreSQL: active, appdb создана\nmyapp.service: created, enabled\nБэкап: /usr/local/bin/backup.sh в cron (3:00)\nМониторинг: /usr/local/bin/monitor.sh в cron (каждую минуту)\nДеплой: /usr/local/bin/deploy.sh готов',
      solution: '# Полная настройка production сервера\n\n# 1. Базовая настройка\nsudo apt update && sudo apt upgrade -y\nsudo apt install -y vim htop curl wget fail2ban ufw nginx postgresql certbot\n\nsudo useradd -m -s /bin/bash -G sudo deploy\nsudo mkdir -p /home/deploy/.ssh\nsudo chmod 700 /home/deploy/.ssh\n\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow ssh\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw --force enable\n\nsudo systemctl enable --now fail2ban\n\n# 2. Nginx reverse proxy\nsudo tee /etc/nginx/sites-available/myapp << \'NGINX\'\nserver {\n    listen 80;\n    server_name _;\n    location / {\n        proxy_pass http://localhost:8000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}\nNGINX\nsudo ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/default\nsudo nginx -t && sudo systemctl reload nginx\n\n# 3. PostgreSQL\nsudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD \'secure_pass\';"\nsudo -u postgres psql -c "CREATE DATABASE appdb OWNER appuser;"\n\n# 4. Systemd сервис\nsudo tee /etc/systemd/system/myapp.service << \'SVC\'\n[Unit]\nDescription=My Application\nAfter=network.target postgresql.service\n[Service]\nType=simple\nUser=deploy\nWorkingDirectory=/opt/myapp\nExecStart=/usr/bin/node /opt/myapp/server.js\nRestart=always\nRestartSec=5\n[Install]\nWantedBy=multi-user.target\nSVC\nsudo systemctl daemon-reload\nsudo systemctl enable myapp\n\n# 5. Бэкап\nsudo tee /usr/local/bin/backup.sh << \'BACKUP\'\n#!/bin/bash\nmkdir -p /backup\nsudo -u postgres pg_dump -Fc appdb > /backup/appdb-$(date +%Y%m%d).dump\nfind /backup -name "*.dump" -mtime +30 -delete\nBACKUP\nsudo chmod +x /usr/local/bin/backup.sh\necho "0 3 * * * /usr/local/bin/backup.sh" | sudo crontab -\n\n# 6. Мониторинг\nsudo tee /usr/local/bin/monitor.sh << \'MON\'\n#!/bin/bash\nfor SVC in nginx postgresql; do\n    systemctl is-active "$SVC" &>/dev/null || logger -t monitor "ALERT: $SVC is DOWN"\ndone\nMON\nsudo chmod +x /usr/local/bin/monitor.sh\n\n# 7. Деплой\nsudo tee /usr/local/bin/deploy.sh << \'DEPLOY\'\n#!/bin/bash\nset -euo pipefail\ncd /opt/myapp && git pull origin main\nsudo systemctl restart myapp\nsleep 5\ncurl -sf http://localhost:8000/health && echo "Deploy OK" || echo "Deploy FAILED"\nDEPLOY\nsudo chmod +x /usr/local/bin/deploy.sh\n\necho "=== Production сервер настроен ==="',
      explanation: 'Полная настройка включает: безопасность (SSH, firewall, fail2ban), сервисы (Nginx, PostgreSQL), приложение (systemd service), бэкапы (cron + pg_dump + ротация), мониторинг (cron + проверка сервисов), деплой (git pull + restart + health check). Каждый компонент проверяется после настройки.'
    }
  ]
}
