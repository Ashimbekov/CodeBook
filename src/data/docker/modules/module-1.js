export default {
  id: 1,
  title: 'Введение в Docker',
  description: 'Что такое Docker и контейнеризация, проблемы которые она решает, сравнение с виртуальными машинами, архитектура Docker, основные концепции: образ, контейнер, реестр.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Docker и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker — платформа для контейнеризации приложений. Контейнер — изолированная среда выполнения, содержащая приложение со всеми его зависимостями. Основная проблема которую решает Docker: "У меня работает, на сервере не работает" — несовместимость окружений.' },
        { type: 'heading', value: 'Проблемы без Docker' },
        { type: 'list', value: ['Разные версии Python/Node/Java на разных серверах', 'Зависимости конфликтуют между проектами', 'Сложное развёртывание: ручная установка пакетов', 'Трудно масштабировать: каждый сервер настраивается вручную', '"Works on my machine" — классическая проблема разработки'] },
        { type: 'code', language: 'bash', value: '# Без Docker: ручная установка на каждом сервере\napt-get install python3.11\napt-get install postgresql\npip install -r requirements.txt\nexport DATABASE_URL=...\npython manage.py migrate\ngunicorn app:app\n# Повторить на КАЖДОМ сервере вручную...\n\n# С Docker: один файл, запуск везде одинаково\ndocker run --env DATABASE_URL=... myapp:latest\n# Идентично на любом сервере с Docker!' },
        { type: 'tip', value: 'Docker решает три задачи: 1) Изоляция — каждый контейнер независим, 2) Воспроизводимость — одинаковая среда везде (dev/staging/prod), 3) Простота деплоя — один образ запускается везде где есть Docker.' }
      ]
    },
    {
      id: 2,
      title: 'Контейнеры vs Виртуальные машины',
      type: 'theory',
      content: [
        { type: 'text', value: 'Виртуальная машина (VM) — полная эмуляция компьютера с собственным ядром ОС. Контейнер разделяет ядро хостовой ОС и изолирует только пространство пользователя. Контейнеры легче и быстрее VM.' },
        { type: 'code', language: 'bash', value: '# Сравнение VM и Container:\n\n# Виртуальная машина:\n# Хост ОС -> Гипервизор (VMware/VirtualBox/KVM)\n#   -> VM1 (Гостевое ядро + ОС + App1)\n#   -> VM2 (Гостевое ядро + ОС + App2)\n# Размер: 1-10 GB, Запуск: 30-60 секунд\n\n# Docker контейнер:\n# Хост ОС (Linux ядро)\n#   -> Container1 (Libs + App1)  ← разделяет ядро хоста\n#   -> Container2 (Libs + App2)  ← разделяет ядро хоста\n# Размер: 10-500 MB, Запуск: 1-5 секунд\n\n# Запустить 100 контейнеров:\ndocker run -d myapp  # x100 — займёт секунды, ~100MB RAM каждый\n\n# Запустить 100 VM:\n# Займёт часы, 100GB+ RAM' },
        { type: 'list', value: ['VM: полная изоляция ядра (более безопасно), большой размер, медленный старт', 'Container: разделяет ядро (быстро, легко), меньше изоляции', 'Container идеален для микросервисов, CI/CD, разработки', 'VM лучше для: разные ОС на одном хосте, высокие требования к безопасности'] },
        { type: 'note', value: 'Docker нативно работает только на Linux (использует cgroups и namespaces). На macOS и Windows Docker Desktop создаёт лёгкую Linux VM внутри которой запускаются контейнеры. Поэтому на Linux Docker работает быстрее.' }
      ]
    },
    {
      id: 3,
      title: 'Архитектура Docker',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker использует клиент-серверную архитектуру. Docker Client посылает команды Docker Daemon (dockerd). Daemon управляет образами, контейнерами, сетями и томами. Registry хранит образы.' },
        { type: 'code', language: 'bash', value: '# Архитектура Docker:\n# [Docker Client (docker CLI)] <-> [Docker Daemon (dockerd)]\n#                                          |\n#                          [Images] [Containers] [Networks] [Volumes]\n#                                          |\n#                          [Docker Registry (Docker Hub / private)]\n\n# Docker Daemon:\n# - Управляет жизненным циклом контейнеров\n# - Управляет образами (скачивание, хранение)\n# - Создаёт сети и тома\n# - Слушает на /var/run/docker.sock (Unix socket)\n\n# Docker Client:\n# - CLI инструмент (docker)\n# - Общается с daemon через REST API\n# - Может подключаться к удалённому daemon\n\n# Проверить статус daemon:\nsudo systemctl status docker\n\n# Информация о Docker окружении:\ndocker info\n\n# Версия:\ndocker version\n# Client: Docker Engine - Community\n#  Version: 25.0.3\n# Server: Docker Engine - Community\n#  Engine Version: 25.0.3\n#  OS/Arch: linux/amd64' },
        { type: 'tip', value: 'Docker использует containerd (runtime) и runc (низкоуровневый runtime) под капотом. containerd — CNCF проект, используется также в Kubernetes. runc — реализует OCI (Open Container Initiative) спецификацию.' }
      ]
    },
    {
      id: 4,
      title: 'Ключевые концепции: образ, контейнер, реестр',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три фундаментальные концепции Docker: Image (образ), Container (контейнер), Registry (реестр). Понимание разницы между ними критично для работы с Docker.' },
        { type: 'code', language: 'bash', value: '# IMAGE (Образ):\n# - Неизменяемый шаблон для создания контейнеров\n# - Состоит из слоёв (layers)\n# - Аналог: класс в ООП, ISO образ диска\n# - Хранится в Registry или локально\n\n# CONTAINER (Контейнер):\n# - Запущенный экземпляр Image\n# - Изолированный процесс с собственной файловой системой\n# - Аналог: объект (instance) класса, запущенная программа\n# - Ephemeral (временный): данные теряются при остановке без volume\n\n# REGISTRY (Реестр):\n# - Хранилище образов\n# - Docker Hub: публичный реестр (hub.docker.com)\n# - Ghcr.io: GitHub Container Registry\n# - ECR: Amazon Elastic Container Registry\n# - Можно поднять свой: docker run registry:2\n\n# Жизненный цикл:\n# Registry -> pull -> Image -> run -> Container\n#                                       |\n#                              stop/start/remove\n\n# Аналогия:\n# Image   = рецепт торта\n# Container = испечённый торт\n# Registry = книга рецептов' },
        { type: 'note', value: 'Один Image может породить множество контейнеров (как из одного класса создают много объектов). Изменения внутри контейнера не влияют на Image. Для сохранения изменений нужен docker commit (создаёт новый Image) или Volume (для данных).' }
      ]
    },
    {
      id: 5,
      title: 'Слоевая архитектура образов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker образы состоят из слоёв (layers). Каждая инструкция в Dockerfile создаёт новый слой. Слои кэшируются и переиспользуются между образами — это экономит место и ускоряет сборку.' },
        { type: 'code', language: 'bash', value: '# Слои образа:\n# Image = Layer1 (base OS) + Layer2 (deps) + Layer3 (app code)\n# Каждый слой — это diff (изменения) относительно предыдущего\n\n# Посмотреть слои образа:\ndocker history nginx:latest\n# IMAGE          CREATED       CREATED BY                    SIZE\n# abc123         2 days ago    /bin/sh -c #(nop) CMD [...]   0B\n# def456         2 days ago    /bin/sh -c apt-get install    45MB\n# ghi789         3 days ago    /bin/sh -c #(nop) FROM        56MB\n\n# Переиспользование слоёв:\n# Образ A: [Ubuntu] [Python] [App1]\n# Образ B: [Ubuntu] [Python] [App2]\n# Слои [Ubuntu] и [Python] РАЗДЕЛЯЮТСЯ — хранятся один раз!\n\n# Посмотреть слои подробно:\ndocker inspect nginx:latest | python3 -m json.tool | grep -A 5 Layers\n\n# Pull: скачиваются только отсутствующие слои\ndocker pull python:3.11\n# Layer already exists: # Если слой уже есть — не скачивается!\n\n# Container layer:\n# Поверх Image слоёв добавляется тонкий writable layer\n# Все изменения в контейнере пишутся в этот слой\n# При удалении контейнера этот слой удаляется!' },
        { type: 'warning', value: 'Слои образа неизменяемы (immutable). При изменении файла в контейнере используется Copy-on-Write: файл копируется в writable layer контейнера. Это эффективно для чтения, но дорого при частой записи — используй Volume для данных.' }
      ]
    },
    {
      id: 6,
      title: 'Установка и первый запуск',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Engine — основной компонент для Linux серверов. Docker Desktop — для разработки на macOS и Windows. После установки проверь что всё работает командой docker run hello-world.' },
        { type: 'code', language: 'bash', value: '# Установка Docker Engine на Ubuntu:\ncurl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh\n\n# Добавить текущего пользователя в группу docker (без sudo):\nsudo usermod -aG docker $USER\nnewgrp docker  # Применить без перезапуска сессии\n\n# Проверить установку:\ndocker run hello-world\n# Hello from Docker!\n# This message shows that your installation appears to be working correctly.\n\n# Базовые команды:\ndocker ps              # Запущенные контейнеры\ndocker ps -a           # Все контейнеры (включая остановленные)\ndocker images          # Локальные образы\ndocker pull ubuntu:22.04  # Скачать образ\ndocker run ubuntu:22.04 echo "Hello, Docker!"  # Запустить команду\ndocker run -it ubuntu:22.04 bash  # Интерактивный терминал\n# -i: keep STDIN open\n# -t: allocate pseudo-TTY\n\n# Выйти из контейнера:\n# exit или Ctrl+D (остановит контейнер)\n# Ctrl+P, Ctrl+Q (отсоединиться но контейнер продолжает работать)' },
        { type: 'tip', value: 'Добавь себя в группу docker чтобы не использовать sudo постоянно. Это нормально для разработки но не для продакшена — на сервере запускай Docker от root или через специальные роли (rootless Docker).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Первые контейнеры',
      type: 'practice',
      difficulty: 'easy',
      description: 'Запусти несколько контейнеров и исследуй их поведение.',
      requirements: [
        'Запусти hello-world и прочитай вывод',
        'Запусти Ubuntu контейнер интерактивно, создай файл /tmp/hello.txt',
        'Выйди из контейнера, запусти новый Ubuntu контейнер — убедись что файл исчез',
        'Запусти nginx контейнер в фоне (-d), открой в браузере http://localhost:8080',
        'Посмотри логи nginx контейнера через docker logs',
        'Останови и удали все запущенные контейнеры'
      ],
      hint: 'docker run -d -p 8080:80 nginx запускает nginx в фоне с маппингом портов. docker stop ID и docker rm ID для удаления. docker rm $(docker ps -aq) удаляет ВСЕ контейнеры.',
      solution: '# 1. Hello World\ndocker run hello-world\n\n# 2. Интерактивный Ubuntu\ndocker run -it ubuntu:22.04 bash\n# Внутри контейнера:\necho "Hello from container" > /tmp/hello.txt\ncat /tmp/hello.txt\nexit\n\n# 3. Новый контейнер — файла нет\ndocker run -it ubuntu:22.04 bash\ncat /tmp/hello.txt  # No such file or directory!\nexit\n\n# 4. Nginx в фоне с маппингом порта\ndocker run -d --name my-nginx -p 8080:80 nginx\n# Открыть http://localhost:8080 в браузере\n\n# Проверить что запущен:\ndocker ps\n# CONTAINER ID   IMAGE   COMMAND                  CREATED\n# abc123         nginx   "/docker-entrypoint..."  5 seconds ago\n\n# 5. Логи nginx\ndocker logs my-nginx\ndocker logs -f my-nginx  # Следить за логами в реальном времени (Ctrl+C для выхода)\n\n# 6. Остановить и удалить\ndocker stop my-nginx\ndocker rm my-nginx\n\n# Удалить все остановленные контейнеры:\ndocker container prune\n# или:\ndocker rm $(docker ps -aq)',
      explanation: 'Каждый docker run создаёт НОВЫЙ контейнер с чистой файловой системой от Image. Данные внутри контейнера эфемерны. -d (detach) запускает в фоне. -p 8080:80 маппирует порт хоста 8080 на порт контейнера 80. --name задаёт имя для удобства.'
    }
  ]
}
