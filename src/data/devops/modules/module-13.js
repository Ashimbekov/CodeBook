export default {
  id: 13,
  title: 'CI/CD: GitLab CI/CD',
  description: 'GitLab CI/CD: .gitlab-ci.yml, pipeline, stages, jobs, runners, environments и артефакты.',
  lessons: [
    {
      id: 1,
      title: 'Основы GitLab CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitLab CI/CD — встроенная система непрерывной интеграции и доставки GitLab. Всё настраивается через один файл .gitlab-ci.yml в корне репозитория. GitLab CI популярен в enterprise-среде.' },
        { type: 'heading', value: 'Структура .gitlab-ci.yml' },
        { type: 'code', language: 'yaml', value: '# .gitlab-ci.yml\nstages:\n  - lint\n  - test\n  - build\n  - deploy\n\nvariables:\n  DOCKER_IMAGE: registry.gitlab.com/$CI_PROJECT_PATH\n  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"\n\n# Глобальный кэш\ncache:\n  paths:\n    - .cache/pip\n    - node_modules/\n\nlint:\n  stage: lint\n  image: python:3.11-slim\n  script:\n    - pip install ruff\n    - ruff check .\n\ntest:\n  stage: test\n  image: python:3.11-slim\n  services:\n    - postgres:16\n  variables:\n    POSTGRES_DB: test_db\n    POSTGRES_PASSWORD: test\n    DATABASE_URL: "postgresql://postgres:test@postgres:5432/test_db"\n  script:\n    - pip install -r requirements.txt -r requirements-dev.txt\n    - pytest tests/ -v --junitxml=report.xml\n  artifacts:\n    reports:\n      junit: report.xml\n\nbuild:\n  stage: build\n  image: docker:24\n  services:\n    - docker:24-dind\n  script:\n    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY\n    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .\n    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA\n  only:\n    - main\n    - develop' },
        { type: 'tip', value: 'GitLab предоставляет встроенные переменные: $CI_COMMIT_SHA, $CI_PROJECT_PATH, $CI_REGISTRY, $CI_PIPELINE_ID и другие. Полный список в документации GitLab CI/CD Variables.' }
      ]
    },
    {
      id: 2,
      title: 'Stages, Jobs и Rules',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stages определяют порядок выполнения. Jobs внутри одного stage запускаются параллельно. Rules позволяют гибко управлять когда job запускается.' },
        { type: 'heading', value: 'Rules вместо only/except' },
        { type: 'code', language: 'yaml', value: '# Современный подход — rules (заменяет only/except)\ndeploy-staging:\n  stage: deploy\n  script:\n    - echo "Deploy to staging"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "develop"\n      when: always\n    - if: $CI_PIPELINE_SOURCE == "merge_request_event"\n      when: manual\n    - when: never\n\ndeploy-production:\n  stage: deploy\n  script:\n    - echo "Deploy to production"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual                # Требует ручного подтверждения\n    - when: never\n  environment:\n    name: production\n    url: https://app.company.com\n\n# Условия rules:\n# if       — выражение (переменные)\n# changes  — изменённые файлы\n# exists   — файл существует\n# when     — always, manual, never, on_success, on_failure\n\ntest-frontend:\n  stage: test\n  script: npm test\n  rules:\n    - changes:\n        - "frontend/**/*"\n        - "package.json"\n      when: always\n    - when: never\n# Запускается только если изменены файлы frontend/' },
        { type: 'heading', value: 'Зависимости и артефакты' },
        { type: 'code', language: 'yaml', value: 'build:\n  stage: build\n  script:\n    - npm run build\n  artifacts:\n    paths:\n      - dist/\n    expire_in: 1 week\n\ndeploy:\n  stage: deploy\n  needs: [build]              # Явная зависимость\n  script:\n    - ls dist/                # Артефакты из build доступны\n    - rsync -avz dist/ server:/var/www/\n\n# needs позволяет запустить job не дожидаясь всего stage\n# Это ускоряет pipeline (DAG — Directed Acyclic Graph)\n\ntest-unit:\n  stage: test\n  script: pytest tests/unit/\n\ntest-integration:\n  stage: test\n  needs: [build]              # Не ждёт test-unit\n  script: pytest tests/integration/' },
        { type: 'note', value: 'artifacts передают файлы между jobs. Они доступны для скачивания в UI GitLab. expire_in ограничивает время хранения. needs создаёт DAG — job запускается сразу когда его зависимости завершены.' }
      ]
    },
    {
      id: 3,
      title: 'GitLab Runners',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitLab Runner — агент, выполняющий jobs. Может быть shared (общий для всех проектов) или specific (для конкретного проекта). Runners поддерживают разные executors: Docker, Shell, Kubernetes.' },
        { type: 'heading', value: 'Типы Runners' },
        { type: 'code', language: 'bash', value: '# Shared Runners — предоставляются GitLab.com\n# Specific Runners — ваши собственные\n# Group Runners — для группы проектов\n\n# Установка GitLab Runner\ncurl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash\nsudo apt install gitlab-runner\n\n# Регистрация Runner\nsudo gitlab-runner register\n# URL: https://gitlab.com/\n# Token: (из Settings -> CI/CD -> Runners)\n# Description: my-runner\n# Tags: docker, linux\n# Executor: docker\n# Default image: python:3.11-slim\n\n# Управление\nsudo gitlab-runner status\nsudo gitlab-runner list\nsudo gitlab-runner verify\nsudo gitlab-runner restart' },
        { type: 'heading', value: 'Executors' },
        { type: 'code', language: 'yaml', value: '# Docker executor (рекомендуется)\n# Каждый job запускается в чистом контейнере\ntest:\n  image: python:3.11-slim\n  tags:\n    - docker\n  script:\n    - pytest tests/\n\n# Shell executor\n# Job выполняется на хосте runner\ntest:\n  tags:\n    - shell\n  script:\n    - /opt/app/run-tests.sh\n\n# Kubernetes executor\n# Job запускается как Pod в K8s кластере\ntest:\n  tags:\n    - k8s\n  script:\n    - pytest tests/' },
        { type: 'tip', value: 'Docker executor — лучший выбор для CI: чистое окружение, изоляция, воспроизводимость. Shell executor — если нужен доступ к хосту (GPU, специальное ПО). Kubernetes executor — для больших команд с K8s.' }
      ]
    },
    {
      id: 4,
      title: 'Docker Build и Registry',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitLab предоставляет встроенный Container Registry для каждого проекта. Сборка и push Docker-образов — типичная задача CI/CD.' },
        { type: 'heading', value: 'Сборка Docker-образов в CI' },
        { type: 'code', language: 'yaml', value: 'variables:\n  DOCKER_TLS_CERTDIR: "/certs"\n\nbuild-image:\n  stage: build\n  image: docker:24\n  services:\n    - docker:24-dind              # Docker-in-Docker\n  variables:\n    DOCKER_HOST: tcp://docker:2376\n  before_script:\n    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY\n  script:\n    - docker build\n        --cache-from $CI_REGISTRY_IMAGE:latest\n        -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n        -t $CI_REGISTRY_IMAGE:latest\n        .\n    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n    - docker push $CI_REGISTRY_IMAGE:latest\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"' },
        { type: 'heading', value: 'Использование Kaniko (без Docker-in-Docker)' },
        { type: 'code', language: 'yaml', value: '# Kaniko — безопасная альтернатива DinD\nbuild-image:\n  stage: build\n  image:\n    name: gcr.io/kaniko-project/executor:v1.19.2-debug\n    entrypoint: [""]\n  script:\n    - /kaniko/executor\n      --context $CI_PROJECT_DIR\n      --dockerfile $CI_PROJECT_DIR/Dockerfile\n      --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n      --destination $CI_REGISTRY_IMAGE:latest\n      --cache=true\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"' },
        { type: 'note', value: 'Docker-in-Docker (DinD) требует привилегированного режима — это риск безопасности. Kaniko строит образы без Docker daemon и без привилегий. Для продакшена Kaniko предпочтительнее.' }
      ]
    },
    {
      id: 5,
      title: 'Environments и деплой',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitLab Environments отслеживают деплои в разные окружения. Они показывают какая версия задеплоена, позволяют откатить и управлять доступом.' },
        { type: 'heading', value: 'Настройка Environments' },
        { type: 'code', language: 'yaml', value: 'stages:\n  - test\n  - build\n  - deploy-staging\n  - deploy-production\n\ndeploy-staging:\n  stage: deploy-staging\n  image: bitnami/kubectl:latest\n  script:\n    - kubectl set image deployment/myapp app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n    - kubectl rollout status deployment/myapp\n  environment:\n    name: staging\n    url: https://staging.company.com\n    on_stop: stop-staging\n  rules:\n    - if: $CI_COMMIT_BRANCH == "develop"\n\nstop-staging:\n  stage: deploy-staging\n  script:\n    - kubectl delete deployment myapp\n  environment:\n    name: staging\n    action: stop\n  rules:\n    - if: $CI_COMMIT_BRANCH == "develop"\n      when: manual\n\ndeploy-production:\n  stage: deploy-production\n  image: bitnami/kubectl:latest\n  script:\n    - kubectl set image deployment/myapp app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n    - kubectl rollout status deployment/myapp\n  environment:\n    name: production\n    url: https://app.company.com\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual                # Ручное подтверждение\n  allow_failure: false' },
        { type: 'heading', value: 'Review Apps — окружение для каждого MR' },
        { type: 'code', language: 'yaml', value: 'deploy-review:\n  stage: deploy\n  script:\n    - kubectl create namespace review-$CI_MERGE_REQUEST_IID || true\n    - helm install review-$CI_MERGE_REQUEST_IID ./chart\n        --namespace review-$CI_MERGE_REQUEST_IID\n        --set image.tag=$CI_COMMIT_SHA\n  environment:\n    name: review/$CI_MERGE_REQUEST_IID\n    url: https://$CI_MERGE_REQUEST_IID.review.company.com\n    on_stop: stop-review\n    auto_stop_in: 1 week\n  rules:\n    - if: $CI_PIPELINE_SOURCE == "merge_request_event"\n\nstop-review:\n  stage: deploy\n  script:\n    - helm uninstall review-$CI_MERGE_REQUEST_IID -n review-$CI_MERGE_REQUEST_IID\n    - kubectl delete namespace review-$CI_MERGE_REQUEST_IID\n  environment:\n    name: review/$CI_MERGE_REQUEST_IID\n    action: stop\n  rules:\n    - if: $CI_PIPELINE_SOURCE == "merge_request_event"\n      when: manual' },
        { type: 'tip', value: 'Review Apps создают изолированное окружение для каждого Merge Request. Ревьюер может тестировать функциональность в живом окружении. auto_stop_in автоматически удаляет старые окружения.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: GitLab CI Pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полный CI/CD pipeline для GitLab с тестированием, сборкой и деплоем.',
      requirements: [
        'Создайте .gitlab-ci.yml с 4 stages: lint, test, build, deploy',
        'Настройте кэширование зависимостей',
        'Добавьте service container PostgreSQL для тестов',
        'Настройте сборку Docker-образа с push в GitLab Registry',
        'Добавьте deploy в staging (автоматический) и production (ручной)',
        'Используйте rules вместо only/except'
      ],
      hint: 'services: - postgres:16. cache: paths: - .cache/pip. rules: - if: $CI_COMMIT_BRANCH == "main". when: manual для production.',
      expectedOutput: 'Pipeline: lint -> test -> build -> deploy\nКэш ускоряет повторные запуски\nPostgreSQL доступен на хосте postgres:5432\nОбраз пушится в $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\nStaging: автоматический при push в develop\nProduction: ручной при push в main',
      solution: '# .gitlab-ci.yml\n# stages:\n#   - lint\n#   - test\n#   - build\n#   - deploy\n#\n# variables:\n#   PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"\n#\n# cache:\n#   key: ${CI_COMMIT_REF_SLUG}\n#   paths:\n#     - .cache/pip\n#\n# lint:\n#   stage: lint\n#   image: python:3.11-slim\n#   script:\n#     - pip install ruff\n#     - ruff check .\n#\n# test:\n#   stage: test\n#   image: python:3.11-slim\n#   services:\n#     - postgres:16\n#   variables:\n#     POSTGRES_DB: test_db\n#     POSTGRES_PASSWORD: test\n#     DATABASE_URL: postgresql://postgres:test@postgres:5432/test_db\n#   script:\n#     - pip install -r requirements.txt -r requirements-dev.txt\n#     - pytest tests/ -v --junitxml=report.xml\n#   artifacts:\n#     reports:\n#       junit: report.xml\n#\n# build:\n#   stage: build\n#   image: docker:24\n#   services:\n#     - docker:24-dind\n#   before_script:\n#     - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY\n#   script:\n#     - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .\n#     - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n#   rules:\n#     - if: $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_BRANCH == "develop"\n#\n# deploy-staging:\n#   stage: deploy\n#   script:\n#     - echo "Deploy to staging"\n#   environment:\n#     name: staging\n#     url: https://staging.example.com\n#   rules:\n#     - if: $CI_COMMIT_BRANCH == "develop"\n#\n# deploy-production:\n#   stage: deploy\n#   script:\n#     - echo "Deploy to production"\n#   environment:\n#     name: production\n#     url: https://app.example.com\n#   rules:\n#     - if: $CI_COMMIT_BRANCH == "main"\n#       when: manual',
      explanation: 'GitLab CI выполняет stages последовательно, jobs внутри stage — параллельно. cache сохраняет зависимости между запусками. services запускают контейнеры для интеграционных тестов. artifacts передают файлы между jobs. rules определяют условия запуска каждого job.'
    }
  ]
}
