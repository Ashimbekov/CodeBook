export default {
  id: 8,
  title: 'Управление пакетами',
  description: 'Пакетные менеджеры apt, yum/dnf, pacman. Snap, Flatpak. Компиляция из исходников.',
  lessons: [
    {
      id: 1,
      title: 'apt — пакетный менеджер Debian/Ubuntu',
      type: 'theory',
      content: [
        { type: 'text', value: 'apt (Advanced Package Tool) — основной пакетный менеджер в Debian и Ubuntu. Управляет установкой, обновлением и удалением пакетов (.deb). Автоматически разрешает зависимости.' },
        { type: 'code', language: 'bash', value: '# Обновление списка пакетов (ВСЕГДА перед установкой):\nsudo apt update\n\n# Обновить все пакеты:\nsudo apt upgrade              # безопасное обновление\nsudo apt full-upgrade         # с удалением/установкой зависимостей\n\n# Установка:\nsudo apt install nginx\nsudo apt install nginx curl vim  # несколько пакетов\nsudo apt install -y nginx        # без подтверждения\n\n# Удаление:\nsudo apt remove nginx            # удалить (оставить конфиги)\nsudo apt purge nginx             # удалить с конфигами\nsudo apt autoremove              # удалить неиспользуемые зависимости\n\n# Поиск:\napt search nginx                 # найти пакет\napt show nginx                   # информация о пакете\napt list --installed             # установленные пакеты\napt list --upgradable            # доступные обновления\n\n# Кэш:\nsudo apt clean                   # очистить кэш пакетов\nsudo apt autoclean               # удалить старые версии из кэша\ndu -sh /var/cache/apt/archives/  # размер кэша' },
        { type: 'tip', value: 'Всегда запускайте sudo apt update перед sudo apt install — иначе apt может не найти новые пакеты или установить устаревшую версию.' }
      ]
    },
    {
      id: 2,
      title: 'yum/dnf — пакетный менеджер RHEL/CentOS',
      type: 'theory',
      content: [
        { type: 'text', value: 'dnf (Dandified YUM) — пакетный менеджер в RHEL 8+, CentOS Stream, Fedora, AlmaLinux. Пришёл на замену yum. Работает с пакетами .rpm.' },
        { type: 'code', language: 'bash', value: '# dnf (RHEL 8+, Fedora, AlmaLinux):\nsudo dnf update                   # обновить все пакеты\nsudo dnf install nginx            # установить\nsudo dnf remove nginx             # удалить\nsudo dnf search nginx             # поиск\nsudo dnf info nginx               # информация\nsudo dnf list installed            # установленные пакеты\nsudo dnf autoremove                # убрать ненужные зависимости\nsudo dnf clean all                 # очистить кэш\n\n# Группы пакетов:\nsudo dnf group list\nsudo dnf group install "Development Tools"\n\n# yum (RHEL 7, CentOS 7) — синтаксис идентичен dnf:\nsudo yum install nginx\nsudo yum update\nsudo yum remove nginx\n\n# Репозитории:\nsudo dnf repolist                  # список репозиториев\nsudo dnf config-manager --add-repo URL\nsudo dnf config-manager --set-enabled repo-name' },
        { type: 'heading', value: 'Сравнение apt и dnf' },
        { type: 'code', language: 'bash', value: '# Действие           | apt (Debian/Ubuntu)      | dnf (RHEL/Fedora)\n# ==================|========================|===================\n# Обновить список    | apt update              | dnf check-update\n# Обновить пакеты    | apt upgrade             | dnf update\n# Установить         | apt install pkg         | dnf install pkg\n# Удалить            | apt remove pkg          | dnf remove pkg\n# Поиск              | apt search name         | dnf search name\n# Информация         | apt show pkg            | dnf info pkg\n# Установленные      | apt list --installed    | dnf list installed\n# Очистить кэш       | apt clean               | dnf clean all\n# Формат пакетов     | .deb                    | .rpm' },
        { type: 'note', value: 'В современных системах RHEL/CentOS используйте dnf. yum — устаревший менеджер для RHEL/CentOS 7. В новых версиях yum — это символическая ссылка на dnf.' }
      ]
    },
    {
      id: 3,
      title: 'Snap и Flatpak',
      type: 'theory',
      content: [
        { type: 'text', value: 'Snap (Canonical) и Flatpak — универсальные пакетные менеджеры, работающие на любом дистрибутиве. Пакеты содержат все зависимости внутри себя. Snap больше для серверов, Flatpak — для десктопа.' },
        { type: 'code', language: 'bash', value: '# Snap (Canonical, встроен в Ubuntu):\nsudo apt install snapd           # если не установлен\nsnap find nginx                  # поиск\nsudo snap install lxd             # установить\nsudo snap install --classic code  # VS Code (классический режим)\nsnap list                         # установленные снапы\nsudo snap refresh                 # обновить все\nsudo snap remove lxd              # удалить\n\n# Преимущества Snap:\n# - Автообновления\n# - Изолированность (sandbox)\n# - Одинаковый пакет на всех дистрибутивах\n# - Snap store (snapcraft.io)\n\n# Flatpak (для десктопных приложений):\nsudo apt install flatpak\nflatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo\nflatpak search firefox\nflatpak install flathub org.mozilla.Firefox\nflatpak list\nflatpak update\nflatpak uninstall org.mozilla.Firefox' },
        { type: 'tip', value: 'Для серверов предпочитайте нативные пакеты (apt/dnf) — они лучше интегрированы с системой. Snap хорош для изолированных приложений. Flatpak — для десктопных программ.' }
      ]
    },
    {
      id: 4,
      title: 'Репозитории и PPA',
      type: 'theory',
      content: [
        { type: 'text', value: 'Репозиторий — сервер с пакетами. Иногда нужная версия ПО отсутствует в стандартных репозиториях. В таком случае добавляют сторонние репозитории или PPA (Personal Package Archive).' },
        { type: 'code', language: 'bash', value: '# Список репозиториев:\ncat /etc/apt/sources.list\nls /etc/apt/sources.list.d/\n\n# Добавить PPA (Ubuntu):\nsudo add-apt-repository ppa:ondrej/php\nsudo apt update\nsudo apt install php8.3\n\n# Добавить репозиторий вручную:\n# Пример — Docker:\n# 1. Добавить GPG ключ:\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg\n\n# 2. Добавить репозиторий:\necho "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null\n\n# 3. Установить:\nsudo apt update\nsudo apt install docker-ce\n\n# Удалить PPA:\nsudo add-apt-repository --remove ppa:ondrej/php\n\n# Приоритеты пакетов (pinning):\ncat /etc/apt/preferences.d/custom\n# Package: nginx\n# Pin: origin nginx.org\n# Pin-Priority: 900' },
        { type: 'note', value: 'Будьте осторожны со сторонними репозиториями — они могут содержать вредоносные или нестабильные пакеты. Используйте только доверенные источники. Всегда проверяйте GPG-ключи.' }
      ]
    },
    {
      id: 5,
      title: 'Компиляция из исходников',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно установить ПО из исходников — когда нужна конкретная версия, нестандартные опции компиляции или пакета нет в репозиториях. Стандартный процесс: configure, make, make install.' },
        { type: 'code', language: 'bash', value: '# Установить инструменты для компиляции:\nsudo apt install build-essential    # gcc, make, etc.\n# На RHEL:\n# sudo dnf group install "Development Tools"\n\n# Стандартный процесс сборки:\n# 1. Скачать исходники:\nwget https://example.com/app-1.0.tar.gz\ntar -xzvf app-1.0.tar.gz\ncd app-1.0\n\n# 2. Настроить (проверить зависимости):\n./configure --prefix=/usr/local\n# --prefix определяет куда установить\n# Может потребовать доп. библиотеки:\n# sudo apt install libssl-dev libpcre3-dev zlib1g-dev\n\n# 3. Скомпилировать:\nmake\nmake -j$(nproc)    # параллельная сборка (все ядра CPU)\n\n# 4. Установить:\nsudo make install\n\n# 5. Проверить:\napp --version' },
        { type: 'heading', value: 'checkinstall — лучше чем make install' },
        { type: 'code', language: 'bash', value: '# checkinstall создаёт .deb пакет вместо make install\n# Преимущество: можно потом удалить через apt!\nsudo apt install checkinstall\n\n./configure --prefix=/usr/local\nmake -j$(nproc)\nsudo checkinstall\n# Создаст .deb пакет и установит его\n\n# Потом можно удалить:\nsudo dpkg -r app-name\n\n# Пример: компиляция Nginx с модулями:\nwget https://nginx.org/download/nginx-1.26.0.tar.gz\ntar -xzvf nginx-1.26.0.tar.gz\ncd nginx-1.26.0\n\n./configure \\\n  --prefix=/etc/nginx \\\n  --sbin-path=/usr/sbin/nginx \\\n  --with-http_ssl_module \\\n  --with-http_v2_module \\\n  --with-http_gzip_static_module\n\nmake -j$(nproc)\nsudo make install' },
        { type: 'tip', value: 'Предпочитайте пакеты из репозиториев — они обновляются автоматически. Компиляцию из исходников используйте только когда это действительно необходимо (нестандартные модули, конкретная версия).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Управление пакетами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Установите, обновите и удалите пакеты разными способами.',
      requirements: [
        'Обновите список пакетов и посмотрите сколько пакетов можно обновить',
        'Установите htop, tree и curl если они ещё не установлены',
        'Найдите какой пакет предоставляет файл /usr/bin/dig',
        'Покажите информацию о пакете nginx (не устанавливая)',
        'Выведите список всех установленных пакетов и посчитайте их количество',
        'Очистите кэш пакетов и покажите сколько места освободилось'
      ],
      hint: 'apt list --upgradable покажет доступные обновления. dpkg -S /usr/bin/dig найдёт пакет по файлу. apt show nginx покажет информацию. apt list --installed | wc -l посчитает пакеты.',
      expectedOutput: 'apt update: Hit/Get, 45 packages can be upgraded\napt install htop tree curl: установлены или уже установлены\ndpkg -S /usr/bin/dig: dnsutils: /usr/bin/dig\napt show nginx: Version, Description, Dependencies\napt list --installed | wc -l: ~500 пакетов\napt clean: кэш очищен, освобождено место',
      solution: '# 1. Обновить список и проверить обновления\nsudo apt update\napt list --upgradable\napt list --upgradable | wc -l\n\n# 2. Установить пакеты\nsudo apt install -y htop tree curl\n\n# 3. Найти пакет по файлу\ndpkg -S /usr/bin/dig\n# dnsutils: /usr/bin/dig\n# или:\napt-file search /usr/bin/dig\n\n# 4. Информация о пакете\napt show nginx\n\n# 5. Список установленных\napt list --installed | wc -l\n# или\ndpkg -l | grep "^ii" | wc -l\n\n# 6. Очистить кэш\ndu -sh /var/cache/apt/archives/\nsudo apt clean\ndu -sh /var/cache/apt/archives/',
      explanation: 'apt update загружает индексы пакетов из репозиториев. dpkg -S ищет какому пакету принадлежит файл. apt show выводит метаданные пакета без установки. apt clean удаляет скачанные .deb файлы из кэша.'
    }
  ]
}
