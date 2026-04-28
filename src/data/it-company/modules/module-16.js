export default {
  id: 16,
  title: 'CI/CD',
  description: 'Continuous Integration и Continuous Delivery/Deployment: автоматизация сборки, тестирования и доставки кода от коммита до продакшена.',
  lessons: [
    {
      id: 1,
      title: 'Continuous Integration — сборка и тесты на каждый коммит',
      type: 'theory',
      content: [
        { type: 'text', value: 'Continuous Integration (CI) — практика, при которой каждый коммит автоматически собирается и прогоняется через тесты. Цель — ловить ошибки рано, пока они дешёвые. Без CI разработчики неделями пишут код в изоляции, а потом при слиянии получают лавину конфликтов и багов.' },
        { type: 'heading', value: 'Зачем нужен CI' },
        { type: 'list', value: [
          'Автоматическая проверка каждого коммита — не нужно запускать тесты вручную',
          'Быстрая обратная связь — разработчик узнаёт о проблеме через 5-10 минут, а не через 2 недели',
          'Единый стандарт качества — линтеры и тесты одинаковы для всех',
          'Конфликты обнаруживаются рано — слияние маленьких изменений проще',
          'Уверенность в коде — если pipeline зелёный, код работает'
        ] },
        { type: 'heading', value: 'Что происходит при каждом пуше' },
        { type: 'code', language: 'bash', value: '# Типичный сценарий CI:\n# 1. Разработчик делает git push\n# 2. CI-сервер получает webhook от GitHub/GitLab\n# 3. CI-сервер:\n#    a) Клонирует репозиторий\n#    b) Устанавливает зависимости (npm install, pip install)\n#    c) Запускает линтер (eslint, pylint)\n#    d) Запускает тесты (jest, pytest)\n#    e) Собирает проект (npm run build)\n# 4. Результат: ✅ зелёная галочка или ❌ красный крест\n\n# Пример в реальности:\n# Команда из 8 разработчиков делает ~30 пушей в день\n# Каждый пуш запускает pipeline за 5-8 минут\n# Без CI: баги копятся → мучительное слияние в конце спринта\n# С CI: баги ловятся сразу → стабильная main-ветка' },
        { type: 'heading', value: 'Ключевые принципы CI' },
        { type: 'list', value: [
          'Коммить часто — минимум раз в день, лучше несколько раз',
          'Не ломай build — если pipeline упал, это приоритет номер один',
          'Пиши тесты — CI без тестов бесполезен',
          'Быстрый pipeline — если CI занимает 40 минут, люди перестают ждать и мержат без проверки',
          'Main-ветка всегда зелёная — это инвариант команды'
        ] },
        { type: 'tip', value: 'В Google правило: если main-ветка сломана больше 10 минут, это инцидент. В вашей команде настройте Slack-уведомления о падении CI — так каждый видит проблему мгновенно.' },
        { type: 'note', value: 'CI — это не инструмент, а практика. Jenkins, GitHub Actions, GitLab CI — это инструменты для реализации CI. Можно иметь Jenkins и не практиковать CI (если тесты не пишутся или pipeline не запускается).' }
      ]
    },
    {
      id: 2,
      title: 'Continuous Delivery vs Continuous Deployment',
      type: 'theory',
      content: [
        { type: 'text', value: 'После CI код собран и протестирован. Но как доставить его до пользователей? Тут есть два подхода: Continuous Delivery и Continuous Deployment. Они звучат похоже, но отличаются в одном ключевом моменте — ручном одобрении.' },
        { type: 'heading', value: 'Continuous Delivery (CD)' },
        { type: 'text', value: 'Continuous Delivery означает, что код всегда готов к деплою. Каждый коммит в main-ветку проходит все проверки и может быть задеплоен в продакшен одним нажатием кнопки. Но деплой происходит вручную — человек принимает решение, когда выкатывать.' },
        { type: 'code', language: 'bash', value: '# Continuous Delivery:\n# git push → CI (lint, test, build) → Staging (автоматически)\n#                                    → Production (ручная кнопка)\n\n# Пример из реальности:\n# Команда e-commerce платформы:\n# - Каждый мёрж в main автоматически деплоится на staging\n# - QA тестирует на staging\n# - Release Manager нажимает кнопку "Deploy to production"\n# - Деплой в продакшен происходит раз в неделю по средам\n# - Если нужен hotfix — деплоят вне расписания' },
        { type: 'heading', value: 'Continuous Deployment' },
        { type: 'text', value: 'Continuous Deployment — каждый коммит, прошедший все автоматические проверки, автоматически деплоится в продакшен. Никакого ручного одобрения. Это требует зрелых тестов и мониторинга.' },
        { type: 'code', language: 'bash', value: '# Continuous Deployment:\n# git push → CI (lint, test, build) → Production (автоматически!)\n\n# Пример из реальности:\n# Netflix, GitHub, Facebook деплоят так:\n# - Разработчик мержит PR\n# - Через 15 минут код уже в продакшене\n# - Деплои происходят 50-100 раз в день\n# - Ошибки ловятся мониторингом и feature flags\n# - Automatic rollback при росте ошибок' },
        { type: 'heading', value: 'Сравнение подходов' },
        { type: 'list', value: [
          'Continuous Delivery: ручной деплой, подходит для команд с QA, регулируемых отраслей (банки, медицина)',
          'Continuous Deployment: автоматический деплой, подходит для зрелых команд с хорошим покрытием тестами',
          'Большинство команд начинают с Continuous Delivery и постепенно переходят к Deployment',
          'Feature Flags делают Continuous Deployment безопаснее — код в продакшене, но фича выключена'
        ] },
        { type: 'warning', value: 'Continuous Deployment без хорошего покрытия тестами — прямая дорога к инцидентам в продакшене. Не внедряйте его, пока не уверены в тестах и мониторинге.' },
        { type: 'tip', value: 'Оба подхода начинаются с CI. Если у вас ещё нет автоматических тестов на каждый коммит, начните с CI, потом добавьте автодеплой на staging (Delivery), и только потом думайте о Deployment.' }
      ]
    },
    {
      id: 3,
      title: 'GitHub Actions — workflow, jobs, steps',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Actions — CI/CD платформа, встроенная в GitHub. Она позволяет описывать pipeline в YAML-файлах прямо в репозитории. Каждый workflow состоит из jobs, каждый job — из steps.' },
        { type: 'heading', value: 'Структура workflow' },
        { type: 'code', language: 'bash', value: '# Файл: .github/workflows/ci.yml\n# \n# Workflow — описание всего pipeline\n#   └── Job — группа шагов, запускается на одной машине\n#       └── Step — одно действие (команда или action)\n#\n# Workflow запускается по событию (push, PR, schedule)\n# Jobs могут запускаться параллельно или последовательно\n# Steps выполняются последовательно внутри job' },
        { type: 'heading', value: 'Пример полного workflow' },
        { type: 'code', language: 'bash', value: '# .github/workflows/ci.yml\nname: CI Pipeline\n\n# Когда запускать\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\n# Переменные окружения для всего workflow\nenv:\n  NODE_VERSION: 20\n\njobs:\n  # Job 1: Линтинг\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ env.NODE_VERSION }}\n          cache: npm\n      - run: npm ci\n      - run: npm run lint\n\n  # Job 2: Тесты (зависит от lint)\n  test:\n    needs: lint\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ env.NODE_VERSION }}\n          cache: npm\n      - run: npm ci\n      - run: npm test -- --coverage\n      - uses: actions/upload-artifact@v4\n        with:\n          name: coverage\n          path: coverage/\n\n  # Job 3: Сборка (зависит от test)\n  build:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ env.NODE_VERSION }}\n          cache: npm\n      - run: npm ci\n      - run: npm run build\n      - uses: actions/upload-artifact@v4\n        with:\n          name: build\n          path: dist/' },
        { type: 'heading', value: 'Ключевые концепции' },
        { type: 'list', value: [
          'actions/checkout@v4 — клонирует репозиторий (нужен в каждом job)',
          'needs: lint — job запустится только если lint прошёл успешно',
          'runs-on: ubuntu-latest — каждый job запускается в свежей виртуальной машине',
          'npm ci — устанавливает зависимости строго по lock-файлу (не npm install!)',
          'actions/upload-artifact — сохраняет файлы между jobs (coverage, build)',
          'cache: npm — кэширует node_modules для ускорения'
        ] },
        { type: 'heading', value: 'Secrets и переменные' },
        { type: 'code', language: 'bash', value: '# Секреты хранятся в Settings → Secrets\n# Доступ через ${{ secrets.MY_SECRET }}\n\n# Пример деплоя с секретами:\n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == \'refs/heads/main\'  # Только для main\n    steps:\n      - run: |\n          ssh ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }} \\\n            "cd /app && git pull && npm ci && pm2 restart all"' },
        { type: 'tip', value: 'Для локального тестирования GitHub Actions используйте инструмент act (https://github.com/nektos/act). Он запускает workflow локально в Docker, не нужно пушить для проверки.' }
      ]
    },
    {
      id: 4,
      title: 'Типичный CI pipeline — lint, test, build, deploy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартный CI pipeline состоит из нескольких стадий, каждая из которых проверяет код на определённом уровне. Если любая стадия падает — pipeline останавливается. Это как конвейер на заводе: бракованная деталь не идёт дальше.' },
        { type: 'heading', value: 'Стадии pipeline' },
        { type: 'code', language: 'bash', value: '# Стадия 1: LINT (30 секунд)\n# Проверяет стиль и качество кода\n# eslint, prettier, stylelint, pylint, golint\n# Ловит: неиспользуемые переменные, console.log, кривое форматирование\nnpm run lint\nnpm run format:check\n\n# Стадия 2: TEST (2-5 минут)\n# Unit-тесты, integration-тесты\n# jest, pytest, go test, JUnit\n# Ловит: баги в бизнес-логике, сломанные API\nnpm test -- --coverage --ci\n# Проверка покрытия: минимум 80%\n\n# Стадия 3: BUILD (1-3 минуты)\n# Сборка проекта, компиляция\n# webpack, vite, go build, mvn package, docker build\n# Ловит: ошибки TypeScript, missing imports, проблемы сборки\nnpm run build\ndocker build -t myapp:$GITHUB_SHA .\n\n# Стадия 4: DEPLOY (2-5 минут)\n# Деплой на staging или production\n# Только для main-ветки!\ndocker push myregistry/myapp:$GITHUB_SHA\nkubectl set image deployment/myapp app=myregistry/myapp:$GITHUB_SHA' },
        { type: 'heading', value: 'Время pipeline — критически важно' },
        { type: 'list', value: [
          'До 5 минут — идеально, разработчик ждёт и сразу видит результат',
          '5-10 минут — нормально, разработчик переключается на другую задачу',
          '10-20 минут — терпимо, но уже замедляет работу',
          '20+ минут — проблема, люди мержат без ожидания, падает качество',
          'Netflix: CI за 4 минуты, Google: CI за 5-7 минут (для микросервиса)'
        ] },
        { type: 'heading', value: 'Оптимизация скорости pipeline' },
        { type: 'code', language: 'bash', value: '# 1. Кэширование зависимостей\n# Не скачивать node_modules каждый раз\n- uses: actions/cache@v4\n  with:\n    path: node_modules\n    key: ${{ runner.os }}-node-${{ hashFiles(\'package-lock.json\') }}\n\n# 2. Параллельные jobs\n# lint и test могут идти одновременно\njobs:\n  lint:\n    runs-on: ubuntu-latest\n  test:\n    runs-on: ubuntu-latest\n  # Оба запустятся параллельно!\n  build:\n    needs: [lint, test]  # Ждёт завершения обоих\n\n# 3. Запускать только нужное\n# Если изменились только .md файлы — не запускать тесты\non:\n  push:\n    paths-ignore:\n      - "*.md"\n      - "docs/**"\n\n# 4. Тестировать только изменённое\n# Jest: --changedSince для инкрементальных тестов\nnpx jest --changedSince=main' },
        { type: 'note', value: 'В больших компаниях (Google, Meta) monorepo содержат тысячи проектов. Их CI определяет, какие проекты затронуты изменением, и запускает тесты только для них. Это называется affected/impacted analysis.' },
        { type: 'tip', value: 'Добавьте в pipeline проверку размера бандла (bundlesize) и lighthouse CI для фронтенда. Это ловит регрессии производительности до продакшена.' }
      ]
    },
    {
      id: 5,
      title: 'Что делать когда pipeline сломан — red build culture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Красный pipeline (failed build) — это не рядовое событие, это блокер для всей команды. Пока pipeline красный, никто не может безопасно мержить код. Red build culture — это набор правил и привычек команды для быстрого реагирования на сломанный CI.' },
        { type: 'heading', value: 'Почему сломанный pipeline — это критично' },
        { type: 'list', value: [
          'Никто не может мержить — основная ветка нестабильна',
          'Новые PR не проверяются корректно — тесты падают не из-за твоего кода',
          'Копятся неотправленные изменения — потом сложнее мержить',
          'Теряется доверие к CI — люди начинают игнорировать красные статусы',
          'Деплой в продакшен заблокирован — бизнес не получает новые фичи'
        ] },
        { type: 'heading', value: 'Правила Red Build Culture' },
        { type: 'code', language: 'bash', value: '# Правило 1: Тот, кто сломал — тот и чинит\n# Автор последнего мёржа в main получает уведомление\n# У него есть 15 минут на реакцию\n\n# Правило 2: Если не можешь починить быстро — откати\ngit revert <commit-hash>\ngit push origin main\n# Лучше откатить и разбираться в спокойном режиме\n\n# Правило 3: Не мержь поверх красного\n# Дождись зелёного pipeline, потом мержь свой PR\n# Иначе невозможно понять, чей коммит сломал\n\n# Правило 4: Build cop / Build sheriff (ротация)\n# Каждую неделю один человек — дежурный по CI\n# Его задача: следить за pipeline и координировать починку\n\n# Правило 5: Уведомления\n# Slack-бот пишет в канал:\n# "❌ Pipeline failed on main by @ivan — commit abc123"\n# "✅ Pipeline fixed on main by @ivan — commit def456"' },
        { type: 'heading', value: 'Типичные причины падения CI' },
        { type: 'list', value: [
          'Flaky tests — тесты, которые то проходят, то нет (race conditions, таймауты)',
          'Забыли обновить snapshot — тест сравнивает UI с устаревшим снимком',
          'Конфликт зависимостей — npm ci падает из-за несовместимых версий',
          'Закончилось место на CI-сервере — слишком большие артефакты',
          'Внешний сервис недоступен — тест обращается к реальному API',
          'Merge conflict — конфликт при слиянии с main'
        ] },
        { type: 'heading', value: 'Борьба с flaky-тестами' },
        { type: 'code', language: 'bash', value: '# Flaky test — тест, который падает нестабильно\n# Это самая частая причина потери доверия к CI\n\n# Стратегии борьбы:\n# 1. Карантин — перенести flaky тест в отдельный suite\n# Он запускается, но не блокирует pipeline\njest --testPathPattern=quarantine/ || true\n\n# 2. Retry — перезапуск упавших тестов\n# GitHub Actions:\n- uses: nick-fields/retry@v2\n  with:\n    max_attempts: 3\n    command: npm test\n\n# 3. Мониторинг — отслеживать процент flaky тестов\n# Если тест падает > 5% запусков — помечаем как flaky\n\n# 4. Изолировать — мокать внешние зависимости\n# Не обращаться к реальным API в unit-тестах\n\n# В Google: отдельная команда занимается flaky-тестами\n# У них дашборд с процентом flaky по проектам' },
        { type: 'warning', value: 'Никогда не отключайте упавший тест "потому что CI красный". Либо почините тест, либо перенесите в карантин с тикетом на починку. Отключённый тест — потерянное покрытие навсегда.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Описать CI/CD pipeline для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вы — тимлид команды из 5 разработчиков. Проект — веб-приложение на React + Node.js API. Нужно описать полный CI/CD pipeline: от пуша до деплоя в продакшен.',
      requirements: [
        'Описать стадии CI pipeline (lint, test, build) с конкретными командами',
        'Выбрать и обосновать подход: Continuous Delivery или Continuous Deployment',
        'Описать стратегию ветвления и когда запускается pipeline',
        'Указать целевое время pipeline и способы оптимизации',
        'Описать процесс реагирования на сломанный pipeline (red build culture)',
        'Описать настройку уведомлений для команды'
      ],
      hint: 'Разделите pipeline на stages: lint (eslint, prettier) → test (jest, supertest) → build (vite, docker) → deploy (staging автоматически, production по кнопке). Для ветвления: pipeline на каждый PR и push в main.',
      expectedOutput: 'CI Pipeline:\n- lint (30s): eslint + prettier --check\n- test (3min): jest --coverage (min 80%) + supertest для API\n- build (2min): vite build + docker build\n- deploy-staging (2min): автоматически при мёрже в main\n- deploy-production: ручная кнопка (Continuous Delivery)\n\nВетвление: feature/* → PR → main\nPipeline: на каждый PR (lint, test, build), на main (+ deploy)\nЦелевое время: до 8 минут\nRed build: автор чинит за 15 минут или откатывает\nУведомления: Slack #ci-alerts',
      solution: '# CI/CD Pipeline для React + Node.js проекта\n\n# 1. СТАДИИ PIPELINE\n# Lint (30 секунд):\n#   - npx eslint . --ext .ts,.tsx,.js\n#   - npx prettier --check "src/**/*.{ts,tsx,js,css}"\n# Test (3 минуты):\n#   - npm test -- --coverage --ci (Jest, покрытие >= 80%)\n#   - npm run test:api (Supertest для API endpoints)\n# Build (2 минуты):\n#   - cd frontend && npx vite build\n#   - docker build -t myapp-api:$SHA -f Dockerfile.api .\n#   - docker build -t myapp-web:$SHA -f Dockerfile.web .\n# Deploy Staging (2 минуты):\n#   - docker push + kubectl apply (автоматически)\n# Deploy Production:\n#   - Ручное подтверждение в GitHub Actions (environment protection)\n\n# 2. ПОДХОД: Continuous Delivery\n# Обоснование: команда из 5 человек, продукт с реальными пользователями\n# QA проверяет на staging перед продакшеном\n# Деплой в прод раз в неделю (среда) или по необходимости\n\n# 3. ВЕТВЛЕНИЕ\n# feature/TASK-123-description → PR в main\n# Pipeline запускается: на каждый PR (lint, test, build)\n# На мёрж в main: lint, test, build, deploy-staging\n# Deploy production: ручной trigger\n\n# 4. ЦЕЛЕВОЕ ВРЕМЯ: 8 минут\n# Оптимизация:\n#   - Кэш node_modules (actions/cache)\n#   - Параллельные jobs (lint || test, потом build)\n#   - paths-ignore для .md файлов\n\n# 5. RED BUILD CULTURE\n# - Автор последнего мёржа чинит за 15 минут\n# - Если не может — git revert и тикет в Jira\n# - Build sheriff: ротация по неделям\n# - Не мержить поверх красного pipeline\n\n# 6. УВЕДОМЛЕНИЯ\n# Slack #ci-alerts: каждый failed pipeline на main\n# Slack #dev: summary раз в день (% зелёных pipeline)\n# GitHub: статус checks на каждом PR',
      explanation: 'CI/CD pipeline — основа качества в команде. Lint ловит стилевые проблемы за секунды. Тесты проверяют логику за минуты. Build проверяет, что проект собирается. Continuous Delivery подходит для команды из 5 человек, потому что позволяет QA проверять код на staging. Red build culture гарантирует, что сломанный pipeline починят быстро и команда не потеряет доверие к CI.'
    }
  ]
}
