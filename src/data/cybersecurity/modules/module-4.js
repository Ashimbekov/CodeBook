export default {
  id: 4,
  title: 'Криптография: практика',
  description: 'TLS/SSL протокол, сертификаты, PKI инфраструктура, HTTPS, Let\'s Encrypt и практическое применение криптографии в веб-приложениях.',
  lessons: [
    {
      id: 1,
      title: 'TLS/SSL: как работает HTTPS',
      type: 'theory',
      content: [
        { type: 'text', value: 'TLS (Transport Layer Security) — протокол шифрования данных в транзите. HTTPS = HTTP + TLS. TLS обеспечивает: конфиденциальность (шифрование), целостность (MAC), аутентификацию сервера (сертификат).' },
        { type: 'heading', value: 'TLS Handshake (TLS 1.3)' },
        { type: 'list', value: [
          '1. Client Hello — клиент отправляет поддерживаемые cipher suites, случайное число',
          '2. Server Hello — сервер выбирает cipher suite, отправляет сертификат',
          '3. Key Exchange — ECDHE обмен ключами (Forward Secrecy)',
          '4. Finished — обе стороны вычисляют session keys, начинается шифрование',
          'TLS 1.3: 1 round-trip (1-RTT), TLS 1.2: 2 round-trips (2-RTT)'
        ]},
        { type: 'code', language: 'bash', value: '# Проверка TLS конфигурации сервера\n\n# Информация о сертификате\nopenssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | \\\n  openssl x509 -noout -subject -issuer -dates\n# subject= CN = example.com\n# issuer= C = US, O = Let\'s Encrypt, CN = R3\n# notBefore=Jan 01 00:00:00 2026 GMT\n# notAfter=Apr 01 00:00:00 2026 GMT\n\n# Проверка версии TLS и cipher suite\nopenssl s_client -connect example.com:443 -tls1_3 < /dev/null 2>/dev/null | \\\n  grep -E "(Protocol|Cipher)"\n# Protocol  : TLSv1.3\n# Cipher    : TLS_AES_256_GCM_SHA384\n\n# Тестирование всех протоколов\nfor proto in tls1 tls1_1 tls1_2 tls1_3; do\n  echo -n "$proto: "\n  openssl s_client -connect example.com:443 -$proto < /dev/null 2>&1 | \\\n    grep -q "Cipher is" && echo "SUPPORTED" || echo "NOT SUPPORTED"\ndone\n# tls1: NOT SUPPORTED (хорошо!)\n# tls1_1: NOT SUPPORTED (хорошо!)\n# tls1_2: SUPPORTED\n# tls1_3: SUPPORTED\n\n# Полный аудит с помощью testssl.sh\n# git clone https://github.com/drwetter/testssl.sh.git\n# ./testssl.sh example.com' },
        { type: 'warning', value: 'TLS 1.0 и 1.1 устарели и небезопасны. Минимальная версия — TLS 1.2, рекомендуемая — TLS 1.3. Убедитесь что ваш сервер не поддерживает устаревшие протоколы и слабые cipher suites.' }
      ]
    },
    {
      id: 2,
      title: 'Сертификаты и PKI',
      type: 'theory',
      content: [
        { type: 'text', value: 'PKI (Public Key Infrastructure) — система доверия, основанная на иерархии сертификатов. Корневые CA (Certificate Authority) подписывают сертификаты промежуточных CA, которые подписывают сертификаты серверов. Браузер доверяет предустановленным корневым CA.' },
        { type: 'heading', value: 'Структура X.509 сертификата' },
        { type: 'list', value: [
          'Subject — кому выдан (CN=example.com)',
          'Issuer — кто выдал (CA)',
          'Validity — период действия (Not Before / Not After)',
          'Public Key — публичный ключ сервера',
          'Signature — подпись CA, подтверждающая подлинность',
          'SAN (Subject Alternative Names) — дополнительные домены'
        ]},
        { type: 'code', language: 'bash', value: '# Создание самоподписанного сертификата (для разработки)\nopenssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \\\n  -sha256 -days 365 -nodes \\\n  -subj "/CN=localhost/O=Dev/C=RU"\n\n# Создание CSR (Certificate Signing Request) для CA\nopenssl req -new -newkey rsa:4096 -keyout server.key -out server.csr -nodes \\\n  -subj "/CN=example.com/O=MyCompany/C=RU" \\\n  -addext "subjectAltName=DNS:example.com,DNS:www.example.com"\n\n# Просмотр содержимого сертификата\nopenssl x509 -in cert.pem -text -noout\n\n# Проверка цепочки сертификатов\nopenssl verify -CAfile ca-bundle.crt server.crt\n\n# Проверка соответствия ключа и сертификата\nopenssl x509 -noout -modulus -in cert.pem | openssl md5\nopenssl rsa -noout -modulus -in key.pem | openssl md5\n# Хэши должны совпадать!\n\n# Проверка срока действия сертификата\nopenssl x509 -enddate -noout -in cert.pem\n# notAfter=Apr 05 00:00:00 2027 GMT\n\n# Скрипт мониторинга истечения сертификатов\necho | openssl s_client -connect example.com:443 2>/dev/null | \\\n  openssl x509 -noout -enddate\n# Настройте алерт если < 30 дней до истечения!' },
        { type: 'tip', value: 'Используйте Let\'s Encrypt для бесплатных сертификатов. Для внутренних сервисов — собственный CA (cfssl, step-ca). Мониторьте истечение сертификатов! Просроченный сертификат — частая причина инцидентов.' }
      ]
    },
    {
      id: 3,
      title: 'Let\'s Encrypt и автоматизация сертификатов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Let\'s Encrypt — бесплатный, автоматизированный CA. Использует протокол ACME для автоматического получения и обновления сертификатов. Certbot — самый популярный ACME клиент.' },
        { type: 'code', language: 'bash', value: '# Установка certbot\nsudo apt install certbot python3-certbot-nginx\n\n# Получение сертификата для Nginx\nsudo certbot --nginx -d example.com -d www.example.com\n\n# Получение сертификата standalone (без веб-сервера)\nsudo certbot certonly --standalone -d example.com\n\n# Получение wildcard сертификата (DNS challenge)\nsudo certbot certonly --manual --preferred-challenges dns \\\n  -d "*.example.com" -d example.com\n\n# Автоматическое обновление (cron)\nsudo certbot renew --dry-run  # Тестовый запуск\n\n# Файлы сертификата:\n# /etc/letsencrypt/live/example.com/fullchain.pem  — сертификат + цепочка\n# /etc/letsencrypt/live/example.com/privkey.pem    — приватный ключ\n# /etc/letsencrypt/live/example.com/chain.pem      — промежуточные CA\n# /etc/letsencrypt/live/example.com/cert.pem       — только сертификат\n\n# Обновление сертификата автоматически каждый день\n# /etc/cron.d/certbot (создаётся автоматически)\n# 0 */12 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"' },
        { type: 'code', language: 'yaml', value: '# Nginx конфигурация с TLS best practices\n# /etc/nginx/sites-available/secure-example\n\n# server {\n#     listen 80;\n#     server_name example.com www.example.com;\n#     # Redirect HTTP -> HTTPS\n#     return 301 https://$server_name$request_uri;\n# }\n# \n# server {\n#     listen 443 ssl http2;\n#     server_name example.com www.example.com;\n# \n#     # Сертификаты Let\'s Encrypt\n#     ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;\n#     ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n# \n#     # TLS настройки\n#     ssl_protocols TLSv1.2 TLSv1.3;\n#     ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\n#     ssl_prefer_server_ciphers off;\n# \n#     # HSTS — запрет HTTP на 1 год\n#     add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n# \n#     # OCSP Stapling\n#     ssl_stapling on;\n#     ssl_stapling_verify on;\n# }' },
        { type: 'tip', value: 'Let\'s Encrypt сертификаты действуют 90 дней — автообновление обязательно! Используйте HSTS заголовок для принудительного HTTPS. Тестируйте конфигурацию на ssllabs.com/ssltest — стремитесь к оценке A+.' }
      ]
    },
    {
      id: 4,
      title: 'Безопасное хранение секретов в коде',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секреты (ключи API, пароли БД, приватные ключи) никогда не должны храниться в коде или Git-репозитории. Это одна из самых частых ошибок разработчиков, приводящая к взломам.' },
        { type: 'heading', value: 'Что НЕ надо делать' },
        { type: 'code', language: 'python', value: '# ПЛОХО: секреты в коде\nDATABASE_URL = "postgresql://admin:SuperSecret123@db.example.com/mydb"\nAWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"\nJWT_SECRET = "my-secret-key-12345"\n\n# ПЛОХО: секреты в .env, закоммиченном в Git\n# .env (в репозитории)\n# DB_PASSWORD=SuperSecret123\n\n# ХОРОШО: переменные окружения\nimport os\n\nDATABASE_URL = os.environ["DATABASE_URL"]\nAWS_SECRET_KEY = os.environ["AWS_SECRET_KEY"]\nJWT_SECRET = os.environ["JWT_SECRET"]\n\n# Проверка наличия обязательных переменных\nREQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET", "AWS_SECRET_KEY"]\nfor var in REQUIRED_ENV:\n    if var not in os.environ:\n        raise RuntimeError(f"Переменная окружения {var} не установлена!")\n\n# ХОРОШО: .env файл в .gitignore + пример .env.example\n# .env.example (в репозитории, БЕЗ реальных значений)\n# DATABASE_URL=postgresql://user:password@localhost/dbname\n# JWT_SECRET=generate-a-strong-random-secret\n# AWS_SECRET_KEY=your-aws-secret-key' },
        { type: 'code', language: 'bash', value: '# .gitignore — обязательные исключения\necho ".env" >> .gitignore\necho "*.pem" >> .gitignore\necho "*.key" >> .gitignore\necho "credentials.json" >> .gitignore\necho ".aws/" >> .gitignore\n\n# Поиск случайно закоммиченных секретов\n# git-secrets (AWS)\ngit secrets --scan\n\n# trufflehog — поиск секретов в истории Git\ntrufflehog git file://./\n\n# gitleaks — популярный инструмент\ngitleaks detect --source .\n\n# Если секрет уже в Git — он скомпрометирован!\n# 1. Немедленно ротируйте секрет (сгенерируйте новый)\n# 2. Удалите из истории Git (git filter-branch или BFG)\n# 3. Добавьте правило в .gitignore\n# ВАЖНО: просто удалить файл недостаточно — он остаётся в истории!' },
        { type: 'warning', value: 'Если секрет попал в Git (даже на секунду) — считайте его скомпрометированным. Ботнеты сканируют GitHub в реальном времени и извлекают AWS ключи за минуты. Немедленно ротируйте (замените) все скомпрометированные секреты.' }
      ]
    },
    {
      id: 5,
      title: 'Forward Secrecy и современные протоколы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Perfect Forward Secrecy (PFS) гарантирует, что компрометация долгосрочного ключа не раскроет прошлые сессии. Каждая сессия использует уникальный эфемерный ключ (ECDHE). TLS 1.3 делает PFS обязательным.' },
        { type: 'heading', value: 'Как работает Forward Secrecy' },
        { type: 'list', value: [
          'Без PFS: RSA key exchange — один приватный ключ дешифрует ВСЕ прошлые сессии',
          'С PFS: ECDHE — каждая сессия имеет уникальный ключ, уничтожаемый после использования',
          'Даже если приватный ключ сервера украден — прошлые записи трафика не дешифруются',
          'TLS 1.3 поддерживает ТОЛЬКО cipher suites с PFS'
        ]},
        { type: 'code', language: 'python', value: '# Демонстрация Diffie-Hellman на эллиптических кривых (ECDH)\nfrom cryptography.hazmat.primitives.asymmetric import ec\nfrom cryptography.hazmat.primitives import hashes\nfrom cryptography.hazmat.primitives.kdf.hkdf import HKDF\n\n# Эфемерные ключи Alice (генерируются для КАЖДОЙ сессии)\nalice_private = ec.generate_private_key(ec.SECP256R1())\nalice_public = alice_private.public_key()\n\n# Эфемерные ключи Bob\nbob_private = ec.generate_private_key(ec.SECP256R1())\nbob_public = bob_private.public_key()\n\n# Обмен публичными ключами (по открытому каналу)\n# Alice вычисляет общий секрет\nalice_shared = alice_private.exchange(ec.ECDH(), bob_public)\n\n# Bob вычисляет тот же общий секрет\nbob_shared = bob_private.exchange(ec.ECDH(), alice_public)\n\n# Общие секреты идентичны!\nassert alice_shared == bob_shared\n\n# Derive session key с помощью HKDF\nsession_key = HKDF(\n    algorithm=hashes.SHA256(),\n    length=32,\n    salt=None,\n    info=b"tls13 session key"\n).derive(alice_shared)\n\nprint(f"Session key: {session_key.hex()[:32]}...")\n\n# После сессии эфемерные ключи УНИЧТОЖАЮТСЯ\n# Компрометация долгосрочного ключа сервера\n# не раскроет этот session_key!\ndel alice_private, bob_private  # Ключи уничтожены' },
        { type: 'tip', value: 'В TLS 1.3 все cipher suites используют ECDHE для обмена ключами, обеспечивая Forward Secrecy по умолчанию. Убедитесь, что ваш сервер поддерживает TLS 1.3 и проверьте на ssllabs.com.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка HTTPS сервера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте безопасный HTTPS сервер с правильной TLS конфигурацией и проверьте его с помощью инструментов аудита.',
      requirements: [
        'Создайте самоподписанный сертификат с правильными параметрами',
        'Настройте Nginx с TLS 1.2/1.3, HSTS и безопасными cipher suites',
        'Проверьте конфигурацию с помощью openssl s_client',
        'Напишите скрипт проверки срока действия сертификата',
        'Убедитесь что HTTP редиректит на HTTPS'
      ],
      hint: 'Используйте openssl для создания сертификата, настройте Nginx ssl_protocols и ssl_ciphers, проверьте через openssl s_client.',
      expectedOutput: 'Сертификат создан: RSA 4096, SHA-256, SAN: localhost\nNginx запущен с TLS 1.2+1.3\nopenssl s_client: Protocol TLSv1.3, Cipher TLS_AES_256_GCM_SHA384\nHTTP->HTTPS редирект работает (301)\nСертификат действителен ещё 364 дня',
      solution: '#!/bin/bash\n\n# 1. Создание сертификата\nopenssl req -x509 -newkey rsa:4096 \\\n  -keyout /etc/nginx/ssl/server.key \\\n  -out /etc/nginx/ssl/server.crt \\\n  -sha256 -days 365 -nodes \\\n  -subj "/CN=localhost/O=SecurityLab/C=RU" \\\n  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"\n\n# 2. Nginx конфигурация\ncat << \'NGINX\' > /etc/nginx/sites-available/secure\nserver {\n    listen 80;\n    server_name localhost;\n    return 301 https://$server_name$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name localhost;\n\n    ssl_certificate /etc/nginx/ssl/server.crt;\n    ssl_certificate_key /etc/nginx/ssl/server.key;\n\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;\n    ssl_prefer_server_ciphers off;\n    ssl_session_timeout 1d;\n    ssl_session_cache shared:SSL:10m;\n\n    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n    add_header X-Content-Type-Options nosniff;\n    add_header X-Frame-Options DENY;\n\n    location / {\n        return 200 "Secure server is running!\\n";\n        add_header Content-Type text/plain;\n    }\n}\nNGINX\n\nsudo nginx -t && sudo systemctl reload nginx\n\n# 3. Проверка\nopenssl s_client -connect localhost:443 -servername localhost < /dev/null 2>/dev/null | \\\n  grep -E "(Protocol|Cipher)"\n\n# 4. Скрипт проверки срока\nEXPIRY=$(echo | openssl s_client -connect localhost:443 2>/dev/null | \\\n  openssl x509 -noout -enddate | cut -d= -f2)\nEXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)\nNOW_EPOCH=$(date +%s)\nDAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))\necho "Сертификат действителен ещё $DAYS_LEFT дней"\n[ $DAYS_LEFT -lt 30 ] && echo "ВНИМАНИЕ: менее 30 дней до истечения!"',
      explanation: 'Правильная TLS конфигурация включает: актуальные протоколы (TLS 1.2+), безопасные cipher suites (с ECDHE для Forward Secrecy), HSTS заголовок (принудительный HTTPS), мониторинг срока сертификата. Редирект HTTP->HTTPS гарантирует что пользователи всегда используют шифрованное соединение.'
    }
  ]
}
