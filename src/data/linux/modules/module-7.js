export default {
  id: 7,
  title: 'Процессы',
  description: 'Управление процессами в Linux: просмотр, мониторинг, сигналы, приоритеты. Фоновые задачи и управление заданиями.',
  lessons: [
    {
      id: 1,
      title: 'Просмотр процессов: ps, top, htop',
      type: 'theory',
      content: [
        { type: 'text', value: 'Процесс — запущенная программа с собственным PID (Process ID), памятью и ресурсами. Каждый процесс имеет родителя (PPID). PID 1 — init/systemd, родитель всех процессов.' },
        { type: 'heading', value: 'ps — снимок процессов' },
        { type: 'code', language: 'bash', value: '# Базовые вызовы:\nps                     # процессы текущего терминала\nps aux                 # ВСЕ процессы системы (BSD-формат)\nps -ef                 # ВСЕ процессы (POSIX-формат)\n\n# ps aux — разбор вывода:\n# USER  PID %CPU %MEM  VSZ   RSS TTY STAT START TIME COMMAND\n# root    1  0.0  0.1 16940 10240 ?   Ss   Mar10 0:05 /sbin/init\n# www     980 0.2  1.5 125000 60000 ? S    Mar10 5:30 nginx: worker\n\n# STAT — состояние процесса:\n# R — Running (выполняется)\n# S — Sleeping (ожидает события)\n# D — Disk sleep (ожидает I/O, нельзя прервать)\n# Z — Zombie (завершён, но не собран родителем)\n# T — Stopped (остановлен сигналом)\n\n# Фильтрация:\nps aux | grep nginx          # найти процессы nginx\nps -u www-data               # процессы пользователя\nps -p 1234                   # информация о конкретном PID\nps --forest                  # дерево процессов\npstree                       # дерево процессов (графически)' },
        { type: 'heading', value: 'top и htop — мониторинг в реальном времени' },
        { type: 'code', language: 'bash', value: '# top — встроенный мониторинг:\ntop\n# Клавиши в top:\n# q   — выход\n# M   — сортировать по памяти\n# P   — сортировать по CPU\n# k   — kill процесс (ввести PID)\n# 1   — показать каждое ядро CPU\n# h   — справка\n\n# htop — улучшенный top (нужно установить):\nsudo apt install htop\nhtop\n# Преимущества htop:\n# - Цветной интерфейс\n# - Прокрутка мышью\n# - Дерево процессов (F5)\n# - Поиск (F3), фильтр (F4)\n# - Kill процесса (F9)\n# - Графики CPU и RAM' },
        { type: 'tip', value: 'htop — первое что нужно установить на любом сервере. Он нагляднее top и позволяет быстро найти процесс, потребляющий CPU или RAM.' }
      ]
    },
    {
      id: 2,
      title: 'Сигналы и kill',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сигналы — механизм межпроцессного взаимодействия в Linux. kill отправляет сигнал процессу. Несмотря на название, kill может отправить любой сигнал, не только завершающий.' },
        { type: 'code', language: 'bash', value: '# Основные сигналы:\n# SIGTERM (15) — вежливое завершение (по умолчанию)\n# SIGKILL (9)  — принудительное завершение (нельзя перехватить)\n# SIGHUP  (1)  — перечитать конфиг (для демонов)\n# SIGINT  (2)  — прерывание (Ctrl+C)\n# SIGSTOP (19) — приостановить (Ctrl+Z)\n# SIGCONT (18) — продолжить\n\n# Отправить сигнал:\nkill PID               # SIGTERM (вежливо)\nkill -9 PID            # SIGKILL (принудительно)\nkill -HUP PID          # SIGHUP (перечитать конфиг)\nkill -STOP PID         # приостановить\nkill -CONT PID         # продолжить\n\n# killall — по имени процесса:\nkillall nginx          # завершить все процессы nginx\nkillall -9 python3     # принудительно\n\n# pkill — по шаблону имени:\npkill -f "python app.py"  # по полной командной строке\npkill -u bob              # все процессы пользователя bob\n\n# Список сигналов:\nkill -l\n#  1) SIGHUP    2) SIGINT    3) SIGQUIT\n#  9) SIGKILL  15) SIGTERM  19) SIGSTOP' },
        { type: 'note', value: 'Всегда сначала SIGTERM (kill PID), потом SIGKILL (kill -9 PID). SIGTERM позволяет процессу корректно завершиться (сохранить данные, закрыть соединения). SIGKILL — крайняя мера, данные могут потеряться.' }
      ]
    },
    {
      id: 3,
      title: 'Приоритеты процессов: nice и renice',
      type: 'theory',
      content: [
        { type: 'text', value: 'Приоритет процесса (nice value) определяет сколько CPU времени он получит. Значения от -20 (высший приоритет) до 19 (низший). По умолчанию nice = 0. Только root может повышать приоритет.' },
        { type: 'code', language: 'bash', value: '# Запустить с пониженным приоритетом:\nnice -n 10 ./heavy-task.sh          # nice value = 10\nnice -n 19 tar -czvf backup.tar.gz /home  # минимальный приоритет\n\n# Запустить с повышенным приоритетом (root):\nsudo nice -n -10 ./critical-task.sh  # nice value = -10\n\n# Изменить приоритет запущенного процесса:\nrenice 10 -p 1234                   # nice = 10 для PID 1234\nsudo renice -5 -p 1234              # nice = -5\nrenice 15 -u bob                    # все процессы bob\n\n# Просмотр nice values:\nps -eo pid,nice,comm | head -20\n# PID   NI COMMAND\n#   1    0 systemd\n# 102  -10 critical-daemon\n# 503   10 backup-job\n\n# В top: NI столбец показывает nice value\ntop -o NI  # сортировать по nice' },
        { type: 'tip', value: 'Используйте nice для фоновых задач: бэкапы, компиляция, индексация. Пример: nice -n 19 tar -czvf backup.tar.gz /data — бэкап не будет мешать основным сервисам.' }
      ]
    },
    {
      id: 4,
      title: 'Фоновые процессы: jobs, fg, bg, nohup',
      type: 'theory',
      content: [
        { type: 'text', value: 'Linux позволяет запускать процессы в фоне, переключаться между ними и отсоединять от терминала. Это важно для долгих задач и работы через SSH.' },
        { type: 'code', language: 'bash', value: '# Запустить в фоне:\n./long-task.sh &\n# [1] 12345  — номер задания и PID\n\n# Ctrl+Z — приостановить текущий процесс\nvim file.txt\n# Нажать Ctrl+Z\n# [1]+  Stopped  vim file.txt\n\n# Управление заданиями:\njobs                   # список фоновых заданий\n# [1]+  Stopped  vim file.txt\n# [2]-  Running  ./task.sh &\n\nfg                     # вернуть последнее задание на передний план\nfg %1                  # вернуть задание #1\nbg %1                  # продолжить задание #1 в фоне\n\n# nohup — не завершать при закрытии терминала:\nnohup ./long-task.sh &\n# Вывод идёт в nohup.out\n\nnohup ./task.sh > output.log 2>&1 &\n# Перенаправить вывод в свой файл\n\n# disown — отсоединить от текущего shell:\n./task.sh &\ndisown %1              # процесс продолжит работу после закрытия терминала' },
        { type: 'heading', value: 'screen и tmux — терминальные мультиплексоры' },
        { type: 'code', language: 'bash', value: '# tmux — лучший выбор для работы через SSH:\nsudo apt install tmux\ntmux                           # новая сессия\ntmux new -s mywork             # именованная сессия\n\n# Внутри tmux:\n# Ctrl+b d       — отсоединиться (detach)\n# Ctrl+b c       — новое окно\n# Ctrl+b n/p     — следующее/предыдущее окно\n# Ctrl+b %       — вертикальное разделение\n# Ctrl+b "       — горизонтальное разделение\n\n# Переподключение:\ntmux ls                        # список сессий\ntmux attach -t mywork          # подключиться к сессии\ntmux kill-session -t mywork    # завершить сессию' },
        { type: 'tip', value: 'tmux — обязательный инструмент для работы через SSH. Если соединение оборвётся — процессы в tmux продолжат работать. Просто переподключитесь и выполните tmux attach.' }
      ]
    },
    {
      id: 5,
      title: 'Информация о процессах: /proc и lsof',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый процесс имеет каталог в /proc/PID/ с подробной информацией. lsof показывает открытые файлы процессов. Эти инструменты незаменимы для отладки.' },
        { type: 'code', language: 'bash', value: '# /proc/PID/ — информация о процессе:\nls /proc/1/\n# cmdline   — командная строка\n# environ   — переменные окружения\n# fd/       — открытые файловые дескрипторы\n# maps      — карта памяти\n# status    — состояние процесса\n\ncat /proc/1/cmdline | tr "\\0" " "   # командная строка PID 1\ncat /proc/1/status | head -10       # состояние\nls -la /proc/1/fd/                  # открытые файлы\n\n# lsof — открытые файлы и соединения:\nlsof -p 1234               # файлы открытые процессом\nlsof -i :80                # кто слушает порт 80\nlsof -i :443               # кто слушает порт 443\nlsof -u bob                # файлы открытые пользователем bob\nlsof /var/log/syslog       # кто использует файл\n\n# Найти процесс занимающий порт:\nsudo lsof -i :8080\n# COMMAND  PID   USER   FD TYPE DEVICE NODE NAME\n# nginx    1234  root   6u IPv4 ...    TCP *:8080 (LISTEN)\n\n# fuser — кто использует файл/порт:\nfuser -v /var/log/syslog\nfuser -v 80/tcp            # кто слушает TCP порт 80' },
        { type: 'tip', value: 'lsof -i :PORT — быстрый способ узнать какой процесс занимает порт. Очень полезно при ошибке "Address already in use".' }
      ]
    },
    {
      id: 6,
      title: 'Zombie и orphan процессы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Zombie (зомби) — процесс, который завершился, но его родитель не прочитал код возврата. Orphan (сирота) — процесс, чей родитель завершился. Orphan усыновляется init (PID 1).' },
        { type: 'code', language: 'bash', value: '# Найти зомби-процессы:\nps aux | grep Z\n# USER PID %CPU %MEM VSZ RSS TTY STAT TIME COMMAND\n# root 5678 0.0  0.0   0   0  ?   Z    0:00 [defunc]\n\n# Или через состояние:\nps -eo pid,ppid,stat,comm | grep Z\n# 5678 1234 Z   defunc\n\n# Количество зомби:\nps aux | awk \'$8 ~ /Z/ {count++} END {print count}\'\n\n# Зомби нельзя убить (они уже мертвы!)\n# Нужно убить РОДИТЕЛЯ или послать SIGCHLD:\nkill -SIGCHLD 1234    # попросить родителя собрать зомби\nkill 1234             # или убить родителя\n\n# Мониторинг зомби:\n# В top строка "zombie" показывает количество\n# Tasks: 245 total, 1 running, 243 sleeping, 0 stopped, 1 zombie\n\n# Orphan процессы — не проблема\n# init (PID 1) автоматически усыновляет orphan-процессы\n# и корректно собирает их при завершении' },
        { type: 'note', value: 'Один-два зомби — нормально. Сотни зомби — проблема в приложении (родитель не вызывает wait()). Решение: исправить приложение или перезапустить родительский процесс.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Управление процессами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Научитесь находить, мониторить и управлять процессами.',
      requirements: [
        'Найдите 5 процессов, потребляющих больше всего CPU',
        'Найдите 5 процессов, потребляющих больше всего памяти',
        'Запустите sleep 1000 в фоне, найдите его PID, затем завершите',
        'Используя lsof, найдите какой процесс слушает порт 22',
        'Проверьте наличие зомби-процессов',
        'Запустите задачу с пониженным приоритетом nice 19'
      ],
      hint: 'ps aux --sort=-%cpu | head -6 сортирует по CPU. ps aux --sort=-%mem для RAM. kill $(pgrep sleep) завершит процесс sleep. sudo lsof -i :22 покажет SSH.',
      expectedOutput: 'Топ-5 CPU: systemd, nginx, postgres...\nТоп-5 RAM: java, postgres, nginx...\nsleep 1000 запущен, PID: 12345, завершён SIGTERM\nlsof -i :22: sshd слушает порт 22\nЗомби: 0 (или Tasks: ... 0 zombie)\nnice -n 19 задача запущена с NI=19',
      solution: '# 1. Топ по CPU\nps aux --sort=-%cpu | head -6\n\n# 2. Топ по памяти\nps aux --sort=-%mem | head -6\n\n# 3. Фоновый процесс\nsleep 1000 &\n# [1] 12345\nps aux | grep "sleep 1000"\nkill $(pgrep -f "sleep 1000")\njobs  # проверить что завершён\n\n# 4. Кто слушает порт 22\nsudo lsof -i :22\n# или\nsudo ss -tlnp | grep :22\n\n# 5. Зомби\nps aux | awk \'$8 ~ /Z/\'\n# или в top — строка Tasks\n\n# 6. Nice\nnice -n 19 tar -czvf /tmp/test.tar.gz /etc/ &\nps -eo pid,ni,comm | grep tar',
      explanation: 'ps aux --sort сортирует по заданному полю (- для обратного порядка). pgrep ищет PID по имени процесса. lsof -i :PORT показывает процесс на порту. Зомби-процессы имеют состояние Z в столбце STAT.'
    }
  ]
}
