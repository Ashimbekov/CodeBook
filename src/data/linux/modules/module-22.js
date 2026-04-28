export default {
  id: 22,
  title: 'Резервное копирование',
  description: 'Стратегии бэкапов: rsync, tar, borgbackup. Snapshot стратегии, ротация, верификация.',
  lessons: [
    {
      id: 1,
      title: 'Стратегии резервного копирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Бэкап — критически важная задача. Правило 3-2-1: 3 копии данных, на 2 разных носителях, 1 копия off-site. Типы: полный, инкрементальный, дифференциальный.' },
        { type: 'heading', value: 'Типы бэкапов' },
        { type: 'list', value: [
          'Полный (full) — копия всех данных. Надёжный, но медленный и занимает много места.',
          'Инкрементальный (incremental) — только изменения с последнего бэкапа. Быстрый, компактный. Для восстановления нужна вся цепочка.',
          'Дифференциальный (differential) — изменения с последнего полного бэкапа. Компромисс между полным и инкрементальным.',
          'Snapshot — мгновенная копия на уровне ФС/LVM. Консистентная, без остановки сервисов.'
        ] },
        { type: 'code', language: 'bash', value: '# Типичная стратегия:\n# - Полный бэкап: раз в неделю (воскресенье)\n# - Инкрементальный: каждый день\n# - Ротация: хранить 4 недели\n# - Off-site: копия на удалённый сервер / S3\n\n# Что бэкапить:\n# /etc/         — конфигурации\n# /home/        — данные пользователей\n# /var/www/     — веб-сайты\n# /var/lib/     — данные БД (лучше pg_dump/mysqldump)\n# /opt/         — приложения\n# /root/        — конфиги root\n\n# Что НЕ бэкапить:\n# /tmp/         — временные файлы\n# /proc/ /sys/  — виртуальные ФС\n# /dev/         — устройства\n# /var/cache/   — кэш (можно пересоздать)' },
        { type: 'tip', value: 'Бэкап, который не проверен — не бэкап. Регулярно тестируйте восстановление! Запланируйте "disaster recovery drill" — восстановление на тестовом сервере раз в месяц.' }
      ]
    },
    {
      id: 2,
      title: 'rsync — синхронизация и бэкап',
      type: 'theory',
      content: [
        { type: 'text', value: 'rsync — мощный инструмент инкрементальной синхронизации. Передаёт только изменившиеся части файлов. Идеален для бэкапов на удалённый сервер.' },
        { type: 'code', language: 'bash', value: '# Локальный бэкап:\nrsync -avz /var/www/ /backup/www/\n# -a archive (рекурсивно, права, время, ссылки)\n# -v verbose\n# -z сжатие\n\n# На удалённый сервер:\nrsync -avz -e "ssh -p 2222" /var/www/ user@backup-server:/backup/www/\n\n# С удалением лишних файлов на dest:\nrsync -avz --delete /var/www/ /backup/www/\n\n# С исключениями:\nrsync -avz --exclude=".git" --exclude="node_modules" \\\n    --exclude="*.log" --exclude=".cache" \\\n    /opt/app/ /backup/app/\n\n# Инкрементальный бэкап с hardlinks (экономит место!):\nDATE=$(date +%Y-%m-%d)\nrsync -avz --link-dest=/backup/latest/ \\\n    /var/www/ /backup/$DATE/\nln -sfn /backup/$DATE /backup/latest\n\n# --link-dest создаёт hardlinks на неизменённые файлы\n# Каждый бэкап выглядит как полный, но занимает место\n# только для изменённых файлов!\n\n# Dry-run:\nrsync -avzn /var/www/ /backup/www/\n# -n (--dry-run) — показать что будет сделано' },
        { type: 'tip', value: 'rsync --link-dest — элегантное решение для ежедневных бэкапов. Каждый бэкап — полная копия (удобно восстанавливать), но занимает место только для изменений.' }
      ]
    },
    {
      id: 3,
      title: 'tar — архивные бэкапы',
      type: 'theory',
      content: [
        { type: 'text', value: 'tar создаёт архивные бэкапы — один файл со всеми данными. Поддерживает инкрементальные бэкапы через snapshot-файл. Хорошо сжимается.' },
        { type: 'code', language: 'bash', value: '# Полный бэкап:\ntar -czvf /backup/full-$(date +%Y%m%d).tar.gz \\\n    --exclude="/var/cache" \\\n    --exclude="*.tmp" \\\n    /etc /home /var/www /opt\n\n# Инкрементальный бэкап (tar --listed-incremental):\n# Полный бэкап (создаёт snapshot файл):\ntar -czvf /backup/full.tar.gz \\\n    --listed-incremental=/backup/snapshot.snar \\\n    /var/www\n\n# Инкрементальный (использует snapshot):\ntar -czvf /backup/inc-$(date +%Y%m%d).tar.gz \\\n    --listed-incremental=/backup/snapshot.snar \\\n    /var/www\n# Будет содержать только изменённые файлы!\n\n# Восстановление:\n# 1. Сначала полный:\ntar -xzvf /backup/full.tar.gz -C /restore/\n# 2. Затем все инкрементальные по порядку:\ntar -xzvf /backup/inc-20260315.tar.gz -C /restore/\ntar -xzvf /backup/inc-20260316.tar.gz -C /restore/\n\n# Просмотр содержимого:\ntar -tzvf /backup/full.tar.gz | head -20\n\n# Размер архива:\nls -lh /backup/full.tar.gz' },
        { type: 'note', value: 'tar --listed-incremental хранит метаданные в snapshot-файле (.snar). При потере этого файла следующий бэкап будет полным. Храните .snar вместе с бэкапами!' }
      ]
    },
    {
      id: 4,
      title: 'borgbackup — дедупликация и шифрование',
      type: 'theory',
      content: [
        { type: 'text', value: 'borgbackup — современный инструмент бэкапов с дедупликацией, сжатием и шифрованием. Работает на уровне блоков — одинаковые данные хранятся один раз. Идеален для больших объёмов.' },
        { type: 'code', language: 'bash', value: '# Установка:\nsudo apt install borgbackup\n\n# 1. Инициализация репозитория:\nborg init --encryption=repokey /backup/borg-repo\n# repokey — ключ шифрования хранится в репозитории\n\n# Удалённый репозиторий:\nborg init --encryption=repokey ssh://user@backup-server/backup/borg-repo\n\n# 2. Создать бэкап:\nborg create --stats --progress \\\n    /backup/borg-repo::server-{now:%Y-%m-%d} \\\n    /etc /home /var/www /opt \\\n    --exclude "/home/*/.cache" \\\n    --exclude "*.tmp"\n\n# 3. Список бэкапов:\nborg list /backup/borg-repo\n# server-2026-03-15   Mon, 2026-03-15 03:00:00\n# server-2026-03-16   Tue, 2026-03-16 03:00:00\n\n# 4. Просмотр содержимого:\nborg list /backup/borg-repo::server-2026-03-15\n\n# 5. Восстановление:\ncd /restore\nborg extract /backup/borg-repo::server-2026-03-15\n# Или конкретный файл:\nborg extract /backup/borg-repo::server-2026-03-15 etc/nginx/nginx.conf\n\n# 6. Ротация (удалить старые бэкапы):\nborg prune --keep-daily=7 --keep-weekly=4 --keep-monthly=6 /backup/borg-repo\n\n# 7. Проверка целостности:\nborg check /backup/borg-repo' },
        { type: 'tip', value: 'borgbackup с дедупликацией экономит 50-90% места по сравнению с tar. Если 10 серверов бэкапят одинаковые файлы ОС — они хранятся один раз. Шифрование включено по умолчанию.' }
      ]
    },
    {
      id: 5,
      title: 'Автоматизация бэкапов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Бэкап должен быть автоматическим, с логированием, оповещениями об ошибках и регулярной проверкой. Ручной бэкап — это отсутствие бэкапа.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# /usr/local/bin/backup-system.sh\nset -euo pipefail\n\nBACKUP_REPO="/backup/borg-repo"\nLOG="/var/log/backup.log"\nDATE=$(date +%Y-%m-%d)\n\nlog() { echo "[$(date +%Y-%m-%dT%H:%M:%S)] $1" | tee -a "$LOG"; }\n\ntrap \'log "ОШИБКА: Бэкап завершился с ошибкой (строка $LINENO)"\' ERR\n\nlog "=== Начало бэкапа ===" \n\n# 1. Бэкап баз данных\nlog "Бэкап PostgreSQL..."\nsudo -u postgres pg_dumpall | gzip > /tmp/pg_dump_$DATE.sql.gz\n\n# 2. Бэкап файлов через borg\nlog "Бэкап файлов через borg..."\nborg create --stats --compression lz4 \\\n    "$BACKUP_REPO"::$DATE \\\n    /etc /home /var/www /opt /tmp/pg_dump_$DATE.sql.gz \\\n    --exclude "/home/*/.cache" \\\n    --exclude "*.tmp" \\\n    --exclude "node_modules" \\\n    2>> "$LOG"\n\n# 3. Ротация\nlog "Ротация бэкапов..."\nborg prune --keep-daily=7 --keep-weekly=4 --keep-monthly=6 \\\n    "$BACKUP_REPO" 2>> "$LOG"\n\n# 4. Очистка\nrm -f /tmp/pg_dump_$DATE.sql.gz\n\n# 5. Проверка\nlog "Проверка целостности..."\nborg check "$BACKUP_REPO" 2>> "$LOG"\n\nlog "=== Бэкап завершён успешно ==="' },
        { type: 'code', language: 'bash', value: '# Автоматизация через systemd timer:\nsudo tee /etc/systemd/system/backup.service << \'EOF\'\n[Unit]\nDescription=System backup\nAfter=network.target\n\n[Service]\nType=oneshot\nExecStart=/usr/local/bin/backup-system.sh\nUser=root\nEOF\n\nsudo tee /etc/systemd/system/backup.timer << \'EOF\'\n[Unit]\nDescription=Daily backup at 3 AM\n\n[Timer]\nOnCalendar=*-*-* 03:00:00\nPersistent=true\nRandomizedDelaySec=1800\n\n[Install]\nWantedBy=timers.target\nEOF\n\nsudo systemctl daemon-reload\nsudo systemctl enable --now backup.timer' },
        { type: 'tip', value: 'Persistent=true гарантирует что пропущенный бэкап будет выполнен после загрузки. RandomizedDelaySec предотвращает одновременный запуск на всех серверах. trap ERR логирует ошибки.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка бэкапов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте систему резервного копирования для сервера.',
      requirements: [
        'Создайте tar.gz бэкап каталогов /etc и /home',
        'Настройте rsync для синхронизации /var/www в /backup/www',
        'Напишите скрипт бэкапа с логированием и ротацией (30 дней)',
        'Добавьте скрипт в cron для ежедневного запуска в 3:00',
        'Проверьте восстановление: распакуйте архив во временный каталог',
        'Выведите список всех запланированных бэкап-задач'
      ],
      hint: 'tar -czvf для архива. rsync -avz для синхронизации. find -mtime +30 -delete для ротации. crontab -e для cron. tar -xzvf -C /tmp/restore для восстановления.',
      expectedOutput: 'tar: backup-20260315.tar.gz (5.2 MB)\nrsync: /var/www синхронизирован в /backup/www\nСкрипт: /usr/local/bin/backup.sh создан\ncron: 0 3 * * * /usr/local/bin/backup.sh\nВосстановление: файлы из /etc и /home в /tmp/restore\ncrontab -l: бэкап-задача в списке',
      solution: '# 1. tar бэкап\nsudo tar -czvf /tmp/backup-$(date +%Y%m%d).tar.gz /etc /home 2>/dev/null\nls -lh /tmp/backup-*.tar.gz\n\n# 2. rsync\nsudo mkdir -p /backup/www\nsudo rsync -avz /var/www/ /backup/www/\n\n# 3. Скрипт бэкапа\nsudo tee /usr/local/bin/backup.sh << \'SCRIPT\'\n#!/bin/bash\nset -euo pipefail\nBACKUP_DIR="/backup"\nDATE=$(date +%Y%m%d)\nLOG="$BACKUP_DIR/backup.log"\n\nmkdir -p "$BACKUP_DIR"\necho "[$(date)] Начало бэкапа" >> "$LOG"\n\ntar -czvf "$BACKUP_DIR/system-$DATE.tar.gz" /etc /home 2>/dev/null\nrsync -avz /var/www/ "$BACKUP_DIR/www/" 2>/dev/null\n\nfind "$BACKUP_DIR" -name "system-*.tar.gz" -mtime +30 -delete\n\necho "[$(date)] Бэкап завершён: system-$DATE.tar.gz" >> "$LOG"\nSCRIPT\nsudo chmod +x /usr/local/bin/backup.sh\n\n# 4. Cron\necho "0 3 * * * /usr/local/bin/backup.sh" | sudo crontab -\nsudo crontab -l\n\n# 5. Восстановление\nmkdir -p /tmp/restore\ntar -xzvf /tmp/backup-$(date +%Y%m%d).tar.gz -C /tmp/restore/\nls -la /tmp/restore/etc/ | head\n\n# 6. Список задач\ncrontab -l\nsystemctl list-timers',
      explanation: 'tar -czvf создаёт сжатый архив. rsync -avz синхронизирует с сохранением атрибутов. find -mtime +30 -delete удаляет файлы старше 30 дней. Cron запускает скрипт ежедневно в 3:00. tar -xzvf -C распаковывает в указанный каталог.'
    }
  ]
}
