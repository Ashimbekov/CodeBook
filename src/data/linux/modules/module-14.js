export default {
  id: 14,
  title: 'Веб-серверы (Nginx)',
  description: 'Nginx: установка, конфигурация, виртуальные хосты, reverse proxy, SSL/TLS, оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'Установка и архитектура Nginx',
      type: 'theory',
      content: [
        { type: 'text', value: 'Nginx — высокопроизводительный веб-сервер и reverse proxy. Использует событийную модель (event-driven), эффективно обрабатывает тысячи одновременных соединений. Основные роли: статический контент, reverse proxy, балансировка нагрузки, SSL-терминация.' },
        { type: 'code', language: 'bash', value: '# Установка:\nsudo apt update\nsudo apt install nginx\n\n# Проверить статус:\nsudo systemctl status nginx\nsudo systemctl enable nginx\n\n# Тест конфигурации:\nsudo nginx -t\n# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\n# nginx: configuration file /etc/nginx/nginx.conf test is successful\n\n# Перезагрузка (без downtime):\nsudo systemctl reload nginx\n\n# Файловая структура:\n# /etc/nginx/nginx.conf           — главный конфиг\n# /etc/nginx/sites-available/     — конфиги сайтов\n# /etc/nginx/sites-enabled/       — активные сайты (симлинки)\n# /etc/nginx/conf.d/              — дополнительные конфиги\n# /var/www/html/                  — файлы сайта по умолчанию\n# /var/log/nginx/access.log       — лог доступа\n# /var/log/nginx/error.log        — лог ошибок' },
        { type: 'tip', value: 'Всегда выполняйте sudo nginx -t перед sudo systemctl reload nginx. Это проверит синтаксис конфигурации и предотвратит падение сервера.' }
      ]
    },
    {
      id: 2,
      title: 'Конфигурация Nginx',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конфигурация Nginx иерархическая: main -> events -> http -> server -> location. Директивы наследуются сверху вниз. Каждый server-блок определяет виртуальный хост.' },
        { type: 'code', language: 'nginx', value: '# /etc/nginx/nginx.conf — главный конфиг\nuser www-data;\nworker_processes auto;          # автоопределение по CPU\npid /run/nginx.pid;\n\nevents {\n    worker_connections 1024;     # максимум соединений на воркер\n    multi_accept on;\n}\n\nhttp {\n    # Базовые настройки\n    sendfile on;\n    tcp_nopush on;\n    keepalive_timeout 65;\n    types_hash_max_size 2048;\n    server_tokens off;          # не показывать версию Nginx\n\n    # MIME-типы\n    include /etc/nginx/mime.types;\n    default_type application/octet-stream;\n\n    # Логи\n    access_log /var/log/nginx/access.log;\n    error_log /var/log/nginx/error.log;\n\n    # Gzip сжатие\n    gzip on;\n    gzip_types text/plain text/css application/json application/javascript;\n    gzip_min_length 1000;\n\n    # Подключение конфигов сайтов\n    include /etc/nginx/conf.d/*.conf;\n    include /etc/nginx/sites-enabled/*;\n}' },
        { type: 'note', value: 'worker_processes auto установит количество воркеров равное числу ядер CPU. server_tokens off скрывает версию Nginx в ответах — базовая мера безопасности.' }
      ]
    },
    {
      id: 3,
      title: 'Виртуальные хосты (server blocks)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Виртуальные хосты позволяют обслуживать несколько сайтов на одном сервере. Каждый server block обрабатывает запросы к определённому домену.' },
        { type: 'code', language: 'nginx', value: '# /etc/nginx/sites-available/mysite.conf\nserver {\n    listen 80;\n    server_name mysite.com www.mysite.com;\n    root /var/www/mysite;\n    index index.html index.htm;\n\n    # Статический контент\n    location / {\n        try_files $uri $uri/ =404;\n    }\n\n    # Кэширование статики\n    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2)$ {\n        expires 30d;\n        add_header Cache-Control "public, immutable";\n    }\n\n    # Запретить доступ к скрытым файлам\n    location ~ /\\. {\n        deny all;\n    }\n\n    # Кастомные страницы ошибок\n    error_page 404 /404.html;\n    error_page 500 502 503 504 /50x.html;\n}' },
        { type: 'code', language: 'bash', value: '# Создать каталог сайта:\nsudo mkdir -p /var/www/mysite\nsudo chown -R www-data:www-data /var/www/mysite\necho "<h1>My Site</h1>" | sudo tee /var/www/mysite/index.html\n\n# Активировать сайт (симлинк):\nsudo ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/\n\n# Удалить дефолтный сайт:\nsudo rm /etc/nginx/sites-enabled/default\n\n# Проверить и применить:\nsudo nginx -t\nsudo systemctl reload nginx' },
        { type: 'tip', value: 'Конфиги сайтов создавайте в sites-available/ и активируйте симлинками в sites-enabled/. Это позволяет быстро включать/отключать сайты без удаления конфигов.' }
      ]
    },
    {
      id: 4,
      title: 'Reverse Proxy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Reverse proxy — Nginx принимает запросы и перенаправляет их к backend-серверу (Node.js, Python, Java). Это позволяет использовать SSL, кэширование, балансировку нагрузки на уровне Nginx.' },
        { type: 'code', language: 'nginx', value: '# Reverse proxy для Node.js/Python/Go приложения\nserver {\n    listen 80;\n    server_name api.mysite.com;\n\n    location / {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n\n        # Таймауты\n        proxy_connect_timeout 60s;\n        proxy_send_timeout 60s;\n        proxy_read_timeout 60s;\n    }\n}\n\n# Балансировка нагрузки (load balancing)\nupstream backend {\n    least_conn;                   # метод балансировки\n    server 10.0.1.1:3000;\n    server 10.0.1.2:3000;\n    server 10.0.1.3:3000 backup;  # запасной сервер\n}\n\nserver {\n    listen 80;\n    server_name app.mysite.com;\n\n    location / {\n        proxy_pass http://backend;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}' },
        { type: 'note', value: 'proxy_set_header X-Real-IP — передаёт реальный IP клиента backend-серверу. Без этого backend будет видеть IP Nginx (127.0.0.1). proxy_set_header X-Forwarded-Proto важен для правильной работы HTTPS redirect.' }
      ]
    },
    {
      id: 5,
      title: 'SSL/TLS с Let\'s Encrypt',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSL/TLS шифрует трафик между клиентом и сервером (HTTPS). Let\'s Encrypt предоставляет бесплатные SSL-сертификаты. certbot автоматизирует получение и обновление сертификатов.' },
        { type: 'code', language: 'bash', value: '# Установка certbot:\nsudo apt install certbot python3-certbot-nginx\n\n# Получить сертификат (автоматически настроит Nginx):\nsudo certbot --nginx -d mysite.com -d www.mysite.com\n\n# Или только получить сертификат (ручная настройка):\nsudo certbot certonly --nginx -d mysite.com\n\n# Автоматическое обновление (certbot создаёт таймер):\nsudo certbot renew --dry-run    # проверить обновление\nsystemctl list-timers | grep certbot' },
        { type: 'code', language: 'nginx', value: '# HTTPS конфигурация (после certbot):\nserver {\n    listen 443 ssl http2;\n    server_name mysite.com www.mysite.com;\n\n    ssl_certificate /etc/letsencrypt/live/mysite.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/mysite.com/privkey.pem;\n\n    # Безопасные SSL настройки\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\n    ssl_prefer_server_ciphers off;\n\n    # HSTS\n    add_header Strict-Transport-Security "max-age=63072000" always;\n\n    root /var/www/mysite;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ =404;\n    }\n}\n\n# Redirect HTTP -> HTTPS\nserver {\n    listen 80;\n    server_name mysite.com www.mysite.com;\n    return 301 https://$host$request_uri;\n}' },
        { type: 'tip', value: 'certbot --nginx — самый простой способ настроить SSL. Он автоматически изменит конфиг Nginx, добавит сертификаты и настроит redirect с HTTP на HTTPS.' }
      ]
    },
    {
      id: 6,
      title: 'Безопасность и оптимизация Nginx',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильная настройка безопасности и оптимизации Nginx защищает от атак и улучшает производительность. Security headers, rate limiting, gzip — базовые настройки для production.' },
        { type: 'code', language: 'nginx', value: '# Security headers\nadd_header X-Frame-Options "SAMEORIGIN" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header X-XSS-Protection "1; mode=block" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\nadd_header Content-Security-Policy "default-src \'self\'" always;\n\n# Rate limiting (защита от DDoS)\nlimit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n\nserver {\n    location /api/ {\n        limit_req zone=api burst=20 nodelay;\n        proxy_pass http://localhost:3000;\n    }\n}\n\n# Ограничение размера body (защита от больших загрузок)\nclient_max_body_size 10m;\n\n# Gzip сжатие\ngzip on;\ngzip_vary on;\ngzip_comp_level 6;\ngzip_min_length 1000;\ngzip_types text/plain text/css application/json application/javascript\n           text/xml application/xml image/svg+xml;\n\n# Кэширование статики\nlocation ~* \\.(css|js|png|jpg|gif|ico|woff2)$ {\n    expires 1y;\n    add_header Cache-Control "public, immutable";\n    access_log off;\n}' },
        { type: 'tip', value: 'rate limiting (limit_req) — простая защита API от перегрузки. 10r/s с burst=20 означает: нормально 10 запросов в секунду, до 20 в пике. Превышение — 503 ошибка.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Настройка Nginx',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Nginx как веб-сервер и reverse proxy.',
      requirements: [
        'Установите Nginx и проверьте что он работает',
        'Создайте виртуальный хост для статического сайта',
        'Настройте reverse proxy для приложения на порту 3000',
        'Добавьте security headers и gzip сжатие',
        'Настройте кэширование статических файлов на 30 дней',
        'Проверьте конфигурацию через nginx -t и просмотрите логи'
      ],
      hint: 'sudo apt install nginx. Конфиг в /etc/nginx/sites-available/. Симлинк в sites-enabled/. proxy_pass http://localhost:3000. Логи в /var/log/nginx/.',
      expectedOutput: 'nginx -t: syntax is ok, test is successful\ncurl http://localhost: HTML страница сайта\ncurl -I: security headers присутствуют\ngzip: Content-Encoding: gzip в ответе\nЛоги: access.log показывает запросы',
      solution: '# 1. Установка\nsudo apt install -y nginx\nsudo systemctl enable --now nginx\ncurl http://localhost\n\n# 2. Статический сайт\nsudo mkdir -p /var/www/mysite\necho "<h1>Welcome to My Site</h1>" | sudo tee /var/www/mysite/index.html\nsudo tee /etc/nginx/sites-available/mysite << \'EOF\'\nserver {\n    listen 80;\n    server_name mysite.local;\n    root /var/www/mysite;\n    index index.html;\n\n    add_header X-Frame-Options "SAMEORIGIN" always;\n    add_header X-Content-Type-Options "nosniff" always;\n\n    gzip on;\n    gzip_types text/plain text/css application/json application/javascript;\n\n    location / {\n        try_files $uri $uri/ =404;\n    }\n\n    location ~* \\.(css|js|png|jpg|gif|ico)$ {\n        expires 30d;\n    }\n}\nEOF\n\nsudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/\nsudo rm -f /etc/nginx/sites-enabled/default\nsudo nginx -t\nsudo systemctl reload nginx\n\n# 3-6. Проверка\ncurl -I http://localhost\ntail -20 /var/log/nginx/access.log\ntail -20 /var/log/nginx/error.log',
      explanation: 'Nginx конфиги создаются в sites-available и активируются симлинками в sites-enabled. proxy_pass перенаправляет запросы к backend. Security headers защищают от XSS, clickjacking. gzip сжимает текстовый контент. nginx -t проверяет синтаксис.'
    }
  ]
}
