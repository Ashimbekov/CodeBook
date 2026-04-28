export default {
  id: 13,
  title: 'GCP Cloud Functions и Cloud Run',
  description: 'Serverless в GCP: Cloud Functions (event-driven), Cloud Run (контейнеры), сравнение, масштабирование до нуля.',
  lessons: [
    {
      id: 1,
      title: 'Cloud Functions: serverless функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud Functions — serverless платформа GCP для выполнения кода в ответ на события (аналог AWS Lambda). Поддерживает Node.js, Python, Go, Java, .NET, Ruby, PHP. Масштабируется до нуля.' },
        { type: 'code', language: 'python', value: '# main.py — Cloud Function (Python)\nimport functions_framework\nfrom google.cloud import storage\nimport json\n\n@functions_framework.http\ndef hello_http(request):\n    """HTTP Cloud Function."""\n    name = request.args.get("name", "World")\n    return json.dumps({"message": f"Hello, {name}!"}), 200, \\\n        {"Content-Type": "application/json"}\n\n@functions_framework.cloud_event\ndef process_gcs(cloud_event):\n    """Triggered by Cloud Storage event."""\n    data = cloud_event.data\n    bucket = data["bucket"]\n    name = data["name"]\n    print(f"Файл загружен: gs://{bucket}/{name}")\n    \n    # Обработка файла\n    client = storage.Client()\n    blob = client.bucket(bucket).blob(name)\n    content = blob.download_as_bytes()\n    print(f"Размер: {len(content)} bytes")' },
        { type: 'code', language: 'bash', value: '# Деплой HTTP функции:\ngcloud functions deploy hello \\\n  --gen2 \\\n  --runtime=python312 \\\n  --region=europe-west1 \\\n  --source=. \\\n  --entry-point=hello_http \\\n  --trigger-http \\\n  --allow-unauthenticated \\\n  --memory=256MB \\\n  --timeout=60s\n\n# URL: https://europe-west1-myproject.cloudfunctions.net/hello\n\n# Деплой функции с триггером на GCS:\ngcloud functions deploy process-file \\\n  --gen2 \\\n  --runtime=python312 \\\n  --region=europe-west1 \\\n  --source=. \\\n  --entry-point=process_gcs \\\n  --trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \\\n  --trigger-event-filters="bucket=my-bucket"\n\n# Вызов:\ncurl "https://europe-west1-myproject.cloudfunctions.net/hello?name=GCP"\n\n# Логи:\ngcloud functions logs read hello --gen2 --region=europe-west1' },
        { type: 'tip', value: 'Cloud Functions Gen2 построен на Cloud Run — быстрее, поддерживает concurrency (несколько запросов на одну инстанцию), до 60 минут timeout. Всегда используйте Gen2 для новых функций.' }
      ]
    },
    {
      id: 2,
      title: 'Cloud Run: serverless контейнеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud Run — serverless платформа для запуска контейнеров. Любой Docker контейнер, масштабирование от 0 до тысяч инстансов, оплата за время обработки запроса. Не привязан к конкретному runtime.' },
        { type: 'code', language: 'bash', value: '# Деплой из Dockerfile:\ngcloud run deploy my-api \\\n  --source=. \\\n  --region=europe-west1 \\\n  --allow-unauthenticated \\\n  --port=8080 \\\n  --memory=512Mi \\\n  --cpu=1 \\\n  --min-instances=0 \\\n  --max-instances=100 \\\n  --concurrency=80\n\n# Деплой из готового образа:\ngcloud run deploy my-api \\\n  --image=europe-west1-docker.pkg.dev/myproject/repo/api:v1 \\\n  --region=europe-west1\n\n# Environment Variables:\ngcloud run deploy my-api \\\n  --image=... \\\n  --set-env-vars=DB_HOST=10.0.0.1,NODE_ENV=production\n\n# Secrets из Secret Manager:\ngcloud run deploy my-api \\\n  --image=... \\\n  --set-secrets=DB_PASSWORD=db-password:latest\n\n# Custom domain:\ngcloud run domain-mappings create \\\n  --service=my-api \\\n  --domain=api.myapp.com \\\n  --region=europe-west1\n\n# URL: https://my-api-xxxx-ew.a.run.app' },
        { type: 'heading', value: 'Cloud Functions vs Cloud Run' },
        { type: 'list', value: [
          'Cloud Functions: проще деплой (только код), ограниченные runtime, event triggers. Для простых функций',
          'Cloud Run: любой контейнер, любой язык/фреймворк, concurrency, WebSocket. Для микросервисов',
          'Cloud Functions Gen2 = Cloud Run под капотом. Разница в developer experience',
          'Оба масштабируются до 0 (платите только за запросы)'
        ] },
        { type: 'tip', value: 'Cloud Run — универсальный выбор для serverless в GCP. Поддерживает gRPC, WebSocket, streaming, sidecar контейнеры. С --min-instances=1 можно убрать cold start для latency-sensitive сервисов.' }
      ]
    },
    {
      id: 3,
      title: 'Cloud Run: продвинутые возможности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud Run поддерживает traffic splitting для canary деплоя, Cloud SQL подключение через proxy, VPC connector для доступа к приватным ресурсам, и Cloud Run Jobs для batch задач.' },
        { type: 'code', language: 'bash', value: '# Traffic Splitting (canary deploy):\n# Отправить 10% трафика на новую ревизию:\ngcloud run services update-traffic my-api \\\n  --region=europe-west1 \\\n  --to-revisions=my-api-00002-abc=10,my-api-00001-xyz=90\n\n# Постепенно увеличить до 100%:\ngcloud run services update-traffic my-api \\\n  --region=europe-west1 \\\n  --to-latest\n\n# Cloud SQL подключение (автоматический proxy):\ngcloud run deploy my-api \\\n  --image=... \\\n  --add-cloudsql-instances=myproject:europe-west1:my-db \\\n  --set-env-vars=DB_HOST=/cloudsql/myproject:europe-west1:my-db\n\n# VPC Connector (доступ к приватной сети):\ngcloud compute networks vpc-access connectors create my-connector \\\n  --region=europe-west1 \\\n  --network=my-vpc \\\n  --range=10.8.0.0/28\n\ngcloud run deploy my-api \\\n  --image=... \\\n  --vpc-connector=my-connector\n\n# Cloud Run Jobs (batch задачи):\ngcloud run jobs create my-job \\\n  --image=... \\\n  --tasks=10 \\\n  --max-retries=3 \\\n  --parallelism=5\n\ngcloud run jobs execute my-job' },
        { type: 'note', value: 'Cloud Run Jobs — для задач без HTTP (ETL, миграции, обработка данных). Запускаются по расписанию (Cloud Scheduler), вручную или из CI/CD. Макс время: 24 часа. Параллельное выполнение нескольких задач.' }
      ]
    },
    {
      id: 4,
      title: 'Cloud Scheduler и Pub/Sub',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud Scheduler — управляемый cron в облаке. Pub/Sub — сервис обмена сообщениями для асинхронной обработки и событийной архитектуры. Оба интегрируются с Cloud Functions и Cloud Run.' },
        { type: 'code', language: 'bash', value: '# Cloud Scheduler — cron job:\ngcloud scheduler jobs create http my-cron \\\n  --location=europe-west1 \\\n  --schedule="0 */6 * * *" \\\n  --uri="https://my-api-xxx.a.run.app/cleanup" \\\n  --http-method=POST \\\n  --oidc-service-account-email=scheduler@myproject.iam.gserviceaccount.com\n\n# Pub/Sub — создание topic и subscription:\ngcloud pubsub topics create orders\ngcloud pubsub subscriptions create orders-sub \\\n  --topic=orders \\\n  --push-endpoint=https://my-api-xxx.a.run.app/process-order \\\n  --ack-deadline=60\n\n# Публикация сообщения:\ngcloud pubsub topics publish orders \\\n  --message=\'{"orderId": "123", "amount": 99.99}\'\n\n# Cloud Function с триггером Pub/Sub:\ngcloud functions deploy process-order \\\n  --gen2 \\\n  --runtime=python312 \\\n  --trigger-topic=orders \\\n  --region=europe-west1' },
        { type: 'code', language: 'python', value: '# Cloud Function обработчик Pub/Sub:\nimport functions_framework\nimport base64\nimport json\n\n@functions_framework.cloud_event\ndef process_order(cloud_event):\n    # Декодировать сообщение\n    data = base64.b64decode(cloud_event.data["message"]["data"]).decode()\n    order = json.loads(data)\n    \n    print(f"Обработка заказа: {order[\'orderId\']}")\n    print(f"Сумма: {order[\'amount\']}")\n    \n    # Бизнес-логика обработки заказа...\n    return "OK"' },
        { type: 'tip', value: 'Pub/Sub обеспечивает at-least-once доставку — сообщение может быть доставлено повторно. Делайте обработчики идемпотентными (повторный вызов с тем же сообщением даёт тот же результат).' }
      ]
    },
    {
      id: 5,
      title: 'Cloud Build и CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud Build — serverless CI/CD платформа. Собирает Docker образы, запускает тесты, деплоит в Cloud Run/GKE. Интегрируется с GitHub, GitLab, Cloud Source Repositories.' },
        { type: 'code', language: 'yaml', value: '# cloudbuild.yaml\nsteps:\n  # Шаг 1: запуск тестов\n  - name: "python:3.12"\n    entrypoint: "bash"\n    args:\n      - "-c"\n      - |\n        pip install -r requirements.txt\n        python -m pytest tests/ -v\n\n  # Шаг 2: сборка Docker образа\n  - name: "gcr.io/cloud-builders/docker"\n    args:\n      - "build"\n      - "-t"\n      - "europe-west1-docker.pkg.dev/$PROJECT_ID/my-repo/api:$SHORT_SHA"\n      - "."\n\n  # Шаг 3: push в Artifact Registry\n  - name: "gcr.io/cloud-builders/docker"\n    args:\n      - "push"\n      - "europe-west1-docker.pkg.dev/$PROJECT_ID/my-repo/api:$SHORT_SHA"\n\n  # Шаг 4: деплой в Cloud Run\n  - name: "gcr.io/cloud-builders/gcloud"\n    args:\n      - "run"\n      - "deploy"\n      - "my-api"\n      - "--image=europe-west1-docker.pkg.dev/$PROJECT_ID/my-repo/api:$SHORT_SHA"\n      - "--region=europe-west1"\n      - "--allow-unauthenticated"\n\nimages:\n  - "europe-west1-docker.pkg.dev/$PROJECT_ID/my-repo/api:$SHORT_SHA"' },
        { type: 'code', language: 'bash', value: '# Создать trigger на push в main:\ngcloud builds triggers create github \\\n  --repo-name=my-repo \\\n  --repo-owner=myuser \\\n  --branch-pattern="^main$" \\\n  --build-config=cloudbuild.yaml\n\n# Ручной запуск сборки:\ngcloud builds submit --config=cloudbuild.yaml .\n\n# Список сборок:\ngcloud builds list --limit=5\n\n# Логи сборки:\ngcloud builds log BUILD_ID' },
        { type: 'note', value: 'Cloud Build бесплатно 120 минут/день сборки. Используйте kaniko вместо Docker-in-Docker для ускорения сборки образов (кэширование слоёв). Cloud Deploy добавляет promotion pipeline: dev → staging → prod с approval.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Serverless API на Cloud Run',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте serverless API на Cloud Run с Cloud Build pipeline.',
      requirements: [
        'Создайте простое веб-приложение в Docker контейнере',
        'Задеплойте в Cloud Run через gcloud run deploy --source',
        'Настройте Cloud Scheduler для вызова API каждый час',
        'Настройте traffic splitting: 90% на текущую версию, 10% на новую',
        'Создайте Cloud Function с триггером на Pub/Sub topic',
        'Настройте Cloud Build для автоматического деплоя'
      ],
      hint: 'gcloud run deploy --source автоматически собирает Dockerfile. Для traffic splitting используйте gcloud run services update-traffic. Cloud Scheduler использует --schedule в cron формате.',
      expectedOutput: 'Cloud Run сервис my-api задеплоен: https://my-api-xxx.a.run.app\nCloud Scheduler job создан (каждый час).\nTraffic: 90% v1, 10% v2.\nCloud Function обрабатывает Pub/Sub сообщения.\nCloud Build trigger настроен на push в main.',
      solution: '# Cloud Run\nmkdir my-api && cd my-api\ncat > main.py << \'EOF\'\nfrom flask import Flask\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return {"status": "ok", "version": "v1"}\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=8080)\nEOF\n\ncat > Dockerfile << \'EOF\'\nFROM python:3.12-slim\nWORKDIR /app\nRUN pip install flask gunicorn\nCOPY . .\nCMD ["gunicorn", "--bind", ":8080", "main:app"]\nEOF\n\ngcloud run deploy my-api --source=. --region=europe-west1 --allow-unauthenticated\n\n# Scheduler\ngcloud scheduler jobs create http hourly-check \\\n  --location=europe-west1 --schedule="0 * * * *" \\\n  --uri="https://my-api-xxx.a.run.app/" --http-method=GET\n\n# Traffic split (после деплоя v2)\ngcloud run services update-traffic my-api --region=europe-west1 \\\n  --to-revisions=LATEST=10\n\n# Pub/Sub + Cloud Function\ngcloud pubsub topics create events\ngcloud functions deploy handler --gen2 --runtime=python312 \\\n  --trigger-topic=events --region=europe-west1 --source=.\n\n# Cloud Build\ngcloud builds triggers create github --repo-name=my-api \\\n  --repo-owner=myuser --branch-pattern="^main$" --build-config=cloudbuild.yaml',
      explanation: 'Cloud Run + Cloud Build — мощная serverless платформа. Cloud Run запускает любой контейнер без управления серверами. Cloud Build автоматизирует CI/CD. Traffic splitting позволяет безопасно выкатывать новые версии.'
    }
  ]
}
