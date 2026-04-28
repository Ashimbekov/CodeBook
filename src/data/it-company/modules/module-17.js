export default {
  id: 17,
  title: 'Окружения',
  description: 'Зачем нужны разные окружения, как устроены Local, Dev, Staging и Production, управление конфигурацией, секретами и доступами.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны разные окружения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Окружение (environment) — это отдельная копия вашего приложения с собственной базой данных, конфигурацией и инфраструктурой. Разные окружения нужны для того, чтобы тестировать изменения до того, как они попадут к реальным пользователям. Без разных окружений каждое изменение — это эксперимент на живых людях.' },
        { type: 'heading', value: 'Проблемы без разделения окружений' },
        { type: 'list', value: [
          'Разработчик случайно удалил таблицу в базе — упал продакшен',
          'Новая фича тестируется на реальных данных пользователей — нарушение конфиденциальности',
          'Баг в коде отправил 10 000 реальных email клиентам — не откатишь',
          'Нельзя проверить миграцию БД до продакшена — либо работает, либо ночной кошмар',
          'Разработчики мешают друг другу — один тестирует платежи, другой ломает авторизацию'
        ] },
        { type: 'heading', value: 'Принцип изоляции' },
        { type: 'code', language: 'bash', value: '# Каждое окружение изолировано:\n#\n# Production (prod)     — реальные пользователи, реальные деньги\n#   ├── Свой сервер (или кластер серверов)\n#   ├── Своя база данных с реальными данными\n#   ├── Свои API-ключи (платёжные системы, email)\n#   └── Свой домен: app.company.com\n#\n# Staging (stage)       — копия продакшена для финальной проверки\n#   ├── Свой сервер\n#   ├── Своя база данных с тестовыми данными\n#   ├── Тестовые API-ключи (sandbox платёжных систем)\n#   └── Свой домен: staging.company.com\n#\n# Development (dev)     — для разработчиков\n#   ├── Свой сервер (может быть общий)\n#   ├── Своя база данных с seed-данными\n#   └── Свой домен: dev.company.com\n#\n# Local                 — на компьютере разработчика\n#   ├── localhost:3000\n#   ├── Локальная БД в Docker\n#   └── Мок-сервисы вместо реальных API' },
        { type: 'tip', value: 'Золотое правило: staging должен быть максимально похож на production. Те же версии ОС, те же сервисы, та же конфигурация. Если работает на staging — должно работать в проде.' },
        { type: 'note', value: 'Количество окружений зависит от размера компании. Стартап из 3 человек может обойтись local + production. Крупная компания может иметь 5-6 окружений: local, dev, QA, staging, pre-prod, production.' }
      ]
    },
    {
      id: 2,
      title: 'Local, Dev, Staging, Production',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждое окружение имеет свою роль, своих пользователей и свои правила. Рассмотрим классическую четвёрку окружений и что происходит в каждом из них.' },
        { type: 'heading', value: 'Local — рабочее место разработчика' },
        { type: 'code', language: 'bash', value: '# Поднимаем всё локально через Docker Compose\n# docker-compose.yml\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp_dev\n      - REDIS_URL=redis://redis:6379\n      - NODE_ENV=development\n    volumes:\n      - .:/app           # Hot reload — изменения видны сразу\n  db:\n    image: postgres:16\n    ports:\n      - "5432:5432"\n    environment:\n      - POSTGRES_PASSWORD=postgres\n      - POSTGRES_DB=myapp_dev\n  redis:\n    image: redis:7\n    ports:\n      - "6379:6379"\n\n# Запуск:\ndocker compose up -d\nnpm run dev   # http://localhost:3000' },
        { type: 'heading', value: 'Dev — общее окружение для разработки' },
        { type: 'text', value: 'Dev-окружение работает на удалённом сервере. Сюда автоматически деплоится код из develop-ветки. Используется для интеграционного тестирования — когда нужно проверить, как несколько сервисов работают вместе.' },
        { type: 'heading', value: 'Staging — репетиция продакшена' },
        { type: 'text', value: 'Staging — последний рубеж перед продакшеном. Здесь QA проводит финальное тестирование. Конфигурация максимально близка к production: такая же инфраструктура, те же сервисы, но тестовые данные и sandbox API. Сюда деплоится код из main-ветки.' },
        { type: 'heading', value: 'Production — реальный мир' },
        { type: 'code', language: 'bash', value: '# Production — это другой уровень:\n#\n# Масштаб:\n#   Local: 1 инстанс, 0 пользователей\n#   Dev: 1 инстанс, 5 разработчиков\n#   Staging: 1 инстанс, 3 QA-инженера\n#   Production: 5+ инстансов, 50 000 пользователей\n#\n# Данные:\n#   Local: seed-данные (10 пользователей, 100 заказов)\n#   Staging: тестовые данные (1000 пользователей)\n#   Production: реальные данные (500 000 пользователей, 2 млн заказов)\n#\n# Мониторинг:\n#   Local: console.log\n#   Staging: базовый мониторинг\n#   Production: полный мониторинг, алерты, on-call\n#\n# Доступ:\n#   Local: только разработчик\n#   Dev: все разработчики\n#   Staging: разработчики + QA\n#   Production: только DevOps/SRE через CI/CD' },
        { type: 'warning', value: 'Никогда не подключайтесь к production-базе с локального компьютера для "посмотреть что-то". Используйте read-replica или выгрузки. Одна неаккуратная команда DELETE FROM users может стоить компании миллионы.' },
        { type: 'tip', value: 'Многие компании используют preview environments — временные окружения для каждого PR. Vercel, Netlify, Railway создают отдельный деплой для каждого PR, и рецензент видит результат по ссылке прямо в PR.' }
      ]
    },
    {
      id: 3,
      title: 'Environment variables, secrets, конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Один и тот же код работает во всех окружениях, но с разными настройками. URL базы данных, API-ключи, режим отладки — всё это задаётся через переменные окружения (environment variables). Это базовый принцип 12-factor app.' },
        { type: 'heading', value: 'Переменные окружения в разных средах' },
        { type: 'code', language: 'bash', value: '# Local (.env файл — НЕ коммитится в git!)\nDATABASE_URL=postgresql://localhost:5432/myapp_dev\nREDIS_URL=redis://localhost:6379\nAPI_KEY=test_key_123\nNODE_ENV=development\nLOG_LEVEL=debug\nSMTP_HOST=localhost:1025        # MailHog — ловит все письма локально\nPAYMENT_API=https://sandbox.stripe.com\n\n# Staging (в CI/CD или Kubernetes secrets)\nDATABASE_URL=postgresql://staging-db:5432/myapp_staging\nREDIS_URL=redis://staging-redis:6379\nAPI_KEY=staging_key_456\nNODE_ENV=production             # Да, staging тоже production mode!\nLOG_LEVEL=info\nSMTP_HOST=smtp.sendgrid.net\nPAYMENT_API=https://sandbox.stripe.com\n\n# Production (в Vault или Cloud Secrets Manager)\nDATABASE_URL=postgresql://prod-db-cluster:5432/myapp\nREDIS_URL=redis://prod-redis-cluster:6379\nAPI_KEY=live_key_789_real       # РЕАЛЬНЫЙ ключ!\nNODE_ENV=production\nLOG_LEVEL=warn\nSMTP_HOST=smtp.sendgrid.net\nPAYMENT_API=https://api.stripe.com  # РЕАЛЬНЫЕ платежи!' },
        { type: 'heading', value: 'Как хранить секреты' },
        { type: 'list', value: [
          '.env файл — только для локальной разработки, добавлен в .gitignore',
          '.env.example — шаблон с фейковыми значениями, коммитится в git',
          'GitHub Secrets — для CI/CD pipeline (Settings → Secrets)',
          'Kubernetes Secrets — для контейнеров в кластере',
          'HashiCorp Vault — централизованное хранилище секретов для больших компаний',
          'AWS Secrets Manager / GCP Secret Manager — облачные хранилища секретов'
        ] },
        { type: 'heading', value: '.env.example — документация для новых разработчиков' },
        { type: 'code', language: 'bash', value: '# .env.example (коммитится в git)\n# Скопировать в .env и заполнить реальными значениями\n\n# База данных\nDATABASE_URL=postgresql://localhost:5432/myapp_dev\n\n# Redis\nREDIS_URL=redis://localhost:6379\n\n# API ключи (получить у тимлида)\nSTRIPE_API_KEY=sk_test_xxx\nSENDGRID_API_KEY=SG.xxx\n\n# JWT\nJWT_SECRET=any-random-string-for-local-dev\n\n# Режим\nNODE_ENV=development\nLOG_LEVEL=debug' },
        { type: 'warning', value: 'Если вы случайно закоммитили секрет в git — недостаточно удалить его в следующем коммите. Секрет остаётся в истории git. Нужно: 1) Немедленно отозвать/перегенерировать ключ, 2) Очистить историю git (git filter-branch или BFG Repo-Cleaner).' },
        { type: 'tip', value: 'Используйте pre-commit хуки для проверки: git-secrets, detect-secrets, gitleaks сканируют коммиты на наличие API-ключей, паролей и токенов до того, как они попадут в репозиторий.' }
      ]
    },
    {
      id: 4,
      title: 'Базы данных в разных окружениях — миграции, seed data',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждое окружение имеет свою базу данных. Но структура таблиц должна быть одинаковой везде. Для этого используются миграции — скрипты, которые последовательно изменяют схему БД. А для тестовых данных используется seed data.' },
        { type: 'heading', value: 'Что такое миграции' },
        { type: 'code', language: 'bash', value: '# Миграция — файл с SQL или кодом, который изменяет схему БД\n# Миграции применяются последовательно: 001 → 002 → 003 → ...\n\n# Пример миграций (Prisma, Knex, Flyway, Liquibase):\nmigrations/\n  001_create_users.sql\n  002_add_email_to_users.sql\n  003_create_orders.sql\n  004_add_index_on_orders_user_id.sql\n\n# 001_create_users.sql\n# -- Up\n# CREATE TABLE users (\n#   id SERIAL PRIMARY KEY,\n#   name VARCHAR(255) NOT NULL,\n#   created_at TIMESTAMP DEFAULT NOW()\n# );\n# -- Down\n# DROP TABLE users;\n\n# 002_add_email_to_users.sql\n# -- Up\n# ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;\n# -- Down\n# ALTER TABLE users DROP COLUMN email;\n\n# Применение миграций:\nnpx prisma migrate deploy        # Prisma\nnpx knex migrate:latest           # Knex\nflyway migrate                    # Flyway (Java)\npython manage.py migrate          # Django' },
        { type: 'heading', value: 'Миграции в разных окружениях' },
        { type: 'code', language: 'bash', value: '# Порядок применения миграций:\n# 1. Разработчик создаёт миграцию локально\nnpx prisma migrate dev --name add_email_to_users\n# Применяется к локальной БД, генерирует SQL-файл\n\n# 2. Миграция коммитится в git вместе с кодом\ngit add prisma/migrations/\ngit commit -m "migration: add email to users"\n\n# 3. CI/CD применяет миграцию на staging\n# В pipeline: npx prisma migrate deploy\n\n# 4. При деплое в production — та же миграция\n# npx prisma migrate deploy (идемпотентно — пропускает уже применённые)\n\n# Таблица _prisma_migrations отслеживает что уже применено:\n# | id | migration_name           | applied_at          |\n# | 1  | 001_create_users          | 2024-01-15 10:00:00 |\n# | 2  | 002_add_email_to_users    | 2024-01-20 14:30:00 |' },
        { type: 'heading', value: 'Seed data — тестовые данные' },
        { type: 'code', language: 'bash', value: '# Seed — начальные данные для разработки и тестирования\n# НЕ применяются в production!\n\n# prisma/seed.ts\n# import { PrismaClient } from "@prisma/client"\n# const prisma = new PrismaClient()\n#\n# async function main() {\n#   // Тестовые пользователи\n#   await prisma.user.createMany({\n#     data: [\n#       { name: "Алексей", email: "alex@test.com", role: "admin" },\n#       { name: "Мария", email: "maria@test.com", role: "user" },\n#       { name: "Тест Платежей", email: "payment@test.com", role: "user" },\n#     ]\n#   })\n#   // Тестовые заказы\n#   await prisma.order.createMany({ ... })\n# }\n\n# Запуск:\nnpx prisma db seed              # Заполнить тестовыми данными\nnpx prisma migrate reset        # Сбросить БД + применить миграции + seed' },
        { type: 'warning', value: 'Никогда не запускайте деструктивные миграции (DROP TABLE, DROP COLUMN) в продакшене без подготовки. Сначала убедитесь, что код не использует удаляемые поля. Используйте стратегию expand-and-contract: 1) добавить новое, 2) перенести данные, 3) обновить код, 4) удалить старое.' },
        { type: 'tip', value: 'Для staging можно использовать анонимизированную копию production-данных. Это даёт реалистичный объём данных для тестирования без риска утечки персональных данных.' }
      ]
    },
    {
      id: 5,
      title: 'Доступы к окружениям — кто куда может',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не все должны иметь доступ ко всему. Принцип минимальных привилегий (least privilege) — каждый получает доступ только к тому, что нужно для работы. Это защищает от ошибок и утечек данных.' },
        { type: 'heading', value: 'Матрица доступов' },
        { type: 'code', language: 'bash', value: '# Типичная матрица доступов в IT-компании:\n#\n# Окружение    | Junior Dev | Senior Dev | QA    | DevOps | PM\n# -------------|------------|------------|-------|--------|------\n# Local        | Полный     | Полный     | —     | —      | —\n# Dev          | Read+Write | Read+Write | Read  | Admin  | —\n# Staging      | Read       | Read+Write | R+W   | Admin  | Read\n# Production   | —          | Read-only  | —     | Admin  | —\n# Prod DB      | —          | —          | —     | Admin  | —\n# Prod Logs    | Read       | Read       | Read  | Admin  | —\n# Monitoring   | Read       | Read       | Read  | Admin  | Read\n\n# "Read-only" к production означает:\n# - Можно смотреть логи\n# - Можно смотреть метрики\n# - Нельзя деплоить, менять конфигурацию, трогать данные\n# - Нельзя подключаться к БД напрямую' },
        { type: 'heading', value: 'Как организовать доступы' },
        { type: 'list', value: [
          'VPN — доступ к внутренним окружениям только через VPN',
          'SSH ключи — персональные ключи для каждого, не shared-аккаунты',
          'IAM роли (AWS/GCP) — роли вместо персональных credentials',
          'Kubernetes RBAC — роли и разрешения на уровне кластера',
          'Audit log — запись всех действий: кто, когда, что делал',
          'Break glass — экстренный доступ с обязательным логированием и уведомлением'
        ] },
        { type: 'heading', value: 'GitHub Environment Protection Rules' },
        { type: 'code', language: 'bash', value: '# GitHub Actions позволяет защитить окружения:\n#\n# Settings → Environments → production:\n#   ✅ Required reviewers: @devops-team (нужно одобрение)\n#   ✅ Wait timer: 5 minutes (время на отмену)\n#   ✅ Deployment branches: main only\n#   ✅ Required secrets: PROD_DB_URL, PROD_API_KEY\n#\n# В workflow:\njobs:\n  deploy-production:\n    environment: production    # Требует одобрения!\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Deploying to production"\n        env:\n          DB_URL: ${{ secrets.PROD_DB_URL }}\n\n# Результат:\n# При деплое в production GitHub покажет:\n# "Waiting for review from @devops-team"\n# DevOps нажимает Approve → деплой продолжается' },
        { type: 'heading', value: 'Доступ к production-базе' },
        { type: 'code', language: 'bash', value: '# Прямой доступ к production-базе — крайне ограничен\n# Вместо этого используются:\n\n# 1. Read Replica — копия БД только для чтения\n# Разработчики могут подключиться для анализа\npsql -h prod-read-replica.company.com -U readonly myapp\n\n# 2. Внутренняя admin-панель\n# Безопасный UI для просмотра данных, без SQL\n# admin.company.com → поиск пользователя → смотрим заказы\n\n# 3. Data Export\n# Запрос через тикет: "Нужна выгрузка заказов за январь"\n# DevOps запускает скрипт → отправляет CSV → логирует запрос\n\n# 4. Bastion host (jump server)\n# Единственная точка входа в production-сеть\n# ssh -J bastion.company.com prod-db\n# Все сессии записываются и мониторятся' },
        { type: 'warning', value: 'Shared-аккаунты (deploy@company.com, admin/admin123) — антипаттерн. Если произошёл инцидент, невозможно определить, кто выполнил действие. Каждый человек — персональный аккаунт с аудитом.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Спроектировать окружения для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вы — DevOps-инженер в стартапе из 10 разработчиков. Проект — маркетплейс (покупки, платежи, уведомления). Нужно спроектировать окружения: какие, зачем, с какими доступами и конфигурацией.',
      requirements: [
        'Определить количество и назначение окружений (минимум 3)',
        'Для каждого окружения описать: назначение, кто имеет доступ, какие данные',
        'Описать стратегию управления переменными окружения и секретами',
        'Описать подход к миграциям БД — как они проходят через окружения',
        'Составить матрицу доступов для ролей: Junior Dev, Senior Dev, QA, DevOps, PM',
        'Описать правила работы с production-данными'
      ],
      hint: 'Начните с трёх окружений: Local, Staging, Production. Для маркетплейса важно: sandbox платёжной системы на staging, анонимизированные данные для тестирования, read-replica для аналитики.',
      expectedOutput: 'Окружения:\n1. Local — Docker Compose, seed data, MailHog, Stripe sandbox\n2. Staging — AWS, тестовые данные, Stripe sandbox, доступ команде\n3. Production — AWS (HA), реальные данные, Stripe live, ограниченный доступ\n\nСекреты: .env (local), AWS Secrets Manager (staging/prod)\nМиграции: local → PR review → staging (auto) → prod (manual approval)\nProd DB: только через read-replica, прямой доступ у DevOps\nМатрица доступов: Junior — до staging read-only, Senior — staging R/W + prod logs',
      solution: '# Проектирование окружений для маркетплейса\n\n# 1. ОКРУЖЕНИЯ\n# Local:\n#   - Docker Compose: app, postgres, redis, minio (S3), mailhog\n#   - Seed data: 10 пользователей, 50 товаров, 20 заказов\n#   - Stripe test mode (sk_test_xxx)\n#   - Hot reload для быстрой разработки\n#\n# Staging:\n#   - AWS: ECS/EKS, RDS PostgreSQL, ElastiCache Redis\n#   - Анонимизированная копия prod-данных (раз в неделю)\n#   - Stripe sandbox (тестовые платежи)\n#   - staging.marketplace.com (за VPN)\n#   - Авто-деплой при мёрже в main\n#\n# Production:\n#   - AWS: ECS/EKS (3 инстанса min), RDS Multi-AZ, ElastiCache cluster\n#   - Реальные данные, реальные платежи (Stripe live)\n#   - marketplace.com\n#   - Деплой через CI/CD с ручным одобрением DevOps\n\n# 2. СЕКРЕТЫ\n# Local: .env файл (в .gitignore), .env.example в git\n# Staging/Prod: AWS Secrets Manager\n# CI/CD: GitHub Secrets (STAGING_DB_URL, PROD_DB_URL)\n# Ротация ключей: каждые 90 дней автоматически\n\n# 3. МИГРАЦИИ\n# Разработчик создаёт миграцию → коммит в PR\n# Code review: проверяют SQL (нет DROP без подготовки)\n# Мёрж в main → миграция применяется на staging автоматически\n# QA тестирует на staging\n# Деплой в prod → миграция применяется перед кодом\n# Опасные миграции: expand-and-contract за 2 деплоя\n\n# 4. МАТРИЦА ДОСТУПОВ\n# Роль       | Local | Staging | Prod   | Prod DB | Logs\n# Junior Dev | Full  | Read    | —      | —       | Read\n# Senior Dev | Full  | R/W     | —      | Replica | Read\n# QA         | —     | R/W     | —      | —       | Read\n# DevOps     | Full  | Admin   | Admin  | Full    | Full\n# PM         | —     | Read    | —      | —       | Read\n\n# 5. ПРАВИЛА PRODUCTION\n# - Прямой доступ к prod DB только у DevOps (через bastion)\n# - Разработчики используют read-replica для диагностики\n# - Data export через тикет (логируется)\n# - Все действия в prod записываются в audit log\n# - Break glass: экстренный доступ с уведомлением CTO',
      explanation: 'Три окружения — оптимальный баланс для стартапа из 10 человек. Больше окружений — больше расходов на инфраструктуру и поддержку. Local для разработки, Staging для тестирования, Production для пользователей. Ключевое: Stripe sandbox на staging (не тратить реальные деньги при тестировании), read-replica вместо прямого доступа к prod DB, матрица доступов по принципу least privilege.'
    }
  ]
}
