export default {
  id: 5,
  title: 'Пользователи и группы',
  description: 'Управление пользователями и группами, sudo, файлы /etc/passwd и /etc/shadow, политики паролей.',
  lessons: [
    {
      id: 1,
      title: 'Пользователи в Linux: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Linux каждый процесс запускается от имени пользователя. Пользователи идентифицируются по UID (User ID). root имеет UID 0 и обладает неограниченными правами. Системные пользователи (UID 1-999) создаются для сервисов.' },
        { type: 'heading', value: 'Файл /etc/passwd' },
        { type: 'code', language: 'bash', value: '# Формат /etc/passwd:\n# username:password:UID:GID:comment:home:shell\n\ncat /etc/passwd\n# root:x:0:0:root:/root:/bin/bash\n# daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n# www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n# user:x:1000:1000:User Name:/home/user:/bin/bash\n\n# Поля:\n# username  — имя пользователя\n# x         — пароль хранится в /etc/shadow\n# UID       — числовой идентификатор (0=root, 1-999=системные, 1000+=обычные)\n# GID       — основная группа\n# comment   — описание (GECOS)\n# home      — домашний каталог\n# shell     — оболочка (/bin/bash, /usr/sbin/nologin)\n\n# Информация о текущем пользователе:\nwhoami           # имя\nid               # uid=1000(user) gid=1000(user) groups=1000(user),27(sudo)\nid user          # информация о конкретном пользователе\n\n# Кто в системе:\nwho              # активные сессии\nw                # подробнее (что делают)\nlast             # история входов\nlast -5          # последние 5 входов' },
        { type: 'tip', value: '/usr/sbin/nologin — специальная оболочка, запрещающая вход. Используется для системных пользователей (www-data, postgres), которым не нужна интерактивная сессия.' }
      ]
    },
    {
      id: 2,
      title: 'Создание и управление пользователями',
      type: 'theory',
      content: [
        { type: 'text', value: 'useradd создаёт нового пользователя, usermod изменяет, userdel удаляет. adduser — дружелюбная обёртка над useradd, доступная на Debian/Ubuntu.' },
        { type: 'code', language: 'bash', value: '# Создание пользователя:\nsudo useradd -m -s /bin/bash -c "John Doe" john\n# -m  создать домашний каталог\n# -s  оболочка\n# -c  комментарий (полное имя)\n\n# На Debian/Ubuntu — интерактивно:\nsudo adduser john\n# Спросит пароль, имя, телефон и т.д.\n\n# Установить пароль:\nsudo passwd john\n# Enter new UNIX password: ****\n\n# Изменить пользователя:\nsudo usermod -aG sudo john       # добавить в группу sudo\nsudo usermod -s /bin/zsh john    # сменить оболочку\nsudo usermod -l newname john     # переименовать\nsudo usermod -d /home/newname -m newname  # сменить домашний каталог\nsudo usermod -L john             # заблокировать пользователя\nsudo usermod -U john             # разблокировать\n\n# Удалить пользователя:\nsudo userdel john                # удалить (без домашнего каталога)\nsudo userdel -r john             # удалить вместе с домашним каталогом\n\n# На Debian/Ubuntu:\nsudo deluser --remove-home john' },
        { type: 'note', value: 'usermod -aG — флаг -a (append) критически важен! Без него -G ЗАМЕНИТ все группы пользователя. Всегда используйте -aG для добавления в группу.' }
      ]
    },
    {
      id: 3,
      title: 'Группы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Группы используются для управления доступом нескольких пользователей к файлам и ресурсам. Каждый пользователь имеет основную группу (primary) и может входить в дополнительные группы (secondary).' },
        { type: 'code', language: 'bash', value: '# Файл /etc/group:\n# groupname:password:GID:members\ncat /etc/group\n# root:x:0:\n# sudo:x:27:user,john\n# www-data:x:33:\n# docker:x:998:user\n# developers:x:1001:user,john,alice\n\n# Группы текущего пользователя:\ngroups\n# user sudo docker developers\n\ngroups john\n# john : john sudo developers\n\n# Создать группу:\nsudo groupadd developers\nsudo groupadd -g 2000 custom     # с конкретным GID\n\n# Добавить пользователя в группу:\nsudo usermod -aG developers john\nsudo gpasswd -a john developers   # альтернативный способ\n\n# Удалить из группы:\nsudo gpasswd -d john developers\n\n# Удалить группу:\nsudo groupdel developers\n\n# Изменить основную группу:\nsudo usermod -g developers john' },
        { type: 'heading', value: 'Важные системные группы' },
        { type: 'code', language: 'bash', value: '# sudo / wheel — право на sudo\nsudo usermod -aG sudo user       # Debian/Ubuntu\nsudo usermod -aG wheel user      # RHEL/CentOS\n\n# docker — управление Docker без sudo\nsudo usermod -aG docker user\n\n# www-data — группа веб-сервера\n# adm — доступ к логам в /var/log\n# ssh — доступ к SSH (если настроено)\n\n# Применить изменения группы без перелогина:\nnewgrp docker\n# или перелогиниться' },
        { type: 'tip', value: 'После добавления пользователя в группу, изменения вступят в силу при следующем входе. Для немедленного применения используйте newgrp <group> или перелогиньтесь.' }
      ]
    },
    {
      id: 4,
      title: 'sudo и su',
      type: 'theory',
      content: [
        { type: 'text', value: 'sudo позволяет выполнять команды от имени root (или другого пользователя) без входа как root. su переключает пользователя. Файл /etc/sudoers определяет кто и что может делать через sudo.' },
        { type: 'code', language: 'bash', value: '# sudo — выполнить команду от root:\nsudo apt update\nsudo systemctl restart nginx\nsudo vim /etc/ssh/sshd_config\n\n# sudo — от другого пользователя:\nsudo -u www-data ls /var/www/\nsudo -u postgres psql\n\n# su — переключиться на другого пользователя:\nsu - john            # как john (с загрузкой профиля)\nsu john              # как john (без загрузки профиля)\nsu -                 # как root (нужен пароль root)\nsudo su -            # как root через sudo (без пароля root)\n\n# Важные опции sudo:\nsudo -i              # интерактивная root-сессия\nsudo -s              # root shell (сохраняет текущий каталог)\nsudo -l              # показать что разрешено текущему пользователю\nsudo -k              # сбросить кэш sudo (забыть пароль)' },
        { type: 'heading', value: 'Настройка /etc/sudoers' },
        { type: 'code', language: 'bash', value: '# ВСЕГДА редактируйте через visudo (проверяет синтаксис):\nsudo visudo\n\n# Формат: user host=(runas) commands\n# Примеры:\nroot    ALL=(ALL:ALL) ALL\n# root может всё, от всех пользователей, на всех хостах\n\n%sudo   ALL=(ALL:ALL) ALL\n# группа sudo может всё\n\njohn    ALL=(ALL) NOPASSWD: ALL\n# john может всё без пароля (опасно!)\n\ndeploy  ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx, /usr/bin/systemctl reload nginx\n# deploy может только перезапускать nginx, без пароля\n\n# Включить файлы из каталога:\n# @includedir /etc/sudoers.d\n# Создать файл для конкретного пользователя:\nsudo visudo -f /etc/sudoers.d/deploy' },
        { type: 'note', value: 'НИКОГДА не редактируйте /etc/sudoers напрямую через vim/nano. Используйте только visudo — он проверяет синтаксис перед сохранением. Ошибка в sudoers может заблокировать sudo полностью.' }
      ]
    },
    {
      id: 5,
      title: 'Файл /etc/shadow и политики паролей',
      type: 'theory',
      content: [
        { type: 'text', value: '/etc/shadow хранит хеши паролей и параметры устаревания. Доступен только root. Политики паролей контролируют сложность, срок действия и историю паролей.' },
        { type: 'code', language: 'bash', value: '# /etc/shadow — формат:\n# user:hash:lastchg:min:max:warn:inactive:expire:reserved\nsudo cat /etc/shadow\n# root:$6$abc...:19200:0:99999:7:::\n# user:$6$xyz...:19350:0:90:7:30::\n\n# Поля:\n# user      — имя пользователя\n# hash      — хеш пароля ($6$ = SHA-512)\n# lastchg   — дата последней смены (дни от 1 Jan 1970)\n# min       — минимум дней до смены пароля\n# max       — максимум дней действия пароля\n# warn      — предупреждение за N дней до истечения\n# inactive  — дней после истечения до блокировки\n# expire    — дата блокировки аккаунта\n\n# Управление устареванием паролей:\nsudo chage -l user           # показать политику\nsudo chage -M 90 user        # пароль действует 90 дней\nsudo chage -m 7 user         # нельзя менять чаще раз в 7 дней\nsudo chage -W 14 user        # предупреждение за 14 дней\nsudo chage -E 2026-12-31 user  # аккаунт истечёт 31 декабря 2026\nsudo chage -d 0 user         # заставить сменить пароль при входе' },
        { type: 'heading', value: 'Политика сложности паролей' },
        { type: 'code', language: 'bash', value: '# Установка PAM модуля для проверки сложности:\nsudo apt install libpam-pwquality\n\n# Настройка: /etc/security/pwquality.conf\nsudo vim /etc/security/pwquality.conf\n# minlen = 12          # минимальная длина\n# dcredit = -1         # минимум 1 цифра\n# ucredit = -1         # минимум 1 заглавная буква\n# lcredit = -1         # минимум 1 строчная буква\n# ocredit = -1         # минимум 1 спецсимвол\n# maxrepeat = 3        # максимум 3 повторяющихся символа\n# reject_username      # пароль не должен содержать имя\n\n# Проверить стойкость пароля:\necho "password123" | cracklib-check\n# password123: it is based on a dictionary word' },
        { type: 'tip', value: 'В продакшене: минимальная длина пароля 12+, срок действия 90 дней, история 5 паролей. Ещё лучше — SSH-ключи вместо паролей + двухфакторная аутентификация.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Управление пользователями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте пользователей, группы и настройте права sudo.',
      requirements: [
        'Создайте группу developers',
        'Создайте пользователей alice и bob с оболочкой bash и домашними каталогами',
        'Добавьте обоих в группу developers',
        'Настройте sudo для alice: полный доступ, для bob: только перезапуск nginx',
        'Установите для bob срок действия пароля 90 дней',
        'Проверьте настройки: id alice, id bob, sudo -l -U alice, sudo -l -U bob'
      ],
      hint: 'sudo groupadd developers. sudo useradd -m -s /bin/bash alice. sudo usermod -aG developers alice. Используйте visudo -f /etc/sudoers.d/custom для sudo-правил.',
      expectedOutput: 'id alice: uid=1001(alice) gid=1001(alice) groups=1001(alice),1002(developers)\nid bob: uid=1002(bob) gid=1003(bob) groups=1003(bob),1002(developers)\nsudo -l -U alice: (ALL : ALL) ALL\nsudo -l -U bob: NOPASSWD: /usr/bin/systemctl restart nginx\nchage -l bob: Maximum number of days between password change: 90',
      solution: '# 1. Создать группу\nsudo groupadd developers\n\n# 2. Создать пользователей\nsudo useradd -m -s /bin/bash -c "Alice Smith" alice\nsudo useradd -m -s /bin/bash -c "Bob Jones" bob\nsudo passwd alice\nsudo passwd bob\n\n# 3. Добавить в группу\nsudo usermod -aG developers alice\nsudo usermod -aG developers bob\n\n# 4. Настроить sudo\nsudo visudo -f /etc/sudoers.d/alice\n# alice ALL=(ALL:ALL) ALL\n\nsudo visudo -f /etc/sudoers.d/bob\n# bob ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx\n\n# 5. Политика паролей для bob\nsudo chage -M 90 bob\nsudo chage -W 14 bob\n\n# 6. Проверка\nid alice\nid bob\ngroups alice\ngroups bob\nsudo -l -U alice\nsudo -l -U bob\nsudo chage -l bob',
      explanation: 'useradd -m создаёт домашний каталог. usermod -aG добавляет в группу (без -a группы заменяются!). visudo -f позволяет создавать отдельные файлы в /etc/sudoers.d/ для каждого пользователя. chage -M устанавливает максимальный срок действия пароля.'
    }
  ]
}
