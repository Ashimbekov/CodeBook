export default {
  id: 19,
  title: 'Безопасность Linux',
  description: 'Защита Linux-сервера: firewall, SELinux/AppArmor, fail2ban, аудит безопасности, hardening.',
  lessons: [
    {
      id: 1,
      title: 'Базовая безопасность сервера',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность Linux — многоуровневая задача. Минимальная поверхность атаки, обновления, надёжная аутентификация, firewall, мониторинг — базовые принципы защиты сервера.' },
        { type: 'heading', value: 'Чеклист безопасности сервера' },
        { type: 'code', language: 'bash', value: '# 1. Обновления — КРИТИЧНО:\nsudo apt update && sudo apt upgrade -y\nsudo apt install unattended-upgrades\nsudo dpkg-reconfigure unattended-upgrades\n# Автоматические security-обновления\n\n# 2. SSH — основной вектор атаки:\n# /etc/ssh/sshd_config:\n# PermitRootLogin no\n# PasswordAuthentication no\n# Port 2222              # нестандартный порт\n# MaxAuthTries 3\n# AllowUsers deploy admin\nsudo systemctl reload sshd\n\n# 3. Firewall — закрыть всё лишнее:\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 2222/tcp    # SSH\nsudo ufw allow 80/tcp      # HTTP\nsudo ufw allow 443/tcp     # HTTPS\nsudo ufw enable\n\n# 4. Минимум сервисов:\nsystemctl list-units --type=service --state=running\n# Отключить ненужные:\nsudo systemctl disable --now cups\nsudo systemctl disable --now avahi-daemon\n\n# 5. Удалить ненужные пакеты:\nsudo apt autoremove\nsudo apt purge telnet rsh-client' },
        { type: 'tip', value: 'Автоматические security-обновления (unattended-upgrades) — обязательны для всех серверов. Уязвимости обнаруживаются постоянно, и незакрытая дыра = скомпрометированный сервер.' }
      ]
    },
    {
      id: 2,
      title: 'fail2ban — защита от brute-force',
      type: 'theory',
      content: [
        { type: 'text', value: 'fail2ban мониторит лог-файлы и блокирует IP-адреса после нескольких неудачных попыток аутентификации. Защищает SSH, Nginx, почту и другие сервисы от brute-force атак.' },
        { type: 'code', language: 'bash', value: '# Установка:\nsudo apt install fail2ban\nsudo systemctl enable --now fail2ban\n\n# Конфигурация — не редактируйте jail.conf!\n# Создайте jail.local:\nsudo vim /etc/fail2ban/jail.local' },
        { type: 'code', language: 'text', value: '[DEFAULT]\nbantime = 3600        # блокировка на 1 час\nfindtime = 600        # окно наблюдения 10 минут\nmaxretry = 5          # максимум попыток\nbanaction = ufw       # использовать UFW\n\n[sshd]\nenabled = true\nport = 2222           # ваш SSH порт\nmaxretry = 3          # 3 попытки для SSH\nbantime = 86400       # 24 часа блокировки\n\n[nginx-http-auth]\nenabled = true\n\n[nginx-limit-req]\nenabled = true' },
        { type: 'code', language: 'bash', value: '# Управление fail2ban:\nsudo systemctl restart fail2ban\n\n# Статус:\nsudo fail2ban-client status\nsudo fail2ban-client status sshd\n# Status for the jail: sshd\n# |- Filter\n# |  |- Currently failed: 3\n# |  |- Total failed:     247\n# |  `- File list:        /var/log/auth.log\n# `- Actions\n#    |- Currently banned: 5\n#    |- Total banned:     42\n#    `- Banned IP list:   10.0.0.5 10.0.0.8 ...\n\n# Разблокировать IP:\nsudo fail2ban-client set sshd unbanip 10.0.0.5\n\n# Заблокировать вручную:\nsudo fail2ban-client set sshd banip 10.0.0.99' },
        { type: 'tip', value: 'fail2ban — must-have для любого сервера с SSH. Без него вы будете видеть тысячи попыток brute-force в auth.log каждый день. maxretry=3 и bantime=86400 — строгие но эффективные настройки.' }
      ]
    },
    {
      id: 3,
      title: 'AppArmor — мандатный контроль доступа',
      type: 'theory',
      content: [
        { type: 'text', value: 'AppArmor ограничивает возможности программ: какие файлы может читать/писать, какие сетевые операции выполнять. Даже если приложение взломано — AppArmor ограничит ущерб. Включён по умолчанию в Ubuntu.' },
        { type: 'code', language: 'bash', value: '# Проверить статус AppArmor:\nsudo aa-status\n# apparmor module is loaded.\n# 35 profiles are loaded.\n# 25 profiles are in enforce mode.\n#    /usr/sbin/nginx\n#    /usr/sbin/mysqld\n#    ...\n\n# Режимы профилей:\n# enforce  — блокирует запрещённые действия\n# complain — только логирует (для тестирования)\n# disabled — отключён\n\n# Переключение режимов:\nsudo aa-enforce /etc/apparmor.d/usr.sbin.nginx\nsudo aa-complain /etc/apparmor.d/usr.sbin.nginx\nsudo aa-disable /etc/apparmor.d/usr.sbin.nginx\n\n# Логи AppArmor:\nsudo dmesg | grep apparmor\njournalctl -k | grep apparmor\n\n# Создание профиля (автоматически):\nsudo apt install apparmor-utils\nsudo aa-genprof /usr/local/bin/myapp\n# Запустите приложение в другом терминале\n# aa-genprof предложит правила на основе активности\n\n# Перезагрузить профили:\nsudo systemctl reload apparmor' },
        { type: 'note', value: 'AppArmor (Ubuntu/Debian) и SELinux (RHEL/CentOS) — системы мандатного контроля доступа (MAC). Они ограничивают процессы сверх стандартных прав Linux. Не отключайте их на production!' }
      ]
    },
    {
      id: 4,
      title: 'Аудит безопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Аудит позволяет отслеживать кто, когда и что делал в системе. auditd записывает события: доступ к файлам, выполнение команд, изменения конфигурации. Lynis — инструмент проверки безопасности.' },
        { type: 'code', language: 'bash', value: '# auditd — система аудита:\nsudo apt install auditd\nsudo systemctl enable --now auditd\n\n# Добавить правило аудита:\n# Отслеживать изменения /etc/passwd:\nsudo auditctl -w /etc/passwd -p wa -k passwd_changes\n# -w файл, -p wa (write+attribute), -k метка\n\n# Отслеживать выполнение su/sudo:\nsudo auditctl -w /usr/bin/su -p x -k su_usage\nsudo auditctl -w /usr/bin/sudo -p x -k sudo_usage\n\n# Отслеживать изменения конфигов:\nsudo auditctl -w /etc/ssh/sshd_config -p wa -k ssh_config\n\n# Поиск в логах аудита:\nsudo ausearch -k passwd_changes\nsudo ausearch -k sudo_usage --start today\nsudo aureport --summary\nsudo aureport --auth           # аутентификация\nsudo aureport --login           # входы\n\n# Постоянные правила: /etc/audit/rules.d/audit.rules' },
        { type: 'heading', value: 'Lynis — проверка безопасности' },
        { type: 'code', language: 'bash', value: '# Установка Lynis:\nsudo apt install lynis\n\n# Полная проверка системы:\nsudo lynis audit system\n\n# Результат:\n# [+] Boot and services\n# [+] Kernel\n# [+] Memory and Processes\n# [+] Users, Groups and Authentication\n# [+] Shells\n# [+] File systems\n# [+] Storage\n# [+] NFS\n# [+] Software: name services\n# [+] Networking\n# [+] SSH Support\n# [+] Logging and files\n# [+] Insecure services\n# [+] Firewalls\n# ...\n# Hardening index : 72 [##############      ]\n# Tests performed : 256\n# Suggestions     : 32\n\n# Просмотр предложений:\ngrep "suggestion" /var/log/lynis.log' },
        { type: 'tip', value: 'Запускайте lynis audit system регулярно (раз в месяц) и исправляйте предложения. Hardening index > 80 — хороший показатель. Ниже 60 — сервер плохо защищён.' }
      ]
    },
    {
      id: 5,
      title: 'Шифрование и сертификаты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Шифрование защищает данные при хранении (encryption at rest) и передаче (encryption in transit). LUKS для дисков, GPG для файлов, SSL/TLS для сетевого трафика.' },
        { type: 'code', language: 'bash', value: '# LUKS — шифрование диска:\nsudo apt install cryptsetup\nsudo cryptsetup luksFormat /dev/sdb1\nsudo cryptsetup luksOpen /dev/sdb1 encrypted-data\nsudo mkfs.ext4 /dev/mapper/encrypted-data\nsudo mount /dev/mapper/encrypted-data /mnt/secure\n\n# Закрыть:\nsudo umount /mnt/secure\nsudo cryptsetup luksClose encrypted-data\n\n# GPG — шифрование файлов:\ngpg --symmetric --cipher-algo AES256 secret.txt\n# Создаст secret.txt.gpg (зашифрованный)\n\ngpg --decrypt secret.txt.gpg > secret.txt\n# Расшифровать\n\n# Проверка SSL-сертификата сервера:\nopenssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -dates\n# notBefore=Jan  1 00:00:00 2026 GMT\n# notAfter=Apr  1 00:00:00 2026 GMT\n\n# Генерация самоподписанного сертификата (для тестирования):\nopenssl req -x509 -nodes -days 365 -newkey rsa:2048 \\\n    -keyout /etc/ssl/private/self.key \\\n    -out /etc/ssl/certs/self.crt' },
        { type: 'note', value: 'LUKS обязателен для серверов с чувствительными данными. Без шифрования диска — физический доступ к серверу = доступ ко всем данным. В облаке используйте шифрование EBS/диска провайдера.' }
      ]
    },
    {
      id: 6,
      title: 'Hardening: практические советы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Server hardening — процесс укрепления безопасности сервера. Включает отключение лишнего, ограничение прав, настройку аудита, защиту сети.' },
        { type: 'code', language: 'bash', value: '# 1. Параметры ядра (sysctl):\nsudo vim /etc/sysctl.d/99-security.conf\n# Защита от IP spoofing:\n# net.ipv4.conf.all.rp_filter = 1\n# Отключить ICMP redirect:\n# net.ipv4.conf.all.accept_redirects = 0\n# Защита от SYN flood:\n# net.ipv4.tcp_syncookies = 1\n# Отключить IPv6 (если не используется):\n# net.ipv6.conf.all.disable_ipv6 = 1\nsudo sysctl -p /etc/sysctl.d/99-security.conf\n\n# 2. Ограничить su:\nsudo dpkg-statoverride --update --add root adm 4750 /bin/su\n\n# 3. Настроить баннер:\nsudo vim /etc/issue.net\n# Authorized access only. All activity is monitored.\n\n# 4. Отключить USB (если не нужен):\necho "blacklist usb-storage" | sudo tee /etc/modprobe.d/disable-usb.conf\n\n# 5. Проверить SUID файлы:\nfind / -perm -u+s -type f 2>/dev/null\n# Убрать SUID где не нужен:\nsudo chmod u-s /usr/bin/unnecessary-suid-binary\n\n# 6. Настроить лимиты (/etc/security/limits.conf):\n# * hard core 0              # отключить core dumps\n# * hard maxlogins 10        # максимум сессий' },
        { type: 'tip', value: 'Безопасность — это процесс, а не одноразовое действие. Регулярно обновляйте систему, проверяйте Lynis, мониторьте логи, ревьюте правила firewall. Автоматизируйте проверки через cron.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Защита сервера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Выполните базовый hardening Linux-сервера.',
      requirements: [
        'Настройте автоматические security-обновления',
        'Установите и настройте fail2ban для SSH',
        'Настройте UFW: разрешите только SSH, HTTP, HTTPS',
        'Проверьте статус AppArmor',
        'Запустите Lynis audit и посмотрите оценку безопасности',
        'Найдите все SUID-файлы в системе',
        'Настройте аудит изменений /etc/shadow и /etc/ssh/'
      ],
      hint: 'sudo apt install unattended-upgrades fail2ban lynis auditd. fail2ban конфиг в /etc/fail2ban/jail.local. sudo lynis audit system для проверки.',
      expectedOutput: 'unattended-upgrades: включено\nfail2ban: sshd jail active, 0 banned\nUFW: Status active, 22/80/443 ALLOW\nAppArmor: loaded, N profiles in enforce mode\nLynis: Hardening index: 72+\nSUID: /usr/bin/passwd, /usr/bin/sudo ...\nauditd: правила для /etc/shadow и /etc/ssh/ добавлены',
      solution: '# 1. Автообновления\nsudo apt install -y unattended-upgrades\nsudo dpkg-reconfigure -plow unattended-upgrades\n\n# 2. fail2ban\nsudo apt install -y fail2ban\nsudo tee /etc/fail2ban/jail.local << \'EOF\'\n[DEFAULT]\nbantime = 3600\nmaxretry = 5\n\n[sshd]\nenabled = true\nmaxretry = 3\nbantime = 86400\nEOF\nsudo systemctl enable --now fail2ban\nsudo fail2ban-client status sshd\n\n# 3. UFW\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow ssh\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw --force enable\nsudo ufw status verbose\n\n# 4. AppArmor\nsudo aa-status\n\n# 5. Lynis\nsudo apt install -y lynis\nsudo lynis audit system --quick\n\n# 6. SUID файлы\nfind / -perm -u+s -type f 2>/dev/null\n\n# 7. Аудит\nsudo apt install -y auditd\nsudo auditctl -w /etc/shadow -p wa -k shadow_changes\nsudo auditctl -w /etc/ssh/ -p wa -k ssh_config_changes\nsudo ausearch -k shadow_changes',
      explanation: 'unattended-upgrades автоматически устанавливает security-патчи. fail2ban блокирует IP после 3 неудачных попыток SSH на 24 часа. UFW с deny incoming закрывает все порты кроме разрешённых. auditd отслеживает изменения критических файлов. Lynis даёт оценку общей безопасности.'
    }
  ]
}
