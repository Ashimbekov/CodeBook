export default {
  id: 5,
  title: 'Сети: основы',
  description: 'Модель TCP/IP, DNS, HTTP/HTTPS, порты, firewall и сетевая диагностика для DevOps-инженера.',
  lessons: [
    {
      id: 1,
      title: 'Модель TCP/IP и OSI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание сетей — фундамент для DevOps. Каждый деплой, мониторинг и отладка связаны с сетью. Модель TCP/IP описывает как данные передаются от приложения к приложению через интернет.' },
        { type: 'heading', value: 'Уровни TCP/IP' },
        { type: 'code', language: 'bash', value: '# Модель TCP/IP (4 уровня):\n#\n# 4. Application    — HTTP, HTTPS, DNS, SSH, SMTP\n#    "Что передаём"   Данные приложения\n#\n# 3. Transport      — TCP, UDP\n#    "Как доставляем"  Надёжная (TCP) или быстрая (UDP) доставка\n#\n# 2. Internet       — IP, ICMP\n#    "Куда отправляем" Маршрутизация между сетями\n#\n# 1. Network Access  — Ethernet, Wi-Fi\n#    "Физическая среда" Передача по кабелю/радио\n\n# TCP vs UDP:\n# TCP — надёжный, с подтверждением (HTTP, SSH, email)\n#   SYN -> SYN-ACK -> ACK (три рукопожатия)\n#   Гарантирует доставку и порядок пакетов\n#\n# UDP — быстрый, без подтверждения (DNS, видео, игры)\n#   Отправил и забыл\n#   Нет гарантии доставки' },
        { type: 'heading', value: 'IP-адреса' },
        { type: 'code', language: 'bash', value: '# IPv4: 192.168.1.100 (32 бита, 4 октета)\n# IPv6: 2001:0db8:85a3::8a2e:0370:7334 (128 бит)\n\n# Частные (private) сети:\n# 10.0.0.0/8       — 16 млн адресов (10.x.x.x)\n# 172.16.0.0/12    — 1 млн адресов (172.16-31.x.x)\n# 192.168.0.0/16   — 65К адресов (192.168.x.x)\n\n# Специальные адреса:\n# 127.0.0.1        — localhost (свой компьютер)\n# 0.0.0.0          — все интерфейсы (слушать на всех IP)\n# 255.255.255.255  — broadcast\n\n# Посмотреть свой IP\nip addr show\nhostname -I                    # Только IP\ncurl -s ifconfig.me             # Внешний IP\n\n# Подсети (CIDR)\n# 192.168.1.0/24  — 256 адресов (192.168.1.0 - 192.168.1.255)\n# 10.0.0.0/16     — 65536 адресов\n# /32             — один адрес' },
        { type: 'tip', value: 'В Docker и Kubernetes каждый контейнер/pod получает свой IP. Понимание подсетей (CIDR) критично для настройки VPC в облаке и сетевых политик в Kubernetes.' }
      ]
    },
    {
      id: 2,
      title: 'DNS — система доменных имён',
      type: 'theory',
      content: [
        { type: 'text', value: 'DNS преобразует доменные имена (google.com) в IP-адреса (142.250.74.14). Это «телефонная книга интернета». Ошибки DNS — одна из самых частых причин сетевых проблем.' },
        { type: 'heading', value: 'Как работает DNS' },
        { type: 'code', language: 'bash', value: '# Запрос: браузер -> google.com\n#\n# 1. Кеш браузера (уже посещал?)\n# 2. /etc/hosts (локальный файл)\n# 3. DNS-резолвер провайдера\n# 4. Root DNS -> .com DNS -> google.com DNS\n# 5. Ответ: 142.250.74.14\n\n# Типы DNS-записей:\n# A      — домен -> IPv4 адрес\n# AAAA   — домен -> IPv6 адрес\n# CNAME  — алиас (alias) домена\n# MX     — почтовый сервер\n# TXT    — текстовая запись (SPF, DKIM, верификация)\n# NS     — nameserver\n# SOA    — начало зоны (start of authority)\n# SRV    — сервис (порт + хост)\n\n# Примеры:\n# app.company.com    A      -> 52.14.23.45\n# www.company.com    CNAME  -> app.company.com\n# company.com        MX     -> mail.company.com\n# company.com        TXT    -> "v=spf1 include:_spf.google.com ~all"' },
        { type: 'heading', value: 'Инструменты DNS' },
        { type: 'code', language: 'bash', value: '# dig — подробный DNS-запрос\ndig google.com\ndig google.com A                # Только A-записи\ndig google.com MX               # Почтовые серверы\ndig +short google.com           # Только IP\ndig @8.8.8.8 google.com         # Через конкретный DNS-сервер\n\n# nslookup — простой DNS-запрос\nnslookup google.com\nnslookup -type=MX google.com\n\n# host — ещё проще\nhost google.com\nhost 142.250.74.14              # Обратный DNS (IP -> домен)\n\n# Локальный DNS\ncat /etc/resolv.conf            # DNS-серверы системы\n# nameserver 8.8.8.8\n# nameserver 8.8.4.4\n\n# /etc/hosts — локальные DNS-записи\ncat /etc/hosts\n# 127.0.0.1 localhost\n# 192.168.1.100 myserver.local\n\n# Добавить запись\nsudo bash -c \'echo "192.168.1.50 db.local" >> /etc/hosts\'' },
        { type: 'note', value: 'TTL (Time To Live) DNS-записи определяет как долго запись кешируется. При миграции серверов заранее уменьши TTL (до 60 сек), чтобы переключение произошло быстро.' }
      ]
    },
    {
      id: 3,
      title: 'HTTP/HTTPS и веб-протоколы',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP — основной протокол веба. HTTPS — его зашифрованная версия (TLS/SSL). DevOps-инженер работает с HTTP ежедневно: настройка веб-серверов, балансировщиков, API, сертификатов.' },
        { type: 'heading', value: 'HTTP-методы и коды ответов' },
        { type: 'code', language: 'bash', value: '# HTTP-методы:\n# GET     — получить данные\n# POST    — создать ресурс\n# PUT     — обновить (полная замена)\n# PATCH   — обновить (частичная)\n# DELETE  — удалить\n# HEAD    — только заголовки\n# OPTIONS — доступные методы\n\n# Коды ответов:\n# 2xx — Успех\n# 200 OK, 201 Created, 204 No Content\n#\n# 3xx — Перенаправление\n# 301 Moved Permanently, 302 Found, 304 Not Modified\n#\n# 4xx — Ошибка клиента\n# 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found\n#\n# 5xx — Ошибка сервера\n# 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable\n\n# Для DevOps критичны:\n# 502 Bad Gateway    — бэкенд не отвечает (проверь приложение)\n# 503 Unavailable    — сервер перегружен (масштабируй)\n# 504 Gateway Timeout — бэкенд отвечает слишком долго' },
        { type: 'heading', value: 'curl — инструмент HTTP-запросов' },
        { type: 'code', language: 'bash', value: '# GET-запрос\ncurl https://api.github.com/users/torvalds\ncurl -s https://api.example.com/health     # Без прогресс-бара\ncurl -v https://example.com                 # Verbose (все заголовки)\n\n# POST-запрос с данными\ncurl -X POST https://api.example.com/deploy \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -d \'{"version": "1.2.3", "env": "production"}\'\n\n# Проверка HTTP-кода\nHTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://example.com)\nif [[ "$HTTP_CODE" -ne 200 ]]; then\n    echo "ОШИБКА: HTTP $HTTP_CODE"\nfi\n\n# Скачивание файла\ncurl -LO https://example.com/file.tar.gz\nwget https://example.com/file.tar.gz\n\n# HTTPS и сертификаты\ncurl -vI https://example.com 2>&1 | grep -E "expire|subject|issuer"\n# Проверить срок сертификата\necho | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates' },
        { type: 'tip', value: 'curl -sf URL > /dev/null — идеальная проверка здоровья сервиса в скриптах. -s (silent), -f (fail на HTTP ошибки). Возвращает exit code 0 при успехе, не-0 при ошибке.' }
      ]
    },
    {
      id: 4,
      title: 'Порты и Firewall',
      type: 'theory',
      content: [
        { type: 'text', value: 'Порт — это числовой идентификатор сетевого соединения (0-65535). IP-адрес определяет КУДА, порт определяет КАКОМУ сервису. Firewall контролирует какой трафик разрешён.' },
        { type: 'heading', value: 'Стандартные порты' },
        { type: 'code', language: 'bash', value: '# Стандартные порты:\n# 22    — SSH\n# 80    — HTTP\n# 443   — HTTPS\n# 3306  — MySQL\n# 5432  — PostgreSQL\n# 6379  — Redis\n# 27017 — MongoDB\n# 8080  — HTTP альтернативный (Tomcat, proxy)\n# 9090  — Prometheus\n# 3000  — Grafana, Node.js dev\n# 5000  — Docker Registry, Flask\n# 8443  — HTTPS альтернативный\n\n# Проверка портов\nss -tlnp                        # Все слушающие TCP-порты\nss -tlnp | grep :80              # Кто слушает порт 80\nlsof -i :8080                    # Процесс на порту 8080\nnc -zv localhost 5432            # Проверить доступность порта\nnmap -p 1-1000 192.168.1.1       # Сканирование портов' },
        { type: 'heading', value: 'UFW — Uncomplicated Firewall' },
        { type: 'code', language: 'bash', value: '# UFW — простой firewall для Ubuntu\nsudo ufw status                  # Статус\nsudo ufw enable                  # Включить\nsudo ufw disable                 # Выключить\n\n# Правила\nsudo ufw allow 22/tcp            # Разрешить SSH\nsudo ufw allow 80/tcp            # Разрешить HTTP\nsudo ufw allow 443/tcp           # Разрешить HTTPS\nsudo ufw allow from 10.0.0.0/24  # Разрешить всю подсеть\nsudo ufw allow from 10.0.0.5 to any port 5432  # PostgreSQL только с определённого IP\nsudo ufw deny 3306               # Запретить MySQL извне\n\nsudo ufw delete allow 80/tcp     # Удалить правило\nsudo ufw status numbered         # Правила с номерами\nsudo ufw delete 3                # Удалить правило по номеру\n\n# Типичная настройка сервера\nsudo ufw default deny incoming   # Запретить всё входящее\nsudo ufw default allow outgoing  # Разрешить всё исходящее\nsudo ufw allow 22/tcp            # SSH\nsudo ufw allow 80/tcp            # HTTP\nsudo ufw allow 443/tcp           # HTTPS\nsudo ufw enable' },
        { type: 'warning', value: 'ВСЕГДА разрешай SSH (порт 22) ПЕРЕД включением firewall! Иначе потеряешь доступ к серверу. Если работаешь удалённо через SSH — это критическая ошибка.' }
      ]
    },
    {
      id: 5,
      title: 'Сетевая диагностика',
      type: 'theory',
      content: [
        { type: 'text', value: 'Умение быстро диагностировать сетевые проблемы — критический навык DevOps. Основные инструменты: ping, traceroute, dig, curl, ss, tcpdump.' },
        { type: 'heading', value: 'Алгоритм диагностики' },
        { type: 'code', language: 'bash', value: '# 1. Проверить связность\nping -c 4 google.com             # Пинг (ICMP)\nping -c 4 8.8.8.8               # Пинг по IP (без DNS)\n\n# Если пинг по IP работает, а по домену нет -> проблема DNS\n# Если пинг не работает совсем -> проблема сети\n\n# 2. Проверить маршрут\ntraceroute google.com            # Маршрут пакета\nmtr google.com                   # traceroute + ping (интерактивный)\n\n# 3. Проверить DNS\ndig +short example.com           # Резолвится ли домен?\nnslookup example.com\n\n# 4. Проверить порт\nnc -zv 192.168.1.100 80          # Открыт ли порт?\ncurl -v http://192.168.1.100     # HTTP ответ\n\n# 5. Проверить локально\nss -tlnp | grep :80              # Слушает ли сервис?\nsudo systemctl status nginx      # Запущен ли сервис?\njournalctl -u nginx -n 50        # Ошибки в логах?' },
        { type: 'heading', value: 'tcpdump — анализ трафика' },
        { type: 'code', language: 'bash', value: '# tcpdump — захват сетевых пакетов\nsudo tcpdump -i eth0 port 80                    # HTTP трафик\nsudo tcpdump -i eth0 host 192.168.1.100         # Трафик от/к IP\nsudo tcpdump -i eth0 port 53                    # DNS-запросы\nsudo tcpdump -i eth0 -w capture.pcap            # Сохранить в файл\nsudo tcpdump -i eth0 -c 100                     # Захватить 100 пакетов\n\n# Полезные фильтры\nsudo tcpdump -i any port 5432 -A                # PostgreSQL трафик (ASCII)\nsudo tcpdump -i eth0 \'tcp[tcpflags] & (tcp-syn) != 0\'  # Только SYN пакеты\n\n# Пример отладки: запросы не доходят до бэкенда\nsudo tcpdump -i eth0 port 8080 -n               # Видим ли пакеты на порту 8080?' },
        { type: 'tip', value: 'Мнемоника диагностики: 1) Пинг — есть ли связь? 2) DNS — резолвится ли домен? 3) Порт — открыт ли? 4) Сервис — запущен ли? 5) Логи — есть ли ошибки? Идите от простого к сложному.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Диагностика сетевых проблем',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите диагностику сетевых проблем, используя инструменты командной строки.',
      requirements: [
        'Определите внешний и внутренний IP-адрес вашей машины',
        'Выполните DNS-запрос для любого домена и определите A-запись',
        'Проверьте какие порты слушаются на вашей машине',
        'Проверьте доступность сайта через curl с выводом HTTP-кода',
        'Настройте базовые правила firewall (UFW)',
        'Проверьте маршрут до удалённого сервера'
      ],
      hint: 'hostname -I для внутреннего IP, curl ifconfig.me для внешнего. dig +short для DNS. ss -tlnp для портов.',
      expectedOutput: 'Внутренний IP: 192.168.1.X\nВнешний IP: X.X.X.X\nDNS A-запись github.com: 140.82.121.3\nОткрытые порты: 22 (sshd), 80 (nginx)...\nHTTP-код google.com: 200\nFirewall: SSH, HTTP, HTTPS разрешены\nМаршрут: 10-15 хопов до целевого сервера',
      solution: '#!/bin/bash\n# 1. IP-адреса\necho "=== IP-адреса ==="\necho "Внутренний: $(hostname -I | awk \'{print $1}\')"\necho "Внешний: $(curl -s ifconfig.me)"\n\n# 2. DNS-запрос\necho "\\n=== DNS ==="\ndig +short github.com A\ndig +short github.com MX\n\n# 3. Открытые порты\necho "\\n=== Открытые порты ==="\nss -tlnp\n\n# 4. HTTP проверка\necho "\\n=== HTTP проверка ==="\nHTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://google.com)\necho "Google: HTTP $HTTP_CODE"\n\n# 5. Firewall\necho "\\n=== Firewall ==="\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 22/tcp\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw --force enable\nsudo ufw status verbose\n\n# 6. Маршрут\necho "\\n=== Маршрут ==="\ntraceroute -m 15 google.com',
      explanation: 'hostname -I показывает все локальные IP. curl ifconfig.me возвращает внешний IP через специальный сервис. dig +short выводит только результат без деталей. ss -tlnp показывает все слушающие TCP-порты с именами процессов. curl -w "%{http_code}" выводит HTTP-код ответа.'
    }
  ]
}
