export default {
  id: 8,
  title: 'RabbitMQ: паттерны',
  description: 'Продвинутые паттерны RabbitMQ: Work Queues, Routing, RPC, Priority Queues, Delayed Messages, Retry с backoff.',
  lessons: [
    {
      id: 1,
      title: 'Work Queue: распределение задач',
      type: 'theory',
      content: [
        { type: 'text', value: 'Work Queue (Task Queue) — паттерн, при котором несколько consumers конкурируют за сообщения из одной очереди. Каждое сообщение обрабатывается ровно одним worker-ом. Это основной способ горизонтального масштабирования обработки задач.' },
        { type: 'heading', value: 'Принцип работы' },
        { type: 'text', value: 'Producer отправляет задачи в очередь. Несколько workers подключены к той же очереди. RabbitMQ использует Round-Robin — чередует delivery между consumers. С prefetch=1 RabbitMQ отправляет следующее сообщение тому worker-у, который освободился первым.' },
        { type: 'code', language: 'java', value: '// Work Queue: задачи распределяются между workers\nimport java.util.concurrent.*;\nimport java.util.*;\n\npublic class WorkQueueDemo {\n    static BlockingQueue<String> taskQueue = new LinkedBlockingQueue<>();\n\n    static void worker(String name, int processingTimeMs) {\n        new Thread(() -> {\n            while (true) {\n                try {\n                    String task = taskQueue.poll(2, TimeUnit.SECONDS);\n                    if (task == null) break;\n                    System.out.println("[" + name + "] Начал: " + task);\n                    Thread.sleep(processingTimeMs); // имитация работы\n                    System.out.println("[" + name + "] Завершил: " + task);\n                } catch (InterruptedException e) { break; }\n            }\n        }).start();\n    }\n\n    public static void main(String[] args) throws Exception {\n        // Добавляем задачи\n        for (int i = 1; i <= 6; i++) {\n            taskQueue.offer("Задача-" + i);\n        }\n\n        // 3 worker-а с разной скоростью\n        worker("Fast-Worker",  100);\n        worker("Medium-Worker", 200);\n        worker("Slow-Worker",  400);\n\n        // Fast получит больше задач, потому что быстрее освобождается\n    }\n}' },
        { type: 'heading', value: 'Fair Dispatch vs Round-Robin' },
        { type: 'list', value: [
          'Round-Robin (по умолчанию): RabbitMQ чередует — 1-й, 2-й, 3-й, 1-й...',
          'Проблема: медленный worker получает столько же задач, сколько быстрый',
          'Fair Dispatch: prefetch=1 — RabbitMQ отдаёт задачу свободному worker-у',
          'С prefetch=1 быстрый worker обработает больше задач',
          'Для тяжёлых задач (>1 сек): ВСЕГДА используйте prefetch=1'
        ] },
        { type: 'tip', value: 'Work Queue — самый распространённый паттерн в RabbitMQ. Используется для: обработки заказов, отправки email-ов, генерации отчётов, обработки изображений — любых задач, которые можно распараллелить.' }
      ]
    },
    {
      id: 2,
      title: 'Routing: маршрутизация по ключу',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн Routing позволяет consumer-ам получать только интересующие их сообщения. Producer помечает сообщения routing key, а consumer подписывается только на определённые ключи через binding.' },
        { type: 'heading', value: 'Direct Routing' },
        { type: 'code', language: 'java', value: '// Routing: фильтрация сообщений по ключу\nimport java.util.*;\n\npublic class RoutingDemo {\n    // Binding: какой consumer на какие ключи подписан\n    static Map<String, List<String>> bindings = new HashMap<>();\n    // Очереди consumers\n    static Map<String, List<String>> queues = new HashMap<>();\n\n    static void bind(String consumer, String routingKey) {\n        bindings.computeIfAbsent(routingKey, k -> new ArrayList<>()).add(consumer);\n        queues.putIfAbsent(consumer, new ArrayList<>());\n    }\n\n    static void publish(String routingKey, String message) {\n        List<String> targets = bindings.getOrDefault(routingKey, Collections.emptyList());\n        for (String consumer : targets) {\n            queues.get(consumer).add(message);\n        }\n        System.out.println("publish(key=" + routingKey + "): " + message\n            + " -> " + targets);\n    }\n\n    public static void main(String[] args) {\n        // ErrorHandler получает только ошибки\n        bind("ErrorHandler", "error");\n\n        // Logger получает всё\n        bind("Logger", "error");\n        bind("Logger", "warning");\n        bind("Logger", "info");\n\n        // DashBoard получает error и warning\n        bind("DashBoard", "error");\n        bind("DashBoard", "warning");\n\n        publish("error",   "Диск заполнен на 99%");\n        publish("warning", "Память > 80%");\n        publish("info",    "Сервис запущен");\n\n        System.out.println("\\nErrorHandler: " + queues.get("ErrorHandler"));\n        System.out.println("Logger: " + queues.get("Logger"));\n        System.out.println("DashBoard: " + queues.get("DashBoard"));\n    }\n}' },
        { type: 'heading', value: 'Topic Routing' },
        { type: 'text', value: 'Topic Exchange расширяет direct routing паттернами с wildcard: * (одно слово) и # (ноль или более слов). Это позволяет гибкую подписку без перечисления всех ключей.' },
        { type: 'code', language: 'java', value: '// Topic Routing примеры:\n//\n// Routing key:   "order.created.moscow"\n//\n// Binding key: "order.created.*"     -> совпадает (город = любой)\n// Binding key: "order.*.moscow"      -> совпадает (действие = любое)\n// Binding key: "order.#"             -> совпадает (всё после order)\n// Binding key: "#"                   -> совпадает (всё вообще)\n// Binding key: "order.created.spb"   -> НЕ совпадает (spb != moscow)\n// Binding key: "payment.#"           -> НЕ совпадает (payment != order)\n\n// Реальный пример: логирование по уровням и сервисам\n// key: "auth-service.error"    -> alerts queue\n// key: "payment-service.error" -> alerts queue\n// key: "*.error"               -> error-handler получает ВСЕ ошибки\n// key: "auth-service.*"        -> auth-monitor получает ВСЁ от auth\n// key: "#"                     -> logger получает АБСОЛЮТНО ВСЁ' },
        { type: 'warning', value: 'Routing key в RabbitMQ ограничен 255 байтами. Используйте точку как разделитель и придерживайтесь конвенции: entity.action.detail (order.created.moscow). Не делайте ключи слишком длинными или слишком вложенными.' }
      ]
    },
    {
      id: 3,
      title: 'RPC через очереди',
      type: 'theory',
      content: [
        { type: 'text', value: 'RPC (Remote Procedure Call) через RabbitMQ — паттерн, при котором client отправляет запрос в очередь и ждёт ответа в callback-очереди. Это позволяет реализовать синхронный вызов через асинхронную инфраструктуру.' },
        { type: 'heading', value: 'Как работает RPC' },
        { type: 'code', language: 'java', value: '// RPC через RabbitMQ:\n//\n// 1. Client создаёт exclusive callback queue\n// 2. Client отправляет запрос с properties:\n//    - replyTo: имя callback queue\n//    - correlationId: уникальный ID запроса\n// 3. Server читает из request queue, обрабатывает\n// 4. Server отправляет ответ в replyTo queue с тем же correlationId\n// 5. Client читает ответ из callback queue по correlationId\n//\n// Client --> [Request Queue] --> Server\n//                                  |\n// Client <-- [Callback Queue] <----+\n//        (correlationId для matching)' },
        { type: 'heading', value: 'Реализация RPC' },
        { type: 'code', language: 'java', value: 'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class RpcDemo {\n    static BlockingQueue<Map<String, String>> requestQueue = new LinkedBlockingQueue<>();\n    static Map<String, BlockingQueue<String>> callbackQueues = new ConcurrentHashMap<>();\n\n    // RPC Server: принимает запросы, отправляет ответы\n    static void startServer() {\n        new Thread(() -> {\n            while (true) {\n                try {\n                    Map<String, String> request = requestQueue.poll(3, TimeUnit.SECONDS);\n                    if (request == null) break;\n\n                    String body = request.get("body");\n                    String replyTo = request.get("replyTo");\n                    String corrId = request.get("correlationId");\n\n                    // Обработка: вычисляем Fibonacci\n                    int n = Integer.parseInt(body);\n                    int result = fibonacci(n);\n\n                    System.out.println("[Server] fib(" + n + ") = " + result);\n\n                    // Отправляем ответ в callback queue\n                    callbackQueues.get(replyTo).offer(corrId + ":" + result);\n                } catch (InterruptedException e) { break; }\n            }\n        }).start();\n    }\n\n    static int fibonacci(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n\n    // RPC Client: отправляет запрос и ждёт ответ\n    static String call(String body) throws Exception {\n        String callbackQueue = "callback-" + UUID.randomUUID();\n        String correlationId = UUID.randomUUID().toString();\n\n        callbackQueues.put(callbackQueue, new LinkedBlockingQueue<>());\n\n        Map<String, String> request = new HashMap<>();\n        request.put("body", body);\n        request.put("replyTo", callbackQueue);\n        request.put("correlationId", correlationId);\n\n        requestQueue.offer(request);\n\n        // Ждём ответ\n        String response = callbackQueues.get(callbackQueue).poll(5, TimeUnit.SECONDS);\n        callbackQueues.remove(callbackQueue);\n        return response != null ? response.split(":")[1] : "timeout";\n    }\n\n    public static void main(String[] args) throws Exception {\n        startServer();\n\n        System.out.println("[Client] fib(10) = " + call("10"));\n        System.out.println("[Client] fib(20) = " + call("20"));\n        System.out.println("[Client] fib(30) = " + call("30"));\n    }\n}' },
        { type: 'heading', value: 'Когда использовать RPC через MQ' },
        { type: 'list', value: [
          'Когда нужен синхронный ответ, но хочется буферизацию и отказоустойчивость',
          'Когда сервер может быть временно недоступен — запрос подождёт в очереди',
          'Для load balancing — несколько серверов читают из одной очереди',
          'НЕ используйте для low-latency вызовов — overhead очереди добавляет задержку',
          'НЕ используйте если простой HTTP/gRPC достаточен'
        ] },
        { type: 'warning', value: 'RPC через MQ сложнее, чем прямой HTTP вызов. Используйте только когда вам НУЖНЫ преимущества очереди: буферизация, retry, load balancing. Для простых синхронных вызовов используйте REST или gRPC.' }
      ]
    },
    {
      id: 4,
      title: 'Priority Queues и TTL',
      type: 'theory',
      content: [
        { type: 'text', value: 'RabbitMQ поддерживает приоритеты сообщений и TTL (Time-To-Live). Приоритеты позволяют обрабатывать важные сообщения первыми, а TTL автоматически удаляет устаревшие сообщения.' },
        { type: 'heading', value: 'Priority Queue' },
        { type: 'code', language: 'java', value: '// Priority Queue в RabbitMQ:\n// Очередь объявляется с x-max-priority\n// Сообщения отправляются с priority (0 = низший)\n//\n// channel.queueDeclare("tasks", true, false, false,\n//     Map.of("x-max-priority", 10));\n//\n// Симуляция на Java:\nimport java.util.*;\nimport java.util.concurrent.*;\n\npublic class PriorityQueueDemo {\n    static PriorityBlockingQueue<int[]> queue = new PriorityBlockingQueue<>(\n        11, (a, b) -> b[0] - a[0] // сортировка по приоритету (убывание)\n    );\n    static int seq = 0;\n\n    static void publish(String msg, int priority) {\n        queue.offer(new int[]{priority, seq++}); // [priority, seq]\n        System.out.println("  publish: \\"" + msg + "\\" priority=" + priority);\n    }\n\n    public static void main(String[] args) {\n        String[] messages = {"Обычный лог", "VIP заказ!", "Обычный заказ",\n                            "КРИТИЧЕСКАЯ ОШИБКА", "Уведомление"};\n        int[] priorities =   {1, 8, 3, 10, 2};\n\n        System.out.println("Отправка сообщений:");\n        for (int i = 0; i < messages.length; i++) {\n            publish(messages[i], priorities[i]);\n        }\n\n        System.out.println("\\nОбработка (по приоритету):");\n        // Consumer получает сообщения по приоритету\n        String[] msgArr = messages;\n        int[][] sorted = new int[queue.size()][];\n        int idx = 0;\n        while (!queue.isEmpty()) {\n            int[] item = queue.poll();\n            System.out.println("  priority=" + item[0]);\n        }\n    }\n}' },
        { type: 'heading', value: 'TTL (Time-To-Live)' },
        { type: 'code', language: 'java', value: '// TTL можно установить на уровне очереди или сообщения:\n//\n// На уровне очереди — ВСЕ сообщения получают одинаковый TTL:\n// Map<String, Object> args = new HashMap<>();\n// args.put("x-message-ttl", 60000); // 60 секунд\n// channel.queueDeclare("temp-tasks", true, false, false, args);\n//\n// На уровне сообщения — каждое сообщение свой TTL:\n// AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()\n//     .expiration("30000") // 30 секунд (строка!)\n//     .build();\n// channel.basicPublish("", "tasks", props, msg.getBytes());\n//\n// Что происходит по истечении TTL:\n// 1. Сообщение удаляется из очереди\n// 2. Если настроен DLX — сообщение попадает в Dead Letter Exchange\n//\n// Сценарии использования:\n// - Временные промо-акции (TTL = время акции)\n// - Кэш инвалидация (TTL = время жизни кэша)\n// - Отмена заказа если не оплачен за 30 минут' },
        { type: 'heading', value: 'Delayed Messages' },
        { type: 'text', value: 'RabbitMQ не поддерживает delayed messages из коробки. Но можно реализовать через TTL + DLX: сообщение кладётся в очередь с TTL, по истечении попадает в DLX, откуда его читает consumer.' },
        { type: 'code', language: 'java', value: '// Delayed Message через TTL + DLX:\n//\n// 1. Создаём "parking" очередь с TTL и DLX:\n//    x-message-ttl: 30000 (задержка 30 секунд)\n//    x-dead-letter-exchange: "main-exchange"\n//    x-dead-letter-routing-key: "delayed-task"\n//    Никто НЕ читает из этой очереди!\n//\n// 2. Создаём основную очередь, привязанную к main-exchange\n//    Consumer читает из этой очереди\n//\n// Flow:\n// Producer -> [parking-queue] --(TTL expired)--> [DLX] -> [main-queue] -> Consumer\n//             \\____ ждёт 30 сек ____/            \\____ маршрутизация ____/\n//\n// Реальные сценарии:\n// - Повторная попытка через 5 минут после ошибки\n// - Отправка напоминания через 24 часа\n// - Отмена неоплаченного заказа через 30 минут' },
        { type: 'tip', value: 'Для production delayed messages рекомендуется плагин rabbitmq_delayed_message_exchange. Он поддерживает произвольные задержки для каждого сообщения без хаков с TTL+DLX.' }
      ]
    },
    {
      id: 5,
      title: 'Retry и Backoff стратегии',
      type: 'theory',
      content: [
        { type: 'text', value: 'При обработке сообщений ошибки неизбежны: сервис недоступен, база перегружена, данные невалидны. Правильная стратегия retry (повторных попыток) критична для надёжной системы. Без неё сообщения теряются или зацикливаются.' },
        { type: 'heading', value: 'Проблема бесконечного retry' },
        { type: 'code', language: 'java', value: '// ПЛОХО: nack с requeue=true без ограничения\n// Сообщение с ошибкой будет крутиться бесконечно!\n//\n// try {\n//     processMessage(msg);\n//     channel.basicAck(tag, false);\n// } catch (Exception e) {\n//     channel.basicNack(tag, false, true); // requeue = БЕСКОНЕЧНЫЙ ЦИКЛ!\n// }\n//\n// Сообщение: [очередь] -> [consumer] -> [ошибка] -> [очередь] -> ...\n// Это УБЬЁТ RabbitMQ и consumer\n\n// ПРАВИЛЬНО: ограниченное количество retry\n// Используйте header x-death для подсчёта попыток\n//\n// Map<String, Object> headers = msg.getProperties().getHeaders();\n// List<Map<String, Object>> xDeath = (List) headers.get("x-death");\n// int retryCount = (xDeath != null) ? xDeath.size() : 0;\n//\n// if (retryCount < MAX_RETRIES) {\n//     // Отправить в retry queue с TTL\n// } else {\n//     // Отправить в DLQ — ручной разбор\n// }' },
        { type: 'heading', value: 'Exponential Backoff' },
        { type: 'code', language: 'java', value: '// Exponential Backoff: увеличиваем задержку с каждой попыткой\nimport java.util.*;\n\npublic class RetryBackoff {\n    static final int MAX_RETRIES = 5;\n\n    static long getDelay(int attempt) {\n        // Exponential: 1s, 2s, 4s, 8s, 16s\n        return (long) Math.pow(2, attempt) * 1000;\n    }\n\n    static long getDelayWithJitter(int attempt) {\n        // Exponential + Jitter: добавляем случайность\n        long base = (long) Math.pow(2, attempt) * 1000;\n        long jitter = new Random().nextInt((int)(base * 0.3)); // ±30%\n        return base + jitter;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Exponential Backoff:");\n        for (int i = 0; i < MAX_RETRIES; i++) {\n            System.out.println("  Попытка " + (i+1) + ": задержка " + getDelay(i) + "ms");\n        }\n        System.out.println("  Попытка " + (MAX_RETRIES+1) + ": -> Dead Letter Queue");\n\n        System.out.println("\\nС Jitter (случайность предотвращает thundering herd):");\n        for (int i = 0; i < MAX_RETRIES; i++) {\n            System.out.println("  Попытка " + (i+1) + ": задержка ~"\n                + getDelayWithJitter(i) + "ms");\n        }\n    }\n}' },
        { type: 'heading', value: 'Retry через отдельные очереди' },
        { type: 'code', language: 'java', value: '// Паттерн: отдельная retry queue для каждого уровня задержки\n//\n// [main-queue] -> consumer обрабатывает\n//     |-- успех: ACK\n//     |-- ошибка (попытка 1): -> [retry-1s-queue] (TTL=1s, DLX=main)\n//     |-- ошибка (попытка 2): -> [retry-5s-queue] (TTL=5s, DLX=main)\n//     |-- ошибка (попытка 3): -> [retry-30s-queue] (TTL=30s, DLX=main)\n//     |-- ошибка (попытка 4+): -> [dead-letter-queue] (ручной разбор)\n//\n// Каждая retry queue:\n// - Имеет свой TTL (задержка перед повторной попыткой)\n// - DLX указывает обратно на main exchange\n// - Никто НЕ читает из retry queues — сообщения ждут TTL\n//\n// Преимущества:\n// - Нет бесконечных циклов\n// - Экспоненциальная задержка\n// - Основная очередь не блокируется проблемными сообщениями\n// - DLQ для окончательно проблемных сообщений' },
        { type: 'list', value: [
          'Immediate Retry: nack с requeue=true — только для transient ошибок',
          'Fixed Delay: одинаковая задержка между попытками (1s, 1s, 1s)',
          'Exponential Backoff: растущая задержка (1s, 2s, 4s, 8s)',
          'Exponential + Jitter: backoff с рандомизацией (предотвращает thundering herd)',
          'Circuit Breaker: после N ошибок прекращаем попытки на время'
        ] },
        { type: 'warning', value: 'Thundering Herd — ситуация когда после сбоя тысячи retry-ов происходят одновременно и снова кладут систему. Jitter (случайная задержка) распределяет retry-и во времени.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Work Queue с retry',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Work Queue с несколькими workers и retry-стратегией с exponential backoff. Провальные сообщения после 3 попыток попадают в DLQ.',
      requirements: [
        'Класс WorkQueue с очередью задач, retry очередью и DLQ',
        'Несколько worker-ов обрабатывают задачи из очереди',
        'Если задача содержит "FAIL" — обработка считается неудачной',
        'Retry с exponential backoff: 3 попытки (задержки 1s, 2s, 4s)',
        'После 3 неудачных попыток — сообщение в DLQ',
        'Вывести статистику: обработано, retry, в DLQ'
      ],
      hint: 'Используйте Map для хранения количества попыток каждого сообщения. При ошибке увеличивайте счётчик и возвращайте в очередь если попытки не исчерпаны.',
      expectedOutput: '=== Work Queue с Retry ===\n\n[Worker-1] Обработал: Задача-1 (OK)\n[Worker-2] Обработал: Задача-2 (OK)\n[Worker-1] Задача FAIL-3: ошибка! Попытка 1/3, retry через 1s\n[Worker-2] Обработал: Задача-4 (OK)\n[Worker-1] Задача FAIL-3: ошибка! Попытка 2/3, retry через 2s\n[Worker-1] Задача FAIL-3: ошибка! Попытка 3/3 -> DLQ\n[Worker-2] Обработал: Задача-5 (OK)\n\nСтатистика:\n  Обработано успешно: 4\n  Отправлено в DLQ: 1\n  Dead Letter Queue: [FAIL-3]',
      solution: `import java.util.*;

public class Main {
    static LinkedList<String> queue = new LinkedList<>();
    static List<String> dlq = new ArrayList<>();
    static Map<String, Integer> retryCount = new HashMap<>();
    static int maxRetries = 3;
    static int processed = 0;
    static int workerIdx = 0;

    static String getWorker() {
        workerIdx = 1 - workerIdx;
        return "Worker-" + (workerIdx + 1);
    }

    static boolean processTask(String task) {
        return !task.startsWith("FAIL");
    }

    static void handleTask() {
        if (queue.isEmpty()) return;
        String task = queue.poll();
        String worker = getWorker();

        if (processTask(task)) {
            processed++;
            System.out.println("[" + worker + "] Обработал: " + task + " (OK)");
        } else {
            int attempt = retryCount.getOrDefault(task, 0) + 1;
            retryCount.put(task, attempt);

            if (attempt >= maxRetries) {
                dlq.add(task);
                int delay = (int) Math.pow(2, attempt - 1);
                System.out.println("[" + worker + "] Задача " + task
                    + ": ошибка! Попытка " + attempt + "/" + maxRetries + " -> DLQ");
            } else {
                int delay = (int) Math.pow(2, attempt - 1);
                System.out.println("[" + worker + "] Задача " + task
                    + ": ошибка! Попытка " + attempt + "/" + maxRetries
                    + ", retry через " + delay + "s");
                queue.add(task);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Work Queue с Retry ===\\n");

        queue.add("Задача-1");
        queue.add("Задача-2");
        queue.add("FAIL-3");
        queue.add("Задача-4");
        queue.add("Задача-5");

        while (!queue.isEmpty()) {
            handleTask();
        }

        System.out.println("\\nСтатистика:");
        System.out.println("  Обработано успешно: " + processed);
        System.out.println("  Отправлено в DLQ: " + dlq.size());
        System.out.println("  Dead Letter Queue: " + dlq);
    }
}`,
      explanation: 'Work Queue распределяет задачи между workers. При ошибке используется retry с exponential backoff — задержка увеличивается с каждой попыткой. После исчерпания попыток сообщение попадает в Dead Letter Queue для ручного анализа. Это стандартный паттерн обработки ошибок в RabbitMQ production-системах.'
    },
    {
      id: 7,
      title: 'Практика: Полная система маршрутизации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему логирования с маршрутизацией: разные уровни логов направляются в разные обработчики через Topic Exchange с wildcards.',
      requirements: [
        'Topic Exchange с поддержкой wildcards (* и #)',
        'Routing keys формата: service.level (auth.error, payment.info)',
        'AlertHandler подписан на *.error (все ошибки)',
        'AuthMonitor подписан на auth.# (всё от auth сервиса)',
        'Logger подписан на # (абсолютно всё)',
        'PaymentAuditor подписан на payment.* (всё от payment)',
        'Отправить 5 сообщений и показать кто что получил'
      ],
      hint: 'Для matching wildcard: разбейте routing key и pattern по точке. * матчит ровно один сегмент, # матчит 0+ сегментов. Используйте рекурсию для matching.',
      expectedOutput: '=== Topic Exchange: Система логирования ===\n\nBindings:\n  AlertHandler  <- *.error\n  AuthMonitor   <- auth.#\n  Logger        <- #\n  PaymentAuditor <- payment.*\n\nPublish: auth.error -> "Неверный пароль"\n  -> [AlertHandler, AuthMonitor, Logger]\nPublish: auth.info -> "Пользователь вошёл"\n  -> [AuthMonitor, Logger]\nPublish: payment.error -> "Карта отклонена"\n  -> [AlertHandler, Logger, PaymentAuditor]\nPublish: payment.info -> "Платёж $50"\n  -> [Logger, PaymentAuditor]\nPublish: order.info -> "Заказ создан"\n  -> [Logger]\n\nИтого получено:\n  AlertHandler: 2 сообщения\n  AuthMonitor: 2 сообщения\n  Logger: 5 сообщений\n  PaymentAuditor: 2 сообщения',
      solution: `import java.util.*;

public class Main {
    static Map<String, String> bindings = new LinkedHashMap<>();
    static Map<String, List<String>> received = new LinkedHashMap<>();

    static void bind(String consumer, String pattern) {
        bindings.put(consumer, pattern);
        received.put(consumer, new ArrayList<>());
    }

    static boolean topicMatch(String routingKey, String pattern) {
        String[] keyParts = routingKey.split("\\\\.");
        String[] patternParts = pattern.split("\\\\.");
        return matchParts(keyParts, 0, patternParts, 0);
    }

    static boolean matchParts(String[] key, int ki, String[] pattern, int pi) {
        if (pi == pattern.length && ki == key.length) return true;
        if (pi == pattern.length) return false;

        if (pattern[pi].equals("#")) {
            if (pi == pattern.length - 1) return true;
            for (int i = ki; i <= key.length; i++) {
                if (matchParts(key, i, pattern, pi + 1)) return true;
            }
            return false;
        }

        if (ki == key.length) return false;

        if (pattern[pi].equals("*") || pattern[pi].equals(key[ki])) {
            return matchParts(key, ki + 1, pattern, pi + 1);
        }

        return false;
    }

    static List<String> publish(String routingKey, String message) {
        List<String> targets = new ArrayList<>();
        for (Map.Entry<String, String> entry : bindings.entrySet()) {
            if (topicMatch(routingKey, entry.getValue())) {
                targets.add(entry.getKey());
                received.get(entry.getKey()).add(message);
            }
        }
        return targets;
    }

    public static void main(String[] args) {
        System.out.println("=== Topic Exchange: Система логирования ===\\n");

        bind("AlertHandler", "*.error");
        bind("AuthMonitor", "auth.#");
        bind("Logger", "#");
        bind("PaymentAuditor", "payment.*");

        System.out.println("Bindings:");
        for (Map.Entry<String, String> e : bindings.entrySet()) {
            System.out.println("  " + e.getKey() + "  <- " + e.getValue());
        }
        System.out.println();

        String[][] messages = {
            {"auth.error", "Неверный пароль"},
            {"auth.info", "Пользователь вошёл"},
            {"payment.error", "Карта отклонена"},
            {"payment.info", "Платёж $50"},
            {"order.info", "Заказ создан"}
        };

        for (String[] msg : messages) {
            List<String> targets = publish(msg[0], msg[1]);
            System.out.println("Publish: " + msg[0] + " -> \\"" + msg[1] + "\\"");
            System.out.println("  -> " + targets);
        }

        System.out.println("\\nИтого получено:");
        for (Map.Entry<String, List<String>> e : received.entrySet()) {
            System.out.println("  " + e.getKey() + ": " + e.getValue().size() + " сообщения");
        }
    }
}`,
      explanation: 'Topic Exchange реализует pattern matching с wildcards. * совпадает с одним словом, # с нулём или более словами. Рекурсивный алгоритм проверяет совпадение сегментов routing key и pattern. Это самый гибкий тип Exchange в RabbitMQ, позволяющий строить сложные системы маршрутизации без изменения producer-ов.'
    }
  ]
}
