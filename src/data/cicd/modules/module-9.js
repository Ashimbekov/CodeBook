export default {
  id: 9,
  title: 'Линтинг и качество кода',
  description: 'flake8, black, isort, mypy, pre-commit — автоматическая проверка качества кода в CI.',
  lessons: [
    {
      id: 1,
      title: 'Линтеры Python в CI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Линтеры автоматически проверяют код на ошибки и несоответствие стандартам. В CI они блокируют некачественный код до попадания в main ветку.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions: полная проверка кода\njobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n          cache: "pip"\n\n      - run: pip install flake8 black isort mypy\n\n      # flake8 — проверка стиля и ошибок\n      - name: flake8\n        run: flake8 . --max-line-length=120 --exclude=migrations\n\n      # black — форматирование (--check не меняет файлы)\n      - name: black\n        run: black . --check --diff\n\n      # isort — порядок импортов\n      - name: isort\n        run: isort . --check-only --diff\n\n      # mypy — статическая типизация\n      - name: mypy\n        run: mypy src/ --ignore-missing-imports' },
        { type: 'tip', value: 'black --check возвращает ненулевой exit code если файлы не отформатированы. --diff показывает что нужно изменить. Это останавливает CI без реальных изменений файлов.' }
      ]
    },
    {
      id: 2,
      title: 'pre-commit — локальные хуки',
      type: 'theory',
      content: [
        { type: 'text', value: 'pre-commit запускает линтеры автоматически перед каждым коммитом. Ловит проблемы ещё до отправки в CI.' },
        { type: 'code', language: 'yaml', value: '# .pre-commit-config.yaml\nrepos:\n  - repo: https://github.com/psf/black\n    rev: 24.1.0\n    hooks:\n      - id: black\n        language_version: python3.12\n\n  - repo: https://github.com/pycqa/flake8\n    rev: 7.0.0\n    hooks:\n      - id: flake8\n        args: [--max-line-length=120]\n\n  - repo: https://github.com/pycqa/isort\n    rev: 5.13.2\n    hooks:\n      - id: isort\n\n  - repo: https://github.com/pre-commit/pre-commit-hooks\n    rev: v4.5.0\n    hooks:\n      - id: trailing-whitespace\n      - id: end-of-file-fixer\n      - id: check-yaml\n      - id: check-added-large-files\n      - id: no-commit-to-branch\n        args: [--branch, main]' },
        { type: 'code', language: 'bash', value: '# Установка pre-commit\npip install pre-commit\npre-commit install          # установить хуки в .git/hooks/\npre-commit run --all-files  # запустить на всех файлах' }
      ]
    },
    {
      id: 3,
      title: 'pre-commit в CI как проверка',
      type: 'theory',
      content: [
        { type: 'text', value: 'pre-commit можно запускать в CI чтобы убедиться, что все разработчики его используют правильно.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions\njobs:\n  pre-commit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n\n      # Кеш pre-commit окружений\n      - uses: actions/cache@v4\n        with:\n          path: ~/.cache/pre-commit\n          key: pre-commit-${{ hashFiles(".pre-commit-config.yaml") }}\n\n      - run: pip install pre-commit\n      - run: pre-commit run --all-files --show-diff-on-failure\n\n# Или готовое действие\n      - uses: pre-commit/action@v3.0.1' },
        { type: 'note', value: 'pre-commit run --all-files в CI гарантирует, что весь код в репозитории соответствует стандартам, даже если разработчик забыл установить pre-commit локально.' }
      ]
    },
    {
      id: 4,
      title: 'bandit — проверка безопасности кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'bandit находит типичные уязвимости безопасности в Python коде: SQL инъекции, захардкоженные пароли, небезопасные хеши.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install bandit safety\n\n      # bandit — SAST (Static Application Security Testing)\n      - name: bandit\n        run: bandit -r src/ -f json -o bandit-report.json\n        continue-on-error: true  # не блокировать CI\n\n      - uses: actions/upload-artifact@v4\n        with:\n          name: bandit-report\n          path: bandit-report.json\n\n      # safety — проверка уязвимых зависимостей\n      - name: safety\n        run: safety check -r requirements.txt\n\n      # Встроенная проверка GitLab\n      # include: - template: "Security/SAST.gitlab-ci.yml"' },
        { type: 'heading', value: 'Что находит bandit' },
        { type: 'list', items: [
          'B105, B106 — захардкоженные пароли в коде (password = "secret123")',
          'B201, B501 — использование небезопасных хешей (MD5, SHA1)',
          'B608 — возможные SQL инъекции при конкатенации строк',
          'B301 — использование pickle.loads с непроверенными данными',
          'B101 — использование assert в production коде (отключается с -O)',
          'B311 — использование random вместо secrets для криптографии'
        ]},
        { type: 'tip', value: 'bandit -ll проверяет только medium и high severity — хорошая точка старта. -r src/ рекурсивно проверяет директорию. Добавь # nosec в строку кода чтобы подавить конкретное предупреждение если оно ложноположительное.' }
      ]
    },
    {
      id: 5,
      title: 'Качество кода: SonarQube / SonarCloud',
      type: 'theory',
      content: [
        { type: 'text', value: 'SonarCloud — облачный инструмент для анализа качества кода: смотрит дублирование, complexity, security hotspots, coverage.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions с SonarCloud\njobs:\n  sonarcloud:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0  # полная история для blame\n\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n      - run: pip install pytest pytest-cov\n      - run: pytest --cov=. --cov-report=xml\n\n      - uses: SonarSource/sonarcloud-github-action@v2\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}\n\n# sonar-project.properties\n# sonar.projectKey=myorg_myproject\n# sonar.sources=src\n# sonar.python.coverage.reportPaths=coverage.xml' },
        { type: 'tip', value: 'Quality Gates в SonarCloud — автоматически блокируют PR если новый код не соответствует требованиям по покрытию, дублированию или уязвимостям.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Полный lint pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай lint job с flake8, black, isort, mypy и bandit.',
      requirements: [
        'Один job lint с несколькими steps',
        'flake8 с конфигурацией в setup.cfg (max-line-length=120, exclude=migrations)',
        'black --check (не форматировать, только проверять)',
        'isort --check-only',
        'mypy для проверки типов',
        'Кеш pip зависимостей',
        'Каждый step с понятным name:'
      ],
      expectedOutput: 'Код с неотформатированными строками -> black step fails\nКод с правильным форматированием -> все steps green',
      hint: 'Создай setup.cfg с [flake8] секцией. Все инструменты устанавливай в одном pip install.',
      solution: '# .github/workflows/lint.yml\nname: Code Quality\n\non: [push, pull_request]\n\njobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n          cache: "pip"\n\n      - name: Установка инструментов\n        run: pip install flake8 black isort mypy bandit\n\n      - name: flake8 — проверка стиля\n        run: flake8 . --max-line-length=120 --exclude=migrations,venv\n\n      - name: black — форматирование\n        run: black . --check --diff --line-length=120\n\n      - name: isort — порядок импортов\n        run: isort . --check-only --diff --profile=black\n\n      - name: mypy — типизация\n        run: mypy src/ --ignore-missing-imports --strict\n        continue-on-error: true\n\n      - name: bandit — безопасность\n        run: bandit -r src/ -ll  # только medium и high severity',
      explanation: '--profile=black заставляет isort работать совместимо с black — они могут конфликтовать по форматированию импортов. -ll в bandit — только low и выше severity. continue-on-error: true для mypy — не блокировать при постепенном добавлении типов.'
    }
  ]
}
