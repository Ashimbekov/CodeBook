export default {
  id: 2,
  title: 'Сетевая безопасность: основы',
  description: 'TCP/IP безопасность, межсетевые экраны (firewalls), VPN, системы обнаружения и предотвращения вторжений (IDS/IPS), сегментация сети.',
  lessons: [
    {
      id: 1,
      title: 'Модель TCP/IP и уязвимости на каждом уровне',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модель TCP/IP имеет 4 уровня, и каждый имеет свои уязвимости. Понимание сетевых протоколов — фундамент для понимания сетевых атак и защиты от них.' },
        { type: 'heading', value: 'Уровни TCP/IP и их уязвимости' },
        { type: 'list', value: [
          'Application (HTTP, DNS, SMTP) — SQL injection, XSS, DNS spoofing, email spoofing',
          'Transport (TCP, UDP) — SYN flood, TCP session hijacking, port scanning',
          'Internet (IP, ICMP) — IP spoofing, ICMP flood, routing attacks',
          'Link (Ethernet, Wi-Fi) — ARP spoofing, MAC flooding, evil twin AP'
        ]},
        { type: 'code', language: 'bash', value: '# Анализ сетевого трафика на своей машине\n\n# Просмотр активных соединений\nss -tunapl\n# -t: TCP  -u: UDP  -n: числовые адреса  -a: все  -p: процесс  -l: listening\n\n# Пример вывода:\n# tcp  ESTAB  0  0  192.168.1.100:52134  93.184.216.34:443  users:(("firefox",pid=1234))\n# tcp  LISTEN 0  128  0.0.0.0:22                             users:(("sshd",pid=567))\n\n# Захват пакетов с tcpdump (только на своей системе!)\nsudo tcpdump -i eth0 -n -c 10 port 80\n# -i: интерфейс  -n: не резолвить DNS  -c: количество пакетов\n\n# Захват DNS запросов\nsudo tcpdump -i any -n port 53\n# 192.168.1.100.45678 > 8.8.8.8.53: A? example.com\n# DNS запросы по умолчанию НЕ зашифрованы!\n\n# Просмотр ARP таблицы\narp -a\n# ? (192.168.1.1) at aa:bb:cc:dd:ee:ff [ether] on eth0\n\n# Трассировка маршрута\ntraceroute example.com' },
        { type: 'warning', value: 'Захват сетевого трафика (sniffing) разрешён ТОЛЬКО в собственной сети или с письменного разрешения. Перехват чужого трафика — уголовное преступление.' }
      ]
    },
    {
      id: 2,
      title: 'Межсетевые экраны (Firewalls)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Firewall — система фильтрации сетевого трафика на основе правил. Виды: пакетный фильтр (stateless), stateful firewall, application-level gateway (proxy), Next-Generation Firewall (NGFW).' },
        { type: 'heading', value: 'Типы межсетевых экранов' },
        { type: 'list', value: [
          'Stateless (пакетный фильтр) — фильтрует каждый пакет отдельно (IP, порт)',
          'Stateful — отслеживает состояние соединений (TCP handshake)',
          'Application Firewall (WAF) — анализирует содержимое на уровне приложения',
          'NGFW — глубокая инспекция пакетов (DPI), IPS, антивирус в одном устройстве'
        ]},
        { type: 'code', language: 'bash', value: '# iptables — классический Linux firewall\n\n# Просмотр текущих правил\nsudo iptables -L -n -v\n\n# Политика по умолчанию — запретить всё (whitelist подход)\nsudo iptables -P INPUT DROP\nsudo iptables -P FORWARD DROP\nsudo iptables -P OUTPUT ACCEPT\n\n# Разрешить loopback\nsudo iptables -A INPUT -i lo -j ACCEPT\n\n# Разрешить установленные соединения\nsudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n\n# Разрешить SSH только с определённого IP\nsudo iptables -A INPUT -p tcp --dport 22 -s 10.0.0.100 -j ACCEPT\n\n# Разрешить HTTP/HTTPS для всех\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT\n\n# Логировать отброшенные пакеты\nsudo iptables -A INPUT -j LOG --log-prefix "DROPPED: "\n\n# --- Современная альтернатива: nftables ---\n# nft list ruleset\n\n# --- UFW (Uncomplicated Firewall) — обёртка над iptables ---\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow from 10.0.0.100 to any port 22\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable\nsudo ufw status verbose' },
        { type: 'tip', value: 'Используйте whitelist-подход: запретите всё по умолчанию и явно разрешайте только необходимое. UFW проще для начинающих, nftables — современная замена iptables для продвинутых случаев.' }
      ]
    },
    {
      id: 3,
      title: 'VPN и защита каналов связи',
      type: 'theory',
      content: [
        { type: 'text', value: 'VPN (Virtual Private Network) создаёт зашифрованный туннель между точками. Основные протоколы: WireGuard (современный, быстрый), OpenVPN (зрелый, гибкий), IPSec (корпоративный стандарт).' },
        { type: 'heading', value: 'Сравнение VPN протоколов' },
        { type: 'list', value: [
          'WireGuard — 4000 строк кода (vs 100k+ OpenVPN), быстрый, современная криптография',
          'OpenVPN — SSL/TLS основанный, гибкая конфигурация, поддерживает TCP/UDP',
          'IPSec/IKEv2 — нативная поддержка в ОС, хорошо для мобильных (переключение сетей)',
          'PPTP — устаревший, НЕЛЬЗЯ использовать (криптография сломана)',
          'L2TP/IPSec — приемлемый, но медленнее WireGuard'
        ]},
        { type: 'code', language: 'bash', value: '# WireGuard — настройка сервера\n\n# Установка\nsudo apt install wireguard\n\n# Генерация ключей\nwg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key\nwg genkey | tee /etc/wireguard/client_private.key | wg pubkey > /etc/wireguard/client_public.key\n\n# Конфигурация сервера /etc/wireguard/wg0.conf\ncat << \'EOF\' > /etc/wireguard/wg0.conf\n[Interface]\nAddress = 10.0.0.1/24\nListenPort = 51820\nPrivateKey = <server_private_key>\n\n# Firewall правила при поднятии/опускании интерфейса\nPostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\nPostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE\n\n[Peer]\nPublicKey = <client_public_key>\nAllowedIPs = 10.0.0.2/32\nEOF\n\n# Запуск\nsudo wg-quick up wg0\nsudo systemctl enable wg-quick@wg0\n\n# Проверка статуса\nsudo wg show' },
        { type: 'warning', value: 'VPN защищает трафик в транзите, но НЕ обеспечивает анонимность. Провайдер VPN видит ваш трафик. Для корпоративного использования разворачивайте собственный VPN сервер. Коммерческие VPN — для обхода гео-ограничений, а не для безопасности.' }
      ]
    },
    {
      id: 4,
      title: 'IDS и IPS: обнаружение и предотвращение вторжений',
      type: 'theory',
      content: [
        { type: 'text', value: 'IDS (Intrusion Detection System) обнаруживает подозрительную активность и уведомляет. IPS (Intrusion Prevention System) автоматически блокирует атаки. Основные подходы: сигнатурный анализ и обнаружение аномалий.' },
        { type: 'heading', value: 'Типы IDS/IPS' },
        { type: 'list', value: [
          'NIDS (Network IDS) — мониторит сетевой трафик (Snort, Suricata)',
          'HIDS (Host IDS) — мониторит файлы и процессы на хосте (OSSEC, Wazuh)',
          'Signature-based — сравнение с известными шаблонами атак (быстро, но не ловит zero-day)',
          'Anomaly-based — выявление отклонений от нормального поведения (ловит zero-day, но больше ложных срабатываний)',
          'Hybrid — комбинация сигнатур и аномалий (Suricata + ML)'
        ]},
        { type: 'code', language: 'bash', value: '# Suricata — современный IDS/IPS\n\n# Установка\nsudo apt install suricata\n\n# Обновление правил\nsudo suricata-update\n\n# Запуск в режиме IDS\nsudo suricata -c /etc/suricata/suricata.yaml -i eth0\n\n# Пример правила Suricata (обнаружение SQL injection в HTTP)\n# /etc/suricata/rules/custom.rules\n# alert http any any -> any any (\n#   msg:"Possible SQL Injection attempt";\n#   flow:to_server,established;\n#   content:"UNION"; nocase;\n#   content:"SELECT"; nocase;\n#   sid:1000001; rev:1;\n# )\n\n# Просмотр логов\ntail -f /var/log/suricata/fast.log\n# 04/05/2026-10:15:23.456789  [**] [1:1000001:1]\n# Possible SQL Injection attempt [**]\n# {TCP} 192.168.1.100:52134 -> 10.0.0.5:80\n\n# Статистика\ncat /var/log/suricata/stats.log | grep -E "detect\\.(alert|drop)"\n\n# --- Fail2ban — простой HIDS для защиты от брутфорса ---\nsudo apt install fail2ban\n\n# /etc/fail2ban/jail.local\n# [sshd]\n# enabled = true\n# port = ssh\n# maxretry = 3\n# bantime = 3600\n# findtime = 600\n\nsudo systemctl enable fail2ban\nsudo fail2ban-client status sshd' },
        { type: 'tip', value: 'Fail2ban — минимально необходимый инструмент на каждом сервере. Он защищает SSH, Nginx, Apache от брутфорса. Suricata — для глубокого мониторинга сетевого трафика.' }
      ]
    },
    {
      id: 5,
      title: 'Сегментация сети и Zero Trust',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сегментация сети разделяет сеть на изолированные зоны, ограничивая перемещение атакующего (lateral movement). Zero Trust — модель, где ни один пользователь или устройство не получает доверие по умолчанию.' },
        { type: 'heading', value: 'Принципы сегментации' },
        { type: 'list', value: [
          'DMZ (Demilitarized Zone) — зона для публичных сервисов между внешним и внутренним firewall',
          'VLAN — разделение на уровне коммутаторов (бухгалтерия, разработка, серверы)',
          'Microsegmentation — изоляция на уровне отдельных workloads (в Kubernetes, облаке)',
          'Принцип: если скомпрометирован один сегмент, остальные остаются защищёнными'
        ]},
        { type: 'heading', value: 'Zero Trust Architecture' },
        { type: 'code', language: 'yaml', value: '# Zero Trust принципы:\n# 1. Never trust, always verify\n# 2. Assume breach\n# 3. Verify explicitly\n\n# Пример: Network Policy в Kubernetes (microsegmentation)\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-all-ingress\n  namespace: production\nspec:\n  podSelector: {}  # Применяется ко всем подам\n  policyTypes:\n    - Ingress\n  # По умолчанию запрещаем весь входящий трафик\n  # Затем явно разрешаем только необходимое:\n\n---\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: allow-frontend-to-backend\n  namespace: production\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels:\n              app: frontend\n      ports:\n        - protocol: TCP\n          port: 8080\n  # Только frontend может обращаться к backend на порт 8080\n  # Все остальные поды не могут' },
        { type: 'tip', value: 'Zero Trust — это не продукт, а архитектурный подход. Основные компоненты: строгая аутентификация (MFA), микросегментация, принцип наименьших привилегий, непрерывный мониторинг. Google BeyondCorp — пример внедрения Zero Trust.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка firewall и мониторинг сети',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте межсетевой экран с whitelist-подходом и настройте базовый мониторинг сетевой активности.',
      requirements: [
        'Настройте UFW с политикой deny по умолчанию',
        'Разрешите только SSH (с конкретного IP), HTTP и HTTPS',
        'Настройте Fail2ban для защиты SSH от брутфорса',
        'Напишите скрипт мониторинга подозрительных подключений',
        'Проверьте что все правила работают корректно'
      ],
      hint: 'Используйте ufw для firewall, fail2ban для защиты от брутфорса, ss и netstat для мониторинга.',
      expectedOutput: 'UFW Status:\nDefault: deny (incoming), allow (outgoing)\n22/tcp ALLOW FROM 10.0.0.100\n80/tcp ALLOW Anywhere\n443/tcp ALLOW Anywhere\n\nFail2ban:\nJail: sshd — Status: active, maxretry: 3, bantime: 3600\n\nМониторинг: скрипт выводит список подозрительных подключений.',
      solution: '#!/bin/bash\n# Настройка безопасности сервера\n\n# === 1. Firewall (UFW) ===\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\n\n# SSH только с доверенного IP\nsudo ufw allow from 10.0.0.100 to any port 22 proto tcp\n\n# HTTP и HTTPS для всех\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\n\nsudo ufw --force enable\nsudo ufw status verbose\n\n# === 2. Fail2ban ===\nsudo apt install -y fail2ban\n\ncat << \'EOF\' | sudo tee /etc/fail2ban/jail.local\n[DEFAULT]\nbantime = 3600\nfindtime = 600\nmaxretry = 3\n\n[sshd]\nenabled = true\nport = ssh\nfilter = sshd\nlogpath = /var/log/auth.log\nmaxretry = 3\nbantime = 3600\nEOF\n\nsudo systemctl restart fail2ban\nsudo fail2ban-client status sshd\n\n# === 3. Скрипт мониторинга ===\ncat << \'SCRIPT\' > /usr/local/bin/network-monitor.sh\n#!/bin/bash\necho "=== Мониторинг сетевой активности ===" \necho "Дата: $(date)"\necho ""\necho "--- Установленные соединения ---"\nss -tunapl state established\necho ""\necho "--- Подозрительные подключения (не на стандартных портах) ---"\nss -tunapl state established | grep -vE ":(22|80|443|53) "\necho ""\necho "--- Количество подключений по IP ---"\nss -tn state established | awk \'{print $5}\' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10\nSCRIPT\n\nchmod +x /usr/local/bin/network-monitor.sh\n/usr/local/bin/network-monitor.sh',
      explanation: 'Whitelist-подход (deny по умолчанию) — золотой стандарт настройки firewall. Fail2ban автоматически блокирует IP после нескольких неудачных попыток входа. Мониторинг подключений помогает обнаружить несанкционированную активность. Эти три компонента — минимальный набор для защиты сервера.'
    }
  ]
}
