export default {
  id: 9,
  title: 'Systemd',
  description: 'Система инициализации systemd: управление сервисами, юниты, targets, journalctl, таймеры.',
  lessons: [
    {
      id: 1,
      title: 'Что такое systemd',
      type: 'theory',
      content: [
        { type: 'text', value: 'systemd — система инициализации и менеджер сервисов в большинстве современных дистрибутивов Linux. Запускается как PID 1, управляет загрузкой системы, сервисами, логами, сетью и многим другим.' },
        { type: 'heading', value: 'Основные концепции' },
        { type: 'code', language: 'bash', value: '# Unit (юнит) — базовая единица управления в systemd\n# Типы юнитов:\n# .service  — сервисы (nginx, ssh, postgresql)\n# .timer    — таймеры (замена cron)\n# .socket   — сокеты (активация по запросу)\n# .target   — группы юнитов (аналог runlevel)\n# .mount    — точки монтирования\n# .path     — отслеживание файлов\n# .device   — устройства\n\n# Список всех юнитов:\nsystemctl list-units              # активные юниты\nsystemctl list-units --all        # все юниты\nsystemctl list-units --type=service  # только сервисы\nsystemctl list-unit-files         # все файлы юнитов\n\n# Проверить PID 1:\nps -p 1 -o comm=\n# systemd' },
        { type: 'tip', value: 'systemd заменил SysVinit (init.d) в большинстве дистрибутивов. Если вы встретите /etc/init.d/ скрипты — это наследие SysVinit, сейчас рекомендуется использовать systemd.' }
      ]
    },
    {
      id: 2,
      title: 'Управление сервисами: systemctl',
      type: 'theory',
      content: [
        { type: 'text', value: 'systemctl — основная команда для управления сервисами systemd. Позволяет запускать, останавливать, перезапускать сервисы и управлять их автозагрузкой.' },
        { type: 'code', language: 'bash', value: '# Управление сервисом:\nsudo systemctl start nginx       # запустить\nsudo systemctl stop nginx        # остановить\nsudo systemctl restart nginx     # перезапустить\nsudo systemctl reload nginx      # перечитать конфиг (без перезапуска)\nsudo systemctl status nginx      # статус\n\n# Статус — подробный вывод:\nsystemctl status nginx\n# nginx.service - A high performance web server\n#   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n#   Active: active (running) since Mon 2026-03-15 10:00:00 UTC\n#   Main PID: 1234 (nginx)\n#   Tasks: 5\n#   Memory: 12.5M\n#   CPU: 1.234s\n#   CGroup: /system.slice/nginx.service\n#           ├─1234 nginx: master process\n#           └─1235 nginx: worker process\n\n# Автозагрузка:\nsudo systemctl enable nginx      # включить автозапуск\nsudo systemctl disable nginx     # отключить автозапуск\nsudo systemctl enable --now nginx  # включить и запустить\nsudo systemctl is-enabled nginx  # проверить\nsudo systemctl is-active nginx   # запущен ли' },
        { type: 'heading', value: 'Полезные команды' },
        { type: 'code', language: 'bash', value: '# Список запущенных сервисов:\nsystemctl list-units --type=service --state=running\n\n# Список неудавшихся сервисов:\nsystemctl --failed\n\n# Перезагрузить конфигурацию systemd (после изменения unit-файлов):\nsudo systemctl daemon-reload\n\n# Замаскировать сервис (нельзя будет запустить):\nsudo systemctl mask nginx\nsudo systemctl unmask nginx\n\n# Зависимости сервиса:\nsystemctl list-dependencies nginx\n\n# Перезагрузка/выключение системы:\nsudo systemctl reboot\nsudo systemctl poweroff\nsudo systemctl suspend' },
        { type: 'note', value: 'reload перечитывает конфигурацию без остановки сервиса (zero downtime). Но не все сервисы поддерживают reload. Если reload не работает — используйте restart.' }
      ]
    },
    {
      id: 3,
      title: 'Создание своего сервиса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Unit-файлы сервисов хранятся в /etc/systemd/system/ (пользовательские) и /lib/systemd/system/ (пакетные). Создание своего сервиса — частая задача для деплоя приложений.' },
        { type: 'heading', value: 'Структура unit-файла' },
        { type: 'code', language: 'bash', value: '# Создать файл: /etc/systemd/system/myapp.service\nsudo vim /etc/systemd/system/myapp.service' },
        { type: 'code', language: 'text', value: '[Unit]\nDescription=My Application\nAfter=network.target\nWants=postgresql.service\n\n[Service]\nType=simple\nUser=www-data\nGroup=www-data\nWorkingDirectory=/opt/myapp\nEnvironment=NODE_ENV=production\nEnvironmentFile=/opt/myapp/.env\nExecStart=/usr/bin/node /opt/myapp/server.js\nExecReload=/bin/kill -HUP $MAINPID\nRestart=always\nRestartSec=5\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target' },
        { type: 'code', language: 'bash', value: '# Активировать сервис:\nsudo systemctl daemon-reload\nsudo systemctl enable --now myapp\nsudo systemctl status myapp\n\n# Секции unit-файла:\n# [Unit]    — описание и зависимости\n#   After=    — запускать после указанных юнитов\n#   Wants=    — желательные зависимости (не блокирует)\n#   Requires= — обязательные зависимости (блокирует)\n\n# [Service] — параметры сервиса\n#   Type=simple    — основной процесс = ExecStart\n#   Type=forking   — демон (создаёт fork)\n#   Type=oneshot   — однократная задача\n#   Restart=always — перезапуск при любом завершении\n#   Restart=on-failure — только при ошибке\n#   RestartSec=5   — пауза перед перезапуском\n\n# [Install] — автозагрузка\n#   WantedBy=multi-user.target — запускать в многопользовательском режиме' },
        { type: 'tip', value: 'Restart=always + RestartSec=5 — ваше приложение будет автоматически перезапускаться при падении с паузой 5 секунд. Это базовая отказоустойчивость без дополнительных инструментов.' }
      ]
    },
    {
      id: 4,
      title: 'journalctl — логи systemd',
      type: 'theory',
      content: [
        { type: 'text', value: 'journald — подсистема логирования systemd. journalctl — команда для просмотра логов. Заменяет чтение файлов из /var/log/ для сервисов, управляемых systemd.' },
        { type: 'code', language: 'bash', value: '# Логи конкретного сервиса:\njournalctl -u nginx                  # все логи nginx\njournalctl -u nginx -f               # следить в реальном времени\njournalctl -u nginx --since today    # за сегодня\njournalctl -u nginx --since "1 hour ago"\njournalctl -u nginx --since "2026-03-15" --until "2026-03-16"\n\n# Общие логи:\njournalctl                           # все логи\njournalctl -b                        # с текущей загрузки\njournalctl -b -1                     # с предыдущей загрузки\njournalctl --list-boots               # список загрузок\n\n# Фильтрация:\njournalctl -p err                    # только ошибки\njournalctl -p warning                # предупреждения и выше\n# Уровни: emerg, alert, crit, err, warning, notice, info, debug\n\njournalctl _PID=1234                 # по PID\njournalctl _UID=1000                 # по пользователю\njournalctl -k                        # только сообщения ядра\n\n# Форматирование:\njournalctl -u nginx -o json-pretty   # JSON формат\njournalctl -u nginx --no-pager       # без пагинации\njournalctl -u nginx -n 50            # последние 50 строк\n\n# Размер логов и очистка:\njournalctl --disk-usage              # размер логов\nsudo journalctl --vacuum-size=500M   # ограничить 500 МБ\nsudo journalctl --vacuum-time=30d    # удалить старше 30 дней' },
        { type: 'tip', value: 'journalctl -u myapp -f — незаменимая команда при отладке сервисов. Запустите в одном терминале, а в другом делайте изменения — увидите логи в реальном времени.' }
      ]
    },
    {
      id: 5,
      title: 'Targets и таймеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Targets — группы юнитов (аналог runlevels в SysVinit). Таймеры — замена cron для периодических задач, интегрированная с systemd и journald.' },
        { type: 'heading', value: 'Targets' },
        { type: 'code', language: 'bash', value: '# Targets (замена runlevels):\n# poweroff.target   — выключение (runlevel 0)\n# rescue.target     — однопользовательский (runlevel 1)\n# multi-user.target — многопользовательский без GUI (runlevel 3)\n# graphical.target  — с GUI (runlevel 5)\n# reboot.target     — перезагрузка (runlevel 6)\n\n# Текущий target:\nsystemctl get-default\n# multi-user.target\n\n# Сменить target по умолчанию:\nsudo systemctl set-default multi-user.target\nsudo systemctl set-default graphical.target\n\n# Переключить target на лету:\nsudo systemctl isolate rescue.target' },
        { type: 'heading', value: 'Таймеры (замена cron)' },
        { type: 'code', language: 'bash', value: '# Создать таймер для бэкапа:\n# 1. Сервис: /etc/systemd/system/backup.service\n# [Unit]\n# Description=Daily backup\n# [Service]\n# Type=oneshot\n# ExecStart=/usr/local/bin/backup.sh\n\n# 2. Таймер: /etc/systemd/system/backup.timer\n# [Unit]\n# Description=Run backup daily\n# [Timer]\n# OnCalendar=*-*-* 03:00:00\n# Persistent=true\n# [Install]\n# WantedBy=timers.target\n\n# Активировать таймер:\nsudo systemctl daemon-reload\nsudo systemctl enable --now backup.timer\n\n# Список активных таймеров:\nsystemctl list-timers\n# NEXT                         LEFT       LAST                         PASSED    UNIT\n# Mon 2026-03-16 03:00:00 UTC  16h left   Sun 2026-03-15 03:00:00 UTC  7h ago    backup.timer\n\n# OnCalendar примеры:\n# OnCalendar=*-*-* 03:00:00     — каждый день в 3:00\n# OnCalendar=Mon *-*-* 03:00:00 — каждый понедельник\n# OnCalendar=*-*-01 03:00:00    — первое число каждого месяца\n# OnCalendar=hourly              — каждый час\n# OnCalendar=daily               — каждый день' },
        { type: 'tip', value: 'Таймеры systemd имеют преимущества над cron: логи через journalctl, зависимости, Persistent=true (выполнит пропущенный запуск после загрузки). Для новых задач рекомендуется использовать таймеры.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Systemd сервисы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте и настройте собственный systemd-сервис.',
      requirements: [
        'Создайте простой скрипт /usr/local/bin/healthcheck.sh, который пишет дату в /var/log/healthcheck.log',
        'Создайте systemd сервис для этого скрипта (Type=oneshot)',
        'Создайте systemd таймер, запускающий сервис каждые 5 минут',
        'Активируйте таймер и проверьте его в списке таймеров',
        'Просмотрите логи сервиса через journalctl',
        'Проверьте статус сервисов nginx/ssh через systemctl'
      ],
      hint: 'Type=oneshot для однократных задач. OnCalendar=*:0/5 — каждые 5 минут. systemctl daemon-reload после создания unit-файлов. journalctl -u healthcheck.service для логов.',
      expectedOutput: 'systemctl list-timers: healthcheck.timer в списке\njournalctl -u healthcheck: логи с датой/временем\nsystemctl status nginx: active (running) или inactive',
      solution: '# 1. Создать скрипт\nsudo tee /usr/local/bin/healthcheck.sh << \'EOF\'\n#!/bin/bash\necho "$(date): System OK, load: $(uptime | awk -F: \'{print $NF}\')" >> /var/log/healthcheck.log\nEOF\nsudo chmod +x /usr/local/bin/healthcheck.sh\n\n# 2. Создать сервис\nsudo tee /etc/systemd/system/healthcheck.service << \'EOF\'\n[Unit]\nDescription=System Health Check\n\n[Service]\nType=oneshot\nExecStart=/usr/local/bin/healthcheck.sh\nEOF\n\n# 3. Создать таймер\nsudo tee /etc/systemd/system/healthcheck.timer << \'EOF\'\n[Unit]\nDescription=Run health check every 5 minutes\n\n[Timer]\nOnCalendar=*:0/5\nPersistent=true\n\n[Install]\nWantedBy=timers.target\nEOF\n\n# 4. Активировать\nsudo systemctl daemon-reload\nsudo systemctl enable --now healthcheck.timer\nsystemctl list-timers | grep health\n\n# 5. Логи\njournalctl -u healthcheck.service -n 10\n\n# 6. Статус других сервисов\nsystemctl status nginx\nsystemctl status ssh',
      explanation: 'Type=oneshot идеален для скриптов, которые выполняются и завершаются. Таймер привязывается к сервису по имени (healthcheck.timer -> healthcheck.service). Persistent=true запустит пропущенные задачи после перезагрузки.'
    }
  ]
}
