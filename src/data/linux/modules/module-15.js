export default {
  id: 15,
  title: 'Базы данных на Linux',
  description: 'Установка и настройка PostgreSQL и MySQL на Linux. Бэкап, восстановление, репликация, мониторинг.',
  lessons: [
    {
      id: 1,
      title: 'PostgreSQL: установка и настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'PostgreSQL — мощная реляционная СУБД с открытым исходным кодом. Стандарт для production-приложений. Работает от системного пользователя postgres.' },
        { type: 'code', language: 'bash', value: '# Установка PostgreSQL:\nsudo apt update\nsudo apt install postgresql postgresql-client\n\n# Статус:\nsudo systemctl status postgresql\nsudo systemctl enable postgresql\n\n# PostgreSQL работает от пользователя postgres:\nsudo -u postgres psql\n# psql (15.4)\n# postgres=#\n\n# Основные команды psql:\n# \\l        — список баз данных\n# \\dt       — список таблиц\n# \\du       — список пользователей\n# \\c dbname — подключиться к базе\n# \\q        — выйти\n\n# Создать пользователя и базу:\nsudo -u postgres createuser --interactive myuser\nsudo -u postgres createdb -O myuser mydb\n\n# Или через SQL:\nsudo -u postgres psql\nCREATE USER myuser WITH PASSWORD \'secure_password\';\nCREATE DATABASE mydb OWNER myuser;\nGRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;\n\\q\n\n# Подключение:\npsql -U myuser -d mydb -h localhost' },
        { type: 'tip', value: 'По умолчанию PostgreSQL использует peer-аутентификацию (системный пользователь = пользователь БД). Для подключения по паролю измените pg_hba.conf: peer -> md5 или scram-sha-256.' }
      ]
    },
    {
      id: 2,
      title: 'PostgreSQL: конфигурация и безопасность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основные файлы конфигурации PostgreSQL: postgresql.conf (настройки сервера) и pg_hba.conf (аутентификация и доступ).' },
        { type: 'code', language: 'bash', value: '# Файлы конфигурации:\nsudo -u postgres psql -c "SHOW config_file;"\n# /etc/postgresql/15/main/postgresql.conf\n\nsudo -u postgres psql -c "SHOW hba_file;"\n# /etc/postgresql/15/main/pg_hba.conf\n\n# postgresql.conf — ключевые параметры:\n# listen_addresses = \'localhost\'     # на каких адресах слушать\n# port = 5432                       # порт\n# max_connections = 100              # максимум соединений\n# shared_buffers = 256MB            # буфер в RAM (25% RAM)\n# work_mem = 16MB                   # память для сортировок\n# maintenance_work_mem = 128MB      # для VACUUM, CREATE INDEX\n# wal_level = replica               # для репликации\n# log_statement = \'all\'             # логирование SQL\n\n# pg_hba.conf — доступ:\n# TYPE  DATABASE  USER  ADDRESS       METHOD\n# local all       all                 peer\n# host  all       all   127.0.0.1/32  scram-sha-256\n# host  mydb      myuser 10.0.0.0/8  scram-sha-256\n\n# Применить изменения:\nsudo systemctl reload postgresql\n# или:\nsudo -u postgres psql -c "SELECT pg_reload_conf();"' },
        { type: 'note', value: 'shared_buffers — самый важный параметр производительности. Рекомендация: 25% от общего RAM. Для 16 GB RAM установите shared_buffers = 4GB.' }
      ]
    },
    {
      id: 3,
      title: 'MySQL/MariaDB: установка и настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'MySQL — популярная СУБД (Oracle). MariaDB — свободный форк MySQL, полностью совместимый. На серверах часто используется MariaDB как drop-in замена MySQL.' },
        { type: 'code', language: 'bash', value: '# Установка MySQL:\nsudo apt install mysql-server\n\n# Или MariaDB:\nsudo apt install mariadb-server\n\n# Безопасная первоначальная настройка:\nsudo mysql_secure_installation\n# Установит root пароль, удалит test БД, запретит удалённый root\n\n# Подключение:\nsudo mysql                  # от root без пароля (auth_socket)\nmysql -u myuser -p mydb    # от пользователя с паролем\n\n# Создать пользователя и базу:\nsudo mysql\nCREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nCREATE USER \'myuser\'@\'localhost\' IDENTIFIED BY \'secure_password\';\nGRANT ALL PRIVILEGES ON mydb.* TO \'myuser\'@\'localhost\';\nFLUSH PRIVILEGES;\nEXIT;\n\n# Конфигурация: /etc/mysql/mysql.conf.d/mysqld.cnf\n# bind-address = 127.0.0.1\n# max_connections = 150\n# innodb_buffer_pool_size = 1G    # 70% RAM для выделенного сервера\n\nsudo systemctl restart mysql' },
        { type: 'tip', value: 'Всегда запускайте mysql_secure_installation после установки MySQL/MariaDB. Это базовая настройка безопасности: удаление test-базы, отключение удалённого root, установка пароля root.' }
      ]
    },
    {
      id: 4,
      title: 'Бэкап и восстановление баз данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Регулярные бэкапы баз данных — критически важная задача администратора. Потеря данных без бэкапа — катастрофа. Используйте pg_dump (PostgreSQL) и mysqldump (MySQL).' },
        { type: 'code', language: 'bash', value: '# PostgreSQL бэкап:\nsudo -u postgres pg_dump mydb > mydb_backup.sql\nsudo -u postgres pg_dump -Fc mydb > mydb_backup.dump   # custom формат (сжатый)\nsudo -u postgres pg_dumpall > all_databases.sql        # все базы\n\n# PostgreSQL восстановление:\nsudo -u postgres psql mydb < mydb_backup.sql\nsudo -u postgres pg_restore -d mydb mydb_backup.dump\n\n# MySQL бэкап:\nmysqldump -u root -p mydb > mydb_backup.sql\nmysqldump -u root -p --all-databases > all_backup.sql\nmysqldump -u root -p mydb --single-transaction > mydb_backup.sql\n\n# MySQL восстановление:\nmysql -u root -p mydb < mydb_backup.sql\n\n# Автоматический бэкап (cron):\nsudo crontab -e\n# PostgreSQL — каждый день в 3:00:\n# 0 3 * * * sudo -u postgres pg_dump -Fc mydb > /backup/mydb-$(date +\\%Y\\%m\\%d).dump 2>&1 | logger -t pg_backup\n\n# Ротация бэкапов (удалять старше 30 дней):\nfind /backup -name "mydb-*.dump" -mtime +30 -delete' },
        { type: 'heading', value: 'Скрипт бэкапа' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# /usr/local/bin/db-backup.sh\nset -euo pipefail\n\nBACKUP_DIR="/backup/postgres"\nDATE=$(date +%Y%m%d_%H%M%S)\nRETENTION_DAYS=30\nDATABASES=("mydb" "analytics")\n\nmkdir -p "$BACKUP_DIR"\n\nfor DB in "${DATABASES[@]}"; do\n    FILENAME="$BACKUP_DIR/${DB}_${DATE}.dump"\n    sudo -u postgres pg_dump -Fc "$DB" > "$FILENAME"\n    echo "[$(date)] Бэкап $DB создан: $FILENAME ($(du -h "$FILENAME" | cut -f1))"\ndone\n\n# Удалить старые бэкапы\nfind "$BACKUP_DIR" -name "*.dump" -mtime +$RETENTION_DAYS -delete\necho "[$(date)] Очистка бэкапов старше $RETENTION_DAYS дней"' },
        { type: 'tip', value: 'pg_dump -Fc (custom format) — лучший формат для бэкапов PostgreSQL. Сжатый, поддерживает параллельное восстановление, выборочное восстановление таблиц. --single-transaction для mysqldump обеспечивает консистентность.' }
      ]
    },
    {
      id: 5,
      title: 'Репликация PostgreSQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Репликация — копирование данных с основного сервера (primary) на реплики (standby). Обеспечивает отказоустойчивость и масштабирование чтения. PostgreSQL поддерживает streaming replication.' },
        { type: 'code', language: 'bash', value: '# На PRIMARY сервере:\n\n# 1. Создать пользователя для репликации:\nsudo -u postgres psql\nCREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD \'repl_password\';\n\n# 2. postgresql.conf:\n# wal_level = replica\n# max_wal_senders = 5\n# wal_keep_size = 1GB\n\n# 3. pg_hba.conf:\n# host replication replicator 10.0.0.0/24 scram-sha-256\n\nsudo systemctl reload postgresql\n\n# На STANDBY сервере:\n\n# 1. Остановить PostgreSQL:\nsudo systemctl stop postgresql\n\n# 2. Удалить данные и скопировать с primary:\nsudo rm -rf /var/lib/postgresql/15/main/*\nsudo -u postgres pg_basebackup -h 10.0.0.1 -U replicator -D /var/lib/postgresql/15/main/ -Fp -Xs -P\n\n# 3. Создать standby.signal:\nsudo -u postgres touch /var/lib/postgresql/15/main/standby.signal\n\n# 4. postgresql.conf на standby:\n# primary_conninfo = \'host=10.0.0.1 user=replicator password=repl_password\'\n\n# 5. Запустить:\nsudo systemctl start postgresql\n\n# Проверить репликацию (на primary):\nsudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"' },
        { type: 'note', value: 'Standby сервер доступен только для чтения. При падении primary можно промоутить standby: sudo -u postgres pg_ctl promote. Для автоматического failover используйте Patroni или repmgr.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Администрирование БД',
      type: 'practice',
      difficulty: 'medium',
      description: 'Установите PostgreSQL, создайте базу данных и настройте бэкапы.',
      requirements: [
        'Установите PostgreSQL и проверьте его статус',
        'Создайте пользователя appuser и базу данных appdb',
        'Создайте таблицу и вставьте тестовые данные',
        'Выполните бэкап базы данных с помощью pg_dump',
        'Восстановите базу из бэкапа в новую базу',
        'Напишите скрипт автоматического ежедневного бэкапа'
      ],
      hint: 'sudo -u postgres createuser/createdb для создания. pg_dump -Fc для бэкапа. createdb + pg_restore для восстановления. Используйте cron или systemd timer для автоматизации.',
      expectedOutput: 'PostgreSQL active (running)\nappuser и appdb созданы\nТаблица users с тестовыми данными\nБэкап: appdb_backup.dump (250 KB)\nВосстановлено в appdb_restored\nСкрипт бэкапа в crontab: каждый день в 3:00',
      solution: '# 1. Установка\nsudo apt install -y postgresql postgresql-client\nsudo systemctl enable --now postgresql\nsudo systemctl status postgresql\n\n# 2. Пользователь и база\nsudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD \'app_password\';"\nsudo -u postgres psql -c "CREATE DATABASE appdb OWNER appuser;"\n\n# 3. Таблица и данные\nsudo -u postgres psql -d appdb -c "\nCREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100),\n    created_at TIMESTAMP DEFAULT NOW()\n);\nINSERT INTO users (name, email) VALUES\n    (\'Alice\', \'alice@example.com\'),\n    (\'Bob\', \'bob@example.com\'),\n    (\'Charlie\', \'charlie@example.com\');\n"\n\n# 4. Бэкап\nsudo -u postgres pg_dump -Fc appdb > /tmp/appdb_backup.dump\nls -lh /tmp/appdb_backup.dump\n\n# 5. Восстановление\nsudo -u postgres createdb appdb_restored\nsudo -u postgres pg_restore -d appdb_restored /tmp/appdb_backup.dump\nsudo -u postgres psql -d appdb_restored -c "SELECT * FROM users;"\n\n# 6. Автоматический бэкап\nsudo tee /usr/local/bin/pg-backup.sh << \'EOF\'\n#!/bin/bash\nBACKUP_DIR="/backup/postgres"\nmkdir -p "$BACKUP_DIR"\nsudo -u postgres pg_dump -Fc appdb > "$BACKUP_DIR/appdb-$(date +%Y%m%d).dump"\nfind "$BACKUP_DIR" -name "*.dump" -mtime +30 -delete\nEOF\nsudo chmod +x /usr/local/bin/pg-backup.sh\necho "0 3 * * * /usr/local/bin/pg-backup.sh" | sudo crontab -',
      explanation: 'PostgreSQL создаёт системного пользователя postgres при установке. pg_dump -Fc создаёт сжатый бэкап. pg_restore восстанавливает в существующую базу. Cron запускает бэкап ежедневно в 3:00. find -mtime +30 -delete удаляет бэкапы старше 30 дней.'
    }
  ]
}
