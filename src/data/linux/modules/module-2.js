export default {
  id: 2,
  title: 'Файловая система',
  description: 'Иерархия файловой системы Linux (FHS), навигация по каталогам, типы файлов, понимание структуры /etc, /var, /home и других важных каталогов.',
  lessons: [
    {
      id: 1,
      title: 'Иерархия файловой системы (FHS)',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Linux всё начинается с корневого каталога / (root). Файловая система имеет древовидную структуру, стандартизированную в FHS (Filesystem Hierarchy Standard). В отличие от Windows, нет дисков C:, D: — всё монтируется в единое дерево.' },
        { type: 'heading', value: 'Основные каталоги' },
        { type: 'code', language: 'text', value: '/                  — корневой каталог (root)\n├── /bin           — основные команды (ls, cp, mv, cat)\n├── /sbin          — системные команды (fdisk, iptables, reboot)\n├── /etc           — конфигурационные файлы системы\n├── /home          — домашние каталоги пользователей\n│   └── /home/user — домашний каталог пользователя user\n├── /root          — домашний каталог суперпользователя root\n├── /var           — изменяемые данные (логи, почта, БД)\n│   ├── /var/log   — логи системы и приложений\n│   ├── /var/www   — веб-сайты\n│   └── /var/lib   — данные приложений (БД, Docker)\n├── /tmp           — временные файлы (очищается при перезагрузке)\n├── /usr           — пользовательские программы\n│   ├── /usr/bin   — команды пользователя\n│   ├── /usr/lib   — библиотеки\n│   └── /usr/share — общие данные (документация, шрифты)\n├── /opt           — дополнительное ПО (ставится вручную)\n├── /dev           — файлы устройств (диски, терминалы)\n├── /proc          — виртуальная ФС процессов и ядра\n├── /sys           — виртуальная ФС устройств ядра\n├── /boot          — файлы загрузчика и ядра\n├── /lib           — системные библиотеки\n├── /mnt           — точка монтирования (временные)\n└── /media         — автомонтирование USB, CD-ROM' },
        { type: 'tip', value: 'Запомните: /etc — настройки, /var/log — логи, /home — пользовательские файлы, /tmp — временные файлы. Этих четырёх каталогов достаточно для 80% повседневной работы администратора.' }
      ]
    },
    {
      id: 2,
      title: 'Навигация по файловой системе',
      type: 'theory',
      content: [
        { type: 'text', value: 'Навигация по файловой системе — фундаментальный навык. Важно понимать разницу между абсолютными и относительными путями, а также специальные обозначения каталогов.' },
        { type: 'heading', value: 'Пути и навигация' },
        { type: 'code', language: 'bash', value: '# Абсолютный путь — начинается от корня /\ncd /var/log/nginx\npwd\n# /var/log/nginx\n\n# Относительный путь — от текущего каталога\ncd ..              # на уровень вверх\ncd ../..           # на два уровня вверх\ncd ./scripts       # в подкаталог scripts текущего каталога\n\n# Специальные обозначения:\n# .    — текущий каталог\n# ..   — родительский каталог\n# ~    — домашний каталог текущего пользователя\n# ~bob — домашний каталог пользователя bob\n# -    — предыдущий каталог\n\ncd ~               # в домашний каталог\ncd ~bob            # в домашний каталог пользователя bob\ncd -               # вернуться в предыдущий каталог' },
        { type: 'heading', value: 'Команда ls — подробный вывод' },
        { type: 'code', language: 'bash', value: 'ls -la /etc\n# Вывод:\n# drwxr-xr-x 130 root root 12288 Mar 15 10:00 .\n# drwxr-xr-x  20 root root  4096 Mar 10 08:00 ..\n# -rw-r--r--   1 root root  3028 Feb 10 12:30 adduser.conf\n# drwxr-xr-x   3 root root  4096 Jan 15 09:00 apache2\n# lrwxrwxrwx   1 root root    27 Jan 10 08:00 resolv.conf -> ../run/...\n\n# Разбор строки: drwxr-xr-x 130 root root 12288 Mar 15 10:00 .\n# d         — тип файла (d=каталог, -=файл, l=ссылка)\n# rwxr-xr-x — права доступа (owner/group/others)\n# 130       — количество жёстких ссылок\n# root      — владелец\n# root      — группа\n# 12288     — размер в байтах\n# Mar 15    — дата модификации\n# .         — имя файла\n\n# Полезные опции ls:\nls -lh     # размеры в человекочитаемом формате (1K, 5M, 2G)\nls -lt     # сортировка по времени модификации\nls -lS     # сортировка по размеру\nls -lR     # рекурсивно (все подкаталоги)\nls -ld /etc  # информация о самом каталоге, а не его содержимом' },
        { type: 'note', value: 'Файлы начинающиеся с точки (.bashrc, .ssh) — скрытые. Они не видны при обычном ls, нужен флаг -a. В домашнем каталоге много скрытых файлов конфигурации.' }
      ]
    },
    {
      id: 3,
      title: 'Типы файлов в Linux',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Linux "всё является файлом" — это один из ключевых принципов. Помимо обычных файлов и каталогов существуют специальные типы файлов: символические ссылки, файлы устройств, сокеты и каналы.' },
        { type: 'heading', value: 'Семь типов файлов' },
        { type: 'code', language: 'bash', value: '# Типы файлов (первый символ в ls -l):\n# -  обычный файл (regular file)\n# d  каталог (directory)\n# l  символическая ссылка (symbolic link)\n# b  блочное устройство (block device) — диски\n# c  символьное устройство (character device) — терминалы\n# p  именованный канал (named pipe / FIFO)\n# s  сокет (socket)\n\n# Примеры:\nls -la /dev/sda        # b — блочное устройство (диск)\n# brw-rw---- 1 root disk 8, 0 Mar 15 /dev/sda\n\nls -la /dev/tty0       # c — символьное устройство\n# crw--w---- 1 root tty 4, 0 Mar 15 /dev/tty0\n\nls -la /dev/log        # s — сокет\n# srw-rw-rw- 1 root root 0 Mar 15 /dev/log\n\n# Определить тип файла:\nfile /bin/ls\n# /bin/ls: ELF 64-bit LSB pie executable, x86-64\n\nfile /etc/hosts\n# /etc/hosts: ASCII text\n\nfile /dev/sda\n# /dev/sda: block special (8/0)\n\nstat /etc/hostname\n# File: /etc/hostname\n# Size: 10        Blocks: 8  IO Block: 4096  regular file\n# Inode: 262147    Links: 1' },
        { type: 'heading', value: 'Виртуальные файловые системы' },
        { type: 'code', language: 'bash', value: '# /proc — информация о процессах и ядре\ncat /proc/cpuinfo      # информация о процессоре\ncat /proc/meminfo      # информация о памяти\ncat /proc/version      # версия ядра\nls /proc/1/            # информация о процессе PID 1 (init)\n\n# /sys — информация об устройствах\ncat /sys/class/net/eth0/address   # MAC-адрес сетевой карты\ncat /sys/block/sda/size           # размер диска в блоках\n\n# /dev — файлы устройств\nls /dev/sd*            # SCSI/SATA диски\nls /dev/nvme*          # NVMe диски\n# /dev/null   — чёрная дыра (отбрасывает всё)\n# /dev/zero   — генерирует нули\n# /dev/random — генерирует случайные данные' },
        { type: 'tip', value: '/dev/null — полезнейший файл. Перенаправьте туда вывод, который не нужен: command 2>/dev/null подавит ошибки. /dev/zero используется для создания файлов заданного размера: dd if=/dev/zero of=file bs=1M count=100.' }
      ]
    },
    {
      id: 4,
      title: 'Важные каталоги: /etc, /var, /proc',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каталоги /etc, /var и /proc — самые важные для системного администратора. В /etc хранятся все конфигурации, в /var — логи и данные, в /proc — информация о работающей системе.' },
        { type: 'heading', value: '/etc — конфигурация системы' },
        { type: 'code', language: 'bash', value: '# Ключевые файлы в /etc:\ncat /etc/hostname        # имя машины\ncat /etc/hosts           # локальная таблица DNS\ncat /etc/resolv.conf     # DNS серверы\ncat /etc/fstab           # автомонтирование дисков\ncat /etc/passwd          # список пользователей\ncat /etc/group           # список групп\ncat /etc/shadow          # хеши паролей (только root)\ncat /etc/crontab         # системный планировщик\ncat /etc/ssh/sshd_config # конфигурация SSH сервера\nls /etc/nginx/           # конфигурация Nginx\nls /etc/systemd/system/  # пользовательские сервисы' },
        { type: 'heading', value: '/var — переменные данные' },
        { type: 'code', language: 'bash', value: '# Важные подкаталоги /var:\nls /var/log/             # логи системы\n# syslog, auth.log, kern.log, nginx/access.log\n\nls /var/lib/             # данные приложений\n# docker/, postgresql/, mysql/, dpkg/\n\nls /var/www/             # веб-сайты (Nginx, Apache)\nls /var/mail/            # почтовые ящики пользователей\nls /var/spool/           # очереди (печать, cron)\nls /var/cache/           # кэш приложений\n# apt/archives/ — скачанные .deb пакеты\n\n# Проверить размер каталога:\ndu -sh /var/log\n# 245M /var/log\n\ndu -sh /var/*\n# 12K    /var/backups\n# 1.2G   /var/cache\n# 3.5G   /var/lib\n# 245M   /var/log' },
        { type: 'heading', value: '/proc — информация о системе в реальном времени' },
        { type: 'code', language: 'bash', value: '# /proc — виртуальная ФС, генерируется ядром на лету\ncat /proc/cpuinfo | head -20   # CPU информация\ncat /proc/meminfo | head -5    # RAM информация\n# MemTotal:       16384000 kB\n# MemFree:         8192000 kB\n# MemAvailable:   12288000 kB\n\ncat /proc/loadavg              # средняя нагрузка\n# 0.52 0.38 0.25 1/245 12345\n\ncat /proc/uptime               # время работы (секунды)\n# 1234567.89 2345678.90\n\nuptime                         # человекочитаемый формат\n# 10:30:00 up 14 days, 5:43, 2 users, load average: 0.52, 0.38, 0.25' },
        { type: 'note', value: '/proc и /sys — виртуальные файловые системы. Они не занимают место на диске. Информация генерируется ядром при чтении файла. Это мощный механизм для получения данных о системе.' }
      ]
    },
    {
      id: 5,
      title: 'Перенаправление ввода/вывода и pipe',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый процесс в Linux имеет три стандартных потока: stdin (ввод, fd=0), stdout (вывод, fd=1), stderr (ошибки, fd=2). Перенаправление позволяет отправлять эти потоки в файлы, а pipe (|) — соединять команды в цепочку.' },
        { type: 'heading', value: 'Перенаправление в файлы' },
        { type: 'code', language: 'bash', value: '# stdout в файл (перезаписать)\nls /etc > listing.txt\n\n# stdout в файл (дописать)\necho "новая строка" >> listing.txt\n\n# stderr в файл\nls /nonexistent 2> errors.txt\n\n# stdout и stderr в разные файлы\ncommand > output.txt 2> errors.txt\n\n# stdout и stderr в один файл\ncommand > all.txt 2>&1\n# или современный синтаксис:\ncommand &> all.txt\n\n# Подавить вывод ошибок\ncommand 2>/dev/null\n\n# Подавить весь вывод\ncommand &>/dev/null\n\n# stdin из файла\nwc -l < /etc/passwd\n# 35' },
        { type: 'heading', value: 'Pipe — конвейер команд' },
        { type: 'code', language: 'bash', value: '# Pipe (|) — передаёт stdout одной команды на stdin другой\nls -la /etc | head -20        # первые 20 строк\nls -la /etc | tail -10        # последние 10 строк\ncat /etc/passwd | wc -l       # количество строк\nps aux | grep nginx           # найти процессы nginx\nhistory | grep ssh            # поиск в истории\n\n# Цепочка из нескольких команд:\ncat /var/log/syslog | grep error | sort | uniq -c | sort -rn | head -10\n# Найти ошибки -> отсортировать -> убрать дубли (с подсчётом)\n# -> по убыванию -> первые 10\n\n# tee — вывести и в файл, и на экран\nls -la /etc | tee listing.txt\n# Выведет на экран И запишет в файл\n\n# xargs — передать stdin как аргументы\nfind /tmp -name "*.log" | xargs rm\n# Найти файлы .log и удалить их' },
        { type: 'tip', value: 'Pipe — одна из самых мощных концепций Linux. Комбинируя простые команды через pipe, можно решать сложные задачи без написания программ. Помните философию Unix: маленькие программы, работающие вместе.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Исследование файловой системы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Исследуйте файловую систему Linux и научитесь работать с перенаправлением.',
      requirements: [
        'Выведите дерево каталогов / на один уровень глубины',
        'Найдите размер каталога /var/log и его самый большой файл',
        'Используя /proc, узнайте количество ядер CPU и объём RAM',
        'Перенаправьте список файлов /etc в файл ~/etc-listing.txt',
        'Через pipe посчитайте количество пользователей в системе (/etc/passwd)',
        'Найдите все конфигурационные файлы в /etc, содержащие слово "root"'
      ],
      hint: 'ls -1 / покажет корневые каталоги. du -sh и ls -lS помогут с размерами. grep -r "root" /etc ищет рекурсивно, но лучше с 2>/dev/null для подавления ошибок доступа.',
      expectedOutput: 'ls /: bin boot dev etc home lib media mnt opt proc root run sbin srv sys tmp usr var\ndu -sh /var/log: 245M\ngrep "processor" /proc/cpuinfo | wc -l: 4 (ядра)\nwc -l /etc/passwd: 35 пользователей\ngrep -rl "root" /etc: список файлов содержащих "root"',
      solution: '# 1. Дерево каталогов корня\nls -1 /\n# или если установлен tree:\ntree -L 1 /\n\n# 2. Размер /var/log и самый большой файл\ndu -sh /var/log\nls -lhS /var/log | head -5\n\n# 3. CPU и RAM из /proc\ngrep "processor" /proc/cpuinfo | wc -l   # количество ядер\ngrep "model name" /proc/cpuinfo | head -1 # модель CPU\ngrep "MemTotal" /proc/meminfo             # объём RAM\nfree -h                                    # или так\n\n# 4. Перенаправление в файл\nls -la /etc > ~/etc-listing.txt\nwc -l ~/etc-listing.txt\n\n# 5. Количество пользователей\nwc -l /etc/passwd\n# или только реальных пользователей (UID >= 1000):\nawk -F: \'$3 >= 1000\' /etc/passwd | wc -l\n\n# 6. Файлы содержащие "root"\ngrep -rl "root" /etc 2>/dev/null | head -20',
      explanation: 'du -sh показывает общий размер каталога в человекочитаемом формате. /proc/cpuinfo и /proc/meminfo — виртуальные файлы с информацией о системе. grep -r ищет рекурсивно, -l показывает только имена файлов. 2>/dev/null подавляет ошибки доступа.'
    }
  ]
}
