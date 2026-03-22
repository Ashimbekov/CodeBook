export default {
  id: 31,
  title: 'Потоки (threading)',
  description: 'Изучим многопоточность в Python: создание потоков через Thread, синхронизацию через Lock, взаимодействие через Event и Queue',
  lessons: [
    {
      id: 1, title: 'Thread — создание и запуск потоков', type: 'theory',
      content: [
        { type: 'text', value: 'Поток (thread) — это единица выполнения внутри процесса. Потоки разделяют память процесса, что удобно для обмена данными, но требует осторожности при одновременном изменении.' },
        { type: 'heading', value: 'Создание потока' },
        { type: 'code', language: 'python', value: 'import threading\nimport time\n\ndef worker(name: str, delay: float):\n    print(f"Поток {name}: начало")\n    time.sleep(delay)\n    print(f"Поток {name}: конец")\n\n# Создаём потоки\nt1 = threading.Thread(target=worker, args=("A", 2))\nt2 = threading.Thread(target=worker, args=("B", 1))\n\nt1.start()  # запускаем\nt2.start()\n\nprint("Главный поток: потоки запущены")\n\nt1.join()  # ждём завершения t1\nt2.join()  # ждём завершения t2\n\nprint("Главный поток: всё готово")' },
        { type: 'heading', value: 'Поток-класс' },
        { type: 'code', language: 'python', value: 'import threading\n\nclass DownloadThread(threading.Thread):\n    def __init__(self, url: str):\n        super().__init__()\n        self.url = url\n        self.result = None\n        self.daemon = True  # поток завершится при закрытии программы\n\n    def run(self):\n        import time\n        time.sleep(1)  # имитация загрузки\n        self.result = f"Данные из {self.url}"\n\nthreads = [DownloadThread(f"url{i}") for i in range(3)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\n    print(t.result)' },
        { type: 'tip', value: 'daemon=True означает, что поток завершится автоматически когда главный поток закончит работу. Без daemon=True программа будет ждать все потоки.' }
      ]
    },
    {
      id: 2, title: 'GIL и когда потоки полезны', type: 'theory',
      content: [
        { type: 'text', value: 'GIL (Global Interpreter Lock) — мьютекс, не позволяющий нескольким потокам одновременно выполнять Python-код. Из-за него потоки не ускоряют CPU-нагрузку, но отлично подходят для I/O.' },
        { type: 'heading', value: 'CPU-нагрузка vs I/O-нагрузка' },
        { type: 'code', language: 'python', value: 'import threading\nimport time\n\n# I/O-нагрузка: потоки ПОЛЕЗНЫ (GIL отпускается при I/O)\ndef io_task(name):\n    time.sleep(2)  # sleep отпускает GIL\n    print(f"{name}: завершён I/O")\n\nstart = time.time()\nthreads = [threading.Thread(target=io_task, args=(f"Поток {i}",)) for i in range(5)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(f"I/O параллельно: {time.time()-start:.1f} сек")  # ~2.0\n\n# CPU-нагрузка: потоки НЕ помогают (GIL не отпускается)\ndef cpu_task():\n    return sum(range(10_000_000))\n\nstart = time.time()\nthreads = [threading.Thread(target=cpu_task) for _ in range(4)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(f"CPU с потоками: {time.time()-start:.1f} сек")  # не быстрее sequential!' },
        { type: 'note', value: 'Для CPU-нагрузки используй multiprocessing. Для I/O-нагрузки (сеть, файлы, БД) — threading или asyncio.' }
      ]
    },
    {
      id: 3, title: 'Lock — предотвращение гонки данных', type: 'theory',
      content: [
        { type: 'text', value: 'Гонка данных (race condition) — когда два потока одновременно изменяют одну переменную, приводя к непредсказуемому результату. Lock (замок) позволяет только одному потоку выполнять критическую секцию.' },
        { type: 'heading', value: 'Проблема без Lock' },
        { type: 'code', language: 'python', value: 'import threading\n\ncounter = 0  # общая переменная\n\ndef increment_unsafe():\n    global counter\n    for _ in range(100_000):\n        counter += 1  # НЕ атомарная операция!\n\nthreads = [threading.Thread(target=increment_unsafe) for _ in range(5)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(f"Без Lock: {counter}")  # < 500000 — данные потерялись!' },
        { type: 'heading', value: 'Решение через Lock' },
        { type: 'code', language: 'python', value: 'import threading\n\ncounter = 0\nlock = threading.Lock()  # создаём один замок\n\ndef increment_safe():\n    global counter\n    for _ in range(100_000):\n        with lock:  # только один поток входит сюда\n            counter += 1  # атомарно!\n\nthreads = [threading.Thread(target=increment_safe) for _ in range(5)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(f"С Lock: {counter}")  # 500000 — всегда правильно!' },
        { type: 'tip', value: 'Используй lock как контекстный менеджер (with lock:) — это гарантирует освобождение замка даже при исключении.' }
      ]
    },
    {
      id: 4, title: 'Event — сигнализация между потоками', type: 'theory',
      content: [
        { type: 'text', value: 'Event — это простой флаг для передачи сигналов между потоками. Один поток "устанавливает" событие (set), другой "ждёт" его (wait). Это позволяет координировать работу потоков.' },
        { type: 'heading', value: 'Использование Event' },
        { type: 'code', language: 'python', value: 'import threading\nimport time\n\ndata_ready = threading.Event()\nshared_data = None\n\ndef producer():\n    global shared_data\n    print("Производитель: готовим данные...")\n    time.sleep(2)\n    shared_data = [1, 2, 3, 4, 5]\n    print("Производитель: данные готовы!")\n    data_ready.set()  # сигнализируем\n\ndef consumer():\n    print("Потребитель: ждём данные...")\n    data_ready.wait()  # блокируемся до set()\n    print(f"Потребитель: получили {shared_data}")\n\nt1 = threading.Thread(target=producer)\nt2 = threading.Thread(target=consumer)\nt1.start()\nt2.start()\nt1.join()\nt2.join()' },
        { type: 'heading', value: 'Event с таймаутом' },
        { type: 'code', language: 'python', value: 'import threading\n\nstop_event = threading.Event()\n\ndef worker():\n    while not stop_event.is_set():  # проверяем флаг\n        print("Работаем...")\n        stop_event.wait(timeout=1)  # пауза 1 сек или до сигнала\n    print("Поток завершён по сигналу")\n\nt = threading.Thread(target=worker)\nt.start()\n\nimport time\ntime.sleep(3.5)\nstop_event.set()  # отправляем сигнал остановки\nt.join()' }
      ]
    },
    {
      id: 5, title: 'Queue — потокобезопасная очередь', type: 'theory',
      content: [
        { type: 'text', value: 'Queue из модуля queue — потокобезопасная очередь для обмена данными между потоками. Не нужны Lock — Queue обеспечивает синхронизацию сама.' },
        { type: 'heading', value: 'Паттерн Producer-Consumer' },
        { type: 'code', language: 'python', value: 'import threading\nimport queue\nimport time\n\nq = queue.Queue(maxsize=5)  # буфер на 5 элементов\n\ndef producer(q):\n    for i in range(10):\n        item = f"задача_{i}"\n        q.put(item)  # блокирует если очередь полна\n        print(f"Добавлено: {item}")\n        time.sleep(0.1)\n    q.put(None)  # сигнал о завершении\n\ndef consumer(q):\n    while True:\n        item = q.get()  # блокирует если очередь пуста\n        if item is None:\n            break\n        print(f"Обработано: {item}")\n        time.sleep(0.3)\n        q.task_done()  # сообщаем что элемент обработан\n\nt1 = threading.Thread(target=producer, args=(q,))\nt2 = threading.Thread(target=consumer, args=(q,))\nt1.start()\nt2.start()\nt1.join()\nt2.join()' },
        { type: 'note', value: 'Queue.put() блокирует если очередь полна (maxsize), Queue.get() — если пуста. Это автоматически регулирует скорость между producer и consumer.' }
      ]
    },
    {
      id: 6, title: 'ThreadPoolExecutor', type: 'theory',
      content: [
        { type: 'text', value: 'ThreadPoolExecutor из concurrent.futures — высокоуровневый API для пула потоков. Он управляет созданием/завершением потоков и удобно возвращает результаты через Future.' },
        { type: 'heading', value: 'Использование ThreadPoolExecutor' },
        { type: 'code', language: 'python', value: 'from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndef fetch_data(url: str) -> str:\n    time.sleep(1)  # имитация I/O\n    return f"Данные из {url}"\n\nurls = ["url1", "url2", "url3", "url4", "url5"]\n\n# map — проще, порядок результатов сохраняется\nwith ThreadPoolExecutor(max_workers=3) as executor:\n    results = list(executor.map(fetch_data, urls))\nprint(results)\n\n# submit + as_completed — по мере готовности\nwith ThreadPoolExecutor(max_workers=3) as executor:\n    futures = {executor.submit(fetch_data, url): url for url in urls}\n    for future in as_completed(futures):\n        url = futures[future]\n        result = future.result()\n        print(f"{url}: {result}")' },
        { type: 'tip', value: 'ThreadPoolExecutor — предпочтительный способ работы с потоками в современном Python. Он автоматически управляет пулом и очищает ресурсы.' }
      ]
    },
    {
      id: 7, title: 'Практика: Параллельный обработчик файлов', type: 'practice', difficulty: 'medium',
      description: 'Создай систему параллельной обработки данных с использованием Queue и ThreadPoolExecutor.',
      requirements: [
        'Функция process_item(item) имитирует обработку через time.sleep(0.2) и возвращает item.upper()',
        'Используй ThreadPoolExecutor с max_workers=4',
        'Обработай список из 10 элементов параллельно',
        'Используй as_completed для вывода результатов по мере готовности',
        'Замерь время выполнения и сравни с последовательным подходом'
      ],
      expectedOutput: 'Готово: ITEM_0\nГотово: ITEM_2\nГотово: ITEM_1\n...\nПараллельно: ~0.4 сек\nПоследовательно: ~2.0 сек',
      hint: 'items = [f"item_{i}" for i in range(10)]. С max_workers=4 и delay=0.2 нужно ceil(10/4)*0.2 = ~0.6 сек.',
      solution: 'from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndef process_item(item: str) -> str:\n    time.sleep(0.2)\n    return item.upper()\n\nitems = [f"item_{i}" for i in range(10)]\n\n# Параллельно\nprint("Параллельная обработка:")\nstart = time.time()\nwith ThreadPoolExecutor(max_workers=4) as executor:\n    futures = {executor.submit(process_item, item): item for item in items}\n    for future in as_completed(futures):\n        result = future.result()\n        print(f"Готово: {result}")\nparallel_time = time.time() - start\nprint(f"Параллельно: ~{parallel_time:.1f} сек")\n\n# Последовательно\nprint("\\nПоследовательная обработка:")\nstart = time.time()\nfor item in items:\n    process_item(item)\nseq_time = time.time() - start\nprint(f"Последовательно: ~{seq_time:.1f} сек")',
      explanation: 'ThreadPoolExecutor с 4 потоками обрабатывает 4 элемента одновременно. 10 элементов с delay=0.2 обработаются за ceil(10/4)*0.2 ≈ 0.6 сек, против 2.0 сек последовательно. as_completed выводит результаты как только они готовы.'
    }
  ]
}
