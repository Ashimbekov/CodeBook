export default {
  id: 4,
  title: 'Текстовые редакторы и обработка текста',
  description: 'Работа с текстовыми редакторами vim и nano. Обработка текста с помощью grep, sed, awk. Потоковая обработка данных.',
  lessons: [
    {
      id: 1,
      title: 'Редактор Vim: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Vim (Vi IMproved) — мощный текстовый редактор, доступный практически на любой Linux-системе. Vim работает в режимах: Normal (навигация), Insert (ввод текста), Visual (выделение), Command (команды).' },
        { type: 'heading', value: 'Режимы Vim' },
        { type: 'code', language: 'bash', value: '# Открыть файл в vim:\nvim file.txt\n\n# РЕЖИМЫ:\n# Normal mode  — по умолчанию, навигация и команды\n# Insert mode  — ввод текста\n# Visual mode  — выделение текста\n# Command mode — команды ex (:)\n\n# Переключение режимов:\n# i     — Insert mode (перед курсором)\n# a     — Insert mode (после курсора)\n# o     — Insert mode (новая строка ниже)\n# O     — Insert mode (новая строка выше)\n# Esc   — вернуться в Normal mode\n# v     — Visual mode (посимвольно)\n# V     — Visual mode (построчно)\n# :     — Command mode' },
        { type: 'heading', value: 'Основные команды' },
        { type: 'code', language: 'bash', value: '# Сохранение и выход (Command mode — нажмите :):\n# :w          — сохранить\n# :q          — выйти\n# :wq         — сохранить и выйти\n# :q!         — выйти без сохранения\n# :wq!        — принудительно сохранить и выйти\n# ZZ          — сохранить и выйти (Normal mode)\n\n# Навигация (Normal mode):\n# h j k l     — влево, вниз, вверх, вправо\n# w           — следующее слово\n# b           — предыдущее слово\n# 0           — начало строки\n# $           — конец строки\n# gg          — начало файла\n# G           — конец файла\n# :42         — перейти на строку 42\n# Ctrl+f      — страница вниз\n# Ctrl+b      — страница вверх\n\n# Редактирование (Normal mode):\n# x           — удалить символ\n# dd          — удалить строку\n# yy          — копировать строку\n# p           — вставить после курсора\n# u           — отменить (undo)\n# Ctrl+r      — повторить (redo)\n# /pattern    — поиск вперёд\n# n           — следующее совпадение\n# :%s/old/new/g — замена во всём файле' },
        { type: 'tip', value: 'Если вы застряли в vim — нажмите Esc несколько раз, затем :q! для выхода без сохранения. Для начала достаточно знать: i (ввод), Esc (нормальный режим), :wq (сохранить и выйти).' }
      ]
    },
    {
      id: 2,
      title: 'Редактор Nano и просмотр файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Nano — простой текстовый редактор с интуитивным интерфейсом. Все горячие клавиши показаны внизу экрана. Для быстрого просмотра файлов используйте cat, less, head, tail.' },
        { type: 'heading', value: 'Nano' },
        { type: 'code', language: 'bash', value: '# Открыть файл:\nnano file.txt\nnano +42 file.txt          # открыть на строке 42\n\n# Основные клавиши (^ = Ctrl):\n# Ctrl+O — сохранить (Write Out)\n# Ctrl+X — выйти\n# Ctrl+K — вырезать строку\n# Ctrl+U — вставить\n# Ctrl+W — поиск\n# Ctrl+\\ — поиск и замена\n# Ctrl+G — справка\n# Alt+U  — отменить\n# Ctrl+_ — перейти на строку' },
        { type: 'heading', value: 'Просмотр файлов' },
        { type: 'code', language: 'bash', value: '# cat — вывести содержимое файла\ncat /etc/hostname\ncat -n file.txt            # с номерами строк\n\n# less — постраничный просмотр (для больших файлов)\nless /var/log/syslog\n# Навигация: стрелки, q — выход, / — поиск, n — следующий\n\n# head — первые строки файла\nhead /etc/passwd           # первые 10 строк\nhead -20 /etc/passwd       # первые 20 строк\n\n# tail — последние строки файла\ntail /var/log/syslog       # последние 10 строк\ntail -20 /var/log/syslog   # последние 20 строк\ntail -f /var/log/syslog    # следить за файлом в реальном времени!\n# Ctrl+C для выхода из tail -f\n\n# wc — подсчёт строк, слов, байт\nwc /etc/passwd             # строки слова байты\n# 35 67 1823 /etc/passwd\nwc -l /etc/passwd          # только строки\n\n# sort — сортировка\nsort file.txt              # по алфавиту\nsort -n file.txt           # по числам\nsort -r file.txt           # в обратном порядке\nsort -u file.txt           # уникальные строки\n\n# uniq — убрать дублирующиеся строки (файл должен быть отсортирован)\nsort file.txt | uniq\nsort file.txt | uniq -c    # с подсчётом повторений' },
        { type: 'tip', value: 'tail -f — незаменимая команда для отладки. Запустите tail -f /var/log/nginx/access.log и наблюдайте за запросами к веб-серверу в реальном времени.' }
      ]
    },
    {
      id: 3,
      title: 'grep — поиск по содержимому',
      type: 'theory',
      content: [
        { type: 'text', value: 'grep (Global Regular Expression Print) — ищет строки в файлах по шаблону. Одна из самых используемых команд Linux. Поддерживает регулярные выражения для сложных шаблонов поиска.' },
        { type: 'code', language: 'bash', value: '# Базовый поиск:\ngrep "error" /var/log/syslog         # строки с "error"\ngrep -i "error" /var/log/syslog      # без учёта регистра\ngrep -n "error" /var/log/syslog      # с номерами строк\ngrep -c "error" /var/log/syslog      # количество совпадений\n\n# Рекурсивный поиск:\ngrep -r "password" /etc/             # во всех файлах каталога\ngrep -rl "password" /etc/            # только имена файлов\n\n# Инвертированный поиск:\ngrep -v "comment" config.txt         # строки НЕ содержащие\n\n# Контекст:\ngrep -A 3 "error" log.txt           # 3 строки после совпадения\ngrep -B 3 "error" log.txt           # 3 строки до совпадения\ngrep -C 3 "error" log.txt           # 3 строки до и после' },
        { type: 'heading', value: 'Регулярные выражения в grep' },
        { type: 'code', language: 'bash', value: '# Базовые регулярные выражения:\ngrep "^root" /etc/passwd           # строки начинающиеся с root\ngrep "bash$" /etc/passwd           # строки заканчивающиеся на bash\ngrep "^$" file.txt                 # пустые строки\ngrep -c "^$" file.txt              # количество пустых строк\n\n# Extended regex (-E или egrep):\ngrep -E "error|warning|critical" /var/log/syslog\n# Строки содержащие error ИЛИ warning ИЛИ critical\n\ngrep -E "^[0-9]+\\." file.txt       # строки начинающиеся с числа\ngrep -E "192\\.168\\.[0-9]+\\.[0-9]+" log.txt  # IP-адреса 192.168.x.x\n\n# Практические примеры:\n# Найти активных пользователей (с bash):\ngrep "/bin/bash$" /etc/passwd\n\n# Найти ошибки за сегодня:\ngrep "$(date +%b\\ %d)" /var/log/syslog | grep -i error\n\n# Найти IP-адреса в логах:\ngrep -oE "([0-9]{1,3}\\.){3}[0-9]{1,3}" /var/log/auth.log | sort | uniq -c | sort -rn' },
        { type: 'tip', value: 'grep -r "TODO" . — быстрый способ найти все TODO в проекте. grep -rl "old_function" . | xargs sed -i "s/old_function/new_function/g" — найти и заменить во всех файлах.' }
      ]
    },
    {
      id: 4,
      title: 'sed — потоковый редактор',
      type: 'theory',
      content: [
        { type: 'text', value: 'sed (Stream Editor) — обрабатывает текст построчно, применяя команды замены, удаления, вставки. Идеален для автоматической обработки конфигурационных файлов и логов.' },
        { type: 'code', language: 'bash', value: '# Замена текста:\nsed "s/old/new/" file.txt            # первое вхождение в каждой строке\nsed "s/old/new/g" file.txt           # все вхождения (global)\nsed "s/old/new/gi" file.txt          # без учёта регистра\n\n# По умолчанию sed выводит результат на stdout\n# -i редактирует файл на месте:\nsed -i "s/old/new/g" file.txt        # изменить файл\nsed -i.bak "s/old/new/g" file.txt   # с резервной копией .bak\n\n# Удаление строк:\nsed "/pattern/d" file.txt            # удалить строки с pattern\nsed "/^#/d" file.txt                 # удалить комментарии\nsed "/^$/d" file.txt                 # удалить пустые строки\nsed "1d" file.txt                    # удалить первую строку\nsed "1,5d" file.txt                  # удалить строки 1-5' },
        { type: 'heading', value: 'Продвинутые возможности' },
        { type: 'code', language: 'bash', value: '# Добавление текста:\nsed "3a\\Новая строка после 3-й" file.txt    # после строки 3\nsed "3i\\Новая строка перед 3-й" file.txt    # перед строкой 3\n\n# Только определённые строки:\nsed "2s/old/new/" file.txt           # замена только в строке 2\nsed "2,5s/old/new/g" file.txt        # замена в строках 2-5\n\n# Группировка команд:\nsed -e "s/foo/bar/g" -e "/^#/d" file.txt\n\n# Практические примеры:\n# Изменить порт в конфигурации:\nsed -i "s/listen 80/listen 8080/" /etc/nginx/sites-available/default\n\n# Раскомментировать строку:\nsed -i "s/^#Port 22/Port 2222/" /etc/ssh/sshd_config\n\n# Убрать пустые строки и комментарии из конфига:\nsed "/^#/d; /^$/d" /etc/nginx/nginx.conf\n\n# Замена с разделителем | (если в шаблоне есть /):\nsed "s|/var/www/html|/opt/app/public|g" config.txt' },
        { type: 'note', value: 'При использовании sed -i всегда сначала тестируйте без -i (просто sed "s/old/new/g" file.txt) чтобы увидеть результат. Или используйте sed -i.bak для создания резервной копии.' }
      ]
    },
    {
      id: 5,
      title: 'awk — обработка структурированного текста',
      type: 'theory',
      content: [
        { type: 'text', value: 'awk — язык обработки текста, разбивающий строки на поля. Идеален для работы с табличными данными, CSV, логами. Каждая строка разбивается на поля ($1, $2, ...), $0 — вся строка.' },
        { type: 'code', language: 'bash', value: '# Базовый синтаксис: awk \'pattern {action}\' file\n\n# Вывести определённые поля (по умолчанию разделитель — пробел):\nawk \'{print $1}\' file.txt             # первое поле\nawk \'{print $1, $3}\' file.txt         # первое и третье поля\nawk \'{print $NF}\' file.txt            # последнее поле\n\n# Разделитель полей:\nawk -F: \'{print $1, $3}\' /etc/passwd  # разделитель :\n# root 0\n# daemon 1\n# user 1000\n\nawk -F, \'{print $2}\' data.csv         # CSV файл' },
        { type: 'heading', value: 'Условия и вычисления' },
        { type: 'code', language: 'bash', value: '# Условия (pattern):\nawk -F: \'$3 >= 1000 {print $1}\' /etc/passwd\n# Пользователи с UID >= 1000 (обычные пользователи)\n\nawk -F: \'$7 ~ /bash/ {print $1}\' /etc/passwd\n# Пользователи с bash\n\n# Встроенные переменные:\n# NR — номер текущей строки\n# NF — количество полей в строке\n# FS — разделитель полей\nawk \'{print NR, $0}\' file.txt        # с номерами строк\nawk \'NR==5\' file.txt                  # только 5-я строка\nawk \'NR>=10 && NR<=20\' file.txt      # строки 10-20\n\n# Вычисления:\nawk \'{sum += $1} END {print sum}\' numbers.txt\n# Сумма первого столбца\n\nawk \'{sum += $1; count++} END {print sum/count}\' numbers.txt\n# Среднее значение\n\n# BEGIN и END:\nawk \'BEGIN {print "=== Отчёт ==="} {print $0} END {print "=== Конец ==="}\' file.txt' },
        { type: 'heading', value: 'Практические примеры' },
        { type: 'code', language: 'bash', value: '# Анализ логов Nginx (вывести IP и статус-код):\nawk \'{print $1, $9}\' /var/log/nginx/access.log\n\n# Топ-10 IP по количеству запросов:\nawk \'{print $1}\' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10\n\n# Размер каждого процесса в ps aux:\nps aux | awk \'NR>1 {print $11, $6/1024 " MB"}\' | sort -t" " -k2 -rn | head -10\n\n# Сумма размеров файлов:\nls -l | awk \'NR>1 {sum += $5} END {print sum/1024/1024 " MB"}\'\n\n# Обработка CSV:\nawk -F, \'{printf "%-20s %s\\n", $1, $2}\' users.csv' },
        { type: 'tip', value: 'Для однострочных задач используйте awk. Для сложной обработки данных рассмотрите Python. awk отлично подходит для быстрого анализа логов и вывода конкретных полей.' }
      ]
    },
    {
      id: 6,
      title: 'cut, tr, diff и другие утилиты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо grep, sed и awk, Linux предоставляет множество утилит для обработки текста. cut извлекает столбцы, tr заменяет символы, diff сравнивает файлы, paste объединяет файлы.' },
        { type: 'code', language: 'bash', value: '# cut — извлечение полей/символов:\ncut -d: -f1 /etc/passwd           # поле 1, разделитель :\ncut -d: -f1,3 /etc/passwd         # поля 1 и 3\ncut -c1-10 file.txt               # символы 1-10\n\n# tr — замена/удаление символов:\necho "HELLO" | tr A-Z a-z         # в нижний регистр\necho "hello" | tr a-z A-Z         # в верхний регистр\necho "hello   world" | tr -s " " # сжать повторяющиеся пробелы\ncat file.txt | tr -d "\\r"         # удалить \\r (Windows -> Linux)\n\n# diff — сравнение файлов:\ndiff file1.txt file2.txt          # различия\ndiff -u file1.txt file2.txt       # unified формат (как в git)\n\n# paste — объединение файлов построчно:\npaste file1.txt file2.txt         # через табуляцию\npaste -d, file1.txt file2.txt     # через запятую\n\n# column — форматирование в таблицу:\nmount | column -t\ncat /etc/passwd | column -t -s:\n\n# rev — перевернуть строку:\necho "hello" | rev\n# olleh\n\n# tac — cat наоборот (строки в обратном порядке):\ntac file.txt' },
        { type: 'tip', value: 'tr -d "\\r" — спасение при работе с файлами из Windows. Символ \\r (carriage return) вызывает странные ошибки в скриптах. Проверьте: cat -A file.txt (^M в конце строк = проблема).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Обработка текста',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте grep, sed и awk для обработки текстовых данных и логов.',
      requirements: [
        'С помощью grep найдите всех пользователей с оболочкой /bin/bash в /etc/passwd',
        'Используя awk, выведите имена пользователей и их UID из /etc/passwd',
        'С помощью sed удалите все комментарии (строки начинающиеся с #) из любого конфига',
        'Подсчитайте количество уникальных оболочек в /etc/passwd с помощью pipe',
        'Найдите 5 самых больших файлов в /var/log используя комбинацию команд',
        'Создайте однострочный скрипт, который извлекает IP-адреса из файла'
      ],
      hint: 'awk -F: выбирает разделитель :. cut -d: -f7 извлекает 7-е поле. sort | uniq -c считает уникальные значения. grep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" извлекает IP-адреса.',
      expectedOutput: 'grep "/bin/bash" /etc/passwd:\nroot:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash\n\nawk -F: вывод: root 0, daemon 1, user 1000\n\nОболочки: /bin/bash (2), /usr/sbin/nologin (20), /bin/false (5)',
      solution: '# 1. Пользователи с bash\ngrep "/bin/bash$" /etc/passwd\n\n# 2. Имена и UID\nawk -F: \'{printf "%-15s UID: %s\\n", $1, $3}\' /etc/passwd\n\n# 3. Удалить комментарии (пример с /etc/ssh/sshd_config)\nsed "/^#/d; /^$/d" /etc/ssh/sshd_config\n# Или для редактирования на месте:\n# sed -i.bak "/^#/d; /^$/d" config.txt\n\n# 4. Уникальные оболочки\nawk -F: \'{print $7}\' /etc/passwd | sort | uniq -c | sort -rn\n# 20 /usr/sbin/nologin\n#  5 /bin/false\n#  2 /bin/bash\n#  1 /bin/sync\n\n# 5. Самые большие файлы в /var/log\nfind /var/log -type f -exec ls -lh {} \; 2>/dev/null | sort -k5 -rh | head -5\n# или:\ndu -ah /var/log 2>/dev/null | sort -rh | head -5\n\n# 6. Извлечение IP-адресов\ngrep -oE "([0-9]{1,3}\\.){3}[0-9]{1,3}" /var/log/auth.log 2>/dev/null | sort | uniq -c | sort -rn',
      explanation: 'grep с $ на конце шаблона ищет точное совпадение оболочки. awk -F: разбивает /etc/passwd по разделителю двоеточие. sed "/^#/d" удаляет строки начинающиеся с #. Pipe-цепочка sort | uniq -c считает уникальные значения.'
    }
  ]
}
