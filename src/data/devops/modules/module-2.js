export default {
  id: 2,
  title: 'Linux: основы',
  description: 'Файловая система Linux, основные команды, навигация, управление файлами, права доступа и пользователи.',
  lessons: [
    {
      id: 1,
      title: 'Файловая система Linux',
      type: 'theory',
      content: [
        { type: 'text', value: 'Linux использует иерархическую файловую систему с единым корнем /. Всё в Linux — это файл: обычные файлы, директории, устройства, сокеты. Понимание структуры каталогов критично для DevOps-инженера.' },
        { type: 'heading', value: 'Основные каталоги' },
        { type: 'code', language: 'bash', value: '# Структура файловой системы Linux:\n/           # Корень файловой системы\n├── bin     # Основные команды (ls, cp, mv, cat)\n├── sbin    # Системные команды (iptables, fdisk)\n├── etc     # Конфигурационные файлы\n│   ├── nginx/nginx.conf\n│   ├── ssh/sshd_config\n│   └── hosts\n├── home    # Домашние каталоги пользователей\n│   └── devops/\n├── var     # Переменные данные\n│   ├── log/    # Логи\n│   ├── www/    # Веб-файлы\n│   └── lib/    # Данные приложений (БД)\n├── tmp     # Временные файлы (очищается при перезагрузке)\n├── usr     # Пользовательские программы\n│   ├── bin/    # Дополнительные команды\n│   ├── lib/    # Библиотеки\n│   └── local/  # Локально установленные программы\n├── opt     # Опциональное ПО (Docker, GitLab)\n├── proc    # Виртуальная ФС — информация о процессах\n├── sys     # Виртуальная ФС — информация об оборудовании\n└── dev     # Файлы устройств\n    ├── sda     # Первый жёсткий диск\n    ├── null    # Чёрная дыра\n    └── zero    # Бесконечные нули' },
        { type: 'tip', value: 'Для DevOps важнее всего: /etc (конфигурации), /var/log (логи), /home (скрипты и ключи), /tmp (временные файлы). Запомни: конфиги в /etc, логи в /var/log.' }
      ]
    },
    {
      id: 2,
      title: 'Навигация и основные команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Командная строка — основной инструмент DevOps-инженера. Большинство серверов не имеют графического интерфейса, поэтому нужно уверенно работать в терминале.' },
        { type: 'heading', value: 'Навигация' },
        { type: 'code', language: 'bash', value: '# Текущий каталог\npwd\n# /home/devops\n\n# Перейти в каталог\ncd /var/log\ncd ~           # Домашний каталог\ncd -           # Предыдущий каталог\ncd ..          # На уровень вверх\n\n# Список файлов\nls             # Базовый список\nls -la         # Подробный список с скрытыми файлами\nls -lh         # Человекочитаемый размер файлов\nls -lt         # Сортировка по времени изменения\nls -lS         # Сортировка по размеру\n\n# Пример вывода ls -la:\n# drwxr-xr-x  5 devops devops 4096 Mar 21 10:00 .\n# drwxr-xr-x  3 root   root   4096 Mar 20 08:00 ..\n# -rw-r--r--  1 devops devops  220 Mar 20 08:00 .bashrc\n# -rw-------  1 devops devops 1234 Mar 21 09:55 .bash_history\n# drwx------  2 devops devops 4096 Mar 20 08:01 .ssh' },
        { type: 'heading', value: 'Работа с файлами и каталогами' },
        { type: 'code', language: 'bash', value: '# Создание\nmkdir projects                    # Создать каталог\nmkdir -p a/b/c                    # Создать вложенные каталоги\ntouch file.txt                    # Создать пустой файл\n\n# Копирование\ncp file.txt backup.txt            # Копировать файл\ncp -r dir1/ dir2/                 # Копировать каталог рекурсивно\n\n# Перемещение / переименование\nmv old.txt new.txt                # Переименовать\nmv file.txt /tmp/                 # Переместить\n\n# Удаление\nrm file.txt                       # Удалить файл\nrm -r directory/                  # Удалить каталог рекурсивно\nrm -rf directory/                 # Удалить без подтверждения\n\n# Просмотр содержимого\ncat file.txt                      # Весь файл\nless file.txt                     # Постранично (q для выхода)\nhead -20 file.txt                 # Первые 20 строк\ntail -20 file.txt                 # Последние 20 строк\ntail -f /var/log/syslog           # Следить за файлом в реальном времени' },
        { type: 'warning', value: 'Команда rm -rf / удалит ВСЮ файловую систему. Никогда не запускай rm -rf с подстановкой переменных без проверки: rm -rf $DIR/ — если $DIR пуст, выполнится rm -rf /. Всегда проверяй переменные: [[ -n "$DIR" ]] && rm -rf "$DIR"' }
      ]
    },
    {
      id: 3,
      title: 'Поиск, фильтрация и перенаправление',
      type: 'theory',
      content: [
        { type: 'text', value: 'Поиск файлов и фильтрация текста — ежедневные задачи DevOps. Важнейшие инструменты: find, grep, pipes (|) и перенаправление потоков (>, >>).' },
        { type: 'heading', value: 'Поиск файлов' },
        { type: 'code', language: 'bash', value: '# find — поиск файлов\nfind / -name "nginx.conf"                   # По имени\nfind /var/log -name "*.log" -mtime -1        # Логи изменённые за последний день\nfind /home -type f -size +100M               # Файлы больше 100MB\nfind /tmp -type f -mtime +7 -delete          # Удалить файлы старше 7 дней\n\n# which / whereis — путь к исполняемому файлу\nwhich docker\n# /usr/bin/docker\nwhereis nginx\n# nginx: /usr/sbin/nginx /etc/nginx /usr/share/nginx' },
        { type: 'heading', value: 'Фильтрация текста: grep' },
        { type: 'code', language: 'bash', value: '# grep — поиск текста в файлах\ngrep "error" /var/log/syslog                # Найти строки с "error"\ngrep -i "error" /var/log/syslog             # Без учёта регистра\ngrep -r "password" /etc/                    # Рекурсивный поиск\ngrep -c "404" access.log                    # Количество совпадений\ngrep -v "debug" app.log                     # Исключить строки с "debug"\ngrep -E "error|warning|critical" app.log    # Регулярное выражение (OR)\n\n# Примеры из практики DevOps:\ngrep "Failed password" /var/log/auth.log    # Неудачные входы\ngrep "OOM" /var/log/kern.log                # Out of Memory ошибки\ndocker logs myapp 2>&1 | grep "ERROR"       # Ошибки в логах Docker' },
        { type: 'heading', value: 'Перенаправление и пайпы' },
        { type: 'code', language: 'bash', value: '# Перенаправление потоков\necho "hello" > file.txt          # Записать (перезаписать)\necho "world" >> file.txt         # Дописать\ncommand 2> errors.log            # Перенаправить stderr\ncommand > output.log 2>&1        # stdout + stderr в файл\ncommand &> all.log               # То же самое (bash)\n\n# Пайпы (|) — вывод одной команды -> ввод другой\ncat /var/log/syslog | grep "error" | wc -l  # Количество ошибок\nps aux | grep nginx                          # Найти процесс nginx\nhistory | grep docker                        # История команд docker\ndu -sh /var/* | sort -rh | head -5           # Топ-5 каталогов по размеру\n\n# /dev/null — чёрная дыра\ncommand > /dev/null 2>&1         # Подавить весь вывод' },
        { type: 'tip', value: 'Пайпы — суперсила Linux. Комбинируя простые команды через |, можно строить мощные конвейеры обработки данных. Принцип Unix: каждая программа делает одно дело хорошо.' }
      ]
    },
    {
      id: 4,
      title: 'Права доступа и пользователи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Linux — многопользовательская система. Каждый файл принадлежит пользователю и группе. Права доступа (permissions) определяют кто может читать, писать и выполнять файл.' },
        { type: 'heading', value: 'Структура прав доступа' },
        { type: 'code', language: 'bash', value: '# ls -la показывает права:\n# -rw-r--r-- 1 devops devops 1234 Mar 21 10:00 config.yml\n# ╚╦╝╚╦╝╚╦╝   ╚══╦═╝ ╚══╦═╝\n#  │  │  │       │      │\n#  │  │  │       │      └── Группа-владелец\n#  │  │  │       └──────── Пользователь-владелец\n#  │  │  └──────────────── Others (все остальные)\n#  │  └─────────────────── Group (группа)\n#  └────────────────────── User (владелец)\n\n# Три типа прав:\n# r (read)    = 4  — чтение\n# w (write)   = 2  — запись\n# x (execute) = 1  — выполнение\n\n# Примеры:\n# rwxr-xr-x = 755 — владелец: всё, остальные: чтение + выполнение\n# rw-r--r-- = 644 — владелец: чтение + запись, остальные: только чтение\n# rwx------ = 700 — только владелец имеет доступ\n# rw------- = 600 — только владелец читает и пишет (SSH ключи!)' },
        { type: 'heading', value: 'Управление правами' },
        { type: 'code', language: 'bash', value: '# chmod — изменить права\nchmod 755 script.sh              # Числовой формат\nchmod +x script.sh               # Добавить право выполнения\nchmod u+w,g-w file.txt           # Символьный формат\nchmod -R 755 /var/www/            # Рекурсивно\n\n# chown — изменить владельца\nchown devops:devops file.txt     # Пользователь:группа\nchown -R www-data:www-data /var/www/  # Рекурсивно\n\n# Управление пользователями\nsudo useradd -m -s /bin/bash devops   # Создать пользователя\nsudo passwd devops                    # Установить пароль\nsudo usermod -aG docker devops        # Добавить в группу docker\nsudo userdel -r olduser               # Удалить пользователя с домашним каталогом\n\n# Важно для DevOps:\nchmod 600 ~/.ssh/id_rsa          # SSH ключ — только владелец!\nchmod 644 ~/.ssh/id_rsa.pub      # Публичный ключ — можно читать\nchmod 700 ~/.ssh/                # SSH директория' },
        { type: 'warning', value: 'Никогда не ставь chmod 777 на файлы в продакшене — это даёт полный доступ всем пользователям. SSH откажется работать с ключами если права слишком открытые: chmod 600 ~/.ssh/id_rsa обязателен.' }
      ]
    },
    {
      id: 5,
      title: 'Текстовые редакторы и работа с текстом',
      type: 'theory',
      content: [
        { type: 'text', value: 'На серверах часто нет графического интерфейса, поэтому нужно уметь редактировать файлы в терминале. Основные редакторы: nano (простой), vim (мощный), а также утилиты обработки текста: sed, awk, cut, sort.' },
        { type: 'heading', value: 'Nano и Vim' },
        { type: 'code', language: 'bash', value: '# Nano — простой редактор\nnano /etc/nginx/nginx.conf\n# Ctrl+O — сохранить, Ctrl+X — выйти\n\n# Vim — мощный редактор (есть на каждом Linux)\nvim /etc/nginx/nginx.conf\n# i      — режим вставки (начать редактирование)\n# Esc    — выйти из режима вставки\n# :w     — сохранить\n# :q     — выйти\n# :wq    — сохранить и выйти\n# :q!    — выйти без сохранения\n# /text  — поиск\n# dd     — удалить строку\n# yy     — копировать строку\n# p      — вставить\n# u      — отменить' },
        { type: 'heading', value: 'Обработка текста' },
        { type: 'code', language: 'bash', value: '# sed — потоковый редактор\nsed \'s/old/new/g\' file.txt              # Заменить old на new\nsed -i \'s/localhost/0.0.0.0/g\' config   # Заменить в файле (-i = in-place)\nsed -n \'10,20p\' file.txt                # Вывести строки 10-20\n\n# awk — обработка структурированного текста\nawk \'{print $1, $3}\' file.txt           # Вывести 1-й и 3-й столбцы\ndf -h | awk \'{print $5, $6}\'            # Использование дисков\nps aux | awk \'$3 > 50 {print $0}\'       # Процессы с CPU > 50%\n\n# cut — вырезать столбцы\ncut -d: -f1,3 /etc/passwd               # Логин и UID\n\n# sort и uniq\ncat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head\n# Топ IP-адресов по количеству запросов\n\n# wc — подсчёт\nwc -l file.txt                          # Количество строк\nwc -w file.txt                          # Количество слов' },
        { type: 'tip', value: 'Для DevOps достаточно знать nano для быстрого редактирования и базовые команды vim (:wq, :q!, i, Esc). Для сложной обработки логов — grep, awk, sed, sort, uniq.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Работа с Linux',
      type: 'practice',
      difficulty: 'easy',
      description: 'Выполните основные операции в командной строке Linux: навигация, создание файлов, поиск, права доступа.',
      requirements: [
        'Создайте структуру каталогов: ~/devops-lab/scripts, ~/devops-lab/configs, ~/devops-lab/logs',
        'Создайте файл ~/devops-lab/scripts/deploy.sh с содержимым echo "Deploying..."',
        'Сделайте deploy.sh исполняемым и запустите его',
        'Найдите все .conf файлы в /etc с помощью find',
        'Подсчитайте количество строк с "error" в /var/log/syslog (или другом лог-файле)',
        'Создайте пользователя testuser и добавьте его в группу sudo'
      ],
      hint: 'Используйте mkdir -p для создания вложенных каталогов, chmod +x для добавления права выполнения, find с -name, grep -c для подсчёта.',
      expectedOutput: 'Каталоги созданы: ~/devops-lab/scripts, configs, logs\nФайл deploy.sh создан и выполнен: "Deploying..."\nНайдены .conf файлы: /etc/nginx/nginx.conf, /etc/ssh/sshd_config и т.д.\nКоличество ошибок в syslog: N строк\nПользователь testuser создан и добавлен в группу sudo',
      solution: '#!/bin/bash\n# 1. Создание структуры каталогов\nmkdir -p ~/devops-lab/{scripts,configs,logs}\nls -la ~/devops-lab/\n\n# 2. Создание скрипта\necho \'#!/bin/bash\necho "Deploying..."\necho "Date: $(date)"\necho "User: $(whoami)"\necho "Host: $(hostname)"\' > ~/devops-lab/scripts/deploy.sh\n\n# 3. Сделать исполняемым и запустить\nchmod +x ~/devops-lab/scripts/deploy.sh\n~/devops-lab/scripts/deploy.sh\n# Deploying...\n# Date: Thu Mar 21 10:00:00 UTC 2026\n# User: devops\n# Host: server-01\n\n# 4. Найти .conf файлы\nfind /etc -name "*.conf" -type f 2>/dev/null | head -20\n\n# 5. Подсчитать ошибки в логах\ngrep -ci "error" /var/log/syslog 2>/dev/null || echo "Файл не найден"\n\n# 6. Создать пользователя\nsudo useradd -m -s /bin/bash testuser\nsudo usermod -aG sudo testuser\nid testuser\n# uid=1001(testuser) gid=1001(testuser) groups=1001(testuser),27(sudo)',
      explanation: 'mkdir -p создаёт все промежуточные каталоги. chmod +x добавляет право выполнения. find ищет файлы рекурсивно. grep -c считает количество совпадающих строк. 2>/dev/null подавляет ошибки доступа. usermod -aG добавляет в группу без удаления из текущих групп.'
    }
  ]
}
