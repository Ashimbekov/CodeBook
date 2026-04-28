export default {
  id: 1,
  title: 'Введение в кибербезопасность',
  description: 'CIA триада, ландшафт угроз, типы атак, модели угроз, карьерные пути в кибербезопасности и основные принципы защиты информации.',
  lessons: [
    {
      id: 1,
      title: 'Что такое кибербезопасность и зачем она нужна',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кибербезопасность — это практика защиты систем, сетей и программ от цифровых атак. Эти атаки обычно направлены на доступ, изменение или уничтожение конфиденциальной информации, вымогательство денег или нарушение нормальной работы бизнес-процессов.' },
        { type: 'heading', value: 'Почему кибербезопасность важна' },
        { type: 'list', value: [
          'Среднее время обнаружения взлома — 204 дня (IBM Cost of Data Breach Report)',
          'Средняя стоимость утечки данных — $4.45 миллиона',
          'Каждые 39 секунд происходит кибератака (University of Maryland)',
          'К 2025 году ущерб от киберпреступлений достигнет $10.5 триллионов в год',
          'Дефицит специалистов по кибербезопасности — более 3.5 миллионов позиций в мире'
        ]},
        { type: 'code', language: 'bash', value: '# Простой пример: проверка открытых портов на своём сервере\n# (только на собственных системах с разрешением!)\n\n# Проверить какие порты слушают на localhost\nss -tlnp\n# или\nnetstat -tlnp\n\n# Пример вывода:\n# State   Local Address:Port   Process\n# LISTEN  0.0.0.0:22           sshd\n# LISTEN  0.0.0.0:80           nginx\n# LISTEN  0.0.0.0:443          nginx\n# LISTEN  0.0.0.0:5432         postgres\n\n# Вопрос: должен ли PostgreSQL (5432) слушать на 0.0.0.0?\n# Нет! Он должен слушать только на 127.0.0.1\n# Это пример простой, но критичной ошибки конфигурации' },
        { type: 'warning', value: 'Все инструменты и техники в этом курсе предназначены ИСКЛЮЧИТЕЛЬНО для защиты и авторизованного тестирования. Несанкционированный доступ к чужим системам является уголовным преступлением. Всегда получайте письменное разрешение перед тестированием безопасности.' }
      ]
    },
    {
      id: 2,
      title: 'CIA триада: конфиденциальность, целостность, доступность',
      type: 'theory',
      content: [
        { type: 'text', value: 'CIA триада — фундаментальная модель информационной безопасности. Три принципа: Confidentiality (конфиденциальность), Integrity (целостность), Availability (доступность). Каждое решение в области безопасности балансирует эти три аспекта.' },
        { type: 'heading', value: 'Конфиденциальность (Confidentiality)' },
        { type: 'text', value: 'Информация доступна только авторизованным пользователям. Примеры нарушения: утечка базы данных пользователей, перехват незашифрованного трафика, социальная инженерия.' },
        { type: 'heading', value: 'Целостность (Integrity)' },
        { type: 'text', value: 'Данные не могут быть изменены неавторизованным способом. Примеры нарушения: подмена содержимого сайта (defacement), модификация финансовых транзакций, изменение логов для сокрытия следов.' },
        { type: 'heading', value: 'Доступность (Availability)' },
        { type: 'text', value: 'Системы и данные доступны авторизованным пользователям когда они нужны. Примеры нарушения: DDoS атаки, ransomware (шифрование данных), физическое уничтожение серверов.' },
        { type: 'code', language: 'python', value: '# Пример CIA триады в коде\n\n# КОНФИДЕНЦИАЛЬНОСТЬ: шифрование данных\nimport hashlib\nimport secrets\n\ndef hash_password(password: str) -> tuple[str, str]:\n    """Хэширование пароля с солью — защита конфиденциальности"""\n    salt = secrets.token_hex(32)\n    password_hash = hashlib.pbkdf2_hmac(\n        \'sha256\',\n        password.encode(),\n        salt.encode(),\n        iterations=100_000\n    )\n    return password_hash.hex(), salt\n\n# ЦЕЛОСТНОСТЬ: проверка контрольной суммы файла\ndef verify_file_integrity(filepath: str, expected_hash: str) -> bool:\n    """Проверка что файл не был изменён"""\n    sha256 = hashlib.sha256()\n    with open(filepath, \'rb\') as f:\n        for chunk in iter(lambda: f.read(4096), b\'\'):\n            sha256.update(chunk)\n    return sha256.hexdigest() == expected_hash\n\n# ДОСТУПНОСТЬ: health check эндпоинт\ndef health_check() -> dict:\n    """Проверка доступности сервисов"""\n    return {\n        "status": "healthy",\n        "database": check_db_connection(),\n        "cache": check_redis_connection(),\n        "disk_space": check_disk_space()\n    }' },
        { type: 'tip', value: 'Помимо CIA, существует расширенная модель — Parkerian Hexad: добавляет Possession (владение), Authenticity (подлинность) и Utility (полезность). Но CIA остаётся основой.' }
      ]
    },
    {
      id: 3,
      title: 'Ландшафт угроз и типы атак',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ландшафт угроз постоянно меняется. Основные категории: внешние атаки (хакеры, APT-группы), внутренние угрозы (инсайдеры), автоматизированные атаки (ботнеты, черви), целевые атаки (spear phishing, APT).' },
        { type: 'heading', value: 'Классификация угроз по типу' },
        { type: 'list', value: [
          'Malware: вирусы, трояны, ransomware, spyware, rootkits',
          'Social Engineering: фишинг, vishing (голосовой), smishing (SMS)',
          'Network Attacks: DDoS, Man-in-the-Middle, DNS poisoning, ARP spoofing',
          'Web Attacks: SQL injection, XSS, CSRF, SSRF, RCE',
          'Supply Chain: компрометация зависимостей, CI/CD pipeline attacks',
          'Zero-Day: эксплойты для неизвестных уязвимостей'
        ]},
        { type: 'heading', value: 'Классификация по источнику' },
        { type: 'list', value: [
          'Script Kiddies: используют готовые инструменты, низкая квалификация',
          'Хактивисты: политически мотивированные атаки',
          'Организованная преступность: финансовая мотивация, ransomware',
          'APT (Advanced Persistent Threat): государственные группы, долгосрочные кампании',
          'Инсайдеры: сотрудники с легитимным доступом'
        ]},
        { type: 'code', language: 'bash', value: '# MITRE ATT&CK Framework — база знаний тактик и техник атакующих\n# https://attack.mitre.org/\n\n# Тактики (ЧТО атакующий хочет достичь):\n# 1. Reconnaissance     — сбор информации о цели\n# 2. Resource Development — подготовка инфраструктуры атаки\n# 3. Initial Access      — первоначальное проникновение\n# 4. Execution           — выполнение вредоносного кода\n# 5. Persistence         — закрепление в системе\n# 6. Privilege Escalation — повышение привилегий\n# 7. Defense Evasion     — обход защиты\n# 8. Credential Access   — получение учётных данных\n# 9. Discovery           — исследование внутренней сети\n# 10. Lateral Movement   — перемещение по сети\n# 11. Collection         — сбор целевых данных\n# 12. Exfiltration       — вывод данных\n# 13. Impact             — разрушительные действия\n\n# Пример: Cyber Kill Chain (Lockheed Martin)\n# Recon -> Weaponize -> Deliver -> Exploit -> Install -> C2 -> Actions' },
        { type: 'tip', value: 'Изучайте реальные инциденты: SolarWinds (supply chain), Log4Shell (RCE в Java), MOVEit (SQL injection), Colonial Pipeline (ransomware). Каждый инцидент содержит важные уроки по защите.' }
      ]
    },
    {
      id: 4,
      title: 'Модели угроз и принципы защиты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Моделирование угроз (Threat Modeling) — систематический подход к выявлению потенциальных угроз и уязвимостей. Основные методологии: STRIDE (Microsoft), DREAD, PASTA, Attack Trees.' },
        { type: 'heading', value: 'STRIDE модель' },
        { type: 'list', value: [
          'Spoofing (подделка) — выдача себя за другого пользователя/систему',
          'Tampering (подмена) — несанкционированное изменение данных',
          'Repudiation (отказ) — отрицание выполненного действия',
          'Information Disclosure (утечка) — доступ к конфиденциальной информации',
          'Denial of Service (отказ в обслуживании) — нарушение доступности',
          'Elevation of Privilege (повышение привилегий) — получение незаконных прав'
        ]},
        { type: 'heading', value: 'Принципы безопасного дизайна' },
        { type: 'code', language: 'python', value: '# Принцип наименьших привилегий (Least Privilege)\n# Пользователь/процесс получает МИНИМУМ прав для выполнения задачи\n\n# Плохо: все пользователи — админы\nuser_role = "admin"  # Каждый может всё\n\n# Хорошо: гранулярные права\nclass Permission:\n    READ_OWN_PROFILE = "read:own_profile"\n    EDIT_OWN_PROFILE = "edit:own_profile"\n    READ_ALL_USERS = "read:all_users"     # Только для админов\n    DELETE_USER = "delete:user"            # Только для супер-админов\n\ndef check_permission(user, required_permission):\n    if required_permission not in user.permissions:\n        raise PermissionError(\n            f"Пользователь {user.id} не имеет права {required_permission}"\n        )\n\n# Принцип Defense in Depth (глубокая оборона)\n# Несколько слоёв защиты:\n# 1. Firewall (сетевой уровень)\n# 2. WAF (уровень приложения)\n# 3. Аутентификация (уровень пользователя)\n# 4. Авторизация (уровень ресурса)\n# 5. Шифрование (уровень данных)\n# 6. Мониторинг (уровень обнаружения)\n\n# Принцип Fail Secure\n# При ошибке система переходит в безопасное состояние\ndef authorize_request(request):\n    try:\n        token = validate_jwt(request.headers["Authorization"])\n        return check_permissions(token)\n    except Exception:\n        # При ЛЮБОЙ ошибке — отказ в доступе\n        return False  # Fail secure, а не fail open!' },
        { type: 'tip', value: 'Другие важные принципы: Zero Trust (никому не доверяй, всегда проверяй), Separation of Duties (разделение обязанностей), Security by Default (безопасная конфигурация по умолчанию), Keep It Simple (чем проще система, тем легче её защитить).' }
      ]
    },
    {
      id: 5,
      title: 'Карьерные пути в кибербезопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кибербезопасность — широкая область с множеством специализаций. Основные направления: Blue Team (защита), Red Team (атака/тестирование), Purple Team (интеграция), GRC (управление рисками и комплаенс).' },
        { type: 'heading', value: 'Blue Team — защита' },
        { type: 'list', value: [
          'SOC Analyst — мониторинг и реагирование на инциденты (SIEM, IDS)',
          'Security Engineer — проектирование и внедрение защиты',
          'DevSecOps Engineer — интеграция безопасности в CI/CD',
          'Application Security Engineer — безопасность приложений (SAST, DAST)',
          'Cloud Security Engineer — безопасность облачных сред (AWS, GCP, Azure)'
        ]},
        { type: 'heading', value: 'Red Team — атака' },
        { type: 'list', value: [
          'Penetration Tester — тестирование на проникновение',
          'Bug Bounty Hunter — поиск уязвимостей за вознаграждение',
          'Red Team Operator — симуляция реальных атак',
          'Malware Analyst — анализ вредоносного ПО (reverse engineering)'
        ]},
        { type: 'heading', value: 'Сертификации' },
        { type: 'list', value: [
          'CompTIA Security+ — начальный уровень, основы безопасности',
          'CEH (Certified Ethical Hacker) — этичный хакинг',
          'OSCP (Offensive Security Certified Professional) — продвинутый пентест',
          'CISSP — управление безопасностью (для менеджеров)',
          'AWS Security Specialty — облачная безопасность AWS'
        ]},
        { type: 'code', language: 'bash', value: '# Полезные ресурсы для начинающих:\n\n# Практика:\n# - TryHackMe (tryhackme.com) — интерактивные лаборатории\n# - HackTheBox (hackthebox.com) — CTF и машины для взлома\n# - PortSwigger Web Academy (portswigger.net) — веб-безопасность\n# - OWASP WebGoat — уязвимое приложение для обучения\n\n# CTF (Capture The Flag) — соревнования:\n# - PicoCTF (начальный уровень)\n# - CTFtime.org — календарь соревнований\n\n# Установка учебной среды:\n# DVWA (Damn Vulnerable Web Application)\ndocker run --rm -it -p 80:80 vulnerables/web-dvwa\n\n# OWASP Juice Shop\ndocker run --rm -p 3000:3000 bkimminich/juice-shop\n\n# Metasploitable (уязвимая VM для пентеста)\n# Скачать с rapid7.com и запустить в VirtualBox' },
        { type: 'tip', value: 'Начните с Blue Team (защита) — понимание атак придёт естественно. Лучший путь: Security+ -> практика на TryHackMe -> специализация. Важнее сертификаций — реальные навыки и портфолио (write-ups CTF, вклад в open-source, bug bounty).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Аудит безопасности системы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проведите базовый аудит безопасности системы: проверьте открытые порты, пользователей, права файлов и настройки SSH.',
      requirements: [
        'Выведите список всех открытых портов и определите, какие из них не нужны',
        'Проверьте список пользователей с оболочкой bash/sh в системе',
        'Найдите файлы с SUID-битом (потенциально опасные)',
        'Проверьте конфигурацию SSH на наличие небезопасных настроек',
        'Составьте отчёт с найденными проблемами и рекомендациями'
      ],
      hint: 'Используйте ss -tlnp для портов, /etc/passwd для пользователей, find / -perm -4000 для SUID файлов, /etc/ssh/sshd_config для SSH.',
      expectedOutput: 'Открытые порты: 22(SSH), 80(HTTP), 443(HTTPS), 5432(PostgreSQL)\nРекомендация: PostgreSQL не должен слушать на 0.0.0.0\n\nПользователи с shell: root, ubuntu, deploy\nРекомендация: проверить необходимость каждого аккаунта\n\nSUID файлы: /usr/bin/sudo, /usr/bin/passwd, /usr/bin/chfn\nРекомендация: убедиться что нестандартных SUID файлов нет\n\nSSH: PermitRootLogin yes (ОПАСНО!), PasswordAuthentication yes (рекомендуется отключить)',
      solution: '#!/bin/bash\n# Базовый скрипт аудита безопасности\n# ТОЛЬКО для собственных систем!\n\necho "=== АУДИТ БЕЗОПАСНОСТИ СИСТЕМЫ ==="\necho "Дата: $(date)"\necho "Хост: $(hostname)"\necho ""\n\n# 1. Открытые порты\necho "--- Открытые порты ---"\nss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null\necho ""\n\n# 2. Пользователи с shell доступом\necho "--- Пользователи с shell ---"\ngrep -E \'/bin/(bash|sh|zsh)\' /etc/passwd\necho ""\n\n# 3. SUID файлы\necho "--- Файлы с SUID битом ---"\nfind / -perm -4000 -type f 2>/dev/null\necho ""\n\n# 4. Проверка SSH конфигурации\necho "--- Конфигурация SSH ---"\ngrep -E "^(PermitRootLogin|PasswordAuthentication|Port|Protocol)" /etc/ssh/sshd_config 2>/dev/null\necho ""\n\n# 5. Последние неудачные попытки входа\necho "--- Неудачные попытки входа (последние 10) ---"\nlastb 2>/dev/null | head -10\necho ""\n\n# 6. Проверка обновлений безопасности\necho "--- Доступные обновления безопасности ---"\napt list --upgradable 2>/dev/null | grep -i security\n\necho ""\necho "=== АУДИТ ЗАВЕРШЁН ==="',
      explanation: 'Базовый аудит безопасности включает проверку: открытых портов (минимизировать поверхность атаки), учётных записей (удалить неиспользуемые), SUID файлов (потенциальные векторы повышения привилегий), конфигурации SSH (отключить root login, использовать ключи). Это минимальный набор проверок, полный аудит включает десятки дополнительных проверок.'
    }
  ]
}
