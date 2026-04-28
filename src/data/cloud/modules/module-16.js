export default {
  id: 16,
  title: 'Azure: обзор и Active Directory',
  description: 'Microsoft Azure: подписки, группы ресурсов, Azure Active Directory (Entra ID), RBAC, управление идентификацией.',
  lessons: [
    {
      id: 1,
      title: 'Обзор Microsoft Azure',
      type: 'theory',
      content: [
        { type: 'text', value: 'Microsoft Azure — облачная платформа Microsoft. Лидер в enterprise сегменте благодаря интеграции с Microsoft 365, Active Directory, Windows Server, .NET. 60+ регионов, 200+ сервисов.' },
        { type: 'heading', value: 'Иерархия ресурсов Azure' },
        { type: 'list', value: [
          'Management Group — группировка подписок (для крупных организаций)',
          'Subscription — контейнер для биллинга и лимитов. Один аккаунт может иметь несколько подписок',
          'Resource Group — логическая группировка ресурсов (по проекту, окружению или жизненному циклу)',
          'Resource — конкретный ресурс (VM, Storage Account, SQL Database)'
        ] },
        { type: 'code', language: 'bash', value: '# Установка Azure CLI:\ncurl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash\n\n# Вход:\naz login\n# Откроется браузер для аутентификации\n\n# Основные команды:\naz account list                    # Список подписок\naz account set --subscription "My Subscription"  # Выбрать подписку\naz group list                      # Список Resource Groups\n\n# Создание Resource Group:\naz group create \\\n  --name myapp-prod-rg \\\n  --location westeurope\n\n# Иерархия:\n# Management Group: MyCompany\n# ├── Subscription: Production\n# │   ├── Resource Group: myapp-prod-rg\n# │   │   ├── VM: web-server-1\n# │   │   ├── SQL Database: myapp-db\n# │   │   └── Storage Account: myappstorage\n# │   └── Resource Group: myapp-prod-network-rg\n# │       ├── VNet: prod-vnet\n# │       └── NSG: web-nsg\n# └── Subscription: Development\n#     └── Resource Group: myapp-dev-rg\n\n# Регионы Azure:\naz account list-locations --output table\n# westeurope (Netherlands), northeurope (Ireland)\n# eastus, westus2, etc.' },
        { type: 'tip', value: 'Resource Group — обязательный для каждого ресурса. Группируйте по жизненному циклу: если ресурсы создаются и удаляются вместе, они должны быть в одной RG. Удаление RG удаляет ВСЕ ресурсы внутри.' }
      ]
    },
    {
      id: 2,
      title: 'Azure Active Directory (Entra ID)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure AD (переименован в Microsoft Entra ID) — сервис управления идентификацией и доступом. Хранит пользователей, группы, приложения. Интегрирован с Microsoft 365, Azure и тысячами SaaS приложений.' },
        { type: 'heading', value: 'Компоненты Azure AD' },
        { type: 'list', value: [
          'Tenant — экземпляр Azure AD для организации',
          'User — учётная запись (сотрудник или гость)',
          'Group — набор пользователей (Security Group или Microsoft 365 Group)',
          'App Registration — регистрация приложения для OAuth/OIDC',
          'Service Principal — идентификация приложения или сервиса',
          'Managed Identity — автоматическая идентификация для Azure ресурсов'
        ] },
        { type: 'code', language: 'bash', value: '# Создание пользователя:\naz ad user create \\\n  --display-name "John Developer" \\\n  --user-principal-name john@mycompany.onmicrosoft.com \\\n  --password "SecurePass123!"\n\n# Создание группы:\naz ad group create \\\n  --display-name "Developers" \\\n  --mail-nickname "developers"\n\n# Добавить пользователя в группу:\nUSER_ID=$(az ad user show --id john@mycompany.onmicrosoft.com --query id -o tsv)\nGROUP_ID=$(az ad group show --group "Developers" --query id -o tsv)\naz ad group member add --group $GROUP_ID --member-id $USER_ID\n\n# Service Principal для CI/CD:\naz ad sp create-for-rbac \\\n  --name "github-actions-sp" \\\n  --role contributor \\\n  --scopes /subscriptions/xxx/resourceGroups/myapp-prod-rg\n# Выведет: appId, password, tenant — использовать в GitHub Secrets\n\n# Managed Identity для VM (рекомендуется вместо SP):\naz vm identity assign --name my-vm --resource-group myapp-prod-rg\n# VM автоматически получает токен для доступа к Azure ресурсам' },
        { type: 'note', value: 'Managed Identity — предпочтительный способ аутентификации для Azure ресурсов. Не нужно управлять секретами и ключами. System-assigned MI привязана к ресурсу, User-assigned MI может использоваться несколькими ресурсами.' }
      ]
    },
    {
      id: 3,
      title: 'Azure RBAC',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure RBAC (Role-Based Access Control) определяет кто может делать что с какими ресурсами. Роли назначаются на scope: Management Group, Subscription, Resource Group или Resource.' },
        { type: 'code', language: 'bash', value: '# Встроенные роли:\n# Owner — полный доступ + управление доступом\n# Contributor — полный доступ без управления доступом\n# Reader — только чтение\n# User Access Administrator — управление доступом\n\n# Назначение роли:\naz role assignment create \\\n  --assignee john@mycompany.onmicrosoft.com \\\n  --role "Virtual Machine Contributor" \\\n  --scope /subscriptions/xxx/resourceGroups/myapp-prod-rg\n\n# Назначение группе:\naz role assignment create \\\n  --assignee-object-id $GROUP_ID \\\n  --role "Storage Blob Data Reader" \\\n  --scope /subscriptions/xxx/resourceGroups/myapp-prod-rg\n\n# Список назначений:\naz role assignment list \\\n  --resource-group myapp-prod-rg --output table\n\n# Создание custom role:\naz role definition create --role-definition \'{\n  "Name": "App Deployer",\n  "Description": "Can deploy and manage web apps",\n  "Actions": [\n    "Microsoft.Web/sites/*",\n    "Microsoft.Web/serverFarms/read"\n  ],\n  "NotActions": [\n    "Microsoft.Web/sites/delete"\n  ],\n  "AssignableScopes": [\n    "/subscriptions/xxx"\n  ]\n}\'' },
        { type: 'heading', value: 'Принцип наименьших привилегий' },
        { type: 'list', value: [
          'Используйте специфичные роли вместо Owner/Contributor',
          'Назначайте на самом узком scope (Resource Group, не Subscription)',
          'Используйте группы для назначения ролей, а не отдельных пользователей',
          'Azure AD PIM (Privileged Identity Management) — JIT доступ для критичных ролей'
        ] },
        { type: 'tip', value: 'Azure AD PIM позволяет активировать привилегированные роли только на определённое время (Just-In-Time). Администратор активирует Owner на 2 часа, после чего роль деактивируется автоматически.' }
      ]
    },
    {
      id: 4,
      title: 'Azure Policy и Governance',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure Policy принудительно применяет правила к ресурсам: запрет создания VM определённых размеров, обязательное шифрование, теги. Azure Blueprints объединяет политики, RBAC и шаблоны для повторяемого развёртывания.' },
        { type: 'code', language: 'bash', value: '# Назначение встроенной политики:\n# Например: обязательные теги\naz policy assignment create \\\n  --name "require-env-tag" \\\n  --display-name "Require Environment Tag" \\\n  --policy "/providers/Microsoft.Authorization/policyDefinitions/871b6d14-10aa-478d-b466-ef391786b108" \\\n  --params \'{"tagName": {"value": "Environment"}}\' \\\n  --scope /subscriptions/xxx\n\n# Политика: разрешить VM только определённых размеров\naz policy assignment create \\\n  --name "allowed-vm-sizes" \\\n  --display-name "Allowed VM SKUs" \\\n  --policy "/providers/Microsoft.Authorization/policyDefinitions/cccc23c7-8427-4f53-ad12-b6a63eb452b3" \\\n  --params \'{"listOfAllowedSKUs": {"value": ["Standard_B1s", "Standard_B2s", "Standard_D2s_v3"]}}\' \\\n  --scope /subscriptions/xxx\n\n# Проверить compliance:\naz policy state summarize --subscription xxx\n\n# Azure Resource Locks — защита от удаления:\naz lock create \\\n  --name "no-delete" \\\n  --lock-type CanNotDelete \\\n  --resource-group myapp-prod-rg\n# Теперь RG и ресурсы внутри нельзя удалить без снятия lock' },
        { type: 'note', value: 'Azure Policy работает в двух режимах: Audit (только мониторинг) и Deny (блокировка). Начните с Audit чтобы оценить impact, затем переключите на Deny. Resource Locks защищают критичные ресурсы от случайного удаления.' }
      ]
    },
    {
      id: 5,
      title: 'Azure Monitor и Cost Management',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure Monitor — единая платформа мониторинга для всех Azure ресурсов. Azure Cost Management помогает отслеживать и оптимизировать расходы.' },
        { type: 'code', language: 'bash', value: '# Azure Monitor — метрики и логи:\naz monitor metrics list \\\n  --resource /subscriptions/xxx/resourceGroups/myapp-prod-rg/providers/Microsoft.Compute/virtualMachines/my-vm \\\n  --metric "Percentage CPU" \\\n  --interval PT1H\n\n# Создание Alert Rule:\naz monitor metrics alert create \\\n  --name "high-cpu" \\\n  --resource-group myapp-prod-rg \\\n  --scopes /subscriptions/xxx/resourceGroups/myapp-prod-rg/providers/Microsoft.Compute/virtualMachines/my-vm \\\n  --condition "avg Percentage CPU > 80" \\\n  --action /subscriptions/xxx/resourceGroups/myapp-prod-rg/providers/Microsoft.Insights/actionGroups/admins\n\n# Log Analytics — KQL запросы:\naz monitor log-analytics query \\\n  --workspace WORKSPACE_ID \\\n  --analytics-query "AzureActivity | where OperationNameValue contains \'delete\' | take 10"\n\n# Cost Management:\naz consumption usage list \\\n  --start-date 2024-01-01 --end-date 2024-01-31 \\\n  --output table\n\n# Бюджет с оповещениями:\naz consumption budget create \\\n  --budget-name monthly-budget \\\n  --amount 1000 \\\n  --time-grain Monthly \\\n  --start-date 2024-01-01 \\\n  --end-date 2024-12-31' },
        { type: 'tip', value: 'Azure Cost Management + Advisor бесплатно рекомендует оптимизации: неиспользуемые ресурсы, right-sizing VM, Reserved Instances. Настройте Budget Alerts на 50%, 80%, 100% от бюджета.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройка Azure окружения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Azure окружение с правильной структурой ресурсов и RBAC.',
      requirements: [
        'Создайте Resource Group для production и dev',
        'Создайте Azure AD группу Developers',
        'Назначьте роль Contributor для группы Developers на dev RG',
        'Назначьте роль Reader для группы Developers на prod RG',
        'Создайте Azure Policy обязывающую наличие тега Environment',
        'Настройте Resource Lock на production RG'
      ],
      hint: 'az group create для Resource Group. az ad group create для AD группы. az role assignment create для RBAC. az policy assignment create для политик.',
      expectedOutput: 'Resource Groups: myapp-prod-rg, myapp-dev-rg созданы.\nAD группа Developers создана.\nDevelopers = Contributor на dev, Reader на prod.\nPolicy: обязательный тег Environment.\nLock CanNotDelete на prod RG.',
      solution: '# Resource Groups\naz group create --name myapp-prod-rg --location westeurope\naz group create --name myapp-dev-rg --location westeurope\n\n# AD Group\nGROUP_ID=$(az ad group create --display-name "Developers" --mail-nickname "devs" --query id -o tsv)\n\n# RBAC\naz role assignment create --assignee-object-id $GROUP_ID \\\n  --role "Contributor" --scope /subscriptions/xxx/resourceGroups/myapp-dev-rg\naz role assignment create --assignee-object-id $GROUP_ID \\\n  --role "Reader" --scope /subscriptions/xxx/resourceGroups/myapp-prod-rg\n\n# Policy\naz policy assignment create --name "require-env-tag" \\\n  --display-name "Require Environment Tag" \\\n  --policy "/providers/Microsoft.Authorization/policyDefinitions/871b6d14-10aa-478d-b466-ef391786b108" \\\n  --params \'{"tagName": {"value": "Environment"}}\' \\\n  --scope /subscriptions/xxx\n\n# Lock\naz lock create --name "no-delete-prod" --lock-type CanNotDelete \\\n  --resource-group myapp-prod-rg',
      explanation: 'Разделение окружений через Resource Groups с разными RBAC правами — стандартная практика Azure. Developers могут изменять ресурсы в dev, но только читать в prod. Policy обеспечивает compliance. Lock защищает от случайного удаления.'
    }
  ]
}
