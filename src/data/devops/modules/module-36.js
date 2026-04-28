export default {
  id: 36,
  title: 'Database DevOps',
  description: 'Автоматизация управления базами данных: миграции, бэкапы, репликация, мониторинг и blue-green деплой БД.',
  lessons: [
    {
      id: 1,
      title: 'Миграции БД: Flyway и Liquibase',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Database Migrations' },
        { type: 'text', value: 'Миграции — это версионирование схемы базы данных. Каждое изменение схемы (новая таблица, колонка, индекс) записывается как миграция и применяется автоматически. Это позволяет воспроизвести БД из любого состояния и откатить изменения.' },
        { type: 'heading', value: 'Flyway' },
        { type: 'code', language: 'bash', value: '# Установка Flyway\nwget -qO- https://download.red-gate.com/maven/release/com/redgate/flyway/flyway-commandline/10.0.0/flyway-commandline-10.0.0-linux-x64.tar.gz | tar xvz\n\n# Структура миграций (в sql/)\n# V1__create_users.sql\n# V2__add_email_to_users.sql\n# V3__create_orders.sql\n# V4__add_index_on_email.sql\n# R__update_views.sql  (repeatable — выполняется каждый раз)' },
        { type: 'code', language: 'bash', value: '# V1__create_users.sql\n# CREATE TABLE users (\n#     id SERIAL PRIMARY KEY,\n#     username VARCHAR(100) NOT NULL UNIQUE,\n#     email VARCHAR(255),\n#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n# );\n\n# V2__add_email_to_users.sql\n# ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);\n# CREATE INDEX idx_users_email ON users(email);\n\n# Применение миграций\nflyway -url=jdbc:postgresql://localhost:5432/mydb \\\n  -user=admin -password=secret \\\n  -locations=filesystem:./sql \\\n  migrate\n\n# Статус миграций\nflyway info\n\n# Проверка (без применения)\nflyway validate' },
        { type: 'heading', value: 'Liquibase' },
        { type: 'code', language: 'yaml', value: '# changelog.yaml (Liquibase)\ndatabaseChangeLog:\n  - changeSet:\n      id: 1\n      author: devops\n      changes:\n        - createTable:\n            tableName: users\n            columns:\n              - column:\n                  name: id\n                  type: SERIAL\n                  constraints:\n                    primaryKey: true\n              - column:\n                  name: username\n                  type: VARCHAR(100)\n                  constraints:\n                    nullable: false\n                    unique: true\n              - column:\n                  name: email\n                  type: VARCHAR(255)\n      rollback:\n        - dropTable:\n            tableName: users\n\n  - changeSet:\n      id: 2\n      author: devops\n      changes:\n        - addColumn:\n            tableName: users\n            columns:\n              - column:\n                  name: phone\n                  type: VARCHAR(20)\n        - createIndex:\n            indexName: idx_users_email\n            tableName: users\n            columns:\n              - column:\n                  name: email' },
        { type: 'tip', value: 'Flyway использует SQL-файлы (проще), Liquibase — XML/YAML/JSON (более мощный, с автоматическим rollback). Для новых проектов Flyway — быстрее начать. Для enterprise с требованиями rollback — Liquibase.' }
      ]
    },
    {
      id: 2,
      title: 'Автоматизация бэкапов',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стратегии бэкапов' },
        { type: 'text', value: 'Регулярные бэкапы — критически важная часть Database DevOps. Стратегия 3-2-1: 3 копии данных, на 2 разных носителях, 1 копия offsite. Автоматизация через cron, Kubernetes CronJob или managed сервисы.' },
        { type: 'code', language: 'bash', value: '# PostgreSQL — pg_dump бэкап\n#!/bin/bash\n# backup.sh\nset -euo pipefail\n\nDB_HOST=${DB_HOST:-localhost}\nDB_NAME=${DB_NAME:-mydb}\nDB_USER=${DB_USER:-admin}\nDATE=$(date +%Y%m%d_%H%M%S)\nBACKUP_DIR=/backups\nFILENAME="${DB_NAME}_${DATE}.sql.gz"\n\n# Создание бэкапа\npg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > "${BACKUP_DIR}/${FILENAME}"\n\n# Загрузка в S3\naws s3 cp "${BACKUP_DIR}/${FILENAME}" "s3://my-backups/postgres/${FILENAME}"\n\n# Удаление локальных бэкапов старше 7 дней\nfind $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete\n\necho "Backup completed: ${FILENAME}"' },
        { type: 'heading', value: 'Kubernetes CronJob для бэкапов' },
        { type: 'code', language: 'yaml', value: '# k8s/backup-cronjob.yaml\napiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: postgres-backup\n  namespace: production\nspec:\n  schedule: "0 2 * * *"  # Каждый день в 2:00\n  concurrencyPolicy: Forbid\n  successfulJobsHistoryLimit: 7\n  failedJobsHistoryLimit: 3\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers:\n            - name: backup\n              image: postgres:16-alpine\n              command: [\"/bin/sh\", \"-c\"]\n              args:\n                - |\n                  pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | \\\n                    gzip > /backups/${DB_NAME}_$(date +%Y%m%d).sql.gz\n              env:\n                - name: DB_HOST\n                  value: postgres-primary\n                - name: DB_NAME\n                  value: mydb\n                - name: DB_USER\n                  value: admin\n                - name: PGPASSWORD\n                  valueFrom:\n                    secretKeyRef:\n                      name: postgres-secret\n                      key: password\n              volumeMounts:\n                - name: backup-storage\n                  mountPath: /backups\n          volumes:\n            - name: backup-storage\n              persistentVolumeClaim:\n                claimName: backup-pvc' },
        { type: 'heading', value: 'Проверка бэкапов (Restore Testing)' },
        { type: 'code', language: 'bash', value: '# ВАЖНО: бэкап без проверки восстановления — не бэкап!\n\n# Автоматическая проверка восстановления\n#!/bin/bash\n# verify-backup.sh\nBACKUP_FILE=$1\nTEST_DB="restore_test_$(date +%s)"\n\n# Создать тестовую БД\ncreatdb -h localhost -U admin $TEST_DB\n\n# Восстановить бэкап\ngunzip -c $BACKUP_FILE | psql -h localhost -U admin -d $TEST_DB\n\n# Проверить данные\nROW_COUNT=$(psql -h localhost -U admin -d $TEST_DB -t -c "SELECT COUNT(*) FROM users;")\nif [ $ROW_COUNT -gt 0 ]; then\n  echo "Restore verification PASSED: $ROW_COUNT rows in users"\nelse\n  echo "Restore verification FAILED!"\n  exit 1\nfi\n\n# Удалить тестовую БД\ndropdb -h localhost -U admin $TEST_DB' },
        { type: 'warning', value: 'Всегда тестируйте восстановление из бэкапа! Настройте автоматическую проверку в CI/CD. Непроверенный бэкап может оказаться повреждённым в момент, когда он нужен больше всего.' }
      ]
    },
    {
      id: 3,
      title: 'Репликация',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Типы репликации' },
        { type: 'text', value: 'Репликация копирует данные между серверами БД для отказоустойчивости, распределения нагрузки и географической близости к пользователям. Основные типы: синхронная (гарантирует консистентность) и асинхронная (быстрее, но возможна потеря данных).' },
        { type: 'code', language: 'bash', value: '# PostgreSQL Streaming Replication\n\n# На PRIMARY сервере:\n# postgresql.conf\n# wal_level = replica\n# max_wal_senders = 10\n# synchronous_standby_names = \'standby1\'\n\n# pg_hba.conf\n# host replication replicator 10.0.0.0/8 scram-sha-256\n\n# Создание пользователя для репликации\nCREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD \'secret\';\n\n# На REPLICA сервере:\npg_basebackup -h primary-host -U replicator -D /var/lib/postgresql/data -P -R\n# -R создаёт standby.signal и настраивает recovery\n\n# postgresql.conf на реплике\n# primary_conninfo = \'host=primary-host user=replicator password=secret\'\n# hot_standby = on  # разрешить read queries' },
        { type: 'heading', value: 'Репликация в Kubernetes (CloudNativePG)' },
        { type: 'code', language: 'yaml', value: '# CloudNativePG — автоматическая репликация\napiVersion: postgresql.cnpg.io/v1\nkind: Cluster\nmetadata:\n  name: mydb\n  namespace: production\nspec:\n  instances: 3  # 1 primary + 2 replicas\n  imageName: ghcr.io/cloudnative-pg/postgresql:16\n\n  postgresql:\n    parameters:\n      max_connections: \"200\"\n      shared_buffers: \"256MB\"\n      effective_cache_size: \"768MB\"\n\n  storage:\n    size: 50Gi\n    storageClass: gp3\n\n  # Автоматический failover\n  failoverDelay: 0\n  primaryUpdateStrategy: unsupervised\n\n  # Read replicas endpoint\n  # mydb-r.production.svc — для read queries\n  # mydb-rw.production.svc — для write queries' },
        { type: 'code', language: 'bash', value: '# Проверка репликации\nkubectl get cluster mydb -n production\n# NAME   INSTANCES   READY   STATUS   PRIMARY\n# mydb   3           3       Healthy  mydb-1\n\n# Статус репликации\nkubectl exec mydb-1 -n production -- \\\n  psql -c "SELECT * FROM pg_stat_replication;"\n\n# Ручной failover\nkubectl cnpg promote mydb-2 -n production\n\n# Endpoints:\n# mydb-rw.production.svc:5432 — Primary (read-write)\n# mydb-r.production.svc:5432  — Replica (read-only)\n# mydb-ro.production.svc:5432 — Read-only (все реплики)' },
        { type: 'tip', value: 'Используйте read replicas для SELECT запросов (отчёты, аналитика). Primary только для INSERT/UPDATE/DELETE. Это распределяет нагрузку и повышает производительность.' }
      ]
    },
    {
      id: 4,
      title: 'Мониторинг БД',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Ключевые метрики базы данных' },
        { type: 'text', value: 'Мониторинг БД включает метрики производительности, доступности и ёмкости. Основные инструменты: postgres_exporter для Prometheus, pgBadger для анализа логов, pg_stat_statements для анализа запросов.' },
        { type: 'code', language: 'bash', value: '# Ключевые метрики PostgreSQL:\n\n# 1. Connections\n# SELECT count(*) FROM pg_stat_activity;  -- текущие соединения\n# SELECT setting FROM pg_settings WHERE name=\'max_connections\'; -- лимит\n\n# 2. Transaction rate\n# SELECT xact_commit + xact_rollback FROM pg_stat_database WHERE datname=\'mydb\';\n\n# 3. Cache hit ratio (должен быть > 99%)\n# SELECT sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100\n# FROM pg_statio_user_tables;\n\n# 4. Replication lag\n# SELECT extract(epoch from now() - pg_last_xact_replay_timestamp());\n\n# 5. Slow queries\n# SELECT query, calls, mean_exec_time, total_exec_time\n# FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;\n\n# 6. Table bloat\n# SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||\'.\'||tablename))\n# FROM pg_tables ORDER BY pg_total_relation_size(schemaname||\'.\'||tablename) DESC;' },
        { type: 'heading', value: 'Prometheus + postgres_exporter' },
        { type: 'code', language: 'yaml', value: '# postgres-exporter Deployment\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: postgres-exporter\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: postgres-exporter\n  template:\n    metadata:\n      labels:\n        app: postgres-exporter\n      annotations:\n        prometheus.io/scrape: \"true\"\n        prometheus.io/port: \"9187\"\n    spec:\n      containers:\n        - name: exporter\n          image: prometheuscommunity/postgres-exporter:latest\n          ports:\n            - containerPort: 9187\n          env:\n            - name: DATA_SOURCE_NAME\n              value: \"postgresql://monitor:secret@postgres-primary:5432/mydb?sslmode=disable\"' },
        { type: 'heading', value: 'Алерты для БД' },
        { type: 'code', language: 'yaml', value: '# Prometheus alert rules для PostgreSQL\ngroups:\n  - name: postgresql\n    rules:\n      - alert: PostgresHighConnections\n        expr: pg_stat_activity_count / pg_settings_max_connections > 0.8\n        for: 5m\n        labels: { severity: warning }\n        annotations:\n          summary: \"PostgreSQL connections > 80%\"\n\n      - alert: PostgresReplicationLag\n        expr: pg_replication_lag > 30\n        for: 5m\n        labels: { severity: critical }\n        annotations:\n          summary: \"Replication lag > 30 seconds\"\n\n      - alert: PostgresLowCacheHitRatio\n        expr: pg_stat_database_blks_hit / (pg_stat_database_blks_hit + pg_stat_database_blks_read) < 0.99\n        for: 15m\n        labels: { severity: warning }\n        annotations:\n          summary: \"Cache hit ratio below 99%\"\n\n      - alert: PostgresDiskUsage\n        expr: pg_database_size_bytes / (50 * 1024 * 1024 * 1024) > 0.85\n        for: 10m\n        labels: { severity: warning }\n        annotations:\n          summary: \"Database size > 85% of allocated storage\"' },
        { type: 'note', value: 'pg_stat_statements — расширение PostgreSQL, которое записывает статистику по всем выполненным запросам. Включите его для обнаружения медленных запросов: shared_preload_libraries = \'pg_stat_statements\'.' }
      ]
    },
    {
      id: 5,
      title: 'Blue-Green Database Deployments',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стратегии обновления схемы БД' },
        { type: 'text', value: 'Изменение схемы БД в production — рискованная операция. Blue-green и expand-contract паттерны позволяют обновлять схему без downtime и с возможностью отката.' },
        { type: 'code', language: 'bash', value: '# Expand-Contract Pattern (рекомендуемый):\n#\n# Шаг 1: EXPAND — добавляем новое, не удаляем старое\n# - Добавить новую колонку email_v2\n# - Добавить код для записи в обе колонки\n# ALTER TABLE users ADD COLUMN email_v2 VARCHAR(255);\n#\n# Шаг 2: MIGRATE — перенести данные\n# UPDATE users SET email_v2 = email WHERE email_v2 IS NULL;\n#\n# Шаг 3: SWITCH — переключить приложение на новую колонку\n# Деплой новой версии приложения, читающей email_v2\n#\n# Шаг 4: CONTRACT — удалить старое (после проверки)\n# ALTER TABLE users DROP COLUMN email;\n# ALTER TABLE users RENAME COLUMN email_v2 TO email;' },
        { type: 'heading', value: 'Безопасные миграции' },
        { type: 'code', language: 'bash', value: '# Правила безопасных миграций:\n\n# БЕЗОПАСНО (backward-compatible):\n# + Добавить колонку с NULL или DEFAULT\n# + Добавить новую таблицу\n# + Добавить индекс CONCURRENTLY\n# + Добавить constraint как NOT VALID\n\n# ОПАСНО (может сломать текущую версию):\n# - Удалить колонку\n# - Переименовать колонку\n# - Изменить тип колонки\n# - Добавить NOT NULL без DEFAULT\n# - Добавить индекс без CONCURRENTLY\n\n# Пример безопасного добавления NOT NULL:\n# 1. Добавить колонку (nullable)\nALTER TABLE users ADD COLUMN status VARCHAR(20);\n\n# 2. Заполнить значения\nUPDATE users SET status = \'active\' WHERE status IS NULL;\n\n# 3. Добавить constraint NOT VALID (не проверяет существующие строки)\nALTER TABLE users ADD CONSTRAINT users_status_not_null\n  CHECK (status IS NOT NULL) NOT VALID;\n\n# 4. Валидировать constraint (не блокирует таблицу)\nALTER TABLE users VALIDATE CONSTRAINT users_status_not_null;\n\n# Безопасный индекс (не блокирует таблицу)\nCREATE INDEX CONCURRENTLY idx_users_status ON users(status);' },
        { type: 'heading', value: 'Blue-Green для БД' },
        { type: 'code', language: 'bash', value: '# Blue-Green Database Deployment:\n#\n# 1. Текущее состояние:\n#    App v1 -> DB Blue (primary)\n#\n# 2. Создать Green реплику:\n#    DB Green = реплика DB Blue (streaming replication)\n#\n# 3. Остановить репликацию и применить миграцию на Green:\n#    SELECT pg_promote() на Green\n#    Применить новую миграцию на Green\n#\n# 4. Переключить приложение:\n#    App v2 -> DB Green (новый primary)\n#\n# 5. Если проблемы — откат:\n#    App v1 -> DB Blue (старый primary)\n#    Синхронизировать данные Green -> Blue\n#\n# ВАЖНО: этот подход работает только для backward-compatible миграций\n# или когда приложение не пишет в обе БД одновременно' },
        { type: 'tip', value: 'Используйте инструменты проверки миграций: squawk для PostgreSQL (линтинг SQL), strong_migrations для Rails. Они предупреждают об опасных операциях: блокирующих ALTER TABLE, отсутствии CONCURRENTLY.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Database DevOps Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте полный Database DevOps pipeline: миграции через Flyway, автоматические бэкапы с проверкой, мониторинг через postgres_exporter.',
      requirements: [
        'Создайте 3 миграции Flyway (create table, add column, add index)',
        'Настройте Kubernetes CronJob для ежедневного бэкапа PostgreSQL',
        'Добавьте Job для автоматической проверки восстановления бэкапа',
        'Настройте postgres_exporter и Prometheus для мониторинга',
        'Создайте алерты: high connections, replication lag, low cache hit',
        'Реализуйте безопасную миграцию по expand-contract паттерну'
      ],
      hint: 'Начните с Flyway миграций V1, V2, V3. CronJob с pg_dump для бэкапа. postgres_exporter для метрик. Алерты через PrometheusRule.',
      expectedOutput: 'flyway info => 3 migrations applied\nkubectl get cronjob => postgres-backup scheduled\nbackup restore test => PASSED\nprometheus targets => postgres-exporter UP\nalert rules => 4 rules loaded',
      solution: '# 1. Миграции\n# V1__create_users.sql\n# CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(100));\n# V2__add_email.sql\n# ALTER TABLE users ADD COLUMN email VARCHAR(255);\n# V3__add_index.sql\n# CREATE INDEX CONCURRENTLY idx_users_email ON users(email);\n\nflyway -url=jdbc:postgresql://db:5432/mydb migrate\n\n# 2. CronJob для бэкапа\n# schedule: "0 2 * * *"\n# command: pg_dump | gzip > /backups/dump.sql.gz\n\n# 3. postgres_exporter\n# image: prometheuscommunity/postgres-exporter\n# DATA_SOURCE_NAME: postgresql://monitor:pass@db:5432/mydb\n\n# 4. Алерты (PrometheusRule)\n# pg_stat_activity_count > 80% max_connections\n# pg_replication_lag > 30s\n# cache_hit_ratio < 99%\n\n# 5. Expand-contract\n# Expand: ALTER TABLE users ADD COLUMN email_new VARCHAR(255);\n# Migrate: UPDATE users SET email_new = email;\n# Switch: деплой v2 (читает email_new)\n# Contract: ALTER TABLE users DROP COLUMN email;',
      explanation: 'Database DevOps автоматизирует управление БД: Flyway для версионированных миграций, CronJob для бэкапов, postgres_exporter для мониторинга, алерты для проактивного реагирования. Expand-contract паттерн позволяет изменять схему без downtime.'
    }
  ]
}
