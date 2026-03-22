export default {
  id: 6,
  title: 'GitLab CI: основы',
  description: 'Файл .gitlab-ci.yml, runners, переменные, базовая структура пайплайна GitLab.',
  lessons: [
    {
      id: 1,
      title: 'Структура .gitlab-ci.yml',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitLab CI конфигурируется через файл .gitlab-ci.yml в корне репозитория. GitLab автоматически обнаруживает его и запускает пайплайн при каждом push.' },
        { type: 'code', language: 'yaml', value: '# .gitlab-ci.yml\nstages:           # определяет порядок стадий\n  - test\n  - build\n  - deploy\n\nvariables:        # глобальные переменные\n  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"\n\ntest:             # имя job\n  stage: test     # к какой стадии относится\n  image: python:3.12-slim  # Docker образ\n  script:         # команды\n    - pip install -r requirements.txt\n    - pytest\n  only:           # условия запуска\n    - main\n    - merge_requests' },
        { type: 'tip', value: 'В GitLab CI каждый job выполняется в отдельном Docker контейнере (по умолчанию). image: задаёт базовый образ — нет нужды устанавливать Python вручную.' }
      ]
    },
    {
      id: 2,
      title: 'GitLab Runners',
      type: 'theory',
      content: [
        { type: 'text', value: 'Runner — агент, который выполняет jobs. GitLab предоставляет shared runners. Можно зарегистрировать свой self-managed runner.' },
        { type: 'code', language: 'yaml', value: '# Выбор runner через tags\ntest-fast:\n  stage: test\n  tags:\n    - docker       # runner с тегом docker\n    - linux\n  script:\n    - pytest\n\ndeploy-prod:\n  stage: deploy\n  tags:\n    - production   # специальный runner только для деплоя\n  script:\n    - bash deploy.sh\n\n# Типы executor для self-managed runner:\n# shell   — выполняет команды напрямую в shell\n# docker  — каждый job в отдельном контейнере\n# k8s     — job как Pod в Kubernetes' },
        { type: 'note', value: 'Shared runners GitLab.com — бесплатно 400 минут/месяц для бесплатного плана. Self-managed runners не имеют лимита и могут быть мощнее.' }
      ]
    },
    {
      id: 3,
      title: 'Переменные в GitLab CI',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitLab CI предоставляет богатый набор предопределённых переменных и позволяет задавать свои переменные на уровне проекта/группы.' },
        { type: 'code', language: 'yaml', value: '# Использование предопределённых переменных\ntest:\n  script:\n    - echo "Ветка: $CI_COMMIT_BRANCH"\n    - echo "SHA: $CI_COMMIT_SHA"\n    - echo "Имя коммита: $CI_COMMIT_TITLE"\n    - echo "Проект: $CI_PROJECT_NAME"\n    - echo "Runner: $CI_RUNNER_DESCRIPTION"\n    - echo "Pipeline ID: $CI_PIPELINE_ID"\n    - echo "Job ID: $CI_JOB_ID"\n\n# Свои переменные\nvariables:\n  APP_ENV: staging\n  DOCKER_REGISTRY: registry.gitlab.com\n\ndeploy:\n  script:\n    - echo "Деплой на $APP_ENV"\n    - docker push $DOCKER_REGISTRY/$CI_PROJECT_PATH:$CI_COMMIT_SHORT_SHA' }
      ]
    },
    {
      id: 4,
      title: 'Правила запуска: rules и only/except',
      type: 'theory',
      content: [
        { type: 'text', value: 'rules — современный способ задать условия запуска jobs (заменяет устаревший only/except). Более гибкий и мощный.' },
        { type: 'code', language: 'yaml', value: 'test:\n  stage: test\n  script: pytest\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n    - if: $CI_PIPELINE_SOURCE == "merge_request_event"\n    - if: $CI_COMMIT_TAG  # при создании тега\n\ndeploy-staging:\n  stage: deploy\n  script: bash deploy.sh staging\n  rules:\n    - if: $CI_COMMIT_BRANCH == "develop"\n      when: on_success    # только при успехе\n\ndeploy-prod:\n  stage: deploy\n  script: bash deploy.sh production\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual        # ручной запуск\n\nnightly-job:\n  script: python check.py\n  rules:\n    - if: $CI_PIPELINE_SOURCE == "schedule"' }
      ]
    },
    {
      id: 5,
      title: 'Кеширование в GitLab CI',
      type: 'theory',
      content: [
        { type: 'text', value: 'cache в GitLab CI сохраняет директории между запусками jobs. Работает на уровне runner (не между разными runners без конфигурации).' },
        { type: 'code', language: 'yaml', value: 'default:\n  cache:\n    key: $CI_COMMIT_BRANCH        # ключ кеша по ветке\n    paths:\n      - .cache/pip/\n      - node_modules/\n    policy: pull-push             # читать и писать кеш\n\ntest:\n  stage: test\n  variables:\n    PIP_CACHE_DIR: ".cache/pip"\n  script:\n    - pip install -r requirements.txt  # из кеша если есть\n    - pytest\n\nbuild:\n  stage: build\n  cache:\n    key: $CI_COMMIT_SHA           # уникальный ключ для каждого коммита\n    paths:\n      - dist/\n    policy: push                  # только записывать (не читать)' },
        { type: 'tip', value: 'policy: pull-push — дефолт, подходит для большинства случаев. policy: pull — только читать (быстрее для test jobs). policy: push — только писать (для build jobs).' }
      ]
    },
    {
      id: 6,
      title: 'Extends и anchors — переиспользование конфига',
      type: 'theory',
      content: [
        { type: 'text', value: 'extends и YAML anchors позволяют избежать дублирования конфигурации.' },
        { type: 'code', language: 'yaml', value: '# YAML anchors\n.python-base: &python-base\n  image: python:3.12-slim\n  before_script:\n    - pip install -r requirements.txt\n\ntest-unit:\n  <<: *python-base\n  script: pytest tests/unit/\n\ntest-integration:\n  <<: *python-base\n  script: pytest tests/integration/\n\n# GitLab extends (более мощный вариант)\n.deploy-base:\n  stage: deploy\n  before_script:\n    - eval $(ssh-agent -s)\n    - echo "$SSH_PRIVATE_KEY" | ssh-add -\n\ndeploy-staging:\n  extends: .deploy-base\n  script: bash deploy.sh staging\n  environment:\n    name: staging\n\ndeploy-production:\n  extends: .deploy-base\n  script: bash deploy.sh production\n  environment:\n    name: production' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Базовый GitLab CI для Python',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай .gitlab-ci.yml для Python/Django проекта с тестами и деплоем.',
      requirements: [
        'Стадии: test, lint, build, deploy',
        'test job: image python:3.12-slim, кеш pip, pytest',
        'lint job: flake8 параллельно с test',
        'deploy-staging: ручной запуск при push в develop',
        'deploy-prod: ручной запуск при push в main',
        'Использовать extends для общей конфигурации Python'
      ],
      expectedOutput: 'git push origin develop -> test и lint автоматически, deploy-staging вручную\ngit push origin main -> test и lint автоматически, deploy-prod вручную',
      hint: 'Используй .python-base с image и before_script. extends: .python-base для test и lint jobs.',
      solution: '# .gitlab-ci.yml\nstages:\n  - test\n  - lint\n  - deploy\n\nvariables:\n  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"\n\n.python-base:\n  image: python:3.12-slim\n  cache:\n    key: "$CI_COMMIT_BRANCH"\n    paths:\n      - .cache/pip/\n  before_script:\n    - pip install -r requirements.txt\n\ntest:\n  extends: .python-base\n  stage: test\n  script:\n    - pytest --tb=short\n  rules:\n    - if: $CI_PIPELINE_SOURCE == "merge_request_event"\n    - if: $CI_COMMIT_BRANCH\n\nlint:\n  extends: .python-base\n  stage: lint\n  script:\n    - pip install flake8\n    - flake8 . --max-line-length=120\n\ndeploy-staging:\n  stage: deploy\n  script:\n    - echo "Деплой на staging"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "develop"\n      when: manual\n  environment:\n    name: staging\n\ndeploy-production:\n  stage: deploy\n  script:\n    - echo "Деплой на production"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual\n  environment:\n    name: production',
      explanation: 'extends: .python-base наследует image, cache, before_script. rules с when: manual создаёт кнопку в UI — пайплайн остановится и ждёт пока кто-то нажмёт Play. Параллельность: test и lint в одной stage выполняются одновременно.'
    }
  ]
}
