export default {
  id: 4,
  title: 'Bash скрипты',
  description: 'Написание Bash-скриптов: переменные, условия, циклы, функции, обработка аргументов и автоматизация задач.',
  lessons: [
    {
      id: 1,
      title: 'Основы Bash-скриптов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bash-скрипт — это файл с последовательностью команд, которые выполняются автоматически. Скрипты — основной инструмент автоматизации в DevOps: деплой, бэкапы, мониторинг, настройка серверов.' },
        { type: 'heading', value: 'Первый скрипт' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# Шебанг (shebang) — указывает интерпретатор\n# Первая строка КАЖДОГО скрипта\n\n# Комментарии начинаются с #\necho "Hello, DevOps!"\necho "Текущая дата: $(date)"\necho "Пользователь: $USER"\necho "Хост: $(hostname)"\necho "Каталог: $(pwd)"' },
        { type: 'heading', value: 'Переменные' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Присвоение (БЕЗ пробелов вокруг =)\nNAME="DevOps"\nVERSION=3\nAPP_DIR="/opt/myapp"\n\n# Использование\necho "Имя: $NAME"\necho "Версия: ${VERSION}"\necho "Путь: ${APP_DIR}/config"\n\n# Переменные окружения\nexport DATABASE_URL="postgresql://localhost:5432/mydb"\nexport APP_PORT=8080\necho "Порт: $APP_PORT"\n\n# Подстановка команд\nDATE=$(date +%Y-%m-%d)\nHOSTNAME=$(hostname)\nIP=$(hostname -I | awk \'{print $1}\')\necho "Дата: $DATE, Хост: $HOSTNAME, IP: $IP"\n\n# Специальные переменные\n# $0  — имя скрипта\n# $1, $2... — аргументы\n# $#  — количество аргументов\n# $@  — все аргументы\n# $?  — код возврата последней команды\n# $$  — PID текущего процесса' },
        { type: 'tip', value: 'Всегда оборачивай переменные в двойные кавычки: "$VAR" вместо $VAR. Без кавычек пробелы в значении вызовут ошибки. Исключение: внутри [[ ]] кавычки не обязательны.' }
      ]
    },
    {
      id: 2,
      title: 'Условия и ветвление',
      type: 'theory',
      content: [
        { type: 'text', value: 'Условные конструкции позволяют скрипту принимать решения. В Bash используются if/elif/else и [[ ]] для проверок.' },
        { type: 'heading', value: 'Конструкция if' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Базовый if\nif [[ -f /etc/nginx/nginx.conf ]]; then\n    echo "Nginx установлен"\nelse\n    echo "Nginx не найден"\nfi\n\n# if / elif / else\nENV="$1"\nif [[ "$ENV" == "production" ]]; then\n    echo "Деплой в PRODUCTION"\n    REPLICAS=3\nelif [[ "$ENV" == "staging" ]]; then\n    echo "Деплой в STAGING"\n    REPLICAS=1\nelse\n    echo "Ошибка: укажите окружение (production|staging)"\n    exit 1\nfi' },
        { type: 'heading', value: 'Операторы сравнения' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Строки\n[[ "$a" == "$b" ]]     # Равны\n[[ "$a" != "$b" ]]     # Не равны\n[[ -z "$a" ]]          # Пустая строка\n[[ -n "$a" ]]          # Не пустая строка\n\n# Числа\n[[ $a -eq $b ]]        # Равно\n[[ $a -ne $b ]]        # Не равно\n[[ $a -gt $b ]]        # Больше\n[[ $a -lt $b ]]        # Меньше\n[[ $a -ge $b ]]        # Больше или равно\n[[ $a -le $b ]]        # Меньше или равно\n\n# Файлы\n[[ -f file ]]          # Файл существует\n[[ -d dir ]]           # Каталог существует\n[[ -r file ]]          # Можно читать\n[[ -w file ]]          # Можно писать\n[[ -x file ]]          # Можно выполнять\n[[ -s file ]]          # Файл не пустой\n\n# Логические операторы\n[[ $a -gt 0 && $a -lt 100 ]]  # И\n[[ $a -eq 0 || $a -eq 1 ]]    # ИЛИ\n[[ ! -f file ]]                # НЕ\n\n# Пример: проверка перед деплоем\nif [[ -f "docker-compose.yml" && -f ".env" ]]; then\n    echo "Файлы на месте, начинаем деплой"\n    docker compose up -d\nelse\n    echo "ОШИБКА: отсутствуют необходимые файлы"\n    exit 1\nfi' },
        { type: 'note', value: 'Используй [[ ]] (двойные скобки) вместо [ ] — они безопаснее, поддерживают && и ||, не требуют кавычек для переменных внутри.' }
      ]
    },
    {
      id: 3,
      title: 'Циклы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Циклы позволяют повторять действия: обработка списка серверов, ожидание готовности сервиса, пакетная обработка файлов.' },
        { type: 'heading', value: 'Цикл for' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Перебор списка\nfor server in web-01 web-02 web-03; do\n    echo "Деплой на $server..."\n    ssh deploy@$server "docker pull myapp:latest && docker restart myapp"\ndone\n\n# Перебор файлов\nfor file in /etc/nginx/sites-enabled/*.conf; do\n    echo "Проверка: $file"\n    nginx -t -c "$file"\ndone\n\n# Числовой диапазон\nfor i in {1..5}; do\n    echo "Сервер $i"\ndone\n\n# C-style\nfor ((i=0; i<10; i++)); do\n    echo "Итерация $i"\ndone\n\n# Перебор строк из файла\nwhile IFS= read -r server; do\n    echo "Пинг $server"\n    ping -c 1 "$server" > /dev/null 2>&1 && echo "OK" || echo "FAIL"\ndone < servers.txt' },
        { type: 'heading', value: 'Цикл while' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Ожидание готовности сервиса\nMAX_RETRIES=30\nRETRY=0\nwhile [[ $RETRY -lt $MAX_RETRIES ]]; do\n    if curl -s http://localhost:8080/health | grep -q "ok"; then\n        echo "Сервис готов!"\n        break\n    fi\n    echo "Ожидание... попытка $((RETRY + 1))/$MAX_RETRIES"\n    sleep 2\n    ((RETRY++))\ndone\n\nif [[ $RETRY -eq $MAX_RETRIES ]]; then\n    echo "ОШИБКА: сервис не запустился за $((MAX_RETRIES * 2)) секунд"\n    exit 1\nfi\n\n# Бесконечный цикл мониторинга\nwhile true; do\n    CPU=$(top -bn1 | grep "Cpu(s)" | awk \'{print $2}\')\n    MEM=$(free -m | awk \'/Mem:/ {printf "%.1f", $3/$2*100}\')\n    echo "$(date): CPU=${CPU}%, MEM=${MEM}%"\n    sleep 60\ndone' },
        { type: 'tip', value: 'break выходит из цикла, continue переходит к следующей итерации. Для ожидания готовности сервиса всегда используй таймаут (MAX_RETRIES), чтобы скрипт не зависал бесконечно.' }
      ]
    },
    {
      id: 4,
      title: 'Функции и обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции организуют код в переиспользуемые блоки. Обработка ошибок гарантирует что скрипт не продолжит выполнение при сбое.' },
        { type: 'heading', value: 'Функции' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n\n# Определение функции\nlog() {\n    local level="$1"\n    local message="$2"\n    echo "[$(date +\'%Y-%m-%d %H:%M:%S\')] [$level] $message"\n}\n\n# Вызов\nlog "INFO" "Скрипт запущен"\nlog "WARN" "Диск заполнен на 80%"\nlog "ERROR" "Не удалось подключиться к БД"\n\n# Функция с возвращаемым значением\ncheck_service() {\n    local service="$1"\n    if systemctl is-active --quiet "$service"; then\n        return 0  # Успех\n    else\n        return 1  # Ошибка\n    fi\n}\n\nif check_service "nginx"; then\n    log "INFO" "Nginx работает"\nelse\n    log "ERROR" "Nginx не запущен"\n    sudo systemctl start nginx\nfi\n\n# Функция деплоя\ndeploy() {\n    local env="$1"\n    local version="$2"\n    \n    log "INFO" "Деплой v${version} в ${env}"\n    docker pull "myapp:${version}"\n    docker stop myapp 2>/dev/null\n    docker run -d --name myapp "myapp:${version}"\n    log "INFO" "Деплой завершён"\n}\n\ndeploy "production" "1.2.3"' },
        { type: 'heading', value: 'Обработка ошибок' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\nset -euo pipefail\n# set -e  — остановить при любой ошибке\n# set -u  — ошибка при использовании неопределённой переменной\n# set -o pipefail — ошибка в пайпе не маскируется\n\n# trap — выполнить команду при выходе/ошибке\ncleanup() {\n    echo "Очистка временных файлов..."\n    rm -f /tmp/deploy-*.tmp\n}\ntrap cleanup EXIT  # Выполнится при ЛЮБОМ завершении скрипта\n\n# trap для ошибок\non_error() {\n    echo "ОШИБКА в строке $1"\n    # Отправить уведомление\n    curl -X POST "$SLACK_WEBHOOK" -d "{\"text\": \"Деплой провалился в строке $1\"}"\n}\ntrap \'on_error $LINENO\' ERR\n\n# Проверка аргументов\nif [[ $# -lt 2 ]]; then\n    echo "Использование: $0 <env> <version>"\n    echo "Пример: $0 production 1.2.3"\n    exit 1\nfi' },
        { type: 'warning', value: 'set -euo pipefail ОБЯЗАТЕЛЬНО в каждом скрипте. Без set -e скрипт продолжит выполнение после ошибки, что может привести к катастрофе (например, удаление файлов после неудачного бэкапа).' }
      ]
    },
    {
      id: 5,
      title: 'Практические скрипты DevOps',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим реальные скрипты, которые используются в DevOps ежедневно: деплой, бэкап, мониторинг, проверка здоровья сервисов.' },
        { type: 'heading', value: 'Скрипт деплоя' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\nset -euo pipefail\n\n# deploy.sh — деплой приложения\nAPP_NAME="myapp"\nDOCKER_REGISTRY="registry.company.com"\nENV="${1:-staging}"\nVERSION="${2:-latest}"\nIMAGE="${DOCKER_REGISTRY}/${APP_NAME}:${VERSION}"\n\nlog() { echo "[$(date +\'%H:%M:%S\')] $1"; }\n\nlog "Начало деплоя ${APP_NAME} v${VERSION} в ${ENV}"\n\n# Проверки\nif ! docker info > /dev/null 2>&1; then\n    log "ОШИБКА: Docker не запущен"\n    exit 1\nfi\n\n# Pull нового образа\nlog "Скачивание образа ${IMAGE}"\ndocker pull "${IMAGE}"\n\n# Остановка старого контейнера\nif docker ps -q -f name="${APP_NAME}" | grep -q .; then\n    log "Остановка старого контейнера"\n    docker stop "${APP_NAME}"\n    docker rm "${APP_NAME}"\nfi\n\n# Запуск нового контейнера\nlog "Запуск нового контейнера"\ndocker run -d \\\n    --name "${APP_NAME}" \\\n    --restart unless-stopped \\\n    --env-file "/opt/${APP_NAME}/.env.${ENV}" \\\n    -p 8080:8080 \\\n    "${IMAGE}"\n\n# Проверка здоровья\nlog "Проверка здоровья..."\nfor i in {1..30}; do\n    if curl -sf http://localhost:8080/health > /dev/null; then\n        log "Деплой успешен! Приложение готово."\n        exit 0\n    fi\n    sleep 2\ndone\n\nlog "ОШИБКА: приложение не отвечает, откат..."\ndocker stop "${APP_NAME}" && docker rm "${APP_NAME}"\nexit 1' },
        { type: 'heading', value: 'Скрипт бэкапа БД' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\nset -euo pipefail\n\n# backup-db.sh — бэкап PostgreSQL\nDB_HOST="localhost"\nDB_NAME="production"\nDB_USER="backup_user"\nBACKUP_DIR="/opt/backups/db"\nRETENTION_DAYS=7\nDATE=$(date +%Y-%m-%d_%H-%M)\nBACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"\n\nmkdir -p "$BACKUP_DIR"\n\necho "Бэкап БД ${DB_NAME}..."\npg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"\n\nSIZE=$(du -sh "$BACKUP_FILE" | cut -f1)\necho "Бэкап создан: $BACKUP_FILE ($SIZE)"\n\n# Удаление старых бэкапов\necho "Удаление бэкапов старше $RETENTION_DAYS дней"\nfind "$BACKUP_DIR" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete\n\necho "Готово. Текущие бэкапы:"\nls -lh "$BACKUP_DIR"' },
        { type: 'tip', value: 'Каждый скрипт должен: 1) начинаться с set -euo pipefail, 2) логировать свои действия, 3) проверять предусловия, 4) обрабатывать ошибки, 5) возвращать правильный exit code (0 = успех, не-0 = ошибка).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Написание скрипта мониторинга',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите Bash-скрипт для мониторинга сервера, который проверяет CPU, память, диск и доступность сервисов.',
      requirements: [
        'Скрипт должен принимать порог (threshold) как аргумент',
        'Проверить загрузку CPU, использование памяти и диска',
        'Если любой показатель превышает порог — вывести WARNING',
        'Проверить доступность URL (например, http://localhost:8080)',
        'Записать результат в лог-файл с временной меткой',
        'Использовать функции для каждой проверки'
      ],
      hint: 'CPU: top -bn1 | grep "Cpu(s)". Память: free | awk. Диск: df -h / | awk. Для URL: curl -sf URL.',
      expectedOutput: '[2026-03-21 10:00:00] [INFO] === Мониторинг сервера ===\n[2026-03-21 10:00:00] [OK] CPU: 25% (порог: 80%)\n[2026-03-21 10:00:00] [OK] Память: 60% (порог: 80%)\n[2026-03-21 10:00:00] [WARNING] Диск: 85% (порог: 80%)\n[2026-03-21 10:00:00] [OK] Сервис http://localhost:8080 доступен',
      solution: '#!/bin/bash\nset -euo pipefail\n\nTHRESHOLD="${1:-80}"\nLOG_FILE="/var/log/server-monitor.log"\n\nlog() {\n    local level="$1"\n    local message="$2"\n    echo "[$(date +\'%Y-%m-%d %H:%M:%S\')] [$level] $message" | tee -a "$LOG_FILE"\n}\n\ncheck_cpu() {\n    local cpu\n    cpu=$(top -bn1 | grep "Cpu(s)" | awk \'{print int($2)}\')\n    if [[ $cpu -gt $THRESHOLD ]]; then\n        log "WARNING" "CPU: ${cpu}% (порог: ${THRESHOLD}%)"\n    else\n        log "OK" "CPU: ${cpu}% (порог: ${THRESHOLD}%)"\n    fi\n}\n\ncheck_memory() {\n    local mem\n    mem=$(free | awk \'/Mem:/ {printf "%d", $3/$2*100}\')\n    if [[ $mem -gt $THRESHOLD ]]; then\n        log "WARNING" "Память: ${mem}% (порог: ${THRESHOLD}%)"\n    else\n        log "OK" "Память: ${mem}% (порог: ${THRESHOLD}%)"\n    fi\n}\n\ncheck_disk() {\n    local disk\n    disk=$(df -h / | awk \'NR==2 {print int($5)}\')\n    if [[ $disk -gt $THRESHOLD ]]; then\n        log "WARNING" "Диск: ${disk}% (порог: ${THRESHOLD}%)"\n    else\n        log "OK" "Диск: ${disk}% (порог: ${THRESHOLD}%)"\n    fi\n}\n\ncheck_service() {\n    local url="$1"\n    if curl -sf "$url" > /dev/null 2>&1; then\n        log "OK" "Сервис $url доступен"\n    else\n        log "ERROR" "Сервис $url НЕ доступен"\n    fi\n}\n\nlog "INFO" "=== Мониторинг сервера (порог: ${THRESHOLD}%) ==="\ncheck_cpu\ncheck_memory\ncheck_disk\ncheck_service "http://localhost:8080"',
      explanation: 'Скрипт использует функции для каждой проверки, что делает код модульным и читаемым. tee -a выводит в терминал и дописывает в лог. top -bn1 делает один снимок CPU без интерактивного режима. free и df парсятся через awk для извлечения числовых значений.'
    }
  ]
}
