export default {
  id: 20,
  title: 'Контейнеризация',
  description: 'Docker на Linux: cgroups, namespaces, rootless containers. Основы контейнеризации изнутри.',
  lessons: [
    {
      id: 1,
      title: 'Основы контейнеризации: namespaces и cgroups',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контейнеры в Linux построены на двух технологиях ядра: namespaces (изоляция) и cgroups (ограничение ресурсов). Docker — удобная обёртка над этими низкоуровневыми механизмами.' },
        { type: 'heading', value: 'Namespaces — изоляция' },
        { type: 'code', language: 'bash', value: '# Linux namespaces:\n# PID   — изоляция процессов (контейнер видит только свои процессы)\n# NET   — сетевые интерфейсы, IP-адреса, маршруты\n# MNT   — файловая система (свой корень /)\n# UTS   — hostname (своё имя хоста)\n# IPC   — межпроцессное взаимодействие\n# USER  — пользователи (root в контейнере != root на хосте)\n# CGROUP — видимость cgroups\n\n# Посмотреть namespaces процесса:\nls -la /proc/1/ns/\n# lrwxrwxrwx 1 root root 0 cgroup -> cgroup:[4026531835]\n# lrwxrwxrwx 1 root root 0 ipc -> ipc:[4026531839]\n# lrwxrwxrwx 1 root root 0 mnt -> mnt:[4026531840]\n# lrwxrwxrwx 1 root root 0 net -> net:[4026531969]\n# lrwxrwxrwx 1 root root 0 pid -> pid:[4026531836]\n\n# Создать namespace вручную:\nsudo unshare --pid --fork --mount-proc bash\nps aux   # видно только bash и ps!\nexit\n\n# unshare — запуск в новом namespace:\nsudo unshare --net bash\nip addr   # только loopback!\nexit' },
        { type: 'tip', value: 'Docker под капотом использует unshare/clone для создания namespaces. Понимание namespaces помогает при отладке сетевых проблем контейнеров и проблем с правами доступа.' }
      ]
    },
    {
      id: 2,
      title: 'cgroups — ограничение ресурсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'cgroups (control groups) ограничивают и учитывают ресурсы процессов: CPU, память, I/O, сеть. Без cgroups один контейнер мог бы захватить все ресурсы хоста.' },
        { type: 'code', language: 'bash', value: '# cgroups v2 (современные системы):\nls /sys/fs/cgroup/\n# cgroup.controllers  cpu.max  memory.max  io.max  ...\n\n# Контроллеры:\n# cpu     — ограничение CPU\n# memory  — ограничение памяти\n# io      — ограничение дискового I/O\n# pids    — ограничение количества процессов\n\n# Как Docker использует cgroups:\ndocker run -d --name test --cpus=2 --memory=512m nginx\n\n# Посмотреть cgroup контейнера:\ndocker inspect test | grep -i cgroup\ncat /sys/fs/cgroup/system.slice/docker-<ID>/cpu.max\n# 200000 100000  — 2 ядра CPU\ncat /sys/fs/cgroup/system.slice/docker-<ID>/memory.max\n# 536870912      — 512 MB\n\n# Статистика ресурсов контейнера:\ndocker stats test\n# CONTAINER  CPU %  MEM USAGE / LIMIT  MEM %  NET I/O  BLOCK I/O\n# test       0.5%   25MiB / 512MiB     4.88%  5kB/2kB  0B/0B' },
        { type: 'note', value: 'Без ограничений памяти контейнер может использовать весь RAM хоста и вызвать OOM killer. Всегда устанавливайте --memory для production контейнеров.' }
      ]
    },
    {
      id: 3,
      title: 'Docker на Linux: установка и основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Engine нативно работает на Linux (без VM). Это самый эффективный способ запуска контейнеров. Docker использует containerd + runc для управления контейнерами.' },
        { type: 'code', language: 'bash', value: '# Установка Docker на Ubuntu:\ncurl -fsSL https://get.docker.com | sudo sh\nsudo usermod -aG docker $USER\nnewgrp docker\n\n# Проверить:\ndocker version\ndocker info\n\n# Основные команды:\ndocker run -d --name web -p 80:80 nginx     # запустить\ndocker ps                                     # список\ndocker logs web                               # логи\ndocker exec -it web bash                      # зайти внутрь\ndocker stop web                               # остановить\ndocker rm web                                 # удалить\n\n# Dockerfile:\ncat > Dockerfile << \'EOF\'\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD ["python", "app.py"]\nEOF\n\n# Сборка и запуск:\ndocker build -t myapp .\ndocker run -d -p 8000:8000 myapp' },
        { type: 'tip', value: 'На Linux Docker работает нативно без VM — это быстрее чем Docker Desktop на macOS/Windows. Для production используйте containerd напрямую (без Docker CLI) через Kubernetes.' }
      ]
    },
    {
      id: 4,
      title: 'Rootless containers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rootless Docker — запуск контейнеров без привилегий root. Повышает безопасность: даже если контейнер скомпрометирован, атакующий не получит root на хосте.' },
        { type: 'code', language: 'bash', value: '# Проблема rootful Docker:\n# Docker daemon работает от root\n# docker.sock доступен группе docker\n# Член группы docker = фактически root!\n# docker run -v /:/host alpine cat /host/etc/shadow  # доступ к shadow!\n\n# Rootless Docker — установка:\ndockerd-rootless-setuptool.sh install\n\n# Или Docker в rootless-режиме:\nexport DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock\n\n# Podman — rootless по умолчанию:\nsudo apt install podman\npodman run -d --name web -p 8080:80 nginx\npodman ps\npodman logs web\n\n# Podman совместим с Docker CLI:\nalias docker=podman\n\n# Сравнение:\n# Docker (rootful):\n#  + Широко используется\n#  - Daemon от root — риск безопасности\n#  - docker.sock = root-доступ\n\n# Docker (rootless) / Podman:\n#  + Без root привилегий\n#  + Безопаснее для production\n#  - Ограничения: нет привилегированных портов (<1024)\n#  - Некоторые функции недоступны' },
        { type: 'tip', value: 'Podman — безопасная альтернатива Docker: rootless по умолчанию, без daemon, совместим с Dockerfile и Docker CLI. Рекомендуется для production серверов вместо rootful Docker.' }
      ]
    },
    {
      id: 5,
      title: 'Docker Compose и production',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose определяет многоконтейнерные приложения в YAML-файле. Идеален для development и небольших production-деплоев. Для масштабирования используется Kubernetes.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml\nservices:\n  app:\n    build: .\n    ports:\n      - "8000:8000"\n    environment:\n      - DATABASE_URL=postgresql://user:pass@db:5432/mydb\n    depends_on:\n      db:\n        condition: service_healthy\n    restart: unless-stopped\n    deploy:\n      resources:\n        limits:\n          cpus: "2.0"\n          memory: 512M\n\n  db:\n    image: postgres:16\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: mydb\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U user"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n    restart: unless-stopped\n\n  nginx:\n    image: nginx:alpine\n    ports:\n      - "80:80"\n      - "443:443"\n    volumes:\n      - ./nginx.conf:/etc/nginx/nginx.conf:ro\n    depends_on:\n      - app\n    restart: unless-stopped\n\nvolumes:\n  pgdata:' },
        { type: 'code', language: 'bash', value: '# Управление Docker Compose:\ndocker compose up -d            # запустить все сервисы\ndocker compose ps               # статус\ndocker compose logs -f app      # логи\ndocker compose down             # остановить и удалить\ndocker compose pull             # обновить образы\ndocker compose up -d --build    # пересобрать и запустить' },
        { type: 'tip', value: 'restart: unless-stopped — контейнеры автоматически перезапускаются при падении и после перезагрузки сервера. deploy.resources.limits ограничивает ресурсы — обязательно для production.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Контейнеризация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Запустите контейнеризованное приложение на Linux.',
      requirements: [
        'Проверьте установку Docker и информацию о системе',
        'Запустите Nginx контейнер с ограничением памяти 256M и CPU 1',
        'Проверьте использование ресурсов контейнера через docker stats',
        'Посмотрите namespaces и cgroups запущенного контейнера',
        'Создайте docker-compose.yml с Nginx + PostgreSQL',
        'Запустите стек и проверьте что все сервисы работают'
      ],
      hint: 'docker run --memory=256m --cpus=1. docker inspect для информации. /proc/PID/ns/ для namespaces. docker compose up -d для запуска стека.',
      expectedOutput: 'docker info: Linux, containerd, runc\nNginx: running, 256M memory limit, 1 CPU\ndocker stats: MEM 25M/256M, CPU 0.1%\nnamespaces: pid, net, mnt отличаются от хоста\ncompose: nginx (80), postgres (5432) — running',
      solution: '# 1. Информация\ndocker version\ndocker info\n\n# 2. Nginx с ограничениями\ndocker run -d --name web --memory=256m --cpus=1 -p 8080:80 nginx\n\n# 3. Статистика\ndocker stats web --no-stream\n\n# 4. Namespaces\nCONTAINER_PID=$(docker inspect --format \'{{.State.Pid}}\' web)\nsudo ls -la /proc/$CONTAINER_PID/ns/\nsudo ls -la /proc/1/ns/\n# Сравните — разные namespace ID!\n\n# 5-6. Docker Compose\nmkdir -p /tmp/compose-test && cd /tmp/compose-test\ncat > docker-compose.yml << \'EOF\'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - "80:80"\n    restart: unless-stopped\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_PASSWORD: test123\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    restart: unless-stopped\nvolumes:\n  pgdata:\nEOF\n\ndocker compose up -d\ndocker compose ps\ncurl http://localhost\n\n# Очистка\ndocker compose down\ndocker rm -f web',
      explanation: '--memory=256m ограничивает RAM контейнера через cgroups. --cpus=1 ограничивает CPU. docker inspect --format извлекает PID контейнера. Namespaces контейнера отличаются от хоста — это и есть изоляция. Docker Compose объединяет несколько сервисов.'
    }
  ]
}
