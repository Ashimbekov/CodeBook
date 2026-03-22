export default {
  id: 12,
  title: 'Docker в CI/CD',
  description: 'Multi-stage builds, Docker Compose в тестах, сканирование образов на уязвимости, оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'Multi-stage builds для оптимизации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Multi-stage build позволяет создать маленький production образ, не включая инструменты сборки. Итоговый образ содержит только runtime зависимости.' },
        { type: 'code', language: 'bash', value: '# Dockerfile с multi-stage\n\n# Stage 1: сборка\nFROM python:3.12 AS builder\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --user -r requirements.txt\n\n# Stage 2: production образ\nFROM python:3.12-slim AS production\nWORKDIR /app\n\n# Копируем только установленные пакеты из stage 1\nCOPY --from=builder /root/.local /root/.local\n\n# Копируем код\nCOPY . .\n\nENV PATH=/root/.local/bin:$PATH\nCMD ["gunicorn", "myproject.wsgi:application"]\n\n# Размер образа: python:3.12 = 1GB, python:3.12-slim = 150MB\n# С multi-stage не включаем gcc, build-essential и т.д.'},
        { type: 'tip', value: 'Без multi-stage: если нужен gcc для компиляции psycopg2, он останется в итоговом образе. С multi-stage: gcc используется только в builder stage, в production его нет.' }
      ]
    },
    {
      id: 2,
      title: 'Docker Compose для тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker-compose.test.yml описывает полное тестовое окружение: приложение + PostgreSQL + Redis. Идеально для воспроизводимых тестов.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.test.yml\nversion: "3.9"\nservices:\n  test:\n    build:\n      context: .\n      target: builder  # использовать stage builder\n    command: pytest --tb=short -x\n    environment:\n      DATABASE_URL: postgresql://testuser:testpass@db:5432/testdb\n      REDIS_URL: redis://redis:6379/0\n    depends_on:\n      db:\n        condition: service_healthy\n      redis:\n        condition: service_started\n\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_USER: testuser\n      POSTGRES_PASSWORD: testpass\n      POSTGRES_DB: testdb\n    healthcheck:\n      test: ["CMD", "pg_isready", "-U", "testuser"]\n      interval: 5s\n\n  redis:\n    image: redis:7-alpine' },
        { type: 'code', language: 'bash', value: '# Запуск в CI\ndocker-compose -f docker-compose.test.yml run --rm test\ndocker-compose -f docker-compose.test.yml down -v' }
      ]
    },
    {
      id: 3,
      title: 'Docker Scout и Trivy — сканирование уязвимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сканирование Docker образов на известные CVE уязвимости — важная часть CI. Trivy — популярный open source сканер.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions: сканирование Trivy\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Сборка образа\n        run: docker build -t myapp:latest .\n\n      - name: Trivy сканирование\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: myapp:latest\n          format: sarif\n          output: trivy-results.sarif\n          severity: CRITICAL,HIGH\n          exit-code: 1  # упасть при нахождении уязвимостей\n\n      - name: Загрузить в GitHub Security\n        uses: github/codeql-action/upload-sarif@v3\n        if: always()\n        with:\n          sarif_file: trivy-results.sarif' },
        { type: 'note', value: 'exit-code: 1 при CRITICAL уязвимостях — хорошая практика. Но будь готов к тому что в базовых образах почти всегда есть HIGH уязвимости. Начни с exit-code только для CRITICAL.' }
      ]
    },
    {
      id: 4,
      title: 'Docker buildx — multi-platform builds',
      type: 'theory',
      content: [
        { type: 'text', value: 'Buildx позволяет собирать образы для нескольких архитектур (amd64, arm64) одновременно. Важно для деплоя на Apple Silicon или ARM серверы.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  build-multiplatform:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: docker/setup-qemu-action@v3  # эмуляция ARM\n      - uses: docker/setup-buildx-action@v3\n\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n\n      - uses: docker/build-push-action@v6\n        with:\n          platforms: linux/amd64,linux/arm64\n          push: true\n          tags: ghcr.io/${{ github.repository }}:latest' },
        { type: 'tip', value: 'Multi-platform сборка занимает больше времени из-за эмуляции QEMU. Если нужна скорость — собирай amd64 на ubuntu runner и arm64 на arm runner через matrix.' }
      ]
    },
    {
      id: 5,
      title: 'Оптимизация Dockerfile для CI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильный порядок инструкций в Dockerfile максимизирует кеш слоёв и ускоряет сборку в CI.' },
        { type: 'code', language: 'bash', value: '# ПЛОХО: код копируется раньше requirements\nFROM python:3.12-slim\nCOPY . /app              # < изменился любой файл -> переустановка пакетов\nRUN pip install -r /app/requirements.txt\n\n# ХОРОШО: requirements отдельно до кода\nFROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .  # < меняется редко -> кеш попадает\nRUN pip install -r requirements.txt\nCOPY . .                 # < меняется часто, но пакеты уже в кеше\n\n# .dockerignore — не копировать лишнее\n# .dockerignore содержит:\n# __pycache__\n# *.pyc\n# .git\n# .env\n# venv/\n# tests/' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CI с Docker Compose тестами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow запускающий тесты через docker-compose.test.yml.',
      requirements: [
        'docker-compose.test.yml с сервисами: test, db (postgres), redis',
        'Healthcheck для PostgreSQL',
        'GitHub Actions workflow запускает docker-compose run test',
        'Результаты тестов (JUnit XML) извлекаются из контейнера и загружаются как артефакт',
        'docker-compose down -v после тестов (всегда)'
      ],
      expectedOutput: 'docker-compose -f docker-compose.test.yml run --rm test\nВсе 42 теста прошли\nАртефакт test-results.xml загружен',
      hint: 'Для извлечения артефактов из контейнера используй volume: - ./test-results:/app/test-results в docker-compose.test.yml.',
      solution: '# docker-compose.test.yml\nversion: "3.9"\nservices:\n  test:\n    build: .\n    command: pytest --junitxml=/results/junit.xml --tb=short\n    volumes:\n      - test-results:/results\n    environment:\n      DATABASE_URL: postgresql://user:pass@db:5432/testdb\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: testdb\n    healthcheck:\n      test: ["CMD","pg_isready","-U","user"]\n      interval: 5s\nvolumes:\n  test-results:\n\n# .github/workflows/test.yml\nname: Tests\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Запуск тестов\n        run: docker-compose -f docker-compose.test.yml run --rm test\n      - name: Извлечь результаты\n        if: always()\n        run: |\n          docker cp $(docker-compose -f docker-compose.test.yml ps -q test):/results/junit.xml . 2>/dev/null || true\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: test-results\n          path: junit.xml\n      - name: Cleanup\n        if: always()\n        run: docker-compose -f docker-compose.test.yml down -v',
      explanation: 'Volume test-results монтируется в /results внутри контейнера — pytest пишет туда результаты. docker-compose down -v удаляет volume после тестов — важно для чистоты. if: always() на cleanup гарантирует очистку даже при падении тестов.'
    },
    {
      id: 7,
      title: 'Практика: Multi-stage build и сканирование',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай optimized multi-stage Dockerfile и pipeline с Trivy сканированием.',
      requirements: [
        'Dockerfile: stage builder (python:3.12), stage production (python:3.12-slim)',
        'builder устанавливает зависимости, production копирует --from=builder',
        'Workflow: build -> scan (Trivy) -> push',
        'Trivy с severity CRITICAL — блокировать CI',
        'Добавить .dockerignore исключающий .git, __pycache__, tests/, .env'
      ],
      expectedOutput: 'Образ builder: ~800MB (включает gcc)\nОбраз production: ~150MB (только runtime)\nTrivy: "No CRITICAL vulnerabilities found"\nПуш в GHCR',
      hint: 'COPY --from=builder /root/.local /root/.local копирует pip пакеты. ENV PATH=/root/.local/bin:$PATH делает их доступными.',
      solution: '# Dockerfile\nFROM python:3.12 AS builder\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --user --no-cache-dir -r requirements.txt\n\nFROM python:3.12-slim AS production\nWORKDIR /app\nCOPY --from=builder /root/.local /root/.local\nENV PATH=/root/.local/bin:$PATH\nCOPY . .\nCMD ["gunicorn","myproject.wsgi:application","--bind","0.0.0.0:8000"]\n\n# .dockerignore\n# .git\n# __pycache__\n# *.pyc\n# .env\n# venv/\n# tests/\n\n# .github/workflows/build.yml\njobs:\n  build-scan-push:\n    runs-on: ubuntu-latest\n    permissions: {packages: write}\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/setup-buildx-action@v3\n      - name: Build\n        uses: docker/build-push-action@v6\n        with:\n          load: true\n          tags: myapp:test\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n      - name: Trivy scan\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: myapp:test\n          severity: CRITICAL\n          exit-code: 1\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n      - name: Push\n        run: |\n          docker tag myapp:test ghcr.io/${{ github.repository }}:${{ github.sha }}\n          docker push ghcr.io/${{ github.repository }}:${{ github.sha }}',
      explanation: 'load: true загружает образ в локальный docker daemon для сканирования. Триви сканирует до пуша — не хочется публиковать уязвимый образ. --user в pip install — пакеты в /root/.local, не в системном Python.'
    }
  ]
}
