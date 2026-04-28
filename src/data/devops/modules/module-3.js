export default {
  id: 3,
  title: 'Linux: администрирование',
  description: 'Управление процессами, сервисами, планировщик задач cron, systemd, мониторинг ресурсов и SSH доступ.',
  lessons: [
    {
      id: 1,
      title: 'Управление процессами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Процесс — это запущенная программа. Каждый процесс имеет PID (Process ID), потребляет CPU и память. DevOps-инженер должен уметь находить, анализировать и управлять процессами.' },
        { type: 'heading', value: 'Просмотр процессов' },
        { type: 'code', language: 'bash', value: '# ps — снимок текущих процессов\nps aux                          # Все процессы\nps aux | grep nginx             # Найти процесс nginx\nps -ef --forest                 # Дерево процессов\n\n# top — интерактивный мониторинг\ntop\n# Клавиши в top:\n# M — сортировка по памяти\n# P — сортировка по CPU\n# k — убить процесс (ввести PID)\n# q — выйти\n\n# htop — улучшенный top (нужно установить)\nsudo apt install htop\nhtop\n\n# Информация о процессе\nps aux | head -1                # Заголовок: USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND\n# USER     PID %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND\n# root       1  0.0  0.1 169344 11256 ?    Ss   Mar20   0:05 /sbin/init\n# www-data 456  2.1  1.5 234567 61234 ?    S    10:00   1:23 nginx: worker' },
        { type: 'heading', value: 'Управление процессами' },
        { type: 'code', language: 'bash', value: '# Сигналы\nkill PID                        # SIGTERM (мягкое завершение)\nkill -9 PID                     # SIGKILL (принудительное завершение)\nkill -HUP PID                   # SIGHUP (перезагрузить конфиг)\nkillall nginx                   # Убить все процессы по имени\npkill -f "python app.py"        # Убить по шаблону команды\n\n# Фоновые процессы\ncommand &                       # Запустить в фоне\nnohup command &                 # Запустить в фоне (не умрёт при закрытии терминала)\njobs                            # Список фоновых задач\nfg %1                           # Вернуть задачу 1 на передний план\nbg %1                           # Продолжить задачу 1 в фоне\n\n# Мониторинг ресурсов\nfree -h                         # Оперативная память\ndf -h                           # Дисковое пространство\ndu -sh /var/*                   # Размер каталогов\nlsof -i :80                     # Кто слушает порт 80\nss -tlnp                        # Все слушающие порты' },
        { type: 'warning', value: 'kill -9 (SIGKILL) — крайняя мера. Процесс не получает шанса корректно завершиться (закрыть файлы, сохранить данные). Всегда сначала пробуй kill (SIGTERM), и только если процесс не отвечает — kill -9.' }
      ]
    },
    {
      id: 2,
      title: 'Systemd и управление сервисами',
      type: 'theory',
      content: [
        { type: 'text', value: 'systemd — система инициализации и управления сервисами в современных Linux. Она запускает и контролирует все системные процессы. Понимание systemd критично для управления серверами.' },
        { type: 'heading', value: 'Управление сервисами через systemctl' },
        { type: 'code', language: 'bash', value: '# Основные команды systemctl\nsudo systemctl start nginx       # Запустить сервис\nsudo systemctl stop nginx        # Остановить сервис\nsudo systemctl restart nginx     # Перезапустить\nsudo systemctl reload nginx      # Перезагрузить конфигурацию (без остановки)\nsudo systemctl status nginx      # Статус сервиса\n\n# Автозапуск\nsudo systemctl enable nginx      # Включить автозапуск при загрузке\nsudo systemctl disable nginx     # Выключить автозапуск\nsudo systemctl is-enabled nginx  # Проверить автозапуск\n\n# Просмотр сервисов\nsystemctl list-units --type=service              # Все активные сервисы\nsystemctl list-units --type=service --state=running  # Только запущенные\nsystemctl list-unit-files --type=service         # Все установленные' },
        { type: 'heading', value: 'Создание собственного сервиса' },
        { type: 'code', language: 'bash', value: '# Файл юнита: /etc/systemd/system/myapp.service\n[Unit]\nDescription=My Application\nAfter=network.target\nWants=postgresql.service\n\n[Service]\nType=simple\nUser=appuser\nGroup=appuser\nWorkingDirectory=/opt/myapp\nExecStart=/opt/myapp/venv/bin/python app.py\nExecReload=/bin/kill -HUP $MAINPID\nRestart=always\nRestartSec=5\nEnvironmentFile=/opt/myapp/.env\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target' },
        { type: 'code', language: 'bash', value: '# Применить новый сервис\nsudo systemctl daemon-reload     # Перечитать файлы юнитов\nsudo systemctl start myapp       # Запустить\nsudo systemctl enable myapp      # Автозапуск\nsudo systemctl status myapp      # Проверить' },
        { type: 'tip', value: 'Restart=always автоматически перезапускает сервис при падении. RestartSec=5 добавляет 5-секундную задержку между перезапусками. After=network.target гарантирует что сеть доступна перед запуском.' }
      ]
    },
    {
      id: 3,
      title: 'Логи и journalctl',
      type: 'theory',
      content: [
        { type: 'text', value: 'Логи — главный источник информации при отладке. В Linux логи хранятся в /var/log и в журнале systemd (journald). Умение быстро находить нужную информацию в логах — ключевой навык DevOps.' },
        { type: 'heading', value: 'Системные логи' },
        { type: 'code', language: 'bash', value: '# Основные лог-файлы\n/var/log/syslog        # Общий системный лог (Ubuntu/Debian)\n/var/log/messages      # Общий системный лог (CentOS/RHEL)\n/var/log/auth.log      # Авторизация (SSH входы, sudo)\n/var/log/kern.log      # Ядро (драйверы, OOM)\n/var/log/nginx/        # Логи nginx\n/var/log/mysql/        # Логи MySQL\n/var/log/apt/          # Логи пакетного менеджера\n\n# Просмотр логов\ntail -f /var/log/syslog              # Следить в реальном времени\ntail -100 /var/log/auth.log          # Последние 100 строк\ngrep "Failed password" /var/log/auth.log  # Неудачные SSH входы' },
        { type: 'heading', value: 'journalctl — логи systemd' },
        { type: 'code', language: 'bash', value: '# journalctl — просмотр журнала systemd\njournalctl                            # Все логи\njournalctl -u nginx                   # Логи конкретного сервиса\njournalctl -u nginx --since "1 hour ago"  # За последний час\njournalctl -u nginx --since today     # За сегодня\njournalctl -u nginx -f                # Следить в реальном времени\njournalctl -u nginx --no-pager        # Без пагинации\njournalctl -p err                     # Только ошибки\njournalctl -p err --since "2024-01-01"  # Ошибки с даты\njournalctl --disk-usage                # Размер журнала\nsudo journalctl --vacuum-size=500M     # Ограничить размер журнала\n\n# Полезные фильтры\njournalctl -u nginx -p err -n 50      # Последние 50 ошибок nginx\njournalctl _PID=1234                  # Логи конкретного процесса\njournalctl -b                         # С момента загрузки\njournalctl -b -1                      # Предыдущая загрузка' },
        { type: 'note', value: 'journalctl хранит логи в бинарном формате (более эффективно), а традиционные логи в /var/log — текстовые. Для Docker контейнеров логи доступны через docker logs, но на уровне хоста также видны через journalctl.' }
      ]
    },
    {
      id: 4,
      title: 'Cron и планировщик задач',
      type: 'theory',
      content: [
        { type: 'text', value: 'cron — планировщик задач в Linux. Позволяет запускать скрипты и команды по расписанию. Используется для бэкапов, очистки логов, мониторинга, отправки отчётов.' },
        { type: 'heading', value: 'Формат cron-расписания' },
        { type: 'code', language: 'bash', value: '# Формат: минута час день месяц день_недели команда\n# ┌───── минута (0-59)\n# │ ┌───── час (0-23)\n# │ │ ┌───── день месяца (1-31)\n# │ │ │ ┌───── месяц (1-12)\n# │ │ │ │ ┌───── день недели (0-7, 0 и 7 = воскресенье)\n# │ │ │ │ │\n# * * * * * команда\n\n# Примеры:\n0 * * * *     # Каждый час в 00 минут\n*/5 * * * *   # Каждые 5 минут\n0 2 * * *     # Ежедневно в 2:00\n0 0 * * 0     # Каждое воскресенье в полночь\n0 3 1 * *     # 1-го числа каждого месяца в 3:00\n30 6 * * 1-5  # Пн-Пт в 6:30\n0 */6 * * *   # Каждые 6 часов' },
        { type: 'heading', value: 'Управление cron' },
        { type: 'code', language: 'bash', value: '# Редактировать crontab текущего пользователя\ncrontab -e\n\n# Просмотреть crontab\ncrontab -l\n\n# Crontab другого пользователя (от root)\nsudo crontab -u devops -l\n\n# Системный crontab\nsudo vim /etc/crontab\n\n# Примеры задач:\n# Бэкап базы данных ежедневно в 2:00\n0 2 * * * /opt/scripts/backup-db.sh >> /var/log/backup.log 2>&1\n\n# Очистка старых логов каждое воскресенье\n0 3 * * 0 find /var/log -name "*.log" -mtime +30 -delete\n\n# Проверка диска каждые 5 минут\n*/5 * * * * /opt/scripts/check-disk.sh\n\n# SSL сертификат обновление (Let\'s Encrypt)\n0 0 1 * * certbot renew --quiet >> /var/log/certbot.log 2>&1\n\n# Очистка Docker каждую ночь\n0 4 * * * docker system prune -f >> /var/log/docker-cleanup.log 2>&1' },
        { type: 'warning', value: 'Cron не загружает пользовательское окружение (.bashrc). Указывай полные пути к командам: /usr/bin/docker вместо docker. Всегда перенаправляй вывод в лог-файл, иначе cron будет отправлять email.' }
      ]
    },
    {
      id: 5,
      title: 'SSH и удалённый доступ',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSH (Secure Shell) — основной способ удалённого доступа к серверам. DevOps-инженер использует SSH ежедневно для управления серверами, деплоя, туннелирования и передачи файлов.' },
        { type: 'heading', value: 'Генерация и использование SSH-ключей' },
        { type: 'code', language: 'bash', value: '# Генерация SSH-ключа\nssh-keygen -t ed25519 -C "devops@company.com"\n# Сохранит в ~/.ssh/id_ed25519 (приватный) и ~/.ssh/id_ed25519.pub (публичный)\n\n# Скопировать публичный ключ на сервер\nssh-copy-id user@server\n# или вручную:\ncat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"\n\n# Подключение\nssh user@server                       # По паролю или ключу\nssh -p 2222 user@server               # Нестандартный порт\nssh -i ~/.ssh/my-key user@server      # Конкретный ключ' },
        { type: 'heading', value: 'SSH конфигурация' },
        { type: 'code', language: 'bash', value: '# ~/.ssh/config — упрощает подключение\nHost production\n    HostName 192.168.1.100\n    User deploy\n    Port 22\n    IdentityFile ~/.ssh/prod-key\n\nHost staging\n    HostName 192.168.1.200\n    User deploy\n    IdentityFile ~/.ssh/staging-key\n\nHost bastion\n    HostName 10.0.0.1\n    User admin\n\nHost private-server\n    HostName 10.0.1.50\n    User deploy\n    ProxyJump bastion\n\n# Теперь вместо: ssh -i ~/.ssh/prod-key -p 22 deploy@192.168.1.100\n# Просто: ssh production' },
        { type: 'heading', value: 'SCP и туннели' },
        { type: 'code', language: 'bash', value: '# Копирование файлов\nscp file.txt user@server:/tmp/            # Файл на сервер\nscp user@server:/var/log/app.log ./       # Файл с сервера\nscp -r directory/ user@server:/opt/       # Каталог рекурсивно\n\n# rsync — умное копирование (только изменения)\nrsync -avz ./app/ user@server:/opt/app/   # Синхронизация каталогов\nrsync -avz --delete ./app/ user@server:/opt/app/  # + удаление лишнего\n\n# SSH-туннели\nssh -L 8080:localhost:80 user@server      # Local: localhost:8080 -> server:80\nssh -R 8080:localhost:3000 user@server    # Remote: server:8080 -> local:3000\nssh -D 1080 user@server                  # SOCKS прокси' },
        { type: 'tip', value: 'Всегда используй SSH-ключи вместо паролей. Отключи вход по паролю на серверах: PasswordAuthentication no в /etc/ssh/sshd_config. Это значительно повышает безопасность.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Администрирование сервера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выполните типичные задачи администрирования Linux-сервера: управление сервисами, cron-задачи, мониторинг ресурсов.',
      requirements: [
        'Создайте systemd-юнит для простого скрипта, который пишет дату в файл каждые 10 секунд',
        'Запустите сервис, проверьте статус, просмотрите логи через journalctl',
        'Создайте cron-задачу для очистки /tmp каждый час',
        'Найдите топ-5 процессов по потреблению памяти',
        'Проверьте использование дисков и найдите самый большой каталог в /var'
      ],
      hint: 'Создайте скрипт-сервис в /opt/myservice/, юнит-файл в /etc/systemd/system/. Для cron используйте crontab -e. Для топ процессов: ps aux --sort=-%mem | head.',
      expectedOutput: 'Сервис mylogger.service запущен: Active: active (running)\njournalctl -u mylogger показывает записи с датой каждые 10 секунд\nCron-задача добавлена: 0 * * * * find /tmp -type f -mtime +1 -delete\nТоп-5 процессов по памяти выведены\nСамый большой каталог в /var найден',
      solution: '#!/bin/bash\n# 1. Создаём скрипт-сервис\nsudo mkdir -p /opt/myservice\nsudo bash -c \'cat > /opt/myservice/logger.sh << "SCRIPT"\n#!/bin/bash\nwhile true; do\n    echo "$(date): Service is running"\n    sleep 10\ndone\nSCRIPT\'\nsudo chmod +x /opt/myservice/logger.sh\n\n# 2. Создаём systemd юнит\nsudo bash -c \'cat > /etc/systemd/system/mylogger.service << "UNIT"\n[Unit]\nDescription=My Logger Service\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/opt/myservice/logger.sh\nRestart=always\nRestartSec=5\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\nUNIT\'\n\n# 3. Запуск и проверка\nsudo systemctl daemon-reload\nsudo systemctl start mylogger\nsudo systemctl status mylogger\njournalctl -u mylogger -f --no-pager -n 10\n\n# 4. Cron-задача\n(crontab -l 2>/dev/null; echo "0 * * * * find /tmp -type f -mtime +1 -delete") | crontab -\ncrontab -l\n\n# 5. Топ-5 процессов по памяти\nps aux --sort=-%mem | head -6\n\n# 6. Использование дисков\ndf -h\ndu -sh /var/* 2>/dev/null | sort -rh | head -5',
      explanation: 'systemd управляет жизненным циклом сервиса: запуск, остановка, перезапуск при падении. journalctl собирает stdout/stderr сервиса. cron запускает задачи по расписанию. ps aux --sort=-%mem сортирует процессы по потреблению памяти в убывающем порядке.'
    }
  ]
}
