export default {
  id: 10,
  title: 'Bash scripting: основы',
  description: 'Основы написания Bash-скриптов: переменные, условия, циклы, функции, аргументы командной строки.',
  lessons: [
    {
      id: 1,
      title: 'Первый скрипт и переменные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bash-скрипт — текстовый файл с командами, выполняемыми интерпретатором bash. Первая строка (shebang) указывает интерпретатор. Скрипты автоматизируют рутинные задачи администрирования.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# Shebang — указывает интерпретатор\n# Комментарии начинаются с #\n\n# Переменные (БЕЗ пробелов вокруг =):\nNAME="Linux"\nVERSION=22\nDATE=$(date +%Y-%m-%d)     # подстановка команды\nFILES=$(ls /etc | wc -l)   # результат команды\n\n# Использование переменных:\necho "Система: $NAME"\necho "Версия: ${VERSION}"\necho "Дата: $DATE"\necho "Файлов в /etc: $FILES"\n\n# Кавычки:\necho "$NAME"       # переменная раскрывается: Linux\necho \'$NAME\'       # буквально: $NAME\necho "${NAME}_OS"  # фигурные скобки для разделения\n\n# Специальные переменные:\necho $0            # имя скрипта\necho $1            # первый аргумент\necho $#            # количество аргументов\necho $@            # все аргументы\necho $?            # код возврата последней команды\necho $$            # PID текущего скрипта\n\n# Запуск скрипта:\n# chmod +x script.sh\n# ./script.sh\n# или: bash script.sh' },
        { type: 'tip', value: 'Всегда используйте двойные кавычки вокруг переменных: "$VAR" вместо $VAR. Без кавычек пробелы в значении вызовут ошибки. Исключение — внутри [[ ]].' }
      ]
    },
    {
      id: 2,
      title: 'Ввод данных и арифметика',
      type: 'theory',
      content: [
        { type: 'text', value: 'read считывает ввод пользователя. Арифметические операции выполняются через $(( )), let или expr. Bash поддерживает только целочисленную арифметику.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Чтение ввода:\nread -p "Введите имя: " USERNAME\necho "Привет, $USERNAME!"\n\nread -sp "Введите пароль: " PASSWORD  # -s скрыть ввод\necho  # новая строка после скрытого ввода\n\nread -t 10 -p "Ответьте за 10 секунд: " ANSWER  # таймаут\n\n# Арифметика:\nA=10\nB=3\n\nSUM=$((A + B))         # 13\nDIFF=$((A - B))        # 7\nPROD=$((A * B))        # 30\nDIV=$((A / B))         # 3 (целочисленное!)\nMOD=$((A % B))         # 1\nPOWER=$((A ** 2))      # 100\n\necho "Сумма: $SUM"\n\n# Инкремент:\n((A++))\n((A += 5))\n\n# Для дробных чисел — bc:\nRESULT=$(echo "scale=2; 10 / 3" | bc)\necho "10 / 3 = $RESULT"   # 3.33' },
        { type: 'note', value: 'Bash поддерживает только целые числа! Для вычислений с дробями используйте bc или awk. Пример: echo "scale=4; 22/7" | bc даёт 3.1428.' }
      ]
    },
    {
      id: 3,
      title: 'Условия: if/else',
      type: 'theory',
      content: [
        { type: 'text', value: 'Условные конструкции if/else позволяют выполнять команды в зависимости от условий. В bash используются [ ] (test) или [[ ]] (расширенный test). [[ ]] предпочтительнее.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Базовая структура:\nif [[ условие ]]; then\n    echo "Условие истинно"\nelif [[ другое_условие ]]; then\n    echo "Другое условие"\nelse\n    echo "Ни одно условие не выполнено"\nfi\n\n# Сравнение строк:\nif [[ "$NAME" == "admin" ]]; then\n    echo "Добро пожаловать, администратор"\nfi\n\nif [[ -z "$VAR" ]]; then\n    echo "Переменная пустая"\nfi\n\nif [[ -n "$VAR" ]]; then\n    echo "Переменная не пустая"\nfi\n\n# Сравнение чисел:\nif [[ $A -eq $B ]]; then echo "равны"; fi\nif [[ $A -ne $B ]]; then echo "не равны"; fi\nif [[ $A -gt $B ]]; then echo "A > B"; fi\nif [[ $A -lt $B ]]; then echo "A < B"; fi\nif [[ $A -ge $B ]]; then echo "A >= B"; fi\nif [[ $A -le $B ]]; then echo "A <= B"; fi\n\n# Логические операторы:\nif [[ $A -gt 5 && $A -lt 20 ]]; then\n    echo "A между 5 и 20"\nfi\n\nif [[ $A -eq 1 || $A -eq 2 ]]; then\n    echo "A равно 1 или 2"\nfi' },
        { type: 'heading', value: 'Проверка файлов' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Проверка файлов — очень частая задача в скриптах:\nFILE="/etc/nginx/nginx.conf"\n\nif [[ -f "$FILE" ]]; then\n    echo "Файл существует"\nfi\n\nif [[ -d "/var/log" ]]; then\n    echo "Каталог существует"\nfi\n\nif [[ -r "$FILE" ]]; then\n    echo "Файл доступен для чтения"\nfi\n\nif [[ -w "$FILE" ]]; then\n    echo "Файл доступен для записи"\nfi\n\nif [[ -x "$FILE" ]]; then\n    echo "Файл исполняемый"\nfi\n\nif [[ -s "$FILE" ]]; then\n    echo "Файл не пустой"\nfi\n\n# Практический пример:\nCONFIG="/etc/myapp/config.yml"\nif [[ ! -f "$CONFIG" ]]; then\n    echo "ОШИБКА: Конфиг $CONFIG не найден!"\n    exit 1\nfi' },
        { type: 'tip', value: 'Используйте [[ ]] вместо [ ]. Двойные скобки поддерживают && и ||, не требуют экранирования, безопаснее с пустыми переменными. [ ] — POSIX-совместимый, но менее удобный.' }
      ]
    },
    {
      id: 4,
      title: 'Циклы: for, while, until',
      type: 'theory',
      content: [
        { type: 'text', value: 'Циклы позволяют выполнять команды многократно. for — для итерации по списку, while — пока условие истинно, until — пока условие ложно.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# for — итерация по списку:\nfor SERVER in web1 web2 web3 db1; do\n    echo "Проверяю сервер: $SERVER"\n    ping -c 1 "$SERVER" 2>/dev/null && echo "  OK" || echo "  FAIL"\ndone\n\n# for — итерация по файлам:\nfor FILE in /var/log/*.log; do\n    echo "$FILE: $(wc -l < "$FILE") строк"\ndone\n\n# for — C-стиль:\nfor ((i=1; i<=10; i++)); do\n    echo "Итерация: $i"\ndone\n\n# for — диапазон:\nfor i in {1..5}; do\n    echo "Число: $i"\ndone\n\nfor i in {0..100..10}; do  # шаг 10\n    echo "Число: $i"\ndone' },
        { type: 'heading', value: 'while и until' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# while — пока условие истинно:\nCOUNT=0\nwhile [[ $COUNT -lt 5 ]]; do\n    echo "Счётчик: $COUNT"\n    ((COUNT++))\ndone\n\n# while — чтение файла построчно:\nwhile IFS= read -r LINE; do\n    echo "Строка: $LINE"\ndone < /etc/hosts\n\n# while — бесконечный цикл с break:\nwhile true; do\n    read -p "Введите quit для выхода: " INPUT\n    if [[ "$INPUT" == "quit" ]]; then\n        break\n    fi\n    echo "Вы ввели: $INPUT"\ndone\n\n# until — пока условие ложно (обратный while):\nuntil ping -c 1 google.com &>/dev/null; do\n    echo "Ожидание сети..."\n    sleep 5\ndone\necho "Сеть доступна!"\n\n# continue — пропустить итерацию:\nfor i in {1..10}; do\n    if [[ $((i % 2)) -eq 0 ]]; then\n        continue  # пропустить чётные\n    fi\n    echo "Нечётное: $i"\ndone' },
        { type: 'tip', value: 'while IFS= read -r LINE — правильный способ чтения файла построчно. IFS= предотвращает обрезку пробелов, -r предотвращает интерпретацию обратных слешей.' }
      ]
    },
    {
      id: 5,
      title: 'Функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции группируют команды для повторного использования. В bash функции могут принимать аргументы ($1, $2...) и возвращать код возврата (0-255). Для возврата строк используйте echo.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Объявление функции:\ngreet() {\n    echo "Привет, $1!"\n}\n\n# Вызов:\ngreet "Linux"\ngreet "Admin"\n\n# Функция с возвратом значения:\nget_disk_usage() {\n    df -h / | awk \'NR==2 {print $5}\'\n}\n\nUSAGE=$(get_disk_usage)\necho "Диск использован: $USAGE"\n\n# Функция с кодом возврата:\ncheck_service() {\n    local SERVICE=$1\n    if systemctl is-active "$SERVICE" &>/dev/null; then\n        return 0   # успех\n    else\n        return 1   # неудача\n    fi\n}\n\nif check_service nginx; then\n    echo "Nginx работает"\nelse\n    echo "Nginx НЕ работает"\nfi\n\n# Локальные переменные:\ncalculate() {\n    local RESULT=$(($1 + $2))  # local — видна только внутри функции\n    echo $RESULT\n}\n\nSUM=$(calculate 10 20)\necho "Сумма: $SUM"' },
        { type: 'heading', value: 'Практический пример: скрипт с функциями' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Цвета для вывода:\nRED="\\033[31m"\nGREEN="\\033[32m"\nRESET="\\033[0m"\n\nlog_info() {\n    echo -e "${GREEN}[INFO]${RESET} $1"\n}\n\nlog_error() {\n    echo -e "${RED}[ERROR]${RESET} $1" >&2\n}\n\ncheck_root() {\n    if [[ $EUID -ne 0 ]]; then\n        log_error "Требуются права root. Используйте sudo."\n        exit 1\n    fi\n}\n\ncheck_root\nlog_info "Запуск скрипта от root"\nlog_info "Проверка сервисов..."\n\nfor SERVICE in nginx ssh postgresql; do\n    if check_service "$SERVICE"; then\n        log_info "$SERVICE: работает"\n    else\n        log_error "$SERVICE: не работает"\n    fi\ndone' },
        { type: 'tip', value: 'Используйте local для переменных внутри функций — это предотвращает загрязнение глобальной области видимости. Без local переменная будет доступна во всём скрипте.' }
      ]
    },
    {
      id: 6,
      title: 'case и select',
      type: 'theory',
      content: [
        { type: 'text', value: 'case — аналог switch из других языков, удобен для меню и обработки аргументов. select — создаёт интерактивное меню.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# case — множественный выбор:\ncase $1 in\n    start)\n        echo "Запуск сервиса..."\n        ;;\n    stop)\n        echo "Остановка сервиса..."\n        ;;\n    restart)\n        echo "Перезапуск сервиса..."\n        ;;\n    status)\n        echo "Статус сервиса..."\n        ;;\n    *)\n        echo "Использование: $0 {start|stop|restart|status}"\n        exit 1\n        ;;\nesac\n\n# case с шаблонами:\ncase "$OSTYPE" in\n    linux*)   echo "Linux" ;;\n    darwin*)  echo "macOS" ;;\n    msys*)    echo "Windows" ;;\n    *)        echo "Неизвестная ОС" ;;\nesac\n\n# select — интерактивное меню:\necho "Выберите действие:"\nselect ACTION in "Бэкап" "Восстановление" "Статус" "Выход"; do\n    case $ACTION in\n        "Бэкап")        echo "Запуск бэкапа..." ;;\n        "Восстановление") echo "Запуск восстановления..." ;;\n        "Статус")       echo "Проверка статуса..." ;;\n        "Выход")        break ;;\n        *)              echo "Неверный выбор" ;;\n    esac\ndone' },
        { type: 'tip', value: 'case идеален для обработки аргументов скрипта. Паттерн *) — это default case. Не забывайте ;; после каждого блока и esac для закрытия case.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Bash-скрипты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полезные Bash-скрипты для администрирования.',
      requirements: [
        'Напишите скрипт, который проверяет доступность списка серверов (ping)',
        'Создайте скрипт мониторинга диска: если занято более 80% — вывести предупреждение',
        'Напишите скрипт создания пользователя, который принимает имя как аргумент',
        'Создайте скрипт с меню (case): backup, restore, status',
        'Напишите функцию, которая логирует сообщения с временной меткой в файл'
      ],
      hint: 'ping -c 1 -W 2 host проверяет доступность. df -h / | awk "NR==2 {print $5}" — процент использования диска. Используйте date +"%Y-%m-%d %H:%M:%S" для временных меток.',
      expectedOutput: 'Скрипт проверки серверов:\n  google.com: OK\n  nonexistent.server: FAIL\n\nМониторинг диска:\n  Диск /: 45% — OK\n  (или: ВНИМАНИЕ: Диск / заполнен на 85%!)\n\nМеню:\n  1) Backup  2) Restore  3) Status  4) Exit',
      solution: '#!/bin/bash\n\n# 1. Проверка серверов\ncheck_servers() {\n    local SERVERS=("google.com" "github.com" "nonexistent.server")\n    for SERVER in "${SERVERS[@]}"; do\n        if ping -c 1 -W 2 "$SERVER" &>/dev/null; then\n            echo "  $SERVER: OK"\n        else\n            echo "  $SERVER: FAIL"\n        fi\n    done\n}\n\n# 2. Мониторинг диска\ncheck_disk() {\n    local USAGE=$(df -h / | awk \'NR==2 {gsub(/%/,""); print $5}\')\n    if [[ $USAGE -gt 80 ]]; then\n        echo "ВНИМАНИЕ: Диск / заполнен на ${USAGE}%!"\n    else\n        echo "Диск /: ${USAGE}% — OK"\n    fi\n}\n\n# 3. Создание пользователя\ncreate_user() {\n    local USERNAME=$1\n    if [[ -z "$USERNAME" ]]; then\n        echo "Использование: create_user <имя>"\n        return 1\n    fi\n    if id "$USERNAME" &>/dev/null; then\n        echo "Пользователь $USERNAME уже существует"\n        return 1\n    fi\n    sudo useradd -m -s /bin/bash "$USERNAME"\n    echo "Пользователь $USERNAME создан"\n}\n\n# 4. Меню\nmenu() {\n    case $1 in\n        backup)  echo "Запуск бэкапа..." ;;\n        restore) echo "Восстановление..." ;;\n        status)  check_disk; check_servers ;;\n        *)       echo "Использование: $0 {backup|restore|status}" ;;\n    esac\n}\n\n# 5. Логирование\nlog_message() {\n    local LOGFILE="/var/log/myapp.log"\n    echo "$(date +\"%Y-%m-%d %H:%M:%S\") - $1" | sudo tee -a "$LOGFILE"\n}\n\nmenu "$1"',
      explanation: 'ping -c 1 -W 2 отправляет один пакет с таймаутом 2 секунды. df -h показывает использование дисков, awk извлекает процент. case обрабатывает аргументы скрипта. Функция log_message добавляет временную метку к каждому сообщению.'
    }
  ]
}
