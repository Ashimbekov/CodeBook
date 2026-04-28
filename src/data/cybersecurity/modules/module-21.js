export default {
  id: 21,
  title: 'Incident Response',
  description: 'Обнаружение, сдерживание, устранение, восстановление и post-mortem анализ инцидентов безопасности.',
  lessons: [
    {
      id: 1,
      title: 'Процесс реагирования на инциденты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Incident Response (IR) — структурированный подход к обработке инцидентов безопасности. Фреймворк NIST: Preparation -> Detection & Analysis -> Containment -> Eradication -> Recovery -> Post-Incident Activity.' },
        { type: 'heading', value: 'Фазы Incident Response (NIST SP 800-61)' },
        { type: 'list', value: [
          '1. Preparation: IR план, команда, инструменты, runbooks',
          '2. Detection & Analysis: обнаружение инцидента, определение scope',
          '3. Containment: ограничение распространения (изоляция, блокировка)',
          '4. Eradication: удаление угрозы (malware, backdoors, уязвимости)',
          '5. Recovery: восстановление нормальной работы, мониторинг',
          '6. Post-Incident: lessons learned, улучшение процессов'
        ]},
        { type: 'code', language: 'bash', value: '# === IR Severity Levels ===\n# SEV-1 (Critical): Активная атака, утечка данных, ransomware\n#   Response: немедленно, 24/7, вся IR команда\n#   SLA: обнаружение < 1 час, containment < 4 часа\n\n# SEV-2 (High): Компрометация системы, подозрительная активность\n#   Response: в рабочее время < 2 часов, вне — < 4 часов\n\n# SEV-3 (Medium): Уязвимость без эксплуатации, policy violation\n#   Response: следующий рабочий день\n\n# SEV-4 (Low): Информационные события, best practice violations\n#   Response: в рамках обычного workflow\n\n# === IR Team Roles ===\n# Incident Commander: координация, принятие решений\n# Technical Lead: технический анализ, containment\n# Communications: уведомление stakeholders, клиентов\n# Legal: юридические аспекты, compliance\n# Executive Sponsor: одобрение критичных решений' },
        { type: 'warning', value: 'Время — критичный фактор. Среднее время обнаружения (MTTD) взлома — 204 дня. Среднее время реагирования (MTTR) — 73 дня. Каждый день задержки увеличивает ущерб. Автоматизация обнаружения и наличие IR плана сокращают эти метрики в разы.' }
      ]
    },
    {
      id: 2,
      title: 'Обнаружение и анализ инцидентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обнаружение инцидента — первый и самый важный шаг. Источники: SIEM алерты, IDS/IPS, EDR, пользовательские отчёты, внешние уведомления. Анализ определяет: что произошло, когда, какой scope.' },
        { type: 'code', language: 'bash', value: '# === Первичный анализ инцидента ===\n\n# 1. Сбор индикаторов компрометации (IoC)\n# IP адреса атакующего\n# Домены C2 серверов\n# Хэши вредоносных файлов\n# Подозрительные email адреса\n# Пути к backdoor файлам\n\n# 2. Анализ логов\n# Последние аутентификации\nlast -50\nlastb -50  # Неудачные попытки\n\n# Системные логи\njournalctl --since \"2026-04-04\" --until \"2026-04-05\" | \\\n  grep -iE \"error|fail|denied|unauthorized\"\n\n# Web-сервер логи\ngrep -E \"(sqlmap|union.*select|cmd=|exec|eval)\" /var/log/nginx/access.log\n\n# SSH логи\ngrep \"Accepted\\|Failed\" /var/log/auth.log | tail -50\n\n# 3. Проверка подозрительных процессов\nps auxf | grep -v \"\\[\" | head -50\nnetstat -tlnp  # Какие порты слушают?\nlsof -i -P -n  # Открытые сетевые соединения\n\n# 4. Проверка файловой системы\nfind / -name \"*.php\" -newer /etc/passwd -not -path \"/proc/*\" 2>/dev/null\nfind /tmp -executable -type f 2>/dev/null\n# Файлы изменённые за последние 24 часа:\nfind / -mtime -1 -not -path \"/proc/*\" -not -path \"/sys/*\" 2>/dev/null | head -50\n\n# 5. Проверка crontab\nfor user in $(cut -f1 -d: /etc/passwd); do\n  crontab -l -u $user 2>/dev/null | grep -v \"^#\"\ndone' },
        { type: 'tip', value: 'Первое правило IR: НЕ ПАНИКУЙТЕ. Второе: НЕ УНИЧТОЖАЙТЕ УЛИКИ. Не перезагружайте сервер, не удаляйте файлы — сначала соберите evidence. Создайте дамп памяти и копию дисков перед containment.' }
      ]
    },
    {
      id: 3,
      title: 'Containment и Eradication',
      type: 'theory',
      content: [
        { type: 'text', value: 'Containment ограничивает распространение атаки: изоляция систем, блокировка IP, отключение аккаунтов. Eradication удаляет угрозу: malware, backdoors, патчинг уязвимостей.' },
        { type: 'code', language: 'bash', value: '# === Containment Actions ===\n\n# 1. Сетевая изоляция компрометированного хоста\nsudo iptables -A INPUT -s compromised_ip -j DROP\nsudo iptables -A OUTPUT -d compromised_ip -j DROP\n# Или: отключить порт на коммутаторе\n# Или: изолировать в отдельный VLAN\n\n# 2. Блокировка атакующего IP\nsudo iptables -A INPUT -s attacker_ip -j DROP\n# На WAF/Firewall:\n# Добавить IP в blacklist\n\n# 3. Отключение скомпрометированных аккаунтов\n# Linux\nsudo passwd -l compromised_user  # Lock account\nsudo usermod -s /sbin/nologin compromised_user\n\n# Отзыв всех сессий и токенов\n# В приложении: invalidate all sessions for user\n\n# 4. Ротация скомпрометированных секретов\n# Все пароли, API ключи, сертификаты к которым был доступ\n\n# === Eradication ===\n\n# 1. Удаление malware/backdoors\nfind / -name \"*.php\" -newer /etc/passwd -exec rm -v {} \\;\n# Проверить crontab, systemd services, authorized_keys\n\n# 2. Патчинг уязвимости\nsudo apt update && sudo apt upgrade -y\n\n# 3. Усиление конфигурации\n# Обновить firewall rules\n# Усилить пароли\n# Включить MFA\n\n# 4. Восстановление из чистого backup (если compromise глубокий)\n# Rebuild сервера from scratch (не восстановление snapshot!)' },
        { type: 'warning', value: 'При серьёзной компрометации не пытайтесь "очистить" систему — пересоздайте её с нуля. Атакующий мог оставить скрытые backdoors (rootkit, modified binaries), которые невозможно обнаружить обычными инструментами.' }
      ]
    },
    {
      id: 4,
      title: 'Recovery и Post-Mortem',
      type: 'theory',
      content: [
        { type: 'text', value: 'Recovery — восстановление нормальной работы с усиленным мониторингом. Post-Mortem (Lessons Learned) — blameless анализ инцидента для предотвращения повторения.' },
        { type: 'heading', value: 'Структура Post-Mortem' },
        { type: 'list', value: [
          'Timeline: хронология событий (когда началось, обнаружено, containment)',
          'Root Cause: первопричина инцидента',
          'Impact: что затронуто, сколько пользователей/данных',
          'Response: что было сделано, что сработало/не сработало',
          'Action Items: конкретные шаги для предотвращения повторения',
          'Metrics: MTTD (время обнаружения), MTTR (время восстановления)'
        ]},
        { type: 'code', language: 'bash', value: '# === Шаблон Post-Mortem ===\n\n# Инцидент: SQL Injection привёл к утечке данных\n# Severity: SEV-1 (Critical)\n# Date: 2026-04-04\n# Duration: 8 часов (от начала атаки до containment)\n# Impact: утечка 10,000 записей пользователей\n\n# Timeline:\n# 03:00 — Атакующий обнаружил SQL injection в /api/search\n# 03:15 — Извлечение данных из таблицы users\n# 07:00 — SIEM алерт: аномальный объём SQL запросов\n# 07:30 — SOC аналитик подтвердил инцидент (MTTD: 4.5 часа)\n# 08:00 — Incident Commander назначен, команда собрана\n# 08:30 — WAF правило заблокировало IP атакующего\n# 09:00 — Уязвимый endpoint отключён\n# 11:00 — Патч развёрнут, endpoint включён (MTTR: 4 часа)\n# 14:00 — Уведомление затронутых пользователей\n\n# Root Cause:\n# Конкатенация строк в SQL запросе (отсутствие prepared statements)\n# Code review не обнаружил уязвимость\n# SAST не был настроен для этого репозитория\n\n# Action Items:\n# [P0] Аудит всех SQL запросов в приложении (owner: @dev-lead, deadline: 1 неделя)\n# [P0] Настроить Semgrep SAST в CI/CD (owner: @devsecops, deadline: 3 дня)\n# [P1] Внедрить WAF для всех API (owner: @infra, deadline: 2 недели)\n# [P1] Улучшить SIEM правила для SQL injection (owner: @soc, deadline: 1 неделя)\n# [P2] Security training для разработчиков (owner: @security, deadline: 1 месяц)' },
        { type: 'tip', value: 'Post-Mortem должен быть BLAMELESS — без обвинений конкретных людей. Фокус на процессах и системах, а не на людях. "Почему SAST не обнаружил?" вместо "Почему разработчик написал уязвимый код?"' }
      ]
    },
    {
      id: 5,
      title: 'IR Automation и Playbooks',
      type: 'theory',
      content: [
        { type: 'text', value: 'IR Playbooks — пошаговые инструкции для типовых инцидентов. SOAR (Security Orchestration, Automation, and Response) автоматизирует стандартные действия: блокировка IP, изоляция хоста, уведомления.' },
        { type: 'code', language: 'python', value: '# === Автоматизированный IR Playbook ===\nimport requests\nimport smtplib\nfrom datetime import datetime\n\nclass IncidentPlaybook:\n    def __init__(self, incident_type, severity, details):\n        self.incident_type = incident_type\n        self.severity = severity\n        self.details = details\n        self.timeline = []\n        self.log(f"Incident created: {incident_type} (SEV-{severity})")\n    \n    def log(self, message):\n        entry = f"{datetime.utcnow().isoformat()} - {message}"\n        self.timeline.append(entry)\n        print(entry)\n    \n    def run_brute_force_playbook(self):\n        """Playbook: Brute Force Attack"""\n        attacker_ip = self.details.get("source_ip")\n        target_user = self.details.get("username")\n        \n        # Step 1: Block attacker IP\n        self.log(f"Blocking IP: {attacker_ip}")\n        self.block_ip(attacker_ip)\n        \n        # Step 2: Lock targeted account\n        self.log(f"Locking account: {target_user}")\n        self.lock_account(target_user)\n        \n        # Step 3: Check if account was compromised\n        self.log("Checking for successful logins from attacker IP")\n        compromised = self.check_successful_login(attacker_ip)\n        \n        if compromised:\n            self.log("COMPROMISED! Revoking all sessions")\n            self.revoke_sessions(target_user)\n            self.force_password_reset(target_user)\n            self.escalate_to_sev1()\n        \n        # Step 4: Notify security team\n        self.notify_team()\n        \n        # Step 5: Generate report\n        return self.generate_report()\n    \n    def block_ip(self, ip):\n        # Интеграция с firewall API\n        requests.post("https://firewall.internal/api/block",\n            json={"ip": ip, "reason": "brute_force", "ttl": 86400})\n    \n    def lock_account(self, username):\n        requests.post("https://auth.internal/api/lock",\n            json={"username": username})\n    \n    def notify_team(self):\n        # Slack notification\n        requests.post("https://hooks.slack.com/services/...",\n            json={"text": f"Security Incident: {self.incident_type}\\n" +\n                          "\\n".join(self.timeline[-5:])})\n\n# Использование\nincident = IncidentPlaybook(\n    "brute_force", severity=2,\n    details={"source_ip": "185.x.x.x", "username": "admin"}\n)\nincident.run_brute_force_playbook()' },
        { type: 'tip', value: 'Создайте playbooks для типовых инцидентов: brute force, malware, phishing, data leak, ransomware. Автоматизируйте первые шаги (block IP, lock account, notify). Это сокращает MTTR с часов до минут.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Incident Response Simulation',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите симуляцию реагирования на инцидент: обнаружение SQL injection, containment, eradication и составление post-mortem.',
      requirements: [
        'Проанализируйте логи и обнаружьте признаки SQL injection атаки',
        'Определите scope: какие данные были затронуты',
        'Выполните containment: заблокируйте IP, отключите уязвимый endpoint',
        'Создайте патч для уязвимости (parameterized query)',
        'Составьте post-mortem с timeline и action items'
      ],
      hint: 'Ищите в логах: UNION SELECT, OR 1=1, sqlmap user-agent. Scope: какие таблицы упоминаются в запросах. Containment: iptables + disable endpoint.',
      expectedOutput: 'Обнаружение: аномальные SQL patterns в access.log от IP 185.x.x.x\nScope: таблицы users, orders затронуты, ~10K записей\nContainment: IP заблокирован, endpoint /api/search отключён\nEradication: SQL injection исправлен (prepared statements)\nPost-Mortem: timeline, root cause, 5 action items\nMTTD: 2 часа, MTTR: 3 часа',
      solution: '#!/bin/bash\n# IR Simulation: SQL Injection Incident\n\necho "=== INCIDENT RESPONSE: SQL Injection ==="\necho "Time: $(date -u)"\necho ""\n\n# 1. Detection\necho "--- Phase 1: Detection ---"\necho "Alert: WAF detected SQL injection patterns"\necho "Source IP: 185.123.45.67"\necho "Target: /api/search?q=%27%20UNION%20SELECT"\necho "Signatures: UNION SELECT, OR 1=1, information_schema"\necho ""\n\n# 2. Analysis\necho "--- Phase 2: Analysis ---"\necho "Affected endpoint: /api/search"\necho "Vulnerability: String concatenation in SQL query"\necho "Data accessed: users (email, password_hash), orders"\necho "Records potentially exposed: ~10,000"\necho ""\n\n# 3. Containment\necho "--- Phase 3: Containment ---"\necho "Action: Block attacker IP"\necho "  iptables -A INPUT -s 185.123.45.67 -j DROP"\necho "Action: Disable vulnerable endpoint"\necho "  nginx: return 503 for /api/search"\necho "Action: Revoke all active sessions"\necho "  redis-cli FLUSHDB (session store)"\necho ""\n\n# 4. Eradication\necho "--- Phase 4: Eradication ---"\necho "Fix: Replace string concatenation with prepared statements"\necho "  BEFORE: f\\\"SELECT * FROM products WHERE name LIKE \\x27%{query}%\\x27\\\""\necho "  AFTER:  cursor.execute(\\\"SELECT * FROM products WHERE name LIKE %s\\\", (f\\\"%{query}%\\\",))"\necho "Deploy: patch deployed to production"\necho "Verify: endpoint re-enabled, tested with sqlmap (clean)"\necho ""\n\n# 5. Recovery\necho "--- Phase 5: Recovery ---"\necho "Force password reset for all affected users"\necho "Notify affected users within 72 hours (GDPR)"\necho "Enhanced monitoring enabled"\necho ""\n\n# 6. Post-Mortem\necho "--- Phase 6: Post-Mortem ---"\necho "Root Cause: Parameterized queries not used in search API"\necho "MTTD: 2 hours | MTTR: 3 hours"\necho "Action Items:"\necho "  [P0] Audit all SQL queries in codebase"\necho "  [P0] Add Semgrep SAST to CI/CD"\necho "  [P1] Deploy WAF with SQL injection rules"\necho "  [P1] Implement query parameterization linting"\necho "  [P2] Quarterly security training for developers"',
      explanation: 'Incident Response следует структурированному процессу: обнаружение через мониторинг, анализ scope, быстрый containment (блокировка, изоляция), устранение причины (патч), восстановление с мониторингом, и blameless post-mortem для предотвращения повторения.'
    }
  ]
}
