export default {
  id: 30,
  title: 'Async/Await (asyncio)',
  description: 'Освоим асинхронное программирование в Python: корутины, asyncio.run, gather, create_task и работу с асинхронным I/O',
  lessons: [
    {
      id: 1, title: 'Зачем нужна асинхронность', type: 'theory',
      content: [
        { type: 'text', value: 'Асинхронное программирование позволяет программе не "простаивать" во время ожидания — сетевых запросов, файловых операций, базы данных. Пока одна задача ждёт, другая выполняется.' },
        { type: 'tip', value: 'Представь официанта: синхронный официант принял заказ, ждёт у кухни, потом идёт к следующему столику. Асинхронный — принял заказ, пока готовится еда, принял ещё 10 заказов.' },
        { type: 'heading', value: 'Синхронно vs асинхронно' },
        { type: 'code', language: 'python', value: 'import time\n\n# СИНХРОННО: 3 запроса по 1 секунде = 3 секунды\ndef fetch_sync(url):\n    time.sleep(1)  # имитация сетевого запроса\n    return f"Данные из {url}"\n\nstart = time.time()\nfor url in ["url1", "url2", "url3"]:\n    data = fetch_sync(url)\n    print(data)\nprint(f"Синхронно: {time.time()-start:.1f} сек")  # ~3.0 сек' },
        { type: 'code', language: 'python', value: 'import asyncio\n\n# АСИНХРОННО: 3 запроса параллельно = ~1 секунда!\nasync def fetch_async(url):\n    await asyncio.sleep(1)  # НЕ блокирует поток!\n    return f"Данные из {url}"\n\nasync def main():\n    import time\n    start = time.time()\n    # Запускаем все три одновременно\n    results = await asyncio.gather(\n        fetch_async("url1"),\n        fetch_async("url2"),\n        fetch_async("url3"),\n    )\n    for r in results:\n        print(r)\n    print(f"Асинхронно: {time.time()-start:.1f} сек")  # ~1.0 сек\n\nasyncio.run(main())' }
      ]
    },
    {
      id: 2, title: 'async def и await', type: 'theory',
      content: [
        { type: 'text', value: 'async def создаёт корутину — функцию, которую можно приостановить. await говорит "подожди результат здесь, но не блокируй поток". Корутина выполняется только внутри event loop.' },
        { type: 'heading', value: 'Базовый синтаксис' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def say_hello(name: str, delay: float):\n    print(f"Привет от {name}!")\n    await asyncio.sleep(delay)  # асинхронная пауза\n    print(f"{name} завершил работу")\n    return f"Результат {name}"\n\nasync def main():\n    # await — ждём одну корутину\n    result = await say_hello("Аня", 1)\n    print(result)\n\nasyncio.run(main())  # Запуск event loop' },
        { type: 'heading', value: 'Что можно делать с await' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def example():\n    # 1. Ждём другую корутину\n    result = await some_coroutine()\n\n    # 2. Ждём asyncio.sleep (неблокирующая пауза)\n    await asyncio.sleep(0.1)\n\n    # 3. Ждём asyncio.gather (несколько задач)\n    r1, r2 = await asyncio.gather(coro1(), coro2())\n\n    # 4. Ждём Task\n    task = asyncio.create_task(some_coroutine())\n    result = await task' },
        { type: 'warning', value: 'Нельзя использовать await вне async-функции. Нельзя вызвать async-функцию без await или asyncio.run() — это создаст объект-корутину, но не запустит её.' }
      ]
    },
    {
      id: 3, title: 'asyncio.run() и event loop', type: 'theory',
      content: [
        { type: 'text', value: 'asyncio.run() — главная точка входа для запуска асинхронного кода. Она создаёт event loop (цикл событий), запускает корутину и закрывает loop после завершения.' },
        { type: 'heading', value: 'asyncio.run() — правильный способ запуска' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def main():\n    print("Начало main")\n    await asyncio.sleep(1)\n    print("Конец main")\n    return "готово"\n\n# asyncio.run() — правильный способ запуска (Python 3.7+)\nresult = asyncio.run(main())\nprint(result)  # "готово"\n\n# Нельзя вызывать asyncio.run() внутри уже запущенного event loop\n# (например, в Jupyter notebook нужно использовать await напрямую)' },
        { type: 'heading', value: 'Жизненный цикл event loop' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def task_a():\n    print("A: старт")\n    await asyncio.sleep(2)\n    print("A: конец")\n\nasync def task_b():\n    print("B: старт")\n    await asyncio.sleep(1)\n    print("B: конец")\n\nasync def main():\n    # Запускаем обе задачи "параллельно"\n    await asyncio.gather(task_a(), task_b())\n    # Порядок: A старт -> B старт -> B конец -> A конец\n\nasyncio.run(main())' },
        { type: 'note', value: 'asyncio — это однопоточная конкурентность. Задачи не выполняются реально параллельно — они чередуются в моменты await. Для CPU-нагрузки нужен multiprocessing.' }
      ]
    },
    {
      id: 4, title: 'asyncio.gather() — параллельные задачи', type: 'theory',
      content: [
        { type: 'text', value: 'asyncio.gather() запускает несколько корутин "одновременно" и ждёт завершения всех. Это основной инструмент для параллельного выполнения I/O-операций.' },
        { type: 'heading', value: 'Базовое использование gather' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def fetch_user(user_id: int) -> dict:\n    await asyncio.sleep(0.5)  # имитация HTTP запроса\n    return {"id": user_id, "name": f"User{user_id}"}\n\nasync def main():\n    # Запрашиваем 5 пользователей одновременно\n    users = await asyncio.gather(\n        fetch_user(1),\n        fetch_user(2),\n        fetch_user(3),\n        fetch_user(4),\n        fetch_user(5),\n    )\n    # Выполнится за ~0.5 сек, не за 2.5!\n    for user in users:\n        print(user)\n\nasyncio.run(main())' },
        { type: 'heading', value: 'gather с обработкой ошибок' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def risky_task(n: int):\n    if n == 2:\n        raise ValueError(f"Ошибка в задаче {n}")\n    return n * 10\n\nasync def main():\n    # return_exceptions=True — ошибки не прерывают gather\n    results = await asyncio.gather(\n        risky_task(1),\n        risky_task(2),\n        risky_task(3),\n        return_exceptions=True\n    )\n    for r in results:\n        if isinstance(r, Exception):\n            print(f"Ошибка: {r}")\n        else:\n            print(f"Результат: {r}")\n    # Результат: 10\n    # Ошибка: Ошибка в задаче 2\n    # Результат: 30\n\nasyncio.run(main())' }
      ]
    },
    {
      id: 5, title: 'asyncio.create_task() — фоновые задачи', type: 'theory',
      content: [
        { type: 'text', value: 'create_task() запускает корутину как фоновую задачу немедленно, не дожидаясь await. Это даёт больше контроля над задачами чем gather.' },
        { type: 'heading', value: 'create_task() vs gather()' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def background_worker(name: str, seconds: float):\n    print(f"{name}: начало")\n    await asyncio.sleep(seconds)\n    print(f"{name}: конец")\n    return name\n\nasync def main():\n    # create_task — задача ЗАПУСКАЕТСЯ сразу!\n    task1 = asyncio.create_task(background_worker("Задача 1", 2))\n    task2 = asyncio.create_task(background_worker("Задача 2", 1))\n\n    print("Обе задачи запущены, делаем другое...")\n    await asyncio.sleep(0.1)\n    print("Ещё работаем...")\n\n    # Ждём завершения\n    r1 = await task1\n    r2 = await task2\n    print(f"Завершено: {r1}, {r2}")\n\nasyncio.run(main())' },
        { type: 'heading', value: 'Отмена задачи' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def long_task():\n    try:\n        await asyncio.sleep(100)\n    except asyncio.CancelledError:\n        print("Задача отменена!")\n        raise  # важно пробросить дальше\n\nasync def main():\n    task = asyncio.create_task(long_task())\n    await asyncio.sleep(1)\n    task.cancel()  # отменяем задачу\n    try:\n        await task\n    except asyncio.CancelledError:\n        print("Задача успешно отменена")\n\nasyncio.run(main())' },
        { type: 'tip', value: 'create_task() используй когда нужно запустить задачу и продолжить работу, периодически проверяя её. gather() — когда нужно дождаться всех результатов сразу.' }
      ]
    },
    {
      id: 6, title: 'Asyncio и синхронный код: asyncio.to_thread', type: 'theory',
      content: [
        { type: 'text', value: 'Не весь код асинхронен. Синхронные блокирующие операции (файлы, тяжёлые вычисления) можно запустить в пуле потоков через asyncio.to_thread(), чтобы не блокировать event loop.' },
        { type: 'heading', value: 'asyncio.to_thread() для блокирующего кода' },
        { type: 'code', language: 'python', value: 'import asyncio\nimport time\n\ndef blocking_operation(n: int) -> int:\n    """Синхронная блокирующая функция."""\n    time.sleep(1)  # блокирует поток!\n    return n * n\n\nasync def main():\n    # Запускаем блокирующую функцию в отдельном потоке\n    result = await asyncio.to_thread(blocking_operation, 5)\n    print(f"Результат: {result}")  # 25\n\n    # Параллельно несколько блокирующих\n    results = await asyncio.gather(\n        asyncio.to_thread(blocking_operation, 3),\n        asyncio.to_thread(blocking_operation, 4),\n        asyncio.to_thread(blocking_operation, 5),\n    )\n    print(results)  # [9, 16, 25] — за ~1 сек!\n\nasyncio.run(main())' },
        { type: 'note', value: 'asyncio.to_thread() добавлен в Python 3.9. Для старых версий используйте loop.run_in_executor(None, func, args).' }
      ]
    },
    {
      id: 7, title: 'Async with и async for', type: 'theory',
      content: [
        { type: 'text', value: 'Асинхронные версии контекстных менеджеров (async with) и итераторов (async for) позволяют использовать асинхронные ресурсы в привычном синтаксисе.' },
        { type: 'heading', value: 'async with — асинхронный контекстный менеджер' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nclass AsyncDB:\n    async def __aenter__(self):\n        print("Подключаемся к БД...")\n        await asyncio.sleep(0.1)  # имитация подключения\n        return self\n\n    async def __aexit__(self, *args):\n        print("Закрываем соединение")\n        await asyncio.sleep(0.1)\n\n    async def query(self, sql: str):\n        await asyncio.sleep(0.2)\n        return f"Результат: {sql}"\n\nasync def main():\n    async with AsyncDB() as db:\n        result = await db.query("SELECT * FROM users")\n        print(result)\n\nasyncio.run(main())' },
        { type: 'heading', value: 'async for — асинхронный итератор' },
        { type: 'code', language: 'python', value: 'import asyncio\n\nasync def async_range(n: int):\n    """Асинхронный генератор."""\n    for i in range(n):\n        await asyncio.sleep(0.1)\n        yield i\n\nasync def main():\n    async for value in async_range(5):\n        print(f"Получено: {value}")\n\nasyncio.run(main())' }
      ]
    },
    {
      id: 8, title: 'Практика: Асинхронный загрузчик', type: 'practice', difficulty: 'hard',
      description: 'Реализуй асинхронный "загрузчик" данных, который имитирует параллельные HTTP-запросы и демонстрирует преимущества asyncio.',
      requirements: [
        'Корутина fetch(url, delay) имитирует HTTP-запрос через asyncio.sleep(delay) и возвращает "Данные из url"',
        'Функция download_all(urls) использует asyncio.gather для параллельной загрузки',
        'Функция download_sequential(urls) загружает последовательно для сравнения',
        'Замерь время обоих подходов через time.time()',
        'Используй create_task для запуска и отслеживания прогресса',
        'Обработай ошибку (одна из задач бросает исключение) через return_exceptions=True'
      ],
      expectedOutput: 'Параллельная загрузка:\n  Данные из url1\n  Данные из url2\n  Данные из url3\nВремя параллельно: ~1.0 сек\n\nПоследовательная загрузка:\nВремя последовательно: ~3.0 сек',
      hint: 'urls = [("url1", 1.0), ("url2", 0.8), ("url3", 1.0)]. В gather передавай fetch(url, delay) для каждого. Оберни в asyncio.run(main()).',
      solution: 'import asyncio\nimport time\n\nasync def fetch(url: str, delay: float) -> str:\n    await asyncio.sleep(delay)\n    return f"Данные из {url}"\n\nasync def download_all(urls):\n    tasks = [fetch(url, delay) for url, delay in urls]\n    results = await asyncio.gather(*tasks, return_exceptions=True)\n    return results\n\nasync def download_sequential(urls):\n    results = []\n    for url, delay in urls:\n        result = await fetch(url, delay)\n        results.append(result)\n    return results\n\nasync def main():\n    urls = [("url1", 1.0), ("url2", 0.8), ("url3", 1.0)]\n\n    print("Параллельная загрузка:")\n    start = time.time()\n    results = await download_all(urls)\n    for r in results:\n        if isinstance(r, Exception):\n            print(f"  Ошибка: {r}")\n        else:\n            print(f"  {r}")\n    print(f"Время параллельно: ~{time.time()-start:.1f} сек")\n\n    print()\n    print("Последовательная загрузка:")\n    start = time.time()\n    await download_sequential(urls)\n    print(f"Время последовательно: ~{time.time()-start:.1f} сек")\n\nasyncio.run(main())',
      explanation: 'asyncio.gather(*tasks) запускает все корутины параллельно — общее время равно максимальному delay, а не сумме. Последовательный подход суммирует все задержки. return_exceptions=True позволяет продолжить работу даже при ошибке в одной из задач.'
    }
  ]
}
