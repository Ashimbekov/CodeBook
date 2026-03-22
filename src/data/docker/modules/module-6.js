export default {
  id: 6,
  title: 'Volumes и хранение данных',
  description: 'Типы хранилищ в Docker: bind mounts, named volumes, tmpfs. Управление данными контейнеров, backup и restore volumes, драйверы хранилищ.',
  lessons: [
    {
      id: 1,
      title: 'Проблема хранения данных в контейнерах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контейнеры эфемерны: все данные внутри контейнера теряются при его удалении. Для сохранения данных Docker предоставляет три механизма: named volumes, bind mounts и tmpfs. Выбор механизма зависит от задачи.' },
        { type: 'code', language: 'bash', value: '# Демонстрация эфемерности контейнера:\ndocker run ubuntu bash -c "echo data > /tmp/test.txt && cat /tmp/test.txt"\n# data\n\n# Создаём НОВЫЙ контейнер — данных нет:\ndocker run ubuntu bash -c "cat /tmp/test.txt"\n# cat: /tmp/test.txt: No such file or directory\n\n# Три типа хранилищ Docker:\n# 1. Named Volume  — управляется Docker, хранится в /var/lib/docker/volumes/\n# 2. Bind Mount    — директория с хоста монтируется в контейнер\n# 3. tmpfs         — хранится в памяти, не сохраняется вообще\n\n# Сравнение:\n# Named Volume:\n#   + Управляется Docker, переносимый\n#   + Легко backup/restore\n#   - Нельзя легко редактировать с хоста\n\n# Bind Mount:\n#   + Прямой доступ к файлам хоста\n#   + Идеален для разработки\n#   - Зависит от структуры файловой системы хоста\n\n# tmpfs:\n#   + Быстрый (в памяти)\n#   + Не пишет на диск (безопасность)\n#   - Данные теряются при остановке контейнера' },
        { type: 'tip', value: 'Для production баз данных и stateful приложений: Named Volumes. Для разработки (hot reload кода): Bind Mounts. Для временных секретов и кэша: tmpfs.' }
      ]
    },
    {
      id: 2,
      title: 'Named Volumes — управляемые хранилища',
      type: 'theory',
      content: [
        { type: 'text', value: 'Named volumes — основной способ хранения данных в Docker. Docker сам управляет где и как хранятся данные. Volumes существуют независимо от контейнеров и переживают их удаление.' },
        { type: 'code', language: 'bash', value: '# Создать volume:\ndocker volume create mydata\n\n# Список volumes:\ndocker volume ls\n# DRIVER    VOLUME NAME\n# local     mydata\n\n# Информация о volume:\ndocker volume inspect mydata\n# [\n#   {\n#     "Name": "mydata",\n#     "Driver": "local",\n#     "Mountpoint": "/var/lib/docker/volumes/mydata/_data",\n#     "CreatedAt": "2024-01-15T10:00:00Z"\n#   }\n# ]\n\n# Использовать volume в контейнере:\ndocker run -v mydata:/data ubuntu bash -c "echo hello > /data/file.txt"\n\n# Данные сохраняются после удаления контейнера:\ndocker run -v mydata:/data ubuntu cat /data/file.txt\n# hello\n\n# Новый синтаксис --mount (более явный):\ndocker run --mount type=volume,source=mydata,target=/data ubuntu ls /data\n\n# Анонимный volume (автоимя):\ndocker run -v /data ubuntu\n# Создаётся volume с UUID именем\n\n# Удалить volume:\ndocker volume rm mydata\n# Нельзя удалить используемый volume!\n\n# Удалить все неиспользуемые volumes:\ndocker volume prune' },
        { type: 'note', value: 'Named volumes на Linux хранятся в /var/lib/docker/volumes/. На macOS/Windows — внутри Linux VM Docker Desktop. Доступ к данным напрямую с хоста macOS/Windows невозможен без запуска контейнера.' }
      ]
    },
    {
      id: 3,
      title: 'Bind Mounts — монтирование директорий хоста',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bind mount монтирует директорию или файл с хоста в контейнер. Изменения видны с обеих сторон немедленно. Идеален для разработки: редактируешь код на хосте — изменения доступны в контейнере.' },
        { type: 'code', language: 'bash', value: '# Bind mount — монтировать текущую директорию:\ndocker run -v $(pwd):/app node:18 node /app/index.js\n\n# Или абсолютный путь:\ndocker run -v /home/user/project:/app node:18 bash\n\n# Новый синтаксис --mount:\ndocker run --mount type=bind,source=$(pwd),target=/app node:18 bash\n\n# Режим readonly (контейнер не может писать):\ndocker run -v $(pwd):/app:ro node:18 ls /app\n\n# Пример: разработка с hot reload:\ndocker run -d \\\n  --name dev-server \\\n  -v $(pwd):/app \\\n  -w /app \\\n  -p 3000:3000 \\\n  node:18 \\\n  npm run dev\n# Теперь редактируй код — сервер перезапустится автоматически\n\n# Монтировать отдельный файл:\ndocker run -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx\n\n# Важно: если директория в контейнере существует,\n# bind mount СКРЫВАЕТ её содержимое!\ndocker run -v $(pwd)/empty:/usr/local/lib node:18 ls /usr/local/lib\n# (пусто — содержимое образа скрыто!)\n\n# Проверить монтирования контейнера:\ndocker inspect mycontainer | grep -A 20 Mounts' },
        { type: 'warning', value: 'На macOS bind mounts работают медленнее из-за виртуализации. Для production не используй bind mounts — приложение зависит от структуры файловой системы хоста. На Windows пути: -v C:/Users/name/project:/app (с прямыми слэшами).' }
      ]
    },
    {
      id: 4,
      title: 'tmpfs — хранение в памяти',
      type: 'theory',
      content: [
        { type: 'text', value: 'tmpfs монтирует директорию в оперативную память контейнера. Данные не пишутся на диск и полностью исчезают при остановке контейнера. Используется для временных данных и секретов.' },
        { type: 'code', language: 'bash', value: '# Создать tmpfs mount:\ndocker run --tmpfs /tmp ubuntu df -h /tmp\n# Filesystem      Size  Used Avail Use% Mounted on\n# tmpfs            64M     0   64M   0% /tmp\n\n# С параметрами:\ndocker run --mount type=tmpfs,target=/tmp,tmpfs-size=100m ubuntu df -h /tmp\n\n# Параметры tmpfs:\n# tmpfs-size    — максимальный размер (в байтах, поддерживает m/g)\n# tmpfs-mode    — режим доступа (по умолчанию 1777)\n\n# Использование для секретов (не пишутся на диск):\ndocker run \\\n  --tmpfs /run/secrets:ro,size=1m \\\n  myapp\n\n# Проверить тип монтирования:\ndocker inspect mycontainer --format \"{{json .HostConfig.Tmpfs}}\"\n\n# Пример: кэш сессий Redis в tmpfs (для скорости):\ndocker run -d \\\n  --name session-cache \\\n  --tmpfs /data:size=256m \\\n  redis redis-server --dir /tmp --save ""\n\n# tmpfs vs RAM диск:\n# tmpfs автоматически использует swap если нужно\n# Размер не резервируется — только при записи\n# Производительность: близка к скорости памяти' },
        { type: 'tip', value: 'tmpfs полезен для: сессий пользователей, временных файлов обработки, кэша который не нужно сохранять, секретных данных которые не должны попасть на диск. Используй в связке с named volumes для смешанных сценариев.' }
      ]
    },
    {
      id: 5,
      title: 'Backup, restore и миграция volumes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Named volumes нужно регулярно бэкапить. Стандартный подход: запустить временный контейнер который монтирует volume и tar-архивирует его содержимое. Для миграции: backup на старом сервере, restore на новом.' },
        { type: 'code', language: 'bash', value: '# Backup volume в tar-архив:\ndocker run --rm \\\n  -v mydata:/data \\\n  -v $(pwd):/backup \\\n  ubuntu \\\n  tar czf /backup/mydata-backup.tar.gz -C /data .\n# Создаёт mydata-backup.tar.gz в текущей директории\n\n# Restore volume из архива:\n# Сначала создать чистый volume:\ndocker volume create mydata-restored\n\n# Восстановить:\ndocker run --rm \\\n  -v mydata-restored:/data \\\n  -v $(pwd):/backup \\\n  ubuntu \\\n  tar xzf /backup/mydata-backup.tar.gz -C /data\n\n# Миграция PostgreSQL данных:\n# 1. Backup:\ndocker run --rm \\\n  -v postgres_data:/var/lib/postgresql/data \\\n  -v $(pwd):/backup \\\n  ubuntu \\\n  tar czf /backup/postgres-$(date +%Y%m%d).tar.gz \\\n  -C /var/lib/postgresql/data .\n\n# 2. Копировать архив на новый сервер\n# 3. Restore:\ndocker volume create postgres_data\ndocker run --rm \\\n  -v postgres_data:/var/lib/postgresql/data \\\n  -v $(pwd):/backup \\\n  ubuntu \\\n  tar xzf /backup/postgres-20240115.tar.gz \\\n  -C /var/lib/postgresql/data\n\n# Копировать данные между volumes:\ndocker run --rm \\\n  -v source_vol:/source \\\n  -v target_vol:/target \\\n  ubuntu cp -av /source/. /target/\n\n# Inspect — посмотреть использование диска volume:\ndocker system df -v | grep mydata' },
        { type: 'note', value: 'Для PostgreSQL лучше использовать pg_dump вместо raw volume backup — это обеспечивает консистентность данных. Raw volume backup подходит для простых файловых хранилищ. Всегда останавливай или переводи в readonly приложение перед backup.' }
      ]
    },
    {
      id: 6,
      title: 'Volumes в Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Docker Compose volumes объявляются в секции volumes верхнего уровня и используются в сервисах. Compose создаёт volumes автоматически при первом запуске и не удаляет их при docker compose down.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml с volumes:\nservices:\n  db:\n    image: postgres:15\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro\n    environment:\n      POSTGRES_PASSWORD: secret\n\n  redis:\n    image: redis:7\n    volumes:\n      - redis_data:/data\n    command: redis-server --appendonly yes\n\n  app:\n    build: .\n    volumes:\n      - .:/app                    # bind mount для разработки\n      - /app/node_modules         # исключить node_modules хоста\n    ports:\n      - "3000:3000"\n    depends_on:\n      - db\n      - redis\n\n# Объявление volumes:\nvolumes:\n  postgres_data:    # named volume, управляется Docker\n  redis_data:\n    driver: local\n    driver_opts:\n      type: tmpfs   # volume в памяти через driver\n      device: tmpfs\n      o: size=100m\n\n# Внешний (уже существующий) volume:\nvolumes:\n  existing_data:\n    external: true\n    name: myapp_data' },
        { type: 'code', language: 'bash', value: '# Управление volumes в Compose:\ndocker compose up -d           # Создаёт volumes автоматически\ndocker compose down            # НЕ удаляет volumes!\ndocker compose down -v         # Удаляет volumes (ОСТОРОЖНО!)\n\n# Список volumes проекта:\ndocker compose config --volumes\n\n# Хитрость: исключить bind mount node_modules\n# volumes:\n#   - .:/app          # монтируем весь проект\n#   - /app/node_modules  # пустой volume скрывает node_modules хоста\n# Это позволяет node_modules в контейнере не зависеть от хоста\n\n# Backup всех Compose volumes:\nfor vol in $(docker compose config --volumes); do\n  docker run --rm \\\n    -v ${COMPOSE_PROJECT_NAME}_${vol}:/data \\\n    -v $(pwd)/backups:/backup \\\n    ubuntu tar czf /backup/${vol}.tar.gz -C /data .\ndone' },
        { type: 'warning', value: 'docker compose down -v удаляет ВСЕ volumes проекта. Это означает потерю данных PostgreSQL, Redis и других stateful сервисов. Используй только если нужно полностью сбросить состояние. Для production всегда делай backup перед down -v.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Работа с volumes',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой хранение данных для PostgreSQL и реализуй backup/restore.',
      requirements: [
        'Создай named volume postgres_data и запусти PostgreSQL контейнер с этим volume',
        'Подключись к PostgreSQL и создай таблицу users с несколькими записями',
        'Останови и удали контейнер, запусти новый с тем же volume — убедись данные сохранились',
        'Сделай backup volume в файл postgres-backup.tar.gz',
        'Создай новый volume postgres_data_restored и восстанови данные из backup',
        'Запусти контейнер с новым volume и проверь данные',
        'Настрой bind mount для разработки: примонтируй локальную директорию с SQL скриптами'
      ],
      hint: 'docker volume create для создания volume. docker run -v volume:/path для монтирования. psql -c "CREATE TABLE..." для SQL команд. tar czf для backup. Используй docker run --rm для временных контейнеров backup.',
      expectedOutput: 'Volume postgres_data создан.\nPostgreSQL запущен, таблица users создана:\n id | name  | email\n----+-------+-------------------\n  1 | Alice | alice@example.com\n  2 | Bob   | bob@example.com\n\nПосле пересоздания контейнера данные сохранились — volume работает.\n\nBackup создан: backups/postgres-backup.tar.gz (~512KB)\n\nПосле восстановления в postgres_data_restored:\n id | name  | email\n----+-------+-------------------\n  1 | Alice | alice@example.com\n  2 | Bob   | bob@example.com\n\nBind mount работает: /scripts/check.sql доступен внутри контейнера.',
      solution: '# 1. Создать volume и запустить PostgreSQL\ndocker volume create postgres_data\n\ndocker run -d \\\n  --name postgres \\\n  -v postgres_data:/var/lib/postgresql/data \\\n  -e POSTGRES_PASSWORD=secret \\\n  -e POSTGRES_DB=mydb \\\n  postgres:15\n\n# 2. Создать таблицу и данные\ndocker exec -it postgres psql -U postgres -d mydb -c "\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100)\n);\nINSERT INTO users (name, email) VALUES\n  (\'Alice\', \'alice@example.com\'),\n  (\'Bob\', \'bob@example.com\');\nSELECT * FROM users;\n"\n\n# 3. Остановить, удалить, проверить персистентность\ndocker stop postgres\ndocker rm postgres\n\ndocker run -d \\\n  --name postgres-new \\\n  -v postgres_data:/var/lib/postgresql/data \\\n  -e POSTGRES_PASSWORD=secret \\\n  postgres:15\n\ndocker exec postgres-new psql -U postgres -d mydb -c "SELECT * FROM users;"\n# Данные на месте!\n\n# 4. Backup volume\nmkdir -p backups\ndocker run --rm \\\n  -v postgres_data:/data \\\n  -v $(pwd)/backups:/backup \\\n  ubuntu \\\n  tar czf /backup/postgres-backup.tar.gz -C /data .\nls -lh backups/\n\n# 5. Создать и восстановить в новый volume\ndocker volume create postgres_data_restored\n\ndocker run --rm \\\n  -v postgres_data_restored:/data \\\n  -v $(pwd)/backups:/backup \\\n  ubuntu \\\n  tar xzf /backup/postgres-backup.tar.gz -C /data\n\n# 6. Запустить с восстановленными данными\ndocker run -d \\\n  --name postgres-restored \\\n  -v postgres_data_restored:/var/lib/postgresql/data \\\n  -e POSTGRES_PASSWORD=secret \\\n  postgres:15\n\ndocker exec postgres-restored psql -U postgres -d mydb -c "SELECT * FROM users;"\n# id | name  | email\n#  1 | Alice | alice@example.com\n#  2 | Bob   | bob@example.com\n\n# 7. Bind mount для SQL скриптов\nmkdir -p scripts\necho "SELECT current_database(), now();" > scripts/check.sql\n\ndocker run --rm \\\n  -v postgres_data:/var/lib/postgresql/data \\\n  -v $(pwd)/scripts:/scripts:ro \\\n  -e POSTGRES_PASSWORD=secret \\\n  postgres:15 \\\n  psql -U postgres -d mydb -f /scripts/check.sql',
      explanation: 'Named volumes — правильный способ хранить данные PostgreSQL. Volume существует независимо от контейнера. Backup через tar позволяет переносить данные между серверами. Bind mount :ro для readonly скриптов — безопасная практика. Для production PostgreSQL используй pg_dump для логического backup — он более надёжен чем raw volume backup.'
    }
  ]
}
