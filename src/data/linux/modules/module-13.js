export default {
  id: 13,
  title: 'SSH',
  description: 'Протокол SSH: ключи, конфигурация, туннели, port forwarding, безопасная передача файлов.',
  lessons: [
    {
      id: 1,
      title: 'Основы SSH и подключение',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSH (Secure Shell) — протокол для безопасного удалённого доступа к серверам. Шифрует весь трафик между клиентом и сервером. Стандартный порт — 22. SSH — основной инструмент администрирования Linux серверов.' },
        { type: 'code', language: 'bash', value: '# Подключение к серверу:\nssh user@192.168.1.100\nssh user@hostname\nssh -p 2222 user@host           # нестандартный порт\n\n# Выполнить команду и выйти:\nssh user@host "uptime"\nssh user@host "df -h && free -h"\n\n# SSH сервер (sshd):\nsudo systemctl status sshd\nsudo systemctl enable --now sshd\n\n# Конфигурация сервера: /etc/ssh/sshd_config\nsudo vim /etc/ssh/sshd_config\n# Port 22                    — порт\n# PermitRootLogin no         — запретить вход root\n# PasswordAuthentication yes — аутентификация по паролю\n# PubkeyAuthentication yes   — аутентификация по ключу\n# MaxAuthTries 3             — максимум попыток\n# ClientAliveInterval 300    — пинг клиента каждые 5 минут\n# ClientAliveCountMax 2      — отключить после 2 пропусков\n\n# После изменения конфига:\nsudo systemctl reload sshd\n# Или:\nsudo sshd -t  # проверить синтаксис\nsudo systemctl restart sshd' },
        { type: 'tip', value: 'Всегда проверяйте конфиг sshd перед перезагрузкой: sudo sshd -t. Ошибка в конфиге может заблокировать SSH-доступ. Держите запасную SSH-сессию открытой при изменении настроек.' }
      ]
    },
    {
      id: 2,
      title: 'SSH-ключи: генерация и настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSH-ключи — более безопасная альтернатива паролям. Приватный ключ остаётся на клиенте, публичный — размещается на сервере. При подключении происходит криптографическая проверка.' },
        { type: 'code', language: 'bash', value: '# Генерация SSH-ключей:\nssh-keygen -t ed25519 -C "user@workstation"\n# -t ed25519 — алгоритм (самый современный)\n# -C — комментарий (обычно email)\n\n# Альтернатива (RSA):\nssh-keygen -t rsa -b 4096 -C "user@workstation"\n\n# При генерации спросит:\n# Enter file in which to save the key (/home/user/.ssh/id_ed25519): [Enter]\n# Enter passphrase: [пароль для ключа или пустой]\n\n# Созданные файлы:\nls ~/.ssh/\n# id_ed25519      — приватный ключ (НИКОГДА не передавать!)\n# id_ed25519.pub  — публичный ключ (размещается на сервере)\n\n# Скопировать ключ на сервер:\nssh-copy-id user@server\n# Добавляет публичный ключ в ~/.ssh/authorized_keys на сервере\n\n# Или вручную:\ncat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"\n\n# Правильные права:\nchmod 700 ~/.ssh\nchmod 600 ~/.ssh/id_ed25519\nchmod 644 ~/.ssh/id_ed25519.pub\nchmod 600 ~/.ssh/authorized_keys\n\n# Теперь подключение без пароля:\nssh user@server' },
        { type: 'heading', value: 'Отключение парольной аутентификации' },
        { type: 'code', language: 'bash', value: '# После настройки ключей — отключите пароли:\nsudo vim /etc/ssh/sshd_config\n# PasswordAuthentication no\n# PubkeyAuthentication yes\n# PermitRootLogin prohibit-password\n\nsudo systemctl reload sshd\n\n# ssh-agent — менеджер ключей (не вводить passphrase каждый раз):\neval $(ssh-agent -s)\nssh-add ~/.ssh/id_ed25519\nssh-add -l    # список загруженных ключей' },
        { type: 'note', value: 'ed25519 — рекомендуемый алгоритм (быстрый, безопасный, короткие ключи). RSA 4096 — для совместимости со старыми системами. Passphrase на ключе добавляет дополнительный уровень безопасности.' }
      ]
    },
    {
      id: 3,
      title: 'SSH config — удобные подключения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Файл ~/.ssh/config упрощает подключение к серверам. Вместо ssh -p 2222 -i ~/.ssh/id_work user@192.168.1.100 можно написать просто ssh myserver.' },
        { type: 'code', language: 'bash', value: '# ~/.ssh/config\n\n# Продакшн сервер\nHost prod\n    HostName 203.0.113.10\n    User deploy\n    Port 2222\n    IdentityFile ~/.ssh/id_prod\n    ForwardAgent yes\n\n# Стейджинг\nHost staging\n    HostName 203.0.113.20\n    User deploy\n    Port 22\n    IdentityFile ~/.ssh/id_staging\n\n# Через bastion (jump host)\nHost internal-db\n    HostName 10.0.1.50\n    User admin\n    ProxyJump bastion\n\nHost bastion\n    HostName 203.0.113.1\n    User jump\n    Port 22\n\n# Общие настройки для всех хостов\nHost *\n    ServerAliveInterval 60\n    ServerAliveCountMax 3\n    AddKeysToAgent yes\n    IdentitiesOnly yes' },
        { type: 'code', language: 'bash', value: '# Теперь подключение одной командой:\nssh prod            # вместо ssh -p 2222 deploy@203.0.113.10\nssh staging         # вместо ssh deploy@203.0.113.20\nssh internal-db     # через bastion автоматически\n\n# scp тоже использует config:\nscp file.txt prod:/home/deploy/\nscp prod:/var/log/app.log ./\n\n# rsync тоже:\nrsync -avz ./app/ prod:/opt/app/' },
        { type: 'tip', value: 'ProxyJump — подключение через промежуточный сервер (bastion/jump host). SSH автоматически построит туннель через bastion к internal-db. Это стандартная практика для доступа к серверам в приватной сети.' }
      ]
    },
    {
      id: 4,
      title: 'SSH-туннели и port forwarding',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSH-туннели шифруют трафик между портами локальной и удалённой машины. Это позволяет безопасно обращаться к сервисам, которые не доступны извне (базы данных, панели администрирования).' },
        { type: 'code', language: 'bash', value: '# Local port forwarding (-L):\n# Доступ к удалённому порту через локальный\nssh -L 5432:localhost:5432 user@dbserver\n# Теперь localhost:5432 -> dbserver:5432\n# Можно подключиться к удалённому PostgreSQL:\npsql -h localhost -p 5432\n\nssh -L 8080:internal-app:3000 user@bastion\n# localhost:8080 -> bastion -> internal-app:3000\n\n# Remote port forwarding (-R):\n# Открыть локальный порт на удалённой машине\nssh -R 8080:localhost:3000 user@server\n# server:8080 -> ваша машина:3000\n# Полезно для демонстрации локального dev-сервера\n\n# Dynamic port forwarding (SOCKS proxy):\nssh -D 1080 user@server\n# Создаёт SOCKS5 proxy на localhost:1080\n# Весь трафик через proxy пойдёт через server\n\n# Фоновый туннель (без интерактивной сессии):\nssh -fNL 5432:localhost:5432 user@dbserver\n# -f фон, -N без команд\n\n# Постоянный туннель через autossh:\nsudo apt install autossh\nautossh -M 0 -fNL 5432:localhost:5432 user@dbserver\n# Автоматически переподключается при разрыве' },
        { type: 'tip', value: 'SSH-туннель — безопасный способ доступа к базе данных на сервере. Вместо открытия порта 5432 наружу, создайте туннель: ssh -L 5432:localhost:5432 user@dbserver.' }
      ]
    },
    {
      id: 5,
      title: 'Передача файлов: scp и rsync',
      type: 'theory',
      content: [
        { type: 'text', value: 'scp и rsync — инструменты для передачи файлов по SSH. scp — простое копирование. rsync — инкрементальная синхронизация (передаёт только изменения), эффективнее для больших объёмов.' },
        { type: 'code', language: 'bash', value: '# scp — безопасное копирование:\nscp file.txt user@server:/home/user/        # на сервер\nscp user@server:/var/log/app.log ./         # с сервера\nscp -r mydir/ user@server:/opt/             # каталог (рекурсивно)\nscp -P 2222 file.txt user@server:/tmp/      # нестандартный порт\n\n# rsync — синхронизация (лучше scp для больших объёмов):\nrsync -avz ./app/ user@server:/opt/app/\n# -a archive (рекурсивно, права, время)\n# -v verbose\n# -z сжатие при передаче\n\nrsync -avz --delete ./app/ user@server:/opt/app/\n# --delete удалить на dest файлы, которых нет в source\n\nrsync -avz --exclude=".git" --exclude="node_modules" \\\n    ./project/ user@server:/opt/project/\n\n# Полезные опции rsync:\n# --dry-run    — показать что будет сделано (без выполнения)\n# --progress   — показать прогресс\n# --bwlimit=1000 — ограничить скорость (KB/s)\n# -e "ssh -p 2222" — нестандартный SSH порт\n\nrsync -avz --dry-run --progress ./data/ server:/backup/\n# Сначала dry-run, потом без него для выполнения' },
        { type: 'tip', value: 'rsync с --delete — мощный инструмент для деплоя. Синхронизирует только изменения, удаляет лишнее на сервере. Но сначала ВСЕГДА используйте --dry-run для проверки!' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка SSH',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте безопасный SSH-доступ к серверу.',
      requirements: [
        'Сгенерируйте SSH-ключ ed25519 с passphrase',
        'Создайте SSH config для двух серверов (prod и staging)',
        'Настройте sshd_config: отключите парольную аутентификацию, запретите root',
        'Создайте SSH-туннель к удалённому порту 5432',
        'Скопируйте каталог на сервер с помощью rsync',
        'Проверьте безопасность: найдите неправильные права на SSH-файлы'
      ],
      hint: 'ssh-keygen -t ed25519 для ключа. Файл ~/.ssh/config для алиасов. В sshd_config: PasswordAuthentication no, PermitRootLogin no. ssh -L для туннеля.',
      expectedOutput: 'ssh-keygen: ключ создан в ~/.ssh/id_ed25519\n~/.ssh/config: Host prod, Host staging настроены\nsshd_config: PasswordAuthentication no, PermitRootLogin no\nSSH-туннель: localhost:5432 -> server:5432\nrsync: файлы синхронизированы\nПроверка прав: .ssh(700), id_ed25519(600), authorized_keys(600)',
      solution: '# 1. Генерация ключа\nssh-keygen -t ed25519 -C "admin@workstation"\n# Ввести passphrase\n\n# 2. SSH config\ncat > ~/.ssh/config << \'EOF\'\nHost prod\n    HostName 203.0.113.10\n    User deploy\n    Port 22\n    IdentityFile ~/.ssh/id_ed25519\n\nHost staging\n    HostName 203.0.113.20\n    User deploy\n    Port 22\n    IdentityFile ~/.ssh/id_ed25519\n\nHost *\n    ServerAliveInterval 60\n    AddKeysToAgent yes\nEOF\nchmod 600 ~/.ssh/config\n\n# 3. Безопасная настройка sshd\nsudo sed -i "s/#PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config\nsudo sed -i "s/#PermitRootLogin.*/PermitRootLogin no/" /etc/ssh/sshd_config\nsudo sshd -t && sudo systemctl reload sshd\n\n# 4. SSH-туннель\nssh -fNL 5432:localhost:5432 prod\n# Проверить: ss -tlnp | grep 5432\n\n# 5. Rsync\nrsync -avz --dry-run ./myapp/ prod:/opt/myapp/\nrsync -avz ./myapp/ prod:/opt/myapp/\n\n# 6. Проверка прав\nls -la ~/.ssh/\n# Должно быть:\n# drwx------ .ssh (700)\n# -rw------- id_ed25519 (600)\n# -rw-r--r-- id_ed25519.pub (644)\n# -rw------- authorized_keys (600)\nfind ~/.ssh -type f ! -perm 600 -a ! -name "*.pub" -a ! -name "config" -a ! -name "known_hosts"',
      explanation: 'ed25519 — самый безопасный и быстрый алгоритм SSH-ключей. SSH config позволяет подключаться по алиасу. PasswordAuthentication no заставляет использовать ключи. ssh -fNL создаёт фоновый туннель. rsync --dry-run показывает что будет сделано.'
    }
  ]
}
