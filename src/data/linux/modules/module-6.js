export default {
  id: 6,
  title: 'Права доступа',
  description: 'Система прав доступа Linux: chmod, chown, chgrp. Специальные биты SUID, SGID, sticky bit. Списки управления доступом ACL.',
  lessons: [
    {
      id: 1,
      title: 'Основы прав доступа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый файл в Linux имеет владельца (owner), группу (group) и набор прав для трёх категорий: owner, group, others. Права: read (r), write (w), execute (x).' },
        { type: 'heading', value: 'Чтение прав доступа' },
        { type: 'code', language: 'bash', value: 'ls -la /etc/passwd\n# -rw-r--r-- 1 root root 1823 Mar 15 /etc/passwd\n\n# Разбор: -rw-r--r--\n# -    тип файла (- файл, d каталог, l ссылка)\n# rw-  права владельца (root): чтение + запись\n# r--  права группы (root): только чтение\n# r--  права остальных: только чтение\n\n# Права для файлов:\n# r (read)    — читать содержимое\n# w (write)   — изменять содержимое\n# x (execute) — запускать как программу\n\n# Права для каталогов:\n# r (read)    — просматривать список файлов (ls)\n# w (write)   — создавать/удалять файлы внутри\n# x (execute) — входить в каталог (cd)\n\n# Числовое представление:\n# r = 4, w = 2, x = 1\n# rwx = 4+2+1 = 7\n# rw- = 4+2+0 = 6\n# r-x = 4+0+1 = 5\n# r-- = 4+0+0 = 4\n\n# Примеры:\n# rwxr-xr-x = 755  — типично для каталогов и скриптов\n# rw-r--r-- = 644  — типично для обычных файлов\n# rw------- = 600  — приватные файлы (SSH ключи)\n# rwx------ = 700  — приватные каталоги (.ssh)' },
        { type: 'tip', value: 'Запомните три числа: 755 (каталоги и исполняемые файлы), 644 (обычные файлы), 600 (приватные файлы). Этих значений достаточно для 90% случаев.' }
      ]
    },
    {
      id: 2,
      title: 'chmod — изменение прав',
      type: 'theory',
      content: [
        { type: 'text', value: 'chmod изменяет права доступа к файлам. Поддерживает два формата: числовой (chmod 755) и символьный (chmod u+x). Числовой — быстрее, символьный — нагляднее.' },
        { type: 'code', language: 'bash', value: '# Числовой формат:\nchmod 755 script.sh      # rwxr-xr-x\nchmod 644 config.txt     # rw-r--r--\nchmod 600 id_rsa         # rw------- (приватный SSH ключ)\nchmod 700 .ssh/          # rwx------ (каталог .ssh)\n\n# Символьный формат:\n# u = user (владелец)\n# g = group (группа)\n# o = others (остальные)\n# a = all (все)\n\nchmod u+x script.sh      # +x для владельца\nchmod g+w file.txt       # +w для группы\nchmod o-r file.txt       # убрать r у остальных\nchmod a+r file.txt       # +r для всех\nchmod u=rwx,g=rx,o=r file.txt  # установить точно\n\n# Рекурсивно:\nchmod -R 755 /var/www/html/\nchmod -R u+rw project/' },
        { type: 'heading', value: 'Распространённые шаблоны' },
        { type: 'code', language: 'bash', value: '# Сделать скрипт исполняемым:\nchmod +x script.sh\n./script.sh\n\n# Права для веб-сервера:\nchmod -R 755 /var/www/html/      # каталоги и файлы\nfind /var/www -type f -exec chmod 644 {} \;\n# файлы 644, каталоги остаются 755\n\n# Права для SSH:\nchmod 700 ~/.ssh\nchmod 600 ~/.ssh/id_rsa          # приватный ключ\nchmod 644 ~/.ssh/id_rsa.pub      # публичный ключ\nchmod 600 ~/.ssh/authorized_keys\nchmod 644 ~/.ssh/config\n\n# Права для конфигов с паролями:\nchmod 600 /etc/shadow\nchmod 600 .env                   # файл с секретами' },
        { type: 'note', value: 'SSH откажет в подключении если права на ключи неправильные. Приватный ключ ДОЛЖЕН быть 600, каталог .ssh — 700. Это частая причина ошибки "Permissions too open".' }
      ]
    },
    {
      id: 3,
      title: 'chown и chgrp — смена владельца',
      type: 'theory',
      content: [
        { type: 'text', value: 'chown изменяет владельца и группу файла. chgrp изменяет только группу. Для смены владельца нужны права root (sudo).' },
        { type: 'code', language: 'bash', value: '# chown — сменить владельца:\nsudo chown user file.txt           # сменить владельца\nsudo chown user:group file.txt     # сменить владельца и группу\nsudo chown :group file.txt         # только группу\nsudo chown -R user:group /var/www/ # рекурсивно\n\n# chgrp — сменить только группу:\nsudo chgrp developers project/\nsudo chgrp -R www-data /var/www/\n\n# Практические примеры:\n# Веб-сервер (Nginx работает от www-data):\nsudo chown -R www-data:www-data /var/www/mysite/\n\n# Домашний каталог пользователя:\nsudo chown -R john:john /home/john/\n\n# Общий каталог для группы:\nsudo mkdir /opt/project\nsudo chown -R :developers /opt/project\nsudo chmod -R 775 /opt/project\n# Все в группе developers могут читать и писать\n\n# Проверить владельца:\nstat file.txt\n# Access: (0644/-rw-r--r--)  Uid: ( 1000/user)  Gid: ( 1000/user)\n\nls -la file.txt\n# -rw-r--r-- 1 user user 1234 Mar 15 file.txt\n# Владелец: user, Группа: user' },
        { type: 'tip', value: 'Типичная ошибка: файлы веб-приложения принадлежат root, а Nginx работает от www-data. Решение: sudo chown -R www-data:www-data /var/www/mysite/' }
      ]
    },
    {
      id: 4,
      title: 'Специальные биты: SUID, SGID, Sticky Bit',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо rwx существуют три специальных бита: SUID (запуск от имени владельца), SGID (запуск от имени группы / наследование группы для каталогов), Sticky Bit (только владелец может удалить файл).' },
        { type: 'code', language: 'bash', value: '# SUID (Set User ID) — файл запускается от имени ВЛАДЕЛЬЦА\n# Пример: passwd запускается от root для изменения /etc/shadow\nls -la /usr/bin/passwd\n# -rwsr-xr-x 1 root root 68208 /usr/bin/passwd\n#    s — SUID бит (вместо x у владельца)\n\n# Установить SUID:\nchmod u+s program        # символьный\nchmod 4755 program       # числовой (4 = SUID)\n\n# SGID (Set Group ID) — для каталогов: новые файлы наследуют группу каталога\nmkdir /opt/shared\nchmod g+s /opt/shared    # SGID на каталоге\nchmod 2775 /opt/shared   # числовой (2 = SGID)\n# Все файлы созданные внутри будут иметь группу каталога\n\n# Sticky Bit — только владелец файла может его удалить\n# Пример: /tmp (все пишут, но удалить может только владелец)\nls -ld /tmp\n# drwxrwxrwt 15 root root 4096 /tmp\n#          t — sticky bit\n\nchmod +t /opt/shared     # установить sticky bit\nchmod 1777 /opt/shared   # числовой (1 = sticky)' },
        { type: 'heading', value: 'Поиск файлов со специальными битами' },
        { type: 'code', language: 'bash', value: '# Найти SUID файлы (потенциальная угроза безопасности):\nfind / -perm -u+s -type f 2>/dev/null\n# /usr/bin/passwd\n# /usr/bin/sudo\n# /usr/bin/su\n# /usr/bin/mount\n\n# Найти SGID файлы:\nfind / -perm -g+s -type f 2>/dev/null\n\n# Числовое представление:\n# SUID SGID Sticky  owner group others\n#  4    2    1       rwx   rwx   rwx\n# 4755 = SUID + rwxr-xr-x\n# 2775 = SGID + rwxrwxr-x\n# 1777 = Sticky + rwxrwxrwx' },
        { type: 'note', value: 'SUID на скриптах не работает (Linux игнорирует SUID для скриптов в целях безопасности). SUID работает только для бинарных файлов. Регулярно проверяйте SUID файлы — это частый вектор атаки.' }
      ]
    },
    {
      id: 5,
      title: 'umask — права по умолчанию',
      type: 'theory',
      content: [
        { type: 'text', value: 'umask определяет какие права УБИРАЮТСЯ при создании новых файлов и каталогов. По умолчанию файлы создаются с 666, каталоги с 777, минус umask. Стандартный umask = 022.' },
        { type: 'code', language: 'bash', value: '# Текущий umask:\numask\n# 0022\n\n# Расчёт прав:\n# Файлы:   666 - 022 = 644 (rw-r--r--)\n# Каталоги: 777 - 022 = 755 (rwxr-xr-x)\n\n# Проверим:\ntouch testfile\nmkdir testdir\nls -la\n# -rw-r--r--  1 user user    0 testfile\n# drwxr-xr-x  2 user user 4096 testdir\n\n# Изменить umask:\numask 077            # файлы: 600, каталоги: 700 (только владелец)\numask 002            # файлы: 664, каталоги: 775 (группа может писать)\n\n# Постоянная установка — добавить в ~/.bashrc:\necho "umask 027" >> ~/.bashrc\n# файлы: 640, каталоги: 750\n\n# Типичные значения:\n# 022 — стандарт (файлы 644, каталоги 755)\n# 027 — более безопасно (файлы 640, каталоги 750)\n# 077 — максимальная приватность (файлы 600, каталоги 700)' },
        { type: 'tip', value: 'Для серверов рекомендуется umask 027 — файлы будут недоступны для "остальных" (others). Это особенно важно для файлов конфигурации и данных приложений.' }
      ]
    },
    {
      id: 6,
      title: 'ACL — списки управления доступом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартные права Linux (owner/group/others) ограничены. ACL (Access Control Lists) позволяют назначить разные права разным пользователям и группам на один и тот же файл.' },
        { type: 'code', language: 'bash', value: '# Установка ACL (если не установлен):\nsudo apt install acl\n\n# Просмотр ACL:\ngetfacl file.txt\n# file: file.txt\n# owner: user\n# group: user\n# user::rw-\n# group::r--\n# other::r--\n\n# Добавить права для конкретного пользователя:\nsetfacl -m u:alice:rw file.txt     # alice получает rw\nsetfacl -m u:bob:r file.txt        # bob получает r\n\n# Добавить права для группы:\nsetfacl -m g:developers:rwx project/\n\n# Рекурсивно:\nsetfacl -R -m u:alice:rwx /opt/project/\n\n# ACL по умолчанию (для новых файлов в каталоге):\nsetfacl -d -m g:developers:rwx /opt/project/\n# Все новые файлы будут иметь rwx для developers\n\n# Удалить ACL:\nsetfacl -x u:alice file.txt        # удалить ACL для alice\nsetfacl -b file.txt                # удалить все ACL\n\n# Файлы с ACL помечены + в ls:\nls -la\n# -rw-rw-r--+ 1 user user 100 file.txt\n#           + означает наличие ACL' },
        { type: 'tip', value: 'ACL решает проблему "один файл — несколько групп с разными правами". Стандартные права позволяют назначить только одну группу. С ACL можно дать разные права 10 разным пользователям.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Настройка прав доступа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте права доступа для веб-проекта с несколькими пользователями.',
      requirements: [
        'Создайте каталог /opt/webapp с владельцем www-data',
        'Установите SGID на каталог, чтобы новые файлы наследовали группу',
        'Настройте права 2775 (SGID + rwxrwxr-x) рекурсивно',
        'С помощью ACL дайте пользователю alice права rwx, а bob — только чтение',
        'Создайте скрипт deploy.sh и сделайте его исполняемым только для владельца',
        'Найдите все SUID-файлы в /usr/bin',
        'Проверьте все настройки с помощью ls -la и getfacl'
      ],
      hint: 'sudo mkdir /opt/webapp && sudo chown www-data:developers /opt/webapp && sudo chmod 2775 /opt/webapp. setfacl -m u:alice:rwx /opt/webapp. find /usr/bin -perm -u+s.',
      expectedOutput: 'ls -la /opt/webapp: drwxrwsr-x www-data developers (SGID установлен)\ngetfacl /opt/webapp: user:alice:rwx, user:bob:r-x\nls -la deploy.sh: -rwx------ (700)\nfind /usr/bin -perm -u+s: /usr/bin/passwd, /usr/bin/sudo ...',
      solution: '# 1. Создать каталог\nsudo mkdir -p /opt/webapp\nsudo chown www-data:developers /opt/webapp\n\n# 2-3. SGID и права\nsudo chmod 2775 /opt/webapp\nls -ld /opt/webapp\n# drwxrwsr-x 2 www-data developers 4096 /opt/webapp\n\n# 4. ACL\nsudo setfacl -m u:alice:rwx /opt/webapp\nsudo setfacl -m u:bob:r-x /opt/webapp\ngetfacl /opt/webapp\n\n# 5. Скрипт\ntouch /opt/webapp/deploy.sh\nchmod 700 /opt/webapp/deploy.sh\nls -la /opt/webapp/deploy.sh\n\n# 6. SUID файлы\nfind /usr/bin -perm -u+s -type f 2>/dev/null\n\n# 7. Проверка\nls -la /opt/webapp/\ngetfacl /opt/webapp/',
      explanation: 'SGID (2 в 2775) на каталоге заставляет новые файлы наследовать группу каталога (developers), а не основную группу создателя. ACL (setfacl) позволяет задать разные права для alice (rwx) и bob (r-x) на один каталог. chmod 700 даёт права только владельцу.'
    }
  ]
}
