export default {
  id: 32,
  title: 'Процессы (multiprocessing)',
  description: 'Изучим параллельные вычисления через мультипроцессинг: Process, Pool для параллельных CPU-задач и Queue для обмена данными',
  lessons: [
    {
      id: 1, title: 'Process — создание отдельных процессов', type: 'theory',
      content: [
        { type: 'text', value: 'В отличие от потоков, каждый процесс имеет свою копию памяти и обходит GIL. Это позволяет реально использовать все ядра процессора для CPU-нагрузки.' },
        { type: 'heading', value: 'Создание процессов' },
        { type: 'code', language: 'python', value: 'import multiprocessing\nimport time\nimport os\n\ndef cpu_task(n: int) -> int:\n    print(f"PID {os.getpid()}: считаем до {n}")\n    result = sum(range(n))\n    return result\n\nif __name__ == "__main__":  # ОБЯЗАТЕЛЬНО для Windows!\n    # Создаём процессы\n    p1 = multiprocessing.Process(target=cpu_task, args=(10_000_000,))\n    p2 = multiprocessing.Process(target=cpu_task, args=(20_000_000,))\n\n    start = time.time()\n    p1.start()\n    p2.start()\n    p1.join()\n    p2.join()\n    print(f"Параллельно: {time.time()-start:.2f} сек")' },
        { type: 'heading', value: 'Получение результата через Value и Array' },
        { type: 'code', language: 'python', value: 'import multiprocessing\n\ndef square(x, result):\n    result.value = x * x\n\nif __name__ == "__main__":\n    result = multiprocessing.Value("i", 0)  # shared integer\n    p = multiprocessing.Process(target=square, args=(7, result))\n    p.start()\n    p.join()\n    print(f"7^2 = {result.value}")  # 49' },
        { type: 'warning', value: 'if __name__ == "__main__": обязателен на Windows — без него multiprocessing рекурсивно создаёт новые процессы. На Linux/Mac это не нужно, но это хорошая практика.' }
      ]
    },
    {
      id: 2, title: 'Pool — пул процессов', type: 'theory',
      content: [
        { type: 'text', value: 'Pool создаёт пул рабочих процессов и автоматически распределяет задачи между ними. Это наиболее удобный способ параллельной обработки коллекций данных.' },
        { type: 'heading', value: 'Pool.map() и Pool.starmap()' },
        { type: 'code', language: 'python', value: 'import multiprocessing\nimport time\n\ndef heavy_computation(n: int) -> int:\n    """CPU-нагрузка: нахождение суммы квадратов."""\n    return sum(i*i for i in range(n))\n\nif __name__ == "__main__":\n    numbers = [1_000_000] * 8  # 8 одинаковых задач\n\n    # Последовательно\n    start = time.time()\n    results_seq = [heavy_computation(n) for n in numbers]\n    print(f"Последовательно: {time.time()-start:.2f} сек")\n\n    # С пулом из 4 процессов\n    start = time.time()\n    with multiprocessing.Pool(processes=4) as pool:\n        results_par = pool.map(heavy_computation, numbers)\n    print(f"Параллельно (4 proc): {time.time()-start:.2f} сек")' },
        { type: 'heading', value: 'Pool.starmap() — функция с несколькими аргументами' },
        { type: 'code', language: 'python', value: 'import multiprocessing\n\ndef power(base: int, exp: int) -> int:\n    return base ** exp\n\nif __name__ == "__main__":\n    tasks = [(2, 10), (3, 8), (5, 6), (7, 4)]\n\n    with multiprocessing.Pool() as pool:\n        results = pool.starmap(power, tasks)\n    print(results)  # [1024, 6561, 15625, 2401]' },
        { type: 'tip', value: 'multiprocessing.Pool() без аргументов создаёт столько процессов, сколько ядер в системе. Это оптимально для CPU-задач.' }
      ]
    },
    {
      id: 3, title: 'multiprocessing.Queue — обмен данными', type: 'theory',
      content: [
        { type: 'text', value: 'Процессы не разделяют память, поэтому для обмена данными используется multiprocessing.Queue — потокобезопасная и процессобезопасная очередь.' },
        { type: 'heading', value: 'Паттерн Producer-Consumer с процессами' },
        { type: 'code', language: 'python', value: 'import multiprocessing\nimport time\n\ndef producer(q, items):\n    for item in items:\n        time.sleep(0.1)\n        q.put(item)\n        print(f"Добавлено: {item}")\n    q.put(None)  # сигнал завершения\n\ndef consumer(q):\n    while True:\n        item = q.get()\n        if item is None:\n            break\n        result = item ** 2\n        print(f"Обработано: {item}^2 = {result}")\n\nif __name__ == "__main__":\n    q = multiprocessing.Queue()\n    items = list(range(1, 8))\n\n    p1 = multiprocessing.Process(target=producer, args=(q, items))\n    p2 = multiprocessing.Process(target=consumer, args=(q,))\n\n    p1.start()\n    p2.start()\n    p1.join()\n    p2.join()' }
      ]
    },
    {
      id: 4, title: 'Pool.apply_async() и callback', type: 'theory',
      content: [
        { type: 'text', value: 'apply_async() запускает задачу асинхронно и возвращает AsyncResult. Через callback можно обрабатывать результат по мере готовности.' },
        { type: 'heading', value: 'Асинхронный пул' },
        { type: 'code', language: 'python', value: 'import multiprocessing\nimport time\n\ndef slow_task(n: int) -> int:\n    time.sleep(n * 0.1)\n    return n * n\n\ndef on_result(result):\n    print(f"Готово: {result}")\n\ndef on_error(error):\n    print(f"Ошибка: {error}")\n\nif __name__ == "__main__":\n    with multiprocessing.Pool(processes=3) as pool:\n        # Запускаем несколько задач асинхронно\n        async_results = [\n            pool.apply_async(slow_task, (i,),\n                             callback=on_result,\n                             error_callback=on_error)\n            for i in range(1, 6)\n        ]\n\n        # Ждём все результаты\n        results = [ar.get() for ar in async_results]\n        print(f"Все результаты: {results}")' },
        { type: 'note', value: 'callback вызывается в основном процессе после завершения задачи. Это удобно для прогресс-баров или логирования без блокировки.' }
      ]
    },
    {
      id: 5, title: 'ProcessPoolExecutor — современный API', type: 'theory',
      content: [
        { type: 'text', value: 'ProcessPoolExecutor из concurrent.futures — высокоуровневый API, аналогичный ThreadPoolExecutor. Он удобнее Pool и лучше интегрируется с современным Python.' },
        { type: 'heading', value: 'ProcessPoolExecutor' },
        { type: 'code', language: 'python', value: 'from concurrent.futures import ProcessPoolExecutor, as_completed\nimport time\n\ndef factorize(n: int) -> list:\n    """Находит простые делители числа."""\n    factors = []\n    d = 2\n    while d * d <= n:\n        while n % d == 0:\n            factors.append(d)\n            n //= d\n        d += 1\n    if n > 1:\n        factors.append(n)\n    return factors\n\nif __name__ == "__main__":\n    numbers = [2**31-1, 2**29-1, 2**30-1, 2**28-1]\n\n    with ProcessPoolExecutor(max_workers=4) as executor:\n        futures = {executor.submit(factorize, n): n for n in numbers}\n        for future in as_completed(futures):\n            n = futures[future]\n            factors = future.result()\n            print(f"{n}: {factors}")' },
        { type: 'tip', value: 'Правило выбора: I/O нагрузка → asyncio или ThreadPoolExecutor. CPU нагрузка → ProcessPoolExecutor или multiprocessing.Pool.' }
      ]
    },
    {
      id: 6, title: 'Практика: Параллельный подсчёт', type: 'practice', difficulty: 'medium',
      description: 'Реализуй параллельный подсчёт простых чисел в диапазоне, разбив задачу на части между процессами.',
      requirements: [
        'Функция count_primes(start, end) возвращает список простых чисел в диапазоне [start, end)',
        'Функция is_prime(n) проверяет простоту числа',
        'Раздели диапазон 1-1000000 на 4 равные части',
        'Используй Pool.map() для параллельного подсчёта',
        'Сравни время с последовательным вариантом',
        'Выведи количество найденных простых чисел'
      ],
      expectedOutput: 'Диапазоны: [(2, 250000), (250000, 500000), (500000, 750000), (750000, 1000000)]\nПростых чисел: 78498\nПараллельно: ~X.XX сек\nПоследовательно: ~X.XX сек',
      hint: 'ranges = [(i*250000+2, (i+1)*250000) for i in range(4)]. Pool.starmap(count_primes, ranges). Суммируй len() всех частичных результатов.',
      solution: 'import multiprocessing\nimport time\n\ndef is_prime(n: int) -> bool:\n    if n < 2:\n        return False\n    if n == 2:\n        return True\n    if n % 2 == 0:\n        return False\n    for i in range(3, int(n**0.5)+1, 2):\n        if n % i == 0:\n            return False\n    return True\n\ndef count_primes(start: int, end: int) -> list:\n    return [n for n in range(start, end) if is_prime(n)]\n\nif __name__ == "__main__":\n    ranges = [(i*250000+2, (i+1)*250000) for i in range(4)]\n    print(f"Диапазоны: {ranges}")\n\n    # Параллельно\n    start = time.time()\n    with multiprocessing.Pool(processes=4) as pool:\n        parts = pool.starmap(count_primes, ranges)\n    all_primes = [p for part in parts for p in part]\n    print(f"Простых чисел: {len(all_primes)}")\n    print(f"Параллельно: ~{time.time()-start:.2f} сек")\n\n    # Последовательно\n    start = time.time()\n    count_primes(2, 1_000_000)\n    print(f"Последовательно: ~{time.time()-start:.2f} сек")',
      explanation: 'Задача разбивается на 4 части — каждая идёт в отдельный процесс. Pool.starmap() передаёт кортежи аргументов в функцию. Подсчёт простых чисел — CPU-нагрузка, поэтому multiprocessing реально ускоряет работу, в отличие от threading.'
    }
  ]
}
