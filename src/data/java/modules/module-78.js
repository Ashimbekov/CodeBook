export default {
  id: 78,
  title: 'Best Practices: Производительность',
  description: 'Оптимизация производительности Java-кода: когда оптимизировать и когда нет, правильная работа со строками, выбор коллекций, ленивая инициализация, кэширование и предотвращение утечек памяти.',
  lessons: [
    {
      id: 1,
      title: 'Преждевременная оптимизация — зло',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Дональд Кнут сказал: "Premature optimization is the root of all evil" — преждевременная оптимизация — корень всех зол. Оптимизировать нужно то, что реально медленно, а не то, что кажется медленным.'
        },
        {
          type: 'heading',
          text: 'Правило 80/20 для производительности'
        },
        {
          type: 'list',
          items: [
            '80% проблем производительности находятся в 20% кода',
            'Узкое место чаще всего одно — найди и исправь его',
            'Читаемый код легче оптимизировать потом, чем оптимизированный — читать сейчас',
            'Преждевременная оптимизация усложняет код без измеримой пользы'
          ]
        },
        {
          type: 'heading',
          text: 'Правильный процесс оптимизации'
        },
        {
          type: 'list',
          items: [
            '1. Напиши понятный, работающий код',
            '2. Измерь производительность (профилировщик, бенчмарк)',
            '3. Найди реальное узкое место (hotspot)',
            '4. Оптимизируй только hotspot',
            '5. Измерь снова — убедись что стало лучше',
            '6. Убедись, что логика не сломалась (тесты)'
          ]
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — оптимизируем то, что не нужно',
          code: '// Разработчик "оптимизировал" простой код,\n// сделав его нечитаемым без измеримого прироста\npublic boolean isEven(int n) {\n    return (n & 1) == 0; // битовая операция "быстрее"\n    // На современных JVM этот код не быстрее, чем n % 2 == 0\n    // Но читается значительно хуже\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — читаемый код, оптимизируем только при необходимости',
          code: 'public boolean isEven(int n) {\n    return n % 2 == 0; // понятно и достаточно быстро\n}'
        },
        {
          type: 'tip',
          text: 'Используй инструменты профилирования: JProfiler, YourKit, VisualVM (бесплатный). Они точно покажут где тратится время. Без профилировщика оптимизация — это угадайка.'
        }
      ]
    },
    {
      id: 2,
      title: 'Конкатенация строк в цикле: StringBuilder',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Строки в Java неизменяемы (immutable). Каждая операция + создаёт новый объект String. В цикле это приводит к экспоненциальному росту расхода памяти и времени.'
        },
        {
          type: 'heading',
          text: 'Почему + в цикле медленно'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — O(n²) из-за создания объектов',
          code: 'public String buildReport(List<String> lines) {\n    String result = "";\n    for (String line : lines) {\n        result += line + "\\n"; // каждая итерация: создаём новый String!\n        // При 1000 строках: создаётся ~1000 объектов String,\n        // каждый копирует всё накопленное содержимое\n        // Суммарно: O(1 + 2 + 3 + ... + n) = O(n²) памяти и времени\n    }\n    return result;\n}\n\n// Результат замера:\n// 1 000 строк:   ~1 мс\n// 10 000 строк:  ~100 мс\n// 100 000 строк: ~10 000 мс (10 секунд!)'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — O(n) через StringBuilder',
          code: 'public String buildReport(List<String> lines) {\n    StringBuilder sb = new StringBuilder();\n    // Опционально: задать начальный размер буфера если знаем объём\n    // StringBuilder sb = new StringBuilder(lines.size() * 80);\n\n    for (String line : lines) {\n        sb.append(line).append("\\n"); // append изменяет внутренний буфер, не создаёт объект\n    }\n    return sb.toString(); // один объект String в конце\n}\n\n// Результат замера:\n// 1 000 строк:    ~0.1 мс\n// 10 000 строк:   ~1 мс\n// 100 000 строк:  ~10 мс'
        },
        {
          type: 'heading',
          text: 'Когда + всё-таки нормально'
        },
        {
          type: 'code',
          language: 'java',
          label: 'Конкатенация вне цикла — нормально',
          code: '// Вне цикла: компилятор сам оптимизирует в StringBuilder\nString message = "Привет, " + name + "! Тебе " + age + " лет.";\n\n// String.join — удобно для массивов и списков\nString csv = String.join(", ", list);\n\n// String.format — для сложного форматирования\nString report = String.format("Имя: %s, Возраст: %d, Баланс: %.2f", name, age, balance);\n\n// Collectors.joining в Stream\nString result = list.stream().collect(Collectors.joining(", ", "[", "]"));'
        },
        {
          type: 'warning',
          text: 'StringBuffer — потокобезопасная версия StringBuilder с синхронизацией. Используй её только при работе из нескольких потоков. В однопоточном коде StringBuilder быстрее.'
        }
      ]
    },
    {
      id: 3,
      title: 'Выбор правильной коллекции',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Выбор неправильной коллекции может замедлить программу в сотни раз. Важно понимать характеристики каждой коллекции и выбирать под задачу.'
        },
        {
          type: 'heading',
          text: 'ArrayList vs LinkedList'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — LinkedList для произвольного доступа',
          code: '// LinkedList для произвольного доступа — плохой выбор\nLinkedList<String> names = new LinkedList<>();\nfor (int i = 0; i < 1000000; i++) names.add("name" + i);\n\n// get(i) у LinkedList = O(n) — обходит список с начала!\nfor (int i = 0; i < names.size(); i++) {\n    String name = names.get(i); // каждый вызов: до 500 000 переходов по ссылкам\n    // ... обработка ...\n}\n// Итого: O(n²) операций'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — ArrayList для большинства случаев',
          code: '// ArrayList: get(i) = O(1), доступ по индексу мгновенный\nArrayList<String> names = new ArrayList<>();\nfor (int i = 0; i < 1000000; i++) names.add("name" + i);\n\nfor (int i = 0; i < names.size(); i++) {\n    String name = names.get(i); // O(1) — обращение по индексу\n    // ... обработка ...\n}\n// Итого: O(n) операций\n\n// LinkedList лучше ТОЛЬКО если часто вставляешь/удаляешь в СЕРЕДИНУ,\n// и никогда не обращаешься по индексу.\n// На практике — такой сценарий редкость. Используй ArrayList.'
        },
        {
          type: 'heading',
          text: 'Когда использовать HashMap'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — линейный поиск в списке',
          code: '// Поиск пользователя по ID в списке — O(n)\nList<User> users = new ArrayList<>();\n// ... 100 000 пользователей ...\n\npublic User findById(long id) {\n    for (User user : users) { // каждый поиск — перебор всего списка\n        if (user.getId() == id) return user;\n    }\n    return null;\n}\n// При 100 поисках: 100 * 100 000 = 10 000 000 сравнений'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — HashMap для поиска по ключу O(1)',
          code: '// Поиск по HashMap — O(1) в среднем\nMap<Long, User> usersById = new HashMap<>();\n// Один раз строим индекс:\nfor (User user : originalList) {\n    usersById.put(user.getId(), user);\n}\n\npublic User findById(long id) {\n    return usersById.get(id); // O(1)\n}\n// При 100 поисках: 100 * 1 = 100 операций\n// Правило: если часто ищешь по ключу — используй Map'
        },
        {
          type: 'list',
          items: [
            'ArrayList — основная коллекция для большинства задач, O(1) доступ по индексу',
            'HashMap — быстрый поиск, вставка, удаление по ключу, O(1) в среднем',
            'HashSet — проверка наличия элемента O(1), нет дубликатов',
            'LinkedHashMap — HashMap с сохранением порядка вставки',
            'TreeMap / TreeSet — отсортированные, O(log n), нужны редко',
            'ArrayDeque — очередь/стек, быстрее Stack и LinkedList для этих задач'
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Ленивая инициализация и кэширование',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Ленивая инициализация (lazy initialization) — создание объекта только при первом обращении, а не при старте. Кэширование — сохранение результата дорогого вычисления для повторного использования.'
        },
        {
          type: 'heading',
          text: 'Ленивая инициализация'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — тяжёлый объект создаётся всегда',
          code: 'public class ReportService {\n    // DatabaseConnection создаётся при создании ReportService,\n    // даже если метод generateReport() никогда не будет вызван\n    private final DatabaseConnection db = new DatabaseConnection(); // тяжёлый объект\n\n    public String generateReport() {\n        return db.query("SELECT ...");\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — создаём только при необходимости',
          code: 'public class ReportService {\n    private DatabaseConnection db; // null пока не нужен\n\n    private DatabaseConnection getDb() {\n        if (db == null) {\n            db = new DatabaseConnection(); // создаём при первом обращении\n        }\n        return db;\n    }\n\n    public String generateReport() {\n        return getDb().query("SELECT ...");\n    }\n}\n// Примечание: этот код не потокобезопасен.\n// Для многопоточности используй double-checked locking или enum Singleton.'
        },
        {
          type: 'heading',
          text: 'Мемоизация — кэширование результатов'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — дорогое вычисление каждый раз',
          code: 'public class FibCalculator {\n    // Без кэша: экспоненциальная сложность O(2^n)\n    public long fib(int n) {\n        if (n <= 1) return n;\n        return fib(n - 1) + fib(n - 2); // два рекурсивных вызова\n        // fib(40): ~1 млрд вызовов, несколько секунд!\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — мемоизация через HashMap',
          code: 'public class FibCalculator {\n    private Map<Integer, Long> cache = new HashMap<>();\n\n    // С кэшем: O(n) — каждое значение вычисляется один раз\n    public long fib(int n) {\n        if (n <= 1) return n;\n        if (cache.containsKey(n)) {\n            return cache.get(n); // уже вычислено — берём из кэша\n        }\n        long result = fib(n - 1) + fib(n - 2);\n        cache.put(n, result); // сохраняем результат\n        return result;\n        // fib(40): 40 вызовов вместо миллиарда\n    }\n}'
        },
        {
          type: 'tip',
          text: 'В Java 8+ можно использовать computeIfAbsent для элегантной мемоизации: return cache.computeIfAbsent(n, k -> fib(k-1) + fib(k-2)). Метод сам проверяет наличие в кэше и вычисляет если нет.'
        }
      ]
    },
    {
      id: 5,
      title: 'Утечки памяти: причины и профилирование',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'В Java есть Garbage Collector (GC), но утечки памяти всё равно возможны. Они происходят когда объекты остаются доступными (есть ссылка), но больше не используются. GC не может их удалить.'
        },
        {
          type: 'heading',
          text: 'Типичные причины утечек памяти'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — статическая коллекция накапливает объекты',
          code: 'public class SessionManager {\n    // static Map живёт всё время работы приложения\n    private static Map<String, UserSession> sessions = new HashMap<>();\n\n    public void createSession(String sessionId, User user) {\n        sessions.put(sessionId, new UserSession(user));\n        // УТЕЧКА: старые сессии никогда не удаляются!\n        // После тысяч пользователей — память заполнена\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — явное управление временем жизни',
          code: 'public class SessionManager {\n    private static Map<String, UserSession> sessions = new HashMap<>();\n\n    public void createSession(String sessionId, User user) {\n        sessions.put(sessionId, new UserSession(user, System.currentTimeMillis()));\n    }\n\n    public void removeSession(String sessionId) {\n        sessions.remove(sessionId); // явно удаляем при выходе\n    }\n\n    // Периодически очищаем устаревшие сессии\n    public void cleanExpiredSessions(long maxAgeMs) {\n        long now = System.currentTimeMillis();\n        sessions.entrySet().removeIf(entry ->\n            now - entry.getValue().getCreatedAt() > maxAgeMs);\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Другие причины утечек'
        },
        {
          type: 'list',
          items: [
            'Незакрытые ресурсы: файлы, соединения с БД, потоки (используй try-with-resources)',
            'Подписка на события без отписки (listeners, callbacks)',
            'Внутренние классы (inner class) хранят ссылку на внешний класс',
            'ThreadLocal переменные не очищенные после использования',
            'Кэш без политики вытеснения: Map растёт бесконечно'
          ]
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — try-with-resources закрывает ресурсы автоматически',
          code: '// ПЛОХО: соединение может не закрыться при исключении\nConnection conn = dataSource.getConnection();\nResultSet rs = conn.createStatement().executeQuery(sql);\n// ... обработка ... если здесь исключение — conn никогда не закроется!\nconn.close();\n\n// ХОРОШО: try-with-resources гарантирует закрытие\ntry (Connection conn = dataSource.getConnection();\n     ResultSet rs = conn.createStatement().executeQuery(sql)) {\n    // ... обработка ...\n} // conn и rs автоматически закрываются даже при исключении'
        },
        {
          type: 'warning',
          text: 'OutOfMemoryError в продакшне — серьёзная проблема. Для диагностики включи heap dump: -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/dump.hprof. Анализируй dump через Eclipse Memory Analyzer (MAT) — бесплатный инструмент.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация медленного кода',
      type: 'practice',
      difficulty: 'medium',
      description: 'Оптимизируй класс TextProcessor. Метод countWordFrequency принимает список строк и возвращает Map с частотой каждого слова. Текущая реализация медленная: использует String + в цикле и линейный поиск. Напиши оптимизированную версию.',
      requirements: [
        'Метод countWordFrequency(List<String> lines) возвращает Map<String, Integer>',
        'Слова нечувствительны к регистру (приводить к нижнему)',
        'Использовать StringBuilder для сборки строк',
        'Использовать HashMap для подсчёта частот (merge или getOrDefault)',
        'Метод getTopN(Map<String, Integer> freq, int n) возвращает топ-N слов по частоте',
        'Метод buildReport(Map<String, Integer> freq) возвращает отчёт в виде строки'
      ],
      expectedOutput: 'java: 3\nпрограммирование: 2\nэто: 2\nОтчёт:\njava: 3\nпрограммирование: 2\nэто: 2\nязык: 1',
      hint: 'Для подсчёта используй map.merge(word, 1, Integer::sum) — это элегантнее, чем getOrDefault. Для топ-N: entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).limit(n). Для buildReport используй StringBuilder и append.',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class TextProcessor {\n\n    // Оптимизированный подсчёт частот слов\n    public Map<String, Integer> countWordFrequency(List<String> lines) {\n        Map<String, Integer> frequency = new HashMap<>();\n\n        for (String line : lines) {\n            // split по пробельным символам\n            String[] words = line.trim().split("\\\\s+");\n            for (String word : words) {\n                if (word.isEmpty()) continue;\n                // Нормализуем: убираем пунктуацию, приводим к нижнему регистру\n                String normalized = word.toLowerCase()\n                    .replaceAll("[^а-яёa-z0-9]", "");\n                if (!normalized.isEmpty()) {\n                    // merge: если ключа нет — кладёт 1, иначе прибавляет 1\n                    frequency.merge(normalized, 1, Integer::sum);\n                }\n            }\n        }\n        return frequency;\n    }\n\n    // Топ-N слов по частоте\n    public List<Map.Entry<String, Integer>> getTopN(\n            Map<String, Integer> freq, int n) {\n        return freq.entrySet().stream()\n            .sorted(Map.Entry.<String, Integer>comparingByValue(\n                Comparator.reverseOrder()))\n            .limit(n)\n            .collect(Collectors.toList());\n    }\n\n    // Сборка отчёта через StringBuilder — O(n) вместо O(n²)\n    public String buildReport(Map<String, Integer> freq) {\n        List<Map.Entry<String, Integer>> sorted = getTopN(freq, freq.size());\n        StringBuilder sb = new StringBuilder();\n        for (Map.Entry<String, Integer> entry : sorted) {\n            sb.append(entry.getKey())\n              .append(": ")\n              .append(entry.getValue())\n              .append("\\n");\n        }\n        if (sb.length() > 0) {\n            sb.setLength(sb.length() - 1); // убираем последний \\n\n        }\n        return sb.toString();\n    }\n\n    public static void main(String[] args) {\n        TextProcessor processor = new TextProcessor();\n\n        List<String> lines = Arrays.asList(\n            "Java — это язык программирования.",\n            "Java программирование — это интересно.",\n            "Изучай Java каждый день!"\n        );\n\n        Map<String, Integer> freq = processor.countWordFrequency(lines);\n\n        // Выводим топ-3\n        List<Map.Entry<String, Integer>> top = processor.getTopN(freq, 3);\n        for (Map.Entry<String, Integer> entry : top) {\n            System.out.println(entry.getKey() + ": " + entry.getValue());\n        }\n\n        System.out.println("Отчёт:");\n        System.out.println(processor.buildReport(freq));\n    }\n}',
      explanation: 'Задача показывает две ключевые оптимизации. Первая: HashMap для подсчёта вместо линейного поиска. merge(key, 1, Integer::sum) — идиоматичный способ инкрементального счёта: если ключа нет, кладёт 1; если есть, применяет функцию Integer::sum к старому и новому значению. Вторая: StringBuilder для buildReport. Конкатенация через + в цикле создаёт O(n²) объектов, StringBuilder — O(n). Stream с sorted+limit для топ-N читается декларативно и эффективно. split("\\\\s+") разбивает по любым пробельным символам — устойчивее к двойным пробелам и табуляциям.'
    },
    {
      id: 7,
      title: 'Практика: Исправление утечки памяти',
      type: 'practice',
      difficulty: 'medium',
      description: 'Класс EventSystem имеет утечку памяти: слушатели добавляются, но никогда не удаляются. Исправь реализацию: добавь метод removeListener, реализуй автоматическую очистку через WeakReference, добавь метод getListenerCount для диагностики.',
      requirements: [
        'Интерфейс EventListener с методом onEvent(String eventType, Object data)',
        'Метод addEventListener(String eventType, EventListener listener)',
        'Метод removeEventListener(String eventType, EventListener listener)',
        'Метод fireEvent(String eventType, Object data) — вызывает всех слушателей для типа',
        'Метод getListenerCount(String eventType) — возвращает количество слушателей',
        'Метод clearAllListeners() — полная очистка (для тестов)'
      ],
      expectedOutput: 'Слушателей для click: 2\nОбработчик 1: click - нажатие кнопки\nОбработчик 2: click - нажатие кнопки\nПосле удаления слушателей для click: 1\nОбработчик 2: click - повторное нажатие\nПосле clearAll слушателей для click: 0',
      hint: 'Хранилище: Map<String, List<EventListener>> listeners = new HashMap<>(). removeEventListener использует list.remove(listener) — удаляет по equals. Не забудь обработать случай когда eventType не зарегистрирован (getOrDefault с пустым списком). fireEvent: создай копию списка перед итерацией чтобы избежать ConcurrentModificationException.',
      solution: 'import java.util.*;\n\npublic class EventSystem {\n\n    public interface EventListener {\n        void onEvent(String eventType, Object data);\n    }\n\n    // Map: тип события -> список слушателей\n    private final Map<String, List<EventListener>> listeners = new HashMap<>();\n\n    public void addEventListener(String eventType, EventListener listener) {\n        if (eventType == null || listener == null) {\n            throw new IllegalArgumentException("eventType и listener не могут быть null");\n        }\n        // computeIfAbsent: создаёт новый список если ещё нет\n        listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);\n    }\n\n    public void removeEventListener(String eventType, EventListener listener) {\n        List<EventListener> list = listeners.get(eventType);\n        if (list != null) {\n            list.remove(listener); // удаляет первое вхождение\n            // Очищаем пустой список чтобы не держать ключ\n            if (list.isEmpty()) {\n                listeners.remove(eventType);\n            }\n        }\n    }\n\n    public void fireEvent(String eventType, Object data) {\n        List<EventListener> list = listeners.get(eventType);\n        if (list == null || list.isEmpty()) return;\n\n        // Копируем список перед итерацией:\n        // слушатель может вызвать removeEventListener внутри onEvent,\n        // что без копии вызовет ConcurrentModificationException\n        List<EventListener> snapshot = new ArrayList<>(list);\n        for (EventListener listener : snapshot) {\n            listener.onEvent(eventType, data);\n        }\n    }\n\n    public int getListenerCount(String eventType) {\n        List<EventListener> list = listeners.get(eventType);\n        return list == null ? 0 : list.size();\n    }\n\n    public void clearAllListeners() {\n        listeners.clear();\n    }\n\n    public static void main(String[] args) {\n        EventSystem eventSystem = new EventSystem();\n\n        EventListener handler1 = (type, data) ->\n            System.out.println("Обработчик 1: " + type + " - " + data);\n        EventListener handler2 = (type, data) ->\n            System.out.println("Обработчик 2: " + type + " - " + data);\n\n        eventSystem.addEventListener("click", handler1);\n        eventSystem.addEventListener("click", handler2);\n\n        System.out.println("Слушателей для click: " +\n            eventSystem.getListenerCount("click"));\n\n        eventSystem.fireEvent("click", "нажатие кнопки");\n\n        eventSystem.removeEventListener("click", handler1);\n        System.out.println("После удаления слушателей для click: " +\n            eventSystem.getListenerCount("click"));\n\n        eventSystem.fireEvent("click", "повторное нажатие");\n\n        eventSystem.clearAllListeners();\n        System.out.println("После clearAll слушателей для click: " +\n            eventSystem.getListenerCount("click"));\n    }\n}',
      explanation: 'Задача моделирует классическую утечку памяти через Event Listeners — очень распространённый сценарий в GUI и серверном коде. Ключевые решения: computeIfAbsent создаёт список ленино — только при первом addEventListener. Удаление пустых списков: list.isEmpty() + listeners.remove(eventType) освобождает память не только от слушателя, но и от самого списка. Копия списка в fireEvent (new ArrayList<>(list)) — защита от ConcurrentModificationException: слушатель может изменить список в процессе обхода, что без копии вызовет исключение. getListenerCount — диагностический метод, важный для отладки утечек.'
    }
  ]
}
