export default {
  id: 21,
  title: 'Автоматизация',
  description: 'Автоматизация задач: cron, at, systemd timers, основы Ansible.',
  lessons: [
    {
      id: 1,
      title: 'cron — планировщик задач',
      type: 'theory',
      content: [
        { type: 'text', value: 'cron — классический планировщик задач в Linux. Запускает команды по расписанию: ежеминутно, ежечасно, ежедневно и т.д. Каждый пользователь имеет свой crontab.' },
        { type: 'code', language: 'bash', value: '# Формат crontab:\n# MIN HOUR DAY MONTH WEEKDAY COMMAND\n# 0-59 0-23 1-31 1-12  0-7     команда\n# (0 и 7 = воскресенье)\n\n# Редактировать crontab:\ncrontab -e\n\n# Примеры:\n# Каждую минуту:\n* * * * * /usr/local/bin/check.sh\n\n# Каждый день в 3:00:\n0 3 * * * /usr/local/bin/backup.sh\n\n# Каждый понедельник в 9:00:\n0 9 * * 1 /usr/local/bin/report.sh\n\n# Каждые 5 минут:\n*/5 * * * * /usr/local/bin/monitor.sh\n\n# Каждый час с 9 до 18 в рабочие дни:\n0 9-18 * * 1-5 /usr/local/bin/check.sh\n\n# Первое число каждого месяца в полночь:\n0 0 1 * * /usr/local/bin/monthly-report.sh\n\n# Специальные строки:\n@reboot    /usr/local/bin/startup.sh   # при загрузке\n@daily     /usr/local/bin/backup.sh    # ежедневно (0:00)\n@weekly    /usr/local/bin/cleanup.sh   # еженедельно\n@monthly   /usr/local/bin/report.sh    # ежемесячно\n@hourly    /usr/local/bin/check.sh     # ежечасно' },
        { type: 'heading', value: 'Управление crontab' },
        { type: 'code', language: 'bash', value: '# Просмотр crontab:\ncrontab -l\n\n# Crontab другого пользователя (root):\nsudo crontab -u bob -l\n\n# Удалить crontab:\ncrontab -r\n\n# Системный crontab:\ncat /etc/crontab\nls /etc/cron.d/        # дополнительные файлы\nls /etc/cron.daily/    # ежедневные скрипты\nls /etc/cron.hourly/   # ежечасные\nls /etc/cron.weekly/   # еженедельные\nls /etc/cron.monthly/  # ежемесячные\n\n# Важно: перенаправляйте вывод!\n0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1\n# Без перенаправления — cron отправит вывод на email\n\n# Переменные окружения в crontab:\nSHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin\nMAILTO=admin@example.com' },
        { type: 'tip', value: 'Частая ошибка: cron не находит команды из-за другого PATH. Всегда указывайте полный путь к командам в crontab или задайте PATH в начале файла.' }
      ]
    },
    {
      id: 2,
      title: 'at — однократные задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'at запускает команду однократно в указанное время. В отличие от cron, at не для регулярных задач, а для "сделай это завтра в 3 часа ночи".' },
        { type: 'code', language: 'bash', value: '# Установка:\nsudo apt install at\nsudo systemctl enable --now atd\n\n# Запланировать задачу:\nat 03:00\nat> /usr/local/bin/maintenance.sh\nat> <Ctrl+D>\n\n# Разные форматы времени:\nat now + 30 minutes\nat now + 2 hours\nat 10:00 tomorrow\nat 15:00 2026-04-01\nat midnight\nat noon\n\n# Из строки:\necho "/usr/local/bin/cleanup.sh" | at 03:00\n\n# Список запланированных задач:\natq\n# 1   Mon Mar 16 03:00:00 2026 a user\n\n# Удалить задачу:\natrm 1\n\n# Посмотреть содержимое задачи:\nat -c 1\n\n# batch — запустить когда нагрузка CPU низкая:\necho "/usr/local/bin/heavy-task.sh" | batch' },
        { type: 'tip', value: 'at идеален для: перезагрузки сервера ночью (echo "reboot" | sudo at 03:00), однократного бэкапа, отложенной отправки отчёта. batch запустит задачу когда нагрузка упадёт ниже 1.5.' }
      ]
    },
    {
      id: 3,
      title: 'systemd timers vs cron',
      type: 'theory',
      content: [
        { type: 'text', value: 'systemd timers — современная альтернатива cron. Преимущества: интеграция с journalctl, зависимости, Persistent (запуск пропущенных задач), рандомизация времени.' },
        { type: 'code', language: 'bash', value: '# Сравнение cron vs systemd timers:\n#\n# cron:\n#  + Простой синтаксис\n#  + Широко известен\n#  - Нет логирования (нужно самому)\n#  - Нет зависимостей\n#  - Пропущенные задачи не выполняются\n#\n# systemd timers:\n#  + Логи через journalctl\n#  + Persistent=true — пропущенные задачи\n#  + Зависимости (After=network.target)\n#  + RandomizedDelaySec — рандомизация\n#  - Больше файлов (service + timer)\n\n# Список активных таймеров:\nsystemctl list-timers --all\n\n# Пример: ежедневный бэкап\n# /etc/systemd/system/backup.service\n# [Unit]\n# Description=Daily backup\n# After=network.target\n# [Service]\n# Type=oneshot\n# ExecStart=/usr/local/bin/backup.sh\n# StandardOutput=journal\n\n# /etc/systemd/system/backup.timer\n# [Unit]\n# Description=Run backup daily at 3:00\n# [Timer]\n# OnCalendar=*-*-* 03:00:00\n# Persistent=true\n# RandomizedDelaySec=1800\n# [Install]\n# WantedBy=timers.target\n\nsudo systemctl daemon-reload\nsudo systemctl enable --now backup.timer\njournalctl -u backup.service   # логи бэкапа' },
        { type: 'tip', value: 'RandomizedDelaySec=1800 добавляет случайную задержку до 30 минут — полезно если 100 серверов запускают бэкап одновременно. Persistent=true запустит бэкап после загрузки, если сервер был выключен в 3:00.' }
      ]
    },
    {
      id: 4,
      title: 'Ansible: основы автоматизации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ansible — инструмент автоматизации конфигурации серверов. Без агентов (использует SSH), декларативный (описываете желаемое состояние), идемпотентный (безопасно запускать повторно).' },
        { type: 'code', language: 'bash', value: '# Установка Ansible:\nsudo apt install ansible\n# или через pip:\npip install ansible\n\n# Inventory — список серверов:\n# /etc/ansible/hosts или свой файл\ncat > inventory.ini << \'EOF\'\n[web]\nweb1 ansible_host=10.0.1.1\nweb2 ansible_host=10.0.1.2\n\n[db]\ndb1 ansible_host=10.0.2.1\n\n[all:vars]\nansible_user=deploy\nansible_ssh_private_key_file=~/.ssh/id_deploy\nEOF\n\n# Ad-hoc команды:\nansible all -i inventory.ini -m ping\nansible web -i inventory.ini -m shell -a "uptime"\nansible web -i inventory.ini -m apt -a "name=nginx state=present" --become\nansible all -i inventory.ini -m shell -a "df -h" -o' },
        { type: 'heading', value: 'Ansible Playbook' },
        { type: 'code', language: 'yaml', value: '# setup-server.yml\n---\n- name: Настройка веб-сервера\n  hosts: web\n  become: true\n  vars:\n    app_user: deploy\n    app_dir: /opt/myapp\n\n  tasks:\n    - name: Обновить пакеты\n      apt:\n        update_cache: yes\n        upgrade: safe\n\n    - name: Установить необходимые пакеты\n      apt:\n        name:\n          - nginx\n          - certbot\n          - python3-certbot-nginx\n          - fail2ban\n          - ufw\n        state: present\n\n    - name: Настроить UFW\n      ufw:\n        rule: allow\n        port: "{{ item }}"\n        proto: tcp\n      loop:\n        - "22"\n        - "80"\n        - "443"\n\n    - name: Включить UFW\n      ufw:\n        state: enabled\n        policy: deny\n\n    - name: Запустить Nginx\n      systemd:\n        name: nginx\n        state: started\n        enabled: yes\n\n    - name: Скопировать конфиг Nginx\n      template:\n        src: templates/nginx.conf.j2\n        dest: /etc/nginx/sites-available/myapp\n      notify: Reload Nginx\n\n  handlers:\n    - name: Reload Nginx\n      systemd:\n        name: nginx\n        state: reloaded' },
        { type: 'code', language: 'bash', value: '# Запуск playbook:\nansible-playbook -i inventory.ini setup-server.yml\nansible-playbook -i inventory.ini setup-server.yml --check   # dry-run\nansible-playbook -i inventory.ini setup-server.yml --diff    # показать изменения' },
        { type: 'tip', value: 'Ansible идемпотентен: запускайте playbook сколько угодно раз — он изменит только то, что отличается от желаемого состояния. --check покажет что будет изменено без выполнения.' }
      ]
    },
    {
      id: 5,
      title: 'Скрипты автоматизации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо Ansible, многие задачи автоматизируются bash-скриптами. Типичные задачи: provisioning нового сервера, деплой приложения, мониторинг и алертинг, ротация секретов.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# server-init.sh — инициализация нового сервера\nset -euo pipefail\n\nLOG="/var/log/server-init.log"\nlog() { echo "[$(date +%Y-%m-%dT%H:%M:%S)] $1" | tee -a "$LOG"; }\n\nlog "=== Инициализация сервера ===" \n\n# 1. Обновления\nlog "Обновление пакетов..."\napt update && apt upgrade -y\n\n# 2. Базовые пакеты\nlog "Установка базовых пакетов..."\napt install -y vim htop curl wget tree jq \\\n    fail2ban ufw unattended-upgrades \\\n    logrotate rsync\n\n# 3. Создание пользователя\nUSERNAME=${1:-deploy}\nlog "Создание пользователя $USERNAME..."\nuseradd -m -s /bin/bash -G sudo "$USERNAME"\nmkdir -p /home/$USERNAME/.ssh\nchmod 700 /home/$USERNAME/.ssh\n# Скопировать SSH-ключ сюда\n\n# 4. SSH hardening\nlog "Настройка SSH..."\nsed -i \'s/#PermitRootLogin.*/PermitRootLogin no/\' /etc/ssh/sshd_config\nsed -i \'s/#PasswordAuthentication.*/PasswordAuthentication no/\' /etc/ssh/sshd_config\nsystemctl reload sshd\n\n# 5. Firewall\nlog "Настройка firewall..."\nufw default deny incoming\nufw default allow outgoing\nufw allow ssh\nufw --force enable\n\n# 6. fail2ban\nlog "Настройка fail2ban..."\nsystemctl enable --now fail2ban\n\n# 7. Автообновления\nlog "Включение автообновлений..."\ndpkg-reconfigure -plow unattended-upgrades\n\nlog "=== Инициализация завершена ==="' },
        { type: 'tip', value: 'Создайте свой скрипт инициализации сервера и храните в Git. При создании нового сервера: curl -sSL https://your-repo/init.sh | sudo bash — сервер готов за минуты.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Автоматизация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте автоматические задачи и скрипты.',
      requirements: [
        'Создайте cron-задачу, которая каждые 5 минут пишет дату в файл',
        'Создайте systemd timer, запускающий скрипт каждый час',
        'Запланируйте однократную задачу через at на завтра',
        'Напишите скрипт автоматической проверки дискового пространства',
        'Настройте отправку результата проверки в syslog (через logger)',
        'Проверьте все cron-задачи и таймеры в системе'
      ],
      hint: 'crontab -e для редактирования cron. echo "command" | at tomorrow для at. systemctl list-timers для таймеров. df -h | awk для проверки дисков.',
      expectedOutput: 'crontab -l: */5 * * * * date >> /tmp/cron-test.log\nsystemd timer: active, next run in 55 minutes\nat: задача на завтра запланирована\nСкрипт: /opt/check-disk.sh — проверяет все разделы\nlogger: сообщение в syslog\nТаймеры: backup.timer, healthcheck.timer, ...',
      solution: '# 1. Cron — каждые 5 минут\ncrontab -l 2>/dev/null > /tmp/crontab.bak\necho "*/5 * * * * date >> /tmp/cron-date.log" | crontab -\ncrontab -l\n\n# 2. Systemd timer (каждый час)\nsudo tee /etc/systemd/system/hourly-check.service << \'EOF\'\n[Unit]\nDescription=Hourly system check\n[Service]\nType=oneshot\nExecStart=/bin/bash -c "echo Check at $(date) >> /tmp/hourly.log"\nEOF\n\nsudo tee /etc/systemd/system/hourly-check.timer << \'EOF\'\n[Unit]\nDescription=Run hourly check\n[Timer]\nOnCalendar=hourly\nPersistent=true\n[Install]\nWantedBy=timers.target\nEOF\n\nsudo systemctl daemon-reload\nsudo systemctl enable --now hourly-check.timer\n\n# 3. at\necho "echo at-task-done >> /tmp/at-test.log" | at now + 1 minute\natq\n\n# 4-5. Скрипт проверки\nsudo tee /opt/check-disk.sh << \'SCRIPT\'\n#!/bin/bash\ndf -h --output=target,pcent | tail -n +2 | while read MOUNT PCT; do\n    NUM=${PCT%\\%}\n    if [ "$NUM" -gt 80 ]; then\n        logger -t disk-check "WARNING: $MOUNT at ${PCT}"\n    fi\ndone\nSCRIPT\nsudo chmod +x /opt/check-disk.sh\n/opt/check-disk.sh\n\n# 6. Проверка\ncrontab -l\nsystemctl list-timers',
      explanation: 'crontab -e редактирует задачи текущего пользователя. Systemd timer связан с одноимённым service. at выполняет задачу однократно. logger -t отправляет в syslog с тегом. systemctl list-timers показывает все активные таймеры.'
    }
  ]
}
