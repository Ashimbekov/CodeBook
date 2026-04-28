export default {
  id: 14,
  title: 'CI/CD: Jenkins',
  description: 'Jenkins: установка, Pipeline as Code, Jenkinsfile, плагины, агенты и интеграция с Docker.',
  lessons: [
    {
      id: 1,
      title: 'Основы Jenkins',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jenkins — самая популярная open-source система CI/CD. Она расширяемая через плагины (1800+), поддерживает любые языки и инструменты. Jenkins используется в enterprise-среде и крупных проектах.' },
        { type: 'heading', value: 'Установка Jenkins' },
        { type: 'code', language: 'bash', value: '# Запуск через Docker (рекомендуется)\ndocker run -d \\\n  --name jenkins \\\n  -p 8080:8080 \\\n  -p 50000:50000 \\\n  -v jenkins_home:/var/jenkins_home \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  jenkins/jenkins:lts\n\n# Получить начальный пароль\ndocker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword\n\n# Или установка на Ubuntu:\nwget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo apt-key add -\nsudo sh -c \'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list\'\nsudo apt update && sudo apt install jenkins\nsudo systemctl start jenkins' },
        { type: 'heading', value: 'Ключевые концепции' },
        { type: 'list', value: [
          'Pipeline — последовательность этапов сборки, тестирования и деплоя',
          'Jenkinsfile — Pipeline as Code (в репозитории)',
          'Stage — этап pipeline (Build, Test, Deploy)',
          'Step — отдельная команда внутри stage',
          'Agent — машина для выполнения pipeline (master, nodes)',
          'Plugin — расширение функциональности Jenkins'
        ] },
        { type: 'tip', value: 'Всегда используй Pipeline as Code (Jenkinsfile в репозитории), а не настройку через UI. Это позволяет версионировать pipeline, делать код-ревью и откатывать изменения.' }
      ]
    },
    {
      id: 2,
      title: 'Jenkinsfile: Declarative Pipeline',
      type: 'theory',
      content: [
        { type: 'text', value: 'Declarative Pipeline — рекомендуемый синтаксис Jenkinsfile. Он структурирован, читаем и поддерживает большинство use-cases. Файл Jenkinsfile размещается в корне репозитория.' },
        { type: 'heading', value: 'Структура Declarative Pipeline' },
        { type: 'code', language: 'groovy', value: '// Jenkinsfile\npipeline {\n    agent any\n\n    environment {\n        DOCKER_IMAGE = "myapp"\n        REGISTRY = "registry.company.com"\n    }\n\n    options {\n        timeout(time: 30, unit: \'MINUTES\')\n        disableConcurrentBuilds()\n        buildDiscarder(logRotator(numToKeepStr: \'10\'))\n    }\n\n    stages {\n        stage(\'Checkout\') {\n            steps {\n                checkout scm\n            }\n        }\n\n        stage(\'Lint\') {\n            steps {\n                sh \'pip install ruff && ruff check .\'\n            }\n        }\n\n        stage(\'Test\') {\n            steps {\n                sh \'pip install -r requirements.txt\'\n                sh \'pytest tests/ -v --junitxml=report.xml\'\n            }\n            post {\n                always {\n                    junit \'report.xml\'\n                }\n            }\n        }\n\n        stage(\'Build Docker\') {\n            steps {\n                sh "docker build -t ${REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER} ."\n            }\n        }\n\n        stage(\'Deploy\') {\n            when {\n                branch \'main\'\n            }\n            steps {\n                sh "docker push ${REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"\n                sh "kubectl set image deployment/myapp app=${REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"\n            }\n        }\n    }\n\n    post {\n        success {\n            echo \'Pipeline succeeded!\'\n        }\n        failure {\n            echo \'Pipeline failed!\'\n        }\n        always {\n            cleanWs()\n        }\n    }\n}' },
        { type: 'note', value: 'post блок выполняется после pipeline: always (всегда), success (при успехе), failure (при ошибке), unstable (нестабильно), changed (статус изменился). Используй always для очистки.' }
      ]
    },
    {
      id: 3,
      title: 'Агенты и параллельное выполнение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jenkins Agent (ранее Slave) — машина для выполнения jobs. Master координирует, агенты выполняют. Разные агенты для разных задач: Docker-сборка, тестирование, деплой.' },
        { type: 'heading', value: 'Типы агентов' },
        { type: 'code', language: 'groovy', value: 'pipeline {\n    // Запустить на любом доступном агенте\n    agent any\n\n    // Запустить на агенте с конкретным label\n    // agent { label \'linux && docker\' }\n\n    // Запустить в Docker-контейнере\n    // agent {\n    //     docker {\n    //         image \'python:3.11-slim\'\n    //         args \'-v /tmp:/tmp\'\n    //     }\n    // }\n\n    stages {\n        stage(\'Build\') {\n            agent {\n                docker { image \'node:20\' }\n            }\n            steps {\n                sh \'npm ci && npm run build\'\n            }\n        }\n\n        stage(\'Test\') {\n            agent {\n                docker { image \'python:3.11\' }\n            }\n            steps {\n                sh \'pip install -r requirements.txt && pytest\'\n            }\n        }\n    }\n}' },
        { type: 'heading', value: 'Параллельное выполнение' },
        { type: 'code', language: 'groovy', value: 'pipeline {\n    agent any\n    stages {\n        stage(\'Tests\') {\n            parallel {\n                stage(\'Unit Tests\') {\n                    steps {\n                        sh \'pytest tests/unit/\'\n                    }\n                }\n                stage(\'Integration Tests\') {\n                    steps {\n                        sh \'pytest tests/integration/\'\n                    }\n                }\n                stage(\'E2E Tests\') {\n                    steps {\n                        sh \'cypress run\'\n                    }\n                }\n            }\n        }\n    }\n}' },
        { type: 'tip', value: 'parallel значительно ускоряет pipeline. Запускай независимые тесты параллельно. Docker-агенты обеспечивают чистое окружение для каждого stage — нет конфликтов зависимостей.' }
      ]
    },
    {
      id: 4,
      title: 'Параметры, credentials и условия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jenkins поддерживает параметризованные pipeline (пользователь выбирает параметры), credentials для секретов, условия (when) для ветвления логики.' },
        { type: 'heading', value: 'Параметры Pipeline' },
        { type: 'code', language: 'groovy', value: 'pipeline {\n    agent any\n\n    parameters {\n        choice(name: \'ENVIRONMENT\', choices: [\'staging\', \'production\'], description: \'Окружение для деплоя\')\n        string(name: \'VERSION\', defaultValue: \'latest\', description: \'Версия образа\')\n        booleanParam(name: \'SKIP_TESTS\', defaultValue: false, description: \'Пропустить тесты\')\n    }\n\n    stages {\n        stage(\'Test\') {\n            when {\n                expression { !params.SKIP_TESTS }\n            }\n            steps {\n                sh \'pytest tests/\'\n            }\n        }\n\n        stage(\'Deploy\') {\n            steps {\n                echo "Deploying ${params.VERSION} to ${params.ENVIRONMENT}"\n            }\n        }\n    }\n}' },
        { type: 'heading', value: 'Credentials' },
        { type: 'code', language: 'groovy', value: 'pipeline {\n    agent any\n\n    stages {\n        stage(\'Deploy\') {\n            steps {\n                // Username/Password\n                withCredentials([usernamePassword(\n                    credentialsId: \'docker-hub\',\n                    usernameVariable: \'DOCKER_USER\',\n                    passwordVariable: \'DOCKER_PASS\'\n                )]) {\n                    sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"\n                    sh "docker push myapp:latest"\n                }\n\n                // Secret text\n                withCredentials([string(\n                    credentialsId: \'slack-webhook\',\n                    variable: \'SLACK_URL\'\n                )]) {\n                    sh "curl -X POST $SLACK_URL -d \'{\\"text\\": \\"Deploy complete\\"}\'"\n                }\n\n                // SSH key\n                withCredentials([sshUserPrivateKey(\n                    credentialsId: \'server-ssh\',\n                    keyFileVariable: \'SSH_KEY\'\n                )]) {\n                    sh "ssh -i $SSH_KEY deploy@server \\"docker pull myapp:latest\\""\n                }\n            }\n        }\n    }\n}' },
        { type: 'warning', value: 'Credentials в Jenkins зашифрованы и не отображаются в логах. Но будьте осторожны с echo и env: не выводите секреты в лог. Jenkins маскирует их автоматически только в withCredentials блоке.' }
      ]
    },
    {
      id: 5,
      title: 'Shared Libraries и best practices',
      type: 'theory',
      content: [
        { type: 'text', value: 'Shared Libraries позволяют переиспользовать код между pipeline разных проектов. Это DRY-принцип для CI/CD: общие функции деплоя, нотификации, сканирования выносятся в библиотеку.' },
        { type: 'heading', value: 'Shared Library' },
        { type: 'code', language: 'groovy', value: '// vars/deploy.groovy — в репозитории shared library\ndef call(Map config) {\n    pipeline {\n        agent any\n        stages {\n            stage(\'Build\') {\n                steps {\n                    sh "docker build -t ${config.image}:${BUILD_NUMBER} ."\n                }\n            }\n            stage(\'Deploy\') {\n                steps {\n                    sh "kubectl set image deployment/${config.deployment} app=${config.image}:${BUILD_NUMBER}"\n                }\n            }\n        }\n    }\n}\n\n// Jenkinsfile в проекте:\n@Library(\'my-shared-lib\') _\n\ndeploy(\n    image: \'registry.company.com/myapp\',\n    deployment: \'myapp\'\n)' },
        { type: 'heading', value: 'Best Practices' },
        { type: 'code', language: 'groovy', value: '// 1. Всегда используй timeout\npipeline {\n    options {\n        timeout(time: 30, unit: \'MINUTES\')\n    }\n}\n\n// 2. Очищай workspace\npost {\n    always {\n        cleanWs()\n    }\n}\n\n// 3. Используй Docker для изоляции\nagent {\n    docker { image \'python:3.11-slim\' }\n}\n\n// 4. Не хардкодь версии — используй переменные\nenvironment {\n    APP_VERSION = sh(script: \'git describe --tags\', returnStdout: true).trim()\n}\n\n// 5. Отправляй уведомления\npost {\n    failure {\n        slackSend(channel: \'#devops\', message: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}")\n    }\n}' },
        { type: 'tip', value: 'Shared Libraries — мощный инструмент для стандартизации CI/CD в организации. Все проекты используют одни и те же проверенные шаги деплоя. Изменение библиотеки обновляет все pipeline.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Jenkins Pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Jenkinsfile с полным CI/CD pipeline: тестирование, Docker-сборка, деплой.',
      requirements: [
        'Создайте Declarative Jenkinsfile с stages: Lint, Test, Build, Deploy',
        'Используйте Docker-агент для stages',
        'Добавьте параллельное выполнение unit и integration тестов',
        'Добавьте параметр ENVIRONMENT (staging/production)',
        'Используйте credentials для Docker Registry',
        'Добавьте post-блок с уведомлениями и очисткой'
      ],
      hint: 'agent { docker { image ... } }. parallel { stage(...) {} }. parameters { choice(...) }. withCredentials([...]).',
      expectedOutput: 'Jenkinsfile создан с 4 stages\nDocker агенты для каждого stage\nUnit и integration тесты параллельно\nПараметр ENVIRONMENT доступен при запуске\nCredentials используются для docker login\nPost: уведомление при ошибке, cleanWs() всегда',
      solution: '// Jenkinsfile\n// pipeline {\n//     agent none\n//\n//     parameters {\n//         choice(name: \'ENVIRONMENT\', choices: [\'staging\', \'production\'])\n//         string(name: \'VERSION\', defaultValue: \'latest\')\n//     }\n//\n//     environment {\n//         REGISTRY = "registry.company.com"\n//         IMAGE = "myapp"\n//     }\n//\n//     options {\n//         timeout(time: 30, unit: \'MINUTES\')\n//         disableConcurrentBuilds()\n//     }\n//\n//     stages {\n//         stage(\'Lint\') {\n//             agent { docker { image \'python:3.11-slim\' } }\n//             steps {\n//                 sh \'pip install ruff && ruff check .\'\n//             }\n//         }\n//\n//         stage(\'Test\') {\n//             parallel {\n//                 stage(\'Unit\') {\n//                     agent { docker { image \'python:3.11-slim\' } }\n//                     steps {\n//                         sh \'pip install -r requirements.txt && pytest tests/unit/\'\n//                     }\n//                 }\n//                 stage(\'Integration\') {\n//                     agent { docker { image \'python:3.11-slim\' } }\n//                     steps {\n//                         sh \'pip install -r requirements.txt && pytest tests/integration/\'\n//                     }\n//                 }\n//             }\n//         }\n//\n//         stage(\'Build\') {\n//             agent any\n//             steps {\n//                 withCredentials([usernamePassword(credentialsId: \'docker-registry\', usernameVariable: \'USER\', passwordVariable: \'PASS\')]) {\n//                     sh "docker login -u $USER -p $PASS $REGISTRY"\n//                     sh "docker build -t $REGISTRY/$IMAGE:${BUILD_NUMBER} ."\n//                     sh "docker push $REGISTRY/$IMAGE:${BUILD_NUMBER}"\n//                 }\n//             }\n//         }\n//\n//         stage(\'Deploy\') {\n//             agent any\n//             when { branch \'main\' }\n//             steps {\n//                 echo "Deploying to ${params.ENVIRONMENT}"\n//                 sh "kubectl set image deployment/myapp app=$REGISTRY/$IMAGE:${BUILD_NUMBER}"\n//             }\n//         }\n//     }\n//\n//     post {\n//         failure {\n//             echo "Pipeline FAILED"\n//         }\n//         always {\n//             cleanWs()\n//         }\n//     }\n// }',
      explanation: 'Declarative Pipeline структурирует CI/CD в читаемую форму. agent none на уровне pipeline, agent на уровне stage — разные окружения для разных задач. parallel ускоряет тестирование. when { branch } ограничивает деплой. withCredentials безопасно передаёт секреты.'
    }
  ]
}
