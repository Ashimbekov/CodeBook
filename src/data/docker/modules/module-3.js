export default {
  id: 3,
  title: 'Образы и контейнеры: docker run, pull, ps, rm',
  description: 'Управление образами и контейнерами через CLI. docker pull, run, start, stop, rm, rmi, ps, inspect, exec, logs, cp. Параметры запуска контейнеров, порты, переменные среды, имена.',
  lessons: [
    {
      id: 1,
      title: 'docker pull: скачивание образов',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker pull скачивает образ из Registry. По умолчанию — из Docker Hub (hub.docker.com). Образы идентифицируются по имени и тегу: name:tag. Тег latest — последняя версия (может меняться).' },
        { type: 'code', language: 'bash', value: '# Формат имени образа:\n# [registry/][namespace/]name[:tag]\n\n# Docker Hub официальные образы (без namespace):\ndocker pull nginx              # nginx:latest\ndocker pull nginx:1.25         # Конкретная версия\ndocker pull nginx:1.25-alpine  # Alpine вариант (меньше размер)\n\n# Docker Hub пользовательские образы:\ndocker pull username/myapp:v1.0\n\n# GitHub Container Registry:\ndocker pull ghcr.io/owner/repo:tag\n\n# Amazon ECR:\ndocker pull 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest\n\n# Просмотр локальных образов:\ndocker images\n# REPOSITORY    TAG       IMAGE ID       CREATED       SIZE\n# nginx         latest    abc123def456   2 days ago    187MB\n# nginx         1.25      789xyz...      5 days ago    187MB\n# ubuntu        22.04     def456abc...   2 weeks ago   77.9MB\n\n# Более подробно:\ndocker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}"\n\n# Удалить образ:\ndocker rmi nginx:latest\ndocker rmi abc123def456  # По IMAGE ID\n\n# Удалить все неиспользуемые образы (dangling = без тега):\ndocker image prune\n\n# Удалить ВСЕ неиспользуемые образы:\ndocker image prune -a\n\n# Поиск образов:\ndocker search nginx\n# NAME                DESCRIPTION                STARS\n# nginx               Official build of Nginx    19876' },
        { type: 'tip', value: 'Всегда указывай конкретный тег в production (nginx:1.25 а не nginx:latest). Тег latest может измениться и сломать приложение при следующем pull. Для воспроизводимости используй digest: nginx@sha256:abc...123 — это хэш конкретного содержимого образа.' }
      ]
    },
    {
      id: 2,
      title: 'docker run: запуск контейнеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker run — главная команда. Создаёт и запускает контейнер из образа. Комбинирует docker create + docker start. Десятки опций для тонкой настройки.' },
        { type: 'code', language: 'bash', value: '# Базовый запуск:\ndocker run nginx\n\n# Основные флаги:\n# -d / --detach: запустить в фоне\n# -it: интерактивный режим с псевдо-TTY\n# --name: задать имя\n# -p / --publish: маппинг портов HOST:CONTAINER\n# -e / --env: переменные среды\n# -v / --volume: монтирование томов\n# --rm: автоматически удалить контейнер при остановке\n# --network: сеть\n# --restart: политика перезапуска\n\n# Фоновый запуск nginx:\ndocker run -d --name web-server -p 8080:80 nginx\n\n# Интерактивный bash:\ndocker run -it --rm ubuntu:22.04 bash\n# --rm: удалить контейнер после exit\n\n# С переменными среды:\ndocker run -d \\\n  --name postgres \\\n  -e POSTGRES_PASSWORD=secret \\\n  -e POSTGRES_DB=mydb \\\n  -p 5432:5432 \\\n  postgres:15\n\n# Политика перезапуска:\ndocker run -d --restart=always nginx   # Всегда перезапускать\ndocker run -d --restart=unless-stopped nginx  # Кроме ручной остановки\ndocker run -d --restart=on-failure:3  nginx   # При ошибке, макс 3 раза\n\n# Ограничить ресурсы:\ndocker run -d \\\n  --memory=512m \\\n  --cpus=1.5 \\\n  --name limited-app \\\n  nginx\n\n# Пример Python приложения:\ndocker run -d \\\n  --name my-flask \\\n  -p 5000:5000 \\\n  -e FLASK_ENV=production \\\n  -e DATABASE_URL=postgresql://user:pass@db:5432/mydb \\\n  --rm \\\n  my-flask-app:latest' },
        { type: 'note', value: 'docker run создаёт НОВЫЙ контейнер каждый раз. Для повторного запуска остановленного контейнера используй docker start container_name. --rm удобен для временных контейнеров (тесты, одноразовые задачи) — не засоряет список контейнеров.' }
      ]
    },
    {
      id: 3,
      title: 'docker ps: управление контейнерами',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker ps показывает запущенные контейнеры. Полный жизненный цикл: start/stop/restart/pause/unpause/kill/rm. Каждый контейнер имеет уникальный ID и опциональное имя.' },
        { type: 'code', language: 'bash', value: '# Просмотр контейнеров:\ndocker ps              # Только запущенные\ndocker ps -a           # Все (включая остановленные)\ndocker ps -q           # Только ID (полезно для скриптов)\ndocker ps --no-trunc   # Полные ID и команды без обрезания\n\n# Фильтрация:\ndocker ps --filter "status=running"\ndocker ps --filter "name=nginx"\ndocker ps --filter "ancestor=nginx:latest"  # По образу\n\n# Форматирование вывода:\ndocker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"\n\n# Жизненный цикл контейнера:\ndocker start my-nginx     # Запустить остановленный\ndocker stop my-nginx      # Остановить (SIGTERM + 10s + SIGKILL)\ndocker stop -t 30 my-nginx # Ждать 30 сек перед SIGKILL\ndocker restart my-nginx   # Перезапустить\ndocker pause my-nginx     # Приостановить (SIGSTOP)\ndocker unpause my-nginx   # Возобновить\ndocker kill my-nginx      # Принудительно остановить (SIGKILL)\n\n# Удаление:\ndocker rm my-nginx           # Удалить остановленный\ndocker rm -f my-nginx        # Принудительно (даже запущенный)\ndocker rm $(docker ps -aq)   # Удалить все остановленные\n\n# Инспекция:\ndocker inspect my-nginx      # Детальная JSON информация\ndocker inspect my-nginx | grep -A 5 IPAddress\ndocker stats my-nginx        # CPU, Memory, Network в реальном времени\ndocker stats                 # Все контейнеры\ndocker top my-nginx          # Процессы внутри контейнера' },
        { type: 'tip', value: 'docker stop отправляет SIGTERM и ждёт 10 секунд прежде чем отправить SIGKILL. Приложение должно обрабатывать SIGTERM для graceful shutdown. Если приложение не завершается — увеличь timeout: docker stop -t 30.' }
      ]
    },
    {
      id: 4,
      title: 'docker exec, logs, cp: работа с запущенными контейнерами',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker exec выполняет команду в запущенном контейнере. docker logs просматривает вывод контейнера. docker cp копирует файлы между контейнером и хостом.' },
        { type: 'code', language: 'bash', value: '# docker exec: выполнить команду в контейнере\ndocker exec my-nginx ls /etc/nginx/\ndocker exec my-nginx cat /etc/nginx/nginx.conf\n\n# Интерактивный shell в запущенном контейнере:\ndocker exec -it my-nginx bash\n# или sh если bash не установлен:\ndocker exec -it my-nginx sh\n\n# Выполнить команду от другого пользователя:\ndocker exec -u root my-nginx bash\ndocker exec -u nginx my-nginx whoami\n\n# Установить переменную среды для команды:\ndocker exec -e MY_VAR=value my-nginx env | grep MY_VAR\n\n# docker logs: просмотр логов\ndocker logs my-nginx              # Все логи\ndocker logs -f my-nginx           # Следить (tail -f)\ndocker logs --tail 50 my-nginx    # Последние 50 строк\ndocker logs --since 1h my-nginx   # За последний час\ndocker logs --until 2024-01-15T12:00:00 my-nginx\ndocker logs -t my-nginx           # С таймстампами\n\n# docker cp: копирование файлов\n# Из контейнера на хост:\ndocker cp my-nginx:/etc/nginx/nginx.conf ./nginx.conf\n\n# С хоста в контейнер:\ndocker cp ./new-config.conf my-nginx:/etc/nginx/nginx.conf\n\n# Скопировать директорию:\ndocker cp my-nginx:/var/log/nginx/ ./nginx-logs/\n\n# docker diff: что изменилось в файловой системе контейнера\ndocker diff my-nginx\n# A /tmp/test.txt    <- Added\n# C /etc/nginx/nginx.conf  <- Changed\n# D /tmp/old.txt     <- Deleted' },
        { type: 'warning', value: 'docker exec -it container bash — это debugging инструмент. В production не должно быть необходимости "заходить внутрь". Если часто используешь exec — это сигнал что нужно улучшить логирование или healthcheck. Изменения через exec теряются при пересоздании контейнера.' }
      ]
    },
    {
      id: 5,
      title: 'Маппинг портов и переменные среды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Маппинг портов позволяет обращаться к сервисам внутри контейнера с хоста. Переменные среды — стандартный способ конфигурации контейнеров (12-factor app).' },
        { type: 'code', language: 'bash', value: '# Маппинг портов (-p / --publish):\n# -p HOST_PORT:CONTAINER_PORT\n\ndocker run -d -p 8080:80 nginx       # Один порт\ndocker run -d -p 127.0.0.1:8080:80 nginx  # Только localhost\ndocker run -d -p 80:80 -p 443:443 nginx   # Несколько портов\ndocker run -d -P nginx                # Авто-маппинг всех EXPOSE портов\n\n# Просмотр портов:\ndocker port my-nginx\n# 80/tcp -> 0.0.0.0:8080\n\ndocker ps --format "{{.Ports}}"\n\n# Переменные среды (-e / --env):\ndocker run -d \\\n  -e NODE_ENV=production \\\n  -e PORT=3000 \\\n  -e DATABASE_URL=postgresql://localhost/mydb \\\n  my-app:latest\n\n# Из файла --env-file:\n# .env файл:\n# NODE_ENV=production\n# PORT=3000\n# DATABASE_URL=postgresql://localhost/mydb\ndocker run -d --env-file .env my-app:latest\n\n# Просмотр переменных среды в контейнере:\ndocker exec my-app env\ndocker inspect my-app | grep -A 20 "Env"\n\n# ВАЖНО: не передавай секреты через -e в команде!\n# Они видны в docker inspect и ps!\n# Используй Docker Secrets или файлы (см. модуль Безопасность)\n\n# Hostname контейнера:\ndocker run --hostname my-host ubuntu hostname  # my-host\ndocker run --add-host db:192.168.1.100 ubuntu cat /etc/hosts  # Добавить запись' },
        { type: 'tip', value: 'Паттерн 12-factor app: конфигурация через переменные среды. Один и тот же образ запускается в dev/staging/prod с разными переменными. Секреты (пароли, ключи) — через --env-file или Docker Secrets, не напрямую в командной строке (видны в истории shell).' }
      ]
    },
    {
      id: 6,
      title: 'Работа с образами: tag, push, save, load',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо pull образами можно управлять: давать теги, отправлять в registry, сохранять в файл и загружать.' },
        { type: 'code', language: 'bash', value: '# Теги образов:\ndocker tag nginx:latest myrepo/nginx:1.25\ndocker tag nginx:latest myrepo/nginx:latest\n# Тег — это просто указатель, образ не копируется\n\n# Войти в Docker Hub:\ndocker login  # Запрашивает логин/пароль\ndocker login -u username -p password  # Небезопасно (пароль в истории)\ncat ~/my-password.txt | docker login -u username --password-stdin  # Лучше\n\n# Отправить образ в Registry:\ndocker push myrepo/nginx:1.25\ndocker push myrepo/nginx:latest\n\n# Выйти:\ndocker logout\n\n# Войти в другой Registry:\ndocker login ghcr.io -u username --password-stdin\ndocker login 123456789.dkr.ecr.us-east-1.amazonaws.com\n\n# Сохранить образ в tar файл (для offline передачи):\ndocker save -o nginx.tar nginx:latest\ndocker save nginx:latest | gzip > nginx.tar.gz  # Со сжатием\n\n# Загрузить образ из файла:\ndocker load -i nginx.tar\ndocker load < nginx.tar.gz\n\n# Export/Import (только файловая система контейнера, без истории слоёв):\ndocker export my-container > container.tar\ncat container.tar | docker import - myimage:flat\n# Результат: образ без слоёв (один большой слой)\n# Меньше размер, но теряется история и метаданные\n\n# Инспекция образа:\ndocker inspect nginx:latest  # Полная JSON информация\ndocker history nginx:latest   # Слои и команды создания' },
        { type: 'note', value: 'docker save сохраняет образ со всеми слоями и метаданными — идеально для backup или передачи. docker export сохраняет файловую систему контейнера без истории — для "уплощения" образа. В production используй Registry, а не файлы.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Управление образами и контейнерами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Практика основных команд управления образами и контейнерами.',
      requirements: [
        'Скачай nginx:alpine и ubuntu:22.04, посмотри их размер и количество слоёв',
        'Запусти PostgreSQL 15 с переменными POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_USER и маппингом порта',
        'Подключись к PostgreSQL через docker exec и создай тестовую таблицу',
        'Скопируй конфиг PostgreSQL из контейнера на хост',
        'Посмотри статистику (docker stats) запущенных контейнеров',
        'Тег nginx:alpine как myapp:v1.0, сохрани в файл, удали образ, загрузи из файла'
      ],
      hint: 'PostgreSQL запускается командой: docker run -d --name pg -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=testdb -p 5432:5432 postgres:15. Подключиться: docker exec -it pg psql -U postgres -d testdb.',
      solution: '# 1. Скачать образы\ndocker pull nginx:alpine\ndocker pull ubuntu:22.04\n\ndocker images | grep -E "nginx|ubuntu"\n# nginx     alpine   abc123   recently   23.4MB  <- маленький!\n# ubuntu    22.04    def456   recently   77.9MB\n\ndocker history nginx:alpine  # Слои\n\n# 2. Запустить PostgreSQL\ndocker run -d \\\n  --name my-postgres \\\n  -e POSTGRES_PASSWORD=mysecretpassword \\\n  -e POSTGRES_DB=testdb \\\n  -e POSTGRES_USER=admin \\\n  -p 5432:5432 \\\n  postgres:15\n\n# Дождаться запуска:\ndocker logs my-postgres\n# database system is ready to accept connections\n\n# 3. Подключиться и создать таблицу\ndocker exec -it my-postgres psql -U admin -d testdb\n# Внутри psql:\n# CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);\n# INSERT INTO users (name) VALUES (\'Алия\');\n# SELECT * FROM users;\n# \\q\n\n# 4. Скопировать конфиг\ndocker exec my-postgres ls /etc/postgresql/\ndocker cp my-postgres:/var/lib/postgresql/data/postgresql.conf ./pg.conf\nls -la pg.conf\n\n# 5. Статистика\ndocker stats --no-stream  # Один снапшот\ndocker stats  # В реальном времени (Ctrl+C для выхода)\n\n# 6. Теги, сохранение, загрузка\ndocker tag nginx:alpine myapp:v1.0\ndocker images | grep myapp\n\ndocker save -o myapp_v1.tar myapp:v1.0\nls -lh myapp_v1.tar\n\ndocker rmi myapp:v1.0\ndocker images | grep myapp  # Нет образа\n\ndocker load -i myapp_v1.tar\ndocker images | grep myapp  # Образ вернулся!\n\n# Очистка:\ndocker stop my-postgres\ndocker rm my-postgres\ndocker rmi myapp:v1.0',
      explanation: 'Alpine образы в 3-10 раз меньше чем обычные (23MB vs 187MB для nginx). docker save/load — для offline передачи образов. PostgreSQL запускается готовым к работе через переменные POSTGRES_*. docker stats показывает реальное использование ресурсов.'
    },
    {
      id: 8,
      title: 'Именование и организация образов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Практика с реестром образов и стратегиями тегирования.',
      requirements: [
        'Создай 3 образа с разными тегами одного "приложения": myapp:latest, myapp:1.0.0, myapp:stable',
        'Напиши скрипт который тегирует образ с датой: myapp:2024-01-15',
        'Исследуй чем отличаются образы: nginx vs nginx:alpine vs nginx:bookworm',
        'Найди образ с наименьшим размером для prod-использования',
        'Создай скрипт автоочистки: удалить образы старше 7 дней'
      ],
      hint: 'docker images --format вместе с filter помогут найти старые образы. date +%Y-%m-%d для датировки. docker image ls --filter "before=образ" для фильтрации.',
      solution: '# 1. Несколько тегов\ndocker pull nginx:alpine\ndocker tag nginx:alpine myapp:latest\ndocker tag nginx:alpine myapp:1.0.0\ndocker tag nginx:alpine myapp:stable\ndocker images | grep myapp\n# Все три тега указывают на ОДИН образ (один IMAGE ID)\n\n# 2. Тег с датой\nDATE=$(date +%Y-%m-%d)\ndocker tag nginx:alpine myapp:$DATE\necho "Образ создан: myapp:$DATE"\n\n# 3. Сравнение nginx вариантов\ndocker pull nginx:latest\ndocker pull nginx:alpine\ndocker pull nginx:bookworm\ndocker images | grep nginx\n# nginx   latest    abc   2 days ago   187MB  <- стандартный Debian\n# nginx   alpine    def   2 days ago   23.4MB <- Alpine Linux, минимальный\n# nginx   bookworm  ghi   5 days ago   187MB  <- Debian Bookworm (явный)\n\n# Alpine = минимальный образ (только musl libc и busybox)\n# Для prod: alpine если нет специфических зависимостей glibc\n\n# 4. Скрипт автоочистки образов\ncat > cleanup_images.sh << \'SCRIPT\'\n#!/bin/bash\n# Удалить образы без тегов (dangling)\ndocker image prune -f\n\n# Удалить образы с тегом содержащим дату старше 7 дней\nCUTOFF=$(date -d "7 days ago" +%Y-%m-%d)\nfor img in $(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "[0-9]{4}-[0-9]{2}-[0-9]{2}");\ndo\n    TAG_DATE=$(echo $img | grep -oE "[0-9]{4}-[0-9]{2}-[0-9]{2}")\n    if [[ "$TAG_DATE" < "$CUTOFF" ]]; then\n        echo "Удаляю: $img"\n        docker rmi "$img" 2>/dev/null || echo "Не удалось: $img (используется?)" \n    fi\ndone\nSCRIPT\nchmod +x cleanup_images.sh',
      explanation: 'Несколько тегов могут указывать на один IMAGE ID — это просто алиасы. Alpine образы значительно меньше за счёт минималистичной базы (musl вместо glibc, busybox вместо GNU utils). Автоочистка старых образов — важная операция обслуживания CI/CD серверов.'
    }
  ]
}
