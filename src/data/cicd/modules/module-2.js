export default {
  id: 2,
  title: 'GitHub Actions: основы',
  description: 'Workflow, jobs, steps, runners — создаём первый GitHub Actions пайплайн.',
  lessons: [
    {
      id: 1,
      title: 'Структура GitHub Actions workflow',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Actions — CI/CD платформа, встроенная в GitHub. Workflows описываются в YAML файлах в директории .github/workflows/.' },
        { type: 'code', language: 'yaml', value: '# .github/workflows/ci.yml\nname: CI Pipeline           # название workflow\n\non:                         # триггеры\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:                       # одна или несколько работ\n  test:                     # имя job\n    runs-on: ubuntu-latest  # тип runner\n    steps:                  # последовательные шаги\n      - name: Checkout code\n        uses: actions/checkout@v4\n\n      - name: Setup Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n\n      - name: Install dependencies\n        run: pip install -r requirements.txt\n\n      - name: Run tests\n        run: pytest' },
        { type: 'tip', value: 'Файл workflow создаётся в .github/workflows/ — GitHub автоматически его обнаруживает. Можно создать прямо в UI GitHub через раздел Actions.' }
      ]
    },
    {
      id: 2,
      title: 'Runners — где выполняется workflow',
      type: 'theory',
      content: [
        { type: 'text', value: 'Runner — виртуальная машина, где выполняются jobs. GitHub предоставляет бесплатные hosted runners. Можно также настроить self-hosted runner на своём сервере.' },
        { type: 'code', language: 'yaml', value: '# GitHub hosted runners\nruns-on: ubuntu-latest    # Ubuntu (бесплатно для public repos)\nruns-on: ubuntu-22.04     # конкретная версия\nruns-on: windows-latest   # Windows\nruns-on: macos-latest     # macOS\n\n# Self-hosted runner\nruns-on: self-hosted\nruns-on: [self-hosted, linux, x64]  # с метками\n\n# Матрица runners\nstrategy:\n  matrix:\n    os: [ubuntu-latest, windows-latest, macos-latest]\nruns-on: ${{ matrix.os }}' },
        { type: 'note', value: 'GitHub предоставляет 2000 минут в месяц бесплатно для private repos. Ubuntu runner — дешевле Windows и macOS (1x, 2x, 10x стоимость соответственно).' }
      ]
    },
    {
      id: 3,
      title: 'Steps: run и uses',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый step — либо shell команда (run) либо готовое действие (uses). Actions — переиспользуемые блоки из GitHub Marketplace.' },
        { type: 'code', language: 'yaml', value: 'steps:\n  # Shell команда\n  - name: Установка зависимостей\n    run: pip install -r requirements.txt\n\n  # Многострочная команда\n  - name: Сборка и тест\n    run: |\n      python manage.py migrate\n      python manage.py test\n\n  # Использование action из Marketplace\n  - uses: actions/checkout@v4          # клонирует код\n  - uses: actions/setup-python@v5      # устанавливает Python\n    with:\n      python-version: "3.12"\n\n  # Action из другого репозитория\n  - uses: docker/build-push-action@v6  # сборка Docker образа\n    with:\n      push: true\n      tags: myapp:latest' },
        { type: 'tip', value: 'Каждый step выполняется последовательно в рамках одного job. Если step завершается с ненулевым кодом выхода, job считается упавшим и последующие steps не выполняются.' },
        { type: 'heading', value: 'Параметры step' },
        { type: 'list', items: [
          'name — отображаемое имя step в интерфейсе GitHub Actions',
          'run — shell команда (bash по умолчанию на Linux)',
          'uses — имя action из Marketplace в формате owner/action@version',
          'with — параметры для action',
          'env — переменные окружения только для этого step',
          'if — условие выполнения step',
          'continue-on-error — продолжить job даже если step упал',
          'timeout-minutes — максимальное время выполнения step'
        ]},
        { type: 'note', value: 'Популярные actions в Marketplace: actions/checkout (клонирование кода), actions/setup-python, actions/setup-node, actions/cache (кеширование), actions/upload-artifact. Всегда фиксируй версию action через тег: @v4, а не @main.' }
      ]
    },
    {
      id: 4,
      title: 'Переменные окружения и контекст',
      type: 'theory',
      content: [
        { type: 'text', value: 'В workflow доступны переменные окружения и контекст GitHub (имя ветки, SHA коммита, репозиторий и т.д.).' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  build:\n    runs-on: ubuntu-latest\n    env:\n      APP_ENV: production  # переменная для всего job\n\n    steps:\n      - name: Показать контекст\n        env:\n          BRANCH: ${{ github.ref_name }}   # имя ветки\n          SHA: ${{ github.sha }}           # SHA коммита\n          REPO: ${{ github.repository }}   # owner/repo\n        run: |\n          echo "Ветка: $BRANCH"\n          echo "Коммит: $SHA"\n          echo "Репозиторий: $REPO"\n          echo "Окружение: $APP_ENV"\n\n      - name: Тег для Docker образа\n        run: |\n          TAG=${{ github.ref_name }}-${{ github.run_number }}\n          echo "Тег образа: $TAG"' },
        { type: 'heading', value: 'Часто используемые переменные контекста' },
        { type: 'list', items: [
          'github.ref_name — имя ветки или тега (main, feature/auth)',
          'github.sha — полный SHA коммита (40 символов)',
          'github.repository — owner/repo (myorg/myapp)',
          'github.actor — имя пользователя запустившего workflow',
          'github.run_number — порядковый номер запуска (1, 2, 3...)',
          'github.event_name — тип события (push, pull_request, schedule)',
          'runner.os — операционная система runner (Linux, Windows, macOS)'
        ]},
        { type: 'note', value: 'Переменные контекста (${{ github.* }}) раскрываются перед выполнением команды — они не являются переменными окружения shell. Для использования в скриптах передавай их через env: блок.' }
      ]
    },
    {
      id: 5,
      title: 'Несколько jobs и зависимости',
      type: 'theory',
      content: [
        { type: 'text', value: 'В workflow может быть несколько jobs. По умолчанию они выполняются параллельно. needs: создаёт зависимости.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pytest\n\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: flake8 .\n\n  build:\n    runs-on: ubuntu-latest\n    needs: [test, lint]   # ждёт test И lint\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t myapp .\n\n  deploy:\n    runs-on: ubuntu-latest\n    needs: build          # ждёт только build\n    if: github.ref == "refs/heads/main"  # только для main\n    steps:\n      - run: echo "Деплой..."' },
        { type: 'tip', value: 'test и lint запустятся параллельно (нет зависимостей). build ждёт оба. deploy ждёт build. Это оптимальная параллелизация.' }
      ]
    },
    {
      id: 6,
      title: 'Условия if и статусы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Условие if позволяет запускать steps и jobs только при определённых условиях: ветка, статус предыдущего step, тип события.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Деплой на prod\n        if: github.ref == "refs/heads/main"\n        run: ./deploy.sh production\n\n      - name: Деплой на staging\n        if: github.ref == "refs/heads/develop"\n        run: ./deploy.sh staging\n\n      # Выполнить даже если предыдущие steps упали\n      - name: Уведомление об ошибке\n        if: failure()\n        run: echo "Что-то пошло не так!"\n\n      # Выполнить всегда\n      - name: Очистка\n        if: always()\n        run: docker system prune -f\n\n      # Только при успехе (по умолчанию)\n      - name: Уведомление об успехе\n        if: success()\n        run: echo "Успешно!"' },
        { type: 'heading', value: 'Функции статуса' },
        { type: 'list', items: [
          'success() — step выполняется только если все предыдущие steps прошли (поведение по умолчанию)',
          'failure() — step выполняется если хотя бы один предыдущий step упал',
          'always() — step выполняется всегда, независимо от статусов других steps',
          'cancelled() — step выполняется если workflow был отменён'
        ]},
        { type: 'tip', value: 'Комбинируй функции статуса с другими условиями: if: failure() && github.ref == "refs/heads/main" — уведомление об ошибке только для main ветки. Это сокращает шум оповещений.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Первый workflow для Python проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай GitHub Actions workflow для Python проекта с тестами и линтингом.',
      requirements: [
        'Триггер: push и pull_request на main',
        'Job test: Python 3.12, установка зависимостей из requirements.txt, запуск pytest',
        'Job lint: flake8 для проверки стиля кода',
        'Оба jobs выполняются параллельно',
        'Файл: .github/workflows/ci.yml'
      ],
      expectedOutput: 'git push origin main\n-> [test] и [lint] запускаются параллельно\n-> Статусы видны в разделе Actions на GitHub',
      hint: 'Каждый job начинается с actions/checkout@v4 для получения кода. Python устанавливается через actions/setup-python@v5.',
      solution: '# .github/workflows/ci.yml\nname: Python CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - name: Установка зависимостей\n        run: pip install -r requirements.txt\n      - name: Запуск тестов\n        run: pytest --tb=short\n\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - name: Установка flake8\n        run: pip install flake8\n      - name: Проверка стиля\n        run: flake8 . --max-line-length=120',
      explanation: 'Два отдельных job — test и lint — выполняются параллельно и независимо. Если lint упадёт, test продолжит выполнение. Каждый job получает свою чистую VM, поэтому нужен свой checkout.'
    },
    {
      id: 8,
      title: 'Практика: Workflow с деплоем на staging',
      type: 'practice',
      difficulty: 'medium',
      description: 'Расширь workflow: добавь job deploy после успешных тестов.',
      requirements: [
        'Jobs: test, lint (параллельно) -> build -> deploy',
        'build выполняется только после test И lint',
        'deploy только для ветки main (if условие)',
        'deploy логирует: "Deploying to staging: <branch>-<run_number>"',
        'Уведомление при ошибке любого job (step с if: failure())'
      ],
      expectedOutput: 'PR в main: test + lint (параллельно)\nПуш в main: test + lint -> build -> deploy\nОшибка в любом job: "Пайплайн завершился с ошибкой"',
      hint: 'needs: [test, lint] ждёт оба. if: github.ref == "refs/heads/main" для deploy. github.run_number — номер запуска.',
      solution: '# .github/workflows/ci.yml\nname: CI/CD\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n      - run: pip install -r requirements.txt\n      - run: pytest\n\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install flake8 && flake8 .\n\n  build:\n    needs: [test, lint]\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Сборка\n        run: echo "Build ${{ github.ref_name }}-${{ github.run_number }}"\n      - name: Уведомление об ошибке\n        if: failure()\n        run: echo "Пайплайн завершился с ошибкой"\n\n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == "refs/heads/main"\n    steps:\n      - name: Деплой на staging\n        run: echo "Deploying to staging ${{ github.ref_name }}-${{ github.run_number }}"',
      explanation: 'needs: [test, lint] — AND зависимость. github.run_number автоинкрементируется — удобен для тегов образов. if: на уровне job блокирует весь job, if: на уровне step — только один шаг.'
    }
  ]
}
