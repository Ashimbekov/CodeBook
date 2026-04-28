export default {
  id: 23,
  title: 'Troubleshooting',
  description: 'Решение проблем: проблемы загрузки, переполнение диска, сетевые проблемы, OOM killer, общая методология.',
  lessons: [
    {
      id: 1,
      title: 'Методология troubleshooting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Системный подход к решению проблем: определить симптомы, собрать данные, сформулировать гипотезу, проверить, исправить, задокументировать. Не гадайте — проверяйте логи и метрики.' },
        { type: 'heading', value: 'Порядок действий' },
        { type: 'list', value: [
          '1. Определить симптомы: что именно не работает? когда началось?',
          '2. Собрать данные: логи, метрики, статус сервисов',
          '3. Проверить очевидное: диск полный? сервис запущен? сеть доступна?',
          '4. Сузить область: проблема в приложении, ОС, сети, или железе?',
          '5. Сформулировать и проверить гипотезу',
          '6. Исправить и проверить что работает',
          '7. Задокументировать причину и решение'
        ] },
        { type: 'code', language: 'bash', value: '# Быстрая диагностика сервера (первые 60 секунд):\n\n# 1. Нагрузка и uptime\nuptime\n\n# 2. Ошибки ядра\ndmesg -T | tail -20\n\n# 3. Системные логи\njournalctl -p err --since "1 hour ago" --no-pager\n\n# 4. Диск\ndf -h\n\n# 5. Память\nfree -h\n\n# 6. Процессы\nps aux --sort=-%cpu | head -10\nps aux --sort=-%mem | head -10\n\n# 7. Сеть\nss -tlnp\nping -c 2 8.8.8.8\n\n# 8. Проблемные сервисы\nsystemctl --failed' },
        { type: 'tip', value: 'Не паникуйте. Не перезагружайте без причины — это уничтожит улики. Первым делом соберите информацию: uptime, dmesg, journalctl, df, free, ps. Затем принимайте решения.' }
      ]
    },
    {
      id: 2,
      title: 'Проблемы с дисковым пространством',
      type: 'theory',
      content: [
        { type: 'text', value: 'Диск полный (100% used) — одна из самых частых проблем на серверах. Приводит к падению приложений, невозможности логирования и даже невозможности залогиниться.' },
        { type: 'code', language: 'bash', value: '# Диагностика: что заполнило диск?\ndf -h\n# /dev/sda1  50G  50G  0   100% /\n\n# Найти крупные каталоги:\ndu -sh /* 2>/dev/null | sort -rh | head -10\ndu -sh /var/* 2>/dev/null | sort -rh | head -10\ndu -sh /var/log/* 2>/dev/null | sort -rh | head -10\n\n# Найти крупные файлы:\nfind / -type f -size +100M -exec ls -lh {} \; 2>/dev/null | sort -k5 -rh | head -10\n\n# Типичные причины:\n# 1. Логи выросли (/var/log)\nsudo truncate -s 0 /var/log/large-log-file.log\nsudo logrotate -f /etc/logrotate.conf\n\n# 2. Кэш пакетов\nsudo apt clean\nsudo apt autoremove\n\n# 3. Старые ядра\nsudo apt autoremove --purge\n\n# 4. Docker (образы и контейнеры)\ndocker system prune -a\n\n# 5. Удалённые файлы, всё ещё открытые процессами:\nsudo lsof +L1\n# Эти файлы занимают место, но не видны в du/ls!\n# Решение: перезапустить процесс, который их держит\n\n# 6. Inode exhaustion (файлов слишком много):\ndf -i\n# Бывает при миллионах мелких файлов (кэш, сессии)' },
        { type: 'tip', value: 'lsof +L1 показывает удалённые файлы, которые всё ещё открыты процессами. Они занимают место, но невидимы для du и ls. Перезапустите процесс — место освободится.' }
      ]
    },
    {
      id: 3,
      title: 'Сетевые проблемы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сетевые проблемы — вторая по частоте причина обращений. Методика: проверить снизу вверх — линк, IP, маршруты, DNS, порты, firewall, приложение.' },
        { type: 'code', language: 'bash', value: '# 1. Есть ли линк (физическое подключение)?\nip link show eth0\n# state UP = линк есть, state DOWN = нет\n\n# 2. Есть ли IP-адрес?\nip addr show eth0\n\n# 3. Есть ли default route?\nip route show\n# default via 192.168.1.1 dev eth0\n\n# 4. Работает ли DNS?\nping -c 1 8.8.8.8        # по IP (без DNS)\nping -c 1 google.com     # по имени (с DNS)\n# Если IP пингуется, а имя нет — проблема DNS\ncat /etc/resolv.conf\ndig google.com\n\n# 5. Открыт ли порт на сервере?\nss -tlnp | grep 80\n# Если пусто — сервис не слушает порт\n\n# 6. Не блокирует ли firewall?\nsudo iptables -L -n | grep 80\nsudo ufw status\n\n# 7. Доступен ли порт извне?\ncurl -v http://server:80\nnc -zv server 80          # netcat проверка порта\n\n# 8. Trace route — где теряются пакеты?\ntracepath server\nmtr server                # интерактивный\n\n# 9. Потери пакетов:\nping -c 100 server | tail -3\n# 100 packets transmitted, 98 received, 2% packet loss\n\n# 10. TCPdump — анализ трафика:\nsudo tcpdump -i eth0 port 80 -n\nsudo tcpdump -i eth0 host 10.0.0.5 -w capture.pcap' },
        { type: 'note', value: 'Проверяйте снизу вверх: link -> IP -> route -> DNS -> port -> firewall -> app. Если ping по IP работает, а по имени нет — проблема в DNS. Если порт слушает, но извне недоступен — firewall.' }
      ]
    },
    {
      id: 4,
      title: 'OOM Killer и проблемы с памятью',
      type: 'theory',
      content: [
        { type: 'text', value: 'OOM (Out of Memory) Killer — механизм ядра, который убивает процессы при нехватке памяти. Выбирает процесс с наибольшим потреблением RAM. Появление OOM = недостаточно RAM или утечка памяти.' },
        { type: 'code', language: 'bash', value: '# Проверить OOM events:\ndmesg -T | grep -i "oom\\|out of memory"\njournalctl -k | grep -i "oom\\|killed process"\n\n# Типичное сообщение:\n# Out of memory: Killed process 1234 (java) total-vm:2048000kB,\n# anon-rss:1536000kB, file-rss:0kB, shmem-rss:0kB, oom_score_adj:0\n\n# Текущее потребление памяти:\nfree -h\nps aux --sort=-%mem | head -10\n\n# OOM score (чем выше — тем вероятнее будет убит):\ncat /proc/1234/oom_score\ncat /proc/1234/oom_score_adj\n\n# Защитить процесс от OOM killer:\necho -1000 | sudo tee /proc/1234/oom_score_adj\n# -1000 = не убивать этот процесс\n\n# Или в systemd:\n# [Service]\n# OOMScoreAdjust=-500\n\n# Решения проблемы OOM:\n# 1. Добавить RAM\n# 2. Увеличить swap:\nsudo fallocate -l 4G /swapfile\nsudo chmod 600 /swapfile\nsudo mkswap /swapfile\nsudo swapon /swapfile\necho "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab\n\n# 3. Ограничить память приложения (cgroups/systemd):\n# [Service]\n# MemoryMax=1G\n# MemorySwapMax=2G\n\n# 4. Настроить overcommit:\ncat /proc/sys/vm/overcommit_memory\n# 0 = эвристический (по умолчанию)\n# 1 = всегда разрешать (опасно)\n# 2 = строгий (не позволять overcommit)' },
        { type: 'tip', value: 'Если OOM убивает ваше приложение — добавьте swap (даже на SSD). Swap позволяет выжить при кратковременных пиках потребления. Без swap OOM killer срабатывает сразу.' }
      ]
    },
    {
      id: 5,
      title: 'Проблемы загрузки системы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проблемы загрузки — серьёзная ситуация. Могут быть вызваны: ошибкой в fstab, сломанным загрузчиком, ошибкой ядра, повреждением файловой системы.' },
        { type: 'code', language: 'bash', value: '# Порядок загрузки Linux:\n# 1. BIOS/UEFI -> 2. GRUB -> 3. Kernel -> 4. initramfs -> 5. systemd\n\n# Проблема: система не грузится\n# 1. Загрузиться в rescue mode:\n#    - В GRUB: нажать e, добавить "single" или "init=/bin/bash"\n#    - Или загрузиться с LiveUSB\n\n# 2. Ошибка в fstab (частая причина!):\n# Система зависает при монтировании несуществующего раздела\n# Решение:\n#   - Загрузиться в rescue mode\n#   - mount -o remount,rw /\n#   - vim /etc/fstab (исправить/закомментировать)\n#   - reboot\n\n# 3. Проверить логи предыдущей загрузки:\njournalctl -b -1             # предыдущая загрузка\njournalctl -b -1 -p err      # только ошибки\n\n# 4. GRUB восстановление:\nsudo grub-install /dev/sda\nsudo update-grub\n\n# 5. Проверка файловой системы:\nsudo fsck /dev/sda1          # НЕ на смонтированной ФС!\nsudo fsck -y /dev/sda1       # автоматически исправлять\n\n# 6. Проверить initramfs:\nsudo update-initramfs -u\n\n# 7. Emergency shell:\n# Если systemd показывает "Emergency mode"\n# Значит какой-то mount point из fstab не доступен\njournalctl -xb                # посмотреть причину\nmount -a                      # попробовать смонтировать\nvim /etc/fstab                # исправить проблему' },
        { type: 'note', value: 'Перед изменением fstab ВСЕГДА проверяйте mount -a в текущей сессии. Если mount -a выдаёт ошибку — НЕ перезагружайте. Исправьте fstab сначала, иначе система не загрузится.' }
      ]
    },
    {
      id: 6,
      title: 'Проблемы с производительностью',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервер медленно работает — нужно определить bottleneck: CPU, RAM, Disk I/O или сеть. Методика USE (Utilization, Saturation, Errors) для каждого ресурса.' },
        { type: 'code', language: 'bash', value: '# USE метод — для каждого ресурса проверить:\n# U (Utilization) — % использования\n# S (Saturation)  — очередь / ожидание\n# E (Errors)      — ошибки\n\n# CPU:\n# U: mpstat / top -> %usr + %sys\n# S: vmstat -> r (run queue) > nproc?\n# E: dmesg | grep -i "mce\\|hardware"\n\n# RAM:\n# U: free -h -> used / total\n# S: vmstat -> si/so (swap in/out) > 0?\n# E: dmesg | grep -i "oom\\|memory"\n\n# Disk:\n# U: iostat -x -> %util\n# S: iostat -x -> avgqu-sz (queue size)\n# E: dmesg | grep -i "error\\|ata"\n\n# Network:\n# U: ip -s link show -> TX/RX bytes\n# S: ss -s -> SYN-RECV, TIME-WAIT count\n# E: ip -s link show -> errors, dropped\n\n# Быстрый скрипт диагностики:\necho "=== CPU ===" && mpstat 1 1 2>/dev/null || uptime\necho "=== RAM ===" && free -h\necho "=== Disk ===" && iostat -x 1 1 2>/dev/null || df -h\necho "=== Net ===" && ss -s\necho "=== Errors ===" && dmesg -T | grep -i error | tail -5\necho "=== Failed ===" && systemctl --failed' },
        { type: 'tip', value: 'Методика USE (Brendan Gregg) — системный подход к анализу производительности. Для каждого ресурса (CPU, RAM, Disk, Net) проверьте три вещи: утилизацию, насыщение, ошибки.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Troubleshooting',
      type: 'practice',
      difficulty: 'hard',
      description: 'Выполните комплексную диагностику системы.',
      requirements: [
        'Проведите "первые 60 секунд" диагностики сервера',
        'Найдите топ-10 каталогов по размеру на диске',
        'Проверьте наличие OOM events в логах',
        'Проверьте все неудавшиеся сервисы systemd',
        'Проверьте сеть: link, IP, route, DNS, открытые порты',
        'Проверьте наличие удалённых но открытых файлов (lsof +L1)',
        'Напишите скрипт полной диагностики системы'
      ],
      hint: 'uptime, free -h, df -h, ps aux для быстрой диагностики. du -sh для размеров. dmesg | grep oom. systemctl --failed. ip addr, ip route, ss -tlnp.',
      expectedOutput: 'Uptime: 14 days, load: 0.5 (4 cores — OK)\nRAM: 16G total, 11G available — OK\nDisk: / 31% used — OK\nOOM: нет событий\nFailed services: 0\nNetwork: eth0 UP, default route OK, DNS OK\nlsof +L1: 0 deleted open files\nДиагностика: все системы в норме',
      solution: '#!/bin/bash\necho "=== ДИАГНОСТИКА СИСТЕМЫ ==="\necho\n\n# 1. Первые 60 секунд\necho "--- Load & Uptime ---"\nuptime\necho "CPU cores: $(nproc)"\n\necho "--- Memory ---"\nfree -h\n\necho "--- Disk ---"\ndf -h\n\necho "--- Top CPU ---"\nps aux --sort=-%cpu | head -6\n\necho "--- Top RAM ---"\nps aux --sort=-%mem | head -6\n\n# 2. Топ каталоги\necho "--- Largest directories ---"\nsudo du -sh /* 2>/dev/null | sort -rh | head -10\n\n# 3. OOM\necho "--- OOM Events ---"\ndmesg -T 2>/dev/null | grep -i "oom\\|out of memory" || echo "Нет OOM событий"\n\n# 4. Failed services\necho "--- Failed Services ---"\nsystemctl --failed --no-pager\n\n# 5. Network\necho "--- Network ---"\nip -4 addr show | grep inet\nip route show | head -3\nping -c 1 -W 2 8.8.8.8 &>/dev/null && echo "Internet: OK" || echo "Internet: FAIL"\ndig google.com +short 2>/dev/null | head -1\nss -tlnp 2>/dev/null | head -10\n\n# 6. Deleted open files\necho "--- Deleted Open Files ---"\nsudo lsof +L1 2>/dev/null | head -5 || echo "Нет"\n\necho "=== ДИАГНОСТИКА ЗАВЕРШЕНА ==="',
      explanation: 'Скрипт проверяет все основные подсистемы: CPU (uptime, nproc), RAM (free), Disk (df, du), процессы (ps), OOM (dmesg), сервисы (systemctl --failed), сеть (ip, ping, dig, ss), удалённые файлы (lsof +L1). Это baseline для любого troubleshooting.'
    }
  ]
}
