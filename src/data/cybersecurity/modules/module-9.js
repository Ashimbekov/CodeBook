export default {
  id: 9,
  title: 'OWASP Top 10: Deserialization & Components',
  description: 'Небезопасная десериализация, уязвимые зависимости, Software Composition Analysis (SCA) и управление рисками компонентов.',
  lessons: [
    {
      id: 1,
      title: 'Insecure Deserialization',
      type: 'theory',
      content: [
        { type: 'text', value: 'Десериализация — восстановление объекта из последовательности байтов. Если десериализуемые данные контролируются атакующим, это может привести к RCE (Remote Code Execution), DoS или обходу аутентификации.' },
        { type: 'code', language: 'python', value: '# === ОПАСНО: pickle в Python ===\nimport pickle\nimport os\n\n# Pickle может выполнять произвольный код при десериализации!\nclass Exploit:\n    def __reduce__(self):\n        # __reduce__ вызывается при десериализации\n        return (os.system, ("whoami",))  # Выполнит команду!\n\n# Атакующий создаёт вредоносный payload\nmalicious_data = pickle.dumps(Exploit())\n\n# Жертва десериализует (ВЫПОЛНИТСЯ whoami!)\n# pickle.loads(malicious_data)\n\n# НИКОГДА не десериализуйте данные из недоверенных источников!\n\n# === Безопасные альтернативы ===\nimport json\n\n# JSON — безопасен (не может содержать код)\ndata = json.loads(\'{"name": "Alice", "age": 30}\')\n\n# Если pickle необходим — используйте подпись\nimport hmac\nimport hashlib\n\nSECRET_KEY = b"your-secret-key"\n\ndef safe_serialize(obj):\n    data = pickle.dumps(obj)\n    signature = hmac.new(SECRET_KEY, data, hashlib.sha256).hexdigest()\n    return data, signature\n\ndef safe_deserialize(data, signature):\n    expected = hmac.new(SECRET_KEY, data, hashlib.sha256).hexdigest()\n    if not hmac.compare_digest(signature, expected):\n        raise ValueError("Данные изменены!")\n    return pickle.loads(data)  # Только если подпись верна' },
        { type: 'warning', value: 'Python pickle, Java ObjectInputStream, PHP unserialize(), Ruby Marshal — все поддерживают выполнение кода при десериализации. Используйте JSON, Protocol Buffers или MessagePack для обмена данными.' }
      ]
    },
    {
      id: 2,
      title: 'Десериализация в JavaScript и Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript менее подвержен классической десериализации, но node-serialize и подобные библиотеки создают RCE. Java — особенно уязвима из-за сложной системы сериализации (ObjectInputStream).' },
        { type: 'code', language: 'javascript', value: '// === JavaScript: опасный node-serialize ===\n\n// УЯЗВИМО: node-serialize позволяет выполнять функции\nconst serialize = require("node-serialize");\n\n// Вредоносный payload:\nconst payload = {\n  name: "_$$ND_FUNC$$_function() { require(\'child_process\').exec(\'whoami\') }()"\n};\n// При десериализации функция ВЫПОЛНИТСЯ!\n\n// === Безопасные практики для JavaScript ===\n\n// 1. Используйте JSON.parse() — безопасен\nconst data = JSON.parse(userInput);\n\n// 2. Валидируйте структуру после парсинга\nconst Joi = require("joi");\nconst schema = Joi.object({\n  name: Joi.string().max(100).required(),\n  age: Joi.number().integer().min(0).max(150),\n  email: Joi.string().email()\n});\n\nconst { value, error } = schema.validate(data);\nif (error) {\n  throw new Error(`Невалидные данные: ${error.message}`);\n}\n\n// 3. Никогда не используйте eval() с пользовательскими данными\n// eval(userInput)       // НИКОГДА!\n// new Function(userInput)  // НИКОГДА!\n// setTimeout(userInput, 0) // НИКОГДА! (строка выполняется как код)' },
        { type: 'tip', value: 'Для валидации данных после десериализации используйте: Joi/Zod (JavaScript), Pydantic/marshmallow (Python), Bean Validation (Java). Валидация структуры и типов — обязательный шаг.' }
      ]
    },
    {
      id: 3,
      title: 'Уязвимые зависимости (Vulnerable Components)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Современные приложения используют сотни зависимостей. Одна уязвимая библиотека может скомпрометировать всё приложение. Log4Shell (CVE-2021-44228) — пример: уязвимость в библиотеке логирования Log4j затронула миллионы Java приложений.' },
        { type: 'heading', value: 'Известные инциденты' },
        { type: 'list', value: [
          'Log4Shell (2021) — RCE через Log4j, затронула почти все Java приложения',
          'event-stream (2018) — вредоносный код в npm пакете для кражи Bitcoin',
          'ua-parser-js (2021) — компрометация популярного npm пакета (7M downloads/week)',
          'colors.js (2022) — автор намеренно сломал свой пакет (протест)',
          'Polyfill.io (2024) — компрометация CDN, вредоносный JavaScript у миллионов сайтов'
        ]},
        { type: 'code', language: 'bash', value: '# === Проверка уязвимостей в зависимостях ===\n\n# npm (JavaScript)\nnpm audit\nnpm audit --production  # Только production зависимости\nnpm audit fix           # Автоматическое исправление\n\n# pip (Python)\npip install pip-audit\npip-audit\n# или safety (pip install safety)\nsafety check\n\n# Go\ngovulncheck ./...\n\n# Docker образы\ndocker scout cves myimage:latest\n# или trivy\ntrivy image myimage:latest\n\n# Универсальный: Trivy (файловая система, образы, репозитории)\ntrivy fs .\ntrivy repo https://github.com/user/project\n\n# Пример вывода npm audit:\n# ┌───────────────┬──────────────────────────────┐\n# │ High          │ Prototype Pollution          │\n# ├───────────────┼──────────────────────────────┤\n# │ Package       │ lodash                       │\n# │ Patched in    │ >=4.17.21                    │\n# │ Dependency of │ my-app                       │\n# │ Path          │ my-app > lodash              │\n# └───────────────┴──────────────────────────────┘' },
        { type: 'warning', value: 'Уязвимые зависимости — #6 в OWASP Top 10. Регулярно обновляйте зависимости и настройте автоматическое сканирование в CI/CD. Dependabot (GitHub) и Renovate автоматически создают PR для обновления уязвимых пакетов.' }
      ]
    },
    {
      id: 4,
      title: 'Software Composition Analysis (SCA)',
      type: 'theory',
      content: [
        { type: 'text', value: 'SCA — автоматический анализ зависимостей проекта на наличие уязвимостей, лицензионных проблем и устаревших компонентов. Инструменты: Snyk, Dependabot, Renovate, Trivy, OWASP Dependency-Check.' },
        { type: 'code', language: 'yaml', value: '# === GitHub Dependabot ===\n# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: "npm"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n    open-pull-requests-limit: 10\n    reviewers:\n      - "security-team"\n    labels:\n      - "dependencies"\n      - "security"\n\n  - package-ecosystem: "pip"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n\n  - package-ecosystem: "docker"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n\n---\n# === GitHub Actions: Security Scan ===\n# .github/workflows/security.yml\nname: Security Scan\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n  schedule:\n    - cron: "0 6 * * 1"  # Каждый понедельник\n\njobs:\n  dependency-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Run Trivy vulnerability scanner\n        uses: aquasecurity/trivy-action@master\n        with:\n          scan-type: fs\n          scan-ref: .\n          severity: "CRITICAL,HIGH"\n          exit-code: 1  # Fail если найдены критичные' },
        { type: 'heading', value: 'Лучшие практики управления зависимостями' },
        { type: 'list', value: [
          'Lock файлы: используйте package-lock.json, poetry.lock, go.sum',
          'Минимизируйте зависимости: каждая зависимость — потенциальный риск',
          'Регулярные обновления: еженедельный audit + автоматический Dependabot',
          'Проверяйте новые зависимости: количество загрузок, активность, авторы',
          'SBOM (Software Bill of Materials): знайте полный список компонентов',
          'Vendoring: для критичных приложений копируйте зависимости в репозиторий'
        ]},
        { type: 'tip', value: 'Используйте Socket.dev для анализа npm пакетов перед установкой — он обнаруживает подозрительное поведение (сетевые запросы, доступ к fs, eval). Одна скомпрометированная зависимость может полностью скомпрометировать ваш проект.' }
      ]
    },
    {
      id: 5,
      title: 'Supply Chain Security',
      type: 'theory',
      content: [
        { type: 'text', value: 'Supply Chain Attack — атака через цепочку поставок ПО: компрометация зависимостей, CI/CD пайплайнов, инструментов сборки. Это одна из наиболее быстро растущих угроз — атакующий компрометирует один компонент и получает доступ ко всем его потребителям.' },
        { type: 'heading', value: 'Типы supply chain атак' },
        { type: 'list', value: [
          'Typosquatting — пакеты с похожими именами (lodas вместо lodash)',
          'Dependency Confusion — подмена внутренних пакетов публичными',
          'Compromised Maintainer — компрометация аккаунта автора пакета',
          'Malicious Updates — добавление вредоносного кода в обновление',
          'Build System Attacks — компрометация CI/CD (SolarWinds)',
          'CDN Poisoning — подмена кода на CDN (Polyfill.io)'
        ]},
        { type: 'code', language: 'bash', value: '# === Защита от supply chain атак ===\n\n# 1. Проверка целостности пакетов\nnpm install --ignore-scripts  # Не запускать postinstall скрипты\nnpm config set ignore-scripts true  # Глобально\n\n# 2. Pinning версий (не использовать ^, ~)\n# package.json:\n# "lodash": "4.17.21"  (точная версия, не "^4.17.21")\n\n# 3. Проверка подписей\nnpm audit signatures\n\n# 4. Использование private registry\n# .npmrc\n# registry=https://your-private-registry.com\n# @your-org:registry=https://your-private-registry.com\n\n# 5. SLSA (Supply-chain Levels for Software Artifacts)\n# Проверка провенанса сборки\n# https://slsa.dev/\n\n# 6. Sigstore/Cosign для подписи артефактов\n# cosign sign --key cosign.key myimage:latest\n# cosign verify --key cosign.pub myimage:latest\n\n# 7. Scoped packages для организации\n# @your-org/utils вместо utils (защита от dependency confusion)\n\n# 8. Socket.dev — анализ npm пакетов\nnpx socket optimize  # Анализ зависимостей' },
        { type: 'warning', value: 'SolarWinds (2020) — одна из крупнейших supply chain атак: вредоносный код в обновлении ПО мониторинга затронул 18,000 организаций, включая правительство США. Каждый компонент в вашей цепочке поставок — потенциальный вектор атаки.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Аудит зависимостей проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите полный аудит зависимостей проекта: найдите уязвимости, настройте автоматическое сканирование и создайте SBOM.',
      requirements: [
        'Запустите npm audit / pip-audit для проекта и проанализируйте результаты',
        'Настройте Dependabot для автоматических обновлений',
        'Создайте GitHub Actions workflow для сканирования безопасности',
        'Сгенерируйте SBOM (Software Bill of Materials)',
        'Исправьте все критические и высокие уязвимости'
      ],
      hint: 'npm audit --json выводит результат в JSON. Используйте trivy для сканирования, syft для SBOM. Dependabot настраивается в .github/dependabot.yml.',
      expectedOutput: 'npm audit: найдено 3 уязвимости (1 critical, 2 high)\nCritical: lodash < 4.17.21 (Prototype Pollution)\nHigh: jsonwebtoken < 9.0.0 (Algorithm Confusion)\nHigh: express < 4.19.2 (Open Redirect)\n\nИсправлено: npm audit fix, все уязвимости устранены\nDependabot: настроен, еженедельная проверка\nCI/CD: trivy сканирование на каждый PR\nSBOM: сгенерирован в CycloneDX формате',
      solution: '#!/bin/bash\n# Полный аудит зависимостей\n\necho "=== 1. Сканирование уязвимостей ==="\nnpm audit --json > audit-report.json\nnpm audit 2>&1 | head -50\n\necho ""\necho "=== 2. Исправление уязвимостей ==="\nnpm audit fix\n\necho ""\necho "=== 3. Сканирование с Trivy ==="\ntrivy fs --severity HIGH,CRITICAL .\n\necho ""\necho "=== 4. Генерация SBOM ==="\n# syft — генератор SBOM\nnpx @cyclonedx/cyclonedx-npm --output-file sbom.json\necho "SBOM сохранён в sbom.json"\n\necho ""\necho "=== 5. Настройка Dependabot ==="\nmkdir -p .github\ncat << \'EOF\' > .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: "npm"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n    open-pull-requests-limit: 10\nEOF\necho "Dependabot настроен"\n\necho ""\necho "=== 6. CI/CD Security Workflow ==="\nmkdir -p .github/workflows\ncat << \'WORKFLOW\' > .github/workflows/security-scan.yml\nname: Security Scan\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: npm audit\n        run: npm audit --audit-level=high\n      - name: Trivy scan\n        uses: aquasecurity/trivy-action@master\n        with:\n          scan-type: fs\n          severity: CRITICAL,HIGH\n          exit-code: 1\nWORKFLOW\necho "CI/CD workflow создан"\n\necho ""\necho "=== Аудит завершён ==="',
      explanation: 'Аудит зависимостей — критичная практика безопасности. Автоматизация через Dependabot + CI/CD сканирование гарантирует, что уязвимые зависимости обнаруживаются и исправляются своевременно. SBOM предоставляет полный список компонентов для управления рисками и compliance.'
    }
  ]
}
