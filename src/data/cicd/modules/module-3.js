export default {
  id: 3,
  title: 'GitHub Actions: workflows',
  description: 'Триггеры on push/pull_request/schedule, фильтры по веткам и путям, workflow_dispatch.',
  lessons: [
    {
      id: 1,
      title: 'Триггеры on: push и pull_request',
      type: 'theory',
      content: [
        { type: 'text', value: 'Раздел on: определяет когда запускается workflow. Самые частые триггеры — push (коммит в ветку) и pull_request (создание/обновление PR).' },
        { type: 'code', language: 'yaml', value: 'on:\n  push:\n    branches:\n      - main\n      - "release/*"     # все release ветки\n    branches-ignore:\n      - "feature/*"      # игнорировать feature ветки\n    paths:\n      - "src/**"         # только при изменении src/\n      - "*.py"\n    paths-ignore:\n      - "docs/**"        # игнорировать docs/\n      - "*.md"\n    tags:\n      - "v*"             # при создании тега v1.0.0\n\n  pull_request:\n    branches: [main]\n    types: [opened, synchronize, reopened]  # типы событий PR' },
        { type: 'tip', value: 'paths: очень полезен в монорепозиториях — запускай workflow только если изменились файлы конкретного сервиса. Экономит CI минуты.' }
      ]
    },
    {
      id: 2,
      title: 'Триггер schedule и workflow_dispatch',
      type: 'theory',
      content: [
        { type: 'text', value: 'schedule запускает workflow по расписанию (cron). workflow_dispatch — ручной запуск через UI или API.' },
        { type: 'code', language: 'yaml', value: 'on:\n  schedule:\n    - cron: "0 2 * * *"     # каждый день в 2:00 UTC\n    - cron: "0 9 * * 1"     # каждый понедельник в 9:00\n\n  workflow_dispatch:        # ручной запуск\n    inputs:\n      environment:\n        description: "Окружение для деплоя"\n        required: true\n        default: "staging"\n        type: choice\n        options: [staging, production]\n      debug:\n        description: "Включить debug логи"\n        type: boolean\n        default: false\n\njobs:\n  scheduled-task:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Показать параметры ручного запуска\n        run: |\n          echo "Окружение: ${{ inputs.environment }}"\n          echo "Debug: ${{ inputs.debug }}"' },
        { type: 'note', value: 'schedule использует UTC время. workflow_dispatch позволяет параметризовать запуск — удобно для деплоя на конкретное окружение без изменения кода.' }
      ]
    },
    {
      id: 3,
      title: 'Триггеры workflow_call и repository_dispatch',
      type: 'theory',
      content: [
        { type: 'text', value: 'workflow_call позволяет вызвать workflow из другого workflow (переиспользование). repository_dispatch — запуск через внешний API.' },
        { type: 'code', language: 'yaml', value: '# Переиспользуемый workflow: .github/workflows/reusable-deploy.yml\non:\n  workflow_call:\n    inputs:\n      environment:\n        required: true\n        type: string\n    secrets:\n      deploy-key:\n        required: true\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Деплой на ${{ inputs.environment }}"\n\n---\n# Вызывающий workflow\njobs:\n  deploy-staging:\n    uses: ./.github/workflows/reusable-deploy.yml\n    with:\n      environment: staging\n    secrets:\n      deploy-key: ${{ secrets.DEPLOY_KEY }}' }
      ]
    },
    {
      id: 4,
      title: 'Concurrency — контроль параллельных запусков',
      type: 'theory',
      content: [
        { type: 'text', value: 'concurrency позволяет контролировать одновременные запуски: отменять устаревшие или блокировать новые пока не завершился текущий.' },
        { type: 'code', language: 'yaml', value: '# Отменить предыдущий запуск для той же ветки\nconcurrency:\n  group: ${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true\n\n# Практический пример: не деплоить если уже идёт деплой\njobs:\n  deploy:\n    concurrency:\n      group: deployment-${{ github.ref_name }}\n      cancel-in-progress: false  # ждать, не отменять' },
        { type: 'tip', value: 'cancel-in-progress: true идеально для CI (тесты на feature ветке) — зачем гонять тесты для старого коммита если уже пришёл новый? Для деплоя лучше false — не хочется отменять деплой на полпути.' }
      ]
    },
    {
      id: 5,
      title: 'Передача данных между jobs через outputs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jobs изолированы — у них разные VM. Для передачи данных используются outputs.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  build:\n    runs-on: ubuntu-latest\n    outputs:\n      image-tag: ${{ steps.set-tag.outputs.tag }}\n      version: ${{ steps.get-version.outputs.version }}\n\n    steps:\n      - id: set-tag\n        run: echo "tag=${{ github.ref_name }}-${{ github.run_number }}" >> $GITHUB_OUTPUT\n\n      - id: get-version\n        run: |\n          VERSION=$(cat VERSION)\n          echo "version=$VERSION" >> $GITHUB_OUTPUT\n\n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    steps:\n      - name: Деплой образа\n        run: |\n          echo "Деплой образа: ${{ needs.build.outputs.image-tag }}"\n          echo "Версия: ${{ needs.build.outputs.version }}"' }
      ]
    },
    {
      id: 6,
      title: 'Artifacts — сохранение файлов между jobs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Артефакты позволяют сохранять файлы (тест-репорты, сборки) и передавать их между jobs или скачивать после завершения пайплайна.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pytest --junitxml=test-results.xml --cov=. --cov-report=xml\n\n      - name: Сохранить результаты тестов\n        uses: actions/upload-artifact@v4\n        if: always()  # сохранять даже если тесты упали\n        with:\n          name: test-results\n          path: |\n            test-results.xml\n            coverage.xml\n          retention-days: 7\n\n  analyze:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - name: Скачать результаты тестов\n        uses: actions/download-artifact@v4\n        with:\n          name: test-results\n      - run: cat test-results.xml' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Workflow с расписанием и параметрами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow с ручным запуском и расписанием для ежедневного бэкапа.',
      requirements: [
        'Триггеры: schedule (каждый день в 3:00 UTC) и workflow_dispatch',
        'workflow_dispatch имеет параметр database (choice: main/backup) и dry_run (boolean)',
        'Job backup: выводит "Резервное копирование БД: <database>"',
        'Если dry_run=true: "Пробный запуск, без реального бэкапа"',
        'Concurrency: не запускать два бэкапа одновременно'
      ],
      expectedOutput: 'Ручной запуск: database=main, dry_run=false -> "Резервное копирование БД: main"\nАвтоматический в 3:00 -> тот же вывод с параметрами по умолчанию',
      hint: 'inputs.dry_run будет строкой "true"/"false" при workflow_dispatch. Используй ${{ inputs.dry_run == "true" }} для условия.',
      solution: '# .github/workflows/backup.yml\nname: Database Backup\n\non:\n  schedule:\n    - cron: "0 3 * * *"\n  workflow_dispatch:\n    inputs:\n      database:\n        description: "База данных"\n        required: true\n        default: "main"\n        type: choice\n        options: [main, backup]\n      dry_run:\n        description: "Пробный запуск"\n        type: boolean\n        default: false\n\nconcurrency:\n  group: backup\n  cancel-in-progress: false\n\njobs:\n  backup:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Проверка dry run\n        if: inputs.dry_run == true\n        run: echo "Пробный запуск, без реального бэкапа"\n\n      - name: Резервное копирование\n        if: inputs.dry_run != true\n        run: echo "Резервное копирование БД ${{ inputs.database || "main" }}"',
      explanation: 'inputs.database || "main" — дефолтное значение когда запуск по расписанию (нет inputs). cancel-in-progress: false — важно для бэкапа: не хочется прерывать процесс на полпути.'
    }
  ]
}
