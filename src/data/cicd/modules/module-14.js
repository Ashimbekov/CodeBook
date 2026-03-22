export default {
  id: 14,
  title: 'Best Practices',
  description: 'Идемпотентность, принцип fail-fast, безопасность в CI/CD, версионирование workflows, self-hosted runners.',
  lessons: [
    {
      id: 1,
      title: 'Принцип идемпотентности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Идемпотентность — деплой можно запустить несколько раз и результат будет одинаковым. Повторный деплой не ломает систему.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# ПЛОХО: не идемпотентно\necho "начало деплоя" >> deploy.log  # каждый раз добавляет строку\ndocker run myapp  # запустит второй контейнер если первый уже есть\n\n# ХОРОШО: идемпотентно\necho "$(date) начало деплоя" > deploy.log  # перезаписывает\ndocker-compose up -d --force-recreate  # пересоздаёт контейнеры\nkubectl apply -f deployment.yaml  # создаёт или обновляет\n\n# Миграции — идемпотентны по природе:\npython manage.py migrate  # применяет только непримененные миграции\n# Повторный запуск безопасен — "No migrations to apply"' },
        { type: 'tip', value: 'kubectl apply идемпотентен — создаёт ресурс если нет, обновляет если есть. kubectl create упадёт с ошибкой если ресурс существует. Всегда используй apply в CI.' }
      ]
    },
    {
      id: 2,
      title: 'Fail-fast и явные ошибки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пайплайн должен падать быстро и явно — чтобы разработчик сразу понял что не так.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\nset -euo pipefail\n# -e: остановить при любой ошибке\n# -u: ошибка при необъявленных переменных\n# -o pipefail: ошибка если команда в pipe упала\n\n# ПЛОХО: скрытые ошибки\npip install -r requirements.txt && pytest || true  # игнорирует ошибки!\n\n# ХОРОШО: явные ошибки\npip install -r requirements.txt\npytest\n\n# Проверка переменных\nif [ -z "${DATABASE_URL:-}" ]; then\n  echo "Ошибка: DATABASE_URL не задан" >&2\n  exit 1\nfi\n\n# Не используй || true без веской причины\n# Если что-то должно работать — пусть падает при ошибке' },
        { type: 'note', value: 'continue-on-error: true в GitHub Actions эквивалент || true — используй только когда ошибка действительно не критична (например, опциональный lint).' }
      ]
    },
    {
      id: 3,
      title: 'Безопасность в CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'CI/CD системы имеют доступ к production серверам и секретам — они являются критичными с точки зрения безопасности.' },
        { type: 'list', items: [
          'Никогда не логируй secrets — они могут попасть в логи',
          'Минимальные права — каждый job имеет только нужные permissions',
          'Закрепляй версии actions — uses: actions/checkout@v4 не @main',
          'Проверяй PR от форков — они не имеют доступа к secrets по умолчанию',
          'Сканируй зависимости на уязвимости (Dependabot, safety)',
          'Ограничивай allowed branches для environments',
          'Аудит кто имеет доступ к secrets'
        ]},
        { type: 'code', language: 'yaml', value: '# Минимальные permissions\npermissions:\n  contents: read      # только чтение кода\n  packages: write     # запись в registry\n  # НЕ: actions: write, id-token: write (если не нужно)\n\n# Закрепление версий actions\nuses: actions/checkout@v4.1.1  # конкретный тег\n# или SHA:\nuses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332' }
      ]
    },
    {
      id: 4,
      title: 'DRY: переиспользование workflows',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дублирование конфигурации CI/CD трудно поддерживать. Используй reusable workflows, composite actions и шаблоны.' },
        { type: 'code', language: 'yaml', value: '# Composite Action: .github/actions/setup-python/action.yml\nname: "Setup Python"\ndescription: "Установить Python с кешем и зависимостями"\ninputs:\n  python-version:\n    default: "3.12"\n  requirements-file:\n    default: "requirements.txt"\n\nruns:\n  using: composite\n  steps:\n    - uses: actions/setup-python@v5\n      with:\n        python-version: ${{ inputs.python-version }}\n        cache: pip\n    - shell: bash\n      run: pip install -r ${{ inputs.requirements-file }}\n\n# Использование:\nsteps:\n  - uses: ./.github/actions/setup-python\n    with:\n      python-version: "3.12"' }
      ]
    },
    {
      id: 5,
      title: 'Self-hosted runners: настройка и безопасность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Self-hosted runners нужны для: доступа к внутренней сети, особых ресурсов (GPU), экономии на minutes.' },
        { type: 'code', language: 'bash', value: '# Регистрация self-hosted runner (GitHub)\n# Settings -> Actions -> Runners -> New self-hosted runner\n# Выполнить на сервере:\n./config.sh --url https://github.com/myorg/myrepo --token TOKEN\n./run.sh  # запустить\n\n# Как systemd сервис:\n./svc.sh install\n./svc.sh start\n\n# Безопасность self-hosted runners:\n# 1. Не используй для public repos - fork PR может запустить код\n# 2. Запускай в изолированных контейнерах (ephemeral runners)\n# 3. Минимальные права на сервере\n# 4. Очищай workspace после каждого job\n# 5. Используй labels для ограничения каких jobs может брать runner' },
        { type: 'warning', value: 'Self-hosted runners с public репозиториями опасны: любой кто создаст PR может запустить произвольный код на твоём сервере. Используй только с private repos или с Require approval для fork PR.' }
      ]
    },
    {
      id: 6,
      title: 'Dependabot — автоматическое обновление зависимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dependabot автоматически создаёт PR для обновления зависимостей. Настраивается через .github/dependabot.yml.' },
        { type: 'code', language: 'yaml', value: '# .github/dependabot.yml\nversion: 2\nupdates:\n  # Python зависимости\n  - package-ecosystem: "pip"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n      day: "monday"\n    open-pull-requests-limit: 5\n    groups:\n      django:\n        patterns: ["django*", "djangorestframework*"]\n\n  # GitHub Actions\n  - package-ecosystem: "github-actions"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n    labels:\n      - "ci/cd"\n      - "dependencies"\n\n  # Docker базовые образы\n  - package-ecosystem: "docker"\n    directory: "/"\n    schedule:\n      interval: "monthly"' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Секьюрный и оптимальный workflow',
      type: 'practice',
      difficulty: 'hard',
      description: 'Примени все best practices к существующему workflow: безопасность, DRY, fail-fast.',
      requirements: [
        'Добавить explicit permissions: contents: read, packages: write',
        'Закрепить версии всех actions через SHA хеши',
        'Создать composite action для общей Python настройки',
        'Добавить set -euo pipefail ко всем bash скриптам',
        'Настроить dependabot.yml для pip и github-actions',
        'Добавить concurrency для отмены устаревших runs'
      ],
      expectedOutput: 'Безопасный workflow без избыточных прав\nComposite action переиспользуется в test и lint jobs\nDependabot создаёт PR еженедельно',
      hint: 'SHA для actions находи на странице releases: github.com/actions/checkout/releases. Composite action в .github/actions/setup-python/action.yml.',
      solution: '# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: "pip"\n    directory: "/"\n    schedule: {interval: "weekly"}\n  - package-ecosystem: "github-actions"\n    directory: "/"\n    schedule: {interval: "weekly"}\n\n# .github/actions/python-setup/action.yml\nname: Python Setup\nruns:\n  using: composite\n  steps:\n    - uses: actions/setup-python@v5\n      with: {python-version: "3.12", cache: pip}\n    - run: pip install -r requirements.txt\n      shell: bash\n\n# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n\nconcurrency:\n  group: ${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true\n\npermissions:\n  contents: read\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: ./.github/actions/python-setup\n      - run: |\n          set -euo pipefail\n          pytest --tb=short\n\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: ./.github/actions/python-setup\n      - run: |\n          set -euo pipefail\n          flake8 . && black . --check',
      explanation: 'Composite action переиспользует настройку Python без дублирования. concurrency отменяет старые runs при новом коммите. permissions: contents: read — минимально необходимые права для CI. set -euo pipefail — fail fast на уровне shell.'
    }
  ]
}
