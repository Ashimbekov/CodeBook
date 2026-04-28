export default {
  id: 1,
  title: 'Введение в Linux',
  description: 'История Linux, основные дистрибутивы, установка системы, первое знакомство с терминалом и базовыми командами.',
  lessons: [
    {
      id: 1,
      title: 'История Linux и философия Open Source',
      type: 'theory',
      content: [
        { type: 'text', value: 'Linux — семейство операционных систем на базе ядра Linux, созданного Линусом Торвальдсом в 1991 году. Ядро Linux — это лишь центральная часть ОС, а полноценную систему образует комбинация ядра с утилитами GNU (поэтому корректное название — GNU/Linux). Linux следует философии Unix: "Делай одну вещь, но делай её хорошо".' },
        { type: 'heading', value: 'Ключевые вехи' },
        { type: 'list', value: [
          '1969 — создание Unix в Bell Labs (Ken Thompson, Dennis Ritchie)',
          '1983 — Ричард Столлман запускает проект GNU и движение свободного ПО',
          '1991 — Линус Торвальдс публикует первую версию ядра Linux (0.01)',
          '1993 — появление Debian и Slackware — первых крупных дистрибутивов',
          '2004 — Ubuntu делает Linux доступным для обычных пользователей',
          'Сегодня — Linux работает на 96%+ серверов в интернете, на Android, суперкомпьютерах и IoT'
        ] },
        { type: 'heading', value: 'Философия Unix/Linux' },
        { type: 'list', value: [
          'Каждая программа делает одну вещь хорошо',
          'Программы могут работать вместе (pipes, перенаправление)',
          'Текст — универсальный интерфейс между программами',
          'Всё является файлом (файлы, устройства, процессы)',
          'Открытый исходный код — каждый может изучить и улучшить систему'
        ] },
        { type: 'tip', value: 'Linux — самый востребованный навык для DevOps, SRE, backend-разработчиков и системных администраторов. Более 90% облачных серверов (AWS, GCP, Azure) работают на Linux.' }
      ]
    },
    {
      id: 2,
      title: 'Дистрибутивы Linux',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дистрибутив Linux — это ядро Linux + набор программ + пакетный менеджер + конфигурация. Существуют сотни дистрибутивов, но все они построены на нескольких основных семействах.' },
        { type: 'heading', value: 'Основные семейства' },
        { type: 'code', language: 'text', value: 'Debian-семейство (пакетный менеджер: apt, формат: .deb)\n├── Debian        — стабильный, консервативный, для серверов\n├── Ubuntu        — на базе Debian, дружелюбный, популярный\n│   ├── Ubuntu Server   — для серверов (без GUI)\n│   ├── Ubuntu Desktop  — с графическим интерфейсом\n│   └── Kubuntu, Xubuntu — с другими DE\n└── Linux Mint    — на базе Ubuntu, для десктопа\n\nRed Hat-семейство (пакетный менеджер: yum/dnf, формат: .rpm)\n├── RHEL          — коммерческий, корпоративный, с поддержкой\n├── CentOS Stream — бесплатная база для RHEL\n├── AlmaLinux     — бесплатная замена CentOS\n├── Rocky Linux   — бесплатная замена CentOS\n└── Fedora        — передовой, тестовая площадка для RHEL\n\nДругие семейства\n├── Arch Linux    — rolling release, минимализм, для опытных\n│   └── Manjaro   — Arch с удобной установкой\n├── openSUSE      — корпоративный, YaST для администрирования\n└── Alpine Linux  — минимальный (5 MB), для контейнеров Docker' },
        { type: 'heading', value: 'Какой дистрибутив выбрать?' },
        { type: 'list', value: [
          'Серверы в продакшене: Ubuntu Server, Debian, RHEL/AlmaLinux',
          'Обучение и разработка: Ubuntu Desktop, Fedora',
          'Docker-контейнеры: Alpine Linux (минимальный размер)',
          'Корпоративная среда: RHEL (платная поддержка Red Hat)',
          'Максимальный контроль: Arch Linux (собираешь систему сам)'
        ] },
        { type: 'note', value: 'В этом курсе примеры будут в основном на Ubuntu/Debian, так как это самые популярные серверные дистрибутивы. Команды для RHEL/CentOS будут даны параллельно где это важно.' }
      ]
    },
    {
      id: 3,
      title: 'Установка Linux и способы работы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько способов начать работу с Linux: установка на физическую машину, виртуальная машина, WSL на Windows, облачный сервер или Docker-контейнер. Для обучения рекомендуется виртуальная машина или WSL.' },
        { type: 'heading', value: 'Способы запуска Linux' },
        { type: 'code', language: 'bash', value: '# 1. Виртуальная машина (VirtualBox / VMware)\n# Скачать ISO: https://ubuntu.com/download/server\n# Создать VM: 2 CPU, 2GB RAM, 20GB диск\n# Установить с ISO, перезагрузить\n\n# 2. WSL (Windows Subsystem for Linux) — для Windows 10/11\nwsl --install              # Установить WSL с Ubuntu\nwsl --list --online        # Доступные дистрибутивы\nwsl --install -d Debian    # Установить конкретный дистрибутив\nwsl                        # Запустить Linux\n\n# 3. Облачный сервер (AWS, DigitalOcean, Hetzner)\n# Создать VPS (Virtual Private Server)\nssh root@203.0.113.10\n\n# 4. Docker контейнер (быстро попробовать)\ndocker run -it ubuntu:22.04 bash\n\n# 5. Dual boot — Linux рядом с Windows\n# Требует разметки диска, более сложная установка' },
        { type: 'heading', value: 'Первый вход в систему' },
        { type: 'code', language: 'bash', value: '# После установки/входа вы увидите приглашение:\n# user@hostname:~$\n#\n# user     — имя пользователя\n# hostname — имя машины\n# ~        — текущий каталог (~ = домашний каталог)\n# $        — обычный пользователь (# = root)\n\nwhoami          # имя текущего пользователя\nhostname        # имя машины\n\ncat /etc/os-release   # информация о дистрибутиве\n# NAME="Ubuntu"\n# VERSION="22.04.3 LTS (Jammy Jellyfish)"\n\nuname -a        # информация о ядре\n# Linux myserver 5.15.0-91-generic x86_64 GNU/Linux' },
        { type: 'tip', value: 'Для обучения идеально подходит WSL2 на Windows или VirtualBox. WSL2 запускается за секунды и интегрирован с Windows. VirtualBox даёт полноценную изолированную систему.' }
      ]
    },
    {
      id: 4,
      title: 'Терминал и базовые команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Терминал (командная строка, CLI) — основной инструмент работы с Linux. В отличие от графического интерфейса, CLI позволяет автоматизировать задачи, работать удалённо и управлять серверами без GUI.' },
        { type: 'heading', value: 'Анатомия команды' },
        { type: 'code', language: 'bash', value: '# Формат команды:\n# команда [опции] [аргументы]\n\nls                    # команда без аргументов\nls -la                # команда + опции (-l и -a)\nls -la /var/log       # команда + опции + аргумент (путь)\n\n# Опции бывают:\n# Короткие: -l, -a, -h (можно объединять: -lah)\n# Длинные:  --long, --all, --human-readable' },
        { type: 'heading', value: 'Навигация и информация' },
        { type: 'code', language: 'bash', value: 'pwd                   # текущий каталог\nls                    # содержимое каталога\nls -la                # подробный список + скрытые файлы\ncd /var/log           # перейти по абсолютному пути\ncd Documents          # перейти по относительному пути\ncd ..                 # на уровень вверх\ncd ~                  # в домашний каталог\ncd -                  # в предыдущий каталог\nclear                 # очистить экран (или Ctrl+L)\nhistory               # показать историю команд' },
        { type: 'heading', value: 'Получение помощи' },
        { type: 'code', language: 'bash', value: 'ls --help             # краткая справка по команде\nman ls                # полная документация (man-страница)\n# Навигация в man: стрелки, q — выход, / — поиск\n\nwhatis ls             # однострочное описание\n# ls (1) - list directory contents\n\napropos "disk space"  # поиск команды по описанию\n# df (1) - report file system disk space usage\n\ntype cd               # тип команды\n# cd is a shell builtin' },
        { type: 'tip', value: 'Клавиша Tab — автодополнение команд и путей. Нажмите Tab дважды для списка вариантов. Это экономит огромное количество времени и предотвращает опечатки.' }
      ]
    },
    {
      id: 5,
      title: 'Горячие клавиши терминала',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эффективная работа в терминале невозможна без знания горячих клавиш. Bash использует библиотеку readline, которая предоставляет множество сочетаний клавиш в стиле Emacs.' },
        { type: 'heading', value: 'Навигация и редактирование' },
        { type: 'code', language: 'bash', value: '# Перемещение курсора:\n# Ctrl+A — в начало строки\n# Ctrl+E — в конец строки\n# Alt+F  — на одно слово вперёд\n# Alt+B  — на одно слово назад\n\n# Редактирование:\n# Ctrl+W — удалить слово перед курсором\n# Alt+D  — удалить слово после курсора\n# Ctrl+K — удалить от курсора до конца строки\n# Ctrl+U — удалить от курсора до начала строки\n# Ctrl+Y — вставить последний удалённый текст\n\n# Управление:\n# Ctrl+C — прервать текущую команду\n# Ctrl+Z — приостановить команду (в фон)\n# Ctrl+D — выход из shell\n# Ctrl+L — очистить экран\n# Ctrl+R — поиск по истории команд' },
        { type: 'heading', value: 'Работа с историей' },
        { type: 'code', language: 'bash', value: '# Ctrl+R — обратный поиск по истории (ОЧЕНЬ ПОЛЕЗНО!)\n# Начните вводить часть команды — Bash найдёт совпадение\n# Повторное Ctrl+R — искать дальше в истории\n# Enter — выполнить найденную команду\n# Ctrl+G — отменить поиск\n\n# Быстрые подстановки:\n!!                # повторить последнюю команду\nsudo !!           # последняя команда с sudo\n!$                # последний аргумент предыдущей команды\n!vim              # последняя команда начинающаяся с vim\n\n# Пример:\nls /etc/nginx/nginx.conf\nvim !$\n# Эквивалентно: vim /etc/nginx/nginx.conf' },
        { type: 'tip', value: 'Ctrl+R — самая полезная комбинация! Начните вводить часть команды и Bash найдёт совпадение в истории. Используйте это постоянно вместо набора длинных команд заново.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Первые шаги в терминале',
      type: 'practice',
      difficulty: 'easy',
      description: 'Освойте базовые команды навигации и получения информации о системе.',
      requirements: [
        'Узнайте версию ядра Linux и имя дистрибутива',
        'Перейдите в каталог /var/log и выведите его содержимое с подробностями',
        'Используя man, найдите опцию команды ls для сортировки по размеру файла',
        'С помощью apropos найдите команду для отображения календаря',
        'Создайте каталог ~/linux-course и перейдите в него',
        'Выведите историю команд и найдите в ней команду uname'
      ],
      hint: 'uname -r покажет версию ядра, cat /etc/os-release — информацию о дистрибутиве. В man используйте /sort для поиска нужной опции. mkdir создаёт каталоги.',
      expectedOutput: 'uname -r: 5.15.0-91-generic\ncat /etc/os-release: NAME="Ubuntu" VERSION="22.04.3 LTS"\nls -lS /var/log: файлы отсортированы по размеру\napropos calendar: cal (1) - display a calendar\npwd: /home/user/linux-course',
      solution: '# 1. Информация о системе\nuname -r\nuname -a\ncat /etc/os-release\n\n# 2. Навигация\ncd /var/log\nls -la\n\n# 3. Man-страница: опция -S для сортировки по размеру\nman ls\n# Нажать /sort — найти: -S sort by file size, largest first\nls -lS /var/log\n\n# 4. Поиск команды для календаря\napropos calendar\n# cal (1) - display a calendar\ncal\ncal 2026\n\n# 5. Создать каталог\nmkdir ~/linux-course\ncd ~/linux-course\npwd\n\n# 6. История\nhistory | grep uname',
      explanation: 'uname выводит информацию о ядре (-r — только версию, -a — всё). /etc/os-release содержит данные о дистрибутиве. ls -S сортирует по размеру. apropos ищет по описаниям man-страниц. history хранит все введённые команды.'
    }
  ]
}
