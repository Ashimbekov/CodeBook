export default {
  id: 2,
  title: 'Установка и настройка Docker',
  description: 'Установка Docker Engine на Linux, Docker Desktop на macOS и Windows. Настройка docker daemon, управление правами, проверка установки, базовые команды и конфигурация.',
  lessons: [
    {
      id: 1,
      title: 'Установка Docker Engine на Linux (Ubuntu/Debian)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Engine — серверный компонент Docker для Linux. Рекомендуемый способ установки: официальный репозиторий Docker. Не используй пакеты из стандартных репозиториев Ubuntu/Debian — они устаревшие.' },
        { type: 'code', language: 'bash', value: '# Метод 1: Официальный скрипт (рекомендуется для dev)\ncurl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh\n\n# Метод 2: Ручная установка (рекомендуется для prod)\n# Удалить старые версии:\nsudo apt-get remove docker docker-engine docker.io containerd runc\n\n# Установить зависимости:\nsudo apt-get update\nsudo apt-get install ca-certificates curl gnupg\n\n# Добавить официальный GPG ключ Docker:\nsudo install -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\\n    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg\nsudo chmod a+r /etc/apt/keyrings/docker.gpg\n\n# Добавить репозиторий:\necho "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\\nhttps://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \\\nsudo tee /etc/apt/sources.list.d/docker.list > /dev/null\n\n# Установить Docker:\nsudo apt-get update\nsudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin\n\n# Проверить:\nsudo docker run hello-world' },
        { type: 'tip', value: 'docker-ce — Docker Community Edition (бесплатный). docker-buildx-plugin нужен для multi-platform сборки. docker-compose-plugin — новый compose как плагин (docker compose), в отличие от старого docker-compose (отдельный бинарник).' }
      ]
    },
    {
      id: 2,
      title: 'Docker Desktop для macOS и Windows',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Desktop — приложение для разработчиков на macOS и Windows. Включает Docker Engine в Linux VM, Docker Compose, Kubernetes, встроенный UI и автоматические обновления.' },
        { type: 'code', language: 'bash', value: '# macOS установка:\n# 1. Скачать с https://www.docker.com/products/docker-desktop/\n# 2. Установить .dmg файл\n# 3. Запустить Docker Desktop\n\n# Или через Homebrew:\nbrew install --cask docker\n\n# Windows установка:\n# 1. Скачать Docker Desktop Installer.exe\n# 2. WSL2 должен быть установлен (Windows 10 2004+)\n# Включить WSL2: wsl --install (в PowerShell от администратора)\n# 3. Установить и запустить\n\n# Проверить после установки:\ndocker version\ndocker run hello-world\n\n# Docker Desktop особенности:\n# - Запускает Linux VM (HyperKit на macOS, WSL2 на Windows)\n# - Настройки ресурсов: CPU/Memory/Disk в GUI\n# - Kubernetes: включить в Settings -> Kubernetes\n# - Extensions: доп. инструменты из маркетплейса\n\n# Ресурсы по умолчанию (обычно нужно увеличить):\n# Settings -> Resources:\n# Memory: минимум 4GB, рекомендуется 8GB+\n# CPU: 2-4 ядра\n# Disk: 60GB+ (для образов и контейнеров)\n\n# Проверить использование ресурсов:\ndocker system df\n# TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE\n# Images          15        3         8.2GB     6.1GB\n# Containers      5         2         250MB     180MB\n# Local Volumes   3         2         1.2GB     0B\n# Build Cache     20        0         512MB     512MB' },
        { type: 'note', value: 'Docker Desktop бесплатен для личного использования и малых компаний (<250 сотрудников). Для крупных компаний нужна подписка. Альтернативы для macOS: OrbStack (быстрее, платный), Colima (бесплатный open-source, через CLI).' }
      ]
    },
    {
      id: 3,
      title: 'Настройка прав и группы docker',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию только root может управлять Docker. Добавление пользователя в группу docker даёт доступ без sudo. На сервере также рассмотри rootless Docker для большей безопасности.' },
        { type: 'code', language: 'bash', value: '# Добавить текущего пользователя в группу docker:\nsudo usermod -aG docker $USER\n\n# Применить изменения без перезапуска:\nnewgrp docker\n\n# Проверить:\ndocker ps  # Без sudo!\n\n# Если ещё нужен sudo:\ngroups  # Проверь что docker в списке групп\n# Если нет: выйди и войди в систему заново (logout/login)\n\n# ROOTLESS DOCKER (рекомендуется для prod):\n# Запуск Docker без root привилегий\n\n# Установить rootless:\ndockerd-rootless-setuptool.sh install\n# или:\ncurl -fsSL https://get.docker.com/rootless | sh\n\n# Настроить переменные среды:\nexport PATH=/home/$USER/bin:$PATH\nexport DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock\n\n# Добавить в ~/.bashrc:\necho \'export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock\' >> ~/.bashrc\n\n# Запустить rootless daemon:\nsystemctl --user start docker\nsystemctl --user enable docker\n\n# Почему rootless безопаснее:\n# - Контейнер root = хост обычный пользователь\n# - Уязвимость в контейнере не даёт root на хосте\n# - Ограничения: нет binding портов < 1024, некоторые функции недоступны' },
        { type: 'warning', value: 'Добавление пользователя в группу docker фактически даёт права root на хосте (через volume mount /). На рабочих серверах используй rootless Docker или Docker с SELinux/AppArmor профилями. Группа docker для dev-машин — нормально.' }
      ]
    },
    {
      id: 4,
      title: 'Конфигурация Docker daemon',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker daemon (dockerd) настраивается через /etc/docker/daemon.json. Важные настройки: registry mirrors, log driver, storage driver, resource limits.' },
        { type: 'code', language: 'bash', value: '# Файл конфигурации daemon:\n# /etc/docker/daemon.json\n\n# Пример конфигурации:\n# {\n#   "log-driver": "json-file",\n#   "log-opts": {\n#     "max-size": "10m",\n#     "max-file": "3"\n#   },\n#   "storage-driver": "overlay2",\n#   "registry-mirrors": [\n#     "https://mirror.gcr.io"\n#   ],\n#   "insecure-registries": [],\n#   "live-restore": true,\n#   "userland-proxy": false,\n#   "experimental": false\n# }\n\n# Создать конфиг:\nsudo mkdir -p /etc/docker\nsudo tee /etc/docker/daemon.json > /dev/null << \'EOF\'\n{\n  "log-driver": "json-file",\n  "log-opts": {\n    "max-size": "100m",\n    "max-file": "3"\n  },\n  "live-restore": true\n}\nEOF\n\n# Применить изменения:\nsudo systemctl daemon-reload\nsudo systemctl restart docker\n\n# Проверить конфигурацию:\ndocker info | grep -A 10 "Storage Driver"\ndocker info | grep "Logging Driver"\n\n# live-restore: контейнеры продолжают работать при перезапуске daemon\n# Очень важно для prod: не упадут приложения при update docker daemon' },
        { type: 'tip', value: 'Обязательные настройки для production: log rotation (max-size, max-file), live-restore: true. Без log rotation логи контейнеров заполнят диск. live-restore позволяет обновлять docker daemon без остановки контейнеров.' }
      ]
    },
    {
      id: 5,
      title: 'Управление Docker как сервисом systemd',
      type: 'theory',
      content: [
        { type: 'text', value: 'На Linux Docker управляется через systemd. Автозапуск при старте системы, просмотр логов daemon, перезапуск при обновлении конфигурации.' },
        { type: 'code', language: 'bash', value: '# Управление сервисом Docker:\nsudo systemctl start docker      # Запустить\nsudo systemctl stop docker       # Остановить\nsudo systemctl restart docker    # Перезапустить\nsudo systemctl reload docker     # Перечитать конфиг (без рестарта)\nsudo systemctl enable docker     # Автозапуск при старте ОС\nsudo systemctl disable docker    # Отключить автозапуск\nsudo systemctl status docker     # Статус\n\n# Логи docker daemon:\nsudo journalctl -u docker.service -f  # В реальном времени\nsudo journalctl -u docker.service -n 100  # Последние 100 строк\nsudo journalctl -u docker.service --since "2024-01-01 00:00:00"\n\n# Версия и информация:\ndocker version    # Версии client и server\ndocker info       # Подробная информация\ndocker system df  # Использование диска\n\n# Очистка ресурсов:\ndocker system prune          # Удалить остановленные контейнеры, неиспользуемые сети и образы\ndocker system prune -a       # + неиспользуемые образы\ndocker system prune -a --volumes  # + тома (ОСТОРОЖНО: удалит данные!)\n\n# Отдельные очистки:\ndocker container prune   # Остановленные контейнеры\ndocker image prune       # Образы без тегов (dangling)\ndocker image prune -a    # Все неиспользуемые образы\ndocker volume prune      # Неиспользуемые тома\ndocker network prune     # Неиспользуемые сети' },
        { type: 'note', value: 'docker system prune безопасен — не трогает запущенные контейнеры и их образы. docker system prune -a --volumes — опасна для production, удалит все данные в volume. Перед очисткой проверь docker system df для понимания сколько места займёт операция.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Установка и проверка Docker',
      type: 'practice',
      difficulty: 'easy',
      description: 'Установи Docker и выполни базовую диагностику окружения.',
      requirements: [
        'Установи Docker Engine (если не установлен) и проверь версию',
        'Добавь себя в группу docker и проверь что работает без sudo',
        'Создай файл daemon.json с настройками log rotation (max-size: 50m, max-file: 3)',
        'Запусти docker info и объясни что означают Storage Driver, Cgroup Driver, Runtimes',
        'Запусти docker system df и очисти неиспользуемые образы и контейнеры',
        'Убедись что Docker автоматически запускается при старте системы'
      ],
      hint: 'systemctl is-enabled docker проверяет автозапуск. overlay2 — рекомендуемый Storage Driver. cgroupv2 предпочтительнее cgroupv1. Для docker system df -v увидишь подробности.',
      solution: '# 1. Проверить/установить и версию\ndocker --version\n# Docker version 25.0.3, build 4debf41\n\ndocker version\n# Полная информация о client и server\n\n# 2. Добавить в группу docker\nsudo usermod -aG docker $USER\nnewgrp docker\ndocker ps  # Без sudo — должно работать!\n\n# 3. Настроить daemon.json\nsudo tee /etc/docker/daemon.json > /dev/null << \'CONF\'\n{\n  "log-driver": "json-file",\n  "log-opts": {\n    "max-size": "50m",\n    "max-file": "3"\n  },\n  "live-restore": true\n}\nCONF\n\nsudo systemctl restart docker\ndocker info | grep "Logging Driver"\n# Logging Driver: json-file\n\n# 4. docker info диагностика\ndocker info\n# Storage Driver: overlay2\n#   Использует OverlayFS — эффективный copy-on-write driver\n# Cgroup Driver: systemd\n#   Интеграция с systemd для управления ресурсами\n# Runtimes: runc io.containerd.runc.v2\n#   runc — стандартный OCI runtime\n\n# 5. Проверить использование диска\ndocker system df\ndocker system df -v  # Подробно\n\n# Очистить безопасно:\ndocker container prune -f  # -f без подтверждения\ndocker image prune -f      # Только dangling images\n# Общая очистка:\ndocker system prune -f\n\n# 6. Автозапуск\nsudo systemctl enable docker\nsudo systemctl is-enabled docker\n# enabled',
      explanation: 'Правильная настройка Docker: группа docker для удобства, daemon.json для log rotation (без этого логи заполнят диск), live-restore для prod. docker system prune регулярно — важная процедура обслуживания, иначе образы и контейнеры заполнят диск.'
    }
  ]
}
