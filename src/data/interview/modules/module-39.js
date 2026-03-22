export default {
  id: 39,
  title: 'Mock Interview: полная симуляция',
  description: '8 полноценных симуляций собеседований по 45 минут: Google, Amazon, Meta, Apple, Netflix, Microsoft, стартап и финальный "Boss Round" — 4 раунда FAANG. Все уроки — практика с модельными ответами.',
  lessons: [
    {
      id: 1,
      title: 'Mock #1: Google Phone Screen (Medium Algo)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Симуляция телефонного скрининга в Google. 45 минут, один алгоритмический вопрос уровня Medium. Интервьюер: "Привет! У нас 45 минут. Я дам задачу, ожидаю что вы будете думать вслух."' },
        { type: 'heading', value: 'Задача (первые 5 минут — читаем и уточняем)' },
        { type: 'text', value: 'Задача: "Дана строка с математическим выражением содержащим только цифры, +, -, пробелы. Вычислите результат." Нельзя использовать eval().\n\nПримеры: "3+2-1" → 4, "  3 + 5 - 2 " → 6.' },
        { type: 'heading', value: 'Модельный ответ — ход мыслей (15-20 мин)' },
        { type: 'text', value: 'Шаг 1 — Уточнение вопросов (2-3 минуты):\n- Только + и -? Нет скобок? Нет умножения?\n- Числа только неотрицательные целые?\n- Что если строка пустая?\n\nШаг 2 — Объяснение подхода (5 минут):\n"Буду парсить строку слева направо. Ключевые переменные: result (итог), current_num (текущее число), sign (текущий знак +1 или -1). При встрече оператора или конца — добавляю sign * current_num к result."\n\nШаг 3 — Кодирование (15 минут):' },
        { type: 'code', language: 'python', value: 'def calculate(s):\n    result = 0\n    current_num = 0\n    sign = 1  # +1 или -1\n\n    for char in s:\n        if char.isdigit():\n            current_num = current_num * 10 + int(char)\n        elif char == "+":\n            result += sign * current_num\n            current_num = 0\n            sign = 1\n        elif char == "-":\n            result += sign * current_num\n            current_num = 0\n            sign = -1\n        # пробелы игнорируем\n\n    # Не забываем последнее число!\n    result += sign * current_num\n    return result\n\nprint(calculate("3+2-1"))         # 4\nprint(calculate("  3 + 5 - 2 ")) # 6' },
        { type: 'text', value: 'Шаг 4 — Анализ сложности (2 минуты):\n"O(n) по времени, O(1) по памяти."\n\nШаг 5 — Тесты (5 минут): прогоняем вручную "3+2-1".\n\nШаг 6 — Follow-up вопросы интервьюера:\n"Как добавить скобки?" → Стек: при ( кладём (result, sign) в стек, при ) достаём.\n"Как добавить * и /?" → Стек для обработки приоритетов.' },
        { type: 'tip', value: 'На Google интервью думайте вслух КАЖДУЮ секунду. Молчание = плохой сигнал. Даже если не знаете как начать — говорите "Я думаю о подходе через...".' }
      ]
    },
    {
      id: 2,
      title: 'Mock #2: Amazon Behavioral (Leadership Principles)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Amazon Behavioral интервью — 45 минут, 4-5 вопросов по Leadership Principles. Каждый ответ по методу STAR: Situation, Task, Action, Result.\n\nИнтервьюер: "Расскажите о случае когда вам пришлось принять сложное решение с недостаточными данными."' },
        { type: 'heading', value: 'LP: Bias for Action (Склонность к действию)' },
        { type: 'text', value: 'Модельный ответ (STAR, 2-3 минуты):\n\nSituation: "В моей предыдущей команде мы разрабатывали feature для релиза через 2 недели. За 3 дня до релиза пришли данные что конкурент запустил похожее решение."\n\nTask: "Мне нужно было решить — выпускать как планировали или задержать для добавления дифференцирующих функций. У нас не было полных данных об успехе конкурента."\n\nAction: "Вместо недельного анализа я организовал 2-часовой воркшоп с командой и stakeholders. Мы выбрали 3 ключевые дифференцирующие функции которые могли добавить за 2 дня. Я взял ownership и коммитнулся на эти 2 функции, остальные перенесли в следующий спринт."\n\nResult: "Выпустили вовремя + 2 уникальные функции. Retention первого месяца оказался на 15% выше прогноза. Конкурент закрыл продукт через 3 месяца."' },
        { type: 'heading', value: 'Список топ-5 LP вопросов Amazon' },
        { type: 'text', value: '1. Customer Obsession: расскажите о случае когда вы превзошли ожидания клиента.\n2. Ownership: расскажите о проблеме выходящей за рамки вашей роли которую вы взяли на себя.\n3. Disagree and Commit: вы не соглашались с решением команды, что сделали?\n4. Dive Deep: когда вы обнаружили что данные противоречили первоначальному анализу?\n5. Deliver Results: пример когда вы преодолели серьёзные препятствия для достижения цели.' },
        { type: 'heading', value: 'Формат подготовки: банк историй' },
        { type: 'text', value: 'Подготовьте 5-7 историй из опыта, каждая покрывает несколько LP:\n\nИстория 1: "Мигрировал legacy монолит на микросервисы"\n- Охватывает: Ownership, Bias for Action, Deliver Results.\n\nИстория 2: "Конфликт с tech lead о выборе технологии"\n- Охватывает: Disagree and Commit, Earn Trust, Have Backbone.' },
        { type: 'note', value: 'Amazon смотрит на конкретные ДЕЙСТВИЯ. Избегайте "мы решили", "команда сделала". Говорите "Я лично сделал X". Показывайте ownership.' }
      ]
    },
    {
      id: 3,
      title: 'Mock #3: Meta Coding (2 Medium за 45 минут)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Meta coding интервью: две задачи за 45 минут (~20 минут на каждую). Темп быстрее чем в Google. Интервьюер сразу переходит ко второй задаче.\n\nЗадача 1 (минуты 0-20): "Найдите все задачи кратных по сумме k в подмассиве."' },
        { type: 'heading', value: 'Задача 1: Subarray Sum Equals K' },
        { type: 'code', language: 'python', value: 'def subarray_sum(nums, k):\n    # Prefix sum + HashMap\n    count = 0\n    prefix_sum = 0\n    seen = {0: 1}  # {prefix_sum: количество раз}\n\n    for num in nums:\n        prefix_sum += num\n        # Если (prefix_sum - k) видели ранее -> нашли подмассив\n        count += seen.get(prefix_sum - k, 0)\n        seen[prefix_sum] = seen.get(prefix_sum, 0) + 1\n\n    return count\n\nprint(subarray_sum([1,1,1], 2))  # 2 ([1,1] дважды)\nprint(subarray_sum([1,2,3], 3))  # 2 ([1,2] и [3])' },
        { type: 'heading', value: 'Задача 2 (минуты 20-45): Decode Ways' },
        { type: 'text', value: 'Задача 2: "Строка из цифр кодирует буквы: 1=A, 2=B, ..., 26=Z. Сколько способов декодировать строку?"\n\nПример: "12" → 2 ("AB" или "L"). "226" → 3 ("BZ","VF","BBF"). "06" → 0.' },
        { type: 'code', language: 'python', value: 'def num_decodings(s):\n    if not s or s[0] == "0":\n        return 0\n\n    n = len(s)\n    dp = [0] * (n + 1)\n    dp[0] = 1  # пустая строка\n    dp[1] = 1  # один символ (уже проверили не "0")\n\n    for i in range(2, n + 1):\n        # Однозначное: берём текущую цифру\n        one_digit = int(s[i-1])\n        if one_digit != 0:\n            dp[i] += dp[i-1]\n\n        # Двузначное: берём два последних символа\n        two_digit = int(s[i-2:i])\n        if 10 <= two_digit <= 26:\n            dp[i] += dp[i-2]\n\n    return dp[n]\n\nprint(num_decodings("12"))   # 2\nprint(num_decodings("226"))  # 3\nprint(num_decodings("06"))   # 0' },
        { type: 'text', value: 'Ключевые моменты для Meta интервью:\n- Не тратьте время на слишком долгие уточнения.\n- После первой задачи скажите "Готово, что дальше?" — быстрый переход ценится.\n- Meta ценит clean code: осмысленные имена переменных, комментарии к логике.\n- Если не успеваете написать полный код — объясните логику и напишите скелет.' },
        { type: 'tip', value: 'Meta смотрит на скорость + качество. 1 задача решена идеально лучше чем 2 задачи с багами. Но если успели — плюс к оценке.' }
      ]
    },
    {
      id: 4,
      title: 'Mock #4: Apple System Design (iMessage)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Apple System Design интервью: 45-60 минут, один дизайн-вопрос. Apple особенно ценит privacy, безопасность и UX-ориентированность решений.\n\nИнтервьюер: "Спроектируйте iMessage. Особый акцент на End-to-End шифровании."' },
        { type: 'heading', value: 'Требования и scope (10 минут)' },
        { type: 'text', value: 'Функциональные:\n- Личные и групповые сообщения между iOS/macOS устройствами.\n- End-to-End шифрование (E2EE): Apple не может читать сообщения.\n- Синхронизация между устройствами одного Apple ID (iPhone + iPad + Mac).\n- Read receipts, typing indicators.\n- Fallback на SMS если получатель не в Apple экосистеме (SMS — не E2EE).\n\nNon-functional:\n- 500M пользователей Apple ID.\n- Privacy-first: минимальный сбор метаданных.\n- Offline capability: сообщения сохраняются локально.' },
        { type: 'heading', value: 'E2EE архитектура (ключевая часть для Apple)' },
        { type: 'text', value: 'Протокол шифрования (Signal-подобный):\n\n1. Каждое устройство генерирует пару ключей (Ed25519): публичный загружается на Apple Key Server, приватный только на устройстве (Secure Enclave).\n\n2. Отправка сообщения Алисы Бобу:\n   - Алиса запрашивает публичный ключ Боба у Key Server.\n   - Шифрует сообщение публичным ключом Боба.\n   - Сервер передаёт зашифрованный blob (не может расшифровать).\n   - Боб расшифровывает своим приватным ключом.\n\n3. Мультиустройство (у Боба iPhone + iPad):\n   - Алиса шифрует копию для КАЖДОГО устройства Боба отдельно.\n   - Каждое устройство имеет свой ключ.\n\n4. Key Transparency:\n   - Публичные ключи хранятся в transparent log (Merkle tree).\n   - Устройство может верифицировать что его ключ не подменён (похоже на Certificate Transparency).' },
        { type: 'heading', value: 'Синхронизация устройств' },
        { type: 'text', value: 'iCloud Messages Sync:\n- Сообщения шифруются ключом iCloud Keychain (доступен всем устройствам с тем же Apple ID).\n- Хранятся в зашифрованном виде в iCloud.\n- Apple не может прочитать — ключ только у пользователя.' },
        { type: 'note', value: 'Apple вопросы часто включают privacy deep-dive. Подготовьте: differential privacy, Secure Enclave, App Tracking Transparency как примеры Apple privacy-tech.' }
      ]
    },
    {
      id: 5,
      title: 'Mock #5: Netflix Coding (Streaming-Related)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Netflix coding интервью: задачи часто связаны с реальными проблемами Netflix — рекомендации, битрейт, сортировки, очереди.\n\nИнтервьюер: "Реализуйте систему рейтингов контента. Нужно получать топ-k фильмов за O(k log n)."' },
        { type: 'heading', value: 'Задача: система рейтингов' },
        { type: 'code', language: 'python', value: 'import heapq\nfrom collections import defaultdict\n\nclass ContentRatingSystem:\n    def __init__(self):\n        self.ratings = {}  # movie_id -> rating\n        # MaxHeap через отрицательные значения\n        self.heap = []     # (-rating, movie_id)\n\n    def add_or_update(self, movie_id, rating):\n        """O(log n)"""\n        self.ratings[movie_id] = rating\n        heapq.heappush(self.heap, (-rating, movie_id))\n        # Lazy deletion: устаревшие записи игнорируем при извлечении\n\n    def top_k(self, k):\n        """Вернуть топ-k фильмов O(k log n)"""\n        result = []\n        temp = []  # временно извлечённые\n\n        while self.heap and len(result) < k:\n            neg_rating, movie_id = heapq.heappop(self.heap)\n            current_rating = self.ratings.get(movie_id)\n\n            # Пропускаем устаревшие записи (lazy deletion)\n            if current_rating == -neg_rating:\n                result.append((movie_id, -neg_rating))\n            temp.append((neg_rating, movie_id))\n\n        # Возвращаем назад\n        for item in temp:\n            heapq.heappush(self.heap, item)\n\n        return result\n\n# Тест\ncrs = ContentRatingSystem()\ncrs.add_or_update("Inception", 9.2)\ncrs.add_or_update("Interstellar", 8.8)\ncrs.add_or_update("Avatar", 7.5)\ncrs.add_or_update("Inception", 9.5)  # обновление\n\nprint(crs.top_k(2))  # [("Inception", 9.5), ("Interstellar", 8.8)]' },
        { type: 'heading', value: 'Follow-up: распределённый вариант' },
        { type: 'text', value: 'Интервьюер: "А теперь 100M фильмов, 500M пользователей с персональными рейтингами. Как масштабировать?"\n\nОтвет:\n1. Шардирование по movie_id: рейтинг фильма X хранится на шарде X % N_shards.\n2. Каждый шард держит local top-k фильмов.\n3. Для global top-k: собираем top-k с каждого шарда → merge → global top-k.\n4. Персональные рейтинги: отдельная User Preference Service, коллаборативная фильтрация в ML pipeline.\n5. Кэширование: global top-k обновляется раз в час, хранится в Redis.' },
        { type: 'tip', value: 'Netflix ценит engineers с product sense. Спрашивайте: "Как это влияет на пользователя?" "Как мы будем измерять успех?" Показывайте понимание бизнеса.' }
      ]
    },
    {
      id: 6,
      title: 'Mock #6: Microsoft Behavioral + Coding Mix',
      type: 'practice',
      content: [
        { type: 'text', value: 'Microsoft интервью часто совмещает behavioral и coding в одном раунде. Первые 15-20 минут — поведенческие вопросы, затем задача.\n\nИнтервьюер: "Расскажите о самом сложном техническом проекте. Что вы взяли бы обратно если бы делали снова?"' },
        { type: 'heading', value: 'Behavioral часть (15 минут)' },
        { type: 'text', value: 'Модельный ответ:\n\n"Самый сложный проект — миграция payment сервиса на новую платформу с нулевым downtime. Сложность была в том что мы обрабатывали $10M в день и любая ошибка стоила реальных денег.\n\nЧто я сделал:\n1. Спроектировал Strangler Fig pattern: новый сервис параллельно со старым.\n2. Начали с 1% трафика → постепенно до 100% за 6 недель.\n3. Feature flags для быстрого rollback.\n4. Shadow mode: новый сервис обрабатывал транзакции но не применял их — сравнивали результаты.\n\nРезультат: zero downtime, zero потерянных транзакций.\n\nЧто бы изменил: начал бы мониторинг раньше. Мы потеряли 3 дня на настройку алертов после начала миграции, а не до."' },
        { type: 'heading', value: 'Coding часть (25 минут): Design Tic-Tac-Toe' },
        { type: 'code', language: 'python', value: 'class TicTacToe:\n    """Оптимальное: O(1) на ход через счётчики строк/столбцов/диагоналей"""\n\n    def __init__(self, n):\n        self.n = n\n        # rows[p][r] = счётчик ходов игрока p в строке r\n        self.rows = [[0]*n for _ in range(2)]\n        self.cols = [[0]*n for _ in range(2)]\n        self.diag = [0, 0]   # диагональ [p0, p1]\n        self.anti = [0, 0]   # антидиагональ [p0, p1]\n\n    def move(self, row, col, player):\n        """Возвращает номер игрока-победителя или 0"""\n        p = player - 1  # 0-indexed\n        n = self.n\n\n        self.rows[p][row] += 1\n        self.cols[p][col] += 1\n        if row == col:\n            self.diag[p] += 1\n        if row + col == n - 1:\n            self.anti[p] += 1\n\n        if (self.rows[p][row] == n or self.cols[p][col] == n or\n                self.diag[p] == n or self.anti[p] == n):\n            return player\n        return 0\n\n# Тест\ngame = TicTacToe(3)\nprint(game.move(0,0,1))  # 0\nprint(game.move(0,2,2))  # 0\nprint(game.move(2,2,1))  # 0\nprint(game.move(1,1,2))  # 0\nprint(game.move(1,0,1))  # 0\nprint(game.move(0,1,2))  # 0\nprint(game.move(2,0,1))  # 1 (победа!)' },
        { type: 'note', value: 'Microsoft ценит collaboration и growth mindset. Вопрос "что бы изменили" — не ловушка, а возможность показать саморефлексию.' }
      ]
    },
    {
      id: 7,
      title: 'Mock #7: Startup Full-Stack Live Coding',
      type: 'practice',
      content: [
        { type: 'text', value: 'Стартап интервью: более свободный формат, может быть live coding в IDE, pair programming или take-home задание. Интервьюеры ищут продуктивность, не перфекционизм.\n\nИнтервьюер: "Давайте сделаем вместе мини-задачу: реализуйте простой Rate Limiter."' },
        { type: 'heading', value: 'Задача: Rate Limiter (100 запросов в минуту на пользователя)' },
        { type: 'code', language: 'python', value: 'import time\nfrom collections import deque\n\nclass RateLimiter:\n    """Sliding Window Log: точный, O(N) память на пользователя"""\n\n    def __init__(self, max_requests, window_seconds):\n        self.max_requests = max_requests\n        self.window = window_seconds\n        self.user_logs = {}  # user_id -> deque of timestamps\n\n    def is_allowed(self, user_id):\n        now = time.time()\n        if user_id not in self.user_logs:\n            self.user_logs[user_id] = deque()\n\n        log = self.user_logs[user_id]\n\n        # Удаляем запросы старше окна\n        while log and log[0] <= now - self.window:\n            log.popleft()\n\n        if len(log) < self.max_requests:\n            log.append(now)\n            return True\n        return False\n\n# Альтернатива: Token Bucket (более гибкий, позволяет burst)\nclass TokenBucket:\n    def __init__(self, capacity, refill_rate):\n        self.capacity = capacity\n        self.tokens = capacity\n        self.refill_rate = refill_rate  # токенов в секунду\n        self.last_refill = time.time()\n\n    def consume(self, user_id, tokens=1):\n        now = time.time()\n        elapsed = now - self.last_refill\n        self.tokens = min(self.capacity,\n                         self.tokens + elapsed * self.refill_rate)\n        self.last_refill = now\n\n        if self.tokens >= tokens:\n            self.tokens -= tokens\n            return True\n        return False\n\n# Демонстрация\nlimiter = RateLimiter(max_requests=3, window_seconds=1)\nfor i in range(5):\n    result = limiter.is_allowed("user_1")\n    print(f"Request {i+1}: {\'allowed\' if result else \'blocked\'}")' },
        { type: 'heading', value: 'Продолжение диалога с интервьюером' },
        { type: 'text', value: 'Интервьюер: "Как сделать это распределённым? У нас 10 API серверов."\n\nОтвет: "Логи запросов переносим в Redis с TTL. При каждом запросе:\n1. Redis ZADD user:{id}:requests {timestamp} {uuid} — добавляем запрос.\n2. Redis ZREMRANGEBYSCORE — удаляем старые.\n3. Redis ZCARD — считаем количество в окне.\n4. Всё в Lua script для атомарности.\n\nАльтернатива: Redis INCR + EXPIRE для более простого counter, но менее точного."' },
        { type: 'tip', value: 'На стартап интервью важно показывать гибкость: "Я могу сделать простой вариант сначала, потом усложнить". Демонстрируйте pragmatism над perfection.' }
      ]
    },
    {
      id: 8,
      title: 'Mock #8: Final Boss — 4 раунда FAANG симуляция',
      type: 'practice',
      content: [
        { type: 'text', value: 'Финальная симуляция: 4 раунда как на onsite FAANG. Каждый раунд 45-50 минут. Используйте этот урок как шпаргалку для подготовки к финальному дню.' },
        { type: 'heading', value: 'Раунд 1: Coding 1 (Data Structures)' },
        { type: 'text', value: 'Задача: "Реализуйте Iterator для вложенного списка (NestedIterator)."\n\nПодход: stack или рекурсивное выравнивание. Ключевой вопрос: lazy vs eager evaluation.\n\nОжидаемые вопросы от интервьюера:\n- Что если вложенность бесконечная?\n- Как обрабатываете пустые списки?\n- Сложность вашего решения?' },
        { type: 'heading', value: 'Раунд 2: Coding 2 (DP/Graphs)' },
        { type: 'text', value: 'Задача: "Найдите количество уникальных путей в матрице m×n с препятствиями."\n\nПодход: 2D DP. dp[i][j] = dp[i-1][j] + dp[i][j-1] если не препятствие.\n\nFollow-up: что если можно двигаться в 4 направлениях, но только вперёд (DAG)?' },
        { type: 'heading', value: 'Раунд 3: System Design' },
        { type: 'text', value: 'Задача: "Спроектируйте Google Docs (collaborative editing)."\n\nКлючевые концепции:\n- Operational Transformation (OT) или CRDT для conflict resolution.\n- WebSocket для real-time синхронизации.\n- Версионирование документов (история изменений).\n- Offline editing + merge при reconnect.\n\nАрхитектура: Client → WebSocket → Document Server → OT Engine → Cassandra (ops log) + Redis (current state).' },
        { type: 'heading', value: 'Раунд 4: Behavioral (Bar Raiser)' },
        { type: 'text', value: 'Bar Raiser — специальный интервьюер из другой команды. Ищет красные флаги.\n\nТипичные вопросы:\n- "Расскажите о самой большой ошибке в карьере."\n- "Опишите конфликт с менеджером."\n- "Почему вы уходите с текущего места?"\n\nМодельная стратегия:\n- Ошибка: берите реальную, но из которой извлекли урок. Не катастрофические ошибки.\n- Конфликт: вы ПОПРОБОВАЛИ убедить, они РЕШИЛИ иначе, вы ПРИНЯЛИ и поддержали решение.\n- Уход: рост, новые вызовы. Никогда не критикуйте текущего работодателя.' },
        { type: 'heading', value: 'Чеклист подготовки к FAANG Onsite' },
        { type: 'text', value: 'За 48 часов до:\n- Повторите паттерны (Sliding Window, Two Pointers, BFS/DFS, DP).\n- Прогоните 5 задач уровня Medium без подсказок.\n- Подготовьте 3 истории для behavioral (STAR формат).\n\nВ день:\n- Выспитесь (не учите всю ночь).\n- Возьмите воду.\n- Уточняйте вопросы перед кодированием.\n- Думайте вслух.\n- Тестируйте код с примерами до заявления "готово".\n\nПосле:\n- Запишите вопросы пока свежи в памяти.\n- Напишите thank you email интервьюерам (если есть контакты).' },
        { type: 'note', value: 'Hiring bar в FAANG: лучше решить одну задачу идеально (объяснение + код + тесты + сложность) чем две наполовину. Качество > количество.' }
      ]
    }
  ]
}
