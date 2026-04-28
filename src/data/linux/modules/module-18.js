export default {
  id: 18,
  title: 'Производительность',
  description: 'Анализ производительности Linux: CPU, память, диск, сеть. vmstat, iostat, sar, strace, perf.',
  lessons: [
    {
      id: 1,
      title: 'Обзор системных ресурсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Четыре основных ресурса: CPU, RAM, Disk I/O, Network. Узкое место (bottleneck) в любом из них снижает общую производительность. Первый шаг — определить какой ресурс перегружен.' },
        { type: 'code', language: 'bash', value: '# Быстрый обзор системы:\n\n# CPU и нагрузка:\nuptime\n# 10:30:00 up 14 days, load average: 0.52, 0.38, 0.25\n# load average: за 1 мин, 5 мин, 15 мин\n# Норма: load average <= количество CPU ядер\n\nnproc                     # количество ядер\n# Если load > nproc — система перегружена\n\n# Память:\nfree -h\n#        total   used   free   shared  buff/cache  available\n# Mem:    16G    4.5G   2.0G   256M     9.5G        11G\n# Swap:    2G      0B   2.0G\n# Важно: available (не free!) — реально доступная память\n\n# Диск:\ndf -h                     # использование дисков\niostat -x 1 3             # I/O статистика (3 раза по 1 сек)\n\n# Сеть:\nss -s                     # статистика сокетов\nip -s link show eth0      # статистика интерфейса\n\n# Всё вместе:\nhtop                      # интерактивный мониторинг\nglances                   # sudo apt install glances' },
        { type: 'tip', value: 'Правило: если load average > количество ядер CPU — система перегружена. free -h: смотрите на "available", а не "free". buff/cache — это кэш файловой системы, он освобождается при необходимости.' }
      ]
    },
    {
      id: 2,
      title: 'CPU: vmstat, mpstat',
      type: 'theory',
      content: [
        { type: 'text', value: 'vmstat показывает статистику CPU, памяти, I/O в реальном времени. mpstat — детальную статистику по каждому ядру CPU.' },
        { type: 'code', language: 'bash', value: '# vmstat — обновление каждую секунду:\nvmstat 1\n# procs  memory          swap    io      system      cpu\n# r  b   swpd  free      si  so  bi  bo  in   cs   us sy id wa\n# 1  0   0     8000000   0   0   10  20  100  200  5  2  92  1\n\n# Столбцы CPU:\n# us — user space (приложения)\n# sy — system (ядро)\n# id — idle (простой)\n# wa — I/O wait (ожидание диска)\n# st — steal (VM, забирается гипервизором)\n\n# Проблемы:\n# wa > 20% — узкое место в дисковом I/O\n# us + sy > 80% — CPU перегружен\n# r (running) >> nproc — очередь процессов\n\n# mpstat — статистика по ядрам:\nsudo apt install sysstat\nmpstat -P ALL 1\n# CPU   %usr  %sys  %iowait  %idle\n# all   5.0   2.0   1.0      92.0\n# 0     10.0  3.0   0.5      86.5\n# 1     2.0   1.0   1.5      95.5\n\n# Если одно ядро загружено на 100%, а остальные простаивают —\n# приложение однопоточное' },
        { type: 'note', value: 'I/O wait (wa) — время ожидания дискового ввода-вывода. Высокий wa при низком us/sy означает что CPU простаивает, ожидая медленный диск. Решение: SSD, оптимизация запросов к БД, кэширование.' }
      ]
    },
    {
      id: 3,
      title: 'Память и I/O: free, iostat',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мониторинг памяти и дискового I/O критичен для серверов баз данных и высоконагруженных приложений. OOM killer уничтожает процессы при нехватке RAM.' },
        { type: 'code', language: 'bash', value: '# Детальная информация о памяти:\nfree -h\ncat /proc/meminfo | head -10\n\n# Потребление по процессам:\nps aux --sort=-%mem | head -10\n\n# smem — детальное потребление:\nsudo apt install smem\nsmem -rs pss | head -10\n\n# iostat — дисковый I/O:\niostat -xz 1\n# Device  r/s   w/s   rkB/s  wkB/s  await  %util\n# sda     10    50    400    2000   1.2    15%\n# sdb     200   100   8000   4000   5.0    85%\n\n# Ключевые метрики:\n# r/s, w/s    — операции чтения/записи в секунду\n# await       — среднее время ожидания (мс)\n# %util       — утилизация диска (100% = насыщение)\n# Проблема: %util > 80%, await > 10ms\n\n# iotop — top для дискового I/O:\nsudo apt install iotop\nsudo iotop\nsudo iotop -o      # только активные процессы\n\n# Найти процесс с максимальным I/O:\nsudo iotop -b -n 1 | head -10' },
        { type: 'tip', value: 'Если %util диска близок к 100% — это bottleneck. Решения: перейти на SSD/NVMe, оптимизировать запросы к БД, добавить RAM для кэширования, распределить I/O между дисками.' }
      ]
    },
    {
      id: 4,
      title: 'strace — трассировка системных вызовов',
      type: 'theory',
      content: [
        { type: 'text', value: 'strace перехватывает системные вызовы процесса — обращения к ядру (открытие файлов, сетевые операции, работа с памятью). Незаменим для отладки проблем типа "программа не запускается" или "программа зависла".' },
        { type: 'code', language: 'bash', value: '# Трассировка команды:\nstrace ls /tmp\n# open("/tmp", O_RDONLY|O_NONBLOCK|O_DIRECTORY) = 3\n# getdents64(3, ...) = 168\n# write(1, "file1.txt\\nfile2.txt\\n", 22) = 22\n\n# Подключиться к работающему процессу:\nstrace -p 1234\n\n# Только определённые вызовы:\nstrace -e open,read,write ls /tmp\nstrace -e network nginx      # только сетевые вызовы\nstrace -e file nginx         # только файловые операции\n\n# С временными метками:\nstrace -t ls /tmp            # время\nstrace -T ls /tmp            # длительность каждого вызова\n\n# Статистика вызовов:\nstrace -c ls /tmp\n# % time  seconds  calls  syscall\n# 25.00   0.000010   3    read\n# 18.75   0.000008   2    write\n# 12.50   0.000005   5    open\n\n# Записать в файл:\nstrace -o /tmp/trace.log -f -p 1234\n# -f следить за дочерними процессами\n\n# Практические примеры:\n# Почему программа не запускается?\nstrace ./myapp 2>&1 | grep -i "no such file"\n# Найдёт отсутствующие библиотеки или файлы\n\n# Какие файлы открывает программа?\nstrace -e open,openat nginx 2>&1 | grep -v ENOENT' },
        { type: 'tip', value: 'strace -c показывает статистику: какие системные вызовы занимают больше всего времени. Это помогает найти bottleneck: много read/write — проблема с диском, много connect — проблема с сетью.' }
      ]
    },
    {
      id: 5,
      title: 'sar — историческая статистика',
      type: 'theory',
      content: [
        { type: 'text', value: 'sar (System Activity Reporter) собирает и хранит историческую статистику системы. Позволяет посмотреть нагрузку за прошлые дни/часы. Часть пакета sysstat.' },
        { type: 'code', language: 'bash', value: '# Установка и включение:\nsudo apt install sysstat\nsudo systemctl enable --now sysstat\n# Данные собираются каждые 10 минут\n\n# CPU за сегодня:\nsar -u               # CPU\nsar -u 1 5           # CPU: 5 раз по 1 секунде\n\n# Память:\nsar -r               # использование RAM\n# kbmemfree kbmemused  %memused kbbuffers kbcached\n\n# Диск:\nsar -d               # дисковый I/O\nsar -b               # I/O throughput\n\n# Сеть:\nsar -n DEV           # сетевые интерфейсы\nsar -n SOCK          # сокеты\n\n# За конкретную дату:\nsar -u -f /var/log/sysstat/sa15   # 15-е число\n\n# За период:\nsar -u -s 10:00:00 -e 12:00:00   # с 10:00 до 12:00\n\n# Экспорт в CSV:\nsar -u | sadf -d -- > cpu_stats.csv' },
        { type: 'tip', value: 'sar незаменим для ответа на вопрос "что происходило вчера в 3 часа ночи, когда сервер тормозил?". Включите sysstat на всех production серверах — данные собираются автоматически.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализ производительности',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите комплексный анализ производительности системы.',
      requirements: [
        'Определите load average и сравните с количеством ядер CPU',
        'Проанализируйте использование RAM: total, used, available, swap',
        'Проверьте дисковый I/O: найдите самый загруженный диск',
        'Найдите топ-5 процессов по CPU и по памяти',
        'Используя vmstat, определите есть ли I/O wait проблема',
        'Напишите скрипт сбора метрик: CPU, RAM, Disk, Load Average'
      ],
      hint: 'uptime для load. nproc для ядер. free -h для RAM. iostat -x 1 3 для дисков. ps aux --sort=-%cpu для топа. vmstat 1 5 — столбец wa.',
      expectedOutput: 'Load: 0.52 (4 ядра — норма)\nRAM: 16G total, 4.5G used, 11G available, 0B swap\nДиск: sda %util=15% (норма)\nТоп CPU: postgres (5.2%), nginx (2.1%)\nТоп RAM: postgres (512M), nginx (120M)\nvmstat wa: 1% (I/O wait в норме)',
      solution: '#!/bin/bash\necho "=== Производительность системы ==="\necho\necho "--- Load Average ---"\nuptime\necho "Ядер CPU: $(nproc)"\n\necho\necho "--- Память ---"\nfree -h\n\necho\necho "--- Диск ---"\ndf -h\niostat -x 1 1 2>/dev/null || echo "iostat не установлен (apt install sysstat)"\n\necho\necho "--- Топ-5 по CPU ---"\nps aux --sort=-%cpu | head -6\n\necho\necho "--- Топ-5 по RAM ---"\nps aux --sort=-%mem | head -6\n\necho\necho "--- vmstat (5 секунд) ---"\nvmstat 1 5\n\necho\necho "--- Swap ---"\nswapon --show',
      explanation: 'Load average сравнивается с nproc: load < nproc — норма. free -h показывает available — реально доступную память. iostat %util > 80% — диск перегружен. vmstat wa > 20% — проблема I/O. ps --sort сортирует по CPU или памяти.'
    }
  ]
}
