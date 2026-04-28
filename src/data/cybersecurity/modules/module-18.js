export default {
  id: 18,
  title: 'Пентест: основы',
  description: 'Методология тестирования на проникновение, разведка (reconnaissance), сканирование, OSINT и этические основы пентеста.',
  lessons: [
    {
      id: 1,
      title: 'Методология пентеста',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пентест (Penetration Testing) — авторизованная имитация реальной атаки для выявления уязвимостей. Методология: Planning -> Reconnaissance -> Scanning -> Exploitation -> Post-Exploitation -> Reporting.' },
        { type: 'heading', value: 'Фазы пентеста' },
        { type: 'list', value: [
          '1. Pre-engagement: определение scope, правила, юридические аспекты',
          '2. Reconnaissance: сбор информации о цели (passive + active)',
          '3. Scanning: обнаружение сервисов, портов, уязвимостей',
          '4. Exploitation: эксплуатация найденных уязвимостей',
          '5. Post-exploitation: оценка воздействия, lateral movement',
          '6. Reporting: документирование находок, рекомендации'
        ]},
        { type: 'heading', value: 'Типы пентестов' },
        { type: 'list', value: [
          'Black Box — тестировщик не знает ничего о системе (как внешний атакующий)',
          'White Box — полный доступ к коду, архитектуре, credentials',
          'Gray Box — частичная информация (аккаунт пользователя, документация)',
          'External — тестирование из интернета (периметр)',
          'Internal — тестирование изнутри сети (скомпрометированный сотрудник)',
          'Web Application — тестирование веб-приложений (OWASP)'
        ]},
        { type: 'warning', value: 'Пентест ВСЕГДА проводится только с письменного разрешения владельца системы. Документ должен определять: scope (что тестировать), out-of-scope (что НЕ трогать), временные рамки, контактные лица. Без разрешения — это уголовное преступление.' }
      ]
    },
    {
      id: 2,
      title: 'Passive Reconnaissance и OSINT',
      type: 'theory',
      content: [
        { type: 'text', value: 'Passive Recon — сбор информации без прямого контакта с целью. OSINT (Open Source Intelligence) использует публичные источники: DNS, WHOIS, социальные сети, утечки данных, Google dorking.' },
        { type: 'code', language: 'bash', value: '# === Passive Reconnaissance ===\n# Вся информация собирается из ПУБЛИЧНЫХ источников\n# Цель НЕ узнает что её исследуют\n\n# DNS разведка\ndig example.com ANY\ndig example.com MX\ndig example.com TXT\nhost -t ns example.com\n\n# Поддомены (через DNS)\ndig @8.8.8.8 example.com AXFR  # Zone transfer (если разрешён)\n\n# WHOIS информация\nwhois example.com\n# Registrant: John Doe\n# Email: admin@example.com\n# Name Server: ns1.hosting.com\n\n# Certificate Transparency logs (поддомены!)\n# https://crt.sh/?q=%25.example.com\ncurl -s "https://crt.sh/?q=%25.example.com&output=json" | \\\n  jq -r \'.[].name_value\' | sort -u\n# admin.example.com\n# api.example.com\n# staging.example.com  # Интересно!\n# dev.example.com      # Часто менее защищён\n\n# Google Dorking (поиск уязвимостей через Google)\n# site:example.com filetype:pdf\n# site:example.com inurl:admin\n# site:example.com intitle:"index of"\n# site:example.com ext:sql | ext:env | ext:log\n\n# Shodan (поисковик по интернет-устройствам)\n# https://shodan.io\n# shodan search hostname:example.com\n\n# Утечки (Have I Been Pwned)\n# https://haveibeenpwned.com/DomainSearch' },
        { type: 'tip', value: 'Certificate Transparency Logs — мощный инструмент для обнаружения поддоменов. Staging и dev среды часто менее защищены. Google Dorking может обнаружить случайно опубликованные файлы конфигурации.' }
      ]
    },
    {
      id: 3,
      title: 'Active Reconnaissance и сканирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Active Recon — прямое взаимодействие с целью: сканирование портов, определение сервисов, fingerprinting ОС и приложений. Цель может обнаружить сканирование через IDS/IPS.' },
        { type: 'code', language: 'bash', value: '# === Active Scanning (ТОЛЬКО на авторизованных целях!) ===\n\n# Nmap: сканирование портов\n# Быстрое сканирование топ-100 портов\nnmap -F target.example.com\n\n# Полное сканирование всех TCP портов\nnmap -p- -T4 target.example.com\n\n# Определение сервисов и версий\nnmap -sV -sC target.example.com\n# -sV: определение версий сервисов\n# -sC: запуск default NSE скриптов\n\n# Пример вывода:\n# PORT     STATE SERVICE    VERSION\n# 22/tcp   open  ssh        OpenSSH 8.9p1\n# 80/tcp   open  http       nginx 1.24.0\n# 443/tcp  open  ssl/http   nginx 1.24.0\n# 3306/tcp open  mysql      MySQL 8.0.35\n# 8080/tcp open  http-proxy Jenkins 2.426\n\n# Обнаружение ОС\nnmap -O target.example.com\n\n# Сканирование уязвимостей (NSE scripts)\nnmap --script vuln target.example.com\n\n# === Сканирование веб-приложений ===\n\n# Nikto: сканер веб-серверов\nnikto -h https://target.example.com\n\n# Перечисление директорий\n# gobuster dir -u https://target.example.com -w /usr/share/wordlists/common.txt\n# /admin         (Status: 302)\n# /api           (Status: 200)\n# /backup        (Status: 403)\n# /.env          (Status: 200)  # Опасно!\n# /phpmyadmin    (Status: 200)  # Не должен быть публичным!' },
        { type: 'warning', value: 'Активное сканирование оставляет следы в логах цели. Используйте только в рамках авторизованного пентеста. Nmap с aggressive настройками может вызвать срабатывание IDS/IPS и даже нарушить работу сервисов.' }
      ]
    },
    {
      id: 4,
      title: 'Анализ и оценка уязвимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'После сканирования необходимо оценить найденные уязвимости по критичности и возможности эксплуатации. CVSS (Common Vulnerability Scoring System) — стандартная система оценки. CVE — идентификатор уязвимости.' },
        { type: 'code', language: 'bash', value: '# === Работа с CVE и CVSS ===\n\n# Поиск CVE для обнаруженных сервисов\n# OpenSSH 8.9p1 -> поиск на nvd.nist.gov\n# nginx 1.24.0 -> поиск на cve.mitre.org\n# MySQL 8.0.35 -> поиск известных CVE\n\n# CVSS Score (0-10):\n# 0.0       — None\n# 0.1-3.9   — Low\n# 4.0-6.9   — Medium\n# 7.0-8.9   — High\n# 9.0-10.0  — Critical\n\n# Vulnerability Scanner: OpenVAS (GVM)\n# Docker:\n# docker run -d -p 443:443 --name openvas greenbone/openvas\n\n# Nuclei: быстрый vulnerability scanner\nnuclei -u https://target.example.com \\\n  -t cves/ \\\n  -t vulnerabilities/ \\\n  -t misconfiguration/ \\\n  -severity critical,high\n\n# Пример вывода nuclei:\n# [critical] CVE-2021-44228 [log4j-rce]\n#   -> https://target.example.com:8080\n# [high] CVE-2023-XXXX [nginx-path-traversal]\n#   -> https://target.example.com\n# [medium] misconfiguration [directory-listing]\n#   -> https://target.example.com/uploads/' },
        { type: 'tip', value: 'Приоритизируйте уязвимости по: CVSS score + доступность эксплойта + impact на бизнес. Критическая уязвимость с публичным эксплойтом на internal сервисе может быть важнее high уязвимости на публичном сервисе.' }
      ]
    },
    {
      id: 5,
      title: 'Отчётность пентеста',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отчёт — самая важная часть пентеста. Он должен быть понятен как техническим специалистам, так и руководству. Структура: Executive Summary, Methodology, Findings (с severity), Recommendations, Appendix.' },
        { type: 'heading', value: 'Структура отчёта' },
        { type: 'list', value: [
          'Executive Summary: краткое описание для руководства (1-2 страницы)',
          'Scope & Methodology: что тестировали и как',
          'Findings: каждая уязвимость с описанием, severity, impact, proof-of-concept',
          'Risk Rating: общая оценка безопасности',
          'Recommendations: приоритизированный план исправления',
          'Appendix: raw данные, скриншоты, логи'
        ]},
        { type: 'code', language: 'bash', value: '# === Шаблон Finding ===\n\n# Название: SQL Injection в форме поиска\n# Severity: Critical (CVSS 9.8)\n# Affected: https://app.example.com/search\n# \n# Описание:\n# Параметр \"query\" в эндпоинте /search уязвим к SQL injection.\n# Пользовательский ввод вставляется в SQL запрос без \n# параметризации.\n#\n# Proof of Concept:\n# GET /search?query=\' OR 1=1 -- \n# Результат: возвращены все записи из таблицы products.\n#\n# Impact:\n# - Чтение всей базы данных (пользователи, пароли, заказы)\n# - Возможность изменения/удаления данных\n# - Потенциальный RCE через SQL функции\n#\n# Recommendation:\n# 1. Использовать параметризованные запросы (Prepared Statements)\n# 2. Внедрить WAF для дополнительной защиты\n# 3. Ограничить права DB пользователя приложения\n#\n# References:\n# - OWASP SQL Injection: https://owasp.org/...\n# - CWE-89: https://cwe.mitre.org/data/definitions/89.html' },
        { type: 'tip', value: 'Proof of Concept должен быть воспроизводимым, но безопасным — не удаляйте данные для демонстрации. Используйте UNION SELECT 1,2,3 вместо DROP TABLE. Скриншоты и curl команды — лучшие доказательства.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Passive Reconnaissance',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите passive reconnaissance собственного домена/проекта: соберите информацию из публичных источников без прямого контакта с серверами.',
      requirements: [
        'Соберите DNS записи (A, MX, NS, TXT, CNAME)',
        'Найдите поддомены через Certificate Transparency logs',
        'Проверьте WHOIS информацию',
        'Найдите публично доступные файлы через Google Dorking (свой домен)',
        'Составьте отчёт с найденной информацией'
      ],
      hint: 'Используйте dig для DNS, crt.sh для CT logs, whois для регистрации. Google: site:yourdomain.com filetype:pdf|doc|env.',
      expectedOutput: 'DNS: A(1.2.3.4), MX(mail.example.com), NS(ns1.hosting.com)\nПоддомены: www, api, staging, admin, mail (через crt.sh)\nWHOIS: регистратор, даты, контакты\nGoogle: найдены 3 PDF, 1 .env файл (ОПАСНО!)\nОтчёт: 5 находок, 1 критическая (публичный .env)',
      solution: '#!/bin/bash\n# Passive Reconnaissance Script\n# Используйте ТОЛЬКО для СВОИХ доменов!\n\nDOMAIN="example.com"\necho "=== Passive Recon: $DOMAIN ==="\n\n# 1. DNS Records\necho "\\n--- DNS Records ---"\ndig $DOMAIN A +short\ndig $DOMAIN MX +short\ndig $DOMAIN NS +short\ndig $DOMAIN TXT +short\n\n# 2. Subdomains via Certificate Transparency\necho "\\n--- Subdomains (crt.sh) ---"\ncurl -s "https://crt.sh/?q=%25.$DOMAIN&output=json" | \\\n  jq -r \'.[].name_value\' 2>/dev/null | sort -u\n\n# 3. WHOIS\necho "\\n--- WHOIS ---"\nwhois $DOMAIN | grep -iE "registrant|creation|expir|name server"\n\n# 4. HTTP Headers (публичная информация)\necho "\\n--- HTTP Headers ---"\ncurl -sI https://$DOMAIN | grep -iE "server|x-powered|x-frame|strict"\n\n# 5. robots.txt и sitemap\necho "\\n--- robots.txt ---"\ncurl -s https://$DOMAIN/robots.txt\n\necho "\\n--- Sitemap ---"\ncurl -s https://$DOMAIN/sitemap.xml | head -20\n\n# 6. Security.txt\necho "\\n--- security.txt ---"\ncurl -s https://$DOMAIN/.well-known/security.txt\n\necho "\\n=== Recon Complete ==="',
      explanation: 'Passive reconnaissance собирает публично доступную информацию без взаимодействия с целью. DNS раскрывает инфраструктуру, CT logs — поддомены (включая staging/dev), WHOIS — контактные данные, HTTP headers — используемые технологии. Эта информация помогает сфокусировать дальнейшее тестирование на наиболее перспективных направлениях.'
    }
  ]
}
