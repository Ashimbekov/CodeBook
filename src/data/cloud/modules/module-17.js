export default {
  id: 17,
  title: 'Azure VMs и App Service',
  description: 'Вычислительные ресурсы Azure: Virtual Machines, VM Scale Sets, Azure App Service, Deployment Slots, CI/CD.',
  lessons: [
    {
      id: 1,
      title: 'Azure Virtual Machines',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure VMs — виртуальные машины в Azure (аналог EC2). Поддерживают Windows и Linux. Серии VM оптимизированы для разных нагрузок: general purpose, compute, memory, storage, GPU.' },
        { type: 'heading', value: 'Серии VM' },
        { type: 'list', value: [
          'B-series — burstable, для dev/test и лёгких нагрузок (аналог t3)',
          'D-series — general purpose, сбалансированные (аналог m5)',
          'F-series — compute optimized, для CPU-интенсивных задач',
          'E-series — memory optimized, для баз данных и кэшей',
          'L-series — storage optimized, для больших объёмов данных',
          'N-series — GPU, для ML и графики'
        ] },
        { type: 'code', language: 'bash', value: '# Создание Linux VM:\naz vm create \\\n  --resource-group myapp-prod-rg \\\n  --name web-server \\\n  --image Ubuntu2204 \\\n  --size Standard_B2s \\\n  --admin-username azureuser \\\n  --generate-ssh-keys \\\n  --public-ip-sku Standard \\\n  --custom-data cloud-init.yaml\n\n# Открыть порт 80:\naz vm open-port \\\n  --resource-group myapp-prod-rg \\\n  --name web-server \\\n  --port 80\n\n# SSH подключение:\nssh azureuser@<public-ip>\n\n# Список размеров VM в регионе:\naz vm list-sizes --location westeurope --output table\n\n# Изменить размер VM:\naz vm resize \\\n  --resource-group myapp-prod-rg \\\n  --name web-server \\\n  --size Standard_D2s_v3\n\n# Стоимость:\n# Standard_B1s:  1 vCPU, 1 GB  — $0.0104/час\n# Standard_B2s:  2 vCPU, 4 GB  — $0.0416/час\n# Standard_D2s_v3: 2 vCPU, 8 GB — $0.096/час' },
        { type: 'tip', value: 'Azure Spot VMs — до 90% дешевле обычных VM (аналог AWS Spot Instances). Могут быть прерваны. Подходят для batch processing, CI/CD runners, ML training. Используйте Availability Sets или Zones для production.' }
      ]
    },
    {
      id: 2,
      title: 'VM Scale Sets',
      type: 'theory',
      content: [
        { type: 'text', value: 'VM Scale Sets (VMSS) — автоматическое управление группой идентичных VM. Автомасштабирование, автовосстановление, rolling updates. Аналог AWS ASG.' },
        { type: 'code', language: 'bash', value: '# Создание VMSS:\naz vmss create \\\n  --resource-group myapp-prod-rg \\\n  --name web-vmss \\\n  --image Ubuntu2204 \\\n  --upgrade-policy-mode automatic \\\n  --instance-count 2 \\\n  --vm-sku Standard_B2s \\\n  --admin-username azureuser \\\n  --generate-ssh-keys \\\n  --load-balancer web-lb \\\n  --custom-data cloud-init.yaml\n\n# Autoscale:\naz monitor autoscale create \\\n  --resource-group myapp-prod-rg \\\n  --resource web-vmss \\\n  --resource-type Microsoft.Compute/virtualMachineScaleSets \\\n  --min-count 2 \\\n  --max-count 10 \\\n  --count 2\n\naz monitor autoscale rule create \\\n  --resource-group myapp-prod-rg \\\n  --autoscale-name web-vmss-autoscale \\\n  --condition "Percentage CPU > 70 avg 5m" \\\n  --scale out 2\n\naz monitor autoscale rule create \\\n  --resource-group myapp-prod-rg \\\n  --autoscale-name web-vmss-autoscale \\\n  --condition "Percentage CPU < 30 avg 5m" \\\n  --scale in 1\n\n# Обновление образа (rolling update):\naz vmss update \\\n  --resource-group myapp-prod-rg \\\n  --name web-vmss \\\n  --set virtualMachineProfile.storageProfile.imageReference.version=latest\naz vmss update-instances --resource-group myapp-prod-rg --name web-vmss --instance-ids "*"' },
        { type: 'note', value: 'VMSS поддерживает Flexible orchestration mode (рекомендуется): разные размеры VM в одной группе, placement groups для низкой задержки, интеграция с Azure Load Balancer и Application Gateway.' }
      ]
    },
    {
      id: 3,
      title: 'Azure App Service: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure App Service — PaaS для веб-приложений. Поддерживает .NET, Java, Node.js, Python, PHP, Ruby. Встроенный CI/CD, SSL, автомасштабирование, custom domains. Нет управления серверами.' },
        { type: 'code', language: 'bash', value: '# Создание App Service Plan (серверный ресурс):\naz appservice plan create \\\n  --name myapp-plan \\\n  --resource-group myapp-prod-rg \\\n  --sku B1 \\\n  --is-linux\n\n# Создание Web App:\naz webapp create \\\n  --resource-group myapp-prod-rg \\\n  --plan myapp-plan \\\n  --name myapp-unique-name \\\n  --runtime "PYTHON:3.12"\n\n# URL: https://myapp-unique-name.azurewebsites.net\n\n# Деплой из Git:\naz webapp deployment source config-local-git \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name\ngit remote add azure <url-from-output>\ngit push azure main\n\n# Деплой из ZIP:\naz webapp deploy \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --src-path app.zip\n\n# Environment variables:\naz webapp config appsettings set \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --settings DB_HOST=mydb.postgres.database.azure.com NODE_ENV=production\n\n# App Service Plans:\n# Free (F1):  60 мин CPU/день, без custom domain\n# Basic (B1): $13/мес, custom domain, SSL\n# Standard (S1): $73/мес, auto scale, staging slots\n# Premium (P1v3): $138/мес, VNet integration, больше ресурсов' },
        { type: 'tip', value: 'App Service — самый быстрый способ задеплоить веб-приложение в Azure. Для большинства веб-приложений не нужны VM. App Service поддерживает Docker containers через Web App for Containers.' }
      ]
    },
    {
      id: 4,
      title: 'Deployment Slots и CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'Deployment Slots позволяют создавать staging окружения внутри App Service и мгновенно переключать трафик между ними (swap). Это обеспечивает zero-downtime деплой.' },
        { type: 'code', language: 'bash', value: '# Создание staging slot:\naz webapp deployment slot create \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --slot staging\n\n# URL staging: https://myapp-unique-name-staging.azurewebsites.net\n\n# Деплой в staging:\naz webapp deploy \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --slot staging \\\n  --src-path app.zip\n\n# Тестирование staging...\n# curl https://myapp-unique-name-staging.azurewebsites.net\n\n# Swap staging → production (zero downtime!):\naz webapp deployment slot swap \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --slot staging \\\n  --target-slot production\n\n# Если проблемы — swap обратно (мгновенный rollback):\naz webapp deployment slot swap \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --slot staging \\\n  --target-slot production\n\n# Traffic routing (canary):\n# Отправить 10% трафика на staging:\naz webapp traffic-routing set \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --distribution staging=10' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions CI/CD для App Service:\nname: Deploy to Azure\non:\n  push:\n    branches: [main]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      \n      - name: Install dependencies\n        run: pip install -r requirements.txt\n      \n      - name: Deploy to Azure\n        uses: azure/webapps-deploy@v3\n        with:\n          app-name: myapp-unique-name\n          slot-name: staging\n          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}' },
        { type: 'note', value: 'Deployment Slots доступны начиная со Standard плана. Каждый slot — отдельное приложение со своими env vars, но разделяющее App Service Plan. Swap меняет маршрутизацию, а не файлы — поэтому мгновенный.' }
      ]
    },
    {
      id: 5,
      title: 'App Service: VNet Integration и безопасность',
      type: 'theory',
      content: [
        { type: 'text', value: 'App Service можно интегрировать с VNet для доступа к приватным ресурсам (базы данных, Redis). Private Endpoints обеспечивают приватный доступ к App Service.' },
        { type: 'code', language: 'bash', value: '# VNet Integration — исходящий трафик через VNet:\naz webapp vnet-integration add \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name \\\n  --vnet my-vnet \\\n  --subnet app-subnet\n\n# Теперь App Service может обращаться к ресурсам в VNet\n# (PostgreSQL в приватной подсети, Redis, и т.д.)\n\n# Private Endpoint — входящий трафик только через VNet:\naz network private-endpoint create \\\n  --name myapp-pe \\\n  --resource-group myapp-prod-rg \\\n  --vnet-name my-vnet \\\n  --subnet pe-subnet \\\n  --private-connection-resource-id $(az webapp show --name myapp-unique-name --resource-group myapp-prod-rg --query id -o tsv) \\\n  --group-id sites \\\n  --connection-name myapp-pe-connection\n\n# Managed Identity для доступа к Key Vault:\naz webapp identity assign \\\n  --resource-group myapp-prod-rg \\\n  --name myapp-unique-name\n\n# Разрешить Managed Identity читать Key Vault:\naz keyvault set-policy \\\n  --name my-keyvault \\\n  --object-id $(az webapp identity show --name myapp-unique-name --resource-group myapp-prod-rg --query principalId -o tsv) \\\n  --secret-permissions get list\n\n# Использование Key Vault Reference в App Settings:\naz webapp config appsettings set \\\n  --name myapp-unique-name \\\n  --resource-group myapp-prod-rg \\\n  --settings DB_PASSWORD="@Microsoft.KeyVault(SecretUri=https://my-keyvault.vault.azure.net/secrets/db-password/)"' },
        { type: 'tip', value: 'Key Vault References позволяют App Service читать секреты из Azure Key Vault напрямую через app settings. Секреты автоматически ротируются. Не нужно менять код приложения.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: деплой в App Service',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте веб-приложение в Azure App Service с staging slots и CI/CD.',
      requirements: [
        'Создайте App Service Plan (Standard S1) и Web App для Python',
        'Задеплойте приложение из ZIP или Git',
        'Настройте environment variables через app settings',
        'Создайте staging deployment slot',
        'Задеплойте обновление в staging и выполните swap',
        'Настройте автомасштабирование (min 1, max 5, CPU 70%)'
      ],
      hint: 'az appservice plan create --sku S1 (Standard для slots). az webapp deployment slot create для staging. az webapp deployment slot swap для переключения.',
      expectedOutput: 'App Service Plan myapp-plan (S1) создан.\nWeb App https://myapp-xxx.azurewebsites.net работает.\nApp settings настроены (DB_HOST, NODE_ENV).\nStaging slot создан и доступен.\nSwap выполнен: staging → production.\nAutoscale: min=1, max=5, CPU target 70%.',
      solution: '# App Service Plan + Web App\naz appservice plan create --name myapp-plan --resource-group myapp-prod-rg --sku S1 --is-linux\naz webapp create --resource-group myapp-prod-rg --plan myapp-plan --name myapp-unique-123 --runtime "PYTHON:3.12"\n\n# Deploy\naz webapp deploy --resource-group myapp-prod-rg --name myapp-unique-123 --src-path app.zip\n\n# App Settings\naz webapp config appsettings set --resource-group myapp-prod-rg --name myapp-unique-123 \\\n  --settings DB_HOST=mydb.postgres.database.azure.com NODE_ENV=production\n\n# Staging Slot\naz webapp deployment slot create --resource-group myapp-prod-rg --name myapp-unique-123 --slot staging\naz webapp deploy --resource-group myapp-prod-rg --name myapp-unique-123 --slot staging --src-path app-v2.zip\n\n# Swap\naz webapp deployment slot swap --resource-group myapp-prod-rg --name myapp-unique-123 --slot staging --target-slot production\n\n# Autoscale\naz monitor autoscale create --resource-group myapp-prod-rg \\\n  --resource myapp-plan --resource-type Microsoft.Web/serverFarms \\\n  --min-count 1 --max-count 5 --count 1\naz monitor autoscale rule create --resource-group myapp-prod-rg \\\n  --autoscale-name myapp-plan-autoscale \\\n  --condition "CpuPercentage > 70 avg 5m" --scale out 1\naz monitor autoscale rule create --resource-group myapp-prod-rg \\\n  --autoscale-name myapp-plan-autoscale \\\n  --condition "CpuPercentage < 30 avg 5m" --scale in 1',
      explanation: 'App Service с Deployment Slots обеспечивает zero-downtime деплой. Swap мгновенно переключает трафик между production и staging. Autoscale добавляет/убирает инстансы по нагрузке. Это полноценная production-ready платформа без управления серверами.'
    }
  ]
}
