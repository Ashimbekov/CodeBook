export default {
  id: 16,
  title: 'DevSecOps',
  description: 'SAST, DAST, SCA, интеграция безопасности в CI/CD пайплайны, shift-left security и автоматизация проверок.',
  lessons: [
    {
      id: 1,
      title: 'Что такое DevSecOps',
      type: 'theory',
      content: [
        { type: 'text', value: 'DevSecOps — интеграция безопасности на каждом этапе SDLC (Software Development Lifecycle). Вместо проверки безопасности перед релизом, безопасность встроена в процесс разработки с первого дня. Shift-Left: находим уязвимости раньше, исправляем дешевле.' },
        { type: 'heading', value: 'Этапы DevSecOps' },
        { type: 'list', value: [
          'Plan: моделирование угроз, security requirements',
          'Code: IDE security plugins, pre-commit hooks (secrets scanning)',
          'Build: SAST (статический анализ), SCA (проверка зависимостей)',
          'Test: DAST (динамический анализ), fuzzing, penetration testing',
          'Release: container scanning, IaC scanning, compliance checks',
          'Deploy: runtime security, network policies, secrets management',
          'Operate: мониторинг, логирование, incident response',
          'Monitor: SIEM, threat detection, vulnerability management'
        ]},
        { type: 'code', language: 'yaml', value: '# === Полный DevSecOps Pipeline ===\n# .github/workflows/devsecops.yml\nname: DevSecOps Pipeline\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  # 1. Secrets scanning\n  secrets:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n      - name: Gitleaks\n        uses: gitleaks/gitleaks-action@v2\n\n  # 2. SAST (Static Application Security Testing)\n  sast:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Semgrep\n        uses: semgrep/semgrep-action@v1\n        with:\n          config: >-\n            p/security-audit\n            p/owasp-top-ten\n\n  # 3. SCA (Software Composition Analysis)\n  sca:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm audit --audit-level=high\n\n  # 4. Container scanning\n  container:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t myapp:test .\n      - uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: myapp:test\n          severity: CRITICAL,HIGH\n          exit-code: 1\n\n  # 5. IaC scanning\n  iac:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Checkov\n        uses: bridgecrewio/checkov-action@master\n        with:\n          directory: ./terraform/' },
        { type: 'tip', value: 'Shift-Left: стоимость исправления уязвимости на этапе разработки в 30 раз дешевле, чем в production. Автоматизируйте проверки безопасности в CI/CD — разработчики получают обратную связь за минуты, а не недели.' }
      ]
    },
    {
      id: 2,
      title: 'SAST: Static Application Security Testing',
      type: 'theory',
      content: [
        { type: 'text', value: 'SAST анализирует исходный код без выполнения. Находит: SQL injection, XSS, hardcoded secrets, небезопасные функции. Инструменты: Semgrep, SonarQube, CodeQL, Bandit (Python), ESLint security plugins.' },
        { type: 'code', language: 'bash', value: '# === Semgrep: гибкий SAST ===\npip install semgrep\n\n# Сканирование с OWASP правилами\nsemgrep --config p/owasp-top-ten .\n\n# Сканирование с security-audit\nsemgrep --config p/security-audit --config p/secrets .\n\n# Пример вывода:\n# src/api/users.py\n#   security.audit.dangerous-system-call\n#   os.system() called with user input\n#   Line 45: os.system(f"ping {host}")\n#   Fix: Use subprocess.run() with list arguments\n\n# === Bandit: SAST для Python ===\npip install bandit\nbandit -r ./src/ -f json -o bandit-report.json\n\n# === ESLint security plugin (JavaScript) ===\nnpm install --save-dev eslint-plugin-security\n# .eslintrc:\n# { "plugins": ["security"], "extends": ["plugin:security/recommended"] }\n\n# === CodeQL (GitHub) ===\n# Автоматически настраивается через GitHub Advanced Security\n# Находит уязвимости с помощью семантического анализа\n# Поддержка: JavaScript, Python, Java, C/C++, Go, Ruby, C#\n\n# === Собственные правила Semgrep ===\n# rules:\n#   - id: no-eval\n#     patterns:\n#       - pattern: eval(...)\n#     message: "eval() is dangerous — use safe alternatives"\n#     severity: ERROR\n#     languages: [python]' },
        { type: 'tip', value: 'Semgrep — рекомендуемый SAST инструмент: быстрый, бесплатный, легко писать свои правила. Для Python: Semgrep + Bandit. Для JavaScript: Semgrep + ESLint security. Настройте как pre-commit hook для мгновенной обратной связи.' }
      ]
    },
    {
      id: 3,
      title: 'DAST: Dynamic Application Security Testing',
      type: 'theory',
      content: [
        { type: 'text', value: 'DAST тестирует работающее приложение, отправляя вредоносные запросы. Находит уязвимости, которые SAST не может обнаружить (конфигурационные ошибки, runtime issues). Инструменты: OWASP ZAP, Nuclei, Nikto.' },
        { type: 'code', language: 'bash', value: '# === OWASP ZAP: автоматизированное DAST ===\n\n# Запуск ZAP в Docker (baseline scan)\ndocker run -t zaproxy/zap-stable zap-baseline.py \\\n  -t https://staging.example.com\n\n# Full scan (более глубокий, но медленнее)\ndocker run -t zaproxy/zap-stable zap-full-scan.py \\\n  -t https://staging.example.com \\\n  -r zap-report.html\n\n# API scan\ndocker run -t zaproxy/zap-stable zap-api-scan.py \\\n  -t https://staging.example.com/openapi.json \\\n  -f openapi\n\n# Пример вывода:\n# WARN-NEW: X-Frame-Options Header Not Set [10020]\n# WARN-NEW: Missing Anti-CSRF Tokens [10202]\n# WARN-NEW: Cookie Without Secure Flag [10011]\n# FAIL-NEW: SQL Injection [40018]\n# FAIL-NEW: Cross Site Scripting (Reflected) [40012]\n\n# === Nuclei: быстрый vulnerability scanner ===\nnuclei -u https://staging.example.com -t cves/ -t vulnerabilities/ -t misconfiguration/\n\n# Nuclei с пользовательскими шаблонами\nnuclei -u https://staging.example.com -t ./custom-templates/' },
        { type: 'code', language: 'yaml', value: '# DAST в CI/CD (GitHub Actions)\nname: DAST\non:\n  deployment:\n    environment: staging\n\njobs:\n  zap-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - name: OWASP ZAP Baseline Scan\n        uses: zaproxy/action-baseline@v0.10.0\n        with:\n          target: "https://staging.example.com"\n          rules_file_name: ".zap/rules.tsv"\n          cmd_options: "-a"\n      \n      - name: Upload report\n        uses: actions/upload-artifact@v4\n        with:\n          name: zap-report\n          path: report_html.html' },
        { type: 'warning', value: 'DAST тестирует ТОЛЬКО на staging/test окружениях, НИКОГДА на production! DAST отправляет вредоносные payload, которые могут повредить данные. Используйте baseline scan для CI/CD, full scan — периодически.' }
      ]
    },
    {
      id: 4,
      title: 'Pre-commit hooks и IDE security',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pre-commit hooks выполняют проверки безопасности до коммита: сканирование секретов, SAST, линтинг. IDE плагины показывают уязвимости в реальном времени. Это самый ранний этап обнаружения проблем.' },
        { type: 'code', language: 'yaml', value: '# === .pre-commit-config.yaml ===\nrepos:\n  # Поиск секретов\n  - repo: https://github.com/gitleaks/gitleaks\n    rev: v8.18.2\n    hooks:\n      - id: gitleaks\n\n  # SAST\n  - repo: https://github.com/semgrep/semgrep\n    rev: v1.52.0\n    hooks:\n      - id: semgrep\n        args: ["--config", "p/security-audit", "--error"]\n\n  # Python security\n  - repo: https://github.com/PyCQA/bandit\n    rev: 1.7.7\n    hooks:\n      - id: bandit\n        args: [\"-r\", \"./src\"]\n\n  # Dockerfile lint\n  - repo: https://github.com/hadolint/hadolint\n    rev: v2.12.0\n    hooks:\n      - id: hadolint\n\n  # Terraform security\n  - repo: https://github.com/bridgecrewio/checkov\n    rev: 3.1.0\n    hooks:\n      - id: checkov\n        args: [\"--directory\", \"./terraform\"]' },
        { type: 'code', language: 'bash', value: '# Установка pre-commit\npip install pre-commit\n\n# Установка hooks\ncd /path/to/project\npre-commit install\n\n# Запуск на всех файлах (первый раз)\npre-commit run --all-files\n\n# Пример вывода при коммите:\n# gitleaks...........................................................Passed\n# semgrep............................................................Failed\n#   src/app.py: eval() called with user input (security-audit)\n# bandit.............................................................Passed\n# hadolint...........................................................Passed\n\n# Коммит заблокирован до исправления!\n\n# === .gitleaks.toml (кастомные правила) ===\n# [[rules]]\n# id = "custom-api-key"\n# description = "Custom API Key"\n# regex = "(?i)api[_-]?key\\s*=\\s*[a-zA-Z0-9]+"\n# tags = ["key", "api"]' },
        { type: 'tip', value: 'Pre-commit hooks — первая линия обороны. Если разработчик не может закоммитить секрет, он не попадёт в историю Git. Установите gitleaks как минимум — это предотвращает случайную утечку ключей API, паролей, токенов.' }
      ]
    },
    {
      id: 5,
      title: 'Security Champions и культура безопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'DevSecOps — это не только инструменты, но и культура. Security Champions — разработчики, которые продвигают безопасность в своих командах. Обучение, clear guidelines, gamification (bug bounty) — ключевые элементы.' },
        { type: 'heading', value: 'Роль Security Champion' },
        { type: 'list', value: [
          'Проводит security code review в своей команде',
          'Помогает с моделированием угроз (threat modeling)',
          'Является первым контактом для security вопросов',
          'Распространяет best practices и lessons learned',
          'Участвует в triage и приоритизации уязвимостей'
        ]},
        { type: 'heading', value: 'Построение культуры безопасности' },
        { type: 'list', value: [
          'Security Training: регулярные workshops (OWASP, secure coding)',
          'Security Guidelines: документированные стандарты (password policy, API security)',
          'Automated Guardrails: автоматические проверки, а не ручные ревью',
          'Blameless Post-Mortems: анализ инцидентов без обвинений',
          'Bug Bounty: внутренняя или внешняя программа вознаграждений',
          'Security Metrics: время исправления, процент покрытия SAST, количество уязвимостей'
        ]},
        { type: 'code', language: 'bash', value: '# === Метрики безопасности для Dashboard ===\n\n# Mean Time to Remediate (MTTR) по severity\n# Critical: < 24 часа\n# High:     < 7 дней\n# Medium:   < 30 дней\n# Low:      < 90 дней\n\n# Покрытие:\n# - SAST: 100% репозиториев\n# - SCA: 100% репозиториев\n# - DAST: все staging окружения\n# - Container Scan: все Docker образы\n\n# Тренды:\n# - Новые уязвимости за спринт\n# - Закрытые уязвимости за спринт\n# - Средний возраст открытой уязвимости\n# - Процент PR заблокированных security pipeline' },
        { type: 'tip', value: 'Начните с автоматизации (pipeline security), затем обучения (workshops), затем культуры (Security Champions). Не пытайтесь внедрить всё сразу — начните с gitleaks + Semgrep + Dependabot и расширяйте постепенно.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: DevSecOps Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте полный DevSecOps CI/CD pipeline с SAST, SCA, secrets scanning и container scanning.',
      requirements: [
        'Настройте pre-commit hooks: gitleaks + semgrep',
        'Создайте GitHub Actions workflow с SAST (Semgrep), SCA (npm audit), container scan (Trivy)',
        'Добавьте quality gate: pipeline fails при CRITICAL/HIGH уязвимостях',
        'Настройте Dependabot для автоматических обновлений',
        'Создайте security policy document (SECURITY.md)'
      ],
      hint: 'Используйте pre-commit для локальных проверок, GitHub Actions для CI/CD. Каждый инструмент — отдельный job для параллельного выполнения.',
      expectedOutput: 'Pre-commit: gitleaks + semgrep установлены, блокируют секреты\nCI/CD Pipeline:\n  - secrets-scan: PASS (gitleaks)\n  - sast: PASS (semgrep, 0 critical findings)\n  - sca: PASS (npm audit, 0 high/critical)\n  - container-scan: PASS (trivy, 0 critical)\nDependabot: настроен, еженедельная проверка npm + Docker\nQuality Gate: pipeline fails при critical/high',
      solution: '# .pre-commit-config.yaml\nrepos:\n  - repo: https://github.com/gitleaks/gitleaks\n    rev: v8.18.2\n    hooks:\n      - id: gitleaks\n  - repo: https://github.com/semgrep/semgrep\n    rev: v1.52.0\n    hooks:\n      - id: semgrep\n        args: ["--config", "p/security-audit", "--error"]\n\n---\n# .github/workflows/security.yml\nname: Security Pipeline\non: [push, pull_request]\njobs:\n  secrets:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with: { fetch-depth: 0 }\n      - uses: gitleaks/gitleaks-action@v2\n  sast:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: semgrep/semgrep-action@v1\n        with:\n          config: p/owasp-top-ten p/security-audit\n  sca:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm audit --audit-level=high\n  container:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t app:test .\n      - uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: app:test\n          severity: CRITICAL,HIGH\n          exit-code: 1\n\n---\n# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: npm\n    directory: "/"\n    schedule: { interval: weekly }',
      explanation: 'DevSecOps pipeline автоматизирует проверки безопасности: pre-commit hooks ловят проблемы до коммита, CI/CD сканирует код (SAST), зависимости (SCA) и контейнеры при каждом PR. Quality gates блокируют деплой уязвимого кода. Dependabot автоматически обновляет уязвимые пакеты.'
    }
  ]
}
