export default {
  id: 18,
  title: 'Azure Functions и Container Apps',
  description: 'Serverless в Azure: Azure Functions, bindings/triggers, Durable Functions. Azure Container Apps с KEDA автомасштабированием.',
  lessons: [
    {
      id: 1,
      title: 'Azure Functions: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure Functions — serverless платформа для event-driven вычислений (аналог AWS Lambda). Уникальная особенность: bindings (привязки) автоматически подключают входные и выходные данные без написания boilerplate кода.' },
        { type: 'code', language: 'python', value: '# function_app.py — Azure Functions (Python v2)\nimport azure.functions as func\nimport json\nimport logging\n\napp = func.FunctionApp()\n\n# HTTP trigger\n@app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)\ndef hello(req: func.HttpRequest) -> func.HttpResponse:\n    name = req.params.get("name", "World")\n    return func.HttpResponse(\n        json.dumps({"message": f"Hello, {name}!"}),\n        mimetype="application/json"\n    )\n\n# Timer trigger (cron)\n@app.schedule(\n    schedule="0 */5 * * * *",  # каждые 5 минут\n    arg_name="timer",\n    run_on_startup=False\n)\ndef cleanup_timer(timer: func.TimerRequest) -> None:\n    logging.info("Running cleanup task...")\n\n# Blob trigger — реакция на загрузку файла\n@app.blob_trigger(\n    arg_name="blob",\n    path="uploads/{name}",\n    connection="AzureWebJobsStorage"\n)\ndef process_blob(blob: func.InputStream) -> None:\n    logging.info(f"Blob trigger: {blob.name}, Size: {blob.length} bytes")\n    content = blob.read()' },
        { type: 'code', language: 'bash', value: '# Установка Azure Functions Core Tools:\nnpm install -g azure-functions-core-tools@4\n\n# Создание проекта:\nfunc init MyFunctionApp --python\ncd MyFunctionApp\nfunc new --name hello --template "HTTP trigger"\n\n# Локальный запуск:\nfunc start\n# http://localhost:7071/api/hello\n\n# Деплой:\naz functionapp create \\\n  --resource-group myapp-prod-rg \\\n  --consumption-plan-location westeurope \\\n  --runtime python \\\n  --runtime-version 3.12 \\\n  --functions-version 4 \\\n  --name myfunc-unique-name \\\n  --storage-account myfuncstorage\n\nfunc azure functionapp publish myfunc-unique-name' },
        { type: 'tip', value: 'Consumption Plan (serverless): оплата за выполнение ($0.20/млн вызовов). Premium Plan: предзагруженные инстансы (нет cold start), VNet integration. Dedicated Plan: App Service Plan (предсказуемая стоимость). Free Tier: 1 млн вызовов/мес.' }
      ]
    },
    {
      id: 2,
      title: 'Bindings и Durable Functions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bindings — декларативные привязки к Azure сервисам. Input binding читает данные, output binding записывает. Не нужен SDK код для взаимодействия с хранилищами. Durable Functions — расширение для stateful workflows.' },
        { type: 'code', language: 'python', value: '# Input/Output Bindings — чтение из Cosmos DB, запись в Queue\nimport azure.functions as func\nimport json\n\napp = func.FunctionApp()\n\n@app.route(route="orders/{id}")\n@app.cosmos_db_input(\n    arg_name="order",\n    database_name="mydb",\n    container_name="orders",\n    id="{id}",\n    partition_key="{id}",\n    connection="CosmosDBConnection"\n)\ndef get_order(req: func.HttpRequest, order: func.DocumentList) -> func.HttpResponse:\n    if not order:\n        return func.HttpResponse("Not found", status_code=404)\n    return func.HttpResponse(json.dumps(order[0].to_dict()), mimetype="application/json")\n\n@app.route(route="orders", methods=["POST"])\n@app.queue_output(\n    arg_name="msg",\n    queue_name="order-notifications",\n    connection="AzureWebJobsStorage"\n)\ndef create_order(req: func.HttpRequest, msg: func.Out[str]) -> func.HttpResponse:\n    order = req.get_json()\n    # Output binding автоматически отправит сообщение в Queue\n    msg.set(json.dumps({"orderId": order["id"], "action": "created"}))\n    return func.HttpResponse("Order created", status_code=201)' },
        { type: 'code', language: 'python', value: '# Durable Functions — orchestrator для workflow:\nimport azure.functions as func\nimport azure.durable_functions as df\n\napp = func.FunctionApp()\n\n# Orchestrator — определяет workflow\n@app.orchestration_trigger(context_name="context")\ndef order_workflow(context: df.DurableOrchestrationContext):\n    order = context.get_input()\n    \n    # Последовательные шаги:\n    validated = yield context.call_activity("validate_order", order)\n    payment = yield context.call_activity("process_payment", validated)\n    yield context.call_activity("send_confirmation", payment)\n    \n    return "Order completed"\n\n# Activity функции (шаги):\n@app.activity_trigger(input_name="order")\ndef validate_order(order: dict) -> dict:\n    # Валидация заказа...\n    return {**order, "validated": True}\n\n@app.activity_trigger(input_name="order")\ndef process_payment(order: dict) -> dict:\n    # Обработка оплаты...\n    return {**order, "paid": True}' },
        { type: 'note', value: 'Durable Functions сохраняют состояние в Azure Storage. Workflow продолжится даже после перезапуска функции. Поддерживают паттерны: chaining, fan-out/fan-in, human interaction (ожидание внешнего события), monitoring.' }
      ]
    },
    {
      id: 3,
      title: 'Azure Container Apps',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure Container Apps — serverless платформа для контейнеров (аналог Cloud Run). Построена на Kubernetes (KEDA + Envoy), но полностью скрывает сложность. Масштабирование до нуля, Dapr интеграция.' },
        { type: 'code', language: 'bash', value: '# Создание Container Apps Environment:\naz containerapp env create \\\n  --name my-environment \\\n  --resource-group myapp-prod-rg \\\n  --location westeurope\n\n# Деплой приложения:\naz containerapp create \\\n  --name my-api \\\n  --resource-group myapp-prod-rg \\\n  --environment my-environment \\\n  --image myregistry.azurecr.io/api:v1 \\\n  --target-port 8080 \\\n  --ingress external \\\n  --min-replicas 0 \\\n  --max-replicas 10 \\\n  --cpu 0.5 \\\n  --memory 1.0Gi \\\n  --env-vars DB_HOST=mydb.postgres.database.azure.com\n\n# URL: https://my-api.xxx.westeurope.azurecontainerapps.io\n\n# Обновление:\naz containerapp update \\\n  --name my-api \\\n  --resource-group myapp-prod-rg \\\n  --image myregistry.azurecr.io/api:v2\n\n# Traffic splitting (ревизии):\naz containerapp ingress traffic set \\\n  --name my-api \\\n  --resource-group myapp-prod-rg \\\n  --revision-weight my-api--v1=90 my-api--v2=10\n\n# Secrets:\naz containerapp secret set \\\n  --name my-api \\\n  --resource-group myapp-prod-rg \\\n  --secrets db-password=MySecretValue' },
        { type: 'tip', value: 'Container Apps с --min-replicas 0 масштабируется до нуля (нет стоимости в простое). KEDA поддерживает масштабирование по HTTP, Queue length, CPU, custom metrics. Для microservices используйте Dapr sidecar (service discovery, pub/sub, state management).' }
      ]
    },
    {
      id: 4,
      title: 'KEDA и масштабирование Container Apps',
      type: 'theory',
      content: [
        { type: 'text', value: 'KEDA (Kubernetes Event-Driven Autoscaling) — движок масштабирования Container Apps. Масштабирует по 50+ источникам событий: HTTP, Azure Queue, Kafka, PostgreSQL, custom metrics.' },
        { type: 'code', language: 'bash', value: '# Масштабирование по HTTP запросам:\naz containerapp create \\\n  --name my-api \\\n  --resource-group myapp-prod-rg \\\n  --environment my-environment \\\n  --image myregistry.azurecr.io/api:v1 \\\n  --target-port 8080 \\\n  --ingress external \\\n  --min-replicas 1 \\\n  --max-replicas 20 \\\n  --scale-rule-name http-rule \\\n  --scale-rule-type http \\\n  --scale-rule-http-concurrency 50  # 50 запросов на реплику' },
        { type: 'code', language: 'yaml', value: '# Container App YAML с KEDA scale rules:\nproperties:\n  template:\n    containers:\n      - name: worker\n        image: myregistry.azurecr.io/worker:v1\n        resources:\n          cpu: 0.5\n          memory: 1Gi\n    scale:\n      minReplicas: 0\n      maxReplicas: 30\n      rules:\n        # Масштабирование по Azure Queue\n        - name: queue-rule\n          azureQueue:\n            queueName: tasks\n            queueLength: 10  # 1 реплика на каждые 10 сообщений\n            auth:\n              - secretRef: storage-connection\n                triggerParameter: connection\n        # Масштабирование по CPU\n        - name: cpu-rule\n          custom:\n            type: cpu\n            metadata:\n              type: Utilization\n              value: "70"' },
        { type: 'list', value: [
          'HTTP scaling — по количеству concurrent запросов',
          'Azure Queue — по длине очереди (0 сообщений = 0 реплик)',
          'Azure Service Bus — по количеству сообщений в topic',
          'Kafka — по consumer lag',
          'CPU/Memory — по утилизации ресурсов',
          'Cron — по расписанию (увеличить реплики в рабочее время)'
        ] },
        { type: 'note', value: 'KEDA позволяет Container Apps масштабироваться до нуля, что невозможно в обычном Kubernetes. Идеально для workers/consumers: нет сообщений в очереди — нет запущенных контейнеров — нет стоимости.' }
      ]
    },
    {
      id: 5,
      title: 'Dapr и микросервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dapr (Distributed Application Runtime) — sidecar для микросервисов. Встроен в Container Apps. Предоставляет: service-to-service invocation, pub/sub, state management, secrets, bindings — через простой HTTP/gRPC API.' },
        { type: 'code', language: 'python', value: '# Использование Dapr из приложения (Python):\nimport requests\nimport json\n\nDARP_PORT = 3500  # Dapr sidecar порт\n\n# Service-to-service вызов (service discovery автоматически):\nresponse = requests.get(\n    f"http://localhost:{DAPR_PORT}/v1.0/invoke/order-service/method/orders/123"\n)\norder = response.json()\n\n# Pub/Sub — публикация события:\nrequests.post(\n    f"http://localhost:{DAPR_PORT}/v1.0/publish/pubsub/orders",\n    json={"orderId": "123", "status": "created"}\n)\n\n# State Management — хранение состояния:\nrequests.post(\n    f"http://localhost:{DAPR_PORT}/v1.0/state/statestore",\n    json=[{"key": "user-123", "value": {"name": "John", "cart": []}}]\n)\n\n# Чтение состояния:\nstate = requests.get(\n    f"http://localhost:{DAPR_PORT}/v1.0/state/statestore/user-123"\n).json()' },
        { type: 'code', language: 'bash', value: '# Включить Dapr в Container App:\naz containerapp create \\\n  --name order-service \\\n  --resource-group myapp-prod-rg \\\n  --environment my-environment \\\n  --image myregistry.azurecr.io/order-service:v1 \\\n  --target-port 8080 \\\n  --ingress internal \\\n  --enable-dapr \\\n  --dapr-app-id order-service \\\n  --dapr-app-port 8080' },
        { type: 'tip', value: 'Dapr позволяет общаться между микросервисами по имени (app-id) без hardcoded URL. Service discovery, retry, circuit breaker — из коробки. Dapr работает на любой платформе (Kubernetes, VM, Cloud), не только Container Apps.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: serverless в Azure',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Azure Function и Container App с автомасштабированием.',
      requirements: [
        'Создайте Azure Function с HTTP trigger на Python',
        'Добавьте Timer trigger для ежедневной задачи',
        'Задеплойте Function App в Azure',
        'Создайте Container Apps Environment',
        'Задеплойте контейнерное приложение с --min-replicas 0',
        'Настройте масштабирование по HTTP concurrency (50 req/replica)'
      ],
      hint: 'func init для создания Function проекта. az functionapp create с --consumption-plan-location. az containerapp env create + az containerapp create.',
      expectedOutput: 'Azure Function https://myfunc-xxx.azurewebsites.net/api/hello работает.\nTimer trigger настроен на ежедневный запуск.\nContainer App https://my-api.xxx.azurecontainerapps.io работает.\nMin replicas: 0, Max: 10. HTTP scaling: 50 req/replica.',
      solution: '# Azure Function\nfunc init MyFunc --python && cd MyFunc\nfunc new --name hello --template "HTTP trigger"\nfunc new --name daily-task --template "Timer trigger"\n\naz functionapp create --resource-group myapp-prod-rg \\\n  --consumption-plan-location westeurope --runtime python \\\n  --runtime-version 3.12 --functions-version 4 \\\n  --name myfunc-unique --storage-account myfuncstorage\n\nfunc azure functionapp publish myfunc-unique\n\n# Container App\naz containerapp env create --name my-env \\\n  --resource-group myapp-prod-rg --location westeurope\n\naz containerapp create --name my-api \\\n  --resource-group myapp-prod-rg --environment my-env \\\n  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \\\n  --target-port 80 --ingress external \\\n  --min-replicas 0 --max-replicas 10 \\\n  --scale-rule-name http-rule --scale-rule-type http \\\n  --scale-rule-http-concurrency 50',
      explanation: 'Azure Functions для event-driven функций (HTTP, timer, queue triggers). Container Apps для микросервисов с масштабированием до нуля. Оба serverless — нет управления инфраструктурой, оплата за использование.'
    }
  ]
}
