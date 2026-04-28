export default {
  id: 31,
  title: 'Azure: основы',
  description: 'Microsoft Azure — облачная платформа для вычислений, хранения, контейнеров и serverless. Virtual Machines, Blob Storage, Azure Functions и AKS.',
  lessons: [
    {
      id: 1,
      title: 'Обзор Azure',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Microsoft Azure' },
        { type: 'text', value: 'Azure — второй по размеру облачный провайдер после AWS. Сильные стороны: интеграция с экосистемой Microsoft (Active Directory, Office 365, .NET), гибридные решения (Azure Arc), enterprise-функции. Azure использует Resource Groups для организации ресурсов.' },
        { type: 'code', language: 'bash', value: '# Установка Azure CLI\ncurl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash\n\n# Аутентификация\naz login\n\n# Установка подписки по умолчанию\naz account list --output table\naz account set --subscription "My Subscription"\n\n# Просмотр текущей конфигурации\naz account show\n\n# Список доступных регионов\naz account list-locations --output table' },
        { type: 'heading', value: 'Организация ресурсов' },
        { type: 'code', language: 'bash', value: '# Иерархия Azure:\n# Management Group (верхний уровень)\n#   └── Subscription (биллинг)\n#       └── Resource Group (логическая группа)\n#           └── Resources (VM, Storage, AKS...)\n\n# Создание Resource Group\naz group create --name myapp-rg --location eastus\n\n# Список Resource Groups\naz group list --output table\n\n# Удаление Resource Group (удалит ВСЕ ресурсы внутри)\naz group delete --name myapp-rg --yes --no-wait\n\n# Теги для организации\naz group update --name myapp-rg \\\n  --tags environment=production team=backend cost-center=12345' },
        { type: 'list', items: [
          'Compute — Virtual Machines, AKS, Container Instances, App Service',
          'Storage — Blob Storage, Azure Files, Managed Disks, Table Storage',
          'Networking — Virtual Network, Load Balancer, Application Gateway, Front Door',
          'Database — Azure SQL, Cosmos DB, PostgreSQL Flexible Server',
          'DevOps — Azure DevOps, Container Registry, Key Vault'
        ] },
        { type: 'tip', value: 'Azure предоставляет $200 бесплатного кредита на 30 дней. Always Free tier включает B1S VM (750 часов/месяц), 5GB Blob Storage, 250GB SQL Database.' }
      ]
    },
    {
      id: 2,
      title: 'Virtual Machines',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Azure Virtual Machines' },
        { type: 'text', value: 'Azure VM — виртуальные машины с выбором из сотен размеров. Azure поддерживает Linux и Windows VM, Spot Instances для экономии, и Availability Sets/Zones для отказоустойчивости.' },
        { type: 'code', language: 'bash', value: '# Создание VM\naz vm create \\\n  --resource-group myapp-rg \\\n  --name myapp-vm \\\n  --image Ubuntu2204 \\\n  --size Standard_B2s \\\n  --admin-username azureuser \\\n  --generate-ssh-keys \\\n  --public-ip-sku Standard \\\n  --custom-data cloud-init.yaml\n\n# Серии VM:\n# B-series  — burstable (бюджетный, для dev)\n# D-series  — general purpose (production)\n# E-series  — memory optimized (базы данных)\n# F-series  — compute optimized (batch)\n# N-series  — GPU (AI/ML)\n\n# Размеры примеры:\n# Standard_B1s  — 1 vCPU, 1GB RAM   ($7/мес)\n# Standard_B2s  — 2 vCPU, 4GB RAM   ($30/мес)\n# Standard_D4s_v5 — 4 vCPU, 16GB    ($140/мес)' },
        { type: 'code', language: 'bash', value: '# SSH подключение\naz vm ssh --resource-group myapp-rg --name myapp-vm\n# или\nssh azureuser@<public-ip>\n\n# Управление VM\naz vm list --resource-group myapp-rg --output table\naz vm stop --resource-group myapp-rg --name myapp-vm\naz vm start --resource-group myapp-rg --name myapp-vm\naz vm deallocate --resource-group myapp-rg --name myapp-vm  # освобождает ресурсы\n\n# Открытие порта\naz vm open-port --resource-group myapp-rg --name myapp-vm --port 80\n\n# Spot VM (до 90% дешевле)\naz vm create \\\n  --resource-group myapp-rg \\\n  --name spot-vm \\\n  --image Ubuntu2204 \\\n  --size Standard_D2s_v5 \\\n  --priority Spot \\\n  --eviction-policy Deallocate \\\n  --max-price 0.05' },
        { type: 'heading', value: 'VM Scale Sets' },
        { type: 'code', language: 'bash', value: '# VM Scale Set с автоскейлингом\naz vmss create \\\n  --resource-group myapp-rg \\\n  --name myapp-vmss \\\n  --image Ubuntu2204 \\\n  --vm-sku Standard_B2s \\\n  --instance-count 2 \\\n  --admin-username azureuser \\\n  --generate-ssh-keys \\\n  --upgrade-policy-mode Automatic\n\naz monitor autoscale create \\\n  --resource-group myapp-rg \\\n  --resource myapp-vmss \\\n  --resource-type Microsoft.Compute/virtualMachineScaleSets \\\n  --min-count 2 \\\n  --max-count 10 \\\n  --count 2\n\naz monitor autoscale rule create \\\n  --resource-group myapp-rg \\\n  --autoscale-name myapp-vmss \\\n  --condition "Percentage CPU > 70 avg 5m" \\\n  --scale out 2' },
        { type: 'note', value: 'Deallocate (az vm deallocate) полностью освобождает вычислительные ресурсы и прекращает биллинг. Stop только останавливает VM, но ресурсы остаются зарезервированными.' }
      ]
    },
    {
      id: 3,
      title: 'Blob Storage',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Azure Blob Storage' },
        { type: 'text', value: 'Blob Storage — объектное хранилище Azure (аналог AWS S3, GCP Cloud Storage). Данные организованы в Storage Account -> Container -> Blobs. Поддерживает разные уровни доступа для оптимизации стоимости.' },
        { type: 'code', language: 'bash', value: '# Создание Storage Account\naz storage account create \\\n  --name myappstorage123 \\\n  --resource-group myapp-rg \\\n  --location eastus \\\n  --sku Standard_LRS \\\n  --kind StorageV2\n\n# SKU типы:\n# Standard_LRS — locally redundant (3 копии в одном ДЦ)\n# Standard_ZRS — zone redundant (3 зоны доступности)\n# Standard_GRS — geo redundant (2 региона)\n# Premium_LRS — SSD, низкая задержка\n\n# Получение ключа доступа\naz storage account keys list \\\n  --account-name myappstorage123 \\\n  --resource-group myapp-rg' },
        { type: 'code', language: 'bash', value: '# Создание контейнера\naz storage container create \\\n  --name mycontainer \\\n  --account-name myappstorage123 \\\n  --auth-mode login\n\n# Загрузка файлов\naz storage blob upload \\\n  --account-name myappstorage123 \\\n  --container-name mycontainer \\\n  --name backup.tar.gz \\\n  --file ./backup.tar.gz\n\n# Загрузка директории\naz storage blob upload-batch \\\n  --account-name myappstorage123 \\\n  --destination mycontainer \\\n  --source ./my-folder\n\n# Список blob\naz storage blob list \\\n  --account-name myappstorage123 \\\n  --container-name mycontainer \\\n  --output table\n\n# Скачивание\naz storage blob download \\\n  --account-name myappstorage123 \\\n  --container-name mycontainer \\\n  --name backup.tar.gz \\\n  --file ./downloaded.tar.gz' },
        { type: 'heading', value: 'Уровни доступа и Lifecycle' },
        { type: 'code', language: 'bash', value: '# Уровни доступа (Access Tiers):\n# Hot     — частый доступ (по умолчанию)\n# Cool    — редкий доступ (хранение 30+ дней)\n# Cold    — очень редкий доступ (хранение 90+ дней)\n# Archive — архивное (хранение 180+ дней, доступ за часы)\n\n# Изменение уровня blob\naz storage blob set-tier \\\n  --account-name myappstorage123 \\\n  --container-name mycontainer \\\n  --name old-backup.tar.gz \\\n  --tier Cool\n\n# Lifecycle Management Policy\naz storage account management-policy create \\\n  --account-name myappstorage123 \\\n  --resource-group myapp-rg \\\n  --policy @lifecycle-policy.json' },
        { type: 'tip', value: 'Используйте AzCopy для быстрой загрузки больших объёмов данных. AzCopy поддерживает параллельную загрузку, возобновление и работу с SAS-токенами.' }
      ]
    },
    {
      id: 4,
      title: 'Azure Functions',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Serverless с Azure Functions' },
        { type: 'text', value: 'Azure Functions — serverless compute сервис (аналог AWS Lambda, GCP Cloud Functions). Поддерживает C#, JavaScript, Python, Java, PowerShell. Три тарифных плана: Consumption (pay-per-use), Premium, Dedicated.' },
        { type: 'code', language: 'bash', value: '# Установка Azure Functions Core Tools\nnpm install -g azure-functions-core-tools@4\n\n# Создание проекта\nfunc init MyFunctionApp --worker-runtime python\ncd MyFunctionApp\n\n# Создание HTTP-функции\nfunc new --name HttpTrigger --template "HTTP trigger" --authlevel anonymous' },
        { type: 'code', language: 'bash', value: '# function_app.py (Python v2 model)\n# import azure.functions as func\n# import json\n# import logging\n#\n# app = func.FunctionApp()\n#\n# @app.function_name(name="HttpTrigger")\n# @app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)\n# def hello(req: func.HttpRequest) -> func.HttpResponse:\n#     name = req.params.get("name", "World")\n#     logging.info(f"Processing request for {name}")\n#     return func.HttpResponse(\n#         json.dumps({"message": f"Hello, {name}!"}),\n#         mimetype="application/json"\n#     )\n#\n# @app.function_name(name="BlobTrigger")\n# @app.blob_trigger(arg_name="blob", path="uploads/{name}",\n#                    connection="AzureWebJobsStorage")\n# def process_blob(blob: func.InputStream):\n#     logging.info(f"Processing blob: {blob.name}, Size: {blob.length}")' },
        { type: 'code', language: 'bash', value: '# Локальный запуск\nfunc start\n# Тест: curl http://localhost:7071/api/hello?name=Azure\n\n# Деплой в Azure\n# 1. Создание ресурсов\naz functionapp create \\\n  --resource-group myapp-rg \\\n  --consumption-plan-location eastus \\\n  --runtime python \\\n  --runtime-version 3.11 \\\n  --functions-version 4 \\\n  --name my-function-app-unique \\\n  --storage-account myappstorage123 \\\n  --os-type Linux\n\n# 2. Деплой кода\nfunc azure functionapp publish my-function-app-unique\n\n# Просмотр логов\nfunc azure functionapp logstream my-function-app-unique\n\n# URL функции:\n# https://my-function-app-unique.azurewebsites.net/api/hello' },
        { type: 'note', value: 'Consumption план бесплатно предоставляет 1 миллион запросов и 400 000 ГБ-секунд в месяц. Для функций с предсказуемой нагрузкой Premium план обеспечивает pre-warmed instances без холодного старта.' }
      ]
    },
    {
      id: 5,
      title: 'AKS: Azure Kubernetes Service',
      type: 'theory',
      content: [
        { type: 'heading', value: 'AKS — managed Kubernetes' },
        { type: 'text', value: 'AKS — managed Kubernetes от Azure. Control plane бесплатный (платите только за worker nodes). Интеграция с Azure AD, Azure Container Registry, Azure Monitor и Azure Policy.' },
        { type: 'code', language: 'bash', value: '# Создание AKS кластера\naz aks create \\\n  --resource-group myapp-rg \\\n  --name my-aks-cluster \\\n  --node-count 3 \\\n  --node-vm-size Standard_B2s \\\n  --enable-managed-identity \\\n  --enable-addons monitoring \\\n  --generate-ssh-keys \\\n  --network-plugin azure \\\n  --enable-cluster-autoscaler \\\n  --min-count 2 \\\n  --max-count 10\n\n# Подключение kubectl\naz aks get-credentials \\\n  --resource-group myapp-rg \\\n  --name my-aks-cluster\n\nkubectl get nodes\nkubectl cluster-info' },
        { type: 'heading', value: 'Azure Container Registry (ACR)' },
        { type: 'code', language: 'bash', value: '# Создание Container Registry\naz acr create \\\n  --resource-group myapp-rg \\\n  --name myappregistry123 \\\n  --sku Basic\n\n# Привязка ACR к AKS\naz aks update \\\n  --resource-group myapp-rg \\\n  --name my-aks-cluster \\\n  --attach-acr myappregistry123\n\n# Push образа в ACR\naz acr login --name myappregistry123\ndocker tag myapp:v1 myappregistry123.azurecr.io/myapp:v1\ndocker push myappregistry123.azurecr.io/myapp:v1\n\n# Деплой в AKS из ACR\nkubectl create deployment myapp \\\n  --image=myappregistry123.azurecr.io/myapp:v1 \\\n  --replicas=3\nkubectl expose deployment myapp --type=LoadBalancer --port=80' },
        { type: 'heading', value: 'Масштабирование и обновление' },
        { type: 'code', language: 'bash', value: '# Масштабирование node pool\naz aks scale \\\n  --resource-group myapp-rg \\\n  --name my-aks-cluster \\\n  --node-count 5\n\n# Добавление node pool\naz aks nodepool add \\\n  --resource-group myapp-rg \\\n  --cluster-name my-aks-cluster \\\n  --name gpupool \\\n  --node-count 2 \\\n  --node-vm-size Standard_NC6s_v3 \\\n  --labels workload=gpu\n\n# Обновление версии\naz aks get-upgrades \\\n  --resource-group myapp-rg \\\n  --name my-aks-cluster\n\naz aks upgrade \\\n  --resource-group myapp-rg \\\n  --name my-aks-cluster \\\n  --kubernetes-version 1.29.0\n\n# Удаление кластера\naz aks delete --resource-group myapp-rg --name my-aks-cluster --yes' },
        { type: 'tip', value: 'AKS control plane бесплатен — вы платите только за worker nodes. Используйте Spot node pools для batch-задач, чтобы сэкономить до 90%.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Деплой в Azure',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разверните приложение в Azure используя Virtual Machine, Blob Storage и AKS.',
      requirements: [
        'Создайте Resource Group и VM с Ubuntu',
        'Создайте Storage Account и загрузите файлы в Blob Container',
        'Создайте AKS кластер с 3 узлами и autoscaling',
        'Создайте Azure Container Registry и push Docker образ',
        'Разверните приложение в AKS с LoadBalancer',
        'Проверьте доступность через external IP'
      ],
      hint: 'Используйте az CLI: az group create, az vm create, az storage account create, az aks create. Подключите ACR к AKS через az aks update --attach-acr.',
      expectedOutput: 'az vm list => myapp-vm Running\naz storage blob list => файлы в контейнере\naz aks list => my-aks-cluster Succeeded\nkubectl get pods => 3/3 Running\nkubectl get svc => EXTERNAL-IP доступен',
      solution: '# 1. Resource Group\naz group create --name myapp-rg --location eastus\n\n# 2. VM\naz vm create --resource-group myapp-rg --name web-vm \\\n  --image Ubuntu2204 --size Standard_B1s \\\n  --admin-username azureuser --generate-ssh-keys\n\n# 3. Storage\naz storage account create --name myappstorage123 \\\n  --resource-group myapp-rg --sku Standard_LRS\naz storage container create --name uploads \\\n  --account-name myappstorage123\naz storage blob upload --account-name myappstorage123 \\\n  --container-name uploads --name test.txt --file ./test.txt\n\n# 4. AKS + ACR\naz acr create --resource-group myapp-rg --name myacr123 --sku Basic\naz aks create --resource-group myapp-rg --name my-aks \\\n  --node-count 3 --attach-acr myacr123 --generate-ssh-keys\naz aks get-credentials --resource-group myapp-rg --name my-aks\n\n# 5. Деплой\nkubectl create deployment myapp --image=nginx --replicas=3\nkubectl expose deployment myapp --type=LoadBalancer --port=80',
      explanation: 'Azure предоставляет полный стек для DevOps: VM для традиционных нагрузок, Blob Storage для файлов, AKS для контейнеров, ACR для Docker образов. Resource Groups упрощают управление и удаление связанных ресурсов. AKS control plane бесплатен.'
    }
  ]
}
