export default {
  id: 22,
  title: 'Metrics: Performance, Latency, Uptime',
  description: 'IT-метрики на английском: производительность, задержка, пропускная способность, аптайм.',
  lessons: [
    {
      id: 1,
      title: 'Performance Metrics: основные метрики',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основные метрики производительности:\n\nPERFORMANCE (производительность) — общая характеристика скорости и эффективности\nHigh performance (высокая производительность), poor performance (низкая производительность)\nThe app has excellent performance. (У приложения отличная производительность.)\nPerformance has degraded since the last update. (Производительность ухудшилась после последнего обновления.)\n\nRESPONSE TIME / LATENCY (время ответа / задержка)\nLatency is the time it takes for a request to be processed. (Задержка — это время обработки запроса.)\nLow latency is important for real-time applications. (Низкая задержка важна для приложений реального времени.)\nThe average response time is 200ms. (Среднее время ответа — 200 мс.)\nHigh latency is affecting the user experience. (Высокая задержка влияет на опыт пользователей.)\n\nTHROUGHPUT (пропускная способность) — количество операций в единицу времени\nThe system handles 1000 requests per second. (Система обрабатывает 1000 запросов в секунду.)\nWe need to improve throughput. (Нам нужно увеличить пропускную способность.)' }
      ]
    },
    {
      id: 2,
      title: 'Uptime and Availability',
      type: 'theory',
      content: [
        { type: 'text', value: 'UPTIME (аптайм) — время работы системы\nUPTIME = время, когда система была доступна\nDOWNTIME = время, когда система была недоступна\n\nSLA (Service Level Agreement) — соглашение об уровне услуг\nOur SLA guarantees 99.9% uptime. (Наше SLA гарантирует 99.9% аптайм.)\n\nAVAILABILITY (доступность):\n99% uptime = 3.65 days downtime per year (3 дня в год недоступности)\n99.9% uptime = 8.7 hours downtime per year (8.7 часов в год)\n99.99% uptime = 52.6 minutes downtime per year (52 минуты в год)\n99.999% uptime ("five nines") = 5.26 minutes per year\n\nОписание аптайма:\nThe service has been up for 99.9% of the time. (Сервис работал 99.9% времени.)\nThe system experienced 2 hours of downtime this month. (Система испытала 2 часа простоя в этом месяце.)\nWe aim for five nines availability. (Мы стремимся к аптайму "пять девяток".)' }
      ]
    },
    {
      id: 3,
      title: 'Error Rate and Reliability',
      type: 'theory',
      content: [
        { type: 'text', value: 'ERROR RATE (частота ошибок) — процент неудачных запросов\nThe error rate increased after the deployment. (Частота ошибок увеличилась после деплоя.)\nThe error rate is at 2% — this is too high. (Частота ошибок составляет 2% — это слишком много.)\nWe need to reduce the error rate below 0.1%. (Нам нужно снизить частоту ошибок ниже 0.1%.)\n\nRELIABILITY (надёжность) — насколько надёжна система\nA reliable system fails rarely. (Надёжная система редко даёт сбой.)\nWe measure reliability by MTBF. (Мы измеряем надёжность через MTBF.)\nMTBF = Mean Time Between Failures (среднее время между сбоями)\nMTTR = Mean Time To Recovery (среднее время до восстановления)\n\nSCORECARD фраз:\nThe error rate is 0.5%. (Частота ошибок — 0.5%.)\nAverage MTTR is 15 minutes. (Среднее время восстановления — 15 минут.)\nWe have a 99.9% success rate. (У нас 99.9% успешных запросов.)' }
      ]
    },
    {
      id: 4,
      title: 'CPU, Memory, Disk Usage',
      type: 'theory',
      content: [
        { type: 'text', value: 'Метрики ресурсов:\n\nCPU USAGE (использование процессора)\nThe CPU usage is at 80%. (Загрузка процессора на 80%.)\nHigh CPU usage is causing slow response times. (Высокая загрузка CPU вызывает медленное время ответа.)\nThe process is consuming 90% of CPU. (Процесс потребляет 90% CPU.)\n\nMEMORY USAGE (использование памяти)\nThe service is using 2GB of RAM. (Сервис использует 2 ГБ ОЗУ.)\nMemory usage is increasing — there might be a leak. (Использование памяти растёт — возможно, есть утечка.)\nFree up memory by restarting the service. (Освободи память, перезапустив сервис.)\n\nDISK USAGE (использование диска)\nDisk usage is at 95% — we need more storage. (Использование диска — 95%, нам нужно больше хранилища.)\nClean up old log files to free disk space. (Очисти старые лог-файлы, чтобы освободить место.)\n\nNETWORK BANDWIDTH (пропускная способность сети)\nWe are using 500MB/s of bandwidth. (Мы используем 500 МБ/с пропускной способности.)' }
      ]
    },
    {
      id: 5,
      title: 'Числа и единицы измерения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Единицы времени для метрик:\nms (milliseconds) — миллисекунды: 200ms response time\ns (seconds) — секунды: 5s timeout\nmin (minutes) — минуты: 10min uptime check\n\nЕдиницы данных:\nByte (B), Kilobyte (KB), Megabyte (MB), Gigabyte (GB), Terabyte (TB)\n\nЧастота запросов:\nRPS — Requests Per Second (запросов в секунду)\nRPM — Requests Per Minute (запросов в минуту)\nRPH — Requests Per Hour (запросов в час)\n\nThe API handles 5000 RPS. (API обрабатывает 5000 запросов в секунду.)\nThe database processes 100 queries per second. (База данных обрабатывает 100 запросов в секунду.)\n\nОписание изменений:\nResponse time increased by 50%. (Время ответа увеличилось на 50%.)\nWe reduced latency by 30%. (Мы сократили задержку на 30%.)\nThroughput improved from 100 to 500 RPS. (Пропускная способность улучшилась со 100 до 500 RPS.)' }
      ]
    },
    {
      id: 6,
      title: 'SRE и мониторинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевые SRE-концепции:\n\nMONITORING (мониторинг) — отслеживание метрик\nWe monitor response time, error rate, and CPU usage. (Мы мониторим время ответа, частоту ошибок и загрузку CPU.)\nSet up alerts for high error rates. (Настрой оповещения для высокой частоты ошибок.)\n\nALERT (оповещение) — уведомление при достижении порога\nThe alert fired when CPU usage exceeded 90%. (Оповещение сработало когда загрузка CPU превысила 90%.)\nWe receive an alert if the error rate is above 1%. (Мы получаем оповещение, если частота ошибок выше 1%.)\n\nDASHBOARD (дашборд) — визуализация метрик\nCheck the Grafana dashboard for real-time metrics. (Проверь дашборд Grafana для метрик в реальном времени.)\n\nLOG (лог) — запись событий\nAnalyze the logs to find the root cause. (Проанализируй логи, чтобы найти первопричину.)\nThe logs show a spike in errors at 2 AM. (Логи показывают всплеск ошибок в 2 ночи.)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Описание метрик',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Среднее время ответа — 150 миллисекунд.', answer: 'The average response time is 150 milliseconds.' },
            { id: 2, question: 'Мы сократили задержку на 40%.', answer: 'We reduced latency by 40%.' },
            { id: 3, question: 'Сервис обрабатывает 2000 запросов в секунду.', answer: 'The service handles 2000 requests per second.' },
            { id: 4, question: 'Загрузка CPU на 85% — это слишком много.', answer: 'CPU usage is at 85% — this is too high.' },
            { id: 5, question: 'Наше SLA гарантирует 99.9% аптайм.', answer: 'Our SLA guarantees 99.9% uptime.' },
            { id: 6, question: 'Использование памяти растёт — возможно, есть утечка.', answer: 'Memory usage is increasing — there might be a leak.' },
            { id: 7, question: 'Настрой оповещение если частота ошибок превышает 1%.', answer: 'Set up an alert if the error rate exceeds 1%.' }
          ]
        }
      ]
    }
  ]
}
