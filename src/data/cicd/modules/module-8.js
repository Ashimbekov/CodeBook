export default {
  id: 8,
  title: 'Тестирование в CI',
  description: 'Интеграция pytest, coverage, базы данных в CI, параллельные тесты, отчёты о покрытии.',
  lessons: [
    {
      id: 1,
      title: 'Запуск тестов в CI: базовая настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Запуск тестов в CI немного отличается от локального: нужно обеспечить изоляцию, правильные переменные окружения и генерацию отчётов.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions: тесты Django\njobs:\n  test:\n    runs-on: ubuntu-latest\n    env:\n      DJANGO_SETTINGS_MODULE: config.settings.testing\n      SECRET_KEY: test-secret-key-not-real\n      DATABASE_URL: sqlite:///test.db\n\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n          cache: "pip"\n      - run: pip install -r requirements/testing.txt\n      - name: Запуск тестов\n        run: |\n          python manage.py migrate --run-syncdb\n          pytest --tb=short --strict-markers \\\n            --junitxml=test-results.xml \\\n            --cov=. --cov-report=xml --cov-report=term\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: test-results\n          path: "*.xml"' },
        { type: 'tip', value: '--strict-markers — падать при неизвестных pytest markers. --tb=short — краткий traceback в логах (полный --tb=long). Эти флаги делают вывод CI более читаемым.' }
      ]
    },
    {
      id: 2,
      title: 'База данных в CI: PostgreSQL service',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для интеграционных тестов нужна настоящая БД. Используй services чтобы запустить PostgreSQL рядом с тестами.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:15-alpine\n        env:\n          POSTGRES_USER: testuser\n          POSTGRES_PASSWORD: testpass\n          POSTGRES_DB: testdb\n        ports:\n          - 5432:5432\n        options: >\n          --health-cmd pg_isready\n          --health-interval 10s\n          --health-timeout 5s\n          --health-retries 5\n\n    env:\n      DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb\n\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n          cache: "pip"\n      - run: pip install -r requirements.txt\n      - run: python manage.py migrate\n      - run: pytest' },
        { type: 'note', value: 'health-cmd pg_isready заставляет GitHub Actions ждать пока PostgreSQL готова принимать соединения. Без него тесты могут начаться до готовности БД.' }
      ]
    },
    {
      id: 3,
      title: 'Coverage: отчёты о покрытии кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Coverage показывает какой процент кода покрыт тестами. В CI важно отслеживать покрытие и требовать минимальный уровень.' },
        { type: 'code', language: 'yaml', value: '# pytest.ini или setup.cfg\n[tool:pytest]\naddopts = --cov=src --cov-report=term-missing --cov-fail-under=80\n\n# GitHub Actions с отчётом покрытия\nsteps:\n  - name: Тесты с покрытием\n    run: pytest --cov=. --cov-report=xml --cov-report=html\n\n  # Загрузить в Codecov\n  - name: Загрузить отчёт в Codecov\n    uses: codecov/codecov-action@v4\n    with:\n      token: ${{ secrets.CODECOV_TOKEN }}\n      files: coverage.xml\n      fail_ci_if_error: true\n\n  # Или добавить комментарий к PR\n  - name: Coverage комментарий в PR\n    uses: py-cov-action/python-coverage-comment-action@v3\n    with:\n      GITHUB_TOKEN: ${{ github.token }}' },
        { type: 'tip', value: '--cov-fail-under=80 — упасть если покрытие ниже 80%. Это предотвращает деградацию: разработчик не сможет смержить код без достаточного покрытия тестами.' }
      ]
    },
    {
      id: 4,
      title: 'Параллельные тесты',
      type: 'theory',
      content: [
        { type: 'text', value: 'При большом количестве тестов время выполнения растёт. pytest-xdist запускает тесты параллельно на нескольких CPU.' },
        { type: 'code', language: 'yaml', value: '# pip install pytest-xdist\n\n# Параллельный запуск на 4 процессах\npytest -n 4\n\n# Автоматически по количеству CPU\npytest -n auto\n\n# В CI: параллелизм через matrix\njobs:\n  test:\n    strategy:\n      matrix:\n        shard: [1, 2, 3, 4]  # разбить тесты на 4 части\n    runs-on: ubuntu-latest\n    steps:\n      - run: |\n          # Запустить только 1/4 тестов\n          pytest --shard-id=${{ matrix.shard }} --num-shards=4\n\n# GitLab CI parallel\ntest:\n  parallel: 4\n  script:\n    - pytest --shard-id=$CI_NODE_INDEX --num-shards=$CI_NODE_TOTAL' },
        { type: 'tip', value: 'Для shard тестирования нужен пакет pytest-shard: pip install pytest-shard. Он автоматически распределяет тесты по shards без необходимости ручной разбивки по директориям.' },
        { type: 'list', items: [
          'pytest-xdist (-n 4) — параллельный запуск в рамках одного runner (несколько процессов)',
          'Matrix sharding — несколько отдельных jobs (VM) запускают разные подмножества тестов',
          'GitLab parallel: N — аналог matrix sharding, CI_NODE_INDEX и CI_NODE_TOTAL доступны автоматически',
          'Изолированные тесты работают лучше при параллельном запуске — избегай разделяемого состояния'
        ]},
        { type: 'note', value: 'pytest-xdist и matrix sharding решают разные проблемы. xdist — использует несколько CPU одной машины. Matrix sharding — использует несколько отдельных машин (runner). Matrix sharding масштабируется лучше для очень больших тест-сьютов.' }
      ]
    },
    {
      id: 5,
      title: 'Публикация результатов тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Результаты тестов можно отображать прямо в интерфейсе GitHub/GitLab для быстрого анализа провалов.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions: publish test results\nsteps:\n  - run: pytest --junitxml=test-results.xml\n\n  - name: Публикация результатов\n    uses: dorny/test-reporter@v1\n    if: always()\n    with:\n      name: "Test Results"\n      path: "test-results.xml"\n      reporter: java-junit\n\n# GitLab CI: JUnit artifacts (встроено)\ntest:\n  script:\n    - pytest --junitxml=junit.xml\n  artifacts:\n    reports:\n      junit: junit.xml  # GitLab автоматически парсит и показывает' },
        { type: 'note', value: 'В GitLab results появляются прямо в merge request: видно какие тесты упали без открытия логов. GitHub Actions показывает в разделе "Tests" workflow.' }
      ]
    },
    {
      id: 6,
      title: 'Smoke tests и healthcheck после деплоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'После деплоя важно проверить что приложение работает. Smoke tests — минимальный набор проверок живости.' },
        { type: 'code', language: 'yaml', value: 'deploy:\n  runs-on: ubuntu-latest\n  steps:\n    - name: Деплой\n      run: bash deploy.sh\n\n    - name: Ждём запуска\n      run: sleep 30\n\n    - name: Smoke tests\n      run: |\n        # Проверяем что API отвечает\n        curl -f https://api.example.com/health/ || exit 1\n        # Проверяем статусы\n        STATUS=$(curl -s https://api.example.com/health/ | python -c "import sys,json; print(json.load(sys.stdin)[\"status\"])")\n        [ "$STATUS" = "ok" ] || exit 1\n\n    - name: Уведомление при успехе\n      if: success()\n      run: echo "Деплой успешен!"' },
        { type: 'tip', value: 'Используй retry вместо фиксированного sleep для ожидания запуска приложения. Цикл с проверкой каждые 5 секунд и максимум 60 секунд надёжнее чем sleep 30 — приложение может запуститься быстрее или медленнее.' },
        { type: 'list', items: [
          'Healthcheck endpoint (/health/ или /ready/) должен проверять реальное состояние приложения',
          'Хороший healthcheck проверяет: соединение с БД, доступность внешних сервисов',
          'curl -f завершает команду с ненулевым кодом при HTTP ошибке (4xx, 5xx)',
          'Smoke tests запускают минимальный набор критических сценариев (логин, главная страница)',
          'При падении smoke tests — автоматически откатываться к предыдущей версии'
        ]},
        { type: 'note', value: 'Healthcheck и smoke tests — разные вещи. Healthcheck — простая проверка что сервер отвечает. Smoke tests — базовые бизнес-сценарии (создание пользователя, отправка заказа). Оба нужны после деплоя.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: CI с PostgreSQL и coverage',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай GitHub Actions workflow для Django тестов с PostgreSQL и отчётом покрытия.',
      requirements: [
        'PostgreSQL service с healthcheck',
        'Тесты запускаются с DATABASE_URL указывающим на service',
        'Coverage минимум 75% (--cov-fail-under=75)',
        'JUnit XML загружается как артефакт',
        'Coverage XML загружается в Codecov (с токеном из secrets)',
        'Тест job помечает PR как failed если покрытие упало ниже 75%'
      ],
      expectedOutput: 'PR с покрытием 80% -> тесты зелёные\nPR с покрытием 70% -> тесты красные "Coverage 70% is less than minimum 75%"',
      hint: 'options: --health-cmd "pg_isready" для PostgreSQL. --cov-fail-under=75 в pytest команде или в setup.cfg.',
      solution: '# .github/workflows/test.yml\nname: Tests\n\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:15-alpine\n        env:\n          POSTGRES_USER: testuser\n          POSTGRES_PASSWORD: testpass\n          POSTGRES_DB: testdb\n        ports:\n          - 5432:5432\n        options: --health-cmd pg_isready --health-interval 10s --health-retries 5\n\n    env:\n      DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb\n      DJANGO_SETTINGS_MODULE: config.settings.testing\n      SECRET_KEY: test-secret-key\n\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n          cache: "pip"\n      - run: pip install -r requirements.txt pytest-cov\n      - run: python manage.py migrate\n      - run: pytest --junitxml=junit.xml --cov=. --cov-report=xml --cov-fail-under=75\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: test-results\n          path: "*.xml"\n      - uses: codecov/codecov-action@v4\n        if: always()\n        with:\n          token: ${{ secrets.CODECOV_TOKEN }}\n          files: coverage.xml',
      explanation: '--health-retries 5 — ждать до 5 попыток. options через --health-* флаги Docker. --cov-fail-under=75 делает pytest exit code ненулевым при недостаточном покрытии — GitHub Actions считает job упавшим.'
    }
  ]
}
