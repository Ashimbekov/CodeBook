export default {
  id: 7,
  title: 'AWS Lambda и Serverless',
  description: 'Serverless вычисления: AWS Lambda, триггеры, API Gateway, SAM, Step Functions, event-driven архитектура.',
  lessons: [
    {
      id: 1,
      title: 'Основы Serverless и AWS Lambda',
      type: 'theory',
      content: [
        { type: 'text', value: 'Serverless — модель, где вы пишете только код, а облако управляет серверами, масштабированием, патчами. AWS Lambda выполняет код в ответ на события. Оплата только за время выполнения (до миллисекунд).' },
        { type: 'heading', value: 'Характеристики Lambda' },
        { type: 'list', value: [
          'Поддерживаемые языки: Python, Node.js, Java, Go, .NET, Ruby, custom runtime',
          'Макс время выполнения: 15 минут',
          'Память: 128 MB - 10 GB (CPU масштабируется пропорционально памяти)',
          'Размер пакета: 50 MB (zip) или 10 GB (container image)',
          'Конкурентность: до 1000 одновременных выполнений (можно увеличить)',
          'Free Tier: 1 млн запросов + 400,000 GB-сек в месяц навсегда'
        ] },
        { type: 'code', language: 'python', value: '# handler.py — простая Lambda функция\nimport json\n\ndef lambda_handler(event, context):\n    """\n    event — входные данные (JSON)\n    context — информация о выполнении (request_id, time remaining)\n    """\n    name = event.get("name", "World")\n    \n    return {\n        "statusCode": 200,\n        "headers": {"Content-Type": "application/json"},\n        "body": json.dumps({\n            "message": f"Hello, {name}!",\n            "requestId": context.aws_request_id\n        })\n    }' },
        { type: 'code', language: 'bash', value: '# Создание Lambda функции:\nzip function.zip handler.py\n\naws lambda create-function \\\n  --function-name hello-function \\\n  --runtime python3.12 \\\n  --handler handler.lambda_handler \\\n  --zip-file fileb://function.zip \\\n  --role arn:aws:iam::123456789012:role/lambda-execution-role \\\n  --memory-size 256 \\\n  --timeout 30\n\n# Вызов:\naws lambda invoke \\\n  --function-name hello-function \\\n  --payload \'{"name": "Cloud"}\' \\\n  response.json\n\ncat response.json\n# {"statusCode": 200, "body": "{\\"message\\": \\"Hello, Cloud!\\"..."}' },
        { type: 'tip', value: 'Lambda идеальна для: API endpoints, обработка файлов (S3 trigger), cron задачи, обработка очередей (SQS), реакция на события БД (DynamoDB Streams). Не подходит для: длительные процессы >15 мин, WebSocket (используйте Fargate).' }
      ]
    },
    {
      id: 2,
      title: 'Триггеры и интеграции Lambda',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lambda запускается в ответ на события из десятков AWS сервисов. Это основа event-driven архитектуры: событие произошло -> Lambda обработала -> результат.' },
        { type: 'heading', value: 'Популярные триггеры' },
        { type: 'list', value: [
          'API Gateway — HTTP запросы (REST/WebSocket API)',
          'S3 — загрузка/удаление файла (обработка изображений, ETL)',
          'SQS — сообщения из очереди (асинхронная обработка)',
          'DynamoDB Streams — изменения в таблице (event sourcing)',
          'EventBridge — расписание (cron) или события из других сервисов',
          'SNS — уведомления (email, SMS, push)',
          'CloudWatch Logs — обработка логов в реальном времени'
        ] },
        { type: 'code', language: 'python', value: '# Lambda для обработки загрузки файлов в S3:\nimport boto3\nimport json\n\ns3 = boto3.client("s3")\n\ndef lambda_handler(event, context):\n    # event содержит информацию о загруженном файле\n    for record in event["Records"]:\n        bucket = record["s3"]["bucket"]["name"]\n        key = record["s3"]["object"]["key"]\n        size = record["s3"]["object"]["size"]\n        \n        print(f"Новый файл: s3://{bucket}/{key} ({size} bytes)")\n        \n        # Пример: создать thumbnail для изображения\n        if key.endswith((".jpg", ".png")):\n            # Скачать, обработать, загрузить обратно\n            response = s3.get_object(Bucket=bucket, Key=key)\n            # ... обработка с Pillow ...\n            s3.put_object(\n                Bucket=bucket,\n                Key=f"thumbnails/{key}",\n                Body=thumbnail_data\n            )\n    \n    return {"statusCode": 200}' },
        { type: 'code', language: 'bash', value: '# Добавить S3 триггер:\naws lambda add-permission \\\n  --function-name image-processor \\\n  --statement-id s3-trigger \\\n  --action lambda:InvokeFunction \\\n  --principal s3.amazonaws.com \\\n  --source-arn arn:aws:s3:::my-images-bucket\n\naws s3api put-bucket-notification-configuration \\\n  --bucket my-images-bucket \\\n  --notification-configuration \'{\n    "LambdaFunctionConfigurations": [{\n      "LambdaFunctionArn": "arn:aws:lambda:eu-central-1:123456789012:function:image-processor",\n      "Events": ["s3:ObjectCreated:*"],\n      "Filter": {"Key": {"FilterRules": [{"Name": "suffix", "Value": ".jpg"}]}}\n    }]\n  }\'\n\n# EventBridge (cron каждые 5 минут):\naws events put-rule \\\n  --name every-5-minutes \\\n  --schedule-expression "rate(5 minutes)"\naws events put-targets \\\n  --rule every-5-minutes \\\n  --targets "Id"="1","Arn"="arn:aws:lambda:...:function:my-cron"' },
        { type: 'note', value: 'Lambda автоматически масштабируется: 100 одновременных запросов = 100 параллельных инстансов Lambda. Каждый инстанс обрабатывает один запрос. Для SQS Lambda автоматически читает сообщения пачками.' }
      ]
    },
    {
      id: 3,
      title: 'API Gateway',
      type: 'theory',
      content: [
        { type: 'text', value: 'Amazon API Gateway — управляемый сервис для создания REST и HTTP API. Служит "входной дверью" для Lambda функций, превращая их в полноценные API endpoints.' },
        { type: 'code', language: 'bash', value: '# Создание HTTP API (проще и дешевле REST API):\nAPI_ID=$(aws apigatewayv2 create-api \\\n  --name my-api \\\n  --protocol-type HTTP \\\n  --target arn:aws:lambda:eu-central-1:123456789012:function:hello-function \\\n  --query "ApiId" --output text)\n\n# URL API:\necho "https://$API_ID.execute-api.eu-central-1.amazonaws.com"\n\n# REST API (более функциональный):\naws apigateway create-rest-api --name my-rest-api\n\n# Добавить ресурс /users:\naws apigateway create-resource \\\n  --rest-api-id xxx \\\n  --parent-id yyy \\\n  --path-part users\n\n# Добавить метод GET:\naws apigateway put-method \\\n  --rest-api-id xxx \\\n  --resource-id zzz \\\n  --http-method GET \\\n  --authorization-type NONE\n\n# Связать с Lambda:\naws apigateway put-integration \\\n  --rest-api-id xxx \\\n  --resource-id zzz \\\n  --http-method GET \\\n  --type AWS_PROXY \\\n  --integration-http-method POST \\\n  --uri arn:aws:apigateway:eu-central-1:lambda:path/2015-03-31/functions/arn:aws:lambda:...:function:hello-function/invocations' },
        { type: 'heading', value: 'HTTP API vs REST API' },
        { type: 'list', value: [
          'HTTP API: дешевле ($1/млн запросов vs $3.5), быстрее, проще. Для большинства задач',
          'REST API: API keys, usage plans, request validation, WAF, caching. Для enterprise',
          'WebSocket API: двунаправленная связь (чат, уведомления в реальном времени)'
        ] },
        { type: 'tip', value: 'Для быстрого старта используйте HTTP API с Lambda. Для production добавьте авторизацию (JWT authorizer, Cognito), throttling и custom domain (api.your-domain.com).' }
      ]
    },
    {
      id: 4,
      title: 'AWS SAM (Serverless Application Model)',
      type: 'theory',
      content: [
        { type: 'text', value: 'SAM — фреймворк для определения serverless приложений в YAML. Расширяет CloudFormation, упрощая описание Lambda, API Gateway, DynamoDB. SAM CLI позволяет тестировать локально.' },
        { type: 'code', language: 'yaml', value: '# template.yaml — SAM шаблон\nAWSTemplateFormatVersion: "2010-09-09"\nTransform: AWS::Serverless-2016-10-31\nDescription: My Serverless API\n\nGlobals:\n  Function:\n    Runtime: python3.12\n    Timeout: 30\n    MemorySize: 256\n    Environment:\n      Variables:\n        TABLE_NAME: !Ref UsersTable\n\nResources:\n  # Lambda функция с API Gateway\n  GetUsersFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      CodeUri: src/\n      Handler: get_users.lambda_handler\n      Events:\n        GetUsers:\n          Type: Api\n          Properties:\n            Path: /users\n            Method: get\n\n  CreateUserFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      CodeUri: src/\n      Handler: create_user.lambda_handler\n      Policies:\n        - DynamoDBCrudPolicy:\n            TableName: !Ref UsersTable\n      Events:\n        CreateUser:\n          Type: Api\n          Properties:\n            Path: /users\n            Method: post\n\n  # DynamoDB таблица\n  UsersTable:\n    Type: AWS::Serverless::SimpleTable\n    Properties:\n      PrimaryKey:\n        Name: userId\n        Type: String\n\nOutputs:\n  ApiUrl:\n    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"' },
        { type: 'code', language: 'bash', value: '# Установка SAM CLI:\npip install aws-sam-cli\n\n# Создать проект из шаблона:\nsam init --runtime python3.12 --name my-api\n\n# Локальное тестирование:\nsam local invoke GetUsersFunction --event events/get-users.json\nsam local start-api  # Запускает локальный API на localhost:3000\n\n# Сборка и деплой:\nsam build\nsam deploy --guided  # Интерактивный деплой (первый раз)\nsam deploy           # Последующие деплои\n\n# Просмотр логов:\nsam logs --name GetUsersFunction --tail' },
        { type: 'tip', value: 'SAM CLI позволяет тестировать Lambda и API Gateway локально в Docker контейнерах. Это значительно ускоряет разработку — не нужно деплоить в AWS при каждом изменении.' }
      ]
    },
    {
      id: 5,
      title: 'Step Functions и оркестрация',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS Step Functions — оркестратор для координации нескольких Lambda функций в workflow. Визуальный редактор, обработка ошибок, retry, параллельное выполнение.' },
        { type: 'code', language: 'json', value: '{\n  "Comment": "Обработка заказа",\n  "StartAt": "ValidateOrder",\n  "States": {\n    "ValidateOrder": {\n      "Type": "Task",\n      "Resource": "arn:aws:lambda:...:function:validate-order",\n      "Next": "CheckInventory",\n      "Catch": [{\n        "ErrorEquals": ["ValidationError"],\n        "Next": "OrderFailed"\n      }]\n    },\n    "CheckInventory": {\n      "Type": "Task",\n      "Resource": "arn:aws:lambda:...:function:check-inventory",\n      "Next": "ProcessPayment",\n      "Retry": [{\n        "ErrorEquals": ["States.TaskFailed"],\n        "IntervalSeconds": 3,\n        "MaxAttempts": 3,\n        "BackoffRate": 2\n      }]\n    },\n    "ProcessPayment": {\n      "Type": "Task",\n      "Resource": "arn:aws:lambda:...:function:process-payment",\n      "Next": "SendConfirmation"\n    },\n    "SendConfirmation": {\n      "Type": "Task",\n      "Resource": "arn:aws:lambda:...:function:send-email",\n      "End": true\n    },\n    "OrderFailed": {\n      "Type": "Fail",\n      "Error": "OrderProcessingFailed",\n      "Cause": "Order validation or processing failed"\n    }\n  }\n}' },
        { type: 'list', value: [
          'Task — выполнение Lambda или AWS SDK вызова',
          'Choice — условное ветвление (if/else)',
          'Parallel — параллельное выполнение веток',
          'Map — итерация по массиву (обработка каждого элемента)',
          'Wait — пауза на заданное время',
          'Retry/Catch — автоматические повторы и обработка ошибок'
        ] },
        { type: 'note', value: 'Step Functions стоят $25/млн переходов (state transitions). Express Workflows — $1/млн для коротких workflow (до 5 мин). Используйте для сложных бизнес-процессов где нужна визуализация и надёжная обработка ошибок.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Serverless API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте serverless REST API с Lambda, API Gateway и DynamoDB используя SAM.',
      requirements: [
        'Инициализируйте SAM проект с Python 3.12',
        'Создайте Lambda функцию для GET /items (чтение из DynamoDB)',
        'Создайте Lambda функцию для POST /items (запись в DynamoDB)',
        'Опишите DynamoDB таблицу в SAM template',
        'Протестируйте API локально через sam local start-api',
        'Задеплойте в AWS и проверьте работу через curl'
      ],
      hint: 'Используйте SAM init для создания проекта. В template.yaml определите две функции с Events типа Api. Для доступа к DynamoDB используйте Policy DynamoDBCrudPolicy. Библиотека boto3 уже доступна в Lambda runtime.',
      expectedOutput: 'SAM проект создан.\nGET /items возвращает список элементов из DynamoDB.\nPOST /items создаёт новый элемент.\nЛокальное тестирование: http://localhost:3000/items работает.\nДеплой: API URL https://xxx.execute-api.eu-central-1.amazonaws.com/Prod/items',
      solution: '# Инициализация\nsam init --runtime python3.12 --name items-api --app-template hello-world\ncd items-api\n\n# src/get_items.py\ncat > src/get_items.py << \'EOF\'\nimport json\nimport os\nimport boto3\n\ndynamodb = boto3.resource("dynamodb")\ntable = dynamodb.Table(os.environ["TABLE_NAME"])\n\ndef lambda_handler(event, context):\n    result = table.scan()\n    return {\n        "statusCode": 200,\n        "body": json.dumps(result["Items"], default=str)\n    }\nEOF\n\n# src/create_item.py\ncat > src/create_item.py << \'EOF\'\nimport json\nimport os\nimport uuid\nimport boto3\n\ndynamodb = boto3.resource("dynamodb")\ntable = dynamodb.Table(os.environ["TABLE_NAME"])\n\ndef lambda_handler(event, context):\n    body = json.loads(event["body"])\n    item = {"itemId": str(uuid.uuid4()), "name": body["name"], "price": body.get("price", 0)}\n    table.put_item(Item=item)\n    return {"statusCode": 201, "body": json.dumps(item)}\nEOF\n\n# sam build && sam deploy --guided\n# curl https://xxx.execute-api.../Prod/items\n# curl -X POST https://xxx.execute-api.../Prod/items -d \'{"name":"Book","price":29}\'',
      explanation: 'SAM упрощает создание serverless приложений: один YAML файл описывает Lambda + API Gateway + DynamoDB. Локальное тестирование через sam local ускоряет разработку. В production Lambda масштабируется автоматически от 0 до тысяч экземпляров.'
    }
  ]
}
