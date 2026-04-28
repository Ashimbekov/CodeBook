export default {
  id: 17,
  title: 'Мониторинг и логи',
  description: 'Системы логирования: syslog, journald, logrotate. Мониторинг системы: dmesg, /var/log.',
  lessons: [
    {
      id: 1,
      title: 'Система логирования Linux',
      type: 'theory',
      content: [
        { type: 'text', value: 'Linux использует две системы логирования: rsyslog (традиционная, записывает в /var/log/) и journald (systemd, бинарный формат). Обе работают параллельно в большинстве современных дистрибутивов.' },
        { type: 'code', language: 'bash', value: '# Основные файлы логов:\nls -la /var/log/\n\n# /var/log/syslog        — общий системный лог (Debian/Ubuntu)\n# /var/log/messages      — общий системный лог (RHEL/CentOS)\n# /var/log/auth.log      — аутентификация (SSH, sudo, login)\n# /var/log/kern.log      — сообщения ядра\n# /var/log/dmesg         — загрузка ядра\n# /var/log/dpkg.log      — установка пакетов\n# /var/log/apt/          — логи apt\n# /var/log/nginx/        — логи Nginx\n# /var/log/postgresql/   — логи PostgreSQL\n# /var/log/fail2ban.log  — логи fail2ban\n\n# Просмотр логов:\ntail -f /var/log/syslog              # в реальном времени\ntail -100 /var/log/auth.log          # последние 100 строк\nless /var/log/syslog                 # постраничный просмотр\ngrep "error" /var/log/syslog         # поиск ошибок\ngrep -i "failed" /var/log/auth.log   # неудачные попытки входа\n\n# Уровни логирования (syslog):\n# emerg    — система неработоспособна\n# alert    — требуется немедленное вмешательство\n# crit     — критические ошибки\n# err      — ошибки\n# warning  — предупреждения\n# notice   — важные информационные сообщения\n# info     — информационные\n# debug    — отладочные' },
        { type: 'tip', value: 'tail -f /var/log/auth.log — мониторьте попытки входа в реальном времени. Если видите множество Failed password — это может быть brute-force атака. Используйте fail2ban для защиты.' }
      ]
    },
    {
      id: 2,
      title: 'journald и journalctl',
      type: 'theory',
      content: [
        { type: 'text', value: 'journald — система логирования systemd. Хранит логи в бинарном формате с богатыми метаданными. journalctl предоставляет мощные фильтры для поиска и анализа.' },
        { type: 'code', language: 'bash', value: '# Все логи:\njournalctl\n\n# Логи текущей загрузки:\njournalctl -b\njournalctl -b -1           # предыдущей загрузки\njournalctl --list-boots    # список загрузок\n\n# По сервису:\njournalctl -u nginx\njournalctl -u nginx -f     # в реальном времени\njournalctl -u nginx --since "1 hour ago"\njournalctl -u nginx --since today\njournalctl -u nginx --since "2026-03-15 10:00" --until "2026-03-15 12:00"\n\n# По приоритету:\njournalctl -p err          # ошибки и выше\njournalctl -p warning -b   # предупреждения текущей загрузки\n\n# По PID, пользователю:\njournalctl _PID=1234\njournalctl _UID=1000\njournalctl _COMM=nginx     # по имени команды\n\n# Сообщения ядра:\njournalctl -k              # аналог dmesg\n\n# Форматирование:\njournalctl -u nginx -o json-pretty  # JSON\njournalctl -u nginx --no-pager      # без пагинации\njournalctl -u nginx -n 50           # последние 50\n\n# Управление размером:\njournalctl --disk-usage\nsudo journalctl --vacuum-size=500M\nsudo journalctl --vacuum-time=30d' },
        { type: 'tip', value: 'journalctl -p err -b — быстрый способ найти все ошибки с момента последней загрузки. Незаменимо при диагностике проблем после перезагрузки сервера.' }
      ]
    },
    {
      id: 3,
      title: 'logrotate — ротация логов',
      type: 'theory',
      content: [
        { type: 'text', value: 'logrotate управляет ротацией лог-файлов: сжимает, архивирует и удаляет старые логи. Без ротации логи заполнят весь диск. Запускается ежедневно через cron или systemd timer.' },
        { type: 'code', language: 'bash', value: '# Конфигурация logrotate:\ncat /etc/logrotate.conf\n# weekly            — ротация раз в неделю\n# rotate 4          — хранить 4 архива\n# create            — создать новый файл после ротации\n# compress          — сжимать gzip\n# include /etc/logrotate.d\n\n# Конфиг для конкретного приложения:\ncat /etc/logrotate.d/nginx\n# /var/log/nginx/*.log {\n#     daily\n#     missingok\n#     rotate 14\n#     compress\n#     delaycompress\n#     notifempty\n#     create 0640 www-data adm\n#     sharedscripts\n#     postrotate\n#         [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)\n#     endscript\n# }' },
        { type: 'heading', value: 'Создание своей конфигурации' },
        { type: 'code', language: 'bash', value: '# Конфиг для вашего приложения:\nsudo vim /etc/logrotate.d/myapp\n\n# /var/log/myapp/*.log {\n#     daily              # ежедневно\n#     rotate 30          # хранить 30 дней\n#     compress           # сжимать\n#     delaycompress      # не сжимать последний\n#     missingok          # не ошибка если файла нет\n#     notifempty         # не ротировать пустые\n#     create 0644 myuser mygroup\n#     copytruncate       # копировать и обрезать (для приложений без SIGHUP)\n#     maxsize 100M       # ротировать если > 100 MB\n# }\n\n# Тест конфигурации:\nsudo logrotate -d /etc/logrotate.d/myapp    # dry-run\nsudo logrotate -f /etc/logrotate.d/myapp    # принудительная ротация\n\n# Результат ротации:\nls -la /var/log/nginx/\n# access.log\n# access.log.1\n# access.log.2.gz\n# access.log.3.gz' },
        { type: 'note', value: 'copytruncate — безопасный вариант для приложений, которые не умеют переоткрывать лог-файл. Он копирует лог и обрезает оригинал. Недостаток: возможна потеря строк в момент ротации.' }
      ]
    },
    {
      id: 4,
      title: 'dmesg и сообщения ядра',
      type: 'theory',
      content: [
        { type: 'text', value: 'dmesg выводит сообщения кольцевого буфера ядра. Содержит информацию о загрузке, обнаруженных устройствах, ошибках драйверов. Незаменим для диагностики аппаратных проблем.' },
        { type: 'code', language: 'bash', value: '# Все сообщения ядра:\ndmesg\ndmesg | less\n\n# С временными метками:\ndmesg -T\n# [Sun Mar 15 10:00:00 2026] EXT4-fs (sda1): mounted filesystem\n\n# Фильтрация по уровню:\ndmesg -l err              # только ошибки\ndmesg -l err,warn         # ошибки и предупреждения\n\n# В реальном времени:\ndmesg -w                  # следить за новыми сообщениями\n\n# Поиск проблем:\ndmesg | grep -i error     # ошибки\ndmesg | grep -i "out of memory"  # OOM\ndmesg | grep -i usb       # USB устройства\ndmesg | grep -i "disk"    # проблемы с дисками\ndmesg | grep -i "eth\\|network"   # сетевые проблемы\n\n# Примеры типичных сообщений:\n# [error] EXT4-fs error: ...         — ошибки файловой системы\n# [error] ata1: ... link is slow     — проблемы с диском\n# Out of memory: Killed process ...  — OOM killer\n# segfault at ...                    — падение программы\n\n# Очистить буфер:\nsudo dmesg -c' },
        { type: 'tip', value: 'dmesg -T | grep -i error — первая команда при диагностике аппаратных проблем. Если видите ошибки EXT4-fs или ata — срочно проверяйте диск (smartctl) и делайте бэкап.' }
      ]
    },
    {
      id: 5,
      title: 'Централизованное логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'При управлении несколькими серверами логи собирают в одно место. rsyslog может отправлять логи на удалённый сервер. Для больших инфраструктур используют ELK Stack (Elasticsearch, Logstash, Kibana) или Loki.' },
        { type: 'code', language: 'bash', value: '# Отправка логов на удалённый сервер (rsyslog):\n\n# На сервере логов (receiver) — /etc/rsyslog.conf:\n# Включить TCP:\n# module(load="imtcp")\n# input(type="imtcp" port="514")\n\n# На клиенте (sender) — /etc/rsyslog.d/remote.conf:\n# *.* @@logserver.example.com:514    # TCP\n# *.* @logserver.example.com:514     # UDP\n\n# Перезапустить rsyslog:\nsudo systemctl restart rsyslog\n\n# Проверить:\nlogger "Test message from client"\n# На сервере: tail -f /var/log/syslog\n\n# logger — отправить сообщение в syslog из скрипта:\nlogger "Бэкап завершён успешно"\nlogger -p local0.err "Ошибка бэкапа!"\nlogger -t myapp "Приложение запущено"\n\n# Запись в syslog из bash-скрипта:\n#!/bin/bash\nLOG_TAG="backup-script"\nlogger -t "$LOG_TAG" "Начало бэкапа"\nif backup_command; then\n    logger -t "$LOG_TAG" "Бэкап успешен"\nelse\n    logger -t "$LOG_TAG" -p user.err "Бэкап ОШИБКА!"\nfi' },
        { type: 'tip', value: 'logger — простой способ интегрировать ваши скрипты с системой логирования. Логи будут видны через journalctl -t myapp и в /var/log/syslog.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализ логов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проанализируйте системные логи и настройте ротацию.',
      requirements: [
        'Найдите все ошибки в системных логах за последние 24 часа',
        'Проанализируйте попытки SSH-входа из /var/log/auth.log',
        'Найдите сообщения OOM killer в dmesg (если есть)',
        'Создайте конфигурацию logrotate для приложения',
        'Отправьте тестовое сообщение в syslog с помощью logger',
        'Проверьте размер логов journald и настройте ограничение'
      ],
      hint: 'journalctl -p err --since "24 hours ago" для ошибок. grep "Failed password" /var/log/auth.log для SSH. dmesg -T | grep -i "oom" для OOM. journalctl --disk-usage для размера.',
      expectedOutput: 'Ошибки за 24 часа: journalctl -p err\nSSH атаки: 15 неудачных попыток с IP 10.0.0.5\ndmesg OOM: нет (или есть — показать)\nlogrotate: конфиг для /var/log/myapp/*.log создан\nlogger: "Test from practice" появился в syslog\njournald: 120 MB, ограничено до 500 MB',
      solution: '# 1. Ошибки за 24 часа\njournalctl -p err --since "24 hours ago" --no-pager\n\n# 2. SSH попытки\ngrep "Failed password" /var/log/auth.log 2>/dev/null | tail -20\ngrep "Failed password" /var/log/auth.log 2>/dev/null | awk \'{print $(NF-3)}\' | sort | uniq -c | sort -rn | head -10\n\n# 3. OOM killer\ndmesg -T | grep -i "oom\\|out of memory"\njournalctl -k | grep -i "oom\\|out of memory"\n\n# 4. Logrotate\nsudo tee /etc/logrotate.d/myapp << \'EOF\'\n/var/log/myapp/*.log {\n    daily\n    rotate 14\n    compress\n    delaycompress\n    missingok\n    notifempty\n    create 0644 root root\n    copytruncate\n}\nEOF\nsudo logrotate -d /etc/logrotate.d/myapp\n\n# 5. Logger\nlogger -t practice-test "Test message from practice"\njournalctl -t practice-test -n 5\n\n# 6. Journald размер\njournalctl --disk-usage\nsudo mkdir -p /etc/systemd/journald.conf.d\necho -e "[Journal]\\nSystemMaxUse=500M" | sudo tee /etc/systemd/journald.conf.d/size.conf\nsudo systemctl restart systemd-journald',
      explanation: 'journalctl -p err фильтрует по уровню ошибок. grep + awk + sort + uniq -c — классическая pipe-цепочка для анализа логов. dmesg показывает сообщения ядра. logrotate -d тестирует конфиг без выполнения. logger отправляет в syslog. SystemMaxUse ограничивает размер journald.'
    }
  ]
}
