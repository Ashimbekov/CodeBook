export default {
  id: 7,
  title: 'GitLab CI: stages, jobs и artifacts',
  description: 'Продвинутые возможности GitLab CI: artifacts, needs, include, environments, динамические пайплайны.',
  lessons: [
    {
      id: 1,
      title: 'Artifacts — передача файлов между jobs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Artifacts в GitLab CI сохраняют файлы после выполнения job. Другие jobs в последующих стадиях автоматически скачивают artifacts предыдущих jobs.' },
        { type: 'code', language: 'yaml', value: 'build:\n  stage: build\n  script:\n    - python setup.py bdist_wheel\n    - docker build -t myapp:$CI_COMMIT_SHORT_SHA .\n  artifacts:\n    paths:\n      - dist/*.whl       # сохранить wheel файлы\n      - docker-image.tar\n    expire_in: 1 week    # автоудаление через неделю\n    name: "build-$CI_COMMIT_SHORT_SHA"\n\ntest:\n  stage: test\n  script:\n    - pip install dist/*.whl  # используем artifacts из build\n    - pytest\n  artifacts:\n    reports:\n      junit: test-results.xml  # специальный тип: GitLab показывает результаты тестов\n      coverage_report:\n        coverage_format: cobertura\n        path: coverage.xml\n    when: always  # сохранять даже при падении тестов' },
        { type: 'tip', value: 'reports: junit — GitLab автоматически отображает результаты тестов прямо в интерфейсе merge request! Не нужно открывать логи чтобы увидеть какие тесты упали.' }
      ]
    },
    {
      id: 2,
      title: 'needs — DAG пайплайны',
      type: 'theory',
      content: [
        { type: 'text', value: 'needs позволяет строить пайплайн как граф зависимостей (DAG) вместо последовательных стадий. Job может начаться как только завершились зависимые jobs — даже из разных стадий.' },
        { type: 'code', language: 'yaml', value: 'stages:\n  - build\n  - test\n  - deploy\n\nbuild-backend:\n  stage: build\n  script: docker build -t backend .\n\nbuild-frontend:\n  stage: build\n  script: npm run build\n\ntest-backend:\n  stage: test\n  needs: [build-backend]  # ждёт только backend, не frontend!\n  script: pytest\n\ntest-frontend:\n  stage: test\n  needs: [build-frontend]  # ждёт только frontend\n  script: npm test\n\ndeploy:\n  stage: deploy\n  needs: [test-backend, test-frontend]  # ждёт оба теста\n  script: kubectl apply -f k8s/' },
        { type: 'note', value: 'С needs backend тесты запустятся как только backend собрался, не дожидаясь сборки frontend. Это может значительно сократить общее время пайплайна.' }
      ]
    },
    {
      id: 3,
      title: 'Environments и deployments',
      type: 'theory',
      content: [
        { type: 'text', value: 'environment в GitLab CI связывает job с окружением деплоя. GitLab отслеживает историю деплоев и позволяет откатиться назад.' },
        { type: 'code', language: 'yaml', value: 'deploy-staging:\n  stage: deploy\n  script: bash deploy.sh staging\n  environment:\n    name: staging\n    url: https://staging.example.com\n    on_stop: stop-staging  # job для остановки окружения\n\nstop-staging:\n  stage: deploy\n  script: bash destroy.sh staging\n  when: manual\n  environment:\n    name: staging\n    action: stop\n\ndeploy-production:\n  stage: deploy\n  script: bash deploy.sh production\n  environment:\n    name: production\n    url: https://example.com\n  rules:\n    - if: $CI_COMMIT_TAG\n      when: manual  # только при теге и вручную' },
        { type: 'tip', value: 'Review apps в GitLab: создавай уникальное окружение для каждого merge request через environment: name: review/$CI_COMMIT_REF_NAME. Отличный способ тестировать фичи изолированно.' }
      ]
    },
    {
      id: 4,
      title: 'include — модульные пайплайны',
      type: 'theory',
      content: [
        { type: 'text', value: 'include позволяет разбить конфигурацию пайплайна на несколько файлов и переиспользовать шаблоны.' },
        { type: 'code', language: 'yaml', value: '# .gitlab-ci.yml (главный файл)\ninclude:\n  # Локальный файл\n  - local: ".gitlab/ci/test.yml"\n  # Из другого проекта\n  - project: "mygroup/ci-templates"\n    ref: main\n    file: "/templates/django.yml"\n  # По URL\n  - remote: "https://gitlab.com/gitlab-org/gitlab/-/raw/master/lib/gitlab/ci/templates/Python.gitlab-ci.yml"\n  # Встроенные шаблоны GitLab\n  - template: "Docker.gitlab-ci.yml"\n  - template: "Security/SAST.gitlab-ci.yml"\n\nstages:\n  - test\n  - build\n  - security\n  - deploy' }
      ]
    },
    {
      id: 5,
      title: 'Динамические пайплайны с trigger',
      type: 'theory',
      content: [
        { type: 'text', value: 'trigger позволяет запустить пайплайн другого проекта или создать дочерний пайплайн динамически.' },
        { type: 'code', language: 'yaml', value: '# Запуск пайплайна другого проекта (multi-project pipeline)\ntrigger-backend:\n  stage: deploy\n  trigger:\n    project: mygroup/backend-service\n    branch: main\n    strategy: depend  # ждать завершения дочернего пайплайна\n\n# Дочерний пайплайн из файла\ngenerate-pipeline:\n  stage: build\n  script:\n    - python generate_ci.py > child-pipeline.yml\n  artifacts:\n    paths:\n      - child-pipeline.yml\n\ntrigger-child:\n  stage: test\n  trigger:\n    include:\n      - artifact: child-pipeline.yml\n        job: generate-pipeline\n    strategy: depend' }
      ]
    },
    {
      id: 6,
      title: 'before_script, after_script, interruptible',
      type: 'theory',
      content: [
        { type: 'text', value: 'before_script выполняется перед script каждого job. after_script — после (всегда, даже при ошибке). interruptible — можно ли прервать job.' },
        { type: 'code', language: 'yaml', value: 'default:\n  before_script:\n    - echo "Начало job: $CI_JOB_NAME"\n  after_script:\n    - echo "Конец job: $CI_JOB_STATUS"  # success или failed\n\ntest:\n  stage: test\n  interruptible: true  # можно прервать при новом коммите\n  before_script:\n    - pip install -r requirements.txt  # переопределяет default\n  script:\n    - pytest\n  after_script:\n    - coverage report  # выполняется даже если pytest упал\n\ndeploy:\n  interruptible: false  # нельзя прервать деплой\n  script: bash deploy.sh' },
        { type: 'tip', value: 'interruptible: true на test jobs — если пришёл новый коммит, GitLab может отменить устаревший пайплайн. Это экономит runner минуты.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полный GitLab CI пайплайн',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай полный .gitlab-ci.yml с artifacts, needs, environments и динамическими правилами.',
      requirements: [
        'Стадии: test, build, deploy',
        'test и lint выполняются параллельно',
        'build зависит от test (needs), создаёт docker image как artifact',
        'deploy-staging автоматически при push в develop',
        'deploy-production вручную при push в main с environment url',
        'JUnit artifacts для отображения результатов тестов в GitLab'
      ],
      expectedOutput: 'MR в GitLab: результаты тестов видны прямо в интерфейсе\ngit push develop -> test + lint -> build -> автоматический деплой на staging\ngit push main -> test + lint -> build -> кнопка Deploy production',
      hint: 'artifacts: reports: junit: задаёт специальный формат для GitLab. needs: [test] в build job.',
      solution: '# .gitlab-ci.yml\nstages:\n  - test\n  - build\n  - deploy\n\nvariables:\n  IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA\n\n.python:\n  image: python:3.12-slim\n  before_script:\n    - pip install -r requirements.txt\n\ntest:\n  extends: .python\n  stage: test\n  script:\n    - pytest --junitxml=junit.xml --cov=. --cov-report=xml\n  artifacts:\n    when: always\n    reports:\n      junit: junit.xml\n      coverage_report:\n        coverage_format: cobertura\n        path: coverage.xml\n\nlint:\n  extends: .python\n  stage: test\n  script:\n    - pip install flake8 && flake8 .\n\nbuild:\n  stage: build\n  needs: [test]\n  image: docker:24\n  services: [docker:24-dind]\n  script:\n    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY\n    - docker build -t $IMAGE .\n    - docker push $IMAGE\n\ndeploy-staging:\n  stage: deploy\n  needs: [build]\n  script: echo "Деплой $IMAGE на staging"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "develop"\n  environment:\n    name: staging\n    url: https://staging.example.com\n\ndeploy-production:\n  stage: deploy\n  needs: [build]\n  script: echo "Деплой $IMAGE на production"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual\n  environment:\n    name: production\n    url: https://example.com',
      explanation: 'CI_REGISTRY_IMAGE — встроенная переменная, путь к Container Registry проекта. docker:dind (docker in docker) сервис нужен для сборки образов внутри CI. needs: [test] для build — пропускает lint, если только тесты прошли, build может начаться раньше.'
    }
  ]
}
