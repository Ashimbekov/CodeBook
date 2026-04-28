export default {
  id: 3,
  title: 'Работа с файлами',
  description: 'Копирование, перемещение, удаление файлов. Поиск файлов с find и locate. Жёсткие и символические ссылки. Архивирование и сжатие.',
  lessons: [
    {
      id: 1,
      title: 'Создание, копирование и перемещение файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Базовые операции с файлами: создание (touch, mkdir), копирование (cp), перемещение/переименование (mv). Эти команды — основа повседневной работы в Linux.' },
        { type: 'heading', value: 'Создание файлов и каталогов' },
        { type: 'code', language: 'bash', value: '# Создать пустой файл (или обновить время модификации)\ntouch file.txt\ntouch file1.txt file2.txt file3.txt   # несколько файлов\n\n# Создать каталог\nmkdir mydir\nmkdir -p path/to/deep/directory  # -p создаёт промежуточные\n\n# Создать файл с содержимым\necho "Hello Linux" > hello.txt\ncat > notes.txt << EOF\nПервая строка\nВторая строка\nТретья строка\nEOF' },
        { type: 'heading', value: 'Копирование' },
        { type: 'code', language: 'bash', value: '# Копировать файл\ncp source.txt destination.txt\ncp file.txt /tmp/                 # в другой каталог\n\n# Копировать каталог (рекурсивно)\ncp -r mydir/ /backup/mydir/\n\n# Полезные опции:\ncp -i file.txt /tmp/    # -i спросить перед перезаписью\ncp -v file.txt /tmp/    # -v подробный вывод\ncp -p file.txt /tmp/    # -p сохранить права и время\ncp -a mydir/ backup/    # -a архивный (рекурсивно + права + ссылки)' },
        { type: 'heading', value: 'Перемещение и переименование' },
        { type: 'code', language: 'bash', value: '# Переместить файл\nmv file.txt /tmp/\n\n# Переименовать файл\nmv old-name.txt new-name.txt\n\n# Переместить и переименовать\nmv file.txt /tmp/renamed-file.txt\n\n# Переместить несколько файлов\nmv *.log /var/log/archive/\n\n# Полезные опции:\nmv -i file.txt /tmp/    # спросить перед перезаписью\nmv -v file.txt /tmp/    # подробный вывод\nmv -n file.txt /tmp/    # не перезаписывать существующий' },
        { type: 'tip', value: 'Всегда используйте cp -a при копировании каталогов — это сохранит все атрибуты файлов (права, владельца, время модификации). mv работает мгновенно в пределах одной файловой системы (просто переименовывает), но медленно между разными ФС (копирует + удаляет).' }
      ]
    },
    {
      id: 2,
      title: 'Удаление файлов и каталогов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Удаление в Linux — необратимая операция. В отличие от Windows, нет Корзины в командной строке. rm удаляет файлы навсегда. Будьте предельно осторожны, особенно с rm -rf.' },
        { type: 'heading', value: 'Команда rm' },
        { type: 'code', language: 'bash', value: '# Удалить файл\nrm file.txt\n\n# Удалить несколько файлов\nrm file1.txt file2.txt file3.txt\nrm *.log               # все файлы .log\n\n# Удалить каталог (пустой)\nrmdir empty-dir/\n\n# Удалить каталог с содержимым\nrm -r mydir/           # рекурсивно\nrm -rf mydir/          # без подтверждения (ОПАСНО!)\n\n# Безопасное удаление — с подтверждением\nrm -i file.txt         # спросит: rm: remove file.txt? y\nrm -ri mydir/          # спросит для каждого файла\n\n# Подробный вывод\nrm -rv mydir/\n# removed mydir/file1.txt\n# removed mydir/file2.txt\n# removed directory mydir/' },
        { type: 'heading', value: 'Опасные команды — чего НИКОГДА не делать' },
        { type: 'code', language: 'bash', value: '# НИКОГДА НЕ ВЫПОЛНЯЙТЕ ЭТИ КОМАНДЫ:\n# rm -rf /              — удалит ВСЮ систему\n# rm -rf /*             — удалит всё в корне\n# rm -rf ~              — удалит весь домашний каталог\n# rm -rf .              — удалит текущий каталог\n# rm -rf $VARIABLE/     — если переменная пуста = rm -rf /\n\n# Защита от случайного удаления:\n# 1. Используйте -i для подтверждения\nalias rm="rm -i"       # добавить в .bashrc\n\n# 2. Проверяйте команду перед выполнением\n# Сначала ls, потом rm:\nls /tmp/*.log          # посмотреть что будет удалено\nrm /tmp/*.log          # теперь удалить\n\n# 3. Используйте trash-cli вместо rm\nsudo apt install trash-cli\ntrash-put file.txt     # в корзину вместо удаления\ntrash-list             # содержимое корзины\ntrash-restore          # восстановить' },
        { type: 'note', value: 'Золотое правило: перед rm всегда выполните ls с тем же шаблоном, чтобы увидеть что будет удалено. Особенно при использовании wildcards (*, ?) и переменных.' }
      ]
    },
    {
      id: 3,
      title: 'Поиск файлов: find',
      type: 'theory',
      content: [
        { type: 'text', value: 'find — мощнейшая команда для поиска файлов по любым критериям: имя, тип, размер, дата, права, владелец. В отличие от locate, find ищет в реальном времени по файловой системе.' },
        { type: 'code', language: 'bash', value: '# Синтаксис: find [путь] [критерии] [действие]\n\n# Поиск по имени\nfind /etc -name "*.conf"           # файлы .conf в /etc\nfind / -name "nginx.conf"          # nginx.conf по всей системе\nfind . -iname "readme*"            # без учёта регистра\n\n# Поиск по типу\nfind /var -type f -name "*.log"    # только файлы\nfind /home -type d -name ".ssh"    # только каталоги\nfind /dev -type l                  # символические ссылки\n# f=файл, d=каталог, l=ссылка, b=блочное, c=символьное\n\n# Поиск по размеру\nfind / -size +100M                 # больше 100 МБ\nfind /var -size +1G                # больше 1 ГБ\nfind /tmp -size -1k                # меньше 1 КБ\nfind / -size +100M -type f 2>/dev/null  # большие файлы' },
        { type: 'heading', value: 'Поиск по времени и владельцу' },
        { type: 'code', language: 'bash', value: '# Поиск по времени модификации\nfind /var/log -mtime -1            # изменены за последние 24 часа\nfind /home -mtime +30              # не менялись более 30 дней\nfind /tmp -mmin -60                # изменены за последние 60 минут\n# -mtime: дни, -mmin: минуты\n# -atime: время доступа, -ctime: время смены метаданных\n\n# Поиск по владельцу\nfind /home -user bob               # файлы пользователя bob\nfind / -group www-data             # файлы группы www-data\nfind / -nouser                     # файлы без владельца\n\n# Поиск по правам\nfind / -perm 777                   # точно 777\nfind / -perm -u+s                  # файлы с SUID битом\n\n# Комбинирование критериев\nfind /var -type f -size +10M -mtime -7 -name "*.log"\n# Файлы .log больше 10 МБ, изменённые за последние 7 дней' },
        { type: 'heading', value: 'Действия с найденными файлами' },
        { type: 'code', language: 'bash', value: '# -exec выполнить команду для каждого файла\nfind /tmp -name "*.tmp" -exec rm {} \;\n# {} заменяется на найденный файл, \; — конец команды\n\n# -exec с подтверждением\nfind /home -name "*.bak" -ok rm {} \;\n# Спросит для каждого файла\n\n# -delete — удалить (быстрее чем -exec rm)\nfind /tmp -name "*.tmp" -delete\n\n# Комбинация с xargs (эффективнее -exec для большого количества)\nfind /var/log -name "*.gz" | xargs ls -lh\n\n# Практические примеры:\n# Найти файлы больше 100 МБ\nfind / -type f -size +100M -exec ls -lh {} \; 2>/dev/null\n\n# Найти и удалить старые логи (>30 дней)\nfind /var/log -name "*.log" -mtime +30 -delete\n\n# Найти пустые каталоги\nfind /home -type d -empty' },
        { type: 'tip', value: 'find — одна из самых полезных команд Linux. Запомните базовые фильтры: -name (имя), -type f/d (тип), -size +/-N (размер), -mtime (время). Комбинируйте их для точного поиска.' }
      ]
    },
    {
      id: 4,
      title: 'Быстрый поиск: locate и which',
      type: 'theory',
      content: [
        { type: 'text', value: 'locate ищет файлы по базе данных (мгновенно, но данные могут устареть). which и whereis находят исполняемые файлы. Эти команды дополняют find для быстрого поиска.' },
        { type: 'code', language: 'bash', value: '# locate — мгновенный поиск по базе данных\nsudo apt install mlocate    # установка (или plocate)\nsudo updatedb               # обновить базу данных\n\nlocate nginx.conf\n# /etc/nginx/nginx.conf\n# /usr/share/doc/nginx/nginx.conf.example\n\nlocate -i readme            # без учёта регистра\nlocate -c "*.conf"          # количество совпадений\nlocate -l 10 "*.log"        # первые 10 результатов\n\n# which — путь к исполняемому файлу\nwhich python3\n# /usr/bin/python3\nwhich nginx\n# /usr/sbin/nginx\n\n# whereis — путь + man-страница + исходники\nwhereis nginx\n# nginx: /usr/sbin/nginx /usr/lib/nginx /etc/nginx /usr/share/nginx /usr/share/man/man8/nginx.8.gz\n\n# type — тип команды (встроенная, алиас, файл)\ntype cd\n# cd is a shell builtin\ntype ls\n# ls is aliased to `ls --color=auto`\ntype nginx\n# nginx is /usr/sbin/nginx' },
        { type: 'heading', value: 'Сравнение find vs locate' },
        { type: 'code', language: 'bash', value: '# find vs locate:\n#\n# find:\n# + Всегда актуальные результаты (реальный поиск)\n# + Мощные фильтры (размер, дата, права, владелец)\n# + Может выполнять действия (-exec, -delete)\n# - Медленный на больших файловых системах\n#\n# locate:\n# + Мгновенный поиск (по индексу)\n# + Отлично для поиска по имени файла\n# - База может устареть (updatedb обычно запускается через cron раз в день)\n# - Только поиск по имени, нет фильтров по размеру/дате\n\n# Практический подход:\n# 1. Быстро найти файл по имени -> locate\n# 2. Найти с конкретными критериями -> find\n# 3. Найти исполняемый файл -> which\n\n# Обновление базы locate вручную:\nsudo updatedb' },
        { type: 'note', value: 'База данных locate обновляется cron-задачей обычно раз в сутки (/etc/cron.daily/mlocate). Если вы создали файл только что, locate его не найдёт — сначала sudo updatedb.' }
      ]
    },
    {
      id: 5,
      title: 'Ссылки: жёсткие и символические',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Linux существует два типа ссылок: жёсткие (hard link) и символические (soft link / symlink). Жёсткая ссылка — это ещё одно имя для того же файла (тот же inode). Символическая — ярлык, указывающий на путь к файлу.' },
        { type: 'code', language: 'bash', value: '# Символическая ссылка (symlink) — самый частый случай\nln -s /etc/nginx/nginx.conf ~/nginx.conf\nls -la ~/nginx.conf\n# lrwxrwxrwx 1 user user 24 Mar 15 ~/nginx.conf -> /etc/nginx/nginx.conf\n\n# Жёсткая ссылка\nln original.txt hardlink.txt\nls -li original.txt hardlink.txt\n# 262147 -rw-r--r-- 2 user user 100 original.txt\n# 262147 -rw-r--r-- 2 user user 100 hardlink.txt\n# Одинаковый inode (262147)! Это один и тот же файл.' },
        { type: 'heading', value: 'Различия между типами ссылок' },
        { type: 'code', language: 'bash', value: '# Символическая ссылка:\n# + Может ссылаться на каталоги\n# + Может ссылаться на файлы на другой файловой системе\n# + Видно куда указывает (ls -l показывает ->)\n# - Ломается при удалении/перемещении оригинала (dangling link)\n\n# Жёсткая ссылка:\n# + Не ломается при перемещении оригинала\n# + Оба имени равноправны (нет "оригинала")\n# - Не работает для каталогов\n# - Только в пределах одной файловой системы\n\n# Практический пример: симлинки в системе\nls -la /usr/bin/python3\n# /usr/bin/python3 -> python3.10\n\nls -la /etc/alternatives/editor\n# /etc/alternatives/editor -> /usr/bin/vim.basic\n\n# Найти битые символические ссылки:\nfind /home -type l ! -exec test -e {} \; -print' },
        { type: 'tip', value: 'Используйте символические ссылки для: конфигов (ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/), версий ПО (python3 -> python3.11), быстрого доступа к глубоким каталогам.' }
      ]
    },
    {
      id: 6,
      title: 'Архивирование и сжатие',
      type: 'theory',
      content: [
        { type: 'text', value: 'tar объединяет файлы в архив, а gzip/bzip2/xz сжимают данные. Обычно используется комбинация: сначала архивирование tar, затем сжатие. tar умеет делать и то, и другое одной командой.' },
        { type: 'code', language: 'bash', value: '# tar — архивирование\n# Создать архив:\ntar -cvf archive.tar /path/to/dir/\n# c — create, v — verbose, f — file\n\n# tar + gzip (.tar.gz или .tgz)\ntar -czvf archive.tar.gz /path/to/dir/\n# z — gzip сжатие\n\n# tar + bzip2 (.tar.bz2) — лучшее сжатие, медленнее\ntar -cjvf archive.tar.bz2 /path/to/dir/\n\n# tar + xz (.tar.xz) — лучшее сжатие\ntar -cJvf archive.tar.xz /path/to/dir/\n\n# Распаковать:\ntar -xzvf archive.tar.gz           # в текущий каталог\ntar -xzvf archive.tar.gz -C /tmp/  # в указанный каталог\n\n# Просмотреть содержимое архива (без распаковки):\ntar -tzvf archive.tar.gz' },
        { type: 'heading', value: 'Другие инструменты сжатия' },
        { type: 'code', language: 'bash', value: '# gzip / gunzip — сжатие отдельных файлов\ngzip file.txt           # -> file.txt.gz (оригинал удаляется)\ngunzip file.txt.gz      # -> file.txt\ngzip -k file.txt        # -k сохранить оригинал\n\n# zip/unzip — совместимость с Windows\nzip -r archive.zip mydir/\nunzip archive.zip\nunzip -l archive.zip    # просмотр содержимого\n\n# Сравнение размеров сжатия (100 МБ текстового файла):\n# gzip:  ~25 МБ (быстро)\n# bzip2: ~20 МБ (средне)\n# xz:    ~15 МБ (медленно, но лучшее сжатие)\n\n# Полезные приёмы:\n# Архив с исключениями:\ntar -czvf backup.tar.gz /home --exclude="*.tmp" --exclude=".cache"\n\n# Архив с датой в имени:\ntar -czvf "backup-$(date +%Y%m%d).tar.gz" /var/www/' },
        { type: 'tip', value: 'Запомните: tar -czvf для создания .tar.gz и tar -xzvf для распаковки. Флаги: c=create, x=extract, z=gzip, v=verbose, f=file. Для бэкапов используйте tar -czvf с --exclude для исключения ненужных файлов.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Работа с файлами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выполните операции с файлами, поиск и архивирование.',
      requirements: [
        'Создайте структуру каталогов ~/project/{src,docs,tests,logs}',
        'Создайте файлы: src/app.py, docs/readme.txt, tests/test_app.py, logs/app.log',
        'Найдите все файлы .conf в /etc (через find, выведите первые 10)',
        'Найдите файлы больше 50 МБ в системе',
        'Создайте символическую ссылку на ~/project/docs/readme.txt в домашнем каталоге',
        'Создайте tar.gz архив каталога ~/project',
        'Просмотрите содержимое архива без распаковки'
      ],
      hint: 'mkdir -p создаёт вложенные каталоги. Фигурные скобки {} в bash раскрываются: mkdir -p dir/{a,b,c} создаёт dir/a, dir/b, dir/c. find / -size +50M -type f 2>/dev/null находит большие файлы.',
      expectedOutput: 'tree ~/project:\nproject/\n├── src/app.py\n├── docs/readme.txt\n├── tests/test_app.py\n└── logs/app.log\n\nfind /etc -name "*.conf" | head -10: список конфигурационных файлов\nfind / -size +50M: список больших файлов\nls -la ~/readme.txt -> ~/project/docs/readme.txt\ntar -tzvf project.tar.gz: содержимое архива',
      solution: '# 1. Создать структуру каталогов\nmkdir -p ~/project/{src,docs,tests,logs}\n\n# 2. Создать файлы\ntouch ~/project/src/app.py\ntouch ~/project/docs/readme.txt\ntouch ~/project/tests/test_app.py\ntouch ~/project/logs/app.log\n\n# Проверить:\ntree ~/project\n# или\nls -R ~/project\n\n# 3. Файлы .conf в /etc\nfind /etc -name "*.conf" -type f 2>/dev/null | head -10\n\n# 4. Файлы больше 50 МБ\nfind / -type f -size +50M 2>/dev/null | head -20\n\n# 5. Символическая ссылка\nln -s ~/project/docs/readme.txt ~/readme.txt\nls -la ~/readme.txt\n\n# 6. Создать архив\ntar -czvf ~/project.tar.gz -C ~ project/\n\n# 7. Просмотреть содержимое\ntar -tzvf ~/project.tar.gz',
      explanation: 'mkdir -p создаёт все промежуточные каталоги. Фигурные скобки раскрываются bash в несколько аргументов. find с 2>/dev/null скрывает ошибки доступа. ln -s создаёт символическую ссылку. tar -t показывает содержимое архива.'
    }
  ]
}
