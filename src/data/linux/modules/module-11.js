export default {
  id: 11,
  title: 'Bash scripting: продвинутый',
  description: 'Продвинутые возможности Bash: массивы, regex, subshells, trap, getopts, отладка скриптов.',
  lessons: [
    {
      id: 1,
      title: 'Массивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bash поддерживает индексированные и ассоциативные массивы. Массивы полезны для хранения списков серверов, файлов, конфигурационных параметров.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Индексированные массивы:\nSERVERS=("web1" "web2" "web3" "db1")\n\necho "${SERVERS[0]}"      # web1 (первый элемент)\necho "${SERVERS[2]}"      # web3 (третий)\necho "${SERVERS[@]}"      # все элементы\necho "${#SERVERS[@]}"     # количество элементов: 4\necho "${SERVERS[@]:1:2}"  # срез: web2 web3\n\n# Добавить элемент:\nSERVERS+=("cache1")\n\n# Удалить элемент:\nunset SERVERS[2]\n\n# Итерация:\nfor SERVER in "${SERVERS[@]}"; do\n    echo "Сервер: $SERVER"\ndone\n\n# Ассоциативные массивы (bash 4+):\ndeclare -A CONFIG\nCONFIG[host]="localhost"\nCONFIG[port]="5432"\nCONFIG[db]="myapp"\n\necho "${CONFIG[host]}:${CONFIG[port]}/${CONFIG[db]}"\n\n# Все ключи и значения:\necho "${!CONFIG[@]}"       # ключи: host port db\necho "${CONFIG[@]}"        # значения\n\nfor KEY in "${!CONFIG[@]}"; do\n    echo "$KEY = ${CONFIG[$KEY]}"\ndone' },
        { type: 'tip', value: 'Всегда заключайте "${ARRAY[@]}" в двойные кавычки при итерации — иначе элементы с пробелами разобьются на отдельные слова.' }
      ]
    },
    {
      id: 2,
      title: 'Регулярные выражения и обработка строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bash поддерживает регулярные выражения через оператор =~ внутри [[ ]]. Также имеет встроенные операции со строками: подстановка, извлечение подстрок, замена.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Regex в bash:\nEMAIL="user@example.com"\nif [[ "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ ]]; then\n    echo "Валидный email"\nfi\n\n# BASH_REMATCH — захваченные группы:\nLINE="Error 404: Page not found"\nif [[ "$LINE" =~ Error\\ ([0-9]+):\\ (.*) ]]; then\n    echo "Код: ${BASH_REMATCH[1]}"   # 404\n    echo "Сообщение: ${BASH_REMATCH[2]}"  # Page not found\nfi\n\n# Операции со строками:\nSTR="Hello, World!"\necho "${#STR}"               # длина: 13\necho "${STR:7}"              # подстрока с 7: World!\necho "${STR:7:5}"            # подстрока 7, длина 5: World\necho "${STR,,}"              # в нижний регистр: hello, world!\necho "${STR^^}"              # в верхний регистр: HELLO, WORLD!\n\n# Замена в строке:\nFILE="backup-2026-03-15.tar.gz"\necho "${FILE/backup/archive}"       # первое вхождение\necho "${FILE//-/_}"                 # все вхождения (// )\necho "${FILE%.tar.gz}"              # удалить суффикс: backup-2026-03-15\necho "${FILE##*.}"                  # расширение: gz\necho "${FILE%%.*}"                  # до первой точки: backup-2026-03-15' },
        { type: 'tip', value: '${VAR%pattern} удаляет кратчайшее совпадение с конца, ${VAR%%pattern} — длиннейшее. ${VAR#pattern} — с начала. Мнемоника: # слева на клавиатуре (начало), % справа (конец).' }
      ]
    },
    {
      id: 3,
      title: 'Subshells и подстановка процессов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Subshell — дочерний процесс bash, выполняющий команды в изолированном окружении. Подстановка процессов позволяет использовать вывод команды как файл.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Subshell — команды в скобках ():\n(cd /tmp && ls)   # cd не влияет на текущий shell\npwd                # всё ещё в исходном каталоге\n\n# Подстановка команд:\nFILES=$(ls /etc)             # $() — рекомендуемый способ\nDATE=`date`                  # обратные кавычки — устаревший\n\n# Подстановка процессов <():\n# Позволяет использовать вывод команды как файл\ndiff <(ls /dir1) <(ls /dir2)  # сравнить содержимое каталогов\n\n# Сравнить отсортированные файлы:\ndiff <(sort file1.txt) <(sort file2.txt)\n\n# While с pipe (проблема с subshell):\n# НЕПРАВИЛЬНО — переменная изменяется в subshell:\nCOUNT=0\ncat file.txt | while read LINE; do\n    ((COUNT++))\ndone\necho "$COUNT"  # 0! Pipe создаёт subshell\n\n# ПРАВИЛЬНО — перенаправление вместо pipe:\nCOUNT=0\nwhile read LINE; do\n    ((COUNT++))\ndone < file.txt\necho "$COUNT"  # правильное значение' },
        { type: 'note', value: 'Pipe (|) создаёт subshell для правой части. Переменные, изменённые в subshell, не видны в родительском shell. Используйте перенаправление < вместо pipe для while read.' }
      ]
    },
    {
      id: 4,
      title: 'trap — обработка сигналов',
      type: 'theory',
      content: [
        { type: 'text', value: 'trap перехватывает сигналы и выполняет указанные команды. Используется для корректной очистки при завершении скрипта (удаление временных файлов, освобождение ресурсов).' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Очистка при выходе:\nTMPFILE=$(mktemp)\ntrap "rm -f $TMPFILE; echo Очистка выполнена" EXIT\n\n# Теперь $TMPFILE будет удалён при любом завершении скрипта\necho "Данные" > "$TMPFILE"\n# ... работа с файлом ...\n# При выходе (нормальном или по ошибке) файл будет удалён\n\n# Перехват Ctrl+C:\ntrap "echo Прервано пользователем; exit 1" INT\n\n# Перехват нескольких сигналов:\ntrap cleanup EXIT INT TERM\n\ncleanup() {\n    echo "Очистка..."\n    rm -f /tmp/myapp_*\n    # Закрыть соединения, остановить процессы и т.д.\n}\n\n# Игнорирование сигнала:\ntrap "" INT  # Ctrl+C будет игнорироваться\n\n# Сброс обработчика:\ntrap - INT   # вернуть поведение по умолчанию\n\n# Практический пример — lock-файл:\nLOCKFILE="/var/run/myapp.lock"\n\ntrap "rm -f $LOCKFILE" EXIT\n\nif [[ -f "$LOCKFILE" ]]; then\n    echo "Скрипт уже запущен (PID: $(cat $LOCKFILE))"\n    exit 1\nfi\n\necho $$ > "$LOCKFILE"\necho "Скрипт запущен, PID: $$"\n# ... работа ...' },
        { type: 'tip', value: 'trap ... EXIT — must-have в любом скрипте, создающем временные файлы. Гарантирует очистку при любом сценарии завершения. Lock-файл предотвращает одновременный запуск нескольких копий скрипта.' }
      ]
    },
    {
      id: 5,
      title: 'getopts — разбор аргументов',
      type: 'theory',
      content: [
        { type: 'text', value: 'getopts разбирает аргументы командной строки в стиле Unix (-v, -f file, --verbose). Позволяет создавать скрипты с удобным CLI-интерфейсом.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# getopts разбирает короткие опции:\nVERBOSE=false\nOUTPUT=""\nCOUNT=1\n\nusage() {\n    echo "Использование: $0 [-v] [-o output] [-n count] [-h] file"\n    echo "  -v          Подробный вывод"\n    echo "  -o output   Выходной файл"\n    echo "  -n count    Количество повторений"\n    echo "  -h          Справка"\n    exit 1\n}\n\nwhile getopts "vo:n:h" OPT; do\n    case $OPT in\n        v) VERBOSE=true ;;\n        o) OUTPUT="$OPTARG" ;;\n        n) COUNT="$OPTARG" ;;\n        h) usage ;;\n        ?) usage ;;\n    esac\ndone\n\nshift $((OPTIND - 1))  # убрать обработанные опции\nFILE=${1:?\"Укажите файл\"}\n\nif $VERBOSE; then\n    echo "Файл: $FILE"\n    echo "Вывод: ${OUTPUT:-stdout}"\n    echo "Повторений: $COUNT"\nfi\n\n# Использование:\n# ./script.sh -v -o result.txt -n 5 input.txt\n# ./script.sh -h' },
        { type: 'heading', value: 'Разбор длинных опций' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Для длинных опций используйте цикл while + case:\nwhile [[ $# -gt 0 ]]; do\n    case $1 in\n        -v|--verbose)\n            VERBOSE=true\n            shift\n            ;;\n        -o|--output)\n            OUTPUT="$2"\n            shift 2\n            ;;\n        -n|--count)\n            COUNT="$2"\n            shift 2\n            ;;\n        -h|--help)\n            usage\n            ;;\n        -*)\n            echo "Неизвестная опция: $1"\n            usage\n            ;;\n        *)\n            FILE="$1"\n            shift\n            ;;\n    esac\ndone\n\n# Использование:\n# ./script.sh --verbose --output result.txt --count 5 input.txt' },
        { type: 'tip', value: 'В строке getopts "vo:n:h" двоеточие после буквы означает что опция требует аргумент. v — флаг без аргумента, o: — опция с аргументом.' }
      ]
    },
    {
      id: 6,
      title: 'Отладка и best practices',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отладка bash-скриптов — важный навык. set -e останавливает скрипт при ошибке, set -x показывает каждую команду. Следование best practices предотвращает многие проблемы.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Рекомендуемый заголовок для production скриптов:\nset -euo pipefail\n# -e  выйти при ошибке любой команды\n# -u  ошибка при использовании неопределённой переменной\n# -o pipefail  ошибка в любой части pipe = ошибка всего pipe\n\n# Отладка:\nset -x         # показывать каждую команду перед выполнением\nset +x         # отключить отладку\n\n# Или запустить с отладкой:\nbash -x script.sh\n\n# Отладка части скрипта:\nset -x\n# ... отлаживаемый код ...\nset +x\n\n# shellcheck — статический анализатор (установите!):\nsudo apt install shellcheck\nshellcheck script.sh\n# Покажет ошибки, предупреждения и рекомендации' },
        { type: 'heading', value: 'Best practices' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\nset -euo pipefail\n\n# 1. Всегда кавычки вокруг переменных:\ncp "$FILE" "$DEST"     # правильно\n# cp $FILE $DEST       # ОПАСНО если есть пробелы\n\n# 2. Используйте [[ ]] вместо [ ]:\nif [[ -f "$FILE" ]]; then ... fi\n\n# 3. Значения по умолчанию:\nPORT=${PORT:-8080}        # если PORT не задан, используем 8080\nNAME=${1:?"Укажите имя"}  # если нет аргумента — ошибка\n\n# 4. Временные файлы через mktemp:\nTMP=$(mktemp)\ntrap "rm -f $TMP" EXIT\n\n# 5. Проверка зависимостей:\ncommand -v jq &>/dev/null || { echo "jq не установлен"; exit 1; }\n\n# 6. Логирование:\nLOG="/var/log/myscript.log"\nlog() { echo "[$(date +%Y-%m-%dT%H:%M:%S)] $*" | tee -a "$LOG"; }\nlog "Скрипт запущен"\n\n# 7. Используйте local в функциях:\nmy_func() {\n    local RESULT\n    RESULT=$(command)\n    echo "$RESULT"\n}' },
        { type: 'tip', value: 'set -euo pipefail — первая строка после shebang в любом production скрипте. shellcheck — обязательный инструмент, находит 90% типичных ошибок в bash-скриптах.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Продвинутый Bash',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите продвинутый скрипт автоматизации с обработкой ошибок.',
      requirements: [
        'Напишите скрипт бэкапа с getopts: -s source_dir, -d dest_dir, -c compression (gzip/bzip2), -v verbose',
        'Используйте trap для очистки временных файлов при прерывании',
        'Добавьте проверку: существует ли исходный каталог, достаточно ли места на диске',
        'Используйте массив для хранения списка файлов для исключения',
        'Добавьте логирование с временными метками',
        'Скрипт должен начинаться с set -euo pipefail'
      ],
      hint: 'getopts "s:d:c:vh" разберёт опции. du -sb source | awk "{print $1}" даст размер в байтах. df --output=avail dest | tail -1 — свободное место. tar --exclude для исключений.',
      expectedOutput: './backup.sh -s /home/user -d /backup -c gzip -v\n[2026-03-15 10:00:00] Начало бэкапа /home/user\n[2026-03-15 10:00:00] Сжатие: gzip\n[2026-03-15 10:00:01] Исключения: .cache, .tmp, node_modules\n[2026-03-15 10:00:05] Бэкап создан: /backup/backup-20260315-100000.tar.gz\n[2026-03-15 10:00:05] Размер: 15M',
      solution: '#!/bin/bash\nset -euo pipefail\n\nSOURCE=""\nDEST=""\nCOMPRESS="gzip"\nVERBOSE=false\nLOGFILE="/tmp/backup-$$.log"\nEXCLUDE=(".cache" ".tmp" "node_modules" "__pycache__" ".git")\n\ntrap "rm -f $LOGFILE.tmp" EXIT INT TERM\n\nlog() {\n    local MSG="[$(date +\"%Y-%m-%d %H:%M:%S\")] $1"\n    echo "$MSG" | tee -a "$LOGFILE"\n}\n\nusage() {\n    echo "Использование: $0 -s source -d dest [-c gzip|bzip2] [-v] [-h]"\n    exit 1\n}\n\nwhile getopts "s:d:c:vh" OPT; do\n    case $OPT in\n        s) SOURCE="$OPTARG" ;;\n        d) DEST="$OPTARG" ;;\n        c) COMPRESS="$OPTARG" ;;\n        v) VERBOSE=true ;;\n        h) usage ;;\n        ?) usage ;;\n    esac\ndone\n\n[[ -z "$SOURCE" || -z "$DEST" ]] && usage\n[[ -d "$SOURCE" ]] || { log "ОШИБКА: $SOURCE не существует"; exit 1; }\nmkdir -p "$DEST"\n\nlog "Начало бэкапа $SOURCE"\nlog "Сжатие: $COMPRESS"\n\nEXCLUDE_ARGS=""\nfor ITEM in "${EXCLUDE[@]}"; do\n    EXCLUDE_ARGS+=" --exclude=$ITEM"\n    $VERBOSE && log "Исключение: $ITEM"\ndone\n\nTIMESTAMP=$(date +%Y%m%d-%H%M%S)\ncase $COMPRESS in\n    gzip)  EXT="tar.gz"; FLAG="z" ;;\n    bzip2) EXT="tar.bz2"; FLAG="j" ;;\n    *)     log "Неизвестное сжатие: $COMPRESS"; exit 1 ;;\nesac\n\nOUTFILE="$DEST/backup-$TIMESTAMP.$EXT"\ntar -c${FLAG}f "$OUTFILE" $EXCLUDE_ARGS -C "$(dirname "$SOURCE")" "$(basename "$SOURCE")"\n\nlog "Бэкап создан: $OUTFILE"\nlog "Размер: $(du -h "$OUTFILE" | cut -f1)"',
      explanation: 'set -euo pipefail обеспечивает безопасность скрипта. getopts разбирает аргументы. trap очищает ресурсы при выходе. Массив EXCLUDE хранит исключения. log() добавляет временные метки. case выбирает формат сжатия.'
    }
  ]
}
