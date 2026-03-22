export default {
  id: 4,
  title: 'GitHub Actions: secrets и переменные',
  description: 'Secrets, переменные окружения, environments с защитой — безопасно храним конфиденциальные данные.',
  lessons: [
    {
      id: 1,
      title: 'Secrets — безопасное хранение секретов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Secrets хранят конфиденциальные данные (токены, пароли, ключи API) зашифрованными. В логах они маскируются как ***.' },
        { type: 'code', language: 'yaml', value: '# Добавление secrets: Settings -> Secrets and variables -> Actions\n# Использование в workflow:\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Деплой\n        env:\n          DATABASE_URL: ${{ secrets.DATABASE_URL }}\n          API_KEY: ${{ secrets.API_KEY }}\n        run: |\n          echo "Подключение к БД..."\n          # DATABASE_URL доступна как переменная окружения\n          python deploy.py\n\n      - name: Docker login\n        run: |\n          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin' },
        { type: 'warning', value: 'Никогда не передавай secrets через аргументы командной строки! Они видны в логах системы. Используй env: переменные или stdin.' }
      ]
    },
    {
      id: 2,
      title: 'Уровни secrets: repository, environment, organization',
      type: 'theory',
      content: [
        { type: 'text', value: 'Secrets можно задавать на трёх уровнях: репозиторий, environment (prod/staging), организация.' },
        { type: 'code', language: 'yaml', value: '# Использование environment secrets\njobs:\n  deploy-production:\n    runs-on: ubuntu-latest\n    environment: production  # привязка к environment\n    steps:\n      - name: Деплой на prod\n        env:\n          # Production secrets — только для этого environment\n          DB_URL: ${{ secrets.DATABASE_URL }}\n          SSH_KEY: ${{ secrets.SSH_PRIVATE_KEY }}\n        run: bash deploy.sh\n\n  deploy-staging:\n    runs-on: ubuntu-latest\n    environment: staging  # другие secrets\n    steps:\n      - run: bash deploy.sh' },
        { type: 'list', items: [
          'Repository secrets — доступны всем workflows репозитория',
          'Environment secrets — только для jobs с указанным environment',
          'Organization secrets — доступны всем репозиториям организации',
          'Приоритет: environment > repository > organization'
        ]}
      ]
    },
    {
      id: 3,
      title: 'Переменные (Variables) — не секретные данные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Variables — для нечувствительных данных которые могут меняться между окружениями (URL, имена образов). Видны в логах, в отличие от secrets.' },
        { type: 'code', language: 'yaml', value: '# Settings -> Secrets and variables -> Variables\n# Использование:\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Деплой\n        env:\n          APP_URL: ${{ vars.APP_URL }}           # переменная репозитория\n          IMAGE_NAME: ${{ vars.DOCKER_IMAGE }}   # имя образа\n        run: |\n          echo "Деплой на $APP_URL"\n          docker pull $IMAGE_NAME:latest\n\n      # Встроенные переменные GitHub\n      - run: |\n          echo "Репозиторий: $GITHUB_REPOSITORY"\n          echo "Ветка: $GITHUB_REF_NAME"\n          echo "SHA: $GITHUB_SHA"\n          echo "Актор: $GITHUB_ACTOR"' }
      ]
    },
    {
      id: 4,
      title: 'Environments с защитными правилами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Environments позволяют настроить защиту для деплоя: ручное подтверждение, ограничение веток, таймаут ожидания.' },
        { type: 'code', language: 'yaml', value: '# Settings -> Environments -> production\n# Настройка защит:\n# - Required reviewers: список людей которые должны подтвердить\n# - Wait timer: 5 минут ожидания перед деплоем\n# - Allowed branches: только main, release/*\n\njobs:\n  deploy-prod:\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n      url: https://example.com  # ссылка показывается в интерфейсе\n    steps:\n      - name: Деплой\n        run: bash deploy.sh production' },
        { type: 'tip', value: 'Required reviewers — отличная практика для продакшена: кто-то из команды должен явно нажать "Approve" прежде чем деплой запустится. Даже если все тесты прошли.' }
      ]
    },
    {
      id: 5,
      title: 'GITHUB_TOKEN — автоматический токен',
      type: 'theory',
      content: [
        { type: 'text', value: 'GITHUB_TOKEN — автоматически создаётся для каждого запуска workflow. Можно использовать для взаимодействия с GitHub API: создание releases, комментарии к PR.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  release:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write    # разрешение на запись в репозиторий\n      pull-requests: write\n\n    steps:\n      - name: Создать релиз\n        uses: actions/create-release@v1\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n        with:\n          tag_name: ${{ github.ref }}\n          release_name: Release ${{ github.ref }}\n\n      - name: Комментарий к PR\n        uses: actions/github-script@v7\n        with:\n          script: |\n            github.rest.issues.createComment({\n              issue_number: context.issue.number,\n              owner: context.repo.owner,\n              repo: context.repo.repo,\n              body: "Тесты прошли успешно!"\n            })' },
        { type: 'note', value: 'Явно указывай permissions для GITHUB_TOKEN — минимально необходимые. По умолчанию токен имеет ограниченные права.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Безопасный деплой с secrets',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow для деплоя с правильным использованием secrets и environments.',
      requirements: [
        'Два environments: staging (автодеплой) и production (с подтверждением)',
        'Secrets: SERVER_HOST, SSH_PRIVATE_KEY, DATABASE_URL для каждого env',
        'Job deploy-staging: деплой при push в develop',
        'Job deploy-production: деплой при push в main, использует environment: production',
        'SSH деплой через appleboy/ssh-action с секретным ключом'
      ],
      expectedOutput: 'Push в develop -> автодеплой на staging\nPush в main -> ждёт подтверждения -> деплой на production\nSecrets маскируются в логах как ***',
      hint: 'appleboy/ssh-action@v1: with: host: ${{ secrets.SERVER_HOST }}, key: ${{ secrets.SSH_PRIVATE_KEY }}, script: ...',
      solution: '# .github/workflows/deploy.yml\nname: Deploy\n\non:\n  push:\n    branches: [main, develop]\n\njobs:\n  deploy-staging:\n    if: github.ref == "refs/heads/develop"\n    runs-on: ubuntu-latest\n    environment: staging\n    steps:\n      - uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.SERVER_HOST }}\n          username: ubuntu\n          key: ${{ secrets.SSH_PRIVATE_KEY }}\n          script: |\n            cd /app && git pull origin develop\n            docker-compose -f docker-compose.staging.yml up -d --build\n\n  deploy-production:\n    if: github.ref == "refs/heads/main"\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n      url: ${{ vars.APP_URL }}\n    steps:\n      - uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.SERVER_HOST }}\n          username: ubuntu\n          key: ${{ secrets.SSH_PRIVATE_KEY }}\n          script: |\n            cd /app && git pull origin main\n            docker-compose -f docker-compose.prod.yml up -d --build',
      explanation: 'environment: production с Required reviewers в настройках — workflow автоматически встанет на паузу и будет ждать подтверждения. SSH ключ передаётся через stdin внутри action, не через аргумент — безопасно.'
    }
  ]
}
